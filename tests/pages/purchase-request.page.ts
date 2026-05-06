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
    return this.page.getByRole("button", { name: /new purchase request|create purchase request|create new|new pr|^new$|^create$/i }).first();
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
    const row = this.prRow(refOrText);
    await row.waitFor({ state: "visible", timeout: 10_000 });
    const link = row.getByRole("link").first();
    if ((await link.count()) > 0) {
      await link.click();
    } else {
      const button = row.getByRole("button").first();
      if ((await button.count()) > 0) {
        await button.click();
      } else {
        await row.click();
      }
    }
    await this.page.waitForLoadState("networkidle");
  }

  // ── List filters / search / sort / tabs ──────────────────────────────
  async searchFor(text: string) {
    const input = this.searchInput();
    await input.fill(text);
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

  tabMyPending(): Locator {
    return this.page.getByRole("tab", { name: /my pending|my pr/i }).first();
  }

  tabAllDocuments(): Locator {
    return this.page.getByRole("tab", { name: /all documents|^all$/i }).first();
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
    return this.page.locator("#pr-description, [name='description'], textarea[aria-label*='description' i]").first();
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

  async fillHeader(data: PRHeaderInput) {
    if (data.prType) await this.setPRType(data.prType);
    if (data.deliveryDate !== undefined) {
      const di = this.deliveryDateInput();
      if ((await di.count()) > 0) await di.fill(data.deliveryDate);
    }
    if (data.description !== undefined) {
      const d = this.descriptionInput();
      if ((await d.count()) > 0) await d.fill(data.description);
    }
    if (data.justification !== undefined) {
      const j = this.justificationInput();
      if ((await j.count()) > 0) await j.fill(data.justification);
    }
    if (data.notes !== undefined) {
      const n = this.notesInput();
      if ((await n.count()) > 0) await n.fill(data.notes);
    }
    if (data.internalNotes !== undefined) {
      const n = this.internalNotesInput();
      if ((await n.count()) > 0) await n.fill(data.internalNotes);
    }
    if (data.hidePrice !== undefined) {
      const t = this.hidePriceToggle();
      if ((await t.count()) > 0) {
        const checked = await t.getAttribute("aria-checked");
        if ((checked === "true") !== data.hidePrice) await t.click();
      }
    }
  }

  // ── Form (line items) ─────────────────────────────────────────────────
  addItemButton(): Locator {
    return this.page.getByRole("button", { name: /add item|add line item|^add$/i }).first();
  }

  itemRow(index: number): Locator {
    return this.page.getByRole("row").filter({ has: this.page.locator("input,button") }).nth(index);
  }

  async addLineItem(data: PRLineItemInput) {
    await this.addItemButton().click();
    // The product / item editor may render in a slide-over or inline — try both
    if (data.product !== undefined) {
      const productInput = this.page.getByLabel(/product|item/i).first();
      if ((await productInput.count()) > 0) await productInput.fill(data.product);
      const option = this.page.getByRole("option").filter({ hasText: data.product }).first();
      if ((await option.count()) > 0) await option.click({ timeout: 5_000 }).catch(() => {});
    }
    if (data.description !== undefined) {
      const d = this.page.getByLabel(/item description/i).first();
      if ((await d.count()) > 0) await d.fill(data.description);
    }
    if (data.quantity !== undefined) {
      const q = this.page.getByLabel(/^quantity$|^qty$/i).first();
      if ((await q.count()) > 0) await q.fill(String(data.quantity));
    }
    if (data.uom !== undefined) {
      const u = this.page.getByLabel(/uom|unit of measure/i).first();
      if ((await u.count()) > 0) await u.fill(data.uom);
    }
    if (data.vendor !== undefined) {
      const v = this.page.getByLabel(/vendor/i).first();
      if ((await v.count()) > 0) await v.fill(data.vendor);
    }
    if (data.isFOC) {
      const foc = this.page.getByRole("checkbox", { name: /foc/i }).first();
      if ((await foc.count()) > 0) await foc.check({ force: true });
    }
    if (data.unitPrice !== undefined) {
      const p = this.page.getByLabel(/unit price/i).first();
      if ((await p.count()) > 0) await p.fill(String(data.unitPrice));
    }
    if (data.discount !== undefined) {
      const d = this.page.getByLabel(/discount/i).first();
      if ((await d.count()) > 0) await d.fill(String(data.discount));
    }
    if (data.taxRate !== undefined) {
      const t = this.page.getByLabel(/tax rate|tax/i).first();
      if ((await t.count()) > 0) await t.fill(String(data.taxRate));
    }
    const saveItem = this.page.getByRole("button", { name: /^save$|^add$|confirm/i }).last();
    if ((await saveItem.count()) > 0) await saveItem.click({ timeout: 5_000 }).catch(() => {});
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
}
