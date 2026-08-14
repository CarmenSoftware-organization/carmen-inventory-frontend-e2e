import { existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { discoverFrontendRoutes } from "./route-discovery";
import { loadRoleMatrix, ROLE_MATRIX_PATH, baselineFor } from "./role-matrix";
import { outputFile } from "./shot-path";
import { SHOTS } from "./manifest";
import type { ProbeResult, ShotSpec } from "./types";

/** One card on the sitemap: a route plus every image that exists for it. */
export type SitemapEntry = {
  route: string;
  module: string;
  slug: string;
  baselineRole?: string;
  /** Path relative to the HTML file, or undefined when nothing was captured. */
  baselineImage?: string;
  variants: Array<{ role: string; image: string }>;
  denied: string[];
  unavailable: string[];
};

/**
 * Join the manifest, the probe matrix, and what is actually on disk.
 *
 * Disk is the authority for images: the manifest says what we intended to
 * shoot, not what succeeded.
 */
export function buildEntries(
  shots: ShotSpec[],
  matrix: ProbeResult[],
  assetsDir: string,
  htmlDir: string,
  fileExists: (p: string) => boolean,
): SitemapEntry[] {
  return shots.map((spec) => {
    const forRoute = matrix.filter((r) => r.route === spec.path);
    const base = baselineFor(matrix, spec.path);
    const rel = (abs: string): string => relative(htmlDir, abs).split("\\").join("/");

    let baselineImage: string | undefined;
    const variants: Array<{ role: string; image: string }> = [];
    if (base) {
      const baseFile = outputFile(assetsDir, spec, base.role, base.role);
      if (fileExists(baseFile)) baselineImage = rel(baseFile);
      for (const r of forRoute) {
        if (r.role === base.role || r.outcome !== "ok") continue;
        const f = outputFile(assetsDir, spec, r.role, base.role);
        if (fileExists(f)) variants.push({ role: r.role, image: rel(f) });
      }
    }

    return {
      route: spec.path,
      module: spec.module,
      slug: spec.interaction === "add-dialog" ? `${spec.slug} (dialog)` : spec.slug,
      baselineRole: base?.role,
      baselineImage,
      variants,
      denied: forRoute.filter((r) => r.outcome === "denied").map((r) => r.role),
      unavailable: forRoute
        .filter((r) => r.outcome === "not-found" || r.outcome === "error")
        .map((r) => r.role),
    };
  });
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Top-level URL segment, used as the section heading. */
function sectionOf(route: string): string {
  return route.split("/").filter(Boolean)[0] ?? "root";
}

function renderCard(e: SitemapEntry): string {
  const thumb = e.baselineImage
    ? `<img src="${esc(e.baselineImage)}" alt="${esc(e.route)}" loading="lazy">`
    : `<div class="no-shot">no screenshot</div>`;
  const badges = [
    e.baselineRole ? `<span class="b base">${esc(e.baselineRole)}</span>` : "",
    ...e.variants.map((v) => `<a class="b var" href="${esc(v.image)}">${esc(v.role)} ⊕</a>`),
    ...e.denied.map((r) => `<span class="b denied">${esc(r)} ⊘</span>`),
    ...e.unavailable.map((r) => `<span class="b na">${esc(r)} —</span>`),
  ].join("");
  const roles = [e.baselineRole ?? "", ...e.variants.map((v) => v.role), ...e.denied].join(" ");
  return `<article class="card" data-route="${esc(e.route)}" data-roles="${esc(roles)}">
  <div class="shot">${thumb}</div>
  <div class="meta"><code>${esc(e.route)}</code><span class="slug">${esc(e.module)} · ${esc(e.slug)}</span></div>
  <div class="badges">${badges}</div>
</article>`;
}

/** Render the whole sitemap as one self-contained HTML document. Pure. */
export function renderSitemap(entries: SitemapEntry[]): string {
  const sections = new Map<string, SitemapEntry[]>();
  for (const e of [...entries].sort((a, b) => a.route.localeCompare(b.route))) {
    const key = sectionOf(e.route);
    sections.set(key, [...(sections.get(key) ?? []), e]);
  }
  const captured = entries.filter((e) => e.baselineImage).length;
  const unreachable = entries.filter((e) => !e.baselineRole).length;
  const variants = entries.reduce((n, e) => n + e.variants.length, 0);

  const body = [...sections.entries()]
    .map(
      ([name, list]) =>
        `<section><h2>${esc(name)} <span class="count">${list.length}</span></h2>
<div class="grid">${list.map(renderCard).join("")}</div></section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Carmen Inventory · Sitemap</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--bg:#fff;--fg:#111;--muted:#666;--line:#e5e5e5;--card:#fafafa}
@media(prefers-color-scheme:dark){:root{--bg:#111;--fg:#eee;--muted:#999;--line:#333;--card:#1a1a1a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
header{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 20px;z-index:2}
h1{font-size:16px;margin:0 0 8px}
.stats{color:var(--muted);font-size:12px}
input{width:280px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
section{padding:16px 20px;border-bottom:1px solid var(--line)}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 12px}
.count{background:var(--card);border-radius:10px;padding:1px 7px;font-size:11px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.shot{aspect-ratio:16/10;overflow:hidden;background:var(--bg);border-bottom:1px solid var(--line)}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block}
.no-shot{display:grid;place-items:center;height:100%;color:var(--muted);font-size:12px}
.meta{padding:8px 10px 4px}
.meta code{font-size:11px;word-break:break-all;display:block}
.slug{color:var(--muted);font-size:11px}
.badges{padding:4px 10px 10px;display:flex;flex-wrap:wrap;gap:4px}
.b{font-size:10px;padding:1px 6px;border-radius:9px;border:1px solid var(--line);text-decoration:none;color:var(--fg)}
.base{background:#2563eb;color:#fff;border-color:#2563eb}
.var{background:#16a34a;color:#fff;border-color:#16a34a}
.denied{color:#b91c1c;border-color:#b91c1c}
.na{color:var(--muted)}
.hidden{display:none}
</style></head><body>
<header>
<h1>Carmen Inventory · Sitemap</h1>
<div class="stats">${entries.length} screens · ${captured} captured · ${variants} role variants · ${unreachable} unreachable</div>
<div style="margin-top:8px"><input id="q" type="search" placeholder="filter by route or role..."></div>
</header>
${body}
<script>
document.getElementById("q").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  for (const card of document.querySelectorAll(".card")) {
    const hay = (card.dataset.route + " " + card.dataset.roles).toLowerCase();
    card.classList.toggle("hidden", q !== "" && !hay.includes(q));
  }
  for (const s of document.querySelectorAll("section")) {
    s.classList.toggle("hidden", s.querySelectorAll(".card:not(.hidden)").length === 0);
  }
});
</script>
</body></html>
`;
}

function main(): void {
  const assetsDir =
    process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
  const outPath = process.env.WIKI_SITEMAP_PATH ?? "../carmen-wiki/sitemap.html";
  const htmlDir = join(outPath, "..");
  const matrix = loadRoleMatrix(ROLE_MATRIX_PATH);

  // Routes present in the router but absent from the manifest still deserve a
  // card — otherwise a new page would be invisible in the sitemap.
  const frontendDir = process.env.E2E_FRONTEND_DIR ?? "../carmen-inventory-frontend-react";
  const known = new Set(SHOTS.map((s) => s.path));
  const extra: ShotSpec[] = discoverFrontendRoutes(frontendDir)
    .filter((r) => !known.has(r))
    .map((r) => ({ path: r, module: r.split("/").filter(Boolean)[0] ?? "root", slug: "unmapped" }));

  const entries = buildEntries([...SHOTS, ...extra], matrix, assetsDir, htmlDir, existsSync);
  writeFileSync(outPath, renderSitemap(entries));
  console.log(`Wrote ${outPath} (${entries.length} screens)`);
}

// @ts-expect-error import.meta.main is a Bun-specific CLI guard; tsc uses commonjs module mode
if (import.meta.main) main();
