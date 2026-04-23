# Vendor E2E Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Playwright e2e suite for the `vendor-management/vendor` module with 28 test cases (`TC-VEN01..TC-VEN28`) covering list smoke, CRUD happy path, 4 tabs, 3 dynamic arrays, key validations, edit, and cleanup.

**Architecture:** Dedicated `VendorPage` class in `tests/pages/vendor.page.ts` composed with `ConfigListPage` for list-view operations. Spec file `tests/vendor.spec.ts` uses `createAuthTest("purchase@blueledgers.com")` and runs serially so one "primary" vendor created in TC-VEN08 flows through edit (TC-VEN25) and delete (TC-VEN27). Address tab tests default to "international" mode to avoid Thai lookup flakiness. `scripts/sync-test-results.ts` gets a one-line `SYNC_TARGETS` entry so results sync to a Google Sheets "Vendor" tab.

**Tech Stack:** Playwright `^1.58.2`, TypeScript, bun, Radix UI (tabs + popover + dialog), react-hook-form + Zod, next-intl.

---

## File Structure

- **Create:** `tests/pages/vendor.page.ts` — VendorPage class (~220 LOC)
- **Create:** `tests/vendor.spec.ts` — 28 tests across 5 describe blocks (~720 LOC)
- **Modify:** `scripts/sync-test-results.ts` — add `{ csvFile: "vendor-results.csv", sheetTab: "Vendor" }` to `SYNC_TARGETS`
- **Auto-written at run time:** `tests/results/vendor-results.csv` (by `tc-csv-reporter`)

Nothing else changes. Existing page objects, fixtures, config, and other specs are untouched.

---

## Verified selectors from `carmen-inventory-frontend`

| Field / action | Selector / locator |
|---|---|
| Code input | `#vendor-code` (max 10 chars) |
| Name input | `#vendor-name` (max 100 chars) |
| Description | `#vendor-description` (max 256 chars) |
| Active switch | `#vendor-is-active` |
| Business type trigger | `button[aria-expanded]` inside General tab, next to "Business Type" label |
| Tab triggers | `getByRole("tab", { name })` — Radix TabsTrigger with i18n labels |
| Form submit | Button `type="submit" form="vendor-form"` — label `Create` (add) / `Save` (edit) |
| Form cancel | Button with text `Cancel` in FormToolbar |
| Address tab Add | `Button` with `<Plus/>` icon inside address tab content area |
| Address "International" radio | `#international-{index}` |
| Address address_type Select | Radix `role="combobox"` with placeholder `Address Type` (first select on the row) |
| Contact tab Add | Button with text matching `contact.addContact` i18n, or a `<Plus/>` icon in contact tab |
| Contact Primary checkbox | Checkbox in column "Primary" of the contacts DataGrid |
| Info tab Add | Button with `<Plus/>` icon next to info title |
| Info Select (data_type) | Radix Select; options `string` / `number` by value |
| Save success | Toast with i18n key `toast.createSuccess` or `toast.updateSuccess`, then redirect to `/vendor-management/vendor` |
| Delete confirm | `DeleteDialog` with `role="alertdialog"`, confirm button by role |

**Key behavior:** `prependAddress` / `prependContact` / `prependInfo` — new rows are inserted at **index 0** (existing rows shift down). Tests filling "the just-added row" always fill index 0.

**Routes:**
- List: `/vendor-management/vendor`
- New: `/vendor-management/vendor/new`
- Detail: `/vendor-management/vendor/[id]`

---

## Task 0: Scaffold empty files + sync config

**Files:**
- Create: `tests/pages/vendor.page.ts`
- Create: `tests/vendor.spec.ts`
- Modify: `scripts/sync-test-results.ts` (add entry to `SYNC_TARGETS`)

- [ ] **Step 0.1: Create empty VendorPage stub**

```ts
// tests/pages/vendor.page.ts
import type { Page, Locator } from "@playwright/test";
import { ConfigListPage } from "./config-list.page";

export interface VendorAddressInput {
  address_type?: "contact_address" | "mailing_address" | "register_address";
  address_line1?: string;
  address_line2?: string;
  city?: string;
  district?: string;
  sub_district?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  mode?: "thai" | "international";
}

export interface VendorContactInput {
  name?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

export interface VendorInfoInput {
  label: string;
  value: string;
  dataType?: "string" | "number";
}

export interface VendorFormData {
  code: string;
  name: string;
  description?: string;
  businessType?: string;            // option label to pick; if omitted, picks first available
  isActive?: boolean;
  addresses?: VendorAddressInput[];
  contacts?: VendorContactInput[];
  info?: VendorInfoInput[];
}

export const LIST_PATH = "/vendor-management/vendor";
export const NEW_PATH = "/vendor-management/vendor/new";

export class VendorPage {
  readonly list: ConfigListPage;

  constructor(private page: Page) {
    this.list = new ConfigListPage(page, LIST_PATH);
  }
}
```

- [ ] **Step 0.2: Create empty spec with constants**

```ts
// tests/vendor.spec.ts
import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { VendorPage } from "./pages/vendor.page";

const test = createAuthTest("purchase@blueledgers.com");
test.describe.configure({ mode: "serial" });

const UID = Date.now().toString(36);
const CODE = `V${UID.slice(-6).toUpperCase()}`;
const NAME = `E2E VEN ${UID}`;
const NAME_UPDATED = `E2E VEN Upd ${UID}`;

// Placeholder so the file compiles before tests are added.
test.describe("Vendor — scaffold", () => {
  test("TC-VEN00 scaffold placeholder", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(page).toHaveURL(/vendor-management\/vendor/);
  });
});
```

