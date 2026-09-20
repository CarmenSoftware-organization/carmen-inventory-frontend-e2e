# Email Template — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/email-template` (`email-template.route.tsx`, `email-template-dialog.tsx`, `email-template-schema.ts`) plus `hooks/use-email-templates.ts`, `lib/email-template.ts`, `types/email-template.ts`, `components/ui/rich-text-editor-inner.tsx` และข้อความจาก `messages/en.json`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Platform / System Admin — Email Template (UI label: "Email Messages")
**Frontend route:** `routes/system-admin/email-template`  •  **URL:** `/system-admin/email-template`
**Prefix:** `ETPL`
**Default role:** Platform Admin (admin@blueledgers.com, ต้องมี active BU เพราะ app-config อ่าน/เขียนตาม BU code)
**Total test cases:** 30

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **ไม่มี list endpoint / ไม่มี search / filter / pagination / sort** — ทั้งโมดูลเก็บเป็นอาเรย์เดียวใน app-config key `email_templates` (`GET/PUT /{bu}/app-config/email_templates`) และเรนเดอร์ด้วยตาราง HTML ธรรมดา การบันทึกทุกครั้งเป็น PUT ทับ `value` ทั้งก้อน (last-write-wins ไม่มี optimistic concurrency / ไม่มี `doc_version`) บล็อก 01 จึงมีเฉพาะเคสการแสดงผล
> 2. **ไม่มีหน้ารายละเอียดแยก** — ดู/แก้ไขทำใน dialog เดียวกัน จึงไม่มีเคสในบล็อก 02
> 3. **ข้อความ validation ไม่สามารถยืนยันเป็นตัวอักษรได้** — `FieldError` ทั้งสามช่องเรียก `tc("required")` แต่ namespace `common` ใน `messages/en.json` **ไม่มีคีย์ `required`** (มีแต่ `form.required` และ `validation.required`) เคสบล็อก 20 จึงยืนยันเพียงว่า error ปรากฏใต้ฟิลด์ (`[data-invalid]` / `aria-invalid`) และ dialog ไม่ปิด ไม่ยืนยันตัวข้อความ
> 4. **route ไม่มี permission guard** — `/system-admin/email-template` อยู่ใต้ `RequireAuth` อย่างเดียว (auth เท่านั้น) ส่วน `PERMISSIONS.system_configuration.view` และ `licenseFeature: "configuration.app_config"` ใน `constant/module-list.ts` กันแค่การ **แสดงเมนู** TC-ETPL-100002 จึงยืนยันที่การซ่อนเมนู ไม่ใช่การบล็อก URL ตรง
> 5. ชนิดเอกสารมีเพียง 2 ค่า (`po` = "Purchase order", `rfp` = "Request for pricing") และ **ค่าเริ่มต้นแยกกันต่อชนิดเอกสาร**

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ETPL-010001 | แสดงตารางรายการข้อความอีเมลพร้อมคอลัมน์ครบ | High | Smoke |
| TC-ETPL-010002 | แสดงข้อความว่างเมื่อยังไม่เคยตั้งค่าข้อความอีเมล | Medium | Edge Case |
| TC-ETPL-010003 | แสดง badge Default ที่รายการค่าเริ่มต้นของชนิดเอกสาร | Medium | Functional |
| TC-ETPL-010004 | แสดง badge Enabled / Disabled ตามสถานะของรายการ | Medium | Functional |
| TC-ETPL-010005 | แสดงหมายเหตุ (Note) ใต้ชื่อข้อความอีเมล | Low | Functional |
| TC-ETPL-030001 | สร้างข้อความอีเมลใหม่สำเร็จ | High | CRUD |
| TC-ETPL-030002 | รายการแรกของชนิดเอกสารได้ badge Default อัตโนมัติ | High | Functional |
| TC-ETPL-030003 | ยกเลิกการสร้างด้วยปุ่ม Cancel | Medium | Alternate Flow |
| TC-ETPL-030004 | บันทึก Default CC หลายอีเมลคั่นด้วยจุลภาค | Medium | Functional |
| TC-ETPL-040001 | แก้ไขข้อความอีเมลแล้วค่าคงอยู่ | High | CRUD |
| TC-ETPL-040002 | เปิด dialog แก้ไขแล้วฟอร์มถูกเติมค่าเดิมครบทุกช่อง | High | Functional |
| TC-ETPL-040003 | ปิดใช้งานข้อความอีเมลผ่าน checkbox Enabled | Medium | CRUD |
| TC-ETPL-050001 | ลบข้อความอีเมลสำเร็จ | High | CRUD |
| TC-ETPL-050002 | ยกเลิกการลบใน DeleteDialog | Medium | Alternate Flow |
| TC-ETPL-050003 | ลบรายการที่เป็นค่าเริ่มต้นแล้ว Default เลื่อนไปรายการที่เหลือ | Medium | Functional |
| TC-ETPL-100001 | เข้าหน้าโดยไม่ได้ล็อกอินถูกส่งไป /login | High | Auth-guard |
| TC-ETPL-100002 | ผู้ใช้ที่ไม่มีสิทธิ์ System Configuration ไม่เห็นเมนู Email Messages | High | Authorization |
| TC-ETPL-200001 | บันทึกไม่ได้เมื่อไม่กรอก Message name | High | Validation |
| TC-ETPL-200002 | บันทึกไม่ได้เมื่อไม่กรอก Subject | High | Validation |
| TC-ETPL-200003 | บันทึกไม่ได้เมื่อเนื้อความว่าง (ลบข้อความในตัวแก้ไขจนหมด) | High | Validation |
| TC-ETPL-300001 | ข้อความอีเมลของ Purchase order ถูกใช้ใน dialog ส่งอีเมล PO | High | Integration |
| TC-ETPL-300002 | ข้อความอีเมลของ Request for pricing ถูกใช้ใน dialog ส่งอีเมล RFP | Medium | Integration |
| TC-ETPL-400001 | แทรกตัวแปรลงหัวเรื่องด้วยชิปใต้ช่อง Subject | Medium | Functional |
| TC-ETPL-400002 | แทรกตัวแปรลงเนื้อความด้วยเมนู Insert variable | Medium | Functional |
| TC-ETPL-400003 | พรีวิวแทนค่าตัวแปรด้วยค่าตัวอย่างและกลับมาแก้ไขได้ | High | Functional |
| TC-ETPL-400004 | เปลี่ยนชนิดเอกสารแล้วรายการตัวแปรที่แทรกได้เปลี่ยนตาม | Medium | Functional |
| TC-ETPL-400005 | ตั้งค่าเริ่มต้นด้วยปุ่ม Set as default | High | Functional |
| TC-ETPL-400006 | ค่าเริ่มต้นแยกกันต่อชนิดเอกสาร | Medium | Functional |
| TC-ETPL-900001 | ตัวแปรของชนิดเอกสารเดิมที่ค้างอยู่ไม่ถูกแทนค่าในพรีวิว | Medium | Edge Case |
| TC-ETPL-900002 | แสดง error state เมื่อโหลดคลังข้อความอีเมลไม่สำเร็จ | Medium | Negative |

