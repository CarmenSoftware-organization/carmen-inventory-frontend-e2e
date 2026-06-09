import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "@playwright/test";
import { authFile } from "../fixtures/auth.paths";
import { LoginPage } from "../pages/login.page";

/**
 * The user the screenshot pipeline captures as. Defaults to the standard test
 * admin; override with WIKI_CAPTURE_EMAIL (e.g. a tenant whose BU has data for
 * detail pages). WIKI_CAPTURE_PASSWORD overrides the password (default shared).
 */
export function captureEmail(): string {
  return process.env.WIKI_CAPTURE_EMAIL ?? "admin@blueledgers.com";
}

function capturePassword(): string {
  return process.env.WIKI_CAPTURE_PASSWORD ?? "12345678";
}

/**
 * Resolve the capture user's storageState file, logging in once to create it if
 * absent (so the pipeline can capture as a user outside the e2e TEST_USERS set).
 */
export async function ensureCaptureState(baseURL: string): Promise<string> {
  const file = authFile(captureEmail());
  if (existsSync(file)) return file;
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ baseURL });
    const page = await ctx.newPage();
    const login = new LoginPage(page);
    await login.goto();
    await login.loginWithRetry(captureEmail(), capturePassword());
    mkdirSync(dirname(file), { recursive: true });
    await ctx.storageState({ path: file });
  } finally {
    await browser.close();
  }
  return file;
}
