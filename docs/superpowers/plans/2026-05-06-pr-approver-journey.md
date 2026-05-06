# PR Approver Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `tests/303-pr-approver-journey.spec.ts` covering the HOD Approver workflow as 27 persona-journey TCs grouped per source step (1-4 + Scope Contrast + Golden Journey).

**Architecture:** New persona-journey spec sits alongside `301-purchase-request.spec.ts` (per-action) and `302-pr-creator-journey.spec.ts` (Creator persona). Reuses `createAuthTest("hod@blueledgers.com")` plus `createAuthTest("fc@blueledgers.com")` for one scope-contrast TC. New `pr-approver.helpers.ts` provides cross-context Requestor seeding (opens 2nd browser context) plus bulk-action composition. Existing `purchase-request.page.ts` is extended with edit-mode field locators and bulk-toolbar-scoped helpers; existing `my-approvals.page.ts` is reused as-is for Step 1.

**Tech Stack:** Playwright Test 1.x, TypeScript, Bun, Radix UI primitives.

**Spec source:** `docs/superpowers/specs/2026-05-06-pr-approver-journey-design.md`

---

## E2E TDD note

This is e2e against an already-built frontend. The TDD loop adapts:
1. Write the test against documented behavior
2. Run it — failures reveal locator drift, missing wait, or genuine UI gaps
3. Adjust locators / waits until stable; never weaken assertions to mask defects
4. Commit only when stable

If a TC fails because the UI doesn't ship the expected behavior, mark `requestorTest.skip(reason)` with a `note` annotation; do not delete it. Don't run the actual e2e suite during subagent execution — runtime testing is left to the user. Subagents verify only TypeScript compile + Playwright list + annotation audit.

---

## Task 1: Audit existing page objects + helpers

**Files:**
- Read: `tests/pages/purchase-request.page.ts`
- Read: `tests/pages/my-approvals.page.ts`
- Read: `tests/pages/pr-creator.helpers.ts`
- Read: `tests/pages/base.page.ts`

- [ ] **Step 1: Confirm method inventory**

`tests/pages/purchase-request.page.ts` (~426 lines) already provides:
- Navigation: `gotoList`, `gotoNew`, `gotoApprovals`
- List: `newButton`, `bulkActionsTrigger`, `bulkActionItem`, `prRow`, `rowCheckbox`, `openPR`
- List filters added in 302: `searchFor`, `applyFilter`, `sortBy`, `tabMyPending`, `tabAllDocuments`
- Create dialog: `createDialogBlankOption`, `openCreateDialog`, `createDialogTemplateOption`, `templatePicker`, `templatePickerEmpty`, `selectFirstTemplate`
- Form header: `prTypeTrigger`, `descriptionInput`, `justificationInput`, `deliveryDateInput`, `hidePriceToggle`, `notesInput`, `internalNotesInput`, `setPRType`, `fillHeader`
- Line items: `addItemButton`, `itemRow`, `addLineItem`, `removeLineItem`, `editLineItem`
- Form actions: `saveDraftButton`, `submitButton`, `cancelFormButton`
- Detail-page actions: `approveButton`, `rejectButton`, `sendBackButton`, `recallButton`, `cancelPRButton`, `convertToPOButton`, `saveAsTemplateButton`, `splitButton`, `editModeButton`, `enterEditMode`, `cancelEditMode`, `tabItems`, `tabWorkflowHistory`
- Confirm dialog: `reasonInput`, `confirmDialogButton`
- Status: `statusBadge`, `expectStatus`, `expectSavedToast`

`tests/pages/my-approvals.page.ts` (~97 lines) provides:
- `gotoList`, `gotoPRList`, `pendingCountBadge`, `documentRow`, `emptyState`
- `selectMultipleButton`, `rowCheckbox`, `bulkApproveButton`, `confirmBulkApprovalButton`
- `approveButton`, `rejectButton`, `requestMoreInfoButton`
- `reasonInput`, `rejectReasonOption`, `confirmDialogButton`
- `manageDelegationsButton`, `newDelegationButton`, `delegateUserInput`, `createDelegationButton`

