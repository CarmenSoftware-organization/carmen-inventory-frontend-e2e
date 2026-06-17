# Report — User Stories

_Authored from the test-case catalog `docs/test-cases/1202-report.md` (documentation only — no automated spec yet)._

**Module:** Report
**Frontend route:** `routes/report`  •  **URL:** `/report` (และ `/report/list`, `/report/schedules`, `/report/history`)
**Prefix:** `RPT`
**Default role:** Any authenticated user
**Total test cases:** 16

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RPT-010001 | หน้า Report landing โหลดและแสดง 3 chapter | High | Smoke |
| TC-RPT-010002 | CTA chapter นำไปหน้าย่อยที่ถูกต้อง | Medium | Functional |
| TC-RPT-010003 | หน้า Report list โหลดและแสดงรายการ template | High | Smoke |
| TC-RPT-010004 | badge นับจำนวน report แสดงค่าถูกต้อง | Low | Functional |
| TC-RPT-010005 | สลับมุมมอง list / grid | Low | Functional |
| TC-RPT-010006 | ค้นหา report ด้วย SearchInput กรองรายการได้ | High | Functional |
| TC-RPT-010007 | กรองตาม report group ลดรายการที่แสดง | Medium | Functional |
| TC-RPT-020001 | คลิก report เปิด ReportParamDialog | High | Functional |
| TC-RPT-020002 | dialog สร้างฟิลด์พารามิเตอร์จาก XML (lookup / date / range) | Medium | Functional |
| TC-RPT-020003 | date field เติมค่าเริ่มต้นจาก keyword (Today/@current_period) | Low | Functional |
| TC-RPT-020004 | report ที่ไม่มีพารามิเตอร์แสดงข้อความ noFiltersConfigured | Low | Edge Case |
| TC-RPT-030001 | Run Report สำเร็จและเปิดผลในแท็บใหม่ | High | Functional |
| TC-RPT-030002 | Run Report ล้มเหลวแสดง toast error | Medium | Negative |
| TC-RPT-040001 | หน้า History โหลดและแสดงประวัติการรัน | Medium | Smoke |
| TC-RPT-040002 | หน้า Schedules โหลดและแสดงตารางเวลา | Medium | Smoke |
| TC-RPT-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-RPT-010001 — หน้า Report landing โหลดและแสดง 3 chapter
> **As an** authenticated user, **I want** the report landing to present its three chapters, **so that** I understand what the reporting area offers.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ระบบรับรองแล้ว
**Steps**
1. ไปที่ `/report`
**Expected**
URL ตรงกับ `/report`, แสดง hero และ chapter 01/02/03 (Menu, Schedules, History) พร้อมปุ่ม CTA

---
## TC-RPT-010002 — CTA chapter นำไปหน้าย่อยที่ถูกต้อง
> **As an** authenticated user, **I want** each chapter CTA to route correctly, **so that** I can jump straight to the sub-page I need.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report`
**Steps**
1. กด CTA ของ chapter 01 (ไป `/report/list`)
2. ย้อนกลับและทดสอบ CTA chapter 02 (`/report/schedules`) และ 03 (`/report/history`)
**Expected**
แต่ละ CTA นำทางไปหน้าย่อยที่ตรงกับ chapter นั้น

---
## TC-RPT-010003 — หน้า Report list โหลดและแสดงรายการ template
> **As an** authenticated user, **I want** the report list to load with templates, **so that** I can pick a report to run.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
มี report template อย่างน้อย 1 รายการ; ล็อกอินแล้ว
**Steps**
1. ไปที่ `/report/list`
2. รอ loading หาย
**Expected**
แสดงหัวข้อ Report, toolbar (search/filter/view toggle) และรายการ report (DataGrid หรือ card) หรือ empty state

---
## TC-RPT-010004 — badge นับจำนวน report แสดงค่าถูกต้อง
> **As an** authenticated user, **I want** a count of available reports, **so that** I know how many are in the current view.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี report ที่แสดงอยู่; อยู่ที่ `/report/list`
**Steps**
1. ดู badge ข้างหัวข้อ Report
**Expected**
badge แสดงจำนวน report ที่ผ่านการกรองในหน้าปัจจุบัน

---
## TC-RPT-010005 — สลับมุมมอง list / grid
> **As an** authenticated user, **I want** to toggle between list and grid views, **so that** I can browse reports the way I prefer.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` (จอ desktop)
**Steps**
1. กดปุ่ม Grid view
2. กดปุ่ม List view
**Expected**
มุมมองสลับระหว่าง card grid และ DataGrid table ตามปุ่มที่เลือก

---
## TC-RPT-010006 — ค้นหา report ด้วย SearchInput กรองรายการได้
> **As an** authenticated user, **I want** to search reports by keyword, **so that** I can quickly find the one I need.

