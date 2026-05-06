# Test Case ID Scheme — Design Spec

**Date**: 2026-05-06
**Status**: Draft (awaiting user review)
**Owner**: Carmen Inventory Frontend E2E

## Problem

The current Test Case ID convention in `tests/*.spec.ts` is inconsistent and does not scale. Audit of 33 spec files / 1,357 TC IDs revealed:

1. **Digit length drift within the same prefix.** `PR`, `PO`, `CN`, `GRN`, `PT`, `SR`, `SI`, `PE`, `PL`, `MA`, `CAM`, `CAT`, `PRT` mix 3-digit and 5-digit IDs (e.g. `TC-PR001` alongside `TC-PR00101`). String sort produces incorrect ordering, breaking the JSON reporter `seq` field and the Google Sheets sync.
2. **Multiple prefixes inside one spec.** `101-product-category.spec.ts` uses `CAT` / `CATEG` / `PRODU` / `RECIP`. `201-my-approvals.spec.ts` uses `MA` / `MY` / `APPR`. `1001-campaign.spec.ts` uses `CAM` + `RP`. `310-purchase-request-template.spec.ts` uses `PRT` + `TPL`. The reviewer cannot tell which prefix is canonical.
3. **Prefix collision across specs.** `302-pr-creator-journey.spec.ts` and `311-pr-returned-flow.spec.ts` both use `PRC`.
4. **Reporter regex limit.** `tests/reporters/tc-json-reporter.ts:60` matches prefixes ≤ 4 letters (`/\b(TCS?-[A-Z]{0,4}\d{2,})\b/g`). Five-letter prefixes (`CATEG`, `PRODU`, `RECIP`, `APPR`) are silently truncated, producing wrong `testId` values in the JSON output and the downstream Google Sheet.
5. **No section semantics.** Some 5-digit IDs appear to encode a section (`PR00101` = section 001, item 01) but this is undocumented, so new tests cannot follow it consistently.

The result is brittle reporting, poor extensibility, and a high risk of drift each time a module is added.

## Goals

- Establish a single, machine-checkable ID format that supports current modules and future expansion.
- Make IDs sort correctly as plain strings.
- Eliminate prefix overlap between specs.
- Give every spec a documented section catalog so new tests have a clear home.
- Enforce the format with tooling so the convention does not drift again.

## Non-goals

- Restructuring the test code itself (locator strategy, fixture model, page objects).
- Replacing the Google Sheets sync transport.
- Migrating to a different reporting destination.

## Design

### 1. ID Format

```
TC-<PREFIX>-XXYYYY
```

| Component | Definition | Example |
|-----------|------------|---------|
| `TC-` | Literal | `TC-` |
| `<PREFIX>` | 2–5 uppercase letters; **exactly one prefix per module** | `PR`, `PO`, `LOGIN`, `GRN` |
| `-` | Separator (new — current scheme has no dash before digits) | `-` |
| `XX` | Section block, 2 digits, `01`–`99` | `01` |
| `YYYY` | Sequence within section, 4 digits, `0001`–`9999` | `0001` |

Examples:

- `TC-PR-010001` — Purchase Request, section 01 (List), test 0001
- `TC-PR-050015` — Purchase Request, section 05 (Creator Journey), test 0015
- `TC-LOGIN-100003` — Login, section 10 (Security), test 0003

Total capacity per module: 99 sections × 9999 tests = ~990,000 IDs.

The strict format regex is `^TC-[A-Z]{2,5}-\d{6}$`. The reporter scan regex is `/\bTC-[A-Z]{2,5}-\d{6}\b/g`, replacing the existing 4-letter-capped regex.

### 2. Section Block Convention

A **template** that every module inherits, with each module overriding or omitting blocks it does not need. The catalog (the actual blocks each module uses) lives in `docs/test-id-scheme.md`.

| Block | Purpose |
|-------|---------|
| `01` | List / Search / Filter |
| `02` | Detail / View |
| `03` | Create |
| `04` | Edit / Update |
| `05` | Delete |
| `06`–`09` | Sub-journeys (Creator / Approver / Purchaser / Returned, etc.) |
| `10`–`19` | Security / Authorization |
| `20`–`29` | Validation |
| `30`–`39` | Integration / External |
| `40`–`89` | Reserved for module-specific use |
| `90`–`99` | Edge cases / experimental / temporary |

A module is free to leave blocks empty. A module is **not** free to invent blocks outside `01`–`99`.

### 3. Prefix Policy