---
## TC-ETPL-010001 — แสดงตารางรายการข้อความอีเมลพร้อมคอลัมน์ครบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; มี active BU; มีข้อความอีเมลบันทึกไว้แล้วอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/email-template`
2. รอให้ skeleton หายและตารางโหลดเสร็จ
**Expected**
หัวเรื่องหน้าแสดง "Email Messages" พร้อมคำอธิบายใต้หัวเรื่อง; ปุ่ม "Add message" ปรากฏมุมขวาบน; ตารางแสดงหัวคอลัมน์ Name, Document, Subject, Status, Row actions และมีแถวข้อมูลอย่างน้อย 1 แถว

---
## TC-ETPL-010002 — แสดงข้อความว่างเมื่อยังไม่เคยตั้งค่าข้อความอีเมล
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; BU ที่ใช้ยังไม่มีข้อความอีเมลใน app-config key `email_templates` (404 = ยังไม่เคยตั้งค่า ไม่ถือเป็นข้อผิดพลาด)
**Steps**
1. ไปที่ `/system-admin/email-template`
**Expected**
ไม่มีตาราง; แสดงข้อความ "No email messages yet. Add one so the send dialog starts from your own wording."; ปุ่ม "Add message" ยังคงปรากฏ

---
## TC-ETPL-010003 — แสดง badge Default ที่รายการค่าเริ่มต้นของชนิดเอกสาร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมลของชนิด Purchase order อย่างน้อย 2 รายการ และมีหนึ่งรายการถูกตั้งเป็นค่าเริ่มต้นแล้ว
**Steps**
1. ไปที่ `/system-admin/email-template`
2. ดูคอลัมน์ Name ของแถวที่เป็นค่าเริ่มต้น
**Expected**
แถวที่เป็นค่าเริ่มต้นมี badge "Default" ต่อท้ายชื่อ และไม่มีปุ่ม "Set as default" ในแถวนั้น; แถวอื่นของชนิดเดียวกันไม่มี badge "Default" แต่มีปุ่ม "Set as default"

