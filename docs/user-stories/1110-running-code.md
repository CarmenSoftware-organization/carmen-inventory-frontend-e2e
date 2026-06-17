# Running Code (Number Sequences) — User Stories

_Authored from the test-case catalog `docs/test-cases/1110-running-code.md` (documentation only — no automated spec yet)._

**Module:** Running Code
**Frontend route:** `routes/system-admin/running-code`  •  **URL:** `/system-admin/running-code`
**Prefix:** `RUNC`
**Default role:** Platform Admin
**Total test cases:** 19

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RUNC-010001 | หน้า list Running Code โหลดสำเร็จ | High | Smoke |
| TC-RUNC-010002 | ปุ่ม Add / Init / Export / Print แสดง | High | Smoke |
| TC-RUNC-010003 | ตารางแสดงคอลัมน์ Type | Medium | Functional |
| TC-RUNC-010004 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-RUNC-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-RUNC-030001 | เปิด Add dialog แสดงช่อง Type / Config / Note | High | Smoke |
| TC-RUNC-030002 | สร้าง running code ใหม่ (type + config JSON) สำเร็จ | High | CRUD |
| TC-RUNC-030003 | ปุ่ม Format จัดรูปแบบ JSON ใน config | Medium | Functional |
| TC-RUNC-030004 | สร้างโดยใส่ note เท่านั้น (config ว่าง) สำเร็จ | Medium | CRUD |
| TC-RUNC-040001 | แก้ไข config/note ของ running code แล้ว save สำเร็จ | High | CRUD |
| TC-RUNC-040002 | ในโหมด edit ช่อง Type ถูก disable/readOnly | Medium | Functional |
| TC-RUNC-050001 | เปิด delete dialog แล้ว cancel — row ยังอยู่ | Medium | Functional |
| TC-RUNC-050002 | ลบ running code สำเร็จ (success toast) | High | CRUD |
| TC-RUNC-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-RUNC-200001 | บันทึกโดยไม่กรอก Type ต้องแสดง error | High | Validation |
| TC-RUNC-200002 | config JSON ไม่ valid ต้องถูก reject | High | Validation |
| TC-RUNC-200003 | Type เกิน 100 ตัวอักษรถูกจำกัด (maxLength) | Low | Validation |
| TC-RUNC-300001 | Init สร้างชุด running code เริ่มต้นสำเร็จ | High | Functional |
| TC-RUNC-300002 | Export ไฟล์ running code สำเร็จ | Medium | Functional |

---
## TC-RUNC-010001 — หน้า list Running Code โหลดสำเร็จ
> **As a** Platform Admin, **I want** the Running Code list to load, **so that** I can manage number sequences.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin > Running Code
**Steps**
1. ไปที่ `/system-admin/running-code`
**Expected**
URL ตรงกับ `/system-admin/running-code`, หัวข้อ Running Code แสดง, ตาราง/empty-state ปรากฏ

---
## TC-RUNC-010002 — ปุ่ม Add / Init / Export / Print แสดง
> **As a** Platform Admin, **I want** the toolbar actions visible, **so that** I can add, initialize, export and print sequences.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code` (desktop)
**Steps**
1. ไปที่ `/system-admin/running-code`
2. ดูแถบปุ่มมุมขวาบน
**Expected**
ปุ่ม Add แสดงเสมอ; บน desktop ปุ่ม Export, Print, Init แสดงด้วย (บน mobile อยู่ใน dropdown More)

---
## TC-RUNC-010003 — ตารางแสดงคอลัมน์ Type
> **As a** Platform Admin, **I want** a clickable Type column, **so that** I can open a record's editor directly.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; อยู่ที่ list (desktop)
**Steps**
1. ดูหัวตาราง
**Expected**
ตารางแสดงคอลัมน์ Type (เป็น CellAction กดได้เพื่อเปิด edit) และคอลัมน์ action; status ถูกซ่อน (hideStatus)

---
## TC-RUNC-010004 — ช่องค้นหาใช้งานได้
> **As a** Platform Admin, **I want** the search box to work, **so that** I can find a sequence by type.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code`
**Steps**
1. พิมพ์คำค้นในช่องค้นหาและกด Enter
**Expected**
ช่องค้นหารับ input และส่งคำค้น; list อัปเดตตามผล โดยไม่ error

---
## TC-RUNC-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Platform Admin, **I want** an empty state for no-match searches, **so that** I know nothing matched.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/running-code`
**Steps**
1. ค้นหาด้วยคำที่ไม่มีจริง เช่น `__NOPE__zzz`
**Expected**
empty-state placeholder ปรากฏ (ไม่มีแถวตรงคำค้น)

---
## TC-RUNC-030001 — เปิด Add dialog แสดงช่อง Type / Config / Note
> **As a** Platform Admin, **I want** the Add dialog to expose Type, Config and Note, **so that** I can define a new sequence.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code`
**Steps**
1. กดปุ่ม Add
**Expected**
Dialog เปิดขึ้น มีช่อง Type (required), Config (Textarea + ปุ่ม Format), Note และปุ่ม Cancel / Create

---
## TC-RUNC-030002 — สร้าง running code ใหม่ (type + config JSON) สำเร็จ
> **As a** Platform Admin, **I want** to create a sequence with a JSON config, **so that** documents can draw a formatted number.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/running-code`; type ที่จะสร้างยังไม่มีในระบบ
**Steps**
1. กด Add
2. กรอก Type เช่น `PR_TEST`
3. กรอก Config เช่น `{"prefix":"PR","next":1}`
4. กด Create
**Expected**
success toast (createSuccess) ปรากฏ, dialog ปิด และ running code ใหม่ปรากฏใน list

---
## TC-RUNC-030003 — ปุ่ม Format จัดรูปแบบ JSON ใน config
> **As a** Platform Admin, **I want** to format the config JSON, **so that** it stays readable and valid.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ใน Add/Edit dialog
**Steps**
1. กรอก Config เป็น JSON บรรทัดเดียว เช่น `{"prefix":"PR","next":1}`
2. กดปุ่ม Format
**Expected**
ค่าใน Config ถูก reformat เป็น JSON หลายบรรทัด (indent 2 ช่อง); ถ้า JSON ผิดจะแสดง error toast (invalidJson)

---
## TC-RUNC-030004 — สร้างโดยใส่ note เท่านั้น (config ว่าง) สำเร็จ
> **As a** Platform Admin, **I want** to create a sequence with only a note, **so that** I can register a type before defining its rules.

