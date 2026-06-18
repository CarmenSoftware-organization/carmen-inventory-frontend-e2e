---
title: Dashboard — Personal Saved Widgets
persona: Any Authenticated User
route: routes/dashboard
url: /dashboard
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Dashboard — Personal Saved Widgets

## Purpose / Use Case

The Dashboard (`/dashboard`) is each user's **personal landing board** after login. It is
**not** a business-unit-wide dashboard — it shows a time-of-day greeting addressed to the
signed-in user plus a grid of **Saved Widgets** that the user pins for themselves.

A user comes here to:

- get a quick, personalised "good morning/afternoon/evening, _name_" framing with today's date;
- glance at the metrics they personally pinned (KPI numbers, pie breakdowns);
- curate that board over time — add a widget from the dataset lookup, drag to reorder,
  or remove one they no longer want.

Widget data is sourced from datasets. Each saved widget renders according to its dataset
`shape`: `scalar` / `scalar_delta` → a KPI card, `categorical` → a pie card; anything else
falls back to an "unsupported" card. The board is empty for a brand-new user, who is shown
a guided empty state.

---

## Screens & Steps

### Screen 1 — Greeting header

**Purpose:** Confirm a successful, personalised entry point and orient the user in time.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Eyebrow (`brief · <date>`) | Small label above the heading showing the word "brief" and today's date | — | Date is formatted with `formatLocalizedDate` using the active locale; shows `—` until the client clock resolves |
| Greeting heading | `<greeting>, <full name>` | — | Greeting is `morning` (hour < 12), `afternoon` (12–17), or `evening` (≥ 18). Name is firstname + lastname from the profile; falls back to a generic `fallbackName` when absent |

### Screen 2 — Saved Widgets section

**Purpose:** Show the user's pinned metrics and let them curate the board.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Section header + count | "Saved Widgets" label with a numeric `count` badge | — | Count reflects `data.count` from the widget list response |
| `+ เพิ่ม` lookup (LookupDataset) | Dataset picker to pin a new widget | Pick a dataset → creates a widget | Restricted to supported shapes (`scalar`, `scalar_delta`, `categorical`); datasets already pinned are excluded; disabled while a create is pending; success/error toast |
| Widget grid | Responsive grid (1 / 2 / 4 columns) of saved widget cards, ordered by `order_index` ascending | Drag to reorder; hover → trash to delete | KPI card for scalar shapes, Pie card for categorical, Unsupported card otherwise |
| Drag handle (GripVertical) | Reorder handle on each card | Drag-and-drop (pointer or keyboard sensor) | Reorder is optimistic (cache updated immediately); only changed `order_index` values are PATCHed; new indices step by 10 |
| Delete button (Trash2) | Per-widget remove control | Click → opens DeleteDialog → Confirm | DeleteDialog shows widget title/dataset; success/error toast; widget leaves the grid on success |
| Empty state | Shown when the user has no saved widgets (after loading) | — | Title, description, and KPI / Pie / Bar hint chips guiding the user to add widgets |
| Error message | Shown when the widget list request fails | — | `role="alert"` with the `loadError` message; the page does not crash |

---

## Linked Test Cases

| TC | Title |
|----|-------|
| TC-DASH-010001 | หน้า Dashboard โหลดสำเร็จและแสดงคำทักทาย |
| TC-DASH-010002 | คำทักทายแสดงชื่อผู้ใช้จาก profile |
| TC-DASH-010003 | คำทักทายเปลี่ยนตามช่วงเวลา (เช้า/บ่าย/เย็น) |
| TC-DASH-010004 | วันที่ปัจจุบันแสดงใน eyebrow |
| TC-DASH-010005 | รายการ Saved Widgets โหลดและแสดง widget ที่บันทึกไว้ |
| TC-DASH-010006 | badge นับจำนวน widget แสดงค่าถูกต้อง |
| TC-DASH-010007 | widget เรียงตาม order_index จากน้อยไปมาก |
| TC-DASH-020001 | widget shape scalar render เป็น KpiCard |
| TC-DASH-020002 | widget shape categorical render เป็น PieCard |
| TC-DASH-020003 | shape ที่ไม่รองรับแสดง UnsupportedCard |
| TC-DASH-030001 | เพิ่ม widget ใหม่จาก dataset lookup |
| TC-DASH-040001 | ลากจัดเรียง widget แล้วบันทึกลำดับใหม่ |
| TC-DASH-050001 | ลบ widget ผ่าน DeleteDialog |
| TC-DASH-090001 | empty state เมื่อยังไม่มี widget ที่บันทึกไว้ |
| TC-DASH-090002 | สถานะ error เมื่อโหลดรายการ widget ล้มเหลว |
| TC-DASH-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login |
