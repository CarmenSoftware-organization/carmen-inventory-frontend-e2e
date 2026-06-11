import { describe, it, expect } from "vitest";
import { parseEnvFile } from "../scripts/run-env";

describe("parseEnvFile", () => {
  it("parses basic KEY=VALUE lines", () => {
    expect(parseEnvFile("E2E_BASE_URL=https://uat.example.com")).toEqual({
      E2E_BASE_URL: "https://uat.example.com",
    });
  });

  it("skips blank lines and # comments", () => {
    const content = `
# a comment
E2E_NO_WEBSERVER=1

  # indented comment
FOO=bar
`;
    expect(parseEnvFile(content)).toEqual({ E2E_NO_WEBSERVER: "1", FOO: "bar" });
  });

  it("trims whitespace around key and value", () => {
    expect(parseEnvFile("  KEY  =  value  ")).toEqual({ KEY: "value" });
  });

  it("strips surrounding double and single quotes", () => {
    expect(parseEnvFile(`A="quoted"\nB='single'`)).toEqual({
      A: "quoted",
      B: "single",
    });
  });

  it("splits on the first '=' only, preserving '=' inside the value", () => {
    expect(parseEnvFile("ID=abc=def==")).toEqual({ ID: "abc=def==" });
  });

  it("ignores lines without '=' and empty keys", () => {
    expect(parseEnvFile("not a pair\n=value\nGOOD=1")).toEqual({ GOOD: "1" });
  });

  it("strips an optional leading 'export ' prefix", () => {
    expect(parseEnvFile("export TOKEN=xyz")).toEqual({ TOKEN: "xyz" });
  });

  it("returns an empty object for empty content", () => {
    expect(parseEnvFile("")).toEqual({});
  });
});
