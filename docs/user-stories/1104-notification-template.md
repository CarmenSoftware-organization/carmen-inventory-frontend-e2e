# Notification Template — User Stories

_Authored from the test-case catalog `docs/test-cases/1104-notification-template.md` (documentation only — no automated spec yet)._

**Module:** Notification Template
**Frontend route:** `routes/system-admin/notification-template`  •  **URL:** `/system-admin/notification-template`
**Prefix:** `NTPL`
**Default role:** Platform Admin
**Total test cases:** 26

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-NTPL-010001 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-NTPL-010002 | ปุ่ม Add แสดงและลิงก์ไป /new | High | Smoke |
| TC-NTPL-010003 | คอลัมน์ตาราง (Name, Channel, Subject) แสดงครบ | Medium | Functional |
| TC-NTPL-010004 | ค้นหาด้วยชื่อ template ใช้งานได้ | Medium | Functional |
| TC-NTPL-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-NTPL-010006 | badge จำนวนรวมตรงกับ total records | Low | Functional |
| TC-NTPL-020001 | คลิกชื่อ template เปิดหน้า detail (view mode) | High | Smoke |
| TC-NTPL-020002 | detail แสดง badge สถานะ Active/Inactive ถูกต้อง | Medium | Functional |
| TC-NTPL-020003 | ฟิลด์ใน view mode เป็น read-only | Medium | Functional |
| TC-NTPL-030001 | เปิดหน้า new form สำเร็จ | High | Smoke |
| TC-NTPL-030002 | เลือก channel จาก dropdown ได้ (app/email/line/sms) | Medium | Functional |
| TC-NTPL-030003 | สร้าง template ขั้นต่ำ (name + channel + body) สำเร็จ | High | CRUD |
| TC-NTPL-030004 | สร้าง template พร้อม subject และ description สำเร็จ | High | CRUD |
| TC-NTPL-030005 | toggle สถานะ active ตอนสร้างได้ | Medium | Functional |
| TC-NTPL-040001 | แก้ name ของ template แล้ว save สำเร็จ | High | CRUD |
| TC-NTPL-040002 | แก้ body ของ template แล้ว persist | High | CRUD |
| TC-NTPL-040003 | กด Cancel ใน edit mode กลับสู่ view โดยไม่บันทึก | Medium | Functional |
| TC-NTPL-040004 | แก้ไขแล้วกด Back ขณะ dirty ต้องเตือน discard | Medium | Functional |
| TC-NTPL-050001 | เปิด delete dialog แล้ว cancel — template ยังอยู่ | Medium | Functional |
| TC-NTPL-050002 | ลบ template สำเร็จ (cleanup) | High | CRUD |
| TC-NTPL-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง list ต้องถูกบล็อก | High | Authorization |
| TC-NTPL-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-NTPL-200001 | บันทึกโดยไม่กรอก name ต้องแสดง error | High | Validation |
| TC-NTPL-200002 | บันทึกโดยไม่กรอก body ต้องแสดง error | High | Validation |
| TC-NTPL-200003 | name เกิน 100 ตัวอักษรต้องถูกจำกัด | Medium | Validation |
| TC-NTPL-200004 | subject เกิน 200 ตัวอักษรต้องถูกจำกัด | Low | Validation |

---
## TC-NTPL-010001 — หน้า list โหลดสำเร็จ
> **As a** Platform Admin, **I want** the notification-template list page to load successfully, **so that** I can manage notification templates.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin และมีสิทธิ์เข้าถึงโมดูล System Admin
**Steps**
1. ไปที่ `/system-admin/notification-template`
**Expected**
URL ตรงกับ `/system-admin/notification-template`; หัวข้อหน้า (title) และตาราง DataGrid แสดงภายใน 10 วินาที

---
## TC-NTPL-010002 — ปุ่ม Add แสดงและลิงก์ไป /new
> **As a** Platform Admin, **I want** an Add button that opens the create form, **so that** I can author a new template.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. คลิกปุ่ม Add
**Expected**
ปุ่ม Add (ไอคอน Plus) visible และเมื่อคลิกนำทางไปยัง `/system-admin/notification-template/new`

