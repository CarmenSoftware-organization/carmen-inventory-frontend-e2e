# Department — Additional Test Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add coverage for the department module's untested behaviour: edit-persistence (regression guard for the `doc_version` fix), duplicate-code rejection, `is_active` toggle, description field, discard/delete-cancel dialogs, code maxLength, individual required-field validation, search-by-code, and member/HOD assignment.

**Architecture:** New tests live in `tests/010-department.spec.ts`, reusing `PageFormCrudHelper` (extended with a description input + active-switch helpers) and a small new `DepartmentMembersHelper` page object for the Transfer (members/HOD) widget. Independent tests are **self-contained** (create their own record with a per-test unique code/name, assert, then delete) so they don't depend on the serial CRUD chain. Data-dependent tests (member/HOD assignment) are **skip-guarded**. The `beforeEach(ensureActiveBu(BLAVG))` already in the describe applies to all.

**Tech Stack:** Playwright (`@playwright/test`), TypeScript. Frontend under test: `../carmen-inventory-frontend-react`.

**Design context (verified against the frontend):**
- Form: `routes/config/department/_components/department-form.tsx`. Fields: `#department-code` (maxLength 10), `#department-name` (maxLength 100), `#department-description` (Textarea, maxLength 256), `#department-is-active` (Radix Switch: `role="switch"`, `aria-checked`). Toolbar modes: view (Edit button) / edit (Save+Cancel+Delete). Create success → navigate to detail + toast `created successfully`/`สร้าง...สำเร็จ`. Update success → toast `updated successfully`/`อัปเดต...สำเร็จ` and back to view mode. Update PATCH now sends `doc_version` (fixed).
- Edit while dirty → Cancel/Back opens **DiscardDialog** (alertdialog, confirm button text **"Discard"** / `ละทิ้ง`). Delete opens **DeleteDialog** (alertdialog, **Cancel** + **Delete** actions).
- Members section heading: **"Department Members"**; HOD heading: **"Head of Department"**. Each renders a Transfer with a left "available" list (Checkbox + user full name) and a move button `aria-label="Move selected to right"`. The test env renders English labels.
- `PageFormCrudHelper` (`tests/pages/page-form-crud.helper.ts`) is shared by department/location/adjustment-type; extend it generically (opts-driven), do not hardcode department specifics there.
- Module-level `const UID` in the spec is ONE value per run; each new self-contained test MUST build its own unique code/name (embed the TC number) to avoid colliding with the serial chain and each other. Code must stay ≤10 chars.

**Deferred (NOT in this plan — surfaced to the user):** list **pagination** test. `ConfigListPage` exposes no pagination affordance and a reliable test needs >10 seeded departments; low value, high flake. Revisit only if pagination locators + guaranteed data are added.

---

## File Structure

- **Modify** `tests/pages/page-form-crud.helper.ts` — add optional `descriptionInputId` to `PageFormCrudOptions`; add `descriptionInput()`, `isActive()`, `setActive(on)`.
- **Create** `tests/pages/department-form.helper.ts` — `DepartmentMembersHelper`: scope a Transfer by section heading, count available users, assign the first available.
- **Modify** `tests/010-department.spec.ts` — add `descriptionInputId` to `opts`; add the new tests; the import of the members helper.
- **Regenerate** `docs/user-stories/010-department.md`.

---

## Task 1: Extend page objects

**Files:**
- Modify: `tests/pages/page-form-crud.helper.ts`
- Create: `tests/pages/department-form.helper.ts`

- [ ] **Step 1: Add description + active-switch helpers to `PageFormCrudHelper`**

In `tests/pages/page-form-crud.helper.ts`, add `descriptionInputId?: string;` to the `PageFormCrudOptions` interface (after `activeSwitchId`). Then add these methods to the class (after `activeSwitch()`):

```ts
  descriptionInput(): Locator {
    if (!this.opts.descriptionInputId) {
      throw new Error("descriptionInputId not configured for this module");
    }
    return this.page.locator(`#${this.opts.descriptionInputId}`);
  }

  /** Read the Radix status switch state (role="switch" → aria-checked). */
  async isActive(): Promise<boolean> {
    const sw = this.activeSwitch();
    if (!sw) throw new Error("activeSwitchId not configured for this module");
    return (await sw.getAttribute("aria-checked")) === "true";
  }

  /** Set the status switch to `on`, clicking only if it differs from current. */
  async setActive(on: boolean): Promise<void> {
    const sw = this.activeSwitch();
    if (!sw) throw new Error("activeSwitchId not configured for this module");
    if ((await this.isActive()) !== on) {
      await sw.click();
    }
  }
