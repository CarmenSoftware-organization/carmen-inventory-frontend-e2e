# PR Approver Journey — E2E Test Suite Design

**Date:** 2026-05-06
**Status:** Draft — pending user approval
**Scope:** Playwright persona-journey spec for the PR Approver (HOD / FC / GM / Owner) workflow in `carmen-inventory-frontend`
**Source documents:** `docs/persona-doc/Purchase Request/Approver/` (INDEX.md + step-01..04.md)

---

## 1. Purpose

`carmen-inventory-frontend-e2e` ships `tests/302-pr-creator-journey.spec.ts` (Creator persona, 41 TCs, merged 2026-05-05). This spec adds the next persona-journey suite — **`tests/303-pr-approver-journey.spec.ts`** — covering the Approver's experience across 4 screens: My Approval Dashboard → PR List → PR Detail → Edit Mode (with bulk Approve / Reject / Send for Review actions).

The Approver persona is reachable by 4 user roles — HOD, FC, GM, Owner — sharing identical screens but differing in scope (HOD limited to own department; FC/GM/Owner see all departments). Per the brainstorm decision, this spec uses HOD as primary and adds a single dedicated TC to verify the FC/GM/Owner scope contrast.

The existing per-action spec (`301-purchase-request.spec.ts`) is **not modified**.

## 2. Scope

**In scope** — HOD persona primary (`hod@blueledgers.com`):
- Step 1 — My Approval Dashboard (load, navigation, count, filter tabs)
- Step 2 — PR List, Approver view (My Pending tab, All Documents tab, stage filter, filter panel, search)
- Step 3 — PR Detail (read-only, button visibility per BRD discrepancy)
- Step 4 — Edit Mode + Bulk Actions (editable fields, read-only fields, bulk Approve / Reject / Send for Review / Split)
- Scope Contrast TC — FC sees PRs from multiple departments
- Golden Journey — full HOD flow end-to-end
- ~27 TCs total

**Out of scope** (deferred to later specs):
- GM / Owner role specifics — Approver INDEX states "identical to FC"; verified only via the FC contrast TC. Add explicit TCs only if a divergence is discovered later.
- Step 7 Returned PR (Creator side) — covered in `311-pr-returned-flow.spec.ts` (cross-persona). The Approver-side trigger (Send for Review) IS in this spec.
- Purchaser persona journeys — `304-pr-purchaser-journey.spec.ts` (separate)
- PO Approver / Purchaser — separate, after PR persona suites land
- System Process docs — backend-level, integration tests not E2E
- Cleanup of created PRs — match Creator convention

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture for HOD primary, FC for scope-contrast TC |
| `PurchaseRequestPage` | `tests/pages/purchase-request.page.ts` | Existing nav / list / detail primitives — extended with bulk-action helpers |
| `MyApprovalsPage` | `tests/pages/my-approvals.page.ts` | Existing — reused for Step 1; audit current method coverage during impl |
| `e2eDescription` | `tests/pages/pr-creator.helpers.ts` | Re-used for `[E2E-PRC]` prefix on PRs seeded by the Requestor sub-context |
| `tc-csv-reporter` / `tc-json-reporter` | `tests/reporters/` | Auto-parses `TC-PRA<NNNN>` IDs |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change — standard annotation pattern |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |
| `TEST_USERS` | `tests/test-users.ts` | Canonical accounts: `hod@blueledgers.com`, `fc@blueledgers.com`, `requestor@blueledgers.com` |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new persona-journey spec alongside 301; do not modify existing files | Same precedent as PR Creator (302) |
| 2 | HOD as primary persona (not all 4 Approver roles) | Approver roles share identical screens; running the full flow 4× would 4× the runtime without proportional value |
| 3 | One dedicated FC scope-contrast TC | Verifies the only behavioural difference (scope visibility); GM / Owner trusted to match per docs |
| 4 | Granularity ~27 TCs (golden + per-step + scope contrast) | Balanced, smaller than Creator (41) because Approver has fewer screens (4 vs 8) |
| 5 | Cross-context Requestor setup via `submitPRAsRequestor(browser)` helper | Standard Playwright multi-user pattern; avoids polluting primary HOD auth; reusable for Purchaser / Returned-flow specs later |
| 6 | Per-step `describe` blocks (Approach 1) + standalone Scope Contrast + serial Golden Journey | Mirrors Creator structure; trace TC ID → source step doc 1:1 |
| 7 | TC prefix `TC-PRA` | Distinct from `TC-PRC` (Creator) and `TC-PR` (301); passes the `[A-Z]{0,4}` reporter regex |
| 8 | No automatic cleanup | Match Creator convention; PRs seeded by Requestor sub-context carry `[E2E-PRC]` prefix for manual filtering later |
| 9 | Bulk actions exercised via the toolbar that appears after Select All in Edit Mode (per BRD discrepancy) | Live UI ships only the bulk toolbar; no standalone per-row Approve/Reject buttons |

