import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // `scripts/**/__tests__` is included on purpose: audit-tc-ids.test.ts lived
    // there unrun for three commits because the pattern was `unit/**` only.
    include: ["unit/**/*.test.ts", "scripts/**/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
      // The unit-testable surface: pure logic plus anything whose browser /
      // network edges can be faked with a stub object.
      include: [
        "scripts/**/*.ts",
        "tests/helpers/**/*.ts",
        "tests/reporters/**/*.ts",
        "tests/wiki-screenshots/**/*.ts",
      ],
      // Excluded because the file IS the side effect — its body is Playwright
      // actions, a live browser crawl, or a Google Sheets call, so a unit test
      // would assert only against its own mocks. These are covered by running
      // the real thing, not by vitest.
      exclude: [
        "**/*.test.ts",
        "**/__tests__/**",
        "**/*.spec.ts", // wiki capture.spec / probe.spec — Playwright projects
        "**/types.ts", // type-only modules
        "scripts/capture-screens.ts", // browser crawler; its pure rules live in scripts/lib/screen-crawl.ts
        "scripts/sync-test-results.ts", // googleapis client
        "scripts/generate-user-stories.ts", // one-shot doc generator, no exported seams
        "scripts/rename-test-ids.ts", // one-shot migration CLI
        "scripts/migrate-tc-ids/apply.ts", // one-shot migration CLI
        "scripts/migrate-tc-ids/sync-sheet.ts", // googleapis client
        "tests/helpers/security-cases.ts", // Playwright test bodies (registration is tested in unit/security-cases.test.ts)
        "tests/wiki-screenshots/capture-user.ts", // browser
        "tests/wiki-screenshots/discover-seeds.ts", // browser
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
