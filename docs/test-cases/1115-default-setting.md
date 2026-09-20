# Default Setting — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/default-setting` (`default-setting.route.tsx`, `default-setting-component.tsx`, `use-report-form-templates.ts`) และคอมโพเนนต์ที่ยืมจาก `routes/system-admin/company-profile` (`company-profile-ui.tsx`, `company-profile-form-schema.ts`, `company-profile-config-registry.ts`). Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Platform / System Admin — Default Setting
**Frontend route:** `routes/system-admin/default-setting`  •  **URL:** `/system-admin/default-setting`
**Prefix:** `DSET`
**Default role:** Platform Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 30

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DSET-010001 | เปิดหน้า Default Setting จากเมนู System Admin | High | Smoke |
| TC-DSET-010002 | แสดงครบทั้ง 4 section (PR / SI / PO / Print Forms) | High | Smoke |
| TC-DSET-010003 | แสดง skeleton ระหว่างโหลดข้อมูล business unit | Medium | Functional |
| TC-DSET-010004 | โหลดข้อมูล business unit ไม่สำเร็จ แสดง error state พร้อมปุ่มลองใหม่ | Medium | Negative |
| TC-DSET-020001 | โหมด view แสดงค่า boolean เป็น Yes / No | Medium | Functional |
| TC-DSET-020002 | โหมด view แสดง label ของ enum ไม่ใช่ค่าดิบ | Medium | Functional |
| TC-DSET-020003 | ทุกฟิลด์แสดง config key เป็นคำอธิบายใต้ชื่อฟิลด์ | Low | Functional |
| TC-DSET-020004 | แบบฟอร์มการพิมพ์ที่ยังไม่ตั้งค่าแสดง "Use the system default" | Medium | Functional |
| TC-DSET-040001 | เข้าโหมดแก้ไขด้วยปุ่ม Edit | High | Smoke |
| TC-DSET-040002 | แก้ค่า PR allow duplicate products แล้วบันทึก | High | CRUD |
| TC-DSET-040003 | แก้ค่า SI default price for added items แล้วบันทึก | High | CRUD |
| TC-DSET-040004 | แก้ค่า PO group by PR comment แล้วบันทึก | Medium | CRUD |
| TC-DSET-040005 | เลือกแบบฟอร์มการพิมพ์ของ PR แล้วบันทึก | High | CRUD |
| TC-DSET-040006 | กด Save โดยไม่ได้แก้อะไร ไม่ยิงคำขออัปเดต | Medium | Edge Case |
| TC-DSET-040007 | กด Cancel ขณะยังไม่ได้แก้อะไร ออกจากโหมดแก้ไขทันที | Medium | Alternate Flow |
| TC-DSET-040008 | กด Cancel ขณะมีการแก้ค้าง แล้วเลือก Keep editing | High | Alternate Flow |
| TC-DSET-040009 | กด Cancel ขณะมีการแก้ค้าง แล้วเลือก Discard | High | Alternate Flow |
| TC-DSET-040010 | ปุ่ม Cancel / Save ถูกปิดระหว่างกำลังบันทึก | Low | Functional |
| TC-DSET-040011 | บันทึกไม่สำเร็จ ยังคงอยู่ในโหมดแก้ไข | Medium | Negative |
| TC-DSET-100001 | ผู้ใช้ที่ไม่มีสิทธิ์ system configuration ไม่เห็นเมนู Default Setting | High | Authorization |
| TC-DSET-100002 | ผู้ใช้ที่ยังไม่ล็อกอินเข้า URL ตรง ๆ ถูกส่งไปหน้า login | High | Auth-guard |
| TC-DSET-300001 | dropdown แบบฟอร์มการพิมพ์โหลดตัวเลือกจาก report template ตามชนิดเอกสาร | High | Functional |
| TC-DSET-300002 | dropdown แบบฟอร์มการพิมพ์ถูกปิดระหว่างโหลด template | Medium | Functional |
| TC-DSET-300003 | โหลด report form ไม่สำเร็จ แสดงข้อความเตือนใน section Print Forms | Medium | Negative |
| TC-DSET-400001 | Print Forms มีครบ 12 ชนิดเอกสารตามลำดับที่กำหนด | Medium | Functional |
| TC-DSET-400002 | ตัวเลือก Average ของ SI ขึ้นตาม calculation method ของ BU | Medium | Edge Case |
| TC-DSET-400003 | ย้อนแบบฟอร์มการพิมพ์กลับเป็นค่าเริ่มต้นของระบบ | Medium | CRUD |
| TC-DSET-900001 | คลิกลิงก์ออกจากหน้าขณะมีการแก้ค้าง ถูกถามยืนยันก่อน | Medium | Edge Case |
| TC-DSET-900002 | กดปุ่ม Back ของเบราว์เซอร์ขณะมีการแก้ค้าง ถูกถามยืนยันก่อน | Medium | Edge Case |
| TC-DSET-900003 | ค่า template ที่บันทึกไว้ไม่อยู่ในรายการ แสดงเป็น Unknown template | Low | Edge Case |

