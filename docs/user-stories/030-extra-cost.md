# Extra Cost — User Stories

_Generated from `tests/030-extra-cost.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Extra Cost
**Spec:** `tests/030-extra-cost.spec.ts`
**Default role:** Purchase
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EC00101 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-EC00102 | ปุ่ม Add แสดง | High | Smoke |
| TC-EC00103 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-EC00104 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-EC00105 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-EC00106 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-EC00107 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-EC00108 | ลบรายการ | High | CRUD |
| TC-EC00113 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-EC00109 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-EC00110 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-EC00111 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-EC00112 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-EC00101 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Extra Cost list page to load successfully, **so that** I can manage Extra Cost records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/extra-cost

**Expected**

URL matches /config/extra-cost; หน้า list render สำเร็จ

---

## TC-EC00102 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Extra Cost list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/extra-cost

**Steps**

1. ไปที่ /config/extra-cost

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-EC00103 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Extra Cost search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/extra-cost

**Steps**

1. ไปที่ /config/extra-cost
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-EC00104 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Extra Cost records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/extra-cost

**Steps**

1. ไปที่ /config/extra-cost
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-EC00105 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Extra Cost submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/extra-cost

**Steps**

1. เปิด Add dialog
2. กด Save โดยไม่กรอกชื่อ

**Expected**

Error message แสดงใน dialog (required validation); dialog ยังเปิดอยู่

---

## TC-EC00106 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Extra Cost record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด Add dialog
2. กรอก name = NAME
3. กด Save
4. ค้นหาด้วย NAME

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มีชื่อ NAME ปรากฏใน list

---

## TC-EC00107 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Extra Cost record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-EC00106 ผ่านแล้ว → record NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด edit dialog
3. clear ชื่อและกรอก NAME_UPDATED
4. กด Save
5. ค้นหา NAME_UPDATED

**Expected**

Updated/success toast ปรากฏ; แถวที่มีชื่อ NAME_UPDATED ปรากฏใน list

---

## TC-EC00108 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Extra Cost record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-EC00113 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. กด Delete ที่แถว
3. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-EC00113 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Extra Cost submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-EC00107 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด edit dialog
3. clear name
4. กด Save

**Expected**

Error message แสดงใน dialog (required validation); dialog ยังเปิดอยู่

---

## TCS-EC00109 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Extra Cost inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/extra-cost; XSS dialog guard attached

**Steps**

1. เปิด list /config/extra-cost
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TCS-EC00110 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Extra Cost fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/extra-cost

**Steps**

1. เปิด list /config/extra-cost
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-EC00111 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Extra Cost submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/extra-cost

**Steps**

1. เปิด list /config/extra-cost
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-EC00112 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Extra Cost, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/extra-cost

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/extra-cost

**Expected**

User ถูก redirect ออกจาก /config/extra-cost หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-06 · git 2497e17</sub>
