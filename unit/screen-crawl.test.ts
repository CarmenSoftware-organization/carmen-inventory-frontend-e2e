import { describe, it, expect } from "vitest";
import {
  normalizeScreenUrl,
  enqueueUnseen,
  safeName,
  userFolder,
  type CrawlTarget,
} from "../scripts/lib/screen-crawl";
import { readFlag, selectUsers, formatDuration } from "../scripts/capture-screens";
import { TEST_USERS } from "../tests/test-users";

const BASE = "http://localhost:3000";

describe("normalizeScreenUrl", () => {
  it("keeps a same-origin screen route", () => {
    expect(normalizeScreenUrl(`${BASE}/config/currency`, BASE)).toBe(
      `${BASE}/config/currency`,
    );
  });

  it("resolves a relative href against the base URL", () => {
    expect(normalizeScreenUrl("/dashboard", BASE)).toBe(`${BASE}/dashboard`);
  });

  it("rejects a different origin", () => {
    expect(normalizeScreenUrl("https://example.com/config", BASE)).toBeNull();
  });

  it("rejects api, login, logout and download paths", () => {
    expect(normalizeScreenUrl(`${BASE}/api/config`, BASE)).toBeNull();
    expect(normalizeScreenUrl(`${BASE}/login`, BASE)).toBeNull();
    expect(normalizeScreenUrl(`${BASE}/logout`, BASE)).toBeNull();
    expect(normalizeScreenUrl(`${BASE}/report/export/xlsx`, BASE)).toBeNull();
  });

  it("rejects a mutating query string", () => {
    expect(normalizeScreenUrl(`${BASE}/config/currency?delete=1`, BASE)).toBeNull();
    expect(normalizeScreenUrl(`${BASE}/x?action=archive`, BASE)).toBeNull();
  });

  it("rejects a non-URL href", () => {
    expect(normalizeScreenUrl("javascript:void(0)", BASE)).toBeNull();
  });

  it("collapses a UUID segment to :id", () => {
    expect(
      normalizeScreenUrl(
        `${BASE}/procurement/purchase-request/3f2504e0-4f89-41d3-9a0c-0305e82c3301`,
        BASE,
      ),
    ).toBe(`${BASE}/procurement/purchase-request/:id`);
  });

  it("collapses a numeric segment to :id", () => {
    expect(normalizeScreenUrl(`${BASE}/vendor/42`, BASE)).toBe(`${BASE}/vendor/:id`);
  });

  it("drops the query string and hash so pagination is one screen", () => {
    expect(normalizeScreenUrl(`${BASE}/vendor?page=2#top`, BASE)).toBe(`${BASE}/vendor`);
  });

  it("strips a trailing slash so /vendor and /vendor/ dedupe together", () => {
    expect(normalizeScreenUrl(`${BASE}/vendor/`, BASE)).toBe(`${BASE}/vendor`);
  });
});

describe("enqueueUnseen", () => {
  it("adds unseen routes and marks them seen", () => {
    const queue: CrawlTarget[] = [];
    const seen = new Set<string>();

    const added = enqueueUnseen(queue, seen, ["/a", "/b"], BASE);

    expect(added.map((t) => t.route)).toEqual([`${BASE}/a`, `${BASE}/b`]);
    expect(queue).toHaveLength(2);
    expect(seen.has(`${BASE}/a`)).toBe(true);
  });

  it("skips routes already seen", () => {
    const queue: CrawlTarget[] = [];
    const seen = new Set([`${BASE}/a`]);

    expect(enqueueUnseen(queue, seen, ["/a"], BASE)).toEqual([]);
    expect(queue).toEqual([]);
  });

  it("dedupes two ids of the same detail route into one visit", () => {
    const queue: CrawlTarget[] = [];
    const seen = new Set<string>();

    const added = enqueueUnseen(queue, seen, ["/vendor/1", "/vendor/2"], BASE);

    expect(added).toHaveLength(1);
    expect(added[0].route).toBe(`${BASE}/vendor/:id`);
    // The queue keeps the *concrete* url so the browser can actually open it.
    expect(added[0].url).toBe(`${BASE}/vendor/1`);
  });

  it("silently drops blocked hrefs and in-page anchors", () => {
    const queue: CrawlTarget[] = [];
    expect(enqueueUnseen(queue, new Set(), ["/logout", "#", "", "  "], BASE)).toEqual([]);
  });
});

describe("safeName", () => {
  it("slugifies a route", () => {
    expect(safeName("/config/credit-note-reason")).toBe("config-credit-note-reason");
  });

  it("maps the root route to _root instead of an empty name", () => {
    expect(safeName("/")).toBe("_root");
  });

  it("never lets a real label collide with the _root fallback", () => {
    // The regex strips "_", so no input can sanitize *into* "_root".
    expect(safeName("_root")).toBe("root");
    expect(safeName("__")).toBe("_root"); // all-punctuation -> empty -> fallback
  });
});

describe("userFolder", () => {
  it("uses the email local part", () => {
    expect(userFolder("admin@blueledgers.com")).toBe("admin");
    expect(userFolder("storemanager@blueledgers.com")).toBe("storemanager");
  });

  it("sanitizes a local part containing punctuation", () => {
    expect(userFolder("first.last+tag@blueledgers.com")).toBe("first-last-tag");
  });
});

// capture-screens.ts is the CLI entry point; importing it also pulls it into
// the tsc program, so `bun run typecheck` covers the crawler itself.
describe("readFlag", () => {
  it("reads --flag value", () => {
    expect(readFlag(["--user", "admin"], "user")).toBe("admin");
  });

  it("reads --flag=value", () => {
    expect(readFlag(["--user=admin,hod"], "user")).toBe("admin,hod");
  });

  it("returns undefined when the flag is absent", () => {
    expect(readFlag(["--concurrency", "3"], "user")).toBeUndefined();
  });
});

describe("selectUsers", () => {
  it("defaults to every test user", () => {
    expect(selectUsers(undefined)).toHaveLength(TEST_USERS.length);
  });

  it("matches by role, case-insensitively", () => {
    expect(selectUsers("hod").map((u) => u.role)).toEqual(["HOD"]);
    expect(selectUsers("StoreManager").map((u) => u.role)).toEqual(["StoreManager"]);
  });

  it("matches by email local part", () => {
    expect(selectUsers("purchase").map((u) => u.email)).toEqual([
      "purchase@blueledgers.com",
    ]);
  });

  it("accepts a comma list with surrounding spaces", () => {
    expect(selectUsers("admin, hod").map((u) => u.role)).toEqual(["Admin", "HOD"]);
  });

  it("throws on an unknown name rather than silently capturing nothing", () => {
    expect(() => selectUsers("cheif")).toThrow(/unknown user "cheif"/);
  });
});

describe("formatDuration", () => {
  it("shows seconds under a minute", () => {
    expect(formatDuration(42_000)).toBe("42s");
  });

  it("shows minutes and seconds under an hour", () => {
    expect(formatDuration(4 * 60_000 + 12_000)).toBe("4m 12s");
  });

  it("drops seconds past an hour", () => {
    expect(formatDuration(3600_000 + 25 * 60_000)).toBe("1h 25m");
  });
});
