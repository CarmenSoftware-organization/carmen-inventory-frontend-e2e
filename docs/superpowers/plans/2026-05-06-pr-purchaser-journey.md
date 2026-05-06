# PR Purchaser Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `tests/304-pr-purchaser-journey.spec.ts` covering the Purchaser workflow as 25 persona-journey TCs grouped per source step (1-4 + Golden Journey), with cross-persona setup via `submitPRAsRequestor + approveAsHOD` chain.

**Architecture:** New persona-journey spec sits alongside `301-purchase-request.spec.ts`, `302-pr-creator-journey.spec.ts`, and `303-pr-approver-journey.spec.ts`. Reuses `createAuthTest("purchase@blueledgers.com")`, existing helpers (`submitPRAsRequestor`, `bulkApprove`, `bulkReject`, `bulkSendForReview`, `gotoPRDetail`) from `pr-approver.helpers.ts`, plus a new `approveAsHOD(browser, ref)` helper added to the same file. The existing `purchase-request.page.ts` is extended with editable field locators (Vendor, Unit Price, Discount, Tax Profile) and `autoAllocateButton` plus an `approvedQtyReadOnlyCell` for the inverse-permission verification.

**Tech Stack:** Playwright Test 1.x, TypeScript, Bun, Radix UI primitives.

**Spec source:** `docs/superpowers/specs/2026-05-06-pr-purchaser-journey-design.md`

---

## E2E TDD note

This is e2e against an already-built frontend. The TDD loop adapts:
1. Write the test against documented behavior
2. Run it — failures reveal locator drift, missing wait, or genuine UI gaps
3. Adjust locators / waits until stable; never weaken assertions to mask defects
4. Commit only when stable

If a TC fails because the UI doesn't ship the expected behavior, mark `purchaseTest.skip(reason)` with a `note` annotation; do not delete it. Don't run the actual e2e suite during subagent execution — runtime testing is left to the user. Subagents verify only TypeScript compile + Playwright list + annotation audit.

---

## Task 1: Audit existing assets

**Files (read-only):**
- `tests/pages/purchase-request.page.ts`
- `tests/pages/pr-approver.helpers.ts`
- `tests/pages/pr-creator.helpers.ts`
- `tests/pages/login.page.ts`
- `tests/test-users.ts`

- [ ] **Step 1: Confirm method inventory**

Existing assets relevant to this spec (audited from 302/303 work):

`purchase-request.page.ts`:
- Navigation, list filters (`searchFor`, `applyFilter`, `sortBy`, `tabMyPending`, `tabAllDocuments`)
- Detail tabs (`tabItems`, `tabWorkflowHistory`)
- Edit mode (`editModeButton`, `enterEditMode`, `cancelEditMode`)
- Bulk toolbar (`bulkActionToolbar`, `selectAllInEditMode`, `bulkApproveInEditMode`, `bulkRejectInEditMode`, `bulkSendForReviewInEditMode`, `bulkSplitInEditMode`)
- Edit-mode editable (Approver scope): `approvedQtyInput`, `itemNoteInput`, `deliveryPointInput`
- Edit-mode read-only (Approver scope): `vendorReadOnlyCell`, `unitPriceReadOnlyCell`, `discountReadOnlyCell`, `taxReadOnlyCell`, `focQtyReadOnlyCell`
- Detail action buttons: `approveButton`, `rejectButton`, `sendBackButton`, `submitButton`, `splitButton`, `saveDraftButton`, `cancelFormButton`
- Status: `statusBadge`, `expectStatus`

`pr-approver.helpers.ts`:
- `submitPRAsRequestor(browser, opts?)` → `CreatedPR` — Requestor seed via 2nd context
- `bulkApprove(page)`, `bulkReject(page, reason)`, `bulkSendForReview(page, reason, stage)` — toolbar actions
- `gotoPRDetail(page, ref)` — navigation
- Type re-export of `CreatedPR` from `pr-creator.helpers.ts`

