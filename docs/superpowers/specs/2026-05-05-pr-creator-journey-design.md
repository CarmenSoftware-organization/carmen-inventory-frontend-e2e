# PR Creator Journey — E2E Test Suite Design

**Date:** 2026-05-05
**Status:** Draft — pending user approval
**Scope:** Playwright persona-journey spec for the PR Creator (Requestor) workflow in `carmen-inventory-frontend`
**Source documents:** `Test case/Purchase Request/Creator/` (INDEX.md + step-01..08.md)

---

## 1. Purpose

`carmen-inventory-frontend-e2e` already ships `tests/301-purchase-request.spec.ts` (~3,500 lines) — a per-action multi-role spec that exercises individual PR operations. The internal `Test case/Purchase Request/Creator/` documentation, however, is organized as a **persona journey**: the Requestor's experience walking through PR List → Create → Template → Detail → Edit → Submit → Returned → Delete.

This spec adds a parallel **persona-journey suite** (`tests/302-pr-creator-journey.spec.ts`) that mirrors the documentation's persona-step structure, covering the user's flow rather than per-action units. The existing 301 spec is **not modified** — both coexist with complementary perspectives:

| Spec | Perspective | Granularity |
|---|---|---|
| `301-purchase-request.spec.ts` | Per-action across roles | Many flat TCs grouped by action (Create / Validate / Approve…) |
| `302-pr-creator-journey.spec.ts` (this spec) | Single persona's journey through screens | TCs grouped by step (List / Create / Detail / Edit / Submit / Delete) |

## 2. Scope

**In scope** — Creator persona only (`requestor@blueledgers.com`):
- Step 1 — PR List (browse / search / filter / sort / nav)
- Step 2 — Create PR (Blank) — header + line items + validation
- Step 3 — Create PR from Template
- Step 4 — PR Detail (view, tabs, button visibility per status)
- Step 5 — Edit Draft PR
- Step 6 — Submit Confirmation
- Step 8 — Delete Confirmation
- Golden Journey — full happy-path serial test
- ~41 TCs total

**Out of scope** (deferred to later specs):
- Step 7 — Returned PR — requires upstream Approver action; will be covered in a cross-persona spec (e.g. `311-pr-returned-flow.spec.ts`)
- Approver / Purchaser persona journeys (PR) — separate specs in subsequent rounds
- PO Creator / Approver journeys — after PR completes
- System Process docs (`proc-`, `tx-`) — backend-level behavior; better suited to integration tests
- Cleanup of created PRs — out of scope per agreed convention (see §4)

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture — used as `requestorTest` |
| `PurchaseRequestPage` | `tests/pages/purchase-request.page.ts` | List nav, create dialog, header fill, line item add — extended with new methods |
| `tc-csv-reporter` | `tests/reporters/tc-csv-reporter.ts` | Already parses `\b(TCS?-[A-Z]{0,4}\d{2,})\b` — `TC-PRC0101` matches |
| `tc-json-reporter` | `tests/reporters/tc-json-reporter.ts` | Captures the 5-field annotation set automatically |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change needed — uses standard annotation pattern |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |
| `TEST_USERS` | `tests/test-users.ts` | Canonical Requestor account is `requestor@blueledgers.com` (not `@zebra.com` from docs) |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new persona-journey spec alongside 301; do not modify 301 | Existing per-action coverage stays intact; new file gives persona-level perspective for stakeholders |
| 2 | Start with PR Creator persona only | Independent (no upstream dependency); root of the entire PR flow; biggest doc-coverage payoff |
| 3 | Granularity: golden journey + per-step scenarios (~30-50 TCs) | Balances flow visibility (one E2E smoke) with edge-case coverage (per-step validations) |
| 4 | Skip Step 7 (Returned PR); cover in cross-persona spec later | Returned status requires Approver action upstream — would force multi-login or seed dependency that bloats this spec |
| 5 | No automatic cleanup of created PRs | Matches existing convention (301 spec leaves PRs); avoids brittle cleanup; user filters via `[E2E-PRC]` description prefix |
| 6 | Per-step `describe` blocks (Approach 1) | TC ID encodes step + index → traces back to source `step-XX.md` docs 1:1 |
| 7 | TC prefix `TC-PRC` | Distinct from `TC-PR` in 301 to avoid ID clash; passes the `[A-Z]{0,4}` reporter regex |
| 8 | Extend existing `PurchaseRequestPage` rather than creating persona-scoped page object | Avoids duplication with 301 spec; persona-specific composition lives in `pr-creator.helpers.ts` |
| 9 | Mark created PRs with `[E2E-PRC]` description prefix | Not cleanup — just lets user filter and manually delete later if DB grows noisy |

