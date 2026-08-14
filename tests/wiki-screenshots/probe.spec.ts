import { test, expect, type Page } from "@playwright/test";
import { join } from "node:path";
import { SHOTS } from "./manifest";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";
import { contentRoot, decideOutcome, pageSignature, readHeadings } from "./signature";
import { saveRoleMatrix, ROLE_MATRIX_PATH } from "./role-matrix";
import { resolvePath } from "./shot-path";
import type { ProbeResult, ScreenOutcome, ShotSpec } from "./types";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
const VIEWPORT = { width: 1440, height: 1600 };
const PER_PAGE_TIMEOUT_MS = 30_000;

/**
 * Read the two signals `decideOutcome` needs, both scoped to the content
 * region so the app shell never votes on whether the page rendered.
 *
 * `innerText` (not `textContent`) is used on purpose: it is layout-aware, so a
 * hidden sr-only node or a rendered-but-empty toast container yields "" and
 * drops out instead of short-circuiting the check ahead of a real banner.
 *
 * The `[data-sonner-toaster]` exclusion is a defensive guard, not an observed
 * hit — a real 1,098-observation run matched it zero times, because `<Toaster/>`
 * mounts in `routes/app-root.tsx`, outside `#main-content`. It is kept for the
 * `body` fallback path (routes rendered outside the shell), where a toast
 * reporting one failed sub-request would otherwise be read as the page's own
 * outcome.
 */
async function classify(page: Page): Promise<{ outcome: ScreenOutcome; reason?: string }> {
  const root = await contentRoot(page);
  const headings = await readHeadings(root);
  const alerts = await root
    .locator('[role="alert"]')
    .evaluateAll((els) =>
      els
        .filter((el) => !el.closest("[data-sonner-toaster]"))
        .map((el) => (el as HTMLElement).innerText),
    )
    .catch(() => [] as string[]);
  return decideOutcome(headings, alerts);
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

    // A bounce to /login means the storageState is stale or the auth guard
    // rejected us — NOT that the page renders this way. Without this the
    // probe records "ok" plus the login page's signature, the "0 results
    // means auth broke" guard never fires, and capture would then shoot the
    // login page over the canonical unsuffixed wiki paths.
    if (/\/login\b/.test(new URL(page.url()).pathname)) {
      return { ...base, outcome: "error", reason: "redirected to login (stale auth state)" };
    }

    const { outcome, reason } = await classify(page);
    if (outcome !== "ok") return { ...base, outcome, reason };
    return { ...base, outcome: "ok", signature: await pageSignature(page) };
  } catch (err) {
    return { ...base, outcome: "error", reason: (err as Error).message.split("\n")[0] };
  }
}

/**
 * One spec per route.
 *
 * The manifest lists the 12 dialog-based config modules twice — once as a list
 * page, once with `interaction: "add-dialog"` — but both entries navigate to
 * the same URL, and the probe never opens the dialog. Without this the matrix
 * gets two identical observations per role for those routes (~108 wasted page
 * visits), which then makes `rolesToCapture()` return duplicate roles, capture
 * plan every job twice and self-collide, coverage double-count, and the
 * sitemap render every badge twice. First spec per path wins.
 */
function dedupeByRoute(shots: ShotSpec[]): ShotSpec[] {
  const seen = new Set<string>();
  const unique: ShotSpec[] = [];
  for (const spec of shots) {
    if (seen.has(spec.path)) continue;
    seen.add(spec.path);
    unique.push(spec);
  }
  return unique;
}

test("probe every route as every role", async ({ browser }) => {
  test.setTimeout(0); // batch job; per-page timeouts still apply

  const shots = dedupeByRoute(applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS)));
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
