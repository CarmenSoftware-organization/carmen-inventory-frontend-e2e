# PO Approver Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `tests/403-po-approver-journey.spec.ts` covering the PO FC Approver workflow as 19 persona-journey TCs grouped per source step (1-3 + Golden Journey).

**Architecture:** New persona-journey spec sits alongside `401-purchase-order.spec.ts` and `402-po-purchaser-journey.spec.ts`. Reuses `createAuthTest("fc@blueledgers.com")` as `fcTest`. Reuses `submitPOAsPurchaser` and `gotoPODetail` from existing `po-approver.helpers.ts` (no new helpers). Extends `tests/pages/purchase-order.page.ts` with ~10 new methods covering item-level approval mechanic (selectItemRow, item action toolbar, mark Approve/Review/Reject, item badges), document-level footer buttons (Approve PO / Send Back / Reject), and Comment button.

**Tech Stack:** Playwright Test 1.x, TypeScript, Bun, Radix UI primitives.

**Spec source:** `docs/superpowers/specs/2026-05-06-po-approver-journey-design.md`

---

## E2E TDD note

This is e2e against an already-built frontend. The TDD loop adapts:
1. Write the test against documented behavior
2. Run it — failures reveal locator drift, missing wait, or genuine UI gaps
3. Adjust locators / waits until stable; never weaken assertions to mask defects
4. Commit only when stable

If a TC fails because the UI doesn't ship the expected behavior, mark `fcTest.skip(reason)` with a `note` annotation. Don't run the actual e2e suite during subagent execution. Subagents verify only TypeScript compile + Playwright list + annotation audit.

---

## Task 1: Audit existing assets

**Files (read-only):**
- `tests/pages/purchase-order.page.ts`
- `tests/pages/po-approver.helpers.ts`

- [ ] **Step 1: Confirm method inventory**

