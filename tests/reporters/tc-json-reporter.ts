/**
 * Custom Playwright reporter that writes test-case results as JSON, one file
 * per spec. Using JSON (instead of CSV) sidesteps escaping and multi-line
 * issues that were breaking the Google Sheets sync — each row is a structured
 * object with well-defined fields.
 *
 * Output: `<outputDir>/<spec-basename>-results.json`
 *   e.g. `tests/results/001-login-results.json`
 *
 * Each file contains an array of rows. Row shape:
 *   {
 *     "seq": 1,
 *     "testId": "TC-L00101",
 *     "title": "TC-L00101 Requestor เข้าสู่ระบบสำเร็จ",
 *     "preconditions": "...",
 *     "steps": "1. ...\n2. ...",
 *     "expected": "...",
 *     "priority": "High",
 *     "testType": "Smoke",
 *     "status": "Pass",
 *     "runDate": "2026-04-23T10:34:17.250Z",
 *     "duration": 2521,
 *     "error": "",
 *     "note": ""
 *   }
 *
 * Rows are sorted by `testId` before writing. `seq` is a 1-based index within
 * the sorted list.
 *
 * Reporter-populated fields: seq, testId, title, status, runDate, duration, error.
 * Annotation-populated (from Playwright `test.annotations`):
 *   preconditions | steps | expected | priority | testType | note
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

export interface TCResultRow {
  seq: number;
  testId: string;
  title: string;
  preconditions: string;
  steps: string;
  expected: string;
  priority: string;
  testType: string;
  status: string;
  runDate: string;
  duration: number;
  error: string;
  note: string;
}

const TC_REGEX = /\bTC-[A-Z]{2,5}-\d{6}\b/g;

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
  return basename(file).replace(/\.spec\.(ts|js|tsx|jsx)$/, "");
}

const SPEC_FILE_RE = /\.spec\.(ts|js|tsx|jsx)$/;

/**
 * Walk parent suites to find the spec file that registered this test. Tests
 * created by shared helpers (e.g. `tests/helpers/security-cases.ts`) have
 * `test.location.file` pointing at the helper, but the enclosing suite chain
 * still hangs off the consuming spec's file-level suite. Returns undefined if
 * no `.spec.ts` ancestor exists.
 */
function findSpecFile(test: TestCase): string | undefined {
  let suite: Suite | undefined = test.parent;
  while (suite) {
    const file = suite.location?.file;
    if (file && SPEC_FILE_RE.test(file)) return file;
    suite = suite.parent;
  }
  return undefined;
}

/**
 * Map Playwright test annotations → row metadata fields.
 * Supported annotation `type` (case-insensitive): preconditions | steps |
 * expected (or expectedResult) | priority | testType | note. Multiple
 * annotations of the same type are joined with newlines.
 */
function readAnnotations(test: TestCase) {
  const out = {
    preconditions: "",
    steps: "",
    expected: "",
    priority: "",
    testType: "",
    note: "",
  };
  for (const a of test.annotations) {
    const type = a.type?.toLowerCase() ?? "";
    const desc = a.description ?? "";
    switch (type) {
      case "preconditions":
      case "precondition":
        out.preconditions = out.preconditions ? `${out.preconditions}\n${desc}` : desc;
        break;
      case "steps":
      case "step":
        out.steps = out.steps ? `${out.steps}\n${desc}` : desc;
        break;
      case "expected":
      case "expectedresult":
      case "expected result":
        out.expected = out.expected ? `${out.expected}\n${desc}` : desc;
        break;
      case "priority":
        out.priority = desc;
        break;
      case "testtype":
      case "test type":
      case "type":
        out.testType = desc;
        break;
      case "note":
      case "notes":
        out.note = out.note ? `${out.note}\n${desc}` : desc;
        break;
    }
  }
  return out;
}

type PartialRow = Omit<TCResultRow, "seq">;

export default class TCJsonReporter implements Reporter {
  private rowsBySpec = new Map<string, PartialRow[]>();
  private outDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "tests/results");
  }

  onBegin(_config: FullConfig) {
    this.rowsBySpec.clear();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const ids = test.title.match(TC_REGEX);
    if (!ids || ids.length === 0) return;
    const runDate = new Date().toISOString();
    const status = statusLabel(result);
    const error = result.error?.message?.split("\n")[0] ?? "";
    const key = specKey(findSpecFile(test) ?? test.location.file);
    const bucket = this.rowsBySpec.get(key) ?? [];
    const meta = readAnnotations(test);
    for (const id of ids) {
      bucket.push({
        testId: id,
        title: test.title,
        status,
        duration: Math.round(result.duration),
        error,
        runDate,
        ...meta,
      });
    }
    this.rowsBySpec.set(key, bucket);
  }

  async onEnd(_result: FullResult) {
    mkdirSync(this.outDir, { recursive: true });
    for (const [key, partials] of this.rowsBySpec) {
      partials.sort((a, b) => a.testId.localeCompare(b.testId));
      const rows: TCResultRow[] = partials.map((p, i) => ({ seq: i + 1, ...p }));
      const outFile = resolve(this.outDir, `${key}-results.json`);
      writeFileSync(outFile, JSON.stringify(rows, null, 2) + "\n", "utf8");
      // eslint-disable-next-line no-console
      console.log(`[tc-json-reporter] Wrote ${rows.length} rows → ${outFile}`);
    }
  }
}
