import { describe, it, expect } from "vitest";
import {
  inferModuleSlug,
  generateManifestSource,
} from "../../tests/wiki-screenshots/seed-manifest";

describe("inferModuleSlug", () => {
  it("maps the root route", () => {
    expect(inferModuleSlug("/")).toEqual({ module: "root", slug: "index" });
  });
  it("uses index for list pages", () => {
    expect(inferModuleSlug("/procurement/purchase-order")).toEqual({
      module: "purchase-order",
      slug: "index",
    });
  });
  it("uses detail for dynamic leaf pages", () => {
    expect(inferModuleSlug("/vendor-management/vendor/:id")).toEqual({
      module: "vendor",
      slug: "detail",
    });
  });
  it("keeps action segments as the slug", () => {
    expect(inferModuleSlug("/procurement/purchase-order/new")).toEqual({
      module: "purchase-order",
      slug: "new",
    });
    expect(inferModuleSlug("/inventory-management/physical-count/:id/review")).toEqual({
      module: "physical-count",
      slug: "review",
    });
  });
});

describe("generateManifestSource", () => {
  it("emits a typed SHOTS array and skips playground/login/external routes", () => {
    const src = generateManifestSource([
      "/dashboard",
      "/playground/chart",
      "/login",
      "/pl/:url_token",
      "/vendor-management/vendor/:id",
    ]);
    expect(src).toContain('import type { ShotSpec } from "./types"');
    expect(src).toContain("export const SHOTS: ShotSpec[] = [");
    expect(src).toContain('{ path: "/dashboard"');
    expect(src).not.toContain("/playground/chart");
    expect(src).not.toContain('"/login"');
    expect(src).not.toContain("/pl/:url_token");
    expect(src).toContain("/vendor-management/vendor/:id");
    expect(src).toContain("TODO: set seedId");
  });
});
