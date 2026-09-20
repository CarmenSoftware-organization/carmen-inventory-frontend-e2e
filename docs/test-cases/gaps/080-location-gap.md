# Store Location — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/080-location.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/080-location.md`_

**Module:** Config — Store Location (คลังสินค้า)
**Frontend route:** `routes/config/location` (สามหน้า: `location.route.tsx` → list, `location-new.route.tsx` → `/new`, `location-edit.route.tsx` → `/:id`)  •  **URL:** `/config/location`, `/config/location/new`, `/config/location/:id`
**Prefix:** `LOC`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/080-location.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 45

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/080-location.spec.ts` ถือ ID `TC-LOC-010001..010005`, `030001..030003`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addPageFormSecurityCases` (`tests/helpers/security-cases.ts`) ถือ `TC-LOC-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, สร้าง-แก้ชื่อ-ลบครบรอบ, สร้างครบทั้งสาม `location_type` (Inventory / Direct / Consignment), toggle `is_active` แล้ว persist, ยกเลิกการแก้ไขแล้วค่าไม่ถูกบันทึก, ยกเลิกการลบแล้ว record ยังอยู่, code ซ้ำถูก reject, บันทึกโดยไม่กรอก code/name, ล้าง code/name ตอนแก้ไข, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 2. **Section ที่ใช้ได้มีแค่ `01, 03–05, 10, 20`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `080-location.spec.ts` ไว้เท่านี้ และ**เอกสารนี้ไม่ได้แก้ scheme** เคสที่ปกติจะอยู่บล็อกอื่นจึงถูกจัดเข้าบล็อกใกล้เคียงดังนี้:
>    - **หน้ารายละเอียด / deep link / navigation guard** (ปกติบล็อก **02** Detail/View) → จัดไว้บล็อก **04** เพราะหน้า `/:id` คือทางเข้าเดียวของการแก้ไข (เปิดมาโหมด view แล้วกด Edit)
>    - **Export และ edge ของหน้า list** (ปกติบล็อก **30** / **90**) → จัดไว้บล็อก **01** เพราะเป็นพฤติกรรมของแถบเครื่องมือหน้า list
>    - **การลบคลังที่ถูกโมดูลอื่นอ้างอยู่** (ปกติบล็อก **30** Integration) → จัดไว้บล็อก **05**
>    ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `02`/`30`/`90` ลงในแถวของ `080-location.spec.ts` ใน scheme ก่อน
>
> 3. **โมดูลนี้เป็นหน้าเต็ม ไม่ใช่ dialog** — `routes/router.tsx:149-158` ประกาศสามเส้นทาง (`location`, `location/new`, `location/:id`) `useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่โหลดหน้า `/:id` ใหม่ (โหมด view ไม่ render `<input>` เลย ค่าออกมาเป็น `<span data-slot="field-plain-text">`) เคสในเอกสารนี้จึงมีเรื่องที่ dialog-based module ไม่มี: navigation guard, ปลายทางหลังบันทึก, deep link และการจัดการรายการย่อยภายในหน้า
>
> 4. **ฟิลด์ที่มีจริงในฟอร์ม** (ยืนยันจาก `location-form-schema.ts` + `location-form.tsx`): `code` (บังคับ, `maxLength=10`, placeholder `e.g. M123D`), `name` (บังคับ, `maxLength=100`, placeholder `e.g. BAR Main`), `location_type` (บังคับ, select 3 ค่า — `inventory` / `direct` / `consignment` จาก `constant/location.ts`), `physical_count_type` (บังคับ, select `yes` / `no`), `delivery_point_id` (**บังคับ** — lookup combobox ไม่ใช่ select), `description` (`maxLength=256`, textarea 2 แถว), `is_active` (switch `#location-is-active`) **บวกสอง section ย่อยในหน้าเดียวกัน**: *Location Users* (`Transfer` สองคอลัมน์ในโหมด add/edit, `UserTable` ในโหมด view) และ *Products* (`TreeProductLookup` แบบ tree category → sub-category → item group → product ในโหมด add/edit, `ProductTable` ในโหมด view) ทั้งคู่ส่ง payload รูป `{ add: [{id}], remove: [{id}] }`
>
> 5. **⛔ BLOCKER — การลบคลังกระทบโมดูลอื่นที่อ้างคลังอยู่** คลังถูกอ้างจากอย่างน้อยเจ็ดจุดในแอป:
>    - `routes/product-management/product/pd-tab-locations.tsx` — แท็บผูกคลังของสินค้า (`min_qty`/`max_qty`/`re_order_qty`/`par_qty` ต่อคลัง) และ `product_location` ที่ฝั่ง location ก็ถือรายการเดียวกัน
>    - `routes/system-admin/user/user-assigned-locations.tsx` — คลังที่ผูกกับผู้ใช้ ซึ่งเป็นข้อมูลชุดเดียวกับ *Location Users* ในหน้านี้ (`user_location`)
>    - `routes/inventory-management/spot-check/` — `sc-general-fields.tsx` และ route `spot-check/location/:location_id` (`routes/router.tsx:337`)
>    - `routes/store-operation/stock-replenishment/` — `stock-repl-location.tsx`, `stock-repl-sr-wizard.tsx`
>    - `routes/inventory-management/inventory-adjustment/ia-doc-info.tsx` — `location_id` บังคับ (ผ่าน `LookupUserLocation`)
>    - `routes/inventory-management/transaction/transaction-component.tsx`, `routes/store-operation/store-requisition/sr-filter-{from,to}-location.tsx`
>    - `location-cell.tsx` ของ PR / PO / GRN / CN (คลังระดับบรรทัดสินค้า)
>
>    **ฝั่ง frontend ไม่มีการตรวจก่อนลบเลย** — `useDeleteLocation` มาจาก `createConfigCrud` ยิง `DELETE` ตรง ๆ ถ้า backend ปฏิเสธ ผู้ใช้จะเห็นเป็น toast ผิดพลาด (`errorMessage: "Failed to delete location"` ใน `hooks/use-config-crud.ts`) ไม่ใช่ข้อความเฉพาะเรื่อง **ยังไม่ได้ยืนยันว่า backend มี FK guard หรือไม่** — ต้องถามทีม backend ก่อนรัน `TC-LOC-050007` และเคสนั้นจึง assert เฉพาะสิ่งที่ UI แสดงจริง ไม่ได้ assert ว่าลบได้หรือลบไม่ได้ · **ผลพลอยได้ที่ทุกเคสต้องทำตาม: ห้ามลบคลังที่ seed ไว้หรือคลังที่โมดูลอื่นใช้อยู่** ทุกเคสที่ต้องลบต้องสร้างคลังของตัวเองก่อน
>
> 6. **แก้เฉพาะ Users/Products ไม่ทำให้ฟอร์ม dirty** — `transferHandler` (`lib/transfer-handler.ts`) และ `form.setValue("products", …)` เรียก `setValue` โดยไม่ส่ง `shouldDirty` และ `LocationForm` ก็ไม่ได้ส่ง `extraDirty` ให้ `useEntityForm` ผลคือ `formState.isDirty` ยังเป็น `false` → `DiscardDialog` และ `useNavigationGuard` **ไม่ทำงาน**ถ้าผู้ใช้แก้แค่สอง section นี้ บันทึกไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส (เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นบั๊ก) — `TC-LOC-040010` / `TC-LOC-040011` จึง assert เฉพาะว่ากด Save แล้วค่าคงอยู่จริง และ `TC-LOC-040012` / `TC-LOC-040013` ใช้การแก้ช่องในฟอร์มหลักเป็นตัวทำให้ dirty
>
> 7. **หน้านี้ไม่มี default sort** — `location-component.tsx` ไม่ส่ง `defaultSort` ให้ `ConfigListTemplate` ต่างจาก `083-shelf.md` ที่เรียงตาม `code:asc` ตั้งแต่ต้น เคส `TC-LOC-010011` จึงเช็คว่าเข้าหน้าครั้งแรกไม่มีพารามิเตอร์ `sort`
>
> 8. **ตัวกรองของหน้านี้มีสามชุด ไม่ใช่ชุดเดียว** — `location-filter-fields.ts` ประกาศ `filter` (status), `location_type` (multi-select 3 ค่า) และ `physical_count_type` (multi-select 2 ค่า) สองตัวหลังเป็นของเฉพาะโมดูลนี้ ไม่มีใน shelf
>
> 9. **ป้ายกำกับที่ต้องใช้ตรงตัว** (จาก `messages/en.json`): ชื่อหน้า/entity = `Store Location`, ปุ่มเพิ่ม = `Add Store Location`, หัวข้อลบ = `Delete Store Location`, เมนู sidebar = `Store Location`, toast = `Store Location created/updated/deleted successfully`, หัวข้อ dialog ทิ้งการแก้ไข = `Discard changes?` พร้อมปุ่ม `Keep editing` / `Discard`
>
> 10. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-LOC-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-LOC-010007 | ค้นหายิงเมื่อกด Enter ไหลลง query string และล้างด้วยปุ่มกากบาท | Medium | Functional |
| TC-LOC-010008 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-LOC-010009 | กรองตามประเภทคลังและการตรวจนับสินค้าแบบเลือกหลายค่า | High | Functional |
| TC-LOC-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-LOC-010011 | เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default | Medium | Functional |
| TC-LOC-010012 | สลับมุมมองตาราง / การ์ด และเปิดรายละเอียดจากการ์ด | Medium | Functional |
| TC-LOC-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-LOC-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-LOC-010015 | ส่งออกรายการคลังเป็น XLSX และกดส่งออกขณะไม่มีข้อมูล | Medium | Functional |
| TC-LOC-010016 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-LOC-010017 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-LOC-010018 | เปิดหน้ารายละเอียดจากคอลัมน์ Code และคอลัมน์ Name | Medium | Happy Path |
| TC-LOC-030004 | หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new | Low | Functional |
| TC-LOC-030005 | สร้างสำเร็จแล้วแทนที่ URL เป็นหน้ารายละเอียด ไม่กลับหน้า list | High | Happy Path |
| TC-LOC-030006 | สร้างคลังพร้อม Description และ Physical Count = No | Medium | Happy Path |
| TC-LOC-030007 | สร้างคลังพร้อมผูกผู้ใช้ผ่านกล่อง Transfer | Medium | Happy Path |
| TC-LOC-030008 | สร้างคลังพร้อมผูกสินค้าผ่าน Product Catalog | Medium | Happy Path |
| TC-LOC-030009 | ยกเลิกการสร้างขณะฟอร์มมีข้อมูลค้าง | Medium | Alternate Flow |
| TC-LOC-030010 | lookup Delivery Point ค้นหาได้และแสดงเฉพาะจุดส่งที่เปิดใช้งาน | Medium | Functional |
| TC-LOC-040005 | deep link เข้าหน้ารายละเอียดด้วย URL ตรง | High | Functional |
| TC-LOC-040006 | deep link ด้วย id ที่ไม่มีอยู่ | Medium | Edge Case |
| TC-LOC-040007 | บันทึกการแก้ไขแล้วอยู่หน้าเดิมในโหมด view | High | CRUD |
| TC-LOC-040008 | แก้ไขประเภทคลังและการตรวจนับสินค้าแล้วค่าคงอยู่ | Medium | CRUD |
| TC-LOC-040009 | เปลี่ยน Delivery Point แล้วค่าคงอยู่และสะท้อนในตาราง | Medium | CRUD |
| TC-LOC-040010 | เพิ่มและถอนผู้ใช้ของคลังแล้วค่าคงอยู่ | Medium | CRUD |
| TC-LOC-040011 | เพิ่มและถอนสินค้าของคลังแล้วค่าคงอยู่ | Medium | CRUD |
| TC-LOC-040012 | ออกจากหน้าผ่านเมนู sidebar ขณะฟอร์มยังไม่บันทึก | High | Functional |
| TC-LOC-040013 | กดปุ่มย้อนกลับของเบราว์เซอร์ขณะฟอร์มยังไม่บันทึก | Medium | Functional |
| TC-LOC-040014 | ปุ่ม Back ในหัวฟอร์มกลับหน้า list เสมอ | Medium | Functional |
| TC-LOC-040015 | ตาราง Users / Products ในโหมด view ค้นหาได้ และปุ่ม Activity เปิดประวัติ | Low | Functional |
| TC-LOC-050003 | ข้อความยืนยันลบแสดงชื่อคลัง | Medium | Functional |
| TC-LOC-050004 | ลบคลังจากเมนู Row actions ในหน้า list | Medium | CRUD |
| TC-LOC-050005 | ลบคลังจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-LOC-050006 | ลบจากหน้ารายละเอียดสำเร็จแล้วเด้งกลับหน้า list | Medium | CRUD |
| TC-LOC-050007 | ลบคลังที่มีผู้ใช้และสินค้าผูกอยู่ | High | Edge Case |
| TC-LOC-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-LOC-100006 | ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit จางและเด้งแจ้งสิทธิ์ | Medium | Security |
| TC-LOC-100007 | ไม่มีสิทธิ์ลบ — ปุ่มและเมนู Delete เด้งแจ้งสิทธิ์ | Medium | Authorization |
| TC-LOC-100008 | ไม่มีสิทธิ์ดู — เมนู Store Location ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-LOC-100009 | เปิด /config/location/new ตรง ๆ โดยไม่มีสิทธิ์สร้าง | Medium | Security |
| TC-LOC-200004 | ช่อง Code จำกัดความยาวที่ 10 ตัวอักษร | Medium | Validation |
| TC-LOC-200005 | ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร | Low | Validation |
| TC-LOC-200006 | ไม่เลือกประเภทคลัง การตรวจนับ หรือจุดส่ง แล้วกดบันทึก | High | Validation |
| TC-LOC-200007 | บันทึกไม่ผ่านแล้วหน้าเลื่อนไปยังช่องแรกที่ไม่ถูกต้อง | Low | Validation |

