# Tax Profile — User Stories

_Generated from `tests/042-tax-profile.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Tax Profile
**Spec:** `tests/042-tax-profile.spec.ts`
**Default role:** Purchase
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-TP00101 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-TP00102 | ปุ่ม Add แสดง | High | Smoke |
| TC-TP00103 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-TP00104 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-TP00105 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-TP00106 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-TP00107 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-TP00108 | ลบรายการ | High | CRUD |
| TC-TP00113 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-TP00109 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-TP00110 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-TP00111 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-TP00112 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-TP00101 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Tax Profile list page to load successfully, **so that** I can manage Tax Profile records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/tax-profile

**Expected**

URL matches /config/tax-profile; หน้า list ของ tax profile (มี name + rate columns) โหลดสำเร็จ

---

## TC-TP00102 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Tax Profile list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/tax-profile

**Steps**

1. ไปที่ /config/tax-profile

**Expected**

ปุ่ม Add visible บนหน้า list (พร้อมเปิด dialog สำหรับ name + rate)

---

## TC-TP00103 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Tax Profile search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/tax-profile

**Steps**

1. ไปที่ /config/tax-profile
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-TP00104 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Tax Profile records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/tax-profile

**Steps**

1. ไปที่ /config/tax-profile
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มี tax profile ที่ตรงกับคำค้น)

---

## TC-TP00105 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Tax Profile submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/tax-profile

**Steps**

1. เปิด Add dialog
2. กด Save โดยไม่กรอก name (rate ปล่อยตามค่า default)

**Expected**

Error message ปรากฏใต้ name input (required validation block submit); ปิด dialog ด้วย Cancel

---

## TC-TP00106 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Tax Profile record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; tax profile ชื่อ NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด Add dialog
2. กรอก name = NAME (rate ใช้ค่า default ของฟอร์ม)
3. กด Save
4. ค้นหา NAME ใน list

**Expected**

Success toast (created/success/สำเร็จ) และแถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-TP00107 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Tax Profile record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-TP00106 ผ่านแล้ว → tax profile ชื่อ NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด edit dialog
3. clear name + กรอก NAME_UPDATED (ไม่แก้ rate)
4. กด Save

**Expected**

Updated/success toast ปรากฏ และแถว NAME_UPDATED ปรากฏใน list (rate คงเดิม)

---

## TC-TP00108 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Tax Profile record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-TP00113 ผ่านแล้ว → tax profile ชื่อ NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. กด delete บนแถว
3. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ) และ tax profile ถูกลบจาก DB

---

## TC-TP00113 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Tax Profile submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-TP00107 ผ่านแล้ว → tax profile ชื่อ NAME_UPDATED มีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด edit dialog
3. clear name (rate ไม่แตะ)
4. กด Save

**Expected**

Error message ปรากฏใต้ name input (required validation block submit); ปิด dialog ด้วย Cancel

---

## TCS-TP00109 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Tax Profile inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/tax-profile; XSS dialog guard attached

**Steps**

1. เปิด list /config/tax-profile
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TCS-TP00110 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Tax Profile fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/tax-profile

**Steps**

1. เปิด list /config/tax-profile
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-TP00111 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Tax Profile submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/tax-profile

**Steps**

1. เปิด list /config/tax-profile
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-TP00112 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Tax Profile, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/tax-profile

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/tax-profile

**Expected**

User ถูก redirect ออกจาก /config/tax-profile หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-06 · git d345f91</sub>
