/**
 * URL bookkeeping for the screen crawler (`bun run create:sitemap:screen`).
 *
 * Kept apart from capture-screens.ts so the rules that decide "is this a screen
 * worth shooting?" stay pure and unit-testable (see unit/screen-crawl.test.ts) —
 * the capture script itself needs a live browser to exercise.
 */

/**
 * Paths the crawler must never open.
 *
 * - `api` — data endpoints, not screens.
 * - `login` / `logout` — following either ends the authenticated session, which
 *   would silently turn every remaining capture into a screenshot of the login
 *   page.
 * - `export` / `download` — trigger a file download instead of a navigation.
 */
const BLOCKED_PATH = /(^|\/)(?:api|login|logout)(?:\/|$)|\/(?:export|download)(?:\/|$)/i;

/** Query strings that perform an action rather than select a view. */
const MUTATING_QUERY = /(?:delete|remove|destroy|logout|action|mutation)=/i;

const UUID_SEGMENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** One page to visit: the concrete URL to open, keyed by its canonical route. */
export interface CrawlTarget {
  /** The real href, ids and all — this is what the browser navigates to. */
  url: string;
  /** The id-collapsed form, used for dedupe and as the screenshot label. */
  route: string;
}

/**
 * Collapse a discovered href into the canonical route used for dedupe, or null
 * when the link is not a screen this crawler should visit.
 *
 * Ids collapse to ":id" so that a list linking to 50 records yields one detail
 * capture, not 50 near-identical ones. Query strings and hashes are dropped:
 * `/products?page=2` is the same screen as `/products`.
 */
export function normalizeScreenUrl(rawUrl: string, baseUrl: string): string | null {
  // An in-page href — `<a href="#">`, which Radix uses for dropdown triggers —
  // resolves to the origin root and would otherwise enqueue "/" from a link
  // that navigates nowhere.
  const trimmed = rawUrl.trim();
  if (trimmed === "" || trimmed.startsWith("#")) return null;

  let url: URL;
  try {
    url = new URL(trimmed, baseUrl);
  } catch {
    // Not a URL at all — e.g. href="#" or a javascript: link.
    return null;
  }

  if (
    url.origin !== new URL(baseUrl).origin ||
    BLOCKED_PATH.test(url.pathname) ||
    MUTATING_QUERY.test(url.search)
  ) {
    return null;
  }

  const pathname = url.pathname
    .split("/")
    .map((segment) => (UUID_SEGMENT.test(segment) || /^\d+$/.test(segment) ? ":id" : segment))
    .join("/");

  return new URL(pathname, baseUrl).toString().replace(/\/$/, "");
}

/**
 * Push every not-yet-seen href onto the queue, marking each as seen.
 *
 * Mutates `queue` and `seen` and returns what it added, so a caller can log or
 * cap the additions.
 */
export function enqueueUnseen(
  queue: CrawlTarget[],
  seen: Set<string>,
  rawUrls: string[],
  baseUrl: string,
): CrawlTarget[] {
  const added: CrawlTarget[] = [];

  for (const rawUrl of rawUrls) {
    const route = normalizeScreenUrl(rawUrl, baseUrl);
    if (route && !seen.has(route)) {
      const target: CrawlTarget = { url: new URL(rawUrl, baseUrl).toString(), route };
      seen.add(route);
      queue.push(target);
      added.push(target);
    }
  }

  return added;
}

/**
 * Turn a route or an email local-part into a filesystem-safe name.
 *
 * The root route "/" sanitizes to an empty string, which would produce a hidden
 * ".png" dotfile — "_root" is the fallback, and cannot collide with a real
 * route because the regex strips "_" from every input.
 */
export function safeName(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "_root";
}

/** Folder name for one test user: the email's local part, sanitized. */
export function userFolder(email: string): string {
  return safeName(email.split("@")[0] ?? email);
}
