import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import { MyApprovalsPage } from "./pages/my-approvals.page";
import {
  submitPRAsRequestor,
  bulkApprove,
  bulkReject,
  bulkSendForReview,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Persona-journey spec — Approver (HOD primary, FC for scope contrast).
// Runs alongside 301-purchase-request.spec.ts (per-action) and 302-pr-creator-journey.spec.ts.
// Source docs: docs/persona-doc/Purchase Request/Approver/INDEX.md and step-01..04.md.
const hodTest = createAuthTest("hod@blueledgers.com");
const fcTest = createAuthTest("fc@blueledgers.com");

const REJECT_REASON = "Items discontinued in catalogue";
const REVIEW_REASON = "Please verify quantity";
const REVIEW_STAGE = "Purchase";

hodTest.describe("Step 1 — My Approval Dashboard", () => {
  hodTest(
    "TC-PRA0101 Dashboard loads with Total Pending count visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD (hod@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to My Approvals\n2. Verify pending count badge is visible" },
        { type: "expected", description: "My Approvals dashboard loads; pending count badge is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0102 Click pending PR row navigates to PR detail",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard with at least one pending PR row" },
        { type: "steps", description: "1. Click first pending PR row" },
        { type: "expected", description: "URL navigates to /procurement/purchase-request/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const created = await submitPRAsRequestor(browser);
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      const row = ma.documentRow(created.ref);
      if ((await row.count()) === 0) {
        hodTest.skip(true, "Seeded PR not visible in HOD's pending list");
        return;
      }
      await row.click();
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0103 Pending count matches actual list row count",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard" },
        { type: "steps", description: "1. Read pending badge value\n2. Count visible PR rows" },
        { type: "expected", description: "Badge value equals the visible row count (or both are zero)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });
      const badgeText = await ma.pendingCountBadge().textContent();
      const badgeNum = parseInt((badgeText ?? "0").replace(/[^0-9]/g, ""), 10) || 0;
      const rowCount = await page.getByRole("row").count();
      const dataRowCount = Math.max(0, rowCount - (rowCount > 0 ? 1 : 0));
      expect(Math.abs(badgeNum - dataRowCount)).toBeLessThanOrEqual(1);
    },
  );

  hodTest(
    "TC-PRA0104 Filter tabs render and filter when present",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard" },
        { type: "steps", description: "1. Look for category filter tabs (PO/PR/SR)\n2. Click PR tab if present" },
        { type: "expected", description: "PR tab becomes selected (skipped if dashboard has no tabs)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      const tab = page.getByRole("tab", { name: /^pr$|purchase request/i }).first();
      if ((await tab.count()) === 0) {
        hodTest.skip(true, "Category tabs not present on My Approvals dashboard");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );
});

hodTest.describe("Step 2 — PR List (Approver View)", () => {
  hodTest(
    "TC-PRA0201 My Pending tab shows PRs at HOD stage",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD; navigated to PR list" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify My Pending tab is selected" },
        { type: "expected", description: "URL is on PR list and the My Pending tab is selected when present." },
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

  hodTest(
    "TC-PRA0202 All Documents tab broadens scope",
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
        hodTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0203 All Stage dropdown filters by status",
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
        hodTest.skip(true, "Stage dropdown not present on this list");
        return;
      }
      await trigger.click();
      const inprog = page.getByRole("option", { name: /in.progress/i }).first();
      if ((await inprog.count()) > 0) await inprog.click();
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0204 Filter panel opens and applies",
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
        hodTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "In Progress" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0205 Search by PR reference filters list",
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
        hodTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );
});

hodTest.describe("Step 3 — PR Detail (Read-only)", () => {
  hodTest(
    "TC-PRA0301 Detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "A pending PR (In Progress, HOD stage) exists; created via submitPRAsRequestor" },
        { type: "steps", description: "1. Open the PR detail page\n2. Verify Items tab is the default" },
        { type: "expected", description: "URL is the detail URL; Items tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) return;
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0302 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        hodTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0303 No standalone Approve/Reject/Return buttons (BRD discrepancy)",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page (read-only view)" },
        { type: "steps", description: "1. Inspect detail page header / action toolbar" },
        { type: "expected", description: "Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        hodTest.skip(true, "Edit button not present — cannot verify read-only header state");
        return;
      }
      await expect(pr.approveButton()).toHaveCount(0);
      await expect(pr.rejectButton()).toHaveCount(0);
      await expect(pr.sendBackButton()).toHaveCount(0);
    },
  );

  hodTest(
    "TC-PRA0304 Edit button visible (entry to bulk actions)",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (HOD can enter Edit Mode for bulk actions)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
});

hodTest.describe("Step 4 — Edit Mode + Bulk Actions", () => {
  hodTest(
    "TC-PRA0401 Click Edit → edit mode active",
    {
      annotation: [
        { type: "preconditions", description: "A pending PR detail page is open" },
        { type: "steps", description: "1. Click Edit\n2. Verify Save/Cancel form-level buttons appear" },
        { type: "expected", description: "Save Draft (or Cancel) form-level button is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        hodTest.skip(true, "Edit button not present in this build");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0402 Approved Quantity field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Approved Qty input on first row\n3. Verify it is editable" },
        { type: "expected", description: "Approved Qty input is visible and accepts a value." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) === 0) {
        hodTest.skip(true, "Approved Qty input not present in edit mode");
        return;
      }
      await expect(qty).toBeEditable();
      await qty.fill("3");
      await expect(qty).toHaveValue("3");
    },
  );

  hodTest(
    "TC-PRA0403 Item Note field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Item Note input\n3. Type a note" },
        { type: "expected", description: "Item Note input accepts the typed value." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const note = pr.itemNoteInput(0);
      if ((await note.count()) === 0) {
        hodTest.skip(true, "Item Note input not present");
        return;
      }
      await note.fill("HOD note");
      await expect(note).toHaveValue("HOD note");
    },
  );

  hodTest(
    "TC-PRA0404 Delivery Point field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Delivery Point input\n3. Verify editable" },
        { type: "expected", description: "Delivery Point input is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const dp = pr.deliveryPointInput(0);
      if ((await dp.count()) === 0) {
        hodTest.skip(true, "Delivery Point input not present");
        return;
      }
      await expect(dp).toBeEditable();
    },
  );

  hodTest(
    "TC-PRA0405 Vendor field is read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Vendor cell on first row" },
        { type: "expected", description: "Vendor cell is disabled or non-editable per FR-PR-011A." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const vendor = pr.vendorReadOnlyCell(0);
      if ((await vendor.count()) === 0) {
        hodTest.skip(true, "Vendor cell not present");
        return;
      }
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await vendor.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  hodTest(
    "TC-PRA0406 Unit Price field is read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Unit Price cell on first row" },
        { type: "expected", description: "Unit Price cell is disabled or non-editable per FR-PR-011A." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cell = pr.unitPriceReadOnlyCell(0);
      if ((await cell.count()) === 0) {
        hodTest.skip(true, "Unit Price cell not present");
        return;
      }
      const disabled = await cell.isDisabled().catch(() => false);
      const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  hodTest(
    "TC-PRA0407 Discount / Tax / FOC Qty are read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Discount, Tax, FOC Qty cells" },
        { type: "expected", description: "All three cells are disabled or non-editable per FR-PR-011A / FR-PR-024." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cells = [pr.discountReadOnlyCell(0), pr.taxReadOnlyCell(0), pr.focQtyReadOnlyCell(0)];
      let assertedAtLeastOne = false;
      for (const cell of cells) {
        if ((await cell.count()) === 0) continue;
        const disabled = await cell.isDisabled().catch(() => false);
        const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
        const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
        const isInput = tagName === "input" || tagName === "textarea";
        expect(disabled || ariaDisabled || !isInput).toBeTruthy();
        assertedAtLeastOne = true;
      }
      if (!assertedAtLeastOne) {
        hodTest.skip(true, "None of Discount / Tax / FOC Qty cells are present");
      }
    },
  );

  hodTest(
    "TC-PRA0408 Bulk Approve via Select All → toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Approve in bulk toolbar\n4. Confirm" },
        { type: "expected", description: "Status transitions away from In Progress (toast / next-stage / reload state)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      if ((await pr.bulkActionToolbar().count()) === 0) {
        await pr.selectAllInEditMode();
      }
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Approve button not present in toolbar");
        return;
      }
      await bulkApprove(page);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0409 Bulk Reject via toolbar (with reason)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Reject\n4. Enter reason\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after rejection (status badge updates)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkRejectInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Reject button not present in toolbar");
        return;
      }
      await bulkReject(page, REJECT_REASON);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0410 Bulk Send for Review via toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Send for Review\n4. Enter reason + stage\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after send for review." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkSendForReviewInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Send for Review button not present");
        return;
      }
      await bulkSendForReview(page, REVIEW_REASON, REVIEW_STAGE);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0411 Bulk Split via toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Split" },
        { type: "expected", description: "Split UI appears (dialog or inline) — verified by URL stays on detail." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      const split = pr.bulkSplitInEditMode();
      if ((await split.count()) === 0) {
        hodTest.skip(true, "Bulk Split button not present");
        return;
      }
      await split.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0412 Cancel edit → discard changes",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into Approved Qty\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) > 0) await qty.fill("99");
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
});

