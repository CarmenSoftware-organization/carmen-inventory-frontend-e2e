# Purchase Request Template — User Stories

_Generated from `tests/310-purchase-request-template.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Purchase Request Template
**Spec:** `tests/310-purchase-request-template.spec.ts`
**Default role:** Purchase
**Total test cases:** 60 (31 High / 27 Medium / 2 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PRT00101 | Happy Path - Create Template with Valid Data | High | Happy Path |
| TC-PRT00102 | Negative - No Permission to Create Template | High | Negative |
| TC-PRT00103 | Edge Case - Create Template without Assigned Department | High | Edge Case |
| TC-PRT00104 | Negative - Empty Fields for Template | High | Negative |
| TC-PRT00201 | View template with valid permissions | High | Happy Path |
| TC-PRT00203 | View non-existent template | High | Negative |
| TC-PRT00204 | View template with no budget allocations | Medium | Edge Case |
| TC-PRT00205 | View template with very long usage history | Medium | Edge Case |
| TC-PRT00301 | Edit Template - Happy Path | High | Happy Path |
| TC-PRT00302 | Edit Template - Invalid Input | High | Negative |
| TC-PRT00303 | Edit Template - No Permission | High | Negative |
| TC-PRT00304 | Edit Template - Template In ReadOnly Status | High | Edge Case |
| TC-PRT00305 | Edit Template - No Existing Template | High | Edge Case |
| TC-PRT00401 | Delete valid template - Happy Path | Medium | Happy Path |
| TC-PRT00402 | Attempt to delete default template - Negative Case | Medium | Negative |
| TC-PRT00403 | Delete template with no permissions - Negative Case | Medium | Negative |
| TC-PRT00404 | Attempt to delete template that does not exist - Negative Case | Low | Negative |
| TC-PRT00405 | Delete template with multiple selections - Edge Case | Medium | Edge Case |
| TC-PRT00501 | Clone existing template successfully | Medium | Happy Path |
| TC-PRT00502 | User without permission cannot clone template | Medium | Negative |
| TC-PRT00503 | Clone template with non-existent source | Medium | Negative |
| TC-PRT00504 | Clone template with different departments | Medium | Edge Case |
| TC-PRT00601 | Set Default Template Successfully | Medium | Happy Path |
| TC-PRT00602 | Set Default Template with No Permission | Medium | Negative |
| TC-PRT00603 | Set Default Template with Invalid Template | Medium | Negative |
| TC-PRT00604 | Set Default Template for Unrelated Department | Medium | Negative |
| TC-PRT00605 | Set Default Template with Multiple Selections | Medium | Edge Case |
| TC-PRT00701 | Add valid item to template | High | Happy Path |
| TC-PRT00702 | Add item with missing budget code | High | Negative |
| TC-PRT00703 | Add item with no permission | High | Negative |
| TC-PRT00704 | Add item with zero quantity | High | Negative |
| TC-PRT00705 | Add item with very large quantity | High | Edge Case |
| TC-PRT00801 | Edit existing template item successfully | High | Happy Path |
| TC-PRT00802 | Attempt to edit template without permission | High | Negative |
| TC-PRT00803 | Edit template item with invalid quantity | High | Negative |
| TC-PRT00804 | Edit template item with no selected item | High | Negative |
| TC-PRT00805 | Edit template item with minimal changes | Medium | Edge Case |
| TC-PRT00901 | Delete template item - happy path | Medium | Happy Path |
| TC-PRT00902 | Delete template item - no permission | Medium | Negative |
| TC-PRT00903 | Delete template item - no items present | Low | Edge Case |
| TC-PRT01001 | Search for template by name | High | Happy Path |
| TC-PRT01002 | Filter templates by category | High | Happy Path |
| TC-PRT01003 | Search with invalid input | High | Negative |
| TC-PRT01004 | Filter with no permission | High | Negative |
| TC-PRT01005 | Edge case - search with empty input | Medium | Edge Case |
| TC-PRT01101 | Bulk Template Creation | Medium | Happy Path |
| TC-PRT01102 | Bulk Template Deletion Without Permission | High | Negative |
| TC-PRT01103 | Bulk Template Update with Invalid Data | Medium | Negative |
| TC-PRT01104 | Bulk Template Operation with Empty Selection | Medium | Edge Case |
| TC-PRT01105 | Bulk Template Operation on Single Template | Medium | Edge Case |
| TC-PRT20101 | Happy Path - Convert Template to Purchase Request | High | Happy Path |
| TC-PRT20102 | Negative Case - Insufficient Permissions | High | Negative |
| TC-PRT20103 | Edge Case - Template with Empty Fields | Medium | Edge Case |
| TC-PRT20201 | Valid Budget Code Input | High | Happy Path |
| TC-PRT20203 | No Budget Code Selection | High | Negative |
| TC-PRT20204 | Budget Code Exceeds Character Limit | High | Edge Case |
| TC-PRT20205 | User Without Save Permission | High | Negative |
| TC-PRT20301 | Browse Catalog and Retrieve Valid Data | Medium | Happy Path |
| TC-PRT20302 | Browse Catalog with Invalid Permission | Medium | Negative |
| TC-PRT20303 | Retrieve Catalog Data After Server Timeout | Medium | Edge Case |

---

## TC-PRT00101 — Happy Path - Create Template with Valid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has 'Create Purchase Request Template' permission; assigned to at least one department; at least one budget code and account exist

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'New Purchase Request'
3. Fill Item Specifications
4. Fill Quantity
5. Fill Pricing
6. Select Budget Code
7. Select Account
8. Click 'Save'

**Expected**

Purchase request template is successfully created and saved.

---

## TC-PRT00102 — Negative - No Permission to Create Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User lacks 'Create Purchase Request Template' permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'New Purchase Request'

**Expected**

System displays permission denied message.

---

## TC-PRT00103 — Edge Case - Create Template without Assigned Department

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has create permission but is not assigned to any department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'New Purchase Request'

**Expected**

System displays error message indicating user needs to be assigned to a department.

---

## TC-PRT00104 — Negative - Empty Fields for Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has create permission; assigned to at least one department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'New Purchase Request'
3. Fill only part of the required fields
4. Click 'Save'

**Expected**

System displays error message for required fields not filled.

---

## TC-PRT00201 — View template with valid permissions

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has 'View Purchase Request Templates' permission; template exists in the system

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on a template card
3. Verify all metadata, configured items, budget allocations, and usage history are displayed

**Expected**

All template details are correctly displayed.

---

## TC-PRT00203 — View non-existent template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has 'View Purchase Request Templates' permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on a non-existent template link
3. Verify error message or access is denied

**Expected**

User receives an error message or is informed that the template does not exist.

---

## TC-PRT00204 — View template with no budget allocations

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has view permission; template exists with no budget allocations

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on a template card
3. Verify that there are no budget allocation entries displayed

**Expected**

The budget allocations section shows no entries.

---

## TC-PRT00205 — View template with very long usage history

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has view permission; template exists with a very long usage history

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on a template card
3. Verify that the usage history is truncated or paginated

**Expected**

The usage history is truncated or paginated, allowing users to view a reasonable amount of data.

---

## TC-PRT00301 — Edit Template - Happy Path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has edit permission; template exists and is in editable status (Draft or Active); user is template creator or has elevated privilege

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for an existing template
3. Fill in updated description
4. Adjust quantity or price
5. Verify changes are saved
6. Click 'Save'

**Expected**

Template is updated with new description, quantity, and price. Changes are reflected in the template.

---

## TC-PRT00302 — Edit Template - Invalid Input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has edit permission; template exists and is in editable status

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for an existing template
3. Fill in a negative quantity value
4. Attempt to save
5. Verify error message

**Expected**

Error message displayed stating that quantity cannot be negative.

---

## TC-PRT00303 — Edit Template - No Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is not template creator and does not have elevated privilege

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for an existing template
3. Attempt to make any changes
4. Verify inability to save changes

**Expected**

User is unable to make any changes and receives a permission denied message.

---

## TC-PRT00304 — Edit Template - Template In ReadOnly Status

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Template is in non-editable status (Locked or Inactive)

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for a template in non-editable status
3. Attempt to make any changes
4. Verify inability to save changes

**Expected**

User is unable to make any changes and receives a message stating the template is read-only.

---

## TC-PRT00305 — Edit Template - No Existing Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has edit permission; template does not exist

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to click on 'Edit' for a non-existent template
3. Verify no actions can be performed

**Expected**

User is unable to perform any actions on a non-existent template.

---

## TC-PRT00401 — Delete valid template - Happy Path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has delete permission; template exists and is not marked as default for its department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Select the template to delete
3. Click 'Delete'
4. Confirm the deletion

**Expected**

Template is successfully deleted from the system.

---

## TC-PRT00402 — Attempt to delete default template - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has delete permission; default template exists in the system for the department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to delete the default template

**Expected**

System prevents deletion of the default template and displays an error message.

---

## TC-PRT00403 — Delete template with no permissions - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have 'Delete Purchase Request Template' permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to delete any template

**Expected**

System displays an error message indicating that the user does not have the required permission.

---

## TC-PRT00404 — Attempt to delete template that does not exist - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

User has delete permission; template does not exist in the system

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to delete a non-existent template

**Expected**

System displays an error message indicating that the template does not exist.

---

## TC-PRT00405 — Delete template with multiple selections - Edge Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has delete permission; multiple templates exist and are not marked as default

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Select multiple templates
3. Click 'Delete'
4. Confirm the deletion

**Expected**

Selected templates are successfully deleted from the system.

---

## TC-PRT00501 — Clone existing template successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has create permission; source template exists and is accessible

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Clone' on the source template
3. Confirm the clone operation

**Expected**

The new template is created as a copy of the source template with all details intact.

---

## TC-PRT00502 — User without permission cannot clone template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have create permission; source template exists and is accessible

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to click 'Clone' on the source template

**Expected**

User receives an access denied message or the 'Clone' option is grayed out.

---

## TC-PRT00503 — Clone template with non-existent source

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has create permission; source template does not exist

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to click 'Clone' on a non-existent template

**Expected**

User is informed that the source template does not exist.

---

## TC-PRT00504 — Clone template with different departments

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has create permission; source template exists and is from a different department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Clone' on the source template
3. Verify that the new template's department is the same as the user's department

**Expected**

The new template's department matches the user's department, indicating the cloning operation is restricted to the user's department.

---

## TC-PRT00601 — Set Default Template Successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has 'Manage Default Templates' permission; template exists and is in Active status; user has access to template's department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Manage Templates'
3. Select template
4. Click 'Set as Default'
5. Confirm

**Expected**

Template is marked as default and a success message is displayed.

---

## TC-PRT00602 — Set Default Template with No Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have 'Manage Default Templates' permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Manage Templates'
3. Attempt to select template and set as default

**Expected**

User receives an error message indicating they do not have permission to manage default templates.

---

## TC-PRT00603 — Set Default Template with Invalid Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has manage permission; template does not exist or is in Inactive status

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Manage Templates'
3. Attempt to select non-existent or inactive template and set as default

**Expected**

User receives an error message indicating the selected template is invalid.

---

## TC-PRT00604 — Set Default Template for Unrelated Department

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has manage permission; template exists; user does not have access to template's department

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Manage Templates'
3. Select template
4. Attempt to set as default

**Expected**

User receives an error message indicating they do not have access to the template's department.

---

## TC-PRT00605 — Set Default Template with Multiple Selections

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple templates exist and are in Active status

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Manage Templates'
3. Select multiple templates
4. Attempt to set as default

**Expected**

User receives an error message indicating only one template can be set as default at a time.

---

## TC-PRT00701 — Add valid item to template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is in edit mode of a template; has permission to edit; has at least one budget and account code

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Add Item'
3. Fill 'Item Name' with 'Desk'
4. Fill 'Quantity' with '50'
5. Fill 'Price' with '100.50'
6. Select 'Budget Code' from dropdown
7. Select 'Account Code' from dropdown
8. Click 'Save'

**Expected**

Item 'Desk' is added to the template with correct details and saved successfully.

---

## TC-PRT00702 — Add item with missing budget code

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is in edit mode of a template; has permission to edit; no budget code exists

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Add Item'
3. Fill 'Item Name' with 'Chair'
4. Fill 'Quantity' with '25'
5. Fill 'Price' with '75.00'
6. Click 'Save'

**Expected**

Error message is displayed stating that a budget code is required.

---

## TC-PRT00703 — Add item with no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is in edit mode of a template; does not have permission to edit

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Add Item'

**Expected**

User is redirected to an access denied page or similar.

---

## TC-PRT00704 — Add item with zero quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is in edit mode of a template; has permission to edit

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Add Item'
3. Fill 'Item Name' with 'Table'
4. Fill 'Quantity' with '0'
5. Fill 'Price' with '200.00'
6. Select 'Budget Code' from dropdown
7. Select 'Account Code' from dropdown
8. Click 'Save'

**Expected**

Error message is displayed stating that quantity cannot be zero.

---

## TC-PRT00705 — Add item with very large quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User is in edit mode of a template; has permission to edit

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Add Item'
3. Fill 'Item Name' with 'File Cabinet'
4. Fill 'Quantity' with '999999999999999'
5. Fill 'Price' with '150.00'
6. Select 'Budget Code' from dropdown
7. Select 'Account Code' from dropdown
8. Click 'Save'

**Expected**

Error message is displayed stating that quantity is too large.

---

## TC-PRT00801 — Edit existing template item successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is viewing a template in edit mode; template contains at least one item; user has edit permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on an existing item in the template list
3. Modify the item's quantity
4. Click 'Save'

**Expected**

The item is updated with the new quantity; template total is recalculated.

---

## TC-PRT00802 — Attempt to edit template without permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is viewing a template in edit mode; template contains at least one item; user does not have edit permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on an existing item in the template list
3. Attempt to modify the item's quantity

**Expected**

User receives an error message indicating insufficient permission to edit the template.

---

## TC-PRT00803 — Edit template item with invalid quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is viewing a template in edit mode; template contains at least one item

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on an existing item in the template list
3. Enter an invalid quantity value (e.g., negative number)
4. Click 'Save'

**Expected**

User receives an error message indicating the invalid input and item is not updated.

---

## TC-PRT00804 — Edit template item with no selected item

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is viewing a template in edit mode; template contains at least one item

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to click 'Save' without selecting an item

**Expected**

User receives an error message indicating that no item is selected.

---

## TC-PRT00805 — Edit template item with minimal changes

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is viewing a template in edit mode; template contains at least one item

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on an existing item in the template list
3. Modify the item's price by the smallest possible amount
4. Click 'Save'

**Expected**

The item is updated with the new minimal price; template total is recalculated.

---

## TC-PRT00901 — Delete template item - happy path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has edit permission; viewing a template in edit mode; template contains at least one item

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for the specific template
3. Click on the 'Items' tab
4. Select an item in the list
5. Click 'Delete' button
6. Confirm deletion if prompted

**Expected**

Selected item is removed from the template, template total recalculated, and deletion logged.

---

## TC-PRT00902 — Delete template item - no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have edit permission; viewing a template in view mode; template contains at least one item

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'View' for the specific template
3. Attempt to click 'Edit' button
4. Verify that 'Edit' button is disabled or not visible

**Expected**

User is unable to navigate to edit mode and cannot delete items.

---

## TC-PRT00903 — Delete template item - no items present

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has edit permission; template contains no items

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click on 'Edit' for the specific template
3. Click on the 'Items' tab
4. Attempt to delete an item
5. Verify that the item list is empty and no delete option is available

**Expected**

User is informed that no items are present to delete.

---

## TC-PRT01001 — Search for template by name

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has access to templates list; at least one template exists

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Fill 'Search' with 'example template'
3. Click 'Search'

**Expected**

A filtered list of templates containing 'example template' is displayed.

---

## TC-PRT01002 — Filter templates by category

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has access to templates list; at least one template exists

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Filter' button
3. Select 'Category' from dropdown
4. Select a category
5. Click 'Apply' button

**Expected**

Templates are filtered by the selected category.

---

## TC-PRT01003 — Search with invalid input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has access to templates list; at least one template exists

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Fill 'Search' with '!@#'
3. Click 'Search'

**Expected**

No templates are displayed and an error message is shown.

---

## TC-PRT01004 — Filter with no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to view templates

**Steps**

1. Navigate to /procurement/purchase-request-template

**Expected**

User is redirected to unauthorized access page or an error message is displayed.

---

## TC-PRT01005 — Edge case - search with empty input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has access to templates list; at least one template exists

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Clear 'Search' input field
3. Click 'Search'

**Expected**

All templates are displayed.

---

## TC-PRT01101 — Bulk Template Creation

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has 'Bulk Operations' permission; templates list contains multiple templates

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Bulk Operations' tab
3. Select 'Create Templates' option
4. Fill in template details for multiple templates
5. Click 'Submit'

**Expected**

Bulk templates are created successfully.

---

## TC-PRT01102 — Bulk Template Deletion Without Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have 'Bulk Operations' permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Bulk Operations' tab
3. Select 'Delete Templates' option
4. Select multiple templates
5. Click 'Confirm'

**Expected**

System denies deletion and displays error message.

---

## TC-PRT01103 — Bulk Template Update with Invalid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has bulk operations permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Bulk Operations' tab
3. Select 'Update Templates' option
4. Fill in invalid data for multiple templates
5. Click 'Submit'

**Expected**

System prevents submission and displays error messages for invalid data.

---

## TC-PRT01104 — Bulk Template Operation with Empty Selection

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has bulk operations permission

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Bulk Operations' tab
3. Attempt to perform any bulk operation without selecting any templates

**Expected**

System displays error message indicating no templates selected.

---

## TC-PRT01105 — Bulk Template Operation on Single Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has bulk operations permission; multiple templates exist

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Bulk Operations' tab
3. Select a single template
4. Perform a bulk operation (e.g., update, delete)
5. Confirm operation

**Expected**

System performs the operation on the single selected template.

---

## TC-PRT20101 — Happy Path - Convert Template to Purchase Request

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has a valid template saved in the system

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Use Template' button
3. Verify template details are populated in the purchase request form
4. Click 'Save' button

**Expected**

Purchase request is created with template details and saved successfully.

---

## TC-PRT20102 — Negative Case - Insufficient Permissions

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to use templates

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Attempt to click 'Use Template' button
3. Verify error message stating permission denied

**Expected**

User is unable to use template and receives an appropriate error message.

---

## TC-PRT20103 — Edge Case - Template with Empty Fields

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has a template with some empty fields

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Use Template' button
3. Verify fields with no data are left empty in the purchase request form

**Expected**

Fields with no data in the template are not populated in the purchase request form.

---

## TC-PRT20201 — Valid Budget Code Input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has access to the Templates Module and is on the item form with a valid budget code

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Fill 'Budget Code' field with valid code
3. Click 'Save Template'

**Expected**

Template is saved successfully with the valid budget code.

---

## TC-PRT20203 — No Budget Code Selection

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has access to the Templates Module and is on the item form without selecting a budget code

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Leave 'Budget Code' field blank
3. Click 'Save Template'

**Expected**

Error message displayed prompting the selection of a valid budget code.

---

## TC-PRT20204 — Budget Code Exceeds Character Limit

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User is on the item form with a budget code exceeding the allowed character limit

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Fill 'Budget Code' field with code exceeding the allowed limit
3. Click 'Save Template'

**Expected**

Error message displayed indicating the budget code exceeds the character limit.

---

## TC-PRT20205 — User Without Save Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has access to the Templates Module but does not have permission to save templates

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Fill 'Budget Code' field with valid code
3. Click 'Save Template'

**Expected**

System denies the save operation and prompts the user about insufficient permissions.

---

## TC-PRT20301 — Browse Catalog and Retrieve Valid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged into the system with appropriate permissions

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Browse Catalog'
3. Verify the catalog data is retrieved and displayed correctly

**Expected**

The catalog data is successfully retrieved and displayed for the user.

---

## TC-PRT20302 — Browse Catalog with Invalid Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged into the system but does not have appropriate permissions

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Browse Catalog'
3. Verify the system denies access or displays an error message

**Expected**

The system denies access or displays an appropriate error message indicating insufficient permissions.

---

## TC-PRT20303 — Retrieve Catalog Data After Server Timeout

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Server responds with a timeout error when attempting to fetch data

**Steps**

1. Navigate to /procurement/purchase-request-template
2. Click 'Browse Catalog'
3. Wait for the server timeout
4. Verify the system handles the timeout gracefully

**Expected**

The system handles the server timeout gracefully and provides appropriate feedback to the user.

---


<sub>Last regenerated: 2026-05-06 · git f17f7d9</sub>
