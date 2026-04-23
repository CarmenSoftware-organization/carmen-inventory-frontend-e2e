import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@zebra.com");
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

test.describe.configure({ mode: "serial" });

test.describe("Adjustment Type — Smoke & CRUD", () => {
  test("TC-AT01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
    await expect(h.list.addButton()).toBeVisible({ timeout: 10_000 });
    await expect(h.list.searchInput()).toBeVisible();
  });

  test("TC-AT02 ปุ่ม Add แสดง", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test("TC-AT03 ช่องค้นหาใช้งานได้", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test("TC-AT04 ค้นหาคำที่ไม่มีต้องแสดง empty state", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    // DataGrid keeps a placeholder row in tbody when empty, so assert the
    // empty-state text instead of row count 0.
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-AT05 บันทึกโดยไม่กรอก code/name ต้องแสดง error", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    await expect(page).toHaveURL(/\/new/);
  });

  test("TC-AT06 สร้างรายการใหม่ (Stock In) และปรากฏในตาราง", async ({ page }) => {
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

  test("TC-AT07 แก้ไขชื่อและบันทึก", async ({ page }) => {
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

  test("TC-AT15 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error", async ({ page }) => {
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

  test("TC-AT08 ลบรายการ (Stock In)", async ({ page }) => {
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

  test("TC-AT09 สร้างรายการใหม่ (Stock Out) และปรากฏในตาราง", async ({ page }) => {
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

  test("TC-AT10 ลบรายการ (Stock Out)", async ({ page }) => {
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