---
## TC-LOC-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/location`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Store Location" พร้อมคำอธิบายใต้ชื่อ; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Location Type (จัดกึ่งกลาง), Physical Count (ไอคอนถูก/กากบาท พร้อม `aria-label` เป็น Yes/No), Delivery Point (แสดง `-` เมื่อไม่มี), Status และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Store Location"

---
## TC-LOC-010007 — ค้นหายิงเมื่อกด Enter ไหลลง query string และล้างด้วยปุ่มกากบาท
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location`; มีคลังหลายรายการที่ code/name ต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับคลังที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter แล้วสังเกต query string
3. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
4. คลิกปุ่มกากบาทนั้น
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางเหลือเฉพาะรายการที่ตรงกับคำค้น, query string มี `search=<คำค้น>` และ `page` ถูกรีเซ็ต; เมื่อช่องมีข้อความ ปุ่มท้ายช่องเป็นกากบาท (`aria-label="Clear search"`) แทนแว่นขยาย; คลิกแล้วช่องว่าง, `search` หายจาก URL และตารางกลับมาแสดงทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-LOC-010008 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location`; มีคลังทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. เลือกแถว Status แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เปลี่ยนเป็น "Inactive"
**Expected**
ตารางเหลือเฉพาะคลังที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip แสดง chip สถานะพร้อมปุ่มลบ; query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก Inactive แล้วผลสลับเป็นรายการที่ปิดใช้งาน

