import { copyFileSync, readFileSync, mkdtempSync } from "node:fs";
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
