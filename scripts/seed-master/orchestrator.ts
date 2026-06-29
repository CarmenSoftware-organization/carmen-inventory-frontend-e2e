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

/** Post a batch of items directly, without skip-existing check. Used for linked entities. */
async function postBatch(
  client: ApiClient,
  entity: string,
  createPath: string,
  items: any[],
  keyOf: KeyOf,
  dryRun: boolean,
  out: SeedResult[],
): Promise<void> {
  for (const item of items) {
    const key = String(keyOf(item));
    if (dryRun) {
      out.push({ entity, key, status: "created" });
      continue;
    }
    const res = await client.post(createPath, item);
    if (res.ok) {
      out.push({ entity, key, status: "created" });
    } else {
      out.push({ entity, key, status: "failed", error: `${res.status} ${JSON.stringify(res.body)}` });
    }
  }
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

    // Seed categories directly (POST) — linking relies on fetchKeyToId after each level
    await postBatch(client, "category", ENDPOINTS.productCategories(bu), tree.categories, (x) => x.code, dryRun, out);

    // Fetch category IDs, build and POST sub-categories with parent linkage
    const catIdByCode = await fetchKeyToId(client, ENDPOINTS.productCategories(bu), (r) => r.code);
    const subItems = tree.subcategories
      .filter((s) => catIdByCode.has(s.parentCategoryCode))
      .map((s) => ({ code: s.code, name: s.name, is_active: true, product_category_id: catIdByCode.get(s.parentCategoryCode)!, cascade_deviation: false }));
    await postBatch(client, "sub-category", ENDPOINTS.productSubCategories(bu), subItems, (x) => x.code, dryRun, out);

    // Fetch sub-category IDs, build and POST item-groups with parent linkage
    const subIdByCode = await fetchKeyToId(client, ENDPOINTS.productSubCategories(bu), (r) => r.code);
    const igItems = tree.itemGroups
      .filter((g) => subIdByCode.has(g.parentSubCategoryCode))
      .map((g) => ({ code: g.code, name: g.name, is_active: true, product_subcategory_id: subIdByCode.get(g.parentSubCategoryCode)!, cascade_deviation: false }));
    await postBatch(client, "item-group", ENDPOINTS.productItemGroups(bu), igItems, (x) => x.code, dryRun, out);
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
