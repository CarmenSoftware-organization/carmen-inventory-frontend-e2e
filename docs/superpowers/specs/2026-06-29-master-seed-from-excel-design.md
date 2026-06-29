# Master Seed from Excel — Design

**Date:** 2026-06-29
**Status:** Approved (design)
**Author:** brainstorming session

## Problem

The e2e suite currently builds every record on the fly with faker
(`tests/helpers/test-data.ts` → `buildEntity`). There is **no pre-seeded master
data**, so tests cannot reference known-stable records (a specific vendor, unit,
department, product, etc.). The repo ships two sample preconfiguration workbooks
in `sample_seed_data/` (`Preconfig_CARMEN_AVG.xlsx`,
`Preconfig_CARMEN_FIFO.xlsx`) — real Carmen master data — that should become the
source of a reusable baseline seed.

## Goal

A **standalone Bun CLI seeder** that reads a Preconfig Excel workbook and pushes
a **sample subset** of its master data into an **existing** business unit (BU)
via the backend REST API. Establishes a known baseline so e2e tests can reference
stable records instead of always faking throwaway ones.

Explicitly **not** a Playwright-integrated step: it is run manually
(`bun run seed:master`) so mutation never happens automatically on every test
run.

## Scope decisions (resolved during brainstorming)

- **Primary goal:** seed the backend via API (not emit committed seed files, not
  just a viewer).
- **Target BU:** an existing BU (configurable `buCode`). Do **not** create a BU /
  Company Profile. The Excel's `CARMEN-AVG` / `CARMEN-FIFO` BU identity is
  ignored; the operator points the seeder at whatever BU they own (e.g.
  `BLAVG`).
- **Data volume:** sample subset. Small lookups seed in full; the two large
  sheets (Product ≈2589, Vendor ≈845) are capped by `--limit` (default 50).
- **Target backend:** resolved from the frontend `config.json`, overridable by
  env. Works against local `:4000`, dev, or uat.
- **Idempotency:** skip-existing (fetch existing codes per BU, POST only new
  ones).
- **Safety:** a `--yes` gate is required for any non-localhost target.

## Sample input shape (observed)

Both workbooks have the same 10 sheets and row counts; they differ only in BU
identity. Note both files' `Inventory Cost Type` cell reads `average` despite the
FIFO filename — irrelevant here since Company Profile is out of scope.

| Sheet | Data rows | Key columns |
|-------|-----------|-------------|
| Company Profile | 1 | BU Code, Hotel/Company name, Tax ID, Inventory Cost Type, Default Currency — **out of scope** |
| Currency | 1 | Code, Name, Symbol, Exchange Rate |
| Unit | 34 | Code, Description |
| Tax Profile | 2 | Name, Value (%) |
| Item Group | 64 | Category Code/Desc, Subcategory Code/Desc, Item Group Code/Desc, deviations, Tax Profile |
| Product list | 2589 | Product Code, Desc (Eng/Local), Category, Subcategory, Item Group, Inventory/Order/Recipe units + conv rates, Tax profile, costs, deviations |
| Delivery Point | 1 | Code, Description |
| Store Location | 40 | Store Code, Store Name, Delivery Point, location Type, Physical Counted type |
| Department | 55 | Code, Description |
| Vendor | 845 | code, name, active, payee, address_line1/2, city, province, postal_code, country, telephone, fax, email, term, taxno, branchno, TaxProfileCode |

## Backend integration (verified against `../carmen-inventory-frontend-react`)

- **Login:** `POST ${BACKEND_URL}/api/auth/login` with `{ email, password }` →
  `{ data: { access_token, refresh_token, platform_role } }`
  (`lib/auth/auth-api.ts`).
- **Headers on every call:** `x-app-id: ${X_APP_ID}`,
  `Authorization: Bearer ${access_token}` (`lib/http-client.ts`).
