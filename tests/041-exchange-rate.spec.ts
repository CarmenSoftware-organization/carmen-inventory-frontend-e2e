import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { addListOnlySecurityCases } from "./helpers/security-cases";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/config/exchange-rate";

test.describe("Exchange Rate — Smoke", () => {
  test(
    "TC-ER-010001 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน createAuthTest แล้ว" },
        { type: "steps", description: `1. นำทางไปยัง ${PATH}\n2. รอหน้า list โหลด` },
        { type: "expected", description: "หน้า list โหลดสำเร็จและ URL ตรงกับ /config/exchange-rate" },
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
    "TC-ER-010002 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "preconditions", description: "อยู่ที่หน้า list ของ exchange rate และมีสิทธิ์เพิ่มข้อมูล" },
        { type: "steps", description: `1. นำทางไปยัง ${PATH}\n2. ตรวจสอบปุ่ม Add บนหน้า list` },
        { type: "expected", description: "ปุ่ม Add แสดงบนหน้า list" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.addButton()).toBeVisible();
  });

  addListOnlySecurityCases(test, { prefix: "ER", listPath: PATH, skipTcs: ["TC-ER-100001", "TC-ER-100002", "TC-ER-100003", "TC-ER-100004"] });
});
