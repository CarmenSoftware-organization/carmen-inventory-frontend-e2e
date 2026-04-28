import type { Page, Locator } from "@playwright/test";
import { ConfigListPage } from "./config-list.page";
import { BasePage } from "./base.page";

/**
 * Reusable helper for dialog-based config modules with a name field and
 * optional is_active switch. Use for modules following the delivery-point
 * CRUD pattern (open dialog from list → fill name → save).
 */
export interface DialogCrudOptions {
  listPath: string;
  nameInputId: string; // e.g. "business-type-name"
  activeSwitchId?: string; // e.g. "business-type-is-active"
}

class _BasePageImpl extends BasePage {}

export class DialogCrudHelper {
  readonly list: ConfigListPage;
  private readonly base: _BasePageImpl;

  constructor(
    private page: Page,
    private opts: DialogCrudOptions,
  ) {
    this.list = new ConfigListPage(page, opts.listPath);
    this.base = new _BasePageImpl(page);
  }

  dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  nameInput(): Locator {
    return this.page.locator(`#${this.opts.nameInputId}`);
  }

  activeSwitch(): Locator | null {
    return this.opts.activeSwitchId
      ? this.page.locator(`#${this.opts.activeSwitchId}`)
      : null;
  }

  cancelButton(): Locator {
    return this.dialog().getByRole("button", { name: /Cancel|ยกเลิก/i });
  }

  saveButton(): Locator {
    return this.dialog().getByRole("button", {
      name: /^(Create|Save|สร้าง|บันทึก)$/i,
    });
  }

  errorMessage(): Locator {
    return this.dialog().locator("[data-invalid='true'], [role='alert']");
  }

  deleteConfirm(): Locator {
    return this.base.alertDialog();
  }

  deleteConfirmButton(): Locator {
    return this.deleteConfirm().getByRole("button", { name: /Delete|ลบ/i });
  }

  deleteCancelButton(): Locator {
    return this.deleteConfirm().getByRole("button", { name: /Cancel|ยกเลิก/i });
  }

  async openAddDialog() {
    await this.list.addButton().click();
    await this.dialog().waitFor({ state: "visible" });
  }

  async clickRow(name: string) {
    // Match the row by any cell containing `name`, then click the first
    // CellAction button in that row. Modules vary on which column carries
    // CellAction (e.g. business-type → name, currency → code), so locate via
    // the row instead of the button name.
    const row = this.page.getByRole("row", { name: new RegExp(name, "i") }).first();
    await row.waitFor({ state: "visible", timeout: 10_000 });
    // CellAction has visible text (the cell value); "Row actions" is icon-only.
    const button = row.getByRole("button").filter({ hasText: /\S/ }).first();
    await button.click();
    await this.dialog().waitFor({ state: "visible", timeout: 10_000 });
  }

  async deleteRow(name: string) {
    // Delete lives inside a per-row "Row actions" dropdown menu
    const row = this.page.getByRole("row", { name: new RegExp(name, "i") });
    await row.getByRole("button", { name: "Row actions" }).click();
    await this.page
      .getByRole("menuitem", { name: /^Delete$/i })
      .click();
  }
}
