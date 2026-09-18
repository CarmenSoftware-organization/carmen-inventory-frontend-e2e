/**
 * Covers run-env's CLI half: which .env.<name> is picked, and that the file's
 * vars OVERRIDE the inherited ones — the whole reason this script exists, since
 * bun has already auto-loaded .env with localhost values by the time it runs.
 *
 * parseEnvFile is covered in run-env.test.ts.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const { spawnSync } = vi.hoisted(() => ({
  spawnSync: vi.fn((..._a: unknown[]) => ({ status: 0 }) as { status: number | null; error?: Error }),
}));
vi.mock("node:child_process", () => ({ spawnSync }));

import { main } from "../scripts/run-env";

let dir: string;
let cwd: ReturnType<typeof vi.spyOn>;
let log: ReturnType<typeof vi.spyOn>;
let err: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "runenv-"));
  cwd = vi.spyOn(process, "cwd").mockReturnValue(dir);
  log = vi.spyOn(console, "log").mockImplementation(() => {});
  err = vi.spyOn(console, "error").mockImplementation(() => {});
  spawnSync.mockReset();
  spawnSync.mockReturnValue({ status: 0 });
});

afterEach(() => {
  cwd.mockRestore();
  log.mockRestore();
  err.mockRestore();
  rmSync(dir, { recursive: true, force: true });
});

const writeEnv = (name: string, body: string) => writeFileSync(join(dir, `.env.${name}`), body);
const call = () => spawnSync.mock.calls[0] as unknown as [string, string[], { env: Record<string, string> }];

describe("run-env main", () => {
  it("defaults to .env.uat when no positional arg is given", () => {
    writeEnv("uat", "E2E_BASE_URL=https://uat.example.com\n");

    expect(main([])).toBe(0);
    expect(call()[2].env.E2E_BASE_URL).toBe("https://uat.example.com");
  });

  it("selects the env file named by the first positional arg", () => {
    writeEnv("staging", "E2E_BASE_URL=https://staging.example.com\n");

    expect(main(["staging"])).toBe(0);
    expect(call()[2].env.E2E_BASE_URL).toBe("https://staging.example.com");
  });

  it("forwards the remaining args to playwright test verbatim", () => {
    writeEnv("uat", "E2E_BASE_URL=https://uat.example.com\n");

    main(["uat", "--project=login", "-g", "TC-LOGIN-010001"]);

    expect(call()[1]).toEqual(["test", "--project=login", "-g", "TC-LOGIN-010001"]);
  });

  it("treats a leading flag as a playwright arg, not as an env name", () => {
    writeEnv("uat", "E2E_BASE_URL=https://uat.example.com\n");

    main(["--headed"]);

    expect(call()[1]).toEqual(["test", "--headed"]);
  });

  it("lets the env file override an inherited variable of the same name", () => {
    process.env.E2E_BASE_URL = "http://localhost:3000";
    writeEnv("uat", "E2E_BASE_URL=https://uat.example.com\nE2E_NO_WEBSERVER=1\n");

    main(["uat"]);

    expect(call()[2].env.E2E_BASE_URL).toBe("https://uat.example.com");
    expect(call()[2].env.E2E_NO_WEBSERVER).toBe("1");
    delete process.env.E2E_BASE_URL;
  });

  it("keeps inherited variables the env file does not mention", () => {
    process.env.RUN_ENV_PROBE = "kept";
    writeEnv("uat", "E2E_BASE_URL=https://uat.example.com\n");

    main(["uat"]);

    expect(call()[2].env.RUN_ENV_PROBE).toBe("kept");
    delete process.env.RUN_ENV_PROBE;
  });

  it("runs the repo-local playwright binary", () => {
    writeEnv("uat", "");

    main(["uat"]);

    expect(call()[0]).toBe(resolve(dir, "node_modules", ".bin", "playwright"));
  });

  it("exits 1 with the resolved path when the env file is missing", () => {
    expect(main(["nope"])).toBe(1);
    expect(err).toHaveBeenCalledWith(expect.stringContaining(".env.nope"));
    expect(spawnSync).not.toHaveBeenCalled();
  });

  it("reports (unset) when the env file declares no base URL", () => {
    writeEnv("uat", "# nothing here\n");

    main(["uat"]);

    expect(log).toHaveBeenCalledWith(expect.stringContaining("E2E_BASE_URL=(unset)"));
  });

  it("propagates playwright's non-zero exit status", () => {
    writeEnv("uat", "");
    spawnSync.mockReturnValue({ status: 1 });

    expect(main(["uat"])).toBe(1);
  });

  it("exits 1 when playwright cannot be launched", () => {
    writeEnv("uat", "");
    spawnSync.mockReturnValue({ status: null, error: new Error("ENOENT") });

    expect(main(["uat"])).toBe(1);
    expect(err).toHaveBeenCalledWith(expect.stringContaining("failed to launch playwright"));
  });

  it("exits 1 when playwright is killed without an exit status", () => {
    writeEnv("uat", "");
    spawnSync.mockReturnValue({ status: null });

    expect(main(["uat"])).toBe(1);
  });
});
