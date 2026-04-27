import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { VendorPage } from "./pages/vendor.page";

const test = createAuthTest("purchase@blueledgers.com");

const UID = Date.now().toString(36);
const CODE = `V${UID.slice(-6).toUpperCase()}`;
const NAME = `E2E VEN ${UID}`;
const NAME_UPDATED = `E2E VEN Upd ${UID}`;

test.describe("Vendor — List smoke", () => {
  test(
    "TC-VEN01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com via createAuthTest fixture; ผู้ใช้มีสิทธิ์เข้าถึง vendor-management" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor" },
        { type: "expected", description: "URL ตรงกับ /vendor-management/vendor และปุ่ม Add visible ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(page).toHaveURL(/vendor-management\/vendor/);
    await expect(vendor.list.addButton()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-VEN02 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.addButton()).toBeVisible();
  });

  test(
    "TC-VEN03 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor\n2. พิมพ์ 'test' ในช่องค้นหา" },
        { type: "expected", description: "ช่องค้นหา visible และรับค่า input ได้โดยไม่ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.searchInput()).toBeVisible();
    await vendor.list.search("test");
  });

  test(
    "TC-VEN04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await vendor.list.search(`__NOPE__${UID}`);
    await expect(vendor.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-VEN05 Filter status (active/inactive) ใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor\n2. คลิก trigger filter status (combobox/button)\n3. เลือก option Active (ถ้ามี) หรือกด Escape ปิดเมนู" },
        { type: "expected", description: "พบ filter trigger และ option (active/inactive/all); หลังเลือกแล้วปุ่ม Add ยังคง visible" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();

    // Locate a status filter control — combobox first, button fallback
    const statusTrigger = page
      .getByRole("combobox")
      .filter({ hasText: /status|all|active/i })
      .first();
    const fallbackBtn = page.getByRole("button", { name: /status|filter/i }).first();
    const trigger = (await statusTrigger.count()) > 0 ? statusTrigger : fallbackBtn;

    // Must find at least one status filter control on the page
    await expect(trigger).toBeVisible({ timeout: 5_000 });

    await trigger.click();
    // After clicking, at least one option should be reachable — otherwise the
    // filter isn't wired up. Accept Active / Inactive / All.
    const options = page.getByRole("option", { name: /^(active|inactive|all)$/i });
    await expect(options.first()).toBeVisible({ timeout: 5_000 });

    const activeOption = options.filter({ hasText: /^active$/i }).first();
    if ((await activeOption.count()) > 0) {
      await activeOption.click();
      await page.waitForLoadState("networkidle");
    } else {
      // Close the menu by pressing Escape so subsequent assertions aren't covered
      await page.keyboard.press("Escape");
    }

    await expect(vendor.list.addButton()).toBeVisible();
  });
});

test.describe("Vendor — Create happy path", () => {
  test(
    "TC-VEN06 เปิดหน้า new form สำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; ผู้ใช้มีสิทธิ์สร้าง vendor" },
        { type: "steps", description: "1. ไปที่ /vendor-management/vendor/new" },
        { type: "expected", description: "URL ตรงกับ /vendor-management/vendor/new; code input, name input และปุ่ม Save visible" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await expect(page).toHaveURL(/vendor-management\/vendor\/new/);
    await expect(vendor.codeInput()).toBeVisible({ timeout: 10_000 });
    await expect(vendor.nameInput()).toBeVisible();
    await expect(vendor.saveButton()).toBeVisible();
  });

  test(
    "TC-VEN07 เลือก business type จาก dropdown ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new; backend ต้องมีข้อมูล business types อย่างน้อย 1 รายการ (ถ้าไม่มีจะ skip)" },
        { type: "steps", description: "1. เปิด new form\n2. เปิด business type dropdown\n3. เลือก option แรก" },
        { type: "expected", description: "Trigger ของ business type แสดง label ของรายการที่เลือกภายใน 5s" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const count = await vendor.businessTypeOptionCount();
    if (count === 0) {
      test.skip(true, "No business types seeded in backend — skipping TC-VEN07.");
      return;
    }
    const label = await vendor.pickBusinessType();
    expect(label.length).toBeGreaterThan(0);
    // Verify the selected badge appears on the trigger
    await expect(vendor.businessTypeTrigger()).toContainText(label, { timeout: 5_000 });
  });

  test(
    "TC-VEN08 สร้าง vendor ขั้นต่ำ (code + name + business type) สำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; vendor CODE/NAME ยังไม่มีใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name ใน tab General\n3. เลือก business type (ถ้ามี option)\n4. กด Save\n5. กลับ list และค้นหาด้วย NAME" },
        { type: "expected", description: "Save toast/feedback ปรากฏ และ vendor ใหม่ค้นเจอใน list ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({
    page,
  }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: CODE, name: NAME });
    const btCount = await vendor.businessTypeOptionCount();
    if (btCount > 0) {
      await vendor.pickBusinessType();
    }
    await vendor.saveButton().click();
    await vendor.expectSaved();

    // Verify it appears in the list
    await vendor.list.goto();
    await vendor.list.search(NAME);
    await expect(page.getByText(NAME).first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-VEN09 สร้าง vendor พร้อม address 1 รายการ",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; vendor CODE+'A' ยังไม่มีใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name\n3. เลือก business type (ถ้ามี)\n4. เพิ่ม address row 1 รายการ (mailing/international, line1, city, country)\n5. กด Save\n6. cleanup ลบ vendor (best-effort)" },
        { type: "expected", description: "Save toast/feedback ปรากฏ บ่งชี้ว่า vendor พร้อม address ถูกบันทึกสำเร็จ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const code = `${CODE}A`.slice(0, 10);
    const name = `${NAME} addr`;
    await vendor.fillGeneral({ code, name });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addAddressRow();
    await vendor.fillAddress(0, {
      address_type: "mailing_address",
      mode: "international",
      address_line1: "123 Test Ave",
      city: "Testville",
      country: "USA",
    });
    await vendor.saveButton().click();
    await vendor.expectSaved();

    // Cleanup: delete this transient vendor so it doesn't pollute later tests.
    // Best-effort — if the row-actions dropdown or confirm dialog isn't matched,
    // swallow the error so the test still passes on the save assertion above.
    try {
      await vendor.gotoList();
      await vendor.list.search(name);
      const row = page.getByRole("row").filter({ hasText: name }).first();
      await row.getByRole("button", { name: /row actions|actions|more/i }).first().click({ timeout: 5_000 });
      await page.getByRole("menuitem", { name: /delete|trash|ลบ/i }).first().click({ timeout: 5_000 });
      await page.getByRole("alertdialog").getByRole("button", { name: /confirm|delete|ลบ|ok/i }).first().click({ timeout: 5_000 });
    } catch {
      // Cleanup is best-effort; vendor may remain but test save succeeded.
    }
  });

  test(
    "TC-VEN10 สร้าง vendor พร้อม contact 1 รายการ (primary)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; vendor CODE+'C' ยังไม่มีใน DB" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name\n3. เลือก business type (ถ้ามี)\n4. เพิ่ม contact row 1 รายการ (name/email/phone/is_primary=true)\n5. กด Save\n6. กลับ list ค้นหาด้วย name" },
        { type: "expected", description: "Save toast/feedback ปรากฏ และ vendor ที่มี contact ค้นเจอใน list ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const code = `${CODE.slice(0, 9)}C`;
    const name = `${NAME} ctc`;
    await vendor.fillGeneral({ code, name });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addContactRow();
    await vendor.fillContact(0, {
      name: "Primary Person",
      email: "primary@example.com",
      phone: "0123456789",
      is_primary: true,
    });
    await vendor.saveButton().click();
    await vendor.expectSaved();
    await vendor.gotoList();
    await vendor.list.search(name);
    await expect(page.getByText(name).first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Vendor — Tabs & dynamic arrays", () => {
  test(
    "TC-VEN11 สลับ tab ทั้ง 4 tabs ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form\n2. คลิกแต่ละ tab: general, info, address, contact" },
        { type: "expected", description: "ทุก tab trigger แสดง data-state='active' หลังคลิก (Radix tab pattern)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    for (const tab of ["general", "info", "address", "contact"] as const) {
      await vendor.switchTab(tab);
      await expect(vendor.tabTrigger(tab)).toHaveAttribute("data-state", "active");
    }
  });

  test(
    "TC-VEN12 เพิ่ม address row ได้หลาย row",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab address" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab address\n3. กดปุ่มเพิ่ม address 2 ครั้ง" },
        { type: "expected", description: "เริ่มจาก 0 row → เพิ่มได้เป็น 1 และ 2 row ตามลำดับ" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    expect(await vendor.addressCount()).toBe(0);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(1);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
  });

  test(
    "TC-VEN13 ลบ address row ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab address" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab address\n3. เพิ่ม 2 row\n4. ลบ row index 0" },
        { type: "expected", description: "หลังลบ จำนวน address row เหลือ 1" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    await vendor.addAddressRow();
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
    await vendor.removeAddressRow(0);
    expect(await vendor.addressCount()).toBe(1);
  });

  test(
    "TC-VEN14 เพิ่ม contact row ได้หลาย row",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab contact" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab contact\n3. กดปุ่มเพิ่ม contact 2 ครั้ง" },
        { type: "expected", description: "เริ่มจาก 0 row → เพิ่มได้เป็น 2 row" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    expect(await vendor.contactCount()).toBe(0);
    await vendor.addContactRow();
    await vendor.addContactRow();
    expect(await vendor.contactCount()).toBe(2);
  });

  test(
    "TC-VEN15 ลบ contact row ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab contact" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab contact\n3. เพิ่ม 2 row และกรอกชื่อ\n4. ลบ row index 0" },
        { type: "expected", description: "หลังลบ จำนวน contact row เหลือ 1" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    await vendor.addContactRow();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "Will Remove" });
    expect(await vendor.contactCount()).toBe(2);
    await vendor.removeContactRow(0);
    expect(await vendor.contactCount()).toBe(1);
  });

  test(
    "TC-VEN16 เปลี่ยน primary contact ได้ (radio exclusive)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab contact" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab contact\n3. เพิ่ม 2 row และกรอกชื่อ A, B\n4. setPrimary index 0\n5. setPrimary index 1" },
        { type: "expected", description: "เมื่อเปลี่ยน primary เป็น index 1 แล้ว index 0 ต้อง not checked (radio-exclusive behavior)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    await vendor.addContactRow();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "A" });
    await vendor.fillContact(1, { name: "B" });
    await vendor.setPrimaryContact(0);
    await expect(vendor.contactRow(0).getByRole("checkbox")).toBeChecked();
    await vendor.setPrimaryContact(1);
    await expect(vendor.contactRow(1).getByRole("checkbox")).toBeChecked();
    await expect(vendor.contactRow(0).getByRole("checkbox")).not.toBeChecked();
  });

  test(
    "TC-VEN17 เพิ่ม info row (label/value) ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab info" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab info\n3. เพิ่ม info row 1 รายการ และกรอก label='Tax ID' / value='1234567890' / dataType='string'" },
        { type: "expected", description: "เริ่มจาก 0 row → หลังเพิ่มแล้วมี 1 row" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("info");
    expect(await vendor.infoCount()).toBe(0);
    await vendor.addInfoRow();
    await vendor.fillInfo(0, { label: "Tax ID", value: "1234567890", dataType: "string" });
    expect(await vendor.infoCount()).toBe(1);
  });

  test(
    "TC-VEN18 ลบ info row ได้",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new ที่ tab info" },
        { type: "steps", description: "1. เปิด new form\n2. สลับไป tab info\n3. เพิ่ม 2 row\n4. ลบ row index 0" },
        { type: "expected", description: "หลังลบ จำนวน info row เหลือ 1" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("info");
    await vendor.addInfoRow();
    await vendor.addInfoRow();
    expect(await vendor.infoCount()).toBe(2);
    await vendor.removeInfoRow(0);
    expect(await vendor.infoCount()).toBe(1);
  });
});

