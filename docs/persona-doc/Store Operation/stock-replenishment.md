---
title: Stock Replenishment — Store Manager Journey
persona: Store Manager
route: routes/store-operation/stock-replenishment
url: /store-operation/stock-replenishment
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Stock Replenishment — Store Manager Journey

## Purpose / Use Case

Stock Replenishment is a **read-only summary dashboard**. It surfaces every product that has fallen below its par level, grouped by storage location, with a severity status (critical / warning / low) and a calculated **need** quantity per item. The Store Manager scans the dashboard, selects the items that need topping up — across one or several locations — and fans the selection out into either a **Purchase Request** (reorder from a vendor) or a **Store Requisition** (pull stock internally).

The screen creates no document of its own: it has no add/edit/delete. Its only writes are the downstream PR / SR create flows seeded by the selected items. Data is scoped to the active Business Unit (**BLAVG** in test); the data hook (`useStockReplenishment`) binds its query key to `buCode` and does not fetch until the BU is ready. The current data source is mock data, pending the real backend.

---

## Screens & Steps

### Screen 1 — Stock Replenishment Dashboard (`/store-operation/stock-replenishment`)

**Purpose:** A single page combining a summary bar, a search box, expand/refresh controls, and a list of collapsible location panels — each holding a table of below-par items with selection checkboxes.

#### Summary bar

A compact bar derived from the (search-filtered) data:

| Metric | Description |
|--------|-------------|
| nLocations | Count of locations currently shown. |
| nItems | Total below-par items across shown locations. |
| critical (badge, destructive) | Count of items with status `critical`. |
| warning (badge, warning) | Count of items with status `warning`. |
| low (badge, secondary) | Count of items with status `low`. |
| totalNeed | Sum of every item's `need` (the total quantity to replenish), formatted with thousands separators. |
| Expand All / Collapse All | Right-aligned toggle that opens or closes every shown location at once; label flips based on whether all are expanded. |

#### Toolbar / page actions

- **Search** (`SearchInput`) — case-insensitive; filters by product name, category, sub-category, or item group. Locations with no matching items are removed entirely; a no-match term hides all locations and zeroes the summary.
- **Refresh** — refetches the data without a full page reload.
- **Create PR** *(conditional)* — appears only when ≥ 1 item is selected; label shows the running selected count, e.g. `Create PR (3)`.
- **Create SR** *(conditional)* — same visibility rule; seeds a Store Requisition from the selected items.

#### Location panel (collapsible)

Each location header (`StockReplLocation`) shows a rotating chevron, the location name, an items-count badge, and critical / warning / low badges (each shown only when its count > 0). Clicking the header expands the item table; clicking again collapses it.

#### Item table (inside an expanded location)

| Column | Description |
|--------|-------------|
| (select) | Row checkbox. The header checkbox selects/clears all items in the location and shows an **indeterminate** state on partial selection. |
| # | Row index within the location. |
| สินค้า (product) | Product name. |
| หมวดหมู่ (category) | Product category name. |
| หมวดย่อย (sub-category) | Sub-category name. |
| กลุ่มสินค้า (item group) | Item group name. |
| current | Current on-hand quantity; right-aligned, tabular. |
| par level | Target par level; right-aligned, tabular. |
| need | Quantity to replenish (par level vs. current); right-aligned, **bold**. |
| สถานะ (status) | Severity badge: `critical` → destructive, `warning` → warning, `low` → secondary. |

**Selection behaviour:** selections are tracked per location but the toolbar count is the **sum across all locations**, so a manager can build one PR/SR spanning multiple storage areas. `getSelectedProducts` gathers every ticked product across locations when Create PR / Create SR is pressed. Clearing all checkboxes drops the count to 0 and removes both Create buttons.

**Empty state:** when nothing needs replenishing (or a search matches nothing), no location rows render, the summary reads 0 across the board, and the Create PR/SR buttons are absent.

---

## Linked Test Cases

Full catalog: `docs/test-cases/711-stock-replenishment.md` · User stories: `docs/user-stories/711-stock-replenishment.md` (prefix `SRPL`, 23 cases).

| Area | Test cases |
|------|-----------|
| Page load / summary bar | TC-SRPL-010001, TC-SRPL-010002 |
| Collapsible locations / expand-all | TC-SRPL-010003, TC-SRPL-010004, TC-SRPL-010005 |
| Item columns | TC-SRPL-010006 |
| Search | TC-SRPL-010007, TC-SRPL-010008 |
| Refresh | TC-SRPL-010009 |
| BU scope (BLAVG) | TC-SRPL-010050 |
| Status badges / need value | TC-SRPL-020001, TC-SRPL-020002 |
| Selection (single / all / indeterminate / cross-location / clear) | TC-SRPL-060001, TC-SRPL-060002, TC-SRPL-060003, TC-SRPL-060004, TC-SRPL-060006 |
| Create PR / SR buttons | TC-SRPL-060005, TC-SRPL-300001, TC-SRPL-300002 |
| Authorization / auth-guard | TC-SRPL-100001, TC-SRPL-100002 |
| Empty state | TC-SRPL-900001 |

The **Create SR** action leads into the Store Requisition lifecycle — see `docs/persona-doc/System Process/tx-03-sr.md` and the automated spec `tests/701-sr.spec.ts`.