---
## TC-DSET-010001 — เปิดหน้า Default Setting จากเมนู System Admin
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; บัญชีมีสิทธิ์ system configuration
**Steps**
1. เปิดเมนู Modules แล้วเลือกกลุ่ม System Admin
2. คลิกเมนู Default Setting
**Expected**
นำทางไปที่ `/system-admin/default-setting`; หัวข้อหน้าแสดง "Default Setting" พร้อมคำอธิบาย "Operational default settings for the current business unit." และมีปุ่ม Edit ที่มุมขวาบน

---
## TC-DSET-010002 — แสดงครบทั้ง 4 section (PR / SI / PO / Print Forms)
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` และโหลดข้อมูล BU สำเร็จแล้ว
**Steps**
1. รอให้เนื้อหาหน้าโหลดเสร็จ
2. ไล่ดู section ทั้งหมดบนหน้า
**Expected**
เห็น section "PR", "SI", "PO" และ "Print Forms" ตามลำดับ พร้อมคำอธิบายของแต่ละ section (เช่น "Purchase Request settings for this business unit.", "Report form used when printing each document type.")

---
## TC-DSET-010003 — แสดง skeleton ระหว่างโหลดข้อมูล business unit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login แล้ว; ทำให้คำขอ `GET api/business-units` ตอบช้า (throttle หรือ delay ผ่าน route interception)
**Steps**
1. เปิด `/system-admin/default-setting`
2. สังเกตหน้าจอระหว่างที่ข้อมูลยังโหลดไม่เสร็จ
**Expected**
แสดง skeleton ของ setting section 3 บล็อก; ยังไม่มีปุ่ม Edit / Cancel / Save และยังไม่มีฟิลด์ config ใด ๆ

---
## TC-DSET-010004 — โหลดข้อมูล business unit ไม่สำเร็จ แสดง error state พร้อมปุ่มลองใหม่
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login แล้ว; ทำให้ `GET api/business-units` ตอบ error (เช่น 500) ผ่าน route interception
**Steps**
1. เปิด `/system-admin/default-setting`
2. รอให้คำขอล้มเหลว
**Expected**
แสดงกล่อง error พร้อมข้อความ "Failed to load business unit settings." และปุ่มลองใหม่ (Try again); ไม่มีปุ่ม Edit และไม่มี section config แสดง

---
## TC-DSET-020001 — โหมด view แสดงค่า boolean เป็น Yes / No
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` ในโหมด view (ยังไม่กด Edit)
**Steps**
1. ดูฟิลด์ "Allow selecting duplicate products" ใน section PR
2. ดูฟิลด์ "Group by PR comment" ใน section PO
**Expected**
ทั้งสองฟิลด์แสดงค่าเป็นข้อความ "Yes" หรือ "No" (ไม่ใช่ "true"/"false") และไม่มี switch ให้กดในโหมด view

