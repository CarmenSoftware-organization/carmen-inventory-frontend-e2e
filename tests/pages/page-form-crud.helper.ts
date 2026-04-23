import type { Page, Locator } from "@playwright/test";
import { ConfigListPage } from "./config-list.page";

/**
 * Helper for page-form-based config modules (department, location, adjustment-type).
 *
 * These modules use a full page form (not a dialog) with:
 *  - /config/{module}        → list
 *  - /config/{module}/new    → create form
 *  - /config/{module}/[id]   → view/edit form (toggle via Edit button)
 *
 * The form uses FormToolbar with Save/Create button via formId attribute.
 */
export interface PageFormCrudOptions {
  listPath: string;
  codeInputId: string; // e.g. "department-code"
  nameInputId: string; // e.g. "department-name"
  activeSwitchId?: string; // e.g. "department-is-active"
}

export class PageFormCrudHelper {
  readonly list: ConfigListPage;

  constructor(
    private page: Page,
    private opts: PageFormCrudOptions,
  ) {
    this.list = new ConfigListPage(page, opts.listPath);
  }

  async gotoNew() {
    await this.page.goto(`${this.opts.listPath}/new`);
    await this.page.waitForLoadState("networkidle");
  }

  codeInput(): Locator {
    return this.page.locator(`#${this.opts.codeInputId}`);
  }

  nameInput(): Locator {
    return this.page.locator(`#${this.opts.nameInputId}`);
  }

  activeSwitch(): Locator | null {
    return this.opts.activeSwitchId
      ? this.page.locator(`#${this.opts.activeSwitchId}`)
      : null;
  }

  // Save button is rendered by FormToolbar — name is "Create" or "Save" depending on mode
  saveButton(): Locator {
    return this.page.getByRole("button", {
      name: /^(Create|Save|สร้าง|บันทึก)$/i,
    });
  }

  cancelButton(): Locator {
    return this.page.getByRole("button", { name: /^(Cancel|ยกเลิก)$/i });
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^(Edit|แก้ไข)$/i });
  }

  deleteButton(): Locator {
    return this.page.getByRole("button", { name: /^(Delete|ลบ)$/i });
  }

  errorMessage(): Locator {
    return this.page.locator("[data-invalid='true'] [role='alert'], form [data-invalid='true']").first();
  }

  deleteConfirm(): Locator {
    return this.page.getByRole("alertdialog");
  }

  deleteConfirmButton(): Locator {
    return this.deleteConfirm().getByRole("button", { name: /^(Delete|ลบ)$/i });
  }

  async clickRowName(name: string) {
    // CellAction renders a <button> — click it directly so navigation fires
    // even if the cell has padding/whitespace around the button.
    const button = this.page.getByRole("button", { name, exact: true }).first();
    await button.waitFor({ state: "visible", timeout: 10_000 });
    await button.click();
    // Wait for navigation to /{listPath}/{id}, not the list itself or /new.
    const listPath = this.opts.listPath.replace(/\/$/, "");
    await this.page.waitForURL(
      (url) => {
        const p = url.pathname.replace(/\/$/, "");
        return p.startsWith(`${listPath}/`) && !p.endsWith("/new");
      },
      { timeout: 10_000 },
    );
    await this.page.waitForLoadState("networkidle");
  }
}
