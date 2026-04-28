import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/procurement/purchase-request-template";
export const NEW_PATH = "/procurement/purchase-request-template/new";

export class PRTemplatePage extends BasePage {
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
  newTemplateButton(): Locator {
    return this.page.getByRole("button", { name: /new template|new purchase request|^new$|^create$/i }).first();
  }

  // override: this module's apply button reads only "Apply"
  applyFilterButton(): Locator {
    return this.page.getByRole("button", { name: /^apply$/i }).first();
  }

  templateCard(text: string): Locator {
    return this.page.locator("[data-slot='card'], article, .card").filter({ hasText: text }).first();
  }

  templateRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  // override: also matches "no template" empty text
  emptyState(): Locator {
    return this.page.getByText(/no.*template|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Form ─────────────────────────────────────────────────────────────
  itemSpecInput(): Locator {
    return this.page.getByLabel(/item specifications|item name/i).first();
  }

  quantityInput(): Locator {
    return this.page.getByLabel(/^quantity$|^qty$/i).first();
  }

  priceInput(): Locator {
    return this.page.getByLabel(/^price$|unit price/i).first();
  }

  budgetCodeTrigger(): Locator {
    return this.page.getByLabel(/budget code/i).first();
  }

  accountTrigger(): Locator {
    return this.page.getByLabel(/^account$|account code/i).first();
  }

  // override: also matches "Save Template" / "Submit"
  saveButton(): Locator {
    return this.page.getByRole("button", { name: /save template|^save$|^submit$|^create$/i }).first();
  }

  cloneButton(): Locator {
    return this.page.getByRole("button", { name: /^clone$/i }).first();
  }

  setAsDefaultButton(): Locator {
    return this.page.getByRole("button", { name: /set as default/i }).first();
  }

  manageTemplatesButton(): Locator {
    return this.page.getByRole("button", { name: /manage templates/i }).first();
  }

  useTemplateButton(): Locator {
    return this.page.getByRole("button", { name: /use template/i }).first();
  }

  // ── Items tab ────────────────────────────────────────────────────────
  itemsTab(): Locator {
    return this.page.getByRole("tab", { name: /^items$/i }).first();
  }

  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item/i }).first();
  }

  browseCatalogButton(): Locator {
    return this.page.getByRole("button", { name: /browse catalog/i }).first();
  }

  // ── Bulk operations ──────────────────────────────────────────────────
  bulkOperationsTab(): Locator {
    return this.page.getByRole("tab", { name: /bulk operations/i }).first();
  }

  bulkOperationOption(name: RegExp | string): Locator {
    return this.page.getByRole("option", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|delete|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

}
