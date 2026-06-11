import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const FRONTEND_DIR =
  process.env.E2E_FRONTEND_DIR ?? "../carmen-inventory-frontend";
const START_FRONTEND = process.env.E2E_NO_WEBSERVER !== "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
    [
      "./tests/reporters/tc-json-reporter.ts",
      { outputDir: "tests/results" },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "on",
    video: "on",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts$/,
      retries: 2,
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "login",
      testMatch: /001-login\.spec\.ts/,
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testIgnore: /001-login\.spec\.ts$|auth\.setup\.ts$|wiki-screenshots\//,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "wiki-screenshots",
      testMatch: /wiki-screenshots\/capture\.spec\.ts$/,
      dependencies: ["setup"],
      fullyParallel: false,
      // This batch job creates its own browser contexts and navigates many
      // routes with no TC ID, so videos would never be copied to videos/ and
      // would only bloat test-results/. Opt out of the global video: "on".
      use: { ...devices["Desktop Chrome"], video: "off" },
    },
  ],
  webServer: START_FRONTEND
    ? {
        command: "bun dev",
        cwd: FRONTEND_DIR,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