- One prefix per module (the spec file).
- Sub-journeys collapse onto the parent module's prefix and use a section block to disambiguate.

| Spec file | Existing prefixes | Canonical prefix | Section block strategy |
|-----------|-------------------|------------------|------------------------|
| `001-login.spec.ts` | `L` | `LOGIN` | flat |
| `101-product-category.spec.ts` | `CAT, CATEG, PRODU, RECIP` | `CAT` | `CATEG*` → 01, `PRODU*` → 02, `RECIP*` → 03 |
| `201-my-approvals.spec.ts` | `MA, MY, APPR` | `MA` | `MY*` → 01, `APPR*` → 02 |
| `301-purchase-request.spec.ts` | `PR` | `PR` | sections 01–04 (CRUD) |
| `302-pr-creator-journey.spec.ts` | `PRC` | `PR` | section 05 |
| `303-pr-approver-journey.spec.ts` | `PRA` | `PR` | section 06 |
| `304-pr-purchaser-journey.spec.ts` | `PRP` | `PR` | section 07 |
| `310-purchase-request-template.spec.ts` | `PRT, TPL` | `PRT` | `TPL*` collapsed into a section |
| `311-pr-returned-flow.spec.ts` | `PRC` | `PR` | section 08 |
| `401-purchase-order.spec.ts` | `PO` | `PO` | sections 01–04 |
| `402-po-purchaser-journey.spec.ts` | `POP` | `PO` | section 06 |
| `403-po-approver-journey.spec.ts` | `POA` | `PO` | section 07 |
| `1001-campaign.spec.ts` | `CAM, RP` | `CAM` | `RP*` collapsed into a reserved block |

(The full table for all 33 specs is the canonical artifact in `docs/test-id-scheme.md`.)

### 4. Components

#### New files

| Path | Purpose |
|------|---------|
| `docs/test-id-scheme.md` | Canonical catalog: prefix per spec, section blocks each module uses, examples |
| `docs/migration/test-id-migration-map.json` | Generated mapping (old → new) for 1,357 IDs, human-reviewed before apply |
| `scripts/migrate-tc-ids/propose.ts` | Algorithmic generator that produces the migration map |
| `scripts/migrate-tc-ids/apply.ts` | Renames IDs in spec files according to the map |
| `scripts/migrate-tc-ids/sync-sheet.ts` | Updates Google Sheet `Test ID` column in-place, with backup tab |
| `scripts/audit-tc-ids.ts` | Static checker run locally, in pre-commit, and in CI |
| `.github/workflows/tc-id-audit.yml` | CI gate running the audit on every PR |
| `lefthook.yml` (or `.husky/pre-commit`) | Pre-commit hook running the audit on staged spec files |

#### Modified files

| Path | Change |
|------|--------|
| `tests/reporters/tc-json-reporter.ts:60` | Replace regex with `/\bTC-[A-Z]{2,5}-\d{6}\b/g` |
| `tests/*.spec.ts` (33 files) | Rename TC IDs in titles per migration map |
| `docs/user-stories/*.md` (32 files) | Regenerated via `bun docs:user-stories` after spec rename |
| `tests/helpers/security-cases.ts` | Update if any TC IDs are hardcoded inside helpers |
| `scripts/generate-user-stories.ts` | Update any hardcoded TC pattern to match the new scheme |
| `package.json` | Add `audit:tc-ids`, `migrate:tc-propose`, `migrate:tc-apply`, `migrate:tc-sheet` scripts |
| `CLAUDE.md` | Replace the existing Test ID convention paragraph; link to `docs/test-id-scheme.md` |

`scripts/sync-test-results.ts` is **not** modified — it keys on the `Test ID` column, which the migration updates in place.

### 5. Migration Plan

The migration runs in four phases. Each phase is committable on its own and the repo remains green between phases.

#### Phase 0 — Foundation

1. Author `docs/test-id-scheme.md` (catalog, convention, examples).
2. Implement `scripts/audit-tc-ids.ts` with a `--legacy-mode` flag that accepts both old and new formats.
3. Update `tests/reporters/tc-json-reporter.ts:60` to a transition regex that matches both formats: `/\b(TC-[A-Z]{2,5}-\d{6}|TCS?-[A-Z]{0,4}\d{2,})\b/g`. The new strict regex (`/\bTC-[A-Z]{2,5}-\d{6}\b/g`) replaces it in Phase 4.
4. Commit. Repo behaviour is unchanged for current tests.

#### Phase 1 — Generate and review the migration map

