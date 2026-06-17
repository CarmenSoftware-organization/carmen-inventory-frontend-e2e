# Design: my-approvals BU=BLAVG rollout (transaction-module pilot)

**Date:** 2026-06-17
**Status:** Approved

## Goal

Extend the BU=BLAVG standard to the transaction/workflow modules, starting with
**`201-my-approvals`** as the pilot. This establishes the lighter
**transaction-module rollout standard** that the PR / PO / GRN / CN / SR /
stock-issue / period-end rollouts will reuse.

## The transaction-module standard (new — differs from the config standard)

Config/master-data modules got: `admin@blueledgers.com` + `ensureActiveBu(BLAVG)`
+ BU-assert + complex CRUD cases. Transaction/workflow modules are **not CRUD**,
so the standard is lighter:

1. **BU=BLAVG precondition** — `ensureActiveBu(page, BU_CODE)` in a `beforeEach`,
   pinning the session's active BU so the workflow view is deterministic.
2. **One BU-assert smoke** (`TC-XX-0100<n>`) — `defaultBu().code === "BLAVG"` and
   the navbar BU-switcher shows that BU's label.
3. **Role = the module's primary workflow actor**, *not* `admin@blueledgers.com`.
   For my-approvals that's `hod@blueledgers.com` (the approver); admin isn't an
   approver, so a BU-assert under admin would be meaningless here.
4. **No complex CRUD cases.** Existing tests stay intact.

## my-approvals (`/procurement/approval`)

Approver inbox. Current auth: `hodTest = hod@blueledgers.com` for the queue +
actions; `requestorTest = requestor@blueledgers.com` for permission-denial.
Several describes are "Feature pending" (unimplemented in the app).

## Changes (`tests/201-my-approvals.spec.ts`)

- Add BU helper imports: `BU_CODE` (from `./test-users`), `ensureActiveBu`,
  `getBusinessUnits`, `defaultBu` (from `./helpers/bu`), `BuSwitcherPage`
  (from `./pages/bu-switcher.page`).
- Add a module-level `hodTest.beforeEach(({ page }) => ensureActiveBu(page, BU_CODE))`
  so every hod (approver) test runs with the active BU pinned to BLAVG. The
  `requestorTest` permission-denial tests are left as-is (no BU pin).
- Add `TC-MA-010050` BU-assert in the Queue describe (mirrors
  `tests/150-vendor.spec.ts` TC-VEN-010050): read `getBusinessUnits`, assert
  `defaultBu()?.code === BU_CODE`, and assert the `BuSwitcherPage` trigger shows
  the BU name. Full 5-field annotation; `testType: Smoke`.

Section block `01` is already registered for prefix `MA` (no scheme change).

## Verification

1. `TC-MA-010050` green; existing suite unaffected (run the spec).
2. Annotation-completeness audit (preconditions == expected per spec).
3. `bun audit:tc-ids` passes.
4. `bun docs:user-stories` regenerated for `201-my-approvals.md`.

## Risks / notes

- `ensureActiveBu(BLAVG)` switches hod's active BU server-side (account-global,
  `workers: 1`) — fine because the whole run targets BLAVG. Assumes hod has
  access to BLAVG (a blueledgers BU) — verify on first run.
- "Feature pending" describes are unchanged; the beforeEach applies harmlessly.
- Subsequent rollouts replicate this exact pattern per transaction module, using
  each module's primary workflow role (e.g. PR creator/approver/purchaser).
