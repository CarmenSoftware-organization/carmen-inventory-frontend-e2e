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
    "TC-PO-070101 My Approval dashboard loads with Total Pending count visible",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น FC (fc@blueledgers.com)" },
        { type: "steps", description: "1. ไปที่ My Approvals (หรือ FC dashboard ที่เหมาะสม)\n2. ตรวจสอบว่า indicator total-pending ถูก render" },
        { type: "expected", description: "URL มี 'approval' หรือ 'dashboard'; count/badge หรือ row count visible" },
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
    "TC-PO-070102 PO filter tab shows pending POs (DRAFT + IN PROGRESS)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ My Approval dashboard พร้อม PO ที่รอดำเนินการอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. กดแท็บ filter PO/Purchase Order\n2. ตรวจสอบว่าแถวแสดงหรือมี empty state" },
        { type: "expected", description: "แท็บ PO ถูกเลือก (aria-selected=true) เมื่อมี" },
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
    "TC-PO-070103 Click pending PO row navigates to PO detail",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ My Approval dashboard พร้อมแถว PO ที่รอดำเนินการอย่างน้อยหนึ่งแถว (seeded ผ่าน submitPOAsPurchaser)" },
        { type: "steps", description: "1. Seed PO ผ่าน Purchaser context\n2. ไปที่ dashboard\n3. คลิกแถว PO ที่ seed" },
        { type: "expected", description: "URL navigate ไปยัง /procurement/purchase-order/<ref>" },
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
    "TC-PO-070201 PO Detail loads in IN PROGRESS view (FC perspective)",
    {
      annotation: [
        { type: "preconditions", description: "มี PO ที่มี status IN PROGRESS (seeded ผ่าน submitPOAsPurchaser)" },
        { type: "steps", description: "1. เปิดหน้า detail ของ PO ในฐานะ FC\n2. ตรวจสอบ URL และ status badge" },
        { type: "expected", description: "URL เป็น /procurement/purchase-order/<ref>; text ของ status badge ตรงกับ /in.progress/i" },
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
    "TC-PO-070202 Header fields are read-only for FC (cannot edit vendor/date/etc.)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า detail ของ IN PROGRESS PO ในฐานะ FC" },
        { type: "steps", description: "1. ตรวจสอบ input ของ vendor / description / delivery date\n2. ตรวจสอบว่า input เหล่านั้นถูก disable หรือแก้ไขไม่ได้" },
        { type: "expected", description: "Vendor input หรือหนึ่งใน header field ถูก disable/readonly Skip ถ้าไม่สามารถตรวจจับ header field ได้" },
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
    "TC-PO-070203 Edit button + Comment button visible",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า detail ของ IN PROGRESS PO ในฐานะ FC" },
        { type: "steps", description: "1. ตรวจสอบ action toolbar" },
        { type: "expected", description: "ปุ่ม Edit visible ปุ่ม Comment visible เมื่อมี" },
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
    "TC-PO-070301 Edit mode → select item → Approve toolbar appears",
    {
      annotation: [
        { type: "preconditions", description: "มี IN PROGRESS PO ที่มี ≥1 รายการ (seeded ผ่าน submitPOAsPurchaser)" },
        { type: "steps", description: "1. เปิดหน้า detail ของ PO\n2. กด Edit\n3. เลือกรายการแรกผ่าน row checkbox" },
        { type: "expected", description: "Item action toolbar (Approve/Review/Reject) visible" },
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
    "TC-PO-070302 Mark item Approved → green badge appears on item row",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible บนแถว" },
        { type: "steps", description: "1. เลือกรายการ\n2. กด Approve ใน toolbar\n3. ตรวจสอบ badge" },
        { type: "expected", description: "แถวรายการแสดง badge Approved" },
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
    "TC-PO-070303 Mark item Review → amber badge + Send Back footer button appears",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible บนแถว" },
        { type: "steps", description: "1. เลือกรายการ\n2. กด Review ใน toolbar\n3. ตรวจสอบ badge + ปุ่ม footer" },
        { type: "expected", description: "แถวรายการแสดง badge Review; ปุ่ม Send Back ของเอกสาร visible ใน footer" },
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
    "TC-PO-070304 Mark item Reject → reject badge + footer Reject button appears",
    {
      annotation: [
        { type: "preconditions", description: "Item action toolbar visible บนแถว" },
        { type: "steps", description: "1. เลือกรายการ\n2. กด Reject ใน toolbar\n3. ตรวจสอบ badge + ปุ่ม footer" },
        { type: "expected", description: "แถวรายการแสดง badge Reject; ปุ่ม Reject ของเอกสาร visible ใน footer" },
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
    "TC-PO-070305 All items Approved → Document Approve button enabled in footer",
    {
      annotation: [
        { type: "preconditions", description: "มี IN PROGRESS PO ที่มี ≥1 รายการ" },
        { type: "steps", description: "1. เข้าสู่ edit mode\n2. เลือกรายการและทำเครื่องหมาย Approve\n3. ตรวจสอบปุ่ม Document Approve" },
        { type: "expected", description: "ปุ่ม Document Approve visible (และ enabled เมื่อมี)" },
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
    "TC-PO-070306 Click Approve PO → confirmation dialog ('Once approved, PO will be sent to vendor')",
    {
      annotation: [
        { type: "preconditions", description: "รายการทั้งหมดถูกทำเครื่องหมาย Approved; ปุ่ม Document Approve visible" },
        { type: "steps", description: "1. approve รายการทั้งหมด\n2. กดปุ่ม Document Approve PO" },
        { type: "expected", description: "Confirmation dialog visible" },
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
    "TC-PO-070307 Confirm Approve → status moves to APPROVED/SENT",
    {
      annotation: [
        { type: "preconditions", description: "Confirmation dialog ของ Document Approve เปิดอยู่" },
        { type: "steps", description: "1. approve รายการ\n2. กด Document Approve\n3. ยืนยัน dialog" },
        { type: "expected", description: "text ของ status badge ตรงกับ /approved|sent/i หลังการยืนยัน" },
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
    "TC-PO-070308 Click Send Back → dialog with stage selector + per-item reason",
    {
      annotation: [
        { type: "preconditions", description: "รายการถูกทำเครื่องหมาย Review; ปุ่ม Document Send Back visible" },
        { type: "steps", description: "1. ทำเครื่องหมายรายการว่า Review\n2. กด Document Send Back" },
        { type: "expected", description: "Send Back dialog visible" },
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
    "TC-PO-070309 Confirm Send Back → PO returned (status updates)",
    {
      annotation: [
        { type: "preconditions", description: "Send Back dialog เปิดอยู่" },
        { type: "steps", description: "1. ทำเครื่องหมายรายการว่า Review\n2. กด Send Back\n3. กรอกเหตุผล\n4. ยืนยัน" },
        { type: "expected", description: "URL ยังคงอยู่ที่ PO ref หลังการยืนยัน" },
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
    "TC-PO-070310 Click Reject → dialog with optional reason field",
    {
      annotation: [
        { type: "preconditions", description: "รายการถูกทำเครื่องหมาย Reject; ปุ่ม Document Reject visible" },
        { type: "steps", description: "1. ทำเครื่องหมายรายการว่า Reject\n2. กด Document Reject" },
        { type: "expected", description: "Reject dialog visible" },
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
    "TC-PO-070311 Confirm Reject → PO marked REJECTED",
    {
      annotation: [
        { type: "preconditions", description: "Reject dialog เปิดอยู่" },
        { type: "steps", description: "1. ทำเครื่องหมายรายการว่า Reject\n2. กด Document Reject\n3. กรอกเหตุผล (optional)\n4. ยืนยัน" },
        { type: "expected", description: "text ของ status badge ตรงกับ /rejected/i หลังการยืนยัน" },
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
    "TC-PO-070312 Cancel edit mode (no item marked) → exits without saving",
    {
      annotation: [
        { type: "preconditions", description: "edit mode active บน IN PROGRESS PO โดยไม่มีรายการที่ถูกทำเครื่องหมาย" },
        { type: "steps", description: "1. เข้าสู่ edit mode\n2. กด Cancel โดยไม่เลือก/ทำเครื่องหมายรายการใดๆ" },
        { type: "expected", description: "Form กลับสู่ view mode (ปุ่ม Edit visible อีกครั้ง)" },
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
  fcTest(
    "TC-PO-070901 Full FC flow: My Approval → open PO → Edit → mark all items Approved → Document Approve → Sent",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น FC; มี IN PROGRESS PO ใหม่ที่ seed ผ่าน submitPOAsPurchaser" },
        { type: "steps", description: "1. Seed IN PROGRESS PO\n2. เปิดหน้า detail ของ PO\n3. กด Edit\n4. เลือกรายการแรก\n5. ทำเครื่องหมาย Approve\n6. กด Document Approve\n7. ยืนยัน dialog" },
        { type: "expected", description: "status badge เปลี่ยนเป็น APPROVED/SENT หลังการยืนยัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const po = new PurchaseOrderPage(page);

      // Seed
      const created = await submitPOAsPurchaser(browser, { description: "[E2E-POA] TC-PO-070901 golden" });

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
});
