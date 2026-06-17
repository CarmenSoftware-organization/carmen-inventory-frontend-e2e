# Equipment — User Stories

_Authored from the test-case catalog `docs/test-cases/130-equipment.md` (documentation only — no automated spec yet)._

**Module:** Operation Plan — Equipment
**Frontend route:** `routes/operation-plan/equipment`  •  **URL:** `/operation-plan/equipment`
**Prefix:** `EQP`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 18

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EQP-010001 | แสดงรายการอุปกรณ์ | High | Smoke |
| TC-EQP-010002 | ค้นหาอุปกรณ์ด้วยชื่อ/รหัส | High | Functional |
| TC-EQP-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-EQP-010004 | สลับมุมมอง List / Grid | Low | Functional |
| TC-EQP-020001 | เปิดหน้ารายละเอียดอุปกรณ์ (view) | Medium | Happy Path |
| TC-EQP-030001 | สร้างอุปกรณ์ใหม่สำเร็จ (ฟิลด์บังคับครบ) | High | CRUD |
| TC-EQP-030002 | สร้างอุปกรณ์พร้อมข้อมูลผู้ผลิตและ station | Medium | Happy Path |
| TC-EQP-040001 | แก้ไขข้อมูลอุปกรณ์แล้วค่าคงอยู่ | High | CRUD |
| TC-EQP-040002 | แก้ไขจำนวน (available / total qty) | Medium | CRUD |
| TC-EQP-050001 | ลบอุปกรณ์สำเร็จ | High | CRUD |
| TC-EQP-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-EQP-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าอุปกรณ์ | High | Authorization |
| TC-EQP-200001 | บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง | High | Validation |
| TC-EQP-200002 | Category เป็นฟิลด์บังคับ | High | Validation |
| TC-EQP-200003 | ไม่รับจำนวนติดลบ | Medium | Validation |
| TC-EQP-400001 | กรอกข้อมูลตารางบำรุงรักษาและวันที่ | Medium | Functional |
| TC-EQP-410001 | กรอกคำแนะนำการใช้งาน / ความปลอดภัย / การทำความสะอาด | Low | Functional |
| TC-EQP-420001 | toggle Portable และ Active ในส่วน Additional | Low | Functional |

---
## TC-EQP-010001 — แสดงรายการอุปกรณ์
> **As an** Operation Planner, **I want** the equipment list page to load, **so that** I can review the equipment registered in my business unit.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีอุปกรณ์อย่างน้อย 1 รายการ

**Steps**
1. ไปที่ `/operation-plan/equipment`
2. รอให้ DataGrid โหลดเสร็จ

**Expected**
ตารางแสดงคอลัมน์ Code, Name, Category, Brand, Model, Station, Capacity พร้อม badge จำนวนรายการ

---
## TC-EQP-010002 — ค้นหาอุปกรณ์ด้วยชื่อ/รหัส
> **As an** Operation Planner, **I want** to search equipment by name or code, **so that** I can quickly find a specific item.

