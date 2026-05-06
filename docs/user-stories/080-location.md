# Location — User Stories

_Generated from `tests/080-location.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Location
**Spec:** `tests/080-location.spec.ts`
**Default role:** Purchase
**Total test cases:** 15 (9 High / 6 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-LOC00101 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-LOC00102 | ปุ่ม Add แสดง | High | Smoke |
| TC-LOC00103 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-LOC00104 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-LOC00105 | บันทึกโดยไม่กรอก code/name ต้องแสดง error | High | Validation |
| TC-LOC00106 | สร้างรายการใหม่และปรากฏในตาราง | High | CRUD |
| TC-LOC00107 | แก้ไขชื่อและบันทึก | High | CRUD |
| TC-LOC00108 | ลบรายการ | High | CRUD |
| TC-LOC00113 | แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error | Medium | Validation |
| TC-LOC00114 | สร้าง location_type = Direct และลบ | Medium | CRUD |
| TC-LOC00115 | สร้าง location_type = Consignment และลบ | Medium | CRUD |
| TCS-LOC00109 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-LOC00110 | SQL injection payload ต้องไม่ทำให้ระบบ crash | High | Security |
| TCS-LOC00111 | ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100 | Medium | Validation |
| TCS-LOC00112 _(skipped)_ | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-LOC00101 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Location list page to load successfully, **so that** I can manage Location records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture

**Steps**

1. ไปที่ /config/location

**Expected**

URL matches /config/location; หน้า list render สำเร็จโดยไม่มี error

---

## TC-LOC00102 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Location list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/location

**Steps**

1. ไปที่ /config/location

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-LOC00103 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Location search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/location

**Steps**

1. ไปที่ /config/location
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-LOC00104 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Location records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/location

**Steps**

1. ไปที่ /config/location
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<UID>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TC-LOC00105 — บันทึกโดยไม่กรอก code/name ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Location submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/location/new

**Steps**

1. เปิดฟอร์ม new
2. กด Save โดยไม่กรอก code/name

**Expected**

URL ยังคงอยู่ที่ /new (ฟอร์ม block submit ด้วย client-side validation)

---

## TC-LOC00106 — สร้างรายการใหม่และปรากฏในตาราง

> **As a** Purchase user, **I want** to create a new Location record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE/NAME ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code + name
3. เลือก Location Type = Inventory
4. เลือก Physical Count = Yes
5. เปิด dialog Select Delivery Point และเลือกตัวเลือกแรก
6. กด Save
7. กลับ list และค้นหาด้วย NAME

**Expected**

Success toast (created/success/สำเร็จ); แถวใหม่ที่มี NAME ปรากฏใน list

---

## TC-LOC00107 — แก้ไขชื่อและบันทึก

> **As a** Purchase user, **I want** to edit an existing Location record, **so that** its data stays accurate.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-LOC00106 ผ่านแล้ว → record CODE/NAME มีอยู่ใน DB

**Steps**

1. ค้นหา NAME ใน list
2. คลิกแถวเพื่อเปิด detail
3. กด Edit
4. clear name แล้วใส่ NAME_UPDATED
5. กด Save

**Expected**

Updated/success toast ปรากฏ (updated/success/สำเร็จ)

---

## TC-LOC00108 — ลบรายการ

> **As a** Purchase user, **I want** to delete a Location record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-LOC00113 ผ่านแล้ว → record NAME_UPDATED ยังคงมีอยู่ใน DB

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด detail
3. กด Edit
4. กด Delete
5. ยืนยัน Delete

**Expected**

Deleted/success toast ปรากฏ (deleted/success/สำเร็จ)

---

## TC-LOC00113 — แก้ไข: clear code/name แล้วบันทึก ต้องแสดง error

> **As a** Purchase user, **I want** the system to block invalid Location submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

TC-LOC00107 ผ่านแล้ว → record มี name = NAME_UPDATED

**Steps**

1. ค้นหา NAME_UPDATED ใน list
2. เปิด detail
3. กด Edit
4. clear code + name
5. กด Save

**Expected**

Save button ยังคง visible (form ไม่ submit; ยังอยู่ใน edit mode)

---

## TC-LOC00114 — สร้าง location_type = Direct และลบ

> **As a** Purchase user, **I want** to create a new Location record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE_DIRECT/NAME_DIRECT ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code_direct + name_direct
3. เลือก Location Type = Direct
4. เลือก Physical Count = Yes
5. เลือก Delivery Point
6. กด Save
7. กลับ list ค้นหา NAME_DIRECT
8. เปิด detail → Edit → Delete → ยืนยัน

**Expected**

Created toast → แถวปรากฏใน list → Deleted toast หลังลบ (วงจร CRUD ครบสำหรับ type Direct)

---

## TC-LOC00115 — สร้าง location_type = Consignment และลบ

> **As a** Purchase user, **I want** to create a new Location record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

Logged in as purchase@blueledgers.com; record CODE_CONSIGN/NAME_CONSIGN ยังไม่มีอยู่ใน DB

**Steps**

1. เปิด new form
2. กรอก code_consign + name_consign
3. เลือก Location Type = Consignment
4. เลือก Physical Count = Yes
5. เลือก Delivery Point
6. กด Save
7. กลับ list ค้นหา NAME_CONSIGN
8. เปิด detail → Edit → Delete → ยืนยัน

**Expected**

Created toast → แถวปรากฏใน list → Deleted toast หลังลบ (วงจร CRUD ครบสำหรับ type Consignment)

---

## TCS-LOC00109 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Location inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/location; XSS dialog guard attached

**Steps**

1. เปิด new form ของ /config/location
2. กรอก code ด้วย random suffix
3. กรอก name ด้วย XSS payload "<script>alert('xss-e2e')</script>"
4. กด Save

**Expected**

ไม่มี browser alert/dialog จาก payload; URL ยังคงอยู่ภายใต้ /config/ (ฟอร์มอาจ reject หรือ save แบบ escaped)

---

## TCS-LOC00110 — SQL injection payload ต้องไม่ทำให้ระบบ crash

> **As the** system, **I want** SQL-injection payloads in Location fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/location

**Steps**

1. เปิด list /config/location
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-LOC00111 — ชื่อยาวเกิน maxLength ต้องถูกจำกัดที่ 100

> **As a** Purchase user, **I want** the system to block invalid Location submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/location

**Steps**

1. เปิด new form ของ /config/location
2. กรอก name ด้วย string ยาว 200 ตัวอักษร ('a' x 200)

**Expected**

ค่าใน input ถูก clamp ที่ ≤ 100 ตัวอักษร (maxLength enforced)

---

## TCS-LOC00112 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect _(skipped)_

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Location, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/location

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/location

**Expected**

User ถูก redirect ออกจาก /config/location หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-05-06 · git 650ea0b</sub>
