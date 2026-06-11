# Video Every Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture a Playwright video for every test (pass and fail), named by TC ID, recorded into `videos/<TCID>.webm`, with the path surfaced in the JSON result and synced to a `Video` column in Google Sheets — mirroring the existing screenshot pipeline.

**Architecture:** Centralize in the JSON reporter (`tests/reporters/tc-json-reporter.ts`). Set `video: "on"` in `playwright.config.ts` so Playwright attaches a `"video"` attachment to every test result. The reporter's `onTestEnd` (already runs per test and maps TC IDs) copies that attachment to `videos/<TCID>.webm` and records the relative path. The sync script gains one reporter-owned `Video` column.

**Tech Stack:** TypeScript, Playwright reporter API, Node `fs` (`copyFileSync`/`mkdirSync`/`existsSync`), Vitest for unit tests, Google Sheets API (`scripts/sync-test-results.ts`).

**Reference spec:** `docs/superpowers/specs/2026-06-11-video-every-test-design.md`

---

## File Structure

- **Modify** `tests/reporters/tc-json-reporter.ts` — add `video` field to `TCResultRow`, add `findVideoPath`/`copyVideo` helpers, copy video in `onTestEnd`, add `videosDir` config, update doc comment.
- **Modify** `unit/tc-json-reporter.test.ts` — add unit tests for `findVideoPath` and `copyVideo`.
- **Modify** `playwright.config.ts` — `video: "retain-on-failure"` → `video: "on"`.
- **Modify** `.gitignore` — add `videos/`.
- **Modify** `scripts/sync-test-results.ts` — add `"Video"` to `CANONICAL_HEADER`, resolve `videoCol`, write it in append + update paths, bump the "14-column" doc comment to "15-column".

Tasks are ordered so the reporter (the engine) is built and unit-tested first, then config + gitignore enable recording, then the sync script consumes the new field.

---

### Task 1: Add `findVideoPath` and `copyVideo` helpers (TDD)

**Files:**
- Modify: `tests/reporters/tc-json-reporter.ts` (add two exported functions near the existing `findScreenshotPath`/`copyScreenshot` at lines 65-87)
- Test: `unit/tc-json-reporter.test.ts`

- [ ] **Step 1: Write the failing tests**

Add these blocks to the END of `unit/tc-json-reporter.test.ts` (after the existing `copyScreenshot` describe block). Also extend the import on lines 11-14 to pull in the new functions.

Change the import block to:

```typescript
import {
  findScreenshotPath,
  copyScreenshot,
  findVideoPath,
  copyVideo,
} from "../tests/reporters/tc-json-reporter";
```

Append at the end of the file:

```typescript
describe("findVideoPath", () => {
  it("returns the path of the attachment named 'video'", () => {
    const atts = [
      { name: "screenshot", path: "/tmp/shot.png" },
      { name: "video", path: "/tmp/v.webm" },
    ];
    expect(findVideoPath(atts)).toBe("/tmp/v.webm");
  });

  it("returns undefined when there is no video attachment", () => {
    expect(findVideoPath([{ name: "screenshot", path: "/tmp/shot.png" }])).toBeUndefined();
  });

  it("ignores a video attachment that has no path", () => {
    expect(findVideoPath([{ name: "video" }])).toBeUndefined();
  });
});

describe("copyVideo", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs) rmSync(d, { recursive: true, force: true });
  });

  it("copies the source file to <destDir>/<testId>.webm, creating the dir", () => {
    const base = mkdtempSync(join(tmpdir(), "vid-"));
    dirs.push(base);
    const src = join(base, "source.webm");
    writeFileSync(src, "WEBMDATA");
    const destDir = join(base, "videos");

    copyVideo(src, destDir, "TC-L00101");

    const out = join(destDir, "TC-L00101.webm");
    expect(existsSync(out)).toBe(true);
    expect(readFileSync(out, "utf8")).toBe("WEBMDATA");
  });

  it("overwrites the existing file for the same testId (latest run wins)", () => {
    const base = mkdtempSync(join(tmpdir(), "vid-"));
    dirs.push(base);
    const destDir = join(base, "videos");

    const first = join(base, "first.webm");
    writeFileSync(first, "OLD");
    copyVideo(first, destDir, "TC-L00101");

    const second = join(base, "second.webm");
    writeFileSync(second, "NEW");
    copyVideo(second, destDir, "TC-L00101");

    expect(readFileSync(join(destDir, "TC-L00101.webm"), "utf8")).toBe("NEW");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:unit -- tc-json-reporter`
