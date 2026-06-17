# Document Repository — User Stories

_Authored from the test-case catalog `docs/test-cases/1107-document.md` (documentation only — no automated spec yet)._

**Module:** Document Repository
**Frontend route:** `routes/system-admin/document`  •  **URL:** `/system-admin/document`
**Prefix:** `DOC`
**Default role:** Platform Admin
**Total test cases:** 18

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DOC-010001 | หน้า list เอกสารโหลดสำเร็จ | High | Smoke |
| TC-DOC-010002 | ปุ่ม Upload แสดงบนหน้า list | High | Smoke |
| TC-DOC-010003 | ตารางแสดงคอลัมน์ครบ (File Name / Type / Size / Last Modified) | Medium | Functional |
| TC-DOC-010004 | ช่องค้นหาใช้งานได้ | Medium | Smoke |
| TC-DOC-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-DOC-010006 | filter ตามประเภทไฟล์ (multi-select) ใช้งานได้ | Medium | Functional |
| TC-DOC-010007 | active filter badge แสดงและลบทีละอันได้ | Medium | Functional |
| TC-DOC-010008 | Clear all filters ล้าง filter ทั้งหมด | Low | Functional |
| TC-DOC-010009 | badge นับจำนวนรวมตรงกับจำนวนที่ filter | Low | Functional |
| TC-DOC-030001 | upload ไฟล์ PDF สำเร็จ | High | CRUD |
| TC-DOC-030002 | ระหว่าง upload ปุ่มแสดงสถานะ Uploading และ disabled | Medium | Functional |
| TC-DOC-050001 | เปิด delete dialog แล้ว cancel — ไฟล์ยังอยู่ | Medium | Functional |
| TC-DOC-050002 | ลบเอกสารสำเร็จ (success toast) | High | CRUD |
| TC-DOC-050003 | หลังลบแล้วไฟล์ไม่อยู่ใน list อีก | Medium | Functional |
| TC-DOC-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-DOC-200001 | upload ไฟล์เกิน 10 MB ถูก reject | High | Validation |
| TC-DOC-200002 | upload ไฟล์นามสกุลที่ไม่รองรับถูกปฏิเสธ | Medium | Validation |
| TC-DOC-900001 | mobile view แสดงเป็น card และ infinite scroll | Low | Edge Case |

---
## TC-DOC-010001 — หน้า list เอกสารโหลดสำเร็จ
> **As a** Platform Admin, **I want** the document list page to load successfully, **so that** I can browse the file repository.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin > Document
**Steps**
1. ไปที่ `/system-admin/document`
2. รอให้หน้าโหลดเสร็จ
**Expected**
URL ตรงกับ `/system-admin/document`, หัวข้อหน้า Document แสดง และตาราง/empty-state ปรากฏภายใน 10s

---
## TC-DOC-010002 — ปุ่ม Upload แสดงบนหน้า list
> **As a** Platform Admin, **I want** to see the Upload button on the document list, **so that** I can add new files.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin; อยู่ที่ `/system-admin/document`
**Steps**
1. ไปที่ `/system-admin/document`
2. มองหาปุ่ม Upload ที่มุมขวาบน
**Expected**
ปุ่ม Upload (ไอคอน upload) แสดงและกดได้ (ไม่ disabled ในสถานะปกติ)

---
## TC-DOC-010003 — ตารางแสดงคอลัมน์ครบ (File Name / Type / Size / Last Modified)
> **As a** Platform Admin, **I want** the table to show every column, **so that** I can read each file's metadata.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีเอกสารอย่างน้อย 1 รายการในระบบ; อยู่ที่ `/system-admin/document` (desktop view)
**Steps**
1. ไปที่ `/system-admin/document`
2. ตรวจหัวตาราง
**Expected**
หัวตารางแสดงคอลัมน์ File Name, Type, Size, Last Modified และคอลัมน์ action; คอลัมน์ Type แสดงไอคอนประเภทไฟล์ตาม content type

