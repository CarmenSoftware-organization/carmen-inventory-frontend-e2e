# Design: BU=BLAVG precondition + complex test cases across config modules

**Date:** 2026-06-16
**Status:** Approved (pending spec review)

## Goal

Bring every remaining config/master-data module up to the standard already
applied to **department / unit / business-type / extra-cost**:

1. Login predefined as `admin@blueledgers.com` (via `createAuthTest`).
2. Active business unit pinned to **BLAVG** (`ensureActiveBu(page, BU_CODE)` in
   `beforeEach`, plus a BU-assert test).
3. Additional **complex** test cases beyond basic smoke/CRUD.

When the new edit-persist cases surface the known missing-`doc_version` PATCH
bug in a module's React frontend, fix the frontend (sibling repo
`../carmen-inventory-frontend-react`) as discovered — same fix already applied
to dept/unit/BT/extra-cost.

## Established template (the "module standard")

Mirrors `tests/030-extra-cost.spec.ts`. Each module gains:

- `const test = createAuthTest("admin@blueledgers.com")`
- `test.beforeEach(({ page }) => ensureActiveBu(page, BU_CODE))`
- **BU-assert** test in section block `01` (e.g. `TC-XX-010005`):
  default BU `code === "BLAVG"` (via `getBusinessUnits`/`defaultBu`) and the
  `BuSwitcherPage` trigger shows that BU's name.
- **5 complex cases** (TC IDs follow `docs/test-id-scheme.md` section blocks):
  - `…040002` — toggle `is_active` off on create → reopen → switch persists `false`
  - `…040003` — edit name → reopen from list → new name persists, old name gone
  - `…040004` — edit name then **Cancel** → reopen → original name unchanged
  - `…200003` — create duplicate name → backend rejects (dialog stays open)
  - `…050002` — open delete dialog → **Cancel** → record still present
  - (each complex case self-cleans up the records it creates)
- Full 5-field annotation set on every `test(...)` (`preconditions`, `steps`,
  `expected`, `priority`, `testType`).

After edits, per CLAUDE.md: regenerate user-story docs (`bun docs:user-stories`),
pass the annotation-completeness audit, and pass `bun audit:tc-ids`.

## Scope: 5 sequential batch PRs

Sequential cadence — land each PR before starting the next. Frontend
`doc_version` fixes ship in the sibling repo alongside the batch that surfaces
them.

### PR1 — Dialog config modules (`DialogCrudHelper`)
Mirror extra-cost 1:1.
- `032-credit-term` (CT) — full set incl. toggle-persist
- `040-currency` (CUR) — full set incl. toggle-persist
- `042-tax-profile` (TP) — full set incl. toggle-persist
- `602-cn-reason` (CNR) — **no `is_active` switch** → omit `040002`; add BU
  assert + the other 4 complex cases

### PR2 — Page-form config modules (`PageFormCrudHelper`) + list-only
- `031-adjustment-type` (AT) — BU assert + complex cases adapted to page-form
  (code+name); verify `PageFormCrudHelper` exposes edit-cancel/persist support,
  extend if needed
- `080-location` (LOC) — same
- `041-exchange-rate` (ER) — **list-only** (rates derived): add `ensureActiveBu`
  + `TC-ER-010005` BU-assert only. No CRUD-complex cases.

### PR3 — New specs: certification + eco
Both `/config/certification` and `/config/eco` use `ConfigListTemplate` + a
dialog with `code` / `name` / `description` / `is_active`.
- **Dedicated page objects** `certification.page.ts` + `eco.page.ts` (NOT a
  shared-helper extension), following the `delivery-point.page.ts` style.
- New specs `043-certification.spec.ts` (prefix **CERT**) +
  `044-eco.spec.ts` (prefix **ECO**) — full template: smoke + BU assert + CRUD
  + 5 complex cases + security cases.
- Register both prefixes and section blocks in `docs/test-id-scheme.md` before
  the spec PR (CI gate enforces registration).
- Element IDs confirmed in the frontend:
  - certification: `#certification-code`, `#certification-name`,
    `#certification-description`, `#certification-is-active`
  - eco: `#eco-label-code`, `#eco-label-name`, `#eco-label-description`,
    `#eco-label-is-active`

### PR4 — Dedicated-page modules (keep authz, ADD admin+BLAVG block)
Existing multi-role authorization suites stay intact (their own roles). Add a
**new** `adminTest = createAuthTest("admin@blueledgers.com")` describe block.
- `150-vendor` (VEN) — new admin block: `ensureActiveBu` + BU assert + complex
  CRUD via `VendorPage` (create requires code/name/businessType)
- `101-product-category` (CAT) — new admin block: BU assert + create/edit/delete
  + cancel cases on the category tree (existing permission-denial tests untouched)

### PR5 — delivery-point
- `079-delivery-point` (DP) — already 49 tests, admin auth. Add `ensureActiveBu`
  `beforeEach` + `TC-DP-010005` BU-assert. Add only complex cases not already
  covered by the existing 49.

> **Already done (skip, quick-verify only):** `010-department`, `020-unit`,
> `029-business-type`, `030-extra-cost`.

## Components touched

- **e2e repo** (this repo): specs above, possible `PageFormCrudHelper` extension
  (PR2), new `certification.page.ts`/`eco.page.ts` (PR3), `docs/test-id-scheme.md`
  (PR3), regenerated `docs/user-stories/*.md` (every PR).
- **frontend repo** (`../carmen-inventory-frontend-react`): per-module
  `doc_version` PATCH fix in the relevant dialog/type, only when a test exposes it.

## Testing & verification (per PR)

1. Run the touched spec(s) green against the dev backend.
2. Annotation-completeness audit (preconditions count == expected count per spec).
3. `bun audit:tc-ids` passes.
4. `bun docs:user-stories` regenerated and committed.
5. Security review of any new page-object navigation/locator code.

## Risks / notes

- BU switch is account-global and persists server-side under `workers: 1`
  (see `ensureActiveBu` note) — fine because the whole run targets BLAVG.
- Serial CRUD chains must stay inside `test.describe.serial` where create→edit→
  delete depend on shared `Date.now()` UID (worker restart recomputes the UID).
- Duplicate-name reject (`200003`) depends on backend uniqueness enforcement;
  some modules historically accepted dup codes/names — if a module lacks the
  check, mark the assertion `fixme` with a note rather than forcing it.
- exchange-rate / product-category complex coverage is intentionally lighter
  (derived data / tree structure) — documented above, not silently dropped.
