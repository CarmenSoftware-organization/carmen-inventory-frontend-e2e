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

/** Fetch the active user's business units from the profile API (reuses context cookies). */
export async function getBusinessUnits(page: Page): Promise<BusinessUnit[]> {
  const res = await page.request.get(PROFILE_ENDPOINT);
  if (!res.ok()) {
    throw new Error(
      `Profile fetch failed: ${res.status()} ${res.statusText()} (${PROFILE_ENDPOINT})`,
    );
  }
  const json = await res.json();
  return json.data?.business_unit ?? [];
}

/**
 * Ensure the active business unit is the one with `code`.
 * Idempotent: no-op when already active; otherwise switch via the real UI and
 * confirm the default flipped by re-reading the profile.
 */
export async function ensureActiveBu(page: Page, code: string): Promise<void> {
  const units = await getBusinessUnits(page);
  const target = units.find((b) => b.code === code);
  if (!target) {
    throw new Error(
      `Active user has no business unit with code "${code}". ` +
        `Available: ${units.map((b) => b.code).join(", ") || "(none)"}`,
    );
  }
  if (target.is_default) return; // already active — fast path, no navigation

  const switcher = new BuSwitcherPage(page);
  await page.goto("/dashboard");
  await switcher.open();
  await switcher.itemByName(target.name).click();
  await switcher.waitForToast(new RegExp(`Switched to ${escapeRegExp(target.name)}`, "i"));

  // Confirm via backend truth that the default flipped to the target.
  const after = await getBusinessUnits(page);
  expect(defaultBu(after)?.code).toBe(code);
}
