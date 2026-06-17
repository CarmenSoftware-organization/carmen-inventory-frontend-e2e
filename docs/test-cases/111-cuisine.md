# Cuisine Type — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/cuisine`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Cuisine Type
**Frontend route:** `routes/operation-plan/cuisine`  •  **URL:** `/operation-plan/cuisine`
**Prefix:** `CUIS`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 15

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CUIS-010001 | แสดงรายการ Cuisine | High | Smoke |
| TC-CUIS-010002 | ค้นหา Cuisine ด้วยชื่อ | High | Functional |
| TC-CUIS-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-CUIS-010004 | แสดง Region badge ในตาราง | Low | Functional |
| TC-CUIS-020001 | เปิดหน้าแก้ไข Cuisine จาก list | Medium | Happy Path |
| TC-CUIS-030001 | สร้าง Cuisine ใหม่สำเร็จ | High | CRUD |
| TC-CUIS-030002 | สร้าง Cuisine พร้อม popular dishes / key ingredients | Medium | Happy Path |
| TC-CUIS-040001 | แก้ไขชื่อและ region แล้วค่าคงอยู่ | High | CRUD |
| TC-CUIS-040002 | สลับสถานะ Active เป็น Inactive | Medium | CRUD |
| TC-CUIS-050001 | ลบ Cuisine สำเร็จ | High | CRUD |
| TC-CUIS-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-CUIS-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้า Cuisine | High | Authorization |
| TC-CUIS-200001 | บันทึกไม่ได้เมื่อเว้น Name ว่าง | High | Validation |
| TC-CUIS-200002 | Region เป็นฟิลด์บังคับ | Medium | Validation |
| TC-CUIS-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |

---
## TC-CUIS-010001 — แสดงรายการ Cuisine
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/cuisine`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
ตารางแสดงคอลัมน์ Name และ Region (เป็น badge สี) พร้อม badge จำนวนรายการที่หัวหน้า

---
## TC-CUIS-010002 — ค้นหา Cuisine ด้วยชื่อ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มีหลาย cuisine
**Steps**
1. คลิกที่ช่อง Search
2. พิมพ์ชื่อ cuisine ที่มีอยู่
3. กด Enter
**Expected**
ตารางแสดงเฉพาะ cuisine ที่ตรงกับคำค้นหา

---
## TC-CUIS-010003 — กรองตามสถานะ Active/Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี cuisine ทั้งสถานะ active และ inactive
**Steps**
1. เปิด Status filter
2. เลือก Inactive
**Expected**
ตารางแสดงเฉพาะ cuisine ที่ inactive

---
## TC-CUIS-010004 — แสดง Region badge ในตาราง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี cuisine ที่กำหนด region (เช่น ASIA, EUROPE) อยู่
**Steps**
1. เปิดหน้า `/operation-plan/cuisine`
2. สังเกตคอลัมน์ Region
**Expected**
แต่ละแถวแสดง region เป็น Badge พร้อม label และสีตามค่า config ของ region นั้น

---
## TC-CUIS-020001 — เปิดหน้าแก้ไข Cuisine จาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ Name ของ cuisine ในตาราง
**Expected**
นำทางไปที่ `/operation-plan/cuisine/{id}` และฟอร์มแสดงข้อมูลเดิมในโหมด view

---
## TC-CUIS-030001 — สร้าง Cuisine ใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. คลิกปุ่ม Add
2. กรอก Name ด้วยค่าที่ไม่ซ้ำ
3. เลือก Region (ค่าเริ่มต้นคือ ASIA)
4. คลิก Create
**Expected**
แสดง toast สร้างสำเร็จ และ cuisine ใหม่ปรากฏในรายการ

---
## TC-CUIS-030002 — สร้าง Cuisine พร้อม popular dishes / key ingredients
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ในฟอร์มสร้าง cuisine ใหม่
**Steps**
1. กรอก Name และเลือก Region
2. กรอกรายการ Popular Dishes และ Key Ingredients (คั่นบรรทัด)
3. คลิก Create
**Expected**
cuisine ถูกสร้างพร้อมข้อมูล popular dishes และ key ingredients ที่บันทึกไว้

---
## TC-CUIS-040001 — แก้ไขชื่อและ region แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่สร้างไว้แล้ว
**Steps**
1. เปิด cuisine แล้วคลิก Edit
2. แก้ Name และเปลี่ยน Region
3. คลิก Save
4. reload หน้า
**Expected**
แสดง toast อัปเดตสำเร็จ; ชื่อและ region ใหม่แสดงในตารางและคงอยู่หลัง reload

---
## TC-CUIS-040002 — สลับสถานะ Active เป็น Inactive
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่ active อยู่
**Steps**
1. เปิด cuisine แล้วคลิก Edit
2. ปิด StatusSwitch (is_active)
3. คลิก Save
**Expected**
cuisine เปลี่ยนเป็นสถานะ inactive และแสดงเมื่อกรองด้วย Inactive filter

---
## TC-CUIS-050001 — ลบ Cuisine สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่สามารถลบได้
**Steps**
1. คลิก Delete ที่ cuisine
2. ยืนยันใน DeleteDialog
3. reload หน้า
**Expected**
แสดง toast ลบสำเร็จ; cuisine หายไปจากตารางและไม่กลับมาหลัง reload

---
## TC-CUIS-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. คลิก Delete ที่ cuisine
2. ใน DeleteDialog คลิก Cancel
**Expected**
Dialog ปิดลงโดยไม่ลบ และ cuisine ยังคงอยู่ในตาราง

---
## TC-CUIS-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้า Cuisine
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดู cuisine
**Steps**
1. ไปที่ `/operation-plan/cuisine`
**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูล cuisine

---
## TC-CUIS-200001 — บันทึกไม่ได้เมื่อเว้น Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้าง cuisine ใหม่
**Steps**
1. ปล่อยช่อง Name ว่าง
2. คลิก Create
**Expected**
แสดงข้อความ error "Name is required"; ไม่มีการสร้าง cuisine

---
## TC-CUIS-200002 — Region เป็นฟิลด์บังคับ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไข cuisine
**Steps**
1. ล้างค่า Region (ถ้าทำได้) แล้วพยายาม Save โดยกรอกเฉพาะ Name
**Expected**
แสดงข้อความ error "Region is required" หากไม่ได้เลือก region

---
## TC-CUIS-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`
**Steps**
1. พิมพ์คำค้นหาที่ไม่ตรงกับ cuisine ใด
2. กด Enter
**Expected**
ตารางไม่มีข้อมูลและแสดงสถานะว่าง (EmptyComponent)
