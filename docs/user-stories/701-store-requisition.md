# Store Requisition — User Stories

_Generated from `tests/701-store-requisition.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Store Requisition
**Spec:** `tests/701-store-requisition.spec.ts`
**Default role:** Purchase
**Total test cases:** 47 (16 High / 28 Medium / 3 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SR-010001 | Happy Path - Create Store Requisition | High | Happy Path |
| TC-SR-010002 | Negative - User Not Assigned to Department | Medium | Negative |
| TC-SR-010003 | Edge Case - No Source Locations Available | Medium | Edge Case |
| TC-SR-010004 | Negative - Invalid Input - Missing Expected Delivery Date | Medium | Negative |
| TC-SR-010005 | Alternate Flow - Quick Create from Template | Medium | Alternate Flow |
| TC-SR-020001 | Happy Path - Add Single Item | Medium | Happy Path |
| TC-SR-020002 | Negative - Invalid Quantity | Medium | Negative |
| TC-SR-020003 | Edge Case - Insufficient Stock | Medium | Edge Case |
| TC-SR-030001 | Happy Path - Sufficient Inventory | High | Happy Path |
| TC-SR-030002 | Negative Case - Insufficient Inventory | High | Negative |
| TC-SR-030003 | Edge Case - No Inventory Records | Medium | Edge Case |
| TC-SR-030004 | Edge Case - Inventory System Unavailable | High | Edge Case |
| TC-SR-040001 | Save as Draft with Valid Input | Medium | Happy Path |
| TC-SR-040002 | Save as Draft with Missing Requisition Number | Medium | Negative |
| TC-SR-040003 | Auto-Save Draft Every 60 Seconds | Low | Edge Case |
| TC-SR-040004 | Save and Close with Valid Input | Medium | Happy Path |
| TC-SR-040005 | Save Failure due to Network/Database Issue | Medium | Negative |
| TC-SR-050001 | Submit approved requisition with valid items | Medium | Happy Path |
| TC-SR-050002 | Submit requisition with missing destination locations | Medium | Negative |
| TC-SR-050003 | Submit requisition with empty line items | High | Negative |
| TC-SR-050004 | Submit requisition as an unauthorized user | Low | Negative |
| TC-SR-050005 | Submit requisition with emergency flag | Medium | Edge Case |
| TC-SR-060001 | Navigate to Store Requisitions with Pending Approvals | High | Happy Path |
| TC-SR-060002 | View Requisition Details with Filtered Columns | Medium | Happy Path |
| TC-SR-060003 | Bulk Action - Export Selected Requisitions | Medium | Happy Path |
| TC-SR-060004 | No Pending Approvals - Empty State | Low | Edge Case |
| TC-SR-060005 | Delegate Approvals for Unavailable User | High | Negative |
| TC-SR-070001 | Approve Requisition with No Quantity Adjustments | High | Happy Path |
| TC-SR-070002 | Unauthorized User Attempts to Approve Requisition | Medium | Negative |
| TC-SR-070003 | Budget Exceeded During Approval | Medium | Edge Case |
| TC-SR-080001 | Happy Path - Approve Item | Medium | Happy Path |
| TC-SR-080002 | Negative - Insufficient Stock for Issuance | High | Negative |
| TC-SR-080003 | Negative - No Permission | High | Negative |
| TC-SR-090001 | Adjust approved quantity: Happy path | High | Happy Path |
| TC-SR-090002 | Decrease approved quantity: Insufficient issued quantity | Medium | Negative |
| TC-SR-090003 | Decrease approved quantity: Fully issued item | High | Edge Case |
| TC-SR-090004 | Increase approved quantity: Stock insufficient | Medium | Negative |
| TC-SR-090005 | Concurrent modification detected | Medium | Edge Case |
| TC-SR-100001 | Request Review with Valid Comments and Specific Items | Medium | Happy Path |
| TC-SR-100002 | Request Review with Invalid Comments | High | Negative |
| TC-SR-100003 | Request Review with No Specific Items Selected | Medium | Edge Case |
| TC-SR-110001 | Primary Actor Rejects Requisition Successfully | High | Happy Path |
| TC-SR-110002 | User Enters Insufficient Rejection Reason | High | Edge Case |
| TC-SR-110003 | User Accidentally Rejects Requisition | Medium | Negative |
| TC-SR-110004 | User Rejects Specific Items Only | Medium | Alternate Flow |
| TC-SR-120001 | Happy Path - Full Issuance | High | Happy Path |
| TC-SR-120003 | Edge Case - Partial Issuance | Medium | Edge Case |

---

## TC-SR-010001 — Happy Path - Create Store Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Requestor ถูก assign ให้ department และมีสิทธิ์เข้าถึง source location อย่างน้อยหนึ่งแห่ง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'New Requisition'
3. กรอก Expected delivery date
4. กรอก Description/purpose
5. เลือก source location จาก dropdown 'Request From'
6. ตรวจสอบว่า requisition number ถูกสร้างอัตโนมัติ
7. ตรวจสอบว่า requisition date เป็นวันปัจจุบัน
8. ตรวจสอบว่า field 'Requested By' ถูกกรอกอัตโนมัติ
9. กด 'Save as Draft'

**Expected**

Requisition ถูกบันทึกเป็น draft สำเร็จ ส่วน inline item addition ถูก enable และ success message แสดงขึ้นมา

---

## TC-SR-010002 — Negative - User Not Assigned to Department

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com แต่ไม่ถูก assign ให้ department ใด

**Steps**

1. ไปที่ /store-operation/store-requisition
2. พยายามกด 'New Requisition'

**Expected**

ระบบแสดง error message 'You must be assigned to a department to create requisitions' และปุ่ม 'New Requisition' ถูก disable

---

## TC-SR-010003 — Edge Case - No Source Locations Available

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role Requestor ถูก assign ให้ department แต่ไม่มี source location ที่ได้รับอนุญาต

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'New Requisition'
3. พยายามเลือก source location จาก dropdown 'Request From'

**Expected**

ระบบแสดง warning message 'No storage locations available for your department' และแนะนำให้ติดต่อ administrator

---

## TC-SR-010004 — Negative - Invalid Input - Missing Expected Delivery Date

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role Requestor ถูก assign ให้ department และมีสิทธิ์เข้าถึง source location

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'New Requisition'
3. กรอก Description/purpose
4. เลือก source location จาก dropdown 'Request From'
5. ปล่อย field Expected delivery date ว่างไว้
6. พยายามกด 'Save as Draft'

**Expected**

ระบบแสดง error message สำหรับ Expected delivery date ที่ขาดหายไป และไม่บันทึก requisition

---

## TC-SR-010005 — Alternate Flow - Quick Create from Template

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**

ผู้ใช้มี role Requestor ถูก assign ให้ department มีสิทธิ์เข้าถึง source location และมี template อยู่

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'New Requisition'
3. เลือก 'Create from Template'
4. เลือก template ที่บันทึกไว้
5. กรอก Description/purpose
6. เลือก source location จาก dropdown 'Request From'
7. กรอก Expected delivery date
8. กด 'Save as Draft'

**Expected**

Requisition ถูกบันทึกเป็น draft จาก template สำเร็จ ส่วน inline item addition ถูก enable และ success message แสดงขึ้นมา

---

## TC-SR-020001 — Happy Path - Add Single Item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Requisition อยู่ใน Draft status ผู้ใช้เป็นผู้สร้าง requisition และ product master data พร้อมใช้งาน

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Add Item' button
3. พิมพ์ 'Office Chair' ใน search input
4. เลือก 'Office Chair' จาก CommandList
5. กรอก requested quantity '2'
6. ตรวจสอบว่า destination location ถูกต้อง
7. กด 'Add'

**Expected**

Item 'Office Chair' ถูกเพิ่มใน requisition พร้อมรายละเอียดที่ถูกต้อง

---

## TC-SR-020002 — Negative - Invalid Quantity

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Requisition อยู่ใน Draft status ผู้ใช้เป็นผู้สร้าง requisition และ product master data พร้อมใช้งาน

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Add Item' button
3. พิมพ์ 'Office Chair' ใน search input
4. เลือก 'Office Chair' จาก CommandList
5. กรอก requested quantity '-1'
6. กด 'Add'

**Expected**

ระบบแสดง error: 'Quantity must be greater than zero'

---

## TC-SR-020003 — Edge Case - Insufficient Stock

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Requisition อยู่ใน Draft status และ product 'Office Chair' มี stock ไม่เพียงพอ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Add Item' button
3. พิมพ์ 'Office Chair' ใน search input
4. เลือก 'Office Chair' จาก CommandList
5. กรอก requested quantity '5'
6. กด 'Add'

**Expected**

ระบบแสดง warning: 'Requested quantity exceeds available stock' และแนะนำทางเลือกอื่น

---

## TC-SR-030001 — Happy Path - Sufficient Inventory

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังแก้ไข requisition ที่มี product ถูกเลือกอยู่ และ Inventory Management system เข้าถึงได้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit' บน requisition ที่มีอยู่
3. อัปเดต requested quantity
4. ตรวจสอบว่าระบบ trigger การตรวจสอบ inventory แบบ real-time
5. ตรวจสอบค่า 'On Hand' และ 'On Order'
6. ตรวจสอบค่า 'Last Price' และ 'Last Vendor'
7. ตรวจสอบสถานะ stock 'Sufficient' ด้วย indicator สีเขียว
8. ตรวจสอบว่าไม่มี stock shortfall warning

**Expected**

ระบบแสดงสถานะ inventory ที่เพียงพอและจำนวนที่มีอยู่อย่างถูกต้อง

---

## TC-SR-030002 — Negative Case - Insufficient Inventory

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังแก้ไข requisition ที่มี product ถูกเลือกอยู่ และ Inventory Management system เข้าถึงได้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit' บน requisition ที่มีอยู่
3. อัปเดต requested quantity ให้เกิน stock ที่มีอยู่
4. ตรวจสอบว่าระบบ trigger การตรวจสอบ inventory แบบ real-time
5. ตรวจสอบสถานะ stock 'Low' ด้วย indicator สีเหลือง
6. ตรวจสอบว่าแสดงจำนวน stock shortfall และวันที่คาดว่าจะเติม stock
7. ตรวจสอบทางเลือกที่แนะนำ เช่น ลด quantity หรือเปลี่ยน location

**Expected**

ระบบแสดงสถานะ inventory ที่ไม่เพียงพอและทางเลือกที่แนะนำอย่างถูกต้อง

---

## TC-SR-030003 — Edge Case - No Inventory Records

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังแก้ไข requisition ที่มี product ถูกเลือกอยู่ และ Inventory Management system เข้าถึงได้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit' บน requisition ที่มีอยู่
3. เลือก product ที่ไม่มีบันทึก inventory
4. ตรวจสอบว่าระบบ trigger การตรวจสอบ inventory แบบ real-time
5. ตรวจสอบว่าระบบแสดง 'This product has no inventory records'
6. ตรวจสอบทางเลือกที่แนะนำ เช่น ติดต่อ storekeeper หรือพิจารณา purchase request

**Expected**

ระบบแสดงว่าไม่มีบันทึก inventory และแนะนำทางเลือกอื่นอย่างถูกต้อง

---

## TC-SR-030004 — Edge Case - Inventory System Unavailable

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังแก้ไข requisition ที่มี product ถูกเลือกอยู่ และ Inventory Management system เข้าถึงไม่ได้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit' บน requisition ที่มีอยู่
3. อัปเดต requested quantity
4. ตรวจสอบว่าระบบ trigger การตรวจสอบ inventory แบบ real-time
5. ตรวจสอบ warning message 'Unable to retrieve current stock levels'
6. ตรวจสอบว่าระบบแสดงข้อมูล inventory ที่ cache ไว้ล่าสุดพร้อม timestamp

**Expected**

ระบบจัดการกับข้อมูล inventory ที่ไม่พร้อมใช้งานโดยแสดงข้อมูลที่ cache ไว้อย่างถูกต้อง

---

## TC-SR-040001 — Save as Draft with Valid Input

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังทำงานบน requisition ที่กรอก header แล้วและเลือก source location แล้ว

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Save as Draft'

**Expected**

ระบบบันทึก requisition ด้วยสถานะ draft และแสดง success toast

---

## TC-SR-040002 — Save as Draft with Missing Requisition Number

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังทำงานบน requisition ที่ requisition number ว่างเปล่าและเลือก source location แล้ว

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Save as Draft'

**Expected**

ระบบแสดง validation error สำหรับ requisition number ที่ขาดหายไป

---

## TC-SR-040003 — Auto-Save Draft Every 60 Seconds

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังทำงานบน requisition และแก้ไขเป็นเวลามากกว่า 60 วินาที

**Steps**

1. ไปที่ /store-operation/store-requisition
2. รอ 60 วินาที
3. ตรวจสอบ auto-save indicator ที่ปรากฏเบาๆ

**Expected**

ระบบแสดง auto-save indicator ที่ [time] ว่า draft ถูก auto-save แล้ว

---

## TC-SR-040004 — Save and Close with Valid Input

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังทำงานบน requisition ที่กรอก header แล้วและเลือก source location แล้ว

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Save and Close'

**Expected**

ระบบบันทึก requisition ด้วยสถานะ draft นำทางไปยัง requisitions list และแสดง draft ที่บันทึกพร้อม Draft status badge

---

## TC-SR-040005 — Save Failure due to Network/Database Issue

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังทำงานบน requisition ที่กรอก header แล้วและเลือก source location แล้ว

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Save as Draft'

**Expected**

ระบบแสดง error message 'Failed to save requisition. Please try again.' และเก็บรักษาข้อมูลที่กรอกไว้ทั้งหมด

---

## TC-SR-050001 — Submit approved requisition with valid items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Requisition อยู่ใน Draft status พร้อม items และ quantities ที่ถูกต้อง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. ตรวจสอบว่า line items ทั้งหมดถูกต้อง
3. กด 'Submit for Approval'
4. ตรวจสอบว่าระบบแสดง confirmation dialog
5. ยืนยันการ submit
6. ตรวจสอบว่าสถานะเปลี่ยนเป็น In Process
7. ตรวจสอบว่า edit buttons ถูก disable
8. ตรวจสอบว่า workflow timeline แสดงขึ้นมา

**Expected**

สถานะ requisition อัปเดตเป็น In Progress โดยไม่มี error

---

## TC-SR-050002 — Submit requisition with missing destination locations

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Requisition อยู่ใน Draft status พร้อม items ที่ถูกต้องแต่ขาด destination locations

**Steps**

1. ไปที่ /store-operation/store-requisition
2. ตรวจสอบว่า destination locations ขาดหายไป
3. กด 'Submit for Approval'
4. ตรวจสอบว่าระบบแสดง validation errors
5. แก้ไข destination locations
6. กด 'Submit for Approval'
7. ตรวจสอบว่าระบบแสดง confirmation dialog
8. ยืนยันการ submit

**Expected**

Requisition ถูก submit สำเร็จหลังแก้ไข validation errors

---

## TC-SR-050003 — Submit requisition with empty line items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Requisition อยู่ใน Draft status โดยไม่มี items

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Submit for Approval'
3. ตรวจสอบว่าระบบแสดง error message

**Expected**

ระบบแสดง error message: 'Cannot submit requisition without items'

---

## TC-SR-050004 — Submit requisition as an unauthorized user

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

Requisition อยู่ใน Draft status แต่ผู้ใช้ไม่ใช่ผู้สร้าง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. พยายามกด 'Submit for Approval'

**Expected**

ระบบแสดง error message: 'Unauthorized to perform this action'

---

## TC-SR-050005 — Submit requisition with emergency flag

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Requisition อยู่ใน Draft status มี items ที่ถูกต้อง และถูกทำเครื่องหมายเป็น emergency

**Steps**

1. ไปที่ /store-operation/store-requisition
2. เลือก checkbox 'Mark as Emergency'
3. กรอก emergency justification (มากกว่า 50 ตัวอักษร)
4. กด 'Submit for Approval'

**Expected**

Requisition ถูก submit พร้อม emergency flag และถูกส่งไปยัง emergency approval workflow

---

## TC-SR-060001 — Navigate to Store Requisitions with Pending Approvals

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver ถูก assign ให้ขั้นตอน approval workflow และมี requisition ที่รอ approval อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. ตรวจสอบว่า badge จำนวน pending approvals แสดงอยู่
3. คลิก requisition
4. ตรวจสอบว่าหน้า requisition detail แสดงขึ้นมา

**Expected**

ผู้ใช้ถูกนำทางไปยังหน้า requisition detail พร้อมข้อมูลที่เกี่ยวข้องทั้งหมด

---

## TC-SR-060002 — View Requisition Details with Filtered Columns

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver ถูก assign ให้ขั้นตอน approval workflow และมี requisition ที่รอ approval อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Sort By' และเลือก 'Total Estimated Value'
3. กด 'Filter' และเลือก 'Department'
4. เลือก department และตรวจสอบว่า list อัปเดตตามนั้น

**Expected**

Requisition list ถูก sort ตาม total estimated value และ filter ตาม department ที่เลือก

---

## TC-SR-060003 — Bulk Action - Export Selected Requisitions

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver และเลือก requisitions หลายรายการ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. เลือก requisitions หลายรายการ
3. กด 'Bulk Actions' > 'Export Selected'
4. ตรวจสอบว่ากระบวนการ export เริ่มต้นและ file ถูก download

**Expected**

Requisitions ที่เลือกถูก export และ file ถูก download

---

## TC-SR-060004 — No Pending Approvals - Empty State

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role Approver แต่ไม่มี requisitions ที่รอ approval

**Steps**

1. ไปที่ /store-operation/store-requisition
2. ตรวจสอบว่า message 'No pending approvals' แสดงขึ้นมา

**Expected**

ระบบแสดง message 'No pending approvals' และแสดง empty state พร้อม icon

---

## TC-SR-060005 — Delegate Approvals for Unavailable User

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ในช่วงลาและมี pending approvals

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Delegate Approvals'
3. เลือก delegate user และช่วงวันที่
4. ยืนยันการ delegate
5. ตรวจสอบว่า notification ถูกส่งไปยัง delegate

**Expected**

Pending approvals ถูกโอนไปยัง delegate user และ notification ถูกส่ง

---

## TC-SR-070001 — Approve Requisition with No Quantity Adjustments

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status อยู่ในขั้นตอน approval ของผู้ใช้ และผู้ใช้มีสิทธิ์ approve ให้ department นี้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. คลิก Requisition ID
3. ตรวจสอบ Requisition number, date, requestor, department
4. ตรวจสอบ line items ในตาราง
5. ตรวจสอบความถูกต้องและความจำเป็น
6. กด 'Approve' button
7. กด 'Approve' ใน confirmation dialog
8. ตรวจสอบ success message 'Requisition approved successfully'

**Expected**

Requisition ถูก approve workflow history ถูกอัปเดต next stage ถูก assign และ notifications ถูกส่งไปยังผู้ที่เกี่ยวข้อง

---

## TC-SR-070002 — Unauthorized User Attempts to Approve Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status และผู้ใช้ไม่มีสิทธิ์ approve ให้ department นี้

**Steps**

1. ไปที่ /store-operation/store-requisition
2. คลิก Requisition ID
3. กด 'Approve' button
4. ตรวจสอบ error message 'You are not authorized to approve at this stage'

**Expected**

ผู้ใช้ถูกปฏิเสธสิทธิ์ approve requisition และ Approve button ยังคง disable อยู่

---

## TC-SR-070003 — Budget Exceeded During Approval

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role Approver มูลค่า requisition เกิน budget ของ department และผู้ใช้มีสิทธิ์ override budget

**Steps**

1. ไปที่ /store-operation/store-requisition
2. คลิก Requisition ID
3. ตรวจสอบ warning ว่า budget เกินกำหนด
4. กด 'Proceed with Approval' ใน warning dialog
5. ตรวจสอบ success message 'Requisition approved successfully'

**Expected**

Requisition ถูก approve workflow history ถูกอัปเดต next stage ถูก assign notifications ถูกส่ง budget warning แสดงและถูก override

---

## TC-SR-080001 — Happy Path - Approve Item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status item รอ approval และผู้ใช้มีสิทธิ์เข้าถึง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด action menu (three dots) สำหรับ line item
3. เลือก 'Approve'
4. ยืนยันการ approve

**Expected**

Item ถูก approve พร้อม green checkmark แสดง approved quantity ชื่อ approver และ timestamp success toast: 'Item approved' สถานะ requisition ยังคงเป็น In Progress หาก items อื่นยังรอ approval อยู่

---

## TC-SR-080002 — Negative - Insufficient Stock for Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Storekeeper มีสิทธิ์เข้าถึง source location requisition อยู่ใน Ready for Issuance status และ stock ของ item หนึ่งไม่เพียงพอ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Filter' และเลือก 'Ready for Issuance'
3. เลือก requisition สำหรับการ issuance
4. กด 'Record Issuance'
5. กรอก issued quantities สำหรับ items ทั้งหมด
6. กด 'Issue'

**Expected**

ระบบแสดง error message สำหรับ item ที่มี stock ไม่เพียงพอและป้องกันการ issuance

---

## TC-SR-080003 — Negative - No Permission

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com มี role Storekeeper requisition อยู่ใน In Progress status item รอ approval และผู้ใช้มีสิทธิ์เข้าถึง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด action menu (three dots) สำหรับ line item
3. พยายามเลือก 'Approve'

**Expected**

ระบบแสดง message: 'Insufficient permission to approve this item' และ action menu ไม่มีตัวเลือก 'Approve'

---

## TC-SR-090001 — Adjust approved quantity: Happy path

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver หรือ Storekeeper line item อยู่ใน approved status requisition ยังไม่ถูก issue ทั้งหมด และผู้ใช้มีสิทธิ์แก้ไข approvals

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit Approval' จาก item action menu
3. กรอก approved quantity ใหม่
4. กรอก adjustment reason
5. ยืนยันการ adjustment

**Expected**

Approved quantity ของ line item ถูกอัปเดต history ถูกบันทึก notification ถูกส่งไปยัง requestor และ success message แสดงขึ้นมา

---

## TC-SR-090002 — Decrease approved quantity: Insufficient issued quantity

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Item มี issued quantity และผู้ใช้พยายามลด approved quantity ให้ต่ำกว่า issued

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit Approval' จาก item action menu
3. กรอก approved quantity ใหม่ที่น้อยกว่า issued quantity
4. ตรวจสอบว่า error message แสดงขึ้นมา

**Expected**

Error message แสดง: 'Cannot reduce below already issued quantity'

---

## TC-SR-090003 — Decrease approved quantity: Fully issued item

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Item ถูก issue ทั้งหมดแล้ว

**Steps**

1. ไปที่ /store-operation/store-requisition
2. พยายามกด 'Edit Approval' จาก item action menu

**Expected**

Action menu ถูก disable และ message แสดง: 'Item fully issued. Cannot adjust approved quantity.'

---

## TC-SR-090004 — Increase approved quantity: Stock insufficient

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Item มี stock ไม่เพียงพอและผู้ใช้พยายามเพิ่ม approved quantity

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Edit Approval' จาก item action menu
3. กรอก approved quantity ใหม่ที่มากกว่า approved quantity ปัจจุบัน
4. ตรวจสอบว่า warning message แสดงขึ้นมา

**Expected**

Warning message แสดงขึ้นมาและไม่อนุญาตให้เพิ่ม

---

## TC-SR-090005 — Concurrent modification detected

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้รายอื่นแก้ไข item เดียวกันอยู่

**Steps**

1. ไปที่ /store-operation/store-requisition
2. พยายามกด 'Edit Approval' จาก item action menu
3. ตรวจสอบว่า message แสดง: 'This item was modified by [User]. Refresh and try again.'

**Expected**

Message แสดงขึ้นมา item ถูก reload ด้วยข้อมูลล่าสุด และผู้ใช้สามารถลอง adjustment อีกครั้ง

---

## TC-SR-100001 — Request Review with Valid Comments and Specific Items

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status และผู้ใช้มีข้อสงสัยที่ต้องการคำชี้แจง

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Request Review' button
3. กรอก review comments อย่างละเอียดใน text area
4. เลือก line items ที่ต้องการ review
5. ยืนยัน review request

**Expected**

Review request ถูกส่งไปยัง requestor ระบบแสดง success message ส่ง notification ไปยัง requestor และอัปเดตการแสดงผล requisition พร้อม review comments

---

## TC-SR-100002 — Request Review with Invalid Comments

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role Approver และ requisition อยู่ใน In Progress status

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Request Review' button
3. กรอก review comments น้อยกว่า 20 ตัวอักษรใน text area
4. ยืนยัน review request

**Expected**

ระบบแสดง error message: 'Review comments are required (min 20 characters)'

---

## TC-SR-100003 — Request Review with No Specific Items Selected

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role Approver และ requisition อยู่ใน In Progress status

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Request Review' button
3. กรอก review comments อย่างละเอียดใน text area
4. ไม่เลือก line items ใดสำหรับ review
5. ยืนยัน review request

**Expected**

ระบบถามว่า: 'Apply review to all items or select specific items?' ผู้ใช้ต้องเลือกอย่างน้อยหนึ่ง item ก่อนยืนยัน

---

## TC-SR-110001 — Primary Actor Rejects Requisition Successfully

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status และผู้ใช้พิจารณาแล้วว่าควร reject

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Reject' button ใน workflow component
3. กรอก rejection reason อย่างละเอียด: 'Specific policy violation'
4. ยืนยันการ reject

**Expected**

สถานะ requisition อัปเดตเป็น 'Rejected' rejection reason ถูกบันทึก notifications ถูกส่ง และ requisition ถูกลบออกจาก pending approvals list

---

## TC-SR-110002 — User Enters Insufficient Rejection Reason

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role Approver และ requisition อยู่ใน In Progress status

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Reject' button ใน workflow component
3. กรอก rejection reason: 'Insuff'
4. ยืนยันการ reject

**Expected**

ระบบแสดง error: 'Rejection reason must be at least 50 characters' ผู้ใช้ต้องกรอก reason อย่างละเอียด

---

## TC-SR-110003 — User Accidentally Rejects Requisition

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status และผู้ใช้ reject requisition โดยไม่ตั้งใจ

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Reject' button ใน workflow component
3. กรอก rejection reason: 'Accidental rejection'
4. ยืนยันการ reject

**Expected**

ระบบแสดง success message: 'Requisition rejected' ผู้ใช้สามารถ void rejection และ resubmit requisition ที่แก้ไขแล้วได้

---

## TC-SR-110004 — User Rejects Specific Items Only

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**

ผู้ใช้มี role Approver requisition อยู่ใน In Progress status และผู้ใช้พิจารณาแล้วว่าควร reject เฉพาะบาง items

**Steps**

1. ไปที่ /store-operation/store-requisition
2. เลือก 'Reject' จาก item-level action menu
3. กรอก rejection reason: 'Invalid request'
4. ยืนยันการ reject

**Expected**

Items ที่เลือกถูกทำเครื่องหมายเป็น rejected items อื่นดำเนินกระบวนการ approval ต่อ และสถานะ requisition อัปเดตเป็น 'Partially Rejected'

---

## TC-SR-120001 — Happy Path - Full Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Storekeeper มีสิทธิ์เข้าถึง source location และ requisition อยู่ใน Ready for Issuance status

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Filter' และเลือก 'Ready for Issuance'
3. เลือก requisition สำหรับการ issuance
4. กด 'Record Issuance'
5. กรอก issued quantities สำหรับ items ทั้งหมด
6. กด 'Issue'
7. เซ็นชื่อใน signature pad
8. กด 'Confirm Receipt'

**Expected**

Requisition ถูกทำเครื่องหมายเป็น completed เอกสาร issuance ถูกสร้าง และ stock balances ถูกอัปเดตตามนั้น

---

## TC-SR-120003 — Edge Case - Partial Issuance

> **As a** Purchase user, **I want** this Store Requisition behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Storekeeper มีสิทธิ์เข้าถึง source location และ requisition อยู่ใน Ready for Issuance status

**Steps**

1. ไปที่ /store-operation/store-requisition
2. กด 'Filter' และเลือก 'Ready for Issuance'
3. เลือก requisition สำหรับการ issuance
4. กด 'Record Issuance'
5. กรอก issued quantities บางส่วนสำหรับบาง items
6. กด 'Issue'
7. เซ็นชื่อใน signature pad
8. กด 'Confirm Receipt'

**Expected**

Requisition ยังคงอยู่ใน in progress status และ remaining quantities ถูกติดตาม

---


<sub>Last regenerated: 2026-05-07 · git 66a0085</sub>