test.describe("Vendor — Validation", () => {
  test(
    "TC-VEN19 บันทึกโดยไม่กรอก code ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form ที่ tab general\n2. กรอกเฉพาะ name (เว้น code)\n3. กด Save" },
        { type: "expected", description: "Error indicator ปรากฏและ URL ยังคงอยู่ที่ /new (form block submit)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    await vendor.nameInput().fill(`${NAME} v19`);
    await vendor.saveButton().click();
    await expect(vendor.anyError().first()).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/new$/);
  });

  test(
    "TC-VEN20 บันทึกโดยไม่กรอก name ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form ที่ tab general\n2. กรอกเฉพาะ code (เว้น name)\n3. กด Save" },
        { type: "expected", description: "Error indicator ปรากฏและ URL ยังคงอยู่ที่ /new (form block submit)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    await vendor.codeInput().fill(`V${UID.slice(0, 4)}`);
    await vendor.saveButton().click();
    await expect(vendor.anyError().first()).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/new$/);
  });

  test(
    "TC-VEN21 code เกิน 10 ตัวอักษรต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form ที่ tab general\n2. พยายาม fill code 'X' ยาว 20 ตัวอักษร" },
        { type: "expected", description: "ค่าใน code input ต้องไม่เกิน 10 ตัวอักษร (input maxLength enforcement)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    const long = "X".repeat(20);
    await vendor.codeInput().fill(long);
    const value = await vendor.codeInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(10);
  });

  test(
    "TC-VEN22 name เกิน 100 ตัวอักษรต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form ที่ tab general\n2. พยายาม fill name 'N' ยาว 150 ตัวอักษร" },
        { type: "expected", description: "ค่าใน name input ต้องไม่เกิน 100 ตัวอักษร (input maxLength enforcement)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    const long = "N".repeat(150);
    await vendor.nameInput().fill(long);
    const value = await vendor.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
  });

  test(
    "TC-VEN23 address ที่ไม่มีทั้ง city และ district ต้อง fail (refinement)",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name + business type\n3. เพิ่ม address row ที่มี address_line1 อย่างเดียว (ไม่มี city/district)\n4. กด Save" },
        { type: "expected", description: "Error indicator ปรากฏและ URL ยังคงอยู่ที่ /new (zod refinement บังคับต้องมี city หรือ district)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({
    page,
  }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: `${CODE.slice(0, 9)}R`, name: `${NAME} v23` });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addAddressRow();
    await vendor.fillAddress(0, {
      address_type: "contact_address",
      mode: "international",
      address_line1: "Line 1 only",
    });
    await vendor.saveButton().click();
    await expect(vendor.anyError().first()).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/new$/);
  });

  test(
    "TC-VEN24 contact email รูปแบบผิดต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as purchase@blueledgers.com; on /vendor-management/vendor/new" },
        { type: "steps", description: "1. เปิด new form\n2. กรอก code + name + business type\n3. เพิ่ม contact row และกรอก email = 'not-an-email'\n4. กด Save" },
        { type: "expected", description: "URL ยังคงอยู่ที่ /new (HTML5 native email validation block submit)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: `${CODE.slice(0, 9)}E`, name: `${NAME} v24` });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "Bad Email", email: "not-an-email" });
    await vendor.saveButton().click();
    // Note: contact email uses input[type="email"] → HTML5 native validation blocks
    // submit before React Hook Form's zod runs, so no aria-invalid / text-destructive
    // is painted. The best DOM signal remaining is that the form didn't navigate.
    await expect(page).toHaveURL(/\/new$/);
  });
});

