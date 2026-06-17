---
title: Audit Logs (User Activity & Activity Log) — Platform Administrator Journey
persona: Platform Administrator
route: /system-admin/user-activity, /system-admin/activity-log
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Audit Logs — Platform Administrator Journey

> Two read-only audit surfaces. **User Activity** shows authentication events (login / logout) only; **Activity Log** shows every system change across entities (create / update / delete / login / logout). The Platform Administrator uses them to answer "who did what, when, and from where".

---

## Purpose / Use Case

Both views are strictly **read-only** — no create/edit/delete. They share the same record shape (`ActivityLog`), the same toolbar (search, filters, list/grid toggle, column visibility, export, print), the same default sort (`-created_at`, newest first), and a right-side detail sheet on row click.

The key difference is scope:
- **User Activity** pins its backend query to `entity_type=auth`, so it surfaces only login/logout records; its filters are **Action** (login/logout) and **User**.
- **Activity Log** is system-wide; it adds an **Entity Type** filter and its detail sheet surfaces **old_data / new_data** diffs for `update` events.

Grounded in `routes/system-admin/user-activity/` and `routes/system-admin/activity-log/` (`*-component.tsx`, `use-*-table.tsx`, `*-detail-sheet.tsx`, `*-card.tsx`).

---

## Screens & Steps

### Screen 1 — User Activity List

**Purpose:** Review login/logout events. Desktop list (DataGrid) or grid (cards, infinite scroll); mobile uses cards.

| Column | Description |
|--------|-------------|
| **Timestamp** | Date on top, `HH:mm:ss` time below; formatted to the user's `dateFormat`. |
| **Action** | Badge — `login` (in-progress color) / `logout` (draft color); other values fall back to muted. |
| **User** | Full name (first/middle/last) with username below; falls back to username or actor id, else `—`. |
| **Description** | Truncated description, `—` when empty. |
| **IP Address** | Source IP, `—` when empty. |
| **User Agent** | Truncated UA string, `—` when empty. |

**Actions**
- **Search** → filters records.
- **Action filter** (MultiSelect: Login / Logout) → narrows by action; shows active-filter badge(s).
- **User filter** (MultiSelect, searchable) → narrows by `actor_id`; shows the user's name as a badge.
- **Clear all** (ActiveFilterBar) → resets all filters.
- **List / Grid toggle** → switches layout (grid loads via infinite scroll).
- **Columns** (list view) → toggle column visibility (e.g. hide User Agent).
- **Export** (Download) → exports Date / Action / User / IP Address / Description; success toast with count, or `exportNoData` warning.
- **Print** (Printer) → `window.print()`.
- **Total badge** beside the title → record count; hidden when 0.

**Validation / notes:** Backend query is pinned to `entity_type=auth`. No-match search shows an EmptyComponent.

---

### Screen 2 — User Activity Detail Sheet

**Purpose:** Drill into a single login/logout event. Opens from the right on row click.

| Field | Description |
|-------|-------------|
| **Action badge + description** | Sheet header — colored action badge with the description (or default desc). |
| **Timestamp** | Full date-time (date format extended with `HH:mm:ss` if not already present). |
| **User** | Full name and username; `—` when neither present. |
| **IP Address** | Source IP, `—` when empty. |
| **User Agent** | Shown only when present. |
| **Metadata** | Pretty-printed JSON; the section is hidden when `meta_data` is empty. |

**Actions:** Close the sheet. (Read-only — no edit.)

---

### Screen 3 — Activity Log List

**Purpose:** Review system-wide changes across all entities. Same layout/toolbar pattern as User Activity, with an added Entity Type filter.

| Column | Description |
|--------|-------------|
| **Timestamp** | Date + `HH:mm:ss`, per user `dateFormat`. |
| **Action** | Badge colored per type — create (approved), update (pending), delete (destructive), login (in-progress), logout (draft); else muted. |
| **User** | Full name + username, with fallbacks. |
| **Entity Type** | Outline badge in Title Case (e.g. `purchase_order` → "Purchase Order"). |
| **Description** | Truncated; a tooltip shows the full text when it exceeds ~40 chars. `—` when empty. |
| **Entity ID** | First 8 characters of the id followed by an ellipsis; `—` when empty. |
| **IP Address** | Source IP, `—` when empty. |

**Actions**
- **Search** → filters records.
- **Action filter** (MultiSelect: Create / Update / Delete / Login / Logout).
- **Entity Type filter** (MultiSelect, searchable: Purchase Request, Purchase Order, Goods Received Note, Credit Note, Store Requisition, Inventory Transaction, Product, Vendor, Location, Department, Currency, Period, Auth).
- **User filter** (MultiSelect, searchable) → by `actor_id`.
- **Clear all** (ActiveFilterBar) → resets all filters (combine action + entity + user, then clear).
- **List / Grid toggle**, **Columns** (e.g. hide Entity ID), **Export**, **Print** — same as User Activity.
- **Export** columns: Date / Action / Entity Type / Entity ID / User / IP Address / Description; success toast with count or `exportNoData` warning.
- **Total badge** beside the title → record count; hidden when 0.

**Validation / notes:** No-match search shows an EmptyComponent.

---

### Screen 4 — Activity Log Detail Sheet

**Purpose:** Drill into a single change, including before/after data for updates. Opens from the right on row click.

| Field | Description |
|-------|-------------|
| **Action + Entity Type badges** | Sheet header. |
| **Timestamp** | Full date-time. |
| **User** | Full name and username. |
| **Entity Type** | Title-cased entity type. |
| **Entity ID** | Full entity id, `—` when empty. |
| **IP Address** | Source IP. |
| **User Agent** | Shown when present. |
| **Data Changes** | For `update` events: **Old Data** and **New Data** as pretty-printed JSON. |
| **Metadata** | Pretty-printed JSON; shown only when `meta_data` is present. |

**Actions:** Close the sheet. (Read-only — no edit.)

---

## Authorization

- Users without System Admin permission are blocked from both audit views (forbidden or redirect away).
- Unauthenticated direct access to `/system-admin/user-activity` or `/system-admin/activity-log` redirects to `/login`.

---

## Linked Test Cases

User Activity → `docs/user-stories/1106-user-activity.md` (catalog `docs/test-cases/1106-user-activity.md`, prefix `UACT`).
Activity Log → `docs/user-stories/1109-activity-log.md` (catalog `docs/test-cases/1109-activity-log.md`, prefix `ALOG`).

| Area | User Activity | Activity Log |
|------|---------------|--------------|
| List / columns / sort / search | TC-UACT-010001 – TC-UACT-010007 | TC-ALOG-010001 – TC-ALOG-010008 |
| Detail sheet | TC-UACT-020001 – TC-UACT-020003 | TC-ALOG-020001 – TC-ALOG-020003 |
| Filters (action / user / entity) | TC-UACT-040001 – TC-UACT-040003 | TC-ALOG-040001 – TC-ALOG-040004 |
| Authorization / Auth-guard | TC-UACT-100001 – TC-UACT-100002 | TC-ALOG-100001 – TC-ALOG-100002 |
| Export | TC-UACT-300001 | TC-ALOG-300001 |
