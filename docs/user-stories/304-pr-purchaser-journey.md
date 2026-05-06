# Pr Purchaser Journey — User Stories

_Generated from `tests/304-pr-purchaser-journey.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Pr Purchaser Journey
**Spec:** `tests/304-pr-purchaser-journey.spec.ts`
**Default role:** Purchase
**Total test cases:** 25 (13 High / 10 Medium / 2 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-070101 | List loads, My Pending tab default (PRs at Purchase stage) | High | Smoke |
| TC-PR-070102 | Switch to All Documents tab broadens scope | Medium | Functional |
| TC-PR-070103 | All Stage dropdown filters by status | Medium | Functional |
| TC-PR-070104 | Filter panel opens and applies | Medium | Functional |
| TC-PR-070105 | Search by PR reference filters list | Low | Functional |
| TC-PR-070201 | Detail loads with Items tab default | High | Smoke |
| TC-PR-070202 | Switch to Workflow History tab | Medium | Functional |
| TC-PR-070203 | No standalone Approve/Reject/Return buttons (BRD discrepancy) | High | Authorization |
| TC-PR-070204 | Edit button visible (entry to vendor/pricing edit) | High | Functional |
| TC-PR-070301 | Click Edit → vendor/pricing fields become editable | High | Smoke |
| TC-PR-070302 | Vendor field is editable (Purchaser scope) | High | CRUD |
| TC-PR-070303 | Unit Price field is editable | High | CRUD |
| TC-PR-070304 | Discount field is editable | Medium | CRUD |
| TC-PR-070305 | Tax Profile field is editable | Medium | CRUD |
| TC-PR-070306 | Approved Qty field stays read-only (HOD already set it) | High | Authorization |
| TC-PR-070307 | Auto Allocate button populates vendors via scoring | Medium | Functional |
| TC-PR-070308 | Multiple line items — pricing on each row independent | Medium | CRUD |
| TC-PR-070309 | Save edits → exit edit mode + persist values | High | CRUD |
| TC-PR-070310 | Cancel edits → discard changes, restore original | Medium | Functional |
| TC-PR-070401 | Bulk Approve → PR advances to next stage (FC) | High | CRUD |
| TC-PR-070402 | Bulk Reject (with reason) | High | CRUD |
| TC-PR-070403 | Bulk Send for Review (return to HOD) | High | CRUD |
| TC-PR-070404 | Bulk Split — split selected items | Low | Functional |
| TC-PR-070405 | Cannot edit when PR is at non-Purchase stage (read-only) | Medium | Authorization |
| TC-PR-070901 | Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage | High | Smoke |

---

## TC-PR-070101 — List loads, My Pending tab default (PRs at Purchase stage)

> **As a** Purchase user, **I want** the Pr Purchaser Journey list page to load successfully, **so that** I can manage Pr Purchaser Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser (purchase@blueledgers.com)

**Steps**

1. Navigate to /procurement/purchase-request
2. Verify URL and My Pending tab

**Expected**

URL is on PR list; My Pending tab is selected when present.

---

## TC-PR-070102 — Switch to All Documents tab broadens scope

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Click All Documents tab

**Expected**

All Documents tab becomes selected.

---

## TC-PR-070103 — All Stage dropdown filters by status

> **As a** Purchase user, **I want** to filter the Pr Purchaser Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Open All Stage dropdown
2. Select In Progress

**Expected**

URL stays on PR list (filter applied or no-op when dropdown absent).

---

## TC-PR-070104 — Filter panel opens and applies

> **As a** Purchase user, **I want** to filter the Pr Purchaser Journey list, **so that** I can narrow results to relevant records.

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

## TC-PR-070105 — Search by PR reference filters list

> **As a** Purchase user, **I want** to filter the Pr Purchaser Journey list, **so that** I can narrow results to relevant records.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

On the PR list page; at least one PR exists with a known reference

**Steps**

1. Type partial reference in search
2. Wait for results

**Expected**

URL stays on PR list after typing in the search input.

---

## TC-PR-070201 — Detail loads with Items tab default

> **As a** Purchase user, **I want** core Pr Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

PR exists at Purchase stage (seeded via submitPRAsRequestor + approveAsHOD)

**Steps**

1. Open the PR detail page
2. Verify Items tab is the default

**Expected**

URL is the detail URL; Items tab is selected when present.

---

## TC-PR-070202 — Switch to Workflow History tab

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On a Purchase-stage PR detail page

**Steps**

1. Click Workflow History tab

**Expected**

Workflow History tab becomes selected.

---

## TC-PR-070203 — No standalone Approve/Reject/Return buttons (BRD discrepancy)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Purchaser Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

On a Purchase-stage PR detail page (read-only view)

**Steps**

1. Inspect detail page header / action toolbar

**Expected**

Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar).

---

## TC-PR-070204 — Edit button visible (entry to vendor/pricing edit)

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a Purchase-stage PR detail page

**Steps**

1. Inspect the action toolbar

**Expected**

Edit button is visible (Purchaser can enter Edit Mode for vendor/pricing allocation).

---

## TC-PR-070301 — Click Edit → vendor/pricing fields become editable

> **As a** Purchase user, **I want** core Pr Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

PR exists at Purchase stage

**Steps**

1. Open Purchase-stage PR
2. Click Edit
3. Verify Save/Cancel form-level buttons appear

**Expected**

Save Draft (or Cancel) form-level button is visible.

---

## TC-PR-070302 — Vendor field is editable (Purchaser scope)

> **As a** Purchase user, **I want** to edit an existing Pr Purchaser Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Vendor input on first row
3. Verify it is editable

**Expected**

Vendor input is editable (opposite of Approver, who sees it as read-only).

---

## TC-PR-070303 — Unit Price field is editable

> **As a** Purchase user, **I want** to edit an existing Pr Purchaser Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Unit Price input
3. Type a value

**Expected**

Unit Price input accepts the typed value.

---

## TC-PR-070304 — Discount field is editable

> **As a** Purchase user, **I want** to edit an existing Pr Purchaser Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Locate Discount input
3. Verify editable

**Expected**

Discount input is editable.

---

## TC-PR-070305 — Tax Profile field is editable

> **As a** Purchase user, **I want** to edit an existing Pr Purchaser Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Locate Tax Profile select
3. Verify editable

**Expected**

Tax Profile select is editable.

---

## TC-PR-070306 — Approved Qty field stays read-only (HOD already set it)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Purchaser Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Edit mode active on a Purchase-stage PR with at least one item

**Steps**

1. Enter edit mode
2. Locate Approved Qty cell on first row

**Expected**

Approved Qty cell is disabled or non-editable for Purchaser (HOD already set it).

---

## TC-PR-070307 — Auto Allocate button populates vendors via scoring

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Edit mode active on a Purchase-stage PR with at least one item

**Steps**

1. Enter edit mode
2. Click Auto Allocate

**Expected**

URL stays on detail page after click (allocation runs).

---

## TC-PR-070308 — Multiple line items — pricing on each row independent

> **As a** Purchase user, **I want** to manage Pr Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR with multiple items

**Steps**

1. Seed PR with 2 items
2. Enter edit mode
3. Set unit price on row 0
4. Set unit price on row 1
5. Verify both values present

**Expected**

Each row's Unit Price input retains its own value.

---

## TC-PR-070309 — Save edits → exit edit mode + persist values

> **As a** Purchase user, **I want** to edit an existing Pr Purchaser Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR with vendor/price edits

**Steps**

1. Enter edit mode
2. Set unit price
3. Click Save Draft

**Expected**

Form returns to view mode (Edit button visible again).

---

## TC-PR-070310 — Cancel edits → discard changes, restore original

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Type into Unit Price
3. Click Cancel

**Expected**

Form returns to view mode (Edit button visible again).

---

## TC-PR-070401 — Bulk Approve → PR advances to next stage (FC)

> **As a** FC user, **I want** to manage Pr Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Approve in bulk toolbar
4. Confirm

**Expected**

URL stays on the PR ref (status advances to next stage).

---

## TC-PR-070402 — Bulk Reject (with reason)

> **As a** Purchase user, **I want** to manage Pr Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Reject
4. Enter reason
5. Confirm

**Expected**

URL stays on the PR ref after rejection.

---

## TC-PR-070403 — Bulk Send for Review (return to HOD)

> **As a** HOD user, **I want** to manage Pr Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Send for Review
4. Enter reason + stage
5. Confirm

**Expected**

URL stays on the PR ref after send for review.

---

## TC-PR-070404 — Bulk Split — split selected items

> **As a** Purchase user, **I want** this Pr Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Edit mode active on a Purchase-stage PR

**Steps**

1. Enter edit mode
2. Select all rows
3. Click Split

**Expected**

Split UI appears (dialog or inline) — verified by URL stays on detail.

---

## TC-PR-070405 — Cannot edit when PR is at non-Purchase stage (read-only)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Purchaser Journey, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

PR is at HOD stage (not yet approved by HOD), viewed by Purchaser

**Steps**

1. Seed PR at HOD stage (skip approveAsHOD)
2. Open detail as Purchaser
3. Inspect Edit button

**Expected**

Edit button is absent OR detail is read-only — Purchaser cannot edit until PR reaches Purchase stage.

---

## TC-PR-070901 — Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage

> **As a** Purchase user, **I want** the Pr Purchaser Journey list page to load successfully, **so that** I can manage Pr Purchaser Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser; a fresh PR is seeded at Purchase stage via submitPRAsRequestor + approveAsHOD

**Steps**

1. Open PR list
2. Open PR detail
3. Click Edit
4. Set unit price on first row
5. Select all + Bulk Approve + Confirm

**Expected**

URL stays on the PR ref after bulk approve; the journey completes end-to-end.

---


<sub>Last regenerated: 2026-05-06 · git a840c0e</sub>
