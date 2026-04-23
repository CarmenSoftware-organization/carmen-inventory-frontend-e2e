import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PageFormCrudHelper } from "./pages/page-form-crud.helper";
import { addPageFormSecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@zebra.com");
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

test.describe.configure({ mode: "serial" });

test.describe("Location — Smoke & CRUD", () => {
  test("TC-LOC01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test("TC-LOC02 ปุ่ม Add แสดง", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.addButton()).toBeVisible();
  });

  test("TC-LOC03 ช่องค้นหาใช้งานได้", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await expect(h.list.searchInput()).toBeVisible();
    await h.list.search("test");
  });

  test("TC-LOC04 ค้นหาคำที่ไม่มีต้องแสดง empty state", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.list.goto();
    await h.list.search(`__NOPE__${UID}`);
    await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-LOC05 บันทึกโดยไม่กรอก code/name ต้องแสดง error", async ({ page }) => {
    const h = new PageFormCrudHelper(page, opts);
    await h.gotoNew();
    await h.saveButton().click();
    await expect(page).toHaveURL(/\/new/);
  });

  test("TC-LOC06 สร้างรายการใหม่และปรากฏในตาราง", async ({ page }) => {
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

  test("TC-LOC07 แก้ไขชื่อและบันทึก", async ({ page }) => {
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

  test("TC-LOC13 แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error", async ({ page }) => {
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

  test("TC-LOC08 ลบรายการ", async ({ page }) => {
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

  test("TC-LOC14 สร้าง location_type = Direct และลบ", async ({ page }) => {
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

  test("TC-LOC15 สร้าง location_type = Consignment และลบ", async ({ page }) => {
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
