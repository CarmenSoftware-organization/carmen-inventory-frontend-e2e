import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SHOTS } from "./manifest";
import type { ShotSpec } from "./types";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";

const ASSETS_DIR =
  process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const RESULTS = join(process.cwd(), "tests/wiki-screenshots/last-run.json");
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
const DEFAULT_VIEWPORT = { width: 1440, height: 900 };

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

test("capture wiki screenshots", async ({ browser }) => {
  test.setTimeout(0); // batch job; individual gotos still time out at 30s

  // Group shots by role; defer dynamic routes that lack a seedId; guard against
  // two specs that would write the same output file (silent overwrite).
  const skipped: Record<string, string> = {};
  const claimedOutputs = new Map<string, string>(); // output file -> first spec.path that claimed it
  const byRole = new Map<string, ShotSpec[]>();
  const shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  for (const spec of shots) {
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

  for (const [role, specs] of byRole) {
    const context = await browser.newContext({
      storageState: authFile(emailForRole(role)),
      baseURL: BASE_URL,
      viewport: DEFAULT_VIEWPORT,
    });
    await setEnLocale(context, BASE_URL);
    const page = await context.newPage();
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.innerHTML =
        "*{transition:none!important;animation:none!important;caret-color:transparent!important}";
      document.documentElement.appendChild(style);
    });

    for (const spec of specs) {
      const url = resolvePath(spec);
      try {
        if (spec.viewport) await page.setViewportSize(spec.viewport);
        await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
        if (spec.waitFor) {
          await page.waitForSelector(spec.waitFor, { timeout: 15_000 });
        }
        // Let lazy content settle: wait for Tailwind skeleton placeholders to
        // clear so detail pages aren't captured mid-load. Best-effort.
        await page
          .waitForFunction(
            () => document.querySelectorAll(".animate-pulse").length === 0,
            { timeout: 8_000 },
          )
          .catch(() => {});
        const out = outputFile(spec);
        mkdirSync(dirname(out), { recursive: true });
        await page.screenshot({ path: out, fullPage: true });
      } catch (err) {
        skipped[spec.path] = (err as Error).message.split("\n")[0];
      } finally {
        if (spec.viewport) await page.setViewportSize(DEFAULT_VIEWPORT);
      }
    }
    await context.close();
  }

  writeFileSync(RESULTS, JSON.stringify(skipped, null, 2));
  console.log(
    `Captured ${SHOTS.length - Object.keys(skipped).length} screens; skipped ${Object.keys(skipped).length}.`,
  );

  const unexpected = Object.entries(skipped).filter(
    ([, reason]) => !reason.includes("seedId") && !reason.includes("collides"),
  );
  expect(
    unexpected,
    `Unexpected capture failures (not seedId/collision):\n${unexpected
      .map(([p, r]) => `  ${p} :: ${r}`)
      .join("\n")}`,
  ).toEqual([]);
});
