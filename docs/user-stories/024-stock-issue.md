# Stock Issue — User Stories

_Generated from `tests/024-stock-issue.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Stock Issue
**Spec:** `tests/024-stock-issue.spec.ts`
**Default role:** Purchase
**Total test cases:** 25 (4 High / 16 Medium / 5 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SI00101 | Happy Path - View Issue List | Medium | Happy Path |
| TC-SI00103 | Edge Case - No Issues | Medium | Edge Case |
| TC-SI00104 | Edge Case - Pagination | Medium | Edge Case |
| TC-SI00201 | View existing issue with all details | Medium | Happy Path |
| TC-SI00202 | View issue with missing department assignment | Medium | Edge Case |
| TC-SI00203 | View issue without view permission | High | Negative |
| TC-SI00301 | Happy Path - Search by SR Reference Number | Medium | Happy Path |
| TC-SI00302 | Negative Case - Invalid Search Term | Medium | Negative |
| TC-SI00303 | Edge Case - Empty Search Term | Low | Edge Case |
| TC-SI00304 | Negative Case - No Permission | High | Negative |
| TC-SI00305 | Edge Case - Multiple Filters | Medium | Edge Case |
| TC-SI00401 | Happy Path - View Full SR from Issue Detail | Medium | Happy Path |
| TC-SI00402 | Negative - No SR View Permission | Medium | Negative |
| TC-SI00403 | Edge Case - Empty SR Reference Link | Low | Edge Case |
| TC-SI00404 | Negative - User at Issue Stage No Permissions | Medium | Negative |
| TC-SI00405 | Happy Path - Print SR | Low | Happy Path |
| TC-SI00501 | Happy Path: Warehouse Staff prints a stock issue document | High | Happy Path |
| TC-SI00502 | Negative: User without permission attempts to print | Medium | Negative |
| TC-SI00503 | Edge Case: Multiple items with zero quantity | Low | Edge Case |
| TC-SI00504 | Negative: Issue does not exist | Medium | Negative |
| TC-SI00505 | Edge Case: Issue at Cancel stage | Low | Edge Case |
| TC-SI00601 | Happy Path - View Expense Allocation | High | Happy Path |
| TC-SI00602 | Negative - No Permission to View Costs | Medium | Negative |
| TC-SI00603 | Edge Case - SR with No Expense Allocation | Medium | Edge Case |
| TC-SI00604 | Negative - Invalid SR ID | Medium | Negative |

---

## TC-SI00101 — Happy Path - View Issue List

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has access to Stock Issues view and has store_operations.view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify the summary cards display correct counts and total value
3. Verify the issue list is filtered for Issue stage with DIRECT destinations
4. Click on a row
5. Verify the selected issue details match the row

**Expected**

Summary cards and issue list display correct information. User can view details of selected issues.

---

## TC-SI00103 — Edge Case - No Issues

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has access; no issues exist in Issue stage with DIRECT destinations

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify the summary cards display 0 for all counts and total value
3. Verify the issue list is empty

**Expected**

Summary cards and issue list display 0 counts and empty list.

---

## TC-SI00104 — Edge Case - Pagination

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has access to Stock Issues view and has store_operations.view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify pagination controls are present
3. Click Next or Previous page button
4. Verify the next or previous page of issues is displayed

**Expected**

Pagination controls work and next or previous page of issues is correctly displayed.

---

## TC-SI00201 — View existing issue with all details

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A StoreRequisition exists at Issue stage; destinationLocationType is DIRECT; user has view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on issue row or reference number
3. Verify header with SR reference, date, and status badge
4. Verify From Location, Issue Summary, To Location, Department, and Expense Account cards
5. Verify items table with correct details
6. Verify tracking info if available

**Expected**

System displays all details in the issue layout as expected.

---

## TC-SI00202 — View issue with missing department assignment

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A StoreRequisition exists at Issue stage; destinationLocationType is DIRECT; user has view permission; department is not assigned

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on issue row or reference number
3. Verify header with SR reference, date, and status badge
4. Verify From Location, Issue Summary, To Location, and Expense Account cards
5. Verify items table with correct details
6. Verify tracking info if available

**Expected**

System displays all details except department card as expected.

---

## TC-SI00203 — View issue without view permission

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A StoreRequisition exists at Issue stage; destinationLocationType is DIRECT; user does not have view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on issue row or reference number
3. Verify error message or restricted access indication

**Expected**

System restricts access or shows error message as expected.

---

## TC-SI00301 — Happy Path - Search by SR Reference Number

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has access to Stock Issues view

**Steps**

1. Navigate to /store-operation/store-requisition
2. Fill search term 'SR-12345' in search box
3. Select 'All' status filter
4. Wait for list update
5. Verify SR 'SR-12345' is displayed in list

**Expected**

SR 'SR-12345' is correctly displayed in the list with all relevant details.

---

## TC-SI00302 — Negative Case - Invalid Search Term

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has access to Stock Issues view

**Steps**

1. Navigate to /store-operation/store-requisition
2. Fill search term 'InvalidSR' in search box
3. Select 'All' status filter
4. Wait for list update
5. Verify no SRs are displayed

**Expected**

No SRs are displayed in the list.

---

## TC-SI00303 — Edge Case - Empty Search Term

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has access to Stock Issues view

**Steps**

1. Navigate to /store-operation/store-requisition
2. Clear search term in search box
3. Select 'All' status filter
4. Wait for list update
5. Verify all SRs are displayed

**Expected**

All SRs are displayed in the list.

---

## TC-SI00304 — Negative Case - No Permission

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have access to Stock Issues view

**Steps**

1. Navigate to /store-operation/store-requisition
2. Attempt to fill search term in search box

**Expected**

User is redirected to a permission denied page or an error message is displayed.

---

## TC-SI00305 — Edge Case - Multiple Filters

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has access to Stock Issues view

**Steps**

1. Navigate to /store-operation/store-requisition
2. Fill search term 'SR-12345' in search box
3. Select 'Active' status filter
4. Click 'From Location' dropdown
5. Select 'Warehouse A' from dropdown
6. Click 'To Location' dropdown
7. Select 'Warehouse B' from dropdown
8. Click 'Department' dropdown
9. Select 'Sales' from dropdown
10. Wait for list update
11. Verify SR 'SR-12345' with 'Active' status, from 'Warehouse A', to 'Warehouse B', and in 'Sales' department is displayed

**Expected**

SR 'SR-12345' with specified filters is displayed in the list.

---

## TC-SI00401 — Happy Path - View Full SR from Issue Detail

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged in and has SR view permission. Issue view is displayed.

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Full SR'
3. Verify Store Requisition detail page is displayed

**Expected**

User is navigated to Store Requisition detail page where they can see all relevant information and perform actions if permitted.

---

## TC-SI00402 — Negative - No SR View Permission

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged in but does not have SR view permission. Issue view is displayed.

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Full SR'
3. Verify error message is displayed

**Expected**

Error message indicating user does not have permission to view full SR is displayed.

---

## TC-SI00403 — Edge Case - Empty SR Reference Link

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has SR view permission. Issue view is displayed with an empty SR reference link.

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Full SR' (link is empty)
3. Verify error message is displayed

**Expected**

Error message indicating SR reference link is invalid or empty is displayed.

---

## TC-SI00404 — Negative - User at Issue Stage No Permissions

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged in and has SR view permission. Issue view is displayed with SR at Issue stage.

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Full SR'
3. Click 'Complete'
4. Verify error message is displayed

**Expected**

Error message indicating user does not have permission to complete SR is displayed.

---

## TC-SI00405 — Happy Path - Print SR

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

User is logged in and has SR view and print permission. Issue view is displayed with SR at Issue stage.

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Full SR'
3. Click 'Print'
4. Verify print dialog or confirmation message is displayed

**Expected**

Print dialog or confirmation message is displayed allowing user to print SR.

---

## TC-SI00501 — Happy Path: Warehouse Staff prints a stock issue document

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Issue exists at Issue/Complete stage and user has view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Print' button
3. Verify document is generated with header, location information, items list, and signature fields
4. Browser print dialog opens

**Expected**

Document is successfully printed with all required information.

---

## TC-SI00502 — Negative: User without permission attempts to print

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Issue exists at Issue/Complete stage but user does not have view permission

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Print' button
3. Verify system denies permission and does not allow printing

**Expected**

System denies printing due to insufficient permissions.

---

## TC-SI00503 — Edge Case: Multiple items with zero quantity

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Issue exists with multiple items, some having zero quantity

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Print' button
3. Verify document includes items with non-zero quantities only

**Expected**

Document does not include items with zero quantity.

---

## TC-SI00504 — Negative: Issue does not exist

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Issue does not exist in the system

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Print' button
3. Verify system displays an error message

**Expected**

System displays an error message indicating the issue does not exist.

---

## TC-SI00505 — Edge Case: Issue at Cancel stage

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Issue exists but is at Cancel stage

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Print' button
3. Verify system displays an error message

**Expected**

System displays an error message indicating the issue is at Cancel stage and cannot be printed.

---

## TC-SI00601 — Happy Path - View Expense Allocation

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

SR status is Completed; user has permission to view costs

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Expense Allocation'

**Expected**

Expense allocation details are displayed: Department, Expense Account, Total Value expensed, and items with individual costs.

---

## TC-SI00602 — Negative - No Permission to View Costs

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

SR status is Completed; user does not have permission to view costs

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Expense Allocation'

**Expected**

System displays a permission denied message.

---

## TC-SI00603 — Edge Case - SR with No Expense Allocation

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

SR status is Completed; user has permission to view costs; SR has no expense allocation

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Expense Allocation'

**Expected**

System displays a message indicating no expense allocation.

---

## TC-SI00604 — Negative - Invalid SR ID

> **As a** Purchase user, **I want** this Stock Issue behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission to view costs

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'View Expense Allocation'

**Expected**

System displays a message indicating the SR ID is invalid.

---


<sub>Last regenerated: 2026-04-27 · git 9195ab6</sub>
