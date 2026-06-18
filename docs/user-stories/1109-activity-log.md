# Activity Log — User Stories

_Authored from the test-case catalog `docs/test-cases/1109-activity-log.md` (documentation only — no automated spec yet)._

**Module:** Activity Log
**Frontend route:** `routes/system-admin/activity-log`  •  **URL:** `/system-admin/activity-log`
**Prefix:** `ALOG`
**Default role:** Platform Admin
**Total test cases:** 18

_Read-only audit view of all system changes (create/update/delete/login/logout across entities). Focus: list, multi-axis filter, detail drill-in with old/new data diff, export, authorization._

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ALOG-010001 | หน้า Activity Log โหลดสำเร็จ | High | Smoke |
| TC-ALOG-010002 | คอลัมน์ตาราง (Timestamp, Action, User, Entity Type, Description, Entity ID, IP) แสดงครบ | Medium | Functional |
| TC-ALOG-010003 | รายการเรียงตามเวลาล่าสุดก่อน (default sort) | Medium | Functional |
| TC-ALOG-010004 | badge action แสดงสีตามประเภท (create/update/delete/login/logout) | Medium | Functional |
| TC-ALOG-010005 | ค้นหา activity ใช้งานได้ | Medium | Functional |
| TC-ALOG-010006 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-ALOG-010007 | สลับ list/grid view ได้ | Low | Functional |
| TC-ALOG-010008 | ปรับการมองเห็นคอลัมน์ (column visibility) ได้ | Low | Functional |
| TC-ALOG-020001 | คลิกแถวเปิด detail sheet | High | Smoke |
| TC-ALOG-020002 | detail sheet แสดงข้อมูลทั่วไป (เวลา, user, entity, IP) | Medium | Functional |
| TC-ALOG-020003 | detail sheet แสดง old_data/new_data เมื่อ action เป็น update | High | Functional |
| TC-ALOG-040001 | filter ตาม action ใช้งานได้ | High | Functional |
| TC-ALOG-040002 | filter ตาม entity type ใช้งานได้ | High | Functional |
| TC-ALOG-040003 | filter ตาม user ใช้งานได้ | High | Functional |
| TC-ALOG-040004 | ใช้หลาย filter พร้อมกันและ Clear all ได้ | Medium | Functional |
| TC-ALOG-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง ต้องถูกบล็อก | High | Authorization |
| TC-ALOG-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-ALOG-300001 | Export ข้อมูล activity log สำเร็จ | Medium | Functional |

---
## TC-ALOG-010001 — หน้า Activity Log โหลดสำเร็จ
> **As a** Platform Admin, **I want** the Activity Log page to load successfully, **so that** I can audit system-wide changes.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin
**Steps**
1. ไปที่ `/system-admin/activity-log`
**Expected**
URL ตรงกับ `/system-admin/activity-log`; หัวข้อหน้าและตาราง DataGrid (desktop) แสดงภายใน 10 วินาที

---
## TC-ALOG-010002 — คอลัมน์ตาราง (Timestamp, Action, User, Entity Type, Description, Entity ID, IP) แสดงครบ
> **As a** Platform Admin, **I want** all audit columns to be present, **so that** I can see what entity changed and by whom.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Timestamp, Action (badge), User, Entity Type (badge Title Case), Description, Entity ID (ตัด 8 ตัวแรก) และ IP Address

---
## TC-ALOG-010003 — รายการเรียงตามเวลาล่าสุดก่อน (default sort)
> **As a** Platform Admin, **I want** the newest changes first, **so that** recent activity is visible immediately.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity หลายรายการต่างเวลา
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ตรวจลำดับแถวในคอลัมน์ Timestamp
**Expected**
รายการเรียงจากใหม่ไปเก่า (default sort `-created_at`)

---
## TC-ALOG-010004 — badge action แสดงสีตามประเภท (create/update/delete/login/logout)
> **As a** Platform Admin, **I want** action badges color-coded by type, **so that** I can scan change types at a glance.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity หลายประเภท action
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ดูคอลัมน์ Action ของแถวต่าง ๆ
**Expected**
badge แสดงสีแยกตาม action: create (approved), update (pending), delete (destructive), login (in-progress), logout (draft); action อื่นใช้สี muted

---
## TC-ALOG-010005 — ค้นหา activity ใช้งานได้
> **As a** Platform Admin, **I want** to search activity records, **so that** I can find a specific change quickly.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity ที่ค่าค้นรู้แน่นอน
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. พิมพ์คำค้นในช่องค้นหาแล้วกด Enter
**Expected**
ตารางกรองแสดงเฉพาะรายการที่ตรงกับคำค้นภายใน 10 วินาที

---
## TC-ALOG-010006 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Platform Admin, **I want** an empty state for a no-match search, **so that** I know the result set is empty.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ค้นหาด้วยคำสุ่มที่ไม่มีในระบบ
**Expected**
แสดง EmptyComponent (ไม่มีรายการที่ตรงกับคำค้น) ภายใน 10 วินาที

---
## TC-ALOG-010007 — สลับ list/grid view ได้
> **As a** Platform Admin, **I want** to switch between list and grid views, **so that** I can use the layout that suits my task.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin (desktop viewport); มีบันทึก activity อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม Grid view
3. คลิกปุ่ม List view กลับ
**Expected**
มุมมองสลับระหว่างตาราง (list) และการ์ด (grid); grid โหลดข้อมูลแบบ infinite scroll

