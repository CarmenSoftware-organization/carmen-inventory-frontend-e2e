# Price List Template — User Stories

_Generated from `tests/160-pl-template.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Price List Template
**Spec:** `tests/160-pl-template.spec.ts`
**Default role:** Admin
**Total test cases:** 33 (17 High / 16 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PT-010001 | Create Pricelist Template - Happy Path | High | Happy Path |
| TC-PT-010002 | Create Pricelist Template - Empty Template Name | High | Negative |
| TC-PT-010004 | Create Pricelist Template - No Permission | High | Negative |
| TC-PT-010005 | Create Pricelist Template - Missing Description | High | Negative |
| TC-PT-010050 | active BU = BLAVG | High | Smoke |
| TC-PT-010051 | สร้าง pricelist template (admin/BLAVG) สำเร็จ | High | CRUD |
| TC-PT-020001 _(skipped)_ | Add products to template - Happy Path | Medium | Happy Path |
| TC-PT-020002 _(skipped)_ | Add products to template - Invalid Input (max exceeded) | Medium | Negative |
| TC-PT-020003 _(skipped)_ | Add products to template - No Permission | Medium | Negative |
| TC-PT-020004 _(skipped)_ | Add products to template - Edge Case - Empty Selection | Medium | Edge Case |
| TC-PT-030001 | Edit template with valid data | High | Happy Path |
| TC-PT-030002 | Edit template with invalid validity period | High | Negative |
| TC-PT-030003 | Edit template without product selection | High | Negative |
| TC-PT-030004 | Edit template with minimal changes | High | Happy Path |
| TC-PT-030005 | Edit template with all fields in default state | High | Edge Case |
| TC-PT-040001 _(skipped)_ | Happy Path - Clone Existing Template | Medium | Happy Path |
| TC-PT-040002 _(skipped)_ | Negative - Invalid Template Name | Medium | Negative |
| TC-PT-040003 _(skipped)_ | Negative - No Permission to Clone | Medium | Negative |
| TC-PT-040004 _(skipped)_ | Edge Case - Maximum Templates Reached | Medium | Edge Case |
| TC-PT-040050 | แก้ชื่อ template แล้ว persist | High | CRUD |
| TC-PT-040051 | แก้ชื่อแล้วกด Cancel — ค่าเดิมคงอยู่ | Medium | CRUD |
| TC-PT-050001 _(skipped)_ | Activate Template - Happy Path | Medium | Happy Path |
| TC-PT-050003 _(skipped)_ | Activate Template - Invalid Input | Medium | Negative |
| TC-PT-050004 _(skipped)_ | Deactivate Template - No Permission | Medium | Negative |
| TC-PT-050005 _(skipped)_ | Template Status Change - Edge Case (rapid toggle) | Medium | Edge Case |
| TC-PT-050050 | เปิด delete dialog แล้ว Cancel — template ยังอยู่ | Medium | CRUD |
| TC-PT-050051 | ลบ template (admin/BLAVG) cleanup | High | CRUD |
| TC-PT-060001 | Search and View Templates - Happy Path | High | Happy Path |
| TC-PT-060002 | Search and View Templates - Negative - Invalid Search Term | High | Negative |
| TC-PT-060003 | Search and View Templates - Negative - Insufficient Permission | High | Negative |
| TC-PT-060004 | Search and View Templates - Edge Case - Filter by Product Count | Medium | Edge Case |
| TC-PT-060005 | Search and View Templates - Edge Case - Sort by Name (Z-A) | Medium | Edge Case |
| TC-PT-200050 | สร้าง template ชื่อซ้ำ ต้องถูก reject | High | Negative |

---

## TC-PT-010001 — Create Pricelist Template - Happy Path

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์เข้าถึง Pricelist Templates

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก 'New Pricelist Template'
3. กรอก 'Template Name' ด้วย 'Office Supplies'
4. กรอก 'Description' ด้วย 'Office supplies pricelist for 2023'
5. คลิก 'Save'

**Expected**

Pricelist template สร้างสำเร็จ

---

## TC-PT-010002 — Create Pricelist Template - Empty Template Name

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์เข้าถึง Pricelist Templates

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก 'New Pricelist Template'
3. กรอก 'Description' ด้วย 'Office supplies pricelist for 2023'
4. คลิก 'Save'

**Expected**

แสดงข้อความ error สำหรับชื่อ template ว่างเปล่า

---

## TC-PT-010004 — Create Pricelist Template - No Permission

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Staff และมีสิทธิ์เข้าถึงเฉพาะหน้า list ของ Pricelist Templates

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก 'New Pricelist Template'

**Expected**

ผู้ใช้ถูก redirect ไปยังหน้าไม่มีสิทธิ์เข้าถึงหรือปุ่ม 'New Pricelist Template' ถูกซ่อน/disabled

---

## TC-PT-010005 — Create Pricelist Template - Missing Description

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์เข้าถึง Pricelist Templates

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก 'New Pricelist Template'
3. กรอก 'Template Name' ด้วย 'Office Supplies'
4. คลิก 'Save'

**Expected**

แสดงข้อความ error สำหรับ description ที่ขาดหายไป

---

## TC-PT-010050 — active BU = BLAVG

> **As a** Admin user, **I want** core Price List Template interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว

**Steps**

1. อ่าน profile API (/api/proxy/api/user/profile)
2. หา business unit ที่ is_default
3. เปิดหน้าที่มี navbar แล้วอ่าน label ของ BU switcher

**Expected**

default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น

---

## TC-PT-010051 — สร้าง pricelist template (admin/BLAVG) สำเร็จ

> **As a** Admin user, **I want** to create a new Price List Template record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Login เป็น admin@blueledgers.com; active BU = BLAVG; template ชื่อ ADMIN_NAME ยังไม่มีใน DB; มี currency อย่างน้อย 1 รายการ

**Steps**

1. เปิดหน้า /new
2. กรอกชื่อ (hero NameField) = ADMIN_NAME
3. เลือก Currency (required)
4. กด 'Save'
5. ตรวจสอบ success toast

**Expected**

success toast ปรากฏ (template ถูกสร้าง) — ใช้เป็น seed ของ serial chain

---

## TC-PT-020001 — Add products to template - Happy Path _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: old 'Add Products' dialog (checkbox picker + Confirm Selection) removed; products are managed inline in the template form's product table now. Skipped pending a rewrite against the inline flow._

---

## TC-PT-020002 — Add products to template - Invalid Input (max exceeded) _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: old 'Add Products' dialog (checkbox picker + Confirm Selection) removed; products are managed inline in the template form's product table now. Skipped pending a rewrite against the inline flow._

---

## TC-PT-020003 — Add products to template - No Permission _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: old 'Add Products' dialog (checkbox picker + Confirm Selection) removed; products are managed inline in the template form's product table now. Skipped pending a rewrite against the inline flow._

---

## TC-PT-020004 — Add products to template - Edge Case - Empty Selection _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: old 'Add Products' dialog (checkbox picker + Confirm Selection) removed; products are managed inline in the template form's product table now. Skipped pending a rewrite against the inline flow._

---

## TC-PT-030001 — Edit template with valid data

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์แก้ไข template

**Steps**

1. ไปที่ /vendor-management/price-list-template/[id]
2. คลิก 'Edit'
3. กรอกชื่อ template
4. กรอก description
5. เลือก currency
6. กรอก validity period
7. กรอก vendor instructions
8. สลับ switch allow multi-MOQ
9. สลับ switch require lead time
10. กรอก max items per submission
11. สลับ switch send reminders
12. เลือก 14 และ 7 วันใน reminder checkboxes
13. กรอก escalation days
14. คลิก 'Save Changes'

**Expected**

template บันทึกสำเร็จ doc_version เพิ่มขึ้น แสดงข้อความสำเร็จ และบันทึกการเปลี่ยนแปลงใน audit trail

---

## TC-PT-030002 — Edit template with invalid validity period

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์แก้ไข template

**Steps**

1. ไปที่ /vendor-management/price-list-template/[id]
2. คลิก 'Edit'
3. กรอก validity period เป็น 0 วัน
4. คลิก 'Save Changes'

**Expected**

ระบบแสดงข้อความ error สำหรับ validity period ที่ไม่ถูกต้องและ template ไม่ถูกบันทึก

---

## TC-PT-030003 — Edit template without product selection

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Procurement Manager มีสิทธิ์แก้ไข template และไม่มี product เชื่อมโยงกับ template

**Steps**

1. ไปที่ /vendor-management/price-list-template/[id]
2. คลิก 'Edit'
3. คลิก 'Save Changes'

**Expected**

ระบบแสดงข้อความ error แจ้งว่าต้องมี product selection อย่างน้อย 1 รายการและ template ไม่ถูกบันทึก

---

## TC-PT-030004 — Edit template with minimal changes

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager และมีสิทธิ์แก้ไข template

**Steps**

1. ไปที่ /vendor-management/price-list-template/[id]
2. คลิก 'Edit'
3. เปลี่ยน validity period เป็น 1 วัน
4. คลิก 'Save Changes'

**Expected**

template บันทึกสำเร็จ doc_version เพิ่มขึ้น และบันทึกการเปลี่ยนแปลงใน audit trail

---

## TC-PT-030005 — Edit template with all fields in default state

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Procurement Manager มีสิทธิ์แก้ไข template; template อยู่ในสถานะ default โดยไม่มีการเปลี่ยนแปลง

**Steps**

1. ไปที่ /vendor-management/price-list-template/[id]
2. คลิก 'Edit'
3. คลิก 'Save Changes'

**Expected**

template ไม่มีการเปลี่ยนแปลง doc_version คงเดิม และไม่มีการบันทึกการเปลี่ยนแปลงใน audit trail

---

## TC-PT-040001 — Happy Path - Clone Existing Template _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: the Clone/Duplicate Template action no longer exists in the redesigned UI (the Copy glyph in the detail toolbar is a decorative entity badge). Skipped pending product decision._

---

## TC-PT-040002 — Negative - Invalid Template Name _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: the Clone/Duplicate Template action no longer exists in the redesigned UI (the Copy glyph in the detail toolbar is a decorative entity badge). Skipped pending product decision._

---

## TC-PT-040003 — Negative - No Permission to Clone _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: the Clone/Duplicate Template action no longer exists in the redesigned UI (the Copy glyph in the detail toolbar is a decorative entity badge). Skipped pending product decision._

---

## TC-PT-040004 — Edge Case - Maximum Templates Reached _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: the Clone/Duplicate Template action no longer exists in the redesigned UI (the Copy glyph in the detail toolbar is a decorative entity badge). Skipped pending product decision._

---

## TC-PT-040050 — แก้ชื่อ template แล้ว persist

> **As a** Admin user, **I want** to manage Price List Template records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-PT-010051 ผ่านแล้ว → template ADMIN_NAME มีอยู่; login admin@blueledgers.com; active BU = BLAVG

**Steps**

1. ไป list แล้วเปิด template ADMIN_NAME
2. กด 'Edit'
3. แก้ชื่อเป็น ADMIN_NAME_UPDATED
4. กด 'Save'
5. กลับ list ค้นหา ADMIN_NAME_UPDATED

**Expected**

success toast ปรากฏ และ ADMIN_NAME_UPDATED ค้นเจอใน list ภายใน 10s (ค่าถูก persist)

---

## TC-PT-040051 — แก้ชื่อแล้วกด Cancel — ค่าเดิมคงอยู่

> **As a** Admin user, **I want** to manage Price List Template records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

TC-PT-040050 ผ่านแล้ว → template ADMIN_NAME_UPDATED มีอยู่; login admin@blueledgers.com; active BU = BLAVG

**Steps**

1. ไป list เปิด template ADMIN_NAME_UPDATED
2. กด 'Edit'
3. แก้ชื่อเป็นค่าทิ้ง
4. กด 'Cancel'
5. กลับ list ค้นหา ADMIN_NAME_UPDATED

**Expected**

ชื่อ template ยังเป็น ADMIN_NAME_UPDATED (การแก้ที่ยกเลิกไม่ถูกบันทึก)

---

## TC-PT-050001 — Activate Template - Happy Path _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: dedicated Activate/Deactivate buttons removed; template status is now a field on the edit form. Skipped pending a rewrite against status-via-form._

---

## TC-PT-050003 — Activate Template - Invalid Input _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: dedicated Activate/Deactivate buttons removed; template status is now a field on the edit form. Skipped pending a rewrite against status-via-form._

---

## TC-PT-050004 — Deactivate Template - No Permission _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: dedicated Activate/Deactivate buttons removed; template status is now a field on the edit form. Skipped pending a rewrite against status-via-form._

---

## TC-PT-050005 — Template Status Change - Edge Case (rapid toggle) _(skipped)_

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น Procurement Manager/Staff; มี template ในระบบ

**Steps**

(feature removed in redesign — see note)

**Expected**

ครอบคลุมโดยการ rewrite ในอนาคต (feature ถูก redesign)

> _Note: REDESIGNED AWAY: dedicated Activate/Deactivate buttons removed; template status is now a field on the edit form. Skipped pending a rewrite against status-via-form._

---

## TC-PT-050050 — เปิด delete dialog แล้ว Cancel — template ยังอยู่

> **As a** Admin user, **I want** to delete a Price List Template record, **so that** the list reflects only valid entries.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

TC-PT-200050 ผ่านแล้ว → template ADMIN_NAME_UPDATED ยังอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG

**Steps**

1. ไป list ค้นหา ADMIN_NAME_UPDATED
2. เปิด row actions
3. กด 'Delete'
4. ใน dialog กด 'Cancel'
5. ตรวจสอบว่า template ยังอยู่

**Expected**

template ADMIN_NAME_UPDATED ยังคงอยู่ใน list (ไม่ถูกลบ)

---

## TC-PT-050051 — ลบ template (admin/BLAVG) cleanup

> **As a** Admin user, **I want** to delete a Price List Template record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-PT-050050 ผ่านแล้ว → template ADMIN_NAME_UPDATED ยังอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG

**Steps**

1. ไป list ค้นหา ADMIN_NAME_UPDATED
2. เปิด row actions
3. กด 'Delete'
4. ใน dialog ยืนยัน Delete
5. ตรวจสอบ success toast

**Expected**

success toast ('deleted/success/สำเร็จ') ปรากฏภายใน 10s (template ถูกลบ — ปิดท้าย serial chain)

---

## TC-PT-060001 — Search and View Templates - Happy Path

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เข้า Carmen Inventory พร้อมสิทธิ์ดู template

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก status tab 'All'
3. กรอก 'example' ในช่องค้นหา
4. คลิก 'Search'
5. คลิก template card

**Expected**

ระบบแสดงหน้า detail ของ template พร้อมข้อมูล template ที่เกี่ยวข้อง

---

## TC-PT-060002 — Search and View Templates - Negative - Invalid Search Term

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เข้า Carmen Inventory พร้อมสิทธิ์ดู template

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. กรอก 'nonexistent' ในช่องค้นหา
3. คลิก 'Search'

**Expected**

ระบบแสดงข้อความแจ้งว่าไม่พบ template ที่ตรงกัน

---

## TC-PT-060003 — Search and View Templates - Negative - Insufficient Permission

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เข้า Carmen Inventory แต่ไม่มีสิทธิ์ดู template

**Steps**

1. ไปที่ /vendor-management/price-list-template

**Expected**

ระบบ redirect ผู้ใช้ไปยังหน้าไม่มีสิทธิ์เข้าถึงหรือแสดงข้อความปฏิเสธสิทธิ์

---

## TC-PT-060004 — Search and View Templates - Edge Case - Filter by Product Count

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เข้า Carmen Inventory พร้อมสิทธิ์ดู template

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก status tab 'All'
3. คลิก 'Filter by Product Count'
4. กรอก '0' ในช่องจำนวนต่ำสุด
5. กรอก '10' ในช่องจำนวนสูงสุด
6. คลิก 'Apply Filter'

**Expected**

ระบบแสดง list ของ template ที่กรองแล้วโดยมีจำนวน product อยู่ในช่วงที่ระบุ

---

## TC-PT-060005 — Search and View Templates - Edge Case - Sort by Name (Z-A)

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เข้า Carmen Inventory พร้อมสิทธิ์ดู template

**Steps**

1. ไปที่ /vendor-management/price-list-template
2. คลิก status tab 'All'
3. คลิก header คอลัมน์ 'Name'
4. คลิกตัวเลือกเรียงลำดับ 'Z-A'

**Expected**

ระบบเรียงลำดับ list ของ template ตามตัวอักษรจาก Z-A ตามชื่อ template

---

## TC-PT-200050 — สร้าง template ชื่อซ้ำ ต้องถูก reject

> **As a** Admin user, **I want** this Price List Template behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

TC-PT-040050 ผ่านแล้ว → template ADMIN_NAME_UPDATED มีอยู่ใน DB; login admin@blueledgers.com; active BU = BLAVG

**Steps**

1. เปิดหน้า /new
2. กรอกชื่อ = ADMIN_NAME_UPDATED (ซ้ำ) + เลือก currency
3. กด 'Save'

**Expected**

รายการที่สองไม่ถูกสร้าง: มี error toast (backend reject duplicate name) — ไม่มี success toast

---


<sub>Last regenerated: 2026-06-17 · git 8810550</sub>
