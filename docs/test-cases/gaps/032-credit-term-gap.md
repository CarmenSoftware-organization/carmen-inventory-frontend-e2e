# Credit Term — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/032-credit-term.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/032-credit-term.md`_

**Module:** Config — Credit Term (เงื่อนไขการชำระเงิน)
**Frontend route:** `routes/config/credit-term`  •  **URL:** `/config/credit-term`
**Prefix:** `CT`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/032-credit-term.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 31

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/032-credit-term.spec.ts` ถือ ID `TC-CT-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-CT-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip` — เลขถูกจองแล้ว ห้ามนำกลับมาใช้) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, create/edit name/delete ครบรอบ, toggle `is_active` แล้ว persist, แก้ชื่อแล้ว persist, ยกเลิกการแก้ไขแล้วค่าไม่ถูกบันทึก, ยกเลิกการลบ, name ว่างทั้งตอนสร้างและตอนแก้, name ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 02/30/90 ใช้ไม่ได้กับ prefix `CT`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `032-credit-term.spec.ts` ไว้แค่ `01, 03–05, 10, 20` (บรรทัดที่ 34) เคส Export (ขนบคือบล็อก 30), เคส integration ข้ามโมดูลกับ PO/GRN (ขนบคือ 30) และเคส edge (ขนบคือ 90) จึงถูกจัดไว้ในบล็อก **01** ทั้งหมด ตามกติกาใน [`README.md`](README.md) — **เอกสารนี้ไม่ได้แก้ scheme** ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `032-credit-term.spec.ts` ใน scheme ก่อน
> 3. **ช่อง "Days" (`#credit-term-value`) validate คนละแบบกับทั้ง unit และ tax-profile** — ยืนยันจาก `credit-term-form-schema.ts` + `credit-term-dialog.tsx`:
>    - สคีมาคือ `z.coerce.number().min(1, tv("minNumber", { field: tf("creditTermDays"), min: 1 }))` — **ไม่มี `.catch()`** ต่างจาก unit ที่ `.catch(0)` กลืนค่าผิดเงียบ ๆ ดังนั้น `min(1)` บล็อกการ submit ได้จริงและมีข้อความ error อยู่ในสคีมา (`Days must be at least 1`)
>    - **แต่ข้อความนั้นไม่มีทางถูกแสดง** — dialog render ช่องนี้ด้วย `<Input>` ธรรมดาและ **ไม่ได้ส่ง prop `error`** ต่างจาก tax-profile ที่ใช้ `<FieldInput ... error={form.formState.errors.tax_rate?.message} />` (ได้กรอบแดง + ไอคอน `CircleAlert` + tooltip) ผลคือไม่มี `aria-invalid`, ไม่มีกรอบแดง, ไม่มีข้อความใด ๆ ผู้ใช้เห็นแค่ "กด Create แล้ว dialog ไม่ปิด"
>    - ไม่มี attribute `min` / `max` / `step` บน input (unit มี `min=0 max=5 step=1`) และปุ่มลูกศรถูกซ่อนด้วย CSS ใน `components/ui/input.tsx` (`[appearance:textfield]` + `::-webkit-*-spin-button`) → **ไม่มีด่านฝั่งเบราว์เซอร์เลย**
>    - `form.register("value")` ไม่ได้ใช้ `{ valueAsNumber: true }` (tax-profile ใช้) จึงพึ่ง `z.coerce` แปลง string → number
>    - เคส `TC-CT-200004` / `TC-CT-200005` จึง assert เฉพาะสิ่งที่ UI แสดงตามออกแบบ (ไม่ถูกสร้าง + dialog ยังเปิดอยู่) **ไม่ assert ว่ามีข้อความ error**
>    - สคีมาไม่มี `.int()` → ค่าทศนิยมผ่านชั้นสคีมา แต่ `<input type="number">` ไม่ได้ตั้ง `step` (ค่า default ของ HTML คือ `1`) และ `<form>` ใน `config-entity-dialog.tsx` ไม่ได้ตั้ง `noValidate` ผลลัพธ์จริงของการกรอกทศนิยมจึงขึ้นกับ native constraint validation ของเบราว์เซอร์ — **ยังไม่เขียนเป็นเทสเคสเพราะต้องยืนยันด้วยการรันจริงก่อน ไม่ใช่เดา**
> 4. **BLOCKER — ผลกระทบต่อเอกสารที่อ้าง credit term อยู่** (`components/lookup/lookup-credit-term.tsx`, `routes/procurement/purchase-order/po-general-fields.tsx`, `routes/procurement/goods-receive-note/grn-form-header.tsx`):
>    - PO และ GRN **เก็บ snapshot** ไว้บนตัวเอกสาร (`credit_term_id` + `credit_term_name` + `credit_term_value` ของ PO / `credit_term_days` ของ GRN) การแก้ชื่อหรือจำนวนวันของ credit term จึง **ไม่** ย้อนไปเปลี่ยนเอกสารที่บันทึกไว้แล้ว
>    - แต่ `LookupCreditTerm` สร้างรายการจาก `useCreditTerm({ perpage: 30 })` แล้ว `.filter((c) => c.is_active)` — **ไม่มีช่องค้นหา และจำกัดแค่ 30 รายการแรก** เมื่อ credit term ถูกลบหรือปิดใช้งาน `<Select value={credit_term_id}>` ของเอกสารเก่าจะไม่มี `SelectItem` ที่ตรง → trigger แสดง placeholder แทนชื่อเดิม ทั้งที่ค่ายังอยู่ใน form state การเปิดเอกสารเก่ามาแก้จึงเสี่ยงบันทึกทับด้วยค่าว่าง
>    - **เคสที่ต้องลบ/ปิดใช้งาน credit term ที่ถูกอ้างโดย PO/GRN จริงจึงถูกกันไว้ ไม่เขียนในรอบนี้** — ต้องออกแบบ cleanup ให้ปลอดภัยก่อน เคสทุกเคสในไฟล์นี้ใช้ credit term ที่เทสสร้างขึ้นเองและไม่เคยถูกอ้างโดยเอกสารใด
>    - เพดาน 30 รายการมีผลกับ `TC-CT-010019` / `TC-CT-010021` ด้วย — precondition จึงระบุว่า BU ต้องมี credit term ที่ active ไม่เกิน 30 รายการ
> 5. **Permission prefix ของหน้านี้ไม่ใช่ของตัวเอง** — `constant/module-list.ts` ระบุ leaf ของ credit term ว่า `permission: PERMISSIONS.configuration.view` (คีย์ระดับบนสุด) ไม่ใช่ `configuration.credit_term.view` `usePermissionPrefix()` ตัด `.view` ออกจึงได้ prefix = `"configuration"` แล้ว `ConfigListTemplate` / `useDeleteGate` สร้างคีย์เป็น **`configuration.create` / `configuration.update` / `configuration.delete`** ซึ่ง **ไม่มีอยู่ใน `constant/permissions.ts`** (ที่นั่นมีแค่ `configuration.view` + คีย์ราย resource) ต่างจาก unit (`product_management.unit.*`) และ shelf (`configuration.shelf.*`) — เคส `TC-CT-100005..100007` จึงอ้างคีย์ชุดนี้ตรง ๆ และเป็นเหตุให้ผู้ใช้ non-admin ที่ backend ไม่ได้ให้คีย์เหล่านี้จะถูกกั้นเสมอ (admin ของ BU bypass ทุก permission — ดู `hooks/use-can.ts`)
> 6. **License `configuration.credit_term` ไม่ได้เขียนเป็นเคส** — leaf นี้มี `licenseFeature: "configuration.credit_term"` BU ที่ไม่มี feature นี้จะโดน `RouteGuard` แสดง `AccessDeniedBlock` เหตุผล license (**ไม่มี admin bypass**) และเมนูใน sidebar กลายเป็นปุ่มจางพร้อมไอคอนแม่กุญแจ — ไม่เขียนเป็นเคสเพราะยังไม่ยืนยันว่ามี BU ทดสอบที่ไม่มี feature นี้ บันทึกไว้ที่นี่เป็นข้อเท็จจริง
> 7. **เมนู Row actions ของ credit term ไม่มี Edit** — `useCreditTermTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` → `actionColumn` render เฉพาะ Activity + Delete ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction`) หรือคลิกเนื้อการ์ดเท่านั้น
> 8. **แถวคอลัมน์สถานะในเมนูเรียงลำดับแสดงเป็นรหัสคอลัมน์** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ไม่ได้ตั้ง `meta.headerTitle` และ `DataGridSortMenu` ใช้สูตร `meta?.headerTitle || column.id` แถวนั้นจึงอ่านว่า `is_active` `TC-CT-010011` จึงไม่ assert ป้ายของแถวนั้น บันทึกไว้เป็นข้อเท็จจริงแทน
> 9. **ต่างจาก `083-shelf.md` ที่ใช้เป็นเช็กลิสต์** — credit term **ไม่มีฟิลด์ `code` และไม่มีฟิลด์ลำดับ** ฟอร์มมีแค่ Name (บังคับ, maxLength 100), Days (บังคับ, number), Description (textarea, maxLength 256) และ status switch ทุกเคสที่ shelf ผูกกับ code/order จึงถูกแปลงมาเป็น **Days** และอีกอย่างคือ credit term **มี `defaultSort="name:asc"`** (unit ไม่มี default sort) พฤติกรรมของเมนูเรียงลำดับจึงต่างกัน — ยืนยันจาก `credit-term-component.tsx`
> 10. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CT-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-CT-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-CT-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-CT-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-CT-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-CT-010011 | เรียงลำดับเริ่มต้นตามชื่อ สลับทิศ และแถว Default | Medium | Functional |
| TC-CT-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-CT-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-CT-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-CT-010015 | ส่งออกรายการเงื่อนไขการชำระเงินเป็นไฟล์ XLSX | Medium | Functional |
| TC-CT-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-CT-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-CT-010018 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-CT-010019 | เงื่อนไขการชำระเงินที่สร้างใหม่ปรากฏในตัวเลือกของฟอร์ม PO | Medium | Functional |
| TC-CT-010020 | เลือกเงื่อนไขการชำระเงินในฟอร์ม GRN แล้ว Due Date ถูกคำนวณจากจำนวนวัน | Medium | Functional |
| TC-CT-010021 | รายการที่ปิดใช้งานไม่ปรากฏในตัวเลือกของ PO / GRN | Medium | Functional |
| TC-CT-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-CT-030003 | สร้างพร้อมจำนวนวันและคำอธิบาย แล้วค่าถูกบันทึกจริง | Medium | Happy Path |
| TC-CT-030004 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-CT-040005 | แก้ไขจำนวนวันแล้วค่าคงอยู่ทั้งในตารางและ dialog | Medium | CRUD |
| TC-CT-040006 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-CT-050003 | ข้อความยืนยันลบแสดงชื่อเงื่อนไขการชำระเงิน | Medium | Functional |
| TC-CT-050004 | ลบรายการจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-CT-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-CT-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-CT-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-CT-100008 | ไม่มีสิทธิ์ดู — deep link ถูกกั้นและเมนู sidebar เป็นปุ่มจาง | High | Authorization |
| TC-CT-200004 | เว้นจำนวนวันว่างหรือเป็น 0 แล้วบันทึกไม่ได้ | High | Validation |
| TC-CT-200005 | จำนวนวันติดลบแล้วบันทึกไม่ได้ | Medium | Validation |
| TC-CT-200006 | ช่องจำนวนวันไม่มีด่านจำกัดค่าที่ตัว input | Medium | Validation |
| TC-CT-200007 | ช่องคำอธิบายจำกัดความยาว 256 ตัวอักษรพร้อมตัวนับ | Low | Validation |

---
## TC-CT-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีเงื่อนไขการชำระเงินอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/credit-term`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Credit Term" พร้อมคำอธิบาย "How long you have to pay each vendor — cash, 30 days, 60 days."; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Name, Days (หัวและค่าชิดขวา), Description, Status (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Credit Term"

