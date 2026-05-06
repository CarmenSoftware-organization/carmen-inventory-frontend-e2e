import { readFileSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

export interface AuditError {
  code: "FORMAT" | "UNKNOWN_PREFIX" | "UNKNOWN_SECTION" | "MULTI_PREFIX" | "DUPLICATE";
  message: string;
  file: string;
  line?: number;
  testId?: string;
}

export interface AuditResult {
  file: string;
  errors: AuditError[];
  warnings: AuditError[];
  ids: string[];
}

const STRICT_RE = /\bTC-([A-Z]{2,5})-(\d{2})(\d{4})\b/g;
const ANY_RE = /\bTC[S]?-[A-Z]{1,5}[-]?\d{2,}\b/g;

interface Catalog {
  modules: Map<string, { spec: string; sections: Set<string> }>;
}

export function loadCatalog(path = "docs/test-id-scheme.md"): Catalog {
  const md = readFileSync(path, "utf8");
  const modules = new Map<string, { spec: string; sections: Set<string> }>();
  // Parse the markdown table rows: | <spec> | <prefix> | <sections-used> | ... |
  const rows = md.split("\n").filter((l) => l.startsWith("| `") && l.includes(".spec.ts"));
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim());
    const specCell = cells[1] ?? "";
    const prefix = cells[2]?.replace(/`/g, "").trim();
    const sectionsRaw = cells[3] ?? "";
    if (!prefix) continue;
    const sections = expandSections(sectionsRaw);
    const spec = (specCell.match(/`([^`]+)`/) ?? [])[1] ?? "";
    modules.set(prefix, { spec, sections });
  }
  return { modules };
}

function expandSections(cell: string): Set<string> {
  // "01–05, 10–19" -> Set of "01"…"05","10"…"19"
  const out = new Set<string>();
  for (const part of cell.split(",").map((p) => p.trim())) {
    const range = part.match(/^(\d{2})[–-](\d{2})$/);
    if (range) {
      for (let n = +range[1]; n <= +range[2]; n++) out.add(String(n).padStart(2, "0"));
    } else {
      const single = part.match(/^(\d{2})\b/);
      if (single) out.add(single[1]);
    }
  }
  return out;
}

export async function auditFile(
  file: string,
  opts: { legacyMode?: boolean; catalog?: Catalog } = {},
): Promise<AuditResult> {
  const src = readFileSync(file, "utf8");
  const catalog = opts.catalog ?? loadCatalog();
  const errors: AuditError[] = [];
  const warnings: AuditError[] = [];
  const ids: string[] = [];
  const prefixes = new Set<string>();

  // 1. Find every TC-* candidate
  const candidates = src.match(ANY_RE) ?? [];
  for (const candidate of candidates) {
    const strict = candidate.match(/^TC-([A-Z]{2,5})-(\d{2})(\d{4})$/);
    if (!strict) {
      if (!opts.legacyMode) {
        errors.push({ code: "FORMAT", message: `Invalid TC ID: ${candidate}`, file, testId: candidate });
      }
      continue;
    }
    const [, prefix, section] = strict;
    ids.push(candidate);
    prefixes.add(prefix);

    const mod = catalog.modules.get(prefix);
    if (!mod) {
      errors.push({ code: "UNKNOWN_PREFIX", message: `Prefix "${prefix}" not in catalog`, file, testId: candidate });
      continue;
    }
    if (!mod.sections.has(section)) {
      errors.push({ code: "UNKNOWN_SECTION", message: `Section ${section} not registered for ${prefix}`, file, testId: candidate });
    }
  }

  if (prefixes.size > 1) {
    errors.push({ code: "MULTI_PREFIX", message: `Multiple prefixes in one spec: ${[...prefixes].join(", ")}`, file });
  }

  // Duplicate check (within file)
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push({ code: "DUPLICATE", message: `Duplicate ID: ${id}`, file, testId: id });
    seen.add(id);
  }

  return { file, errors, warnings, ids };
}

export async function auditAll(opts: { legacyMode?: boolean } = {}): Promise<AuditResult[]> {
  const dir = resolve(process.cwd(), "tests");
  const specs = readdirSync(dir).filter((f) => /^.+\.spec\.ts$/.test(f));
  const catalog = loadCatalog();
  return Promise.all(specs.map((s) => auditFile(resolve(dir, s), { ...opts, catalog })));
}

if (import.meta.main) {
  const legacy = process.argv.includes("--legacy-mode");
  auditAll({ legacyMode: legacy }).then((results) => {
    let exitCode = 0;
    for (const r of results) {
      for (const e of r.errors) {
        console.error(`[${e.code}] ${basename(r.file)}: ${e.message}`);
        exitCode = 1;
      }
    }
    const totalIds = results.reduce((s, r) => s + r.ids.length, 0);
    const totalErrors = results.reduce((s, r) => s + r.errors.length, 0);
    console.log(`[OK] ${results.length} specs scanned, ${totalIds} IDs, ${totalErrors} errors`);
    process.exit(exitCode);
  });
}
