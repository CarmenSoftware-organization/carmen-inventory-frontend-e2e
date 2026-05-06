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

test.describe("Currency — Smoke & CRUD", () => {
  test(
    "TC-CUR-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com via auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/currency" },
        { type: "expected", description: "URL matches /config/currency; ปุ่ม Add และช่องค้นหา visible ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
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
    "TC-CUR-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/currency" },
        { type: "steps", description: "1. ไปที่ /config/currency" },
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
    "TC-CUR-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/currency" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. พิมพ์ 'test' ในช่องค้นหา" },
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
    "TC-CUR-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/currency" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
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
    "TC-CUR-010005 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; เปิด add dialog ของ /config/currency" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. เปิด add dialog\n3. กด Save โดยไม่กรอก name (และไม่เลือก ISO code)\n4. ปิด dialog ด้วย Cancel" },
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
    "TC-CUR-010006 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB; ISO code IDR เลือกได้จาก lookup" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. เปิด add dialog\n3. คลิกปุ่ม LookupCurrencyIso แล้วค้นหา 'IDR'\n4. เลือกแถว IDR (จะ auto-fill symbol และ exchange_rate)\n5. กรอก name = NAME\n6. กด Save\n7. ค้นหา NAME ใน list" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี Name = NAME ปรากฏใน list ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
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
    "TC-CUR-010007 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-CUR-010006 ผ่านแล้ว → record NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. ค้นหา NAME\n3. คลิกแถวเพื่อเปิด edit dialog\n4. clear name แล้วกรอก NAME_UPDATED\n5. กด Save\n6. ค้นหา NAME_UPDATED" },
        { type: "expected", description: "Updated/success toast ปรากฏ; แถวที่มี Name = NAME_UPDATED ปรากฏใน list" },
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
    "TC-CUR-010013 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-CUR-010007 ผ่านแล้ว → record มี name = NAME_UPDATED" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. ค้นหา NAME_UPDATED\n3. คลิกแถวเพื่อเปิด edit dialog\n4. clear name\n5. กด Save\n6. ปิด dialog ด้วย Cancel" },
        { type: "expected", description: "Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)" },
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
    "TC-CUR-010008 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-CUR-010013 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ /config/currency\n2. ค้นหา NAME_UPDATED\n3. กด delete บนแถว\n4. ยืนยัน Delete" },
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
    prefix: "CUR",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TCS-CUR00112 skipped
  });
});
