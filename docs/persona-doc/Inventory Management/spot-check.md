---
title: Spot Check — Stock Controller Journey
persona: Store Manager
route: routes/inventory-management/spot-check
url: /inventory-management/spot-check
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Spot Check — Stock Controller Journey

## Purpose / Use Case

A **Spot Check** is a targeted, partial count of selected products at one location — a lightweight alternative to a full physical count. The Store Manager picks a location, chooses one of three **methods** to decide which products to count — **Random** (a number of randomly sampled items), **High Value** (a number of items at or above a minimum value), or **Manual** (hand-picked products) — then follows the same **setup → entry → review/finalize** flow as physical count, with variance calculation. Data is scoped to the active business unit (**BU = BLAVG** in this suite; spot-check endpoints reference `buCode`).

> Per the System Process docs, **variance posting to inventory is currently PENDING** — a spot check reaches `completed` status (and satisfies End Period Close Stage 2) but does not yet post QOH / lot / cost changes.

---

## Screens & Steps

### Screen 1 — List: Locations / History (`/inventory-management/spot-check`)

**Purpose:** Start new checks per location and review past checks. Source: `page.tsx`, `_components/sc-component.tsx`, `_components/sc-location-card.tsx`, `_components/sc-history-card.tsx`, `_components/sc-resume-info-panel.tsx`, `_components/sc-reset-dialog.tsx`, `_components/sc-hero-stat.tsx`, `_components/sc-status-visual.ts`.

| Element | Description |
|---------|-------------|
| **View toggle** | "Locations" (MapPin, default) / "History" (History icon). |
| **KPI tiles** | All / Resume / Not Started, each with a count; clicking filters the list. |
| **Location search** | By name/code. |
| **Include Not Count** | Checkbox to include not-countable locations. |
| **Status hero** | "Check Progress" with totals (done / active). |

**Location card** — *Not started:* name + code, countable badge, location type, **Start** button (→ new spot check). *Resume:* a resume-info panel with spot-check doc no, status badge (pulsing dot for `in_progress`), method badge + icon, start date, progress "X / Y items", and **Resume** + **Reset** buttons (Reset opens a confirm dialog → clears counts back to `pending`, `resetSuccess`).

**History tab:** search + filters **Location / Status / Method** (multi-select); history cards show doc no, status + method badges, location, start/end dates, item count. Empty: "No spot checks found".

---

### Screen 2 — New Spot Check (`.../location/{location_id}`)

**Purpose:** Configure the check method and target items. Source: `location/[location_id]/page.tsx`, `location/[location_id]/_content.tsx`, `_components/sc-form.tsx`, `_components/sc-general-fields.tsx`, `_components/sc-method-picker.tsx`, `_components/sc-method-config.ts`, `_components/sc-product-transfer.tsx`, `_components/sc-product-panel.tsx`, `_components/sc-form-schema.ts`.

The **Location** field is locked to the selected location. A **method picker** offers three cards (selected card shows a checkmark + a per-method summary/tip):

| Method | Icon | Fields shown | Description |
|--------|------|--------------|-------------|
| **Random** | Shuffle | **Items** (number, ≥ 1) | System randomly samples the given number of products. |
| **High Value** | Gem | **Items** (≥ 1) + **Min Value** (≥ 0) | Samples high-value products at/above the threshold. |
| **Manual** | Hash | **Product transfer** | Hand-pick products. |

**Product transfer** (Manual): two panes — **Products Available** and **Products Selected** — each with a header select-all checkbox, search, a virtualized list, and a selected/total counter; checkboxes move products between panes; empty states for "no products" and "no search results".

Optional **Description** (Textarea, max 256). Actions: **Create** (→ `.../{id}` entry page, status `pending`) and **Cancel** (discard confirm if dirty).

**Validation** (`sc-form-schema.ts`):

- Random / High Value: **Items** required, ≥ 1.
- High Value: **Min Value** required, ≥ 0.
- Manual: at least one product — "Please select at least one product".
- Location required.

---

### Screen 3 — Detail / Edit (`.../{id}`)

**Purpose:** Review, edit, or delete a saved spot check. Source: `[id]/page.tsx`, `[id]/_content.tsx`.

View mode offers **Edit** and Print; edit mode offers **Save**, **Cancel**, and **Delete** (→ delete dialog → `deleteSuccess`). Editing description/parameters and saving returns to view with the updated values.

---

### Screen 4 — Entry (`.../{id}`)

**Purpose:** Count the selected items. Source: `_components/sc-entry-component.tsx`, `_components/sc-entry-header.tsx`, `_components/sc-entry-notes-dialog.tsx`, `_components/sc-doc-status-row.tsx`, shared `_shared/entry-toolbar.tsx`, `_shared/entry-item-row.tsx`, `_shared/calculator-dialog.tsx`, `_shared/filter-pill.tsx`.

| Element | Description |
|---------|-------------|
| **Header** | "Entry" badge, location name + code, status badge (pulsing dot when `pending`/`in_progress`), "X / Y" + "Z% Complete", progress bar, method + start date. |
| **Search + Refresh** | Filter items by name/code/SKU. |
| **Filter pills** | All / Counted (success) / Uncounted (warning) with counts. |
| **Count input** | Per item; commit-on-change; calculator for unit conversion. |
| **Notes / evidence** | Per-item dialog (note + image attachments). |
| **Import / Export** | Toolbar buttons (shared entry toolbar). |
| **Bottom bar** | If uncounted > 0: **"Set N Empty to Zero"** + **"Save For Resume"** (saves counted items, redirect to list). When uncounted = 0 the button becomes **"Submit For Review"** → `.../{id}/review`. |

---

### Screen 5 — Review (`.../{id}/review`)

**Purpose:** Inspect variances and finalize. Source: `[id]/review/page.tsx`, `[id]/review/_content.tsx`, `_components/sc-review-component.tsx`, shared `_shared/review-component.tsx`, `_shared/variance-grid.tsx`.

**Stat tiles:** Matches / Variances / Overages / Shortages.

**Variance grid** columns: **Product** (code badge + name + local name), **System Qty**, **Actual Qty**, **Variance** (`diff_qty` — green when positive, red when negative), **Unit**. No-variance state shows a success "No variances found" box.

**"Submit Spot Check"** finalizes → `doc_status = completed` (green badge, no pulse), `Submit Success` toast, redirect to list.

> **BU dependence:** Locations and spot checks are scoped to the active business unit (**BU = BLAVG** in this suite).

---

## Linked Test Cases

`docs/test-cases/760-spot-check.md` (prefix `SPC`, 30 cases). User stories: `docs/user-stories/760-spot-check.md`.

- **List / views / tiles / smoke:** TC-SPC-010001..010008, 010050
- **Create (3 methods):** TC-SPC-030001, 030002, 030003, 030004, 030005, 030006, 030050
- **Edit / delete:** TC-SPC-040001, 050001
- **Entry:** TC-SPC-060001, 060002, 060003, 060004, 060005, 060006
- **Review / finalize:** TC-SPC-070001, 070002, 070003
- **Authorization / guard:** TC-SPC-100001, 100002
- **Validation:** TC-SPC-200001, 200002, 200003

System-process counterpart: [tx-10-spot-check.md](../System%20Process/tx-10-spot-check.md).
