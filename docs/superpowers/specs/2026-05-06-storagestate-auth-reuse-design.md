# StorageState Auth Reuse — Design

**Date:** 2026-05-06
**Goal:** Eliminate per-test UI login by pre-authenticating each test user once per run and reusing the resulting cookies (`access_token`, `refresh_token`) via Playwright's `storageState`.

## Problem

Today every spec that needs auth uses `createAuthTest(email)` (`tests/fixtures/auth.fixture.ts`), which runs `LoginPage.loginWithRetry` as an `auto: true` fixture before each test. With **1151 tests** across 33 specs and `workers: 1`, this means ~1142 UI logins per full run. Each login is 1–3s, plus the backend rate-limits 3 wrong-password attempts on the same email and forces a 5s backoff. UI login dominates total wall time.

## Goals

1. Login each user **once per `bun run test` invocation** instead of once per test.
2. Reuse cookies via `storageState` so test specs themselves are unchanged.
3. Keep `001-login.spec.ts` (login project) on UI login — it tests the login flow itself.
4. Reduce total wall time of `bun run test` by **≥ 30 %** vs. baseline.

## Non-goals (out of scope)

- Increasing `workers` above 1 (backend CRUD state isolation is unsolved).
- API-only login bypassing the browser.
- Cross-run caching of `.auth/<email>.json` — Q3 decision: regenerate every run.
- Modifying `tests/scripts/run-all.sh` or `run-module.sh` — they pass through to `playwright test` which handles project dependencies.

## Architecture

### File changes

```
tests/
  auth.setup.ts             NEW    — setup project body, logs in 9 users
  fixtures/
    auth.fixture.ts         EDIT   — replaces login with storageState load
    auth.paths.ts           NEW    — central path resolver
playwright.config.ts        EDIT   — adds setup project + dependencies
.gitignore                  EDIT   — ignores .auth/
.auth/                      RUNTIME— gitignored, regenerated each run
  requestor@blueledgers.com.json
  hod@blueledgers.com.json
  purchase@blueledgers.com.json
  fc@blueledgers.com.json
  gm@blueledgers.com.json
  owner@blueledgers.com.json
  storemanager@blueledgers.com.json
  budget@blueledgers.com.json
  tt@blueledgers.com.json
```

### Project topology in `playwright.config.ts`

```
projects:
  - setup       (testMatch: /auth\.setup\.ts/)
  - login       (testMatch: /001-login\.spec\.ts/)            ← no dependencies, no storageState
  - chromium    (testIgnore: /001-login\.spec\.ts|auth\.setup\.ts/, dependencies: ["setup"])
```

`bun run test` runs `setup` first; `chromium` only starts after setup passes for all 9 users. `login` is independent.

## Module contracts

### `tests/auth.setup.ts`

```ts
import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { TEST_USERS, getPasswordFor } from "./test-users";
import { authFile } from "./fixtures/auth.paths";

for (const user of TEST_USERS) {
  setup(`authenticate as ${user.role}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry(user.email, getPasswordFor(user.email));
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await page.context().storageState({ path: authFile(user.email) });
  });
}
```

### `tests/fixtures/auth.paths.ts`

```ts
import path from "node:path";
export const authFile = (email: string) =>
  path.resolve(__dirname, "..", "..", ".auth", `${email}.json`);
```

### `tests/fixtures/auth.fixture.ts` (refactored)

```ts
import { test as base } from "@playwright/test";
import { authFile } from "./auth.paths";

