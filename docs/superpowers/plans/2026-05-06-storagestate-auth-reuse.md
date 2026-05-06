# StorageState Auth Reuse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-authenticate the 9 role test users once per `bun run test` invocation and reuse their cookies via Playwright `storageState`, eliminating ~1142 per-test UI logins while leaving test specs unchanged.

**Architecture:** Add a Playwright `setup` project (`tests/auth.setup.ts`) that logs in every user from `TEST_USERS` and writes their browser context to `.auth/<email>.json`. Refactor `createAuthTest(email)` (`tests/fixtures/auth.fixture.ts`) to set `storageState` on the test context using a centralised path helper (`tests/fixtures/auth.paths.ts`). Wire `chromium` project to depend on `setup`; `login` project (`001-login.spec.ts`) stays independent and continues to exercise UI login.

**Tech Stack:** Playwright Test 1.58.x, Bun 1.x runtime, TypeScript 5.x, Node `path`/`fs`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-05-06-storagestate-auth-reuse-design.md`

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `.gitignore` | Modify | Add `.auth/` so per-run cookies never reach git. |
| `tests/fixtures/auth.paths.ts` | Create | Single source of truth for `<repo>/.auth/<email>.json` resolution. |
| `tests/auth.setup.ts` | Create | Setup project body — for each `TEST_USERS` entry, log in via UI and persist `storageState`. |
| `tests/fixtures/auth.fixture.ts` | Modify | Replace `loginWithRetry` auto-fixture with `storageState` override using `auth.paths.ts`. |
| `playwright.config.ts` | Modify | Register `setup` project, add `dependencies: ["setup"]` and updated `testIgnore` to `chromium`. |
| `.auth/` | Runtime | Holds 9 JSON files at runtime; gitignored, regenerated each run. |

Boundary discipline: the path helper has no Playwright dependency (pure path); the setup file depends on Playwright + page objects; the fixture depends only on the path helper and Playwright. No file knows about another file's internals.

---

### Task 1: Gitignore the runtime auth artefact directory

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `.auth/` to `.gitignore`**

Append a new line `.auth/` after line 9 (`.DS_Store`).

Resulting file:

```gitignore
node_modules/
dist/
playwright-report/
test-results/
blob-report/
playwright/.cache/
.env
.env.local
.DS_Store
.auth/
```

- [ ] **Step 2: Verify the rule resolves correctly**

Run: `mkdir -p .auth && touch .auth/sentinel.json && git status --short .auth/ ; rm -rf .auth`
Expected: empty output between the two commands (the directory is ignored). If `?? .auth/...` appears, the rule is wrong.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore(gitignore): exclude runtime .auth/ directory for storageState cookies"
```

---

### Task 2: Add the auth-path helper

**Files:**
- Create: `tests/fixtures/auth.paths.ts`

- [ ] **Step 1: Create `tests/fixtures/auth.paths.ts`**

```ts
import path from "node:path";

/**
 * Resolve the persisted storageState file for the given user email.
 * Files live at <repo-root>/.auth/<email>.json and are produced by
 * tests/auth.setup.ts at the start of every run.
 */
export function authFile(email: string): string {
  return path.join(process.cwd(), ".auth", `${email}.json`);
}
```

- [ ] **Step 2: Smoke-check the helper resolves to `<repo>/.auth/<email>.json`**

Run from the repo root:

```bash
bun -e "import('./tests/fixtures/auth.paths.ts').then(m => console.log(m.authFile('purchase@blueledgers.com')))"
```

Expected: a single absolute path ending in `/.auth/purchase@blueledgers.com.json`. Anything else (relative, undefined, error) → fix the helper.

- [ ] **Step 3: Commit**

```bash
git add tests/fixtures/auth.paths.ts
git commit -m "test(fixtures): add authFile path helper for storageState files"
```

---

### Task 3: Add the `setup` project and `auth.setup.ts`

This task lands the setup project file *and* the config registration together so the file is reachable by Playwright as soon as it exists. After this task `bunx playwright test --project=setup` produces 9 JSON files, but no other project consumes them yet — existing specs still log in via UI as before.

**Files:**
- Create: `tests/auth.setup.ts`
- Modify: `playwright.config.ts`

- [ ] **Step 1: Create `tests/auth.setup.ts`**

