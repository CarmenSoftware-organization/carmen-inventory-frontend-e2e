import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

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

// Section-map convention used below:
//   For 5-digit legacy IDs (TC-XX SSS NN): SSS keys map to a 2-digit new section.
//   3-digit codes 001..099 strip leading zeros (001 -> "01", 023 -> "23").
//   3-digit codes 101..109 auto-derive linearly to 31..39 (Integration range).
//   3-digit codes 201..209 auto-derive linearly to 21..29 (Validation range).
//   3-digit codes 301..309 auto-derive linearly to 11..19 (Security range).
//   Codes 100/200/300 or >= 110/210/310 or >= 400 land in "90" (placeholder),
//   flagged needsReview.
//   For 4-digit sub-journey legacy IDs (TC-XXX SSNN):
//     A) Explicit sub-section key → split 2+2; seq from last 2 digits.
//     B) Default-only (no explicit keys) → preserve full 4 digits as seq to avoid collisions.
//     C) No mapping → section "90", needsReview.
export const SPEC_CONFIG: Array<{
  specFile: string;
  newPrefix: string;
  oldPrefixes: string[];
  sectionMap: SectionMap;
}> = [
  // Simple CRUD modules — one legacy section "001" → new section "01"
  { specFile: "tests/001-login.spec.ts", newPrefix: "LOGIN", oldPrefixes: ["L"], sectionMap: { L: { "001": "01" } } },
  { specFile: "tests/010-department.spec.ts", newPrefix: "DEP", oldPrefixes: ["DEP"], sectionMap: { DEP: { "001": "01" } } },
  { specFile: "tests/020-unit.spec.ts", newPrefix: "UN", oldPrefixes: ["UN"], sectionMap: { UN: { "001": "01" } } },
  { specFile: "tests/029-business-type.spec.ts", newPrefix: "BT", oldPrefixes: ["BT"], sectionMap: { BT: { "001": "01" } } },
  { specFile: "tests/030-extra-cost.spec.ts", newPrefix: "EC", oldPrefixes: ["EC"], sectionMap: { EC: { "001": "01" } } },
  { specFile: "tests/031-adjustment-type.spec.ts", newPrefix: "AT", oldPrefixes: ["AT"], sectionMap: { AT: { "001": "01" } } },
  { specFile: "tests/032-credit-term.spec.ts", newPrefix: "CT", oldPrefixes: ["CT"], sectionMap: { CT: { "001": "01" } } },
  { specFile: "tests/040-currency.spec.ts", newPrefix: "CUR", oldPrefixes: ["CUR"], sectionMap: { CUR: { "001": "01" } } },
  { specFile: "tests/041-exchange-rate.spec.ts", newPrefix: "ER", oldPrefixes: ["ER"], sectionMap: { ER: { "001": "01" } } },
  { specFile: "tests/042-tax-profile.spec.ts", newPrefix: "TP", oldPrefixes: ["TP"], sectionMap: { TP: { "001": "01" } } },
  { specFile: "tests/079-delivery-point.spec.ts", newPrefix: "DP", oldPrefixes: ["DP"], sectionMap: { DP: { "001": "01" } } },
  { specFile: "tests/080-location.spec.ts", newPrefix: "LOC", oldPrefixes: ["LOC"], sectionMap: { LOC: { "001": "01" } } },
  { specFile: "tests/150-vendor.spec.ts", newPrefix: "VEN", oldPrefixes: ["VEN"], sectionMap: { VEN: { "001": "01" } } },
  { specFile: "tests/602-credit-note-reason.spec.ts", newPrefix: "CNR", oldPrefixes: ["CNR"], sectionMap: { CNR: { "001": "01" } } },

  // Multi-section CRUD modules (sections 001..NNN; 100+ -> placeholder)
  { specFile: "tests/1001-campaign.spec.ts", newPrefix: "CAM", oldPrefixes: ["CAM"], sectionMap: { CAM: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05",
      "006": "06", "007": "07", "008": "08", "009": "09", "010": "10",
    } } },
  { specFile: "tests/159-price-list.spec.ts", newPrefix: "PL", oldPrefixes: ["PL"], sectionMap: { PL: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06", "007": "07", "008": "08",
    } } },
  { specFile: "tests/160-price-list-template.spec.ts", newPrefix: "PT", oldPrefixes: ["PT"], sectionMap: { PT: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
    } } },
  { specFile: "tests/201-my-approvals.spec.ts", newPrefix: "MA", oldPrefixes: ["MA"], sectionMap: { MA: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
    } } },
  { specFile: "tests/501-good-received-note.spec.ts", newPrefix: "GRN", oldPrefixes: ["GRN"], sectionMap: { GRN: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06", "007": "07", "008": "08", "009": "09",
      "010": "10", "011": "11", "012": "12", "013": "13", "014": "14", "015": "15", "016": "16", "017": "17", "018": "18",
    } } },
  { specFile: "tests/701-store-requisition.spec.ts", newPrefix: "SR", oldPrefixes: ["SR"], sectionMap: { SR: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
      "007": "07", "008": "08", "009": "09", "010": "10", "011": "11", "012": "12",
    } } },
  { specFile: "tests/720-stock-issue.spec.ts", newPrefix: "SI", oldPrefixes: ["SI"], sectionMap: { SI: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
    } } },

  // Modules with hundreds-codes (auto-derive handles 100-399; reviewer no longer needed for those)
  { specFile: "tests/900-period-end.spec.ts", newPrefix: "PE", oldPrefixes: ["PE"], sectionMap: { PE: {
      "001": "01", "002": "02", "003": "03", "004": "04",
    } } },
  { specFile: "tests/301-purchase-request.spec.ts", newPrefix: "PR", oldPrefixes: ["PR"], sectionMap: { PR: {
      "001": "01", "002": "02", "003": "03", "004": "04",
      "005": "05", "006": "06", "007": "07", "008": "08", "009": "09",
      "010": "10", "011": "11", "012": "12", "013": "13", "014": "14", "015": "15", "016": "16", "017": "17", "018": "18", "019": "19",
      "020": "20", "021": "21", "022": "22", "023": "23",
    } } },
  { specFile: "tests/310-purchase-request-template.spec.ts", newPrefix: "PRT", oldPrefixes: ["PRT"], sectionMap: { PRT: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
      "007": "07", "008": "08", "009": "09", "010": "10", "011": "11",
    } } },
  { specFile: "tests/401-purchase-order.spec.ts", newPrefix: "PO", oldPrefixes: ["PO"], sectionMap: { PO: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
      "020": "20",
    } } },
  { specFile: "tests/601-credit-note.spec.ts", newPrefix: "CN", oldPrefixes: ["CN"], sectionMap: { CN: {
      "001": "01", "002": "02", "003": "03", "004": "04", "005": "05", "006": "06",
      "007": "07", "008": "08", "009": "09", "010": "10", "011": "11",
    } } },

  // Multi-prefix collapse (CATEG, PRODU, RECIP all roll into CAT module)
  { specFile: "tests/101-product-category.spec.ts", newPrefix: "CAT", oldPrefixes: ["CAT", "CATEG", "PRODU", "RECIP"], sectionMap: {
      CAT: {
        "001": "01", "002": "02", "003": "03", "004": "04", "005": "05",
        "006": "06", "007": "07", "008": "08", "009": "09",
        "010": "10", "011": "11", "012": "12", "013": "13", "014": "14", "015": "15",
      },
      CATEG: { default: "01" },
      PRODU: { default: "02" },
      RECIP: { default: "03" },
    } },

  // Sub-journey collapses — default-only maps preserve full 4-digit string as seq,
  // so PRC0101 → seq 0101 and PRC0201 → seq 0201 in new section 05 (no collision)
  { specFile: "tests/302-pr-creator-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRC"], sectionMap: { PRC: { default: "05" } } },
  { specFile: "tests/303-pr-approver-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRA"], sectionMap: { PRA: { default: "06" } } },
  { specFile: "tests/304-pr-purchaser-journey.spec.ts", newPrefix: "PR", oldPrefixes: ["PRP"], sectionMap: { PRP: { default: "07" } } },
  { specFile: "tests/311-pr-returned-flow.spec.ts", newPrefix: "PR", oldPrefixes: ["PRC"], sectionMap: { PRC: { default: "08" } } },
  { specFile: "tests/402-po-purchaser-journey.spec.ts", newPrefix: "PO", oldPrefixes: ["POP"], sectionMap: { POP: { default: "06" } } },
  { specFile: "tests/403-po-approver-journey.spec.ts", newPrefix: "PO", oldPrefixes: ["POA"], sectionMap: { POA: { default: "07" } } },
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

  // helperGenerated detection was over-eager: it flagged any seq 09-12 of section
  // 001 as a security-helper ID, but those slots are also used by regular CRUD
  // tests (e.g. TC-VEN00109..112 are normal vendor tests). The actual helper-
  // generated TCs aren't in spec text — they're produced by tests/helpers/security-
  // cases.ts at runtime — so they don't appear in the migration map at all.
  // The flag is dropped; helperGenerated is always false.
  const helperGenerated = false;

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
      // Case C: no mapping at all — auto-derive section by range
      sectionOld = trySectionOld;
      seqOldStr = trySeqOld;
      seqNew = String(parseInt(trySeqOld, 10)).padStart(4, "0");
      const sectionNum = parseInt(trySectionOld, 10);
      if (sectionNum >= 1 && sectionNum <= 99) {
        sectionNew = String(sectionNum).padStart(2, "0");
        needsReview = false;
        note = "";
      } else if (sectionNum >= 101 && sectionNum <= 109) {
        // Linear: 101→31, 102→32, ..., 109→39 (Integration range, no collisions)
        sectionNew = String(30 + (sectionNum - 100)).padStart(2, "0");
        needsReview = false;
        note = "";
      } else if (sectionNum >= 201 && sectionNum <= 209) {
        // Linear: 201→21, 202→22, ..., 209→29 (Validation range)
        sectionNew = String(20 + (sectionNum - 200)).padStart(2, "0");
        needsReview = false;
        note = "";
      } else if (sectionNum >= 301 && sectionNum <= 309) {
        // Linear: 301→11, 302→12, ..., 309→19 (Security range)
        sectionNew = String(10 + (sectionNum - 300)).padStart(2, "0");
        needsReview = false;
        note = "";
      } else {
        // 100, 110+, 200, 210+, 300, 310+, or any code >= 400 — placeholder
        sectionNew = "90";
        needsReview = true;
        note = "Reviewer: section code outside auto-derive range (1xx/2xx/3xx must be 101-109/201-209/301-309)";
      }
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

    const explicit4 = sectionMap?.[oldPrefix]?.[sectionOld];
    // Default-only: sectionMap has default but no explicit entry for sectionOld
    const hasExplicitKeys = Object.keys(sectionMap?.[oldPrefix] ?? {}).some((k) => k !== "default");
    const defaultOnly4 = explicit4 === undefined && !hasExplicitKeys
      ? sectionMap?.[oldPrefix]?.["default"]
      : undefined;

    let sectionNew4: string;
    let seqNew4: string;
    let needsReview4: boolean;
    let note4: string;
    let ruleSection: string;
    let ruleSeq: string;

    if (explicit4 !== undefined) {
      // Case A: explicit sub-section mapping
      sectionNew4 = explicit4;
      seqNew4 = String(parseInt(seqOld, 10)).padStart(4, "0");
      needsReview4 = false;
      note4 = "";
      ruleSection = `${sectionOld}->${sectionNew4}`;
      ruleSeq = `${seqOld}->${seqNew4}`;
    } else if (defaultOnly4 !== undefined) {
      // Case B: default-only — preserve full 4-digit string as seq to avoid collisions
      sectionNew4 = defaultOnly4;
      seqNew4 = digits;
      needsReview4 = false;
      note4 = "";
      ruleSection = `default->${sectionNew4}`;
      ruleSeq = `${digits}->${seqNew4}`;
    } else {
      // Case C: no mapping — placeholder section, seq from last 2 digits
      sectionNew4 = "90";
      seqNew4 = seqOld.padStart(4, "0");
      needsReview4 = true;
      note4 = "Reviewer: assign correct section block";
      ruleSection = `${sectionOld}->no-section->placeholder`;
      ruleSeq = `${seqOld}->${seqNew4}`;
    }

    const rule = collapsed
      ? `4-digit:prefix-collapse(${oldPrefix}->${newPrefix}),section=${ruleSection},seq=${ruleSeq}`
      : `4-digit:section=${ruleSection},seq=${ruleSeq}`;
    return {
      old: oldId,
      new: `TC-${newPrefix}-${sectionNew4}${seqNew4}`,
      rule,
      needsReview: needsReview4,
      helperGenerated: false,
      note: note4,
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
