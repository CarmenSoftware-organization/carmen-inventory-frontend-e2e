import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SHOTS } from "./manifest";
import type { ShotSpec } from "./types";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";
import { ensureCaptureState } from "./capture-user";

const ASSETS_DIR =
  process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const RESULTS = join(process.cwd(), "tests/wiki-screenshots/last-run.json");
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
// Tall desktop viewport: width drives responsive layout; the extra height lets a
// bounded (non-fullPage) screenshot show most of a detail form. fullPage is
// avoided because data-heavy pages (spot-check/physical-count grids, long lists)
// produce enormous images that hang Playwright's screenshot.
const DEFAULT_VIEWPORT = { width: 1440, height: 1600 };

function emailForRole(role: string): string {
  const user = TEST_USERS.find((u) => u.role === role);
  if (!user) throw new Error(`No test user defined for role "${role}"`);
  return user.email;
}

function resolvePath(spec: ShotSpec): string {
  return spec.seedId
    ? spec.path.replace(/\/:[A-Za-z_]+/g, `/${spec.seedId}`)
    : spec.path;
}

function outputFile(spec: ShotSpec): string {
  return join(ASSETS_DIR, spec.module, `${spec.slug}.png`);
}

/** Navigate to one spec and write its screenshot. Throws on any failure. */
async function captureOne(page: Page, spec: ShotSpec): Promise<void> {
  await page.goto(resolvePath(spec), { waitUntil: "domcontentloaded", timeout: 30_000 });
  // Best-effort network settle. Bounded on purpose: some tenants keep a
  // websocket/polling open so "networkidle" never fires — don't block on it.
  await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
  if (spec.waitFor) await page.waitForSelector(spec.waitFor, { timeout: 15_000 });
  // Let lazy content settle: wait for Tailwind skeleton placeholders to clear.
  await page
    .waitForFunction(() => document.querySelectorAll(".animate-pulse").length === 0, { timeout: 8_000 })
    .catch(() => {});
  // Dismiss a blocking permission/error alertdialog (e.g. a 403 on a secondary
  // sub-resource) so the underlying page is captured, not the modal.
  const blockedNotice = page.getByText(/permission denied|something went wrong/i).first();
  if (await blockedNotice.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /^(close|ok|got it|dismiss)$/i }).first().click({ timeout: 2_000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
  const out = outputFile(spec);
  mkdirSync(dirname(out), { recursive: true });
  // Bounded viewport capture (not fullPage): data-heavy pages produce enormous
  // full-page images that hang Playwright's screenshot.
  await page.screenshot({ path: out, fullPage: false, animations: "disabled", timeout: 20_000 });
}

test("capture wiki screenshots", async ({ browser }) => {
  test.setTimeout(0); // batch job; individual gotos still time out at 30s

  // Group shots by role; defer dynamic routes that lack a seedId; guard against
  // two specs that would write the same output file (silent overwrite).
  const skipped: Record<string, string> = {};
  const claimedOutputs = new Map<string, string>(); // output file -> first spec.path that claimed it
  const byRole = new Map<string, ShotSpec[]>();
  const shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  // When WIKI_CAPTURE_EMAIL is set, capture every spec as that single user
  // (e.g. a tenant whose BU has data) instead of the per-role TEST_USERS state.
  const overrideState = process.env.WIKI_CAPTURE_EMAIL ? await ensureCaptureState(BASE_URL) : null;
  // WIKI_CAPTURE_DETAIL_ONLY captures just the dynamic (detail) routes, skipping
  // data-heavy static list pages whose full-page screenshot can be enormous.
  const detailOnly = !!process.env.WIKI_CAPTURE_DETAIL_ONLY;
  for (const spec of shots) {
    if (detailOnly && !spec.path.includes(":")) continue;
    if (spec.path.includes(":") && !spec.seedId) {
      skipped[spec.path] = "dynamic route without seedId";
      continue;
    }
    const out = outputFile(spec);
    const owner = claimedOutputs.get(out);
    if (owner) {
      skipped[spec.path] = `output path collides with ${owner} (${spec.module}/${spec.slug}.png)`;
      continue;
    }
    claimedOutputs.set(out, spec.path);
    const role = spec.role ?? "Admin";
    const list = byRole.get(role) ?? [];
    list.push(spec);
    byRole.set(role, list);
  }

  const HARD_TIMEOUT_MS = 60_000; // per-spec wall-clock cap so one bad page can't hang the run
  for (const [role, specs] of byRole) {
    const context = await browser.newContext({
      storageState: overrideState ?? authFile(emailForRole(role)),
      baseURL: BASE_URL,
      viewport: DEFAULT_VIEWPORT,
    });
    await setEnLocale(context, BASE_URL);
    await context.addInitScript(() => {
      const style = document.createElement("style");
      style.innerHTML =
        "*{transition:none!important;animation:none!important;caret-color:transparent!important}";
      document.documentElement.appendChild(style);
    });

    // Fresh page per spec + a hard timeout: if a page wedges (heavy grids,
    // pegged main thread), abandon it (close) and move on rather than hang.
    for (const spec of specs) {
      const page = await context.newPage();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          captureOne(page, spec),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("hard timeout after 60s")), HARD_TIMEOUT_MS);
          }),
        ]);
      } catch (err) {
        skipped[spec.path] = (err as Error).message.split("\n")[0];
      } finally {
        if (timer) clearTimeout(timer);
        await Promise.race([
          page.close(),
          new Promise((res) => setTimeout(res, 5_000)),
        ]).catch(() => {});
      }
    }
    await context.close();
  }

  writeFileSync(RESULTS, JSON.stringify(skipped, null, 2));
  console.log(
    `Captured ${SHOTS.length - Object.keys(skipped).length} screens; skipped ${Object.keys(skipped).length}.`,
  );

  // Expected/benign skips: missing seedId, output collision, or a known heavy
  // page that exceeded the per-spec timeout. Anything else fails the run loudly.
  const unexpected = Object.entries(skipped).filter(
    ([, reason]) =>
      !reason.includes("seedId") && !reason.includes("collides") && !/timeout|exceeded/i.test(reason),
  );
  expect(
    unexpected,
    `Unexpected capture failures (not seedId/collision/timeout):\n${unexpected
      .map(([p, r]) => `  ${p} :: ${r}`)
      .join("\n")}`,
  ).toEqual([]);
});
