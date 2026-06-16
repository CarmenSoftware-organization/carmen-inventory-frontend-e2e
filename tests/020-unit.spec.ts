import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/config/unit";
const UID = Date.now().toString(36);

const opts = {
  listPath: PATH,
  nameInputId: "unit-name",
  activeSwitchId: "unit-is-active",
  descriptionInputId: "unit-description",
};

test.describe("Unit — Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  test(
    "TC-UN-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture (createAuthTest)" },
        { type: "steps", description: "1. ไปที่ /config/unit" },
        { type: "expected", description: "URL ตรงกับ /config/unit; หน้า list โหลดสำเร็จโดยไม่ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-UN-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/unit" },
        { type: "steps", description: "1. ไปที่ /config/unit" },
        { type: "expected", description: "ปุ่ม Add visible บนหน้า list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.addButton()).toBeVisible();
  });

  test(
    "TC-UN-010003 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/unit" },
        { type: "steps", description: "1. ไปที่ /config/unit\n2. พิมพ์ 'test' ในช่องค้นหา" },
        { type: "expected", description: "ช่องค้นหา visible และรับค่า input ได้โดยไม่ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.searchInput()).toBeVisible();
    await list.search("test");
  });

  test(
    "TC-UN-010004 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/unit" },
        { type: "steps", description: "1. ไปที่ /config/unit\n2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<timestamp>`)" },
        { type: "expected", description: "Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await list.search(`__NOPE__${Date.now()}`);
    await expect(list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test(
    "TC-UN-010005 active BU = BLAVG",
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

  addDialogSecurityCases(test, {
    prefix: "UN",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TC-UN-100004 (authz) skipped
  });
});
