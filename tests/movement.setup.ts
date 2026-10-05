/**
 * Playwright project `movement-setup`: log in every movement-suite account once
 * per run via the UI and persist its storageState to .auth/<email>.json — the
 * same layout `auth.setup.ts` uses for the gmail TEST_USERS, so the two never
 * collide. Only registered when E2E_MOVEMENT=1 or E2E_PERIOD_CLOSE=1.
 */
import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { MOVEMENT_USERS } from "./movement-users";
import { authFile } from "./fixtures/auth.paths";

for (const [key, user] of Object.entries(MOVEMENT_USERS)) {
  setup(`authenticate movement user ${key}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry(user.email, user.password);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    await page.context().storageState({ path: authFile(user.email) });
  });
}
