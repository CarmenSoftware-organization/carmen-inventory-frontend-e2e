# Equipment Category — User Stories

_Authored from the test-case catalog `docs/test-cases/131-equipment-category.md` (documentation only — no automated spec yet)._

**Module:** Operation Plan — Equipment Category
**Frontend route:** `routes/operation-plan/equipment-category`  •  **URL:** `/operation-plan/equipment-category`
**Prefix:** `EQPC`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 14

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EQPC-010001 | แสดงรายการหมวดหมู่อุปกรณ์ | High | Smoke |
| TC-EQPC-010002 | ค้นหาด้วยชื่อ | High | Functional |
| TC-EQPC-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-EQPC-010004 | สลับมุมมอง List / Grid | Low | Functional |
| TC-EQPC-020001 | เปิด dialog แก้ไขจาก list | Medium | Happy Path |
| TC-EQPC-030001 | สร้างหมวดหมู่อุปกรณ์ใหม่สำเร็จ | High | CRUD |
| TC-EQPC-030002 | ยกเลิกการสร้างใน dialog | Medium | Alternate Flow |
| TC-EQPC-040001 | แก้ไขชื่อแล้วค่าคงอยู่ | High | CRUD |
| TC-EQPC-040002 | สลับสถานะ Active เป็น Inactive | Medium | CRUD |
| TC-EQPC-050001 | ลบหมวดหมู่อุปกรณ์สำเร็จ | High | CRUD |
| TC-EQPC-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-EQPC-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้ | High | Authorization |
| TC-EQPC-200001 | บันทึกไม่ได้เมื่อเว้น Name ว่าง | High | Validation |
| TC-EQPC-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |

---
## TC-EQPC-010001 — แสดงรายการหมวดหมู่อุปกรณ์
> **As an** Operation Planner, **I want** the equipment-category list page to load, **so that** I can review the categories used to classify equipment.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหมวดหมู่อุปกรณ์อย่างน้อย 1 รายการ

**Steps**
1. ไปที่ `/operation-plan/equipment-category`
2. รอให้ DataGrid โหลดเสร็จ

**Expected**
ตารางแสดงคอลัมน์ Name พร้อมหัวข้อ คำอธิบาย และ badge จำนวนรายการ

---
## TC-EQPC-010002 — ค้นหาด้วยชื่อ
> **As an** Operation Planner, **I want** to search categories by name, **so that** I can quickly find the one I need.

**Priority:** High · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า list; มีหลายหมวดหมู่

**Steps**
1. คลิกที่ช่อง Search
2. พิมพ์ชื่อหมวดหมู่ที่มีอยู่
3. กด Enter

**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ตรงกับคำค้นหา

---
## TC-EQPC-010003 — กรองตามสถานะ Active/Inactive
> **As an** Operation Planner, **I want** to filter categories by status, **so that** I can focus on active or retired categories.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีหมวดหมู่ทั้งสถานะ active และ inactive

**Steps**
1. เปิด Status filter
2. เลือก Inactive

**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ inactive และมี chip filter ปรากฏ