---
## TC-LOC-010009 — กรองตามประเภทคลังและการตรวจนับสินค้าแบบเลือกหลายค่า
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location`; ใน BU มีคลังครบทั้งสามประเภท (Inventory / Direct / Consignment) และมีทั้ง Physical Count = Yes และ No
**Steps**
1. คลิกปุ่ม Filter
2. ในแถว "Location Type" เลือก Inventory แล้วเลือก Consignment เพิ่มอีกหนึ่งค่า
3. สังเกตตาราง, badge บนปุ่ม Filter, chip และ query string
4. ในแถว "Physical Count" เลือก "Yes" เพิ่ม
5. เอา Consignment ออกจากตัวกรองประเภทคลัง
**Expected**
เมนูตัวกรองมีสามแถว — Status, Location Type (Inventory / Direct / Consignment), Physical Count (Yes / No) — โดยสองแถวหลังเป็น multi-select ที่เลือกพร้อมกันได้หลายค่า; เลือกสองค่าแล้วตารางเหลือเฉพาะแถวที่ Location Type เป็นหนึ่งในสองค่านั้น; query string มีพารามิเตอร์ `location_type` และต่อมามี `physical_count_type` แยกจาก `filter` ของ status; chip แสดงครบทุกค่าที่เลือกและเอาออกทีละค่าได้ โดยตารางอัปเดตตามทันที

---
## TC-LOC-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location` โดยมีตัวกรองทำงานอยู่อย่างน้อย 2 ตัว (เช่น Status = Active และ Location Type = Inventory) และเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter`, `location_type`, `physical_count_type` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-LOC-010011 — เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/location` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีคลังอย่างน้อย 2 รายการที่ code ต่างกัน
**Steps**
1. สังเกต URL ตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, `aria-label="Sort by"`) แล้วดูรายชื่อคอลัมน์ในเมนู
3. เลือก "Code"
4. เลือก "Code" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้**ไม่มี default sort** — เข้าครั้งแรก URL ไม่มี `sort` และแถว "Default" มีเครื่องหมายกำกับ; เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้ (Code, Name, Location Type, Status, Created, Updated — คอลัมน์ Physical Count และ Delivery Point ประกาศเป็น `id` ไม่มี `accessorKey` จึงไม่อยู่ในเมนู); เลือก Code ครั้งแรกได้ `sort=code:asc` พร้อมลูกศรขึ้น, เลือกซ้ำได้ `sort=code:desc` และลำดับแถวสลับตาม; เลือก Default ล้าง `sort` ออกจาก URL

---
## TC-LOC-010012 — สลับมุมมองตาราง / การ์ด และเปิดรายละเอียดจากการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location` บนหน้าจอขนาด desktop; มีคลังอย่างน้อย 1 รายการที่ผูก Delivery Point ไว้
**Steps**
1. คลิกปุ่มมุมมองการ์ด (`aria-label="Grid view"`)
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกที่เนื้อการ์ด (ไม่ใช่ปุ่ม Delete ที่ footer)
4. กดปุ่ม Back ในหัวฟอร์มเพื่อกลับ แล้วคลิกปุ่มมุมมองตาราง (`aria-label="List view"`)
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อคลังเป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), Code, Type (ป้ายประเภทคลัง), Physical Count (Yes/No), Delivery Point (แสดงเฉพาะเมื่อมีค่า) และแถว Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกเนื้อการ์ดแล้ว**นำทางไปหน้า `/config/location/<uuid>`** ของรายการนั้น (ไม่ใช่เปิด dialog); กลับมาแล้วสลับเป็นตารางได้ข้อมูลครบเหมือนเดิม

---
## TC-LOC-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (`aria-label="Toggle columns"`)
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Delivery Point
**Expected**
เมนูแสดงรายการคอลัมน์ทั้งหมดพร้อม checkbox; Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น (ตรงกับ `columnVisibility` เริ่มต้นของ `useLocationTable`); เปิดแล้วคอลัมน์ทั้งสองปรากฏพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Delivery Point แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-LOC-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location` ในมุมมองตาราง; BU มีคลังมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (`aria-label="Go to next page"`)
4. คลิกปุ่มไปหน้าแรก (`aria-label="Go to first page"`)
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-LOC-010015 — ส่งออกรายการคลังเป็น XLSX และกดส่งออกขณะไม่มีข้อมูล
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/location` บน desktop; มีคลังอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
3. ค้นหาด้วยคำที่ไม่มีผลลัพธ์จนตารางว่าง (เห็น empty state)
4. คลิกปุ่ม Export อีกครั้ง
**Expected**
รอบแรกเบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่มี 7 คอลัมน์ตามลำดับ Code / Name / Location Type / Physical Count / Delivery Point / Description / Status (Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false; Delivery Point ที่ไม่มีค่าเป็นช่องว่าง); ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็น; รอบที่สองไม่มีไฟล์ถูกดาวน์โหลด แสดง toast เตือน "No data to export" และปุ่มไม่ค้างอยู่ในสถานะ "Exporting..."

---
## TC-LOC-010016 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/location` และตั้งตัวกรอง Location Type = Inventory ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่องชื่อและตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรอง Location Type = Inventory ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-LOC-010017 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/location` และมีคลังอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (`aria-label="Row actions"`)
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (`useLocationTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable`; ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Code หรือ Name เท่านั้น); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมโดยหัวเรื่องอ้าง **code** ของคลังแถวนั้น (ไม่ใช่ name — `activity.label` ของตารางนี้คือ `r.code`); ปิด sheet แล้วกลับหน้าเดิมโดยข้อมูลไม่เปลี่ยน