## 5. Architecture

### File layout
```
tests/
  303-pr-approver-journey.spec.ts        ← new spec (~27 TCs)
  pages/
    purchase-request.page.ts             ← extend in place (bulk-action helpers + edit-mode field locators)
    pr-approver.helpers.ts               ← new (cross-context Requestor seed + bulk-action composition)
    my-approvals.page.ts                 ← reuse; audit before assuming completeness
docs/user-stories/
  303-pr-approver-journey.md             ← auto-generated by `bun docs:user-stories`
tests/results/
  303-pr-approver-journey-results.{csv,json}  ← auto-emitted by reporters
```

### TC numbering
- Prefix `TC-PRA` (PR Approver)
- Format `TC-PRA<step><nn>` mirroring Creator
- Step → ID range mapping:

All step files live under `docs/persona-doc/Purchase Request/Approver/`.

| Step | Doc file | TC range | Count |
|---|---|---|---|
| 1 — My Approval Dashboard | `step-01-my-approval.md` | `TC-PRA0101..0104` | 4 |
| 2 — PR List (Approver view) | `step-02-pr-list.md` | `TC-PRA0201..0205` | 5 |
| 3 — PR Detail (read-only) | `step-03-pr-detail.md` | `TC-PRA0301..0304` | 4 |
| 4 — Edit Mode + Bulk Actions | `step-04-edit-mode.md` | `TC-PRA0401..0412` | 12 |
| Scope Contrast (FC) | (cross-step) | `TC-PRA0501` | 1 |
| Golden Journey | (cross-step) | `TC-PRA0901` | 1 |
| **Total** | | | **27** |

### Auth fixtures
```ts
import { createAuthTest } from "./fixtures/auth.fixture";

// Primary persona for Steps 1-4 + Golden Journey
const hodTest = createAuthTest("hod@blueledgers.com");

// Used only by the Scope Contrast TC (TC-PRA0501)
const fcTest = createAuthTest("fc@blueledgers.com");
```

### Cross-persona setup (key new pattern)
PRs in `In Progress` (HOD-pending) state are required for nearly every TC. They are created on demand via a 2nd browser context that authenticates as the Requestor.

```ts
// tests/pages/pr-approver.helpers.ts
export async function submitPRAsRequestor(
  browser: Browser,
  opts?: { items?: number; description?: string },
): Promise<CreatedPR>
```

Implementation outline:
1. `await browser.newContext()` — fresh, isolated context
2. Login as `requestor@blueledgers.com` via `LoginPage.loginWithRetry`
3. Reuse `createDraftPR` + an inline submit step (or compose from Creator helpers)
4. Capture PR ref + url
5. `await context.close()` — cleanup the auxiliary context
6. Return `{ ref, url }` to the calling test

Used in `beforeEach` of Steps 3, 4, Scope Contrast, and Golden Journey. Step 1 (Dashboard) and Step 2 (List) trust whatever pending PRs already exist in the DB and `requestorTest.skip()` dynamically when none are present.

### Page object strategy
**Extend `tests/pages/purchase-request.page.ts` in place** with bulk-action helpers. The Approver journey shares screens with Creator/Purchaser; a separate page object would duplicate locators.

