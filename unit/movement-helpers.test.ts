import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { assertReadOnly, hasDb, schemaOf, sql } from "../tests/helpers/movement/db";
import { DocState } from "../tests/helpers/movement/state";
import { Signals } from "../tests/helpers/movement/signals";

describe("movement db guard", () => {
  it("accepts SELECT and read-only WITH", () => {
    expect(() => assertReadOnly("select 1")).not.toThrow();
    expect(() => assertReadOnly("  WITH x AS (select 1) select * from x")).not.toThrow();
  });

  it("does not trip on column names that contain a write keyword", () => {
    expect(() => assertReadOnly("select deleted_at, updated_at, created_at from t where deleted_at is null")).not.toThrow();
  });

  it("rejects writes, including DML hidden in a CTE", () => {
    expect(() => assertReadOnly("update t set a = 1")).toThrow(/read-only/);
    expect(() => assertReadOnly("with d as (delete from t returning *) select * from d")).toThrow(/read-only/);
    expect(() => assertReadOnly("select 1; drop table t")).toThrow(/read-only/);
  });

  it("builds the quoted tenant schema from a BU code", () => {
    expect(schemaOf("CARMEN-AVG")).toBe('"CARMEN_AVG"');
  });

  describe("without E2E_DB_URL", () => {
    const saved = process.env.E2E_DB_URL;
    beforeEach(() => {
      delete process.env.E2E_DB_URL;
    });
    afterEach(() => {
      if (saved === undefined) delete process.env.E2E_DB_URL;
      else process.env.E2E_DB_URL = saved;
    });

    it("reports no DB and refuses to query, naming the variable", () => {
      expect(hasDb()).toBe(false);
      expect(() => sql("select 1")).toThrow(/E2E_DB_URL/);
    });

    it("checks the query before the connection", () => {
      expect(() => sql("delete from t")).toThrow(/read-only/);
    });
  });
});

describe("DocState", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "docstate-"));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("starts empty without creating a file", () => {
    const s = new DocState(join(dir, "nested", "state.json"));
    expect(s.get("sr")).toBeUndefined();
    expect(existsSync(s.file)).toBe(false);
  });

  it("persists across instances and merges updates into the entry", () => {
    const file = join(dir, "nested", "state.json");
    new DocState(file).put("sr", { id: "1", no: "", status: "draft" });
    new DocState(file).put("sr", { id: "1", no: "SR001", status: "in_progress", stage: "HOD" });
    expect(new DocState(file).get("sr")).toEqual({ id: "1", no: "SR001", status: "in_progress", stage: "HOD" });
  });

  it("need() names the missing key and the hint", () => {
    const s = new DocState(join(dir, "state.json"));
    expect(() => s.need("sr", "run the pre phase first")).toThrow(/"sr".*run the pre phase first/);
    s.put("sr", { id: "1", no: "SR001", status: "draft" });
    expect(s.need("sr", "unused").no).toBe("SR001");
  });
});

/** Minimal stand-in for the page events Signals listens to. */
function fakePage() {
  const handlers: Record<string, ((arg: any) => unknown)[]> = {};
  const page = { on: (event: string, fn: (arg: any) => unknown) => (handlers[event] ??= []).push(fn) };
  const emit = async (event: string, arg: unknown) => {
    for (const fn of handlers[event] ?? []) await fn(arg);
  };
  return { page: page as unknown as Page, emit };
}

const response = (method: string, url: string, status: number, body = "{}") => ({
  status: () => status,
  url: () => url,
  request: () => ({ method: () => method }),
  text: async () => body,
});

describe("Signals", () => {
  it("counts page errors and unexpected api errors as hard, console errors as soft", async () => {
    const { page, emit } = fakePage();
    const s = new Signals(page);
    await emit("pageerror", new Error("boom"));
    await emit("console", { type: () => "error", text: () => "React warning" });
    await emit("console", { type: () => "error", text: () => "Failed to load resource: 500" });
    await emit("console", { type: () => "log", text: () => "noise" });
    await emit("response", response("POST", "https://be.example/api/x", 500, '{"error":"x"}'));
    expect(s.items.map((i) => i.kind)).toEqual(["pageerror", "console", "api"]);
    expect(s.hard.map((i) => i.kind)).toEqual(["pageerror", "api"]);
    expect(s.items[2].text).toContain("POST /api/x → 500");
  });

  it("ignores successes and non-api calls, skips declared refusals, keeps minors soft", async () => {
    const { page, emit } = fakePage();
    const s = new Signals(page);
    s.expectApiError(/\/submit → 422/);
    s.minor(/\/cost\/.+ → 422/, "no stock yet");
    await emit("response", response("GET", "https://be.example/api/ok", 200));
    await emit("response", response("GET", "https://fe.example/assets/app.js", 404));
    await emit("response", response("PATCH", "https://be.example/api/sr/1/submit", 422));
    await emit("response", response("GET", "https://be.example/api/cost/products/9", 422));
    expect(s.items).toHaveLength(1);
    expect(s.items[0].minor).toBe("no stock yet");
    expect(s.hard).toHaveLength(0);
  });

  it("keeps the status line when the body is already gone", async () => {
    const { page, emit } = fakePage();
    const s = new Signals(page);
    await emit("response", {
      ...response("DELETE", "https://be.example/api/x/1", 404),
      text: async () => {
        throw new Error("disposed");
      },
    });
    expect(s.items[0].text).toBe("DELETE /api/x/1 → 404 ");
  });
});
