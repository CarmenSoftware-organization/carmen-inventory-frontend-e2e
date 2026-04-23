# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Standalone Playwright end-to-end test suite for the **carmen-inventory-frontend** Next.js app (sibling directory: `../carmen-inventory-frontend`). This repo contains no application code — only tests, page objects, and fixtures that drive the frontend over HTTP.

## Running tests

```bash
bun install                     # or: npm install
bun run install-browsers        # one-time: installs Chromium
bun test                        # all tests (starts the frontend via webServer)
bun run test:ui                 # Playwright UI mode
bun run test:headed             # headed browser
bun run test:login              # only login.spec.ts
bun run test -- login.spec.ts   # single file
bun run test -- -g "TC-L01"     # single test by title
bun run report                  # open last HTML report
```

## How the runner starts the frontend

`playwright.config.ts` spawns `bun dev` in `../carmen-inventory-frontend` via Playwright's `webServer`. To test against an already running instance (e.g. staging) set `E2E_NO_WEBSERVER=1` and override `E2E_BASE_URL`. To point at a frontend at a different path, set `E2E_FRONTEND_DIR` — note that Playwright resolves the `cwd` option relative to the config file, so relative paths are evaluated from this repo root. See `.env.example`.

## Architecture

- **`playwright.config.ts`** — two projects: `login` (runs `login.spec.ts`) and `chromium` (everything else). The split enables selective runs (`bun run test:login`) and keeps the noisy login suite out of the default reporter output when iterating on feature tests. Projects do **not** imply order — use Playwright `dependencies` if you need that. `workers: 1` because (a) the backend rate-limits repeated failed logins (observable via TC-L30-style tests) and (b) role-based tests share backend state and cannot safely interleave.
- **`tests/pages/`** — page objects. Each class wraps a `Page` and exposes **locator factories** (arrow functions returning `Locator`), not pre-created locators — this avoids stale references across navigations.
- **`tests/fixtures/auth.fixture.ts`** — `createAuthTest(email)` returns a `test` object with an auto-running `authenticatedPage` fixture that logs in via `LoginPage.loginWithRetry` before the test body. Use for specs that assume an authenticated session.
- **`tests/test-users.ts`** — canonical list of role-based test accounts. Most share password `12345678`; `TT` uses `Qaz123!@#`. `getPasswordFor(email)` handles the lookup.

## Conventions

- **Test IDs**: tests follow the `TC-<area><NN>` pattern (`TC-L01` = Login test 1). When adding login tests, extend the `LOGIN_TC` / `LOGOUT_TC` maps in `login.spec.ts`.
- **Login flows** must use `loginWithRetry` — the backend returns 429 after 3 wrong-password attempts on the same email, and the retry helper backs off when it detects the rate-limit message.
- **Selectors** prefer `getByRole` / semantic queries. The frontend uses Radix primitives with `data-slot="..."` attributes (e.g. `data-slot="dropdown-menu-trigger"`, `data-slot="avatar"`) — use these when a role query is ambiguous, as seen in `DashboardPage.userMenuTrigger`.
- **Language**: test titles are Thai to match the product UX and the existing suite in `../carmen-inventory-frontend/e2e/`.

## Batch scripts

`tests/scripts/` has per-module runners plus `run-module.sh <module>` and `run-all.sh`. Any `playwright test` flag can be appended (`--headed`, `--ui`, `-g <pattern>`, `--workers=100%` for parallel batch mode). Spec paths inside the scripts are `tests/<module>.spec.ts`.

## CSV reporter

`tests/reporters/tc-csv-reporter.ts` is registered in `playwright.config.ts` and writes one CSV per spec file into `tests/results/` keyed by the `TC-XXX` IDs parsed from test titles. The regex `\b(TCS?-[A-Z]{0,4}\d{2,})\b` extracts them — keep titles in the `TC-<area><NN> <description>` shape or the row won't be recorded. The repo ships seed CSVs covering the known TC IDs; the reporter updates Status + Test Date on each run.

## Google Sheets sync (`e2e:sync`)

`scripts/sync-test-results.ts` reads every `tests/results/*.csv` and upserts Status + Test Date into a Google Sheet by matching the `Test ID` column. Requires two env vars in `.env.local`:

- `GOOGLE_SHEETS_SA_KEY_PATH` — absolute path to a service-account JSON key with "Google Sheets API" enabled and Editor access to the target sheet.
- `GOOGLE_SHEETS_SPREADSHEET_ID` — the sheet ID from its URL.

Tab names are hard-coded in `SYNC_TARGETS` inside the script (e.g. `login-results.csv` → tab "Login"). New CSVs need a matching entry there. The shell runners in `tests/scripts/` call `bun e2e:sync` after every playwright invocation; the call is wrapped in `|| true` so missing credentials don't fail the run.

## Relationship to `carmen-inventory-frontend/e2e/`

Mirrored from the frontend repo's in-tree `e2e/` suite — specs, page objects, fixtures, helpers, reporter, shell scripts, seed CSVs, and the Google Sheets sync script. Known path substitutions applied on port (reapply when syncing new changes):

- `testDir` is `./tests` (not `./e2e`).
- CSV reporter `outputDir` is `tests/results` (not `e2e/results`).
- Shell scripts resolve SPECs as `tests/<module>.spec.ts`.
- `RESULTS_DIR` in `scripts/sync-test-results.ts` is `tests/results`.

Specs added in this repo that are NOT in upstream: `vendor.spec.ts` (28 tests covering the vendor-management/vendor module — TC-VEN01..28).
