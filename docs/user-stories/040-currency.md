# Currency — User Stories

_Generated from `tests/040-currency.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Currency
**Spec:** `tests/040-currency.spec.ts`
**Default role:** Purchase
**Total test cases:** 13 (9 High / 4 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CUR01 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-CUR02 | ปุ่ม Add แสดง | High | Smoke |
| TC-CUR03 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-CUR04 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-CUR05 | บันทึกโดยไม่กรอกชื่อต้องแสดง error | High | Validation |
| TC-CUR06 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-CUR07 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-CUR08 | ลบรายการ | High | CRUD |
| TC-CUR13 | แก้ไข: clear name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TCS-CUR09 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-CUR10 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-CUR11 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-CUR12 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-CUR01 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Currency list page to load successfully, **so that** I can manage Currency records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/currency

**Expected**

URL matches /config/currency; ปุ่ม Add และช่องค้นหา visible ภายใน 10s

---

## TC-CUR02 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Currency list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/currency

**Steps**

1. ไปที่ /config/currency

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-CUR03 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Currency search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/currency

**Steps**

1. ไปที่ /config/currency
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-CUR04 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Currency records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/currency

**Steps**

1. ไปที่ /config/currency
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-CUR05 — บันทึกโดยไม่กรอกชื่อต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Currency submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; เปิด add dialog ของ /config/currency

**Steps**

1. ไปที่ /config/currency
2. เปิด add dialog
3. กด Save โดยไม่กรอก name (และไม่เลือก ISO code)
4. ปิด dialog ด้วย Cancel

**Expected**

Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)

---

## TC-CUR06 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Currency record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record NAME ยังไม่มีอยู่ใน DB; ISO code IDR เลือกได้จาก lookup

**Steps**

1. ไปที่ /config/currency
2. เปิด add dialog
3. คลิกปุ่ม LookupCurrencyIso แล้วค้นหา 'IDR'
4. เลือกแถว IDR (จะ auto-fill symbol และ exchange_rate)
5. กรอก name = NAME
6. กด Save
7. ค้นหา NAME ใน list

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี Name = NAME ปรากฏใน list ภายใน 10s

---

## TC-CUR07 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Currency record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CUR06 ผ่านแล้ว → record NAME มีอยู่ใน DB

**Steps**

1. ไปที่ /config/currency
2. ค้นหา NAME
3. คลิกแถวเพื่อเปิด edit dialog
4. clear name แล้วกรอก NAME_UPDATED
5. กด Save
6. ค้นหา NAME_UPDATED

**Expected**

Updated/success toast ปรากฏ; แถวที่มี Name = NAME_UPDATED ปรากฏใน list

---

## TC-CUR08 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Currency record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-CUR13 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ไปที่ /config/currency
2. ค้นหา NAME_UPDATED
3. กด delete บนแถว
4. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-CUR13 — แก้ไข: clear name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Currency submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-CUR07 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ไปที่ /config/currency
2. ค้นหา NAME_UPDATED
3. คลิกแถวเพื่อเปิด edit dialog
4. clear name
5. กด Save
6. ปิด dialog ด้วย Cancel

**Expected**

Error message ปรากฏใน dialog (form block submit ด้วย client-side validation)

---

## TCS-CUR09 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Currency inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/currency; XSS dialog guard attached

**Steps**

1. เปิด list /config/currency
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload (script ไม่ถูก execute); หาก dialog ยังเปิดอยู่ก็ปิดได้ปกติ

---

## TCS-CUR10 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Currency fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/currency

**Steps**

1. เปิด list /config/currency
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-CUR11 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Currency submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/currency

**Steps**

1. เปิด list /config/currency
2. คลิก Add เพื่อเปิด dialog
3. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-CUR12 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Currency, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/currency

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/currency

**Expected**

User ถูก redirect ออกจาก /config/currency หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-04-27 · git cb607d8</sub>
