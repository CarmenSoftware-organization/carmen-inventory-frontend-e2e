/**
 * Match the frontend's routes against what the test suite covers.
 *
 * Three inputs, one verdict per module: routes come from the router
 * (see route-map.ts), specs declare the URLs they drive, and the hand-authored
 * catalogs in docs/test-cases/ declare theirs in a header block. Everything
 * here is pure so the matching rules can be exercised without a checkout of
 * the frontend; audit-coverage.ts does the file I/O.
 */
import type { RouteEntry } from "./route-map";

/**
 * Trailing segments that are an action on a record, not a module of their own.
 *
 * `/config/department/new` and `/config/department/:id` are the create and edit
 * screens OF the department module — folding them in is what makes "one row per
 * module" mean something. `list`, by contrast, is absent on purpose: `/report/list`
 * is a real module in this app, not a view of `/report`.
 */
const ACTION_SEGMENT = /^(?:new|edit|review|entry)$/;
const PARAM_SEGMENT = /^:/;

/** A spec file and the URLs it drives. */
export interface SpecCoverage {
  /** Base name, e.g. `010-department.spec.ts`. */
  file: string;
  /** URLs from the spec and from the page objects it imports. */
  urls: string[];
  /** URLs written in the spec file itself. */
  ownUrls: string[];
}

/** A hand-authored catalog and the module it documents. */
export interface CatalogInfo {
  /** Path relative to docs/test-cases/, e.g. `130-equipment.md`. */
  file: string;
  prefix: string;
  /** URL from the header block, e.g. `/operation-plan/equipment`. */
  url: string;
  /** `routes/...` path from the header block. */
  routeDir: string;
  /** Declared "Total test cases". */
  total: number;
}

export type CoverageStatus = "spec" | "catalog" | "none";

/** One row of COVERAGE.md: a module, its URLs, and who tests it. */
export interface CoverageRow {
  /** Canonical URL of the module, e.g. `/config/department`. */
  module: string;
  /** Route module directory under `routes/`. */
  moduleDir: string;
  /** Every route that belongs to this module, including `:id` / `new`. */
  urls: string[];
  /** True when every route of the module only redirects elsewhere. */
  redirectOnly: boolean;
  /** True for a section's index page (`/config`, `/dashboard`, `/procurement`). */
  isLanding: boolean;
  specs: string[];
  catalogs: string[];
  status: CoverageStatus;
}

/**
 * Drop trailing action and parameter segments: the URL of the module a route
 * belongs to. `/inventory-management/physical-count/:id/entry` -> the
 * physical-count module.
 */
export function collapseToModule(url: string): string {
  const segments = url.split("/").filter(Boolean);
  while (segments.length > 1) {
    const last = segments[segments.length - 1];
    if (PARAM_SEGMENT.test(last) || ACTION_SEGMENT.test(last)) segments.pop();
    else break;
  }
  return `/${segments.join("/")}`;
}

/** Longest common URL prefix of a set of module URLs, on segment boundaries. */
function commonPrefix(urls: string[]): string {
  const split = urls.map((u) => u.split("/").filter(Boolean));
  const first = split[0] ?? [];
  const out: string[] = [];
  for (let i = 0; i < first.length; i++) {
    if (split.every((s) => s[i] === first[i])) out.push(first[i]);
    else break;
  }
  return `/${out.join("/")}`;
}

/**
 * Group routes into modules.
 *
 * Collapsing by URL alone splits modules that share one route file: the three
 * `/system-admin/workflow/<doc-type>` URLs all render `workflow-doc-type.route`
 * and are one module. So a second pass re-joins module URLs that share a route
 * directory — but only when that directory is nested (`system-admin/workflow`),
 * never for a flat one like `accounting/`, where a single directory holds nine
 * genuinely separate modules.
 */
export function groupRoutesIntoModules(routes: RouteEntry[]): Map<string, RouteEntry[]> {
  const byModuleUrl = new Map<string, RouteEntry[]>();
  for (const route of routes) {
    const key = collapseToModule(route.url);
    const bucket = byModuleUrl.get(key);
    if (bucket) bucket.push(route);
    else byModuleUrl.set(key, [route]);
  }

  const byDir = new Map<string, string[]>();
  for (const [moduleUrl, entries] of byModuleUrl) {
    const dir = entries.find((e) => e.moduleDir)?.moduleDir ?? "";
    if (!dir || dir.split("/").length < 2) continue;
    const keys = byDir.get(dir);
    if (keys) keys.push(moduleUrl);
    else byDir.set(dir, [moduleUrl]);
  }

  for (const [, moduleUrls] of byDir) {
    if (moduleUrls.length < 2) continue;
    const merged = commonPrefix(moduleUrls);
    if (merged === "/" || !moduleUrls.every((u) => u.startsWith(merged))) continue;
    const combined: RouteEntry[] = [];
    for (const u of moduleUrls) {
      combined.push(...(byModuleUrl.get(u) ?? []));
      if (u !== merged) byModuleUrl.delete(u);
    }
    byModuleUrl.set(merged, combined);
  }

  return byModuleUrl;
}

/**
 * Strip comments, keeping string literals intact.
 *
 * Scanned character by character rather than regex-replaced because a URL in a
 * string (`"http://host"`) contains the very sequence that opens a line comment.
 */