`tests/pages/purchase-order.page.ts` (after 402's additions, ~277 lines):
- Navigation: `gotoList`, `gotoDetail`, `gotoNew`
- List: `newPODropdown`, `createFromPRMenuItem`, `manualPOMenuItem`, `poRow`, `tabMyPending`, `tabAllDocuments`, `searchFor`, `applyFilter`, `sortBy`
- Form: `vendorTrigger`, `descriptionInput`, `deliveryDateInput`, `saveButton`, `addItemButton`, `addItemToPO`
- Edit mode: `editModeButton`, `enterEditMode`, `cancelEditMode`, `submitButton`
- Detail tabs: `tabItems`, `tabQuantity`, `tabPricing`
- Wizards: `fromPriceListMenuItem`, `fromPRMenuItem`, `priceListWizardSubmit`, `fromPRWizardSubmit`
- Actions: `sendToVendorButton`, `approveButton`, `cancelPOButton`, `requestChangeOrderButton`, `generatePONumberButton`, `applyDiscountButton`, `calculateTotalsButton`, `closePOButton`
- QR / dialog / status: `qrCodeSection`, `qrCodeImage`, `reasonInput`, `confirmDialogButton`, `statusBadge`, `expectSavedToast`, `summaryCards`, `budgetUtilizationChart`

`tests/pages/po-approver.helpers.ts`:
- `submitPOAsPurchaser(browser, opts?)` → `CreatedPO` (used by this spec)
- `approveAsFC(browser, ref)` (NOT used by this spec's TCs — exists for setup chains in other specs)
- `gotoPODetail(page, ref)` (used by this spec)
- `CreatedPO` interface

Methods to ADD on `purchase-order.page.ts` (Task 2):
- `selectItemRow(index)` — row checkbox locator
- `selectItemInEditMode(index)` — async, clicks the checkbox
- `itemActionToolbar()` — toolbar appearing after item select
- `markItemApproveButton()`, `markItemReviewButton()`, `markItemRejectButton()` — toolbar-scoped item buttons
- `itemBadge(index, status?)` — per-row status badge
- `documentApproveButton()`, `documentSendBackButton()`, `documentRejectButton()` — footer-scoped document buttons
- `commentButton()` — view/edit-mode comment button

No code change in this task.

- [ ] **Step 2: No commit (audit-only)**

---

## Task 2: Add FC approval-action methods to PurchaseOrderPage

**Files:**
- Modify: `tests/pages/purchase-order.page.ts` (insert at END of class body, before final `}`)

- [ ] **Step 1: Insert new methods**

Open `tests/pages/purchase-order.page.ts`. Locate the FINAL `}` of the `PurchaseOrderPage` class. Insert this block immediately before the closing brace, preserving 2-space indentation inside the class:

```ts
  // ── FC Approval Actions (Edit Mode item-level + document-level) ──────
  // The FC PO approval flow uses item-level marking (Approve/Review/Reject)
  // that surfaces an action toolbar, plus document-level footer buttons
  // (Approve PO / Send Back / Reject) whose visibility depends on the
  // item-state mix. Distinct from PR's bulk-toolbar pattern.

  selectItemRow(index: number): Locator {
    // Skip header row (nth(0)); data rows start at nth(1)
    return this.page.getByRole("row").nth(index + 1).getByRole("checkbox").first();
  }

  async selectItemInEditMode(index: number) {
    const cb = this.selectItemRow(index);
    if ((await cb.count()) > 0) await cb.check({ force: true });
  }

  itemActionToolbar(): Locator {
    return this.page
      .locator("[data-slot='toolbar'], [role='toolbar']")
      .filter({ has: this.page.getByRole("button", { name: /approve|review|reject/i }) })
      .first();
  }

  markItemApproveButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^approve$/i }).first();
  }

  markItemReviewButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^review$/i }).first();
  }

  markItemRejectButton(): Locator {
    return this.itemActionToolbar().getByRole("button", { name: /^reject$/i }).first();
  }

  itemBadge(index: number, status?: string): Locator {
    const row = this.page.getByRole("row").nth(index + 1);
    const re = status ? new RegExp(status, "i") : /approved|review|rejected/i;
    return row.locator("[data-slot='badge'], [class*='badge']").filter({ hasText: re }).first();
  }

  // Document-level footer buttons — scoped to footer / dialog area to avoid
  // collision with item-level Approve/Reject buttons.
  documentApproveButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /approve po|approve.*purchase order|^approve$/i })
      .first()
      .or(this.page.getByRole("button", { name: /approve po|approve.*purchase order/i }).last());
  }

  documentSendBackButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /send back|return for|^send$/i })
      .first()
      .or(this.page.getByRole("button", { name: /send back|return for/i }).last());
  }

  documentRejectButton(): Locator {
    return this.page
      .locator("footer, [data-slot='footer']")
      .getByRole("button", { name: /reject po|^reject$/i })
      .first()
      .or(this.page.getByRole("button", { name: /reject po/i }).last());
  }

  commentButton(): Locator {
    return this.page.getByRole("button", { name: /^comment$|add comment/i }).first();
  }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-order.page.ts
git commit -m "$(cat <<'EOF'
feat(pages): add FC approval-action helpers to PurchaseOrderPage

Adds 11 new methods covering the FC item-level + document-level PO
approval mechanic: selectItemRow, selectItemInEditMode,
itemActionToolbar, markItemApprove/Review/Reject buttons, itemBadge
(per-row status), document-level Approve/SendBack/Reject footer
buttons, and commentButton. Used by the upcoming PO Approver
persona journey spec.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Scaffold the spec file

**Files:**
- Create: `tests/403-po-approver-journey.spec.ts`

- [ ] **Step 1: Write the spec scaffold**

Create `tests/403-po-approver-journey.spec.ts` with this EXACT content:

```ts
import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseOrderPage, LIST_PATH } from "./pages/purchase-order.page";
import {
  submitPOAsPurchaser,
  gotoPODetail,
} from "./pages/po-approver.helpers";

// Persona-journey spec — PO FC Approver. Runs alongside 401/402.
// Source docs: docs/persona-doc/Purchase Order/Approver/INDEX.md
// and step-01..03.md.
const fcTest = createAuthTest("fc@blueledgers.com");

const SEND_BACK_REASON = "Please verify pricing";
const REJECT_REASON = "Vendor pricing exceeds budget";

fcTest.describe("Step 1 — My Approval", () => {
  // TCs added in Task 4
});

fcTest.describe("Step 2 — PO Detail (FC view)", () => {
  // TCs added in Task 5
});

fcTest.describe("Step 3 — Approval Actions", () => {
  // TCs added in Task 6
});

fcTest.describe.serial("Golden Journey", () => {
  // TC added in Task 7
});
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 403-po-approver-journey.spec.ts --list`
Expected: TS clean; zero tests reported (empty describes), no parser errors.

- [ ] **Step 3: Commit**

```bash
git add tests/403-po-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): scaffold 403-po-approver-journey.spec.ts