Methods to add (audit existing methods in `purchase-request.page.ts` first):
- `selectAllRowsInEditMode()` — clicks the master checkbox or "Select All" trigger that surfaces the bulk-action toolbar
- `bulkActionToolbar()` — locator for the toolbar
- `bulkApproveButton()`, `bulkRejectButton()`, `bulkSendForReviewButton()`, `bulkSplitButton()` — toolbar-scoped buttons
- `approvedQtyInput(rowIndex)`, `itemNoteInput(rowIndex)`, `deliveryPointInput(rowIndex)` — Edit-mode editable fields
- `vendorReadOnlyCell(rowIndex)`, `unitPriceReadOnlyCell(rowIndex)`, `discountReadOnlyCell(rowIndex)`, `taxReadOnlyCell(rowIndex)`, `focQtyReadOnlyCell(rowIndex)` — for read-only verification (assert disabled state or absence of input)

### New helpers in `pr-approver.helpers.ts`
```ts
export interface CreatedPR { ref: string; url: string; }

export async function submitPRAsRequestor(
  browser: Browser,
  opts?: { items?: number; description?: string },
): Promise<CreatedPR>;

export async function bulkApprove(page: Page): Promise<void>;
export async function bulkReject(page: Page, reason: string): Promise<void>;
export async function bulkSendForReview(
  page: Page,
  reason: string,
  stage: string,
): Promise<void>;
```

## 6. Test catalog

Each entry maps to one `requestorTest(...)` (or `fcTest(...)`) call.

### Step 1 — My Approval Dashboard (`describe("Step 1 — My Approval Dashboard")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0101 | Dashboard loads with Total Pending count visible | Smoke | High |
| TC-PRA0102 | Click pending PR row navigates to PR detail | Smoke | High |
| TC-PRA0103 | Pending count matches actual list row count | Functional | Medium |
| TC-PRA0104 | PO/PR/SR filter tabs render and filter when present | Functional | Medium |

### Step 2 — PR List, Approver View (`describe("Step 2 — PR List")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0201 | My Pending tab shows only PRs at HOD stage | Smoke | High |
| TC-PRA0202 | All Documents tab broadens scope (more rows) | Functional | Medium |
| TC-PRA0203 | All Stage dropdown filters by status | Functional | Medium |
| TC-PRA0204 | Filter panel opens, applies, persists in URL | Functional | Medium |
| TC-PRA0205 | Search by PR reference filters list | Functional | Low |

### Step 3 — PR Detail (Read-only) (`describe("Step 3 — PR Detail")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0301 | Detail loads with Items tab default | Smoke | High |
| TC-PRA0302 | Switch to Workflow History tab | Functional | Medium |
| TC-PRA0303 | No standalone Approve/Reject/Return buttons (BRD discrepancy verification) | Authorization | High |
| TC-PRA0304 | Edit button visible (entry to bulk actions) | Functional | High |

### Step 4 — Edit Mode + Bulk Actions (`describe("Step 4 — Edit Mode + Bulk Actions")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0401 | Click Edit → edit mode active (Save/Cancel visible) | Smoke | High |
| TC-PRA0402 | Approved Quantity field is editable | CRUD | High |
| TC-PRA0403 | Item Note field is editable | CRUD | Medium |
| TC-PRA0404 | Delivery Point field is editable | CRUD | Medium |
| TC-PRA0405 | Vendor field is read-only (HOD scope) | Authorization | High |
| TC-PRA0406 | Unit Price field is read-only | Authorization | High |
| TC-PRA0407 | Discount / Tax Profile / FOC Qty are read-only | Authorization | Medium |
| TC-PRA0408 | Bulk Approve via Select All → toolbar | CRUD | High |
| TC-PRA0409 | Bulk Reject via toolbar (with reason) | CRUD | High |
| TC-PRA0410 | Bulk Send for Review via toolbar (reason + stage) | CRUD | High |
| TC-PRA0411 | Bulk Split via toolbar | Functional | Low |
| TC-PRA0412 | Cancel edit → discard, restore Approved Qty | Functional | Medium |

### Scope Contrast (`describe("Scope Contrast (FC)")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0501 | FC sees PRs from multiple departments (vs HOD's single dept) | Authorization | High |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRA0901 | HOD full flow: My Approval → List → Detail → Edit → Adjust Qty → Bulk Approve | Smoke | High |

### Coverage summary

| Type | Count |
|---|---|
| Smoke | 6 |
| CRUD | 6 |
| Functional | 10 |
| Authorization | 5 |
| **Total** | **27** |

| Priority | Count |
|---|---|
| High | 15 |
| Medium | 10 |
| Low | 2 |

## 7. Annotation contract (per CLAUDE.md)

