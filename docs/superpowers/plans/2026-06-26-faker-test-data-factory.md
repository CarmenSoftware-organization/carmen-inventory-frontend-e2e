# Faker Test-Data Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce `@faker-js/faker` to the e2e suite via one centralized data-factory module, then convert the `010-department.spec.ts` pilot to use it — replacing hand-rolled placeholder strings with realistic data while preserving cross-run uniqueness.

**Architecture:** A single functional module `tests/helpers/test-data.ts` wraps faker with the existing run-scoped UID convention (`Date.now().toString(36)` evaluated once per worker process). It exposes small composable functions (`fakeCode`, `fakeName`, `fakeDescription`, `buildEntity`) plus the raw `uid`/`shortUid` primitives. Faker output is always combined with the UID suffix for uniqueness; faker is never seeded. The department spec consumes the factory instead of building strings inline. No page objects, helper APIs, or test annotations change.

**Tech Stack:** TypeScript, Playwright, Vitest (unit), `@faker-js/faker`, bun.

## Global Constraints

- `@faker-js/faker` is a **devDependency** only.
- Codes are ASCII, uppercase, and `≤ 10` chars (config code fields enforce `maxLength=10`; see TC-DEP-200003). `fakeCode(prefix)` = `prefix + 4 chars`, so callers keep `prefix ≤ 6` chars.
- Descriptions stay `≤ 256` chars (config description fields enforce `maxLength=256`; see TC-DEP-030002).
- Faker is **NOT** seeded — data varies per run; uniqueness comes from the UID suffix only.
- `uid` MUST be a module-scope constant (`Date.now().toString(36)`) evaluated once per worker process — identical semantics to the current per-spec `const UID`, so serial-CRUD worker-restart behavior is unchanged.
- No test annotations change in this pilot → do **NOT** regenerate `docs/user-stories/`.
- TC IDs, Thai test titles, and the `PageFormCrudHelper` API are unchanged.
- `bun audit:tc-ids` and the annotation-completeness audit must pass.

---

## File Structure

- **Create** `tests/helpers/test-data.ts` — the factory. Single responsibility: produce unique, realistic test-data strings/bundles. Depends only on `@faker-js/faker`.
- **Create** `unit/test-data.test.ts` — vitest unit tests for the factory (backend-free).
- **Modify** `tests/010-department.spec.ts` — pilot consumer; swap inline UID-derived strings for factory calls.
- **Modify** `tests/README.md` — point the boilerplate + best-practice at the factory.
- **Modify** `CLAUDE.md` — add a "Test data" convention bullet.
- **Modify** `package.json` (+ lockfile) — add the dependency.

---

## Task 1: Factory module + unit tests

**Files:**
- Modify: `package.json` (devDependencies) + lockfile
- Create: `tests/helpers/test-data.ts`
- Test: `unit/test-data.test.ts`

**Interfaces:**
- Consumes: `@faker-js/faker` (`faker`, `fakerTH`).
- Produces (relied on by Task 2 and the unit test):
  - `const uid: string`
  - `shortUid(): string`
  - `fakeCode(prefix?: string): string` — default prefix `"E2E"`
  - `fakeName(opts?: { tag?: string; locale?: "en" | "th" }): string`
  - `fakeDescription(opts?: { locale?: "en" | "th" }): string`
  - `buildEntity(opts?: { codePrefix?: string; tag?: string; locale?: "en" | "th" }): { code: string; name: string; nameUpdated: string; description: string }`

- [ ] **Step 1: Add the dependency**

Run:
```bash
bun add -d @faker-js/faker
```
Expected: `package.json` gains `@faker-js/faker` under `devDependencies`; the bun lockfile updates. Confirm with:
```bash
grep faker package.json
```
Expected output: a line like `"@faker-js/faker": "^9.x.x"`.

- [ ] **Step 2: Write the failing unit test**