**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/running-code`; type ใหม่
**Steps**
1. กด Add
2. กรอก Type ใหม่ และ Note โดยปล่อย Config ว่าง
3. กด Create
**Expected**
สร้างสำเร็จ (config ถูกบันทึกเป็น `{}` เมื่อว่าง); success toast ปรากฏ

---
## TC-RUNC-040001 — แก้ไข config/note ของ running code แล้ว save สำเร็จ
> **As a** Platform Admin, **I want** to edit a sequence's config and note, **so that** I can adjust numbering rules.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
TC-RUNC-030002 ผ่านแล้ว → มี running code ในระบบ
**Steps**
1. คลิกที่ Type ในตาราง (หรือเลือก Edit) เพื่อเปิด dialog
2. แก้ไข Config / Note
3. กด Save
**Expected**
success toast (updateSuccess) ปรากฏ, dialog ปิด; payload ส่ง doc_version ของ record เดิม (optimistic concurrency)

---
## TC-RUNC-040002 — ในโหมด edit ช่อง Type ถูก disable/readOnly
> **As a** Platform Admin, **I want** the Type locked when editing, **so that** the record key stays stable.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อยู่; เปิด dialog ในโหมด edit
**Steps**
1. เปิด edit dialog ของ running code หนึ่งรายการ
2. ลองแก้ไขช่อง Type
**Expected**
ช่อง Type อยู่ในสถานะ disabled/readOnly แก้ไม่ได้ (เพราะ type เป็น key ของ record)

---
## TC-RUNC-050001 — เปิด delete dialog แล้ว cancel — row ยังอยู่
> **As a** Platform Admin, **I want** to cancel a delete dialog safely, **so that** I don't remove a sequence by accident.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ
**Steps**
1. เปิด row actions แล้วคลิก Delete
2. ใน dialog กด Cancel
**Expected**
DeleteDialog ปิด, แถวยังอยู่ (description แสดง type เป็นชื่อ)

---
## TC-RUNC-050002 — ลบ running code สำเร็จ (success toast)
> **As a** Platform Admin, **I want** to delete a sequence, **so that** obsolete sequences are removed.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี running code ที่สร้างในชุดทดสอบ
**Steps**
1. เปิด row actions ของ record เป้าหมาย
2. คลิก Delete
3. ยืนยัน Delete ใน dialog
**Expected**
success toast (deleteSuccess) ปรากฏและ record หายจาก list

---
## TC-RUNC-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated access blocked, **so that** sequences stay protected.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/running-code` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็นเนื้อหา Running Code

---
## TC-RUNC-200001 — บันทึกโดยไม่กรอก Type ต้องแสดง error
> **As a** Platform Admin, **I want** Type required on create, **so that** every sequence has a key.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน Add dialog
**Steps**
1. ปล่อย Type ว่าง
2. กด Create
**Expected**
FieldError ของ Type แสดงข้อความ required และ dialog ไม่ปิด (zod `type.min(1)`)

---
## TC-RUNC-200002 — config JSON ไม่ valid ต้องถูก reject
> **As a** Platform Admin, **I want** invalid JSON rejected, **so that** the config always parses correctly.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน Add dialog
**Steps**
1. กรอก Type ที่ถูกต้อง
2. กรอก Config เป็น JSON ผิด เช่น `{prefix: PR`
3. กด Create
**Expected**
FieldError ของ Config แสดง invalidJson และไม่มีการ submit (zod refine ตรวจ JSON.parse)

---
## TC-RUNC-200003 — Type เกิน 100 ตัวอักษรถูกจำกัด (maxLength)
> **As a** Platform Admin, **I want** Type capped at 100 characters, **so that** the key stays within storage limits.

**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ใน Add dialog
**Steps**
1. พยายามพิมพ์ Type ยาวเกิน 100 ตัวอักษร
**Expected**
ช่อง Type รับได้ไม่เกิน 100 ตัวอักษร (input maxLength=100); Config และ Note จำกัดที่ 256

---
## TC-RUNC-300001 — Init สร้างชุด running code เริ่มต้นสำเร็จ
> **As a** Platform Admin, **I want** an Init action to seed default sequences, **so that** a new tenant starts with standard numbering.

**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/running-code`; ระบบยังไม่มี running code มาตรฐาน
**Steps**
1. กดปุ่ม Init
2. รอผล
**Expected**
ระหว่างทำงานปุ่มแสดง initializing; เมื่อสำเร็จแสดง success toast (initSuccess) และ running code ชุดเริ่มต้นปรากฏใน list

---
## TC-RUNC-300002 — Export ไฟล์ running code สำเร็จ
> **As a** Platform Admin, **I want** to export sequences to a file, **so that** I can back up or audit numbering rules.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่ม Export
2. รอผล
**Expected**
ระหว่างทำงานปุ่มแสดง exporting; เมื่อสำเร็จได้ไฟล์ที่มีคอลัมน์ Type / Note / Config (JSON) และ success toast แสดงจำนวน record; ถ้าไม่มีข้อมูลแสดง warning (exportNoData)

---
<sub>Authored: 2026-06-17 · documentation only</sub>
