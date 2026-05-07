# Credit Note Reason — User Stories

_Generated from `tests/602-cn-reason.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Credit Note Reason
**Spec:** `tests/602-cn-reason.spec.ts`
**Default role:** Admin
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CNR-010001 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-CNR-010002 | ปุ่ม Add แสดง | High | Smoke |
| TC-CNR-010003 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-CNR-010004 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-CNR-010005 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-CNR-010006 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-CNR-010007 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-CNR-010008 | ลบรายการ | High | CRUD |
| TC-CNR-010013 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TC-CNR-100001 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TC-CNR-100002 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TC-CNR-100003 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TC-CNR-100004 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-CNR-010001 — หน้า list โหลดสำเร็จ

> **As a** Admin user, **I want** the Credit Note Reason list page to load successfully, **so that** I can manage Credit Note Reason records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as admin@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/credit-note-reason

**Expected**

URL matches /config/credit-note-reason; ปุ่ม Add และช่องค้นหา visible บนหน้า list

---

## TC-CNR-010002 — ปุ่ม Add แสดง

> **As a** Admin user, **I want** to see the Add button on the Credit Note Reason list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as admin@blueledgers.com; on /config/credit-note-reason

**Steps**

1. ไปที่ /config/credit-note-reason

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-CNR-010003 — ช่องค้นหาใช้งานได้

> **As a** Admin user, **I want** to type into the Credit Note Reason search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as admin@blueledgers.com; on /config/credit-note-reason

**Steps**

1. ไปที่ /config/credit-note-reason
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-CNR-010004 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Admin user, **I want** a clear empty-state when no Credit Note Reason records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as admin@blueledgers.com; on /config/credit-note-reason

**Steps**

1. ไปที่ /config/credit-note-reason
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-CNR-010005 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Admin user, **I want** the system to block invalid Credit Note Reason submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as admin@blueledgers.com; on /config/credit-note-reason

**Steps**

1. เปิด Add dialog
2. กด Save โดยไม่กรอก name
3. กด Cancel เพื่อปิด dialog

**Expected**

Error message ปรากฏใน dialog (form ไม่ submit; client-side validation block)

---

## TC-CNR-010006 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Admin user, **I want** to create a new Credit Note Reason record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as admin@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด Add dialog
2. กรอก name
3. กด Save
4. ค้นหาด้วย NAME ใน list

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-CNR-010007 — แก้ไขชื่อและบันทึก

> **As a** Admin user, **I want** to edit an existing Credit Note Reason record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CNR-010006 ผ่านแล้ว → record NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด edit dialog
3. clear name แล้วกรอก NAME_UPDATED
4. กด Save
5. ค้นหา NAME_UPDATED ใน list

**Expected**

Updated/success toast ปรากฏ; แถวที่มี NAME_UPDATED ปรากฏใน list

---

## TC-CNR-010008 — ลบรายการ

> **As a** Admin user, **I want** to delete a Credit Note Reason record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CNR-010013 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. กด Delete บนแถว
3. ยืนยัน Delete ใน confirm dialog

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-CNR-010013 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Admin user, **I want** the system to block invalid Credit Note Reason submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-CNR-010007 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด edit dialog
3. clear name
4. กด Save
5. กด Cancel เพื่อปิด dialog

**Expected**

Error message ปรากฏใน dialog (form ไม่ submit; ยังอยู่ใน edit mode)

---

## TC-CNR-100001 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Credit Note Reason inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/credit-note-reason; XSS dialog guard attached

**Steps**

1. เปิด list /config/credit-note-reason
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TC-CNR-100002 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Credit Note Reason fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/credit-note-reason

**Steps**

1. เปิด list /config/credit-note-reason
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TC-CNR-100003 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Admin user, **I want** the system to block invalid Credit Note Reason submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/credit-note-reason

**Steps**

1. เปิด list /config/credit-note-reason
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TC-CNR-100004 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Credit Note Reason, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/credit-note-reason

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/credit-note-reason

**Expected**

User ถูก redirect ออกจาก /config/credit-note-reason หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-07 · git 200baef</sub>
