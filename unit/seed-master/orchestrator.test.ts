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
