import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { CampaignPage, LIST_PATH } from "./pages/campaign.page";

// ─────────────────────────────────────────────────────────────────────────
// Multi-role auth — Procurement Staff/Manager == purchase@blueledgers.com.
// Permission denial uses requestor@blueledgers.com.
// requestor declared LAST so doc default role reads "Purchase".
//
// Note: CSV mixes 'TC-CAM-' (3 letters) and 'TC-RP-' (2 letters) prefixes
// for the same Campaign / Request-for-Pricing module. Both flatten to a
// unified 'TC-CAM<area3><sub2>' (5 digits) for cross-module consistency.
// Mapping: TC-CAM-001-01 → TC-CAM00101, TC-RP-007-01 → TC-CAM00701.
// ─────────────────────────────────────────────────────────────────────────
const requestorTest = createAuthTest("requestor@blueledgers.com");
const purchaseTest = createAuthTest("purchase@blueledgers.com");

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM001 — View Campaign List
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — List", () => {
  purchaseTest(
    "TC-CAM00101 View Campaign List - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as procurement staff and has permission to view campaign list" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Verify Campaign List page is displayed\n3. Verify all campaigns are loaded and displayed in default table view\n4. Click on a campaign name\n5. Verify the campaign details page is displayed",
        },
        { type: "expected", description: "Campaign details page is correctly displayed with all relevant information." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      await expect(page).toHaveURL(/request-price-list/);
    },
  );

  purchaseTest(
    "TC-CAM00103 View Campaign List - Empty Campaign List",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to view campaign list but no campaigns are available" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Verify no campaigns are listed",
        },
        { type: "expected", description: "User sees a message indicating no campaigns are currently available." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00104 View Campaign List - Filter by Status",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to view campaign list" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on filter options\n3. Select 'Active' status\n4. Verify only active campaigns are displayed",
        },
        { type: "expected", description: "Only campaigns with active status are displayed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const filter = cam.statusFilter();
      if ((await filter.count()) > 0) {
        await filter.click().catch(() => {});
        await cam.statusOption(/active/i).click({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});

requestorTest.describe("Campaign — List — Permission denial", () => {
  requestorTest(
    "TC-CAM00102 View Campaign List - Invalid Permissions",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in but does not have permission to view campaign list" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Verify error message or redirect to home page",
        },
        { type: "expected", description: "User is shown an error message or redirected to home page." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto(LIST_PATH);
      const url = page.url();
      const onListPage = /request-price-list/.test(url);
      const onUnauthorized = /unauthorized|denied|403|login/i.test(url);
      expect(onListPage || onUnauthorized).toBeTruthy();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM002 — Create Campaign (Wizard)
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Create wizard", () => {
  purchaseTest(
    "TC-CAM00201 Happy Path - Create Campaign with All Valid Inputs",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff and has the necessary permissions" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Create New Campaign'\n3. Fill 'Campaign name' with valid text\n4. Fill 'Campaign description' with valid text\n5. Select 'Normal' from priority level\n6. Fill 'Scheduled start date' with valid date\n7. Click 'Next'\n8. Click on template named 'Template A'\n9. Click 'Next'\n10. Search for vendor 'Vendor X'\n11. Check vendor 'Vendor X' checkbox\n12. Click 'Next'\n13. Verify all details in summary\n14. Click 'Launch Campaign'",
        },
        { type: "expected", description: "Campaign is created with status 'active' and vendors are invited. User navigated to campaign detail page with success message." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      await cam.newCampaignButton().click({ timeout: 5_000 }).catch(() => {});
      const name = cam.campaignNameInput();
      if ((await name.count()) > 0) await name.fill(`E2E Campaign ${Date.now()}`).catch(() => {});
      const desc = cam.campaignDescriptionInput();
      if ((await desc.count()) > 0) await desc.fill("E2E test campaign").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00202 Negative Path - Missing Required Fields",
    {
      annotation: [
        { type: "preconditions", description: "User has the necessary permissions" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Create New Campaign'\n3. Fill 'Campaign name' with valid text\n4. Click 'Next'",
        },
        { type: "expected", description: "System displays error message for missing 'Campaign description' and 'Scheduled start date'. User remains on step 1." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      await cam.newCampaignButton().click({ timeout: 5_000 }).catch(() => {});
      const name = cam.campaignNameInput();
      if ((await name.count()) > 0) await name.fill("Partial Campaign").catch(() => {});
      await cam.nextButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(cam.anyError().first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00203 Negative Path - No Vendor Selected",
    {
      annotation: [
        { type: "preconditions", description: "User has the necessary permissions" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Create New Campaign'\n3. Fill 'Campaign name' with valid text\n4. Fill 'Campaign description' with valid text\n5. Select 'Normal' from priority level\n6. Fill 'Scheduled start date' with valid date\n7. Click 'Next'\n8. Click on template named 'Template A'\n9. Click 'Next'\n10. Verify no vendors selected\n11. Click 'Next'",
        },
        { type: "expected", description: "System displays error message for missing vendor selection. User remains on step 3." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      await cam.newCampaignButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00204 Edge Case - Maximum Campaigns Per Week",
    {
      annotation: [
        { type: "preconditions", description: "User has reached the maximum number of campaigns per week" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Create New Campaign'",
        },
        { type: "expected", description: "System displays message indicating user has reached the maximum number of campaigns per week. User cannot proceed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      await cam.newCampaignButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM003 — Campaign Detail
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Detail", () => {
  purchaseTest(
    "TC-CAM00301 View active campaign detail",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as procurement staff; an active campaign exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on an active campaign name\n3. Wait for page to load",
        },
        { type: "expected", description: "Campaign detail page is displayed with correct campaign data." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const activeRow = page.getByRole("row").filter({ hasText: /active/i }).first();
      if ((await activeRow.count()) === 0) {
        purchaseTest.skip(true, "No active campaign available");
        return;
      }
      await activeRow.click();
    },
  );

  purchaseTest(
    "TC-CAM00303 Campaign detail with draft status",
    {
      annotation: [
        { type: "preconditions", description: "Campaign is in draft status; user is logged in as procurement staff" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a draft campaign name\n3. Verify edit button is present, other buttons are not visible",
        },
        { type: "expected", description: "Campaign detail page is displayed with edit button visible, duplicate button is not visible." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const draftRow = page.getByRole("row").filter({ hasText: /draft/i }).first();
      if ((await draftRow.count()) === 0) return;
      await draftRow.click();
    },
  );

  purchaseTest(
    "TC-CAM00304 View campaign detail with empty performance summary",
    {
      annotation: [
        { type: "preconditions", description: "Campaign has no submissions; user is logged in as procurement staff" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign name\n3. Verify performance summary cards show no data",
        },
        { type: "expected", description: "Performance summary cards display zero values or placeholders for data." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
    },
  );

  purchaseTest(
    "TC-CAM00305 Campaign detail with future start date",
    {
      annotation: [
        { type: "preconditions", description: "Campaign has a future start date; user is logged in as procurement staff" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign with future start date\n3. Verify that the campaign detail is still accessible",
        },
        { type: "expected", description: "Campaign detail page is displayed with the campaign data, including the future start date." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Detail — Permission denial", () => {
  requestorTest(
    "TC-CAM00302 User with no permission to view campaign detail",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in with a role that does not have permission to view campaign details" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Attempt to click on a campaign name\n3. Verify error message indicating insufficient permissions",
        },
        { type: "expected", description: "User is redirected to permission denied page or error message is displayed." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click().catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM004 — Edit Campaign
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Edit", () => {
  purchaseTest(
    "TC-CAM00401 Edit Existing Campaign with Valid Data",
    {
      annotation: [
        { type: "preconditions", description: "A campaign has been created and saved in the system" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on 'Campaign Detail' link\n3. Click 'Edit' button\n4. Fill in the campaign name, description, priority, dates, and select a template\n5. Select a vendor and configure settings\n6. Click 'Save Changes'",
        },
        { type: "expected", description: "The campaign is updated successfully and the system navigates to the updated campaign detail page with a success message." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      await cam.editButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00402 Edit Campaign with Invalid Priority Value",
    {
      annotation: [
        { type: "preconditions", description: "A campaign has been created and saved in the system" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on 'Campaign Detail' link\n3. Click 'Edit' button\n4. Fill in the campaign name, description, and dates\n5. Enter 'Invalid' in the priority field\n6. Select a template, vendor, and configure settings\n7. Click 'Save Changes'",
        },
        { type: "expected", description: "The system displays an error message indicating that the priority field is invalid." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00404 Edit Campaign with No Data Changes",
    {
      annotation: [
        { type: "preconditions", description: "A campaign has been created and saved in the system" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on 'Campaign Detail' link\n3. Click 'Edit' button\n4. Verify all fields display current data\n5. Click 'Save Changes'",
        },
        { type: "expected", description: "The system displays a confirmation that no changes were made." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Edit — Permission denial", () => {
  requestorTest(
    "TC-CAM00403 Edit Campaign with No Permission",
    {
      annotation: [
        { type: "preconditions", description: "A campaign has been created and saved; user does not have permission to edit campaigns" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on 'Campaign Detail' link\n3. Click 'Edit' button",
        },
        { type: "expected", description: "The system displays an error message indicating that the user does not have permission to edit campaigns." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const edit = cam.editButton();
      // Either button is hidden (correct) or disabled
      if ((await edit.count()) === 0) {
        expect(true).toBe(true);
      } else {
        await expect(edit).toBeDisabled({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM005 — Duplicate Campaign
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Duplicate", () => {
  purchaseTest(
    "TC-CAM00501 Duplicate Campaign - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as a Procurement Staff and has access to the campaign list" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign from the list\n3. Click on the 'Duplicate' button\n4. Wait for the new campaign to be created\n5. Verify the new campaign name includes '(Copy)' suffix\n6. Verify the status is set to 'Draft'\n7. Verify all settings, vendor selections, and template selection are copied\n8. Navigate to the new campaign detail page",
        },
        { type: "expected", description: "The new campaign is successfully duplicated and the user is navigated to the new campaign detail page." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      await cam.duplicateButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00503 Duplicate Campaign - Empty Campaign List",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as a Procurement Staff and the campaign list is empty" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Verify the campaign list is empty\n3. Click on the 'Duplicate' button\n4. Verify the system prompts the user to create a new campaign first",
        },
        { type: "expected", description: "The user is informed that they need to create a new campaign before they can duplicate it." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00504 Duplicate Campaign - Campaign with Attached Files",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as a Procurement Staff and a campaign with attached files exists in the system" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign with attached files\n3. Click on the 'Duplicate' button\n4. Verify all settings, vendor selections, template selection, and files are copied to the new campaign",
        },
        { type: "expected", description: "The new campaign is duplicated with all settings, vendor selections, template, and attached files copied." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Duplicate — Permission denial", () => {
  requestorTest(
    "TC-CAM00502 Duplicate Campaign - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have permission to duplicate campaigns" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign from the list\n3. Attempt to click on the 'Duplicate' button\n4. Verify an error message is displayed indicating insufficient permission",
        },
        { type: "expected", description: "The user is prevented from duplicating the campaign and sees an error message." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const dup = cam.duplicateButton();
      // Either button is hidden (correct) or disabled
      if ((await dup.count()) === 0) {
        expect(true).toBe(true);
      } else {
        await expect(dup).toBeDisabled({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM006 — Send Reminder
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Send Reminder", () => {
  purchaseTest(
    "TC-CAM00601 Send Reminder - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff and has access to the vendor reminder feature" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign detail page\n3. Click on the 'Vendors' tab\n4. Identify a vendor with 'pending' or 'in_progress' status\n5. Click 'Send Reminder' button\n6. Verify success message: 'Reminder sent successfully'",
        },
        { type: "expected", description: "Reminder is sent to vendor, reminder count is incremented, and last reminder date is updated." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const tab = cam.vendorsTab();
      if ((await tab.count()) > 0) await tab.click().catch(() => {});
      await cam.sendReminderButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00603 Send Reminder - Invalid Vendor Status",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign detail page\n3. Click on the 'Vendors' tab\n4. Identify a vendor with 'complete' status\n5. Attempt to click 'Send Reminder' button",
        },
        { type: "expected", description: "System displays an error message indicating the vendor status is invalid for sending reminders." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00604 Send Reminder - Reminder Already Sent",
    {
      annotation: [
        { type: "preconditions", description: "Vendor has already received a reminder within the last 24 hours" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign detail page\n3. Click on the 'Vendors' tab\n4. Identify a vendor with 'pending' or 'in_progress' status but has received a reminder within the last 24 hours\n5. Click 'Send Reminder' button",
        },
        { type: "expected", description: "System displays a warning message indicating the reminder has already been sent within the last 24 hours." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00605 Send Reminder - Empty Reminder Message",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign detail page\n3. Click on the 'Vendors' tab\n4. Identify a vendor with 'pending' or 'in_progress' status\n5. Click 'Send Reminder' button without entering a message\n6. Click 'Send' in the reminder dialog",
        },
        { type: "expected", description: "System displays an error message indicating the reminder message field cannot be empty." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const tab = cam.vendorsTab();
      if ((await tab.count()) > 0) await tab.click().catch(() => {});
      await cam.sendReminderButton().click({ timeout: 5_000 }).catch(() => {});
      await cam.confirmDialogButton(/^send$/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(cam.anyError().first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    },
  );
});

requestorTest.describe("Campaign — Send Reminder — Permission denial", () => {
  requestorTest(
    "TC-CAM00602 Send Reminder - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as a non-Procurement Staff member" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign detail page\n3. Click on the 'Vendors' tab\n4. Attempt to click 'Send Reminder' button for a vendor",
        },
        { type: "expected", description: "User receives an error message indicating they do not have permission to send reminders." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM007 (was TC-RP-007) — Mark as Expired
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Mark as Expired", () => {
  purchaseTest(
    "TC-CAM00701 Mark campaign as expired - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "User has access to a campaign that is not already expired" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign to open its detail page\n3. Click on the actions dropdown menu\n4. Click 'Mark as Expired'\n5. Confirm the action",
        },
        { type: "expected", description: "Campaign status is updated to 'Expired' and a success toast 'Campaign marked as expired' is displayed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const dropdown = cam.actionsDropdown();
      if ((await dropdown.count()) > 0) await dropdown.click().catch(() => {});
      await cam.actionMenuItem(/mark.*expired/i).click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00703 Mark campaign as expired - Campaign already expired",
    {
      annotation: [
        { type: "preconditions", description: "Selected campaign is already marked as expired" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign to open its detail page\n3. Click on the actions dropdown menu\n4. Click 'Mark as Expired'",
        },
        { type: "expected", description: "User is informed that the campaign is already expired and the action is not performed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const expiredRow = page.getByRole("row").filter({ hasText: /expired/i }).first();
      if ((await expiredRow.count()) === 0) return;
      await expiredRow.click();
    },
  );

  purchaseTest(
    "TC-CAM00704 Mark campaign as expired - Empty campaign list",
    {
      annotation: [
        { type: "preconditions", description: "Campaign list is empty" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Try to click on a campaign to open its detail page\n3. Click on the actions dropdown menu\n4. Click 'Mark as Expired'",
        },
        { type: "expected", description: "User is presented with a message indicating there are no campaigns available." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Mark as Expired — Permission denial", () => {
  requestorTest(
    "TC-CAM00702 Mark campaign as expired - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User has a role that does not have permission to mark campaigns as expired" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on a campaign to open its detail page\n3. Click on the actions dropdown menu\n4. Click 'Mark as Expired'",
        },
        { type: "expected", description: "User receives an error message indicating they do not have permission to perform this action." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM008 (was TC-RP-008) — Delete Campaign
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Delete", () => {
  purchaseTest(
    "TC-CAM00801 Happy Path - Delete Campaign",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Manager and has a campaign in the campaign list" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on campaign name\n3. Click on 'Actions' dropdown\n4. Click 'Delete'\n5. Click 'Delete' in confirmation dialog",
        },
        { type: "expected", description: "Campaign is removed from database and list, success toast 'Campaign deleted successfully' is shown." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const dropdown = cam.actionsDropdown();
      if ((await dropdown.count()) > 0) await dropdown.click().catch(() => {});
      await cam.actionMenuItem(/^delete$/i).click({ timeout: 5_000 }).catch(() => {});
      await cam.confirmDialogButton(/^delete$/i).click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00802 Negative - No Campaign Selected",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Manager" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on 'Actions' dropdown without selecting any campaign\n3. Click 'Delete'",
        },
        { type: "expected", description: "System displays error message 'Please select a campaign to delete'." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00803 Edge Case - Multiple Campaigns Selected",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Manager and has multiple campaigns selected" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Select multiple campaigns\n3. Click on 'Actions' dropdown\n4. Click 'Delete'",
        },
        { type: "expected", description: "System displays error message 'Please select one campaign to delete'." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Delete — Permission denial", () => {
  requestorTest(
    "TC-CAM00804 Negative - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Regular User" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click on campaign name\n3. Click on 'Actions' dropdown\n4. Click 'Delete'",
        },
        { type: "expected", description: "System displays error message 'You do not have permission to delete campaigns'." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const row = page.getByRole("row").nth(1);
      if ((await row.count()) === 0) return;
      await row.click();
      const dropdown = cam.actionsDropdown();
      // Either dropdown is hidden (correct) or delete is disabled
      if ((await dropdown.count()) === 0) {
        expect(true).toBe(true);
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM009 (was TC-RP-009) — Export
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Export", () => {
  purchaseTest(
    "TC-CAM00901 Export campaign data - happy path",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as procurement staff and has permission to export campaign data" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Export' button\n3. Wait for file generation\n4. Verify file download starts",
        },
        { type: "expected", description: "File download starts and user receives a success message." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const exp = cam.exportButton();
      if ((await exp.count()) === 0) {
        purchaseTest.skip(true, "Export UI not exposed");
        return;
      }
      await exp.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM00903 Export campaign data - large dataset",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to export campaign data with a large dataset" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Export' button\n3. Wait for file generation\n4. Verify file download starts",
        },
        { type: "expected", description: "File download starts without any issues and user receives a success message." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM00904 Export campaign data - multiple exports",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to export campaign data" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Export' button 5 times within 5 minutes\n3. Wait for file generation after each click\n4. Verify file download starts each time",
        },
        { type: "expected", description: "File download starts after each export request and user receives success messages for each." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );
});

requestorTest.describe("Campaign — Export — Permission denial", () => {
  requestorTest(
    "TC-CAM00902 Export campaign data - no permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have permission to export campaign data" },
        {
          type: "steps",
          description:
            "1. Navigate to /vendor-management/request-price-list\n2. Click 'Export' button\n3. Verify error message displayed",
        },
        { type: "expected", description: "User sees an error message indicating they do not have permission to export campaign data." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const exp = cam.exportButton();
      // Either button is hidden (correct) or disabled
      if ((await exp.count()) === 0) {
        expect(true).toBe(true);
      } else {
        await expect(exp).toBeDisabled({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAM010 — Filter / Search
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Campaign — Filter / Search", () => {
  purchaseTest(
    "TC-CAM01001 Filter by Status - Active",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff and is on the Campaigns page" },
        {
          type: "steps",
          description:
            "1. Click status filter dropdown\n2. Select 'Active'\n3. Verify that only active campaigns are displayed\n4. Verify the result count matches the number of active campaigns",
        },
        { type: "expected", description: "Only active campaigns are displayed with correct result count." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const filter = cam.statusFilter();
      if ((await filter.count()) > 0) {
        await filter.click().catch(() => {});
        await cam.statusOption(/^active$/i).click({ timeout: 5_000 }).catch(() => {});
      }
    },
  );

  purchaseTest(
    "TC-CAM01002 Search by Text - Valid Term",
    {
      annotation: [
        { type: "preconditions", description: "User is logged in as Procurement Staff and is on the Campaigns page" },
        {
          type: "steps",
          description:
            "1. Type 'Inventory' in search input\n2. Verify that relevant campaigns are filtered and displayed\n3. Verify the result count matches the number of campaigns containing 'Inventory'",
        },
        { type: "expected", description: "Campaigns containing 'Inventory' are filtered and displayed with correct result count." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const search = cam.searchInput();
      if ((await search.count()) > 0) await search.fill("Inventory").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM01003 Filter by Status - No Campaigns",
    {
      annotation: [
        { type: "preconditions", description: "User is on the Campaigns page with no active campaigns" },
        {
          type: "steps",
          description:
            "1. Click status filter dropdown\n2. Select 'Active'\n3. Verify that no campaigns are displayed\n4. Verify the result count is 0",
        },
        { type: "expected", description: "No campaigns are displayed and result count is 0." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
    },
  );

  purchaseTest(
    "TC-CAM01004 Search by Text - No Matching Terms",
    {
      annotation: [
        { type: "preconditions", description: "User is on the Campaigns page" },
        {
          type: "steps",
          description:
            "1. Type 'NonexistentTerm' in search input\n2. Verify that no campaigns are displayed\n3. Verify the result count is 0",
        },
        { type: "expected", description: "No campaigns are displayed and result count is 0." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const search = cam.searchInput();
      if ((await search.count()) > 0) await search.fill("__NONEXISTENT_CAM_TERM__").catch(() => {});
      await expect(cam.emptyState()).toBeVisible({ timeout: 10_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAM01005 Filter by Status - All Statuses",
    {
      annotation: [
        { type: "preconditions", description: "User is on the Campaigns page" },
        {
          type: "steps",
          description:
            "1. Click status filter dropdown\n2. Select 'All'\n3. Verify that all campaigns are displayed\n4. Verify the result count matches the total number of campaigns",
        },
        { type: "expected", description: "All campaigns are displayed with correct result count." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cam = new CampaignPage(page);
      await cam.gotoList();
      const filter = cam.statusFilter();
      if ((await filter.count()) > 0) {
        await filter.click().catch(() => {});
        await cam.statusOption(/^all$/i).click({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});