1. Run `bun migrate:tc-propose` to produce `docs/migration/test-id-migration-map.json` from algorithmic guesses (Section 6 below).
2. Open one PR per module (~30 PRs) containing only the entries for that module. Reviewer:
   - Checks `needsReview: true` items first (3-digit IDs and ambiguous cases).
   - Edits the JSON `new` field directly to fix any wrong section / sequence assignment.
   - Sets `needsReview: false` on each entry once accepted.
3. Merge each module PR. After all 30 PRs merge, the migration map is final.

#### Phase 2 — Apply renames in code (per module)

For each module:

1. `bun migrate:tc-apply --module <PREFIX>` rewrites titles and annotations in the relevant spec, plus any helper hardcodes.
2. `bun docs:user-stories` regenerates `docs/user-stories/*.md`.
3. `bun audit:tc-ids` (strict mode for the affected module, legacy mode otherwise) must pass.
4. `bun test -- <NNN>-<module>.spec.ts` must pass — IDs change, behaviour does not.
5. Commit on a per-module branch (`migrate/tc-ids-<module>`).

Recommended order: smallest specs first (`020-unit` 4 tests, `041-exchange-rate` 2 tests, `010-department` 12 tests) to validate the toolchain, then scale up to the largest (`301-purchase-request` 160 tests, `601-credit-note` 136 tests).

#### Phase 3 — Update Google Sheet (per module, in place)

For each module:

1. `bun migrate:tc-sheet --module <PREFIX>`:
   - Duplicates the target tab as `<TabName>_pre_migration_YYYY-MM-DD` via the Sheets API (backup).
   - Updates the `Test ID` column in the live tab according to the migration map.
2. Verify by running `bun e2e:sync` and confirming upserts hit the existing rows (Status updates land where expected).
3. Retain the backup tab for two weeks, then delete.

#### Phase 4 — Lock down

1. Remove `--legacy-mode` from `audit-tc-ids.ts`.
2. Tighten the reporter regex to strict (`TC-[A-Z]{2,5}-\d{6}` only).
3. Activate the pre-commit hook and CI gate.
4. Update `CLAUDE.md` — remove the legacy pattern, document the new one.
5. Final commit: `chore(tc-ids): complete migration to v2 scheme`.

#### Rollback

| Phase | Rollback action |
|-------|-----------------|
| 1 | Revert the per-module PR(s) |
| 2 | `git revert` the per-module commit |
| 3 | Restore the backup tab and revert the sheet update |
| 4 | Revert the lock-down commit |

### 6. Algorithmic Mapping Rules (`migrate:tc-propose`)

Inputs: every `TC-...` occurrence in `tests/*.spec.ts`. Output: `docs/migration/test-id-migration-map.json`.

#### Rule A — Prefix consolidation

For each spec, pick the canonical prefix from the table in §3. Any non-canonical prefix in the spec is mapped onto a section block of the canonical module (e.g. `CATEG*` → block `01` of `CAT`).

#### Rule B — Decoding the digits

Let `digits` be the trailing digit string of the old ID.

```
if len(digits) == 5 (SSNNN):
    section_old = digits[0:3]
    seq_old     = digits[3:5]
    SECTION = map_section(prefix_old, section_old)   # per-module table in test-id-scheme.md
    SEQ     = pad4(seq_old)                          # "01" → "0001"
elif len(digits) == 4 (SSNN):
    # Modules using 4-digit IDs (POA, POP, PRA, PRC, PRP) treat
    # digits[0:2] as the section. The per-module table in
    # docs/test-id-scheme.md defines the section→block mapping for each.
    section_old = digits[0:2]
    SECTION = map_section(prefix_old, section_old)
    SEQ     = pad4(digits[2:4])
elif len(digits) == 3 (NNN):
    SECTION = "90"                                   # placeholder block for ungrouped legacy IDs
    SEQ     = pad4(digits)
    needsReview = true                               # reviewer must assign correct section
```

#### Rule C — Helper-generated tests

Tests synthesised from `tests/helpers/security-cases.ts` are proposed under section block `10`–`19` (Security / Authorization) of the consuming module. The script tags them `helperGenerated: true` so reviewers know to edit the helper, not the spec, if the mapping needs adjustment.

#### Rule D — Output schema

