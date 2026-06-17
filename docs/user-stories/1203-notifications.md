# Notifications — User Stories

_Authored from the test-case catalog `docs/test-cases/1203-notifications.md` (documentation only — no automated spec yet)._

**Module:** Notifications
**Frontend route:** `routes/notifications`  •  **URL:** `/notifications`
**Prefix:** `NTFY`
**Default role:** Any authenticated user
**Total test cases:** 14

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-NTFY-010001 | หน้า Notifications โหลดและแสดงรายการ | High | Smoke |
| TC-NTFY-010002 | header แสดง badge นับจำนวนรวม | Low | Functional |
| TC-NTFY-010003 | header แสดงตัวเลขนับ unread | Medium | Functional |
| TC-NTFY-010004 | แถว unread มีพื้นหลังเน้นและป้าย unread | Medium | Functional |
| TC-NTFY-010005 | แต่ละแถวแสดง title / message / เวลา | Medium | Functional |
| TC-NTFY-020001 | คลิกแถวที่มี internal link นำไปหน้าต้นทาง | High | Functional |
| TC-NTFY-020002 | คลิกแถวที่ไม่มี link เปิด NotificationDetailDialog | High | Functional |
| TC-NTFY-020003 | detail dialog แสดง title / type / เวลา / message | Medium | Functional |
| TC-NTFY-020004 | detail dialog มีปุ่ม Open สำหรับ external link | Low | Functional |
| TC-NTFY-040001 | mark as read เดี่ยวจาก popover กระดิ่ง | Medium | Functional |
| TC-NTFY-040002 | mark all as read จาก popover กระดิ่ง | Medium | Functional |
| TC-NTFY-090001 | empty state เมื่อไม่มีการแจ้งเตือน | Medium | Edge Case |
| TC-NTFY-090002 | สถานะ error เมื่อโหลดรายการล้มเหลว | Medium | Negative |
| TC-NTFY-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-NTFY-010001 — หน้า Notifications โหลดและแสดงรายการ
> **As an** authenticated user, **I want** the notifications page to load my alerts, **so that** I can review what needs my attention.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ระบบรับรองแล้ว; มีการแจ้งเตือนอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/notifications`
2. รอ loader หาย
**Expected**
URL ตรงกับ `/notifications`, แสดงหัวข้อ Notifications และรายการแจ้งเตือนแบบ flat list

---
## TC-NTFY-010002 — header แสดง badge นับจำนวนรวม
> **As an** authenticated user, **I want** a total-count badge in the header, **so that** I know how many notifications I have.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดู badge ข้างหัวข้อ
**Expected**
badge แสดงจำนวนการแจ้งเตือนทั้งหมด (items.length)

---
## TC-NTFY-010003 — header แสดงตัวเลขนับ unread
> **As an** authenticated user, **I want** to see how many are unread, **so that** I can gauge what still needs reading.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดูมุมขวาของ header
**Expected**
แสดงจุดสีและตัวเลขจำนวน unread; เมื่อไม่มี unread ตัวเลขนี้ไม่แสดง

---
## TC-NTFY-010004 — แถว unread มีพื้นหลังเน้นและป้าย unread
> **As an** authenticated user, **I want** unread rows visually highlighted, **so that** I can spot new items quickly.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีรายการที่ `is_read === false`; อยู่ที่ `/notifications`
**Steps**
1. ดูแถวที่ยังไม่อ่าน
**Expected**
แถวมีพื้นหลังเน้น (`bg-primary/[0.07]`) และแสดงป้าย unread

---
## TC-NTFY-010005 — แต่ละแถวแสดง title / message / เวลา
> **As an** authenticated user, **I want** each row to show title, message and time, **so that** I can understand each alert without opening it.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดูเนื้อหาของแถวแจ้งเตือน
**Expected**
แต่ละแถวแสดง title, ข้อความ (clamp) และเวลาแบบ relative/locale ตามข้อมูล

---
## TC-NTFY-020001 — คลิกแถวที่มี internal link นำไปหน้าต้นทาง
> **As an** authenticated user, **I want** clicking a linked notification to take me to its source, **so that** I can act on it directly.

**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่มี internal link (เช่น เอกสาร PR/PO); อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวแจ้งเตือนที่เป็นลิงก์
**Expected**
นำทางไปยังหน้าต้นทางตาม href ที่ resolve จากการแจ้งเตือน

---
## TC-NTFY-020002 — คลิกแถวที่ไม่มี link เปิด NotificationDetailDialog
> **As an** authenticated user, **I want** clicking a link-less notification to open its detail, **so that** I can read the full message in place.

**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ไม่มี internal link; อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวแจ้งเตือนนั้น (ปุ่ม)
**Expected**
เปิด NotificationDetailDialog แสดงรายละเอียดของการแจ้งเตือนที่เลือก

---
## TC-NTFY-020003 — detail dialog แสดง title / type / เวลา / message
> **As an** authenticated user, **I want** the detail dialog to show full context, **so that** I understand the notification completely.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด NotificationDetailDialog ของรายการหนึ่ง
**Steps**
1. ดูเนื้อหาใน dialog
**Expected**
แสดง title, badge type, เวลาที่สร้าง และข้อความเต็ม (whitespace-pre-wrap)

---
## TC-NTFY-020004 — detail dialog มีปุ่ม Open สำหรับ external link
> **As an** authenticated user, **I want** an Open button for external links, **so that** I can follow the notification to its destination.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิด detail dialog ของการแจ้งเตือนที่มี external link
**Steps**
1. ดู footer ของ dialog
2. กดปุ่ม Open
**Expected**
แสดงปุ่ม Open (ไอคอน ExternalLink) และกดแล้วนำไปยังลิงก์ปลายทาง พร้อมปิด dialog

---
## TC-NTFY-040001 — mark as read เดี่ยวจาก popover กระดิ่ง
> **As an** authenticated user, **I want** to mark a single notification read from the bell, **so that** I can clear items one at a time.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่าน; ล็อกอินแล้ว
**Steps**
1. เปิด popover กระดิ่งบน navbar
2. กด mark as read ที่รายการหนึ่ง (PUT)
**Expected**
รายการเปลี่ยนเป็น read, ตัวนับ unread ลดลง และหน้า `/notifications` สะท้อนสถานะที่อัปเดต

---
## TC-NTFY-040002 — mark all as read จาก popover กระดิ่ง
> **As an** authenticated user, **I want** to mark everything read at once, **so that** I can clear my whole inbox quickly.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านหลายรายการ; ล็อกอินแล้ว
**Steps**
1. เปิด popover กระดิ่งบน navbar
2. กดปุ่ม Mark all read (PUT)
**Expected**
ทุกรายการเปลี่ยนเป็น read, ตัวนับ unread เป็น 0 และพื้นหลังเน้นของแถวหายไป

---
## TC-NTFY-090001 — empty state เมื่อไม่มีการแจ้งเตือน
> **As an** authenticated user, **I want** a clear empty state when I have no notifications, **so that** I know my inbox is clean.

**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ผู้ใช้ไม่มีการแจ้งเตือนเลย; อยู่ที่ `/notifications`
**Steps**
1. รอ loading หาย
**Expected**
แสดง empty state (ไอคอน BellOff) พร้อมหัวข้อและคำอธิบายว่าไม่มีการแจ้งเตือน

---
## TC-NTFY-090002 — สถานะ error เมื่อโหลดรายการล้มเหลว
> **As an** authenticated user, **I want** a graceful error if notifications fail to load, **so that** the page stays usable instead of crashing.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
API รายการแจ้งเตือนคืน error; อยู่ที่ `/notifications`
**Steps**
1. ไปที่ `/notifications`
2. รอการโหลดล้มเหลว
**Expected**
แสดงข้อความ error และไม่ crash หน้า

---
## TC-NTFY-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As an** unauthenticated visitor, **I want** to be redirected to login when I hit the notifications page, **so that** my notifications stay private.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/notifications` ตรงๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง
