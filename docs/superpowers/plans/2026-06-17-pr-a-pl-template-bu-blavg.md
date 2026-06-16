# PR-A: Pricelist Template (PT) admin@BLAVG CRUD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Append an `admin@blueledgers.com` + BLAVG serial CRUD block to `tests/160-pl-template.spec.ts`, mirroring the vendor PR4 pattern, without touching the existing multi-role suites.

**Architecture:** Additive `adminTest.describe.serial("Pricelist Template — admin@BLAVG CRUD")` block at the end of the spec. `beforeEach` pins BU to BLAVG via `ensureActiveBu`. A module-level `UID` (`Date.now().toString(36)`) yields unique names so a worker restart re-derives them consistently. Seven tests: BU-assert → create → edit-persist → edit-cancel → dup-name reject → delete-cancel → delete cleanup. Reuses the existing `PriceListTemplatePage` page object and BasePage affordances (`editButton`, `deleteButton`, `cancelButton`, `dialog`, `alertDialog`, `searchInput`).

**Tech Stack:** Playwright, TypeScript, Bun. Dev backend via Playwright `webServer`.

---

## File Structure

- **Modify:** `tests/160-pl-template.spec.ts` — add imports + module-level `UID` + the new `adminTest.describe.serial` block (append at EOF). No existing test changes.
- **Modify:** `docs/test-id-scheme.md:45` — PT row sections `01–06, 90` → `01–06, 20, 90` (the dup-name reject uses validation section 20).
- **Regenerate:** `docs/user-stories/160-pl-template.md` — via `bun docs:user-stories`.
- **No page-object changes expected.** Every locator needed (`newButton`, `nameInput`, `descriptionInput`, `saveButton`, `expectSavedToast`, `openTemplate`, `editButton`, `deleteButton`, `cancelButton`, `searchInput`) already exists on `PriceListTemplatePage` or `BasePage`. If execution reveals a missing delete/edit affordance, add a focused locator factory to the page object (arrow-fn returning `Locator`) rather than inlining.

---

## Discovery note (read before Task 4 & 6)

The existing PT spec covers create/edit/activate but **not delete** and **not name-uniqueness**. Two things must be confirmed against the running app during execution:
- **Delete UI** (Task 6): whether delete is a detail-page `deleteButton` + `alertdialog`, or a row-actions menu. The plan codes the detail-page path; if the run shows a row-actions menu instead, switch to that (same pattern as `TC-VEN-050050`).
- **Name uniqueness** (Task 4): if the backend accepts a duplicate name (no reject), convert `TC-PT-200050` to `procurementManagerTest`-style `.fixme` with a note — same policy as currency dup-name in the prior rollout. Do NOT force a passing assertion.

---

## Task 1: Branch + imports + module-level UID

**Files:**
- Modify: `tests/160-pl-template.spec.ts:1-16`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b test/pl-template-bu-and-complex
```

- [ ] **Step 2: Add imports and UID**

Replace the top of `tests/160-pl-template.spec.ts` (the import block + role consts, lines 1-16) by inserting the BU helper imports and a module-level `UID`. The existing imports/consts stay; add:

```ts
import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PriceListTemplatePage, LIST_PATH } from "./pages/price-list-template.page";
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";

// Module-level unique id so the admin serial chain's names stay consistent
// across a worker restart (Date.now() recomputes identically per process).
const UID = Date.now().toString(36);
```

(Leave the existing `procurementStaffTest` / `procurementManagerTest` / `VALID_NAME` etc. consts exactly as they are.)

- [ ] **Step 3: Verify the spec still parses**

Run: `bun run test -- 160-pl-template.spec.ts --list`
Expected: lists existing tests with no import/parse error (exit 0).

- [ ] **Step 4: Commit**

```bash
git add tests/160-pl-template.spec.ts
git commit -m "test(pl-template): add BU helper imports + UID for admin@BLAVG block"
```

---

## Task 2: BU-assert test (TC-PT-010050)

**Files:**
- Modify: `tests/160-pl-template.spec.ts` (append at EOF)

- [ ] **Step 1: Append the admin block skeleton + BU-assert**

Append at end of file:

```ts
// ── admin@blueledgers.com + BLAVG CRUD ─────────────────────────────────────
// The describes above run as purchase/requestor (authz coverage) and are left
// untouched. This block verifies an admin can CRUD pricelist templates with the
// active BU pinned to BLAVG.
const adminTest = createAuthTest("admin@blueledgers.com");

