import type { Page, Locator } from "@playwright/test";

export const LIST_PATH = "/product-management/category";

export class ProductCategoryPage {
  constructor(private page: Page) {}

  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page / tree ─────────────────────────────────────────────────
  newCategoryButton(): Locator {
    return this.page.getByRole("button", { name: /new category|^new$|^create$/i }).first();
  }

  newSubcategoryButton(): Locator {
    return this.page.getByRole("button", { name: /new subcategory/i }).first();
  }

  newItemGroupButton(): Locator {
    return this.page.getByRole("button", { name: /new item group/i }).first();
  }

  searchIcon(): Locator {
    return this.page.getByRole("button", { name: /^search$/i }).first();
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(/search|category name/i).first();
  }

  filterButton(): Locator {
    return this.page.getByRole("button", { name: /^filter$/i }).first();
  }

  applyFilterButton(): Locator {
    return this.page.getByRole("button", { name: /apply filters?/i }).first();
  }

  treeViewButton(): Locator {
    return this.page.getByRole("button", { name: /^tree$/i }).first();
  }

  listViewButton(): Locator {
    return this.page.getByRole("button", { name: /^list$/i }).first();
  }

  categoryNode(text: string): Locator {
    return this.page
      .locator("[role='treeitem'], [data-slot='tree-item'], li, button")
      .filter({ hasText: text })
      .first();
  }

  breadcrumbTrail(): Locator {
    return this.page.locator("[role='navigation'][aria-label*='breadcrumb' i], nav, ol").filter({ hasText: /\//i }).first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no.*categor|no.*data|empty|ไม่พบ/i).first();
  }

  // ── Category form ────────────────────────────────────────────────────
  categoryNameInput(): Locator {
    return this.page.getByLabel(/category name|item group name/i).first();
  }

  parentSubcategoryTrigger(): Locator {
    return this.page.getByLabel(/parent subcategory|parent/i).first();
  }

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^save$|^create$/i }).first();
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$/i }).first();
  }

  deleteButton(): Locator {
    return this.page.getByRole("button", { name: /^delete$/i }).first();
  }

  moveButton(): Locator {
    return this.page.getByRole("button", { name: /^move$/i }).first();
  }

  activateButton(): Locator {
    return this.page.getByRole("button", { name: /^activate$/i }).first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  confirmDialogButton(name: RegExp = /confirm|delete|yes|move|ok/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
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
