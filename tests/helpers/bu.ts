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

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
