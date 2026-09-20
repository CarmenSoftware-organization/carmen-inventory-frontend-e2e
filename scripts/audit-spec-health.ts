/**
 * Generate docs/test-cases/SPEC-HEALTH.md — what the spec suite actually tests.
 *
 * Run: bun audit:spec-health            (rewrites the file)
 *      bun audit:spec-health --check    (fails when the file is out of date)
 *
 * Companion to COVERAGE.md. That file answers "which routes have a spec?";
 * this one answers "and do those specs assert anything?" — a question the
 * TC-ID count hid, because it counts cases a spec declares, including the
 * ones that never run.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { parseSpecHealth, summarize, type SpecSummary } from "./lib/spec-health";

const REPO_ROOT = resolve(__dirname, "..");
const TESTS_DIR = join(REPO_ROOT, "tests");
const OUT_FILE = join(REPO_ROOT, "docs", "test-cases", "SPEC-HEALTH.md");

function loadSummaries(): SpecSummary[] {
  return readdirSync(TESTS_DIR)
    .filter((f) => f.endsWith(".spec.ts"))
    .map((f) => summarize(parseSpecHealth(readFileSync(join(TESTS_DIR, f), "utf8"), f)));
}

function render(rows: SpecSummary[]): string {
  const declared = rows.reduce((s, r) => s + r.run + r.skipped + r.fixme, 0);
  const run = rows.reduce((s, r) => s + r.run, 0);
  const skipped = rows.reduce((s, r) => s + r.skipped, 0);
  const fixme = rows.reduce((s, r) => s + r.fixme, 0);
  const silent = rows.reduce((s, r) => s + r.silent, 0);
  const helperOnly = rows.reduce((s, r) => s + r.helperOnly, 0);
  const trivialOnly = rows.reduce((s, r) => s + r.trivialOnly, 0);
  const assertions = rows.reduce((s, r) => s + r.assertions, 0);
  const guarded = rows.reduce((s, r) => s + r.guarded, 0);
  const dormantPct = declared ? Math.round(((skipped + fixme) * 100) / declared) : 0;

  const lines: string[] = [
    "# Spec Health — what the suite actually tests",
    "",
    "**Generated file — do not edit.** Run `bun audit:spec-health` to refresh.",
    "",
    "Counting TC-IDs answers how many cases a spec *declares*. This counts how many",
    "of them run, and how many of those assert anything. A case that is skipped, or",
    "that runs without an `expect(...)`, reports green and checks nothing.",
    "",
    "| | Count |",
    "| --- | --- |",
    `| Cases declared | ${declared} |`,
    `| **Running** | **${run}** |`,
    `| Skipped | ${skipped} |`,
    `| Fixme | ${fixme} |`,
    `| **Dormant** (skipped + fixme) | **${dormantPct}%** |`,
    `| Running cases asserting only through a page-object helper | ${helperOnly} |`,
    `| **Running cases asserting nothing at all** | **${silent}** |`,
    `| Running cases whose assertions are all trivial | ${trivialOnly} |`,
    `| Running cases behind an in-body skip guard | ${guarded} |`,
    `| Assertions in running cases | ${assertions} |`,
    "",
    "**Trivial** means the assertion cannot fail — `expect(true).toBe(true)` and friends.",
    "**Helper** counts calls like `pr.expectSavedToast()`: the page object asserts, so the case is fine —",
    "it just does not say so in its own body. Only the last row is a case that checks nothing.",
    "",
    "> **What this cannot see:** an assertion helper is recognised by its name (`expectSomething`).",
    "> A page-object method that asserts under another name — `verifyX`, `assertY` — still reads as",
    "> silent here. Open the case before acting on a number; the count is a place to look, not a verdict.",
    "",
    "**Guard** counts running cases holding an in-body `test.skip(condition, ...)`. Dormant does not",
    "include them: the case is declared as running and the reporter shows it, but whether it executes",
    "is decided at runtime by a locator count or a seeded row. A guard that is always true is a case",
    "that never runs and never says so — `304-pr-purchaser-journey.spec.ts` reads as 0% dormant while",
    "four of its cases skip every run, because the page object looks for fields in a collapsed row that",
    "only exist once the row is expanded. A high guard count is a place to look, not a verdict.",
    "",
    "**Catch** counts `.catch(...)` calls in the file; they usually wrap an action, but one",
    "wrapped around an assertion turns a failure into a pass, so a high count is worth a look.",
    "",
    "## Per spec",
    "",
    "Sorted by dormant share, then by cases that assert nothing.",
    "",
    "| Spec | Run | Skip | Fixme | Dormant | Asserts nothing | Helper only | Trivial only | Guarded | Assertions | Catch |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  const sorted = [...rows].sort(
    (a, b) => b.dormantPct - a.dormantPct || b.silent - a.silent || a.file.localeCompare(b.file),
  );
  for (const r of sorted) {
    const flag = (n: number) => (n > 0 ? `**${n}**` : "0");
    lines.push(
      `| \`${r.file}\` | ${r.run} | ${r.skipped} | ${r.fixme} | ${r.dormantPct}% |` +
        ` ${flag(r.silent)} | ${r.helperOnly} | ${flag(r.trivialOnly)} |` +
        ` ${flag(r.guarded)} | ${r.assertions} | ${r.catchCalls} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const markdown = render(loadSummaries());

  if (check) {
    const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
    if (current !== markdown) {
      console.error(`[spec-health] ${basename(OUT_FILE)} is out of date — run: bun audit:spec-health`);
      process.exit(1);
    }
    console.log("[spec-health] up to date");
    process.exit(0);
  }

  writeFileSync(OUT_FILE, markdown);
  const rows = loadSummaries();
  const dormant = rows.reduce((s, r) => s + r.skipped + r.fixme, 0);
  const silent = rows.reduce((s, r) => s + r.silent, 0);
  console.log(
    `[spec-health] wrote ${basename(OUT_FILE)}: ${rows.length} specs, ` +
      `${dormant} dormant cases, ${silent} running cases with no assertion`,
  );
}
