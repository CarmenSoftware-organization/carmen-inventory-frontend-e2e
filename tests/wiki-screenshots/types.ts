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
  /** Value substituted into the first :seg of `path` for detail routes. */
  seedId?: string;
  /** CSS selector awaited before the screenshot; defaults to networkidle only. */
  waitFor?: string;
  /** Override the default 1440x900 viewport. */
  viewport?: { width: number; height: number };
};
