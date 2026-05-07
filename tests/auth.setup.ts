/**
 * Playwright setup project: log in every test user once per run via the
 * UI and persist their browser context (cookies + localStorage) to
 * .auth/<email>.json. Specs never call loginWithRetry directly — they
 * load this storageState through createAuthTest in
 * tests/fixtures/auth.fixture.ts.
 */
import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { TEST_USERS, getPasswordFor } from "./test-users";
import { authFile } from "./fixtures/auth.paths";

for (const user of TEST_USERS) {
  setup(`authenticate as ${user.role}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry(user.email, getPasswordFor(user.email));
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await page.context().storageState({ path: authFile(user.email) });
  });
}