export function createAuthTest(email: string) {
  return base.extend({
    storageState: authFile(email),
  });
}
```

The exported shape (`createAuthTest(email)` returning a `test`) is preserved — the 33 specs that consume it stay unchanged.

## Data flow

1. `bun run test` → Playwright loads config → resolves project graph.
2. `setup` project runs: 9 sequential `setup(...)` blocks, each logs in via `LoginPage.loginWithRetry` and writes `.auth/<email>.json` containing the browser context's cookies (`access_token`, `refresh_token`) and any localStorage.
3. After `setup` passes, `chromium` project starts. For each test, the fixture sets `storageState: authFile(email)` on the new context.
4. The browser context boots with `access_token` and `refresh_token` cookies pre-loaded. `page.goto("/whatever-protected")` succeeds without redirecting to `/login`.
5. If `access_token` expires mid-suite, the existing frontend proxy (`app/api/proxy/[...path]/route.ts`) calls `/api/auth/refresh` using the persisted `refresh_token` and re-issues `access_token` — transparent to the test.

## Error handling

| Failure mode                          | Behaviour                                                                                                                                                                                       |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Setup login fails (wrong creds, 429)  | `loginWithRetry` already backs off 5s on rate-limit. If it ultimately fails, the `setup(...)` block fails → `chromium` project does not run (Playwright `dependencies` semantics). User sees the failure immediately in the reporter. |
| `.auth/<email>.json` missing at runtime | Playwright throws `ENOENT` when constructing the context → loud error. Should not happen in normal flow because `dependencies` guarantees setup ran.                                          |
| `access_token` expires mid-test       | Frontend proxy refreshes via `refresh_token` cookie → transparent.                                                                                                                              |
| Both tokens expire / refresh fails    | Test redirects to `/login` and fails its URL assertion. User reruns the suite (which re-runs setup). Acceptable — not in steady-state path.                                                     |

## Edge cases

1. **`001-login.spec.ts`** — uses base `test` from `@playwright/test`, not `createAuthTest`. Belongs to `login` project, which has no `dependencies` and no `storageState`. UI login is exercised as designed.
2. **TT user** has password `Qaz123!@#` (not `12345678`). `getPasswordFor()` already returns the correct password by email; `auth.setup.ts` uses it. (Side benefit: the current `createAuthTest` uses the hard-coded `TEST_PASSWORD` — a latent bug that this refactor incidentally closes, since the auth path no longer touches passwords post-setup.)
3. **`workers: 1`** preserved. Justification in `playwright.config.ts` (CRUD state sharing) still applies.
4. **`.auth/` in `.gitignore`** — prevents accidental commit of dev tokens.
5. **Shell scripts** (`run-all.sh`, `run-module.sh`) require no edits. They invoke `playwright test "<spec>"`, and Playwright resolves project dependencies automatically.

## Acceptance criteria

1. After a clean run, `ls .auth/*.json | wc -l` = 9.
2. `jq -r '.cookies[].name' .auth/purchase@blueledgers.com.json | sort -u` includes `access_token` and `refresh_token`.
3. Running a representative spec (`bun run test -- 150-vendor.spec.ts`) produces zero `POST /api/auth/login` requests in its trace.
4. `bun run test:login` continues to pass without modification.
5. Total `bun run test` wall time decreases by ≥ 30 % vs. the run captured in this session's baseline.

## Risks & mitigations

- **Cookies marked HttpOnly/SameSite that Playwright might serialize differently across versions** — mitigation: ship & verify on the project's pinned `@playwright/test` version (currently `^1.58.2`); if an issue surfaces, regenerate via `auth.setup.ts` rather than caching across versions.
- **Refresh-token rotation** — backend may rotate `refresh_token` on each refresh; Playwright will not write the rotated value back to `.auth/<email>.json`, so a long suite with many refreshes may eventually fail. Mitigation: `setup` regenerates every run, so the window is bounded by one full suite (acceptable today; revisit if observed).
- **First-time runs on CI** still pay the 9-login cost. With `loginWithRetry` ~2s/user → ~18–25s overhead on top of the chromium project — net win remains large.

## Out-of-band cleanup

- Remove the now-unused imports (`LoginPage`, `TEST_PASSWORD`) from `auth.fixture.ts`.
- Add a top-of-file comment in `auth.setup.ts` explaining the role and why specs do not need to call `loginWithRetry` themselves.
