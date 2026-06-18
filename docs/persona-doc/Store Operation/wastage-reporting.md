---
title: Wastage Reporting — Store Manager Journey
persona: Store Manager
route: routes/store-operation/wastage-reporting
url: /store-operation/wastage-reporting
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Wastage Reporting — Store Manager Journey

## Purpose / Use Case

The Store Manager uses Wastage Reporting to record stock that can no longer be sold or used — spoilage, breakage, expiry, or preparation loss — at a specific location, with a reason and a list of affected products. Each report (a **WR**) carries a status (pending / approved / rejected) and a system-calculated **loss value**, giving the business an auditable record of write-offs scoped to the active Business Unit (**BLAVG** in test).

A typical session: open the list, scan recent reports, create a new WR for today's loss with one or more line items, and submit it for approval. Existing reports can be reopened for view, edited while still editable, or deleted.

---

## Screens & Steps

### Screen 1 — Wastage Report List (`/store-operation/wastage-reporting`)

**Purpose:** Entry point. A searchable, status-filterable DataGrid of all WRs for the active BU, with the Add action to start a new report.

**Key columns**

| Column | Description |
|--------|-------------|
| WR No | Document number; rendered as a clickable cell that opens the detail/view page. |
| สถานที่ (location) | Name of the location where the wastage occurred. |
| วันที่ (date) | Report date, formatted to the user's profile date format. |
| จำนวนรวม (totalQty / `qty_sum`) | Sum of line-item quantities; right-aligned, tabular. |
| มูลค่าเสียหาย (lossValue / `loss_value`) | Calculated loss value, formatted as currency; right-aligned. |
| ผู้รายงาน (reporter) | Name of the person who filed the report. |
| สถานะ (status) | Status badge (pending / approved / rejected), colour-coded. |

**Toolbar & actions**

- **Search** (`SearchInput`) — fires on Enter; matches WR No, location, reason, or reporter name.
- **Status filter** (`StatusFilter`) — filter by pending / approved / rejected; clearing restores all rows.
- **Add** (`+`) — top-right; navigates to `/store-operation/wastage-reporting/new`.
- **Pagination** — DataGrid pager at the foot of the table.
- **Row delete** — action column with a Delete dialog (shows the WR No before confirming).

**Empty / error states:** a no-match search renders an empty component; a load error renders an `ErrorState` with a retry.

---

### Screen 2 — Wastage Report Form: New / View / Edit

One form component (`WastageReportForm`) drives three modes:
- **add** — `/store-operation/wastage-reporting/new` (no document loaded)
- **view** — `/store-operation/wastage-reporting/{id}` (loads with fields disabled, shows an **Edit** button)
- **edit** — toggled from view via **Edit** (fields enabled, shows Save / Cancel / Delete)

**Purpose:** Capture or amend the header (reporter, date, location, reason) and the list of wasted line items.

**Header fields**

| Field | Description | Validation |
|-------|-------------|------------|
| Reporter (`reporter`) | Auto-filled from the logged-in user's profile (`profile.user_info.firstname + lastname`); read-only. | — |
| Date (`date`) | DatePicker for the wastage date. Disabled in view mode. | Required. |
| Location (`location_id`) | `LookupLocation` selector for the affected location. Disabled in view mode. | Required. |
| Reason (`reason`) | Free-text Textarea (max 256 chars) describing the cause. Disabled in view mode. | Required (non-empty). |

**Items section** — `WrItemFields` renders a heading with a live count `Items (n)`, an **Add Item** button, and a DataGrid of line items. New items are **prepended** (added to the top).

| Item column | Description | Validation |
|-------------|-------------|------------|
| สินค้า (product) | `LookupProduct`; selecting a product auto-fills its name, code, and default inventory unit. | `product_id` required. |
| qty | Quantity wasted (numeric input). | Coerced number, minimum 1. |
| unit (`unit_id`) | `LookupProductUnit`, filtered by the chosen product; disabled until a product is picked. | `unit_id` required. |
| unitCost (`unit_cost`) | Cost per unit. | Coerced number, minimum 0. |
| lossValue | Per-row loss (qty × unit cost), formatted as currency; read-only derived value. | — |
| (delete) | Per-row remove button → opens a Remove dialog describing the row before confirming. | — |

**Form actions**

| Action | Available in | Result |
|--------|--------------|--------|
| Save | add, edit | Validates; on success shows `createSuccess` (add) or `updateSuccess` (edit) toast and navigates back to the list. On validation failure the form is not submitted and focus scrolls to the first invalid field (`scrollToFirstInvalidField`). |
| Cancel | add, edit | In **add**: navigates back to the list without saving. In **edit**: resets the form to original values and returns to **view** mode (no navigation). |
| Edit | view | Switches the form to edit mode. |
| Delete (destructive) | edit | Opens a Delete dialog (shows the WR No); on confirm shows `deleteSuccess` toast and navigates back to the list. |

**Validation summary:** the Zod schema (`createWrSchema`) enforces required date / location / reason, and for each item: product required, unit required, qty ≥ 1, unit cost ≥ 0.

---

## Linked Test Cases

Full catalog: `docs/test-cases/710-wastage-reporting.md` · User stories: `docs/user-stories/710-wastage-reporting.md` (prefix `WAST`, 26 cases).

| Area | Test cases |
|------|-----------|
| List load / columns / Add | TC-WAST-010001, TC-WAST-010002, TC-WAST-010003 |
| Search / filter / pagination | TC-WAST-010004, TC-WAST-010005, TC-WAST-010006, TC-WAST-010007 |
| BU scope (BLAVG) | TC-WAST-010050, TC-WAST-030050 |
| Detail / view mode | TC-WAST-020001, TC-WAST-020002 |
| Create | TC-WAST-030001, TC-WAST-030002, TC-WAST-030003, TC-WAST-030004, TC-WAST-030005, TC-WAST-030006 |
| Edit / cancel | TC-WAST-040001, TC-WAST-040002 |
| Delete | TC-WAST-050001, TC-WAST-050002 |
| Authorization / auth-guard | TC-WAST-100001, TC-WAST-100002 |
| Validation | TC-WAST-200001, TC-WAST-200002 |
| Mobile | TC-WAST-900001 |

See also the transaction-process view: `docs/persona-doc/System Process/tx-11-wastage-report.md`.
