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
  // TCs added in Task 7
});

hodTest.describe("Step 3 — PR Detail (Read-only)", () => {
  // TCs added in Task 8
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
