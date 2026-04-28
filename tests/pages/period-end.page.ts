import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/inventory-management/period-end";

export class PeriodEndPage extends BasePage {
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(id: string) {
    await this.page.goto(`${LIST_PATH}/${id}`);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  currentPeriodCard(): Locator {
    return this.page
      .locator("[data-slot='card'], .card, article, section")
      .filter({ hasText: /current period/i })
      .first();
  }

  viewDetailsButton(): Locator {
    return this.page.getByRole("button", { name: /view details/i }).first();
  }

  periodHistoryTable(): Locator {
    return this.page.getByRole("table").filter({ hasText: /period/i }).first();
  }

  emptyHistoryState(): Locator {
    return this.page.getByText(/no.*period|no.*history|empty|ไม่พบ/i).first();
  }

  // ── Detail page ──────────────────────────────────────────────────────
  startPeriodCloseButton(): Locator {
    return this.page.getByRole("button", { name: /start period close/i }).first();
  }

  validationOverviewSection(): Locator {
    return this.page
      .locator("[data-slot='card'], section, div")
      .filter({ hasText: /validation overview/i })
      .first();
  }

  adjustmentsTab(): Locator {
    return this.page.getByRole("tab", { name: /adjustment/i }).first();
  }

  viewFullValidationLink(): Locator {
    return this.page.getByRole("link", { name: /view full validation details/i }).first();
  }

  // ── Close workflow ───────────────────────────────────────────────────
  validateAllButton(): Locator {
    return this.page.getByRole("button", { name: /validate all/i }).first();
  }

  closePeriodButton(): Locator {
    return this.page.getByRole("button", { name: /close period/i }).first();
  }

  validationChecklist(): Locator {
    return this.page
      .locator("[data-slot='checklist'], section, ul")
      .filter({ hasText: /checklist|validation/i })
      .first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Status / verification ────────────────────────────────────────────
  // override: filters to period-end-specific status text
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /open|closed|in.progress|closing|closed/i })
      .first();
  }
}
