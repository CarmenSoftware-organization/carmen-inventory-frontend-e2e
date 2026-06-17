# Recipe Equipment Category — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/recipe-equipment-category`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Recipe Equipment Category
**Frontend route:** `routes/operation-plan/recipe-equipment-category`  •  **URL:** `/operation-plan/recipe-equipment-category`
**Prefix:** `RECC`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 13

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RECC-010001 | แสดงรายการหมวดหมู่อุปกรณ์สูตรอาหาร | High | Smoke |
| TC-RECC-010002 | ค้นหาด้วยชื่อ | High | Functional |
| TC-RECC-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-RECC-020001 | เปิด dialog แก้ไขจาก list | Medium | Happy Path |
| TC-RECC-030001 | สร้างหมวดหมู่ใหม่สำเร็จ | High | CRUD |
| TC-RECC-030002 | ยกเลิกการสร้างใน dialog | Medium | Alternate Flow |
| TC-RECC-040001 | แก้ไขชื่อแล้วค่าคงอยู่ | High | CRUD |
| TC-RECC-040002 | สลับสถานะ Active เป็น Inactive | Medium | CRUD |
| TC-RECC-050001 | ลบหมวดหมู่สำเร็จ | High | CRUD |
| TC-RECC-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-RECC-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้ | High | Authorization |
| TC-RECC-200001 | บันทึกไม่ได้เมื่อเว้น Name ว่าง | High | Validation |
| TC-RECC-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |

---
## TC-RECC-010001 — แสดงรายการหมวดหมู่อุปกรณ์สูตรอาหาร
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/recipe-equipment-category`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
ตารางแสดงคอลัมน์ Name พร้อมหัวข้อและคำอธิบายของโมดูล

---
## TC-RECC-010002 — ค้นหาด้วยชื่อ
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
## TC-RECC-010003 — กรองตามสถานะ Active/Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีหมวดหมู่ทั้งสถานะ active และ inactive
**Steps**
1. เปิด Status filter
2. เลือก Active
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ active

---
## TC-RECC-020001 — เปิด dialog แก้ไขจาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ Name ของหมวดหมู่ในตาราง
**Expected**
เปิด Dialog แก้ไขที่กรอกค่า Name, Description และ status switch ของรายการนั้นไว้ล่วงหน้า

---
## TC-RECC-030001 — สร้างหมวดหมู่ใหม่สำเร็จ
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
## TC-RECC-030002 — ยกเลิกการสร้างใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog สร้างหมวดหมู่ใหม่
**Steps**
1. กรอก Name บางส่วน
2. คลิก Cancel
**Expected**
dialog ปิดโดยไม่บันทึก และไม่มีรายการใหม่ในตาราง

---
## TC-RECC-040001 — แก้ไขชื่อแล้วค่าคงอยู่
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
## TC-RECC-040002 — สลับสถานะ Active เป็น Inactive
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
## TC-RECC-050001 — ลบหมวดหมู่สำเร็จ
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
## TC-RECC-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิก Delete ที่หมวดหมู่
2. ใน DeleteDialog คลิก Cancel
**Expected**
Dialog ปิดโดยไม่ลบ และหมวดหมู่ยังอยู่ในตาราง

---
## TC-RECC-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูหมวดหมู่อุปกรณ์สูตรอาหาร
**Steps**
1. ไปที่ `/operation-plan/recipe-equipment-category`
**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูล

---
## TC-RECC-200001 — บันทึกไม่ได้เมื่อเว้น Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog สร้างหมวดหมู่ใหม่
**Steps**
1. ปล่อย Name ว่าง
2. คลิก Create
**Expected**
แสดง FieldError ใต้ช่อง Name (required); ไม่มีการสร้างหมวดหมู่

---
## TC-RECC-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า list
**Steps**
1. พิมพ์คำค้นหาที่ไม่ตรงกับหมวดหมู่ใด
2. กด Enter
**Expected**
ตารางไม่มีข้อมูลและแสดงสถานะว่าง (EmptyComponent)
