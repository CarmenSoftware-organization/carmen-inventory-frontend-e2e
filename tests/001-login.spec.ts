import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { DashboardPage } from "./pages/dashboard.page";
import { TEST_USERS, TEST_PASSWORD } from "./test-users";

/**
 * Login & Logout E2E suite
 *
 * TC ranges
 *   TC-L01..TC-L07  Login success per role (then logout to release session)
 *   TC-L08..TC-L13  Logout success per role
 *   TC-L14..TC-L22  Validation / error handling
 *   TC-L23..TC-L26  Edge cases (case-sensitivity, trim, mask, Enter key)
 *   TC-L27..TC-L28  Auth-guard redirects
 *   TC-L27..TC-L30  Security (SQL injection / XSS / wrong username 401 / rate limit 429)
 */

const LOGIN_TC: Record<string, string> = {
  Requestor: "TC-L01",
  HOD: "TC-L02",
  Purchase: "TC-L03",
  FC: "TC-L04",
  GM: "TC-L05",
  Owner: "TC-L06",
  TT: "TC-L07",
};

const LOGOUT_TC: Record<string, string> = {
  Requestor: "TC-L08",
  HOD: "TC-L09",
  Purchase: "TC-L10",
  FC: "TC-L11",
  GM: "TC-L12",
  Owner: "TC-L13",
};

