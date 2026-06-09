import { describe, it, expect } from "vitest";
import { computeCoverage, renderReport } from "../../tests/wiki-screenshots/coverage";
import type { ShotSpec } from "../../tests/wiki-screenshots/types";

const shots: ShotSpec[] = [
  { path: "/dashboard", module: "dashboard", slug: "index" },
  { path: "/vendor-management/vendor/:id", module: "vendor", slug: "detail", seedId: "v1" },
  { path: "/config/unit", module: "unit", slug: "index" },
  { path: "/gone", module: "x", slug: "index" }, // not a real route -> stale
];
const routes = [
  "/dashboard",
  "/vendor-management/vendor/:id",
  "/config/unit",
  "/config/department/:id", // real route, no shot -> missing
];

describe("computeCoverage", () => {
  it("classifies covered / missing / stale", () => {
    const rows = computeCoverage(routes, shots);
    const byRoute = Object.fromEntries(rows.map((r) => [r.route, r.status]));
    expect(byRoute["/dashboard"]).toBe("covered");
    expect(byRoute["/vendor-management/vendor/:id"]).toBe("covered");
    expect(byRoute["/config/department/:id"]).toBe("missing");
    expect(byRoute["/gone"]).toBe("stale");
  });

  it("flags dynamic routes whose shot lacks seedId as needs-seed", () => {
    const noSeed: ShotSpec[] = [{ path: "/x/:id", module: "x", slug: "detail" }];
    const rows = computeCoverage(["/x/:id"], noSeed);
    expect(rows[0].status).toBe("needs-seed");
  });

  it("marks routes listed in the skipped map as skipped", () => {
    const rows = computeCoverage(["/dashboard"], shots, { "/dashboard": "timeout" });
    expect(rows[0].status).toBe("skipped");
    expect(rows[0].reason).toBe("timeout");
  });

  it("classifies a skipped route with no shot as skipped", () => {
    const rows = computeCoverage(["/no-shot"], [], { "/no-shot": "timeout" });
    expect(rows[0].status).toBe("skipped");
    expect(rows[0].reason).toBe("timeout");
  });
});

describe("renderReport", () => {
  it("emits a markdown table with a summary line", () => {
    const md = renderReport(computeCoverage(routes, shots));
    expect(md).toContain("# Screenshot Coverage");
    expect(md).toContain("| Route | Status |");
    expect(md).toMatch(/covered: \d+/);
    expect(md).toMatch(/missing: \d+/);
    expect(md).toMatch(/stale: \d+/);
  });
});
