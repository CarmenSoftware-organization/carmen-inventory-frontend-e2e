# User Activity — User Stories

_Authored from the test-case catalog `docs/test-cases/1106-user-activity.md` (documentation only — no automated spec yet)._

**Module:** User Activity
**Frontend route:** `routes/system-admin/user-activity`  •  **URL:** `/system-admin/user-activity`
**Prefix:** `UACT`
**Default role:** Platform Admin
**Total test cases:** 16

_Read-only audit view (login/logout events only — backend query is pinned to `entity_type=auth`). Focus: list, filter, detail drill-in, export, authorization._

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-UACT-010001 | หน้า User Activity โหลดสำเร็จ | High | Smoke |
| TC-UACT-010002 | คอลัมน์ตาราง (Timestamp, Action, User, Description, IP, User Agent) แสดงครบ | Medium | Functional |
| TC-UACT-010003 | รายการเรียงตามเวลาล่าสุดก่อน (default sort) | Medium | Functional |
| TC-UACT-010004 | ค้นหากิจกรรมใช้งานได้ | Medium | Functional |
| TC-UACT-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-UACT-010006 | สลับ list/grid view ได้ | Low | Functional |
| TC-UACT-010007 | ปรับการมองเห็นคอลัมน์ (column visibility) ได้ | Low | Functional |
| TC-UACT-020001 | คลิกแถวเปิด detail sheet | High | Smoke |
| TC-UACT-020002 | detail sheet แสดงข้อมูลทั่วไป (เวลา, user, IP, user agent) | Medium | Functional |
| TC-UACT-020003 | detail sheet แสดง metadata แบบ JSON เมื่อมีข้อมูล | Low | Functional |
| TC-UACT-040001 | filter ตาม action (login/logout) ใช้งานได้ | High | Functional |
| TC-UACT-040002 | filter ตาม user ใช้งานได้ | High | Functional |
| TC-UACT-040003 | ใช้หลาย filter พร้อมกันและ Clear all ได้ | Medium | Functional |
| TC-UACT-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง ต้องถูกบล็อก | High | Authorization |
| TC-UACT-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-UACT-300001 | Export ข้อมูล user activity สำเร็จ | Medium | Functional |

---
## TC-UACT-010001 — หน้า User Activity โหลดสำเร็จ
> **As a** Platform Admin, **I want** the User Activity page to load successfully, **so that** I can review login/logout activity.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin
**Steps**
1. ไปที่ `/system-admin/user-activity`
**Expected**
URL ตรงกับ `/system-admin/user-activity`; หัวข้อหน้าและตาราง DataGrid (desktop) แสดงภายใน 10 วินาที

---
## TC-UACT-010002 — คอลัมน์ตาราง (Timestamp, Action, User, Description, IP, User Agent) แสดงครบ
> **As a** Platform Admin, **I want** all activity columns to be present, **so that** I can see who did what, when and from where.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Timestamp (วันที่+เวลา), Action (badge), User (ชื่อ+username), Description, IP Address และ User Agent

---
## TC-UACT-010003 — รายการเรียงตามเวลาล่าสุดก่อน (default sort)
> **As a** Platform Admin, **I want** the newest events first, **so that** recent activity is visible immediately.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึกกิจกรรมหลายรายการต่างเวลา
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ตรวจลำดับแถวในคอลัมน์ Timestamp
**Expected**
รายการเรียงจากใหม่ไปเก่า (default sort `-created_at`)

---
## TC-UACT-010004 — ค้นหากิจกรรมใช้งานได้
> **As a** Platform Admin, **I want** to search activity records, **so that** I can find a specific event quickly.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึกกิจกรรมที่ค่าค้นรู้แน่นอน
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. พิมพ์คำค้นในช่องค้นหาแล้วกด Enter
**Expected**
ตารางกรองแสดงเฉพาะรายการที่ตรงกับคำค้นภายใน 10 วินาที

---
## TC-UACT-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Platform Admin, **I want** an empty state for a no-match search, **so that** I know the result set is empty.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ค้นหาด้วยคำสุ่มที่ไม่มีในระบบ
**Expected**
แสดง EmptyComponent (ไม่มีรายการที่ตรงกับคำค้น) ภายใน 10 วินาที

---
## TC-UACT-010006 — สลับ list/grid view ได้
> **As a** Platform Admin, **I want** to switch between list and grid views, **so that** I can use the layout that suits my task.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin (desktop viewport); มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม Grid view
3. คลิกปุ่ม List view กลับ
**Expected**
มุมมองสลับระหว่างตาราง (list) และการ์ด (grid); grid โหลดข้อมูลแบบ infinite scroll

---
## TC-UACT-010007 — ปรับการมองเห็นคอลัมน์ (column visibility) ได้
> **As a** Platform Admin, **I want** to hide and show columns, **so that** I can tailor the table to what I need to see.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin (desktop, list view)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม Columns
3. ปิดการแสดงคอลัมน์ User Agent
**Expected**
คอลัมน์ User Agent ถูกซ่อนจากตารางตามที่เลือก

---
## TC-UACT-020001 — คลิกแถวเปิด detail sheet
> **As a** Platform Admin, **I want** clicking a row to open its detail sheet, **so that** I can drill into one event.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกแถวกิจกรรมในตาราง
**Expected**
เปิด UserActivityDetailSheet ด้านขวา แสดงรายละเอียดของกิจกรรมที่เลือก

---
## TC-UACT-020002 — detail sheet แสดงข้อมูลทั่วไป (เวลา, user, IP, user agent)
> **As a** Platform Admin, **I want** the detail sheet to show general info, **so that** I have the full context of an event.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด detail sheet ของกิจกรรมหนึ่ง
**Steps**
1. คลิกแถวเพื่อเปิด detail sheet
2. อ่านส่วน General Info
**Expected**
sheet แสดง badge action, timestamp, ชื่อผู้ใช้/username, IP address และ user agent (ถ้ามี)

---
## TC-UACT-020003 — detail sheet แสดง metadata แบบ JSON เมื่อมีข้อมูล
> **As a** Platform Admin, **I want** the sheet to show metadata as JSON when present, **so that** I can inspect extra event details.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีกิจกรรมที่มี meta_data
**Steps**
1. คลิกแถวกิจกรรมที่มี metadata
2. เลื่อนดูส่วน Metadata ใน sheet
**Expected**
ส่วน Metadata แสดง JSON แบบ pretty-printed; ถ้าไม่มี metadata ส่วนนี้จะไม่แสดง

---
## TC-UACT-040001 — filter ตาม action (login/logout) ใช้งานได้
> **As a** Platform Admin, **I want** to filter by action, **so that** I can isolate logins or logouts.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีทั้งกิจกรรม login และ logout ใน DB
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. เปิด MultiSelectFilter "Action"
3. เลือก Login
**Expected**
ตารางแสดงเฉพาะกิจกรรม login; มี active filter badge "Login" ปรากฏ

---
## TC-UACT-040002 — filter ตาม user ใช้งานได้
> **As a** Platform Admin, **I want** to filter by user, **so that** I can review one person's sign-in history.
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีกิจกรรมจากผู้ใช้หลายคน
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. เปิด MultiSelectFilter "User" (ค้นหาได้)
3. เลือกผู้ใช้คนหนึ่ง
**Expected**
ตารางแสดงเฉพาะกิจกรรมของผู้ใช้ที่เลือก (กรองด้วย actor_id); มี active filter badge ชื่อผู้ใช้นั้น

---
## TC-UACT-040003 — ใช้หลาย filter พร้อมกันและ Clear all ได้
> **As a** Platform Admin, **I want** to combine filters then clear them all, **so that** I can narrow then reset the view easily.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีกิจกรรมหลายประเภทและหลายผู้ใช้
**Steps**
1. เลือก filter Action = Login และ User คนหนึ่งพร้อมกัน
2. คลิก Clear all ใน ActiveFilterBar
**Expected**
ตารางแสดงเฉพาะกิจกรรม login ของผู้ใช้นั้น; หลัง Clear all filter ทั้งหมดถูกล้างและ badge หายไป

---
## TC-UACT-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง ต้องถูกบล็อก
> **As a** Platform Admin, **I want** unauthorized users blocked from the audit view, **so that** activity records stay confidential.
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ System Admin
**Steps**
1. ไปที่ `/system-admin/user-activity`
**Expected**
ระบบปฏิเสธการเข้าถึง (forbidden หรือ redirect ออก) ไม่แสดงบันทึกกิจกรรม

---
## TC-UACT-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated direct access to redirect to login, **so that** audit data is not exposed to anonymous users.
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว)
**Steps**
1. เปิด URL `/system-admin/user-activity` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` ไม่แสดงเนื้อหาโมดูล

---
## TC-UACT-300001 — Export ข้อมูล user activity สำเร็จ
> **As a** Platform Admin, **I want** to export user activity to a file, **so that** I can archive or report on sign-in history.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม Export
**Expected**
ระบบ export คอลัมน์ Date/Action/User/IP Address/Description เป็นไฟล์; แสดง toast สำเร็จพร้อมจำนวนแถว (หรือ warning เมื่อไม่มีข้อมูล)