Create `unit/test-data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  uid,
  shortUid,
  fakeCode,
  fakeName,
  fakeDescription,
  buildEntity,
} from "../tests/helpers/test-data";

describe("test-data factory", () => {
  it("uid is a non-empty base36 string", () => {
    expect(uid).toMatch(/^[0-9a-z]+$/);
    expect(uid.length).toBeGreaterThan(0);
  });

  it("shortUid is 4 uppercase ASCII chars", () => {
    expect(shortUid()).toMatch(/^[A-Z0-9]{4}$/);
  });

  describe("fakeCode", () => {
    it("uses the default E2E prefix", () => {
      expect(fakeCode()).toMatch(/^E2E[A-Z0-9]{4}$/);
    });
    it("honors a custom prefix", () => {
      expect(fakeCode("D10")).toMatch(/^D10[A-Z0-9]{4}$/);
    });
    it("stays within the 10-char code maxLength for short prefixes", () => {
      expect(fakeCode("D10").length).toBeLessThanOrEqual(10);
    });
    it("shares the same shortUid tail across calls in one process", () => {
      expect(fakeCode("A").slice(-4)).toBe(fakeCode("B").slice(-4));
    });
  });

  describe("fakeName", () => {
    it("is non-empty and carries the run suffix", () => {
      const n = fakeName();
      expect(n.length).toBeGreaterThan(0);
      expect(n).toContain(`E2E-${uid}`);
    });
    it("includes the tag when provided", () => {
      expect(fakeName({ tag: "DEP010010" })).toContain("DEP010010");
    });
    it("th locale still returns a non-empty suffixed string", () => {
      const n = fakeName({ locale: "th" });
      expect(n.length).toBeGreaterThan(0);
      expect(n).toContain(`E2E-${uid}`);
    });
  });

  describe("fakeDescription", () => {
    it("is non-empty and within the 256-char maxLength", () => {
      const d = fakeDescription();
      expect(d.length).toBeGreaterThan(0);
      expect(d.length).toBeLessThanOrEqual(256);
      expect(d).toContain(`E2E-${uid}`);
    });
  });

  describe("buildEntity", () => {
    it("returns a full, distinct record bundle", () => {
      const e = buildEntity({ codePrefix: "E2E", tag: "DEP" });
      expect(e.code).toMatch(/^E2E[A-Z0-9]{4}$/);
      expect(e.name).toContain(`E2E-${uid}`);
      expect(e.nameUpdated).toContain("Upd");
      expect(e.name).not.toBe(e.nameUpdated);
      expect(e.description.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:
```bash
bun run test:unit -- test-data
```
Expected: FAIL — cannot resolve `../tests/helpers/test-data` (module does not exist yet).

- [ ] **Step 4: Implement the factory**

Create `tests/helpers/test-data.ts`:
```ts
import { faker, fakerTH } from "@faker-js/faker";

/**
 * Run-scoped unique token. Evaluated once per worker process at import time —
 * identical semantics to the previous per-spec `const UID = Date.now().toString(36)`.
 * Keeps names/codes unique ACROSS runs (a re-run gets a fresh Date.now()) and
 * stable WITHIN a run, including after a Playwright worker restart (the module
 * re-imports and recomputes). Faker is intentionally NOT seeded; uniqueness
 * comes from this suffix, not from faker.
 */
export const uid = Date.now().toString(36);

/** Short uppercase token derived from `uid`, for use inside ASCII codes. */
export function shortUid(): string {
  return uid.slice(-4).toUpperCase();
}

type Locale = "en" | "th";

function fakerFor(locale: Locale = "en") {
  return locale === "th" ? fakerTH : faker;
}

export interface NameOptions {
  /** Per-test label kept for traceability (e.g. a TC tag). */
  tag?: string;
  locale?: Locale;
}

export interface EntityOptions {
  /**
   * Code prefix; keep <= 6 chars so `${prefix}${shortUid()}` stays within the
   * 10-char code maxLength enforced by config forms.
   */
  codePrefix?: string;
  tag?: string;
  locale?: Locale;
}

/**
 * Realistic ASCII code: `${prefix}${shortUid()}`, e.g. "E2E1A2B".
 * Faker does not help with constrained codes — this centralizes the proven
 * short/uppercase format. Callers pass a per-test prefix to keep records
 * distinct. Prefix MUST be <= 6 chars (code maxLength is 10).
 */
export function fakeCode(prefix = "E2E"): string {
  return `${prefix}${shortUid()}`;
}

/**
 * Realistic human-readable name: a faker company name plus the optional `tag`
 * and the run suffix, e.g. "Hessel and Sons DEP010010 E2E-1a2b3c".
 * The suffix guarantees cross-run uniqueness; `tag` keeps per-test traceability.
 */
