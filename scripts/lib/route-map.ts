/**
 * Parse the frontend's route table into a flat list of URLs.
 *
 * The React SPA declares every route in ONE file (`routes/router.tsx`) as a
 * nested `createBrowserRouter([...])` literal, so the whole sitemap is knowable
 * statically — no crawling, no running app. Kept apart from audit-coverage.ts
 * so the parsing stays pure and unit-testable.
 *
 * Why an AST and not a regex: paths nest. `{ path: "config", children: [{ path:
 * "department/:id" }] }` is the URL `/config/department/:id`, and a regex over
 * `path: "..."` yields the two fragments with no way to join them — which is
 * exactly why a plain grep of the file reports 182 meaningless fragments.
 */
import * as ts from "typescript";

/** One reachable URL, with the route module that renders it. */
export interface RouteEntry {
  /** Absolute URL pattern as the router matches it, e.g. `/config/department/:id`. */
  url: string;
  /**
   * Directory of the route module under `routes/`, e.g. `config/department`.
   * Empty when the node renders an inline element instead of a lazy import.
   */
  moduleDir: string;
  /** True for `{ index: true }` nodes — they render the parent's URL. */
  isIndex: boolean;
  /**
   * `screen` renders a page; `redirect` bounces elsewhere.
   *
   * Redirects matter to coverage: `/system-admin/workflow` renders nothing but
   * is still a URL a user reaches, and "does it land on the right page" is a
   * test case. Dropping them would have silently hidden two system-admin URLs.
   */
  kind: "screen" | "redirect";
  /** Destination of a `<Navigate to="…" />` node; only set when kind is `redirect`. */
  redirectTo?: string;
}

/** Join a parent URL with a child `path` the way React Router does. */
export function joinRoutePath(parent: string, child: string): string {
  if (child.startsWith("/")) return normalizeUrl(child);
  if (!child) return normalizeUrl(parent);
  return normalizeUrl(`${parent}/${child}`);
}

function normalizeUrl(url: string): string {
  const collapsed = `/${url}`.replace(/\/+/g, "/");
  return collapsed.length > 1 ? collapsed.replace(/\/$/, "") : "/";
}

/**
 * `() => import("./config/department/department.route")` -> `config/department`.
 *
 * The file name is dropped: several route files in one directory (list / new /
 * edit) are one module as far as coverage is concerned.
 */
export function moduleDirFromImport(specifier: string): string {
  const cleaned = specifier.replace(/^\.\//, "").replace(/^\//, "");
  const segments = cleaned.split("/");
  segments.pop();
  return segments.join("/");
}

/** Extract the import specifier from a `lazy: () => import("...")` property. */
function lazyImportSpecifier(node: ts.ObjectLiteralExpression): string | undefined {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (prop.name.getText() !== "lazy") continue;
    let found: string | undefined;
    const visit = (n: ts.Node): void => {
      if (
        ts.isCallExpression(n) &&
        n.expression.kind === ts.SyntaxKind.ImportKeyword &&
        n.arguments.length > 0 &&
        ts.isStringLiteralLike(n.arguments[0])
      ) {
        found = n.arguments[0].text;
        return;
      }
      ts.forEachChild(n, visit);
    };
    visit(prop.initializer);
    return found;
  }
  return undefined;
}

/**
 * Destination of an `element: <Navigate to="…" replace />` property.
 *
 * Read off the JSX attribute rather than evaluated — these are always literal
 * strings in this router, and a literal read cannot execute app code.
 */
function navigateTarget(node: ts.ObjectLiteralExpression): string | undefined {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (prop.name.getText() !== "element") continue;
    let target: string | undefined;
    const visit = (n: ts.Node): void => {
      const tag =
        ts.isJsxSelfClosingElement(n) ? n : ts.isJsxOpeningElement(n) ? n : undefined;
      if (tag && tag.tagName.getText() === "Navigate") {
        for (const attr of tag.attributes.properties) {
          if (!ts.isJsxAttribute(attr) || attr.name.getText() !== "to") continue;
          const init = attr.initializer;
          if (init && ts.isStringLiteral(init)) target = init.text;
          else if (init && ts.isJsxExpression(init) && init.expression && ts.isStringLiteralLike(init.expression))
            target = init.expression.text;
        }
        return;
      }
      ts.forEachChild(n, visit);
    };
    visit(prop.initializer);
    return target;
  }
  return undefined;
}

function stringProp(node: ts.ObjectLiteralExpression, name: string): string | undefined {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (prop.name.getText() !== name) continue;
    if (ts.isStringLiteralLike(prop.initializer)) return prop.initializer.text;
  }
  return undefined;
}

function isTrueProp(node: ts.ObjectLiteralExpression, name: string): boolean {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (prop.name.getText() !== name) continue;
    return prop.initializer.kind === ts.SyntaxKind.TrueKeyword;
  }
  return false;
}

function childrenProp(node: ts.ObjectLiteralExpression): ts.ArrayLiteralExpression | undefined {
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (prop.name.getText() !== "children") continue;
    if (ts.isArrayLiteralExpression(prop.initializer)) return prop.initializer;
  }
  return undefined;
}

/**
 * Walk the router literal and flatten it into absolute URLs.
 *
 * Layout-only nodes (a `Component` wrapper with no `path`) contribute nothing
 * to the URL but do carry their children, which is how `ProtectedShell` keeps
 * `/dashboard` at the top level instead of nesting it.
 */
export function parseRouterSource(source: string, fileName = "router.tsx"): RouteEntry[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const entries: RouteEntry[] = [];

  const walkNode = (node: ts.ObjectLiteralExpression, parentUrl: string): void => {
    const path = stringProp(node, "path");
    const isIndex = isTrueProp(node, "index");
    const url = path === undefined ? parentUrl : joinRoutePath(parentUrl, path);
    const specifier = lazyImportSpecifier(node);
    const redirectTo = specifier ? undefined : navigateTarget(node);

    // A node counts when it renders something of its own: a lazy module, a
    // redirect, or an index node standing in for its parent's URL.
    if (specifier || redirectTo || (isIndex && parentUrl !== "")) {
      entries.push({
        url,
        moduleDir: specifier ? moduleDirFromImport(specifier) : "",
        isIndex,
        kind: redirectTo ? "redirect" : "screen",
        ...(redirectTo ? { redirectTo } : {}),
      });
    }

    const children = childrenProp(node);
    if (children) {
      for (const child of children.elements) {
        if (ts.isObjectLiteralExpression(child)) walkNode(child, url);
      }
    }
  };

  const findRouterArray = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "createBrowserRouter" &&
      node.arguments.length > 0 &&
      ts.isArrayLiteralExpression(node.arguments[0])
    ) {
      for (const el of node.arguments[0].elements) {
        if (ts.isObjectLiteralExpression(el)) walkNode(el, "");
      }
      return;
    }
    ts.forEachChild(node, findRouterArray);
  };

  findRouterArray(sf);
  return dedupe(entries);
}

function dedupe(entries: RouteEntry[]): RouteEntry[] {
  const byUrl = new Map<string, RouteEntry>();
  for (const e of entries) {
    const existing = byUrl.get(e.url);
    // Two nodes can share a URL (e.g. `/invitations` and `/invitations/:token`
    // pointing at one module). Keep the one that names a module.
    if (!existing || (!existing.moduleDir && e.moduleDir)) byUrl.set(e.url, e);

  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}
