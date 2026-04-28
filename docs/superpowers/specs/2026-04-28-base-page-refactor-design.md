# Phase 1 — `BasePage` Common Locators Refactor

**Date:** 2026-04-28
**Status:** Approved (ready for plan)
**Scope:** Phase 1 of a 2-phase test framework refactor. Phase 2 (form helpers + master-detail base) is out of scope here and will be planned separately after Phase 1 ships.

## Problem

The 18 page objects in `tests/pages/` total 3,129 lines. Every page object re-implements the same locators with slightly different selectors:

- `toast()` appears in 14/18 page objects.
- `anyError()` appears in 14/18.
- `saveButton()` / `cancelButton()` / `editButton()` / `deleteButton()` reappear in roughly half of all page objects with regex variations like `^Save$|^Create$/i` vs. `/^(Save|Create|บันทึก|สร้าง)$/i`.
- `searchInput()`, `emptyState()`, `filterButton()`, `applyFilterButton()`, `statusBadge()`, `dialog()`, `alertDialog()` all repeat with minor selector drift.

The duplication has three concrete costs:

1. **Selector drift across modules.** When the frontend renames a button or changes a Radix `data-slot`, we update the same locator in 8–14 places — and it is easy to miss one, leaving silent breakage in the modules that did not get the fix.
2. **New page objects start by copy-pasting an old one.** The "boilerplate prefix" of 8–12 common locators is re-typed every time a new module is added.
3. **The two existing helpers (`DialogCrudHelper`, `PageFormCrudHelper`) cannot share these basics** because there is no common ancestor; instead they each re-declare their own `saveButton`, `cancelButton`, `errorMessage`, etc.

## Goal

Introduce an abstract `BasePage` class that owns the universal locators and helper methods. Every page object in `tests/pages/` extends it. After the refactor:

- Common locators live in **one** file. Selector fixes apply everywhere.
- New page objects start with module-specific code only.
- Existing helpers (`DialogCrudHelper`, `PageFormCrudHelper`) compose against `BasePage` so the dialog/form-form CRUD utilities stay aligned with the rest of the suite.

This change is **behaviour-preserving**: no test added, removed, or retitled; no annotation modified; the user-story docs do not need to be regenerated.

## Non-goals

- Form action helpers like `helper.create({ code, name })`.
- Master-detail base class for PR/PO/GRN/credit-note/store-requisition.
- Tabs / line-items composition mixins.
- Migrating away from `dialog-crud.helper.ts` / `page-form-crud.helper.ts`.

These belong to Phase 2 and will be designed in a separate spec once Phase 1 has stabilised.

## Architecture

```
tests/pages/
├── base.page.ts                    ← NEW
├── config-list.page.ts             ← extends BasePage
├── login.page.ts                   ← extends BasePage
├── dashboard.page.ts               ← extends BasePage
├── delivery-point.page.ts          ← extends BasePage
├── product-category.page.ts        ← extends BasePage
├── vendor.page.ts                  ← extends BasePage
├── price-list.page.ts              ← extends BasePage
├── price-list-template.page.ts     ← extends BasePage
├── purchase-request.page.ts        ← extends BasePage
├── purchase-order.page.ts          ← extends BasePage
├── pr-template.page.ts             ← extends BasePage
├── grn.page.ts                     ← extends BasePage
├── credit-note.page.ts             ← extends BasePage
├── store-requisition.page.ts       ← extends BasePage
├── stock-issue.page.ts             ← extends BasePage
├── campaign.page.ts                ← extends BasePage
├── my-approvals.page.ts            ← extends BasePage
├── period-end.page.ts              ← extends BasePage
├── dialog-crud.helper.ts           ← refactored to use BasePage utilities; public API unchanged
└── page-form-crud.helper.ts        ← refactored to use BasePage utilities; public API unchanged
```

The split between `*.page.ts` and `*.helper.ts` is preserved. `BasePage` is the shared ancestor for `*.page.ts`; the two helpers compose against it (they hold a `BasePage`-derived object internally).

## `BasePage` API

```ts
// tests/pages/base.page.ts
import type { Page, Locator } from "@playwright/test";

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
    // Sanity check before saving — if validation has fired, anyError() is visible.
    const count = await this.anyError().count();
    if (count > 0) {
      const first = await this.anyError().first().textContent();
      throw new Error(`Validation error visible before action: ${first?.trim()}`);
    }
  }
}
```

### Rules for sub-classes

1. **Override is allowed when the module's button does not match the base regex.** Example: `purchase-request.page.ts` ships its own `saveDraftButton()` and `submitButton()`. It does not need to override `saveButton()` — it simply does not call the inherited one.
2. **Do not redeclare a base method to keep the same selector** — that defeats the refactor. If a sub-class needs to scope a base locator to a panel/tab, name the override clearly (`dialogSaveButton`) or pass a scoping locator into a helper.
3. **The `protected page` member is intentionally `protected`** so sub-classes can keep using `this.page.locator(...)` for module-specific locators.

## Migration pattern

### Before

```ts
// vendor.page.ts (excerpt — 477 lines total, ~80 lines of common locators)
export class VendorPage {
  constructor(private page: Page) {}

  saveButton(): Locator {
    return this.page.getByRole("button", { name: /^(Save|Create)$/i }).first();
  }
  cancelButton(): Locator { /* … */ }
  editButton(): Locator { /* … */ }
  anyError(): Locator { /* … */ }

  // module-specific
  codeInput(): Locator { return this.page.locator("#vendor-code"); }
  businessTypeTrigger(): Locator { /* … */ }
}
```

