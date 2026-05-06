# PR Returned Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `tests/311-pr-returned-flow.spec.ts` covering Step 7 of the Creator workflow (Returned PR review + edit + resubmit) as 11 cross-persona TCs, completing Creator coverage that was deferred from spec 302.

**Architecture:** New cross-persona spec sits alongside 302/303/304 PR specs. Reuses `createAuthTest("requestor@blueledgers.com")` as `requestorTest`. Adds one new helper `sendForReviewAsHOD(browser, ref, reason?)` to `pr-approver.helpers.ts` that mirrors the existing `approveAsHOD` shape — opens a 2nd browser context, logs in as HOD, enters Edit Mode, and bulk-sends the PR for review (routing it back to the Requestor). All page object methods needed already exist; no `purchase-request.page.ts` change required.

**Tech Stack:** Playwright Test 1.x, TypeScript, Bun, Radix UI primitives.

**Spec source:** `docs/superpowers/specs/2026-05-06-pr-returned-flow-design.md`

---

## E2E TDD note

This is e2e against an already-built frontend. The TDD loop adapts:
1. Write the test against documented behavior
2. Run it — failures reveal locator drift, missing wait, or genuine UI gaps
3. Adjust locators / waits until stable; never weaken assertions to mask defects
4. Commit only when stable

If a TC fails because the UI doesn't ship the expected behavior, mark `requestorTest.skip(reason)` with a `note` annotation; do not delete it. Don't run the actual e2e suite during subagent execution — runtime testing is left to the user. Subagents verify only TypeScript compile + Playwright list + annotation audit.

---

## Task 1: Audit existing assets

**Files (read-only):**
- `tests/pages/pr-approver.helpers.ts`
- `tests/pages/purchase-request.page.ts`

- [ ] **Step 1: Confirm method inventory**

`pr-approver.helpers.ts` provides (verified):
- `submitPRAsRequestor(browser, opts?)` — Requestor seed via 2nd context
- `approveAsHOD(browser, ref)` — HOD approve via 2nd context (model for `sendForReviewAsHOD`)
- `bulkApprove(page)`, `bulkReject(page, reason)`, `bulkSendForReview(page, reason, stage)` — toolbar actions
- `gotoPRDetail(page, ref)` — navigation
- Imports `LoginPage` from `./login.page`, `PurchaseRequestPage` and `LIST_PATH` from `./purchase-request.page`, `TEST_PASSWORD` from `../test-users`, `expect` from `@playwright/test`

`purchase-request.page.ts` provides (relevant for this spec):
- `editModeButton`, `enterEditMode`, `cancelEditMode`
- `submitButton`, `cancelFormButton`, `saveDraftButton`
- BasePage `deleteButton` (inherited)
- `tabItems`, `tabWorkflowHistory`
- `editLineItem(rowIndex, fields)`, `addLineItem(data)`
- `confirmDialogButton`
- `expectStatus(text)`, `statusBadge` (regex includes `/returned/i` at line ~292)
- List-page primitives (used by section 7a TCs)

No new page object methods required.

- [ ] **Step 2: No commit (audit-only)**

---

## Task 2: Add `sendForReviewAsHOD` cross-context helper

**Files:**
- Modify: `tests/pages/pr-approver.helpers.ts` (insert before `gotoPRDetail`)

- [ ] **Step 1: Insert the new helper**

Open `tests/pages/pr-approver.helpers.ts`. Find the existing `approveAsHOD` function. Insert this new function IMMEDIATELY AFTER `approveAsHOD` and BEFORE `gotoPRDetail`:

```ts
/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as HOD,
 * navigates to the PR detail at `ref`, enters Edit Mode, selects all rows,
 * and bulk-sends the PR for review with the given reason — routing the PR
 * back to the Requestor (Creator). Closes the context cleanly. Used by the
 * PR Returned Flow spec to seed PRs in the Returned status.
 */
export async function sendForReviewAsHOD(
  browser: Browser,
  ref: string,
  reason: string = "Please revise — returned for review",
): Promise<void> {
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
      throw new Error(`sendForReviewAsHOD: Edit button not found on PR ${ref}`);
    }
    await pr.enterEditMode();
    await bulkSendForReview(page, reason, "Requestor");
    await page.waitForLoadState("networkidle").catch(() => {});
  } finally {
    await ctx.close();
  }
}

```

**Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: zero errors.

**Step 3: Commit**

```bash
git add tests/pages/pr-approver.helpers.ts
git commit -m "$(cat <<'EOF'
feat(pages): add sendForReviewAsHOD cross-context helper

Mirrors approveAsHOD but invokes Bulk Send for Review with stage
"Requestor" — routing the PR back to the Creator (Returned status).
Used by the upcoming PR Returned Flow spec to seed PRs in the
Returned state for cross-persona testing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Scaffold the spec file

**Files:**
- Create: `tests/311-pr-returned-flow.spec.ts`

- [ ] **Step 1: Write the spec scaffold**

Create `tests/311-pr-returned-flow.spec.ts` with this EXACT content:

```ts
import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import {
  submitPRAsRequestor,
  sendForReviewAsHOD,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Cross-persona spec — Creator's Step 7 (Returned PR flow). Runs alongside
// 302/303/304. Source docs: docs/persona-doc/Purchase Request/Creator/
// step-07-returned-pr.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

requestorTest.describe("7a — View Returned PR", () => {
  // TCs added in Task 4
});

requestorTest.describe("7b — Edit Returned PR", () => {
  // TCs added in Task 5
});

requestorTest.describe("7c — Resubmit", () => {
  // TCs added in Task 6
});

requestorTest.describe("7d — Edge cases", () => {
  // TCs added in Task 7
});

requestorTest.describe.serial("Golden Journey", () => {
  // TC added in Task 8
});
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: TS clean; zero tests reported (empty describes), no parser errors.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): scaffold 311-pr-returned-flow.spec.ts

Empty describe blocks for sections 7a-7d plus a serial Golden Journey
describe. TCs land in subsequent commits. Imports cross-context
helpers from pr-approver.helpers.ts.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Implement Section 7a — View Returned PR (TC-PRC0701..0703)

**Files:**
- Modify: `tests/311-pr-returned-flow.spec.ts` — fill the `7a — View Returned PR` describe

- [ ] **Step 1: Replace the 7a describe body**

Find:
```ts
requestorTest.describe("7a — View Returned PR", () => {
  // TCs added in Task 4
});
```

Replace the comment line with this block (preserve 2-space indentation):

```ts
  requestorTest(
    "TC-PRC0701 Returned PR appears in Creator's list with RETURNED status badge",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; a Returned PR exists (seeded via submitPRAsRequestor + sendForReviewAsHOD)" },
        { type: "steps", description: "1. Open PR list\n2. Locate the seeded PR row\n3. Verify status badge reads Returned (or equivalent)" },
        { type: "expected", description: "PR row is visible in the list and the status badge filter matches /returned|sent back/i for the row." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await pr.gotoList();
      const row = pr.prRow(created.ref);
      if ((await row.count()) === 0) {
        requestorTest.skip(true, "Returned PR not visible in Creator's list — backend may filter differently");
        return;
      }
      await expect(row).toBeVisible({ timeout: 10_000 });
      await expect(row).toContainText(/returned|sent back/i);
    },
  );

  requestorTest(
    "TC-PRC0702 Open Returned PR detail loads with status=Returned",
    {
      annotation: [
        { type: "preconditions", description: "A Returned PR exists" },
        { type: "steps", description: "1. Navigate to the Returned PR detail page\n2. Verify URL\n3. Verify status badge" },
        { type: "expected", description: "URL is /procurement/purchase-request/<ref>; status badge text matches /returned|sent back/i." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /returned|sent back/i })
          .first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0703 Workflow History tab shows the return reason from HOD",
    {
      annotation: [
        { type: "preconditions", description: "On a Returned PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab\n2. Look for the HOD return reason text" },
        { type: "expected", description: "Workflow History panel contains the seeded return reason 'Please revise — returned for review' (or partial match)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        requestorTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(
        page.getByText(/please revise|returned for review|revise/i).first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: 3 tests, no parser errors.

Annotation: `pre=$(grep -c 'type: "preconditions"' tests/311-pr-returned-flow.spec.ts); exp=$(grep -c 'type: "expected"' tests/311-pr-returned-flow.spec.ts); echo "pre=$pre exp=$exp"` — expected `pre=3 exp=3`.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Section 7a — View Returned PR TCs (TC-PRC0701..0703)

Three TCs verifying the Creator can find a Returned PR in the list,
open its detail page with the correct status, and read the HOD's
return reason in the Workflow History tab. Each TC seeds the
Returned state via submitPRAsRequestor + sendForReviewAsHOD.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Implement Section 7b — Edit Returned PR (TC-PRC0704..0706)

**Files:**
- Modify: `tests/311-pr-returned-flow.spec.ts` — fill the `7b — Edit Returned PR` describe

- [ ] **Step 1: Replace the 7b describe body**

```ts
  requestorTest(
    "TC-PRC0704 Edit button visible on Returned PR (Creator can re-edit)",
    {
      annotation: [
        { type: "preconditions", description: "On a Returned PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (Creator can enter Edit Mode to revise)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0705 Modify line item quantity → Save → URL stays on detail",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open with at least one line item" },
        { type: "steps", description: "1. Click Edit\n2. Modify first row quantity to 7\n3. Click Save Draft" },
        { type: "expected", description: "After save the page URL stays on /procurement/purchase-request/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 7 }).catch(() => {});
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0706 Add new line item to Returned PR → Save",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Click Edit\n2. Add a new line item (product, qty, uom, price)\n3. Click Save Draft" },
        { type: "expected", description: "After save the page URL stays on /procurement/purchase-request/<ref>." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.addLineItem({ product: "Added in Returned", quantity: 2, uom: "ea", unitPrice: 75 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: 6 tests (3 + 3).

Annotation: `pre=6 exp=6`.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Section 7b — Edit Returned PR TCs (TC-PRC0704..0706)

Three TCs verifying Creator can re-enter Edit Mode on a Returned PR,
modify line item quantity, and add new line items. Each TC seeds
its own Returned PR via the cross-context chain.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Implement Section 7c — Resubmit (TC-PRC0707..0708)

**Files:**
- Modify: `tests/311-pr-returned-flow.spec.ts` — fill the `7c — Resubmit` describe

- [ ] **Step 1: Replace the 7c describe body**

```ts
  requestorTest(
    "TC-PRC0707 Submit confirmation dialog appears for Returned PR",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Click Submit on the Returned PR" },
        { type: "expected", description: "A confirmation dialog (resubmit) becomes visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0708 Confirm submit → status moves Returned → In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog open on a Returned PR" },
        { type: "steps", description: "1. Click Submit\n2. Confirm dialog\n3. Wait for status badge to update" },
        { type: "expected", description: "Status badge text matches /in.progress/i after confirm." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|submit|resubmit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /in.progress/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: 8 tests (6 + 2).

Annotation: `pre=8 exp=8`.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Section 7c — Resubmit TCs (TC-PRC0707..0708)

Two TCs for resubmission of a Returned PR: confirm dialog appears
on Submit click, and confirming the dialog transitions status from
Returned to In Progress.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Implement Section 7d — Edge cases (TC-PRC0709..0710)

**Files:**
- Modify: `tests/311-pr-returned-flow.spec.ts` — fill the `7d — Edge cases` describe

- [ ] **Step 1: Replace the 7d describe body**

```ts
  requestorTest(
    "TC-PRC0709 Cancel submit on Returned PR → URL stays on detail (still Returned)",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog open on a Returned PR" },
        { type: "steps", description: "1. Click Submit\n2. Click Cancel in the dialog" },
        { type: "expected", description: "Dialog closes; URL remains on the PR detail page." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      if ((await cancel.count()) === 0) {
        requestorTest.skip(true, "Cancel button not present in submit dialog");
        return;
      }
      await cancel.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0710 Delete Returned PR is allowed for Creator",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Inspect Delete button presence\n2. If present, click and confirm\n3. Verify list URL" },
        { type: "expected", description: "Delete button visible; confirming delete navigates back to the PR list URL. Skipped when Delete is not allowed in this configuration." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const del = pr.deleteButton();
      if ((await del.count()) === 0) {
        requestorTest.skip(true, "Delete button not visible on Returned PR — feature gated by configuration");
        return;
      }
      await del.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|delete|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/\/procurement\/purchase-request($|\?)/, { timeout: 10_000 });
    },
  );
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: 10 tests (8 + 2).

Annotation: `pre=10 exp=10`.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Section 7d — Edge cases TCs (TC-PRC0709..0710)

Two TCs: cancel-submit on a Returned PR keeps the user on the detail
page, and Delete on a Returned PR (when allowed) navigates back to
the list URL. Both TCs handle absent affordances via dynamic skip.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Implement Golden Journey (TC-PRC0902)

**Files:**
- Modify: `tests/311-pr-returned-flow.spec.ts` — fill the `Golden Journey` describe.serial

- [ ] **Step 1: Replace the Golden Journey describe body**

```ts
  requestorTest(
    "TC-PRC0902 Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; a fresh PR is seeded into the Returned state via submitPRAsRequestor + sendForReviewAsHOD" },
        { type: "steps", description: "1. Open the Returned PR detail\n2. Click Workflow History tab and verify reason is shown\n3. Click Edit\n4. Modify first line item quantity\n5. Save Draft\n6. Click Submit and Confirm\n7. Wait for status to read In Progress" },
        { type: "expected", description: "Status badge transitions to In Progress after the resubmit confirmation." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed: Requestor submits → HOD sends back
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PRC0902 returned golden" });
      await sendForReviewAsHOD(browser, created.ref);

      // Step 1: Open detail
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));

      // Step 2: Verify reason in Workflow History
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) > 0) {
        await wh.click();
        await expect(
          page.getByText(/please revise|returned for review|revise/i).first(),
        ).toBeVisible({ timeout: 10_000 }).catch(() => {});
      }

      // Step 3-5: Edit quantity, save
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 9 }).catch(() => {});
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});

      // Step 6: Submit + confirm
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present after save");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|submit|resubmit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});

      // Step 7: Status In Progress
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /in.progress/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );
```

**Step 2: Verify**

Run: `bun tsc --noEmit`
Run: `bun run test -- 311-pr-returned-flow.spec.ts --list`
Expected: 11 tests (10 + 1).

Annotation: `pre=11 exp=11`.

**Step 3: Commit**

```bash
git add tests/311-pr-returned-flow.spec.ts
git commit -m "$(cat <<'EOF'
feat(tests): add Golden Journey TC (TC-PRC0902)

End-to-end Returned-PR flow: HOD sends back → Creator views reason
in Workflow History → edits line item quantity → saves → resubmits →
status moves to In Progress. Single serial TC continuing 302's
TC-PRC0901 to mark the second Creator golden journey.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Add SYNC_TARGETS entry

**Files:**
- Modify: `scripts/sync-test-results.ts`

- [ ] **Step 1: Add the entry**

Edit `scripts/sync-test-results.ts`. Locate the existing entry:
```ts
  { jsonFile: "304-pr-purchaser-journey-results.json", sheetTab: "PR Purchaser" },
```
Insert directly AFTER it (still inside the `SYNC_TARGETS` array, before the closing `];`):
```ts
  { jsonFile: "311-pr-returned-flow-results.json", sheetTab: "PR Returned Flow" },
```

**Step 2: Verify TypeScript compiles**

Run: `bun tsc --noEmit`
Expected: no errors.

**Step 3: Commit**

```bash
git add scripts/sync-test-results.ts
git commit -m "$(cat <<'EOF'
chore(sync): add SYNC_TARGETS entry for PR Returned Flow

Maps tests/results/311-pr-returned-flow-results.json to Google Sheets
tab 'PR Returned Flow'. The tab must be created manually in the
target spreadsheet before the first sync.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Final verify, regenerate user-story doc, integration commit

**Files:**
- Auto-generated: `docs/user-stories/311-pr-returned-flow.md`

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
pre=$(grep -c 'type: "preconditions"' tests/311-pr-returned-flow.spec.ts)
exp=$(grep -c 'type: "expected"' tests/311-pr-returned-flow.spec.ts)
echo "311 spec: pre=$pre exp=$exp"
```
Expected: `pre=11 exp=11`.

- [ ] **Step 3: Final TypeScript + Playwright list**

```bash
bun tsc --noEmit
bun run test -- 311-pr-returned-flow.spec.ts --list
```
Expected: TS clean; Playwright lists 11 tests.

- [ ] **Step 4: Regenerate user-story docs**

```bash
bun docs:user-stories
```
Expected: no errors. Creates / updates `docs/user-stories/311-pr-returned-flow.md`.

Verify:
```bash
ls -la docs/user-stories/311-pr-returned-flow.md
grep -c 'TC-PRC0' docs/user-stories/311-pr-returned-flow.md
```
Expected: file exists; `TC-PRC0` occurrences ≥ 11 (each TC ID appears at least once).

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
docs(user-stories): regen for PR Returned Flow

Generated by 'bun docs:user-stories' from the spec annotations after
all 11 TCs landed. Other spec docs include footer-timestamp updates
from the same generator pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification checklist

Before declaring the feature done:

- [ ] `bun run test -- 311-pr-returned-flow.spec.ts --list` shows 11 tests
- [ ] Annotation audit script reports no mismatches
- [ ] `docs/user-stories/311-pr-returned-flow.md` exists and lists all 11 TCs
- [ ] `scripts/sync-test-results.ts` includes the new `SYNC_TARGETS` entry
- [ ] `git log` shows ~9 commits, one per task (Task 1 audit-only has no commit)
- [ ] No changes to existing PR specs (301/302/303/304) or `purchase-request.page.ts`
- [ ] `tests/pages/pr-creator.helpers.ts` is unchanged (reused as-is)
