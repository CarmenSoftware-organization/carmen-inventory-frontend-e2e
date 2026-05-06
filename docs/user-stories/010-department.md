# Department — User Stories

_Generated from `tests/010-department.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Department
**Spec:** `tests/010-department.spec.ts`
**Default role:** Purchase
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DEP00101 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-DEP00102 | ปุ่ม Add แสดง | High | Smoke |
| TC-DEP00103 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-DEP00104 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-DEP00105 | บันทึกโดยไม่กรอก code/name ต้องแสดง error | High | Validation |
| TC-DEP00106 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-DEP00107 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-DEP00108 | ลบรายการ | High | CRUD |
| TC-DEP00113 | แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-DEP00109 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-DEP00110 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-DEP00111 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-DEP00112 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-DEP00101 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Department list page to load successfully, **so that** I can manage Department records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/department

**Expected**

URL matches /config/department; หน้า list โหลดสำเร็จและพร้อมใช้งาน

---

## TC-DEP00102 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Department list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/department

**Steps**

1. ไปที่ /config/department
2. ตรวจสอบว่าปุ่ม Add ปรากฏ

**Expected**

ปุ่ม Add visible บนหน้า list (พร้อมเข้าสู่ flow create)

---

## TC-DEP00103 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Department search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/department

**Steps**

1. ไปที่ /config/department
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-DEP00104 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Department records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/department

**Steps**

1. ไปที่ /config/department
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-DEP00105 — บันทึกโดยไม่กรอก code/name ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Department submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/department/new

**Steps**

1. เปิดฟอร์ม new
2. กด Save โดยไม่กรอก code/name (รวมถึง parent ถ้ามี)

**Expected**

URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)

---

## TC-DEP00106 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Department record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE/NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code + name (ใช้ default parent/hierarchy ถ้ามี)
3. กด Save
4. กลับ list และค้นหาด้วย NAME

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-DEP00107 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Department record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-DEP00106 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด detail
3. กดปุ่ม Edit
4. clear name และกรอก NAME_UPDATED
5. กด Save

**Expected**

Updated/success toast ปรากฏ (updated/success/สำเร็จ)

---

## TC-DEP00108 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Department record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-DEP00113 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด detail
3. กด Edit
4. กด Delete
5. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-DEP00113 — แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Department submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-DEP00107 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด detail
3. กด Edit
4. clear code + name
5. กด Save

**Expected**

Save button ยังคง visible (form ไม่ submit; ยังอยู่ใน edit mode)

---

## TCS-DEP00109 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Department inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/department; XSS dialog guard attached

**Steps**

1. เปิด new form ของ /config/department
2. กรอก code ด้วย random suffix
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload; URL ยังคงอยู่ภายใต้ /config/ (ฟอร์มอาจ reject หรือ save แบบ escaped)

---

## TCS-DEP00110 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Department fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/department

**Steps**

1. เปิด list /config/department
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-DEP00111 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Department submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/department

**Steps**

1. เปิด new form ของ /config/department
2. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-DEP00112 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Department, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/department

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/department

**Expected**

User ถูก redirect ออกจาก /config/department หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-06 · git ee8b1fa</sub>
