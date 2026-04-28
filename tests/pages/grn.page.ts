import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/procurement/goods-receive-note";
export const NEW_PATH = "/procurement/goods-receive-note/new";

export interface GRNHeaderInput {
  vendor?: string;
  invoiceNumber?: string;
  receivedDate?: string;
  currency?: string;
  notes?: string;
}

export interface GRNLineItemInput {
  product?: string;
  quantity?: number | string;
  unit?: string;
  unitPrice?: number | string;
  storageLocation?: string;
}

export class GRNPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────
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
  newGRNButton(): Locator {
    return this.page.getByRole("button", { name: /new grn|create.*grn|create.*new|^new$|^create$/i }).first();
  }

  clearFiltersButton(): Locator {
    return this.page.getByRole("button", { name: /clear filters/i }).first();
  }

  grnNumberFilter(): Locator {
    return this.page.getByLabel(/grn number/i).first();
  }

  vendorFilter(): Locator {
    return this.page.getByLabel(/vendor name/i).first();
  }

  invoiceFilter(): Locator {
    return this.page.getByLabel(/invoice number/i).first();
  }

  grnRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  // override: also matches "no GRN" empty text
  emptyState(): Locator {
    return this.page.getByText(/no.*grn|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Create flow ──────────────────────────────────────────────────────
  createFromPRMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /from purchase request|from po|from pr/i }).first();
  }

  manualGRNMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /manual|blank/i }).first();
  }

  vendorTrigger(): Locator {
    return this.page.getByLabel(/vendor/i).first();
  }

  invoiceNumberInput(): Locator {
    return this.page.getByLabel(/invoice number/i).first();
  }

  receivedDateInput(): Locator {
    return this.page.getByLabel(/received date/i).first();
  }

  currencyTrigger(): Locator {
    return this.page.getByLabel(/currency/i).first();
  }

  // override: also matches "Submit" button
  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^save$|^submit$|^create$/i }).first();
  }

  // ── Items tab ────────────────────────────────────────────────────────
  itemsTab(): Locator {
    return this.page.getByRole("tab", { name: /^items$/i }).first();
  }

  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item/i }).first();
  }

  productInput(): Locator {
    return this.page.getByLabel(/product/i).first();
  }

  quantityInput(): Locator {
    return this.page.getByLabel(/^quantity$|^qty$/i).first();
  }

  unitPriceInput(): Locator {
    return this.page.getByLabel(/unit price|^price$/i).first();
  }

  itemRow(index: number): Locator {
    return this.page.getByRole("row").nth(index + 1);
  }

  deleteItemButton(): Locator {
    return this.page.getByRole("button", { name: /^delete$|trash|remove/i }).first();
  }

  // ── Extra costs ──────────────────────────────────────────────────────
  addExtraCostsButton(): Locator {
    return this.page.getByRole("button", { name: /add extra costs?/i }).first();
  }

  // ── Tabs ─────────────────────────────────────────────────────────────
  financialSummaryTab(): Locator {
    return this.page.getByRole("tab", { name: /financial summary/i }).first();
  }

  stockMovementsTab(): Locator {
    return this.page.getByRole("tab", { name: /stock movements?/i }).first();
  }

  commentsTab(): Locator {
    return this.page.getByRole("tab", { name: /comments|attachments/i }).first();
  }

  activityLogTab(): Locator {
    return this.page.getByRole("tab", { name: /activity log/i }).first();
  }

  // ── Comments / Attachments ───────────────────────────────────────────
  commentInput(): Locator {
    return this.page.getByLabel(/comment/i).first();
  }

  addCommentButton(): Locator {
    return this.page.getByRole("button", { name: /add comment|post comment/i }).first();
  }

  uploadAttachmentsButton(): Locator {
    return this.page.getByRole("button", { name: /upload attachments?/i }).first();
  }

  // ── Status actions ───────────────────────────────────────────────────
  commitButton(): Locator {
    return this.page.getByRole("button", { name: /commit grn|^commit$/i }).first();
  }

  voidButton(): Locator {
    return this.page.getByRole("button", { name: /^void$/i }).first();
  }

  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$/i }).first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|delete|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
  // override: filters to GRN-specific status text
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|received|committed|void|approved/i })
      .first();
  }

  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|committed|voided|deleted|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
