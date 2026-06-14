import type { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  /** Avatar / user-profile dropdown trigger in the navbar */
  readonly userMenuTrigger = () =>
    this.page
      .locator('[data-slot="dropdown-menu-trigger"]')
      .filter({ has: this.page.locator('[data-slot="avatar"]') })
      .last();

  readonly logoutMenuItem = () =>
    this.page.getByRole("menuitem", { name: /Log ?out|ออกจากระบบ|Sign ?out/i });

  /**
   * Confirm button inside the React SPA's logout confirmation AlertDialog.
   * Scoped to role="alertdialog" so it never collides with the menu item, which
   * carries the same label. The legacy Next app logs out without this dialog.
   */
  readonly logoutConfirmButton = () =>
    this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: /Log ?out|ออกจากระบบ|Sign ?out/i });

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
    let opened = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      await trigger.click();
      try {
        await this.logoutMenuItem().waitFor({ state: "visible", timeout: 3_000 });
        await this.logoutMenuItem().click();
        opened = true;
        break;
      } catch {
        // Menu didn't open — close any stray overlays and retry
        await this.page.keyboard.press("Escape").catch(() => null);
      }
    }
    if (!opened) {
      throw new Error("Logout menu item never appeared after 3 attempts");
    }
    // The React SPA gates logout behind a confirmation AlertDialog; the legacy
    // Next app logs out directly. Confirm the dialog if (and only if) it appears.
    try {
      const confirm = this.logoutConfirmButton();
      await confirm.waitFor({ state: "visible", timeout: 3_000 });
      await confirm.click();
    } catch {
      // No confirmation dialog — legacy Next app already logging out.
    }
  }
}
