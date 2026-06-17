# Design: migrate VendorPage to the redesigned sectioned UI + un-mask its tests

**Date:** 2026-06-17
**Status:** Approved & implemented

## Goal

`tests/pages/vendor.page.ts` was stale vs the redesigned React vendor UI
(tabbed → single sectioned page). The legacy multi-role tests wrapped actions in
`.catch()`, masking the drift (false positives). Migrate the page object and
un-mask the tests; rebuild the address/contact/info dynamic-array helpers.

## Redesigned UI (confirmed in the frontend repo)

Single sectioned page (no Radix tabs):
- `#vendor-code`, hero `NameField` (placeholder "e.g. บริษัท ABC จำกัด"),
  `LookupBuType` business-type multi-select (Popover + Command), `#vendor-description`.
- Addresses / Contacts / Info **sections** built on react-hook-form field arrays,
  so inputs carry `name="vendor_address.<i>.<field>"` (etc.) — targeted directly.
  Rows are **prepended** (newest = index 0).
- Toolbar submit (`form="vendor-form"`); edit/delete via row actions + DeleteDialog.

## Changes

- **`tests/pages/vendor.page.ts`** rewritten: `#vendor-code`, hero name by
  placeholder, `LookupBuType` trigger scoped to `#vendor-form`, name-attribute
  array fills, card-class row scoping (`div.rounded-xl.border` / `div.relative…`
  for contacts / `div.rounded-lg.border` for info), prepend-aware indexing.
  `switchTab()` is now a no-op (sections share one page). Dropped the removed
  tab/`activeSwitch` locators.
- **`tests/150-vendor.spec.ts`**: un-masked list/smoke, create (+ required
  business-type + address/contact arrays), array add/remove/primary; validation
  tests now assert *submit-blocked* (no success toast / stays on `/new`) since the
  redesign surfaces field errors via hover tooltips only.
  - **Skip-with-reason** (redesigned away): `TC-VEN-030006` (tab switch — no tabs),
    `TC-VEN-200005` (address city/district refinement — removed from the schema).
- **Frontend (`../carmen-inventory-frontend-react`)** — coupled fix: the vendor
  **update** PATCH omitted `doc_version` (optimistic concurrency), so edits
  produced no success toast (affecting even the pre-existing #11 admin edit test).
  Added `doc_version` to the `Vendor` type + `CreateVendorDto` and injected
  `vendor.doc_version` into the update mutate — same pattern as the config modules.

## Verification

- Full vendor spec: **40 passed / 2 skipped / 0 failed** (after the FE fix).
- `bun audit:tc-ids` ✓ · annotation-completeness ✓ (33/33) · `bun docs:user-stories` regenerated.

## Notes

- Followed the established admin@BLAVG/local-helper precedent for the redesign;
  the #11 admin block continues to use its own working local helpers.
- vendor & product-category were the remaining stale page objects after the PT
  migration; product-category remains a follow-up
  ([[project_vendor_prodcat_page_objects_stale]]).