---
## TC-ETPL-010004 — แสดง badge Enabled / Disabled ตามสถานะของรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมลทั้งที่เปิดใช้งานและปิดใช้งานอย่างละ 1 รายการ
**Steps**
1. ไปที่ `/system-admin/email-template`
2. ดูคอลัมน์ Status ของทั้งสองแถว
**Expected**
แถวที่เปิดใช้งานแสดง badge "Enabled"; แถวที่ปิดใช้งานแสดง badge "Disabled"

---
## TC-ETPL-010005 — แสดงหมายเหตุ (Note) ใต้ชื่อข้อความอีเมล
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมล 1 รายการที่กรอกช่อง Note ไว้ และอีก 1 รายการที่เว้นว่าง
**Steps**
1. ไปที่ `/system-admin/email-template`
2. เทียบคอลัมน์ Name ของทั้งสองแถว
**Expected**
แถวที่มี Note แสดงข้อความหมายเหตุเป็นบรรทัดรองใต้ชื่อ (ตัดเหลือหนึ่งบรรทัด); แถวที่ไม่มี Note ไม่มีบรรทัดรอง

---
## TC-ETPL-030001 — สร้างข้อความอีเมลใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/system-admin/email-template`
**Steps**
1. คลิกปุ่ม "Add message"
2. กรอก Message name เป็นชื่อที่ไม่ซ้ำ
3. เลือก Document type = Purchase order
4. กรอก Subject
5. พิมพ์เนื้อความลงในตัวแก้ไข Message
6. คลิก Save
**Expected**
Dialog หัวข้อ "Add Email message" ปิดลง; แสดง toast "Email message created successfully"; แถวใหม่ปรากฏในตารางพร้อมชื่อที่กรอก, Document = Purchase order และ Status = Enabled

---
## TC-ETPL-030002 — รายการแรกของชนิดเอกสารได้ badge Default อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; BU ที่ใช้ยังไม่มีข้อความอีเมลของชนิด Request for pricing และยังไม่มีค่าเริ่มต้นของชนิดนี้
**Steps**
1. คลิกปุ่ม "Add message"
2. กรอก Message name, เลือก Document type = Request for pricing, กรอก Subject และเนื้อความ
3. คลิก Save
**Expected**
แถวใหม่ปรากฏในตารางพร้อม badge "Default" โดยไม่ต้องกด Set as default และแถวนั้นไม่มีปุ่ม "Set as default"