## 5. Architecture

### File layout
```
tests/
  302-pr-creator-journey.spec.ts        ← new spec (~41 TCs)
  pages/
    purchase-request.page.ts            ← extend in place (add missing helpers)
    pr-creator.helpers.ts               ← new: journey-level composition (createDraftPR, etc.)
docs/user-stories/
  302-pr-creator-journey.md             ← auto-generated by `bun docs:user-stories`
tests/results/
  302-pr-creator-journey-results.{csv,json}  ← auto-emitted by reporters
```

### TC numbering
- Prefix `TC-PRC` (PR Creator) — does not collide with `TC-PR` in 301
- Format `TC-PRC<step><nn>` where `<step>` is the source step number and `<nn>` is the TC index within that step
- Step → ID range mapping:

| Step | Doc file | TC range | Count |
|---|---|---|---|
| 1 — PR List | `step-01-pr-list.md` | `TC-PRC0101..0107` | 7 |
| 2 — Create PR (Blank) | `step-02-create-pr.md` | `TC-PRC0201..0211` | 11 |
| 3 — Create from Template | `step-03-pr-template.md` | `TC-PRC0301..0305` | 5 |
| 4 — PR Detail | `step-04-pr-detail.md` | `TC-PRC0401..0404` | 4 |
| 5 — Edit Draft | `step-05-edit-pr.md` | `TC-PRC0501..0506` | 6 |
| 6 — Submit | `step-06-submit-confirmation.md` | `TC-PRC0601..0604` | 4 |
| 8 — Delete | `step-08-delete-confirmation.md` | `TC-PRC0801..0803` | 3 |
| Golden Journey | (cross-step) | `TC-PRC0901` | 1 |
| **Total** | | | **41** |

### Auth fixture
```ts
import { createAuthTest } from "./fixtures/auth.fixture";
const requestorTest = createAuthTest("requestor@blueledgers.com");
```
No new fixture required. Same pattern as `301-purchase-request.spec.ts:14`.

### Page object strategy
**Extend `tests/pages/purchase-request.page.ts` in place.** The persona-journey spec uses the same screens as 301 — a separate page object would duplicate locators. Existing methods (verified via `grep`):

- `gotoList`, `gotoNew`, `gotoApprovals`
- `newButton`, `openCreateDialog`, `createDialogBlankOption`
- `bulkActionsTrigger`, `bulkActionItem`, `prRow`, `rowCheckbox`, `openPR`
- `fillHeader` (prType, deliveryDate, description, justification, notes, internalNotes, hidePrice)
- `addLineItem` (product, description, quantity, uom, vendor, isFOC, unitPrice, discount, taxRate)

Methods to **add** (audited against the 7 in-scope steps):

| Method | Used by | Notes |
|---|---|---|
| `searchInput()` / `searchFor(text)` | Step 1 | List search box |
| `filterButton()` / `applyFilter({status?})` | Step 1 | Status filter chip / panel |
| `sortBy(column, order)` | Step 1 | Column header click |
| `tabMyPending()` / `tabAllDocuments()` | Step 1 | List tabs |
| `saveDraftButton()` / `saveAsDraft()` | Steps 2, 3, 5 | Confirm save action; check for existing impl first |
| `submitButton()` / `clickSubmit()` | Step 6 | |
| `submitConfirmDialog()` / `confirmSubmit()` / `cancelSubmit()` | Step 6 | Dialog primitives |
| `deleteButton()` / `clickDelete()` | Step 8 | |
| `deleteConfirmDialog()` / `confirmDelete()` / `cancelDelete()` | Step 8 | |
| `editModeButton()` / `enterEditMode()` | Step 5 | |
| `cancelEditMode()` | Step 5 | |
| `templatePicker()` / `selectTemplate(name)` | Step 3 | Template dropdown / list |
| `tabItems()` / `tabWorkflowHistory()` | Step 4 | Detail-page tabs |
| `expectStatus(status)` | Steps 4, 6, 8 | Verify status badge |
| `removeLineItem(index)` / `editLineItem(index, fields)` | Step 2, 5 | Item-level mutation |

**Audit note:** before implementation, re-check the source file for any of these that already exist under different names. The list above is best-effort from a `grep` of the first 60 lines; `wc -l` shows 304 lines total.

### New helpers — `tests/pages/pr-creator.helpers.ts`

Journey-level composition (not page-object level). Keeps the page object focused on locators + atomic actions; keeps multi-step flows reusable across TCs.

