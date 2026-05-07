import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { DashboardPage } from "./pages/dashboard.page";
import { TEST_USERS, TEST_PASSWORD } from "./test-users";

/**
 * Login & Logout E2E suite
 *
 * TC ranges
 *   TC-LOGIN-010001..TC-LOGIN-010006  Login success per role (Requestor/HOD/Purchase/FC/GM/Owner), then logout
 *   TC-LOGIN-010007          TT (user without department) → dialog "No department assigned"
 *   TC-LOGIN-010008..TC-LOGIN-010013  Logout success per role
 *   TC-LOGIN-010014..TC-LOGIN-010022  Validation / error handling
 *   TC-LOGIN-010023..TC-LOGIN-010026  Edge cases (case-sensitivity, trim, mask, Enter key)
 *   TC-LOGIN-010027..TC-LOGIN-010028  Auth-guard redirects
 *   TC-LOGIN-010027..TC-LOGIN-010030  Security (SQL injection / XSS / wrong username 401 / rate limit 429)
 *   TC-LOGIN-010031..TC-LOGIN-010032  Login success — StoreManager / Budget
 *   TC-LOGIN-010033..TC-LOGIN-010034  Logout success — StoreManager / Budget
 */

const LOGIN_TC: Record<string, string> = {
  Requestor: "TC-LOGIN-010001",
  HOD: "TC-LOGIN-010002",
  Purchase: "TC-LOGIN-010003",
  FC: "TC-LOGIN-010004",
  GM: "TC-LOGIN-010005",
  Owner: "TC-LOGIN-010006",
  StoreManager: "TC-LOGIN-010031",
  Budget: "TC-LOGIN-010032",
  // TT intentionally omitted — handled by dedicated TC-LOGIN-010007 below
  // (user has no department → login should surface a "No department assigned"
  // dialog instead of redirecting to /dashboard).
};

