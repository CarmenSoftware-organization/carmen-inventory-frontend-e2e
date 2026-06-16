# Design: Business Type — BLAVG precondition + complex coverage + doc_version fix

**Date:** 2026-06-16
**Spec file:** `tests/029-business-type.spec.ts`  (+ frontend `business-type-dialog.tsx`)
**Status:** Approved (BU precondition + 5 complex cases + frontend doc_version fix)

## Problem

`tests/029-business-type.spec.ts` covers only smoke + basic CRUD/validation (9 tests) and does **not** pin the active BU. Like department/unit, the business-type CRUD API is BU-scoped (`/api/config/{buCode}/business-types`), so tests should run with active BU = `BLAVG`. Additionally, the business-type **edit is broken**: the update is a PATCH and `business-type-dialog.tsx` sends `{ id, ...payload }` **without `doc_version`**, which the backend requires → `400 "doc_version: Required"` (the same defect already fixed for department and unit). So the existing edit test (`TC-BT-040001`) is latently failing.

**Goal:** (1) pin BU = `BLAVG` + assert it; (2) add complex coverage (duplicate-name, is_active persistence, edit-persistence guard, discard dialog, delete-cancel); (3) fix the frontend `doc_version` omission so edits work.

## Relevant facts (verified)
- BT dialog (`components/.../business-type-dialog.tsx`): fields are **`name`** (`#business-type-name`, required) + **`is_active`** (`#business-type-is-active`). No code, no description. Update = PATCH via `createConfigCrud`; payload omits `doc_version`; `BusinessType` type lacks `doc_version`.
- e2e helpers on `main`: `ensureActiveBu`/`getBusinessUnits`/`defaultBu` (`tests/helpers/bu.ts`), `BuSwitcherPage`, `DialogCrudHelper` (with `nameInput/activeSwitch/isActive/setActive/openAddDialog/clickRow/deleteRow/dialog/errorMessage/cancelButton/deleteConfirmButton`), `BU_CODE="BLAVG"`.
- BT spec already renumbered to the section-block scheme: 01 (smoke), 03 (create `030001`), 04 (edit `040001`), 05 (delete `050001`), 20 (validation `200001/200002`), 10 (dialog security). New IDs fit existing sections → **no catalog change**.
- **Lesson applied:** the `/updated|success|สำเร็จ/` toast matches the create toast; gating navigation on the toast can abort an in-flight PATCH. Edit/persist tests must wait for the **dialog to close** (update committed) before navigating — as fixed for unit `TC-UN-010007`.

## Components / changes

### A. Frontend fix — `carmen-inventory-frontend-react` (mirror unit/department)
- `types/business-type.ts`: add `doc_version: number` to `BusinessType`; add `doc_version?: number` to `CreateBusinessTypeDto`.
- `business-type-dialog.tsx`: update mutation sends `{ id: businessType.id, doc_version: businessType.doc_version, ...payload }`.
- Verify: PATCH 400→200, edit persists.

### B. e2e — `tests/029-business-type.spec.ts`
- Imports: `BU_CODE`, `ensureActiveBu/getBusinessUnits/defaultBu`, `BuSwitcherPage`.
- `test.beforeEach(ensureActiveBu(page, BU_CODE))` inside the describe.
- New tests (full 5-field annotations; self-contained with unique `E2E BT <UID>` names; cleanup-by-delete):
  - **`TC-BT-010005` active BU = BLAVG** (Smoke) — profile `defaultBu.code === "BLAVG"` + navbar switcher shows the BU name.
  - **`TC-BT-040002` toggle is_active → persist** (CRUD) — create with is_active off → reopen → `aria-checked=false` → cleanup.
  - **`TC-BT-040003` edit name persists** (CRUD) — create → open fresh from list → edit name → Save → **wait dialog hidden** (commit) → list shows renamed, old gone → cleanup. (Regression guard for the doc_version fix.)
  - **`TC-BT-040004` Cancel-while-dirty → Discard dialog** (Functional) — create → edit (dirty) → Cancel → Discard alertdialog confirm → reopen shows original name → cleanup.
  - **`TC-BT-200003` duplicate name → reject** (Negative) — create name X → Add again with X → dialog stays open (backend rejects) → cleanup.
  - **`TC-BT-050002` delete-cancel keeps record** (Functional) — create → open delete dialog → Cancel → record still in list → cleanup.

## Out of scope / unchanged
- The existing BT tests (smoke/CRUD/validation/security) are untouched except inheriting the `beforeEach`.
- `auth.setup.ts`, scheme catalog (BT sections already cover 01/04/05/20) — no change.

## Risks
- **doc_version** is the root edit blocker; fixing the frontend is required for the edit/persist tests (and the existing `TC-BT-040001`) to pass. Verified-passing only against the fixed frontend (deploy needed for UAT/CI).
- **Duplicate-name** assumes the backend rejects (it checks `name` uniqueness, as seen in the department/unit services). If it accepts, `TC-BT-200003` becomes `test.fixme` with a note (the department dup-code precedent).
- **DialogCrudHelper.errorMessage()** already covers `[aria-invalid]`/`p.text-destructive` (from the unit work) — discard/validation assertions work.

## Verification
- Frontend: `bunx tsc --noEmit`; e2e edit PATCH returns 200 + persists.
- e2e: `bun run test -- 029-business-type.spec.ts` all pass (dup-name fixme only if backend accepts); annotation completeness; `bun audit:tc-ids` 0 errors; `bun docs:user-stories` regenerated.
