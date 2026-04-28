# Business Type — User Stories

_Generated from `tests/029-business-type.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Business Type
**Spec:** `tests/029-business-type.spec.ts`
**Default role:** Purchase
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-BT00101 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-BT00102 | ปุ่ม Add แสดง | High | Smoke |
| TC-BT00103 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-BT00104 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-BT00105 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-BT00106 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-BT00107 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-BT00108 | ลบรายการ | High | CRUD |
| TC-BT00113 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-BT00109 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-BT00110 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-BT00111 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-BT00112 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-BT00101 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Business Type list page to load successfully, **so that** I can manage Business Type records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/business-type

**Expected**

URL ตรงกับ /config/business-type; หน้า list โหลดสำเร็จโดยไม่ error

---

## TC-BT00102 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Business Type list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/business-type

**Steps**

1. ไปที่ /config/business-type

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-BT00103 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Business Type search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/business-type

**Steps**

1. ไปที่ /config/business-type
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-BT00104 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Business Type records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/business-type

**Steps**

1. ไปที่ /config/business-type
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-BT00105 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Business Type submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/business-type

**Steps**

1. ไปที่ /config/business-type
2. เปิด dialog Add
3. กด Save โดยไม่กรอก name

**Expected**

Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)

---

## TC-BT00106 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Business Type record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB

**Steps**

1. ไปที่ /config/business-type
2. เปิด dialog Add
3. กรอก name
4. กด Save
5. ค้นหาด้วย NAME

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-BT00107 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Business Type record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-BT00106 ผ่านแล้ว → record NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด edit dialog
3. แก้ name เป็น NAME_UPDATED
4. กด Save
5. ค้นหาด้วย NAME_UPDATED

**Expected**

Updated/success toast ปรากฏ; แถวที่มี NAME_UPDATED ปรากฏใน list

---

## TC-BT00108 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Business Type record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-BT00113 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. กด Delete บนแถว
3. ยืนยัน Delete ใน confirm dialog

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-BT00113 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Business Type submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-BT00107 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด edit dialog
3. clear name
4. กด Save

**Expected**

Error message ปรากฏใน dialog (form block submit; ยังคงอยู่ใน edit mode)

---

## TCS-BT00109 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Business Type inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/business-type; XSS dialog guard attached

**Steps**

1. เปิด list /config/business-type
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TCS-BT00110 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Business Type fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/business-type

**Steps**

1. เปิด list /config/business-type
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-BT00111 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Business Type submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/business-type

**Steps**

1. เปิด list /config/business-type
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-BT00112 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Business Type, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/business-type

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/business-type

**Expected**

User ถูก redirect ออกจาก /config/business-type หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-04-28 · git 9591f92</sub>
