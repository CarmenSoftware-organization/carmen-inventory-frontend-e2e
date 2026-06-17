# Workflow Configuration — User Stories

_Authored from the test-case catalog `docs/test-cases/1103-workflow.md` (documentation only — no automated spec yet)._

**Module:** Workflow Configuration
**Frontend route:** `routes/system-admin/workflow`  •  **URL:** `/system-admin/workflow`
**Prefix:** `WF`
**Default role:** Platform Admin
**Total test cases:** 30

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-WF-010001 | หน้า list ของ Workflow โหลดสำเร็จ | High | Smoke |
| TC-WF-010002 | คอลัมน์ Name / Type / Flow / Updated แสดงครบ | High | Functional |
| TC-WF-010003 | ค้นหา Workflow ด้วยชื่อแล้วกรองได้ | Medium | Functional |
| TC-WF-010004 | กรองสถานะ Active / Inactive ได้ | High | Functional |
| TC-WF-010005 | กรองตามประเภท workflow (multi-select) ได้ | High | Functional |
| TC-WF-010006 | Workflow ที่ inactive แสดง lock icon + ชื่อขีดฆ่า | Medium | Functional |
| TC-WF-010007 | ล้าง filter ทั้งหมดผ่าน ActiveFilterBar ได้ | Medium | Functional |
| TC-WF-020001 | เปิดหน้า detail ของ Workflow สำเร็จ | High | Smoke |
| TC-WF-020002 | Tabs General/Stages/Routing/Products/Insights ครบและสลับได้ | High | Functional |
| TC-WF-020003 | Diagram และ validation panel แสดงเมื่อมี stages | Medium | Functional |
| TC-WF-030001 | เปิดหน้า new form สำเร็จ | High | Smoke |
| TC-WF-030002 | สร้าง Workflow ขั้นต่ำ (name + type) สำเร็จ | High | CRUD |
| TC-WF-030003 | สร้าง Workflow พร้อม description และ is_active=false | Medium | CRUD |
| TC-WF-040001 | แก้ name/description ใน tab General แล้ว save สำเร็จ | High | CRUD |
| TC-WF-040002 | toggle is_active ใน detail แล้ว save persist | Medium | CRUD |
| TC-WF-040003 | ออกจาก detail ขณะ dirty ต้องเด้ง Discard dialog | Medium | Functional |
| TC-WF-050001 | เปิด delete dialog แล้ว cancel — Workflow ยังอยู่ | Medium | Functional |
| TC-WF-050002 | ลบ Workflow จาก row action สำเร็จ | High | CRUD |
| TC-WF-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง /system-admin/workflow ต้องถูกบล็อก | High | Authorization |
| TC-WF-100002 | เข้าหน้า workflow โดยไม่ได้ login ต้อง redirect ไป /login | High | Auth-guard |
| TC-WF-200001 | สร้าง Workflow โดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-WF-200002 | สร้าง Workflow โดยไม่เลือกประเภทต้องแสดง error | High | Validation |
| TC-WF-200003 | ชื่อ Workflow เกิน 100 ตัวอักษรต้องถูกจำกัด | Medium | Validation |
| TC-WF-400001 | row action Duplicate สร้างสำเนา Workflow ได้ | High | Functional |
| TC-WF-400002 | row action Activate / Deactivate สลับสถานะได้ | High | Functional |
| TC-WF-400003 | เพิ่ม stage ใหม่ใน tab Stages ได้ (แทรกก่อน Completed) | High | Functional |
| TC-WF-400004 | ลบ stage กลาง (middle) ได้ แต่ลบ first/last ไม่ได้ | High | Functional |
| TC-WF-400005 | กำหนด assigned users ให้ stage กลางได้ | High | Functional |
| TC-WF-400006 | เปิด HOD ที่ stage กลาง — ปิดการเลือก user รายตัว | Medium | Functional |
| TC-WF-900001 | validation panel เตือนเมื่อ stage กลางไม่มี user / ไม่มี action | High | Edge Case |

---
## TC-WF-010001 — หน้า list ของ Workflow โหลดสำเร็จ

> **As a** Platform Admin, **I want** the Workflow list page to load successfully, **so that** I can manage the approval workflows in the system.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
ล็อกอินเป็น Platform Admin

**Steps**
1. ไปที่ URL `/system-admin/workflow`

**Expected**
URL ตรงกับ `/system-admin/workflow`, title แสดง, ปุ่ม New Workflow ปรากฏ และ DataGrid (หรือ empty state) โหลดภายใน 10 วินาที

