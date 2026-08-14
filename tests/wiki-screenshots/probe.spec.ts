import { test, expect, type Locator, type Page } from "@playwright/test";
import { join } from "node:path";
import { SHOTS } from "./manifest";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";
import { pageSignature } from "./signature";
import { saveRoleMatrix, ROLE_MATRIX_PATH } from "./role-matrix";
import { resolvePath } from "./shot-path";
import type { ProbeResult, ScreenOutcome, ShotSpec } from "./types";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
const VIEWPORT = { width: 1440, height: 1600 };
const PER_PAGE_TIMEOUT_MS = 30_000;

/**
 * True when a visible text match must NOT be trusted as a page-level
 * outcome. Two cases, both confirmed against the real app's DOM:
 *
 * 1. It lives inside sonner's toast container (`[data-sonner-toaster]`).
 *    Sonner mounts this only while a toast is active, and this app routes
 *    many non-permission API failures through it (see `api-error-toaster.tsx`
 *    — everything except 401/403, which already have their own dedicated UI).
 *    A toast reports one failed sub-request, not whether the page rendered.
 *
 * 2. Its nearest `[role="alert"]` ancestor has sibling elements. Verified
 *    live on three routes: the genuine "Permission Denied" block
 *    (`/config/extra-cost` as Requestor) and a genuine "X not found" block
 *    (`/config/department/:id` as Requestor) both use `AccessDeniedBlock`,
 *    which always renders as the SOLE child of its container (0 siblings) —
 *    it replaces the page's content outright. By contrast, the dashboard's
 *    "Failed to load saved widgets: business unit not found" is a `role
 *    ="alert"` `<p>` sitting next to a heading and an "+ Add" control inside
 *    `<section>` (1+ siblings): a widget-level load-error notice that
 *    coexists with an otherwise fully-rendered page, not a page failure.
 *    When no `[role="alert"]` ancestor exists at all, this check does not
 *    apply and the match is trusted as before.
 */
async function isSuppressedHit(hit: Locator): Promise<boolean> {
  return hit.evaluate((el) => {
    if (el.closest("[data-sonner-toaster]")) return true;
    const alertRoot = el.closest('[role="alert"]');
    if (!alertRoot) return false;
    const parent = alertRoot.parentElement;
    return !!parent && parent.children.length > 1;
  });
}

/**
 * Classify what a role actually got. Order matters: a denied page can also
 * render an empty table, so permission is checked before anything else.
 */
async function classify(page: Page): Promise<{ outcome: ScreenOutcome; reason?: string }> {
  const probes: Array<[ScreenOutcome, RegExp]> = [
    // Bare numeric codes are word-bounded: an unanchored /403/ or /404/ also
    // matches inside ordinary document numbers (PO-2024045, REQ-40412), which
    // would misclassify a perfectly reachable page as denied/not-found.
    ["denied", /permission denied|forbidden|not authorized|\b403\b/i],
    ["not-found", /not found|\b404\b/i],
    ["error", /something went wrong|unexpected error/i],
  ];
  for (const [outcome, pattern] of probes) {
    // Visible candidates only: an earlier DOM match that is a hidden sr-only
    // node or a rendered-but-hidden toast container must not short-circuit
    // the check ahead of the real, visible banner.
    const hit = page.getByText(pattern).filter({ visible: true }).first();
    if (await hit.isVisible().catch(() => false)) {
      if (await isSuppressedHit(hit).catch(() => false)) continue;
      const reason = (await hit.textContent().catch(() => null))?.trim().slice(0, 120);
      return { outcome, reason: reason || outcome };
    }
  }
  return { outcome: "ok" };
}

/** Visit one route as the current role and record what happened. Never throws. */
async function probeOne(page: Page, spec: ShotSpec, role: string): Promise<ProbeResult> {
  const base = { route: spec.path, role };
  if (spec.path.includes(":") && !spec.seedId) {
    return { ...base, outcome: "not-found", reason: "no seedId" };
  }
  try {
    await page.goto(resolvePath(spec), {
      waitUntil: "domcontentloaded",
      timeout: PER_PAGE_TIMEOUT_MS,
    });
    // Best-effort settle. Bounded on purpose: some tenants hold a websocket
    // open so "networkidle" never fires — do not block the whole matrix on it.
    await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
    await page
      .waitForFunction(() => document.querySelectorAll(".animate-pulse").length === 0, {
        timeout: 8_000,
      })
      .catch(() => {});

    const { outcome, reason } = await classify(page);
    if (outcome !== "ok") return { ...base, outcome, reason };
    return { ...base, outcome: "ok", signature: await pageSignature(page) };
  } catch (err) {
    return { ...base, outcome: "error", reason: (err as Error).message.split("\n")[0] };
  }
}

test("probe every route as every role", async ({ browser }) => {
  test.setTimeout(0); // batch job; per-page timeouts still apply

  const shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  const results: ProbeResult[] = [];

  // One context per role, not per page: creating a context is far more
  // expensive than a goto, and storageState is per-role anyway.
  for (const user of TEST_USERS) {
    const context = await browser.newContext({
      storageState: authFile(user.email),
      baseURL: BASE_URL,
      viewport: VIEWPORT,
    });
    try {
      await setEnLocale(context, BASE_URL);
      const page = await context.newPage();
      for (const spec of shots) {
        results.push(await probeOne(page, spec, user.role));
      }
    } finally {
      // Always close, even if setEnLocale/newPage/a probe throws, so a
      // mid-run failure never leaks the browser context.
      await context.close();
    }
    const okCount = results.filter((r) => r.role === user.role && r.outcome === "ok").length;
    console.log(`${user.role}: ${okCount}/${shots.length} reachable`);
    // Persist after every role, not just at the end: if a later role's
    // context setup throws, the earlier roles' ~20 minutes of observations
    // are still on disk instead of discarded with nothing to show for it.
    saveRoleMatrix(ROLE_MATRIX_PATH, results);
  }

  console.log(`Wrote ${ROLE_MATRIX_PATH} (${results.length} observations)`);

  // A totally empty matrix means auth broke, not that the app has no pages.
  expect(
    results.filter((r) => r.outcome === "ok").length,
    "No role could reach any page — check that the setup project produced .auth/*.json",
  ).toBeGreaterThan(0);
});
