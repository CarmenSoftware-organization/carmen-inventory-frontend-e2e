// Discover a real record id (seedId) for each dynamic manifest route by loading
// the route's list page as Admin and reading the id from the backend JSON
// response whose URL matches the route's entity noun. Entity matching avoids
// grabbing unrelated ids (user profile, business units). Recursion handles
// paginated wrappers (records nested under data[].data[]).
//
// Output: tests/wiki-screenshots/seed-ids.json  ({ "<route>": "<id>" })
// Run: bun run tests/wiki-screenshots/discover-seeds.ts
import { chromium, type Page, type Response } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { authFile } from "../fixtures/auth.paths";
import { SHOTS } from "./manifest";

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

/** Depth-first: return the first value found at a key named "id" (string/number). */
export function firstId(json: unknown): string | null {
  if (Array.isArray(json)) {
    for (const v of json) {
      const r = firstId(v);
      if (r) return r;
    }
    return null;
  }
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    if (typeof obj.id === "string" && obj.id) return obj.id;
    if (typeof obj.id === "number") return String(obj.id);
    for (const v of Object.values(obj)) {
      const r = firstId(v);
      if (r) return r;
    }
  }
  return null;
}

/** True if an API path references the entity (handles simple + y->ies plurals). */
export function pathMatchesEntity(path: string, entity: string): boolean {
  const p = path.toLowerCase();
  const e = entity.toLowerCase();
  return p.includes(e) || p.includes(e.replace(/y$/, "ies")) || p.includes(e.replace(/y$/, ""));
}

async function discoverForGroup(page: Page, loadPath: string, entity: string): Promise<string | null> {
  const candidates: string[] = [];
  const handler = async (res: Response) => {
    if (!(res.headers()["content-type"] ?? "").includes("application/json")) return;
    const path = new URL(res.url()).pathname;
    if (!pathMatchesEntity(path, entity)) return; // entity-matched responses only
    try {
      const id = firstId(await res.json());
      if (id) candidates.push(id);
    } catch {
      /* ignore non-JSON */
    }
  };
  page.on("response", handler);
  try {
    await page.goto(loadPath, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1500);
  } catch {
    /* fall through; candidates may still have arrived */
  }
  page.off("response", handler);
  return candidates[0] ?? null;
}

async function main(): Promise<void> {
  // Unique load paths among dynamic routes, with their entity noun.
  const groups = new Map<string, string>(); // loadPath -> entity
  for (const s of SHOTS) {
    if (!s.path.includes("/:")) continue;
    groups.set(loadPathFor(s.path), entityFor(s.path));
  }

  const browser = await chromium.launch();
  const { hostname } = new URL(BASE_URL);
  const context = await browser.newContext({
    storageState: authFile("admin@blueledgers.com"),
    baseURL: BASE_URL,
  });
  await context.addCookies([{ name: "NEXT_LOCALE", value: "en", domain: hostname, path: "/" }]);
  const page = await context.newPage();

  const idByLoadPath = new Map<string, string>();
  for (const [loadPath, entity] of groups) {
    const id = await discoverForGroup(page, loadPath, entity);
    console.log(`${id ? "OK " : "-- "} ${loadPath}  (entity=${entity})  ->  ${id ?? "no id"}`);
    if (id) idByLoadPath.set(loadPath, id);
  }
  await browser.close();

  // Map ids back to each dynamic route.
  const seedIds: Record<string, string> = {};
  for (const s of SHOTS) {
    if (!s.path.includes("/:")) continue;
    const id = idByLoadPath.get(loadPathFor(s.path));
    if (id) seedIds[s.path] = id;
  }

  const out = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
  writeFileSync(out, JSON.stringify(seedIds, null, 2) + "\n");
  console.log(`\nWrote ${out}: ${Object.keys(seedIds).length}/${SHOTS.filter((s) => s.path.includes("/:")).length} dynamic routes resolved.`);
}

// @ts-expect-error import.meta.main is a Bun-specific CLI guard; tsc uses commonjs module mode
if (import.meta.main) main();