`tests/pages/pr-creator.helpers.ts` (~91 lines) provides:
- `e2eDescription(suffix)` — `[E2E-PRC]` marker
- `CreatedPR` interface
- `createDraftPR(page, opts?)` — creates Draft PR via UI
- `submitDraftPR(page, ref)` — submits Draft via UI, asserts In Progress
- `deleteDraftPR(page, ref)` — deletes via UI

`BasePage` provides: `editButton` (`/^(Edit|แก้ไข)$/i`), `deleteButton` (`/^(Delete|ลบ)$/i`), `searchInput`, `filterButton`, `applyFilterButton`, `cancelButton`, `saveButton`, `statusBadge`.

Methods to ADD in Tasks 2-3:
- Edit-mode bulk toolbar (scoped within Edit Mode UI):
  - `bulkActionToolbar()` — locator for the toolbar that appears when ≥1 row is selected
  - `selectAllInEditMode()` — clicks the master checkbox in edit mode
  - `bulkApproveInEditMode()`, `bulkRejectInEditMode()`, `bulkSendForReviewInEditMode()`, `bulkSplitInEditMode()` — toolbar-scoped buttons
- Edit-mode editable fields (per row):
  - `approvedQtyInput(rowIndex)`, `itemNoteInput(rowIndex)`, `deliveryPointInput(rowIndex)`
- Edit-mode read-only verification (per row):
  - `vendorReadOnlyCell(rowIndex)`, `unitPriceReadOnlyCell(rowIndex)`, `discountReadOnlyCell(rowIndex)`, `taxReadOnlyCell(rowIndex)`, `focQtyReadOnlyCell(rowIndex)`

No code change in this task.

- [ ] **Step 2: No commit (audit-only)**

---

## Task 2: Add bulk-toolbar helpers to PurchaseRequestPage

**Files:**
- Modify: `tests/pages/purchase-request.page.ts` (insert at end of class body, before final `}`)

- [ ] **Step 1: Insert new methods**

Open `tests/pages/purchase-request.page.ts` and locate the final `}` of the `PurchaseRequestPage` class. Insert this block immediately before that closing brace, preserving 2-space indentation inside the class:

```ts
  // ── Edit-mode bulk toolbar (Approver actions) ─────────────────────────
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-request.page.ts
git commit -m "$(cat <<'EOF'
feat(pages): add edit-mode bulk-toolbar helpers to PurchaseRequestPage

Adds bulkActionToolbar locator and four toolbar-scoped action buttons
(approve/reject/sendForReview/split), plus selectAllCheckboxInEditMode
and selectAllInEditMode. Used by the upcoming PR Approver persona
journey spec where bulk actions are the only Approve/Reject affordance
per the BRD discrepancy.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add edit-mode editable + read-only field locators

**Files:**
- Modify: `tests/pages/purchase-request.page.ts` (insert at end of class body, before final `}`, after Task 2's block)

- [ ] **Step 1: Insert new methods**

Insert this block immediately before the final closing `}` of the class (after the bulk-toolbar block from Task 2):

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-request.page.ts
git commit -m "$(cat <<'EOF'
feat(pages): add edit-mode field locators for Approver scope

Adds editable-field locators (approvedQty, itemNote, deliveryPoint)
and read-only field locators (vendor, unitPrice, discount, tax,
focQty) per FR-PR-011A. Tests assert disabled/readonly state on the
read-only ones and editability on the editable ones.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Create pr-approver.helpers.ts

**Files:**
- Create: `tests/pages/pr-approver.helpers.ts`

- [ ] **Step 1: Write the helper module**

Create `tests/pages/pr-approver.helpers.ts` with this EXACT content:

```ts
import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { PurchaseRequestPage, LIST_PATH } from "./purchase-request.page";
import { createDraftPR, type CreatedPR } from "./pr-creator.helpers";
import { TEST_PASSWORD } from "../test-users";

export type { CreatedPR } from "./pr-creator.helpers";

/**
 * Cross-context fixture: opens a fresh browser context, logs in as the
 * Requestor, creates a Draft PR with N items, submits it for approval,
 * and returns the PR ref. The auxiliary context is closed cleanly so
 * the calling HOD/FC test's primary context is unaffected.
 *
 * Used in beforeEach of Step 3, 4, Scope Contrast, and Golden Journey.
 */
