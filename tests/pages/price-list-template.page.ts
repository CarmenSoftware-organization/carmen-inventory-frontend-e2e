import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/vendor-management/price-list-template";
export const NEW_PATH = "/vendor-management/price-list-template/new";

// Superset of header fields. The redesigned form only renders name (required),
// currency (required), description, validity period and vendor instruction;
// the remaining switch/reminder fields are kept for backward compatibility with
// older tests and are no-ops when their controls are absent.
export interface TemplateHeaderInput {
  name?: string;
  description?: string;
  /** "first" picks the first available currency option; a string matches by label/code. */
  currency?: "first" | string;
  validityDays?: number | string;
  vendorInstructions?: string;
  allowMultiMOQ?: boolean;
  requireLeadTime?: boolean;
  maxItemsPerSubmission?: number | string;
  sendReminders?: boolean;
  reminderDays?: number[];
  escalationDays?: number | string;
}

/**
 * Page object for the **redesigned** Pricelist Template module.
 *
 * The create/edit screen is a rich document form on `/price-list-template/new`
 * (and `/:id`): a hero NameField, a required LookupCurrency Radix Select, an
 * optional description Textarea, validity, and an inline product table. The list
 * exposes an "Add Template" button, a SearchInput (fires onSearch on Enter), and
 * per-row "Row actions" menus whose Delete opens a DeleteDialog (AlertDialog).
 *
 * (The previous tabbed/dialog-based clone / activate-deactivate / add-products
 * affordances were removed in the redesign — those flows no longer exist here.)
 */
export class PriceListTemplatePage extends BasePage {
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
    return this.page
      .getByRole("button", { name: /add template|add price.?list template|^add$|^create$/i })
      .first();
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
      await this.templateRow(text).click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Open the first template in the list by clicking its name button (the row
   * itself is not clickable — navigation is wired to the name cell). Returns
   * false if the list is empty so the caller can skip.
   */
  async openFirst(): Promise<boolean> {
    await this.gotoList();
    const firstName = this.page.getByRole("row").nth(1).getByRole("button").first();
    if ((await firstName.count()) === 0) return false;
    await firstName.click();
    await this.page.waitForLoadState("networkidle");
    return true;
  }

  /**
   * Filter the list to `name` (SearchInput fires on Enter), then open it. Lands
   * on the detail page in view mode.
   */
  async openByName(name: string) {
    await this.gotoList();
    const search = this.searchInput();
    if ((await search.count()) > 0) {
      await search.fill(name).catch(() => {});
      await search.press("Enter").catch(() => {});
    }
    await this.page.getByText(name, { exact: false }).first().click();
    await this.page.waitForLoadState("networkidle");
  }

  // ── Row actions (edit / delete) ──────────────────────────────────────
  rowActionsTrigger(text: string): Locator {
    return this.templateRow(text).getByRole("button", { name: /row actions|actions|more/i }).first();
  }

  /**
   * Open a row's actions menu and click Delete, then either confirm or cancel in
   * the DeleteDialog (AlertDialog). Caller must have the row visible (search first).
   */
  async deleteViaRowActions(text: string, opts: { confirm: boolean }) {
    await this.rowActionsTrigger(text).click({ timeout: 10_000 });
    await this.page.getByRole("menuitem", { name: /^(delete|ลบ)$/i }).first().click({ timeout: 10_000 });
    const dialog = this.page.getByRole("alertdialog");
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    const name = opts.confirm ? /^(delete|confirm|ลบ|ok)$/i : /^(cancel|ยกเลิก)$/i;
    await dialog.getByRole("button", { name }).click();
  }

  // ── Form (create / edit) ─────────────────────────────────────────────
  nameInput(): Locator {
    // Redesigned hero NameField — targeted by its placeholder.
    return this.page.getByPlaceholder(/Fresh Produce Template/i).first();
  }