---
## TC-DOC-010004 — ช่องค้นหาใช้งานได้
> **As a** Platform Admin, **I want** the search box to work, **so that** I can find a file by name.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. ไปที่ `/system-admin/document`
2. พิมพ์คำค้นในช่องค้นหาและกด Enter
**Expected**
ช่องค้นหารับ input ได้และส่งคำค้น (onSearch) โดยไม่เกิด error; list อัปเดตตามผลลัพธ์

---
## TC-DOC-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Platform Admin, **I want** an empty state for no-match searches, **so that** I know nothing matched.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. ไปที่ `/system-admin/document`
2. ค้นหาด้วยคำที่ไม่มีจริง เช่น `__NOPE__zzz`
**Expected**
empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงกับคำค้น)

---
## TC-DOC-010006 — filter ตามประเภทไฟล์ (multi-select) ใช้งานได้
> **As a** Platform Admin, **I want** to filter by file type, **so that** I can narrow the list to a category.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` (desktop); มีเอกสารหลายประเภทในระบบ
**Steps**
1. ไปที่ `/system-admin/document`
2. เปิด MultiSelectFilter ของ Type
3. เลือก PDF
**Expected**
รายการถูกกรองเหลือเฉพาะไฟล์ที่ content type ตรงกับ PDF; ตัวเลือกที่มีคือ PDF / Excel·CSV / Word / Image / Text / Archive / Code

---
## TC-DOC-010007 — active filter badge แสดงและลบทีละอันได้
> **As a** Platform Admin, **I want** active filters shown as removable badges, **so that** I can drop one filter at a time.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; เลือก filter ประเภทไฟล์อย่างน้อย 1 อัน
**Steps**
1. เลือก filter Type = PDF
2. ดู active filter bar
3. กดปุ่ม x บน badge PDF
**Expected**
badge `PDF` แสดงใน active filter bar; เมื่อกด x แล้ว badge หายและ list กลับมาแสดงทุกประเภท

---
## TC-DOC-010008 — Clear all filters ล้าง filter ทั้งหมด
> **As a** Platform Admin, **I want** a Clear all action, **so that** I can reset every filter at once.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; เลือก filter ประเภทไฟล์ไว้ตั้งแต่ 2 อันขึ้นไป
**Steps**
1. เลือก filter Type = PDF และ Word
2. กด Clear all บน active filter bar
**Expected**
filter ทั้งหมดถูกล้าง, active filter bar ว่าง และ list แสดงทุกประเภทไฟล์

---
## TC-DOC-010009 — badge นับจำนวนรวมตรงกับจำนวนที่ filter
> **As a** Platform Admin, **I want** the count badge to reflect the filtered set, **so that** the total stays trustworthy.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; มีเอกสารหลายรายการ
**Steps**
1. จดจำนวนใน badge ข้างหัวข้อ Document
2. เลือก filter Type = Image
3. ดู badge ใหม่
**Expected**
เมื่อมี filter จำนวนใน badge เท่ากับจำนวนไฟล์ที่ผ่านการกรอง (ไม่ใช่ total ทั้งหมด)

---
## TC-DOC-030001 — upload ไฟล์ PDF สำเร็จ
> **As a** Platform Admin, **I want** to upload a PDF, **so that** it is stored in the repository.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/document`; มีไฟล์ PDF ขนาด < 10 MB เตรียมไว้
**Steps**
1. กดปุ่ม Upload
2. เลือกไฟล์ PDF จาก file picker
3. รอผลการ upload
**Expected**
success toast (uploadSuccess) ปรากฏ และไฟล์ใหม่ปรากฏในตารางพร้อมไอคอนประเภท PDF, ขนาด และวันที่

---
## TC-DOC-030002 — ระหว่าง upload ปุ่มแสดงสถานะ Uploading และ disabled
> **As a** Platform Admin, **I want** the Upload button to show progress, **so that** I don't trigger a duplicate upload.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; มีไฟล์เตรียมไว้
**Steps**
1. กดปุ่ม Upload และเลือกไฟล์
2. สังเกตปุ่ม Upload ระหว่างที่ mutation กำลัง pending
**Expected**
ปุ่มเปลี่ยนข้อความเป็น Uploading และถูก disabled จนกว่าจะ upload เสร็จ

