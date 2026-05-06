# Po Purchaser Journey — User Stories

_Generated from `tests/402-po-purchaser-journey.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Po Purchaser Journey
**Spec:** `tests/402-po-purchaser-journey.spec.ts`
**Default role:** Purchase
**Total test cases:** 32 (14 High / 15 Medium / 3 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-POP0101 | List loads with PO statuses (DRAFT / IN PROGRESS / APPROVED / etc.) | High | Smoke |
| TC-POP0102 | Switch to All Documents tab broadens scope | Medium | Functional |
| TC-POP0103 | Filter by status (DRAFT) | Medium | Functional |
| TC-POP0104 | Search by PO reference | Medium | Functional |
| TC-POP0105 | Sort by Date | Low | Functional |
| TC-POP0201 | Open Create dropdown → Blank → form loads | High | Smoke |
| TC-POP0202 | Fill header (vendor, delivery date, description) + add 1 line item | High | CRUD |
| TC-POP0203 | Save Draft → redirect to detail with PO number | High | CRUD |
| TC-POP0204 | Save without items → button disabled or stays on /new | Medium | Validation |
| TC-POP0205 | Open Create → From Price List → wizard step 1 (Select Vendors) | Medium | Smoke |
| TC-POP0206 | Select vendor → wizard step 2 (Review items) | Medium | Functional |
| TC-POP0207 | Submit Price List wizard → POs created (URL changes from /new to detail) | High | CRUD |
| TC-POP0208 | Skip dynamically if no price list / vendors available | Low | Functional |
| TC-POP0209 | Open Create → From PR → wizard step 1 (Select Approved PRs) | Medium | Smoke |
| TC-POP0210 | Select approved PR → wizard step 2 (Review POs grouped by vendor) | Medium | Functional |
| TC-POP0211 | Submit From PR wizard → POs created | High | CRUD |
| TC-POP0212 | Skip dynamically if no approved PR available | Low | Functional |
| TC-POP0301 | Detail loads (DRAFT) with header + items table | High | Smoke |
| TC-POP0302 | Item Details panel — Details / Quantity / Pricing tabs | Medium | Functional |
| TC-POP0303 | Edit / Delete / Submit buttons present for DRAFT | High | Functional |
| TC-POP0304 | Read-only state for SENT/COMPLETED status (best-effort) | Medium | Authorization |
| TC-POP0401 | Click Edit on DRAFT → edit mode active (Save/Cancel visible) | High | Smoke |
| TC-POP0402 | Modify line item quantity → Save → URL stays on detail | High | CRUD |
| TC-POP0403 | Add new line item in edit mode → Save | Medium | CRUD |
| TC-POP0404 | Cancel edit (no unsaved changes) → exits without dialog | Medium | Functional |
| TC-POP0405 | Submit Draft PO → confirmation dialog → status moves to IN PROGRESS | High | CRUD |
| TC-POP0406 | Delete IN PROGRESS PO via Edit Mode | Medium | CRUD |
| TC-POP0501 | Approved PO has Send to Vendor + Close buttons (seeded via approveAsFC) | High | Functional |
| TC-POP0502 | Click Send to Vendor → status updates / toast | High | CRUD |
| TC-POP0503 | Close PO with items received → COMPLETED | Medium | CRUD |
| TC-POP0504 | Close PO without items received → VOIDED | Medium | CRUD |
| TC-POP0901 | Full Purchaser flow: Create blank → Save Draft → Submit → FC approves → Send to Vendor | High | Smoke |

---

## TC-POP0101 — List loads with PO statuses (DRAFT / IN PROGRESS / APPROVED / etc.)

> **As a** Purchase user, **I want** the Po Purchaser Journey list page to load successfully, **so that** I can manage Po Purchaser Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser (purchase@blueledgers.com)

**Steps**

1. Navigate to /procurement/purchase-order
2. Verify URL and that the list table or empty-state is visible

**Expected**

URL is on PO list; My Pending tab is selected when present.

---

## TC-POP0102 — Switch to All Documents tab broadens scope

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PO list page

**Steps**

1. Click All Documents tab

**Expected**

All Documents tab becomes selected.

---

## TC-POP0103 — Filter by status (DRAFT)

> **As a** Purchase user, **I want** to filter the Po Purchaser Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PO list page

**Steps**

1. Open Filter panel
2. Select status = DRAFT
3. Apply

**Expected**

URL stays on PO list after applying the filter.

---

## TC-POP0104 — Search by PO reference

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PO list page

**Steps**

1. Type partial reference in search box

**Expected**

URL stays on PO list after typing in the search input.

---

## TC-POP0105 — Sort by Date

> **As a** Purchase user, **I want** to sort the Po Purchaser Journey list, **so that** I can find records in a useful order.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

On the PO list page

**Steps**

1. Click Date column header to sort
2. Verify list re-orders

**Expected**

URL stays on PO list after sort click.

---

## TC-POP0201 — Open Create dropdown → Blank → form loads

> **As a** Purchase user, **I want** core Po Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser; on PO list

**Steps**

1. Click New PO dropdown
2. Choose Blank/Manual PO option
3. Verify URL changes to /new

**Expected**

URL becomes /procurement/purchase-order/new and form is visible.

---

## TC-POP0202 — Fill header (vendor, delivery date, description) + add 1 line item

> **As a** Purchase user, **I want** to create a new Po Purchaser Journey record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

On the create-PO form (blank)

**Steps**

1. Fill vendor, description, delivery date
2. Add 1 line item

**Expected**

Description input retains the value entered (E2E-POP marker).

---

## TC-POP0203 — Save Draft → redirect to detail with PO number

> **As a** Purchase user, **I want** to manage Po Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Header + ≥1 line item filled on create form

**Steps**

1. Click Save
2. Wait for redirect to detail

**Expected**

URL changes to /procurement/purchase-order/<id> (not /new).

---

## TC-POP0204 — Save without items → button disabled or stays on /new

> **As a** Purchase user, **I want** the system to block invalid Po Purchaser Journey submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

On the create-PO form with header but no items

**Steps**

1. Click Save without adding any line item

**Expected**

Either Save button is disabled, or the form does not navigate from /new.

---

## TC-POP0205 — Open Create → From Price List → wizard step 1 (Select Vendors)

> **As a** Purchase user, **I want** the Po Purchaser Journey list page to load successfully, **so that** I can manage Po Purchaser Journey records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser; on PO list

**Steps**

1. Click New PO dropdown
2. Choose From Price List

**Expected**

Wizard step 1 renders (URL changes or dialog appears with vendor selection).

---

## TC-POP0206 — Select vendor → wizard step 2 (Review items)

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

From Price List wizard step 1 is open

**Steps**

1. Select first vendor
2. Click Next/Continue

**Expected**

Wizard advances to step 2 (review screen visible).

---

## TC-POP0207 — Submit Price List wizard → POs created (URL changes from /new to detail)

> **As a** Purchase user, **I want** to create a new Po Purchaser Journey record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

From Price List wizard step 2 (Review) is open

**Steps**

1. Click Create/Submit on the wizard final step

**Expected**

URL transitions away from /new to a created PO detail or list.

---

## TC-POP0208 — Skip dynamically if no price list / vendors available

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Logged in as Purchaser; on PO list

**Steps**

1. Open From Price List wizard
2. Inspect step 1 vendor list

**Expected**

If wizard shows empty vendor list, test skips with reason. Otherwise asserts wizard step 1 is visible.

> _Note: Dynamically skipped when DB lacks price list / vendor data._

---

## TC-POP0209 — Open Create → From PR → wizard step 1 (Select Approved PRs)

> **As a** Purchase user, **I want** core Po Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser; on PO list

**Steps**

1. Click New PO dropdown
2. Choose From PR

**Expected**

Wizard step 1 renders (PR selection list visible or dialog appears).

---

## TC-POP0210 — Select approved PR → wizard step 2 (Review POs grouped by vendor)

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

From PR wizard step 1 is open with at least one approved PR

**Steps**

1. Select first approved PR
2. Click Next/Continue

**Expected**

Wizard advances to step 2 (review grouped POs by vendor).

---

## TC-POP0211 — Submit From PR wizard → POs created

> **As a** Purchase user, **I want** to create a new Po Purchaser Journey record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

From PR wizard step 2 is open

**Steps**

1. Click Create/Submit on the wizard final step

**Expected**

URL transitions away from /new (POs created).

---

## TC-POP0212 — Skip dynamically if no approved PR available

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Logged in as Purchaser; on PO list

**Steps**

1. Open From PR wizard
2. Inspect step 1 PR list

**Expected**

If wizard shows empty PR list, test skips with reason. Otherwise asserts wizard step 1 is visible.

> _Note: Dynamically skipped when DB lacks approved PRs._

---

## TC-POP0301 — Detail loads (DRAFT) with header + items table

> **As a** Purchase user, **I want** core Po Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PO exists for this Purchaser (seeded via submitPOAsPurchaser)

**Steps**

1. Open the Draft PO detail
2. Verify URL matches the PO ref

**Expected**

URL is /procurement/purchase-order/<ref>.

---

## TC-POP0302 — Item Details panel — Details / Quantity / Pricing tabs

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On a Draft PO detail page with at least one item

**Steps**

1. Locate Item Details panel tabs
2. Switch through Items / Quantity / Pricing tabs if present

**Expected**

Tabs render and become selected when clicked (skipped if not present).

---

## TC-POP0303 — Edit / Delete / Submit buttons present for DRAFT

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a Draft PO detail page

**Steps**

1. Inspect the action toolbar

**Expected**

Edit button is visible (Submit button visibility depends on UI variant).

---

## TC-POP0304 — Read-only state for SENT/COMPLETED status (best-effort)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Po Purchaser Journey, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

A SENT or COMPLETED PO exists in the DB (any non-Draft, non-In-Progress)

**Steps**

1. Navigate to PO list
2. Find a SENT/COMPLETED row
3. Open it and inspect the toolbar

**Expected**

Edit button is NOT visible OR is disabled. Skipped if no SENT/COMPLETED PO is found.

> _Note: Dynamically skipped if no SENT/COMPLETED PO available._

---

## TC-POP0401 — Click Edit on DRAFT → edit mode active (Save/Cancel visible)

> **As a** Purchase user, **I want** core Po Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PO exists

**Steps**

1. Open Draft PO detail
2. Click Edit
3. Verify Save/Cancel form-level buttons

**Expected**

Save button is visible after entering edit mode.

---

## TC-POP0402 — Modify line item quantity → Save → URL stays on detail

> **As a** Purchase user, **I want** to manage Po Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Draft PO with at least one item

**Steps**

1. Enter edit mode
2. Modify a quantity input
3. Click Save

**Expected**

After save the page URL stays on /procurement/purchase-order/<ref>.

---

## TC-POP0403 — Add new line item in edit mode → Save

> **As a** Purchase user, **I want** to create a new Po Purchaser Journey record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Edit mode active on a Draft PO

**Steps**

1. Enter edit mode
2. Add new line item
3. Save

**Expected**

After save the page URL stays on detail.

---

## TC-POP0404 — Cancel edit (no unsaved changes) → exits without dialog

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Edit mode active on a Draft PO with no changes typed

**Steps**

1. Enter edit mode
2. Click Cancel without making changes

**Expected**

Form returns to view mode (Edit button visible again).

---

## TC-POP0405 — Submit Draft PO → confirmation dialog → status moves to IN PROGRESS

> **As a** Purchase user, **I want** to manage Po Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

A Draft PO with ≥1 item exists

**Steps**

1. Open Draft PO
2. Click Submit
3. Confirm dialog

**Expected**

URL stays on PO ref; status badge text updates (best effort).

---

## TC-POP0406 — Delete IN PROGRESS PO via Edit Mode

> **As a** Purchase user, **I want** to edit an existing Po Purchaser Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

An IN PROGRESS PO exists (post-submit). DRAFT also acceptable.

**Steps**

1. Open the PO
2. Click Edit
3. Click Delete
4. Confirm

**Expected**

URL navigates back to list (PO removed).

---

## TC-POP0501 — Approved PO has Send to Vendor + Close buttons (seeded via approveAsFC)

> **As a** Purchase user, **I want** this Po Purchaser Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

An Approved PO exists (seeded via submitPOAsPurchaser + approveAsFC)

**Steps**

1. Seed Approved PO
2. Open detail
3. Inspect action toolbar

**Expected**

Send to Vendor button is visible. Close button presence is secondary (not asserted hard if absent).

---

## TC-POP0502 — Click Send to Vendor → status updates / toast

> **As a** Purchase user, **I want** to edit an existing Po Purchaser Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

An Approved PO exists

**Steps**

1. Open Approved PO
2. Click Send to Vendor
3. Confirm

**Expected**

URL stays on PO ref; success toast or status update visible.

---

## TC-POP0503 — Close PO with items received → COMPLETED

> **As a** Purchase user, **I want** to manage Po Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

A SENT PO exists with items received (best-effort; trusts DB)

**Steps**

1. Find a SENT PO with received items in the list
2. Open detail
3. Click Close
4. Confirm

**Expected**

Status text matches /completed/i after close. Skipped if no eligible PO.

> _Note: Dynamically skipped when no SENT-with-items PO exists._

---

## TC-POP0504 — Close PO without items received → VOIDED

> **As a** Purchase user, **I want** to manage Po Purchaser Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

An Approved/SENT PO exists with no items received

**Steps**

1. Find an eligible PO
2. Click Close
3. Confirm

**Expected**

Status text matches /voided|cancelled/i after close. Skipped if no eligible PO.

> _Note: Dynamically skipped when no eligible PO exists._

---

## TC-POP0901 — Full Purchaser flow: Create blank → Save Draft → Submit → FC approves → Send to Vendor

> **As a** FC user, **I want** core Po Purchaser Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Purchaser

**Steps**

1. Create blank PO (header + 1 item)
2. Save Draft
3. Submit
4. FC approves (cross-context)
5. Reload detail
6. Click Send to Vendor

**Expected**

URL stays on PO ref after Send to Vendor (full lifecycle completes end-to-end).

---


<sub>Last regenerated: 2026-05-06 · git f17f7d9</sub>
