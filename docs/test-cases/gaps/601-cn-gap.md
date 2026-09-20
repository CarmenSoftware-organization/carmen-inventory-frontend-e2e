# Credit Note — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบจริง** เท่านั้น — "ครอบ" ในที่นี้หมายถึงมี oracle ที่ล้มได้ ไม่ใช่แค่มี `test()` อยู่ในไฟล์ · ดูภาพรวมสุขภาพของสเปกที่ [`../SPEC-HEALTH.md`](../SPEC-HEALTH.md)_

**Module:** Procurement — Credit Note (ใบลดหนี้)
**Frontend route:** `routes/procurement/credit-note`  •  **URL:** `/procurement/credit-note` · `/procurement/credit-note/new` · `/procurement/credit-note/:id`
**Prefix:** `CN` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**สเปกที่มีอยู่:** `tests/601-cn.spec.ts`
**Default role:** Purchase (`purchase@blueledgers.com`, active BU = BLAVG) — หมวด 20 ใช้ `requestor@blueledgers.com`
**Total test cases:** 65

> **หมายเหตุสำคัญสำหรับผู้รีวิว — โมดูลนี้ต่างจาก gap report ฉบับอื่น**
>
> **1. สเปกที่มีอยู่แทบไม่ได้ตรวจอะไรเลย** `bun audit:spec-health` วัด `tests/601-cn.spec.ts` ได้ว่า: **127 เคสในไฟล์ · รันจริง 45 · ถูก `skip` 82 (dormant 64%) · ในเคสที่รันมี 33 เคสไม่มี `expect(...)` เลย · ทั้งไฟล์มี assertion รวม 16 ครั้ง** (ยืนยันซ้ำด้วยการนับเอง: `skip` 82, ตัวที่รัน 45, `expect(` 16) เคสที่รันแต่ไม่ตรวจอะไรคือ **ไม่ครอบ** เท่ากับเคสที่ถูก skip — ต่างกันแค่มันไม่รายงานตัวเองว่าโดนข้าม
>
> ในบรรดา assertion 16 ครั้งนั้น 5 ครั้งเป็น `expect(true).toBe(true)` (สาขา "ปุ่มไม่มีอยู่ = ผ่าน") และ 1 ครั้งเป็น `expect(onListPage || onUnauthorized).toBeTruthy()` ซึ่งเป็นจริงเสมอเพราะเพิ่ง `goto(LIST_PATH)` มา เคสที่มี oracle จริงเหลือประมาณ 6 เคส (`toHaveURL(/credit-note/)`, `anyError()` 4 ครั้ง, `toBeDisabled` อีกไม่กี่ครั้ง) **ทุกเคสในไฟล์นี้จึงเป็นเคสใหม่ ไม่มีการเขียนซ้ำกับสิ่งที่สเปกตรวจจริง** แต่ ID ทุกตัวของสเปก (รวม 82 ตัวที่ skip ไว้) ถือว่าจองแล้ว — เลขในไฟล์นี้จึงเริ่มจากช่องว่างถัดไปของแต่ละ section
>
> **2. สเปกอ้างถึง UI ที่ไม่มีอยู่จริง — อย่าลอกโครงของมัน** อ่าน source แล้ว (`cn-form.tsx`, `cn-header.tsx`, `cn-footer-action.tsx`) ยืนยันได้ว่า:
> - **ไม่มีปุ่ม "Commit" และไม่มีปุ่ม "Void"** ที่ไหนเลยในโมดูลนี้ คำสั่งเดียวที่เปลี่ยนสถานะคือ **Submit** (`PATCH /credit-note/{id}/submit`) ที่แถบสรุปยอดล่างขวา หมวด 10 (`TC-CN-1000xx`) และหมวด 11 (`TC-CN-1100xx`) ของสเปกจึงกดปุ่มที่ไม่มีวันเจอ แล้ว `.catch(() => {})` กลืนความเงียบนั้นไว้ · ไฟล์นี้ใช้หมวด 10 สำหรับ **Submit** และหมวด 11 สำหรับ **Delete** ซึ่งเป็นคำสั่งทำลายจริงที่ UI มี
> - **สถานะของ CN คือ** `draft` · `in_progress` · `completed` · `cancelled` · `voided` (`constant/credit-note.ts`) ไม่ใช่ `open` / `committed` / `posted` ตามที่สเปกเขียน · ใบที่ `completed`/`cancelled`/`voided` ถือว่า `isLocked` → ไม่มีปุ่ม Edit และไม่มีปุ่ม Submit
> - **ไม่มีแนวคิด "lot" ใน UI เลย** หมวด 06 ของสเปกทั้งหมด (`เลือก lot`, `save โดยไม่เลือก lot`) ไม่มีของจริงรองรับ — รายการของ CN เลือกจาก **บรรทัดที่รับเข้าของ GRN** (`product` × `location`) ผ่าน dialog "Select from GRN" เท่านั้น เพิ่มแถวเปล่าไม่ได้
> - **ไม่มีช่อง "Total Amount" / "Credit Note Amount" ระดับหัวใบ** ยอดรวมคำนวณจากรายการทั้งหมดและเป็นข้อความอ่านอย่างเดียวในแถบสรุป — `cn.amountInput()` ของ page object (`getByLabel(/amount|total amount|credit amount/i)`) จึงไม่มีวันชี้ไปที่ช่องที่มีอยู่จริงในฟอร์มนี้
> - **แท็บ Stock Movement ยังไม่มีข้อมูล** `CnStockTable` เป็น `EmptyComponent` ล้วน รอ endpoint `GET /credit-note/{id}/stock-movements` — เคสที่เขียนไว้จึง assert **ข้อความที่ออกแบบไว้** ตามเงื่อนไขสถานะ ไม่ใช่ assert ว่ามีตารางการเคลื่อนไหวสต๊อก
>
> **3. ความสัมพันธ์กับ Credit Note Reason (ยืนยันจากโค้ดแล้ว — callout ไม่ใช่เคส)** `docs/test-cases/gaps/602-cn-reason-gap.md` ข้อ 6 บันทึกไว้ว่าฟอร์ม CN บังคับฟิลด์ reason และ dropdown ดึงแค่ 30 รายการ ตรวจ source แล้ว**จริงทั้งสองข้อ**:
> - `routes/procurement/credit-note/cn-form-schema.ts` — `reason: z.string().min(1, tv("required", { field: tf("reason") }))` และ `cn-general-fields.tsx` ใส่ `<FieldLabel required>` ให้ช่องนี้ → บังคับกรอก
> - `components/lookup/lookup-cn-reason.tsx` — `const { data } = useCnReason({ perpage: 30 })` แล้ว `reasons.map(...)` เป็น `SelectItem` ตรง ๆ **ไม่มีช่องค้นหา ไม่มีปุ่มโหลดเพิ่ม ไม่มี pagination** (ต่างจาก `LookupGrnByVendorForCn` ที่ใช้ `useLookupPagination` + `serverSideSearch`) → เหตุผลลำดับที่ 31 ขึ้นไปเลือกไม่ได้เลย
> - ป้ายที่แสดงมาจาก `reasons.find((r) => r.id === value)?.name` — ถ้าเหตุผลที่ใบเดิมอ้างถึง **ถูกลบ** หรือ **หลุดออกนอก 30 รายการแรก** ค่านี้เป็น `undefined` → `SelectValue` ตกกลับไปแสดง placeholder ("Select CN Reason") ทั้งที่ `field.value` ยังมีค่าอยู่ ช่องบังคับของใบนั้นจึง **อ่านเหมือนว่าง** และคนที่กด Save จะเห็นฟอร์มที่ดูไม่ครบทั้งที่ข้อมูลยังอยู่
>
> **ผลต่อการรันเทส:** เทสของ `602-cn-reason` ที่สร้าง/ลบเหตุผล **ต้องไม่ interleave** กับเทสของ `601-cn` และต้องสร้างเหตุผลของตัวเองขึ้นมาลบเท่านั้น (ห้ามลบของที่ BU มีอยู่เดิม) — `workers: 1` ช่วยเรื่องการรันพร้อมกัน แต่ไม่ช่วยเรื่องเรคคอร์ดค้างที่ดันจำนวนเหตุผลใน BU ให้เกิน 30 · **ไม่เขียนเป็นเคส** เพราะจะกลายเป็นเคสที่ยืนยันว่าฟีเจอร์ทำงานไม่ครบ — บันทึกไว้ที่นี่แทน
>
> **4. ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้**
> - ช่องบังคับของฟอร์ม CN มี **7 ช่อง**: Vendor, GRN No., Credit Note Type, Reason, Doc Date, Tax Invoice #, Tax Invoice Date (`<FieldLabel required>` + schema) · ส่วน Currency/Exchange Rate ติดป้าย required แต่ `disabled` ถาวรเพราะยึดตาม GRN ต้นทาง
> - ช่องที่ `disabled` เสมอไม่ว่าโหมดไหน: GRN Date, Invoice No., Invoice Date, Currency, Exchange Rate (ทั้งหมดถูกเติมจาก GRN ที่เลือก)
> - เลือก GRN ใหม่ → `onItemChange` สั่ง `form.setValue("items", [], { shouldDirty: true })` = **รายการที่เพิ่มไว้หายทั้งหมด** ไม่มี dialog ถาม
> - ปุ่ม Add Item **กดได้เสมอ** ในโหมดแก้ไข/สร้าง ถ้ายังไม่ครบเงื่อนไขจะขึ้น toast บอกลำดับ ("Select a vendor first…" → "Select a GRN first…") ไม่ใช่ปุ่มจาง
> - กด Save/Create แล้วยังไม่มีรายการ → `useEffect` ที่ผูกกับ `submitCount` **เปิด dialog "Select from GRN" ให้อัตโนมัติ** เมื่อ `canAddItem` (มี GRN แล้ว) — ถ้ายังไม่มี GRN dialog จะไม่เปิด
> - toast ตอนกรอกไม่ครบมีสองข้อความคนละกรณี: `"{n} item(s) are still incomplete — jumped to the first field to fix."` เมื่อ error อยู่ในรายการ และ `"Some details are missing — jumped to the field to fix."` เมื่ออยู่ที่หัวใบ
> - Description จำกัด `maxLength={256}` ใน DOM (สเปก TC-CN-080003 กรอก 2,000 ตัวอักษร — เบราว์เซอร์ตัดเหลือ 256 ตั้งแต่ต้น เคสนั้นจึงไม่เคยทดสอบขีดจำกัดจริง)
> - ไฟล์แนบอยู่ใน **comment sheet** ไม่ใช่ปุ่ม "Upload Document" แยก · ชนิดที่อนุญาตคือ `image/jpeg, image/png, image/gif, image/webp, application/pdf, text/plain, text/csv` ขนาดไม่เกิน 10 MB — **`.jpg` เป็นชนิดที่อนุญาต** (สเปก TC-CN-090003 ระบุ `.jpg` เป็น "ไฟล์ประเภทที่ไม่ถูกต้อง" ซึ่งผิด) · เมนู More/comment จะ render ก็ต่อเมื่อใบถูกบันทึกแล้วเท่านั้น
> - สิทธิ์ของหน้านี้คือ `procurement.credit_note.*` (`constant/module-list.ts` → `usePermissionPrefix()` คืน `procurement.credit_note`) · `RouteGuard` บล็อก direct URL เมื่อไม่มี `.view` ด้วย `AccessDeniedBlock` ("Restricted" / "Permission Denied") ส่วนปุ่ม Edit/Create/Delete เมื่อขาดสิทธิ์จะ **ยังแสดงอยู่แต่จาง + `aria-disabled`** และกดแล้วเด้ง `PermissionDeniedDialog` ไม่ได้หายไปและไม่ได้ `disabled` — เคสของสเปกที่ assert `toBeDisabled()` จึงตรวจสิ่งที่ตรงข้ามกับที่โค้ดทำ
> - ตัวกรองยอดเงิน (`amount-range`) ประกาศ `toClause: () => ""` โดยตั้งใจ — chip ขึ้นแต่ไม่มี clause ส่งไป backend
> - หน้ารายการซ่อนคอลัมน์ Created / Updated ไว้ผ่าน `initialState.columnVisibility` และไม่มีคอลัมน์ checkbox (ส่ง `tableLayout` แค่ `{ headerSticky: true }`) · เรียงเริ่มต้น `cn_date:desc`
> - หมวด 01 เกือบทั้งหมดต้องรันบน **desktop viewport** — ปุ่ม Export / Print / Sort / Toggle columns / สลับมุมมอง ซ่อนด้วย breakpoint `sm:` และบนมือถือ `useIsMobile()` บังคับเป็น grid + infinite scroll
>
> **5. ช่วงเลขที่เลือก** section ที่ลงทะเบียนให้ `CN` คือ `01–11, 20–29, 30–39, 50–54, 90` ไฟล์นี้ใช้เฉพาะ section ที่ลงทะเบียนแล้ว: `01, 02, 03, 04, 05, 06, 08, 09, 10, 11, 20` — **ไม่ต้องลงทะเบียน section เพิ่ม** และไม่ต้องแก้ `docs/test-id-scheme.md` · section `20` ยังว่างทั้งบล็อก (สเปกใช้ `21`–`29` สำหรับเคส backend-only) จึงหยิบมาใช้เป็นหมวดสิทธิ์ ซึ่งตรงกับขนบ `20 = security/authorization` ของ repo นี้อยู่แล้ว · section `07` (Inventory Cost Review) ถูกเว้นไว้ทั้งบล็อกเพราะ UI ไม่มีหน้าวิเคราะห์ต้นทุนให้ตรวจ
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CN-010006 | หน้ารายการแสดงหัวเรื่อง จำนวนรวม และคอลัมน์ตามที่ประกอบไว้ | High | Smoke |
| TC-CN-010007 | เมนูตัวกรองมีครบ 6 ช่องแบ่งเป็นสามกลุ่ม | Medium | Functional |
| TC-CN-010008 | กรองสถานะ Draft แล้วทุกแถวเป็น Draft | High | Functional |
| TC-CN-010009 | ตัวกรองช่วงยอดเงินสร้าง chip และล้างได้ | Low | Functional |
| TC-CN-010010 | ค้นหาด้วยเลขที่ใบต้องกด Enter จึงจะยิง | Medium | Functional |
| TC-CN-010011 | เรียงเริ่มต้นตามวันที่เอกสารจากใหม่ไปเก่า | Medium | Functional |
| TC-CN-010012 | ส่งออกรายการเป็น XLSX 10 คอลัมน์ | Medium | Functional |
| TC-CN-010013 | กดส่งออกขณะรายการว่าง | Low | Edge Case |
| TC-CN-010014 | มุมมองการ์ดแสดงข้อมูลชุดเดียวกับตาราง | Low | Functional |
| TC-CN-010015 | เปิดใบจากรายการด้วยปุ่มลิงก์เลขที่ใบ | High | Smoke |
| TC-CN-020006 | โครงฟอร์มใบใหม่ — ช่องบังคับ 7 ช่องและช่องที่ถูกล็อก 5 ช่อง | High | Smoke |
| TC-CN-020007 | ช่อง GRN ปิดอยู่จนกว่าจะเลือกผู้ขาย | High | Functional |
| TC-CN-020008 | เลือก GRN แล้วเติมค่าอ้างอิงให้อัตโนมัติ | High | Functional |
| TC-CN-020009 | เปลี่ยน GRN แล้วรายการที่เพิ่มไว้ถูกล้างทั้งหมด | High | Edge Case |
| TC-CN-020010 | กด Create บนฟอร์มเปล่า | High | Validation |
| TC-CN-020011 | หัวใบครบแต่ยังไม่มีรายการ | High | Validation |
| TC-CN-020012 | ยกเลิกขณะมีการแก้ค้าง ขึ้น dialog ทิ้งงาน | Medium | Alternate Flow |
| TC-CN-020013 | ย้อนกลับขณะฟอร์มยังไม่ถูกแตะ ไม่มี dialog | Low | Alternate Flow |
| TC-CN-020014 | สร้างใบสำเร็จแล้วเด้งเข้าใบที่เพิ่งสร้าง | High | Happy Path |
| TC-CN-020015 | กด Submit จากใบใหม่ ขึ้น dialog ยืนยันก่อนเสมอ | High | Functional |
| TC-CN-030004 | dialog "Select from GRN" แสดงบรรทัดที่รับเข้าพร้อมจำนวนและราคา | High | Functional |
| TC-CN-030005 | ค้นหาในรายการบรรทัด GRN กรองทันทีที่พิมพ์ | Medium | Functional |
| TC-CN-030006 | บรรทัดที่รับมา 0 ติ๊กไม่ได้และติดป้าย Nothing received | Medium | Edge Case |
| TC-CN-030007 | บรรทัดที่เพิ่มไปแล้วติ๊กค้างและกดซ้ำไม่ได้ | Medium | Functional |
| TC-CN-030008 | เพิ่มหลายบรรทัดพร้อมกันแล้วเรียงตามที่เลือก | High | Happy Path |
| TC-CN-030009 | กด Add Item ก่อนเลือกผู้ขาย | Medium | Negative |
| TC-CN-030010 | กด Add Item ก่อนเลือก GRN | Medium | Negative |
| TC-CN-030011 | ปิด dialog แล้วเปิดใหม่ คำค้นและการติ๊กถูกรีเซ็ต | Low | Alternate Flow |
| TC-CN-040005 | เปิดใบที่มีอยู่ได้โหมดดูพร้อมหัวใบครบ | High | Smoke |
| TC-CN-040006 | เปิด id ที่ไม่มีอยู่ ได้หน้าไม่พบพร้อมทางออก | High | Negative |
| TC-CN-040007 | แท็บ Stock Movement บนใบที่ยังไม่ completed | Medium | Functional |
| TC-CN-040008 | ใบที่ล็อกแล้วไม่มีทั้งปุ่ม Edit และปุ่ม Submit | High | Functional |
| TC-CN-040009 | เมนู More มี Comment / Activity / Print | Medium | Functional |
| TC-CN-040010 | ปุ่มย้อนกลับพากลับหน้ารายการเสมอ แม้เปิดจาก deep link | Medium | Functional |
| TC-CN-050005 | กด Edit แล้วแถบปุ่มและช่องกรอกเปลี่ยนตามโหมด | High | Functional |
| TC-CN-050006 | แก้คำอธิบายแล้วบันทึก ค่าคงอยู่และเลขรุ่นเพิ่มขึ้น | High | CRUD |
| TC-CN-050007 | ยกเลิกการแก้ไขกลับโหมดดูพร้อมค่าเดิม ไม่ออกจากหน้า | Medium | Alternate Flow |
| TC-CN-050008 | ออกจากหน้าขณะแก้ค้าง ถูก navigation guard กั้น | Medium | Alternate Flow |
| TC-CN-050009 | ปุ่ม Delete โผล่เฉพาะโหมดแก้ไขและ dialog มีเลขที่ใบ | Medium | Functional |
| TC-CN-060006 | ทุกแถวกางไว้ตั้งแต่ต้นและสลับด้วยปุ่ม Collapse all | Medium | Functional |
| TC-CN-060007 | สูตรยอดของบรรทัดแบบ Quantity Return | High | Functional |
| TC-CN-060008 | คืนเกินจำนวนที่รับมา | High | Validation |
| TC-CN-060009 | จำนวนคืนเป็น 0 | High | Validation |
| TC-CN-060010 | สลับประเภทเป็น Amount Discount แล้วตารางเปลี่ยนช่องกรอก | High | Functional |
| TC-CN-060011 | Amount Discount ที่ยอดเป็น 0 | High | Validation |
| TC-CN-060012 | กรอกภาษีเองแล้วค่าไม่ถูกคำนวณทับ | Medium | Functional |
| TC-CN-060013 | ลบรายการออกจากใบ | High | CRUD |
| TC-CN-060014 | แถบสรุปยอดโผล่เมื่อมีรายการและมีครบ 5 ช่อง | Medium | Functional |
| TC-CN-060015 | โหมดดูไม่มีช่องกรอกและไม่มีปุ่มลบรายการ | Medium | Functional |
| TC-CN-080004 | dropdown Reason ไม่มีช่องค้นหาและไม่มีปุ่มโหลดเพิ่ม | Medium | Functional |
| TC-CN-080005 | ช่องคำอธิบายจำกัดความยาวที่ 256 ตัวอักษร | Low | Validation |
| TC-CN-080006 | ไม่เลือก Reason แล้วกดบันทึก | High | Validation |
| TC-CN-090006 | เปิดแผงคอมเมนต์จากเมนู More | Medium | Functional |
| TC-CN-090007 | เพิ่มคอมเมนต์แล้วจำนวนบนเมนูขยับ | Medium | Happy Path |
| TC-CN-090008 | แนบไฟล์ชนิดที่ไม่อนุญาตถูกปฏิเสธที่ฝั่ง client | Medium | Negative |
| TC-CN-090009 | ใบที่ยังไม่ถูกบันทึกไม่มีทางเข้าคอมเมนต์ | Low | Edge Case |
| TC-CN-100006 | ปุ่ม Submit โผล่เฉพาะใบ Draft และอยู่ที่แถบสรุปล่าง | High | Functional |
| TC-CN-100007 | กด Submit ขณะข้อมูลไม่ครบ | High | Negative |
| TC-CN-100008 | Submit สำเร็จแล้วกลับหน้ารายการพร้อมสถานะใหม่ | High | Happy Path |
| TC-CN-110006 | ลบใบจากหน้ารายละเอียด | High | CRUD |
| TC-CN-110007 | ลบใบจากเมนู Row actions ในหน้ารายการ | Medium | CRUD |
| TC-CN-200001 | ไม่มีสิทธิ์ดู — direct URL ถูก RouteGuard กั้น | High | Authorization |
| TC-CN-200002 | ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit จางและเด้ง Permission Denied | High | Authorization |
| TC-CN-200003 | ไม่มีสิทธิ์สร้าง — ปุ่ม Create เด้ง Permission Denied | High | Authorization |
| TC-CN-200004 | ไม่มีสิทธิ์ลบ — ปุ่ม Delete และเมนูแถวเด้ง Permission Denied | Medium | Authorization |

