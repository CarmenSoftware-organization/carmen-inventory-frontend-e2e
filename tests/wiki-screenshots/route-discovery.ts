import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Convert an `app/`-relative path (e.g. "(root)/config/[id]/page.tsx") into a
 * canonical route ("/config/:id"), or null if the file is not a page.tsx.
 * Route groups "(name)" are dropped; "[seg]"/"[...seg]" become ":seg".
 */
export function fileToRoute(relPath: string): string | null {
  const norm = relPath.split(sep).join("/");
  if (norm !== "page.tsx" && !norm.endsWith("/page.tsx")) return null;
  const body = norm.replace(/\/?page\.tsx$/, "");
  const segments = body
    .split("/")
    .filter((s) => s.length > 0)
    .filter((s) => !(s.startsWith("(") && s.endsWith(")")))
    .map((s) => s.replace(/^\[(?:\.{3})?([^\]]+)\]$/, ":$1"));
  const route = "/" + segments.join("/");
  return route === "/" ? "/" : route;
}

/** Recursively walk an `app/` directory and return sorted unique routes. */
export function discoverRoutes(appDir: string): string[] {
  const routes = new Set<string>();
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "page.tsx") {
        const r = fileToRoute(relative(appDir, full));
        if (r) routes.add(r);
      }
    }
  };
  walk(appDir);
  return [...routes].sort();
}
