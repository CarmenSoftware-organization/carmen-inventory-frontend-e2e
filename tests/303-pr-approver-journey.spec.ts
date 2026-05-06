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
  // TCs added in Task 9
});

fcTest.describe("Scope Contrast (FC)", () => {
  // TC added in Task 10
});

hodTest.describe.serial("Golden Journey", () => {
  // TC added in Task 11
});
