/** One entry = one screenshot PNG. */
export type ShotSpec = {
  /** Canonical route; dynamic segments use the :seg form, e.g. "/vendor-management/vendor/:id". */
  path: string;
  /** Wiki module folder under assets/screenshots/inventory/. */
  module: string;
  /** Output filename stem; final file is <module>/<slug>.png. */
  slug: string;
  /** Test-user role to capture as. Defaults to "Admin". */
  role?: string;
  /**
   * Value substituted into EVERY ":seg" of `path` for detail routes. Routes in
   * this manifest carry at most one dynamic segment, so one id suffices; a route
   * needing two distinct ids would need this field to become a map, not a string.
   */
  seedId?: string;
  /** CSS selector awaited before the screenshot; defaults to networkidle only. */
  waitFor?: string;
  /** Override the default 1440x900 viewport. */
  viewport?: { width: number; height: number };
  /** Extra UI state to open before shooting; omit to shoot the page as navigated. */
  interaction?: "add-dialog";
};

/** Result of visiting one route as one role. */
export type ScreenOutcome = "ok" | "denied" | "not-found" | "error";

/**
 * Structural fingerprint of a rendered screen.
 *
 * Deliberately excludes everything data-dependent (record counts, record
 * names, dates, running codes): if the fingerprint moved with the data, every
 * role would compare as "different" and the probe pass would stop saving any
 * work. `hasRows` is a boolean, never a count, for exactly this reason.
 */
export type PageSignature = {
  /** First h1/h2 on the page. */
  heading: string;
  /** Page-level button labels, deduped and sorted. Excludes buttons inside tables. */
  actions: string[];
  /** Table header labels, deduped and sorted. Empty when the page is not a list. */
  columns: string[];
  /** Whether the list rendered any row at all. */
  hasRows: boolean;
};

/** One (route, role) observation produced by the probe pass. */
export type ProbeResult = {
  route: string;
  role: string;
  outcome: ScreenOutcome;
  /** Present only when outcome is "ok". */
  signature?: PageSignature;
  /** The denied/error text actually seen on the page, or why it was unreachable. */
  reason?: string;
};