---

## TC-CN-010006 — หน้ารายการแสดงหัวเรื่อง จำนวนรวม และคอลัมน์ตามที่ประกอบไว้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น `purchase@blueledgers.com`; active BU = BLAVG; desktop viewport; มีใบลดหนี้อย่างน้อย 1 ใบใน BU
**Steps**
1. ไปที่ `/procurement/credit-note`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวหน้าแสดง "Credit Note" พร้อมคำอธิบาย "Goods or money claimed back from a vendor after delivery — returns and price corrections." และตัวเลขจำนวนรวมที่ตรงกับจำนวนระเบียนทั้งหมด · ตารางมีคอลัมน์ `#`, CN No., Vendor, Type, Created By, Doc Date, Status, Total Amount และคอลัมน์ปุ่มจัดการท้ายแถว · **ไม่มี**คอลัมน์ checkbox และ **ไม่มี**คอลัมน์ Created / Updated (ถูกซ่อนไว้ตั้งแต่ต้น) · ค่าในคอลัมน์ Total Amount จัดชิดขวาและมีรหัสสกุลเงินต่อท้าย

---

## TC-CN-010007 — เมนูตัวกรองมีครบ 6 ช่องแบ่งเป็นสามกลุ่ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note` บน desktop
**Steps**
1. กดปุ่ม "Filter"
2. ไล่ดูหัวข้อทั้งหมดในเมนู
**Expected**
เมนูแสดงช่องตัวกรอง 6 ช่องคือ Type, Status, Total Amount (กลุ่ม Document), Vendor, Created By (กลุ่ม People) และ Doc Date (กลุ่ม Date) — ไม่มากไม่น้อยกว่านี้ · ตัวเลือกของ Status มี 5 ค่าคือ draft, in progress, completed, cancelled, voided และของ Type มี 2 ค่าคือ QTY RETURN, AMT DISCOUNT

