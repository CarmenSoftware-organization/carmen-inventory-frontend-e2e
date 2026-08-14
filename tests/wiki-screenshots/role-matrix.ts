import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ProbeResult } from "./types";
import { sameScreen } from "./signature";
import { TEST_USERS } from "../test-users";

export const ROLE_MATRIX_PATH = join(
  process.cwd(),
  "tests/wiki-screenshots/role-matrix.json",
);

/**
 * Baseline preference order: Admin first (it sees the most and owns the
 * historic screenshot paths), then TEST_USERS order for pages Admin is denied
 * — e.g. the certification module, which RBAC blocks for admin@BLAVG.
 */
const ROLE_ORDER: string[] = [
  "Admin",
  ...TEST_USERS.map((u) => u.role).filter((r) => r !== "Admin"),
];

/**
 * Read the probe output. Throws with the fix in the message.
 *
 * Missing and malformed are discriminated here, once, so every caller
 * (capture, sitemap, coverage) gets the same actionable message instead of a
 * bare `SyntaxError` from `JSON.parse`.
 */
export function loadRoleMatrix(path: string): ProbeResult[] {
  if (!existsSync(path)) {
    throw new Error(
      `role-matrix.json not found at ${path}. Run "bun run wiki:probe" first — ` +
        `capturing without it would silently shoot only the default role.`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(
      `role-matrix.json at ${path} is unreadable or malformed (${(err as Error).message}). ` +
        `Delete it and re-run "bun run wiki:probe".`,
    );
  }
  if (!Array.isArray(parsed)) {
    throw new Error(
      `role-matrix.json at ${path} is not an array of probe results. ` +
        `Delete it and re-run "bun run wiki:probe".`,
    );
  }
  return parsed as ProbeResult[];
}

/**
 * Persist the matrix atomically.
 *
 * The probe calls this once per role during a ~25-minute job that operators do
 * Ctrl-C. A plain overwrite that is killed mid-write truncates exactly the
 * data per-role persistence exists to protect, so write a sibling temp file
 * and rename it into place (same filesystem, so the rename is atomic).
 */
export function saveRoleMatrix(path: string, results: ProbeResult[]): void {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(results, null, 2));
  renameSync(tmp, path);
}

/** The role whose screenshot represents this route, or null if nobody can reach it. Pure. */
export function baselineFor(
  results: ProbeResult[],
  route: string,
): ProbeResult | null {
  const reachable = results.filter((r) => r.route === route && r.outcome === "ok");
  for (const role of ROLE_ORDER) {
    const hit = reachable.find((r) => r.role === role);
    if (hit) return hit;
  }
  return null;
}

/**
 * Roles that need their own screenshot because their screen differs from the
 * baseline. Pure.
 *
 * Deduped as belt-and-braces: the probe already keeps one observation per
 * (route, role), but a matrix concatenated from two runs — or a manifest that
 * lists a route twice — must not make capture plan the same job repeatedly and
 * then report it as colliding with itself.
 */
export function rolesToCapture(results: ProbeResult[], route: string): string[] {
  const base = baselineFor(results, route);
  if (!base?.signature) return [];
  const roles = results
    .filter((r) => r.route === route && r.outcome === "ok" && r.role !== base.role)
    .filter((r) => !r.signature || !sameScreen(base.signature!, r.signature))
    .map((r) => r.role);
  return [...new Set(roles)];
}
