import path from "node:path";

/**
 * Resolve the persisted storageState file for the given user email.
 * Files live at <repo-root>/.auth/<email>.json and are produced by
 * tests/auth.setup.ts at the start of every run.
 */
export function authFile(email: string): string {
  return path.join(process.cwd(), ".auth", `${email}.json`);
}