---

## TC-CN-010008 — กรองสถานะ Draft แล้วทุกแถวเป็น Draft
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note`; มีใบสถานะ draft อย่างน้อย 1 ใบและใบสถานะอื่นอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม "Filter" แล้วเลือกสถานะ draft
2. ปิดเมนู
**Expected**
รายการยิง query ใหม่ทันทีโดยไม่ต้องกดปุ่มยืนยัน · chip ของตัวกรองสถานะปรากฏใต้แถบเครื่องมือ และปุ่ม Filter มี badge เลข 1 · **ทุกแถว**ในตารางมีสถานะ draft และจำนวนรวมบนหัวหน้าลดลงจากค่าก่อนกรอง · กด Clear แล้วรายการกลับมาเท่าเดิมและ chip หายไป

---

## TC-CN-010009 — ตัวกรองช่วงยอดเงินสร้าง chip และล้างได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note` บน desktop
**Steps**
1. กดปุ่ม "Filter" แล้วกรอกช่วงยอดเงินในช่อง Total Amount
2. ปิดเมนู แล้วดูแถบ chip
3. กดกากบาทบน chip
**Expected**
chip ของช่วงยอดเงินปรากฏพร้อมค่าที่กรอก และ badge บนปุ่ม Filter นับรวมตัวกรองนี้ด้วย · กดกากบาทแล้ว chip หายและ badge ลดลง · (หมายเหตุสำหรับคนเขียนเทส: ตัวกรองนี้ประกาศ `toClause: () => ""` โดยตั้งใจ จึงไม่ต้อง assert ว่าจำนวนแถวเปลี่ยน — ให้ตรวจเฉพาะ chip กับ badge)

---

## TC-CN-010010 — ค้นหาด้วยเลขที่ใบต้องกด Enter จึงจะยิง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note`; จดเลขที่ใบของแถวแรกไว้
**Steps**
1. พิมพ์เลขที่ใบที่จดไว้ลงในช่องค้นหา โดยยังไม่กด Enter
2. กด Enter
**Expected**
ระหว่างพิมพ์รายการยังไม่เปลี่ยน · หลังกด Enter ตารางเหลือเฉพาะแถวที่มีเลขที่ใบตรงกับคำค้น และจำนวนรวมบนหัวหน้าอัปเดตตาม · ล้างช่องค้นหาแล้วกด Enter ซ้ำ รายการกลับมาเท่าเดิม

---

## TC-CN-010011 — เรียงเริ่มต้นตามวันที่เอกสารจากใหม่ไปเก่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note`; มีใบอย่างน้อย 3 ใบที่วันที่เอกสารไม่เท่ากัน
**Steps**
1. อ่านค่าคอลัมน์ Doc Date ของทุกแถวในหน้าแรก
2. กดหัวคอลัมน์ Doc Date เพื่อสลับทิศ
**Expected**
ก่อนกด ค่าของคอลัมน์ Doc Date เรียงจากใหม่ไปเก่า (ค่าตั้งต้น `cn_date:desc`) · หลังกดสลับทิศ ค่าเรียงจากเก่าไปใหม่และแถวบนสุดเปลี่ยนไป

---

## TC-CN-010012 — ส่งออกรายการเป็น XLSX 10 คอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note` บน desktop; มีใบอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม "Export"
2. รอให้ดาวน์โหลดเสร็จ
**Expected**
ปุ่มเปลี่ยนเป็น "Exporting..." ระหว่างทำงาน · ได้ไฟล์ชื่อขึ้นต้นด้วย `credit-note` นามสกุล `.xlsx` · ขึ้น toast "Exported {n} records" โดย n เท่ากับจำนวนระเบียนที่ตรงกับตัวกรองปัจจุบัน · ชีตชื่อ "Credit Notes" มี 10 คอลัมน์ตามลำดับ CN No., Vendor, Type, Doc Date, Status, Net Amount, Total Amount, Currency, Created By, Description

---

## TC-CN-010013 — กดส่งออกขณะรายการว่าง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/credit-note`; ใส่คำค้นที่ไม่มีทางตรงกับใบใด (เช่น `zzz-no-such-cn`) จนตารางว่าง
**Steps**
1. ยืนยันว่าตารางแสดง empty state
2. กดปุ่ม "Export"
**Expected**
ขึ้น toast ระดับ warning "No data to export" และ **ไม่มี**ไฟล์ถูกดาวน์โหลด

---

## TC-CN-010014 — มุมมองการ์ดแสดงข้อมูลชุดเดียวกับตาราง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note` บน desktop; มีใบอย่างน้อย 1 ใบ; จดค่าของแถวแรกไว้ (เลขที่ใบ, สถานะ, วันที่, ประเภท, ผู้ขาย, ยอดรวม)
**Steps**
1. กดปุ่มสลับมุมมองเป็น Grid
2. ดูการ์ดใบแรก
**Expected**
ตารางถูกแทนที่ด้วยการ์ด · หัวการ์ดคือเลขที่ใบ และในการ์ดมีแถว Status, Doc Date, Type, Vendor, Total Amount ตรงกับค่าที่จดไว้จากตาราง · แถบแบ่งหน้ายังอยู่ · กดหัวการ์ดแล้วเปิดหน้ารายละเอียดของใบเดียวกัน

