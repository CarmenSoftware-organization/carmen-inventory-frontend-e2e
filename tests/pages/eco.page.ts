import { expect, type Page, type Locator } from "@playwright/test";
import { ConfigListPage } from "./config-list.page";
import { BasePage } from "./base.page";

/**
 * Dedicated page object for the **eco** (eco-certification / eco-label) config
 * module (`/config/eco`).
 *
 * Like {@link ./certification.page.ts}, this module intentionally does NOT use
 * the shared `DialogCrudHelper`: it has a `code` field that is the unique key
 * (search / clickRow / delete all key on CODE, not name), so it gets a bespoke
 * page object. List operations are delegated to a composed `ConfigListPage`;
 * only the dialog locators and code-aware row helpers live here.
 *
 * The dialog/row locators below are modelled on the proven ones in
 * `DialogCrudHelper` (which works against this exact `ConfigListTemplate`).
 */
const PATH = "/config/eco";

class _BasePageImpl extends BasePage {}

export class EcoPage {
  /** Composed list page — use for goto / addButton / search / emptyState. */
  readonly list: ConfigListPage;
  private readonly base: _BasePageImpl;

  constructor(private page: Page) {
    this.list = new ConfigListPage(page, PATH);
    this.base = new _BasePageImpl(page);
  }

  // ── Dialog field locators ────────────────────────────────────────
  dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  codeInput(): Locator {
    return this.page.locator("#eco-label-code");
  }

  nameInput(): Locator {
    return this.page.locator("#eco-label-name");
  }

  descriptionInput(): Locator {
    return this.page.locator("#eco-label-description");
  }

  activeSwitch(): Locator {
    return this.page.locator("#eco-label-is-active");
  }

  // ── Status switch helpers (Radix role="switch" → aria-checked) ────
  /** Read the StatusSwitch state. */
  async isActive(): Promise<boolean> {
    return (await this.activeSwitch().getAttribute("aria-checked")) === "true";
  }

  /** Set the StatusSwitch to `on`, clicking only when it differs. */
  async setActive(on: boolean): Promise<void> {
    if ((await this.isActive()) !== on) {
      await this.activeSwitch().click();
    }
  }

  // ── Dialog buttons / error / delete confirm ──────────────────────
  saveButton(): Locator {
    return this.dialog().getByRole("button", {
      name: /^(Create|Save|สร้าง|บันทึก)$/i,
    });
  }

  cancelButton(): Locator {
    return this.dialog().getByRole("button", { name: /Cancel|ยกเลิก/i });
  }

  errorMessage(): Locator {
    return this.dialog().locator(
      "[aria-invalid='true'], [data-invalid='true'], p.text-destructive, [role='alert']",
    );
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

  // ── Row / dialog actions (keyed on CODE — the unique column) ──────
  async openAddDialog(): Promise<void> {
    await this.list.addButton().click();
    await this.dialog().waitFor({ state: "visible" });
  }

  /**
   * Open the edit dialog for the row carrying `code`. Mirrors
   * DialogCrudHelper.clickRow: locate the row by any matching cell, then click
   * its first text-bearing CellAction button (the "Row actions" button is
   * icon-only, so it is excluded by the `hasText` filter).
   */
  async clickRow(code: string): Promise<void> {
    const row = this.page
      .getByRole("row", { name: new RegExp(code, "i") })
      .first();
    await row.waitFor({ state: "visible", timeout: 10_000 });
    const button = row.getByRole("button").filter({ hasText: /\S/ }).first();
    await button.click();
    await this.dialog().waitFor({ state: "visible", timeout: 10_000 });
  }

  /** Open the per-row "Row actions" dropdown and click Delete. */
  async deleteRow(code: string): Promise<void> {
    const row = this.page.getByRole("row", { name: new RegExp(code, "i") });
    await row.getByRole("button", { name: "Row actions" }).click();
    await this.page.getByRole("menuitem", { name: /^Delete$/i }).click();
  }

  /**
   * Open Add, fill code + name (description left blank), optionally turn the
   * status switch off, save, and assert the created toast.
   */
  async createEco(
    code: string,
    name: string,
    { active = true }: { active?: boolean } = {},
  ): Promise<void> {
    await this.openAddDialog();
    await this.codeInput().fill(code);
    await this.nameInput().fill(name);
    if (!active) {
      await this.setActive(false);
    }
    await this.saveButton().click();
    await expect(
      this.page.getByText(/created|success|สำเร็จ/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
