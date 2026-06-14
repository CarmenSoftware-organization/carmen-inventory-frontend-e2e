import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import * as ts from "typescript";

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

/** Join a route prefix and a path segment into a canonical "/a/b" route. */
function joinRoute(prefix: string, seg: string): string {
  const parts = [...prefix.split("/"), ...seg.split("/")].filter(Boolean);
  return "/" + parts.join("/");
}

/**
 * Parse a react-router `router.tsx` source (the React SPA's route table built by
 * `createBrowserRouter([...])`) into a sorted, unique list of canonical routes.
 *
 * The router tree — not the file layout — is the source of truth: e.g. the file
 * `routes/external/pl/page.tsx` is wired to `/pl/:url_token`, and the catch-all
 * `path: "*"` maps to the 404 page. A route is emitted for every node carrying a
 * `lazy` page loader; layout wrappers (Component-only), the index redirect
 * (`element: <Navigate/>`), and the `*` catch-all are skipped. Param segments are
 * already authored as `:id` in the path strings, so no bracket conversion is needed.
 */
export function routerToRoutes(source: string): string[] {
  const sf = ts.createSourceFile(
    "router.tsx",
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );
  const routes = new Set<string>();

  const prop = (
    obj: ts.ObjectLiteralExpression,
    name: string,
  ): ts.PropertyAssignment | undefined =>
    obj.properties.find(
      (p): p is ts.PropertyAssignment =>
        ts.isPropertyAssignment(p) && p.name.getText(sf) === name,
    );

  const walkArray = (arr: ts.ArrayLiteralExpression, prefix: string): void => {
    for (const el of arr.elements) {
      if (!ts.isObjectLiteralExpression(el)) continue;
      const pathProp = prop(el, "path");
      const seg =
        pathProp && ts.isStringLiteral(pathProp.initializer)
          ? pathProp.initializer.text
          : undefined;
      const isCatchAll = seg === "*";
      const current = seg !== undefined ? joinRoute(prefix, seg) : prefix;
      if (prop(el, "lazy") && !isCatchAll) {
        routes.add(current === "" ? "/" : current);
      }
      const childrenProp = prop(el, "children");
      if (
        !isCatchAll &&
        childrenProp &&
        ts.isArrayLiteralExpression(childrenProp.initializer)
      ) {
        walkArray(childrenProp.initializer, current);
      }
    }
  };

  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "createBrowserRouter"
    ) {
      const arg = node.arguments[0];
      if (arg && ts.isArrayLiteralExpression(arg)) walkArray(arg, "");
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return [...routes].sort();
}

/**
 * Discover routes for whichever frontend `frontendDir` points at: the React SPA
 * (`routes/router.tsx`, parsed as the source of truth) or the legacy Next.js app
 * (`app/` file-system routing). Picks the strategy by probing for `routes/router.tsx`.
 */
export function discoverFrontendRoutes(frontendDir: string): string[] {
  const routerFile = join(frontendDir, "routes", "router.tsx");
  if (existsSync(routerFile)) {
    return routerToRoutes(readFileSync(routerFile, "utf8"));
  }
  return discoverRoutes(join(frontendDir, "app"));
}
