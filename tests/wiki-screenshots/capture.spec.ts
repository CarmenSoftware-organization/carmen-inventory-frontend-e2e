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
import { loadRoleMatrix, ROLE_MATRIX_PATH, baselineFor, rolesToCapture } from "./role-matrix";
import { resolvePath, outputFile } from "./shot-path";
import { ConfigListPage } from "../pages/config-list.page";

const ASSETS_DIR =
  process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const RESULTS = join(process.cwd(), "tests/wiki-screenshots/last-run.json");
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
// Tall desktop viewport: width drives responsive layout; the extra height lets a
// bounded (non-fullPage) screenshot show most of a detail form. fullPage is
// avoided because data-heavy pages produce enormous images that hang Playwright.
const DEFAULT_VIEWPORT = { width: 1440, height: 1600 };
const HARD_TIMEOUT_MS = 60_000;

/** One planned screenshot: a spec shot as a specific role, to a specific file. */
type CaptureJob = { spec: ShotSpec; role: string; out: string };

function emailForRole(role: string): string {
  const user = TEST_USERS.find((u) => u.role === role);
  if (!user) throw new Error(`No test user defined for role "${role}"`);
  return user.email;
}

/** Navigate to one spec and write its screenshot. Throws on any failure. */
async function captureOne(page: Page, spec: ShotSpec, out: string): Promise<void> {
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
  // Open the module's add dialog when the spec asks for it. Every config module
  // built on DialogCrudHelper opens it the same way, so no per-module recipe.
  if (spec.interaction === "add-dialog") {
    const list = new ConfigListPage(page, spec.path);
    await list.addButton().click({ timeout: 10_000 });
    await page.locator('[data-slot="dialog-content"]').waitFor({ state: "visible", timeout: 10_000 });
    // Let the dialog's open animation finish before shooting.
    await page.waitForTimeout(300);
  }
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage: false, animations: "disabled", timeout: 20_000 });
}

/**
 * Turn the probe matrix into a capture plan: the baseline role for every
 * reachable route, plus each role whose screen genuinely differs.
 */
function planJobs(shots: ShotSpec[], skipped: Record<string, string>): CaptureJob[] {
  const matrix = loadRoleMatrix(ROLE_MATRIX_PATH);
  const jobs: CaptureJob[] = [];
  const claimed = new Map<string, string>(); // output file -> first route that claimed it

  for (const spec of shots) {
    const base = baselineFor(matrix, spec.path);
    if (!base) {
      skipped[spec.path] = "no role could reach this page";
      continue;
    }
    for (const role of [base.role, ...rolesToCapture(matrix, spec.path)]) {
      const out = outputFile(ASSETS_DIR, spec, role, base.role);
      const owner = claimed.get(out);
      if (owner) {
        // Role-scoped key: a collision on one role must not mark the whole
        // route as skipped when another role's job for it still ran.
        skipped[`${spec.path} [${role}]`] = `output path collides with ${owner} (${out})`;
        continue;
      }
      claimed.set(out, spec.path);
      jobs.push({ spec, role, out });
    }
  }
  return jobs;
}

/** Escape hatch: WIKI_CAPTURE_EMAIL shoots everything as one user, matrix ignored. */
function planSingleUserJobs(shots: ShotSpec[], skipped: Record<string, string>): CaptureJob[] {
  const jobs: CaptureJob[] = [];
  const claimed = new Map<string, string>();
  for (const spec of shots) {
    const out = outputFile(ASSETS_DIR, spec, "override", "override");
    const owner = claimed.get(out);
    if (owner) {
      skipped[`${spec.path} [override]`] = `output path collides with ${owner} (${out})`;
      continue;
    }
    claimed.set(out, spec.path);
    jobs.push({ spec, role: "override", out });
  }
  return jobs;
}

test("capture wiki screenshots", async ({ browser }) => {
  test.setTimeout(0); // batch job; individual gotos still time out at 30s

  const skipped: Record<string, string> = {};
  let shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  // WIKI_CAPTURE_DETAIL_ONLY captures just the dynamic (detail) routes, skipping
  // data-heavy static list pages whose screenshot can be enormous.
  if (process.env.WIKI_CAPTURE_DETAIL_ONLY) shots = shots.filter((s) => s.path.includes(":"));
  for (const spec of shots) {
    if (spec.path.includes(":") && !spec.seedId) skipped[spec.path] = "dynamic route without seedId";
  }
  const shootable = shots.filter((s) => !skipped[s.path]);

  const overrideState = process.env.WIKI_CAPTURE_EMAIL ? await ensureCaptureState(BASE_URL) : null;
  const jobs = overrideState
    ? planSingleUserJobs(shootable, skipped)
    : planJobs(shootable, skipped);

  let failures = 0; // jobs that threw during capture, not route/collision-level skips

  // Group by role so each browser context is built once.
  const byRole = new Map<string, CaptureJob[]>();
  for (const job of jobs) {
    const list = byRole.get(job.role) ?? [];
    list.push(job);
    byRole.set(job.role, list);
  }

  for (const [role, roleJobs] of byRole) {
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

    // Fresh page per job + a hard timeout: if a page wedges (heavy grids,
    // pegged main thread), abandon it and move on rather than hang the batch.
    for (const job of roleJobs) {
      const page = await context.newPage();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          captureOne(page, job.spec, job.out),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("hard timeout after 60s")), HARD_TIMEOUT_MS);
          }),
        ]);
      } catch (err) {
        skipped[`${job.spec.path} [${job.role}]`] = (err as Error).message.split("\n")[0];
        failures++;
      } finally {
        if (timer) clearTimeout(timer);
        await Promise.race([page.close(), new Promise((res) => setTimeout(res, 5_000))]).catch(() => {});
      }
    }
    await context.close();
  }

  writeFileSync(RESULTS, JSON.stringify(skipped, null, 2));
  console.log(`Captured ${jobs.length - failures} screens; skipped ${Object.keys(skipped).length}.`);

  // Expected/benign skips: missing seedId, output collision, a page nobody can
  // reach, or a known heavy page that timed out. Anything else fails loudly.
  const unexpected = Object.entries(skipped).filter(
    ([, reason]) =>
      !reason.includes("seedId") &&
      !reason.includes("collides") &&
      !reason.includes("no role could reach") &&
      !/timeout|exceeded/i.test(reason),
  );
  expect(
    unexpected,
    `Unexpected capture failures:\n${unexpected.map(([p, r]) => `  ${p} :: ${r}`).join("\n")}`,
  ).toEqual([]);
});
