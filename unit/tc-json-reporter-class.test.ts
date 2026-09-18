/**
 * Covers the reporter class itself — annotation mapping, TC-ID extraction,
 * spec-file resolution and the JSON written at the end of a run. The four
 * attachment helpers are covered in tc-json-reporter.test.ts.
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import TCJsonReporter, { type TCResultRow } from "../tests/reporters/tc-json-reporter";

type Ann = { type: string; description?: string };

const tmpDirs: string[] = [];
function workdir(): string {
  const d = mkdtempSync(join(tmpdir(), "tcjson-"));
  tmpDirs.push(d);
  return d;
}
afterEach(() => {
  for (const d of tmpDirs.splice(0)) rmSync(d, { recursive: true, force: true });
  vi.restoreAllMocks();
});

/** A TestCase whose parent chain ends at a file-level suite for `specFile`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testCase(title: string, opts: { annotations?: Ann[]; specFile?: string; locationFile?: string } = {}): any {
  const specFile = opts.specFile ?? "/repo/tests/010-department.spec.ts";
  return {
    title,
    annotations: opts.annotations ?? [],
    location: { file: opts.locationFile ?? specFile },
    parent: {
      location: { file: "/repo/tests/helpers/security-cases.ts" },
      parent: { location: { file: specFile }, parent: undefined },
    },
  };
}

/** A TestCase with no .spec.ts anywhere in its suite chain. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function orphanCase(title: string, locationFile: string): any {
  return {
    title,
    annotations: [],
    location: { file: locationFile },
    parent: { location: { file: "/repo/tests/helpers/security-cases.ts" }, parent: undefined },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function result(over: Record<string, unknown> = {}): any {
  return { status: "passed", duration: 1234.6, attachments: [], ...over };
}

function read(dir: string, key: string): TCResultRow[] {
  return JSON.parse(readFileSync(join(dir, `${key}-results.json`), "utf8"));
}

async function run(
  reporter: TCJsonReporter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pairs: Array<[any, any]>,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reporter.onBegin({} as any);
  for (const [t, r] of pairs) reporter.onTestEnd(t, r);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await reporter.onEnd({} as any);
}

describe("TCJsonReporter.onTestEnd", () => {
  it("writes one row per TC ID found in the title", async () => {
    const out = workdir();
    const reporter = new TCJsonReporter({ outputDir: out });

    await run(reporter, [[testCase("TC-DEP-010001 สร้างแผนกสำเร็จ"), result()]]);

    const rows = read(out, "010-department");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      seq: 1,
      testId: "TC-DEP-010001",
      title: "TC-DEP-010001 สร้างแผนกสำเร็จ",
      status: "Pass",
      duration: 1235, // rounded
      error: "",
    });
  });

  it("fans one test out into a row per ID when the title names several", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 / TC-DEP-010002 combined"), result()],
    ]);

    expect(read(out, "010-department").map((r) => r.testId)).toEqual([
      "TC-DEP-010001",
      "TC-DEP-010002",
    ]);
  });

  it("ignores a test whose title carries no TC ID", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("beforeEach hook"), result()],
    ]);

    expect(existsSync(join(out, "010-department-results.json"))).toBe(false);
  });

  it("ignores a legacy 3-digit ID that does not match the strict TC format", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-001 legacy"), result()],
    ]);

    expect(existsSync(join(out, "010-department-results.json"))).toBe(false);
  });

  it.each([
    ["passed", "Pass"],
    ["failed", "Fail"],
    ["timedOut", "Fail"],
    ["skipped", "Skipped"],
    ["interrupted", "Interrupted"],
  ])("maps Playwright status %s to %s", async (status, label) => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 x"), result({ status })],
    ]);

    expect(read(out, "010-department")[0].status).toBe(label);
  });

  it("passes an unknown status through unchanged", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 x"), result({ status: "flaky" })],
    ]);

    expect(read(out, "010-department")[0].status).toBe("flaky");
  });

  it("records only the first line of a failure message", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [
        testCase("TC-DEP-010001 x"),
        result({ status: "failed", error: { message: "expect(locator).toBeVisible()\n\nCall log:\n  - waiting" } }),
      ],
    ]);

    expect(read(out, "010-department")[0].error).toBe("expect(locator).toBeVisible()");
  });

  it("files a helper-registered test under the consuming spec, not the helper", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [
        testCase("TC-DEP-010004 XSS", {
          locationFile: "/repo/tests/helpers/security-cases.ts",
          specFile: "/repo/tests/010-department.spec.ts",
        }),
        result(),
      ],
    ]);

    expect(existsSync(join(out, "010-department-results.json"))).toBe(true);
    expect(existsSync(join(out, "security-cases-results.json"))).toBe(false);
  });

  it("falls back to the test's own file when no spec ancestor exists", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [orphanCase("TC-DEP-010001 x", "/repo/tests/standalone.spec.ts"), result()],
    ]);

    expect(read(out, "standalone")[0].testId).toBe("TC-DEP-010001");
  });
});

describe("TCJsonReporter annotations", () => {
  const full: Ann[] = [
    { type: "preconditions", description: "ล็อกอินเป็น admin" },
    { type: "steps", description: "1. เปิดหน้า\n2. กดเพิ่ม" },
    { type: "expected", description: "toast สำเร็จ" },
    { type: "priority", description: "High" },
    { type: "testType", description: "CRUD" },
    { type: "note", description: "ดูเพิ่ม" },
  ];

  it("maps all five required fields plus note", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 x", { annotations: full }), result()],
    ]);

    expect(read(out, "010-department")[0]).toMatchObject({
      preconditions: "ล็อกอินเป็น admin",
      steps: "1. เปิดหน้า\n2. กดเพิ่ม",
      expected: "toast สำเร็จ",
      priority: "High",
      testType: "CRUD",
      note: "ดูเพิ่ม",
    });
  });

  it.each([
    ["PRECONDITIONS", "preconditions"],
    ["Precondition", "preconditions"],
    ["Steps", "steps"],
    ["step", "steps"],
    ["ExpectedResult", "expected"],
    ["expected result", "expected"],
    ["TESTTYPE", "testType"],
    ["test type", "testType"],
    ["type", "testType"],
    ["notes", "note"],
  ])("accepts annotation type %s as %s", async (type, field) => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 x", { annotations: [{ type, description: "v" }] }), result()],
    ]);

    expect(read(out, "010-department")[0][field as keyof TCResultRow]).toBe("v");
  });

  it("joins repeated annotations of the same type with newlines", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [
        testCase("TC-DEP-010001 x", {
          annotations: [
            { type: "steps", description: "1. a" },
            { type: "steps", description: "2. b" },
          ],
        }),
        result(),
      ],
    ]);

    expect(read(out, "010-department")[0].steps).toBe("1. a\n2. b");
  });

  it("keeps the last value for single-valued priority", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [
        testCase("TC-DEP-010001 x", {
          annotations: [
            { type: "priority", description: "Low" },
            { type: "priority", description: "High" },
          ],
        }),
        result(),
      ],
    ]);

    expect(read(out, "010-department")[0].priority).toBe("High");
  });

  it("leaves fields blank for an unknown annotation type or a missing description", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [
        testCase("TC-DEP-010001 x", {
          annotations: [{ type: "issue", description: "#42" }, { type: "priority" }],
        }),
        result(),
      ],
    ]);

    expect(read(out, "010-department")[0]).toMatchObject({ priority: "", preconditions: "", note: "" });
  });
});

describe("TCJsonReporter attachments", () => {
  it("copies the screenshot per TC ID and records its relative path", async () => {
    const base = workdir();
    const src = join(base, "shot.png");
    writeFileSync(src, "PNG");
    const shots = join(base, "screenshots");

    await run(new TCJsonReporter({ outputDir: base, screenshotsDir: shots }), [
      [testCase("TC-DEP-010001 a"), result({ attachments: [{ name: "screenshot", path: src }] })],
    ]);

    expect(read(base, "010-department")[0].screenshot).toBe(`${shots}/TC-DEP-010001.png`);
    expect(readFileSync(join(shots, "TC-DEP-010001.png"), "utf8")).toBe("PNG");
  });

  it("copies the video per TC ID and records its relative path", async () => {
    const base = workdir();
    const src = join(base, "v.webm");
    writeFileSync(src, "WEBM");
    const videos = join(base, "videos");

    await run(new TCJsonReporter({ outputDir: base, videosDir: videos }), [
      [testCase("TC-DEP-010001 a"), result({ attachments: [{ name: "video", path: src }] })],
    ]);

    expect(read(base, "010-department")[0].video).toBe(`${videos}/TC-DEP-010001.webm`);
  });

  it("leaves the row usable when the video copy throws", async () => {
    const base = workdir();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await run(new TCJsonReporter({ outputDir: base, videosDir: join(base, "videos") }), [
      [
        testCase("TC-DEP-010001 a"),
        result({ attachments: [{ name: "video", path: join(base, "missing.webm") }] }),
      ],
    ]);

    const row = read(base, "010-department")[0];
    expect(row.video).toBe("");
    expect(row.status).toBe("Pass");
    expect(warn).toHaveBeenCalled();
  });

  it("leaves both paths empty when the test produced no attachments", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [[testCase("TC-DEP-010001 a"), result()]]);

    expect(read(out, "010-department")[0]).toMatchObject({ screenshot: "", video: "" });
  });
});

describe("TCJsonReporter.onEnd", () => {
  it("sorts rows by testId and renumbers seq from 1", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010003 c"), result()],
      [testCase("TC-DEP-010001 a"), result()],
      [testCase("TC-DEP-010002 b"), result()],
    ]);

    expect(read(out, "010-department").map((r) => [r.seq, r.testId])).toEqual([
      [1, "TC-DEP-010001"],
      [2, "TC-DEP-010002"],
      [3, "TC-DEP-010003"],
    ]);
  });

  it("writes one file per spec", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [
      [testCase("TC-DEP-010001 a"), result()],
      [testCase("TC-CUR-020001 b", { specFile: "/repo/tests/020-currency.spec.ts" }), result()],
    ]);

    expect(read(out, "010-department")).toHaveLength(1);
    expect(read(out, "020-currency")).toHaveLength(1);
  });

  it("onBegin clears rows carried over from a previous run", async () => {
    const out = workdir();
    const reporter = new TCJsonReporter({ outputDir: out });

    await run(reporter, [[testCase("TC-DEP-010001 a"), result()]]);
    await run(reporter, [[testCase("TC-DEP-010002 b"), result()]]);

    expect(read(out, "010-department").map((r) => r.testId)).toEqual(["TC-DEP-010002"]);
  });

  it("writes nothing when no test carried a TC ID", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), []);

    expect(existsSync(join(out, "010-department-results.json"))).toBe(false);
  });

  it("stamps runDate as an ISO-8601 timestamp", async () => {
    const out = workdir();
    await run(new TCJsonReporter({ outputDir: out }), [[testCase("TC-DEP-010001 a"), result()]]);

    expect(read(out, "010-department")[0].runDate).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
  });
});