```ts
import { Page } from "@playwright/test";

export function e2eDescription(suffix: string): string {
  return `[E2E-PRC] ${suffix}`;
}

export interface CreatedPR {
  ref: string;        // PR reference number
  url: string;        // detail URL
}

export async function createDraftPR(
  page: Page,
  opts?: { items?: number; description?: string; deliveryDate?: string },
): Promise<CreatedPR> {
  // Open list → New → Blank → fill header → add N items → Save Draft
  // Capture ref + url from detail-page redirect
}

export async function submitDraftPR(page: Page, ref: string): Promise<void> {
  // Open PR by ref → Submit → confirm → wait for In Progress badge
}

export async function deleteDraftPR(page: Page, ref: string): Promise<void> {
  // Open PR by ref → Delete → confirm → wait for redirect to list
}
```

Used by:
- Step 4 (Detail) — needs an existing Draft → `createDraftPR()` in `beforeEach`
- Step 5 (Edit) — needs an existing Draft → `createDraftPR()` in `beforeEach`
- Step 6 (Submit) — needs a Draft with items → `createDraftPR({ items: 1 })`
- Step 8 (Delete) — needs a Draft → `createDraftPR()`
- Golden Journey — composes all three end-to-end

## 6. Test catalog

Each entry below maps to one `test(...)` call in `302-pr-creator-journey.spec.ts`.

### Step 1 — PR List (`describe("Step 1 — PR List")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0101 | List loads with My Pending tab + Creator's PRs visible | Smoke | High |
| TC-PRC0102 | Switch to All Documents tab — broader scope | Functional | Medium |
| TC-PRC0103 | Search by reference number filters list | Functional | Medium |
| TC-PRC0104 | Filter by status (Draft / In Progress / Approved) | Functional | Medium |
| TC-PRC0105 | Sort by Date asc / desc | Functional | Low |
| TC-PRC0106 | Click row → navigate to PR detail | Smoke | High |
| TC-PRC0107 | New PR button opens create dialog | Smoke | High |

### Step 2 — Create PR Blank (`describe("Step 2 — Create PR (Blank)")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0201 | Open Create dialog → Blank → form loads | Smoke | High |
| TC-PRC0202 | Default values populated (date, dept, location, currency, status=Draft) | Functional | High |
| TC-PRC0203 | Fill header (PR type, delivery date, description, notes) | CRUD | High |
| TC-PRC0204 | Add 1 basic line item | CRUD | High |
| TC-PRC0205 | Add line item with FOC flag | CRUD | Medium |
| TC-PRC0206 | Add multiple line items — totals recompute | CRUD | Medium |
| TC-PRC0207 | Edit line item before save | CRUD | Medium |
| TC-PRC0208 | Remove line item | CRUD | Medium |
| TC-PRC0209 | Save as Draft → redirect to detail with PR number | CRUD | High |
| TC-PRC0210 | Save without line items → button disabled / error | Validation | Medium |
| TC-PRC0211 | Delivery date in the past → validation error | Validation | Medium |

### Step 3 — Create from Template (`describe("Step 3 — Create from Template")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0301 | Open Create dialog → Template option → picker opens | Smoke | Medium |
| TC-PRC0302 | Select existing template → form pre-fills | Functional | Medium |
| TC-PRC0303 | Modify template-loaded items before save | CRUD | Medium |
| TC-PRC0304 | Save template-based PR → Draft created | CRUD | Medium |
| TC-PRC0305 | (skip if no templates) Empty state message | Functional | Low |

### Step 4 — PR Detail (`describe("Step 4 — PR Detail")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0401 | Open Draft PR — Items tab default | Smoke | High |
| TC-PRC0402 | Switch to Workflow History tab | Functional | Medium |
| TC-PRC0403 | Edit / Delete / Submit buttons present for Draft | Functional | High |
| TC-PRC0404 | Edit / Delete absent when status = In Progress | Authorization | Medium |

### Step 5 — Edit Draft (`describe("Step 5 — Edit Draft")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0501 | Click Edit → enter edit mode | Smoke | High |
| TC-PRC0502 | Modify header description | CRUD | Medium |
| TC-PRC0503 | Modify line item quantity | CRUD | Medium |
| TC-PRC0504 | Add line item in edit mode | CRUD | Medium |
| TC-PRC0505 | Save → exit edit mode + persist changes | CRUD | High |
| TC-PRC0506 | Cancel → discard changes, restore original | Functional | Medium |

