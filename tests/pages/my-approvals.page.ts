import type { Page, Locator } from "@playwright/test";

export const LIST_PATH = "/procurement/approval";
export const PR_LIST_PATH = "/procurement/purchase-request";

export class MyApprovalsPage {
  constructor(private page: Page) {}

  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoPRList() {
    await this.page.goto(PR_LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  pendingCountBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /pending|count/i })
      .first();
  }

  documentRow(text: string): Locator {
    return this.page.getByRole("row").filter({ hasText: text }).first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no.*pending|no.*approval|empty|ไม่พบ/i).first();
  }

  // ── Bulk actions ─────────────────────────────────────────────────────
  selectMultipleButton(): Locator {
    return this.page.getByRole("button", { name: /select multiple/i }).first();
  }

  rowCheckbox(text: string): Locator {
    return this.documentRow(text).getByRole("checkbox").first();
  }

  bulkApproveButton(): Locator {
    return this.page.getByRole("button", { name: /bulk approve/i }).first();
  }

  confirmBulkApprovalButton(): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name: /confirm bulk approval/i }).first();
  }

  // ── Approve / Reject / Request Info ──────────────────────────────────
  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$/i }).first();
  }

  rejectButton(): Locator {
    return this.page.getByRole("button", { name: /^reject$/i }).first();
  }

  requestMoreInfoButton(): Locator {
    return this.page.getByRole("button", { name: /request more info/i }).first();
  }

  reasonInput(): Locator {
    return this.page
      .getByRole("dialog")
      .locator("textarea, input[type='text']")
      .first();
  }

  rejectReasonOption(name: RegExp): Locator {
    return this.page.getByRole("option", { name }).first();
  }

  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Delegation ───────────────────────────────────────────────────────
  manageDelegationsButton(): Locator {
    return this.page.getByRole("button", { name: /manage delegations/i }).first();
  }

  newDelegationButton(): Locator {
    return this.page.getByRole("button", { name: /new delegation/i }).first();
  }

  delegateUserInput(): Locator {
    return this.page.getByLabel(/delegate user/i).first();
  }

  createDelegationButton(): Locator {
    return this.page.getByRole("button", { name: /create delegation/i }).first();
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
