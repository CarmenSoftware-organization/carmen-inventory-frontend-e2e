# Design: Unit spec — BLAVG precondition + full dialog CRUD coverage

**Date:** 2026-06-16
**Spec file:** `tests/020-unit.spec.ts`
**Status:** Approved (scope = BU precondition + Tier 1 CRUD + Tier 2 validation/edge + Tier 3 security upgrade)

## Problem

`tests/020-unit.spec.ts` is **smoke-only** (`TC-UN-010001..010004`: list loads, Add button, search, empty-state) plus list-only security cases. The Unit config module supports **full dialog CRUD**, so coverage is thin. Also, like department, the Unit list/CRUD API is **BU-scoped** (`/api/proxy/api/config/{buCode}/units`), and the spec does not pin the active BU — so tests run against whatever BU is default.

**Goal:** (1) pin active BU = `BLAVG` as a precondition, (2) add an assert TC for it, (3) add the missing CRUD + validation + edge coverage, (4) upgrade security from list-only to dialog-level — mirroring the proven `029-business-type.spec.ts` template.

## Relevant facts (verified)

- **Unit is dialog-based CRUD** (`components/share/unit-dialog.tsx`, rendered via `ConfigListTemplate` + `renderDialog`). Fields: `name` (id `unit-name`, required, zod `min(1)`), `description` (id `unit-description`, optional, `z.string()`), `is_active` (id `unit-is-active`, StatusSwitch). **No `code` field.** Same shape as business-type plus a description field.
- CRUD via `createConfigCrud` (`hooks/use-unit.ts`) — `UNITS` endpoint, BU-scoped. `updateMethod` is **PUT** (default; business-type uses PATCH).
- The e2e repo already has everything needed on `main`:
  - `ensureActiveBu(page, code)` / `getBusinessUnits` / `defaultBu` (`tests/helpers/bu.ts`), `BuSwitcherPage` (`tests/pages/bu-switcher.page.ts`).
  - `DialogCrudHelper` (`tests/pages/dialog-crud.helper.ts`): `openAddDialog()`, `clickRow(name)`, `deleteRow(name)`, `dialog()`, `nameInput()`, `activeSwitch()`, `saveButton()`, `cancelButton()`, `deleteConfirm()/deleteConfirmButton()/deleteCancelButton()`, `.list`. Opts: `listPath`, `nameInputId`, `activeSwitchId` (no `descriptionInputId` yet).
  - `addDialogSecurityCases(test, { prefix, listPath, makeHelper, skipAuth })`.
- `BU_CODE = "BLAVG"` exported from `tests/test-users.ts`.
- Template to mirror: `029-business-type.spec.ts` (dialog CRUD: TC-BT-010006 create, 010007 edit, 010008 delete, 010013 edit-clear-name validation; `addDialogSecurityCases`).
- TC-ID scheme: prefix `UN`, sections `01–05, 10`. Used so far: `010001–010004`, `100004`. New functional IDs `010005–010013` are free and in range.

## Decisions

- **Reuse existing helpers**; the only helper change is a **generic extension** of `DialogCrudHelper`: add optional `descriptionInputId` + `descriptionInput()`, `isActive()`, `setActive(on)` (mirrors the additions already made to `PageFormCrudHelper`). No Unit-specific helper.
- **Self-contained tests**: each create-heavy test makes its own uniquely-named record and deletes it. Assert persistence via **reload/list**, not just the toast (avoids the create-toast/update-toast overlap that bit the department work).
- **Security upgrade**: replace `addListOnlySecurityCases` with `addDialogSecurityCases` (XSS/SQLi/maxLength exercised against the create dialog's `name` input).

## Components / changes (single file + one helper)

### 1. `tests/pages/dialog-crud.helper.ts` (extend, generic)
- Add `descriptionInputId?: string` to `DialogCrudOptions`.
- Add `descriptionInput(): Locator` (throws if unset), `isActive(): Promise<boolean>` (reads `activeSwitch()` `aria-checked`), `setActive(on): Promise<void>` (clicks only if differing). Identical contracts to the `PageFormCrudHelper` versions.

### 2. `tests/020-unit.spec.ts` (main change)
- Imports: `BU_CODE` from `./test-users`; `ensureActiveBu, getBusinessUnits, defaultBu` from `./helpers/bu`; `BuSwitcherPage` from `./pages/bu-switcher.page`; `DialogCrudHelper` from `./pages/dialog-crud.helper`; swap `addListOnlySecurityCases` → `addDialogSecurityCases`.
- `const UID = Date.now().toString(36)` + an `opts` object: `{ listPath: PATH, nameInputId: "unit-name", activeSwitchId: "unit-is-active", descriptionInputId: "unit-description" }`.
- `test.beforeEach(async ({ page }) => { await ensureActiveBu(page, BU_CODE); })` inside the describe.
- **New tests** (all with the full 5-field annotation; self-contained; testType in parens):
  - **TC-UN-010005** active BU = BLAVG (Smoke) — read profile, assert `defaultBu(units).code === "BLAVG"` + navbar switcher trigger shows the BU name. Mirrors `TC-DEP-010009`.
  - **TC-UN-010006** create (CRUD) — `openAddDialog` → fill name → Save → created toast → list shows row.
  - **TC-UN-010007** edit name + persist (CRUD) — open fresh from list → edit → Save → updated toast → **reload/list confirms** the new name. Doubles as a persistence regression guard; will reveal any unit-update persistence issue.
  - **TC-UN-010008** delete (CRUD) — `deleteRow` → deleted toast → row gone.
  - **TC-UN-010009** create with empty name → blocked (Validation) — Save with empty name; dialog stays open (Save still visible / error shown).
  - **TC-UN-010010** duplicate name rejected (Negative) — create name X; create X again → no success / error. If the backend does NOT reject (mirrors the department dup-code finding), mark `test.fixme` with a `note` and surface it.
  - **TC-UN-010011** description create/edit + maxLength (CRUD) — create with description → reopen confirms; maxLength capping per the input's `maxLength`.
  - **TC-UN-010012** toggle is_active persist (CRUD) — create with is_active off → reopen → switch reflects off.
  - **TC-UN-010013** edit: clear name → Save → validation block (Validation) — mirror `TC-BT-010013`.
- Replace the security call with: `addDialogSecurityCases(test, { prefix: "UN", listPath: PATH, makeHelper: (page) => new DialogCrudHelper(page, opts), skipAuth: true })`.

## Out of scope / unchanged
- `auth.setup.ts` (no global BU change), `docs/test-id-scheme.md` (prefix `UN` already registered; all new IDs in section 01).
- No frontend/backend changes.

## Risks
- **Unit update persistence** — unit uses PUT; `TC-UN-010007`'s reload assertion will reveal any persistence gap (like department's PATCH `doc_version`). If found, surface it (don't loosen the assertion).
- **Duplicate-name enforcement** — if the backend accepts duplicate names, `TC-UN-010010` becomes `test.fixme` with a documented note (same pattern as `TC-DEP-010011`).
- **Security-case ID overlap** — switching helpers changes which `TCS-UN`/`TC-UN-10xxxx` cases are generated; reconcile against the previously-referenced `TC-UN-100004` skip during implementation so `bun audit:tc-ids` stays clean.

## Verification
- `bun run test -- 020-unit.spec.ts` → all pass (any data-dependent case skips cleanly).
- Annotation completeness (`preconditions` count == `expected` count); `bun audit:tc-ids` 0 errors.
- `bun docs:user-stories` regenerated; commit `docs/user-stories/020-unit.md`.
