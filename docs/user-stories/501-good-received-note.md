# GRN — User Stories

_Generated from `tests/501-good-received-note.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** GRN
**Spec:** `tests/501-good-received-note.spec.ts`
**Default role:** Purchase
**Total test cases:** 76 (44 High / 24 Medium / 8 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-GRN00101 | View GRN List as Authenticated User | High | Happy Path |
| TC-GRN00102 | View GRN List with No GRNs | High | Negative |
| TC-GRN00103 | View GRN List with Insufficient Permissions | High | Negative |
| TC-GRN00104 | View GRN List with Large Number of GRNs | High | Edge Case |
| TC-GRN00201 | Filter by GRN Number | High | Happy Path |
| TC-GRN00202 | Clear Filters | High | Happy Path |
| TC-GRN00203 | Invalid Search Term | High | Negative |
| TC-GRN00204 | Search with Empty Term | High | Negative |
| TC-GRN00205 | Filter by Vendor Name and Invoice Number | High | Happy Path |
| TC-GRN00301 | Create GRN from Single PO - Happy Path | High | Happy Path |
| TC-GRN00302 | Create GRN without Create GRN Permission | High | Negative |
| TC-GRN00303 | Create GRN with No Vendor | High | Negative |
| TC-GRN00304 | Create GRN with Invalid PO | High | Negative |
| TC-GRN00305 | Create GRN with No Product in Catalog | High | Negative |
| TC-GRN00402 | Create GRN from Multiple POs - Invalid PO Selection | High | Negative |
| TC-GRN00403 | Create GRN from Multiple POs - No Permission | High | Negative |
| TC-GRN00404 | Create GRN from Multiple POs - Edge Case - Partial POs | High | Edge Case |
| TC-GRN00501 | Create Manual GRN with Valid Data | High | Happy Path |
| TC-GRN00502 | Create Manual GRN without Permission | High | Negative |
| TC-GRN00503 | Create Manual GRN with Missing Vendor | Medium | Negative |
| TC-GRN00504 | Create Manual GRN with Empty Product Details | High | Negative |
| TC-GRN00505 | Create Manual GRN with Large Number of Products | Medium | Edge Case |
| TC-GRN00601 | Edit GRN Header - Happy Path | High | Happy Path |
| TC-GRN00602 | Edit GRN Header - Invalid Currency | High | Negative |
| TC-GRN00603 | Edit GRN Header - No Permission | High | Negative |
| TC-GRN00604 | Edit GRN Header - Empty Fields | High | Negative |
| TC-GRN00605 | Edit GRN Header - Future Date | High | Edge Case |
| TC-GRN00701 | Happy Path - Add Line Item | High | Happy Path |
| TC-GRN00702 | Invalid Input - Empty Product Name | High | Negative |
| TC-GRN00703 | No Permission - User Tries to Add Item | High | Negative |
| TC-GRN00704 | Edge Case - Add Item with Maximum Quantity | Medium | Edge Case |
| TC-GRN00801 | Edit Existing Line Item - Happy Path | High | Happy Path |
| TC-GRN00802 | Edit Line Item - Invalid Price Input | High | Negative |
| TC-GRN00803 | Edit Line Item - No Permission | High | Negative |
| TC-GRN00804 | Edit Line Item - No Line Items Exist | High | Edge Case |
| TC-GRN00805 | Edit Line Item - GRN in RECEIVED Status | High | Edge Case |
| TC-GRN00901 | Delete a valid line item from a draft GRN | Medium | Happy Path |
| TC-GRN00902 | Attempt to delete a line item without edit permission | Medium | Negative |
| TC-GRN00903 | Try to delete a line item from a received GRN | Medium | Negative |
| TC-GRN00905 | Delete multiple line items at once from a draft GRN | Medium | Happy Path |
| TC-GRN01001 | Happy Path - Add Extra Costs | Medium | Happy Path |
| TC-GRN01002 | Negative - No Permission to Add Costs | Medium | Negative |
| TC-GRN01003 | Edge Case - Invalid Cost Amount | Medium | Edge Case |
| TC-GRN01101 | Happy Path - Commit GRN | High | Happy Path |
| TC-GRN01102 | Negative - No Permission to Commit GRN | High | Negative |
| TC-GRN01103 | Negative - Missing Storage Location | High | Negative |
| TC-GRN01104 | Edge Case - Partially Received GRN | High | Edge Case |
| TC-GRN01201 | Void GRN - Happy Path | Medium | Happy Path |
| TC-GRN01202 | Void GRN - No Permission | Medium | Negative |
| TC-GRN01203 | Void GRN - Committed GRN | Medium | Edge Case |
| TC-GRN01204 | Void GRN - PO Status Reverted | Medium | Edge Case |
| TC-GRN01301 | View Financial Summary - Happy Path | High | Happy Path |
| TC-GRN01302 | View Financial Summary - No Permission | High | Negative |
| TC-GRN01303 | View Financial Summary - Invalid GRN | Medium | Edge Case |
| TC-GRN01304 | View Financial Summary - Outdated Calculations | High | Edge Case |
| TC-GRN01401 | View stock movements for committed GRN | High | Happy Path |
| TC-GRN01402 | User without permission cannot access stock movements | High | Negative |
| TC-GRN01403 | No stock movements when GRN is not committed | High | Edge Case |
| TC-GRN01501 | Add valid comment | Medium | Happy Path |
| TC-GRN01502 | Attempt to add comment without permission | Medium | Negative |
| TC-GRN01503 | Add comment with empty text | Medium | Negative |
| TC-GRN01504 | Add comment with very long text | Medium | Edge Case |
| TC-GRN01505 | Add multiple comments | Medium | Happy Path |
| TC-GRN01601 | Happy Path - Upload Valid Attachments | High | Happy Path |
| TC-GRN01602 | Negative - Upload Without Edit Permission | Medium | Negative |
| TC-GRN01603 | Negative - Upload Invalid File Type | Medium | Negative |
| TC-GRN01604 | Edge Case - Upload Maximum Allowed Files | Low | Edge Case |
| TC-GRN01605 | Negative - No Files to Upload | Low | Negative |
| TC-GRN01701 | View Activity Log with Valid GRN | Medium | Happy Path |
| TC-GRN01702 | View Activity Log without Permission | Medium | Negative |
| TC-GRN01703 | View Activity Log for Non-Existent GRN | Low | Edge Case |
| TC-GRN01704 | View Activity Log with No Activity | Low | Edge Case |
| TC-GRN01801 | Performing a bulk approval action | Low | Happy Path |
| TC-GRN01802 | User attempts to perform bulk action without edit permission | Low | Negative |
| TC-GRN01803 | User attempts to perform bulk action on a GRN in RECEIVED status | Low | Negative |
| TC-GRN01804 | Perform bulk action with no line items selected | Low | Edge Case |

---

## TC-GRN00101 — View GRN List as Authenticated User

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated and has permission to view GRNs; at least one GRN exists in the system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Verify GRN list is displayed
3. Select a GRN to view details

**Expected**

GRN list is displayed with current data. User can select a GRN to view details.

---

## TC-GRN00102 — View GRN List with No GRNs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has permission to view GRNs; no GRNs exist in the system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Verify empty state message is displayed

**Expected**

Empty state message is displayed indicating no GRNs are available.

---

## TC-GRN00103 — View GRN List with Insufficient Permissions

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have permission to view GRNs; at least one GRN exists in the system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Verify access is denied or appropriate error message is displayed

**Expected**

Access is denied or appropriate error message is displayed.

---

## TC-GRN00104 — View GRN List with Large Number of GRNs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has permission to view GRNs; a large number of GRNs exist in the system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Verify pagination works as expected
3. Scroll through multiple pages of GRNs

**Expected**

Pagination works as expected. User can scroll through multiple pages of GRNs.

---

## TC-GRN00201 — Filter by GRN Number

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is on GRN List page and GRNs exist in system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Fill 'GRN number' with a valid GRN number
3. Verify filtered GRN list includes the entered GRN number

**Expected**

GRN list is filtered to show only the GRN with the entered number.

---

## TC-GRN00202 — Clear Filters

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has applied filters to GRN list

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Clear Filters' button
3. Verify the GRN list returns to full view

**Expected**

GRN list returns to its initial state with all records visible.

---

## TC-GRN00203 — Invalid Search Term

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is on GRN List page and GRNs exist in system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Fill 'Search' box with an invalid term
3. Wait 5 seconds
4. Verify no records are displayed

**Expected**

No GRNs are displayed and the list remains unfiltered.

---

## TC-GRN00204 — Search with Empty Term

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is on GRN List page and GRNs exist in system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Clear the 'Search' box
3. Verify the GRN list returns to full view

**Expected**

GRN list returns to its initial state with all records visible.

---

## TC-GRN00205 — Filter by Vendor Name and Invoice Number

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is on GRN List page and GRNs exist in system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Fill 'Vendor name' with a valid vendor name
3. Fill 'Invoice number' with a valid invoice number
4. Verify filtered GRN list includes the entered vendor and invoice

**Expected**

GRN list is filtered to show only GRNs matching the entered vendor name and invoice number.

---

## TC-GRN00301 — Create GRN from Single PO - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has 'Create GRN' permission; at least one vendor with open/partial POs exists; products in PO are in product catalog

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'New GRN'
3. Select a vendor
4. Select a PO
5. Fill received quantities
6. Click 'Submit'

**Expected**

GRN created with status RECEIVED, GRN number auto-generated, line items populated from PO, PO status updated (if fully received).

---

## TC-GRN00302 — Create GRN without Create GRN Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have 'Create GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'New GRN'

**Expected**

User is unable to create GRN and receives an error message stating 'Insufficient permission to create GRN'.

---

## TC-GRN00303 — Create GRN with No Vendor

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; no vendors with open/partial POs exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'New GRN'

**Expected**

User is unable to create GRN and receives an error message stating 'No vendor with open/partial POs found'.

---

## TC-GRN00304 — Create GRN with Invalid PO

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; at least one vendor with an invalid PO exists

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'New GRN'
3. Select a vendor
4. Select an invalid PO
5. Fill received quantities

**Expected**

User is unable to create GRN and receives an error message stating 'Invalid purchase order selected'.

---

## TC-GRN00305 — Create GRN with No Product in Catalog

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; vendor has open/partial POs; products in PO are not in product catalog

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'New GRN'
3. Select a vendor
4. Select a PO

**Expected**

User is unable to create GRN and receives an error message stating 'Products in PO not found in product catalog'.

---

## TC-GRN00402 — Create GRN from Multiple POs - Invalid PO Selection

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; vendor has multiple open/partial POs; POs are in different currencies

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create GRN'
3. Try to select POs from different vendors or in different currencies
4. Click 'Submit'

**Expected**

System displays error message prohibiting creation of GRN with POs from different vendors or currencies.

---

## TC-GRN00403 — Create GRN from Multiple POs - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have 'Create GRN' permission; vendor has multiple open/partial POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create GRN'
3. Attempt to select POs and create GRN

**Expected**

System displays permission denied error message preventing GRN creation.

---

## TC-GRN00404 — Create GRN from Multiple POs - Edge Case - Partial POs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has 'Create GRN' permission; vendor has multiple open/partial POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create GRN'
3. Select partially fulfilled POs
4. Click 'Submit'

**Expected**

GRN created with line items from partially fulfilled POs, each line item references its source PO, all source POs updated with GRN reference.

---

## TC-GRN00501 — Create Manual GRN with Valid Data

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has 'Create GRN' permission; vendor exists; products exist in catalog

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Create New GRN'
3. Fill vendor field
4. Fill product details
5. Verify GRN information
6. Click 'Save'

**Expected**

GRN is created without PO reference, status set to RECEIVED, no PO status updates triggered, activity log records manual creation.

---

## TC-GRN00502 — Create Manual GRN without Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have 'Create GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Attempt to click 'Create New GRN'

**Expected**

User is unable to click 'Create New GRN' or an appropriate error message is displayed.

---

## TC-GRN00503 — Create Manual GRN with Missing Vendor

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; vendor does not exist in system

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Create New GRN'
3. Attempt to fill vendor field
4. Verify error message

**Expected**

Error message indicates that the vendor does not exist in the system.

---

## TC-GRN00504 — Create Manual GRN with Empty Product Details

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'Create GRN' permission; vendor exists; products exist in catalog

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Create New GRN'
3. Fill vendor field
4. Fill product details with empty fields
5. Attempt to click 'Save'

**Expected**

Error message indicates that product details cannot be empty.

---

## TC-GRN00505 — Create Manual GRN with Large Number of Products

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has 'Create GRN' permission; vendor exists; products exist in catalog

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Create New GRN'
3. Fill vendor field
4. Fill product details with a large number of entries
5. Verify that system handles the large number of products without crashing

**Expected**

GRN is created without PO reference, status set to RECEIVED, no PO status updates triggered, activity log records manual creation, and system handles large number of products without issues.

---

## TC-GRN00601 — Edit GRN Header - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; user has edit permission; GRN not yet committed

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Edit' next to the GRN
3. Fill 'Received Date' with new date
4. Fill 'Invoice Number' with new number
5. Fill 'Currency' with new currency
6. Click 'Save'

**Expected**

GRN header updated with new information, activity log records changes, financial calculations updated if currency changed.

---

## TC-GRN00602 — Edit GRN Header - Invalid Currency

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; user has edit permission; GRN not yet committed; incorrect currency selected

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Edit' next to the GRN
3. Select invalid currency from dropdown
4. Click 'Save'

**Expected**

System displays error message regarding invalid currency, GRN header remains unchanged.

---

## TC-GRN00603 — Edit GRN Header - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; user does not have edit permission; GRN not yet committed

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Edit' next to the GRN
3. Attempt to modify 'Received Date'

**Expected**

System displays error message indicating insufficient permission, GRN header remains unchanged.

---

## TC-GRN00604 — Edit GRN Header - Empty Fields

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; user has edit permission; GRN not yet committed

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Edit' next to the GRN
3. Leave all fields blank
4. Click 'Save'

**Expected**

System displays error messages for all required fields, GRN header remains unchanged.

---

## TC-GRN00605 — Edit GRN Header - Future Date

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists in DRAFT status; user has edit permission; GRN not yet committed

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Edit' next to the GRN
3. Fill 'Received Date' with a future date
4. Click 'Save'

**Expected**

System displays error message regarding invalid date, GRN header remains unchanged.

---

## TC-GRN00701 — Happy Path - Add Line Item

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; user has edit permission; product catalog accessible

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Add Item' button
4. Fill in product name, quantity, and price
5. Click 'Save'

**Expected**

New line item added to GRN, financial totals recalculated, activity log updated.

---

## TC-GRN00702 — Invalid Input - Empty Product Name

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; user has edit permission; product catalog accessible

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Add Item' button
4. Leave product name field empty
5. Fill in quantity and price
6. Click 'Save'

**Expected**

Error message displayed for empty product name, no line item added.

---

## TC-GRN00703 — No Permission - User Tries to Add Item

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; user does not have edit permission; product catalog accessible

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Add Item' button
4. Fill in product name, quantity, and price
5. Click 'Save'

**Expected**

User receives permission denied error, unable to add line item.

---

## TC-GRN00704 — Edge Case - Add Item with Maximum Quantity

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN exists in DRAFT status; user has edit permission; product catalog accessible; maximum quantity set for product

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Add Item' button
4. Fill in product name, maximum quantity, and price
5. Click 'Save'

**Expected**

Maximum quantity enforced, financial totals recalculated, activity log updated.

---

## TC-GRN00801 — Edit Existing Line Item - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on GRN number in list
3. Navigate to 'Items' tab
4. Select line item to edit
5. Fill in new quantity, price, location
6. Click 'Save'

**Expected**

Line item updated, financial totals recalculated, activity log records changes.

---

## TC-GRN00802 — Edit Line Item - Invalid Price Input

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on GRN number in list
3. Navigate to 'Items' tab
4. Select line item to edit
5. Enter an invalid price (non-numeric value)
6. Click 'Save'

**Expected**

System displays error message and does not update line item.

---

## TC-GRN00803 — Edit Line Item - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; line items exist; user does not have edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on GRN number in list
3. Navigate to 'Items' tab
4. Attempt to select line item to edit

**Expected**

User is denied access and cannot edit line item.

---

## TC-GRN00804 — Edit Line Item - No Line Items Exist

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists in DRAFT status; line items do not exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on GRN number in list
3. Navigate to 'Items' tab

**Expected**

System displays message indicating no line items to edit.

---

## TC-GRN00805 — Edit Line Item - GRN in RECEIVED Status

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists in RECEIVED status; line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on GRN number in list
3. Navigate to 'Items' tab

**Expected**

System displays message indicating GRN cannot be edited.

---

## TC-GRN00901 — Delete a valid line item from a draft GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on 'Items' tab
3. Click 'Delete' icon next to a line item
4. Confirm deletion dialog

**Expected**

Line item is removed, line numbers resequenced, financial totals recalculated, activity log updated.

---

## TC-GRN00902 — Attempt to delete a line item without edit permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; line items exist; user does not have edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on 'Items' tab
3. Click 'Delete' icon next to a line item

**Expected**

User is presented with an error message indicating insufficient permissions.

---

## TC-GRN00903 — Try to delete a line item from a received GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on 'Items' tab
3. Click 'Delete' icon next to a line item

**Expected**

User is presented with a warning that the GRN is in a non-editable state and cannot be modified.

---

## TC-GRN00905 — Delete multiple line items at once from a draft GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on 'Items' tab
3. Select multiple line items
4. Click 'Delete' icon

**Expected**

Selected line items are removed, line numbers resequenced, financial totals recalculated, activity log updated.

---

## TC-GRN01001 — Happy Path - Add Extra Costs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists (not VOID); at least one line item exists; user has permission to add costs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Add Extra Costs'
3. Select 'Freight'
4. Enter amount
5. Select 'Handling'
6. Enter amount
7. Select 'Customs'
8. Enter amount
9. Click 'Save'

**Expected**

Extra cost entries added to GRN, costs distributed to line items, line item totals updated, GRN total increased by extra costs, activity log records.

---

## TC-GRN01002 — Negative - No Permission to Add Costs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists (not VOID); at least one line item exists; user does not have permission to add costs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Add Extra Costs'

**Expected**

System displays error message indicating insufficient permissions, 'Add Extra Costs' button remains disabled.

---

## TC-GRN01003 — Edge Case - Invalid Cost Amount

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN exists (not VOID); at least one line item exists; user has permission to add costs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Add Extra Costs'
3. Select 'Freight'
4. Enter negative amount
5. Select 'Handling'
6. Enter zero amount
7. Click 'Save'

**Expected**

System displays error message for invalid amount, freight cost not added, handling cost not added, no changes made to GRN or line items.

---

## TC-GRN01101 — Happy Path - Commit GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists in RECEIVED status; user has 'Commit GRN' permission; all line items have storage locations; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Click 'Commit GRN'
4. Verify GRN status changed to COMMITTED
5. Verify stock movements created for all line items
6. Verify inventory quantities updated

**Expected**

GRN status changed to COMMITTED, stock movements created, inventory quantities updated.

---

## TC-GRN01102 — Negative - No Permission to Commit GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; user does not have 'Commit GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Attempt to click 'Commit GRN'
4. Verify an error message appears

**Expected**

Error message displayed preventing GRN commitment.

---

## TC-GRN01103 — Negative - Missing Storage Location

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; user has 'Commit GRN' permission; one line item is missing storage location; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Attempt to click 'Commit GRN'
4. Verify an error message appears indicating missing storage location

**Expected**

Error message displayed indicating missing storage location.

---

## TC-GRN01104 — Edge Case - Partially Received GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists with some line items received and others not; user has 'Commit GRN' permission; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN with partially received items
3. Attempt to click 'Commit GRN'
4. Verify an error message appears

**Expected**

Error message displayed preventing full GRN commitment.

---

## TC-GRN01201 — Void GRN - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A GRN exists in RECEIVED status and the user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the status changed to VOID

**Expected**

The GRN status is updated to VOID.

---

## TC-GRN01202 — Void GRN - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A GRN exists in COMMITTED status and the user does not have 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Attempt to click 'Void' button
4. Verify an error message is displayed

**Expected**

The user is unable to void the GRN and receives an error message.

---

## TC-GRN01203 — Void GRN - Committed GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A GRN exists in COMMITTED status and the user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the status is reverted to RECEIVED
5. Verify the stock movements are reversed
6. Verify the Journal Voucher (JV) is reversed

**Expected**

The GRN status is updated to RECEIVED, stock movements are reversed, and the JV is reversed.

---

## TC-GRN01204 — Void GRN - PO Status Reverted

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A GRN exists in COMMITTED status and the PO status is pending; user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the PO status is reverted

**Expected**

The PO status is reverted.

---

## TC-GRN01301 — View Financial Summary - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists and financial calculations are complete

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify financial totals and breakdown displayed

**Expected**

User sees complete financial breakdown with tax details and accounting preview.

---

## TC-GRN01302 — View Financial Summary - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists and financial calculations are complete; user does not have view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify access is denied or feature is greyed out

**Expected**

User is unable to view financial summary and receives appropriate access denied message.

---

## TC-GRN01303 — View Financial Summary - Invalid GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Invalid or non-existent GRN

**Steps**

1. Navigate to GRN detail page
2. Enter invalid GRN in search
3. Click 'Financial Summary' tab
4. Verify error message or empty state

**Expected**

System displays error message or shows empty state indicating no financial summary available.

---

## TC-GRN01304 — View Financial Summary - Outdated Calculations

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists but financial calculations are not yet complete

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify message or state indicating calculations are pending

**Expected**

System displays message or state indicating financial summary is not available until calculations are complete.

---

## TC-GRN01401 — View stock movements for committed GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A GRN exists in COMMITTED status with stock movements created during commit

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN detail page (status = COMMITTED)
3. Click on 'Stock Movements' tab
4. Verify stock movements are displayed correctly

**Expected**

Stock movements are correctly displayed, showing the impact on inventory.

---

## TC-GRN01402 — User without permission cannot access stock movements

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to view stock movements

**Steps**

1. Log in as a user without permission to view stock movements
2. Navigate to /procurement/goods-receive-note
3. Try to click on the GRN detail page (status = COMMITTED)
4. Try to click on 'Stock Movements' tab
5. Verify access is denied

**Expected**

System denies access to stock movements and displays appropriate error message.

---

## TC-GRN01403 — No stock movements when GRN is not committed

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

A GRN exists but is not in COMMITTED status

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN detail page (status != COMMITTED)
3. Click on 'Stock Movements' tab
4. Verify no stock movements are displayed

**Expected**

No stock movements are displayed, and user is informed that there are none.

---

## TC-GRN01501 — Add valid comment

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with valid text
4. Click 'Add Comment'

**Expected**

Comment is added to GRN and visible to all users with access, activity log records comment addition.

---

## TC-GRN01502 — Attempt to add comment without permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists and user has no view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab

**Expected**

User cannot see or add comments, system denies access.

---

## TC-GRN01503 — Add comment with empty text

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with no text
4. Click 'Add Comment'

**Expected**

System displays error message and does not add empty comment.

---

## TC-GRN01504 — Add comment with very long text

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with extremely long text (exceeds maximum allowed length)
4. Click 'Add Comment'

**Expected**

System displays error message and does not add comment with long text.

---

## TC-GRN01505 — Add multiple comments

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with valid text
4. Click 'Add Comment'
5. Repeat steps 3-4 to add multiple comments

**Expected**

Multiple comments are added to GRN and visible to all users with access, activity log records each comment addition.

---

## TC-GRN01601 — Happy Path - Upload Valid Attachments

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists; user has edit permission; valid documents exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload valid documents
5. Click 'Submit'

**Expected**

Attachments are uploaded and linked to GRN, files are accessible to authorized users, activity log records upload.

---

## TC-GRN01602 — Negative - Upload Without Edit Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists; user does not have edit permission; valid documents exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Attempt to select and upload documents

**Expected**

User cannot upload documents, error message displayed.

---

## TC-GRN01603 — Negative - Upload Invalid File Type

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists; user has edit permission; invalid document type exists (e.g., .exe)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload invalid file type
5. Click 'Submit'

**Expected**

Upload fails, error message displayed.

---

## TC-GRN01604 — Edge Case - Upload Maximum Allowed Files

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists; user has edit permission; maximum allowed number of files exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload maximum allowed number of files
5. Click 'Submit'

**Expected**

Maximum allowed files are uploaded, no additional files can be added.

---

## TC-GRN01605 — Negative - No Files to Upload

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists; user has edit permission; no files exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Attempt to upload files

**Expected**

Upload fails, no files are uploaded.

---

## TC-GRN01701 — View Activity Log with Valid GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists in any status and user has view permission (audit access)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN that exists
3. Click on 'Activity Log' tab
4. Verify all activity log entries are displayed

**Expected**

User sees complete activity log of the GRN.

---

## TC-GRN01702 — View Activity Log without Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists in any status but user does not have view permission (audit access)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN that exists
3. Navigate to 'Activity Log' tab
4. Verify the 'Activity Log' tab is disabled or not accessible

**Expected**

User cannot access the 'Activity Log' tab.

---

## TC-GRN01703 — View Activity Log for Non-Existent GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN does not exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a non-existent GRN
3. Navigate to 'Activity Log' tab
4. Verify no activity log entries are displayed

**Expected**

User sees an empty activity log.

---

## TC-GRN01704 — View Activity Log with No Activity

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists but has no activity logs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN with no activity logs
3. Navigate to 'Activity Log' tab
4. Verify the 'Activity Log' tab displays a message indicating no activity

**Expected**

User sees a message indicating no activity logs.

---

## TC-GRN01801 — Performing a bulk approval action

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Click 'Approve' button
5. Confirm approval

**Expected**

Selected items are updated to APPROVED status, activity log records the bulk approval action.

---

## TC-GRN01802 — User attempts to perform bulk action without edit permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user does not have edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Try to click 'Approve' button

**Expected**

User receives an error message indicating insufficient permissions, no bulk action is performed.

---

## TC-GRN01803 — User attempts to perform bulk action on a GRN in RECEIVED status

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Try to click 'Approve' button

**Expected**

User receives an error message indicating that the GRN cannot be edited in this state, no bulk action is performed.

---

## TC-GRN01804 — Perform bulk action with no line items selected

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Approve' button without selecting any line items

**Expected**

User receives a warning message to select at least one line item before performing a bulk action, no bulk action is performed.

---


<sub>Last regenerated: 2026-05-06 · git 4322f02</sub>
