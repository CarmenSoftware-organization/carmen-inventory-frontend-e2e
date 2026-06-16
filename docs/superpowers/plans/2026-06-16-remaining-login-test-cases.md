# Remaining Login Test Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six login E2E cases (TC-LOGIN-010035/038/039/041/042/043) covering session persistence/security and form-UX states to `tests/001-login.spec.ts`.

**Architecture:** Approach A — inline tests in the existing login spec, with three new locator factories on `LoginPage`. All cases run against the real backend via `loginWithRetry`; no request mocking. Two cases (010039, 010042) are timing-sensitive and use tolerant/best-effort assertions.

**Tech Stack:** Playwright, TypeScript, Bun. Page objects use locator-factory arrow methods. Tests verify behavior that already exists in `../carmen-inventory-frontend-react`, so the TDD cycle here is **write test → run → expect PASS** (a failing run signals either a test bug or a real app regression — investigate, don't auto-edit the app).

**Spec:** `docs/superpowers/specs/2026-06-16-remaining-login-test-cases-design.md`

---

## File structure

- **Modify** `tests/pages/login.page.ts` — add 3 locator factories (`showPasswordToggle`, `hidePasswordToggle`, `countdownMessage`).
- **Modify** `tests/001-login.spec.ts` — add 5 tests to the `"เข้าสู่ระบบ"` describe and 1 test to the `"ออกจากระบบ"` describe.
- **Regenerate** `docs/user-stories/001-login.md` via `bun docs:user-stories` (do not hand-edit).

Reference facts (verified):
- requestor creds: `requestor@blueledgers.com` / `TEST_PASSWORD` (`"12345678"`), imported already in the spec.
- refresh-token localStorage key: `carmen.refresh_token`.
- 010035 `?next=` target: `/profile` (shell route, role-agnostic, requestor-accessible). Fallback if it ever bounces: `/notifications`.
- Existing `LoginPage` methods: `emailInput`, `passwordInput`, `submitButton`, `rateLimitMessage`, `serverUnavailableMessage`, `goto`, `login`, `loginWithRetry`.
- Existing `DashboardPage` methods used: `userMenuTrigger()`, `logout()`.

---

### Task 1: Add LoginPage locator factories

**Files:**
- Modify: `tests/pages/login.page.ts`

- [ ] **Step 1: Add the three locators after `serverUnavailableMessage`**

In `tests/pages/login.page.ts`, the locator block currently ends with the `serverUnavailableMessage` factory. Add these immediately after it (inside the class, before `async goto()`):

```ts
  readonly showPasswordToggle = () =>
    this.page.getByRole("button", { name: /show password/i });
  readonly hidePasswordToggle = () =>
    this.page.getByRole("button", { name: /hide password/i });
  /** Rate-limit countdown text shown after a 429 carrying retry_after. */
  readonly countdownMessage = () =>
    this.page.getByText(/too many login attempts.*try again in \d+\s*s/i);
```

- [ ] **Step 2: Type-check the file compiles**

Run: `bun x tsc --noEmit -p tsconfig.json`
Expected: no errors (or no NEW errors referencing `login.page.ts`).

- [ ] **Step 3: Commit**

```bash
git add tests/pages/login.page.ts
git commit -m "test(login): add show/hide-password and countdown locators"
```

---

### Task 2: TC-LOGIN-010035 — valid ?next= honored

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert the test in the `"เข้าสู่ระบบ"` describe**

Anchor: the TC-LOGIN-010040 test is the last test in the `"เข้าสู่ระบบ"` describe. It ends with:

```ts
      await expect(loginPage.serverUnavailableMessage()).toBeVisible({ timeout: 15_000 });
      await expect(page).toHaveURL(/login/);
    },
  );
});
```

Insert the following tests (Tasks 2–6) **between the `);` that closes TC-010040 and the `});` that closes the describe**. Add this test first:

```ts

  // ── Redirect / session / form UX (batch 2) ────────────────────────────────
  test(
    "TC-LOGIN-010035 login พร้อม ?next= ที่ valid ต้อง redirect ไปปลายทางนั้น",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out; /profile เป็น shell route ที่ requestor เข้าได้" },
        { type: "steps", description: "1. เปิด /login?next=/profile\n2. login ด้วย requestor@blueledgers.com\n3. ตรวจสอบ URL ปลายทาง" },
        { type: "expected", description: "หลัง login redirect ไป /profile (เคารพ ?next= ที่ปลอดภัย) ไม่ใช่ /dashboard" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto("/login?next=/profile");
      await loginPage.loginWithRetry("requestor@blueledgers.com", TEST_PASSWORD);
      await expect(page).toHaveURL(/\/profile/, { timeout: 15_000 });
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010035"`
Expected: 1 passed. If it lands on `/dashboard` instead of `/profile`, requestor was bounced — switch the target to `/notifications` in both `goto` and the `toHaveURL` regex, rerun. If still bouncing, stop and report (the `?next=` feature may be broken).

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010035 honor valid ?next= after login"
```

---

### Task 3: TC-LOGIN-010043 — tampered refresh token bounced

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert after the TC-010035 test (still inside `"เข้าสู่ระบบ"`)**

```ts

  test(
    "TC-LOGIN-010043 refresh token ปลอม/เสีย เข้า /dashboard ต้องเด้งไป login",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; localStorage มี refresh token ที่ไม่ valid (ปลอม)" },
        { type: "steps", description: "1. เปิด /login เพื่อ set origin\n2. set localStorage carmen.refresh_token เป็นค่าปลอม\n3. navigate ไป /dashboard" },
        { type: "expected", description: "boot ใช้ refresh token ปลอม → backend ปฏิเสธ → token store ว่าง → RequireAuth เด้งไป /login" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
      ],
    },
    async ({ page }) => {
      await page.goto("/login");
      await page.evaluate(() =>
        localStorage.setItem("carmen.refresh_token", "garbage-invalid-token"),
      );
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/login/, { timeout: 15_000 });
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010043"`
Expected: 1 passed (redirected to /login). If it reaches /dashboard, the boot refresh accepted a garbage token — stop and report (real security concern).

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010043 tampered refresh token bounced to login"
```

---

### Task 4: TC-LOGIN-010041 — show/hide password toggle

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert after the TC-010043 test (still inside `"เข้าสู่ระบบ"`)**

```ts

  test(
    "TC-LOGIN-010041 ปุ่ม show/hide password สลับการแสดงรหัสผ่านได้",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; อยู่ที่ /login" },
        { type: "steps", description: "1. เปิด /login\n2. กรอกรหัสผ่าน\n3. กดปุ่ม Show password\n4. กดปุ่ม Hide password" },
        { type: "expected", description: "เริ่มต้น type=password; กด Show → type=text; กด Hide → type=password อีกครั้ง" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.passwordInput().fill(TEST_PASSWORD);

      await expect(loginPage.passwordInput()).toHaveAttribute("type", "password");
      await loginPage.showPasswordToggle().click();
      await expect(loginPage.passwordInput()).toHaveAttribute("type", "text");
      await loginPage.hidePasswordToggle().click();
      await expect(loginPage.passwordInput()).toHaveAttribute("type", "password");
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010041"`
Expected: 1 passed. If the toggle button name differs, inspect the rendered button text and adjust the locator regex in `login.page.ts` (Task 1).

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010041 show/hide password toggle"
```

---

### Task 5: TC-LOGIN-010039 — submit disabled in-flight (best-effort)

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert after the TC-010041 test (still inside `"เข้าสู่ระบบ"`)**

```ts

  test(
    "TC-LOGIN-010039 ปุ่ม Sign In ถูก disable ระหว่าง request กำลังทำงาน (กัน double-submit)",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com มีอยู่จริงและ active; browser logged out" },
        { type: "steps", description: "1. เปิด /login\n2. กรอก credentials\n3. กด Sign In\n4. ตรวจสถานะปุ่มทันทีระหว่าง request" },
        { type: "expected", description: "ปุ่ม disabled ระหว่าง in-flight; ถ้า backend ตอบเร็วจน redirect ไป /dashboard ก่อนสังเกตได้ ถือว่าผ่าน (ไม่เปิดช่อง double-submit) — best-effort" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.emailInput().fill("requestor@blueledgers.com");
      await loginPage.passwordInput().fill(TEST_PASSWORD);
      await loginPage.submitButton().click();

      // best-effort: จับ disabled ทันภายใน 1s หรือถือว่า login จบเร็วแล้วไป dashboard
      let sawDisabled = true;
      try {
        await expect(loginPage.submitButton()).toBeDisabled({ timeout: 1_000 });
      } catch {
        sawDisabled = false;
      }
      if (!sawDisabled) {
        await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
      }
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010039"`
Expected: 1 passed (either the disabled state was caught, or login completed to /dashboard).

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010039 submit disabled in-flight (best-effort)"
```

---

### Task 6: TC-LOGIN-010042 — rate-limit countdown UI (best-effort)

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert after the TC-010039 test (last test in `"เข้าสู่ระบบ"`, just before the describe's closing `});`)**

```ts

  test(
    "TC-LOGIN-010042 หลังผิดซ้ำจนโดน rate-limit ต้องแสดง countdown และ disable ปุ่ม",
    {
      annotation: [
        { type: "preconditions", description: "browser logged out; backend rate-limiter เปิด (429 + retry_after หลังผิด 3 ครั้งด้วย email เดียวกัน)" },
        { type: "steps", description: "1. สร้าง email ปลอม unique ต่อ run\n2. login ด้วยรหัสผิดซ้ำ 3 ครั้ง\n3. ตรวจ UI หลังโดน 429" },
        { type: "expected", description: "แสดงข้อความ countdown 'Too many login attempts. Try again in Ns.' และปุ่ม Sign In ถูก disable — best-effort (พึ่ง retry_after จาก backend)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const wrongEmail = `countdown-${Date.now()}@nonexistent.com`;

      for (let i = 0; i < 3; i++) {
        await loginPage.goto();
        const resPromise = page.waitForResponse(
          (res) => res.url().includes("/auth") && res.request().method() === "POST",
          { timeout: 10_000 },
        );
        await loginPage.login(wrongEmail, "wrongpassword");
        await resPromise.catch(() => null);
      }

      await expect(loginPage.countdownMessage()).toBeVisible({ timeout: 15_000 });
      await expect(loginPage.submitButton()).toBeDisabled();
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010042"`
Expected: 1 passed. If the countdown text never appears (backend returned 429 without `retry_after`, showing the fallback "Please try again later."), this is the accepted best-effort flake — note it; do NOT broaden the regex to hide the difference unless the user agrees.

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010042 rate-limit countdown UI (best-effort)"
```

---

### Task 7: TC-LOGIN-010038 — logout clears refresh token

**Files:**
- Modify: `tests/001-login.spec.ts`

- [ ] **Step 1: Insert in the `"ออกจากระบบ"` describe**

Anchor: the `"ออกจากระบบ"` describe contains a `for (const user of TEST_USERS) { ... test(...) ... }` loop. After the loop's closing `}` and before the describe's closing `});`, the file reads:

```ts
      },
    );
  }
});
```

Insert this test **between the `}` that closes the `for` loop and the `});` that closes the describe**:

```ts

  test(
    "TC-LOGIN-010038 logout ต้องลบ refresh token และเข้าถึง dashboard ไม่ได้",
    {
      annotation: [
        { type: "preconditions", description: "User requestor@blueledgers.com login สำเร็จและมี refresh token ใน localStorage" },
        { type: "steps", description: "1. login ด้วย requestor@blueledgers.com\n2. ตรวจว่ามี refresh token\n3. logout\n4. ตรวจว่า refresh token ถูกลบ\n5. navigate ไป /dashboard" },
        { type: "expected", description: "หลัง logout: refresh token ถูกลบจาก localStorage และเข้า /dashboard ไม่ได้ (เด้งกลับ /login)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Security" },
      ],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginWithRetry("requestor@blueledgers.com", TEST_PASSWORD);
      await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

      const before = await page.evaluate(() =>
        localStorage.getItem("carmen.refresh_token"),
      );
      expect(before).toBeTruthy();

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.userMenuTrigger().waitFor({ state: "visible", timeout: 15_000 });
      await dashboardPage.logout();
      await expect(page).toHaveURL(/login/, { timeout: 10_000 });

      const after = await page.evaluate(() =>
        localStorage.getItem("carmen.refresh_token"),
      );
      expect(after).toBeFalsy();

      await page.goto("/dashboard");
      await expect(page).toHaveURL(/login/, { timeout: 15_000 });
    },
  );