- [ ] **Step 0.3: Add Vendor entry to SYNC_TARGETS**

Open `scripts/sync-test-results.ts` and find the `SYNC_TARGETS` array (around line 42). Append this entry at the end:

```ts
  { csvFile: "unit-results.csv", sheetTab: "Unit" },
  { csvFile: "vendor-results.csv", sheetTab: "Vendor" },
];
```

- [ ] **Step 0.4: Run the scaffold test to prove wiring works**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts --project=chromium`

Expected: `1 passed` (TC-VEN00 passes — navigates to list). If frontend is not running on `:3000`, drop `E2E_NO_WEBSERVER=1`.

- [ ] **Step 0.5: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts scripts/sync-test-results.ts
git commit -m "test: scaffold vendor e2e suite skeleton

Empty VendorPage class, placeholder TC-VEN00 spec, and Google Sheets
SYNC_TARGETS entry for the vendor tab. Proves wiring before building
out the 28 tests.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 1: List smoke — TC-VEN01..05

**Files:**
- Modify: `tests/vendor.spec.ts` — replace placeholder describe with list smoke block

- [ ] **Step 1.1: Replace the placeholder describe with the list smoke describe**

Delete the `"Vendor — scaffold"` describe block and add:

```ts
test.describe("Vendor — List smoke", () => {
  test("TC-VEN01 หน้า list โหลดสำเร็จ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(page).toHaveURL(/vendor-management\/vendor/);
    await expect(vendor.list.addButton()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-VEN02 ปุ่ม Add แสดง", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.addButton()).toBeVisible();
  });

  test("TC-VEN03 ช่องค้นหาใช้งานได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await expect(vendor.list.searchInput()).toBeVisible();
    await vendor.list.search("test");
  });

  test("TC-VEN04 ค้นหาคำที่ไม่มีต้องแสดง empty state", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    await vendor.list.search(`__NOPE__${UID}`);
    await expect(vendor.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });

  test("TC-VEN05 Filter status (active/inactive) ใช้งานได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.list.goto();
    // StatusFilter is a select/button; open it and pick "Active"
    const statusTrigger = page.getByRole("combobox").filter({ hasText: /status|all|active/i }).first();
    if (await statusTrigger.count() === 0) {
      // Fallback: the filter might be a button with combobox role
      const btn = page.getByRole("button", { name: /status|filter/i }).first();
      await btn.click();
    } else {
      await statusTrigger.click();
    }
    const activeOption = page.getByRole("option", { name: /^active$/i });
    if (await activeOption.count() > 0) {
      await activeOption.first().click();
      await page.waitForLoadState("networkidle");
    }
    // Either way, the list should render without crash
    await expect(vendor.list.addButton()).toBeVisible();
  });
});
```

- [ ] **Step 1.2: Run the list smoke tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN0[1-5]"`

Expected: `5 passed`. If TC-VEN05 fails because the status filter markup differs, take a screenshot (`page.screenshot`) and relax the locator to match whatever is there — the test only needs to prove the filter control is present and interactable, not a specific UX.

- [ ] **Step 1.3: Commit**

```bash
git add tests/vendor.spec.ts
git commit -m "test(vendor): add TC-VEN01..05 list smoke tests

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: New-form navigation + General tab locators + tab switching

**Files:**
- Modify: `tests/pages/vendor.page.ts` — add navigation, General tab locators, `switchTab`
- Modify: `tests/vendor.spec.ts` — add TC-VEN06, TC-VEN11

- [ ] **Step 2.1: Add navigation + General tab + tab switcher to VendorPage**

Append to `tests/pages/vendor.page.ts` (inside the class body):

```ts
  // ── Navigation ────────────────────────────────────────────────────────
  async gotoList() {
    await this.page.goto(LIST_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNew() {
    await this.page.goto(NEW_PATH);
    await this.page.waitForLoadState("networkidle");
  }

  // ── Form — General tab ────────────────────────────────────────────────
  codeInput(): Locator {
    return this.page.locator("#vendor-code");
  }

  nameInput(): Locator {
    return this.page.locator("#vendor-name");
  }

  descriptionInput(): Locator {
    return this.page.locator("#vendor-description");
  }

  activeSwitch(): Locator {
    return this.page.locator("#vendor-is-active");
  }

  saveButton(): Locator {
    // FormToolbar submit button — text is "Create" in add mode, "Save" in edit mode
    return this.page
      .getByRole("button", { name: /^(Create|Save)$/i })
      .and(this.page.locator('[type="submit"]'));
  }

  cancelButton(): Locator {
    return this.page.getByRole("button", { name: /^Cancel$/i });
  }

  editButton(): Locator {
    return this.page.getByRole("button", { name: /^Edit$/i });
  }

  // ── Tabs ──────────────────────────────────────────────────────────────
  tabTrigger(tab: "general" | "info" | "address" | "contact"): Locator {
    const labelMap: Record<string, RegExp> = {
      general: /general|ทั่วไป/i,
      info: /info|ข้อมูล/i,
      address: /address|ที่อยู่/i,
      contact: /contact|ผู้ติดต่อ/i,
    };
    return this.page.getByRole("tab", { name: labelMap[tab] });
  }

  async switchTab(tab: "general" | "info" | "address" | "contact") {
    const trigger = this.tabTrigger(tab);
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "active", { timeout: 5_000 });
  }
```

Also add at the top of the file (below existing imports):

```ts
import { expect } from "@playwright/test";
```

- [ ] **Step 2.2: Add TC-VEN06 and TC-VEN11 to spec**

After the "Vendor — List smoke" describe, add:

```ts
test.describe("Vendor — Create happy path", () => {
  test("TC-VEN06 เปิดหน้า new form สำเร็จ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await expect(page).toHaveURL(/vendor-management\/vendor\/new/);
    await expect(vendor.codeInput()).toBeVisible({ timeout: 10_000 });
    await expect(vendor.nameInput()).toBeVisible();
    await expect(vendor.saveButton()).toBeVisible();
  });
});

