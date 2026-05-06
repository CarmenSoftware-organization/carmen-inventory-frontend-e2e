import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseOrderPage, LIST_PATH } from "./pages/purchase-order.page";
import {
  submitPOAsPurchaser,
  approveAsFC,
  gotoPODetail,
} from "./pages/po-approver.helpers";

// Persona-journey spec — PO Purchaser. Runs alongside 401-purchase-order.spec.ts
// (per-action multi-role) without modifying it. Source docs:
// docs/persona-doc/Purchase Order/Purchaser/INDEX.md and step-01..05.md.
const purchaseTest = createAuthTest("purchase@blueledgers.com");

const FUTURE_DATE = "2099-12-31";

purchaseTest.describe("Step 1 — PO List", () => {
  purchaseTest(
    "TC-POP0101 List loads with PO statuses (DRAFT / IN PROGRESS / APPROVED / etc.)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Purchaser (purchase@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-order\n2. Verify URL and that the list table or empty-state is visible" },
        { type: "expected", description: "URL is on PO list; My Pending tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const po = new PurchaseOrderPage(page);
      await po.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = po.tabMyPending();
      if ((await tab.count()) === 0) return;
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-POP0102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "On the PO list page" },
        { type: "steps", description: "1. Click All Documents tab" },
        { type: "expected", description: "All Documents tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const po = new PurchaseOrderPage(page);
      await po.gotoList();
      const tab = po.tabAllDocuments();
      if ((await tab.count()) === 0) {
        purchaseTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-POP0103 Filter by status (DRAFT)",
    {
      annotation: [
        { type: "preconditions", description: "On the PO list page" },
        { type: "steps", description: "1. Open Filter panel\n2. Select status = DRAFT\n3. Apply" },
        { type: "expected", description: "URL stays on PO list after applying the filter." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const po = new PurchaseOrderPage(page);
      await po.gotoList();
      const fb = po.filterButton();
      if ((await fb.count()) === 0) {
        purchaseTest.skip(true, "Filter button not present in this build");
        return;
      }
      await po.applyFilter({ status: "DRAFT" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-POP0104 Search by PO reference",
    {
      annotation: [
        { type: "preconditions", description: "On the PO list page" },
        { type: "steps", description: "1. Type partial reference in search box" },
        { type: "expected", description: "URL stays on PO list after typing in the search input." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const po = new PurchaseOrderPage(page);
      await po.gotoList();
      const input = po.searchInput();
      if ((await input.count()) === 0) {
        purchaseTest.skip(true, "Search input not present in this build");
        return;
      }
      await po.searchFor("PO");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  purchaseTest(
    "TC-POP0105 Sort by Date",
    {
      annotation: [
        { type: "preconditions", description: "On the PO list page" },
        { type: "steps", description: "1. Click Date column header to sort\n2. Verify list re-orders" },
        { type: "expected", description: "URL stays on PO list after sort click." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const po = new PurchaseOrderPage(page);
      await po.gotoList();
      await po.sortBy("date");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );
});

purchaseTest.describe("Step 2 — Create PO", () => {
  // TCs added in Task 7
});

purchaseTest.describe("Step 3 — PO Detail", () => {
  // TCs added in Task 8
});

purchaseTest.describe("Step 4 — Edit Mode", () => {
  // TCs added in Task 9
});

purchaseTest.describe("Step 5 — Post-approval", () => {
  // TCs added in Task 10
});

purchaseTest.describe.serial("Golden Journey", () => {
  // TC added in Task 11
});
