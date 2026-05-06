# PR Purchaser Journey — E2E Test Suite Design

**Date:** 2026-05-06
**Status:** Draft — pending user approval
**Scope:** Playwright persona-journey spec for the PR Purchaser (Purchasing Staff / Buyer) workflow in `carmen-inventory-frontend`
**Source documents:** `docs/persona-doc/Purchase Request/Purchaser/` (INDEX.md + step-01..04.md)

---

## 1. Purpose

`carmen-inventory-frontend-e2e` ships:
- `tests/302-pr-creator-journey.spec.ts` (Creator persona, 41 TCs, merged 2026-05-05)
- `tests/303-pr-approver-journey.spec.ts` (Approver persona, 27 TCs, merged 2026-05-06)

This spec adds the next persona — **`tests/304-pr-purchaser-journey.spec.ts`** — covering the Purchaser's experience across 4 screens: PR List → PR Detail → Edit Mode (Vendor & Pricing allocation) → Workflow Actions (Approve / Reject / Send for Review routing the PR to the next stage).

The Purchaser persona uses the same screens as Approver but with **inverted permission semantics** in Edit Mode:

| Field | Approver (303) | Purchaser (this spec) |
|---|---|---|
| Approved Quantity | ✅ Editable | 👁️ Read-only (HOD already set it) |
| Item Note | ✅ Editable | 👁️ Read-only |
| Delivery Point | ✅ Editable | 👁️ Read-only |
| Vendor | 👁️ Read-only | ✅ Editable |
| Unit Price | 👁️ Read-only | ✅ Editable |
| Discount | 👁️ Read-only | ✅ Editable |
| Tax Profile | 👁️ Read-only | ✅ Editable |
| FOC Quantity | 👁️ Read-only | ✅ Editable |

The same bulk-toolbar actions (Approve / Reject / Send for Review / Split) are available in Edit Mode.

The existing per-action spec (`301-purchase-request.spec.ts`) is **not modified**.

## 2. Scope

**In scope** — Purchaser persona only (`purchase@blueledgers.com`):
- Step 1 — PR List (Purchaser View) — list, tabs, filters, search
- Step 2 — PR Detail (Read-only) — tabs, BRD discrepancy verification, Edit button visibility
- Step 3 — Edit Mode (Vendor & Pricing) — editable Vendor / Unit Price / Discount / Tax Profile, read-only Approved Qty, Auto Allocate, save / cancel
- Step 4 — Workflow Actions — bulk Approve (advance to FC) / Reject / Send for Review / Split, plus a read-only-at-non-Purchase-stage check
- Golden Journey — full Purchaser flow end-to-end
- ~25 TCs total

**Out of scope** (deferred to later specs):
- TC-PRP0405 may be skipped if seeding a PR at non-Purchase stage proves too complex. Cover it in `311-pr-returned-flow.spec.ts` if needed.
- FC approval downstream — separate `403-po-approver-journey.spec.ts` track
- Vendor master-data validation — tests assume DB has ≥1 vendor; dynamic skip otherwise
- PO Purchaser / Approver — separate, after PR persona suites complete
- Cleanup of created PRs — match Creator/Approver convention (no auto-cleanup)

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture (`purchaseTest`) |
| `PurchaseRequestPage` | `tests/pages/purchase-request.page.ts` | Existing nav / list / detail / bulk-toolbar primitives — extended with editable field locators |
| `submitPRAsRequestor` | `tests/pages/pr-approver.helpers.ts` | Cross-context: Requestor seed (existing) |
| `bulkApprove`, `bulkReject`, `bulkSendForReview` | `tests/pages/pr-approver.helpers.ts` | Bulk-action composers (existing — role-agnostic) |
| `gotoPRDetail` | `tests/pages/pr-approver.helpers.ts` | Detail navigation (existing) |
| `e2eDescription` | `tests/pages/pr-creator.helpers.ts` | `[E2E-PRC]` marker on seeded PRs (existing) |
| `tc-csv-reporter` / `tc-json-reporter` | `tests/reporters/` | Auto-parse `TC-PRP<NNNN>` IDs |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change — standard annotation pattern |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |
| `TEST_USERS` | `tests/test-users.ts` | Canonical: `purchase@blueledgers.com`, `hod@blueledgers.com`, `requestor@blueledgers.com` |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new persona-journey spec alongside 301; do not modify existing files | Same precedent as 302 / 303 |
| 2 | Cross-persona setup chain: `submitPRAsRequestor` → `approveAsHOD` (NEW) | Composable; reusable for `311-pr-returned-flow.spec.ts` later |
| 3 | Place `approveAsHOD` in `pr-approver.helpers.ts` (extend, not new file) | Logically an HOD-side action; lives next to other HOD helpers |
| 4 | Granularity ~25 TCs (golden + per-step); largest block is Step 3 (10 TCs) | Edit Mode is the persona's primary value — most coverage there |
| 5 | Reuse `bulkApprove` / `bulkReject` / `bulkSendForReview` directly | Bulk actions are role-agnostic; Approver and Purchaser share the toolbar |
| 6 | Per-step `describe` blocks + serial Golden Journey | Mirrors 302 / 303 structure |
| 7 | TC prefix `TC-PRP` | Distinct from `TC-PRA`, `TC-PRC`, `TC-PR`; passes `[A-Z]{0,4}` reporter regex |
| 8 | Add 6 new editable field locators in page object | Distinct from `*ReadOnlyCell` to communicate intent at call site, even when DOM target is the same |
| 9 | No automatic cleanup | Match 302 / 303 convention |

