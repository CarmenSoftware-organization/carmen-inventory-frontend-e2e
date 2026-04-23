import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/department";
const UID = Date.now().toString(36);
const CODE = `E2E${UID.slice(-4).toUpperCase()}`;
const NAME = `E2E DEP ${UID}`;
const NAME_UPDATED = `E2E DEP Upd ${UID}`;

const opts = {
  listPath: PATH,
  codeInputId: "department-code",
  nameInputId: "department-name",
  activeSwitchId: "department-is-active",
};

test.describe.configure({ mode: "serial" });

test.describe("Department — Smoke & CRUD", () => {
  test(
    "TC-DEP01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "expected", description: "หน้า list โหลดสำเร็จ" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-DEP02 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "expected", description: "ปุ่ม Add แสดง" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test(
    "TC-DEP03 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "expected", description: "ช่องค้นหาใช้งานได้" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test(
    "TC-DEP04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "expected", description: "ค้นหาคำที่ไม่มีต้องแสดง empty state" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-DEP05 บันทึกโดยไม่กรอก code/name ต้องแสดง error",
    {
      annotation: [
        { type: "expected", description: "บันทึกโดยไม่กรอก code/name ต้องแสดง error" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    // Stays on /new because validation fails
    await expect(page).toHaveURL(/\/new/);
  });

  test(
    "TC-DEP06 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "expected", description: "สร้างรายการใหม่และปรากฏในตาราง" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.codeInput().fill(CODE);
    await h.nameInput().fill(NAME);
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(NAME);
    await expect(page.getByRole("cell", { name: NAME })).toBeVisible();
  });

  test(
    "TC-DEP07 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "expected", description: "แก้ไขชื่อและบันทึก" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME);
    await h.clickRowName(NAME);
    await h.editButton().click();
    await h.nameInput().clear();
    await h.nameInput().fill(NAME_UPDATED);
    await h.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-DEP13 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "expected", description: "แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME_UPDATED);
    await h.clickRowName(NAME_UPDATED);
    await h.editButton().click();
    await h.codeInput().clear();
    await h.nameInput().clear();
    await h.saveButton().click();
    // Validation must keep us on the form (Save button still visible)
    await expect(h.saveButton()).toBeVisible();
  });

  test(
    "TC-DEP08 ลบรายการ",
    {
      annotation: [
        { type: "expected", description: "ลบรายการ" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME_UPDATED);
    await h.clickRowName(NAME_UPDATED);
    await h.editButton().click();
    await h.deleteButton().click();
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  addPageFormSecurityCases(test, {
    prefix: "DEP",
    listPath: PATH,
    makeHelper: (page) => new PageFormCrudHelper(page, opts),
    skipAuth: true, // TCS-DEP12 skipped
  });
});