---
## TC-EQPC-010004 — สลับมุมมอง List / Grid
> **As an** Operation Planner, **I want** to switch between list and grid views, **so that** I can browse categories in the layout I prefer.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment-category` บน desktop

**Steps**
1. คลิกปุ่ม Grid view
2. คลิกปุ่ม List view กลับ

**Expected**
มุมมองสลับระหว่างการ์ดและตาราง โดยข้อมูลหมวดหมู่ยังครบ

---
## TC-EQPC-020001 — เปิด dialog แก้ไขจาก list
> **As an** Operation Planner, **I want** to open the edit dialog from the list, **so that** I can update a category in place.

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ

**Steps**
1. คลิกที่ Name ของหมวดหมู่ในตาราง

**Expected**
เปิด Dialog แก้ไขที่กรอกค่า Name, Description และ status switch ของรายการนั้นไว้ล่วงหน้า

---
## TC-EQPC-030001 — สร้างหมวดหมู่อุปกรณ์ใหม่สำเร็จ
> **As an** Operation Planner, **I want** to create a new equipment category, **so that** equipment can be classified under it.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG

**Steps**
1. คลิกปุ่ม Add
2. กรอก Name ด้วยค่าที่ไม่ซ้ำ
3. (เลือกได้) กรอก Description
4. คลิก Create

**Expected**
แสดง toast สร้างสำเร็จ; dialog ปิด และหมวดหมู่ใหม่ปรากฏในตาราง

---
## TC-EQPC-030002 — ยกเลิกการสร้างใน dialog
> **As an** Operation Planner, **I want** to cancel a create I started, **so that** no unwanted category is saved.

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
เปิด dialog สร้างหมวดหมู่ใหม่

**Steps**
1. กรอก Name บางส่วน
2. คลิก Cancel

**Expected**
dialog ปิดโดยไม่บันทึก และไม่มีรายการใหม่ในตาราง

---
## TC-EQPC-040001 — แก้ไขชื่อแล้วค่าคงอยู่
> **As an** Operation Planner, **I want** name edits to persist, **so that** the corrected category name is reflected everywhere.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีหมวดหมู่ที่สร้างไว้แล้ว

**Steps**
1. คลิกที่หมวดหมู่เพื่อเปิด dialog แก้ไข
2. แก้ Name เป็นค่าใหม่
3. คลิก Save
4. reload หน้า

**Expected**
แสดง toast อัปเดตสำเร็จ; ชื่อใหม่แสดงในตารางและคงอยู่หลัง reload (ใช้ doc_version สำหรับ optimistic concurrency)

---
## TC-EQPC-040002 — สลับสถานะ Active เป็น Inactive
> **As an** Operation Planner, **I want** to deactivate a category, **so that** it is no longer offered for new equipment.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**
มีหมวดหมู่ที่ active อยู่

**Steps**
1. เปิด dialog แก้ไข
2. ปิด StatusSwitch (is_active)
3. คลิก Save

**Expected**
หมวดหมู่เปลี่ยนเป็น inactive และแสดงเมื่อกรองด้วย Inactive

---
## TC-EQPC-050001 — ลบหมวดหมู่อุปกรณ์สำเร็จ
> **As an** Operation Planner, **I want** to delete an unused category, **so that** the list stays relevant.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีหมวดหมู่ที่สามารถลบได้

**Steps**
1. คลิก Delete ที่หมวดหมู่
2. ยืนยันใน DeleteDialog
3. reload หน้า

**Expected**
แสดง toast ลบสำเร็จ; หมวดหมู่หายจากตารางและไม่กลับมาหลัง reload

---
## TC-EQPC-050002 — ยกเลิกการลบใน dialog
> **As an** Operation Planner, **I want** to cancel a delete I started by mistake, **so that** the category is not removed.

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ

**Steps**
1. คลิก Delete ที่หมวดหมู่
2. ใน DeleteDialog คลิก Cancel

**Expected**
Dialog ปิดโดยไม่ลบ และหมวดหมู่ยังอยู่ในตาราง

---
## TC-EQPC-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้
> **As a** user without permission, **I want** access to be blocked, **so that** unauthorized data is not exposed.

**Priority:** High · **Test Type:** Authorization

**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูหมวดหมู่อุปกรณ์

**Steps**
1. ไปที่ `/operation-plan/equipment-category`

**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูล

---
## TC-EQPC-200001 — บันทึกไม่ได้เมื่อเว้น Name ว่าง
> **As an** Operation Planner, **I want** the form to block an empty name, **so that** every category has a name.

**Priority:** High · **Test Type:** Validation

**Preconditions**
เปิด dialog สร้างหมวดหมู่ใหม่

**Steps**
1. ปล่อย Name ว่าง
2. คลิก Create

**Expected**
แสดง FieldError ใต้ช่อง Name (required); ไม่มีการสร้างหมวดหมู่

---
## TC-EQPC-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
> **As an** Operation Planner, **I want** a clear empty state when nothing matches, **so that** I know my search returned no results.

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**
อยู่ที่หน้า list

**Steps**
1. พิมพ์คำค้นหาที่ไม่ตรงกับหมวดหมู่ใด
2. กด Enter

**Expected**
ตารางไม่มีข้อมูลและแสดงสถานะว่าง (EmptyComponent)
