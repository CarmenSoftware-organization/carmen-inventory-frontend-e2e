import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  fileToRoute,
  discoverRoutes,
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