Expected: FAIL — `findVideoPath`/`copyVideo` are `undefined` (not exported), e.g. "findVideoPath is not a function".

- [ ] **Step 3: Write the helpers**

In `tests/reporters/tc-json-reporter.ts`, immediately AFTER the `copyScreenshot` function (which ends at line 87 with its closing `}`), add:

```typescript
/**
 * Find the auto-captured video attachment. Playwright uses the name "video"
 * for the recorded video regardless of the video mode. Returns its on-disk
 * path, or undefined if the test produced none.
 */
export function findVideoPath(
  attachments: ReadonlyArray<{ name: string; path?: string }>,
): string | undefined {
  return attachments.find((a) => a.name === "video" && a.path)?.path;
}

/**
 * Copy a video file to `<destDir>/<testId>.webm`, creating destDir if needed.
 * Overwrites any existing file for that testId (latest run wins).
 */
export function copyVideo(
  srcPath: string,
  destDir: string,
  testId: string,
): void {
  mkdirSync(destDir, { recursive: true });
  copyFileSync(srcPath, resolve(destDir, `${testId}.webm`));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test:unit -- tc-json-reporter`
Expected: PASS — all `findVideoPath`, `copyVideo`, and the pre-existing screenshot tests green.

- [ ] **Step 5: Commit**

```bash
git add tests/reporters/tc-json-reporter.ts unit/tc-json-reporter.test.ts
git commit -m "feat(reporter): add findVideoPath/copyVideo helpers"
```

---

### Task 2: Wire video into the reporter `onTestEnd` and row shape

**Files:**
- Modify: `tests/reporters/tc-json-reporter.ts` (interface `TCResultRow` ~lines 46-61, doc comment lines 1-34, constructor ~lines 182-189, `onTestEnd` ~lines 195-223)

This task has no isolated unit test — it wires the Task 1 helpers into the Playwright reporter object, which is exercised by the acceptance run in Task 5. Make the edits exactly as shown.

- [ ] **Step 1: Add `video` to the `TCResultRow` interface**

In the `TCResultRow` interface, add a `video` field right after `screenshot: string;` (line 60):

```typescript
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
  screenshot: string;
  video: string;
}
```

- [ ] **Step 2: Import `existsSync`**

Change the `node:fs` import on line 35 from:

```typescript
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
```

to:

```typescript
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
```

- [ ] **Step 3: Add `videosDir` config + fields to the class/constructor**

The class currently declares (lines 182-189):

```typescript
  private screenshotsRelDir: string;
  private screenshotsAbsDir: string;

  constructor(options: { outputDir?: string; screenshotsDir?: string } = {}) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "tests/results");
    this.screenshotsRelDir = options.screenshotsDir ?? "screenshots";
    this.screenshotsAbsDir = resolve(process.cwd(), this.screenshotsRelDir);
  }
```

Replace that block with (adds two fields + `videosDir` option):

```typescript
  private screenshotsRelDir: string;
  private screenshotsAbsDir: string;
  private videosRelDir: string;
  private videosAbsDir: string;

  constructor(
    options: { outputDir?: string; screenshotsDir?: string; videosDir?: string } = {},
  ) {
    this.outDir = resolve(process.cwd(), options.outputDir ?? "tests/results");
    this.screenshotsRelDir = options.screenshotsDir ?? "screenshots";
    this.screenshotsAbsDir = resolve(process.cwd(), this.screenshotsRelDir);
    this.videosRelDir = options.videosDir ?? "videos";
    this.videosAbsDir = resolve(process.cwd(), this.videosRelDir);
  }
```

