import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

const test = createAuthTest("admin@blueledgers.com");
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
  descriptionInputId: "department-description",
};

test.describe("Department — Smoke & CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  test(
    "TC-DEP-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/department" },
        { type: "expected", description: "URL ตรงกับ /config/department; หน้า list โหลดสำเร็จและพร้อมใช้งาน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-DEP-010009 active BU = BLAVG",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว" },
        { type: "steps", description: "1. อ่าน profile API (/api/proxy/api/user/profile)\n2. หา business unit ที่ is_default\n3. เปิดหน้าใดๆ ที่มี navbar แล้วอ่าน label ของ BU switcher" },
        { type: "expected", description: "default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      // getBusinessUnits navigates to /dashboard internally to capture the
      // profile response; the page is already on /dashboard when it returns.
      const units = await getBusinessUnits(page);
      const active = defaultBu(units);
      expect(active?.code).toBe(BU_CODE);

      const switcher = new BuSwitcherPage(page);
      await expect(switcher.trigger()).toContainText(active!.name, { timeout: 15_000 });
    },
  );

  test(
    "TC-DEP-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department" },
        { type: "steps", description: "1. ไปที่ /config/department\n2. ตรวจสอบว่าปุ่ม Add ปรากฏ" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list (พร้อมเข้าสู่ flow create)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test(
    "TC-DEP-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department" },
        { type: "steps", description: "1. ไปที่ /config/department\n2. พิมพ์ 'test' ในช่องค้นหา" },
        { type: "expected", description: "ช่องค้นหา visible และรับค่า input ได้โดยไม่ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test(
    "TC-DEP-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department" },
        { type: "steps", description: "1. ไปที่ /config/department\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-DEP-010005 บันทึกโดยไม่กรอก code/name ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department/new" },
        { type: "steps", description: "1. เปิดฟอร์ม new\n2. กด Save โดยไม่กรอก code/name (รวมถึง parent ถ้ามี)" },
        { type: "expected", description: "URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    // Stays on /new because validation fails
    await expect(page).toHaveURL(/\/new/);
  });

  // Ordered CRUD chain: create → edit → validate → delete, all operating on the
  // same record. Serial mode keeps them in one worker (stable module-level UID)
  // and skips the rest if one fails, instead of cascading into fresh workers
  // (a worker restart after a failure recomputes the Date.now()-based UID).
  test.describe.serial("CRUD chain — shares the TC-DEP-010006 record", () => {
  test(
    "TC-DEP-010006 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; record CODE/NAME ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name (ใช้ default parent/hierarchy ถ้ามี)\n3. กด Save\n4. กลับ list และค้นหาด้วย NAME" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
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
    "TC-DEP-010007 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; TC-DEP-010006 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME ใน list\n2. คลิกแถวเพื่อเปิด detail\n3. กดปุ่ม Edit\n4. clear name และกรอก NAME_UPDATED\n5. กด Save" },
        { type: "expected", description: "Updated/success toast ปรากฏ (updated/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
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
    "TC-DEP-010013 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-DEP-010007 ผ่านแล้ว → record มี name = NAME_UPDATED" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. เปิด detail\n3. กด Edit\n4. clear code + name\n5. กด Save" },
        { type: "expected", description: "Save button ยังคง visible (form ไม่ submit; ยังอยู่ใน edit mode)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
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
    "TC-DEP-010008 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-DEP-010013 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME_UPDATED ใน list\n2. เปิด detail\n3. กด Edit\n4. กด Delete\n5. ยืนยัน Delete" },
        { type: "expected", description: "Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
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
  }); // end CRUD serial chain

  addPageFormSecurityCases(test, {
    prefix: "DEP",
    listPath: PATH,
    makeHelper: (page) => new PageFormCrudHelper(page, opts),
    skipAuth: true, // TCS-DEP00112 skipped
  });

  test(
    "TC-DEP-010010 แก้ไขแล้ว persist หลัง reload",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department (code+name)\n2. เปิด detail กด Edit เปลี่ยน name เป็นค่าใหม่ แล้ว Save\n3. reload หน้า detail\n4. กลับ list ค้นหา name ใหม่และ name เดิม" },
        { type: "expected", description: "หลัง reload ฟอร์มแสดง name ใหม่ (ค่าถูก persist จริง ไม่ใช่แค่ toast); list มีแถว name ใหม่ และไม่พบ name เดิม" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D10${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010010 ${UID}`;
      const renamed = `DEP010010 Upd ${UID}`;

      // create
      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // open the record FRESH from the list, then edit (the realistic path that persists)
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.nameInput().clear();
      await h.nameInput().fill(renamed);
      await h.saveButton().click();
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // reload: the persisted value must survive a fresh fetch
      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(page.locator(`#${opts.nameInputId}`)).toHaveValue(renamed);

      // list reflects the rename
      await h.list.goto();
      await h.list.search(renamed);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible();
      await h.list.search(name);
      await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });

      // cleanup — navigate to list fresh so empty-state from prior search doesn't linger
      await h.list.goto();
      await h.list.search(renamed);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible({ timeout: 10_000 });
      await h.clickRowName(renamed);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010012 ค้นหาด้วย code เจอรายการ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department ด้วย code+name ที่รู้ค่า\n2. กลับ list แล้วค้นหาด้วย code\n3. ลบ record" },
        { type: "expected", description: "list แสดงแถวที่มี name ของ record เมื่อค้นด้วย code" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D12${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010012 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(code);
      await expect(page.getByRole("cell", { name })).toBeVisible();

      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test.fixme(
    "TC-DEP-010011 สร้าง code ซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department ด้วย code X\n2. สร้างอีกรายการด้วย code X เดิม (name ต่าง)\n3. กด Save" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: ยังอยู่ที่ฟอร์ม /new (ไม่ navigate ไป detail) — backend reject code ซ้ำ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
        { type: "note", description: "Skipped via test.fixme: backend currently has NO unique constraint on department code per BU, so duplicates are accepted. Assertion encodes the intended behaviour — unskip when the backend adds the constraint." },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D11${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010011 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(`${name} dup`);
      await h.saveButton().click();
      await expect(page).toHaveURL(/\/new/, { timeout: 10_000 });
      await expect(h.saveButton()).toBeVisible();

      // cleanup the first record
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010014 toggle is_active แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด new form\n2. ปิด switch is_active\n3. กรอก code+name แล้ว Save\n4. reload detail แล้วอ่านสถานะ switch" },
        { type: "expected", description: "หลัง save+reload switch is_active = false (ค่าถูก persist)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D14${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010014 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.setActive(false);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(h.activeSwitch()!).toHaveAttribute("aria-checked", "false");

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010018 code เกิน maxLength ต้องถูกจำกัดที่ 10",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department/new" },
        { type: "steps", description: "1. เปิด new form\n2. พิมพ์ code ยาว 15 ตัวอักษร" },
        { type: "expected", description: "ค่าใน input ถูกตัดที่ 10 ตัวอักษร (maxLength=10)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      await h.gotoNew();
      await h.codeInput().fill("ABCDEFGHIJ12345");
      await expect(h.codeInput()).toHaveValue("ABCDEFGHIJ");
    },
  );

  test(
    "TC-DEP-010021 บันทึกโดยกรอก field เดียว ต้องถูก block",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department/new" },
        { type: "steps", description: "1. เปิด new form กรอกเฉพาะ name (code ว่าง) กด Save\n2. เปิด new form ใหม่ กรอกเฉพาะ code (name ว่าง) กด Save" },
        { type: "expected", description: "ทั้งสองกรณีฟอร์ม block submit: ยังอยู่ที่ /new" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);

      await h.gotoNew();
      await h.nameInput().fill(`DEP010021 ${UID}`);
      await h.saveButton().click();
      await expect(page).toHaveURL(/\/new/);

      await h.gotoNew();
      await h.codeInput().fill(`D21${UID.slice(-4).toUpperCase()}`);
      await h.saveButton().click();
      await expect(page).toHaveURL(/\/new/);
    },
  );
});