```json
{
  "version": 1,
  "generatedAt": "2026-05-06T...",
  "modules": {
    "PR": {
      "specFile": "tests/301-purchase-request.spec.ts",
      "newPrefix": "PR",
      "entries": [
        {
          "old": "TC-PR00101",
          "new": "TC-PR-010001",
          "rule": "5-digit:section=001→01,seq=01→0001",
          "needsReview": false,
          "helperGenerated": false,
          "note": ""
        },
        {
          "old": "TC-PR001",
          "new": "TC-PR-900001",
          "rule": "3-digit:no-section→placeholder",
          "needsReview": true,
          "helperGenerated": false,
          "note": "Reviewer: assign correct section block"
        }
      ]
    }
  }
}
```

### 7. Audit Script (`scripts/audit-tc-ids.ts`)

| # | Check | Severity | Description |
|---|-------|----------|-------------|
| 1 | Format | ERROR | Every `TC-...` occurrence matches `^TC-[A-Z]{2,5}-\d{6}$` |
| 2 | Prefix in dictionary | ERROR | Prefix is listed in `docs/test-id-scheme.md` |
| 3 | Section in catalog | ERROR | The 2-digit section block is registered for that prefix |
| 4 | Single prefix per spec | ERROR | A spec file uses exactly one prefix |
| 5 | No duplicate IDs | ERROR | No ID appears in more than one test |
| 6 | Annotation completeness | ERROR | Every `test(...)` carries all five annotation types (re-applies the existing CLAUDE.md rule) |
| 7 | Sheet target mapped | ERROR | The spec file has an entry in `SYNC_TARGETS` of `scripts/sync-test-results.ts` |
| 8 | Sequential within section | WARN | Sequence numbers do not jump (gaps allowed but warned) |
| 9 | Section utilisation | INFO | A single section holds > 5,000 tests → suggest splitting |

CLI:

```bash
bun audit:tc-ids                  # full audit, exit 1 on any ERROR
bun audit:tc-ids --legacy-mode    # accept both legacy and new formats (Phase 0–3)
bun audit:tc-ids --module PR      # restrict to one module
bun audit:tc-ids --json           # machine-readable output for CI consumption
```

Sample output:

```
[ERROR] tests/101-product-category.spec.ts:54
  TC-CATEG12345 — prefix "CATEG" not in dictionary
  Hint: did you mean "CAT"? See docs/test-id-scheme.md

[ERROR] tests/301-purchase-request.spec.ts:120
  TC-PR-450001 — section "45" not in catalog for prefix "PR"
  Catalog: 01,02,03,04,05,06,07,08,09,10..19,20..29,30..39

[WARN] tests/150-vendor.spec.ts
  Section 01 sequence: 0001,0002,0003,0007 (gap 0004–0006)

[OK] 33 specs scanned, 1357 IDs, 0 errors
```

### 8. Enforcement

Pre-commit hook (Lefthook):

```yaml
pre-commit:
  commands:
    audit-tc-ids:
      glob: "tests/**/*.spec.ts"
      run: bun audit:tc-ids
```

CI workflow (`.github/workflows/tc-id-audit.yml`):

```yaml
name: TC ID Audit
on: [pull_request, push]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - run: bun audit:tc-ids
```

Branch protection (configured manually on GitHub): require the `TC ID Audit / audit` status check before merging into `main`.

### 9. Testing Strategy for the Migration Tooling

- **`propose.ts`**: unit tests covering every Rule B branch (3-digit, 4-digit, 5-digit, multi-prefix specs) plus Rule C (helper-generated).
- **`apply.ts`**: integration test on a fixture spec — verify rename succeeds, test logic untouched, annotations preserved.
- **`audit-tc-ids.ts`**: integration tests on intentionally malformed fixtures — each ERROR check must trigger.
- **`sync-sheet.ts`**: dry-run mode (`--dry-run`) logging the planned updates without touching the live sheet; smoke-tested against a disposable test sheet before running on production.

## Out of scope

- Renumbering tests across modules (e.g. global sequence). Each module owns its own number space.
- Changing the spec filename pattern (`<NNN>-<module>.spec.ts`). The numeric prefix on filenames is independent of the TC ID prefix.
- Editing the existing JSON reporter row schema (`tests/reporters/tc-json-reporter.ts:44–58`). Field names stay the same; only the values change.

## Open questions for review

- Should `001-login.spec.ts` change its prefix from `L` to `LOGIN` (more readable, longer)? Current draft says yes — flagged here in case the user prefers the terse `L`.
- Should helper-generated security tests get a dedicated synthetic prefix (e.g. `SEC`) instead of inheriting the consuming module's prefix? Current draft inherits — flagged here for confirmation.
- Two-week retention for backup tabs in Phase 3 — adjustable.