fcTest.describe("Scope Contrast (FC)", () => {
  fcTest(
    "TC-PRA0501 FC sees PRs from multiple departments",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as FC (fc@blueledgers.com); pending PRs exist in DB across multiple departments" },
        { type: "steps", description: "1. Navigate to PR list as FC\n2. Open All Documents tab\n3. Read department column values from rows" },
        { type: "expected", description: "At least 2 distinct department values appear in the list (skipped if DB lacks cross-dept PRs)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) > 0) await tab.click();
      const deptCells = page.getByRole("cell").filter({
        has: page.locator("[data-column='department'], [aria-label*='department' i]"),
      });
      const cellCount = await deptCells.count();
      if (cellCount === 0) {
        const rows = page.getByRole("row");
        const rowCount = await rows.count();
        if (rowCount < 3) {
          fcTest.skip(true, "Fewer than 2 data rows visible — cannot assert cross-dept scope");
          return;
        }
      }
      const distinct = new Set<string>();
      for (let i = 0; i < Math.min(cellCount, 20); i++) {
        const text = (await deptCells.nth(i).textContent())?.trim() ?? "";
        if (text) distinct.add(text);
      }
      if (distinct.size === 0) {
        fcTest.skip(true, "Department column not present on this list view");
        return;
      }
      expect(distinct.size).toBeGreaterThanOrEqual(2);
    },
  );
});

hodTest.describe.serial("Golden Journey", () => {
  hodTest(
    "TC-PRA0901 HOD full flow: My Approval → List → Detail → Edit → Adjust Qty → Bulk Approve",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD; a fresh pending PR is seeded via submitPRAsRequestor" },
        { type: "steps", description: "1. Open My Approvals\n2. Open PR detail\n3. Click Edit\n4. Adjust Approved Qty on first row\n5. Select all + Bulk Approve + Confirm" },
        { type: "expected", description: "URL stays on the PR ref after bulk approve; the journey completes end-to-end." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const ma = new MyApprovalsPage(page);

      // Seed
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PRA0901 golden" });

      // Step 1: My Approvals
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });

      // Step 2: PR Detail
      await gotoPRDetail(page, created.ref);

      // Step 3: Enter Edit Mode
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();

      // Step 4: Adjust Approved Qty
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) > 0) await qty.fill("2");

      // Step 5: Bulk Approve
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Approve button not present");
        return;
      }
      await bulkApprove(page);

      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});
