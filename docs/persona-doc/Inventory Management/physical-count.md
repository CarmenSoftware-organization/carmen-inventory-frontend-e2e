---
title: Physical Count — Stock Controller Journey
persona: Store Manager
route: routes/inventory-management/physical-count
url: /inventory-management/physical-count
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Physical Count — Stock Controller Journey

## Purpose / Use Case

The Store Manager runs a **full physical count** of stock, location by location, against a counting period. A count session is created for a **department** and (optionally) a **period**; counting then proceeds per location through three stages — **setup → entry → review/finalize**. During entry the user records the actual quantity for every item; on review the system compares actual vs. system quantity and surfaces variances; on finalize the location's count is **completed**. Data is scoped to the active business unit (**BU = BLAVG** in this suite).

---

## Screens & Steps

### Screen 1 — List (`/inventory-management/physical-count`)

**Purpose:** Pick a period, monitor per-location progress, and start/resume counts. Source: `page.tsx`, `_components/pc-component.tsx`, `_shared/pc-location-card.tsx`.

| Element | Description |
|---------|-------------|
| **Header** | Title "Physical Count" + description. |
| **Period selector** | Card showing the period name, "Ends: {date}" with a calendar icon, and a **CURRENT** (info) or **PREVIOUS** (secondary) badge; lets the user switch current/previous. Empty: "No active period found". |
| **KPI tiles** | All / In Progress / Not Started / Complete, each with a count; clicking a tile filters the location sections. |
| **Location search** | Filters by name/code, case-insensitive. |
| **Include Not Count** | Checkbox that adds not-countable locations to the list. |
| **Status sections** | In Progress (warning) / Not Started (info) / Complete (success); empty section shows "No locations in this status". |
| **Status hero card** | Right sidebar — "Check Progress" with a progress bar and done / in-progress / not-started counts plus "% Complete". |

**Location card** (`pc-location-card.tsx`): avatar, location name + code, **Count / Not count** badge, location type, a progress bar with "counted/total (percent%)", item count, and a status action button — **Start** (not started), **Resume** (in progress), or **"Done"** text (completed).

---

### Screen 2 — New / Edit Count Session (`.../new`, `.../{id}`)

**Purpose:** Create or edit a count session header. Source: `new/page.tsx`, `[id]/page.tsx`, `[id]/_content.tsx`, `_components/pc-form.tsx`, `_components/pc-general-fields.tsx`, `_components/pc-form-schema.ts`.

| Field | Required | Description |
|-------|----------|-------------|
| **Department** | Yes | Lookup (Building2 icon). Validation: "Department is required". |
| **Physical Count Period** | No | Lookup (CalendarRange icon). |

**Actions:** Submit (create → `createSuccess`, redirect to list; edit → `updateSuccess`, back to view). **Cancel/Back while dirty** raises a discard dialog (warning variant). View mode offers **Delete** → **"Delete Physical Count"** dialog → `deleteSuccess` and redirect.

---

### Screen 3 — Entry (`.../{id}/entry`)

**Purpose:** Record actual counts per item. Source: `[id]/entry/page.tsx`, `_components/pc-entry-component.tsx`, `_components/pc-entry-header.tsx`, `_components/pc-entry-notes-dialog.tsx`, and shared `_shared/entry-toolbar.tsx`, `_shared/entry-item-row.tsx`, `_shared/entry-import-dialog.tsx`, `_shared/calculator-dialog.tsx`, `_shared/filter-pill.tsx`.

| Element | Description |
|---------|-------------|
| **Header** | "ENTRY" badge, location name + code, status badge, "counted/total" with percent, progress bar, and "Last Saved: HH:MM:SS". |
| **Search + Refresh** | Filter items by name/code/SKU/local name; refresh button reloads products. |
| **Filter pills** | All / Counted (success) / Uncounted (warning), each with a count. |
| **Actual Count input** | Per item; number, **min 0** (negative rejected). |
| **Calculator** | Per item; add qty+unit rows, see base-unit conversion, "Use This Total" pushes the total into Actual Count. |
| **Add notes & evidence** | Opens a notes dialog — note text + image upload (JPG/PNG/WebP, **≤ 3 MB**); saved note + thumbnails show under the item (oversized/non-image rejected). |
| **COUNTED badge** | Shown once an item has an actual quantity. |
| **Import** | Dialog accepting .xlsx/.xls/.csv; required columns include `id`, `product_sku`, `actual_qty` (plus product code/name/local name/unit); shows preview total/matched/skipped; **"Apply Import"** fills matched items (`importSuccess`). Missing columns → error, Apply disabled. |
| **Export** | Downloads `physical-count-{location}-{date}.xlsx` (columns id/product/sku/unit/actual_qty); `exportSuccess`. |
| **Bottom bar** | If uncounted > 0: **"Set empty to zero (N items)"** + **"Save for Resume"**. If uncounted = 0: **"Submit for Review"** → `.../{id}/review` (entry locks). |

---

### Screen 4 — Review (`.../{id}/review`)

**Purpose:** Inspect variances and finalize. Source: `[id]/review/page.tsx`, `[id]/review/_content.tsx`, `_components/pc-review-component.tsx`, shared `_shared/review-component.tsx`, `_shared/review-stat-tile.tsx`, `_shared/variance-grid.tsx`.

**Stat tiles:** **Matches** (diff = 0, success), **Variances** (diff ≠ 0, warning), **Overages** (diff > 0, success), **Shortages** (diff < 0, destructive).

**Variance grid** columns:

| Column | Description |
|--------|-------------|
| Product | Code badge + name (+ local name). |
| System | `on_hand_qty`. |
| Actual | `actual_qty` ("—" if null). |
| Variance | `diff_qty` — green with "+" when > 0, red when < 0. |
| Unit | `inventory_unit_name`. |

No-variance state: "No variances — all counts match the system". **"Submit physical count"** finalizes → `completed`, redirect to list.

> **BU dependence:** Locations, count sessions, and entry data are scoped to the active business unit (**BU = BLAVG** in this suite). Per the System Process docs, the count must reach **Finalized** (GL posted) to satisfy End Period Close Stage 3.

---

## Linked Test Cases

`docs/test-cases/750-physical-count.md` (prefix `PCNT`, 30 cases). User stories: `docs/user-stories/750-physical-count.md`.

- **List / period / tiles / smoke:** TC-PCNT-010001..010008, 010050
- **Create / edit / delete:** TC-PCNT-030001, 030002, 030003, 030050, 040001, 050001
- **Entry:** TC-PCNT-060001..060007
- **Review / finalize:** TC-PCNT-070001, 070002, 070003, 070004
- **Import / export:** TC-PCNT-080001, 080002, 900001
- **Authorization / guard:** TC-PCNT-100001, 100002
- **Validation:** TC-PCNT-200001, 200002

System-process counterpart: [tx-08-physical-stocktake.md](../System%20Process/tx-08-physical-stocktake.md).
