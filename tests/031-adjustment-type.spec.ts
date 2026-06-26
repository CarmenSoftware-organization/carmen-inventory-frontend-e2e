import { expect, type Page } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";
import { uid, fakeCode, fakeName, buildEntity } from "./helpers/test-data";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/config/adjustment-type";
const { code: CODE, name: NAME, nameUpdated: NAME_UPDATED } = buildEntity({ codePrefix: "E2EA", tag: "AT" });

const opts = {
  listPath: PATH,
  nameInputId: "adjustment-type-name",
  activeSwitchId: "adjustment-type-is-active",
  descriptionInputId: "adjustment-type-description",
};

test.describe("Adjustment Type — Smoke & CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  // Adjustment-type's unique key is `code`. Helpers below fill the extra `code`
  // field and the required `type` Radix Select inside the open dialog.
  const selectType = async (
    h: DialogCrudHelper,
    page: Page,
    label: "Stock In" | "Stock Out" = "Stock In",
  ) => {
    await h.dialog().getByRole("combobox").first().click();
    await page.getByRole("option", { name: label }).click();
  };

  const createAT = async (
    h: DialogCrudHelper,
    page: Page,
    code: string,
    name: string,
    active = true,
  ) => {
    await h.openAddDialog();
    await page.locator("#adjustment-type-code").fill(code);
    await h.nameInput().fill(name);
    await selectType(h, page);
    if (!active) await h.setActive(false);
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  };

  test(
    "TC-AT-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type" },
        { type: "expected", description: "URL ตรงกับ /config/adjustment-type; หน้า list render สำเร็จ" },
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
    "TC-AT-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type" },
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
    "TC-AT-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type\n2. พิมพ์ 'test' ในช่องค้นหา" },
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
    "TC-AT-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/adjustment-type" },
        { type: "steps", description: "1. ไปที่ /config/adjustment-type\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${uid}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-AT-010005 active BU = BLAVG",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว" },
        { type: "steps", description: "1. อ่าน profile API (/api/proxy/api/user/profile)\n2. หา business unit ที่ is_default\n3. เปิดหน้าที่มี navbar แล้วอ่าน label ของ BU switcher" },
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
    "TC-AT-200001 บันทึกโดยไม่กรอกข้อมูลต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/adjustment-type" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กด Save โดยไม่กรอก code/name" },
        { type: "expected", description: "Error message แสดงใน dialog (required validation); dialog ยังเปิดอยู่" },
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
    "TC-AT-030001 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; record CODE ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กรอก code = CODE, name = NAME, เลือก type = Stock In\n3. กด Save\n4. ค้นหาด้วย CODE" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี CODE ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await createAT(h, page, CODE, NAME);
    await h.list.search(CODE);
    await expect(
      page.getByRole("button", { name: CODE, exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-AT-040001 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT-030001 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. คลิกแถวเพื่อเปิด edit dialog\n3. clear ชื่อและกรอก NAME_UPDATED\n4. กด Save\n5. ค้นหา CODE" },
        { type: "expected", description: "Updated/success toast ปรากฏ; แถว CODE ที่มีชื่อ NAME_UPDATED ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.clickRow(CODE);
    await h.nameInput().clear();
    await h.nameInput().fill(NAME_UPDATED);
    await h.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    // List uses CACHE_STATIC; re-navigate to force a fresh fetch before asserting.
    await h.list.goto();
    await h.list.search(CODE);
    await expect(page.getByRole("cell", { name: NAME_UPDATED })).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-AT-200002 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT-040001 ผ่านแล้ว → record มี name = NAME_UPDATED" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. เปิด edit dialog\n3. clear name\n4. กด Save" },
        { type: "expected", description: "Error message แสดงใน dialog (required validation); dialog ยังเปิดอยู่" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.clickRow(CODE);
    await h.nameInput().clear();
    await h.saveButton().click();
    await expect(h.errorMessage().first()).toBeVisible();
    await h.cancelButton().click();
  });

  test(
    "TC-AT-050001 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-AT-200002 ผ่านแล้ว → record CODE ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา CODE ใน list\n2. กด Delete ที่แถว\n3. ยืนยัน Delete" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new DialogCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(CODE);
    await h.deleteRow(CODE);
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-AT-040002 toggle is_active แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด Add dialog กรอก code/name เลือก type ปิด switch is_active กด Save\n2. เปิดแถวอีกครั้งอ่านสถานะ switch\n3. ลบ record" },
        { type: "expected", description: "หลังเปิดแถวใหม่ switch is_active = false (ค่าถูก persist)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const code = fakeCode("E2EB");
      const name = fakeName({ tag: "AT042" });
      await h.list.goto();
      await createAT(h, page, code, name, false);

      await h.list.search(code);
      await h.clickRow(code);
      await expect(h.activeSwitch()!).toHaveAttribute("aria-checked", "false", { timeout: 5_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(code);
      await h.deleteRow(code);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-AT-040003 แก้ไขชื่อแล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิดแถวจาก list แก้ name แล้ว Save\n3. ยืนยัน list มี name ใหม่ ไม่พบ name เดิม\n4. ลบ record" },
        { type: "expected", description: "Updated; list มีแถว name ใหม่ และไม่พบ name เดิม (ค่าถูก persist จริง)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const code = fakeCode("E2EC");
      const name = fakeName({ tag: "AT043" });
      const renamed = fakeName({ tag: "AT043 Upd" });
      await h.list.goto();
      await createAT(h, page, code, name);

      await h.list.search(code);
      await h.clickRow(code);
      await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
      await h.nameInput().fill(renamed);
      await h.saveButton().click();
      await expect(h.dialog()).toBeHidden({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(code);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible({ timeout: 10_000 });

      await h.deleteRow(code);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-AT-040004 ยกเลิกการแก้ไข ค่าต้องไม่ถูกบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิดแถวแก้ name เป็นค่าใหม่\n3. กด Cancel (dialog ปิดโดยไม่ save)\n4. เปิดแถวเดิมอีกครั้งเช็ค name\n5. ลบ record" },
        { type: "expected", description: "หลัง Cancel แล้วเปิดใหม่ name ยังเป็นค่าเดิม (การแก้ไขไม่ถูกบันทึก)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const code = fakeCode("E2ED");
      const name = fakeName({ tag: "AT044" });
      await h.list.goto();
      await createAT(h, page, code, name);

      await h.list.search(code);
      await h.clickRow(code);
      await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
      await h.nameInput().fill(`${name} DIRTY`);
      await h.cancelButton().click();
      await expect(h.dialog()).toBeHidden({ timeout: 5_000 });

      await h.list.goto();
      await h.list.search(code);
      await h.clickRow(code);
      await expect(h.nameInput()).toHaveValue(name, { timeout: 5_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(code);
      await h.deleteRow(code);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-AT-200003 สร้าง code ซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record ด้วย code X\n2. เปิด Add dialog กรอก code X เดิม + ชื่อใหม่ เลือก type กด Save" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: dialog ยังเปิดอยู่ (backend reject code ซ้ำ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const code = fakeCode("E2EF");
      await h.list.goto();
      await createAT(h, page, code, fakeName({ tag: "AT200" }));

      await h.openAddDialog();
      await page.locator("#adjustment-type-code").fill(code);
      await h.nameInput().fill(fakeName({ tag: "AT200b" }));
      await selectType(h, page);
      await h.saveButton().click();
      await expect(h.dialog()).toBeVisible({ timeout: 10_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(code);
      await h.deleteRow(code);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-AT-050002 ยกเลิกการลบ record ต้องยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิด delete dialog แล้วกด Cancel\n3. ค้นหา record ใน list\n4. ลบ record (cleanup)" },
        { type: "expected", description: "Delete dialog ปิดโดยไม่ลบ; record ยังปรากฏใน list" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const code = fakeCode("E2EG");
      await h.list.goto();
      await createAT(h, page, code, fakeName({ tag: "AT050" }));

      await h.list.goto();
      await h.list.search(code);
      await h.deleteRow(code);
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(Cancel|ยกเลิก)$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 5_000 });

      await h.list.goto();
      await h.list.search(code);
      await expect(
        page.getByRole("button", { name: code, exact: true }).first(),
      ).toBeVisible();

      await h.deleteRow(code);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  addDialogSecurityCases(test, {
    prefix: "AT",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true,
  });
});
