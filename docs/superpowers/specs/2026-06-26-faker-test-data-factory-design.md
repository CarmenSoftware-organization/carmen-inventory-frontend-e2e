# Faker-backed test-data factory (pilot: department)

**Date:** 2026-06-26
**Status:** Design approved, pending spec review
**Scope:** Introduce `@faker-js/faker` to the e2e suite via a single centralized
data-factory module, then convert one pilot module (`010-department.spec.ts`)
to use it. Rolling the convention out to the remaining CRUD specs is explicitly
out of scope for this change and will happen in follow-up PRs.

## Goal

Replace the hand-rolled placeholder test data (`E2E DEP <uid>`, `E2E${UID}`)
with realistic faker-generated values, **without losing the cross-run
uniqueness guarantee** that the current `Date.now()`-based UID provides.

## Background / current state

- No faker dependency exists today.
- Every CRUD spec opens with a module-level `const UID = Date.now().toString(36)`
  and composes data from it:
  ```ts
  const UID = Date.now().toString(36);
  const CODE = `E2E${UID.slice(-4).toUpperCase()}`;
  const NAME = `E2E DEP ${UID}`;
  const NAME_UPDATED = `E2E DEP Upd ${UID}`;
  ```
- This pattern is load-bearing in two ways:
  1. `Date.now()` at **module scope** is evaluated once per worker process, so
     every test in the file shares one UID. On a worker restart after a failure
     it recomputes identically within the new process — the serial-CRUD chains
     depend on this (see memory `project_serial_crud_chains`).
  2. The UID makes names/codes **unique across runs**, so a re-run never
     collides with a record left in the backend by a previously failed run.
- In `010-department.spec.ts` the UID is used pervasively, not just in the four
  top-level consts. Per-test records use distinct, traceable prefixes/labels
  (`D10${UID}`, `DEP010010 ${UID}`, `desc ${UID}`, `__NOPE__${UID}`) so each
  test creates a distinct record and you can tell which TC created which row.
  **This distinctness/traceability must be preserved.**

## Decisions (from brainstorming)

1. **Purpose:** replace placeholder strings with realistic faker data in
   existing CRUD specs (a convention refactor).
2. **Uniqueness:** faker output is **combined with the existing UID suffix**, not
   used alone. Codes keep their existing ASCII/short format. Data varies every
   run (not exactly reproducible); uniqueness comes from the UID suffix, not from
   a faker seed. Faker is **not** seeded.
3. **Scope:** build the centralized factory + convert the **department** pilot
   only. No cleanup/teardown system, no seeding/log infrastructure.
4. **Locale:** mixed — Latin (`faker`/`en`) is the default; the factory accepts
   an option to switch a field/module to `fakerTH`.

## Chosen approach

**Thin functional helper module** — `tests/helpers/test-data.ts`. Small,
composable functions matching the existing functional-helper idiom (`bu.ts`,
`security-cases.ts`). Rejected alternatives:

- **Per-entity factory/builder classes** (`tests/factories/*.factory.ts`):
  over-engineered for a `{code, name, description}` shape; YAGNI for a pilot.
- **Inline `import { faker }` per spec, no central module:** loses the
  convention (UID suffix, code format, locale switch) that is the whole point,
  and drifts.

## Design

### 1. Dependency & module

- Add `@faker-js/faker` as a **devDependency**.
- New file `tests/helpers/test-data.ts` exporting:

  - `export const uid = Date.now().toString(36)` — module-scope, evaluated once
    per worker process. Identical semantics to today's per-spec `UID`, so the
    serial-chain worker-restart behavior is unchanged. This is the single source
    of the run UID; specs import it instead of calling `Date.now()` themselves.
  - `shortUid(): string` → `uid.slice(-4).toUpperCase()`.
  - `fakeCode(prefix = "E2E"): string` → `` `${prefix}${shortUid()}` ``. Keeps
    the proven ASCII/short format (faker does not help with constrained codes;
    centralizing it just removes duplication). Callers pass a per-test prefix
    (`D10`, `D11`, …) to keep records distinct.
  - `fakeName(opts?): string` → a realistic faker value plus an optional `tag`
    and the uid suffix, e.g. `` `${faker.company.name()} ${tag} E2E-${uid}` ``.
    `opts`: `{ tag?: string; locale?: "en" | "th" }`. The `tag` preserves
    per-test traceability (pass the TC label or a short token).
  - `fakeDescription(opts?): string` → faker sentence + uid suffix; same
    `locale` option.
  - `buildEntity(opts?): { code: string; name: string; nameUpdated: string;
    description: string }` → the bundle a CRUD spec's top-of-file consts need,
    replacing the four `const CODE/NAME/NAME_UPDATED` lines in one call. `opts`:
    `{ codePrefix?: string; tag?: string; locale?: "en" | "th" }`.
  - Locale handling: `import { faker, fakerTH } from "@faker-js/faker"` and pick
    by `opts.locale` (default `en`). `fakerTH` falls back to English for
    generators it does not localize — documented, acceptable.
  - **No `faker.seed(...)`** — data varies per run by design.

