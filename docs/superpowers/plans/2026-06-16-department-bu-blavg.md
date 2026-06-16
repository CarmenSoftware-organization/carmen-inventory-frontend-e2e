# Department test — lock active BU to BLAVG — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `010-department.spec.ts` run with active BU = `BLAVG` as an explicit, idempotent precondition, and add a test that asserts the active BU is `BLAVG`.

**Architecture:** A pure-DOM `BuSwitcher` page object wraps the navbar BU switcher. A `tests/helpers/bu.ts` helper reads the profile API as ground truth, and `ensureActiveBu(page, code)` performs verify-or-switch: no-op if already on the target BU, otherwise switch through the real switcher UI and confirm via a fresh profile read. The department spec calls it in `beforeEach` and adds an assert TC.

**Tech Stack:** Playwright (`@playwright/test`), Vitest (pure-logic unit tests), TypeScript.

**Design doc:** `docs/superpowers/specs/2026-06-16-department-bu-blavg-design.md`

---

## File Structure

- **Create** `tests/helpers/bu.ts` — profile read + BU selection orchestration + pure helpers (`defaultBu`, `buLabel`, `escapeRegExp`, `getBusinessUnits`, `ensureActiveBu`).
- **Create** `tests/pages/bu-switcher.page.ts` — pure-DOM page object for the navbar switcher (extends `BasePage`).
- **Create** `unit/bu.test.ts` — Vitest unit tests for the pure functions in `bu.ts`.
- **Modify** `tests/010-department.spec.ts` — import + `beforeEach` precondition + new `TC-DEP-010009`.
- **Regenerate** `docs/user-stories/010-department.md` (via `bun docs:user-stories`).

Facts the implementation relies on (verified in design):
- Profile endpoint: `GET /api/proxy/api/user/profile` → `{ data: { business_unit: [...] } }`; each BU `{ id, name, code, alias_name, is_default }`. `"BLAVG"` is the `code`.
- `baseURL` is configured in `playwright.config.ts`, so `page.request.get("/api/...")` resolves against it and reuses the context's auth cookies.
- Switcher trigger is a navbar button carrying a `Building2` lucide icon (`svg.lucide-building-2`); the open menu has a `"Business Unit"` header; clicking a non-active item shows a `Switched to {name}` sonner toast.
- `BasePage` already provides `toast()` and `waitForToast(text)`.
- `BU_CODE = "BLAVG"` is exported from `tests/test-users.ts`.

---

## Task 1: Pure helpers + unit tests

**Files:**
- Create: `tests/helpers/bu.ts`
- Test: `unit/bu.test.ts`

- [ ] **Step 1: Write the failing unit tests**

Create `unit/bu.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { defaultBu, buLabel, escapeRegExp, type BusinessUnit } from "../tests/helpers/bu";

const bu = (over: Partial<BusinessUnit>): BusinessUnit => ({
  id: "id",
  name: "Name",
  code: "CODE",
  alias_name: null,
  is_default: false,
  ...over,
});

describe("defaultBu", () => {
  it("returns the BU flagged is_default", () => {
    const units = [bu({ code: "A" }), bu({ code: "B", is_default: true })];
    expect(defaultBu(units)?.code).toBe("B");
  });

  it("falls back to the first BU when none is default", () => {
    const units = [bu({ code: "A" }), bu({ code: "B" })];
    expect(defaultBu(units)?.code).toBe("A");
  });

  it("returns undefined for an empty list", () => {
    expect(defaultBu([])).toBeUndefined();
  });
});

describe("buLabel", () => {
  it("joins alias_name and name when alias present", () => {
    expect(buLabel(bu({ alias_name: "BLAVG", name: "Blue Hotel" }))).toBe("BLAVG - Blue Hotel");
  });

  it("uses name alone when alias is null", () => {
    expect(buLabel(bu({ alias_name: null, name: "Blue Hotel" }))).toBe("Blue Hotel");
  });
});

describe("escapeRegExp", () => {
  it("escapes regex metacharacters", () => {
    expect(escapeRegExp("A+B (x)")).toBe("A\\+B \\(x\\)");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:unit unit/bu.test.ts`
Expected: FAIL — cannot resolve `../tests/helpers/bu` (module not created yet).

- [ ] **Step 3: Write `tests/helpers/bu.ts` with the pure functions**

