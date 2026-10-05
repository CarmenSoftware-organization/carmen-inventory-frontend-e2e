import type { Page } from "@playwright/test";
import type { MovementUser } from "../../movement-users";
import { apiGet } from "./api";

/**
 * Shared data of the doc-flow specs (`tests/*-doc-flow.spec.ts`).
 *
 * They run with the real role accounts on CARMEN-AVG (permission survey 2026-10-02):
 *  - on CARMEN-FIFO no account but admin holds a permission or a location, so
 *    everything runs on AVG except the FIFO variant of the SR issue flow
 *  - requestor creates PR / PO / SR / GRN / CN at LCX013 (52 products) and 1FO02
 *  - fc is the only account with Stock In / Stock Out permission, location 1FO02
 *  - admin is avoided: it sits in no workflow's "Create Request" stage and skips
 *    permission checks, so it would hide exactly the bugs these specs look for
 *
 * Prerequisite once per environment: `bun run movement:setup-workflows` (adds
 * products to the workflows the role accounts create with — see that script).
 */
export const DOC_FLOW_BU = "CARMEN-AVG";

export const CN_REASON = "Damage Good";

export const DOC_FLOW_ROLE: Record<"pr" | "po" | "sr" | "grn" | "cn" | "adj", { user: MovementUser; loc: string }> = {
  pr: { user: "requestor", loc: "LCX013" },
  po: { user: "requestor", loc: "LCX013" },
  sr: { user: "requestor", loc: "LCX013" }, // destination = SR_TO
  grn: { user: "requestor", loc: "LCX013" },
  cn: { user: "requestor", loc: "LCX013" },
  adj: { user: "fc", loc: "1FO02" },
};

export const SR_TO = "1FO02";

/** Products by DB name — the GRN/CN/SI/SO view pages show the name, not the code. */
export const PROD = {
  P1: { code: "11110001", name: "Ground Beef" },
  P2: { code: "11110003", name: "Australian Sirloin" },
  P3: { code: "11110009", name: "Pork neck tenderloin" },
  P4: { code: "11110012", name: "Shredded pork skin" },
  /** Stocked at both LCX013 and 1FO02 — the only product requestor can requisition across the two. */
  A: { code: "11020001", name: "กร๊อบกรอบ รสสาหร่าย" },
  /** 1FO02 holds only A and B. */
  B: { code: "55000001", name: "สระน้ำตราสุพริม" },
} as const;

const NAME: Record<string, string> = Object.fromEntries(Object.values(PROD).map((p) => [p.code, p.name]));
export const nameOf = (code: string): string => NAME[code] ?? code;

// Some DB names separate words with a non-breaking space ("Ground\u00a0Beef") — match spaces with \s.
const namePattern = (code: string) => nameOf(code).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s");

/** A line's table row, matched by code or name (some screens show the code, some the name). */
export const itemRow = (page: Page, code: string) =>
  page.locator("table tbody tr").filter({ hasText: new RegExp(`${code}|${namePattern(code)}`) }).first();

/** Short run stamp put into descriptions / invoice numbers — tells each run's documents apart. */
export const stamp = new Date().toISOString().slice(5, 16).replace(/[-T:]/g, "");

/**
 * A date inside the BU's current (active) period — documents that post stock
 * (GRN / CN / SI / SO) must be dated there: today when today falls in it (a date
 * picker may refuse future days), else the 15th. E2E_MOVEMENT_DATE overrides it.
 */
export async function activePeriodDate(bu: string = DOC_FLOW_BU): Promise<string> {
  if (process.env.E2E_MOVEMENT_DATE) return process.env.E2E_MOVEMENT_DATE;
  const { status, body } = await apiGet(`/api/${bu}/period-ends/current`);
  const period = String(body?.data?.period ?? "");
  if (status !== 200 || !/^\d{4}$/.test(period)) {
    throw new Error(`current period of ${bu}: HTTP ${status} period="${period}" — set E2E_MOVEMENT_DATE`);
  }
  const month = `20${period.slice(0, 2)}-${period.slice(2)}`;
  // en-CA formats as YYYY-MM-DD; the movement projects run in Asia/Bangkok.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  return today.startsWith(month) ? today : `${month}-15`;
}
