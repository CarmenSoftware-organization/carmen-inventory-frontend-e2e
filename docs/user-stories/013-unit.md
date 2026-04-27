# Unit — User Stories

_Generated from `tests/013-unit.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Unit
**Spec:** `tests/013-unit.spec.ts`
**Default role:** Purchase
**Total test cases:** 8 (5 High / 3 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-UN01 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-UN02 | ปุ่ม Add แสดง | High | Smoke |
| TC-UN03 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-UN04 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TCS-UN09 | XSS payload ในชื่อต้องไม่รัน script | High | Security |
| TCS-UN10 | SQL injection payload ในช่องค้นหาต้องไม่ crash | High | Security |
| TCS-UN11 | ค้นหาด้วย string ยาวมากต้องไม่ crash | Medium | Validation |
| TCS-UN12 | user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect | High | Authorization |

---

## TC-UN01 — หน้า list โหลดสำเร็จ

> **As a** Purchase user, **I want** the Unit list page to load successfully, **so that** I can manage Unit records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com via auth fixture (createAuthTest)

**Steps**

1. ไปที่ /config/unit

**Expected**

URL ตรงกับ /config/unit; หน้า list โหลดสำเร็จโดยไม่ error

---

## TC-UN02 — ปุ่ม Add แสดง

> **As a** Purchase user, **I want** to see the Add button on the Unit list, **so that** I can create new records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/unit

**Steps**

1. ไปที่ /config/unit

**Expected**

ปุ่ม Add visible บนหน้า list

---

## TC-UN03 — ช่องค้นหาใช้งานได้

> **As a** Purchase user, **I want** to type into the Unit search field, **so that** I can quickly locate existing records.

**Priority:** Medium · **Test Type:** Smoke

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/unit

**Steps**

1. ไปที่ /config/unit
2. พิมพ์ 'test' ในช่องค้นหา

**Expected**

ช่องค้นหา visible และรับค่า input ได้โดยไม่ error

---

## TC-UN04 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Purchase user, **I want** a clear empty-state when no Unit records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

Logged in as purchase@blueledgers.com; on /config/unit

**Steps**

1. ไปที่ /config/unit
2. ค้นหาด้วยคำที่ไม่มี (`__NOPE__<timestamp>`)

**Expected**

Empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---

## TCS-UN09 — XSS payload ในชื่อต้องไม่รัน script

> **As the** system, **I want** XSS payloads in Unit inputs to be neutralized, **so that** no script executes in users' browsers.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/unit; XSS dialog guard attached

**Steps**

1. เปิด list /config/unit
2. พิมพ์ XSS payload "<script>alert('xss-e2e')</script>" ลงในช่องค้นหา

**Expected**

ไม่มี browser alert/dialog จาก payload; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-UN10 — SQL injection payload ในช่องค้นหาต้องไม่ crash

> **As the** system, **I want** SQL-injection payloads in Unit fields to be safely handled, **so that** the database remains intact.

**Priority:** High · **Test Type:** Security

**Preconditions**

Logged in user with permission to access /config/unit

**Steps**

1. เปิด list /config/unit
2. พิมพ์ SQL injection payload "'; DROP TABLE users; --" ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-UN11 — ค้นหาด้วย string ยาวมากต้องไม่ crash

> **As a** Purchase user, **I want** the system to block invalid Unit submissions, **so that** data quality is preserved.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**

Logged in user with permission to access /config/unit

**Steps**

1. เปิด list /config/unit
2. พิมพ์ string ยาว 200 ตัวอักษร ('a' x 200) ลงในช่องค้นหา

**Expected**

หน้าไม่ crash; ปุ่ม Add ยังคง visible (list ทำงานปกติ)

---

## TCS-UN12 — user สิทธิ์ต่ำเข้าหน้านี้ต้องไม่เห็นปุ่ม Add หรือถูก redirect

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Unit, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

Test user requestor@blueledgers.com (low-privilege role) มีอยู่จริง; module list path = /config/unit

**Steps**

1. เปิด browser context ใหม่
2. login เป็น requestor@blueledgers.com
3. ไปที่ /config/unit

**Expected**

User ถูก redirect ออกจาก /config/unit หรือ ปุ่ม Add ไม่ปรากฏ (count = 0)

---


<sub>Last regenerated: 2026-04-27 · git 56daf87</sub>
