# Test Case ID Scheme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the e2e test suite from the current ad-hoc TC ID convention to a unified `TC-<PREFIX>-XXYYYY` scheme (2-digit section + 4-digit seq), with deterministic migration tooling and three-layer enforcement (audit script + pre-commit + CI).

**Architecture:** Phase the work into Foundation → Tooling → Per-module rename → Sheet sync → Lock-down. Each phase is committable independently and the repo stays green between phases. A central catalog (`docs/test-id-scheme.md`) is the source of truth for prefixes and section blocks.

**Tech Stack:** Bun, TypeScript, Playwright, Vitest (for unit tests of migration scripts), Lefthook (pre-commit), GitHub Actions (CI), Google Sheets API.

**Spec:** `docs/superpowers/specs/2026-05-06-test-id-scheme-design.md`

---

## File Structure

**Create**
- `docs/test-id-scheme.md` — canonical catalog (prefix per spec + section blocks)
- `docs/migration/test-id-migration-map.json` — generated mapping, human-reviewed
- `scripts/migrate-tc-ids/propose.ts` — algorithmic mapping generator
- `scripts/migrate-tc-ids/apply.ts` — rename in spec files
- `scripts/migrate-tc-ids/sync-sheet.ts` — Google Sheet update with backup
- `scripts/audit-tc-ids.ts` — static checker
- `scripts/migrate-tc-ids/__tests__/propose.test.ts`
- `scripts/migrate-tc-ids/__tests__/apply.test.ts`
- `scripts/__tests__/audit-tc-ids.test.ts`
- `.github/workflows/tc-id-audit.yml` — CI gate
- `lefthook.yml` — pre-commit hook

**Modify**
- `tests/reporters/tc-json-reporter.ts:60` — transition regex (Phase 0), strict regex (Phase 4)
- `tests/*.spec.ts` (33 files) — TC ID renames, by tooling
- `tests/helpers/security-cases.ts:159` — extend to emit new-format IDs
- `scripts/generate-user-stories.ts` — update TC pattern if hardcoded
- `package.json` — add `audit:tc-ids`, `migrate:tc-propose`, `migrate:tc-apply`, `migrate:tc-sheet`
- `CLAUDE.md` — document new convention, link to scheme catalog
- `docs/user-stories/*.md` — regenerated via `bun docs:user-stories`

---

## Phase 0 — Foundation

### Task 1: Author the section catalog

**Files:**
- Create: `docs/test-id-scheme.md`

- [ ] **Step 1: Write the catalog**

Create `docs/test-id-scheme.md` with:

````markdown
# Test ID Scheme

Format: `TC-<PREFIX>-XXYYYY` where `XX` = section block (01–99), `YYYY` = sequence within section (0001–9999).

Strict regex: `^TC-[A-Z]{2,5}-\d{6}$`

## Section block template

| Block | Purpose |
|-------|---------|
| 01 | List / Search / Filter |
| 02 | Detail / View |
| 03 | Create |
| 04 | Edit / Update |
| 05 | Delete |
| 06–09 | Sub-journeys (Creator / Approver / Purchaser / Returned, etc.) |
| 10–19 | Security / Authorization |
| 20–29 | Validation |
| 30–39 | Integration / External |
| 40–89 | Module-specific |
| 90–99 | Edge cases / experimental |

## Module catalog

| Spec file | Prefix | Sections used | Notes |
|-----------|--------|---------------|-------|
| `001-login.spec.ts` | `LOGIN` | 01, 10–19 | Login flows + security |
| `010-department.spec.ts` | `DEP` | 01–05 | CRUD |
| `020-unit.spec.ts` | `UN` | 01–05 | CRUD |
| `029-business-type.spec.ts` | `BT` | 01–05 | CRUD |
| `030-extra-cost.spec.ts` | `EC` | 01–05 | CRUD |
| `031-adjustment-type.spec.ts` | `AT` | 01–05 | CRUD |
| `032-credit-term.spec.ts` | `CT` | 01–05 | CRUD |
| `040-currency.spec.ts` | `CUR` | 01–05 | CRUD |
| `041-exchange-rate.spec.ts` | `ER` | 01–02 | List/Detail |
| `042-tax-profile.spec.ts` | `TP` | 01–05 | CRUD |
| `079-delivery-point.spec.ts` | `DP` | 01–05, 10–19 | CRUD + security |
| `080-location.spec.ts` | `LOC` | 01–05 | CRUD |
| `101-product-category.spec.ts` | `CAT` | 01 (CATEG-collapsed), 02 (PRODU-collapsed), 03 (RECIP-collapsed) | Multi-prefix collapse |
| `150-vendor.spec.ts` | `VEN` | 01–05, 10–19 | CRUD + security |
| `159-price-list.spec.ts` | `PL` | 01–05 | CRUD |
| `160-price-list-template.spec.ts` | `PT` | 01–05 | CRUD |
| `201-my-approvals.spec.ts` | `MA` | 01 (MY-collapsed), 02 (APPR-collapsed) | Multi-prefix collapse |
| `301-purchase-request.spec.ts` | `PR` | 01–04, 10–19, 20–29 | Module entry point |
| `302-pr-creator-journey.spec.ts` | `PR` | 05 | Sub-journey |
| `303-pr-approver-journey.spec.ts` | `PR` | 06 | Sub-journey |
| `304-pr-purchaser-journey.spec.ts` | `PR` | 07 | Sub-journey |
| `310-purchase-request-template.spec.ts` | `PRT` | 01–05 (TPL-collapsed into 02) | Multi-prefix collapse |
| `311-pr-returned-flow.spec.ts` | `PR` | 08 | Sub-journey |
| `401-purchase-order.spec.ts` | `PO` | 01–04, 10–19, 20–29 | Module entry point |
| `402-po-purchaser-journey.spec.ts` | `PO` | 06 | Sub-journey |
| `403-po-approver-journey.spec.ts` | `PO` | 07 | Sub-journey |
| `501-good-received-note.spec.ts` | `GRN` | 01–05, 10–19 | CRUD + security |
| `601-credit-note.spec.ts` | `CN` | 01–05, 10–19 | CRUD + security |
| `602-credit-note-reason.spec.ts` | `CNR` | 01–05 | CRUD |
| `701-store-requisition.spec.ts` | `SR` | 01–05, 10–19 | CRUD + security |
| `720-stock-issue.spec.ts` | `SI` | 01–05, 10–19 | CRUD + security |
| `900-period-end.spec.ts` | `PE` | 01–05 | CRUD |
| `1001-campaign.spec.ts` | `CAM` | 01–05 (RP-collapsed into 04) | Multi-prefix collapse |

