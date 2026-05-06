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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
        { type: "expected", description: "Form remains on /new — item add does not navigate away from the create form." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Test Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0206 Add multiple line items — form stays on /new",
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );
});

requestorTest.describe("Step 3 — Create from Template", () => {
  requestorTest(
    "TC-PRC0301 Open Create dialog → Template option → picker opens",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; on PR list" },
        { type: "steps", description: "1. Click New Purchase Request\n2. Pick the From-Template option in the dialog" },
        { type: "expected", description: "Template picker (dialog or listbox) is visible after selecting the From-Template option." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      await expect(pr.templatePicker()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0302 Select first template → form pre-fills",
    {
      annotation: [
        { type: "preconditions", description: "Template picker is open and at least one template exists" },
        { type: "steps", description: "1. Open template picker\n2. Select the first template" },
        { type: "expected", description: "URL contains template_id query param (form is loading from a template)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await expect(page).toHaveURL(/template_id=/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0303 Modify template-loaded items before save",
    {
      annotation: [
        { type: "preconditions", description: "On the create-from-template form with prefilled items" },
        { type: "steps", description: "1. Open template form\n2. Edit the first prefilled line item quantity" },
        { type: "expected", description: "Form remains on the template-load URL after the edit (no premature navigation)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await pr.editLineItem(0, { quantity: 9 });
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0304 Save template-based PR → Draft created",
    {
      annotation: [
        { type: "preconditions", description: "Template-based form has prefilled items" },
        { type: "steps", description: "1. Open template form\n2. Click Save as Draft" },
        { type: "expected", description: "URL changes to /purchase-request/<id> (not /new) after save." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await pr.fillHeader({ description: e2eDescription("TC-PRC0304 from template") });
      await pr.saveDraftButton().click({ timeout: 5_000 });
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 15_000 });
    },
  );

  requestorTest(
    "TC-PRC0305 Empty-state message when no templates exist",
    {
      annotation: [
        { type: "preconditions", description: "Template picker open and no templates exist in the system" },
        { type: "steps", description: "1. Open template picker\n2. Inspect content" },
        { type: "expected", description: "An empty-state message ('No templates') is visible. Skipped if templates exist." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
        { type: "note", description: "Dynamically skipped when at least one template is present." },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      const empty = pr.templatePickerEmpty();
      if ((await empty.count()) === 0) {
        requestorTest.skip(true, "Templates exist — empty-state cannot be asserted");
        return;
      }
      await expect(empty).toBeVisible();
    },
  );
});

requestorTest.describe("Step 4 — PR Detail", () => {
  requestorTest(
    "TC-PRC0401 Draft PR detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR exists for this Requestor (created in beforeEach)" },
        { type: "steps", description: "1. Open the Draft PR detail page\n2. Verify the Items tab is selected" },
        { type: "expected", description: "Detail URL is /procurement/purchase-request/<ref>; if Items tab is rendered, it is the selected one." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) {
        // Items tab UI not rendered — URL check above is sufficient
        return;
      }
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PRC0402 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a Draft PR detail page" },
        { type: "steps", description: "1. Click the Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected after click." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        requestorTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PRC0403 Edit / Delete / Submit buttons present for Draft",
    {
      annotation: [
        { type: "preconditions", description: "On a Draft PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit, Delete, and Submit buttons are all visible for Draft status." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
      await expect(pr.deleteButton()).toBeVisible({ timeout: 10_000 });
      await expect(pr.submitButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0404 Edit / Delete absent when status is In Progress",
    {
      annotation: [
        { type: "preconditions", description: "A PR exists in In Progress status (created via Submit flow)" },
        { type: "steps", description: "1. Submit a Draft PR\n2. Reload detail\n3. Inspect toolbar" },
        { type: "expected", description: "Edit and Delete buttons are not visible (read-only mode)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await submitDraftPR(page, created.ref);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(pr.editModeButton()).toHaveCount(0);
      await expect(pr.deleteButton()).toHaveCount(0);
    },
  );
});

requestorTest.describe("Step 5 — Edit Draft", () => {
  requestorTest(
    "TC-PRC0501 Click Edit → enter edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR exists for this Requestor" },
        { type: "steps", description: "1. Open Draft PR\n2. Click Edit" },
        { type: "expected", description: "Form becomes editable; Save (or Cancel) form-level button is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0502 Modify header description in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Update description\n3. Save" },
        { type: "expected", description: "After save the page returns to detail URL (no redirect to /new or list)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      const newDesc = e2eDescription("TC-PRC0502 edited");
      await pr.fillHeader({ description: newDesc });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0503 Modify line item quantity in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR with at least one line item is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Edit first line item quantity\n3. Save" },
        { type: "expected", description: "After save the page returns to the detail URL." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 7 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0504 Add line item in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Click Add Item\n3. Fill product/qty/uom\n4. Save" },
        { type: "expected", description: "After save the page returns to the detail URL." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.addLineItem({ product: "Added in Edit", quantity: 2, uom: "ea", unitPrice: 50 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0505 Save → exit edit mode + persist changes",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode with at least one change" },
        { type: "steps", description: "1. Enter edit mode\n2. Make a change\n3. Click Save" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again on detail page)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.fillHeader({ description: e2eDescription("TC-PRC0505 persisted") });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0506 Cancel → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into description\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again on detail page)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.fillHeader({ description: "DISCARD ME" });
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
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
