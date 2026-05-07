# Product Category — User Stories

_Generated from `tests/101-product-category.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Product Category
**Spec:** `tests/101-product-category.spec.ts`
**Default role:** Purchase
**Total test cases:** 77 (61 High / 16 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CAT-010001 | View all categories | High | Happy Path |
| TC-CAT-010002 | No permission to view categories | High | Negative |
| TC-CAT-010003 | Expand and collapse category levels | High | Happy Path |
| TC-CAT-010004 | Category hierarchy with very long names | Medium | Edge Case |
| TC-CAT-010005 | Multiple levels of categories | High | Happy Path |
| TC-CAT-020001 | Happy Path - Create Root Category | High | Happy Path |
| TC-CAT-020002 | Negative - No Permission to Create Category | High | Negative |
| TC-CAT-020003 | Edge Case - Category Name Exceeds Maximum Length | High | Edge Case |
| TC-CAT-030001 | Happy Path - Create Subcategory | High | Happy Path |
| TC-CAT-030002 | Negative Case - Invalid Subcategory Name | High | Negative |
| TC-CAT-030003 | Negative Case - No Permission | High | Negative |
| TC-CAT-030004 | Edge Case - Maximum Subcategory Level | Medium | Edge Case |
| TC-CAT-040001 | Create Valid Item Group | High | Happy Path |
| TC-CAT-040002 | Create Item Group with Missing Permission | High | Negative |
| TC-CAT-040003 | Create Item Group with Invalid Subcategory Selection | High | Negative |
| TC-CAT-040005 | Create Item Group with Long Name | Medium | Edge Case |
| TC-CAT-050001 | Edit Existing Category Name | High | Happy Path |
| TC-CAT-050002 | Try to Edit Non-Existent Category | High | Negative |
| TC-CAT-050003 | Edit Category with No Permission | High | Negative |
| TC-CAT-050004 | Edit Category with Invalid Input | High | Negative |
| TC-CAT-050005 | Edit Category with Active Reference | High | Edge Case |
| TC-CAT-060001 | Delete existing category | High | Happy Path |
| TC-CAT-060002 | Attempt to delete category with assigned products | High | Negative |
| TC-CAT-060003 | Attempt to delete non-existing category | High | Negative |
| TC-CAT-060004 | Delete category after logging out | Medium | Edge Case |
| TC-CAT-070001 | Reorder Categories within Same Parent | High | Happy Path |
| TC-CAT-070002 | Move Category to Different Parent | High | Happy Path |
| TC-CAT-070003 | Unable to Reorder without Permission | High | Negative |
| TC-CAT-070004 | Attempt to Drag Category Outside of Current Parent | High | Edge Case |
| TC-CAT-070005 | Drag Category with No Siblings | High | Edge Case |
| TC-CAT-080001 | Switch from Tree to List View | High | Happy Path |
| TC-CAT-080002 | Switch from List to Tree View | High | Happy Path |
| TC-CAT-080003 | Negative: Switch View with No Categories | High | Negative |
| TC-CAT-080004 | Edge Case: Switch Views Multiple Times | Medium | Edge Case |
| TC-CAT-090001 | Happy Path - Search for Existing Category | High | Happy Path |
| TC-CAT-090002 | Negative Case - Search with Invalid Input | High | Negative |
| TC-CAT-090003 | Edge Case - Search with Empty Input | High | Edge Case |
| TC-CAT-090004 | Negative Case - User without Permission | High | Negative |
| TC-CAT-100001 | Apply multiple filters successfully | High | Happy Path |
| TC-CAT-100002 | Apply filters with invalid input | High | Negative |
| TC-CAT-100003 | Apply filters with no categories matching | High | Edge Case |
| TC-CAT-100004 | Apply filters with no filters applied | High | Edge Case |
| TC-CAT-110001 | Select a Category with Breadcrumbs | High | Happy Path |
| TC-CAT-110002 | Navigate Up a Level Using Breadcrumbs | High | Happy Path |
| TC-CAT-110003 | Breadcrumb Trail Displays Correctly with Multiple Parents | High | Happy Path |
| TC-CAT-110004 | Breadcrumb Trail Not Displayed for Single-Level Categories | High | Edge Case |
| TC-CAT-110005 | Breadcrumb Trail Missing When No Category Selected | High | Negative |
| TC-CAT-120001 | View Category Item Counts - Happy Path | High | Happy Path |
| TC-CAT-120002 | View Category Item Counts - No Product Assignments | High | Negative |
| TC-CAT-120003 | View Category Item Counts - User with Limited Permissions | High | Negative |
| TC-CAT-120004 | View Category Item Counts - Edge Case - Category with No Descendants | High | Edge Case |
| TC-CAT-120005 | View Category Item Counts - Edge Case - All Categories Empty | High | Edge Case |
| TC-CAT-130001 | Move Category to a Valid Parent with Permission | High | Happy Path |
| TC-CAT-130002 | Attempt to Move Category to Same Parent | High | Negative |
| TC-CAT-130003 | Move Category to Invalid Parent | High | Negative |
| TC-CAT-130004 | Move Category without Permission | High | Negative |
| TC-CAT-130005 | Move Category When Parent Hierarchy Would Form a Loop | High | Edge Case |
| TC-CAT-140001 | Activate Category with Valid Permission | Medium | Happy Path |
| TC-CAT-140003 | Attempt to Activate Deactivated Category with Valid Permission | Medium | Happy Path |
| TC-CAT-140005 | Attempt to Activate Non-Existent Category | Medium | Negative |
| TC-CAT-150001 | View existing category details | Medium | Happy Path |
| TC-CAT-150002 | Verify category not found error | High | Negative |
| TC-CAT-150003 | Access category without permission | Medium | Negative |
| TC-CAT-150004 | Edge case - category with zero products | Medium | Edge Case |
| TC-CAT-210001 | Happy Path - Valid Category Selection | High | Happy Path |
| TC-CAT-210002 | Negative Case - Unavailable Category | High | Negative |
| TC-CAT-210003 | Edge Case - Multiple Category Selection | Medium | Edge Case |
| TC-CAT-220001 | Happy Path - Generate Inventory Report with Valid Categories | High | Happy Path |
| TC-CAT-220002 | Negative Case - Generate Report Without Valid Categories | High | Negative |
| TC-CAT-220003 | Edge Case - Generate Report with Maximum Number of Categories | High | Edge Case |
| TC-CAT-230001 | Happy Path - Category-based Purchase Request | High | Happy Path |
| TC-CAT-230002 | Negative Case - Invalid Category Selection | High | Negative |
| TC-CAT-230003 | Edge Case - No Categories Available | Medium | Edge Case |
| TC-CAT-230005 | Happy Path - Spend Analysis by Category | High | Happy Path |
| TC-CAT-240001 | Happy Path - Recipe Cost Calculation by Category | Medium | Happy Path |
| TC-CAT-240002 | Negative - Invalid Ingredient Selection | Medium | Negative |
| TC-CAT-240004 | Happy Path - Ingredient Usage Analysis by Category | Medium | Happy Path |

---

## TC-CAT-010001 — View all categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วและมีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. ตรวจสอบว่า category ระดับบนสุดทั้งหมดแสดงอยู่
3. คลิก category
4. ตรวจสอบว่า subcategory แสดงในโครงสร้าง tree ที่ขยายได้

**Expected**

category ทั้งหมดแสดงถูกต้องและสามารถขยายได้ในโครงสร้าง tree

---

## TC-CAT-010002 — No permission to view categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. ตรวจสอบว่าไม่มี category แสดง

**Expected**

ผู้ใช้เห็นข้อความ error หรือข้อความแจ้งการจำกัดสิทธิ์

---

## TC-CAT-010003 — Expand and collapse category levels

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ระดับบนสุด
3. ตรวจสอบว่า subcategory ขยายออก
4. คลิก subcategory
5. ตรวจสอบว่า sub-subcategory ขยายออก
6. คลิก sub-subcategory
7. ตรวจสอบว่า sub-sub-subcategory ขยายออก
8. คลิก sub-sub-subcategory
9. ตรวจสอบว่า tree กลับสู่สถานะก่อนหน้า

**Expected**

ผู้ใช้สามารถขยายและยุบระดับ category ได้ตามที่คาดหวัง

---

## TC-CAT-010004 — Category hierarchy with very long names

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่มีชื่อยาวมาก
3. ตรวจสอบว่า subcategory ยังแสดงอย่างถูกต้อง

**Expected**

โครงสร้าง category hierarchy แสดงถูกต้องแม้ชื่อ category จะยาวมาก

---

## TC-CAT-010005 — Multiple levels of categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ระดับบนสุด
3. คลิก subcategory
4. คลิก sub-subcategory
5. ตรวจสอบว่าทุกระดับแสดงถูกต้อง

**Expected**

ทุกระดับของ category hierarchy แสดงถูกต้อง

---

## TC-CAT-020001 — Happy Path - Create Root Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category และมี role 'Product Manager' หรือ 'System Administrator'

**Steps**

1. คลิก 'New Category'
2. กรอก 'Category Name' ด้วยชื่อที่ถูกต้อง
3. คลิก 'Save'

**Expected**

category สร้างสำเร็จและแสดงอยู่ใน list ของ category

---

## TC-CAT-020002 — Negative - No Permission to Create Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์สร้าง category

**Steps**

1. คลิก 'New Category'
2. กรอก 'Category Name' ด้วยชื่อที่ถูกต้อง
3. คลิก 'Save'

**Expected**

ผู้ใช้ได้รับข้อความ error แจ้งว่าไม่มีสิทธิ์สร้าง category

---

## TC-CAT-020003 — Edge Case - Category Name Exceeds Maximum Length

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category

**Steps**

1. คลิก 'New Category'
2. กรอก 'Category Name' ด้วย 101 ตัวอักษร (เกินความยาวสูงสุด 100)
3. คลิก 'Save'

**Expected**

การสร้าง category ล้มเหลวพร้อมข้อความ error แจ้งว่าชื่อเกินความยาวสูงสุด

---

## TC-CAT-030001 — Happy Path - Create Subcategory

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ; parent category มีอยู่จริงและ active

**Steps**

1. ไปที่ /product-management/category
2. คลิก parent category
3. คลิก 'New Subcategory'
4. กรอกชื่อ subcategory
5. คลิก 'Save'

**Expected**

subcategory สร้างสำเร็จและแสดงอยู่ใต้ parent category

---

## TC-CAT-030002 — Negative Case - Invalid Subcategory Name

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /product-management/category
2. คลิก parent category
3. คลิก 'New Subcategory'
4. กรอกชื่อ subcategory ที่ไม่ถูกต้อง (เช่น ตัวเลขอย่างเดียว)
5. คลิก 'Save'

**Expected**

แสดงข้อความ error แจ้งว่าชื่อ subcategory ไม่ถูกต้อง

---

## TC-CAT-030003 — Negative Case - No Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์สร้าง category

**Steps**

1. ไปที่ /product-management/category
2. คลิก parent category
3. คลิก 'New Subcategory'

**Expected**

ผู้ใช้ถูกแจ้งให้ login หรือไม่มีสิทธิ์ดำเนินการ

---

## TC-CAT-030004 — Edge Case - Maximum Subcategory Level

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /product-management/category
2. คลิก parent category
3. คลิก 'New Subcategory'
4. ทำซ้ำขั้นตอนข้างต้นจนถึงระดับ subcategory สูงสุดที่อนุญาต

**Expected**

ระบบจำกัดการสร้าง subcategory ที่ระดับสูงสุดที่อนุญาตและไม่ยอมให้ซ้อนเพิ่มเติม

---

## TC-CAT-040001 — Create Valid Item Group

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; มี subcategory อย่างน้อย 1 รายการ; parent subcategory มีอยู่จริงและ active

**Steps**

1. ไปที่ /product-management/category
2. คลิก 'New Item Group'
3. กรอก 'Item Group Name'
4. เลือก 'Parent Subcategory'
5. คลิก 'Save'

**Expected**

item group ใหม่สร้างสำเร็จและแสดงอยู่ใน category list

---

## TC-CAT-040002 — Create Item Group with Missing Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์สร้าง category

**Steps**

1. ไปที่ /product-management/category
2. พยายามคลิก 'New Item Group'

**Expected**

ผู้ใช้ไม่สามารถเข้าถึงปุ่ม 'New Item Group' และเห็นข้อความ error เรื่องสิทธิ์ที่เหมาะสม

---

## TC-CAT-040003 — Create Item Group with Invalid Subcategory Selection

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; ไม่มี subcategory อยู่

**Steps**

1. ไปที่ /product-management/category
2. คลิก 'New Item Group'
3. กรอก 'Item Group Name'
4. เลือก 'Non-Existent Subcategory'
5. คลิก 'Save'

**Expected**

ผู้ใช้ได้รับข้อความ error แจ้งว่า subcategory ที่เลือกไม่มีอยู่

---

## TC-CAT-040005 — Create Item Group with Long Name

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง category; มี subcategory อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /product-management/category
2. คลิก 'New Item Group'
3. กรอก 'Item Group Name' ด้วยชื่อที่ยาวเกินขีดจำกัด
4. คลิก 'Save'

**Expected**

ผู้ใช้ได้รับข้อความ error แจ้งว่าชื่อ item group เกินขีดจำกัดจำนวนตัวอักษร

---

## TC-CAT-050001 — Edit Existing Category Name

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริง; ไม่ถูกอ้างอิงในกระบวนการสำคัญ

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่
3. คลิก 'Edit'
4. กรอกชื่อ category ใหม่
5. คลิก 'Save'

**Expected**

ชื่อ category อัปเดตสำเร็จและสะท้อนในระบบ

---

## TC-CAT-050002 — Try to Edit Non-Existent Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category ไม่มีอยู่

**Steps**

1. ไปที่ /product-management/category
2. พยายามเลือก category ที่ไม่มีอยู่
3. คลิก 'Edit'

**Expected**

ระบบแสดงข้อความ error แจ้งว่า category ไม่มีอยู่

---

## TC-CAT-050003 — Edit Category with No Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์แก้ไข category

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่
3. คลิก 'Edit'

**Expected**

ระบบแสดงข้อความ error แจ้งว่าสิทธิ์ไม่เพียงพอ

---

## TC-CAT-050004 — Edit Category with Invalid Input

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริง

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่
3. คลิก 'Edit'
4. กรอกชื่อ category ที่ไม่ถูกต้อง (เช่น น้อยกว่า 3 ตัวอักษร)
5. คลิก 'Save'

**Expected**

ระบบแสดงข้อความ error แจ้ง input ที่ไม่ถูกต้อง

---

## TC-CAT-050005 — Edit Category with Active Reference

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

category ถูกอ้างอิงอยู่ในกระบวนการสำคัญ

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่
3. คลิก 'Edit'

**Expected**

ระบบแสดงข้อความ error แจ้งว่าไม่สามารถแก้ไข category ได้เนื่องจากมีการอ้างอิงที่ active อยู่

---

## TC-CAT-060001 — Delete existing category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น System Administrator; category มีอยู่จริงและไม่ได้ถูกทำเครื่องหมายว่าลบแล้ว

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่เพื่อลบ
3. คลิก 'Delete'
4. ตรวจสอบว่า dialog 'Are you sure you want to delete this category?' ปรากฏ
5. คลิก 'Yes'

**Expected**

category ถูกทำเครื่องหมายว่าลบแล้วโดยยังคงข้อมูลที่เกี่ยวข้องเพื่อการตรวจสอบ

---

## TC-CAT-060002 — Attempt to delete category with assigned products

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

category มีอยู่จริงและมี product ที่กำหนดไว้อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มี product กำหนดไว้
3. คลิก 'Delete'
4. ตรวจสอบข้อความ error 'Cannot delete category with product assignments'

**Expected**

การพยายามลบ category ล้มเหลวและแสดงข้อความ error

---

## TC-CAT-060003 — Attempt to delete non-existing category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

กรอกชื่อ category ที่ไม่มีอยู่

**Steps**

1. ไปที่ /product-management/category
2. กรอกชื่อ category ที่ไม่มีอยู่ในช่องค้นหา
3. คลิก 'Delete'
4. ตรวจสอบข้อความ 'Category not found'

**Expected**

ระบบแสดงข้อความ 'Category not found' และไม่มีการเปลี่ยนแปลงใด

---

## TC-CAT-060004 — Delete category after logging out

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

category มีอยู่จริงและไม่ได้ถูกทำเครื่องหมายว่าลบแล้ว

**Steps**

1. ไปที่ /product-management/category
2. เลือก category ที่มีอยู่เพื่อลบ
3. คลิก 'Delete'
4. Logout
5. พยายามยืนยันการลบ
6. ตรวจสอบข้อความ 'Please log in to proceed'

**Expected**

ไม่สามารถดำเนินการลบได้และผู้ใช้ถูกแจ้งให้ login

---

## TC-CAT-070001 — Reorder Categories within Same Parent

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับเดียวกัน; ผู้ใช้กำลังดู tree view

**Steps**

1. ไปที่ /product-management/category
2. หา category A และ B ภายใต้ parent เดียวกัน
3. คลิกและลาก category B ไปวางถัดจาก category A
4. ปล่อยเมาส์

**Expected**

category A และ B ถูกจัดเรียงใหม่ติดกันภายใต้ parent เดียวกัน

---

## TC-CAT-070002 — Move Category to Different Parent

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับที่แตกต่างกัน

**Steps**

1. ไปที่ /product-management/category
2. หา category C ภายใต้ parent 1
3. คลิกและลาก category C เข้า parent 2
4. ปล่อยเมาส์

**Expected**

category C ถูกย้ายไปอยู่ใต้ parent 2

---

## TC-CAT-070003 — Unable to Reorder without Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์จัดการ category

**Steps**

1. ไปที่ /product-management/category
2. พยายามคลิกและลาก category A และ B

**Expected**

ผู้ใช้ไม่สามารถจัดเรียง category ใหม่ได้และแสดงข้อความ error

---

## TC-CAT-070004 — Attempt to Drag Category Outside of Current Parent

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับเดียวกัน

**Steps**

1. ไปที่ /product-management/category
2. คลิกและลาก category A ออกนอก parent ปัจจุบัน
3. ปล่อยเมาส์

**Expected**

category A ยังคงอยู่ที่ตำแหน่งเดิมและแสดงข้อความ error

---

## TC-CAT-070005 — Drag Category with No Siblings

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์จัดการ category; มี category เพียง 1 รายการ

**Steps**

1. ไปที่ /product-management/category
2. พยายามคลิกและลาก category เดียวที่มีอยู่

**Expected**

ผู้ใช้ไม่สามารถจัดเรียง category เพียงรายการเดียวได้และแสดงข้อความ error

---

## TC-CAT-080001 — Switch from Tree to List View

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่

**Steps**

1. ไปที่ /product-management/category
2. คลิกตัวเลือก view 'List'
3. ตรวจสอบว่า category แสดงในรูปแบบ flat list

**Expected**

category แสดงในรูปแบบ flat list

---

## TC-CAT-080002 — Switch from List to Tree View

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่ใน List view

**Steps**

1. ไปที่ /product-management/category
2. คลิกตัวเลือก view 'Tree'
3. ตรวจสอบว่า category แสดงในรูปแบบ tree แบบลำดับชั้น

**Expected**

category แสดงในรูปแบบ tree แบบลำดับชั้น

---

## TC-CAT-080003 — Negative: Switch View with No Categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories ที่ไม่มี category อยู่

**Steps**

1. ไปที่ /product-management/category
2. คลิกตัวเลือก view 'Tree'
3. คลิกตัวเลือก view 'List'
4. ตรวจสอบว่าไม่มี category แสดง

**Expected**

ไม่มี category แสดง

---

## TC-CAT-080004 — Edge Case: Switch Views Multiple Times

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่

**Steps**

1. ไปที่ /product-management/category
2. คลิกตัวเลือก view 'Tree'
3. คลิกตัวเลือก view 'List'
4. คลิกตัวเลือก view 'Tree'
5. ตรวจสอบว่า category แสดงในรูปแบบ tree แบบลำดับชั้น

**Expected**

category แสดงในรูปแบบ tree แบบลำดับชั้น

---

## TC-CAT-090001 — Happy Path - Search for Existing Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิกไอคอน 'Search'
3. กรอก 'Category Name' ด้วย 'Electronics'
4. คลิก 'Search'

**Expected**

ผลการค้นหาแสดง category 'Electronics' พร้อมคำอธิบายที่ตรงกัน

---

## TC-CAT-090002 — Negative Case - Search with Invalid Input

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิกไอคอน 'Search'
3. กรอก 'Category Name' ด้วย 'InvalidCategory123'
4. คลิก 'Search'

**Expected**

ผลการค้นหาไม่พบรายการที่ตรงกันและแสดงข้อความหรือ placeholder แจ้งว่าไม่พบผลลัพธ์

---

## TC-CAT-090003 — Edge Case - Search with Empty Input

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิกไอคอน 'Search'
3. กรอก 'Category Name' ด้วย input ว่างเปล่า
4. คลิก 'Search'

**Expected**

ผลการค้นหาไม่เปลี่ยนจาก view เริ่มต้น

---

## TC-CAT-090004 — Negative Case - User without Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ดู category

**Steps**

1. ไปที่ /product-management/category
2. คลิกไอคอน 'Search'
3. กรอก 'Category Name' ด้วย 'Office Supplies'
4. คลิก 'Search'

**Expected**

ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือได้รับข้อความ error

---

## TC-CAT-100001 — Apply multiple filters successfully

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการที่มีคุณสมบัติหลากหลาย

**Steps**

1. คลิกปุ่ม 'Filter'
2. เลือก 'Level' และเลือก 'Tier 1'
3. เลือก 'Status' และเลือก 'Active'
4. เลือก 'Parent' และเลือก 'Electronics'
5. คลิก 'Apply Filters'

**Expected**

category ที่กรองแสดงตามเกณฑ์ที่เลือก

---

## TC-CAT-100002 — Apply filters with invalid input

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ

**Steps**

1. คลิกปุ่ม 'Filter'
2. เลือก 'Level' และเลือก option ที่ไม่ถูกต้อง (เช่น 'Invalid Tier')
3. คลิก 'Apply Filters'

**Expected**

แสดงข้อความ error แจ้ง input ที่ไม่ถูกต้อง

---

## TC-CAT-100003 — Apply filters with no categories matching

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ

**Steps**

1. คลิกปุ่ม 'Filter'
2. เลือก 'Level' และเลือก 'Tier 3'
3. คลิก 'Apply Filters'

**Expected**

ไม่มี category แสดงและข้อความแจ้งว่าไม่พบผลลัพธ์ที่ตรงกัน

---

## TC-CAT-100004 — Apply filters with no filters applied

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ

**Steps**

1. คลิกปุ่ม 'Filter'
2. ไม่เลือกตัวเลือกใดๆ
3. คลิก 'Apply Filters'

**Expected**

แสดง category ทั้งหมด

---

## TC-CAT-110001 — Select a Category with Breadcrumbs

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วและเลือก category ใน tree view

**Steps**

1. ไปที่ category tree view
2. คลิก category ที่มี parent อย่างน้อย 1 ระดับ
3. ตรวจสอบว่า breadcrumb trail แสดงเส้นทางเต็มจาก root ไปยัง category ที่เลือก

**Expected**

breadcrumb trail แสดงเส้นทางจาก root ไปยัง category ที่เลือกได้อย่างถูกต้อง

---

## TC-CAT-110002 — Navigate Up a Level Using Breadcrumbs

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้เลือก category ใน tree view ที่มี parent อย่างน้อย 1 ระดับ

**Steps**

1. ไปที่ category ที่เลือกซึ่งมี breadcrumb trail
2. คลิก breadcrumb ก่อนสุดท้ายใน trail
3. ตรวจสอบว่าผู้ใช้ถูกนำไปยัง parent category

**Expected**

ผู้ใช้ถูกนำไปยัง parent category ตามที่ระบุโดย breadcrumb ที่คลิกได้สำเร็จ

---

## TC-CAT-110003 — Breadcrumb Trail Displays Correctly with Multiple Parents

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้เลือก category ที่มี parent หลายระดับ

**Steps**

1. ไปที่ category ที่ซ้อนลึก
2. ตรวจสอบว่า breadcrumb trail แสดงทุกระดับของ parent category ได้ถูกต้อง

**Expected**

breadcrumb trail แสดงเส้นทางจาก root ไปยัง category ที่เลือกได้อย่างถูกต้องและครบถ้วน ไม่ว่าจะลึกแค่ไหน

---

## TC-CAT-110004 — Breadcrumb Trail Not Displayed for Single-Level Categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้เลือก category ระดับบนสุดที่ไม่มี parent

**Steps**

1. ไปที่ category ระดับบนสุด
2. ตรวจสอบว่า breadcrumb trail ไม่แสดง

**Expected**

breadcrumb trail ไม่แสดงเมื่อ category ที่เลือกเป็นระดับบนสุด

---

## TC-CAT-110005 — Breadcrumb Trail Missing When No Category Selected

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ยังไม่ได้เลือก category ใดๆ

**Steps**

1. ตรวจสอบว่า breadcrumb trail ไม่ visible

**Expected**

breadcrumb trail ไม่ visible เมื่อไม่ได้เลือก category

---

## TC-CAT-120001 — View Category Item Counts - Happy Path

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ login แล้วและกำลังดู category hierarchy ใน tree view

**Steps**

1. ไปที่ /product-management/category
2. รอให้ category tree โหลด
3. เลือก category node
4. ตรวจสอบว่าจำนวน category แสดงอยู่
5. ขยาย category node ที่เลือกเพื่อดูจำนวนของ descendant

**Expected**

จำนวน category แม่นยำและแสดงอยู่ รวมถึงจำนวนของ descendant ทั้งหมดก็แสดงด้วย

---

## TC-CAT-120002 — View Category Item Counts - No Product Assignments

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

category ที่เลือกไม่มี product กำหนดไว้

**Steps**

1. ไปที่ /product-management/category
2. รอให้ category tree โหลด
3. เลือก category node ที่ไม่มี product กำหนดไว้
4. ตรวจสอบว่าจำนวนของ category ที่เลือกและ descendant เป็นศูนย์

**Expected**

จำนวน category และ descendant แสดงเป็นศูนย์

---

## TC-CAT-120003 — View Category Item Counts - User with Limited Permissions

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์จำกัดในการดูจำนวน category

**Steps**

1. ไปที่ /product-management/category
2. รอให้ category tree โหลด
3. เลือก category node
4. ตรวจสอบว่าจำนวนถูกซ่อนหรือแสดงว่าไม่มีสิทธิ์

**Expected**

จำนวน category ถูกซ่อนหรือแสดงว่าไม่มีสิทธิ์สำหรับผู้ใช้ที่มีสิทธิ์จำกัด

---

## TC-CAT-120004 — View Category Item Counts - Edge Case - Category with No Descendants

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

category ที่เลือกไม่มี descendant

**Steps**

1. ไปที่ /product-management/category
2. รอให้ category tree โหลด
3. เลือก category node ที่ไม่มี descendant
4. ตรวจสอบว่าจำนวนแสดงเฉพาะ category ที่เลือกเท่านั้น และไม่มีจำนวนสำหรับ descendant

**Expected**

จำนวน category แม่นยำและแสดงเฉพาะ category ที่เลือก โดยไม่มีจำนวนสำหรับ descendant

---

## TC-CAT-120005 — View Category Item Counts - Edge Case - All Categories Empty

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

category ทั้งหมดไม่มี product กำหนดไว้

**Steps**

1. ไปที่ /product-management/category
2. รอให้ category tree โหลด
3. เลือก category node หลายรายการ
4. ตรวจสอบว่าจำนวนของแต่ละ category ที่เลือกเป็นศูนย์

**Expected**

จำนวนของแต่ละ category ที่เลือกแสดงเป็นศูนย์

---

## TC-CAT-130001 — Move Category to a Valid Parent with Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์จัดการ category; target parent มีอยู่จริงและรับ children ได้

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ต้องการย้าย
3. คลิกปุ่ม 'Move'
4. เลือก target parent ที่ถูกต้อง
5. คลิก 'Move'

**Expected**

category ถูกย้ายไปยัง target parent สำเร็จและ hierarchy ยังคงสอดคล้องกัน

---

## TC-CAT-130002 — Attempt to Move Category to Same Parent

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

target parent เป็น parent ปัจจุบัน

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ต้องการย้าย
3. คลิกปุ่ม 'Move'
4. เลือก target parent เดิม
5. คลิก 'Move'

**Expected**

ไม่มีการเปลี่ยนแปลง category hierarchy และผู้ใช้ได้รับข้อความ error แจ้งว่า target parent ต้องไม่เป็น parent ปัจจุบัน

---

## TC-CAT-130003 — Move Category to Invalid Parent

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

target parent ไม่รับ children ในระดับที่เหมาะสม

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ต้องการย้าย
3. คลิกปุ่ม 'Move'
4. เลือก target parent ที่ไม่ถูกต้อง
5. คลิก 'Move'

**Expected**

การดำเนินการถูกปฏิเสธ ผู้ใช้ได้รับข้อความ error แจ้งว่า target parent ไม่ถูกต้องหรือไม่รับ children ในระดับที่เหมาะสม

---

## TC-CAT-130004 — Move Category without Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์จัดการ category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ต้องการย้าย
3. คลิกปุ่ม 'Move'
4. เลือก target parent
5. คลิก 'Move'

**Expected**

ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือได้รับข้อความ error แจ้งว่าสิทธิ์ไม่เพียงพอ

---

## TC-CAT-130005 — Move Category When Parent Hierarchy Would Form a Loop

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

target parent จะสร้าง circular reference หากดำเนินการย้าย

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ต้องการย้าย
3. คลิกปุ่ม 'Move'
4. เลือก target parent ที่จะสร้าง loop
5. คลิก 'Move'

**Expected**

การดำเนินการถูกปฏิเสธ ผู้ใช้ได้รับข้อความ error แจ้งว่าจะเกิด circular reference

---

## TC-CAT-140001 — Activate Category with Valid Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริงและไม่ได้ถูกลบ

**Steps**

1. ไปที่ /product-management/category
2. คลิก 'Activate' ที่ category ที่ต้องการ
3. ตรวจสอบว่าสถานะ category เป็น active แล้ว
4. ยืนยันว่า category visible ใน product assignment dropdowns

**Expected**

สถานะ category อัปเดตเป็น active และ visible ใน product assignments

---

## TC-CAT-140003 — Attempt to Activate Deactivated Category with Valid Permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริงและถูก deactivated แล้ว

**Steps**

1. ไปที่ /product-management/category
2. คลิก 'Activate' ที่ category ที่ต้องการ
3. ตรวจสอบว่าสถานะ category เป็น active แล้ว
4. ยืนยันว่า category visible ใน product assignment dropdowns

**Expected**

สถานะ category อัปเดตเป็น active และ visible ใน product assignments

---

## TC-CAT-140005 — Attempt to Activate Non-Existent Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข category; category ไม่มีอยู่

**Steps**

1. ไปที่ /product-management/category
2. พยายามคลิก 'Activate' ที่ category ที่ไม่มีอยู่
3. ตรวจสอบข้อความ error หรือการไม่เปลี่ยนแปลงสถานะ category

**Expected**

สถานะ category ไม่เปลี่ยนแปลงและแสดงข้อความ error

---

## TC-CAT-150001 — View existing category details

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้เลือก category ใน tree หรือ list view; มีสิทธิ์ดูรายละเอียด category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่มีอยู่ใน list หรือ tree view
3. ตรวจสอบว่าชื่อ category, คำอธิบาย, ตำแหน่งใน hierarchy, จำนวน product และข้อมูล audit แสดงอยู่

**Expected**

รายละเอียด category แสดงถูกต้อง

---

## TC-CAT-150002 — Verify category not found error

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

เลือก category ที่ไม่มีอยู่

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่ไม่มีอยู่ใน list หรือ tree view
3. ตรวจสอบว่าแสดงข้อความ error แจ้งว่า category ไม่มีอยู่

**Expected**

แสดงข้อความ error แจ้งว่า category ไม่มีอยู่

---

## TC-CAT-150003 — Access category without permission

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ดูรายละเอียด category

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ใน list หรือ tree view
3. ตรวจสอบว่าระบบ redirect ไปยังหน้าปฏิเสธสิทธิ์หรือแสดงข้อความ error

**Expected**

ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือเห็นข้อความ error

---

## TC-CAT-150004 — Edge case - category with zero products

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

category มี product เป็นศูนย์

**Steps**

1. ไปที่ /product-management/category
2. คลิก category ที่มี product เป็นศูนย์ใน list หรือ tree view
3. ตรวจสอบว่ารายละเอียด category แสดงจำนวน product เป็นศูนย์

**Expected**

รายละเอียด category แสดงจำนวน product เป็นศูนย์

---

## TC-CAT-210001 — Happy Path - Valid Category Selection

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

category มีอยู่และ Product module เข้าถึงได้

**Steps**

1. ไปที่ /product-management/product/new
2. คลิก dropdown สำหรับ product category
3. เลือก category ที่ถูกต้อง
4. ตรวจสอบว่า category ที่เลือกแสดงใน UI

**Expected**

category ที่เลือกแสดงใน UI ได้ถูกต้อง

---

## TC-CAT-210002 — Negative Case - Unavailable Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

category มีอยู่และ Product module เข้าถึงได้

**Steps**

1. ไปที่ /product-management/product/new
2. คลิก dropdown สำหรับ product category
3. พยายามเลือก category ที่ไม่พร้อมใช้งาน
4. ตรวจสอบว่าการเลือกไม่เปลี่ยนแปลง

**Expected**

category ที่ไม่พร้อมใช้งานไม่ถูกเลือกและการเลือกปัจจุบันยังคงเดิม

---

## TC-CAT-210003 — Edge Case - Multiple Category Selection

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

category มีอยู่และ Product module เข้าถึงได้

**Steps**

1. ไปที่ /product-management/product/new
2. คลิก dropdown สำหรับ product category
3. เลือก category หลายรายการด้วย multi-selection (ถ้ามี)
4. ตรวจสอบว่า category ที่เลือกทั้งหมดแสดงใน UI ได้ถูกต้อง

**Expected**

category ที่เลือกทั้งหมดแสดงใน UI ได้ถูกต้อง

---

## TC-CAT-220001 — Happy Path - Generate Inventory Report with Valid Categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ข้อมูล category พร้อมสำหรับการรายงาน; product category ถูกต้อง

**Steps**

1. ไปที่ /inventory/reports
2. คลิก 'Generate Report'
3. เลือก 'Daily Report' จาก dropdown
4. คลิก 'Generate'

**Expected**

รายงาน inventory สร้างสำเร็จพร้อมข้อมูล category ที่ถูกต้อง

---

## TC-CAT-220002 — Negative Case - Generate Report Without Valid Categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ข้อมูล category บางส่วนไม่ถูกต้องหรือขาดหายไป

**Steps**

1. ไปที่ /inventory/reports
2. คลิก 'Generate Report'
3. เลือก 'Daily Report' จาก dropdown
4. คลิก 'Generate'

**Expected**

การสร้างรายงานล้มเหลวพร้อมข้อความ error แจ้งว่าข้อมูล category ไม่ถูกต้อง

---

## TC-CAT-220003 — Edge Case - Generate Report with Maximum Number of Categories

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ระบบอนุญาต category สูงสุดสำหรับการรายงาน; ฐานข้อมูลมี category ถึงจำนวนสูงสุด

**Steps**

1. ไปที่ /inventory/reports
2. คลิก 'Generate Report'
3. เลือก 'Daily Report' จาก dropdown
4. คลิก 'Generate'

**Expected**

การสร้างรายงานสำเร็จและรวม category ทั้งหมดจนถึงจำนวนสูงสุดที่อนุญาต

---

## TC-CAT-230001 — Happy Path - Category-based Purchase Request

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

category มีอยู่และกำหนดไว้กับ product; ผู้ใช้มีสิทธิ์สร้าง purchase request

**Steps**

1. ไปที่ /procurement/purchase-request
2. คลิก 'New Purchase Request'
3. เลือก category จาก dropdown
4. กรอกรายละเอียด product
5. คลิก 'Save'

**Expected**

purchase request สร้างสำเร็จและเชื่อมโยงกับ category ที่เลือก

---

## TC-CAT-230002 — Negative Case - Invalid Category Selection

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

category มีอยู่; เลือก category ที่ไม่ถูกต้อง

**Steps**

1. ไปที่ /procurement/purchase-request
2. คลิก 'New Purchase Request'
3. เลือก category ที่ไม่ถูกต้องหรือไม่มีอยู่
4. พยายาม Save

**Expected**

ระบบแสดงข้อความ error แจ้งการเลือก category ที่ไม่ถูกต้อง

---

## TC-CAT-230003 — Edge Case - No Categories Available

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ไม่มี category; ผู้ใช้มีสิทธิ์สร้าง purchase request

**Steps**

1. ไปที่ /procurement/purchase-request
2. คลิก 'New Purchase Request'
3. พยายามเลือก category จาก dropdown

**Expected**

ระบบแสดงข้อความแจ้งว่าไม่มี category

---

## TC-CAT-230005 — Happy Path - Spend Analysis by Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

category มีอยู่และเชื่อมโยงกับ purchase order; ฟีเจอร์ spend analysis เปิดใช้งาน

**Steps**

1. ไปที่ /spend-analysis
2. คลิก 'Analyze by Category'
3. เลือก category
4. คลิก 'Generate Report'

**Expected**

รายงาน spend analysis สร้างสำเร็จและแสดงสำหรับ category ที่เลือก

---

## TC-CAT-240001 — Happy Path - Recipe Cost Calculation by Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ข้อมูล category พร้อมสำหรับ recipe query; ingredient ของ recipe มี category

**Steps**

1. ไปที่ /recipes
2. คลิก 'New Recipe'
3. เลือก ingredient จาก category ต่างๆ
4. คลิก 'Save'
5. ไปที่ 'Recipe Costs'
6. ตรวจสอบว่าต้นทุนคำนวณถูกต้องตาม category

**Expected**

ต้นทุน recipe แสดงถูกต้องตาม category

---

## TC-CAT-240002 — Negative - Invalid Ingredient Selection

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ingredient ของ recipe มี category

**Steps**

1. ไปที่ /recipes
2. คลิก 'New Recipe'
3. เลือก ingredient ที่ไม่อยู่ใน category ใดๆ
4. คลิก 'Save'
5. ตรวจสอบข้อความ error หรือสถานะที่ไม่ถูกต้อง

**Expected**

แสดงข้อความ error หรือการเลือก ingredient ถูกปฏิเสธ

---

## TC-CAT-240004 — Happy Path - Ingredient Usage Analysis by Category

> **As a** Purchase user, **I want** this Product Category behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ingredient ของ recipe มี category

**Steps**

1. ไปที่ /recipes
2. คลิก 'Usage Analysis'
3. ตรวจสอบว่าการใช้ ingredient แสดงตาม category

**Expected**

การใช้ ingredient แสดงตาม category ได้ถูกต้อง

---


<sub>Last regenerated: 2026-05-07 · git 66a0085</sub>
