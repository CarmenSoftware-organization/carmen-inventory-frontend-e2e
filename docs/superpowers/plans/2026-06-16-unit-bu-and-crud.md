# Unit spec — BLAVG precondition + dialog CRUD coverage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin active BU = `BLAVG` for the Unit config spec and add the missing dialog CRUD + validation + edge coverage (plus a dialog-level security upgrade), mirroring `029-business-type.spec.ts`.

**Architecture:** All test changes live in `tests/020-unit.spec.ts`, reusing the existing `DialogCrudHelper` (extended generically with a description input + active-switch helpers) and `ensureActiveBu`. New tests are **self-contained** (each makes its own uniquely-named unit and deletes it) and assert persistence via the list (backend truth), not just the toast. `beforeEach(ensureActiveBu(BLAVG))` applies to all.

**Tech Stack:** Playwright (`@playwright/test`), TypeScript. Frontend under test: `../carmen-inventory-frontend-react`.

**Design doc:** `docs/superpowers/specs/2026-06-16-unit-bu-and-crud-design.md`

**Verified facts:**
- Unit dialog (`components/share/unit-dialog.tsx`): `name` (`#unit-name`, required), `description` (`#unit-description`, optional), `is_active` (`#unit-is-active`). No code field. CRUD via `createConfigCrud` (`UNITS`, BU-scoped), `updateMethod` defaults to PUT.
- `DialogCrudHelper` (`tests/pages/dialog-crud.helper.ts`): `openAddDialog()`, `clickRow(name)` (opens edit dialog), `deleteRow(name)` (opens row-actions → Delete; then call `deleteConfirmButton().click()`), `dialog()`, `nameInput()`, `activeSwitch()`, `saveButton()`, `cancelButton()`, `errorMessage()`, `deleteConfirm()/deleteConfirmButton()`, `.list` (`goto()/search()/addButton()/emptyState()`). Opts: `listPath`, `nameInputId`, `activeSwitchId`.
- `ensureActiveBu`/`getBusinessUnits`/`defaultBu` (`tests/helpers/bu.ts`), `BuSwitcherPage` (`tests/pages/bu-switcher.page.ts`), `BU_CODE="BLAVG"` (`tests/test-users.ts`) — all on `main`.
- `addDialogSecurityCases(test, { prefix, listPath, makeHelper, skipAuth })` emits `TC-UN-100001/100002/100003` (active) + `TC-UN-100004` (skipped when `skipAuth: true`).
- TC-ID scheme: prefix `UN`, sections `01–05, 10`; functional IDs `010005–010013` free.

---

## File Structure
- **Modify** `tests/pages/dialog-crud.helper.ts` — add `descriptionInputId?` + `descriptionInput()`, `isActive()`, `setActive(on)` (generic).
- **Modify** `tests/020-unit.spec.ts` — imports, `UID`, `opts`, `beforeEach`, new tests `TC-UN-010005..010013`, swap security helper.
- **Regenerate** `docs/user-stories/020-unit.md`.

---

## Task 1: Extend DialogCrudHelper

**Files:** Modify `tests/pages/dialog-crud.helper.ts`

- [ ] **Step 1: Add the option + three methods**

In `DialogCrudOptions`, add after `activeSwitchId`:
```ts
  descriptionInputId?: string; // e.g. "unit-description"
```

Add these methods to the `DialogCrudHelper` class (after `activeSwitch()`):
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
(`Locator` is already imported in this file — confirm; add to the `@playwright/test` type import if missing.)

- [ ] **Step 2: Verify** — `bunx tsc --noEmit` → clean (exit 0); `bun run test:unit` → still green.

- [ ] **Step 3: Commit**
```bash
git add tests/pages/dialog-crud.helper.ts
git commit -m "test(e2e): extend DialogCrudHelper with description + active-switch helpers"
```

---

## Task 2: Wire BU precondition + assert TC + security upgrade

**Files:** Modify `tests/020-unit.spec.ts`

- [ ] **Step 1: Replace the imports + header** (top of file, through the `opts` block)

Replace the existing import lines and the `const test`/`PATH` block with:
```ts
import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ConfigListPage } from "./pages/config-list.page";
import { DialogCrudHelper } from "./pages/dialog-crud.helper";
import { addDialogSecurityCases } from "./helpers/security-cases";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

const test = createAuthTest("admin@blueledgers.com");
const PATH = "/config/unit";
const UID = Date.now().toString(36);

const opts = {
  listPath: PATH,
  nameInputId: "unit-name",
  activeSwitchId: "unit-is-active",
  descriptionInputId: "unit-description",
};
```
(`ConfigListPage` stays imported — the existing smoke tests still use it.)

- [ ] **Step 2: Add the beforeEach** immediately after `test.describe("Unit — Smoke", () => {`:
```ts
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });
```