---
## TC-DSET-020002 — โหมด view แสดง label ของ enum ไม่ใช่ค่าดิบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` ในโหมด view; ฟิลด์ `si.cost-from` มีค่าอยู่แล้ว (ค่าเริ่มต้นจาก seed คือ last_cost)
**Steps**
1. ดูฟิลด์ "Default price for added items" ใน section SI
**Expected**
แสดง label ที่อ่านได้ เช่น "Last cost" / "Last receiving" / "Average" แทนการแสดงค่าดิบ `last_cost`

---
## TC-DSET-020003 — ทุกฟิลด์แสดง config key เป็นคำอธิบายใต้ชื่อฟิลด์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` และโหลดข้อมูลสำเร็จ
**Steps**
1. ดูใต้ชื่อฟิลด์ "Allow selecting duplicate products"
2. ดูใต้ชื่อฟิลด์ "PR - Purchase Request" ใน section Print Forms
**Expected**
เห็นคำอธิบายเป็น config key จริง คือ `pr.allow-duplicate.product` และ `print-form.pr` ตามลำดับ

---
## TC-DSET-020004 — แบบฟอร์มการพิมพ์ที่ยังไม่ตั้งค่าแสดง "Use the system default"
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting`; มีชนิดเอกสารอย่างน้อย 1 ชนิดที่ยังไม่เคยตั้งค่าแบบฟอร์ม (ค่าใน config เป็นค่าว่าง)
**Steps**
1. ดูฟิลด์ของชนิดเอกสารนั้นใน section Print Forms ในโหมด view
**Expected**
ฟิลด์แสดงข้อความ "Use the system default" (ไม่ใช่ช่องว่างเปล่าหรือ UUID)

---
## TC-DSET-040001 — เข้าโหมดแก้ไขด้วยปุ่ม Edit
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` ในโหมด view และโหลดข้อมูลสำเร็จ
**Steps**
1. คลิกปุ่ม Edit
**Expected**
ปุ่ม Edit ถูกแทนที่ด้วยปุ่ม Cancel และ Save; ฟิลด์ boolean กลายเป็น switch และฟิลด์ enum กลายเป็น dropdown ที่กดเลือกได้

---
## TC-DSET-040002 — แก้ค่า PR allow duplicate products แล้วบันทึก
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; จำค่าปัจจุบันของ "Allow selecting duplicate products" ไว้
**Steps**
1. สลับ switch ของ "Allow selecting duplicate products" ให้เป็นค่าตรงข้าม
2. คลิกปุ่ม Save
3. โหลดหน้า `/system-admin/default-setting` ใหม่
**Expected**
แสดง toast "Business unit updated"; หน้ากลับสู่โหมด view (มีปุ่ม Edit) และค่าที่แสดงเป็นค่าใหม่ (Yes/No สลับจากเดิม) ทั้งหลังบันทึกและหลังโหลดหน้าใหม่

---
## TC-DSET-040003 — แก้ค่า SI default price for added items แล้วบันทึก
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`
**Steps**
1. เปิด dropdown ของฟิลด์ "Default price for added items" ใน section SI
2. เลือกตัวเลือกที่ต่างจากค่าเดิม (เช่น "Last receiving")
3. คลิกปุ่ม Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; หลังโหลดหน้าใหม่ฟิลด์แสดง label ของตัวเลือกที่เลือกไว้

---
## TC-DSET-040004 — แก้ค่า PO group by PR comment แล้วบันทึก
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`
**Steps**
1. สลับ switch ของ "Group by PR comment" ใน section PO
2. คลิกปุ่ม Save
3. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; ค่าที่แสดงหลังโหลดหน้าใหม่เป็นค่าที่สลับไว้