---
## TC-NTPL-010003 — คอลัมน์ตาราง (Name, Channel, Subject) แสดงครบ
> **As a** Platform Admin, **I want** the list table to show Name, Channel and Subject columns, **so that** I can scan templates at a glance.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี template อย่างน้อย 1 รายการใน DB
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Name (ลิงก์สีน้ำเงิน), Channel (badge มีไอคอนตามช่องทาง) และ Subject (แสดง "—" เมื่อว่าง)

---
## TC-NTPL-010004 — ค้นหาด้วยชื่อ template ใช้งานได้
> **As a** Platform Admin, **I want** to search templates by name, **so that** I can find a specific one quickly.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี template ที่ชื่อรู้ค่าแน่นอนใน DB
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. พิมพ์ชื่อ template ในช่องค้นหาแล้วกด Enter
**Expected**
ตารางกรองแสดงเฉพาะ template ที่ชื่อตรงกับคำค้นภายใน 10 วินาที

---
## TC-NTPL-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Platform Admin, **I want** an empty state when a search has no matches, **so that** I know the result set is genuinely empty.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. ค้นหาด้วยคำสุ่มที่ไม่มีในระบบ (เช่น `__NOPE__`)
**Expected**
ตารางแสดงสถานะว่าง (ไม่มีแถวที่ตรงกับคำค้น) ภายใน 10 วินาที

---
## TC-NTPL-010006 — badge จำนวนรวมตรงกับ total records
> **As a** Platform Admin, **I want** the total-count badge to match the record count, **so that** I can trust the displayed totals.
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี template อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. อ่านค่า badge ข้างหัวข้อหน้า
**Expected**
badge แสดงจำนวนรวม (total) เป็นตัวเลขรูปแบบ locale ตรงกับจำนวนแถวที่ระบบรายงาน (ซ่อนเมื่อ total = 0)

---
## TC-NTPL-020001 — คลิกชื่อ template เปิดหน้า detail (view mode)
> **As a** Platform Admin, **I want** clicking a template name to open its detail page, **so that** I can review its content.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มี template อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. คลิกลิงก์ชื่อ template ในคอลัมน์ Name
**Expected**
นำทางไปยัง `/system-admin/notification-template/{id}`; ฟอร์มแสดงในโหมด view พร้อมปุ่ม Edit

---
## TC-NTPL-020002 — detail แสดง badge สถานะ Active/Inactive ถูกต้อง
> **As a** Platform Admin, **I want** the detail page to show the correct status badge, **so that** I can see whether a template is active.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; รู้ค่า is_active ของ template ที่จะเปิด
**Steps**
1. เปิดหน้า detail ของ template
2. อ่าน badge สถานะข้าง ๆ ชื่อ
**Expected**
badge แสดง "Active" (variant success) เมื่อ is_active=true หรือ "Inactive" (variant warning) เมื่อ is_active=false

---
## TC-NTPL-020003 — ฟิลด์ใน view mode เป็น read-only
> **As a** Platform Admin, **I want** fields to be read-only in view mode, **so that** I cannot accidentally change a template without entering edit mode.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า detail โหมด view
**Steps**
1. เปิดหน้า detail ของ template
2. พยายามแก้ไขค่าในช่อง name/subject/body
**Expected**
ทุก input (name, channel, description, subject, body, status switch) อยู่ในสถานะ disabled แก้ไขไม่ได้จนกว่าจะกด Edit

---
## TC-NTPL-030001 — เปิดหน้า new form สำเร็จ
> **As a** Platform Admin, **I want** the new-template form to open, **so that** I can begin creating a template.
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีสิทธิ์สร้าง template
**Steps**
1. ไปที่ `/system-admin/notification-template/new`
**Expected**
URL ตรงกับ `/new`; ฟอร์มแสดงฟิลด์ name, channel, description, subject, body และปุ่ม Save/Cancel

