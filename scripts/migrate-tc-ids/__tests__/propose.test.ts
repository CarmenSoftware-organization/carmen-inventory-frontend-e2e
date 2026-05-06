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

  it("auto-maps 100-series section to 30s when no explicit mapping", () => {
    const r = proposeMapping("TC-CN10101", "CN", "CN");
    expect(r.new).toBe("TC-CN-300001");
    expect(r.needsReview).toBe(false);
  });

  it("auto-maps 200-series section to 20s", () => {
    const r = proposeMapping("TC-PO20101", "PO", "PO");
    expect(r.new).toBe("TC-PO-200001");
    expect(r.needsReview).toBe(false);
  });

  it("auto-maps 300-series section to 10s", () => {
    const r = proposeMapping("TC-PR30101", "PR", "PR");
    expect(r.new).toBe("TC-PR-100001");
    expect(r.needsReview).toBe(false);
  });

  it("preserves full 4 digits as seq when sub-journey collapses with default-only", () => {
    const r = proposeMapping("TC-PRC0301", "PRC", "PR", { PRC: { default: "05" } });
    expect(r.new).toBe("TC-PR-050301");
    expect(r.needsReview).toBe(false);
    expect(r.rule).toContain("section=default->05");
    expect(r.rule).toContain("seq=0301->0301");
  });

  it("does not collide when multiple 4-digit sub-sections collapse via default", () => {
    const a = proposeMapping("TC-PRC0101", "PRC", "PR", { PRC: { default: "05" } });
    const b = proposeMapping("TC-PRC0201", "PRC", "PR", { PRC: { default: "05" } });
    expect(a.new).not.toBe(b.new);
  });

  it("never flags CRUD tests at seq 09-12 as helperGenerated", () => {
    const r = proposeMapping("TC-VEN00109", "VEN", "VEN", { VEN: { "001": "01" } });
    expect(r.helperGenerated).toBe(false);
  });
});
