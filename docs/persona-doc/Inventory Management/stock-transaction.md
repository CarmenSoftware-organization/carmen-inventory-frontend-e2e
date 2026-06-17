---
title: Stock Transaction / Movement — Stock Controller Journey
persona: Inventory Controller
route: routes/inventory-management/transaction
url: /inventory-management/transaction
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Stock Transaction / Movement — Stock Controller Journey

## Purpose / Use Case

This is a **read-only stock ledger**. The Inventory Controller uses it to see every inventory movement across the active business unit — how quantity on hand changed, the source document that drove it (GRN, Store Requisition, Stock In/Out adjustment, Credit Note, Physical Count, etc.), and the cost impact. There is **no create / edit / delete**; the journey is browse → filter → read summary totals. Data is scoped to the active business unit (**BU = BLAVG** in this suite); the fetch hook reads `buCode` and does not query until it is set.

---

## Screens & Steps

### Screen 1 — Transaction Ledger (`/inventory-management/transaction`)

**Purpose:** View, filter, and summarize stock movements. Source: `page.tsx`, `_components/transaction-component.tsx`, `_components/transaction-summary.tsx`, `_components/date-range-filter.tsx`, `_components/use-transaction-table.tsx`.

**Header:** `ArrowRightLeft` icon, title **"Transaction"**, description **"View transaction history."**

**Summary cards** (`transaction-summary.tsx`) — four animated cards across the top:

| Card | Description |
|------|-------------|
| **Total Transactions** | Count (locale-formatted); subtitle "{n} adjustments". Primary tone. |
| **Total Inbound** | Currency value; subtitle "{n} units received". Success (green) tone. |
| **Total Outbound** | Currency value (red text); subtitle "{n} units issued". Destructive tone. |
| **Net Change** | Signed currency; subtitle "{n} units net". **Color logic:** ≥ 0 → green/success, < 0 → red/destructive. |

Summary totals recompute against whatever filter set is active, and Net Change = Inbound − Outbound.

**Table columns** (`use-transaction-table.tsx`)

| Column | Description |
|--------|-------------|
| Date | `audit.created.at`, formatted; **sortable** (primary sort column, toggles asc/desc). |
| Type | Document-type **Badge** (see variant map below). |
| Parent Doc No | `parent_document_no`, or "-" when null. |
| Product | Deduped, comma-joined `details[].product_name`. |
| Location | Deduped, comma-joined `details[].location_name`. |
| Qty In | Sum of `details[].qty_in`; **green** when > 0, "-" when 0. |
| Qty Out | Sum of `details[].qty_out`; **red/destructive** when > 0, "-" when 0. |
| Items | Count of `details[]`. |
| Total | Sum of `details[].total_cost`, currency-formatted. |

**Type badge variants** (verbatim from `use-transaction-table.tsx`):

| Doc type | Label | Badge variant |
|----------|-------|---------------|
| Stock In (`stock_in`) | SI | info |
| Stock Out (`stock_out`) | SO | warning |
| Goods Received Note (`good_received_note`) | GRN | success |
| Store Requisition (`store_requisition`) | SR | invert |
| Credit Note (`credit_note`) | CN | destructive |
| Purchase Request (`purchase_request`) | PR | secondary |
| Purchase Order (`purchase_order`) | PO | default |

**Filters** (`date-range-filter.tsx` + lookups, all persisted in URL state)

| Filter | Description |
|--------|-------------|
| **Date range presets** | Segmented buttons "Today" / "7 Days" / "30 Days" / "This Month" (build a `created_at|daterange:...`). Clicking the active preset again clears it. |
| **Location** | Single-select `LookupLocation`, placeholder "All Locations" → `location_id`. |
| **Category** | Single-select `LookupCategory`, placeholder "All Categories" → `category_id`. |
| **Reference Type** | Multi-select glass pills GRN / SR / SI / SO / PC → `inventory_doc_type|in:...`. |
| **Active filter bar + Clear All** | Removable chips for each active filter; Clear All resets everything. |
| **Mobile filter sheet** | Filter-icon button opens a bottom sheet with date range, location/category, ref-type pills, and a **Done** button; the trigger shows a badge counting active filters. |
| **Search** | `SearchInput` (glass), filters rows and updates URL state. |

**Other states:** column skeletons while loading; `ErrorState` with a **Retry** button (calls `refetch`); `EmptyComponent` when no rows match.

> **BU dependence:** `useTransaction()` reads `buCode` via `useBuCode()`, keys the query by it, and is `enabled: !!buCode` — no fetch until the active BU (BLAVG) is set. Cache is short-lived (`CACHE_DYNAMIC`, ~1 min stale) because the ledger changes frequently.

---

## Linked Test Cases

`docs/test-cases/740-stock-transaction.md` (prefix `STKT`, 21 cases). User stories: `docs/user-stories/740-stock-transaction.md`.

- **List / smoke:** TC-STKT-010001, 010002, 010003, 010050
- **Summary cards:** TC-STKT-010060, 010061, 030002
- **Search / sort / pagination:** TC-STKT-010004, 010005, 010006, 010007
- **Filters:** TC-STKT-020001, 020002, 020003, 020004, 020005, 020006, 020007
- **Qty direction colors:** TC-STKT-030001
- **Authorization / guard:** TC-STKT-100001, 100002
- **Error state:** TC-STKT-900001

This module is the read side of the movements produced by the other Inventory Management journeys; the system-process docs describe how each transaction posts ([System Process INDEX](../System%20Process/INDEX.md)).
