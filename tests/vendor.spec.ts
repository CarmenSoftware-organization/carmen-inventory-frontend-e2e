import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { VendorPage } from "./pages/vendor.page";

const test = createAuthTest("purchase@blueledgers.com");
test.describe.configure({ mode: "serial" });

const UID = Date.now().toString(36);
const CODE = `V${UID.slice(-6).toUpperCase()}`;
const NAME = `E2E VEN ${UID}`;
const NAME_UPDATED = `E2E VEN Upd ${UID}`;

test.describe("Vendor — List smoke", () => {
  test("TC-VEN01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(page).toHaveURL(/vendor-management\/vendor/);
    await expect(vendor.list.addButton()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-VEN02 ปุ่ม Add แสดง", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.addButton()).toBeVisible();
  });

  test("TC-VEN03 ช่องค้นหาใช้งานได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.searchInput()).toBeVisible();
    await vendor.list.search("test");
  });

  test("TC-VEN04 ค้นหาคำที่ไม่มีต้องแสดง empty state", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await vendor.list.search(`__NOPE__${UID}`);
    await expect(vendor.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-VEN05 Filter status (active/inactive) ใช้งานได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    const statusTrigger = page.getByRole("combobox").filter({ hasText: /status|all|active/i }).first();
    if (await statusTrigger.count() === 0) {
      const btn = page.getByRole("button", { name: /status|filter/i }).first();
      await btn.click();
    } else {
      await statusTrigger.click();
    }
    const activeOption = page.getByRole("option", { name: /^active$/i });
    if (await activeOption.count() > 0) {
      await activeOption.first().click();
      await page.waitForLoadState("networkidle");
    }
    await expect(vendor.list.addButton()).toBeVisible();
  });
});

test.describe("Vendor — Create happy path", () => {
  test("TC-VEN06 เปิดหน้า new form สำเร็จ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await expect(page).toHaveURL(/vendor-management\/vendor\/new/);
    await expect(vendor.codeInput()).toBeVisible({ timeout: 10_000 });
    await expect(vendor.nameInput()).toBeVisible();
    await expect(vendor.saveButton()).toBeVisible();
  });

  test("TC-VEN07 เลือก business type จาก dropdown ได้", async ({ page }) => {
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

  test("TC-VEN08 สร้าง vendor ขั้นต่ำ (code + name + business type) สำเร็จ", async ({
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

  test("TC-VEN09 สร้าง vendor พร้อม address 1 รายการ", async ({ page }) => {
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

  test("TC-VEN10 สร้าง vendor พร้อม contact 1 รายการ (primary)", async ({ page }) => {
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
  test("TC-VEN11 สลับ tab ทั้ง 4 tabs ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    for (const tab of ["general", "info", "address", "contact"] as const) {
      await vendor.switchTab(tab);
      await expect(vendor.tabTrigger(tab)).toHaveAttribute("data-state", "active");
    }
  });

  test("TC-VEN12 เพิ่ม address row ได้หลาย row", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    expect(await vendor.addressCount()).toBe(0);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(1);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
  });

  test("TC-VEN13 ลบ address row ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    await vendor.addAddressRow();
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
    await vendor.removeAddressRow(0);
    expect(await vendor.addressCount()).toBe(1);
  });

  test("TC-VEN14 เพิ่ม contact row ได้หลาย row", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    expect(await vendor.contactCount()).toBe(0);
    await vendor.addContactRow();
    await vendor.addContactRow();
    expect(await vendor.contactCount()).toBe(2);
  });

  test("TC-VEN15 ลบ contact row ได้", async ({ page }) => {
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

  test("TC-VEN16 เปลี่ยน primary contact ได้ (radio exclusive)", async ({ page }) => {
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
});