---
## TC-NTPL-030002 — เลือก channel จาก dropdown ได้ (app/email/line/sms)
> **As a** Platform Admin, **I want** to choose the delivery channel from a dropdown, **so that** the template targets the right medium.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form
**Steps**
1. เปิด new form
2. คลิก dropdown Channel
3. เลือกค่า "Email"
**Expected**
dropdown มี 4 ตัวเลือก (App, Email, LINE, SMS) และ trigger แสดง label "Email" หลังเลือก

---
## TC-NTPL-030003 — สร้าง template ขั้นต่ำ (name + channel + body) สำเร็จ
> **As a** Platform Admin, **I want** to create a template with the minimum required fields, **so that** I can save a working template quickly.
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ชื่อ template ยังไม่มีใน DB
**Steps**
1. เปิด new form
2. กรอก name
3. เลือก channel = App
4. กรอก body
5. กด Create
**Expected**
แสดง toast สร้างสำเร็จ และนำทางกลับไปหน้า list; template ใหม่ค้นเจอใน list

---
## TC-NTPL-030004 — สร้าง template พร้อม subject และ description สำเร็จ
> **As a** Platform Admin, **I want** to create a template including subject and description, **so that** richer channels (e.g. email) have full content.
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ชื่อ template ยังไม่มีใน DB
**Steps**
1. เปิด new form
2. กรอก name, description, subject และ body
3. เลือก channel = Email
4. กด Create
**Expected**
แสดง toast สร้างสำเร็จ; เปิด detail ของ template ที่สร้างพบค่า subject/description ตรงกับที่กรอก

---
## TC-NTPL-030005 — toggle สถานะ active ตอนสร้างได้
> **As a** Platform Admin, **I want** to set the active status while creating, **so that** I can stage a template as inactive before launch.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form (status เริ่มต้น active=true)
**Steps**
1. เปิด new form
2. คลิก StatusSwitch ให้เป็น inactive
3. กรอก name + body แล้วกด Create
**Expected**
template ถูกสร้างด้วยสถานะ Inactive; badge ในหน้า detail แสดง "Inactive"

---
## TC-NTPL-040001 — แก้ name ของ template แล้ว save สำเร็จ
> **As a** Platform Admin, **I want** to rename a template and save, **so that** I can keep template names accurate.
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี template ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด detail ของ template
2. กด Edit
3. แก้ค่า name
4. กด Save
**Expected**
แสดง toast แก้ไขสำเร็จ และนำทางกลับ list; name ใหม่ปรากฏใน list

---
## TC-NTPL-040002 — แก้ body ของ template แล้ว persist
> **As a** Platform Admin, **I want** body edits to persist, **so that** the new message content is used on the next send.
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี template ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด detail ของ template และกด Edit
2. แก้ค่า body
3. กด Save
4. เปิด detail ของ template ซ้ำ
**Expected**
ค่า body ใหม่ถูกบันทึก (persist) และแสดงเมื่อเปิด detail ครั้งถัดไป

---
## TC-NTPL-040003 — กด Cancel ใน edit mode กลับสู่ view โดยไม่บันทึก
> **As a** Platform Admin, **I want** Cancel to discard edits and return to view, **so that** I can abandon changes safely.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี template ใน DB; อยู่ที่ detail โหมด edit หลังแก้ค่าบางส่วน
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ค่า name
3. กด Cancel แล้วยืนยัน discard
**Expected**
ฟอร์มกลับสู่โหมด view และค่าถูก reset เป็นค่าเดิม (การแก้ไขไม่ถูกบันทึก)

---
## TC-NTPL-040004 — แก้ไขแล้วกด Back ขณะ dirty ต้องเตือน discard
> **As a** Platform Admin, **I want** a discard warning when leaving with unsaved changes, **so that** I do not lose edits by accident.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี template ใน DB; อยู่ที่ detail โหมด edit หลังแก้ค่า (form dirty)
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ค่า body
3. กดปุ่ม Back (ChevronLeft)
**Expected**
แสดง DiscardDialog (variant warning) ถามยืนยันก่อนออกจากหน้า

