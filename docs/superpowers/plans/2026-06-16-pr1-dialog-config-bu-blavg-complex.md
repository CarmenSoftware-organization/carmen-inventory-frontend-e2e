# PR1 — Dialog Config Modules: BU=BLAVG + Complex Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the four dialog-based config modules (credit-term, currency, tax-profile, credit-note-reason) up to the extra-cost standard — BLAVG active-BU precondition + BU-assert test + complex CRUD cases.

**Architecture:** Each spec already logs in as `admin@blueledgers.com` and uses `DialogCrudHelper`. We add (a) BU imports, (b) a `beforeEach` calling `ensureActiveBu(page, BU_CODE)`, (c) a BU-assert test in section block `01`, and (d) the complex cases in blocks `04`/`05`/`20`. The transformation is identical to `tests/030-extra-cost.spec.ts` (the canonical template). Where an edit-persist case fails because the React frontend omits `doc_version` on PATCH, fix that module's dialog in `../carmen-inventory-frontend-react`.

**Tech Stack:** Playwright, TypeScript, Bun, React frontend (sibling repo).

**Parent spec:** `docs/superpowers/specs/2026-06-16-config-modules-bu-blavg-complex-design.md`

---

## Canonical template

The literal source of truth for all additions is `tests/030-extra-cost.spec.ts`
(prefix `EC`). The diffs below reproduce its added pieces with per-module
substitutions. Read that file alongside this plan.

### Per-module substitution table

| Module file | PREFIX | describe title | nameInputId | activeSwitchId | NAME prefix |
|---|---|---|---|---|---|
| `tests/032-credit-term.spec.ts` | `CT` | `Credit Term — Smoke & CRUD` | `credit-term-name` | `credit-term-is-active` | `E2E CT` |
| `tests/040-currency.spec.ts` | `CUR` | `Currency — Smoke & CRUD` | `currency-name` | `currency-is-active` | `E2E CUR` |
| `tests/042-tax-profile.spec.ts` | `TP` | `Tax Profile — Smoke & CRUD` | `tax-profile-name` | `tax-profile-is-active` | `E2E TP` |
| `tests/602-cn-reason.spec.ts` | `CNR` | `Credit Note Reason — Smoke & CRUD` | `cn-reason-name` | *(none)* | `E2E CNR` |

`cn-reason` has **no** `is_active` switch → **omit** the `040002` toggle-persist
case; implement only `010005`, `040003`, `040004`, `200003`, `050002`.

### Shared edit A — imports (append after the existing `addDialogSecurityCases` import on line 4)

```ts
import { BU_CODE } from "./test-users";
import { ensureActiveBu, getBusinessUnits, defaultBu } from "./helpers/bu";
import { BuSwitcherPage } from "./pages/bu-switcher.page";
```

### Shared edit B — beforeEach + BU-assert (insert immediately after the `test.describe("<title>", () => {` line)

