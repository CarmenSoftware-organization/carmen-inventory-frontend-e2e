import { describe, expect, it } from "vitest";
import { proposeMapping } from "../propose";

describe("proposeMapping", () => {
  it("decodes 5-digit legacy SSNNN", () => {
    expect(proposeMapping("TC-PR00101", "PR", "PR")).toEqual({
      old: "TC-PR00101",
      new: "TC-PR-010001",
      rule: "5-digit:section=001->01,seq=01->0001",
      needsReview: false,
      helperGenerated: false,
      note: "",
    });
  });

  it("decodes 4-digit legacy SSNN for sub-journey prefixes", () => {
    expect(proposeMapping("TC-POA0301", "POA", "PO", { POA: { "03": "07" } })).toEqual({
      old: "TC-POA0301",
      new: "TC-PO-070001",
      rule: "4-digit:prefix-collapse(POA->PO),section=03->07,seq=01->0001",
      needsReview: false,
      helperGenerated: false,
      note: "",
    });
  });

  it("flags 3-digit legacy as needsReview", () => {
    const out = proposeMapping("TC-CAM001", "CAM", "CAM");
    expect(out.new).toBe("TC-CAM-900001");
    expect(out.needsReview).toBe(true);
    expect(out.note).toMatch(/assign correct section/i);
  });

  it("collapses non-canonical prefix into a section", () => {
    expect(proposeMapping("TC-CATEG12345", "CATEG", "CAT", { CATEG: { "default": "01" } })).toEqual({
      old: "TC-CATEG12345",
      new: "TC-CAT-010001",
      rule: "5-digit:prefix-collapse(CATEG->CAT),section=default->01,seq=12345->0001",
      needsReview: true,
      helperGenerated: false,
      note: "Reviewer: confirm sequence reassignment from 12345",
    });
  });
});