---
## TC-NTPL-050001 — เปิด delete dialog แล้ว cancel — template ยังอยู่
> **As a** Platform Admin, **I want** to cancel a delete confirmation, **so that** the template is preserved when I change my mind.
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี template ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด detail ของ template และกด Edit
2. กดปุ่ม Delete
3. ใน DeleteDialog กด Cancel
**Expected**
Dialog ปิดและ template ยังคงอยู่ (ยังเปิด detail ได้)

---
## TC-NTPL-050002 — ลบ template สำเร็จ (cleanup)
> **As a** Platform Admin, **I want** to delete a template, **so that** obsolete templates are removed.
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี template ที่สร้างในชุดทดสอบและไม่ถูกอ้างอิงโดยระบบอื่น
**Steps**
1. เปิด detail ของ template และกด Edit
2. กดปุ่ม Delete
3. ยืนยันการลบใน DeleteDialog
**Expected**
แสดง toast ลบสำเร็จ และนำทางกลับ list; template ไม่ปรากฏใน list อีก

---
## TC-NTPL-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง list ต้องถูกบล็อก
> **As a** Platform Admin, **I want** unauthorized users to be blocked from the list, **so that** notification templates stay restricted to admins.
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ System Admin (เช่น staff ทั่วไป)
**Steps**
1. ไปที่ `/system-admin/notification-template`
**Expected**
ระบบปฏิเสธการเข้าถึง (แสดงข้อความ forbidden หรือ redirect ออกจากหน้า) ไม่แสดงรายการ template

---
## TC-NTPL-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated direct access to redirect to login, **so that** the module is protected from anonymous users.
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว)
**Steps**
1. เปิด URL `/system-admin/notification-template` โดยตรง
**Expected**
ถูก redirect ไปยังหน้า `/login` ไม่แสดงเนื้อหาโมดูล

---
## TC-NTPL-200001 — บันทึกโดยไม่กรอก name ต้องแสดง error
> **As a** Platform Admin, **I want** a validation error when name is missing, **so that** templates always have a name.
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form
**Steps**
1. เปิด new form
2. กรอกเฉพาะ body (เว้น name)
3. กด Create
**Expected**
แสดงข้อความ error "Name is required" ใต้ช่อง name และฟอร์มไม่ถูก submit (ยังอยู่ที่ /new)

---
## TC-NTPL-200002 — บันทึกโดยไม่กรอก body ต้องแสดง error
> **As a** Platform Admin, **I want** a validation error when body is missing, **so that** templates always carry message content.
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form
**Steps**
1. เปิด new form
2. กรอกเฉพาะ name (เว้น body)
3. กด Create
**Expected**
แสดงข้อความ error "Body is required" ใต้ช่อง body และฟอร์มไม่ถูก submit

---
## TC-NTPL-200003 — name เกิน 100 ตัวอักษรต้องถูกจำกัด
> **As a** Platform Admin, **I want** the name field capped at 100 characters, **so that** names stay within the supported length.
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form
**Steps**
1. เปิด new form
2. พยายามพิมพ์ name ยาว 150 ตัวอักษร
**Expected**
ช่อง name รับค่าไม่เกิน 100 ตัวอักษร (maxLength=100 enforcement)

---
## TC-NTPL-200004 — subject เกิน 200 ตัวอักษรต้องถูกจำกัด
> **As a** Platform Admin, **I want** the subject field capped at 200 characters, **so that** subjects stay within the supported length.
**Priority:** Low · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า new form
**Steps**
1. เปิด new form
2. พยายามพิมพ์ subject ยาว 250 ตัวอักษร
**Expected**
ช่อง subject รับค่าไม่เกิน 200 ตัวอักษร (maxLength=200 enforcement)
