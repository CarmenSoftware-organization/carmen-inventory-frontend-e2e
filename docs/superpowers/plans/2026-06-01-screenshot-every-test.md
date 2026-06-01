# Capture Screenshot On Every Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture a screenshot for every test (pass and fail), save one file per TC ID in a separate gitignored `screenshots/` folder, and record its path in the JSON results and Google Sheet.

**Architecture:** Set Playwright `screenshot: "on"` so every test attaches a screenshot. The existing `tc-json-reporter.ts` (already runs `onTestEnd` per test and maps TC IDs) copies that attachment to `screenshots/<TCID>.png` and records the relative path in each result row. The sync script gains a `Screenshot` column. New reporter helper functions are unit-tested with vitest, scoped to a `unit/` directory so it never collides with Playwright's test discovery.

**Tech Stack:** TypeScript, Playwright `@playwright/test` reporter API, vitest (already a devDependency), Node `fs`/`path`, googleapis (sync).

---

## File Structure

- **Create** `vitest.config.ts` — scopes vitest to `unit/**/*.test.ts` only (Playwright owns `tests/`).
- **Create** `unit/tc-json-reporter.test.ts` — unit tests for the new reporter helpers.
- **Modify** `tests/reporters/tc-json-reporter.ts` — add `screenshot` field to `TCResultRow`, export `findScreenshotPath` + `copyScreenshot` helpers, wire copy into `onTestEnd`.
- **Modify** `playwright.config.ts:25` — `screenshot: "only-on-failure"` → `"on"`.
- **Modify** `.gitignore` — add `screenshots/`.
- **Modify** `scripts/sync-test-results.ts` — add `"Screenshot"` to `CANONICAL_HEADER`, populate the column.
- **Modify** `package.json` — add `test:unit` script.

---

## Task 1: Scoped vitest config + unit-test harness for reporter helpers

**Files:**
- Create: `vitest.config.ts`
- Create: `unit/tc-json-reporter.test.ts`
- Modify: `package.json` (add `test:unit` script)
- Modify: `tests/reporters/tc-json-reporter.ts` (export the two helpers — implemented in this task)

- [ ] **Step 1: Create the scoped vitest config**

