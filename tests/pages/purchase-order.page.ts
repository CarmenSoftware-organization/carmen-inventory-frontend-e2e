import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/procurement/purchase-order";
export const NEW_PATH = "/procurement/purchase-order/new";

export interface POHeaderInput {
  vendor?: string;
  description?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface POLineItemInput {
  product?: string;
  quantity?: number | string;
  uom?: string;
  unitPrice?: number | string;
}

export class PurchaseOrderPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(orderNumber: string) {
    await this.page.goto(`${LIST_PATH}/${orderNumber}`);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  newPODropdown(): Locator {
    return this.page.getByRole("button", { name: /new po|create purchase order|^create$/i }).first();
  }

  // The create picker is a dialog of plain <button> cards (po-create-dialog.tsx),
  // not a dropdown menu — "Blank PO" / "From PR" / "From Price List", each of which
  // navigates to its own route (/new, /from-pr, /from-price-list).
  createFromPRMenuItem(): Locator {
    return this.page.getByRole("button", { name: /from pr|create from purchase request/i }).first();
  }

  manualPOMenuItem(): Locator {
    return this.page.getByRole("button", { name: /blank po|manual po/i }).first();
  }

  createFromPriceListButton(): Locator {
    return this.page.getByRole("button", { name: /from price list/i }).first();
  }

  poRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  // ── List filters / search / sort / tabs ──────────────────────────────
  tabMyPending(): Locator {
    return this.page.getByRole("tab", { name: /my pending|my po/i }).first();
  }

  tabAllDocuments(): Locator {
    return this.page.getByRole("tab", { name: /all documents|^all$/i }).first();
  }

