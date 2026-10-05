import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

/**
 * Read-only SQL against the tenant database, for facts the API does not expose:
 * which period a cost layer landed in, whether a line got an inventory
 * transaction, the on-hand per lot.
 *
 * Runs `scripts/db-query.ts` under Bun (Playwright workers run on Node, which has
 * no Postgres client here). The connection string comes from E2E_DB_URL — keep it
 * in .env.local, never in code; a read-only database role is all this needs.
 *
 * Tenant schemas use underscores: CARMEN_FIFO, not CARMEN-FIFO — a wrong name
 * returns zero rows silently, so build it with `schemaOf`.
 */
export function assertReadOnly(query: string): void {
  // Postgres lets a CTE carry DML, so WITH is allowed only when no write keyword appears anywhere.
  if (!/^\s*(select|with)\b/i.test(query) || /\b(insert|update|delete|truncate|alter|drop|create|grant|revoke)\b/i.test(query)) {
    throw new Error(`movement db: read-only queries only — got: ${query.trim().slice(0, 80)}`);
  }
}

export const hasDb = (): boolean => Boolean(process.env.E2E_DB_URL);

export function sql<T = Record<string, string>>(query: string): T[] {
  assertReadOnly(query);
  if (!hasDb()) {
    throw new Error("movement db: set E2E_DB_URL (Postgres URL of the tenant DB) in .env.local — this case verifies its result in the database");
  }
  const out = execFileSync("bun", ["run", resolve(process.cwd(), "scripts/db-query.ts"), query], {
    encoding: "utf8",
    env: process.env,
  });
  return JSON.parse(out.slice(out.indexOf("[")));
}

/** `"CARMEN_AVG"` for BU code `CARMEN-AVG`. */
export const schemaOf = (bu: string): string => `"${bu.replace(/-/g, "_")}"`;
