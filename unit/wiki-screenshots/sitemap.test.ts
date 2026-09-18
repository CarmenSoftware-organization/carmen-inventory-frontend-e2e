import { describe, it, expect } from "vitest";
import { join } from "node:path";
import {
  buildEntries,
  renderSitemap,
  type SitemapEntry,
} from "../../tests/wiki-screenshots/sitemap";
import type { ProbeResult, ShotSpec } from "../../tests/wiki-screenshots/types";

const ASSETS = "/repo/assets";
const HTML_DIR = "/repo";

const shot = (over: Partial<ShotSpec> = {}): ShotSpec => ({
  path: "/vendor-management/vendor",
  module: "vendor",
  slug: "vendor-list",
  ...over,
});

const ok = (role: string, route = "/vendor-management/vendor"): ProbeResult => ({
  route,
  role,
  outcome: "ok",
  signature: { heading: "Vendor", actions: ["Add"], columns: ["Code"], hasRows: true },
});

/** fileExists stub: only the listed absolute paths are on disk. */
const onDisk =
  (...paths: string[]) =>
  (p: string): boolean =>
    paths.includes(p);

const entry = (over: Partial<SitemapEntry> = {}): SitemapEntry => ({
  route: "/vendor-management/vendor",
  module: "vendor",
  slug: "vendor-list",
  variants: [],
  denied: [],
  unavailable: [],
  ...over,
});

describe("buildEntries", () => {
  it("resolves the baseline image relative to the HTML file", () => {
    const base = join(ASSETS, "vendor", "vendor-list.png");
    const [e] = buildEntries([shot()], [ok("Admin")], ASSETS, HTML_DIR, onDisk(base));

    expect(e.baselineRole).toBe("Admin");
    expect(e.baselineImage).toBe("assets/vendor/vendor-list.png");
  });

  it("omits baselineImage when the probe says ok but no file was written", () => {
    const [e] = buildEntries([shot()], [ok("Admin")], ASSETS, HTML_DIR, onDisk());

    expect(e.baselineRole).toBe("Admin");
    expect(e.baselineImage).toBeUndefined();
  });

  it("lists a role variant only when its suffixed file exists on disk", () => {
    const base = join(ASSETS, "vendor", "vendor-list.png");
    const hod = join(ASSETS, "vendor", "vendor-list--HOD.png");
    const [e] = buildEntries(
      [shot()],
      [ok("Admin"), ok("HOD"), ok("FC")],
      ASSETS,
      HTML_DIR,
      onDisk(base, hod), // FC reached the page but its shot is missing
    );

    expect(e.variants).toEqual([{ role: "HOD", image: "assets/vendor/vendor-list--HOD.png" }]);
  });

  it("carries denied and unavailable roles with their page-sourced reasons", () => {
    const matrix: ProbeResult[] = [
      ok("Admin"),
      { route: "/vendor-management/vendor", role: "HOD", outcome: "denied", reason: "Permission Denied" },
      { route: "/vendor-management/vendor", role: "FC", outcome: "not-found", reason: "We can't find that page" },
      { route: "/vendor-management/vendor", role: "GM", outcome: "error", reason: "Something went wrong" },
    ];
    const [e] = buildEntries([shot()], matrix, ASSETS, HTML_DIR, onDisk());

    expect(e.denied).toEqual([{ role: "HOD", reason: "Permission Denied" }]);
    expect(e.unavailable).toEqual([
      { role: "FC", reason: "We can't find that page" },
      { role: "GM", reason: "Something went wrong" },
    ]);
  });

  it("marks an add-dialog spec in the slug and reads its -dialog-add file", () => {
    const file = join(ASSETS, "vendor", "vendor-list-dialog-add.png");
    const [e] = buildEntries(
      [shot({ interaction: "add-dialog" })],
      [ok("Admin")],
      ASSETS,
      HTML_DIR,
      onDisk(file),
    );

    expect(e.slug).toBe("vendor-list (dialog)");
    expect(e.baselineImage).toBe("assets/vendor/vendor-list-dialog-add.png");
  });

  it("leaves a route nobody could reach without a baseline", () => {
    const matrix: ProbeResult[] = [
      { route: "/vendor-management/vendor", role: "Admin", outcome: "denied", reason: "Permission Denied" },
    ];
    const [e] = buildEntries([shot()], matrix, ASSETS, HTML_DIR, onDisk());

    expect(e.baselineRole).toBeUndefined();
    expect(e.variants).toEqual([]);
  });

  it("ignores probe rows belonging to a different route", () => {
    const matrix = [ok("Admin", "/config/currency")];
    const [e] = buildEntries([shot()], matrix, ASSETS, HTML_DIR, onDisk());

    expect(e.baselineRole).toBeUndefined();
    expect(e.denied).toEqual([]);
  });

  it("returns one entry per shot spec", () => {
    const entries = buildEntries(
      [shot(), shot({ path: "/config/currency", module: "config", slug: "currency" })],
      [],
      ASSETS,
      HTML_DIR,
      onDisk(),
    );

    expect(entries.map((e) => e.route)).toEqual(["/vendor-management/vendor", "/config/currency"]);
  });
});

