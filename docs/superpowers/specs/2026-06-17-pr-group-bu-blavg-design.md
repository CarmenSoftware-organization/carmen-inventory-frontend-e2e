# Design: PR group BU=BLAVG rollout (transaction-module)

**Date:** 2026-06-17
**Status:** Approved

## Goal

Apply the **transaction-module rollout standard** (see
[[project_transaction_module_rollout]]) to the PR module group: BU=BLAVG
precondition + one BU-assert smoke per spec, using each spec's **primary
workflow-actor role**, no complex CRUD cases. Existing tests stay intact.

PR list path: `/procurement/purchase-request`; template:
`/procurement/purchase-request-template`.

## Specs, roles, BU-assert placement

| Spec | Actor role | Shape | BU-assert |
|---|---|---|---|
| `302-pr-creator-journey` | requestor | serial journey (Steps 1–7) | `TC-PR-0500XX` |
| `303-pr-approver-journey` | hod | serial journey | `TC-PR-0600XX` |
| `304-pr-purchaser-journey` | purchase | serial journey | `TC-PR-0700XX` |
| `311-pr-returned-flow` | requestor | serial journey (7a–7d) | `TC-PR-0800XX` |
| `301-pr` | requestor (creator) | 5-role, 48 describes | `TC-PR-010050` |
| `310-pr-template` | purchase | 27 describes | `TC-PRT-010050` |

All of 301/302/303/304/311 share the `TC-PR` prefix (sections differentiate);
310 uses `TC-PRT`. Exact BU-assert seqs are chosen at implement-time to avoid
collisions; the sections are already registered in `docs/test-id-scheme.md`
(`PR` 01–09…, `PRT` 01–11…).

## Cadence — 2 PRs

- **PR-A — journeys** (`302`, `303`, `304`, `311`): single-role **serial** specs.
  Add `<role>Test.beforeEach(({ page }) => ensureActiveBu(page, BU_CODE))`
  (scoped to the journey, which is the whole single-role spec) + a BU-assert as
  the first test of the opening step. Clean, low-risk.
- **PR-B — `301` + `310`** (multi-role): add the BU-assert under the primary
  actor and scope `ensureActiveBu` to **that one describe only** — do NOT pin BU
  across the other roles' authz describes (the my-approvals pilot showed a global
  BU pin can change cross-describe data and surface unrelated failures).

## BU-assert shape (per spec)

Mirror `tests/150-vendor.spec.ts` TC-VEN-010050:
```ts
const units = await getBusinessUnits(page);
const active = defaultBu(units);
expect(active?.code).toBe(BU_CODE);
const switcher = new BuSwitcherPage(page);
await expect(switcher.trigger()).toContainText(active!.name, { timeout: 15_000 });
```
`testType: Smoke`, full 5-field annotation.

## Verification (per PR)

1. New BU-asserts green; existing suites unaffected (run touched specs).
2. Pre-existing failures verified via stash (PR detail flows may be stale — same
   theme as [[project_vendor_prodcat_page_objects_stale]]); document, don't fix
   here.
3. `bun audit:tc-ids`, annotation-completeness, `bun docs:user-stories` regen.

## Risks / notes

- The journey specs are serial — a BU-assert added as the first step must not
  break the chain (it only reads profile + asserts; no state change beyond the
  BU switch the precondition already makes).
- `ensureActiveBu` uses the workflow role; assumes each role (requestor/hod/
  purchase) has BLAVG access (all blueledgers users) — verify on first run.
- Watch for stale PR/PR-template page objects in the journey detail steps; if a
  BU-assert's `getBusinessUnits` navigation conflicts, it still works (it drives
  its own dashboard nav).
