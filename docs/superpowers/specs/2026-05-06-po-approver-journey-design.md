# PO Approver Journey — E2E Test Suite Design

**Date:** 2026-05-06
**Status:** Draft — pending user approval
**Scope:** Playwright persona-journey spec for the PO FC Approver workflow in `carmen-inventory-frontend`
**Source documents:** `docs/persona-doc/Purchase Order/Approver/` (INDEX.md + step-01..03.md)

---

## 1. Purpose

The PR persona suite is complete on `main` (302/303/304/311 = 104 TCs). The PO suite has its first member (402-po-purchaser-journey, 32 TCs) merged. This spec adds **`tests/403-po-approver-journey.spec.ts`** — the FC (Financial Controller) approver flow — closing the PO persona suite at 51 TCs total (32 + 19).

The FC approves POs that have been submitted by Purchaser (status IN PROGRESS). The Approval Actions screen is more granular than PR's bulk-toolbar pattern: items are marked individually (Approve / Review / Reject) which produces colored badges (green / amber / red), and the document-level footer button materializes per the item-state mix (all Approved → "Approve PO"; any Review → "Send Back"; selected items → "Reject").

The existing per-action `401-purchase-order.spec.ts` is **not modified**. The persona-journey spec runs alongside it.

## 2. Scope

**In scope** — FC persona only (`fc@blueledgers.com`):
- Step 1 — My Approval Dashboard (load, count, navigate)
- Step 2 — PO Detail FC view (read-only header, Edit + Comment buttons)
- Step 3 — Approval Actions (item-level marking, document-level Approve / Send Back / Reject)
- Golden Journey — full FC flow end-to-end
- 19 TCs total (3+3+12+1)

