import type { Locator } from "@playwright/test";

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