- [ ] **Step 3: Add the assert TC** after `TC-UN-010004` (keep smoke grouped):
```ts
  test(
    "TC-UN-010005 active BU = BLAVG",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว" },
        { type: "steps", description: "1. อ่าน profile API (/api/proxy/api/user/profile)\n2. หา business unit ที่ is_default\n3. เปิดหน้าที่มี navbar แล้วอ่าน label ของ BU switcher" },
        { type: "expected", description: "default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page }) => {
      const units = await getBusinessUnits(page);
      const active = defaultBu(units);
      expect(active?.code).toBe(BU_CODE);

      const switcher = new BuSwitcherPage(page);
      await expect(switcher.trigger()).toContainText(active!.name, { timeout: 15_000 });
    },
  );
```

- [ ] **Step 4: Swap the security helper** — replace the existing `addListOnlySecurityCases(test, { prefix: "UN", listPath: PATH, skipTcs: ["TC-UN-100004"] });` line with:
```ts
  addDialogSecurityCases(test, {
    prefix: "UN",
    listPath: PATH,
    makeHelper: (page) => new DialogCrudHelper(page, opts),
    skipAuth: true, // TC-UN-100004 (authz) skipped
  });
```

- [ ] **Step 5: Run** — `bun run test -- -g "TC-UN-010005"` → PASS (asserts active BU is BLAVG). The smoke tests + dialog security cases will also be present; if the remote backend flakes on a cold "Auth server unavailable", retry once.

- [ ] **Step 6: Commit**
```bash
git add tests/020-unit.spec.ts
git commit -m "test(unit): lock active BU to BLAVG (precondition + assert TC-UN-010005) + dialog security"
```

---

## Task 3: Tier 1 CRUD (create, edit+persist, delete, create-validation)

**Files:** Modify `tests/020-unit.spec.ts`

- [ ] **Step 1: Add the four tests** after `TC-UN-010005`:
```ts
  test(
    "TC-UN-010006 สร้าง unit ใหม่และปรากฏในตาราง",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กรอก name\n3. กด Save\n4. ค้นหา name ใน list\n5. ลบ record" },
        { type: "expected", description: "Success toast (created/success/สำเร็จ); แถวที่มี name ปรากฏใน list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN006 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
      await h.list.search(name);
      await expect(page.getByRole("cell", { name })).toBeVisible();
      // cleanup
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010007 แก้ไขชื่อแล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง unit\n2. ค้นหาและเปิดแถวเพื่อแก้ไข\n3. แก้ name เป็นค่าใหม่ กด Save\n4. ค้นหา name ใหม่/เดิมใน list\n5. ลบ record" },
        { type: "expected", description: "Updated toast; list มีแถว name ใหม่ และไม่พบ name เดิม (ค่าถูก persist จริง)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN007 ${UID}`;
      const renamed = `E2E UN007 Upd ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
      await h.nameInput().fill(renamed);
      await h.saveButton().click();
      await expect(page.getByText(/updated|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      // persistence via the list (backend truth), not just the toast
      await h.list.goto();
      await h.list.search(renamed);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible({ timeout: 10_000 });

      // cleanup
      await h.deleteRow(renamed);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010008 ลบ unit",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง unit\n2. ค้นหาใน list\n3. เปิด Row actions → Delete → ยืนยัน\n4. ค้นหาอีกครั้ง" },
        { type: "expected", description: "Deleted toast; ไม่พบแถว name ใน list (empty state)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN008 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(name);
      await expect(h.list.emptyState().first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010009 บันทึกโดยไม่กรอกชื่อต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด Add dialog\n2. กด Save โดยไม่กรอก name" },
        { type: "expected", description: "Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      await h.list.goto();
      await h.openAddDialog();
      await h.saveButton().click();
      await expect(h.errorMessage().first()).toBeVisible();
      await h.cancelButton().click();
    },
  );
```