adminTest.describe.serial("Pricelist Template — admin@BLAVG CRUD", () => {
  const ADMIN_NAME = `E2E PT ${UID}`;
  const ADMIN_NAME_UPDATED = `E2E PT Upd ${UID}`;
  const ADMIN_DESC = "E2E pricelist template (admin/BLAVG)";

  adminTest.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  adminTest(
    "TC-PT-010050 active BU = BLAVG",
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
});
```

- [ ] **Step 2: Run the BU-assert test**

Run: `bun run test -- 160-pl-template.spec.ts -g "TC-PT-010050"`
Expected: 1 passed. (If it fails on BU resolution, that's the same infra all config modules use — investigate before proceeding.)

- [ ] **Step 3: Commit**

```bash
git add tests/160-pl-template.spec.ts
git commit -m "test(pl-template): TC-PT-010050 active BU = BLAVG"
```

---

## Task 3: Create seed (TC-PT-010051)

**Files:**
- Modify: `tests/160-pl-template.spec.ts` (inside the admin describe, after TC-PT-010050)

- [ ] **Step 1: Add the create test**

Insert before the closing `});` of the admin describe:

```ts
  adminTest(
    "TC-PT-010051 สร้าง pricelist template (admin/BLAVG) สำเร็จ",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น admin@blueledgers.com; active BU = BLAVG; template ชื่อ ADMIN_NAME ยังไม่มีใน DB" },
        { type: "steps", description: "1. เปิดหน้า list แล้วกด 'New Pricelist Template'\n2. กรอก 'Template Name' = ADMIN_NAME\n3. กรอก 'Description'\n4. กด 'Save'\n5. ตรวจสอบ success toast" },
        { type: "expected", description: "success toast ปรากฏ (template ถูกสร้าง) — ใช้เป็น seed ของ serial chain" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      await tpl.newButton().click({ timeout: 10_000 });
      await tpl.fillHeader({ name: ADMIN_NAME, description: ADMIN_DESC });
      await tpl.saveButton().click({ timeout: 10_000 });
      await tpl.expectSavedToast();
    },
  );