```ts
/**
 * Playwright setup project: log in every test user once per run via the
 * UI and persist their browser context (cookies + localStorage) to
 * .auth/<email>.json. Specs never call loginWithRetry directly — they
 * load this storageState through createAuthTest in
 * tests/fixtures/auth.fixture.ts.
 */
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

- [ ] **Step 2: Register the `setup` project in `playwright.config.ts`**

Replace the entire `projects: [...]` array with the version below. Leave `webServer`, `use`, `reporter`, `workers`, etc. untouched.

```ts
projects: [
  {
    name: "setup",
    testMatch: /auth\.setup\.ts$/,
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "login",
    testMatch: /001-login\.spec\.ts/,
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "chromium",
    testIgnore: /001-login\.spec\.ts$|auth\.setup\.ts$/,
    use: { ...devices["Desktop Chrome"] },
  },
],
```

Note: `chromium`'s `dependencies` are wired in **Task 4** — keep it absent here so this commit is safe to revert.

- [ ] **Step 3: Run only the setup project and verify the artefacts**

```bash
bunx playwright test --project=setup
```

Expected:
- 9 setup tests pass (one per `TEST_USERS` entry).
- `.auth/` contains 9 JSON files:

```bash
ls .auth/*.json | wc -l
# 9
```

- Each file has both auth cookies:

```bash
jq -r '.cookies[].name' .auth/purchase@blueledgers.com.json | sort -u | tr '\n' ' '
# Expected output contains: access_token refresh_token
```

If any setup test fails, debug `loginWithRetry` against the running dev server before continuing — do not proceed.

- [ ] **Step 4: Commit**

```bash
git add tests/auth.setup.ts playwright.config.ts
git commit -m "test(auth): add setup project that pre-authenticates all role users"
```

---

### Task 4: Wire `chromium` project to depend on `setup`

After this task, `bun run test` will always run setup first. Specs still call `loginWithRetry` (the fixture refactor lands in Task 5), so the dependency is harmless overhead — *not a behaviour change yet*. This separation keeps each commit independently bisectable.

**Files:**
- Modify: `playwright.config.ts:35-39` (the `chromium` project entry)

- [ ] **Step 1: Add `dependencies: ["setup"]` to the `chromium` project**

Update only the `chromium` block; the rest stays identical to Task 3.

```ts
{
  name: "chromium",
  testIgnore: /001-login\.spec\.ts$|auth\.setup\.ts$/,
  dependencies: ["setup"],
  use: { ...devices["Desktop Chrome"] },
},
```

- [ ] **Step 2: Verify dependency is honoured**

Run a single chromium spec and confirm the setup project runs first:

```bash
rm -rf .auth
bunx playwright test 020-unit.spec.ts --project=chromium --list
```

Expected: the listing shows the setup tests will run before chromium tests (Playwright prepends them automatically because of `dependencies`). Then:

```bash
bunx playwright test 020-unit.spec.ts --project=chromium -g "TC-UN-010001" 2>&1 | tail -20
ls .auth/*.json | wc -l
# 9
```

The `.auth/` directory should be repopulated by the implicit setup phase.

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts
git commit -m "test(config): make chromium project depend on auth setup"
```

---

### Task 5: Refactor `createAuthTest` to load `storageState`

Now that `.auth/<email>.json` is guaranteed to exist before `chromium` tests run, swap the per-test UI login for a per-context storageState override. After this task specs no longer hit `/login` at all unless `001-login.spec.ts` is invoked.

**Files:**
- Modify: `tests/fixtures/auth.fixture.ts` (full rewrite — small file)

- [ ] **Step 1: Replace the contents of `tests/fixtures/auth.fixture.ts`**

```ts
import { test as base } from "@playwright/test";
import { authFile } from "./auth.paths";

/**
 * Returns a Playwright `test` whose browser context boots with the
 * given user's persisted cookies. The persisted state is produced
 * once per run by tests/auth.setup.ts (registered as the `setup`
 * Playwright project). Specs that previously relied on the
 * loginWithRetry auto-fixture keep their existing call shape:
 *
 *     const test = createAuthTest("purchase@blueledgers.com");
 */
export function createAuthTest(email: string) {
  return base.extend({
    storageState: authFile(email),
  });
}
```

This removes the now-unused `expect`, `LoginPage`, and `TEST_PASSWORD` imports. The exported function name and signature are preserved, so the 33 consumer specs need no edits.

- [ ] **Step 2: TypeScript-check the workspace**

```bash
bunx tsc --noEmit
```

Expected: exit code 0. If a stale type still references the old fixture's `authenticatedPage` type, surface and fix it (a global grep for `authenticatedPage` should find nothing outside `tests/fixtures/auth.fixture.ts` history).

- [ ] **Step 3: Run a representative spec end-to-end**

Pick a small spec that was previously stable (vendor list smoke is good — uses `purchase@`):

```bash
rm -rf .auth
bun run test -- 150-vendor.spec.ts -g "TC-VEN-010001"
```

Expected:
- The setup project runs first and produces `.auth/*.json` (9 files).
- The vendor smoke test passes.
- Total wall time for this single test plus setup is a few seconds — substantially less than the previous "login per test" baseline.

- [ ] **Step 4: Confirm the spec did not visit `/login`**

Re-run with tracing on, then inspect the trace for any `auth/login` requests:

```bash
bun run test -- 150-vendor.spec.ts -g "TC-VEN-010001" --trace=on
# Find the trace zip:
TRACE=$(ls -t test-results/**/trace.zip 2>/dev/null | head -1)
unzip -p "$TRACE" trace.network 2>/dev/null | grep -c '/api/auth/login'
# Expected: 0
```

Zero `/api/auth/login` hits during the chromium test confirms `storageState` is doing its job. (The setup phase will of course log in — that is expected and not counted here, since its trace lives in a different project's results directory.)

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures/auth.fixture.ts
git commit -m "test(fixtures): swap createAuthTest from per-test login to storageState"
```

