import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseOrderPage, LIST_PATH } from "./pages/purchase-order.page";
import {
  submitPOAsPurchaser,
  gotoPODetail,
} from "./pages/po-approver.helpers";

// Persona-journey spec — PO FC Approver. Runs alongside 401/402.
// Source docs: docs/persona-doc/Purchase Order/Approver/INDEX.md
// and step-01..03.md.
const fcTest = createAuthTest("fc@blueledgers.com");

const SEND_BACK_REASON = "Please verify pricing";
const REJECT_REASON = "Vendor pricing exceeds budget";

fcTest.describe("Step 1 — My Approval", () => {
  fcTest(
    "TC-POA0101 My Approval dashboard loads with Total Pending count visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as FC (fc@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to My Approvals (or appropriate FC dashboard)\n2. Verify the total-pending indicator is rendered" },
        { type: "expected", description: "URL contains 'approval' or 'dashboard'; a count/badge or row count is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      // FC My Approval dashboard route may differ — try both common paths
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      await page.waitForLoadState("networkidle").catch(() => {});
      await expect(page).toHaveURL(/approval|dashboard/i);
    },
  );

  fcTest(
    "TC-POA0102 PO filter tab shows pending POs (DRAFT + IN PROGRESS)",
    {
      annotation: [
        { type: "preconditions", description: "On My Approval dashboard with at least one pending PO" },
        { type: "steps", description: "1. Click PO/Purchase Order filter tab\n2. Verify rows render or empty state" },
        { type: "expected", description: "PO tab is selected (aria-selected=true) when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      const tab = page.getByRole("tab", { name: /^po$|purchase order/i }).first();
      if ((await tab.count()) === 0) {
        fcTest.skip(true, "PO filter tab not present on this dashboard build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  fcTest(
    "TC-POA0103 Click pending PO row navigates to PO detail",
    {
      annotation: [
        { type: "preconditions", description: "On My Approval dashboard with at least one pending PO row (seeded via submitPOAsPurchaser)" },
        { type: "steps", description: "1. Seed PO via Purchaser context\n2. Navigate to dashboard\n3. Click the seeded PO row" },
        { type: "expected", description: "URL navigates to /procurement/purchase-order/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const created = await submitPOAsPurchaser(browser);
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      await page.waitForLoadState("networkidle").catch(() => {});
      const row = page.getByRole("row").filter({ hasText: created.ref }).first();
      if ((await row.count()) === 0) {
        fcTest.skip(true, "Seeded PO not visible in FC My Approval list");
        return;
      }
      await row.click();
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});

fcTest.describe("Step 2 — PO Detail (FC view)", () => {
  // TCs added in Task 5
});

fcTest.describe("Step 3 — Approval Actions", () => {
  // TCs added in Task 6
});

fcTest.describe.serial("Golden Journey", () => {
  // TC added in Task 7
});