Every `requestorTest(...)` and `fcTest(...)` ships the full 5-field annotation set:

```ts
{
  annotation: [
    { type: "preconditions", description: "Logged in as HOD; pending PR exists at HOD stage (created via submitPRAsRequestor in beforeEach)" },
    { type: "steps",         description: "1. ...\n2. ..." },
    { type: "expected",      description: "Concrete outcome (URL / status badge / dialog visibility / disabled-state assertion)" },
    { type: "priority",      description: "High" },
    { type: "testType",      description: "Smoke" },
  ],
}
```

After writing the spec, run `bun docs:user-stories` to regenerate `docs/user-stories/303-pr-approver-journey.md`. Commit spec + user-story doc together.

The audit script in CLAUDE.md must pass:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```

For the new spec specifically, both counts equal 27.

## 8. Reporter and sync wiring

### CSV / JSON reporters
No code change — both reporters parse `TC-PRA0101`-style IDs automatically via `\b(TCS?-[A-Z]{0,4}\d{2,})\b` (`PRA` is 3 letters, fits the regex).

### Google Sheets sync
Add one entry to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ jsonFile: "303-pr-approver-journey-results.json", sheetTab: "PR Approver" }
```
Tab `PR Approver` must be created in the target spreadsheet (manual step) before first sync.

## 9. Hard-assertion discipline

Every TC carries either:
- At least one `expect(...)` without `.catch()` (the assertion that fails the test loud), OR
- An explicit `requestorTest.skip(reason)` or `fcTest.skip(reason)` early-exit when the prerequisite UI / data is missing.

Silent guards (e.g. `if (count > 0) await expect(...).catch(() => {})`) that always pass regardless of state are not acceptable. This pattern was enforced post-review in 302 and is established convention.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| `submitPRAsRequestor` adds ~10s per test (multi-context login) | Acceptable for ~20 dependent TCs; total impact ~3 min on full suite. Investment justified by reuse in `304` and `311` |
| HOD's "own department" scope assumes HOD's user has at least one PR in that department | TC-PRA0101..0102 trust DB; dynamic skip if zero pending. Step 3-4 use `submitPRAsRequestor` to seed → no DB dependency |
| Bulk-action toolbar locator may differ from documented BRD spec | Audit existing `purchase-request.page.ts` for any related selectors first; locators added defensively (regex with `\|` alternatives) |
| Read-only field assertions (TC-PRA0405..0407) require knowing how UI exposes "disabled" | Test for `[disabled]` attribute OR absence of an editable input — defensively check both |
| FC scope-contrast TC requires pending PRs in ≥2 departments | Dynamic skip if FC's view shows fewer than 2 distinct departments; explicit reason logged |
| Auth context for Requestor sub-context could leak cookies into HOD context | Each `submitPRAsRequestor` call uses `browser.newContext()` (fresh storage) → no leakage |

## 11. Success criteria

- 27 TCs implemented; all carry the 5-field annotation set
- `bun run test -- 303-pr-approver-journey.spec.ts` passes locally on first stable run (allowing dynamic skips for absent UI affordances)
- `docs/user-stories/303-pr-approver-journey.md` regenerates without error
- CSV + JSON emitted to `tests/results/303-pr-approver-journey-results.{csv,json}`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PR Approver` tab

## 12. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/303-pr-approver-journey.spec.ts` | New | ~27 TCs |
| `tests/pages/pr-approver.helpers.ts` | New | Cross-context Requestor seed + bulk-action composition |
| `tests/pages/purchase-request.page.ts` | Modify | Add ~12 bulk-action + edit-mode field methods |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/303-pr-approver-journey.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/303-pr-approver-journey-results.{csv,json}` | Auto | Reporter output at runtime |

## 13. Follow-up specs (out of scope here)

| # | Spec | Triggered by |
|---|---|---|
| 1 | `304-pr-purchaser-journey.spec.ts` | After this spec lands |
| 2 | `311-pr-returned-flow.spec.ts` | Cross-persona — covers Step 7 once 303 exists; reuses `submitPRAsRequestor` and adds `sendForReviewAsApprover` |
| 3 | `402-po-purchaser-journey.spec.ts` | After PR persona suites complete |
| 4 | `403-po-approver-journey.spec.ts` | After 402 |
