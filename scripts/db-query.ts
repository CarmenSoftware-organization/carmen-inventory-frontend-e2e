/**
 * Run one read-only SQL query and print the rows as JSON — the Bun side of
 * `tests/helpers/movement/db.ts` (Playwright workers run on Node, Bun has the
 * Postgres client built in).
 *
 *   E2E_DB_URL=postgresql://... bun run scripts/db-query.ts "select 1 as one"
 *
 * The connection string is read from E2E_DB_URL only (bun auto-loads .env.local).
 */
import { SQL } from "bun";
import { assertReadOnly } from "../tests/helpers/movement/db";

const url = process.env.E2E_DB_URL;
const query = process.argv[2] ?? "";
if (!url) {
  console.error("db-query: E2E_DB_URL is not set");
  process.exit(2);
}
assertReadOnly(query);

// prepare:false — the dev database sits behind pgbouncer, which rejects named prepared statements.
const sql = new SQL({ url, max: 1, prepare: false });
try {
  const rows = await sql.unsafe(query);
  console.log(JSON.stringify(rows, null, 1));
} finally {
  await sql.end();
}