---

## TC-CN-010015 — เปิดใบจากรายการด้วยปุ่มลิงก์เลขที่ใบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/procurement/credit-note`; มีใบอย่างน้อย 1 ใบ
**Steps**
1. คลิกค่าในคอลัมน์ CN No. ของแถวแรก
**Expected**
ค่าในคอลัมน์นั้นเป็น `<button>` ที่จัดสไตล์เหมือนลิงก์ (ไม่ใช่ `<a href>` — คลิกที่ `<tr>` ไม่เปิดอะไร) · URL เปลี่ยนเป็น `/procurement/credit-note/<uuid>` และหัวเอกสารแสดงเลขที่ใบเดียวกับที่คลิก · แยกจากเคสนี้: ปุ่ม "New Credit Note" บนแถบหัวพาไปที่ `/procurement/credit-note/new`

---

## TC-CN-020006 — โครงฟอร์มใบใหม่ — ช่องบังคับ 7 ช่องและช่องที่ถูกล็อก 5 ช่อง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น `purchase@blueledgers.com`; active BU = BLAVG
**Steps**
1. ไปที่ `/procurement/credit-note/new`
2. ไล่ดูช่องทั้งหมดในส่วนหัวฟอร์ม
**Expected**
หัวเอกสารแสดงคำว่า "Credit Note" (ยังไม่มีเลขที่ใบ) พร้อมชื่อผู้ใช้ที่ล็อกอินอยู่ใต้หัว และ**ไม่มี**แถบสถานะ/เลขรุ่น · ช่องที่ติดเครื่องหมายบังคับมี 7 ช่องคือ Vendor, GRN No., Credit Note Type, Reason, Doc Date, Tax Invoice #, Tax Invoice Date · ช่อง GRN Date, Invoice No., Invoice Date, Currency และ Exchange Rate อยู่ในสถานะ disabled แก้ไม่ได้ · Doc Date ถูกเติมเป็นวันที่ปัจจุบันให้แล้ว · Credit Note Type ตั้งต้นเป็น Quantity Return · แถบปุ่มมี Cancel และ Create (ไม่มี Save, ไม่มี Delete, ไม่มีเมนู More)

---

## TC-CN-020007 — ช่อง GRN ปิดอยู่จนกว่าจะเลือกผู้ขาย
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new` โดยยังไม่ได้เลือกผู้ขาย
**Steps**
1. พยายามเปิด dropdown ของช่อง GRN No.
2. เลือกผู้ขายที่มี GRN อยู่ในระบบ
3. เปิด dropdown ของช่อง GRN No. อีกครั้ง
**Expected**
ขั้นที่ 1 ช่อง GRN No. อยู่ในสถานะ disabled และ popover ไม่เปิด · หลังเลือกผู้ขายแล้ว ช่องเปิดใช้งานได้และ popover แสดงรายการ GRN ของผู้ขายรายนั้น โดยแต่ละบรรทัดมี badge เลขที่ GRN ตามด้วยเลขที่ใบกำกับ · มีช่องค้นหาในกล่องและเลื่อนลงจนสุดจะโหลดชุดถัดไปเอง

---

## TC-CN-020008 — เลือก GRN แล้วเติมค่าอ้างอิงให้อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; เลือกผู้ขายที่มี GRN แล้ว; เปิด GRN ต้นทางไว้อีกแท็บเพื่อจดวันที่ GRN, เลขที่ใบกำกับ, วันที่ใบกำกับ, สกุลเงินและอัตราแลกเปลี่ยน
**Steps**
1. เลือก GRN หนึ่งใบจาก dropdown
2. อ่านค่าในช่อง GRN Date, Invoice No., Invoice Date, Currency, Exchange Rate
**Expected**
ทั้งห้าช่องถูกเติมด้วยค่าจาก GRN ที่เลือกและยังคงสถานะ disabled (แก้เองไม่ได้) ตรงกับค่าที่จดไว้จาก GRN ต้นทาง · ช่อง Invoice No. ที่ว่างอยู่ก่อนหน้าจะแสดงข้อความตัวอย่าง "From the selected GRN" เมื่อ GRN ใบนั้นไม่มีเลขที่ใบกำกับ

---

## TC-CN-020009 — เปลี่ยน GRN แล้วรายการที่เพิ่มไว้ถูกล้างทั้งหมด
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; เลือกผู้ขายที่มี GRN อย่างน้อย 2 ใบ; เลือก GRN ใบแรกและเพิ่มรายการเข้ามาแล้วอย่างน้อย 1 บรรทัด
**Steps**
1. ยืนยันว่าตารางรายการมีบรรทัดอยู่
2. เปลี่ยนช่อง GRN No. ไปเป็น GRN ใบที่สอง
**Expected**
ตารางรายการกลับไปเป็นสถานะว่างทันทีพร้อมข้อความ "No Items Yet" / "Add items to this credit note." · แถบสรุปยอดด้านล่างหายไป · ไม่มี dialog ถามยืนยันก่อนล้าง (พฤติกรรมตามที่ออกแบบไว้) · ค่าอ้างอิงในช่อง GRN Date / Invoice No. / Currency เปลี่ยนไปตาม GRN ใบใหม่

---

## TC-CN-020010 — กด Create บนฟอร์มเปล่า
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/credit-note/new` โดยยังไม่กรอกอะไรเลย
**Steps**
1. กดปุ่ม "Create"
**Expected**
ขึ้น toast ระดับ warning "Some details are missing — jumped to the field to fix." · หน้าเลื่อนไปยังช่องบังคับช่องแรกที่ยังว่าง และช่องบังคับที่ว่างแสดงสถานะ `aria-invalid` พร้อมไอคอนเตือนในช่อง (ข้อความอยู่ใน tooltip ต้อง hover จึงอ่านได้) · URL ยังเป็น `/procurement/credit-note/new` · dialog "Select from GRN" **ไม่เปิด** เพราะยังไม่ได้เลือก GRN

---

## TC-CN-020011 — หัวใบครบแต่ยังไม่มีรายการ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; กรอกช่องบังคับครบทั้ง 7 ช่องแล้ว (รวมถึงเลือก GRN) แต่ยังไม่เพิ่มรายการ
**Steps**
1. กดปุ่ม "Create"
**Expected**
ขึ้นข้อความ "Items is required" เหนือตารางรายการในองค์ประกอบที่มี `role="alert"` · dialog "Select from GRN" **เปิดขึ้นเอง** ทันทีหลังกด · ใบยังไม่ถูกสร้าง (URL ยังเป็น `/new`) และไม่มี toast แจ้งสร้างสำเร็จ

---

## TC-CN-020012 — ยกเลิกขณะมีการแก้ค้าง ขึ้น dialog ทิ้งงาน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; กรอกไปแล้วอย่างน้อยหนึ่งช่อง (เช่นเลือกผู้ขาย)
**Steps**
1. กดปุ่ม "Cancel"
2. กด "Keep editing" ใน dialog
3. กด "Cancel" อีกครั้ง แล้วกด "Discard"
**Expected**
ขั้นที่ 1 ขึ้น alert dialog หัวข้อ "Discard changes?" ข้อความ "You have unsaved changes that will be lost." พร้อมปุ่ม "Keep editing" และ "Discard" · ขั้นที่ 2 dialog ปิดและค่าที่กรอกไว้ยังอยู่ครบ ยังอยู่หน้าเดิม · ขั้นที่ 3 หน้าเปลี่ยนไปที่ `/procurement/credit-note`

---

## TC-CN-020013 — ย้อนกลับขณะฟอร์มยังไม่ถูกแตะ ไม่มี dialog
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เพิ่งเปิด `/procurement/credit-note/new` โดยยังไม่แตะช่องใดเลย
**Steps**
1. กดปุ่มย้อนกลับ (Go back) ที่มุมซ้ายของหัวเอกสาร
**Expected**
กลับไปที่ `/procurement/credit-note` ทันทีโดย**ไม่มี** dialog "Discard changes?" ขึ้นมาคั่น

---

## TC-CN-020014 — สร้างใบสำเร็จแล้วเด้งเข้าใบที่เพิ่งสร้าง
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; กรอกช่องบังคับครบและเพิ่มรายการจาก GRN มาแล้วอย่างน้อย 1 บรรทัดพร้อมกรอกจำนวนคืน > 0; **สร้างข้อมูลจริง** — จะได้ใบลดหนี้ใหม่ 1 ใบทุกครั้งที่รัน
**Steps**
1. กดปุ่ม "Create"
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast "Credit Note created successfully" · URL เปลี่ยนเป็น `/procurement/credit-note/<uuid>` (แบบ replace) · หน้าเปิดในโหมดดู: หัวเอกสารแสดงเลขที่ใบที่ backend ออกให้ (ไม่ใช่คำว่า "Credit Note") พร้อมสถานะ draft และ "Edition 1" · กดปุ่ม Back ของเบราว์เซอร์แล้วต้องไม่ย้อนกลับไปหน้า `/new`

---

## TC-CN-020015 — กด Submit จากใบใหม่ ขึ้น dialog ยืนยันก่อนเสมอ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; กรอกครบและมีรายการอย่างน้อย 1 บรรทัดแล้ว (ยังไม่กด Create)
**Steps**
1. ดูแถบสรุปยอดด้านล่าง
2. กดปุ่ม "Submit"
3. กดปุ่มยกเลิกใน dialog
**Expected**
ปุ่ม "Submit" อยู่ที่แถบสรุปยอดล่างขวา (ไม่ได้อยู่บนหัวเอกสาร) และแสดงตั้งแต่ยังไม่บันทึกใบ · กดแล้วขึ้น dialog หัวข้อ "Submit Credit Note" ข้อความ "This will submit the credit note for approval. Are you sure?" พร้อมปุ่มยืนยันชื่อ "Submit" · กดยกเลิกแล้ว dialog ปิด ยังอยู่ที่ `/new` และยังไม่มีใบถูกสร้าง

