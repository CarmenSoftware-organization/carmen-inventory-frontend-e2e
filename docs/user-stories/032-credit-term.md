# Credit Term — User Stories

_Generated from `tests/032-credit-term.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Credit Term
**Spec:** `tests/032-credit-term.spec.ts`
**Default role:** Admin
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CT-010001 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-CT-010002 | ปุ่ม Add แสดง | High | Smoke |
| TC-CT-010003 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-CT-010004 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-CT-010005 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-CT-010006 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-CT-010007 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-CT-010008 | ลบรายการ | High | CRUD |
| TC-CT-010013 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TC-CT-100001 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TC-CT-100002 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TC-CT-100003 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TC-CT-100004 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-CT-010001 — หน้า list โหลดสำเร็จ

> **As a** Admin user, **I want** the Credit Term list page to load successfully, **so that** I can manage Credit Term records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com ผ่าน auth fixture

**Steps**

1. ไปที่ /config/credit-term

**Expected**

URL matches /config/credit-term; หน้า list render สำเร็จโดยไม่มี error

---

## TC-CT-010002 — ปุ่ม Add แสดง

> **As a** Admin user, **I want** to see the Add button on the Credit Term list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com; อยู่ที่ /config/credit-term

**Steps**

1. ไปที่ /config/credit-term

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-CT-010003 — ช่องค้นหาใช้งานได้

> **As a** Admin user, **I want** to type into the Credit Term search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com; อยู่ที่ /config/credit-term

**Steps**

1. ไปที่ /config/credit-term
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-CT-010004 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Admin user, **I want** a clear empty-state when no Credit Term records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Login เป็น admin@blueledgers.com; อยู่ที่ /config/credit-term

**Steps**

1. ไปที่ /config/credit-term
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-CT-010005 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Admin user, **I want** the system to block invalid Credit Term submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Login เป็น admin@blueledgers.com; อยู่ที่ /config/credit-term พร้อม add dialog เปิดอยู่

**Steps**

1. กดปุ่ม Add เพื่อเปิด dialog
2. กด Save โดยไม่กรอกชื่อ

**Expected**

Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)

---

## TC-CT-010006 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Admin user, **I want** to create a new Credit Term record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Login เป็น admin@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด add dialog
2. กรอก name = NAME
3. กรอก value (credit term days) = 30
4. กด Save
5. ค้นหาด้วย NAME ใน list

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-CT-010007 — แก้ไขชื่อและบันทึก

> **As a** Admin user, **I want** to edit an existing Credit Term record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CT-010006 ผ่านแล้ว → record NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด edit dialog
3. clear name และกรอก NAME_UPDATED
4. กด Save
5. ค้นหาด้วย NAME_UPDATED

**Expected**

Updated/success toast ปรากฏ; แถวที่มี NAME_UPDATED ปรากฏใน list

---

## TC-CT-010008 — ลบรายการ

> **As a** Admin user, **I want** to delete a Credit Term record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CT-010013 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. กดปุ่ม Delete บนแถว
3. ยืนยัน Delete ใน confirm dialog

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-CT-010013 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Admin user, **I want** the system to block invalid Credit Term submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-CT-010007 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด edit dialog
3. clear name
4. กด Save

**Expected**

Error message ปรากฏใน dialog (form block submit; ยังอยู่ใน edit mode)

---

## TC-CT-100001 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Credit Term inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/credit-term; XSS dialog guard attached

**Steps**

1. เปิด list /config/credit-term
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TC-CT-100002 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Credit Term fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/credit-term

**Steps**

1. เปิด list /config/credit-term
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TC-CT-100003 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Admin user, **I want** the system to block invalid Credit Term submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/credit-term

**Steps**

1. เปิด list /config/credit-term
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TC-CT-100004 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Credit Term, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/credit-term

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/credit-term

**Expected**

User ถูก redirect ออกจาก /config/credit-term หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-07 · git 200baef</sub>
