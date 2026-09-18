/**
 * Covers every entity branch of runSeed(). orchestrator.test.ts already drives
 * the item-group parent/child chain and the skip-existing path; this file walks
 * the remaining branches and the enabled-set gating.
 */
import { describe, it, expect } from "vitest";
import { runSeed } from "../../scripts/seed-master/orchestrator";
import type { ApiClient, ApiResult } from "../../scripts/seed-master/api-client";
import type { SeedConfig, RawRows, EntityName, Row } from "../../scripts/seed-master/types";

const cfg: SeedConfig = {
  backendUrl: "http://localhost:4000",
  xAppId: "a",
  buCode: "BLAVG",
  email: "e",
  password: "p",
};

/** GET returns whatever has been POSTed to that path, with a backend-assigned id. */
function statefulClient(seed: Record<string, unknown[]> = {}) {
  const byPath = new Map<string, unknown[]>(Object.entries(seed));
  const posts: Array<{ path: string; body: any }> = [];
  let seq = 0;
  const base = (p: string) => p.split("?")[0];
  const client: ApiClient & { posts: typeof posts } = {
    posts,
    get: async (path): Promise<ApiResult> => ({
      status: 200,
      ok: true,
      body: { data: byPath.get(base(path)) ?? [] },
    }),
    post: async (path, body): Promise<ApiResult> => {
      posts.push({ path, body });
      const rec = { ...(body as object), id: `id-${++seq}` };
      byPath.set(base(path), [...(byPath.get(base(path)) ?? []), rec]);
      return { status: 201, ok: true, body: { data: rec } };
    },
  };
  return client;
}

const emptyRows: RawRows = {
  currency: [],
  unit: [],
  taxProfile: [],
  deliveryPoint: [],
  department: [],
  storeLocation: [],
  itemGroup: [],
  vendor: [],
  product: [],
};

const rows = (over: Partial<RawRows>): RawRows => ({ ...emptyRows, ...over });
const opts = (enabled: EntityName[], over: { limit?: number; dryRun?: boolean } = {}) => ({
  limit: over.limit ?? 50,
  dryRun: over.dryRun ?? false,
  enabled: new Set<EntityName>(enabled),
});

const row = (o: Record<string, unknown>): Row => o as Row;

describe("runSeed entity gating", () => {
  it("does nothing when no entity is enabled", async () => {
    const client = statefulClient();

    const out = await runSeed(cfg, client, rows({ currency: [row({ Code: "THB" })] }), opts([]));

    expect(out).toEqual([]);
    expect(client.posts).toEqual([]);
  });

  it("seeds only the enabled entity, leaving the others untouched", async () => {
    const client = statefulClient();
    const data = rows({
      currency: [row({ Code: "THB", Name: "Baht" })],
      department: [row({ Code: "HK", Description: "Housekeeping" })],
    });

    const out = await runSeed(cfg, client, data, opts(["currency"]));

    expect(out.map((r) => r.entity)).toEqual(["currency"]);
    expect(client.posts.every((p) => p.path.includes("/currencies"))).toBe(true);
  });
});

