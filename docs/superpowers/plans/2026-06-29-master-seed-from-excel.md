# Master Seed from Excel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A standalone Bun CLI (`bun run seed:master`) that reads a Preconfig Excel workbook and seeds a sample subset of its master data into an existing BU via the backend REST API.

**Architecture:** A small layered module under `scripts/seed-master/`: `config` (resolve env/config.json) → `parser` (xlsx → typed rows) → `mappers/` (pure row→DTO functions) → `api-client` (login + authed GET/POST) → `orchestrator` (dependency-ordered, skip-existing seeding) → `index` (CLI). Each layer is independently unit-tested with no live backend.

**Tech Stack:** TypeScript, Bun runtime, `xlsx` (SheetJS) for parsing, vitest for unit tests (existing `unit/**/*.test.ts` convention).

## Global Constraints

- **Runtime:** Bun. Scripts run via `bun run scripts/seed-master/index.ts`.
- **Unit tests live in `unit/`** — vitest `include` is `unit/**/*.test.ts` (see `vitest.config.ts`). Tests for this feature go in `unit/seed-master/*.test.ts`. Run with `bun run test:unit` (= `vitest run`).
- **No import from `../carmen-inventory-frontend-react`** — it is a separate package, not a dependency. All DTO shapes are re-declared locally in `scripts/seed-master/types.ts`.
- **Real backend paths drop the SPA's `/api/proxy` prefix** (confirmed in `tests/helpers/bu.ts`). The frontend constant `/api/proxy/api/config/${bu}/currencies` becomes `/api/config/${bu}/currencies` against the real backend.
- **Auth:** `POST ${BACKEND_URL}/api/auth/login` with headers `Content-Type: application/json` + `x-app-id`, body `{ email, password }` → `{ data: { access_token, refresh_token, platform_role } }`. 429 carries `retry_after` (seconds) in the body. Every other call sends `x-app-id` + `Authorization: Bearer <token>`.
- **Create = POST to the list endpoint** with the Create DTO as the JSON body (`lib/config-crud.ts`). List = GET the same path; response is `{ data: T[], paginate }`. Use `?perpage=-1` to fetch all.
- **Identity fields differ per entity:** Currency/Department/Location/Vendor/Category/SubCategory/ItemGroup/Product use `code`; **Unit, TaxProfile, DeliveryPoint have no `code` and use `name`**.
- **`CreateVendorDto` has no tax-profile field** — the Excel `TaxProfileCode` column is intentionally dropped.
- **Commit after every task.** The lefthook pre-commit `audit:tc-ids` skips files that are not `tests/*.spec.ts`, so seeder commits pass it cleanly.
- Credentials (`SEED_EMAIL`, `SEED_PASSWORD`, `SEED_BU_CODE`) live in `.env.local` (gitignored) — never commit them.

---

## File Structure

```
scripts/seed-master/
  types.ts          # SeedConfig, SeedResult, EntityName, ALL_ENTITIES, ENDPOINTS,
                    # Row, RawRows, all Create DTO interfaces, planned-tree interfaces
  config.ts         # resolveConfig(env), isLocalHost(url)
  parser.ts         # readWorkbookFile(path), extractRows(wb)
  api-client.ts     # login(cfg), createApiClient(cfg, token)
  orchestrator.ts   # fetchExistingKeys, fetchKeyToId, seedEntity, runSeed
  mappers/
    util.ts         # toStr, numOrNull, toBool
    currency.ts     # mapCurrency
    unit.ts         # mapUnit
    tax-profile.ts  # mapTaxProfile
    delivery-point.ts # mapDeliveryPoint
    department.ts   # mapDepartment
    store-location.ts # mapStoreLocation (+ location-type/physical-count normalizers)
    item-group.ts   # buildItemGroupTree
    vendor.ts       # mapVendor
    product.ts      # mapProduct
  index.ts          # parseArgs, resolveEnabled, resolveWorkbookPath, banner, printSummary, main
unit/seed-master/
  config.test.ts
  parser.test.ts
  mappers-lookup.test.ts
  mappers-store-location.test.ts
  mappers-item-group.test.ts
  mappers-vendor.test.ts
  mappers-product.test.ts
  api-client.test.ts
  orchestrator.test.ts
  cli-args.test.ts
```

---

## Task 1: Shared types & endpoints

**Files:**
- Create: `scripts/seed-master/types.ts`
- Test: `unit/seed-master/endpoints.test.ts`

**Interfaces:**
- Produces: `SeedConfig`, `SeedResult`, `EntityName`, `ALL_ENTITIES`, `Row`, `RawRows`, `ENDPOINTS`, and every Create DTO interface (`CreateCurrencyDto`, `CreateUnitDto`, `CreateTaxProfileDto`, `CreateDeliveryPointDto`, `CreateDepartmentDto`, `CreateLocationDto`, `CreateCategoryDto`, `CreateSubCategoryDto`, `CreateItemGroupDto`, `CreateVendorDto`, `CreateProductDto`), plus `PlannedSubCategory`, `PlannedItemGroup`, `ItemGroupTree`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/endpoints.test.ts
import { describe, it, expect } from "vitest";
import { ENDPOINTS, ALL_ENTITIES } from "../../scripts/seed-master/types";

