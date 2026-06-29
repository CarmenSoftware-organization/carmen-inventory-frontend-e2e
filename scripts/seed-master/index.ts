// scripts/seed-master/index.ts
import type { EntityName, SeedResult } from "./types";
import { ALL_ENTITIES } from "./types";
import { resolveConfig, isLocalHost } from "./config";
import { readWorkbookFile, extractRows } from "./parser";
import { login, createApiClient } from "./api-client";
import { runSeed } from "./orchestrator";

export interface CliArgs {
  file: string;
  bu?: string;
  limit: number;
  only?: EntityName[];
  skip?: EntityName[];
  dryRun: boolean;
  yes: boolean;
  verbose: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { file: "avg", limit: 50, dryRun: false, yes: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--dry-run": args.dryRun = true; break;
      case "--yes": args.yes = true; break;
      case "--verbose": args.verbose = true; break;
      case "--file": args.file = argv[++i]; break;
      case "--bu": args.bu = argv[++i]; break;
      case "--limit": args.limit = Number(argv[++i]); break;
      case "--only": args.only = argv[++i].split(",").map((s) => s.trim()) as EntityName[]; break;
      case "--skip": args.skip = argv[++i].split(",").map((s) => s.trim()) as EntityName[]; break;
      default: throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

export function resolveEnabled(args: CliArgs): Set<EntityName> {
  let set = new Set<EntityName>(ALL_ENTITIES);
  if (args.only) set = new Set(args.only);
  if (args.skip) for (const s of args.skip) set.delete(s);
  return set;
}

export function resolveWorkbookPath(file: string): string {
  if (file === "avg") return "sample_seed_data/Preconfig_CARMEN_AVG.xlsx";
  if (file === "fifo") return "sample_seed_data/Preconfig_CARMEN_FIFO.xlsx";
  return file;
}

export function printSummary(results: SeedResult[]): string {
  const byEntity = new Map<string, { created: number; skipped: number; failed: number }>();
  for (const r of results) {
    const e = byEntity.get(r.entity) ?? { created: 0, skipped: 0, failed: 0 };
    e[r.status]++;
    byEntity.set(r.entity, e);
  }
  const lines = ["", "=== Seed summary ===", "entity".padEnd(16) + "created  skipped  failed"];
  for (const [entity, c] of byEntity) {
    lines.push(entity.padEnd(16) + String(c.created).padEnd(9) + String(c.skipped).padEnd(9) + String(c.failed));
  }
  const failed = results.filter((r) => r.status === "failed");
  if (failed.length > 0) {
    lines.push("", "Failures:");
    for (const f of failed) lines.push(`  ${f.entity} ${f.key}: ${f.error}`);
  }
  return lines.join("\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const cfg = resolveConfig({ ...process.env, ...(args.bu ? { SEED_BU_CODE: args.bu } : {}) });

  if (!args.dryRun && !isLocalHost(cfg.backendUrl) && !args.yes) {
    console.error(`Refusing to seed non-localhost target ${cfg.backendUrl} without --yes.`);
    process.exit(2);
  }

  const wbPath = resolveWorkbookPath(args.file);
  console.log([
    "=== Master seed ===",
    `target:  ${cfg.backendUrl}`,
    `bu:      ${cfg.buCode}`,
    `file:    ${wbPath}`,
    `mode:    ${args.dryRun ? "DRY-RUN (no writes)" : "LIVE"}`,
    `limit:   ${args.limit}`,
    `entities: ${[...resolveEnabled(args)].join(", ")}`,
  ].join("\n"));

  const rows = extractRows(readWorkbookFile(wbPath));
  const token = await login(cfg);
  const client = createApiClient(cfg, token);
  const results = await runSeed(cfg, client, rows, {
    limit: args.limit,
    dryRun: args.dryRun,
    enabled: resolveEnabled(args),
  });

  console.log(printSummary(results));
  const failed = results.filter((r) => r.status === "failed").length;
  process.exit(failed > 0 ? 1 : 0);
}

// Run only when invoked directly (not when imported by unit tests).
if (import.meta.main) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
