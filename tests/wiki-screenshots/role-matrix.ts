import { existsSync, readFileSync, writeFileSync } from "node:fs";
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

/** Read the probe output. Throws with the fix when the file is absent. */
export function loadRoleMatrix(path: string): ProbeResult[] {
  if (!existsSync(path)) {
    throw new Error(
      `role-matrix.json not found at ${path}. Run "bun run wiki:probe" first — ` +
        `capturing without it would silently shoot only the default role.`,
    );
  }
  return JSON.parse(readFileSync(path, "utf8")) as ProbeResult[];
}

export function saveRoleMatrix(path: string, results: ProbeResult[]): void {
  writeFileSync(path, JSON.stringify(results, null, 2));
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

/** Roles that need their own screenshot because their screen differs from the baseline. Pure. */
export function rolesToCapture(results: ProbeResult[], route: string): string[] {
  const base = baselineFor(results, route);
  if (!base?.signature) return [];
  return results
    .filter((r) => r.route === route && r.outcome === "ok" && r.role !== base.role)
    .filter((r) => !r.signature || !sameScreen(base.signature!, r.signature))
    .map((r) => r.role);
}
