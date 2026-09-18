/**
 * Covers the DOM-reading half of signature.ts with a stub Page/Locator.
 * decideOutcome and sameScreen are pure and covered in signature.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  contentRoot,
  readHeadings,
  pageSignature,
} from "../../tests/wiki-screenshots/signature";

type Sel = Record<string, { texts?: string[]; count?: number; throws?: boolean }>;

/** A Locator stand-in whose children are looked up by selector string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function locator(name: string, sel: Sel): any {
  const spec = sel[name] ?? {};
  return {
    name,
    locator: (child: string) => locator(child, sel),
    allInnerTexts: async () => {
      if (spec.throws) throw new Error("detached");
      return spec.texts ?? [];
    },
    count: async () => {
      if (spec.throws) throw new Error("detached");
      return spec.count ?? 0;
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stubPage = (sel: Sel): any => ({ locator: (s: string) => locator(s, sel) });

/** The stub locator's selector, read back through the real Locator type. */
const selectorOf = (l: unknown): string => (l as { name: string }).name;

const SHELL: Sel = { "#main-content": { count: 1 } };

describe("contentRoot", () => {
  it("returns #main-content when the shell rendered it", async () => {
    const root = await contentRoot(stubPage(SHELL));

    expect(selectorOf(root)).toBe("#main-content");
  });

  it("falls back to body for routes rendered outside the shell", async () => {
    const root = await contentRoot(stubPage({ "#main-content": { count: 0 } }));

    expect(selectorOf(root)).toBe("body");
  });

  it("falls back to body when counting throws", async () => {
    const root = await contentRoot(stubPage({ "#main-content": { throws: true } }));

    expect(selectorOf(root)).toBe("body");
  });
});

describe("readHeadings", () => {
  it("collapses whitespace and drops blank headings", async () => {
    const root = locator("#main-content", {
      "h1, h2": { texts: ["  Vendor \n List ", "", "   ", "Detail"] },
    });

    await expect(readHeadings(root)).resolves.toEqual(["Vendor List", "Detail"]);
  });

  it("returns [] instead of throwing when the query fails", async () => {
    const root = locator("#main-content", { "h1, h2": { throws: true } });

    await expect(readHeadings(root)).resolves.toEqual([]);
  });

  it("preserves document order", async () => {
    const root = locator("#main-content", { "h1, h2": { texts: ["Second", "First"] } });

    await expect(readHeadings(root)).resolves.toEqual(["Second", "First"]);
  });
});

describe("pageSignature", () => {
  it("fingerprints heading, actions, columns and hasRows", async () => {
    const sig = await pageSignature(
      stubPage({
        ...SHELL,
        "h1, h2": { texts: ["Vendor", "Filters"] },
        "button:not(table button)": { texts: ["Add", "Export"] },
        "table thead th": { texts: ["Code", "Name"] },
        "table tbody tr": { count: 12 },
      }),
    );

    expect(sig).toEqual({
      heading: "Vendor",
      actions: ["Add", "Export"],
      columns: ["Code", "Name"],
      hasRows: true,
    });
  });

  it("dedupes and sorts actions and columns so DOM order never matters", async () => {
    const sig = await pageSignature(
      stubPage({
        ...SHELL,
        "button:not(table button)": { texts: ["Export", "Add", " Add ", ""] },
        "table thead th": { texts: ["Name", "Code", "Name"] },
      }),
    );

    expect(sig.actions).toEqual(["Add", "Export"]);
    expect(sig.columns).toEqual(["Code", "Name"]);
  });

  it("drops numeric-only labels, which are pagination and track record count", async () => {
    const sig = await pageSignature(
      stubPage({
        ...SHELL,
        "button:not(table button)": { texts: ["Add", "1", "2", "10", "Page 2"] },
      }),
    );

    expect(sig.actions).toEqual(["Add", "Page 2"]);
  });

  it("reports an empty heading for a page that renders none", async () => {
    const sig = await pageSignature(stubPage({ ...SHELL, "h1, h2": { texts: [] } }));

    expect(sig.heading).toBe("");
  });

  it("reports hasRows false for an empty list", async () => {
    const sig = await pageSignature(stubPage({ ...SHELL, "table tbody tr": { count: 0 } }));

    expect(sig.hasRows).toBe(false);
  });

  it("degrades to an empty signature rather than throwing when every query fails", async () => {
    const sig = await pageSignature(
      stubPage({
        ...SHELL,
        "h1, h2": { throws: true },
        "button:not(table button)": { throws: true },
        "table thead th": { throws: true },
        "table tbody tr": { throws: true },
      }),
    );

    expect(sig).toEqual({ heading: "", actions: [], columns: [], hasRows: false });
  });

  it("fingerprints a shell-less route through the body fallback", async () => {
    const sig = await pageSignature(
      stubPage({
        "#main-content": { count: 0 },
        "h1, h2": { texts: ["Page not found"] },
      }),
    );

    expect(sig.heading).toBe("Page not found");
  });
});