---
## TC-LOC-010018 — เปิดหน้ารายละเอียดจากคอลัมน์ Code และคอลัมน์ Name
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/location` และมีคลังอย่างน้อย 1 รายการที่รู้ code/name แน่นอน
**Steps**
1. คลิกข้อความ code ในคอลัมน์ Code ของแถวนั้น
2. กลับหน้า list
3. คลิกข้อความชื่อในคอลัมน์ Name ของแถวเดียวกัน
**Expected**
ทั้งสองคอลัมน์ render เป็น `<button>` ไม่ใช่ลิงก์ และคลิกแล้วนำทางไป `/config/location/<uuid>` ของรายการเดียวกันทั้งคู่; URL ไม่ลงท้ายด้วย `/new`; หน้าที่เปิดขึ้นอยู่ในโหมด view โดยหัวเรื่องเป็นชื่อคลังและมี badge แสดง code

---
## TC-LOC-030004 — หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/config/location/new` (หรือกดปุ่ม "Add Store Location" จากหน้า list)
2. อ่านหัวข้อในหัวฟอร์ม ปุ่มในแถบเครื่องมือ และค่าในทุกช่อง
**Expected**
หัวฟอร์มแสดง "Add Store Location" พร้อมปุ่มย้อนกลับ (`aria-label="Go back"`) และมีปุ่มเพียง Cancel กับ **Create** (ไม่ใช่ Save) — **ไม่มีปุ่ม Delete และไม่มีปุ่ม Activity** ในโหมด add; ช่อง `#location-code` ว่าง มี placeholder "e.g. M123D" และ label มีเครื่องหมายบังคับกรอก; `#location-name` ว่าง placeholder "e.g. BAR Main"; Location Type และ Physical Count แสดง placeholder "Select location type" / "Select physical count type"; ปุ่ม Delivery Point แสดงข้อความ "Select Delivery Point"; `#location-description` ว่าง placeholder "Optional"; switch `#location-is-active` อยู่ที่เปิดใช้งาน (`aria-checked="true"`) พร้อมป้าย Active; มี section "Location Users" (กล่อง Transfer สองคอลัมน์ Available Users / Location Users, นับ 0) และ section "Products" (Product Catalog แสดง `0/<จำนวนสินค้าทั้งหมด>`)

---
## TC-LOC-030005 — สร้างสำเร็จแล้วแทนที่ URL เป็นหน้ารายละเอียด ไม่กลับหน้า list
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี delivery point ที่เปิดใช้งานอย่างน้อย 1 รายการ; code/name ที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/config/location/new` แล้วกรอกฟิลด์บังคับครบ (code, name, Location Type = Inventory, Physical Count = Yes, Delivery Point)
2. กด Create แล้วรอ toast
3. สังเกต URL และสภาพหน้า
4. กดปุ่มย้อนกลับของเบราว์เซอร์หนึ่งครั้ง
5. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Store Location created successfully"; **URL เปลี่ยนเป็น `/config/location/<uuid>` ไม่ใช่กลับไปหน้า list** และหน้าอยู่ในโหมด view (ช่องกรอกกลายเป็นข้อความ, หัวเรื่องเป็นชื่อคลัง, มี badge code, ปุ่มในแถบเป็น Edit / Delete / Activity); กดย้อนกลับของเบราว์เซอร์แล้ว **ไม่กลับไปหน้า `/new`** เพราะการนำทางเป็น `replace` (ไปที่หน้าก่อนหน้า `/new` แทน)

---
## TC-LOC-030006 — สร้างคลังพร้อม Description และ Physical Count = No
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี delivery point ที่เปิดใช้งานอย่างน้อย 1 รายการ
**Steps**
1. เปิด `/config/location/new` กรอก code/name ที่ไม่ซ้ำ
2. เลือก Location Type = Direct และ Physical Count = **No**
3. เลือก Delivery Point
4. กรอก Description เป็นข้อความหลายบรรทัด
5. กด Create แล้วดูหน้ารายละเอียดที่เปิดขึ้น
6. กลับหน้า list แล้วค้นหาคลังนั้น
7. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
สร้างสำเร็จพร้อม toast; ในโหมด view ช่อง Description แสดงข้อความครบทุกบรรทัด (ขึ้นบรรทัดใหม่ถูกรักษาไว้ — `whitespace-pre-wrap`) และ Physical Count แสดงคำว่า "No"; ในตารางหน้า list แถวนั้นมีคอลัมน์ Physical Count เป็นไอคอนกากบาท (`aria-label="No"`) และคอลัมน์ Location Type เป็นป้าย Direct

---
## TC-LOC-030007 — สร้างคลังพร้อมผูกผู้ใช้ผ่านกล่อง Transfer
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีผู้ใช้อย่างน้อย 2 คน; มี delivery point ที่เปิดใช้งาน
**Steps**
1. เปิด `/config/location/new` กรอกฟิลด์บังคับให้ครบ
2. ในกล่อง "Available Users" พิมพ์ชื่อผู้ใช้ลงช่องค้นหาของคอลัมน์ซ้าย
3. ติ๊กผู้ใช้ 2 คน แล้วกดปุ่มย้ายไปขวา (`aria-label="Move selected to right"`)
4. ติ๊กผู้ใช้ 1 คนในคอลัมน์ "Location Users" แล้วกดปุ่มย้ายกลับซ้าย (`aria-label="Move selected to left"`)
5. กด Create
6. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ช่องค้นหาของแต่ละคอลัมน์กรองรายชื่อเฉพาะคอลัมน์นั้น; ปุ่มย้ายถูก disable เมื่อยังไม่ติ๊กรายการใด; ย้ายแล้วรายชื่อสลับฝั่งและตัวเลขนับบนหัว section "Location Users" อัปเดตตาม (2 แล้วเหลือ 1); สร้างสำเร็จพร้อม toast และหน้ารายละเอียดที่เปิดขึ้นแสดงตาราง Location Users ที่มีผู้ใช้ 1 คนที่เหลือไว้จริง พร้อมคอลัมน์ #, Name, Email, Telephone

---
## TC-LOC-030008 — สร้างคลังพร้อมผูกสินค้าผ่าน Product Catalog
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีสินค้าอย่างน้อย 3 รายการในหมวดหมู่เดียวกัน; มี delivery point ที่เปิดใช้งาน
**Steps**
1. เปิด `/config/location/new` กรอกฟิลด์บังคับให้ครบ
2. ในกล่อง Product Catalog พิมพ์รหัสหรือชื่อสินค้าในช่อง "Search by code or name..."
3. ติ๊ก checkbox ของสินค้า 1 รายการ
4. ล้างคำค้น แล้วติ๊ก checkbox ที่ระดับ item group หนึ่งกลุ่ม
5. กด Create แล้วดูตาราง Products ในหน้ารายละเอียด
6. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
tree แสดงลำดับชั้น หมวดหมู่ → หมวดหมู่ย่อย → กลุ่มสินค้า → สินค้า โดยชื่อสินค้าอยู่ในรูป `<code> — <name>`; ตัวนับมุมขวาบนของกล่องแสดง `<เลือกแล้ว>/<ทั้งหมด>` และเพิ่มตามจำนวนที่ติ๊ก; ติ๊กที่ระดับกลุ่มแล้วสินค้าลูกทั้งกลุ่มถูกเลือก และ checkbox ของหมวดหมู่แม่กลายเป็นสถานะ indeterminate เมื่อเลือกไม่ครบ; หัว section "Products" แสดงจำนวนที่เลือก; สร้างสำเร็จแล้วตาราง Products ในโหมด view แสดงสินค้าที่เลือกไว้ครบ พร้อมคอลัมน์ #, Code, Name, Local Name และหน่วยนับคลัง

---
## TC-LOC-030009 — ยกเลิกการสร้างขณะฟอร์มมีข้อมูลค้าง
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/config/location/new` และกรอก code กับ name ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ในแถบเครื่องมือของฟอร์ม
2. อ่าน dialog ที่เด้งขึ้น แล้วกดปุ่ม "Keep editing"
3. คลิก Cancel อีกครั้ง แล้วกดปุ่ม "Discard"
4. กลับมาที่ `/config/location/new` อีกครั้ง
**Expected**
กด Cancel ขณะฟอร์ม dirty แล้วเด้ง alert dialog หัวข้อ "Discard changes?" พร้อมคำอธิบาย "You have unsaved changes that will be lost." และปุ่มสองตัว "Keep editing" / "Discard"; กด Keep editing แล้ว dialog ปิดโดยยังอยู่ที่ `/new` และค่าที่กรอกยังอยู่ครบ; กด Discard แล้วนำทางกลับไปที่ `/config/location` โดยไม่มี toast และไม่มีแถวใหม่ในตาราง; เปิด `/new` ใหม่แล้วฟอร์มเป็นค่าเริ่มต้นทั้งหมด

