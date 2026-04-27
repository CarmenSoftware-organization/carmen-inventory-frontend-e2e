import type { Page, Locator } from "@playwright/test";

export const LIST_PATH = "/store-operation/store-requisition";

export class StockIssuePage {
  constructor(private page: Page) {}

  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(id: string) {
    await this.page.goto(`${LIST_PATH}/${id}`);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  statusFilter(): Locator {
    return this.page.getByRole("combobox", { name: /status/i }).first();
  }

  fromLocationFilter(): Locator {
    return this.page.getByRole("combobox", { name: /from location/i }).first();
  }

  toLocationFilter(): Locator {
    return this.page.getByRole("combobox", { name: /to location/i }).first();
  }

  departmentFilter(): Locator {
    return this.page.getByRole("combobox", { name: /department/i }).first();
  }

  filterOption(name: RegExp | string): Locator {
    return this.page.getByRole("option", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  summaryCards(): Locator {
    return this.page.locator("[data-slot='card'], .card, article").first();
  }

  issueRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no.*issue|no.*data|empty|ไม่พบ/i).first();
  }

  paginationNext(): Locator {
    return this.page.getByRole("button", { name: /next/i }).first();
  }

  paginationPrev(): Locator {
    return this.page.getByRole("button", { name: /previous|prev/i }).first();
  }

  // ── Detail page ──────────────────────────────────────────────────────
  fromLocationCard(): Locator {
    return this.page.locator("[data-slot='card'], section, article").filter({ hasText: /from location/i }).first();
  }

  toLocationCard(): Locator {
    return this.page.locator("[data-slot='card'], section, article").filter({ hasText: /to location/i }).first();
  }

  departmentCard(): Locator {
    return this.page.locator("[data-slot='card'], section, article").filter({ hasText: /department/i }).first();
  }

  expenseAccountCard(): Locator {
    return this.page.locator("[data-slot='card'], section, article").filter({ hasText: /expense account/i }).first();
  }

  itemsTable(): Locator {
    return this.page.getByRole("table").filter({ hasText: /item|product|qty/i }).first();
  }

  // ── Action buttons ───────────────────────────────────────────────────
  viewFullSRButton(): Locator {
    return this.page.getByRole("button", { name: /view full sr|view sr/i }).first();
  }

  printButton(): Locator {
    return this.page.getByRole("button", { name: /^print$/i }).first();
  }

  completeButton(): Locator {
    return this.page.getByRole("button", { name: /^complete$/i }).first();
  }

  viewExpenseAllocationButton(): Locator {
    return this.page.getByRole("button", { name: /view expense allocation/i }).first();
  }

  // ── Status / verification ────────────────────────────────────────────
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|issue|complete|cancel|active/i })
      .first();
  }

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
}