- **Create:** `POST` to the entity's list endpoint with the Create DTO as the
  JSON body (`lib/config-crud.ts` → `create()`). Standard REST, no
  metadata-wrapper for these config entities. (eco-label's metadata wrapper —
  noted in project memory — does **not** apply; eco-label is not in this
  workbook.)
- **Endpoints** (the SPA's `/api/proxy/` prefix is internal; the real backend
  path drops it, per `tests/helpers/bu.ts`). All are parametrised by `buCode`
  (`constant/api-endpoints.ts`):
  - `…/api/config/${bu}/currencies`
  - `…/api/config/${bu}/units`
  - `…/api/config/${bu}/tax-profiles`
  - `…/api/config/${bu}/delivery-points`
  - `…/api/config/${bu}/departments`
  - `…/api/config/${bu}/locations` (store locations)
  - `…/api/config/${bu}/product-categories`
  - `…/api/config/${bu}/product-sub-categories`
  - `…/api/config/${bu}/product-item-groups`
  - `…/api/config/${bu}/vendors`
  - `…/api/config/${bu}/products`
- **Config source:** `config.json` exposes `BACKEND_URL`, `X_APP_ID` (e.g.
  `../carmen-inventory-frontend-react/dist/config.json`).

## Architecture

A small, well-bounded module under `scripts/seed-master/`. Each unit has one
purpose, a typed interface, and is testable in isolation.

```
scripts/seed-master/
  index.ts          # CLI entry: parse args, run orchestrator, print summary, set exit code
  config.ts         # resolve { backendUrl, xAppId, buCode, email, password } : env > config.json > error
  api-client.ts     # login() → token; get(path)/post(path, body) with auth headers, 429 backoff
  parser.ts         # readWorkbook(file) → typed raw rows keyed by sheet (SheetJS)
  orchestrator.ts   # seed entities in dependency order; idempotency; limit; collect results
  mappers/          # pure fns: raw row(s) → backend Create DTO(s)
    currency.ts unit.ts tax-profile.ts delivery-point.ts department.ts
    store-location.ts item-group.ts vendor.ts product.ts
  types.ts          # RawRows, SeedResult, EntityPlan, Config types
```

Add `xlsx` (SheetJS) as a devDependency. Add `"seed:master": "bun run
scripts/seed-master/index.ts"` to `package.json`.

### Layer responsibilities

- **config.ts** — pure resolution + validation. Precedence: env var > value in
  `config.json` > throw with a clear message. `buCode` has no config.json
  fallback (must be supplied). Returns a frozen `Config`.
- **api-client.ts** — owns auth and HTTP. `login()` posts credentials, stores
  the bearer token, retries on 429 with backoff (mirrors the suite's
  `loginWithRetry` rationale). `get`/`post` attach `x-app-id` + `Authorization`,
  parse JSON, and throw a typed error carrying `{ status, body }` on non-2xx.
- **parser.ts** — wraps SheetJS. One function per sheet returning typed rows
  (`{ header: 1 }` → objects), trimming blank trailing rows. No backend
  knowledge.