- [ ] **Step 4: Copy the video in `onTestEnd`**

The current `onTestEnd` body (lines 204-221) is:

```typescript
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
```

Replace it with (adds video source lookup + per-id copy + `video` field). Note the `existsSync` guard — Playwright finalizes the video file asynchronously when the browser context closes, so guard against a missing/not-yet-flushed file so a copy error can't crash the whole reporter:

```typescript
    const shotSrc = findScreenshotPath(result.attachments);
    const videoSrc = findVideoPath(result.attachments);
    for (const id of ids) {
      let screenshot = "";
      if (shotSrc) {
        copyScreenshot(shotSrc, this.screenshotsAbsDir, id);
        screenshot = `${this.screenshotsRelDir}/${id}.png`;
      }
      let video = "";
      if (videoSrc && existsSync(videoSrc)) {
        copyVideo(videoSrc, this.videosAbsDir, id);
        video = `${this.videosRelDir}/${id}.webm`;
      }
      bucket.push({
        testId: id,
        title: test.title,
        status,
        duration: Math.round(result.duration),
        error,
        runDate,
        screenshot,
        video,
        ...meta,
      });
    }
```

- [ ] **Step 5: Update the file's doc comment**

In the header doc comment (lines 10-33): add the `video` field to the example row shape and to the "Reporter-populated fields" line.

Change the example row block so it includes `video` right after the `screenshot` line:

```
 *     "screenshot": "screenshots/TC-L00101.png",
 *     "video": "videos/TC-L00101.webm"
```

(Add a comma after the `screenshot` value, and add the new `video` line as the last field before the closing `}`.)

And change line 31 from:

```
 * Reporter-populated fields: seq, testId, title, status, runDate, duration, error, screenshot.
```

to:

```
 * Reporter-populated fields: seq, testId, title, status, runDate, duration, error, screenshot, video.
```

- [ ] **Step 6: Typecheck + unit tests still pass**

Run: `bunx tsc --noEmit -p tsconfig.json && bun run test:unit -- tc-json-reporter`
Expected: tsc reports no errors; unit tests PASS (the helper tests from Task 1 are unaffected).

If the repo has no `tsconfig.json` or tsc is not wired, skip the tsc half and rely on `bun run test:unit`.

- [ ] **Step 7: Commit**

```bash
git add tests/reporters/tc-json-reporter.ts
git commit -m "feat(reporter): record video path per TC id in JSON result"
```

---

### Task 3: Enable video recording for every test + gitignore

**Files:**
- Modify: `playwright.config.ts` (line 26)
- Modify: `.gitignore` (after line 5)

- [ ] **Step 1: Switch video mode to `"on"`**

In `playwright.config.ts`, inside the `use:` block, change line 26 from:

```typescript
    video: "retain-on-failure",
```

to:

```typescript
    video: "on",
```

Leave `screenshot: "on"` (line 25) and `trace: "on-first-retry"` (line 24) unchanged.

- [ ] **Step 2: Gitignore the videos folder**

In `.gitignore`, add a `videos/` line directly after the existing `screenshots/` line (line 5):

```
test-results/
screenshots/
videos/
```

- [ ] **Step 3: Verify the config parses**

Run: `bunx playwright test --list -g "TC-L00101" 2>&1 | head -20`
Expected: Playwright lists matching test(s) without a config parse error. (No test is executed by `--list`.)

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts .gitignore
git commit -m "feat(e2e): record video for every test, gitignore videos/"
```

---

### Task 4: Add the `Video` column to the Sheets sync

**Files:**
- Modify: `scripts/sync-test-results.ts` (doc comment line 10, `CANONICAL_HEADER` lines 105-120, col resolution ~line 232, append path ~line 269, update path ~line 289)

- [ ] **Step 1: Add `"Video"` to `CANONICAL_HEADER`**

In `scripts/sync-test-results.ts`, change the `CANONICAL_HEADER` array (lines 105-120) so `"Video"` follows `"Screenshot"`:

```typescript
const CANONICAL_HEADER = [
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
  "Screenshot",
  "Video",
];
```

- [ ] **Step 2: Resolve `videoCol`**

After the `screenshotCol` resolution (line 232: `const screenshotCol = header.indexOf("Screenshot");`), add:

```typescript
  const videoCol = header.indexOf("Video");
