---
title: System Period — Platform Administrator Journey
persona: Platform Administrator
route: /system-admin/period
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# System Period — Platform Administrator Journey

> The control surface for fiscal/accounting periods. The Platform Administrator creates periods, sets their open/closed/locked state, generates periods ahead, and exports the schedule.

---

## Purpose / Use Case

Accounting periods define the fiscal windows that transactions post into. The administrator opens periods for posting, **closes** them when a month ends, and **locks** them to seal against any further change. Periods can be created one at a time via a dialog, or generated in bulk (next 12) with **Generate Next**. The list also supports status filtering, search, export and print, with a mobile card layout.

Grounded in `routes/system-admin/period/` (`page.tsx`, `_components/period-component.tsx`, `period-dialog.tsx`, `period-form-schema.ts`, `use-period-table.tsx`, `period-card.tsx`).

---

## Screens & Steps

### Screen 1 — Period List

**Purpose:** Browse, search, filter and act on accounting periods. Desktop renders a DataGrid; mobile renders `PeriodCard`s with infinite scroll.

| Column | Description |
|--------|-------------|
| **Period** | Period code, rendered as a `CellAction` — clicking it opens the edit dialog. Centered. |
| **Fiscal Year** | Fiscal year number. Centered. |
| **Fiscal Month** | Fiscal month (1–12). Centered. |
| **Start At** | Period start date, formatted to the user's `dateFormat`. |
| **End At** | Period end date, formatted to the user's `dateFormat`. |
| **Status** | Badge colored per `PERIOD_STATUS_CONFIG` — Open / Closed / Locked. Centered. |

**Actions**
- **Add** (Plus) → opens the Add/Edit dialog in create mode (Screen 2).
- **Generate Next** (CalendarPlus) → calls generate-next with `count=12, start_day=1`; success toast and new periods appear.
- **Export** (Download) → exports Period / Fiscal Year / Fiscal Month / Start / End / Status; success toast with row count, or `exportNoData` warning when the filtered set is empty.
- **Print** (Printer) → calls `window.print()`.
- **Search** input → filters the list.
- **Status filter** (Open / Closed / Locked) → narrows the list and shows an active-filter badge; **Clear all** in the ActiveFilterBar resets it.
- **Total badge** beside the title → record count in locale format; hidden when total = 0.

On mobile the Generate Next / Export / Print actions move into a "more actions" dropdown, and the status filter moves into a bottom sheet.

**Validation / notes:** No-match search shows an EmptyComponent.

---

### Screen 2 — Add / Edit Period Dialog

**Purpose:** Create a new period or edit an existing one. Opened by **Add** (create) or by clicking a Period cell (edit, pre-filled). Title reads "Add" or "Edit".

| Field | Description | Validation |
|-------|-------------|------------|
| **Fiscal Year** | Numeric year (e.g. `27`). | `coerce.number().min(1)` — required. |
| **Fiscal Month** | Numeric month, input bounded `min=1 max=12`. | `min(1)` / `max(12)` — month must be 1–12. |
| **Start At** | DatePicker for the period start. | required (`min(1)`). |
| **End At** | DatePicker for the period end. | required; zod `refine` requires `end_at >= start_at` ("end date after start"). |
| **Status** | Select: Open / Closed / Locked. Defaults to **Open** on create. | enum `open \| closed \| locked`. |

**Actions**
- **Create** (create mode) → on success, create toast and dialog closes; new period appears in the table. Shows "Creating…" while pending.
- **Save** (edit mode) → `doc_version` round-trips for optimistic-concurrency; success toast and dialog closes; updated values appear. Shows "Saving…" while pending.
- **Cancel** → closes the dialog without saving; the period's row stays unchanged.

**Validation / notes:** Each field shows an inline `FieldError`. The dialog cannot be dismissed while a mutation is pending. Editing the **Status** field is how a period is closed (Open → Closed) or locked.

---

## Authorization

- Users without System Admin permission are blocked from the period page (forbidden or redirect away).
- Unauthenticated direct access to `/system-admin/period` redirects to `/login`.

---

## Linked Test Cases

See `docs/user-stories/1105-system-period.md` (catalog `docs/test-cases/1105-system-period.md`, prefix `SPER`).

| Area | Test cases |
|------|-----------|
| List, search, filter | TC-SPER-010001 – TC-SPER-010007 |
| Open edit dialog | TC-SPER-020001 |
| Create | TC-SPER-030001 – TC-SPER-030003 |
| Edit & status transitions (close / lock) | TC-SPER-040001 – TC-SPER-040004 |
| Generate Next | TC-SPER-050001 |
| Authorization / Auth-guard | TC-SPER-100001 – TC-SPER-100002 |
| Validation | TC-SPER-200001 – TC-SPER-200005 |
| Export / Print | TC-SPER-300001 – TC-SPER-300003 |
| Mobile card list | TC-SPER-900001 |
