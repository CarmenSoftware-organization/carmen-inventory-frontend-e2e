import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { TEST_PASSWORD } from "../test-users";

/**
 * Extended test fixture that provides an authenticated page.
 * Logs in before each test using the specified user email.
 */
export function createAuthTest(email: string) {
  return base.extend<{ authenticatedPage: void }>({
    authenticatedPage: [
      async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithRetry(email, TEST_PASSWORD);
        await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
        await use();
      },
      { auto: true },
    ],
  });
}
