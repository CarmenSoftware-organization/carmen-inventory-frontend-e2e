# Purchase Request — User Stories

_Generated from `tests/015-purchase-request.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Purchase Request
**Spec:** `tests/015-purchase-request.spec.ts`
**Default role:** Requestor
**Total test cases:** 131 (85 High / 28 Medium / 9 Low / 9 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR00101 | Create a basic purchase request with default values | Critical | Happy Path |
| TC-PR00102 | Create a purchase request with FOC item | High | Happy Path |
| TC-PR00103 | Attempt to create a purchase request with invalid delivery date | Critical | Negative |
| TC-PR00104 | Create a purchase request without login | High | Negative |
| TC-PR00105 | Add line items with zero quantity and unit price | High | Edge Case |
| TC-PR00201 | Edit draft PR - Happy Path | High | Happy Path |
| TC-PR00202 | Edit returned PR - Negative Case | High | Negative |
| TC-PR00203 _(skipped)_ | Edit PR with version conflict - Edge Case | Medium | Edge Case |
| TC-PR00301 | Submit valid PR with all required fields | Critical | Happy Path |
| TC-PR00302 | Submit PR with missing required fields | High | Negative |
| TC-PR00303 | Submit PR without required permissions | High | Negative |
| TC-PR00304 | Submit PR with extremely large value | High | Edge Case |
| TC-PR00305 | Submit PR with invalid item codes | High | Negative |
| TC-PR00401 | View own pending PR as Requestor | High | Happy Path |
| TC-PR00402 | Attempt to view PR with no permissions | High | Negative |
| TC-PR00403 | View PR with all approvals completed | High | Happy Path |
| TC-PR00404 | View PR with missing attachments | Medium | Edge Case |
| TC-PR00501 | Approve Purchase Request - Happy Path | Critical | Happy Path |
| TC-PR00502 | Approve Purchase Request - Invalid Approval Authority | High | Negative |
| TC-PR00503 | Approve Purchase Request - No Additional Approvals Needed | Medium | Edge Case |
| TC-PR00504 | Approve Purchase Request - Multiple Approvals Required | High | Edge Case |
| TC-PR00601 | Approver rejects PR with valid reason | High | Happy Path |
| TC-PR00602 | Reject PR with too short reason | High | Negative |
| TC-PR00603 | Reject PR without reason | High | Negative |
| TC-PR00604 | Reject PR with no permission | High | Negative |
| TC-PR00605 | Reject PR with very high value | High | Happy Path |
| TC-PR00701 _(skipped)_ | Happy Path - Recall PR | High | Happy Path |
| TC-PR00702 _(skipped)_ | Negative - No Recall Reason | Medium | Negative |
| TC-PR00703 _(skipped)_ | Edge Case - Multiple Approvals | Low | Edge Case |
| TC-PR00704 _(skipped)_ | Negative - Insufficient Permissions | High | Negative |
| TC-PR00801 | Cancel PR - Happy Path | High | Happy Path |
| TC-PR00802 | Cancel PR - No Permission | Medium | Negative |
| TC-PR00803 | Cancel PR - PR is Completed | High | Negative |
| TC-PR00804 | Cancel PR - PR with Pending Approvals | Medium | Happy Path |
| TC-PR00901 | Happy Path - Add Valid Attachment | High | Happy Path |
| TC-PR00902 | Negative - Invalid File Type | Medium | Negative |
| TC-PR00903 | Edge Case - Maximum File Size Exceeded | Medium | Edge Case |
| TC-PR00904 | Negative - No Permission | High | Negative |
| TC-PR01002 | Negative - Empty Comment | Medium | Negative |
| TC-PR01003 | Edge Case - Comment Length Limit | Low | Edge Case |
| TC-PR01004 | Negative - No Permission to Add Comment | Medium | Negative |
| TC-PR01101 | Happy Path: Convert Approved PR to PO | Critical | Happy Path |
| TC-PR01102 | Negative: Invalid Vendor | High | Negative |
| TC-PR01103 | Edge Case: PR with No Delivery Date | Medium | Edge Case |
| TC-PR01104 | Negative: No Permission to Convert PR | High | Negative |
| TC-PR01201 | Happy Path - View Inventory and Add Item with Suggested Price | High | Happy Path |
| TC-PR01202 | Negative - No Inventory Data Available | High | Negative |
| TC-PR01203 | Edge Case - Below Reorder Point | High | Edge Case |
| TC-PR01301 _(skipped)_ | Create Template from Existing PR | High | Happy Path |
| TC-PR01302 _(skipped)_ | Duplicate Template Name | Medium | Edge Case |
| TC-PR01303 _(skipped)_ | Create Organization-Wide Template | High | Happy Path |
| TC-PR01304 _(skipped)_ | Invalid Template Name | High | Negative |
| TC-PR01305 _(skipped)_ | No Line Items Included | High | Negative |
| TC-PR01401 | Happy Path - Create PR with Visible Prices | High | Happy Path |
| TC-PR01402 | Negative Case - Invalid Delivery Date | High | Negative |
| TC-PR01404 | Negative Case - Hide Price with Invalid Toggle | High | Negative |
| TC-PR01501 | Happy Path - Create PR with Full Delivery Details | High | Happy Path |
| TC-PR01502 | Negative - Invalid Required Date | Medium | Negative |
| TC-PR01503 | Edge Case - Long Comment | Medium | Edge Case |
| TC-PR01504 | Negative - No Permission to Submit PR | High | Negative |
| TC-PR01601 | Approve PR with FOC and full pricing visibility | High | Happy Path |
| TC-PR01603 | Return PR for revision with FOC and full pricing visibility | High | Edge Case |
| TC-PR01604 | Approve PR with hidden prices | High | Happy Path |
| TC-PR01605 | Approve PR with override amounts over 20% | High | Edge Case |
| TC-PR01701 | Happy Path - Valid Input | High | Happy Path |
| TC-PR01703 | Edge Case - Empty Discount Rate | Medium | Edge Case |
| TC-PR01705 | Edge Case - No Tax Profile | Medium | Edge Case |
| TC-PR01801 | Return PR with valid reason | High | Happy Path |
| TC-PR01802 | Return PR with empty reason | High | Negative |
| TC-PR01803 | Return PR with minimum 10 character reason | High | Happy Path |
| TC-PR01804 | Return PR with very high value and insufficient permissions | High | Negative |
| TC-PR01902 | Submit PR with missing unit price | High | Negative |
| TC-PR01903 | Submit PR with incomplete vendor selection | High | Negative |
| TC-PR01904 | Submit PR with very high value | High | Edge Case |
| TC-PR01905 | Submit PR with no permission | High | Negative |
| TC-PR02001 | Happy Path - Reject Purchase Request with Valid Reason | High | Happy Path |
| TC-PR02002 | Negative Case - Invalid Reason Length | High | Negative |
| TC-PR02003 | Edge Case - Reject with No Reason Entered | Medium | Edge Case |
| TC-PR02004 | Negative Case - No Permission to Reject | High | Negative |
| TC-PR02005 | Edge Case - Reject with Existing Rejection | Medium | Edge Case |
| TC-PR02101 | Approve Multiple Line Items | High | Happy Path |
| TC-PR02102 | Reject Multiple Line Items | High | Happy Path |
| TC-PR02103 | Return Multiple Line Items to Requestor | High | Happy Path |
| TC-PR02104 | Split Multiple Line Items | High | Happy Path |
| TC-PR02105 | Set Date Required for Multiple Line Items | High | Happy Path |
| TC-PR02201 | Add a new budget allocation | High | Happy Path |
| TC-PR02202 | Edit an existing budget allocation | High | Happy Path |
| TC-PR02203 | Delete a budget allocation | High | Happy Path |
| TC-PR02204 | Attempt to edit an allocation without permission | High | Negative |
| TC-PR02205 | Attempt to delete a required allocation | High | Negative |
| TC-PR02301 | Happy Path - Split PR with Valid Inputs | High | Happy Path |
| TC-PR02302 | Negative - Insufficient Items for Split | High | Negative |
| TC-PR02303 | Edge Case - No Items to Split | Medium | Edge Case |
| TC-PR02304 | Negative - Invalid Reason for Return | High | Negative |
| TC-PR10101 _(skipped)_ | Happy Path - Valid PR Data | Critical | Happy Path |
| TC-PR10102 _(skipped)_ | Negative - No PR Data | High | Negative |
| TC-PR10103 _(skipped)_ | Negative - Date Format Error | High | Negative |
| TC-PR10104 _(skipped)_ | Edge Case - Year Change | Medium | Edge Case |
| TC-PR10105 _(skipped)_ | Negative - Database Sequence Exhausted | High | Negative |
| TC-PR10201 _(skipped)_ | Happy Path: Add Items and Verify Totals | Critical | Happy Path |
| TC-PR10202 _(skipped)_ | Negative: Invalid Discount Percentage | High | Negative |
| TC-PR10203 _(skipped)_ | Edge Case: Multi-Currency with Exchange Rate | Medium | Edge Case |
| TC-PR10301 _(skipped)_ | Happy Path - General PR | Critical | Happy Path |
| TC-PR10302 _(skipped)_ | Negative - Invalid Department ID | High | Negative |
| TC-PR10303 _(skipped)_ | Edge Case - High Value Asset PR | High | Edge Case |
| TC-PR10304 _(skipped)_ | Negative - No User Assigned to Role | High | Negative |
| TC-PR10401 _(skipped)_ | Happy Path - Sufficient Funds | High | Happy Path |
| TC-PR10402 _(skipped)_ | Negative Case - Insufficient Funds | High | Negative |
| TC-PR10403 _(skipped)_ | Edge Case - No Budget Codes | High | Edge Case |
| TC-PR10501 _(skipped)_ | Happy Path - PR Submitted Notification | Critical | Happy Path |
| TC-PR10502 _(skipped)_ | Negative - Invalid Email Preference | High | Negative |
| TC-PR10503 _(skipped)_ | Edge Case - PR Rejected with No Pending Approvals | Medium | Edge Case |
| TC-PR10504 _(skipped)_ | Negative - User Not Authorized to Approve | High | Negative |
| TC-PR20101 _(skipped)_ | Happy Path - PR Sync to ERP | High | Happy Path |
| TC-PR20102 _(skipped)_ | Negative Case - ERP Sync Disabled | High | Negative |
| TC-PR20103 _(skipped)_ | Edge Case - Multiple PRs in Batch | Medium | Edge Case |
| TC-PR20201 _(skipped)_ | Import valid CSV file | Low | Happy Path |
| TC-PR20203 _(skipped)_ | Duplicate PR import | Low | Edge Case |
| TC-PR20204 _(skipped)_ | Import with unauthorized access | Low | Negative |
| TC-PR20205 _(skipped)_ | Import with no file selected | Low | Edge Case |
| TC-PR30101 _(skipped)_ | Happy Path - Reminder Notification Sent | Medium | Happy Path |
| TC-PR30102 _(skipped)_ | Negative Case - Approver with No Pending Requests | Medium | Negative |
| TC-PR30103 _(skipped)_ | Edge Case - Approver has 3 Reminders | Low | Edge Case |
| TC-PR30104 _(skipped)_ | Negative Case - Approver with No Access | Low | Negative |
| TC-PR30201 _(skipped)_ | Escalation for Overdue PRs with Valid Inputs | Medium | Happy Path |
| TC-PR30202 _(skipped)_ | Escalation Job Fails Due to Database Error | High | Negative |
| TC-PR30203 _(skipped)_ | Escalation Notification Sent to Approver Manager but No Manager Found | Medium | Edge Case |
| TC-PR30204 _(skipped)_ | Escalation Job Runs During Non-Scheduled Time | Low | Edge Case |
| TC-PR30301 _(skipped)_ | Happy Path - Scheduled Archival | High | Happy Path |
| TC-PR30302 _(skipped)_ | Negative - Invalid Date Range | High | Negative |
| TC-PR30303 _(skipped)_ | Edge Case - No Eligible PRs | Medium | Edge Case |

---

## TC-PR00101 — Create a basic purchase request with default values

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor (requestor@blueledgers.com); on list page

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Verify default values are pre-filled (date, department, location, currency, status)
4. Select PR type as General
5. Enter delivery date
6. Add one line item with product details auto-filled
7. Enter item description and specifications
8. Enter quantity and unit of measure
9. Click 'Add' to add item
10. System calculates line totals and PR total
11. Fill in any additional notes or internal notes
12. Click 'Save as Draft'

**Expected**

System generates reference number, saves PR to database, logs activity, and redirects to PR detail page with all fields populated correctly.

---

## TC-PR00102 — Create a purchase request with FOC item

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor and has FOC quantities available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Select PR type as General
4. Add one line item and select FOC option
5. Enter FOC quantity and unit
6. System sets unit price to 0
7. Click 'Add' to add item
8. System calculates line totals and PR total
9. Fill in any additional notes or internal notes
10. Click 'Save as Draft'

**Expected**

System saves PR with FOC item correctly, calculates PR total, and logs activity.

---

## TC-PR00103 — Attempt to create a purchase request with invalid delivery date

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Logged in as Requestor

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Select PR type as General
4. Enter invalid delivery date in the past
5. Click 'Save as Draft'

**Expected**

System displays error message for invalid date and does not save PR.

---

## TC-PR00104 — Create a purchase request without login

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is not logged in (no auth fixture)

**Steps**

1. Navigate to /procurement/purchase-request

**Expected**

System redirects user to login page or displays error message.

---

## TC-PR00105 — Add line items with zero quantity and unit price

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Add one line item with zero quantity and unit price
4. Click 'Add'

**Expected**

System displays error message for zero quantity or unit price and does not add item.

---

## TC-PR00201 — Edit draft PR - Happy Path

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A draft PR exists with at least one line item and correct header information

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on existing draft PR
3. Modify delivery date, add a note, and edit one line item
4. Click 'Save Draft'

**Expected**

PR header and line item details are updated, and PR remains in draft status. Version number is incremented.

---

## TC-PR00202 — Edit returned PR - Negative Case

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A returned PR exists with a rejection reason

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on returned PR
3. Attempt to modify delivery date and notes

**Expected**

System prevents modification and displays error message. PR remains in returned status.

---

## TC-PR00203 — Edit PR with version conflict - Edge Case _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple users attempt to edit the same PR simultaneously, leading to version conflict

**Steps**

1. User A and User B both have draft PR open
2. User A modifies PR and saves
3. User B modifies PR and attempts to save
4. User B receives version conflict warning

**Expected**

User B is prompted to resolve conflict or discard changes. PR status remains unchanged.

> _Note: Requires concurrent multi-user session orchestration; tracked but skipped in single-worker E2E._

---

## TC-PR00301 — Submit valid PR with all required fields

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor and has a draft PR ready

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit for Approval' button
3. Wait for validation
4. Verify validation passes
5. Confirm submission

**Expected**

PR is submitted successfully, status updated to 'In-progress', approval records created, and first approver notified.

---

## TC-PR00302 — Submit PR with missing required fields

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor and has a draft PR with missing fields

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit for Approval' button
3. Wait for validation
4. Verify validation fails

**Expected**

System displays error messages for missing fields.

---

## TC-PR00303 — Submit PR without required permissions

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Budget Manager (FC) and has a draft PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit for Approval' button

**Expected**

System displays an error message indicating insufficient permissions.

---

## TC-PR00304 — Submit PR with extremely large value

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor and has a draft PR with an extremely large value

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit for Approval' button
3. Wait for validation
4. Verify validation fails

**Expected**

System displays an error message indicating the value exceeds the limit.

---

## TC-PR00305 — Submit PR with invalid item codes

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor and has a draft PR with invalid item codes

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit for Approval' button
3. Wait for validation
4. Verify validation fails

**Expected**

System displays error messages for invalid item codes.

---

## TC-PR00401 — View own pending PR as Requestor

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor and has a pending PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on pending PR reference number
3. Verify PR status badge is 'In-progress'
4. Verify approver names and timestamps are displayed

**Expected**

PR detail page is displayed with correct status and approver information

---

## TC-PR00402 — Attempt to view PR with no permissions

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in but does not have permission to view PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR reference number
3. Verify system redirects to error or access denied page

**Expected**

User is unable to view PR detail page and receives appropriate error message

---

## TC-PR00403 — View PR with all approvals completed

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as an Approver (HOD) and a PR is fully approved

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on fully approved PR reference number
3. Verify PR status badge is 'Approved'
4. Verify all approval stages are completed with 'Approved' status

**Expected**

PR detail page is displayed with all approved status and no pending approvals

---

## TC-PR00404 — View PR with missing attachments

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Logged in as an Approver (HOD) and a PR has a missing attachment

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR reference number with missing attachments
3. Verify 'Attachments' list shows missing files

**Expected**

PR detail page displays missing attachment information

---

## TC-PR00501 — Approve Purchase Request - Happy Path

> **As a** Purchase user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Department Manager has received a PR for approval and has the necessary permissions

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on the 'View' link for the purchase request
3. Verify PR details
4. Fill in comments if any
5. Click 'Approve'
6. Verify system validates approver authority
7. Wait for system to update approval record
8. Verify PR status is updated to 'Approved'
9. Verify notifications are sent to PR creator and purchasing staff

**Expected**

Purchase request is approved and all relevant notifications are sent.

---

## TC-PR00502 — Approve Purchase Request - Invalid Approval Authority

> **As a** Purchase user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Finance Manager (FC) has received a PR for approval but does not have the necessary permissions for this stage

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on the 'View' link for the purchase request
3. Try to click 'Approve'
4. Verify system denies permission

**Expected**

System denies approval due to insufficient authority.

---

## TC-PR00503 — Approve Purchase Request - No Additional Approvals Needed

> **As a** Purchase user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

System is configured to require only department manager approval for this PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on the 'View' link for the purchase request
3. Verify PR details
4. Fill in comments if any
5. Click 'Approve'
6. Verify system updates PR status to 'Approved'

**Expected**

Purchase request is approved without additional approvals.

---

## TC-PR00504 — Approve Purchase Request - Multiple Approvals Required

> **As a** Purchase user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

System is configured to require both department and finance manager approvals for this PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on the 'View' link for the purchase request
3. Verify PR details
4. Fill in comments if any
5. Click 'Approve'
6. Verify system identifies next approver
7. Verify system sends notification to next approver

**Expected**

System correctly identifies next approver and sends notification.

---

## TC-PR00601 — Approver rejects PR with valid reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR is created and assigned to a department manager who has approval rights

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the assigned PR
3. Click 'Reject' button
4. Enter rejection reason in dialog
5. Click 'Confirm Rejection'

**Expected**

The PR status changes to 'Void', and a rejection notification is sent to the requestor.

---

## TC-PR00602 — Reject PR with too short reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR is created and assigned to a department manager who has approval rights

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the assigned PR
3. Click 'Reject' button
4. Enter reason less than 10 characters
5. Click 'Confirm Rejection'

**Expected**

A validation error is displayed, preventing confirmation.

---

## TC-PR00603 — Reject PR without reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR is created and assigned to a department manager who has approval rights

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the assigned PR
3. Click 'Reject' button
4. Click 'Confirm Rejection' without entering reason

**Expected**

A validation error is displayed, preventing confirmation.

---

## TC-PR00604 — Reject PR with no permission

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR is created and assigned to a budget manager (FC) who does not have approval rights

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the assigned PR
3. Click 'Reject' button (expected to fail)

**Expected**

The system displays an error message indicating insufficient permissions.

---

## TC-PR00605 — Reject PR with very high value

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR with very high value is created and assigned to a general manager who has approval rights

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the assigned PR
3. Click 'Reject' button
4. Enter rejection reason in dialog
5. Click 'Confirm Rejection'

**Expected**

The PR status changes to 'Void', and a rejection notification is sent to the requestor.

---

## TC-PR00701 — Happy Path - Recall PR _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A requestor has submitted a PR and it is in a pending approval state

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the PR that is in pending state
3. Click 'Recall' button
4. Click 'Yes' on confirmation dialog
5. Fill in recall reason if prompted
6. Click 'Confirm Recall'

**Expected**

The PR is recalled, status changes to 'Draft', and notifications are sent to pending approvers.

---

## TC-PR00702 — Negative - No Recall Reason _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A requestor has submitted a PR and it is in a pending approval state

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the PR that is in pending state
3. Click 'Recall' button
4. Click 'Yes' on confirmation dialog without filling in reason

**Expected**

System prompts user to fill in recall reason and does not proceed with recall.

---

## TC-PR00703 — Edge Case - Multiple Approvals _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

A requestor has submitted a PR and it is in a state with multiple pending approvals

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the PR that is in pending state with multiple approvals
3. Click 'Recall' button
4. Click 'Yes' on confirmation dialog
5. Fill in recall reason if prompted
6. Click 'Confirm Recall'

**Expected**

The PR is recalled, status changes to 'Draft', and notifications are sent to all pending approvers.

---

## TC-PR00704 — Negative - Insufficient Permissions _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A department manager has submitted a PR and it is in a pending approval state

**Steps**

1. Department manager logs in
2. Navigate to /procurement/purchase-request
3. Click the PR that is in pending state
4. Attempt to click 'Recall' button

**Expected**

System denies the action and displays an error message indicating insufficient permissions.

---

## TC-PR00801 — Cancel PR - Happy Path

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor; an active PR exists in the system

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Open' on the PR to be cancelled
3. Click 'Cancel PR'
4. Fill in the cancellation reason: 'Incorrect item description'
5. Confirm cancellation

**Expected**

PR status changes to 'Cancelled', all approvals are cancelled, budget is released if reserved, notifications are sent, and confirmation message is displayed.

---

## TC-PR00802 — Cancel PR - No Permission

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Logged in as Budget Manager (FC); an active PR exists

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Open' on the PR to be cancelled

**Expected**

System displays an error message stating 'Insufficient permissions to cancel this PR.'

---

## TC-PR00803 — Cancel PR - PR is Completed

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor; a PR with status 'Completed' exists

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Open' on the completed PR

**Expected**

System displays an error message stating 'PR cannot be cancelled as it is in the Completed status.'

---

## TC-PR00804 — Cancel PR - PR with Pending Approvals

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager (HOD); a PR with pending approvals exists

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Open' on the PR with pending approvals
3. Click 'Cancel PR'
4. Fill in the cancellation reason: 'Change in requirement'
5. Confirm cancellation

**Expected**

System cancels all pending approvals, PR status changes to 'Cancelled', budget is released if reserved, notifications are sent, and confirmation message is displayed.

---

## TC-PR00901 — Happy Path - Add Valid Attachment

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor with an existing PR open

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Attachments' section
3. Click 'Add Attachment'
4. Click file picker
5. Select valid file
6. Verify file size and type are validated
7. Fill 'Description' field
8. Select 'Quote' as attachment type
9. Click 'Upload'
10. Verify upload progress
11. Verify file is uploaded to storage
12. Verify attachment record is created in database
13. Verify activity is logged
14. Verify success message is displayed
15. Verify updated attachments list

**Expected**

Attachment is successfully added and displayed.

---

## TC-PR00902 — Negative - Invalid File Type

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Logged in as Requestor with an existing PR open

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Attachments' section
3. Click 'Add Attachment'
4. Click file picker
5. Select invalid file type (e.g., .exe)
6. Verify system validation error message
7. Close file picker

**Expected**

Invalid file type is rejected with an error message.

---

## TC-PR00903 — Edge Case - Maximum File Size Exceeded

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor with an existing PR open. Maximum file size limit is known.

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Attachments' section
3. Click 'Add Attachment'
4. Click file picker
5. Select file that exceeds maximum size limit
6. Verify system validation error message
7. Close file picker

**Expected**

File size exceeds maximum limit and is rejected with an error message.

---

## TC-PR00904 — Negative - No Permission

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Department Manager with an existing PR open

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Attachments' section
3. Click 'Add Attachment'
4. Click file picker
5. Select valid file
6. Verify system validation error message about no permission

**Expected**

Department Manager does not have permission to add attachments.

---

## TC-PR01002 — Negative - Empty Comment

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Logged in as Requestor and has a PR created

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Add Comment'
3. Fill comment text ''
4. Click 'Post Comment'

**Expected**

Validation error is shown and comment is not posted. Page remains on comments section.

---

## TC-PR01003 — Edge Case - Comment Length Limit

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor and has a PR created

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Add Comment'
3. Fill comment text 'a'. Repeat this process 2001 times
4. Click 'Post Comment'

**Expected**

Validation error is shown stating comment exceeds maximum length. Comment is not posted. Page remains on comments section.

---

## TC-PR01004 — Negative - No Permission to Add Comment

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Logged in as Finance Manager (FC) and has a PR created

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Add Comment'

**Expected**

Error message is shown stating user does not have permission to add a comment. Page remains on comments section.

---

## TC-PR01101 — Happy Path: Convert Approved PR to PO

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

An approved PR exists in the system

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Convert to PO'
3. Fill 'Vendor' field
4. Adjust 'Delivery Date'
5. Click 'Create PO'

**Expected**

PO is created with PR data, PR status changes to 'Completed', notification sent to creator, success message displayed.

---

## TC-PR01102 — Negative: Invalid Vendor

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

An approved PR exists in the system

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Convert to PO'
3. Fill 'Vendor' field with invalid input
4. Click 'Create PO'

**Expected**

Error message displayed, PO not created, PR status remains unchanged, no notification sent.

---

## TC-PR01103 — Edge Case: PR with No Delivery Date

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

An approved PR exists in the system with no delivery date

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Convert to PO'
3. Click 'Create PO'

**Expected**

PO is created with default delivery date from PR, PR status changes to 'Completed', notification sent to creator, success message displayed.

---

## TC-PR01104 — Negative: No Permission to Convert PR

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

An approved PR exists; only purchasing staff can convert PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Convert to PO'

**Expected**

Access denied message displayed, PR status remains unchanged, no PO created, no notification sent.

---

## TC-PR01201 — Happy Path - View Inventory and Add Item with Suggested Price

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor with permission to create purchase requests

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Click 'Add Line Item'
4. Search for 'Chicken Breast'
5. Verify inventory panel displays correct quantities and prices
6. Enter requested quantity: 20 kg
7. Click 'Save'

**Expected**

Line item is added with correct inventory snapshot and suggested price.

---

## TC-PR01202 — Negative - No Inventory Data Available

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor with permission to create purchase requests

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Click 'Add Line Item'
4. Search for 'Nonexistent Product'
5. Verify no inventory panel is displayed

**Expected**

Inventory panel does not display any data or warnings for nonexistent product.

---

## TC-PR01203 — Edge Case - Below Reorder Point

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor with permission to create purchase requests

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Click 'Add Line Item'
4. Search for 'Beef'
5. Verify inventory panel shows '⚠️ Below reorder point'
6. Enter requested quantity: 50 kg

**Expected**

System alerts user that the quantity requested is below the reorder point and suggests the suggested reorder quantity.

---

## TC-PR01301 — Create Template from Existing PR _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Purchasing Staff and has access to PR-2501-0042

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Open' on PR-2501-0042
3. Click 'Save as Template' button
4. Fill 'Template Name' with 'Weekly Market List - Vegetables'
5. Select 'Market List' as Template Type
6. Fill 'Description' with 'Standard weekly order for fresh vegetables'
7. Click 'Create Template'

**Expected**

Template is created successfully, with items copied from PR-2501-0042.

---

## TC-PR01302 — Duplicate Template Name _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A template named 'Weekly Market List - Vegetables' already exists in the user's department

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Save as Template' on PR-2501-0042
3. Fill 'Template Name' with 'Weekly Market List - Vegetables'
4. Click 'Create Template'

**Expected**

System displays an error message stating 'A template with this name already exists in your department'. Suggests adding a date or version number to the name.

---

## TC-PR01303 — Create Organization-Wide Template _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Purchasing Staff and has permission to create organization-wide templates

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Save as Template' on PR-2501-0042
3. Select 'Organization Wide' as Visibility
4. Click 'Create Template'

**Expected**

Template is created with a status of 'Pending Approval', and a note is displayed indicating the template requires purchasing manager approval.

---

## TC-PR01304 — Invalid Template Name _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Purchasing Staff

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Save as Template' on PR-2501-0042
3. Fill 'Template Name' with a name less than 3 characters
4. Click 'Create Template'

**Expected**

System displays an error message stating 'Template name must be between 3 and 100 characters.'

---

## TC-PR01305 — No Line Items Included _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Purchasing Staff and has access to PR-2501-0042

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Save as Template' on PR-2501-0042
3. Uncheck 'Include all line items'
4. Click 'Create Template'

**Expected**

System displays an error message stating 'At least one line item must be included in the template.'

---

## TC-PR01401 — Happy Path - Create PR with Visible Prices

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor; PR System is operational; Inventory API is available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in 'Department' (auto-filled)
4. Set 'Delivery Date' to future date
5. Fill in 'Description'
6. Fill in 'Justification'
7. Click 'Add Item'
8. Search and select 'Product'
9. Verify 'On-Hand' and 'On-Order' quantities are displayed
10. Fill in 'Quantity', 'Unit of Measure', 'Vendor Name'
11. Fill in 'Unit Price', 'Discount', 'Tax Rate'
12. Click 'Save'
13. Repeat steps 7-12 for additional items
14. Submit PR

**Expected**

PR is created with all fields validated, auto-calculated amounts correct, and PR status set to 'Pending Approval'. Confirmation message with PR reference number is displayed.

---

## TC-PR01402 — Negative Case - Invalid Delivery Date

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor; PR System is operational; Inventory API is available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in 'Department' (auto-filled)
4. Set 'Delivery Date' to past date
5. Fill in 'Description'
6. Fill in 'Justification'
7. Click 'Add Item'
8. Search and select 'Product'
9. Verify 'On-Hand' and 'On-Order' quantities are displayed
10. Fill in 'Quantity', 'Unit of Measure', 'Vendor Name'
11. Fill in 'Unit Price', 'Discount', 'Tax Rate'
12. Click 'Save'
13. Repeat steps 7-12 for additional items
14. Attempt to Submit PR

**Expected**

System displays validation error for 'Delivery Date' field. PR cannot be submitted with a past date.

---

## TC-PR01404 — Negative Case - Hide Price with Invalid Toggle

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Requestor; PR System is operational; Inventory API is available

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in 'Department' (auto-filled)
4. Set 'Delivery Date' to future date
5. Fill in 'Description'
6. Fill in 'Justification'
7. Toggle 'Hide Price' to 'true'
8. Click 'Add Item'
9. Search and select 'Product'
10. Verify 'On-Hand' and 'On-Order' quantities are displayed
11. Fill in 'Quantity', 'Unit of Measure', 'Vendor Name'
12. Attempt to fill in 'Unit Price', 'Discount', 'Tax Rate'
13. Submit PR

**Expected**

System displays validation error for 'Unit Price', 'Discount', 'Tax Rate' fields. PR cannot be submitted with hidden prices.

---

## TC-PR01501 — Happy Path - Create PR with Full Delivery Details

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Requestor with permissions to create PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Create New'
3. Fill in header fields (Department, Delivery Date, Description, Justification)
4. Click 'Add Item'
5. Fill in item fields (Product, Quantity, UOM, Vendor, Pricing)
6. Expand 'Item Details' section
7. Enter comment: 'Deliver to back kitchen entrance, handle with care, keep refrigerated'
8. Select required date: 2025-02-15
9. Select delivery point: DOCK-A - Main Kitchen Loading Dock
10. Review all items with delivery details summary
11. Submit PR

**Expected**

PR is created with all delivery details and saved with status = 'Pending Approval'

---

## TC-PR01502 — Negative - Invalid Required Date

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Logged in as Requestor with permissions to create PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Create New'
3. Fill in header fields
4. Click 'Add Item'
5. Fill in item fields
6. Expand 'Item Details' section
7. Enter comment
8. Select required date: 2024-02-15 (past date)
9. Try to select delivery point
10. Submit PR

**Expected**

System displays error message: 'Required date must be on or after today'

---

## TC-PR01503 — Edge Case - Long Comment

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Logged in as Requestor with permissions to create PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Create New'
3. Fill in header fields
4. Click 'Add Item'
5. Fill in item fields
6. Expand 'Item Details' section
7. Enter comment: 'a' repeated 500 times
8. Verify character counter: '500/500'
9. Select required date
10. Submit PR

**Expected**

PR is created with long comment and saved with status = 'Pending Approval'

---

## TC-PR01504 — Negative - No Permission to Submit PR

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Logged in as Budget Manager with no permission to submit PRs

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Create New'
3. Fill in header fields
4. Click 'Add Item'
5. Fill in item fields
6. Expand 'Item Details'
7. Enter comment
8. Select required date
9. Select delivery point
10. Review items with delivery details
11. Attempt to submit PR

**Expected**

System displays error message: 'User does not have permission to submit purchase requests'

---

## TC-PR01601 — Approve PR with FOC and full pricing visibility

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR with FOC and detailed pricing information has been created and is pending approval

**Steps**

1. Navigate to /procurement/purchase-requests/my-approvals
2. Click on PR-2501-0001
3. Verify all header fields are visible
4. Verify FOC quantities are visible
5. Verify vendor names are visible
6. Verify net amount calculations are correct
7. Verify tax rates and amounts are calculated
8. Verify delivery details are visible
9. Verify override amounts are highlighted
10. Click on 'Approve' button
11. Enter optional approval comment
12. Confirm approval action
13. Verify PR status changes to 'Approved'

**Expected**

PR is approved and status changes to 'Approved'

---

## TC-PR01603 — Return PR for revision with FOC and full pricing visibility

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

A PR with FOC and detailed pricing information has been created and is pending approval

**Steps**

1. Navigate to /procurement/purchase-requests/my-approvals
2. Click on PR-2501-0001
3. Verify all header fields are visible
4. Verify FOC quantities are visible
5. Verify vendor names are visible
6. Verify net amount calculations are correct
7. Verify tax rates and amounts are calculated
8. Verify delivery details are visible
9. Enter required return comment
10. Click on 'Return for Revision' button
11. Enter required return comment
12. Confirm return action
13. Verify PR status changes to 'Returned for Revision'

**Expected**

PR is returned for revision and status changes to 'Returned for Revision'

---

## TC-PR01604 — Approve PR with hidden prices

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR with FOC and detailed pricing, with hide_price=true, has been created and is pending approval

**Steps**

1. Navigate to /procurement/purchase-requests/my-approvals
2. Click on PR-2501-0001
3. Verify 'Requestor chose to hide prices' badge is visible
4. Verify vendor names are visible
5. Verify net amount calculations are correct
6. Verify tax rates and amounts are calculated
7. Verify delivery details are visible
8. Click on 'Approve' button
9. Enter optional approval comment
10. Confirm approval action
11. Verify PR status changes to 'Approved'

**Expected**

PR is approved and status changes to 'Approved' despite hidden prices

---

## TC-PR01605 — Approve PR with override amounts over 20%

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

A PR with FOC, detailed pricing and override amounts >20% has been created and is pending approval

**Steps**

1. Navigate to /procurement/purchase-requests/my-approvals
2. Click on PR-2501-0001
3. Verify all header fields are visible
4. Verify FOC quantities are visible
5. Verify vendor names are visible
6. Verify net amount calculations are correct
7. Verify tax rates and amounts are calculated
8. Verify override amounts are highlighted
9. Verify override amounts exceed 20%
10. Click on 'Approve' button
11. Enter optional approval comment
12. Confirm approval action
13. Verify PR status changes to 'Approved'

**Expected**

PR is approved and status changes to 'Approved' despite override amounts over 20%

---

## TC-PR01701 — Happy Path - Valid Input

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Purchasing Staff has the necessary role; PR is created and item details are displayed

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on PR detail page
3. Select valid vendor from dropdown
4. Select correct currency
5. Enter valid unit price
6. Select applicable tax profile
7. Enter valid discount rate
8. Click 'Save'

**Expected**

PR item pricing information is updated successfully. System calculates and updates all financial totals, logs changes, and displays success message.

---

## TC-PR01703 — Edge Case - Empty Discount Rate

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Purchasing Staff has the necessary role; PR is created and item details are displayed

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on PR detail page
3. Enter valid vendor, currency, and unit price
4. Leave discount rate empty
5. Click 'Save'

**Expected**

System calculates financial totals without discount, using unit price and any tax override. No error message is displayed, and PR is saved with correct pricing information.

---

## TC-PR01705 — Edge Case - No Tax Profile

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Purchasing Staff has the necessary role; PR is created and item details are displayed; no tax profile is assigned

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on PR detail page
3. Enter valid vendor, currency, and unit price
4. Leave tax profile selection blank
5. Click 'Save'

**Expected**

System calculates financial totals without tax, using unit price and any discount override. No error message is displayed, and PR is saved with correct pricing information.

---

## TC-PR01801 — Return PR with valid reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Department Manager has pending PRs and access to return function

**Steps**

1. Navigate to /procurement/purchase-request
2. Select pending PR
3. Click 'Return' button
4. Enter 'Reason for revision' with 15 characters
5. Click 'Confirm Return'

**Expected**

PR status updated to 'Returned', requestor notified, and PR detail updated.

---

## TC-PR01802 — Return PR with empty reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Department Manager has pending PRs and access to return function

**Steps**

1. Navigate to /procurement/purchase-request
2. Select pending PR
3. Click 'Return' button
4. Leave 'Reason for revision' field empty
5. Click 'Confirm Return'

**Expected**

System validation error, requestor not notified, and PR status remains unchanged.

---

## TC-PR01803 — Return PR with minimum 10 character reason

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Department Manager has pending PRs and access to return function

**Steps**

1. Navigate to /procurement/purchase-request
2. Select pending PR
3. Click 'Return' button
4. Enter 'Reason for revision' with 10 characters
5. Click 'Confirm Return'

**Expected**

PR status updated to 'Returned', requestor notified, and PR detail updated.

---

## TC-PR01804 — Return PR with very high value and insufficient permissions

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Finance Manager has pending PRs and insufficient permissions to return

**Steps**

1. Navigate to /procurement/purchase-request
2. Select pending PR
3. Click 'Return' button
4. Enter 'Reason for revision' with 15 characters
5. Click 'Confirm Return'

**Expected**

System error message, requestor not notified, and PR status remains unchanged.

---

## TC-PR01902 — Submit PR with missing unit price

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Purchasing staff has completed vendor allocation and pricing for all items except unit price

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit' button
3. Verify validation error for missing unit price
4. Fill in unit price and click 'Submit'

**Expected**

PR record is updated with unit price, no further action required, confirmation dialog appears, next stage/recipient is Finance Manager, success message is displayed, PR detail page shows updated status.

---

## TC-PR01903 — Submit PR with incomplete vendor selection

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Purchasing staff has completed vendor allocation and pricing for all items except vendor selection

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit' button
3. Verify validation error for missing vendor selection
4. Select vendor and click 'Submit'

**Expected**

PR record is updated with vendor selection, no further action required, confirmation dialog appears, next stage/recipient is Finance Manager, success message is displayed, PR detail page shows updated status.

---

## TC-PR01904 — Submit PR with very high value

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Purchasing staff has completed vendor allocation and pricing for a very high-value item

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit' button
3. Verify confirmation dialog appears
4. Verify next stage/recipient is General Manager
5. Click 'Confirm Submit'

**Expected**

PR record is updated to next stage, recipient is notified, submit activity is logged, success message is displayed, PR detail page shows updated status.

---

## TC-PR01905 — Submit PR with no permission

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is not a purchasing staff

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Submit' button
3. Verify error message indicating insufficient permission

**Expected**

Error message is displayed, PR record is not updated, no notifications sent, no activity logged in PR detail page.

---

## TC-PR02001 — Happy Path - Reject Purchase Request with Valid Reason

> **As a** Purchase user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR exists; purchasing staff has the necessary role

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the relevant PR
3. Click 'Reject' button
4. Enter 'Items discontinued' as the rejection reason
5. Click 'Confirm Rejection'

**Expected**

PR is updated to 'Void' status with a rejection timestamp, reason, and rejector.

---

## TC-PR02002 — Negative Case - Invalid Reason Length

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR exists; purchasing staff has the necessary role

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the relevant PR
3. Click 'Reject' button
4. Enter 'I' as the rejection reason
5. Click 'Confirm Rejection'

**Expected**

System displays an error message indicating the rejection reason is too short.

---

## TC-PR02003 — Edge Case - Reject with No Reason Entered

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PR exists; purchasing staff has the necessary role

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the relevant PR
3. Click 'Reject' button
4. Click 'Confirm Rejection' without entering a reason

**Expected**

System displays an error message indicating the rejection reason is required.

---

## TC-PR02004 — Negative Case - No Permission to Reject

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR exists; a user without purchasing staff role attempts to reject

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the relevant PR
3. Click 'Reject' button

**Expected**

System displays an error message indicating the user does not have permission to reject.

---

## TC-PR02005 — Edge Case - Reject with Existing Rejection

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PR exists; has a previous rejection; purchasing staff has the necessary role

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'View' on the relevant PR
3. Click 'Reject' button
4. Enter 'Items discontinued' as the rejection reason
5. Click 'Confirm Rejection'

**Expected**

System displays an error message indicating the PR is already voided.

---

## TC-PR02101 — Approve Multiple Line Items

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager with approval rights; multiple PR line items exist with varying statuses

**Steps**

1. Navigate to /procurement/purchase-request
2. Select multiple line items using the checkbox
3. Click 'Bulk Actions' dropdown
4. Select 'Approve'
5. Confirm approval

**Expected**

All selected line items are approved and updated in the system.

---

## TC-PR02102 — Reject Multiple Line Items

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager with rejection rights; multiple PR line items exist

**Steps**

1. Navigate to /procurement/purchase-request
2. Select multiple line items using the checkbox
3. Click 'Bulk Actions' dropdown
4. Select 'Reject'
5. Provide rejection reason
6. Confirm rejection

**Expected**

All selected line items are rejected and updated in the system with the reason provided.

---

## TC-PR02103 — Return Multiple Line Items to Requestor

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager with return rights; multiple PR line items exist

**Steps**

1. Navigate to /procurement/purchase-request
2. Select multiple line items using the checkbox
3. Click 'Bulk Actions' dropdown
4. Select 'Return to Requestor'
5. Confirm return

**Expected**

All selected line items are returned to the requestor and updated in the system.

---

## TC-PR02104 — Split Multiple Line Items

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager with split rights; multiple PR line items exist

**Steps**

1. Navigate to /procurement/purchase-request
2. Select multiple line items using the checkbox
3. Click 'Bulk Actions' dropdown
4. Select 'Split'
5. Enter new split values
6. Confirm split

**Expected**

All selected line items are split as per the new values provided and updated in the system.

---

## TC-PR02105 — Set Date Required for Multiple Line Items

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Logged in as Department Manager with date required setting rights; multiple PR line items exist

**Steps**

1. Navigate to /procurement/purchase-request
2. Select multiple line items using the checkbox
3. Click 'Bulk Actions' dropdown
4. Select 'Set Date Required'
5. Enter new date required
6. Confirm update

**Expected**

All selected line items have their 'Date Required' field updated and reflected in the system.

---

## TC-PR02201 — Add a new budget allocation

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Finance Manager is logged in and has a PR in the budget tab

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit Budget'
3. Fill in the 'Amount' field with a value
4. Fill in the 'Description' field with a brief description
5. Click 'Add Allocation'

**Expected**

The new budget allocation is added to the list and the total budget is updated.

---

## TC-PR02202 — Edit an existing budget allocation

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Finance Manager is logged in and has at least one existing budget allocation in the PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the pencil icon next to an existing budget allocation
3. Change the 'Amount' value
4. Click 'Save Changes'

**Expected**

The existing budget allocation is updated with the new amount and the total budget is recalculated.

---

## TC-PR02203 — Delete a budget allocation

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Finance Manager is logged in and has at least one existing budget allocation in the PR

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the trash can icon next to an existing budget allocation
3. Confirm the deletion

**Expected**

The selected budget allocation is removed from the list and the total budget is recalculated.

---

## TC-PR02204 — Attempt to edit an allocation without permission

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Purchasing Staff is logged in and has a PR in the budget tab

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the pencil icon next to an existing budget allocation
3. Change the 'Amount' value
4. Click 'Save Changes'

**Expected**

The system displays an error message indicating that the user does not have permission to edit this allocation.

---

## TC-PR02205 — Attempt to delete a required allocation

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Finance Manager is logged in and has a PR with a required budget allocation

**Steps**

1. Navigate to /procurement/purchase-request
2. Click the trash can icon next to a required budget allocation
3. Confirm the deletion

**Expected**

The system displays an error message indicating that the required allocation cannot be deleted.

---

## TC-PR02301 — Happy Path - Split PR with Valid Inputs

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A PR exists with at least two items that need approval

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR detail page
3. Review items and identify items to approve and return
4. Select two or more items to split
5. Click on 'Split' button
6. Select 'By Approval Status' split option
7. Assign items to 'Approved' and 'Return for Revision' groups
8. Enter return reason for returned items (at least 10 characters)
9. Review split preview
10. Click on 'Confirm Split'

**Expected**

System processes the split, creating a new PR for returned items, updating the original PR with only approved items, setting the appropriate statuses, logging activity, and sending a notification to the requestor.

---

## TC-PR02302 — Negative - Insufficient Items for Split

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR exists with less than two items that need approval

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR detail page
3. Review items and identify items to approve and return
4. Attempt to select less than two items to split

**Expected**

System does not enable the Split button, displaying an error message indicating that at least two items are required for splitting.

---

## TC-PR02303 — Edge Case - No Items to Split

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PR exists with all items already approved

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR detail page
3. Review items and identify no items to approve or return

**Expected**

System displays a message indicating no items can be split and returns to the PR detail page without any action taken.

---

## TC-PR02304 — Negative - Invalid Reason for Return

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR exists with at least two items that need approval

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on PR detail page
3. Review items and identify items to approve and return
4. Select two or more items to split
5. Click on 'Split' button
6. Select 'By Approval Status' split option
7. Assign items to 'Approved' and 'Return for Revision' groups
8. Enter a return reason with less than 10 characters
9. Attempt to confirm split

**Expected**

System displays an error message indicating the return reason must be at least 10 characters long and does not allow the split to proceed.

---

## TC-PR10101 — Happy Path - Valid PR Data _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A new PR is created without a reference number

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in valid PR data
4. Submit the PR

**Expected**

The system automatically generates and assigns a unique reference number in the format PR-2501-0001 and continues PR creation.

---

## TC-PR10102 — Negative - No PR Data _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A new PR is created without any PR data

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Submit the PR without filling in any data

**Expected**

The system rejects the PR submission and displays an error message requiring PR data.

---

## TC-PR10103 — Negative - Date Format Error _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A new PR is created with an incorrect date format

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in the date with an incorrect format (e.g., 2025-02-15 instead of 2502)
4. Submit the PR

**Expected**

The system rejects the PR submission and displays an error message about the date format.

---

## TC-PR10104 — Edge Case - Year Change _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A new PR is created in the first month of a new financial year

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Fill in the date for the first month of a new year (e.g., 2601)
4. Submit the PR

**Expected**

The system correctly generates the reference number starting from PR-2601-0001.

---

## TC-PR10105 — Negative - Database Sequence Exhausted _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

The database sequence for reference numbers has reached its maximum value

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'New Purchase Request'
3. Submit the PR

**Expected**

The system generates an error message indicating that the reference number sequence has been exhausted.

---

## TC-PR10201 — Happy Path: Add Items and Verify Totals _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A PR with items is created and saved

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on the PR
3. Add a new line item with quantity, unit price, discount percentage, and tax rate
4. Save the PR

**Expected**

Line totals, discounts, taxes, and total amount are correctly calculated and displayed.

---

## TC-PR10202 — Negative: Invalid Discount Percentage _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR with items and an invalid discount percentage is created and saved

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on the PR
3. Add a new line item with quantity, unit price, discount percentage set to over 100%, and tax rate
4. Save the PR

**Expected**

The system displays an error message for the invalid discount percentage and does not calculate totals.

---

## TC-PR10203 — Edge Case: Multi-Currency with Exchange Rate _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A PR with items is created and saved; the system uses multi-currency

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Edit' on the PR
3. Add a new line item with quantity, unit price, discount percentage, and tax rate
4. Set the currency to a different currency than the base currency
5. Enter an exchange rate
6. Save the PR

**Expected**

Line totals, discounts, taxes, and total amount are calculated in the base currency using the exchange rate.

---

## TC-PR10301 — Happy Path - General PR _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

A general PR with a total amount under $10,000 is submitted

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill the form with a general PR type and total amount less than $10,000
3. Click 'Submit'

**Expected**

The approval chain includes only the department manager.

---

## TC-PR10302 — Negative - Invalid Department ID _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR is submitted with an invalid department ID

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill the form with a general PR type, total amount, and an invalid department ID
3. Click 'Submit'

**Expected**

An error message is displayed indicating the department ID is invalid.

---

## TC-PR10303 — Edge Case - High Value Asset PR _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

A high-value asset PR is submitted with a total amount over $100,000

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill the form with an asset PR type, total amount over $100,000, and relevant department ID
3. Click 'Submit'

**Expected**

The approval chain includes the department manager, asset manager, finance manager, and general manager.

---

## TC-PR10304 — Negative - No User Assigned to Role _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A PR is submitted for a role with no assigned user

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill the form with a general PR type, total amount, and a role with no assigned user
3. Click 'Submit'

**Expected**

An error message is displayed indicating no user is assigned to the role.

---

## TC-PR10401 — Happy Path - Sufficient Funds _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login as Requestor; PR with budget codes; budget has sufficient funds

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill budget codes for line items
3. Click 'Save'
4. Verify system checks budget availability
5. Wait for reservation confirmation
6. Verify reservation ID recorded

**Expected**

System confirms sufficient funds, reserves budget, and records reservation ID.

---

## TC-PR10402 — Negative Case - Insufficient Funds _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login as Requestor; PR with budget codes; budget has insufficient funds

**Steps**

1. Navigate to /procurement/purchase-request
2. Fill budget codes for line items
3. Click 'Save'
4. Verify system checks budget availability
5. Wait for error message
6. Verify no reservation

**Expected**

System denies submission with insufficient funds error message.

---

## TC-PR10403 — Edge Case - No Budget Codes _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Login as Requestor; PR without any budget codes

**Steps**

1. Navigate to /procurement/purchase-request
2. Ensure no budget codes are filled
3. Click 'Save'
4. Verify system skips budget check
5. Wait for success message

**Expected**

System allows submission without budget check since no budget codes are present.

---

## TC-PR10501 — Happy Path - PR Submitted Notification _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User A has a new PR PR-1234 pending approval by User B

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on 'PR-1234'
3. Verify 'Status' is 'Submitted'
4. Wait for 5 minutes
5. Navigate to email inbox or notification panel
6. Verify email or in-app notification for User B

**Expected**

Notification is sent to User B with PR details and an approval link.

---

## TC-PR10502 — Negative - Invalid Email Preference _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User B has no email preference set

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on 'PR-1234'
3. Verify 'Status' is 'Submitted'
4. Wait for 5 minutes
5. Navigate to User B's profile
6. Verify 'Email' preference is not enabled
7. Navigate back to PR-1234
8. Verify no email notification is sent to User B

**Expected**

Only in-app notification is generated and sent to User B.

---

## TC-PR10503 — Edge Case - PR Rejected with No Pending Approvals _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User A has a PR PR-5678 in 'Rejected' status with no pending approvals

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on 'PR-5678'
3. Verify 'Status' is 'Rejected'
4. Verify 'Rejected By' is User A
5. Wait for 5 minutes
6. Navigate to email inbox or notification panel
7. Verify no notification is received by anyone

**Expected**

No notifications are sent as there are no pending approvals.

---

## TC-PR10504 — Negative - User Not Authorized to Approve _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User C is not authorized to approve PRs and has a PR-6789 pending

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on 'PR-6789'
3. Verify 'Status' is 'Submitted'
4. Wait for 5 minutes
5. Attempt to approve PR-6789
6. Verify an error message is displayed

**Expected**

User C cannot approve PR-6789 and no notification is generated.

---

## TC-PR20101 — Happy Path - PR Sync to ERP _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

PR is approved and ERP sync is enabled

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on approved PR with status 'Completed'
3. Verify PR status is 'Approved/Completed'
4. Wait for system to detect PR status change
5. Verify system checks if ERP sync is enabled
6. Verify system prepares PR data in ERP format
7. Verify system calls ERP API endpoint
8. Verify system receives ERP document ID
9. Verify system saves sync record
10. Verify system logs sync activity

**Expected**

PR data is successfully synced to the ERP system with all records saved and logged.

---

## TC-PR20102 — Negative Case - ERP Sync Disabled _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

PR is approved and ERP sync is disabled

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on approved PR with status 'Completed'
3. Verify PR status is 'Approved/Completed'
4. Wait for system to detect PR status change
5. Verify system checks if ERP sync is enabled
6. Verify system does not prepare PR data in ERP format
7. Verify system does not call ERP API endpoint
8. Verify system does not receive ERP document ID
9. Verify system does not save sync record
10. Verify system does not log sync activity

**Expected**

PR data is not synced to the ERP system as ERP sync is disabled.

---

## TC-PR20103 — Edge Case - Multiple PRs in Batch _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple PRs are approved and ERP sync is enabled

**Steps**

1. Navigate to /procurement/purchase-request
2. Click on multiple approved PRs with status 'Completed'
3. Verify PR statuses are 'Approved/Completed'
4. Wait for system to detect PR status change
5. Verify system checks if ERP sync is enabled
6. Verify system prepares PR data in ERP format for each PR
7. Verify system calls ERP API endpoint for each PR
8. Verify system receives ERP document ID for each PR
9. Verify system saves sync record for each PR
10. Verify system logs sync activity for each PR

**Expected**

All PR data is successfully synced to the ERP system with records saved and logged for each PR.

---

## TC-PR20201 — Import valid CSV file _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

User has permission to import purchase requests

**Steps**

1. Navigate to /import
2. Click 'Select File' and upload valid CSV file
3. Click 'Import'

**Expected**

System processes the file, creates PRs, logs import, and sends success summary to user

---

## TC-PR20203 — Duplicate PR import _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has permission to import; file has duplicate reference numbers

**Steps**

1. Navigate to /import
2. Click 'Select File' and upload file with duplicate reference numbers
3. Click 'Import'

**Expected**

System logs errors for duplicate records, creates valid PRs, and sends summary to user

---

## TC-PR20204 — Import with unauthorized access _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

User does not have permission to import purchase requests

**Steps**

1. Navigate to /import
2. Click 'Select File' and upload valid CSV file
3. Click 'Import'

**Expected**

System displays error message indicating insufficient permissions

---

## TC-PR20205 — Import with no file selected _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

User has permission to import purchase requests

**Steps**

1. Navigate to /import
2. Click 'Import' without selecting a file

**Expected**

System displays error message indicating no file selected

---

## TC-PR30101 — Happy Path - Reminder Notification Sent _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A PR is created and pending for approval for 49 hours with reminder_count < 3

**Steps**

1. Navigate to /procurement/purchase-requests
2. Wait for 49 hours
3. Verify the system sends a reminder email to the approver

**Expected**

A reminder email is sent to the approver listing the pending PR.

---

## TC-PR30102 — Negative Case - Approver with No Pending Requests _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A PR is created and pending for 49 hours; approver has no pending requests

**Steps**

1. Navigate to /procurement/purchase-requests
2. Wait for 49 hours
3. Verify no reminder email is sent to the approver

**Expected**

No reminder email is sent to the approver.

---

## TC-PR30103 — Edge Case - Approver has 3 Reminders _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

PR pending for 48 hours; approver has already received 2 reminder emails

**Steps**

1. Navigate to /procurement/purchase-requests
2. Wait for 48 hours
3. Verify no reminder email is sent to the approver

**Expected**

No reminder email is sent to the approver.

---

## TC-PR30104 — Negative Case - Approver with No Access _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

PR pending for 48 hours; approver has no access to view the PR

**Steps**

1. Navigate to /procurement/purchase-requests
2. Wait for 48 hours
3. Verify no reminder email is sent to the approver

**Expected**

No reminder email is sent to the approver.

---

## TC-PR30201 — Escalation for Overdue PRs with Valid Inputs _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

System is running and there are pending PRs that are overdue by more than 5 days

**Steps**

1. Navigate to /procurement/escalation
2. Click 'Run Escalation Job'
3. Wait for the job to complete

**Expected**

The system escalates all overdue PRs to their managers and logs the escalations, generates an escalation report.

---

## TC-PR30202 — Escalation Job Fails Due to Database Error _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Database is down or corrupted, preventing the query from running successfully

**Steps**

1. Simulate a database error by stopping the database service
2. Navigate to /procurement/escalation
3. Click 'Run Escalation Job'

**Expected**

An error message is displayed indicating the database issue, no PRs are escalated.

---

## TC-PR30203 — Escalation Notification Sent to Approver Manager but No Manager Found _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

The approver does not have a manager assigned in the system

**Steps**

1. Create a pending PR that will trigger escalation
2. Run the escalation job
3. Wait for the job to complete

**Expected**

The system attempts to send the escalation notification but fails because no manager is found, PR remains unescalated.

---

## TC-PR30204 — Escalation Job Runs During Non-Scheduled Time _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

System is running outside the scheduled time for the escalation job

**Steps**

1. Manually trigger the escalation job at an unscheduled time
2. Navigate to /procurement/escalation
3. Click 'Run Escalation Job'

**Expected**

The job runs but no PRs are escalated as the query condition is not met, no notifications are sent.

---

## TC-PR30301 — Happy Path - Scheduled Archival _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

System is set to run archival at 2 AM daily; current date is 2 years or more after the PRs to be archived

**Steps**

1. Navigate to /procurement/admin
2. Wait for 2 AM
3. Click on 'Run Archive Job'

**Expected**

All eligible PRs are archived according to the criteria, and a report is generated.

---

## TC-PR30302 — Negative - Invalid Date Range _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

System is set to run archival at 2 AM daily; current date is less than 2 years from the PRs to be archived

**Steps**

1. Navigate to /procurement/admin
2. Click on 'Run Archive Job'

**Expected**

No PRs are archived, and a notification is sent to the admin stating that the date range is invalid.

---

## TC-PR30303 — Edge Case - No Eligible PRs _(skipped)_

> **As a** Requestor user, **I want** this Purchase Request behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

All PRs are either new, in progress, or archived within the last 2 years

**Steps**

1. Navigate to /procurement/admin
2. Click on 'Run Archive Job'

**Expected**

No PRs are archived, and a notification is sent to the admin stating that no PRs are eligible for archiving.

---


<sub>Last regenerated: 2026-04-27 · git b169d98</sub>
