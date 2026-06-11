/**
 * Run the Playwright suite against a named environment file.
 *
 * Usage:
 *   bun run scripts/run-env.ts [env-name] [...playwright flags]
 *   bun run e2e:uat                       # → loads .env.uat, runs whole suite
 *   bun run e2e:uat -- --project=login    # forwards flags to `playwright test`
 *   bun run scripts/run-env.ts staging    # once .env.staging exists
 *
 * The first positional argument is the environment name (default "uat"); it
 * selects `.env.<name>` at the repo root. Everything after it is forwarded to
 * `playwright test` verbatim.
 *
 * Why this script exists: bun only auto-loads `.env` / `.env.local`, never a
 * custom name like `.env.uat`. This script parses the chosen file and injects
 * it into the child's environment with the FILE TAKING PRECEDENCE over inherited
 * vars — otherwise the localhost values bun already loaded from `.env` would
 * shadow the UAT ones. `playwright.config.ts` reads E2E_BASE_URL /
 * E2E_NO_WEBSERVER / E2E_FRONTEND_DIR from process.env, so injecting them here
 * is all that's required to retarget the run.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Parse dotenv-style `KEY=VALUE` text into a plain object.
 * - Blank lines and lines starting with `#` are ignored.
 * - Splits on the first `=` only (so `=` may appear in the value).
 * - Trims whitespace around key and value.
 * - Strips one layer of matching surrounding single or double quotes.
 * - Tolerates an optional leading `export ` on the key.
 * - Lines without `=` or with an empty key are skipped.
 */
export function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    let key = line.slice(0, eq).trim();
    if (key.startsWith("export ")) key = key.slice("export ".length).trim();
    if (!key) continue;
    let value = line.slice(eq + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function main(argv: string[]): number {
  let envName = "uat";
  let passthrough = argv;
  // First positional (non-flag) arg selects the env file; the rest go to playwright.
  if (argv[0] && !argv[0].startsWith("-")) {
    envName = argv[0];
    passthrough = argv.slice(1);
  }

  // bun/npm scripts run with cwd at the repo root, matching the other scripts
  // in this dir (audit-tc-ids, sync-test-results) that resolve via process.cwd().
  const root = process.cwd();
  const envPath = resolve(root, `.env.${envName}`);
  if (!existsSync(envPath)) {
    console.error(`[run-env] env file not found: ${envPath}`);
    return 1;
  }

  const parsed = parseEnvFile(readFileSync(envPath, "utf8"));
  console.log(
    `[run-env] using .env.${envName} → E2E_BASE_URL=${parsed.E2E_BASE_URL ?? "(unset)"}`,
  );

  const bin = resolve(root, "node_modules", ".bin", "playwright");
  const res = spawnSync(bin, ["test", ...passthrough], {
    stdio: "inherit",
    env: { ...process.env, ...parsed },
  });
  if (res.error) {
    console.error(`[run-env] failed to launch playwright: ${res.error.message}`);
    return 1;
  }
  return res.status ?? 1;
}

// @ts-expect-error import.meta.main is a Bun-specific CLI guard; tsc uses commonjs module mode
if (import.meta.main) {
  process.exit(main(process.argv.slice(2)));
}