---
## TC-DSET-040005 — เลือกแบบฟอร์มการพิมพ์ของ PR แล้วบันทึก
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; มี report template ชนิด form ที่มี report_group = PR อย่างน้อย 1 รายการ
**Steps**
1. เปิด dropdown ของฟิลด์ "PR - Purchase Request" ใน section Print Forms
2. เลือก template ตัวหนึ่งจากรายการ (ไม่ใช่ "Use the system default")
3. คลิกปุ่ม Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; หลังโหลดหน้าใหม่ฟิลด์ "PR - Purchase Request" แสดงชื่อ template ที่เลือกไว้

---
## TC-DSET-040006 — กด Save โดยไม่ได้แก้อะไร ไม่ยิงคำขออัปเดต
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting`; ดักจับคำขอ `PATCH api/business-units` ไว้สังเกต
**Steps**
1. คลิกปุ่ม Edit
2. ไม่แก้ไขฟิลด์ใดเลย
3. คลิกปุ่ม Save
**Expected**
หน้ากลับสู่โหมด view ทันที; ไม่มีคำขอ PATCH ถูกส่ง และไม่มี toast "Business unit updated"

---
## TC-DSET-040007 — กด Cancel ขณะยังไม่ได้แก้อะไร ออกจากโหมดแก้ไขทันที
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting`
**Steps**
1. คลิกปุ่ม Edit
2. ไม่แก้ไขฟิลด์ใดเลย
3. คลิกปุ่ม Cancel
**Expected**
หน้ากลับสู่โหมด view ทันทีโดยไม่มี dialog ยืนยันใด ๆ ขึ้นมา