---
## TC-WF-010002 — คอลัมน์ Name / Type / Flow / Updated แสดงครบ

> **As a** Platform Admin, **I want** the Name, Type, Flow and Updated columns to render correctly, **so that** I can read each workflow at a glance.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มี Workflow อย่างน้อย 1 รายการ

**Steps**
1. ไปที่หน้า list
2. ตรวจสอบหัวคอลัมน์: Name, Workflow Type, Flow, Updated

**Expected**
Name แสดงชื่อ, Workflow Type แสดง badge ตามประเภท (สี/label จาก WF_TYPE_CONFIG), Flow แสดง flow strip ของ stages, Updated แสดงเวลาแบบ relative พร้อม tooltip เวลาเต็ม

---
## TC-WF-010003 — ค้นหา Workflow ด้วยชื่อแล้วกรองได้

> **As a** Platform Admin, **I want** to search workflows by name, **so that** I can quickly find the one I need.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มี Workflow ที่ทราบชื่อ

**Steps**
1. ไปที่หน้า list
2. พิมพ์คำค้นในช่อง SearchInput แล้วกด Enter

**Expected**
ตารางแสดงเฉพาะ Workflow ที่ชื่อตรงคำค้น

---
## TC-WF-010004 — กรองสถานะ Active / Inactive ได้

> **As a** Platform Admin, **I want** to filter workflows by active state, **so that** I can focus on the workflows that are live.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มี Workflow ทั้ง active และ inactive

**Steps**
1. ไปที่หน้า list (desktop)
2. คลิก StatusFilter แล้วเลือก Active
3. เปลี่ยนเป็น Inactive

**Expected**
เลือก Active แสดงเฉพาะ `is_active=true`, เลือก Inactive แสดงเฉพาะ `is_active=false`; มี badge filter ปรากฏใน ActiveFilterBar

---
## TC-WF-010005 — กรองตามประเภท workflow (multi-select) ได้

> **As a** Platform Admin, **I want** to filter workflows by one or more types, **so that** I can review workflows of a given category.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มี Workflow หลายประเภท (Purchase Request / Purchase Order / Store Requisition)

**Steps**
1. ไปที่หน้า list (desktop)
2. เปิด MultiSelectFilter "Workflow Type"
3. เลือก Purchase Request แล้วเพิ่ม Purchase Order

**Expected**
ตารางแสดงเฉพาะ Workflow ที่ประเภทตรงกับตัวเลือกที่เลือก (รวมหลายประเภทได้พร้อมกัน) และ badge filter แสดงแยกตามประเภท

---
## TC-WF-010006 — Workflow ที่ inactive แสดง lock icon + ชื่อขีดฆ่า

> **As a** Platform Admin, **I want** inactive workflows to be visually marked, **so that** I can tell at a glance which workflows are disabled.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มี Workflow ที่ inactive อย่างน้อย 1 รายการ

**Steps**
1. ไปที่หน้า list
2. หาแถวของ Workflow ที่ inactive

**Expected**
แถว inactive แสดงไอคอน Lock (tooltip "inactive"), ชื่อมีเส้นขีดฆ่า (line-through) และ badge ประเภท/flow มี opacity ลดลง

---
## TC-WF-010007 — ล้าง filter ทั้งหมดผ่าน ActiveFilterBar ได้

> **As a** Platform Admin, **I want** to clear all active filters at once, **so that** I can return to the full workflow list quickly.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีทั้ง status filter และ type filter ทำงานอยู่

**Steps**
1. กด Clear all ใน ActiveFilterBar

**Expected**
ทั้ง status และ workflow_type filter ถูกล้าง, badge หายหมด และตารางกลับมาแสดงทุก Workflow

---
## TC-WF-020001 — เปิดหน้า detail ของ Workflow สำเร็จ

> **As a** Platform Admin, **I want** to open a workflow's detail page, **so that** I can inspect and edit its configuration.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
มี Workflow อย่างน้อย 1 รายการ

**Steps**
1. ไปที่หน้า list
2. คลิกชื่อ Workflow ในคอลัมน์ Name

**Expected**
navigate ไปยัง `/system-admin/workflow/<id>`, header แสดงชื่อ/ปุ่ม Edit, และ tab General แสดงค่าฟอร์มแบบ read-only

---
## TC-WF-020002 — Tabs General/Stages/Routing/Products/Insights ครบและสลับได้

> **As a** Platform Admin, **I want** all five workflow tabs to be present and switchable, **so that** I can navigate every aspect of the configuration.

**Priority:** High · **Test Type:** Functional

