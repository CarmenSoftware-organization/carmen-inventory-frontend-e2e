import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export const LIST_PATH = "/procurement/purchase-request";
export const NEW_PATH = "/procurement/purchase-request/new";
export const APPROVALS_PATH = "/procurement/purchase-requests/my-approvals";

export type PRType = "general" | "asset" | "service";

export interface PRLineItemInput {
  product?: string;
  description?: string;
  quantity?: number | string;
  uom?: string;
  vendor?: string;
  unitPrice?: number | string;
  discount?: number | string;
  taxRate?: number | string;
  isFOC?: boolean;
}

export interface PRHeaderInput {
  prType?: PRType;
  deliveryDate?: string;
  description?: string;
  justification?: string;
  notes?: string;
  internalNotes?: string;
  hidePrice?: boolean;
}

export class PurchaseRequestPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoApprovals() {
    await this.page.goto(APPROVALS_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── List page ────────────────────────────────────────────────────────
  newButton(): Locator {
    // Redesigned list toolbar button is "Add Request".
    return this.page.getByRole("button", { name: /add request|new purchase request|create purchase request|^add$|^new$|^create$/i }).first();
  }

  bulkActionsTrigger(): Locator {
    return this.page.getByRole("button", { name: /bulk actions/i }).first();
  }

  bulkActionItem(name: RegExp | string): Locator {
    return this.page.getByRole("menuitem", { name: typeof name === "string" ? new RegExp(name, "i") : name });
  }

  prRow(refOrText: string): Locator {
    return this.page.getByRole("row").filter({ hasText: refOrText }).first();
  }

  rowCheckbox(refOrText: string): Locator {
    return this.prRow(refOrText).getByRole("checkbox").first();
  }

  async openPR(refOrText: string) {
    // The list renders as a table OR cards depending on viewMode/build. Find the
    // container holding the ref text and click its name link/button, falling back
    // to the container itself; navigation goes to /purchase-request/<id>.
    const row = this.prRow(refOrText);
    const card = this.page
      .locator("[data-slot='card'], article")
      .filter({ hasText: refOrText })
      .first();
    const target = (await row.count()) > 0 ? row : card;
    await target.waitFor({ state: "visible", timeout: 10_000 });
    const link = target.getByRole("link").first();
    const button = target.getByRole("button", { name: new RegExp(refOrText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }).first();
    if ((await link.count()) > 0) {
      await link.click();
    } else if ((await button.count()) > 0) {
      await button.click();
    } else {
      await target.click();
    }
    await this.page.waitForLoadState("networkidle");
  }

  // ── List filters / search / sort / tabs ──────────────────────────────
  async searchFor(text: string) {
    const input = this.searchInput();
    await input.fill(text);
    await input.press("Enter"); // SearchInput fires onSearch on Enter
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  async applyFilter(opts: { status?: string }) {
    await this.filterButton().click();
    if (opts.status) {
      const trigger = this.page
        .getByRole("dialog")
        .getByLabel(/status/i)
        .first()
        .or(this.page.getByLabel(/status/i).first());
      if ((await trigger.count()) > 0) {
        await trigger.click();
        await this.page.getByRole("option", { name: new RegExp(opts.status, "i") }).first().click();
      }
    }
    const apply = this.page.getByRole("button", { name: /^apply$|^ok$/i }).first();
    if ((await apply.count()) > 0) await apply.click({ timeout: 5_000 }).catch(() => {});
  }

  async sortBy(column: string) {
    const header = this.page.getByRole("columnheader", { name: new RegExp(column, "i") }).first();
    if ((await header.count()) > 0) await header.click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // Redesigned list uses viewMode <Button>s, not Radix tabs.
  tabMyPending(): Locator {
    return this.page.getByRole("button", { name: /my pending|my pr/i }).first();
  }

  tabAllDocuments(): Locator {
    return this.page.getByRole("button", { name: /all documents?|^all$/i }).first();
  }

  // ── Create dialog (list "Create Purchase Request" entry) ──────────────
  createDialogBlankOption(): Locator {
    return this.page.getByRole("button", { name: /blank|empty|start.*scratch|new pr/i }).first();
  }

  async openCreateDialog() {
    await this.newButton().click();
    // Dialog may auto-open or navigate directly to /new — handle both
    const dialog = this.page.getByRole("dialog");
    if ((await dialog.count()) > 0) {
      await this.createDialogBlankOption().click({ timeout: 5_000 }).catch(() => {});
    }
    await this.page.waitForURL(/purchase-request\/new/, { timeout: 10_000 }).catch(() => {});
  }

  // ── Form (header) ─────────────────────────────────────────────────────
  prTypeTrigger(): Locator {
    return this.page.getByLabel(/pr type|type/i).first();
  }

  descriptionInput(): Locator {
    // Scope to the textarea — [name='description'] also matches <meta name="description">.
    return this.page.locator("textarea#pr-description").first();
  }

  justificationInput(): Locator {
    return this.page.locator("#pr-justification, [name='justification'], textarea[aria-label*='justification' i]").first();
  }

  deliveryDateInput(): Locator {
    return this.page.getByLabel(/delivery date|required date/i).first();
  }

  hidePriceToggle(): Locator {
    return this.page.getByRole("switch", { name: /hide price/i }).first();
  }

  notesInput(): Locator {
    return this.page.getByLabel(/^notes$/i).first();
  }

  internalNotesInput(): Locator {
    return this.page.getByLabel(/internal notes/i).first();
  }

  async setPRType(type: PRType) {
    const trigger = this.prTypeTrigger();
    if ((await trigger.count()) === 0) return;
    await trigger.click();
    const labelMap: Record<PRType, RegExp> = {
      general: /general/i,
      asset: /asset/i,
      service: /service/i,
    };
    await this.page.getByRole("option", { name: labelMap[type] }).first().click();
  }

  /** Open a lookup trigger (button/combobox) and pick the first option. Capped
   *  wait so a still-disabled cascading trigger doesn't eat the whole timeout. */
  private async pickFirstInCombobox(trigger: Locator): Promise<boolean> {
    if ((await trigger.count()) === 0) return false;
    try {
      await trigger.click({ timeout: 8_000 });
    } catch {
      return false;
    }
    // Let the popover open + options load (Radix Select items = role="option";
    // LookupCombobox items = <button aria-pressed>). Pick the first visible item.
    await this.page.waitForTimeout(800);
    const item = this.page
      .locator('[role="option"]:visible, button[aria-pressed]:visible')
      .first();
    if ((await item.count()) === 0) {
      await this.page.keyboard.press("Escape").catch(() => {});
      return false;
    }
    await item.click({ timeout: 5_000 });
    return true;
  }

  /**
   * Workflow Select on the /new general fields (required — "Add Item" is disabled
   * until a workflow is chosen). On the blank create form it is the only/first
   * combobox. Picks the first workflow option.
   */
  async selectFirstWorkflow(): Promise<boolean> {
    const trigger = this.page.getByRole("combobox").first();
    return await this.pickFirstInCombobox(trigger);
  }

  async fillHeader(data: PRHeaderInput) {
    // Redesigned create form header is just: workflow (required) + description.
    await this.selectFirstWorkflow().catch(() => {});
    if (data.description !== undefined) {
      const d = this.descriptionInput();
      if ((await d.count()) > 0) await d.fill(data.description);
    }
  }

  // ── Form (line items) ─────────────────────────────────────────────────
  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item|add line item|^add$/i }).first();
  }

  itemRow(index: number): Locator {
    return this.page.getByRole("row").filter({ has: this.page.locator("input,button") }).nth(index);
  }

  /** The row in the item datagrid for field-array index (rows are prepended → 0 = newest). */
  itemRowByIndex(index: number): Locator {
    return this.page
      .locator("tr")
      .filter({ has: this.page.locator(`input[name="items.${index}.requested_qty"]`) })
      .first();
  }

  async addLineItem(data: PRLineItemInput) {
    // Redesigned editor: "Add Item" prepends a blank row (index 0) in an editable
    // datagrid; product is gated on a location, so set location → product → qty.
    await this.addItemButton().click();
    const qtyInput = this.page.locator('input[name="items.0.requested_qty"]').first();
    await qtyInput.waitFor({ state: "visible", timeout: 10_000 });

    // Cascading "Select X" button triggers (page-level .first() targets the newest
    // prepended row): location enables product → product enables unit. A valid item
    // needs location, product, qty, unit + delivery point (currency auto-fills from
    // the BU; selecting a location auto-fills delivery point; delivery date defaults
    // to tomorrow). Playwright's click auto-waits for each to enable.
    await this.pickFirstInCombobox(this.page.getByRole("button", { name: /select location/i }).first()).catch(() => {});
    if (data.product !== undefined) {
      await this.pickFirstInCombobox(this.page.getByRole("button", { name: /select product/i }).first()).catch(() => {});
    }
    if (data.quantity !== undefined) {
      await qtyInput.fill(String(data.quantity));
    }
    // Picking a product clears requested_unit_id — choose a unit.
    await this.pickFirstInCombobox(this.page.getByRole("button", { name: /select unit/i }).first()).catch(() => {});
    await this.pickFirstInCombobox(this.page.getByRole("button", { name: /select delivery point/i }).first()).catch(() => {});
    if (data.isFOC) {
      const foc = this.page.getByRole("checkbox", { name: /foc/i }).first();
      if ((await foc.count()) > 0) await foc.check({ force: true }).catch(() => {});
    }
    // No per-item Save in the inline datagrid — the row persists with the form.
  }

  // ── Form actions ──────────────────────────────────────────────────────
  saveDraftButton(): Locator {
    return this.page.getByRole("button", { name: /save as draft|save draft|^save$/i }).first();
  }

  submitButton(): Locator {
    return this.page.getByRole("button", { name: /submit for approval|^submit$/i }).first();
  }

  cancelFormButton(): Locator {
    return this.page.getByRole("button", { name: /^cancel$/i }).first();
  }

  // ── Detail page actions ───────────────────────────────────────────────
  approveButton(): Locator {
    return this.page.getByRole("button", { name: /^approve$|purchase approve/i }).first();
  }

  rejectButton(): Locator {
    return this.page.getByRole("button", { name: /^reject$/i }).first();
  }

  sendBackButton(): Locator {
    return this.page.getByRole("button", { name: /send back|return for revision|^return$/i }).first();
  }

  recallButton(): Locator {
    return this.page.getByRole("button", { name: /^recall$/i }).first();
  }

  cancelPRButton(): Locator {
    return this.page.getByRole("button", { name: /cancel pr|void/i }).first();
  }

  convertToPOButton(): Locator {
    return this.page.getByRole("button", { name: /convert to po|create po/i }).first();
  }

  saveAsTemplateButton(): Locator {
    return this.page.getByRole("button", { name: /save as template/i }).first();
  }

  splitButton(): Locator {
    return this.page.getByRole("button", { name: /^split$/i }).first();
  }

  // ── Confirmation dialog (rejection / return / cancel) ─────────────────
  reasonInput(): Locator {
    return this.page
      .getByRole("dialog")
      .locator("textarea, input[type='text']")
      .first();
  }

  confirmDialogButton(name: RegExp = /confirm|ok|yes/i): Locator {
    return this.page.getByRole("dialog").getByRole("button", { name }).first();
  }

  // ── Status / verification ─────────────────────────────────────────────
  // override: filters to PR-specific status text
  statusBadge(): Locator {
    return this.page
      .locator("[data-slot='badge'], [class*='badge']")
      .filter({ hasText: /draft|in.progress|approved|void|completed|returned|rejected|cancelled/i })
      .first();
  }

  async expectSavedToast() {
    await expect(
      this.page
        .locator('[data-sonner-toast], [role="status"], [role="alert"]')
        .filter({ hasText: /success|saved|created|updated|approved|rejected|submitted|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }

  // ── Detail page tabs ─────────────────────────────────────────────────
  tabItems(): Locator {
    return this.page.getByRole("tab", { name: /^items$/i }).first();
  }

  tabWorkflowHistory(): Locator {
    return this.page.getByRole("tab", { name: /workflow history|workflow/i }).first();
  }

  // ── Edit mode ────────────────────────────────────────────────────────
  editModeButton(): Locator {
    return this.page.getByRole("button", { name: /^edit$|edit pr|edit mode/i }).first();
  }

  async enterEditMode() {
    await this.editModeButton().click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  async cancelEditMode() {
    await this.cancelFormButton().click({ timeout: 5_000 }).catch(() => {});
  }

  // ── Line item mutation ───────────────────────────────────────────────
  async removeLineItem(index: number) {
    const row = this.itemRow(index);
    const remove = row.getByRole("button", { name: /remove|delete|trash/i }).first();
    if ((await remove.count()) > 0) await remove.click();
  }

  async editLineItem(index: number, fields: PRLineItemInput) {
    const row = this.itemRow(index);
    const editBtn = row.getByRole("button", { name: /edit/i }).first();
    if ((await editBtn.count()) > 0) {
      await editBtn.click();
      await this.page.waitForLoadState("domcontentloaded").catch(() => {});
    }
    if (fields.quantity !== undefined) {
      const q = this.page.getByLabel(/^quantity$|^qty$/i).first();
      if ((await q.count()) > 0) await q.fill(String(fields.quantity));
    }
    if (fields.description !== undefined) {
      const d = this.page.getByLabel(/item description/i).first();
      if ((await d.count()) > 0) await d.fill(fields.description);
    }
    const save = this.page.getByRole("button", { name: /^save$|^update$/i }).last();
    if ((await save.count()) > 0) await save.click({ timeout: 5_000 }).catch(() => {});
  }

  // ── Template picker (Step 3) ─────────────────────────────────────────
  createDialogTemplateOption(): Locator {
    return this.page.getByRole("button", { name: /from template|use template|template/i }).first();
  }

  // NOTE: dialog vs listbox shape is speculative — adjust once Step 3 UI is confirmed.
  templatePicker(): Locator {
    return this.page.getByRole("dialog").or(this.page.getByRole("listbox")).first();
  }

  templatePickerEmpty(): Locator {
    return this.templatePicker().getByText(/no templates|empty|none available/i).first();
  }

  async selectFirstTemplate() {
    const options = this.templatePicker().getByRole("option");
    const links = this.templatePicker().getByRole("link");
    if ((await options.count()) > 0) {
      await options.first().click();
    } else if ((await links.count()) > 0) {
      await links.first().click();
    }
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Status assertion ─────────────────────────────────────────────────
  async expectStatus(status: string) {
    await expect(
      this.page
        .locator("[data-slot='badge'], [class*='badge']")
        .filter({ hasText: new RegExp(status, "i") })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  }

  // ── Edit-mode bulk toolbar (Approver actions) ─────────────────────────────────────────────────
  // The live UI exposes Approve / Reject / Send for Review / Split only as
  // bulk-toolbar actions in Edit Mode (BRD discrepancy: no per-row buttons).
  // The toolbar appears after at least one row is selected via Select All
  // or per-row checkboxes.
  bulkActionToolbar(): Locator {
    return this.page
      .locator("[data-slot='toolbar'], [role='toolbar']")
      .filter({ has: this.page.getByRole("button", { name: /approve|reject|review|split/i }) })
      .first();
  }

  selectAllCheckboxInEditMode(): Locator {
    return this.page
      .getByRole("checkbox", { name: /select all|^all$/i })
      .first();
  }

  async selectAllInEditMode() {
    const cb = this.selectAllCheckboxInEditMode();
    if ((await cb.count()) > 0) await cb.check({ force: true });
  }

  bulkApproveInEditMode(): Locator {
    return this.bulkActionToolbar().getByRole("button", { name: /^approve$|purchase approve/i }).first();
  }

  bulkRejectInEditMode(): Locator {
    return this.bulkActionToolbar().getByRole("button", { name: /^reject$/i }).first();
  }

  bulkSendForReviewInEditMode(): Locator {
    return this.bulkActionToolbar().getByRole("button", { name: /send for review|return for revision/i }).first();
  }

  bulkSplitInEditMode(): Locator {
    return this.bulkActionToolbar().getByRole("button", { name: /^split$/i }).first();
  }

  // ── Edit-mode editable fields (Approver Edit Mode per FR-PR-011A) ─────
  approvedQtyInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/approved.*(qty|quantity)/i).first();
  }

  itemNoteInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/item note|note/i).first();
  }

  deliveryPointInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/delivery point/i).first();
  }

  // ── Edit-mode read-only fields (Approver cannot edit per FR-PR-011A) ──
  // Returns the cell/input element; tests assert it has [disabled], [readonly],
  // or is a non-input element (e.g. a span).
  vendorReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/vendor/i).first();
  }

  unitPriceReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/unit price/i).first();
  }

  discountReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/discount/i).first();
  }

  taxReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/tax/i).first();
  }

  focQtyReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/foc.*qty|free.*charge/i).first();
  }

  // ── Edit-mode editable fields (Purchaser scope per FR-PR-011A) ────────
  // Purchaser allocates vendor + pricing in Edit Mode. These locators
  // target the SAME DOM cells as the *ReadOnlyCell methods above; tests
  // assert toBeEditable() here vs toBeDisabled() on the read-only ones.
  vendorInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/vendor/i).first();
  }

  unitPriceInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/unit price/i).first();
  }

  discountInput(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/discount/i).first();
  }

  taxProfileSelect(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/tax/i).first();
  }

  autoAllocateButton(): Locator {
    return this.page.getByRole("button", { name: /auto allocate/i }).first();
  }

  // ── Read-only verification (Purchaser cannot edit Approved Qty) ───────
  approvedQtyReadOnlyCell(rowIndex: number): Locator {
    return this.itemRow(rowIndex).getByLabel(/approved.*(qty|quantity)/i).first();
  }
}
