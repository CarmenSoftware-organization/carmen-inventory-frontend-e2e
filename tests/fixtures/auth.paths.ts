import path from "node:path";

/**
 * Resolve the persisted storageState file for the given user email.
 * Files live at <repo-root>/.auth/<email>.json and are produced by
 * tests/auth.setup.ts at the start of every run.
 */
const EMAIL_ALIASES: Record<string, string> = {
  "purchase@blueledgers.com": "carmensoftware.dev+purchase@gmail.com",
  "admin@blueledgers.com": "carmensoftware.dev+admin@gmail.com",
  "requestor@blueledgers.com": "carmensoftware.dev+requestor@gmail.com",
  "hod@blueledgers.com": "carmensoftware.dev+hod@gmail.com",
  "fc@blueledgers.com": "carmensoftware.dev+fc@gmail.com",
  "gm@blueledgers.com": "carmensoftware.dev+gm@gmail.com",
  "owner@blueledgers.com": "carmensoftware.dev+owner@gmail.com",
  "storemanager@blueledgers.com": "carmensoftware.dev+storemanager@gmail.com",
  "budget@blueledgers.com": "carmensoftware.dev+budget@gmail.com",
};

export function authFile(email: string): string {
  const normalized = EMAIL_ALIASES[email] ?? email;
  return path.join(process.cwd(), ".auth", `${normalized}.json`);
}