---
## TC-DSET-040008 — กด Cancel ขณะมีการแก้ค้าง แล้วเลือก Keep editing
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`
**Steps**
1. สลับ switch ของ "Allow selecting duplicate products"
2. คลิกปุ่ม Cancel
3. ใน dialog คลิก "Keep editing"
**Expected**
ขึ้น dialog หัวข้อ "Discard changes?" พร้อมข้อความ "You have unsaved changes that will be lost."; หลังกด Keep editing dialog ปิด ยังอยู่ในโหมดแก้ไข และค่าที่สลับไว้ยังคงอยู่

---
## TC-DSET-040009 — กด Cancel ขณะมีการแก้ค้าง แล้วเลือก Discard
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; จำค่าเดิมของ "Group by PR comment" ไว้
**Steps**
1. สลับ switch ของ "Group by PR comment"
2. คลิกปุ่ม Cancel
3. ใน dialog "Discard changes?" คลิก "Discard"
**Expected**
dialog ปิด; หน้ากลับสู่โหมด view และค่าที่แสดงเป็นค่าเดิมก่อนแก้ (การแก้ถูกทิ้ง ไม่มีการยิง PATCH)

---
## TC-DSET-040010 — ปุ่ม Cancel / Save ถูกปิดระหว่างกำลังบันทึก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; หน่วงคำขอ `PATCH api/business-units` ให้ตอบช้าผ่าน route interception
**Steps**
1. สลับ switch ของฟิลด์ boolean ฟิลด์ใดฟิลด์หนึ่ง
2. คลิกปุ่ม Save
3. สังเกตปุ่มระหว่างที่คำขอยังไม่ตอบกลับ
**Expected**
ปุ่ม Cancel และ Save อยู่ในสถานะ disabled และปุ่ม Save แสดงไอคอน spinner หมุนแทนไอคอนบันทึก

---
## TC-DSET-040011 — บันทึกไม่สำเร็จ ยังคงอยู่ในโหมดแก้ไข
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; ทำให้ `PATCH api/business-units` ตอบ error (เช่น 400 หรือ 500) ผ่าน route interception
**Steps**
1. สลับ switch ของฟิลด์ boolean ฟิลด์ใดฟิลด์หนึ่ง
2. คลิกปุ่ม Save
**Expected**
แสดง toast แจ้งข้อผิดพลาด (จาก error handler กลาง) เพียงใบเดียว; ไม่มี toast "Business unit updated"; หน้ายังอยู่ในโหมดแก้ไขและค่าที่แก้ไว้ยังคงอยู่ให้ลองบันทึกใหม่

---
## TC-DSET-100001 — ผู้ใช้ที่ไม่มีสิทธิ์ system configuration ไม่เห็นเมนู Default Setting
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ system configuration view (เช่นบัญชีระดับ staff)
**Steps**
1. เปิดเมนู Modules
2. มองหากลุ่ม System Admin และเมนู Default Setting
**Expected**
ไม่มีเมนู Default Setting ให้คลิก (รายการถูกซ่อนตาม permission ของเมนู)

---
## TC-DSET-100002 — ผู้ใช้ที่ยังไม่ล็อกอินเข้า URL ตรง ๆ ถูกส่งไปหน้า login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ล้าง storage state / logout แล้ว)
**Steps**
1. เปิด URL `/system-admin/default-setting` โดยตรง
**Expected**
ถูก redirect ไปที่ `/login` และไม่เห็นเนื้อหาของหน้า Default Setting

---
## TC-DSET-300001 — dropdown แบบฟอร์มการพิมพ์โหลดตัวเลือกจาก report template ตามชนิดเอกสาร
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; มี report template ชนิด form ที่มี report_group ตรงกับชนิดเอกสารที่จะทดสอบ
**Steps**
1. เปิด dropdown ของฟิลด์ "PO - Purchase Order"
2. ดูรายการตัวเลือกที่แสดง
**Expected**
ตัวเลือกแรกคือ "Use the system default" ตามด้วยชื่อ template ที่อยู่ใน report_group = PO เท่านั้น (ไม่มี template ของกลุ่มอื่นปน)

---
## TC-DSET-300002 — dropdown แบบฟอร์มการพิมพ์ถูกปิดระหว่างโหลด template
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
หน่วงคำขอรายการ report form template ให้ตอบช้าผ่าน route interception
**Steps**
1. เปิด `/system-admin/default-setting` แล้วคลิก Edit ทันทีที่ปุ่มปรากฏ
2. สังเกต dropdown ใน section Print Forms ระหว่างที่รายการ template ยังโหลดไม่เสร็จ
**Expected**
dropdown ของทุกฟิลด์ใน section Print Forms อยู่ในสถานะ disabled (กดเปิดไม่ได้) จนกว่ารายการ template จะโหลดเสร็จ ส่วน switch/dropdown ของ section PR, SI, PO ยังใช้งานได้ตามปกติ

---
## TC-DSET-300003 — โหลด report form ไม่สำเร็จ แสดงข้อความเตือนใน section Print Forms
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ทำให้คำขอรายการ report form template ตอบ error ผ่าน route interception; `GET api/business-units` ยังสำเร็จปกติ
**Steps**
1. เปิด `/system-admin/default-setting`
2. ดูหัว section "Print Forms"
3. คลิก Edit แล้วเปิด dropdown ของชนิดเอกสารใดก็ได้
**Expected**
section Print Forms แสดงข้อความเตือน "Could not load report forms." (เป็น alert); dropdown ยังเปิดได้และยังมีตัวเลือก "Use the system default" ให้เลือกเสมอ; section PR / SI / PO ยังแสดงและแก้ไขได้ตามปกติ

---
## TC-DSET-400001 — Print Forms มีครบ 12 ชนิดเอกสารตามลำดับที่กำหนด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/default-setting` และโหลดข้อมูลสำเร็จ
**Steps**
1. ไล่อ่านชื่อฟิลด์ทั้งหมดใน section Print Forms จากบนลงล่าง
**Expected**
มีครบ 12 ฟิลด์ตามลำดับ: PR - Purchase Request, PO - Purchase Order, GRN - Good Received Note, SR - Store Requisition, CN - Credit Note, SI - Stock In, SO - Stock Out, IA - Inventory Adjustment, PC - Physical Count, SC - Spot Check, RFP - Request For Pricing, EOP - End Of Period

