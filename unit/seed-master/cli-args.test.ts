// unit/seed-master/cli-args.test.ts
import { describe, it, expect } from "vitest";
import { parseArgs, resolveEnabled, resolveWorkbookPath } from "../../scripts/seed-master/index";

describe("parseArgs", () => {
  it("uses sane defaults", () => {
    expect(parseArgs([])).toEqual({ file: "avg", limit: 50, dryRun: false, yes: false, verbose: false });
  });
  it("parses all flags", () => {
    const a = parseArgs(["--file", "fifo", "--bu", "BLAVG", "--limit", "10", "--only", "currency,unit", "--dry-run", "--yes", "--verbose"]);
    expect(a).toEqual({ file: "fifo", bu: "BLAVG", limit: 10, only: ["currency", "unit"], dryRun: true, yes: true, verbose: true });
  });
  it("throws on unknown flag", () => {
    expect(() => parseArgs(["--nope"])).toThrow(/Unknown argument: --nope/);
  });
});

describe("resolveEnabled", () => {
  it("returns all entities by default", () => {
    expect(resolveEnabled(parseArgs([])).size).toBe(9);
  });
  it("honours --only", () => {
    expect([...resolveEnabled(parseArgs(["--only", "vendor,product"]))]).toEqual(["vendor", "product"]);
  });
  it("honours --skip", () => {
    const set = resolveEnabled(parseArgs(["--skip", "product,vendor"]));
    expect(set.has("product")).toBe(false);
    expect(set.has("currency")).toBe(true);
  });
});

describe("resolveWorkbookPath", () => {
  it("maps aliases and passes through explicit paths", () => {
    expect(resolveWorkbookPath("avg")).toBe("sample_seed_data/Preconfig_CARMEN_AVG.xlsx");
    expect(resolveWorkbookPath("fifo")).toBe("sample_seed_data/Preconfig_CARMEN_FIFO.xlsx");
    expect(resolveWorkbookPath("/tmp/custom.xlsx")).toBe("/tmp/custom.xlsx");
  });
});