---
## TC-CT-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term`; มีรายการหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับรายการที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` ยิง `onSearch` เฉพาะตอน Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-CT-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search..."); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-CT-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term`; มีรายการทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
**Expected**
ตารางเหลือเฉพาะรายการที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip "Status Active" พร้อมปุ่มลบ (aria-label "Remove Status filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน (ตัวเลือกของหน้านี้มีเพียง Active / Inactive ตาม `CREDIT_TERM_FILTER_FIELDS`)

---
## TC-CT-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-CT-010011 — เรียงลำดับเริ่มต้นตามชื่อ สลับทิศ และแถว Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/credit-term` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีรายการอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายการในเมนู
3. เลือก "Name"
4. เลือกแถว "Default"
**Expected**
หน้านี้**มี default sort เป็น `name:asc`** (ต่างจาก unit ที่ไม่มี) — เข้าครั้งแรก URL ยังไม่มี `sort` แต่แถวเรียงตามชื่อจาก A→Z, แถว "Default" มีเครื่องหมายกำกับ และแถว Name มีลูกศรขึ้นกำกับอยู่แล้ว; เมนูมีแถว Name, Days, Description, Created, Updated (และแถวของคอลัมน์สถานะ — ดูหมายเหตุข้อ 8); เลือก "Name" ขณะที่กำลังเรียง asc อยู่ได้ `sort=name:desc` ใน URL พร้อมลูกศรลงและลำดับแถวสลับ; เลือก "Default" ล้าง `sort` และ `page` ออกจาก URL แล้วกลับไปเรียงตาม `name:asc`

---
## TC-CT-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` บนหน้าจอขนาด desktop; มีรายการอย่างน้อย 1 รายการที่กรอก Description และจำนวนวันไว้
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อเป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว **"Credit Term"** ที่แสดงค่าเป็นตัวเลขตามด้วยคำว่า "Days" (เช่น `30 Days`, แสดงเฉพาะเมื่อ `value` ไม่ว่าง), แถว Description (แสดงเฉพาะเมื่อมีค่า) และแถว Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-CT-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Days
**Expected**
เมนูแสดงรายการ Name, Days, Description, Created, Updated พร้อม checkbox; Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น (ตรงกับ `initialState.columnVisibility` ของ `useCreditTermTable`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Days แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-CT-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` ในมุมมองตาราง; BU มีเงื่อนไขการชำระเงินมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-CT-010015 — ส่งออกรายการเงื่อนไขการชำระเงินเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term` บน desktop; มีรายการอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ชื่อขึ้นต้นด้วย `creditTerm_<YYYY-MM-DD>` ที่มี 4 คอลัมน์ตามลำดับ Name / Days / Description / Status (Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false และ Days ที่ว่างถูกส่งออกเป็น `0`); ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-CT-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/credit-term` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state)
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-CT-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/credit-term` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่อง "View name" และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-CT-010018 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/credit-term` และมีรายการอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name เท่านั้น); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมของแถวนั้นโดยหัวเรื่องอ้างชื่อเงื่อนไขการชำระเงิน และปิด sheet กลับมาหน้าเดิมได้โดยข้อมูลไม่เปลี่ยน

---
## TC-CT-010019 — เงื่อนไขการชำระเงินที่สร้างใหม่ปรากฏในตัวเลือกของฟอร์ม PO
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; **BU มีเงื่อนไขการชำระเงินที่ active ไม่เกิน 30 รายการ** (`LookupCreditTerm` ดึงมาแค่ `perpage: 30` และไม่มีช่องค้นหา — ดูหมายเหตุข้อ 4); สร้างรายการใหม่ชื่อไม่ซ้ำพร้อมจำนวนวัน 30 และสถานะเปิดใช้งานไว้แล้ว
**Steps**
1. ไปที่ `/procurement/purchase-order/new`
2. เปิดตัวเลือกของช่อง "Credit Term" ในหัวเอกสาร
3. เลือกรายการที่เพิ่งสร้าง
4. กลับไปที่ `/config/credit-term` แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ (ยังไม่ได้บันทึก PO ใด ๆ)
**Expected**
รายการที่เพิ่งสร้างปรากฏเป็นตัวเลือกในรายการเลือก โดยข้อความที่แสดงคือ **ชื่อ** ของเงื่อนไขการชำระเงิน (ไม่ใช่จำนวนวัน); เลือกแล้วป้ายบน trigger เปลี่ยนเป็นชื่อนั้นและ hover แล้วขึ้น tooltip ชื่อเต็ม; ออกจากหน้าโดยไม่บันทึก PO แล้วไม่มีเอกสารใดถูกสร้าง

---
## TC-CT-010020 — เลือกเงื่อนไขการชำระเงินในฟอร์ม GRN แล้ว Due Date ถูกคำนวณจากจำนวนวัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีเงื่อนไขการชำระเงินที่เปิดใช้งานและรู้จำนวนวันแน่นอน (เช่น 30 วัน) อยู่ใน 30 รายการแรกของรายการเลือก
**Steps**
1. ไปที่ `/procurement/goods-receive-note/new`
2. กรอกวันที่ใบแจ้งหนี้ (Invoice Date) เป็นวันที่ที่ทราบแน่นอน
3. เลือกเงื่อนไขการชำระเงินรายการนั้นในช่อง Credit Term
4. อ่านค่าในช่อง Due Date
5. เปลี่ยนวันที่ใบแจ้งหนี้เป็นวันอื่น แล้วอ่านช่อง Due Date อีกครั้ง
6. ออกจากหน้าโดยไม่บันทึกเอกสาร
**Expected**
หลังเลือกเงื่อนไขการชำระเงิน ช่อง Due Date ถูกเติมอัตโนมัติเป็น **วันที่ใบแจ้งหนี้ + จำนวนวันของเงื่อนไขนั้น**; เปลี่ยนวันที่ใบแจ้งหนี้แล้ว Due Date ถูกคำนวณใหม่ตามจำนวนวันเดิม; ออกจากหน้าโดยไม่บันทึกแล้วไม่มี GRN ถูกสร้าง

---
## TC-CT-010021 — รายการที่ปิดใช้งานไม่ปรากฏในตัวเลือกของ PO / GRN
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; **BU มีเงื่อนไขการชำระเงินที่ active ไม่เกิน 30 รายการ**; มีรายการที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและยัง **ไม่เคยถูกอ้างโดยเอกสาร PO/GRN ใด**
**Steps**
1. ที่ `/config/credit-term` เปิด dialog ของรายการนั้น ปิดสวิตช์สถานะ แล้วกด Save
2. ไปที่ `/procurement/purchase-order/new` แล้วเปิดตัวเลือกช่อง Credit Term
3. ไปที่ `/procurement/goods-receive-note/new` แล้วเปิดตัวเลือกช่อง Credit Term
4. กลับไปลบรายการนั้นเพื่อคืนสภาพ
**Expected**
รายการที่ปิดใช้งานแล้ว **ไม่ปรากฏ** ในตัวเลือกทั้งของ PO และของ GRN (`LookupCreditTerm` กรองด้วย `is_active` ทั้งสองที่จากโค้ดชุดเดียวกัน) ขณะที่รายการที่ยังเปิดใช้งานอยู่ยังปรากฏครบ; หน้ารายการที่ `/config/credit-term` ยังแสดงรายการนั้นพร้อมป้าย Inactive

---
## TC-CT-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-term`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Credit Term"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Credit Term"; ช่อง Name ว่าง มี placeholder "e.g. Net 30" และมีเครื่องหมาย `*` บังคับกรอกที่ label; ช่อง **Days** ว่าง มี placeholder "e.g. 30" มีเครื่องหมาย `*` เช่นกัน และตัวเลขจัดชิดขวาแบบ tabular; ช่อง Description ว่างและมี placeholder "Optional" พร้อมตัวนับ `0/256`; status switch อยู่ที่เปิดใช้งาน (`aria-checked="true"`); footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save)

---
## TC-CT-030003 — สร้างพร้อมจำนวนวันและคำอธิบาย แล้วค่าถูกบันทึกจริง
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/credit-term`
**Steps**
1. คลิกปุ่ม "Add Credit Term"
2. กรอก Name ที่ไม่ซ้ำ
3. กรอก Days = `45`
4. กรอก Description เป็นข้อความสั้น ๆ
5. คลิกปุ่ม Create
6. ค้นหาชื่อที่เพิ่งสร้างในตาราง แล้วเปิดรายการนั้นซ้ำ
7. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Credit Term created successfully" และ dialog ปิดเอง; แถวใหม่ในตารางมีคอลัมน์ Days = `45` (ชิดขวา) และคอลัมน์ Description ตรงกับที่กรอก; เปิด dialog ของรายการนั้นซ้ำแล้วทั้ง Days และ Description ยังเป็นค่าเดิม (ค่าถูก persist จริง ไม่ใช่แค่แสดงผล)

---
## TC-CT-030004 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/credit-term`; เปิด dialog "Add Credit Term" และกรอก Name, Days กับ Description ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Credit Term" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้น (Name ว่าง, Days = `0`, Description ว่าง, status switch = เปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-CT-040005 — แก้ไขจำนวนวันแล้วค่าคงอยู่ทั้งในตารางและ dialog
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีเงื่อนไขการชำระเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (Days = 30) และยังไม่เคยถูกอ้างโดยเอกสารใด
**Steps**
1. ค้นหารายการนั้นแล้วคลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog แก้ไข
2. แก้ช่อง Days เป็น `60`
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. เปิด dialog ของรายการนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog ตอนแก้ไขคือ "Edit Credit Term" และปุ่มบันทึกคือ Save; แสดง toast "Credit Term updated successfully" และ dialog ปิดเอง; คอลัมน์ Days ในตารางเปลี่ยนเป็น `60` และเปิด dialog ซ้ำแล้วช่องแสดง `60`

---
## TC-CT-040006 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/credit-term` และสลับเป็นมุมมองการ์ดแล้ว; มีรายการอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Credit Term" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Name, Days, Description, status switch); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-CT-050003 — ข้อความยืนยันลบแสดงชื่อเงื่อนไขการชำระเงิน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีเงื่อนไขการชำระเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน; รายการนั้นยังไม่เคยถูกอ้างโดยเอกสาร PO/GRN ใด (ดูหมายเหตุข้อ 4)
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Credit Term" และคำอธิบายที่มีชื่อรายการนั้นอยู่ในข้อความ ("Are you sure you want to delete credit term \"<ชื่อ>\"? This action cannot be undone."); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน)

