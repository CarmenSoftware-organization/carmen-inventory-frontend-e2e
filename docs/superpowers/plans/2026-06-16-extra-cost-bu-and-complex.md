# Extra Cost — BLAVG precondition + complex coverage + doc_version fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin active BU = `BLAVG` for the extra-cost spec, add an assert + 5 complex tests, and fix the frontend `doc_version` omission that breaks extra-cost edits.

**Architecture:** Frontend fix first (`extra-cost-dialog.tsx` + type send `doc_version`, mirroring department/unit/business-type) so edits persist; then e2e changes in `tests/030-extra-cost.spec.ts` reusing `DialogCrudHelper`. Self-contained tests (own unique `E2E EC0NN <UID>` name, cleanup-by-delete); edit tests gate navigation on the dialog closing.

**Tech Stack:** Playwright + TypeScript (e2e); React (frontend, repo `../carmen-inventory-frontend-react`).

**Design doc:** `docs/superpowers/specs/2026-06-16-extra-cost-bu-and-complex-design.md`

**Verified facts:** EC dialog fields = `#extra-cost-name` (required) + `#extra-cost-is-active`. Update = PATCH; payload omits `doc_version`; `ExtraCost` type lacks it. No discard-on-dirty (Cancel closes directly). e2e `opts = { listPath, nameInputId:"extra-cost-name", activeSwitchId:"extra-cost-is-active" }`. Existing tests: smoke `010001-010004`, validation `200001/200002`, CRUD `030001/040001/050001`, security `addDialogSecurityCases(skipAuth:true)`. New IDs fit existing sections → no catalog change. Helpers (`ensureActiveBu`/`getBusinessUnits`/`defaultBu`/`BuSwitcherPage`/`DialogCrudHelper`/`BU_CODE`) on `main`.

---

## Task 1: Frontend — send `doc_version` on extra-cost update

**Repo:** `/Users/samutpra/GitHub/carmensoftware-organize/carmen-inventory-frontend-react`
**Files:** `types/extra-cost.ts`, `routes/config/extra-cost/_components/extra-cost-dialog.tsx`

- [ ] **Step 1: Branch**
```bash
cd /Users/samutpra/GitHub/carmensoftware-organize/carmen-inventory-frontend-react
git checkout main && git pull --ff-only && git checkout -b fix/extra-cost-doc-version
```

- [ ] **Step 2: `types/extra-cost.ts`** — replace the two interfaces with EXACTLY:
```ts
export interface ExtraCost {
  id: string;
  /** Optimistic-concurrency token — backend requires it back on PATCH update. */
  doc_version: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateExtraCostDto {
  name: string;
  is_active: boolean;
  /** Only sent on update for optimistic concurrency; absent on create. */
  doc_version?: number;
}
```

- [ ] **Step 3: `extra-cost-dialog.tsx`** — in `onSubmit`'s `if (isEdit)` branch change:
```ts
      updateExtraCost.mutate(
        { id: extraCost.id, ...payload },
```
to:
```ts
      updateExtraCost.mutate(
        // doc_version round-trips the loaded record's version — backend requires
        // it on PATCH for optimistic concurrency (omitting it → 400).
        { id: extraCost.id, doc_version: extraCost.doc_version, ...payload },
```
Do NOT change the create branch.

- [ ] **Step 4: Verify** — `bunx tsc --noEmit` → clean (exit 0).

- [ ] **Step 5: Commit**
```bash
git add types/extra-cost.ts routes/config/extra-cost/_components/extra-cost-dialog.tsx
git commit -m "fix(extra-cost): send doc_version on update (PATCH requires it)"
```

---

## Task 2: e2e — BU precondition + assert TC-EC-010005

**Repo:** e2e (branch `test/extra-cost-bu-and-complex`)
**Files:** `tests/030-extra-cost.spec.ts`

- [ ] **Step 1: Add imports** (after the existing imports)
```ts
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";
```

- [ ] **Step 2: Add beforeEach** immediately after `test.describe("Extra Cost — Smoke & CRUD", () => {`:
```ts
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });
```