---

## TC-CN-030004 — dialog "Select from GRN" แสดงบรรทัดที่รับเข้าพร้อมจำนวนและราคา
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; เลือกผู้ขายและ GRN ที่มีบรรทัดรับเข้าอย่างน้อย 2 บรรทัดแล้ว
**Steps**
1. กดปุ่ม "Add Item"
2. สำรวจโครงของ dialog
**Expected**
เปิด dialog หัวข้อ "Select from GRN" คำอธิบาย "Pick received lines from the referenced GRN to credit." · มีช่องค้นหา placeholder "Search product by code or name…" · แต่ละบรรทัดมี checkbox, ชื่อสินค้า, ชื่อคลังกับรหัสคลังเป็นบรรทัดรอง, จำนวนที่รับพร้อมหน่วย และราคาต่อหน่วย · ท้าย dialog แสดง "0 selected" และปุ่มเพิ่มมีป้ายว่า "Add" ในสถานะ disabled

---

## TC-CN-030005 — ค้นหาในรายการบรรทัด GRN กรองทันทีที่พิมพ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog "Select from GRN" ของ GRN ที่มีบรรทัดอย่างน้อย 2 บรรทัดที่ชื่อสินค้าต่างกัน; จดชื่อสินค้าของบรรทัดแรกไว้
**Steps**
1. พิมพ์บางส่วนของชื่อสินค้าที่จดไว้ลงในช่องค้นหา
2. พิมพ์ข้อความที่ไม่มีทางตรงกับอะไรเลย
**Expected**
ขั้นที่ 1 รายการถูกกรองทันทีระหว่างพิมพ์ (ไม่ต้องกด Enter) เหลือเฉพาะบรรทัดที่ชื่อสินค้า ชื่อท้องถิ่น ชื่อคลัง หรือรหัสคลังมีคำค้นนั้นอยู่ · ขั้นที่ 2 แสดง empty state "No lines in this GRN" / "The referenced GRN has no received lines to credit."

---

## TC-CN-030006 — บรรทัดที่รับมา 0 ติ๊กไม่ได้และติดป้าย Nothing received
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิด dialog "Select from GRN" ของ GRN ที่มีบรรทัดซึ่งจำนวนรับเข้าเป็น 0 อย่างน้อย 1 บรรทัด
**Steps**
1. หาบรรทัดที่คอลัมน์จำนวนแสดง 0
2. พยายามติ๊ก checkbox ของบรรทัดนั้น
**Expected**
บรรทัดนั้นแสดง badge "Nothing received" และทั้งแถวถูกทำให้จาง · checkbox อยู่ในสถานะ disabled ติ๊กไม่ติด และตัวนับที่ท้าย dialog ยังคงเป็น "0 selected"

---

## TC-CN-030007 — บรรทัดที่เพิ่มไปแล้วติ๊กค้างและกดซ้ำไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์ม CN ที่เลือก GRN แล้วและเพิ่มบรรทัดหนึ่งเข้ามาในตารางรายการแล้ว
**Steps**
1. กดปุ่ม "Add Item" เพื่อเปิด dialog อีกครั้ง
2. หาบรรทัดที่เพิ่งเพิ่มไป
**Expected**
บรรทัดนั้นแสดง badge "Added" · checkbox ถูกติ๊กไว้และอยู่ในสถานะ disabled (กดยกเลิกไม่ได้จากที่นี่) · ตัวนับ "n selected" ไม่นับบรรทัดนี้รวมเข้าไปด้วย

---

## TC-CN-030008 — เพิ่มหลายบรรทัดพร้อมกันแล้วเรียงตามที่เลือก
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิด dialog "Select from GRN" ของ GRN ที่มีบรรทัดเลือกได้อย่างน้อย 2 บรรทัด; ตารางรายการยังว่าง
**Steps**
1. ติ๊กบรรทัดแรก แล้วติ๊กบรรทัดที่สอง
2. กดปุ่มเพิ่ม
**Expected**
ระหว่างติ๊ก ตัวนับเปลี่ยนเป็น "1 selected" แล้ว "2 selected" และป้ายปุ่มเปลี่ยนเป็น "Add 1 item" แล้ว "Add 2 items" · หลังกด dialog ปิดและตารางรายการมี 2 แถว โดย**บรรทัดที่ติ๊กก่อนอยู่บนสุด** · ทุกแถวถูกเติมสินค้า คลัง หน่วย และราคาต่อหน่วยจาก GRN ให้แล้ว แต่ช่องจำนวนคืนเป็น **0** ทุกแถว · โฟกัสของคีย์บอร์ดอยู่ที่ช่องจำนวนคืนของแถวบนสุด

---

