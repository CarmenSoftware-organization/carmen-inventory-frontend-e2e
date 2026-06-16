# Design: Department test — lock active BU to BLAVG

**Date:** 2026-06-16
**Spec file:** `tests/010-department.spec.ts`
**Status:** Approved (Approach A — API + UI hybrid)

## Problem

`tests/010-department.spec.ts` runs as `admin@blueledgers.com` via `createAuthTest`,
which boots from the `auth.setup.ts` storageState. That setup only logs in — it never
selects a business unit (BU). So the suite operates against whatever BU the backend
returns as the user's default.

This matters because the department API is **BU-scoped**:

```
DEPARTMENTS: (buCode) => /api/proxy/api/config/${buCode}/departments
```

`buCode` comes from `useProfile().buCode` = `defaultBu.code`. If the active BU is not
`BLAVG`, every department CRUD operation reads and writes the wrong BU's departments.

**Goal:** make the department spec's precondition explicit — logged in as
`admin@blueledgers.com` **and** active BU = `BLAVG` — before any CRUD runs, and add a
test that asserts the active BU is `BLAVG`.

## Decisions (from brainstorming)

1. **Reusable central helper**, not inline or global. A `BuSwitcher` page object plus an
   `ensureActiveBu` helper, consumed by the department spec now and reusable by other
   BU-scoped specs later.
2. **verify-or-switch (idempotent)**: if already on `BLAVG`, do nothing; otherwise open
   the switcher and select `BLAVG`. Safe to call as a precondition repeatedly.
3. **Add a dedicated assert TC** (`TC-DEP-010009`) verifying active BU = `BLAVG`, on top
   of using `ensureActiveBu` as a silent precondition for the existing CRUD tests.
4. **Approach A — API + UI hybrid**: read the profile API as ground truth (to check
   idempotency and to map `code "BLAVG"` → BU id/display label), and perform the actual
   switch through the real navbar switcher UI.

## Relevant frontend facts

- **BU data shape** (`types/profile.ts`, `business_unit[]`): `{ id, name, code,
  alias_name, is_default, ... }`. `"BLAVG"` is the `code`.
- **BU switcher** (`components/navbar/bu-switcher.tsx`): a navbar dropdown with a
  `Building2` lucide icon. Trigger label shows `{alias_name} - {name}` (no `code` in the
  DOM). Menu content has a `"Business Unit"` header; the active item is `disabled`;
  clicking a non-active item calls the switch mutation and shows a
  `Switched to {name}` toast (sonner).
- **Endpoints** (same-origin frontend proxy — `page.request` reuses context cookies):
  - `GET /api/proxy/api/user/profile` → `{ data: { business_unit: [...] } }`
  - `POST /api/proxy/api/business-units/default` body `{ tenant_id }` (used by the app;
    the test triggers it via the UI, not directly).
- Switching persists server-side: after a switch, a fresh profile GET reflects the new
  `is_default`. With `workers: 1`, the switch persists for the admin account across the
  run, so repeated `ensureActiveBu` calls become a cheap profile GET no-op.

## Components

### 1. `tests/pages/bu-switcher.page.ts` (new) — DOM only

Locator factories (arrow functions returning `Locator`), following the page-object
convention in this repo:

- `trigger()` — the navbar switcher button, scoped by the `Building2` icon:
  `page.getByRole("button").filter({ has: page.locator("svg.lucide-building-2") })`.
  (Verify the exact lucide class at implementation time; fall back to a
  `[data-slot="dropdown-menu-trigger"]` + icon filter if needed.)
- `header()` — the `"Business Unit"` label inside the open dropdown content, used to
  confirm the menu opened.
- `itemByLabel(label)` — `page.getByRole("menuitem", { name: label })`.
- `currentLabel()` — the trigger's visible text (current BU display label).
- `switchedToast(name)` — `page.getByText(new RegExp(\`Switched to ${name}\`, "i"))`.
- `open()` — click `trigger()`, wait for `header()` visible.

The page object performs no profile lookups and holds no business logic — pure DOM.

### 2. `tests/helpers/bu.ts` (new) — orchestration

- `getProfile(page)` — `page.request.get(PROFILE)`; returns `business_unit[]`.
- `getDefaultBu(page)` — the entry with `is_default === true` (fallback: first entry, to
  mirror `useProfile`).
- `ensureActiveBu(page, code)` — verify-or-switch:
  1. `getProfile` → find the BU with `code === code`. If absent, throw a clear error
     (`admin has no BU with code "<code>"`) so misconfiguration fails loudly.
  2. If that BU is already `is_default` → return (no navigation; fast path).
  3. Otherwise: `page.goto("/dashboard")` → `BuSwitcher.open()` → click
     `itemByLabel` for that BU's display label (built from its `alias_name`/`name`) →
     wait for `switchedToast(name)` → re-GET profile and assert `is_default` flipped to
     the target.

The `PROFILE` endpoint path is defined as a constant in this helper (or a small shared
constants module), mirroring `constant/api-endpoints.ts` in the frontend.

### 3. `tests/010-department.spec.ts` (edit)

- Import `BU_CODE` from `./test-users` and `ensureActiveBu` from `./helpers/bu`.
- Add `test.beforeEach(async ({ page }) => { await ensureActiveBu(page, BU_CODE); })`
  inside the `describe`. Idempotent: one profile GET on every test after the first
  switch.
- Add **`TC-DEP-010009 active BU = BLAVG`** with the full 5-field annotation set
  (`preconditions`, `steps`, `expected`, `priority`, `testType`). The test:
  - reads the profile, asserts `getDefaultBu(page).code === "BLAVG"`;
  - asserts the navbar switcher `currentLabel()` shows that BU's display label.
  - `priority: High`, `testType: Smoke` (or `Functional`).

## Out of scope / unchanged

- `tests/auth.setup.ts` — not modified; no global BU change. The precondition lives in
  the spec, keeping other roles/specs unaffected.
- `docs/test-id-scheme.md` — prefix `DEP` is already registered; no new prefix/section.
- No frontend application code is touched (this repo holds tests only).

## Verification after implementation

- `bun run test -- 010-department.spec.ts` (or `-g "TC-DEP-010009"`) passes.
- Annotation-completeness audit: `preconditions` count == `expected` count in the spec.
- `bun audit:tc-ids` passes.
- `bun docs:user-stories` regenerated and the resulting
  `docs/user-stories/010-department.md` committed alongside the spec edit.

## Risks

- **Trigger locator brittleness** — the lucide icon class is the disambiguator vs the
  user-profile dropdown. Confirm the exact class on the running app during
  implementation; keep a `[data-slot="dropdown-menu-trigger"]` fallback.
- **admin lacks BLAVG** — surfaced as a loud, clear error from `ensureActiveBu` rather
  than a silent wrong-BU run.
- **Server-side persistence across specs** — switching admin's default to BLAVG persists
  for the account during the run. Acceptable (and arguably desirable) under `workers: 1`;
  noted so it is not a surprise if other admin specs observe BLAVG as default.
