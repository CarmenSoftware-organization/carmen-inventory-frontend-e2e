# Credit Note — User Stories

_Generated from `tests/601-credit-note.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Credit Note
**Spec:** `tests/601-credit-note.spec.ts`
**Default role:** Purchase
**Total test cases:** 124 (46 High / 29 Medium / 3 Low / 46 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CN00101 | View All Credit Notes | High | Happy Path |
| TC-CN00102 | Apply Status Filter | High | Happy Path |
| TC-CN00103 | Filter by Vendor | High | Happy Path |
| TC-CN00104 | Invalid Filter Input | High | Negative |
| TC-CN00105 | No Credit Notes Available | High | Edge Case |
| TC-CN00201 | Create Quantity-Based Credit Note from GRN - Happy Path | Critical | Happy Path |
| TC-CN00202 | Create Quantity-Based Credit Note from GRN - Invalid Vendor | Critical | Negative |
| TC-CN00203 | Create Quantity-Based Credit Note from GRN - No GRN Selected | Critical | Negative |
| TC-CN00204 | Create Quantity-Based Credit Note from GRN - Insufficient Quantity | Critical | Negative |
| TC-CN00205 | Create Quantity-Based Credit Note from GRN - Empty Lot Numbers | Critical | Negative |
| TC-CN00302 | Negative - Missing Vendor | High | Negative |
| TC-CN00303 | Edge Case - No GRN Reference | Medium | Edge Case |
| TC-CN00401 | View existing credit note | High | Happy Path |
| TC-CN00402 | Attempt to view non-existent credit note | High | Negative |
| TC-CN00403 | View credit note without necessary permissions | High | Negative |
| TC-CN00404 | View credit note with a large number of items | High | Edge Case |
| TC-CN00501 | Happy Path - Edit Credit Note | High | Happy Path |
| TC-CN00502 | Negative - Invalid Total Amount | High | Negative |
| TC-CN00503 | Negative - No Permission | High | Negative |
| TC-CN00504 | Edge Case - Edit Credit Note with No Items | Medium | Edge Case |
| TC-CN00601 | Add Credit Note Item with Valid Lot Selection | Critical | Happy Path |
| TC-CN00603 | Remove Credit Note Item with Lot Selection | Critical | Happy Path |
| TC-CN00604 | Attempt to Save Credit Note Without Lot Selection | High | Negative |
| TC-CN00605 | Manage Credit Note Items with No Permission | Critical | Negative |
| TC-CN00701 | Review Existing Credit Note with Quantity-Based Items | High | Happy Path |
| TC-CN00702 | Access Denied to Review Inventory Cost Analysis | High | Negative |
| TC-CN00703 | Review Empty Credit Note | Medium | Edge Case |
| TC-CN00801 | Happy Path - Select Credit Reason and Provide Description | Medium | Happy Path |
| TC-CN00802 | Negative - No Credit Reason Selected | Medium | Negative |
| TC-CN00803 | Edge Case - Maximum Character Limit for Description | Medium | Edge Case |
| TC-CN00901 | Add valid comments and attachments successfully | Medium | Happy Path |
| TC-CN00902 | Attempt to add comments without permission | Medium | Negative |
| TC-CN00903 | Attempt to upload an invalid file type | Medium | Negative |
| TC-CN00904 | Attach multiple documents to a credit note | Low | Happy Path |
| TC-CN00905 | Attempt to add comments when no credit note exists | Low | Edge Case |
| TC-CN01001 | Commit credit note - Happy path | Critical | Happy Path |
| TC-CN01002 | Commit credit note - No commit permission | Critical | Negative |
| TC-CN01003 | Commit credit note - Invalid credit note status | High | Negative |
| TC-CN01004 | Commit credit note - Accounting period closed | High | Negative |
| TC-CN01005 | Commit credit note - Date out of range | High | Edge Case |
| TC-CN01101 | Void committed credit note - Happy Path | Medium | Happy Path |
| TC-CN01102 | Void committed credit note - No Permission | Medium | Negative |
| TC-CN01103 | Void committed credit note - Invalid Credit Note | Medium | Negative |
| TC-CN01104 | Void committed credit note - Closed Accounting Period | Medium | Negative |
| TC-CN01105 | Void committed credit note - Edge Case - Multiple Credit Notes | Medium | Edge Case |
| TC-CN10101 _(skipped)_ | Happy Path - Generate Stock Movements for Quantity-Based Credit Notes | Critical | Happy Path |
| TC-CN10102 _(skipped)_ | Negative Case - Generate Stock Movements with Invalid Credit Note Type | High | Negative |
| TC-CN10103 _(skipped)_ | Negative Case - Generate Stock Movements Without Selected Lots | High | Negative |
| TC-CN10104 _(skipped)_ | Edge Case - Generate Stock Movements After Changing Credit Note Status | Medium | Edge Case |
| TC-CN10105 _(skipped)_ | Edge Case - Generate Stock Movements with No Inventory Locations Configured | Medium | Edge Case |
| TC-CN10201 _(skipped)_ | Generate Journal Entries - Happy Path | Critical | Happy Path |
| TC-CN10202 _(skipped)_ | Generate Journal Entries - Invalid GL Account Mapping | High | Negative |
| TC-CN10203 _(skipped)_ | Generate Journal Entries - Accounting Period Closed | High | Negative |
| TC-CN10204 _(skipped)_ | Generate Journal Entries - No Vendor Account | High | Negative |
| TC-CN10205 _(skipped)_ | Generate Journal Entries - Large Volume of Credit Notes | Medium | Edge Case |
| TC-CN10301 _(skipped)_ | Happy Path - Credit Note with Valid Items and Taxes | Critical | Happy Path |
| TC-CN10302 _(skipped)_ | Negative Case - Missing Tax Rate | Critical | Negative |
| TC-CN10401 _(skipped)_ | Happy Path - Process Valid Credit Note for Consumed Item | Critical | Happy Path |
| TC-CN10402 _(skipped)_ | Negative - Process Credit Note with Invalid Type | High | Negative |
| TC-CN10403 _(skipped)_ | Negative - Process Credit Note Without Permissions | High | Negative |
| TC-CN10404 _(skipped)_ | Edge Case - Process Credit Note for Partially Consumed Item | Medium | Edge Case |
| TC-CN10501 _(skipped)_ | Happy Path - Process Credit Note with Partial Availability | Critical | Happy Path |
| TC-CN10502 _(skipped)_ | Negative - Insufficient Available Inventory | High | Negative |
| TC-CN10503 _(skipped)_ | Negative - Invalid Credit Note Type | High | Negative |
| TC-CN10504 _(skipped)_ | Edge Case - Exact Quantity Available | Medium | Edge Case |
| TC-CN10601 _(skipped)_ | Happy Path - Process Retrospective Vendor Discount | High | Happy Path |
| TC-CN10604 _(skipped)_ | Edge Case - Single GRN Credit Note | Medium | Edge Case |
| TC-CN10605 _(skipped)_ | Edge Case - No Historical GRNs | Medium | Edge Case |
| TC-CN20101 _(skipped)_ | Happy Path - Create Credit Note (server action) | Critical | Happy Path |
| TC-CN20103 _(skipped)_ | Negative - Unauthorized User | Critical | Negative |
| TC-CN20104 _(skipped)_ | Edge Case - Concurrent Delete | High | Edge Case |
| TC-CN20201 _(skipped)_ | Fetch vendor and GRN data with valid input | Critical | Happy Path |
| TC-CN20202 _(skipped)_ | Fetch vendor and GRN data with invalid vendor selection | High | Negative |
| TC-CN20203 _(skipped)_ | Fetch vendor and GRN data when no vendor data exists | High | Negative |
| TC-CN20204 _(skipped)_ | Fetch vendor and GRN data with no vendor permissions | Critical | Negative |
| TC-CN20205 _(skipped)_ | Fetch vendor and GRN data with multiple vendors selected | Medium | Edge Case |
| TC-CN20301 _(skipped)_ | Happy Path - Commitment Transaction | Critical | Happy Path |
| TC-CN20302 _(skipped)_ | Negative - No Credit Note | Critical | Negative |
| TC-CN20303 _(skipped)_ | Negative - Invalid Accounting Period | Critical | Negative |
| TC-CN20304 _(skipped)_ | Edge Case - Document Date Outside Accounting Period | Critical | Edge Case |
| TC-CN20305 _(skipped)_ | Negative - Insufficient Permissions | Critical | Negative |
| TC-CN20401 _(skipped)_ | Happy Path - Void Existing Credit Note | Critical | Happy Path |
| TC-CN20402 _(skipped)_ | Negative Case - No Void Permission | Critical | Negative |
| TC-CN20403 _(skipped)_ | Negative Case - Dependent Transactions Exist | Critical | Negative |
| TC-CN20404 _(skipped)_ | Edge Case - Void During Closed Accounting Period | Critical | Edge Case |
| TC-CN20501 _(skipped)_ | Happy Path - FIFO Calculation for Credit Note | Critical | Happy Path |
| TC-CN20502 _(skipped)_ | Negative - Invalid Costing Method Selection | High | Negative |
| TC-CN20503 _(skipped)_ | Edge Case - No Lot Selection for Credit Note | Medium | Edge Case |
| TC-CN20504 _(skipped)_ | Negative - No Inventory Lot Cost Data | High | Negative |
| TC-CN20602 _(skipped)_ | Negative - Invalid Tax Rate | High | Negative |
| TC-CN20603 _(skipped)_ | Negative - No Vendor Tax Registration | High | Negative |
| TC-CN20604 _(skipped)_ | Edge Case - Large Credit Note Amount | Medium | Edge Case |
| TC-CN20605 _(skipped)_ | Edge Case - Zero Amount | Medium | Edge Case |
| TC-CN20702 _(skipped)_ | Generate Journal Entries - Invalid Credit Note ID | High | Negative |
| TC-CN20703 _(skipped)_ | Generate Journal Entries - User with Limited Permissions | Critical | Negative |
| TC-CN20704 _(skipped)_ | Generate Journal Entries - Simultaneous Multiple Commitments | Medium | Edge Case |
| TC-CN20705 _(skipped)_ | Generate Journal Entries - System Timeouts | Low | Edge Case |
| TC-CN20801 _(skipped)_ | Generate Stock Movement - Happy Path | Critical | Happy Path |
| TC-CN20802 _(skipped)_ | Generate Stock Movement - Invalid Quantity | High | Negative |
| TC-CN20803 _(skipped)_ | Generate Stock Movement - Insufficient Inventory | High | Negative |
| TC-CN20804 _(skipped)_ | Generate Stock Movement - No Permission | Critical | Negative |
| TC-CN20805 _(skipped)_ | Generate Stock Movement - Edge Case - Maximum Lot Quantity | Medium | Edge Case |
| TC-CN20901 _(skipped)_ | Upload valid attachment | High | Happy Path |
| TC-CN20902 _(skipped)_ | Try to upload invalid attachment | High | Negative |
| TC-CN20903 _(skipped)_ | Delete attachment | High | Happy Path |
| TC-CN20904 _(skipped)_ | Attempt to delete attachment without permission | High | Negative |
| TC-CN20905 _(skipped)_ | Upload large file | Medium | Edge Case |
| TC-CN21003 _(skipped)_ | Edge Case - Large Volume of Credit Notes | High | Edge Case |
| TC-CN21101 _(skipped)_ | Happy Path - Generate Valid CN Number | Critical | Happy Path |
| TC-CN21102 _(skipped)_ | Negative Path - Generate CN Number When Sequence Table Does Not Exist | Critical | Negative |
| TC-CN21103 _(skipped)_ | Negative Path - Generate CN Number Without Transaction Context | Critical | Negative |
| TC-CN21104 _(skipped)_ | Edge Case - Generate CN Number at Month End | Critical | Edge Case |
| TC-CN21105 _(skipped)_ | Negative Path - Generate CN Number During System Maintenance | Critical | Negative |
| TC-CN21201 _(skipped)_ | Happy Path - Credit Note Commitment | Critical | Happy Path |
| TC-CN21202 _(skipped)_ | Negative Case - Vendor Account Inactive | Critical | Negative |
| TC-CN21203 _(skipped)_ | Negative Case - Invalid Credit Note Amount | Critical | Negative |
| TC-CN21204 _(skipped)_ | Edge Case - Void Credit Note | Critical | Edge Case |
| TC-CN21301 _(skipped)_ | Valid Credit Note Data | Critical | Happy Path |
| TC-CN21302 _(skipped)_ | Missing Required Fields | Critical | Negative |
| TC-CN21303 _(skipped)_ | Invalid Credit Amount | Critical | Negative |
| TC-CN21304 _(skipped)_ | Expired Supplier | Critical | Negative |
| TC-CN21401 _(skipped)_ | Happy Path - Real-time Credit Note Sync | High | Happy Path |
| TC-CN21402 _(skipped)_ | Negative Case - No WebSocket Connection | High | Negative |
| TC-CN21403 _(skipped)_ | Edge Case - User Session Expired | Medium | Edge Case |

---

## TC-CN00101 — View All Credit Notes

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is authenticated and has permission to view credit notes

**Steps**

1. Navigate to /procurement/credit-note
2. Verify the list of credit notes is displayed.

**Expected**

User sees the complete list of credit notes.

---

## TC-CN00102 — Apply Status Filter

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has permission to view credit notes

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Filter' button
3. Select 'Open' status from the dropdown
4. Click 'Apply Filter' button
5. Verify the filtered list only shows open credit notes

**Expected**

User sees a filtered list of credit notes with only open status.

---

## TC-CN00103 — Filter by Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has permission to view credit notes; vendor with credit notes exists

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Filter' button
3. Enter vendor name in the 'Vendor' field
4. Click 'Apply Filter' button
5. Verify the filtered list only shows credit notes for the selected vendor

**Expected**

User sees a filtered list of credit notes for the selected vendor.

---

## TC-CN00104 — Invalid Filter Input

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has permission to view credit notes

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Filter' button
3. Enter invalid input in the 'Status' field
4. Click 'Apply Filter' button
5. Verify the list remains unfiltered

**Expected**

User sees an error message or the list remains unfiltered.

---

## TC-CN00105 — No Credit Notes Available

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has permission to view credit notes; credit note data does not exist in the system

**Steps**

1. Navigate to /procurement/credit-note
2. Verify the list is empty

**Expected**

User sees an empty list.

---

## TC-CN00201 — Create Quantity-Based Credit Note from GRN - Happy Path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User has purchasing/receiving role; at least one posted GRN exists for the vendor; vendor and product master data are correct

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select the vendor
4. Choose a GRN from the list
5. Select items with specific lot numbers
6. Record return quantities with correct inventory cost calculations
7. Click 'Save'

**Expected**

Quantity-based credit note is created successfully with correct details and inventory cost calculations.

---

## TC-CN00202 — Create Quantity-Based Credit Note from GRN - Invalid Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User has purchasing/receiving role; no posted GRN exists for the vendor

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select an invalid vendor
4. Choose a GRN from the list
5. Select items with specific lot numbers
6. Record return quantities
7. Click 'Save'

**Expected**

The system displays an error message indicating that no posted GRN exists for the selected vendor.

---

## TC-CN00203 — Create Quantity-Based Credit Note from GRN - No GRN Selected

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User has purchasing/receiving role; at least one posted GRN exists for the vendor

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select the vendor
4. Do not choose any GRN
5. Select items with specific lot numbers
6. Record return quantities
7. Click 'Save'

**Expected**

The system displays an error message indicating that a GRN must be selected.

---

## TC-CN00204 — Create Quantity-Based Credit Note from GRN - Insufficient Quantity

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User has purchasing/receiving role; at least one posted GRN exists for the vendor

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select the vendor
4. Choose a GRN from the list
5. Select items with specific lot numbers
6. Record a return quantity greater than the available quantity in the GRN
7. Click 'Save'

**Expected**

The system displays an error message indicating that the return quantity exceeds the available quantity in the GRN.

---

## TC-CN00205 — Create Quantity-Based Credit Note from GRN - Empty Lot Numbers

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User has purchasing/receiving role; at least one posted GRN exists for the vendor

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select the vendor
4. Choose a GRN from the list
5. Select items with empty lot numbers
6. Record return quantities
7. Click 'Save'

**Expected**

The system displays an error message indicating that lot numbers cannot be empty.

---

## TC-CN00302 — Negative - Missing Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has purchasing role; no vendor exists in system; GRN reference exists

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Skip 'Vendor' field
4. Fill 'GRN Reference' field (optional)
5. Fill 'Credit Note Amount' field
6. Fill 'Reason' field
7. Click 'Save'

**Expected**

System displays error message prompting user to select a vendor.

---

## TC-CN00303 — Edge Case - No GRN Reference

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has purchasing role; vendor exists; no GRN reference exists

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Vendor' field
4. Skip 'GRN Reference' field (optional)
5. Fill 'Credit Note Amount' field
6. Fill 'Reason' field
7. Click 'Save'

**Expected**

Credit note created in draft status without a GRN reference.

---

## TC-CN00401 — View existing credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has permission to view credit notes; a credit note exists in the system

**Steps**

1. Navigate to /procurement/credit-note
2. Click on an existing credit note

**Expected**

User sees complete credit note details including header information, items, lot applications, journal entries, stock movements, and tax calculations.

---

## TC-CN00402 — Attempt to view non-existent credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has permission to view credit notes

**Steps**

1. Navigate to /procurement/credit-note
2. Click on a non-existent credit note

**Expected**

System displays an error message indicating that the credit note does not exist.

---

## TC-CN00403 — View credit note without necessary permissions

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is authenticated but does not have permission to view credit notes

**Steps**

1. Navigate to /procurement/credit-note
2. Click on a credit note

**Expected**

System displays an error message indicating that the user does not have permission to view credit notes.

---

## TC-CN00404 — View credit note with a large number of items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has permission to view credit notes; a credit note with a large number of items exists

**Steps**

1. Navigate to /procurement/credit-note
2. Click on a credit note with a large number of items

**Expected**

User sees complete credit note details without any performance issues.

---

## TC-CN00501 — Happy Path - Edit Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has purchasing role; credit note exists with status DRAFT; user has permission to edit

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Edit' on the draft credit note
3. Fill 'Reason' field with 'Return of goods'
4. Fill 'Total Amount' field with '1200.00'
5. Click 'Save'

**Expected**

Credit note is updated with new values and remains in DRAFT status.

---

## TC-CN00502 — Negative - Invalid Total Amount

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has purchasing role; credit note exists with status DRAFT; user has permission to edit

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Edit' on the draft credit note
3. Fill 'Total Amount' field with 'invalid amount'
4. Click 'Save'

**Expected**

Error message displayed, credit note remains unchanged and in DRAFT status.

---

## TC-CN00503 — Negative - No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has receiving role; credit note exists with status DRAFT; user does not have permission to edit

**Steps**

1. Navigate to /procurement/credit-note
2. Attempt to click 'Edit' on the draft credit note
3. Verify error message is displayed

**Expected**

User is unable to edit the credit note and receives an error message.

---

## TC-CN00504 — Edge Case - Edit Credit Note with No Items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has purchasing role; credit note exists with status DRAFT; user has permission to edit; credit note has no items added

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Edit' on the draft credit note
3. Verify there are no items to edit
4. Click 'Save'

**Expected**

Credit note remains unchanged and in DRAFT status.

---

## TC-CN00601 — Add Credit Note Item with Valid Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note exists in DRAFT status; inventory lots exist for items being returned; user has edit permission

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Add Item'
3. Select item from dropdown
4. Choose valid lot from dropdown
5. Enter return quantity
6. Click 'Save'

**Expected**

Credit note item is added with correct lot selection and return quantity.

---

## TC-CN00603 — Remove Credit Note Item with Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note exists in DRAFT status; inventory lots exist; user has edit permission

**Steps**

1. Navigate to /procurement/credit-note
2. Select item from list
3. Click 'Remove Item'

**Expected**

Selected credit note item is removed, lot selection and return quantity are cleared.

---

## TC-CN00604 — Attempt to Save Credit Note Without Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note exists in DRAFT status; user has edit permission

**Steps**

1. Navigate to /procurement/credit-note
2. Add item without selecting lot
3. Attempt to save

**Expected**

Error message displayed indicating lot selection is required.

---

## TC-CN00605 — Manage Credit Note Items with No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Credit note exists in DRAFT status; inventory lots exist for items being returned

**Steps**

1. Navigate to /procurement/credit-note
2. Try to add, modify, or remove credit note item

**Expected**

Access denied message is displayed.

---

## TC-CN00701 — Review Existing Credit Note with Quantity-Based Items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A credit note exists with quantity-based items; inventory lots have been selected; cost calculations have been completed

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Credit Notes' tab
3. Select a credit note with quantity-based items
4. Click 'View Details'

**Expected**

Detailed inventory costing calculations, including weighted average costs, cost variances, and realized gains/losses for the selected credit note are displayed.

---

## TC-CN00702 — Access Denied to Review Inventory Cost Analysis

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note exists with quantity-based items; user does not have permission to view cost data

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Credit Notes' tab
3. Attempt to select a credit note with quantity-based items
4. Click 'View Details'

**Expected**

A permission error message is displayed, preventing the user from accessing the cost analysis details.

---

## TC-CN00703 — Review Empty Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

No credit note exists with quantity-based items

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Credit Notes' tab
3. Attempt to select a credit note with quantity-based items
4. Click 'View Details'

**Expected**

A message indicating that no credit notes with quantity-based items are available is displayed.

---

## TC-CN00801 — Happy Path - Select Credit Reason and Provide Description

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has a credit note creation or editing session and is logged in as a purchasing staff

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'New Credit Note' button
3. Select a credit reason from the dropdown
4. Fill in the description field
5. Click 'Save' button

**Expected**

Credit reason and description are saved successfully with the credit note.

---

## TC-CN00802 — Negative - No Credit Reason Selected

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has a credit note creation session and is logged in as a purchasing staff

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'New Credit Note' button
3. Skip selecting a credit reason
4. Fill in the description field
5. Click 'Save' button

**Expected**

Validation error is displayed prompting the selection of a credit reason.

---

## TC-CN00803 — Edge Case - Maximum Character Limit for Description

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has a credit note creation session and is logged in as a purchasing staff

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'New Credit Note' button
3. Select a credit reason from the dropdown
4. Fill in the description field with the maximum allowed character limit
5. Click 'Save' button

**Expected**

Credit reason and description are saved successfully with the credit note.

---

## TC-CN00901 — Add valid comments and attachments successfully

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A credit note exists in the system and the user has permission to add comments/attachments

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Add Comment' button
3. Fill 'Comment' field with 'Initial review complete'
4. Click 'Upload Document' button
5. Select a valid document file
6. Click 'Save' button

**Expected**

Comments and attachments are saved with the credit note. The comment and document are visible to authorized users.

---

## TC-CN00902 — Attempt to add comments without permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A credit note exists in the system but the user does not have permission to add comments/attachments

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Add Comment' button

**Expected**

User is unable to add comments or attachments. Error message displayed indicating insufficient permissions.

---

## TC-CN00903 — Attempt to upload an invalid file type

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A credit note exists; user has permission to add comments/attachments

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Upload Document' button
3. Select an invalid file type (e.g., .exe, .jpg)
4. Click 'Save' button

**Expected**

System rejects the invalid file type. Error message displayed indicating that only specific file types are allowed.

---

## TC-CN00904 — Attach multiple documents to a credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

A credit note exists; user has permission to add comments/attachments

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Upload Document' button
3. Select a valid document file 1
4. Click 'Upload Document' button again
5. Select a valid document file 2
6. Click 'Save' button

**Expected**

Both documents are saved with the credit note. Both documents are visible to authorized users.

---

## TC-CN00905 — Attempt to add comments when no credit note exists

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

No credit note exists in the system

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Add Comment' button

**Expected**

User is redirected to the credit note creation page or an error message is displayed indicating that no credit note exists.

---

## TC-CN01001 — Commit credit note - Happy path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User has commit permission; credit note exists in DRAFT status; accounting period is open for transaction date

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Commit' button next to draft credit note
3. Verify confirmation dialog
4. Click 'Commit' in dialog
5. Wait for system to process

**Expected**

Credit note status changed to COMMITTED, journal entries generated, inventory updated, vendor payables adjusted.

---

## TC-CN01002 — Commit credit note - No commit permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User does not have commit permission; credit note exists in DRAFT status

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Commit' button next to draft credit note
3. Verify error message

**Expected**

User receives 'Insufficient permission' error message.

---

## TC-CN01003 — Commit credit note - Invalid credit note status

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note does not exist in DRAFT status; user has commit permission; accounting period is open for transaction date

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Commit' button next to credit note in non-DRAFT status
3. Verify error message

**Expected**

User receives 'Invalid credit note status' error message.

---

## TC-CN01004 — Commit credit note - Accounting period closed

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note exists in DRAFT status; user has commit permission; accounting period is closed for transaction date

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Commit' button next to draft credit note
3. Verify error message

**Expected**

User receives 'Accounting period is closed' error message.

---

## TC-CN01005 — Commit credit note - Date out of range

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Credit note exists in DRAFT status; user has commit permission; transaction date is outside allowed range

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Commit' button next to draft credit note
3. Verify error message

**Expected**

User receives 'Transaction date out of range' error message.

---

## TC-CN01101 — Void committed credit note - Happy Path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A committed credit note exists and the user has the necessary permission

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Committed' status filter
3. Select a committed credit note
4. Click 'Void' button
5. Confirm void action

**Expected**

The credit note status changes to 'VOID' and reversing journal entries are created.

---

## TC-CN01102 — Void committed credit note - No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A committed credit note exists but the user does not have the necessary permission

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Committed' status filter
3. Select a committed credit note
4. Attempt to click 'Void' button

**Expected**

User receives an error message indicating they do not have permission to void the credit note.

---

## TC-CN01103 — Void committed credit note - Invalid Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

An invalid credit note exists in committed status (e.g., non-existent ID)

**Steps**

1. Navigate to /procurement/credit-note
2. Enter an invalid credit note ID
3. Click on 'Void' button

**Expected**

An error message is displayed indicating that the credit note could not be found.

---

## TC-CN01104 — Void committed credit note - Closed Accounting Period

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Accounting period is closed and a committed credit note exists

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Committed' status filter
3. Select a committed credit note
4. Attempt to click 'Void' button

**Expected**

User receives an error message indicating that the accounting period is closed and voiding is not allowed.

---

## TC-CN01105 — Void committed credit note - Edge Case - Multiple Credit Notes

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple committed credit notes exist and one of them is selected

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Committed' status filter
3. Select multiple committed credit notes
4. Click 'Void' button

**Expected**

The system prompts the user to select a single credit note for voiding.

---

## TC-CN10101 — Happy Path - Generate Stock Movements for Quantity-Based Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A credit note of type QUANTITY_RETURN with all items having selected lots and inventory locations is present and in the COMMITTED status.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the 'View' button of the committed credit note
3. Click on 'Generate Stock Movements'

**Expected**

Stock movements are generated, reducing the inventory balance for returned items.

---

## TC-CN10102 — Negative Case - Generate Stock Movements with Invalid Credit Note Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note of a type other than QUANTITY_RETURN with all items having selected lots and inventory locations is present and in the COMMITTED status.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the 'View' button of the committed credit note
3. Click on 'Generate Stock Movements'

**Expected**

Error message displayed indicating the credit note type is not supported for stock movement generation.

---

## TC-CN10103 — Negative Case - Generate Stock Movements Without Selected Lots _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note of type QUANTITY_RETURN with some items missing selected lots and inventory locations is present and in the COMMITTED status.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the 'View' button of the committed credit note
3. Attempt to click on 'Generate Stock Movements'

**Expected**

Error message displayed indicating that all items must have selected lots.

---

## TC-CN10104 — Edge Case - Generate Stock Movements After Changing Credit Note Status _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note of type QUANTITY_RETURN with all items having selected lots and inventory locations is present and in the PENDING status.

**Steps**

1. Change the credit note status to COMMITTED
2. Navigate to /procurement/credit-note
3. Click on the 'View' button of the now committed credit note
4. Click on 'Generate Stock Movements'

**Expected**

Stock movements are generated, reducing the inventory balance for returned items.

---

## TC-CN10105 — Edge Case - Generate Stock Movements with No Inventory Locations Configured _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note of type QUANTITY_RETURN with all items having selected lots is present and in the COMMITTED status, but no inventory locations are configured.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the 'View' button of the committed credit note
3. Click on 'Generate Stock Movements'

**Expected**

Error message displayed indicating that inventory locations must be configured.

---

## TC-CN10201 — Generate Journal Entries - Happy Path _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note status is COMMITTED, GL account mapping is configured, accounting period is open, and vendor account exists.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on COMMITTED credit note
3. Click 'Generate Journal Entries'

**Expected**

Journal entries are generated automatically, debiting accounts payable and crediting inventory and tax accounts.

---

## TC-CN10202 — Generate Journal Entries - Invalid GL Account Mapping _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note status is COMMITTED, GL account mapping is invalid, accounting period is open, and vendor account exists.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on COMMITTED credit note
3. Click 'Generate Journal Entries'

**Expected**

Error message displayed indicating invalid GL account mapping.

---

## TC-CN10203 — Generate Journal Entries - Accounting Period Closed _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note status is COMMITTED, GL account mapping is configured, accounting period is closed, and vendor account exists.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on COMMITTED credit note
3. Click 'Generate Journal Entries'

**Expected**

Error message displayed indicating accounting period is closed.

---

## TC-CN10204 — Generate Journal Entries - No Vendor Account _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note status is COMMITTED, GL account mapping is configured, accounting period is open, and vendor account does not exist.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on COMMITTED credit note
3. Click 'Generate Journal Entries'

**Expected**

Error message displayed indicating no vendor account exists.

---

## TC-CN10205 — Generate Journal Entries - Large Volume of Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple credit notes are COMMITTED, GL account mapping is configured, accounting period is open, and vendor account exists.

**Steps**

1. Navigate to /procurement/credit-note
2. Select multiple COMMITTED credit notes
3. Click 'Generate Journal Entries'

**Expected**

Journal entries are generated for all selected credit notes.

---

## TC-CN10301 — Happy Path - Credit Note with Valid Items and Taxes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note has items with amounts, tax rates are configured, vendor tax information is available, and tax invoice reference is provided.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Vendor Name'
4. Fill 'Tax Invoice Reference'
5. Click 'Add Line Item'
6. Fill 'Item Description', 'Quantity', and 'Price'
7. Select applicable 'Tax Rate'
8. Click 'Save'
9. Click 'Update' to modify existing credit note
10. Update 'Quantity' and 'Price'
11. Click 'Save'

**Expected**

System automatically calculates input VAT adjustments based on modified credit note, reducing tax liability by the credit amount.

---

## TC-CN10302 — Negative Case - Missing Tax Rate _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Credit note has items with amounts, but no tax rate is configured for any of the items.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Vendor Name'
4. Fill 'Tax Invoice Reference'
5. Click 'Add Line Item'
6. Fill 'Item Description', 'Quantity', and 'Price'
7. Click 'Save'

**Expected**

System does not calculate any tax adjustments, and an error message is displayed, indicating that tax rates are required.

---

## TC-CN10401 — Happy Path - Process Valid Credit Note for Consumed Item _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A credit note of type QUANTITY_RETURN is created for an item that has been fully consumed.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select the QUANTITY_RETURN credit note
4. Click 'Process'

**Expected**

The cost of goods sold is adjusted, but the inventory balance remains unchanged.

---

## TC-CN10402 — Negative - Process Credit Note with Invalid Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note of a different type than QUANTITY_RETURN is selected.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select a credit note of a different type
4. Click 'Process'

**Expected**

The system displays an error message indicating the credit note type is not supported.

---

## TC-CN10403 — Negative - Process Credit Note Without Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to process credit notes.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'

**Expected**

The system displays a permission error message.

---

## TC-CN10404 — Edge Case - Process Credit Note for Partially Consumed Item _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note is created for an item that has been partially consumed.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select the credit note
4. Click 'Process'

**Expected**

The system displays an error message stating the credit note can only be processed for fully consumed items.

---

## TC-CN10501 — Happy Path - Process Credit Note with Partial Availability _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Inventory has 50 units of Item A, Credit note issued for 60 units of Item A (QUANTITY_RETURN type)

**Steps**

1. Navigate to /procurement/credit-note/new
2. Fill 'Item A' in 'Item' field
3. Fill '60' in 'Return Quantity' field
4. Click 'Submit'

**Expected**

System splits processing: 50 units moved to COGS, 10 units remain unprocessed

---

## TC-CN10502 — Negative - Insufficient Available Inventory _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Inventory has 20 units of Item A, Credit note issued for 50 units of Item A (QUANTITY_RETURN type)

**Steps**

1. Navigate to /procurement/credit-note/new
2. Fill 'Item A' in 'Item' field
3. Fill '50' in 'Return Quantity' field
4. Click 'Submit'

**Expected**

System displays error message: 'Insufficient inventory available for Item A'

---

## TC-CN10503 — Negative - Invalid Credit Note Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Inventory has 40 units of Item A, Credit note issued for 30 units of Item A but type is NOT QUANTITY_RETURN

**Steps**

1. Navigate to /procurement/credit-note/new
2. Fill 'Item A' in 'Item' field
3. Fill '30' in 'Return Quantity' field
4. Select 'Non-Return' in 'Type' field
5. Click 'Submit'

**Expected**

System displays error message: 'Invalid credit note type. Only QUANTITY_RETURN allowed for this action'

---

## TC-CN10504 — Edge Case - Exact Quantity Available _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Inventory has 35 units of Item A, Credit note issued for 35 units of Item A (QUANTITY_RETURN type)

**Steps**

1. Navigate to /procurement/credit-note/new
2. Fill 'Item A' in 'Item' field
3. Fill '35' in 'Return Quantity' field
4. Click 'Submit'

**Expected**

System processes all 35 units to COGS

---

## TC-CN10601 — Happy Path - Process Retrospective Vendor Discount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A valid retrospective discount credit note is created with multiple historical GRNs.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select credit note with AMOUNT_DISCOUNT type
4. Verify the credit note references multiple historical GRNs
5. Click 'Process Discount'

**Expected**

The system processes the credit note, allocating the discount proportionally to historical receipts across the GRNs.

---

## TC-CN10604 — Edge Case - Single GRN Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note referencing only one GRN is created.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select a credit note referencing only one GRN

**Expected**

The system processes the credit note without allocating the discount to other GRNs as it only references one GRN.

---

## TC-CN10605 — Edge Case - No Historical GRNs _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note referencing no historical GRNs is created.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Process Credit Note'
3. Select a credit note with no historical GRNs

**Expected**

The system displays an error message indicating no historical GRNs are referenced.

---

## TC-CN20101 — Happy Path - Create Credit Note (server action) _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Server action context established, database connection available, user authenticated and authorized

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Credit Note Date'
4. Fill 'Supplier Name'
5. Fill 'Amount'
6. Click 'Save'

**Expected**

Credit note is created successfully with atomic transaction and proper validation

---

## TC-CN20103 — Negative - Unauthorized User _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Server action context established, database connection available, user not authenticated

**Steps**

1. Navigate to /procurement/credit-note
2. Attempt to click 'New Credit Note'

**Expected**

User is redirected to login page or access is denied

---

## TC-CN20104 — Edge Case - Concurrent Delete _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Server action context established, database connection available, multiple users authenticated and authorized

**Steps**

1. User A navigates to /procurement/credit-note
2. User A clicks 'New Credit Note'
3. User B navigates to /procurement/credit-note
4. User B clicks 'Delete' on the same credit note
5. User A clicks 'Save'

**Expected**

Credit note creation fails due to concurrent deletion, with appropriate error message

---

## TC-CN20201 — Fetch vendor and GRN data with valid input _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User authenticated with purchasing permissions, vendor and GRN data exists in database

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Fetch Vendor and GRN Data'
3. Select a vendor from the dropdown
4. Click 'Fetch'

**Expected**

Vendor and GRN data are successfully fetched and displayed

---

## TC-CN20202 — Fetch vendor and GRN data with invalid vendor selection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User authenticated with purchasing permissions, vendor and GRN data exists in database, invalid vendor selected

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Fetch Vendor and GRN Data'
3. Select an invalid vendor from the dropdown
4. Click 'Fetch'

**Expected**

Error message displayed indicating invalid vendor selection

---

## TC-CN20203 — Fetch vendor and GRN data when no vendor data exists _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User authenticated with purchasing permissions, no vendor and GRN data exists in database

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Fetch Vendor and GRN Data'
3. Select a vendor from the dropdown
4. Click 'Fetch'

**Expected**

No vendor and GRN data are fetched and an appropriate message is displayed

---

## TC-CN20204 — Fetch vendor and GRN data with no vendor permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User authenticated but does not have purchasing permissions, vendor and GRN data exists in database

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Fetch Vendor and GRN Data'
3. Select a vendor from the dropdown
4. Click 'Fetch'

**Expected**

Access denied message displayed

---

## TC-CN20205 — Fetch vendor and GRN data with multiple vendors selected _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User authenticated with purchasing permissions, multiple vendors and GRN data exists in database

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Fetch Vendor and GRN Data'
3. Select multiple vendors from the dropdown
4. Click 'Fetch'

**Expected**

Error message displayed indicating multiple vendors cannot be selected

---

## TC-CN20301 — Happy Path - Commitment Transaction _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A credit note exists with DRAFT status and accounting period open for document date.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Execute Commitment' button
3. Wait for the transaction to complete
4. Verify that journal entries, stock movements, and vendor balance are updated

**Expected**

Transaction executed successfully, journal entries, stock movements, and vendor balance updated as expected

---

## TC-CN20302 — Negative - No Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

No credit note exists with DRAFT status.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Execute Commitment' button
3. Observe error message

**Expected**

Error message displayed indicating no draft credit note exists

---

## TC-CN20303 — Negative - Invalid Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note exists with DRAFT status, but the accounting period is closed for the document date.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Execute Commitment' button
3. Observe error message

**Expected**

Error message displayed indicating the accounting period is closed for the document date

---

## TC-CN20304 — Edge Case - Document Date Outside Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

A credit note exists with DRAFT status, and the document date is outside the open accounting period.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Execute Commitment' button
3. Observe error message

**Expected**

Error message displayed indicating the document date is outside the open accounting period

---

## TC-CN20305 — Negative - Insufficient Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note exists with DRAFT status, and the user does not have permission to execute commitment transactions.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on 'Execute Commitment' button
3. Observe error message

**Expected**

Error message displayed indicating insufficient permissions to execute commitment transactions

---

## TC-CN20401 — Happy Path - Void Existing Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A credit note exists with COMMITTED status. The accounting period is open for the void date. The user has the manager role and void permission.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the credit note to be voided
3. Click the 'Void' button
4. Verify the journal entries are reversed
5. Verify the inventory balance is restored

**Expected**

The credit note is voided, journal entries are reversed, and inventory balance is restored.

---

## TC-CN20402 — Negative Case - No Void Permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note exists with COMMITTED status. The accounting period is open for the void date. The user does not have the void permission.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the credit note to be voided
3. Click the 'Void' button
4. Verify the system denies the action

**Expected**

The system denies the user's attempt to void the credit note.

---

## TC-CN20403 — Negative Case - Dependent Transactions Exist _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note exists with COMMITTED status. Dependent transactions exist. The accounting period is open for the void date. The user has the manager role and void permission.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the credit note to be voided
3. Click the 'Void' button
4. Verify the system denies the action due to dependent transactions

**Expected**

The system denies the user's attempt to void the credit note due to existing dependent transactions.

---

## TC-CN20404 — Edge Case - Void During Closed Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

A credit note exists with COMMITTED status. The accounting period is closed. The user has the manager role and void permission.

**Steps**

1. Navigate to /procurement/credit-note
2. Click on the credit note to be voided
3. Click the 'Void' button
4. Verify the system denies the action due to the closed accounting period

**Expected**

The system denies the user's attempt to void the credit note due to the closed accounting period.

---

## TC-CN20501 — Happy Path - FIFO Calculation for Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note items with lot selections and inventory lot cost data available.

**Steps**

1. Navigate to /procurement/credit-note
2. Select credit note with lot selections
3. Click 'Calculate Costs' button
4. Verify FIFO method is applied
5. Verify cost calculation is correct based on FIFO method

**Expected**

FIFO method is correctly applied, and cost calculation is accurate based on selected lots.

---

## TC-CN20502 — Negative - Invalid Costing Method Selection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note items with lot selections and inventory lot cost data available.

**Steps**

1. Navigate to /procurement/credit-note
2. Select credit note with lot selections
3. Click 'Calculate Costs' button
4. Manually input invalid costing method
5. Verify system does not allow invalid method

**Expected**

System prevents invalid costing method from being selected and provides appropriate error message.

---

## TC-CN20503 — Edge Case - No Lot Selection for Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Credit note items without lot selections and inventory lot cost data available.

**Steps**

1. Navigate to /procurement/credit-note
2. Select credit note without lot selections
3. Click 'Calculate Costs' button
4. Verify system does not allow cost calculation without lot selections

**Expected**

System prevents cost calculation without lot selections and provides appropriate error message.

---

## TC-CN20504 — Negative - No Inventory Lot Cost Data _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Credit note items with lot selections and no inventory lot cost data available.

**Steps**

1. Navigate to /procurement/credit-note
2. Select credit note with lot selections
3. Click 'Calculate Costs' button
4. Verify system does not allow cost calculation due to missing lot cost data

**Expected**

System prevents cost calculation due to missing lot cost data and provides appropriate error message.

---

## TC-CN20602 — Negative - Invalid Tax Rate _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note with items and amounts, with an invalid or non-configured tax rate for the document date, and vendor tax registration available.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Enter credit note details including items and amounts
4. Select an invalid or non-configured tax rate
5. Click 'Save'

**Expected**

The system returns an error message indicating the invalid tax rate cannot be applied.

---

## TC-CN20603 — Negative - No Vendor Tax Registration _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note with items and amounts, with tax rates configured for the document date but no vendor tax registration available.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Enter credit note details including items and amounts
4. Click 'Save'

**Expected**

The system returns an error message indicating vendor tax registration is required.

---

## TC-CN20604 — Edge Case - Large Credit Note Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note with a very large amount, with tax rates configured for the document date and vendor tax registration available.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Enter credit note details including items and large amounts
4. Click 'Save'

**Expected**

The tax amounts are calculated accurately for the large credit note amount.

---

## TC-CN20605 — Edge Case - Zero Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note with an item amount of zero, with tax rates configured for the document date and vendor tax registration available.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Enter credit note details including items with zero amount
4. Click 'Save'

**Expected**

The tax amounts for items with zero amount are set to zero.

---

## TC-CN20702 — Generate Journal Entries - Invalid Credit Note ID _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A non-existent credit note commitment ID is entered.

**Steps**

1. Navigate to /journal-entries
2. Click 'Generate Entries'
3. Enter invalid credit note commitment ID
4. Verify an error message is displayed.

**Expected**

An error message is shown indicating the invalid credit note ID.

---

## TC-CN20703 — Generate Journal Entries - User with Limited Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A user with limited permissions attempts to generate journal entries.

**Steps**

1. Log in as a user with limited permissions
2. Navigate to /journal-entries
3. Click 'Generate Entries'
4. Verify an error message is displayed.

**Expected**

An error message is shown indicating insufficient permissions.

---

## TC-CN20704 — Generate Journal Entries - Simultaneous Multiple Commitments _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple credit note commitments are generated simultaneously.

**Steps**

1. Navigate to /journal-entries
2. Click 'Generate Entries'
3. Simultaneously initiate journal entry generation for multiple commitments
4. Verify that journal entries are generated for all commitments.

**Expected**

Journal entries are successfully generated for all commitments without any errors.

---

## TC-CN20705 — Generate Journal Entries - System Timeouts _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

The server is experiencing high load or slow response times.

**Steps**

1. Navigate to /journal-entries
2. Click 'Generate Entries'
3. Wait for a long period
4. Verify that the system handles the timeout and does not generate incomplete journal entries.

**Expected**

The system handles the timeout gracefully, possibly prompting a retry or showing a warning message.

---

## TC-CN20801 — Generate Stock Movement - Happy Path _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

The system is initialized and the inventory balance is set to a positive value.

**Steps**

1. Navigate to /stock/movements
2. Click 'Generate Stock Movement'
3. Select 'Credit Note' as movement type
4. Enter valid quantity and lot number
5. Click 'Submit'

**Expected**

The system generates a negative stock movement, reducing the inventory balance by the specified quantity.

---

## TC-CN20802 — Generate Stock Movement - Invalid Quantity _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

The system is initialized and the inventory balance is set to a positive value.

**Steps**

1. Navigate to /stock/movements
2. Click 'Generate Stock Movement'
3. Select 'Credit Note' as movement type
4. Enter invalid quantity (negative or zero)
5. Click 'Submit'

**Expected**

The system displays an error message indicating invalid quantity and does not generate the stock movement.

---

## TC-CN20803 — Generate Stock Movement - Insufficient Inventory _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

The system is initialized and the inventory balance is set to a value less than the requested quantity.

**Steps**

1. Navigate to /stock/movements
2. Click 'Generate Stock Movement'
3. Select 'Credit Note' as movement type
4. Enter quantity greater than current inventory
5. Click 'Submit'

**Expected**

The system displays an error message indicating insufficient inventory and does not generate the stock movement.

---

## TC-CN20804 — Generate Stock Movement - No Permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

The system is initialized and the user has no permission to generate stock movements.

**Steps**

1. Log in as a user without permission to generate stock movements
2. Navigate to /stock/movements
3. Click 'Generate Stock Movement'

**Expected**

The system displays an error message indicating insufficient permissions and does not allow the stock movement generation.

---

## TC-CN20805 — Generate Stock Movement - Edge Case - Maximum Lot Quantity _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

The system is initialized with a lot quantity that is the maximum allowed.

**Steps**

1. Navigate to /stock/movements
2. Click 'Generate Stock Movement'
3. Select 'Credit Note' as movement type
4. Enter the maximum allowed lot quantity
5. Click 'Submit'

**Expected**

The system generates a negative stock movement reducing the inventory balance by the maximum allowed lot quantity.

---

## TC-CN20901 — Upload valid attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A credit note exists and the user has upload permission.

**Steps**

1. Navigate to credit note detail page
2. Click 'Add Attachment'
3. Fill file input with valid file
4. Click 'Upload'

**Expected**

Attachment is uploaded and displayed on the credit note detail page.

---

## TC-CN20902 — Try to upload invalid attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note exists and the user has upload permission.

**Steps**

1. Navigate to credit note detail page
2. Click 'Add Attachment'
3. Fill file input with invalid file (e.g., image instead of pdf)
4. Click 'Upload'

**Expected**

Error message is displayed and the invalid file is not uploaded.

---

## TC-CN20903 — Delete attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A credit note exists, has an attachment, and the user has delete permission.

**Steps**

1. Navigate to credit note detail page
2. Find the attachment to delete
3. Click 'Delete' on the attachment
4. Confirm the delete action

**Expected**

Attachment is removed from the credit note detail page.

---

## TC-CN20904 — Attempt to delete attachment without permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A credit note exists, has an attachment, and the user does not have delete permission.

**Steps**

1. Navigate to credit note detail page
2. Find the attachment to delete
3. Attempt to click 'Delete' on the attachment

**Expected**

User is denied access or an error message is displayed.

---

## TC-CN20905 — Upload large file _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A credit note exists and the user has upload permission. Storage service can handle large files.

**Steps**

1. Navigate to credit note detail page
2. Click 'Add Attachment'
3. Fill file input with a large file
4. Click 'Upload'

**Expected**

Attachment is uploaded and stored without issues.

---

## TC-CN21003 — Edge Case - Large Volume of Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

System has a high volume of credit notes created within a short period.

**Steps**

1. Navigate to /procurement/credit-note
2. Wait for system to process all credit notes
3. Verify that all credit notes are correctly logged in the audit trail

**Expected**

All credit notes are processed and logged in the audit trail without errors.

---

## TC-CN21101 — Happy Path - Generate Valid CN Number _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Database sequence table exists, transaction context active

**Steps**

1. Navigate to /procurement/credit-note/new
2. Click 'Generate CN Number'

**Expected**

Unique CN number in the format CN-YYMM-NNNN generated and displayed

---

## TC-CN21102 — Negative Path - Generate CN Number When Sequence Table Does Not Exist _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table does not exist, transaction context active

**Steps**

1. Navigate to /procurement/credit-note/new
2. Click 'Generate CN Number'

**Expected**

Error returned indicating that the database sequence table does not exist

---

## TC-CN21103 — Negative Path - Generate CN Number Without Transaction Context _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table exists, no active transaction context

**Steps**

1. Navigate to /procurement/credit-note/new
2. Click 'Generate CN Number'

**Expected**

Error returned indicating that a transaction context is required

---

## TC-CN21104 — Edge Case - Generate CN Number at Month End _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

Database sequence table exists, transaction context active, current month's sequence has reached its limit

**Steps**

1. Navigate to /procurement/credit-note/new
2. Click 'Generate CN Number'

**Expected**

New month's sequence starts with 0001 and continues from where the previous month left off

---

## TC-CN21105 — Negative Path - Generate CN Number During System Maintenance _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table exists, transaction context active, system under maintenance

**Steps**

1. Navigate to /procurement/credit-note/new
2. Click 'Generate CN Number'

**Expected**

Error returned indicating that the system is under maintenance and the operation cannot be performed

---

## TC-CN21201 — Happy Path - Credit Note Commitment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Vendor account exists and active, credit note amount calculated, transaction context active

**Steps**

1. Navigate to /procurement/credit-note
2. Select a credit note
3. Click 'Commit Credit Note'

**Expected**

Vendor balance is updated accordingly

---

## TC-CN21202 — Negative Case - Vendor Account Inactive _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Vendor account inactive, credit note amount calculated, transaction context active

**Steps**

1. Navigate to /procurement/credit-note
2. Select a credit note
3. Click 'Commit Credit Note'

**Expected**

System rejects the action and displays an error message

---

## TC-CN21203 — Negative Case - Invalid Credit Note Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Vendor account exists and active, invalid credit note amount, transaction context active

**Steps**

1. Navigate to /procurement/credit-note
2. Create a new credit note with invalid amount
3. Click 'Commit Credit Note'

**Expected**

System rejects the action and displays an error message

---

## TC-CN21204 — Edge Case - Void Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

Vendor account exists and active, credit note amount calculated, transaction context active, committed credit note

**Steps**

1. Navigate to /procurement/credit-note
2. Select a committed credit note
3. Click 'Void Credit Note'

**Expected**

Vendor balance is updated and the credit note status is changed to voided

---

## TC-CN21301 — Valid Credit Note Data _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A valid credit note is submitted with all required fields.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Invoice Number'
4. Fill 'Credit Amount'
5. Select 'Supplier'
6. Click 'Save'

**Expected**

Credit note data is successfully validated and saved without any errors.

---

## TC-CN21302 — Missing Required Fields _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note is submitted with missing required fields.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Click 'Save'

**Expected**

System displays error messages for missing required fields.

---

## TC-CN21303 — Invalid Credit Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note with an invalid credit amount (negative or zero) is submitted.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Fill 'Invoice Number'
4. Fill 'Credit Amount' with a negative value or zero
5. Click 'Save'

**Expected**

System displays an error message for the invalid credit amount.

---

## TC-CN21304 — Expired Supplier _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

A credit note is submitted with an expired supplier.

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'New Credit Note'
3. Select an expired supplier
4. Click 'Save'

**Expected**

System displays an error message for the expired supplier.

---

## TC-CN21401 — Happy Path - Real-time Credit Note Sync _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

WebSocket or SSE connection available, Cache layer configured, User session active

**Steps**

1. Navigate to /procurement/credit-note
2. Click 'Refresh' button
3. Wait for 5 seconds

**Expected**

Credit note list and details are updated in real-time

---

## TC-CN21402 — Negative Case - No WebSocket Connection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Cache layer configured, User session active

**Steps**

1. Disable WebSocket or SSE connection in network settings
2. Navigate to /procurement/credit-note
3. Click 'Refresh' button

**Expected**

Real-time updates do not occur; cache remains unchanged

---

## TC-CN21403 — Edge Case - User Session Expired _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

WebSocket or SSE connection available, Cache layer configured

**Steps**

1. Navigate to /procurement/credit-note
2. Wait for user session to expire
3. Click 'Refresh' button

**Expected**

System prompts for user authentication; real-time updates fail

---


<sub>Last regenerated: 2026-04-27 · git b63e3e8</sub>