---
## TC-LOC-030010 — lookup Delivery Point ค้นหาได้และแสดงเฉพาะจุดส่งที่เปิดใช้งาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ใน `/config/delivery-point` มีจุดส่งที่เปิดใช้งานอย่างน้อย 2 รายการ **และปิดใช้งานอย่างน้อย 1 รายการ** โดยรู้ชื่อของรายการที่ปิดใช้งานแน่นอน; อยู่ที่ `/config/location/new`
**Steps**
1. คลิกปุ่ม "Select Delivery Point"
2. พิมพ์ชื่อจุดส่งที่เปิดใช้งานลงช่องค้นหาในป็อปอัป
3. คลิกเลือกรายการนั้น
4. เปิดป็อปอัปอีกครั้งแล้วพิมพ์ชื่อของจุดส่งที่**ปิดใช้งาน**
5. พิมพ์คำค้นที่ไม่ตรงกับจุดส่งใดเลย
**Expected**
ป็อปอัปมีช่องค้นหา placeholder "Search Delivery Point..."; ค้นหาแล้วรายการถูกกรองตามคำค้น (ยิงค้นหาฝั่ง server หลัง debounce); เลือกแล้วป็อปอัปปิดและปุ่มเปลี่ยนป้ายเป็นชื่อจุดส่งที่เลือก (ไม่กลับไปเป็น placeholder); **จุดส่งที่ปิดใช้งานไม่ปรากฏในรายการ** (lookup กรองด้วย `is_active`); คำค้นที่ไม่ตรงใดเลยแสดง empty state ไม่ใช่รายการว่างเปล่าหรือหน้าค้าง

---
## TC-LOC-040005 — deep link เข้าหน้ารายละเอียดด้วย URL ตรง
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่รู้ `<uuid>` แน่นอน และคลังนั้นมีผู้ใช้กับสินค้าผูกอยู่อย่างละอย่างน้อย 1 รายการ
**Steps**
1. เปิด `/config/location/<uuid>` ตรง ๆ ในแท็บใหม่ (ไม่ผ่านหน้า list)
2. สังเกตสภาพหน้าระหว่างโหลดและหลังโหลดเสร็จ
3. ลองคลิกที่ค่าของแต่ละฟิลด์
**Expected**
ระหว่างโหลดแสดง skeleton ของฟอร์ม; โหลดเสร็จแล้วหน้าอยู่ใน **โหมด view** — หัวเรื่องเป็นชื่อคลัง, มี badge แสดง code (`aria-label="Code"`), แถบปุ่มมี Edit / Delete / Activity และ **ไม่มีปุ่ม Save/Cancel**; ทุกฟิลด์ (Code, Name, Location Type, Physical Count, Delivery Point, Description) render เป็นข้อความ `data-slot="field-plain-text"` ไม่ใช่ `<input>` — `#location-code` / `#location-name` ยังไม่มีอยู่ใน DOM จนกว่าจะกด Edit; switch สถานะถูก disable; section Location Users แสดง `UserTable` และ section Products แสดง `ProductTable` พร้อมตัวเลขนับจำนวนข้างหัวข้อ

---
## TC-LOC-040006 — deep link ด้วย id ที่ไม่มีอยู่
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี uuid ที่รูปแบบถูกต้องแต่ไม่มีคลังตรงกันใน BU นี้
**Steps**
1. เปิด `/config/location/<uuid-ที่ไม่มีอยู่>`
2. รอให้หน้าโหลดเสร็จ
3. กดปุ่มกลับที่หน้านั้นเสนอ
**Expected**
หน้าไม่ขาวและไม่ crash; แสดง error state พร้อมข้อความ "Location not found" และปุ่มกลับไปหน้า `/config/location`; กดปุ่มแล้วกลับหน้า list ได้จริงและ list แสดงข้อมูลตามปกติ

---
## TC-LOC-040007 — บันทึกการแก้ไขแล้วอยู่หน้าเดิมในโหมด view
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้น
2. กด Edit แล้วสังเกตหัวเรื่องและปุ่มในแถบ
3. แก้ Description เป็นข้อความใหม่
4. กด Save แล้วรอ toast
5. สังเกต URL และสภาพหน้า
6. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กด Edit แล้วหัวเรื่องเปลี่ยนเป็น "Edit <ชื่อคลัง>" และแถบปุ่มเปลี่ยนเป็น Cancel + Save (+ Delete + Activity); กด Save แล้วแสดง toast "Store Location updated successfully"; **URL ไม่เปลี่ยนและหน้าไม่เด้งกลับ list** แต่กลับเข้าโหมด view เอง (ฟิลด์กลายเป็นข้อความ, ปุ่มกลับเป็น Edit) โดย Description แสดงค่าใหม่