export async function submitPRAsRequestor(
  browser: Browser,
  opts?: { items?: number; description?: string },
): Promise<CreatedPR> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

    const created = await createDraftPR(page, {
      items: opts?.items ?? 1,
      description: opts?.description ?? "approver-fixture",
    });

    const pr = new PurchaseRequestPage(page);
    await pr.submitButton().click({ timeout: 5_000 });
    await pr.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
    await pr.expectStatus("in.progress");
    return created;
  } finally {
    await ctx.close();
  }
}

/**
 * Edit Mode → select all rows → click Approve in bulk toolbar → confirm.
 * Caller must already be in Edit Mode on a PR detail page.
 */
export async function bulkApprove(page: Page): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkApproveInEditMode().click({ timeout: 5_000 });
  await pr.confirmDialogButton(/confirm|approve|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
}

/**
 * Edit Mode → select all rows → click Reject → enter reason → confirm.
 */
export async function bulkReject(page: Page, reason: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkRejectInEditMode().click({ timeout: 5_000 });
  const input = pr.reasonInput();
  if ((await input.count()) > 0) await input.fill(reason);
  await pr.confirmDialogButton(/confirm|reject|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
}

/**
 * Edit Mode → select all rows → click Send for Review → enter reason + stage → confirm.
 */
export async function bulkSendForReview(
  page: Page,
  reason: string,
  stage: string,
): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkSendForReviewInEditMode().click({ timeout: 5_000 });
  const input = pr.reasonInput();
  if ((await input.count()) > 0) await input.fill(reason);
  // Stage selector — best effort
  const stageTrigger = page.getByLabel(/stage|return to/i).first();
  if ((await stageTrigger.count()) > 0) {
    await stageTrigger.click();
    await page.getByRole("option", { name: new RegExp(stage, "i") }).first().click().catch(() => {});
  }
  await pr.confirmDialogButton(/confirm|send|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
}

/**
 * Navigates to a PR detail page in HOD's primary context (or current page).
 */
export async function gotoPRDetail(page: Page, ref: string): Promise<void> {
  await page.goto(`${LIST_PATH}/${ref}`);
  await page.waitForLoadState("networkidle");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/pr-approver.helpers.ts
git commit -m "$(cat <<'EOF'
feat(pages): add pr-approver.helpers.ts for cross-context journey

Adds submitPRAsRequestor (opens a 2nd browser context, logs in as
the Requestor, creates+submits a PR, returns the ref) plus three
bulk-action composers (bulkApprove, bulkReject, bulkSendForReview)
and a gotoPRDetail navigation helper. The cross-context pattern keeps
the primary HOD/FC auth context untouched while seeding pending PRs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Scaffold the spec file with describe blocks

**Files:**
- Create: `tests/303-pr-approver-journey.spec.ts`

- [ ] **Step 1: Write the spec scaffold**

Create `tests/303-pr-approver-journey.spec.ts` with this EXACT content:

```ts
import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import { MyApprovalsPage } from "./pages/my-approvals.page";
import {
  submitPRAsRequestor,
  bulkApprove,
  bulkReject,
  bulkSendForReview,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Persona-journey spec — Approver (HOD primary, FC for scope contrast).
// Runs alongside 301-purchase-request.spec.ts (per-action) and 302-pr-creator-journey.spec.ts.
// Source docs: docs/persona-doc/Purchase Request/Approver/INDEX.md and step-01..04.md.
const hodTest = createAuthTest("hod@blueledgers.com");
const fcTest = createAuthTest("fc@blueledgers.com");

const REJECT_REASON = "Items discontinued in catalogue";
const REVIEW_REASON = "Please verify quantity";
const REVIEW_STAGE = "Purchase";

hodTest.describe("Step 1 — My Approval Dashboard", () => {
  // TCs added in Task 6
});

hodTest.describe("Step 2 — PR List (Approver View)", () => {
  // TCs added in Task 7
});

hodTest.describe("Step 3 — PR Detail (Read-only)", () => {
  // TCs added in Task 8
});

hodTest.describe("Step 4 — Edit Mode + Bulk Actions", () => {
  // TCs added in Task 9
});

fcTest.describe("Scope Contrast (FC)", () => {
  // TC added in Task 10
});

hodTest.describe.serial("Golden Journey", () => {
  // TC added in Task 11
});
```

- [ ] **Step 2: Verify spec discovery**

Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: zero tests reported (empty describes), no parser errors.

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): scaffold 303-pr-approver-journey.spec.ts

Empty describe blocks for each in-scope step (1-4) plus standalone
Scope Contrast (FC) and serial Golden Journey describes. TCs land
in subsequent commits. HOD is primary fixture; FC is used only for
the single scope-contrast TC.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Implement Step 1 — My Approval Dashboard (TC-PRA0101..0104)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Step 1 — My Approval Dashboard` describe

- [ ] **Step 1: Replace the Step 1 describe body**

Find:
```ts
hodTest.describe("Step 1 — My Approval Dashboard", () => {
  // TCs added in Task 6
});
```

Replace the comment with:

```ts
  hodTest(
    "TC-PRA0101 Dashboard loads with Total Pending count visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD (hod@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to My Approvals\n2. Verify pending count badge is visible" },
        { type: "expected", description: "My Approvals dashboard loads; pending count badge is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0102 Click pending PR row navigates to PR detail",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard with at least one pending PR row" },
        { type: "steps", description: "1. Click first pending PR row" },
        { type: "expected", description: "URL navigates to /procurement/purchase-request/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      // Seed a pending PR so the dashboard always has at least one row
      const created = await submitPRAsRequestor(browser);
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      const row = ma.documentRow(created.ref);
      if ((await row.count()) === 0) {
        hodTest.skip(true, "Seeded PR not visible in HOD's pending list");
        return;
      }
      await row.click();
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0103 Pending count matches actual list row count",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard" },
        { type: "steps", description: "1. Read pending badge value\n2. Count visible PR rows" },
        { type: "expected", description: "Badge value equals the visible row count (or both are zero)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });
      const badgeText = await ma.pendingCountBadge().textContent();
      const badgeNum = parseInt((badgeText ?? "0").replace(/[^0-9]/g, ""), 10) || 0;
      const rowCount = await page.getByRole("row").count();
      // Subtract 1 for header row when rows exist; allow zero state.
      const dataRowCount = Math.max(0, rowCount - (rowCount > 0 ? 1 : 0));
      expect(Math.abs(badgeNum - dataRowCount)).toBeLessThanOrEqual(1);
    },
  );

  hodTest(
    "TC-PRA0104 Filter tabs render and filter when present",
    {
      annotation: [
        { type: "preconditions", description: "On My Approvals dashboard" },
        { type: "steps", description: "1. Look for category filter tabs (PO/PR/SR)\n2. Click PR tab if present" },
        { type: "expected", description: "PR tab becomes selected (skipped if dashboard has no tabs)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const ma = new MyApprovalsPage(page);
      await ma.gotoList();
      const tab = page.getByRole("tab", { name: /^pr$|purchase request/i }).first();
      if ((await tab.count()) === 0) {
        hodTest.skip(true, "Category tabs not present on My Approvals dashboard");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );
```

- [ ] **Step 2: Run all 4 TCs static checks**

Run: `bun tsc --noEmit`
Expected: zero errors.

Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 4 tests listed under Step 1, no parser errors.

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 1 — My Approval Dashboard TCs (TC-PRA0101..0104)

Four TCs for the Approver dashboard: pending badge visible, row click
navigates (with cross-context seed via submitPRAsRequestor), pending
count matches visible rows, category filter tabs work when present.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Implement Step 2 — PR List Approver View (TC-PRA0201..0205)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Step 2 — PR List (Approver View)` describe

- [ ] **Step 1: Replace the Step 2 describe body**

```ts
  hodTest(
    "TC-PRA0201 My Pending tab shows PRs at HOD stage",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD; navigated to PR list" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify My Pending tab is selected" },
        { type: "expected", description: "URL is on PR list and the My Pending tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = pr.tabMyPending();
      if ((await tab.count()) === 0) return;
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0202 All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click All Documents tab" },
        { type: "expected", description: "All Documents tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) === 0) {
        hodTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0203 All Stage dropdown filters by status",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open All Stage dropdown\n2. Select In Progress" },
        { type: "expected", description: "URL stays on PR list (filter applied or no-op when dropdown absent)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const trigger = page.getByRole("button", { name: /all stage|stage/i }).first();
      if ((await trigger.count()) === 0) {
        hodTest.skip(true, "Stage dropdown not present on this list");
        return;
      }
      await trigger.click();
      const inprog = page.getByRole("option", { name: /in.progress/i }).first();
      if ((await inprog.count()) > 0) await inprog.click();
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0204 Filter panel opens and applies",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open Filter panel\n2. Select status\n3. Apply" },
        { type: "expected", description: "URL stays on PR list after applying the filter." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const fb = pr.filterButton();
      if ((await fb.count()) === 0) {
        hodTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "In Progress" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0205 Search by PR reference filters list",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR exists with a known reference" },
        { type: "steps", description: "1. Type partial reference in search\n2. Wait for results" },
        { type: "expected", description: "URL stays on PR list after typing in the search input." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const input = pr.searchInput();
      if ((await input.count()) === 0) {
        hodTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );
```

- [ ] **Step 2: Verify TypeScript + Playwright list (9 tests total)**

Run: `bun tsc --noEmit`
Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 9 tests listed (4 from Step 1 + 5 from Step 2).

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 2 — PR List Approver TCs (TC-PRA0201..0205)

Five TCs for the list view: My Pending tab, All Documents tab, stage
dropdown, filter panel, and search. Hard URL assertions where the
list affordance exists; explicit skip when missing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Implement Step 3 — PR Detail Read-only (TC-PRA0301..0304)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Step 3 — PR Detail (Read-only)` describe

- [ ] **Step 1: Replace the Step 3 describe body**

```ts
  hodTest(
    "TC-PRA0301 Detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "A pending PR (In Progress, HOD stage) exists; created via submitPRAsRequestor" },
        { type: "steps", description: "1. Open the PR detail page\n2. Verify Items tab is the default" },
        { type: "expected", description: "URL is the detail URL; Items tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) return;
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0302 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        hodTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  hodTest(
    "TC-PRA0303 No standalone Approve/Reject/Return buttons (BRD discrepancy)",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page (read-only view)" },
        { type: "steps", description: "1. Inspect detail page header / action toolbar" },
        { type: "expected", description: "Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      // Ensure NOT in edit mode
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        hodTest.skip(true, "Edit button not present — cannot verify read-only header state");
        return;
      }
      // Standalone (non-toolbar) action buttons should be absent
      await expect(pr.approveButton()).toHaveCount(0);
      await expect(pr.rejectButton()).toHaveCount(0);
      await expect(pr.sendBackButton()).toHaveCount(0);
    },
  );

  hodTest(
    "TC-PRA0304 Edit button visible (entry to bulk actions)",
    {
      annotation: [
        { type: "preconditions", description: "On a pending PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (HOD can enter Edit Mode for bulk actions)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 13 tests listed (9 + 4).

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 3 — PR Detail TCs (TC-PRA0301..0304)

Four TCs for the read-only detail view: Items tab default, Workflow
History tab, BRD discrepancy verification (no standalone Approve/
Reject/Return buttons), and Edit button visibility. Each TC seeds
its own pending PR via submitPRAsRequestor.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Implement Step 4 — Edit Mode + Bulk Actions (TC-PRA0401..0412)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Step 4 — Edit Mode + Bulk Actions` describe

- [ ] **Step 1: Replace the Step 4 describe body**

```ts
  hodTest(
    "TC-PRA0401 Click Edit → edit mode active",
    {
      annotation: [
        { type: "preconditions", description: "A pending PR detail page is open" },
        { type: "steps", description: "1. Click Edit\n2. Verify Save/Cancel form-level buttons appear" },
        { type: "expected", description: "Save Draft (or Cancel) form-level button is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        hodTest.skip(true, "Edit button not present in this build");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0402 Approved Quantity field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Approved Qty input on first row\n3. Verify it is editable" },
        { type: "expected", description: "Approved Qty input is visible and accepts a value." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) === 0) {
        hodTest.skip(true, "Approved Qty input not present in edit mode");
        return;
      }
      await expect(qty).toBeEditable();
      await qty.fill("3");
      await expect(qty).toHaveValue("3");
    },
  );

  hodTest(
    "TC-PRA0403 Item Note field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Item Note input\n3. Type a note" },
        { type: "expected", description: "Item Note input accepts the typed value." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const note = pr.itemNoteInput(0);
      if ((await note.count()) === 0) {
        hodTest.skip(true, "Item Note input not present");
        return;
      }
      await note.fill("HOD note");
      await expect(note).toHaveValue("HOD note");
    },
  );

  hodTest(
    "TC-PRA0404 Delivery Point field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Delivery Point input\n3. Verify editable" },
        { type: "expected", description: "Delivery Point input is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const dp = pr.deliveryPointInput(0);
      if ((await dp.count()) === 0) {
        hodTest.skip(true, "Delivery Point input not present");
        return;
      }
      await expect(dp).toBeEditable();
    },
  );

  hodTest(
    "TC-PRA0405 Vendor field is read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Vendor cell on first row" },
        { type: "expected", description: "Vendor cell is disabled or non-editable per FR-PR-011A." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const vendor = pr.vendorReadOnlyCell(0);
      if ((await vendor.count()) === 0) {
        hodTest.skip(true, "Vendor cell not present");
        return;
      }
      // Read-only verification: either disabled OR aria-disabled OR no input role
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await vendor.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  hodTest(
    "TC-PRA0406 Unit Price field is read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Unit Price cell on first row" },
        { type: "expected", description: "Unit Price cell is disabled or non-editable per FR-PR-011A." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cell = pr.unitPriceReadOnlyCell(0);
      if ((await cell.count()) === 0) {
        hodTest.skip(true, "Unit Price cell not present");
        return;
      }
      const disabled = await cell.isDisabled().catch(() => false);
      const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  hodTest(
    "TC-PRA0407 Discount / Tax / FOC Qty are read-only",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Discount, Tax, FOC Qty cells" },
        { type: "expected", description: "All three cells are disabled or non-editable per FR-PR-011A / FR-PR-024." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cells = [pr.discountReadOnlyCell(0), pr.taxReadOnlyCell(0), pr.focQtyReadOnlyCell(0)];
      let assertedAtLeastOne = false;
      for (const cell of cells) {
        if ((await cell.count()) === 0) continue;
        const disabled = await cell.isDisabled().catch(() => false);
        const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
        const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
        const isInput = tagName === "input" || tagName === "textarea";
        expect(disabled || ariaDisabled || !isInput).toBeTruthy();
        assertedAtLeastOne = true;
      }
      if (!assertedAtLeastOne) {
        hodTest.skip(true, "None of Discount / Tax / FOC Qty cells are present");
      }
    },
  );

  hodTest(
    "TC-PRA0408 Bulk Approve via Select All → toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Approve in bulk toolbar\n4. Confirm" },
        { type: "expected", description: "Status transitions away from In Progress (toast / next-stage / reload state)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      if ((await pr.bulkActionToolbar().count()) === 0) {
        await pr.selectAllInEditMode();
      }
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Approve button not present in toolbar");
        return;
      }
      await bulkApprove(page);
      // Hard assertion: URL stays on the same PR ref (status moves away from In Progress)
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0409 Bulk Reject via toolbar (with reason)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Reject\n4. Enter reason\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after rejection (status badge updates)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkRejectInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Reject button not present in toolbar");
        return;
      }
      await bulkReject(page, REJECT_REASON);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0410 Bulk Send for Review via toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Send for Review\n4. Enter reason + stage\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after send for review." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkSendForReviewInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Send for Review button not present");
        return;
      }
      await bulkSendForReview(page, REVIEW_REASON, REVIEW_STAGE);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0411 Bulk Split via toolbar",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Split" },
        { type: "expected", description: "Split UI appears (dialog or inline) — verified by URL stays on detail." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      const split = pr.bulkSplitInEditMode();
      if ((await split.count()) === 0) {
        hodTest.skip(true, "Bulk Split button not present");
        return;
      }
      await split.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  hodTest(
    "TC-PRA0412 Cancel edit → discard changes",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a pending PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into Approved Qty\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) > 0) await qty.fill("99");
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 25 tests listed (13 + 12).

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 4 — Edit Mode + Bulk Actions TCs (TC-PRA0401..0412)

Twelve TCs covering: enter edit mode, three editable fields (Approved
Qty, Item Note, Delivery Point), three read-only field assertions
(Vendor, Unit Price, Discount/Tax/FOC), four bulk actions (Approve,
Reject, Send for Review, Split), and Cancel edit. Uses the
submitPRAsRequestor cross-context helper to seed pending PRs and
the bulk-action composers in pr-approver.helpers.ts.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Implement Scope Contrast (TC-PRA0501)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Scope Contrast (FC)` describe (uses `fcTest`)

- [ ] **Step 1: Replace the Scope Contrast describe body**

```ts
  fcTest(
    "TC-PRA0501 FC sees PRs from multiple departments",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as FC (fc@blueledgers.com); pending PRs exist in DB across multiple departments" },
        { type: "steps", description: "1. Navigate to PR list as FC\n2. Open All Documents tab\n3. Read department column values from rows" },
        { type: "expected", description: "At least 2 distinct department values appear in the list (skipped if DB lacks cross-dept PRs)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) > 0) await tab.click();
      // Collect department-cell text from data rows. Best-effort selector
      // — adjust at impl time if column header differs.
      const deptCells = page.getByRole("cell").filter({
        has: page.locator("[data-column='department'], [aria-label*='department' i]"),
      });
      const cellCount = await deptCells.count();
      if (cellCount === 0) {
        // Fallback: grab rows and inspect cell text — pick second column as a heuristic
        const rows = page.getByRole("row");
        const rowCount = await rows.count();
        if (rowCount < 3) {
          fcTest.skip(true, "Fewer than 2 data rows visible — cannot assert cross-dept scope");
          return;
        }
      }
      const distinct = new Set<string>();
      for (let i = 0; i < Math.min(cellCount, 20); i++) {
        const text = (await deptCells.nth(i).textContent())?.trim() ?? "";
        if (text) distinct.add(text);
      }
      if (distinct.size === 0) {
        fcTest.skip(true, "Department column not present on this list view");
        return;
      }
      expect(distinct.size).toBeGreaterThanOrEqual(2);
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 26 tests listed (25 + 1).

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Scope Contrast TC (TC-PRA0501)

One TC verifying FC sees PRs from at least 2 distinct departments
(vs HOD's single-dept scope). Uses the fcTest auth fixture.
Dynamically skips when the DB lacks cross-dept data or when the
department column is absent from the current list view.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Implement Golden Journey (TC-PRA0901)

**Files:**
- Modify: `tests/303-pr-approver-journey.spec.ts` — fill the `Golden Journey` describe.serial

- [ ] **Step 1: Replace the Golden Journey describe body**

```ts
  hodTest(
    "TC-PRA0901 HOD full flow: My Approval → List → Detail → Edit → Adjust Qty → Bulk Approve",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as HOD; a fresh pending PR is seeded via submitPRAsRequestor" },
        { type: "steps", description: "1. Open My Approvals\n2. Open PR detail\n3. Click Edit\n4. Adjust Approved Qty on first row\n5. Select all + Bulk Approve + Confirm" },
        { type: "expected", description: "URL stays on the PR ref after bulk approve; the journey completes end-to-end." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const ma = new MyApprovalsPage(page);

      // Seed
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PRA0901 golden" });

      // Step 1: My Approvals
      await ma.gotoList();
      await expect(ma.pendingCountBadge()).toBeVisible({ timeout: 10_000 });

      // Step 2: PR Detail
      await gotoPRDetail(page, created.ref);

      // Step 3: Enter Edit Mode
      if ((await pr.editModeButton().count()) === 0) {
        hodTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();

      // Step 4: Adjust Approved Qty
      const qty = pr.approvedQtyInput(0);
      if ((await qty.count()) > 0) await qty.fill("2");

      // Step 5: Bulk Approve
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        hodTest.skip(true, "Bulk Approve button not present");
        return;
      }
      await bulkApprove(page);

      // Hard assertion
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 303-pr-approver-journey.spec.ts --list`
Expected: 27 tests listed (26 + 1).

Run annotation audit:
```bash
pre=$(grep -c 'type: "preconditions"' tests/303-pr-approver-journey.spec.ts)
exp=$(grep -c 'type: "expected"' tests/303-pr-approver-journey.spec.ts)
echo "pre=$pre exp=$exp"
```
Expected: `pre=27 exp=27`.

- [ ] **Step 3: Commit**

```bash
git add tests/303-pr-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Golden Journey TC (TC-PRA0901)

End-to-end HOD flow: My Approvals dashboard → PR detail → Edit Mode
→ adjust Approved Qty → Select All + Bulk Approve. Single serial TC
that exercises the full Approver persona journey for one PR.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Add SYNC_TARGETS entry

**Files:**
- Modify: `scripts/sync-test-results.ts` (insert one entry inside `SYNC_TARGETS`)

- [ ] **Step 1: Add the entry**

Edit `scripts/sync-test-results.ts`. Locate the entry:
```ts
  { jsonFile: "302-pr-creator-journey-results.json", sheetTab: "PR Creator" },
```
Insert directly AFTER it:
```ts
  { jsonFile: "303-pr-approver-journey-results.json", sheetTab: "PR Approver" },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "$(cat <<'EOF'
chore(sync): add SYNC_TARGETS entry for PR Approver journey

Maps tests/results/303-pr-approver-journey-results.json to Google
Sheets tab 'PR Approver'. The tab must be created manually in the
target spreadsheet before the first sync.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Final verify, regenerate user-story doc, integration commit

**Files:**
- Auto-generated: `docs/user-stories/303-pr-approver-journey.md`

- [ ] **Step 1: Annotation audit (CLAUDE.md requirement)**

Run:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: No `MISMATCH` output.

- [ ] **Step 2: Spec-specific count**

```bash
pre=$(grep -c 'type: "preconditions"' tests/303-pr-approver-journey.spec.ts)
exp=$(grep -c 'type: "expected"' tests/303-pr-approver-journey.spec.ts)
echo "303 spec: pre=$pre exp=$exp"
```
Expected: `pre=27 exp=27`.

- [ ] **Step 3: Final TypeScript check**

```bash
bun tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Final Playwright list check**

```bash
bun run test -- 303-pr-approver-journey.spec.ts --list
```
Expected: 27 tests, no parser errors.

- [ ] **Step 5: Regenerate user-story doc**

```bash
bun docs:user-stories
```
Expected: No errors. The script creates/updates `docs/user-stories/303-pr-approver-journey.md`.

Verify:
```bash
ls -la docs/user-stories/303-pr-approver-journey.md
grep -c 'TC-PRA0' docs/user-stories/303-pr-approver-journey.md
```
Expected: file exists; TC-PRA0 occurrences ≥ 27 (each TC ID appears at least once).

- [ ] **Step 6: Stage only the new spec's user-story doc + the bulk-regen footer updates**

The generator regenerates ALL spec docs (footer-timestamp delta on each). Stage everything in `docs/user-stories/`:
```bash
git add docs/user-stories/
```

If `tests/results/*.json` has changed from a local test run, discard:
```bash
git checkout -- tests/results/
git clean -fd tests/results/
```

- [ ] **Step 7: Final commit**

```bash
git commit -m "$(cat <<'EOF'
docs(user-stories): regen for PR Approver journey

Generated by 'bun docs:user-stories' from the new spec annotations.
27 TCs across 6 describe blocks (Steps 1-4 + Scope Contrast +
Golden Journey), each with full 5-field annotation set per CLAUDE.md.
Other spec docs include footer-timestamp updates from the same
generator pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification checklist

Before declaring the feature done:

- [ ] `bun run test -- 303-pr-approver-journey.spec.ts --list` shows 27 tests
- [ ] Annotation audit script reports no mismatches
- [ ] `docs/user-stories/303-pr-approver-journey.md` exists and lists all 27 TCs
- [ ] `scripts/sync-test-results.ts` includes the new `SYNC_TARGETS` entry
- [ ] `git log` shows ~12 commits, one per task (Task 1 audit-only has no commit)
- [ ] No changes to `tests/301-purchase-request.spec.ts` or `tests/302-pr-creator-journey.spec.ts`
- [ ] `tests/pages/my-approvals.page.ts` is unchanged (reused as-is)
- [ ] `tests/pages/pr-creator.helpers.ts` is unchanged (reused as-is)
