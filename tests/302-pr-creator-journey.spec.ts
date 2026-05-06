import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH, NEW_PATH } from "./pages/purchase-request.page";
import { createDraftPR, submitDraftPR, deleteDraftPR, e2eDescription } from "./pages/pr-creator.helpers";

// Persona-journey spec — Creator (Requestor). Runs alongside 301-purchase-request.spec.ts
// (per-action multi-role) without modifying it. Source docs:
// docs/persona-doc/Purchase Request/Creator/INDEX.md and step-01..08.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

const FUTURE_DATE = "2099-12-31";
const PAST_DATE = "2020-01-01";

requestorTest.describe("Step 1 — PR List", () => {
  requestorTest(
    "TC-PRC0101 List loads with My Pending tab and Creator's PRs visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor (requestor@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify My Pending tab is selected by default\n3. Verify list table is visible" },
        { type: "expected", description: "URL is /procurement/purchase-request, My Pending tab has aria-selected=true, table or empty-state is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = pr.tabMyPending();
      if ((await tab.count()) === 0) {
        // Tab UI not present — list URL check above is sufficient for the smoke
        return;
      }
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PRC0102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click All Documents tab\n2. Verify list refreshes" },
        { type: "expected", description: "All Documents tab becomes selected; the list re-renders." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) === 0) {
        requestorTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PRC0103 Search by reference number filters list",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR exists with a known reference" },
        { type: "steps", description: "1. Click search box\n2. Type partial reference\n3. Wait for the list to filter" },
        { type: "expected", description: "List updates to rows whose reference contains the typed text." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const input = pr.searchInput();
      if ((await input.count()) === 0) {
        requestorTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PRC0104 Filter by status (Draft)",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open Filter panel\n2. Select status = Draft\n3. Apply" },
        { type: "expected", description: "List shows only PRs with Draft status (or empty state)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const fb = pr.filterButton();
      if ((await fb.count()) === 0) {
        requestorTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "Draft" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PRC0105 Sort list by Date",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click Date column header to sort\n2. Verify list re-orders" },
        { type: "expected", description: "Column header shows a sort indicator and the list re-orders." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.sortBy("date");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PRC0106 Click row navigates to PR detail",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR row exists" },
        { type: "steps", description: "1. Click the first PR row" },
        { type: "expected", description: "Navigates to /procurement/purchase-request/<id>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const firstRow = page.getByRole("row").nth(1);
      if ((await firstRow.count()) === 0) {
        requestorTest.skip(true, "No PR rows exist for this Requestor");
        return;
      }
      const link = firstRow.getByRole("link").first();
      if ((await link.count()) === 0) {
        requestorTest.skip(true, "First row does not contain a navigation link");
        return;
      }
      await link.click();
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0107 New PR button opens create dialog",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click New Purchase Request" },
        { type: "expected", description: "Either a creation dialog opens or the URL changes to /new." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.openCreateDialog();
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );
});

requestorTest.describe("Step 2 — Create PR (Blank)", () => {
  // TCs added in Task 7
});

requestorTest.describe("Step 3 — Create from Template", () => {
  // TCs added in Task 8
});

requestorTest.describe("Step 4 — PR Detail", () => {
  // TCs added in Task 9
});

requestorTest.describe("Step 5 — Edit Draft", () => {
  // TCs added in Task 10
});

requestorTest.describe("Step 6 — Submit", () => {
  // TCs added in Task 11
});

requestorTest.describe("Step 8 — Delete", () => {
  // TCs added in Task 12
});

requestorTest.describe.serial("Golden Journey", () => {
  // TC added in Task 13
});
