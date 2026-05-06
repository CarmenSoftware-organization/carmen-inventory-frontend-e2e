import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MigrationMap, MapEntry } from "./propose";

export async function applyToFile(file: string, entries: Pick<MapEntry, "old" | "new">[]): Promise<void> {
  let src = readFileSync(file, "utf8");
  // Sort longest old IDs first to avoid prefix overshadowing (e.g. TC-PR00101 should
  // replace before TC-PR001 if both happen to exist).
  const sorted = [...entries].sort((a, b) => b.old.length - a.old.length);
  for (const e of sorted) {
    const re = new RegExp(`\\b${e.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    src = src.replace(re, e.new);
  }
  writeFileSync(file, src, "utf8");
}

export async function applyModule(modulePrefix: string, mapPath = "docs/migration/test-id-migration-map.json"): Promise<{ specFile: string; renamed: number }> {
  const map: MigrationMap = JSON.parse(readFileSync(resolve(process.cwd(), mapPath), "utf8"));
  const mod = map.modules[modulePrefix];
  if (!mod) throw new Error(`Module ${modulePrefix} not in migration map`);
  await applyToFile(resolve(process.cwd(), mod.specFile), mod.entries);
  return { specFile: mod.specFile, renamed: mod.entries.length };
}

if (import.meta.main) {
  const moduleFlag = process.argv.indexOf("--module");
  if (moduleFlag === -1 || !process.argv[moduleFlag + 1]) {
    console.error("Usage: bun migrate:tc-apply --module <PREFIX>");
    process.exit(2);
  }
  const prefix = process.argv[moduleFlag + 1];
  applyModule(prefix).then(({ specFile, renamed }) => {
    console.log(`[apply] ${specFile}: ${renamed} IDs renamed`);
  });
}