## Adding a new module

1. Pick a unique 2–5 letter prefix not already in the table.
2. Add the row above with the section blocks you intend to use.
3. Commit the catalog change with the spec that introduces the prefix.
4. The audit script reads this table; an unknown prefix or unregistered section will fail CI.

## Adding a section to an existing module

1. Edit the row's "Sections used" column.
2. Commit alongside the new tests.
````

- [ ] **Step 2: Commit**

```bash
git add docs/test-id-scheme.md
git commit -m "docs(test-ids): add section catalog for v2 scheme"
```

---

### Task 2: Update reporter regex to transition mode

**Files:**
- Modify: `tests/reporters/tc-json-reporter.ts:60`

- [ ] **Step 1: Replace the regex**

Edit `tests/reporters/tc-json-reporter.ts:60`:

```typescript
// Before:
const TC_REGEX = /\b(TCS?-[A-Z]{0,4}\d{2,})\b/g;

// After (transition — accepts both legacy and new format):
const TC_REGEX = /\b(TC-[A-Z]{2,5}-\d{6}|TCS?-[A-Z]{0,4}\d{2,})\b/g;
```

- [ ] **Step 2: Run the existing test suite to confirm no regression**

Run: `bun test -- 020-unit.spec.ts`
Expected: PASS — JSON results still produced for legacy IDs (the 4 `TC-UN*` entries).

- [ ] **Step 3: Verify the JSON output keeps legacy IDs**

Run: `cat tests/results/020-unit-results.json | python3 -c "import json,sys; print({r['testId'] for r in json.load(sys.stdin)})"`
Expected: prints the `TC-UN00101..04` set — legacy IDs still recognised.

- [ ] **Step 4: Commit**

```bash
git add tests/reporters/tc-json-reporter.ts
git commit -m "feat(reporter): accept both legacy and v2 TC ID formats during transition"
```

---

### Task 3: Build the audit script — failing test first

**Files:**
- Create: `scripts/__tests__/audit-tc-ids.test.ts`
- Create: `scripts/__tests__/fixtures/audit-good.spec.ts`
- Create: `scripts/__tests__/fixtures/audit-bad-format.spec.ts`
- Create: `scripts/__tests__/fixtures/audit-multi-prefix.spec.ts`

- [ ] **Step 1: Add Vitest dependency**

```bash
bun add -d vitest
```

- [ ] **Step 2: Create fixture: a "good" spec**

Create `scripts/__tests__/fixtures/audit-good.spec.ts`:

```typescript
import { test } from "@playwright/test";

test("TC-UN-010001 list units", async () => {});
test("TC-UN-010002 filter units", async () => {});
test("TC-UN-030001 create unit", async () => {});
```

- [ ] **Step 3: Create fixture: bad format**

Create `scripts/__tests__/fixtures/audit-bad-format.spec.ts`:

```typescript
import { test } from "@playwright/test";

test("TC-UN001 legacy 3-digit", async () => {});
test("TC-UNIT-AB0001 non-numeric section", async () => {});
test("TC-XX-010001 unknown prefix", async () => {});
```

- [ ] **Step 4: Create fixture: multi-prefix**

Create `scripts/__tests__/fixtures/audit-multi-prefix.spec.ts`:

```typescript
import { test } from "@playwright/test";

test("TC-UN-010001 first prefix", async () => {});
test("TC-DEP-010001 second prefix", async () => {});
```

- [ ] **Step 5: Write failing tests**

Create `scripts/__tests__/audit-tc-ids.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { auditFile } from "../audit-tc-ids";

const FIXTURES = "scripts/__tests__/fixtures";

describe("audit-tc-ids", () => {
  it("passes a well-formed spec", async () => {
    const result = await auditFile(`${FIXTURES}/audit-good.spec.ts`);
    expect(result.errors).toEqual([]);
  });

  it("rejects 3-digit legacy format in strict mode", async () => {
    const result = await auditFile(`${FIXTURES}/audit-bad-format.spec.ts`);
    expect(result.errors.some((e) => e.code === "FORMAT")).toBe(true);
  });

  it("rejects unknown prefix", async () => {
    const result = await auditFile(`${FIXTURES}/audit-bad-format.spec.ts`);
    expect(result.errors.some((e) => e.code === "UNKNOWN_PREFIX")).toBe(true);
  });

  it("rejects multiple prefixes in one spec", async () => {
    const result = await auditFile(`${FIXTURES}/audit-multi-prefix.spec.ts`);
    expect(result.errors.some((e) => e.code === "MULTI_PREFIX")).toBe(true);
  });
});
```

- [ ] **Step 6: Run the test — must fail**

Run: `bunx vitest run scripts/__tests__/audit-tc-ids.test.ts`
Expected: FAIL with "Cannot find module '../audit-tc-ids'".

- [ ] **Step 7: Implement the audit script**

Create `scripts/audit-tc-ids.ts`:

```typescript
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
```

- [ ] **Step 8: Run the test — must pass**

Run: `bunx vitest run scripts/__tests__/audit-tc-ids.test.ts`
Expected: PASS, 4/4 tests.

- [ ] **Step 9: Wire up package.json**

Edit `package.json` `"scripts"`:

```json
"audit:tc-ids": "bun run scripts/audit-tc-ids.ts",
"audit:tc-ids:legacy": "bun run scripts/audit-tc-ids.ts --legacy-mode"
```

