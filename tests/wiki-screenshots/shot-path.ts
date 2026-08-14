import { join } from "node:path";
import type { ShotSpec } from "./types";

/** Substitute the spec's seedId into every ":seg" of its route. Pure. */
export function resolvePath(spec: ShotSpec): string {
  return spec.seedId
    ? spec.path.replace(/\/:[A-Za-z_]+/g, `/${spec.seedId}`)
    : spec.path;
}

/**
 * Where one (spec, role) shot is written.
 *
 * The baseline role keeps the historic unsuffixed path because the wiki's
 * en/th inventory docs link to it; every other role gets a "--<role>" suffix.
 */
export function outputFile(
  assetsDir: string,
  spec: ShotSpec,
  role: string,
  baselineRole: string,
): string {
  const stem = spec.interaction === "add-dialog" ? `${spec.slug}-dialog-add` : spec.slug;
  const suffix = role === baselineRole ? "" : `--${role}`;
  return join(assetsDir, spec.module, `${stem}${suffix}.png`);
}
