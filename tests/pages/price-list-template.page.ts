import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export const LIST_PATH = "/vendor-management/price-list-template";
export const NEW_PATH = "/vendor-management/price-list-template/new";

export interface TemplateHeaderInput {
  name?: string;
  description?: string;
  currency?: string;
  validityDays?: number | string;
  vendorInstructions?: string;
  allowMultiMOQ?: boolean;
  requireLeadTime?: boolean;
  maxItemsPerSubmission?: number | string;
  sendReminders?: boolean;
  reminderDays?: number[];
  escalationDays?: number | string;
}

export class PriceListTemplatePage {
  constructor(private page: Page) {}

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
  newButton(): Locator {
    return this.page.getByRole("button", { name: /new (pricelist|price.?list).*template|create.*template|^new$|^create$/i }).first();
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  statusTab(name: RegExp | string): Locator {
    return this.page.getByRole("tab", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  templateRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  templateCard(text: string): Locator {
    return this.page.locator("[data-slot='card'], article, .card").filter({ hasText: text }).first();
  }

  async openTemplate(text: string) {
    const card = this.templateCard(text);
    if ((await card.count()) > 0) {
      await card.click();
    } else {
      const row = this.templateRow(text);
      await row.click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  // ── Form (create / edit) ─────────────────────────────────────────────
  nameInput(): Locator {
    return this.page.getByLabel(/template name|^name$/i).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/^description$/i).first();
  }

  currencyTrigger(): Locator {
    return this.page.getByLabel(/currency/i).first();
  }

  validityDaysInput(): Locator {
    return this.page.getByLabel(/validity.*period|validity.*days/i).first();
  }

  vendorInstructionsInput(): Locator {
    return this.page.getByLabel(/vendor instruction/i).first();
  }

  allowMultiMoqSwitch(): Locator {
    return this.page.getByRole("switch", { name: /multi.?moq/i }).first();
  }

  requireLeadTimeSwitch(): Locator {
    return this.page.getByRole("switch", { name: /lead time/i }).first();
  }

  maxItemsInput(): Locator {
    return this.page.getByLabel(/max items|maximum items/i).first();
  }

  sendRemindersSwitch(): Locator {
    return this.page.getByRole("switch", { name: /reminder/i }).first();
  }

  reminderDayCheckbox(days: number): Locator {
    return this.page.getByRole("checkbox", { name: new RegExp(`${days}\\s*day`, "i") }).first();
  }

  escalationDaysInput(): Locator {
    return this.page.getByLabel(/escalation.*day/i).first();
  }

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /save changes|^save$|^create$/i }).first();
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$/i }).first();
  }

  cancelButton(): Locator {
    return this.page.getByRole("button", { name: /^cancel$/i }).first();
  }

  async fillHeader(data: TemplateHeaderInput) {
    if (data.name !== undefined) {
      const n = this.nameInput();
      if ((await n.count()) > 0) await n.fill(data.name);
    }
    if (data.description !== undefined) {
      const d = this.descriptionInput();
      if ((await d.count()) > 0) await d.fill(data.description);
    }
    if (data.validityDays !== undefined) {
      const v = this.validityDaysInput();
      if ((await v.count()) > 0) await v.fill(String(data.validityDays));
    }
    if (data.vendorInstructions !== undefined) {
      const v = this.vendorInstructionsInput();
      if ((await v.count()) > 0) await v.fill(data.vendorInstructions);
    }
    if (data.maxItemsPerSubmission !== undefined) {
      const m = this.maxItemsInput();
      if ((await m.count()) > 0) await m.fill(String(data.maxItemsPerSubmission));
    }
    if (data.escalationDays !== undefined) {
      const e = this.escalationDaysInput();
      if ((await e.count()) > 0) await e.fill(String(data.escalationDays));
    }
    if (data.allowMultiMOQ !== undefined) {
      const s = this.allowMultiMoqSwitch();
      if ((await s.count()) > 0) {
        const checked = (await s.getAttribute("aria-checked")) === "true";
        if (checked !== data.allowMultiMOQ) await s.click();
      }
    }
    if (data.requireLeadTime !== undefined) {
      const s = this.requireLeadTimeSwitch();
      if ((await s.count()) > 0) {
        const checked = (await s.getAttribute("aria-checked")) === "true";
        if (checked !== data.requireLeadTime) await s.click();
      }
    }
    if (data.sendReminders !== undefined) {
      const s = this.sendRemindersSwitch();
      if ((await s.count()) > 0) {
        const checked = (await s.getAttribute("aria-checked")) === "true";
        if (checked !== data.sendReminders) await s.click();
      }
    }
    if (data.reminderDays) {
      for (const d of data.reminderDays) {
        const cb = this.reminderDayCheckbox(d);
        if ((await cb.count()) > 0) await cb.check({ force: true }).catch(() => {});
      }
    }
  }

  // ── Products tab ─────────────────────────────────────────────────────
  productsTab(): Locator {
    return this.page.getByRole("tab", { name: /product/i }).first();
  }

  addProductsButton(): Locator {
    return this.page.getByRole("button", { name: /add products?/i }).first();
  }

  productCheckbox(index: number): Locator {
    return this.page.getByRole("checkbox").nth(index);
  }

  confirmSelectionButton(): Locator {
    return this.page.getByRole("button", { name: /confirm selection/i }).first();
  }

  productListItem(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  // ── Clone / activate / deactivate ────────────────────────────────────
  cloneButton(): Locator {
    return this.page.getByRole("button", { name: /clone template|^clone$/i }).first();
  }

  cloneNameInput(): Locator {
    return this.page
      .getByRole("dialog")
      .getByLabel(/new template name|template name/i)
      .first();
  }

  confirmCloneButton(): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name: /^clone$|confirm/i }).first();
  }

  activateButton(): Locator {
    return this.page.getByRole("button", { name: /^activate$/i }).first();
  }

  deactivateButton(): Locator {
    return this.page.getByRole("button", { name: /^deactivate$/i }).first();
  }

  detailsButton(): Locator {
    return this.page.getByRole("button", { name: /^details$/i }).first();
  }

  // ── Filters / sorting ────────────────────────────────────────────────
  filterByProductCount(): Locator {
    return this.page.getByRole("button", { name: /filter by product count/i }).first();
  }

  applyFilterButton(): Locator {
    return this.page.getByRole("button", { name: /apply filter/i }).first();
  }

  nameColumnHeader(): Locator {
    return this.page.getByRole("columnheader", { name: /^name$/i }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
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

  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|cloned|activated|deactivated|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
