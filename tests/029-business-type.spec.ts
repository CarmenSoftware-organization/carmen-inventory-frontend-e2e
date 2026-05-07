import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/business-type";
const UID = Date.now().toString(36);
const NAME = `E2E BT ${UID}`;
const NAME_UPDATED = `E2E BT Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "business-type-name",
  activeSwitchId: "business-type-is-active",
};

test.describe("Business Type — Smoke & CRUD", () => {
  test(
    "TC-BT-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com ผ่าน auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/business-type" },
        { type: "expected", description: "URL ตรงกับ /config/business-type; หน้า list โหลดสำเร็จโดยไม่ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-BT-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com; อยู่ที่ /config/business-type" },
        { type: "steps", description: "1. ไปที่ /config/business-type" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test(
    "TC-BT-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com; อยู่ที่ /config/business-type" },
        { type: "steps", description: "1. ไปที่ /config/business-type\n2. พิมพ์ 'test' ในช่องค้นหา" },
        { type: "expected", description: "ช่องค้นหา visible และรับค่า input ได้โดยไม่ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test(
    "TC-BT-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com; อยู่ที่ /config/business-type" },
        { type: "steps", description: "1. ไปที่ /config/business-type\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-BT-010005 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com; อยู่ที่ /config/business-type" },
        { type: "steps", description: "1. ไปที่ /config/business-type\n2. เปิด dialog Add\n3. กด Save โดยไม่กรอก name" },
        { type: "expected", description: "Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.openAddDialog();
    await h.saveButton().click();
    await expect(h.errorMessage().first()).toBeVisible();
    await h.cancelButton().click();
  });

  test(
    "TC-BT-010006 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น purchase@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ /config/business-type\n2. เปิด dialog Add\n3. กรอก name\n4. กด Save\n5. ค้นหาด้วย NAME" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.openAddDialog();
    await h.nameInput().fill(NAME);
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.search(NAME);
    await expect(page.getByRole("cell", { name: NAME })).toBeVisible();
  });

  test(
    "TC-BT-010007 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-BT-010006 ผ่านแล้ว → record NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME ใน list\n2. คลิกแถวเพื่อเปิด edit dialog\n3. แก้ name เป็น NAME_UPDATED\n4. กด Save\n5. ค้นหาด้วย NAME_UPDATED" },
        { type: "expected", description: "Updated/success toast ปรากฏ; แถวที่มี NAME_UPDATED ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME);
    await h.clickRow(NAME);
    await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
    await h.nameInput().fill(NAME_UPDATED);
    await h.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.search(NAME_UPDATED);
    await expect(
      page.getByRole("button", { name: NAME_UPDATED, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-BT-010013 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-BT-010007 ผ่านแล้ว → record มี name = NAME_UPDATED" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. เปิด edit dialog\n3. clear name\n4. กด Save" },
        { type: "expected", description: "Error message ปรากฏใน dialog (form block submit; ยังคงอยู่ใน edit mode)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME_UPDATED);
    await h.clickRow(NAME_UPDATED);
    await h.nameInput().clear();
    await h.saveButton().click();
    await expect(h.errorMessage().first()).toBeVisible();
    await h.cancelButton().click();
  });

  test(
    "TC-BT-010008 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-BT-010013 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. กด Delete บนแถว\n3. ยืนยัน Delete ใน confirm dialog" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME_UPDATED);
    await h.deleteRow(NAME_UPDATED);
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  addDialogSecurityCases(test, {
    prefix: "BT",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-BT00112 skipped
  });
});