---
## TC-LOC-040008 — แก้ไขประเภทคลังและการตรวจนับสินค้าแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ โดยตั้ง Location Type = Inventory และ Physical Count = Yes ไว้
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกด Edit
2. เปลี่ยน Location Type เป็น Consignment
3. เปลี่ยน Physical Count เป็น No
4. กด Save
5. โหลดหน้ารายละเอียดใหม่ (refresh) แล้วอ่านค่าทั้งสอง
6. กลับหน้า list แล้วค้นหาคลังนั้น
7. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast update สำเร็จ; หลัง refresh หน้ารายละเอียดในโหมด view แสดง Location Type = Consignment และ Physical Count = No (ค่าถูก persist จริง ไม่ใช่แค่ state บนจอ); ในหน้า list คอลัมน์ Location Type ของแถวนั้นเป็นป้าย Consignment และคอลัมน์ Physical Count เป็นไอคอนกากบาท

---
## TC-LOC-040009 — เปลี่ยน Delivery Point แล้วค่าคงอยู่และสะท้อนในตาราง
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี delivery point ที่เปิดใช้งานอย่างน้อย 2 รายการ; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและผูกกับจุดส่งรายการแรกอยู่
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกด Edit
2. สังเกตป้ายบนปุ่ม Delivery Point ก่อนแตะอะไร
3. เปิด lookup แล้วเลือกจุดส่งอีกรายการหนึ่ง
4. กด Save
5. โหลดหน้าใหม่แล้วอ่านค่า Delivery Point
6. กลับหน้า list ค้นหาคลังนั้นแล้วดูคอลัมน์ Delivery Point
7. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ตอนเข้าโหมด edit ปุ่ม Delivery Point แสดงชื่อจุดส่งเดิมอยู่แล้ว (ไม่ใช่ placeholder) แม้ lookup จะยังไม่เคยเปิด; เลือกจุดส่งใหม่แล้วป้ายเปลี่ยนตามทันที; Save แล้ว toast update สำเร็จ; หลังโหลดใหม่หน้ารายละเอียดแสดงชื่อจุดส่งใหม่ และคอลัมน์ Delivery Point ในหน้า list ของแถวนั้นเป็นชื่อจุดส่งใหม่เช่นกัน

---
## TC-LOC-040010 — เพิ่มและถอนผู้ใช้ของคลังแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีผู้ใช้อย่างน้อย 2 คน; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะซึ่งยังไม่ผูกผู้ใช้คนใด
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกด Edit
2. ย้ายผู้ใช้ 2 คนจาก "Available Users" ไป "Location Users"
3. กด Save แล้วรอ toast
4. โหลดหน้าใหม่ แล้วนับแถวในตาราง Location Users
5. กด Edit อีกครั้ง ย้ายผู้ใช้ 1 คนกลับไปฝั่งซ้าย แล้ว Save
6. โหลดหน้าใหม่แล้วตรวจสอบรายชื่อที่เหลือ
7. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
รอบแรก toast update สำเร็จ และหลังโหลดใหม่ตาราง Location Users มี 2 แถวตรงกับผู้ใช้ที่ย้ายไป พร้อมตัวเลขนับ 2 ข้างหัวข้อ section; รอบที่สองหลังโหลดใหม่เหลือ 1 แถวและเป็นคนที่ไม่ได้ถูกย้ายออก (ทั้ง `add` และ `remove` ถูกส่งและมีผลจริง)

---
## TC-LOC-040011 — เพิ่มและถอนสินค้าของคลังแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีสินค้าอย่างน้อย 2 รายการ; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะซึ่งยังไม่ผูกสินค้าใด
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกด Edit
2. ติ๊กสินค้า 2 รายการใน Product Catalog แล้วกด Save
3. โหลดหน้าใหม่ แล้วนับแถวในตาราง Products
4. กด Edit อีกครั้ง เอาติ๊กของสินค้า 1 รายการออก แล้ว Save
5. โหลดหน้าใหม่แล้วตรวจสอบรายการที่เหลือ
6. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
รอบแรก toast update สำเร็จ และหลังโหลดใหม่ตาราง Products มี 2 แถวตรงกับสินค้าที่เลือก พร้อมตัวเลขนับ 2 ข้างหัวข้อ section; รอบที่สองหลังโหลดใหม่เหลือ 1 แถวและเป็นสินค้าที่ไม่ได้ถูกเอาออก

---
## TC-LOC-040012 — ออกจากหน้าผ่านเมนู sidebar ขณะฟอร์มยังไม่บันทึก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; sidebar เปิดอยู่และเห็นเมนูของกลุ่ม Config
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้น กด Edit แล้วแก้ช่อง Name เป็นค่าใหม่ (อย่ากด Save)
2. คลิกเมนูอื่นใน sidebar (เช่น "Department")
3. กด "Keep editing" ใน dialog ที่เด้งขึ้น
4. คลิกเมนูเดิมอีกครั้ง แล้วกด "Discard"
5. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
คลิกลิงก์ sidebar แล้ว **ไม่นำทางทันที** แต่เด้ง alert dialog "Discard changes?"; กด "Keep editing" แล้ว URL ยังเป็น `/config/location/<uuid>` และค่าที่แก้ไว้ยังอยู่ในช่อง; รอบที่สองกด "Discard" แล้วนำทางไปหน้าปลายทางจริง และเมื่อกลับมาเปิดคลังเดิม ชื่อยังเป็นค่าเดิมก่อนแก้ (ไม่ถูกบันทึก)

---
## TC-LOC-040013 — กดปุ่มย้อนกลับของเบราว์เซอร์ขณะฟอร์มยังไม่บันทึก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; เข้าหน้ารายละเอียดโดยเดินผ่านหน้า list (เพื่อให้มีหน้าก่อนหน้าใน history)
**Steps**
1. กด Edit แล้วแก้ช่อง Name เป็นค่าใหม่ (อย่ากด Save)
2. กดปุ่มย้อนกลับของเบราว์เซอร์
3. กด "Keep editing"
4. กดย้อนกลับอีกครั้ง แล้วกด "Discard"
5. ลบคลังที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กดย้อนกลับแล้ว URL ยังคงเป็นหน้ารายละเอียดเดิม และเด้ง alert dialog "Discard changes?" แทนการออกจากหน้า; กด "Keep editing" แล้ว dialog ปิดโดยอยู่ที่หน้าเดิมและค่าที่แก้ยังอยู่; รอบที่สองกด "Discard" แล้วกลับไปหน้า `/config/location` จริง ๆ (ไม่ใช่ค้างอยู่ที่หน้าเดิมเพราะ sentinel ของ guard)

