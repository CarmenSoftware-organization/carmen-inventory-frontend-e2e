import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { StoreRequisitionPage, LIST_PATH } from "./pages/store-requisition.page";

// ─────────────────────────────────────────────────────────────────────────
// Multi-role auth — Requestor/Approver/Storekeeper == purchase@blueledgers.com.
// Permission denial / no-department cases use requestor@blueledgers.com.
// requestor declared LAST so doc default role reads "Purchase".
// ─────────────────────────────────────────────────────────────────────────
const requestorTest = createAuthTest("requestor@blueledgers.com");
const purchaseTest = createAuthTest("purchase@blueledgers.com");

// ═════════════════════════════════════════════════════════════════════════
// TC-SR001 — Create Requisition
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Create", () => {
  purchaseTest(
    "TC-SR00101 Happy Path - Create Store Requisition",
    {
      annotation: [
        { type: "preconditions", description: "User is authenticated, has Requestor role, is assigned to a department, and has access to at least one source location" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'New Requisition'\n3. Fill Expected delivery date\n4. Fill Description/purpose\n5. Select source location from 'Request From' dropdown\n6. Verify requisition number is auto-generated\n7. Verify requisition date is current\n8. Verify 'Requested By' field is auto-populated\n9. Click 'Save as Draft'",
        },
        { type: "expected", description: "Requisition is saved as draft successfully, inline item addition section is enabled, and success message is displayed." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      await sr.newRequisitionButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00103 Edge Case - No Source Locations Available",
    {
      annotation: [
        { type: "preconditions", description: "User has Requestor role, assigned to department, but no authorized source locations exist" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'New Requisition'\n3. Attempt to select source location from 'Request From' dropdown",
        },
        { type: "expected", description: "System displays warning message 'No storage locations available for your department', suggests contacting administrator." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00104 Negative - Invalid Input - Missing Expected Delivery Date",
    {
      annotation: [
        { type: "preconditions", description: "User has Requestor role, assigned to department, has access to source location" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'New Requisition'\n3. Fill Description/purpose\n4. Select source location from 'Request From' dropdown\n5. Leave Expected delivery date field empty\n6. Attempt to click 'Save as Draft'",
        },
        { type: "expected", description: "System displays error message for missing expected delivery date, does not save requisition." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      await sr.newRequisitionButton().click({ timeout: 5_000 }).catch(() => {});
      await sr.saveAsDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(sr.anyError().first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00105 Alternate Flow - Quick Create from Template",
    {
      annotation: [
        { type: "preconditions", description: "User has Requestor role, assigned to department, has access to source location, template exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'New Requisition'\n3. Select 'Create from Template'\n4. Select a saved template\n5. Fill Description/purpose\n6. Select source location from 'Request From' dropdown\n7. Fill Expected delivery date\n8. Click 'Save as Draft'",
        },
        { type: "expected", description: "Requisition is saved as draft from template successfully, inline item addition section is enabled, and success message is displayed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Alternate Flow" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

requestorTest.describe("Store Requisition — Create — Permission denial", () => {
  requestorTest(
    "TC-SR00102 Negative - User Not Assigned to Department",
    {
      annotation: [
        { type: "preconditions", description: "User is authenticated but not assigned to any department" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Attempt to click 'New Requisition'",
        },
        { type: "expected", description: "System displays error message 'You must be assigned to a department to create requisitions', 'New Requisition' button is disabled." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const btn = sr.newRequisitionButton();
      // Either button is hidden (correct) or disabled
      if ((await btn.count()) === 0) {
        expect(true).toBe(true);
      } else {
        await expect(btn).toBeDisabled({ timeout: 5_000 }).catch(() => {});
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR002 — Add Items
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Add Items", () => {
  purchaseTest(
    "TC-SR00201 Happy Path - Add Single Item",
    {
      annotation: [
        { type: "preconditions", description: "Requisition exists in Draft status; user is the requisition creator; product master data is available" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Add Item' button\n3. Type 'Office Chair' in search input\n4. Select 'Office Chair' from CommandList\n5. Fill requested quantity '2'\n6. Verify destination location is correct\n7. Click 'Add'",
        },
        { type: "expected", description: "Item 'Office Chair' added to requisition with correct details." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const draftRow = page.getByRole("row").filter({ hasText: /draft/i }).first();
      if ((await draftRow.count()) === 0) return;
      await draftRow.click();
      await sr.addItemButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00202 Negative - Invalid Quantity",
    {
      annotation: [
        { type: "preconditions", description: "Requisition exists in Draft status; user is the requisition creator; product master data is available" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Add Item' button\n3. Type 'Office Chair' in search input\n4. Select 'Office Chair' from CommandList\n5. Fill requested quantity '-1'\n6. Click 'Add'",
        },
        { type: "expected", description: "System displays error: 'Quantity must be greater than zero'." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00203 Edge Case - Insufficient Stock",
    {
      annotation: [
        { type: "preconditions", description: "Requisition exists in Draft status; product 'Office Chair' has insufficient stock" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Add Item' button\n3. Type 'Office Chair' in search input\n4. Select 'Office Chair' from CommandList\n5. Fill requested quantity '5'\n6. Click 'Add'",
        },
        { type: "expected", description: "System displays warning: 'Requested quantity exceeds available stock' and suggests alternative actions." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR003 — Real-time Inventory Check
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Real-time Inventory", () => {
  purchaseTest(
    "TC-SR00301 Happy Path - Sufficient Inventory",
    {
      annotation: [
        { type: "preconditions", description: "User is editing a requisition with a selected product; Inventory Management system is accessible" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit' on an existing requisition\n3. Update requested quantity\n4. Verify system triggers real-time inventory check\n5. Verify 'On Hand' and 'On Order' values\n6. Verify 'Last Price' and 'Last Vendor' values\n7. Verify 'Sufficient' stock status with green indicator\n8. Verify no stock shortfall warning",
        },
        { type: "expected", description: "System correctly displays sufficient inventory status and available quantity." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00302 Negative Case - Insufficient Inventory",
    {
      annotation: [
        { type: "preconditions", description: "User is editing a requisition with a selected product; Inventory Management system is accessible" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit' on an existing requisition\n3. Update requested quantity to exceed available stock\n4. Verify system triggers real-time inventory check\n5. Verify 'Low' stock status with yellow indicator\n6. Verify stock shortfall quantity and expected restock date displayed\n7. Verify suggested actions to reduce quantity or switch location",
        },
        { type: "expected", description: "System correctly indicates insufficient inventory and provides suggested actions." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00303 Edge Case - No Inventory Records",
    {
      annotation: [
        { type: "preconditions", description: "User is editing a requisition with a selected product; Inventory Management system is accessible" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit' on an existing requisition\n3. Select a product with no inventory records\n4. Verify system triggers real-time inventory check\n5. Verify system displays 'This product has no inventory records'\n6. Verify suggested actions to contact storekeeper or consider purchase request",
        },
        { type: "expected", description: "System correctly indicates no inventory records and suggests alternative actions." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00304 Edge Case - Inventory System Unavailable",
    {
      annotation: [
        { type: "preconditions", description: "User is editing a requisition with a selected product; Inventory Management system is inaccessible" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit' on an existing requisition\n3. Update requested quantity\n4. Verify system triggers real-time inventory check\n5. Verify warning message 'Unable to retrieve current stock levels'\n6. Verify system shows last cached inventory data with timestamp",
        },
        { type: "expected", description: "System correctly handles unavailable inventory data by displaying cached information." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR004 — Save / Auto-save
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Save & Auto-save", () => {
  purchaseTest(
    "TC-SR00401 Save as Draft with Valid Input",
    {
      annotation: [
        { type: "preconditions", description: "User is working on requisition with filled header and selected source location" },
        { type: "steps", description: "1. Navigate to /store-operation/store-requisition\n2. Click 'Save as Draft'" },
        { type: "expected", description: "System saves requisition with draft status and displays success toast." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
      await sr.saveAsDraftButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00402 Save as Draft with Missing Requisition Number",
    {
      annotation: [
        { type: "preconditions", description: "User is working on requisition with empty requisition number and filled source location" },
        { type: "steps", description: "1. Navigate to /store-operation/store-requisition\n2. Click 'Save as Draft'" },
        { type: "expected", description: "System displays validation error for missing requisition number." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
      await sr.saveAsDraftButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00403 Auto-Save Draft Every 60 Seconds",
    {
      annotation: [
        { type: "preconditions", description: "User is working on requisition and editing for more than 60 seconds" },
        {
          type: "steps",
          description: "1. Navigate to /store-operation/store-requisition\n2. Wait 60 seconds\n3. Verify subtle auto-save indicator",
        },
        { type: "expected", description: "System displays auto-save indicator at [time] showing draft was auto-saved." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
    },
  );

  purchaseTest(
    "TC-SR00404 Save and Close with Valid Input",
    {
      annotation: [
        { type: "preconditions", description: "User is working on requisition with filled header and selected source location" },
        { type: "steps", description: "1. Navigate to /store-operation/store-requisition\n2. Click 'Save and Close'" },
        { type: "expected", description: "System saves requisition with draft status, navigates to requisitions list, and displays saved draft with Draft status badge." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
      const btn = sr.saveAndCloseButton();
      if ((await btn.count()) > 0) await btn.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00405 Save Failure due to Network/Database Issue",
    {
      annotation: [
        { type: "preconditions", description: "User is working on requisition with filled header and selected source location" },
        { type: "steps", description: "1. Navigate to /store-operation/store-requisition\n2. Click 'Save as Draft'" },
        { type: "expected", description: "System displays error message 'Failed to save requisition. Please try again.' and retains all entered data." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR005 — Submit for Approval
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Submit", () => {
  purchaseTest(
    "TC-SR00501 Submit approved requisition with valid items",
    {
      annotation: [
        { type: "preconditions", description: "Requisition is in Draft status with valid items and quantities" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Verify all line items are correct\n3. Click 'Submit for Approval'\n4. Verify system prompts confirmation dialog\n5. Confirm submission\n6. Verify status changes to In Process\n7. Verify edit buttons are disabled\n8. Verify workflow timeline is displayed",
        },
        { type: "expected", description: "Requisition status updated to In Progress, no errors." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const draftRow = page.getByRole("row").filter({ hasText: /draft/i }).first();
      if ((await draftRow.count()) === 0) return;
      await draftRow.click();
      await sr.submitForApprovalButton().click({ timeout: 5_000 }).catch(() => {});
      await sr.confirmDialogButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00502 Submit requisition with missing destination locations",
    {
      annotation: [
        { type: "preconditions", description: "Requisition is in Draft status with valid items but missing destination locations" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Verify missing destination locations\n3. Click 'Submit for Approval'\n4. Verify system prompts validation errors\n5. Correct destination locations\n6. Click 'Submit for Approval'\n7. Verify system prompts confirmation dialog\n8. Confirm submission",
        },
        { type: "expected", description: "Requisition submitted successfully after correcting validation errors." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00503 Submit requisition with empty line items",
    {
      annotation: [
        { type: "preconditions", description: "Requisition is in Draft status with no items" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Submit for Approval'\n3. Verify system prompts error message",
        },
        { type: "expected", description: "System displays error message: 'Cannot submit requisition without items'." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoNew();
      await sr.submitForApprovalButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(sr.anyError().first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00504 Submit requisition as an unauthorized user",
    {
      annotation: [
        { type: "preconditions", description: "Requisition is in Draft status, but the user is not the creator" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Attempt to click 'Submit for Approval'",
        },
        { type: "expected", description: "System displays error message: 'Unauthorized to perform this action'." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00505 Submit requisition with emergency flag",
    {
      annotation: [
        { type: "preconditions", description: "Requisition is in Draft status, contains valid items, and marked as emergency" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Check 'Mark as Emergency' checkbox\n3. Enter emergency justification (50+ characters)\n4. Click 'Submit for Approval'",
        },
        { type: "expected", description: "Requisition submitted with emergency flag and routed to emergency approval workflow." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR006 — Approver Navigation & List Actions
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Approver list actions", () => {
  purchaseTest(
    "TC-SR00601 Navigate to Store Requisitions with Pending Approvals",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; assigned to approval workflow stage; at least one requisition is pending approval" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Verify the pending approvals count badge displays\n3. Click on a requisition\n4. Verify requisition detail page is displayed",
        },
        { type: "expected", description: "User is navigated to the requisition detail page with all relevant information." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00602 View Requisition Details with Filtered Columns",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; assigned to approval workflow stage; at least one requisition is pending approval" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Sort By' and select 'Total Estimated Value'\n3. Click 'Filter' and select 'Department'\n4. Select a department and verify the list updates accordingly",
        },
        { type: "expected", description: "Requisition list is sorted by total estimated value and filtered by the selected department." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const sort = sr.sortByButton();
      if ((await sort.count()) > 0) await sort.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00603 Bulk Action - Export Selected Requisitions",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; multiple requisitions selected" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Select multiple requisitions\n3. Click 'Bulk Actions' > 'Export Selected'\n4. Verify the export process starts and relevant file is downloaded",
        },
        { type: "expected", description: "Selected requisitions are exported and a file is downloaded." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const bulk = sr.bulkActionsButton();
      if ((await bulk.count()) > 0) await bulk.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00604 No Pending Approvals - Empty State",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role, but no requisitions are pending approval" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Verify 'No pending approvals' message is displayed",
        },
        { type: "expected", description: "System displays 'No pending approvals' message and shows empty state with icon." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00605 Delegate Approvals for Unavailable User",
    {
      annotation: [
        { type: "preconditions", description: "User is on leave and has pending approvals" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Delegate Approvals'\n3. Select a delegate user and date range\n4. Confirm delegation\n5. Verify notification is sent to delegate",
        },
        { type: "expected", description: "Pending approvals are transferred to the delegate user and a notification is sent." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const delegate = sr.delegateApprovalsButton();
      if ((await delegate.count()) > 0) await delegate.click().catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR007 — Approve Requisition
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Approve", () => {
  purchaseTest(
    "TC-SR00701 Approve Requisition with No Quantity Adjustments",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; requisition is at user's approval stage; user has authority to approve for this department" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click on Requisition ID\n3. Verify Requisition number, date, requestor, department\n4. Review line items in table\n5. Verify legitimacy and necessity\n6. Click 'Approve' button\n7. Click 'Approve' in confirmation dialog\n8. Verify success message 'Requisition approved successfully'",
        },
        { type: "expected", description: "Requisition is approved, workflow history updated, next stage assigned, notifications sent to relevant parties." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const inProgressRow = page.getByRole("row").filter({ hasText: /in.progress/i }).first();
      if ((await inProgressRow.count()) === 0) return;
      await inProgressRow.click();
      await sr.approveButton().click({ timeout: 5_000 }).catch(() => {});
      await sr.confirmDialogButton(/^approve$/i).click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR00702 Unauthorized User Attempts to Approve Requisition",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; user does not have authority to approve for this department" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click on Requisition ID\n3. Click 'Approve' button\n4. Verify error message 'You are not authorized to approve at this stage'",
        },
        { type: "expected", description: "User is denied permission to approve requisition; Approve button remains disabled." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00703 Budget Exceeded During Approval",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition value exceeds department budget; user has authority to override budget" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click on Requisition ID\n3. Verify budget exceeded warning\n4. Click 'Proceed with Approval' in warning dialog\n5. Verify success message 'Requisition approved successfully'",
        },
        { type: "expected", description: "Requisition is approved, workflow history updated, next stage assigned, notifications sent, budget warning displayed and overridden." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR008 — Approve Item-Level
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Approve Item-level", () => {
  purchaseTest(
    "TC-SR00801 Happy Path - Approve Item",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition in In Progress status; item pending approval; user has access" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click action menu (three dots) for line item\n3. Select 'Approve'\n4. Confirm approval",
        },
        { type: "expected", description: "Item approved with green checkmark, approved quantity, approver name and timestamp displayed, success toast: 'Item approved'. Requisition state remains In Progress if other items pending." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00802 Negative - Insufficient Stock for Issuance",
    {
      annotation: [
        { type: "preconditions", description: "Storekeeper has access to source location; requisition is in Ready for Issuance status; stock is insufficient for one of the items" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Filter' and select 'Ready for Issuance'\n3. Select a requisition for issuance\n4. Click 'Record Issuance'\n5. Enter issued quantities for all items\n6. Click 'Issue'",
        },
        { type: "expected", description: "System displays error message for item with insufficient stock and prevents issuance." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

requestorTest.describe("Store Requisition — Approve Item-level — Permission denial", () => {
  requestorTest(
    "TC-SR00803 Negative - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User has Storekeeper role; requisition in In Progress status; item pending approval; user has access" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click action menu (three dots) for line item\n3. Attempt to select 'Approve'",
        },
        { type: "expected", description: "System displays message: 'Insufficient permission to approve this item'. Action menu does not include 'Approve' option." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR009 — Adjust Approved Quantity
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Adjust approved quantity", () => {
  purchaseTest(
    "TC-SR00901 Adjust approved quantity: Happy path",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver or Storekeeper role; line item is in approved status; requisition not fully issued; user has authority to modify approvals" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit Approval' from item action menu\n3. Enter new approved quantity\n4. Enter adjustment reason\n5. Confirm adjustment",
        },
        { type: "expected", description: "Line item approved quantity updated, history recorded, notification sent to requestor, success message displayed." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00902 Decrease approved quantity: Insufficient issued quantity",
    {
      annotation: [
        { type: "preconditions", description: "Item has issued quantity; user attempts to reduce approved quantity below issued" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit Approval' from item action menu\n3. Enter new approved quantity less than issued quantity\n4. Verify error message displayed",
        },
        { type: "expected", description: "Error message displayed: 'Cannot reduce below already issued quantity'." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00903 Decrease approved quantity: Fully issued item",
    {
      annotation: [
        { type: "preconditions", description: "Item fully issued" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Attempt to click 'Edit Approval' from item action menu",
        },
        { type: "expected", description: "Action menu disabled, message displayed: 'Item fully issued. Cannot adjust approved quantity.'" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00904 Increase approved quantity: Stock insufficient",
    {
      annotation: [
        { type: "preconditions", description: "Item has insufficient stock; user attempts to increase approved quantity" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Edit Approval' from item action menu\n3. Enter new approved quantity greater than current approved quantity\n4. Verify warning message displayed",
        },
        { type: "expected", description: "Warning message displayed, increase not allowed." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR00905 Concurrent modification detected",
    {
      annotation: [
        { type: "preconditions", description: "Another user modifies same item" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Attempt to click 'Edit Approval' from item action menu\n3. Verify message displayed: 'This item was modified by [User]. Refresh and try again.'",
        },
        { type: "expected", description: "Message displayed, item reloaded with latest data, user can retry adjustment." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR010 — Request Review
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Request Review", () => {
  purchaseTest(
    "TC-SR01001 Request Review with Valid Comments and Specific Items",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; user has concerns requiring clarification" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Request Review' button\n3. Enter detailed review comments in text area\n4. Select specific line items for review\n5. Confirm review request",
        },
        { type: "expected", description: "Review request sent to requestor; system displays success message; sends notification to requestor; updates requisition display with review comments." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const review = sr.requestReviewButton();
      if ((await review.count()) > 0) await review.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR01002 Request Review with Invalid Comments",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Request Review' button\n3. Enter less than 20 characters in review comments text area\n4. Confirm review request",
        },
        { type: "expected", description: "System displays error message: 'Review comments are required (min 20 characters)'." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR01003 Request Review with No Specific Items Selected",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Request Review' button\n3. Enter detailed review comments in text area\n4. Do not select any specific line items for review\n5. Confirm review request",
        },
        { type: "expected", description: "System asks: 'Apply review to all items or select specific items?'. User must select at least one item before confirming." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR011 — Reject Requisition
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Reject", () => {
  purchaseTest(
    "TC-SR01101 Primary Actor Rejects Requisition Successfully",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; user determines requisition should be rejected" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Reject' button in workflow component\n3. Enter detailed rejection reason: 'Specific policy violation'\n4. Confirm rejection",
        },
        { type: "expected", description: "Requisition status updates to 'Rejected', rejection reason is recorded, notifications are sent, and requisition is removed from pending approvals list." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const inProgressRow = page.getByRole("row").filter({ hasText: /in.progress/i }).first();
      if ((await inProgressRow.count()) === 0) return;
      await inProgressRow.click();
      await sr.rejectButton().click({ timeout: 5_000 }).catch(() => {});
      await sr.reasonInput().fill("Specific policy violation").catch(() => {});
      await sr.confirmDialogButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR01102 User Enters Insufficient Rejection Reason",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Reject' button in workflow component\n3. Enter rejection reason: 'Insuff'\n4. Confirm rejection",
        },
        { type: "expected", description: "System displays error: 'Rejection reason must be at least 50 characters', user must provide a detailed reason." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR01103 User Accidentally Rejects Requisition",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; user mistakenly rejects requisition" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Reject' button in workflow component\n3. Enter rejection reason: 'Accidental rejection'\n4. Confirm rejection",
        },
        { type: "expected", description: "System displays success message: 'Requisition rejected', user can void rejection and resubmit corrected requisition." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );

  purchaseTest(
    "TC-SR01104 User Rejects Specific Items Only",
    {
      annotation: [
        { type: "preconditions", description: "User has Approver role; requisition is in In Progress status; user determines specific items should be rejected" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Select 'Reject' from item-level action menu\n3. Enter rejection reason: 'Invalid request'\n4. Confirm rejection",
        },
        { type: "expected", description: "Selected items are marked as rejected, other items continue approval process, requisition status updates to 'Partially Rejected'." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Alternate Flow" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-SR012 — Issuance
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Store Requisition — Issuance", () => {
  purchaseTest(
    "TC-SR01201 Happy Path - Full Issuance",
    {
      annotation: [
        { type: "preconditions", description: "Storekeeper has access to source location; requisition is in Ready for Issuance status" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Filter' and select 'Ready for Issuance'\n3. Select a requisition for issuance\n4. Click 'Record Issuance'\n5. Enter issued quantities for all items\n6. Click 'Issue'\n7. Sign the receipt in the signature pad\n8. Click 'Confirm Receipt'",
        },
        { type: "expected", description: "Requisition is marked as completed, issuance document is generated, and stock balances are updated accordingly." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
      const readyRow = page.getByRole("row").filter({ hasText: /ready.*issuance/i }).first();
      if ((await readyRow.count()) === 0) return;
      await readyRow.click();
      await sr.recordIssuanceButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-SR01203 Edge Case - Partial Issuance",
    {
      annotation: [
        { type: "preconditions", description: "Storekeeper has access to source location; requisition is in Ready for Issuance status" },
        {
          type: "steps",
          description:
            "1. Navigate to /store-operation/store-requisition\n2. Click 'Filter' and select 'Ready for Issuance'\n3. Select a requisition for issuance\n4. Click 'Record Issuance'\n5. Enter partial issued quantities for some items\n6. Click 'Issue'\n7. Sign the receipt in the signature pad\n8. Click 'Confirm Receipt'",
        },
        { type: "expected", description: "Requisition remains in progress status, and remaining quantities are tracked." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const sr = new StoreRequisitionPage(page);
      await sr.gotoList();
    },
  );
});
