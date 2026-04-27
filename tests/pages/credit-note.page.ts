import type { Page, Locator } from "@playwright/test";

export const LIST_PATH = "/procurement/credit-note";
export const NEW_PATH = "/procurement/credit-note/new";

export class CreditNotePage {
  constructor(private page: Page) {}

  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(id: string) {
    await this.page.goto(`${LIST_PATH}/${id}`);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  newCreditNoteButton(): Locator {
    return this.page.getByRole("button", { name: /new credit note|^new$|^create$/i }).first();
  }

  filterButton(): Locator {
    return this.page.getByRole("button", { name: /^filter$/i }).first();
  }

  applyFilterButton(): Locator {
    return this.page.getByRole("button", { name: /apply filter/i }).first();
  }

  statusFilter(): Locator {
    return this.page.getByLabel(/status/i).first();
  }

  vendorFilter(): Locator {
    return this.page.getByLabel(/vendor/i).first();
  }

  cnRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no.*credit note|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Form ─────────────────────────────────────────────────────────────
  vendorTrigger(): Locator {
    return this.page.getByLabel(/vendor|supplier/i).first();
  }

  grnReferenceTrigger(): Locator {
    return this.page.getByLabel(/grn reference|grn|goods receive/i).first();
  }

  amountInput(): Locator {
    return this.page.getByLabel(/amount|total amount|credit amount/i).first();
  }

  reasonInput(): Locator {
    return this.page.getByLabel(/reason/i).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/description/i).first();
  }

  cnDateInput(): Locator {
    return this.page.getByLabel(/credit note date|cn date/i).first();
  }

  invoiceNumberInput(): Locator {
    return this.page.getByLabel(/invoice number/i).first();
  }

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^save$|^submit$|^create$/i }).first();
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$/i }).first();
  }

  // ── Items ────────────────────────────────────────────────────────────
  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item|add line item/i }).first();
  }

  removeItemButton(): Locator {
    return this.page.getByRole("button", { name: /remove item|^remove$/i }).first();
  }

  itemSelectTrigger(): Locator {
    return this.page.getByLabel(/^item$|product/i).first();
  }

  lotSelectTrigger(): Locator {
    return this.page.getByLabel(/lot/i).first();
  }

  returnQuantityInput(): Locator {
    return this.page.getByLabel(/return quantity|^quantity$/i).first();
  }

  // ── Status actions ───────────────────────────────────────────────────
  commitButton(): Locator {
    return this.page.getByRole("button", { name: /^commit$/i }).first();
  }

  voidButton(): Locator {
    return this.page.getByRole("button", { name: /^void$/i }).first();
  }

  // ── Comments / Attachments ───────────────────────────────────────────
  addCommentButton(): Locator {
    return this.page.getByRole("button", { name: /add comment/i }).first();
  }

  uploadDocumentButton(): Locator {
    return this.page.getByRole("button", { name: /upload document|add attachment/i }).first();
  }

  commentInput(): Locator {
    return this.page.getByLabel(/comment/i).first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|commit|void|delete|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Status / verification ────────────────────────────────────────────
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|committed|void|open|closed|posted/i })
      .first();
  }

  toast(): Locator {
    return this.page
      .locator('[data-sonner-toast], [role="status"], [role="alert"]')
      .first();
  }

  anyError(): Locator {
    return this.page.locator(
      '[aria-invalid="true"], p.text-destructive, [role="alert"][data-slot="field-error"]',
    );
  }
}
