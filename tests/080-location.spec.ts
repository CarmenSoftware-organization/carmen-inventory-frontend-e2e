import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/location";
const UID = Date.now().toString(36);
const CODE = `E2E${UID.slice(-4).toUpperCase()}`;
const NAME = `E2E LOC ${UID}`;
const NAME_UPDATED = `E2E LOC Upd ${UID}`;
const CODE_DIRECT = `E2ED${UID.slice(-4).toUpperCase()}`;
const NAME_DIRECT = `E2E LOC Direct ${UID}`;
const CODE_CONSIGN = `E2EC${UID.slice(-4).toUpperCase()}`;
const NAME_CONSIGN = `E2E LOC Consign ${UID}`;

const opts = {
  listPath: PATH,
  codeInputId: "location-code",
  nameInputId: "location-name",
  activeSwitchId: "location-is-active",
};

test.describe("Location — Smoke & CRUD", () => {
  test(
    "TC-LOC00101 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com via auth fixture" },
        { type: "steps", description: "1. ไปที่ /config/location" },
        { type: "expected", description: "URL matches /config/location; หน้า list render สำเร็จโดยไม่มี error" },
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
    "TC-LOC00102 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/location" },
        { type: "steps", description: "1. ไปที่ /config/location" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
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
    "TC-LOC00103 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/location" },
        { type: "steps", description: "1. ไปที่ /config/location\n2. พิมพ์ 'test' ในช่องค้นหา" },
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
    "TC-LOC00104 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/location" },
        { type: "steps", description: "1. ไปที่ /config/location\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
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
    "TC-LOC00105 บันทึกโดยไม่กรอก code/name ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /config/location/new" },
        { type: "steps", description: "1. เปิดฟอร์ม new\n2. กด Save โดยไม่กรอก code/name" },
        { type: "expected", description: "URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    await expect(page).toHaveURL(/\/new/);
  });

  test(
    "TC-LOC00106 สร้างรายการใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record CODE/NAME ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name\n3. เลือก Location Type = Inventory\n4. เลือก Physical Count = Yes\n5. เปิด dialog Select Delivery Point และเลือกตัวเลือกแรก\n6. กด Save\n7. กลับ list และค้นหาด้วย NAME" },
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
    const locationTypeGroup = page.getByRole("group").filter({ hasText: "Location Type" });
    await locationTypeGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Inventory" }).click();
    await expect(locationTypeGroup).toContainText("Inventory");
    const physicalCountGroup = page.getByRole("group").filter({ hasText: "Physical Count" });
    await physicalCountGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Yes" }).click();
    await expect(physicalCountGroup).toContainText("Yes");
    await page.getByRole("button", { name: /Select Delivery Point/i }).click();
    await page.getByRole("dialog").locator("button[data-value]").first().click();
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(NAME);
    await expect(page.getByRole("cell", { name: NAME })).toBeVisible();
  });

  test(
    "TC-LOC00107 แก้ไขชื่อและบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "TC-LOC00106 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB" },
        { type: "steps", description: "1. ค้นหา NAME ใน list\n2. คลิกแถวเพื่อเปิด detail\n3. กด Edit\n4. clear name แล้วใส่ NAME_UPDATED\n5. กด Save" },
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
    "TC-LOC00113 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "TC-LOC00107 ผ่านแล้ว → record มี name = NAME_UPDATED" },
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
    await expect(h.saveButton()).toBeVisible();
  });

  test(
    "TC-LOC00108 ลบรายการ",
    {
      annotation: [
        { type: "preconditions", description: "TC-LOC00113 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB" },
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

  test(
    "TC-LOC00114 สร้าง location_type = Direct และลบ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record CODE_DIRECT/NAME_DIRECT ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code_direct + name_direct\n3. เลือก Location Type = Direct\n4. เลือก Physical Count = Yes\n5. เลือก Delivery Point\n6. กด Save\n7. กลับ list ค้นหา NAME_DIRECT\n8. เปิด detail → Edit → Delete → ยืนยัน" },
        { type: "expected", description: "Created toast → แถวปรากฏใน list → Deleted toast หลังลบ (วงจร CRUD ครบสำหรับ type Direct)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.codeInput().fill(CODE_DIRECT);
    await h.nameInput().fill(NAME_DIRECT);
    const locationTypeGroup = page.getByRole("group").filter({ hasText: "Location Type" });
    await locationTypeGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Direct" }).click();
    await expect(locationTypeGroup).toContainText("Direct");
    const physicalCountGroup = page.getByRole("group").filter({ hasText: "Physical Count" });
    await physicalCountGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Yes" }).click();
    await expect(physicalCountGroup).toContainText("Yes");
    await page.getByRole("button", { name: /Select Delivery Point/i }).click();
    await page.getByRole("dialog").locator("button[data-value]").first().click();
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(NAME_DIRECT);
    await expect(page.getByRole("cell", { name: NAME_DIRECT })).toBeVisible();
    await h.clickRowName(NAME_DIRECT);
    await h.editButton().click();
    await h.deleteButton().click();
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test(
    "TC-LOC00115 สร้าง location_type = Consignment และลบ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; record CODE_CONSIGN/NAME_CONSIGN ยังไม่มีอยู่ใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code_consign + name_consign\n3. เลือก Location Type = Consignment\n4. เลือก Physical Count = Yes\n5. เลือก Delivery Point\n6. กด Save\n7. กลับ list ค้นหา NAME_CONSIGN\n8. เปิด detail → Edit → Delete → ยืนยัน" },
        { type: "expected", description: "Created toast → แถวปรากฏใน list → Deleted toast หลังลบ (วงจร CRUD ครบสำหรับ type Consignment)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.codeInput().fill(CODE_CONSIGN);
    await h.nameInput().fill(NAME_CONSIGN);
    const locationTypeGroup = page.getByRole("group").filter({ hasText: "Location Type" });
    await locationTypeGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Consignment" }).click();
    await expect(locationTypeGroup).toContainText("Consignment");
    const physicalCountGroup = page.getByRole("group").filter({ hasText: "Physical Count" });
    await physicalCountGroup.getByRole("combobox").first().click();
    await page.getByRole("option", { name: "Yes" }).click();
    await expect(physicalCountGroup).toContainText("Yes");
    await page.getByRole("button", { name: /Select Delivery Point/i }).click();
    await page.getByRole("dialog").locator("button[data-value]").first().click();
    await h.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await h.list.goto();
    await h.list.search(NAME_CONSIGN);
    await expect(page.getByRole("cell", { name: NAME_CONSIGN })).toBeVisible();
    await h.clickRowName(NAME_CONSIGN);
    await h.editButton().click();
    await h.deleteButton().click();
    await h.deleteConfirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  addPageFormSecurityCases(test, {
    prefix: "LOC",
    listPath: PATH,
    makeHelper: (page) => new PageFormCrudHelper(page, opts),
    skipAuth: true,
  });
});
