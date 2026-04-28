import type { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly emailInput = () => this.page.locator("#email");
  readonly passwordInput = () => this.page.locator("#password");
  readonly submitButton = () => this.page.getByRole("button", { name: "Sign In" });
  readonly rateLimitMessage = () => this.page.getByText("Too many requests");

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  /** Login with retry when rate limited */
  async loginWithRetry(email: string, password: string, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      await this.emailInput().fill(email);
      await this.passwordInput().fill(password);
      await this.submitButton().click();

      // Check if we got redirected (success) or hit rate limit
      try {
        await this.page.waitForURL("**/dashboard**", { timeout: 5_000 });
        return; // Login succeeded
      } catch {
        // Check for rate limit
        const rateLimited = await this.rateLimitMessage().isVisible().catch(() => false);
        if (rateLimited && attempt < maxRetries) {
          await this.page.waitForTimeout(5_000);
          await this.page.goto("/login");
          await this.page.waitForLoadState("domcontentloaded");
          continue;
        }
        // Not rate limited — let the caller handle the failure
        return;
      }
    }
  }
}