---
## TC-CT-050004 — ลบรายการจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีเงื่อนไขการชำระเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและยังไม่เคยถูกอ้างโดยเอกสารใด; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของรายการนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด ตาม guard `closest("button")` ของ `ListCard`) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Credit Term deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-CT-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.view` แต่ไม่มี `configuration.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`); BU ยังมี license `configuration.credit_term` (ไม่งั้นจะโดนกั้นด้วยเหตุผล license ซึ่งเป็นคนละกรณี — ดูหมายเหตุข้อ 5 และ 6)
**Steps**
1. ไปที่ `/config/credit-term`
2. สังเกตสภาพปุ่ม "Add Credit Term"
3. คลิกปุ่ม "Add Credit Term"
**Expected**
ปุ่ม "Add Credit Term" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้างรายการ แต่เด้ง dialog "Permission Denied" พร้อมข้อความ "You don't have permission to perform this action." และบรรทัดแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-CT-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.view` แต่ไม่มี `configuration.update` และไม่ใช่ admin ของ BU; มีเงื่อนไขการชำระเงินอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/credit-term`
2. คลิกชื่อรายการในคอลัมน์ Name เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง Name, Days, Description และ status switch ถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-CT-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.view` แต่ไม่มี `configuration.delete` และไม่ใช่ admin ของ BU; มีเงื่อนไขการชำระเงินอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/credit-term`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"` (แต่ยังเลือกได้ ไม่ใช่ `disabled` จริง); คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน `useDeleteGate` ตัวเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-CT-100008 — ไม่มีสิทธิ์ดู — deep link ถูกกั้นและเมนู sidebar เป็นปุ่มจาง
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มีสิทธิ์ `configuration.view`** และไม่ใช่ admin ของ BU (credit term ใช้ permission ระดับบนสุดของกลุ่ม Config — ดูหมายเหตุข้อ 5); BU ที่ใช้ทดสอบยังมี license `configuration.credit_term` (ไม่งั้นจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผล)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar แล้วสังเกตรายการ "Credit Term"
2. คลิกรายการ "Credit Term"
3. พิมพ์ URL `/config/credit-term` เข้าไปตรง ๆ
**Expected**
รายการ "Credit Term" ยังอยู่ในเมนูแต่ถูกทำให้จาง (`opacity-50`) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/credit-term">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจ** (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; เข้า URL ตรง ๆ แล้ว `RouteGuard` แสดงกล่องแจ้งเตือน (`role="alert"`) หัวข้อ "Permission Denied" พร้อมข้อความ "You don't have permission to view this page." บรรทัด "Contact your administrator to request access." และปุ่ม "Go to an available page" — ไม่มีเนื้อหาของหน้า list ปรากฏเลย

