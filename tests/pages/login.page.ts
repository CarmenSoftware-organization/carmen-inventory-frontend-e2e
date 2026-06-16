import type { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  readonly emailInput = () => this.page.locator("#email");
  readonly passwordInput = () => this.page.locator("#password");
  readonly submitButton = () => this.page.getByRole("button", { name: "Sign In" });
  readonly rateLimitMessage = () => this.page.getByText("Too many requests");
  /** Transient network error surfaced when the (remote) auth backend times out. */
  readonly serverUnavailableMessage = () =>
    this.page.getByText(/auth server unavailable|server.*unavailable/i);
  readonly showPasswordToggle = () =>
    this.page.getByRole("button", { name: /show password/i });
  readonly hidePasswordToggle = () =>
    this.page.getByRole("button", { name: /hide password/i });
  /** Rate-limit countdown text shown after a 429 carrying retry_after. */
  readonly countdownMessage = () =>
    this.page.getByText(/too many login attempts.*try again in \d+\s*s/i);

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  /**
   * Login with retry on transient failures: backend rate-limit (429 →
   * "Too many requests") and auth-server network errors ("Auth server
   * unavailable"), which the remote dev backend throws when a cold fetch
   * exceeds the client's 10s timeout. The success wait uses 12s so a slow
   * (but successful) login isn't mistaken for a failure.
   */
  async loginWithRetry(email: string, password: string, maxRetries = 3) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      await this.emailInput().fill(email);
      await this.passwordInput().fill(password);
      await this.submitButton().click();

      // Check if we got redirected (success) or hit a transient failure
      try {
        await this.page.waitForURL("**/dashboard**", { timeout: 12_000 });
        return; // Login succeeded
      } catch {
        const rateLimited = await this.rateLimitMessage().isVisible().catch(() => false);
        const serverUnavailable = await this.serverUnavailableMessage()
          .isVisible()
          .catch(() => false);
        if ((rateLimited || serverUnavailable) && attempt < maxRetries) {
          // Back off longer for rate-limits; a network blip can be retried sooner.
          await this.page.waitForTimeout(rateLimited ? 5_000 : 1_000);
          await this.page.goto("/login");
          await this.page.waitForLoadState("domcontentloaded");
          continue;
        }
        // Non-transient failure — let the caller handle it.
        return;
      }
    }
  }
}
