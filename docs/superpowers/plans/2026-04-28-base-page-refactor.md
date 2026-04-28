# Phase 1 — `BasePage` Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce an abstract `BasePage` class in `tests/pages/base.page.ts`, migrate all 18 existing page objects in `tests/pages/*.page.ts` to extend it, and refactor `dialog-crud.helper.ts` / `page-form-crud.helper.ts` to compose against it — eliminating duplicated common locators while leaving runtime behaviour and the spec files unchanged.

**Architecture:** Single TypeScript file (`tests/pages/base.page.ts`) defining `abstract class BasePage` with `protected page: Page`, owning the universal locators (toast, anyError, dialog/alertDialog, save/cancel/edit/delete buttons, search/filter, empty state, status badge) and helpers (goto, waitForToast, expectNoError). Each existing page object becomes `extends BasePage`; module-specific locators stay in place. Sub-classes override base methods only when their selector is **looser** (matches more strings) or has additional logic (chained filters/and-clauses). Helpers (which cannot extend `BasePage` without breaking their public API) hold a private concrete `BasePage` instance for delegation.

**Tech Stack:** TypeScript 5+, Playwright `@playwright/test` (Locator factories), Bun (test runner & package manager).

**Reference docs:**
- Spec: `docs/superpowers/specs/2026-04-28-base-page-refactor-design.md`
- Project conventions: `CLAUDE.md` (this repo)

**Working tree:** All work happens on the current branch. Each task ends with a single commit.

---

## Pre-flight — Capture baseline

Before writing any code, capture the current test pass/fail counts so we can verify Phase 1 made no behavioural change.

- [ ] **Step 0.1: Capture baseline test results**

```bash
bun run tsc --noEmit 2>&1 | tee /tmp/baseline-tsc.log
echo "TSC exit: ${PIPESTATUS[0]}"
```

Expected: exit code `0`, no errors.

```bash
bun test -- --reporter=line 2>&1 | tee /tmp/baseline-test.log | tail -40
```

Expected: a final line of the form `NN passed (Xs)` or `NN passed, M failed (Xs)`. Record the **passed/failed/skipped counts** somewhere safe (e.g. paste them into the PR description draft) — every later commit must match these counts exactly.

If `bun test` cannot run at all in this environment (e.g. frontend dir not present), record that and proceed — the per-commit verification will then rely solely on `bun run tsc --noEmit` plus a focused per-module run.

---

## Task 1: Create `BasePage`

**Files:**
- Create: `tests/pages/base.page.ts`

- [ ] **Step 1.1: Write `tests/pages/base.page.ts`**

Create the file with exactly this content:

