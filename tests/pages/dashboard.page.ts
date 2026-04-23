import type { Page } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  /** Avatar / user-profile dropdown trigger in the navbar */
  readonly userMenuTrigger = () =>
    this.page
      .locator('[data-slot="dropdown-menu-trigger"]')
      .filter({ has: this.page.locator('[data-slot="avatar"]') })
      .last();

  readonly logoutMenuItem = () =>
    this.page.getByRole("menuitem", { name: /Log ?out|ออกจากระบบ|Sign ?out/i });

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async logout() {
    // The user-profile trigger only mounts after profile fetch resolves —
    // wait for it to be both attached and stable before clicking.
    const trigger = this.userMenuTrigger();
    await trigger.waitFor({ state: "visible", timeout: 15_000 });
    // Retry up to 3 times in case the menu fails to open on first click
    for (let attempt = 0; attempt < 3; attempt++) {
      await trigger.click();
      try {
        await this.logoutMenuItem().waitFor({ state: "visible", timeout: 3_000 });
        await this.logoutMenuItem().click();
        return;
      } catch {
        // Menu didn't open — close any stray overlays and retry
        await this.page.keyboard.press("Escape").catch(() => null);
      }
    }
    throw new Error("Logout menu item never appeared after 3 attempts");
  }
}
