# Design: Extra Cost — BLAVG precondition + complex coverage + doc_version fix

**Date:** 2026-06-16
**Spec file:** `tests/030-extra-cost.spec.ts`  (+ frontend `extra-cost-dialog.tsx`)
**Status:** Approved (BU precondition + 5 complex cases + frontend doc_version fix)

## Problem

`tests/030-extra-cost.spec.ts` covers only smoke + basic CRUD/validation (9 tests) and does **not** pin the active BU. The extra-cost CRUD API is BU-scoped, so tests should run with active BU = `BLAVG`. The extra-cost **edit is broken**: update is PATCH and `extra-cost-dialog.tsx` sends `{ id, ...payload }` **without `doc_version`** (the `ExtraCost` type lacks it), which the backend requires → `400 "doc_version: Required"` — the same defect already fixed for department/unit/business-type. So the existing edit test (`TC-EC-040001`) is latently failing.

extra-cost is a **structural clone of business-type**: dialog-based CRUD, fields are only `name` + `is_active` (no code/description/amount), no discard-on-dirty dialog (Cancel closes directly). This design mirrors the business-type one exactly.

## Relevant facts (verified)
- EC dialog (`routes/config/extra-cost/_components/extra-cost-dialog.tsx`): `#extra-cost-name` (required), `#extra-cost-is-active` (Radix switch). Update = PATCH via `createConfigCrud`; payload omits `doc_version`; `ExtraCost`/`CreateExtraCostDto` lack it. No `DiscardDialog`/`useDiscardConfirm`.
- e2e helpers on `main`: `ensureActiveBu`/`getBusinessUnits`/`defaultBu`, `BuSwitcherPage`, `DialogCrudHelper` (`openAddDialog/clickRow/deleteRow/nameInput/activeSwitch/isActive/setActive/saveButton/cancelButton/dialog/errorMessage/deleteConfirmButton/.list`), `BU_CODE="BLAVG"`.
- EC spec already renumbered: 01 (smoke), 03 (`030001` create), 04 (`040001` edit), 05 (`050001` delete), 20 (`200001/200002` validation), 10 (dialog security). New IDs reuse existing sections → **no catalog change**.
- **Lessons applied:** edit tests gate navigation on the **dialog closing** (not the `/updated|success|สำเร็จ/` toast, which matches the create toast and could race the PATCH); duplicate-name asserts the dialog stays open.

## Components / changes

### A. Frontend fix — `carmen-inventory-frontend-react` (mirror business-type)
- `types/extra-cost.ts`: add `doc_version: number` to `ExtraCost`; add `doc_version?: number` to `CreateExtraCostDto`.
- `extra-cost-dialog.tsx`: update mutation sends `{ id: extraCost.id, doc_version: extraCost.doc_version, ...payload }`. Create branch unchanged.
- Verify: PATCH 400→200, edit persists.

### B. e2e — `tests/030-extra-cost.spec.ts`
- Imports: `BU_CODE`, `ensureActiveBu/getBusinessUnits/defaultBu`, `BuSwitcherPage`.
- `test.beforeEach(ensureActiveBu(page, BU_CODE))` inside the describe.
- New tests (full 5-field annotations; self-contained `E2E EC0NN <UID>` names; cleanup-by-delete):
  - **`TC-EC-010005` active BU = BLAVG** (Smoke).
  - **`TC-EC-040002` toggle is_active → persist** (CRUD).
  - **`TC-EC-040003` edit name → persist** (CRUD; regression guard, dialog-close gated).
  - **`TC-EC-040004` edit-cancel → change not saved** (Functional) — replaces a discard test since the EC dialog has no discard prompt.
  - **`TC-EC-200003` duplicate name → reject** (Negative).
  - **`TC-EC-050002` delete-cancel → record survives** (Functional).

## Out of scope / unchanged
- Existing EC tests untouched except inheriting `beforeEach`. `auth.setup.ts`, scheme catalog (EC sections already cover 01/04/05/20) — no change.

## Risks
- **doc_version** blocks edits; the frontend fix is required for the edit/persist tests (and existing `TC-EC-040001`) to pass — verified only against the fixed frontend (deploy needed for UAT/CI).
- **Duplicate-name** assumes the backend rejects (business-type/unit/department services check `name` uniqueness). If it accepts, `TC-EC-200003` becomes `test.fixme` with a note.

## Verification
- Frontend: `bunx tsc --noEmit`; e2e edit PATCH 200 + persists.
- e2e: `bun run test -- 030-extra-cost.spec.ts` all pass; annotation completeness; `bun audit:tc-ids` 0 errors; `bun docs:user-stories` regenerated.
