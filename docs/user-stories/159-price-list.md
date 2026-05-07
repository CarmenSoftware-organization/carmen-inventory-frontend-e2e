# Price List — User Stories

_Generated from `tests/159-price-list.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Price List
**Spec:** `tests/159-price-list.spec.ts`
**Default role:** Purchase
**Total test cases:** 27 (9 High / 14 Medium / 4 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PL-010001 | Valid Login and Access to Price Lists Page | High | Happy Path |
| TC-PL-010002 | Search Filter with Invalid Keyword | Medium | Negative |
| TC-PL-010003 | View Price List Details with No Data | Medium | Edge Case |
| TC-PL-010004 | User Without Access to Price Lists Page | High | Negative |
| TC-PL-010005 | Filter by Expired Status | Medium | Happy Path |
| TC-PL-020001 | Happy Path - Create Valid Price List | High | Happy Path |
| TC-PL-020002 | Negative - Missing Vendor | Medium | Negative |
| TC-PL-020003 | Edge Case - Empty Unit Price | Medium | Edge Case |
| TC-PL-030001 | Happy Path - Valid Price List Click | High | Happy Path |
| TC-PL-030002 | Negative - No Price List Selected | Medium | Negative |
| TC-PL-030003 | Edge Case - User Without Edit Permission | High | Edge Case |
| TC-PL-030004 | Negative - User Without View Permission | Medium | Negative |
| TC-PL-030005 | Edge Case - Empty Line Items | High | Edge Case |
| TC-PL-040001 | Happy Path: Edit Price List Successfully | Medium | Happy Path |
| TC-PL-040002 | Negative: Invalid Date Input | Medium | Negative |
| TC-PL-050001 | Happy Path - Duplicate Price List | High | Happy Path |
| TC-PL-050002 | Negative - No Permission to Duplicate | Medium | Negative |
| TC-PL-050003 | Edge Case - Duplicate with No Source Price List | Low | Edge Case |
| TC-PL-060001 | Happy Path - Export Price List | High | Happy Path |
| TC-PL-060002 | Negative - Invalid Export Permission | Medium | Negative |
| TC-PL-060003 | Edge Case - Large Price List | Low | Edge Case |
| TC-PL-070002 | Negative - No Delete Permission | High | Negative |
| TC-PL-070003 | Negative - Click Cancel in Confirmation Dialog | Medium | Negative |
| TC-PL-070004 | Edge Case - Delete Price List from Detail Page | Medium | Edge Case |
| TC-PL-080001 | Happy Path - Mark Price List as Expired | Medium | Happy Path |
| TC-PL-080003 | Edge Case - Multiple Price Lists | Low | Edge Case |
| TC-PL-080004 | Negative - Price List Already Expired | Low | Negative |

---

## TC-PL-010001 — Valid Login and Access to Price Lists Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วและมีสิทธิ์เข้าถึงโมดูล Vendor Management

**Steps**

1. ไปที่ /login
2. กรอก 'Username' ด้วย credentials ที่ถูกต้อง
3. กรอก 'Password' ด้วย credentials ที่ถูกต้อง
4. คลิก 'Login'
5. คลิก 'Vendor Management' ใน sidebar navigation
6. คลิก submenu 'Price Lists'

**Expected**

ระบบ navigate ไปยัง /vendor-management/price-list และแสดงหน้า Price Lists

---

## TC-PL-010002 — Search Filter with Invalid Keyword

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วและมีสิทธิ์เข้าถึงโมดูล Vendor Management

**Steps**

1. ไปที่ /vendor-management/price-list
2. กรอก 'Search' input ด้วยคีย์เวิร์ดที่ไม่ถูกต้อง 'abcd'
3. คลิกปุ่ม 'Search'

**Expected**

ระบบแสดงตารางว่างและไม่มี price list ที่กรอง

---

## TC-PL-010003 — View Price List Details with No Data

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้วและมีสิทธิ์เข้าถึงโมดูล Vendor Management

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกชื่อ price list ในตาราง

**Expected**

ระบบแสดงหน้า detail ว่างสำหรับ price list ที่เลือก

---

## TC-PL-010004 — User Without Access to Price Lists Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์เข้าถึงโมดูล Vendor Management

**Steps**

1. ไปที่ /vendor-management/price-list

**Expected**

ระบบแสดงข้อความ error แจ้งสิทธิ์การเข้าถึงไม่เพียงพอ

---

## TC-PL-010005 — Filter by Expired Status

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้ว; มีสิทธิ์เข้าถึงโมดูล Vendor Management; ระบบมี price list ที่หมดอายุ

**Steps**

1. ไปที่ /vendor-management/price-list
2. เลือก 'Expired' จาก Status filter dropdown
3. ตรวจสอบว่าแสดงเฉพาะ price list ที่หมดอายุในตาราง

**Expected**

ระบบแสดงเฉพาะ price list ที่หมดอายุในตาราง

---

## TC-PL-020001 — Happy Path - Create Valid Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้ว; มีสิทธิ์สร้าง price list; vendor directory มี vendor อย่างน้อย 1 รายการ; product catalog มี product อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก 'Add New'
3. กรอก 'Price List Number'
4. เลือก 'Vendor'
5. เลือก 'USD' เป็น Currency
6. กรอกวันที่ 'Valid From'
7. คลิก 'Add Item'
8. เลือก 'Product'
9. กรอก 'MOQ' (optional)
10. เลือก 'Unit'
11. กรอก 'Unit Price'
12. กรอก 'Lead Time' (optional)
13. กรอก 'Notes' (optional)
14. คลิก 'Save'
15. ตรวจสอบข้อความ 'Success Toast'

**Expected**

price list สร้างสำเร็จและแสดงใน list

---

## TC-PL-020002 — Negative - Missing Vendor

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง price list; product catalog มี product อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก 'Add New'
3. กรอก 'Price List Number'
4. เลือก 'USD' เป็น Currency
5. กรอกวันที่ 'Valid From'
6. คลิก 'Add Item'
7. เลือก 'Product'
8. กรอก 'MOQ' (optional)
9. เลือก 'Unit'
10. กรอก 'Unit Price'
11. กรอก 'Lead Time' (optional)
12. กรอก 'Notes' (optional)
13. คลิก 'Save'
14. ตรวจสอบข้อความ error สำหรับ 'Vendor' ที่ขาดหายไป

**Expected**

แสดงข้อความ error แจ้งว่า 'Vendor' เป็นข้อมูลที่จำเป็น

---

## TC-PL-020003 — Edge Case - Empty Unit Price

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง price list; vendor directory มี vendor อย่างน้อย 1 รายการ; product catalog มี product อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก 'Add New'
3. กรอก 'Price List Number'
4. เลือก 'Vendor'
5. เลือก 'USD' เป็น Currency
6. กรอกวันที่ 'Valid From'
7. คลิก 'Add Item'
8. เลือก 'Product'
9. กรอก 'MOQ' (optional)
10. เลือก 'Unit'
11. ปล่อย 'Unit Price' ว่างเปล่า
12. กรอก 'Lead Time' (optional)
13. กรอก 'Notes' (optional)
14. คลิก 'Save'
15. ตรวจสอบข้อความ error สำหรับ 'Unit Price' ที่ขาดหายไป

**Expected**

แสดงข้อความ error แจ้งว่า 'Unit Price' เป็นข้อมูลที่จำเป็น

---

## TC-PL-030001 — Happy Path - Valid Price List Click

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้อง; มี price list อยู่

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกชื่อ price list
3. ตรวจสอบการ navigate ไปยัง /vendor-management/price-list/[id]

**Expected**

ระบบ navigate ไปยังหน้า detail ของ price list และแสดงข้อมูล price list ที่ถูกต้อง

---

## TC-PL-030002 — Negative - No Price List Selected

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้อง

**Steps**

1. ไปที่ /vendor-management/price-list
2. พยายามคลิกชื่อ price list ที่ไม่มีอยู่

**Expected**

ระบบแสดงข้อความ error หรือ navigate ไปยังหน้า error

---

## TC-PL-030003 — Edge Case - User Without Edit Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้องและไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /vendor-management/price-list/[id]
2. คลิกปุ่ม 'Edit'

**Expected**

ระบบป้องกันผู้ใช้ไม่ให้เข้าถึงฟังก์ชันแก้ไข

---

## TC-PL-030004 — Negative - User Without View Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้องแต่ไม่มีสิทธิ์ดู

**Steps**

1. ไปที่ /vendor-management/price-list/[id]
2. ตรวจสอบว่าระบบป้องกันการเข้าถึงหน้าดู

**Expected**

ระบบปฏิเสธการเข้าถึงของผู้ใช้หรือแสดงข้อความ error

---

## TC-PL-030005 — Edge Case - Empty Line Items

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้ว; มี price list ที่ไม่มี line item อยู่

**Steps**

1. ไปที่ /vendor-management/price-list/[id]
2. ตรวจสอบการไม่มี line item ในตาราง

**Expected**

ระบบแสดงข้อความหรือ placeholder ที่เหมาะสมสำหรับ line item

---

## TC-PL-040001 — Happy Path: Edit Price List Successfully

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้อง; price list มีอยู่และแก้ไขได้; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกปุ่ม 'Edit' ที่หน้า detail ของ price list
3. กรอกวันที่ valid from ใหม่
4. กรอกวันที่ valid to ใหม่
5. กรอก notes ใหม่
6. อัปเดตราคาสำหรับ line item
7. คลิก 'Save'

**Expected**

price list อัปเดตสำเร็จ แสดงข้อความสำเร็จ และผู้ใช้กลับไปยัง view mode

---

## TC-PL-040002 — Negative: Invalid Date Input

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

price list มีอยู่และแก้ไขได้; ผู้ใช้มีสิทธิ์แก้ไข; ผู้ใช้กรอกรูปแบบวันที่ที่ไม่ถูกต้อง

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกปุ่ม 'Edit' ที่หน้า detail ของ price list
3. กรอกวันที่ valid from ด้วยรูปแบบที่ไม่ถูกต้อง
4. กรอกวันที่ valid to ด้วยรูปแบบที่ไม่ถูกต้อง
5. คลิก 'Save'

**Expected**

ระบบแสดงข้อความ error สำหรับรูปแบบวันที่ที่ไม่ถูกต้อง และ price list ไม่ถูกอัปเดต

---

## TC-PL-050001 — Happy Path - Duplicate Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้อง; มี source price list อยู่

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก 'Duplicate' จาก actions menu
3. ตรวจสอบว่าฟอร์มกรอกข้อมูลจากการคัดลอกล่วงหน้า
4. แก้ไขตามต้องการ (วันที่, ราคา, รายการ)
5. คลิก 'Save'
6. ตรวจสอบข้อความสำเร็จและหน้า detail ของ price list ใหม่

**Expected**

price list ใหม่สร้างสำเร็จพร้อมข้อมูลที่กรอกล่วงหน้า; ผู้ใช้สามารถดูหน้า detail ของ price list ใหม่

---

## TC-PL-050002 — Negative - No Permission to Duplicate

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์ duplicate price list

**Steps**

1. ไปที่ /vendor-management/price-list
2. พยายามคลิก 'Duplicate' จาก actions menu
3. ตรวจสอบข้อความ error หรือไม่มี option 'Duplicate'

**Expected**

ผู้ใช้เห็นข้อความ error ที่เหมาะสมหรือไม่มี option 'Duplicate'

---

## TC-PL-050003 — Edge Case - Duplicate with No Source Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้วพร้อม session ที่ถูกต้องแต่ไม่มี source price list อยู่

**Steps**

1. ไปที่ /vendor-management/price-list
2. พยายามคลิก 'Duplicate' จาก actions menu
3. ตรวจสอบข้อความ error หรือไม่มี option 'Duplicate'

**Expected**

ผู้ใช้เห็นข้อความ error ที่เหมาะสมหรือไม่มี option 'Duplicate'

---

## TC-PL-060001 — Happy Path - Export Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้ว; price list มีอยู่

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกปุ่ม 'Export'
3. รอการสร้างไฟล์ export
4. คลิก download link

**Expected**

ไฟล์ price list ถูก download มายังอุปกรณ์ของผู้ใช้

---

## TC-PL-060002 — Negative - Invalid Export Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์ export

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกปุ่ม 'Export'
3. ตรวจสอบว่าปุ่ม 'Export' ถูก disabled หรือแสดงข้อความ error เรื่องสิทธิ์

**Expected**

ผู้ใช้ไม่สามารถ export price list และได้รับข้อความ error เรื่องสิทธิ์ที่เหมาะสม

---

## TC-PL-060003 — Edge Case - Large Price List

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้ว; price list มีรายการจำนวนมาก

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิกปุ่ม 'Export'
3. ตรวจสอบ performance และการใช้หน่วยความจำของ browser

**Expected**

ระบบจัดการ export request ขนาดใหญ่ได้โดยไม่ crash หรือประสิทธิภาพลดลงอย่างมีนัยสำคัญ

---

## TC-PL-070002 — Negative - No Delete Permission

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้ว; price list มีอยู่; ผู้ใช้ไม่มีสิทธิ์ลบ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก action 'Delete' ที่ price list เป้าหมาย

**Expected**

ผู้ใช้ได้รับข้อความปฏิเสธสิทธิ์และไม่สามารถลบ price list ได้

---

## TC-PL-070003 — Negative - Click Cancel in Confirmation Dialog

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้ว; price list มีอยู่; ผู้ใช้มีสิทธิ์ลบ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก action 'Delete' ที่ price list เป้าหมาย
3. คลิก 'Cancel' ใน confirmation dialog

**Expected**

price list ไม่ถูกลบและยังคงอยู่ใน list

---

## TC-PL-070004 — Edge Case - Delete Price List from Detail Page

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ login แล้ว; price list มีอยู่; ผู้ใช้มีสิทธิ์ลบ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก price list เป้าหมายเพื่อเปิดหน้า detail
3. คลิก action 'Delete' ที่หน้า detail

**Expected**

price list ถูกลบสำเร็จและระบบ navigate กลับไปยังหน้า list

---

## TC-PL-080001 — Happy Path - Mark Price List as Expired

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้ว; มี price list ที่มีสถานะยังไม่หมดอายุ

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก action 'Mark as Expired' ที่ price list ที่ต้องการ
3. รอให้สถานะอัปเดต
4. ตรวจสอบ success toast: 'Price list marked as expired'

**Expected**

สถานะ price list อัปเดตเป็น expired และแสดง success toast

---

## TC-PL-080003 — Edge Case - Multiple Price Lists

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

มี price list หลายรายการโดยอย่างน้อย 1 รายการมีสถานะยังไม่หมดอายุ

**Steps**

1. ไปที่ /vendor-management/price-list
2. เลือกและคลิก action 'Mark as Expired' ที่แต่ละ price list ทีละรายการ
3. รอให้แต่ละสถานะอัปเดตและตรวจสอบ success toast สำหรับแต่ละ action

**Expected**

สถานะของแต่ละ price list ที่เลือกอัปเดตเป็น expired และแสดง success toast ที่สอดคล้องกัน

---

## TC-PL-080004 — Negative - Price List Already Expired

> **As a** Purchase user, **I want** this Price List behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

มี price list ที่มีสถานะ expired อยู่

**Steps**

1. ไปที่ /vendor-management/price-list
2. คลิก action 'Mark as Expired' ที่ price list ที่หมดอายุแล้ว
3. ตรวจสอบว่าไม่มีการเปลี่ยนแปลงและไม่แสดง error

**Expected**

ผู้ใช้ไม่สามารถทำเครื่องหมาย price list ที่หมดอายุแล้วว่าหมดอายุอีกครั้งได้และไม่มีการเปลี่ยนแปลงใด

---


<sub>Last regenerated: 2026-05-07 · git 56da8b7</sub>
