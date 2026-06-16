import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BuSwitcherPage } from "../pages/bu-switcher.page";

/** One entry of `profile.business_unit[]` (see frontend `types/profile.ts`). */
export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  alias_name: string | null;
  is_default: boolean;
}

export const PROFILE_ENDPOINT = "/api/proxy/api/user/profile";

/** The active BU: the one flagged is_default, else the first (mirrors useProfile). */
export function defaultBu(units: BusinessUnit[]): BusinessUnit | undefined {
  return units.find((b) => b.is_default) ?? units[0];
}

/** Display label as rendered by the switcher: "{alias_name} - {name}" or "{name}". */
export function buLabel(bu: BusinessUnit): string {
  return bu.alias_name ? `${bu.alias_name} - ${bu.name}` : bu.name;
}

/** Escape regex metacharacters so a literal string can be embedded in a RegExp (e.g. matching buLabel output). */
export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Fetch the active user's business units from the profile API.
 *
 * Auth scheme note: the SPA uses a bearer token stored in JS module memory
 * (not in cookies), so `page.request.get()` cannot carry auth headers.
 * Instead, we intercept the SPA's own profile network request which it fires
 * on every dashboard load. The caller must ensure the page navigates (or
 * reloads) to /dashboard before or immediately after calling this function.
 *
 * Implementation: register `waitForResponse` BEFORE the navigation so we
 * do not race, then navigate, then await the captured response.
 */
export async function getBusinessUnits(page: Page): Promise<BusinessUnit[]> {
  // Read runtime config via unauthenticated static file — page.request works.
  const configRes = await page.request.get("/config.json");
  if (!configRes.ok()) {
    throw new Error(`Failed to fetch /config.json: ${configRes.status()}`);
  }
  const config = (await configRes.json()) as { BACKEND_URL: string; X_APP_ID: string };
  const backendUrl = config.BACKEND_URL.replace(/\/+$/, "");

  // Derive the real backend URL from the SPA-internal PROFILE_ENDPOINT path.
  // "/api/proxy/api/user/profile" → "${backendUrl}/api/user/profile"
  const realPath = PROFILE_ENDPOINT.startsWith("/api/proxy/")
    ? PROFILE_ENDPOINT.slice("/api/proxy/".length)
    : PROFILE_ENDPOINT.replace(/^\//, "");
  const profileUrl = `${backendUrl}/${realPath}`;

  // Register intercept BEFORE navigation to avoid races.
  const responsePromise = page.waitForResponse(
    (r) => r.url() === profileUrl && r.request().method() === "GET",
    { timeout: 20_000 },
  );
  await page.goto("/dashboard");

  const response = await responsePromise;
  if (!response.ok()) {
    throw new Error(
      `Profile fetch failed: ${response.status()} ${response.statusText()} (${profileUrl})`,
    );
  }
  const json = await response.json();
  return json.data?.business_unit ?? [];
}

/**
 * Ensure the active business unit is the one with `code`.
 * Idempotent: no-op when already active; otherwise switch via the real UI and
 * confirm the default flipped by re-reading the profile.
 *
 * Side-effect: always leaves the page on /dashboard (navigates there to read
 * the profile and to operate the BU switcher).
 */
export async function ensureActiveBu(page: Page, code: string): Promise<void> {
  // getBusinessUnits navigates to /dashboard internally to capture the profile.
  const units = await getBusinessUnits(page);
  const target = units.find((b) => b.code === code);
  if (!target) {
    throw new Error(
      `Active user has no business unit with code "${code}". ` +
        `Available: ${units.map((b) => b.code).join(", ") || "(none)"}`,
    );
  }
  if (target.is_default) return; // already active — fast path

  // Page is already on /dashboard from the getBusinessUnits call above.
  const switcher = new BuSwitcherPage(page);
  await switcher.open();
  await switcher.itemByName(buLabel(target)).click();
  await switcher.waitForToast(new RegExp(`Switched to ${escapeRegExp(buLabel(target))}`, "i"));

  // Confirm via backend truth that the default flipped to the target.
  const after = await getBusinessUnits(page);
  expect(defaultBu(after)?.code).toBe(code);
}
