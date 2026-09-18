/**
 * Covers buildMap() and guards SPEC_CONFIG against spec renames.
 *
 * The rename guard is the point: every 3xx–7xx spec was shortened at some
 * point (301-purchase-request.spec.ts -> 301-pr.spec.ts) and SPEC_CONFIG was
 * never updated, so `bun migrate:tc-propose` threw ENOENT on the first stale
 * entry. That failure was invisible because nothing exercised buildMap.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildMap, SPEC_CONFIG } from "../propose";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SPEC_CONFIG", () => {
  it("names only spec files that exist on disk", () => {
    const missing = SPEC_CONFIG.map((c) => c.specFile).filter(
      (f) => !existsSync(resolve(process.cwd(), f)),
    );

    expect(missing).toEqual([]);
  });

  it("gives every entry a new prefix and at least one old prefix", () => {
    for (const cfg of SPEC_CONFIG) {
      expect(cfg.newPrefix, cfg.specFile).toMatch(/^[A-Z]{2,5}$/);
      expect(cfg.oldPrefixes.length, cfg.specFile).toBeGreaterThan(0);
    }
  });

  it("lists each spec file only once", () => {
    const files = SPEC_CONFIG.map((c) => c.specFile);

    expect(new Set(files).size).toBe(files.length);
  });
});

describe("buildMap", () => {
  it("runs over the whole config without throwing", () => {
    const map = buildMap();

    expect(map.version).toBe(1);
    expect(Object.keys(map.modules).length).toBeGreaterThan(20);
  });

  it("reports nothing missing while SPEC_CONFIG is in sync", () => {
    expect(buildMap().missing).toEqual([]);
  });

  it("stamps generatedAt as an ISO-8601 timestamp", () => {
    expect(buildMap().generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
  });

  it("registers one spec entry per configured spec under its new prefix", () => {
    const map = buildMap();
    const specCount = Object.values(map.modules).reduce((n, m) => n + m.specs.length, 0);

    expect(specCount).toBe(SPEC_CONFIG.length);
  });

  it("proposes no mapping now that every TC ID is already v2", () => {
    // V2_STRICT IDs are filtered out, so a fully-migrated suite yields an empty
    // map. This asserting empty IS the migration-complete signal; if a legacy
    // ID reappears in a spec, this test turns red and names the module.
    const map = buildMap();
    const withEntries = Object.entries(map.modules)
      .flatMap(([prefix, m]) =>
        m.specs.filter((s) => s.entries.length > 0).map((s) => `${prefix}:${s.specFile}`),
      );

    expect(withEntries).toEqual([]);
  });

  it("skips a spec that has gone missing instead of throwing, and names it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const real = SPEC_CONFIG[0].specFile;
    SPEC_CONFIG[0].specFile = "tests/999-was-renamed.spec.ts";
    try {
      const map = buildMap();

      expect(map.missing).toEqual(["tests/999-was-renamed.spec.ts"]);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("999-was-renamed"));
      // the other 32 modules still got built
      expect(Object.keys(map.modules).length).toBeGreaterThan(20);
    } finally {
      SPEC_CONFIG[0].specFile = real;
    }
  });
});