- [ ] **Step 10: Run audit in legacy mode against the real repo**

Run: `bun audit:tc-ids:legacy`
Expected: passes with errors only on unknown prefixes (since none of the legacy IDs match the strict regex they will be ignored in legacy mode; the catalog includes all canonical prefixes). If errors fire on a prefix not in the catalog, fix the catalog row.

- [ ] **Step 11: Commit**

```bash
git add scripts/audit-tc-ids.ts scripts/__tests__ package.json
git commit -m "feat(audit): add TC ID audit script with catalog parsing and fixture tests"
```

---

## Phase 1 — Migration Map Generation

### Task 4: Build `propose.ts` — failing tests first

**Files:**
- Create: `scripts/migrate-tc-ids/propose.ts`
- Create: `scripts/migrate-tc-ids/__tests__/propose.test.ts`

- [ ] **Step 1: Write failing tests**

Create `scripts/migrate-tc-ids/__tests__/propose.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { proposeMapping } from "../propose";

describe("proposeMapping", () => {
  it("decodes 5-digit legacy SSNNN", () => {
    expect(proposeMapping("TC-PR00101", "PR", "PR")).toEqual({
      old: "TC-PR00101",
      new: "TC-PR-010001",
      rule: "5-digit:section=001->01,seq=01->0001",
      needsReview: false,
      helperGenerated: false,
      note: "",
    });
  });

  it("decodes 4-digit legacy SSNN for sub-journey prefixes", () => {
    expect(proposeMapping("TC-POA0301", "POA", "PO", { POA: { "03": "07" } })).toEqual({
      old: "TC-POA0301",
      new: "TC-PO-070001",
      rule: "4-digit:prefix-collapse(POA->PO),section=03->07,seq=01->0001",
      needsReview: false,
      helperGenerated: false,
      note: "",
    });
  });

  it("flags 3-digit legacy as needsReview", () => {
    const out = proposeMapping("TC-CAM001", "CAM", "CAM");
    expect(out.new).toBe("TC-CAM-900001");
    expect(out.needsReview).toBe(true);
    expect(out.note).toMatch(/assign correct section/i);
  });

  it("collapses non-canonical prefix into a section", () => {
    expect(proposeMapping("TC-CATEG12345", "CATEG", "CAT", { CATEG: { "default": "01" } })).toEqual({
      old: "TC-CATEG12345",
      new: "TC-CAT-010001",
      rule: "5-digit:prefix-collapse(CATEG->CAT),section=default->01,seq=12345->0001",
      needsReview: true,
      helperGenerated: false,
      note: "Reviewer: confirm sequence reassignment from 12345",
    });
  });
});
```

- [ ] **Step 2: Run tests — must fail**

Run: `bunx vitest run scripts/migrate-tc-ids/__tests__/propose.test.ts`
Expected: FAIL with "Cannot find module '../propose'".

- [ ] **Step 3: Implement `propose.ts`**

Create `scripts/migrate-tc-ids/propose.ts`:

```typescript
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

export interface MapEntry {
  old: string;
  new: string;
  rule: string;
  needsReview: boolean;
  helperGenerated: boolean;
  note: string;
}

export interface MigrationMap {
  version: 1;
  generatedAt: string;
  modules: Record<string, { specFile: string; newPrefix: string; entries: MapEntry[] }>;
}

type SectionMap = Record<string, Record<string, string>>;
// Per-spec: { oldPrefix: { oldSection (or "default"): newSection } }

export const SPEC_CONFIG: Array<{
  specFile: string;
  newPrefix: string;
  oldPrefixes: string[];
  sectionMap: SectionMap;
}> = [
  { specFile: "tests/001-login.spec.ts", newPrefix: "LOGIN", oldPrefixes: ["L"], sectionMap: { L: { "001": "01", "002": "10" } } },
  { specFile: "tests/010-department.spec.ts", newPrefix: "DEP", oldPrefixes: ["DEP"], sectionMap: { DEP: { "001": "01", "002": "02", "003": "03", "004": "04", "005": "05" } } },
  // ... full table populated for all 33 specs (see docs/test-id-scheme.md)
  { specFile: "tests/302-pr-creator-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRC"], sectionMap: { PRC: { "01": "05", "02": "05", "03": "05" } } },
  { specFile: "tests/303-pr-approver-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRA"], sectionMap: { PRA: { "01": "06", "02": "06", "03": "06" } } },
  { specFile: "tests/304-pr-purchaser-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRP"], sectionMap: { PRP: { "01": "07", "02": "07", "03": "07" } } },
  { specFile: "tests/311-pr-returned-flow.spec.ts", newPrefix: "PR", oldPrefixes: ["PRC"], sectionMap: { PRC: { "default": "08" } } },
  { specFile: "tests/101-product-category.spec.ts", newPrefix: "CAT", oldPrefixes: ["CAT", "CATEG", "PRODU", "RECIP"], sectionMap: {
      CAT: { "001": "01", "002": "02", "003": "03", "004": "04", "005": "05" },
      CATEG: { default: "01" },
      PRODU: { default: "02" },
      RECIP: { default: "03" },
    } },
  // ... etc — populate the full list
];

export function proposeMapping(
  oldId: string,
  oldPrefix: string,
  newPrefix: string,
  sectionMap?: SectionMap,
): MapEntry {
  const collapsed = oldPrefix !== newPrefix;
  const trail = oldId.slice(`TC-${oldPrefix}`.length);
  const digits = trail.replace(/^-/, "");

  // Helper-generated security tests live in TC-XX001 09–12 by convention; mark them.
  const helperGenerated = /(09|10|11|12)$/.test(digits) && digits.length === 5 && digits.startsWith("001");

  const lookup = (section: string) => sectionMap?.[oldPrefix]?.[section] ?? sectionMap?.[oldPrefix]?.default;

  if (digits.length === 5) {
    const trySectionOld = digits.slice(0, 3);
    const trySeqOld = digits.slice(3);

    // Three cases:
    //   A) Explicit mapping: sectionMap[oldPrefix][trySectionOld] is defined
    //      → split as 3+2; section = mapped value; seq = parsed last-2 digits
    //   B) Default fallback: only sectionMap[oldPrefix]["default"] is defined
    //      → keep whole digit string as old seq; new seq resets to 0001 (reviewer reassigns)
    //   C) No mapping at all: derive section by stripping leading zeros
    const explicit = sectionMap?.[oldPrefix]?.[trySectionOld];
    const defaultOnly = explicit === undefined ? sectionMap?.[oldPrefix]?.["default"] : undefined;

    let sectionOld: string;
    let seqOldStr: string;
    let sectionNew: string;
    let seqNew: string;
    let needsReview: boolean;
    let note: string;

    if (explicit !== undefined) {
      sectionOld = trySectionOld;
      seqOldStr = trySeqOld;
      sectionNew = explicit;
      seqNew = String(parseInt(trySeqOld, 10)).padStart(4, "0");
      needsReview = false;
      note = "";
    } else if (defaultOnly !== undefined) {
      sectionOld = "default";
      seqOldStr = digits;
      sectionNew = defaultOnly;
      seqNew = "0001";
      needsReview = true;
      note = `Reviewer: confirm sequence reassignment from ${digits}`;
    } else {
      sectionOld = trySectionOld;
      seqOldStr = trySeqOld;
      sectionNew = String(parseInt(trySectionOld, 10)).padStart(2, "0");
      seqNew = String(parseInt(trySeqOld, 10)).padStart(4, "0");
      needsReview = false;
      note = "";
    }

    const rule = collapsed
      ? `5-digit:prefix-collapse(${oldPrefix}->${newPrefix}),section=${sectionOld}->${sectionNew},seq=${seqOldStr}->${seqNew}`
      : `5-digit:section=${sectionOld}->${sectionNew},seq=${seqOldStr}->${seqNew}`;
    return {
      old: oldId,
      new: `TC-${newPrefix}-${sectionNew}${seqNew}`,
      rule,
      needsReview,
      helperGenerated,
      note,
    };
  }

  if (digits.length === 4) {
    const sectionOld = digits.slice(0, 2);
    const seqOld = digits.slice(2);
    const sectionNew = lookup(sectionOld) ?? lookup("default") ?? "90";
    const seqNew = seqOld.padStart(4, "0");
    return {
      old: oldId,
      new: `TC-${newPrefix}-${sectionNew}${seqNew}`,
      rule: `4-digit:prefix-collapse(${oldPrefix}->${newPrefix}),section=${sectionOld}->${sectionNew},seq=${seqOld}->${seqNew}`,
      needsReview: false,
      helperGenerated: false,
      note: "",
    };
  }

  if (digits.length === 3) {
    const seqNew = digits.padStart(4, "0");
    return {
      old: oldId,
      new: `TC-${newPrefix}-90${seqNew}`,
      rule: `3-digit:no-section->placeholder,seq=${digits}->${seqNew}`,
      needsReview: true,
      helperGenerated: false,
      note: "Reviewer: assign correct section block",
    };
  }

  return {
    old: oldId,
    new: `TC-${newPrefix}-99${digits.slice(-4).padStart(4, "0")}`,
    rule: `unknown-length(${digits.length}):placeholder`,
    needsReview: true,
    helperGenerated: false,
    note: "Reviewer: unrecognised digit length",
  };
}

export function buildMap(): MigrationMap {
  const modules: MigrationMap["modules"] = {};
  const TC_RE = /\bTC-?[A-Z]{1,5}-?\d{2,}\b/g;
  for (const cfg of SPEC_CONFIG) {
    const src = readFileSync(resolve(process.cwd(), cfg.specFile), "utf8");
    const ids = Array.from(new Set(src.match(TC_RE) ?? []));
    const entries = ids.map((oldId) => {
      const matched = cfg.oldPrefixes.find((p) => oldId.startsWith(`TC-${p}`));
      if (!matched) return null;
      return proposeMapping(oldId, matched, cfg.newPrefix, cfg.sectionMap);
    }).filter((e): e is MapEntry => e !== null);
    modules[cfg.newPrefix] ??= { specFile: cfg.specFile, newPrefix: cfg.newPrefix, entries: [] };
    modules[cfg.newPrefix].entries.push(...entries);
  }
  return { version: 1, generatedAt: new Date().toISOString(), modules };
}

if (import.meta.main) {
  const map = buildMap();
  const outPath = resolve(process.cwd(), "docs/migration/test-id-migration-map.json");
  writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n", "utf8");
  console.log(`[propose] Wrote migration map → ${outPath}`);
}
```

- [ ] **Step 4: Run unit tests — must pass**

Run: `bunx vitest run scripts/migrate-tc-ids/__tests__/propose.test.ts`
Expected: PASS, 4/4.

- [ ] **Step 5: Wire up package.json**

