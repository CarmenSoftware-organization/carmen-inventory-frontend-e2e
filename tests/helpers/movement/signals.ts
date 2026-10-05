import type { Page } from "@playwright/test";

/**
 * Front-end bug signals collected for the whole test:
 *  - pageerror  = an exception that reached window (crashed page / throwing handler)
 *  - console    = an error logged by React or the app
 *  - api ≥ 400  = a request the backend refused (malformed payload / wrong endpoint)
 *
 * A case that expects the backend to refuse something must declare it with
 * `expectApiError`, otherwise the refusal counts as a signal. `minor` records a
 * known finding that does not affect the user without failing the test.
 * The movement fixture fails the test on any pageerror or unexpected api signal.
 */
export interface Signal {
  kind: "pageerror" | "console" | "api";
  text: string;
  /** Known small finding (no user impact) — reported, does not fail the test. */
  minor?: string;
}

export class Signals {
  readonly items: Signal[] = [];
  private allowed: RegExp[] = [];
  private minors: { re: RegExp; note: string }[] = [];

  constructor(page: Page) {
    page.on("pageerror", (e) => this.items.push({ kind: "pageerror", text: String(e.stack ?? e).slice(0, 600) }));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const text = m.text();
      // The browser logs every api ≥ 400 a second time — already captured below.
      if (/Failed to load resource/.test(text)) return;
      this.items.push({ kind: "console", text: text.slice(0, 600) });
    });
    page.on("response", async (r) => {
      if (r.status() < 400 || !/\/api\//.test(r.url())) return;
      const method = r.request().method();
      const path = r.url().replace(/^https?:\/\/[^/]+/, "");
      const line = `${method} ${path} → ${r.status()}`;
      if (this.allowed.some((re) => re.test(line))) return;
      let body = "";
      try {
        body = (await r.text()).slice(0, 400);
      } catch {
        // body already disposed — the status line is enough
      }
      const minor = this.minors.find((m) => m.re.test(line))?.note;
      this.items.push({ kind: "api", text: `${line} ${body}`, minor });
    });
  }

  /** A request the case expects the backend to refuse (matched against "METHOD path → status"). */
  expectApiError(re: RegExp) {
    this.allowed.push(re);
  }

  /** A failing request the user never sees (e.g. refetching a just-deleted doc) — reported, not failed. */
  minor(re: RegExp, note: string) {
    this.minors.push({ re, note });
  }

  /** Signals that fail the case: page errors and unexpected api errors. */
  get hard(): Signal[] {
    return this.items.filter((s) => s.kind !== "console" && !s.minor);
  }
}