---
## TC-CT-200004 — เว้นจำนวนวันว่างหรือเป็น 0 แล้วบันทึกไม่ได้
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Credit Term" และกรอก Name ที่ไม่ซ้ำไว้แล้ว
**Steps**
1. ล้างค่าในช่อง Days ให้ว่าง แล้วคลิกปุ่ม Create
2. กรอก Days = `0` แล้วคลิกปุ่ม Create อีกครั้ง
3. กด Cancel แล้วค้นหาชื่อที่กรอกไว้ในตาราง
**Expected**
ทั้งสองกรณี **ไม่มีรายการใหม่ถูกสร้าง** — dialog ยังเปิดค้างอยู่, ไม่มี toast "created successfully" และค้นหาชื่อนั้นในตารางแล้วไม่พบ (สคีมา `min(1)` บล็อกการ submit ทั้งค่าว่างที่ถูก coerce เป็น `0` และค่า `0` ที่กรอกเอง) — **เคสนี้ไม่ assert ว่ามีข้อความ error ปรากฏ** เพราะ dialog ไม่ได้ส่ง prop `error` ให้ช่องนี้ (ดูหมายเหตุข้อ 3)

---
## TC-CT-200005 — จำนวนวันติดลบแล้วบันทึกไม่ได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Credit Term" และกรอก Name ที่ไม่ซ้ำไว้แล้ว
**Steps**
1. กรอก Days = `-5`
2. คลิกปุ่ม Create
3. กด Cancel แล้วค้นหาชื่อที่กรอกไว้ในตาราง
**Expected**
ช่องรับค่า `-5` ได้ (ไม่มี attribute `min` ที่ตัว input จึงไม่มีด่านฝั่งเบราว์เซอร์); กด Create แล้ว **ไม่มีรายการใหม่ถูกสร้าง** — dialog ยังเปิดค้าง, ไม่มี toast และค้นหาชื่อนั้นในตารางแล้วไม่พบ