---
## TC-ETPL-030003 — ยกเลิกการสร้างด้วยปุ่ม Cancel
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/system-admin/email-template`; จำจำนวนแถวในตารางก่อนเริ่มทดสอบ
**Steps**
1. คลิกปุ่ม "Add message"
2. กรอก Message name และ Subject
3. คลิกปุ่ม Cancel ใน footer ของ dialog
**Expected**
Dialog ปิดลงโดยไม่มี toast; จำนวนแถวในตารางเท่าเดิม; เมื่อเปิด "Add message" อีกครั้ง ช่อง Message name และ Subject ว่างเปล่า

---
## TC-ETPL-030004 — บันทึก Default CC หลายอีเมลคั่นด้วยจุลภาค
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog "Add Email message" และกรอก Message name, Subject, เนื้อความครบแล้ว
**Steps**
1. กรอกช่อง Default CC เป็น `procurement@hotel.com, finance@hotel.com`
2. คลิก Save
3. เปิดรายการที่เพิ่งสร้างด้วยปุ่ม Edit
**Expected**
บันทึกสำเร็จพร้อม toast "Email message created successfully"; เมื่อเปิดแก้ไข ช่อง Default CC แสดงค่าเป็น `procurement@hotel.com, finance@hotel.com`

---
## TC-ETPL-040001 — แก้ไขข้อความอีเมลแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีข้อความอีเมลที่สร้างไว้แล้วอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มไอคอนดินสอ (aria-label "Edit") ในแถวของรายการนั้น
2. แก้ไข Message name และ Subject เป็นค่าใหม่
3. คลิก Save
4. เปิดรายการเดิมด้วยปุ่ม Edit อีกครั้ง
**Expected**
Dialog หัวข้อ "Edit Email message" ปิดลง; แสดง toast "Email message updated successfully"; ตารางแสดงชื่อและหัวเรื่องใหม่; เมื่อเปิดแก้ไขซ้ำ ฟอร์มแสดงค่าใหม่ที่บันทึกไว้

---
## TC-ETPL-040002 — เปิด dialog แก้ไขแล้วฟอร์มถูกเติมค่าเดิมครบทุกช่อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมล 1 รายการที่กรอกครบทั้ง Message name, Document type, Subject, เนื้อความ, Default CC และ Note
**Steps**
1. คลิกปุ่มไอคอนดินสอ (aria-label "Edit") ในแถวนั้น
**Expected**
Dialog เปิดด้วยหัวข้อ "Edit Email message" และเติมค่าเดิมครบทุกช่อง (Message name, Document type, Subject, เนื้อความในตัวแก้ไข, Default CC, Note) พร้อมสถานะ checkbox "Enabled" ตรงกับที่บันทึกไว้; มุมมองเริ่มต้นเป็นโหมดแก้ไข ไม่ใช่พรีวิว

---
## TC-ETPL-040003 — ปิดใช้งานข้อความอีเมลผ่าน checkbox Enabled
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีข้อความอีเมล 1 รายการที่สถานะเป็น Enabled
**Steps**
1. คลิกปุ่มไอคอนดินสอ (aria-label "Edit") ในแถวนั้น
2. คลิก checkbox "Enabled" ให้ไม่ถูกเลือก
3. คลิก Save
**Expected**
แสดง toast "Email message updated successfully"; คอลัมน์ Status ของแถวนั้นเปลี่ยนเป็น badge "Disabled"

---
## TC-ETPL-050001 — ลบข้อความอีเมลสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีข้อความอีเมลที่สร้างขึ้นเพื่อการทดสอบอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มไอคอนถังขยะ (aria-label "Delete") ในแถวของรายการนั้น
2. อ่านข้อความยืนยันใน dialog
3. คลิกปุ่ม Delete เพื่อยืนยัน
**Expected**
Dialog ยืนยันมีหัวข้อ "Delete email message" และข้อความ `Delete "<ชื่อรายการ>"? This cannot be undone.`; หลังยืนยันแสดง toast "Email message deleted successfully" และแถวนั้นหายจากตาราง

---
## TC-ETPL-050002 — ยกเลิกการลบใน DeleteDialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีข้อความอีเมลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มไอคอนถังขยะ (aria-label "Delete") ในแถวของรายการนั้น
2. คลิกปุ่ม Cancel ใน dialog ยืนยัน
**Expected**
Dialog ปิดโดยไม่มี toast; แถวนั้นยังอยู่ในตารางเหมือนเดิม

---
## TC-ETPL-050003 — ลบรายการที่เป็นค่าเริ่มต้นแล้ว Default เลื่อนไปรายการที่เหลือ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมลของชนิด Purchase order อย่างน้อย 2 รายการ และรายการ A เป็นค่าเริ่มต้นอยู่
**Steps**
1. คลิกปุ่มไอคอนถังขยะ (aria-label "Delete") ในแถวของรายการ A
2. คลิกปุ่ม Delete เพื่อยืนยัน
**Expected**
แสดง toast "Email message deleted successfully"; รายการ A หายจากตาราง; badge "Default" ย้ายไปอยู่ที่รายการชนิด Purchase order ที่เหลือซึ่งอยู่ลำดับแรกในตาราง

---
## TC-ETPL-100001 — เข้าหน้าโดยไม่ได้ล็อกอินถูกส่งไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
เบราว์เซอร์ไม่มี session ที่ล็อกอินอยู่ (storage state ว่าง)
**Steps**
1. ไปที่ `/system-admin/email-template` โดยตรง
**Expected**
ถูก redirect ไปหน้า `/login` และไม่มีข้อมูลข้อความอีเมลแสดงบนจอ

---
## TC-ETPL-100002 — ผู้ใช้ที่ไม่มีสิทธิ์ System Configuration ไม่เห็นเมนู Email Messages
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี permission `system_configuration.view` (เช่น บัญชีระดับ staff ที่ไม่ใช่ผู้ดูแลระบบ)
**Steps**
1. เปิด module launcher / sidebar ของกลุ่ม System Administration
2. มองหารายการเมนู "Email Messages"
**Expected**
เมนู "Email Messages" ไม่ปรากฏให้เข้าถึงในเมนูของผู้ใช้รายนี้
**Note**
route นี้ไม่มี permission guard ระดับ route (มีเพียง `RequireAuth`) — การพิมพ์ URL ตรงยังเปิดหน้าได้ เคสนี้จึงยืนยันเฉพาะการซ่อนเมนู

---
## TC-ETPL-200001 — บันทึกไม่ได้เมื่อไม่กรอก Message name
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Email message"
**Steps**
1. เว้นช่อง Message name ว่างไว้
2. กรอก Subject และเนื้อความให้ครบ
3. คลิก Save
**Expected**
Dialog ไม่ปิดและไม่มี toast สร้างสำเร็จ; ช่อง Message name ถูกทำเครื่องหมายว่าไม่ผ่าน (`aria-invalid`) และมีข้อความ error ปรากฏใต้ช่อง; ไม่มีแถวใหม่ในตาราง

---
## TC-ETPL-200002 — บันทึกไม่ได้เมื่อไม่กรอก Subject
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Email message" และกรอก Message name กับเนื้อความแล้ว
**Steps**
1. เว้นช่อง Subject ว่างไว้
2. คลิก Save
**Expected**
Dialog ไม่ปิดและไม่มี toast สร้างสำเร็จ; ช่อง Subject ถูกทำเครื่องหมายว่าไม่ผ่าน (`aria-invalid`) และมีข้อความ error ปรากฏใต้ช่อง

---
## TC-ETPL-200003 — บันทึกไม่ได้เมื่อเนื้อความว่าง (ลบข้อความในตัวแก้ไขจนหมด)
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Edit Email message" ของรายการที่มีเนื้อความอยู่แล้ว
**Steps**
1. คลิกในตัวแก้ไข Message แล้วเลือกข้อความทั้งหมด (Ctrl/Cmd+A) และลบออกจนหมด
2. คลิก Save
**Expected**
Dialog ไม่ปิดและไม่มี toast อัปเดตสำเร็จ; ส่วนเนื้อความถูกทำเครื่องหมายว่าไม่ผ่าน (กรอบสีแดง / `aria-invalid`) และมีข้อความ error ปรากฏใต้ตัวแก้ไข
**Note**
ตัวแก้ไขทิ้ง `<p></p>` ไว้เสมอเมื่อลบข้อความหมด schema จึงตรวจจากข้อความล้วนที่อ่านได้ ไม่ใช่ความยาว HTML ดิบ

---
## TC-ETPL-300001 — ข้อความอีเมลของ Purchase order ถูกใช้ใน dialog ส่งอีเมล PO
**Priority:** High · **Test Type:** Integration
**Preconditions**
มีข้อความอีเมลชนิด Purchase order ที่เปิดใช้งานและตั้งเป็นค่าเริ่มต้นแล้ว โดยหัวเรื่องมีตัวแปร `{{po_no}}`; มี email profile ที่เปิดใช้งาน; มีใบสั่งซื้อที่ส่งอีเมลได้
**Steps**
1. ไปที่เอกสาร Purchase order แล้วเปิด dialog ส่งอีเมล
2. ดูช่องเลือกข้อความอีเมล รวมถึงหัวเรื่องและเนื้อความที่ถูกเติมให้
**Expected**
ข้อความอีเมลที่เปิดใช้งานของชนิด Purchase order ปรากฏให้เลือก โดยตัวที่เป็นค่าเริ่มต้นถูกเลือกไว้ล่วงหน้า; หัวเรื่องและเนื้อความถูกเติมจาก template นั้น และ `{{po_no}}` ถูกแทนด้วยเลขที่ใบสั่งซื้อจริง

---
## TC-ETPL-300002 — ข้อความอีเมลของ Request for pricing ถูกใช้ใน dialog ส่งอีเมล RFP
**Priority:** Medium · **Test Type:** Integration
**Preconditions**
มีข้อความอีเมลชนิด Request for pricing ที่เปิดใช้งานและตั้งเป็นค่าเริ่มต้นแล้ว โดยหัวเรื่องมีตัวแปร `{{rfp_name}}`; มีเอกสาร Request for pricing ที่ส่งอีเมลได้
**Steps**
1. ไปที่เอกสาร Request for pricing แล้วเปิด dialog ส่งอีเมล
2. ดูช่องเลือกข้อความอีเมล รวมถึงหัวเรื่องและเนื้อความที่ถูกเติมให้
**Expected**
ข้อความอีเมลที่เปิดใช้งานของชนิด Request for pricing ปรากฏให้เลือก โดยตัวที่เป็นค่าเริ่มต้นถูกเลือกไว้ล่วงหน้า; หัวเรื่องและเนื้อความถูกเติมจาก template นั้น และ `{{rfp_name}}` ถูกแทนด้วยชื่อเอกสารจริง

---
## TC-ETPL-400001 — แทรกตัวแปรลงหัวเรื่องด้วยชิปใต้ช่อง Subject
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog "Add Email message" โดย Document type = Purchase order
**Steps**
1. พิมพ์ข้อความนำในช่อง Subject เช่น `Purchase order `
2. ดูแถวชิปใต้ช่อง Subject ที่มีป้าย "Insert into subject"
3. คลิกชิป `{{po_no}}`
**Expected**
ชิปที่แสดงคือชุดตัวแปรของ Purchase order ได้แก่ `{{po_no}}`, `{{vendor_name}}`, `{{bu_name}}`, `{{total}}`, `{{delivery_date}}`; หลังคลิก ช่อง Subject มีค่าเป็น `Purchase order {{po_no}}` (ต่อท้ายข้อความเดิม)

---
## TC-ETPL-400002 — แทรกตัวแปรลงเนื้อความด้วยเมนู Insert variable
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog "Add Email message" โดย Document type = Purchase order และเนื้อความมีข้อความอยู่แล้ว
**Steps**
1. คลิกปุ่ม "Insert variable" บนแถบเครื่องมือของตัวแก้ไข Message
2. เลือกรายการ `{{vendor_name}}` จากเมนู
**Expected**
เมนูแสดงตัวแปรของ Purchase order ครบ 5 ตัว; หลังเลือก ข้อความ `{{vendor_name}}` ถูกแทรกลงในเนื้อความ ณ ตำแหน่งเคอร์เซอร์

---
## TC-ETPL-400003 — พรีวิวแทนค่าตัวแปรด้วยค่าตัวอย่างและกลับมาแก้ไขได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog แก้ไข/สร้างข้อความอีเมล โดย Document type = Purchase order, Subject = `Purchase order {{po_no}}` และเนื้อความมี `{{vendor_name}}`
**Steps**
1. คลิกปุ่ม "Preview" ที่มุมขวาของหัวข้อ Message
2. อ่านแถบ Subject และเนื้อความในพรีวิว
3. คลิกปุ่ม "Back to editing"
**Expected**
ในพรีวิว หัวเรื่องแสดงเป็น `Purchase order PO-2026-000123` และเนื้อความแสดงชื่อผู้ขายตัวอย่าง `Siam Fresh Supply Co., Ltd.` แทนตัวแปร; หลังคลิก "Back to editing" กลับสู่ตัวแก้ไขพร้อมเนื้อความเดิมครบถ้วน

---
## TC-ETPL-400004 — เปลี่ยนชนิดเอกสารแล้วรายการตัวแปรที่แทรกได้เปลี่ยนตาม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog "Add Email message" โดย Document type เริ่มต้นเป็น Purchase order
**Steps**
1. ดูชิปตัวแปรใต้ช่อง Subject และรายการในเมนู "Insert variable"
2. เปลี่ยน Document type เป็น Request for pricing
3. ดูชิปตัวแปรและเมนู "Insert variable" อีกครั้ง
**Expected**
ก่อนเปลี่ยนมีตัวแปรของ Purchase order 5 ตัว; หลังเปลี่ยนรายการกลายเป็นตัวแปรของ Request for pricing 7 ตัว ได้แก่ `{{rfp_name}}`, `{{vendor_name}}`, `{{contact_person}}`, `{{bu_name}}`, `{{start_date}}`, `{{end_date}}`, `{{portal_url}}`

---
## TC-ETPL-400005 — ตั้งค่าเริ่มต้นด้วยปุ่ม Set as default
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมลของชนิด Purchase order อย่างน้อย 2 รายการ โดยรายการ A เป็นค่าเริ่มต้นและรายการ B ไม่ใช่
**Steps**
1. ไปที่ `/system-admin/email-template`
2. คลิกปุ่ม "Set as default" ในแถวของรายการ B
**Expected**
แสดง toast `"<ชื่อรายการ B>" is now the default message`; badge "Default" ย้ายไปอยู่ที่แถว B และหายจากแถว A; ปุ่ม "Set as default" ปรากฏที่แถว A แทน

---
## TC-ETPL-400006 — ค่าเริ่มต้นแยกกันต่อชนิดเอกสาร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีข้อความอีเมลของชนิด Purchase order อย่างน้อย 2 รายการ และของชนิด Request for pricing อย่างน้อย 1 รายการที่เป็นค่าเริ่มต้นของชนิดนั้น
**Steps**
1. จดจำว่าแถวใดของ Request for pricing ถือ badge "Default"
2. คลิกปุ่ม "Set as default" ที่แถว Purchase order อีกรายการหนึ่ง
3. ตรวจ badge "Default" ของทั้งสองชนิดเอกสาร
**Expected**
badge "Default" ของกลุ่ม Purchase order ย้ายไปตามที่กด; แถว Request for pricing ที่เป็นค่าเริ่มต้นยังคงถือ badge "Default" เหมือนเดิม

---
## TC-ETPL-900001 — ตัวแปรของชนิดเอกสารเดิมที่ค้างอยู่ไม่ถูกแทนค่าในพรีวิว
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ใน dialog สร้างข้อความอีเมล โดย Document type = Purchase order
**Steps**
1. กรอก Subject เป็น `{{po_no}} / {{vendor_name}}` และกรอกเนื้อความ
2. เปลี่ยน Document type เป็น Request for pricing
3. คลิกปุ่ม "Preview"
**Expected**
ในพรีวิว `{{po_no}}` ยังคงแสดงเป็นข้อความ `{{po_no}}` ตามเดิมเพราะไม่ใช่ตัวแปรของ Request for pricing ส่วน `{{vendor_name}}` ถูกแทนด้วยค่าตัวอย่าง `Siam Fresh Supply Co., Ltd.` (เป็นตัวแปรร่วมของทั้งสองชนิด)

---
## TC-ETPL-900002 — แสดง error state เมื่อโหลดคลังข้อความอีเมลไม่สำเร็จ
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ทำให้คำขออ่าน app-config key `email_templates` ตอบกลับเป็นข้อผิดพลาดที่ไม่ใช่ 404 (เช่น 500) — 404 แปลว่ายังไม่เคยตั้งค่า ไม่ใช่ข้อผิดพลาด
**Steps**
1. ไปที่ `/system-admin/email-template`
**Expected**
แสดง error state พร้อมข้อความ "Could not load email messages"; ไม่มีตารางและไม่มีปุ่ม "Add message" บนหน้า
