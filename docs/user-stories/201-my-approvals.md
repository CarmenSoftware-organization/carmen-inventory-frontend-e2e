# My Approvals — User Stories

_Generated from `tests/201-my-approvals.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** My Approvals
**Spec:** `tests/201-my-approvals.spec.ts`
**Default role:** HOD
**Total test cases:** 19 (12 High / 3 Medium / 0 Low / 4 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-MA00101 | Happy Path - View Unified Approval Queue | High | Happy Path |
| TC-MA00102 | Negative - No Pending Approvals | Medium | Negative |
| TC-MA00103 _(skipped)_ | Edge Case - Large Number of Documents | High | Edge Case |
| TC-MA00104 | Negative - Insufficient Permission | Critical | Negative |
| TC-MA00201 _(skipped)_ | Happy Path: Approve Document with Valid Credentials | Critical | Happy Path |
| TC-MA00202 _(skipped)_ | Negative: Insufficient Approval Authority | Critical | Negative |
| TC-MA00203 _(skipped)_ | Edge Case: Multiple Approvals in Queue | Medium | Edge Case |
| TC-MA00301 | Happy Path - Valid Reason | High | Happy Path |
| TC-MA00302 | Negative - Empty Reason | Critical | Negative |
| TC-MA00303 | Edge Case - Custom Reason | High | Edge Case |
| TC-MA00304 | Negative - No Permission | High | Negative |
| TC-MA00401 _(skipped)_ | Happy Path - Request More Information | High | Happy Path |
| TC-MA00402 _(skipped)_ | Negative - Empty Information Request | High | Negative |
| TC-MA00404 _(skipped)_ | Edge Case - Maximum Length Input | Medium | Edge Case |
| TC-MA00501 _(skipped)_ | Happy Path - Approve 20 Routine F&B PRs | High | Happy Path |
| TC-MA00503 _(skipped)_ | Edge Case - Approve Maximum 50 Documents | High | Edge Case |
| TC-MA00601 _(skipped)_ | Happy Path - Delegate Approval Authority | High | Happy Path |
| TC-MA00602 _(skipped)_ | Negative - Delegate User with Lower Approval Authority | High | Negative |
| TC-MA00603 _(skipped)_ | Edge Case - Self Delegation | High | Negative |

---

## TC-MA00101 — Happy Path - View Unified Approval Queue

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in with an approver role and has approval authority configured in approval matrix

**Steps**

1. Navigate to /procurement/approval
2. Verify the document count badges display accurately
3. Verify the total pending count is prominently displayed
4. Verify documents are sorted by submission date (oldest first)
5. Verify visual urgency indicators are displayed correctly

**Expected**

User sees a unified approval queue with all pending documents, sorted and filtered correctly, and with urgency indicators.

---

## TC-MA00102 — Negative - No Pending Approvals

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has approver role but no documents are pending

**Steps**

1. Navigate to /procurement/approval
2. Verify the queue is empty with a message indicating no pending approvals

**Expected**

User sees an empty queue with a message stating there are no pending approvals.

---

## TC-MA00103 — Edge Case - Large Number of Documents _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has approver role and over 500 pending documents exist

**Steps**

1. Navigate to /procurement/approval
2. Wait for the queue to load
3. Verify the queue loads within 2 seconds

**Expected**

Queue loads within 2 seconds with all pending documents.

---

## TC-MA00104 — Negative - Insufficient Permission

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User is logged in but does not have approval authority configured in approval matrix

**Steps**

1. Navigate to /procurement/approval
2. Verify the system displays an error message or redirects to a permission denied page

**Expected**

User sees an error message or is redirected to a permission denied page.

---

## TC-MA00201 — Happy Path: Approve Document with Valid Credentials _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User has viewed approval queue and document is in Pending Approval status

**Steps**

1. Navigate to /approval-queue
2. Click on document in queue to review
3. Verify document details in Overview, Line Items, Attachments, Approval History, and Related Documents tabs
4. Review budget impact and approval history
5. Verify approval recommendation is Green
6. Click 'Approve' button
7. Fill approval comments: 'Approved. Necessary for Q4 menu launch. Budget available.'
8. Click 'Confirm Approval'

**Expected**

Document is updated to Approved status and removed from user's approval queue.

---

## TC-MA00202 — Negative: Insufficient Approval Authority _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Document is in Pending Approval status; user lacks approval authority for the document amount

**Steps**

1. Navigate to /approval-queue
2. Click on document in queue to review
3. Verify document details in Overview, Line Items, Attachments, Approval History, and Related Documents tabs
4. Attempt to click 'Approve' button
5. Verify error message: 'Insufficient approval authority'

**Expected**

User is unable to approve document and sees appropriate error message.

---

## TC-MA00203 — Edge Case: Multiple Approvals in Queue _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Multiple documents are in Pending Approval status at various approval levels; user has sufficient authority to approve

**Steps**

1. Navigate to /approval-queue
2. Review first document in queue
3. Verify document details and approval level
4. Click 'Approve' button
5. Fill approval comments: 'Approved. Necessary for Q4 menu launch. Budget available.'
6. Click 'Confirm Approval'
7. Verify document is updated to Approved status
8. Review next document in queue
9. Repeat steps 4-7 for each document in queue

**Expected**

Documents are approved and removed from user's approval queue in order of appearance.

---

## TC-MA00301 — Happy Path - Valid Reason

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Document in Pending Approval status; user has reviewed the document and identified issues preventing approval; user has active session

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Reject' button
3. Select 'Budget not available' from quick-select options
4. Fill in detailed explanation: 'Rejected. Budget not available for this purchase.'
5. Click 'Confirm Rejection'

**Expected**

Document status updated to Rejected, rejection reason recorded, user notified of successful rejection, document removed from approval queue.

---

## TC-MA00302 — Negative - Empty Reason

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Document in Pending Approval status; user has active session

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Reject' button
3. Select 'Budget not available' from quick-select options
4. Do not fill in detailed explanation
5. Click 'Confirm Rejection'

**Expected**

System validation fails, rejection reason is mandatory, rejection is not processed.

---

## TC-MA00303 — Edge Case - Custom Reason

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Document in Pending Approval status; user has active session

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Reject' button
3. Select 'Other (custom reason)' from quick-select options
4. Enter custom reason: 'Incorrect PO number'
5. Fill in detailed explanation: 'Rejected. Incorrect PO number - please check PO-123456789.'
6. Click 'Confirm Rejection'

**Expected**

Document status updated to Rejected, custom rejection reason recorded, user notified of successful rejection, document removed from approval queue.

---

## TC-MA00304 — Negative - No Permission

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Document in Pending Approval status; user does not have permission to reject

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Reject' button
3. Select 'Budget not available' from quick-select options
4. Fill in detailed explanation: 'Rejected. Budget not available for this purchase.'
5. Click 'Confirm Rejection'

**Expected**

System validation fails, user does not have permission to reject, rejection is not processed.

---

## TC-MA00401 — Happy Path - Request More Information _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has reviewed document; document is in Pending Approval status; user has identified missing or unclear information needed for approval decision

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Request More Info' button
3. Select 'Please provide 2 additional quotes from alternate vendors' template
4. Fill 'Please provide: 1) Specifications for the equipment model requested, 2) Quote from at least one alternate vendor for comparison, 3) Explanation for urgent delivery requirement.' in information request textarea
5. Set response deadline to 48 business hours
6. Click 'Send Request' button
7. Verify success confirmation: 'Information request sent to requestor. SLA timer paused until response received.'
8. Verify document status updated to 'Awaiting Information'

**Expected**

System processes information request, document status updated, requestor notified, SLA timer paused, reminder scheduled.

---

## TC-MA00402 — Negative - Empty Information Request _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has reviewed document; document is in Pending Approval status

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Request More Info' button
3. Click 'Other (custom request)' template
4. Do not fill information request textarea
5. Click 'Send Request' button
6. Verify error message: 'Information request cannot be empty.'

**Expected**

System prevents submission of empty information request.

---

## TC-MA00404 — Edge Case - Maximum Length Input _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has reviewed document; document is in Pending Approval status

**Steps**

1. Navigate to /procurement/purchase-request
2. Click 'Request More Info' button
3. Select 'Please provide 2 additional quotes from alternate vendors' template
4. Fill information request textarea with maximum allowed length: 200 characters
5. Click 'Send Request' button
6. Verify information request is processed successfully.

**Expected**

System processes information request with maximum allowed length without errors.

---

## TC-MA00501 — Happy Path - Approve 20 Routine F&B PRs _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has viewed approval queue with 20 pending routine F&B PRs

**Steps**

1. Navigate to /approval-queue
2. Click 'Select Multiple' button
3. Click checkboxes next to 20 selected documents
4. Verify bulk action toolbar shows '15 documents selected', 'Total: $12,450', 'All Purchase Requests'
5. Click 'Bulk Approve' button
6. Enter comments 'Bulk approved. Routine F&B inventory replenishment within normal spend levels.'
7. Click 'Confirm Bulk Approval' button
8. Wait for progress bar to complete 15 approvals
9. Verify success confirmation: '15 documents approved successfully'
10. Verify queue count reduced by 15

**Expected**

20 documents are approved and removed from the queue.

---

## TC-MA00503 — Edge Case - Approve Maximum 50 Documents _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has viewed approval queue with 50 pending documents of the same type

**Steps**

1. Navigate to /approval-queue
2. Click 'Select Multiple' button
3. Click checkboxes next to all 50 selected documents
4. Verify bulk action toolbar shows '50 documents selected', 'Total: [total amount]', 'All [document type]'
5. Click 'Bulk Approve' button
6. Enter comments 'Bulk approved. Routine F&B inventory replenishment within normal spend levels.'
7. Click 'Confirm Bulk Approval' button
8. Wait for progress bar to complete 50 approvals
9. Verify success confirmation: '50 documents approved successfully'

**Expected**

All 50 documents are approved and removed from the queue.

---

## TC-MA00601 — Happy Path - Delegate Approval Authority _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User has approver role; anticipates absence; potential delegate exists with equal or higher approval authority

**Steps**

1. Navigate to /my-approvals
2. Click 'Manage Delegations'
3. Click 'New Delegation'
4. Fill Delegate User with Sarah Johnson
5. Set Start Date: 2025-12-15, Start Time: 00:00
6. Set End Date: 2025-12-22, End Time: 23:59
7. Set Delegation Scope: All Documents
8. Set Maximum Amount Limit: $50,000
9. Enter Delegation Reason: Annual leave - will be out of office
10. Add Notes: Contact me via email only for emergencies
11. Click 'Create Delegation'

**Expected**

Delegation created successfully, user navigated to delegation details page.

---

## TC-MA00602 — Negative - Delegate User with Lower Approval Authority _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has approver role; potential delegate exists with lower approval authority

**Steps**

1. Navigate to /my-approvals
2. Click 'Manage Delegations'
3. Click 'New Delegation'
4. Fill Delegate User with Sarah Johnson
5. Set Start Date: 2025-12-15, Start Time: 00:00
6. Set End Date: 2025-12-22, End Time: 23:59
7. Set Delegation Scope: All Documents
8. Set Maximum Amount Limit: $50,000
9. Enter Delegation Reason: Annual leave - will be out of office
10. Click 'Create Delegation'

**Expected**

System validation fails, delegation creation is not allowed.

---

## TC-MA00603 — Edge Case - Self Delegation _(skipped)_

> **As a** HOD user, **I want** this My Approvals behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has approver role; anticipates absence

**Steps**

1. Navigate to /my-approvals
2. Click 'Manage Delegations'
3. Click 'New Delegation'
4. Fill Delegate User with John Smith (the user's own name)
5. Set Start Date: 2025-12-15, Start Time: 00:00
6. Set End Date: 2025-12-22, End Time: 23:59
7. Set Delegation Scope: All Documents
8. Set Maximum Amount Limit: $50,000
9. Enter Delegation Reason: Annual leave - will be out of office
10. Click 'Create Delegation'

**Expected**

System validation fails, self-delegation is not allowed.

---


<sub>Last regenerated: 2026-05-06 · git 4322f02</sub>
