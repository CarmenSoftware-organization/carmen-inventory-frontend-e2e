---
title: Inventory Adjustment — Stock Controller Journey
persona: Inventory Controller
route: routes/inventory-management/inventory-adjustment
url: /inventory-management/inventory-adjustment
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Inventory Adjustment — Stock Controller Journey

## Purpose / Use Case

The Inventory Controller uses this module to record manual corrections to recorded stock — a **Stock In** adjustment increases quantity on hand at a location (e.g. found stock, opening balance), a **Stock Out** adjustment decreases it (e.g. damage, write-off, theft). Each document is tied to a single location, an **adjustment type** (the "reason"), a date that must fall inside the open period, and one or more product line items. Documents start as **Draft** and can be edited, deleted, or **Voided** (which makes them read-only). Data is scoped to the active business unit (**BU = BLAVG** in this suite).

Two document families share one UI driven by the `?type=stock-in` / `?type=stock-out` query param: `si_no` / `si_date` / `stock_in_detail` for stock-in, `so_no` / `so_date` / `stock_out_detail` for stock-out.

---

## Screens & Steps

### Screen 1 — List (`/inventory-management/inventory-adjustment`)

**Purpose:** Browse, search, filter, and launch new adjustments. Source: `_components/ia-component.tsx`, `_components/use-ia-table.tsx`, `_components/ia-card-list.tsx`.

**Header:** module tile icon + title, a secondary count badge (total records) when > 0, description, and the action group.

**Toolbar actions**

| Action | Description |
|--------|-------------|
| **Stock In** (green / `success` variant) | Navigates to `.../new?type=stock-in`. |
| **Stock Out** (red / `destructive` variant) | Navigates to `.../new?type=stock-out`. |
| **Export** | Downloads the list (XLSX) with columns Adjustment, Date, Type, Location, Reason, Items, Total, Status, Description; shows `exportSuccess` toast, or `exportNoData` warning when empty. On mobile this is in a "more actions" dropdown. |
| **Print** | Triggers `globalThis.print()`. |
| **Search** | `SearchInput` filtering by document number (`si_no` / `so_no`). |
| **Type filter** | `StatusFilter` — options Stock In / Stock Out (default label "All Type"). |
| **Status filter** | `StatusFilter` — In Progress / Completed / Draft / Voided. |
| **List / Grid toggle** | Desktop only; switches between `DataGridTable` and the card grid. Mobile is always grid + infinite scroll. |
| **Column visibility** | `Columns3` button (list view only). |
| **Mobile filter sheet** | Bottom `Sheet` holding Type + Status filters with a count badge on the trigger. |

**List table columns** (`use-ia-table.tsx`)

| Column | Description |
|--------|-------------|
| Adjustment | Document number (`si_no` / `so_no`); clicking opens detail. |
| Date | `si_date` / `so_date`, formatted to the user's date format. |
| Type | Badge "STOCK IN" / "STOCK OUT" (via `getAdjustmentType`). |
| Location | `location_name`. |
| Reason | `adjustment_type_name`. |
| Items | `item_count`. |
| Total | `base_total_cost`. |
| Status | Badge Draft / In Progress / Completed / Voided (`IA_STATUS_CONFIG`). |

**Other states:** `EmptyComponent` when no rows; `ErrorState` with a Retry button (calls `refetch`) on fetch error; `ActiveFilterBar` shows removable filter pills with a **Clear All** control.

**Validation/behavior:** Active filters are stored in URL state (`doc_status|...`, `type|...`).

---

### Screen 2 — New / Edit Form (`.../new?type=...`, `.../{id}?type=...`)

**Purpose:** Create or edit an adjustment. Source: `_components/ia-form.tsx`, `_components/ia-form-hero.tsx`, `_components/ia-doc-info.tsx`, `_components/ia-item-fields.tsx`, `_components/ia-item-table.tsx`, `_components/ia-form-schema.ts`.

**Document Info card** (`ia-doc-info.tsx`)

| Field | Required | Description |
|-------|----------|-------------|
| **Date** | Yes | `FieldDatePicker` constrained to the current period (`fromDate`/`toDate` = period start/end). In add mode defaults to today, capped at period end. |
| **Reason** | Yes | `FieldSelect` of active adjustment types → `adjustment_type_id`. |
| **Location** | Yes | `LookupUserLocation` restricted to `INVENTORY` and `CONSIGNMENT` location types → `location_id`. |
| **Description** | No | `Textarea`, max 256 chars. |

**Line items section** (`ia-item-fields.tsx` + `ia-item-table.tsx`)

| Column / control | Description |
|------------------|-------------|
| **Add Item** button | `prepend`s a blank row; **disabled until a Location is selected**. |
| Product | Lookup; products already chosen are excluded from other rows' options. |
| Qty | Number, minimum 1. |
| Cost Per Unit | Auto-filled from the product's average cost at the location (Stock In); **hidden for stock-out** item tables. |
| Total Cost | Computed = qty × cost per unit. |
| Description | Per-line, max 256 chars. |
| Remove (trash icon) | Opens a **"Remove Item"** confirm dialog before deleting the row. |

**Summary sidebar** (`ia-summary.tsx`): Status badge, Date, Reason, Location, **Lines** (item count), **Total Qty**, and a bold **Grand Total**. A posting info box reads "posting will increase / decrease stock at {location} by {qty}" depending on type.

**Form actions:** Create / Save (success → `createSuccess` / `updateSuccess` toast, redirect to list), Delete (draft only → `deleteSuccess`), Void (reason dialog → `voidSuccess`, status becomes Voided and the document goes read-only with no Edit/Delete/Void).

**Validation** (`createAdjSchema`, zod):

- Location required — "Location is required".
- Reason / adjustment type required — "Adjustment Type is required".
- At least one item — "At least one product is required".
- Qty ≥ 1 — "Quantity must be at least 1".
- Date within current period — "Date is outside the current period".
- Description ≤ 256 chars.

---

### Screen 3 — Detail (view mode) (`.../{id}?type=...`)

**Purpose:** Read-only review before editing or voiding. Source: `[id]/page.tsx`, `[id]/_content.tsx`.

The detail renders the same Document Info and Summary in plain (non-editable) form behind a hero header (document number, type, date, location, status badge) plus an **Edit** button. Voided/completed documents present no edit affordances.

> **BU dependence:** All adjustment list/detail/create calls are scoped to the active business unit; the suite standard is **BU = BLAVG**. Out-of-BU data is not shown.

---

## Linked Test Cases

`docs/test-cases/730-inventory-adjustment.md` (prefix `IADJ`, 28 cases). User stories: `docs/user-stories/730-inventory-adjustment.md`.

- **List / smoke:** TC-IADJ-010001, 010002, 010003, 010009, 010050
- **Search / filter:** TC-IADJ-010004, 010005, 010006, 010007, 010008
- **Detail:** TC-IADJ-020001, 020002
- **Create:** TC-IADJ-030001, 030002, 030003, 030004, 030005, 030006, 030050
- **Edit / delete / void:** TC-IADJ-040001, 040050, 050001, 060001
- **Authorization / guard:** TC-IADJ-100001, 100002
- **Validation:** TC-IADJ-200001, 200002, 200003, 200004, 200005
- **Export / mobile:** TC-IADJ-300001, 900001

System-process counterpart: [tx-06-stock-in-adj.md](../System%20Process/tx-06-stock-in-adj.md), [tx-07-stock-out-adj.md](../System%20Process/tx-07-stock-out-adj.md).
