import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/extra-cost";
const UID = Date.now().toString(36);
const NAME = `E2E EC ${UID}`;
const NAME_UPDATED = `E2E EC Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "extra-cost-name",
  activeSwitchId: "extra-cost-is-active",
};

test.describe.configure({ mode: "serial" });

test.describe("Extra Cost — Smoke & CRUD", () => {
  test(
    "TC-EC01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "expected", description: "หน้า list โหลดสำเร็จ" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-EC02 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "expected", description: "ปุ่ม Add แสดง" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test(
    "TC-EC03 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "expected", description: "ช่องค้นหาใช้งานได้" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test(
    "TC-EC04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "expected", description: "ค้นหาคำที่ไม่มีต้องแสดง empty state" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-EC05 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "expected", description: "บันทึกโดยไม่กรอกชื่อต้องแสดง error" },
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
    "TC-EC06 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "expected", description: "สร้างรายการใหม่และปรากฏในตาราง" },
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
    "TC-EC07 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "expected", description: "แก้ไขชื่อและบันทึก" },
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
    "TC-EC13 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "expected", description: "แก้ไข: clear name แล้วบันทึก ต้องแสดง error" },
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
    "TC-EC08 ลบรายการ",
    {
      annotation: [
        { type: "expected", description: "ลบรายการ" },
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
    prefix: "EC",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-EC12 skipped
  });
});