### Step 6 — Submit (`describe("Step 6 — Submit")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0601 | Submit → confirmation dialog appears | Smoke | High |
| TC-PRC0602 | Cancel submit → stays on Draft | Functional | Medium |
| TC-PRC0603 | Confirm submit → status moves to In Progress | CRUD | High |
| TC-PRC0604 | Submit empty PR → button disabled | Validation | Medium |

### Step 8 — Delete (`describe("Step 8 — Delete")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0801 | Delete → confirmation dialog | Smoke | High |
| TC-PRC0802 | Cancel delete → PR remains | Functional | Medium |
| TC-PRC0803 | Confirm delete → list refreshed, PR gone | CRUD | High |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0901 | Full Creator flow: List → Create → Save Draft → Detail → Edit → Submit → In Progress | Smoke | High |

### Coverage summary
| Type | Count |
|---|---|
| Smoke | 8 |
| CRUD | 22 |
| Validation | 6 |
| Functional | 10 |
| Authorization | 1 |
| **Total** | **41** |

| Priority | Count |
|---|---|
| High | 13 |
| Medium | 22 |
| Low | 6 |

## 7. Annotation contract (per CLAUDE.md)

Every `test(...)` and `test.skip(...)` ships the full 5-field annotation set:

```ts
{
  annotation: [
    { type: "preconditions", description: "Logged in as Requestor; on PR list page" },
    { type: "steps",         description: "1. ...\n2. ...\n3. ..." },
    { type: "expected",      description: "Concrete outcome (URL / status / toast / locator state)" },
    { type: "priority",      description: "High" },
    { type: "testType",      description: "Smoke" },
  ],
}
```

The audit script in CLAUDE.md must pass for the new spec:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```

After writing the spec, run `bun docs:user-stories` to regenerate `docs/user-stories/302-pr-creator-journey.md`. Commit spec + user-story doc together.

## 8. Reporter and sync wiring

### CSV reporter
No code change — `tc-csv-reporter.ts` parses `TC-PRC0101`-style IDs automatically via `\b(TCS?-[A-Z]{0,4}\d{2,})\b`. Output: `tests/results/302-pr-creator-journey-results.csv`.

### JSON reporter
No code change — captures the 5 annotation fields automatically.

### Google Sheets sync
Add one entry to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ csv: "302-pr-creator-journey-results.csv", tab: "PR Creator" }
```
Tab `PR Creator` must be created in the target spreadsheet (manual step) before first sync.

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Step 3 (Template) requires templates to exist in DB | TC-PRC0302..0304 pick the first template in the picker list (`list[0]` selector) — robust to seed name changes. TC-PRC0305 dynamically `test.skip()`s if `templatePicker()` shows the empty-state copy |
| Default values in Step 2 vary by department / location seed data | Assert presence/non-empty rather than specific value; verify status=Draft only |
| Confirmation dialogs may use Radix (not native confirm) — locator may differ | Use `data-slot="alert-dialog"` / `getByRole('alertdialog')` per existing CLAUDE.md guidance |
| Created PRs accumulate in DB | Acceptable per agreed convention; `[E2E-PRC]` prefix lets user manually filter and delete |
| Auth cookie expiry across long describe blocks | `createAuthTest` re-logs per-test via auto fixture; should not be an issue at `workers: 1` |
| `301-purchase-request.spec.ts` uses lenient `.catch(() => {})` patterns | New spec uses stricter assertions where reasonable; falls back to lenient pattern only for rate-limited or async UI |

## 10. Success criteria

- 41 TCs implemented, all carrying the 5-field annotation set
- `bun test -- 302-pr-creator-journey.spec.ts` passes locally on first stable run
- `docs/user-stories/302-pr-creator-journey.md` regenerates without error
- CSV emitted to `tests/results/302-pr-creator-journey-results.csv`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PR Creator` tab

## 11. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/302-pr-creator-journey.spec.ts` | New | ~41 TCs |
| `tests/pages/purchase-request.page.ts` | Modify | Add ~15 helper methods |
| `tests/pages/pr-creator.helpers.ts` | New | Journey composition helpers |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/302-pr-creator-journey.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/302-pr-creator-journey-results.{csv,json}` | Auto | Emitted by reporters at runtime |

## 12. Follow-up specs (out of scope here)

| # | Spec | Triggered by |
|---|---|---|
| 1 | `303-pr-approver-journey.spec.ts` | After this spec lands |
| 2 | `304-pr-purchaser-journey.spec.ts` | After 303 |
| 3 | `311-pr-returned-flow.spec.ts` | Cross-persona — covers Step 7 once Approver spec exists |
| 4 | `402-po-purchaser-journey.spec.ts` | After PR persona suites complete |
| 5 | `403-po-approver-journey.spec.ts` | After 402 |
