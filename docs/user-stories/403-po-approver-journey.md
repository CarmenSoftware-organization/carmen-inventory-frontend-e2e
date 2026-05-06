# Po Approver Journey — User Stories

_Generated from `tests/403-po-approver-journey.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Po Approver Journey
**Spec:** `tests/403-po-approver-journey.spec.ts`
**Default role:** FC
**Total test cases:** 19 (12 High / 6 Medium / 1 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-POA0101 | My Approval dashboard loads with Total Pending count visible | High | Smoke |
| TC-POA0102 | PO filter tab shows pending POs (DRAFT + IN PROGRESS) | High | Functional |
| TC-POA0103 | Click pending PO row navigates to PO detail | High | Smoke |
| TC-POA0201 | PO Detail loads in IN PROGRESS view (FC perspective) | High | Smoke |
| TC-POA0202 | Header fields are read-only for FC (cannot edit vendor/date/etc.) | High | Authorization |
| TC-POA0203 | Edit button + Comment button visible | Medium | Functional |
| TC-POA0301 | Edit mode → select item → Approve toolbar appears | High | Smoke |
| TC-POA0302 | Mark item Approved → green badge appears on item row | High | CRUD |
| TC-POA0303 | Mark item Review → amber badge + Send Back footer button appears | High | CRUD |
| TC-POA0304 | Mark item Reject → reject badge + footer Reject button appears | Medium | CRUD |
| TC-POA0305 | All items Approved → Document Approve button enabled in footer | High | Functional |
| TC-POA0306 | Click Approve PO → confirmation dialog ('Once approved, PO will be sent to vendor') | High | Smoke |
| TC-POA0307 | Confirm Approve → status moves to APPROVED/SENT | High | CRUD |
| TC-POA0308 | Click Send Back → dialog with stage selector + per-item reason | Medium | Smoke |
| TC-POA0309 | Confirm Send Back → PO returned (status updates) | Medium | CRUD |
| TC-POA0310 | Click Reject → dialog with optional reason field | Medium | Smoke |
| TC-POA0311 | Confirm Reject → PO marked REJECTED | Medium | CRUD |
| TC-POA0312 | Cancel edit mode (no item marked) → exits without saving | Low | Functional |
| TC-POA0901 | Full FC flow: My Approval → open PO → Edit → mark all items Approved → Document Approve → Sent | High | Smoke |

---

## TC-POA0101 — My Approval dashboard loads with Total Pending count visible

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as FC (fc@blueledgers.com)

**Steps**

1. Navigate to My Approvals (or appropriate FC dashboard)
2. Verify the total-pending indicator is rendered

**Expected**

URL contains 'approval' or 'dashboard'; a count/badge or row count is visible.

---

## TC-POA0102 — PO filter tab shows pending POs (DRAFT + IN PROGRESS)

> **As a** FC user, **I want** to filter the Po Approver Journey list, **so that** I can narrow results to relevant records.

**Priority:** High · **Test Type:** Functional

**Preconditions**

On My Approval dashboard with at least one pending PO

**Steps**

1. Click PO/Purchase Order filter tab
2. Verify rows render or empty state

**Expected**

PO tab is selected (aria-selected=true) when present.

---

## TC-POA0103 — Click pending PO row navigates to PO detail

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

On My Approval dashboard with at least one pending PO row (seeded via submitPOAsPurchaser)

**Steps**

1. Seed PO via Purchaser context
2. Navigate to dashboard
3. Click the seeded PO row

**Expected**

URL navigates to /procurement/purchase-order/<ref>.

---

## TC-POA0201 — PO Detail loads in IN PROGRESS view (FC perspective)

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

An IN PROGRESS PO exists (seeded via submitPOAsPurchaser)

**Steps**

1. Open the PO detail page as FC
2. Verify URL and status badge

**Expected**

URL is /procurement/purchase-order/<ref>; status badge text matches /in.progress/i.

---

## TC-POA0202 — Header fields are read-only for FC (cannot edit vendor/date/etc.)

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Po Approver Journey, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

On an IN PROGRESS PO detail page as FC

**Steps**

1. Inspect vendor / description / delivery date inputs
2. Verify they are disabled or non-editable

**Expected**

Vendor input or one of the header fields is disabled/readonly. Skipped if no header field is detectable.

---

## TC-POA0203 — Edit button + Comment button visible

> **As a** FC user, **I want** this Po Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

On an IN PROGRESS PO detail page as FC

**Steps**

1. Inspect the action toolbar

**Expected**

Edit button is visible. Comment button is visible when present.

---

## TC-POA0301 — Edit mode → select item → Approve toolbar appears

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

An IN PROGRESS PO with ≥1 item exists (seeded via submitPOAsPurchaser)

**Steps**

1. Open PO detail
2. Click Edit
3. Select first item via row checkbox

**Expected**

Item action toolbar (Approve/Review/Reject) becomes visible.

---

## TC-POA0302 — Mark item Approved → green badge appears on item row

> **As a** FC user, **I want** to manage Po Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Item action toolbar visible on a row

**Steps**

1. Select item
2. Click Approve in toolbar
3. Verify badge

**Expected**

Item row shows an Approved badge.

---

## TC-POA0303 — Mark item Review → amber badge + Send Back footer button appears

> **As a** FC user, **I want** to manage Po Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Item action toolbar visible on a row

**Steps**

1. Select item
2. Click Review in toolbar
3. Verify badge + footer button

**Expected**

Item row shows a Review badge; document Send Back button is visible in footer.

---

## TC-POA0304 — Mark item Reject → reject badge + footer Reject button appears

> **As a** FC user, **I want** to manage Po Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Item action toolbar visible on a row

**Steps**

1. Select item
2. Click Reject in toolbar
3. Verify badge + footer button

**Expected**

Item row shows a Reject badge; document Reject button is visible in footer.

---

## TC-POA0305 — All items Approved → Document Approve button enabled in footer

> **As a** FC user, **I want** this Po Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

An IN PROGRESS PO with ≥1 item exists

**Steps**

1. Enter edit mode
2. Select item and mark Approve
3. Verify Document Approve button

**Expected**

Document Approve button is visible (and enabled when present).

---

## TC-POA0306 — Click Approve PO → confirmation dialog ('Once approved, PO will be sent to vendor')

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

All items marked Approved; Document Approve button visible

**Steps**

1. Approve all items
2. Click Document Approve PO button

**Expected**

Confirmation dialog is visible.

---

## TC-POA0307 — Confirm Approve → status moves to APPROVED/SENT

> **As a** FC user, **I want** to manage Po Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Document Approve confirmation dialog open

**Steps**

1. Approve item
2. Click Document Approve
3. Confirm dialog

**Expected**

Status badge text matches /approved|sent/i after confirmation.

---

## TC-POA0308 — Click Send Back → dialog with stage selector + per-item reason

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Item marked Review; Document Send Back button visible

**Steps**

1. Mark item Review
2. Click Document Send Back

**Expected**

Send Back dialog is visible.

---

## TC-POA0309 — Confirm Send Back → PO returned (status updates)

> **As a** FC user, **I want** to edit an existing Po Approver Journey record, **so that** its data stays accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Send Back dialog open

**Steps**

1. Mark item Review
2. Click Send Back
3. Enter reason
4. Confirm

**Expected**

URL stays on PO ref after confirmation.

---

## TC-POA0310 — Click Reject → dialog with optional reason field

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Item marked Reject; Document Reject button visible

**Steps**

1. Mark item Reject
2. Click Document Reject

**Expected**

Reject dialog is visible.

---

## TC-POA0311 — Confirm Reject → PO marked REJECTED

> **As a** FC user, **I want** to manage Po Approver Journey records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Reject dialog open

**Steps**

1. Mark item Reject
2. Click Document Reject
3. Enter optional reason
4. Confirm

**Expected**

Status badge text matches /rejected/i after confirmation.

---

## TC-POA0312 — Cancel edit mode (no item marked) → exits without saving

> **As a** FC user, **I want** this Po Approver Journey interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

Edit mode active on an IN PROGRESS PO with no item marked

**Steps**

1. Enter edit mode
2. Click Cancel without selecting/marking any item

**Expected**

Form returns to view mode (Edit button visible again).

---

## TC-POA0901 — Full FC flow: My Approval → open PO → Edit → mark all items Approved → Document Approve → Sent

> **As a** FC user, **I want** core Po Approver Journey interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as FC; a fresh IN PROGRESS PO is seeded via submitPOAsPurchaser

**Steps**

1. Seed IN PROGRESS PO
2. Open PO detail
3. Click Edit
4. Select first item
5. Mark Approve
6. Click Document Approve
7. Confirm dialog

**Expected**

Status badge transitions to APPROVED/SENT after confirmation.

---


<sub>Last regenerated: 2026-05-06 · git 9b238f5</sub>
