import { describe, it, expect } from "vitest";
import { baselineFor, rolesToCapture } from "../../tests/wiki-screenshots/role-matrix";
import { resolvePath, outputFile } from "../../tests/wiki-screenshots/shot-path";
import type { ProbeResult, PageSignature, ShotSpec } from "../../tests/wiki-screenshots/types";

const sig = (over: Partial<PageSignature> = {}): PageSignature => ({
  heading: "Vendor",
  actions: ["Add"],
  columns: ["Code", "Name"],
  hasRows: true,
  ...over,
});

const ok = (role: string, over: Partial<PageSignature> = {}): ProbeResult => ({
  route: "/vendor-management/vendor",
  role,
  outcome: "ok",
  signature: sig(over),
});

const denied = (role: string): ProbeResult => ({
  route: "/vendor-management/vendor",
  role,
  outcome: "denied",
  reason: "Permission denied",
});

describe("baselineFor", () => {
  it("prefers Admin when Admin can see the page", () => {
    const m = [ok("HOD"), ok("Admin"), ok("Requestor")];
    expect(baselineFor(m, "/vendor-management/vendor")?.role).toBe("Admin");
  });

  it("falls back to the first TEST_USERS role that succeeded when Admin cannot", () => {
    const m = [denied("Admin"), ok("HOD"), ok("Requestor")];
    // TEST_USERS order is Requestor, HOD, Purchase, ... so Requestor wins over HOD
    expect(baselineFor(m, "/vendor-management/vendor")?.role).toBe("Requestor");
  });

  it("returns null when no role could reach the page", () => {
    const m = [denied("Admin"), denied("HOD")];
    expect(baselineFor(m, "/vendor-management/vendor")).toBeNull();
  });

  it("ignores results belonging to other routes", () => {
    const m = [{ ...ok("Admin"), route: "/config/unit" }];
    expect(baselineFor(m, "/vendor-management/vendor")).toBeNull();
  });
});

describe("rolesToCapture", () => {
  it("returns only roles whose screen differs from the baseline", () => {
    const m = [ok("Admin"), ok("HOD"), ok("Requestor", { actions: ["Approve"] })];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual(["Requestor"]);
  });

  it("never includes the baseline role itself", () => {
    const m = [ok("Admin")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });

  it("excludes roles that could not reach the page", () => {
    const m = [ok("Admin"), denied("HOD")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });

  it("returns nothing when there is no baseline at all", () => {
    const m = [denied("Admin"), denied("HOD")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });
});

describe("resolvePath", () => {
  it("substitutes the seedId into a dynamic segment", () => {
    const spec: ShotSpec = { path: "/config/department/:id", module: "department", slug: "detail", seedId: "abc" };
    expect(resolvePath(spec)).toBe("/config/department/abc");
  });

  it("leaves a static path untouched", () => {
    const spec: ShotSpec = { path: "/config/unit", module: "unit", slug: "index" };
    expect(resolvePath(spec)).toBe("/config/unit");
  });
});

describe("outputFile", () => {
  const spec: ShotSpec = { path: "/config/unit", module: "unit", slug: "index" };

  it("gives the baseline role the unsuffixed path so existing wiki docs keep working", () => {
    expect(outputFile("/assets", spec, "Admin", "Admin")).toBe("/assets/unit/index.png");
  });

  it("suffixes any non-baseline role", () => {
    expect(outputFile("/assets", spec, "HOD", "Admin")).toBe("/assets/unit/index--HOD.png");
  });

  it("marks a dialog shot in the filename stem", () => {
    const dialog: ShotSpec = { ...spec, interaction: "add-dialog" };
    expect(outputFile("/assets", dialog, "Admin", "Admin")).toBe("/assets/unit/index-dialog-add.png");
  });
});
