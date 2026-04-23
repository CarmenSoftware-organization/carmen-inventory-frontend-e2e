import { expect, type Page } from "@playwright/test";
import { ConfigListPage } from "../pages/config-list.page";
import type { DialogCrudHelper } from "../pages/dialog-crud.helper";
import type { PageFormCrudHelper } from "../pages/page-form-crud.helper";

export const XSS_PAYLOAD = "<script>alert('xss-e2e')</script>";
export const SQL_PAYLOAD = "'; DROP TABLE users; --";
export const LONG_NAME = "a".repeat(200);

/**
 * No browser dialog from XSS payload should ever appear during a test.
 * Caller should attach this listener at test start.
 */
export function attachNoXssDialogGuard(page: Page) {
  page.on("dialog", (d) => {
    throw new Error(`Unexpected browser dialog from XSS payload: ${d.message()}`);
  });
}

/**
 * Add 4 security test cases (XSS / SQL injection / max-length / authorization)
 * to a dialog-based config module spec.
 *
 * Usage in a spec file (after the existing CRUD tests):
 *   addDialogSecurityCases(test, {
 *     prefix: "BT",
 *     listPath: "/config/business-type",
 *     makeHelper: (page) => new DialogCrudHelper(page, opts),
 *   });
 */
export function addDialogSecurityCases(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
  opts: {
    prefix: string;
    listPath: string;
    makeHelper: (page: Page) => DialogCrudHelper;
    /** Skip the authorization case (TC-XX12) */
    skipAuth?: boolean;
  },
) {
  const { prefix, listPath, makeHelper, skipAuth = false } = opts;

  test(`TCS-${prefix}09 XSS payload ในชื่อต้องไม่รัน script`, async ({ page }: { page: Page }) => {
    attachNoXssDialogGuard(page);
    const h = makeHelper(page);
    await h.list.goto();
    await h.openAddDialog();
    await h.nameInput().fill(XSS_PAYLOAD);
    await h.saveButton().click();
    // No alert dialog from XSS — guard above will throw if it fires
    // Either created safely (text escaped) OR validation rejects
    await page.waitForTimeout(500);
    if (await h.dialog().isVisible().catch(() => false)) {
      await h.cancelButton().click();
    }
  });

  test(`TCS-${prefix}10 SQL injection payload ต้องไม่ทำให้ระบบ crash`, async ({ page }: { page: Page }) => {
    const h = makeHelper(page);
    await h.list.goto();
    await h.list.search(SQL_PAYLOAD);
    // List page must remain functional
    await expect(h.list.addButton()).toBeVisible();
  });

  test(`TCS-${prefix}11 ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100`, async ({ page }: { page: Page }) => {
    const h = makeHelper(page);
    await h.list.goto();
    await h.openAddDialog();
    await h.nameInput().fill(LONG_NAME);
    const value = await h.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
    await h.cancelButton().click();
  });

  const dialogAuthTest = skipAuth ? test.skip : test;
  dialogAuthTest(`TCS-${prefix}12 user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect`, async ({
    browser,
  }: {
    browser: import("@playwright/test").Browser;
  }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const { LoginPage } = await import("../pages/login.page");
    const { TEST_PASSWORD } = await import("../test-users");
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@zebra.com", TEST_PASSWORD);
    await page.waitForURL(/dashboard/, { timeout: 15_000 });
    await page.goto(listPath);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    const list = new ConfigListPage(page, listPath);
    const onPage = url.includes(listPath);
    if (onPage) {
      // Page accessible — Add button must NOT be visible to non-admin
      await expect(list.addButton()).toHaveCount(0);
    }
    // Otherwise: redirected away → also acceptable
    await ctx.close();
  });
}

/**
 * Add 4 security cases for page-form-based modules.
 */
