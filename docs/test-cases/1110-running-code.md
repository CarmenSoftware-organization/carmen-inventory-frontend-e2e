# Running Code (Number Sequences) — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/running-code`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Running Code
**Frontend route:** `routes/system-admin/running-code`  •  **URL:** `/system-admin/running-code`
**Prefix:** `RUNC`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 38

> โมดูลนี้คุม running-code (number sequence) เป็น record ที่ key ด้วย `type` พร้อม `config` (JSON) และ `note`. หน้า list เป็น DataGrid คอลัมน์ Type (กดที่ค่าเพื่อเปิด dialog แก้ไข) + Note พร้อมช่องค้นหา และปุ่ม Export / Print / Init / Add. Dialog มีช่อง Type (required, max 100, ปิดแก้ตอน edit), Config ที่เป็น **ตัวแก้แบบต่อชิ้นส่วน** (preview + รายการชิ้นส่วน + ปุ่ม Add part) โดยมี JSON ดิบพับอยู่ใต้ "Advanced (JSON)" และ Note (max 256). Update ส่ง `doc_version` (optimistic concurrency).

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> 1. **เคสที่เปลี่ยนสถานะระบบจริง — ต้องคืนค่าเดิมเสมอ.** โมดูลนี้กำหนดรูปแบบเลขที่เอกสารของทั้ง BU การแก้ค่าจริงกระทบการสร้าง PR/PO/GRN/SR ฯลฯ ของสเปกอื่นทันที
>    - **TC-RUNC-300001 (Init)** เรียก `POST /api/config/{buCode}/running-codes/init` ซึ่งสร้าง/เติมชุด running code มาตรฐานของ BU ทั้งชุด — **อันตรายที่สุดในไฟล์นี้** ห้ามรันบน BU ที่มีเอกสารจริง ให้รันบน BU ทดสอบที่ยอมให้ reset ได้เท่านั้น
>    - **TC-RUNC-030002 / 030004 / 030006 (create)** ให้ใช้ `type` ที่ขึ้นต้นด้วย `e2e_` เสมอ (เช่น `e2e_runc_<uid>`) ห้ามใช้ชื่อชนกับ type จริง เช่น `purchase_request`, `good_received_note` — ถ้าชนกัน เลขที่เอกสารของโมดูลนั้นจะเปลี่ยนรูปแบบทันที และต้องลบ record ที่สร้างทิ้งท้ายเคส
>    - **TC-RUNC-040001 / 040003 / 040005 / 040006 (edit)** ถ้าจำเป็นต้องแก้ record ของจริง ให้ copy ค่า JSON เดิมจากช่อง Advanced ก่อนแก้ และ save กลับเป็นค่าเดิมท้ายเคส ทางที่ปลอดภัยกว่าคือสร้าง record `e2e_` ของตัวเองแล้วแก้บน record นั้น
>    - **TC-RUNC-050002 (delete)** ลบเฉพาะ record ที่ชุดทดสอบสร้างเอง
> 2. **แก้ไขเปิดได้ทางเดียว: คลิกค่าในคอลัมน์ Type.** เมนูจุดสามจุดท้ายแถวมีแค่ **Activity** กับ **Delete** — `useRunningCodeTable` ไม่ได้ส่ง `onEdit` ให้ `actionColumn` จึงไม่มีเมนู Edit (แค็ตตาล็อกเดิมเขียนว่า "หรือเลือก Edit" ซึ่งไม่จริงแล้ว) บน mobile กดที่ตัวการ์ดเพื่อเปิดแทน
> 3. **Config ไม่ใช่ Textarea JSON ล้วนอีกแล้ว.** ตั้งแต่ `feat(running-code): แก้รูปแบบเลขเอกสารแบบต่อชิ้นส่วน` ช่อง Config คือตัวต่อชิ้นส่วน (Fixed text / Date / Sequence / From data) ที่โชว์ preview เลขจริง ส่วน JSON ดิบและปุ่ม **Format** ย้ายไปอยู่ใต้ collapsible **"Advanced (JSON)"** ซึ่ง **พับอยู่โดยปริยาย** ทุกเคสที่ต้องยุ่งกับ JSON ต้องกางก่อน
> 4. **ข้อจำกัด/บั๊กที่พบตอนสอบทาน — บันทึกไว้ ไม่เขียนเป็นเคส** (ตามกติกา ห้ามเขียนเคสที่ยืนยันว่าฟีเจอร์ยังไม่ทำงาน)
>    - **ลบชิ้นส่วนชิ้นสุดท้ายออก** ทำให้ `serializeConfig([])` คืน `{"format":""}` ซึ่ง `parseConfig` อ่านไม่ออก (`!template.trim()` → `null`) → ตัวต่อชิ้นส่วน**หายทั้งกล่อง** เหลือข้อความ `configUnreadable` + Advanced ที่เปิดค้าง แก้ต่อได้ทาง JSON เท่านั้น ดังนั้น TC-RUNC-030008 จงใจลบแค่ชิ้นเดียวจากสาม
>    - **เลือกชนิด "From data" (token) กับชิ้นส่วนที่ยังไม่มีชื่อ token** จะ serialize เป็น `"{}"` แล้ว `TOKEN_RE` (`^\{(.+)\}$`) อ่านกลับไม่ได้ → แถวเด้งกลับเป็น "Fixed text" ที่มีข้อความ `{}` ทันที **สร้าง token ใหม่ผ่าน UI ไม่ได้** ต้องพิมพ์ใน Advanced JSON — TC-RUNC-040006 จึงเตรียม token ผ่าน JSON แล้วค่อยตรวจว่าอ่านกลับถูก
> 5. **สิทธิ์.** route อยู่ใต้ `RequireAuth` (ไม่มี token → `/login`) และ `RouteGuard` ซึ่งเช็ค **license `system_admin.running_code` ก่อน permission `system_configuration.view`** (admin ไม่ bypass license). ไม่มี permission เฉพาะของ running code — `useDeleteGate` สร้างคีย์ `system_configuration.delete` ขึ้นมาเอง ทั้งที่ `constant/permissions.ts` มีแค่ `view`/`update` เคสสิทธิ์จึงเขียนเป็นเงื่อนไขของ precondition ไม่ผูกกับ role ใด role หนึ่ง เพราะ role ↔ permission ตัวจริงอยู่ฝั่ง backend
> 6. **ข้อความที่อ้างถึงทั้งหมดมาจาก `messages/en.json`** (UI เป็นภาษาอังกฤษ) — `systemAdmin.runningCode`, `field`, `common`, `form`, `toast`, `validation`
> 7. **Section ที่ลงทะเบียนไว้ของ `RUNC` คือ 01, 03–05, 10, 20, 30 เท่านั้น** ไฟล์นี้จึงไม่มีเคส section 40/90 — เคสเฉพาะโมดูล (ตัวต่อชิ้นส่วน) ถูกจัดไว้ใน 03/04 ตามจุดที่มันเกิดจริงคือใน Add/Edit dialog

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RUNC-010001 | หน้า list Running Code โหลดสำเร็จ | High | Smoke |
| TC-RUNC-010002 | ปุ่ม Export / Print / Init Running Code / Add Running Code แสดงบน desktop | High | Smoke |
| TC-RUNC-010003 | ตารางแสดงคอลัมน์ Type และ Note โดยไม่มีคอลัมน์ Status | Medium | Functional |
| TC-RUNC-010004 | ค้นหาด้วยการกด Enter ในช่องค้นหา | Medium | Smoke |
| TC-RUNC-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-RUNC-010006 | เมนูท้ายแถวมีแค่ Activity และ Delete (ไม่มี Edit) | Medium | Functional |
| TC-RUNC-010007 | เรียงลำดับด้วยหัวคอลัมน์ Type แล้ว URL มี `sort=type:asc` | Medium | Functional |
| TC-RUNC-010008 | Badge จำนวนรายการและแถบแบ่งหน้าทำงานถูกต้อง | Low | Functional |
| TC-RUNC-010009 | บนจอ mobile หน้า list เปลี่ยนเป็นการ์ดและปุ่มรองย้ายเข้า More actions | Medium | Functional |
| TC-RUNC-030001 | เปิด Add dialog แสดง Type / ตัวต่อชิ้นส่วน Config / Note | High | Smoke |
| TC-RUNC-030002 | สร้าง running code ใหม่ด้วย JSON ใน Advanced สำเร็จ | High | CRUD |
| TC-RUNC-030003 | ปุ่ม Format จัดรูปแบบ JSON ใน Advanced | Medium | Functional |
| TC-RUNC-030004 | สร้างโดยใส่ Note เท่านั้น (Config ว่าง) สำเร็จ | Medium | CRUD |
| TC-RUNC-030005 | กด Add part ได้ชิ้นส่วนชนิด Fixed text พร้อมปุ่มจัดการ | High | Functional |
| TC-RUNC-030006 | สร้าง running code ด้วยตัวต่อชิ้นส่วน (Fixed text + Date + Sequence) | High | CRUD |
| TC-RUNC-030007 | ปุ่ม Move up / Move down สลับลำดับชิ้นส่วนและ preview เปลี่ยนตาม | Medium | Functional |
| TC-RUNC-030008 | ลบชิ้นส่วนหนึ่งชิ้นออกแล้ว preview และ JSON อัปเดต | Medium | Functional |
| TC-RUNC-030009 | ชนิด Sequence ตั้งจำนวนหลักแล้ว preview เติมศูนย์ตามที่ตั้ง | Medium | Functional |
| TC-RUNC-030010 | แก้ JSON ใน Advanced แล้วตัวต่อชิ้นส่วนอัปเดตตาม (two-way sync) | Medium | Functional |
| TC-RUNC-040001 | แก้ไข Config / Note แล้ว Save สำเร็จ | High | CRUD |
| TC-RUNC-040002 | ในโหมด edit ช่อง Type ถูกปิดไม่ให้แก้ | Medium | Functional |
| TC-RUNC-040003 | เปิด record ที่ config อ่านได้ → ตัวต่อชิ้นส่วนแสดงชิ้นส่วนที่แปลงแล้ว | High | Functional |
| TC-RUNC-040004 | config ที่ตัวช่วยอ่านไม่ออก → ขึ้นคำอธิบายและบังคับใช้ JSON | High | Functional |
| TC-RUNC-040005 | คีย์อื่นใน config ที่ไม่ได้อยู่ใน format ต้องไม่หายหลัง save | High | Functional |
| TC-RUNC-040006 | ชิ้นส่วนชนิด From data (token) แสดงผลและ preview ถูกต้อง | Medium | Functional |
| TC-RUNC-050001 | เปิด delete dialog แล้ว Cancel — แถวยังอยู่ | Medium | Functional |
| TC-RUNC-050002 | ลบ running code สำเร็จ | High | CRUD |
| TC-RUNC-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-RUNC-100002 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ เจอ Permission Denied | High | Authorization |
| TC-RUNC-100003 | เมนู Running Code ไม่โผล่ให้ผู้ใช้ที่ไม่มีสิทธิ์ | Medium | Authorization |
| TC-RUNC-200001 | บันทึกโดยไม่กรอก Type ต้องแสดง error | High | Validation |
| TC-RUNC-200002 | Config JSON ไม่ valid ต้องถูก reject ตอน submit | High | Validation |
| TC-RUNC-200003 | ความยาวสูงสุดของ Type (100) และ Note (256) | Low | Validation |
| TC-RUNC-200004 | ชิ้นส่วน Fixed text จำกัด 20 ตัวอักษร | Low | Validation |
| TC-RUNC-200005 | ช่องจำนวนหลักของ Sequence รับ 1–10 | Low | Validation |
| TC-RUNC-300001 | Init Running Code สร้างชุดเริ่มต้นสำเร็จ | High | Functional |
| TC-RUNC-300002 | Export ไฟล์ running code สำเร็จ | Medium | Functional |
| TC-RUNC-300003 | ปุ่ม Print เรียกหน้าต่างพิมพ์และซ่อนคอลัมน์ action | Low | Functional |

