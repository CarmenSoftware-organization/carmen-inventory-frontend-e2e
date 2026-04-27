import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/adjustment-type";
const UID = Date.now().toString(36);
const CODE = `E2E${UID.slice(-4).toUpperCase()}`;
const NAME = `E2E AT ${UID}`;
const NAME_UPDATED = `E2E AT Upd ${UID}`;
const CODE_OUT = `E2EO${UID.slice(-4).toUpperCase()}`;
const NAME_OUT = `E2E AT OUT ${UID}`;

const opts = {
  listPath: PATH,
  codeInputId: "adjustment-type-code",
  nameInputId: "adjustment-type-name",
  activeSwitchId: "adjustment-type-is-active",
};

test.describe("Adjustment Type — Smoke & CRUD", () => {
  test(
    "TC-AT01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com via auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type" },
        { type: "expected", description: "URL matches /config/adjustment-type; ปุ่ม Add และช่องค้นหา visible ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
    await expect(h.list.addButton()).toBeVisible({ timeout: 10_000 });
    await expect(h.list.searchInput()).toBeVisible();
  });

  test(
    "TC-AT02 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test(
    "TC-AT03 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type\n2. พิมพ์ 'test' ในช่องค้นหา" },
        { type: "expected", description: "ช่องค้นหา visible และรับค่า input ได้โดยไม่ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test(
    "TC-AT04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    // DataGrid keeps a placeholder row in tbody when empty, so assert the
    // empty-state text instead of row count 0.
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-AT05 บันทึกโดยไม่กรอก code/name ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/adjustment-type/new" },
        { type: "steps", description: "1. เปิดฟอร์ม new\n2. กด Save โดยไม่กรอก code/name" },
        { type: "expected", description: "URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    await expect(page).toHaveURL(/\/new/);
  });

  test(
    "TC-AT06 สร้างรายการใหม่ (Stock In) และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record CODE ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name\n3. เลือก type = Stock In ใน combobox\n4. กด Save\n5. กลับ list และค้นหาด้วย CODE" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี CODE ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.codeInput().fill(CODE);
    await h.nameInput().fill(NAME);
    // `type` is a required Select — pick the first option (Stock In)
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Stock In" }).click();
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(CODE);
    await expect(
      page.getByRole("button", { name: CODE, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-AT07 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT06 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. คลิกแถวเพื่อเปิด detail\n3. กดปุ่ม Edit\n4. แก้ name เป็น NAME_UPDATED\n5. กด Save" },
        { type: "expected", description: "Updated/success toast ปรากฏ (updated/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.clickRowName(CODE);
    // Form loads in view mode → wait for the prefilled name before editing
    await expect(h.nameInput()).toHaveValue(NAME, { timeout: 10_000 });
    await h.editButton().click();
    // Wait for the input to become editable (mode switched to edit)
    await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
    await h.nameInput().fill(NAME_UPDATED);
    await h.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-AT15 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT07 ผ่านแล้ว → record มี name = NAME_UPDATED" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. เปิด detail\n3. กด Edit\n4. clear code + name\n5. กด Save" },
        { type: "expected", description: "Save button ยังคง visible (form ไม่ submit; ยังอยู่ใน edit mode)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.clickRowName(CODE);
    await expect(h.nameInput()).toHaveValue(NAME_UPDATED, { timeout: 10_000 });
    await h.editButton().click();
    await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
    await h.codeInput().clear();
    await h.nameInput().clear();
    await h.saveButton().click();
    await expect(h.saveButton()).toBeVisible();
  });

  test(
    "TC-AT08 ลบรายการ (Stock In)",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT15 ผ่านแล้ว → record CODE ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. เปิด detail\n3. กด Edit\n4. กด Delete\n5. ยืนยัน Delete" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.clickRowName(CODE);
    await h.editButton().click();
    await h.deleteButton().click();
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-AT09 สร้างรายการใหม่ (Stock Out) และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record CODE_OUT ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code_out + name_out\n3. เลือก type = Stock Out ใน combobox\n4. กด Save\n5. กลับ list และค้นหาด้วย CODE_OUT" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี CODE_OUT ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.codeInput().fill(CODE_OUT);
    await h.nameInput().fill(NAME_OUT);
    await page.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Stock Out" }).click();
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(CODE_OUT);
    await expect(
      page.getByRole("button", { name: CODE_OUT, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-AT10 ลบรายการ (Stock Out)",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT09 ผ่านแล้ว → record CODE_OUT มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา CODE_OUT ใน list\n2. เปิด detail\n3. กด Edit\n4. กด Delete\n5. ยืนยัน Delete" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE_OUT);
    await h.clickRowName(CODE_OUT);
    await h.editButton().click();
    await h.deleteButton().click();
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  addPageFormSecurityCases(test, {
    prefix: "AT",
    listPath: PATH,
    makeHelper: (page) => new PageFormCrudHelper(page, opts),
    // TC-AT09/AT10 used by Stock Out create/delete — security cases start at 11 (TCS-AT11..14)
    startIndex: 11,
    skipAuth: true, // TCS-AT14 skipped
  });
});
