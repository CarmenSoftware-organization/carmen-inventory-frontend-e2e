/**
 * Covers the network/UI half of tests/helpers/bu.ts with a stub Page. The pure
 * half (defaultBu / buLabel / escapeRegExp) is covered in bu.test.ts.
 *
 * The SPA keeps its bearer token in module memory, so the helper reads the
 * profile by intercepting the app's OWN request rather than issuing one — the
 * stub reproduces that shape: /config.json via page.request, the profile via
 * waitForResponse around a page.goto.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BusinessUnit } from "../tests/helpers/bu";

const { switcherOpen, itemClick, waitForToast, itemByName } = vi.hoisted(() => {
  const itemClick = vi.fn();
  return {
    switcherOpen: vi.fn(),
    itemClick,
    waitForToast: vi.fn(),
    itemByName: vi.fn(() => ({ click: itemClick })),
  };
});

vi.mock("../tests/pages/bu-switcher.page", () => ({
  BuSwitcherPage: class {
    open = switcherOpen;
    itemByName = itemByName;
    waitForToast = waitForToast;
  },
}));

import { getBusinessUnits, ensureActiveBu } from "../tests/helpers/bu";

const CONFIG = { BACKEND_URL: "https://api.example.com/", X_APP_ID: "app" };
const PROFILE_URL = "https://api.example.com/api/user/profile";

const bu = (over: Partial<BusinessUnit>): BusinessUnit => ({
  id: "id",
  name: "Name",
  code: "CODE",
  alias_name: null,
  is_default: false,
  ...over,
});

type StubOpts = {
  config?: unknown;
  configOk?: boolean;
  configStatus?: number;
  profileOk?: boolean;
  profileStatus?: number;
  /** One payload per getBusinessUnits call, so a switch can return new state. */
  profiles?: unknown[];
  responseUrl?: string;
  method?: string;
};

