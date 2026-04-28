import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/vendor-management/price-list";
export const NEW_PATH = "/vendor-management/price-list/new";

export interface PriceListHeaderInput {
  number?: string;
  vendor?: string;
  currency?: string;
  validFrom?: string;
  validTo?: string;
  notes?: string;
}

export interface PriceListItemInput {
  product?: string;
  moq?: number | string;
  unit?: string;
  unitPrice?: number | string;
  leadTime?: number | string;
  notes?: string;
}

export class PriceListPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(id: string) {
    await this.page.goto(`${LIST_PATH}/${id}`);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  addNewButton(): Locator {
    return this.page.getByRole("button", { name: /add new|new price.?list|^new$|^create$/i }).first();
  }

  searchButton(): Locator {
    return this.page.getByRole("button", { name: /^search$/i }).first();
  }

  statusFilter(): Locator {
    return this.page.getByRole("combobox", { name: /status/i }).first();
  }

  statusOption(name: RegExp | string): Locator {
    return this.page.getByRole("option", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  priceListRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  rowActionsTrigger(text: string): Locator {
    return this.priceListRow(text).getByRole("button", { name: /actions|more|menu/i }).first();
  }

  actionMenuItem(name: RegExp | string): Locator {
    return this.page.getByRole("menuitem", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  // override: matches "no … found" instead of base's "no … results"
  emptyState(): Locator {
    return this.page.getByText(/no.*found|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Form ─────────────────────────────────────────────────────────────
  numberInput(): Locator {
    return this.page.getByLabel(/price list number|number/i).first();
  }

  vendorTrigger(): Locator {
    return this.page.getByLabel(/vendor/i).first();
  }

  currencyTrigger(): Locator {
    return this.page.getByLabel(/currency/i).first();
  }

  validFromInput(): Locator {
    return this.page.getByLabel(/valid from/i).first();
  }

  validToInput(): Locator {
    return this.page.getByLabel(/valid to/i).first();
  }

  notesInput(): Locator {
    return this.page.getByLabel(/^notes$/i).first();
  }

  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item/i }).first();
  }

  productInput(): Locator {
    return this.page.getByLabel(/product/i).first();
  }

  moqInput(): Locator {
    return this.page.getByLabel(/moq|minimum order/i).first();
  }

  unitInput(): Locator {
    return this.page.getByLabel(/^unit$/i).first();
  }

  unitPriceInput(): Locator {
    return this.page.getByLabel(/unit price/i).first();
  }

  leadTimeInput(): Locator {
    return this.page.getByLabel(/lead time/i).first();
  }

  // override: also matches Submit button in some flows
  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^save$|^create$|^submit$/i }).first();
  }

  exportButton(): Locator {
    return this.page.getByRole("button", { name: /^export$/i }).first();
  }

  duplicateButton(): Locator {
    return this.page.getByRole("button", { name: /^duplicate$/i }).first();
  }

  markExpiredButton(): Locator {
    return this.page.getByRole("button", { name: /mark.*expired/i }).first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|delete|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  cancelDialogButton(): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name: /^cancel$/i }).first();
  }

  // ── Form fill helpers ────────────────────────────────────────────────
  async fillHeader(data: PriceListHeaderInput) {
    if (data.number !== undefined) {
      const i = this.numberInput();
      if ((await i.count()) > 0) await i.fill(data.number);
    }
    if (data.validFrom !== undefined) {
      const i = this.validFromInput();
      if ((await i.count()) > 0) await i.fill(data.validFrom);
    }
    if (data.validTo !== undefined) {
      const i = this.validToInput();
      if ((await i.count()) > 0) await i.fill(data.validTo);
    }
    if (data.notes !== undefined) {
      const i = this.notesInput();
      if ((await i.count()) > 0) await i.fill(data.notes);
    }
  }

  async addLineItem(data: PriceListItemInput) {
    await this.addItemButton().click({ timeout: 5_000 }).catch(() => {});
    if (data.product !== undefined) {
      const i = this.productInput();
      if ((await i.count()) > 0) await i.fill(data.product);
    }
    if (data.moq !== undefined) {
      const i = this.moqInput();
      if ((await i.count()) > 0) await i.fill(String(data.moq));
    }
    if (data.unitPrice !== undefined) {
      const i = this.unitPriceInput();
      if ((await i.count()) > 0) await i.fill(String(data.unitPrice));
    }
    if (data.leadTime !== undefined) {
      const i = this.leadTimeInput();
      if ((await i.count()) > 0) await i.fill(String(data.leadTime));
    }
  }

  // ── Verification ─────────────────────────────────────────────────────
  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|deleted|expired|exported|duplicated|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
