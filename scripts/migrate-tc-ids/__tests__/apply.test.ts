import { copyFileSync, readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { readFileSync as rfs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { applyToFile } from "../apply";

describe("applyToFile", () => {
  it("renames TC IDs in a spec according to a map", async () => {
    const dir = mkdtempSync(join(tmpdir(), "apply-test-"));
    const target = join(dir, "before.spec.ts");
    copyFileSync("scripts/migrate-tc-ids/__tests__/fixtures/before.spec.ts", target);

    const map = [
      { old: "TC-UN00101", new: "TC-UN-010001" },
      { old: "TC-UN00301", new: "TC-UN-030001" },
    ];
    await applyToFile(target, map);

    const after = readFileSync(target, "utf8");
    expect(after).toContain("TC-UN-010001 list units");
    expect(after).toContain("TC-UN-030001 create unit");
    expect(after).not.toContain("TC-UN00101");
    expect(after).not.toContain("TC-UN00301");
  });
});

describe("applyModule with multi-spec module", () => {
  it("applies entries to every spec listed under the module", async () => {
    const dir = mkdtempSync(join(tmpdir(), "apply-multi-"));
    const specA = join(dir, "spec-a.spec.ts");
    const specB = join(dir, "spec-b.spec.ts");
    writeFileSync(specA, `test("TC-PRC0101 a", async () => {});\n`);
    writeFileSync(specB, `test("TC-PRC0201 b", async () => {});\n`);

    const mapPath = join(dir, "map.json");
    writeFileSync(mapPath, JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      modules: {
        PR: {
          newPrefix: "PR",
          specs: [
            { specFile: specA, entries: [{ old: "TC-PRC0101", new: "TC-PR-050101" }] },
            { specFile: specB, entries: [{ old: "TC-PRC0201", new: "TC-PR-050201" }] },
          ],
        },
      },
    }));

    const { applyModule } = await import("../apply");
    await applyModule("PR", mapPath);

    expect(rfs(specA, "utf8")).toContain("TC-PR-050101");
    expect(rfs(specB, "utf8")).toContain("TC-PR-050201");
  });
});
