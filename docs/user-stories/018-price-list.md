# Price List — User Stories

_Generated from `tests/018-price-list.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Price List
**Spec:** `tests/018-price-list.spec.ts`
**Default role:** Purchase
**Total test cases:** 27 (9 High / 14 Medium / 4 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PL00101 | Valid Login and Access to Price Lists Page | High | Happy Path |
| TC-PL00102 | Search Filter with Invalid Keyword | Medium | Negative |
| TC-PL00103 | View Price List Details with No Data | Medium | Edge Case |
| TC-PL00104 | User Without Access to Price Lists Page | High | Negative |
| TC-PL00105 | Filter by Expired Status | Medium | Happy Path |
| TC-PL00201 | Happy Path - Create Valid Price List | High | Happy Path |
| TC-PL00202 | Negative - Missing Vendor | Medium | Negative |
| TC-PL00203 | Edge Case - Empty Unit Price | Medium | Edge Case |
| TC-PL00301 | Happy Path - Valid Price List Click | High | Happy Path |
| TC-PL00302 | Negative - No Price List Selected | Medium | Negative |
| TC-PL00303 | Edge Case - User Without Edit Permission | High | Edge Case |
| TC-PL00304 | Negative - User Without View Permission | Medium | Negative |
| TC-PL00305 | Edge Case - Empty Line Items | High | Edge Case |
| TC-PL00401 | Happy Path: Edit Price List Successfully | Medium | Happy Path |
| TC-PL00402 | Negative: Invalid Date Input | Medium | Negative |
| TC-PL00501 | Happy Path - Duplicate Price List | High | Happy Path |
| TC-PL00502 | Negative - No Permission to Duplicate | Medium | Negative |
| TC-PL00503 | Edge Case - Duplicate with No Source Price List | Low | Edge Case |
| TC-PL00601 | Happy Path - Export Price List | High | Happy Path |
| TC-PL00602 | Negative - Invalid Export Permission | Medium | Negative |
| TC-PL00603 | Edge Case - Large Price List | Low | Edge Case |
| TC-PL00702 | Negative - No Delete Permission | High | Negative |
| TC-PL00703 | Negative - Click Cancel in Confirmation Dialog | Medium | Negative |
| TC-PL00704 | Edge Case - Delete Price List from Detail Page | Medium | Edge Case |
| TC-PL00801 | Happy Path - Mark Price List as Expired | Medium | Happy Path |
| TC-PL00803 | Edge Case - Multiple Price Lists | Low | Edge Case |
| TC-PL00804 | Negative - Price List Already Expired | Low | Negative |

---

## TC-PL00101 — Valid Login and Access to Price Lists Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated and has access to Vendor Management module

**Steps**

1. Navigate to /login
2. Fill 'Username' with valid credentials
3. Fill 'Password' with valid credentials
4. Click 'Login'
5. Click 'Vendor Management' in sidebar navigation
6. Click 'Price Lists' submenu item

**Expected**

System navigates to /vendor-management/price-list and displays the Price Lists page.

---

## TC-PL00102 — Search Filter with Invalid Keyword

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated and has access to Vendor Management module

**Steps**

1. Navigate to /vendor-management/price-list
2. Fill 'Search' input field with invalid keyword 'abcd'
3. Click 'Search' button

**Expected**

System displays an empty table and no price lists are filtered.

---

## TC-PL00103 — View Price List Details with No Data

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is authenticated and has access to Vendor Management module

**Steps**

1. Navigate to /vendor-management/price-list
2. Click on a price list name in the table

**Expected**

System displays an empty detail page for the selected price list.

---

## TC-PL00104 — User Without Access to Price Lists Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have access to Vendor Management module

**Steps**

1. Navigate to /vendor-management/price-list

**Expected**

System displays an error message indicating insufficient access rights.

---

## TC-PL00105 — Filter by Expired Status

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is authenticated; has access to Vendor Management module; system has expired price lists

**Steps**

1. Navigate to /vendor-management/price-list
2. Select 'Expired' from Status filter dropdown
3. Verify that only expired price lists are displayed in the table

**Expected**

System displays only expired price lists in the table.

---

## TC-PL00201 — Happy Path - Create Valid Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated; has permission to create price lists; vendor directory contains at least one vendor; product catalog contains at least one product

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Add New'
3. Fill 'Price List Number'
4. Select 'Vendor'
5. Select 'USD' as Currency
6. Fill 'Valid From' date
7. Click 'Add Item'
8. Select 'Product'
9. Enter 'MOQ' (optional)
10. Select 'Unit'
11. Fill 'Unit Price'
12. Enter 'Lead Time' (optional)
13. Fill 'Notes' (optional)
14. Click 'Save'
15. Verify 'Success Toast' message

**Expected**

Price list is created successfully and displayed in the list.

---

## TC-PL00202 — Negative - Missing Vendor

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission to create price lists; product catalog contains at least one product

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Add New'
3. Fill 'Price List Number'
4. Select 'USD' as Currency
5. Fill 'Valid From' date
6. Click 'Add Item'
7. Select 'Product'
8. Enter 'MOQ' (optional)
9. Select 'Unit'
10. Fill 'Unit Price'
11. Enter 'Lead Time' (optional)
12. Fill 'Notes' (optional)
13. Click 'Save'
14. Verify error message for missing 'Vendor'

**Expected**

Error message displayed indicating 'Vendor' is required.

---

## TC-PL00203 — Edge Case - Empty Unit Price

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission to create price lists; vendor directory has at least one vendor; product catalog has at least one product

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Add New'
3. Fill 'Price List Number'
4. Select 'Vendor'
5. Select 'USD' as Currency
6. Fill 'Valid From' date
7. Click 'Add Item'
8. Select 'Product'
9. Enter 'MOQ' (optional)
10. Select 'Unit'
11. Leave 'Unit Price' empty
12. Enter 'Lead Time' (optional)
13. Fill 'Notes' (optional)
14. Click 'Save'
15. Verify error message for missing 'Unit Price'

**Expected**

Error message displayed indicating 'Unit Price' is required.

---

## TC-PL00301 — Happy Path - Valid Price List Click

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated with valid session; a price list exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Click on price list name
3. Verify navigation to /vendor-management/price-list/[id]

**Expected**

System navigates to price list detail page and displays correct price list data.

---

## TC-PL00302 — Negative - No Price List Selected

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated with valid session

**Steps**

1. Navigate to /vendor-management/price-list
2. Attempt to click on non-existent price list name

**Expected**

System displays error message or navigates to error page.

---

## TC-PL00303 — Edge Case - User Without Edit Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User is authenticated with valid session and lacks edit permissions

**Steps**

1. Navigate to /vendor-management/price-list/[id]
2. Click on 'Edit' button

**Expected**

System prevents user from accessing edit functionality.

---

## TC-PL00304 — Negative - User Without View Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated with valid session but lacks view permissions

**Steps**

1. Navigate to /vendor-management/price-list/[id]
2. Verify system prevents access to view page

**Expected**

System denies user access or displays error message.

---

## TC-PL00305 — Edge Case - Empty Line Items

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User is authenticated; a price list with no line items exists

**Steps**

1. Navigate to /vendor-management/price-list/[id]
2. Verify absence of line items in table.

**Expected**

System displays appropriate message or placeholder for line items.

---

## TC-PL00401 — Happy Path: Edit Price List Successfully

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User authenticated with valid session; price list exists and is editable; user has edit permissions

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Edit' button on price list detail page
3. Fill in new valid from date
4. Fill in new valid to date
5. Fill in new notes
6. Update price for a line item
7. Click 'Save'

**Expected**

Price list is updated successfully, success message is displayed, and user returns to view mode.

---

## TC-PL00402 — Negative: Invalid Date Input

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Price list exists and is editable; user has edit permissions; user inputs invalid date format

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Edit' button on price list detail page
3. Fill in new valid from date with invalid format
4. Fill in new valid to date with invalid format
5. Click 'Save'

**Expected**

System displays error message for invalid date format, price list is not updated.

---

## TC-PL00501 — Happy Path - Duplicate Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated with valid session; a source price list exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Duplicate' from actions menu
3. Verify form pre-fills with copied values
4. Modify as needed (dates, prices, items)
5. Click 'Save'
6. Verify success message and new price list detail page

**Expected**

New price list is created with pre-filled data; user can see the new price list detail page.

---

## TC-PL00502 — Negative - No Permission to Duplicate

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User authenticated but lacks permission to duplicate price list

**Steps**

1. Navigate to /vendor-management/price-list
2. Attempt to click 'Duplicate' from actions menu
3. Verify error message or no 'Duplicate' option available

**Expected**

User sees appropriate error message or no 'Duplicate' option is available.

---

## TC-PL00503 — Edge Case - Duplicate with No Source Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User is authenticated with valid session but no source price list exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Attempt to click 'Duplicate' from actions menu
3. Verify error message or no 'Duplicate' option available

**Expected**

User sees appropriate error message or no 'Duplicate' option is available.

---

## TC-PL00601 — Happy Path - Export Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated; price list exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Export' button
3. Wait for export file generation
4. Click download link

**Expected**

Price list file is downloaded to user's device.

---

## TC-PL00602 — Negative - Invalid Export Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User authenticated but does not have permission to export

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Export' button
3. Verify 'Export' button is disabled or permission error message is displayed

**Expected**

User cannot export price list and receives appropriate permission error.

---

## TC-PL00603 — Edge Case - Large Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User is authenticated; price list contains a large number of entries

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Export' button
3. Monitor browser performance and memory usage

**Expected**

System handles large export requests without crashing or significant performance degradation.

---

## TC-PL00702 — Negative - No Delete Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User authenticated; price list exists; user does not have delete permission

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Delete' action on target price list

**Expected**

User receives permission denied message and cannot delete price list.

---

## TC-PL00703 — Negative - Click Cancel in Confirmation Dialog

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User authenticated; price list exists; user has delete permission

**Steps**

1. Navigate to /vendor-management/price-list
2. Click 'Delete' action on target price list
3. Click 'Cancel' in confirmation dialog

**Expected**

Price list is not deleted and remains in the list.

---

## TC-PL00704 — Edge Case - Delete Price List from Detail Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User authenticated; price list exists; user has delete permission

**Steps**

1. Navigate to /vendor-management/price-list
2. Click on target price list to open detail page
3. Click 'Delete' action on detail page

**Expected**

Price list is deleted successfully and system navigates back to list page.

---

## TC-PL00801 — Happy Path - Mark Price List as Expired

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is authenticated; a price list with non-expired status exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Click the 'Mark as Expired' action on the desired price list
3. Wait for the status to update
4. Verify the success toast: 'Price list marked as expired'

**Expected**

Price list status is updated to expired and success toast is displayed.

---

## TC-PL00803 — Edge Case - Multiple Price Lists

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Multiple price lists exist with at least one having a non-expired status

**Steps**

1. Navigate to /vendor-management/price-list
2. Select and click the 'Mark as Expired' action on each price list one by one
3. Wait for each status to update and verify success toasts for each action

**Expected**

Each selected price list's status is updated to expired and corresponding success toasts are displayed.

---

## TC-PL00804 — Negative - Price List Already Expired

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

A price list with expired status exists

**Steps**

1. Navigate to /vendor-management/price-list
2. Click the 'Mark as Expired' action on the expired price list
3. Verify no changes are made and no errors are shown

**Expected**

User cannot mark an already expired price list as expired and no changes are made.

---


<sub>Last regenerated: 2026-04-27 · git b169d98</sub>
