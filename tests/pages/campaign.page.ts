import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/vendor-management/request-price-list";
export const NEW_PATH = "/vendor-management/request-price-list/new";

export class CampaignPage extends BasePage {
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
  newCampaignButton(): Locator {
    return this.page.getByRole("button", { name: /create new campaign|new campaign|^new$|^create$/i }).first();
  }

  statusFilter(): Locator {
    return this.page.getByRole("combobox", { name: /status/i }).first();
  }

  statusOption(name: RegExp | string): Locator {
    return this.page.getByRole("option", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  campaignRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  // override: also matches "no campaign" empty text
  emptyState(): Locator {
    return this.page.getByText(/no.*campaign|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Form (multi-step wizard) ─────────────────────────────────────────
  campaignNameInput(): Locator {
    return this.page.getByLabel(/campaign name/i).first();
  }

  campaignDescriptionInput(): Locator {
    return this.page.getByLabel(/campaign description|^description$/i).first();
  }

  priorityTrigger(): Locator {
    return this.page.getByLabel(/priority/i).first();
  }

  scheduledStartDateInput(): Locator {
    return this.page.getByLabel(/scheduled start date|start date/i).first();
  }

  nextButton(): Locator {
    return this.page.getByRole("button", { name: /^next$/i }).first();
  }

  templateOption(name: string): Locator {
    return this.page.locator("[data-slot='card'], article, button").filter({ hasText: name }).first();
  }

  vendorCheckbox(name: string): Locator {
    return this.page
      .getByRole("row")
      .filter({ hasText: name })
      .getByRole("checkbox")
      .first();
  }

  launchCampaignButton(): Locator {
    return this.page.getByRole("button", { name: /launch campaign/i }).first();
  }

  saveChangesButton(): Locator {
    return this.page.getByRole("button", { name: /save changes|^save$/i }).first();
  }

  // ── Detail page actions ──────────────────────────────────────────────
  duplicateButton(): Locator {
    return this.page.getByRole("button", { name: /^duplicate$/i }).first();
  }

  exportButton(): Locator {
    return this.page.getByRole("button", { name: /^export$/i }).first();
  }

  actionsDropdown(): Locator {
    return this.page.getByRole("button", { name: /^actions$/i }).first();
  }

  actionMenuItem(name: RegExp | string): Locator {
    return this.page.getByRole("menuitem", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  vendorsTab(): Locator {
    return this.page.getByRole("tab", { name: /^vendors?$/i }).first();
  }

  sendReminderButton(): Locator {
    return this.page.getByRole("button", { name: /send reminder/i }).first();
  }

  reminderMessageInput(): Locator {
    return this.page.getByRole("dialog").locator("textarea").first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|delete|ok|yes|send/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
  // override: filters to campaign-specific status text
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|active|expired|completed/i })
      .first();
  }
}
