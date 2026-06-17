# Notifications — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/notifications`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Notifications
**Frontend route:** `routes/notifications`  •  **URL:** `/notifications`
**Prefix:** `NTFY`
**Default role:** Any authenticated user
**Total test cases:** 14

> หน้า `/notifications` แสดงรายการแจ้งเตือนทั้งหมดแบบ flat list (รายการแน่น, เส้นคั่นบาง). header มีไอคอนกระดิ่ง, badge นับจำนวนรวม และตัวเลขนับ unread. แต่ละแถวแสดง NotificationItemContent (title/message/เวลา) โดยแถวที่ยังไม่อ่านมีพื้นหลังเน้น (`bg-primary/[0.07]`) และป้าย unread. แถวที่มี internal link จะเป็น `<Link>` กดแล้วนำไปยังหน้าต้นทาง; แถวที่ไม่มี link จะเป็นปุ่มเปิด NotificationDetailDialog (แสดง title, type badge, เวลา, message และปุ่ม Open สำหรับ external link). มีสถานะ loading (skeleton), error และ empty state. การ mark read เดี่ยว/ทั้งหมดทำผ่าน popover ของกระดิ่งบน navbar (REST PUT).

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
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดู badge ข้างหัวข้อ
**Expected**
badge แสดงจำนวนการแจ้งเตือนทั้งหมด (items.length)

---
## TC-NTFY-010003 — header แสดงตัวเลขนับ unread
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดูมุมขวาของ header
**Expected**
แสดงจุดสีและตัวเลขจำนวน unread; เมื่อไม่มี unread ตัวเลขนี้ไม่แสดง

---
## TC-NTFY-010004 — แถว unread มีพื้นหลังเน้นและป้าย unread
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีรายการที่ `is_read === false`; อยู่ที่ `/notifications`
**Steps**
1. ดูแถวที่ยังไม่อ่าน
**Expected**
แถวมีพื้นหลังเน้น (`bg-primary/[0.07]`) และแสดงป้าย unread

---
## TC-NTFY-010005 — แต่ละแถวแสดง title / message / เวลา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 รายการ; อยู่ที่ `/notifications`
**Steps**
1. ดูเนื้อหาของแถวแจ้งเตือน
**Expected**
แต่ละแถวแสดง title, ข้อความ (clamp) และเวลาแบบ relative/locale ตามข้อมูล

---
## TC-NTFY-020001 — คลิกแถวที่มี internal link นำไปหน้าต้นทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่มี internal link (เช่น เอกสาร PR/PO); อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวแจ้งเตือนที่เป็นลิงก์
**Expected**
นำทางไปยังหน้าต้นทางตาม href ที่ resolve จากการแจ้งเตือน

---
## TC-NTFY-020002 — คลิกแถวที่ไม่มี link เปิด NotificationDetailDialog
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ไม่มี internal link; อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวแจ้งเตือนนั้น (ปุ่ม)
**Expected**
เปิด NotificationDetailDialog แสดงรายละเอียดของการแจ้งเตือนที่เลือก

---
## TC-NTFY-020003 — detail dialog แสดง title / type / เวลา / message
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด NotificationDetailDialog ของรายการหนึ่ง
**Steps**
1. ดูเนื้อหาใน dialog
**Expected**
แสดง title, badge type, เวลาที่สร้าง และข้อความเต็ม (whitespace-pre-wrap)

---
## TC-NTFY-020004 — detail dialog มีปุ่ม Open สำหรับ external link
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
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ผู้ใช้ไม่มีการแจ้งเตือนเลย; อยู่ที่ `/notifications`
**Steps**
1. รอ loading หาย
**Expected**
แสดง empty state (ไอคอน BellOff) พร้อมหัวข้อและคำอธิบายว่าไม่มีการแจ้งเตือน

---
## TC-NTFY-090002 — สถานะ error เมื่อโหลดรายการล้มเหลว
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
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/notifications` ตรงๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง
