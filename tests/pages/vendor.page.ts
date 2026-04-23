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

  /** Wait for the success toast and redirect back to list. */
  async expectSaved() {
    await expect(
      this.page.getByText(/success|สำเร็จ|created|updated/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(this.page).toHaveURL(new RegExp(`${LIST_PATH}(?!/new)`), {
      timeout: 10_000,
    });
  }

  // ── Address tab stubs (implemented in Task 5) ────────────────────────
  async addAddressRow() { throw new Error("not implemented yet"); }
  async fillAddress(_index: number, _data: VendorAddressInput) { throw new Error("not implemented yet"); }
  async removeAddressRow(_index: number) { throw new Error("not implemented yet"); }
  addressCount(): Promise<number> { throw new Error("not implemented yet"); }
  addressRow(_index: number): Locator { throw new Error("not implemented yet"); }

  // ── Contact tab stubs (implemented in Task 6) ────────────────────────
  async addContactRow() { throw new Error("not implemented yet"); }
  async fillContact(_index: number, _data: VendorContactInput) { throw new Error("not implemented yet"); }
  async removeContactRow(_index: number) { throw new Error("not implemented yet"); }
  async setPrimaryContact(_index: number) { throw new Error("not implemented yet"); }
  contactCount(): Promise<number> { throw new Error("not implemented yet"); }
  contactRow(_index: number): Locator { throw new Error("not implemented yet"); }

  // ── Info tab stubs (implemented in Task 7) ───────────────────────────
  async addInfoRow() { throw new Error("not implemented yet"); }
  async fillInfo(_index: number, _data: VendorInfoInput) { throw new Error("not implemented yet"); }
  async removeInfoRow(_index: number) { throw new Error("not implemented yet"); }
}
