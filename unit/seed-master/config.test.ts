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
