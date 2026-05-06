# Pr Approver Journey — User Stories

_Generated from `tests/303-pr-approver-journey.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Pr Approver Journey
**Spec:** `tests/303-pr-approver-journey.spec.ts`
**Default role:** FC
**Total test cases:** 27 (15 High / 10 Medium / 2 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PRA0101 | Dashboard loads with Total Pending count visible | High | Smoke |
| TC-PRA0102 | Click pending PR row navigates to PR detail | High | Smoke |
| TC-PRA0103 | Pending count matches actual list row count | Medium | Functional |
| TC-PRA0104 | Filter tabs render and filter when present | Medium | Functional |
| TC-PRA0201 | My Pending tab shows PRs at HOD stage | High | Smoke |
| TC-PRA0202 | All Documents tab broadens scope | Medium | Functional |
| TC-PRA0203 | All Stage dropdown filters by status | Medium | Functional |
| TC-PRA0204 | Filter panel opens and applies | Medium | Functional |
| TC-PRA0205 | Search by PR reference filters list | Low | Functional |
| TC-PRA0301 | Detail loads with Items tab default | High | Smoke |
| TC-PRA0302 | Switch to Workflow History tab | Medium | Functional |
| TC-PRA0303 | No standalone Approve/Reject/Return buttons (BRD discrepancy) | High | Authorization |
| TC-PRA0304 | Edit button visible (entry to bulk actions) | High | Functional |
| TC-PRA0401 | Click Edit → edit mode active | High | Smoke |
| TC-PRA0402 | Approved Quantity field is editable | High | CRUD |
| TC-PRA0403 | Item Note field is editable | Medium | CRUD |
| TC-PRA0404 | Delivery Point field is editable | Medium | CRUD |
| TC-PRA0405 | Vendor field is read-only | High | Authorization |
| TC-PRA0406 | Unit Price field is read-only | High | Authorization |
| TC-PRA0407 | Discount / Tax / FOC Qty are read-only | Medium | Authorization |
| TC-PRA0408 | Bulk Approve via Select All → toolbar | High | CRUD |
| TC-PRA0409 | Bulk Reject via toolbar (with reason) | High | CRUD |
| TC-PRA0410 | Bulk Send for Review via toolbar | High | CRUD |
| TC-PRA0411 | Bulk Split via toolbar | Low | Functional |
| TC-PRA0412 | Cancel edit → discard changes | Medium | Functional |
| TC-PRA0501 | FC sees PRs from multiple departments | High | Authorization |
| TC-PRA0901 | HOD full flow: My Approval → List → Detail → Edit → Adjust Qty → Bulk Approve | High | Smoke |

---

## TC-PRA0101 — Dashboard loads with Total Pending count visible

> **As a** FC user, **I want** core Pr Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as HOD (hod@blueledgers.com)

**Steps**

1. Navigate to My Approvals
2. Verify pending count badge is visible

**Expected**

My Approvals dashboard loads; pending count badge is visible.

---

## TC-PRA0102 — Click pending PR row navigates to PR detail

> **As a** FC user, **I want** core Pr Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

On My Approvals dashboard with at least one pending PR row

**Steps**

1. Click first pending PR row

**Expected**

URL navigates to /procurement/purchase-request/<ref>.

---

## TC-PRA0103 — Pending count matches actual list row count

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On My Approvals dashboard

**Steps**

1. Read pending badge value
2. Count visible PR rows

**Expected**

Badge value equals the visible row count (or both are zero).

---

## TC-PRA0104 — Filter tabs render and filter when present

> **As a** FC user, **I want** to filter the Pr Approver Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On My Approvals dashboard

**Steps**

1. Look for category filter tabs (PO/PR/SR)
2. Click PR tab if present

**Expected**

PR tab becomes selected (skipped if dashboard has no tabs).

---

## TC-PRA0201 — My Pending tab shows PRs at HOD stage

> **As a** HOD user, **I want** core Pr Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as HOD; navigated to PR list

**Steps**

1. Navigate to /procurement/purchase-request
2. Verify My Pending tab is selected

**Expected**

URL is on PR list and the My Pending tab is selected when present.

---

## TC-PRA0202 — All Documents tab broadens scope

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Click All Documents tab

**Expected**

All Documents tab becomes selected.

---

## TC-PRA0203 — All Stage dropdown filters by status

> **As a** FC user, **I want** to filter the Pr Approver Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Open All Stage dropdown
2. Select In Progress

**Expected**

URL stays on PR list (filter applied or no-op when dropdown absent).

---

## TC-PRA0204 — Filter panel opens and applies

> **As a** FC user, **I want** to filter the Pr Approver Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Open Filter panel
2. Select status
3. Apply

**Expected**

URL stays on PR list after applying the filter.

---

## TC-PRA0205 — Search by PR reference filters list

> **As a** FC user, **I want** to filter the Pr Approver Journey list, **so that** I can narrow results to relevant records.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

On the PR list page; at least one PR exists with a known reference

**Steps**

1. Type partial reference in search
2. Wait for results

**Expected**

URL stays on PR list after typing in the search input.

---

## TC-PRA0301 — Detail loads with Items tab default

> **As a** FC user, **I want** core Pr Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A pending PR (In Progress, HOD stage) exists; created via submitPRAsRequestor

**Steps**

1. Open the PR detail page
2. Verify Items tab is the default

**Expected**

URL is the detail URL; Items tab is selected when present.

---

## TC-PRA0302 — Switch to Workflow History tab

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On a pending PR detail page

**Steps**

1. Click Workflow History tab

**Expected**

Workflow History tab becomes selected.

---

## TC-PRA0303 — No standalone Approve/Reject/Return buttons (BRD discrepancy)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Approver Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

On a pending PR detail page (read-only view)

**Steps**

1. Inspect detail page header / action toolbar

**Expected**

Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar).

---

## TC-PRA0304 — Edit button visible (entry to bulk actions)

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a pending PR detail page

**Steps**

1. Inspect the action toolbar

**Expected**

Edit button is visible (HOD can enter Edit Mode for bulk actions).

---

## TC-PRA0401 — Click Edit → edit mode active

> **As a** FC user, **I want** core Pr Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A pending PR detail page is open

**Steps**

1. Click Edit
2. Verify Save/Cancel form-level buttons appear

**Expected**

Save Draft (or Cancel) form-level button is visible.

---

## TC-PRA0402 — Approved Quantity field is editable

> **As a** FC user, **I want** to edit an existing Pr Approver Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Approved Qty input on first row
3. Verify it is editable

**Expected**

Approved Qty input is visible and accepts a value.

---

## TC-PRA0403 — Item Note field is editable

> **As a** FC user, **I want** to edit an existing Pr Approver Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Item Note input
3. Type a note

**Expected**

Item Note input accepts the typed value.

---

## TC-PRA0404 — Delivery Point field is editable

> **As a** FC user, **I want** to edit an existing Pr Approver Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Delivery Point input
3. Verify editable

**Expected**

Delivery Point input is editable.

---

## TC-PRA0405 — Vendor field is read-only

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Approver Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Vendor cell on first row

**Expected**

Vendor cell is disabled or non-editable per FR-PR-011A.

---

## TC-PRA0406 — Unit Price field is read-only

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Approver Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Unit Price cell on first row

**Expected**

Unit Price cell is disabled or non-editable per FR-PR-011A.

---

## TC-PRA0407 — Discount / Tax / FOC Qty are read-only

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Approver Journey, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Discount, Tax, FOC Qty cells

**Expected**

All three cells are disabled or non-editable per FR-PR-011A / FR-PR-024.

---

## TC-PRA0408 — Bulk Approve via Select All → toolbar

> **As a** FC user, **I want** to manage Pr Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Approve in bulk toolbar
4. Confirm

**Expected**

Status transitions away from In Progress (toast / next-stage / reload state).

---

## TC-PRA0409 — Bulk Reject via toolbar (with reason)

> **As a** FC user, **I want** to manage Pr Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Reject
4. Enter reason
5. Confirm

**Expected**

URL stays on the PR ref after rejection (status badge updates).

---

## TC-PRA0410 — Bulk Send for Review via toolbar

> **As a** FC user, **I want** to manage Pr Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a pending PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Send for Review
4. Enter reason + stage
5. Confirm

**Expected**

URL stays on the PR ref after send for review.

---

## TC-PRA0411 — Bulk Split via toolbar

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Edit mode active on a pending PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Split

**Expected**

Split UI appears (dialog or inline) — verified by URL stays on detail.

---

## TC-PRA0412 — Cancel edit → discard changes

> **As a** FC user, **I want** this Pr Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Edit mode active on a pending PR with at least one item

**Steps**

1. Enter edit mode
2. Type into Approved Qty
3. Click Cancel

**Expected**

Form returns to view mode (Edit button visible again).

---

## TC-PRA0501 — FC sees PRs from multiple departments

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Approver Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Logged in as FC (fc@blueledgers.com); pending PRs exist in DB across multiple departments

**Steps**

1. Navigate to PR list as FC
2. Open All Documents tab
3. Read department column values from rows

**Expected**

At least 2 distinct department values appear in the list (skipped if DB lacks cross-dept PRs).

---

## TC-PRA0901 — HOD full flow: My Approval → List → Detail → Edit → Adjust Qty → Bulk Approve

> **As a** HOD user, **I want** the Pr Approver Journey list page to load successfully, **so that** I can manage Pr Approver Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as HOD; a fresh pending PR is seeded via submitPRAsRequestor

**Steps**

1. Open My Approvals
2. Open PR detail
3. Click Edit
4. Adjust Approved Qty on first row
5. Select all + Bulk Approve + Confirm

**Expected**

URL stays on the PR ref after bulk approve; the journey completes end-to-end.

---


<sub>Last regenerated: 2026-05-06 · git ca61be4</sub>
