# Operation Plan — Category — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/category`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Category (Recipe Category)
**Frontend route:** `routes/operation-plan/category`  •  **URL:** `/operation-plan/category`
**Prefix:** `OPCAT`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 16

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-OPCAT-010001 | แสดงรายการหมวดหมู่สูตรอาหาร | High | Smoke |
| TC-OPCAT-010002 | ค้นหาหมวดหมู่ด้วยชื่อ/รหัส | High | Functional |
| TC-OPCAT-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-OPCAT-010004 | กรองตาม Parent category | Medium | Functional |
| TC-OPCAT-010005 | สลับมุมมอง List / Grid | Low | Functional |
| TC-OPCAT-020001 | เปิดหน้าแก้ไขหมวดหมู่จาก list | Medium | Happy Path |
| TC-OPCAT-030001 | สร้างหมวดหมู่ใหม่สำเร็จ | High | CRUD |
| TC-OPCAT-030002 | สร้างหมวดหมู่ย่อยโดยเลือก Parent | Medium | Happy Path |
| TC-OPCAT-040001 | แก้ไขชื่อหมวดหมู่แล้วค่าคงอยู่ | High | CRUD |
| TC-OPCAT-040002 | แก้ไขค่า Cost Settings และ Profit Margins | Medium | CRUD |
| TC-OPCAT-050001 | ลบหมวดหมู่สำเร็จ | High | CRUD |
| TC-OPCAT-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-OPCAT-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าหมวดหมู่ | High | Authorization |
| TC-OPCAT-200001 | บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง | High | Validation |
| TC-OPCAT-200002 | จำกัดความยาว Code ไม่เกิน 10 ตัวอักษร | Medium | Validation |
| TC-OPCAT-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |

---
## TC-OPCAT-010001 — แสดงรายการหมวดหมู่สูตรอาหาร
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหมวดหมู่สูตรอาหารอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/category`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หน้าแสดงหัวข้อหมวดหมู่สูตรอาหารพร้อม badge จำนวนรายการ และตารางแสดงคอลัมน์ Code, Name, Parent

---
## TC-OPCAT-010002 — ค้นหาหมวดหมู่ด้วยชื่อ/รหัส
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` และมีหลายหมวดหมู่
**Steps**
1. คลิกที่ช่อง Search
2. พิมพ์ชื่อหรือรหัสของหมวดหมู่ที่มีอยู่
3. กด Enter
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ตรงกับคำค้นหา

---
## TC-OPCAT-010003 — กรองตามสถานะ Active/Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`; มีหมวดหมู่ทั้งสถานะ active และ inactive
**Steps**
1. เปิด Status filter
2. เลือก Active
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ active และมี chip filter ปรากฏใน ActiveFilterBar

---
## TC-OPCAT-010004 — กรองตาม Parent category
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`; มีหมวดหมู่ที่กำหนด parent อย่างน้อย 1 รายการ
**Steps**
1. เปิด Parent multi-select filter
2. เลือก parent category หนึ่งรายการ
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ลูกของ parent ที่เลือก และมี chip filter ของ parent นั้น

---
## TC-OPCAT-010005 — สลับมุมมอง List / Grid
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop
**Steps**
1. คลิกปุ่ม Grid view
2. คลิกปุ่ม List view กลับ
**Expected**
มุมมองสลับระหว่างการ์ด (grid) และตาราง (list) โดยข้อมูลหมวดหมู่ยังแสดงครบ

---
## TC-OPCAT-020001 — เปิดหน้าแก้ไขหมวดหมู่จาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`; มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ Code หรือ Name ของหมวดหมู่ในตาราง
**Expected**
นำทางไปที่ `/operation-plan/category/{id}` และฟอร์มแสดงข้อมูลเดิมในโหมด view (ปุ่ม Edit)

---
## TC-OPCAT-030001 — สร้างหมวดหมู่ใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. คลิกปุ่ม Add
2. กรอก Code และ Name ด้วยค่าที่ไม่ซ้ำ
3. (เลือกได้) กรอก Description
4. คลิก Create
**Expected**
แสดง toast สร้างสำเร็จ และหมวดหมู่ใหม่ปรากฏในรายการที่ `/operation-plan/category`

---
## TC-OPCAT-030002 — สร้างหมวดหมู่ย่อยโดยเลือก Parent
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มี root category อย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่ม Add
2. กรอก Code และ Name
3. เลือก Parent Category จาก lookup
4. คลิก Create
**Expected**
หมวดหมู่ใหม่ถูกสร้างและคอลัมน์ Parent แสดงชื่อ parent ที่เลือก

---
## TC-OPCAT-040001 — แก้ไขชื่อหมวดหมู่แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่สร้างไว้แล้ว
**Steps**
1. เปิดหมวดหมู่จาก list แล้วคลิก Edit
2. แก้ไข Name เป็นค่าใหม่
3. คลิก Save
4. reload หน้า
**Expected**
แสดง toast อัปเดตสำเร็จ; ชื่อใหม่แสดงในตารางและยังคงอยู่หลัง reload

---
## TC-OPCAT-040002 — แก้ไขค่า Cost Settings และ Profit Margins
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่สร้างไว้แล้ว และอยู่ในโหมด Edit
**Steps**
1. กรอกค่า Labor Cost %, Overhead %, Target Food Cost % ใน Default Cost Settings
2. กรอกค่า Minimum / Target Profit Margin ใน Default Profit Margins
3. คลิก Save
4. เปิดหมวดหมู่นั้นใหม่
**Expected**
ค่า cost settings และ margins ที่กรอกถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-OPCAT-050001 — ลบหมวดหมู่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่ไม่ถูกอ้างอิงและสามารถลบได้
**Steps**
1. ที่ list คลิกเมนู/ปุ่ม Delete ของหมวดหมู่ (หรือปุ่ม Delete ในหน้า Edit)
2. ยืนยันใน DeleteDialog
3. reload หน้า
**Expected**
แสดง toast ลบสำเร็จ; หมวดหมู่หายไปจากตารางและไม่กลับมาหลัง reload

---
## TC-OPCAT-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิก Delete ที่หมวดหมู่
2. ใน DeleteDialog คลิก Cancel
**Expected**
Dialog ปิดลงโดยไม่ลบ และหมวดหมู่ยังคงอยู่ในตาราง

---
## TC-OPCAT-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าหมวดหมู่
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูหมวดหมู่สูตรอาหาร
**Steps**
1. ไปที่ `/operation-plan/category`
**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect ไปหน้า unauthorized หรือเห็นข้อความ error) และไม่เห็นข้อมูลหมวดหมู่

---
## TC-OPCAT-200001 — บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างหมวดหมู่ใหม่
**Steps**
1. ปล่อยช่อง Code และ Name ว่าง
2. คลิก Create
**Expected**
แสดงข้อความ error "Code is required" และ "Name is required"; ไม่มีการสร้างหมวดหมู่

---
## TC-OPCAT-200002 — จำกัดความยาว Code ไม่เกิน 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างหมวดหมู่ใหม่
**Steps**
1. พยายามพิมพ์ Code มากกว่า 10 ตัวอักษร
**Expected**
ช่อง Code รับได้สูงสุด 10 ตัวอักษร (maxLength) ส่วนเกินถูกตัดทิ้ง

---
## TC-OPCAT-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`
**Steps**
1. พิมพ์คำค้นหาที่ไม่ตรงกับหมวดหมู่ใด เช่น "zzzznotfound"
2. กด Enter
**Expected**
ตารางไม่มีข้อมูลและแสดง EmptyComponent (สถานะว่าง)
