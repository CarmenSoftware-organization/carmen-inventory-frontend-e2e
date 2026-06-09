import { existsSync, readFileSync } from "node:fs";
import type { ShotSpec } from "./types";

/**
 * Load an environment-specific seedId overlay produced by discover-seeds.ts.
 * Maps route path -> real record id. Returns {} when absent or malformed.
 * The file is gitignored — seedIds differ per backend/dataset.
 */
export function loadSeedOverlay(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

/**
 * Return shots with `seedId` filled from the overlay where a route has none of
 * its own. A spec's hand-set seedId always wins. Pure.
 */
export function applySeedOverlay(
  shots: ShotSpec[],
  overlay: Record<string, string>,
): ShotSpec[] {
  return shots.map((s) =>
    !s.seedId && overlay[s.path] ? { ...s, seedId: overlay[s.path] } : s,
  );
}