export function stripComments(source: string): string {
  let out = "";
  let i = 0;
  let quote: string | undefined;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (quote) {
      out += ch;
      if (ch === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (ch === quote) quote = undefined;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/**
 * URL literals a spec or page object navigates to.
 *
 * Comments are excluded: the JSDoc example on `helpers/security-cases.ts` names
 * `/config/business-type`, and counting it made all fifteen specs that import
 * the helper look like they covered that module.
 */
export function extractRouteLiterals(source: string): string[] {
  const out = new Set<string>();
  const code = stripComments(source);
  const re = /["'`](\/[a-z0-9][a-z0-9/_:-]*)["'`]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    const url = m[1];
    // Filesystem-looking and API paths are not app routes.
    if (url.startsWith("/api") || url.includes(".")) continue;
    out.add(url.replace(/\/$/, ""));
  }
  return [...out];
}

/** Read a catalog's header block. Returns null when the file is not a catalog. */
export function parseCatalogHeader(markdown: string, file: string): CatalogInfo | null {
  const prefix = markdown.match(/\*\*Prefix:\*\*\s*`([A-Z]{2,5})`/)?.[1];
  if (!prefix) return null;
  const url = markdown.match(/\*\*URL:\*\*\s*`([^`]+)`/)?.[1] ?? "";
  const routeDir = markdown.match(/\*\*Frontend route:\*\*\s*`([^`]+)`/)?.[1] ?? "";
  const total = Number(markdown.match(/\*\*Total test cases:\*\*\s*(\d+)/)?.[1] ?? 0);
  return { file, prefix, url, routeDir: routeDir.replace(/^routes\//, ""), total };
}

/** Build the coverage table. */
export function buildCoverage(input: {
  routes: RouteEntry[];
  specs: SpecCoverage[];
  catalogs: CatalogInfo[];
}): CoverageRow[] {
  const modules = groupRoutesIntoModules(input.routes);

  // A section's landing page is passed through by nearly every spec — the shared
  // page objects all reference `/dashboard` — so counting an imported literal
  // there would report 30 specs covering a dashboard no spec actually asserts on.
  // For landings only the spec's own literals count.
  const landings = new Set<string>();
  for (const [moduleUrl, entries] of modules) {
    if (entries.some((e) => e.isIndex)) landings.add(moduleUrl);
  }

  const specsByModule = new Map<string, Set<string>>();
  for (const spec of input.specs) {
    for (const url of spec.urls) {
      const key = collapseToModule(url);
      if (!modules.has(key)) continue;
      if (landings.has(key) && !spec.ownUrls.some((u) => collapseToModule(u) === key)) continue;
      const bucket = specsByModule.get(key) ?? new Set<string>();
      bucket.add(spec.file);
      specsByModule.set(key, bucket);
    }
  }

  const catalogsByModule = new Map<string, Set<string>>();
  for (const cat of input.catalogs) {
    const key = matchCatalogToModule(cat, modules, landings);
    if (!key) continue;
    const bucket = catalogsByModule.get(key) ?? new Set<string>();
    bucket.add(cat.file);
    catalogsByModule.set(key, bucket);
  }

  const rows: CoverageRow[] = [];
  for (const [module, entries] of modules) {
    const specs = [...(specsByModule.get(module) ?? [])].sort();
    const catalogs = [...(catalogsByModule.get(module) ?? [])].sort();
    rows.push({
      module,
      moduleDir: entries.find((e) => e.moduleDir)?.moduleDir ?? "",
      urls: entries.map((e) => e.url).sort(),
      redirectOnly: entries.every((e) => e.kind === "redirect"),
      isLanding: landings.has(module),
      specs,
      catalogs,
      status: specs.length ? "spec" : catalogs.length ? "catalog" : "none",
    });
  }
  return rows.sort((a, b) => a.module.localeCompare(b.module));
}

/**
 * Find the module a catalog documents.
 *
 * Three attempts, most specific first: the declared URL, that URL with trailing
 * segments dropped, then the route directory. The middle one exists because
 * headers abbreviate — `100-product.md` writes `/product-management/product/...`
 * to mean "and its sub-pages", which matches nothing literally.
 */
function matchCatalogToModule(
  cat: CatalogInfo,
  modules: Map<string, unknown>,
  landings: Set<string>,
): string | undefined {
  const declared = cat.url.replace(/\/?\.{3}$/, "").replace(/\/$/, "");
  if (declared.startsWith("/")) {
    const byUrl = collapseToModule(declared);
    if (modules.has(byUrl)) return byUrl;

    // Walk up, but never land on a section index: `/system-admin/query-dataset`
    // is a route the app no longer has, and letting it settle on `/system-admin`
    // would file a stale catalog as covered instead of reporting it.
    const segments = byUrl.split("/").filter(Boolean);
    while (segments.length > 1) {
      segments.pop();
      const candidate = `/${segments.join("/")}`;
      if (landings.has(candidate)) break;
      if (modules.has(candidate)) return candidate;
    }
  }
  if (!cat.routeDir) return undefined;
  for (const key of modules.keys()) {
    if (key.replace(/^\//, "") === cat.routeDir) return key;
  }
  return undefined;
}

/** Why a catalog could not be tied to a module. */
export type UnmatchedReason = "route-missing" | "no-url";

export interface UnmatchedCatalog {
  catalog: CatalogInfo;
  reason: UnmatchedReason;
}

/**
 * Catalogs that no module claims.
 *
 * `route-missing` is the real finding — the app no longer serves what the
 * catalog documents. `no-url` is a cross-cutting catalog (section landings)
 * that never named one route, and needs no action.
 */
export function findOrphanCatalogs(
  catalogs: CatalogInfo[],
  rows: CoverageRow[],
): UnmatchedCatalog[] {
  const claimed = new Set(rows.flatMap((r) => r.catalogs));
  return catalogs
    .filter((c) => !claimed.has(c.file))
    .map((catalog) => ({
      catalog,
      reason: catalog.url.startsWith("/") ? ("route-missing" as const) : ("no-url" as const),
    }));
}