  descriptionInput(): Locator {
    // Optional description Textarea (placeholder "Optional").
    return this.page.getByPlaceholder(/^optional$/i).first();
  }

  currencySelect(): Locator {
    return this.page.getByRole("combobox").first();
  }

  /** Open the required currency Select and pick the first available option. */
  async selectFirstCurrency() {
    await this.currencySelect().click();
    await this.page.getByRole("option").first().click();
  }

  validityDaysInput(): Locator {
    return this.page.getByLabel(/validity.*period|validity.*days/i).first();
  }

  vendorInstructionsInput(): Locator {
    return this.page.getByLabel(/vendor instruction/i).first();
  }

  maxItemsInput(): Locator {
    return this.page.getByLabel(/max items|maximum items/i).first();
  }

  // matches the toolbar submit button ("Save" / "Create" / "Save Changes")
  saveButton(): Locator {
    return this.page.getByRole("button", { name: /save changes|^save$|^create$|บันทึก|สร้าง/i }).first();
  }

  async fillHeader(data: TemplateHeaderInput) {
    if (data.name !== undefined) {
      const n = this.nameInput();
      if ((await n.count()) > 0) await n.fill(data.name);
    }
    if (data.currency !== undefined) {
      const c = this.currencySelect();
      if ((await c.count()) > 0) {
        await c.click();
        const option =
          data.currency === "first"
            ? this.page.getByRole("option").first()
            : this.page.getByRole("option", { name: new RegExp(data.currency, "i") }).first();
        await option.click().catch(() => {});
      }
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
  }

  // ── Inline product table (redesigned add-products flow) ─────────────
  // The old "Add Products" dialog (checkbox picker + Confirm Selection) was
  // replaced by an inline product table on the create/edit form: an
  // "Add product" button appends a row (product lookup + unit + qty + note),
  // and each row carries a "Remove tier" (X) button. The table is shown only
  // when the form is editable (create / edit mode), never in read-only view.
  addProductButton(): Locator {
    // rendered both in the section header and inside the empty-state card
    return this.page.getByRole("button", { name: /add product/i }).first();
  }

  productsEmptyState(): Locator {
    return this.page.getByText(/no products yet/i).first();
  }

  /** Per-row remove (X) button; its presence proves an inline product row exists. */
  removeProductRowButton(): Locator {
    return this.page.getByRole("button", { name: /remove tier/i });
  }

  // ── Status (redesigned activate / deactivate flow) ──────────────────
  // Dedicated Activate/Deactivate buttons were removed; the template status is
  // now a Select in the form's summary <aside>, rendered only in create/edit
  // mode. The global layout uses <nav> for navigation, so on this page the
  // <aside> is unique and holds exactly one combobox — the status control.
  statusSelect(): Locator {
    return this.page.locator("aside").getByRole("combobox").first();
  }

  async selectStatus(label: "Active" | "Inactive" | "Draft") {
    await this.statusSelect().click();
    await this.page
      .getByRole("option", { name: new RegExp(`^${label}$`, "i") })
      .first()
      .click();
  }

  // ── Clone (removed in redesign) ─────────────────────────────────────
  // The Clone/Duplicate action no longer exists; only a decorative "Copy"
  // glyph badge (a <span>, not a button) remains in the detail toolbar.
  cloneButton(): Locator {
    return this.page.getByRole("button", { name: /clone|duplicate/i });
  }

  cloneMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /clone|duplicate/i });
  }

  rowActionsButton(): Locator {
    return this.page.getByRole("button", { name: /row actions/i }).first();
  }

  // ── Filters / sorting (list edge cases) ──────────────────────────────
  filterByProductCount(): Locator {
    return this.page.getByRole("button", { name: /filter by product count/i }).first();
  }

  applyFilterButton(): Locator {
    return this.page.getByRole("button", { name: /apply filters?/i }).first();
  }

  nameColumnHeader(): Locator {
    return this.page.getByRole("columnheader", { name: /^name$/i }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|deleted|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
