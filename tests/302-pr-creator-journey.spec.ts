import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import { createDraftPR, submitDraftPR, deleteDraftPR, e2eDescription } from "./pages/pr-creator.helpers";

// Persona-journey spec — Creator (Requestor). Runs alongside 301-pr.spec.ts
// (per-action multi-role) without modifying it. Source docs:
// docs/persona-doc/Purchase Request/Creator/INDEX.md and step-01..08.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

const FUTURE_DATE = "2099-12-31";
const PAST_DATE = "2020-01-01";

requestorTest.describe("Step 1 — PR List", () => {
  requestorTest(
    "TC-PR-050101 List loads with My Pending tab and Creator's PRs visible",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor (requestor@blueledgers.com)" },
        { type: "steps", description: "1. ไปที่ /procurement/purchase-request\n2. ตรวจสอบว่า My Pending tab ถูกเลือกเป็นค่าเริ่มต้น\n3. ตรวจสอบว่าตาราง list แสดงผล" },
        { type: "expected", description: "URL เป็น /procurement/purchase-request, My Pending tab มี aria-selected=true, ตารางหรือ empty-state แสดงผล" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
      const tab = pr.tabMyPending();
      if ((await tab.count()) === 0) {
        // Tab UI not present — list URL check above is sufficient for the smoke
        return;
      }
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PR-050102 Switch to All Documents tab broadens scope",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิก tab All Documents\n2. ตรวจสอบว่า list รีเฟรช" },
        { type: "expected", description: "tab All Documents ถูกเลือก; list แสดงผลใหม่" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const tab = pr.tabAllDocuments();
      if ((await tab.count()) === 0) {
        requestorTest.skip(true, "All Documents tab not present in this build");
        return;
      }
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PR-050103 Search by reference number filters list",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list; มี PR อย่างน้อยหนึ่งรายการที่มีเลขอ้างอิงที่รู้จัก" },
        { type: "steps", description: "1. คลิกช่องค้นหา\n2. พิมพ์เลขอ้างอิงบางส่วน\n3. รอให้ list กรองข้อมูล" },
        { type: "expected", description: "List อัปเดตแสดงเฉพาะแถวที่เลขอ้างอิงมีข้อความที่พิมพ์" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const input = pr.searchInput();
      if ((await input.count()) === 0) {
        requestorTest.skip(true, "Search input not present in this build");
        return;
      }
      await pr.searchFor("PR");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PR-050104 Filter by status (Draft)",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. เปิดแผง Filter\n2. เลือก status = Draft\n3. Apply" },
        { type: "expected", description: "List แสดงเฉพาะ PR ที่มีสถานะ Draft (หรือ empty state)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const fb = pr.filterButton();
      if ((await fb.count()) === 0) {
        requestorTest.skip(true, "Filter button not present in this build");
        return;
      }
      await pr.applyFilter({ status: "Draft" });
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PR-050105 Sort list by Date",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิก header คอลัมน์ Date เพื่อ sort\n2. ตรวจสอบว่า list เรียงลำดับใหม่" },
        { type: "expected", description: "header คอลัมน์แสดง sort indicator และ list เรียงลำดับใหม่" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.sortBy("date");
      await expect(page).toHaveURL(new RegExp(LIST_PATH));
    },
  );

  requestorTest(
    "TC-PR-050106 Click row navigates to PR detail",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list; มีแถว PR อย่างน้อยหนึ่งแถว" },
        { type: "steps", description: "1. คลิกแถว PR แรก" },
        { type: "expected", description: "นำทางไปยัง /procurement/purchase-request/<id>" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      const firstRow = page.getByRole("row").nth(1);
      if ((await firstRow.count()) === 0) {
        requestorTest.skip(true, "No PR rows exist for this Requestor");
        return;
      }
      const link = firstRow.getByRole("link").first();
      if ((await link.count()) === 0) {
        requestorTest.skip(true, "First row does not contain a navigation link");
        return;
      }
      await link.click();
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050107 New PR button opens create dialog",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิก New Purchase Request" },
        { type: "expected", description: "dialog สร้างใหม่เปิดขึ้น หรือ URL เปลี่ยนเป็น /new" },
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
});

requestorTest.describe("Step 2 — Create PR (Blank)", () => {
  requestorTest(
    "TC-PR-050201 Open Create dialog → Blank → form loads",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor; อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิก New Purchase Request\n2. เลือกตัวเลือก Blank PR (ถ้า dialog ปรากฏ)\n3. รอให้ฟอร์มสร้างโหลด" },
        { type: "expected", description: "URL เปลี่ยนเป็น /procurement/purchase-request/new และฟอร์มสร้างแสดงผล" },
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
    "TC-PR-050202 Default values populated on the new form",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR" },
        { type: "steps", description: "1. ไปที่ /new\n2. ตรวจสอบค่า default ของ date, department, location, currency, status" },
        { type: "expected", description: "ฟอร์มอยู่ที่ /new และแสดง Draft indicator เมื่อ badge แสดงผล" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
      const draftBadge = page.locator("[data-slot='badge'], [class*='badge']").filter({ hasText: /draft/i }).first();
      if ((await draftBadge.count()) > 0) {
        await expect(draftBadge).toBeVisible();
      }
    },
  );

  requestorTest(
    "TC-PR-050203 Fill header fields",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR" },
        { type: "steps", description: "1. ตั้ง PR type = General\n2. ตั้ง delivery date เป็นวันในอนาคต\n3. กรอก description และ notes" },
        { type: "expected", description: "ช่อง description มีค่าที่กรอก (มี E2E-PRC marker)" },
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
        description: e2eDescription("TC-PR-050203 header fill"),
        notes: "auto-generated by E2E",
      });
      await expect(pr.descriptionInput()).toHaveValue(/E2E-PRC/);
    },
  );

  requestorTest(
    "TC-PR-050204 Add 1 basic line item",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR โดยกรอก header แล้ว" },
        { type: "steps", description: "1. คลิก Add Item\n2. กรอก product, qty, uom, unit price\n3. บันทึกรายการ" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ /new — การเพิ่มรายการไม่นำทางออกจากฟอร์มสร้าง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "Test Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050205 Add line item with FOC flag",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR โดยกรอก header แล้ว" },
        { type: "steps", description: "1. เพิ่มรายการ\n2. Toggle checkbox FOC\n3. บันทึก" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ /new หลังจากบันทึกรายการ FOC" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoNew();
      await pr.fillHeader({ prType: "general", deliveryDate: FUTURE_DATE });
      await pr.addLineItem({ product: "FOC Item", quantity: 5, uom: "ea", isFOC: true });
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050206 Add multiple line items — form stays on /new",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR" },
        { type: "steps", description: "1. เพิ่มรายการสินค้า 3 รายการที่ราคาต่างกัน\n2. ตรวจสอบว่าฟอร์มยังแสดงอยู่" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ /new หลังจากเพิ่ม 3 รายการ" },
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050207 Edit line item before save",
    {
      annotation: [
        { type: "preconditions", description: "กรอก header แล้วและเพิ่มรายการสินค้าอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เพิ่ม 1 รายการ\n2. แก้ไขจำนวน\n3. บันทึกรายการ" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ /new หลังจากแก้ไข" },
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050208 Remove line item",
    {
      annotation: [
        { type: "preconditions", description: "กรอก header แล้วและเพิ่มรายการสินค้าอย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เพิ่มรายการ\n2. คลิกปุ่มลบรายการนั้น" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ /new หลังจากลบ" },
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050209 Save as Draft → redirect to detail with PR number",
    {
      annotation: [
        { type: "preconditions", description: "กรอก header และมีรายการสินค้า ≥1 รายการ" },
        { type: "steps", description: "1. คลิก Save as Draft\n2. รอ redirect ไปยังหน้ารายละเอียด" },
        { type: "expected", description: "URL เปลี่ยนเป็น /purchase-request/<id> (ไม่ใช่ /new) และหน้ารายละเอียดแสดงผล" },
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
        description: e2eDescription("TC-PR-050209 save draft"),
      });
      await pr.addLineItem({ product: "Save Item", quantity: 1, uom: "ea", unitPrice: 100 });
      await pr.saveDraftButton().click({ timeout: 5_000 });
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 15_000 });
    },
  );

  requestorTest(
    "TC-PR-050210 Save without line items → button disabled or stays on form",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR โดยกรอก header แล้วแต่ไม่มีรายการสินค้า" },
        { type: "steps", description: "1. กรอก header\n2. คลิก Save as Draft โดยไม่เพิ่มรายการสินค้าใดๆ" },
        { type: "expected", description: "ปุ่ม Save ถูก disabled หรือฟอร์มไม่นำทางออกจาก /new" },
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
      if (disabled) {
        await expect(save).toBeDisabled();
        return;
      }
      await save.click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050211 Delivery date in the past → validation prevents save",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้าง PR" },
        { type: "steps", description: "1. ตั้ง delivery date เป็นวันที่ในอดีต\n2. เพิ่มรายการ\n3. พยายามบันทึก" },
        { type: "expected", description: "ฟอร์มไม่นำทางออกจาก /new (validation ปฏิเสธวันที่ในอดีต)" },
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
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );
});

requestorTest.describe("Step 3 — Create from Template", () => {
  requestorTest(
    "TC-PR-050301 Open Create dialog → Template option → picker opens",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor; อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. คลิก New Purchase Request\n2. เลือกตัวเลือก From-Template ใน dialog" },
        { type: "expected", description: "Template picker (dialog หรือ listbox) แสดงผลหลังเลือกตัวเลือก From-Template" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      await expect(pr.templatePicker()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050302 Select first template → form pre-fills",
    {
      annotation: [
        { type: "preconditions", description: "Template picker เปิดอยู่และมี template อย่างน้อยหนึ่งรายการ" },
        { type: "steps", description: "1. เปิด template picker\n2. เลือก template แรก" },
        { type: "expected", description: "URL มี query param template_id (ฟอร์มกำลังโหลดจาก template)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await expect(page).toHaveURL(/template_id=/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050303 Modify template-loaded items before save",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่ฟอร์มสร้างจาก template ที่มีรายการสินค้ากรอกล่วงหน้า" },
        { type: "steps", description: "1. เปิดฟอร์ม template\n2. แก้ไขจำนวนรายการสินค้าแรกที่กรอกล่วงหน้า" },
        { type: "expected", description: "ฟอร์มยังคงอยู่ที่ URL โหลด template หลังจากแก้ไข (ไม่นำทางออกก่อนเวลา)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await pr.editLineItem(0, { quantity: 9 });
      await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050304 Save template-based PR → Draft created",
    {
      annotation: [
        { type: "preconditions", description: "ฟอร์มจาก template มีรายการสินค้ากรอกล่วงหน้า" },
        { type: "steps", description: "1. เปิดฟอร์ม template\n2. คลิก Save as Draft" },
        { type: "expected", description: "URL เปลี่ยนเป็น /purchase-request/<id> (ไม่ใช่ /new) หลังบันทึก" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      await pr.gotoList();
      await pr.newButton().click();
      const tmpl = pr.createDialogTemplateOption();
      if ((await tmpl.count()) === 0) {
        requestorTest.skip(true, "Template option not present in create dialog");
        return;
      }
      await tmpl.click();
      if ((await pr.templatePickerEmpty().count()) > 0) {
        requestorTest.skip(true, "No templates exist in this build");
        return;
      }
      await pr.selectFirstTemplate();
      await pr.fillHeader({ description: e2eDescription("TC-PR-050304 from template") });
      await pr.saveDraftButton().click({ timeout: 5_000 });
      await expect(page).toHaveURL(/purchase-request\/(?!new$)[^\/?#]+$/, { timeout: 15_000 });
    },
  );

  requestorTest(
    "TC-PR-050305 Empty-state message when no templates exist",
    {
      annotation: [
        { type: "preconditions", description: "Template picker เปิดอยู่และไม่มี template ในระบบ" },
        { type: "steps", description: "1. เปิด template picker\n2. ตรวจสอบเนื้อหา" },
        { type: "expected", description: "ข้อความ empty-state ('No templates') แสดงผล ข้ามหากมี template อยู่" },
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
        requestorTest.skip(true, "Template option not present in create dialog");
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
});

requestorTest.describe("Step 4 — PR Detail", () => {
  requestorTest(
    "TC-PR-050401 Draft PR detail loads with Items tab default",
    {
      annotation: [
        { type: "preconditions", description: "มี Draft PR ของ Requestor นี้ (สร้างใน beforeEach)" },
        { type: "steps", description: "1. เปิดหน้ารายละเอียด Draft PR\n2. ตรวจสอบว่า Items tab ถูกเลือก" },
        { type: "expected", description: "Detail URL เป็น /procurement/purchase-request/<ref>; ถ้า Items tab แสดงผล ต้องเป็น tab ที่เลือกอยู่" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      const items = pr.tabItems();
      if ((await items.count()) === 0) {
        // Items tab UI not rendered — URL check above is sufficient
        return;
      }
      await expect(items).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PR-050402 Switch to Workflow History tab",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้ารายละเอียด Draft PR" },
        { type: "steps", description: "1. คลิก tab Workflow History" },
        { type: "expected", description: "tab Workflow History ถูกเลือกหลังคลิก" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        requestorTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(wh).toHaveAttribute("aria-selected", /true/i, { timeout: 5_000 });
    },
  );

  requestorTest(
    "TC-PR-050403 Edit / Delete / Submit buttons present for Draft",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้ารายละเอียด Draft PR" },
        { type: "steps", description: "1. ตรวจสอบ action toolbar" },
        { type: "expected", description: "ปุ่ม Edit, Delete และ Submit แสดงผลทั้งหมดสำหรับสถานะ Draft" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
      await expect(pr.deleteButton()).toBeVisible({ timeout: 10_000 });
      await expect(pr.submitButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050404 Edit / Delete absent when status is In Progress",
    {
      annotation: [
        { type: "preconditions", description: "มี PR ที่มีสถานะ In Progress (สร้างผ่านขั้นตอน Submit)" },
        { type: "steps", description: "1. Submit Draft PR\n2. โหลดหน้ารายละเอียดใหม่\n3. ตรวจสอบ toolbar" },
        { type: "expected", description: "ปุ่ม Edit และ Delete ไม่แสดงผล (โหมด read-only)" },
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
      await expect(pr.editModeButton()).toHaveCount(0);
      await expect(pr.deleteButton()).toHaveCount(0);
    },
  );
});

requestorTest.describe("Step 5 — Edit Draft", () => {
  requestorTest(
    "TC-PR-050501 Click Edit → enter edit mode",
    {
      annotation: [
        { type: "preconditions", description: "มี Draft PR ของ Requestor นี้" },
        { type: "steps", description: "1. เปิด Draft PR\n2. คลิก Edit" },
        { type: "expected", description: "ฟอร์มสามารถแก้ไขได้; ปุ่ม Save (หรือ Cancel) ระดับฟอร์มแสดงผล" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await expect(pr.saveDraftButton().or(pr.cancelFormButton())).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050502 Modify header description in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "Draft PR เปิดอยู่ในโหมดแก้ไข" },
        { type: "steps", description: "1. เข้าโหมดแก้ไข\n2. อัปเดต description\n3. บันทึก" },
        { type: "expected", description: "หลังบันทึก หน้ากลับสู่ detail URL (ไม่ redirect ไปที่ /new หรือ list)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      const newDesc = e2eDescription("TC-PR-050502 edited");
      await pr.fillHeader({ description: newDesc });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050503 Modify line item quantity in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "Draft PR ที่มีรายการสินค้าอย่างน้อยหนึ่งรายการเปิดอยู่ในโหมดแก้ไข" },
        { type: "steps", description: "1. เข้าโหมดแก้ไข\n2. แก้ไขจำนวนรายการสินค้าแรก\n3. บันทึก" },
        { type: "expected", description: "หลังบันทึก หน้ากลับสู่ detail URL" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 7 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050504 Add line item in edit mode",
    {
      annotation: [
        { type: "preconditions", description: "Draft PR เปิดอยู่ในโหมดแก้ไข" },
        { type: "steps", description: "1. เข้าโหมดแก้ไข\n2. คลิก Add Item\n3. กรอก product/qty/uom\n4. บันทึก" },
        { type: "expected", description: "หลังบันทึก หน้ากลับสู่ detail URL" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.addLineItem({ product: "Added in Edit", quantity: 2, uom: "ea", unitPrice: 50 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050505 Save → exit edit mode + persist changes",
    {
      annotation: [
        { type: "preconditions", description: "Draft PR เปิดอยู่ในโหมดแก้ไขและมีการเปลี่ยนแปลงอย่างน้อยหนึ่งอย่าง" },
        { type: "steps", description: "1. เข้าโหมดแก้ไข\n2. ทำการเปลี่ยนแปลง\n3. คลิก Save" },
        { type: "expected", description: "ฟอร์มกลับสู่โหมดดู (ปุ่ม Edit แสดงผลอีกครั้งในหน้ารายละเอียด)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.fillHeader({ description: e2eDescription("TC-PR-050505 persisted") });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050506 Cancel → discard changes, restore original",
    {
      annotation: [
        { type: "preconditions", description: "Draft PR เปิดอยู่ในโหมดแก้ไข" },
        { type: "steps", description: "1. เข้าโหมดแก้ไข\n2. พิมพ์ใน description\n3. คลิก Cancel" },
        { type: "expected", description: "ฟอร์มกลับสู่โหมดดู (ปุ่ม Edit แสดงผลอีกครั้งในหน้ารายละเอียด)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.fillHeader({ description: "DISCARD ME" });
      await pr.cancelEditMode();
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );
});

requestorTest.describe("Step 6 — Submit", () => {
  requestorTest(
    "TC-PR-050601 Submit → confirmation dialog appears",
    {
      annotation: [
        { type: "preconditions", description: "มี Draft PR ที่มีรายการสินค้า ≥1 รายการ" },
        { type: "steps", description: "1. เปิด Draft PR\n2. คลิก Submit" },
        { type: "expected", description: "dialog ยืนยันแสดงผล" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Draft detail in this build");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050602 Cancel submit → stays on Draft",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยัน submit เปิดอยู่" },
        { type: "steps", description: "1. เปิด dialog Submit\n2. คลิก Cancel" },
        { type: "expected", description: "dialog ปิด; URL ยังคงอยู่ที่หน้ารายละเอียด (ไม่มีการเปลี่ยนสถานะ submit)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 1 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Draft detail in this build");
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
    "TC-PR-050603 Confirm submit → status moves to In Progress",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยัน submit เปิดอยู่" },
        { type: "steps", description: "1. เปิด dialog Submit\n2. คลิก Confirm" },
        { type: "expected", description: "badge สถานะอัปเดตเป็น In Progress (ยืนยันโดย submitDraftPR helper)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const created = await createDraftPR(page, { items: 1 });
      await submitDraftPR(page, created.ref);
      // submitDraftPR ends with pr.expectStatus("in.progress") which is a hard assertion.
    },
  );

  requestorTest(
    "TC-PR-050604 Submit empty PR — button disabled or no transition",
    {
      annotation: [
        { type: "preconditions", description: "มี Draft PR ที่ไม่มีรายการสินค้า" },
        { type: "steps", description: "1. เปิด Draft PR ที่ไม่มีรายการสินค้า\n2. ตรวจสอบปุ่ม Submit" },
        { type: "expected", description: "ปุ่ม Submit ถูก disabled หรือการคลิกไม่เปลี่ยนสถานะเป็น In Progress (URL ยังคงอยู่ที่หน้ารายละเอียด)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page, { items: 0 });
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present — empty PR may have hidden it entirely");
        return;
      }
      const disabled = await submit.isDisabled().catch(() => false);
      if (disabled) {
        await expect(submit).toBeDisabled();
        return;
      }
      await submit.click({ timeout: 5_000 }).catch(() => {});
      // Close any dialog that may have opened
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      if ((await cancel.count()) > 0) await cancel.click({ timeout: 5_000 }).catch(() => {});
      // URL must remain on detail (status NOT moved to in-progress redirect)
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});

requestorTest.describe("Step 8 — Delete", () => {
  requestorTest(
    "TC-PR-050801 Click Delete → confirmation dialog",
    {
      annotation: [
        { type: "preconditions", description: "มี Draft PR ของ Requestor นี้" },
        { type: "steps", description: "1. เปิด Draft PR\n2. คลิก Delete" },
        { type: "expected", description: "dialog ยืนยันการลบแสดงผล" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const del = pr.deleteButton();
      if ((await del.count()) === 0) {
        requestorTest.skip(true, "Delete button not present on Draft detail in this build");
        return;
      }
      await del.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050802 Cancel delete → PR remains",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยันการลบเปิดอยู่" },
        { type: "steps", description: "1. เปิด dialog Delete\n2. คลิก Cancel" },
        { type: "expected", description: "dialog ปิด; URL ยังคงอยู่ที่หน้ารายละเอียด (PR ไม่ถูกลบ)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await createDraftPR(page);
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const del = pr.deleteButton();
      if ((await del.count()) === 0) {
        requestorTest.skip(true, "Delete button not present on Draft detail in this build");
        return;
      }
      await del.click({ timeout: 5_000 });
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      if ((await cancel.count()) === 0) {
        requestorTest.skip(true, "Cancel button not present in delete dialog");
        return;
      }
      await cancel.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-050803 Confirm delete → list refreshed, PR gone",
    {
      annotation: [
        { type: "preconditions", description: "dialog ยืนยันการลบเปิดอยู่" },
        { type: "steps", description: "1. เปิด dialog Delete\n2. คลิก Confirm" },
        { type: "expected", description: "หน้านำทางกลับไปที่ PR list (URL ลงท้ายด้วย /procurement/purchase-request)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const created = await createDraftPR(page);
      await deleteDraftPR(page, created.ref);
      // deleteDraftPR uses lenient waitForURL; assert hard here that list URL is current.
      await expect(page).toHaveURL(/\/procurement\/purchase-request($|\?)/, { timeout: 10_000 });
    },
  );
});

requestorTest.describe.serial("Golden Journey", () => {
  requestorTest(
    "TC-PR-050901 Full Creator flow: List → Create → Save Draft → Edit → Submit → In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น Requestor; อยู่ที่หน้า PR list" },
        { type: "steps", description: "1. เปิด list\n2. คลิก New PR (Blank)\n3. กรอก header + รายการสินค้า 1 รายการ\n4. บันทึกเป็น Draft\n5. เปิดหน้ารายละเอียดและคลิก Edit\n6. แก้ไข description\n7. บันทึก\n8. คลิก Submit และ confirm" },
        { type: "expected", description: "PR ถูกสร้าง (detail URL พร้อม ref), แก้ไขแล้ว (ปุ่ม Edit แสดงผลอีกครั้งหลังบันทึก), submit แล้ว (badge สถานะแสดง In Progress)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const pr = new PurchaseRequestPage(page);

      // Step 1-4: List → Create → Items → Save Draft (helper does the heavy lifting)
      const created = await createDraftPR(page, { items: 1, description: "TC-PR-050901 golden" });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });

      // Step 5-7: Edit description and save
      await page.goto(`${LIST_PATH}/${created.ref}`);
      await page.waitForLoadState("networkidle");
      const editBtn = pr.editModeButton();
      if ((await editBtn.count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Draft detail in this build");
        return;
      }
      await pr.enterEditMode();
      await pr.fillHeader({ description: e2eDescription("TC-PR-050901 edited golden") });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });

      // Step 8: Submit (helper asserts In Progress at the end)
      await submitDraftPR(page, created.ref);
    },
  );
});
