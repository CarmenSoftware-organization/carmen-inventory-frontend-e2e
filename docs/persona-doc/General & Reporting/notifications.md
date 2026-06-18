---
title: Notifications — Read, Open and Clear My Alerts
persona: Any Authenticated User
route: routes/notifications
url: /notifications
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Notifications — Read, Open and Clear My Alerts

## Purpose / Use Case

The Notifications page (`/notifications`) is the signed-in user's **personal alert inbox**,
rendered as a flat, dense list (thin separators, no card shadows). A header shows a bell
icon, a total-count badge, and an unread count. Each row shows a title, message, and time;
unread rows are visually emphasised.

Notification rows behave one of two ways depending on their data:

- **With an internal link** (e.g. a PR/PO document) — the whole row is a `<Link>`; clicking
  navigates to the source document.
- **Without a link** — the row is a button; clicking opens the **NotificationDetailDialog**
  (full title, type badge, time, message, and an **Open** button for external links).

Marking notifications read (single or all) is done from the **bell popover in the navbar**
(a REST `PUT`), and the `/notifications` page reflects the updated state. The page also
handles loading (skeleton), error, and empty states.

---

## Screens & Steps

### Screen 1 — Notifications inbox (`/notifications`)

**Purpose:** Let the user scan all their alerts and spot what is unread.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Header bell + title | Bell icon and "Notifications" heading | — | — |
| Total-count badge | Number of all notifications | — | Shown only when `items.length > 0` (`items.length`) |
| Unread indicator | Colored dot + unread count, right-aligned | — | Shown only when `unreadCount > 0`; hidden when nothing is unread |
| Notification row | Per-item: title, message (clamped), relative/locale time | Click | Unread rows get `bg-primary/[0.07]` and an unread label |
| Linked row | Row whose notification resolves an internal href | Click -> navigate | Renders as a `<Link>` to the source document (href via `getNotificationHref` + `safeNavigationHref`) |
| Link-less row | Row with no internal link | Click -> open detail dialog | Renders as a button that opens NotificationDetailDialog |
| Loading state | Skeleton while the list loads | — | `NotificationLoader` |
| Error state | Error message when the list fails | — | Message shown; the page does not crash |
| Empty state | Shown when there are no notifications | — | `BellOff` icon with title and description |

### Screen 2 — Notification detail dialog (overlay)

**Purpose:** Show the full content of a link-less notification.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Title | Notification title | — | — |
| Type badge | Notification type | — | — |
| Created time | When it was created | — | — |
| Message | Full message text | — | `whitespace-pre-wrap` (preserves line breaks) |
| Open button | For notifications with an external link | Click -> follow link | `ExternalLink` icon; navigates to the destination and closes the dialog |

### Screen 3 — Bell popover (navbar — mark read)

**Purpose:** Let the user clear unread alerts from anywhere in the app.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Bell popover | Opens from the navbar bell | Open | — |
| Mark as read (single) | Per-item read action | Click -> `PUT` | Item becomes read, unread count drops; `/notifications` reflects it |
| Mark all read | Bulk read action | Click -> `PUT` | All items become read, unread count is 0, row highlights clear |

---

## Linked Test Cases

| TC | Title |
|----|-------|
| TC-NTFY-010001 | หน้า Notifications โหลดและแสดงรายการ |
| TC-NTFY-010002 | header แสดง badge นับจำนวนรวม |
| TC-NTFY-010003 | header แสดงตัวเลขนับ unread |
| TC-NTFY-010004 | แถว unread มีพื้นหลังเน้นและป้าย unread |
| TC-NTFY-010005 | แต่ละแถวแสดง title / message / เวลา |
| TC-NTFY-020001 | คลิกแถวที่มี internal link นำไปหน้าต้นทาง |
| TC-NTFY-020002 | คลิกแถวที่ไม่มี link เปิด NotificationDetailDialog |
| TC-NTFY-020003 | detail dialog แสดง title / type / เวลา / message |
| TC-NTFY-020004 | detail dialog มีปุ่ม Open สำหรับ external link |
| TC-NTFY-040001 | mark as read เดี่ยวจาก popover กระดิ่ง |
| TC-NTFY-040002 | mark all as read จาก popover กระดิ่ง |
| TC-NTFY-090001 | empty state เมื่อไม่มีการแจ้งเตือน |
| TC-NTFY-090002 | สถานะ error เมื่อโหลดรายการล้มเหลว |
| TC-NTFY-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login |