---
## TC-RUNC-010001 — หน้า list Running Code โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin (`admin@blueledgers.com`) active BU = `BLAVG`; BU มี license feature `system_admin.running_code`
**Steps**
1. ไปที่ `/system-admin/running-code`
**Expected**
URL คงอยู่ที่ `/system-admin/running-code`, หัวข้อ `Running Code` (h1) แสดงพร้อมคำอธิบาย "The shape of your document numbers — prefix, running number, and when it starts over." และตาราง (หรือ empty state) ปรากฏโดยไม่มี error state

---
## TC-RUNC-010002 — ปุ่ม Export / Print / Init Running Code / Add Running Code แสดงบน desktop
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code` บน viewport ขนาด desktop (`sm` ขึ้นไป)
**Steps**
1. ไปที่ `/system-admin/running-code`
2. ดูแถบปุ่มมุมขวาบนของหัวหน้า list
**Expected**
เห็นปุ่ม `Export`, `Print`, `Init Running Code` และ `Add Running Code` ครบสี่ปุ่ม; ปุ่มไอคอน `More actions` (สำหรับ mobile) ไม่แสดงบน desktop

---
## TC-RUNC-010003 — ตารางแสดงคอลัมน์ Type และ Note โดยไม่มีคอลัมน์ Status
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; อยู่ที่ list บน desktop
**Steps**
1. ดูหัวตารางและแถวข้อมูลแถวแรก
**Expected**
หัวตารางมี checkbox เลือกแถว, คอลัมน์ลำดับ, `Type`, `Note` และคอลัมน์ action ท้ายแถว; **ไม่มีคอลัมน์ Status** (`hideStatus: true`); ค่าในคอลัมน์ Type เป็นปุ่มลิงก์ (`CellAction`) กดได้; แถวที่ไม่มี note แสดง `-`

---
## TC-RUNC-010004 — ค้นหาด้วยการกด Enter ในช่องค้นหา
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code` และมี running code อย่างน้อย 1 รายการ
**Steps**
1. พิมพ์บางส่วนของ `type` ที่มีอยู่จริงลงในช่องค้นหา (placeholder `Search...`)
2. กด Enter
**Expected**
`SearchInput` ยิง `onSearch` เฉพาะตอนกด Enter (หรือกดปุ่มแว่นขยาย) — URL ได้ query `search=<คำค้น>` และตารางแสดงเฉพาะแถวที่ตรง; ปุ่มท้ายช่องเปลี่ยนเป็น `Clear search` เมื่อมีข้อความ

---
## TC-RUNC-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/running-code`
**Steps**
1. พิมพ์คำที่ไม่มีจริง เช่น `__NOPE__zzz` แล้วกด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง `EmptyComponent` ที่มีข้อความ `No data found`; ไม่มี error state

---
## TC-RUNC-010006 — เมนูท้ายแถวมีแค่ Activity และ Delete (ไม่มี Edit)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; ล็อกอินเป็น Admin
**Steps**
1. กดปุ่ม `Row actions` (จุดสามจุด) ท้ายแถวแรก
2. อ่านรายการเมนู
3. เลือก `Activity`
**Expected**
เมนูมีเพียง `Activity` และ `Delete` (destructive) — **ไม่มีเมนู `Edit`** เพราะตารางไม่ได้ส่ง `onEdit` เข้า `actionColumn`; เมื่อเลือก `Activity` เมนูปิดแล้ว Activity sheet เปิดขึ้นโดยมีหัวข้อ `Activity` และอ้างถึง `type` ของแถวนั้น

---
## TC-RUNC-010007 — เรียงลำดับด้วยหัวคอลัมน์ Type แล้ว URL มี `sort=type:asc`
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 2 รายการ; อยู่ที่ list บน desktop
**Steps**
1. คลิกหัวคอลัมน์ `Type`
2. คลิกซ้ำอีกครั้ง
**Expected**
คลิกแรก URL ได้ `sort=type:asc` และไอคอนลูกศรขึ้น; คลิกที่สอง `sort=type:desc` และไอคอนลูกศรลง; การเรียงเป็น server-side (`manualSorting`) และ `page` ถูก reset กลับหน้า 1 ทุกครั้งที่เปลี่ยนการเรียง