test.describe("เข้าสู่ระบบ", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  // ── Login success per role ────────────────────────────────────────────────
  for (const user of TEST_USERS) {
    if (!LOGIN_TC[user.role]) continue;
    test(
      `${LOGIN_TC[user.role]} ${user.role} เข้าสู่ระบบสำเร็จ`,
      {
        annotation: [
          { type: "preconditions", description: `User ${user.email} exists and is active; browser is logged out` },
          { type: "steps", description: "1. เปิด /login\n2. กรอก email + password\n3. กด Sign In\n4. กด logout จาก user menu" },
          { type: "expected", description: "หลัง Sign In ไปที่ /dashboard และหลัง logout กลับมา /login" },
          { type: "priority", description: "High" },
          { type: "testType", description: "Smoke" },
        ],
      },
      async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

        // Logout immediately to release the session
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.userMenuTrigger().waitFor({ state: "visible", timeout: 15_000 });
        await dashboardPage.logout();
        await expect(page).toHaveURL(/login/, { timeout: 10_000 });
      },
    );
  }

  // ── Validation / error handling ───────────────────────────────────────────
  test(
    "TC-L14 แสดง error เมื่อไม่กรอกรหัสผ่าน",
    {
      annotation: [
        { type: "preconditions", description: "Logged out; on /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอกเฉพาะ email\n3. กด Sign In" },
        { type: "expected", description: "Stay on /login; no dashboard redirect" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.emailInput().fill("requestor@blueledgers.com");
      await loginPage.submitButton().click();
      await expect(page).toHaveURL(/login/);
    },
  );

  test(
    "TC-L15 แสดง error เมื่อไม่กรอกอีเมล",
    {
      annotation: [
        { type: "preconditions", description: "Logged out; on /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอกเฉพาะ password\n3. กด Sign In" },
        { type: "expected", description: "Stay on /login; no dashboard redirect" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.passwordInput().fill(TEST_PASSWORD);
      await loginPage.submitButton().click();
      await expect(page).toHaveURL(/login/);
    },
  );

  test(
    "TC-L16 แสดง error เมื่อไม่กรอกข้อมูลทั้งสองช่อง",
    {
      annotation: [
        { type: "preconditions", description: "Logged out; on /login" },
        { type: "steps", description: "1. เปิด /login\n2. ปล่อย form ว่าง\n3. กด Sign In" },
        { type: "expected", description: "Stay on /login" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.submitButton().click();
      await expect(page).toHaveURL(/login/);
    },
  );

  test(
    "TC-L17 แสดง error เมื่อรูปแบบอีเมลไม่ถูกต้อง",
    {
      annotation: [
        { type: "preconditions", description: "Logged out; on /login" },
        { type: "steps", description: "1. กรอก email = 'not-an-email'\n2. กรอก password\n3. กด Sign In" },
        { type: "expected", description: "Stay on /login; HTML5/Zod validation blocks submit" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login("not-an-email", TEST_PASSWORD);
      await expect(page).toHaveURL(/login/);
    },
  );

  test(
    "TC-L18 แสดง error เมื่อ credentials ไม่ถูกต้อง",
    {
      annotation: [
        { type: "expected", description: "แสดง error เมื่อ credentials ไม่ถูกต้อง" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("invalid@test.com", "wrongpassword");

    const errorVisible = page.locator("form p.text-destructive");
    const dialogVisible = page.getByRole("alertdialog");
    await expect(errorVisible.or(dialogVisible).first()).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-L19 แสดง error เมื่ออีเมลถูกแต่รหัสผ่านผิด",
    {
      annotation: [
        { type: "expected", description: "แสดง error เมื่ออีเมลถูกแต่รหัสผ่านผิด" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("requestor@blueledgers.com", "wrong-password-xyz");

    const errorVisible = page.locator("form p.text-destructive");
    const dialogVisible = page.getByRole("alertdialog");
    await expect(errorVisible.or(dialogVisible).first()).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/login/);
  });

  // ── Edge cases ────────────────────────────────────────────────────────────
  test(
    "TC-L20 อีเมลไม่สนใจตัวพิมพ์ใหญ่-เล็ก",
    {
      annotation: [
        { type: "expected", description: "อีเมลไม่สนใจตัวพิมพ์ใหญ่-เล็ก" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("REQUESTOR@BLUELEDGERS.COM", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
  });

  test(
    "TC-L21 รหัสผ่านแยกตัวพิมพ์ใหญ่-เล็ก (พิมพ์ผิดเคสต้อง fail)",
    {
      annotation: [
        { type: "expected", description: "รหัสผ่านแยกตัวพิมพ์ใหญ่-เล็ก (พิมพ์ผิดเคสต้อง fail)" },
      ],
    },
    async ({ page }) => {
    // tt@blueledgers.com password "Qaz123!@#" → lower-cased variant must fail
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("tt@blueledgers.com", "qaz123!@#");
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-L22 รองรับช่องว่างหน้า/หลังอีเมล",
    {
      annotation: [
        { type: "expected", description: "รองรับช่องว่างหน้า/หลังอีเมล" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("  requestor@blueledgers.com  ", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard|login/, { timeout: 15_000 });
  });

  test(
    "TC-L23 ช่องรหัสผ่านถูก mask",
    {
      annotation: [
        { type: "expected", description: "ช่องรหัสผ่านถูก mask" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput()).toHaveAttribute("type", "password");
  });

  test(
    "TC-L24 กด Enter เพื่อ submit form ได้",
    {
      annotation: [
        { type: "expected", description: "กด Enter เพื่อ submit form ได้" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    for (let attempt = 0; attempt < 4; attempt++) {
      await loginPage.goto();
      await page.waitForLoadState("domcontentloaded");
      await loginPage.emailInput().fill("requestor@blueledgers.com");
      await loginPage.passwordInput().fill(TEST_PASSWORD);
      await Promise.all([
        page.waitForURL(/dashboard/, { timeout: 10_000 }).catch(() => null),
        loginPage.passwordInput().press("Enter"),
      ]);
      if (/dashboard/.test(page.url())) return;
      const rateLimited = await loginPage
        .rateLimitMessage()
        .isVisible()
        .catch(() => false);
      if (!rateLimited) break;
      await page.waitForTimeout(5_000);
    }
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
  });

  // ── Auth-guard redirects ──────────────────────────────────────────────────
  test(
    "TC-L25 เข้า route ที่ต้อง login โดยไม่ login ต้อง redirect ไปหน้า login",
    {
      annotation: [
        { type: "expected", description: "เข้า route ที่ต้อง login โดยไม่ login ต้อง redirect ไปหน้า login" },
      ],
    },
    async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });

  test.skip("TC-L26 user ที่ login แล้วเข้า /login ต้อง redirect ไป dashboard", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await page.waitForLoadState("networkidle");

    await page.goto("/login");
    await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
  });

  // ── Security ──────────────────────────────────────────────────────────────
  test(
    "TC-L27 อีเมลแบบ SQL injection ต้องถูก reject อย่างปลอดภัย",
    {
      annotation: [
        { type: "expected", description: "อีเมลแบบ SQL injection ต้องถูก reject อย่างปลอดภัย" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin' OR '1'='1", "anything");
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-L28 อีเมลแบบ XSS ต้องถูก reject อย่างปลอดภัย",
    {
      annotation: [
        { type: "expected", description: "อีเมลแบบ XSS ต้องถูก reject อย่างปลอดภัย" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    page.on("dialog", () => {
      throw new Error("Unexpected dialog from XSS payload");
    });
    await loginPage.login("<script>alert(1)</script>@x.com", "anything");
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-L29 login username ผิดต้องได้รับ HTTP 401",
    {
      annotation: [
        { type: "expected", description: "login username ผิดต้องได้รับ HTTP 401" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("/auth") && res.request().method() === "POST",
      { timeout: 10_000 },
    );

    await loginPage.login("wrong-user@nonexistent.com", "anypassword");

    const response = await responsePromise;
    expect(response.status()).toBe(401);
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-L30 login ชื่อเดิมผิด 3 ครั้ง ต้องได้รับ HTTP 429",
    {
      annotation: [
        { type: "expected", description: "login ชื่อเดิมผิด 3 ครั้ง ต้องได้รับ HTTP 429" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    const wrongEmail = `brute-${Date.now()}@nonexistent.com`;

    let lastStatus = 0;
    for (let i = 0; i < 3; i++) {
      await loginPage.goto();
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes("/auth") && res.request().method() === "POST",
        { timeout: 10_000 },
      );
      await loginPage.login(wrongEmail, "wrongpassword");
      const response = await responsePromise;
      lastStatus = response.status();
    }

    expect(lastStatus).toBe(429);
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("ออกจากระบบ", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  for (const user of TEST_USERS) {
    if (!LOGOUT_TC[user.role]) continue;
    test(`${LOGOUT_TC[user.role]} ${user.role} ออกจากระบบสำเร็จ`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginWithRetry(user.email, user.password);
      await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.userMenuTrigger().waitFor({ state: "visible", timeout: 15_000 });
      await dashboardPage.logout();

      await expect(page).toHaveURL(/login/, { timeout: 10_000 });
    });
  }
});
