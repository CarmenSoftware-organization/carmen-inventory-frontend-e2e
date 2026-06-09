import { describe, it, expect } from "vitest";
import { applySeedOverlay } from "../../tests/wiki-screenshots/seed-overlay";
import type { ShotSpec } from "../../tests/wiki-screenshots/types";

const shots: ShotSpec[] = [
  { path: "/vendor/:id", module: "vendor", slug: "detail" },
  { path: "/dashboard", module: "dashboard", slug: "index" },
  { path: "/role/:id", module: "role", slug: "detail", seedId: "hand-set" },
];

describe("applySeedOverlay", () => {
  it("fills seedId from the overlay where the spec has none", () => {
    const out = applySeedOverlay(shots, { "/vendor/:id": "v1" });
    expect(out.find((s) => s.path === "/vendor/:id")?.seedId).toBe("v1");
  });

  it("never overrides a spec's own seedId", () => {
    const out = applySeedOverlay(shots, { "/role/:id": "overlay" });
    expect(out.find((s) => s.path === "/role/:id")?.seedId).toBe("hand-set");
  });

  it("leaves shots untouched when the overlay has no entry", () => {
    const out = applySeedOverlay(shots, {});
    expect(out.find((s) => s.path === "/dashboard")?.seedId).toBeUndefined();
    expect(out.find((s) => s.path === "/vendor/:id")?.seedId).toBeUndefined();
  });
});
