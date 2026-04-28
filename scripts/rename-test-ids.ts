#!/usr/bin/env bun
/**
 * One-shot migration: pad all 2-digit TC/TCS test IDs to the 5-digit
 * hierarchical form used by newer modules.
 *
 *   TC-L01      → TC-L00101       (treats flat tests as section 001)
 *   TC-VEN28    → TC-VEN00128
 *   TCS-AT11    → TCS-AT00111
 *
 * Already 5-digit IDs (e.g. TC-CAM00101) are left untouched. 3-digit
 * "section header" comments (e.g. TC-CAM001) are also untouched —
 * they document feature groups, not test cases.
 *
 * Run with: bun scripts/rename-test-ids.ts
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// Match TCS?-<AREA><NN> with exactly 2 trailing digits and a word boundary
// so we don't catch 3-digit section markers or 5-digit IDs.
const TWO_DIGIT_RE = /\b(TCS?-[A-Z]{1,4})(\d{2})\b/g;

function pad(id: string): string {
  return id.replace(TWO_DIGIT_RE, (_, prefix, nn) => `${prefix}001${nn}`);
}

function rewrite(path: string): { changed: boolean; renames: number } {
  const before = readFileSync(path, "utf8");
  let count = 0;
  const after = before.replace(TWO_DIGIT_RE, (_, prefix, nn) => {
    count += 1;
    return `${prefix}001${nn}`;
  });
  if (count === 0) return { changed: false, renames: 0 };
  writeFileSync(path, after, "utf8");
  return { changed: true, renames: count };
}

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "dist") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (exts.some((e) => name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

const targets = [
  ...walk(join(ROOT, "tests"), [".ts"]),
  ...walk(join(ROOT, "tests/results"), [".json"]),
  join(ROOT, "tests/README.md"),
  join(ROOT, "README.md"),
  join(ROOT, "e2e_test.md"),
  join(ROOT, "CLAUDE.md"),
];

let totalRenames = 0;
let changedFiles = 0;
for (const file of targets) {
  try {
    const { changed, renames } = rewrite(file);
    if (changed) {
      changedFiles += 1;
      totalRenames += renames;
      console.log(`  [${renames.toString().padStart(4)}] ${file.replace(ROOT, "")}`);
    }
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
}

console.log(`\nRenamed ${totalRenames} occurrences across ${changedFiles} files.`);

// Sanity check exposed for quick assertion
export { pad };
