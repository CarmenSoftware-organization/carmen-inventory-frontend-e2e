# Credit Note — User Stories

_Generated from `tests/601-credit-note.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Credit Note
**Spec:** `tests/601-credit-note.spec.ts`
**Default role:** Purchase
**Total test cases:** 124 (46 High / 29 Medium / 3 Low / 46 unset)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CN-010001 | View All Credit Notes | High | Happy Path |
| TC-CN-010002 | Apply Status Filter | High | Happy Path |
| TC-CN-010003 | Filter by Vendor | High | Happy Path |
| TC-CN-010004 | Invalid Filter Input | High | Negative |
| TC-CN-010005 | No Credit Notes Available | High | Edge Case |
| TC-CN-020001 | Create Quantity-Based Credit Note from GRN - Happy Path | Critical | Happy Path |
| TC-CN-020002 | Create Quantity-Based Credit Note from GRN - Invalid Vendor | Critical | Negative |
| TC-CN-020003 | Create Quantity-Based Credit Note from GRN - No GRN Selected | Critical | Negative |
| TC-CN-020004 | Create Quantity-Based Credit Note from GRN - Insufficient Quantity | Critical | Negative |
| TC-CN-020005 | Create Quantity-Based Credit Note from GRN - Empty Lot Numbers | Critical | Negative |
| TC-CN-030002 | Negative - Missing Vendor | High | Negative |
| TC-CN-030003 | Edge Case - No GRN Reference | Medium | Edge Case |
| TC-CN-040001 | View existing credit note | High | Happy Path |
| TC-CN-040002 | Attempt to view non-existent credit note | High | Negative |
| TC-CN-040003 | View credit note without necessary permissions | High | Negative |
| TC-CN-040004 | View credit note with a large number of items | High | Edge Case |
| TC-CN-050001 | Happy Path - Edit Credit Note | High | Happy Path |
| TC-CN-050002 | Negative - Invalid Total Amount | High | Negative |
| TC-CN-050003 | Negative - No Permission | High | Negative |
| TC-CN-050004 | Edge Case - Edit Credit Note with No Items | Medium | Edge Case |
| TC-CN-060001 | Add Credit Note Item with Valid Lot Selection | Critical | Happy Path |
| TC-CN-060003 | Remove Credit Note Item with Lot Selection | Critical | Happy Path |
| TC-CN-060004 | Attempt to Save Credit Note Without Lot Selection | High | Negative |
| TC-CN-060005 | Manage Credit Note Items with No Permission | Critical | Negative |
| TC-CN-070001 | Review Existing Credit Note with Quantity-Based Items | High | Happy Path |
| TC-CN-070002 | Access Denied to Review Inventory Cost Analysis | High | Negative |
| TC-CN-070003 | Review Empty Credit Note | Medium | Edge Case |
| TC-CN-080001 | Happy Path - Select Credit Reason and Provide Description | Medium | Happy Path |
| TC-CN-080002 | Negative - No Credit Reason Selected | Medium | Negative |
| TC-CN-080003 | Edge Case - Maximum Character Limit for Description | Medium | Edge Case |
| TC-CN-090001 | Add valid comments and attachments successfully | Medium | Happy Path |
| TC-CN-090002 | Attempt to add comments without permission | Medium | Negative |
| TC-CN-090003 | Attempt to upload an invalid file type | Medium | Negative |
| TC-CN-090004 | Attach multiple documents to a credit note | Low | Happy Path |
| TC-CN-090005 | Attempt to add comments when no credit note exists | Low | Edge Case |
| TC-CN-100001 | Commit credit note - Happy path | Critical | Happy Path |
| TC-CN-100002 | Commit credit note - No commit permission | Critical | Negative |
| TC-CN-100003 | Commit credit note - Invalid credit note status | High | Negative |
| TC-CN-100004 | Commit credit note - Accounting period closed | High | Negative |
| TC-CN-100005 | Commit credit note - Date out of range | High | Edge Case |
| TC-CN-110001 | Void committed credit note - Happy Path | Medium | Happy Path |
| TC-CN-110002 | Void committed credit note - No Permission | Medium | Negative |
| TC-CN-110003 | Void committed credit note - Invalid Credit Note | Medium | Negative |
| TC-CN-110004 | Void committed credit note - Closed Accounting Period | Medium | Negative |
| TC-CN-110005 | Void committed credit note - Edge Case - Multiple Credit Notes | Medium | Edge Case |
| TC-CN-210001 _(skipped)_ | Happy Path - Create Credit Note (server action) | Critical | Happy Path |
| TC-CN-210003 _(skipped)_ | Negative - Unauthorized User | Critical | Negative |
| TC-CN-210004 _(skipped)_ | Edge Case - Concurrent Delete | High | Edge Case |
| TC-CN-220001 _(skipped)_ | Fetch vendor and GRN data with valid input | Critical | Happy Path |
| TC-CN-220002 _(skipped)_ | Fetch vendor and GRN data with invalid vendor selection | High | Negative |
| TC-CN-220003 _(skipped)_ | Fetch vendor and GRN data when no vendor data exists | High | Negative |
| TC-CN-220004 _(skipped)_ | Fetch vendor and GRN data with no vendor permissions | Critical | Negative |
| TC-CN-220005 _(skipped)_ | Fetch vendor and GRN data with multiple vendors selected | Medium | Edge Case |
| TC-CN-230001 _(skipped)_ | Happy Path - Commitment Transaction | Critical | Happy Path |
| TC-CN-230002 _(skipped)_ | Negative - No Credit Note | Critical | Negative |
| TC-CN-230003 _(skipped)_ | Negative - Invalid Accounting Period | Critical | Negative |
| TC-CN-230004 _(skipped)_ | Edge Case - Document Date Outside Accounting Period | Critical | Edge Case |
| TC-CN-230005 _(skipped)_ | Negative - Insufficient Permissions | Critical | Negative |
| TC-CN-240001 _(skipped)_ | Happy Path - Void Existing Credit Note | Critical | Happy Path |
| TC-CN-240002 _(skipped)_ | Negative Case - No Void Permission | Critical | Negative |
| TC-CN-240003 _(skipped)_ | Negative Case - Dependent Transactions Exist | Critical | Negative |
| TC-CN-240004 _(skipped)_ | Edge Case - Void During Closed Accounting Period | Critical | Edge Case |
| TC-CN-250001 _(skipped)_ | Happy Path - FIFO Calculation for Credit Note | Critical | Happy Path |
| TC-CN-250002 _(skipped)_ | Negative - Invalid Costing Method Selection | High | Negative |
| TC-CN-250003 _(skipped)_ | Edge Case - No Lot Selection for Credit Note | Medium | Edge Case |
| TC-CN-250004 _(skipped)_ | Negative - No Inventory Lot Cost Data | High | Negative |
| TC-CN-260002 _(skipped)_ | Negative - Invalid Tax Rate | High | Negative |
| TC-CN-260003 _(skipped)_ | Negative - No Vendor Tax Registration | High | Negative |
| TC-CN-260004 _(skipped)_ | Edge Case - Large Credit Note Amount | Medium | Edge Case |
| TC-CN-260005 _(skipped)_ | Edge Case - Zero Amount | Medium | Edge Case |
| TC-CN-270002 _(skipped)_ | Generate Journal Entries - Invalid Credit Note ID | High | Negative |
| TC-CN-270003 _(skipped)_ | Generate Journal Entries - User with Limited Permissions | Critical | Negative |
| TC-CN-270004 _(skipped)_ | Generate Journal Entries - Simultaneous Multiple Commitments | Medium | Edge Case |
| TC-CN-270005 _(skipped)_ | Generate Journal Entries - System Timeouts | Low | Edge Case |
| TC-CN-280001 _(skipped)_ | Generate Stock Movement - Happy Path | Critical | Happy Path |
| TC-CN-280002 _(skipped)_ | Generate Stock Movement - Invalid Quantity | High | Negative |
| TC-CN-280003 _(skipped)_ | Generate Stock Movement - Insufficient Inventory | High | Negative |
| TC-CN-280004 _(skipped)_ | Generate Stock Movement - No Permission | Critical | Negative |
| TC-CN-280005 _(skipped)_ | Generate Stock Movement - Edge Case - Maximum Lot Quantity | Medium | Edge Case |
| TC-CN-290001 _(skipped)_ | Upload valid attachment | High | Happy Path |
| TC-CN-290002 _(skipped)_ | Try to upload invalid attachment | High | Negative |
| TC-CN-290003 _(skipped)_ | Delete attachment | High | Happy Path |
| TC-CN-290004 _(skipped)_ | Attempt to delete attachment without permission | High | Negative |
| TC-CN-290005 _(skipped)_ | Upload large file | Medium | Edge Case |
| TC-CN-310001 _(skipped)_ | Happy Path - Generate Stock Movements for Quantity-Based Credit Notes | Critical | Happy Path |
| TC-CN-310002 _(skipped)_ | Negative Case - Generate Stock Movements with Invalid Credit Note Type | High | Negative |
| TC-CN-310003 _(skipped)_ | Negative Case - Generate Stock Movements Without Selected Lots | High | Negative |
| TC-CN-310004 _(skipped)_ | Edge Case - Generate Stock Movements After Changing Credit Note Status | Medium | Edge Case |
| TC-CN-310005 _(skipped)_ | Edge Case - Generate Stock Movements with No Inventory Locations Configured | Medium | Edge Case |
| TC-CN-320001 _(skipped)_ | Generate Journal Entries - Happy Path | Critical | Happy Path |
| TC-CN-320002 _(skipped)_ | Generate Journal Entries - Invalid GL Account Mapping | High | Negative |
| TC-CN-320003 _(skipped)_ | Generate Journal Entries - Accounting Period Closed | High | Negative |
| TC-CN-320004 _(skipped)_ | Generate Journal Entries - No Vendor Account | High | Negative |
| TC-CN-320005 _(skipped)_ | Generate Journal Entries - Large Volume of Credit Notes | Medium | Edge Case |
| TC-CN-330001 _(skipped)_ | Happy Path - Credit Note with Valid Items and Taxes | Critical | Happy Path |
| TC-CN-330002 _(skipped)_ | Negative Case - Missing Tax Rate | Critical | Negative |
| TC-CN-340001 _(skipped)_ | Happy Path - Process Valid Credit Note for Consumed Item | Critical | Happy Path |
| TC-CN-340002 _(skipped)_ | Negative - Process Credit Note with Invalid Type | High | Negative |
| TC-CN-340003 _(skipped)_ | Negative - Process Credit Note Without Permissions | High | Negative |
| TC-CN-340004 _(skipped)_ | Edge Case - Process Credit Note for Partially Consumed Item | Medium | Edge Case |
| TC-CN-350001 _(skipped)_ | Happy Path - Process Credit Note with Partial Availability | Critical | Happy Path |
| TC-CN-350002 _(skipped)_ | Negative - Insufficient Available Inventory | High | Negative |
| TC-CN-350003 _(skipped)_ | Negative - Invalid Credit Note Type | High | Negative |
| TC-CN-350004 _(skipped)_ | Edge Case - Exact Quantity Available | Medium | Edge Case |
| TC-CN-360001 _(skipped)_ | Happy Path - Process Retrospective Vendor Discount | High | Happy Path |
| TC-CN-360004 _(skipped)_ | Edge Case - Single GRN Credit Note | Medium | Edge Case |
| TC-CN-360005 _(skipped)_ | Edge Case - No Historical GRNs | Medium | Edge Case |
| TC-CN-500003 _(skipped)_ | Edge Case - Large Volume of Credit Notes | High | Edge Case |
| TC-CN-510001 _(skipped)_ | Happy Path - Generate Valid CN Number | Critical | Happy Path |
| TC-CN-510002 _(skipped)_ | Negative Path - Generate CN Number When Sequence Table Does Not Exist | Critical | Negative |
| TC-CN-510003 _(skipped)_ | Negative Path - Generate CN Number Without Transaction Context | Critical | Negative |
| TC-CN-510004 _(skipped)_ | Edge Case - Generate CN Number at Month End | Critical | Edge Case |
| TC-CN-510005 _(skipped)_ | Negative Path - Generate CN Number During System Maintenance | Critical | Negative |
| TC-CN-520001 _(skipped)_ | Happy Path - Credit Note Commitment | Critical | Happy Path |
| TC-CN-520002 _(skipped)_ | Negative Case - Vendor Account Inactive | Critical | Negative |
| TC-CN-520003 _(skipped)_ | Negative Case - Invalid Credit Note Amount | Critical | Negative |
| TC-CN-520004 _(skipped)_ | Edge Case - Void Credit Note | Critical | Edge Case |
| TC-CN-530001 _(skipped)_ | Valid Credit Note Data | Critical | Happy Path |
| TC-CN-530002 _(skipped)_ | Missing Required Fields | Critical | Negative |
| TC-CN-530003 _(skipped)_ | Invalid Credit Amount | Critical | Negative |
| TC-CN-530004 _(skipped)_ | Expired Supplier | Critical | Negative |
| TC-CN-540001 _(skipped)_ | Happy Path - Real-time Credit Note Sync | High | Happy Path |
| TC-CN-540002 _(skipped)_ | Negative Case - No WebSocket Connection | High | Negative |
| TC-CN-540003 _(skipped)_ | Edge Case - User Session Expired | Medium | Edge Case |

---

## TC-CN-010001 — View All Credit Notes

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนและมีสิทธิ์ดู credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. ตรวจสอบว่า list ของ credit notes แสดงผล

**Expected**

ผู้ใช้เห็น list ของ credit notes ทั้งหมด

---

## TC-CN-010002 — Apply Status Filter

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Filter'
3. เลือกสถานะ 'Open' จาก dropdown
4. กดปุ่ม 'Apply Filter'
5. ตรวจสอบว่า list ที่กรองแสดงเฉพาะ credit notes สถานะ open

**Expected**

ผู้ใช้เห็น list ของ credit notes ที่กรองแล้ว เฉพาะสถานะ open

---

## TC-CN-010003 — Filter by Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes; vendor ที่มี credit notes อยู่ในระบบ

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Filter'
3. กรอกชื่อ vendor ในช่อง 'Vendor'
4. กดปุ่ม 'Apply Filter'
5. ตรวจสอบว่า list ที่กรองแสดงเฉพาะ credit notes ของ vendor ที่เลือก

**Expected**

ผู้ใช้เห็น list ของ credit notes ที่กรองแล้วสำหรับ vendor ที่เลือก

---

## TC-CN-010004 — Invalid Filter Input

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Filter'
3. กรอก input ที่ไม่ถูกต้องในช่อง 'Status'
4. กดปุ่ม 'Apply Filter'
5. ตรวจสอบว่า list ยังคงไม่ถูกกรอง

**Expected**

ผู้ใช้เห็น error message หรือ list ยังคงไม่ถูกกรอง

---

## TC-CN-010005 — No Credit Notes Available

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes; ไม่มีข้อมูล credit note อยู่ในระบบ

**Steps**

1. ไปที่ /procurement/credit-note
2. ตรวจสอบว่า list ว่างเปล่า

**Expected**

ผู้ใช้เห็น list ว่างเปล่า

---

## TC-CN-020001 — Create Quantity-Based Credit Note from GRN - Happy Path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role purchasing/receiving; มี GRN ที่ posted แล้วอย่างน้อยหนึ่งรายการสำหรับ vendor; ข้อมูล master ของ vendor และ product ถูกต้อง

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก vendor
4. เลือก GRN จาก list
5. เลือก items พร้อม lot numbers ที่ระบุ
6. บันทึกจำนวนที่คืนพร้อมการคำนวณต้นทุนสินค้าคงคลังที่ถูกต้อง
7. กด 'Save'

**Expected**

สร้าง credit note แบบ quantity-based สำเร็จ พร้อมรายละเอียดและการคำนวณต้นทุนสินค้าคงคลังที่ถูกต้อง

---

## TC-CN-020002 — Create Quantity-Based Credit Note from GRN - Invalid Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing/receiving; ไม่มี GRN ที่ posted แล้วสำหรับ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก vendor ที่ไม่ถูกต้อง
4. เลือก GRN จาก list
5. เลือก items พร้อม lot numbers ที่ระบุ
6. บันทึกจำนวนที่คืน
7. กด 'Save'

**Expected**

ระบบแสดง error message ว่าไม่มี GRN ที่ posted แล้วสำหรับ vendor ที่เลือก

---

## TC-CN-020003 — Create Quantity-Based Credit Note from GRN - No GRN Selected

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing/receiving; มี GRN ที่ posted แล้วอย่างน้อยหนึ่งรายการสำหรับ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก vendor
4. ไม่เลือก GRN ใดๆ
5. เลือก items พร้อม lot numbers ที่ระบุ
6. บันทึกจำนวนที่คืน
7. กด 'Save'

**Expected**

ระบบแสดง error message ว่าต้องเลือก GRN

---

## TC-CN-020004 — Create Quantity-Based Credit Note from GRN - Insufficient Quantity

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing/receiving; มี GRN ที่ posted แล้วอย่างน้อยหนึ่งรายการสำหรับ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก vendor
4. เลือก GRN จาก list
5. เลือก items พร้อม lot numbers ที่ระบุ
6. บันทึกจำนวนคืนที่มากกว่าจำนวนที่มีอยู่ใน GRN
7. กด 'Save'

**Expected**

ระบบแสดง error message ว่าจำนวนคืนเกินกว่าจำนวนที่มีอยู่ใน GRN

---

## TC-CN-020005 — Create Quantity-Based Credit Note from GRN - Empty Lot Numbers

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing/receiving; มี GRN ที่ posted แล้วอย่างน้อยหนึ่งรายการสำหรับ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก vendor
4. เลือก GRN จาก list
5. เลือก items ที่มี lot numbers ว่างเปล่า
6. บันทึกจำนวนคืน
7. กด 'Save'

**Expected**

ระบบแสดง error message ว่า lot numbers ต้องไม่ว่างเปล่า

---

## TC-CN-030002 — Negative - Missing Vendor

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing; ไม่มี vendor อยู่ในระบบ; มี GRN reference อยู่

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. ข้ามช่อง 'Vendor'
4. กรอกช่อง 'GRN Reference' (optional)
5. กรอกช่อง 'Credit Note Amount'
6. กรอกช่อง 'Reason'
7. กด 'Save'

**Expected**

ระบบแสดง error message แจ้งให้ผู้ใช้เลือก vendor

---

## TC-CN-030003 — Edge Case - No GRN Reference

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role purchasing; vendor มีอยู่; ไม่มี GRN reference

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอกช่อง 'Vendor'
4. ข้ามช่อง 'GRN Reference' (optional)
5. กรอกช่อง 'Credit Note Amount'
6. กรอกช่อง 'Reason'
7. กด 'Save'

**Expected**

สร้าง credit note สถานะ draft สำเร็จโดยไม่มี GRN reference

---

## TC-CN-040001 — View existing credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes; มี credit note อยู่ในระบบ

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่มีอยู่

**Expected**

ผู้ใช้เห็นรายละเอียด credit note ครบถ้วน ได้แก่ ข้อมูล header, items, lot applications, journal entries, stock movements, และการคำนวณภาษี

---

## TC-CN-040002 — Attempt to view non-existent credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่ไม่มีอยู่

**Expected**

ระบบแสดง error message ว่า credit note ไม่มีอยู่

---

## TC-CN-040003 — View credit note without necessary permissions

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนแต่ไม่มีสิทธิ์ดู credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note

**Expected**

ระบบแสดง error message ว่าผู้ใช้ไม่มีสิทธิ์ดู credit notes

---

## TC-CN-040004 — View credit note with a large number of items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ดู credit notes; มี credit note ที่มีจำนวน items มากอยู่ในระบบ

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่มีจำนวน items มาก

**Expected**

ผู้ใช้เห็นรายละเอียด credit note ครบถ้วนโดยไม่มีปัญหาด้าน performance

---

## TC-CN-050001 — Happy Path - Edit Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี role purchasing; มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Edit' บน draft credit note
3. กรอกช่อง 'Reason' ด้วย 'Return of goods'
4. กรอกช่อง 'Total Amount' ด้วย '1200.00'
5. กด 'Save'

**Expected**

Credit note ถูกอัปเดตด้วยค่าใหม่และยังคงสถานะ DRAFT

---

## TC-CN-050002 — Negative - Invalid Total Amount

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role purchasing; มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Edit' บน draft credit note
3. กรอกช่อง 'Total Amount' ด้วย 'invalid amount'
4. กด 'Save'

**Expected**

แสดง error message, credit note ไม่เปลี่ยนแปลงและยังคงสถานะ DRAFT

---

## TC-CN-050003 — Negative - No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี role receiving; มี credit note สถานะ DRAFT; ผู้ใช้ไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. พยายามกด 'Edit' บน draft credit note
3. ตรวจสอบว่า error message แสดงขึ้น

**Expected**

ผู้ใช้ไม่สามารถแก้ไข credit note และได้รับ error message

---

## TC-CN-050004 — Edge Case - Edit Credit Note with No Items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี role purchasing; มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์แก้ไข; ยังไม่มี items เพิ่มใน credit note

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Edit' บน draft credit note
3. ตรวจสอบว่าไม่มี items ให้แก้ไข
4. กด 'Save'

**Expected**

Credit note ไม่เปลี่ยนแปลงและยังคงสถานะ DRAFT

---

## TC-CN-060001 — Add Credit Note Item with Valid Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี credit note สถานะ DRAFT; มี inventory lots สำหรับ items ที่คืน; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Add Item'
3. เลือก item จาก dropdown
4. เลือก lot ที่ถูกต้องจาก dropdown
5. กรอกจำนวนคืน
6. กด 'Save'

**Expected**

เพิ่ม item ใน credit note สำเร็จพร้อม lot selection และจำนวนคืนที่ถูกต้อง

---

## TC-CN-060003 — Remove Credit Note Item with Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี credit note สถานะ DRAFT; มี inventory lots; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก item จาก list
3. กด 'Remove Item'

**Expected**

ลบ item ที่เลือกออกจาก credit note สำเร็จ, lot selection และจำนวนคืนถูกล้าง

---

## TC-CN-060004 — Attempt to Save Credit Note Without Lot Selection

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/credit-note
2. เพิ่ม item โดยไม่เลือก lot
3. พยายาม save

**Expected**

แสดง error message ว่าต้องเลือก lot

---

## TC-CN-060005 — Manage Credit Note Items with No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ DRAFT; มี inventory lots สำหรับ items ที่คืน

**Steps**

1. ไปที่ /procurement/credit-note
2. พยายามเพิ่ม, แก้ไข, หรือลบ item ใน credit note

**Expected**

แสดง access denied message

---

## TC-CN-070001 — Review Existing Credit Note with Quantity-Based Items

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

มี credit note ที่มี items แบบ quantity-based; เลือก inventory lots แล้ว; การคำนวณต้นทุนเสร็จสิ้นแล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก tab 'Credit Notes'
3. เลือก credit note ที่มี items แบบ quantity-based
4. กด 'View Details'

**Expected**

แสดงรายละเอียดการคำนวณต้นทุนสินค้าคงคลัง รวมถึง weighted average costs, cost variances, และ realized gains/losses สำหรับ credit note ที่เลือก

---

## TC-CN-070002 — Access Denied to Review Inventory Cost Analysis

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note ที่มี items แบบ quantity-based; ผู้ใช้ไม่มีสิทธิ์ดูข้อมูลต้นทุน

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก tab 'Credit Notes'
3. พยายามเลือก credit note ที่มี items แบบ quantity-based
4. กด 'View Details'

**Expected**

แสดง permission error message ป้องกันผู้ใช้ไม่ให้เข้าถึงรายละเอียดการวิเคราะห์ต้นทุน

---

## TC-CN-070003 — Review Empty Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ไม่มี credit note ที่มี items แบบ quantity-based

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก tab 'Credit Notes'
3. พยายามเลือก credit note ที่มี items แบบ quantity-based
4. กด 'View Details'

**Expected**

แสดง message ว่าไม่มี credit notes ที่มี items แบบ quantity-based

---

## TC-CN-080001 — Happy Path - Select Credit Reason and Provide Description

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังสร้างหรือแก้ไข credit note และ Login เป็น purchasing staff

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'New Credit Note'
3. เลือก credit reason จาก dropdown
4. กรอกช่อง description
5. กดปุ่ม 'Save'

**Expected**

บันทึก credit reason และ description พร้อม credit note สำเร็จ

---

## TC-CN-080002 — Negative - No Credit Reason Selected

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังสร้าง credit note และ Login เป็น purchasing staff

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'New Credit Note'
3. ข้ามการเลือก credit reason
4. กรอกช่อง description
5. กดปุ่ม 'Save'

**Expected**

แสดง validation error แจ้งให้เลือก credit reason

---

## TC-CN-080003 — Edge Case - Maximum Character Limit for Description

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังสร้าง credit note และ Login เป็น purchasing staff

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'New Credit Note'
3. เลือก credit reason จาก dropdown
4. กรอกช่อง description ด้วยตัวอักษรจนถึงขีดจำกัดสูงสุด
5. กดปุ่ม 'Save'

**Expected**

บันทึก credit reason และ description พร้อม credit note สำเร็จ

---

## TC-CN-090001 — Add valid comments and attachments successfully

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

มี credit note อยู่ในระบบและผู้ใช้มีสิทธิ์เพิ่ม comments/attachments

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Add Comment'
3. กรอกช่อง 'Comment' ด้วย 'Initial review complete'
4. กดปุ่ม 'Upload Document'
5. เลือกไฟล์เอกสารที่ถูกต้อง
6. กดปุ่ม 'Save'

**Expected**

บันทึก comments และ attachments พร้อม credit note สำเร็จ comment และเอกสาร visible สำหรับผู้ใช้ที่มีสิทธิ์

---

## TC-CN-090002 — Attempt to add comments without permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

มี credit note อยู่ในระบบแต่ผู้ใช้ไม่มีสิทธิ์เพิ่ม comments/attachments

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Add Comment'

**Expected**

ผู้ใช้ไม่สามารถเพิ่ม comments หรือ attachments แสดง error message ว่าไม่มีสิทธิ์เพียงพอ

---

## TC-CN-090003 — Attempt to upload an invalid file type

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

มี credit note; ผู้ใช้มีสิทธิ์เพิ่ม comments/attachments

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Upload Document'
3. เลือกไฟล์ประเภทที่ไม่ถูกต้อง (เช่น .exe, .jpg)
4. กดปุ่ม 'Save'

**Expected**

ระบบปฏิเสธประเภทไฟล์ที่ไม่ถูกต้อง แสดง error message ว่าอนุญาตเฉพาะประเภทไฟล์ที่กำหนดเท่านั้น

---

## TC-CN-090004 — Attach multiple documents to a credit note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Happy Path

**Preconditions**

มี credit note; ผู้ใช้มีสิทธิ์เพิ่ม comments/attachments

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Upload Document'
3. เลือกไฟล์เอกสารที่ถูกต้อง 1
4. กดปุ่ม 'Upload Document' อีกครั้ง
5. เลือกไฟล์เอกสารที่ถูกต้อง 2
6. กดปุ่ม 'Save'

**Expected**

บันทึกเอกสารทั้งสองพร้อม credit note สำเร็จ เอกสารทั้งสอง visible สำหรับผู้ใช้ที่มีสิทธิ์

---

## TC-CN-090005 — Attempt to add comments when no credit note exists

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ไม่มี credit note อยู่ในระบบ

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Add Comment'

**Expected**

ผู้ใช้ถูก redirect ไปหน้าสร้าง credit note หรือแสดง error message ว่าไม่มี credit note

---

## TC-CN-100001 — Commit credit note - Happy path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ commit; มี credit note สถานะ DRAFT; accounting period เปิดอยู่สำหรับวันที่ทำรายการ

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Commit' ข้าง draft credit note
3. ตรวจสอบ confirmation dialog
4. กด 'Commit' ใน dialog
5. รอให้ระบบประมวลผล

**Expected**

สถานะ credit note เปลี่ยนเป็น COMMITTED, สร้าง journal entries, อัปเดต inventory, ปรับ vendor payables

---

## TC-CN-100002 — Commit credit note - No commit permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ commit; มี credit note สถานะ DRAFT

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Commit' ข้าง draft credit note
3. ตรวจสอบ error message

**Expected**

ผู้ใช้ได้รับ error message 'Insufficient permission'

---

## TC-CN-100003 — Commit credit note - Invalid credit note status

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ไม่มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์ commit; accounting period เปิดอยู่สำหรับวันที่ทำรายการ

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Commit' ข้าง credit note ที่ไม่ใช่สถานะ DRAFT
3. ตรวจสอบ error message

**Expected**

ผู้ใช้ได้รับ error message 'Invalid credit note status'

---

## TC-CN-100004 — Commit credit note - Accounting period closed

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์ commit; accounting period ปิดแล้วสำหรับวันที่ทำรายการ

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Commit' ข้าง draft credit note
3. ตรวจสอบ error message

**Expected**

ผู้ใช้ได้รับ error message 'Accounting period is closed'

---

## TC-CN-100005 — Commit credit note - Date out of range

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

มี credit note สถานะ DRAFT; ผู้ใช้มีสิทธิ์ commit; วันที่ทำรายการอยู่นอกช่วงที่อนุญาต

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Commit' ข้าง draft credit note
3. ตรวจสอบ error message

**Expected**

ผู้ใช้ได้รับ error message 'Transaction date out of range'

---

## TC-CN-110001 — Void committed credit note - Happy Path

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

มี committed credit note และผู้ใช้มีสิทธิ์ที่จำเป็น

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก filter สถานะ 'Committed'
3. เลือก committed credit note
4. กดปุ่ม 'Void'
5. ยืนยันการ void

**Expected**

สถานะ credit note เปลี่ยนเป็น 'VOID' และสร้าง reversing journal entries

---

## TC-CN-110002 — Void committed credit note - No Permission

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

มี committed credit note แต่ผู้ใช้ไม่มีสิทธิ์ที่จำเป็น

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก filter สถานะ 'Committed'
3. เลือก committed credit note
4. พยายามกดปุ่ม 'Void'

**Expected**

ผู้ใช้ได้รับ error message ว่าไม่มีสิทธิ์ void credit note

---

## TC-CN-110003 — Void committed credit note - Invalid Credit Note

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

มี credit note ที่ไม่ถูกต้องในสถานะ committed (เช่น ID ที่ไม่มีอยู่)

**Steps**

1. ไปที่ /procurement/credit-note
2. กรอก credit note ID ที่ไม่ถูกต้อง
3. กดปุ่ม 'Void'

**Expected**

แสดง error message ว่าไม่พบ credit note

---

## TC-CN-110004 — Void committed credit note - Closed Accounting Period

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Accounting period ปิดแล้วและมี committed credit note

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก filter สถานะ 'Committed'
3. เลือก committed credit note
4. พยายามกดปุ่ม 'Void'

**Expected**

ผู้ใช้ได้รับ error message ว่า accounting period ปิดแล้วและไม่อนุญาตให้ void

---

## TC-CN-110005 — Void committed credit note - Edge Case - Multiple Credit Notes

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี committed credit notes หลายรายการและเลือกรายการหนึ่งไว้

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก filter สถานะ 'Committed'
3. เลือก committed credit notes หลายรายการ
4. กดปุ่ม 'Void'

**Expected**

ระบบแจ้งให้ผู้ใช้เลือก credit note เพียงรายการเดียวสำหรับการ void

---

## TC-CN-210001 — Happy Path - Create Credit Note (server action) _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

กำหนด server action context แล้ว, database connection พร้อมใช้, ผู้ใช้ได้รับการยืนยันตัวตนและมีสิทธิ์

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอก 'Credit Note Date'
4. กรอก 'Supplier Name'
5. กรอก 'Amount'
6. กด 'Save'

**Expected**

สร้าง credit note สำเร็จด้วย atomic transaction และ validation ที่ถูกต้อง

---

## TC-CN-210003 — Negative - Unauthorized User _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

กำหนด server action context แล้ว, database connection พร้อมใช้, ผู้ใช้ยังไม่ได้รับการยืนยันตัวตน

**Steps**

1. ไปที่ /procurement/credit-note
2. พยายามกด 'New Credit Note'

**Expected**

ผู้ใช้ถูก redirect ไปหน้า login หรือถูกปฏิเสธการเข้าถึง

---

## TC-CN-210004 — Edge Case - Concurrent Delete _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

กำหนด server action context แล้ว, database connection พร้อมใช้, ผู้ใช้หลายคนได้รับการยืนยันตัวตนและมีสิทธิ์

**Steps**

1. User A ไปที่ /procurement/credit-note
2. User A กด 'New Credit Note'
3. User B ไปที่ /procurement/credit-note
4. User B กด 'Delete' บน credit note เดียวกัน
5. User A กด 'Save'

**Expected**

การสร้าง credit note ล้มเหลวเนื่องจากการลบพร้อมกัน พร้อม error message ที่เหมาะสม

---

## TC-CN-220001 — Fetch vendor and GRN data with valid input _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนพร้อมสิทธิ์ purchasing, ข้อมูล vendor และ GRN มีอยู่ใน database

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Fetch Vendor and GRN Data'
3. เลือก vendor จาก dropdown
4. กด 'Fetch'

**Expected**

ดึงและแสดงข้อมูล vendor และ GRN สำเร็จ

---

## TC-CN-220002 — Fetch vendor and GRN data with invalid vendor selection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนพร้อมสิทธิ์ purchasing, ข้อมูล vendor และ GRN มีอยู่ใน database, เลือก vendor ที่ไม่ถูกต้อง

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Fetch Vendor and GRN Data'
3. เลือก vendor ที่ไม่ถูกต้องจาก dropdown
4. กด 'Fetch'

**Expected**

แสดง error message ว่าเลือก vendor ไม่ถูกต้อง

---

## TC-CN-220003 — Fetch vendor and GRN data when no vendor data exists _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนพร้อมสิทธิ์ purchasing, ไม่มีข้อมูล vendor และ GRN ใน database

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Fetch Vendor and GRN Data'
3. เลือก vendor จาก dropdown
4. กด 'Fetch'

**Expected**

ไม่พบข้อมูล vendor และ GRN และแสดง message ที่เหมาะสม

---

## TC-CN-220004 — Fetch vendor and GRN data with no vendor permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนแต่ไม่มีสิทธิ์ purchasing, ข้อมูล vendor และ GRN มีอยู่ใน database

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Fetch Vendor and GRN Data'
3. เลือก vendor จาก dropdown
4. กด 'Fetch'

**Expected**

แสดง access denied message

---

## TC-CN-220005 — Fetch vendor and GRN data with multiple vendors selected _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ได้รับการยืนยันตัวตนพร้อมสิทธิ์ purchasing, มีข้อมูล vendors หลายรายการและ GRN ใน database

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Fetch Vendor and GRN Data'
3. เลือก vendors หลายรายการจาก dropdown
4. กด 'Fetch'

**Expected**

แสดง error message ว่าไม่สามารถเลือก vendors หลายรายการได้

---

## TC-CN-230001 — Happy Path - Commitment Transaction _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี credit note สถานะ DRAFT และ accounting period เปิดอยู่สำหรับวันที่ในเอกสาร

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Execute Commitment'
3. รอให้ transaction เสร็จสิ้น
4. ตรวจสอบว่า journal entries, stock movements, และ vendor balance ถูกอัปเดต

**Expected**

transaction ดำเนินการสำเร็จ journal entries, stock movements, และ vendor balance อัปเดตตามที่คาดหวัง

---

## TC-CN-230002 — Negative - No Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ไม่มี credit note สถานะ DRAFT

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Execute Commitment'
3. ดู error message

**Expected**

แสดง error message ว่าไม่มี draft credit note

---

## TC-CN-230003 — Negative - Invalid Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ DRAFT แต่ accounting period ปิดแล้วสำหรับวันที่ในเอกสาร

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Execute Commitment'
3. ดู error message

**Expected**

แสดง error message ว่า accounting period ปิดแล้วสำหรับวันที่ในเอกสาร

---

## TC-CN-230004 — Edge Case - Document Date Outside Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

มี credit note สถานะ DRAFT และวันที่ในเอกสารอยู่นอกช่วง accounting period ที่เปิดอยู่

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Execute Commitment'
3. ดู error message

**Expected**

แสดง error message ว่าวันที่ในเอกสารอยู่นอกช่วง accounting period ที่เปิดอยู่

---

## TC-CN-230005 — Negative - Insufficient Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ DRAFT และผู้ใช้ไม่มีสิทธิ์ดำเนินการ commitment transactions

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'Execute Commitment'
3. ดู error message

**Expected**

แสดง error message ว่าไม่มีสิทธิ์เพียงพอในการดำเนินการ commitment transactions

---

## TC-CN-240001 — Happy Path - Void Existing Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี credit note สถานะ COMMITTED, accounting period เปิดอยู่สำหรับวันที่ void, ผู้ใช้มี manager role และสิทธิ์ void

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่ต้องการ void
3. กดปุ่ม 'Void'
4. ตรวจสอบว่า journal entries ถูก reverse
5. ตรวจสอบว่า inventory balance ถูกคืน

**Expected**

Credit note ถูก void, journal entries ถูก reverse, และ inventory balance ถูกคืน

---

## TC-CN-240002 — Negative Case - No Void Permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ COMMITTED, accounting period เปิดอยู่สำหรับวันที่ void, ผู้ใช้ไม่มีสิทธิ์ void

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่ต้องการ void
3. กดปุ่ม 'Void'
4. ตรวจสอบว่าระบบปฏิเสธการดำเนินการ

**Expected**

ระบบปฏิเสธการพยายาม void credit note ของผู้ใช้

---

## TC-CN-240003 — Negative Case - Dependent Transactions Exist _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

มี credit note สถานะ COMMITTED, มี dependent transactions, accounting period เปิดอยู่สำหรับวันที่ void, ผู้ใช้มี manager role และสิทธิ์ void

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่ต้องการ void
3. กดปุ่ม 'Void'
4. ตรวจสอบว่าระบบปฏิเสธการดำเนินการเนื่องจาก dependent transactions

**Expected**

ระบบปฏิเสธการพยายาม void credit note ของผู้ใช้เนื่องจากมี dependent transactions ที่มีอยู่

---

## TC-CN-240004 — Edge Case - Void During Closed Accounting Period _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

มี credit note สถานะ COMMITTED, accounting period ปิดแล้ว, ผู้ใช้มี manager role และสิทธิ์ void

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก credit note ที่ต้องการ void
3. กดปุ่ม 'Void'
4. ตรวจสอบว่าระบบปฏิเสธการดำเนินการเนื่องจาก accounting period ปิดแล้ว

**Expected**

ระบบปฏิเสธการพยายาม void credit note ของผู้ใช้เนื่องจาก accounting period ปิดแล้ว

---

## TC-CN-250001 — Happy Path - FIFO Calculation for Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี items ใน credit note พร้อม lot selections และข้อมูลต้นทุน lot ใน inventory

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note ที่มี lot selections
3. กดปุ่ม 'Calculate Costs'
4. ตรวจสอบว่าใช้วิธี FIFO
5. ตรวจสอบว่าการคำนวณต้นทุนถูกต้องตามวิธี FIFO

**Expected**

ใช้วิธี FIFO อย่างถูกต้อง และการคำนวณต้นทุนแม่นยำตาม lots ที่เลือก

---

## TC-CN-250002 — Negative - Invalid Costing Method Selection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี items ใน credit note พร้อม lot selections และข้อมูลต้นทุน lot ใน inventory

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note ที่มี lot selections
3. กดปุ่ม 'Calculate Costs'
4. กรอก costing method ที่ไม่ถูกต้องด้วยตนเอง
5. ตรวจสอบว่าระบบไม่อนุญาตวิธีที่ไม่ถูกต้อง

**Expected**

ระบบป้องกันการเลือก costing method ที่ไม่ถูกต้องและแสดง error message ที่เหมาะสม

---

## TC-CN-250003 — Edge Case - No Lot Selection for Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี items ใน credit note โดยไม่มี lot selections และมีข้อมูลต้นทุน lot ใน inventory

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note ที่ไม่มี lot selections
3. กดปุ่ม 'Calculate Costs'
4. ตรวจสอบว่าระบบไม่อนุญาตการคำนวณต้นทุนโดยไม่มี lot selections

**Expected**

ระบบป้องกันการคำนวณต้นทุนโดยไม่มี lot selections และแสดง error message ที่เหมาะสม

---

## TC-CN-250004 — Negative - No Inventory Lot Cost Data _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี items ใน credit note พร้อม lot selections แต่ไม่มีข้อมูลต้นทุน lot ใน inventory

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note ที่มี lot selections
3. กดปุ่ม 'Calculate Costs'
4. ตรวจสอบว่าระบบไม่อนุญาตการคำนวณต้นทุนเนื่องจากข้อมูลต้นทุน lot ขาดหายไป

**Expected**

ระบบป้องกันการคำนวณต้นทุนเนื่องจากข้อมูลต้นทุน lot ขาดหายไป และแสดง error message ที่เหมาะสม

---

## TC-CN-260002 — Negative - Invalid Tax Rate _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note พร้อม items และจำนวนเงิน, มี tax rate ที่ไม่ถูกต้องหรือยังไม่ได้กำหนดสำหรับวันที่ในเอกสาร, และมีข้อมูลการลงทะเบียนภาษีของ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอกรายละเอียด credit note รวมถึง items และจำนวนเงิน
4. เลือก tax rate ที่ไม่ถูกต้องหรือยังไม่ได้กำหนด
5. กด 'Save'

**Expected**

ระบบส่งคืน error message ว่าไม่สามารถใช้ tax rate ที่ไม่ถูกต้องได้

---

## TC-CN-260003 — Negative - No Vendor Tax Registration _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note พร้อม items และจำนวนเงิน, กำหนด tax rates สำหรับวันที่ในเอกสารแล้ว แต่ไม่มีข้อมูลการลงทะเบียนภาษีของ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอกรายละเอียด credit note รวมถึง items และจำนวนเงิน
4. กด 'Save'

**Expected**

ระบบส่งคืน error message ว่าต้องมีข้อมูลการลงทะเบียนภาษีของ vendor

---

## TC-CN-260004 — Edge Case - Large Credit Note Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี credit note ที่มีจำนวนเงินมาก, กำหนด tax rates สำหรับวันที่ในเอกสารแล้ว และมีข้อมูลการลงทะเบียนภาษีของ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอกรายละเอียด credit note รวมถึง items และจำนวนเงินมาก
4. กด 'Save'

**Expected**

คำนวณจำนวนภาษีได้อย่างแม่นยำสำหรับ credit note ที่มีจำนวนเงินมาก

---

## TC-CN-260005 — Edge Case - Zero Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี credit note ที่มีจำนวนเงิน item เท่ากับศูนย์, กำหนด tax rates สำหรับวันที่ในเอกสารแล้ว และมีข้อมูลการลงทะเบียนภาษีของ vendor

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอกรายละเอียด credit note รวมถึง items ที่มีจำนวนเงินเป็นศูนย์
4. กด 'Save'

**Expected**

จำนวนภาษีสำหรับ items ที่มีจำนวนเงินเป็นศูนย์ถูกตั้งเป็นศูนย์

---

## TC-CN-270002 — Generate Journal Entries - Invalid Credit Note ID _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

กรอก credit note commitment ID ที่ไม่มีอยู่

**Steps**

1. ไปที่ /journal-entries
2. กด 'Generate Entries'
3. กรอก credit note commitment ID ที่ไม่ถูกต้อง
4. ตรวจสอบว่าแสดง error message

**Expected**

แสดง error message ว่า credit note ID ไม่ถูกต้อง

---

## TC-CN-270003 — Generate Journal Entries - User with Limited Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ผู้ใช้ที่มีสิทธิ์จำกัดพยายามสร้าง journal entries

**Steps**

1. Login เป็นผู้ใช้ที่มีสิทธิ์จำกัด
2. ไปที่ /journal-entries
3. กด 'Generate Entries'
4. ตรวจสอบว่าแสดง error message

**Expected**

แสดง error message ว่าไม่มีสิทธิ์เพียงพอ

---

## TC-CN-270004 — Generate Journal Entries - Simultaneous Multiple Commitments _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

สร้าง credit note commitments หลายรายการพร้อมกัน

**Steps**

1. ไปที่ /journal-entries
2. กด 'Generate Entries'
3. เริ่มสร้าง journal entries สำหรับหลาย commitments พร้อมกัน
4. ตรวจสอบว่าสร้าง journal entries ครบสำหรับทุก commitments

**Expected**

สร้าง journal entries สำเร็จสำหรับทุก commitments โดยไม่มี errors

---

## TC-CN-270005 — Generate Journal Entries - System Timeouts _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

เซิร์ฟเวอร์กำลังมีโหลดสูงหรือ response times ช้า

**Steps**

1. ไปที่ /journal-entries
2. กด 'Generate Entries'
3. รอเป็นระยะเวลานาน
4. ตรวจสอบว่าระบบจัดการ timeout และไม่สร้าง journal entries ที่ไม่สมบูรณ์

**Expected**

ระบบจัดการ timeout อย่างมีประสิทธิภาพ อาจแจ้งให้ retry หรือแสดง warning message

---

## TC-CN-280001 — Generate Stock Movement - Happy Path _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

ระบบถูก initialize แล้ว และ inventory balance ถูกตั้งเป็นค่าบวก

**Steps**

1. ไปที่ /stock/movements
2. กด 'Generate Stock Movement'
3. เลือก 'Credit Note' เป็นประเภทการเคลื่อนไหว
4. กรอกจำนวนและ lot number ที่ถูกต้อง
5. กด 'Submit'

**Expected**

ระบบสร้าง stock movement เชิงลบ ลด inventory balance ตามจำนวนที่ระบุ

---

## TC-CN-280002 — Generate Stock Movement - Invalid Quantity _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ระบบถูก initialize แล้ว และ inventory balance ถูกตั้งเป็นค่าบวก

**Steps**

1. ไปที่ /stock/movements
2. กด 'Generate Stock Movement'
3. เลือก 'Credit Note' เป็นประเภทการเคลื่อนไหว
4. กรอกจำนวนที่ไม่ถูกต้อง (ติดลบหรือศูนย์)
5. กด 'Submit'

**Expected**

ระบบแสดง error message ว่าจำนวนไม่ถูกต้องและไม่สร้าง stock movement

---

## TC-CN-280003 — Generate Stock Movement - Insufficient Inventory _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ระบบถูก initialize แล้ว และ inventory balance ถูกตั้งเป็นค่าที่น้อยกว่าจำนวนที่ร้องขอ

**Steps**

1. ไปที่ /stock/movements
2. กด 'Generate Stock Movement'
3. เลือก 'Credit Note' เป็นประเภทการเคลื่อนไหว
4. กรอกจำนวนที่มากกว่า inventory ปัจจุบัน
5. กด 'Submit'

**Expected**

ระบบแสดง error message ว่า inventory ไม่เพียงพอและไม่สร้าง stock movement

---

## TC-CN-280004 — Generate Stock Movement - No Permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

ระบบถูก initialize แล้ว และผู้ใช้ไม่มีสิทธิ์สร้าง stock movements

**Steps**

1. Login เป็นผู้ใช้ที่ไม่มีสิทธิ์สร้าง stock movements
2. ไปที่ /stock/movements
3. กด 'Generate Stock Movement'

**Expected**

ระบบแสดง error message ว่าไม่มีสิทธิ์เพียงพอและไม่อนุญาตให้สร้าง stock movement

---

## TC-CN-280005 — Generate Stock Movement - Edge Case - Maximum Lot Quantity _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ระบบถูก initialize แล้วด้วย lot quantity ที่เป็นจำนวนสูงสุดที่อนุญาต

**Steps**

1. ไปที่ /stock/movements
2. กด 'Generate Stock Movement'
3. เลือก 'Credit Note' เป็นประเภทการเคลื่อนไหว
4. กรอก lot quantity สูงสุดที่อนุญาต
5. กด 'Submit'

**Expected**

ระบบสร้าง stock movement เชิงลบ ลด inventory balance ตาม lot quantity สูงสุดที่อนุญาต

---

## TC-CN-290001 — Upload valid attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

credit note มีอยู่แล้วและผู้ใช้มีสิทธิ์ upload

**Steps**

1. ไปที่หน้า credit note detail
2. กด 'Add Attachment'
3. กรอก file input ด้วย file ที่ถูกต้อง
4. กด 'Upload'

**Expected**

Attachment ถูก upload และแสดงบนหน้า credit note detail

---

## TC-CN-290002 — Try to upload invalid attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

credit note มีอยู่แล้วและผู้ใช้มีสิทธิ์ upload

**Steps**

1. ไปที่หน้า credit note detail
2. กด 'Add Attachment'
3. กรอก file input ด้วย file ที่ไม่ถูกต้อง (เช่น image แทน pdf)
4. กด 'Upload'

**Expected**

Error message แสดงขึ้นมาและ file ที่ไม่ถูกต้องไม่ถูก upload

---

## TC-CN-290003 — Delete attachment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

credit note มีอยู่แล้ว มี attachment และผู้ใช้มีสิทธิ์ delete

**Steps**

1. ไปที่หน้า credit note detail
2. ค้นหา attachment ที่ต้องการ delete
3. กด 'Delete' บน attachment
4. ยืนยันการ delete

**Expected**

Attachment ถูกลบออกจากหน้า credit note detail

---

## TC-CN-290004 — Attempt to delete attachment without permission _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

credit note มีอยู่แล้ว มี attachment และผู้ใช้ไม่มีสิทธิ์ delete

**Steps**

1. ไปที่หน้า credit note detail
2. ค้นหา attachment ที่ต้องการ delete
3. พยายามกด 'Delete' บน attachment

**Expected**

ผู้ใช้ถูกปฏิเสธสิทธิ์หรือ error message แสดงขึ้นมา

---

## TC-CN-290005 — Upload large file _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

credit note มีอยู่แล้ว ผู้ใช้มีสิทธิ์ upload และ storage service รองรับ file ขนาดใหญ่

**Steps**

1. ไปที่หน้า credit note detail
2. กด 'Add Attachment'
3. กรอก file input ด้วย file ขนาดใหญ่
4. กด 'Upload'

**Expected**

Attachment ถูก upload และจัดเก็บโดยไม่มีปัญหา

---

## TC-CN-310001 — Happy Path - Generate Stock Movements for Quantity-Based Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

มี credit note ประเภท QUANTITY_RETURN ที่ทุก items เลือก lots และ inventory locations แล้ว และอยู่ในสถานะ COMMITTED

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'View' ของ committed credit note
3. กด 'Generate Stock Movements'

**Expected**

สร้าง stock movements สำเร็จ ลด inventory balance สำหรับ items ที่คืน

---

## TC-CN-310002 — Negative Case - Generate Stock Movements with Invalid Credit Note Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note ประเภทอื่นที่ไม่ใช่ QUANTITY_RETURN ที่ทุก items เลือก lots และ inventory locations แล้ว และอยู่ในสถานะ COMMITTED

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'View' ของ committed credit note
3. กด 'Generate Stock Movements'

**Expected**

แสดง error message ว่าประเภท credit note ไม่รองรับการสร้าง stock movement

---

## TC-CN-310003 — Negative Case - Generate Stock Movements Without Selected Lots _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

มี credit note ประเภท QUANTITY_RETURN ที่บาง items ไม่มี lots และ inventory locations และอยู่ในสถานะ COMMITTED

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'View' ของ committed credit note
3. พยายามกด 'Generate Stock Movements'

**Expected**

แสดง error message ว่าทุก items ต้องเลือก lots

---

## TC-CN-310004 — Edge Case - Generate Stock Movements After Changing Credit Note Status _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี credit note ประเภท QUANTITY_RETURN ที่ทุก items เลือก lots และ inventory locations แล้ว และอยู่ในสถานะ PENDING

**Steps**

1. เปลี่ยนสถานะ credit note เป็น COMMITTED
2. ไปที่ /procurement/credit-note
3. กดปุ่ม 'View' ของ credit note ที่เป็น COMMITTED แล้ว
4. กด 'Generate Stock Movements'

**Expected**

สร้าง stock movements สำเร็จ ลด inventory balance สำหรับ items ที่คืน

---

## TC-CN-310005 — Edge Case - Generate Stock Movements with No Inventory Locations Configured _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี credit note ประเภท QUANTITY_RETURN ที่ทุก items เลือก lots แล้ว และอยู่ในสถานะ COMMITTED แต่ไม่ได้กำหนด inventory locations

**Steps**

1. ไปที่ /procurement/credit-note
2. กดปุ่ม 'View' ของ committed credit note
3. กด 'Generate Stock Movements'

**Expected**

แสดง error message ว่าต้องกำหนด inventory locations

---

## TC-CN-320001 — Generate Journal Entries - Happy Path _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

สถานะ credit note เป็น COMMITTED, กำหนด GL account mapping แล้ว, accounting period เปิดอยู่, และมี vendor account

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก COMMITTED credit note
3. กด 'Generate Journal Entries'

**Expected**

สร้าง journal entries อัตโนมัติ ตัดบัญชี accounts payable และเครดิต inventory และ tax accounts

---

## TC-CN-320002 — Generate Journal Entries - Invalid GL Account Mapping _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

สถานะ credit note เป็น COMMITTED, GL account mapping ไม่ถูกต้อง, accounting period เปิดอยู่, และมี vendor account

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก COMMITTED credit note
3. กด 'Generate Journal Entries'

**Expected**

แสดง error message ว่า GL account mapping ไม่ถูกต้อง

---

## TC-CN-320003 — Generate Journal Entries - Accounting Period Closed _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

สถานะ credit note เป็น COMMITTED, กำหนด GL account mapping แล้ว, accounting period ปิดแล้ว, และมี vendor account

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก COMMITTED credit note
3. กด 'Generate Journal Entries'

**Expected**

แสดง error message ว่า accounting period ปิดแล้ว

---

## TC-CN-320004 — Generate Journal Entries - No Vendor Account _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

สถานะ credit note เป็น COMMITTED, กำหนด GL account mapping แล้ว, accounting period เปิดอยู่, แต่ไม่มี vendor account

**Steps**

1. ไปที่ /procurement/credit-note
2. คลิก COMMITTED credit note
3. กด 'Generate Journal Entries'

**Expected**

แสดง error message ว่าไม่มี vendor account

---

## TC-CN-320005 — Generate Journal Entries - Large Volume of Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี credit notes หลายรายการสถานะ COMMITTED, กำหนด GL account mapping แล้ว, accounting period เปิดอยู่, และมี vendor account

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก COMMITTED credit notes หลายรายการ
3. กด 'Generate Journal Entries'

**Expected**

สร้าง journal entries สำหรับ credit notes ที่เลือกทั้งหมด

---

## TC-CN-330001 — Happy Path - Credit Note with Valid Items and Taxes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Credit note มี items พร้อมจำนวนเงิน, กำหนด tax rates แล้ว, ข้อมูลภาษีของ vendor พร้อมใช้, และระบุ tax invoice reference แล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอก 'Vendor Name'
4. กรอก 'Tax Invoice Reference'
5. กด 'Add Line Item'
6. กรอก 'Item Description', 'Quantity', และ 'Price'
7. เลือก 'Tax Rate' ที่ใช้งาน
8. กด 'Save'
9. กด 'Update' เพื่อแก้ไข credit note ที่มีอยู่
10. อัปเดต 'Quantity' และ 'Price'
11. กด 'Save'

**Expected**

ระบบคำนวณการปรับ input VAT อัตโนมัติตาม credit note ที่แก้ไข ลดภาระภาษีตามจำนวน credit

---

## TC-CN-330002 — Negative Case - Missing Tax Rate _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Credit note มี items พร้อมจำนวนเงิน แต่ไม่มีการกำหนด tax rate สำหรับ items ใดๆ

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอก 'Vendor Name'
4. กรอก 'Tax Invoice Reference'
5. กด 'Add Line Item'
6. กรอก 'Item Description', 'Quantity', และ 'Price'
7. กด 'Save'

**Expected**

ระบบไม่คำนวณการปรับภาษีใดๆ และแสดง error message ว่าต้องกำหนด tax rates

---

## TC-CN-340001 — Happy Path - Process Valid Credit Note for Consumed Item _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

สร้าง credit note ประเภท QUANTITY_RETURN สำหรับ item ที่ถูกใช้หมดแล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก QUANTITY_RETURN credit note
4. กด 'Process'

**Expected**

ปรับ cost of goods sold แต่ inventory balance ไม่เปลี่ยนแปลง

---

## TC-CN-340002 — Negative - Process Credit Note with Invalid Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

เลือก credit note ประเภทอื่นที่ไม่ใช่ QUANTITY_RETURN

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก credit note ประเภทอื่น
4. กด 'Process'

**Expected**

ระบบแสดง error message ว่าประเภท credit note ไม่รองรับ

---

## TC-CN-340003 — Negative - Process Credit Note Without Permissions _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ประมวลผล credit notes

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'

**Expected**

ระบบแสดง permission error message

---

## TC-CN-340004 — Edge Case - Process Credit Note for Partially Consumed Item _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

สร้าง credit note สำหรับ item ที่ถูกใช้ไปบางส่วน

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก credit note
4. กด 'Process'

**Expected**

ระบบแสดง error message ว่า credit note ประมวลผลได้เฉพาะกับ items ที่ถูกใช้หมดแล้วเท่านั้น

---

## TC-CN-350001 — Happy Path - Process Credit Note with Partial Availability _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Inventory มี Item A 50 หน่วย, issue credit note สำหรับ Item A 60 หน่วย (ประเภท QUANTITY_RETURN)

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กรอก 'Item A' ในช่อง 'Item'
3. กรอก '60' ในช่อง 'Return Quantity'
4. กด 'Submit'

**Expected**

ระบบแบ่งการประมวลผล: 50 หน่วยย้ายไป COGS, 10 หน่วยยังไม่ได้ประมวลผล

---

## TC-CN-350002 — Negative - Insufficient Available Inventory _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Inventory มี Item A 20 หน่วย, issue credit note สำหรับ Item A 50 หน่วย (ประเภท QUANTITY_RETURN)

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กรอก 'Item A' ในช่อง 'Item'
3. กรอก '50' ในช่อง 'Return Quantity'
4. กด 'Submit'

**Expected**

ระบบแสดง error message: 'Insufficient inventory available for Item A'

---

## TC-CN-350003 — Negative - Invalid Credit Note Type _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Inventory มี Item A 40 หน่วย, issue credit note สำหรับ Item A 30 หน่วย แต่ประเภทไม่ใช่ QUANTITY_RETURN

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กรอก 'Item A' ในช่อง 'Item'
3. กรอก '30' ในช่อง 'Return Quantity'
4. เลือก 'Non-Return' ในช่อง 'Type'
5. กด 'Submit'

**Expected**

ระบบแสดง error message: 'Invalid credit note type. Only QUANTITY_RETURN allowed for this action'

---

## TC-CN-350004 — Edge Case - Exact Quantity Available _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Inventory มี Item A 35 หน่วย, issue credit note สำหรับ Item A 35 หน่วย (ประเภท QUANTITY_RETURN)

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กรอก 'Item A' ในช่อง 'Item'
3. กรอก '35' ในช่อง 'Return Quantity'
4. กด 'Submit'

**Expected**

ระบบประมวลผล 35 หน่วยทั้งหมดไปยัง COGS

---

## TC-CN-360001 — Happy Path - Process Retrospective Vendor Discount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

สร้าง credit note ส่วนลดย้อนหลังที่ถูกต้องพร้อม GRNs ในอดีตหลายรายการ

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก credit note ประเภท AMOUNT_DISCOUNT
4. ตรวจสอบว่า credit note อ้างอิง GRNs ในอดีตหลายรายการ
5. กด 'Process Discount'

**Expected**

ระบบประมวลผล credit note โดยจัดสรรส่วนลดตามสัดส่วนให้กับ receipts ในอดีตทั่ว GRNs

---

## TC-CN-360004 — Edge Case - Single GRN Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

สร้าง credit note ที่อ้างอิง GRN เพียงรายการเดียว

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก credit note ที่อ้างอิง GRN เพียงรายการเดียว

**Expected**

ระบบประมวลผล credit note โดยไม่จัดสรรส่วนลดให้ GRNs อื่น เนื่องจากอ้างอิง GRN เพียงรายการเดียว

---

## TC-CN-360005 — Edge Case - No Historical GRNs _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

สร้าง credit note ที่ไม่อ้างอิง GRNs ในอดีตใดๆ

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Process Credit Note'
3. เลือก credit note ที่ไม่มี GRNs ในอดีต

**Expected**

ระบบแสดง error message ว่าไม่มี GRNs ในอดีตที่อ้างอิง

---

## TC-CN-500003 — Edge Case - Large Volume of Credit Notes _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ระบบมี credit notes จำนวนมากที่สร้างขึ้นภายในช่วงเวลาสั้น

**Steps**

1. ไปที่ /procurement/credit-note
2. รอให้ระบบประมวลผล credit notes ทั้งหมด
3. ตรวจสอบว่า credit notes ทั้งหมดถูกบันทึกใน audit trail อย่างถูกต้อง

**Expected**

credit notes ทั้งหมดได้รับการประมวลผลและบันทึกใน audit trail โดยไม่มี error

---

## TC-CN-510001 — Happy Path - Generate Valid CN Number _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Database sequence table มีอยู่ และ transaction context active

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กด 'Generate CN Number'

**Expected**

CN number ที่ unique ในรูปแบบ CN-YYMM-NNNN ถูกสร้างและแสดงผล

---

## TC-CN-510002 — Negative Path - Generate CN Number When Sequence Table Does Not Exist _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table ไม่มีอยู่ และ transaction context active

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กด 'Generate CN Number'

**Expected**

Error แสดงว่า database sequence table ไม่มีอยู่

---

## TC-CN-510003 — Negative Path - Generate CN Number Without Transaction Context _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table มีอยู่ และไม่มี transaction context active

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กด 'Generate CN Number'

**Expected**

Error แสดงว่าต้องมี transaction context

---

## TC-CN-510004 — Edge Case - Generate CN Number at Month End _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

Database sequence table มีอยู่ transaction context active และ sequence ของเดือนปัจจุบันถึงขีดจำกัดแล้ว

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กด 'Generate CN Number'

**Expected**

Sequence ของเดือนใหม่เริ่มต้นที่ 0001 และต่อจากเดือนที่แล้ว

---

## TC-CN-510005 — Negative Path - Generate CN Number During System Maintenance _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Database sequence table มีอยู่ transaction context active และระบบอยู่ในช่วง maintenance

**Steps**

1. ไปที่ /procurement/credit-note/new
2. กด 'Generate CN Number'

**Expected**

Error แสดงว่าระบบอยู่ในช่วง maintenance และไม่สามารถดำเนินการได้

---

## TC-CN-520001 — Happy Path - Credit Note Commitment _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

Vendor account มีอยู่และ active คำนวณจำนวน credit note แล้ว และ transaction context active

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note
3. กด 'Commit Credit Note'

**Expected**

Vendor balance ถูกอัปเดตตามที่กำหนด

---

## TC-CN-520002 — Negative Case - Vendor Account Inactive _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Vendor account ไม่ active คำนวณจำนวน credit note แล้ว และ transaction context active

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note
3. กด 'Commit Credit Note'

**Expected**

ระบบปฏิเสธการดำเนินการและแสดง error message

---

## TC-CN-520003 — Negative Case - Invalid Credit Note Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

Vendor account มีอยู่และ active จำนวน credit note ไม่ถูกต้อง และ transaction context active

**Steps**

1. ไปที่ /procurement/credit-note
2. สร้าง credit note ใหม่ด้วยจำนวนที่ไม่ถูกต้อง
3. กด 'Commit Credit Note'

**Expected**

ระบบปฏิเสธการดำเนินการและแสดง error message

---

## TC-CN-520004 — Edge Case - Void Credit Note _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Edge Case

**Preconditions**

Vendor account มีอยู่และ active คำนวณจำนวน credit note แล้ว transaction context active และ credit note ที่ committed แล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. เลือก credit note ที่ committed แล้ว
3. กด 'Void Credit Note'

**Expected**

Vendor balance ถูกอัปเดตและสถานะ credit note เปลี่ยนเป็น voided

---

## TC-CN-530001 — Valid Credit Note Data _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Happy Path

**Preconditions**

credit note ที่ถูกต้องถูก submit พร้อม field ที่จำเป็นทั้งหมด

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอก 'Invoice Number'
4. กรอก 'Credit Amount'
5. เลือก 'Supplier'
6. กด 'Save'

**Expected**

ข้อมูล credit note ผ่านการตรวจสอบและบันทึกสำเร็จโดยไม่มี error

---

## TC-CN-530002 — Missing Required Fields _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

credit note ถูก submit โดยขาด required fields

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กด 'Save'

**Expected**

ระบบแสดง error messages สำหรับ required fields ที่ขาดหายไป

---

## TC-CN-530003 — Invalid Credit Amount _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

credit note ถูก submit ด้วยจำนวน credit ที่ไม่ถูกต้อง (ติดลบหรือเป็นศูนย์)

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. กรอก 'Invoice Number'
4. กรอก 'Credit Amount' ด้วยค่าติดลบหรือศูนย์
5. กด 'Save'

**Expected**

ระบบแสดง error message สำหรับจำนวน credit ที่ไม่ถูกต้อง

---

## TC-CN-530004 — Expired Supplier _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Critical · **Test Type:** Negative

**Preconditions**

credit note ถูก submit ด้วย supplier ที่หมดอายุแล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'New Credit Note'
3. เลือก supplier ที่หมดอายุ
4. กด 'Save'

**Expected**

ระบบแสดง error message สำหรับ supplier ที่หมดอายุ

---

## TC-CN-540001 — Happy Path - Real-time Credit Note Sync _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

WebSocket หรือ SSE connection พร้อมใช้งาน Cache layer ถูก configure แล้ว และ User session active

**Steps**

1. ไปที่ /procurement/credit-note
2. กด 'Refresh' button
3. รอ 5 วินาที

**Expected**

รายการและรายละเอียด credit note ถูกอัปเดต real-time

---

## TC-CN-540002 — Negative Case - No WebSocket Connection _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Cache layer ถูก configure แล้ว และ User session active

**Steps**

1. ปิดการใช้งาน WebSocket หรือ SSE connection ใน network settings
2. ไปที่ /procurement/credit-note
3. กด 'Refresh' button

**Expected**

Real-time updates ไม่เกิดขึ้น และ cache ยังคงไม่เปลี่ยนแปลง

---

## TC-CN-540003 — Edge Case - User Session Expired _(skipped)_

> **As a** Purchase user, **I want** this Credit Note behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

WebSocket หรือ SSE connection พร้อมใช้งาน และ Cache layer ถูก configure แล้ว

**Steps**

1. ไปที่ /procurement/credit-note
2. รอให้ user session หมดอายุ
3. กด 'Refresh' button

**Expected**

ระบบแจ้งให้ยืนยันตัวตนใหม่ และ real-time updates ล้มเหลว

---


<sub>Last regenerated: 2026-05-07 · git 4d2c6d8</sub>
