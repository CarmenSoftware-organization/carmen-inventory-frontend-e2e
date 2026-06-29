// unit/seed-master/orchestrator.test.ts
import { describe, it, expect } from "vitest";
import { seedEntity, runSeed } from "../../scripts/seed-master/orchestrator";
import type { ApiClient, ApiResult } from "../../scripts/seed-master/api-client";
import type { SeedConfig, RawRows, EntityName } from "../../scripts/seed-master/types";

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

/**
 * Stateful fake backend: GET returns everything POSTed to that path so far
 * (each record gets a backend-assigned id), so skip-existing and parent-id
 * linking behave like a real backend across the create -> fetch-id ->
 * create-children flow.
 */
function statefulClient(): ApiClient & { posts: Array<{ path: string; body: any }> } {
  const byPath = new Map<string, any[]>();
  const posts: Array<{ path: string; body: any }> = [];
  let seq = 0;
  const base = (p: string) => p.split("?")[0];
  return {
    posts,
    get: async (path) => ({ status: 200, ok: true, body: { data: byPath.get(base(path)) ?? [] } }),
    post: async (path, body) => {
      posts.push({ path, body });
      const rec = { ...body, id: `id-${++seq}` };
      const arr = byPath.get(base(path)) ?? [];
      arr.push(rec);
      byPath.set(base(path), arr);
      return { status: 201, ok: true, body: { data: rec } };
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

  it("records failed when POST throws (network error) and continues to the next item", async () => {
    let calls = 0;
    const client: ApiClient & { posts: any[] } = {
      posts: [],
      get: async () => ({ status: 200, ok: true, body: { data: [] } }),
      post: async () => { calls++; throw new Error("fetch failed"); },
    };
    const results = await seedEntity({
      client, entity: "currency", listPath: "/c", createPath: "/c",
      items: [{ code: "A" }, { code: "B" }], keyOf: (x: any) => x.code, dryRun: false,
    });
    expect(results.map((r) => r.status)).toEqual(["failed", "failed"]);
    expect(results[0].error).toContain("fetch failed");
    expect(calls).toBe(2);
  });
});

describe("runSeed item-group linking", () => {
  const itemGroupRows: RawRows["itemGroup"] = [
    { "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY", "Item Group Code": 1100, "Item Group Description": "SAUCE" },
  ];

  it("creates the tree and links children to parent ids fetched after each level", async () => {
    const client = statefulClient();
    const rows = emptyRows();
    rows.itemGroup = itemGroupRows;

    const results = await runSeed(cfg, client, rows, { limit: 50, dryRun: false, enabled: new Set<EntityName>(["item-group"]) });

    const catPost = client.posts.find((p) => p.path.includes("product-categories"));
    const subPost = client.posts.find((p) => p.path.includes("product-sub-categories"));
    const igPost = client.posts.find((p) => p.path.includes("product-item-groups"));

    expect(catPost!.body).toMatchObject({ code: "1", name: "FOOD", is_active: true });
    // category POSTed first -> id-1; sub-category POSTed next -> id-2.
    expect(subPost!.body).toMatchObject({ code: "10", product_category_id: "id-1", cascade_deviation: false });
    expect(igPost!.body).toMatchObject({ code: "1100", product_subcategory_id: "id-2", cascade_deviation: false });
    expect(results.some((r) => r.entity === "category" && r.status === "created")).toBe(true);
    expect(results.some((r) => r.entity === "sub-category" && r.status === "created")).toBe(true);
    expect(results.some((r) => r.entity === "item-group" && r.status === "created")).toBe(true);
  });

  it("is idempotent — a second run skips the whole tree and POSTs nothing new", async () => {
    const client = statefulClient();
    const rows = emptyRows();
    rows.itemGroup = itemGroupRows;
    const opts = { limit: 50, dryRun: false, enabled: new Set<EntityName>(["item-group"]) };

    await runSeed(cfg, client, rows, opts);
    const postsAfterFirst = client.posts.length;
    const second = await runSeed(cfg, client, rows, opts);

    expect(client.posts.length).toBe(postsAfterFirst);
    expect(second.length).toBeGreaterThan(0);
    expect(second.every((r) => r.status === "skipped")).toBe(true);
  });
});

function emptyRows(): RawRows {
  return { currency: [], unit: [], taxProfile: [], deliveryPoint: [], department: [], storeLocation: [], itemGroup: [], vendor: [], product: [] };
}
