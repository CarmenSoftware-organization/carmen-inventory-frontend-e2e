import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { addListOnlySecurityCases } from "./helpers/security-cases";

const test = createAuthTest("purchase@blueledgers.com");
const PATH = "/config/exchange-rate";

test.describe.configure({ mode: "serial" });

test.describe("Exchange Rate — Smoke", () => {
  test("TC-ER01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(page).toHaveURL(new RegExp(PATH));
  });

  test("TC-ER02 ปุ่ม Add แสดง", async ({ page }) => {
    const list = new ConfigListPage(page, PATH);
    await list.goto();
    await expect(list.addButton()).toBeVisible();
  });

  addListOnlySecurityCases(test, { prefix: "ER", listPath: PATH, skipTcs: ["TCS-ER09", "TCS-ER10", "TCS-ER11", "TCS-ER12"] });
});