**Preconditions**
เปิด detail ของ Workflow ที่มี stages/products/routing

**Steps**
1. ดูแถบ Tabs
2. คลิกทีละ tab: General → Stages → Routing → Products → Insights

**Expected**
มี 5 tabs ครบ; tab Stages/Routing/Products แสดง badge นับจำนวน; แต่ละ tab สลับและแสดงเนื้อหาตรงกับชื่อ

---
## TC-WF-020003 — Diagram และ validation panel แสดงเมื่อมี stages

> **As a** Platform Admin, **I want** the diagram and validation panel to appear when stages exist, **so that** I can visualise the flow and spot issues.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
เปิด detail ของ Workflow ที่มี stage อย่างน้อย 1

**Steps**
1. ดูส่วนเหนือ Tabs

**Expected**
แสดง validation panel (สรุป error/warning) และ workflow diagram ของ stages; คลิก stage ใน diagram แล้วกระโดดไป tab Stages พร้อมเลือก stage นั้น

---
## TC-WF-030001 — เปิดหน้า new form สำเร็จ

> **As a** Platform Admin, **I want** the new-workflow form to open cleanly, **so that** I can start defining a fresh workflow.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
ล็อกอินเป็น Platform Admin

**Steps**
1. กดปุ่ม New Workflow ที่หน้า list (หรือไปที่ `/system-admin/workflow/new`)

**Expected**
ฟอร์มแสดงช่อง Workflow Name, dropdown Workflow Type, Textarea Description, switch is_active และกล่อง info "default config"; ปุ่ม Create Workflow ปรากฏ

---
## TC-WF-030002 — สร้าง Workflow ขั้นต่ำ (name + type) สำเร็จ

> **As a** Platform Admin, **I want** to create a workflow with just a name and type, **so that** I can scaffold it and configure stages later.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
อยู่ที่ `/system-admin/workflow/new`

**Steps**
1. กรอก Workflow Name
2. เลือก Workflow Type จาก dropdown
3. กด Create Workflow

**Expected**
แสดง toast `createSuccess` และ redirect ไป `/system-admin/workflow/<id ใหม่>`; Workflow ใหม่มี default stages (Create Request + Completed) ตามค่าเริ่มต้น

---
## TC-WF-030003 — สร้าง Workflow พร้อม description และ is_active=false

> **As a** Platform Admin, **I want** to create a workflow with a description and as inactive, **so that** I can prepare it before going live.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**
อยู่ที่ `/system-admin/workflow/new`

**Steps**
1. กรอก name + เลือก type
2. กรอก description
3. ปิด switch is_active
4. กด Create Workflow

**Expected**
สร้างสำเร็จ (toast `createSuccess`); เมื่อกลับมาดูใน list Workflow ใหม่อยู่สถานะ inactive (lock icon) และ description ถูกบันทึก

---
## TC-WF-040001 — แก้ name/description ใน tab General แล้ว save สำเร็จ

> **As a** Platform Admin, **I want** to edit a workflow's name and description, **so that** its metadata stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
เปิด detail ของ Workflow

**Steps**
1. กด Edit ที่ header
2. ที่ tab General แก้ไข name และ description
3. กด Save

**Expected**
แสดง toast `updateSuccess`, ออกจากโหมด edit และค่าใหม่ persist (ส่ง doc_version พร้อม payload)

---
## TC-WF-040002 — toggle is_active ใน detail แล้ว save persist

> **As a** Platform Admin, **I want** to toggle a workflow active/inactive from its detail page, **so that** I can enable or disable it on demand.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**
เปิด detail ของ Workflow

**Steps**
1. กด Edit
2. สลับสถานะ is_active ที่ tab General
3. กด Save

**Expected**
toast `updateSuccess` ปรากฏ และสถานะใหม่ persist (สะท้อนใน list ครั้งถัดไป)

---
## TC-WF-040003 — ออกจาก detail ขณะ dirty ต้องเด้ง Discard dialog

> **As a** Platform Admin, **I want** to be warned before navigating away from unsaved workflow edits, **so that** I do not lose changes by accident.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
อยู่ในโหมด edit และแก้ฟอร์มแล้ว (dirty)

**Steps**
1. แก้ค่าใด ๆ ในฟอร์ม
2. พยายาม navigate ออก (เช่น คลิกเมนูอื่น) หรือกด Cancel

**Expected**
navigation guard เด้ง Discard dialog (variant warning); ยืนยัน discard แล้วทิ้งการเปลี่ยนแปลง, กด cancel แล้วอยู่หน้าเดิม

