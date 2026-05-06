# Price List Template — User Stories

_Generated from `tests/160-price-list-template.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Price List Template
**Spec:** `tests/160-price-list-template.spec.ts`
**Default role:** Purchase
**Total test cases:** 26 (13 High / 8 Medium / 1 Low / 4 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PT00101 | Create Pricelist Template - Happy Path | Critical | Happy Path |
| TC-PT00102 | Create Pricelist Template - Empty Template Name | High | Negative |
| TC-PT00104 | Create Pricelist Template - No Permission | Critical | Negative |
| TC-PT00105 | Create Pricelist Template - Missing Description | High | Negative |
| TC-PT00201 | Add products to template - Happy Path | Critical | Happy Path |
| TC-PT00202 | Add products to template - Invalid Input (max exceeded) | High | Negative |
| TC-PT00203 | Add products to template - No Permission | Critical | Negative |
| TC-PT00204 | Add products to template - Edge Case - Empty Selection | Medium | Edge Case |
| TC-PT00301 | Edit template with valid data | High | Happy Path |
| TC-PT00302 | Edit template with invalid validity period | High | Negative |
| TC-PT00303 | Edit template without product selection | High | Negative |
| TC-PT00304 | Edit template with minimal changes | High | Happy Path |
| TC-PT00305 | Edit template with all fields in default state | High | Edge Case |
| TC-PT00401 | Happy Path - Clone Existing Template | Medium | Happy Path |
| TC-PT00402 | Negative - Invalid Template Name | Medium | Negative |
| TC-PT00403 | Negative - No Permission to Clone | Medium | Negative |
| TC-PT00404 _(skipped)_ | Edge Case - Maximum Templates Reached | Low | Edge Case |
| TC-PT00501 | Activate Template - Happy Path | High | Happy Path |
| TC-PT00503 | Activate Template - Invalid Input | Medium | Negative |
| TC-PT00504 | Deactivate Template - No Permission | High | Negative |
| TC-PT00505 | Template Status Change - Edge Case (rapid toggle) | Medium | Edge Case |
| TC-PT00601 | Search and View Templates - Happy Path | High | Happy Path |
| TC-PT00602 | Search and View Templates - Negative - Invalid Search Term | High | Negative |
| TC-PT00603 | Search and View Templates - Negative - Insufficient Permission | High | Negative |
| TC-PT00604 | Search and View Templates - Edge Case - Filter by Product Count | Medium | Edge Case |
| TC-PT00605 | Search and View Templates - Edge Case - Sort by Name (Z-A) | Medium | Edge Case |

---

## TC-PT00101 — Create Pricelist Template - Happy Path

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager and has access to Pricelist Templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click 'New Pricelist Template'
3. Fill 'Template Name' with 'Office Supplies'
4. Fill 'Description' with 'Office supplies pricelist for 2023'
5. Click 'Save'

**Expected**

Pricelist template is created successfully.

---

## TC-PT00102 — Create Pricelist Template - Empty Template Name

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager and has access to Pricelist Templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click 'New Pricelist Template'
3. Fill 'Description' with 'Office supplies pricelist for 2023'
4. Click 'Save'

**Expected**

Error message displayed for empty template name.

---

## TC-PT00104 — Create Pricelist Template - No Permission

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Staff and has access to Pricelist Templates list page only

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click 'New Pricelist Template'

**Expected**

User is redirected to unauthorized access page or 'New Pricelist Template' button is hidden/disabled.

---

## TC-PT00105 — Create Pricelist Template - Missing Description

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager and has access to Pricelist Templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click 'New Pricelist Template'
3. Fill 'Template Name' with 'Office Supplies'
4. Click 'Save'

**Expected**

Error message displayed for missing description.

---

## TC-PT00201 — Add products to template - Happy Path

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager; has access to a product template; at least 10 products exist

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Open an existing template
3. Click 'Add Products' button
4. Select 10 products from the product list
5. Click 'Confirm Selection' button
6. Verify that the selected products are listed in the template

**Expected**

The selected products are successfully added to the template.

---

## TC-PT00202 — Add products to template - Invalid Input (max exceeded)

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager and has access to the product template

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Open an existing template
3. Click 'Add Products' button
4. Select 500 products from the product list
5. Click 'Confirm Selection' button
6. Verify that an error message is displayed

**Expected**

An error message is displayed stating that the maximum number of products per template has been exceeded.

---

## TC-PT00203 — Add products to template - No Permission

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Staff and has no access to the product template

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click 'Add Products' button
3. Wait for 5 seconds
4. Verify that the 'Add Products' button is disabled

**Expected**

The user is unable to add products to the template.

---

## TC-PT00204 — Add products to template - Edge Case - Empty Selection

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is logged in as Procurement Manager and has access to the product template

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Open an existing template
3. Click 'Add Products' button
4. Wait for 5 seconds
5. Verify that the selected products list is empty

**Expected**

The selected products list is empty and no products are added to the template.

---

## TC-PT00301 — Edit template with valid data

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager and has permission to edit templates

**Steps**

1. Navigate to /vendor-management/price-list-template/[id]
2. Click 'Edit'
3. Fill in template name
4. Fill in description
5. Select currency
6. Enter validity period
7. Fill in vendor instructions
8. Toggle allow multi-MOQ switch
9. Toggle require lead time switch
10. Enter max items per submission
11. Toggle send reminders switch
12. Select 14 and 7 days in reminder checkboxes
13. Enter escalation days
14. Click 'Save Changes'

**Expected**

Template is saved successfully, doc_version incremented, success message displayed, and changes logged in audit trail.

---

## TC-PT00302 — Edit template with invalid validity period

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager and has permission to edit templates

**Steps**

1. Navigate to /vendor-management/price-list-template/[id]
2. Click 'Edit'
3. Enter validity period of 0 days
4. Click 'Save Changes'

**Expected**

System shows error message for invalid validity period and template is not saved.

---

## TC-PT00303 — Edit template without product selection

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Procurement Manager has permission to edit templates and no products are linked to the template

**Steps**

1. Navigate to /vendor-management/price-list-template/[id]
2. Click 'Edit'
3. Click 'Save Changes'

**Expected**

System shows error message that at least one product selection must exist and template is not saved.

---

## TC-PT00304 — Edit template with minimal changes

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager and has permission to edit templates

**Steps**

1. Navigate to /vendor-management/price-list-template/[id]
2. Click 'Edit'
3. Change validity period to 1 day
4. Click 'Save Changes'

**Expected**

Template is saved successfully, doc_version incremented, and changes logged in audit trail.

---

## TC-PT00305 — Edit template with all fields in default state

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Procurement Manager has permission to edit templates; template is in its default state with no changes made

**Steps**

1. Navigate to /vendor-management/price-list-template/[id]
2. Click 'Edit'
3. Click 'Save Changes'

**Expected**

Template remains unchanged, doc_version remains the same, and no changes are logged in audit trail.

---

## TC-PT00401 — Happy Path - Clone Existing Template

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager; template library is available

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'Details' of existing template
3. Click 'Clone Template'
4. Fill 'New Template Name' with 'Copy of Original Name'
5. Click 'Clone'

**Expected**

New template is created with all products, configurations, and metadata. Success message is displayed.

---

## TC-PT00402 — Negative - Invalid Template Name

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager; template library is available; user enters invalid name

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'Details' of existing template
3. Click 'Clone Template'
4. Fill 'New Template Name' with invalid name (e.g., only spaces or special characters)
5. Click 'Clone'

**Expected**

System displays error message for invalid name and does not create the template.

---

## TC-PT00403 — Negative - No Permission to Clone

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Staff; template library is available

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'Details' of existing template
3. Attempt to click 'Clone Template'

**Expected**

System displays error message or denies access to the 'Clone Template' action.

---

## TC-PT00404 — Edge Case - Maximum Templates Reached _(skipped)_

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User is logged in as Procurement Manager; template library is available; maximum allowed templates have been created

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'Details' of existing template
3. Click 'Clone Template'

**Expected**

System displays error message indicating maximum templates have been reached and cloning is not possible.

> _Note: Backend / quota limit. Cannot reliably exhaust template quota in E2E. Verify with API/integration tests instead._

---

## TC-PT00501 — Activate Template - Happy Path

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Template is in a deactivated state and user has permission to activate templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Locate the deactivated template
3. Click 'Activate' button
4. Confirm activation

**Expected**

Template is activated and changes status to active.

---

## TC-PT00503 — Activate Template - Invalid Input

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Template is in a deactivated state and user has permission to activate templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Locate the deactivated template
3. Click 'Activate' button
4. Enter invalid data

**Expected**

System displays error message indicating invalid input.

---

## TC-PT00504 — Deactivate Template - No Permission

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Template is in an active state and user does not have permission to deactivate templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Locate the active template
3. Click 'Deactivate' button
4. Confirm deactivation attempt

**Expected**

System displays error message indicating insufficient permissions.

---

## TC-PT00505 — Template Status Change - Edge Case (rapid toggle)

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Template is in an active state and user has permission to deactivate templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Locate the active template
3. Click 'Deactivate' button
4. Confirm deactivation
5. Immediately re-activate the template
6. Confirm re-activation

**Expected**

Template successfully switches between active and deactivated states.

---

## TC-PT00601 — Search and View Templates - Happy Path

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged into Carmen Inventory with permissions to view templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'All' status tab
3. Enter 'example' in the search field
4. Click 'Search'
5. Click on a template card

**Expected**

System displays template detail page with relevant template information.

---

## TC-PT00602 — Search and View Templates - Negative - Invalid Search Term

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged into Carmen Inventory with permissions to view templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Enter 'nonexistent' in the search field
3. Click 'Search'

**Expected**

System displays a message indicating no matching templates were found.

---

## TC-PT00603 — Search and View Templates - Negative - Insufficient Permission

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged into Carmen Inventory but does not have permissions to view templates

**Steps**

1. Navigate to /vendor-management/price-list-template

**Expected**

System redirects the user to an unauthorized access page or shows a permission denied message.

---

## TC-PT00604 — Search and View Templates - Edge Case - Filter by Product Count

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is logged into Carmen Inventory with permissions to view templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'All' status tab
3. Click on 'Filter by Product Count'
4. Enter '0' in the min count field
5. Enter '10' in the max count field
6. Click 'Apply Filter'

**Expected**

System displays a filtered list of templates with a product count within the specified range.

---

## TC-PT00605 — Search and View Templates - Edge Case - Sort by Name (Z-A)

> **As a** Purchase user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is logged into Carmen Inventory with permissions to view templates

**Steps**

1. Navigate to /vendor-management/price-list-template
2. Click on 'All' status tab
3. Click on the 'Name' column header
4. Click on the 'Z-A' sorting option

**Expected**

System sorts the template list in descending alphabetical order based on the template name.

---


<sub>Last regenerated: 2026-05-06 · git d345f91</sub>