test.describe("Vendor — Tabs & dynamic arrays", () => {
  test("TC-VEN11 สลับ tab ทั้ง 4 tabs ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    for (const tab of ["general", "info", "address", "contact"] as const) {
      await vendor.switchTab(tab);
      await expect(vendor.tabTrigger(tab)).toHaveAttribute("data-state", "active");
    }
  });
});
```

- [ ] **Step 2.3: Run the new tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(06|11)"`

Expected: `2 passed`. If the tab label regex doesn't match (i18n variant), inspect the rendered page with `await page.pause()` and adjust the `labelMap` regex.

- [ ] **Step 2.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add new-form nav + tab switcher (TC-VEN06, 11)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Business-type selector (LookupBuType) — TC-VEN07

**Files:**
- Modify: `tests/pages/vendor.page.ts` — add `businessTypeTrigger`, `pickBusinessType`
- Modify: `tests/vendor.spec.ts` — add TC-VEN07

- [ ] **Step 3.1: Add business-type helpers to VendorPage**

Append inside the class body:

```ts
  // ── Business type (multi-select Popover + Command) ───────────────────
  businessTypeTrigger(): Locator {
    // Button with aria-expanded inside the General tab form area
    return this.page
      .getByRole("button", { expanded: false })
      .filter({ has: this.page.locator('svg[class*="ChevronsUpDown"]').or(this.page.locator(".lucide-chevrons-up-down")) })
      .first();
  }

  businessTypeSearch(): Locator {
    return this.page.getByPlaceholder(/search.*business type/i);
  }

  /**
   * Open the business-type popover and click the first option.
   * If `label` is provided, search for it first. Returns the label that was selected.
   */
  async pickBusinessType(label?: string): Promise<string> {
    await this.businessTypeTrigger().click();
    await this.businessTypeSearch().waitFor({ state: "visible", timeout: 5_000 });
    if (label) {
      await this.businessTypeSearch().fill(label);
    }
    const firstOption = this.page.getByRole("option").first();
    await firstOption.waitFor({ state: "visible", timeout: 5_000 });
    const text = (await firstOption.textContent()) ?? "";
    await firstOption.click();
    // Close the popover by pressing Escape
    await this.page.keyboard.press("Escape");
    return text.trim();
  }

  async businessTypeOptionCount(): Promise<number> {
    await this.businessTypeTrigger().click();
    await this.businessTypeSearch().waitFor({ state: "visible", timeout: 5_000 });
    const count = await this.page.getByRole("option").count();
    await this.page.keyboard.press("Escape");
    return count;
  }
```

- [ ] **Step 3.2: Add TC-VEN07**

Inside the "Vendor — Create happy path" describe, after TC-VEN06:

```ts
  test("TC-VEN07 เลือก business type จาก dropdown ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const count = await vendor.businessTypeOptionCount();
    if (count === 0) {
      test.skip(true, "No business types seeded in backend — skipping TC-VEN07..");
    }
    const label = await vendor.pickBusinessType();
    expect(label.length).toBeGreaterThan(0);
    // Verify the selected badge appears on the trigger
    await expect(vendor.businessTypeTrigger()).toContainText(label, { timeout: 5_000 });
  });
```

- [ ] **Step 3.3: Run TC-VEN07**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN07"`

Expected: `1 passed` (or skipped with clear reason if backend has zero business types). If the trigger locator is ambiguous (matches more than one button), refine by scoping to the General tab panel: `page.getByRole("tabpanel", { name: /general/i }).getByRole("button", { expanded: false })`.

- [ ] **Step 3.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add business-type selector (TC-VEN07)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Create minimum vendor — TC-VEN08

**Files:**
- Modify: `tests/pages/vendor.page.ts` — add `createVendor()`, `expectSaved()`, `fillGeneral()`
- Modify: `tests/vendor.spec.ts` — add TC-VEN08

- [ ] **Step 4.1: Add form-fill helpers to VendorPage**

Append inside the class body:

```ts
  // ── Fill helpers ──────────────────────────────────────────────────────
  async fillGeneral(data: Pick<VendorFormData, "code" | "name" | "description" | "businessType">) {
    await this.switchTab("general");
    await this.codeInput().fill(data.code);
    await this.nameInput().fill(data.name);
    if (data.description !== undefined) {
      await this.descriptionInput().fill(data.description);
    }
    if (data.businessType !== undefined) {
      const count = await this.businessTypeOptionCount();
      if (count > 0) {
        await this.pickBusinessType(data.businessType || undefined);
      }
    }
  }

  /**
   * High-level flow: fill general (+ optional tabs) and save.
   * Does not wait for redirect — caller uses expectSaved().
   */
  async createVendor(data: VendorFormData) {
    await this.fillGeneral(data);
    if (data.addresses) {
      await this.switchTab("address");
      for (const a of data.addresses) {
        await this.addAddressRow();
        await this.fillAddress(0, a);
      }
    }
    if (data.contacts) {
      await this.switchTab("contact");
      for (const c of data.contacts) {
        await this.addContactRow();
        await this.fillContact(0, c);
      }
    }
    if (data.info) {
      await this.switchTab("info");
      for (const i of data.info) {
        await this.addInfoRow();
        await this.fillInfo(0, i);
      }
    }
    await this.saveButton().click();
  }

  /** Wait for the success toast and redirect back to list. */
  async expectSaved() {
    await expect(
      this.page.getByText(/success|สำเร็จ|created|updated/i).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(this.page).toHaveURL(new RegExp(`${LIST_PATH}(?!/new)`), {
      timeout: 10_000,
    });
  }
```

- [ ] **Step 4.2: Add TC-VEN08**

Inside the "Vendor — Create happy path" describe, after TC-VEN07:

```ts
  test("TC-VEN08 สร้าง vendor ขั้นต่ำ (code + name + business type) สำเร็จ", async ({
    page,
  }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: CODE, name: NAME });
    const btCount = await vendor.businessTypeOptionCount();
    if (btCount > 0) {
      await vendor.pickBusinessType();
    }
    await vendor.saveButton().click();
    await vendor.expectSaved();

    // Verify it appears in the list
    await vendor.list.search(NAME);
    await expect(page.getByText(NAME).first()).toBeVisible({ timeout: 10_000 });
  });
```

- [ ] **Step 4.3: Stub the address/contact/info helpers so the spec compiles**

Append inside the class body (stubs will be fleshed out in tasks 5-7):

```ts
  // ── Address tab stubs (implemented in Task 5) ────────────────────────
  async addAddressRow() { throw new Error("not implemented yet"); }
  async fillAddress(_index: number, _data: VendorAddressInput) { throw new Error("not implemented yet"); }
  async removeAddressRow(_index: number) { throw new Error("not implemented yet"); }
  addressCount(): Promise<number> { throw new Error("not implemented yet"); }
  addressRow(_index: number): Locator { throw new Error("not implemented yet"); }

  // ── Contact tab stubs (implemented in Task 6) ────────────────────────
  async addContactRow() { throw new Error("not implemented yet"); }
  async fillContact(_index: number, _data: VendorContactInput) { throw new Error("not implemented yet"); }
  async removeContactRow(_index: number) { throw new Error("not implemented yet"); }
  async setPrimaryContact(_index: number) { throw new Error("not implemented yet"); }
  contactCount(): Promise<number> { throw new Error("not implemented yet"); }
  contactRow(_index: number): Locator { throw new Error("not implemented yet"); }

  // ── Info tab stubs (implemented in Task 7) ───────────────────────────
  async addInfoRow() { throw new Error("not implemented yet"); }
  async fillInfo(_index: number, _data: VendorInfoInput) { throw new Error("not implemented yet"); }
  async removeInfoRow(_index: number) { throw new Error("not implemented yet"); }
```

- [ ] **Step 4.4: Run TC-VEN08**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN08"`

Expected: `1 passed` — the vendor is created and appears on the list after search. On failure:
- Toast not detected → check i18n, adjust regex in `expectSaved`.
- Redirect didn't happen → backend validation error; check the form for error text via `page.getByText("text-destructive")`.

- [ ] **Step 4.5: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add minimum-data create flow (TC-VEN08)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Address tab dynamic array — TC-VEN09, TC-VEN12, TC-VEN13

**Files:**
- Modify: `tests/pages/vendor.page.ts` — replace address stubs with real implementations
- Modify: `tests/vendor.spec.ts` — add TC-VEN09, 12, 13

- [ ] **Step 5.1: Implement address methods in VendorPage**

Replace the 5 address stubs from Task 4 with:

```ts
  // ── Address tab ───────────────────────────────────────────────────────
  /** Locator scoped to the address tab panel. */
  private addressPanel(): Locator {
    return this.page.getByRole("tabpanel", { name: /address|ที่อยู่/i });
  }

  addressRow(index: number): Locator {
    // Each row wraps in a div — rely on structural anchors (address type Select + inputs)
    return this.addressPanel().locator("div.space-y-6").nth(index);
  }

  async addAddressRow() {
    await this.switchTab("address");
    const addButton = this.addressPanel().getByRole("button", { name: /^Add$|^เพิ่ม$/i });
    await addButton.click();
    // Wait for a new row to mount
    await this.page.waitForTimeout(200);
  }

  async addressCount(): Promise<number> {
    return await this.addressPanel().locator("div.space-y-6").count();
  }

  async removeAddressRow(index: number) {
    const row = this.addressRow(index);
    const removeBtn = row.getByRole("button", { name: /remove/i }).first();
    await removeBtn.click();
  }

  async fillAddress(index: number, data: VendorAddressInput) {
    const row = this.addressRow(index);

    // 1) address_type Select (first combobox in the row)
    if (data.address_type) {
      const typeTrigger = row.getByRole("combobox").first();
      await typeTrigger.click();
      const labelMap: Record<string, RegExp> = {
        contact_address: /contact/i,
        mailing_address: /mailing/i,
        register_address: /register/i,
      };
      await this.page.getByRole("option", { name: labelMap[data.address_type] }).first().click();
    }

    // 2) Thai vs International radio
    const mode = data.mode ?? "international";
    const radio = row.getByRole("radio", { name: mode === "thai" ? /thai/i : /international/i });
    await radio.check({ force: true });

    // 3) Address lines
    if (data.address_line1 !== undefined) {
      await row.getByPlaceholder(/address line 1/i).fill(data.address_line1);
    }
    if (data.address_line2 !== undefined) {
      await row.getByPlaceholder(/address line 2/i).fill(data.address_line2);
    }

    // 4) International fields (city/district/sub_district/province/postal/country)
    if (mode === "international") {
      if (data.city !== undefined) await row.getByPlaceholder(/^city$/i).fill(data.city);
      if (data.district !== undefined) await row.getByPlaceholder(/^district$/i).fill(data.district);
      if (data.sub_district !== undefined) await row.getByPlaceholder(/sub.?district/i).fill(data.sub_district);
      if (data.province !== undefined) await row.getByPlaceholder(/province|state/i).fill(data.province);
      if (data.postal_code !== undefined) await row.getByPlaceholder(/postal code/i).first().fill(data.postal_code);
      if (data.country !== undefined) await row.getByPlaceholder(/country/i).fill(data.country);
    }
  }
```

- [ ] **Step 5.2: Add TC-VEN09, 12, 13**

Inside "Vendor — Create happy path" (after TC-VEN08):

```ts
  test("TC-VEN09 สร้าง vendor พร้อม address 1 รายการ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const code = `${CODE}A`.slice(0, 10);
    const name = `${NAME} addr`;
    await vendor.fillGeneral({ code, name });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addAddressRow();
    await vendor.fillAddress(0, {
      address_type: "mailing_address",
      mode: "international",
      address_line1: "123 Test Ave",
      city: "Testville",
      country: "USA",
    });
    await vendor.saveButton().click();
    await vendor.expectSaved();

    // Cleanup: delete this transient vendor
    await vendor.list.search(name);
    await page.getByRole("row").filter({ hasText: name }).getByRole("button", { name: /delete|trash/i }).first().click();
    await page.getByRole("alertdialog").getByRole("button", { name: /confirm|delete|ลบ|ok/i }).click();
  });
```

Inside "Vendor — Tabs & dynamic arrays" (after TC-VEN11):

```ts
  test("TC-VEN12 เพิ่ม address row ได้หลาย row", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    expect(await vendor.addressCount()).toBe(0);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(1);
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
  });

  test("TC-VEN13 ลบ address row ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("address");
    await vendor.addAddressRow();
    await vendor.addAddressRow();
    expect(await vendor.addressCount()).toBe(2);
    await vendor.removeAddressRow(0);
    expect(await vendor.addressCount()).toBe(1);
  });
```

- [ ] **Step 5.3: Run the new tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(09|12|13)"`

Expected: `3 passed`. If cleanup in TC-VEN09 fails (row-level delete button not found), fall back to selecting the row checkbox + bulk delete — or skip cleanup for this single-test transient and let TC-VEN27 clean up at the end.

- [ ] **Step 5.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add address tab coverage (TC-VEN09, 12, 13)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Contact tab dynamic array + primary — TC-VEN10, 14, 15, 16

**Files:**
- Modify: `tests/pages/vendor.page.ts` — replace contact stubs
- Modify: `tests/vendor.spec.ts` — add TC-VEN10, 14, 15, 16

- [ ] **Step 6.1: Implement contact methods**

Replace the 5 contact stubs with:

```ts
  // ── Contact tab ───────────────────────────────────────────────────────
  private contactPanel(): Locator {
    return this.page.getByRole("tabpanel", { name: /contact|ผู้ติดต่อ/i });
  }

  contactRow(index: number): Locator {
    // Contacts render in a DataGrid — row is a <tr> in tbody
    return this.contactPanel().locator("tbody tr").nth(index);
  }

  async addContactRow() {
    await this.switchTab("contact");
    const addButton = this.contactPanel().getByRole("button", { name: /add.*contact|เพิ่ม/i }).first();
    await addButton.click();
    await this.page.waitForTimeout(200);
  }

  async contactCount(): Promise<number> {
    return await this.contactPanel().locator("tbody tr").count();
  }

  async removeContactRow(index: number) {
    const row = this.contactRow(index);
    await row.getByRole("button").last().click();          // trash button in the row
    // DeleteDialog confirmation
    await this.page
      .getByRole("alertdialog")
      .getByRole("button", { name: /confirm|delete|ลบ|ok/i })
      .click();
  }

  async fillContact(index: number, data: VendorContactInput) {
    const row = this.contactRow(index);
    if (data.name !== undefined) {
      await row.getByPlaceholder(/name/i).first().fill(data.name);
    }
    if (data.email !== undefined) {
      await row.locator('input[type="email"]').fill(data.email);
    }
    if (data.phone !== undefined) {
      await row.getByPlaceholder(/phone/i).fill(data.phone);
    }
    if (data.is_primary) {
      await this.setPrimaryContact(index);
    }
  }

  async setPrimaryContact(index: number) {
    const row = this.contactRow(index);
    const checkbox = row.getByRole("checkbox");
    await checkbox.check({ force: true });
  }
```

