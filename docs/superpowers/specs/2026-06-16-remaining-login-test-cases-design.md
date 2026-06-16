# Design — Remaining login test cases (batch 2)

**Date:** 2026-06-16
**Spec file:** `tests/001-login.spec.ts` · **Page object:** `tests/pages/login.page.ts`
**Approach:** A — inline in the existing login spec, extend `LoginPage` locator factories. No new helper module, no new spec file. Follows the CLAUDE.md convention that all login/logout coverage lives in `001-login.spec.ts`.

## Goal

Add six login test cases that fill the gaps left after batch 1 (TC-LOGIN-010036/037/040). Scope agreed: **session & security** + **form UX states**. i18n (010044) is explicitly out of scope this round.

All cases run against the **real backend** (`https://dev.blueledgers.com:4001` via runtime `config.json`) using `loginWithRetry` for resilience. No request mocking (`page.route`). Two cases are inherently timing-sensitive against a fast real backend and are accepted as **best-effort** with tolerant assertions.

## Cases

| TC | describe | Intent | Priority | testType |
|----|----------|--------|----------|----------|
| TC-LOGIN-010035 | เข้าสู่ระบบ | Valid `?next=` honored after login | High | Functional |
| TC-LOGIN-010038 | ออกจากระบบ | Logout clears the refresh token | High | Security |
| TC-LOGIN-010043 | เข้าสู่ระบบ | Tampered refresh token → bounced to /login | High | Security |
| TC-LOGIN-010041 | เข้าสู่ระบบ | Show/hide password toggle | Low | Functional |
| TC-LOGIN-010039 | เข้าสู่ระบบ | Submit disabled while request in-flight (best-effort) | Medium | Functional |
| TC-LOGIN-010042 | เข้าสู่ระบบ | Rate-limit countdown UI on 429 (best-effort) | Medium | Functional |

These IDs do not collide with existing ones (010036/037/040 added in batch 1). 010044 is reserved for the deferred i18n case.

## Grounding (verified against `../carmen-inventory-frontend-react`)

- **Redirect target after login**: `components/login-form.tsx:113` →
  `router.push(resolveNextPath(searchParams.get("next")))`. The `?next=` query
  param is honored; `resolveNextPath` (`lib/auth/resolve-next-path.ts`) falls
  back to `/dashboard` for missing / non-`/` / `//` / `/\` values.
- **Deep-link caveat (drives 010035)**: `components/auth/require-auth.tsx`
  redirects unauthenticated users to `/login` carrying the target in **router
  state `from`**, *not* in `?next=`. login-form reads `?next=` only. So the
  "protected route → login → return to that route" flow does NOT carry through
  the query param. 010035 therefore tests an **explicit `?next=` in the URL**,
  which is the supported, unit-tested behavior
  (`components/auth/__tests__/redirect-if-authed.test.tsx`).
- **Token storage**: access token in memory (`lib/auth/token-store.ts`);
  refresh token in `localStorage` key **`carmen.refresh_token`**
  (`lib/auth/refresh-token-storage.ts`). On boot, the app refreshes the access
  token from the stored refresh token.
- **Submit disabled**: `login-form.tsx` `disabled={loginMutation.isPending || retryAfter !== null}`.
- **Show/hide password**: button label `Show password` / `Hide password`
  (`messages/en.json`); input `type={show ? "text" : "password"}`.
- **Rate-limit countdown**: on a 429 carrying `retry_after`, the form renders
  `errors.tooManyAttempts` = `"Too many login attempts. Try again in {seconds}s."`
  in a `role="alert"` block and disables the submit button until the countdown
  ends.

## Page object additions (`LoginPage`)

```ts
showPasswordToggle = () => this.page.getByRole("button", { name: /show password/i });
hidePasswordToggle = () => this.page.getByRole("button", { name: /hide password/i });
countdownMessage   = () => this.page.getByText(/too many login attempts.*try again in \d+\s*s/i);
// submitButton() already exists — assert with toBeDisabled()
```

Refresh-token read/clear is done inline via `page.evaluate(() => localStorage.getItem("carmen.refresh_token"))` — single-use, no helper module (YAGNI; refactor to `tests/helpers/session.ts` later if another module needs it).

## Per-case detail

### TC-LOGIN-010035 — Valid `?next=` honored
1. `page.goto("/login?next=<path>")`.
2. `loginWithRetry(requestor, TEST_PASSWORD)`.
3. Expect URL to match `<path>` (not `/dashboard`).

**Open detail (resolve at implementation):** `<path>` must be a route the
**requestor** role can actually reach; otherwise a per-page `RouteGuard` bounces
to `/dashboard` and the test fails. Pick a verified requestor-accessible route —
cross-check `002-spa-smoke.spec.ts` for a section requestor visits, or confirm by
manual nav. Do not hard-code a path before verifying access.

### TC-LOGIN-010038 — Logout clears refresh token
1. `loginWithRetry(requestor)`; expect `/dashboard`.
2. Assert `localStorage["carmen.refresh_token"]` is a non-empty string.
3. Logout via `DashboardPage.logout()`; expect `/login`.
4. Assert `localStorage["carmen.refresh_token"]` is null/removed.
5. `page.goto("/dashboard")` → expect redirect to `/login` (session not restorable).

### TC-LOGIN-010043 — Tampered refresh token bounced
1. `page.goto("/login")` (establish origin).
2. `page.evaluate(() => localStorage.setItem("carmen.refresh_token", "garbage-invalid-token"))`.
3. `page.goto("/dashboard")`.
4. Boot attempts refresh with the bad token → real backend returns 401 → token
   store stays empty → `RequireAuth` redirects. Expect `/login`.

### TC-LOGIN-010041 — Show/hide password toggle
1. `page.goto("/login")`; fill password.
2. Assert `passwordInput()` `type="password"`.
3. Click `showPasswordToggle()` → assert `type="text"` and `hidePasswordToggle()` visible.
4. Click `hidePasswordToggle()` → assert `type="password"` again.

Pure UI, no backend, deterministic.

### TC-LOGIN-010039 — Submit disabled while in-flight (best-effort)
1. `page.goto("/login")`; fill valid requestor credentials.
2. Click Sign In.
3. **Tolerant assertion:** race "button became disabled" vs "navigated to
   /dashboard". Pass if either is observed — a too-fast in-flight that redirects
   before the disabled state is observable still proves no double-submit window
   was left open. Avoids false-fail on a fast backend.

### TC-LOGIN-010042 — Rate-limit countdown UI (best-effort)
1. Use a unique non-existent email `countdown-${Date.now()}@nonexistent.com` to
   isolate rate-limit state from other tests.
2. Submit wrong credentials 3× to trigger a real 429 with `retry_after`.
3. Assert `countdownMessage()` visible and `submitButton()` disabled.

Depends on the backend returning `retry_after`; flaky if timing/headers vary —
accepted as best-effort.

## Conventions / gates (CLAUDE.md)

- Every `test(...)` ships all five annotations: `preconditions`, `steps`,
  `expected`, `priority`, `testType`.
- After writing: `bun audit:tc-ids` (format + prefix + section), annotation
  completeness audit, and `bun docs:user-stories` (regenerate + commit
  `docs/user-stories/001-login.md`).
- Thai test titles, `getByRole`/semantic selectors, locator-factory page objects.

## Out of scope

- TC-LOGIN-010044 (i18n EN/TH on login) — deferred.
- Request mocking / `page.route` — user chose real backend throughout.
- Extracting a shared session helper module — deferred until a second consumer exists.