```

- [ ] **Step 3: Write `Video` in the append path**

In the new-row (append) branch, after the screenshot line (line 269: `if (screenshotCol >= 0) row[screenshotCol] = r.screenshot ?? "";`), add:

```typescript
      if (videoCol >= 0) row[videoCol] = r.video ?? "";
```

- [ ] **Step 4: Write `Video` in the update path**

In the reporter-owned overwrite branch, after the screenshot push (line 289: `if (screenshotCol >= 0) push(screenshotCol, r.screenshot ?? "");`), add:

```typescript
    if (videoCol >= 0) push(videoCol, r.video ?? "");
```

- [ ] **Step 5: Update the doc comment column count**

In the header doc comment, change line 10 from `the canonical 14-column header` to `the canonical 15-column header`.

- [ ] **Step 6: Typecheck the script**

Run: `bunx tsc --noEmit scripts/sync-test-results.ts 2>&1 | head -20`
Expected: no errors referencing `videoCol` or `r.video`. (Pre-existing unrelated module-resolution warnings, if any, are acceptable — confirm none mention `video`.)

If `r.video` is flagged as not existing on the row type, confirm Task 2 Step 1 added `video` to `TCResultRow` and that this script imports that interface; the field must be present there.

- [ ] **Step 7: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "feat(sync): upsert Video column into Google Sheet"
```

---

### Task 5: Acceptance — verify end-to-end on a small module

**Files:** none (verification only)

- [ ] **Step 1: Run a small spec**

Run: `bun run test:login`
Expected: the login suite runs to completion (pass/fail status is fine — we are verifying artifacts, not test outcomes).

- [ ] **Step 2: Verify videos exist for passing tests, named by TC ID**

Run: `ls videos/ | head` and `ls videos/*.webm | wc -l`
Expected: one or more `videos/TC-*.webm` files exist, including for tests that PASSED (not only failures). The filenames are TC IDs, e.g. `videos/TC-L00101.webm`.

- [ ] **Step 3: Verify the JSON result carries the video path**

Run: `grep -o '"video": "[^"]*"' tests/results/001-login-results.json | head`
Expected: rows show `"video": "videos/TC-L00101.webm"` (non-empty for tests that recorded a video). Also confirm `"screenshot"` is still populated (no regression).

- [ ] **Step 4: Verify gitignore**

Run: `git status --porcelain videos/`
Expected: NO output — `videos/` is ignored and nothing under it is staged/untracked-reported.

- [ ] **Step 5: (Optional) Sheets sync**

Only if `.env.local` has `GOOGLE_SHEETS_SA_KEY_PATH` and `GOOGLE_SHEETS_SPREADSHEET_ID`:

Run: `bun e2e:sync`
Expected: completes without error; the target tab gains a `Video` column populated with `videos/TC-*.webm` paths. If credentials are absent, skip this step (the shell runners wrap it in `|| true`).

- [ ] **Step 6: Final unit-test sweep**

Run: `bun run test:unit`
Expected: all unit tests PASS (reporter helpers + unrelated suites green).

---

## Notes for the implementer

- **Why centralize in the reporter, not an `afterEach` hook:** the reporter already runs `onTestEnd` per test and maps TC IDs; hooking each fixture (`login` + `chromium`/`createAuthTest`) would risk new specs silently missing video. See the spec's "แนวทางที่เลือก" section.
- **A test title may match multiple TC IDs** (the title regex returns all matches). The same single video is copied to each `TC-<id>.webm`, mirroring the screenshot behavior exactly — this is intentional.
- **Latest run wins:** `onTestEnd` fires per retry attempt; the last attempt overwrites the file. No cleanup of stale videos is in scope.
- **Out of scope:** trace changes, video resolution/bitrate tuning, clickable `=HYPERLINK()` cells, committing videos to git.
