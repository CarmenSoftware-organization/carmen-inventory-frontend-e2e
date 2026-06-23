import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/operation-plan/equipment-category";
const UID = Date.now().toString(36);
const NAME = `E2E EQPC ${UID}`;
const NAME_UPDATED = `E2E EQPC Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "eq-cat-name",
  activeSwitchId: "eq-cat-is-active",
  descriptionInputId: "eq-cat-description",
};

test.describe("Equipment Category — Smoke & CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  test(
    "TC-EQPC-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category" },
        { type: "expected", description: "URL ตรงกับ /operation-plan/equipment-category; หน้า list โหลดสำเร็จโดยไม่ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      await h.list.goto();
      await expect(page).toHaveURL(new RegExp(PATH));
    },
  );

  test(
    "TC-EQPC-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /operation-plan/equipment-category" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      await h.list.goto();
      await expect(h.list.addButton()).toBeVisible();
    },
  );

  test(
    "TC-EQPC-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /operation-plan/equipment-category" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category\n2. พิมพ์ 'test' ในช่องค้นหา" },
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
    },
  );

  test(
    "TC-EQPC-900001 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /operation-plan/equipment-category" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      await h.list.goto();
      await h.list.search(`__NOPE__${UID}`);
      await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EQPC-010005 active BU = BLAVG",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว" },
        { type: "steps", description: "1. อ่าน profile API\n2. หา business unit ที่ is_default\n3. เปิดหน้าที่มี navbar แล้วอ่าน label ของ BU switcher" },
        { type: "expected", description: "default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const units = await getBusinessUnits(page);
      const active = defaultBu(units);
      expect(active?.code).toBe(BU_CODE);

      const switcher = new BuSwitcherPage(page);
      await expect(switcher.trigger()).toContainText(active!.name, { timeout: 15_000 });
    },
  );

  test(
    "TC-EQPC-200001 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /operation-plan/equipment-category" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category\n2. เปิด dialog Add\n3. กด Save โดยไม่กรอก name" },
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
    },
  );

  test(
    "TC-EQPC-030001 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ /operation-plan/equipment-category\n2. เปิด dialog Add\n3. กรอก name\n4. กด Save\n5. ค้นหาด้วย NAME" },
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
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
      await h.list.search(NAME);
      await expect(page.getByRole("cell", { name: NAME })).toBeVisible();
    },
  );

  test(
    "TC-EQPC-040001 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-EQPC-030001 ผ่านแล้ว → record NAME มีอยู่ใน DB" },
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
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
      await h.list.search(NAME_UPDATED);
      await expect(
        page.getByRole("button", { name: NAME_UPDATED, exact: true }).first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EQPC-040002 toggle is_active แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด Add dialog กรอก name ปิด switch is_active กด Save\n2. เปิดแถวอีกครั้งอ่านสถานะ switch\n3. ลบ record" },
        { type: "expected", description: "หลังเปิดแถวใหม่ switch is_active = false (ค่าถูก persist)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EQPC042 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.setActive(false);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.activeSwitch()!).toHaveAttribute("aria-checked", "false", { timeout: 5_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EQPC-200002 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-EQPC-040001 ผ่านแล้ว → record มี name = NAME_UPDATED" },
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
    },
  );

  test(
    "TC-EQPC-050001 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-EQPC-200002 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB" },
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
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EQPC-050002 ยกเลิกการลบ record ต้องยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิด delete dialog แล้วกด Cancel\n3. ค้นหา record ใน list\n4. ลบ record (cleanup)" },
        { type: "expected", description: "Delete dialog ปิดโดยไม่ลบ; record ยังปรากฏใน list" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Alternate Flow" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EQPC050 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(Cancel|ยกเลิก)$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 5_000 });

      await h.list.goto();
      await h.list.search(name);
      await expect(page.getByRole("cell", { name })).toBeVisible();

      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  addDialogSecurityCases(test, {
    prefix: "EQPC",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true,
  });
});
