import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/currency";
const UID = Date.now().toString(36);
const NAME = `E2E CUR ${UID}`;
const NAME_UPDATED = `E2E CUR Upd ${UID}`;

const opts = {
  listPath: PATH,
  nameInputId: "currency-name",
  activeSwitchId: "currency-is-active",
};

test.describe.configure({ mode: "serial" });

test.describe("Currency — Smoke & CRUD", () => {
  test(
    "TC-CUR01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "expected", description: "หน้า list โหลดสำเร็จ" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
    await expect(h.list.addButton()).toBeVisible({ timeout: 10_000 });
    await expect(h.list.searchInput()).toBeVisible();
  });

  test(
    "TC-CUR02 ปุ่ม Add แสดง",
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
    "TC-CUR03 ช่องค้นหาใช้งานได้",
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
    "TC-CUR04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
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
    "TC-CUR05 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
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
    "TC-CUR06 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "expected", description: "สร้างรายการใหม่และปรากฏในตาราง" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.openAddDialog();
    // Code is a LookupCurrencyIso (Popover + cmdk) — open it, search "USD",
    // and click the matching item. Selecting it auto-fills symbol &
    // exchange_rate (both disabled).
    await h.dialog()
      .getByRole("button", { expanded: false })
      .first()
      .click();
    const search = page.getByPlaceholder(/Search/i).last();
    await search.click();
    await search.pressSequentially("IDR", { delay: 30 });
    // VirtualCommandList renders items as <button> with data-value containing
    // "<code> <name> <country>". Wait for the IDR row, then click it.
    const idrOption = page.locator('button[data-value^="IDR "]').first();
    await idrOption.waitFor({ state: "visible", timeout: 5_000 });
    await idrOption.click();
    await h.nameInput().fill(NAME);
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.search(NAME);
    // CellAction is on the Code column (IDR), not Name — assert the Name cell
    await expect(
      page.getByRole("cell", { name: NAME, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-CUR07 แก้ไขชื่อและบันทึก",
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
    "TC-CUR13 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
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
    "TC-CUR08 ลบรายการ",
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
    prefix: "CUR",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-CUR12 skipped
  });
});
