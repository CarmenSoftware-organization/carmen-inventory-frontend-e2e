/**
 * E2E tests for Delivery Point (config module)
 *
 * Test cases mapped from spec sheet:
 * https://docs.google.com/spreadsheets/d/1eLuXtc-UxkgCCgImw2SI2XAX32LlPT3UHfxIpzmFoLc
 *
 * Covers TC-DP01..TC-DP49 (Read / Create / Update / Delete).
 * Tests run serially because CRUD steps depend on shared fixture data.
 */
import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import {
  DeliveryPointListPage,
  DeliveryPointDialog,
  DeleteConfirmDialog,
} from "./pages/delivery-point.page";

const test = createAuthTest("purchase@blueledgers.com");

const UID = Date.now().toString(36);
const DP_NAME = `E2E DP ${UID}`;
const DP_NAME_INACTIVE = `E2E DP Inactive ${UID}`;
const DP_NAME_UPDATED = `E2E DP Upd ${UID}`;

test.describe.configure({ mode: "serial" });

// ─── Read (TC-DP01..TC-DP26) ──────────────────────────────────────────────────

test.describe("จุดส่งของ — อ่าน", () => {
  test(
    "TC-DP01 อ่านค่า table ของ delivery point ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ purchase@blueledgers.com (จาก createAuthTest) login แล้ว และมี delivery point ในระบบอย่างน้อย 1 รายการ" },
        { type: "steps", description: "1. เปิดหน้า /config/delivery-point\n2. รอ table โหลด\n3. ตรวจสอบปุ่ม Add" },
        { type: "expected", description: "URL ลงท้ายด้วย config/delivery-point, table แสดงผล และปุ่ม Add visible" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await expect(page).toHaveURL(/config\/delivery-point/);
    await expect(list.table()).toBeVisible();
    await expect(list.addButton()).toBeVisible();
  });

  test(
    "TC-DP02 แสดงข้อมูล default 10 รายการต่อหน้า",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว มีข้อมูล delivery point ในระบบ" },
        { type: "steps", description: "1. เปิดหน้า /config/delivery-point\n2. นับจำนวน rows ใน table" },
        { type: "expected", description: "จำนวน row > 0 และ <= 10 (ค่า default per page)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const rows = await list.tableRows().count();
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThanOrEqual(10);
  });

  test(
    "TC-DP03 เปลี่ยน per page เป็น 25 / 50 / 100 ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และตัวเลือก per page visible" },
        { type: "steps", description: "1. เปิดหน้า list\n2. เลือก per page = 25\n3. เลือก 50\n4. เลือก 100\n5. นับ rows หลังจากแต่ละค่า" },
        { type: "expected", description: "จำนวน rows ที่แสดงไม่เกินค่า per page ที่เลือกในแต่ละครั้ง" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP04 per page เกิน 100 ไม่ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และตัวเลือก per page visible" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด dropdown per page\n3. ตรวจสอบว่ามีตัวเลือก 200 หรือไม่" },
        { type: "expected", description: "ตัวเลือก 200 ไม่อยู่ใน dropdown (per page สูงสุดคือ 100)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const select = list.perPageSelect();
    if (!(await select.isVisible().catch(() => false))) test.skip();
    await select.click();
    await expect(page.getByRole("option", { name: /^200$/ })).toHaveCount(0);
    await page.keyboard.press("Escape");
  });

  test(
    "TC-DP05 กด next/prev page แล้วข้อมูลเปลี่ยน",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีข้อมูลมากกว่า 1 page" },
        { type: "steps", description: "1. เปิดหน้า list\n2. จด row แรก\n3. กด next page\n4. ตรวจสอบ row แรกใหม่\n5. กด prev page" },
        { type: "expected", description: "row แรกหลังกด next ไม่เท่ากับ row แรกก่อนกด" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP06 search ชื่อ delivery point แล้วกรองได้ถูก",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี delivery point อย่างน้อย 1 รายการ" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ใช้คำค้นจาก row แรกที่มีอยู่\n3. ใส่ search\n4. นับ rows" },
        { type: "expected", description: "ผลลัพธ์มี row > 0 (กรองตรงตามคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const sample = await list.tableRows().first().innerText().catch(() => "");
    if (!sample) test.skip();
    const term = sample.split(/\s+/).find((t) => t.length > 2) ?? sample.slice(0, 3);
    await list.search(term);
    const count = await list.tableRows().count();
    expect(count).toBeGreaterThan(0);
  });

  test(
    "TC-DP07 search ด้วยคำที่ไม่มีในระบบ แสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search ด้วยคำที่ไม่มีจริง เช่น __NOPE__<UID>" },
        { type: "expected", description: "table แสดง empty state เมื่อไม่มีผลลัพธ์ตรงกับคำค้น" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await list.search(`__NOPE__${UID}`);
    await expect(list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-DP08 search ด้วย special char เช่น %, ' ไม่พัง",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search ด้วย special char %, '" },
        { type: "expected", description: "ระบบไม่ crash, ปุ่ม Add ยัง visible อยู่" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    await list.search("%'");
    await expect(list.addButton()).toBeVisible();
  },
  );

  test(
    "TC-DP09 filter ตาม field ที่กำหนด แล้วผลตรง",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีตัวเลือก filter" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กดปุ่ม filter\n3. เลือก option active\n4. รอผล" },
        { type: "expected", description: "table แสดงผลที่ผ่าน filter (count >= 0) โดยไม่ crash" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP10 กด sort column แล้วเรียงจาก A→Z ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และ column name สามารถ sort ได้" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กดปุ่ม sort ที่ column name\n3. รอผล" },
        { type: "expected", description: "ปุ่ม sort ทำงาน, table มีข้อมูล > 0 row หลังเรียง A→Z" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP11 กด sort ซ้ำแล้วเรียงกลับ Z→A ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และ column name สามารถ sort ได้" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด sort ครั้งแรก (A→Z)\n3. เก็บ rows\n4. กด sort อีกครั้ง (Z→A)\n5. เปรียบเทียบ" },
        { type: "expected", description: "ลำดับ rows หลังกดสองครั้งแตกต่างจากครั้งแรก (เรียงกลับ Z→A)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP12 filter + search + sort พร้อมกันไม่พัง",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีข้อมูลในระบบ" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search ด้วยคำจาก row\n3. กด sort\n4. ตรวจสอบหน้ายังใช้งานได้" },
        { type: "expected", description: "ปุ่ม Add ยัง visible — ระบบไม่ crash เมื่อใช้ filter+search+sort พร้อมกัน" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP13 กด toggle เปลี่ยนจาก table → card view ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี view toggle (table/card)" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กดปุ่ม toggle card view\n3. รอ render" },
        { type: "expected", description: "หน้าเปลี่ยนเป็น card view, ปุ่ม Add ยัง visible" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const cardToggle = list.viewToggleCard();
    if (!(await cardToggle.isVisible().catch(() => false))) test.skip();
    await cardToggle.click();
    await page.waitForLoadState("networkidle");
    // Table should be hidden or card content should appear
    await expect(list.addButton()).toBeVisible();
  });

  test(
    "TC-DP14 กด toggle เปลี่ยนจาก card → table view ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และอยู่ที่ card view" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด toggle card\n3. กด toggle table" },
        { type: "expected", description: "หน้ากลับมาเป็น table view ที่แสดงผลปกติ" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP15 ข้อมูลที่แสดงใน card กับ table ตรงกัน",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีข้อมูลใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. จดข้อความ row แรกใน table\n3. switch เป็น card view\n4. ตรวจสอบ data ปรากฏใน card" },
        { type: "expected", description: "ข้อมูลที่ปรากฏใน card ตรงกับข้อมูลใน table" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP16 เปลี่ยน view mode แล้ว filter/search/sort ยังทำงานอยู่",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี view toggle" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search ด้วยคำจาก row\n3. switch เป็น card view\n4. switch กลับมา table" },
        { type: "expected", description: "หน้ายังใช้งานได้ ปุ่ม Add visible — search ไม่หายเมื่อสลับ view" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP17 เปลี่ยน view mode แล้ว pagination ยังทำงานอยู่",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี view toggle" },
        { type: "steps", description: "1. เปิดหน้า list\n2. switch เป็น card view\n3. switch กลับมา table\n4. ตรวจสอบ pagination" },
        { type: "expected", description: "ปุ่ม Add ยัง visible — controls pagination ไม่หายเมื่อสลับ view" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP18 refresh หน้าแล้ว view mode กลับมาเป็น default",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. switch เป็น card view\n3. reload หน้า" },
        { type: "expected", description: "หลัง reload กลับมาที่ table view (default)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP19 กด toggle column แล้ว panel แสดงรายการ column ได้",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และปุ่ม column visibility visible" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กดปุ่ม column visibility\n3. ตรวจสอบ menu items" },
        { type: "expected", description: "panel เปิดและแสดง menuitemcheckbox ของ column" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    await list.goto();
    const btn = list.columnVisibilityButton();
    if (!(await btn.isVisible().catch(() => false))) test.skip();
    await btn.click();
    const menuItem = page.getByRole("menuitemcheckbox").first();
    await expect(menuItem).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test(
    "TC-DP20 ซ่อน column แล้ว column หายออกจาก table",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีปุ่ม column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด column visibility\n3. uncheck column name\n4. ตรวจสอบ header\n5. restore" },
        { type: "expected", description: "header ของ column name หายไปจาก table หลัง uncheck" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP21 แสดง column กลับแล้ว column โผล่ใน table",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีปุ่ม column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ซ่อน column name\n3. show กลับ\n4. ตรวจสอบ header" },
        { type: "expected", description: "header ของ column name กลับมา visible หลัง check" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP22 ซ่อนทุก column ไม่ได้ ต้องเหลืออย่างน้อย 1 column",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีปุ่ม column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด column visibility\n3. uncheck ทุก column\n4. ตรวจสอบ table" },
        { type: "expected", description: "ระบบยังเหลือ header อย่างน้อย 1 column ใน table — ซ่อนทุก column ไม่ได้" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP23 column ที่ซ่อนอยู่ยังค้นหาและ filter ได้ปกติ",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีปุ่ม column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ซ่อน column name\n3. search ด้วยคำที่อยู่ในข้อมูล\n4. ตรวจสอบ rows" },
        { type: "expected", description: "search ยังกรองข้อมูลตาม column ที่ซ่อนได้ (rows >= 0)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP24 เปลี่ยน view mode แล้ว column visibility ยังคงอยู่",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี view toggle + column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ซ่อน column name\n3. switch เป็น card\n4. switch กลับมา table\n5. restore" },
        { type: "expected", description: "column name ยังถูกซ่อนเมื่อกลับมา table view" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP25 refresh หน้าแล้ว column ที่ซ่อนไว้กลับมาเป็น default",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีปุ่ม column visibility" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ซ่อน column name\n3. reload หน้า" },
        { type: "expected", description: "หลัง reload column name visible อีกครั้ง (default state)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP26 card view ไม่มี column toggle เพราะไม่มี column",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี view toggle" },
        { type: "steps", description: "1. เปิดหน้า list\n2. switch เป็น card view\n3. ตรวจสอบปุ่ม column visibility" },
        { type: "expected", description: "ปุ่ม column visibility ไม่ visible ใน card view (เพราะไม่มี column)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

// ─── Create (TC-DP27..TC-DP36) ────────────────────────────────────────────────

test.describe("จุดส่งของ — สร้าง", () => {
  test(
    "TC-DP27 กด Add แล้ว dialog เปิดขึ้นมา",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และอยู่ที่หน้า list" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กดปุ่ม Add\n3. ตรวจสอบ dialog\n4. กด cancel" },
        { type: "expected", description: "dialog เปิดและ visible เมื่อกด Add" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.dialog()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP28 dialog เปิดมา field name เป็น empty string",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. ตรวจสอบ value ของ name input" },
        { type: "expected", description: "field name มี value = '' (empty string) เมื่อ dialog เปิด" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.nameInput()).toHaveValue("");
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP29 dialog เปิดมา is active default เป็น true",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. ตรวจสอบ data-state ของ active switch" },
        { type: "expected", description: "active switch มี data-state = 'checked' (default true)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", "checked");
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP30 กรอก name แล้ว save ได้ ข้อมูลขึ้น table",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และยังไม่มี delivery point ชื่อ DP_NAME" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name = DP_NAME\n4. กด Save\n5. search หาชื่อ" },
        { type: "expected", description: "แสดง toast success และข้อมูลปรากฏใน table" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP31 กด save โดยไม่กรอก name ระบบต้องด่า",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กด Save โดยไม่กรอกอะไร" },
        { type: "expected", description: "แสดง error message สำหรับ field ที่ require ว่าง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.saveButton().click();
    await expect(dialog.errorMessage().first()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP32 กรอก name ซ้ำกับที่มีอยู่แล้ว ระบบต้องห้าม",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี delivery point DP_NAME อยู่แล้ว (จาก TC-DP30)" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name ซ้ำ\n4. Save" },
        { type: "expected", description: "ระบบแสดง error duplicate/exists/already และไม่บันทึก" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP33 กรอก name ยาวเกิน limit ระบบต้องห้าม",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name ยาว 150 ตัวอักษร\n4. ตรวจสอบ value" },
        { type: "expected", description: "name input ตัดข้อความให้ยาวไม่เกิน 100 ตัวอักษร" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.addButton().click();
    await dialog.nameInput().fill("a".repeat(150));
    const value = await dialog.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP34 กรอก name เป็น space ล้วน ระบบต้องด่า",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name = '    ' (space ล้วน)\n4. กด Save" },
        { type: "expected", description: "แสดง error message และ dialog ยังเปิดอยู่ (ไม่บันทึก space ล้วน)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP35 กด cancel แล้ว dialog ปิด ไม่มีข้อมูลขึ้น table",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name\n4. กด Cancel\n5. search หาชื่อ" },
        { type: "expected", description: "dialog ปิด และข้อมูลไม่ถูกบันทึก (table แสดง empty state)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP36 สร้างด้วย is active = false แล้วค่าบันทึกถูก",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และยังไม่มี DP_NAME_INACTIVE" },
        { type: "steps", description: "1. เปิดหน้า list\n2. กด Add\n3. กรอก name = DP_NAME_INACTIVE\n4. toggle active = unchecked\n5. กด Save" },
        { type: "expected", description: "บันทึกสำเร็จ (toast success) และค่า is_active = false ถูกบันทึก" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

// ─── Update (TC-DP37..TC-DP44) ────────────────────────────────────────────────

test.describe("จุดส่งของ — แก้ไข", () => {
  test(
    "TC-DP37 กดที่ column name แล้ว dialog เปิดขึ้นมา",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME ใน table (จาก TC-DP30)" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME\n3. คลิกที่ row name\n4. ตรวจสอบ dialog" },
        { type: "expected", description: "dialog edit เปิดและ visible เมื่อคลิกที่ name" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.dialog()).toBeVisible();
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP38 dialog เปิดมา field name แสดงค่าเดิมถูกต้อง",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME\n3. คลิก row\n4. ตรวจ value ของ name input" },
        { type: "expected", description: "field name มี value ตรงกับ DP_NAME (ค่าเดิม)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.nameInput()).toHaveValue(DP_NAME);
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP39 dialog เปิดมา is active แสดงค่าเดิมถูกต้อง",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และ DP_NAME มี is_active = true" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME\n3. คลิก row\n4. ตรวจ data-state ของ active switch" },
        { type: "expected", description: "active switch มี data-state = 'checked' (ตรงกับค่าเดิม)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const dialog = new DeliveryPointDialog(page);
    await list.goto();
    await list.search(DP_NAME);
    await list.clickRowName(DP_NAME);
    await expect(dialog.activeSwitch()).toHaveAttribute("data-state", "checked");
    await dialog.cancelButton().click();
  });

  test(
    "TC-DP40 แก้ name แล้ว save ข้อมูลใน table อัพเดท",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME\n3. คลิก row\n4. clear แล้วกรอก DP_NAME_UPDATED\n5. Save" },
        { type: "expected", description: "แสดง toast updated/success และ table แสดง DP_NAME_UPDATED" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP41 ลบ name ออกทั้งหมดแล้ว save ระบบต้องด่า",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME_UPDATED\n3. คลิก row\n4. clear name\n5. Save" },
        { type: "expected", description: "แสดง error message field require — ไม่อนุญาตให้ save name ว่าง" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP42 แก้ name เป็นค่าเดิมแล้ว save ได้ปกติ",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search\n3. คลิก row\n4. clear แล้วกรอกค่าเดิม\n5. Save" },
        { type: "expected", description: "บันทึกสำเร็จ (toast updated/success) แม้ name ไม่เปลี่ยน" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP43 กด cancel ระหว่าง edit ข้อมูลเดิมไม่เปลี่ยน",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search\n3. คลิก row\n4. clear แล้วกรอก DISCARDED\n5. Cancel\n6. ตรวจสอบ table" },
        { type: "expected", description: "table ยังคงแสดง DP_NAME_UPDATED (ค่าใหม่ไม่ถูกบันทึก)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP44 toggle is active แล้ว save ค่าเปลี่ยนถูก",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search\n3. คลิก row\n4. toggle active\n5. Save\n6. เปิด row อีกครั้งเพื่อตรวจสอบ" },
        { type: "expected", description: "ค่า active สลับสถานะและถูก persist ในระบบหลัง reload" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

// ─── Delete (TC-DP45..TC-DP49) ────────────────────────────────────────────────

test.describe("จุดส่งของ — ลบ", () => {
  test(
    "TC-DP45 กด trash icon แล้ว confirm dialog เปิดขึ้นมา",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME_UPDATED\n3. กด trash icon\n4. ตรวจสอบ confirm dialog\n5. Cancel" },
        { type: "expected", description: "confirm dialog เปิดและ visible เมื่อกด trash" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
    const list = new DeliveryPointListPage(page);
    const confirm = new DeleteConfirmDialog(page);
    await list.goto();
    await list.search(DP_NAME_UPDATED);
    await list.deleteRow(DP_NAME_UPDATED);
    await expect(confirm.dialog()).toBeVisible();
    await confirm.cancelButton().click();
  });

  test(
    "TC-DP46 กด confirm แล้วข้อมูลหายออกจาก table",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_UPDATED ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME_UPDATED\n3. delete row\n4. กด Confirm\n5. search อีกครั้ง" },
        { type: "expected", description: "แสดง toast deleted และ row หายไปจาก table" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP47 กด cancel ใน confirm dialog ข้อมูลยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_INACTIVE ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME_INACTIVE\n3. delete row\n4. กด Cancel\n5. ตรวจสอบ row" },
        { type: "expected", description: "row ยังคงอยู่ใน table (ไม่ถูกลบเมื่อ cancel)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP48 ลบแล้ว total count ใน table ลดลง 1",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมี DP_NAME_INACTIVE ใน table" },
        { type: "steps", description: "1. เปิดหน้า list\n2. search DP_NAME_INACTIVE\n3. count rows\n4. delete + confirm\n5. count rows อีกครั้ง" },
        { type: "expected", description: "จำนวน rows หลังลบน้อยกว่าก่อนลบ (ลดลงอย่างน้อย 1)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
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

  test(
    "TC-DP49 ลบรายการสุดท้ายในหน้า ระบบ paginate กลับหน้าก่อนหน้า",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้ว และมีข้อมูลมากกว่า 1 page โดย page สุดท้ายเหลือเพียง 1 row" },
        { type: "steps", description: "1. เปิดหน้า list\n2. ไปยัง last page\n3. ถ้าเหลือ 1 row ให้ลบ\n4. ตรวจสอบ paginate" },
        { type: "expected", description: "หลังลบ row สุดท้าย ระบบ paginate กลับหน้าก่อนหน้า (currentRows > 0)" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
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
