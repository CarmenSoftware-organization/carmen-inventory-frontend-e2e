# Pr Returned Flow — User Stories

_Generated from `tests/311-pr-returned-flow.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Pr Returned Flow
**Spec:** `tests/311-pr-returned-flow.spec.ts`
**Default role:** Requestor
**Total test cases:** 11 (8 High / 3 Medium / 0 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-080701 | Returned PR appears in Creator's list with RETURNED status badge | High | Smoke |
| TC-PR-080702 | Open Returned PR detail loads with status=Returned | High | Smoke |
| TC-PR-080703 | Workflow History tab shows the return reason from HOD | High | Functional |
| TC-PR-080704 | Edit button visible on Returned PR (Creator can re-edit) | High | Functional |
| TC-PR-080705 | Modify line item quantity → Save → URL stays on detail | High | CRUD |
| TC-PR-080706 | Add new line item to Returned PR → Save | Medium | CRUD |
| TC-PR-080707 | Submit confirmation dialog appears for Returned PR | High | Smoke |
| TC-PR-080708 | Confirm submit → status moves Returned → In Progress | High | CRUD |
| TC-PR-080709 | Cancel submit on Returned PR → URL stays on detail (still Returned) | Medium | Functional |
| TC-PR-080710 | Delete Returned PR is allowed for Creator | Medium | Authorization |
| TC-PR-080902 | Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress | High | Smoke |

---

## TC-PR-080701 — Returned PR appears in Creator's list with RETURNED status badge

> **As a** Requestor user, **I want** the Pr Returned Flow list page to load successfully, **so that** I can manage Pr Returned Flow records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น Requestor; มี PR ที่ถูกส่งคืนอยู่ (seeded ผ่าน submitPRAsRequestor + sendForReviewAsHOD)

**Steps**

1. เปิด PR list
2. หาแถว PR ที่ seeded
3. ตรวจสอบว่า status badge แสดง Returned (หรือเทียบเท่า)

**Expected**

แถว PR visible ใน list และ status badge ตรงกับ /returned|sent back/i สำหรับแถวนั้น

---

## TC-PR-080702 — Open Returned PR detail loads with status=Returned

> **As a** Requestor user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

มี PR ที่ถูกส่งคืนอยู่

**Steps**

1. ไปที่หน้า Returned PR detail
2. ตรวจสอบ URL
3. ตรวจสอบ status badge

**Expected**

URL คือ /procurement/purchase-request/<ref>; text ของ status badge ตรงกับ /returned|sent back/i

---

## TC-PR-080703 — Workflow History tab shows the return reason from HOD

> **As a** HOD user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

อยู่ที่หน้า Returned PR detail

**Steps**

1. คลิกแท็บ Workflow History
2. หาข้อความเหตุผลการส่งคืนจาก HOD

**Expected**

แผง Workflow History มีเหตุผลการส่งคืนที่ seeded ไว้ว่า 'Please revise — returned for review' (หรือ partial match)

---

## TC-PR-080704 — Edit button visible on Returned PR (Creator can re-edit)

> **As a** Requestor user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

อยู่ที่หน้า Returned PR detail

**Steps**

1. ตรวจสอบ action toolbar

**Expected**

ปุ่ม Edit visible (Creator สามารถเข้า Edit Mode เพื่อแก้ไขได้)

---

## TC-PR-080705 — Modify line item quantity → Save → URL stays on detail

> **As a** Requestor user, **I want** to manage Pr Returned Flow records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

หน้า Returned PR detail เปิดอยู่พร้อมอย่างน้อยหนึ่ง line item

**Steps**

1. คลิก Edit
2. แก้ไข quantity แถวแรกเป็น 7
3. คลิก Save Draft

**Expected**

หลังจากบันทึก URL ของหน้ายังคงอยู่ที่ /procurement/purchase-request/<ref>

---

## TC-PR-080706 — Add new line item to Returned PR → Save

> **As a** Requestor user, **I want** to create a new Pr Returned Flow record, **so that** it becomes available for downstream operations.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**

หน้า Returned PR detail เปิดอยู่

**Steps**

1. คลิก Edit
2. เพิ่ม line item ใหม่ (product, qty, uom, price)
3. คลิก Save Draft

**Expected**

หลังจากบันทึก URL ของหน้ายังคงอยู่ที่ /procurement/purchase-request/<ref>

---

## TC-PR-080707 — Submit confirmation dialog appears for Returned PR

> **As a** Requestor user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

หน้า Returned PR detail เปิดอยู่

**Steps**

1. คลิก Submit บน Returned PR

**Expected**

dialog ยืนยัน (resubmit) ปรากฏขึ้น visible

---

## TC-PR-080708 — Confirm submit → status moves Returned → In Progress

> **As a** Requestor user, **I want** to manage Pr Returned Flow records via CRUD, **so that** the data stays correct over time.

**Priority:** High · **Test Type:** CRUD

**Preconditions**

dialog ยืนยัน Submit เปิดอยู่บน Returned PR

**Steps**

1. คลิก Submit
2. Confirm dialog
3. รอ status badge อัปเดต

**Expected**

text ของ status badge ตรงกับ /in.progress/i หลังจาก confirm

---

## TC-PR-080709 — Cancel submit on Returned PR → URL stays on detail (still Returned)

> **As a** Requestor user, **I want** this Pr Returned Flow interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

dialog ยืนยัน Submit เปิดอยู่บน Returned PR

**Steps**

1. คลิก Submit
2. คลิก Cancel ใน dialog

**Expected**

dialog ปิด; URL ยังคงอยู่ที่หน้า PR detail

---

## TC-PR-080710 — Delete Returned PR is allowed for Creator

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Pr Returned Flow, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

หน้า Returned PR detail เปิดอยู่

**Steps**

1. ตรวจสอบการมีอยู่ของปุ่ม Delete
2. ถ้ามีอยู่ ให้คลิกและ confirm
3. ตรวจสอบ URL ของ list

**Expected**

ปุ่ม Delete visible; การ confirm ลบนำทางกลับไปที่ PR list URL ข้ามเมื่อ Delete ไม่ได้รับอนุญาตใน configuration นี้

---

## TC-PR-080902 — Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress

> **As a** HOD user, **I want** core Pr Returned Flow interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น Requestor; PR ใหม่ถูก seed ไว้ในสถานะ Returned ผ่าน submitPRAsRequestor + sendForReviewAsHOD

**Steps**

1. เปิดหน้า Returned PR detail
2. คลิกแท็บ Workflow History และตรวจสอบว่าเหตุผลถูกแสดง
3. คลิก Edit
4. แก้ไข quantity ของ line item แรก
5. Save Draft
6. คลิก Submit และ Confirm
7. รอ status แสดงเป็น In Progress

**Expected**

Status badge เปลี่ยนเป็น In Progress หลังจากการ confirm resubmit

---


<sub>Last regenerated: 2026-05-07 · git 66a0085</sub>
