# Recipe Equipment Category — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/121-recipe-equipment-category.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/121-recipe-equipment-category.md`_

**Module:** Recipe Equipment Category
**Frontend route:** `routes/operation-plan/recipe-equipment-category`  •  **URL:** `/operation-plan/recipe-equipment-category`
**Prefix:** `RECC`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/121-recipe-equipment-category.spec.ts`
**Total test cases:** 3

> หมายเหตุสำคัญสำหรับผู้รีวิว: ไฟล์นี้แปลงมาจาก `docs/test-cases/121-recipe-equipment-category.md` เมื่อ 2026-09-20 แคตตาล็อกเดิมถือ TC-ID ชุดเดียวกับสเปกที่มีอยู่แล้ว ทำให้เอกสารสองชุดเป็นเจ้าของเลขเดียวกัน (audit ฟ้องเป็น CROSS_FILE_DUPLICATE) จึงเก็บไว้เฉพาะเคสที่สเปกยังไม่ครอบ เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RECC-020001 | เปิด dialog แก้ไขจาก list | Medium | Happy Path |
| TC-RECC-030002 | ยกเลิกการสร้างใน dialog | Medium | Alternate Flow |
| TC-RECC-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้ | High | Authorization |

---

## TC-RECC-020001 — เปิด dialog แก้ไขจาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ Name ของหมวดหมู่ในตาราง
**Expected**
เปิด Dialog แก้ไขที่กรอกค่า Name, Description และ status switch ของรายการนั้นไว้ล่วงหน้า

---

## TC-RECC-030002 — ยกเลิกการสร้างใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog สร้างหมวดหมู่ใหม่
**Steps**
1. กรอก Name บางส่วน
2. คลิก Cancel
**Expected**
dialog ปิดโดยไม่บันทึก และไม่มีรายการใหม่ในตาราง

---

## TC-RECC-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้านี้
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูหมวดหมู่อุปกรณ์สูตรอาหาร
**Steps**
1. ไปที่ `/operation-plan/recipe-equipment-category`
**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูล
