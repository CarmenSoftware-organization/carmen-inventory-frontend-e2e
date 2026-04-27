import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export const LIST_PATH = "/procurement/purchase-order";
export const NEW_PATH = "/procurement/purchase-order/new";

export interface POHeaderInput {
  vendor?: string;
  description?: string;
  deliveryDate?: string;
  notes?: string;
}

export interface POLineItemInput {
  product?: string;
  quantity?: number | string;
  uom?: string;
  unitPrice?: number | string;
}

export class PurchaseOrderPage {
  constructor(private page: Page) {}

  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoDetail(orderNumber: string) {
    await this.page.goto(`${LIST_PATH}/${orderNumber}`);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  newPODropdown(): Locator {
    return this.page.getByRole("button", { name: /new po|create purchase order|^create$/i }).first();
  }

  createFromPRMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /create from purchase request/i }).first();
  }

  manualPOMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /manual po|blank po/i }).first();
  }

  poRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  // ── Form ─────────────────────────────────────────────────────────────
  vendorTrigger(): Locator {
    return this.page.getByLabel(/vendor/i).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/^description$/i).first();
  }

  deliveryDateInput(): Locator {
    return this.page.getByLabel(/delivery date|expected.*delivery/i).first();
  }

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /save po|^save$|^submit$|^create$/i }).first();
  }

  cancelButton(): Locator {
    return this.page.getByRole("button", { name: /^cancel$/i }).first();
  }

  // ── Detail / actions ─────────────────────────────────────────────────
  sendToVendorButton(): Locator {
    return this.page.getByRole("button", { name: /send to vendor|^send$/i }).first();
  }

  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$/i }).first();
  }

  cancelPOButton(): Locator {
    return this.page.getByRole("button", { name: /cancel purchase order|cancel po|^void$/i }).first();
  }

  requestChangeOrderButton(): Locator {
    return this.page.getByRole("button", { name: /request change order|change order/i }).first();
  }

  generatePONumberButton(): Locator {
    return this.page.getByRole("button", { name: /generate po number/i }).first();
  }

  applyDiscountButton(): Locator {
    return this.page.getByRole("button", { name: /apply discount/i }).first();
  }

  calculateTotalsButton(): Locator {
    return this.page.getByRole("button", { name: /calculate totals/i }).first();
  }

  qrCodeSection(): Locator {
    return this.page
      .locator("[data-slot='qr-code'], [data-testid='qr-code'], section, div")
      .filter({ has: this.page.locator("img[alt*='qr' i], img[src*='qr' i]") })
      .first();
  }

  qrCodeImage(): Locator {
    return this.page.locator("img[alt*='qr' i], img[src*='qr' i]").first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  reasonInput(): Locator {
    return this.page
      .getByRole("dialog")
      .locator("textarea, input[type='text']")
      .first();
  }

  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Dashboard ────────────────────────────────────────────────────────
  summaryCards(): Locator {
    return this.page.locator("[data-slot='card'], .card, article").first();
  }

  budgetUtilizationChart(): Locator {
    return this.page
      .locator("[data-testid='budget-chart'], canvas, svg")
      .filter({ hasText: /budget|utilization/i })
      .first();
  }

  // ── Status / verification ────────────────────────────────────────────
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|sent|approved|acknowledged|received|cancelled|completed|rejected/i })
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

  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|sent|approved|cancelled|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }
}