**Priority:** High · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment`; มีหลายอุปกรณ์

**Steps**
1. คลิกที่ช่อง Search
2. พิมพ์ชื่อหรือรหัสของอุปกรณ์ที่มีอยู่
3. กด Enter

**Expected**
ตารางแสดงเฉพาะอุปกรณ์ที่ตรงกับคำค้นหา

---
## TC-EQP-010003 — กรองตามสถานะ Active/Inactive
> **As an** Operation Planner, **I want** to filter equipment by status, **so that** I can focus on active equipment.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีอุปกรณ์ทั้งสถานะ active และ inactive

**Steps**
1. เปิด Status filter
2. เลือก Active

**Expected**
ตารางแสดงเฉพาะอุปกรณ์ที่ active และมี chip filter ปรากฏ

---
## TC-EQP-010004 — สลับมุมมอง List / Grid
> **As an** Operation Planner, **I want** to switch between list and grid views, **so that** I can browse equipment in the layout I prefer.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop

**Steps**
1. คลิกปุ่ม Grid view
2. คลิกปุ่ม List view กลับ

**Expected**
มุมมองสลับระหว่างการ์ดและตาราง โดยข้อมูลอุปกรณ์ยังครบ

---
## TC-EQP-020001 — เปิดหน้ารายละเอียดอุปกรณ์ (view)
> **As an** Operation Planner, **I want** to open an equipment's detail page, **so that** I can review its full information before editing.

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**
มีอุปกรณ์อย่างน้อย 1 รายการ

**Steps**
1. คลิกที่ Code ของอุปกรณ์ในตาราง

**Expected**
นำทางไปที่ `/operation-plan/equipment/{id}` ในโหมด view; toolbar แสดง code pill, status badge และปุ่ม Edit

---
## TC-EQP-030001 — สร้างอุปกรณ์ใหม่สำเร็จ (ฟิลด์บังคับครบ)
> **As an** Operation Planner, **I want** to create a new equipment record with all required fields, **so that** it is tracked in the operation.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี equipment category ที่ active

**Steps**
1. คลิกปุ่ม Add (ไปที่ `/operation-plan/equipment/new`)
2. กรอก Code และ Name ในส่วน General
3. เลือก Category จาก lookup
4. คลิก Create

**Expected**
แสดง toast สร้างสำเร็จ และอุปกรณ์ใหม่ปรากฏในรายการ

---
## TC-EQP-030002 — สร้างอุปกรณ์พร้อมข้อมูลผู้ผลิตและ station
> **As an** Operation Planner, **I want** to capture manufacturer and station details, **so that** the equipment record is complete and traceable.

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่

**Steps**
1. กรอก Code, Name และเลือก Category
2. กรอก Brand, Model, Serial No, Station, Capacity, Power Rating
3. คลิก Create

**Expected**
อุปกรณ์ถูกสร้างพร้อมข้อมูลผู้ผลิต และคอลัมน์ Brand/Model/Station/Capacity แสดงค่าในตาราง

---
## TC-EQP-040001 — แก้ไขข้อมูลอุปกรณ์แล้วค่าคงอยู่
> **As an** Operation Planner, **I want** my equipment edits to persist, **so that** the record stays up to date.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีอุปกรณ์ที่สร้างไว้แล้ว

**Steps**
1. เปิดอุปกรณ์จาก list แล้วคลิก Edit
2. แก้ไข Name และ Description
3. คลิก Save
4. เปิดอุปกรณ์นั้นอีกครั้ง

**Expected**
แสดง toast อัปเดตสำเร็จ; ค่าที่แก้ไขแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-040002 — แก้ไขจำนวน (available / total qty)
> **As an** Operation Planner, **I want** to maintain available and total quantities, **so that** equipment availability is accurate.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**
อยู่ในหน้า Edit ของอุปกรณ์ ในส่วน Quantity Settings

**Steps**
1. แก้ไข Available Qty และ Total Qty
2. คลิก Save

**Expected**
ค่าจำนวนถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-050001 — ลบอุปกรณ์สำเร็จ
> **As an** Operation Planner, **I want** to delete an equipment record, **so that** obsolete items are removed.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีอุปกรณ์ที่สามารถลบได้และอยู่ในโหมด Edit

**Steps**
1. เปิดอุปกรณ์แล้วคลิก Edit
2. คลิกปุ่ม Delete
3. ยืนยันใน DeleteDialog

**Expected**
แสดง toast ลบสำเร็จ; อุปกรณ์หายจากรายการ

---
## TC-EQP-050002 — ยกเลิกการลบใน dialog
> **As an** Operation Planner, **I want** to cancel a delete I started by mistake, **so that** the equipment is not removed.

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
อยู่ในหน้า Edit ของอุปกรณ์

**Steps**
1. คลิกปุ่ม Delete
2. ใน DeleteDialog คลิก Cancel

**Expected**
Dialog ปิดโดยไม่ลบ และยังอยู่ในหน้าอุปกรณ์เดิม

---
## TC-EQP-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าอุปกรณ์
> **As a** user without equipment permission, **I want** access to be blocked, **so that** unauthorized data is not exposed.

**Priority:** High · **Test Type:** Authorization

**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูอุปกรณ์

**Steps**
1. ไปที่ `/operation-plan/equipment`

**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูลอุปกรณ์

---
## TC-EQP-200001 — บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง
> **As an** Operation Planner, **I want** the form to block empty required fields, **so that** every equipment has a code and a name.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่

**Steps**
1. ปล่อย Code และ Name ว่าง
2. คลิก Create

**Expected**
แสดงข้อความ error required สำหรับ Code และ Name; ไม่มีการสร้างอุปกรณ์

---
## TC-EQP-200002 — Category เป็นฟิลด์บังคับ
> **As an** Operation Planner, **I want** the form to require a category, **so that** every equipment is classified.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ โดยกรอก Code และ Name แต่ยังไม่เลือก Category

**Steps**
1. ปล่อย Category ว่าง
2. คลิก Create

**Expected**
แสดงข้อความ error required สำหรับ Category; ไม่มีการสร้างอุปกรณ์

---
## TC-EQP-200003 — ไม่รับจำนวนติดลบ
> **As an** Operation Planner, **I want** the form to reject negative quantities, **so that** stock counts stay valid.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มแก้ไขอุปกรณ์ ในส่วน Quantity Settings

**Steps**
1. กรอก Available Qty หรือ Total Qty เป็นค่าติดลบ
2. คลิก Save

**Expected**
แสดงข้อความ error ว่าจำนวนต้องไม่น้อยกว่า 0; ไม่บันทึกค่า

---
## TC-EQP-400001 — กรอกข้อมูลตารางบำรุงรักษาและวันที่
> **As an** Operation Planner, **I want** to record maintenance schedule and dates, **so that** equipment upkeep can be planned.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
อยู่ในหน้า Edit ของอุปกรณ์ ในส่วน Maintenance

**Steps**
1. กรอก Maintenance Schedule
2. เลือก Last Maintenance Date และ Next Maintenance Date ด้วย date picker
3. คลิก Save

**Expected**
ข้อมูลตารางบำรุงรักษาและวันที่ถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-410001 — กรอกคำแนะนำการใช้งาน / ความปลอดภัย / การทำความสะอาด
> **As an** Operation Planner, **I want** to record operation, safety and cleaning instructions, **so that** staff have clear usage guidance.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ในหน้า Edit ของอุปกรณ์ ในส่วน Instructions

**Steps**
1. กรอก Operation Instructions, Safety Notes และ Cleaning Instructions
2. คลิก Save

**Expected**
ข้อความคำแนะนำทั้งสามถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-420001 — toggle Portable และ Active ในส่วน Additional
> **As an** Operation Planner, **I want** to toggle the portable and active flags, **so that** equipment attributes are accurate.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ในหน้า Edit ของอุปกรณ์ ในส่วน Additional

**Steps**
1. สลับ StatusSwitch ของ is_active
2. สลับ toggle is_portable
3. คลิก Save

**Expected**
สถานะ Active และ Portable ถูกบันทึกตามที่เลือก; toolbar badge แสดงสถานะ Active/Inactive ที่ถูกต้อง