```ts
import type { Page, Locator } from "@playwright/test";

/**
 * Abstract base for every `*.page.ts` page object in this repo.
 *
 * Owns the locators and helpers that appeared duplicated across 14+ page
 * objects before the Phase 1 refactor (see
 * `docs/superpowers/specs/2026-04-28-base-page-refactor-design.md`).
 *
 * Sub-classes:
 * - May add module-specific locators using `this.page.locator(...)` etc.
 * - May override a base method when the module needs a *looser* regex or
 *   extra chained logic (e.g. `.and()` / `.filter()`).
 * - Must NOT redeclare a base method to keep the same selector — that
 *   defeats the refactor.
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  // ── Universal feedback locators ──────────────────────────────────
  toast(): Locator {
    return this.page
      .locator('[data-sonner-toast], [role="status"], [role="alert"]')
      .first();
  }

  anyError(): Locator {
    return this.page.locator(
      '[aria-invalid="true"], p.text-destructive, [role="alert"][data-slot="field-error"]',
    );
  }

  dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  alertDialog(): Locator {
    return this.page.getByRole("alertdialog");
  }

  // ── Common buttons (EN + TH) ─────────────────────────────────────
  saveButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Save|Create|บันทึก|สร้าง)$/i })
      .first();
  }

  cancelButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Cancel|ยกเลิก)$/i })
      .first();
  }

  editButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Edit|แก้ไข)$/i })
      .first();
  }

  deleteButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Delete|ลบ)$/i })
      .first();
  }

  // ── Filter / search / list affordances ───────────────────────────
  searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).first();
  }

  filterButton(): Locator {
    return this.page
      .getByRole("button", { name: /^(Filter|กรอง)$/i })
      .first();
  }

  applyFilterButton(): Locator {
    return this.page
      .getByRole("button", { name: /apply filters?/i })
      .first();
  }

  emptyState(): Locator {
    return this.page
      .getByText(/no.*data|no.*results|empty|ไม่พบ/i)
      .first();
  }

  // ── Status badge (transactional modules) ─────────────────────────
  statusBadge(): Locator {
    return this.page.locator('[data-slot="badge"]').first();
  }

  // ── Helpers ──────────────────────────────────────────────────────
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async waitForToast(text?: string | RegExp): Promise<void> {
    const t = this.toast();
    await t.waitFor({ state: "visible" });
    if (text !== undefined) {
      const re = typeof text === "string" ? new RegExp(text, "i") : text;
      await t.filter({ hasText: re }).waitFor({ state: "visible" });
    }
  }

  async expectNoError(): Promise<void> {
    const count = await this.anyError().count();
    if (count > 0) {
      const first = await this.anyError().first().textContent();
      throw new Error(`Validation error visible before action: ${first?.trim()}`);
    }
  }
}
```

- [ ] **Step 1.2: Verify TypeScript compiles**

```bash
bun run tsc --noEmit
```

Expected: exit code `0`, no errors. The new file is unused at this point but must compile cleanly.

- [ ] **Step 1.3: Run the test suite — must match baseline**

```bash
bun test -- --reporter=line 2>&1 | tail -10
```

Expected: same `NN passed`/`failed`/`skipped` counts as the baseline captured in Step 0.1. The new file is not imported anywhere yet so behaviour cannot change.

- [ ] **Step 1.4: Commit**