- [ ] **Step 3: Add the assert test** after the existing `TC-EC-010004` test:
```ts
  test(
    "TC-EC-010005 active BU = BLAVG",
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

- [ ] **Step 4: Run** — `bun run test -- -g "TC-EC-010005"` → PASS (frontend webServer serves the Task-1 fix branch). Retry once on cold "Auth server unavailable".

- [ ] **Step 5: Commit**
```bash
git add tests/030-extra-cost.spec.ts
git commit -m "test(extra-cost): lock active BU to BLAVG (precondition + assert TC-EC-010005)"
```

---

## Task 3: e2e — complex cases (is_active, edit-persist, edit-cancel, dup-name, delete-cancel)

**Files:** `tests/030-extra-cost.spec.ts`

- [ ] **Step 1: Add the five tests** before the `addDialogSecurityCases(...)` call (inside the describe):
```ts
  test(
    "TC-EC-040002 toggle is_active แล้ว persist",
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
      const name = `E2E EC042 ${UID}`;
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

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EC-040003 แก้ไขชื่อแล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิดแถวจาก list แก้ name แล้ว Save\n3. ยืนยัน list มี name ใหม่ ไม่พบ name เดิม\n4. ลบ record" },
        { type: "expected", description: "Updated; list มีแถว name ใหม่ และไม่พบ name เดิม (ค่าถูก persist จริง)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EC043 ${UID}`;
      const renamed = `E2E EC043 Upd ${UID}`;
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
      await expect(h.dialog()).toBeHidden({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(renamed);
      await expect(page.getByRole("cell", { name: renamed })).toBeVisible({ timeout: 10_000 });

      await h.deleteRow(renamed);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EC-040004 ยกเลิกการแก้ไข ค่าต้องไม่ถูกบันทึก",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิดแถวแก้ name เป็นค่าใหม่\n3. กด Cancel (dialog ปิดโดยไม่ save)\n4. เปิดแถวเดิมอีกครั้งเช็ค name\n5. ลบ record" },
        { type: "expected", description: "หลัง Cancel แล้วเปิดใหม่ name ยังเป็นค่าเดิม (การแก้ไขไม่ถูกบันทึก)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EC044 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.nameInput()).toBeEnabled({ timeout: 5_000 });
      await h.nameInput().fill(`${name} DIRTY`);
      await h.cancelButton().click();
      await expect(h.dialog()).toBeHidden({ timeout: 5_000 });

      await h.list.goto();
      await h.list.search(name);
      await h.clickRow(name);
      await expect(h.nameInput()).toHaveValue(name, { timeout: 5_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EC-200003 สร้าง name ซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record ด้วย name X\n2. เปิด Add dialog กรอก name X เดิม กด Save" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: dialog ยังเปิดอยู่ (backend reject name ซ้ำ)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EC200 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(h.dialog()).toBeVisible({ timeout: 10_000 });
      await h.cancelButton().click();

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  test(
    "TC-EC-050002 ยกเลิกการลบ record ต้องยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. สร้าง record\n2. เปิด delete dialog แล้วกด Cancel\n3. ค้นหา record ใน list\n4. ลบ record (cleanup)" },
        { type: "expected", description: "Delete dialog ปิดโดยไม่ลบ; record ยังปรากฏใน list" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page }) => {
      const h = new DialogCrudHelper(page, opts);
      const name = `E2E EC050 ${UID}`;
      await h.list.goto();
      await h.openAddDialog();
      await h.nameInput().fill(name);
      await h.saveButton().click();
      await expect(page.getByText(/created|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });

      await h.list.goto();
      await h.list.search(name);
      await h.deleteRow(name);
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(Cancel|ยกเลิก)$/i }).click();
      await expect(dialog).toBeHidden({ timeout: 5_000 });

      await h.list.goto();
      await h.list.search(name);
      await expect(page.getByRole("cell", { name })).toBeVisible();

      await h.deleteRow(name);
      await h.deleteConfirmButton().click();
      await expect(page.getByText(/deleted|success|สำเร็จ/i).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Run** — `bun run test -- -g "TC-EC-040002|TC-EC-040003|TC-EC-040004|TC-EC-200003|TC-EC-050002"` → all PASS. Notes:
  - 040002/040003/040004 exercise edit → pass only against the Task-1 fixed frontend (PATCH 200). If edit still 400s, STOP and report DONE_WITH_CONCERNS (dev server not on the fix branch).
  - `TC-EC-200003`: if the backend ACCEPTS the duplicate (dialog closes), STOP and report DONE_WITH_CONCERNS (do NOT loosen; delete both records). Controller will convert it to `test.fixme`.
  - Retry once on transient cold-auth flakes. Do NOT loosen real assertions.

- [ ] **Step 3: Commit**
```bash
git add tests/030-extra-cost.spec.ts
git commit -m "test(extra-cost): is_active persist, edit-persist guard, edit-cancel, dup-name, delete-cancel"
```

---

## Task 4: Docs + audit + full regression

**Files:** Regenerate `docs/user-stories/030-extra-cost.md`

- [ ] **Step 1: Annotation completeness**
```bash
f=tests/030-extra-cost.spec.ts; pre=$(grep -c 'type: "preconditions"' "$f"); exp=$(grep -c 'type: "expected"' "$f"); echo "pre=$pre exp=$exp"; [ "$pre" = "$exp" ] && echo OK || echo MISMATCH
```
Expected: `OK`.

- [ ] **Step 2: TC-ID audit** — `bun audit:tc-ids` → `0 errors`.

- [ ] **Step 3: Regenerate docs** — `bun docs:user-stories`; confirm:
```bash
grep -oE "TC-EC-(010005|040002|040003|040004|200003|050002)" docs/user-stories/030-extra-cost.md | sort -u | tr '\n' ' '; echo
```
Expected: all 6 listed.

- [ ] **Step 4: Full spec run** — `bun run test -- 030-extra-cost.spec.ts` → all PASS (dup-name skipped only if backend accepts; existing `TC-EC-040001` edit now passes via Task 1). No failures.

- [ ] **Step 5: Commit**
```bash
git add tests/030-extra-cost.spec.ts docs/user-stories/030-extra-cost.md
git commit -m "docs(user-stories): regenerate for new extra-cost test cases"
```

---

## Self-Review notes
- **Spec coverage:** frontend doc_version fix (Task 1); BU precondition + `TC-EC-010005` (Task 2); complex cases `040002/040003/040004/200003/050002` (Task 3); docs/audit (Task 4). `040004` is edit-cancel (the EC dialog has no discard prompt — same as business-type).
- **Self-containment:** each new test builds its own `E2E EC0NN <UID>` name and deletes it; no dependence on the existing `NAME`/`NAME_UPDATED` chain.
- **Type/method consistency:** `DialogCrudHelper` methods + `getBusinessUnits/defaultBu/BuSwitcherPage.trigger` used as in business-type; `doc_version` threaded through `ExtraCost`/`CreateExtraCostDto` + dialog in Task 1 before edit tests rely on it.
- **Known risks (flagged in-task):** doc_version dependency on the deployed frontend; dup-name → fixme if backend accepts.