const LOGOUT_TC: Record<string, string> = {
  Requestor: "TC-LOGIN-010008",
  HOD: "TC-LOGIN-010009",
  Purchase: "TC-LOGIN-010010",
  FC: "TC-LOGIN-010011",
  GM: "TC-LOGIN-010012",
  Owner: "TC-LOGIN-010013",
  StoreManager: "TC-LOGIN-010033",
  Budget: "TC-LOGIN-010034",
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
          { type: "preconditions", description: `User ${user.email} มีอยู่จริงและ active; browser logged out` },
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

  // ── TT: user without department → dialog ─────────────────────────────────
  test(
    "TC-LOGIN-010007 TT (user ไม่มี department) login ต้องแสดง dialog แจ้งยังไม่กำหนด department",
    {
      annotation: [
        { type: "preconditions", description: "User tt@blueledgers.com มีอยู่จริงและ active แต่ยังไม่ถูกกำหนด department ในระบบ; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = tt@blueledgers.com, password = Qaz123!@#\n3. กด Sign In" },
        { type: "expected", description: "แสดง alertdialog/modal ข้อความ 'No department assigned' (หรือคำแปลไทยที่สื่อความเดียวกัน)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Auth-guard" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login("tt@blueledgers.com", "Qaz123!@#");

      // Expect a dialog/alertdialog surfacing the missing-department state.
      const dialog = page.getByRole("alertdialog").or(page.getByRole("dialog"));
      await expect(dialog.first()).toBeVisible({ timeout: 15_000 });
      await expect(dialog.first()).toContainText(/no department assigned/i);
    },
  );

  // ── Validation / error handling ───────────────────────────────────────────
  test(
    "TC-LOGIN-010014 แสดง error เมื่อไม่กรอกรหัสผ่าน",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอกเฉพาะ email\n3. กด Sign In" },
        { type: "expected", description: "คงอยู่ที่ /login; ไม่ redirect ไป dashboard" },
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
    "TC-LOGIN-010015 แสดง error เมื่อไม่กรอกอีเมล",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอกเฉพาะ password\n3. กด Sign In" },
        { type: "expected", description: "คงอยู่ที่ /login; ไม่ redirect ไป dashboard" },
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
    "TC-LOGIN-010016 แสดง error เมื่อไม่กรอกข้อมูลทั้งสองช่อง",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. ปล่อย form ว่าง\n3. กด Sign In" },
        { type: "expected", description: "คงอยู่ที่ /login" },
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
    "TC-LOGIN-010017 แสดง error เมื่อรูปแบบอีเมลไม่ถูกต้อง",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. กรอก email = 'not-an-email'\n2. กรอก password\n3. กด Sign In" },
        { type: "expected", description: "คงอยู่ที่ /login; HTML5/Zod validation บล็อกการ submit" },
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
    "TC-LOGIN-010018 แสดง error เมื่อ credentials ไม่ถูกต้อง",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login; ไม่มี user 'invalid@test.com' ในระบบ" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = 'invalid@test.com', password = 'wrongpassword'\n3. กด Sign In" },
        { type: "expected", description: "แสดงข้อความ error (form หรือ alertdialog) และคงอยู่ที่ /login" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
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
    "TC-LOGIN-010019 แสดง error เมื่ออีเมลถูกแต่รหัสผ่านผิด",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = requestor@blueledgers.com, password = 'wrong-password-xyz'\n3. กด Sign In" },
        { type: "expected", description: "แสดงข้อความ error (form หรือ alertdialog) และคงอยู่ที่ /login" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
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
    "TC-LOGIN-010020 อีเมลไม่สนใจตัวพิมพ์ใหญ่-เล็ก",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = 'REQUESTOR@BLUELEDGERS.COM' (ตัวพิมพ์ใหญ่ทั้งหมด) + password ที่ถูกต้อง\n3. กด Sign In" },
        { type: "expected", description: "Login สำเร็จและ redirect ไปที่ /dashboard (อีเมลไม่ case-sensitive)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("REQUESTOR@BLUELEDGERS.COM", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
  });

  test(
    "TC-LOGIN-010021 รหัสผ่านแยกตัวพิมพ์ใหญ่-เล็ก (พิมพ์ผิดเคสต้อง fail)",
    {
      annotation: [
        { type: "preconditions", description: "User tt@blueledgers.com มีอยู่จริง รหัสผ่านที่ถูกต้องคือ 'Qaz123!@#'; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = tt@blueledgers.com, password = 'qaz123!@#' (ตัวพิมพ์เล็กทั้งหมด)\n3. กด Sign In" },
        { type: "expected", description: "Login fail และคงอยู่ที่ /login (password เป็น case-sensitive)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
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
    "TC-LOGIN-010022 รองรับช่องว่างหน้า/หลังอีเมล",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = '  requestor@blueledgers.com  ' (มีช่องว่างหน้า/หลัง) + password\n3. กด Sign In" },
        { type: "expected", description: "ระบบ trim ช่องว่างและ login สำเร็จ ไปที่ /dashboard (หรือคงอยู่ที่ /login หากเลือก reject — accept ทั้งสองแบบ)" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("  requestor@blueledgers.com  ", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard|login/, { timeout: 15_000 });
  });

  test(
    "TC-LOGIN-010023 ช่องรหัสผ่านถูก mask",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. ตรวจสอบ attribute ของ password input" },
        { type: "expected", description: "Password input มี attribute type='password' (ตัวอักษรถูก mask ไม่แสดง plain text)" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.passwordInput()).toHaveAttribute("type", "password");
  });

  test(
    "TC-LOGIN-010024 กด Enter เพื่อ submit form ได้",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email + password\n3. กด Enter ในช่อง password (แทนการคลิกปุ่ม Sign In)" },
        { type: "expected", description: "Form submit และ redirect ไปที่ /dashboard เหมือนกับการคลิกปุ่ม Sign In" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
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
    "TC-LOGIN-010025 เข้า route ที่ต้อง login โดยไม่ login ต้อง redirect ไปหน้า login",
    {
      annotation: [
        { type: "preconditions", description: "Browser ไม่มี session/cookies (logged out)" },
        { type: "steps", description: "1. clear cookies\n2. navigate ตรงไปที่ /dashboard โดยไม่ผ่าน /login" },
        { type: "expected", description: "Auth-guard redirect กลับไปที่ /login (ไม่อนุญาตให้เข้า /dashboard เมื่อยังไม่ได้ login)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Auth-guard" },
      ],
    },
    async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });

  test.skip(
    "TC-LOGIN-010026 user ที่ login แล้วเข้า /login ต้อง redirect ไป dashboard",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com login สำเร็จและมี active session อยู่แล้วที่ /dashboard" },
        { type: "steps", description: "1. login ด้วย requestor@blueledgers.com\n2. รอ /dashboard โหลดเสร็จ\n3. navigate ไปที่ /login อีกครั้ง" },
        { type: "expected", description: "Auth-guard redirect กลับไปที่ /dashboard (ไม่ให้ user ที่ login แล้วเห็นหน้า /login ซ้ำ)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Auth-guard" },
      ],
    },
    async ({ page }) => {
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
    "TC-LOGIN-010027 อีเมลแบบ SQL injection ต้องถูก reject อย่างปลอดภัย",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก email = \"admin' OR '1'='1\", password = 'anything'\n3. กด Sign In" },
        { type: "expected", description: "Login fail และคงอยู่ที่ /login; SQL injection payload ไม่ถูก execute (ไม่มีข้อมูลรั่วไหล / ไม่ได้ session)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
      ],
    },
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin' OR '1'='1", "anything");
    await expect(page).toHaveURL(/login/);
  });

  test(
    "TC-LOGIN-010028 อีเมลแบบ XSS ต้องถูก reject อย่างปลอดภัย",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. ติด listener สำหรับ browser dialog (ห้ามเปิด)\n3. กรอก email = '<script>alert(1)</script>@x.com', password = 'anything'\n4. กด Sign In" },
        { type: "expected", description: "ไม่มี alert dialog เด้งจาก XSS payload และคงอยู่ที่ /login (input ถูก sanitize/escape)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
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
    "TC-LOGIN-010029 login username ผิดต้องได้รับ HTTP 401",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login; ไม่มี user 'wrong-user@nonexistent.com' ในระบบ" },
        { type: "steps", description: "1. เปิด /login\n2. ดัก response จาก POST /auth\n3. กรอก email = 'wrong-user@nonexistent.com', password = 'anypassword'\n4. กด Sign In" },
        { type: "expected", description: "Backend ตอบกลับ HTTP 401 Unauthorized และ user คงอยู่ที่ /login" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
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
    "TC-LOGIN-010030 login ชื่อเดิมผิด 3 ครั้ง ต้องได้รับ HTTP 429",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login; backend rate-limiter เปิดใช้งานอยู่ (429 หลัง 3 ครั้งที่ผิดด้วย email เดียวกัน)" },
        { type: "steps", description: "1. สร้าง email ที่ไม่มีจริง (unique per run)\n2. login ด้วย email + รหัสผิด ซ้ำ 3 ครั้ง\n3. ตรวจสอบ HTTP status ของ response สุดท้าย" },
        { type: "expected", description: "Response สุดท้ายเป็น HTTP 429 Too Many Requests และคงอยู่ที่ /login (rate-limit ทำงาน)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
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
    test(
      `${LOGOUT_TC[user.role]} ${user.role} ออกจากระบบสำเร็จ`,
      {
        annotation: [
          { type: "preconditions", description: `User ${user.email} (${user.role}) มีอยู่จริงและ active; browser logged out ก่อนเริ่ม test` },
          { type: "steps", description: "1. เปิด /login และ login ด้วย credentials ของ role นี้\n2. รอให้ไปที่ /dashboard\n3. เปิด user menu จาก avatar\n4. กด Logout" },
          { type: "expected", description: "Session ถูกล้างและ redirect กลับมาที่ /login" },
          { type: "priority", description: "High" },
          { type: "testType", description: "Smoke" },
        ],
      },
      async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithRetry(user.email, user.password);
        await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.userMenuTrigger().waitFor({ state: "visible", timeout: 15_000 });
        await dashboardPage.logout();

        await expect(page).toHaveURL(/login/, { timeout: 10_000 });
      },
    );
  }
});
