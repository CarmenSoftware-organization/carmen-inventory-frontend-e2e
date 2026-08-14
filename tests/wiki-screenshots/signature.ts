import type { Locator, Page } from "@playwright/test";
import type { PageSignature, ScreenOutcome } from "./types";

/**
 * The app's content region — everything the route itself renders.
 *
 * `#main-content` is the wrapper `routes/root-layout.tsx` puts around
 * `<RouteGuard><Outlet /></RouteGuard>`. Scoping to it is what makes the
 * signature describe the PAGE instead of the app shell: the sidebar, the
 * navbar (whose profile trigger is a <button> carrying the logged-in user's
 * name and department, and whose bell carries an unread count), the toaster
 * and the status bar all live outside it, and every one of them differs per
 * role or per minute. Fingerprinting them made every role look "different"
 * on every route.
 */
const CONTENT_ROOT = "#main-content";

/**
 * `#main-content` when the shell rendered it, otherwise `body`.
 *
 * The fallback matters: a handful of routes render outside the shell (the
 * public price-list `/pl/:url_token`, the standalone 404 page), and a
 * signature of nothing at all would make them all compare equal.
 */
export async function contentRoot(page: Page): Promise<Locator> {
  const main = page.locator(CONTENT_ROOT);
  const present = await main.count().catch(() => 0);
  return present > 0 ? main : page.locator("body");
}

/**
 * Every visible h1/h2 the page rendered, in document order.
 *
 * `allInnerTexts()` never auto-waits, unlike `.first().textContent()`: a page
 * with no heading at all — every config form is one — would otherwise burn the
 * full action timeout before falling back, ~45 heading-less routes x 9 roles
 * deep into a batch job. innerText is also layout-aware, so an sr-only or
 * hidden heading correctly yields "" and drops out.
 */
export async function readHeadings(root: Locator): Promise<string[]> {
  const texts = await root
    .locator("h1, h2")
    .allInnerTexts()
    .catch(() => [] as string[]);
  return texts.map((t) => t.replace(/\s+/g, " ").trim()).filter(Boolean);
}

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
 * Every query is scoped to the content region (see `contentRoot`) so the
 * fingerprint moves with the UI, not with who is logged in.
 *
 * Buttons inside <table> are excluded on purpose: those are per-row actions
 * whose labels carry record data, which would make the signature move with the
 * dataset instead of with the UI.
 */
export async function pageSignature(page: Page): Promise<PageSignature> {
  const root = await contentRoot(page);
  const headings = await readHeadings(root);
  const actions = await root
    .locator("button:not(table button)")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const columns = await root
    .locator("table thead th")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const rowCount = await root.locator("table tbody tr").count().catch(() => 0);

  return {
    heading: headings[0] ?? "",
    // Pagination page-number buttons sit as siblings of the <table>, so
    // ":not(table button)" does not exclude them — and how many there are
    // tracks the record count, not the UI. Drop anything whose whole label is
    // a number.
    actions: normalize(actions).filter((a) => !/^\d+$/.test(a)),
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

/**
 * Ordered on purpose: a denied page can also read "not found", and the app's
 * `ErrorState` always titles itself "Something went wrong" even when the real
 * cause is a 404. Whichever pattern comes first wins.
 *
 * Bare numeric codes are word-bounded: an unanchored /403/ or /404/ also
 * matches inside ordinary document numbers (PO-2024045, REQ-40412).
 */
const OUTCOME_PATTERNS: ReadonlyArray<readonly [ScreenOutcome, RegExp]> = [
  ["denied", /permission denied|access denied|forbidden|not authorized|\b403\b/i],
  [
    "not-found",
    /not found|can'?t find that page|couldn'?t find what you were looking for|\b404\b/i,
  ],
  ["error", /something went wrong|unexpected error|couldn'?t load your profile/i],
];

/**
 * Decide what a role actually got, from the page's own headings plus the text
 * of any alert blocks inside the content region. Pure — the DOM reading lives
 * in the caller so this stays unit-testable.
 *
 * Two signals, in strict priority order:
 *
 * 1. **Headings (primary).** A page-level failure names itself in a heading:
 *    `AccessDeniedBlock` (`components/route-guard.tsx`) renders
 *    `<h2>Permission Denied</h2>`, `ProfileError` renders
 *    `<h2>Couldn't load your profile</h2>`, the standalone 404 page renders
 *    `<h1>We can't find that page</h1>`. No widget-level notice in the app has
 *    a heading of its own. ALL headings are checked, not just the first, so
 *    adding a breadcrumb or page-title strip above the guard cannot hide a
 *    genuine denial.
 *
 * 2. **Alert text (secondary), only when the page rendered NO heading at all.**
 *    `ErrorState` (`components/ui/error-state.tsx`) is the app's page-level
 *    "not found"/"failed to load" block and it puts its text in `<p>`, not a
 *    heading — but it also replaces the route's whole content, so a page
 *    showing it has no heading left. A widget-level notice
 *    (`<p role="alert">Failed to load saved widgets: business unit not found</p>`
 *    on /dashboard, the identical `<div role="alert">` on /config and
 *    /operation-plan, and every form field error) always coexists with the
 *    page's own `<h1>`, so this branch never even looks at it. That is the
 *    exact case that previously made /dashboard classify unreachable for all
 *    nine roles.
 *
 * Replaces an earlier heuristic that counted the siblings of the nearest
 * `[role="alert"]` ancestor: that depended on layout files unrelated to
 * permissions, and would have flipped every genuine denial to "ok" the moment
 * anything else was rendered inside `#main-content`.
 */
export function decideOutcome(
  headings: string[],
  alertTexts: string[],
): { outcome: ScreenOutcome; reason?: string } {
  const clean = (s: string): string => s.replace(/\s+/g, " ").trim();
  const heads = headings.map(clean).filter(Boolean);

  for (const [outcome, pattern] of OUTCOME_PATTERNS) {
    const hit = heads.find((h) => pattern.test(h));
    if (hit) return { outcome, reason: hit.slice(0, 120) };
  }

  if (heads.length === 0) {
    const alerts = alertTexts.map(clean).filter(Boolean);
    for (const [outcome, pattern] of OUTCOME_PATTERNS) {
      const hit = alerts.find((t) => pattern.test(t));
      if (hit) return { outcome, reason: hit.slice(0, 120) };
    }
  }

  return { outcome: "ok" };
}