---
## TC-DOC-050001 — เปิด delete dialog แล้ว cancel — ไฟล์ยังอยู่
> **As a** Platform Admin, **I want** to cancel a delete dialog safely, **so that** I don't lose a file by accident.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีเอกสารอย่างน้อย 1 รายการ; อยู่ที่ `/system-admin/document`
**Steps**
1. เปิด row actions ของเอกสารหนึ่งรายการ
2. คลิก Delete
3. ใน dialog กด Cancel
**Expected**
DeleteDialog ปิดและแถวเอกสารยังคงอยู่ใน list (ไม่ถูกลบ); dialog แสดงชื่อไฟล์ใน description

---
## TC-DOC-050002 — ลบเอกสารสำเร็จ (success toast)
> **As a** Platform Admin, **I want** to delete a file, **so that** stale documents are removed from the repository.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีเอกสารที่สร้างในชุดทดสอบ (เช่นจาก TC-DOC-030001); อยู่ที่ `/system-admin/document`
**Steps**
1. เปิด row actions ของเอกสารเป้าหมาย
2. คลิก Delete
3. ใน dialog กดยืนยัน Delete
**Expected**
success toast (deleteSuccess) ปรากฏภายใน 10s และ dialog ปิด

---
## TC-DOC-050003 — หลังลบแล้วไฟล์ไม่อยู่ใน list อีก
> **As a** Platform Admin, **I want** deleted files to disappear from the list, **so that** the repository stays accurate.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
TC-DOC-050002 ผ่านแล้ว → เอกสารถูกลบจากระบบ
**Steps**
1. รีเฟรช list หรือค้นหาชื่อไฟล์ที่ลบ
**Expected**
ไฟล์ที่ลบไม่ปรากฏในตารางอีก; ถ้าค้นหาด้วยชื่อนั้นจะได้ empty-state

---
## TC-DOC-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated access to be blocked, **so that** the repository stays secure.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session/บราวเซอร์ context ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/document` โดยตรงโดยไม่ล็อกอิน
**Expected**
ถูก redirect ไป `/login` และไม่เห็นเนื้อหา Document

---
## TC-DOC-200001 — upload ไฟล์เกิน 10 MB ถูก reject
> **As a** Platform Admin, **I want** oversize uploads rejected, **so that** storage limits are respected.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/document`; มีไฟล์ขนาด > 10 MB เตรียมไว้
**Steps**
1. กดปุ่ม Upload
2. เลือกไฟล์ขนาด > 10 MB
**Expected**
error toast (fileSizeLimit) ปรากฏ, ไฟล์ไม่ถูก upload และ input ถูก reset (ค่า value ว่าง)

---
## TC-DOC-200002 — upload ไฟล์นามสกุลที่ไม่รองรับถูกปฏิเสธ
> **As a** Platform Admin, **I want** unsupported file types rejected, **so that** only allowed formats enter the repository.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. กดปุ่ม Upload
2. ดู accept ของ file input (`.pdf,.docx,.xls,.xlsx,.csv,.txt`)
3. พยายามเลือกไฟล์นอกรายการ เช่น `.exe`
**Expected**
file picker จำกัดชนิดไฟล์ตาม accept; ถ้าหลุดผ่านมา backend/handler ไม่บันทึกและแสดง error

---
## TC-DOC-900001 — mobile view แสดงเป็น card และ infinite scroll
> **As a** Platform Admin, **I want** a mobile-friendly card layout, **so that** I can manage files from a phone.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เปิดหน้าด้วย viewport ขนาด mobile; มีเอกสารหลายรายการเกิน 1 หน้า
**Steps**
1. ตั้ง viewport เป็นมือถือ แล้วเปิด `/system-admin/document`
2. เลื่อนลงจนสุดรายการ
**Expected**
รายการแสดงเป็น DocumentCard (ชื่อไฟล์ / ขนาด / วันที่) และโหลดเพิ่มเมื่อเลื่อนถึง sentinel (infinite scroll); ปุ่ม filter เป็น Sheet bottom

---
<sub>Authored: 2026-06-17 · documentation only</sub>
