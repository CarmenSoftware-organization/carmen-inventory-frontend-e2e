import type { Locator } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Navbar Business-Unit switcher (frontend `components/navbar/bu-switcher.tsx`).
 * Pure DOM — no profile lookups or switch logic (that lives in helpers/bu.ts).
 */
export class BuSwitcherPage extends BasePage {
  /**
   * The switcher trigger button, disambiguated from the user-profile dropdown
   * by its Building2 lucide icon. If the lucide class ever changes, fall back to
   * `[data-slot="dropdown-menu-trigger"]` filtered by the same icon.
   */
  trigger(): Locator {
    return this.page
      .getByRole("button")
      .filter({ has: this.page.locator("svg.lucide-building-2") })
      .first();
  }

  /** "Business Unit" header inside the open dropdown content. */
  header(): Locator {
    return this.page.getByText("Business Unit", { exact: true });
  }

  /** A BU menu item, matched by substring of its accessible name. */
  itemByName(name: string): Locator {
    return this.page.getByRole("menuitem", { name });
  }

  async open(): Promise<void> {
    await this.trigger().waitFor({ state: "visible", timeout: 15_000 });
    await this.trigger().click();
    await this.header().waitFor({ state: "visible", timeout: 5_000 });
  }
}