```ts
  test.beforeEach(async ({ page }) => {
    await ensureActiveBu(page, BU_CODE);
  });

  test(
    "TC-<PREFIX>-010005 active BU = BLAVG",
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

### Shared edit C — complex cases (insert immediately BEFORE the `addDialogSecurityCases(test, {` call)

Reproduce the five `TC-EC-…` complex cases from `tests/030-extra-cost.spec.ts`
(lines 231–415: `040002`, `040003`, `040004`, `200003`, `050002`), with these
mechanical substitutions:

- `TC-EC-` → `TC-<PREFIX>-`
- the local `name`/`renamed` literals: `E2E EC042` → `<NAME prefix>042`,
  `E2E EC043` → `<NAME prefix>043`, `E2E EC200` → `<NAME prefix>200`,
  `E2E EC050` → `<NAME prefix>050`, etc. (keep the `${UID}` suffix)
- everything else (helper calls, toast regexes, timeouts, annotations) is unchanged.

For `cn-reason` omit the `040002` block (no `setActive`/`activeSwitch`).

---

## Task 1: credit-term (032)

**Files:**
- Modify: `tests/032-credit-term.spec.ts`
- Possibly modify (frontend): `../carmen-inventory-frontend-react/routes/config/credit-term/_components/credit-term-dialog.tsx`

- [ ] **Step 1: Apply shared edits A, B, C** to `tests/032-credit-term.spec.ts` using `PREFIX=CT`, `nameInputId=credit-term-name`, `activeSwitchId=credit-term-is-active`, NAME prefix `E2E CT`. Include all five complex cases.

- [ ] **Step 2: Annotation-completeness audit**

Run:
```bash
f=tests/032-credit-term.spec.ts; pre=$(grep -c 'type: "preconditions"' "$f"); exp=$(grep -c 'type: "expected"' "$f"); echo "pre=$pre exp=$exp"
```
Expected: `pre` == `exp` (both 15).

- [ ] **Step 3: TC-ID audit**

Run: `bun audit:tc-ids`
Expected: 0 errors.

- [ ] **Step 4: Run the spec against dev backend**

Run: `bun run test -- 032-credit-term.spec.ts`
Expected: all tests pass. **If `TC-CT-040003` (edit persist) fails** with a 400 / toast error / name-not-persisted, the frontend omits `doc_version` on PATCH (confirmed at `credit-term-dialog.tsx:106`). Proceed to Step 5; otherwise skip to Step 6.

- [ ] **Step 5: Fix frontend doc_version (only if Step 4 surfaced it)**

In `../carmen-inventory-frontend-react/routes/config/credit-term/_components/credit-term-dialog.tsx`, change the update mutate call (around line 105) from:
```ts
      updateCreditTerm.mutate(
        { id: creditTerm.id, ...payload },
```
to:
```ts
      updateCreditTerm.mutate(
        // doc_version round-trips the loaded record's version — backend requires
        // it on PATCH for optimistic concurrency (omitting it → 400).
        { id: creditTerm.id, doc_version: creditTerm.doc_version, ...payload },
```
Then verify `CreditTerm`/the update-hook input type includes `doc_version` (grep `doc_version` under `routes/config/credit-term` and `hooks/use-credit-term*` / `types/`); add it to the type if missing. Re-run Step 4 until green. Commit the frontend fix separately in the sibling repo:
```bash
cd ../carmen-inventory-frontend-react && git checkout -b fix/credit-term-doc-version && git add routes/config/credit-term/_components/credit-term-dialog.tsx <any type file touched> && git commit -m "fix(credit-term): send doc_version on PATCH (optimistic concurrency)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Regenerate user-story docs**

Run: `bun docs:user-stories`
Expected: `docs/user-stories/032-credit-term.md` updated with the new TCs.

- [ ] **Step 7: Commit (e2e repo)**

```bash
git add tests/032-credit-term.spec.ts docs/user-stories/032-credit-term.md
git commit -m "test(credit-term): BU=BLAVG precondition + BU-assert + 5 complex cases

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## Task 2: currency (040)

**Files:**
- Modify: `tests/040-currency.spec.ts`
- Possibly modify (frontend): `../carmen-inventory-frontend-react/routes/config/currency/_components/*dialog*.tsx`

- [ ] **Step 1: Apply shared edits A, B, C** with `PREFIX=CUR`, `nameInputId=currency-name`, `activeSwitchId=currency-is-active`, NAME prefix `E2E CUR`. All five complex cases.

- [ ] **Step 2: Annotation audit** — `f=tests/040-currency.spec.ts; echo "pre=$(grep -c 'type: \"preconditions\"' $f) exp=$(grep -c 'type: \"expected\"' $f)"` → equal (15/15).

- [ ] **Step 3: TC-ID audit** — `bun audit:tc-ids` → 0 errors.

- [ ] **Step 4: Run** — `bun run test -- 040-currency.spec.ts` → green. If `TC-CUR-040003` fails on PATCH, do Step 5.

- [ ] **Step 5: Fix frontend doc_version (only if needed)** — find the currency dialog's update mutate (`grep -rn "mutate(" routes/config/currency/_components`), add `doc_version: currency.doc_version` to the update payload object exactly as in Task 1 Step 5; ensure the type carries `doc_version`. Commit in sibling repo on branch `fix/currency-doc-version`.

- [ ] **Step 6: Docs** — `bun docs:user-stories` → `docs/user-stories/040-currency.md` updated.

- [ ] **Step 7: Commit** — `git add tests/040-currency.spec.ts docs/user-stories/040-currency.md && git commit -m "test(currency): BU=BLAVG precondition + BU-assert + 5 complex cases

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"`

## Task 3: tax-profile (042)

**Files:**
- Modify: `tests/042-tax-profile.spec.ts`
- Possibly modify (frontend): `../carmen-inventory-frontend-react/routes/config/tax-profile/_components/*dialog*.tsx`

- [ ] **Step 1: Apply shared edits A, B, C** with `PREFIX=TP`, `nameInputId=tax-profile-name`, `activeSwitchId=tax-profile-is-active`, NAME prefix `E2E TP`. All five complex cases.

- [ ] **Step 2: Annotation audit** — `f=tests/042-tax-profile.spec.ts; echo "pre=$(grep -c 'type: \"preconditions\"' $f) exp=$(grep -c 'type: \"expected\"' $f)"` → equal (15/15).

- [ ] **Step 3: TC-ID audit** — `bun audit:tc-ids` → 0 errors.

- [ ] **Step 4: Run** — `bun run test -- 042-tax-profile.spec.ts` → green. If `TC-TP-040003` fails on PATCH, do Step 5.

- [ ] **Step 5: Fix frontend doc_version (only if needed)** — find the tax-profile dialog's update mutate, add `doc_version: taxProfile.doc_version` (use the actual edit-entity variable name) to the update payload; ensure the type carries it. Commit in sibling repo on branch `fix/tax-profile-doc-version`.

- [ ] **Step 6: Docs** — `bun docs:user-stories` → `docs/user-stories/042-tax-profile.md` updated.

- [ ] **Step 7: Commit** — `git add tests/042-tax-profile.spec.ts docs/user-stories/042-tax-profile.md && git commit -m "test(tax-profile): BU=BLAVG precondition + BU-assert + 5 complex cases

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"`

## Task 4: credit-note-reason (602) — NO is_active

**Files:**
- Modify: `tests/602-cn-reason.spec.ts`
- Possibly modify (frontend): `../carmen-inventory-frontend-react/routes/config/credit-note-reason/_components/*dialog*.tsx`

- [ ] **Step 1: Apply shared edits A, B, C** with `PREFIX=CNR`, `nameInputId=cn-reason-name`, **no activeSwitchId**, NAME prefix `E2E CNR`. **Omit** the `TC-CNR-040002` toggle-persist case (module has no `is_active` switch). Implement only `010005`, `040003`, `040004`, `200003`, `050002`.

- [ ] **Step 2: Annotation audit** — `f=tests/602-cn-reason.spec.ts; echo "pre=$(grep -c 'type: \"preconditions\"' $f) exp=$(grep -c 'type: \"expected\"' $f)"` → equal (expect 14/14: 9 existing + BU-assert + 4 complex).

- [ ] **Step 3: TC-ID audit** — `bun audit:tc-ids` → 0 errors.

- [ ] **Step 4: Run** — `bun run test -- 602-cn-reason.spec.ts` → green. If `TC-CNR-040003` fails on PATCH, do Step 5.

- [ ] **Step 5: Fix frontend doc_version (only if needed)** — find the cn-reason dialog's update mutate, add `doc_version` to the update payload; ensure the type carries it. Commit in sibling repo on branch `fix/cn-reason-doc-version`.

- [ ] **Step 6: Docs** — `bun docs:user-stories` → `docs/user-stories/602-cn-reason.md` updated.

- [ ] **Step 7: Commit** — `git add tests/602-cn-reason.spec.ts docs/user-stories/602-cn-reason.md && git commit -m "test(cn-reason): BU=BLAVG precondition + BU-assert + 4 complex cases (no is_active)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"`

## Task 5: Final verification + PR

- [ ] **Step 1: Full audit across all four specs**

```bash
for f in tests/032-credit-term.spec.ts tests/040-currency.spec.ts tests/042-tax-profile.spec.ts tests/602-cn-reason.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f"); exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] && echo "OK $f ($pre)" || echo "MISMATCH $f: pre=$pre exp=$exp"
done
bun audit:tc-ids
```
Expected: all `OK`, audit 0 errors.

- [ ] **Step 2: Re-run all four specs together** — `bun run test -- 032-credit-term.spec.ts 040-currency.spec.ts 042-tax-profile.spec.ts 602-cn-reason.spec.ts` → all green.

- [ ] **Step 3: Security review** of any frontend dialog changes made (use requesting-code-review / security-review). No new e2e page-object code is introduced in PR1, so review is frontend-only and likely a no-op if no doc_version fixes were needed.

- [ ] **Step 4: Open PR** for the e2e branch (and a paired PR per sibling-repo `fix/*-doc-version` branch if any were created). Use `finishing-a-development-branch` to decide merge/PR.

---

## Self-review notes

- **Spec coverage:** PR1 section of the parent spec is fully covered — all four
  dialog modules, cn-reason's no-is_active exception handled, doc_version fix
  path concrete.
- **TC-ID collisions:** new IDs (`010005`, `040002`, `040003`, `040004`,
  `200003`, `050002`) verified absent from all four specs' current IDs.
- **Duplicate-name (`200003`) caveat:** if a module's backend accepts duplicate
  names, mark that assertion `fixme` with a note (per dept `010011` precedent)
  rather than forcing it — note this in the commit.
