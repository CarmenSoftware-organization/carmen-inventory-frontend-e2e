# Signature Config — User Stories

_Authored from the test-case catalog `docs/test-cases/1113-signature-config.md` (documentation only — no automated spec yet)._

**Module:** Signature Config
**Frontend route:** `routes/system-admin/_components/signature-config.tsx` (reusable component embedded in `/system-admin` document-config screens, e.g. PR/PO/SR/GRN/CN/Adjustment)  •  **URL:** `/system-admin`
**Prefix:** `SIGN`
**Default role:** Platform Admin
**Total test cases:** 15

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SIGN-020001 | ฟอร์ม Signature Config โหลดและแสดงครบ | High | Smoke |
| TC-SIGN-020002 | โหลดค่า config เดิม (orientation + signatures) เข้าฟอร์ม | Medium | Functional |
| TC-SIGN-020003 | เลือก Orientation (Portrait/Landscape) ได้ | Medium | Functional |
| TC-SIGN-020004 | Report Preview สะท้อน label/name แบบ real-time | Medium | Functional |
| TC-SIGN-040001 | กรอก label และบันทึก signature config สำเร็จ | High | CRUD |
| TC-SIGN-040002 | เพิ่ม signature ด้วยปุ่ม Add | Medium | Functional |
| TC-SIGN-040003 | ลบ signature ด้วยปุ่มถังขยะ | Medium | Functional |
| TC-SIGN-040004 | ลากจัดลำดับ signature (DnD) ได้ | Medium | Functional |
| TC-SIGN-040005 | เลือก signer จาก LookupCombobox (เมื่อมี doc workflow) | Medium | Functional |
| TC-SIGN-300001 | Import Stages จาก workflow เติม signatures | High | Functional |
| TC-SIGN-300002 | append stage ทีละอันจาก workflow ได้ | Medium | Functional |
| TC-SIGN-200001 | บันทึกโดย label ว่างต้องแสดง error | High | Validation |
| TC-SIGN-200002 | จำกัดจำนวน signature สูงสุด 5 (ปุ่ม Add disabled) | Medium | Validation |
| TC-SIGN-200003 | ต้องมี signature อย่างน้อย 1 (ปุ่มลบ disabled เมื่อเหลือ 1) | Medium | Validation |
| TC-SIGN-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-SIGN-020001 — ฟอร์ม Signature Config โหลดและแสดงครบ
> **As a** Platform Admin, **I want** the Signature Config form to load fully, **so that** I can set up print signatures for a document.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin; เปิดหน้า document-config ที่ฝัง SignatureConfig
**Steps**
1. เปิดหน้าตั้งค่าเอกสารที่มี Signature Config
2. รอ loading หาย
**Expected**
แสดง title/description, การ์ด Print Settings (Orientation), การ์ด Signatures (มี Add, รายการการ์ดลายเซ็น), Report Preview และปุ่ม Save

---
## TC-SIGN-020002 — โหลดค่า config เดิม (orientation + signatures) เข้าฟอร์ม
> **As a** Platform Admin, **I want** existing signature config prefilled, **so that** I can edit current settings instead of rebuilding them.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี print config และ signature config บันทึกไว้แล้วสำหรับเอกสารนั้น
**Steps**
1. เปิดหน้าตั้งค่า Signature Config
**Expected**
Orientation และรายการ signatures (label/name/position) ถูก prefill จาก config เดิม; ถ้า backend คืน signatures ว่างจะ fallback เป็น defaultSignatures

---
## TC-SIGN-020003 — เลือก Orientation (Portrait/Landscape) ได้
> **As a** Platform Admin, **I want** to choose the print orientation, **so that** the report layout matches the document.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์ม Signature Config
**Steps**
1. เปิด Select Orientation
2. เลือก Landscape
**Expected**
trigger แสดง Landscape; ค่า orientation ใน form อัปเดต

---
## TC-SIGN-020004 — Report Preview สะท้อน label/name แบบ real-time
> **As a** Platform Admin, **I want** a live report preview, **so that** I can see how the signature block will print as I type.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์ม Signature Config; มีการ์ด signature อย่างน้อย 1 ใบ
**Steps**
1. พิมพ์ Label และ Name ในการ์ด signature
2. ดู Report Preview ด้านล่าง
**Expected**
Report Preview แสดงคอลัมน์ตามจำนวน signature และ label/name อัปเดตทันทีตามที่พิมพ์ (— เมื่อ label ว่าง)

---
## TC-SIGN-040001 — กรอก label และบันทึก signature config สำเร็จ
> **As a** Platform Admin, **I want** to save the signature config, **so that** printed documents carry the right signature block.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ในฟอร์ม Signature Config
**Steps**
1. กรอก Label ให้ทุกการ์ด signature
2. เลือก Orientation
3. กด Save
**Expected**
success toast "<docLabel> config saved"; ระบบ upsert ทั้ง print config (orientation) และ signature config (signatures) โดย renumber position = index+1

---
## TC-SIGN-040002 — เพิ่ม signature ด้วยปุ่ม Add
> **As a** Platform Admin, **I want** to add a signature slot, **so that** I can include more signatories.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์ม Signature Config; มี signature น้อยกว่า 5
**Steps**
1. กดปุ่ม Add ในการ์ด Signatures
**Expected**
การ์ด signature ใหม่ (ว่าง) ถูกเพิ่มต่อท้าย; จำนวนการ์ดเพิ่มขึ้น 1 และ Report Preview เพิ่มคอลัมน์