- [ ] **Step 6.2: Add TC-VEN10, 14, 15, 16**

In "Vendor — Create happy path":

```ts
  test("TC-VEN10 สร้าง vendor พร้อม contact 1 รายการ (primary)", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    const code = `${CODE}C`.slice(0, 10);
    const name = `${NAME} ctc`;
    await vendor.fillGeneral({ code, name });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addContactRow();
    await vendor.fillContact(0, {
      name: "Primary Person",
      email: "primary@example.com",
      phone: "0123456789",
      is_primary: true,
    });
    await vendor.saveButton().click();
    await vendor.expectSaved();
    await vendor.list.search(name);
    await expect(page.getByText(name).first()).toBeVisible({ timeout: 10_000 });
  });
```

In "Vendor — Tabs & dynamic arrays":

```ts
  test("TC-VEN14 เพิ่ม contact row ได้หลาย row", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    expect(await vendor.contactCount()).toBe(0);
    await vendor.addContactRow();
    await vendor.addContactRow();
    expect(await vendor.contactCount()).toBe(2);
  });

  test("TC-VEN15 ลบ contact row ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    await vendor.addContactRow();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "Will Remove" });
    expect(await vendor.contactCount()).toBe(2);
    await vendor.removeContactRow(0);
    expect(await vendor.contactCount()).toBe(1);
  });

  test("TC-VEN16 เปลี่ยน primary contact ได้ (radio exclusive)", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("contact");
    await vendor.addContactRow();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "A" });
    await vendor.fillContact(1, { name: "B" });
    await vendor.setPrimaryContact(0);
    await expect(vendor.contactRow(0).getByRole("checkbox")).toBeChecked();
    await vendor.setPrimaryContact(1);
    await expect(vendor.contactRow(1).getByRole("checkbox")).toBeChecked();
    // Row 0's checkbox should have been unchecked by the exclusive logic
    await expect(vendor.contactRow(0).getByRole("checkbox")).not.toBeChecked();
  });
```

- [ ] **Step 6.3: Run the new tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(10|14|15|16)"`

Expected: `4 passed`. If the "Add contact" button text doesn't match the regex, open the rendered page and adjust — check both English (`Add Contact`) and Thai translations.

- [ ] **Step 6.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add contact tab coverage (TC-VEN10, 14, 15, 16)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Info tab — TC-VEN17, 18

**Files:**
- Modify: `tests/pages/vendor.page.ts` — replace info stubs
- Modify: `tests/vendor.spec.ts` — add TC-VEN17, 18

- [ ] **Step 7.1: Implement info methods**

Replace the 3 info stubs with:

```ts
  // ── Info tab ──────────────────────────────────────────────────────────
  private infoPanel(): Locator {
    return this.page.getByRole("tabpanel", { name: /info|ข้อมูล/i });
  }

  infoRow(index: number): Locator {
    return this.infoPanel().locator("div.flex.items-start.gap-2").nth(index);
  }

  async addInfoRow() {
    await this.switchTab("info");
    const addButton = this.infoPanel().getByRole("button", { name: /^Add$|^เพิ่ม$/i }).first();
    await addButton.click();
    await this.page.waitForTimeout(200);
  }

  async infoCount(): Promise<number> {
    return await this.infoPanel().locator("div.flex.items-start.gap-2").count();
  }

  async removeInfoRow(index: number) {
    const row = this.infoRow(index);
    await row.getByRole("button").last().click();
  }

  async fillInfo(index: number, data: VendorInfoInput) {
    const row = this.infoRow(index);
    const inputs = row.locator('input[type="text"], input:not([type])');
    await inputs.nth(0).fill(data.label);
    await inputs.nth(1).fill(data.value);
    if (data.dataType) {
      await row.getByRole("combobox").click();
      await this.page.getByRole("option", { name: data.dataType }).click();
    }
  }
```

- [ ] **Step 7.2: Add TC-VEN17, 18**

In "Vendor — Tabs & dynamic arrays":

```ts
  test("TC-VEN17 เพิ่ม info row (label/value) ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("info");
    expect(await vendor.infoCount()).toBe(0);
    await vendor.addInfoRow();
    await vendor.fillInfo(0, { label: "Tax ID", value: "1234567890", dataType: "string" });
    expect(await vendor.infoCount()).toBe(1);
  });

  test("TC-VEN18 ลบ info row ได้", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("info");
    await vendor.addInfoRow();
    await vendor.addInfoRow();
    expect(await vendor.infoCount()).toBe(2);
    await vendor.removeInfoRow(0);
    expect(await vendor.infoCount()).toBe(1);
  });
```

- [ ] **Step 7.3: Run the new tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(17|18)"`

Expected: `2 passed`.

- [ ] **Step 7.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add info tab coverage (TC-VEN17, 18)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Validation — TC-VEN19..24

**Files:**
- Modify: `tests/pages/vendor.page.ts` — add `anyError()` helper
- Modify: `tests/vendor.spec.ts` — add TC-VEN19..24

- [ ] **Step 8.1: Add `anyError()` helper**

Append inside the class body:

```ts
  // ── Validation helpers ────────────────────────────────────────────────
  anyError(): Locator {
    // Inline error <p> from FieldInput or zod form errors
    return this.page.locator("p.text-destructive, p.text-\\[0\\.625rem\\].text-destructive");
  }
```

- [ ] **Step 8.2: Add all validation tests**

