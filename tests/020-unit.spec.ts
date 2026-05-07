import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { addListOnlySecurityCases } from "./helpers/security-cases";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/config/unit";

test.describe("Unit — Smoke", () => {
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

  addListOnlySecurityCases(test, { prefix: "UN", listPath: PATH, skipTcs: ["TC-UN-100004"] });
});