## TC-CN-030009 — กด Add Item ก่อนเลือกผู้ขาย
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/procurement/credit-note/new` โดยยังไม่เลือกผู้ขาย
**Steps**
1. กดปุ่ม "Add Item"
**Expected**
ปุ่ม "Add Item" **กดได้** (ไม่ได้ถูก disabled) แต่ผลลัพธ์คือ toast ระดับ warning "Select a vendor first — items come from that vendor's GRN." · dialog "Select from GRN" ไม่เปิด

---

## TC-CN-030010 — กด Add Item ก่อนเลือก GRN
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; เลือกผู้ขายแล้วแต่ยังไม่เลือก GRN
**Steps**
1. กดปุ่ม "Add Item"
**Expected**
ขึ้น toast ระดับ warning "Select a GRN first — items are picked from its received lines." (คนละข้อความกับกรณีไม่มีผู้ขาย) · dialog ไม่เปิด

---

## TC-CN-030011 — ปิด dialog แล้วเปิดใหม่ คำค้นและการติ๊กถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog "Select from GRN" ของ GRN ที่มีบรรทัดเลือกได้อย่างน้อย 2 บรรทัด
**Steps**
1. พิมพ์คำค้นลงในช่องค้นหา แล้วติ๊กหนึ่งบรรทัด
2. กดปุ่ม Cancel
3. กดปุ่ม "Add Item" เพื่อเปิด dialog ใหม่
**Expected**
ขั้นที่ 2 dialog ปิดและตารางรายการ**ไม่มี**แถวใหม่เพิ่มเข้ามา · ขั้นที่ 3 ช่องค้นหาว่าง รายการแสดงครบทุกบรรทัดอีกครั้ง ตัวนับกลับเป็น "0 selected" และปุ่มเพิ่มกลับไป disabled

---

## TC-CN-040005 — เปิดใบที่มีอยู่ได้โหมดดูพร้อมหัวใบครบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น `purchase@blueledgers.com`; มีใบลดหนี้สถานะ draft อย่างน้อย 1 ใบ
**Steps**
1. เปิดใบนั้นจากหน้ารายการ
2. สำรวจหัวเอกสารและแถบปุ่ม
**Expected**
หัวเอกสารแสดงเลขที่ใบเป็นหัวข้อหลัก ตามด้วยแถบคั่นที่มีสถานะของใบและข้อความ "Edition {n}" · ใต้หัวแสดงชื่อผู้สร้างพร้อมไอคอนรูปคน · แถบปุ่มมีเพียง "Edit" และ "More" — **ไม่มี** Save, Cancel หรือ Delete · ช่องในฟอร์มทั้งหมดอยู่ในสถานะอ่านอย่างเดียว · มีแท็บ "Items" และ "Stock Movement"

---

## TC-CN-040006 — เปิด id ที่ไม่มีอยู่ ได้หน้าไม่พบพร้อมทางออก
**Priority:** High · **Test Type:** Negative
**Preconditions**
Login เป็น `purchase@blueledgers.com`
**Steps**
1. ไปที่ `/procurement/credit-note/00000000-0000-4000-8000-000000000000` โดยตรง
2. รอให้หน้าโหลดเสร็จ
**Expected**
แสดงกล่อง `role="alert"` ที่มีหัวข้อ "Something went wrong" และข้อความ "Credit note not found" · มีปุ่ม "Back to list" ที่ลิงก์ไป `/procurement/credit-note` และปุ่ม "Go to dashboard" · **ไม่มี**ปุ่ม "Try again" (เพราะ 404 ถือเป็นทางตัน) · ไม่มีรหัส Error ID แสดง

---

## TC-CN-040007 — แท็บ Stock Movement บนใบที่ยังไม่ completed
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดดู
**Steps**
1. กดแท็บ "Stock Movement"
**Expected**
แท็บสลับได้และแสดง empty state ข้อความ "Stock movement shows after this credit note is completed" · ไม่มีตารางการเคลื่อนไหวสต๊อกและไม่มีข้อความแสดงข้อผิดพลาด · (ใบที่สถานะ completed จะแสดงข้อความอีกชุดคือ "Stock movement is not available yet" — ตรวจข้อความตามสถานะของใบที่ใช้ทดสอบ)

---

## TC-CN-040008 — ใบที่ล็อกแล้วไม่มีทั้งปุ่ม Edit และปุ่ม Submit
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบลดหนี้ที่สถานะเป็น completed, cancelled หรือ voided อย่างน้อย 1 ใบ
**Steps**
1. กรองรายการด้วยสถานะนั้นแล้วเปิดใบขึ้นมา
2. สำรวจแถบปุ่มบนหัวและแถบสรุปยอดด้านล่าง
**Expected**
หัวเอกสารแสดงสถานะที่ตรงกับที่กรอง · แถบปุ่มมีแต่ "More" — **ไม่มี**ปุ่ม "Edit" · แถบสรุปยอดด้านล่างแสดงยอดรวม แต่**ไม่มี**ปุ่ม "Submit" · เทียบกับใบ draft ที่มีทั้งสองปุ่ม

---

## TC-CN-040009 — เมนู More มี Comment / Activity / Print
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้ที่บันทึกแล้วในโหมดดู
**Steps**
1. กดปุ่ม "More"
2. เลือก "Activity"
**Expected**
เมนูมีสามรายการคือ "Comment" (มีตัวเลขในวงเล็บเมื่อใบนั้นมีคอมเมนต์), "Activity" และ "Print" · เลือก Activity แล้วเปิด sheet ที่หัวข้ออ้างถึงเลขที่ใบนี้ · เมื่อใบมีคอมเมนต์อยู่ ปุ่ม "More" จะมีจุดเล็ก ๆ แสดงอยู่ในแถวเดียวกับข้อความ

---

## TC-CN-040010 — ปุ่มย้อนกลับพากลับหน้ารายการเสมอ แม้เปิดจาก deep link
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
จดเลข uuid ของใบลดหนี้ใบหนึ่งไว้
**Steps**
1. ไปที่ `/dashboard`
2. พิมพ์ URL `/procurement/credit-note/<uuid>` ตรง ๆ เพื่อเข้าหน้ารายละเอียด
3. กดปุ่มย้อนกลับ (Go back) ที่มุมซ้ายของหัวเอกสาร
**Expected**
ถูกพาไปที่ `/procurement/credit-note` (ไม่ใช่ย้อนกลับไป `/dashboard` ตามประวัติเบราว์เซอร์) · กดครั้งเดียวถึงหน้ารายการทันที

---

## TC-CN-050005 — กด Edit แล้วแถบปุ่มและช่องกรอกเปลี่ยนตามโหมด
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดดู
**Steps**
1. กดปุ่ม "Edit"
2. สำรวจแถบปุ่มและช่องกรอก
**Expected**
ปุ่ม "Edit" หายไปและถูกแทนด้วย "Cancel", "Save" และ "Delete" · ช่อง Vendor, GRN No., Credit Note Type, Reason, Doc Date, Tax Invoice #, Tax Invoice Date และ Description แก้ไขได้ · ช่อง GRN Date, Invoice No., Invoice Date, Currency และ Exchange Rate **ยังคง** disabled · ตารางรายการมีปุ่ม "Add Item" และมีคอลัมน์ปุ่มถังขยะท้ายแถวโผล่ขึ้นมา

---

## TC-CN-050006 — แก้คำอธิบายแล้วบันทึก ค่าคงอยู่และเลขรุ่นเพิ่มขึ้น
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดแก้ไข; จดเลข "Edition" ปัจจุบันไว้; **แก้ข้อมูลจริง**
**Steps**
1. แก้ช่อง Description เป็นข้อความที่ไม่ซ้ำใคร
2. กดปุ่ม "Save"
3. รีโหลดหน้า
**Expected**
ขึ้น toast "Credit Note updated successfully" · ฟอร์มกลับสู่โหมดดู (ปุ่มกลับเป็น Edit + More) โดย**ไม่**ออกจากหน้า · เลข "Edition" บนหัวเพิ่มขึ้น 1 จากที่จดไว้ · หลังรีโหลด ช่อง Description ยังเป็นข้อความที่กรอกไว้

---

## TC-CN-050007 — ยกเลิกการแก้ไขกลับโหมดดูพร้อมค่าเดิม ไม่ออกจากหน้า
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดแก้ไข; จดค่าเดิมของช่อง Description ไว้
**Steps**
1. แก้ช่อง Description เป็นค่าใหม่
2. กดปุ่ม "Cancel"
3. กด "Discard" ใน dialog
**Expected**
ขั้นที่ 2 ขึ้น dialog "Discard changes?" · ขั้นที่ 3 ฟอร์มกลับสู่โหมดดูและ Description กลับไปเป็นค่าเดิมที่จดไว้ · URL ยังเป็น `/procurement/credit-note/<uuid>` — **ไม่**ถูกพากลับหน้ารายการ (ต่างจากการกด Cancel บนใบใหม่)

---

## TC-CN-050008 — ออกจากหน้าขณะแก้ค้าง ถูก navigation guard กั้น
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดแก้ไขและแก้ไปแล้วอย่างน้อยหนึ่งช่อง
**Steps**
1. คลิกลิงก์ไปหน้าอื่นในแอป (เช่นเมนูโมดูล)
2. กดปุ่มที่แปลว่าอยู่ต่อใน dialog
**Expected**
การเปลี่ยนหน้าถูกหยุดไว้และขึ้น dialog "Discard changes?" · หลังเลือกอยู่ต่อ ยังอยู่ที่หน้าเดิมในโหมดแก้ไขและค่าที่แก้ไว้ยังอยู่ครบ

---

## TC-CN-050009 — ปุ่ม Delete โผล่เฉพาะโหมดแก้ไขและ dialog มีเลขที่ใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดดู; จดเลขที่ใบไว้
**Steps**
1. ยืนยันว่าแถบปุ่มในโหมดดูไม่มีปุ่ม "Delete"
2. กด "Edit" แล้วกดปุ่ม "Delete"
3. กดปุ่ม Cancel ใน dialog
**Expected**
โหมดดูไม่มีปุ่ม Delete · หลังเข้าโหมดแก้ไขปุ่ม Delete ปรากฏ · กดแล้วขึ้น alert dialog หัวข้อ "Delete Credit Note" ข้อความ "Are you sure you want to delete credit note \"<เลขที่ใบ>\"? This action cannot be undone." โดยเลขที่ใบตรงกับที่จดไว้ · กด Cancel แล้ว dialog ปิดและใบยังอยู่

---

## TC-CN-060006 — ทุกแถวกางไว้ตั้งแต่ต้นและสลับด้วยปุ่ม Collapse all
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้ที่มีรายการอย่างน้อย 1 บรรทัด (โหมดดูหรือแก้ไขก็ได้)
**Steps**
1. ดูตารางรายการตอนเพิ่งเปิด
2. กดปุ่ม "Collapse all"
3. กดปุ่ม "Expand all"
**Expected**
ตอนเพิ่งเปิด ทุกแถวถูกกางอยู่แล้ว โดยแถวที่กางแสดงยอดฝั่ง GRN (Received, Price, Subtotal, Discount, Net, ชื่อโปรไฟล์ภาษี, Total) เป็นข้อความอ่านอย่างเดียวที่ตรงคอลัมน์กับแถวหลัก · กด Collapse all แล้วแถวที่กางหายทุกแถวและป้ายปุ่มเปลี่ยนเป็น "Expand all" · กดกลับแล้วกางคืนทุกแถว · ถ้ายังไม่รู้จำนวนที่รับจาก GRN ช่อง Received จะแสดง "—" ไม่ใช่ 0

---

## TC-CN-060007 — สูตรยอดของบรรทัดแบบ Quantity Return
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์ม CN ในโหมดแก้ไข/สร้าง ประเภท Quantity Return; เพิ่มรายการจาก GRN มา 1 บรรทัดที่มีราคาต่อหน่วย > 0 และจำนวนที่รับ ≥ 2; จดราคาต่อหน่วยและอัตราภาษีของบรรทัดไว้
**Steps**
1. กรอกจำนวนคืนเป็น 2
2. อ่านค่าในคอลัมน์ Subtotal, Discount, Net/CN amount, Tax, Total ของแถวนั้น
3. อ่านแถบสรุปยอดด้านล่าง
**Expected**
Subtotal = จำนวนคืน × ราคาต่อหน่วย (ปัดทศนิยม 2 ตำแหน่ง) · Net = Subtotal − Discount · Tax = Net × อัตราภาษี ÷ 100 · Total = Net + Tax · ทุกค่าอัปเดตทันทีเมื่อเปลี่ยนจำนวนคืน โดยไม่ต้องกดอะไรเพิ่ม · แถบสรุปยอดล่างแสดง Subtotal / Discount / Net / Tax / Grand Total ที่เท่ากับผลรวมของทุกแถว

---

## TC-CN-060008 — คืนเกินจำนวนที่รับมา
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ฟอร์ม CN ประเภท Quantity Return ที่มีรายการ 1 บรรทัดซึ่งรู้จำนวนที่รับ (คอลัมน์ Received ในแถวที่กางไม่ใช่ "—")
**Steps**
1. กรอกจำนวนคืนให้มากกว่าจำนวนที่รับ
2. กดปุ่ม Save (หรือ Create)
**Expected**
ช่องจำนวนคืนขึ้นกรอบแดงพร้อมไอคอนเตือนในช่อง และเมื่อ hover จะอ่านข้อความ "Cannot return more than received" ได้ · ขึ้น toast "1 item is still incomplete — jumped to the first field to fix." · ใบไม่ถูกบันทึกและไม่มี toast แจ้งสำเร็จ

---

## TC-CN-060009 — จำนวนคืนเป็น 0
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ฟอร์ม CN ประเภท Quantity Return ที่เพิ่งเพิ่มรายการจาก GRN มา 1 บรรทัด (จำนวนคืนยังเป็น 0 ตามค่าตั้งต้น)
**Steps**
1. กดปุ่ม Save (หรือ Create) โดยไม่แตะช่องจำนวนคืน
**Expected**
ช่องจำนวนคืนขึ้นกรอบแดง และข้อความที่อ่านได้จาก tooltip คือ "Return must be greater than 0" (คนละข้อความกับกรณีคืนเกิน) · ขึ้น toast แจ้งว่ามีรายการยังไม่ครบ · ใบไม่ถูกบันทึก

---

## TC-CN-060010 — สลับประเภทเป็น Amount Discount แล้วตารางเปลี่ยนช่องกรอก
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์ม CN ในโหมดแก้ไข/สร้าง ประเภท Quantity Return ที่มีรายการอย่างน้อย 1 บรรทัดและกรอกจำนวนคืนไว้แล้ว
**Steps**
1. เปลี่ยนช่อง Credit Note Type เป็น "Amount Discount"
2. ดูคอลัมน์ Received, Discount, Net/CN amount และ Tax ของแถวนั้น
**Expected**
คอลัมน์ Received ของแถวหลัก**ว่างเปล่า** (ไม่มีช่องกรอกจำนวนคืนอีกต่อไป) · คอลัมน์ Net/CN amount กลายเป็นช่องกรอกตัวเลขที่พิมพ์ได้ · คอลัมน์ Discount แสดง 0.00 เสมอและกรอกไม่ได้ · คอลัมน์ Tax กลายเป็นข้อความอ่านอย่างเดียว และ Subtotal เท่ากับค่าในช่อง Net · สลับกลับเป็น Quantity Return แล้วช่องจำนวนคืนกลับมา

---

## TC-CN-060011 — Amount Discount ที่ยอดเป็น 0
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ฟอร์ม CN ประเภท Amount Discount ที่มีรายการ 1 บรรทัดและปล่อยช่อง Net/CN amount เป็น 0
**Steps**
1. กดปุ่ม Save (หรือ Create)
**Expected**
ช่อง Net/CN amount ขึ้นกรอบแดงพร้อมไอคอนเตือน และข้อความที่อ่านได้คือ "Net Amount must be greater than 0" · ขึ้น toast แจ้งว่ามีรายการยังไม่ครบ · ใบไม่ถูกบันทึก · ช่องจำนวนคืนไม่ถูกตรวจในประเภทนี้ (ปล่อยเป็น 0 ได้)

---

## TC-CN-060012 — กรอกภาษีเองแล้วค่าไม่ถูกคำนวณทับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์ม CN ในโหมดแก้ไข ประเภท Quantity Return; มีรายการ 1 บรรทัดที่กรอกจำนวนคืน > 0 แล้วและมีอัตราภาษีติดมาจาก GRN
**Steps**
1. จดค่าที่ระบบคำนวณให้ในคอลัมน์ Tax
2. แก้ค่าในช่อง Tax เป็นตัวเลขอื่นที่ไม่เท่ากับค่าที่จด
3. เปลี่ยนจำนวนคืนเป็นค่าอื่น
**Expected**
หลังขั้นที่ 2 ค่าในช่อง Tax เป็นค่าที่กรอกเอง และ Total ของแถวเท่ากับ Net + Tax ที่กรอก · หลังขั้นที่ 3 ค่า Subtotal และ Net เปลี่ยนตามจำนวนคืนใหม่ แต่ช่อง Tax **ยังเป็นค่าที่กรอกเองไม่ถูกคำนวณทับ** และ Total = Net ใหม่ + Tax ที่กรอก · แถบสรุปยอดล่างสะท้อนค่าชุดเดียวกัน

---

## TC-CN-060013 — ลบรายการออกจากใบ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ฟอร์ม CN ในโหมดแก้ไขที่มีรายการอย่างน้อย 2 บรรทัด; จดชื่อสินค้าของแถวแรกและยอด Grand Total ไว้
**Steps**
1. กดปุ่มถังขยะท้ายแถวแรก
2. กดปุ่ม Cancel ใน dialog
3. กดปุ่มถังขยะอีกครั้งแล้วยืนยันการลบ
**Expected**
ขั้นที่ 1 ขึ้น alert dialog หัวข้อ "Delete Location" ที่คำอธิบายอ้างถึงชื่อสินค้าของแถวนั้น · ขั้นที่ 2 dialog ปิดและแถวยังอยู่ครบ · ขั้นที่ 3 แถวนั้นหายจากตาราง จำนวนแถวลดลง 1 และ Grand Total ในแถบสรุปลดลงเท่ากับ Total ของแถวที่ลบ · การลบยังไม่ถูกบันทึกจนกว่าจะกด Save

---

## TC-CN-060014 — แถบสรุปยอดโผล่เมื่อมีรายการและมีครบ 5 ช่อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; เลือกผู้ขายและ GRN แล้วแต่ยังไม่เพิ่มรายการ
**Steps**
1. ดูแถบล่างของหน้า
2. เพิ่มรายการจาก GRN 1 บรรทัดแล้วกรอกจำนวนคืน > 0
3. ดูแถบล่างอีกครั้ง
**Expected**
ขั้นที่ 1 แถบล่างไม่มีตัวเลขสรุป มีเพียงปุ่ม Submit ชิดขวา · ขั้นที่ 3 แถบล่างแสดงช่องสรุป 5 ช่องตามลำดับ Subtotal, Discount, Net, Tax, Grand Total โดย Grand Total เน้นหนาและมีรหัสสกุลเงินของ GRN ต่อท้าย · ค่า Discount ที่มากกว่า 0 แสดงเป็นเลขติดลบ

---

## TC-CN-060015 — โหมดดูไม่มีช่องกรอกและไม่มีปุ่มลบรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้ที่มีรายการอย่างน้อย 1 บรรทัดในโหมดดู
**Steps**
1. สำรวจตารางรายการ
**Expected**
ไม่มีปุ่ม "Add Item" เหนือตาราง · ไม่มีคอลัมน์ปุ่มถังขยะท้ายแถว · ช่องจำนวนคืน ช่อง Net และช่อง Tax เป็นข้อความอ่านอย่างเดียวทั้งหมด (ไม่มี `<input>` ให้พิมพ์) · ตารางยังกางแถวยอด GRN ไว้และพอดีจอโดยไม่ต้องเลื่อนแนวนอน

---

## TC-CN-080004 — dropdown Reason ไม่มีช่องค้นหาและไม่มีปุ่มโหลดเพิ่ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; BU มีเหตุผลใบลดหนี้อย่างน้อย 2 รายการ
**Steps**
1. เปิด dropdown ของช่อง Reason
2. เลือกเหตุผลหนึ่งรายการ
**Expected**
กล่องตัวเลือกแสดงรายชื่อเหตุผลเป็นรายการตรง ๆ โดย**ไม่มี**ช่องค้นหาและ**ไม่มี**ปุ่ม/พฤติกรรมโหลดเพิ่มเมื่อเลื่อนสุด (ต่างจาก dropdown ของ Vendor และ GRN ในฟอร์มเดียวกัน) · หลังเลือก ช่องแสดงชื่อเหตุผลที่เลือก และ hover แล้วขึ้น tooltip เป็นชื่อเต็มของเหตุผลนั้น

---

## TC-CN-080005 — ช่องคำอธิบายจำกัดความยาวที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`
**Steps**
1. พิมพ์ข้อความยาว 300 ตัวอักษรลงในช่อง Description
2. อ่านค่าที่อยู่ในช่อง
**Expected**
ค่าที่อยู่ในช่องยาว **256 ตัวอักษรพอดี** (ตัวที่ 257 เป็นต้นไปไม่ถูกรับตั้งแต่แรก ไม่ใช่ error หลังกด Save) · ไม่มีข้อความแจ้งข้อผิดพลาดขึ้น และช่องไม่ขึ้นสถานะ invalid

---

## TC-CN-080006 — ไม่เลือก Reason แล้วกดบันทึก
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`; กรอกช่องบังคับอื่นครบและมีรายการแล้ว แต่เว้นช่อง Reason ไว้
**Steps**
1. กดปุ่ม "Create"
2. hover ที่ช่อง Reason
**Expected**
ช่อง Reason ขึ้นสถานะ `aria-invalid` พร้อมไอคอนเตือนสีแดงที่มุมขวาในช่อง · hover แล้วขึ้น tooltip ข้อความ "Reason is required" · ขึ้น toast "Some details are missing — jumped to the field to fix." · ใบไม่ถูกสร้าง

---

## TC-CN-090006 — เปิดแผงคอมเมนต์จากเมนู More
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบลดหนี้ที่บันทึกแล้วในโหมดดู
**Steps**
1. กดปุ่ม "More" แล้วเลือก "Comment"
**Expected**
เปิด sheet ที่หัวข้อแสดงจำนวนคอมเมนต์ในรูปแบบ "Comments ({n})" · ถ้ายังไม่มีคอมเมนต์จะแสดง "No Comments Yet" / "You haven't created any comments yet." · ด้านล่างมีช่องพิมพ์ placeholder "Add comment..." พร้อมปุ่มคลิปหนีบกระดาษและปุ่มส่ง

---

## TC-CN-090007 — เพิ่มคอมเมนต์แล้วจำนวนบนเมนูขยับ
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
เปิดแผงคอมเมนต์ของใบลดหนี้ใบหนึ่ง; จดจำนวนคอมเมนต์ปัจจุบันไว้; **สร้างข้อมูลจริง**
**Steps**
1. พิมพ์ข้อความที่ไม่ซ้ำใครลงในช่องคอมเมนต์แล้วกด Enter
2. ปิด sheet แล้วเปิดเมนู "More" อีกครั้ง
**Expected**
ขึ้น toast "Comment added" · ข้อความที่พิมพ์ปรากฏในรายการคอมเมนต์พร้อมชื่อผู้เขียน และช่องพิมพ์ถูกล้าง · หัวข้อ sheet เปลี่ยนเป็น "Comments ({n+1})" · ในเมนู More รายการคอมเมนต์แสดงเป็น "Comment ({n+1})" และปุ่ม More มีจุดแจ้งเตือน

---

## TC-CN-090008 — แนบไฟล์ชนิดที่ไม่อนุญาตถูกปฏิเสธที่ฝั่ง client
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
เปิดแผงคอมเมนต์ของใบลดหนี้ใบหนึ่ง; เตรียมไฟล์สองไฟล์ — ไฟล์ `.exe` (หรือชนิดอื่นที่ไม่อยู่ในรายการอนุญาต) และไฟล์ `.png` เล็ก ๆ
**Steps**
1. กดปุ่มคลิปหนีบกระดาษแล้วเลือกไฟล์ `.exe`
2. กดปุ่มคลิปหนีบกระดาษอีกครั้งแล้วเลือกไฟล์ `.png`
**Expected**
ขั้นที่ 1 ขึ้น toast ระดับ warning ข้อความ `"<ชื่อไฟล์>" — only images and documents are allowed` และ**ไม่มี**ชิปไฟล์แนบเพิ่มเหนือช่องพิมพ์ · ขั้นที่ 2 ไฟล์ `.png` ถูกรับและชิปที่มีชื่อไฟล์พร้อมปุ่มกากบาทปรากฏขึ้น (หมายเหตุ: `.jpg`/`.png`/`.gif`/`.webp`/`.pdf`/`.txt`/`.csv` เป็นชนิดที่อนุญาต ห้ามใช้เป็นไฟล์ตัวอย่างของเคสนี้) · ไฟล์ที่ใหญ่เกิน 10 MB จะได้ข้อความอีกชุดคือ `"<ชื่อไฟล์>" exceeds 10 MB limit`

---

## TC-CN-090009 — ใบที่ยังไม่ถูกบันทึกไม่มีทางเข้าคอมเมนต์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/credit-note/new`
**Steps**
1. สำรวจแถบปุ่มบนหัวเอกสาร
**Expected**
แถบปุ่มมีเพียง Cancel และ Create — **ไม่มี**ปุ่ม "More" เลย จึงไม่มีทางเข้าคอมเมนต์ Activity หรือ Print ก่อนที่ใบจะถูกบันทึก (พฤติกรรมตามที่ออกแบบไว้: เมนูนี้ผูกกับ id ของเอกสาร)