### 2. Pilot: `010-department.spec.ts`

- Remove `const UID = Date.now().toString(36)` and the derived consts; import
  `uid`, `shortUid`, `fakeCode`, `fakeName`, `fakeDescription` from
  `./helpers/test-data`. After this, the spec contains no raw `Date.now()` call —
  a single source of the run UID.
- Main create/edit record: `NAME`/`NAME_UPDATED`/`desc` → `fakeName(...)` /
  `fakeDescription(...)` (realistic values); `CODE` → `fakeCode("E2E")`.
- Per-test inline records (`D10`/`D11`/`D12`/`D14`/`D15`, `DEP010010 …`, etc.):
  keep their per-test prefix/tag for distinctness and traceability, but route
  them through `fakeCode(prefix)` / `fakeName({ tag })` and the shared `uid`.
- `__NOPE__${UID}` (search-for-nonexistent) → `__NOPE__${uid}`.
- **No changes** to page objects, the `PageFormCrudHelper` API, or any test
  annotations.

### 3. Out of scope (flagged for follow-up)

- `tests/helpers/security-cases.ts:184` builds its own
  `X${Date.now().toString(36).slice(-4)}` code. Left untouched in this pilot;
  aligning it with `fakeCode` is a rollout-phase follow-up.
- Converting the other ~20 CRUD specs.

## Error handling / edge cases

- **Code length/charset:** `fakeCode` keeps `prefix` + 4 uppercase chars (the
  proven format, e.g. 7 chars for `E2E`). No faker randomness in codes, so no
  length blow-out.
- **Name length:** some faker company names are long. `fakeName` = faker value +
  short suffix; if a module enforces a tight `maxlength`, the caller truncates.
  For department, confirm the name field accepts the generated length during E2E
  verification.
- **Thai fallback:** `fakerTH` falls back to `en` for unsupported generators;
  documented, not an error.
- **Worker-restart determinism:** unchanged — `uid` is still module-scope
  `Date.now()`, so serial chains behave exactly as before.

## Testing

- **Unit test** `unit/test-data.test.ts` (vitest, like `unit/run-env.test.ts`),
  backend-free:
  - `fakeCode` matches `^[A-Z0-9]+$` and the expected prefix + 4-char shape.
  - Two `buildEntity()` / `fakeName()` calls in the same process share the same
    uid suffix (consistency).
  - `fakeName`/`fakeDescription` return non-empty values containing the suffix;
    `tag` appears when provided.
  - `locale: "th"` switches the underlying faker instance.
- **E2E verification:** `bun run test -- 010-department.spec.ts` must be green.
  Requires the local backend on `:4000` (Docker); if it is offline the run
  hangs silently (see memory `project_e2e_local_backend_dep`) — diagnose with
  `curl :4000` and report that verification was blocked rather than claiming a
  pass.

## Docs

- `tests/README.md` (lines ~181 & ~373 currently teach
  `Date.now().toString(36)`) → point at `tests/helpers/test-data.ts` as the
  canonical way to build unique test data.
- `CLAUDE.md` "Conventions" → add a short note that test data comes from
  `tests/helpers/test-data.ts` (faker + UID suffix), not hand-rolled strings.
- No annotation changes in the pilot → **no** user-story regeneration needed.

## Definition of done

- `@faker-js/faker` in `devDependencies`; `tests/helpers/test-data.ts` created.
- `010-department.spec.ts` uses the factory; no raw `Date.now()` remains in it.
- `unit/test-data.test.ts` passes (`bun run test:unit`).
- `bun audit:tc-ids` passes; annotation completeness audit passes (unchanged).
- Department E2E green against a running backend, or verification-blocked status
  reported with the reason.
- `tests/README.md` and `CLAUDE.md` updated.