---

### Task 6: Full-suite smoke + readme touch-up

**Files:**
- Modify: `CLAUDE.md` (one paragraph in the `## Architecture` section)

- [ ] **Step 1: Run the full suite once and capture wall time**

```bash
rm -rf .auth playwright-report test-results
time bun run test 2>&1 | tee /tmp/post-storagestate-run.log
```

Compare the reported `Duration` against the baseline run captured in this session. Acceptance: ≥ 30 % reduction (per the spec). If the reduction is less than expected, profile setup time first (`grep -E "authenticate as" /tmp/post-storagestate-run.log`) — login retries during setup are the most likely cause.

Also confirm the login project is unaffected:

```bash
bun run test:login
```

Expected: same pass count as the pre-refactor baseline (the `login` project does not depend on `setup` and no shared state should have leaked through).

- [ ] **Step 2: Update `CLAUDE.md` Architecture section**

Insert the following paragraph immediately after the existing bullet describing `tests/fixtures/auth.fixture.ts` (currently the third bullet under `## Architecture`):

```markdown
- **`tests/auth.setup.ts`** — Playwright `setup` project. Runs once per `bun run test` invocation, logs in every entry of `TEST_USERS` via the real UI, and writes the resulting browser context to `.auth/<email>.json`. The `chromium` project depends on `setup`, so chromium tests start with cookies pre-loaded and never hit `/login`. The `login` project (`001-login.spec.ts`) deliberately does **not** depend on setup — it tests the UI login flow itself. `.auth/` is gitignored and regenerated each run.
```

Update the bullet for `tests/fixtures/auth.fixture.ts` so it reads:

```markdown
- **`tests/fixtures/auth.fixture.ts`** — `createAuthTest(email)` returns a `test` whose browser context boots from `.auth/<email>.json` (produced by the `setup` project). Specs that consume the helper need no other auth setup.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude.md): document setup project + storageState auth flow"
```

---

## Self-Review

**Spec coverage:**
- Goals 1 (one login per run) — Tasks 3, 4. ✓
- Goal 2 (specs unchanged) — Task 5 preserves `createAuthTest` signature. ✓
- Goal 3 (login project untouched) — Task 3 adds `login` to projects with no `dependencies`; Task 4 only modifies `chromium`. ✓
- Goal 4 (≥ 30 % wall-time reduction) — Task 6 measures it. ✓
- Architecture file table — every row has a corresponding task (Task 1 → `.gitignore`, Task 2 → `auth.paths.ts`, Task 3 → `auth.setup.ts` + config, Task 4 → config dependency, Task 5 → `auth.fixture.ts`, Task 6 → docs). ✓
- Edge case: TT user different password — covered by `getPasswordFor` in Task 3 setup body. ✓
- Edge case: `001-login.spec.ts` independent — Task 3 adds it as standalone project. ✓
- Edge case: `workers: 1` preserved — no task modifies it. ✓
- Acceptance criteria 1-2 (file count, cookie names) — Task 3 step 3. Acceptance 3 (no login network) — Task 5 step 4. Acceptance 4 (login spec passes) — implicit (file unchanged) but recommend running `bun run test:login` once. Acceptance 5 (≥ 30 %) — Task 6. ✓

**Placeholder scan:** No "TBD"/"TODO"/"add error handling later" strings present. ✓

**Type/name consistency:** `authFile` signature `(email: string) => string` is identical in Task 2 (definition), Task 3 (consumer in `auth.setup.ts`), and Task 5 (consumer in `auth.fixture.ts`). `TEST_USERS`, `getPasswordFor`, `LoginPage` reused per their existing signatures. Project names `setup`/`login`/`chromium` consistent across Tasks 3-4. ✓

**Gap:** Acceptance criterion 4 ("`bun run test:login` continues to pass") is not exercised by any explicit step. Adding a one-line check to Task 6 step 1: include `bun run test:login` and verify it still passes alongside the full-suite run.

Updated Task 6 step 1 to add this check:

```bash
bun run test:login
# Expected: same pass count as the pre-refactor baseline.
```
