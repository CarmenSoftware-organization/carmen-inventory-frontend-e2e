import { test, expect, type Page } from "@playwright/test";
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
 * Classify what a role actually got. Order matters: a denied page can also
 * render an empty table, so permission is checked before anything else.
 */
async function classify(page: Page): Promise<{ outcome: ScreenOutcome; reason?: string }> {
  const probes: Array<[ScreenOutcome, RegExp]> = [
    ["denied", /permission denied|forbidden|not authorized|403/i],
    ["not-found", /not found|404/i],
    ["error", /something went wrong|unexpected error/i],
  ];
  for (const [outcome, pattern] of probes) {
    const hit = page.getByText(pattern).first();
    if (await hit.isVisible().catch(() => false)) {
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
    await setEnLocale(context, BASE_URL);
    const page = await context.newPage();
    for (const spec of shots) {
      results.push(await probeOne(page, spec, user.role));
    }
    await context.close();
    const okCount = results.filter((r) => r.role === user.role && r.outcome === "ok").length;
    console.log(`${user.role}: ${okCount}/${shots.length} reachable`);
  }

  saveRoleMatrix(ROLE_MATRIX_PATH, results);
  console.log(`Wrote ${ROLE_MATRIX_PATH} (${results.length} observations)`);

  // A totally empty matrix means auth broke, not that the app has no pages.
  expect(
    results.filter((r) => r.outcome === "ok").length,
    "No role could reach any page — check that the setup project produced .auth/*.json",
  ).toBeGreaterThan(0);
});
