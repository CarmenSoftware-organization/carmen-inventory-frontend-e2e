// Temporary config for the Phase 0 baseline sweep. Mirrors playwright.config.ts
// but trades the always-on video/screenshot capture (unusable at ~1000 tests,
// several GB) for failure-only artifacts, and swaps the HTML reporter for a
// per-batch JSON file so batches can be diffed afterwards.
import base from "./playwright.config";
import { defineConfig } from "@playwright/test";

const OUT = process.env.BASELINE_OUT ?? "runs/baseline/last.json";

export default defineConfig(base, {
  reporter: [["list"], ["json", { outputFile: OUT }]],
  use: {
    ...base.use,
    video: "off",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
