import { describe, it, expect } from "vitest";
import { defaultBu, buLabel, escapeRegExp, type BusinessUnit } from "../tests/helpers/bu";

const bu = (over: Partial<BusinessUnit>): BusinessUnit => ({
  id: "id",
  name: "Name",
  code: "CODE",
  alias_name: null,
  is_default: false,
  ...over,
});

describe("defaultBu", () => {
  it("returns the BU flagged is_default", () => {
    const units = [bu({ code: "A" }), bu({ code: "B", is_default: true })];
    expect(defaultBu(units)?.code).toBe("B");
  });

  it("falls back to the first BU when none is default", () => {
    const units = [bu({ code: "A" }), bu({ code: "B" })];
    expect(defaultBu(units)?.code).toBe("A");
  });

  it("returns undefined for an empty list", () => {
    expect(defaultBu([])).toBeUndefined();
  });
});

describe("buLabel", () => {
  it("joins alias_name and name when alias present", () => {
    expect(buLabel(bu({ alias_name: "BLAVG", name: "Blue Hotel" }))).toBe("BLAVG - Blue Hotel");
  });

  it("uses name alone when alias is null", () => {
    expect(buLabel(bu({ alias_name: null, name: "Blue Hotel" }))).toBe("Blue Hotel");
  });
});

describe("escapeRegExp", () => {
  it("escapes regex metacharacters", () => {
    expect(escapeRegExp("A+B (x)")).toBe("A\\+B \\(x\\)");
  });

  it("escapes dot, dollar, and bracket metacharacters", () => {
    expect(escapeRegExp("price: $9.99 [USD]")).toBe("price: \\$9\\.99 \\[USD\\]");
  });
});
