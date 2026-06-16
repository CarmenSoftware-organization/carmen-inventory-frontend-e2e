import type { Page, Locator } from "@playwright/test";

/**
 * Scopes interactions to one of the department form's two Transfer widgets,
 * identified by its section heading ("Department Members" or "Head of
 * Department"). The form renders both with an identical move button
 * (aria-label "Move selected to right"), so every locator is scoped to the
 * section container to avoid cross-matching.
 */
export class DepartmentMembersHelper {
  constructor(private readonly page: Page) {}

  /** The section container (the bordered card) that holds the given heading. */
  private section(heading: string): Locator {
    return this.page
      .locator("div")
      .filter({ has: this.page.getByText(heading, { exact: true }) })
      .filter({ has: this.page.getByRole("button", { name: "Move selected to right" }) })
      .last();
  }

  /** Number of selectable users in the section's left ("available") list. */
  async availableCount(heading: string): Promise<number> {
    return this.section(heading).getByRole("checkbox").count();
  }

  /**
   * Tick the first available user and move it to the right (assigned) list.
   * Returns the moved user's visible label, or null if none were available.
   */
  async assignFirstAvailable(heading: string): Promise<string | null> {
    const section = this.section(heading);
    const firstCheckbox = section.getByRole("checkbox").first();
    if ((await firstCheckbox.count()) === 0) return null;
    const row = section.locator("li, [role='listitem']").filter({ has: firstCheckbox }).first();
    const label = (await row.innerText().catch(() => "")).trim();
    await firstCheckbox.check();
    await section.getByRole("button", { name: "Move selected to right" }).click();
    return label || "(moved)";
  }
}
