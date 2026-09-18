/**
 * Covers auditAll() and loadCatalog() by running them over the real repo.
 *
 * Doubling as the CI gate CLAUDE.md requires before merge ("bun audit:tc-ids
 * must pass"): a spec that adds an unregistered prefix or an out-of-catalog
 * section fails here, in the unit run, instead of only in the separate audit
 * command nobody remembers to invoke.
 */
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { auditAll, loadCatalog } from "../audit-tc-ids";

describe("loadCatalog", () => {
  const catalog = loadCatalog();

  it("registers every module documented in docs/test-id-scheme.md", () => {
    expect(catalog.modules.size).toBeGreaterThan(20);
  });

  it("maps a known prefix to its spec and section block", () => {
    const dep = catalog.modules.get("DEP");
    expect(dep?.spec).toMatch(/department\.spec\.ts$/);
    expect(dep?.sections.has("01")).toBe(true);
  });

  it("expands a section range into every section in it", () => {
    const withRange = [...catalog.modules.values()].find((m) => m.sections.size > 1);
    expect(withRange).toBeDefined();
    expect([...withRange!.sections].every((s) => /^\d{2}$/.test(s))).toBe(true);
  });

  it("throws when the catalog file is missing", () => {
    expect(() => loadCatalog("docs/does-not-exist.md")).toThrow();
  });
});

describe("auditAll", () => {
  it("audits every spec in tests/", async () => {
    const specs = readdirSync("tests").filter((f) => f.endsWith(".spec.ts"));
    const results = await auditAll();

    expect(results).toHaveLength(specs.length);
  });

  it("finds no TC-ID errors anywhere in the suite", async () => {
    const results = await auditAll();
    const errors = results.flatMap((r) =>
      r.errors.map((e) => `${e.code} ${r.file.split("/").pop()}: ${e.message}`),
    );

    expect(errors).toEqual([]);
  });

  it("collects TC IDs from the suite", async () => {
    const results = await auditAll();
    const total = results.reduce((n, r) => n + r.ids.length, 0);

    expect(total).toBeGreaterThan(100);
  });

  it("legacy mode also reports no errors", async () => {
    const results = await auditAll({ legacyMode: true });

    expect(results.flatMap((r) => r.errors)).toEqual([]);
  });
});
