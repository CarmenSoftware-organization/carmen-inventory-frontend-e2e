# Store Requisition — User Stories

_Generated from `tests/701-store-requisition.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Store Requisition
**Spec:** `tests/701-store-requisition.spec.ts`
**Default role:** Purchase
**Total test cases:** 47 (16 High / 28 Medium / 3 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SR00101 | Happy Path - Create Store Requisition | High | Happy Path |
| TC-SR00102 | Negative - User Not Assigned to Department | Medium | Negative |
| TC-SR00103 | Edge Case - No Source Locations Available | Medium | Edge Case |
| TC-SR00104 | Negative - Invalid Input - Missing Expected Delivery Date | Medium | Negative |
| TC-SR00105 | Alternate Flow - Quick Create from Template | Medium | Alternate Flow |
| TC-SR00201 | Happy Path - Add Single Item | Medium | Happy Path |
| TC-SR00202 | Negative - Invalid Quantity | Medium | Negative |
| TC-SR00203 | Edge Case - Insufficient Stock | Medium | Edge Case |
| TC-SR00301 | Happy Path - Sufficient Inventory | High | Happy Path |
| TC-SR00302 | Negative Case - Insufficient Inventory | High | Negative |
| TC-SR00303 | Edge Case - No Inventory Records | Medium | Edge Case |
| TC-SR00304 | Edge Case - Inventory System Unavailable | High | Edge Case |
| TC-SR00401 | Save as Draft with Valid Input | Medium | Happy Path |
| TC-SR00402 | Save as Draft with Missing Requisition Number | Medium | Negative |
| TC-SR00403 | Auto-Save Draft Every 60 Seconds | Low | Edge Case |
| TC-SR00404 | Save and Close with Valid Input | Medium | Happy Path |
| TC-SR00405 | Save Failure due to Network/Database Issue | Medium | Negative |
| TC-SR00501 | Submit approved requisition with valid items | Medium | Happy Path |
| TC-SR00502 | Submit requisition with missing destination locations | Medium | Negative |
| TC-SR00503 | Submit requisition with empty line items | High | Negative |
| TC-SR00504 | Submit requisition as an unauthorized user | Low | Negative |
| TC-SR00505 | Submit requisition with emergency flag | Medium | Edge Case |
| TC-SR00601 | Navigate to Store Requisitions with Pending Approvals | High | Happy Path |
| TC-SR00602 | View Requisition Details with Filtered Columns | Medium | Happy Path |
| TC-SR00603 | Bulk Action - Export Selected Requisitions | Medium | Happy Path |
| TC-SR00604 | No Pending Approvals - Empty State | Low | Edge Case |
| TC-SR00605 | Delegate Approvals for Unavailable User | High | Negative |
| TC-SR00701 | Approve Requisition with No Quantity Adjustments | High | Happy Path |
| TC-SR00702 | Unauthorized User Attempts to Approve Requisition | Medium | Negative |
| TC-SR00703 | Budget Exceeded During Approval | Medium | Edge Case |
| TC-SR00801 | Happy Path - Approve Item | Medium | Happy Path |
| TC-SR00802 | Negative - Insufficient Stock for Issuance | High | Negative |
| TC-SR00803 | Negative - No Permission | High | Negative |
| TC-SR00901 | Adjust approved quantity: Happy path | High | Happy Path |
| TC-SR00902 | Decrease approved quantity: Insufficient issued quantity | Medium | Negative |
| TC-SR00903 | Decrease approved quantity: Fully issued item | High | Edge Case |
| TC-SR00904 | Increase approved quantity: Stock insufficient | Medium | Negative |
| TC-SR00905 | Concurrent modification detected | Medium | Edge Case |
| TC-SR01001 | Request Review with Valid Comments and Specific Items | Medium | Happy Path |
| TC-SR01002 | Request Review with Invalid Comments | High | Negative |
| TC-SR01003 | Request Review with No Specific Items Selected | Medium | Edge Case |
| TC-SR01101 | Primary Actor Rejects Requisition Successfully | High | Happy Path |
| TC-SR01102 | User Enters Insufficient Rejection Reason | High | Edge Case |
| TC-SR01103 | User Accidentally Rejects Requisition | Medium | Negative |
| TC-SR01104 | User Rejects Specific Items Only | Medium | Alternate Flow |
| TC-SR01201 | Happy Path - Full Issuance | High | Happy Path |
| TC-SR01203 | Edge Case - Partial Issuance | Medium | Edge Case |

---

## TC-SR00101 — Happy Path - Create Store Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated, has Requestor role, is assigned to a department, and has access to at least one source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'New Requisition'
3. Fill Expected delivery date
4. Fill Description/purpose
5. Select source location from 'Request From' dropdown
6. Verify requisition number is auto-generated
7. Verify requisition date is current
8. Verify 'Requested By' field is auto-populated
9. Click 'Save as Draft'

**Expected**

Requisition is saved as draft successfully, inline item addition section is enabled, and success message is displayed.

---

## TC-SR00102 — Negative - User Not Assigned to Department

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is authenticated but not assigned to any department

**Steps**

1. Navigate to /store-operation/store-requisition
2. Attempt to click 'New Requisition'

**Expected**

System displays error message 'You must be assigned to a department to create requisitions', 'New Requisition' button is disabled.

---

## TC-SR00103 — Edge Case - No Source Locations Available

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has Requestor role, assigned to department, but no authorized source locations exist

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'New Requisition'
3. Attempt to select source location from 'Request From' dropdown

**Expected**

System displays warning message 'No storage locations available for your department', suggests contacting administrator.

---

## TC-SR00104 — Negative - Invalid Input - Missing Expected Delivery Date

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has Requestor role, assigned to department, has access to source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'New Requisition'
3. Fill Description/purpose
4. Select source location from 'Request From' dropdown
5. Leave Expected delivery date field empty
6. Attempt to click 'Save as Draft'

**Expected**

System displays error message for missing expected delivery date, does not save requisition.

---

## TC-SR00105 — Alternate Flow - Quick Create from Template

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**

User has Requestor role, assigned to department, has access to source location, template exists

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'New Requisition'
3. Select 'Create from Template'
4. Select a saved template
5. Fill Description/purpose
6. Select source location from 'Request From' dropdown
7. Fill Expected delivery date
8. Click 'Save as Draft'

**Expected**

Requisition is saved as draft from template successfully, inline item addition section is enabled, and success message is displayed.

---

## TC-SR00201 — Happy Path - Add Single Item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Requisition exists in Draft status; user is the requisition creator; product master data is available

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Add Item' button
3. Type 'Office Chair' in search input
4. Select 'Office Chair' from CommandList
5. Fill requested quantity '2'
6. Verify destination location is correct
7. Click 'Add'

**Expected**

Item 'Office Chair' added to requisition with correct details.

---

## TC-SR00202 — Negative - Invalid Quantity

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Requisition exists in Draft status; user is the requisition creator; product master data is available

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Add Item' button
3. Type 'Office Chair' in search input
4. Select 'Office Chair' from CommandList
5. Fill requested quantity '-1'
6. Click 'Add'

**Expected**

System displays error: 'Quantity must be greater than zero'.

---

## TC-SR00203 — Edge Case - Insufficient Stock

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Requisition exists in Draft status; product 'Office Chair' has insufficient stock

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Add Item' button
3. Type 'Office Chair' in search input
4. Select 'Office Chair' from CommandList
5. Fill requested quantity '5'
6. Click 'Add'

**Expected**

System displays warning: 'Requested quantity exceeds available stock' and suggests alternative actions.

---

## TC-SR00301 — Happy Path - Sufficient Inventory

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is editing a requisition with a selected product; Inventory Management system is accessible

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit' on an existing requisition
3. Update requested quantity
4. Verify system triggers real-time inventory check
5. Verify 'On Hand' and 'On Order' values
6. Verify 'Last Price' and 'Last Vendor' values
7. Verify 'Sufficient' stock status with green indicator
8. Verify no stock shortfall warning

**Expected**

System correctly displays sufficient inventory status and available quantity.

---

## TC-SR00302 — Negative Case - Insufficient Inventory

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is editing a requisition with a selected product; Inventory Management system is accessible

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit' on an existing requisition
3. Update requested quantity to exceed available stock
4. Verify system triggers real-time inventory check
5. Verify 'Low' stock status with yellow indicator
6. Verify stock shortfall quantity and expected restock date displayed
7. Verify suggested actions to reduce quantity or switch location

**Expected**

System correctly indicates insufficient inventory and provides suggested actions.

---

## TC-SR00303 — Edge Case - No Inventory Records

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is editing a requisition with a selected product; Inventory Management system is accessible

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit' on an existing requisition
3. Select a product with no inventory records
4. Verify system triggers real-time inventory check
5. Verify system displays 'This product has no inventory records'
6. Verify suggested actions to contact storekeeper or consider purchase request

**Expected**

System correctly indicates no inventory records and suggests alternative actions.

---

## TC-SR00304 — Edge Case - Inventory System Unavailable

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User is editing a requisition with a selected product; Inventory Management system is inaccessible

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit' on an existing requisition
3. Update requested quantity
4. Verify system triggers real-time inventory check
5. Verify warning message 'Unable to retrieve current stock levels'
6. Verify system shows last cached inventory data with timestamp

**Expected**

System correctly handles unavailable inventory data by displaying cached information.

---

## TC-SR00401 — Save as Draft with Valid Input

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is working on requisition with filled header and selected source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Save as Draft'

**Expected**

System saves requisition with draft status and displays success toast.

---

## TC-SR00402 — Save as Draft with Missing Requisition Number

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is working on requisition with empty requisition number and filled source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Save as Draft'

**Expected**

System displays validation error for missing requisition number.

---

## TC-SR00403 — Auto-Save Draft Every 60 Seconds

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User is working on requisition and editing for more than 60 seconds

**Steps**

1. Navigate to /store-operation/store-requisition
2. Wait 60 seconds
3. Verify subtle auto-save indicator

**Expected**

System displays auto-save indicator at [time] showing draft was auto-saved.

---

## TC-SR00404 — Save and Close with Valid Input

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is working on requisition with filled header and selected source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Save and Close'

**Expected**

System saves requisition with draft status, navigates to requisitions list, and displays saved draft with Draft status badge.

---

## TC-SR00405 — Save Failure due to Network/Database Issue

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is working on requisition with filled header and selected source location

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Save as Draft'

**Expected**

System displays error message 'Failed to save requisition. Please try again.' and retains all entered data.

---

## TC-SR00501 — Submit approved requisition with valid items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Requisition is in Draft status with valid items and quantities

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify all line items are correct
3. Click 'Submit for Approval'
4. Verify system prompts confirmation dialog
5. Confirm submission
6. Verify status changes to In Process
7. Verify edit buttons are disabled
8. Verify workflow timeline is displayed

**Expected**

Requisition status updated to In Progress, no errors.

---

## TC-SR00502 — Submit requisition with missing destination locations

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Requisition is in Draft status with valid items but missing destination locations

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify missing destination locations
3. Click 'Submit for Approval'
4. Verify system prompts validation errors
5. Correct destination locations
6. Click 'Submit for Approval'
7. Verify system prompts confirmation dialog
8. Confirm submission

**Expected**

Requisition submitted successfully after correcting validation errors.

---

## TC-SR00503 — Submit requisition with empty line items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Requisition is in Draft status with no items

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Submit for Approval'
3. Verify system prompts error message

**Expected**

System displays error message: 'Cannot submit requisition without items'.

---

## TC-SR00504 — Submit requisition as an unauthorized user

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

Requisition is in Draft status, but the user is not the creator

**Steps**

1. Navigate to /store-operation/store-requisition
2. Attempt to click 'Submit for Approval'

**Expected**

System displays error message: 'Unauthorized to perform this action'.

---

## TC-SR00505 — Submit requisition with emergency flag

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Requisition is in Draft status, contains valid items, and marked as emergency

**Steps**

1. Navigate to /store-operation/store-requisition
2. Check 'Mark as Emergency' checkbox
3. Enter emergency justification (50+ characters)
4. Click 'Submit for Approval'

**Expected**

Requisition submitted with emergency flag and routed to emergency approval workflow.

---

## TC-SR00601 — Navigate to Store Requisitions with Pending Approvals

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has Approver role; assigned to approval workflow stage; at least one requisition is pending approval

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify the pending approvals count badge displays
3. Click on a requisition
4. Verify requisition detail page is displayed

**Expected**

User is navigated to the requisition detail page with all relevant information.

---

## TC-SR00602 — View Requisition Details with Filtered Columns

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has Approver role; assigned to approval workflow stage; at least one requisition is pending approval

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Sort By' and select 'Total Estimated Value'
3. Click 'Filter' and select 'Department'
4. Select a department and verify the list updates accordingly

**Expected**

Requisition list is sorted by total estimated value and filtered by the selected department.

---

## TC-SR00603 — Bulk Action - Export Selected Requisitions

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has Approver role; multiple requisitions selected

**Steps**

1. Navigate to /store-operation/store-requisition
2. Select multiple requisitions
3. Click 'Bulk Actions' > 'Export Selected'
4. Verify the export process starts and relevant file is downloaded

**Expected**

Selected requisitions are exported and a file is downloaded.

---

## TC-SR00604 — No Pending Approvals - Empty State

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has Approver role, but no requisitions are pending approval

**Steps**

1. Navigate to /store-operation/store-requisition
2. Verify 'No pending approvals' message is displayed

**Expected**

System displays 'No pending approvals' message and shows empty state with icon.

---

## TC-SR00605 — Delegate Approvals for Unavailable User

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is on leave and has pending approvals

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Delegate Approvals'
3. Select a delegate user and date range
4. Confirm delegation
5. Verify notification is sent to delegate

**Expected**

Pending approvals are transferred to the delegate user and a notification is sent.

---

## TC-SR00701 — Approve Requisition with No Quantity Adjustments

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has Approver role; requisition is in In Progress status; requisition is at user's approval stage; user has authority to approve for this department

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on Requisition ID
3. Verify Requisition number, date, requestor, department
4. Review line items in table
5. Verify legitimacy and necessity
6. Click 'Approve' button
7. Click 'Approve' in confirmation dialog
8. Verify success message 'Requisition approved successfully'

**Expected**

Requisition is approved, workflow history updated, next stage assigned, notifications sent to relevant parties.

---

## TC-SR00702 — Unauthorized User Attempts to Approve Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has Approver role; requisition is in In Progress status; user does not have authority to approve for this department

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on Requisition ID
3. Click 'Approve' button
4. Verify error message 'You are not authorized to approve at this stage'

**Expected**

User is denied permission to approve requisition; Approve button remains disabled.

---

## TC-SR00703 — Budget Exceeded During Approval

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has Approver role; requisition value exceeds department budget; user has authority to override budget

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click on Requisition ID
3. Verify budget exceeded warning
4. Click 'Proceed with Approval' in warning dialog
5. Verify success message 'Requisition approved successfully'

**Expected**

Requisition is approved, workflow history updated, next stage assigned, notifications sent, budget warning displayed and overridden.

---

## TC-SR00801 — Happy Path - Approve Item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has Approver role; requisition in In Progress status; item pending approval; user has access

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click action menu (three dots) for line item
3. Select 'Approve'
4. Confirm approval

**Expected**

Item approved with green checkmark, approved quantity, approver name and timestamp displayed, success toast: 'Item approved'. Requisition state remains In Progress if other items pending.

---

## TC-SR00802 — Negative - Insufficient Stock for Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Storekeeper has access to source location; requisition is in Ready for Issuance status; stock is insufficient for one of the items

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Filter' and select 'Ready for Issuance'
3. Select a requisition for issuance
4. Click 'Record Issuance'
5. Enter issued quantities for all items
6. Click 'Issue'

**Expected**

System displays error message for item with insufficient stock and prevents issuance.

---

## TC-SR00803 — Negative - No Permission

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has Storekeeper role; requisition in In Progress status; item pending approval; user has access

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click action menu (three dots) for line item
3. Attempt to select 'Approve'

**Expected**

System displays message: 'Insufficient permission to approve this item'. Action menu does not include 'Approve' option.

---

## TC-SR00901 — Adjust approved quantity: Happy path

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has Approver or Storekeeper role; line item is in approved status; requisition not fully issued; user has authority to modify approvals

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit Approval' from item action menu
3. Enter new approved quantity
4. Enter adjustment reason
5. Confirm adjustment

**Expected**

Line item approved quantity updated, history recorded, notification sent to requestor, success message displayed.

---

## TC-SR00902 — Decrease approved quantity: Insufficient issued quantity

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Item has issued quantity; user attempts to reduce approved quantity below issued

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit Approval' from item action menu
3. Enter new approved quantity less than issued quantity
4. Verify error message displayed

**Expected**

Error message displayed: 'Cannot reduce below already issued quantity'.

---

## TC-SR00903 — Decrease approved quantity: Fully issued item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Item fully issued

**Steps**

1. Navigate to /store-operation/store-requisition
2. Attempt to click 'Edit Approval' from item action menu

**Expected**

Action menu disabled, message displayed: 'Item fully issued. Cannot adjust approved quantity.'

---

## TC-SR00904 — Increase approved quantity: Stock insufficient

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Item has insufficient stock; user attempts to increase approved quantity

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Edit Approval' from item action menu
3. Enter new approved quantity greater than current approved quantity
4. Verify warning message displayed

**Expected**

Warning message displayed, increase not allowed.

---

## TC-SR00905 — Concurrent modification detected

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Another user modifies same item

**Steps**

1. Navigate to /store-operation/store-requisition
2. Attempt to click 'Edit Approval' from item action menu
3. Verify message displayed: 'This item was modified by [User]. Refresh and try again.'

**Expected**

Message displayed, item reloaded with latest data, user can retry adjustment.

---

## TC-SR01001 — Request Review with Valid Comments and Specific Items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has Approver role; requisition is in In Progress status; user has concerns requiring clarification

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Request Review' button
3. Enter detailed review comments in text area
4. Select specific line items for review
5. Confirm review request

**Expected**

Review request sent to requestor; system displays success message; sends notification to requestor; updates requisition display with review comments.

---

## TC-SR01002 — Request Review with Invalid Comments

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has Approver role; requisition is in In Progress status

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Request Review' button
3. Enter less than 20 characters in review comments text area
4. Confirm review request

**Expected**

System displays error message: 'Review comments are required (min 20 characters)'.

---

## TC-SR01003 — Request Review with No Specific Items Selected

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has Approver role; requisition is in In Progress status

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Request Review' button
3. Enter detailed review comments in text area
4. Do not select any specific line items for review
5. Confirm review request

**Expected**

System asks: 'Apply review to all items or select specific items?'. User must select at least one item before confirming.

---

## TC-SR01101 — Primary Actor Rejects Requisition Successfully

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has Approver role; requisition is in In Progress status; user determines requisition should be rejected

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Reject' button in workflow component
3. Enter detailed rejection reason: 'Specific policy violation'
4. Confirm rejection

**Expected**

Requisition status updates to 'Rejected', rejection reason is recorded, notifications are sent, and requisition is removed from pending approvals list.

---

## TC-SR01102 — User Enters Insufficient Rejection Reason

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has Approver role; requisition is in In Progress status

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Reject' button in workflow component
3. Enter rejection reason: 'Insuff'
4. Confirm rejection

**Expected**

System displays error: 'Rejection reason must be at least 50 characters', user must provide a detailed reason.

---

## TC-SR01103 — User Accidentally Rejects Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has Approver role; requisition is in In Progress status; user mistakenly rejects requisition

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Reject' button in workflow component
3. Enter rejection reason: 'Accidental rejection'
4. Confirm rejection

**Expected**

System displays success message: 'Requisition rejected', user can void rejection and resubmit corrected requisition.

---

## TC-SR01104 — User Rejects Specific Items Only

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**

User has Approver role; requisition is in In Progress status; user determines specific items should be rejected

**Steps**

1. Navigate to /store-operation/store-requisition
2. Select 'Reject' from item-level action menu
3. Enter rejection reason: 'Invalid request'
4. Confirm rejection

**Expected**

Selected items are marked as rejected, other items continue approval process, requisition status updates to 'Partially Rejected'.

---

## TC-SR01201 — Happy Path - Full Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Storekeeper has access to source location; requisition is in Ready for Issuance status

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Filter' and select 'Ready for Issuance'
3. Select a requisition for issuance
4. Click 'Record Issuance'
5. Enter issued quantities for all items
6. Click 'Issue'
7. Sign the receipt in the signature pad
8. Click 'Confirm Receipt'

**Expected**

Requisition is marked as completed, issuance document is generated, and stock balances are updated accordingly.

---

## TC-SR01203 — Edge Case - Partial Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Storekeeper has access to source location; requisition is in Ready for Issuance status

**Steps**

1. Navigate to /store-operation/store-requisition
2. Click 'Filter' and select 'Ready for Issuance'
3. Select a requisition for issuance
4. Click 'Record Issuance'
5. Enter partial issued quantities for some items
6. Click 'Issue'
7. Sign the receipt in the signature pad
8. Click 'Confirm Receipt'

**Expected**

Requisition remains in progress status, and remaining quantities are tracked.

---


<sub>Last regenerated: 2026-05-06 · git ca61be4</sub>
