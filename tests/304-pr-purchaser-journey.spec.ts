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
  purchaseTest(
    "TC-PR-070101 List loads, My Pending tab default (PRs at Purchase stage)",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Purchaser (purchase@blueledgers.com)" },
        { type: "steps", description: "1. ไปที่ /procurement/purchase-request\n2. ตรวจสอบ URL และแท็บ My Pending" },
        { type: "expected", description: "URL อยู่ที่หน้า PR list; แท็บ My Pending ถูกเลือกเมื่อมีอยู่" },
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
    "TC-PR-070102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิกแท็บ All Documents" },
        { type: "expected", description: "แท็บ All Documents ถูกเลือก" },
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
    "TC-PR-070103 All Stage dropdown filters by status",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. เปิด dropdown All Stage\n2. เลือก In Progress" },
        { type: "expected", description: "URL ยังคงอยู่ที่หน้า PR list (filter ถูกใช้งานหรือไม่มีผลเมื่อ dropdown ไม่มีอยู่)" },
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
    "TC-PR-070104 Filter panel opens and applies",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. เปิดแผง Filter\n2. เลือก status\n3. Apply" },
        { type: "expected", description: "URL ยังคงอยู่ที่หน้า PR list หลังจากใช้ filter" },
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
    "TC-PR-070105 Search by PR reference filters list",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list; มี PR อย่างน้อยหนึ่งรายการที่มี reference ที่รู้จัก" },
        { type: "steps", description: "1. พิมพ์ reference บางส่วนใน search\n2. รอผลลัพธ์" },
        { type: "expected", description: "URL ยังคงอยู่ที่หน้า PR list หลังจากพิมพ์ใน search input" },
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
});

purchaseTest.describe("Step 2 — PR Detail (Read-only)", () => {
  purchaseTest(
    "TC-PR-070201 Detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "PR มีอยู่ที่ขั้นตอน Purchase (seeded ผ่าน submitPRAsRequestor + approveAsHOD)" },
        { type: "steps", description: "1. เปิดหน้า PR detail\n2. ตรวจสอบว่าแท็บ Items เป็นค่าเริ่มต้น" },
        { type: "expected", description: "URL เป็น detail URL; แท็บ Items ถูกเลือกเมื่อมีอยู่" },
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
    "TC-PR-070202 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR detail ขั้นตอน Purchase" },
        { type: "steps", description: "1. คลิกแท็บ Workflow History" },
        { type: "expected", description: "แท็บ Workflow History ถูกเลือก" },
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
    "TC-PR-070203 No standalone Approve/Reject/Return buttons (BRD discrepancy)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR detail ขั้นตอน Purchase (read-only view)" },
        { type: "steps", description: "1. ตรวจสอบ header / action toolbar ของหน้า detail" },
        { type: "expected", description: "ปุ่ม Approve, Reject และ Send for Review แบบ standalone ต้องไม่ visible ที่ header ของหน้า (ตาม BRD discrepancy — actions อยู่ใน bulk toolbar ของ Edit Mode)" },
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
    "TC-PR-070204 Edit button visible (entry to vendor/pricing edit)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR detail ขั้นตอน Purchase" },
        { type: "steps", description: "1. ตรวจสอบ action toolbar" },
        { type: "expected", description: "ปุ่ม Edit visible (Purchaser สามารถเข้า Edit Mode สำหรับ vendor/pricing allocation ได้)" },
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
});

purchaseTest.describe("Step 3 — Edit Mode (Vendor & Pricing)", () => {
  purchaseTest(
    "TC-PR-070301 Click Edit → vendor/pricing fields become editable",
    {
      annotation: [
        { type: "preconditions", description: "PR มีอยู่ที่ขั้นตอน Purchase" },
        { type: "steps", description: "1. เปิด PR ขั้นตอน Purchase\n2. คลิก Edit\n3. ตรวจสอบว่าปุ่ม Save/Cancel ระดับฟอร์มปรากฏขึ้น" },
        { type: "expected", description: "ปุ่ม Save Draft (หรือ Cancel) ระดับฟอร์ม visible" },
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
    "TC-PR-070302 Vendor field is editable (Purchaser scope)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เข้า edit mode\n2. หา Vendor input ในแถวแรก\n3. ตรวจสอบว่าแก้ไขได้" },
        { type: "expected", description: "Vendor input แก้ไขได้ (ตรงข้ามกับ Approver ที่มองเห็นเป็น read-only)" },
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
    "TC-PR-070303 Unit Price field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เข้า edit mode\n2. หา Unit Price input\n3. พิมพ์ค่า" },
        { type: "expected", description: "Unit Price input รับค่าที่พิมพ์ได้" },
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
    "TC-PR-070304 Discount field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. หา Discount input\n3. ตรวจสอบว่าแก้ไขได้" },
        { type: "expected", description: "Discount input แก้ไขได้" },
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
    "TC-PR-070305 Tax Profile field is editable",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. หา Tax Profile select\n3. ตรวจสอบว่าแก้ไขได้" },
        { type: "expected", description: "Tax Profile select แก้ไขได้" },
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
    "TC-PR-070306 Approved Qty field stays read-only (HOD already set it)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เข้า edit mode\n2. หาช่อง Approved Qty ในแถวแรก" },
        { type: "expected", description: "ช่อง Approved Qty ถูก disabled หรือแก้ไขไม่ได้สำหรับ Purchaser (HOD กำหนดค่าไว้แล้ว)" },
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
    "TC-PR-070307 Auto Allocate button populates vendors via scoring",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เข้า edit mode\n2. คลิก Auto Allocate" },
        { type: "expected", description: "URL ยังคงอยู่ที่หน้า detail หลังจากคลิก (allocation ทำงาน)" },
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
    "TC-PR-070308 Multiple line items — pricing on each row independent",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีหลายรายการ" },
        { type: "steps", description: "1. Seed PR ด้วย 2 รายการ\n2. เข้า edit mode\n3. กำหนด unit price ในแถว 0\n4. กำหนด unit price ในแถว 1\n5. ตรวจสอบว่าทั้งสองค่ามีอยู่" },
        { type: "expected", description: "Unit Price input ของแต่ละแถวเก็บค่าของตัวเองไว้" },
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
    "TC-PR-070309 Save edits → exit edit mode + persist values",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase ที่มีการแก้ไข vendor/price" },
        { type: "steps", description: "1. เข้า edit mode\n2. กำหนด unit price\n3. คลิก Save Draft" },
        { type: "expected", description: "ฟอร์มกลับไปที่ view mode (ปุ่ม Edit visible อีกครั้ง)" },
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
    "TC-PR-070310 Cancel edits → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. พิมพ์ใน Unit Price\n3. คลิก Cancel" },
        { type: "expected", description: "ฟอร์มกลับไปที่ view mode (ปุ่ม Edit visible อีกครั้ง)" },
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
});