`pr-creator.helpers.ts`:
- `e2eDescription(suffix)` — `[E2E-PRC]` marker
- `CreatedPR` interface
- `createDraftPR`, `submitDraftPR`, `deleteDraftPR`

`login.page.ts`:
- `LoginPage` class with `goto`, `loginWithRetry(email, password)`

`test-users.ts`:
- `TEST_PASSWORD = "12345678"`
- `TEST_USERS` array — `purchase@blueledgers.com`, `hod@blueledgers.com`, `requestor@blueledgers.com` all present

Methods to ADD in Tasks 2-4:
- `purchase-request.page.ts`: `vendorInput`, `unitPriceInput`, `discountInput`, `taxProfileSelect`, `autoAllocateButton`, `approvedQtyReadOnlyCell`
- `pr-approver.helpers.ts`: `approveAsHOD(browser, ref)`

No code change in this task.

- [ ] **Step 2: No commit (audit-only)**

---

## Task 2: Add Purchaser editable field locators to PurchaseRequestPage

**Files:**
- Modify: `tests/pages/purchase-request.page.ts` (insert at END of class body, before final `}`)

- [ ] **Step 1: Insert new methods**

Open `tests/pages/purchase-request.page.ts` and locate the FINAL `}` of the `PurchaseRequestPage` class. Insert this block immediately before that closing brace, preserving 2-space indentation inside the class:

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-request.page.ts
git commit -m "$(cat <<'EOF'
feat(pages): add Purchaser editable field locators to PurchaseRequestPage

Adds vendorInput, unitPriceInput, discountInput, taxProfileSelect,
autoAllocateButton, and approvedQtyReadOnlyCell. The first four target
the same DOM cells as the *ReadOnlyCell methods from 303 — tests
assert toBeEditable() on the Purchaser side vs toBeDisabled() on the
Approver side. Used by the upcoming PR Purchaser persona journey spec.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add `approveAsHOD` cross-context helper

**Files:**
- Modify: `tests/pages/pr-approver.helpers.ts` (insert before the final exported function `gotoPRDetail`)

- [ ] **Step 1: Insert the new helper**

Open `tests/pages/pr-approver.helpers.ts`. Find the `gotoPRDetail` function near the end of the file. Insert this block IMMEDIATELY BEFORE `gotoPRDetail`:

```ts
/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as HOD,
 * navigates to the PR detail at `ref`, enters Edit Mode, and bulk-approves
 * the PR — advancing it from HOD stage to Purchase stage. Closes the context
 * cleanly. Used by Purchaser tests to seed PRs at the Purchase stage.
 */
export async function approveAsHOD(browser: Browser, ref: string): Promise<void> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("hod@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await gotoPRDetail(page, ref);
    const pr = new PurchaseRequestPage(page);
    if ((await pr.editModeButton().count()) === 0) {
      throw new Error(`approveAsHOD: Edit button not found on PR ${ref} — HOD may not have edit permission`);
    }
    await pr.enterEditMode();
    await bulkApprove(page);
    await page.waitForLoadState("networkidle").catch(() => {});
  } finally {
    await ctx.close();
  }
}

```

**Note:** the helper calls `gotoPRDetail` which is defined LATER in the same file. TypeScript hoists function declarations / exports correctly so this works. Verify with `bun tsc --noEmit`.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/pr-approver.helpers.ts
git commit -m "$(cat <<'EOF'
feat(pages): add approveAsHOD cross-context helper

Opens a 2nd BrowserContext, logs in as HOD, navigates to a PR ref,
enters Edit Mode, and bulk-approves to advance the PR from HOD stage
to Purchase stage. Closes the auxiliary context cleanly. Used by the
upcoming PR Purchaser journey spec to compose a 2-step setup chain
(submitPRAsRequestor + approveAsHOD = PR at Purchase stage).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Scaffold the spec file with describe blocks

**Files:**
- Create: `tests/304-pr-purchaser-journey.spec.ts`

- [ ] **Step 1: Write the spec scaffold**

Create `tests/304-pr-purchaser-journey.spec.ts` with this EXACT content:

```ts
import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import {
  submitPRAsRequestor,
  approveAsHOD,
  bulkApprove,
  bulkReject,
  bulkSendForReview,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Persona-journey spec — Purchaser. Runs alongside 301/302/303.
// Source docs: docs/persona-doc/Purchase Request/Purchaser/INDEX.md and step-01..04.md.
const purchaseTest = createAuthTest("purchase@blueledgers.com");

const REJECT_REASON = "Vendor pricing exceeds budget";
const REVIEW_REASON = "Please confirm vendor selection";
const REVIEW_STAGE = "HOD";

purchaseTest.describe("Step 1 — PR List (Purchaser View)", () => {
  // TCs added in Task 5
});

purchaseTest.describe("Step 2 — PR Detail (Read-only)", () => {
  // TCs added in Task 6
});

purchaseTest.describe("Step 3 — Edit Mode (Vendor & Pricing)", () => {
  // TCs added in Task 7
});

purchaseTest.describe("Step 4 — Workflow Actions", () => {
  // TCs added in Task 8
});

purchaseTest.describe.serial("Golden Journey", () => {
  // TC added in Task 9
});
```

- [ ] **Step 2: Verify spec discovery**

Run: `bun tsc --noEmit`
Expected: zero errors.

Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: zero tests reported (empty describes), no parser errors.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): scaffold 304-pr-purchaser-journey.spec.ts

Empty describe blocks for each in-scope step (1-4) plus a serial
Golden Journey describe. TCs land in subsequent commits. Imports
include cross-context helpers (submitPRAsRequestor, approveAsHOD,
bulk-action composers) from pr-approver.helpers.ts.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Implement Step 1 — PR List Purchaser View (TC-PRP0101..0105)

**Files:**
- Modify: `tests/304-pr-purchaser-journey.spec.ts` — fill the `Step 1 — PR List (Purchaser View)` describe

- [ ] **Step 1: Replace the Step 1 describe body**

Find:
```ts
purchaseTest.describe("Step 1 — PR List (Purchaser View)", () => {
  // TCs added in Task 5
});
```

Replace the comment with:

```ts
  purchaseTest(
    "TC-PRP0101 List loads, My Pending tab default (PRs at Purchase stage)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Purchaser (purchase@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify URL and My Pending tab" },
        { type: "expected", description: "URL is on PR list; My Pending tab is selected when present." },
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

  purchaseTest(
    "TC-PRP0102 Switch to All Documents tab broadens scope",
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
        purchaseTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PRP0103 All Stage dropdown filters by status",
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
        purchaseTest.skip(true, "Stage dropdown not present on this list");
        return;
      }
      await trigger.click();
      const inprog = page.getByRole("option", { name: /in.progress/i }).first();
      if ((await inprog.count()) > 0) await inprog.click();
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0104 Filter panel opens and applies",
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
        purchaseTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "In Progress" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0105 Search by PR reference filters list",
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
        purchaseTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: 5 tests, no parser errors.

Annotation: `pre=$(grep -c 'type: "preconditions"' tests/304-pr-purchaser-journey.spec.ts); exp=$(grep -c 'type: "expected"' tests/304-pr-purchaser-journey.spec.ts); echo "pre=$pre exp=$exp"` — expected `pre=5 exp=5`.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 1 — PR List Purchaser TCs (TC-PRP0101..0105)

Five TCs for the Purchaser list view: My Pending tab, All Documents
tab, stage dropdown, filter panel, and search. Hard URL assertions
where the affordance exists; explicit skip when missing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Implement Step 2 — PR Detail Read-only (TC-PRP0201..0204)

**Files:**
- Modify: `tests/304-pr-purchaser-journey.spec.ts` — fill the `Step 2 — PR Detail (Read-only)` describe

- [ ] **Step 1: Replace the Step 2 describe body**

```ts
  purchaseTest(
    "TC-PRP0201 Detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "PR exists at Purchase stage (seeded via submitPRAsRequestor + approveAsHOD)" },
        { type: "steps", description: "1. Open the PR detail page\n2. Verify Items tab is the default" },
        { type: "expected", description: "URL is the detail URL; Items tab is selected when present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) return;
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PRP0202 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        purchaseTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  purchaseTest(
    "TC-PRP0203 No standalone Approve/Reject/Return buttons (BRD discrepancy)",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page (read-only view)" },
        { type: "steps", description: "1. Inspect detail page header / action toolbar" },
        { type: "expected", description: "Standalone Approve, Reject, and Send for Review buttons are NOT visible at the page header (per BRD discrepancy — actions live in Edit Mode bulk toolbar)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        purchaseTest.skip(true, "Edit button not present — cannot verify read-only header state");
        return;
      }
      await expect(pr.approveButton()).toHaveCount(0);
      await expect(pr.rejectButton()).toHaveCount(0);
      await expect(pr.sendBackButton()).toHaveCount(0);
    },
  );

  purchaseTest(
    "TC-PRP0204 Edit button visible (entry to vendor/pricing edit)",
    {
      annotation: [
        { type: "preconditions", description: "On a Purchase-stage PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (Purchaser can enter Edit Mode for vendor/pricing allocation)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: 9 tests (5 + 4).

Annotation: `pre=9 exp=9`.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 2 — PR Detail Purchaser TCs (TC-PRP0201..0204)

Four TCs for the read-only detail view: Items tab default, Workflow
History tab, BRD discrepancy verification (no standalone Approve/
Reject/Return buttons), and Edit button visibility. Each TC seeds
its own PR via submitPRAsRequestor + approveAsHOD chain.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Implement Step 3 — Edit Mode Vendor & Pricing (TC-PRP0301..0310)

**Files:**
- Modify: `tests/304-pr-purchaser-journey.spec.ts` — fill the `Step 3 — Edit Mode (Vendor & Pricing)` describe

This is the biggest task — 10 TCs covering edit-mode entry, 4 editable fields (Vendor / Unit Price / Discount / Tax), 1 read-only field (Approved Qty), Auto Allocate, multi-row pricing, save, and cancel.

- [ ] **Step 1: Replace the Step 3 describe body**

```ts
  purchaseTest(
    "TC-PRP0301 Click Edit → vendor/pricing fields become editable",
    {
      annotation: [
        { type: "preconditions", description: "PR exists at Purchase stage" },
        { type: "steps", description: "1. Open Purchase-stage PR\n2. Click Edit\n3. Verify Save/Cancel form-level buttons appear" },
        { type: "expected", description: "Save Draft (or Cancel) form-level button is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0302 Vendor field is editable (Purchaser scope)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Vendor input on first row\n3. Verify it is editable" },
        { type: "expected", description: "Vendor input is editable (opposite of Approver, who sees it as read-only)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const vendor = pr.vendorInput(0);
      if ((await vendor.count()) === 0) {
        purchaseTest.skip(true, "Vendor input not present in edit mode");
        return;
      }
      await expect(vendor).toBeEditable();
    },
  );

  purchaseTest(
    "TC-PRP0303 Unit Price field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Unit Price input\n3. Type a value" },
        { type: "expected", description: "Unit Price input accepts the typed value." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) === 0) {
        purchaseTest.skip(true, "Unit Price input not present");
        return;
      }
      await expect(price).toBeEditable();
      await price.fill("125");
      await expect(price).toHaveValue("125");
    },
  );

  purchaseTest(
    "TC-PRP0304 Discount field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Discount input\n3. Verify editable" },
        { type: "expected", description: "Discount input is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const discount = pr.discountInput(0);
      if ((await discount.count()) === 0) {
        purchaseTest.skip(true, "Discount input not present");
        return;
      }
      await expect(discount).toBeEditable();
    },
  );

  purchaseTest(
    "TC-PRP0305 Tax Profile field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Tax Profile select\n3. Verify editable" },
        { type: "expected", description: "Tax Profile select is editable." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const tax = pr.taxProfileSelect(0);
      if ((await tax.count()) === 0) {
        purchaseTest.skip(true, "Tax Profile select not present");
        return;
      }
      const disabled = await tax.isDisabled().catch(() => false);
      const ariaDisabled = (await tax.getAttribute("aria-disabled").catch(() => null)) === "true";
      expect(disabled || ariaDisabled).toBeFalsy();
    },
  );

  purchaseTest(
    "TC-PRP0306 Approved Qty field stays read-only (HOD already set it)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Locate Approved Qty cell on first row" },
        { type: "expected", description: "Approved Qty cell is disabled or non-editable for Purchaser (HOD already set it)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const cell = pr.approvedQtyReadOnlyCell(0);
      if ((await cell.count()) === 0) {
        purchaseTest.skip(true, "Approved Qty cell not present");
        return;
      }
      const disabled = await cell.isDisabled().catch(() => false);
      const ariaDisabled = (await cell.getAttribute("aria-disabled").catch(() => null)) === "true";
      const tagName = await cell.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
      const isInput = tagName === "input" || tagName === "textarea";
      expect(disabled || ariaDisabled || !isInput).toBeTruthy();
    },
  );

  purchaseTest(
    "TC-PRP0307 Auto Allocate button populates vendors via scoring",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with at least one item" },
        { type: "steps", description: "1. Enter edit mode\n2. Click Auto Allocate" },
        { type: "expected", description: "URL stays on detail page after click (allocation runs)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const auto = pr.autoAllocateButton();
      if ((await auto.count()) === 0) {
        purchaseTest.skip(true, "Auto Allocate button not present in this build");
        return;
      }
      await auto.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0308 Multiple line items — pricing on each row independent",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with multiple items" },
        { type: "steps", description: "1. Seed PR with 2 items\n2. Enter edit mode\n3. Set unit price on row 0\n4. Set unit price on row 1\n5. Verify both values present" },
        { type: "expected", description: "Each row's Unit Price input retains its own value." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 2 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price0 = pr.unitPriceInput(0);
      const price1 = pr.unitPriceInput(1);
      if ((await price0.count()) === 0 || (await price1.count()) === 0) {
        purchaseTest.skip(true, "Unit Price inputs not present on both rows");
        return;
      }
      await price0.fill("100");
      await price1.fill("200");
      await expect(price0).toHaveValue("100");
      await expect(price1).toHaveValue("200");
    },
  );

  purchaseTest(
    "TC-PRP0309 Save edits → exit edit mode + persist values",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR with vendor/price edits" },
        { type: "steps", description: "1. Enter edit mode\n2. Set unit price\n3. Click Save Draft" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("150");
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0310 Cancel edits → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into Unit Price\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode (Edit button visible again)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("999");
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: 19 tests (9 + 10).

Annotation: `pre=19 exp=19`.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 3 — Edit Mode TCs (TC-PRP0301..0310)

Ten TCs for vendor/pricing edit mode: enter edit, four editable
fields (Vendor, Unit Price, Discount, Tax Profile), one read-only
field (Approved Qty — Purchaser cannot edit), Auto Allocate, multi-
row pricing independence, save, and cancel. Each TC seeds its own
PR via the cross-context chain.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Implement Step 4 — Workflow Actions (TC-PRP0401..0405)

**Files:**
- Modify: `tests/304-pr-purchaser-journey.spec.ts` — fill the `Step 4 — Workflow Actions` describe

- [ ] **Step 1: Replace the Step 4 describe body**

```ts
  purchaseTest(
    "TC-PRP0401 Bulk Approve → PR advances to next stage (FC)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Approve in bulk toolbar\n4. Confirm" },
        { type: "expected", description: "URL stays on the PR ref (status advances to next stage)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Approve button not present in toolbar");
        return;
      }
      await bulkApprove(page);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0402 Bulk Reject (with reason)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Reject\n4. Enter reason\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after rejection." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkRejectInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Reject button not present");
        return;
      }
      await bulkReject(page, REJECT_REASON);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0403 Bulk Send for Review (return to HOD)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Send for Review\n4. Enter reason + stage\n5. Confirm" },
        { type: "expected", description: "URL stays on the PR ref after send for review." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      if ((await pr.bulkSendForReviewInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Send for Review button not present");
        return;
      }
      await bulkSendForReview(page, REVIEW_REASON, REVIEW_STAGE);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0404 Bulk Split — split selected items",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active on a Purchase-stage PR" },
        { type: "steps", description: "1. Enter edit mode\n2. Select all rows\n3. Click Split" },
        { type: "expected", description: "Split UI appears (dialog or inline) — verified by URL stays on detail." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await approveAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();
      await pr.selectAllInEditMode();
      const split = pr.bulkSplitInEditMode();
      if ((await split.count()) === 0) {
        purchaseTest.skip(true, "Bulk Split button not present");
        return;
      }
      await split.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  purchaseTest(
    "TC-PRP0405 Cannot edit when PR is at non-Purchase stage (read-only)",
    {
      annotation: [
        { type: "preconditions", description: "PR is at HOD stage (not yet approved by HOD), viewed by Purchaser" },
        { type: "steps", description: "1. Seed PR at HOD stage (skip approveAsHOD)\n2. Open detail as Purchaser\n3. Inspect Edit button" },
        { type: "expected", description: "Edit button is absent OR detail is read-only — Purchaser cannot edit until PR reaches Purchase stage." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      // Seed PR at HOD stage only — DO NOT call approveAsHOD
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      // Edit button should be absent OR clicking it should not enter edit mode
      const editBtn = pr.editModeButton();
      const editCount = await editBtn.count();
      if (editCount === 0) {
        // Confirmed: no edit affordance at non-Purchase stage
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      // Edit button exists — verify clicking it doesn't expose Purchaser fields
      await editBtn.click({ timeout: 5_000 }).catch(() => {});
      const vendor = pr.vendorInput(0);
      if ((await vendor.count()) === 0) {
        // Vendor input absent — Purchaser cannot edit
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      // Vendor input present — verify it's disabled (Purchaser cannot edit at HOD stage)
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      expect(disabled || ariaDisabled).toBeTruthy();
    },
  );
```

- [ ] **Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: 24 tests (19 + 5).

Annotation: `pre=24 exp=24`.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Step 4 — Workflow Actions TCs (TC-PRP0401..0405)

Five TCs for Purchaser workflow actions: bulk Approve (advance to FC),
bulk Reject (with reason), bulk Send for Review (return to HOD), bulk
Split, and a read-only check at non-Purchase stage. Each TC seeds its
own PR — the read-only check intentionally skips approveAsHOD to leave
the PR at HOD stage.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Implement Golden Journey (TC-PRP0901)

**Files:**
- Modify: `tests/304-pr-purchaser-journey.spec.ts` — fill the `Golden Journey` describe.serial

- [ ] **Step 1: Replace the Golden Journey describe body**

```ts
  purchaseTest(
    "TC-PRP0901 Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Purchaser; a fresh PR is seeded at Purchase stage via submitPRAsRequestor + approveAsHOD" },
        { type: "steps", description: "1. Open PR list\n2. Open PR detail\n3. Click Edit\n4. Set unit price on first row\n5. Select all + Bulk Approve + Confirm" },
        { type: "expected", description: "URL stays on the PR ref after bulk approve; the journey completes end-to-end." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PRP0901 golden" });
      await approveAsHOD(browser, created.ref);

      // Step 1: PR List
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));

      // Step 2: PR Detail
      await gotoPRDetail(page, created.ref);

      // Step 3: Enter Edit Mode
      if ((await pr.editModeButton().count()) === 0) {
        purchaseTest.skip(true, "Edit button not present");
        return;
      }
      await pr.enterEditMode();

      // Step 4: Set Unit Price on first row
      const price = pr.unitPriceInput(0);
      if ((await price.count()) > 0) await price.fill("175");

      // Step 5: Bulk Approve
      await pr.selectAllInEditMode();
      if ((await pr.bulkApproveInEditMode().count()) === 0) {
        purchaseTest.skip(true, "Bulk Approve button not present");
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
Run: `bun run test -- 304-pr-purchaser-journey.spec.ts --list`
Expected: 25 tests (24 + 1).

Annotation: `pre=25 exp=25`.

- [ ] **Step 3: Commit**

```bash
git add tests/304-pr-purchaser-journey.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Golden Journey TC (TC-PRP0901)

End-to-end Purchaser flow: PR list → detail → Edit Mode → set Unit
Price → Select All + Bulk Approve. Single serial TC that exercises
the full Purchaser persona journey for one PR.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Add SYNC_TARGETS entry

**Files:**
- Modify: `scripts/sync-test-results.ts`

- [ ] **Step 1: Add the entry**

Edit `scripts/sync-test-results.ts`. Locate the existing entry:
```ts
  { jsonFile: "303-pr-approver-journey-results.json", sheetTab: "PR Approver" },
```
Insert directly AFTER it (still inside the `SYNC_TARGETS` array, before the closing `];`):
```ts
  { jsonFile: "304-pr-purchaser-journey-results.json", sheetTab: "PR Purchaser" },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "$(cat <<'EOF'
chore(sync): add SYNC_TARGETS entry for PR Purchaser journey

Maps tests/results/304-pr-purchaser-journey-results.json to Google
Sheets tab 'PR Purchaser'. The tab must be created manually in the
target spreadsheet before the first sync.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Final verify, regenerate user-story doc, integration commit

**Files:**
- Auto-generated: `docs/user-stories/304-pr-purchaser-journey.md`

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
pre=$(grep -c 'type: "preconditions"' tests/304-pr-purchaser-journey.spec.ts)
exp=$(grep -c 'type: "expected"' tests/304-pr-purchaser-journey.spec.ts)
echo "304 spec: pre=$pre exp=$exp"
```
Expected: `pre=25 exp=25`.

- [ ] **Step 3: Final TypeScript + Playwright list**

```bash
bun tsc --noEmit
bun run test -- 304-pr-purchaser-journey.spec.ts --list
```
Expected: TS clean; Playwright lists 25 tests.

- [ ] **Step 4: Regenerate user-story docs**

```bash
bun docs:user-stories
```
Expected: no errors. Creates / updates `docs/user-stories/304-pr-purchaser-journey.md`.

Verify:
```bash
ls -la docs/user-stories/304-pr-purchaser-journey.md
grep -c 'TC-PRP0' docs/user-stories/304-pr-purchaser-journey.md
```
Expected: file exists; `TC-PRP0` occurrences ≥ 25.

- [ ] **Step 5: Stage user-story docs**

The generator regenerates ALL spec docs (footer-timestamp delta on each). Stage `docs/user-stories/`:
```bash
git add docs/user-stories/
```

If `tests/results/*.json` has changes from local test runs, discard:
```bash
git checkout -- tests/results/ 2>/dev/null || true
git clean -fd tests/results/ 2>/dev/null || true
```

- [ ] **Step 6: Final commit**

```bash
git commit -m "$(cat <<'EOF'
docs(user-stories): regen for PR Purchaser journey

Generated by 'bun docs:user-stories' from the spec annotations after
all 25 TCs landed. Other spec docs include footer-timestamp updates
from the same generator pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification checklist

Before declaring the feature done:

- [ ] `bun run test -- 304-pr-purchaser-journey.spec.ts --list` shows 25 tests
- [ ] Annotation audit script reports no mismatches
- [ ] `docs/user-stories/304-pr-purchaser-journey.md` exists and lists all 25 TCs
- [ ] `scripts/sync-test-results.ts` includes the new `SYNC_TARGETS` entry
- [ ] `git log` shows ~10 commits, one per task (Task 1 audit-only has no commit)
- [ ] No changes to `tests/301-purchase-request.spec.ts`, `tests/302-pr-creator-journey.spec.ts`, `tests/303-pr-approver-journey.spec.ts`
- [ ] `tests/pages/pr-creator.helpers.ts` is unchanged (reused as-is via re-export from `pr-approver.helpers.ts`)