---

## TC-CN-100006 — ปุ่ม Submit โผล่เฉพาะใบ Draft และอยู่ที่แถบสรุปล่าง
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบลดหนี้สถานะ draft อย่างน้อย 1 ใบ และใบที่สถานะไม่ใช่ draft อย่างน้อย 1 ใบ
**Steps**
1. เปิดใบ draft แล้วดูทั้งหัวเอกสารและแถบล่าง
2. เปิดใบที่สถานะไม่ใช่ draft แล้วดูเช่นกัน
**Expected**
ใบ draft: มีปุ่ม "Submit" ที่แถบสรุปยอดล่างขวาเท่านั้น และ**ไม่มี**ปุ่มชื่อ "Commit" หรือ "Void" ที่ใดในหน้า · ใบที่สถานะไม่ใช่ draft: ไม่มีปุ่ม "Submit" เลย

---

## TC-CN-100007 — กด Submit ขณะข้อมูลไม่ครบ
**Priority:** High · **Test Type:** Negative
**Preconditions**
เปิดใบลดหนี้สถานะ draft ในโหมดแก้ไข แล้วลบค่าในช่องบังคับหนึ่งช่องออก (เช่น Tax Invoice #)
**Steps**
1. กดปุ่ม "Submit" ที่แถบล่าง
2. กดยืนยันใน dialog
**Expected**
dialog "Submit Credit Note" ปิดลง · ขึ้น toast แจ้งว่ายังกรอกไม่ครบ ("Some details are missing — jumped to the field to fix." หรือข้อความแบบนับจำนวนรายการเมื่อ error อยู่ในตาราง) และหน้าเลื่อนไปยังช่องที่ขาด · สถานะของใบ**ยังเป็น draft** หลังรีโหลด และเลข Edition ไม่เปลี่ยน

---

## TC-CN-100008 — Submit สำเร็จแล้วกลับหน้ารายการพร้อมสถานะใหม่
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีใบลดหนี้สถานะ draft ที่กรอกครบและมีรายการถูกต้อง (แนะนำให้สร้างใหม่ในเทสเดียวกันเพื่อไม่กินใบของคนอื่น); จดเลขที่ใบไว้; **เปลี่ยนสถานะจริงและย้อนไม่ได้**
**Steps**
1. กดปุ่ม "Submit"
2. กดยืนยันใน dialog
3. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast "Credit Note submitted successfully" · หน้าเปลี่ยนไปที่ `/procurement/credit-note` · แถวของเลขที่ใบที่จดไว้แสดงสถานะที่**ไม่ใช่ draft** อีกต่อไป · เปิดใบนั้นซ้ำแล้วไม่มีปุ่ม "Submit" ให้กดอีก

---

## TC-CN-110006 — ลบใบจากหน้ารายละเอียด
**Priority:** High · **Test Type:** CRUD
**Preconditions**
สร้างใบลดหนี้ draft ขึ้นมาใหม่สำหรับเคสนี้โดยเฉพาะ; จดเลขที่ใบไว้; **ลบข้อมูลจริง**
**Steps**
1. เปิดใบนั้น กด "Edit" แล้วกด "Delete"
2. กดปุ่มยืนยันการลบใน dialog
**Expected**
ขึ้น toast "Credit Note deleted successfully" · หน้าเปลี่ยนไปที่ `/procurement/credit-note` · ค้นหาด้วยเลขที่ใบที่จดไว้แล้วไม่พบแถวนั้นอีก · เปิด URL `/procurement/credit-note/<uuid>` ของใบที่ลบไปแล้ว ได้หน้า "Credit note not found"

---

## TC-CN-110007 — ลบใบจากเมนู Row actions ในหน้ารายการ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
สร้างใบลดหนี้ draft ขึ้นมาใหม่สำหรับเคสนี้โดยเฉพาะ; อยู่ที่ `/procurement/credit-note` บน desktop; จดจำนวนรวมบนหัวหน้าไว้; **ลบข้อมูลจริง**
**Steps**
1. กดปุ่มเมนูท้ายแถวของใบนั้น (aria-label "Row actions")
2. เลือก "Delete"
3. กดปุ่มยืนยันในกล่อง
**Expected**
เมนูมีรายการ "Activity" และ "Delete" (ไม่มี "Edit" — เปิดใบด้วยการคลิกเลขที่ใบแทน) · กล่องยืนยันมีหัวข้อ "Delete Credit Note" และข้อความอ้างถึงเลขที่ใบนั้น · หลังยืนยัน แถวหายจากตารางทันทีและขึ้น toast "Credit Note deleted successfully" · จำนวนรวมบนหัวหน้าลดลง 1 หลังรีเฟรช

---

## TC-CN-200001 — ไม่มีสิทธิ์ดู — direct URL ถูก RouteGuard กั้น
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็นผู้ใช้ที่**ไม่มี**สิทธิ์ `procurement.credit_note.view` และไม่ใช่ admin (เตรียมบทบาทให้ตรงก่อนรัน — `requestor@blueledgers.com` ต้องถูกยืนยันว่าไม่มีสิทธิ์นี้จริง ไม่งั้นเคสจะผ่านด้วยเหตุผลที่ผิด)
**Steps**
1. ไปที่ `/procurement/credit-note` โดยพิมพ์ URL ตรง ๆ
**Expected**
แสดงกล่อง `role="alert"` ที่มีคำกำกับ "Restricted" หัวข้อ "Permission Denied" ข้อความ "You don't have permission to view this page." และบรรทัด "Contact your administrator to request access." พร้อมปุ่มทางออก · **ไม่มี**ตารางรายการและไม่มีปุ่ม "New Credit Note" · เมนูโมดูลไม่มีรายการ Credit Note ให้กด

---

## TC-CN-200002 — ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit จางและเด้ง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็นผู้ใช้ที่มีสิทธิ์ `procurement.credit_note.view` แต่**ไม่มี** `.update` และไม่ใช่ admin; เปิดใบลดหนี้สถานะ draft ในโหมดดู
**Steps**
1. สำรวจปุ่ม "Edit"
2. กดปุ่ม "Edit"
**Expected**
ปุ่ม "Edit" **ยังแสดงอยู่** แต่ถูกทำให้จางและมี `aria-disabled` — ไม่ได้หายไปและไม่ได้ตั้ง `disabled` (นี่คือจุดที่ TC-CN-050003 ของสเปกเข้าใจผิด) · กดแล้วขึ้น alert dialog "Permission Denied" ข้อความ "You don't have permission to perform this action." · ฟอร์ม**ไม่**เข้าโหมดแก้ไข (ปุ่ม Save/Cancel ไม่โผล่)

---

## TC-CN-200003 — ไม่มีสิทธิ์สร้าง — ปุ่ม Create เด้ง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็นผู้ใช้ที่มี `.view` แต่**ไม่มี** `procurement.credit_note.create` และไม่ใช่ admin
**Steps**
1. ไปที่ `/procurement/credit-note/new`
2. กรอกช่องบังคับพอประมาณแล้วกดปุ่ม "Create"
**Expected**
หน้าฟอร์มเปิดได้ตามปกติ · ปุ่ม "Create" แสดงอยู่แต่จางและมี `aria-disabled` · กดแล้วขึ้น dialog "Permission Denied" และ**ไม่มี** request สร้างใบถูกยิง (ไม่มี toast "Credit Note created successfully" และ URL ยังเป็น `/new`)

---

## TC-CN-200004 — ไม่มีสิทธิ์ลบ — ปุ่ม Delete และเมนูแถวเด้ง Permission Denied
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็นผู้ใช้ที่มี `.view` และ `.update` แต่**ไม่มี** `procurement.credit_note.delete` และไม่ใช่ admin
**Steps**
1. เปิดใบลดหนี้ draft กด "Edit" แล้วกดปุ่ม "Delete"
2. กลับไปหน้ารายการ เปิดเมนู Row actions ของแถวหนึ่งแล้วกด "Delete"
**Expected**
ทั้งสองทางขึ้น dialog "Permission Denied" เหมือนกัน · ปุ่ม Delete บนหัวเอกสารจางและมี `aria-disabled` แต่ยังคลิกได้ (จึงจะเด้ง dialog ได้) · **ไม่มี**กล่องยืนยันการลบปรากฏ และใบยังอยู่ครบหลังรีเฟรช