export function fakeName(opts: NameOptions = {}): string {
  const f = fakerFor(opts.locale);
  const base = f.company.name();
  return [base, opts.tag, `E2E-${uid}`].filter(Boolean).join(" ");
}

/**
 * Realistic description sentence plus the run suffix. A faker lorem sentence is
 * well under the 256-char maxLength config description fields enforce.
 */
export function fakeDescription(opts: { locale?: Locale } = {}): string {
  const f = fakerFor(opts.locale);
  return `${f.lorem.sentence()} E2E-${uid}`;
}

/**
 * The data bundle a CRUD spec's top-of-file consts need. `name` and
 * `nameUpdated` are independent faker values (always distinct); both carry the
 * `tag` and run suffix.
 */
export function buildEntity(opts: EntityOptions = {}): {
  code: string;
  name: string;
  nameUpdated: string;
  description: string;
} {
  const { codePrefix = "E2E", tag, locale } = opts;
  return {
    code: fakeCode(codePrefix),
    name: fakeName({ tag, locale }),
    nameUpdated: fakeName({ tag: tag ? `${tag} Upd` : "Upd", locale }),
    description: fakeDescription({ locale }),
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run:
```bash
bun run test:unit -- test-data
```
Expected: PASS — all `test-data factory` cases green.

- [ ] **Step 6: Commit**

```bash
git status --short   # confirm the lockfile name that changed (bun.lock / bun.lockb)
git add package.json tests/helpers/test-data.ts unit/test-data.test.ts
git add bun.lock 2>/dev/null || git add bun.lockb 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(test-data): add faker-backed data factory + unit tests

tests/helpers/test-data.ts wraps @faker-js/faker with the run-scoped UID
suffix (uid/shortUid/fakeCode/fakeName/fakeDescription/buildEntity). Faker
is unseeded; uniqueness comes from the suffix. Codes stay <=10 chars.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Convert the department pilot spec

**Files:**
- Modify: `tests/010-department.spec.ts`

**Interfaces:**
- Consumes from Task 1: `uid`, `fakeCode`, `fakeName`, `fakeDescription`, `buildEntity`.
- Produces: no new exports. The spec's `CODE`/`NAME`/`NAME_UPDATED` module consts now come from `buildEntity`; per-test `code`/`name` locals come from `fakeCode`/`fakeName`.

> All edits below are mechanical string→factory swaps. The test bodies,
> assertions, TC IDs, and annotations are untouched. After every edit `UID`
> must be fully gone from the file (replaced by `uid`/`fakeCode`/`fakeName`).

- [ ] **Step 1: Replace the import + module-level consts**

Replace lines 12-15:
```ts
const UID = Date.now().toString(36);
const CODE = `E2E${UID.slice(-4).toUpperCase()}`;
const NAME = `E2E DEP ${UID}`;
const NAME_UPDATED = `E2E DEP Upd ${UID}`;
```
with:
```ts
const { code: CODE, name: NAME, nameUpdated: NAME_UPDATED } = buildEntity({
  codePrefix: "E2E",
  tag: "DEP",
});
```
And add this import after line 8 (`import { BuSwitcherPage } ...`):
```ts
import { uid, fakeCode, fakeName, fakeDescription, buildEntity } from "./helpers/test-data";
```

- [ ] **Step 2: Replace the `__NOPE__` search token (TC-DEP-010004)**

Replace:
```ts
    await h.list.search(`__NOPE__${UID}`);
```
with:
```ts
    await h.list.search(`__NOPE__${uid}`);
```

- [ ] **Step 3: Replace per-test code/name locals (TC-DEP-040002)**

Replace:
```ts
      const code = `D10${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010010 ${UID}`;
      const renamed = `DEP010010 Upd ${UID}`;
```
with:
```ts
      const code = fakeCode("D10");
      const name = fakeName({ tag: "DEP010010" });
      const renamed = fakeName({ tag: "DEP010010 Upd" });
```

- [ ] **Step 4: Replace per-test code/name locals (TC-DEP-010006)**

Replace:
```ts
      const code = `D12${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010012 ${UID}`;
```
with:
```ts
      const code = fakeCode("D12");
      const name = fakeName({ tag: "DEP010012" });
```

- [ ] **Step 5: Replace per-test code/name locals (TC-DEP-200004)**

Replace:
```ts
      const code = `D11${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010011 ${UID}`;
```
with:
```ts
      const code = fakeCode("D11");
      const name = fakeName({ tag: "DEP010011" });
```
(The later `` `${name} dup` `` on the duplicate-create stays as-is.)

- [ ] **Step 6: Replace per-test code/name locals (TC-DEP-030003)**

Replace:
```ts
      const code = `D14${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010014 ${UID}`;
```
with:
```ts
      const code = fakeCode("D14");
      const name = fakeName({ tag: "DEP010014" });
```

- [ ] **Step 7: Replace the two inline fills (TC-DEP-200005)**

Replace:
```ts
      await h.nameInput().fill(`DEP010021 ${UID}`);
```
with:
```ts
      await h.nameInput().fill(fakeName({ tag: "DEP010021" }));
```
and replace:
```ts
      await h.codeInput().fill(`D21${UID.slice(-4).toUpperCase()}`);
```
with:
```ts
      await h.codeInput().fill(fakeCode("D21"));
```

- [ ] **Step 8: Replace per-test code/name/desc locals (TC-DEP-030002)**

Replace:
```ts
      const code = `D15${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010015 ${UID}`;
      const desc = `desc ${UID}`;
```
with:
```ts
      const code = fakeCode("D15");
      const name = fakeName({ tag: "DEP010015" });
      const desc = fakeDescription();
```
(The `"x".repeat(300)` → expect `"x".repeat(256)` maxLength check stays as-is.)

- [ ] **Step 9: Replace per-test code/name locals (TC-DEP-040003)**

Replace:
```ts
      const code = `D16${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010016 ${UID}`;
```
with:
```ts
      const code = fakeCode("D16");
      const name = fakeName({ tag: "DEP010016" });
```
(The later `` `${name} DIRTY` `` stays as-is.)

- [ ] **Step 10: Replace per-test code/name locals (TC-DEP-050002)**

Replace:
```ts
      const code = `D17${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010017 ${UID}`;
```
with:
```ts
      const code = fakeCode("D17");
      const name = fakeName({ tag: "DEP010017" });
```

- [ ] **Step 11: Replace per-test code/name locals (TC-DEP-040004)**

Replace:
```ts
      const code = `D19${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010019 ${UID}`;
```
with:
```ts
      const code = fakeCode("D19");
      const name = fakeName({ tag: "DEP010019" });
```

- [ ] **Step 12: Replace per-test code/name locals (TC-DEP-040005)**

Replace:
```ts
      const code = `D20${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010020 ${UID}`;
```
with:
```ts
      const code = fakeCode("D20");
      const name = fakeName({ tag: "DEP010020" });
```

- [ ] **Step 13: Verify `UID` is gone and the file typechecks**

Run:
```bash
grep -n "UID" tests/010-department.spec.ts
```
Expected: **no output** (every `UID` reference replaced).

Run:
```bash
bunx tsc --noEmit -p tsconfig.json
```
Expected: no errors (all imports used: `uid` at the `__NOPE__` search, `fakeCode`/`fakeName`/`fakeDescription` in test bodies, `buildEntity` at module scope).

- [ ] **Step 14: Run the audits**

Run the annotation-completeness audit (counts must match — annotations were not touched):
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: no `MISMATCH` lines.

Run:
```bash
bun audit:tc-ids
```
Expected: PASS.

- [ ] **Step 15: Run the department e2e spec (backend-gated)**

The local backend must be up on `:4000` (Docker) or the auth `setup` hangs silently. Check first:
```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4000 || echo "BACKEND DOWN"
```
If reachable, run:
```bash
bun run test -- 010-department.spec.ts
```
Expected: all `Department — Smoke & CRUD` tests PASS (member-assignment tests may skip if BLAVG has no assignable users — that is expected).

If the backend is **down**, do NOT claim a pass. Record the run as verification-blocked (backend offline) and proceed — the typecheck + audits + unit tests already cover the refactor's correctness; the e2e green is confirmed when a backend is available.

- [ ] **Step 16: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "$(cat <<'EOF'
refactor(department): build test data via faker factory

Replace inline Date.now() UID strings in 010-department.spec.ts with
buildEntity/fakeCode/fakeName/fakeDescription. Realistic names, same
cross-run uniqueness, per-test traceability via tags. No annotation
or TC-ID changes.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Document the new convention

**Files:**
- Modify: `tests/README.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the public API from Task 1. No code produced.

- [ ] **Step 1: Update the README boilerplate example**

In `tests/README.md`, add this import after the `addDialogSecurityCases` import (currently line 177):
```ts
import { buildEntity } from "./helpers/test-data";
```
Then replace:
```ts
const UID = Date.now().toString(36);
const NAME = `E2E MM ${UID}`;
```
with:
```ts
const { name: NAME } = buildEntity({ tag: "MM" });
```

- [ ] **Step 2: Update the README best-practice bullet**

Replace:
```
- **ใช้ unique name ต่อ test:** `Date.now().toString(36)` หรือ worker index ลด collision เวลา parallel
```
with:
```
- **ใช้ unique name ต่อ test:** สร้างข้อมูลผ่าน `tests/helpers/test-data.ts` (`buildEntity` / `fakeCode` / `fakeName` / `fakeDescription`) — ห่อ faker + UID suffix (`Date.now().toString(36)`) ให้ได้ชื่อสมจริงและ unique ข้ามรอบรันในที่เดียว
```

- [ ] **Step 3: Add the CLAUDE.md convention bullet**

In `CLAUDE.md`, under `## Conventions`, insert this bullet immediately **before** the `- **Language**:` bullet:
```
- **Test data**: build unique records via `tests/helpers/test-data.ts` (`buildEntity` / `fakeCode` / `fakeName` / `fakeDescription`), not hand-rolled strings. It wraps `@faker-js/faker` with the run-scoped UID suffix (`Date.now().toString(36)`) so names look realistic yet stay unique across runs; codes keep the ASCII `PREFIX+4` format (`≤ 10` chars). Faker is **not** seeded. `010-department.spec.ts` is the reference consumer; rolling the convention out to the remaining CRUD specs (and `helpers/security-cases.ts`) is a follow-up.
```

- [ ] **Step 4: Sanity-check the docs render**

Run:
```bash
grep -n "test-data" tests/README.md CLAUDE.md
```
Expected: matches in both files (boilerplate import + best-practice bullet in README; convention bullet in CLAUDE.md).

- [ ] **Step 5: Commit**

```bash
git add tests/README.md CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: point test-data convention at the faker factory

README boilerplate + best-practice and CLAUDE.md Conventions now reference
tests/helpers/test-data.ts as the canonical way to build unique test data.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage** (against `2026-06-26-faker-test-data-factory-design.md`):
- Dependency + `tests/helpers/test-data.ts` with `uid`/`shortUid`/`fakeCode`/`fakeName`/`fakeDescription`/`buildEntity`, locale switch, no seed → Task 1.
- Pilot conversion of `010-department.spec.ts`, no raw `Date.now()` left, page objects/annotations untouched → Task 2 (Step 13 asserts `UID` gone).
- Unit test `unit/test-data.test.ts` → Task 1 Steps 2-5.
- E2E verification with backend-down handling → Task 2 Step 15.
- README + CLAUDE.md docs; no user-story regen → Task 3 (+ Global Constraints).
- Out-of-scope `security-cases.ts` / other specs flagged → Global Constraints + CLAUDE.md bullet.
- Code maxLength ≤ 10 and description ≤ 256 constraints → Global Constraints, encoded in `fakeCode`/`fakeDescription` and unit-tested.

**Placeholder scan:** no TBD/TODO; every code step shows complete code; every command shows expected output.

**Type consistency:** the six exports in Task 1's Interfaces block match the import in Task 2 Step 1 and the unit test in Task 1 Step 2 exactly (`uid`, `shortUid`, `fakeCode`, `fakeName`, `fakeDescription`, `buildEntity`); `buildEntity` returns `{ code, name, nameUpdated, description }`, destructured as `{ code: CODE, name: NAME, nameUpdated: NAME_UPDATED }` in Task 2. `NameOptions.tag`/`locale` and `EntityOptions.codePrefix`/`tag`/`locale` match all call sites.
