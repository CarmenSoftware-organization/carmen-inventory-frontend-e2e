# Campaign — User Stories

_Generated from `tests/022-campaign.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Campaign
**Spec:** `tests/022-campaign.spec.ts`
**Default role:** Purchase
**Total test cases:** 43 (20 High / 17 Medium / 1 Low / 5 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CAM00101 | View Campaign List - Happy Path | Critical | Happy Path |
| TC-CAM00102 | View Campaign List - Invalid Permissions | High | Negative |
| TC-CAM00103 | View Campaign List - Empty Campaign List | High | Edge Case |
| TC-CAM00104 | View Campaign List - Filter by Status | Medium | Happy Path |
| TC-CAM00201 | Happy Path - Create Campaign with All Valid Inputs | Critical | Happy Path |
| TC-CAM00202 | Negative Path - Missing Required Fields | High | Negative |
| TC-CAM00203 | Negative Path - No Vendor Selected | High | Negative |
| TC-CAM00204 | Edge Case - Maximum Campaigns Per Week | Medium | Edge Case |
| TC-CAM00301 | View active campaign detail | Critical | Happy Path |
| TC-CAM00302 | User with no permission to view campaign detail | Critical | Negative |
| TC-CAM00303 | Campaign detail with draft status | Critical | Happy Path |
| TC-CAM00304 | View campaign detail with empty performance summary | High | Edge Case |
| TC-CAM00305 | Campaign detail with future start date | Medium | Edge Case |
| TC-CAM00401 | Edit Existing Campaign with Valid Data | High | Happy Path |
| TC-CAM00402 | Edit Campaign with Invalid Priority Value | High | Negative |
| TC-CAM00403 | Edit Campaign with No Permission | High | Negative |
| TC-CAM00404 | Edit Campaign with No Data Changes | Medium | Edge Case |
| TC-CAM00501 | Duplicate Campaign - Happy Path | Medium | Happy Path |
| TC-CAM00502 | Duplicate Campaign - No Permission | Medium | Negative |
| TC-CAM00503 | Duplicate Campaign - Empty Campaign List | Medium | Edge Case |
| TC-CAM00504 | Duplicate Campaign - Campaign with Attached Files | Medium | Happy Path |
| TC-CAM00601 | Send Reminder - Happy Path | High | Happy Path |
| TC-CAM00602 | Send Reminder - No Permission | High | Negative |
| TC-CAM00603 | Send Reminder - Invalid Vendor Status | High | Negative |
| TC-CAM00604 | Send Reminder - Reminder Already Sent | High | Edge Case |
| TC-CAM00605 | Send Reminder - Empty Reminder Message | High | Negative |
| TC-CAM00701 | Mark campaign as expired - Happy Path | Medium | Happy Path |
| TC-CAM00702 | Mark campaign as expired - No Permission | Medium | Negative |
| TC-CAM00703 | Mark campaign as expired - Campaign already expired | Medium | Negative |
| TC-CAM00704 | Mark campaign as expired - Empty campaign list | Low | Edge Case |
| TC-CAM00801 | Happy Path - Delete Campaign | Medium | Happy Path |
| TC-CAM00802 | Negative - No Campaign Selected | High | Negative |
| TC-CAM00803 | Edge Case - Multiple Campaigns Selected | Medium | Edge Case |
| TC-CAM00804 | Negative - No Permission | Medium | Negative |
| TC-CAM00901 | Export campaign data - happy path | High | Happy Path |
| TC-CAM00902 | Export campaign data - no permission | Medium | Negative |
| TC-CAM00903 | Export campaign data - large dataset | Medium | Edge Case |
| TC-CAM00904 | Export campaign data - multiple exports | Medium | Edge Case |
| TC-CAM01001 | Filter by Status - Active | High | Happy Path |
| TC-CAM01002 | Search by Text - Valid Term | High | Happy Path |
| TC-CAM01003 | Filter by Status - No Campaigns | High | Negative |
| TC-CAM01004 | Search by Text - No Matching Terms | High | Negative |
| TC-CAM01005 | Filter by Status - All Statuses | High | Happy Path |

---

## TC-CAM00101 — View Campaign List - Happy Path

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User is logged in as procurement staff and has permission to view campaign list

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Verify Campaign List page is displayed
3. Verify all campaigns are loaded and displayed in default table view
4. Click on a campaign name
5. Verify the campaign details page is displayed

**Expected**

Campaign details page is correctly displayed with all relevant information.

---

## TC-CAM00102 — View Campaign List - Invalid Permissions

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in but does not have permission to view campaign list

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Verify error message or redirect to home page

**Expected**

User is shown an error message or redirected to home page.

---

## TC-CAM00103 — View Campaign List - Empty Campaign List

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

User has permission to view campaign list but no campaigns are available

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Verify no campaigns are listed

**Expected**

User sees a message indicating no campaigns are currently available.

---

## TC-CAM00104 — View Campaign List - Filter by Status

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has permission to view campaign list

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on filter options
3. Select 'Active' status
4. Verify only active campaigns are displayed

**Expected**

Only campaigns with active status are displayed.

---

## TC-CAM00201 — Happy Path - Create Campaign with All Valid Inputs

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Staff and has the necessary permissions

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Create New Campaign'
3. Fill 'Campaign name' with valid text
4. Fill 'Campaign description' with valid text
5. Select 'Normal' from priority level
6. Fill 'Scheduled start date' with valid date
7. Click 'Next'
8. Click on template named 'Template A'
9. Click 'Next'
10. Search for vendor 'Vendor X'
11. Check vendor 'Vendor X' checkbox
12. Click 'Next'
13. Verify all details in summary
14. Click 'Launch Campaign'

**Expected**

Campaign is created with status 'active' and vendors are invited. User navigated to campaign detail page with success message.

---

## TC-CAM00202 — Negative Path - Missing Required Fields

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has the necessary permissions

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Create New Campaign'
3. Fill 'Campaign name' with valid text
4. Click 'Next'

**Expected**

System displays error message for missing 'Campaign description' and 'Scheduled start date'. User remains on step 1.

---

## TC-CAM00203 — Negative Path - No Vendor Selected

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User has the necessary permissions

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Create New Campaign'
3. Fill 'Campaign name' with valid text
4. Fill 'Campaign description' with valid text
5. Select 'Normal' from priority level
6. Fill 'Scheduled start date' with valid date
7. Click 'Next'
8. Click on template named 'Template A'
9. Click 'Next'
10. Verify no vendors selected
11. Click 'Next'

**Expected**

System displays error message for missing vendor selection. User remains on step 3.

---

## TC-CAM00204 — Edge Case - Maximum Campaigns Per Week

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has reached the maximum number of campaigns per week

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Create New Campaign'

**Expected**

System displays message indicating user has reached the maximum number of campaigns per week. User cannot proceed.

---

## TC-CAM00301 — View active campaign detail

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

User is logged in as procurement staff; an active campaign exists

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on an active campaign name
3. Wait for page to load

**Expected**

Campaign detail page is displayed with correct campaign data.

---

## TC-CAM00302 — User with no permission to view campaign detail

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

User is logged in with a role that does not have permission to view campaign details

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Attempt to click on a campaign name
3. Verify error message indicating insufficient permissions

**Expected**

User is redirected to permission denied page or error message is displayed.

---

## TC-CAM00303 — Campaign detail with draft status

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Campaign is in draft status; user is logged in as procurement staff

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a draft campaign name
3. Verify edit button is present, other buttons are not visible

**Expected**

Campaign detail page is displayed with edit button visible, duplicate button is not visible.

---

## TC-CAM00304 — View campaign detail with empty performance summary

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Campaign has no submissions; user is logged in as procurement staff

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign name
3. Verify performance summary cards show no data

**Expected**

Performance summary cards display zero values or placeholders for data.

---

## TC-CAM00305 — Campaign detail with future start date

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Campaign has a future start date; user is logged in as procurement staff

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign with future start date
3. Verify that the campaign detail is still accessible

**Expected**

Campaign detail page is displayed with the campaign data, including the future start date.

---

## TC-CAM00401 — Edit Existing Campaign with Valid Data

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A campaign has been created and saved in the system

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on 'Campaign Detail' link
3. Click 'Edit' button
4. Fill in the campaign name, description, priority, dates, and select a template
5. Select a vendor and configure settings
6. Click 'Save Changes'

**Expected**

The campaign is updated successfully and the system navigates to the updated campaign detail page with a success message.

---

## TC-CAM00402 — Edit Campaign with Invalid Priority Value

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A campaign has been created and saved in the system

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on 'Campaign Detail' link
3. Click 'Edit' button
4. Fill in the campaign name, description, and dates
5. Enter 'Invalid' in the priority field
6. Select a template, vendor, and configure settings
7. Click 'Save Changes'

**Expected**

The system displays an error message indicating that the priority field is invalid.

---

## TC-CAM00403 — Edit Campaign with No Permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

A campaign has been created and saved; user does not have permission to edit campaigns

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on 'Campaign Detail' link
3. Click 'Edit' button

**Expected**

The system displays an error message indicating that the user does not have permission to edit campaigns.

---

## TC-CAM00404 — Edit Campaign with No Data Changes

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A campaign has been created and saved in the system

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on 'Campaign Detail' link
3. Click 'Edit' button
4. Verify all fields display current data
5. Click 'Save Changes'

**Expected**

The system displays a confirmation that no changes were made.

---

## TC-CAM00501 — Duplicate Campaign - Happy Path

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged in as a Procurement Staff and has access to the campaign list

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign from the list
3. Click on the 'Duplicate' button
4. Wait for the new campaign to be created
5. Verify the new campaign name includes '(Copy)' suffix
6. Verify the status is set to 'Draft'
7. Verify all settings, vendor selections, and template selection are copied
8. Navigate to the new campaign detail page

**Expected**

The new campaign is successfully duplicated and the user is navigated to the new campaign detail page.

---

## TC-CAM00502 — Duplicate Campaign - No Permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have permission to duplicate campaigns

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign from the list
3. Attempt to click on the 'Duplicate' button
4. Verify an error message is displayed indicating insufficient permission

**Expected**

The user is prevented from duplicating the campaign and sees an error message.

---

## TC-CAM00503 — Duplicate Campaign - Empty Campaign List

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is logged in as a Procurement Staff and the campaign list is empty

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Verify the campaign list is empty
3. Click on the 'Duplicate' button
4. Verify the system prompts the user to create a new campaign first

**Expected**

The user is informed that they need to create a new campaign before they can duplicate it.

---

## TC-CAM00504 — Duplicate Campaign - Campaign with Attached Files

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged in as a Procurement Staff and a campaign with attached files exists in the system

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign with attached files
3. Click on the 'Duplicate' button
4. Verify all settings, vendor selections, template selection, and files are copied to the new campaign

**Expected**

The new campaign is duplicated with all settings, vendor selections, template, and attached files copied.

---

## TC-CAM00601 — Send Reminder - Happy Path

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Staff and has access to the vendor reminder feature

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign detail page
3. Click on the 'Vendors' tab
4. Identify a vendor with 'pending' or 'in_progress' status
5. Click 'Send Reminder' button
6. Verify success message: 'Reminder sent successfully'

**Expected**

Reminder is sent to vendor, reminder count is incremented, and last reminder date is updated.

---

## TC-CAM00602 — Send Reminder - No Permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as a non-Procurement Staff member

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign detail page
3. Click on the 'Vendors' tab
4. Attempt to click 'Send Reminder' button for a vendor

**Expected**

User receives an error message indicating they do not have permission to send reminders.

---

## TC-CAM00603 — Send Reminder - Invalid Vendor Status

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Staff

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign detail page
3. Click on the 'Vendors' tab
4. Identify a vendor with 'complete' status
5. Attempt to click 'Send Reminder' button

**Expected**

System displays an error message indicating the vendor status is invalid for sending reminders.

---

## TC-CAM00604 — Send Reminder - Reminder Already Sent

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Vendor has already received a reminder within the last 24 hours

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign detail page
3. Click on the 'Vendors' tab
4. Identify a vendor with 'pending' or 'in_progress' status but has received a reminder within the last 24 hours
5. Click 'Send Reminder' button

**Expected**

System displays a warning message indicating the reminder has already been sent within the last 24 hours.

---

## TC-CAM00605 — Send Reminder - Empty Reminder Message

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Staff

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign detail page
3. Click on the 'Vendors' tab
4. Identify a vendor with 'pending' or 'in_progress' status
5. Click 'Send Reminder' button without entering a message
6. Click 'Send' in the reminder dialog

**Expected**

System displays an error message indicating the reminder message field cannot be empty.

---

## TC-CAM00701 — Mark campaign as expired - Happy Path

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User has access to a campaign that is not already expired

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign to open its detail page
3. Click on the actions dropdown menu
4. Click 'Mark as Expired'
5. Confirm the action

**Expected**

Campaign status is updated to 'Expired' and a success toast 'Campaign marked as expired' is displayed.

---

## TC-CAM00702 — Mark campaign as expired - No Permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User has a role that does not have permission to mark campaigns as expired

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign to open its detail page
3. Click on the actions dropdown menu
4. Click 'Mark as Expired'

**Expected**

User receives an error message indicating they do not have permission to perform this action.

---

## TC-CAM00703 — Mark campaign as expired - Campaign already expired

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Selected campaign is already marked as expired

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on a campaign to open its detail page
3. Click on the actions dropdown menu
4. Click 'Mark as Expired'

**Expected**

User is informed that the campaign is already expired and the action is not performed.

---

## TC-CAM00704 — Mark campaign as expired - Empty campaign list

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

Campaign list is empty

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Try to click on a campaign to open its detail page
3. Click on the actions dropdown menu
4. Click 'Mark as Expired'

**Expected**

User is presented with a message indicating there are no campaigns available.

---

## TC-CAM00801 — Happy Path - Delete Campaign

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Manager and has a campaign in the campaign list

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on campaign name
3. Click on 'Actions' dropdown
4. Click 'Delete'
5. Click 'Delete' in confirmation dialog

**Expected**

Campaign is removed from database and list, success toast 'Campaign deleted successfully' is shown.

---

## TC-CAM00802 — Negative - No Campaign Selected

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is logged in as Procurement Manager

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on 'Actions' dropdown without selecting any campaign
3. Click 'Delete'

**Expected**

System displays error message 'Please select a campaign to delete'.

---

## TC-CAM00803 — Edge Case - Multiple Campaigns Selected

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User is logged in as Procurement Manager and has multiple campaigns selected

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Select multiple campaigns
3. Click on 'Actions' dropdown
4. Click 'Delete'

**Expected**

System displays error message 'Please select one campaign to delete'.

---

## TC-CAM00804 — Negative - No Permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User is logged in as Regular User

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click on campaign name
3. Click on 'Actions' dropdown
4. Click 'Delete'

**Expected**

System displays error message 'You do not have permission to delete campaigns'.

---

## TC-CAM00901 — Export campaign data - happy path

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as procurement staff and has permission to export campaign data

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Export' button
3. Wait for file generation
4. Verify file download starts

**Expected**

File download starts and user receives a success message.

---

## TC-CAM00902 — Export campaign data - no permission

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

User does not have permission to export campaign data

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Export' button
3. Verify error message displayed

**Expected**

User sees an error message indicating they do not have permission to export campaign data.

---

## TC-CAM00903 — Export campaign data - large dataset

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission to export campaign data with a large dataset

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Export' button
3. Wait for file generation
4. Verify file download starts

**Expected**

File download starts without any issues and user receives a success message.

---

## TC-CAM00904 — Export campaign data - multiple exports

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

User has permission to export campaign data

**Steps**

1. Navigate to /vendor-management/request-price-list
2. Click 'Export' button 5 times within 5 minutes
3. Wait for file generation after each click
4. Verify file download starts each time

**Expected**

File download starts after each export request and user receives success messages for each.

---

## TC-CAM01001 — Filter by Status - Active

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Staff and is on the Campaigns page

**Steps**

1. Click status filter dropdown
2. Select 'Active'
3. Verify that only active campaigns are displayed
4. Verify the result count matches the number of active campaigns

**Expected**

Only active campaigns are displayed with correct result count.

---

## TC-CAM01002 — Search by Text - Valid Term

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is logged in as Procurement Staff and is on the Campaigns page

**Steps**

1. Type 'Inventory' in search input
2. Verify that relevant campaigns are filtered and displayed
3. Verify the result count matches the number of campaigns containing 'Inventory'

**Expected**

Campaigns containing 'Inventory' are filtered and displayed with correct result count.

---

## TC-CAM01003 — Filter by Status - No Campaigns

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is on the Campaigns page with no active campaigns

**Steps**

1. Click status filter dropdown
2. Select 'Active'
3. Verify that no campaigns are displayed
4. Verify the result count is 0

**Expected**

No campaigns are displayed and result count is 0.

---

## TC-CAM01004 — Search by Text - No Matching Terms

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User is on the Campaigns page

**Steps**

1. Type 'NonexistentTerm' in search input
2. Verify that no campaigns are displayed
3. Verify the result count is 0

**Expected**

No campaigns are displayed and result count is 0.

---

## TC-CAM01005 — Filter by Status - All Statuses

> **As a** Purchase user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

User is on the Campaigns page

**Steps**

1. Click status filter dropdown
2. Select 'All'
3. Verify that all campaigns are displayed
4. Verify the result count matches the total number of campaigns

**Expected**

All campaigns are displayed with correct result count.

---


<sub>Last regenerated: 2026-04-27 · git b169d98</sub>