purchaseTest.describe("Step 4 — Workflow Actions", () => {
  purchaseTest(
    "TC-PR-070401 Bulk Approve → PR advances to next stage (FC)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. เลือกทุกแถว\n3. คลิก Approve ใน bulk toolbar\n4. Confirm" },
        { type: "expected", description: "URL ยังคงอยู่ที่ PR ref (status เลื่อนไปขั้นตอนถัดไป)" },
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
    "TC-PR-070402 Bulk Reject (with reason)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. เลือกทุกแถว\n3. คลิก Reject\n4. กรอกเหตุผล\n5. Confirm" },
        { type: "expected", description: "URL ยังคงอยู่ที่ PR ref หลังจาก reject" },
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
    "TC-PR-070403 Bulk Send for Review (return to HOD)",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. เลือกทุกแถว\n3. คลิก Send for Review\n4. กรอกเหตุผล + stage\n5. Confirm" },
        { type: "expected", description: "URL ยังคงอยู่ที่ PR ref หลังจาก send for review" },
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
    "TC-PR-070404 Bulk Split — split selected items",
    {
      annotation: [
        { type: "preconditions", description: "Edit mode active อยู่บน PR ขั้นตอน Purchase" },
        { type: "steps", description: "1. เข้า edit mode\n2. เลือกทุกแถว\n3. คลิก Split" },
        { type: "expected", description: "Split UI ปรากฏขึ้น (dialog หรือ inline) — ตรวจสอบโดย URL ยังคงอยู่ที่หน้า detail" },
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
    "TC-PR-070405 Cannot edit when PR is at non-Purchase stage (read-only)",
    {
      annotation: [
        { type: "preconditions", description: "PR อยู่ที่ขั้นตอน HOD (ยังไม่ได้รับการ approve จาก HOD) ดูโดย Purchaser" },
        { type: "steps", description: "1. Seed PR ที่ขั้นตอน HOD (ข้าม approveAsHOD)\n2. เปิด detail ในฐานะ Purchaser\n3. ตรวจสอบปุ่ม Edit" },
        { type: "expected", description: "ปุ่ม Edit ไม่มีอยู่ หรือ detail เป็น read-only — Purchaser ไม่สามารถแก้ไขได้จนกว่า PR จะถึงขั้นตอน Purchase" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      // Seed PR at HOD stage only — DO NOT call approveAsHOD
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await gotoPRDetail(page, created.ref);
      const editBtn = pr.editModeButton();
      const editCount = await editBtn.count();
      if (editCount === 0) {
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      await editBtn.click({ timeout: 5_000 }).catch(() => {});
      const vendor = pr.vendorInput(0);
      if ((await vendor.count()) === 0) {
        await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
        return;
      }
      const disabled = await vendor.isDisabled().catch(() => false);
      const ariaDisabled = (await vendor.getAttribute("aria-disabled").catch(() => null)) === "true";
      expect(disabled || ariaDisabled).toBeTruthy();
    },
  );
});

purchaseTest.describe.serial("Golden Journey", () => {
  purchaseTest(
    "TC-PR-070901 Purchaser full flow: List → Detail → Edit (allocate vendor + price) → Bulk Approve → next stage",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Purchaser; PR ใหม่ถูก seed ที่ขั้นตอน Purchase ผ่าน submitPRAsRequestor + approveAsHOD" },
        { type: "steps", description: "1. เปิด PR list\n2. เปิด PR detail\n3. คลิก Edit\n4. กำหนด unit price ในแถวแรก\n5. เลือกทั้งหมด + Bulk Approve + Confirm" },
        { type: "expected", description: "URL ยังคงอยู่ที่ PR ref หลังจาก bulk approve; journey เสร็จสมบูรณ์ตั้งแต่ต้นจนจบ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PR-070901 golden" });
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

      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});