## 5. Architecture

### File layout
```
tests/
  304-pr-purchaser-journey.spec.ts       ← new spec (~25 TCs)
  pages/
    purchase-request.page.ts             ← extend (6 editable field locators + autoAllocateButton)
    pr-approver.helpers.ts               ← extend (+ approveAsHOD)
docs/user-stories/
  304-pr-purchaser-journey.md            ← auto-generated
tests/results/
  304-pr-purchaser-journey-results.{csv,json}  ← auto-emitted
```

**No new helpers file.** All cross-persona helpers Purchaser needs already live in `pr-approver.helpers.ts`; we just add `approveAsHOD` there.

### TC numbering
- Prefix `TC-PRP` (PR Purchaser)
- Format `TC-PRP<step><nn>`
- Step → ID range mapping:

All step files live under `docs/persona-doc/Purchase Request/Purchaser/`.

| Step | Doc file | TC range | Count |
|---|---|---|---|
| 1 — PR List (Purchaser View) | `step-01-pr-list.md` | `TC-PRP0101..0105` | 5 |
| 2 — PR Detail (Read-only) | `step-02-pr-detail.md` | `TC-PRP0201..0204` | 4 |
| 3 — Edit Mode (Vendor & Pricing) | `step-03-edit-mode.md` | `TC-PRP0301..0310` | 10 |
| 4 — Workflow Actions | `step-04-workflow-actions.md` | `TC-PRP0401..0405` | 5 |
| Golden Journey | (cross-step) | `TC-PRP0901` | 1 |
| **Total** | | | **25** |

### Auth fixture
```ts
import { createAuthTest } from "./fixtures/auth.fixture";

const purchaseTest = createAuthTest("purchase@blueledgers.com");
```
No role contrast — Purchaser has only one role variant in the system.

### Cross-persona setup chain
PRs at "Purchase stage" (passed HOD approval, awaiting Purchaser allocation) are required for nearly every TC. Setup is a 2-step chain:

```ts
// In purchaseTest body (typically beforeEach pattern, or inline):
const created = await submitPRAsRequestor(browser);   // Requestor → submits at HOD stage
await approveAsHOD(browser, created.ref);             // HOD → approves, advances to Purchase stage
// PR is now at Purchase stage
await gotoPRDetail(page, created.ref);                // Purchaser navigates and acts
```

Both helper calls open and close their own auxiliary `BrowserContext`. The primary `purchaseTest` context (logged in as `purchase@blueledgers.com`) is unaffected.

### New helper — `approveAsHOD(browser, ref)`
```ts
// Add to tests/pages/pr-approver.helpers.ts

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as HOD,
 * navigates to the PR detail at `ref`, enters Edit Mode, and bulk-approves
 * the PR — advancing it from HOD stage to Purchase stage. Closes the context
 * cleanly. Used by Purchaser tests to seed PRs at the Purchase stage.
 */
export async function approveAsHOD(browser: Browser, ref: string): Promise<void> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("hod@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await gotoPRDetail(page, ref);
    const pr = new PurchaseRequestPage(page);
    if ((await pr.editModeButton().count()) === 0) {
      throw new Error(`approveAsHOD: Edit button not found on PR ${ref} — HOD may not have edit permission`);
    }
    await pr.enterEditMode();
    await bulkApprove(page);
    await page.waitForLoadState("networkidle").catch(() => {});
  } finally {
    await ctx.close();
  }
}
```

