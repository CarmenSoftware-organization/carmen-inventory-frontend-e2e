import { describe, expect, it } from "vitest";
import { auditFile } from "../audit-tc-ids";

const FIXTURES = "scripts/__tests__/fixtures";

describe("audit-tc-ids", () => {
  it("passes a well-formed spec", async () => {
    const result = await auditFile(`${FIXTURES}/audit-good.spec.ts`);
    expect(result.errors).toEqual([]);
  });

  it("rejects 3-digit legacy format in strict mode", async () => {
    const result = await auditFile(`${FIXTURES}/audit-bad-format.spec.ts`);
    expect(result.errors.some((e) => e.code === "FORMAT")).toBe(true);
  });

  it("rejects unknown prefix", async () => {
    const result = await auditFile(`${FIXTURES}/audit-bad-format.spec.ts`);
    expect(result.errors.some((e) => e.code === "UNKNOWN_PREFIX")).toBe(true);
  });

  it("rejects multiple prefixes in one spec", async () => {
    const result = await auditFile(`${FIXTURES}/audit-multi-prefix.spec.ts`);
    expect(result.errors.some((e) => e.code === "MULTI_PREFIX")).toBe(true);
  });

  it("does not flag annotation references as DUPLICATE", async () => {
    const result = await auditFile(`${FIXTURES}/audit-annotation-refs.spec.ts`);
    const dups = result.errors.filter((e) => e.code === "DUPLICATE");
    expect(dups).toEqual([]);
  });

  it("flags real duplicate test titles as DUPLICATE", async () => {
    const result = await auditFile(`${FIXTURES}/audit-real-duplicate.spec.ts`);
    const dups = result.errors.filter((e) => e.code === "DUPLICATE");
    expect(dups.length).toBe(1);
  });
});