**Priority:** High · **Test Type:** Functional
**Preconditions**
มี report หลายรายการ; อยู่ที่ `/report/list`
**Steps**
1. พิมพ์คำค้นในช่อง SearchInput แล้วกด Enter
**Expected**
ระบบส่ง search ไป backend และรายการอัปเดตเหลือเฉพาะที่ตรงกับคำค้น

---
## TC-RPT-010007 — กรองตาม report group ลดรายการที่แสดง
> **As an** authenticated user, **I want** to filter reports by group, **so that** I can narrow the list to a relevant category.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี report หลาย group ในหน้า; อยู่ที่ `/report/list`
**Steps**
1. เปิด ReportGroupFilter แล้วเลือกบาง group
**Expected**
รายการแสดงเฉพาะ report ที่อยู่ใน group ที่เลือก (กรองในหน้าปัจจุบัน) และ URL param `groups` อัปเดต

---
## TC-RPT-020001 — คลิก report เปิด ReportParamDialog
> **As an** authenticated user, **I want** clicking a report to open its parameter dialog, **so that** I can configure it before running.

**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list`; มี report อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ report row หรือ card
**Expected**
เปิด ReportParamDialog แสดงชื่อ report และฟอร์มพารามิเตอร์ (หรือข้อความไม่มีฟิลด์)

---
## TC-RPT-020002 — dialog สร้างฟิลด์พารามิเตอร์จาก XML (lookup / date / range)
> **As an** authenticated user, **I want** the dialog to build the right fields from the report's XML, **so that** I supply the parameters the report expects.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เลือก report ที่ Dialog XML มี field หลายชนิด
**Steps**
1. เปิด ReportParamDialog ของ report นั้น
**Expected**
แสดง field ตาม XML: lookup เป็น select, date เป็น date picker, range เป็นคู่ from/to พร้อม label ที่ถูกต้อง

---
## TC-RPT-020003 — date field เติมค่าเริ่มต้นจาก keyword (Today/@current_period)
> **As an** authenticated user, **I want** date fields pre-filled from keywords, **so that** I can run common reports without manual date entry.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
report มี date field ที่ใช้ keyword เช่น Today, FirstDayOfMonth, @current_period
**Steps**
1. เปิด ReportParamDialog แล้วรอ lookup/period โหลด
**Expected**
date picker แสดงค่าเริ่มต้นที่ resolve จาก keyword เป็นวันที่จริง

---
## TC-RPT-020004 — report ที่ไม่มีพารามิเตอร์แสดงข้อความ noFiltersConfigured
> **As an** authenticated user, **I want** a clear notice when a report has no parameters, **so that** I know I can run it straight away.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เลือก report ที่ Dialog ว่างหรือไม่มี field
**Steps**
1. เปิด ReportParamDialog ของ report นั้น
**Expected**
แสดงข้อความ noFiltersConfigured และยังมีปุ่ม Run Report ให้กดได้

---
## TC-RPT-030001 — Run Report สำเร็จและเปิดผลในแท็บใหม่
> **As an** authenticated user, **I want** running a report to open the result in a new tab, **so that** I can view or export the output.

**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ใน ReportParamDialog ของ report ที่ใช้งานได้; backend ตอบ URL ผลลัพธ์
**Steps**
1. กรอก/ยืนยันพารามิเตอร์
2. กดปุ่ม Run Report
**Expected**
แสดง toast loading จากนั้น ready, เปิดแท็บใหม่ไปยัง URL ผลรายงาน และมีปุ่ม Open ใน toast

---
## TC-RPT-030002 — Run Report ล้มเหลวแสดง toast error
> **As an** authenticated user, **I want** a clear error if the report fails to run, **so that** I know it didn't generate and can retry.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ใน ReportParamDialog; backend คืน error เมื่อ run
**Steps**
1. กดปุ่ม Run Report
**Expected**
แท็บที่เปิดไว้ล่วงหน้าถูกปิด และแสดง toast runError พร้อมรายละเอียดข้อผิดพลาด

---
## TC-RPT-040001 — หน้า History โหลดและแสดงประวัติการรัน
> **As an** authenticated user, **I want** to see my report run history, **so that** I can re-access past outputs.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว
**Steps**
1. ไปที่ `/report/history`
2. รอ loading หาย
**Expected**
แสดงหัวข้อ History, toolbar ค้นหา และตาราง/การ์ดประวัติการรัน หรือ empty state

---
## TC-RPT-040002 — หน้า Schedules โหลดและแสดงตารางเวลา
> **As an** authenticated user, **I want** the schedules page to load, **so that** I can manage automated report runs.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว
**Steps**
1. ไปที่ `/report/schedules`
2. รอ loading หาย
**Expected**
แสดงหน้าจัดการตารางเวลารันรายงาน (รายการ schedule หรือ empty state) โดยไม่เป็น 404

---
## TC-RPT-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As an** unauthenticated visitor, **I want** to be redirected to login when I hit the report area, **so that** report data stays protected.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/report` ตรงๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง
