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
      "./tests/reporters/tc-csv-reporter.ts",
      { outputDir: "tests/results" },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "login",
      testMatch: /login\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testIgnore: /login\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
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
