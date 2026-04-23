import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { ConfigListPage } from "./config-list.page";

export interface VendorAddressInput {
  address_type?: "contact_address" | "mailing_address" | "register_address";
  address_line1?: string;
  address_line2?: string;
  city?: string;
  district?: string;
  sub_district?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  mode?: "thai" | "international";
}

export interface VendorContactInput {
  name?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

export interface VendorInfoInput {
  label: string;
  value: string;
  dataType?: "string" | "number";
}

export interface VendorFormData {
  code: string;
  name: string;
  description?: string;
  businessType?: string;
  isActive?: boolean;
  addresses?: VendorAddressInput[];
  contacts?: VendorContactInput[];
  info?: VendorInfoInput[];
}

export const LIST_PATH = "/vendor-management/vendor";
export const NEW_PATH = "/vendor-management/vendor/new";

export class VendorPage {
  readonly list: ConfigListPage;

  constructor(private page: Page) {
    this.list = new ConfigListPage(page, LIST_PATH);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── Form — General tab ────────────────────────────────────────────────
  codeInput(): Locator {
    return this.page.locator("#vendor-code");
  }

  nameInput(): Locator {
    return this.page.locator("#vendor-name");
  }

  descriptionInput(): Locator {
    return this.page.locator("#vendor-description");
  }

  activeSwitch(): Locator {
    return this.page.locator("#vendor-is-active");
  }

  saveButton(): Locator {
    // FormToolbar submit button — text is "Create" in add mode, "Save" in edit mode
    return this.page
      .getByRole("button", { name: /^(Create|Save)$/i })
      .and(this.page.locator('[type="submit"]'));
  }

  cancelButton(): Locator {
    return this.page.getByRole("button", { name: /^Cancel$/i });
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^Edit$/i });
  }

  // ── Tabs ──────────────────────────────────────────────────────────────
  tabTrigger(tab: "general" | "info" | "address" | "contact"): Locator {
    const labelMap: Record<string, RegExp> = {
      general: /general|ทั่วไป/i,
      info: /info|ข้อมูล/i,
      address: /address|ที่อยู่/i,
      contact: /contact|ผู้ติดต่อ/i,
    };
    return this.page.getByRole("tab", { name: labelMap[tab] });
  }

