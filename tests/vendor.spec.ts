import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { VendorPage } from "./pages/vendor.page";

const test = createAuthTest("purchase@blueledgers.com");
test.describe.configure({ mode: "serial" });

const UID = Date.now().toString(36);
const CODE = `V${UID.slice(-6).toUpperCase()}`;
const NAME = `E2E VEN ${UID}`;
const NAME_UPDATED = `E2E VEN Upd ${UID}`;

test.describe("Vendor — scaffold", () => {
  test("TC-VEN00 scaffold placeholder", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(page).toHaveURL(/vendor-management\/vendor/);
  });
});
