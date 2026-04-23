import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { addListOnlySecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/unit";

test.describe.configure({ mode: "serial" });

test.describe("Unit — Smoke", () => {
  test(
    "TC-UN01 หน้า list โหลดสำเร็จ",
    {
      annotation: [
        { type: "expected", description: "หน้า list โหลดสำเร็จ" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test(
    "TC-UN02 ปุ่ม Add แสดง",
    {
      annotation: [
        { type: "expected", description: "ปุ่ม Add แสดง" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.addButton()).toBeVisible();
  });

  test(
    "TC-UN03 ช่องค้นหาใช้งานได้",
    {
      annotation: [
        { type: "expected", description: "ช่องค้นหาใช้งานได้" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.searchInput()).toBeVisible();
    await list.search("test");
  });

  test(
    "TC-UN04 ค้นหาคำที่ไม่มีต้องแสดง empty state",
    {
      annotation: [
        { type: "expected", description: "ค้นหาคำที่ไม่มีต้องแสดง empty state" },
      ],
    },
    async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await list.search(`__NOPE__${Date.now()}`);
    await expect(list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  addListOnlySecurityCases(test, { prefix: "UN", listPath: PATH, skipTcs: ["TCS-UN12"] });
});
