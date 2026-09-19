import type { Locator, Page } from "@playwright/test";

/**
 * The rows of a list that actually hold a record.
 *
 * An empty table still renders one `<tr>` ("No data found"), so a bare
 * `tbody tr` count never reaches zero and a guard written as
 * `if (rows.count() === 0) skip` walks straight on into a page with nothing on
 * it. Real rows always carry the record's own link or link-styled button.
 */
export function recordRows(page: Page): Locator {
  return page.locator("tbody tr:has(a), tbody tr:has(button)");
}

/**
 * Open the record a list row points at.
 *
 * A `<tr>` is not clickable anywhere in this app — every list opens its record
 * from a link, or from a link-styled `<button>` whose text is the document
 * number ("PR20260600151", "PL20260300002", "CAD"). `row.click()` therefore
 * waits for a `<tr>` to become "actionable", and because `actionTimeout` is 0 in
 * this config it waits *forever*, burning the test's whole budget with nothing to
 * point at. It was written that way in 47 places across 7 specs.
 *
 * Bounded on purpose, and it throws when the row has nothing to open — silence
 * there is what let the callers carry on against a page they never navigated to.
 */
export async function openRecordFromRow(row: Locator, timeout = 10_000): Promise<void> {
  // Guard against the header row. `page.getByRole("row").filter({ hasText: /received/i })`
  // happily matches the <thead> row of a table with a "Received By" column, and
  // then the "first button in the row" is a column-sort control — so the test
  // sorted the list and carried on believing it had opened a record.
  const isHeader = await row.evaluate(
    (el) => el.closest("thead") !== null || el.querySelector("th") !== null,
  );
  if (isHeader) {
    throw new Error(
      "openRecordFromRow: this is the table's header row, not a record — scope the row lookup to tbody",
    );
  }
  const link = row.getByRole("link").first();
  if ((await link.count()) > 0) {
    await link.click({ timeout });
    return;
  }
  const button = row.getByRole("button").first();
  if ((await button.count()) === 0) {
    throw new Error(
      "openRecordFromRow: the row exposes neither a link nor a button — nothing to open",
    );
  }
  await button.click({ timeout });
}
