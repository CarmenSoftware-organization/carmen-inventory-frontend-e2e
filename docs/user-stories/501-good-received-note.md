# GRN — User Stories

_Generated from `tests/501-good-received-note.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** GRN
**Spec:** `tests/501-good-received-note.spec.ts`
**Default role:** Purchase
**Total test cases:** 76 (44 High / 24 Medium / 8 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-GRN-010001 | View GRN List as Authenticated User | High | Happy Path |
| TC-GRN-010002 | View GRN List with No GRNs | High | Negative |
| TC-GRN-010003 | View GRN List with Insufficient Permissions | High | Negative |
| TC-GRN-010004 | View GRN List with Large Number of GRNs | High | Edge Case |
| TC-GRN-020001 | Filter by GRN Number | High | Happy Path |
| TC-GRN-020002 | Clear Filters | High | Happy Path |
| TC-GRN-020003 | Invalid Search Term | High | Negative |
| TC-GRN-020004 | Search with Empty Term | High | Negative |
| TC-GRN-020005 | Filter by Vendor Name and Invoice Number | High | Happy Path |
| TC-GRN-030001 | Create GRN from Single PO - Happy Path | High | Happy Path |
| TC-GRN-030002 | Create GRN without Create GRN Permission | High | Negative |
| TC-GRN-030003 | Create GRN with No Vendor | High | Negative |
| TC-GRN-030004 | Create GRN with Invalid PO | High | Negative |
| TC-GRN-030005 | Create GRN with No Product in Catalog | High | Negative |
| TC-GRN-040002 | Create GRN from Multiple POs - Invalid PO Selection | High | Negative |
| TC-GRN-040003 | Create GRN from Multiple POs - No Permission | High | Negative |
| TC-GRN-040004 | Create GRN from Multiple POs - Edge Case - Partial POs | High | Edge Case |
| TC-GRN-050001 | Create Manual GRN with Valid Data | High | Happy Path |
| TC-GRN-050002 | Create Manual GRN without Permission | High | Negative |
| TC-GRN-050003 | Create Manual GRN with Missing Vendor | Medium | Negative |
| TC-GRN-050004 | Create Manual GRN with Empty Product Details | High | Negative |
| TC-GRN-050005 | Create Manual GRN with Large Number of Products | Medium | Edge Case |
| TC-GRN-060001 | Edit GRN Header - Happy Path | High | Happy Path |
| TC-GRN-060002 | Edit GRN Header - Invalid Currency | High | Negative |
| TC-GRN-060003 | Edit GRN Header - No Permission | High | Negative |
| TC-GRN-060004 | Edit GRN Header - Empty Fields | High | Negative |
| TC-GRN-060005 | Edit GRN Header - Future Date | High | Edge Case |
| TC-GRN-070001 | Happy Path - Add Line Item | High | Happy Path |
| TC-GRN-070002 | Invalid Input - Empty Product Name | High | Negative |
| TC-GRN-070003 | No Permission - User Tries to Add Item | High | Negative |
| TC-GRN-070004 | Edge Case - Add Item with Maximum Quantity | Medium | Edge Case |
| TC-GRN-080001 | Edit Existing Line Item - Happy Path | High | Happy Path |
| TC-GRN-080002 | Edit Line Item - Invalid Price Input | High | Negative |
| TC-GRN-080003 | Edit Line Item - No Permission | High | Negative |
| TC-GRN-080004 | Edit Line Item - No Line Items Exist | High | Edge Case |
| TC-GRN-080005 | Edit Line Item - GRN in RECEIVED Status | High | Edge Case |
| TC-GRN-090001 | Delete a valid line item from a draft GRN | Medium | Happy Path |
| TC-GRN-090002 | Attempt to delete a line item without edit permission | Medium | Negative |
| TC-GRN-090003 | Try to delete a line item from a received GRN | Medium | Negative |
| TC-GRN-090005 | Delete multiple line items at once from a draft GRN | Medium | Happy Path |
| TC-GRN-100001 | Happy Path - Add Extra Costs | Medium | Happy Path |
| TC-GRN-100002 | Negative - No Permission to Add Costs | Medium | Negative |
| TC-GRN-100003 | Edge Case - Invalid Cost Amount | Medium | Edge Case |
| TC-GRN-110001 | Happy Path - Commit GRN | High | Happy Path |
| TC-GRN-110002 | Negative - No Permission to Commit GRN | High | Negative |
| TC-GRN-110003 | Negative - Missing Storage Location | High | Negative |
| TC-GRN-110004 | Edge Case - Partially Received GRN | High | Edge Case |
| TC-GRN-120001 | Void GRN - Happy Path | Medium | Happy Path |
| TC-GRN-120002 | Void GRN - No Permission | Medium | Negative |
| TC-GRN-120003 | Void GRN - Committed GRN | Medium | Edge Case |
| TC-GRN-120004 | Void GRN - PO Status Reverted | Medium | Edge Case |
| TC-GRN-130001 | View Financial Summary - Happy Path | High | Happy Path |
| TC-GRN-130002 | View Financial Summary - No Permission | High | Negative |
| TC-GRN-130003 | View Financial Summary - Invalid GRN | Medium | Edge Case |
| TC-GRN-130004 | View Financial Summary - Outdated Calculations | High | Edge Case |
| TC-GRN-140001 | View stock movements for committed GRN | High | Happy Path |
| TC-GRN-140002 | User without permission cannot access stock movements | High | Negative |
| TC-GRN-140003 | No stock movements when GRN is not committed | High | Edge Case |
| TC-GRN-150001 | Add valid comment | Medium | Happy Path |
| TC-GRN-150002 | Attempt to add comment without permission | Medium | Negative |
| TC-GRN-150003 | Add comment with empty text | Medium | Negative |
| TC-GRN-150004 | Add comment with very long text | Medium | Edge Case |
| TC-GRN-150005 | Add multiple comments | Medium | Happy Path |
| TC-GRN-160001 | Happy Path - Upload Valid Attachments | High | Happy Path |
| TC-GRN-160002 | Negative - Upload Without Edit Permission | Medium | Negative |
| TC-GRN-160003 | Negative - Upload Invalid File Type | Medium | Negative |
| TC-GRN-160004 | Edge Case - Upload Maximum Allowed Files | Low | Edge Case |
| TC-GRN-160005 | Negative - No Files to Upload | Low | Negative |
| TC-GRN-170001 | View Activity Log with Valid GRN | Medium | Happy Path |
| TC-GRN-170002 | View Activity Log without Permission | Medium | Negative |
| TC-GRN-170003 | View Activity Log for Non-Existent GRN | Low | Edge Case |
| TC-GRN-170004 | View Activity Log with No Activity | Low | Edge Case |
| TC-GRN-180001 | Performing a bulk approval action | Low | Happy Path |
| TC-GRN-180002 | User attempts to perform bulk action without edit permission | Low | Negative |
| TC-GRN-180003 | User attempts to perform bulk action on a GRN in RECEIVED status | Low | Negative |
| TC-GRN-180004 | Perform bulk action with no line items selected | Low | Edge Case |

---

## TC-GRN-010001 — View GRN List as Authenticated User

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็นผู้ใช้ที่มีสิทธิ์ดู GRN; มี GRN อย่างน้อยหนึ่งรายการในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. ตรวจสอบว่ารายการ GRN แสดง
3. เลือก GRN เพื่อดูรายละเอียด

**Expected**

รายการ GRN แสดงพร้อมข้อมูลปัจจุบัน ผู้ใช้สามารถเลือก GRN เพื่อดูรายละเอียดได้

---

## TC-GRN-010002 — View GRN List with No GRNs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ดู GRN; ไม่มี GRN ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. ตรวจสอบว่าข้อความ empty state แสดง

**Expected**

ข้อความ empty state แสดงว่าไม่มี GRN ให้แสดง

---

## TC-GRN-010003 — View GRN List with Insufficient Permissions

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็นผู้ใช้ที่ไม่มีสิทธิ์ดู GRN; มี GRN อย่างน้อยหนึ่งรายการในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. ตรวจสอบว่าการเข้าถึงถูกปฏิเสธหรือแสดงข้อความแจ้งข้อผิดพลาดที่เหมาะสม

**Expected**

การเข้าถึงถูกปฏิเสธหรือแสดงข้อความแจ้งข้อผิดพลาดที่เหมาะสม

---

## TC-GRN-010004 — View GRN List with Large Number of GRNs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ดู GRN; มี GRN จำนวนมากในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. ตรวจสอบว่า pagination ทำงานตามที่คาดหวัง
3. เลื่อนผ่านหลายหน้าของ GRN

**Expected**

Pagination ทำงานตามที่คาดหวัง ผู้ใช้สามารถเลื่อนผ่านหลายหน้าของ GRN ได้

---

## TC-GRN-020001 — Filter by GRN Number

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้อยู่ที่หน้า GRN List และมี GRN ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กรอก 'GRN number' ด้วย GRN number ที่ถูกต้อง
3. ตรวจสอบว่ารายการ GRN ที่กรองแล้วรวม GRN number ที่กรอก

**Expected**

รายการ GRN กรองแสดงเฉพาะ GRN ที่มีหมายเลขที่กรอก

---

## TC-GRN-020002 — Clear Filters

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ได้ apply filter ให้กับรายการ GRN แล้ว

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดปุ่ม 'Clear Filters'
3. ตรวจสอบว่ารายการ GRN กลับสู่มุมมองเต็ม

**Expected**

รายการ GRN กลับสู่สถานะเริ่มต้นพร้อมบันทึกทั้งหมด visible

---

## TC-GRN-020003 — Invalid Search Term

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ที่หน้า GRN List และมี GRN ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กรอกช่อง 'Search' ด้วยคำค้นหาที่ไม่ถูกต้อง
3. รอ 5 วินาที
4. ตรวจสอบว่าไม่มีบันทึกแสดง

**Expected**

ไม่มี GRN แสดงและรายการยังคงไม่มีการกรอง

---

## TC-GRN-020004 — Search with Empty Term

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ที่หน้า GRN List และมี GRN ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. ล้างช่อง 'Search'
3. ตรวจสอบว่ารายการ GRN กลับสู่มุมมองเต็ม

**Expected**

รายการ GRN กลับสู่สถานะเริ่มต้นพร้อมบันทึกทั้งหมด visible

---

## TC-GRN-020005 — Filter by Vendor Name and Invoice Number

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้อยู่ที่หน้า GRN List และมี GRN ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กรอก 'Vendor name' ด้วยชื่อ vendor ที่ถูกต้อง
3. กรอก 'Invoice number' ด้วยหมายเลข invoice ที่ถูกต้อง
4. ตรวจสอบว่ารายการ GRN ที่กรองแล้วรวม vendor และ invoice ที่กรอก

**Expected**

รายการ GRN กรองแสดงเฉพาะ GRN ที่ตรงกับ vendor name และ invoice number ที่กรอก

---

## TC-GRN-030001 — Create GRN from Single PO - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; มี vendor ที่มี PO เปิด/บางส่วนอย่างน้อยหนึ่งราย; สินค้าใน PO มีอยู่ใน product catalog

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'New GRN'
3. เลือก vendor
4. เลือก PO
5. กรอก quantity ที่รับ
6. กด 'Submit'

**Expected**

GRN ถูกสร้างพร้อม status RECEIVED, GRN number ถูกสร้างอัตโนมัติ, line item มาจาก PO, PO status อัปเดต (ถ้ารับครบ)

---

## TC-GRN-030002 — Create GRN without Create GRN Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Create GRN'

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'New GRN'

**Expected**

ผู้ใช้ไม่สามารถสร้าง GRN ได้และได้รับข้อความแจ้งข้อผิดพลาด 'Insufficient permission to create GRN'

---

## TC-GRN-030003 — Create GRN with No Vendor

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; ไม่มี vendor ที่มี PO เปิด/บางส่วน

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'New GRN'

**Expected**

ผู้ใช้ไม่สามารถสร้าง GRN ได้และได้รับข้อความแจ้งข้อผิดพลาด 'No vendor with open/partial POs found'

---

## TC-GRN-030004 — Create GRN with Invalid PO

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; มี vendor ที่มี PO ที่ไม่ถูกต้องอย่างน้อยหนึ่งราย

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'New GRN'
3. เลือก vendor
4. เลือก PO ที่ไม่ถูกต้อง
5. กรอก quantity ที่รับ

**Expected**

ผู้ใช้ไม่สามารถสร้าง GRN ได้และได้รับข้อความแจ้งข้อผิดพลาด 'Invalid purchase order selected'

---

## TC-GRN-030005 — Create GRN with No Product in Catalog

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มี PO เปิด/บางส่วน; สินค้าใน PO ไม่มีใน product catalog

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'New GRN'
3. เลือก vendor
4. เลือก PO

**Expected**

ผู้ใช้ไม่สามารถสร้าง GRN ได้และได้รับข้อความแจ้งข้อผิดพลาด 'Products in PO not found in product catalog'

---

## TC-GRN-040002 — Create GRN from Multiple POs - Invalid PO Selection

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มี PO เปิด/บางส่วนหลายรายการ; PO อยู่ในสกุลเงินที่แตกต่างกัน

**Steps**

1. ไปที่ /procurement/purchase-order
2. กด 'Create GRN'
3. พยายามเลือก PO จาก vendor ต่างรายหรือสกุลเงินต่างกัน
4. กด 'Submit'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดห้ามการสร้าง GRN จาก PO ของ vendor ต่างรายหรือสกุลเงินต่างกัน

---

## TC-GRN-040003 — Create GRN from Multiple POs - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Create GRN'; vendor มี PO เปิด/บางส่วนหลายรายการ

**Steps**

1. ไปที่ /procurement/purchase-order
2. กด 'Create GRN'
3. พยายามเลือก PO และสร้าง GRN

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดปฏิเสธสิทธิ์ป้องกันการสร้าง GRN

---

## TC-GRN-040004 — Create GRN from Multiple POs - Edge Case - Partial POs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มี PO เปิด/บางส่วนหลายรายการ

**Steps**

1. ไปที่ /procurement/purchase-order
2. กด 'Create GRN'
3. เลือก PO ที่รับบางส่วน
4. กด 'Submit'

**Expected**

GRN ถูกสร้างพร้อม line item จาก PO ที่รับบางส่วน, แต่ละ line item อ้างอิง PO ต้นทาง, PO ต้นทางทั้งหมดถูกอัปเดตพร้อม GRN reference

---

## TC-GRN-050001 — Create Manual GRN with Valid Data

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มีอยู่ในระบบ; สินค้ามีใน catalog

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Create New GRN'
3. กรอก vendor field
4. กรอกรายละเอียดสินค้า
5. ตรวจสอบข้อมูล GRN
6. กด 'Save'

**Expected**

GRN ถูกสร้างโดยไม่มี PO reference, status ตั้งเป็น RECEIVED, ไม่มีการอัปเดต PO status, activity log บันทึกการสร้างแบบ manual

---

## TC-GRN-050002 — Create Manual GRN without Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Create GRN'

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. พยายามกด 'Create New GRN'

**Expected**

ผู้ใช้ไม่สามารถกด 'Create New GRN' ได้หรือแสดงข้อความแจ้งข้อผิดพลาดที่เหมาะสม

---

## TC-GRN-050003 — Create Manual GRN with Missing Vendor

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor ไม่มีอยู่ในระบบ

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Create New GRN'
3. พยายามกรอก vendor field
4. ตรวจสอบข้อความแจ้งข้อผิดพลาด

**Expected**

ข้อความแจ้งข้อผิดพลาดระบุว่า vendor ไม่มีอยู่ในระบบ

---

## TC-GRN-050004 — Create Manual GRN with Empty Product Details

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มีอยู่ในระบบ; สินค้ามีใน catalog

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Create New GRN'
3. กรอก vendor field
4. กรอกรายละเอียดสินค้าด้วย field ว่างเปล่า
5. พยายามกด 'Save'

**Expected**

ข้อความแจ้งข้อผิดพลาดระบุว่ารายละเอียดสินค้าไม่สามารถว่างเปล่าได้

---

## TC-GRN-050005 — Create Manual GRN with Large Number of Products

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create GRN'; vendor มีอยู่ในระบบ; สินค้ามีใน catalog

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Create New GRN'
3. กรอก vendor field
4. กรอกรายละเอียดสินค้าจำนวนมาก
5. ตรวจสอบว่าระบบรองรับสินค้าจำนวนมากได้โดยไม่ crash

**Expected**

GRN ถูกสร้างโดยไม่มี PO reference, status ตั้งเป็น RECEIVED, ไม่มีการอัปเดต PO status, activity log บันทึกการสร้างแบบ manual, และระบบรองรับสินค้าจำนวนมากได้โดยไม่มีปัญหา

---

## TC-GRN-060001 — Edit GRN Header - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; GRN ยังไม่ได้ commit

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Edit' ที่ GRN
3. กรอก 'Received Date' ด้วยวันที่ใหม่
4. กรอก 'Invoice Number' ด้วยหมายเลขใหม่
5. กรอก 'Currency' ด้วยสกุลเงินใหม่
6. กด 'Save'

**Expected**

GRN header ถูกอัปเดตด้วยข้อมูลใหม่, activity log บันทึกการเปลี่ยนแปลง, การคำนวณทางการเงินอัปเดตหาก currency เปลี่ยน

---

## TC-GRN-060002 — Edit GRN Header - Invalid Currency

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; GRN ยังไม่ได้ commit; เลือก currency ที่ไม่ถูกต้อง

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Edit' ที่ GRN
3. เลือก currency ที่ไม่ถูกต้องจาก dropdown
4. กด 'Save'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดเกี่ยวกับ currency ที่ไม่ถูกต้อง, GRN header ยังคงไม่เปลี่ยนแปลง

---

## TC-GRN-060003 — Edit GRN Header - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้ไม่มีสิทธิ์แก้ไข; GRN ยังไม่ได้ commit

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Edit' ที่ GRN
3. พยายามแก้ไข 'Received Date'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดว่าสิทธิ์ไม่เพียงพอ, GRN header ยังคงไม่เปลี่ยนแปลง

---

## TC-GRN-060004 — Edit GRN Header - Empty Fields

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; GRN ยังไม่ได้ commit

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Edit' ที่ GRN
3. ปล่อย field ทั้งหมดว่างเปล่า
4. กด 'Save'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดสำหรับ field ที่จำเป็นทั้งหมด, GRN header ยังคงไม่เปลี่ยนแปลง

---

## TC-GRN-060005 — Edit GRN Header - Future Date

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; GRN ยังไม่ได้ commit

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Edit' ที่ GRN
3. กรอก 'Received Date' ด้วยวันที่ในอนาคต
4. กด 'Save'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดเกี่ยวกับวันที่ไม่ถูกต้อง, GRN header ยังคงไม่เปลี่ยนแปลง

---

## TC-GRN-070001 — Happy Path - Add Line Item

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; สามารถเข้าถึง product catalog ได้

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดปุ่ม 'Add Item'
4. กรอกชื่อสินค้า, quantity และราคา
5. กด 'Save'

**Expected**

เพิ่ม line item ใหม่ใน GRN, ยอดรวมทางการเงินถูกคำนวณใหม่, activity log อัปเดต

---

## TC-GRN-070002 — Invalid Input - Empty Product Name

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; สามารถเข้าถึง product catalog ได้

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดปุ่ม 'Add Item'
4. ปล่อย field ชื่อสินค้าว่างเปล่า
5. กรอก quantity และราคา
6. กด 'Save'

**Expected**

แสดงข้อความแจ้งข้อผิดพลาดสำหรับชื่อสินค้าที่ว่างเปล่า, ไม่มีการเพิ่ม line item

---

## TC-GRN-070003 — No Permission - User Tries to Add Item

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้ไม่มีสิทธิ์แก้ไข; สามารถเข้าถึง product catalog ได้

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดปุ่ม 'Add Item'
4. กรอกชื่อสินค้า, quantity และราคา
5. กด 'Save'

**Expected**

ผู้ใช้ได้รับข้อความแจ้งข้อผิดพลาดปฏิเสธสิทธิ์, ไม่สามารถเพิ่ม line item ได้

---

## TC-GRN-070004 — Edge Case - Add Item with Maximum Quantity

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN อยู่ใน status DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; สามารถเข้าถึง product catalog ได้; กำหนด quantity สูงสุดสำหรับสินค้า

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดปุ่ม 'Add Item'
4. กรอกชื่อสินค้า, quantity สูงสุด และราคา
5. กด 'Save'

**Expected**

บังคับใช้ quantity สูงสุด, ยอดรวมทางการเงินถูกคำนวณใหม่, activity log อัปเดต

---

## TC-GRN-080001 — Edit Existing Line Item - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. คลิก GRN number ในรายการ
3. ไปที่แท็บ 'Items'
4. เลือก line item ที่ต้องการแก้ไข
5. กรอก quantity, ราคา, location ใหม่
6. กด 'Save'

**Expected**

Line item ถูกอัปเดต, ยอดรวมทางการเงินถูกคำนวณใหม่, activity log บันทึกการเปลี่ยนแปลง

---

## TC-GRN-080002 — Edit Line Item - Invalid Price Input

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. คลิก GRN number ในรายการ
3. ไปที่แท็บ 'Items'
4. เลือก line item ที่ต้องการแก้ไข
5. กรอกราคาที่ไม่ถูกต้อง (ค่าที่ไม่ใช่ตัวเลข)
6. กด 'Save'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดและไม่อัปเดต line item

---

## TC-GRN-080003 — Edit Line Item - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item; ผู้ใช้ไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. คลิก GRN number ในรายการ
3. ไปที่แท็บ 'Items'
4. พยายามเลือก line item เพื่อแก้ไข

**Expected**

ผู้ใช้ถูกปฏิเสธการเข้าถึงและไม่สามารถแก้ไข line item ได้

---

## TC-GRN-080004 — Edit Line Item - No Line Items Exist

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN อยู่ใน status DRAFT; ไม่มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. คลิก GRN number ในรายการ
3. ไปที่แท็บ 'Items'

**Expected**

ระบบแสดงข้อความแจ้งว่าไม่มี line item ที่จะแก้ไข

---

## TC-GRN-080005 — Edit Line Item - GRN in RECEIVED Status

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN อยู่ใน status RECEIVED; มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. คลิก GRN number ในรายการ
3. ไปที่แท็บ 'Items'

**Expected**

ระบบแสดงข้อความแจ้งว่าไม่สามารถแก้ไข GRN ได้

---

## TC-GRN-090001 — Delete a valid line item from a draft GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดไอคอน 'Delete' ที่ line item
4. ยืนยัน dialog การลบ

**Expected**

Line item ถูกลบ, หมายเลขแถวถูกเรียงใหม่, ยอดรวมทางการเงินถูกคำนวณใหม่, activity log อัปเดต

---

## TC-GRN-090002 — Attempt to delete a line item without edit permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item; ผู้ใช้ไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดไอคอน 'Delete' ที่ line item

**Expected**

ผู้ใช้เห็นข้อความแจ้งข้อผิดพลาดว่าสิทธิ์ไม่เพียงพอ

---

## TC-GRN-090003 — Try to delete a line item from a received GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN อยู่ใน status RECEIVED; มี line item; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. กดไอคอน 'Delete' ที่ line item

**Expected**

ผู้ใช้เห็นคำเตือนว่า GRN อยู่ใน state ที่แก้ไขไม่ได้และไม่สามารถแก้ไขได้

---

## TC-GRN-090005 — Delete multiple line items at once from a draft GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN อยู่ใน status DRAFT; มี line item หลายรายการ; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กดแท็บ 'Items'
3. เลือก line item หลายรายการ
4. กดไอคอน 'Delete'

**Expected**

Line item ที่เลือกถูกลบ, หมายเลขแถวถูกเรียงใหม่, ยอดรวมทางการเงินถูกคำนวณใหม่, activity log อัปเดต

---

## TC-GRN-100001 — Happy Path - Add Extra Costs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN มีอยู่จริงและไม่ใช่ VOID; มี line item อย่างน้อยหนึ่งรายการ; ผู้ใช้มีสิทธิ์เพิ่มต้นทุน

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Add Extra Costs'
3. เลือก 'Freight'
4. กรอกจำนวน
5. เลือก 'Handling'
6. กรอกจำนวน
7. เลือก 'Customs'
8. กรอกจำนวน
9. กด 'Save'

**Expected**

รายการ extra cost เพิ่มใน GRN, ต้นทุนกระจายไปยัง line item, ยอดรวม line item อัปเดต, ยอดรวม GRN เพิ่มขึ้นตาม extra costs, activity log บันทึก

---

## TC-GRN-100002 — Negative - No Permission to Add Costs

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists (not VOID); at least one line item exists; user does not have permission to add costs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Add Extra Costs'

**Expected**

System displays error message indicating insufficient permissions, 'Add Extra Costs' button remains disabled.

---

## TC-GRN-100003 — Edge Case - Invalid Cost Amount

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN มีอยู่จริงและไม่ใช่ VOID; มี line item อย่างน้อยหนึ่งรายการ; ผู้ใช้มีสิทธิ์เพิ่มต้นทุน

**Steps**

1. ไปที่ /procurement/goods-receive-note
2. กด 'Add Extra Costs'
3. เลือก 'Freight'
4. กรอกจำนวนติดลบ
5. เลือก 'Handling'
6. กรอกจำนวนเป็นศูนย์
7. กด 'Save'

**Expected**

ระบบแสดงข้อความแจ้งข้อผิดพลาดสำหรับจำนวนที่ไม่ถูกต้อง, ค่า freight ไม่ถูกเพิ่ม, ค่า handling ไม่ถูกเพิ่ม, ไม่มีการเปลี่ยนแปลงกับ GRN หรือ line item

---

## TC-GRN-110001 — Happy Path - Commit GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists in RECEIVED status; user has 'Commit GRN' permission; all line items have storage locations; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Click 'Commit GRN'
4. Verify GRN status changed to COMMITTED
5. Verify stock movements created for all line items
6. Verify inventory quantities updated

**Expected**

GRN status changed to COMMITTED, stock movements created, inventory quantities updated.

---

## TC-GRN-110002 — Negative - No Permission to Commit GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; user does not have 'Commit GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Attempt to click 'Commit GRN'
4. Verify an error message appears

**Expected**

Error message displayed preventing GRN commitment.

---

## TC-GRN-110003 — Negative - Missing Storage Location

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; user has 'Commit GRN' permission; one line item is missing storage location; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN in RECEIVED status
3. Attempt to click 'Commit GRN'
4. Verify an error message appears indicating missing storage location

**Expected**

Error message displayed indicating missing storage location.

---

## TC-GRN-110004 — Edge Case - Partially Received GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists with some line items received and others not; user has 'Commit GRN' permission; all required fields are complete

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN with partially received items
3. Attempt to click 'Commit GRN'
4. Verify an error message appears

**Expected**

Error message displayed preventing full GRN commitment.

---

## TC-GRN-120001 — Void GRN - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

A GRN exists in RECEIVED status and the user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the status changed to VOID

**Expected**

The GRN status is updated to VOID.

---

## TC-GRN-120002 — Void GRN - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

A GRN exists in COMMITTED status and the user does not have 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Attempt to click 'Void' button
4. Verify an error message is displayed

**Expected**

The user is unable to void the GRN and receives an error message.

---

## TC-GRN-120003 — Void GRN - Committed GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A GRN exists in COMMITTED status and the user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the status is reverted to RECEIVED
5. Verify the stock movements are reversed
6. Verify the Journal Voucher (JV) is reversed

**Expected**

The GRN status is updated to RECEIVED, stock movements are reversed, and the JV is reversed.

---

## TC-GRN-120004 — Void GRN - PO Status Reverted

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

A GRN exists in COMMITTED status and the PO status is pending; user has 'Void GRN' permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Locate the GRN to be voided
3. Click 'Void' button
4. Verify the PO status is reverted

**Expected**

The PO status is reverted.

---

## TC-GRN-130001 — View Financial Summary - Happy Path

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists and financial calculations are complete

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify financial totals and breakdown displayed

**Expected**

User sees complete financial breakdown with tax details and accounting preview.

---

## TC-GRN-130002 — View Financial Summary - No Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

GRN exists and financial calculations are complete; user does not have view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify access is denied or feature is greyed out

**Expected**

User is unable to view financial summary and receives appropriate access denied message.

---

## TC-GRN-130003 — View Financial Summary - Invalid GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Invalid or non-existent GRN

**Steps**

1. Navigate to GRN detail page
2. Enter invalid GRN in search
3. Click 'Financial Summary' tab
4. Verify error message or empty state

**Expected**

System displays error message or shows empty state indicating no financial summary available.

---

## TC-GRN-130004 — View Financial Summary - Outdated Calculations

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

GRN exists but financial calculations are not yet complete

**Steps**

1. Navigate to GRN detail page
2. Click 'Financial Summary' tab
3. Verify message or state indicating calculations are pending

**Expected**

System displays message or state indicating financial summary is not available until calculations are complete.

---

## TC-GRN-140001 — View stock movements for committed GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

A GRN exists in COMMITTED status with stock movements created during commit

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN detail page (status = COMMITTED)
3. Click on 'Stock Movements' tab
4. Verify stock movements are displayed correctly

**Expected**

Stock movements are correctly displayed, showing the impact on inventory.

---

## TC-GRN-140002 — User without permission cannot access stock movements

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

User does not have permission to view stock movements

**Steps**

1. Log in as a user without permission to view stock movements
2. Navigate to /procurement/goods-receive-note
3. Try to click on the GRN detail page (status = COMMITTED)
4. Try to click on 'Stock Movements' tab
5. Verify access is denied

**Expected**

System denies access to stock movements and displays appropriate error message.

---

## TC-GRN-140003 — No stock movements when GRN is not committed

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

A GRN exists but is not in COMMITTED status

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on the GRN detail page (status != COMMITTED)
3. Click on 'Stock Movements' tab
4. Verify no stock movements are displayed

**Expected**

No stock movements are displayed, and user is informed that there are none.

---

## TC-GRN-150001 — Add valid comment

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with valid text
4. Click 'Add Comment'

**Expected**

Comment is added to GRN and visible to all users with access, activity log records comment addition.

---

## TC-GRN-150002 — Attempt to add comment without permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists and user has no view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab

**Expected**

User cannot see or add comments, system denies access.

---

## TC-GRN-150003 — Add comment with empty text

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with no text
4. Click 'Add Comment'

**Expected**

System displays error message and does not add empty comment.

---

## TC-GRN-150004 — Add comment with very long text

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with extremely long text (exceeds maximum allowed length)
4. Click 'Add Comment'

**Expected**

System displays error message and does not add comment with long text.

---

## TC-GRN-150005 — Add multiple comments

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists and user has view permission

**Steps**

1. Navigate to GRN detail page
2. Click 'Comments & Attachments' tab
3. Fill 'Comment' field with valid text
4. Click 'Add Comment'
5. Repeat steps 3-4 to add multiple comments

**Expected**

Multiple comments are added to GRN and visible to all users with access, activity log records each comment addition.

---

## TC-GRN-160001 — Happy Path - Upload Valid Attachments

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

GRN exists; user has edit permission; valid documents exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload valid documents
5. Click 'Submit'

**Expected**

Attachments are uploaded and linked to GRN, files are accessible to authorized users, activity log records upload.

---

## TC-GRN-160002 — Negative - Upload Without Edit Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists; user does not have edit permission; valid documents exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Attempt to select and upload documents

**Expected**

User cannot upload documents, error message displayed.

---

## TC-GRN-160003 — Negative - Upload Invalid File Type

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists; user has edit permission; invalid document type exists (e.g., .exe)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload invalid file type
5. Click 'Submit'

**Expected**

Upload fails, error message displayed.

---

## TC-GRN-160004 — Edge Case - Upload Maximum Allowed Files

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists; user has edit permission; maximum allowed number of files exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Select and upload maximum allowed number of files
5. Click 'Submit'

**Expected**

Maximum allowed files are uploaded, no additional files can be added.

---

## TC-GRN-160005 — Negative - No Files to Upload

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists; user has edit permission; no files exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Comments & Attachments'
3. Click 'Upload Attachments'
4. Attempt to upload files

**Expected**

Upload fails, no files are uploaded.

---

## TC-GRN-170001 — View Activity Log with Valid GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

GRN exists in any status and user has view permission (audit access)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN that exists
3. Click on 'Activity Log' tab
4. Verify all activity log entries are displayed

**Expected**

User sees complete activity log of the GRN.

---

## TC-GRN-170002 — View Activity Log without Permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

GRN exists in any status but user does not have view permission (audit access)

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN that exists
3. Navigate to 'Activity Log' tab
4. Verify the 'Activity Log' tab is disabled or not accessible

**Expected**

User cannot access the 'Activity Log' tab.

---

## TC-GRN-170003 — View Activity Log for Non-Existent GRN

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN does not exist

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a non-existent GRN
3. Navigate to 'Activity Log' tab
4. Verify no activity log entries are displayed

**Expected**

User sees an empty activity log.

---

## TC-GRN-170004 — View Activity Log with No Activity

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists but has no activity logs

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click on a GRN with no activity logs
3. Navigate to 'Activity Log' tab
4. Verify the 'Activity Log' tab displays a message indicating no activity

**Expected**

User sees a message indicating no activity logs.

---

## TC-GRN-180001 — Performing a bulk approval action

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Click 'Approve' button
5. Confirm approval

**Expected**

Selected items are updated to APPROVED status, activity log records the bulk approval action.

---

## TC-GRN-180002 — User attempts to perform bulk action without edit permission

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user does not have edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Try to click 'Approve' button

**Expected**

User receives an error message indicating insufficient permissions, no bulk action is performed.

---

## TC-GRN-180003 — User attempts to perform bulk action on a GRN in RECEIVED status

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

GRN exists in RECEIVED status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Select multiple line items
4. Try to click 'Approve' button

**Expected**

User receives an error message indicating that the GRN cannot be edited in this state, no bulk action is performed.

---

## TC-GRN-180004 — Perform bulk action with no line items selected

> **As a** Purchase user, **I want** this GRN behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

GRN exists in DRAFT status; multiple line items exist; user has edit permission

**Steps**

1. Navigate to /procurement/goods-receive-note
2. Click 'Items' tab
3. Click 'Approve' button without selecting any line items

**Expected**

User receives a warning message to select at least one line item before performing a bulk action, no bulk action is performed.

---


<sub>Last regenerated: 2026-05-07 · git 4d2c6d8</sub>
