# Pr Creator Journey — User Stories

_Generated from `tests/302-pr-creator-journey.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Pr Creator Journey
**Spec:** `tests/302-pr-creator-journey.spec.ts`
**Default role:** Requestor
**Total test cases:** 41 (17 High / 22 Medium / 2 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-050101 | List loads with My Pending tab and Creator's PRs visible | High | Smoke |
| TC-PR-050102 | Switch to All Documents tab broadens scope | Medium | Functional |
| TC-PR-050103 | Search by reference number filters list | Medium | Functional |
| TC-PR-050104 | Filter by status (Draft) | Medium | Functional |
| TC-PR-050105 | Sort list by Date | Low | Functional |
| TC-PR-050106 | Click row navigates to PR detail | High | Smoke |
| TC-PR-050107 | New PR button opens create dialog | High | Smoke |
| TC-PR-050201 | Open Create dialog → Blank → form loads | High | Smoke |
| TC-PR-050202 | Default values populated on the new form | High | Functional |
| TC-PR-050203 | Fill header fields | High | CRUD |
| TC-PR-050204 | Add 1 basic line item | High | CRUD |
| TC-PR-050205 | Add line item with FOC flag | Medium | CRUD |
| TC-PR-050206 | Add multiple line items — form stays on /new | Medium | CRUD |
| TC-PR-050207 | Edit line item before save | Medium | CRUD |
| TC-PR-050208 | Remove line item | Medium | CRUD |
| TC-PR-050209 | Save as Draft → redirect to detail with PR number | High | CRUD |
| TC-PR-050210 | Save without line items → button disabled or stays on form | Medium | Validation |
| TC-PR-050211 | Delivery date in the past → validation prevents save | Medium | Validation |
| TC-PR-050301 | Open Create dialog → Template option → picker opens | Medium | Smoke |
| TC-PR-050302 | Select first template → form pre-fills | Medium | Functional |
| TC-PR-050303 | Modify template-loaded items before save | Medium | CRUD |
| TC-PR-050304 | Save template-based PR → Draft created | Medium | CRUD |
| TC-PR-050305 | Empty-state message when no templates exist | Low | Functional |
| TC-PR-050401 | Draft PR detail loads with Items tab default | High | Smoke |
| TC-PR-050402 | Switch to Workflow History tab | Medium | Functional |
| TC-PR-050403 | Edit / Delete / Submit buttons present for Draft | High | Functional |
| TC-PR-050404 | Edit / Delete absent when status is In Progress | Medium | Authorization |
| TC-PR-050501 | Click Edit → enter edit mode | High | Smoke |
| TC-PR-050502 | Modify header description in edit mode | Medium | CRUD |
| TC-PR-050503 | Modify line item quantity in edit mode | Medium | CRUD |
| TC-PR-050504 | Add line item in edit mode | Medium | CRUD |
| TC-PR-050505 | Save → exit edit mode + persist changes | High | CRUD |
| TC-PR-050506 | Cancel → discard changes, restore original | Medium | Functional |
| TC-PR-050601 | Submit → confirmation dialog appears | High | Smoke |
| TC-PR-050602 | Cancel submit → stays on Draft | Medium | Functional |
| TC-PR-050603 | Confirm submit → status moves to In Progress | High | CRUD |
| TC-PR-050604 | Submit empty PR — button disabled or no transition | Medium | Validation |
| TC-PR-050801 | Click Delete → confirmation dialog | High | Smoke |
| TC-PR-050802 | Cancel delete → PR remains | Medium | Functional |
| TC-PR-050803 | Confirm delete → list refreshed, PR gone | High | CRUD |
| TC-PR-050901 | Full Creator flow: List → Create → Save Draft → Edit → Submit → In Progress | High | Smoke |

---

## TC-PR-050101 — List loads with My Pending tab and Creator's PRs visible

> **As a** Requestor user, **I want** the Pr Creator Journey list page to load successfully, **so that** I can manage Pr Creator Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor (requestor@blueledgers.com)

**Steps**

1. Navigate to /procurement/purchase-request
2. Verify My Pending tab is selected by default
3. Verify list table is visible

**Expected**

URL is /procurement/purchase-request, My Pending tab has aria-selected=true, table or empty-state is visible.

---

## TC-PR-050102 — Switch to All Documents tab broadens scope

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Click All Documents tab
2. Verify list refreshes

**Expected**

All Documents tab becomes selected; the list re-renders.

---

## TC-PR-050103 — Search by reference number filters list

> **As a** Requestor user, **I want** to filter the Pr Creator Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page; at least one PR exists with a known reference

**Steps**

1. Click search box
2. Type partial reference
3. Wait for the list to filter

**Expected**

List updates to rows whose reference contains the typed text.

---

## TC-PR-050104 — Filter by status (Draft)

> **As a** Requestor user, **I want** to filter the Pr Creator Journey list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Open Filter panel
2. Select status = Draft
3. Apply

**Expected**

List shows only PRs with Draft status (or empty state).

---

## TC-PR-050105 — Sort list by Date

> **As a** Requestor user, **I want** to sort the Pr Creator Journey list, **so that** I can find records in a useful order.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

On the PR list page

**Steps**

1. Click Date column header to sort
2. Verify list re-orders

**Expected**

Column header shows a sort indicator and the list re-orders.

---

## TC-PR-050106 — Click row navigates to PR detail

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

On the PR list page; at least one PR row exists

**Steps**

1. Click the first PR row

**Expected**

Navigates to /procurement/purchase-request/<id>.

---

## TC-PR-050107 — New PR button opens create dialog

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

On the PR list page

**Steps**

1. Click New Purchase Request

**Expected**

Either a creation dialog opens or the URL changes to /new.

---

## TC-PR-050201 — Open Create dialog → Blank → form loads

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor; on PR list

**Steps**

1. Click New Purchase Request
2. Choose Blank PR option (if dialog appears)
3. Wait for the create form

**Expected**

URL becomes /procurement/purchase-request/new and the create form is visible.

---

## TC-PR-050202 — Default values populated on the new form

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On the create-PR form

**Steps**

1. Navigate to /new
2. Inspect default values for date, department, location, currency, status

**Expected**

Form is at /new and a Draft indicator is shown when the badge is rendered.

---

## TC-PR-050203 — Fill header fields

> **As a** Requestor user, **I want** to manage Pr Creator Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

On the create-PR form

**Steps**

1. Set PR type = General
2. Set delivery date in the future
3. Enter description and notes

**Expected**

Description input contains the value entered (E2E-PRC marker).

---

## TC-PR-050204 — Add 1 basic line item

> **As a** Requestor user, **I want** to create a new Pr Creator Journey record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

On the create-PR form with header filled

**Steps**

1. Click Add Item
2. Fill product, qty, uom, unit price
3. Save the item

**Expected**

Form remains on /new — item add does not navigate away from the create form.

---

## TC-PR-050205 — Add line item with FOC flag

> **As a** Requestor user, **I want** to create a new Pr Creator Journey record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

On the create-PR form with header filled

**Steps**

1. Add Item
2. Toggle FOC checkbox
3. Save

**Expected**

Form remains on /new after the FOC item is saved.

---

## TC-PR-050206 — Add multiple line items — form stays on /new

> **As a** Requestor user, **I want** to create a new Pr Creator Journey record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

On the create-PR form

**Steps**

1. Add 3 line items at different prices
2. Verify form still shown

**Expected**

Form remains on /new after 3 items are added.

---

## TC-PR-050207 — Edit line item before save

> **As a** Requestor user, **I want** to edit an existing Pr Creator Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Header filled and at least one line item added

**Steps**

1. Add 1 item
2. Edit its quantity
3. Save the line

**Expected**

Form remains on /new after the edit.

---

## TC-PR-050208 — Remove line item

> **As a** Requestor user, **I want** to delete a Pr Creator Journey record, **so that** the list reflects only valid entries.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Header filled and at least one line item added

**Steps**

1. Add an item
2. Click its remove button

**Expected**

Form remains on /new after the remove.

---

## TC-PR-050209 — Save as Draft → redirect to detail with PR number

> **As a** Requestor user, **I want** to manage Pr Creator Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Header + ≥1 line item filled

**Steps**

1. Click Save as Draft
2. Wait for redirect to detail

**Expected**

URL changes to /purchase-request/<id> (not /new) and detail page renders.

---

## TC-PR-050210 — Save without line items → button disabled or stays on form

> **As a** Requestor user, **I want** the system to block invalid Pr Creator Journey submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

On the create-PR form with header filled but no items

**Steps**

1. Fill header
2. Click Save as Draft without adding any line item

**Expected**

Either the Save button is disabled, or the form does not navigate away from /new.

---

## TC-PR-050211 — Delivery date in the past → validation prevents save

> **As a** Requestor user, **I want** the system to block invalid Pr Creator Journey submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

On the create-PR form

**Steps**

1. Set delivery date to a past date
2. Add an item
3. Try to save

**Expected**

Form does not navigate away from /new (validation rejects past date).

---

## TC-PR-050301 — Open Create dialog → Template option → picker opens

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor; on PR list

**Steps**

1. Click New Purchase Request
2. Pick the From-Template option in the dialog

**Expected**

Template picker (dialog or listbox) is visible after selecting the From-Template option.

---

## TC-PR-050302 — Select first template → form pre-fills

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Template picker is open and at least one template exists

**Steps**

1. Open template picker
2. Select the first template

**Expected**

URL contains template_id query param (form is loading from a template).

---

## TC-PR-050303 — Modify template-loaded items before save

> **As a** Requestor user, **I want** to manage Pr Creator Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

On the create-from-template form with prefilled items

**Steps**

1. Open template form
2. Edit the first prefilled line item quantity

**Expected**

Form remains on the template-load URL after the edit (no premature navigation).

---

## TC-PR-050304 — Save template-based PR → Draft created

> **As a** Requestor user, **I want** to create a new Pr Creator Journey record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Template-based form has prefilled items

**Steps**

1. Open template form
2. Click Save as Draft

**Expected**

URL changes to /purchase-request/<id> (not /new) after save.

---

## TC-PR-050305 — Empty-state message when no templates exist

> **As a** Requestor user, **I want** a clear empty-state when no Pr Creator Journey records match my search, **so that** I know nothing was found.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Template picker open and no templates exist in the system

**Steps**

1. Open template picker
2. Inspect content

**Expected**

An empty-state message ('No templates') is visible. Skipped if templates exist.

> _Note: Dynamically skipped when at least one template is present._

---

## TC-PR-050401 — Draft PR detail loads with Items tab default

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PR exists for this Requestor (created in beforeEach)

**Steps**

1. Open the Draft PR detail page
2. Verify the Items tab is selected

**Expected**

Detail URL is /procurement/purchase-request/<ref>; if Items tab is rendered, it is the selected one.

---

## TC-PR-050402 — Switch to Workflow History tab

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On a Draft PR detail page

**Steps**

1. Click the Workflow History tab

**Expected**

Workflow History tab becomes selected after click.

---

## TC-PR-050403 — Edit / Delete / Submit buttons present for Draft

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a Draft PR detail page

**Steps**

1. Inspect the action toolbar

**Expected**

Edit, Delete, and Submit buttons are all visible for Draft status.

---

## TC-PR-050404 — Edit / Delete absent when status is In Progress

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Creator Journey, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

A PR exists in In Progress status (created via Submit flow)

**Steps**

1. Submit a Draft PR
2. Reload detail
3. Inspect toolbar

**Expected**

Edit and Delete buttons are not visible (read-only mode).

---

## TC-PR-050501 — Click Edit → enter edit mode

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PR exists for this Requestor

**Steps**

1. Open Draft PR
2. Click Edit

**Expected**

Form becomes editable; Save (or Cancel) form-level button is visible.

---

## TC-PR-050502 — Modify header description in edit mode

> **As a** Requestor user, **I want** to edit an existing Pr Creator Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

A Draft PR is open in edit mode

**Steps**

1. Enter edit mode
2. Update description
3. Save

**Expected**

After save the page returns to detail URL (no redirect to /new or list).

---

## TC-PR-050503 — Modify line item quantity in edit mode

> **As a** Requestor user, **I want** to edit an existing Pr Creator Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

A Draft PR with at least one line item is open in edit mode

**Steps**

1. Enter edit mode
2. Edit first line item quantity
3. Save

**Expected**

After save the page returns to the detail URL.

---

## TC-PR-050504 — Add line item in edit mode

> **As a** Requestor user, **I want** to create a new Pr Creator Journey record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

A Draft PR is open in edit mode

**Steps**

1. Enter edit mode
2. Click Add Item
3. Fill product/qty/uom
4. Save

**Expected**

After save the page returns to the detail URL.

---

## TC-PR-050505 — Save → exit edit mode + persist changes

> **As a** Requestor user, **I want** to edit an existing Pr Creator Journey record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

A Draft PR is open in edit mode with at least one change

**Steps**

1. Enter edit mode
2. Make a change
3. Click Save

**Expected**

Form returns to view mode (Edit button visible again on detail page).

---

## TC-PR-050506 — Cancel → discard changes, restore original

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

A Draft PR is open in edit mode

**Steps**

1. Enter edit mode
2. Type into description
3. Click Cancel

**Expected**

Form returns to view mode (Edit button visible again on detail page).

---

## TC-PR-050601 — Submit → confirmation dialog appears

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PR with ≥1 line item exists

**Steps**

1. Open Draft PR
2. Click Submit

**Expected**

Confirmation dialog is visible.

---

## TC-PR-050602 — Cancel submit → stays on Draft

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Submit confirmation dialog is open

**Steps**

1. Open Submit dialog
2. Click Cancel

**Expected**

Dialog closes; URL remains on the detail page (no submit transition).

---

## TC-PR-050603 — Confirm submit → status moves to In Progress

> **As a** Requestor user, **I want** to manage Pr Creator Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Submit confirmation dialog is open

**Steps**

1. Open Submit dialog
2. Click Confirm

**Expected**

Status badge updates to In Progress (asserted by submitDraftPR helper).

---

## TC-PR-050604 — Submit empty PR — button disabled or no transition

> **As a** Requestor user, **I want** the system to block invalid Pr Creator Journey submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

A Draft PR with zero line items exists

**Steps**

1. Open Draft PR with no items
2. Inspect Submit button

**Expected**

Either Submit button is disabled, or clicking it does not move status to In Progress (URL stays on detail).

---

## TC-PR-050801 — Click Delete → confirmation dialog

> **As a** Requestor user, **I want** core Pr Creator Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Draft PR exists for this Requestor

**Steps**

1. Open Draft PR
2. Click Delete

**Expected**

Delete confirmation dialog is visible.

---

## TC-PR-050802 — Cancel delete → PR remains

> **As a** Requestor user, **I want** this Pr Creator Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Delete confirmation dialog is open

**Steps**

1. Open Delete dialog
2. Click Cancel

**Expected**

Dialog closes; URL remains on the detail page (PR is not deleted).

---

## TC-PR-050803 — Confirm delete → list refreshed, PR gone

> **As a** Requestor user, **I want** to delete a Pr Creator Journey record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Delete confirmation dialog is open

**Steps**

1. Open Delete dialog
2. Click Confirm

**Expected**

Page navigates back to the PR list (URL ends at /procurement/purchase-request).

---

## TC-PR-050901 — Full Creator flow: List → Create → Save Draft → Edit → Submit → In Progress

> **As a** Requestor user, **I want** the Pr Creator Journey list page to load successfully, **so that** I can manage Pr Creator Journey records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor; on PR list

**Steps**

1. Open list
2. Click New PR (Blank)
3. Fill header + 1 line item
4. Save as Draft
5. Open detail and click Edit
6. Edit description
7. Save
8. Click Submit and confirm

**Expected**

PR is created (detail URL with ref), edited (Edit button reappears post-save), submitted (status badge reads In Progress).

---


<sub>Last regenerated: 2026-05-06 · git 3adf1d3</sub>