- [ ] **Step 2: Run** — `bun run test -- -g "TC-UN-010006|TC-UN-010007|TC-UN-010008|TC-UN-010009"` → all PASS. **Note:** `TC-UN-010007` is the persistence guard — the renamed value MUST appear in the list after edit. If it does not (unit uses PUT — a possible backend persistence gap like department's `doc_version`), STOP and report DONE_WITH_CONCERNS with details; do NOT loosen the assertion. Retry once on a transient cold-auth flake.

- [ ] **Step 3: Commit**
```bash
git add tests/020-unit.spec.ts
git commit -m "test(unit): dialog CRUD — create, edit+persist, delete, create-validation"
```

---

## Task 4: Tier 2 (duplicate name, description, is_active, edit-clear-name)

**Files:** Modify `tests/020-unit.spec.ts`

- [ ] **Step 1: Add the four tests** after `TC-UN-010009`:
```ts
  test(
    "TC-UN-010010 สร้าง name ซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง unit ด้วย name X\n2. เปิด Add dialog กรอก name X เดิม กด Save" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: dialog ยังเปิดอยู่ (backend reject name ซ้ำ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN010 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      // Must NOT succeed — dialog stays open (no navigation away / record not created).
      await expect(h.dialog()).toBeVisible({ timeout: 10_000 });
      await h.cancelButton().click();

      // cleanup the first record
      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010011 description สร้าง/แก้ไข + maxLength",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง unit พร้อม description\n2. เปิดแถวอีกครั้งเช็คค่า description\n3. ทดสอบ maxLength โดยพิมพ์ยาวเกิน\n4. ลบ record" },
        { type: "expected", description: "description ถูก persist (เห็นค่าเดิมเมื่อเปิด dialog ใหม่); ช่อง description ถูกจำกัดความยาวตาม maxLength" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN011 ${UID}`;
      const desc = `desc ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.descriptionInput().fill(desc);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.descriptionInput()).toHaveValue(desc, { timeout: 5_000 });

      // maxLength: typing a very long value is capped by the input's maxLength
      const longText = "x".repeat(600);
      await h.descriptionInput().fill(longText);
      const capped = await h.descriptionInput().inputValue();
      expect(capped.length).toBeLessThan(longText.length);
      await h.cancelButton().click();

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010012 toggle is_active แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิด Add dialog กรอก name ปิด switch is_active กด Save\n2. เปิดแถวอีกครั้งอ่านสถานะ switch\n3. ลบ record" },
        { type: "expected", description: "หลังเปิดแถวใหม่ switch is_active = false (ค่าถูก persist)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN012 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.setActive(false);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.activeSwitch()!).toHaveAttribute("aria-checked", "false", { timeout: 5_000 });
      await h.cancelButton().click();

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-UN-010013 แก้ไข: clear name แล้วบันทึก ต้องแสดง error",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง unit\n2. เปิดแถวเพื่อแก้ไข\n3. clear name กด Save\n4. ลบ record" },
        { type: "expected", description: "Error message ปรากฏใน dialog (validation block submit; dialog ไม่ปิด)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Validation" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E UN013 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
      await h.nameInput().clear();
      await h.saveButton().click();
      await expect(h.errorMessage().first()).toBeVisible();
      await h.cancelButton().click();

      // cleanup
      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Run** — `bun run test -- -g "TC-UN-010010|TC-UN-010011|TC-UN-010012|TC-UN-010013"` → all PASS. **Note:** if `TC-UN-010010` fails because the second create SUCCEEDS (backend accepts duplicate names — same shape as the department duplicate-code finding), STOP and report DONE_WITH_CONCERNS; the controller will convert it to `test.fixme` with a documented note (do NOT loosen it; delete BOTH records if created). Retry once on a transient cold-auth flake.

- [ ] **Step 3: Commit**
```bash
git add tests/020-unit.spec.ts
git commit -m "test(unit): duplicate-name, description+maxLength, is_active, edit-clear-name"
```

---

## Task 5: Docs + audits + full regression

**Files:** Regenerate `docs/user-stories/020-unit.md`

- [ ] **Step 1: Annotation completeness**
```bash
f=tests/020-unit.spec.ts; pre=$(grep -c 'type: "preconditions"' "$f"); exp=$(grep -c 'type: "expected"' "$f"); echo "pre=$pre exp=$exp"; [ "$pre" = "$exp" ] && echo OK || echo MISMATCH
```
Expected: `OK`.

- [ ] **Step 2: TC-ID audit** — `bun audit:tc-ids` → `0 errors`. (New IDs `TC-UN-010005..010013` in section 01; security `TC-UN-100001..100004` in section 10 — all within the `UN` `01–05, 10` catalog.)

- [ ] **Step 3: Regenerate user-story docs** — `bun docs:user-stories`, then confirm:
```bash
grep -oE "TC-UN-0100(05|06|07|08|09|10|11|12|13)" docs/user-stories/020-unit.md | sort -u | tr '\n' ' '; echo
```
Expected: all 9 IDs listed.

- [ ] **Step 4: Full spec run** — `bun run test -- 020-unit.spec.ts` → all PASS (any data-dependent case that the controller converted to `fixme` shows as skipped). No failures.

- [ ] **Step 5: Commit**
```bash
git add tests/020-unit.spec.ts docs/user-stories/020-unit.md
git commit -m "docs(user-stories): regenerate for new unit test cases"
```

---

## Self-Review notes
- **Spec coverage:** BU precondition + `TC-UN-010005` (Task 2); Tier 1 CRUD `010006-009` (Task 3); Tier 2 `010010-013` (Task 4); security upgrade to `addDialogSecurityCases` (Task 2 Step 4); `DialogCrudHelper` description/active extension (Task 1); docs/audits (Task 5). All design sections mapped.
- **Self-containment & data uniqueness:** every create-heavy test builds its own `E2E UN0NN <UID>` name (unique per test + run) and deletes its record; no shared chain.
- **Real assertions:** `010007` asserts the renamed value in the list (backend truth), not just the toast — the persistence guard. `010012` reads `aria-checked` after reopening. `010010`/`010013` assert dialog stays open / error shown.
- **Type/method consistency:** `descriptionInput()`/`isActive()`/`setActive()` (Task 1) used as named in Task 4; `opts.descriptionInputId` added in Task 2 Step 1 before first use in Task 4; `DialogCrudHelper` methods (`openAddDialog`/`clickRow`/`deleteRow`/`deleteConfirmButton`/`dialog`/`errorMessage`/`cancelButton`) used exactly as defined in the helper.
- **Known risks (flagged in-task):** unit-update persistence (`010007`) and duplicate-name enforcement (`010010`) — both instruct STOP-and-report rather than loosening, matching the department precedent.