  async switchTab(tab: "general" | "info" | "address" | "contact") {
    const trigger = this.tabTrigger(tab);
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "active", { timeout: 5_000 });
  }

  // ── Business type (multi-select Popover + Command) ───────────────────
  businessTypeTrigger(): Locator {
    // Button with aria-expanded inside the General tabpanel form area.
    // Scoped to the General tabpanel to avoid matching sidebar/header popovers
    // (e.g. org switcher) that also render a ChevronsUpDown icon.
    return this.page
      .getByRole("tabpanel", { name: /general|ทั่วไป/i })
      .locator("button")
      .filter({ has: this.page.locator('svg[class*="ChevronsUpDown"]').or(this.page.locator(".lucide-chevrons-up-down")) })
      .first();
  }

  businessTypeSearch(): Locator {
    return this.page.getByPlaceholder(/search.*business type/i);
  }

  /**
   * Open the business-type popover and click the first option.
   * If `label` is provided, search for it first. Returns the label that was selected.
   */
  async pickBusinessType(label?: string): Promise<string> {
    await this.businessTypeTrigger().click();
    await this.businessTypeSearch().waitFor({ state: "visible", timeout: 5_000 });
    if (label) {
      await this.businessTypeSearch().fill(label);
    }
    const firstOption = this.page.getByRole("option").first();
    await firstOption.waitFor({ state: "visible", timeout: 5_000 });
    const text = (await firstOption.textContent()) ?? "";
    await firstOption.click();
    await this.page.keyboard.press("Escape");
    return text.trim();
  }

  async businessTypeOptionCount(): Promise<number> {
    await this.businessTypeTrigger().click();
    await this.businessTypeSearch().waitFor({ state: "visible", timeout: 5_000 });
    // Wait until either an option appears or the empty state renders — avoid
    // counting before async fetch completes.
    await Promise.race([
      this.page.getByRole("option").first().waitFor({ state: "visible", timeout: 3_000 }),
      this.page.getByText(/no.*found|not.*found|ไม่พบ/i).first().waitFor({ state: "visible", timeout: 3_000 }),
    ]).catch(() => {
      // Neither appeared within 3s — fall through and let count() return whatever it sees.
    });
    const count = await this.page.getByRole("option").count();
    await this.page.keyboard.press("Escape");
    return count;
  }

  // ── Fill helpers ──────────────────────────────────────────────────────
  async fillGeneral(data: Pick<VendorFormData, "code" | "name" | "description" | "businessType">) {
    await this.switchTab("general");
    await this.codeInput().fill(data.code);
    await this.nameInput().fill(data.name);
    if (data.description !== undefined) {
      await this.descriptionInput().fill(data.description);
    }
    if (data.businessType !== undefined) {
      const count = await this.businessTypeOptionCount();
      if (count > 0) {
        await this.pickBusinessType(data.businessType || undefined);
      }
    }
  }

  /**
   * High-level flow: fill general (+ optional tabs) and save.
   * Does not wait for redirect — caller uses expectSaved().
   */
  async createVendor(data: VendorFormData) {
    await this.fillGeneral(data);
    if (data.addresses) {
      await this.switchTab("address");
      for (const a of data.addresses) {
        await this.addAddressRow();
        await this.fillAddress(0, a);
      }
    }
    if (data.contacts) {
      await this.switchTab("contact");
      for (const c of data.contacts) {
        await this.addContactRow();
        await this.fillContact(0, c);
      }
    }
    if (data.info) {
      await this.switchTab("info");
      for (const i of data.info) {
        await this.addInfoRow();
        await this.fillInfo(0, i);
      }
    }
    await this.saveButton().click();
  }

  /**
   * Wait for the success toast and for navigation to leave the `/new` form.
   *
   * - Create flow redirects to the detail page (`/vendor-management/vendor/{id}`).
   * - Edit flow redirects back to the list (`/vendor-management/vendor`).
   *
   * Both are acceptable — callers that need to verify the row appears on the
   * list should explicitly call `gotoList()` afterwards.
   */
  async expectSaved() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"]')
        .filter({ hasText: /success|สำเร็จ|created|updated/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(this.page).not.toHaveURL(/\/new(\?|$|#)/, { timeout: 10_000 });
  }

  // ── Address tab ───────────────────────────────────────────────────────
  /** Locator scoped to the address tab panel. */
  private addressPanel(): Locator {
    return this.page.getByRole("tabpanel", { name: /address|ที่อยู่/i });
  }

  /**
   * A row is a `div.space-y-6` that contains the address_type combobox.
   * Filtering by the combobox avoids matching panel-level wrappers that might
   * share the same Tailwind class.
   */
  addressRow(index: number): Locator {
    return this.addressPanel()
      .locator("div.space-y-6")
      .filter({ has: this.page.getByRole("combobox") })
      .nth(index);
  }

  async addAddressRow() {
    await this.switchTab("address");
    const before = await this.addressCount();
    const addButton = this.addressPanel().getByRole("button", { name: /^Add$|^เพิ่ม$/i });
    await addButton.click();
    await expect
      .poll(() => this.addressCount(), { timeout: 5_000 })
      .toBe(before + 1);
  }

  async addressCount(): Promise<number> {
    return await this.addressPanel()
      .locator("div.space-y-6")
      .filter({ has: this.page.getByRole("combobox") })
      .count();
  }

  async removeAddressRow(index: number) {
    const row = this.addressRow(index);
    const removeBtn = row.getByRole("button", { name: /remove/i }).first();
    await removeBtn.click();
  }

  async fillAddress(index: number, data: VendorAddressInput) {
    const row = this.addressRow(index);

    // 1) address_type Select (first combobox in the row)
    if (data.address_type) {
      const typeTrigger = row.getByRole("combobox").first();
      await typeTrigger.click();
      const labelMap: Record<string, RegExp> = {
        contact_address: /contact/i,
        mailing_address: /mailing/i,
        register_address: /register/i,
      };
      await this.page.getByRole("option", { name: labelMap[data.address_type] }).first().click();
    }

    // 2) Thai vs International radio
    const mode = data.mode ?? "international";
    const radio = row.getByRole("radio", { name: mode === "thai" ? /thai/i : /international/i });
    await radio.check({ force: true });

    // 3) Address lines
    if (data.address_line1 !== undefined) {
      await row.getByPlaceholder(/address line 1/i).fill(data.address_line1);
    }
    if (data.address_line2 !== undefined) {
      await row.getByPlaceholder(/address line 2/i).fill(data.address_line2);
    }

    // 4) International fields (city/district/sub_district/province/postal/country)
    if (mode === "international") {
      if (data.city !== undefined) await row.getByPlaceholder(/^city$/i).fill(data.city);
      if (data.district !== undefined) await row.getByPlaceholder(/^district$/i).fill(data.district);
      if (data.sub_district !== undefined) await row.getByPlaceholder(/sub.?district/i).fill(data.sub_district);
      if (data.province !== undefined) await row.getByPlaceholder(/province|state/i).fill(data.province);
      if (data.postal_code !== undefined) await row.getByPlaceholder(/postal code/i).first().fill(data.postal_code);
      if (data.country !== undefined) await row.getByPlaceholder(/country/i).fill(data.country);
    }
  }

  // ── Contact tab ───────────────────────────────────────────────────────
  private contactPanel(): Locator {
    return this.page.getByRole("tabpanel", { name: /contact|ผู้ติดต่อ/i });
  }

  /**
   * A contact row is a <tr> in the contact tab's DataGrid tbody that contains
   * the name input. Filtering by `input` excludes the empty-state `<tr>` which
   * the DataGrid renders with a single colspanned cell and `<EmptyComponent />`.
   */
  contactRow(index: number): Locator {
    return this.contactPanel()
      .locator("tbody tr")
      .filter({ has: this.page.locator("input") })
      .nth(index);
  }

  async addContactRow() {
    await this.switchTab("contact");
    const before = await this.contactCount();
    const addButton = this.contactPanel().getByRole("button", { name: /add.*contact|เพิ่ม/i }).first();
    await addButton.click();
    await expect
      .poll(() => this.contactCount(), { timeout: 5_000 })
      .toBe(before + 1);
  }

  async contactCount(): Promise<number> {
    return await this.contactPanel()
      .locator("tbody tr")
      .filter({ has: this.page.locator("input") })
      .count();
  }

  async removeContactRow(index: number) {
    const row = this.contactRow(index);
    const before = await this.contactCount();
    await row.getByRole("button").last().click();        // trash button in the row
    // DeleteDialog confirmation
    await this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: /confirm|delete|ลบ|ok/i })
      .click();
    await expect
      .poll(() => this.contactCount(), { timeout: 5_000 })
      .toBe(before - 1);
  }

  async fillContact(index: number, data: VendorContactInput) {
    const row = this.contactRow(index);
    if (data.name !== undefined) {
      await row.getByPlaceholder(/name/i).first().fill(data.name);
    }
    if (data.email !== undefined) {
      await row.locator('input[type="email"]').fill(data.email);
    }
    if (data.phone !== undefined) {
      await row.getByPlaceholder(/phone/i).fill(data.phone);
    }
    if (data.is_primary) {
      await this.setPrimaryContact(index);
    }
  }

  async setPrimaryContact(index: number) {
    const row = this.contactRow(index);
    const checkbox = row.getByRole("checkbox");
    await checkbox.check({ force: true });
  }

  // ── Info tab stubs (implemented in Task 7) ───────────────────────────
  async addInfoRow() { throw new Error("not implemented yet"); }
  async fillInfo(_index: number, _data: VendorInfoInput) { throw new Error("not implemented yet"); }
  async removeInfoRow(_index: number) { throw new Error("not implemented yet"); }
}
