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

  createFromPRMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /create from purchase request/i }).first();
  }

  manualPOMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /manual po|blank po/i }).first();
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

  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
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

  async addItemToPO(data: POLineItemInput) {
    await this.addItemButton().click({ timeout: 5_000 }).catch(() => {});
    if (data.product !== undefined) {
      const productInput = this.page.getByLabel(/product|item/i).first();
      if ((await productInput.count()) > 0) await productInput.fill(data.product);
      const option = this.page.getByRole("option").filter({ hasText: data.product }).first();
      if ((await option.count()) > 0) await option.click({ timeout: 5_000 }).catch(() => {});
    }
    if (data.quantity !== undefined) {
      const q = this.page.getByLabel(/^quantity$|^qty$/i).first();
      if ((await q.count()) > 0) await q.fill(String(data.quantity));
    }
    if (data.uom !== undefined) {
      const u = this.page.getByLabel(/uom|unit of measure/i).first();
      if ((await u.count()) > 0) await u.fill(data.uom);
    }
    if (data.unitPrice !== undefined) {
      const p = this.page.getByLabel(/unit price/i).first();
      if ((await p.count()) > 0) await p.fill(String(data.unitPrice));
    }
    const saveItem = this.page.getByRole("button", { name: /^save$|^add$|confirm/i }).last();
    if ((await saveItem.count()) > 0) await saveItem.click({ timeout: 5_000 }).catch(() => {});
  }

  // ── Edit mode ────────────────────────────────────────────────────────
  editModeButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$|edit po|edit mode/i }).first();
  }

  async enterEditMode() {
    await this.editModeButton().click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
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
  fromPriceListMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /from price list|price list/i }).first();
  }

  fromPRMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /from pr|from purchase request|create from purchase request/i }).first();
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
      .or(this.page.getByRole("button", { name: /approve po|approve.*purchase order/i }).last());
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
