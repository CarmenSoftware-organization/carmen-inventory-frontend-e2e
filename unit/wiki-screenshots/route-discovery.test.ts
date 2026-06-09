import { describe, it, expect } from "vitest";
import { fileToRoute } from "../../tests/wiki-screenshots/route-discovery";

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
});
