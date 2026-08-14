import type { Page } from "@playwright/test";
import type { PageSignature } from "./types";

/** Trim, drop blanks, dedupe, sort — so ordering and whitespace never matter. */
function normalize(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort();
}

function equalLists(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const x = [...a].sort();
  const y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}

/**
 * Read a screen's structural fingerprint from the live page.
 *
 * Buttons inside <table> are excluded on purpose: those are per-row actions
 * whose labels carry record data, which would make the signature move with the
 * dataset instead of with the UI.
 */
export async function pageSignature(page: Page): Promise<PageSignature> {
  // Explicit short timeout: textContent() waits for the element to attach, and
  // a page with neither h1 nor h2 would otherwise block for the full 30s
  // default action timeout before the .catch() fallback fires. At ~1,098
  // probe calls that turns a cheap pass into a slow one.
  const headingText = await page
    .locator("h1, h2")
    .first()
    .textContent({ timeout: 2_000 })
    .catch(() => null);
  const actions = await page
    .locator("button:not(table button)")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const columns = await page
    .locator("table thead th")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const rowCount = await page.locator("table tbody tr").count().catch(() => 0);

  return {
    heading: (headingText ?? "").trim(),
    actions: normalize(actions),
    columns: normalize(columns),
    hasRows: rowCount > 0,
  };
}

/**
 * Do two roles see the same screen?
 *
 * `hasRows` is intentionally NOT compared: it reflects which records a role is
 * scoped to, not how the UI is shaped, and comparing it would produce a
 * near-duplicate screenshot for every role on every list page.
 */
export function sameScreen(a: PageSignature, b: PageSignature): boolean {
  return (
    a.heading === b.heading &&
    equalLists(a.actions, b.actions) &&
    equalLists(a.columns, b.columns)
  );
}
