/**
 * Custom Playwright reporter that writes test-case results back to CSV
 * files keyed by Test ID (TC-XXX) parsed from the test title.
 *
 * Writes one CSV per spec file into the output directory, named
 * after the spec basename: `login.spec.ts` → `login-results.csv`.
 *
 * Columns: Test ID, Title, Status, Duration (ms), Error, Test Date
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
  // e2e/login.spec.ts → login
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
    const header = ["Test ID", "Title", "Status", "Duration (ms)", "Error", "Test Date"];
    for (const [key, rows] of this.rowsBySpec) {
      rows.sort((a, b) => a.id.localeCompare(b.id));
      const lines = [header.join(",")];
      for (const r of rows) {
        lines.push(
          [r.id, r.title, r.status, String(r.duration), r.error, r.date]
            .map(csvEscape)
            .join(","),
        );
      }
      const outFile = resolve(this.outDir, `${key}-results.csv`);
      writeFileSync(outFile, lines.join("\n") + "\n", "utf8");
      // eslint-disable-next-line no-console
      console.log(`[tc-csv-reporter] Wrote ${rows.length} rows → ${outFile}`);
    }
  }
}