**Out of scope** (deferred or covered elsewhere):
- POST-approval downstream (SENT → PARTIAL → COMPLETED → CLOSED) — covered by 402 Step 5
- BRD discrepancy investigation (FC approval flow exists in UI; BRD says it shouldn't)
- Add Comment / Comment thread testing
- Bulk Select Items (§3.6a in INDEX) — defer
- Multi-cycle re-review scenarios — defer
- Cleanup of created POs — match convention

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture (`fcTest`) |
| `PurchaseOrderPage` | `tests/pages/purchase-order.page.ts` | Existing nav / list / detail / status primitives — extended with ~10 new methods |
| `submitPOAsPurchaser` | `tests/pages/po-approver.helpers.ts` | Cross-context Purchaser seed (existing from 402) |
| `gotoPODetail` | `tests/pages/po-approver.helpers.ts` | Detail navigation (existing) |
| `tc-csv-reporter` / `tc-json-reporter` | `tests/reporters/` | Auto-parse `TC-POA<NNNN>` IDs |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |
| `TEST_USERS` | `tests/test-users.ts` | Canonical: `fc@blueledgers.com` |

**Note on `approveAsFC`:** the helper already exists in `po-approver.helpers.ts` (added in 402's Task 4). It drives the FC approval flow internally. The 403 spec does **not** call this helper in TC bodies — that would test the helper, not the UI. Tests drive the UI step-by-step via page object methods.

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new persona-journey spec alongside 401 | Same precedent as 302/303/304/311/402 |
| 2 | FC only; no role contrast | FC is the only PO approver in the system (vs PR's HOD/FC/GM/Owner) |
| 3 | 1-step setup chain (`submitPOAsPurchaser`) | FC needs IN PROGRESS PO; one cross-context call seeds it. Cheaper than 304's 2-step PR chain |
| 4 | Granularity ~19 TCs (3+3+12+1) | Step 3 is the meaty section (item-level + document-level mechanic); Steps 1-2 are simpler view tests |
| 5 | Tests drive UI via page object methods, not via `approveAsFC` helper | The helper exists for setup chains in OTHER specs; using it in 403 TCs would skip the actual UI mechanic under test |
| 6 | Per-step `describe` blocks + serial Golden Journey | Mirrors 302/303/304/311/402 structure |
| 7 | TC prefix `TC-POA` | Distinct from `TC-POP` (402), `TC-PO` (401), `TC-PRA` (303); passes `[A-Z]{0,4}` reporter regex |
| 8 | New page-object methods scoped to FC mechanic (item toolbar / item badges / document footer buttons) | These differ from PR's bulk-toolbar pattern; deserve their own locators |
| 9 | No automatic cleanup | Match convention |

## 5. Architecture

### File layout
```
tests/
  403-po-approver-journey.spec.ts      ← new spec (~19 TCs)
  pages/
    purchase-order.page.ts             ← extend (+~10 methods)
docs/user-stories/
  403-po-approver-journey.md           ← auto-generated
tests/results/
  403-po-approver-journey-results.{csv,json}
```

**No new helper file** — `po-approver.helpers.ts` from 402 already provides `submitPOAsPurchaser` and `gotoPODetail`. `approveAsFC` exists as a setup helper but is not called from this spec's TCs.

### TC numbering
- Prefix `TC-POA` (PO Approver)
- Format `TC-POA<step><nn>` mirroring 302/303/304/311/402

| Step | Doc file | TC range | Count |
|---|---|---|---|
| 1 — My Approval | `step-01-my-approval.md` | `TC-POA0101..0103` | 3 |
| 2 — PO Detail (FC view) | `step-02-po-detail.md` | `TC-POA0201..0203` | 3 |
| 3 — Approval Actions | `step-03-approval-actions.md` | `TC-POA0301..0312` | 12 |
| Golden Journey | (cross-step) | `TC-POA0901` | 1 |
| **Total** | | | **19** |

### Auth fixture
```ts
import { createAuthTest } from "./fixtures/auth.fixture";

const fcTest = createAuthTest("fc@blueledgers.com");
```
Single role — no contrast TCs needed.

### Cross-persona setup chain
PRs ที่ FC act on must be IN PROGRESS:
```ts
const created = await submitPOAsPurchaser(browser);   // existing — Purchaser → submit
await gotoPODetail(page, created.ref);                // FC primary context navigates
```

### Page object additions in `purchase-order.page.ts`
Item-level + document-level approval mechanic (FC-specific):

| Method | Used by | Notes |
|---|---|---|
| `selectItemRow(index)` | Step 3 | Locator for the row checkbox at index |
| `async selectItemInEditMode(index)` | Step 3 | Click row checkbox; surfaces action toolbar |
| `itemActionToolbar()` | Step 3 | The Approve/Review/Reject toolbar that appears after item select |
| `markItemApproveButton()` | Step 3 | Item-level Approve in toolbar |
| `markItemReviewButton()` | Step 3 | Item-level Review |
| `markItemRejectButton()` | Step 3 | Item-level Reject |
| `itemBadge(index, status?)` | Step 3 | Per-item status badge (Approved / Review / Rejected) |
| `documentApproveButton()` | Step 3 | Footer "Approve PO" — visible when all items approved |
| `documentSendBackButton()` | Step 3 | Footer "Send Back" — visible when any item in review |
| `documentRejectButton()` | Step 3 | Footer "Reject" — visible with selected items |
| `commentButton()` | Step 2 | View/edit-mode Comment button |

**Existing methods reused:** `editModeButton`, `enterEditMode`, `cancelEditMode`, `saveButton`, `confirmDialogButton`, `reasonInput`, `statusBadge`, `expectSavedToast`, list/detail navigation, plus 402's additions.

## 6. Test catalog

Each entry maps to one `fcTest(...)` call.

### Step 1 — My Approval Dashboard (`describe("Step 1 — My Approval")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0101 | My Approval dashboard loads with Total Pending count visible | Smoke | High |
| TC-POA0102 | PO filter tab shows pending POs (DRAFT + IN PROGRESS) | Functional | High |
| TC-POA0103 | Click pending PO row navigates to PO detail | Smoke | High |

### Step 2 — PO Detail FC View (`describe("Step 2 — PO Detail")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0201 | PO Detail loads in IN PROGRESS view (FC perspective) | Smoke | High |
| TC-POA0202 | Header fields are read-only for FC (cannot edit vendor/date/etc.) | Authorization | High |
| TC-POA0203 | Edit button + Comment button visible | Functional | Medium |

### Step 3 — Approval Actions (`describe("Step 3 — Approval Actions")`)

**Item-level marking:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0301 | Edit mode → select item → Approve toolbar appears | Smoke | High |
| TC-POA0302 | Mark item Approved → green badge appears on item row | CRUD | High |
| TC-POA0303 | Mark item Review → amber badge + Send Back footer button appears | CRUD | High |
| TC-POA0304 | Mark item Reject → reject badge + footer Reject button appears | CRUD | Medium |

**Document Approve flow:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0305 | All items Approved → Document Approve button enabled in footer | Functional | High |
| TC-POA0306 | Click Approve PO → confirmation dialog ("Once approved, PO will be sent to vendor") | Smoke | High |
| TC-POA0307 | Confirm Approve → status moves to APPROVED/SENT | CRUD | High |

**Document Send Back flow:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0308 | Click Send Back → dialog with stage selector + per-item reason | Smoke | Medium |
| TC-POA0309 | Confirm Send Back → PO returned (status updates) | CRUD | Medium |

**Document Reject flow:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0310 | Click Reject → dialog with optional reason field | Smoke | Medium |
| TC-POA0311 | Confirm Reject → PO marked REJECTED | CRUD | Medium |

**Edit Mode Cancel:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0312 | Cancel edit mode (no item marked) → exits without saving | Functional | Low |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POA0901 | Full FC flow: My Approval → open PO → Edit → mark all items Approved → Document Approve → Sent | Smoke | High |

### Coverage summary
| Type | Count |
|---|---|
| Smoke | 8 |
| CRUD | 6 |
| Functional | 4 |
| Authorization | 1 |
| **Total** | **19** |

| Priority | Count |
|---|---|
| High | 11 |
| Medium | 7 |
| Low | 1 |

## 7. Annotation contract (per CLAUDE.md)

Every `fcTest(...)` ships the full 5-field annotation set. Audit script must pass with `pre=19 exp=19` for the new spec.

After writing the spec, run `bun docs:user-stories` to regenerate `docs/user-stories/403-po-approver-journey.md`.

## 8. Reporter and sync wiring

CSV / JSON reporters — no code change. CSV reporter regex `\b(TCS?-[A-Z]{0,4}\d{2,})\b` matches `TC-POA0101`.

Add to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ jsonFile: "403-po-approver-journey-results.json", sheetTab: "PO Approver" }
```

## 9. Hard-assertion discipline

Every TC carries either:
- At least one `expect(...)` without `.catch()`, OR
- An explicit `fcTest.skip(reason)` early-exit when prerequisite UI / data is missing.

Convention enforced from 302 onwards.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| FC item-level mechanic specific to PO; doesn't match PR's bulk pattern | New page object methods scoped to FC pattern; do not reuse PR `bulkApproveInEditMode` |
| Document footer button visibility depends on item-state mix (all Approved vs any Review) | Each TC seeds the specific mix; verify button visibility per state |
| Stage selector in Send Back dialog — UI shape unconfirmed | Use broad regex; dynamic skip if not present |
| `itemBadge` text varies (Approved/Review/Rejected) | Status param + regex alternatives `/approved|review|rejected/i` |
| `approveAsFC` helper exists and drives same flow — accidentally testing the helper | TCs use page object methods directly; the helper is for setup chains in OTHER specs |
| FC may not be allowed to Edit on DRAFT POs | `submitPOAsPurchaser` seeds IN PROGRESS; dynamic skip if FC's UI hides Edit |
| `documentApproveButton()` regex may collide with item-level Approve | Scope to footer / document section via DOM ancestry or `.last()` |
| Backend latency on status transitions | All status-change assertions use `{ timeout: 10_000 }` or longer |

## 11. Success criteria

- 19 TCs implemented; all carry the 5-field annotation set
- `bun run test -- 403-po-approver-journey.spec.ts` passes locally on first stable run (allowing dynamic skips)
- `docs/user-stories/403-po-approver-journey.md` regenerates without error
- CSV + JSON emitted to `tests/results/403-po-approver-journey-results.{csv,json}`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PO Approver` tab

## 12. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/403-po-approver-journey.spec.ts` | New | 19 TCs |
| `tests/pages/purchase-order.page.ts` | Modify | +~10 method declarations |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/403-po-approver-journey.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/403-po-approver-journey-results.{csv,json}` | Auto | Reporter output at runtime |

## 13. After this spec lands

PO persona suite reaches **51 TCs** (402: 32 + 403: 19), bringing total persona-journey coverage to **155 TCs** (PR 104 + PO 51) across 6 specs (302/303/304/311/402/403). The persona-journey style is now established as a parallel coverage layer alongside the per-action 301/401 specs.

Possible next directions (out of scope here):
- System Process tx-XX docs (proc-01..03 + tx-01..11) — would require backend integration test coverage, not E2E
- Other procurement modules (GRN, CRN, Store Requisition) — already have per-action specs (501, 601, 701) but no persona-journey suites yet
- Multi-cycle scenarios for any of the existing PR/PO flows
