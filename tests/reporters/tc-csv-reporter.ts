/**
 * Custom Playwright reporter that writes test-case results back to CSV
 * files keyed by Test ID (TC-XXX) parsed from the test title.
 *
 * Writes one CSV per spec file into the output directory, named
 * after the spec basename: `001-login.spec.ts` → `001-login-results.csv`.
 *
 * Columns:
 *   Seq | Test ID | Title | Preconditions | Steps | Expected Result |
 *   Priority | Test Type | Status | Run Date | Duration (ms) | Error | Note
 *
 * Reporter-populated: Seq, Test ID, Title, Status, Run Date, Duration (ms), Error.
 * Human-authored (left blank; filled manually in the spreadsheet): Preconditions,
 * Steps, Expected Result, Priority, Test Type, Note. The sync script preserves
 * these cells — it only overwrites the reporter-populated columns.
 *
 * `Seq` is a 1-based running number per module. Rows are sorted by Test ID
 * before numbering, so Seq mirrors the sorted TC-<area><NN> order.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

interface Row {
  id: string;
  title: string;
  status: string;
  duration: number;
  error: string;
  date: string;
}

const TC_REGEX = /\b(TCS?-[A-Z]{0,4}\d{2,})\b/g;

function csvEscape(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function statusLabel(result: TestResult): string {
  switch (result.status) {
    case "passed":
      return "Pass";
    case "failed":
    case "timedOut":
      return "Fail";
    case "skipped":
      return "Skipped";
    case "interrupted":
      return "Interrupted";
    default:
      return result.status;
  }
}

function specKey(file: string): string {
  // tests/001-login.spec.ts → 001-login
  return basename(file).replace(/\.spec\.(ts|js|tsx|jsx)$/, "");
}

export default class TCCsvReporter implements Reporter {
  private rowsBySpec = new Map<string, Row[]>();
  private outDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "e2e/results");
  }

  onBegin(_config: FullConfig) {
    this.rowsBySpec.clear();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const ids = test.title.match(TC_REGEX);
    if (!ids || ids.length === 0) return;
    const date = new Date().toISOString();
    const status = statusLabel(result);
    const error = result.error?.message?.split("\n")[0] ?? "";
    const key = specKey(test.location.file);
    const bucket = this.rowsBySpec.get(key) ?? [];
    for (const id of ids) {
      bucket.push({
        id,
        title: test.title,
        status,
        duration: Math.round(result.duration),
        error,
        date,
      });
    }
    this.rowsBySpec.set(key, bucket);
  }

  async onEnd(_result: FullResult) {
    mkdirSync(this.outDir, { recursive: true });
    const header = [
      "Seq",
      "Test ID",
      "Title",
      "Preconditions",
      "Steps",
      "Expected Result",
      "Priority",
      "Test Type",
      "Status",
      "Run Date",
      "Duration (ms)",
      "Error",
      "Note",
    ];
    for (const [key, rows] of this.rowsBySpec) {
      rows.sort((a, b) => a.id.localeCompare(b.id));
      const lines = [header.join(",")];
      rows.forEach((r, i) => {
        lines.push(
          [
            String(i + 1),
            r.id,
            r.title,
            "", // Preconditions
            "", // Steps
            "", // Expected Result
            "", // Priority
            "", // Test Type
            r.status,
            r.date,
            String(r.duration),
            r.error,
            "", // Note
          ]
            .map(csvEscape)
            .join(","),
        );
      });
      const outFile = resolve(this.outDir, `${key}-results.csv`);
      writeFileSync(outFile, lines.join("\n") + "\n", "utf8");
      // eslint-disable-next-line no-console
      console.log(`[tc-csv-reporter] Wrote ${rows.length} rows → ${outFile}`);
    }
  }
}