/** Minimal Page stand-in exercising only what bu.ts touches. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stubPage(opts: StubOpts = {}): any {
  const profiles = opts.profiles ?? [{ data: { business_unit: [] } }];
  let call = 0;
  const gotos: string[] = [];
  const page = {
    gotos,
    request: {
      get: vi.fn(async () => ({
        ok: () => opts.configOk ?? true,
        status: () => opts.configStatus ?? 200,
        json: async () => opts.config ?? CONFIG,
      })),
    },
    goto: vi.fn(async (url: string) => {
      gotos.push(url);
    }),
    waitForResponse: vi.fn(async (predicate: (r: unknown) => boolean) => {
      const payload = profiles[Math.min(call, profiles.length - 1)];
      call += 1;
      const response = {
        url: () => opts.responseUrl ?? `${PROFILE_URL}?x=1`,
        request: () => ({ method: () => opts.method ?? "GET" }),
        ok: () => opts.profileOk ?? true,
        status: () => opts.profileStatus ?? 200,
        statusText: () => "Unauthorized",
        json: async () => payload,
      };
      // Exercise the caller's own matcher on the way through.
      if (!predicate(response)) throw new Error("predicate rejected the response");
      return response;
    }),
  };
  return page;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBusinessUnits", () => {
  it("returns the business_unit array from the intercepted profile response", async () => {
    const units = [bu({ code: "BLAVG", is_default: true }), bu({ code: "OTHER" })];
    const page = stubPage({ profiles: [{ data: { business_unit: units } }] });

    await expect(getBusinessUnits(page)).resolves.toEqual(units);
    expect(page.gotos).toEqual(["/dashboard"]);
  });

  it("registers the response wait before navigating, so it cannot race", async () => {
    const page = stubPage();
    const order: string[] = [];
    page.waitForResponse.mockImplementation(async () => {
      order.push("wait");
      return {
        url: () => PROFILE_URL,
        request: () => ({ method: () => "GET" }),
        ok: () => true,
        json: async () => ({ data: { business_unit: [] } }),
      };
    });
    page.goto.mockImplementation(async () => {
      order.push("goto");
    });

    await getBusinessUnits(page);

    expect(order).toEqual(["wait", "goto"]);
  });

  it("strips trailing slashes from BACKEND_URL when building the profile URL", async () => {
    const page = stubPage({ config: { BACKEND_URL: "https://api.example.com///", X_APP_ID: "a" } });

    await getBusinessUnits(page);

    const predicate = page.waitForResponse.mock.calls[0][0];
    const match = (url: string) => predicate({ url: () => url, request: () => ({ method: () => "GET" }) });
    expect(match(PROFILE_URL)).toBe(true);
    expect(match("https://api.example.com//api/user/profile")).toBe(false);
  });

  it("matches the profile response ignoring the query string", async () => {
    const page = stubPage({ responseUrl: `${PROFILE_URL}?cache=0` });

    await expect(getBusinessUnits(page)).resolves.toEqual([]);
  });

  it("does not match a non-GET request to the same URL", async () => {
    const page = stubPage();
    await getBusinessUnits(page);
    const predicate = page.waitForResponse.mock.calls[0][0];

    expect(predicate({ url: () => PROFILE_URL, request: () => ({ method: () => "POST" }) })).toBe(false);
  });

  it("throws with the status when /config.json is unreachable", async () => {
    const page = stubPage({ configOk: false, configStatus: 404 });

    await expect(getBusinessUnits(page)).rejects.toThrow("Failed to fetch /config.json: 404");
  });

  it("throws with status and URL when the profile request fails", async () => {
    const page = stubPage({ profileOk: false, profileStatus: 401 });

    await expect(getBusinessUnits(page)).rejects.toThrow(/Profile fetch failed: 401 Unauthorized/);
  });

  it("returns [] when the profile payload has no business_unit", async () => {
    const page = stubPage({ profiles: [{ data: {} }] });

    await expect(getBusinessUnits(page)).resolves.toEqual([]);
  });

  it("returns [] when the profile payload has no data at all", async () => {
    const page = stubPage({ profiles: [{}] });

    await expect(getBusinessUnits(page)).resolves.toEqual([]);
  });
});

describe("ensureActiveBu", () => {
  it("is a no-op when the target BU is already the default", async () => {
    const units = [bu({ code: "BLAVG", is_default: true }), bu({ code: "OTHER" })];
    const page = stubPage({ profiles: [{ data: { business_unit: units } }] });

    await ensureActiveBu(page, "BLAVG");

    expect(switcherOpen).not.toHaveBeenCalled();
    expect(page.gotos).toEqual(["/dashboard"]);
  });

  it("switches through the UI and re-reads the profile to confirm the flip", async () => {
    const before = [bu({ code: "BLAVG", name: "Blue Hotel" }), bu({ code: "OTHER", is_default: true })];
    const after = [bu({ code: "BLAVG", name: "Blue Hotel", is_default: true }), bu({ code: "OTHER" })];
    const page = stubPage({
      profiles: [{ data: { business_unit: before } }, { data: { business_unit: after } }],
    });

    await ensureActiveBu(page, "BLAVG");

    expect(switcherOpen).toHaveBeenCalledOnce();
    expect(itemByName).toHaveBeenCalledWith("Blue Hotel");
    expect(itemClick).toHaveBeenCalledOnce();
    expect(page.gotos).toEqual(["/dashboard", "/dashboard"]); // read, switch, re-read
  });

  it("clicks the aliased label but waits on a toast carrying the name alone", async () => {
    // Another BU must be active first, otherwise there is nothing to switch:
    // the frontend resolves the active BU as `find(is_default) ?? units[0]`
    // (hooks/use-profile.ts), so a target that already resolves that way is a
    // no-op. See the fast-path note in ensureActiveBu.
    const before = [
      bu({ code: "OTHER", name: "Other Hotel", is_default: true }),
      bu({ code: "BLAVG", name: "Blue Hotel", alias_name: "BLAVG" }),
    ];
    const after = [
      bu({ code: "OTHER", name: "Other Hotel" }),
      bu({ code: "BLAVG", name: "Blue Hotel", alias_name: "BLAVG", is_default: true }),
    ];
    const page = stubPage({
      profiles: [{ data: { business_unit: before } }, { data: { business_unit: after } }],
    });

    await ensureActiveBu(page, "BLAVG");

    expect(itemByName).toHaveBeenCalledWith("BLAVG - Blue Hotel");
    const toastPattern = waitForToast.mock.calls[0][0] as RegExp;
    expect(toastPattern.test("Switched to Blue Hotel")).toBe(true);
    expect(toastPattern.test("Switched to BLAVG - Blue Hotel")).toBe(false);
  });

  it("escapes regex metacharacters in the BU name before building the toast pattern", async () => {
    const name = "Blue (Hotel) +1";
    // Same reason as above: give the switch something to switch away from.
    const before = [
      bu({ code: "OTHER", name: "Other Hotel", is_default: true }),
      bu({ code: "BLAVG", name }),
    ];
    const after = [
      bu({ code: "OTHER", name: "Other Hotel" }),
      bu({ code: "BLAVG", name, is_default: true }),
    ];
    const page = stubPage({
      profiles: [{ data: { business_unit: before } }, { data: { business_unit: after } }],
    });

    await ensureActiveBu(page, "BLAVG");

    const toastPattern = waitForToast.mock.calls[0][0] as RegExp;
    expect(toastPattern.test(`Switched to ${name}`)).toBe(true);
  });

  it("lists the available codes when the user has no BU with the requested code", async () => {
    const units = [bu({ code: "AAA", is_default: true }), bu({ code: "BBB" })];
    const page = stubPage({ profiles: [{ data: { business_unit: units } }] });

    await expect(ensureActiveBu(page, "BLAVG")).rejects.toThrow(
      /no business unit with code "BLAVG".*Available: AAA, BBB/s,
    );
  });

  it("says '(none)' when the user has no business units at all", async () => {
    const page = stubPage({ profiles: [{ data: { business_unit: [] } }] });

    await expect(ensureActiveBu(page, "BLAVG")).rejects.toThrow(/Available: \(none\)/);
  });

  it("fails when the re-read shows the default did not actually flip", async () => {
    const stuck = [bu({ code: "BLAVG" }), bu({ code: "OTHER", is_default: true })];
    const page = stubPage({
      profiles: [{ data: { business_unit: stuck } }, { data: { business_unit: stuck } }],
    });

    await expect(ensureActiveBu(page, "BLAVG")).rejects.toThrow();
  });
});
