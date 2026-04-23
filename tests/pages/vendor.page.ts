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
    const count = await this.page.getByRole("option").count();
    await this.page.keyboard.press("Escape");
    return count;
  }
}
