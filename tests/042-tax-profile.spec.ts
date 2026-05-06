import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/tax-profile";
const UID = Date.now().toString(36);
const NAME = `E2E TP ${UID}`;
const NAME_UPDATED = `E2E TP Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "tax-profile-name",
  activeSwitchId: "tax-profile-is-active",
};

test.describe("Tax Profile — Smoke & CRUD", () => {
  test(
    "TC-TP-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com via auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/tax-profile" },
        { type: "expected", description: "URL matches /config/tax-profile; หน้า list ของ tax profile (มี name + rate columns) โหลดสำเร็จ" },
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
    "TC-TP-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/tax-profile" },
        { type: "steps", description: "1. ไปที่ /config/tax-profile" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list (พร้อมเปิด dialog สำหรับ name + rate)" },
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
    "TC-TP-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/tax-profile" },
        { type: "steps", description: "1. ไปที่ /config/tax-profile\n2. พิมพ์ 'test' ในช่องค้นหา" },
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
    "TC-TP-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/tax-profile" },
        { type: "steps", description: "1. ไปที่ /config/tax-profile\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มี tax profile ที่ตรงกับคำค้น)" },
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
    "TC-TP-010005 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/tax-profile" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กด Save โดยไม่กรอก name (rate ปล่อยตามค่า default)" },
        { type: "expected", description: "Error message ปรากฏใต้ name input (required validation block submit); ปิด dialog ด้วย Cancel" },
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
    "TC-TP-010006 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; tax profile ชื่อ NAME ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กรอก name = NAME (rate ใช้ค่า default ของฟอร์ม)\n3. กด Save\n4. ค้นหา NAME ใน list" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ) และแถวใหม่ที่มี NAME ปรากฏใน list" },
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
    "TC-TP-010007 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-TP-010006 ผ่านแล้ว → tax profile ชื่อ NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME ใน list\n2. คลิกแถวเพื่อเปิด edit dialog\n3. clear name + กรอก NAME_UPDATED (ไม่แก้ rate)\n4. กด Save" },
        { type: "expected", description: "Updated/success toast ปรากฏ และแถว NAME_UPDATED ปรากฏใน list (rate คงเดิม)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME);
    await h.clickRow(NAME);
    await h.nameInput().clear();
    await h.nameInput().fill(NAME_UPDATED);
    await h.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.search(NAME_UPDATED);
    await expect(page.getByRole("cell", { name: NAME_UPDATED })).toBeVisible();
  });

  test(
    "TC-TP-010013 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-TP-010007 ผ่านแล้ว → tax profile ชื่อ NAME_UPDATED มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. เปิด edit dialog\n3. clear name (rate ไม่แตะ)\n4. กด Save" },
        { type: "expected", description: "Error message ปรากฏใต้ name input (required validation block submit); ปิด dialog ด้วย Cancel" },
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
    "TC-TP-010008 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-TP-010013 ผ่านแล้ว → tax profile ชื่อ NAME_UPDATED ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. กด delete บนแถว\n3. ยืนยัน Delete" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ) และ tax profile ถูกลบจาก DB" },
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
    prefix: "TP",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-TP00112 skipped
  });
});
