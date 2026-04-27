import type { Page, Locator } from "@playwright/test";

export const LIST_PATH = "/store-operation/store-requisition";
export const NEW_PATH = "/store-operation/store-requisition/new";

export class StoreRequisitionPage {
  constructor(private page: Page) {}

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
  newRequisitionButton(): Locator {
    return this.page.getByRole("button", { name: /new requisition|^new$|^create$/i }).first();
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  filterButton(): Locator {
    return this.page.getByRole("button", { name: /^filter$/i }).first();
  }

  sortByButton(): Locator {
    return this.page.getByRole("button", { name: /sort by/i }).first();
  }

  bulkActionsButton(): Locator {
    return this.page.getByRole("button", { name: /bulk actions/i }).first();
  }

  bulkActionItem(name: RegExp | string): Locator {
    return this.page.getByRole("menuitem", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  delegateApprovalsButton(): Locator {
    return this.page.getByRole("button", { name: /delegate approvals/i }).first();
  }

  pendingApprovalsBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /pending/i })
      .first();
  }

  emptyState(): Locator {
    return this.page.getByText(/no.*pending|no.*requisition|empty|ไม่พบ/i).first();
  }

  // ── Header form ──────────────────────────────────────────────────────
  expectedDeliveryDateInput(): Locator {
    return this.page.getByLabel(/expected delivery date/i).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/description|purpose/i).first();
  }

  requestFromTrigger(): Locator {
    return this.page.getByLabel(/request from|source location/i).first();
  }

  emergencyCheckbox(): Locator {
    return this.page.getByRole("checkbox", { name: /mark as emergency|emergency/i }).first();
  }

  emergencyJustificationInput(): Locator {
    return this.page.getByLabel(/emergency justification|justification/i).first();
  }

  // ── Items ────────────────────────────────────────────────────────────
  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item/i }).first();
  }

  itemSearchInput(): Locator {
    return this.page.getByPlaceholder(/search.*item|search.*product/i).first();
  }

  itemOption(name: string): Locator {
    return this.page.getByRole("option", { name }).first();
  }

  requestedQuantityInput(): Locator {
    return this.page.getByLabel(/requested quantity|^quantity$/i).first();
  }

  // ── Actions ──────────────────────────────────────────────────────────
  saveAsDraftButton(): Locator {
    return this.page.getByRole("button", { name: /save as draft|save draft/i }).first();
  }

  saveAndCloseButton(): Locator {
    return this.page.getByRole("button", { name: /save and close/i }).first();
  }

  submitForApprovalButton(): Locator {
    return this.page.getByRole("button", { name: /submit for approval/i }).first();
  }

  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$/i }).first();
  }

  rejectButton(): Locator {
    return this.page.getByRole("button", { name: /^reject$/i }).first();
  }

  requestReviewButton(): Locator {
    return this.page.getByRole("button", { name: /request review/i }).first();
  }

  recordIssuanceButton(): Locator {
    return this.page.getByRole("button", { name: /record issuance/i }).first();
  }

  issueButton(): Locator {
    return this.page.getByRole("button", { name: /^issue$/i }).first();
  }

  editApprovalMenuItem(): Locator {
    return this.page.getByRole("menuitem", { name: /edit approval/i }).first();
  }

  itemActionMenu(): Locator {
    return this.page.getByRole("button", { name: /actions|more|menu|three dots/i }).first();
  }

  // ── Confirmation dialog ──────────────────────────────────────────────
  reasonInput(): Locator {
    return this.page
      .getByRole("dialog")
      .locator("textarea, input[type='text']")
      .first();
  }

  confirmDialogButton(name: RegExp = /confirm|approve|reject|ok|yes|submit|issue/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Verification ─────────────────────────────────────────────────────
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|in.progress|approved|rejected|complete|ready.*issuance/i })
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
