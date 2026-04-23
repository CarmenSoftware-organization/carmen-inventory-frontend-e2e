import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/credit-term";
const UID = Date.now().toString(36);
const NAME = `E2E CT ${UID}`;
const NAME_UPDATED = `E2E CT Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "credit-term-name",
  activeSwitchId: "credit-term-is-active",
};

test.describe.configure({ mode: "serial" });

test.describe("Credit Term — Smoke & CRUD", () => {
  test("TC-CT01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test("TC-CT02 ปุ่ม Add แสดง", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test("TC-CT03 ช่องค้นหาใช้งานได้", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test("TC-CT04 ค้นหาคำที่ไม่มีต้องแสดง empty state", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-CT05 บันทึกโดยไม่กรอกชื่อต้องแสดง error", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.openAddDialog();
    await h.saveButton().click();
    await expect(h.errorMessage().first()).toBeVisible();
    await h.cancelButton().click();
  });

  test("TC-CT06 สร้างรายการใหม่และปรากฏในตาราง", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.openAddDialog();
    await h.nameInput().fill(NAME);
    // `value` (credit term days) is required — schema requires min 1
    await page.locator("#credit-term-value").fill("30");
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.search(NAME);
    await expect(
      page.getByRole("button", { name: NAME, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("TC-CT07 แก้ไขชื่อและบันทึก", async ({ page }) => {
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

  test("TC-CT13 แก้ไข: clear name แล้วบันทึก ต้องแสดง error", async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(NAME_UPDATED);
    await h.clickRow(NAME_UPDATED);
    await h.nameInput().clear();
    await h.saveButton().click();
    await expect(h.errorMessage().first()).toBeVisible();
    await h.cancelButton().click();
  });

  test("TC-CT08 ลบรายการ", async ({ page }) => {
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
    prefix: "CT",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-CT12 skipped
  });
});
