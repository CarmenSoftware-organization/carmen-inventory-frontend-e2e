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

const PROFILE_ENDPOINT = "/api/proxy/api/user/profile";

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
  const isProfile = (r: { url(): string; request(): { method(): string } }) =>
    r.url().split("?")[0] === profileUrl && r.request().method() === "GET";

  // A plain goto is not enough on its own: when the SPA already holds a fresh
  // profile in its client cache it renders /dashboard without asking the network
  // again, and the intercept then waits 20s for a request that never happens —
  // which surfaces as tests failing in beforeEach with `waiting for event
  // "response"` rather than on anything they assert. A reload re-mounts the app
  // and makes it fetch again, so retry that way once before giving up.
  const capture = async (navigate: () => Promise<unknown>) => {
    const responsePromise = page.waitForResponse(isProfile, { timeout: 20_000 });
    await navigate();
    return await responsePromise;
  };

  let response;
  try {
    response = await capture(() => page.goto("/dashboard"));
  } catch {
    response = await capture(() => page.reload());
  }
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
  // Compare against defaultBu(), not target.is_default: some accounts (gm@) come
  // back with NO business unit flagged is_default at all, and the frontend then
  // falls back to units[0] — which is what defaultBu() mirrors. Testing the flag
  // alone made those accounts take the switch path for a BU that was already
  // active, and the switcher click then hung the whole test (actionTimeout is 0).
  if (defaultBu(units)?.code === code) return; // already active — fast path

  // NOTE: switching persists server-side and is account-global. Under workers:1 the
  // admin account's default BU stays changed for subsequent specs in the run.
  // Page is already on /dashboard from the getBusinessUnits call above.
  const switcher = new BuSwitcherPage(page);
  await switcher.open();
  await switcher.itemByName(buLabel(target)).click({ timeout: 10_000 });
  // Frontend toast is `Switched to ${bu.name}` (name only) — match on name, not the full label.
  await switcher.waitForToast(new RegExp(`Switched to ${escapeRegExp(target.name)}`, "i"));

  // Confirm via backend truth that the default flipped to the target.
  const after = await getBusinessUnits(page);
  expect(defaultBu(after)?.code).toBe(code);
}
