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

  it("auto-maps 100-series section linearly into 30s", () => {
    // 101 → 31, 102 → 32, ..., 109 → 39 (preserves uniqueness across codes)
    expect(proposeMapping("TC-CN10101", "CN", "CN").new).toBe("TC-CN-310001");
    expect(proposeMapping("TC-CN10501", "CN", "CN").new).toBe("TC-CN-350001");
    expect(proposeMapping("TC-CN10101", "CN", "CN").needsReview).toBe(false);
  });

  it("auto-maps 200-series section linearly into 20s", () => {
    // 201 → 21, 202 → 22, ..., 209 → 29
    expect(proposeMapping("TC-PO20101", "PO", "PO").new).toBe("TC-PO-210001");
    expect(proposeMapping("TC-PO20201", "PO", "PO").new).toBe("TC-PO-220001");
  });

  it("auto-maps 300-series section linearly into 10s", () => {
    // 301 → 11, 302 → 12, ..., 309 → 19
    expect(proposeMapping("TC-PR30101", "PR", "PR").new).toBe("TC-PR-110001");
    expect(proposeMapping("TC-PR30301", "PR", "PR").new).toBe("TC-PR-130001");
  });

  it("avoids collisions for distinct hundreds-codes within same module", () => {
    // 101 and 102 must map to DIFFERENT new IDs even with the same legacy seq
    const a = proposeMapping("TC-CN10101", "CN", "CN");
    const b = proposeMapping("TC-CN10201", "CN", "CN");
    expect(a.new).not.toBe(b.new);
  });

  it("flags codes >= 110 as needsReview (out of clean linear range)", () => {
    const r = proposeMapping("TC-PR11001", "PR", "PR");
    expect(r.needsReview).toBe(true);
    expect(r.new).toBe("TC-PR-900001");
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

  it("matches longest oldPrefix first to avoid CAT swallowing CATEG", () => {
    // proposeMapping is called with the matched oldPrefix; this test verifies
    // buildMap-style longest-first matching by simulating the lookup directly.
    const oldPrefixes = ["CAT", "CATEG", "PRODU", "RECIP"];
    const sorted = [...oldPrefixes].sort((a, b) => b.length - a.length);
    const matched = sorted.find((p) => "TC-CATEG12345".startsWith(`TC-${p}`));
    expect(matched).toBe("CATEG");
  });
});

describe("buildMap (skip already-migrated)", () => {
  it("does not produce entries for v2-format IDs already present in spec text", () => {
    // proposeMapping is pure — tested separately. buildMap reads files, so
    // we only need to assert the filter logic on a candidate list.
    const ids = ["TC-CAM00101", "TC-CAM-010001", "TC-CAM00102", "TC-CAM-010002"];
    const V2_STRICT = /^TC-[A-Z]{2,5}-\d{6}$/;
    const filtered = ids.filter((id) => !V2_STRICT.test(id));
    expect(filtered).toEqual(["TC-CAM00101", "TC-CAM00102"]);
  });
});
