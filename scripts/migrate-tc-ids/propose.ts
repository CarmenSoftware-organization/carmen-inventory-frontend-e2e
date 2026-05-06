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
