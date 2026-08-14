import { describe, it, expect } from "vitest";
import { sameScreen } from "../../tests/wiki-screenshots/signature";
import type { PageSignature } from "../../tests/wiki-screenshots/types";

const sig = (over: Partial<PageSignature> = {}): PageSignature => ({
  heading: "Purchase Request",
  actions: ["Add", "Export"],
  columns: ["Code", "Date", "Status"],
  hasRows: true,
  ...over,
});

describe("sameScreen", () => {
  it("treats identical signatures as the same screen", () => {
    expect(sameScreen(sig(), sig())).toBe(true);
  });

  it("treats a different heading as a different screen", () => {
    expect(sameScreen(sig(), sig({ heading: "My Approvals" }))).toBe(false);
  });

  it("treats different page actions as a different screen", () => {
    expect(sameScreen(sig(), sig({ actions: ["Approve", "Reject"] }))).toBe(false);
  });

  it("treats different table columns as a different screen", () => {
    expect(sameScreen(sig(), sig({ columns: ["Code", "Date"] }))).toBe(false);
  });

  it("ignores hasRows — it reflects data scope, not UI shape", () => {
    expect(sameScreen(sig({ hasRows: true }), sig({ hasRows: false }))).toBe(true);
  });

  it("ignores list ordering when the members match", () => {
    const a = sig({ actions: ["Export", "Add"], columns: ["Status", "Code", "Date"] });
    expect(sameScreen(a, sig())).toBe(true);
  });

  it("treats a missing action as a different screen even when the rest matches", () => {
    expect(sameScreen(sig(), sig({ actions: ["Add"] }))).toBe(false);
  });
});