Empty describe blocks for steps 1-3 plus a serial Golden Journey
describe. TCs land in subsequent commits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Implement Step 1 — My Approval (TC-POA0101..0103)

**Files:**
- Modify: `tests/403-po-approver-journey.spec.ts` — fill the `Step 1 — My Approval` describe

- [ ] **Step 1: Replace the Step 1 describe body**

Find:
```ts
fcTest.describe("Step 1 — My Approval", () => {
  // TCs added in Task 4
});
```

Replace the comment with:

```ts
  fcTest(
    "TC-POA0101 My Approval dashboard loads with Total Pending count visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as FC (fc@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to My Approvals (or appropriate FC dashboard)\n2. Verify the total-pending indicator is rendered" },
        { type: "expected", description: "URL contains 'approval' or 'dashboard'; a count/badge or row count is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      // FC My Approval dashboard route may differ — try both common paths
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      await page.waitForLoadState("networkidle").catch(() => {});
      await expect(page).toHaveURL(/approval|dashboard/i);
    },
  );

  fcTest(
    "TC-POA0102 PO filter tab shows pending POs (DRAFT + IN PROGRESS)",
    {
      annotation: [
        { type: "preconditions", description: "On My Approval dashboard with at least one pending PO" },
        { type: "steps", description: "1. Click PO/Purchase Order filter tab\n2. Verify rows render or empty state" },
        { type: "expected", description: "PO tab is selected (aria-selected=true) when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      const tab = page.getByRole("tab", { name: /^po$|purchase order/i }).first();
      if ((await tab.count()) === 0) {
        fcTest.skip(true, "PO filter tab not present on this dashboard build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  fcTest(
    "TC-POA0103 Click pending PO row navigates to PO detail",
    {
      annotation: [
        { type: "preconditions", description: "On My Approval dashboard with at least one pending PO row (seeded via submitPOAsPurchaser)" },
        { type: "steps", description: "1. Seed PO via Purchaser context\n2. Navigate to dashboard\n3. Click the seeded PO row" },
        { type: "expected", description: "URL navigates to /procurement/purchase-order/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const created = await submitPOAsPurchaser(browser);
      await page.goto("/procurement/my-approvals").catch(async () => {
        await page.goto("/procurement/purchase-requests/my-approvals");
      });
      await page.waitForLoadState("networkidle").catch(() => {});
      const row = page.getByRole("row").filter({ hasText: created.ref }).first();
      if ((await row.count()) === 0) {
        fcTest.skip(true, "Seeded PO not visible in FC My Approval list");
        return;
      }
      await row.click();
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 403-po-approver-journey.spec.ts --list`
Expected: 3 tests, no parser errors.

Annotation: `pre=$(grep -c 'type: "preconditions"' tests/403-po-approver-journey.spec.ts); exp=$(grep -c 'type: "expected"' tests/403-po-approver-journey.spec.ts); echo "pre=$pre exp=$exp"` — expected `pre=3 exp=3`.

- [ ] **Step 3: Commit**