  async searchFor(text: string) {
    const input = this.searchInput();
    await input.fill(text);
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  async applyFilter(opts: { status?: string }) {
    await this.filterButton().click();
    if (opts.status) {
      const trigger = this.page
        .getByRole("dialog")
        .getByLabel(/status/i)
        .first()
        .or(this.page.getByLabel(/status/i).first());
      if ((await trigger.count()) > 0) {
        await trigger.click();
        await this.page.getByRole("option", { name: new RegExp(opts.status, "i") }).first().click();
      }
    }
    const apply = this.page.getByRole("button", { name: /^apply$|^ok$/i }).first();
    if ((await apply.count()) > 0) await apply.click({ timeout: 5_000 }).catch(() => {});
  }

  async sortBy(column: string) {
    const header = this.page.getByRole("columnheader", { name: new RegExp(column, "i") }).first();
    if ((await header.count()) > 0) await header.click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Form ─────────────────────────────────────────────────────────────
  vendorTrigger(): Locator {
    return this.page.getByLabel(/vendor/i).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/^description$/i).first();
  }

  deliveryDateInput(): Locator {
    return this.page.getByLabel(/delivery date|expected.*delivery/i).first();
  }

  // override: also matches "Save PO" / "Submit"
  saveButton(): Locator {
    return this.page.getByRole("button", { name: /save po|^save$|^submit$|^create$/i }).first();
  }

  // ── Detail / actions ─────────────────────────────────────────────────
  sendToVendorButton(): Locator {
    return this.page.getByRole("button", { name: /send to vendor|^send$/i }).first();
  }

  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$/i }).first();
  }

  cancelPOButton(): Locator {
    return this.page.getByRole("button", { name: /cancel purchase order|cancel po|^void$/i }).first();
  }

  requestChangeOrderButton(): Locator {
    return this.page.getByRole("button", { name: /request change order|change order/i }).first();
  }

  generatePONumberButton(): Locator {
    return this.page.getByRole("button", { name: /generate po number/i }).first();
  }

  applyDiscountButton(): Locator {
    return this.page.getByRole("button", { name: /apply discount/i }).first();
  }

  calculateTotalsButton(): Locator {
    return this.page.getByRole("button", { name: /calculate totals/i }).first();
  }

  qrCodeSection(): Locator {
    return this.page
      .locator("[data-slot='qr-code'], [data-testid='qr-code'], section, div")
      .filter({ has: this.page.locator("img[alt*='qr' i], img[src*='qr' i]") })
      .first();
  }

  qrCodeImage(): Locator {
    return this.page.locator("img[alt*='qr' i], img[src*='qr' i]").first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  reasonInput(): Locator {
    return this.page
      .getByRole("dialog")
      .locator("textarea, input[type='text']")
      .first();
  }

  /**
   * Confirmations in this app are Radix **AlertDialog** — `role="alertdialog"`,
   * which `getByRole("dialog")` does NOT match. This resolved to nothing, and
   * since almost every call site wraps the click in `.catch(() => {})`, the step
   * silently did nothing: PO Submit left the record in Draft while reporting
   * success. Match both roles, and take `.last()` so the always-mounted Command
   * Palette (also a dialog) never wins.
   */
  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page
      .locator('[role="dialog"], [role="alertdialog"]')
      .last()
      .getByRole("button", { name })
      .first();
  }

  // ── Dashboard ────────────────────────────────────────────────────────
  summaryCards(): Locator {
    return this.page.locator("[data-slot='card'], .card, article").first();
  }

  budgetUtilizationChart(): Locator {
    return this.page
      .locator("[data-testid='budget-chart'], canvas, svg")
      .filter({ hasText: /budget|utilization/i })
      .first();
  }

  // ── Status / verification ────────────────────────────────────────────
  // override: filters to PO-specific status text
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|sent|approved|acknowledged|received|cancelled|completed|rejected/i })
      .first();
  }

  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|sent|approved|cancelled|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }

  // ── Form + Items (line items) ────────────────────────────────────────
  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item|add line item|^add$/i }).first();
  }

  /** Header combobox: the workflow gates everything else on the form. */
  workflowTrigger(): Locator {
    return this.page.getByRole("combobox").filter({ hasText: /select workflow/i }).first();
  }

  async selectFirstWorkflow() {
    const trigger = this.workflowTrigger();
    if ((await trigger.count()) === 0) return; // already chosen
    await trigger.click();
    await this.page.getByRole("option").first().click();
  }

  /** Vendor is picked from a dialog of <button> cards ("A001 <name>"), not a select. */
  async selectFirstVendor() {
    const trigger = this.page.getByRole("button", { name: /select vendor/i }).first();
    if ((await trigger.count()) === 0) return; // already chosen
    await trigger.click();
    const card = this.page.getByRole("dialog").getByRole("button").filter({ hasText: /^[A-Z]\d{3}/ }).first();
    await card.waitFor({ state: "visible", timeout: 10_000 });
    await card.click();
  }

  /**
   * Pick a delivery date. The header field is a date-picker <button> ("Select
   * date"), not a text input — the old `deliveryDateInput().fill()` silently did
   * nothing inside its .catch(), and Save then refused with "Some details are
   * missing" pointing at this field.
   */
  async selectDeliveryDate() {
    const trigger = this.page.getByRole("button", { name: /select date/i }).first();
    if ((await trigger.count()) === 0) return; // already set
    await trigger.click({ timeout: 10_000 });
    const dialog = this.page.getByRole("dialog").last();
    await dialog.waitFor({ state: "visible", timeout: 5_000 }).catch(() => {});
    // Any selectable day works; take the last enabled one so the date lands in the
    // future rather than on a past day the picker disables. `:not([disabled])` has
    // to be part of the CSS — Locator.filter({hasNot}) tests descendants, not the
    // element itself, so it never excluded the disabled days.
    const day = dialog.locator('button:not([disabled])').filter({ hasText: /^\d{1,2}$/ }).last();
    await day.waitFor({ state: "visible", timeout: 5_000 });
    await day.click({ timeout: 10_000 });
    await dialog.waitFor({ state: "hidden", timeout: 5_000 }).catch(() => {});
  }

  /**
   * Add one line item to a PO being created or edited.
   *
   * Two gates sit in front of this, and both fail silently if skipped:
   *  1. "Add Item" checks `workflow_id` first (po-item-fields.tsx:123) — with no
   *     workflow it opens a "Select a workflow first" dialog and adds no row at all.
   *  2. The row's product lookup is scoped to the chosen vendor.
   * The old implementation did neither and guessed at `getByLabel(/product/i)`
   * with every step wrapped in .catch(), so it added nothing, left Save disabled,
   * and the PO was never created — which is what made the PO journeys time out.
   */
  async addItemToPO(data: POLineItemInput) {
    await this.selectFirstWorkflow();
    await this.selectFirstVendor();
    await this.selectDeliveryDate();
    await this.addItemButton().click({ timeout: 10_000 });

    // Rows are prepended, so the row being filled is the first body row. Wait for
    // the row's own location trigger rather than for the <tr>: right after the
    // click the first body row is still the "No Items Yet" placeholder, and a
    // lookup scoped to it finds no triggers at all — which used to return quietly
    // and leave every later step on an unfilled row.
    const row = this.page.locator("tbody tr").first();
    await row
      .getByRole("button", { name: /select location/i })
      .first()
      .waitFor({ state: "visible", timeout: 10_000 });

    await this.pickFromRowTrigger(row, /select location/i);
    if (data.product !== undefined) {
      await this.pickFromRowTrigger(row, /select product/i);
    }
    if (data.quantity !== undefined) {
      await row.locator('input[name$=".order_qty"]').first().fill(String(data.quantity));
    }
    if (data.unitPrice !== undefined) {
      const price = row.locator('input[name$=".price"]').first();
      if ((await price.count()) > 0) await price.fill(String(data.unitPrice));
    }
  }

  /**
   * Click a "Select X" trigger inside a row and take the first option offered.
   *
   * Every wait here is bounded on purpose. The triggers unlock in sequence —
   * "Select Product" ships `disabled` until a location is chosen — and Playwright's
   * default `actionTimeout` is 0, so clicking a still-disabled trigger waits for it
   * to become actionable *forever* rather than failing. That is what hung the PO
   * journeys for the full test timeout with no error to point at.
   */
  private async pickFromRowTrigger(row: Locator, name: RegExp) {
    const trigger = row.getByRole("button", { name }).first();
    if ((await trigger.count()) === 0) {
      throw new Error(`addItemToPO: no "${name}" trigger in the item row — the row layout changed`);
    }
    // Wait for the cascade to unlock this step instead of blocking on the click.
    await expect(trigger).toBeEnabled({ timeout: 10_000 });
    await trigger.click({ timeout: 10_000 });
    // The picker is either a dialog of <button> cards (location, product) or a
    // plain listbox. Branch on what actually opened instead of unioning the two:
    // an .or() locator resolves against both roles and can settle on something
    // that is not the row we mean to pick.
    // .last(): the app keeps a hidden Command Palette dialog mounted, so
    // getByRole("dialog") matches more than one node and any strict-mode call on it
    // throws — which silently sent this down the listbox branch and left the row
    // unfilled. The picker that just opened is the last one in the DOM.
    const dialog = this.page.getByRole("dialog").last();
    // waitFor, not isVisible: isVisible() answers immediately, so right after the
    // click it reports false while the picker is still opening and the code falls
    // through to the listbox branch that will never match.
    const dialogOpened = await dialog
      .waitFor({ state: "visible", timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (dialogOpened) {
      const card = dialog.getByRole("button").filter({ hasText: /\S/ }).first();
      await card.waitFor({ state: "visible", timeout: 10_000 });
      await card.click({ timeout: 10_000 });
      await dialog.waitFor({ state: "hidden", timeout: 10_000 }).catch(() => {});
    } else {
      const option = this.page.getByRole("option").first();
      await option.waitFor({ state: "visible", timeout: 10_000 });
      await option.click({ timeout: 10_000 });
    }
    await this.page.waitForTimeout(300);
  }

  // ── Edit mode ────────────────────────────────────────────────────────
  editModeButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$|edit po|edit mode/i }).first();
  }

  async enterEditMode() {
    // Bounded on purpose: actionTimeout defaults to 0 in this config, so an
    // un-timed click on a button that never becomes actionable waits forever and
    // the test burns its whole budget with nothing to point at.
    await this.editModeButton().click({ timeout: 10_000 });
    await this.page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  }

  async cancelEditMode() {
    const cancel = this.page.getByRole("button", { name: /^cancel$/i }).first();
    if ((await cancel.count()) > 0) await cancel.click({ timeout: 5_000 }).catch(() => {});
  }

  // ── Submit / Delete (Edit Mode actions) ──────────────────────────────
  submitButton(): Locator {
    return this.page.getByRole("button", { name: /submit for approval|^submit$/i }).first();
  }

  // ── Detail page tabs (Item Details panel) ────────────────────────────
  tabItems(): Locator {
    return this.page.getByRole("tab", { name: /^items$/i }).first();
  }

  tabQuantity(): Locator {
    return this.page.getByRole("tab", { name: /^quantity$|^qty$/i }).first();
  }

  tabPricing(): Locator {
    return this.page.getByRole("tab", { name: /^pricing$|^price$/i }).first();
  }

  // ── Create PO wizards (Step 2) ───────────────────────────────────────
  // Same dialog as createFromPRMenuItem above: <button> cards, not menu items.
  fromPriceListMenuItem(): Locator {
    return this.page.getByRole("button", { name: /from price list|price list/i }).first();
  }

  fromPRMenuItem(): Locator {
    return this.page.getByRole("button", { name: /from pr|from purchase request|create from purchase request/i }).first();
  }

  priceListWizardSubmit(): Locator {
    return this.page.getByRole("button", { name: /create po|finish|done|^create$|^submit$/i }).last();
  }

  fromPRWizardSubmit(): Locator {
    return this.page.getByRole("button", { name: /create po|finish|done|^create$|^submit$/i }).last();
  }

  // ── Close PO (Step 5 post-approval) ──────────────────────────────────
  closePOButton(): Locator {
    return this.page.getByRole("button", { name: /^close$|close po|mark as complete/i }).first();
  }

  // ── FC Approval Actions (Edit Mode item-level + document-level) ──────
  // The FC PO approval flow uses item-level marking (Approve/Review/Reject)
  // that surfaces an action toolbar, plus document-level footer buttons
  // (Approve PO / Send Back / Reject) whose visibility depends on the
  // item-state mix. Distinct from PR's bulk-toolbar pattern.

  selectItemRow(index: number): Locator {
    // Skip header row (nth(0)); data rows start at nth(1)
    return this.page.getByRole("row").nth(index + 1).getByRole("checkbox").first();
  }

  async selectItemInEditMode(index: number) {
    const cb = this.selectItemRow(index);
    if ((await cb.count()) > 0) await cb.check({ force: true });
  }

  itemActionToolbar(): Locator {
    return this.page
      .locator("[data-slot='toolbar'], [role='toolbar']")
      .filter({ has: this.page.getByRole("button", { name: /approve|review|reject/i }) })
      .first();
  }

  markItemApproveButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^approve$/i }).first();
  }

  markItemReviewButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^review$/i }).first();
  }

  markItemRejectButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^reject$/i }).first();
  }

  itemBadge(index: number, status?: string): Locator {
    const row = this.page.getByRole("row").nth(index + 1);
    const re = status ? new RegExp(status, "i") : /approved|review|rejected/i;
    return row.locator("[data-slot='badge'], [class*='badge']").filter({ hasText: re }).first();
  }

  // Document-level footer buttons — scoped to footer / dialog area to avoid
  // collision with item-level Approve/Reject buttons.
  documentApproveButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /approve po|approve.*purchase order|^approve$/i })
      .first()
      // .first() on the union too: `a.first().or(b.last())` still resolves to both
      // sides when each matches something, which trips strict mode on click/assert.
      .or(this.page.getByRole("button", { name: /approve po|approve.*purchase order/i }).last())
      .first();
  }

  documentSendBackButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /send back|return for|^send$/i })
      .first()
      .or(this.page.getByRole("button", { name: /send back|return for/i }).last());
  }

  documentRejectButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /reject po|^reject$/i })
      .first()
      .or(this.page.getByRole("button", { name: /reject po/i }).last());
  }

  commentButton(): Locator {
    return this.page.getByRole("button", { name: /^comment$|add comment/i }).first();
  }
}