---
## TC-DSET-400002 — ตัวเลือก Average ของ SI ขึ้นตาม calculation method ของ BU
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting`; ทราบค่า calculation method ของ BU ปัจจุบัน และค่าปัจจุบันของ `si.cost-from` ไม่ใช่ `average`
**Steps**
1. เปิด dropdown ของฟิลด์ "Default price for added items"
2. ตรวจว่ามีตัวเลือก "Average" อยู่ในรายการหรือไม่
**Expected**
ถ้า calculation method ของ BU เป็น average จะเห็นตัวเลือก "Average"; ถ้าไม่ใช่ จะไม่เห็นตัวเลือกนี้ โดยตัวเลือก "Last receiving" และ "Last cost" แสดงอยู่เสมอ

---
## TC-DSET-400003 — ย้อนแบบฟอร์มการพิมพ์กลับเป็นค่าเริ่มต้นของระบบ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีชนิดเอกสารอย่างน้อย 1 ชนิดที่ถูกตั้งค่า template ไว้แล้ว (เช่นทำต่อจาก TC-DSET-040005)
**Steps**
1. คลิก Edit
2. เปิด dropdown ของชนิดเอกสารนั้น แล้วเลือก "Use the system default"
3. คลิกปุ่ม Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; หลังโหลดหน้าใหม่ฟิลด์นั้นแสดง "Use the system default" อีกครั้ง

---
## TC-DSET-900001 — คลิกลิงก์ออกจากหน้าขณะมีการแก้ค้าง ถูกถามยืนยันก่อน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของ `/system-admin/default-setting` และมีการแก้ค้าง (สลับ switch แล้วยังไม่ Save)
**Steps**
1. คลิกลิงก์ภายในแอปเพื่อออกจากหน้า (เช่นลิงก์ในเมนูไปหน้าอื่น)
2. ใน dialog ที่ขึ้นมา คลิก "Keep editing"
**Expected**
ขึ้น dialog "Discard changes?" แทนการนำทางทันที; หลังกด Keep editing ยังอยู่ที่ `/system-admin/default-setting` ในโหมดแก้ไข และค่าที่แก้ค้างยังอยู่

---
## TC-DSET-900002 — กดปุ่ม Back ของเบราว์เซอร์ขณะมีการแก้ค้าง ถูกถามยืนยันก่อน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าหน้า `/system-admin/default-setting` มาจากหน้าอื่น (มีประวัติให้ย้อนกลับ); อยู่ในโหมดแก้ไขและมีการแก้ค้าง
**Steps**
1. กดปุ่ม Back ของเบราว์เซอร์
2. ใน dialog ที่ขึ้นมา คลิก "Discard"
**Expected**
ครั้งแรกที่กด Back ขึ้น dialog "Discard changes?" โดยยังไม่ออกจากหน้า; หลังกด Discard เบราว์เซอร์ย้อนกลับไปหน้าก่อนหน้าจริง ๆ

---
## TC-DSET-900003 — ค่า template ที่บันทึกไว้ไม่อยู่ในรายการ แสดงเป็น Unknown template
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ตั้งค่า config `print-form.<type>` ของ BU ให้เป็น id ที่ไม่มีอยู่ในรายการ report template (เช่น mock คำขอรายการ template ให้คืนรายการที่ไม่มี id นั้น)
**Steps**
1. เปิด `/system-admin/default-setting` แล้วรอให้รายการ template โหลดเสร็จ
2. ดูฟิลด์ของชนิดเอกสารนั้นใน section Print Forms
3. คลิก Edit แล้วเปิด dropdown ของฟิลด์นั้น
**Expected**
ฟิลด์แสดงข้อความเตือนรูปแบบ "⚠ Unknown template (<id>)"; ใน dropdown ยังมีตัวเลือกนี้อยู่ต่อจาก "Use the system default" เพื่อไม่ให้ค่าที่บันทึกไว้หายไปเมื่อกด Save