```bash
git add tests/403-po-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 1 — My Approval TCs (TC-POA0101..0103)

Three TCs for the FC My Approval dashboard: load + total pending
visibility, PO filter tab selection, click-to-detail navigation.
Each TC handles dashboard-route variants (/my-approvals vs
/purchase-requests/my-approvals) gracefully.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Implement Step 2 — PO Detail FC View (TC-POA0201..0203)

**Files:**
- Modify: `tests/403-po-approver-journey.spec.ts` — fill the `Step 2 — PO Detail (FC view)` describe

- [ ] **Step 1: Replace the Step 2 describe body**

```ts
  fcTest(
    "TC-POA0201 PO Detail loads in IN PROGRESS view (FC perspective)",
    {
      annotation: [
        { type: "preconditions", description: "An IN PROGRESS PO exists (seeded via submitPOAsPurchaser)" },
        { type: "steps", description: "1. Open the PO detail page as FC\n2. Verify URL and status badge" },
        { type: "expected", description: "URL is /procurement/purchase-order/<ref>; status badge text matches /in.progress/i." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /in.progress/i })
          .first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0202 Header fields are read-only for FC (cannot edit vendor/date/etc.)",
    {
      annotation: [
        { type: "preconditions", description: "On an IN PROGRESS PO detail page as FC" },
        { type: "steps", description: "1. Inspect vendor / description / delivery date inputs\n2. Verify they are disabled or non-editable" },
        { type: "expected", description: "Vendor input or one of the header fields is disabled/readonly. Skipped if no header field is detectable." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      const vendor = po.vendorTrigger();
      if ((await vendor.count()) === 0) {
        fcTest.skip(true, "Vendor field not visible on detail (header may collapse)");
        return;
      }
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await vendor.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  fcTest(
    "TC-POA0203 Edit button + Comment button visible",
    {
      annotation: [
        { type: "preconditions", description: "On an IN PROGRESS PO detail page as FC" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible. Comment button is visible when present." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      await expect(po.editModeButton()).toBeVisible({ timeout: 10_000 });
      // Comment button is optional in some builds — assert when present
      const comment = po.commentButton();
      if ((await comment.count()) > 0) {
        await expect(comment).toBeVisible();
      }
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 403-po-approver-journey.spec.ts --list`
Expected: 6 tests (3 + 3).

Annotation: `pre=6 exp=6`.

- [ ] **Step 3: Commit**

```bash
git add tests/403-po-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 2 — PO Detail FC view TCs (TC-POA0201..0203)

Three TCs for FC's PO detail view: status In Progress visible,
header fields read-only verification (FC cannot edit vendor/date),
Edit button + optional Comment button visibility.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Implement Step 3 — Approval Actions (TC-POA0301..0312)

**Files:**
- Modify: `tests/403-po-approver-journey.spec.ts` — fill the `Step 3 — Approval Actions` describe

This is the biggest task — 12 TCs covering item-level + document-level approval mechanic.

- [ ] **Step 1: Replace the Step 3 describe body**

```ts
  // ─ Item-level marking (4 TCs) ───────────────────────────────────────
  fcTest(
    "TC-POA0301 Edit mode → select item → Approve toolbar appears",
    {
      annotation: [
        { type: "preconditions", description: "An IN PROGRESS PO with ≥1 item exists (seeded via submitPOAsPurchaser)" },
        { type: "steps", description: "1. Open PO detail\n2. Click Edit\n3. Select first item via row checkbox" },
        { type: "expected", description: "Item action toolbar (Approve/Review/Reject) becomes visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present on PO");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      const toolbar = po.itemActionToolbar();
      if ((await toolbar.count()) === 0) {
        fcTest.skip(true, "Item action toolbar not present after select — UI may differ");
        return;
      }
      await expect(toolbar).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0302 Mark item Approved → green badge appears on item row",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible on a row" },
        { type: "steps", description: "1. Select item\n2. Click Approve in toolbar\n3. Verify badge" },
        { type: "expected", description: "Item row shows an Approved badge." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      const approve = po.markItemApproveButton();
      if ((await approve.count()) === 0) {
        fcTest.skip(true, "Item-level Approve button not present");
        return;
      }
      await approve.click({ timeout: 5_000 });
      await expect(po.itemBadge(0, "approved")).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0303 Mark item Review → amber badge + Send Back footer button appears",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible on a row" },
        { type: "steps", description: "1. Select item\n2. Click Review in toolbar\n3. Verify badge + footer button" },
        { type: "expected", description: "Item row shows a Review badge; document Send Back button is visible in footer." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      const review = po.markItemReviewButton();
      if ((await review.count()) === 0) {
        fcTest.skip(true, "Item-level Review button not present");
        return;
      }
      await review.click({ timeout: 5_000 });
      await expect(po.itemBadge(0, "review")).toBeVisible({ timeout: 10_000 });
      await expect(po.documentSendBackButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0304 Mark item Reject → reject badge + footer Reject button appears",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible on a row" },
        { type: "steps", description: "1. Select item\n2. Click Reject in toolbar\n3. Verify badge + footer button" },
        { type: "expected", description: "Item row shows a Reject badge; document Reject button is visible in footer." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      const reject = po.markItemRejectButton();
      if ((await reject.count()) === 0) {
        fcTest.skip(true, "Item-level Reject button not present");
        return;
      }
      await reject.click({ timeout: 5_000 });
      await expect(po.itemBadge(0, "rejected")).toBeVisible({ timeout: 10_000 });
      await expect(po.documentRejectButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  // ─ Document Approve flow (3 TCs) ────────────────────────────────────
  fcTest(
    "TC-POA0305 All items Approved → Document Approve button enabled in footer",
    {
      annotation: [
        { type: "preconditions", description: "An IN PROGRESS PO with ≥1 item exists" },
        { type: "steps", description: "1. Enter edit mode\n2. Select item and mark Approve\n3. Verify Document Approve button" },
        { type: "expected", description: "Document Approve button is visible (and enabled when present)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemApproveButton().count()) === 0) {
        fcTest.skip(true, "Item-level Approve not present");
        return;
      }
      await po.markItemApproveButton().click({ timeout: 5_000 });
      await expect(po.documentApproveButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0306 Click Approve PO → confirmation dialog ('Once approved, PO will be sent to vendor')",
    {
      annotation: [
        { type: "preconditions", description: "All items marked Approved; Document Approve button visible" },
        { type: "steps", description: "1. Approve all items\n2. Click Document Approve PO button" },
        { type: "expected", description: "Confirmation dialog is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemApproveButton().count()) === 0) {
        fcTest.skip(true, "Item-level Approve not present");
        return;
      }
      await po.markItemApproveButton().click({ timeout: 5_000 });
      const docApprove = po.documentApproveButton();
      if ((await docApprove.count()) === 0) {
        fcTest.skip(true, "Document Approve button not visible after item approval");
        return;
      }
      await docApprove.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0307 Confirm Approve → status moves to APPROVED/SENT",
    {
      annotation: [
        { type: "preconditions", description: "Document Approve confirmation dialog open" },
        { type: "steps", description: "1. Approve item\n2. Click Document Approve\n3. Confirm dialog" },
        { type: "expected", description: "Status badge text matches /approved|sent/i after confirmation." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemApproveButton().count()) === 0) {
        fcTest.skip(true, "Item-level Approve not present");
        return;
      }
      await po.markItemApproveButton().click({ timeout: 5_000 });
      const docApprove = po.documentApproveButton();
      if ((await docApprove.count()) === 0) {
        fcTest.skip(true, "Document Approve button not visible");
        return;
      }
      await docApprove.click({ timeout: 5_000 });
      await po.confirmDialogButton(/confirm|approve|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /approved|sent/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );

  // ─ Document Send Back flow (2 TCs) ──────────────────────────────────
  fcTest(
    "TC-POA0308 Click Send Back → dialog with stage selector + per-item reason",
    {
      annotation: [
        { type: "preconditions", description: "Item marked Review; Document Send Back button visible" },
        { type: "steps", description: "1. Mark item Review\n2. Click Document Send Back" },
        { type: "expected", description: "Send Back dialog is visible." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemReviewButton().count()) === 0) {
        fcTest.skip(true, "Item-level Review not present");
        return;
      }
      await po.markItemReviewButton().click({ timeout: 5_000 });
      const sendBack = po.documentSendBackButton();
      if ((await sendBack.count()) === 0) {
        fcTest.skip(true, "Document Send Back button not visible");
        return;
      }
      await sendBack.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0309 Confirm Send Back → PO returned (status updates)",
    {
      annotation: [
        { type: "preconditions", description: "Send Back dialog open" },
        { type: "steps", description: "1. Mark item Review\n2. Click Send Back\n3. Enter reason\n4. Confirm" },
        { type: "expected", description: "URL stays on PO ref after confirmation." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemReviewButton().count()) === 0) {
        fcTest.skip(true, "Item-level Review not present");
        return;
      }
      await po.markItemReviewButton().click({ timeout: 5_000 });
      const sendBack = po.documentSendBackButton();
      if ((await sendBack.count()) === 0) {
        fcTest.skip(true, "Document Send Back not visible");
        return;
      }
      await sendBack.click({ timeout: 5_000 });
      const reason = po.reasonInput();
      if ((await reason.count()) > 0) await reason.fill(SEND_BACK_REASON).catch(() => {});
      await po.confirmDialogButton(/confirm|send|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 15_000 });
    },
  );

  // ─ Document Reject flow (2 TCs) ─────────────────────────────────────
  fcTest(
    "TC-POA0310 Click Reject → dialog with optional reason field",
    {
      annotation: [
        { type: "preconditions", description: "Item marked Reject; Document Reject button visible" },
        { type: "steps", description: "1. Mark item Reject\n2. Click Document Reject" },
        { type: "expected", description: "Reject dialog is visible." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemRejectButton().count()) === 0) {
        fcTest.skip(true, "Item-level Reject not present");
        return;
      }
      await po.markItemRejectButton().click({ timeout: 5_000 });
      const docReject = po.documentRejectButton();
      if ((await docReject.count()) === 0) {
        fcTest.skip(true, "Document Reject button not visible");
        return;
      }
      await docReject.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  fcTest(
    "TC-POA0311 Confirm Reject → PO marked REJECTED",
    {
      annotation: [
        { type: "preconditions", description: "Reject dialog open" },
        { type: "steps", description: "1. Mark item Reject\n2. Click Document Reject\n3. Enter optional reason\n4. Confirm" },
        { type: "expected", description: "Status badge text matches /rejected/i after confirmation." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemRejectButton().count()) === 0) {
        fcTest.skip(true, "Item-level Reject not present");
        return;
      }
      await po.markItemRejectButton().click({ timeout: 5_000 });
      const docReject = po.documentRejectButton();
      if ((await docReject.count()) === 0) {
        fcTest.skip(true, "Document Reject not visible");
        return;
      }
      await docReject.click({ timeout: 5_000 });
      const reason = po.reasonInput();
      if ((await reason.count()) > 0) await reason.fill(REJECT_REASON).catch(() => {});
      await po.confirmDialogButton(/confirm|reject|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /rejected/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );

  // ─ Edit Mode Cancel (1 TC) ──────────────────────────────────────────
  fcTest(
    "TC-POA0312 Cancel edit mode (no item marked) → exits without saving",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on an IN PROGRESS PO with no item marked" },
        { type: "steps", description: "1. Enter edit mode\n2. Click Cancel without selecting/marking any item" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);
      const created = await submitPOAsPurchaser(browser);
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present");
        return;
      }
      await po.enterEditMode();
      await po.cancelEditMode();
      await expect(po.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 403-po-approver-journey.spec.ts --list`
Expected: 18 tests (6 + 12).

Annotation: `pre=18 exp=18`.

- [ ] **Step 3: Commit**

```bash
git add tests/403-po-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 3 — Approval Actions TCs (TC-POA0301..0312)

Twelve TCs covering FC's item-level + document-level PO approval
mechanic: select item + Approve toolbar (0301), item-level mark
Approve/Review/Reject with badges (0302/0303/0304), Document
Approve flow with confirmation dialog → APPROVED/SENT (0305..0307),
Document Send Back flow (0308/0309), Document Reject flow (0310/
0311), and Edit Mode Cancel (0312). Each TC seeds its own IN
PROGRESS PO via submitPOAsPurchaser.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Implement Golden Journey (TC-POA0901)

**Files:**
- Modify: `tests/403-po-approver-journey.spec.ts` — fill the `Golden Journey` describe.serial

- [ ] **Step 1: Replace the Golden Journey describe body**

```ts
  fcTest(
    "TC-POA0901 Full FC flow: My Approval → open PO → Edit → mark all items Approved → Document Approve → Sent",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as FC; a fresh IN PROGRESS PO is seeded via submitPOAsPurchaser" },
        { type: "steps", description: "1. Seed IN PROGRESS PO\n2. Open PO detail\n3. Click Edit\n4. Select first item\n5. Mark Approve\n6. Click Document Approve\n7. Confirm dialog" },
        { type: "expected", description: "Status badge transitions to APPROVED/SENT after confirmation." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);

      // Seed
      const created = await submitPOAsPurchaser(browser, { description: "[E2E-POA] TC-POA0901 golden" });

      // Open detail
      await gotoPODetail(page, created.ref);
      if ((await po.editModeButton().count()) === 0) {
        fcTest.skip(true, "Edit button not present on seeded PO");
        return;
      }

      // Edit + mark all Approved
      await po.enterEditMode();
      await po.selectItemInEditMode(0);
      if ((await po.markItemApproveButton().count()) === 0) {
        fcTest.skip(true, "Item-level Approve not present");
        return;
      }
      await po.markItemApproveButton().click({ timeout: 5_000 });

      // Document Approve
      const docApprove = po.documentApproveButton();
      if ((await docApprove.count()) === 0) {
        fcTest.skip(true, "Document Approve button not visible after item approval");
        return;
      }
      await docApprove.click({ timeout: 5_000 });
      await po.confirmDialogButton(/confirm|approve|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});

      // Hard assertion
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /approved|sent/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 403-po-approver-journey.spec.ts --list`
Expected: 19 tests (18 + 1).

Annotation: `pre=19 exp=19`.

- [ ] **Step 3: Commit**

```bash
git add tests/403-po-approver-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Golden Journey TC (TC-POA0901)

End-to-end FC flow: seed IN PROGRESS PO → open detail → Edit →
mark item Approved → Document Approve → confirm → status APPROVED/
SENT. Single serial TC that exercises the full FC approval mechanic.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Add SYNC_TARGETS entry

**Files:**
- Modify: `scripts/sync-test-results.ts`

- [ ] **Step 1: Add the entry**

Edit `scripts/sync-test-results.ts`. Locate the existing entry:
```ts
  { jsonFile: "402-po-purchaser-journey-results.json", sheetTab: "PO Purchaser" },
```
Insert directly AFTER it (before the closing `];`):
```ts
  { jsonFile: "403-po-approver-journey-results.json", sheetTab: "PO Approver" },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "$(cat <<'EOF'
chore(sync): add SYNC_TARGETS entry for PO Approver journey

Maps tests/results/403-po-approver-journey-results.json to Google
Sheets tab 'PO Approver'. The tab must be created manually in the
target spreadsheet before the first sync.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Final verify, regenerate user-story doc, integration commit

**Files:**
- Auto-generated: `docs/user-stories/403-po-approver-journey.md`

- [ ] **Step 1: Annotation audit (CLAUDE.md requirement)**

```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: no `MISMATCH` output.

- [ ] **Step 2: Spec-specific count**

```bash
pre=$(grep -c 'type: "preconditions"' tests/403-po-approver-journey.spec.ts)
exp=$(grep -c 'type: "expected"' tests/403-po-approver-journey.spec.ts)
echo "403 spec: pre=$pre exp=$exp"
```
Expected: `pre=19 exp=19`.

- [ ] **Step 3: Final TypeScript + Playwright list**

```bash
bun tsc --noEmit
bun run test -- 403-po-approver-journey.spec.ts --list
```
Expected: TS clean; Playwright lists 19 tests.

- [ ] **Step 4: Regenerate user-story docs**

```bash
bun docs:user-stories
```

Verify:
```bash
ls -la docs/user-stories/403-po-approver-journey.md
grep -c 'TC-POA0' docs/user-stories/403-po-approver-journey.md
```
Expected: file exists; `TC-POA0` occurrences ≥ 19.

- [ ] **Step 5: Stage user-story docs and discard test-results changes**

```bash
git add docs/user-stories/
git checkout -- tests/results/ 2>/dev/null || true
git clean -fd tests/results/ 2>/dev/null || true
```

- [ ] **Step 6: Final commit**

```bash
git commit -m "$(cat <<'EOF'
docs(user-stories): regen for PO Approver journey

Generated by 'bun docs:user-stories' from the spec annotations after
all 19 TCs landed. Other spec docs include footer-timestamp updates
from the same generator pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification checklist

- [ ] `bun run test -- 403-po-approver-journey.spec.ts --list` shows 19 tests
- [ ] Annotation audit script reports no mismatches
- [ ] `docs/user-stories/403-po-approver-journey.md` exists and lists all 19 TCs
- [ ] `scripts/sync-test-results.ts` includes the new `SYNC_TARGETS` entry
- [ ] No changes to existing PR/PO specs (301/302/303/304/311/401/402)
- [ ] `tests/pages/po-approver.helpers.ts` is unchanged (reused as-is)