describe("runSeed per-entity branches", () => {
  it("creates currencies at the BU-scoped endpoint", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ currency: [row({ Code: "THB", Name: "Baht", Symbol: "฿" })] }),
      opts(["currency"]),
    );

    expect(out).toEqual([{ entity: "currency", key: "THB", status: "created" }]);
    expect(client.posts[0].path).toBe("/api/config/BLAVG/currencies");
  });

  it("keys units by name, not code", async () => {
    const client = statefulClient();

    const out = await runSeed(cfg, client, rows({ unit: [row({ Code: "KG" })] }), opts(["unit"]));

    expect(out).toEqual([{ entity: "unit", key: "KG", status: "created" }]);
  });

  it("creates tax profiles", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ taxProfile: [row({ Name: "VAT7", Value: 7 })] }),
      opts(["tax-profile"]),
    );

    expect(out).toEqual([{ entity: "tax-profile", key: "VAT7", status: "created" }]);
    expect(client.posts[0].body).toMatchObject({ name: "VAT7", tax_rate: 7 });
  });

  it("creates delivery points", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ deliveryPoint: [row({ Code: "DP1", Description: "Main Door" })] }),
      opts(["delivery-point"]),
    );

    expect(out).toEqual([{ entity: "delivery-point", key: "Main Door", status: "created" }]);
  });

  it("creates departments", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ department: [row({ Code: "HK", Description: "Housekeeping" })] }),
      opts(["department"]),
    );

    expect(out).toEqual([{ entity: "department", key: "HK", status: "created" }]);
  });

  it("links a store location to the delivery point id fetched from the backend", async () => {
    const client = statefulClient({
      "/api/config/BLAVG/delivery-points": [{ id: "dp-9", name: "Main Door" }],
    });

    await runSeed(
      cfg,
      client,
      rows({
        storeLocation: [
          row({ "Store Code": "ST1", "Store Name": "Main Store", "Delivery Point": "Main Door" }),
        ],
      }),
      opts(["store-location"]),
    );

    expect(client.posts[0].body).toMatchObject({ code: "ST1", delivery_point_id: "dp-9" });
  });

  it("still creates a store location whose delivery point is unknown, without an id", async () => {
    const client = statefulClient();

    await runSeed(
      cfg,
      client,
      rows({
        storeLocation: [
          row({ "Store Code": "ST1", "Store Name": "Main", "Delivery Point": "Nowhere" }),
        ],
      }),
      opts(["store-location"]),
    );

    expect(client.posts[0].body).not.toHaveProperty("delivery_point_id");
  });

  it("creates vendors", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ vendor: [row({ code: "V001", name: "Acme" })] }),
      opts(["vendor"]),
    );

    expect(out).toEqual([{ entity: "vendor", key: "V001", status: "created" }]);
  });

  it("caps each entity at the requested limit", async () => {
    const client = statefulClient();
    const vendors = [1, 2, 3, 4, 5].map((n) => row({ code: `V00${n}`, name: `V${n}` }));

    const out = await runSeed(cfg, client, rows({ vendor: vendors }), opts(["vendor"], { limit: 2 }));

    expect(out).toHaveLength(2);
  });

  it("creates products once their unit, item group and tax profile resolve", async () => {
    const client = statefulClient({
      "/api/config/BLAVG/units": [{ id: "u-1", name: "KG" }],
      "/api/config/BLAVG/product-item-groups": [{ id: "ig-1", code: "IG1" }],
      "/api/config/BLAVG/tax-profiles": [{ id: "tx-1", name: "VAT7" }],
    });

    const out = await runSeed(
      cfg,
      client,
      rows({
        product: [
          row({
            "Product Code": "P001",
            "Description (Eng)": "Rice",
            "Inventory Unit": "KG",
            "Item Group": "IG1",
            "Tax profile": "vat7",
          }),
        ],
      }),
      opts(["product"]),
    );

    expect(out).toEqual([{ entity: "product", key: "P001", status: "created" }]);
    expect(client.posts[0].body).toMatchObject({
      code: "P001",
      inventory_unit_id: "u-1",
      product_item_group_id: "ig-1",
      tax_profile_id: "tx-1",
    });
  });

  it("drops a product whose unit or item group cannot be resolved", async () => {
    const client = statefulClient({
      "/api/config/BLAVG/units": [{ id: "u-1", name: "KG" }],
    });

    const out = await runSeed(
      cfg,
      client,
      rows({
        product: [
          row({ "Product Code": "P001", "Inventory Unit": "KG", "Item Group": "MISSING" }),
        ],
      }),
      opts(["product"]),
    );

    expect(out).toEqual([]);
    expect(client.posts).toEqual([]);
  });

  // NOTE: a dry run reports status "created", exactly like a real create — the
  // only observable difference is that nothing was POSTed. Asserted as-is so a
  // future dedicated "would-create" status shows up here as a deliberate change.
  it("dry run posts nothing but still reports the rows as created", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({ currency: [row({ Code: "THB", Name: "Baht" })] }),
      opts(["currency"], { dryRun: true }),
    );

    expect(out).toEqual([{ entity: "currency", key: "THB", status: "created" }]);
    expect(client.posts).toEqual([]);
  });

  it("runs several enabled entities in one pass", async () => {
    const client = statefulClient();

    const out = await runSeed(
      cfg,
      client,
      rows({
        currency: [row({ Code: "THB", Name: "Baht" })],
        unit: [row({ Code: "KG" })],
        department: [row({ Code: "HK", Description: "Housekeeping" })],
      }),
      opts(["currency", "unit", "department"]),
    );

    expect(out.map((r) => r.entity)).toEqual(["currency", "unit", "department"]);
  });
});