```

- [ ] **Step 2: Run create + BU-assert together (serial)**

Run: `bun run test -- 160-pl-template.spec.ts -g "TC-PT-0100"`
Expected: 2 passed. If create fails because the form needs more than name+description, inspect the `/new` page and extend `fillHeader` args (e.g. `validityDays`) — the create form is the same one `TC-PT-010001` drives, so name+description should suffice.

- [ ] **Step 3: Commit**

```bash
git add tests/160-pl-template.spec.ts
git commit -m "test(pl-template): TC-PT-010051 create template seed (admin/BLAVG)"
```

---

## Task 4: Edit-persist + edit-cancel (TC-PT-040050, TC-PT-040051)

**Files:**
- Modify: `tests/160-pl-template.spec.ts` (inside the admin describe, after TC-PT-010051)

- [ ] **Step 1: Add the edit-persist test**

```ts
  adminTest(
    "TC-PT-040050 แก้ชื่อ template แล้ว persist",
    {
      annotation: [
        { type: "preconditions", description: "TC-PT-010051 ผ่านแล้ว → template ADMIN_NAME มีอยู่; login admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. ไป list แล้วค้นหา ADMIN_NAME\n2. เปิด template\n3. กด 'Edit'\n4. แก้ชื่อเป็น ADMIN_NAME_UPDATED\n5. กด 'Save'\n6. กลับ list ค้นหา ADMIN_NAME_UPDATED" },
        { type: "expected", description: "success toast ปรากฏ และ ADMIN_NAME_UPDATED ค้นเจอใน list ภายใน 10s (ค่าถูก persist)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      const search = tpl.searchInput();
      if ((await search.count()) > 0) await search.fill(ADMIN_NAME);
      await tpl.openTemplate(ADMIN_NAME);
      await tpl.editButton().click({ timeout: 10_000 });
      await tpl.nameInput().fill(ADMIN_NAME_UPDATED);
      await tpl.saveButton().click({ timeout: 10_000 });
      await tpl.expectSavedToast();

      await tpl.gotoList();
      const search2 = tpl.searchInput();
      if ((await search2.count()) > 0) await search2.fill(ADMIN_NAME_UPDATED);
      await expect(page.getByText(ADMIN_NAME_UPDATED).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 2: Add the edit-cancel test**

```ts
  adminTest(
    "TC-PT-040051 แก้ชื่อแล้วกด Cancel — ค่าเดิมคงอยู่",
    {
      annotation: [
        { type: "preconditions", description: "TC-PT-040050 ผ่านแล้ว → template ADMIN_NAME_UPDATED มีอยู่; login admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. ไป list ค้นหา ADMIN_NAME_UPDATED\n2. เปิด template แล้วกด 'Edit'\n3. แก้ชื่อเป็นค่าทิ้ง\n4. กด 'Cancel'\n5. กลับ list ค้นหา ADMIN_NAME_UPDATED" },
        { type: "expected", description: "ชื่อ template ยังเป็น ADMIN_NAME_UPDATED (การแก้ที่ยกเลิกไม่ถูกบันทึก)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      const search = tpl.searchInput();
      if ((await search.count()) > 0) await search.fill(ADMIN_NAME_UPDATED);
      await tpl.openTemplate(ADMIN_NAME_UPDATED);
      await tpl.editButton().click({ timeout: 10_000 });
      await tpl.nameInput().fill(`${ADMIN_NAME_UPDATED} DISCARD`);
      await tpl.cancelButton().click({ timeout: 10_000 });

      await tpl.gotoList();
      const search2 = tpl.searchInput();
      if ((await search2.count()) > 0) await search2.fill(ADMIN_NAME_UPDATED);
      await expect(page.getByText(ADMIN_NAME_UPDATED).first()).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 3: Run the edit pair (serial from seed)**

Run: `bun run test -- 160-pl-template.spec.ts -g "TC-PT-0100|TC-PT-0400"`
Expected: 4 passed. If `TC-PT-040050` surfaces a backend PATCH 400 about `doc_version`, that's the known config-module bug — fix the template edit dialog/type in `../carmen-inventory-frontend-react` (add `doc_version` to the PATCH payload), then re-run. Document the FE fix in the PR description.

- [ ] **Step 4: Commit**

```bash
git add tests/160-pl-template.spec.ts
git commit -m "test(pl-template): TC-PT-040050/040051 edit persist + cancel (admin/BLAVG)"
```

---

## Task 5: Dup-name reject + section-20 registration (TC-PT-200050)

**Files:**
- Modify: `tests/160-pl-template.spec.ts` (inside the admin describe)
- Modify: `docs/test-id-scheme.md:45`

- [ ] **Step 1: Register section 20 for PT**

Edit `docs/test-id-scheme.md` line 45, changing the PT row's "Sections used" from `01–06, 90` to `01–06, 20, 90`:

```
| `160-pl-template.spec.ts` | `PT` | 01–06, 20, 90 | CRUD + sub-journeys + edge cases |
```

- [ ] **Step 2: Add the dup-name reject test**

```ts
  adminTest(
    "TC-PT-200050 สร้าง template ชื่อซ้ำ ต้องถูก reject",
    {
      annotation: [
        { type: "preconditions", description: "TC-PT-040050 ผ่านแล้ว → template ADMIN_NAME_UPDATED มีอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. เปิดหน้า new template\n2. กรอกชื่อ = ADMIN_NAME_UPDATED (ซ้ำ) + description\n3. กด 'Save'" },
        { type: "expected", description: "รายการที่สองไม่ถูกสร้าง: มี error หรือยังอยู่ที่ฟอร์ม (backend reject duplicate name)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      await tpl.newButton().click({ timeout: 10_000 });
      await tpl.fillHeader({ name: ADMIN_NAME_UPDATED, description: ADMIN_DESC });
      await tpl.saveButton().click({ timeout: 10_000 });
      // Duplicate name must be rejected: an error surfaces (no success toast),
      // OR the form stays open. Assert NO success toast appeared.
      await expect(
        page
          .locator('[data-sonner-toast], [role="status"], [role="alert"]')
          .filter({ hasText: /success|saved|created|สำเร็จ/i })
          .first(),
      ).toHaveCount(0, { timeout: 5_000 });
    },
  );
```

- [ ] **Step 3: Run it**

Run: `bun run test -- 160-pl-template.spec.ts -g "TC-PT-200050"`
Expected: PASS (dup rejected). **If it FAILS because a success toast DID appear** (backend allows duplicate names), convert this test to `adminTest.fixme(...)` with a `note` annotation: `"Backend does not enforce template name uniqueness — fixme pending backend check (see prior currency dup-name policy)."` Re-run to confirm it is reported skipped.

- [ ] **Step 4: Commit**

```bash
git add tests/160-pl-template.spec.ts docs/test-id-scheme.md
git commit -m "test(pl-template): TC-PT-200050 duplicate-name reject + register section 20"
```

---

## Task 6: Delete-cancel + delete cleanup (TC-PT-050050, TC-PT-050051)

**Files:**
- Modify: `tests/160-pl-template.spec.ts` (inside the admin describe — these must be the LAST two tests so cleanup runs last)

- [ ] **Step 1: Confirm the delete affordance**

Before coding, run the app or inspect the template detail page to confirm how delete is exposed. The plan codes the detail-page `deleteButton()` + `alertdialog` path. If the run in Step 3 shows delete lives in a row-actions menu instead, switch to the row-actions pattern from `TC-VEN-050050` (`row.getByRole("button", {name: /actions|more/i})` → `menuitem` Delete → `alertdialog` confirm).

- [ ] **Step 2: Add delete-cancel then delete-cleanup (in this order)**

```ts
  adminTest(
    "TC-PT-050050 เปิด delete dialog แล้ว Cancel — template ยังอยู่",
    {
      annotation: [
        { type: "preconditions", description: "TC-PT-200050 ผ่านแล้ว → template ADMIN_NAME_UPDATED ยังอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. ไป list ค้นหา ADMIN_NAME_UPDATED\n2. เปิด template\n3. กด 'Delete'\n4. ใน dialog กด 'Cancel'\n5. กลับ list ค้นหา ADMIN_NAME_UPDATED" },
        { type: "expected", description: "template ADMIN_NAME_UPDATED ยังคงอยู่ใน list (ไม่ถูกลบ)" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      const search = tpl.searchInput();
      if ((await search.count()) > 0) await search.fill(ADMIN_NAME_UPDATED);
      await tpl.openTemplate(ADMIN_NAME_UPDATED);
      await tpl.deleteButton().click({ timeout: 10_000 });
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(cancel|ยกเลิก)$/i }).click();

      await tpl.gotoList();
      const search2 = tpl.searchInput();
      if ((await search2.count()) > 0) await search2.fill(ADMIN_NAME_UPDATED);
      await expect(page.getByText(ADMIN_NAME_UPDATED).first()).toBeVisible({ timeout: 10_000 });
    },
  );

  adminTest(
    "TC-PT-050051 ลบ template (admin/BLAVG) cleanup",
    {
      annotation: [
        { type: "preconditions", description: "TC-PT-050050 ผ่านแล้ว → template ADMIN_NAME_UPDATED ยังอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG" },
        { type: "steps", description: "1. ไป list ค้นหา ADMIN_NAME_UPDATED\n2. เปิด template\n3. กด 'Delete'\n4. ใน dialog ยืนยัน Delete\n5. ตรวจสอบ success toast" },
        { type: "expected", description: "success toast ('success/deleted/สำเร็จ') ปรากฏภายใน 10s (template ถูกลบ — ปิดท้าย serial chain)" },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page }) => {
      const tpl = new PriceListTemplatePage(page);
      await tpl.gotoList();
      const search = tpl.searchInput();
      if ((await search.count()) > 0) await search.fill(ADMIN_NAME_UPDATED);
      await tpl.openTemplate(ADMIN_NAME_UPDATED);
      await tpl.deleteButton().click({ timeout: 10_000 });
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      await dialog.getByRole("button", { name: /^(delete|confirm|ลบ|ok)$/i }).click();

      await expect(
        page
          .locator('[data-sonner-toast], [role="status"]')
          .filter({ hasText: /success|deleted|ลบ.*สำเร็จ|สำเร็จ/i })
          .first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );
```

- [ ] **Step 3: Run the full admin block in order**

Run: `bun run test -- 160-pl-template.spec.ts -g "admin@BLAVG"`
Expected: 7 passed (or 6 passed + 1 fixme if dup-name was demoted in Task 5). If delete fails to find the affordance, apply the row-actions fallback from Step 1 and re-run.

- [ ] **Step 4: Commit**

```bash
git add tests/160-pl-template.spec.ts
git commit -m "test(pl-template): TC-PT-050050/050051 delete cancel + cleanup (admin/BLAVG)"
```

---

## Task 7: Audits, docs regen, full-spec run

**Files:**
- Regenerate: `docs/user-stories/160-pl-template.md`

- [ ] **Step 1: Annotation-completeness audit**

Run:
```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```
Expected: no output (all matched).

- [ ] **Step 2: TC ID audit**

Run: `bun audit:tc-ids`
Expected: passes (exit 0). Confirms section 20 registration took.

- [ ] **Step 3: Regenerate user-story docs**

Run: `bun docs:user-stories`
Expected: `docs/user-stories/160-pl-template.md` updated with the 7 (or 6+fixme) new TCs.

- [ ] **Step 4: Run the whole PT spec once**

Run: `bun run test -- 160-pl-template.spec.ts`
Expected: existing tests still pass/skip as before + the new admin block green. No regressions in the untouched suites.

- [ ] **Step 5: Commit docs**

```bash
git add docs/user-stories/160-pl-template.md
git commit -m "docs(user-stories): regenerate for pl-template admin@BLAVG block"
```

---

## Task 8: Security review + PR

- [ ] **Step 1: Security review**

If any page-object code was added (Task 6 fallback), invoke `superpowers:requesting-code-review` (or the `security-review` skill) on the diff. If only spec annotations/tests changed, a quick self-review of the new locators/navigation suffices — note it.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin test/pl-template-bu-and-complex
gh pr create --title "test(pl-template): admin@blueledgers.com + BLAVG CRUD block" \
  --body "$(cat <<'EOF'
Appends an admin@blueledgers.com + BLAVG serial CRUD block to 160-pl-template.spec.ts (PR-A of the procurement-trio rollout, spec: docs/superpowers/specs/2026-06-17-procurement-trio-bu-blavg-design.md). Existing purchase/requestor authz suites untouched.

New tests: TC-PT-010050 (BU assert), 010051 (create), 040050/040051 (edit persist+cancel), 200050 (dup-name reject), 050050/050051 (delete cancel+cleanup). Registers PT section 20.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**Spec coverage** (against `2026-06-17-procurement-trio-bu-blavg-design.md` PR-A):
- BU-assert `TC-PT-010050` ✓ (Task 2)
- create `TC-PT-010051` ✓ (Task 3)
- edit-persist `TC-PT-040050` ✓, edit-cancel `TC-PT-040051` ✓ (Task 4)
- dup-name `TC-PT-200050` + fixme fallback ✓ (Task 5)
- delete-cancel `TC-PT-050050`, cleanup `TC-PT-050051` ✓ (Task 6)
- no `is_active` toggle case ✓ (omitted by design)
- conditional FE `doc_version` fix ✓ (Task 4 Step 3)
- audits + user-story regen ✓ (Task 7); security review ✓ (Task 8)

**Placeholder scan:** no TBD/TODO; every code step shows full code. Discovery points (delete affordance, dup-name enforcement) are explicit run-and-adapt instructions, not placeholders.

**Type/name consistency:** `ADMIN_NAME` / `ADMIN_NAME_UPDATED` / `ADMIN_DESC` used consistently across Tasks 3–6; `adminTest`, `UID`, `BU_CODE` consistent; page-object methods (`gotoList`, `newButton`, `fillHeader`, `saveButton`, `expectSavedToast`, `openTemplate`, `editButton`, `deleteButton`, `cancelButton`, `searchInput`) all verified to exist.