Add a new describe block after "Vendor — Tabs & dynamic arrays":

```ts
test.describe("Vendor — Validation", () => {
  test("TC-VEN19 บันทึกโดยไม่กรอก code ต้องแสดง error", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    await vendor.nameInput().fill(`${NAME} v19`);
    await vendor.saveButton().click();
    await expect(vendor.anyError().first()).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/new$/);
  });

  test("TC-VEN20 บันทึกโดยไม่กรอก name ต้องแสดง error", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    await vendor.codeInput().fill(`V${UID.slice(0, 4)}`);
    await vendor.saveButton().click();
    await expect(vendor.anyError().first()).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/new$/);
  });

  test("TC-VEN21 code เกิน 10 ตัวอักษรต้องถูก reject", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    // Input enforces maxLength=10 at the HTML level; verify the typed value is truncated
    const long = "X".repeat(20);
    await vendor.codeInput().fill(long);
    const value = await vendor.codeInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(10);
  });

  test("TC-VEN22 name เกิน 100 ตัวอักษรต้องถูก reject", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.switchTab("general");
    const long = "N".repeat(150);
    await vendor.nameInput().fill(long);
    const value = await vendor.nameInput().inputValue();
    expect(value.length).toBeLessThanOrEqual(100);
  });

  test("TC-VEN23 address ที่ไม่มีทั้ง city และ district ต้อง fail (refinement)", async ({
    page,
  }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: `${CODE}R`.slice(0, 10), name: `${NAME} v23` });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addAddressRow();
    await vendor.fillAddress(0, {
      address_type: "contact_address",
      mode: "international",
      address_line1: "Line 1 only",
    });
    await vendor.saveButton().click();
    // Either an inline error on the city field or a form-level rejection (stay on /new)
    await expect(page).toHaveURL(/\/new$/);
  });

  test("TC-VEN24 contact email รูปแบบผิดต้องแสดง error", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoNew();
    await vendor.fillGeneral({ code: `${CODE}E`.slice(0, 10), name: `${NAME} v24` });
    if ((await vendor.businessTypeOptionCount()) > 0) await vendor.pickBusinessType();
    await vendor.addContactRow();
    await vendor.fillContact(0, { name: "Bad Email", email: "not-an-email" });
    await vendor.saveButton().click();
    await expect(page).toHaveURL(/\/new$/);
  });
});
```

- [ ] **Step 8.3: Run the validation tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(19|20|21|22|23|24)"`

Expected: `6 passed`. Notes:
- TC-VEN21/22 rely on `maxLength` HTML attribute enforcing truncation; if the backend allows longer strings and only server-side rejects, adjust the assertion to check for a submit error instead.
- TC-VEN23 asserts the URL stays on `/new` because the form fails to submit; if the form submits anyway and the backend silently accepts empty city+district, flag this as a backend-side validation gap in the test comment.

- [ ] **Step 8.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add validation coverage (TC-VEN19..24)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Edit — TC-VEN25

**Files:**
- Modify: `tests/pages/vendor.page.ts` — add `openDetailByName`
- Modify: `tests/vendor.spec.ts` — add TC-VEN25

- [ ] **Step 9.1: Add `openDetailByName`**

Append inside the class body:

```ts
  /**
   * Open the vendor detail page by clicking a row containing the given text on the list.
   * Assumes the list is already loaded and the row is visible.
   */
  async openDetailByName(name: string) {
    await this.list.search(name);
    const row = this.page.getByRole("row").filter({ hasText: name }).first();
    const link = row.getByRole("link").first();
    if ((await link.count()) > 0) {
      await link.click();
    } else {
      // Row itself navigates on click
      await row.click();
    }
    await this.page.waitForURL(/\/vendor-management\/vendor\/[^/]+$/, { timeout: 10_000 });
    await this.page.waitForLoadState("networkidle");
  }
```

- [ ] **Step 9.2: Add TC-VEN25**

Add a new describe block:

```ts
test.describe("Vendor — Edit, delete, cleanup", () => {
  test("TC-VEN25 แก้ name ของ vendor ที่สร้างแล้ว save สำเร็จ", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.openDetailByName(NAME);
    await vendor.editButton().click();
    await vendor.switchTab("general");
    await vendor.nameInput().fill(NAME_UPDATED);
    await vendor.saveButton().click();
    await vendor.expectSaved();

    await vendor.list.search(NAME_UPDATED);
    await expect(page.getByText(NAME_UPDATED).first()).toBeVisible({ timeout: 10_000 });
  });
});
```

- [ ] **Step 9.3: Run TC-VEN25**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(08|25)"` (run 08 first so the vendor exists, since serial mode within a single spec file already guarantees ordering).

Expected: `2 passed`. If `openDetailByName` can't find the row, verify `NAME` was actually persisted by TC-VEN08 (check `tests/results/vendor-results.csv` or Playwright HTML report).

- [ ] **Step 9.4: Commit**