### Page object additions in `purchase-request.page.ts`
Editable field locators (Purchaser side — distinct names from `*ReadOnlyCell` used by Approver tests):

| Method | Used by | Notes |
|---|---|---|
| `vendorInput(rowIndex)` | Step 3 | `getByLabel(/vendor/i)` scoped to `itemRow(rowIndex)` |
| `unitPriceInput(rowIndex)` | Step 3 | `getByLabel(/unit price/i)` |
| `discountInput(rowIndex)` | Step 3 | `getByLabel(/discount/i)` |
| `taxProfileSelect(rowIndex)` | Step 3 | `getByLabel(/tax/i)` |
| `autoAllocateButton()` | Step 3 — vendor scoring | `getByRole("button", { name: /auto allocate/i })` |
| `approvedQtyReadOnlyCell(rowIndex)` | Step 3 — verify Purchaser cannot edit (HOD already set) | Mirrors `vendorReadOnlyCell` shape from 303 |

Locator targets may overlap with the `*ReadOnlyCell` methods added in 303 (same DOM cell, different state). Tests assert `toBeEditable()` for the editable locators and `toBeDisabled()` for `approvedQtyReadOnlyCell`.

## 6. Test catalog

Each entry maps to one `purchaseTest(...)` call.

### Step 1 — PR List, Purchaser View (`describe("Step 1 — PR List")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRP0101 | List loads, My Pending tab default (PRs at Purchase stage) | Smoke | High |
| TC-PRP0102 | Switch to All Documents tab broadens scope | Functional | Medium |
| TC-PRP0103 | All Stage dropdown filter works | Functional | Medium |
| TC-PRP0104 | Filter panel opens + applies | Functional | Medium |
| TC-PRP0105 | Search by PR reference filters list | Functional | Low |

### Step 2 — PR Detail (Read-only) (`describe("Step 2 — PR Detail")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRP0201 | Detail loads with Items tab default | Smoke | High |
| TC-PRP0202 | Switch to Workflow History tab | Functional | Medium |
| TC-PRP0203 | No standalone Approve/Reject/Return buttons (BRD discrepancy) | Authorization | High |
| TC-PRP0204 | Edit button visible (entry to vendor/pricing edit) | Functional | High |

### Step 3 — Edit Mode (Vendor & Pricing) (`describe("Step 3 — Edit Mode")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRP0301 | Click Edit → vendor/pricing fields become editable | Smoke | High |
| TC-PRP0302 | Vendor field is editable (Purchaser scope — opposite of Approver) | CRUD | High |
| TC-PRP0303 | Unit Price field is editable | CRUD | High |
| TC-PRP0304 | Discount field is editable | CRUD | Medium |
| TC-PRP0305 | Tax Profile field is editable | CRUD | Medium |
| TC-PRP0306 | Approved Qty field stays read-only (HOD already set it) | Authorization | High |
| TC-PRP0307 | Auto Allocate button populates vendors via scoring | Functional | Medium |
| TC-PRP0308 | Multiple line items — pricing on each row independent | CRUD | Medium |
| TC-PRP0309 | Save edits → exit edit mode + persist values | CRUD | High |
| TC-PRP0310 | Cancel edits → discard changes, restore original | Functional | Medium |

### Step 4 — Workflow Actions (`describe("Step 4 — Workflow Actions")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRP0401 | Bulk Approve → PR advances to next stage (FC) | CRUD | High |
| TC-PRP0402 | Bulk Reject (with reason) | CRUD | High |
| TC-PRP0403 | Bulk Send for Review (return to HOD) | CRUD | High |
| TC-PRP0404 | Bulk Split — split selected items | Functional | Low |
| TC-PRP0405 | Cannot edit when PR is at non-Purchase stage (read-only) | Authorization | Medium |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRP0901 | Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage | Smoke | High |

### Coverage summary
| Type | Count |
|---|---|
| Smoke | 4 |
| CRUD | 9 |
| Functional | 8 |
| Authorization | 4 |
| **Total** | **25** |