---
## TC-WF-050001 — เปิด delete dialog แล้ว cancel — Workflow ยังอยู่

> **As a** Platform Admin, **I want** cancelling the delete dialog to leave the workflow intact, **so that** I never delete a workflow by mistake.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มี Workflow อย่างน้อย 1 รายการ

**Steps**
1. ไปที่หน้า list
2. เปิด row action (เมนู ⋮) แล้วเลือก Delete
3. ใน DeleteDialog กด Cancel

**Expected**
Dialog ปิดและแถว Workflow ยังคงอยู่ใน list

---
## TC-WF-050002 — ลบ Workflow จาก row action สำเร็จ

> **As a** Platform Admin, **I want** to delete a workflow from the list, **so that** obsolete workflows are removed.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มี Workflow ทดสอบที่ลบได้

**Steps**
1. ไปที่หน้า list
2. เปิด row action แล้วเลือก Delete
3. ใน DeleteDialog (ข้อความยืนยันแสดงชื่อ Workflow) กดยืนยัน

**Expected**
แสดง toast `deleteSuccess` และแถว Workflow หายจาก list

---
## TC-WF-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง /system-admin/workflow ต้องถูกบล็อก

> **As a** Platform Admin, **I want** users without System Admin rights to be blocked from the workflow page, **so that** RBAC controls stay enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ไม่มีสิทธิ์ System Admin

**Steps**
1. พยายามเปิด URL `/system-admin/workflow` โดยตรง

**Expected**
ระบบไม่อนุญาต — แสดงหน้า unauthorized / redirect หรือ list ไม่โหลดข้อมูล Workflow

---
## TC-WF-100002 — เข้าหน้า workflow โดยไม่ได้ login ต้อง redirect ไป /login

> **As a** Platform Admin, **I want** unauthenticated access to redirect to login, **so that** workflow data is never exposed to anonymous visitors.

**Priority:** High · **Test Type:** Auth-guard

**Preconditions**
ไม่มี session / ไม่ได้ล็อกอิน

**Steps**
1. เปิด URL `/system-admin/workflow` โดยตรง

**Expected**
ถูก redirect ไปยัง `/login` และไม่แสดงข้อมูล Workflow

---
## TC-WF-200001 — สร้าง Workflow โดยไม่กรอกชื่อต้องแสดง error

> **As a** Platform Admin, **I want** the form to reject a workflow with no name, **so that** every workflow is identifiable.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ที่ `/system-admin/workflow/new`

**Steps**
1. เว้น Workflow Name ว่าง
2. เลือก type
3. กด Create Workflow

**Expected**
แสดงข้อความ error required ใต้ช่อง name, ฟอร์มไม่ถูก submit และไม่มี toast สำเร็จ (zod `name.min(1)`)

---
## TC-WF-200002 — สร้าง Workflow โดยไม่เลือกประเภทต้องแสดง error

> **As a** Platform Admin, **I want** the form to reject a workflow with no type, **so that** every workflow is bound to a document type.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ที่ `/system-admin/workflow/new`

**Steps**
1. กรอก name
2. ล้าง/ไม่เลือก Workflow Type
3. กด Create Workflow

**Expected**
แสดง error required ใต้ช่อง workflow_type และฟอร์มไม่ถูก submit (zod `workflow_type.min(1)`)

---
## TC-WF-200003 — ชื่อ Workflow เกิน 100 ตัวอักษรต้องถูกจำกัด

> **As a** Platform Admin, **I want** the workflow name to be capped at 100 characters, **so that** stored names stay within bounds.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**
อยู่ที่ `/system-admin/workflow/new`

**Steps**
1. พยายามพิมพ์ชื่อยาวเกิน 100 ตัวอักษรในช่อง Workflow Name

**Expected**
ค่าในช่องถูกจำกัดไม่เกิน 100 ตัวอักษร (input `maxLength={100}`)

---
## TC-WF-400001 — row action Duplicate สร้างสำเนา Workflow ได้

> **As a** Platform Admin, **I want** to duplicate an existing workflow, **so that** I can build a similar one without starting from scratch.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มี Workflow อย่างน้อย 1 รายการ

**Steps**
1. ไปที่หน้า list
2. เปิด row action แล้วเลือก Duplicate

**Expected**
ระบบสร้างสำเนา Workflow (มีในรายการเพิ่มขึ้น 1) และแสดง feedback ว่าทำสำเร็จ

---
## TC-WF-400002 — row action Activate / Deactivate สลับสถานะได้

> **As a** Platform Admin, **I want** to activate or deactivate a workflow from the row menu, **so that** I can toggle its availability without opening it.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มี Workflow ทั้ง active และ inactive

