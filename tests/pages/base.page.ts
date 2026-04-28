import type { Page, Locator } from "@playwright/test";

/**
 * Abstract base for every `*.page.ts` page object in this repo.
 *
 * Owns the locators and helpers that appeared duplicated across 14+ page
 * objects before the Phase 1 refactor (see
 * `docs/superpowers/specs/2026-04-28-base-page-refactor-design.md`).
 *
 * Sub-classes:
 * - May add module-specific locators using `this.page.locator(...)` etc.
 * - May override a base method when the module needs a *looser* regex or
 *   extra chained logic (e.g. `.and()` / `.filter()`).
 * - Must NOT redeclare a base method to keep the same selector — that
 *   defeats the refactor.
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  // ── Universal feedback locators ──────────────────────────────────
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

  dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  alertDialog(): Locator {
    return this.page.getByRole("alertdialog");
  }

  // ── Common buttons (EN + TH) ─────────────────────────────────────
  saveButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Save|Create|บันทึก|สร้าง)$/i })
      .first();
  }

  cancelButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Cancel|ยกเลิก)$/i })
      .first();
  }

  editButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Edit|แก้ไข)$/i })
      .first();
  }

  deleteButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Delete|ลบ)$/i })
      .first();
  }

  // ── Filter / search / list affordances ───────────────────────────
  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  filterButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Filter|กรอง)$/i })
      .first();
  }

  applyFilterButton(): Locator {
    return this.page
      .getByRole("button", { name: /apply filters?/i })
      .first();
  }

  emptyState(): Locator {
    return this.page
      .getByText(/no.*data|no.*results|empty|ไม่พบ/i)
      .first();
  }

  // ── Status badge (transactional modules) ─────────────────────────
  statusBadge(): Locator {
    return this.page.locator('[data-slot="badge"]').first();
  }

  // ── Helpers ──────────────────────────────────────────────────────
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async waitForToast(text?: string | RegExp): Promise<void> {
    const t = this.toast();
    await t.waitFor({ state: "visible" });
    if (text !== undefined) {
      const re = typeof text === "string" ? new RegExp(text, "i") : text;
      await t.filter({ hasText: re }).waitFor({ state: "visible" });
    }
  }

  async expectNoError(): Promise<void> {
    const count = await this.anyError().count();
    if (count > 0) {
      const first = await this.anyError().first().textContent();
      throw new Error(`Validation error visible before action: ${first?.trim()}`);
    }
  }
}