### After

```ts
import { BasePage } from "./base.page";

export class VendorPage extends BasePage {
  // module-specific only — saveButton / cancelButton / editButton / anyError inherited
  codeInput(): Locator { return this.page.locator("#vendor-code"); }
  businessTypeTrigger(): Locator { /* … */ }
}
```

### Helper refactor

`DialogCrudHelper` and `PageFormCrudHelper` currently re-declare `saveButton`, `cancelButton`, etc. They are not page objects and therefore cannot extend `BasePage` directly without changing their public API. The refactor instead has each helper hold a small private `BasePage` instance to delegate to:

```ts
class _HelperPage extends BasePage {} // local concrete subclass

export class DialogCrudHelper {
  readonly list: ConfigListPage;
  private readonly base: _HelperPage;

  constructor(private page: Page, private opts: DialogCrudOptions) {
    this.list = new ConfigListPage(page, opts.listPath);
    this.base = new _HelperPage(page);
  }

  saveButton(): Locator {
    return this.dialog().getByRole("button", { name: /^(Create|Save|สร้าง|บันทึก)$/i });
  }
  // existing public methods stay exactly as they are — no caller-visible change.
}
```

The helpers' public method signatures **must not change** — every consuming spec keeps working unchanged.

## Migration order (commit plan)

Each commit must leave `bun test` and `bun run tsc --noEmit` green.

1. **Commit 1 — `base.page.ts` only.** Create the file. No new spec or test file is added — `bun run tsc --noEmit` compiling cleanly is sufficient verification at this stage. The class is exercised by the migration commits that follow.

   *Rationale:* Playwright's default `testMatch` picks up both `*.spec.ts` and `*.test.ts`. Adding a smoke runtime test here would require either renaming the file or adding a `testIgnore` rule, both of which add config complexity for no signal that the migration commits do not already provide.

2. **Commit 2 — Migrate simple/short page objects.** `dashboard.page.ts`, `login.page.ts`, `config-list.page.ts`, `delivery-point.page.ts`, `product-category.page.ts`. These are <120 lines each and use the most basic patterns.

3. **Commit 3 — Migrate vendor + price-list family.** `vendor.page.ts`, `price-list.page.ts`, `price-list-template.page.ts`. Largest and noisiest non-transaction modules; isolating them gives a clean diff.

4. **Commit 4 — Migrate transaction modules.** `purchase-request.page.ts`, `purchase-order.page.ts`, `pr-template.page.ts`, `grn.page.ts`, `credit-note.page.ts`, `store-requisition.page.ts`, `stock-issue.page.ts`, `campaign.page.ts`, `my-approvals.page.ts`, `period-end.page.ts`. These are larger but have the most module-specific surface, so the deletions per file are smaller in proportion.

5. **Commit 5 — Refactor `dialog-crud.helper.ts` and `page-form-crud.helper.ts`** to use `BasePage` via composition. Public API unchanged.

After each commit, run:

```bash
bun run tsc --noEmit          # type check
bun test -- --reporter=line   # full suite — must match baseline pass count
```

## Verification

Phase 1 is complete when **all** of the following hold:

- `tests/pages/base.page.ts` exists and exports the `BasePage` API documented above.
- All 18 existing files in `tests/pages/*.page.ts` (campaign, config-list, credit-note, dashboard, delivery-point, grn, login, my-approvals, period-end, pr-template, price-list, price-list-template, product-category, purchase-order, purchase-request, stock-issue, store-requisition, vendor) `extends BasePage`. The new `base.page.ts` is the only file in this glob that does not.
- No `*.page.ts` file declares a method whose body would be identical to the inherited one.
- `dialog-crud.helper.ts` and `page-form-crud.helper.ts` delegate their common-locator implementations to `BasePage`; their public method signatures are unchanged (verified by spec compilation).
- `bun run tsc --noEmit` exits 0.
- `bun test` produces the same pass/fail breakdown as the baseline captured in commit 1's PR description.
- No spec file under `tests/*.spec.ts` is modified.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| A module's existing button selector is **looser** than the base regex (e.g. `saveButton()` returned a button matching `/save/i` not `^Save$`), and migrating to the base inadvertently makes the locator stricter, causing flakiness. | Audit each migrated file's existing regex against the base regex *before* deleting the local method. If the existing regex is looser, keep the override and add a comment explaining why. |
| Two existing methods share a name but different semantics (e.g. `saveButton` in `dialog-crud.helper.ts` is dialog-scoped, the base is page-scoped). | The helpers are scoped to `this.dialog()`, so they keep their own local override and only delegate locators that are not dialog-scoped (`anyError` page-wide is fine; `saveButton` stays scoped). |
| TS subclass cannot override return type cleanly. | All base methods return `Locator`. No covariant narrowing required. |
| Hidden ordering coupling — moving a method into the base changes the order in which Playwright would resolve it. | Locator factories return fresh `Locator` objects per call; no ordering effect. |

## Out-of-scope (Phase 2 preview)

After Phase 1 stabilises, a separate spec will brainstorm:

- A `FormHelper` for chained actions (`helper.fill({code, name}).save().expectToast(/saved/)`).
- A `MasterDetailPage` base for PR/PO/GRN/credit-note/store-requisition with header form + line items + tabs.
- `TabsHelper` and `LineItemsHelper` composition mixins.
- Possibly migrating `dialog-crud.helper.ts` / `page-form-crud.helper.ts` toward the new form pattern (or deprecating them in favour of it).
