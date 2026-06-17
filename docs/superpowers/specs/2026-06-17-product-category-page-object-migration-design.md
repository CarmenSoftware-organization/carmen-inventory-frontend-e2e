# Design: migrate ProductCategoryPage to the redesigned tree+dialog UI

**Date:** 2026-06-17
**Status:** Approved & implemented (incremental — see Follow-ups)

## Goal

`tests/pages/product-category.page.ts` was stale vs the redesigned module (the
old "New Category/Subcategory/Item Group" + inline-edit tree model). Migrate the
page object to the redesigned UI. This is the last of the three stale
page-object migrations (after price-list-template and vendor).

## Redesigned UI (confirmed in the frontend repo)

`routes/product-management/category/_components/`:
- A **tree** of category → subcategory → item-group nodes (`tree-node.tsx`).
  Each node row carries the Tailwind `group/node` class and exposes **hover-only**
  actions by `aria-label`: **Add child** (Plus, non-item-group), **Edit**
  (Pencil), **Delete** (Trash).
- A single **"Add Category"** button creates a root category.
- Add/edit use a **dialog** (`CategoryDialog` → `CategoryForm`): `#code`, `#name`
  (both required) and a **required Tax Profile** select (`LookupTaxProfile`, a
  Radix Select). Submit button is "Create" (add) / "Save" (edit).
- Delete is confirmed via a **DeleteDialog** (AlertDialog). `SearchInput` filters
  the tree client-side (fires onSearch on Enter); expand/collapse all.
- **Removed**: separate New-Subcategory/Item-Group buttons, Tree/List view
  toggle, reorder/drag-drop, move, breadcrumb, filters (beyond search).

## Changes (this PR)

- **`tests/pages/product-category.page.ts`** rewritten: `addButton`, `node(text)`
  (`div.group\/node` filtered by text), node hover actions (`addChildOf` / `editNode`
  / `deleteNode` with reveal-on-hover), dialog form (`codeInput`/`nameInput`/
  `selectFirstTaxProfile`/`saveButton`/`fillAndSave`), `expectSavedToast`, search,
  `emptyState`. Dropped stale tree/list-view, move, parent-subcategory, inline-edit
  locators.
- **`tests/101-product-category.spec.ts`**: mapped legacy refs
  (`newCategoryButton`→`addButton`, `categoryNameInput`→`nameInput`,
  `newItemGroupButton`→`addButton`); Tree/List view toggle tests
  (`TC-CAT-080001/080002`) → skip-with-reason (removed). The #11 admin@BLAVG block
  (real redesigned CRUD coverage) is unchanged and green.

## Verification

- Full spec: **88 passed / 2 skipped / 0 failed**.
- `bun audit:tc-ids` ✓ · `bun docs:user-stories` regenerated.

## Follow-ups (tracked, not in this PR)

The legacy purchase/requestor describes are **thin best-effort stubs** (many click
a control and assert nothing; all `.catch()`-masked), so genuinely un-masking them
is a from-scratch rewrite of ~25 describes — while the admin@BLAVG block already
provides real CRUD coverage. Deferred:
1. **Skip-with-reason the removed-feature describes**: Reorder/Drag-Drop, Move,
   Breadcrumb, Filters (confirmed removed from the redesigned component).
2. **Rewrite the thin core describes** (View/Create×3/Edit/Delete/Search) to real
   assertions via the new page object, or retire them in favour of the admin block.
3. Verify the borderline describes (Item Counts, View Detail, the *-integration
   ones) and un-mask or skip accordingly.

See [[project_vendor_prodcat_page_objects_stale]].
