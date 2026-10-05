# Purchase Order — Doc Flow (movement suite) — User Stories

_Generated from `tests/404-po-doc-flow.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Purchase Order — Doc Flow (movement suite)
**Spec:** `tests/404-po-doc-flow.spec.ts`
**Default role:** any authenticated
**Total test cases:** 5 (3 High / 2 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PO-700001 | Requestor สร้าง PO draft แล้วหลังบ้านเก็บจำนวนและราคาครบ | High | CRUD |
| TC-PO-700002 | Requestor เปิด PO draft แล้วเห็นจำนวนและราคาตามที่บันทึก | Medium | CRUD |
| TC-PO-700003 | Requestor แก้ PO draft (หัว + จำนวน/ราคา + ลบรายการ + เพิ่มรายการ) | High | CRUD |
| TC-PO-700004 | Requestor ลบ PO draft จากโหมดดูแล้วใบหายจากหลังบ้าน | Medium | CRUD |
| TC-PO-700005 | Requestor สร้าง PO แล้ว Submit ได้เลขจริงและไปขั้น HOD | High | Functional |

---

## TC-PO-700001 — Requestor สร้าง PO draft แล้วหลังบ้านเก็บจำนวนและราคาครบ

> **As a** Requestor user, **I want** to create a new Purchase Order — Doc Flow (movement suite) record, **so that** it becomes available for downstream operations.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

Login เป็น requestor@carmen.com (movement-setup); BU CARMEN-AVG; workflow "PO inherit-sig test" มีสินค้าแล้ว (bun run movement:setup-workflows) และ requestor อยู่ใน stage Create Request; ผู้ขาย C010 มีอยู่

**Steps**

1. เปิด /procurement/purchase-order/new
2. เลือก workflow "PO inherit-sig test", ผู้ขาย C010, Delivery Date 2026-10-20, ใส่คำอธิบาย
3. Add Item 2 รายการที่ LCX013: 11110001 × 3 @12.5, 11110003 × 5 @20
4. กด Save

**Expected**

Save ตอบ < 300 และ URL เปลี่ยนเป็นหน้าใบ; หลังบ้าน po_status = draft, description ตรง, รายการ 11110001×3@12.5 และ 11110003×5@20

> _Note: เดิม PO.1 (_movement_play fe/02-po) · ซ้อนกับ TC-PO-060203 ที่ตรวจแค่ URL/toast บน BLAVG · ราคากรอกด้วย typeInto (fill() ทำให้ "18.00" กลายเป็น "1821")_

---

## TC-PO-700002 — Requestor เปิด PO draft แล้วเห็นจำนวนและราคาตามที่บันทึก

> **As a** Requestor user, **I want** to manage Purchase Order — Doc Flow (movement suite) records via CRUD, **so that** the data stays correct over time.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

TC-PO-700001 ผ่านแล้วในรอบเดียวกัน (serial) — มี PO draft บน CARMEN-AVG

**Steps**

1. เปิด /procurement/purchase-order/<id> จากลิงก์ตรง
2. อ่านช่องคำอธิบาย และข้อความ/ค่าในแถวของแต่ละสินค้า

**Expected**

ช่องคำอธิบายมีค่า FE-CRUD PO <stamp>; แถว 11110001 มีจำนวน 3 และราคา 12.5; แถว 11110003 มีจำนวน 5 และราคา 20

> _Note: เดิม PO.2 · TC-PO-060301 ตรวจแค่ URL_

---

## TC-PO-700003 — Requestor แก้ PO draft (หัว + จำนวน/ราคา + ลบรายการ + เพิ่มรายการ)

> **As a** Requestor user, **I want** to delete a Purchase Order — Doc Flow (movement suite) record, **so that** the list reflects only valid entries.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

TC-PO-700001 ผ่านแล้วในรอบเดียวกัน (serial) — PO draft มี 11110001×3@12.5, 11110003×5@20

**Steps**

1. เปิดใบ แล้วกด Edit
2. แก้คำอธิบายเป็น "... (แก้)"
3. Ground Beef 3@12.5 → 7@15
4. ลบ Australian Sirloin ด้วยปุ่ม "Remove this product" ในแถวคอมเมนต์ใต้รายการ
5. Add Item: Pork neck tenderloin (11110009) 2@30
6. กด Save

**Expected**

Save ตอบ < 300; หลังบ้านเก็บคำอธิบายใหม่ และรายการเหลือ 11110001×7@15, 11110009×2@30

> _Note: เดิม PO.3 · TC-PO-060402/060403 หาช่องจำนวนจาก label (ถ้าไม่เจอก็ผ่านเงียบ) และตรวจแค่ URL_

---

## TC-PO-700004 — Requestor ลบ PO draft จากโหมดดูแล้วใบหายจากหลังบ้าน

> **As a** Requestor user, **I want** to delete a Purchase Order — Doc Flow (movement suite) record, **so that** the list reflects only valid entries.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

TC-PO-700001 ผ่านแล้วในรอบเดียวกัน (serial) — PO draft ยังอยู่

**Steps**

1. เปิดใบ (โหมดดู)
2. กด Delete
3. ยืนยัน Delete ใน dialog

**Expected**

GET ใบนั้นไม่พบแล้ว และหน้าจอออกจาก URL ของใบกลับไปหน้ารายการ

> _Note: เดิม PO.4 · main ไม่มีเคสลบ PO draft (TC-PO-060406 ลบใบ In Progress และ skip ทุกรอบ) · ยืนยันว่า Delete ของ PO draft อยู่ในโหมดดู_

---

## TC-PO-700005 — Requestor สร้าง PO แล้ว Submit ได้เลขจริงและไปขั้น HOD

> **As a** Requestor user, **I want** this Purchase Order — Doc Flow (movement suite) interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

Login เป็น requestor@carmen.com; BU CARMEN-AVG; workflow "PO inherit-sig test" ขั้นแรกคือ HOD

**Steps**

1. สร้าง PO ใหม่ 1 รายการ 11110012 × 4 @10 แล้วกด Save
2. กด Submit ที่หน้าใบ
3. ยืนยันใน dialog (ถ้ามี)

**Expected**

คำขอ submit ตอบ < 300; หลังบ้าน po_status = in_progress, po_no ไม่ขึ้นต้นด้วย draft และ workflow_current_stage = HOD

> _Note: เดิม PO.5 · TC-PO-060405/060901 ตรวจแค่ URL_

---


<sub>Last regenerated: 2026-10-05 · git 246df31</sub>