---
## TC-CT-200006 — ช่องจำนวนวันไม่มีด่านจำกัดค่าที่ตัว input
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Credit Term" อยู่
**Steps**
1. ตรวจ attribute ของช่อง Days (`#credit-term-value`)
2. สังเกตปลายขวาของช่องว่ามีปุ่มลูกศรขึ้น-ลงหรือไม่
**Expected**
ช่องเป็น `input[type="number"]` ที่มี `inputmode="decimal"` และจัดตัวเลขชิดขวาแบบ tabular แต่ **ไม่มี attribute `min`, `max` หรือ `step`** (ต่างจากช่อง Decimal Places ของโมดูล Unit ที่มีครบสามตัว); ปุ่มลูกศรเพิ่ม-ลดค่าของเบราว์เซอร์ถูกซ่อน (CSS `[appearance:textfield]` + ซ่อน spin button ใน `components/ui/input.tsx`) จึงเปลี่ยนค่าได้ด้วยการพิมพ์เท่านั้น

---
## TC-CT-200007 — ช่องคำอธิบายจำกัดความยาว 256 ตัวอักษรพร้อมตัวนับ
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Credit Term" อยู่
**Steps**
1. สังเกตตัวนับมุมขวาล่างของช่อง Description ตอนที่ยังว่าง
2. วางข้อความยาว 300 ตัวอักษรลงในช่อง Description
3. อ่านค่าในช่องและตัวนับอีกครั้ง
**Expected**
ตัวนับแสดง `0/256` ตอนช่องว่าง; หลังวางข้อความยาว ค่าในช่องถูกตัดเหลือ 256 ตัวอักษร (`maxLength` ของ `Textarea`) และตัวนับแสดง `256/256`; ช่องนี้ไม่บังคับกรอก — กด Create โดยเว้นว่างได้ตามปกติ
