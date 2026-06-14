import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  fileToRoute,
  discoverRoutes,
  routerToRoutes,
  discoverFrontendRoutes,
} from "../../tests/wiki-screenshots/route-discovery";

describe("fileToRoute", () => {
  it("maps the app root page to /", () => {
    expect(fileToRoute("page.tsx")).toBe("/");
  });

  it("strips route groups like (root) and (external)", () => {
    expect(fileToRoute("(root)/dashboard/page.tsx")).toBe("/dashboard");
    expect(fileToRoute("(external)/pl/[url_token]/page.tsx")).toBe("/pl/:url_token");
  });

  it("converts dynamic segments [id] to :id", () => {
    expect(fileToRoute("(root)/config/department/[id]/page.tsx")).toBe(
      "/config/department/:id",
    );
  });

  it("handles nested groups and multiple statics", () => {
    expect(
      fileToRoute("(root)/procurement/purchase-order/new/page.tsx"),
    ).toBe("/procurement/purchase-order/new");
  });

  it("returns null for non-page files", () => {
    expect(fileToRoute("(root)/dashboard/layout.tsx")).toBeNull();
  });

  it("converts catch-all segments [...slug] to :slug", () => {
    expect(fileToRoute("(root)/items/[...slug]/page.tsx")).toBe("/items/:slug");
  });
});

describe("discoverRoutes", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs) rmSync(d, { recursive: true, force: true });
  });

  it("recurses into nested directories and returns routes from every page.tsx", () => {
    const appDir = mkdtempSync(join(tmpdir(), "app-"));
    dirs.push(appDir);
    mkdirSync(join(appDir, "dashboard"), { recursive: true });
    mkdirSync(join(appDir, "settings", "profile"), { recursive: true });
    writeFileSync(join(appDir, "dashboard", "page.tsx"), "");
    writeFileSync(join(appDir, "settings", "profile", "page.tsx"), "");

    const routes = discoverRoutes(appDir);
    expect(routes).toContain("/dashboard");
    expect(routes).toContain("/settings/profile");
  });

  it("converts [id] to :id and drops (group) segments", () => {
    const appDir = mkdtempSync(join(tmpdir(), "app-"));
    dirs.push(appDir);
    mkdirSync(join(appDir, "(root)", "items", "[id]"), { recursive: true });
    writeFileSync(join(appDir, "(root)", "items", "[id]", "page.tsx"), "");

    const routes = discoverRoutes(appDir);
    expect(routes).toContain("/items/:id");
  });

  it("ignores non-page.tsx files like layout.tsx", () => {
    const appDir = mkdtempSync(join(tmpdir(), "app-"));
    dirs.push(appDir);
    mkdirSync(join(appDir, "dashboard"), { recursive: true });
    writeFileSync(join(appDir, "dashboard", "layout.tsx"), "");

    const routes = discoverRoutes(appDir);
    expect(routes).not.toContain("/dashboard");
    expect(routes).toHaveLength(0);
  });

  it("returns a sorted, de-duplicated array", () => {
    const appDir = mkdtempSync(join(tmpdir(), "app-"));
    dirs.push(appDir);
    mkdirSync(join(appDir, "zebra"), { recursive: true });
    mkdirSync(join(appDir, "alpha"), { recursive: true });
    writeFileSync(join(appDir, "zebra", "page.tsx"), "");
    writeFileSync(join(appDir, "alpha", "page.tsx"), "");

    const routes = discoverRoutes(appDir);
    expect(routes).toEqual(["/alpha", "/zebra"]);
    // de-duplication: same sorted array length even if walk visits twice (Set-based)
    expect(routes.length).toBe(new Set(routes).size);
  });
});

describe("routerToRoutes (React SPA createBrowserRouter)", () => {
  const ROUTER = `
import { createBrowserRouter, Navigate } from "react-router";
export const router = createBrowserRouter([
  {
    Component: AppRoot,
    children: [
      { path: "/login", lazy: () => import("./login/page") },
      { path: "/pl/:url_token", lazy: () => import("./external/pl/page") },
      {
        Component: ProtectedShell,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", lazy: () => import("./dashboard/page") },
          {
            path: "config",
            ErrorBoundary: RouteErrorBoundaryAdapter,
            children: [
              { index: true, lazy: () => import("./config/page") },
              { path: "unit", lazy: () => import("./config/unit/page") },
              { path: "department/:id", lazy: () => import("./config/department/[id]/page") },
            ],
          },
          {
            path: "inventory-management",
            children: [
              { path: "physical-count/:id/entry", lazy: () => import("./inventory-management/physical-count/[id]/entry/page") },
            ],
          },
        ],
      },
      { path: "*", lazy: () => import("./not-found/page") },
    ],
  },
]);
`;

  it("emits a route for every node carrying a lazy page loader", () => {
    const routes = routerToRoutes(ROUTER);
    expect(routes).toContain("/login");
    expect(routes).toContain("/dashboard");
    expect(routes).toContain("/config/unit");
  });

  it("composes nested child paths from their parent prefix", () => {
    const routes = routerToRoutes(ROUTER);
    expect(routes).toContain("/config/department/:id");
    expect(routes).toContain("/inventory-management/physical-count/:id/entry");
  });

  it("treats an index route as the parent path", () => {
    expect(routerToRoutes(ROUTER)).toContain("/config");
  });

  it("keeps :param segments as authored (no bracket conversion)", () => {
    expect(routerToRoutes(ROUTER)).toContain("/pl/:url_token");
  });

  it("skips the index redirect (element: <Navigate/>, no lazy)", () => {
    // The ProtectedShell index redirects to /dashboard and renders no page.
    expect(routerToRoutes(ROUTER)).not.toContain("/");
  });

  it("skips the * catch-all (404), not the file path it lazy-loads", () => {
    const routes = routerToRoutes(ROUTER);
    expect(routes).not.toContain("/*");
    expect(routes).not.toContain("/not-found");
  });

  it("returns a sorted, de-duplicated array", () => {
    const routes = routerToRoutes(ROUTER);
    expect(routes).toEqual([...routes].sort());
    expect(routes.length).toBe(new Set(routes).size);
  });
});

describe("discoverFrontendRoutes", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs) rmSync(d, { recursive: true, force: true });
  });

  it("parses routes/router.tsx when present (React SPA)", () => {
    const dir = mkdtempSync(join(tmpdir(), "fe-"));
    dirs.push(dir);
    mkdirSync(join(dir, "routes"), { recursive: true });
    writeFileSync(
      join(dir, "routes", "router.tsx"),
      `export const router = createBrowserRouter([{ path: "dashboard", lazy: () => import("./dashboard/page") }]);`,
    );
    expect(discoverFrontendRoutes(dir)).toEqual(["/dashboard"]);
  });

  it("falls back to app/ file-system routing (legacy Next.js)", () => {
    const dir = mkdtempSync(join(tmpdir(), "fe-"));
    dirs.push(dir);
    mkdirSync(join(dir, "app", "dashboard"), { recursive: true });
    writeFileSync(join(dir, "app", "dashboard", "page.tsx"), "");
    expect(discoverFrontendRoutes(dir)).toEqual(["/dashboard"]);
  });
});
