# Purchase Request Template — User Stories

_Generated from `tests/310-purchase-request-template.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Purchase Request Template
**Spec:** `tests/310-purchase-request-template.spec.ts`
**Default role:** Purchase
**Total test cases:** 60 (31 High / 27 Medium / 2 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PRT-010001 | Happy Path - Create Template with Valid Data | High | Happy Path |
| TC-PRT-010002 | Negative - No Permission to Create Template | High | Negative |
| TC-PRT-010003 | Edge Case - Create Template without Assigned Department | High | Edge Case |
| TC-PRT-010004 | Negative - Empty Fields for Template | High | Negative |
| TC-PRT-020001 | View template with valid permissions | High | Happy Path |
| TC-PRT-020003 | View non-existent template | High | Negative |
| TC-PRT-020004 | View template with no budget allocations | Medium | Edge Case |
| TC-PRT-020005 | View template with very long usage history | Medium | Edge Case |
| TC-PRT-030001 | Edit Template - Happy Path | High | Happy Path |
| TC-PRT-030002 | Edit Template - Invalid Input | High | Negative |
| TC-PRT-030003 | Edit Template - No Permission | High | Negative |
| TC-PRT-030004 | Edit Template - Template In ReadOnly Status | High | Edge Case |
| TC-PRT-030005 | Edit Template - No Existing Template | High | Edge Case |
| TC-PRT-040001 | Delete valid template - Happy Path | Medium | Happy Path |
| TC-PRT-040002 | Attempt to delete default template - Negative Case | Medium | Negative |
| TC-PRT-040003 | Delete template with no permissions - Negative Case | Medium | Negative |
| TC-PRT-040004 | Attempt to delete template that does not exist - Negative Case | Low | Negative |
| TC-PRT-040005 | Delete template with multiple selections - Edge Case | Medium | Edge Case |
| TC-PRT-050001 | Clone existing template successfully | Medium | Happy Path |
| TC-PRT-050002 | User without permission cannot clone template | Medium | Negative |
| TC-PRT-050003 | Clone template with non-existent source | Medium | Negative |
| TC-PRT-050004 | Clone template with different departments | Medium | Edge Case |
| TC-PRT-060001 | Set Default Template Successfully | Medium | Happy Path |
| TC-PRT-060002 | Set Default Template with No Permission | Medium | Negative |
| TC-PRT-060003 | Set Default Template with Invalid Template | Medium | Negative |
| TC-PRT-060004 | Set Default Template for Unrelated Department | Medium | Negative |
| TC-PRT-060005 | Set Default Template with Multiple Selections | Medium | Edge Case |
| TC-PRT-070001 | Add valid item to template | High | Happy Path |
| TC-PRT-070002 | Add item with missing budget code | High | Negative |
| TC-PRT-070003 | Add item with no permission | High | Negative |
| TC-PRT-070004 | Add item with zero quantity | High | Negative |
| TC-PRT-070005 | Add item with very large quantity | High | Edge Case |
| TC-PRT-080001 | Edit existing template item successfully | High | Happy Path |
| TC-PRT-080002 | Attempt to edit template without permission | High | Negative |
| TC-PRT-080003 | Edit template item with invalid quantity | High | Negative |
| TC-PRT-080004 | Edit template item with no selected item | High | Negative |
| TC-PRT-080005 | Edit template item with minimal changes | Medium | Edge Case |
| TC-PRT-090001 | Delete template item - happy path | Medium | Happy Path |
| TC-PRT-090002 | Delete template item - no permission | Medium | Negative |
| TC-PRT-090003 | Delete template item - no items present | Low | Edge Case |
| TC-PRT-100001 | Search for template by name | High | Happy Path |
| TC-PRT-100002 | Filter templates by category | High | Happy Path |
| TC-PRT-100003 | Search with invalid input | High | Negative |
| TC-PRT-100004 | Filter with no permission | High | Negative |
| TC-PRT-100005 | Edge case - search with empty input | Medium | Edge Case |
| TC-PRT-110001 | Bulk Template Creation | Medium | Happy Path |
| TC-PRT-110002 | Bulk Template Deletion Without Permission | High | Negative |
| TC-PRT-110003 | Bulk Template Update with Invalid Data | Medium | Negative |
| TC-PRT-110004 | Bulk Template Operation with Empty Selection | Medium | Edge Case |
| TC-PRT-110005 | Bulk Template Operation on Single Template | Medium | Edge Case |
| TC-PRT-210001 | Happy Path - Convert Template to Purchase Request | High | Happy Path |
| TC-PRT-210002 | Negative Case - Insufficient Permissions | High | Negative |
| TC-PRT-210003 | Edge Case - Template with Empty Fields | Medium | Edge Case |
| TC-PRT-220001 | Valid Budget Code Input | High | Happy Path |
| TC-PRT-220003 | No Budget Code Selection | High | Negative |
| TC-PRT-220004 | Budget Code Exceeds Character Limit | High | Edge Case |
| TC-PRT-220005 | User Without Save Permission | High | Negative |
| TC-PRT-230001 | Browse Catalog and Retrieve Valid Data | Medium | Happy Path |
| TC-PRT-230002 | Browse Catalog with Invalid Permission | Medium | Negative |
| TC-PRT-230003 | Retrieve Catalog Data After Server Timeout | Medium | Edge Case |

---

## TC-PRT-010001 — Happy Path - Create Template with Valid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Create Purchase Request Template'; ถูกกำหนดให้อย่างน้อยหนึ่งแผนก; มี budget code และ account อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'New Purchase Request'
3. กรอก Item Specifications
4. กรอก Quantity
5. กรอก Pricing
6. เลือก Budget Code
7. เลือก Account
8. คลิก 'Save'

**Expected**

Purchase request template ถูกสร้างและบันทึกสำเร็จ

---

## TC-PRT-010002 — Negative - No Permission to Create Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Create Purchase Request Template'

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'New Purchase Request'

**Expected**

ระบบแสดงข้อความ permission denied

---

## TC-PRT-010003 — Edge Case - Create Template without Assigned Department

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้างแต่ไม่ได้ถูกกำหนดให้กับแผนกใดๆ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'New Purchase Request'

**Expected**

ระบบแสดงข้อความแสดงข้อผิดพลาดว่าผู้ใช้ต้องถูกกำหนดให้กับแผนก

---

## TC-PRT-010004 — Negative - Empty Fields for Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง; ถูกกำหนดให้อย่างน้อยหนึ่งแผนก

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'New Purchase Request'
3. กรอกเฉพาะบางส่วนของ required fields
4. คลิก 'Save'

**Expected**

ระบบแสดงข้อความแสดงข้อผิดพลาดสำหรับ required fields ที่ยังไม่ได้กรอก

---

## TC-PRT-020001 — View template with valid permissions

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'View Purchase Request Templates'; template มีอยู่ในระบบ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่ template card
3. ตรวจสอบว่า metadata, configured items, budget allocations และ usage history ทั้งหมดแสดงผล

**Expected**

รายละเอียด template ทั้งหมดแสดงผลถูกต้อง

---

## TC-PRT-020003 — View non-existent template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ 'View Purchase Request Templates'

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่ link template ที่ไม่มีอยู่
3. ตรวจสอบข้อความแสดงข้อผิดพลาดหรือการปฏิเสธการเข้าถึง

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดหรือได้รับแจ้งว่า template ไม่มีอยู่

---

## TC-PRT-020004 — View template with no budget allocations

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ view; template มีอยู่โดยไม่มี budget allocations

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่ template card
3. ตรวจสอบว่าไม่มี budget allocation entries แสดงผล

**Expected**

ส่วน budget allocations ไม่แสดง entries ใดๆ

---

## TC-PRT-020005 — View template with very long usage history

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ view; template มีอยู่พร้อม usage history ที่ยาวมาก

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่ template card
3. ตรวจสอบว่า usage history ถูก truncated หรือแบ่งหน้า

**Expected**

usage history ถูก truncated หรือแบ่งหน้า ทำให้ผู้ใช้สามารถดูข้อมูลได้ในปริมาณที่เหมาะสม

---

## TC-PRT-030001 — Edit Template - Happy Path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข; template มีอยู่และอยู่ในสถานะที่แก้ไขได้ (Draft หรือ Active); ผู้ใช้เป็นผู้สร้าง template หรือมีสิทธิ์สูงกว่า

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่มีอยู่
3. กรอก description ที่อัปเดต
4. ปรับ quantity หรือ price
5. ตรวจสอบว่าการเปลี่ยนแปลงถูกบันทึก
6. คลิก 'Save'

**Expected**

Template ถูกอัปเดตด้วย description, quantity และ price ใหม่ การเปลี่ยนแปลงสะท้อนใน template

---

## TC-PRT-030002 — Edit Template - Invalid Input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข; template มีอยู่และอยู่ในสถานะที่แก้ไขได้

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่มีอยู่
3. กรอกค่า quantity ที่เป็นลบ
4. พยายาม save
5. ตรวจสอบข้อความแสดงข้อผิดพลาด

**Expected**

แสดงข้อความแสดงข้อผิดพลาดว่า quantity ต้องไม่เป็นค่าลบ

---

## TC-PRT-030003 — Edit Template - No Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่ใช่ผู้สร้าง template และไม่มีสิทธิ์สูงกว่า

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่มีอยู่
3. พยายามทำการเปลี่ยนแปลงใดๆ
4. ตรวจสอบว่าไม่สามารถ save การเปลี่ยนแปลงได้

**Expected**

ผู้ใช้ไม่สามารถทำการเปลี่ยนแปลงได้และได้รับข้อความ permission denied

---

## TC-PRT-030004 — Edit Template - Template In ReadOnly Status

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Template อยู่ในสถานะที่แก้ไขไม่ได้ (Locked หรือ Inactive)

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่อยู่ในสถานะที่แก้ไขไม่ได้
3. พยายามทำการเปลี่ยนแปลงใดๆ
4. ตรวจสอบว่าไม่สามารถ save การเปลี่ยนแปลงได้

**Expected**

ผู้ใช้ไม่สามารถทำการเปลี่ยนแปลงได้และได้รับข้อความว่า template เป็น read-only

---

## TC-PRT-030005 — Edit Template - No Existing Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข; template ไม่มีอยู่

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามคลิก 'Edit' สำหรับ template ที่ไม่มีอยู่
3. ตรวจสอบว่าไม่สามารถดำเนินการใดๆ ได้

**Expected**

ผู้ใช้ไม่สามารถดำเนินการใดๆ กับ template ที่ไม่มีอยู่ได้

---

## TC-PRT-040001 — Delete valid template - Happy Path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ลบ; template มีอยู่และไม่ได้ถูกกำหนดเป็น default ของแผนก

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. เลือก template ที่ต้องการลบ
3. คลิก 'Delete'
4. Confirm การลบ

**Expected**

Template ถูกลบออกจากระบบสำเร็จ

---

## TC-PRT-040002 — Attempt to delete default template - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ลบ; default template มีอยู่ในระบบสำหรับแผนก

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามลบ default template

**Expected**

ระบบป้องกันการลบ default template และแสดงข้อความแสดงข้อผิดพลาด

---

## TC-PRT-040003 — Delete template with no permissions - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Delete Purchase Request Template'

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามลบ template ใดๆ

**Expected**

ระบบแสดงข้อความแสดงข้อผิดพลาดว่าผู้ใช้ไม่มีสิทธิ์ที่ต้องการ

---

## TC-PRT-040004 — Attempt to delete template that does not exist - Negative Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ลบ; template ไม่มีอยู่ในระบบ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามลบ template ที่ไม่มีอยู่

**Expected**

ระบบแสดงข้อความแสดงข้อผิดพลาดว่า template ไม่มีอยู่

---

## TC-PRT-040005 — Delete template with multiple selections - Edge Case

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ลบ; มี template หลายรายการและไม่มีรายการใดถูกกำหนดเป็น default

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. เลือก template หลายรายการ
3. คลิก 'Delete'
4. Confirm การลบ

**Expected**

template ที่เลือกถูกลบออกจากระบบสำเร็จ

---

## TC-PRT-050001 — Clone existing template successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง; source template มีอยู่และเข้าถึงได้

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Clone' ที่ source template
3. Confirm การ clone

**Expected**

template ใหม่ถูกสร้างเป็นสำเนาของ source template พร้อมรายละเอียดครบถ้วน

---

## TC-PRT-050002 — User without permission cannot clone template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์สร้าง; source template มีอยู่และเข้าถึงได้

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามคลิก 'Clone' ที่ source template

**Expected**

ผู้ใช้ได้รับข้อความ access denied หรือตัวเลือก 'Clone' ถูก grayed out

---

## TC-PRT-050003 — Clone template with non-existent source

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง; source template ไม่มีอยู่

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามคลิก 'Clone' ที่ template ที่ไม่มีอยู่

**Expected**

ผู้ใช้ได้รับแจ้งว่า source template ไม่มีอยู่

---

## TC-PRT-050004 — Clone template with different departments

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์สร้าง; source template มีอยู่และมาจากแผนกอื่น

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Clone' ที่ source template
3. ตรวจสอบว่าแผนกของ template ใหม่ตรงกับแผนกของผู้ใช้

**Expected**

แผนกของ template ใหม่ตรงกับแผนกของผู้ใช้ แสดงให้เห็นว่าการ clone ถูกจำกัดไว้ที่แผนกของผู้ใช้

---

## TC-PRT-060001 — Set Default Template Successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Manage Default Templates'; template มีอยู่และอยู่ในสถานะ Active; ผู้ใช้เข้าถึงแผนกของ template ได้

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Manage Templates'
3. เลือก template
4. คลิก 'Set as Default'
5. Confirm

**Expected**

Template ถูกกำหนดเป็น default และแสดงข้อความสำเร็จ

---

## TC-PRT-060002 — Set Default Template with No Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Manage Default Templates'

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Manage Templates'
3. พยายามเลือก template และกำหนดเป็น default

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่าไม่มีสิทธิ์ manage default templates

---

## TC-PRT-060003 — Set Default Template with Invalid Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ manage; template ไม่มีอยู่หรืออยู่ในสถานะ Inactive

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Manage Templates'
3. พยายามเลือก template ที่ไม่มีอยู่หรือ inactive แล้วกำหนดเป็น default

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่า template ที่เลือกไม่ถูกต้อง

---

## TC-PRT-060004 — Set Default Template for Unrelated Department

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ manage; template มีอยู่; ผู้ใช้ไม่มีสิทธิ์เข้าถึงแผนกของ template

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Manage Templates'
3. เลือก template
4. พยายามกำหนดเป็น default

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่าไม่มีสิทธิ์เข้าถึงแผนกของ template

---

## TC-PRT-060005 — Set Default Template with Multiple Selections

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

มี template หลายรายการและอยู่ในสถานะ Active

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Manage Templates'
3. เลือก template หลายรายการ
4. พยายามกำหนดเป็น default

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่าสามารถกำหนด default ได้เพียงหนึ่ง template ในแต่ละครั้ง

---

## TC-PRT-070001 — Add valid item to template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้อยู่ใน edit mode ของ template; มีสิทธิ์แก้ไข; มี budget และ account code อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Add Item'
3. กรอก 'Item Name' ด้วย 'Desk'
4. กรอก 'Quantity' ด้วย '50'
5. กรอก 'Price' ด้วย '100.50'
6. เลือก 'Budget Code' จาก dropdown
7. เลือก 'Account Code' จาก dropdown
8. คลิก 'Save'

**Expected**

Item 'Desk' ถูกเพิ่มเข้า template พร้อมรายละเอียดที่ถูกต้องและบันทึกสำเร็จ

---

## TC-PRT-070002 — Add item with missing budget code

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ใน edit mode ของ template; มีสิทธิ์แก้ไข; ไม่มี budget code

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Add Item'
3. กรอก 'Item Name' ด้วย 'Chair'
4. กรอก 'Quantity' ด้วย '25'
5. กรอก 'Price' ด้วย '75.00'
6. คลิก 'Save'

**Expected**

แสดงข้อความแสดงข้อผิดพลาดว่าต้องระบุ budget code

---

## TC-PRT-070003 — Add item with no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ใน edit mode ของ template; ไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Add Item'

**Expected**

ผู้ใช้ถูก redirect ไปที่หน้า access denied หรือที่คล้ายกัน

---

## TC-PRT-070004 — Add item with zero quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้อยู่ใน edit mode ของ template; มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Add Item'
3. กรอก 'Item Name' ด้วย 'Table'
4. กรอก 'Quantity' ด้วย '0'
5. กรอก 'Price' ด้วย '200.00'
6. เลือก 'Budget Code' จาก dropdown
7. เลือก 'Account Code' จาก dropdown
8. คลิก 'Save'

**Expected**

แสดงข้อความแสดงข้อผิดพลาดว่า quantity ต้องไม่เป็นศูนย์

---

## TC-PRT-070005 — Add item with very large quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้อยู่ใน edit mode ของ template; มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Add Item'
3. กรอก 'Item Name' ด้วย 'File Cabinet'
4. กรอก 'Quantity' ด้วย '999999999999999'
5. กรอก 'Price' ด้วย '150.00'
6. เลือก 'Budget Code' จาก dropdown
7. เลือก 'Account Code' จาก dropdown
8. คลิก 'Save'

**Expected**

แสดงข้อความแสดงข้อผิดพลาดว่า quantity มีค่ามากเกินไป

---

## TC-PRT-080001 — Edit existing template item successfully

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ; ผู้ใช้มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่รายการที่มีอยู่ใน template list
3. แก้ไข quantity ของรายการ
4. คลิก 'Save'

**Expected**

รายการถูกอัปเดตด้วย quantity ใหม่; ยอดรวม template ถูกคำนวณใหม่

---

## TC-PRT-080002 — Attempt to edit template without permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ; ผู้ใช้ไม่มีสิทธิ์แก้ไข

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่รายการที่มีอยู่ใน template list
3. พยายามแก้ไข quantity ของรายการ

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่ามีสิทธิ์ไม่เพียงพอในการแก้ไข template

---

## TC-PRT-080003 — Edit template item with invalid quantity

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่รายการที่มีอยู่ใน template list
3. กรอกค่า quantity ที่ไม่ถูกต้อง (เช่น ค่าลบ)
4. คลิก 'Save'

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่า input ไม่ถูกต้องและรายการไม่ได้รับการอัปเดต

---

## TC-PRT-080004 — Edit template item with no selected item

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามคลิก 'Save' โดยไม่เลือกรายการ

**Expected**

ผู้ใช้ได้รับข้อความแสดงข้อผิดพลาดว่าไม่ได้เลือกรายการ

---

## TC-PRT-080005 — Edit template item with minimal changes

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกที่รายการที่มีอยู่ใน template list
3. แก้ไข price ของรายการด้วยจำนวนที่น้อยที่สุดที่เป็นไปได้
4. คลิก 'Save'

**Expected**

รายการถูกอัปเดตด้วย price ขั้นต่ำใหม่; ยอดรวม template ถูกคำนวณใหม่

---

## TC-PRT-090001 — Delete template item - happy path

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข; กำลังดู template ใน edit mode; template มีอย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่ต้องการ
3. คลิกที่แท็บ 'Items'
4. เลือกรายการใน list
5. คลิกปุ่ม 'Delete'
6. Confirm การลบหากมีการแจ้งเตือน

**Expected**

รายการที่เลือกถูกลบออกจาก template, ยอดรวม template ถูกคำนวณใหม่, และการลบถูกบันทึกไว้

---

## TC-PRT-090002 — Delete template item - no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์แก้ไข; กำลังดู template ใน view mode; template มีอย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'View' สำหรับ template ที่ต้องการ
3. พยายามคลิกปุ่ม 'Edit'
4. ตรวจสอบว่าปุ่ม 'Edit' ถูก disabled หรือไม่ visible

**Expected**

ผู้ใช้ไม่สามารถนำทางไปยัง edit mode และไม่สามารถลบรายการได้

---

## TC-PRT-090003 — Delete template item - no items present

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์แก้ไข; template ไม่มีรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Edit' สำหรับ template ที่ต้องการ
3. คลิกที่แท็บ 'Items'
4. พยายามลบรายการ
5. ตรวจสอบว่า item list ว่างเปล่าและไม่มีตัวเลือกลบ

**Expected**

ผู้ใช้ได้รับแจ้งว่าไม่มีรายการที่จะลบ

---

## TC-PRT-100001 — Search for template by name

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง templates list; มี template อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. กรอก 'Search' ด้วย 'example template'
3. คลิก 'Search'

**Expected**

แสดง list ของ template ที่ค้นหาเจอที่มีคำว่า 'example template'

---

## TC-PRT-100002 — Filter templates by category

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง templates list; มี template อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกปุ่ม 'Filter'
3. เลือก 'Category' จาก dropdown
4. เลือก category
5. คลิกปุ่ม 'Apply'

**Expected**

Template ถูก filter ตาม category ที่เลือก

---

## TC-PRT-100003 — Search with invalid input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง templates list; มี template อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. กรอก 'Search' ด้วย '!@#'
3. คลิก 'Search'

**Expected**

ไม่แสดง template และแสดงข้อความแสดงข้อผิดพลาด

---

## TC-PRT-100004 — Filter with no permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ดู templates

**Steps**

1. ไปที่ /procurement/purchase-request-template

**Expected**

ผู้ใช้ถูก redirect ไปที่หน้า unauthorized access หรือแสดงข้อความแสดงข้อผิดพลาด

---

## TC-PRT-100005 — Edge case - search with empty input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง templates list; มี template อย่างน้อยหนึ่งรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. ล้าง input field 'Search'
3. คลิก 'Search'

**Expected**

แสดง template ทั้งหมด

---

## TC-PRT-110001 — Bulk Template Creation

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์ 'Bulk Operations'; templates list มี template หลายรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกแท็บ 'Bulk Operations'
3. เลือกตัวเลือก 'Create Templates'
4. กรอกรายละเอียด template สำหรับหลาย template
5. คลิก 'Submit'

**Expected**

Bulk templates ถูกสร้างสำเร็จ

---

## TC-PRT-110002 — Bulk Template Deletion Without Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ 'Bulk Operations'

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกแท็บ 'Bulk Operations'
3. เลือกตัวเลือก 'Delete Templates'
4. เลือก template หลายรายการ
5. คลิก 'Confirm'

**Expected**

ระบบปฏิเสธการลบและแสดงข้อความแสดงข้อผิดพลาด

---

## TC-PRT-110003 — Bulk Template Update with Invalid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์ bulk operations

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกแท็บ 'Bulk Operations'
3. เลือกตัวเลือก 'Update Templates'
4. กรอกข้อมูลที่ไม่ถูกต้องสำหรับหลาย template
5. คลิก 'Submit'

**Expected**

ระบบป้องกันการ submit และแสดงข้อความแสดงข้อผิดพลาดสำหรับข้อมูลที่ไม่ถูกต้อง

---

## TC-PRT-110004 — Bulk Template Operation with Empty Selection

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ bulk operations

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกแท็บ 'Bulk Operations'
3. พยายามดำเนิน bulk operation ใดๆ โดยไม่เลือก template

**Expected**

ระบบแสดงข้อความแสดงข้อผิดพลาดว่าไม่ได้เลือก template

---

## TC-PRT-110005 — Bulk Template Operation on Single Template

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มีสิทธิ์ bulk operations; มี template หลายรายการ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกแท็บ 'Bulk Operations'
3. เลือก template เดียว
4. ดำเนิน bulk operation (เช่น update, delete)
5. Confirm การดำเนินการ

**Expected**

ระบบดำเนินการกับ template ที่เลือกเพียงรายการเดียว

---

## TC-PRT-210001 — Happy Path - Convert Template to Purchase Request

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี template ที่ถูกต้องบันทึกอยู่ในระบบ

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกปุ่ม 'Use Template'
3. ตรวจสอบว่ารายละเอียด template ถูกกรอกใน purchase request form
4. คลิกปุ่ม 'Save'

**Expected**

Purchase request ถูกสร้างพร้อมรายละเอียด template และบันทึกสำเร็จ

---

## TC-PRT-210002 — Negative Case - Insufficient Permissions

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้ไม่มีสิทธิ์ใช้ templates

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. พยายามคลิกปุ่ม 'Use Template'
3. ตรวจสอบข้อความแสดงข้อผิดพลาดว่า permission denied

**Expected**

ผู้ใช้ไม่สามารถใช้ template และได้รับข้อความแสดงข้อผิดพลาดที่เหมาะสม

---

## TC-PRT-210003 — Edge Case - Template with Empty Fields

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี template ที่มี field ว่างบางส่วน

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิกปุ่ม 'Use Template'
3. ตรวจสอบว่า field ที่ไม่มีข้อมูลถูกปล่อยว่างใน purchase request form

**Expected**

Field ที่ไม่มีข้อมูลใน template ไม่ถูกกรอกใน purchase request form

---

## TC-PRT-220001 — Valid Budget Code Input

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง Templates Module และอยู่ที่ item form พร้อม budget code ที่ถูกต้อง

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. กรอก field 'Budget Code' ด้วย code ที่ถูกต้อง
3. คลิก 'Save Template'

**Expected**

Template ถูกบันทึกสำเร็จพร้อม budget code ที่ถูกต้อง

---

## TC-PRT-220003 — No Budget Code Selection

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง Templates Module และอยู่ที่ item form โดยไม่ได้เลือก budget code

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. ปล่อย field 'Budget Code' ว่าง
3. คลิก 'Save Template'

**Expected**

แสดงข้อความแสดงข้อผิดพลาดให้เลือก budget code ที่ถูกต้อง

---

## TC-PRT-220004 — Budget Code Exceeds Character Limit

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้อยู่ที่ item form พร้อม budget code ที่เกิน character limit ที่อนุญาต

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. กรอก field 'Budget Code' ด้วย code ที่เกิน limit ที่อนุญาต
3. คลิก 'Save Template'

**Expected**

แสดงข้อความแสดงข้อผิดพลาดว่า budget code เกิน character limit

---

## TC-PRT-220005 — User Without Save Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง Templates Module แต่ไม่มีสิทธิ์บันทึก templates

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. กรอก field 'Budget Code' ด้วย code ที่ถูกต้อง
3. คลิก 'Save Template'

**Expected**

ระบบปฏิเสธการบันทึกและแจ้งผู้ใช้เกี่ยวกับสิทธิ์ที่ไม่เพียงพอ

---

## TC-PRT-230001 — Browse Catalog and Retrieve Valid Data

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้ Login เข้าสู่ระบบพร้อมสิทธิ์ที่เหมาะสม

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Browse Catalog'
3. ตรวจสอบว่าข้อมูล catalog ถูกดึงและแสดงผลอย่างถูกต้อง

**Expected**

ข้อมูล catalog ถูกดึงและแสดงผลให้ผู้ใช้สำเร็จ

---

## TC-PRT-230002 — Browse Catalog with Invalid Permission

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

ผู้ใช้ Login เข้าสู่ระบบแต่ไม่มีสิทธิ์ที่เหมาะสม

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Browse Catalog'
3. ตรวจสอบว่าระบบปฏิเสธการเข้าถึงหรือแสดงข้อความแสดงข้อผิดพลาด

**Expected**

ระบบปฏิเสธการเข้าถึงหรือแสดงข้อความแสดงข้อผิดพลาดที่เหมาะสมว่ามีสิทธิ์ไม่เพียงพอ

---

## TC-PRT-230003 — Retrieve Catalog Data After Server Timeout

> **As a** Purchase user, **I want** this Purchase Request Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Server ตอบกลับด้วย timeout error เมื่อพยายาม fetch ข้อมูล

**Steps**

1. ไปที่ /procurement/purchase-request-template
2. คลิก 'Browse Catalog'
3. รอ server timeout
4. ตรวจสอบว่าระบบจัดการ timeout ได้อย่างเหมาะสม

**Expected**

ระบบจัดการ server timeout ได้อย่างเหมาะสมและให้ feedback ที่เหมาะสมแก่ผู้ใช้

---


<sub>Last regenerated: 2026-05-07 · git 6b1bee1</sub>
