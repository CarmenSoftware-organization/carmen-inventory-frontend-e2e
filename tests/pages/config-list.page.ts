import type { Page } from "@playwright/test";

/**
 * Generic list page object for any module under /config/*.
 *
 * Use for smoke / read-only tests. For full CRUD tests, create a
 * module-specific page object with the module's form field selectors.
 */
export class ConfigListPage {
  constructor(
    private page: Page,
    private path: string,
  ) {}

  readonly addButton = () => this.page.getByRole("button", { name: /Add/i }).first();
  readonly searchInput = () => this.page.getByPlaceholder(/Search/i);
  readonly table = () => this.page.locator("table");
  readonly tableRows = () => this.table().locator("tbody tr");
  readonly emptyState = () =>
    this.page.getByText(/no.*data|no.*results|empty|ไม่พบ/i);

  async goto() {
    await this.page.goto(this.path);
    await this.page.waitForLoadState("networkidle");
  }

  async search(query: string) {
    const input = this.searchInput();
    await input.click();
    await input.fill("");
    if (query) {
      await input.pressSequentially(query, { delay: 20 });
    }
    await input.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }
}
