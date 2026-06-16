# Design: admin@BLAVG rollout for the procurement master-data trio

**Date:** 2026-06-17
**Status:** Approved (pending spec review)

## Goal

Bring the three procurement / vendor-management master-data specs up to the
**admin@BLAVG** standard already applied to `vendor` and `product-category`
(PR4 of the prior config-modules rollout):

1. A new test block authenticated as `admin@blueledgers.com` (via `createAuthTest`).
2. Active business unit pinned to **BLAVG** (`ensureActiveBu(page, BU_CODE)` in
   the block's `beforeEach`, plus a BU-assert test).
3. Module-appropriate complex cases beyond the existing best-effort coverage.

The three modules:

- `160-pl-template.spec.ts` — Pricelist Template (prefix **PT**)
- `159-pl.spec.ts` — Price List (prefix **PL**)
- `1001-campaign.spec.ts` — Campaign / Request-for-Pricing (prefix **CAM**)

All three already carry substantial multi-role coverage
(`purchase@blueledgers.com` for happy paths, `requestor@blueledgers.com` for
permission-denial). Those suites are **authorization coverage** and stay
untouched. This rollout is **append-only**.

## Pattern (mirrors `tests/150-vendor.spec.ts:752-900`)

Keep every existing `describe` as-is. Append a new block:

```ts
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

const adminTest = createAuthTest("admin@blueledgers.com");
adminTest.describe.serial("<Module> — admin@BLAVG CRUD", () => {
  adminTest.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  adminTest("TC-XX-010050 active BU = BLAVG", { annotation: [...] }, async ({ page }) => {
    const units = await getBusinessUnits(page);
    const active = defaultBu(units);
    expect(active?.code).toBe("BLAVG");
    // BuSwitcherPage trigger shows that BU's label
  });
  // ...module-specific cases below
});
```

- New TC IDs use the `…0050+` sequence suffix within **existing** section blocks
  (section `01` for the BU-assert, `04` for edit, `20` for validation, `05` for
  delete) — exactly as vendor did (`TC-VEN-010050`, `040050`, `200050`,
  `050050`). No new prefix or section block is introduced.
- Before each PR, verify `docs/test-id-scheme.md` already registers the prefix
  (PT / PL / CAM) and the section blocks used; `bun audit:tc-ids` gates this.

## Scope: 3 sequential PRs (PT → PL → CAM)

Sequential cadence — land each PR before starting the next.

### PR-A — `160-pl-template` (PT), branch `test/pl-template-bu-and-complex`

PT has a clean create form (`name` + `description`), so it gets a **full serial
create→edit→delete chain**:

- `TC-PT-010050` — BU-assert (default BU `code === "BLAVG"`; switcher label).
- `TC-PT-010051` — create template (name + description) → success toast. *(serial seed; uses a `Date.now()`-based unique name)*
- `TC-PT-040050` — edit name → reopen from list → new name persists, old gone.
- `TC-PT-040051` — edit name then **Cancel** → reopen → original name unchanged.
- `TC-PT-200050` — create duplicate name → backend rejects (form stays / error).
  If the backend does not enforce name uniqueness, mark this `fixme` with a note
  (same policy as currency dup-name in the prior rollout) rather than forcing it.
- `TC-PT-050050` — open delete dialog → **Cancel** → record still present.
- `TC-PT-050051` — delete cleanup (removes the record created in `010051`).

Notes:
- **No `is_active`-toggle-persist case.** PT exposes activate/deactivate as
  separate actions (already covered by `TC-PT-050001`/`050004`), not a switch in
  the create dialog — so the `…040002` toggle-persist case is omitted, the same
  way `cn-reason` omitted it.
- Serial chain wrapped in `describe.serial` so a worker restart re-derives the
  same module-level `Date.now()` UID consistently (see the serial-CRUD note in
  CLAUDE.md / prior rollout).
- **Frontend `doc_version` fix as discovered:** if `TC-PT-040050` surfaces the
  missing-`doc_version` PATCH 400, fix the relevant dialog/type in the sibling
  repo `../carmen-inventory-frontend-react`, same as the config modules. This is
  conditional — only if the bug actually appears for PT.

### PR-B — `159-pl` (PL), branch `test/pl-bu-and-complex`

PL create is a heavy document (number + vendor + currency + valid-from + line
items with product/unit/price, dependent on seeded vendors and products). A full
admin create chain would be brittle, so PL gets **BU-precondition + BU-assert +
a couple of hardened read/list cases** (analogous to exchange-rate being
"list-only" in the prior rollout):

- `TC-PL-010050` — BU-assert.
- `TC-PL-010051` — list loads under admin/BLAVG with the **Add New** button
  visible (hard assert, not best-effort `.catch`).
- `TC-PL-010052` — search a non-existent keyword → empty-state visible
  (hard assert).

No create / edit / delete chain for PL.

### PR-C — `1001-campaign` (CAM), branch `test/campaign-bu-and-complex`

CAM create is a multi-step wizard (name/desc/priority/date → template → vendors →
launch) — even more brittle to drive end-to-end. CAM gets **BU-precondition +
BU-assert + a couple of hardened list/filter cases**:

- `TC-CAM-010050` — BU-assert.
- `TC-CAM-010051` — status filter applies under admin/BLAVG (hard assert the
  filter control is present and a selection sticks, where exposed; otherwise
  skip with a reason — no silent pass).
- `TC-CAM-010052` — search non-matching term → empty-state visible (hard assert).

No wizard create chain for CAM.

## Components touched

- **e2e repo** (this repo): the three specs above (append-only blocks); possibly
  small additions to the existing page objects
  (`tests/pages/{price-list,price-list-template,campaign}.page.ts`) if a hard
  assert needs a locator the page object doesn't yet expose; regenerated
  `docs/user-stories/{159-pl,160-pl-template,1001-campaign}.md` per PR.
- **frontend repo** (`../carmen-inventory-frontend-react`): per-module
  `doc_version` PATCH fix **only if** PT's edit-persist case surfaces it
  (PR-A only, conditional).

## Testing & verification (per PR)

1. Run the touched spec green against the dev backend.
2. Annotation-completeness audit (preconditions count == expected count per spec):
   ```bash
   for f in tests/*.spec.ts; do
     pre=$(grep -c 'type: "preconditions"' "$f")
     exp=$(grep -c 'type: "expected"' "$f")
     [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
   done
   ```
3. `bun audit:tc-ids` passes.
4. `bun docs:user-stories` regenerated and committed alongside the spec edit.
5. Security review of any new page-object navigation/locator code.

## Risks / notes

- BU switch is account-global and persists server-side under `workers: 1` — fine
  because the whole run targets BLAVG.
- Duplicate-name reject (`TC-PT-200050`) depends on backend uniqueness
  enforcement; if absent, `fixme` with a note rather than forcing it.
- PL / CAM coverage is intentionally lighter (heavy document / wizard create) —
  documented here, not silently dropped. The existing best-effort happy-path
  coverage for create flows under `purchase@blueledgers.com` stays in place.
- These are vendor-management modules, not config modules, so the
  `doc_version` PATCH bug may or may not apply — the frontend fix is conditional
  on the test actually surfacing a 400.