```bash
git add tests/pages/base.page.ts
git commit -m "$(cat <<'EOF'
refactor(pages): add BasePage with shared common locators

Introduces an abstract BasePage class that owns toast, anyError,
dialog/alertDialog, common buttons (save/cancel/edit/delete), search/
filter affordances, empty state, status badge, and helpers (goto,
waitForToast, expectNoError). Subsequent commits migrate the 18 existing
page objects to extend it. No behaviour change in this commit — the
file is unimported.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Migrate Group A — simple page objects

Migrate the five smallest page objects. Each one becomes `extends BasePage` and has its now-redundant common methods removed.

**Files (all under `tests/pages/`):**
- Modify: `dashboard.page.ts`
- Modify: `login.page.ts`
- Modify: `config-list.page.ts`
- Modify: `delivery-point.page.ts`
- Modify: `product-category.page.ts`

### Step 2.1 — `dashboard.page.ts`

- [ ] **Read the file and identify the class declaration.** It currently does not declare any of the common methods listed in `BasePage` (verified via audit). The migration is therefore purely structural.

Change:

```ts
// before
export class DashboardPage {
  constructor(private page: Page) {}
  // …
}
```

to:

```ts
// after
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  // existing module-specific members unchanged
}
```

Specifically:

1. Add `import { BasePage } from "./base.page";` after the existing `import type { Page, Locator }` line.
2. Change the class declaration line from `export class DashboardPage {` to `export class DashboardPage extends BasePage {`.
3. Delete the entire constructor (`constructor(private page: Page) {}`) — the base provides one with `protected page`.
4. Anywhere inside the class that says `this.page`, leave it untouched — the inherited `protected page` keeps the reference live.

### Step 2.2 — `login.page.ts`

- [ ] Apply the same three edits as Step 2.1 to `login.page.ts`. The audit confirms it declares no common methods to delete.

### Step 2.3 — `config-list.page.ts`

- [ ] Apply the same three edits to `config-list.page.ts`. Note: this class takes a second constructor argument (`private path: string`). The replacement constructor must be:

```ts
// before
constructor(
  private page: Page,
  private path: string,
) {}

// after
constructor(page: Page, private path: string) {
  super(page);
}
```

Class declaration becomes `export class ConfigListPage extends BasePage {`.

The arrow-function field locators (`readonly addButton = () => …`) keep working unchanged.

### Step 2.4 — `delivery-point.page.ts`

- [ ] Apply the Step 2.1 pattern. Audit confirms no common methods declared.

### Step 2.5 — `product-category.page.ts`

- [ ] Apply the Step 2.1 pattern (`extends BasePage`, remove constructor, add import). Then **delete** these methods (their bodies are equal to or stricter than the base's regex, so the base regex is a strict superset):

| Method | Existing regex | Base regex | Verdict |
|---|---|---|---|
| `saveButton()` | `/^save$\|^create$/i` | `/^(Save\|Create\|บันทึก\|สร้าง)$/i` | base is superset → delete |
| `editButton()` | `/^edit$/i` | `/^(Edit\|แก้ไข)$/i` | base is superset → delete |
| `deleteButton()` | `/^delete$/i` | `/^(Delete\|ลบ)$/i` | base is superset → delete |
| `toast()` | identical | identical | delete |
| `anyError()` | identical | identical | delete |
| `filterButton()` | `/^filter$/i` | `/^(Filter\|กรอง)$/i` | base is superset → delete |
| `applyFilterButton()` | `/apply filters?/i` | `/apply filters?/i` | identical → delete |

**Keep** these (their regex is *looser* than the base, or has extra clauses):

- `searchInput()` — uses `/search|category name/i`. Keep with a one-line comment explaining the override.
- `emptyState()` — uses `/no.*categor|no.*data|empty|ไม่พบ/i`. Keep with a one-line comment.

For each kept override, prepend a single-line comment immediately above the method:

```ts
// override: needs to also match the "category name" placeholder seen in some flows
searchInput(): Locator { /* unchanged body */ }
```

```ts
// override: matches the module-specific "no categor*" empty text
emptyState(): Locator { /* unchanged body */ }
```

### Step 2.6 — Verify TypeScript compiles

- [ ] Run:

```bash
bun run tsc --noEmit
```

Expected: exit code `0`. If you get an error like `Property 'page' is private and only accessible within class …`, you forgot to remove the old `private page` constructor from one of the files.

### Step 2.7 — Run the test suite

- [ ] Run:

```bash
bun test -- --reporter=line 2>&1 | tail -10
```

Expected: same counts as baseline.

If a previously-passing test now fails on one of the 5 migrated modules, the most likely cause is a kept override that was wrongly deleted (look for a missing module-specific clause in the regex). Restore the override with the comment from Step 2.5 and rerun.

### Step 2.8 — Commit

- [ ] Run:

```bash
git add tests/pages/dashboard.page.ts tests/pages/login.page.ts tests/pages/config-list.page.ts tests/pages/delivery-point.page.ts tests/pages/product-category.page.ts
git commit -m "$(cat <<'EOF'
refactor(pages): migrate simple page objects to extend BasePage

dashboard, login, config-list, delivery-point, product-category all
now extend BasePage. Removes redundant local declarations of toast,
anyError, common buttons, and filter affordances where the local regex
was equivalent to or a subset of the base. Module-specific overrides
(product-category searchInput / emptyState) are preserved with comments.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Migrate Group B — vendor + price-list family

Migrate the three large non-transaction modules. These have **looser** save-button regexes and (for vendor) a custom `anyError`, so most save/anyError overrides stay.

**Files:**
- Modify: `tests/pages/vendor.page.ts`
- Modify: `tests/pages/price-list.page.ts`
- Modify: `tests/pages/price-list-template.page.ts`

### Step 3.1 — `vendor.page.ts`

- [ ] Apply the structural edits (add import, `extends BasePage`, drop constructor — keep `super(page)` if there is any constructor body).

For the common methods, follow this audit:

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/^(Create\|Save)$/i` chained with `[type="submit"]` filter | **KEEP** — the `.and(this.page.locator('[type="submit"]'))` is module-specific. Add comment: `// override: scoped to FormToolbar submit button only` |
| `cancelButton()` | `/^Cancel$/i` | Delete (base superset) |
| `editButton()` | `/^Edit$/i` | Delete (base superset) |
| `anyError()` | multi-source custom locator (4 surfaces) | **KEEP** with its existing inline comment block — already documented |

Vendor declares no `deleteButton`, `searchInput`, `filterButton`, `applyFilterButton`, `emptyState`, `statusBadge`, `toast` — nothing more to delete on the common-locator side.

### Step 3.2 — `price-list.page.ts`

- [ ] Apply structural edits, then:

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/^save$\|^create$\|^submit$/i` | **KEEP** — adds "submit". Comment: `// override: also matches Submit button in some flows` |
| `cancelButton()` | `/^cancel$/i` | Delete |
| `editButton()` | `/^edit$/i` | Delete |
| `deleteButton()` | `/^delete$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `getByPlaceholder(/search/i).first()` | Delete |
| `emptyState()` | `/no.*found\|no.*data\|empty\|ไม่พบ/i` | **KEEP** — adds "found". Comment: `// override: also matches "no … found" empty text` |

### Step 3.3 — `price-list-template.page.ts`

- [ ] Apply structural edits, then:

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/save changes\|^save$\|^create$/i` | **KEEP** — adds "save changes". Comment: `// override: also matches "Save Changes" button on edit screen` |
| `cancelButton()` | `/^cancel$/i` | Delete |
| `editButton()` | `/^edit$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `getByPlaceholder(/search/i).first()` | Delete |
| `applyFilterButton()` | `/apply filter/i` | Delete (base `apply filters?` is a superset) |

**Important:** the file currently has a duplicated `cancelButton()` declaration around line 125 (visible in the audit because two grep hits appeared — actually one is inside a different scope; verify by reading the file). After deleting the redundant declarations, run `bun run tsc --noEmit` immediately to catch any "duplicate member" errors that the existing dup may cause once the surrounding code shifts.

### Step 3.4 — Verify TypeScript compiles

- [ ] Run `bun run tsc --noEmit`. Exit `0` expected.

### Step 3.5 — Run the test suite

- [ ] Run `bun test -- --reporter=line 2>&1 | tail -10`. Counts must match baseline.

### Step 3.6 — Commit

- [ ] Run:

```bash
git add tests/pages/vendor.page.ts tests/pages/price-list.page.ts tests/pages/price-list-template.page.ts
git commit -m "$(cat <<'EOF'
refactor(pages): migrate vendor + price-list family to extend BasePage

vendor, price-list, price-list-template now extend BasePage. Save-button
overrides preserved where the local regex matches strings the base does
not (e.g. "Save Changes", "Submit", "Save PO"). Vendor's multi-surface
anyError override is preserved with its existing comment block.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Migrate Group C — transaction modules

Migrate the ten transactional modules. Each has its own status-badge filter and (often) a save-button regex that includes module-specific tokens.

**Files (all under `tests/pages/`):**
- Modify: `purchase-request.page.ts`
- Modify: `purchase-order.page.ts`
- Modify: `pr-template.page.ts`
- Modify: `grn.page.ts`
- Modify: `credit-note.page.ts`
- Modify: `store-requisition.page.ts`
- Modify: `stock-issue.page.ts`
- Modify: `campaign.page.ts`
- Modify: `my-approvals.page.ts`
- Modify: `period-end.page.ts`

### Common pattern for every file in this task

For each file, do **all four** of:

1. Add `import { BasePage } from "./base.page";`.
2. Change the class declaration from `export class XxxPage {` to `export class XxxPage extends BasePage {`.
3. Drop the existing `constructor(private page: Page) {}` (or replace with `super(page)` if the constructor has additional logic — none of the ten currently does).
4. Apply the per-file deletion table below.

### Step 4.1 — `purchase-request.page.ts`

- [ ] Per-method audit:

| Method | Existing | Action |
|---|---|---|
| `editButton()` | `/^edit$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `getByPlaceholder(/search/i).first()` | Delete |
| `statusBadge()` | filtered by `/draft\|in.progress\|approved\|void\|completed\|returned\|rejected\|cancelled/i` | **KEEP** — comment: `// override: filters to PR-specific status text` |

PR has no local `saveButton` (it uses `saveDraftButton` and `submitButton` instead), no `cancelButton` (it has `cancelFormButton` and `cancelPRButton`), no `deleteButton`. Leave those module-specific buttons unchanged.

### Step 4.2 — `purchase-order.page.ts`

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/save po\|^save$\|^submit$\|^create$/i` | **KEEP** — comment: `// override: also matches "Save PO" / "Submit"` |
| `cancelButton()` | `/^cancel$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `statusBadge()` | filtered by PO-specific status text | **KEEP** with comment |

### Step 4.3 — `pr-template.page.ts`

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/save template\|^save$\|^submit$\|^create$/i` | **KEEP** — comment: `// override: also matches "Save Template" / "Submit"` |
| `editButton()` | `/^edit$/i` | Delete |
| `deleteButton()` | `/^delete$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `filterButton()` | `/^filter$/i` | Delete |
| `applyFilterButton()` | `/^apply$/i` | **KEEP** — comment: `// override: this module's apply button reads only "Apply"` |
| `emptyState()` | `/no.*template\|no.*data\|empty\|ไม่พบ/i` | **KEEP** — comment: `// override: also matches "no template" empty text` |

### Step 4.4 — `grn.page.ts`

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/^save$\|^submit$\|^create$/i` | **KEEP** — comment: `// override: also matches "Submit" button` |
| `editButton()` | `/^edit$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `emptyState()` | `/no.*grn\|.../i` | **KEEP** with comment |
| `statusBadge()` | filtered by GRN status text | **KEEP** with comment |

### Step 4.5 — `credit-note.page.ts`

| Method | Existing | Action |
|---|---|---|
| `saveButton()` | `/^save$\|^submit$\|^create$/i` | **KEEP** — comment: `// override: also matches "Submit"` |
| `editButton()` | `/^edit$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `filterButton()` | `/^filter$/i` | Delete |
| `applyFilterButton()` | `/apply filter/i` | Delete (base `apply filters?` superset) |
| `emptyState()` | `/no.*credit note\|.../i` | **KEEP** with comment |
| `statusBadge()` | filtered | **KEEP** with comment |

### Step 4.6 — `store-requisition.page.ts`

| Method | Existing | Action |
|---|---|---|
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `filterButton()` | `/^filter$/i` | Delete |
| `emptyState()` | `/no.*pending\|no.*requisition\|empty\|ไม่พบ/i` | **KEEP** with comment |
| `statusBadge()` | filtered | **KEEP** with comment |

### Step 4.7 — `stock-issue.page.ts`

| Method | Existing | Action |
|---|---|---|
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `emptyState()` | `/no.*issue\|.../i` | **KEEP** with comment |
| `statusBadge()` | filtered | **KEEP** with comment |

### Step 4.8 — `campaign.page.ts`

| Method | Existing | Action |
|---|---|---|
| `editButton()` | `/^edit$/i` | Delete |
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `searchInput()` | `/search/i` | Delete |
| `emptyState()` | `/no.*campaign\|.../i` | **KEEP** with comment |
| `statusBadge()` | filtered | **KEEP** with comment |

### Step 4.9 — `my-approvals.page.ts`

| Method | Existing | Action |
|---|---|---|
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `emptyState()` | `/no.*pending\|no.*approval\|empty\|ไม่พบ/i` | **KEEP** with comment |

### Step 4.10 — `period-end.page.ts`

| Method | Existing | Action |
|---|---|---|
| `toast()` | identical | Delete |
| `anyError()` | identical | Delete |
| `statusBadge()` | filtered | **KEEP** with comment |

### Step 4.11 — Verify TypeScript compiles

- [ ] Run `bun run tsc --noEmit`. Exit `0` expected. If a duplicate-member error appears, the most likely cause is a file that had two declarations of the same name; the audit caught one obvious case in `price-list-template.page.ts` already, but verify here too.

### Step 4.12 — Run the test suite

- [ ] Run `bun test -- --reporter=line 2>&1 | tail -10`. Counts must match baseline.

If you see flake on a transaction module, the most likely cause is `statusBadge` — make sure you preserved the module-specific filter.

### Step 4.13 — Commit

- [ ] Run:

```bash
git add tests/pages/purchase-request.page.ts tests/pages/purchase-order.page.ts tests/pages/pr-template.page.ts tests/pages/grn.page.ts tests/pages/credit-note.page.ts tests/pages/store-requisition.page.ts tests/pages/stock-issue.page.ts tests/pages/campaign.page.ts tests/pages/my-approvals.page.ts tests/pages/period-end.page.ts
git commit -m "$(cat <<'EOF'
refactor(pages): migrate transaction modules to extend BasePage

PR, PO, PR-template, GRN, credit-note, store-requisition, stock-issue,
campaign, my-approvals, period-end now extend BasePage. Save buttons
that include module-specific tokens (e.g. "Save PO", "Save Template",
"Submit") and status badges that filter by module-specific status text
are preserved as overrides with explanatory comments.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Refactor `dialog-crud.helper.ts` and `page-form-crud.helper.ts`

These two helpers are not page objects — they wrap a `Page` and expose dialog-scoped or page-form-scoped locators. They cannot extend `BasePage` because doing so would change their public API (every consuming spec would need to change). Instead, each helper holds a private concrete `BasePage` instance and delegates the *page-wide* common locators to it (`alertDialog()`, `dialog()`). The dialog-scoped buttons stay scoped.

The public method signatures **must not change**.

**Files:**
- Modify: `tests/pages/dialog-crud.helper.ts`
- Modify: `tests/pages/page-form-crud.helper.ts`

### Step 5.1 — Refactor `dialog-crud.helper.ts`

- [ ] At the top of the file, add the import:

```ts
import { BasePage } from "./base.page";
```

- [ ] Add a private concrete subclass and a `base` field:

Right after the existing `interface DialogCrudOptions { … }` block and before `export class DialogCrudHelper {`, insert:

```ts
class _BasePageImpl extends BasePage {}
```

- [ ] Inside the class, add the field declaration and update the constructor:

```ts
// before
export class DialogCrudHelper {
  readonly list: ConfigListPage;

  constructor(
    private page: Page,
    private opts: DialogCrudOptions,
  ) {
    this.list = new ConfigListPage(page, opts.listPath);
  }
```

```ts
// after
export class DialogCrudHelper {
  readonly list: ConfigListPage;
  private readonly base: _BasePageImpl;

  constructor(
    private page: Page,
    private opts: DialogCrudOptions,
  ) {
    this.list = new ConfigListPage(page, opts.listPath);
    this.base = new _BasePageImpl(page);
  }
```

- [ ] Replace the body of `deleteConfirm()` to delegate, since it is page-wide:

```ts
// before
deleteConfirm(): Locator {
  return this.page.getByRole("alertdialog");
}
```

```ts
// after
deleteConfirm(): Locator {
  return this.base.alertDialog();
}
```

- [ ] **Do not change** `dialog()`, `nameInput()`, `activeSwitch()`, `cancelButton()`, `saveButton()`, `errorMessage()`, `deleteConfirmButton()`, `deleteCancelButton()`, `openAddDialog()`, `clickRow()`, `deleteRow()` — they are dialog-scoped (or list-scoped). Their public behaviour stays the same.

The point of this refactor is small: it gives the helper access to `BasePage` for any future page-wide delegation, and demonstrates the composition pattern. It deliberately does not over-DRY the dialog-scoped buttons.

### Step 5.2 — Refactor `page-form-crud.helper.ts`

- [ ] Apply the same pattern:

1. Add `import { BasePage } from "./base.page";`.
2. Add `class _BasePageImpl extends BasePage {}` between the imports and `export class PageFormCrudHelper`.
3. Add `private readonly base: _BasePageImpl;` field and `this.base = new _BasePageImpl(page);` in the constructor.
4. Replace the body of `deleteConfirm()` to use `this.base.alertDialog()`.

- [ ] **Do not change** the public bodies of `saveButton()`, `cancelButton()`, `editButton()`, `deleteButton()`, `errorMessage()`, `deleteConfirmButton()`, `clickRowName()`. They are tightly coupled to the form-CRUD module pattern and changing them would alter caller behaviour.

(If a future Phase 2 spec deprecates these helpers in favour of a new form pattern, that is when the duplicated buttons go away. Doing it now would change Phase 1 from "behaviour-preserving" to "API-changing".)

### Step 5.3 — Verify TypeScript compiles

- [ ] Run `bun run tsc --noEmit`. Exit `0` expected.

### Step 5.4 — Run the test suite

- [ ] Run `bun test -- --reporter=line 2>&1 | tail -10`. Counts must match baseline.

### Step 5.5 — Commit

- [ ] Run:

```bash
git add tests/pages/dialog-crud.helper.ts tests/pages/page-form-crud.helper.ts
git commit -m "$(cat <<'EOF'
refactor(pages): wire dialog and page-form helpers to BasePage

DialogCrudHelper and PageFormCrudHelper now hold a private BasePage
instance for page-wide delegation (deleteConfirm uses base.alertDialog).
Public method signatures and dialog-scoped buttons are unchanged — no
spec needs editing. Sets the foundation for further consolidation in
Phase 2.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Final verification

- [ ] **Step 6.1: Final type check**

```bash
bun run tsc --noEmit
```

Expected: exit `0`.

- [ ] **Step 6.2: Final test run**

```bash
bun test -- --reporter=line 2>&1 | tee /tmp/final-test.log | tail -10
```

Expected: pass/fail/skip counts match the baseline captured in Step 0.1.

- [ ] **Step 6.3: Confirm spec invariants**

Run these checks:

```bash
# All 18 page objects extend BasePage
grep -L "extends BasePage" tests/pages/*.page.ts | grep -v base.page.ts
```

Expected: empty output. Any file printed here is a `*.page.ts` that did *not* end up extending `BasePage`.

```bash
# No spec under tests/*.spec.ts was modified across all Phase 1 commits.
# Use the spec-doc commit (Task 0 — already on disk before plan execution
# starts) as the comparison base.
SPEC_COMMIT=$(git log --grep='Phase 1 BasePage refactor design spec' --format=%H -n 1)
git diff --name-only "${SPEC_COMMIT}"..HEAD -- 'tests/*.spec.ts'
```

Expected: empty output. If `SPEC_COMMIT` resolves to empty, fall back to comparing against the commit just before Task 1 (`git log --oneline | head -10` to find it manually).

```bash
# Helpers import BasePage
grep -l "from \"./base.page\"" tests/pages/dialog-crud.helper.ts tests/pages/page-form-crud.helper.ts
```

Expected: both filenames printed.

- [ ] **Step 6.4: Summarise commits for the PR description**

```bash
git log --oneline -n 6
```

Expected: the most recent six commits include the spec-doc commit followed by five refactor commits (Tasks 1–5), all behaviour-preserving.

The PR body should include:
- Baseline test counts (from Step 0.1).
- Final test counts (from Step 6.2) — must match.
- Confirmation that no `tests/*.spec.ts` files changed.
- Link to the spec: `docs/superpowers/specs/2026-04-28-base-page-refactor-design.md`.