```json
"migrate:tc-propose": "bun run scripts/migrate-tc-ids/propose.ts"
```

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-tc-ids/propose.ts scripts/migrate-tc-ids/__tests__ package.json
git commit -m "feat(migrate): add TC ID migration map proposer with rule tests"
```

---

### Task 5: Generate the initial migration map

**Files:**
- Create: `docs/migration/test-id-migration-map.json`

- [ ] **Step 1: Populate `SPEC_CONFIG` for all 33 specs**

Edit `scripts/migrate-tc-ids/propose.ts` and fill in entries for all 33 specs. Each entry:
- `specFile`: relative path
- `newPrefix`: from catalog table
- `oldPrefixes`: distinct prefixes used in that spec (run `grep -hoE 'TC-[A-Z]{1,5}' tests/<file>.spec.ts | sort -u` to discover)
- `sectionMap`: per-old-prefix mapping of legacy section → new section (consult catalog)

For specs where the section semantics are uncertain (3-digit legacy IDs), it is OK to leave `sectionMap` minimal; the proposer will mark them `needsReview: true` and the reviewer assigns the right block.

- [ ] **Step 2: Run propose**

```bash
mkdir -p docs/migration
bun migrate:tc-propose
```

Expected output: `[propose] Wrote migration map → docs/migration/test-id-migration-map.json`.

- [ ] **Step 3: Sanity-check the map**

```bash
python3 -c "
import json
m = json.load(open('docs/migration/test-id-migration-map.json'))
total = sum(len(mod['entries']) for mod in m['modules'].values())
review = sum(sum(1 for e in mod['entries'] if e['needsReview']) for mod in m['modules'].values())
print(f'Total: {total} entries, needsReview: {review}, modules: {len(m[\"modules\"])}')
"
```

Expected: `Total: ~1357 entries, needsReview: <some>, modules: ~30`.

- [ ] **Step 4: Commit the initial map (before review PRs)**

```bash
git add docs/migration/test-id-migration-map.json scripts/migrate-tc-ids/propose.ts
git commit -m "chore(migrate): generate initial TC ID migration map (pre-review)"
```

- [ ] **Step 5: Open per-module review PRs**

For each module, open a PR titled `migrate(<MODULE>): review TC ID mapping` that:
1. Edits `docs/migration/test-id-migration-map.json` only — fixing `needsReview: true` entries for that module.
2. Sets `needsReview: false` after assigning a correct section block.
3. Adds notes for any deprecated tests.

Merge each PR after review. Repeat until **zero entries** remain with `needsReview: true`.

---

## Phase 2 — Apply Tooling

### Task 6: Build `apply.ts` — failing test first

**Files:**
- Create: `scripts/migrate-tc-ids/apply.ts`
- Create: `scripts/migrate-tc-ids/__tests__/apply.test.ts`
- Create: `scripts/migrate-tc-ids/__tests__/fixtures/before.spec.ts`

- [ ] **Step 1: Create fixture spec to be renamed**

Create `scripts/migrate-tc-ids/__tests__/fixtures/before.spec.ts`:

```typescript
import { test } from "@playwright/test";

test("TC-UN00101 list units", async () => {});
test("TC-UN00301 create unit", async () => {});
```

- [ ] **Step 2: Write failing test**

Create `scripts/migrate-tc-ids/__tests__/apply.test.ts`:

```typescript
import { copyFileSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { applyToFile } from "../apply";

describe("applyToFile", () => {
  it("renames TC IDs in a spec according to a map", async () => {
    const dir = mkdtempSync(join(tmpdir(), "apply-test-"));
    const target = join(dir, "before.spec.ts");
    copyFileSync("scripts/migrate-tc-ids/__tests__/fixtures/before.spec.ts", target);

    const map = [
      { old: "TC-UN00101", new: "TC-UN-010001" },
      { old: "TC-UN00301", new: "TC-UN-030001" },
    ];
    await applyToFile(target, map);

    const after = readFileSync(target, "utf8");
    expect(after).toContain("TC-UN-010001 list units");
    expect(after).toContain("TC-UN-030001 create unit");
    expect(after).not.toContain("TC-UN00101");
    expect(after).not.toContain("TC-UN00301");
  });
});
```

- [ ] **Step 3: Run test — must fail**

Run: `bunx vitest run scripts/migrate-tc-ids/__tests__/apply.test.ts`
Expected: FAIL with "Cannot find module '../apply'".

- [ ] **Step 4: Implement `apply.ts`**

Create `scripts/migrate-tc-ids/apply.ts`:

```typescript
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MigrationMap, MapEntry } from "./propose";