Create `vitest.config.ts`. The `include` is restricted to `unit/` so `vitest run` never tries to execute the Playwright specs under `tests/` (which would break — they need the Playwright runtime).

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["unit/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Add the `test:unit` script to package.json**

In `package.json`, inside `"scripts"`, add this entry after the `"test:chromium"` line:

```json
    "test:unit": "vitest run",
```

- [ ] **Step 3: Write the failing unit tests**

Create `unit/tc-json-reporter.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import {
  mkdtempSync,
  writeFileSync,
  existsSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  findScreenshotPath,
  copyScreenshot,
} from "../tests/reporters/tc-json-reporter";

describe("findScreenshotPath", () => {
  it("returns the path of the attachment named 'screenshot'", () => {
    const atts = [
      { name: "trace", path: "/tmp/trace.zip" },
      { name: "screenshot", path: "/tmp/shot.png" },
    ];
    expect(findScreenshotPath(atts)).toBe("/tmp/shot.png");
  });

  it("returns undefined when there is no screenshot attachment", () => {
    expect(findScreenshotPath([{ name: "video", path: "/tmp/v.webm" }])).toBeUndefined();
  });

  it("ignores a screenshot attachment that has no path", () => {
    expect(findScreenshotPath([{ name: "screenshot" }])).toBeUndefined();
  });
});

describe("copyScreenshot", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs) rmSync(d, { recursive: true, force: true });
  });

  it("copies the source file to <destDir>/<testId>.png, creating the dir", () => {
    const base = mkdtempSync(join(tmpdir(), "shot-"));
    dirs.push(base);
    const src = join(base, "source.png");
    writeFileSync(src, "PNGDATA");
    const destDir = join(base, "screenshots");

    copyScreenshot(src, destDir, "TC-L00101");

    const out = join(destDir, "TC-L00101.png");
    expect(existsSync(out)).toBe(true);
    expect(readFileSync(out, "utf8")).toBe("PNGDATA");
  });
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `bun run test:unit`
Expected: FAIL — `findScreenshotPath`/`copyScreenshot` are not exported from `tc-json-reporter.ts` (import error / "is not a function").

- [ ] **Step 5: Implement the two helpers in the reporter**

In `tests/reporters/tc-json-reporter.ts`, the import line currently reads:

```ts
import { mkdirSync, writeFileSync } from "node:fs";
```

Replace it with (adds `copyFileSync`):

```ts
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
```

Then, immediately after the `const TC_REGEX = /\bTC-[A-Z]{2,5}-\d{6}\b/g;` line, add the two exported helpers:

```ts
/**
 * Find the auto-captured screenshot attachment (Playwright names it
 * "screenshot" when `screenshot: "on"`). Returns its on-disk path, or
 * undefined if the test produced no screenshot.
 */
export function findScreenshotPath(
  attachments: ReadonlyArray<{ name: string; path?: string }>,
): string | undefined {
  return attachments.find((a) => a.name === "screenshot" && a.path)?.path;
}

/**
 * Copy a screenshot file to `<destDir>/<testId>.png`, creating destDir if
 * needed. Overwrites any existing file for that testId (latest run wins).
 */
export function copyScreenshot(
  srcPath: string,
  destDir: string,
  testId: string,
): void {
  mkdirSync(destDir, { recursive: true });
  copyFileSync(srcPath, resolve(destDir, `${testId}.png`));
}
```

(`resolve` is already imported from `node:path` at the top of the file.)

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test:unit`
Expected: PASS — 4 tests passing.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts unit/tc-json-reporter.test.ts package.json tests/reporters/tc-json-reporter.ts
git commit -m "test: add unit-tested screenshot helpers to tc-json-reporter

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Add `screenshot` field and wire copy into the reporter

**Files:**
- Modify: `tests/reporters/tc-json-reporter.ts`

- [ ] **Step 1: Add the `screenshot` field to the `TCResultRow` interface**

In `tests/reporters/tc-json-reporter.ts`, the `TCResultRow` interface ends with:

```ts
  error: string;
  note: string;
}
```

Change it to add the `screenshot` field:

```ts
  error: string;
  note: string;
  screenshot: string;
}
```

- [ ] **Step 2: Add screenshot directory config to the constructor**

The constructor currently is:

```ts
  private outDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "tests/results");
  }
```

Replace it with (adds the screenshots dir, both relative-for-JSON and absolute-for-writing):

```ts
  private outDir: string;
  private screenshotsRelDir: string;
  private screenshotsAbsDir: string;

  constructor(options: { outputDir?: string; screenshotsDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "tests/results");
    this.screenshotsRelDir = options.screenshotsDir ?? "screenshots";
    this.screenshotsAbsDir = resolve(process.cwd(), this.screenshotsRelDir);
  }
```

- [ ] **Step 3: Copy the screenshot inside `onTestEnd`**

The `onTestEnd` body currently is:

```ts
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
```

Replace it with (computes the screenshot source once, then copies + records per TC ID):

```ts
  onTestEnd(test: TestCase, result: TestResult) {
    const ids = test.title.match(TC_REGEX);
    if (!ids || ids.length === 0) return;
    const runDate = new Date().toISOString();
    const status = statusLabel(result);
    const error = result.error?.message?.split("\n")[0] ?? "";
    const key = specKey(findSpecFile(test) ?? test.location.file);
    const bucket = this.rowsBySpec.get(key) ?? [];
    const meta = readAnnotations(test);
    const shotSrc = findScreenshotPath(result.attachments);
    for (const id of ids) {
      let screenshot = "";
      if (shotSrc) {
        copyScreenshot(shotSrc, this.screenshotsAbsDir, id);
        screenshot = `${this.screenshotsRelDir}/${id}.png`;
      }
      bucket.push({
        testId: id,
        title: test.title,
        status,
        duration: Math.round(result.duration),
        error,
        runDate,
        screenshot,
        ...meta,
      });
    }
    this.rowsBySpec.set(key, bucket);
  }
```

- [ ] **Step 4: Update the file's header doc comment**

In the top-of-file block comment, the example row object lists fields ending with `"note": ""`. Add a `screenshot` line so the documented shape matches. Find:

```
 *     "error": "",
 *     "note": ""
 *   }
```

Replace with:

```
 *     "error": "",
 *     "note": "",
 *     "screenshot": "screenshots/TC-L00101.png"
 *   }
```

And in the same comment, the line:

```
 * Reporter-populated fields: seq, testId, title, status, runDate, duration, error.
```

Replace with:

```
 * Reporter-populated fields: seq, testId, title, status, runDate, duration, error, screenshot.
```

- [ ] **Step 5: Verify the reporter still type-checks and unit tests pass**

Run: `bunx tsc --noEmit && bun run test:unit`
Expected: no type errors; 4 unit tests pass.

- [ ] **Step 6: Commit**

```bash
git add tests/reporters/tc-json-reporter.ts
git commit -m "feat: record per-test screenshot path in JSON results

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Flip Playwright config to capture on every test + gitignore

**Files:**
- Modify: `playwright.config.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Change the screenshot setting**

In `playwright.config.ts`, find (line 25):

```ts
    screenshot: "only-on-failure",
```

Replace with:

```ts
    screenshot: "on",
```

- [ ] **Step 2: Gitignore the screenshots folder**

In `.gitignore`, the `test-results/` line exists. Add a new line right after it:

```
screenshots/
```

- [ ] **Step 3: Verify config type-checks**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts .gitignore
git commit -m "feat: capture screenshot on every test, gitignore screenshots/

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Add the `Screenshot` column to the Google Sheets sync

**Files:**
- Modify: `scripts/sync-test-results.ts`

- [ ] **Step 1: Add `"Screenshot"` to the canonical header**

In `scripts/sync-test-results.ts`, the `CANONICAL_HEADER` array currently ends with:

```ts
  "Error",
  "Note",
];
```

Replace with (append the new column at the end — `ensureHeaders` auto-appends it to existing tabs):

```ts
  "Error",
  "Note",
  "Screenshot",
];
```

- [ ] **Step 2: Resolve the new column index**

In `syncTab`, after the line:

```ts
  const noteCol = header.indexOf("Note");
```

add:

```ts
  const screenshotCol = header.indexOf("Screenshot");
```

- [ ] **Step 3: Populate the column when appending a new row**

In the append branch (`if (!rowNum) { ... }`), after the line:

```ts
      if (noteCol >= 0) row[noteCol] = r.note;
```

add:

```ts
      if (screenshotCol >= 0) row[screenshotCol] = r.screenshot ?? "";
```

(The `?? ""` guards against legacy JSON rows written before this feature, which have no `screenshot` field.)

- [ ] **Step 4: Populate the column on update (reporter-owned, always overwrite)**

In the update branch, find the reporter-owned overwrite block:

```ts
    push(statusCol, r.status);
    push(dateCol, r.runDate);
    if (durationCol >= 0) push(durationCol, String(r.duration));
    if (errorCol >= 0) push(errorCol, r.error);
    if (seqCol >= 0) push(seqCol, String(r.seq));
```

After it, add:

```ts
    if (screenshotCol >= 0) push(screenshotCol, r.screenshot ?? "");
```

- [ ] **Step 5: Verify the sync script type-checks**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "feat: sync per-test screenshot path to Google Sheet column

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: End-to-end acceptance verification

**Files:** none (verification only)

This task confirms the wiring works against a real Playwright run. It requires the frontend to be runnable (Playwright's `webServer` starts `bun dev` in `../carmen-inventory-frontend`, or set `E2E_NO_WEBSERVER=1` + `E2E_BASE_URL` to point at a running instance).

- [ ] **Step 1: Run one spec end-to-end**

Run: `bun run test -- 020-unit.spec.ts`
(Any single spec with passing tests works. `020-unit.spec.ts` is a small CRUD module.)
Expected: tests run; at least some pass.

- [ ] **Step 2: Verify screenshots exist for passing tests**

Run: `ls screenshots/`
Expected: one `TC-XXXXXX.png` file per TC ID in that spec — including tests that **passed**, not only failures.

- [ ] **Step 3: Verify the JSON result records the path**

Run: `grep -m1 screenshot tests/results/020-unit-results.json`
Expected: a line like `"screenshot": "screenshots/TC-U... .png"` with a non-empty path for executed tests.

- [ ] **Step 4: Verify the folder is gitignored**

Run: `git status --short screenshots/`
Expected: no output (the folder is ignored — nothing staged or untracked).

- [ ] **Step 5: (Optional, needs credentials) Verify the Sheet column**

Only if `.env.local` has `GOOGLE_SHEETS_SA_KEY_PATH` + `GOOGLE_SHEETS_SPREADSHEET_ID`:
Run: `bun e2e:sync`
Expected: log shows the relevant tab updated; the sheet now has a `Screenshot` column populated with paths.

- [ ] **Step 6: Regenerate user-story docs if any annotations changed**

No annotations were changed in this work (only config + reporter + sync), so per CLAUDE.md the `docs:user-stories` regeneration is **not** required. Confirm no spec annotations were touched; skip regeneration.

---

## Notes for the implementer

- **Do not** add `screenshots/` files to git — they are intentionally local-only.
- The `setup` project (`auth.setup.ts`) tests have no TC ID, so the reporter skips them — no screenshot is copied for setup. This is expected.
- Screenshots are viewport-sized (Playwright default). Full-page was explicitly out of scope.
- If a title contains multiple TC IDs, the same screenshot is copied to each `<TCID>.png`. This matches the existing reporter behavior of emitting one row per ID.
