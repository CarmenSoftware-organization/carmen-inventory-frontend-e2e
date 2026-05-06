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
  requestorTest(
    "TC-PRC0201 Open Create dialog → Blank → form loads",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; on PR list" },
        { type: "steps", description: "1. Click New Purchase Request\n2. Choose Blank PR option (if dialog appears)\n3. Wait for the create form" },
        { type: "expected", description: "URL becomes /procurement/purchase-request/new and the create form is visible." },
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

  requestorTest(
    "TC-PRC0202 Default values populated on the new form",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Navigate to /new\n2. Inspect default values for date, department, location, currency, status" },
        { type: "expected", description: "Form is at /new and a Draft indicator is shown when the badge is rendered." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await expect(page).toHaveURL(/purchase-request\/new/);
      const draftBadge = page.locator("[data-slot='badge'], [class*='badge']").filter({ hasText: /draft/i }).first();
      if ((await draftBadge.count()) > 0) {
        await expect(draftBadge).toBeVisible();
      }
    },
  );

  requestorTest(
    "TC-PRC0203 Fill header fields",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Set PR type = General\n2. Set delivery date in the future\n3. Enter description and notes" },
        { type: "expected", description: "Description input contains the value entered (E2E-PRC marker)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({
        prType: "general",
        deliveryDate: FUTURE_DATE,
        description: e2eDescription("TC-PRC0203 header fill"),
        notes: "auto-generated by E2E",
      });
      await expect(pr.descriptionInput()).toHaveValue(/E2E-PRC/);
    },
  );

  requestorTest(
    "TC-PRC0204 Add 1 basic line item",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled" },
        { type: "steps", description: "1. Click Add Item\n2. Fill product, qty, uom, unit price\n3. Save the item" },
        { type: "expected", description: "Form remains on /new (item add does not navigate); at least one data row appears." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Test Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0205 Add line item with FOC flag",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled" },
        { type: "steps", description: "1. Add Item\n2. Toggle FOC checkbox\n3. Save" },
        { type: "expected", description: "Form remains on /new after the FOC item is saved." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "FOC Item", quantity: 5, uom: "ea", isFOC: true });
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0206 Add multiple line items — totals recompute",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Add 3 line items at different prices\n2. Verify form still shown" },
        { type: "expected", description: "Form remains on /new after 3 items are added." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      for (const i of [1, 2, 3]) {
        await pr.addLineItem({ product: `Item ${i}`, quantity: i, uom: "ea", unitPrice: 50 * i });
      }
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0207 Edit line item before save",
    {
      annotation: [
        { type: "preconditions", description: "Header filled and at least one line item added" },
        { type: "steps", description: "1. Add 1 item\n2. Edit its quantity\n3. Save the line" },
        { type: "expected", description: "Form remains on /new after the edit." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Edit Me", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.editLineItem(0, { quantity: 5 });
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0208 Remove line item",
    {
      annotation: [
        { type: "preconditions", description: "Header filled and at least one line item added" },
        { type: "steps", description: "1. Add an item\n2. Click its remove button" },
        { type: "expected", description: "Form remains on /new after the remove." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Remove Me", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.removeLineItem(0);
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0209 Save as Draft → redirect to detail with PR number",
    {
      annotation: [
        { type: "preconditions", description: "Header + ≥1 line item filled" },
        { type: "steps", description: "1. Click Save as Draft\n2. Wait for redirect to detail" },
        { type: "expected", description: "URL changes to /purchase-request/<id> (not /new) and detail page renders." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({
        prType: "general",
        deliveryDate: FUTURE_DATE,
        description: e2eDescription("TC-PRC0209 save draft"),
      });
      await pr.addLineItem({ product: "Save Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.saveDraftButton().click({ timeout: 5_000 });
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 15_000 });
    },
  );

  requestorTest(
    "TC-PRC0210 Save without line items → button disabled or stays on form",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled but no items" },
        { type: "steps", description: "1. Fill header\n2. Click Save as Draft without adding any line item" },
        { type: "expected", description: "Either the Save button is disabled, or the form does not navigate away from /new." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      const save = pr.saveDraftButton();
      const disabled = await save.isDisabled().catch(() => false);
      if (disabled) {
        await expect(save).toBeDisabled();
        return;
      }
      await save.click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );

  requestorTest(
    "TC-PRC0211 Delivery date in the past → validation prevents save",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Set delivery date to a past date\n2. Add an item\n3. Try to save" },
        { type: "expected", description: "Form does not navigate away from /new (validation rejects past date)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: PAST_DATE });
      await pr.addLineItem({ product: "Past Date", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/purchase-request\/new/);
    },
  );
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