```

- [ ] **Step 2: Create the members/HOD Transfer helper**

Create `tests/pages/department-form.helper.ts`:

```ts
import type { Page, Locator } from "@playwright/test";

/**
 * Scopes interactions to one of the department form's two Transfer widgets,
 * identified by its section heading ("Department Members" or "Head of
 * Department"). The form renders both with an identical move button
 * (aria-label "Move selected to right"), so every locator is scoped to the
 * section container to avoid cross-matching.
 */
export class DepartmentMembersHelper {
  constructor(private readonly page: Page) {}

  /** The section container (the bordered card) that holds the given heading. */
  private section(heading: string): Locator {
    return this.page
      .locator("div")
      .filter({ has: this.page.getByText(heading, { exact: true }) })
      .filter({ has: this.page.getByRole("button", { name: "Move selected to right" }) })
      .last();
  }

  /** Number of selectable users in the section's left ("available") list. */
  async availableCount(heading: string): Promise<number> {
    return this.section(heading).getByRole("checkbox").count();
  }

  /**
   * Tick the first available user and move it to the right (assigned) list.
   * Returns the moved user's visible label, or null if none were available.
   */
  async assignFirstAvailable(heading: string): Promise<string | null> {
    const section = this.section(heading);
    const firstCheckbox = section.getByRole("checkbox").first();
    if ((await firstCheckbox.count()) === 0) return null;
    const row = section.locator("li, [role='listitem']").filter({ has: firstCheckbox }).first();
    const label = (await row.innerText().catch(() => "")).trim();
    await firstCheckbox.check();
    await section.getByRole("button", { name: "Move selected to right" }).click();
    return label || "(moved)";
  }
}
```

- [ ] **Step 3: Type-check**

Run: `bunx tsc --noEmit`
Expected: clean (exit 0).

- [ ] **Step 4: Commit**

```bash
git add tests/pages/page-form-crud.helper.ts tests/pages/department-form.helper.ts
git commit -m "test(e2e): extend page objects for department description/active/members"
```

---

## Task 2: Regression guard + search-by-code

**Files:**
- Modify: `tests/010-department.spec.ts`

- [ ] **Step 1: Add `descriptionInputId` to `opts`**

In `tests/010-department.spec.ts`, update the `opts` object to include the description field:

```ts
const opts = {
  listPath: PATH,
  codeInputId: "department-code",
  nameInputId: "department-name",
  activeSwitchId: "department-is-active",
  descriptionInputId: "department-description",
};
```

- [ ] **Step 2: Add the two tests**

Insert these two tests immediately AFTER the `addPageFormSecurityCases(...)` call's closing — i.e. just before the final `});` that closes `test.describe("Department — Smoke & CRUD", ...)`. (They are self-contained, not part of the serial chain.)

```ts
  test(
    "TC-DEP-010010 แก้ไขแล้ว persist หลัง reload",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department (code+name)\n2. เปิด detail กด Edit เปลี่ยน name เป็นค่าใหม่ แล้ว Save\n3. reload หน้า detail\n4. กลับ list ค้นหา name ใหม่และ name เดิม" },
        { type: "expected", description: "หลัง reload ฟอร์มแสดง name ใหม่ (ค่าถูก persist จริง ไม่ใช่แค่ toast); list มีแถว name ใหม่ และไม่พบ name เดิม" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D10${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010010 ${UID}`;
      const renamed = `DEP010010 Upd ${UID}`;

      // create
      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // edit name from the detail page we just landed on
      await h.editButton().click();
      await h.nameInput().clear();
      await h.nameInput().fill(renamed);
      await h.saveButton().click();
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // reload: the persisted value must survive a fresh fetch
      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(page.locator(`#${opts.nameInputId}`)).toHaveValue(renamed);

      // list reflects the rename
      await h.list.goto();
      await h.list.search(renamed);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible();
      await h.list.search(name);
      await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });

      // cleanup
      await h.list.search(renamed);
      await h.clickRowName(renamed);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010012 ค้นหาด้วย code เจอรายการ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department ด้วย code+name ที่รู้ค่า\n2. กลับ list แล้วค้นหาด้วย code\n3. ลบ record" },
        { type: "expected", description: "list แสดงแถวที่มี name ของ record เมื่อค้นด้วย code" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D12${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010012 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(code);
      await expect(page.getByRole("cell", { name })).toBeVisible();

      // cleanup
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 3: Run both new tests**

Run: `bun run test -- -g "TC-DEP-010010|TC-DEP-010012"`
Expected: both PASS. (TC-DEP-010010 is the regression guard for the `doc_version` fix — it must show the rename surviving a reload.)

- [ ] **Step 4: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "test(department): edit-persist regression guard + search-by-code"
```

---

## Task 3: Duplicate code, is_active toggle, code maxLength, required fields

**Files:**
- Modify: `tests/010-department.spec.ts`

- [ ] **Step 1: Add the four tests**

Insert after the TC-DEP-010012 test, still inside the describe:

```ts
  test(
    "TC-DEP-010011 สร้าง code ซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department ด้วย code X\n2. สร้างอีกรายการด้วย code X เดิม (name ต่าง)\n3. กด Save" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: ยังอยู่ที่ฟอร์ม /new (ไม่ navigate ไป detail) — backend reject code ซ้ำ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D11${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010011 ${UID}`;

      // first record
      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // duplicate code attempt
      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(`${name} dup`);
      await h.saveButton().click();
      // Must NOT succeed: no created toast, still on the new form.
      await expect(page).toHaveURL(/\/new/, { timeout: 10_000 });
      await expect(h.saveButton()).toBeVisible();

      // cleanup the first record
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010014 toggle is_active แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด new form\n2. ปิด switch is_active\n3. กรอก code+name แล้ว Save\n4. reload detail แล้วอ่านสถานะ switch" },
        { type: "expected", description: "หลัง save+reload switch is_active = false (ค่าถูก persist)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D14${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010014 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.setActive(false);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(h.activeSwitch()!).toHaveAttribute("aria-checked", "false");

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010018 code เกิน maxLength ต้องถูกจำกัดที่ 10",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department/new" },
        { type: "steps", description: "1. เปิด new form\n2. พิมพ์ code ยาว 15 ตัวอักษร" },
        { type: "expected", description: "ค่าใน input ถูกตัดที่ 10 ตัวอักษร (maxLength=10)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      await h.gotoNew();
      await h.codeInput().fill("ABCDEFGHIJ12345"); // 15 chars
      await expect(h.codeInput()).toHaveValue("ABCDEFGHIJ"); // capped at 10
    },
  );

  test(
    "TC-DEP-010021 บันทึกโดยกรอก field เดียว ต้องถูก block",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; อยู่ที่ /config/department/new" },
        { type: "steps", description: "1. เปิด new form กรอกเฉพาะ name (code ว่าง) กด Save\n2. เปิด new form ใหม่ กรอกเฉพาะ code (name ว่าง) กด Save" },
        { type: "expected", description: "ทั้งสองกรณีฟอร์ม block submit: ยังอยู่ที่ /new" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);

      // name only → blocked
      await h.gotoNew();
      await h.nameInput().fill(`DEP010021 ${UID}`);
      await h.saveButton().click();
      await expect(page).toHaveURL(/\/new/);

      // code only → blocked
      await h.gotoNew();
      await h.codeInput().fill(`D21${UID.slice(-4).toUpperCase()}`);
      await h.saveButton().click();
      await expect(page).toHaveURL(/\/new/);
    },
  );
```

- [ ] **Step 2: Run the four tests**

Run: `bun run test -- -g "TC-DEP-010011|TC-DEP-010014|TC-DEP-010018|TC-DEP-010021"`
Expected: all PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "test(department): duplicate-code, is_active toggle, code maxLength, required-field cases"
```

---

## Task 4: Description CRUD, discard dialog, delete-cancel

**Files:**
- Modify: `tests/010-department.spec.ts`

- [ ] **Step 1: Add the three tests** (insert after TC-DEP-010021)

```ts
  test(
    "TC-DEP-010015 description สร้าง/แก้ไข + maxLength 256",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง department พร้อม description\n2. reload เช็คค่า description\n3. ตรวจ maxLength: พิมพ์ description ยาว 300 ตัว\n4. ลบ record" },
        { type: "expected", description: "description ถูก persist หลัง reload; ช่อง description ถูกจำกัดที่ 256 ตัวอักษร" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D15${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010015 ${UID}`;
      const desc = `desc ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.descriptionInput().fill(desc);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(h.descriptionInput()).toHaveValue(desc);

      // maxLength 256: enter edit, type 300 chars, expect cap
      await h.editButton().click();
      await h.descriptionInput().fill("x".repeat(300));
      await expect(h.descriptionInput()).toHaveValue("x".repeat(256));

      // cleanup (discard the edit, then delete)
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010016 Cancel ขณะ form dirty ต้องเด้ง Discard dialog",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG; มี record อยู่" },
        { type: "steps", description: "1. สร้าง record\n2. เปิด detail กด Edit เปลี่ยน name (form dirty)\n3. กด Cancel\n4. ยืนยัน Discard\n5. reload เช็ค name เดิม" },
        { type: "expected", description: "Discard dialog ปรากฏ; หลังยืนยันกลับ view mode และ name ยังเป็นค่าเดิม (ไม่ถูกบันทึก)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D16${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010016 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // edit → dirty → cancel
      await h.editButton().click();
      await h.nameInput().clear();
      await h.nameInput().fill(`${name} DIRTY`);
      await h.cancelButton().click();

      // Discard dialog appears; confirm it
      const discardConfirm = page.getByRole("alertdialog").getByRole("button", { name: /^(Discard|ละทิ้ง|ทิ้ง)$/i });
      await expect(discardConfirm).toBeVisible({ timeout: 5_000 });
      await discardConfirm.click();

      // back to view; reload confirms name unchanged
      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(page.locator(`#${opts.nameInputId}`)).toHaveValue(name);

      // cleanup
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010017 ยกเลิกการลบ record ต้องยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG; มี record อยู่" },
        { type: "steps", description: "1. สร้าง record\n2. เปิด detail กด Edit แล้วกด Delete\n3. ใน dialog กด Cancel\n4. กลับ list ค้นหา record" },
        { type: "expected", description: "Delete dialog ปิดโดยไม่ลบ; record ยังปรากฏใน list" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const code = `D17${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010017 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // open delete dialog, then cancel it
      await h.editButton().click();
      await h.deleteButton().click();
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(Cancel|ยกเลิก)$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 5_000 });

      // record survives
      await h.list.goto();
      await h.list.search(name);
      await expect(page.getByRole("cell", { name })).toBeVisible();

      // cleanup (actually delete now)
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Run the three tests**

Run: `bun run test -- -g "TC-DEP-010015|TC-DEP-010016|TC-DEP-010017"`
Expected: all PASS. If the Discard-dialog confirm button name differs from `/^(Discard|ละทิ้ง|ทิ้ง)$/i`, inspect the rendered alertdialog and widen the regex (report the actual label).

- [ ] **Step 3: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "test(department): description CRUD/maxLength, discard dialog, delete-cancel"
```

---

## Task 5: Member & HOD assignment (skip-guarded)

**Files:**
- Modify: `tests/010-department.spec.ts`

- [ ] **Step 1: Import the members helper**

Add to the imports at the top of `tests/010-department.spec.ts`:

```ts
import { DepartmentMembersHelper } from "./pages/department-form.helper";
```

- [ ] **Step 2: Add the two tests** (insert after TC-DEP-010017)

```ts
  test(
    "TC-DEP-010019 assign user เข้า department members",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG; ต้องมี user ที่ assign ได้ ไม่งั้น skip" },
        { type: "steps", description: "1. สร้าง record แล้วเข้า Edit\n2. ใน section 'Department Members' เลือก user ตัวแรกแล้วย้ายไปขวา\n3. Save\n4. reload เปิด detail เช็คจำนวน members" },
        { type: "expected", description: "members ที่ถูกย้ายถูกบันทึก (count ≥ 1 หลัง reload) — หรือ skip ถ้าไม่มี user ว่างให้ assign" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const members = new DepartmentMembersHelper(page);
      const code = `D19${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010019 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.editButton().click();
      const available = await members.availableCount("Department Members");
      if (available === 0) {
        // No assignable users seeded — clean up and skip.
        await h.deleteButton().click();
        await h.deleteConfirmButton().click();
        await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
        test.skip(true, "No assignable users in BLAVG — skipping member-assignment test.");
        return;
      }

      const moved = await members.assignFirstAvailable("Department Members");
      expect(moved).not.toBeNull();
      await h.saveButton().click();
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await page.waitForLoadState("networkidle");
      // The members section heading shows a count badge ≥ 1 after assignment.
      await expect(
        page.getByText("Department Members", { exact: true }).locator("xpath=following-sibling::*[1]"),
      ).toHaveText(/[1-9]/, { timeout: 10_000 });

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-DEP-010020 assign user เป็น Head of Department",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG; ต้องมี user ที่ assign ได้ ไม่งั้น skip" },
        { type: "steps", description: "1. สร้าง record แล้วเข้า Edit\n2. ใน section 'Head of Department' เลือก user ตัวแรกแล้วย้ายไปขวา\n3. Save\n4. reload เปิด detail เช็คจำนวน HOD" },
        { type: "expected", description: "HOD ที่ถูกย้ายถูกบันทึก (count ≥ 1 หลัง reload) — หรือ skip ถ้าไม่มี user ให้ assign" },
        { type: "priority", description: "Low" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new PageFormCrudHelper(page, opts);
      const members = new DepartmentMembersHelper(page);
      const code = `D20${UID.slice(-4).toUpperCase()}`;
      const name = `DEP010020 ${UID}`;

      await h.gotoNew();
      await h.codeInput().fill(code);
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.editButton().click();
      const available = await members.availableCount("Head of Department");
      if (available === 0) {
        await h.deleteButton().click();
        await h.deleteConfirmButton().click();
        await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
        test.skip(true, "No assignable users in BLAVG — skipping HOD-assignment test.");
        return;
      }

      const moved = await members.assignFirstAvailable("Head of Department");
      expect(moved).not.toBeNull();
      await h.saveButton().click();
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(
        page.getByText("Head of Department", { exact: true }).locator("xpath=following-sibling::*[1]"),
      ).toHaveText(/[1-9]/, { timeout: 10_000 });

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.clickRowName(name);
      await h.editButton().click();
      await h.deleteButton().click();
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 3: Run the two tests**

Run: `bun run test -- -g "TC-DEP-010019|TC-DEP-010020"`
Expected: PASS or SKIP (skip is acceptable if BLAVG has no assignable users). If they FAIL on the Transfer locator (e.g. section scoping matches the wrong card or the count-badge assertion), inspect the rendered DOM in edit mode and report — the section-scoping (`DepartmentMembersHelper.section`) or the count-badge XPath may need adjustment. Do NOT loosen the assertion to make a broken locator pass.

- [ ] **Step 4: Commit**

```bash
git add tests/010-department.spec.ts
git commit -m "test(department): member & HOD assignment (skip-guarded)"
```

---

## Task 6: Docs + audits + full regression

**Files:**
- Regenerate: `docs/user-stories/010-department.md`

- [ ] **Step 1: Annotation completeness**

Run:
```bash
f=tests/010-department.spec.ts; pre=$(grep -c 'type: "preconditions"' "$f"); exp=$(grep -c 'type: "expected"' "$f"); echo "pre=$pre exp=$exp"; [ "$pre" = "$exp" ] && echo OK || echo MISMATCH
```
Expected: `OK`.

- [ ] **Step 2: TC-ID audit**

Run: `bun audit:tc-ids`
Expected: `0 errors`. (All new IDs are `TC-DEP-0100xx`, section 01 — within the DEP `01–05, 10` catalog.)

- [ ] **Step 3: Regenerate user-story docs**

Run: `bun docs:user-stories`
Then confirm the new IDs are present:
```bash
grep -oE "TC-DEP-0100(10|11|12|14|15|16|17|18|19|20|21)" docs/user-stories/010-department.md | sort -u
```
Expected: all 11 IDs listed.

- [ ] **Step 4: Full department spec run**

Run: `bun run test -- 010-department.spec.ts`
Expected: all PASS (010019/010020 may SKIP). No failures.

- [ ] **Step 5: Commit**

```bash
git add tests/010-department.spec.ts docs/user-stories/010-department.md
git commit -m "docs(user-stories): regenerate for new department test cases"
```

---

## Self-Review notes

- **Spec coverage vs the approved tiers:** Tier 1 → 010010 (regression guard), 010011, 010014 (Tasks 2–3). Tier 2 → 010015, 010016, 010017, 010018 (Tasks 3–4). Tier 3 → 010019, 010020 (Task 5). Tier 4 → 010012 (search-by-code), 010021 (individual required) (Tasks 2–3). Pagination is explicitly **deferred** (documented above) — surface this to the user at execution handoff.
- **Unique data:** every self-contained test derives its own `code`/`name` from the TC number + module `UID`; codes are ≤10 chars (`D10....`, `D11....`, etc.) so they never collide with the serial chain (`E2E....`) or each other.
- **Cleanup:** each create-heavy test deletes its record at the end. Leftovers only persist if a test fails mid-way (acceptable for E2E-prefixed data).
- **Type/method consistency:** `descriptionInput()`, `isActive()`, `setActive()` (Task 1) are used exactly as named in Tasks 3–4; `DepartmentMembersHelper.availableCount`/`assignFirstAvailable` (Task 1) are used as named in Task 5; `opts.descriptionInputId` is added in Task 2 Step 1 before first use.
- **Known risk:** the Transfer tests (Task 5) are the highest-flake — section scoping + count-badge assertion are the fragile points and are flagged for live verification; they skip cleanly when no users are assignable.