---
## TC-ALOG-010008 — ปรับการมองเห็นคอลัมน์ (column visibility) ได้
> **As a** Platform Admin, **I want** to hide and show columns, **so that** I can tailor the table to what I need to see.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin (desktop, list view)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม Columns
3. ปิดการแสดงคอลัมน์ Entity ID
**Expected**
คอลัมน์ Entity ID ถูกซ่อนจากตารางตามที่เลือก

---
## TC-ALOG-020001 — คลิกแถวเปิด detail sheet
> **As a** Platform Admin, **I want** clicking a row to open its detail sheet, **so that** I can drill into one change.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกแถว activity ในตาราง
**Expected**
เปิด ActivityLogDetailSheet ด้านขวา แสดง badge action + entity type และรายละเอียดของ activity ที่เลือก

---
## TC-ALOG-020002 — detail sheet แสดงข้อมูลทั่วไป (เวลา, user, entity, IP)
> **As a** Platform Admin, **I want** the detail sheet to show general info, **so that** I have the full context of a change.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด detail sheet ของ activity หนึ่ง
**Steps**
1. คลิกแถวเพื่อเปิด detail sheet
2. อ่านส่วน General Info
**Expected**
sheet แสดง timestamp, ชื่อผู้ใช้/username, Entity Type, Entity ID, IP address และ user agent (ถ้ามี)

---
## TC-ALOG-020003 — detail sheet แสดง old_data/new_data เมื่อ action เป็น update
> **As a** Platform Admin, **I want** to see before/after data on update events, **so that** I can audit exactly what changed.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี activity ประเภท update ที่มี old_data และ new_data
**Steps**
1. คลิกแถว activity ประเภท update
2. เลื่อนดูส่วน Data Changes ใน sheet
**Expected**
ส่วน Data Changes แสดง Old Data และ New Data เป็น JSON แบบ pretty-printed; ส่วน Metadata แสดงเมื่อมี meta_data

---
## TC-ALOG-040001 — filter ตาม action ใช้งานได้
> **As a** Platform Admin, **I want** to filter by action, **so that** I can isolate one kind of change.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี activity หลายประเภท action ใน DB
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. เปิด MultiSelectFilter "Action"
3. เลือก Update
**Expected**
ตารางแสดงเฉพาะ activity ที่ action=update; มี active filter badge "Update" ปรากฏ

---
## TC-ALOG-040002 — filter ตาม entity type ใช้งานได้
> **As a** Platform Admin, **I want** to filter by entity type, **so that** I can focus on changes to a specific kind of record.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี activity จาก entity หลายชนิด (เช่น vendor, product)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. เปิด MultiSelectFilter "Entity Type" (ค้นหาได้)
3. เลือก Vendor
**Expected**
ตารางแสดงเฉพาะ activity ของ entity_type=vendor; มี active filter badge "Vendor" ปรากฏ

---
## TC-ALOG-040003 — filter ตาม user ใช้งานได้
> **As a** Platform Admin, **I want** to filter by user, **so that** I can review one person's changes.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี activity จากผู้ใช้หลายคน
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. เปิด MultiSelectFilter "User" (ค้นหาได้)
3. เลือกผู้ใช้คนหนึ่ง
**Expected**
ตารางแสดงเฉพาะ activity ของผู้ใช้ที่เลือก (กรองด้วย actor_id); มี active filter badge ชื่อผู้ใช้นั้น

---
## TC-ALOG-040004 — ใช้หลาย filter พร้อมกันและ Clear all ได้
> **As a** Platform Admin, **I want** to combine action, entity and user filters then clear them, **so that** I can narrow then reset the audit view.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี activity หลากหลาย action/entity/user
**Steps**
1. เลือก filter Action = Update, Entity Type = Vendor และ User คนหนึ่งพร้อมกัน
2. คลิก Clear all ใน ActiveFilterBar
**Expected**
ตารางแสดงเฉพาะรายการที่เข้าทั้ง 3 เงื่อนไข; หลัง Clear all filter ทั้งหมดถูกล้างและ badge หายไป

---
## TC-ALOG-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง ต้องถูกบล็อก
> **As a** Platform Admin, **I want** unauthorized users blocked from the audit log, **so that** change history stays confidential.
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ System Admin
**Steps**
1. ไปที่ `/system-admin/activity-log`
**Expected**
ระบบปฏิเสธการเข้าถึง (forbidden หรือ redirect ออก) ไม่แสดงบันทึก activity

---
## TC-ALOG-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated direct access to redirect to login, **so that** audit data is not exposed to anonymous users.
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว)
**Steps**
1. เปิด URL `/system-admin/activity-log` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` ไม่แสดงเนื้อหาโมดูล

---
## TC-ALOG-300001 — Export ข้อมูล activity log สำเร็จ
> **As a** Platform Admin, **I want** to export the activity log to a file, **so that** I can archive or report on change history.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึก activity อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม Export
**Expected**
ระบบ export คอลัมน์ Date/Action/Entity Type/Entity ID/User/IP Address/Description เป็นไฟล์; แสดง toast สำเร็จพร้อมจำนวนแถว (หรือ warning เมื่อไม่มีข้อมูล)