---
## TC-RUNC-010008 — Badge จำนวนรายการและแถบแบ่งหน้าทำงานถูกต้อง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี running code มากกว่า 1 หน้า (ค่าเริ่มต้น 10 รายการ/หน้า)
**Steps**
1. ดู badge ตัวเลขข้างหัวข้อ `Running Code`
2. เปลี่ยนจำนวนรายการต่อหน้าที่แถบล่างของตาราง
3. กดไปหน้าถัดไป
**Expected**
badge แสดงจำนวน record ทั้งหมด (แสดงเฉพาะเมื่อมากกว่า 0); การเปลี่ยนจำนวนต่อหน้าเขียน `perpage=` ลง URL และการเปลี่ยนหน้าเขียน `page=` ลง URL พร้อมโหลดข้อมูลชุดใหม่

---
## TC-RUNC-010009 — บนจอ mobile หน้า list เปลี่ยนเป็นการ์ดและปุ่มรองย้ายเข้า More actions
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; ตั้ง viewport เป็นขนาด mobile
**Steps**
1. ไปที่ `/system-admin/running-code` ด้วย viewport mobile
2. กดปุ่มไอคอน `More actions`
3. กดที่ตัวการ์ดของ running code ใบแรก
**Expected**
รายการแสดงเป็นการ์ด (`ListCard`) ที่มี `type` เป็นหัวการ์ดและแถว `Note` เมื่อมี note; ปุ่ม `Add Running Code` ยังอยู่ ส่วน `Init Running Code` / `Export` / `Print` ย้ายเข้าเมนู `More actions`; กดการ์ดแล้ว Edit dialog เปิด

---
## TC-RUNC-030001 — เปิด Add dialog แสดง Type / ตัวต่อชิ้นส่วน Config / Note
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/running-code`
**Steps**
1. กดปุ่ม `Add Running Code`
**Expected**
Dialog หัวข้อ `Add Running Code` เปิดขึ้น ประกอบด้วย: ช่อง `Type` (required, placeholder `e.g. purchase_request`), ส่วน `Config` ที่มีกล่อง preview หัวข้อ "Document numbers will look like this" (ค่าเริ่มต้นแสดง `—`) + ปุ่ม `Add part` + collapsible `Advanced (JSON)` ที่ **พับอยู่**, ช่อง `Note` (placeholder `Optional note`) และปุ่ม `Cancel` / `Create`

---
## TC-RUNC-030002 — สร้าง running code ใหม่ด้วย JSON ใน Advanced สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/running-code`; ใช้ `type` ทดสอบที่ยังไม่มีในระบบและขึ้นต้นด้วย `e2e_` (ดูหมายเหตุข้อ 1)
**Steps**
1. กด `Add Running Code`
2. กรอก Type เป็น `e2e_runc_<uid>`
3. กางส่วน `Advanced (JSON)`
4. พิมพ์ลงช่อง JSON ว่า `{"A":"E2E","B":"running(4, '0')","format":"{A}{B}"}`
5. กด `Create`
**Expected**
toast `Running Code created successfully` ปรากฏ, dialog ปิด, และ record ใหม่โผล่ในตาราง (ค้นหาด้วย type ที่สร้างแล้วเจอ)
**Cleanup**
ลบ record ที่สร้างทิ้งท้ายเคส

---
## TC-RUNC-030003 — ปุ่ม Format จัดรูปแบบ JSON ใน Advanced
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด Add dialog อยู่
**Steps**
1. กางส่วน `Advanced (JSON)`
2. พิมพ์ JSON บรรทัดเดียว `{"A":"E2E","format":"{A}"}` ลงช่อง JSON
3. กดปุ่ม `Format`
4. แก้ JSON ให้พัง เช่น `{A: E2E` แล้วกด `Format` ซ้ำ
**Expected**
ขั้นที่ 3: ค่าถูกจัดรูปแบบเป็น JSON หลายบรรทัด (indent 2) และ error เดิมของช่อง Config (ถ้ามี) หายไปทันทีเพราะ `shouldValidate`; ขั้นที่ 4: ขึ้น toast แบบ **warning** ข้อความ `Config must be valid JSON` โดยค่าในช่องไม่ถูกเปลี่ยน

