# Pr Returned Flow — User Stories

_Generated from `tests/311-pr-returned-flow.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Pr Returned Flow
**Spec:** `tests/311-pr-returned-flow.spec.ts`
**Default role:** Requestor
**Total test cases:** 11 (8 High / 3 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PRC0701 | Returned PR appears in Creator's list with RETURNED status badge | High | Smoke |
| TC-PRC0702 | Open Returned PR detail loads with status=Returned | High | Smoke |
| TC-PRC0703 | Workflow History tab shows the return reason from HOD | High | Functional |
| TC-PRC0704 | Edit button visible on Returned PR (Creator can re-edit) | High | Functional |
| TC-PRC0705 | Modify line item quantity → Save → URL stays on detail | High | CRUD |
| TC-PRC0706 | Add new line item to Returned PR → Save | Medium | CRUD |
| TC-PRC0707 | Submit confirmation dialog appears for Returned PR | High | Smoke |
| TC-PRC0708 | Confirm submit → status moves Returned → In Progress | High | CRUD |
| TC-PRC0709 | Cancel submit on Returned PR → URL stays on detail (still Returned) | Medium | Functional |
| TC-PRC0710 | Delete Returned PR is allowed for Creator | Medium | Authorization |
| TC-PRC0902 | Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress | High | Smoke |

---

## TC-PRC0701 — Returned PR appears in Creator's list with RETURNED status badge

> **As a** Requestor user, **I want** the Pr Returned Flow list page to load successfully, **so that** I can manage Pr Returned Flow records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor; a Returned PR exists (seeded via submitPRAsRequestor + sendForReviewAsHOD)

**Steps**

1. Open PR list
2. Locate the seeded PR row
3. Verify status badge reads Returned (or equivalent)

**Expected**

PR row is visible in the list and the status badge filter matches /returned|sent back/i for the row.

---

## TC-PRC0702 — Open Returned PR detail loads with status=Returned

> **As a** Requestor user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

A Returned PR exists

**Steps**

1. Navigate to the Returned PR detail page
2. Verify URL
3. Verify status badge

**Expected**

URL is /procurement/purchase-request/<ref>; status badge text matches /returned|sent back/i.

---

## TC-PRC0703 — Workflow History tab shows the return reason from HOD

> **As a** HOD user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a Returned PR detail page

**Steps**

1. Click Workflow History tab
2. Look for the HOD return reason text

**Expected**

Workflow History panel contains the seeded return reason 'Please revise — returned for review' (or partial match).

---

## TC-PRC0704 — Edit button visible on Returned PR (Creator can re-edit)

> **As a** Requestor user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On a Returned PR detail page

**Steps**

1. Inspect the action toolbar

**Expected**

Edit button is visible (Creator can enter Edit Mode to revise).

---

## TC-PRC0705 — Modify line item quantity → Save → URL stays on detail

> **As a** Requestor user, **I want** to manage Pr Returned Flow records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Returned PR detail page is open with at least one line item

**Steps**

1. Click Edit
2. Modify first row quantity to 7
3. Click Save Draft

**Expected**

After save the page URL stays on /procurement/purchase-request/<ref>.

---

## TC-PRC0706 — Add new line item to Returned PR → Save

> **As a** Requestor user, **I want** to create a new Pr Returned Flow record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Returned PR detail page is open

**Steps**

1. Click Edit
2. Add a new line item (product, qty, uom, price)
3. Click Save Draft

**Expected**

After save the page URL stays on /procurement/purchase-request/<ref>.

---

## TC-PRC0707 — Submit confirmation dialog appears for Returned PR

> **As a** Requestor user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Returned PR detail page is open

**Steps**

1. Click Submit on the Returned PR

**Expected**

A confirmation dialog (resubmit) becomes visible.

---

## TC-PRC0708 — Confirm submit → status moves Returned → In Progress

> **As a** Requestor user, **I want** to manage Pr Returned Flow records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Submit confirmation dialog open on a Returned PR

**Steps**

1. Click Submit
2. Confirm dialog
3. Wait for status badge to update

**Expected**

Status badge text matches /in.progress/i after confirm.

---

## TC-PRC0709 — Cancel submit on Returned PR → URL stays on detail (still Returned)

> **As a** Requestor user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Submit confirmation dialog open on a Returned PR

**Steps**

1. Click Submit
2. Click Cancel in the dialog

**Expected**

Dialog closes; URL remains on the PR detail page.

---

## TC-PRC0710 — Delete Returned PR is allowed for Creator

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Returned Flow, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

Returned PR detail page is open

**Steps**

1. Inspect Delete button presence
2. If present, click and confirm
3. Verify list URL

**Expected**

Delete button visible; confirming delete navigates back to the PR list URL. Skipped when Delete is not allowed in this configuration.

---

## TC-PRC0902 — Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress

> **As a** HOD user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as Requestor; a fresh PR is seeded into the Returned state via submitPRAsRequestor + sendForReviewAsHOD

**Steps**

1. Open the Returned PR detail
2. Click Workflow History tab and verify reason is shown
3. Click Edit
4. Modify first line item quantity
5. Save Draft
6. Click Submit and Confirm
7. Wait for status to read In Progress

**Expected**

Status badge transitions to In Progress after the resubmit confirmation.

---


<sub>Last regenerated: 2026-05-06 · git 9b238f5</sub>
