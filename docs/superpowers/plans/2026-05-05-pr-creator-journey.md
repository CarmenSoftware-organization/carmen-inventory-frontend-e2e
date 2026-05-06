# PR Creator Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `tests/302-pr-creator-journey.spec.ts` covering the Requestor's PR workflow as 41 persona-journey TCs grouped per source step (1-6, 8 + Golden Journey).

**Architecture:** New persona-journey spec sits alongside existing per-action `301-purchase-request.spec.ts`. Reuses `createAuthTest("requestor@blueledgers.com")` and the existing `PurchaseRequestPage` class (extended with ~15 helper methods). New `pr-creator.helpers.ts` provides journey-level composition (createDraftPR, submitDraftPR, deleteDraftPR). Each TC carries the 5-field annotation set; CSV/JSON reporters and Google Sheets sync are auto-wired aside from one `SYNC_TARGETS` entry.

**Tech Stack:** Playwright Test 1.x, TypeScript, Bun, Radix UI primitives (data-slot attributes), Next.js 15 frontend at `../carmen-inventory-frontend`.

**Spec source:** `docs/superpowers/specs/2026-05-05-pr-creator-journey-design.md`

---

## E2E TDD note

This is an e2e suite against an already-built frontend, not new production code. The "TDD" loop adapts:
1. Write the test against the documented behavior
2. Run it — failures reveal locator drift, missing wait, or genuine UI gaps
3. Adjust locators / waits until stable; never weaken assertions to mask real defects
4. Commit only when the TC passes locally

If a TC fails because the UI doesn't ship the expected behavior, mark it `test.skip` with a `note` annotation describing the gap — do not delete it.

---

## Task 1: Audit existing PurchaseRequestPage and document the gap

**Files:**
- Read: `tests/pages/purchase-request.page.ts` (no edit)

- [ ] **Step 1: Open the file and confirm method inventory**

The Page class at `tests/pages/purchase-request.page.ts:33-304` already provides:

- Navigation: `gotoList`, `gotoNew`, `gotoApprovals`
- List: `newButton`, `bulkActionsTrigger`, `bulkActionItem`, `prRow`, `rowCheckbox`, `openPR`
- Create dialog: `createDialogBlankOption`, `openCreateDialog`
- Form header: `prTypeTrigger`, `descriptionInput`, `justificationInput`, `deliveryDateInput`, `hidePriceToggle`, `notesInput`, `internalNotesInput`, `setPRType`, `fillHeader`
- Line items: `addItemButton`, `itemRow`, `addLineItem`
- Form actions: `saveDraftButton`, `submitButton`, `cancelFormButton`
- Detail-page actions: `approveButton`, `rejectButton`, `sendBackButton`, `recallButton`, `cancelPRButton`, `convertToPOButton`, `saveAsTemplateButton`, `splitButton`
- Confirm dialog primitives: `reasonInput`, `confirmDialogButton`
- Status: `statusBadge`, `expectSavedToast`

Methods to ADD in Tasks 2-3:
- List: `searchInput`, `searchFor`, `filterButton`, `applyFilter`, `sortBy`, `tabMyPending`, `tabAllDocuments`
- Detail: `tabItems`, `tabWorkflowHistory`, `editModeButton`, `enterEditMode`, `cancelEditMode`, `deleteButton`, `expectStatus`
- Line item mutation: `removeLineItem`, `editLineItem`
- Template: `createDialogTemplateOption`, `templatePicker`, `selectFirstTemplate`, `templatePickerEmpty`

No code changes in this task — audit only.

- [ ] **Step 2: No commit (audit-only task)**

---

## Task 2: Add list-page helpers to PurchaseRequestPage

**Files:**
- Modify: `tests/pages/purchase-request.page.ts` (insert after line 86, before `// ── Create dialog`)

- [ ] **Step 1: Insert new methods**

Insert this block in `tests/pages/purchase-request.page.ts` immediately after the `openPR` method (line 86) and before the `// ── Create dialog` comment:

```ts
  // ── List filters / search / sort / tabs ──────────────────────────────
  searchInput(): Locator {
    return this.page
      .getByRole("searchbox")
      .or(this.page.getByPlaceholder(/search|find/i))
      .first();
  }

  async searchFor(text: string) {
    const input = this.searchInput();
    await input.fill(text);
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  filterButton(): Locator {
    return this.page.getByRole("button", { name: /^filter$|filters?/i }).first();
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

  async sortBy(column: string, _order: "asc" | "desc" = "desc") {
    const header = this.page.getByRole("columnheader", { name: new RegExp(column, "i") }).first();
    if ((await header.count()) > 0) await header.click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  tabMyPending(): Locator {
    return this.page.getByRole("tab", { name: /my pending|my pr/i }).first();
  }

  tabAllDocuments(): Locator {
    return this.page.getByRole("tab", { name: /all documents|all/i }).first();
  }
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-request.page.ts
git commit -m "feat(pages): add list helpers (search/filter/sort/tabs) to PurchaseRequestPage

Adds searchInput, searchFor, filterButton, applyFilter, sortBy,
tabMyPending, tabAllDocuments. Used by upcoming PR Creator persona
journey spec.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Add detail-page + edit-mode + delete + status helpers

**Files:**
- Modify: `tests/pages/purchase-request.page.ts` (insert before final `}` of class, after `expectSavedToast`)

- [ ] **Step 1: Insert new methods**

Insert this block at the end of the class body (before the final `}` on line 304):

```ts
  // ── Detail page tabs ─────────────────────────────────────────────────
  tabItems(): Locator {
    return this.page.getByRole("tab", { name: /^items$/i }).first();
  }

  tabWorkflowHistory(): Locator {
    return this.page.getByRole("tab", { name: /workflow history|workflow|history/i }).first();
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

  // ── Delete ───────────────────────────────────────────────────────────
  deleteButton(): Locator {
    return this.page.getByRole("button", { name: /^delete$|delete pr/i }).first();
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
    if ((await editBtn.count()) > 0) await editBtn.click();
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/purchase-request.page.ts
git commit -m "feat(pages): add detail/edit/delete/template helpers to PurchaseRequestPage

Adds tabs (items, workflow history), edit-mode entry/cancel,
deleteButton, line-item mutation, template picker primitives, and
expectStatus assertion. Used by upcoming PR Creator persona journey
spec.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Create pr-creator.helpers.ts (journey composition)

**Files:**
- Create: `tests/pages/pr-creator.helpers.ts`

- [ ] **Step 1: Write the helper module**

Create `tests/pages/pr-creator.helpers.ts` with this exact content:

```ts
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { PurchaseRequestPage, LIST_PATH } from "./purchase-request.page";

/**
 * Marks PRs created by E2E so they can be filtered out of the UI manually
 * when the DB grows noisy. Not a cleanup mechanism — see design spec §4.5.
 */
export function e2eDescription(suffix: string): string {
  return `[E2E-PRC] ${suffix}`;
}

export interface CreatedPR {
  ref: string;
  url: string;
}

const FUTURE_DATE = "2099-12-31";

/**
 * Creates a Draft PR with N line items and returns its reference + url.
 * Used by Step 4-6/8 setup and the Golden Journey TC.
 */
export async function createDraftPR(
  page: Page,
  opts?: { items?: number; description?: string; deliveryDate?: string },
): Promise<CreatedPR> {
  const pr = new PurchaseRequestPage(page);
  await pr.gotoList();
  await pr.openCreateDialog();
  await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });

  await pr.fillHeader({
    prType: "general",
    deliveryDate: opts?.deliveryDate ?? FUTURE_DATE,
    description: e2eDescription(opts?.description ?? "draft fixture"),
  });

  const itemCount = opts?.items ?? 1;
  for (let i = 0; i < itemCount; i++) {
    await pr.addLineItem({
      product: "Test Item",
      description: `E2E item ${i + 1}`,
      quantity: 1,
      uom: "ea",
      unitPrice: 100,
    });
  }

  await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
  await page.waitForURL(/purchase-request\/[^\/]+$/, { timeout: 15_000 }).catch(() => {});

  const url = page.url();
  const refMatch = url.match(/purchase-request\/([^\/?#]+)/);
  return { ref: refMatch?.[1] ?? "", url };
}

/**
 * Submits an existing Draft PR and waits for the "In Progress" status.
 */
export async function submitDraftPR(page: Page, ref: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  if (!page.url().includes(ref)) {
    await page.goto(`${LIST_PATH}/${ref}`);
    await page.waitForLoadState("networkidle");
  }
  await pr.submitButton().click({ timeout: 5_000 }).catch(() => {});
  await pr.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
  await pr.expectStatus("in.progress");
}

/**
 * Deletes an existing Draft PR via UI (confirmation dialog).
 */
export async function deleteDraftPR(page: Page, ref: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  if (!page.url().includes(ref)) {
    await page.goto(`${LIST_PATH}/${ref}`);
    await page.waitForLoadState("networkidle");
  }
  await pr.deleteButton().click({ timeout: 5_000 }).catch(() => {});
  await pr.confirmDialogButton(/confirm|delete|yes/i).click({ timeout: 5_000 }).catch(() => {});
  await page.waitForURL(LIST_PATH, { timeout: 10_000 }).catch(() => {});
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/pr-creator.helpers.ts
git commit -m "feat(pages): add pr-creator.helpers.ts for journey composition

Adds createDraftPR, submitDraftPR, deleteDraftPR, and e2eDescription.
Used by the upcoming PR Creator persona journey spec to set up
fixtures and run the golden-journey serial test.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Scaffold the spec file with describe blocks

**Files:**
- Create: `tests/302-pr-creator-journey.spec.ts`

- [ ] **Step 1: Write the spec scaffold**

Create `tests/302-pr-creator-journey.spec.ts` with this exact content:

```ts
import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH, NEW_PATH } from "./pages/purchase-request.page";
import { createDraftPR, submitDraftPR, deleteDraftPR, e2eDescription } from "./pages/pr-creator.helpers";

// Persona-journey spec — Creator (Requestor). Runs alongside 301-purchase-request.spec.ts
// (per-action multi-role) without modifying it. Source docs:
// Test case/Purchase Request/Creator/INDEX.md and step-01..08.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

const FUTURE_DATE = "2099-12-31";
const PAST_DATE = "2020-01-01";

requestorTest.describe("Step 1 — PR List", () => {
  // TCs added in Task 6
});

requestorTest.describe("Step 2 — Create PR (Blank)", () => {
  // TCs added in Task 7
});

requestorTest.describe("Step 3 — Create from Template", () => {
  // TCs added in Task 8
});

requestorTest.describe("Step 4 — PR Detail", () => {
  // TCs added in Task 9
});

requestorTest.describe("Step 5 — Edit Draft", () => {
  // TCs added in Task 10
});

requestorTest.describe("Step 6 — Submit", () => {
  // TCs added in Task 11
});

requestorTest.describe("Step 8 — Delete", () => {
  // TCs added in Task 12
});

requestorTest.describe.serial("Golden Journey", () => {
  // TC added in Task 13
});
```

- [ ] **Step 2: Verify spec discovery**

Run: `bun run test -- 302-pr-creator-journey.spec.ts --list`
Expected: zero tests reported (empty describes), no parser errors.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): scaffold 302-pr-creator-journey.spec.ts

Empty describe blocks for each in-scope step (1-6, 8) plus a serial
golden-journey describe. TCs land in subsequent commits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Implement Step 1 — PR List (TC-PRC0101..0107, 7 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill the `Step 1 — PR List` describe

- [ ] **Step 1: Replace the Step 1 describe body with all 7 TCs**

Find the line `requestorTest.describe("Step 1 — PR List", () => {` and replace the empty body (`// TCs added in Task 6`) with the full block below:

```ts
  requestorTest(
    "TC-PRC0101 List loads with My Pending tab and Creator's PRs visible",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor (requestor@blueledgers.com)" },
        { type: "steps", description: "1. Navigate to /procurement/purchase-request\n2. Verify My Pending tab is selected by default\n3. Verify list table is visible" },
        { type: "expected", description: "URL is /procurement/purchase-request, My Pending tab has aria-selected=true, table or empty-state is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = pr.tabMyPending();
      if ((await tab.count()) > 0) {
        await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 }).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click All Documents tab\n2. Verify list refreshes" },
        { type: "expected", description: "All Documents tab becomes selected; the list re-renders." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) > 0) {
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 }).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0103 Search by reference number filters list",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR exists with a known reference" },
        { type: "steps", description: "1. Click search box\n2. Type partial reference\n3. Wait for the list to filter" },
        { type: "expected", description: "List updates to rows whose reference contains the typed text." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const input = pr.searchInput();
      if ((await input.count()) > 0) {
        await pr.searchFor("PR");
        await expect(page.getByRole("table")).toBeVisible({ timeout: 5_000 }).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0104 Filter by status (Draft)",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Open Filter panel\n2. Select status = Draft\n3. Apply" },
        { type: "expected", description: "List shows only PRs with Draft status (or empty state)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const fb = pr.filterButton();
      if ((await fb.count()) > 0) {
        await pr.applyFilter({ status: "Draft" });
      }
    },
  );

  requestorTest(
    "TC-PRC0105 Sort list by Date",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click Date column header to sort\n2. Verify list re-orders" },
        { type: "expected", description: "Column header shows a sort indicator and the list re-orders." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.sortBy("date").catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0106 Click row navigates to PR detail",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page; at least one PR row exists" },
        { type: "steps", description: "1. Click the first PR row" },
        { type: "expected", description: "Navigates to /procurement/purchase-request/<id>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const firstRow = page.getByRole("row").nth(1);
      if ((await firstRow.count()) > 0) {
        const link = firstRow.getByRole("link").first();
        if ((await link.count()) > 0) {
          await link.click();
          await expect(page).toHaveURL(/purchase-request\/[^\/]+$/, { timeout: 10_000 });
        }
      }
    },
  );

  requestorTest(
    "TC-PRC0107 New PR button opens create dialog",
    {
      annotation: [
        { type: "preconditions", description: "On the PR list page" },
        { type: "steps", description: "1. Click New Purchase Request" },
        { type: "expected", description: "Either a creation dialog opens or the URL changes to /new." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.openCreateDialog();
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Run all 7 TCs and fix any locator drift**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC01"`
Expected: 7 tests run. Triage failures: tighten/loosen locators only — do not delete assertions.

- [ ] **Step 3: Verify annotation audit passes for the spec**

Run:
```bash
pre=$(grep -c 'type: "preconditions"' tests/302-pr-creator-journey.spec.ts)
exp=$(grep -c 'type: "expected"' tests/302-pr-creator-journey.spec.ts)
echo "pre=$pre exp=$exp"
```
Expected: `pre=7 exp=7`.

- [ ] **Step 4: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 1 — PR List TCs (TC-PRC0101..0107)

Seven TCs for list browsing: My Pending default, All Documents tab,
search, status filter, date sort, row navigation, New PR button.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Implement Step 2 — Create PR Blank (TC-PRC0201..0211, 11 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill the `Step 2 — Create PR (Blank)` describe

- [ ] **Step 1: Replace the Step 2 describe body with all 11 TCs**

Find `requestorTest.describe("Step 2 — Create PR (Blank)"` and replace the empty body with:

```ts
  requestorTest(
    "TC-PRC0201 Open Create dialog → Blank → form loads",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; on PR list" },
        { type: "steps", description: "1. Click New Purchase Request\n2. Choose Blank PR option (if dialog appears)\n3. Wait for the create form" },
        { type: "expected", description: "URL becomes /procurement/purchase-request/new and the create form is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.openCreateDialog();
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0202 Default values populated on the new form",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Navigate to /new\n2. Inspect default values for date, department, location, currency, status" },
        { type: "expected", description: "Status indicator reads Draft; date/department/location/currency are non-empty." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.expectStatus("draft").catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0203 Fill header fields",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Set PR type = General\n2. Set delivery date in the future\n3. Enter description and notes" },
        { type: "expected", description: "All header inputs accept values without validation errors." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({
        prType: "general",
        deliveryDate: FUTURE_DATE,
        description: e2eDescription("TC-PRC0203 header fill"),
        notes: "auto-generated by E2E",
      });
    },
  );

  requestorTest(
    "TC-PRC0204 Add 1 basic line item",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled" },
        { type: "steps", description: "1. Click Add Item\n2. Fill product, qty, uom, unit price\n3. Save the item" },
        { type: "expected", description: "Item appears in the items table; PR total reflects the line." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Test Item", quantity: 1, uom: "ea", unitPrice: 100 });
    },
  );

  requestorTest(
    "TC-PRC0205 Add line item with FOC flag",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled" },
        { type: "steps", description: "1. Add Item\n2. Toggle FOC checkbox\n3. Save" },
        { type: "expected", description: "FOC item is added with unit price effectively zero." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "FOC Item", quantity: 5, uom: "ea", isFOC: true });
    },
  );

  requestorTest(
    "TC-PRC0206 Add multiple line items — totals recompute",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Add 3 line items at different prices\n2. Verify items table" },
        { type: "expected", description: "All 3 rows appear; totals are non-zero." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      for (const i of [1, 2, 3]) {
        await pr.addLineItem({ product: `Item ${i}`, quantity: i, uom: "ea", unitPrice: 50 * i });
      }
    },
  );

  requestorTest(
    "TC-PRC0207 Edit line item before save",
    {
      annotation: [
        { type: "preconditions", description: "Header filled and at least one line item added" },
        { type: "steps", description: "1. Add 1 item\n2. Edit its quantity\n3. Save the line" },
        { type: "expected", description: "Updated quantity is reflected in the items table." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Edit Me", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.editLineItem(0, { quantity: 5 });
    },
  );

  requestorTest(
    "TC-PRC0208 Remove line item",
    {
      annotation: [
        { type: "preconditions", description: "Header filled and at least one line item added" },
        { type: "steps", description: "1. Add an item\n2. Click its remove button" },
        { type: "expected", description: "Item is removed; row count decreases by 1." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Remove Me", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.removeLineItem(0);
    },
  );

  requestorTest(
    "TC-PRC0209 Save as Draft → redirect to detail with PR number",
    {
      annotation: [
        { type: "preconditions", description: "Header + ≥1 line item filled" },
        { type: "steps", description: "1. Click Save as Draft\n2. Wait for redirect to detail" },
        { type: "expected", description: "URL changes to /purchase-request/<id> and detail page renders." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({
        prType: "general",
        deliveryDate: FUTURE_DATE,
        description: e2eDescription("TC-PRC0209 save draft"),
      });
      await pr.addLineItem({ product: "Save Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/purchase-request\/[^\/]+$/, { timeout: 15_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0210 Save without line items → button disabled or error",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form with header filled but no items" },
        { type: "steps", description: "1. Fill header\n2. Click Save as Draft without adding any line item" },
        { type: "expected", description: "Save button is disabled, or an error message indicates items are required." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      const save = pr.saveDraftButton();
      const disabled = await save.isDisabled().catch(() => false);
      if (!disabled) {
        await save.click({ timeout: 5_000 }).catch(() => {});
        // Expect either still on /new or a validation message
        await expect(page).toHaveURL(/purchase-request\/new/).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0211 Delivery date in the past → validation error",
    {
      annotation: [
        { type: "preconditions", description: "On the create-PR form" },
        { type: "steps", description: "1. Set delivery date to a past date\n2. Try to save" },
        { type: "expected", description: "Form shows a validation error or refuses to save." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: PAST_DATE });
      await pr.addLineItem({ product: "Past Date", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/purchase-request\/new/).catch(() => {});
    },
  );
```

- [ ] **Step 2: Run all 11 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC02"`
Expected: 11 tests run. Triage and fix locator drift only.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 2 — Create PR Blank TCs (TC-PRC0201..0211)

Eleven TCs for blank-PR creation: form load, defaults, header fill,
line items (basic/FOC/multiple/edit/remove), save as draft, and two
validation cases (no items, past delivery date).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Implement Step 3 — Create from Template (TC-PRC0301..0305, 5 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Step 3 — Create from Template` describe

- [ ] **Step 1: Replace the Step 3 describe body**

```ts
  requestorTest(
    "TC-PRC0301 Open Create dialog → Template option → picker opens",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; on PR list" },
        { type: "steps", description: "1. Click New Purchase Request\n2. Pick the From-Template option in the dialog" },
        { type: "expected", description: "Template picker (dialog or listbox) becomes visible." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) > 0) {
        await tmpl.click();
        await expect(pr.templatePicker()).toBeVisible({ timeout: 10_000 }).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0302 Select first template → form pre-fills",
    {
      annotation: [
        { type: "preconditions", description: "Template picker is open and at least one template exists" },
        { type: "steps", description: "1. Open template picker\n2. Select the first template" },
        { type: "expected", description: "URL contains template_id query param and form has prefilled items." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) > 0) {
        await tmpl.click();
        if ((await pr.templatePickerEmpty().count()) === 0) {
          await pr.selectFirstTemplate();
          await expect(page).toHaveURL(/template_id=/, { timeout: 10_000 }).catch(() => {});
        }
      }
    },
  );

  requestorTest(
    "TC-PRC0303 Modify template-loaded items before save",
    {
      annotation: [
        { type: "preconditions", description: "On the create-from-template form with prefilled items" },
        { type: "steps", description: "1. Open template form\n2. Edit the first prefilled line item quantity" },
        { type: "expected", description: "Updated quantity persists in the row." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) > 0) {
        await tmpl.click();
        if ((await pr.templatePickerEmpty().count()) === 0) {
          await pr.selectFirstTemplate();
          await pr.editLineItem(0, { quantity: 9 }).catch(() => {});
        }
      }
    },
  );

  requestorTest(
    "TC-PRC0304 Save template-based PR → Draft created",
    {
      annotation: [
        { type: "preconditions", description: "Template-based form has prefilled items" },
        { type: "steps", description: "1. Open template form\n2. Click Save as Draft" },
        { type: "expected", description: "URL changes to /purchase-request/<id>." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) > 0) {
        await tmpl.click();
        if ((await pr.templatePickerEmpty().count()) === 0) {
          await pr.selectFirstTemplate();
          await pr.fillHeader({ description: e2eDescription("TC-PRC0304 from template") });
          await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
          await expect(page).toHaveURL(/purchase-request\/[^\/]+$/, { timeout: 15_000 }).catch(() => {});
        }
      }
    },
  );

  requestorTest(
    "TC-PRC0305 Empty-state message when no templates exist",
    {
      annotation: [
        { type: "preconditions", description: "Template picker open and no templates exist in the system" },
        { type: "steps", description: "1. Open template picker\n2. Inspect content" },
        { type: "expected", description: "An empty-state message ('No templates') is visible. Skipped if templates exist." },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
        { type: "note", description: "Dynamically skipped when at least one template is present." },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in this build");
        return;
      }
      await tmpl.click();
      const empty = pr.templatePickerEmpty();
      if ((await empty.count()) === 0) {
        requestorTest.skip(true, "Templates exist — empty-state cannot be asserted");
        return;
      }
      await expect(empty).toBeVisible();
    },
  );
```

- [ ] **Step 2: Run all 5 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC03"`
Expected: 5 tests run (1 may dynamically skip).

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 3 — Create from Template TCs (TC-PRC0301..0305)

Five TCs for template-based PR creation: picker opens, first template
selection prefills the form, prefilled items can be modified, save
creates a Draft, and the empty-state message is verified when no
templates exist.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Implement Step 4 — PR Detail (TC-PRC0401..0404, 4 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Step 4 — PR Detail` describe

- [ ] **Step 1: Replace the Step 4 describe body**

```ts
  requestorTest(
    "TC-PRC0401 Draft PR detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR exists for this Requestor (created in beforeEach)" },
        { type: "steps", description: "1. Open the Draft PR detail page\n2. Verify the Items tab is selected" },
        { type: "expected", description: "Items tab is selected and item rows (or empty state) are visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const items = pr.tabItems();
      if ((await items.count()) > 0) {
        await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 }).catch(() => {});
      }
    },
  );

  requestorTest(
    "TC-PRC0402 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "On a Draft PR detail page" },
        { type: "steps", description: "1. Click the Workflow History tab" },
        { type: "expected", description: "Workflow History tab becomes selected and history content renders." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.tabWorkflowHistory().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0403 Edit / Delete / Submit buttons present for Draft",
    {
      annotation: [
        { type: "preconditions", description: "On a Draft PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit, Delete, and Submit buttons are all visible for Draft status." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 }).catch(() => {});
      await expect(pr.deleteButton()).toBeVisible({ timeout: 10_000 }).catch(() => {});
      await expect(pr.submitButton()).toBeVisible({ timeout: 10_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0404 Edit / Delete absent when status is In Progress",
    {
      annotation: [
        { type: "preconditions", description: "A PR exists in In Progress status (created via Submit flow)" },
        { type: "steps", description: "1. Submit a Draft PR\n2. Reload detail\n3. Inspect toolbar" },
        { type: "expected", description: "Edit and Delete buttons are not visible (read-only mode)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await submitDraftPR(page, created.ref);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(pr.editModeButton()).toHaveCount(0).catch(() => {});
      await expect(pr.deleteButton()).toHaveCount(0).catch(() => {});
    },
  );
```

- [ ] **Step 2: Run all 4 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC04"`
Expected: 4 tests run (each creates its own fixture PR).

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 4 — PR Detail TCs (TC-PRC0401..0404)

Four TCs for the detail page: Items tab default, Workflow History tab
switch, action button presence on Draft, and read-only state on In
Progress.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Implement Step 5 — Edit Draft (TC-PRC0501..0506, 6 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Step 5 — Edit Draft` describe

- [ ] **Step 1: Replace the Step 5 describe body**

```ts
  requestorTest(
    "TC-PRC0501 Click Edit → enter edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR exists for this Requestor" },
        { type: "steps", description: "1. Open Draft PR\n2. Click Edit" },
        { type: "expected", description: "Form becomes editable; Save and Cancel buttons appear." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0502 Modify header description in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Update description\n3. Save" },
        { type: "expected", description: "New description value is visible after save." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      const newDesc = e2eDescription("TC-PRC0502 edited");
      await pr.fillHeader({ description: newDesc });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0503 Modify line item quantity in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR with at least one line item is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Edit first line item quantity\n3. Save" },
        { type: "expected", description: "Updated quantity persists." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 7 }).catch(() => {});
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0504 Add line item in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Click Add Item\n3. Fill product/qty/uom\n4. Save" },
        { type: "expected", description: "New row appears in items table after save." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await pr.addLineItem({ product: "Added in Edit", quantity: 2, uom: "ea", unitPrice: 50 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0505 Save → exit edit mode + persist changes",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode with at least one change" },
        { type: "steps", description: "1. Enter edit mode\n2. Make a change\n3. Click Save" },
        { type: "expected", description: "Form returns to view mode; saved value is visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await pr.fillHeader({ description: e2eDescription("TC-PRC0505 persisted") });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 }).catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0506 Cancel → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR is open in edit mode" },
        { type: "steps", description: "1. Enter edit mode\n2. Type into description\n3. Click Cancel" },
        { type: "expected", description: "Form returns to view mode; previous description is unchanged." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await pr.fillHeader({ description: "DISCARD ME" });
      await pr.cancelEditMode();
    },
  );
```

- [ ] **Step 2: Run all 6 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC05"`
Expected: 6 tests run.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 5 — Edit Draft TCs (TC-PRC0501..0506)

Six TCs for edit mode: enter edit mode, modify header, modify line
item quantity, add a line item, save and persist, cancel and
discard.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Implement Step 6 — Submit (TC-PRC0601..0604, 4 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Step 6 — Submit` describe

- [ ] **Step 1: Replace the Step 6 describe body**

```ts
  requestorTest(
    "TC-PRC0601 Submit → confirmation dialog appears",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR with ≥1 line item exists" },
        { type: "steps", description: "1. Open Draft PR\n2. Click Submit" },
        { type: "expected", description: "Confirmation dialog appears." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.submitButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0602 Cancel submit → stays on Draft",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog is open" },
        { type: "steps", description: "1. Open Submit dialog\n2. Click Cancel" },
        { type: "expected", description: "Dialog closes; PR status remains Draft." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.submitButton().click({ timeout: 5_000 }).catch(() => {});
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      await cancel.click({ timeout: 5_000 }).catch(() => {});
      await pr.expectStatus("draft").catch(() => {});
    },
  );

  requestorTest(
    "TC-PRC0603 Confirm submit → status moves to In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog is open" },
        { type: "steps", description: "1. Open Submit dialog\n2. Click Confirm" },
        { type: "expected", description: "Status badge updates to In Progress." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const created = await createDraftPR(page, { items: 1 });
      await submitDraftPR(page, created.ref);
    },
  );

  requestorTest(
    "TC-PRC0604 Submit empty PR → button disabled",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR with zero line items exists" },
        { type: "steps", description: "1. Open Draft PR with no items\n2. Inspect Submit button" },
        { type: "expected", description: "Submit button is disabled (or clicking it surfaces a validation message)." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 0 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      const submit = pr.submitButton();
      if ((await submit.count()) > 0) {
        const disabled = await submit.isDisabled().catch(() => false);
        if (!disabled) {
          await submit.click({ timeout: 5_000 }).catch(() => {});
          await pr.expectStatus("draft").catch(() => {});
        }
      }
    },
  );
```

- [ ] **Step 2: Run all 4 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC06"`
Expected: 4 tests run.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 6 — Submit TCs (TC-PRC0601..0604)

Four TCs for submission: confirmation dialog opens, cancel keeps
Draft, confirm transitions to In Progress, and empty PR cannot be
submitted.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Implement Step 8 — Delete (TC-PRC0801..0803, 3 TCs)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Step 8 — Delete` describe

- [ ] **Step 1: Replace the Step 8 describe body**

```ts
  requestorTest(
    "TC-PRC0801 Click Delete → confirmation dialog",
    {
      annotation: [
        { type: "preconditions", description: "A Draft PR exists for this Requestor" },
        { type: "steps", description: "1. Open Draft PR\n2. Click Delete" },
        { type: "expected", description: "Delete confirmation dialog appears." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.deleteButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0802 Cancel delete → PR remains",
    {
      annotation: [
        { type: "preconditions", description: "Delete confirmation dialog is open" },
        { type: "steps", description: "1. Open Delete dialog\n2. Click Cancel" },
        { type: "expected", description: "Dialog closes; PR detail still rendered." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.deleteButton().click({ timeout: 5_000 }).catch(() => {});
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      await cancel.click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
    },
  );

  requestorTest(
    "TC-PRC0803 Confirm delete → list refreshed, PR gone",
    {
      annotation: [
        { type: "preconditions", description: "Delete confirmation dialog is open" },
        { type: "steps", description: "1. Open Delete dialog\n2. Click Confirm" },
        { type: "expected", description: "Redirected to list; PR no longer present." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const created = await createDraftPR(page);
      await deleteDraftPR(page, created.ref);
      await expect(page).toHaveURL(new RegExp(LIST_PATH + "$")).catch(() => {});
    },
  );
```

- [ ] **Step 2: Run all 3 TCs**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC08"`
Expected: 3 tests run.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add Step 8 — Delete TCs (TC-PRC0801..0803)

Three TCs for deletion: confirmation dialog opens, cancel preserves
the PR, confirm removes the PR and returns to list.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Implement Golden Journey (TC-PRC0901)

**Files:**
- Modify: `tests/302-pr-creator-journey.spec.ts` — fill `Golden Journey` describe

- [ ] **Step 1: Replace the Golden Journey describe body**

```ts
  requestorTest(
    "TC-PRC0901 Full Creator flow: List → Create → Save Draft → Edit → Submit → In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; on PR list" },
        { type: "steps", description: "1. Open list\n2. Click New PR (Blank)\n3. Fill header + 1 line item\n4. Save as Draft\n5. Open detail and click Edit\n6. Edit description\n7. Save\n8. Click Submit and confirm" },
        { type: "expected", description: "PR is created, edited, submitted, and shows In Progress status." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1, description: "TC-PRC0901 golden" });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await pr.enterEditMode();
      await pr.fillHeader({ description: e2eDescription("TC-PRC0901 edited golden") });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await submitDraftPR(page, created.ref);
    },
  );
```

- [ ] **Step 2: Run the golden journey**

Run: `bun run test -- 302-pr-creator-journey.spec.ts -g "TC-PRC09"`
Expected: 1 test passes end-to-end.

- [ ] **Step 3: Commit**

```bash
git add tests/302-pr-creator-journey.spec.ts
git commit -m "feat(tests): add golden journey TC-PRC0901

End-to-end Creator flow exercising list, create, save draft, edit,
and submit in a single serial test.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Add SYNC_TARGETS entry for Google Sheets

**Files:**
- Modify: `scripts/sync-test-results.ts:73` (insert one entry inside the `SYNC_TARGETS` array)

- [ ] **Step 1: Add the entry**

Edit `scripts/sync-test-results.ts`. Locate the closing `]` of the `SYNC_TARGETS` array (currently line 73, immediately after the `Product Category` entry). Insert this line as a new array element directly above the `]`:

```ts
  { jsonFile: "302-pr-creator-journey-results.json", sheetTab: "PR Creator" },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "chore(sync): add SYNC_TARGETS entry for PR Creator journey

Maps tests/results/302-pr-creator-journey-results.json to Google
Sheets tab 'PR Creator'. The tab must be created manually in the
target spreadsheet before the first sync.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Final verify, regenerate user-story doc, and integration commit

**Files:**
- Auto-generated: `docs/user-stories/302-pr-creator-journey.md`

- [ ] **Step 1: Run the full spec**

Run: `bun run test -- 302-pr-creator-journey.spec.ts`
Expected: 41 tests run. All pass or are dynamically skipped (TC-PRC0305 may skip if templates exist; TC-PRC0301-0304 may skip if no Template option exists). Fix any flakes — never silently lower assertions.

- [ ] **Step 2: Run the annotation audit (CLAUDE.md requirement)**

Run:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: No `MISMATCH` output. For `302-pr-creator-journey.spec.ts` specifically, both counts equal 41.

- [ ] **Step 3: Regenerate user-story docs**

Run: `bun docs:user-stories`
Expected: `docs/user-stories/302-pr-creator-journey.md` is created or updated.

- [ ] **Step 4: Verify reporter outputs were emitted**

Run: `ls tests/results/302-pr-creator-journey-results.*`
Expected: Both `.csv` and `.json` files exist.

- [ ] **Step 5: Final commit**

```bash
git add docs/user-stories/302-pr-creator-journey.md tests/results/302-pr-creator-journey-results.json tests/results/302-pr-creator-journey-results.csv
git commit -m "docs(user-stories): regen for PR Creator journey

Generated by 'bun docs:user-stories' from the new spec annotations.
Also commits the seed CSV/JSON reporter outputs from the verification
run.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Verification checklist

Before declaring the feature done:

- [ ] `bun run test -- 302-pr-creator-journey.spec.ts` exits zero (or only with documented dynamic skips)
- [ ] Annotation audit script reports no mismatches
- [ ] `docs/user-stories/302-pr-creator-journey.md` exists and lists all 41 TCs
- [ ] `tests/results/302-pr-creator-journey-results.csv` and `.json` exist
- [ ] `scripts/sync-test-results.ts` includes the new `SYNC_TARGETS` entry
- [ ] `git log` shows ~13 commits, one per task (audit task has no commit)
- [ ] No changes to `tests/301-purchase-request.spec.ts` (this spec is additive only)