describe("ENDPOINTS", () => {
  it("builds real backend config paths (no /api/proxy prefix)", () => {
    expect(ENDPOINTS.currencies("BLAVG")).toBe("/api/config/BLAVG/currencies");
    expect(ENDPOINTS.units("BLAVG")).toBe("/api/config/BLAVG/units");
    expect(ENDPOINTS.taxProfiles("BLAVG")).toBe("/api/config/BLAVG/tax-profiles");
    expect(ENDPOINTS.deliveryPoints("BLAVG")).toBe("/api/config/BLAVG/delivery-points");
    expect(ENDPOINTS.departments("BLAVG")).toBe("/api/config/BLAVG/departments");
    expect(ENDPOINTS.locations("BLAVG")).toBe("/api/config/BLAVG/locations");
    expect(ENDPOINTS.productCategories("BLAVG")).toBe("/api/config/BLAVG/product-categories");
    expect(ENDPOINTS.productSubCategories("BLAVG")).toBe("/api/config/BLAVG/product-sub-categories");
    expect(ENDPOINTS.productItemGroups("BLAVG")).toBe("/api/config/BLAVG/product-item-groups");
    expect(ENDPOINTS.vendors("BLAVG")).toBe("/api/config/BLAVG/vendors");
    expect(ENDPOINTS.products("BLAVG")).toBe("/api/config/BLAVG/products");
  });

  it("lists all nine seedable entity names", () => {
    expect(ALL_ENTITIES).toEqual([
      "currency", "unit", "tax-profile", "delivery-point", "department",
      "store-location", "item-group", "vendor", "product",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/endpoints.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/types`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/types.ts

export interface SeedConfig {
  backendUrl: string;
  xAppId: string;
  buCode: string;
  email: string;
  password: string;
}

export type EntityName =
  | "currency" | "unit" | "tax-profile" | "delivery-point" | "department"
  | "store-location" | "item-group" | "vendor" | "product";

export const ALL_ENTITIES: EntityName[] = [
  "currency", "unit", "tax-profile", "delivery-point", "department",
  "store-location", "item-group", "vendor", "product",
];

export interface SeedResult {
  entity: string;
  key: string;
  status: "created" | "skipped" | "failed";
  error?: string;
}

/** One spreadsheet row as keyed by its header cells. */
export type Row = Record<string, unknown>;

export interface RawRows {
  currency: Row[];
  unit: Row[];
  taxProfile: Row[];
  deliveryPoint: Row[];
  department: Row[];
  storeLocation: Row[];
  itemGroup: Row[];
  vendor: Row[];
  product: Row[];
}

/** Real backend paths — the SPA's `/api/proxy` prefix is dropped. */
export const ENDPOINTS = {
  login: () => `/api/auth/login`,
  currencies: (bu: string) => `/api/config/${bu}/currencies`,
  units: (bu: string) => `/api/config/${bu}/units`,
  taxProfiles: (bu: string) => `/api/config/${bu}/tax-profiles`,
  deliveryPoints: (bu: string) => `/api/config/${bu}/delivery-points`,
  departments: (bu: string) => `/api/config/${bu}/departments`,
  locations: (bu: string) => `/api/config/${bu}/locations`,
  productCategories: (bu: string) => `/api/config/${bu}/product-categories`,
  productSubCategories: (bu: string) => `/api/config/${bu}/product-sub-categories`,
  productItemGroups: (bu: string) => `/api/config/${bu}/product-item-groups`,
  vendors: (bu: string) => `/api/config/${bu}/vendors`,
  products: (bu: string) => `/api/config/${bu}/products`,
} as const;

interface TransferPayload {
  add: { id: string }[];
  remove: { id: string }[];
}

export interface CreateCurrencyDto {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  description: string;
  decimal_places: number;
  is_active: boolean;
}

export interface CreateUnitDto {
  name: string;
  description: string;
  is_active: boolean;
}

export interface CreateTaxProfileDto {
  name: string;
  tax_rate: number;
  is_active: boolean;
}

export interface CreateDeliveryPointDto {
  name: string;
  is_active: boolean;
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  department_users: TransferPayload;
  hod_users: TransferPayload;
}

export type InventoryType = "inventory" | "direct" | "consignment";
export type PhysicalCountType = "yes" | "no";

export interface CreateLocationDto {
  code: string;
  name: string;
  location_type: InventoryType;
  physical_count_type: PhysicalCountType;
  description: string;
  is_active: boolean;
  delivery_point_id?: string;
  delivery_point_name?: string;
  users: TransferPayload;
  products: TransferPayload;
}

export interface CreateCategoryDto {
  code: string;
  name: string;
  is_active: boolean;
}

export interface CreateSubCategoryDto {
  code: string;
  name: string;
  is_active: boolean;
  product_category_id: string;
  cascade_deviation: boolean;
}

export interface CreateItemGroupDto {
  code: string;
  name: string;
  is_active: boolean;
  product_subcategory_id: string;
  cascade_deviation: boolean;
}

export interface PlannedSubCategory {
  code: string;
  name: string;
  parentCategoryCode: string;
}

export interface PlannedItemGroup {
  code: string;
  name: string;
  parentSubCategoryCode: string;
}

export interface ItemGroupTree {
  categories: CreateCategoryDto[];
  subcategories: PlannedSubCategory[];
  itemGroups: PlannedItemGroup[];
}

interface VendorInfoItem { label: string; value: string; data_type: string; }
interface VendorAddressPayload {
  address_type: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
  country: string;
}
interface VendorContactPayload {
  name: string;
  email: string;
  phone: string;
  is_primary: boolean;
}

export interface CreateVendorDto {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  business_type: { id: string; name: string }[];
  info: VendorInfoItem[];
  vendor_address: { add: VendorAddressPayload[] };
  vendor_contact: { add: VendorContactPayload[] };
}

interface ProductInfoItem { label: string; value: string; data_type: string; }

export interface CreateProductDto {
  code: string;
  name: string;
  local_name: string;
  description: string;
  inventory_unit_id: string;
  product_item_group_id: string;
  product_status_type: "active" | "inactive";
  tax_profile_id: string | null;
  price_deviation_limit: number | null;
  qty_deviation_limit: number | null;
  product_info: {
    is_used_in_recipe: boolean;
    is_sold_directly: boolean;
    barcode: string;
    sku: string;
    price: number | null;
    info: ProductInfoItem[];
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/endpoints.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/types.ts unit/seed-master/endpoints.test.ts
git commit -m "feat(seed): shared types and backend endpoint map"
```

---

## Task 2: Config resolution

**Files:**
- Create: `scripts/seed-master/config.ts`
- Test: `unit/seed-master/config.test.ts`

**Interfaces:**
- Consumes: `SeedConfig` from `types.ts`.
- Produces: `resolveConfig(env?: Record<string, string | undefined>): SeedConfig`, `isLocalHost(backendUrl: string): boolean`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/config.test.ts
import { describe, it, expect } from "vitest";
import { resolveConfig, isLocalHost } from "../../scripts/seed-master/config";

// Point at a path that does not exist so config.json never loads; env supplies all.
const NO_FILE = { SEED_CONFIG_PATH: "/nonexistent/config.json" };

describe("resolveConfig", () => {
  it("reads all values from env and strips trailing slash on URL", () => {
    const cfg = resolveConfig({
      ...NO_FILE,
      SEED_BACKEND_URL: "http://localhost:4000/",
      SEED_X_APP_ID: "app-1",
      SEED_BU_CODE: "BLAVG",
      SEED_EMAIL: "admin@blueledgers.com",
      SEED_PASSWORD: "12345678",
    });
    expect(cfg).toEqual({
      backendUrl: "http://localhost:4000",
      xAppId: "app-1",
      buCode: "BLAVG",
      email: "admin@blueledgers.com",
      password: "12345678",
    });
  });

  it("throws listing every missing required value", () => {
    expect(() => resolveConfig({ ...NO_FILE })).toThrow(/SEED_BACKEND_URL.*SEED_X_APP_ID.*SEED_BU_CODE.*SEED_EMAIL.*SEED_PASSWORD/s);
  });
});

describe("isLocalHost", () => {
  it("is true for localhost and 127.0.0.1", () => {
    expect(isLocalHost("http://localhost:4000")).toBe(true);
    expect(isLocalHost("http://127.0.0.1:4000")).toBe(true);
  });
  it("is false for remote hosts", () => {
    expect(isLocalHost("https://dev.blueledgers.com:4001")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/config.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/config`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/config.ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SeedConfig } from "./types";

const DEFAULT_CONFIG_PATH = "../carmen-inventory-frontend-react/dist/config.json";

export function resolveConfig(
  env: Record<string, string | undefined> = process.env,
): SeedConfig {
  const configPath = env.SEED_CONFIG_PATH ?? DEFAULT_CONFIG_PATH;
  let fileCfg: { BACKEND_URL?: string; X_APP_ID?: string } = {};
  try {
    fileCfg = JSON.parse(readFileSync(resolve(process.cwd(), configPath), "utf8"));
  } catch {
    // config.json is optional when env supplies BACKEND_URL/X_APP_ID
  }

  const backendUrl = (env.SEED_BACKEND_URL ?? fileCfg.BACKEND_URL ?? "").replace(/\/+$/, "");
  const xAppId = env.SEED_X_APP_ID ?? fileCfg.X_APP_ID ?? "";
  const buCode = env.SEED_BU_CODE ?? "";
  const email = env.SEED_EMAIL ?? "";
  const password = env.SEED_PASSWORD ?? "";

  const missing: string[] = [];
  if (!backendUrl) missing.push("SEED_BACKEND_URL (or config.json BACKEND_URL)");
  if (!xAppId) missing.push("SEED_X_APP_ID (or config.json X_APP_ID)");
  if (!buCode) missing.push("SEED_BU_CODE");
  if (!email) missing.push("SEED_EMAIL");
  if (!password) missing.push("SEED_PASSWORD");
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(", ")}`);
  }

  return { backendUrl, xAppId, buCode, email, password };
}

export function isLocalHost(backendUrl: string): boolean {
  try {
    const host = new URL(backendUrl).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/config.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/config.ts unit/seed-master/config.test.ts
git commit -m "feat(seed): config resolution with env/config.json precedence"
```

---

## Task 3: Workbook parser

**Files:**
- Create: `scripts/seed-master/parser.ts`
- Modify: `package.json` (add `xlsx` devDependency via bun)
- Test: `unit/seed-master/parser.test.ts`

**Interfaces:**
- Consumes: `RawRows`, `Row` from `types.ts`.
- Produces: `extractRows(wb: XLSX.WorkBook): RawRows`, `readWorkbookFile(path: string): XLSX.WorkBook`.

- [ ] **Step 1: Install the xlsx dependency**

Run: `bun add -d xlsx`
Expected: `xlsx` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Write the failing test**

```ts
// unit/seed-master/parser.test.ts
import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { extractRows } from "../../scripts/seed-master/parser";

function makeWorkbook(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const sheets: Record<string, unknown[][]> = {
    "Company Profile": [["BU Code"], ["CARMEN-AVG"]],
    Currency: [["Code", "Name", "Symbol", "Exchange Rate"], ["THB", "Thai baht", "฿", 1]],
    Unit: [["Code", "Description"], ["KG", "KG"], ["BAG", "BAG"]],
    "Tax Profile": [["Name", "Value"], ["None", 0], ["Vat 7%", 7]],
    "Item Group": [
      ["Category Code", "Category Description", "Subcategory Code", "Subcategory Description", "Item Group Code", "Item Group Description"],
      [1, "FOOD", 10, "DRY FOOD", 1100, "SAUCE & SEASONING"],
    ],
    "Product list": [["Product Code", "Description (Eng)"], [11110001, "Ground Beef "]],
    "Delivery Point": [["Code", "Description"], ["MAIN", "Main"]],
    "Store Location": [["Store Code", "Store Name", "Delivery Point", "location Type", "Physical Counted type"], ["1AG01", "A&G", "Main", "inventory", "yes"]],
    Department: [["Code", "Description"], [101, "Rooms General Account"]],
    Vendor: [["code", "name", "active"], ["N016", "Acme", true]],
  };
  for (const [name, aoa] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name);
  }
  return wb;
}

describe("extractRows", () => {
  it("maps each sheet to keyed rows", () => {
    const rows = extractRows(makeWorkbook());
    expect(rows.currency).toEqual([{ Code: "THB", Name: "Thai baht", Symbol: "฿", "Exchange Rate": 1 }]);
    expect(rows.unit).toHaveLength(2);
    expect(rows.unit[0].Code).toBe("KG");
    expect(rows.department[0]["Description"]).toBe("Rooms General Account");
    expect(rows.product[0]["Product Code"]).toBe(11110001);
    expect(rows.storeLocation[0]["Physical Counted type"]).toBe("yes");
  });

  it("throws when a required sheet is missing", () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["x"]]), "Currency");
    expect(() => extractRows(wb)).toThrow(/Missing sheet "Unit"/);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/parser.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/parser`.

- [ ] **Step 4: Write the implementation**

```ts
// scripts/seed-master/parser.ts
import * as XLSX from "xlsx";
import type { RawRows, Row } from "./types";

/** RawRows key → exact sheet name in the workbook. Company Profile is intentionally omitted. */
const SHEET_MAP: Record<keyof RawRows, string> = {
  currency: "Currency",
  unit: "Unit",
  taxProfile: "Tax Profile",
  deliveryPoint: "Delivery Point",
  department: "Department",
  storeLocation: "Store Location",
  itemGroup: "Item Group",
  vendor: "Vendor",
  product: "Product list",
};

export function extractRows(wb: XLSX.WorkBook): RawRows {
  const out = {} as RawRows;
  for (const key of Object.keys(SHEET_MAP) as (keyof RawRows)[]) {
    const sheetName = SHEET_MAP[key];
    const ws = wb.Sheets[sheetName];
    if (!ws) throw new Error(`Missing sheet "${sheetName}"`);
    out[key] = XLSX.utils.sheet_to_json<Row>(ws, { defval: null });
  }
  return out;
}

export function readWorkbookFile(path: string): XLSX.WorkBook {
  return XLSX.readFile(path);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/parser.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-master/parser.ts unit/seed-master/parser.test.ts package.json bun.lock
git commit -m "feat(seed): xlsx workbook parser"
```

---

## Task 4: Lookup mappers (currency, unit, tax-profile, delivery-point, department)

**Files:**
- Create: `scripts/seed-master/mappers/util.ts`
- Create: `scripts/seed-master/mappers/currency.ts`
- Create: `scripts/seed-master/mappers/unit.ts`
- Create: `scripts/seed-master/mappers/tax-profile.ts`
- Create: `scripts/seed-master/mappers/delivery-point.ts`
- Create: `scripts/seed-master/mappers/department.ts`
- Test: `unit/seed-master/mappers-lookup.test.ts`

**Interfaces:**
- Consumes: `Row`, and the Create DTOs from `types.ts`.
- Produces: `toStr`, `numOrNull`, `toBool` (util); `mapCurrency(row)`, `mapUnit(row)`, `mapTaxProfile(row)`, `mapDeliveryPoint(row)`, `mapDepartment(row)`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/mappers-lookup.test.ts
import { describe, it, expect } from "vitest";
import { mapCurrency } from "../../scripts/seed-master/mappers/currency";
import { mapUnit } from "../../scripts/seed-master/mappers/unit";
import { mapTaxProfile } from "../../scripts/seed-master/mappers/tax-profile";
import { mapDeliveryPoint } from "../../scripts/seed-master/mappers/delivery-point";
import { mapDepartment } from "../../scripts/seed-master/mappers/department";

describe("lookup mappers", () => {
  it("maps currency", () => {
    expect(mapCurrency({ Code: "THB", Name: "Thai baht", Symbol: "฿", "Exchange Rate": 1 })).toEqual({
      code: "THB", name: "Thai baht", symbol: "฿", exchange_rate: 1,
      description: "", decimal_places: 2, is_active: true,
    });
  });

  it("maps unit using Code as name (Unit has no code field)", () => {
    expect(mapUnit({ Code: "KG", Description: "Kilogram" })).toEqual({
      name: "KG", description: "Kilogram", is_active: true,
    });
  });

  it("maps tax profile using name identity", () => {
    expect(mapTaxProfile({ Name: "Vat 7%", Value: 7 })).toEqual({
      name: "Vat 7%", tax_rate: 7, is_active: true,
    });
  });

  it("maps delivery point using Description as name", () => {
    expect(mapDeliveryPoint({ Code: "MAIN", Description: "Main" })).toEqual({
      name: "Main", is_active: true,
    });
  });

  it("maps department with empty user transfer payloads", () => {
    expect(mapDepartment({ Code: 101, Description: "Front Office" })).toEqual({
      code: "101", name: "Front Office", description: "", is_active: true,
      department_users: { add: [], remove: [] },
      hod_users: { add: [], remove: [] },
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/mappers-lookup.test.ts`
Expected: FAIL — cannot find module `mappers/currency`.

- [ ] **Step 3: Write the implementations**

```ts
// scripts/seed-master/mappers/util.ts
export const toStr = (v: unknown, fallback = ""): string =>
  v == null ? fallback : String(v).trim();

export const numOrNull = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

export const toBool = (v: unknown): boolean =>
  v === true || ["true", "1", "yes"].includes(String(v).trim().toLowerCase());
```

```ts
// scripts/seed-master/mappers/currency.ts
import type { Row, CreateCurrencyDto } from "../types";
import { toStr } from "./util";

export function mapCurrency(row: Row): CreateCurrencyDto {
  return {
    code: toStr(row["Code"]),
    name: toStr(row["Name"]),
    symbol: toStr(row["Symbol"]),
    exchange_rate: Number(row["Exchange Rate"] ?? 1) || 1,
    description: "",
    decimal_places: 2,
    is_active: true,
  };
}
```

```ts
// scripts/seed-master/mappers/unit.ts
import type { Row, CreateUnitDto } from "../types";
import { toStr } from "./util";

export function mapUnit(row: Row): CreateUnitDto {
  const name = toStr(row["Code"]);
  return {
    name,
    description: toStr(row["Description"], name),
    is_active: true,
  };
}
```

```ts
// scripts/seed-master/mappers/tax-profile.ts
import type { Row, CreateTaxProfileDto } from "../types";
import { toStr } from "./util";

export function mapTaxProfile(row: Row): CreateTaxProfileDto {
  return {
    name: toStr(row["Name"]),
    tax_rate: Number(row["Value"] ?? 0) || 0,
    is_active: true,
  };
}
```

```ts
// scripts/seed-master/mappers/delivery-point.ts
import type { Row, CreateDeliveryPointDto } from "../types";
import { toStr } from "./util";

export function mapDeliveryPoint(row: Row): CreateDeliveryPointDto {
  return {
    name: toStr(row["Description"], toStr(row["Code"])),
    is_active: true,
  };
}
```

```ts
// scripts/seed-master/mappers/department.ts
import type { Row, CreateDepartmentDto } from "../types";
import { toStr } from "./util";

export function mapDepartment(row: Row): CreateDepartmentDto {
  return {
    code: toStr(row["Code"]),
    name: toStr(row["Description"]),
    description: "",
    is_active: true,
    department_users: { add: [], remove: [] },
    hod_users: { add: [], remove: [] },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/mappers-lookup.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/mappers/util.ts scripts/seed-master/mappers/currency.ts scripts/seed-master/mappers/unit.ts scripts/seed-master/mappers/tax-profile.ts scripts/seed-master/mappers/delivery-point.ts scripts/seed-master/mappers/department.ts unit/seed-master/mappers-lookup.test.ts
git commit -m "feat(seed): lookup entity mappers"
```

---

## Task 5: Store-location mapper

**Files:**
- Create: `scripts/seed-master/mappers/store-location.ts`
- Test: `unit/seed-master/mappers-store-location.test.ts`

**Interfaces:**
- Consumes: `Row`, `CreateLocationDto`, `InventoryType`, `PhysicalCountType` from `types.ts`; `toStr` from `mappers/util.ts`.
- Produces: `mapStoreLocation(row: Row, dpIdByName: Map<string, string>): CreateLocationDto`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/mappers-store-location.test.ts
import { describe, it, expect } from "vitest";
import { mapStoreLocation } from "../../scripts/seed-master/mappers/store-location";

describe("mapStoreLocation", () => {
  const dpMap = new Map([["Main", "dp-uuid-1"]]);

  it("maps a store location and resolves delivery_point_id by name", () => {
    expect(
      mapStoreLocation(
        { "Store Code": "1AG01", "Store Name": "A&G-Accounting", "Delivery Point": "Main", "location Type": "inventory", "Physical Counted type": "yes" },
        dpMap,
      ),
    ).toEqual({
      code: "1AG01",
      name: "A&G-Accounting",
      location_type: "inventory",
      physical_count_type: "yes",
      description: "",
      is_active: true,
      delivery_point_id: "dp-uuid-1",
      delivery_point_name: "Main",
      users: { add: [], remove: [] },
      products: { add: [], remove: [] },
    });
  });

  it("defaults unknown location type to inventory and physical count to no; omits id when DP unknown", () => {
    const dto = mapStoreLocation(
      { "Store Code": "X1", "Store Name": "X", "Delivery Point": "Other", "location Type": "weird", "Physical Counted type": "maybe" },
      dpMap,
    );
    expect(dto.location_type).toBe("inventory");
    expect(dto.physical_count_type).toBe("no");
    expect(dto.delivery_point_id).toBeUndefined();
    expect(dto.delivery_point_name).toBe("Other");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/mappers-store-location.test.ts`
Expected: FAIL — cannot find module `mappers/store-location`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/mappers/store-location.ts
import type { Row, CreateLocationDto, InventoryType, PhysicalCountType } from "../types";
import { toStr } from "./util";

const INVENTORY_TYPES: InventoryType[] = ["inventory", "direct", "consignment"];

function normalizeLocationType(v: unknown): InventoryType {
  const s = toStr(v).toLowerCase();
  return (INVENTORY_TYPES as string[]).includes(s) ? (s as InventoryType) : "inventory";
}

function normalizePhysicalCount(v: unknown): PhysicalCountType {
  return toStr(v).toLowerCase() === "yes" ? "yes" : "no";
}

export function mapStoreLocation(row: Row, dpIdByName: Map<string, string>): CreateLocationDto {
  const dpName = toStr(row["Delivery Point"]);
  const dpId = dpIdByName.get(dpName);
  return {
    code: toStr(row["Store Code"]),
    name: toStr(row["Store Name"]),
    location_type: normalizeLocationType(row["location Type"]),
    physical_count_type: normalizePhysicalCount(row["Physical Counted type"]),
    description: "",
    is_active: true,
    ...(dpId ? { delivery_point_id: dpId } : {}),
    delivery_point_name: dpName,
    users: { add: [], remove: [] },
    products: { add: [], remove: [] },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/mappers-store-location.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/mappers/store-location.ts unit/seed-master/mappers-store-location.test.ts
git commit -m "feat(seed): store-location mapper"
```

---

## Task 6: Item-group tree builder

**Files:**
- Create: `scripts/seed-master/mappers/item-group.ts`
- Test: `unit/seed-master/mappers-item-group.test.ts`

**Interfaces:**
- Consumes: `Row`, `ItemGroupTree`, `CreateCategoryDto`, `PlannedSubCategory`, `PlannedItemGroup` from `types.ts`; `toStr` from `mappers/util.ts`.
- Produces: `buildItemGroupTree(rows: Row[]): ItemGroupTree`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/mappers-item-group.test.ts
import { describe, it, expect } from "vitest";
import { buildItemGroupTree } from "../../scripts/seed-master/mappers/item-group";

const rows = [
  { "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY FOOD", "Item Group Code": 1100, "Item Group Description": "SAUCE & SEASONING" },
  { "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY FOOD", "Item Group Code": 1101, "Item Group Description": "FOOD CAN & PICKLES" },
  { "Category Code": 2, "Category Description": "BEVERAGE", "Subcategory Code": 20, "Subcategory Description": "SOFT DRINK", "Item Group Code": 2000, "Item Group Description": "SODA" },
];

describe("buildItemGroupTree", () => {
  it("de-duplicates categories and subcategories and stringifies codes", () => {
    const tree = buildItemGroupTree(rows);
    expect(tree.categories).toEqual([
      { code: "1", name: "FOOD", is_active: true },
      { code: "2", name: "BEVERAGE", is_active: true },
    ]);
    expect(tree.subcategories).toEqual([
      { code: "10", name: "DRY FOOD", parentCategoryCode: "1" },
      { code: "20", name: "SOFT DRINK", parentCategoryCode: "2" },
    ]);
    expect(tree.itemGroups).toEqual([
      { code: "1100", name: "SAUCE & SEASONING", parentSubCategoryCode: "10" },
      { code: "1101", name: "FOOD CAN & PICKLES", parentSubCategoryCode: "10" },
      { code: "2000", name: "SODA", parentSubCategoryCode: "20" },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/mappers-item-group.test.ts`
Expected: FAIL — cannot find module `mappers/item-group`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/mappers/item-group.ts
import type { Row, ItemGroupTree, CreateCategoryDto, PlannedSubCategory, PlannedItemGroup } from "../types";
import { toStr } from "./util";

export function buildItemGroupTree(rows: Row[]): ItemGroupTree {
  const categories = new Map<string, CreateCategoryDto>();
  const subcategories = new Map<string, PlannedSubCategory>();
  const itemGroups = new Map<string, PlannedItemGroup>();

  for (const row of rows) {
    const catCode = toStr(row["Category Code"]);
    const subCode = toStr(row["Subcategory Code"]);
    const igCode = toStr(row["Item Group Code"]);

    if (catCode && !categories.has(catCode)) {
      categories.set(catCode, {
        code: catCode,
        name: toStr(row["Category Description"], catCode),
        is_active: true,
      });
    }
    if (subCode && !subcategories.has(subCode)) {
      subcategories.set(subCode, {
        code: subCode,
        name: toStr(row["Subcategory Description"], subCode),
        parentCategoryCode: catCode,
      });
    }
    if (igCode && !itemGroups.has(igCode)) {
      itemGroups.set(igCode, {
        code: igCode,
        name: toStr(row["Item Group Description"], igCode),
        parentSubCategoryCode: subCode,
      });
    }
  }

  return {
    categories: [...categories.values()],
    subcategories: [...subcategories.values()],
    itemGroups: [...itemGroups.values()],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/mappers-item-group.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/mappers/item-group.ts unit/seed-master/mappers-item-group.test.ts
git commit -m "feat(seed): item-group tree builder"
```

---

## Task 7: Vendor mapper

**Files:**
- Create: `scripts/seed-master/mappers/vendor.ts`
- Test: `unit/seed-master/mappers-vendor.test.ts`

**Interfaces:**
- Consumes: `Row`, `CreateVendorDto` from `types.ts`; `toStr`, `toBool` from `mappers/util.ts`.
- Produces: `mapVendor(row: Row): CreateVendorDto`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/mappers-vendor.test.ts
import { describe, it, expect } from "vitest";
import { mapVendor } from "../../scripts/seed-master/mappers/vendor";

describe("mapVendor", () => {
  it("maps code/name/active plus one address and contact when present", () => {
    const dto = mapVendor({
      code: "A030", name: "Advance Wireless", active: true, payee: "Advance Wireless Co",
      address_line1: 414, address_line2: "Phaholyothin Rd", city: "Bangkok",
      province: "Bangkok", postal_code: "10400", country: "THAILAND",
      telephone: "02-0293665", email: "ar@adv.co",
    });
    expect(dto.code).toBe("A030");
    expect(dto.name).toBe("Advance Wireless");
    expect(dto.is_active).toBe(true);
    expect(dto.business_type).toEqual([]);
    expect(dto.info).toEqual([]);
    expect(dto.vendor_address.add).toEqual([{
      address_type: "main", address_line1: "414", address_line2: "Phaholyothin Rd",
      city: "Bangkok", district: "", sub_district: "", province: "Bangkok",
      postal_code: "10400", country: "THAILAND",
    }]);
    expect(dto.vendor_contact.add).toEqual([{
      name: "Advance Wireless Co", email: "ar@adv.co", phone: "02-0293665", is_primary: true,
    }]);
  });

  it("emits empty add arrays when address line and contact info are absent", () => {
    const dto = mapVendor({ code: "N016", name: "Narong", active: true, payee: null, address_line1: null, telephone: null, email: null });
    expect(dto.vendor_address.add).toEqual([]);
    expect(dto.vendor_contact.add).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/mappers-vendor.test.ts`
Expected: FAIL — cannot find module `mappers/vendor`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/mappers/vendor.ts
import type { Row, CreateVendorDto } from "../types";
import { toStr, toBool } from "./util";

export function mapVendor(row: Row): CreateVendorDto {
  const line1 = toStr(row["address_line1"]);
  const phone = toStr(row["telephone"]);
  const email = toStr(row["email"]);
  const payee = toStr(row["payee"], toStr(row["name"]));

  return {
    code: toStr(row["code"]),
    name: toStr(row["name"]),
    description: "",
    is_active: toBool(row["active"]),
    business_type: [],
    info: [],
    vendor_address: {
      add: line1
        ? [{
            address_type: "main",
            address_line1: line1,
            address_line2: toStr(row["address_line2"]),
            city: toStr(row["city"]),
            district: "",
            sub_district: "",
            province: toStr(row["province"]),
            postal_code: toStr(row["postal_code"]),
            country: toStr(row["country"]),
          }]
        : [],
    },
    vendor_contact: {
      add: phone || email
        ? [{ name: payee, email, phone, is_primary: true }]
        : [],
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/mappers-vendor.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/mappers/vendor.ts unit/seed-master/mappers-vendor.test.ts
git commit -m "feat(seed): vendor mapper"
```

---

## Task 8: Product mapper (with FK resolution & skip-on-unresolved)

**Files:**
- Create: `scripts/seed-master/mappers/product.ts`
- Test: `unit/seed-master/mappers-product.test.ts`

**Interfaces:**
- Consumes: `Row`, `CreateProductDto` from `types.ts`; `toStr`, `numOrNull` from `mappers/util.ts`.
- Produces: `mapProduct(row: Row, maps: ProductLookups): CreateProductDto | null`, and `interface ProductLookups { unitIdByName: Map<string,string>; itemGroupIdByCode: Map<string,string>; taxIdByName: Map<string,string>; }`. Returns `null` when a required FK (inventory unit or item group) cannot be resolved — the orchestrator filters these out.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/mappers-product.test.ts
import { describe, it, expect } from "vitest";
import { mapProduct } from "../../scripts/seed-master/mappers/product";

const maps = {
  unitIdByName: new Map([["KG", "unit-kg"]]),
  itemGroupIdByCode: new Map([["1111", "ig-1111"]]),
  taxIdByName: new Map([["none", "tax-none"], ["vat 7%", "tax-vat7"]]),
};

describe("mapProduct", () => {
  it("maps a product and resolves unit/item-group/tax FKs", () => {
    const dto = mapProduct(
      { "Product Code": 11110001, "Description (Eng)": "Ground Beef ", "Description (Local)": "เนื้อบด", "Bar code": null, "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "none", "Standard cost": 0, "(%) Qty Deviation": 0, "(%) Price Deviation": 0 },
      maps,
    );
    expect(dto).not.toBeNull();
    expect(dto).toMatchObject({
      code: "11110001",
      name: "Ground Beef",
      local_name: "เนื้อบด",
      inventory_unit_id: "unit-kg",
      product_item_group_id: "ig-1111",
      product_status_type: "active",
      tax_profile_id: "tax-none",
      price_deviation_limit: 0,
      qty_deviation_limit: 0,
    });
    expect(dto!.product_info).toEqual({
      is_used_in_recipe: false, is_sold_directly: false, barcode: "", sku: "", price: 0, info: [],
    });
  });

  it("matches tax profile case-insensitively and null when unknown", () => {
    const dto = mapProduct({ "Product Code": "P2", "Description (Eng)": "X", "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "Vat 7%" }, maps);
    expect(dto!.tax_profile_id).toBe("tax-vat7");
    const dto2 = mapProduct({ "Product Code": "P3", "Description (Eng)": "Y", "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "unknown" }, maps);
    expect(dto2!.tax_profile_id).toBeNull();
  });

  it("returns null when inventory unit or item group cannot be resolved", () => {
    expect(mapProduct({ "Product Code": "P4", "Inventory Unit": "L", "Item Group": 1111 }, maps)).toBeNull();
    expect(mapProduct({ "Product Code": "P5", "Inventory Unit": "KG", "Item Group": 9999 }, maps)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/mappers-product.test.ts`
Expected: FAIL — cannot find module `mappers/product`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/mappers/product.ts
import type { Row, CreateProductDto } from "../types";
import { toStr, numOrNull } from "./util";

export interface ProductLookups {
  unitIdByName: Map<string, string>;
  itemGroupIdByCode: Map<string, string>;
  taxIdByName: Map<string, string>;
}

export function mapProduct(row: Row, maps: ProductLookups): CreateProductDto | null {
  const inventory_unit_id = maps.unitIdByName.get(toStr(row["Inventory Unit"]));
  const product_item_group_id = maps.itemGroupIdByCode.get(toStr(row["Item Group"]));
  if (!inventory_unit_id || !product_item_group_id) return null;

  const tax_profile_id = maps.taxIdByName.get(toStr(row["Tax profile"]).toLowerCase()) ?? null;

  return {
    code: toStr(row["Product Code"]),
    name: toStr(row["Description (Eng)"]),
    local_name: toStr(row["Description (Local)"]),
    description: "",
    inventory_unit_id,
    product_item_group_id,
    product_status_type: "active",
    tax_profile_id,
    price_deviation_limit: numOrNull(row["(%) Price Deviation"]),
    qty_deviation_limit: numOrNull(row["(%) Qty Deviation"]),
    product_info: {
      is_used_in_recipe: false,
      is_sold_directly: false,
      barcode: toStr(row["Bar code"]),
      sku: "",
      price: numOrNull(row["Standard cost"]),
      info: [],
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/mappers-product.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/mappers/product.ts unit/seed-master/mappers-product.test.ts
git commit -m "feat(seed): product mapper with FK resolution"
```

---

## Task 9: API client (login + authed GET/POST)

**Files:**
- Create: `scripts/seed-master/api-client.ts`
- Test: `unit/seed-master/api-client.test.ts`

**Interfaces:**
- Consumes: `SeedConfig` from `types.ts`.
- Produces: `interface ApiResult { status: number; ok: boolean; body: any }`, `interface ApiClient { get(path): Promise<ApiResult>; post(path, body): Promise<ApiResult> }`, `login(cfg, fetchFn?, opts?): Promise<string>`, `createApiClient(cfg, token, fetchFn?): ApiClient`. `fetchFn` defaults to global `fetch`; tests inject a fake.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/api-client.test.ts
import { describe, it, expect } from "vitest";
import { login, createApiClient } from "../../scripts/seed-master/api-client";
import type { SeedConfig } from "../../scripts/seed-master/types";

const cfg: SeedConfig = {
  backendUrl: "http://localhost:4000", xAppId: "app-1",
  buCode: "BLAVG", email: "a@b.com", password: "pw",
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("login", () => {
  it("posts credentials and returns access_token", async () => {
    let calledUrl = "", calledInit: RequestInit | undefined;
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      calledUrl = url; calledInit = init;
      return jsonResponse(200, { data: { access_token: "tok-1", refresh_token: "r-1" } });
    }) as unknown as typeof fetch;

    const token = await login(cfg, fakeFetch);
    expect(token).toBe("tok-1");
    expect(calledUrl).toBe("http://localhost:4000/api/auth/login");
    expect((calledInit!.headers as Record<string, string>)["x-app-id"]).toBe("app-1");
    expect(JSON.parse(calledInit!.body as string)).toEqual({ email: "a@b.com", password: "pw" });
  });

  it("retries once on 429 then succeeds", async () => {
    let calls = 0;
    const fakeFetch = (async () => {
      calls++;
      return calls === 1
        ? jsonResponse(429, { retry_after: 0 })
        : jsonResponse(200, { data: { access_token: "tok-2", refresh_token: "r" } });
    }) as unknown as typeof fetch;

    const token = await login(cfg, fakeFetch, { sleep: async () => {} });
    expect(token).toBe("tok-2");
    expect(calls).toBe(2);
  });

  it("throws on non-2xx non-429", async () => {
    const fakeFetch = (async () => jsonResponse(401, { message: "bad creds" })) as unknown as typeof fetch;
    await expect(login(cfg, fakeFetch)).rejects.toThrow(/Login failed: 401/);
  });
});

describe("createApiClient", () => {
  it("adds bearer + x-app-id and parses GET json", async () => {
    let headers: Record<string, string> = {};
    const fakeFetch = (async (_url: string, init?: RequestInit) => {
      headers = init!.headers as Record<string, string>;
      return jsonResponse(200, { data: [{ id: "1", code: "THB" }] });
    }) as unknown as typeof fetch;

    const client = createApiClient(cfg, "tok-9", fakeFetch);
    const res = await client.get("/api/config/BLAVG/currencies");
    expect(res.ok).toBe(true);
    expect(res.body.data[0].code).toBe("THB");
    expect(headers["Authorization"]).toBe("Bearer tok-9");
    expect(headers["x-app-id"]).toBe("app-1");
  });

  it("returns ok:false with parsed body on POST failure", async () => {
    const fakeFetch = (async () => jsonResponse(400, { message: "validation" })) as unknown as typeof fetch;
    const client = createApiClient(cfg, "tok", fakeFetch);
    const res = await client.post("/api/config/BLAVG/units", { name: "KG" });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("validation");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/api-client.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/api-client`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/api-client.ts
import type { SeedConfig } from "./types";

export interface ApiResult {
  status: number;
  ok: boolean;
  body: any;
}

export interface ApiClient {
  get(path: string): Promise<ApiResult>;
  post(path: string, body: unknown): Promise<ApiResult>;
}

interface LoginOpts {
  maxRetries?: number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function login(
  cfg: SeedConfig,
  fetchFn: typeof fetch = fetch,
  opts: LoginOpts = {},
): Promise<string> {
  const maxRetries = opts.maxRetries ?? 3;
  const sleep = opts.sleep ?? defaultSleep;

  for (let attempt = 0; ; attempt++) {
    const res = await fetchFn(`${cfg.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-app-id": cfg.xAppId },
      body: JSON.stringify({ email: cfg.email, password: cfg.password }),
    });
    const json = await res.json().catch(() => ({} as any));

    if (res.status === 429 && attempt < maxRetries) {
      const retryAfter = typeof json?.retry_after === "number" ? json.retry_after : 2 ** attempt;
      await sleep(retryAfter * 1000);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Login failed: ${res.status} ${JSON.stringify(json)}`);
    }
    const token = json?.data?.access_token;
    if (!token) throw new Error("Login response missing access_token");
    return token;
  }
}

export function createApiClient(
  cfg: SeedConfig,
  token: string,
  fetchFn: typeof fetch = fetch,
): ApiClient {
  const authHeaders: Record<string, string> = {
    "x-app-id": cfg.xAppId,
    Authorization: `Bearer ${token}`,
  };

  async function request(method: string, path: string, body?: unknown): Promise<ApiResult> {
    const hasBody = body !== undefined;
    const res = await fetchFn(`${cfg.backendUrl}${path}`, {
      method,
      headers: hasBody ? { ...authHeaders, "Content-Type": "application/json" } : authHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    return { status: res.status, ok: res.ok, body: parsed };
  }

  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/api-client.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/api-client.ts unit/seed-master/api-client.test.ts
git commit -m "feat(seed): auth login + authed api client"
```

---

## Task 10: Orchestrator (skip-existing + dependency ordering)

**Files:**
- Create: `scripts/seed-master/orchestrator.ts`
- Test: `unit/seed-master/orchestrator.test.ts`

**Interfaces:**
- Consumes: `ApiClient` from `api-client.ts`; `ENDPOINTS`, `SeedConfig`, `SeedResult`, `EntityName`, `RawRows` from `types.ts`; all mappers; `ProductLookups` from `mappers/product.ts`.
- Produces:
  - `fetchExistingKeys(client, listPath, keyOf): Promise<Set<string>>`
  - `fetchKeyToId(client, listPath, keyOf): Promise<Map<string,string>>`
  - `seedEntity(opts): Promise<SeedResult[]>` where `opts = { client, entity, listPath, createPath, items, keyOf, dryRun }`
  - `runSeed(cfg, client, rows, opts): Promise<SeedResult[]>` where `opts = { limit: number; dryRun: boolean; enabled: Set<EntityName> }`

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/orchestrator.test.ts
import { describe, it, expect } from "vitest";
import { seedEntity, runSeed } from "../../scripts/seed-master/orchestrator";
import type { ApiClient, ApiResult } from "../../scripts/seed-master/api-client";
import type { SeedConfig, RawRows } from "../../scripts/seed-master/types";

const cfg: SeedConfig = { backendUrl: "http://localhost:4000", xAppId: "a", buCode: "BLAVG", email: "e", password: "p" };

function fakeClient(handlers: {
  get?: (path: string) => ApiResult;
  post?: (path: string, body: any) => ApiResult;
}): ApiClient & { posts: Array<{ path: string; body: any }> } {
  const posts: Array<{ path: string; body: any }> = [];
  return {
    posts,
    get: async (path) => handlers.get?.(path) ?? { status: 200, ok: true, body: { data: [] } },
    post: async (path, body) => {
      posts.push({ path, body });
      return handlers.post?.(path, body) ?? { status: 201, ok: true, body: { data: { id: "new" } } };
    },
  };
}

describe("seedEntity", () => {
  it("skips existing keys and creates new ones", async () => {
    const client = fakeClient({
      get: () => ({ status: 200, ok: true, body: { data: [{ code: "THB" }] } }),
    });
    const results = await seedEntity({
      client, entity: "currency",
      listPath: "/list", createPath: "/list",
      items: [{ code: "THB" }, { code: "USD" }],
      keyOf: (x: any) => x.code, dryRun: false,
    });
    expect(results).toEqual([
      { entity: "currency", key: "THB", status: "skipped" },
      { entity: "currency", key: "USD", status: "created" },
    ]);
    expect(client.posts).toHaveLength(1);
    expect(client.posts[0].body).toEqual({ code: "USD" });
  });

  it("records failed on non-ok POST and continues", async () => {
    const client = fakeClient({ post: () => ({ status: 400, ok: false, body: { message: "bad" } }) });
    const results = await seedEntity({
      client, entity: "unit", listPath: "/u", createPath: "/u",
      items: [{ name: "KG" }], keyOf: (x: any) => x.name, dryRun: false,
    });
    expect(results[0].status).toBe("failed");
    expect(results[0].error).toContain("400");
  });

  it("dry-run marks created without POSTing", async () => {
    const client = fakeClient({});
    const results = await seedEntity({
      client, entity: "unit", listPath: "/u", createPath: "/u",
      items: [{ name: "KG" }], keyOf: (x: any) => x.name, dryRun: true,
    });
    expect(results[0].status).toBe("created");
    expect(client.posts).toHaveLength(0);
  });
});

describe("runSeed item-group linking", () => {
  it("links subcategories/item-groups to parent ids fetched after each level", async () => {
    // GET returns ids per list path; POST always succeeds.
    const client = fakeClient({
      get: (path) => {
        if (path.startsWith("/api/config/BLAVG/product-categories")) return { status: 200, ok: true, body: { data: [{ id: "cat-1", code: "1" }] } };
        if (path.startsWith("/api/config/BLAVG/product-sub-categories")) return { status: 200, ok: true, body: { data: [{ id: "sub-10", code: "10" }] } };
        return { status: 200, ok: true, body: { data: [] } };
      },
    });
    const rows = emptyRows();
    rows.itemGroup = [{ "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY", "Item Group Code": 1100, "Item Group Description": "SAUCE" }];

    const results = await runSeed(cfg, client, rows, { limit: 50, dryRun: false, enabled: new Set(["item-group"]) });

    const subPost = client.posts.find((p) => p.path.includes("product-sub-categories"));
    const igPost = client.posts.find((p) => p.path.includes("product-item-groups"));
    expect(subPost!.body).toMatchObject({ code: "10", product_category_id: "cat-1", cascade_deviation: false });
    expect(igPost!.body).toMatchObject({ code: "1100", product_subcategory_id: "sub-10", cascade_deviation: false });
    expect(results.some((r) => r.entity === "category" && r.status === "created")).toBe(true);
  });
});

function emptyRows(): RawRows {
  return { currency: [], unit: [], taxProfile: [], deliveryPoint: [], department: [], storeLocation: [], itemGroup: [], vendor: [], product: [] };
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/orchestrator.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/orchestrator`.

- [ ] **Step 3: Write the implementation**

```ts
// scripts/seed-master/orchestrator.ts
import type { ApiClient } from "./api-client";
import type { SeedConfig, SeedResult, EntityName, RawRows } from "./types";
import { ENDPOINTS } from "./types";
import { mapCurrency } from "./mappers/currency";
import { mapUnit } from "./mappers/unit";
import { mapTaxProfile } from "./mappers/tax-profile";
import { mapDeliveryPoint } from "./mappers/delivery-point";
import { mapDepartment } from "./mappers/department";
import { mapStoreLocation } from "./mappers/store-location";
import { buildItemGroupTree } from "./mappers/item-group";
import { mapVendor } from "./mappers/vendor";
import { mapProduct } from "./mappers/product";

type KeyOf = (x: any) => unknown;

export async function fetchExistingKeys(
  client: ApiClient,
  listPath: string,
  keyOf: KeyOf,
): Promise<Set<string>> {
  const res = await client.get(`${listPath}?perpage=-1`);
  if (!res.ok) throw new Error(`List failed ${listPath}: ${res.status} ${JSON.stringify(res.body)}`);
  const data: any[] = res.body?.data ?? [];
  return new Set(data.map(keyOf).filter((k) => k != null).map(String));
}

export async function fetchKeyToId(
  client: ApiClient,
  listPath: string,
  keyOf: KeyOf,
): Promise<Map<string, string>> {
  const res = await client.get(`${listPath}?perpage=-1`);
  if (!res.ok) throw new Error(`List failed ${listPath}: ${res.status} ${JSON.stringify(res.body)}`);
  const data: any[] = res.body?.data ?? [];
  const map = new Map<string, string>();
  for (const rec of data) {
    const k = keyOf(rec);
    if (k != null && rec.id != null) map.set(String(k), String(rec.id));
  }
  return map;
}

interface SeedEntityOpts {
  client: ApiClient;
  entity: string;
  listPath: string;
  createPath: string;
  items: any[];
  keyOf: KeyOf;
  dryRun: boolean;
}

export async function seedEntity(opts: SeedEntityOpts): Promise<SeedResult[]> {
  const { client, entity, listPath, createPath, items, keyOf, dryRun } = opts;
  const existing = await fetchExistingKeys(client, listPath, keyOf);
  const results: SeedResult[] = [];

  for (const item of items) {
    const key = String(keyOf(item));
    if (existing.has(key)) {
      results.push({ entity, key, status: "skipped" });
      continue;
    }
    if (dryRun) {
      results.push({ entity, key, status: "created" });
      existing.add(key);
      continue;
    }
    const res = await client.post(createPath, item);
    if (res.ok) {
      results.push({ entity, key, status: "created" });
      existing.add(key);
    } else {
      results.push({ entity, key, status: "failed", error: `${res.status} ${JSON.stringify(res.body)}` });
    }
  }
  return results;
}

interface RunOptions {
  limit: number;
  dryRun: boolean;
  enabled: Set<EntityName>;
}

export async function runSeed(
  cfg: SeedConfig,
  client: ApiClient,
  rows: RawRows,
  opts: RunOptions,
): Promise<SeedResult[]> {
  const bu = cfg.buCode;
  const { limit, dryRun, enabled } = opts;
  const out: SeedResult[] = [];
  const on = (e: EntityName) => enabled.has(e);

  if (on("currency")) {
    out.push(...await seedEntity({ client, entity: "currency", listPath: ENDPOINTS.currencies(bu), createPath: ENDPOINTS.currencies(bu), items: rows.currency.map(mapCurrency), keyOf: (x) => x.code, dryRun }));
  }
  if (on("unit")) {
    out.push(...await seedEntity({ client, entity: "unit", listPath: ENDPOINTS.units(bu), createPath: ENDPOINTS.units(bu), items: rows.unit.map(mapUnit), keyOf: (x) => x.name, dryRun }));
  }
  if (on("tax-profile")) {
    out.push(...await seedEntity({ client, entity: "tax-profile", listPath: ENDPOINTS.taxProfiles(bu), createPath: ENDPOINTS.taxProfiles(bu), items: rows.taxProfile.map(mapTaxProfile), keyOf: (x) => x.name, dryRun }));
  }
  if (on("delivery-point")) {
    out.push(...await seedEntity({ client, entity: "delivery-point", listPath: ENDPOINTS.deliveryPoints(bu), createPath: ENDPOINTS.deliveryPoints(bu), items: rows.deliveryPoint.map(mapDeliveryPoint), keyOf: (x) => x.name, dryRun }));
  }
  if (on("department")) {
    out.push(...await seedEntity({ client, entity: "department", listPath: ENDPOINTS.departments(bu), createPath: ENDPOINTS.departments(bu), items: rows.department.map(mapDepartment), keyOf: (x) => x.code, dryRun }));
  }
  if (on("store-location")) {
    const dpIdByName = await fetchKeyToId(client, ENDPOINTS.deliveryPoints(bu), (r) => r.name);
    out.push(...await seedEntity({ client, entity: "store-location", listPath: ENDPOINTS.locations(bu), createPath: ENDPOINTS.locations(bu), items: rows.storeLocation.map((r) => mapStoreLocation(r, dpIdByName)), keyOf: (x) => x.code, dryRun }));
  }
  if (on("item-group")) {
    const tree = buildItemGroupTree(rows.itemGroup);
    out.push(...await seedEntity({ client, entity: "category", listPath: ENDPOINTS.productCategories(bu), createPath: ENDPOINTS.productCategories(bu), items: tree.categories, keyOf: (x) => x.code, dryRun }));

    const catIdByCode = await fetchKeyToId(client, ENDPOINTS.productCategories(bu), (r) => r.code);
    const subItems = tree.subcategories
      .filter((s) => catIdByCode.has(s.parentCategoryCode))
      .map((s) => ({ code: s.code, name: s.name, is_active: true, product_category_id: catIdByCode.get(s.parentCategoryCode)!, cascade_deviation: false }));
    out.push(...await seedEntity({ client, entity: "sub-category", listPath: ENDPOINTS.productSubCategories(bu), createPath: ENDPOINTS.productSubCategories(bu), items: subItems, keyOf: (x) => x.code, dryRun }));

    const subIdByCode = await fetchKeyToId(client, ENDPOINTS.productSubCategories(bu), (r) => r.code);
    const igItems = tree.itemGroups
      .filter((g) => subIdByCode.has(g.parentSubCategoryCode))
      .map((g) => ({ code: g.code, name: g.name, is_active: true, product_subcategory_id: subIdByCode.get(g.parentSubCategoryCode)!, cascade_deviation: false }));
    out.push(...await seedEntity({ client, entity: "item-group", listPath: ENDPOINTS.productItemGroups(bu), createPath: ENDPOINTS.productItemGroups(bu), items: igItems, keyOf: (x) => x.code, dryRun }));
  }
  if (on("vendor")) {
    const items = rows.vendor.slice(0, limit).map(mapVendor);
    out.push(...await seedEntity({ client, entity: "vendor", listPath: ENDPOINTS.vendors(bu), createPath: ENDPOINTS.vendors(bu), items, keyOf: (x) => x.code, dryRun }));
  }
  if (on("product")) {
    const unitIdByName = await fetchKeyToId(client, ENDPOINTS.units(bu), (r) => r.name);
    const itemGroupIdByCode = await fetchKeyToId(client, ENDPOINTS.productItemGroups(bu), (r) => r.code);
    const taxIdByName = await fetchKeyToId(client, ENDPOINTS.taxProfiles(bu), (r) => String(r.name).toLowerCase());
    const mapped = rows.product
      .map((r) => mapProduct(r, { unitIdByName, itemGroupIdByCode, taxIdByName }))
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .slice(0, limit);
    out.push(...await seedEntity({ client, entity: "product", listPath: ENDPOINTS.products(bu), createPath: ENDPOINTS.products(bu), items: mapped, keyOf: (x) => x.code, dryRun }));
  }

  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/orchestrator.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-master/orchestrator.ts unit/seed-master/orchestrator.test.ts
git commit -m "feat(seed): orchestrator with skip-existing and dependency ordering"
```

---

## Task 11: CLI entry, package script, README, and dry-run smoke

**Files:**
- Create: `scripts/seed-master/index.ts`
- Modify: `package.json` (add `"seed:master"` script)
- Modify: `.env.example` (document `SEED_*` vars)
- Create: `scripts/seed-master/README.md`
- Test: `unit/seed-master/cli-args.test.ts`

**Interfaces:**
- Consumes: everything above.
- Produces: `parseArgs(argv: string[]): CliArgs`, `resolveEnabled(args): Set<EntityName>`, `resolveWorkbookPath(file): string`, `printSummary(results): string`, `main()`. `CliArgs = { file: string; bu?: string; limit: number; only?: EntityName[]; skip?: EntityName[]; dryRun: boolean; yes: boolean; verbose: boolean }`.

- [ ] **Step 1: Write the failing test**

```ts
// unit/seed-master/cli-args.test.ts
import { describe, it, expect } from "vitest";
import { parseArgs, resolveEnabled, resolveWorkbookPath } from "../../scripts/seed-master/index";

describe("parseArgs", () => {
  it("uses sane defaults", () => {
    expect(parseArgs([])).toEqual({ file: "avg", limit: 50, dryRun: false, yes: false, verbose: false });
  });
  it("parses all flags", () => {
    const a = parseArgs(["--file", "fifo", "--bu", "BLAVG", "--limit", "10", "--only", "currency,unit", "--dry-run", "--yes", "--verbose"]);
    expect(a).toEqual({ file: "fifo", bu: "BLAVG", limit: 10, only: ["currency", "unit"], dryRun: true, yes: true, verbose: true });
  });
  it("throws on unknown flag", () => {
    expect(() => parseArgs(["--nope"])).toThrow(/Unknown argument: --nope/);
  });
});

describe("resolveEnabled", () => {
  it("returns all entities by default", () => {
    expect(resolveEnabled(parseArgs([])).size).toBe(9);
  });
  it("honours --only", () => {
    expect([...resolveEnabled(parseArgs(["--only", "vendor,product"]))]).toEqual(["vendor", "product"]);
  });
  it("honours --skip", () => {
    const set = resolveEnabled(parseArgs(["--skip", "product,vendor"]));
    expect(set.has("product")).toBe(false);
    expect(set.has("currency")).toBe(true);
  });
});

describe("resolveWorkbookPath", () => {
  it("maps aliases and passes through explicit paths", () => {
    expect(resolveWorkbookPath("avg")).toBe("sample_seed_data/Preconfig_CARMEN_AVG.xlsx");
    expect(resolveWorkbookPath("fifo")).toBe("sample_seed_data/Preconfig_CARMEN_FIFO.xlsx");
    expect(resolveWorkbookPath("/tmp/custom.xlsx")).toBe("/tmp/custom.xlsx");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test:unit -- unit/seed-master/cli-args.test.ts`
Expected: FAIL — cannot find module `scripts/seed-master/index`.

- [ ] **Step 3: Write the implementation**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test:unit -- unit/seed-master/cli-args.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Add the package.json script**

Add to the `"scripts"` block in `package.json`:

```json
    "seed:master": "bun run scripts/seed-master/index.ts",
```

- [ ] **Step 6: Document the env vars in `.env.example`**

Append to `.env.example`:

```
# --- Master seed (bun run seed:master) ---
# Backend + BU + credentials for scripts/seed-master. BACKEND_URL/X_APP_ID fall
# back to the frontend config.json when unset; the rest are required.
# SEED_BACKEND_URL=http://localhost:4000
# SEED_X_APP_ID=
SEED_BU_CODE=BLAVG
SEED_EMAIL=admin@blueledgers.com
SEED_PASSWORD=12345678
# SEED_CONFIG_PATH=../carmen-inventory-frontend-react/dist/config.json
```

- [ ] **Step 7: Write the README**

```markdown
<!-- scripts/seed-master/README.md -->
# Master seed

Reads a Preconfig Excel workbook (`sample_seed_data/`) and seeds a sample subset
of master data into an existing BU via the backend REST API.

## Usage

    bun run seed:master --dry-run                 # preview, no writes (read-only)
    bun run seed:master --bu BLAVG --yes          # live seed into BLAVG
    bun run seed:master --file fifo --limit 20    # use the FIFO workbook, 20 product/vendor rows
    bun run seed:master --only currency,unit      # seed selected entities only
    bun run seed:master --skip product,vendor     # seed everything except the big lists

Config comes from `SEED_*` env vars (in `.env.local`), falling back to the
frontend `config.json` for `BACKEND_URL`/`X_APP_ID`. `SEED_BU_CODE`,
`SEED_EMAIL`, `SEED_PASSWORD` are required (or pass `--bu`).

## Behaviour

- **Skip-existing:** records whose identity (code, or name for unit/tax-profile/
  delivery-point) already exists in the BU are skipped.
- **Sample subset:** lookups seed in full; Product and Vendor are capped by
  `--limit` (default 50). Products whose unit/item-group cannot be resolved are
  skipped.
- **Safety:** seeding a non-localhost target requires `--yes`. `--dry-run` is
  always read-only.
- **Out of scope:** Company Profile / BU creation.
```

- [ ] **Step 8: Run the full unit suite**

Run: `bun run test:unit`
Expected: PASS — all `unit/seed-master/*` tests plus the pre-existing suite green.

- [ ] **Step 9: Dry-run smoke (manual, read-only)**

Ensure `.env.local` has `SEED_BU_CODE`/`SEED_EMAIL`/`SEED_PASSWORD` and the backend is reachable (local `:4000` Docker, or set `SEED_BACKEND_URL`). Then:

Run: `bun run seed:master --dry-run`
Expected: prints the banner, logs in, fetches existing records, prints a summary table with `created`/`skipped` counts and **no** failures. No records are written (verify a list endpoint count is unchanged, e.g. via the UI or `curl`).

- [ ] **Step 10: Commit**

```bash
git add scripts/seed-master/index.ts scripts/seed-master/README.md unit/seed-master/cli-args.test.ts package.json .env.example
git commit -m "feat(seed): CLI entry, package script, docs"
```

---

## Self-Review

**1. Spec coverage**

| Spec section | Task(s) |
|---|---|
| Standalone Bun CLI, `bun run seed:master` | 11 |
| Layered architecture (config/api-client/parser/orchestrator/mappers/index) | 1–11 |
| `xlsx` devDependency + package script | 3, 11 |
| Seed order & FK dependencies (9 steps) | 10 |
| Lookups full; Product/Vendor capped by `--limit` (default 50) | 10 (slice), 11 (default) |
| Product subset filter (skip unresolved FKs) | 8 (`null`), 10 (`.filter().slice()`) |
| Item-group Category→Subcategory→ItemGroup parent linking | 6, 10 |
| Skip Company Profile | 3 (SHEET_MAP omits it) |
| Config resolution env > config.json > error | 2 |
| `SEED_*` env vars, creds in `.env.local` | 2, 11 |
| CLI flags `--file/--bu/--limit/--only/--skip/--dry-run/--yes/--verbose` | 11 |
| Skip-existing idempotency | 10 |
| Non-localhost `--yes` safety gate | 11 |
| Startup banner | 11 |
| Per-row resilience + typed errors + 429 backoff | 9, 10 |
| End-of-run summary table + exit code | 11 |
| Unit tests (parser/mappers/config/orchestrator), no live backend | 2–10 |

All spec sections map to a task.

**2. Placeholder scan:** No "TBD"/"TODO"/"handle edge cases"/"similar to". Every code step shows complete code; every test step shows real assertions.

**3. Type consistency:** `SeedConfig`, `SeedResult`, `EntityName`, `ApiClient`/`ApiResult`, `ENDPOINTS`, `ProductLookups`, `CliArgs`, and all Create DTOs are defined once (Tasks 1/2/8/9/11) and referenced with the same names/shapes downstream. `keyOf` reads `code` for code-identity entities and `name` for unit/tax-profile/delivery-point consistently in mappers (Task 4–8) and orchestrator (Task 10). `mapProduct` returns `CreateProductDto | null`; the orchestrator filters `null` before slicing. `mapStoreLocation(row, dpIdByName)` signature matches its orchestrator call site.

**Note on `--verbose`:** parsed and surfaced in the banner; per-payload logging is intentionally minimal (YAGNI) — the summary table and failure list already give actionable output. No further wiring required.