**Steps**
1. ที่ Workflow ที่ active เปิด row action แล้วเลือก Deactivate
2. ที่ Workflow ที่ inactive เปิด row action แล้วเลือก Activate

**Expected**
สถานะสลับตามที่เลือก (active→inactive แสดง lock/ขีดฆ่า, inactive→active กลับปกติ); เมนูแสดงตัวเลือกตรงข้ามกับสถานะปัจจุบัน

---
## TC-WF-400003 — เพิ่ม stage ใหม่ใน tab Stages ได้ (แทรกก่อน Completed)

> **As a** Platform Admin, **I want** to add a new stage before the Completed stage, **so that** I can extend the approval chain.

**Priority:** High · **Test Type:** Functional

**Preconditions**
เปิด detail แล้วกด Edit; tab Stages เปิดอยู่

**Steps**
1. ที่รายการ stage ด้านซ้าย กดปุ่ม Add Stage
2. ดูตำแหน่งและจำนวน stage

**Expected**
มี stage ใหม่ถูกแทรกก่อน stage สุดท้าย (Completed), ถูกเลือกอัตโนมัติ, มีค่า default (role=approve, sla=24 hours, approve/reject/sendback เปิด) และ badge นับ stage บน tab เพิ่มขึ้น

---
## TC-WF-400004 — ลบ stage กลาง (middle) ได้ แต่ลบ first/last ไม่ได้

> **As a** Platform Admin, **I want** to delete middle stages but be prevented from deleting the first/last, **so that** the workflow always has valid endpoints.

**Priority:** High · **Test Type:** Functional

**Preconditions**
เปิด detail โหมด edit; Workflow มี stage กลางอย่างน้อย 1 (นอกจาก Create Request และ Completed)

**Steps**
1. เลือก stage กลาง — ปุ่ม Delete ปรากฏ
2. กด Delete แล้วยืนยันใน AlertDialog
3. เลือก stage แรก (Create Request) และ stage สุดท้าย (Completed)

**Expected**
stage กลางถูกลบหลังยืนยัน; stage แรกและสุดท้ายไม่มีปุ่ม Delete (ลบไม่ได้) — stage สุดท้ายแสดงหน้า Completed read-only

---
## TC-WF-400005 — กำหนด assigned users ให้ stage กลางได้

> **As a** Platform Admin, **I want** to assign approver users to a middle stage, **so that** the right people act at that step.

**Priority:** High · **Test Type:** Functional

**Preconditions**
เปิด detail โหมด edit; เลือก stage กลางที่ไม่ใช่ HOD; มีผู้ใช้ในระบบ

**Steps**
1. ที่ stage detail เปิด tab Assigned Users
2. ค้นหาผู้ใช้ในช่อง search
3. กด Assign ที่ผู้ใช้รายหนึ่ง (หรือใช้ Assign All / Assign Filtered)

**Expected**
ผู้ใช้ถูกเพิ่มเข้า assigned_users, badge จำนวน user บน tab เพิ่มขึ้น; กด Unassign แล้วถอนออกได้

---
## TC-WF-400006 — เปิด HOD ที่ stage กลาง — ปิดการเลือก user รายตัว

> **As a** Platform Admin, **I want** enabling HOD on a stage to lock individual user selection, **so that** routing falls to the head of department instead of named users.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
เปิด detail โหมด edit; เลือก stage กลาง

**Steps**
1. ที่ tab Assigned Users ติ๊ก checkbox "is HOD"

**Expected**
เมื่อเปิด HOD ระบบล้าง assigned_users ของ stage และแสดงกล่องเตือน "HOD enabled" (lock) แทนรายการ user — ไม่สามารถเลือก user รายตัวได้

---
## TC-WF-900001 — validation panel เตือนเมื่อ stage กลางไม่มี user / ไม่มี action

> **As a** Platform Admin, **I want** the validation panel to flag a middle stage with no users or no actions, **so that** I cannot publish an unusable workflow.

**Priority:** High · **Test Type:** Edge Case

**Preconditions**
เปิด detail โหมด edit; มี stage กลางที่ไม่ใช่ first/last/HOD

**Steps**
1. ทำให้ stage กลางไม่มี assigned user และปิด action ทั้งหมด
2. ดู validation panel ด้านบน

**Expected**
panel แสดง error: `no_users_assigned` และ `no_actions_enabled` สำหรับ stage นั้น, นับ errorCount และ isReady=false; คลิก issue แล้วกระโดดไปเลือก stage ที่เป็นปัญหา

---
