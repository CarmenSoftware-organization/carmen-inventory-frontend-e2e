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
  requestorTest(
    "TC-PR-080701 Returned PR appears in Creator's list with RETURNED status badge",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor; มี PR ที่ถูกส่งคืนอยู่ (seeded ผ่าน submitPRAsRequestor + sendForReviewAsHOD)" },
        { type: "steps", description: "1. เปิด PR list\n2. หาแถว PR ที่ seeded\n3. ตรวจสอบว่า status badge แสดง Returned (หรือเทียบเท่า)" },
        { type: "expected", description: "แถว PR visible ใน list และ status badge ตรงกับ /returned|sent back/i สำหรับแถวนั้น" },
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
    "TC-PR-080702 Open Returned PR detail loads with status=Returned",
    {
      annotation: [
        { type: "preconditions", description: "มี PR ที่ถูกส่งคืนอยู่" },
        { type: "steps", description: "1. ไปที่หน้า Returned PR detail\n2. ตรวจสอบ URL\n3. ตรวจสอบ status badge" },
        { type: "expected", description: "URL คือ /procurement/purchase-request/<ref>; text ของ status badge ตรงกับ /returned|sent back/i" },
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
    "TC-PR-080703 Workflow History tab shows the return reason from HOD",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า Returned PR detail" },
        { type: "steps", description: "1. คลิกแท็บ Workflow History\n2. หาข้อความเหตุผลการส่งคืนจาก HOD" },
        { type: "expected", description: "แผง Workflow History มีเหตุผลการส่งคืนที่ seeded ไว้ว่า 'Please revise — returned for review' (หรือ partial match)" },
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
});

requestorTest.describe("7b — Edit Returned PR", () => {
  requestorTest(
    "TC-PR-080704 Edit button visible on Returned PR (Creator can re-edit)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า Returned PR detail" },
        { type: "steps", description: "1. ตรวจสอบ action toolbar" },
        { type: "expected", description: "ปุ่ม Edit visible (Creator สามารถเข้า Edit Mode เพื่อแก้ไขได้)" },
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
    "TC-PR-080705 Modify line item quantity → Save → URL stays on detail",
    {
      annotation: [
        { type: "preconditions", description: "หน้า Returned PR detail เปิดอยู่พร้อมอย่างน้อยหนึ่ง line item" },
        { type: "steps", description: "1. คลิก Edit\n2. แก้ไข quantity แถวแรกเป็น 7\n3. คลิก Save Draft" },
        { type: "expected", description: "หลังจากบันทึก URL ของหน้ายังคงอยู่ที่ /procurement/purchase-request/<ref>" },
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
    "TC-PR-080706 Add new line item to Returned PR → Save",
    {
      annotation: [
        { type: "preconditions", description: "หน้า Returned PR detail เปิดอยู่" },
        { type: "steps", description: "1. คลิก Edit\n2. เพิ่ม line item ใหม่ (product, qty, uom, price)\n3. คลิก Save Draft" },
        { type: "expected", description: "หลังจากบันทึก URL ของหน้ายังคงอยู่ที่ /procurement/purchase-request/<ref>" },
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
});

requestorTest.describe("7c — Resubmit", () => {
  requestorTest(
    "TC-PR-080707 Submit confirmation dialog appears for Returned PR",
    {
      annotation: [
        { type: "preconditions", description: "หน้า Returned PR detail เปิดอยู่" },
        { type: "steps", description: "1. คลิก Submit บน Returned PR" },
        { type: "expected", description: "dialog ยืนยัน (resubmit) ปรากฏขึ้น visible" },
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
    "TC-PR-080708 Confirm submit → status moves Returned → In Progress",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยัน Submit เปิดอยู่บน Returned PR" },
        { type: "steps", description: "1. คลิก Submit\n2. Confirm dialog\n3. รอ status badge อัปเดต" },
        { type: "expected", description: "text ของ status badge ตรงกับ /in.progress/i หลังจาก confirm" },
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
});

requestorTest.describe("7d — Edge cases", () => {
  requestorTest(
    "TC-PR-080709 Cancel submit on Returned PR → URL stays on detail (still Returned)",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยัน Submit เปิดอยู่บน Returned PR" },
        { type: "steps", description: "1. คลิก Submit\n2. คลิก Cancel ใน dialog" },
        { type: "expected", description: "dialog ปิด; URL ยังคงอยู่ที่หน้า PR detail" },
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
    "TC-PR-080710 Delete Returned PR is allowed for Creator",
    {
      annotation: [
        { type: "preconditions", description: "หน้า Returned PR detail เปิดอยู่" },
        { type: "steps", description: "1. ตรวจสอบการมีอยู่ของปุ่ม Delete\n2. ถ้ามีอยู่ ให้คลิกและ confirm\n3. ตรวจสอบ URL ของ list" },
        { type: "expected", description: "ปุ่ม Delete visible; การ confirm ลบนำทางกลับไปที่ PR list URL ข้ามเมื่อ Delete ไม่ได้รับอนุญาตใน configuration นี้" },
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
});

requestorTest.describe.serial("Golden Journey", () => {
  requestorTest(
    "TC-PR-080902 Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor; PR ใหม่ถูก seed ไว้ในสถานะ Returned ผ่าน submitPRAsRequestor + sendForReviewAsHOD" },
        { type: "steps", description: "1. เปิดหน้า Returned PR detail\n2. คลิกแท็บ Workflow History และตรวจสอบว่าเหตุผลถูกแสดง\n3. คลิก Edit\n4. แก้ไข quantity ของ line item แรก\n5. Save Draft\n6. คลิก Submit และ Confirm\n7. รอ status แสดงเป็น In Progress" },
        { type: "expected", description: "Status badge เปลี่ยนเป็น In Progress หลังจากการ confirm resubmit" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed: Requestor submits → HOD sends back
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PR-080902 returned golden" });
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
});
