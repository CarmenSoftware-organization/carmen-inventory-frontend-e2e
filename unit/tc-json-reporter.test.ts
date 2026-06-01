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

  it("overwrites the existing file for the same testId (latest run wins)", () => {
    const base = mkdtempSync(join(tmpdir(), "shot-"));
    dirs.push(base);
    const destDir = join(base, "screenshots");

    const first = join(base, "first.png");
    writeFileSync(first, "OLD");
    copyScreenshot(first, destDir, "TC-L00101");

    const second = join(base, "second.png");
    writeFileSync(second, "NEW");
    copyScreenshot(second, destDir, "TC-L00101");

    expect(readFileSync(join(destDir, "TC-L00101.png"), "utf8")).toBe("NEW");
  });
});