describe("renderSitemap", () => {
  it("reports screen, captured, variant and unreachable counts in the header", () => {
    const html = renderSitemap([
      entry({ baselineRole: "Admin", baselineImage: "a.png", variants: [{ role: "HOD", image: "b.png" }] }),
      entry({ route: "/config/currency", baselineRole: "Admin", baselineImage: "c.png" }),
      entry({ route: "/config/unit" }), // unreachable
    ]);

    expect(html).toContain("3 screens · 2 captured · 1 role variants · 1 unreachable");
  });

  it("groups cards into sections by the top-level route segment", () => {
    const html = renderSitemap([
      entry({ route: "/config/currency" }),
      entry({ route: "/config/unit" }),
      entry({ route: "/vendor-management/vendor" }),
    ]);

    expect(html).toContain('<h2>config <span class="count">2</span></h2>');
    expect(html).toContain('<h2>vendor-management <span class="count">1</span></h2>');
  });

  it("labels the root route section 'root'", () => {
    const html = renderSitemap([entry({ route: "/" })]);

    expect(html).toContain('<h2>root <span class="count">1</span></h2>');
  });

  it("escapes page-sourced reason text instead of emitting raw HTML", () => {
    const html = renderSitemap([
      entry({ denied: [{ role: "HOD", reason: "<script>alert(1)</script>" }] }),
    ]);

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("escapes a double quote in a reason so it cannot break out of the title attribute", () => {
    const html = renderSitemap([entry({ denied: [{ role: "HOD", reason: 'no "seedId"' }] })]);

    expect(html).toContain('title="no &quot;seedId&quot;"');
  });

  it("groups roles that reported the identical reason onto one line", () => {
    const html = renderSitemap([
      entry({
        denied: [
          { role: "HOD", reason: "Permission Denied" },
          { role: "FC", reason: "Permission Denied" },
          { role: "GM", reason: "Something else" },
        ],
      }),
    ]);

    expect(html).toContain("<li>Permission Denied — HOD, FC</li>");
    expect(html).toContain("<li>Something else — GM</li>");
  });

  it("omits the reasons list when no note carries a reason", () => {
    const html = renderSitemap([entry({ denied: [{ role: "HOD" }] })]);

    expect(html).not.toContain('<ul class="reasons">');
  });

  it("renders a no-screenshot placeholder instead of an img when nothing was captured", () => {
    const html = renderSitemap([entry()]);

    expect(html).toContain('<div class="no-shot">no screenshot</div>');
    expect(html).not.toContain("<img src=");
  });

  it("puts every role on data-roles so the filter box can match it", () => {
    const html = renderSitemap([
      entry({
        baselineRole: "Admin",
        variants: [{ role: "HOD", image: "b.png" }],
        denied: [{ role: "FC" }],
      }),
    ]);

    expect(html).toContain('data-roles="Admin HOD FC"');
  });

  it("sorts cards by route across the document", () => {
    const html = renderSitemap([
      entry({ route: "/config/unit" }),
      entry({ route: "/config/currency" }),
    ]);

    expect(html.indexOf("/config/currency")).toBeLessThan(html.indexOf("/config/unit"));
  });

  it("renders a self-contained document even with no entries at all", () => {
    const html = renderSitemap([]);

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("0 screens · 0 captured · 0 role variants · 0 unreachable");
  });
});
