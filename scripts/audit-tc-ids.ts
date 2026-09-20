import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

export interface AuditError {
  code:
    | "FORMAT"
    | "UNKNOWN_PREFIX"
    | "UNKNOWN_SECTION"
    | "MULTI_PREFIX"
    | "DUPLICATE"
    | "CROSS_FILE_DUPLICATE"
    | "INDEX_MISMATCH"
    | "TOTAL_MISMATCH";
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

const ANY_RE = /\bTC[S]?-[A-Z]{1,5}[-]?\d{2,}\b/g;

interface Catalog {
  modules: Map<string, { spec: string; sections: Set<string> }>;
}

export function loadCatalog(path = "docs/test-id-scheme.md"): Catalog {
  const md = readFileSync(path, "utf8");
  const modules = new Map<string, { spec: string; sections: Set<string> }>();
  // Two tables share one shape: | <source> | <prefix> | ... |. Specs list their
  // sections in column 3; the documented-only catalogs list an Area first, so
  // their sections are in column 4.
  const rows = md
    .split("\n")
    .filter((l) => l.startsWith("| `") && (l.includes(".spec.ts") || l.includes("test-cases/")));
  for (const row of rows) {
    const cells = row.split("|").map((c) => c.trim());
    const sourceCell = cells[1] ?? "";
    const prefix = cells[2]?.replace(/`/g, "").trim();
    if (!prefix) continue;
    const isDoc = sourceCell.includes("test-cases/");
    const sections = expandSections((isDoc ? cells[4] : cells[3]) ?? "");
    const spec = (sourceCell.match(/`([^`]+)`/) ?? [])[1] ?? "";
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

  // Extract IDs from test titles only (not comments or helper args).
  //
  // Half the suite does not call `test()` directly: `createAuthTest(email)` returns
  // a fixture-bound test, bound to names like `adminTest` / `purchaseTest`. A regex
  // anchored on the literal word `test` matched none of them, so 19 specs holding
  // 1,036 IDs went unscanned — and CROSS_FILE_DUPLICATE never covered them.
  const TEST_TITLE_RE =
    /\b[A-Za-z]*[Tt]est(?:\.(?:skip|fixme))?\s*\(\s*(?:`|"|')([^`"']+)/g;
  const TC_IN_TITLE = /\bTC-([A-Z]{2,5})-(\d{2})(\d{4})\b|\bTC[S]?-[A-Z]{1,5}[-]?\d{2,}\b/g;

  const titleIds: string[] = [];
  const titleSeen = new Set<string>();
  let titleMatch: RegExpExecArray | null;

  // 1. Extract all TC IDs from test() titles
  while ((titleMatch = TEST_TITLE_RE.exec(src)) !== null) {
    const titleStr = titleMatch[1];
    const tcMatches = titleStr.match(TC_IN_TITLE) ?? [];
    for (const id of tcMatches) {
      titleIds.push(id);
    }
  }

  // 2. Validate FORMAT and catalog properties for IDs in titles only
  for (const id of titleIds) {
    const strict = id.match(/^TC-([A-Z]{2,5})-(\d{2})(\d{4})$/);
    if (!strict) {
      if (!opts.legacyMode) {
        errors.push({ code: "FORMAT", message: `Invalid TC ID in test title: ${id}`, file, testId: id });
      }
      continue;
    }
    const [, prefix, section] = strict;
    ids.push(id);
    prefixes.add(prefix);

    const mod = catalog.modules.get(prefix);
    if (!mod) {
      errors.push({ code: "UNKNOWN_PREFIX", message: `Prefix "${prefix}" not in catalog`, file, testId: id });
      continue;
    }
    if (!mod.sections.has(section)) {
      errors.push({ code: "UNKNOWN_SECTION", message: `Section ${section} not registered for ${prefix}`, file, testId: id });
    }
  }

  if (prefixes.size > 1) {
    errors.push({ code: "MULTI_PREFIX", message: `Multiple prefixes in one spec: ${[...prefixes].join(", ")}`, file });
  }

  // 3. Duplicate check: a real duplicate is the same ID in 2+ test titles.
  // Reset TEST_TITLE_RE for second pass
  TEST_TITLE_RE.lastIndex = 0;
  while ((titleMatch = TEST_TITLE_RE.exec(src)) !== null) {
    const titleStr = titleMatch[1];
    const idMatch = titleStr.match(/\bTC-([A-Z]{2,5})-(\d{6})\b/);
    if (!idMatch) continue;
    const fullId = `TC-${idMatch[1]}-${idMatch[2]}`;
    if (titleSeen.has(fullId)) {
      errors.push({ code: "DUPLICATE", message: `Duplicate ID in test titles: ${fullId}`, file, testId: fullId });
    }
    titleSeen.add(fullId);
  }

  return { file, errors, warnings, ids };
}

/**
 * Audit a hand-authored test-case catalog in docs/test-cases/.
 *
 * A catalog states each ID three times — in the at-a-glance table, in the
 * per-case heading, and in the header's total — so the three are cross-checked
 * against each other. That is the only thing standing between 28 new catalogs
 * written by separate authors and a set of IDs that quietly collide.
 */
export function auditCatalogDoc(file: string, catalog: Catalog): AuditResult {
  const md = readFileSync(file, "utf8");
  const errors: AuditError[] = [];
  const warnings: AuditError[] = [];

  const headingIds = [...md.matchAll(/^##\s+(TC-[A-Z0-9-]+)\s+—/gm)].map((m) => m[1]);
  const tableIds = [...md.matchAll(/^\|\s*(TC-[A-Z0-9-]+)\s*\|/gm)].map((m) => m[1]);

  const seen = new Set<string>();
  const reportedSections = new Set<string>();
  const reportedPrefixes = new Set<string>();
  const ids: string[] = [];
  for (const id of headingIds) {
    const strict = id.match(/^TC-([A-Z]{2,5})-(\d{2})(\d{4})$/);
    if (!strict) {
      errors.push({ code: "FORMAT", message: `Invalid TC ID in catalog heading: ${id}`, file, testId: id });
      continue;
    }
    const [, prefix, section] = strict;
    ids.push(id);
    if (seen.has(id)) {
      errors.push({ code: "DUPLICATE", message: `Duplicate ID in catalog: ${id}`, file, testId: id });
    }
    seen.add(id);

    const mod = catalog.modules.get(prefix);
    if (!mod) {
      if (!reportedPrefixes.has(prefix)) {
        reportedPrefixes.add(prefix);
        errors.push({ code: "UNKNOWN_PREFIX", message: `Prefix "${prefix}" not in docs/test-id-scheme.md`, file, testId: id });
      }
      continue;
    }
    // One finding per unregistered section, not per case using it: the fix is
    // a single edit to the scheme's row either way.
    if (!mod.sections.has(section) && !reportedSections.has(section)) {
      reportedSections.add(section);
      errors.push({ code: "UNKNOWN_SECTION", message: `Section ${section} not registered for ${prefix}`, file, testId: id });
    }
  }

  // The at-a-glance table must list exactly the cases the document details.
  const headingSet = new Set(headingIds);
  const tableSet = new Set(tableIds);
  for (const id of tableSet) {
    if (!headingSet.has(id)) {
      errors.push({ code: "INDEX_MISMATCH", message: `Listed in the at-a-glance table but has no case section: ${id}`, file, testId: id });
    }
  }
  for (const id of headingSet) {
    if (!tableSet.has(id)) {
      errors.push({ code: "INDEX_MISMATCH", message: `Has a case section but is missing from the at-a-glance table: ${id}`, file, testId: id });
    }
  }

  const declaredTotal = Number(md.match(/\*\*Total test cases:\*\*\s*(\d+)/)?.[1] ?? NaN);
  if (!Number.isNaN(declaredTotal) && declaredTotal !== headingIds.length) {
    errors.push({
      code: "TOTAL_MISMATCH",
      message: `Header says ${declaredTotal} test cases, document has ${headingIds.length}`,
      file,
    });
  }

  return { file, errors, warnings, ids };
}

/** Every catalog in docs/test-cases/, excluding the generated and index files. */
export function auditAllCatalogs(): AuditResult[] {
  const dir = resolve(process.cwd(), "docs", "test-cases");
  if (!existsSync(dir)) return [];
  const catalog = loadCatalog();
  // Includes gaps/: a gap report reuses its spec's prefix, so it is exactly the
  // place where a duplicate ID would go unnoticed.
  const files = readdirSync(dir, { recursive: true, encoding: "utf8" }).filter(
    (f) => f.endsWith(".md") && !f.endsWith("README.md") && !f.endsWith("COVERAGE.md"),
  );
  return files.map((f) => auditCatalogDoc(resolve(dir, f), catalog));
}

/** IDs claimed by more than one file — the failure mode of parallel authoring. */
export function findCrossFileDuplicates(results: AuditResult[]): AuditError[] {
  const owners = new Map<string, string[]>();
  for (const r of results) {
    for (const id of new Set(r.ids)) {
      const list = owners.get(id) ?? [];
      list.push(basename(r.file));
      owners.set(id, list);
    }
  }
  // Reported per file pair, not per ID: a catalog that graduated into a spec
  // shares every ID with it, and listing them one by one buries the finding
  // that actually needs a decision — which of the two files should exist.
  const pairs = new Map<string, { files: string[]; ids: string[] }>();
  for (const [id, files] of owners) {
    if (files.length < 2) continue;
    const sorted = files.sort();
    const key = sorted.join(" + ");
    const entry = pairs.get(key) ?? { files: sorted, ids: [] };
    entry.ids.push(id);
    pairs.set(key, entry);
  }

  const out: AuditError[] = [];
  for (const [key, { files, ids }] of pairs) {
    out.push({
      code: "CROSS_FILE_DUPLICATE",
      message: `${ids.length} IDs claimed by both: ${key} (e.g. ${ids.sort()[0]})`,
      file: files[0],
    });
  }
  return out;
}

export async function auditAll(opts: { legacyMode?: boolean } = {}): Promise<AuditResult[]> {
  const dir = resolve(process.cwd(), "tests");
  const specs = readdirSync(dir).filter((f) => /^.+\.spec\.ts$/.test(f));
  const catalog = loadCatalog();
  return Promise.all(specs.map((s) => auditFile(resolve(dir, s), { ...opts, catalog })));
}

if (import.meta.main) {
  const legacy = process.argv.includes("--legacy-mode");
  // Catalog findings fail the build unless `--lenient-docs` is passed. They did
  // not at first: the catalogs written before this check existed WERE the drift
  // it looks for. That backlog was cleared in P3 (2026-09-20) and the audit has
  // been at zero findings since, so a finding now means something new broke.
  const strictDocs = !process.argv.includes("--lenient-docs");

  auditAll({ legacyMode: legacy }).then((specResults) => {
    const docResults = auditAllCatalogs();
    let exitCode = 0;

    for (const r of specResults) {
      for (const e of r.errors) {
        console.error(`[${e.code}] ${basename(r.file)}: ${e.message}`);
        exitCode = 1;
      }
    }

    const docFindings = [
      ...docResults.flatMap((r) => r.errors),
      ...findCrossFileDuplicates([...specResults, ...docResults]),
    ];
    for (const e of docFindings) {
      const label = strictDocs ? "" : " (warning)";
      console[strictDocs ? "error" : "warn"](`[${e.code}]${label} ${basename(e.file)}: ${e.message}`);
      if (strictDocs) exitCode = 1;
    }

    const specIds = specResults.reduce((s, r) => s + r.ids.length, 0);
    const docIds = docResults.reduce((s, r) => s + r.ids.length, 0);
    const specErrors = specResults.reduce((s, r) => s + r.errors.length, 0);
    console.log(
      `[OK] ${specResults.length} specs (${specIds} IDs, ${specErrors} errors), ` +
        `${docResults.length} catalogs (${docIds} IDs, ${docFindings.length} findings)`,
    );
    process.exit(exitCode);
  });
}