test.describe("Vendor — Edit, delete, cleanup", () => {
  test(
    "TC-VEN25 แก้ name ของ vendor ที่สร้างแล้ว save สำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "TC-VEN08 ผ่านแล้ว → vendor ที่ NAME มีอยู่ใน DB; logged in as purchase@blueledgers.com" },
        { type: "steps", description: "1. ไปที่ list และเปิด detail ของ vendor ตาม NAME\n2. กด Edit\n3. สลับไป tab general\n4. แก้ name เป็น NAME_UPDATED\n5. กด Save\n6. กลับ list ค้นหาด้วย NAME_UPDATED" },
        { type: "expected", description: "Save toast/feedback ปรากฏ และ NAME_UPDATED ค้นเจอใน list ภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.openDetailByName(NAME);
    await vendor.editButton().click();
    await vendor.switchTab("general");
    await vendor.nameInput().fill(NAME_UPDATED);
    await vendor.saveButton().click();
    await vendor.expectSaved();

    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    await expect(page.getByText(NAME_UPDATED).first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-VEN26 เปิด delete dialog ของ vendor แล้ว cancel — row ยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "TC-VEN25 ผ่านแล้ว → vendor ที่ NAME_UPDATED มีอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ list และค้นหาด้วย NAME_UPDATED\n2. เปิด row actions ของ row นั้น\n3. คลิก menuitem Delete\n4. ใน alertdialog กด Cancel" },
        { type: "expected", description: "Alertdialog ปิดและแถวของ NAME_UPDATED ยังคง visible (ไม่ถูกลบ)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    const row = page.getByRole("row").filter({ hasText: NAME_UPDATED }).first();

    // Open row actions (dropdown)
    const actionsBtn = row.getByRole("button", { name: /row actions|actions|more/i }).first();
    await actionsBtn.click();
    await page.getByRole("menuitem", { name: /delete|ลบ/i }).first().click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole("button", { name: /cancel|ยกเลิก/i }).click();
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });

    // Row should still be there
    await expect(page.getByText(NAME_UPDATED).first()).toBeVisible();
  });

  test(
    "TC-VEN27 ลบ vendor ที่สร้างในชุด test สำเร็จ (cleanup หลัก)",
    {
      annotation: [
        { type: "preconditions", description: "TC-VEN26 ผ่านแล้ว → vendor ที่ NAME_UPDATED ยังคงอยู่ใน DB" },
        { type: "steps", description: "1. ไปที่ list และค้นหาด้วย NAME_UPDATED\n2. เปิด row actions\n3. คลิก menuitem Delete\n4. ใน alertdialog กดยืนยัน Delete/Confirm" },
        { type: "expected", description: "Success toast ('success/deleted/สำเร็จ') ปรากฏภายใน 10s" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    const row = page.getByRole("row").filter({ hasText: NAME_UPDATED }).first();

    const actionsBtn = row.getByRole("button", { name: /row actions|actions|more/i }).first();
    await actionsBtn.click();
    await page.getByRole("menuitem", { name: /delete|ลบ/i }).first().click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole("button", { name: /^(delete|confirm|ลบ|ok)$/i }).click();

    // Success toast
    await expect(
      page.locator('[data-sonner-toast], [role="status"]')
        .filter({ hasText: /success|deleted|ลบ.*สำเร็จ|สำเร็จ/i })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-VEN28 หลังลบแล้วค้นหาไม่พบ row นั้นอีก",
    {
      annotation: [
        { type: "preconditions", description: "TC-VEN27 ผ่านแล้ว → vendor ที่ NAME_UPDATED ถูกลบจาก DB แล้ว" },
        { type: "steps", description: "1. ไปที่ list\n2. ค้นหาด้วย NAME_UPDATED" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ยืนยันว่าลบได้สำเร็จจริง)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    await expect(vendor.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });
});

// Mop-up: best-effort cleanup of any vendors this run created via UID prefix.
// Uses the same row-actions dropdown pattern as TC-VEN27. Silent on failure —
// the suite's actual assertions already ran; this is hygiene, not a check.
test.afterAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    // Authenticate
    const { LoginPage } = await import("./pages/login.page");
    const { getPasswordFor } = await import("./test-users");
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry(
      "purchase@blueledgers.com",
      getPasswordFor("purchase@blueledgers.com"),
    );

    const vendor = new VendorPage(page);
    for (const suffix of ["addr", "ctc"]) {
      const name = `${NAME} ${suffix}`;
      try {
        await vendor.gotoList();
        await vendor.list.search(name);
        const row = page.getByRole("row").filter({ hasText: name }).first();
        if ((await row.count()) === 0) continue;

        const actionsBtn = row
          .getByRole("button", { name: /row actions|actions|more/i })
          .first();
        await actionsBtn.click({ timeout: 3_000 });
        await page.getByRole("menuitem", { name: /delete|ลบ/i }).first().click({ timeout: 3_000 });
        await page
          .getByRole("alertdialog")
          .getByRole("button", { name: /^(delete|confirm|ลบ|ok)$/i })
          .click({ timeout: 3_000 });
        await page.waitForLoadState("networkidle").catch(() => null);
      } catch {
        // Ignore — best-effort only
      }
    }
  } finally {
    await context.close();
  }
});