- **mappers/** — pure functions `rawRow → CreateDTO`. Each mirrors the
  corresponding react `types/*` Create DTO. Trivially unit-testable; no I/O.
- **orchestrator.ts** — the only stateful coordinator. For each entity in order:
  GET existing list → build a `Set` of existing codes → map remaining rows →
  POST new ones → record results. Threads created IDs forward where children
  need parent IDs (item-group tree; product references).

## Seed order & dependencies

Seeded strictly in this order so foreign keys resolve:

1. **Currency** — full (1)
2. **Unit** — full (34)
3. **Tax Profile** — full (2)
4. **Delivery Point** — full (1)
5. **Department** — full (55)
6. **Store Location** — full (40); needs Delivery Point
7. **Category → Subcategory → Item Group** — derived from the 64 Item Group rows;
   created parent→child
8. **Vendor** — subset (`--limit`, default 50); needs Tax Profile
9. **Product** — subset (`--limit`, default 50); needs Category/Subcategory/Item
   Group, Unit, Tax Profile

Rules:
- Small lookups always seed in full; only Product and Vendor are capped.
- **Product subset filter:** only include rows whose referenced
  category/subcategory/item-group/unit were actually seeded (or already exist),
  so no product is orphaned. If fewer than `--limit` qualify, seed what
  qualifies and log the shortfall.

### Item Group hierarchy (the one complex mapper)

The 64 rows encode a 3-level tree (Category → Subcategory → Item Group) flattened
with repeated parent columns. The mapper must:
1. De-duplicate Categories by `Category Code`; create them; capture returned IDs.
2. De-duplicate Subcategories by `Subcategory Code`; create each linked to its
   parent Category id; capture IDs.
3. Create each Item Group linked to its parent Subcategory id.

The exact parent-link field names come from the react `types/*` Create DTOs and
are pinned during the implementation-plan phase.

## Config & CLI

Resolution precedence: **env > config.json > error**.

| Env var | Required | Source fallback |
|---------|----------|-----------------|
| `SEED_BACKEND_URL` | no | `config.json` `BACKEND_URL` |
| `SEED_X_APP_ID` | no | `config.json` `X_APP_ID` |
| `SEED_CONFIG_PATH` | no | default react `dist/config.json` |
| `SEED_BU_CODE` | **yes** (or `--bu`) | none |
| `SEED_EMAIL` | **yes** | none |
| `SEED_PASSWORD` | **yes** | none |

Credentials live in `.env.local` (gitignored), never committed.

Flags:
- `--file <avg|fifo|path>` — workbook to read (default `avg`, resolving to
  `sample_seed_data/Preconfig_CARMEN_AVG.xlsx`).
- `--bu <code>` — overrides `SEED_BU_CODE`.
- `--limit <n>` — cap for Product & Vendor (default **50**).
- `--only <a,b>` / `--skip <a,b>` — restrict entities by name.
- `--dry-run` — parse + map + log payloads, no POST.
- `--yes` — required to run against a non-localhost target (see Safety).
- `--verbose` — log each payload/response.

## Idempotency & safety

- **Skip-existing:** before each entity, GET its list for `buCode`, collect the
  `code` of each existing record into a `Set`, and POST only rows whose code is
  absent. Re-running is safe and converges.
- **Dry-run:** `--dry-run` performs parse + map + skip-existing checks and prints
  what *would* be created, without mutating.
- **Non-localhost gate:** if the resolved `backendUrl` host is not `localhost` /
  `127.0.0.1` and `--yes` is absent, abort with a warning. Prevents accidental
  pollution of the shared dev/uat backends.
- **Startup banner:** always print target `backendUrl`, `buCode`, workbook file,
  and mode (live/dry-run) before doing anything.

## Error handling & reporting

- `api-client` throws typed errors with `{ status, body }`. Login 429 → backoff +
  retry.
- **Per-row resilience:** each create is wrapped in try/catch; one failed row
  records `failed` and the run continues. A row whose code already exists records
  `skipped`.
- Each result is `{ entity, code, status: "created" | "skipped" | "failed",
  error? }`.
- **End-of-run summary:** a per-entity table of created / skipped / failed
  counts. Exit code `0` if no failures (or dry-run), `1` otherwise.

## Testing

Unit tests via vitest (matching `scripts/__tests__/` and `unit/` conventions),
no live backend:
- **parser** — a tiny fixture `.xlsx` → expected typed rows.
- **mappers** — raw row → DTO assertions per entity; emphasis on the item-group
  hierarchy de-dup/link logic.
- **config** — env-override precedence and the missing-required-var error.
- **orchestrator** — skip-existing logic and product-subset filtering, with a
  mocked api-client.

## Out of scope (follow-ups)

- Company Profile / BU (tenant) creation.
- Full-volume seeding of all 2589 products / 845 vendors (the `--limit`
  mechanism exists; raising it is a config choice, but the default and intent
  remain a sample).
- Wiring the seeder into Playwright global setup / a setup project.
- Emitting committed JSON/TS seed fixtures (a different deliverable than this
  API seeder).
