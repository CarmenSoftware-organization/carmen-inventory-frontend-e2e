# Adjustment Type — User Stories

_Generated from `tests/002-adjustment-type.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Adjustment Type
**Spec:** `tests/002-adjustment-type.spec.ts`
**Default role:** Purchase
**Total test cases:** 15 (11 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-AT01 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-AT02 | ปุ่ม Add แสดง | High | Smoke |
| TC-AT03 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-AT04 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-AT05 | บันทึกโดยไม่กรอก code/name ต้องแสดง error | High | Validation |
| TC-AT06 | สร้างรายการใหม่ (Stock In) และปรากฏในตาราง | High | CRUD |
| TC-AT07 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-AT08 | ลบรายการ (Stock In) | High | CRUD |
| TC-AT09 | สร้างรายการใหม่ (Stock Out) และปรากฏในตาราง | High | CRUD |
| TC-AT10 | ลบรายการ (Stock Out) | High | CRUD |
| TC-AT15 | แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-AT11 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-AT12 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-AT13 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-AT14 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-AT01 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Adjustment Type list page to load successfully, **so that** I can manage Adjustment Type records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/adjustment-type

**Expected**

URL matches /config/adjustment-type; ปุ่ม Add และช่องค้นหา visible ภายใน 10s

---

## TC-AT02 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Adjustment Type list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/adjustment-type

**Steps**

1. ไปที่ /config/adjustment-type

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-AT03 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Adjustment Type search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/adjustment-type

**Steps**

1. ไปที่ /config/adjustment-type
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-AT04 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Adjustment Type records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/adjustment-type

**Steps**

1. ไปที่ /config/adjustment-type
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-AT05 — บันทึกโดยไม่กรอก code/name ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Adjustment Type submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/adjustment-type/new

**Steps**

1. เปิดฟอร์ม new
2. กด Save โดยไม่กรอก code/name

**Expected**

URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)

---

## TC-AT06 — สร้างรายการใหม่ (Stock In) และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Adjustment Type record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code + name
3. เลือก type = Stock In ใน combobox
4. กด Save
5. กลับ list และค้นหาด้วย CODE

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี CODE ปรากฏใน list

---

## TC-AT07 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Adjustment Type record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-AT06 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB

**Steps**

1. ค้นหา CODE ใน list
2. คลิกแถวเพื่อเปิด detail
3. กดปุ่ม Edit
4. แก้ name เป็น NAME_UPDATED
5. กด Save

**Expected**

Updated/success toast ปรากฏ (updated/success/สำเร็จ)

---

## TC-AT08 — ลบรายการ (Stock In)

> **As a** Purchase user, **I want** to delete a Adjustment Type record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-AT15 ผ่านแล้ว → record CODE ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา CODE ใน list
2. เปิด detail
3. กด Edit
4. กด Delete
5. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-AT09 — สร้างรายการใหม่ (Stock Out) และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Adjustment Type record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE_OUT ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code_out + name_out
3. เลือก type = Stock Out ใน combobox
4. กด Save
5. กลับ list และค้นหาด้วย CODE_OUT

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี CODE_OUT ปรากฏใน list

---

## TC-AT10 — ลบรายการ (Stock Out)

> **As a** Purchase user, **I want** to delete a Adjustment Type record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-AT09 ผ่านแล้ว → record CODE_OUT มีอยู่ใน DB

**Steps**

1. ค้นหา CODE_OUT ใน list
2. เปิด detail
3. กด Edit
4. กด Delete
5. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-AT15 — แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Adjustment Type submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-AT07 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา CODE ใน list
2. เปิด detail
3. กด Edit
4. clear code + name
5. กด Save

**Expected**

Save button ยังคง visible (form ไม่ submit; ยังอยู่ใน edit mode)

---

## TCS-AT11 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Adjustment Type inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/adjustment-type; XSS dialog guard attached

**Steps**

1. เปิด new form ของ /config/adjustment-type
2. กรอก code ด้วย random suffix
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload; URL ยังคงอยู่ภายใต้ /config/ (ฟอร์มอาจ reject หรือ save แบบ escaped)

---

## TCS-AT12 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Adjustment Type fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/adjustment-type

**Steps**

1. เปิด list /config/adjustment-type
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-AT13 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Adjustment Type submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/adjustment-type

**Steps**

1. เปิด new form ของ /config/adjustment-type
2. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-AT14 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Adjustment Type, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/adjustment-type

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/adjustment-type

**Expected**

User ถูก redirect ออกจาก /config/adjustment-type หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-04-27 · git 01c0d09</sub>