export function addPageFormSecurityCases(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
  opts: {
    prefix: string;
    listPath: string;
    makeHelper: (page: Page) => PageFormCrudHelper;
    /** First TC number for the 4 security cases (default 9 → TC-XX09..12) */
    startIndex?: number;
    /** Skip the authorization case (the last of the 4) */
    skipAuth?: boolean;
  },
) {
  const { prefix, listPath, makeHelper, startIndex = 9, skipAuth = false } = opts;
  const pad = (n: number) => String(n).padStart(2, "0");
  const tcXss = `TCS-${prefix}${pad(startIndex)}`;
  const tcSql = `TCS-${prefix}${pad(startIndex + 1)}`;
  const tcLen = `TCS-${prefix}${pad(startIndex + 2)}`;
  const tcAuth = `TCS-${prefix}${pad(startIndex + 3)}`;

  test(`${tcXss} XSS payload ในชื่อต้องไม่รัน script`, async ({ page }: { page: Page }) => {
    attachNoXssDialogGuard(page);
    const h = makeHelper(page);
    await h.gotoNew();
    await h.codeInput().fill(`X${Date.now().toString(36).slice(-4)}`);
    await h.nameInput().fill(XSS_PAYLOAD);
    await h.saveButton().click();
    await page.waitForTimeout(500);
    // Either form rejects or saves with escaped text — neither must crash
    expect(page.url()).toContain("/config/");
  });

  test(`${tcSql} SQL injection payload ต้องไม่ทำให้ระบบ crash`, async ({ page }: { page: Page }) => {
    const h = makeHelper(page);
    await h.list.goto();
    await h.list.search(SQL_PAYLOAD);
    await expect(h.list.addButton()).toBeVisible();
  });

  test(`${tcLen} ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100`, async ({ page }: { page: Page }) => {
    const h = makeHelper(page);
    await h.gotoNew();
    await h.nameInput().fill(LONG_NAME);
    const value = await h.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
  });

  const authTest = skipAuth ? test.skip : test;
  authTest(`${tcAuth} user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect`, async ({
    browser,
  }: {
    browser: import("@playwright/test").Browser;
  }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const { LoginPage } = await import("../pages/login.page");
    const { TEST_PASSWORD } = await import("../test-users");
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@zebra.com", TEST_PASSWORD);
    await page.waitForURL(/dashboard/, { timeout: 15_000 });
    await page.goto(listPath);
    await page.waitForLoadState("networkidle");
    const list = new ConfigListPage(page, listPath);
    if (page.url().includes(listPath)) {
      await expect(list.addButton()).toHaveCount(0);
    }
    await ctx.close();
  });
}

/**
 * Lightweight security cases for modules with complex CRUD that we don't fully test.
 * Only covers SQL search + authorization.
 */
export function addListOnlySecurityCases(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test: any,
  opts: { prefix: string; listPath: string; skipTcs?: string[] },
) {
  const { prefix, listPath, skipTcs = [] } = opts;
  const t = (tc: string) => (skipTcs.includes(tc) ? test.skip : test);

  t(`TCS-${prefix}09`)(`TCS-${prefix}09 XSS payload ในช่องค้นหาต้องไม่รัน script`, async ({ page }: { page: Page }) => {
    attachNoXssDialogGuard(page);
    const list = new ConfigListPage(page, listPath);
    await list.goto();
    await list.search(XSS_PAYLOAD);
    await expect(list.addButton()).toBeVisible();
  });

  t(`TCS-${prefix}10`)(`TCS-${prefix}10 SQL injection payload ในช่องค้นหาต้องไม่ crash`, async ({ page }: { page: Page }) => {
    const list = new ConfigListPage(page, listPath);
    await list.goto();
    await list.search(SQL_PAYLOAD);
    await expect(list.addButton()).toBeVisible();
  });

  t(`TCS-${prefix}11`)(`TCS-${prefix}11 ค้นหาด้วย string ยาวมากต้องไม่ crash`, async ({ page }: { page: Page }) => {
    const list = new ConfigListPage(page, listPath);
    await list.goto();
    await list.search(LONG_NAME);
    await expect(list.addButton()).toBeVisible();
  });

  t(`TCS-${prefix}12`)(`TCS-${prefix}12 user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect`, async ({
    browser,
  }: {
    browser: import("@playwright/test").Browser;
  }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const { LoginPage } = await import("../pages/login.page");
    const { TEST_PASSWORD } = await import("../test-users");
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@zebra.com", TEST_PASSWORD);
    await page.waitForURL(/dashboard/, { timeout: 15_000 });
    await page.goto(listPath);
    await page.waitForLoadState("networkidle");
    const list = new ConfigListPage(page, listPath);
    if (page.url().includes(listPath)) {
      await expect(list.addButton()).toHaveCount(0);
    }
    await ctx.close();
  });
}