---
## TC-SIGN-040003 — ลบ signature ด้วยปุ่มถังขยะ
> **As a** Platform Admin, **I want** to remove a signature slot, **so that** I can drop signatories I don't need.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์ม Signature Config; มี signature ตั้งแต่ 2 ใบขึ้นไป
**Steps**
1. กดปุ่มถังขยะบนการ์ด signature หนึ่งใบ
**Expected**
การ์ดนั้นถูกลบ จำนวนลดลง 1 และ Report Preview ลดคอลัมน์ตาม

---
## TC-SIGN-040004 — ลากจัดลำดับ signature (DnD) ได้
> **As a** Platform Admin, **I want** to reorder signatures by drag, **so that** the signature columns print in the right order.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์ม Signature Config; มี signature ตั้งแต่ 2 ใบขึ้นไป
**Steps**
1. ลากการ์ด signature ใบที่ 1 ด้วย handle (GripVertical) ไปวางหลังใบที่ 2
**Expected**
ลำดับการ์ดสลับตามที่ลาก; ลำดับ #N และ Report Preview อัปเดต (position จะถูก renumber ตอน Save)

---
## TC-SIGN-040005 — เลือก signer จาก LookupCombobox (เมื่อมี doc workflow)
> **As a** Platform Admin, **I want** to pick a signer from the approver lookup, **so that** the signature is tied to a real user.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มของ document ที่มี doc workflow (signatureConfigKey ลงท้าย `_signature_config` กับ doc type ที่รองรับ); มี signature candidates
**Steps**
1. ในการ์ด signature เปิด Name (LookupCombobox)
2. เลือก signer จากรายชื่อ
**Expected**
ช่อง Name ถูกตั้ง user_id และ full name ของ signer ที่เลือก; ถ้าไม่มี candidate จะ disabled พร้อมข้อความ "No eligible approver"

---
## TC-SIGN-300001 — Import Stages จาก workflow เติม signatures
> **As a** Platform Admin, **I want** to import workflow stages as signatures, **so that** I don't have to retype approval stages by hand.

**Priority:** High · **Test Type:** Functional
**Preconditions**
component ถูกใช้พร้อม workflowType และมี workflow ที่มี stages
**Steps**
1. ในการ์ด Import from Workflow เลือก workflow
2. กด Import Stages
**Expected**
signatures ถูกแทนที่ด้วย approval stages (กรอง view_only ออก, สูงสุด 5): stage name เป็น label และ assigned user คนแรกเป็น name/user_id

---
## TC-SIGN-300002 — append stage ทีละอันจาก workflow ได้
> **As a** Platform Admin, **I want** to append a single workflow stage, **so that** I can build the signature block stage by stage.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เลือก workflow ที่มี stages แล้ว; signatures ยังน้อยกว่า 5
**Steps**
1. คลิกปุ่ม stage chip รายการหนึ่ง (เช่น "+ Approve")
**Expected**
signature ใหม่ถูก append จาก stage นั้น (label = stage name, name = user คนแรก); เมื่อครบ 5 ปุ่ม chip ถูก disable

---
## TC-SIGN-200001 — บันทึกโดย label ว่างต้องแสดง error
> **As a** Platform Admin, **I want** a label required on every signature, **so that** no blank signature columns print.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์ม Signature Config; มีการ์ดที่ label ว่าง
**Steps**
1. เว้น Label ของการ์ดหนึ่งใบ
2. กด Save
**Expected**
FieldError "Label is required" แสดงบนการ์ดนั้น, error toast แสดง path:message แรก, scroll ไปฟิลด์ที่ผิด และไม่บันทึก

---
## TC-SIGN-200002 — จำกัดจำนวน signature สูงสุด 5 (ปุ่ม Add disabled)
> **As a** Platform Admin, **I want** signatures capped at 5, **so that** the printed block stays within layout limits.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์ม Signature Config; มี signature ครบ 5 ใบ
**Steps**
1. ดูปุ่ม Add และ stage chips
**Expected**
ปุ่ม Add ถูก disabled เมื่อ fields.length >= 5; stage chips ก็ถูก disable (schema max 5)

---
## TC-SIGN-200003 — ต้องมี signature อย่างน้อย 1 (ปุ่มลบ disabled เมื่อเหลือ 1)
> **As a** Platform Admin, **I want** at least one signature enforced, **so that** the block is never empty.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์ม Signature Config; เหลือ signature 1 ใบ
**Steps**
1. ดูปุ่มถังขยะบนการ์ดสุดท้าย
**Expected**
ปุ่มลบถูก disabled เมื่อ fields.length <= 1 (schema min 1); ไม่สามารถลบจนเหลือ 0 ได้

---
## TC-SIGN-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated access blocked, **so that** signature settings stay protected.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิดหน้า `/system-admin` ที่ฝัง Signature Config โดยตรงโดยไม่ล็อกอิน
**Expected**
ถูก redirect ไป `/login` และไม่เห็นฟอร์ม Signature Config

---
<sub>Authored: 2026-06-17 · documentation only</sub>
