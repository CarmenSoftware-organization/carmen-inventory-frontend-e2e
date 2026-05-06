# Purchase Order — User Stories

_Generated from `tests/401-purchase-order.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Purchase Order
**Spec:** `tests/401-purchase-order.spec.ts`
**Default role:** Purchase
**Total test cases:** 60 (11 High / 41 Medium / 8 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PO00101 | Happy Path - Create PO from Approved PR | High | Happy Path |
| TC-PO00102 | Negative - No Permission to Create PO | Medium | Negative |
| TC-PO00103 | Edge Case - No Approved PRs Exist | Low | Edge Case |
| TC-PO00104 | Negative - Invalid Vendor Assignment | Medium | Negative |
| TC-PO00201 | Create a Purchase Order with Valid Data | High | Happy Path |
| TC-PO00202 | Attempt to Create PO without Permission | High | Negative |
| TC-PO00203 | Select a Non-Existent Vendor | Medium | Negative |
| TC-PO00204 | Leave Required Fields Blank | Medium | Negative |
| TC-PO00205 | Create PO with Maximum Number of Items | Low | Edge Case |
| TC-PO00301 | Happy Path - Send Purchase Order to Vendor | High | Happy Path |
| TC-PO00302 | Negative - Missing Vendor Email | Medium | Negative |
| TC-PO00303 | Negative - Insufficient Budget | Medium | Negative |
| TC-PO00304 | Edge Case - Purchase Order in 'Rejected' Status | Low | Edge Case |
| TC-PO00401 | Happy Path - Change Order | Medium | Happy Path |
| TC-PO00402 | Negative - No Permission | Medium | Negative |
| TC-PO00403 | Negative - Invalid Input | Medium | Negative |
| TC-PO00404 | Edge Case - Change Order for Sent Status | Medium | Edge Case |
| TC-PO00501 | Happy Path - Cancel Active Purchase Order | Medium | Happy Path |
| TC-PO00502 | Negative - Attempt to Cancel Completed Purchase Order | Medium | Negative |
| TC-PO00503 | Edge Case - Cancel Purchase Order with Shipped Goods | Medium | Edge Case |
| TC-PO00504 | Negative - Cancel Purchase Order without Authentication | Medium | Negative |
| TC-PO00601 | View Purchase Order Dashboard as Purchasing Staff | Medium | Happy Path |
| TC-PO00602 | Verify Access Denial for Purchase Order Dashboard | High | Negative |
| TC-PO00603 | Check Dashboard with No Purchase Orders | Medium | Edge Case |
| TC-PO00604 | Verify Dashboard with Large Number of Orders | Medium | Edge Case |
| TC-PO02001 | Happy Path - Download QR Code for Mobile Receiving | High | Happy Path |
| TC-PO02003 | Negative - QR Code Not Generated | Medium | Negative |
| TC-PO02004 | Edge Case - PO Detail Page Reload | Low | Edge Case |
| TC-PO10101 _(skipped)_ | Happy Path - Valid PO Creation | Medium | Happy Path |
| TC-PO10102 _(skipped)_ | Negative Case - No Sequence Table | Medium | Negative |
| TC-PO10103 _(skipped)_ | Edge Case - Month Transition | Low | Edge Case |
| TC-PO10104 _(skipped)_ | Negative Case - Insufficient Permissions | Medium | Negative |
| TC-PO10201 _(skipped)_ | Calculate Subtotal with Valid Input | Medium | Happy Path |
| TC-PO10202 _(skipped)_ | Apply Percentage Discount | Medium | Happy Path |
| TC-PO10203 _(skipped)_ | Apply Fixed Amount Discount | Medium | Happy Path |
| TC-PO10204 _(skipped)_ | No Discount Applied | Medium | Negative |
| TC-PO10205 _(skipped)_ | Negative Quantity Entered | Low | Edge Case |
| TC-PO10301 _(skipped)_ | Happy Path - Valid PO with Existing Budget | Medium | Happy Path |
| TC-PO10302 _(skipped)_ | Negative - Invalid PO Total | Medium | Negative |
| TC-PO10303 _(skipped)_ | Edge Case - No Budget Accounts Specified | Medium | Edge Case |
| TC-PO10401 _(skipped)_ | Happy Path - PO Status Updated Successfully | Medium | Happy Path |
| TC-PO10402 _(skipped)_ | Negative - No PO Line Items in GRN | Medium | Negative |
| TC-PO10403 _(skipped)_ | Edge Case - Multiple GRNs for Same PO Line Item | Medium | Edge Case |
| TC-PO10501 _(skipped)_ | Send automatic delivery reminder for valid purchase orders | Medium | Happy Path |
| TC-PO10502 _(skipped)_ | Scheduled job fails to run due to invalid input | Medium | Negative |
| TC-PO10503 _(skipped)_ | No purchase orders to remind due to no valid POs | Medium | Edge Case |
| TC-PO10504 _(skipped)_ | Scheduled job fails due to non-operational email system | Medium | Negative |
| TC-PO10505 _(skipped)_ | No reminders sent for POs with GR | Medium | Edge Case |
| TC-PO20101 _(skipped)_ | PO Approved - Encumbrance Created | High | Happy Path |
| TC-PO20102 _(skipped)_ | PO Amount Modified - Encumbrance Adjusted | High | Happy Path |
| TC-PO20103 _(skipped)_ | PO Cancelled - Encumbrance Released | High | Happy Path |
| TC-PO20104 _(skipped)_ | Invalid PO Event - No Action Taken | Medium | Negative |
| TC-PO20105 _(skipped)_ | GRN Created Without PO - No Encumbrance Conversion | Medium | Edge Case |
| TC-PO20201 _(skipped)_ | Happy Path - Valid Vendor Selection and Information Retrieval | High | Happy Path |
| TC-PO20202 _(skipped)_ | Negative Case - Vendor Not Found | Medium | Negative |
| TC-PO20203 _(skipped)_ | Edge Case - Vendor Name Format | Low | Edge Case |
| TC-PO30101 _(skipped)_ | Happy Path - Daily Purchase Order Status Cleanup | High | Happy Path |
| TC-PO30102 _(skipped)_ | Negative Case - Database Unavailable | Medium | Negative |
| TC-PO30103 _(skipped)_ | Negative Case - No Purchase Orders Meet Criteria | Medium | Negative |
| TC-PO30104 _(skipped)_ | Edge Case - Maintenance Window Active | Low | Edge Case |

---

## TC-PO00101 — Happy Path - Create PO from Approved PR

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated as Purchasing Staff/Manager; has permission to create POs; one or more approved PRs exist; budget is available

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'New PO' dropdown button
3. Select 'Create from Purchase Requests'
4. Choose an approved PR
5. Fill in PO details
6. Click 'Save PO'

**Expected**

Purchase Order is created successfully and linked to the selected Purchase Request.

---

## TC-PO00102 — Negative - No Permission to Create PO

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have permission to create POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'New PO' dropdown button
3. Select 'Create from Purchase Requests'

**Expected**

System displays an error message indicating insufficient permissions.

---

## TC-PO00103 — Edge Case - No Approved PRs Exist

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User is authenticated and has permission to create POs, but no approved PRs exist

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'New PO' dropdown button
3. Select 'Create from Purchase Requests'

**Expected**

System displays a message indicating no available PRs to create a PO from.

---

## TC-PO00104 — Negative - Invalid Vendor Assignment

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission to create POs; PRs exist but vendors are not assigned

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'New PO' dropdown button
3. Select 'Create from Purchase Requests'
4. Attempt to choose an unassigned PR

**Expected**

System displays an error message indicating that the selected PR does not have a vendor assigned.

---

## TC-PO00201 — Create a Purchase Order with Valid Data

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has permission to create POs and POs without PR; vendor exists in system

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create Purchase Order' then 'Manual PO' button
3. Select vendor from dropdown
4. Fill in purchase order details
5. Click 'Submit'

**Expected**

Purchase order is created successfully and displayed in the list.

---

## TC-PO00202 — Attempt to Create PO without Permission

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have permission to create POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create Purchase Order' then 'Manual PO' button

**Expected**

System displays an error message indicating insufficient permissions.

---

## TC-PO00203 — Select a Non-Existent Vendor

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission to create POs; vendor does not exist in the system

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create Purchase Order' then 'Manual PO' button
3. Select a non-existent vendor from the dropdown

**Expected**

System displays an error message indicating the selected vendor does not exist.

---

## TC-PO00204 — Leave Required Fields Blank

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission to create POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create Purchase Order' then 'Manual PO' button
3. Select a vendor from the dropdown
4. Leave required fields blank
5. Click 'Submit'

**Expected**

System displays an error message indicating required fields are not filled.

---

## TC-PO00205 — Create PO with Maximum Number of Items

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has permission to create POs; system has a maximum limit for PO items

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Create Purchase Order' then 'Manual PO' button
3. Select a vendor from the dropdown
4. Fill in the maximum number of items allowed
5. Click 'Submit'

**Expected**

Purchase order is created successfully with the maximum number of items.

---

## TC-PO00301 — Happy Path - Send Purchase Order to Vendor

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User authorized; PO is in draft status; pre-send validations pass; vendor email is on file; budget is available

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the 'Send to Vendor' button
3. Verify the system performs pre-send validation
4. Click 'Send'

**Expected**

Purchase order is sent to the vendor and status is updated to 'Sent'.

---

## TC-PO00302 — Negative - Missing Vendor Email

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

PO is in draft status; pre-send validations pass; no vendor email on file

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the 'Send to Vendor' button
3. Verify the system prompts the user to add a vendor email

**Expected**

System prevents sending the purchase order and displays an error message.

---

## TC-PO00303 — Negative - Insufficient Budget

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

PO is in draft status; pre-send validations pass; vendor email is on file; budget is insufficient

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the 'Send to Vendor' button
3. Verify the system prompts the user about insufficient budget

**Expected**

System prevents sending the purchase order and displays a warning message.

---

## TC-PO00304 — Edge Case - Purchase Order in 'Rejected' Status

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

PO is in rejected status; pre-send validations pass; vendor email is on file; budget is available

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on a purchase order with status 'Rejected'
3. Click on the 'Send to Vendor' button
4. Verify the system prevents sending the purchase order and displays an error message

**Expected**

System prevents sending the purchase order and displays an error message.

---

## TC-PO00401 — Happy Path - Change Order

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has permission to modify POs; a PO exists in Approved status

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Request Change Order' button
3. Fill in the reason for the change
4. Edit fields as necessary
5. Click 'Submit Change Order'

**Expected**

Change order request is submitted successfully, and a notification is displayed confirming the submission.

---

## TC-PO00402 — Negative - No Permission

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have permission to modify POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Request Change Order' button
3. Verify an error message is displayed

**Expected**

User is shown an error message indicating they do not have permission to make changes.

---

## TC-PO00403 — Negative - Invalid Input

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission; PO in Approved status

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Request Change Order' button
3. Fill in fields with invalid data (e.g., negative quantity, future delivery date)
4. Click 'Submit Change Order'

**Expected**

System displays validation errors for the invalid fields, preventing submission of the change order request.

---

## TC-PO00404 — Edge Case - Change Order for Sent Status

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission; PO in Sent status

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Request Change Order' button
3. Verify that the change order request cannot be submitted for a Sent status order

**Expected**

System displays a message indicating that change orders cannot be submitted for Sent status purchase orders.

---

## TC-PO00501 — Happy Path - Cancel Active Purchase Order

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has permission to cancel POs; role is Purchasing Staff or Manager

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the active purchase order
3. Click 'Cancel Purchase Order' button
4. Select valid cancellation reason
5. Confirm cancellation

**Expected**

Purchase order is marked as cancelled and system updates the status accordingly.

---

## TC-PO00502 — Negative - Attempt to Cancel Completed Purchase Order

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission; PO is in completed status

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the completed purchase order
3. Click 'Cancel Purchase Order' button

**Expected**

System displays an error message stating that the PO cannot be cancelled since it is already completed.

---

## TC-PO00503 — Edge Case - Cancel Purchase Order with Shipped Goods

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission; PO has shipped goods

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on the purchase order with shipped goods
3. Click 'Cancel Purchase Order' button
4. Select valid cancellation reason

**Expected**

System prompts user to arrange return or exchange before allowing cancellation.

---

## TC-PO00504 — Negative - Cancel Purchase Order without Authentication

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is not authenticated

**Steps**

1. Navigate to /procurement/purchase-order
2. Attempt to click 'Cancel Purchase Order' button

**Expected**

System redirects to login page or displays an error message requiring user to log in first.

---

## TC-PO00601 — View Purchase Order Dashboard as Purchasing Staff

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has permission to view POs; POs exist in the system

**Steps**

1. Navigate to /procurement/purchase-order
2. Verify summary cards are displayed with counts by status
3. Verify recent purchase orders list is populated
4. Verify orders requiring attention are highlighted
5. Verify budget utilization chart is visible

**Expected**

Purchase Order dashboard is fully displayed with all elements verified.

---

## TC-PO00602 — Verify Access Denial for Purchase Order Dashboard

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to view POs

**Steps**

1. Navigate to /procurement/purchase-order
2. Verify no Purchase Order dashboard elements are displayed

**Expected**

User is denied access to Purchase Order dashboard.

---

## TC-PO00603 — Check Dashboard with No Purchase Orders

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission to view POs; no POs exist in the system

**Steps**

1. Navigate to /procurement/purchase-order
2. Verify summary cards show zero counts
3. Verify recent purchase orders list is empty
4. Verify no orders requiring attention are displayed
5. Verify budget utilization chart is blank

**Expected**

Dashboard elements reflect the absence of purchase orders.

---

## TC-PO00604 — Verify Dashboard with Large Number of Orders

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission to view POs; many POs exist in the system

**Steps**

1. Navigate to /procurement/purchase-order
2. Verify summary cards display accurate counts
3. Verify recent purchase orders list is populated
4. Verify orders requiring attention are highlighted
5. Verify budget utilization chart reflects utilization

**Expected**

Dashboard elements handle a large number of purchase orders without issues.

---

## TC-PO02001 — Happy Path - Download QR Code for Mobile Receiving

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has permission to view POs; PO exists with PO number; QR code auto-generated

**Steps**

1. Navigate to /procurement/purchase-order/<orderNumber>
2. Click on QRCodeSection component
3. Verify QR code image is displayed
4. Click on QR code image
5. Verify QR code is downloaded to user device

**Expected**

QR code is successfully downloaded to user device.

---

## TC-PO02003 — Negative - QR Code Not Generated

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has permission; PO does not exist or has no PO number; QR code not auto-generated

**Steps**

1. Navigate to /procurement/purchase-order/<orderNumber>
2. Verify QR code section is not displayed

**Expected**

QR code section is not displayed.

---

## TC-PO02004 — Edge Case - PO Detail Page Reload

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has permission; PO exists with PO number; QR code auto-generated

**Steps**

1. Navigate to /procurement/purchase-order/<orderNumber>
2. Reload the page
3. Verify QR code section is still displayed and QR code is still available for download

**Expected**

QR code section is still displayed and QR code is still available for download.

---

## TC-PO10101 — Happy Path - Valid PO Creation _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Sequence table is available and initialized

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Verify current date is displayed
4. Click 'Generate PO Number'
5. Verify PO number format is PO-2401-000123

**Expected**

Correct PO number is generated and displayed.

---

## TC-PO10102 — Negative Case - No Sequence Table _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Sequence table is not available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Click 'Generate PO Number'
4. Verify error message 'Sequence table not initialized'

**Expected**

Error message is displayed indicating sequence table is not initialized.

---

## TC-PO10103 — Edge Case - Month Transition _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Sequence table is available and initialized

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Verify PO number format is PO-2401-000123 (January)
4. Wait for the transition to February
5. Click 'Generate PO Number'
6. Verify PO number format is PO-2402-000001 (February)

**Expected**

Correct PO number is generated with the new month format.

---

## TC-PO10104 — Negative Case - Insufficient Permissions _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have permission to create POs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Click 'Generate PO Number'
4. Verify error message 'Insufficient permissions to create purchase order'

**Expected**

Error message is displayed indicating insufficient permissions.

---

## TC-PO10201 — Calculate Subtotal with Valid Input _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PO exists with line items having quantity and unit price

**Steps**

1. Navigate to /purchase-order
2. Fill line item quantities and unit prices
3. Click 'Calculate Totals'

**Expected**

Subtotal is calculated correctly as sum of (line_item.quantity × line_item.unit_price).

---

## TC-PO10202 — Apply Percentage Discount _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PO exists with line items; percentage discount is defined

**Steps**

1. Navigate to /purchase-order
2. Click 'Apply Discount'
3. Select 'Percentage'
4. Enter discount percentage
5. Click 'Apply'

**Expected**

Subtotal is recalculated with applied discount percentage.

---

## TC-PO10203 — Apply Fixed Amount Discount _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PO exists with line items; fixed amount discount is defined

**Steps**

1. Navigate to /purchase-order
2. Click 'Apply Discount'
3. Select 'Fixed Amount'
4. Enter discount amount
5. Click 'Apply'

**Expected**

Subtotal is recalculated with applied discount amount.

---

## TC-PO10204 — No Discount Applied _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A PO exists with line items; no discount is applied

**Steps**

1. Navigate to /purchase-order
2. Click 'Apply Discount'
3. No discount type selected
4. Click 'Apply'

**Expected**

Subtotal is calculated without any discount applied.

---

## TC-PO10205 — Negative Quantity Entered _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

A PO exists with at least one line item; negative quantity is entered

**Steps**

1. Navigate to /purchase-order
2. Enter negative quantity in a line item
3. Click 'Calculate Totals'

**Expected**

Error message displayed indicating invalid input for quantity.

---

## TC-PO10301 — Happy Path - Valid PO with Existing Budget _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PO exists with a grand total and associated budget accounts

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Approve' button
3. System retrieves budget allocation for PO
4. System queries budget system for each budget account
5. Verify PO status change to 'Budget Approved'

**Expected**

PO status changes to 'Budget Approved' with no error messages.

---

## TC-PO10302 — Negative - Invalid PO Total _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A PO exists with a grand total that exceeds the budget allocation

**Steps**

1. Navigate to /procurement/purchase-order
2. Modify PO total to exceed budget allocation
3. Click 'Approve' button
4. Verify system error message indicating insufficient budget

**Expected**

System displays an error message stating the PO cannot be approved due to insufficient budget.

---

## TC-PO10303 — Edge Case - No Budget Accounts Specified _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PO exists without any budget accounts specified

**Steps**

1. Navigate to /procurement/purchase-order
2. Approve the purchase order
3. Verify system prompts for budget account specification

**Expected**

System prompts the user to specify budget accounts before the PO can be approved.

---

## TC-PO10401 — Happy Path - PO Status Updated Successfully _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PO exists in Sent or Acknowledged status; a GRN is created referencing PO line items with approved status

**Steps**

1. Navigate to /inventory/grn
2. Click 'Create New GRN'
3. Fill in the GRN details and select referenced PO line items
4. Click 'Save and Approve'

**Expected**

The PO status is updated to Received in the purchase order details.

---

## TC-PO10402 — Negative - No PO Line Items in GRN _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A PO exists in Sent or Acknowledged status but the GRN does not reference any PO line items

**Steps**

1. Navigate to /inventory/grn
2. Click 'Create New GRN'
3. Fill in the GRN details without selecting any PO line items
4. Attempt to Save and Approve

**Expected**

The system prevents saving and approving the GRN and displays an error message.

---

## TC-PO10403 — Edge Case - Multiple GRNs for Same PO Line Item _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple GRNs are created for the same PO line item with varying quantities

**Steps**

1. Navigate to /inventory/grn
2. Click 'View GRN Details'
3. Verify the total received quantity matches the PO line item quantity

**Expected**

The total received quantity is accurately calculated and displayed.

---

## TC-PO10501 — Send automatic delivery reminder for valid purchase orders _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Today is 2023-10-01; POs with statuses 'Sent' or 'Acknowledged' and expected delivery dates within 3 days from today exist

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Run Scheduled Job'
3. Verify email notifications are sent for valid purchase orders

**Expected**

Email reminders are sent for POs with statuses 'Sent' or 'Acknowledged' and expected delivery dates within 3 days from today, but no reminders are sent for POs with GR already.

---

## TC-PO10502 — Scheduled job fails to run due to invalid input _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Today is 2023-10-01; scheduled job is set to run daily at 6:00 AM but server time is 2023-10-02 06:00 AM

**Steps**

1. Navigate to /admin/system-settings
2. Verify scheduled job status
3. Click 'Run Now'
4. Verify error message

**Expected**

Error message is displayed indicating the scheduled job failed to run due to invalid input date.

---

## TC-PO10503 — No purchase orders to remind due to no valid POs _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Today is 2023-10-01; no POs exist with statuses 'Sent' or 'Acknowledged' and expected delivery dates within 3 days from today

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Run Scheduled Job'
3. Verify no email notifications are sent

**Expected**

No email reminders are sent for purchase orders as none meet the criteria.

---

## TC-PO10504 — Scheduled job fails due to non-operational email system _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Today is 2023-10-01; POs exist matching reminder criteria but email system is down

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Run Scheduled Job'
3. Verify email notifications are not sent

**Expected**

Email reminders are not sent for purchase orders due to the non-operational email system.

---

## TC-PO10505 — No reminders sent for POs with GR _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Today is 2023-10-01; POs match reminder criteria but some have GR already

**Steps**

1. Navigate to /procurement/purchase-order
2. Click 'Run Scheduled Job'
3. Verify email notifications are sent for only valid POs

**Expected**

Email reminders are sent only for POs without existing GR.

---

## TC-PO20101 — PO Approved - Encumbrance Created _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PO with budget allocation exists and the budget management system is operational

**Steps**

1. Navigate to /procurement/purchase-order
2. Click on 'Approved' action for a PO
3. Wait for system to process and create encumbrance
4. Verify encumbrance amount in budget management system

**Expected**

Encumbrance amount is correctly created in the budget management system.

---

## TC-PO20102 — PO Amount Modified - Encumbrance Adjusted _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PO with budget allocation exists; the budget management system is operational

**Steps**

1. Navigate to /procurement/purchase-order
2. Modify PO amount
3. Wait for system to process and adjust encumbrance
4. Verify adjusted encumbrance amount in budget management system

**Expected**

Encumbrance amount is correctly adjusted in the budget management system.

---

## TC-PO20103 — PO Cancelled - Encumbrance Released _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PO with budget allocation exists; the budget management system is operational

**Steps**

1. Navigate to /procurement/purchase-order
2. Cancel the purchase order
3. Wait for system to process and release encumbrance
4. Verify encumbrance amount is released in budget management system

**Expected**

Encumbrance amount is correctly released in the budget management system.

---

## TC-PO20104 — Invalid PO Event - No Action Taken _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A PO with budget allocation exists; the budget management system is operational

**Steps**

1. Navigate to /procurement/purchase-order
2. Try to perform an invalid action (e.g., approve without changes)
3. Wait for system response
4. Verify no changes in budget management system

**Expected**

No changes occur in the budget management system.

---

## TC-PO20105 — GRN Created Without PO - No Encumbrance Conversion _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PO with budget allocation exists; the budget management system is operational

**Steps**

1. Navigate to /procurement/receipt-note
2. Create a GRN without corresponding PO
3. Wait for system response
4. Verify no encumbrance is converted to expense in budget management system

**Expected**

No encumbrance is converted to expense in the budget management system.

---

## TC-PO20201 — Happy Path - Valid Vendor Selection and Information Retrieval _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Vendor Management System is operational; vendor master data is current; integration API or database access available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill 'Vendor Name'
4. Select 'Vendor' from the dropdown
5. Verify 'Vendor Status' is 'Active'
6. Verify 'Vendor Contact' is retrieved

**Expected**

Vendor information is successfully retrieved and displayed.

---

## TC-PO20202 — Negative Case - Vendor Not Found _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Vendor Management System is operational; vendor master data is current; integration API or database access available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill 'Vendor Name'
4. Select 'Vendor' from the dropdown
5. Verify 'Vendor Status' is 'Inactive'
6. Verify error message 'Vendor not found'

**Expected**

System displays an error message indicating vendor not found.

---

## TC-PO20203 — Edge Case - Vendor Name Format _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Vendor Management System is operational; vendor master data is current; integration API or database access available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill 'Vendor Name' with special characters (e.g., @#)$&)
4. Select 'Vendor' from the dropdown
5. Verify 'Vendor Status' is 'Inactive'

**Expected**

System does not allow special characters in vendor name and vendor status remains 'Inactive'.

---

## TC-PO30101 — Happy Path - Daily Purchase Order Status Cleanup _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Database is accessible; system is operational; no maintenance windows active

**Steps**

1. Navigate to /admin/scheduled-jobs
2. Wait for 2:00 AM
3. System initiates scheduled job
4. System queries for POs with status = 'Fully Received' and last activity date >= 30 days ago
5. Verify no open quality issues, no open disputes or returns, all related invoices processed
6. Verify all matching POs are marked as completed

**Expected**

All matching POs are marked as completed and no errors are reported.

---

## TC-PO30102 — Negative Case - Database Unavailable _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Database is not accessible; system is operational; no maintenance windows active

**Steps**

1. Navigate to /admin/scheduled-jobs
2. Wait for 2:00 AM
3. System attempts to initiate scheduled job but fails due to database unavailability

**Expected**

Error message indicating database unavailability is displayed.

---

## TC-PO30103 — Negative Case - No Purchase Orders Meet Criteria _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Database is accessible; system is operational; no maintenance windows active

**Steps**

1. Navigate to /admin/scheduled-jobs
2. Wait for 2:00 AM
3. System queries for POs with status = 'Fully Received' and last activity date >= 30 days ago
4. Verify no purchase orders meet the criteria

**Expected**

No purchase orders are marked as completed and no errors are reported.

---

## TC-PO30104 — Edge Case - Maintenance Window Active _(skipped)_

> **As a** Purchase user, **I want** this Purchase Order behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Database is accessible; system is not operational; maintenance windows active

**Steps**

1. Navigate to /admin/scheduled-jobs
2. Wait for 2:00 AM
3. System attempts to initiate scheduled job but fails due to system not being operational during maintenance window

**Expected**

Error message indicating maintenance window active is displayed.

---


<sub>Last regenerated: 2026-05-06 · git f17f7d9</sub>