---
## TC-LOC-040014 — ปุ่ม Back ในหัวฟอร์มกลับหน้า list เสมอ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/dashboard` → เปิด `/config/department` → แล้วจึงเปิด `/config/location` และคลิกเข้าหน้ารายละเอียดของคลังหนึ่ง
2. กดปุ่มย้อนกลับในหัวฟอร์ม (`aria-label="Go back"`) ขณะอยู่โหมด view
3. กลับเข้าหน้ารายละเอียดเดิม กด Edit โดย**ไม่แก้อะไร** แล้วกดปุ่มย้อนกลับในหัวฟอร์มอีกครั้ง
**Expected**
ทั้งสองครั้งไปที่ `/config/location` (หน้า list) โดยตรง — ไม่ใช่ถอย history ไปหน้า `/config/department`; ครั้งที่สองไม่มี dialog "Discard changes?" เด้งขึ้น เพราะฟอร์มยังไม่ dirty

---
## TC-LOC-040015 — ตาราง Users / Products ในโหมด view ค้นหาได้ และปุ่ม Activity เปิดประวัติ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่ผูกผู้ใช้อย่างน้อย 2 คนและสินค้าอย่างน้อย 2 รายการ
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้น (โหมด view)
2. พิมพ์ชื่อผู้ใช้คนหนึ่งลงช่องค้นหาเหนือตาราง Location Users
3. พิมพ์รหัสสินค้ารายการหนึ่งลงช่องค้นหาเหนือตาราง Products
4. ล้างคำค้นทั้งสองช่อง
5. กดปุ่ม Activity ในแถบปุ่มของหัวฟอร์ม
**Expected**
ตาราง Location Users กรองตามชื่อ/อีเมล/เบอร์โทรและไฮไลต์คำที่ตรง; ตาราง Products กรองตาม code/name/local name/หน่วยนับและไฮไลต์เช่นกัน; ค้นหาแล้วไม่เจอแสดง empty state ของตารางนั้นโดยหน้าไม่ค้าง; ล้างคำค้นแล้วรายการกลับมาครบ; กด Activity แล้วเปิด sheet ประวัติที่อ้าง **ชื่อคลัง** (ต่างจากเมนู Activity ของแถวในหน้า list ที่อ้าง code) และปิด sheet กลับมาได้โดยข้อมูลไม่เปลี่ยน

---
## TC-LOC-050003 — ข้อความยืนยันลบแสดงชื่อคลัง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกดปุ่ม Delete ในแถบปุ่ม
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. กด Cancel
4. กลับหน้า list เปิดเมนู Row actions ของแถวเดียวกันแล้วเลือก Delete
5. อ่านหัวข้อและคำอธิบายอีกครั้ง แล้วยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Store Location" และคำอธิบายที่มีชื่อคลังอยู่ในข้อความ (`Are you sure you want to delete location "<ชื่อ>"? This action cannot be undone.`); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ข้อความชุดเดียวกันนี้แสดงทั้งจากหน้ารายละเอียดและจากเมนูแถวในหน้า list (ปุ่ม Delete ในหน้ารายละเอียดอยู่ในแถบปุ่มโดยตรง ไม่ต้องกด Edit ก่อน)

---
## TC-LOC-050004 — ลบคลังจากเมนู Row actions ในหน้า list
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและยังไม่ถูกโมดูลอื่นอ้างถึง
**Steps**
1. ไปที่ `/config/location` แล้วค้นหาคลังนั้น
2. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
3. กดยืนยัน Delete
4. ค้นหาชื่อเดิมซ้ำอีกครั้ง
**Expected**
แสดง toast "Store Location deleted successfully"; แถวหายจากตารางโดย **URL ยังอยู่ที่ `/config/location`** (ไม่ต้องเข้าหน้ารายละเอียดก่อน — ต่างจากเส้นทางที่สเปกปัจจุบันใช้); ค้นหาซ้ำแล้วได้ empty state และตัวเลขรวมใน pagination ลดลง 1

---
## TC-LOC-050005 — ลบคลังจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้า list เป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของคลังนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว **ไม่นำทางไปหน้ารายละเอียด** (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Store Location deleted successfully" และการ์ดใบนั้นหายจากกริดโดย URL ยังเป็น `/config/location`

---
## TC-LOC-050006 — ลบจากหน้ารายละเอียดสำเร็จแล้วเด้งกลับหน้า list
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้น
2. กดปุ่ม Delete ในแถบปุ่มแล้วยืนยัน
3. สังเกต URL หลัง toast ขึ้น
4. ค้นหาชื่อเดิมในหน้า list
**Expected**
แสดง toast "Store Location deleted successfully"; **URL เปลี่ยนกลับเป็น `/config/location`** เอง (ไม่ค้างอยู่ที่หน้ารายละเอียดของ record ที่ไม่มีแล้ว และไม่แสดง error state); ค้นหาชื่อเดิมแล้วได้ empty state

---
## TC-LOC-050007 — ลบคลังที่มีผู้ใช้และสินค้าผูกอยู่
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคลังที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ โดยผูกผู้ใช้ไว้ 1 คนและสินค้าไว้ 1 รายการ (ตามขั้นตอนของ `TC-LOC-030007` / `TC-LOC-030008`) · **ดู callout ข้อ 5 ก่อนรัน — ยังไม่ได้ยืนยันกับทีม backend ว่ามี FK guard หรือไม่**
**Steps**
1. เปิดหน้ารายละเอียดของคลังนั้นแล้วกดปุ่ม Delete
2. อ่าน dialog ยืนยัน
3. กดยืนยัน Delete
4. รอผลแล้วกลับไปค้นหาคลังนั้นในหน้า list
5. ถ้าคลังยังอยู่ ให้ถอดผู้ใช้กับสินค้าออกก่อนแล้วลบซ้ำเพื่อคืนสภาพ
**Expected**
ฝั่ง UI **ไม่มีการเตือนหรือกั้นล่วงหน้า** — dialog ยืนยันเป็นชุดเดียวกับการลบคลังเปล่า (หัวข้อ "Delete Store Location" + ชื่อคลังในคำอธิบาย) ไม่มีข้อความบอกว่ามีข้อมูลผูกอยู่; หลังกดยืนยัน ต้องมีผลลัพธ์ที่ผู้ใช้เห็นได้ชัดเจนภายใน 10 วินาทีอย่างใดอย่างหนึ่ง คือ toast สำเร็จ + เด้งกลับหน้า list + แถวหายจากตาราง **หรือ** toast ผิดพลาด + หน้ารายละเอียดยังอยู่ + คลังยังค้นเจอในหน้า list; ในทั้งสองกรณีต้องไม่มีหน้าขาว ไม่มี dialog ค้างเปิด และหน้ายังใช้งานต่อได้ · **บันทึกผลจริงที่ได้ลงใน callout ข้อ 5 เมื่อรันเคสนี้ครั้งแรก**

---
## TC-LOC-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.location.view` แต่ไม่มี `configuration.location.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. ไปที่ `/config/location`
2. สังเกตสภาพปุ่ม "Add Store Location"
3. คลิกปุ่มนั้น
**Expected**
ปุ่ม "Add Store Location" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว **ไม่นำทางไป `/config/location/new`** — URL ไม่เปลี่ยน และเด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน

---
## TC-LOC-100006 — ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit จางและเด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.location.view` แต่ไม่มี `configuration.location.update` และไม่ใช่ admin ของ BU; มีคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/location` แล้วคลิก code ของคลังหนึ่งเพื่อเปิดหน้ารายละเอียด
2. สังเกตสภาพปุ่ม Edit ในแถบปุ่ม
3. คลิกปุ่ม Edit
**Expected**
หน้ารายละเอียดเปิดได้ตามปกติในโหมด view (ผู้ใช้ยังดูได้); ปุ่ม Edit แสดงอยู่แต่ถูกทำให้จางและมี `aria-disabled="true"`; คลิกแล้วหน้า **ไม่เข้าสู่โหมด edit** (ไม่มี `#location-code` / `#location-name` ปรากฏใน DOM, ไม่มีปุ่ม Save) แต่เด้ง dialog "Permission Denied" แทน

---
## TC-LOC-100007 — ไม่มีสิทธิ์ลบ — ปุ่มและเมนู Delete เด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.location.view` แต่ไม่มี `configuration.location.delete` และไม่ใช่ admin ของ BU; มีคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/location` เปิดเมนู Row actions ของแถวแรกแล้วสังเกตรายการ Delete
2. คลิก Delete
3. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
4. เปิดหน้ารายละเอียดของคลังนั้นแล้วคลิกปุ่ม Delete ในแถบปุ่ม
**Expected**
ทั้งสามจุด (เมนูแถว, ปุ่มบนการ์ด, ปุ่มในหน้ารายละเอียด) แสดงแบบจางและมี `aria-disabled="true"`; คลิกแล้ว **ไม่เปิด dialog ยืนยันลบ** แต่เด้ง dialog "Permission Denied" ทุกจุด (ตาราง การ์ด และหน้ารายละเอียดคุมสิทธิ์ชุดเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-LOC-100008 — ไม่มีสิทธิ์ดู — เมนู Store Location ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `configuration.location.view` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังมี license ของโมดูลนี้อยู่ (ไม่งั้นจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผล)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar
2. สังเกตรายการ "Store Location"
3. คลิกรายการนั้น
**Expected**
รายการ "Store Location" ยังอยู่ในเมนูแต่ถูกทำให้จาง (opacity ต่ำลง) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/location">` ให้กดไปหน้า; ไม่มีไอคอนแม่กุญแจ (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-LOC-100009 — เปิด /config/location/new ตรง ๆ โดยไม่มีสิทธิ์สร้าง
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.location.view` แต่ไม่มี `configuration.location.create` และไม่ใช่ admin ของ BU
**Steps**
1. พิมพ์ URL `/config/location/new` ตรง ๆ ในแถบที่อยู่
2. สังเกตสภาพปุ่ม Create ในแถบปุ่มของฟอร์ม
3. กรอก code/name แล้วคลิกปุ่ม Create
**Expected**
ปุ่ม Create แสดงอยู่แต่ถูกทำให้จางและมี `aria-disabled` (`FormToolbar` คำนวณ `saveDenied` จาก `configuration.location.create`); คลิกแล้ว **ไม่มีการยิงคำขอสร้าง** — ไม่มี toast สำเร็จ, URL ยังเป็น `/config/location/new` และเด้ง dialog "Permission Denied" แทน; กลับไปหน้า list แล้วไม่มีแถวใหม่เพิ่มขึ้น

---
## TC-LOC-200004 — ช่อง Code จำกัดความยาวที่ 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/location/new`
**Steps**
1. กรอกช่อง Code ด้วยสตริงยาว 50 ตัวอักษร
2. อ่านค่าที่อยู่ในช่องจริง
3. กด Edit บนคลังที่มีอยู่แล้วทำซ้ำขั้นตอนเดียวกันในโหมด edit
**Expected**
ช่อง `#location-code` มี `maxLength="10"` และค่าที่อยู่ในช่องถูก clamp ไว้ที่ไม่เกิน 10 ตัวอักษรทั้งในโหมด add และโหมด edit (ค่าที่เกินถูกตัดทิ้งตั้งแต่ตอนพิมพ์ ไม่ใช่ตอน submit)

---
## TC-LOC-200005 — ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/location/new`
**Steps**
1. กรอกช่อง Description ด้วยสตริงยาว 400 ตัวอักษร
2. อ่านค่าที่อยู่ในช่องจริง
**Expected**
`#location-description` เป็น `<textarea>` ที่มี `maxLength="256"` และค่าที่อยู่ในช่องยาวไม่เกิน 256 ตัวอักษร; ไม่มีข้อความ error เด้งขึ้น (เป็นการ clamp ที่ตัว input ไม่ใช่ validation ตอน submit) และกด Create ต่อได้ตามปกติ

---
## TC-LOC-200006 — ไม่เลือกประเภทคลัง การตรวจนับ หรือจุดส่ง แล้วกดบันทึก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่ `/config/location/new`
**Steps**
1. กรอก Code และ Name ให้ครบ **แต่ไม่เลือก** Location Type, Physical Count และ Delivery Point
2. กด Create
3. อ่านข้อความใต้ช่องที่ยังไม่ได้เลือก
4. เลือก Location Type อย่างเดียวแล้วกด Create ซ้ำ
**Expected**
ฟอร์มไม่ถูก submit — URL ยังคงอยู่ที่ `/config/location/new` และไม่มี toast สำเร็จ; มีข้อความ error รูป "{field} is required" ใต้ทั้งสามช่อง (Location Type / Physical Count / Delivery Point) โดยตัวควบคุมของแต่ละช่องมี `aria-invalid="true"` และปุ่ม Delivery Point เปลี่ยนเป็นขอบสีเตือนพร้อมไอคอนเตือน; หลังเลือก Location Type ข้อความ error ของช่องนั้นหายไปแต่ของอีกสองช่องยังอยู่ และฟอร์มยังไม่ถูก submit

---
## TC-LOC-200007 — บันทึกไม่ผ่านแล้วหน้าเลื่อนไปยังช่องแรกที่ไม่ถูกต้อง
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/location/new` บนหน้าจอที่เตี้ยพอให้ต้องเลื่อน (เช่น viewport สูง 700px) และมีสินค้าจำนวนมากพอให้ section Products ดันหน้ายาว
**Steps**
1. เว้นช่อง Code ว่างไว้ แต่กรอกช่องอื่น ๆ ให้ครบ
2. เลื่อนหน้าลงไปจนสุดที่ section Products
3. กดปุ่ม Create (แถบปุ่มอยู่ที่หัวฟอร์ม — เลื่อนขึ้นไปกดหรือกดจากแถบที่มองเห็นได้)
**Expected**
ฟอร์มไม่ถูก submit; หน้าเลื่อนกลับขึ้นไปให้ช่องแรกที่ไม่ถูกต้อง (Code) อยู่ในจอโดยอัตโนมัติ พร้อมข้อความ "Code is required" ใต้ช่อง — ผู้ใช้ไม่ต้องไล่หาเองว่าช่องไหนพัง
