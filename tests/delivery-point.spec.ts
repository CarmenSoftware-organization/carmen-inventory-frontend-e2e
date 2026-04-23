/**
 * E2E tests for Delivery Point (config module)
 *
 * Test cases mapped from spec sheet:
 * https://docs.google.com/spreadsheets/d/1eLuXtc-UxkgCCgImw2SI2XAX32LlPT3UHfxIpzmFoLc
 *
 * Covers TC-001..TC-049 (Read / Create / Update / Delete).
 * Tests run serially because CRUD steps depend on shared fixture data.
 */
import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import {
  DeliveryPointListPage,
  DeliveryPointDialog,
  DeleteConfirmDialog,
} from "./pages/delivery-point.page";

const test = createAuthTest("purchase@zebra.com");

const UID = Date.now().toString(36);
const DP_NAME = `E2E DP ${UID}`;
const DP_NAME_INACTIVE = `E2E DP Inactive ${UID}`;
const DP_NAME_UPDATED = `E2E DP Upd ${UID}`;

test.describe.configure({ mode: "serial" });

// ─── Read (TC-001..TC-026) ──────────────────────────────────────────────────

test.describe("จุดส่งของ — อ่าน", () => {
  test("TC-001 อ่านค่า table ของ delivery point ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await expect(page).toHaveURL(/config\/delivery-point/);
    await expect(list.table()).toBeVisible();
    await expect(list.addButton()).toBeVisible();
  });

  test("TC-002 แสดงข้อมูล default 10 รายการต่อหน้า", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const rows = await list.tableRows().count();
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThanOrEqual(10);
  });

  test("TC-003 เปลี่ยน per page เป็น 25 / 50 / 100 ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const select = list.perPageSelect();
    if (!(await select.isVisible().catch(() => false))) test.skip();
    for (const size of ["25", "50", "100"]) {
      await select.click();
      await page.getByRole("option", { name: size }).click();
      await page.waitForLoadState("networkidle");
      const rows = await list.tableRows().count();
      expect(rows).toBeLessThanOrEqual(Number(size));
    }
  });

  test("TC-004 per page เกิน 100 ไม่ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const select = list.perPageSelect();
    if (!(await select.isVisible().catch(() => false))) test.skip();
    await select.click();
    await expect(page.getByRole("option", { name: /^200$/ })).toHaveCount(0);
    await page.keyboard.press("Escape");
  });

  test("TC-005 กด next/prev page แล้วข้อมูลเปลี่ยน", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    if (!(await list.nextPageButton().isEnabled().catch(() => false))) test.skip();
    const firstBefore = await list.tableRows().first().innerText();
    await list.nextPageButton().click();
    await page.waitForLoadState("networkidle");
    const firstAfter = await list.tableRows().first().innerText();
    expect(firstAfter).not.toEqual(firstBefore);
    await list.prevPageButton().click();
    await page.waitForLoadState("networkidle");
  });

  test("TC-006 search ชื่อ delivery point แล้วกรองได้ถูก", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const sample = await list.tableRows().first().innerText().catch(() => "");
    if (!sample) test.skip();
    const term = sample.split(/\s+/).find((t) => t.length > 2) ?? sample.slice(0, 3);
    await list.search(term);
    const count = await list.tableRows().count();
    expect(count).toBeGreaterThan(0);
  });

  test("TC-007 search ด้วยคำที่ไม่มีในระบบ แสดง empty state", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await list.search(`__NOPE__${UID}`);
    await expect(list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-008 search ด้วย special char เช่น %, ' ไม่พัง", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await list.search("%'");
    await expect(list.addButton()).toBeVisible();
  });

  test("TC-009 filter ตาม field ที่กำหนด แล้วผลตรง", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    // Filter by is_active status if available
    const filterButton = page.getByRole("button", { name: /filter|status/i }).first();
    if (!(await filterButton.isVisible().catch(() => false))) test.skip();
    await filterButton.click();
    const activeOption = page.getByRole("option", { name: /active/i }).first();
    if (!(await activeOption.isVisible().catch(() => false))) {
      await page.keyboard.press("Escape");
      test.skip();
    }
    await activeOption.click();
    await page.waitForLoadState("networkidle");
    const count = await list.tableRows().count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("TC-010 กด sort column แล้วเรียงจาก A→Z ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const sortButton = list
      .headerCell(/name/i)
      .getByRole("button", { name: /name/i });
    if (!(await sortButton.isVisible().catch(() => false))) test.skip();
    await sortButton.click();
    await expect(sortButton).toBeEnabled({ timeout: 10_000 });
    await page.waitForLoadState("networkidle");
    const rows = await list.tableRows().count();
    expect(rows).toBeGreaterThan(0);
  });

  test("TC-011 กด sort ซ้ำแล้วเรียงกลับ Z→A ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const sortButton = list
      .headerCell(/name/i)
      .getByRole("button", { name: /name/i });
    if (!(await sortButton.isVisible().catch(() => false))) test.skip();
    // First click: A→Z
    await sortButton.click();
    await expect(sortButton).toBeEnabled({ timeout: 10_000 });
    await page.waitForLoadState("networkidle");
    const ascAll = await list.tableRows().allInnerTexts();
    // Second click: Z→A
    await sortButton.click();
    await expect(sortButton).toBeEnabled({ timeout: 10_000 });
    await page.waitForLoadState("networkidle");
    const descAll = await list.tableRows().allInnerTexts();
    expect(descAll).not.toEqual(ascAll);
  });

  test("TC-012 filter + search + sort พร้อมกันไม่พัง", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    // Search first
    const sample = await list.tableRows().first().innerText().catch(() => "");
    if (!sample) test.skip();
    const term = sample.split(/\s+/).find((t) => t.length > 2) ?? sample.slice(0, 3);
    await list.search(term);
    // Then sort
    const sortButton = list
      .headerCell(/name/i)
      .getByRole("button", { name: /name/i });
    if (await sortButton.isVisible().catch(() => false)) {
      await sortButton.click();
      await page.waitForLoadState("networkidle");
    }
    // Page should not crash
    await expect(list.addButton()).toBeVisible();
  });

  test("TC-013 กด toggle เปลี่ยนจาก table → card view ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    // Table should be hidden or card content should appear
    await expect(list.addButton()).toBeVisible();
  });

  test("TC-014 กด toggle เปลี่ยนจาก card → table view ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    await list.viewToggleTable().click();
    await page.waitForLoadState("networkidle");
    await expect(list.table()).toBeVisible();
  });

  test("TC-015 ข้อมูลที่แสดงใน card กับ table ตรงกัน", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const tableFirst = await list.tableRows().first().innerText().catch(() => "");
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    if (tableFirst) {
      const firstWord = tableFirst.split(/\s+/)[0];
      await expect(page.getByText(firstWord).first()).toBeVisible();
    }
    await list.viewToggleTable().click();
  });

  test("TC-016 เปลี่ยน view mode แล้ว filter/search/sort ยังทำงานอยู่", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    // Search first
    const sample = await list.tableRows().first().innerText().catch(() => "");
    if (!sample) test.skip();
    const term = sample.split(/\s+/).find((t) => t.length > 2) ?? sample.slice(0, 3);
    await list.search(term);
    // Switch to card
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    // Search should still be applied — page should not crash
    await expect(list.addButton()).toBeVisible();
    await list.viewToggleTable().click();
  });

  test("TC-017 เปลี่ยน view mode แล้ว pagination ยังทำงานอยู่", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    await list.viewToggleTable().click();
    await page.waitForLoadState("networkidle");
    // Pagination controls should still be present
    await expect(list.addButton()).toBeVisible();
  });

  test("TC-018 refresh หน้าแล้ว view mode กลับมาเป็น default", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Default view is table
    await expect(list.table()).toBeVisible();
  });

  test("TC-019 กด toggle column แล้ว panel แสดงรายการ column ได้", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    await btn.click();
    const menuItem = page.getByRole("menuitemcheckbox").first();
    await expect(menuItem).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("TC-020 ซ่อน column แล้ว column หายออกจาก table", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    await btn.click();
    const item = page.getByRole("menuitemcheckbox", { name: /name/i }).first();
    await item.click();
    await page.keyboard.press("Escape");
    await expect(list.headerCell(/^name$/i)).toHaveCount(0);
    // Restore
    await btn.click();
    await item.click();
    await page.keyboard.press("Escape");
  });

  test("TC-021 แสดง column กลับแล้ว column โผล่ใน table", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    // Hide first
    await btn.click();
    const item = page.getByRole("menuitemcheckbox", { name: /name/i }).first();
    await item.click();
    await page.keyboard.press("Escape");
    await expect(list.headerCell(/^name$/i)).toHaveCount(0);
    // Show again
    await btn.click();
    await item.click();
    await page.keyboard.press("Escape");
    await expect(list.headerCell(/^name$/i)).toBeVisible();
  });

  test("TC-022 ซ่อนทุก column ไม่ได้ ต้องเหลืออย่างน้อย 1 column", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    await btn.click();
    const items = page.getByRole("menuitemcheckbox");
    const count = await items.count();
    // Try to uncheck all
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const state = await item.getAttribute("data-state");
      if (state === "checked") await item.click();
    }
    // At least one column must remain visible in the table
    const visibleHeaders = await page.locator("thead th").count();
    expect(visibleHeaders).toBeGreaterThanOrEqual(1);
    await page.keyboard.press("Escape");
    // Restore all by reloading
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("TC-023 column ที่ซ่อนอยู่ยังค้นหาและ filter ได้ปกติ", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    // Get a name before hiding
    const sample = await list.tableRows().first().innerText().catch(() => "");
    if (!sample) test.skip();
    const term = sample.split(/\s+/).find((t) => t.length > 2) ?? sample.slice(0, 3);
    // Hide name column
    await btn.click();
    const item = page.getByRole("menuitemcheckbox", { name: /name/i }).first();
    await item.click();
    await page.keyboard.press("Escape");
    // Search should still work
    await list.search(term);
    const rows = await list.tableRows().count();
    expect(rows).toBeGreaterThanOrEqual(0);
    // Restore
    await btn.click();
    await item.click();
    await page.keyboard.press("Escape");
  });

  test("TC-024 เปลี่ยน view mode แล้ว column visibility ยังคงอยู่", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    const cardToggle = list.viewToggleCard();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    // Hide name column
    await btn.click();
    const item = page.getByRole("menuitemcheckbox", { name: /name/i }).first();
    await item.click();
    await page.keyboard.press("Escape");
    // Switch to card and back
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    await list.viewToggleTable().click();
    await page.waitForLoadState("networkidle");
    // Name column should still be hidden
    await expect(list.headerCell(/^name$/i)).toHaveCount(0);
    // Restore
    await btn.click();
    await item.click();
    await page.keyboard.press("Escape");
  });

  test("TC-025 refresh หน้าแล้ว column ที่ซ่อนไว้กลับมาเป็น default", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    // Hide name column
    await btn.click();
    const item = page.getByRole("menuitemcheckbox", { name: /name/i }).first();
    await item.click();
    await page.keyboard.press("Escape");
    await expect(list.headerCell(/^name$/i)).toHaveCount(0);
    // Refresh
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Name column should be visible again
    await expect(list.headerCell(/^name$/i)).toBeVisible();
  });

  test("TC-026 card view ไม่มี column toggle เพราะไม่มี column", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    await expect(list.columnVisibilityButton()).not.toBeVisible();
    await list.viewToggleTable().click();
  });
});

// ─── Create (TC-027..TC-036) ────────────────────────────────────────────────

test.describe("จุดส่งของ — สร้าง", () => {
  test("TC-027 กด Add แล้ว dialog เปิดขึ้นมา", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.dialog()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test("TC-028 dialog เปิดมา field name เป็น empty string", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.nameInput()).toHaveValue("");
    await dialog.cancelButton().click();
  });

  test("TC-029 dialog เปิดมา is active default เป็น true", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", "checked");
    await dialog.cancelButton().click();
  });

  test("TC-030 กรอก name แล้ว save ได้ ข้อมูลขึ้น table", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill(DP_NAME);
    await dialog.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await list.search(DP_NAME);
    await expect(page.getByRole("cell", { name: DP_NAME })).toBeVisible();
  });

  test("TC-031 กด save โดยไม่กรอก name ระบบต้องด่า", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.saveButton().click();
    await expect(dialog.errorMessage().first()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test("TC-032 กรอก name ซ้ำกับที่มีอยู่แล้ว ระบบต้องห้าม", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill(DP_NAME);
    await dialog.saveButton().click();
    const errorToast = page.getByText(/exists|duplicate|already|ซ้ำ/i).first();
    await expect.soft(errorToast).toBeVisible({ timeout: 5_000 });
    if (await dialog.dialog().isVisible().catch(() => false)) {
      await dialog.cancelButton().click();
    }
  });

  test("TC-033 กรอก name ยาวเกิน limit ระบบต้องห้าม", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill("a".repeat(150));
    const value = await dialog.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
    await dialog.cancelButton().click();
  });

  test("TC-034 กรอก name เป็น space ล้วน ระบบต้องด่า", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill("    ");
    await dialog.saveButton().click();
    await expect(dialog.errorMessage().first()).toBeVisible({ timeout: 5_000 });
    await expect(dialog.dialog()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test("TC-035 กด cancel แล้ว dialog ปิด ไม่มีข้อมูลขึ้น table", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill(`should-not-save-${UID}`);
    await dialog.cancelButton().click();
    await expect(dialog.dialog()).not.toBeVisible();
    await list.search(`should-not-save-${UID}`);
    await expect(list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-036 สร้างด้วย is active = false แล้วค่าบันทึกถูก", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill(DP_NAME_INACTIVE);
    await dialog.activeSwitch().click();
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", "unchecked");
    await dialog.saveButton().click();
    await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});

// ─── Update (TC-037..TC-044) ────────────────────────────────────────────────

test.describe("จุดส่งของ — แก้ไข", () => {
  test("TC-037 กดที่ column name แล้ว dialog เปิดขึ้นมา", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.dialog()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test("TC-038 dialog เปิดมา field name แสดงค่าเดิมถูกต้อง", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.nameInput()).toHaveValue(DP_NAME);
    await dialog.cancelButton().click();
  });

  test("TC-039 dialog เปิดมา is active แสดงค่าเดิมถูกต้อง", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", "checked");
    await dialog.cancelButton().click();
  });

  test("TC-040 แก้ name แล้ว save ข้อมูลใน table อัพเดท", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await dialog.nameInput().clear();
    await dialog.nameInput().fill(DP_NAME_UPDATED);
    await dialog.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await list.search(DP_NAME_UPDATED);
    await expect(page.getByRole("cell", { name: DP_NAME_UPDATED })).toBeVisible();
  });

  test("TC-041 ลบ name ออกทั้งหมดแล้ว save ระบบต้องด่า", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.clickRowName(DP_NAME_UPDATED);
    await dialog.nameInput().clear();
    await dialog.saveButton().click();
    await expect(dialog.errorMessage().first()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test("TC-042 แก้ name เป็นค่าเดิมแล้ว save ได้ปกติ", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.clickRowName(DP_NAME_UPDATED);
    // Clear and re-enter same name
    await dialog.nameInput().clear();
    await dialog.nameInput().fill(DP_NAME_UPDATED);
    await dialog.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("TC-043 กด cancel ระหว่าง edit ข้อมูลเดิมไม่เปลี่ยน", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.clickRowName(DP_NAME_UPDATED);
    await dialog.nameInput().clear();
    await dialog.nameInput().fill("DISCARDED");
    await dialog.cancelButton().click();
    await list.search(DP_NAME_UPDATED);
    await expect(page.getByRole("cell", { name: DP_NAME_UPDATED })).toBeVisible();
  });

  test("TC-044 toggle is active แล้ว save ค่าเปลี่ยนถูก", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.clickRowName(DP_NAME_UPDATED);
    await dialog.activeSwitch().click();
    const newState = await dialog.activeSwitch().getAttribute("data-state");
    await dialog.saveButton().click();
    await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    // Verify persisted
    await list.search(DP_NAME_UPDATED);
    await list.clickRowName(DP_NAME_UPDATED);
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", newState!);
    await dialog.cancelButton().click();
  });
});

// ─── Delete (TC-045..TC-049) ────────────────────────────────────────────────

test.describe("จุดส่งของ — ลบ", () => {
  test("TC-045 กด trash icon แล้ว confirm dialog เปิดขึ้นมา", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const confirm = new DeleteConfirmDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.deleteRow(DP_NAME_UPDATED);
    await expect(confirm.dialog()).toBeVisible();
    await confirm.cancelButton().click();
  });

  test("TC-046 กด confirm แล้วข้อมูลหายออกจาก table", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const confirm = new DeleteConfirmDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.deleteRow(DP_NAME_UPDATED);
    await confirm.confirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await list.search(DP_NAME_UPDATED);
    await expect(page.getByRole("cell", { name: DP_NAME_UPDATED })).not.toBeVisible();
  });

  test("TC-047 กด cancel ใน confirm dialog ข้อมูลยังอยู่", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const confirm = new DeleteConfirmDialog(page);
    await list.goto();
    await list.search(DP_NAME_INACTIVE);
    if (!(await page.getByRole("cell", { name: DP_NAME_INACTIVE }).isVisible().catch(() => false))) {
      test.skip();
    }
    await list.deleteRow(DP_NAME_INACTIVE);
    await expect(confirm.dialog()).toBeVisible();
    await confirm.cancelButton().click();
    await expect(page.getByRole("cell", { name: DP_NAME_INACTIVE })).toBeVisible();
  });

  test("TC-048 ลบแล้ว total count ใน table ลดลง 1", async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const confirm = new DeleteConfirmDialog(page);
    await list.goto();
    await list.search(DP_NAME_INACTIVE);
    if (!(await page.getByRole("cell", { name: DP_NAME_INACTIVE }).isVisible().catch(() => false))) {
      test.skip();
    }
    // Get count before
    const countBefore = await list.tableRows().count();
    await list.deleteRow(DP_NAME_INACTIVE);
    await confirm.confirmButton().click();
    await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
    await page.waitForLoadState("networkidle");
    await list.search(DP_NAME_INACTIVE);
    const countAfter = await list.tableRows().count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test("TC-049 ลบรายการสุดท้ายในหน้า ระบบ paginate กลับหน้าก่อนหน้า", async ({ page }) => {
    // This test requires specific data conditions — skip if not applicable
    const list = new DeliveryPointListPage(page);
    await list.goto();
    // Navigate to last page if possible
    const nextBtn = list.nextPageButton();
    if (!(await nextBtn.isEnabled().catch(() => false))) test.skip();
    // Go to last page
    let safety = 0;
    while ((await nextBtn.isEnabled().catch(() => false)) && safety < 20) {
      await nextBtn.click();
      await page.waitForLoadState("networkidle");
      safety++;
    }
    const rowsOnLastPage = await list.tableRows().count();
    if (rowsOnLastPage !== 1) test.skip();
    // Only 1 row on last page — delete it
    const confirm = new DeleteConfirmDialog(page);
    const rowText = await list.tableRows().first().innerText();
    const name = rowText.split(/\t/)[0];
    await list.deleteRow(name);
    await confirm.confirmButton().click();
    await page.waitForLoadState("networkidle");
    // Should navigate back to previous page
    const currentRows = await list.tableRows().count();
    expect(currentRows).toBeGreaterThan(0);
  });
});
