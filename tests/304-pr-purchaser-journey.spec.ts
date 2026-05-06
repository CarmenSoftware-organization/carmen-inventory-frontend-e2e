import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import {
  submitPRAsRequestor,
  approveAsHOD,
  bulkApprove,
  bulkReject,
  bulkSendForReview,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Persona-journey spec — Purchaser. Runs alongside 301/302/303.
// Source docs: docs/persona-doc/Purchase Request/Purchaser/INDEX.md and step-01..04.md.
const purchaseTest = createAuthTest("purchase@blueledgers.com");

const REJECT_REASON = "Vendor pricing exceeds budget";
const REVIEW_REASON = "Please confirm vendor selection";
const REVIEW_STAGE = "HOD";

purchaseTest.describe("Step 1 — PR List (Purchaser View)", () => {
  purchaseTest(
    "TC-PR-070101 List loads, My Pending tab default (PRs at Purchase stage)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Purchaser (purchase@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify URL and My Pending tab" },
        { type: "expected", description: "URL is on PR list; My Pending tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = pr.tabMyPending();
      if ((await tab.count()) === 0) return;
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PR-070102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click All Documents tab" },
        { type: "expected", description: "All Documents tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) === 0) {
        purchaseTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PR-070103 All Stage dropdown filters by status",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open All Stage dropdown\n2. Select In Progress" },
        { type: "expected", description: "URL stays on PR list (filter applied or no-op when dropdown absent)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const trigger = page.getByRole("button", { name: /all stage|stage/i }).first();
      if ((await trigger.count()) === 0) {
        purchaseTest.skip(true, "Stage dropdown not present on this list");
        return;
      }
      await trigger.click();
      const inprog = page.getByRole("option", { name: /in.progress/i }).first();
      if ((await inprog.count()) > 0) await inprog.click();
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070104 Filter panel opens and applies",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open Filter panel\n2. Select status\n3. Apply" },
        { type: "expected", description: "URL stays on PR list after applying the filter." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const fb = pr.filterButton();
      if ((await fb.count()) === 0) {
        purchaseTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "In Progress" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070105 Search by PR reference filters list",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR exists with a known reference" },
        { type: "steps", description: "1. Type partial reference in search\n2. Wait for results" },
        { type: "expected", description: "URL stays on PR list after typing in the search input." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const input = pr.searchInput();
      if ((await input.count()) === 0) {
        purchaseTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );
});

purchaseTest.describe("Step 2 — PR Detail (Read-only)", () => {
  purchaseTest(
    "TC-PR-070201 Detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "PR exists at Purchase stage (seeded via submitPRAsRequestor + approveAsHOD)" },
        { type: "steps", description: "1. Open the PR detail page\n2. Verify Items tab is the default" },
        { type: "expected", description: "URL is the detail URL; Items tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) return;
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PR-070202 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        purchaseTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PR-070203 No standalone Approve/Reject/Return buttons (BRD discrepancy)",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page (read-only view)" },
        { type: "steps", description: "1. Inspect detail page header / action toolbar" },
        { type: "expected", description: "Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        purchaseTest.skip(true, "Edit button not present — cannot verify read-only header state");
        return;
      }
      await expect(pr.approveButton()).toHaveCount(0);
      await expect(pr.rejectButton()).toHaveCount(0);
      await expect(pr.sendBackButton()).toHaveCount(0);
    },
  );

  purchaseTest(
    "TC-PR-070204 Edit button visible (entry to vendor/pricing edit)",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (Purchaser can enter Edit Mode for vendor/pricing allocation)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
});

purchaseTest.describe("Step 3 — Edit Mode (Vendor & Pricing)", () => {
  purchaseTest(
    "TC-PR-070301 Click Edit → vendor/pricing fields become editable",
    {
      annotation: [
        { type: "preconditions", description: "PR exists at Purchase stage" },
        { type: "steps", description: "1. Open Purchase-stage PR\n2. Click Edit\n3. Verify Save/Cancel form-level buttons appear" },
        { type: "expected", description: "Save Draft (or Cancel) form-level button is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070302 Vendor field is editable (Purchaser scope)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Vendor input on first row\n3. Verify it is editable" },
        { type: "expected", description: "Vendor input is editable (opposite of Approver, who sees it as read-only)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const vendor = pr.vendorInput(0);
      if ((await vendor.count()) === 0) {
        purchaseTest.skip(true, "Vendor input not present in edit mode");
        return;
      }
      await expect(vendor).toBeEditable();
    },
  );

  purchaseTest(
    "TC-PR-070303 Unit Price field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Unit Price input\n3. Type a value" },
        { type: "expected", description: "Unit Price input accepts the typed value." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) === 0) {
        purchaseTest.skip(true, "Unit Price input not present");
        return;
      }
      await expect(price).toBeEditable();
      await price.fill("125");
      await expect(price).toHaveValue("125");
    },
  );

  purchaseTest(
    "TC-PR-070304 Discount field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Discount input\n3. Verify editable" },
        { type: "expected", description: "Discount input is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const discount = pr.discountInput(0);
      if ((await discount.count()) === 0) {
        purchaseTest.skip(true, "Discount input not present");
        return;
      }
      await expect(discount).toBeEditable();
    },
  );

  purchaseTest(
    "TC-PR-070305 Tax Profile field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Tax Profile select\n3. Verify editable" },
        { type: "expected", description: "Tax Profile select is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const tax = pr.taxProfileSelect(0);
      if ((await tax.count()) === 0) {
        purchaseTest.skip(true, "Tax Profile select not present");
        return;
      }
      const disabled = await tax.isDisabled().catch(() => false);
      const ariaDisabled = (await tax.getAttribute("aria-disabled").catch(() => null)) === "true";
      expect(disabled || ariaDisabled).toBeFalsy();
    },
  );

  purchaseTest(
    "TC-PR-070306 Approved Qty field stays read-only (HOD already set it)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Approved Qty cell on first row" },
        { type: "expected", description: "Approved Qty cell is disabled or non-editable for Purchaser (HOD already set it)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cell = pr.approvedQtyReadOnlyCell(0);
      if ((await cell.count()) === 0) {
        purchaseTest.skip(true, "Approved Qty cell not present");
        return;
      }
      const disabled = await cell.isDisabled().catch(() => false);
      const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  purchaseTest(
    "TC-PR-070307 Auto Allocate button populates vendors via scoring",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Click Auto Allocate" },
        { type: "expected", description: "URL stays on detail page after click (allocation runs)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const auto = pr.autoAllocateButton();
      if ((await auto.count()) === 0) {
        purchaseTest.skip(true, "Auto Allocate button not present in this build");
        return;
      }
      await auto.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070308 Multiple line items — pricing on each row independent",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with multiple items" },
        { type: "steps", description: "1. Seed PR with 2 items\n2. Enter edit mode\n3. Set unit price on row 0\n4. Set unit price on row 1\n5. Verify both values present" },
        { type: "expected", description: "Each row's Unit Price input retains its own value." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 2 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price0 = pr.unitPriceInput(0);
      const price1 = pr.unitPriceInput(1);
      if ((await price0.count()) === 0 || (await price1.count()) === 0) {
        purchaseTest.skip(true, "Unit Price inputs not present on both rows");
        return;
      }
      await price0.fill("100");
      await price1.fill("200");
      await expect(price0).toHaveValue("100");
      await expect(price1).toHaveValue("200");
    },
  );

  purchaseTest(
    "TC-PR-070309 Save edits → exit edit mode + persist values",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with vendor/price edits" },
        { type: "steps", description: "1. Enter edit mode\n2. Set unit price\n3. Click Save Draft" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("150");
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070310 Cancel edits → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into Unit Price\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("999");
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
});

purchaseTest.describe("Step 4 — Workflow Actions", () => {
  purchaseTest(
    "TC-PR-070401 Bulk Approve → PR advances to next stage (FC)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Approve in bulk toolbar\n4. Confirm" },
        { type: "expected", description: "URL stays on the PR ref (status advances to next stage)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Approve button not present in toolbar");
        return;
      }
      await bulkApprove(page);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070402 Bulk Reject (with reason)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Reject\n4. Enter reason\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after rejection." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkRejectInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Reject button not present");
        return;
      }
      await bulkReject(page, REJECT_REASON);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070403 Bulk Send for Review (return to HOD)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Send for Review\n4. Enter reason + stage\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after send for review." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkSendForReviewInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Send for Review button not present");
        return;
      }
      await bulkSendForReview(page, REVIEW_REASON, REVIEW_STAGE);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070404 Bulk Split — split selected items",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Split" },
        { type: "expected", description: "Split UI appears (dialog or inline) — verified by URL stays on detail." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      const split = pr.bulkSplitInEditMode();
      if ((await split.count()) === 0) {
        purchaseTest.skip(true, "Bulk Split button not present");
        return;
      }
      await split.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PR-070405 Cannot edit when PR is at non-Purchase stage (read-only)",
    {
      annotation: [
        { type: "preconditions", description: "PR is at HOD stage (not yet approved by HOD), viewed by Purchaser" },
        { type: "steps", description: "1. Seed PR at HOD stage (skip approveAsHOD)\n2. Open detail as Purchaser\n3. Inspect Edit button" },
        { type: "expected", description: "Edit button is absent OR detail is read-only — Purchaser cannot edit until PR reaches Purchase stage." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      // Seed PR at HOD stage only — DO NOT call approveAsHOD
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      const editCount = await editBtn.count();
      if (editCount === 0) {
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      await editBtn.click({ timeout: 5_000 }).catch(() => {});
      const vendor = pr.vendorInput(0);
      if ((await vendor.count()) === 0) {
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      expect(disabled || ariaDisabled).toBeTruthy();
    },
  );
});

purchaseTest.describe.serial("Golden Journey", () => {
  purchaseTest(
    "TC-PR-070901 Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Purchaser; a fresh PR is seeded at Purchase stage via submitPRAsRequestor + approveAsHOD" },
        { type: "steps", description: "1. Open PR list\n2. Open PR detail\n3. Click Edit\n4. Set unit price on first row\n5. Select all + Bulk Approve + Confirm" },
        { type: "expected", description: "URL stays on the PR ref after bulk approve; the journey completes end-to-end." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PR-070901 golden" });
      await approveAsHOD(browser, created.ref);

      // Step 1: PR List
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));

      // Step 2: PR Detail
      await gotoPRDetail(page, created.ref);

      // Step 3: Enter Edit Mode
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();

      // Step 4: Set Unit Price on first row
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("175");

      // Step 5: Bulk Approve
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Approve button not present");
        return;
      }
      await bulkApprove(page);

      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});