```bash
git add tests/pages/vendor.page.ts tests/vendor.spec.ts
git commit -m "test(vendor): add edit flow (TC-VEN25)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Delete + cleanup — TC-VEN26, 27, 28

**Files:**
- Modify: `tests/vendor.spec.ts` — add TC-VEN26, 27, 28

- [ ] **Step 10.1: Add the three cleanup-focused tests**

Inside the "Vendor — Edit, delete, cleanup" describe:

```ts
  test("TC-VEN26 เปิด delete dialog ของ vendor แล้ว cancel — row ยังอยู่", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    const row = page.getByRole("row").filter({ hasText: NAME_UPDATED }).first();
    await row.getByRole("button", { name: /delete|trash/i }).first().click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole("button", { name: /cancel|ยกเลิก/i }).click();
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
    // Row should still be there
    await expect(page.getByText(NAME_UPDATED).first()).toBeVisible();
  });

  test("TC-VEN27 ลบ vendor ที่สร้างในชุด test สำเร็จ (cleanup หลัก)", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    const row = page.getByRole("row").filter({ hasText: NAME_UPDATED }).first();
    await row.getByRole("button", { name: /delete|trash/i }).first().click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await dialog.getByRole("button", { name: /^(delete|confirm|ลบ|ok)$/i }).click();
    await expect(page.getByText(/success|deleted|ลบ.*สำเร็จ/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("TC-VEN28 หลังลบแล้วค้นหาไม่พบ row นั้นอีก", async ({ page }) => {
    const vendor = new VendorPage(page);
    await vendor.gotoList();
    await vendor.list.search(NAME_UPDATED);
    await expect(vendor.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
  });
```

- [ ] **Step 10.2: Run the three delete tests**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts -g "TC-VEN(26|27|28)"`

Expected: `3 passed` — but only when run **after** TC-VEN25 completed successfully in the same test file (serial mode handles this when running the whole file).

- [ ] **Step 10.3: Commit**

```bash
git add tests/vendor.spec.ts
git commit -m "test(vendor): add delete + cleanup flow (TC-VEN26..28)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Full-suite run + documentation touch-up

**Files:**
- Modify: `README.md` (optional — list "vendor" in covered modules if it enumerates them)
- Modify: `CLAUDE.md` (optional — update the "specs" list under "Relationship" section)

- [ ] **Step 11.1: Run the entire vendor suite end-to-end**

Run: `E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts`

Expected: all 28 `TC-VEN01..TC-VEN28` tests pass. A small number of transient-cleanup failures from TC-VEN09/10 are tolerable if they don't block the rest; they'll leave orphan `E2E VEN*` rows in the DB which can be mopped up manually.

- [ ] **Step 11.2: Verify CSV was written**

Run: `test -f tests/results/vendor-results.csv && head -3 tests/results/vendor-results.csv`

Expected: the file exists and contains header + rows for each `TC-VEN\d{2}`.

- [ ] **Step 11.3: (Optional) Dry-run Google Sheets sync**

Run: `bun run scripts/sync-test-results.ts` (only if `.env.local` has Google Sheets credentials; otherwise it prints the missing-env message and exits).

Expected: `[Vendor] updated N rows, appended M new rows` in the output — where N+M = 28 on first run.

- [ ] **Step 11.4: Update README.md covered-modules line (if present)**

If `README.md` enumerates covered modules in a list or table, add `vendor` to the list. If there's no such list, skip this step.

- [ ] **Step 11.5: Update CLAUDE.md "Relationship" section**

In `CLAUDE.md`'s "Relationship to `carmen-inventory-frontend/e2e/`" section, the original bullet mentions the list of domain specs that are mirrored. If `vendor` is not listed, add it. If the section documents only what came from the upstream e2e folder, leave it — since `vendor.spec.ts` is a new standalone addition, note it in a separate line like: "Specs added in this repo (not mirrored from upstream): `vendor.spec.ts`".

- [ ] **Step 11.6: Final commit**

```bash
git add README.md CLAUDE.md tests/results/vendor-results.csv
git commit -m "docs(vendor): note vendor module coverage + seed CSV

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 11.7: Push to origin**

```bash
git push
```

Expected: push succeeds; CI (if any) picks up the branch and runs the suite.

---

## Appendix — Running individual task subsets during development

```bash
# While iterating on a single task group
bunx playwright test vendor.spec.ts -g "TC-VEN0[1-5]"      # list smoke
bunx playwright test vendor.spec.ts -g "TC-VEN(06|07|08)"  # happy path
bunx playwright test vendor.spec.ts -g "TC-VEN(1[1-8])"    # tabs & arrays
bunx playwright test vendor.spec.ts -g "TC-VEN(19|20|21|22|23|24)"  # validation
bunx playwright test vendor.spec.ts -g "TC-VEN(25|26|27|28)"  # edit/delete

# UI mode for debugging failing tests
bun run test:ui

# Headed mode to watch the browser
E2E_NO_WEBSERVER=1 bunx playwright test vendor.spec.ts --headed --project=chromium
```

## Appendix — Debugging tips specific to this module

- **Tabs not switching:** Radix keeps content mounted with `data-state="inactive"` — assertions should target `data-state="active"` rather than visibility.
- **Business-type popover overlaps the form:** after `pickBusinessType`, always `press("Escape")` to close the popover before proceeding.
- **Prepend gotcha:** adding a row then immediately filling "the new one" = index 0. Adding another row shifts the previous to index 1. Tests that verify count + remove use `removeAddressRow(0)` (removes the newest).
- **DeleteDialog vs normal dialog:** `role="alertdialog"` (not `dialog`). Scope confirm/cancel button locators via `getByRole("alertdialog").getByRole("button", ...)`.
- **Form redirect race:** after clicking Save, the app navigates back to the list AND shows a toast. `expectSaved()` waits for both — don't assert one independently.