export async function applyToFile(file: string, entries: Pick<MapEntry, "old" | "new">[]): Promise<void> {
  let src = readFileSync(file, "utf8");
  // Sort longest old IDs first to avoid prefix overshadowing (e.g. TC-PR00101 should
  // replace before TC-PR001 if both happen to exist).
  const sorted = [...entries].sort((a, b) => b.old.length - a.old.length);
  for (const e of sorted) {
    const re = new RegExp(`\\b${e.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    src = src.replace(re, e.new);
  }
  writeFileSync(file, src, "utf8");
}

export async function applyModule(modulePrefix: string, mapPath = "docs/migration/test-id-migration-map.json"): Promise<{ specFile: string; renamed: number }> {
  const map: MigrationMap = JSON.parse(readFileSync(resolve(process.cwd(), mapPath), "utf8"));
  const mod = map.modules[modulePrefix];
  if (!mod) throw new Error(`Module ${modulePrefix} not in migration map`);
  await applyToFile(resolve(process.cwd(), mod.specFile), mod.entries);
  return { specFile: mod.specFile, renamed: mod.entries.length };
}

if (import.meta.main) {
  const moduleFlag = process.argv.indexOf("--module");
  if (moduleFlag === -1 || !process.argv[moduleFlag + 1]) {
    console.error("Usage: bun migrate:tc-apply --module <PREFIX>");
    process.exit(2);
  }
  const prefix = process.argv[moduleFlag + 1];
  applyModule(prefix).then(({ specFile, renamed }) => {
    console.log(`[apply] ${specFile}: ${renamed} IDs renamed`);
  });
}
```

- [ ] **Step 5: Run test — must pass**

Run: `bunx vitest run scripts/migrate-tc-ids/__tests__/apply.test.ts`
Expected: PASS.

- [ ] **Step 6: Wire up package.json**

```json
"migrate:tc-apply": "bun run scripts/migrate-tc-ids/apply.ts"
```

- [ ] **Step 7: Commit**

```bash
git add scripts/migrate-tc-ids/apply.ts scripts/migrate-tc-ids/__tests__ package.json
git commit -m "feat(migrate): add TC ID rename applier with fixture test"
```

---

### Task 7: Update the security-cases helper to emit new format

**Files:**
- Modify: `tests/helpers/security-cases.ts:159`

- [ ] **Step 1: Read the current helper**

Run: `grep -nE 'TC-|firstTcNumber|sequenceStart' tests/helpers/security-cases.ts`

The helper takes an offset that determines the security TCs (e.g. `TC-XX00109..12`). The new scheme places security tests in section block `10`, sequence `0001..0004` by convention.

- [ ] **Step 2: Update the helper signature**

Edit `tests/helpers/security-cases.ts` so the helper accepts a `prefix` and emits IDs in the new format:

```typescript
// Replace the existing options that took a numeric offset:
export interface SecurityCasesOptions {
  prefix: string;            // e.g. "VEN", "PR", "CN"
  sectionBlock?: string;     // default "10" (Security)
  sequenceStart?: number;    // default 1, => 0001
  skipAuthorization?: boolean;
  // ... existing fields
}

export function buildSecurityTC(prefix: string, sectionBlock: string, seq: number): string {
  return `TC-${prefix}-${sectionBlock}${String(seq).padStart(4, "0")}`;
}
```

Wherever the helper currently builds the legacy IDs (`TC-${prefix}001${pad2(offset+i)}`), replace with `buildSecurityTC(prefix, sectionBlock, sequenceStart + i)`.

- [ ] **Step 3: Update call sites**

Find every consumer:

```bash
grep -nE 'security-cases|securityCases|registerSecurityCases' tests/*.spec.ts
```

For each consumer, replace the old offset arg with `{ prefix, sectionBlock: "10", sequenceStart: 1 }` (or whatever block the catalog assigns).

- [ ] **Step 4: Audit in legacy mode**

Run: `bun audit:tc-ids:legacy`
Expected: no MULTI_PREFIX or UNKNOWN_PREFIX errors caused by helper-generated IDs.

- [ ] **Step 5: Run a small affected spec to verify**

Run: `bun test -- tests/079-delivery-point.spec.ts -g "TC-DP-1"`
Expected: PASS — security tests still execute under their new IDs.

- [ ] **Step 6: Commit**

```bash
git add tests/helpers/security-cases.ts tests/*.spec.ts
git commit -m "feat(helpers): emit v2 TC IDs from security-cases helper"
```

---

### Task 8: Update `generate-user-stories.ts` regex

**Files:**
- Modify: `scripts/generate-user-stories.ts`

- [ ] **Step 1: Locate hardcoded TC patterns**

Run: `grep -nE 'TC-|TCS\\?-' scripts/generate-user-stories.ts`

- [ ] **Step 2: Update the regex to accept both formats**

For each match, replace the regex with:

```typescript
const TC_REGEX = /\b(TC-[A-Z]{2,5}-\d{6}|TCS?-[A-Z]{0,4}\d{2,})\b/g;
```

- [ ] **Step 3: Regenerate user-stories docs**

```bash
bun docs:user-stories
```

Expected: 33 markdown files updated under `docs/user-stories/`. Run `git diff docs/user-stories/` and confirm only TC ID changes (no content drift).

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-user-stories.ts docs/user-stories/
git commit -m "feat(docs): accept both legacy and v2 TC IDs in user-story generator"
```

---

## Phase 3 — Per-module Code Migration

### Task 9: Pilot migration on smallest module

**Files:**
- Modify: `tests/041-exchange-rate.spec.ts`
- Modify: `docs/user-stories/041-exchange-rate.md`

- [ ] **Step 1: Start a branch**

```bash
git checkout -b migrate/tc-ids-ER
```

- [ ] **Step 2: Apply rename**

```bash
bun migrate:tc-apply --module ER
```

Expected: `[apply] tests/041-exchange-rate.spec.ts: 2 IDs renamed`.

- [ ] **Step 3: Regenerate user-story doc**

```bash
bun docs:user-stories
```

- [ ] **Step 4: Audit (legacy mode — other modules still legacy)**

```bash
bun audit:tc-ids:legacy
```

Expected: 0 errors. If any UNKNOWN_SECTION fires for ER, fix the catalog or the migration map.

- [ ] **Step 5: Run the spec**

```bash
bun test -- 041-exchange-rate.spec.ts
```

Expected: 2/2 PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/041-exchange-rate.spec.ts docs/user-stories/041-exchange-rate.md
git commit -m "migrate(ER): rename TC IDs to v2 scheme"
```

- [ ] **Step 7: Merge or keep open per workflow**

Either fast-merge to main or leave the branch open until all modules are done. Either is acceptable since each migration commit is independent.

---

### Task 10: Migrate the remaining 32 modules

This task is mechanical — repeat Task 9 for each module. Order from smallest to largest. **Each box below is one full Task-9 cycle (branch → apply → docs → audit → test → commit).**

- [ ] **Step 1: 020-unit (4 tests, prefix UN)**
- [ ] **Step 2: 010-department (12 tests, prefix DEP)**
- [ ] **Step 3: 029-business-type (12 tests, prefix BT)**
- [ ] **Step 4: 030-extra-cost (12 tests, prefix EC)**
- [ ] **Step 5: 031-adjustment-type (16 tests, prefix AT)**
- [ ] **Step 6: 032-credit-term (12 tests, prefix CT)**
- [ ] **Step 7: 040-currency (12 tests, prefix CUR)**
- [ ] **Step 8: 042-tax-profile (12 tests, prefix TP)**
- [ ] **Step 9: 080-location (14 tests, prefix LOC)**
- [ ] **Step 10: 602-credit-note-reason (12 tests, prefix CNR)**
- [ ] **Step 11: 201-my-approvals (25 tests, prefix MA)**
- [ ] **Step 12: 720-stock-issue (31 tests, prefix SI)**
- [ ] **Step 13: 160-price-list-template (32 tests, prefix PT)**
- [ ] **Step 14: 150-vendor (34 tests, prefix VEN)**
- [ ] **Step 15: 159-price-list (35 tests, prefix PL)**
- [ ] **Step 16: 403-po-approver-journey (20 tests, prefix PO)**
- [ ] **Step 17: 402-po-purchaser-journey (35 tests, prefix PO)**
- [ ] **Step 18: 303-pr-approver-journey (28 tests, prefix PR)**
- [ ] **Step 19: 304-pr-purchaser-journey (26 tests, prefix PR)**
- [ ] **Step 20: 311-pr-returned-flow (12 tests, prefix PR)**
- [ ] **Step 21: 302-pr-creator-journey (48 tests, prefix PR)**
- [ ] **Step 22: 900-period-end (41 tests, prefix PE)**
- [ ] **Step 23: 1001-campaign (54 tests, prefix CAM)**
- [ ] **Step 24: 079-delivery-point (56 tests, prefix DP)**
- [ ] **Step 25: 701-store-requisition (59 tests, prefix SR)**
- [ ] **Step 26: 401-purchase-order (70 tests, prefix PO)**
- [ ] **Step 27: 310-purchase-request-template (74 tests, prefix PRT)**
- [ ] **Step 28: 501-good-received-note (94 tests, prefix GRN)**
- [ ] **Step 29: 101-product-category (96 tests, prefix CAT)**
- [ ] **Step 30: 601-credit-note (136 tests, prefix CN)**
- [ ] **Step 31: 301-purchase-request (160 tests, prefix PR)**
- [ ] **Step 32: 001-login (44 tests, prefix LOGIN)**

For each, run:

```bash
git checkout -b migrate/tc-ids-<PREFIX>
bun migrate:tc-apply --module <PREFIX>
bun docs:user-stories
bun audit:tc-ids:legacy
bun test -- <NNN>-<module>.spec.ts
git add tests/<NNN>-<module>.spec.ts docs/user-stories/<NNN>-<module>.md
git commit -m "migrate(<PREFIX>): rename TC IDs to v2 scheme"
```

If any spec uses `tests/helpers/security-cases.ts`, also `git add tests/helpers/security-cases.ts` if its emitted IDs changed for that module.

---

## Phase 4 — Sheet Sync

### Task 11: Build `sync-sheet.ts` with dry-run

**Files:**
- Create: `scripts/migrate-tc-ids/sync-sheet.ts`

- [ ] **Step 1: Implement script**

Create `scripts/migrate-tc-ids/sync-sheet.ts`:

```typescript
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import type { MigrationMap } from "./propose";

const TAB_FOR_PREFIX: Record<string, string> = {
  // Mirror SYNC_TARGETS in scripts/sync-test-results.ts
  LOGIN: "Login",
  DEP: "Department",
  UN: "Unit",
  // ... fill all 33
};

async function authClient(): Promise<JWT> {
  const keyPath = process.env.GOOGLE_SHEETS_SA_KEY_PATH;
  if (!keyPath) throw new Error("GOOGLE_SHEETS_SA_KEY_PATH not set");
  const key = JSON.parse(readFileSync(keyPath, "utf8"));
  return new JWT({ email: key.client_email, key: key.private_key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
}

async function backupTab(sheets: any, spreadsheetId: string, tabName: string): Promise<string> {
  const stamp = new Date().toISOString().slice(0, 10);
  const newTabName = `${tabName}_pre_migration_${stamp}`;
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find((s: any) => s.properties.title === tabName);
  if (!sheet) throw new Error(`Tab "${tabName}" not found`);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ duplicateSheet: { sourceSheetId: sheet.properties.sheetId, newSheetName: newTabName } }],
    },
  });
  return newTabName;
}

export async function syncModule(modulePrefix: string, opts: { dryRun?: boolean } = {}): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID not set");

  const map: MigrationMap = JSON.parse(readFileSync(resolve(process.cwd(), "docs/migration/test-id-migration-map.json"), "utf8"));
  const mod = map.modules[modulePrefix];
  if (!mod) throw new Error(`Module ${modulePrefix} not in migration map`);

  const tabName = TAB_FOR_PREFIX[modulePrefix];
  if (!tabName) throw new Error(`No sheet tab mapped for prefix ${modulePrefix}`);

  const auth = await authClient();
  const sheets = google.sheets({ version: "v4", auth });

  if (opts.dryRun) {
    console.log(`[dry-run] Would back up tab "${tabName}" and update ${mod.entries.length} IDs`);
    for (const e of mod.entries) console.log(`  ${e.old}  →  ${e.new}`);
    return;
  }

  const backup = await backupTab(sheets, spreadsheetId, tabName);
  console.log(`[backup] ${tabName} → ${backup}`);

  // Read header + Test ID column
  const range = `${tabName}!A1:Z`;
  const data = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = data.data.values ?? [];
  const header = rows[0] ?? [];
  const idCol = header.indexOf("Test ID");
  if (idCol === -1) throw new Error(`No Test ID column in tab ${tabName}`);

  const updates: { range: string; values: string[][] }[] = [];
  const oldToNew = new Map(mod.entries.map((e) => [e.old, e.new]));

  for (let i = 1; i < rows.length; i++) {
    const oldId = rows[i][idCol];
    const newId = oldToNew.get(oldId);
    if (newId) {
      const a1 = colToA1(idCol);
      updates.push({ range: `${tabName}!${a1}${i + 1}`, values: [[newId]] });
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
    console.log(`[sync] Updated ${updates.length} rows in tab "${tabName}"`);
  }
}

function colToA1(col: number): string {
  let s = "";
  let n = col;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

if (import.meta.main) {
  const dryRun = process.argv.includes("--dry-run");
  const moduleFlag = process.argv.indexOf("--module");
  if (moduleFlag === -1 || !process.argv[moduleFlag + 1]) {
    console.error("Usage: bun migrate:tc-sheet --module <PREFIX> [--dry-run]");
    process.exit(2);
  }
  syncModule(process.argv[moduleFlag + 1], { dryRun });
}
```

- [ ] **Step 2: Wire up package.json**

```json
"migrate:tc-sheet": "bun run scripts/migrate-tc-ids/sync-sheet.ts"
```

- [ ] **Step 3: Smoke test in dry-run**

```bash
bun migrate:tc-sheet --module ER --dry-run
```

Expected: lists 2 ID renames, does not touch the sheet.

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-tc-ids/sync-sheet.ts package.json
git commit -m "feat(migrate): add sheet sync script with backup tab and dry-run"
```

---

### Task 12: Sync each module's sheet tab

**For each module migrated in Task 9–10:**

- [ ] **Step 1: Dry-run first**

```bash
bun migrate:tc-sheet --module <PREFIX> --dry-run
```

Verify the listed renames match `docs/migration/test-id-migration-map.json`.

- [ ] **Step 2: Apply the sheet update**

```bash
bun migrate:tc-sheet --module <PREFIX>
```

Expected: `[backup] ... [sync] Updated <N> rows in tab "<TabName>"`.

- [ ] **Step 3: Sanity sync — confirm row alignment**

```bash
bun e2e:sync
```

Expected: no warnings about missing Test IDs; updates land on existing rows (Status column reflects the latest test run, no duplicate rows).

- [ ] **Step 4: After 2 weeks, delete the backup tabs**

Manually in Google Sheets, or via a one-off script that drops every tab matching `*_pre_migration_*`.

---

## Phase 5 — Lock Down

### Task 13: Tighten audit + reporter to strict mode

**Files:**
- Modify: `scripts/audit-tc-ids.ts`
- Modify: `tests/reporters/tc-json-reporter.ts:60`

- [ ] **Step 1: Remove `--legacy-mode` from audit usage docs**

Edit `package.json` — remove the `audit:tc-ids:legacy` entry.

- [ ] **Step 2: Tighten the reporter regex**

Edit `tests/reporters/tc-json-reporter.ts:60`:

```typescript
const TC_REGEX = /\bTC-[A-Z]{2,5}-\d{6}\b/g;
```

- [ ] **Step 3: Run strict audit on the whole repo**

```bash
bun audit:tc-ids
```

Expected: `[OK] 33 specs scanned, 1357 IDs, 0 errors`. Any error means a module migration in Phase 3 was incomplete.

- [ ] **Step 4: Run full test suite**

```bash
bun test
```

Expected: green — JSON reporter still emits all rows.

- [ ] **Step 5: Commit**

```bash
git add scripts/audit-tc-ids.ts tests/reporters/tc-json-reporter.ts package.json
git commit -m "chore(audit): drop legacy-mode after migration completes"
```

---

### Task 14: Add Lefthook pre-commit hook

**Files:**
- Create: `lefthook.yml`

- [ ] **Step 1: Add Lefthook**

```bash
bun add -d lefthook
```

- [ ] **Step 2: Create config**

Create `lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  commands:
    audit-tc-ids:
      glob: "tests/**/*.spec.ts"
      run: bun audit:tc-ids
```

- [ ] **Step 3: Install hook**

```bash
bunx lefthook install
```

- [ ] **Step 4: Verify**

Make a trivial edit to a spec, `git add` it, run `git commit -m "test"`. Expect the hook to run audit. Then revert (`git reset HEAD~1` and undo the edit).

- [ ] **Step 5: Commit**

```bash
git add lefthook.yml package.json bun.lock
git commit -m "chore(hooks): add pre-commit TC ID audit via Lefthook"
```

---

### Task 15: Add CI workflow

**Files:**
- Create: `.github/workflows/tc-id-audit.yml`

- [ ] **Step 1: Create workflow**

Create `.github/workflows/tc-id-audit.yml`:

```yaml
name: TC ID Audit
on:
  pull_request:
  push:
    branches: [main]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - run: bun audit:tc-ids
```

- [ ] **Step 2: Commit and push**

```bash
git add .github/workflows/tc-id-audit.yml
git commit -m "ci: add TC ID audit workflow"
git push
```

- [ ] **Step 3: Configure branch protection (manual)**

In GitHub repo settings → Branches → main → require status check `TC ID Audit / audit` to pass before merging.

---

### Task 16: Update CLAUDE.md and finalise

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the Test IDs paragraph**

In the `## Conventions` section of `CLAUDE.md`, replace the existing Test IDs bullet:

```markdown
- **Test IDs**: format `TC-<PREFIX>-XXYYYY` (2-digit section + 4-digit seq). Strict regex `^TC-[A-Z]{2,5}-\d{6}$`. The canonical catalog of prefixes and section blocks lives in `docs/test-id-scheme.md`. To add a new module, add a row there before opening the spec PR; the audit (`bun audit:tc-ids`) and CI gate enforce that every prefix and section is registered.
```

Also add to the audit checklist (the existing for-loop block):

```bash
bun audit:tc-ids
```

— must pass before merging.

- [ ] **Step 2: Final commit**

```bash
git add CLAUDE.md
git commit -m "chore(tc-ids): complete migration to v2 scheme"
```

- [ ] **Step 3: Run the full audit + test suite one more time**

```bash
bun audit:tc-ids
bun test
```

Both green = migration complete.

---

## Self-Review Notes

- **Spec coverage**: every section of `docs/superpowers/specs/2026-05-06-test-id-scheme-design.md` has at least one task: §1 Format → Tasks 2/13, §2 Section blocks → Task 1, §3 Prefix policy → Task 1, §4 Components → all tasks, §5 Migration plan → Tasks 5–12, §6 Algorithmic rules → Task 4, §7 Audit checks → Tasks 3/13, §8 Enforcement → Tasks 14/15, §9 Test strategy → Tasks 3/4/6/11.
- **No placeholders** for new tooling. The `SPEC_CONFIG` table inside `propose.ts` is partially shown (3 of 33 entries) — Task 5 Step 1 explicitly requires the engineer to populate the rest from the catalog. This is data, not logic, and is the correct place to require human input.
- **Type consistency**: `MapEntry`, `MigrationMap`, `auditFile`, `applyToFile`, `syncModule` are referenced consistently across tasks. `buildSecurityTC(prefix, sectionBlock, seq)` is the single helper signature.
- **Open spec questions** (carried forward from §"Open questions" in the design doc): `LOGIN` vs `L` prefix, whether helper-generated tests get a synthetic `SEC` prefix, backup tab retention. The plan defaults to `LOGIN`, inheritance, and 2 weeks; if the user revises any of these before starting the implementation, edit Task 1 (catalog) and Task 7 (helper) accordingly.