| Priority | Count |
|---|---|
| High | 13 |
| Medium | 11 |
| Low | 1 |

## 7. Annotation contract (per CLAUDE.md)

Every `purchaseTest(...)` ships the full 5-field annotation set:

```ts
{
  annotation: [
    { type: "preconditions", description: "Logged in as Purchaser; PR exists at Purchase stage (seeded via submitPRAsRequestor + approveAsHOD)" },
    { type: "steps",         description: "1. ...\n2. ..." },
    { type: "expected",      description: "Concrete outcome (URL / status / disabled state / dialog)" },
    { type: "priority",      description: "High" },
    { type: "testType",      description: "Smoke" },
  ],
}
```

After writing the spec, run `bun docs:user-stories` to regenerate `docs/user-stories/304-pr-purchaser-journey.md`. Annotation audit must pass:

```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```

For 304 specifically, both counts equal 25.

## 8. Reporter and sync wiring

### CSV / JSON reporters
No code change — both parse `TC-PRP0101`-style IDs automatically via `\b(TCS?-[A-Z]{0,4}\d{2,})\b`.

### Google Sheets sync
Add to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ jsonFile: "304-pr-purchaser-journey-results.json", sheetTab: "PR Purchaser" }
```
Tab `PR Purchaser` must be created manually in the target spreadsheet before first sync.

## 9. Hard-assertion discipline

Every TC carries either:
- At least one `expect(...)` without `.catch()` (the assertion that fails the test loud), OR
- An explicit `purchaseTest.skip(reason)` early-exit when the prerequisite UI / data is missing.

Silent guards that always pass regardless of state are not acceptable — convention enforced from 302.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| `approveAsHOD` adds ~10s per test (2nd login) on top of `submitPRAsRequestor` ~10s — total ~20s/test | Acceptable for ~15 dependent TCs (Steps 3-4 + Golden); ~5 min total impact on full suite |
| Auto Allocate (TC-PRP0307) may depend on vendor master-data scoring | Dynamic skip if `autoAllocateButton` not present; assert URL stays on edit page after click |
| TC-PRP0405 (read-only at non-Purchase stage) needs PR at FC-or-later stage | Dynamic skip if seeding chain is too complex; defer to `311` if needed |
| Vendor combobox / Tax Profile dropdown may render differently per Radix variant | Locators use `getByLabel` with broad regex; use `.first()` defensively |
| Saved values for vendor/price may not persist visibly in DOM after exit (toast-only) | Assert `toHaveURL(detail)` and `editModeButton` reappears after save; specific value re-read deferred to per-action 301 spec |
| Bulk Approve (TC-PRP0401) advances PR to FC stage; subsequent TCs may inherit changed state | Each TC seeds its own PR via `submitPRAsRequestor + approveAsHOD` — state isolation guaranteed |
| `editModeButton()` regex `/^edit$|edit pr|edit mode/i` may not match Purchaser-specific labels | Reuse from 303 unless Purchaser UI introduces a different label; re-evaluate at impl time |

## 11. Success criteria

- 25 TCs implemented; all carry the 5-field annotation set
- `bun run test -- 304-pr-purchaser-journey.spec.ts` passes locally on first stable run (allowing dynamic skips for absent UI affordances)
- `docs/user-stories/304-pr-purchaser-journey.md` regenerates without error
- CSV + JSON emitted to `tests/results/304-pr-purchaser-journey-results.{csv,json}`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PR Purchaser` tab

## 12. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/304-pr-purchaser-journey.spec.ts` | New | ~25 TCs |
| `tests/pages/purchase-request.page.ts` | Modify | +6 method declarations (5 editable + 1 read-only) |
| `tests/pages/pr-approver.helpers.ts` | Modify | + `approveAsHOD` |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/304-pr-purchaser-journey.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/304-pr-purchaser-journey-results.{csv,json}` | Auto | Reporter output at runtime |

## 13. Follow-up specs (out of scope here)

| # | Spec | Triggered by |
|---|---|---|
| 1 | `311-pr-returned-flow.spec.ts` | After this spec lands; reuses `submitPRAsRequestor`, `approveAsHOD` (this spec adds), `bulkSendForReview` |
| 2 | `402-po-purchaser-journey.spec.ts` | After PR persona suites complete |
| 3 | `403-po-approver-journey.spec.ts` | After 402 |
