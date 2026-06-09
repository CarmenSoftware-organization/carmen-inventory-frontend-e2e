// Discover a real, VALIDATED record id (seedId) for each dynamic manifest route.
// For each route group it loads the list page, gathers candidate ids from the
// entity-matched JSON responses, then confirms a candidate by opening the detail
// page and checking it renders (no permission/error notice, not stuck loading).
// Captures as the WIKI_CAPTURE_EMAIL user (default admin@blueledgers.com).
//
// Output: tests/wiki-screenshots/seed-ids.json  ({ "<route>": "<id>" })
// Run: bun run tests/wiki-screenshots/discover-seeds.ts
import { chromium, type Page, type Response } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { SHOTS } from "./manifest";
import { ensureCaptureState, captureEmail } from "./capture-user";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

/** Truncate a route at its first dynamic segment: "/a/b/:id/c" -> "/a/b". */
export function loadPathFor(route: string): string {
  const i = route.indexOf("/:");
  return i === -1 ? route : route.slice(0, i);
}

/** The entity noun a detail route hangs off: the last static segment of the load path. */
export function entityFor(route: string): string {
  const segs = loadPathFor(route).split("/").filter(Boolean);
  return segs[segs.length - 1] ?? "";
}

/** True if an API path references the entity (handles simple + y->ies plurals). */
export function pathMatchesEntity(path: string, entity: string): boolean {
  const p = path.toLowerCase();
  const e = entity.toLowerCase();
  return p.includes(e) || p.includes(e.replace(/y$/, "ies")) || p.includes(e.replace(/y$/, ""));
}

/** Depth-first: collect every value found at a key named "id" (string/number). */
export function collectIds(json: unknown): string[] {
  const ids: string[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const id = o.id;
      if ((typeof id === "string" && /^[0-9a-f-]{20,}$/i.test(id)) || typeof id === "number") {
        ids.push(String(id));
      }
      Object.values(o).forEach(walk);
    }
  };
  walk(json);
  return [...new Set(ids)];
}

/** Substitute the first dynamic segment of a route with an id. */
function detailUrl(route: string, id: string): string {
  return route.replace(/\/:[A-Za-z_]+/, `/${id}`);
}

const ERROR_RE = /permission denied|something went wrong|failed to (fetch|load)|not found or access denied/i;

/** Load a detail URL and report whether it rendered a real record (not error/stuck). */
async function detailRenders(page: Page, url: string): Promise<boolean> {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  } catch {
    return false;
  }
  await page
    .waitForFunction(() => document.querySelectorAll(".animate-pulse").length === 0, { timeout: 8_000 })
    .catch(() => {});
  // Dismiss a benign permission modal over otherwise-loaded content.
  const notice = page.getByText(ERROR_RE).first();
  if (await notice.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: /^(close|ok|got it|dismiss)$/i }).first().click({ timeout: 1_500 }).catch(() => {});
    await page.waitForTimeout(400);
  }
  // After dismissing, a still-present hard error means the id is bad.
  if (await page.getByText(ERROR_RE).first().isVisible().catch(() => false)) return false;
  // A page still full of skeletons never resolved.
  const skeletons = await page.locator(".animate-pulse").count().catch(() => 0);
  return skeletons <= 3;
}

async function discoverForGroup(
  page: Page,
  loadPath: string,
  entity: string,
  sampleRoute: string,
): Promise<string | null> {
  const candidates: string[] = [];
  const handler = async (res: Response) => {
    if (!(res.headers()["content-type"] ?? "").includes("application/json")) return;
    if (!pathMatchesEntity(new URL(res.url()).pathname, entity)) return;
    try {
      candidates.push(...collectIds(await res.json()));
    } catch {
      /* ignore */
    }
  };
  page.on("response", handler);
  await page.goto(loadPath, { waitUntil: "networkidle", timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1200);
  page.off("response", handler);

  for (const id of [...new Set(candidates)].slice(0, 6)) {
    if (await detailRenders(page, detailUrl(sampleRoute, id))) return id;
  }
  return null;
}

async function main(): Promise<void> {
  // loadPath -> { entity, sampleRoute (shortest dynamic route in the group) }
  const groups = new Map<string, { entity: string; sampleRoute: string }>();
  for (const s of SHOTS) {
    if (!s.path.includes("/:")) continue;
    const lp = loadPathFor(s.path);
    const cur = groups.get(lp);
    if (!cur || s.path.length < cur.sampleRoute.length) {
      groups.set(lp, { entity: entityFor(s.path), sampleRoute: cur ? (s.path.length < cur.sampleRoute.length ? s.path : cur.sampleRoute) : s.path });
    }
  }

  const browser = await chromium.launch();
  const { hostname } = new URL(BASE_URL);
  const context = await browser.newContext({
    storageState: await ensureCaptureState(BASE_URL),
    baseURL: BASE_URL,
  });
  await context.addCookies([{ name: "NEXT_LOCALE", value: "en", domain: hostname, path: "/" }]);
  const page = await context.newPage();
  console.log(`Discovering as ${captureEmail()}`);

  const idByLoadPath = new Map<string, string>();
  for (const [loadPath, { entity, sampleRoute }] of groups) {
    const id = await discoverForGroup(page, loadPath, entity, sampleRoute);
    console.log(`${id ? "OK " : "-- "} ${loadPath}  (entity=${entity})  ->  ${id ?? "no valid id"}`);
    if (id) idByLoadPath.set(loadPath, id);
  }
  await browser.close();

  const seedIds: Record<string, string> = {};
  for (const s of SHOTS) {
    if (!s.path.includes("/:")) continue;
    const id = idByLoadPath.get(loadPathFor(s.path));
    if (id) seedIds[s.path] = id;
  }

  const out = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
  writeFileSync(out, JSON.stringify(seedIds, null, 2) + "\n");
  const dyn = SHOTS.filter((s) => s.path.includes("/:")).length;
  console.log(`\nWrote ${out}: ${Object.keys(seedIds).length}/${dyn} dynamic routes resolved.`);
}

// @ts-expect-error import.meta.main is a Bun-specific CLI guard; tsc uses commonjs module mode
if (import.meta.main) main();