```

- [ ] **Step 2: Run the test, expect PASS**

Run: `bun run test:login -- -g "TC-LOGIN-010038"`
Expected: 1 passed. If `after` is still truthy, logout doesn't clear the refresh token — stop and report (real security concern).

- [ ] **Step 3: Commit**

```bash
git add tests/001-login.spec.ts
git commit -m "test(login): TC-LOGIN-010038 logout clears refresh token"
```

---

### Task 8: Audits, docs regen, full-suite verification

**Files:**
- Modify (generated): `docs/user-stories/001-login.md` (+ footer-only churn in other `docs/user-stories/*.md`)

- [ ] **Step 1: Annotation completeness audit**

Run:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: no `MISMATCH` lines.

- [ ] **Step 2: TC ID audit**

Run: `bun audit:tc-ids`
Expected: `[OK] ... 0 errors`.

- [ ] **Step 3: Regenerate user-story docs**

Run: `bun docs:user-stories`
Expected: writes files; `docs/user-stories/001-login.md` now lists TC-LOGIN-010035/038/039/041/042/043.

- [ ] **Step 4: Run the full login suite**

Run: `bun run test:login`
Expected: the six new tests pass; pre-existing known states unchanged (TC-LOGIN-010007 skipped; 010029/010030 may transiently 429 if the backend was hammered — rerun after a cooldown if so). Record actual pass/fail counts; do not claim green without the output.

- [ ] **Step 5: Commit docs**

```bash
git add docs/user-stories/
git commit -m "docs(user-stories): regenerate for login batch 2 cases"
```

---

## Self-review

**Spec coverage:** All six spec cases have tasks — 010035 (T2), 010043 (T3), 010041 (T4), 010039 (T5), 010042 (T6), 010038 (T7); locator additions (T1); gates/docs (T8). ✅

**Placeholder scan:** No TBD/TODO; every code step shows full code. The 010035 `<path>` open-detail from the spec is resolved to `/profile` with a concrete fallback (`/notifications`). ✅

**Type/name consistency:** Locator names (`showPasswordToggle`, `hidePasswordToggle`, `countdownMessage`) defined in T1 are used verbatim in T4/T6. `submitButton`, `emailInput`, `passwordInput`, `loginWithRetry`, `login`, `goto` are existing methods. `DashboardPage.userMenuTrigger()`/`logout()` match existing logout tests. localStorage key `carmen.refresh_token` consistent across T3/T7. ✅
