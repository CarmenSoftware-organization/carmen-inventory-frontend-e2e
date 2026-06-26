import { describe, it, expect } from "vitest";
import {
  uid,
  shortUid,
  fakeCode,
  fakeName,
  fakeDescription,
  buildEntity,
} from "../tests/helpers/test-data";

describe("test-data factory", () => {
  it("uid is a non-empty base36 string", () => {
    expect(uid).toMatch(/^[0-9a-z]+$/);
    expect(uid.length).toBeGreaterThan(0);
  });

  it("shortUid is 4 uppercase ASCII chars", () => {
    expect(shortUid()).toMatch(/^[A-Z0-9]{4}$/);
  });

  describe("fakeCode", () => {
    it("uses the default E2E prefix", () => {
      expect(fakeCode()).toMatch(/^E2E[A-Z0-9]{4}$/);
    });
    it("honors a custom prefix", () => {
      expect(fakeCode("D10")).toMatch(/^D10[A-Z0-9]{4}$/);
    });
    it("stays within the 10-char code maxLength for short prefixes", () => {
      expect(fakeCode("D10").length).toBeLessThanOrEqual(10);
    });
    it("shares the same shortUid tail across calls in one process", () => {
      expect(fakeCode("A").slice(-4)).toBe(fakeCode("B").slice(-4));
    });
  });

  describe("fakeName", () => {
    it("is non-empty and carries the run suffix", () => {
      const n = fakeName();
      expect(n.length).toBeGreaterThan(0);
      expect(n).toContain(`E2E-${uid}`);
    });
    it("includes the tag when provided", () => {
      expect(fakeName({ tag: "DEP010010" })).toContain("DEP010010");
    });
    it("th locale still returns a non-empty suffixed string", () => {
      const n = fakeName({ locale: "th" });
      expect(n.length).toBeGreaterThan(0);
      expect(n).toContain(`E2E-${uid}`);
    });
  });

  describe("fakeDescription", () => {
    it("is non-empty and within the 256-char maxLength", () => {
      const d = fakeDescription();
      expect(d.length).toBeGreaterThan(0);
      expect(d.length).toBeLessThanOrEqual(256);
      expect(d).toContain(`E2E-${uid}`);
    });
  });

  describe("buildEntity", () => {
    it("returns a full, distinct record bundle", () => {
      const e = buildEntity({ codePrefix: "E2E", tag: "DEP" });
      expect(e.code).toMatch(/^E2E[A-Z0-9]{4}$/);
      expect(e.name).toContain(`E2E-${uid}`);
      expect(e.nameUpdated).toContain("Upd");
      expect(e.name).not.toBe(e.nameUpdated);
      expect(e.description.length).toBeGreaterThan(0);
    });
  });
});
