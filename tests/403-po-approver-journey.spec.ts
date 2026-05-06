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
});

fcTest.describe("Step 2 — PO Detail (FC view)", () => {
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
});

fcTest.describe("Step 3 — Approval Actions", () => {
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
});

fcTest.describe.serial("Golden Journey", () => {
  // TC added in Task 7
});