---
## TC-RUNC-030004 — สร้างโดยใส่ Note เท่านั้น (Config ว่าง)
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/running-code`; `type` ใหม่ขึ้นต้นด้วย `e2e_`
**Steps**
1. กด `Add Running Code`
2. กรอก Type และ Note โดยไม่แตะส่วน Config เลย
3. กด `Create`
**Expected**
สร้างสำเร็จ — toast `Running Code created successfully`, dialog ปิด; payload ส่ง `config` เป็น `{}` เพราะค่าในช่อง config ว่าง
**Cleanup**
ลบ record ที่สร้างทิ้งท้ายเคส

---
## TC-RUNC-030005 — กด Add part ได้ชิ้นส่วนชนิด Fixed text พร้อมปุ่มจัดการ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิด Add dialog อยู่ (Config ยังว่าง)
**Steps**
1. กดปุ่ม `Add part`
2. ดูแถวชิ้นส่วนที่เพิ่มขึ้นมา
3. เปิด dropdown ชนิดของชิ้นส่วน
**Expected**
ได้ชิ้นส่วน 1 แถว ชนิดเริ่มต้น `Fixed text` พร้อมช่องข้อความ (placeholder `e.g. GRN`) และปุ่ม `Move up` / `Move down` / `Delete` ท้ายแถว; dropdown ชนิดมีให้เลือก 4 ค่า: `Fixed text`, `Date`, `Sequence`, `From data`; ปุ่ม `Move up` ถูก disable เพราะเป็นชิ้นแรก

---
## TC-RUNC-030006 — สร้าง running code ด้วยตัวต่อชิ้นส่วน (Fixed text + Date + Sequence)
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เปิด Add dialog อยู่; ใช้ `type` ทดสอบขึ้นต้นด้วย `e2e_`
**Steps**
1. กรอก Type เป็น `e2e_runc_<uid>`
2. กด `Add part` แล้วพิมพ์ `E2E` ในชิ้นส่วน Fixed text
3. กด `Add part` ชิ้นที่สอง เปลี่ยนชนิดเป็น `Date` แล้วเลือกรูปแบบ `yyMM`
4. กด `Add part` ชิ้นที่สาม เปลี่ยนชนิดเป็น `Sequence` และตั้งจำนวนหลักเป็น 5
5. อ่านค่าในกล่อง preview แล้วกางส่วน `Advanced (JSON)` เพื่อดู JSON ที่ถูกสร้าง
6. กด `Create`
**Expected**
preview แสดงเลขตัวอย่างรูปแบบ `E2E` + ปี-เดือนของวันนี้ 4 หลัก + `00001` (เช่น `E2E260900001`); JSON ในช่อง Advanced เป็น `{"A":"E2E","B":"date('yyMM')","C":"running(5, '0')","format":"{A}{B}{C}"}` (จัดบรรทัดแล้ว); ตัวเลือกรูปแบบวันที่มีให้เลือก `yyMM`, `yyyyMM`, `yy`, `yyyy`, `yyMMdd`, `yyyyMMdd` พร้อมตัวอย่างวันที่วันนี้ข้างชื่อรูปแบบ; กด Create แล้วได้ toast `Running Code created successfully`
**Cleanup**
ลบ record ที่สร้างทิ้งท้ายเคส

---
## TC-RUNC-030007 — ปุ่ม Move up / Move down สลับลำดับชิ้นส่วนและ preview เปลี่ยนตาม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ใน Add dialog มีชิ้นส่วนสามชิ้นตามลำดับ Fixed text `E2E` → Date `yyMM` → Sequence 5 หลัก (ทำตาม TC-RUNC-030006 ขั้น 1–4 โดยยังไม่กด Create)
**Steps**
1. จำค่าใน preview ไว้
2. กด `Move down` ที่ชิ้นแรก
3. ดู preview และ JSON ใน `Advanced (JSON)`
**Expected**
ลำดับชิ้นส่วนสลับเป็น Date → Fixed text → Sequence; preview เปลี่ยนเป็นปี-เดือนนำหน้า `E2E` (เช่น `2609E2E00001`); JSON ถูกไล่ชื่อช่องใหม่ตามตำแหน่ง — `A` กลายเป็น `date('yyMM')`, `B` เป็น `E2E`, `format` ยังเป็น `{A}{B}{C}`; ปุ่ม `Move up` ของชิ้นแรกและ `Move down` ของชิ้นสุดท้าย disable เสมอ

---
## TC-RUNC-030008 — ลบชิ้นส่วนหนึ่งชิ้นออกแล้ว preview และ JSON อัปเดต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ใน Add dialog มีชิ้นส่วนสามชิ้น (Fixed text + Date + Sequence) — **เหลืออย่างน้อยหนึ่งชิ้นเสมอหลังลบ** (ดูหมายเหตุข้อ 4)
**Steps**
1. กดปุ่ม `Delete` (ไอคอน X) ที่ชิ้นส่วน `Date`
2. ดู preview และ JSON ใน `Advanced (JSON)`
**Expected**
เหลือสองชิ้นส่วน (Fixed text + Sequence); preview ตัดส่วนวันที่ออก (เช่น `E2E00001`); JSON กลายเป็น `{"A":"E2E","B":"running(5, '0')","format":"{A}{B}"}`

---
## TC-RUNC-030009 — ชนิด Sequence ตั้งจำนวนหลักแล้ว preview เติมศูนย์ตามที่ตั้ง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ใน Add dialog มีชิ้นส่วนชนิด `Sequence` อย่างน้อยหนึ่งชิ้น
**Steps**
1. ตั้งจำนวนหลัก (`digits`) เป็น 3
2. ดู preview
3. เปลี่ยนจำนวนหลักเป็น 6
**Expected**
preview แสดง `001` เมื่อตั้ง 3 หลัก และ `000001` เมื่อตั้ง 6 หลัก (ตัวอย่างใช้ลำดับที่ 1 เสมอ); JSON ในส่วน Advanced เปลี่ยนเป็น `running(3, '0')` และ `running(6, '0')` ตามลำดับ

---
## TC-RUNC-030010 — แก้ JSON ใน Advanced แล้วตัวต่อชิ้นส่วนอัปเดตตาม (two-way sync)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด Add dialog อยู่
**Steps**
1. กางส่วน `Advanced (JSON)`
2. วาง JSON `{"A":"E2E","B":"date('yyyyMMdd')","format":"{A}{B}"}`
3. เลื่อนขึ้นไปดูกล่อง preview และรายการชิ้นส่วน
**Expected**
ตัวต่อชิ้นส่วนด้านบนแสดงสองแถวทันทีโดยไม่ต้อง submit — แถวแรกชนิด `Fixed text` ค่า `E2E`, แถวที่สองชนิด `Date` รูปแบบ `yyyyMMdd`; preview แสดง `E2E` ต่อด้วยวันที่ของวันนี้แบบ 8 หลัก; ทั้งสองทางอ่าน/เขียนค่าเดียวกัน แก้ทางไหนอีกทางเห็นทันที

---
## TC-RUNC-040001 — แก้ไข Config / Note แล้ว Save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี running code ที่ชุดทดสอบสร้างเอง (จาก TC-RUNC-030002 หรือ 030006) — ดูหมายเหตุข้อ 1 ก่อนแก้ record ของจริง
**Steps**
1. คลิกที่ค่าในคอลัมน์ `Type` ของ record นั้นเพื่อเปิด dialog
2. แก้ Note และแก้ชิ้นส่วนใน Config หนึ่งจุด
3. กด `Save`
**Expected**
หัวข้อ dialog เป็น `Edit Running Code`; ปุ่มแสดง `Saving...` ระหว่างรอ; สำเร็จแล้วได้ toast `Running Code updated successfully` และ dialog ปิด; request ที่ส่งมี `doc_version` ของ record ที่โหลดมา (optimistic concurrency) — ขาด `doc_version` backend จะตอบ 400

---
## TC-RUNC-040002 — ในโหมด edit ช่อง Type ถูกปิดไม่ให้แก้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ
**Steps**
1. คลิกค่าในคอลัมน์ `Type` เพื่อเปิด Edit dialog
2. พยายามพิมพ์ทับในช่อง `Type`
**Expected**
ช่อง Type อยู่ในสถานะ `disabled` และ `readOnly` พร้อมกัน — โฟกัส/พิมพ์ไม่ได้ ค่าเดิมยังแสดงอยู่ (type คือ key ของ record); ช่อง Config และ Note ยังแก้ได้ตามปกติ

---
## TC-RUNC-040003 — เปิด record ที่ config อ่านได้ → ตัวต่อชิ้นส่วนแสดงชิ้นส่วนที่แปลงแล้ว
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี running code ที่ config เป็น `{"A":"E2E","B":"date('yyMM')","C":"running(5, '0')","format":"{A}{B}{C}"}` (สร้างเองไว้ก่อน)
**Steps**
1. คลิกค่าในคอลัมน์ Type ของ record นั้น
2. ดูส่วน Config โดยยังไม่กางอะไร
**Expected**
ตัวต่อชิ้นส่วนแสดงสามแถวตามลำดับ `Fixed text` (`E2E`) → `Date` (`yyMM`) → `Sequence` (5 หลัก); preview แสดงเลขตัวอย่างเต็มรูปแบบ; collapsible `Advanced (JSON)` **พับอยู่** และกดกางได้ (ไม่ disabled); ไม่มีข้อความ "This format is not supported by the editor"

---
## TC-RUNC-040004 — config ที่ตัวช่วยอ่านไม่ออก → ขึ้นคำอธิบายและบังคับใช้ JSON
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิด Add หรือ Edit dialog อยู่
**Steps**
1. กางส่วน `Advanced (JSON)`
2. วาง config ที่ parser อ่านไม่ออก เช่น `{"A":"E2E"}` (ไม่มี `format`) หรือ `{"format":"FIXED"}` (ไม่มีช่อง `{...}` เลย)
3. ดูส่วน Config ทั้งก้อน
**Expected**
ตัวต่อชิ้นส่วนและกล่อง preview **หายไปทั้งหมด**; ขึ้นข้อความ `This format is not supported by the editor — edit it as JSON below.`; collapsible `Advanced (JSON)` ถูกเปิดค้างและปุ่มพับ/กางถูก disable (แก้ได้ทาง JSON ทางเดียว); ค่าที่วางไว้ยังอยู่ครบ ไม่ถูกเขียนทับ

---
## TC-RUNC-040005 — คีย์อื่นใน config ที่ไม่ได้อยู่ใน format ต้องไม่หายหลัง save
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี running code ทดสอบที่ config เป็น `{"A":"E2E","format":"{A}","reset_period":"month"}`
**Steps**
1. เปิด Edit dialog ของ record นั้น
2. แก้ข้อความของชิ้นส่วน Fixed text จาก `E2E` เป็น `E2EX` ผ่านตัวต่อชิ้นส่วน
3. กางส่วน `Advanced (JSON)` เพื่อดู JSON ที่จะถูกส่ง
4. กด `Save` แล้วเปิด record ขึ้นมาใหม่
**Expected**
JSON ยังมีคีย์ `reset_period: "month"` อยู่ครบ (ถูกเก็บไว้ใน `extra` แล้วเขียนกลับตอน serialize) — ตัวต่อชิ้นส่วนต้องไม่กลืนคีย์ที่มันไม่รู้จักหายไป; หลัง save และเปิดใหม่ คีย์นั้นยังอยู่

---
## TC-RUNC-040006 — ชิ้นส่วนชนิด From data (token) แสดงผลและ preview ถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด Add หรือ Edit dialog อยู่ — token **ต้องเตรียมผ่านช่อง JSON** (ดูหมายเหตุข้อ 4)
**Steps**
1. กางส่วน `Advanced (JSON)`
2. วาง `{"A":"{PRODUCT-SUB-CAT}","B":"running(2, '0')","format":"{A}{B}"}`
3. ดูรายการชิ้นส่วนและกล่อง preview
**Expected**
แถวแรกแสดงชนิด `From data` พร้อมช่องชื่อ token ที่มีค่า `PRODUCT-SUB-CAT` (placeholder `e.g. PRODUCT-SUB-CAT`), แถวที่สองเป็น `Sequence` 2 หลัก; preview แสดง `‹PRODUCT-SUB-CAT›01` — ค่าจริงจะถูกแทนตอนออกเอกสาร ตัวอย่างจึงโชว์ชื่อค่าไว้ในวงเล็บแหลม

---
## TC-RUNC-050001 — เปิด delete dialog แล้ว Cancel — แถวยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ
**Steps**
1. กด `Row actions` ท้ายแถว แล้วเลือก `Delete`
2. ใน dialog กด Cancel
**Expected**
Dialog หัวข้อ `Delete Running Code` เปิดพร้อมข้อความ `Are you sure you want to delete running code "<type>"? This action cannot be undone.`; กด Cancel แล้ว dialog ปิดและแถวยังอยู่ในตารางเหมือนเดิม

---
## TC-RUNC-050002 — ลบ running code สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี running code ที่ **ชุดทดสอบสร้างเอง** (type ขึ้นต้นด้วย `e2e_`) — ห้ามลบ type ของจริง
**Steps**
1. ค้นหา record ทดสอบนั้น
2. กด `Row actions` → `Delete`
3. ยืนยันการลบใน dialog
**Expected**
toast `Running Code deleted successfully` ปรากฏ, dialog ปิด และ record หายจากตาราง; ระหว่างรอผล dialog ปิดเองไม่ได้ (`isPending`)

---
## TC-RUNC-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน (ไม่มี token ใน token store)
**Steps**
1. เปิด `/system-admin/running-code` โดยตรง
**Expected**
`RequireAuth` เด้งไป `/login` (replace) โดยไม่เห็นเนื้อหา Running Code เลย; path เดิมถูกเก็บไว้ใน navigation state (`from`)

---
## TC-RUNC-100002 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ เจอ Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยผู้ใช้ที่ **ไม่ใช่ admin และไม่มี permission `system_configuration.view`** บน BU ปัจจุบัน (ยืนยันสิทธิ์จริงกับ backend ก่อนเลือก role — ดูหมายเหตุข้อ 5)
**Steps**
1. เปิด `/system-admin/running-code` โดยตรง
**Expected**
`RouteGuard` แสดงกล่อง `Permission Denied` (`role="alert"`) พร้อมข้อความ "You don't have permission to view this page." และบรรทัดติดต่อผู้ดูแลระบบ + ปุ่มพาไปหน้าที่เข้าได้; ไม่เห็นตาราง ไม่เห็นปุ่ม Add / Init

---
## TC-RUNC-100003 — เมนู Running Code ไม่โผล่ให้ผู้ใช้ที่ไม่มีสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยผู้ใช้เดียวกับ TC-RUNC-100002
**Steps**
1. เปิด module launcher / sidebar ของกลุ่ม System Admin
2. หารายการ `Running Code`
**Expected**
ไม่มีรายการ `Running Code` ในเมนู (`moduleList` กรองด้วย `permission: system_configuration.view` และ license feature `system_admin.running_code`); สำหรับ Admin ที่มีสิทธิ์ รายการนี้ต้องแสดงและกดแล้วไปที่ `/system-admin/running-code`

---
## TC-RUNC-200001 — บันทึกโดยไม่กรอก Type ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด Add dialog อยู่
**Steps**
1. ปล่อยช่อง Type ว่าง
2. กด `Create`
**Expected**
ช่อง Type ขึ้นสถานะ invalid พร้อมข้อความ `Type is required` (zod `type.min(1)`); dialog ไม่ปิดและไม่มี request ถูกส่ง

---
## TC-RUNC-200002 — Config JSON ไม่ valid ต้องถูก reject ตอน submit
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด Add dialog อยู่
**Steps**
1. กรอก Type ที่ถูกต้อง
2. กางส่วน `Advanced (JSON)` แล้วพิมพ์ JSON ผิดรูป เช่น `{prefix: PR`
3. กด `Create`
**Expected**
ช่อง Config ขึ้น `FieldError` ข้อความ `Config must be valid JSON` (zod refine ที่เรียก `JSON.parse`) และไม่มีการ submit; ระหว่างที่ JSON ยังพัง ตัวต่อชิ้นส่วนจะไม่แสดงและ `Advanced (JSON)` ถูกเปิดค้าง

---
## TC-RUNC-200003 — ความยาวสูงสุดของ Type (100) และ Note (256)
**Priority:** Low · **Test Type:** Validation
**Preconditions**
เปิด Add dialog อยู่
**Steps**
1. พยายามพิมพ์ Type ยาวเกิน 100 ตัวอักษร
2. พยายามพิมพ์ Note ยาวเกิน 256 ตัวอักษร
**Expected**
ช่อง Type รับได้ไม่เกิน 100 ตัวอักษร (`maxLength=100`) และ Note ไม่เกิน 256 (`maxLength=256`) — ตัวเกินถูกตัดทิ้งที่ระดับ input โดยไม่มีข้อความ error; **ช่อง JSON ของ Config ไม่มี `maxLength` แล้ว** (ของเดิมเคยจำกัด 256) จึงรับ JSON ยาวเท่าที่ backend ยอม

---
## TC-RUNC-200004 — ชิ้นส่วน Fixed text จำกัด 20 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
ใน dialog มีชิ้นส่วนชนิด `Fixed text` อย่างน้อยหนึ่งชิ้น
**Steps**
1. พิมพ์ข้อความยาวเกิน 20 ตัวอักษรลงในช่องของชิ้นส่วนนั้น
**Expected**
ช่องรับได้ไม่เกิน 20 ตัวอักษร (`maxLength=20`); ค่าที่ถูกตัดแล้วคือค่าที่ไปโผล่ทั้งใน preview และใน JSON ของ Advanced

---
## TC-RUNC-200005 — ช่องจำนวนหลักของ Sequence รับ 1–10
**Priority:** Low · **Test Type:** Validation
**Preconditions**
ใน dialog มีชิ้นส่วนชนิด `Sequence` อย่างน้อยหนึ่งชิ้น
**Steps**
1. ดู attribute ของช่องจำนวนหลัก (`digits`)
2. ล้างค่าในช่องให้ว่าง
**Expected**
ช่องเป็น `type="number"` ที่กำหนด `min=1` และ `max=10` พร้อมป้ายกำกับ `digits`; เมื่อค่าที่กรอกแปลงเป็นตัวเลขไม่ได้ ระบบใช้ 1 แทน (`Number(value) || 1`) — preview ไม่เคยค้างเป็นค่าว่าง

---
## TC-RUNC-300001 — Init Running Code สร้างชุดเริ่มต้นสำเร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/running-code` ด้วย Admin; **ต้องเป็น BU ทดสอบที่ยอมให้ reset running code ได้** — เคสนี้เปลี่ยนสถานะระบบจริง (ดูหมายเหตุข้อ 1)
**Steps**
1. กดปุ่ม `Init Running Code`
2. รอผล
**Expected**
ระหว่างทำงานปุ่มเปลี่ยนเป็น `Initializing...` และถูก disable; เมื่อสำเร็จได้ toast `Running code initialized successfully` และรายการ running code มาตรฐานปรากฏในตาราง (query ถูก invalidate ให้โหลดใหม่เอง); endpoint ที่เรียกคือ `POST /api/proxy/api/config/{buCode}/running-codes/init`

---
## TC-RUNC-300002 — Export ไฟล์ running code สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; อยู่บน desktop
**Steps**
1. กดปุ่ม `Export`
2. รอไฟล์
**Expected**
ระหว่างทำงานปุ่มแสดง `Exporting...` พร้อมไอคอนหมุนและถูก disable; ได้ไฟล์ `.xlsx` ชื่อขึ้นต้น `running-code` ชีตชื่อ `Running Codes` ที่มีคอลัมน์ `Type` / `Note` / `Config` (Config เป็น JSON string); toast `Exported {n} records`; ถ้าไม่มีข้อมูลเลยจะได้ toast แบบ warning `No data to export` แทนและไม่มีไฟล์

---
## TC-RUNC-300003 — ปุ่ม Print เรียกหน้าต่างพิมพ์และซ่อนคอลัมน์ action
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี running code อย่างน้อย 1 รายการ; อยู่บน desktop
**Steps**
1. ดัก `window.print` ไว้ก่อน
2. กดปุ่ม `Print`
**Expected**
`globalThis.print()` ถูกเรียกหนึ่งครั้ง; ใน print media คอลัมน์ action ท้ายแถวถูกซ่อน (`print:hidden`) ส่วนคอลัมน์ Type และ Note ยังพิมพ์ออกมา

---
<sub>Authored: 2026-06-17 · Revised: 2026-09-20 (สอบทานกับ `routes/system-admin/running-code` หลัง 17 คอมมิต) · documentation only</sub>
