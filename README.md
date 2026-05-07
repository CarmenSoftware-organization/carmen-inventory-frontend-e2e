# carmen-inventory-frontend-e2e

Playwright end-to-end test suite for the [**carmen-inventory-frontend**](https://github.com/CarmenSoftware-organization/carmen-inventory-frontend) Next.js app.

The frontend lives in a sibling directory (`../carmen-inventory-frontend`). This repo contains only tests, page objects, fixtures, and a CSV-to-Google-Sheets reporter — no application code.

## Quickstart

```bash
bun install
bun run install-browsers    # one-time: installs Chromium
bun test                    # runs the full suite (boots the frontend via Playwright webServer)
```

`bun test` will spawn `bun dev` in `../carmen-inventory-frontend`. To test against an already running frontend (e.g. staging) set:

```bash
export E2E_NO_WEBSERVER=1
export E2E_BASE_URL=https://your-host.example.com
bun test
```

See `.env.example` for all environment variables.

## Running subsets

```bash
bun run test:login              # 001-login.spec.ts only (TC-LOGIN-010001..010030)
bun run test:chromium           # everything except login (auto-runs the setup project first)
bun run test:ui                 # Playwright UI mode
bun run test:headed             # headed browser
bun run test:debug              # step-through debugger
bunx playwright test currency   # single spec (substring match against filename)
bunx playwright test -g "TC-LOGIN-010001"  # single test by title
bun run report                  # open last HTML report
```

### Per-module shell scripts

```bash
./tests/scripts/run-module.sh currency
./tests/scripts/run-module.sh department --headed
./tests/scripts/run-module.sh currency --debug
./tests/scripts/run-all.sh                 # sequential, summary at the end
./tests/scripts/run-all.sh --workers=100%  # single parallel batch
```

Any `playwright test` flag (`--headed`, `--ui`, `-g <pattern>`, `--debug`, …) passes through.

## Project structure

```
.
├── playwright.config.ts          # 3 projects (setup, login, chromium); webServer; JSON reporter
├── tests/
│   ├── auth.setup.ts             # setup project — pre-authenticates every role once per run
│   ├── *.spec.ts                 # 33 specs: 001-login, 010-department, …, 1001-campaign
│   ├── pages/                    # page objects (locator factories)
│   ├── fixtures/
│   │   ├── auth.fixture.ts       # createAuthTest(email) — boots context from .auth/<email>.json
│   │   └── auth.paths.ts         # authFile(email) — single-source path helper
│   ├── helpers/                  # shared helpers (security-cases, CRUD helpers)
│   ├── reporters/tc-json-reporter.ts
│   ├── results/*.json            # per-spec result JSONs (checked in as seeds; updated each run)
│   ├── scripts/                  # shell runners (run-module.sh, run-all.sh)
│   └── test-users.ts             # role-based test accounts
├── .auth/                        # runtime — gitignored; storageState files written by setup
└── scripts/sync-test-results.ts  # pushes results JSON → Google Sheets
```

## Test accounts

Defined in `tests/test-users.ts`. Nine roles: Requestor, HOD, Purchase, FC, GM, Owner, StoreManager, Budget, TT. Most share password `12345678`; `TT` uses `Qaz123!@#`. The `setup` project pre-authenticates every role once per `bun test` invocation and persists cookies to `.auth/<email>.json`; subsequent specs reuse that storageState instead of logging in per test.

## Test IDs

Every test title starts with a `TC-<PREFIX>-XXYYYY` ID (2-digit section + 4-digit sequence — e.g. `TC-LOGIN-010001`, `TC-DP-010003`). Strict regex: `^TC-[A-Z]{2,5}-\d{6}$`. The JSON reporter (`tests/reporters/tc-json-reporter.ts`) parses these IDs and writes one JSON per spec into `tests/results/`. Preserve the pattern when adding new tests — otherwise they won't appear in the reports. Run `bun audit:tc-ids` to verify TC ID format and prefix-catalog registration before opening a PR.

## Google Sheets sync (optional)

`bun e2e:sync` reads `tests/results/*.json` and upserts Status + Test Date into a Google Sheet. To enable:

1. Google Cloud Console → create project → enable **Google Sheets API**
2. IAM → Service Accounts → create one → download JSON key
3. Share the target spreadsheet with the service-account email as Editor
4. Set in `.env.local` (do NOT commit):
   ```
   GOOGLE_SHEETS_SA_KEY_PATH=/absolute/path/to/service-account.json
   GOOGLE_SHEETS_SPREADSHEET_ID=<sheet id from URL>
   ```
5. `bun e2e:sync`

The shell runners (`tests/scripts/run-module.sh` and `run-all.sh`) call `bun e2e:sync` automatically after each run, wrapped in `|| true` so missing credentials don't fail tests.

Tab mapping is hard-coded in `SYNC_TARGETS` inside `scripts/sync-test-results.ts` — add an entry there for any new results file.

## Notes for contributors

- **Rate limiting**: the backend returns HTTP 429 after 3 wrong-password attempts on the same email. Always use `LoginPage.loginWithRetry` rather than raw `login` when tests may produce failed auth.
- **`workers: 1`** in the config is intentional — backend state is shared across role-based accounts and tests cannot safely interleave.
- **Test titles are in Thai** to match the product UX.

See [CLAUDE.md](./CLAUDE.md) for the architecture deep-dive used by AI coding agents.
