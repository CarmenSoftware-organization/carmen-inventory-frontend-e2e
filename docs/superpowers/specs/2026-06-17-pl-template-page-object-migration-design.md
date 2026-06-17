# Design: migrate PriceListTemplatePage to the redesigned UI + un-mask its tests

**Date:** 2026-06-17
**Status:** Approved

## Goal

`tests/pages/price-list-template.page.ts` is **stale vs the redesigned React UI**
(discovered during the procurement-trio rollout, e2e PR #13). Its
`newButton()`/`fillHeader()`/`nameInput()`/`descriptionInput()`/`currencyTrigger()`/
`saveButton()`/`openTemplate()` no longer match, and the legacy happy-path tests
wrap every action in `.catch(() => {})` so the mismatch is **silently swallowed**
— they are false positives that never actually exercise the flow.

Migrate the page object to the redesigned UI and convert the legacy happy-path
tests from `.catch()`-masked to real assertions where the feature exists.

## Approach

The #13 admin@BLAVG block already proved working locators for the redesign. This
migration **promotes those into the page object** as proper methods, then points
both the admin block and the legacy tests at them (DRY).

### 1. Rewrite the page object (`tests/pages/price-list-template.page.ts`)

Redesigned UI facts (verified in the frontend repo):
- Create/edit is a **rich form** on `/price-list-template/new` (and `/:id`).
  Required fields: **name + currency**. Description/validity/products optional.
- `name` → hero **NameField** input, placeholder `"e.g. Fresh Produce Template"`.
- `currency` → **LookupCurrency** Radix `Select` (combobox → option), required.
- `description` → Textarea (placeholder "optional").
- Save → toolbar submit button (text "Save"/"Create").
- List "add" button → **"Add Template"** → `router.push(.../new)`.
- Edit/Delete → **row-actions menu** (`Row actions` button) → menuitem; delete
  opens a `DeleteDialog` AlertDialog (Cancel / Delete buttons).
- Create redirects to the **list** (not detail); update stays on detail + toast.

New/updated locator factories & helpers:
- `newButton()` → `/add template|^add$/i`
- `nameInput()` → `getByPlaceholder(/Fresh Produce Template/i)`
- `descriptionInput()` → the optional Textarea
- `currencySelect()` + `selectFirstCurrency()`
- `saveButton()` → `/^(save|create|บันทึก|สร้าง)$/i` (toolbar submit)
- `openByName(name)` → `gotoList` → search (fill + **Enter**) → click name → wait detail
- `rowActionsTrigger(name)` / `deleteViaRowActions(name, {confirm})` → row-actions
  menu → DeleteDialog
- `fillHeader({name, description, currency?})` rewired to the new locators;
  `selectFirstCurrency` covers the required currency.
- Keep `expectSavedToast()` (already tolerant).
- `searchInput()` note: the list's `SearchInput` fires `onSearch` on **Enter**
  only — helpers that filter must `.press("Enter")`.

### 2. Refactor the #13 admin block to use the page object

Drop the local helpers in the `Pricelist Template — admin@BLAVG CRUD` block and
call the new page-object methods. Behaviour unchanged; all 7 must stay green.

### 3. Un-mask the legacy happy-path tests

Convert `.catch()` best-effort → real assertions **where the feature cleanly
exists**: create (`TC-PT-010001`), edit (`TC-PT-030001`), search
(`TC-PT-060001/060002`). These should hard-assert toast / URL / empty-state.

## Scope guard (verify-then-decide per sub-feature)

`clone` (`TC-PT-040001`), `activate/deactivate` (`TC-PT-050001/3/5`), and
`add-products` (`TC-PT-020001`) depend on sub-features whose redesigned state is
**not yet verified**. For each, during execution:
- If the feature still exists in the redesigned UI → un-mask with real asserts.
- If it changed substantially or was removed → mark the test `skip` with a
  **concrete reason** (no silent `.catch()`, no forced pass).
This PR will NOT expand to rebuild a removed feature.

## Components touched

- `tests/pages/price-list-template.page.ts` (rewrite locators/helpers).
- `tests/160-pl-template.spec.ts` (refactor admin block to use page object;
  un-mask legacy happy-paths; skip-with-reason where needed).
- Regenerated `docs/user-stories/160-pl-template.md`.

## Testing & verification

1. Full PT spec green with **no `.catch()`-hidden failures** remaining in the
   un-masked tests (skips must carry reasons).
2. The #13 admin block (7 tests) stays green after the refactor.
3. `bun audit:tc-ids`, annotation-completeness, `bun docs:user-stories` regen.

## Risks / notes

- Un-masking may surface real app bugs (previously hidden). If a core CRUD test
  fails for a genuine app reason, document it (fixme + note) rather than
  re-masking — same policy as prior rollout fixmes.
- One PR: branch `test/pl-template-page-object-migration`. vendor /
  product-category page-object migrations remain separate follow-ups
  ([[project_vendor_prodcat_page_objects_stale]]).
