# Design: PR page-object migration — Phase 1 (List + navigation)

**Date:** 2026-06-17
**Status:** Approved

## Context

The PR module (`tests/pages/purchase-request.page.ts`, 530 lines) is stale vs the
redesigned PR UI — the PR journey specs are ~66% broken on main (see
[[project_transaction_module_rollout]]). The module is the largest in the app
(~40 FE components), so the migration is **decomposed into ~4 phases**; this is
**Phase 1 — List + navigation** (the foundation every journey needs).

Later phases (not this PR): Phase 2 create form, Phase 3 detail + workflow
actions, Phase 4 bulk + templates.

## Redesigned list UI (confirmed in the frontend)

`routes/procurement/purchase-request/_components/pr-component.tsx`:
- Heading "Purchase Request"; **"Add Request"** button → opens
  `pr-create-dialog` (Blank → `router.push('/procurement/purchase-request/new')`,
  or pick a template).
- **My Pending / All Documents are `<Button>`s** (viewMode state), NOT Radix
  tabs.
- `SearchInput` (fires `onSearch` on **Enter**).
- Rows/cards navigate via `router.push('/procurement/purchase-request/<id>')`.

## Changes (`tests/pages/purchase-request.page.ts` — list/nav slice only)

- `newButton()` → `getByRole("button", { name: /add request|^add$/i })`.
- `tabMyPending()` → `getByRole("button", { name: /my pending/i })`;
  `tabAllDocuments()` → `getByRole("button", { name: /all documents?/i })`.
  (No longer `role="tab"`.)
- `searchFor(text)` → fill the search input then `press("Enter")`.
- `openCreateDialog()` → click `newButton()`; if a dialog opens, click
  `createDialogBlankOption()`; assert URL `/purchase-request/new`.
  `createDialogBlankOption()` stays tolerant (`/blank|empty|start.*scratch/i`).
- `openPR(refOrText)` → resilient: find a card or row containing the ref, click
  its name link/button (or the card), wait for `/purchase-request/<id>`.
- Leave all form / detail / workflow / bulk / template methods untouched
  (Phases 2–4).

## Verification

1. Stashed-baseline the list/nav journey tests **before** (on main) and **after**
   for the relevant steps: `302` Step 1, `303` Step 1–2, `304` Step 1 (the
   list/tab/nav smokes). Confirm tests that failed purely on stale list/nav
   locators now pass; record any that still fail for downstream reasons (those
   need Phase 2/3 and stay failing — documented, not regressions).
2. `bun audit:tc-ids`; the BU-asserts (already merged) still green.
3. No `docs:user-stories` change expected (page-object only; no annotation edits).

## Risks / notes

- The list may render as **cards or a table** depending on viewMode/build;
  `openPR`/`prRow` must handle both (filter by ref text, click name link/card).
- Deeper journey steps (create/submit/approve) will still fail until Phases 2–3 —
  Phase 1 only fixes list/nav. The PR is judged on list/nav tests improving, not
  the whole journeys going green.
- Journey helpers (`pr-creator.helpers`, `pr-approver.helpers`) that do
  list/nav may also need small updates; include them if a Phase-1 test needs it,
  otherwise defer to the phase that owns them.
