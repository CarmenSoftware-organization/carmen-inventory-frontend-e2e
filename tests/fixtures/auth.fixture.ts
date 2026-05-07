import { test as base } from "@playwright/test";
import { authFile } from "./auth.paths";

/**
 * Returns a Playwright `test` whose browser context boots with the
 * given user's persisted cookies. The persisted state is produced
 * once per run by tests/auth.setup.ts (registered as the `setup`
 * Playwright project). Specs that previously relied on the
 * loginWithRetry auto-fixture keep their existing call shape:
 *
 *     const test = createAuthTest("purchase@blueledgers.com");
 */
export function createAuthTest(email: string) {
  return base.extend({
    storageState: authFile(email),
  });
}
