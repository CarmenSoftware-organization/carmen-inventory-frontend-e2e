/**
 * Covers the filesystem half of role-matrix.ts and seed-overlay.ts, plus the
 * one-liner locale helper. The pure selection logic (baselineFor /
 * rolesToCapture / applySeedOverlay) lives in role-matrix.test.ts and
 * seed-overlay.test.ts.
 */
import { describe, it, expect, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRoleMatrix, saveRoleMatrix, ROLE_MATRIX_PATH } from "../../tests/wiki-screenshots/role-matrix";
import { loadSeedOverlay } from "../../tests/wiki-screenshots/seed-overlay";
import { setEnLocale } from "../../tests/wiki-screenshots/locale";
import type { ProbeResult } from "../../tests/wiki-screenshots/types";

const dirs: string[] = [];
function workdir(): string {
  const d = mkdtempSync(join(tmpdir(), "matrix-"));
  dirs.push(d);
  return d;
}
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

const row: ProbeResult = {
  route: "/vendor-management/vendor",
  role: "Admin",
  outcome: "ok",
  signature: { heading: "Vendor", actions: ["Add"], columns: ["Code"], hasRows: true },
};

describe("loadRoleMatrix", () => {
  it("parses a written matrix back to the same rows", () => {
    const path = join(workdir(), "role-matrix.json");
    writeFileSync(path, JSON.stringify([row]));

    expect(loadRoleMatrix(path)).toEqual([row]);
  });

  it("tells the operator to run the probe when the file is missing", () => {
    const path = join(workdir(), "nope.json");

    expect(() => loadRoleMatrix(path)).toThrow(/not found at .*nope\.json.*bun run wiki:probe/s);
  });

  it("reports malformed JSON as malformed, not as a bare SyntaxError", () => {
    const path = join(workdir(), "role-matrix.json");
    writeFileSync(path, "{ truncated");

    expect(() => loadRoleMatrix(path)).toThrow(/unreadable or malformed/);
  });

  it("rejects valid JSON that is not an array of probe results", () => {
    const path = join(workdir(), "role-matrix.json");
    writeFileSync(path, JSON.stringify({ route: "/x" }));

    expect(() => loadRoleMatrix(path)).toThrow(/is not an array of probe results/);
  });

  it("accepts an empty matrix", () => {
    const path = join(workdir(), "role-matrix.json");
    writeFileSync(path, "[]");

    expect(loadRoleMatrix(path)).toEqual([]);
  });
});

describe("saveRoleMatrix", () => {
  it("writes the matrix as indented JSON that loadRoleMatrix can read back", () => {
    const path = join(workdir(), "role-matrix.json");

    saveRoleMatrix(path, [row]);

    expect(readFileSync(path, "utf8")).toContain("\n  ");
    expect(loadRoleMatrix(path)).toEqual([row]);
  });

  it("leaves no temp file behind after the atomic rename", () => {
    const path = join(workdir(), "role-matrix.json");

    saveRoleMatrix(path, [row]);

    expect(existsSync(`${path}.tmp`)).toBe(false);
  });

  it("replaces the previous matrix on the next per-role save", () => {
    const path = join(workdir(), "role-matrix.json");

    saveRoleMatrix(path, [row]);
    saveRoleMatrix(path, [row, { ...row, role: "HOD" }]);

    expect(loadRoleMatrix(path)).toHaveLength(2);
  });
});

describe("ROLE_MATRIX_PATH", () => {
  it("points at the checked-in matrix under the wiki-screenshots dir", () => {
    expect(ROLE_MATRIX_PATH.endsWith("tests/wiki-screenshots/role-matrix.json")).toBe(true);
  });
});

describe("loadSeedOverlay", () => {
  it("reads the route → seedId map", () => {
    const path = join(workdir(), "seed-ids.json");
    writeFileSync(path, JSON.stringify({ "/vendor-management/vendor/:id": "uuid-1" }));

    expect(loadSeedOverlay(path)).toEqual({ "/vendor-management/vendor/:id": "uuid-1" });
  });

  it("returns {} when the gitignored overlay is absent", () => {
    expect(loadSeedOverlay(join(workdir(), "absent.json"))).toEqual({});
  });

  it("returns {} instead of throwing on malformed JSON", () => {
    const path = join(workdir(), "seed-ids.json");
    writeFileSync(path, "not json");

    expect(loadSeedOverlay(path)).toEqual({});
  });

  it("returns {} when the file cannot be read", () => {
    const dir = workdir();
    const path = join(dir, "seed-ids.json");
    writeFileSync(path, "{}");
    chmodSync(path, 0o000);

    // Root ignores the mode bit; only assert the no-throw contract then.
    expect(() => loadSeedOverlay(path)).not.toThrow();
    chmodSync(path, 0o644);
  });
});

describe("setEnLocale", () => {
  it("sets NEXT_LOCALE=en scoped to the base URL host", async () => {
    const addCookies = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await setEnLocale({ addCookies } as any, "https://uat.example.com:8443/dashboard");

    expect(addCookies).toHaveBeenCalledWith([
      { name: "NEXT_LOCALE", value: "en", domain: "uat.example.com", path: "/" },
    ]);
  });

  it("works for a localhost base URL", async () => {
    const addCookies = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await setEnLocale({ addCookies } as any, "http://localhost:3000");

    expect(addCookies.mock.calls[0][0][0].domain).toBe("localhost");
  });

  it("rejects a base URL that is not a URL at all", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(setEnLocale({ addCookies: vi.fn() } as any, "not-a-url")).rejects.toThrow();
  });
});