```ts
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BuSwitcherPage } from "../pages/bu-switcher.page";

/** One entry of `profile.business_unit[]` (see frontend `types/profile.ts`). */
export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  alias_name: string | null;
  is_default: boolean;
}

const PROFILE_ENDPOINT = "/api/proxy/api/user/profile";

/** The active BU: the one flagged is_default, else the first (mirrors useProfile). */
export function defaultBu(units: BusinessUnit[]): BusinessUnit | undefined {
  return units.find((b) => b.is_default) ?? units[0];
}

/** Display label as rendered by the switcher: "{alias_name} - {name}" or "{name}". */
export function buLabel(bu: BusinessUnit): string {
  return bu.alias_name ? `${bu.alias_name} - ${bu.name}` : bu.name;
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun run test:unit unit/bu.test.ts`
Expected: PASS (8 assertions across 3 describes).

Note: `bu.ts` imports `BuSwitcherPage` (created in Task 2). Vitest only type-checks/loads what the test touches, but to keep the import resolvable, create the page-object file in Task 2 before running the full suite. If this step errors on the missing import, proceed to Task 2 and re-run.

- [ ] **Step 5: Commit**

```bash
git add tests/helpers/bu.ts unit/bu.test.ts
git commit -m "test(e2e): add pure BU helpers (defaultBu, buLabel) with unit tests"
```

---

## Task 2: BuSwitcher page object

**Files:**
- Create: `tests/pages/bu-switcher.page.ts`

- [ ] **Step 1: Write the page object**

```ts
import type { Locator } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * Navbar Business-Unit switcher (frontend `components/navbar/bu-switcher.tsx`).
 * Pure DOM — no profile lookups or switch logic (that lives in helpers/bu.ts).
 */
export class BuSwitcherPage extends BasePage {
  /**
   * The switcher trigger button, disambiguated from the user-profile dropdown
   * by its Building2 lucide icon. If the lucide class ever changes, fall back to
   * `[data-slot="dropdown-menu-trigger"]` filtered by the same icon.
   */
  trigger(): Locator {
    return this.page
      .getByRole("button")
      .filter({ has: this.page.locator("svg.lucide-building-2") })
      .first();
  }

  /** "Business Unit" header inside the open dropdown content. */
  header(): Locator {
    return this.page.getByText("Business Unit", { exact: true });
  }

  /** A BU menu item, matched by substring of its accessible name. */
  itemByName(name: string): Locator {
    return this.page.getByRole("menuitem", { name });
  }

  async open(): Promise<void> {
    await this.trigger().waitFor({ state: "visible", timeout: 15_000 });
    await this.trigger().click();
    await this.header().waitFor({ state: "visible", timeout: 5_000 });
  }
}
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`
Expected: PASS (no type errors introduced).

- [ ] **Step 3: Re-run Task 1 unit tests now that the import resolves**

Run: `bun run test:unit unit/bu.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/pages/bu-switcher.page.ts
git commit -m "test(e2e): add BuSwitcher navbar page object"
```

---

## Task 3: `getBusinessUnits` + `ensureActiveBu` orchestration

**Files:**
- Modify: `tests/helpers/bu.ts`

- [ ] **Step 1: Append the network + orchestration functions to `tests/helpers/bu.ts`**

Add below the pure functions:

```ts
/** Fetch the active user's business units from the profile API (reuses context cookies). */
export async function getBusinessUnits(page: Page): Promise<BusinessUnit[]> {
  const res = await page.request.get(PROFILE_ENDPOINT);
  if (!res.ok()) {
    throw new Error(
      `Profile fetch failed: ${res.status()} ${res.statusText()} (${PROFILE_ENDPOINT})`,
    );
  }
  const json = await res.json();
  return json.data?.business_unit ?? [];
}

/**
 * Ensure the active business unit is the one with `code`.
 * Idempotent: no-op when already active; otherwise switch via the real UI and
 * confirm the default flipped by re-reading the profile.
 */
export async function ensureActiveBu(page: Page, code: string): Promise<void> {
  const units = await getBusinessUnits(page);
  const target = units.find((b) => b.code === code);
  if (!target) {
    throw new Error(
      `Active user has no business unit with code "${code}". ` +
        `Available: ${units.map((b) => b.code).join(", ") || "(none)"}`,
    );
  }
  if (target.is_default) return; // already active — fast path, no navigation

  const switcher = new BuSwitcherPage(page);
  await page.goto("/dashboard");
  await switcher.open();
  await switcher.itemByName(target.name).click();
  await switcher.waitForToast(new RegExp(`Switched to ${escapeRegExp(target.name)}`, "i"));

  // Confirm via backend truth that the default flipped to the target.
  const after = await getBusinessUnits(page);
  expect(defaultBu(after)?.code).toBe(code);
}
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Re-run unit tests (pure functions still green)**

Run: `bun run test:unit unit/bu.test.ts`
Expected: PASS (network functions are not exercised by unit tests).

- [ ] **Step 4: Commit**

```bash
git add tests/helpers/bu.ts
git commit -m "test(e2e): add ensureActiveBu verify-or-switch helper"
```

---

## Task 4: Wire into department spec + assert TC

**Files:**
- Modify: `tests/010-department.spec.ts`

- [ ] **Step 1: Add imports**

At the top of `tests/010-department.spec.ts`, alongside the existing imports, add:

```ts
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu, buLabel } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";
```

- [ ] **Step 2: Add the `beforeEach` precondition inside the describe**

Immediately after `test.describe("Department — Smoke & CRUD", () => {`, insert:

```ts
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });
```

- [ ] **Step 3: Add the assert test `TC-DEP-010009`**

Insert this test after `TC-DEP-010001` (so the smoke checks stay grouped):

```ts
  test(
    "TC-DEP-010009 active BU = BLAVG",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว" },
        { type: "steps", description: "1. อ่าน profile API (/api/proxy/api/user/profile)\n2. หา business unit ที่ is_default\n3. เปิดหน้าใดๆ ที่มี navbar แล้วอ่าน label ของ BU switcher" },
        { type: "expected", description: "default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const units = await getBusinessUnits(page);
      const active = defaultBu(units);
      expect(active?.code).toBe(BU_CODE);

      await page.goto("/dashboard");
      const switcher = new BuSwitcherPage(page);
      await expect(switcher.trigger()).toContainText(active!.name, { timeout: 15_000 });
      // buLabel documents the full rendered form; name is the stable substring.
      void buLabel;
    },
  );
```

- [ ] **Step 4: Run the new test in isolation**

Run: `bun run test -- -g "TC-DEP-010009"`
Expected: PASS — profile default BU code is `BLAVG` and the navbar trigger shows its name. (If admin's default is not yet BLAVG, `beforeEach` switches first, so this still passes.)

- [ ] **Step 5: Run the whole department spec**

Run: `bun run test -- 010-department.spec.ts`
Expected: all department tests PASS (CRUD now runs in the BLAVG-scoped department API).

- [ ] **Step 6: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "test(department): lock active BU to BLAVG + assert TC-DEP-010009"
```

---

## Task 5: Regenerate docs + audits

**Files:**
- Regenerate: `docs/user-stories/010-department.md`

- [ ] **Step 1: Annotation-completeness audit on the spec**

Run:
```bash
f=tests/010-department.spec.ts; \
pre=$(grep -c 'type: "preconditions"' "$f"); \
exp=$(grep -c 'type: "expected"' "$f"); \
echo "pre=$pre exp=$exp"; [ "$pre" = "$exp" ] && echo OK || echo MISMATCH
```
Expected: `pre` equals `exp`, prints `OK`.

- [ ] **Step 2: TC-ID audit**

Run: `bun audit:tc-ids`
Expected: PASS (no format/prefix/section violations; `DEP` already registered).

- [ ] **Step 3: Regenerate user-story docs**

Run: `bun docs:user-stories`
Expected: `docs/user-stories/010-department.md` updated to include `TC-DEP-010009`.

- [ ] **Step 4: Commit the regenerated docs**

```bash
git add docs/user-stories/010-department.md
git commit -m "docs(user-stories): regenerate for TC-DEP-010009"
```

---

## Self-Review notes

- **Spec coverage:** central reusable helper (Task 1–3), verify-or-switch idempotent (`ensureActiveBu`, Task 3), assert TC `TC-DEP-010009` (Task 4), API+UI hybrid (profile read + real switcher click), `auth.setup.ts`/`test-id-scheme.md` untouched, docs regen + audits (Task 5). All design decisions mapped.
- **Type consistency:** `BusinessUnit` shape and the function names `defaultBu` / `buLabel` / `escapeRegExp` / `getBusinessUnits` / `ensureActiveBu` are identical across Tasks 1, 3, and 4; `BuSwitcherPage` methods `trigger` / `header` / `itemByName` / `open` are used exactly as defined in Task 2.
- **Known runtime risk:** the `svg.lucide-building-2` class is the trigger disambiguator — if a step fails to find the trigger, verify the icon's class on the running app and apply the documented `[data-slot="dropdown-menu-trigger"]` fallback. This is the one locator worth confirming live during Task 2/4.
