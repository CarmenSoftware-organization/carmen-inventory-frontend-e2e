# Adjustment Type — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/031-adjustment-type.spec.ts` (15 เคสในไฟล์ + 4 เคสจาก `addDialogSecurityCases`) และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/031-adjustment-type.md`_

**Module:** Config — Adjustment Type (ชนิดการปรับปรุงสต๊อก)
**Frontend route:** `routes/config/adjustment-type`  •  **URL:** `/config/adjustment-type`
**Prefix:** `AT`
**สเปกที่ครอบส่วนที่เหลือ:** `tests/031-adjustment-type.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 33

> **หมายเหตุสำคัญสำหรับผู้รีวิว:** ทุกเคสในไฟล์นี้ยืนยันจากโค้ดของโมดูลเอง (`adjustment-type-component.tsx`, `adjustment-type-dialog.tsx`, `adjustment-type-card.tsx`, `use-adjustment-type-table.tsx`, `types/adjustment-type.ts`, `hooks/use-adjustment-type.ts`) และจาก shared component ที่มันใช้จริง (`components/templates/config-list-template.tsx`, `components/templates/config-entity-dialog.tsx`, `components/ui/data-grid/*`, `components/share/list-card.tsx`, `components/list-filter/*`) ไม่ได้ลอกมาจาก `083-shelf.md` — ข้อเท็จจริงที่ **ต่างจาก config module ตัวอื่น** และมีผลกับการเขียนเทสมีดังนี้:
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/031-adjustment-type.spec.ts` ถือ ID `TC-AT-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-AT-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, สร้าง record (code + name + type = Stock In), แก้ไขชื่อแล้ว persist, toggle `is_active` แล้ว persist, ยกเลิกการแก้ไขด้วย Cancel, ลบ + ยกเลิกการลบ, สร้าง **code ซ้ำ** ถูก reject, บันทึกฟอร์มเปล่าและ clear name ตอนแก้ → error, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 30/90 ใช้ไม่ได้กับ prefix `AT`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `031-adjustment-type.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30), เคส edge (ปกติ 90) และเคส integration ข้ามโมดูล (ปกติ 30) จึงถูกจัดไว้ในบล็อก **01** ทั้งหมด เพราะทุกตัวเริ่มจากพฤติกรรมของหน้า list — เอกสารนี้ **ไม่ได้แก้ scheme** ถ้าทีมอยากได้บล็อกตามขนบต้องเพิ่ม `30`/`90` ลงในแถวของสเปกใน scheme ก่อน
> 3. **โมดูลนี้มี 4 ฟิลด์กรอก ไม่ใช่ 2** — `adjustment-type-dialog.tsx` มี **Code** (บังคับ, `maxLength=10`, placeholder `e.g. TRFOT`), **Name** (บังคับ, `maxLength=100`, placeholder `e.g. Transfer Out`), **Type** (บังคับ, Radix `Select`, ค่าเริ่มต้น Stock In), **Description** (`Textarea`, `maxLength=256`, placeholder "Optional") และ status switch — `code` คือกุญแจซ้ำไม่ได้ (สเปกครอบเคส code ซ้ำแล้ว) ต่างจาก unit/business-type ที่ไม่มี `code` เลย
> 4. **`note` มีใน schema/payload แต่ไม่มีช่องกรอกใน UI** — `adjustmentTypeSchema` มี `note: z.string()` และ `toPayload` ส่ง `note: v.note ?? ""` ทุกครั้ง แต่ dialog ไม่ render ช่องนี้ ขณะที่ **คอลัมน์ Note อยู่ในไฟล์ export** → ช่อง Note ในไฟล์ที่ส่งออกจะว่างเสมอสำหรับ record ที่สร้างจาก UI นี้ เป็นข้อเท็จจริงที่ต้อง assert ตามจริง ไม่ใช่บั๊กที่ต้อง fail เทส
> 5. **`defaultSort` เป็น sort สองคอลัมน์ ซึ่งไม่มีโมดูลอื่นใช้** — `defaultSort="code:asc,name:asc"` ถูกส่งเข้า `ConfigListTemplate` → `useDataGridState` ใส่ค่านี้ลง `params.sort` ทั้งก้อน (ยิงไป backend ครบสองคอลัมน์) แต่ตอนแปลงเป็น `SortingState` มันทำแค่ `effectiveSort.split(":")` → ได้ `{ id: "code", desc: false }` **UI จึงรู้จักแค่คอลัมน์แรก** ผลคือ: เข้าหน้าครั้งแรก URL ไม่มี `sort` แต่ตารางเรียงตาม code แล้ว, ในเมนูเรียงลำดับ **แถว "Default" กับแถว "Code" ถูกทำเครื่องหมายพร้อมกัน** และ **กด "Code" ครั้งแรกได้ `code:desc` ไม่ใช่ `asc`** (ดู `TC-AT-010014`)
> 6. **หน้านี้มีตัวกรองสองตัว ไม่ใช่ตัวเดียว** — `ADJUSTMENT_TYPE_FILTER_FIELDS` ประกาศ `filter` (control `status`, Active/Inactive) **และ** `adj_type` (control `multi-select`, Stock In/Stock Out) ทั้งคู่เก็บ clause เต็มไว้ใน URL คนละ param แล้ว `encodeFilterParam` เอามาต่อกันด้วย `;` ก่อนยิง backend เป็น `filter=is_active|bool:true;type|string:stock_in` — ไม่มี config module ตัวไหนในชุดที่ทำมาแล้วมี field ที่สอง
> 7. **ตัวกรองชนิดมีแค่ 2 ตัวเลือก จึง "เลือกครบ = ไม่กรอง"** — `MultiSelectFilter.toggle` เขียนไว้ว่า `onChange(next.length >= options.length ? "" : next.join(","))` ติ๊กทั้ง Stock In และ Stock Out พร้อมกันจึงล้างค่าเป็น "" (เทียบเท่าเลือก All) chip หายและ badge บนปุ่ม Filter ลดลง — พฤติกรรมตามออกแบบ ไม่ใช่บั๊ก (ดู `TC-AT-010011`)
> 8. **ตารางมีคอลัมน์ Status จริง แม้จะส่ง `hideStatus: true`** — `use-adjustment-type-table.tsx` ใส่ `statusColumn<AdjustmentType>()` ลงใน `columns` ของตัวเองแล้ว จึงส่ง `hideStatus: true` เพื่อกัน `useConfigTable` ใส่ซ้ำเป็นคอลัมน์ที่สอง อย่าอ่าน `hideStatus` แล้วสรุปว่าหน้านี้ไม่มีคอลัมน์สถานะ
> 9. **ทางเข้าแก้ไขอยู่ที่คอลัมน์ Code ไม่ใช่ Name** — `CellAction` ถูกผูกไว้กับคอลัมน์ `code` (`onEdit(row.original)`) ส่วนคอลัมน์ Name เป็นข้อความธรรมดา และ `useAdjustmentTypeTable` ส่งให้ `useConfigTable` แค่ `onDelete` เมนู Row actions จึงมีเฉพาะ **Activity + Delete** ไม่มี Edit
> 10. **โมดูลนี้เปิดเมนู Activity และใช้ `code` เป็น label** — `activity: { id: (r) => r.id, label: (r) => r.code }` (unit/shelf ไม่เปิดเลย, business-type เปิดแต่ใช้ `name`) คอมเมนต์ใน `use-config-table.tsx` เตือนว่าตารางที่ backend ไม่ได้ลงทะเบียนใน activity-registry จะได้ sheet เปล่า `TC-AT-010021` จึง assert แค่ว่า sheet เปิดและหัวเรื่องอ้าง **รหัส** ของแถว ไม่ assert ว่ามีรายการกิจกรรมอยู่ข้างใน
> 11. **คอลัมน์ Type ใช้ป้ายของโมดูล inventory-adjustment** — cell ของ `type` ดึง `IA_TYPE_CONFIG` / `IA_TYPE_ICON` / `IA_TYPE_ICON_COLOR` จาก `constant/inventory-adjustment.ts` ได้ชิปสีกลาง + ไอคอน `PackagePlus` (สี `text-success`) หรือ `PackageMinus` (สี `text-destructive`) แต่ **ข้อความบนชิปมาจาก `tfl("stockIn")`/`tfl("stockOut")` = "Stock In"/"Stock Out"** ไม่ใช่ label `"STOCK IN"` ของ `IA_TYPE_CONFIG`
> 12. **ค่าของ Type ที่ส่งออกเป็นค่าดิบ** — `exportColumns` ของ Type คือ `value: (r) => r.type` จึงได้ `stock_in` / `stock_out` ตรง ๆ (ต่างจากคอลัมน์ Status ที่แปลงเป็น Active/Inactive ให้แล้ว) — assert ตามจริง
> 13. **ป้ายตัวเลือกใน dropdown Type ไม่ผ่าน i18n** — `ADJUSTMENT_TYPE_OPTIONS` ใน `types/adjustment-type.ts` ฮาร์ดโค้ด `label: "Stock In" / "Stock Out"` ส่วนตารางกับการ์ดเรียกผ่าน `tfl(...)` — วันนี้ข้อความตรงกันทั้งสองทาง แต่ถ้าเพิ่มภาษาที่สอง dropdown จะไม่ตามไปด้วย บันทึกเป็นข้อเท็จจริง ไม่ได้เขียนเป็นเคส
> 14. **โมดูลนี้ไม่มี `licenseFeature`** — แถว `adjustmentType` ใน `constant/module-list.ts` ประกาศแค่ `permission: PERMISSIONS.configuration.adjustment_type.view` (ต่างจาก unit `configuration.unit` และ shelf `configuration`) เส้นทาง "ล็อกเพราะสัญญา/ยังไม่ได้ซื้อ" จึง **ไม่เกิดกับหน้านี้** เคสบล็อก 10 ทั้งสี่ตัวเป็น RBAC ล้วน — แต่ดูข้อ 15 ด้วย เพราะโมดูลปลายทางที่อ้างถึงมี license
> 15. **BLOCKER — ความสัมพันธ์กับ `/inventory-management/inventory-adjustment`:** `ia-form.tsx` เรียก `useAdjustmentType({ perpage: -1 })` แล้วกรองฝั่ง client ด้วย `at.is_active && at.type === adjTypeFilter` มีผลสามข้อ (ยืนยันจากโค้ด ไม่ใช่การคาดเดา):
>     - **lookup ไม่ได้ถูกจำกัดจำนวน** — `perpage: -1` ดึงมาทั้งหมด จึง **ไม่มี**ปัญหาแบบ credit-note-reason ที่ดึงมาแค่ 30 รายการ การรันเทสที่ทิ้ง record ค้างจึงไม่ทำให้รายการของคนอื่นหลุดจาก dropdown
>     - **ปิดใช้งาน = หายจาก dropdown ทันที** — ฟิลด์ Reason ของใบปรับปรุงสต๊อกเป็นฟิลด์ **บังคับ** (`adjustment_type_id`) และเก็บเป็น id; ใบที่ยังเป็น draft และอ้าง adjustment type ที่เพิ่งถูกปิดใช้งานหรือถูกลบ จะหาตัวเลือกที่ตรงไม่เจอ → `FieldSelect` แสดง placeholder "Select adjustment type" → ฟิลด์บังคับกลายเป็นว่าง เซฟใบนั้นต่อไม่ได้จนกว่าจะเลือกใหม่ (โหมด view ไม่พังเพราะ `PlainReasonValue` ตกกลับไปใช้ snapshot `adjustment_type_name` ที่ backend เก็บไว้กับใบ)
>     - **กติกาบังคับสำหรับเคสบล็อก 04/05 ทุกตัว: ต้องสร้าง adjustment type ของตัวเองขึ้นมาแก้/ลบเท่านั้น ห้ามแตะรายการเดิมของ BU** ไม่งั้นมีโอกาสทำให้เทสของ inventory-adjustment พังตามไปด้วย
>     - หน้า `/inventory-management/inventory-adjustment` มี `licenseFeature: "inventory_management.inventory_adjustment"` เคส `TC-AT-010022` จึงต้องใช้ผู้ใช้ที่ทั้งมีสิทธิ์และมี license ของโมดูลนั้น (หน้า config เองไม่ต้อง)
> 16. **`useAdjustmentTypeTable` ไม่รับ `permissionPrefix` ที่ `ConfigListTemplate` ส่งมา** — interface ของมันมีแค่ `data/totalRecords/params/tableConfig/onEdit/onDelete` จึงไม่ส่งต่อให้ `useConfigTable` ทำให้ `useDeleteGate` ตกไปใช้ `usePermissionPrefix()` ที่ derive จาก route ได้ `configuration.adjustment_type` **ซึ่งตรงกับค่าที่ component ส่งพอดี** ผลลัพธ์จึงเหมือนกัน — บันทึกไว้กันผู้รีวิวอ่านเป็นช่องโหว่
> 17. **`code` แก้ไขได้ตอน edit** — `FieldInput` ของ code ใช้ `disabled={disabled}` ซึ่งเป็น `isPending || readOnly` เท่านั้น ไม่มีการล็อกกุญแจหลังสร้าง (ดู `TC-AT-040007`)
> 18. **หมวด 01 เกือบทั้งหมดต้องรันบน desktop viewport** — ปุ่ม Export / Print / Sort / Toggle columns / สลับมุมมอง ถูกซ่อนด้วย breakpoint `sm:` และบนมือถือ `useIsMobile()` บังคับเป็น grid + infinite scroll (ไม่มี pagination)
> 19. **สถานะ "Exporting..." แทบจับไม่ได้** — `handleExport` เรียก `downloadXlsx` โดยไม่ `await` แล้ว `setIsExporting(false)` ใน `finally` ทำงานทันที เคส `TC-AT-010018` จึง assert ผลลัพธ์ (ไฟล์ + toast) ไม่ assert สถานะระหว่างทาง
> 20. **ข้อเท็จจริงที่บันทึกไว้แต่ไม่เขียนเป็นเคส:** `code`/`name` ใช้ `z.string().min(1)` โดยไม่ `trim()` ค่าที่เป็นช่องว่างล้วนจึงผ่าน client validation — พฤติกรรมนี้ควรให้ฝั่งแอปตัดสินก่อน; ตารางมีคอลัมน์ checkbox แต่ `ConfigListTemplate` ไม่มีแถบ bulk action ติ๊กแล้วไม่มีอะไรให้ทำต่อ; ปุ่ม Print มีเสมอแต่เรียก `globalThis.print()` ซึ่งเปิด print dialog ของเบราว์เซอร์ จึงไม่เหมาะเป็นเคส e2e; คอลัมน์ Status ไม่ได้ตั้ง `meta.headerTitle` รายการของมันในเมนู Sort/Toggle columns จึงแสดงเป็น accessor ดิบ `is_active`
> 21. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-AT-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-AT-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-AT-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-AT-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-AT-010010 | กรองตามชนิดด้วยตัวกรองแบบเลือกหลายค่า | Medium | Functional |
| TC-AT-010011 | ติ๊กชนิดครบทั้งสองตัวเลือกแล้วตัวกรองถูกล้างเอง | Medium | Edge Case |
| TC-AT-010012 | ใช้ตัวกรองสถานะและชนิดพร้อมกันแล้ว clause ถูกรวมด้วย `;` | Medium | Functional |
| TC-AT-010013 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-AT-010014 | เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามรหัส และการสลับทิศ | Medium | Functional |
| TC-AT-010015 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-AT-010016 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-AT-010017 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-AT-010018 | ส่งออกรายการชนิดการปรับปรุงเป็นไฟล์ XLSX | Medium | Functional |
| TC-AT-010019 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-AT-010020 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-AT-010021 | เมนู Row actions มีเฉพาะ Activity และ Delete และ Activity อ้างรหัส | Low | Functional |
| TC-AT-010022 | ชนิดที่ปิดใช้งานต้องหายจาก dropdown Reason ของใบปรับปรุงสต๊อก | High | Functional |
| TC-AT-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Medium | Functional |
| TC-AT-030003 | สร้างชนิด Stock Out พร้อมคำอธิบายแล้วค่าคงอยู่ | Medium | Happy Path |
| TC-AT-030004 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-AT-040005 | หัวข้อและปุ่มของ dialog ตอนแก้ไข พร้อมค่าที่ถูกเติมครบ | Medium | Functional |
| TC-AT-040006 | เปลี่ยนชนิดจาก Stock In เป็น Stock Out แล้วป้ายในตารางเปลี่ยนตาม | High | CRUD |
| TC-AT-040007 | แก้ไขรหัสของรายการที่มีอยู่แล้วค่าคงอยู่ | Medium | CRUD |
| TC-AT-040008 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-AT-050003 | ข้อความยืนยันลบอ้างชื่อชนิดการปรับปรุง | Medium | Functional |
| TC-AT-050004 | ลบชนิดการปรับปรุงจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-AT-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-AT-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-AT-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-AT-100008 | ไม่มีสิทธิ์ดู — เมนู Adjustment Type เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-AT-200004 | เว้นรหัสว่างแล้วบันทึก ต้องขึ้นข้อความ "Code is required" | Medium | Validation |
| TC-AT-200005 | ช่องรหัสจำกัด 10 ตัวอักษร และคำอธิบายจำกัด 256 ตัวอักษร | Medium | Validation |
| TC-AT-200006 | ช่อง Type เป็นฟิลด์บังคับที่มีเพียงสองตัวเลือกและไม่มีสถานะว่าง | Low | Validation |

---
## TC-AT-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีชนิดการปรับปรุงอย่างน้อย 1 รายการใน BU; หน้าจอขนาด desktop
**Steps**
1. ไปที่ `/config/adjustment-type`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Adjustment Type" พร้อมคำอธิบายใต้ชื่อ ("Reasons stock goes in or out without a purchase or a sale — breakage, staff meal, found stock."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Type (จัดกึ่งกลาง), Status (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น** (`columnVisibility` เริ่มต้นของตาราง); ค่าในคอลัมน์ Code เป็นปุ่มลิงก์ (`CellAction`) ส่วน Name เป็นข้อความธรรมดา; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Adjustment Type"

---
## TC-AT-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type`; มีหลายรายการที่รหัส/ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับรายการที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-AT-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search..."); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-AT-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีชนิดการปรับปรุงทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. เปิดแถว Status ในเมนูแล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เปลี่ยนเป็น "Inactive"
**Expected**
เมนู Filter มีสองแถวคือ **Status** และ **Type**; เลือก Active แล้วตารางเหลือเฉพาะแถวที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip "Status Active" พร้อมปุ่มลบ (aria-label "Remove Status filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก Inactive แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน

---
## TC-AT-010010 — กรองตามชนิดด้วยตัวกรองแบบเลือกหลายค่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีชนิดการปรับปรุงทั้งแบบ Stock In และ Stock Out อย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter แล้วเปิดแถว Type
2. ติ๊ก "Stock In" เพียงตัวเลือกเดียว
3. สังเกตตาราง, badge บนปุ่ม Filter, แถบ chip และ query string
**Expected**
รายการในแถว Type คือ All / Stock In / Stock Out พร้อม checkbox (control เป็น multi-select ไม่ใช่ single-select); ติ๊ก Stock In แล้วตารางเหลือเฉพาะแถวที่ชิป Type เป็น "Stock In"; badge บนปุ่ม Filter เป็น 1; chip ใต้แถบเครื่องมือแสดง "Type Stock In" พร้อมปุ่มลบ (aria-label "Remove Type filter") และกดที่ตัว chip เปิด popover แก้ค่าได้ทันที; query string มีพารามิเตอร์ **`adj_type=type|string:stock_in`** แยกจาก `filter` (ค่า enum เป็นตัวพิมพ์เล็กมีขีดล่าง ตาม `ADJUSTMENT_TYPE.STOCK_IN`)

---
## TC-AT-010011 — ติ๊กชนิดครบทั้งสองตัวเลือกแล้วตัวกรองถูกล้างเอง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop โดยติ๊กตัวกรอง Type = Stock In ไว้แล้ว (มี chip "Type Stock In" และ `adj_type` อยู่ใน URL)
**Steps**
1. เปิดแถว Type ในเมนู Filter อีกครั้ง
2. ติ๊ก "Stock Out" เพิ่มเข้าไปให้ครบทั้งสองตัวเลือก
3. สังเกต checkbox ของแถว All, chip, badge และ query string
**Expected**
เพราะ field นี้มีแค่ 2 ตัวเลือก การติ๊กครบทั้งสองจึงถูกตีความว่า "ไม่กรอง" (`toggle` ส่ง `""` เมื่อจำนวนที่เลือก ≥ จำนวนตัวเลือก): checkbox ของทั้ง Stock In และ Stock Out **ไม่ถูกติ๊ก** แต่แถว "All" ถูกติ๊กแทน; chip "Type …" หายจากแถบ chip; badge บนปุ่ม Filter ลดลง 1 (หายไปถ้าไม่มีตัวกรองอื่น); พารามิเตอร์ `adj_type` หายจาก URL และตารางกลับมาแสดงทั้ง Stock In และ Stock Out

---
## TC-AT-010012 — ใช้ตัวกรองสถานะและชนิดพร้อมกันแล้ว clause ถูกรวมด้วย `;`
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีรายการที่เป็น Stock In + Active อย่างน้อย 1 รายการ และ Stock Out หรือ Inactive อย่างน้อย 1 รายการ
**Steps**
1. ตั้งตัวกรอง Status = Active
2. ตั้งตัวกรอง Type = Stock In เพิ่ม
3. สังเกต badge บนปุ่ม Filter, แถบ chip, query string ของหน้า และ request ที่ยิงไป backend
**Expected**
badge บนปุ่ม Filter เป็น **2**; แถบ chip มีสอง chip คือ "Status Active" และ "Type Stock In" แต่ละอันมีปุ่มลบของตัวเอง; URL ของหน้าเก็บค่าไว้เป็น **สอง param แยกกัน** (`filter=is_active|bool:true` และ `adj_type=type|string:stock_in`); request ที่ยิงไป endpoint `/api/proxy/api/config/{bu}/adjustment-types` รวมทั้งสอง clause เป็น param เดียวคั่นด้วยเครื่องหมาย `;` (`encodeFilterParam` ต่อด้วย `;`); ตารางเหลือเฉพาะแถวที่เป็น Stock In และ Active พร้อมกัน; ลบ chip ทีละอันแล้วอีกอันยังทำงานอยู่

---
## TC-AT-010013 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` โดยมีตัวกรองทำงานอยู่ทั้ง Status และ Type (เห็น chip 2 อัน)
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter`, `adj_type` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-AT-010014 — เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามรหัส และการสลับทิศ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/adjustment-type` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีชนิดการปรับปรุงอย่างน้อย 2 รายการที่รหัสต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายการในเมนู
3. เลือก "Code"
4. เลือก "Code" ซ้ำอีกครั้ง
5. เลือก "Name"
6. เลือกแถว "Default"
**Expected**
เข้าครั้งแรก URL **ไม่มี** `sort` แต่ตารางเรียงตามรหัสจากน้อยไปมากแล้ว (หน้านี้ส่ง `defaultSort="code:asc,name:asc"`); ในเมนู **แถว "Default" ถูกทำเครื่องหมาย และแถว "Code" มีลูกศรขึ้นพร้อมกัน** (แถว Default เช็คจาก URL ดิบ, ลูกศรเช็คจาก sorting state); เมนูแสดงรายการเฉพาะคอลัมน์ที่เรียงได้ — Code, Name, Type, `is_active` (แสดงเป็นชื่อ accessor ดิบเพราะ `statusColumn` ไม่ได้ตั้ง `meta.headerTitle`), Created, Updated; เลือก "Code" ครั้งแรกได้ **`sort=code:desc`** (สลับทิศจากค่าเริ่มต้นที่เป็น asc อยู่แล้ว ไม่ใช่ `asc`) และลำดับแถวกลับด้าน; เลือกซ้ำได้ `sort=code:asc`; เลือก "Name" ได้ `sort=name:asc`; เลือก "Default" ล้าง `sort` และ `page` ออกจาก URL แล้วกลับไปเรียงตามค่าเริ่มต้น

---
## TC-AT-010015 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Type
**Expected**
เมนูแสดงรายการ Code, Name, Type, `is_active`, Created, Updated พร้อม checkbox (ช่องเลือกกับลำดับที่ตั้ง `enableHiding: false` จึงไม่อยู่ในเมนู); Created และ Updated **ไม่ถูกติ๊กตั้งแต่ต้น**; เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมวันที่และชื่อผู้ทำรายการ (`AuditCell`); ปิด Type แล้วคอลัมน์ชิปชนิดหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-AT-010016 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีชนิดการปรับปรุงอย่างน้อย 1 รายการที่กรอก Description ไว้
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดใช้ **ชื่อ** เป็นหัวเรื่อง (ไม่ใช่รหัส) และในเนื้อการ์ดเรียงเป็นแถว Status (ป้าย Active/Inactive), Code (แสดงเฉพาะเมื่อมีค่า), **Type (แสดงเสมอ เป็นข้อความ "Stock In"/"Stock Out" ไม่ใช่ชิป)**, Description (แสดงเฉพาะเมื่อมีค่า) และแถว Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-AT-010017 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` ในมุมมองตารางบน desktop; BU มีชนิดการปรับปรุงมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม, เลขในคอลัมน์ `#` เดินต่อจากหน้าแรก (คำนวณจาก `page`/`perpage`) และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-AT-010018 — ส่งออกรายการชนิดการปรับปรุงเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีชนิดการปรับปรุงอย่างน้อย 1 รายการในหน้าปัจจุบัน และรู้ว่าแถวนั้นเป็น Stock In หรือ Stock Out
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. เปิดไฟล์ที่ดาวน์โหลดมาแล้วดูหัวคอลัมน์และค่าในแถว
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ชื่อขึ้นต้นด้วย `adjustmentType_<YYYY-MM-DD>` (prefix มาจากท้าย `translationNamespace` เพราะโมดูลไม่ได้ส่ง `exportFileNamePrefix`) และชีตชื่อ "Adjustment Type"; ไฟล์มี 6 คอลัมน์ตามลำดับ **Code / Name / Type / Description / Note / Status**; ค่าในคอลัมน์ **Type เป็นค่าดิบ `stock_in` หรือ `stock_out`** (ไม่ใช่ "Stock In"), คอลัมน์ **Note ว่างเปล่า** (ไม่มีช่องกรอกใน UI) และคอลัมน์ Status เป็นคำว่า Active/Inactive; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-AT-010019 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/adjustment-type` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state)
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-AT-010020 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type` และตั้งตัวกรอง Status = Active กับ Type = Stock In ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือกคำสั่งบันทึก view จากตัวกรองปัจจุบัน
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog บันทึก view มีช่องชื่อและตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม **ตัวกรองทั้งสองตัวถูก apply กลับมาพร้อมกัน** (chip 2 อัน, badge = 2, `filter` และ `adj_type` กลับเข้า URL ทั้งคู่ — saved view ของหน้านี้เก็บค่าราย field ไม่ใช่สตริงเดียว); view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-AT-010021 — เมนู Row actions มีเฉพาะ Activity และ Delete และ Activity อ้างรหัส
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com (มีสิทธิ์ `configuration.adjustment_type.delete` และสัญญายังไม่หมดอายุ); อยู่ที่หน้า `/config/adjustment-type` และมีชนิดการปรับปรุงอย่างน้อย 1 รายการที่รู้รหัส
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. ดูรายการทั้งหมดในเมนู
3. เลือก "Activity"
4. ปิด sheet ที่เปิดขึ้น
**Expected**
เมนูมีเพียง **Activity** และ **Delete** (สีแดง) โดยมีเส้นคั่นระหว่างกัน — **ไม่มีรายการ Edit** เพราะ `useAdjustmentTypeTable` ส่งให้ `useConfigTable` แค่ `onDelete`; ทั้งสองรายการกดได้ปกติ ไม่ถูก disable และไม่มี tooltip แจ้งสัญญาหมดอายุ; เลือก Activity แล้ว sheet ประวัติกิจกรรมเปิดขึ้นโดยอ้าง **รหัส (code) ของแถว** เป็น label (ไม่ใช่ชื่อ) — ไม่ต้อง assert ว่าใน sheet มีรายการกิจกรรมหรือไม่ เพราะขึ้นกับ activity-registry ฝั่ง backend

---
## TC-AT-010022 — ชนิดที่ปิดใช้งานต้องหายจาก dropdown Reason ของใบปรับปรุงสต๊อก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็นผู้ใช้ที่มีสิทธิ์ทั้ง `/config/adjustment-type` และ `/inventory-management/inventory-adjustment` และ BU มี license `inventory_management.inventory_adjustment`; active BU = BLAVG; **สร้างชนิดการปรับปรุงของเทสเองขึ้นมาใหม่** 1 รายการ ชนิด Stock In สถานะ Active (ห้ามใช้รายการเดิมของ BU)
**Steps**
1. ที่ `/config/adjustment-type` จดชื่อของรายการที่สร้างไว้
2. ไปที่ `/inventory-management/inventory-adjustment/new?type=stock-in` แล้วเปิด dropdown ของฟิลด์ **Reason**
3. กลับไปที่ `/config/adjustment-type` เปิดรายการนั้น ปิดสวิตช์สถานะแล้วกด Save
4. กลับไปที่ `/inventory-management/inventory-adjustment/new?type=stock-in` แล้วเปิด dropdown Reason อีกครั้ง
5. (cleanup) เปิดสถานะกลับหรือลบรายการที่เทสสร้างขึ้น
**Expected**
ขั้นที่ 2: ชื่อของรายการที่สร้างไว้ปรากฏเป็นตัวเลือกใน dropdown Reason (ฟิลด์ใช้ label "Reason" และ placeholder "Select adjustment type"); ขั้นที่ 4: ชื่อนั้น **หายจาก dropdown** เพราะ `ia-form.tsx` กรองด้วย `at.is_active && at.type === …` ฝั่ง client; ตัวเลือกอื่นยังอยู่ครบและฟอร์มไม่ error — ห้าม assert ว่าใบที่มีอยู่เดิมยังอ้างค่านี้ได้หรือไม่ ให้ดูหมายเหตุข้อ 15 ก่อนขยายเคสนี้

---
## TC-AT-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type`
**Steps**
1. คลิกปุ่ม "Add Adjustment Type"
2. ดูหัวข้อ dialog, ค่าในทุกช่อง และปุ่มท้าย dialog
3. กด Escape
**Expected**
หัวข้อ dialog คือ **"Add Adjustment Type"** พร้อมไอคอนในกรอบสี่เหลี่ยมมุมมน และ **ไม่มีปุ่มกากบาทปิดที่มุม** (`showCloseButton={false}`); ช่อง Code ว่างพร้อม placeholder "e.g. TRFOT", ช่อง Name ว่างพร้อม placeholder "e.g. Transfer Out", ช่อง Type มีค่าตั้งต้นเป็น **"Stock In"** (ไม่ใช่ placeholder ว่าง), ช่อง Description ว่างพร้อม placeholder "Optional"; ป้าย Code / Name / Type มีเครื่องหมายบังคับกรอก ส่วน Description ไม่มี; สวิตช์สถานะอยู่ในกรอบที่มีหัวข้อ "Active" คำอธิบาย "Enable or disable this record" และค่าเริ่มต้นเปิดอยู่พร้อมป้ายสีเขียว "Active"; ปุ่มท้าย dialog คือ **Cancel** และ **Create**; กด Escape แล้ว dialog ปิด

---
## TC-AT-030003 — สร้างชนิด Stock Out พร้อมคำอธิบายแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เตรียมรหัสและชื่อที่ไม่ซ้ำไว้ (รหัส ≤ 10 ตัวอักษร)
**Steps**
1. เปิด Add dialog
2. กรอก Code และ Name ที่ไม่ซ้ำ
3. เปลี่ยน Type เป็น "Stock Out"
4. กรอก Description เป็นข้อความที่ระบุตัวได้
5. กด Create
6. ค้นหารหัสนั้นใน list แล้วเปิดรายการขึ้นมาดูอีกครั้ง
7. (cleanup) ลบรายการที่สร้าง
**Expected**
ขึ้น toast "Adjustment Type created successfully" และ dialog ปิดเอง; แถวใหม่ปรากฏใน list โดยคอลัมน์ Type แสดงชิป **"Stock Out"** พร้อมไอคอนกล่องลูกศรลงสีแดง (`PackageMinus`) และ Status เป็น Active; เปิดรายการขึ้นมาอีกครั้งแล้ว Code / Name / Type = Stock Out / Description ตรงกับที่กรอกทุกช่อง

---
## TC-AT-030004 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type`
**Steps**
1. เปิด Add dialog แล้วกรอก Code, Name, Description และเปลี่ยน Type เป็น Stock Out พร้อมปิดสวิตช์สถานะ
2. กด Cancel
3. เปิด Add dialog ใหม่อีกครั้ง
4. ค้นหารหัสที่เพิ่งกรอกไว้ใน list
**Expected**
dialog ปิดโดยไม่มี toast ใด ๆ; เปิดใหม่แล้วทุกช่องกลับเป็นค่าเริ่มต้น (Code/Name/Description ว่าง, Type = Stock In, สวิตช์สถานะเปิด) เพราะ `ConfigEntityDialog` เรียก `form.reset(toFormValues(entity))` ทุกครั้งที่เปิด; ค้นหารหัสนั้นแล้วไม่พบแถวใดใน list (ไม่มีอะไรถูกบันทึก)

---
## TC-AT-040005 — หัวข้อและปุ่มของ dialog ตอนแก้ไข พร้อมค่าที่ถูกเติมครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; **มีรายการที่เทสสร้างขึ้นเอง** 1 รายการ ที่กรอก Code / Name / Type = Stock Out / Description ไว้ครบ
**Steps**
1. ค้นหารหัสนั้นใน list
2. คลิกปุ่มลิงก์ในคอลัมน์ **Code** ของแถวนั้น
3. ดูหัวข้อ dialog, ค่าในทุกช่อง และปุ่มท้าย dialog
**Expected**
คลิกที่ค่าในคอลัมน์ Code เปิด dialog แก้ไขได้ (คอลัมน์ Name ไม่ใช่ปุ่ม คลิกแล้วไม่เปิดอะไร); หัวข้อ dialog คือ **"Edit Adjustment Type"**; ทุกช่องถูกเติมค่าเดิมครบ — Code, Name, Type = Stock Out, Description และสถานะสวิตช์ตรงกับที่บันทึกไว้; ปุ่มท้าย dialog คือ **Cancel** และ **Save** (ไม่ใช่ Create)

---
## TC-AT-040006 — เปลี่ยนชนิดจาก Stock In เป็น Stock Out แล้วป้ายในตารางเปลี่ยนตาม
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; **สร้างรายการของเทสเองขึ้นมาใหม่** 1 รายการ ชนิด Stock In (ห้ามแก้รายการเดิมของ BU — ดูหมายเหตุข้อ 15)
**Steps**
1. ค้นหารหัสนั้นแล้วเปิด dialog แก้ไขจากคอลัมน์ Code
2. เปลี่ยน Type เป็น "Stock Out" แล้วกด Save
3. กลับเข้าหน้า list ใหม่แล้วค้นหารหัสเดิม
4. เปิด dialog ขึ้นมาอ่านค่าอีกครั้ง
5. (cleanup) ลบรายการที่สร้าง
**Expected**
ขึ้น toast "Adjustment Type updated successfully" และ dialog ปิด; แถวเดิมในตารางเปลี่ยนชิปคอลัมน์ Type จาก "Stock In" (ไอคอน `PackagePlus` สีเขียว) เป็น **"Stock Out"** (ไอคอน `PackageMinus` สีแดง); เปิด dialog อีกครั้งแล้วช่อง Type ค้างอยู่ที่ Stock Out (ค่าถูก persist จริง ไม่ใช่แค่ optimistic update); ตั้งตัวกรอง Type = Stock Out แล้วแถวนี้ยังอยู่ในผลลัพธ์

---
## TC-AT-040007 — แก้ไขรหัสของรายการที่มีอยู่แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; **สร้างรายการของเทสเองขึ้นมาใหม่** 1 รายการ และเตรียมรหัสใหม่ที่ไม่ซ้ำไว้อีกหนึ่งค่า
**Steps**
1. ค้นหารหัสเดิมแล้วเปิด dialog แก้ไข
2. สังเกตว่าช่อง Code แก้ไขได้หรือไม่
3. ล้างค่าเดิมแล้วกรอกรหัสใหม่ กด Save
4. กลับเข้าหน้า list ใหม่แล้วค้นหาทั้งรหัสใหม่และรหัสเดิม
5. (cleanup) ลบรายการที่สร้าง
**Expected**
ช่อง Code **ไม่ถูก disable ในโหมดแก้ไข** (dialog disable เฉพาะตอนกำลังบันทึกหรือโหมดอ่านอย่างเดียว) จึงพิมพ์ทับได้; กด Save แล้วขึ้น toast "Adjustment Type updated successfully"; ค้นหารหัสใหม่พบแถวเดิม (ชื่อและชนิดไม่เปลี่ยน) ส่วนค้นหารหัสเดิมไม่พบอะไร

---
## TC-AT-040008 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type` บน desktop; มีชนิดการปรับปรุงอย่างน้อย 1 รายการ
**Steps**
1. สลับเป็นมุมมองการ์ด
2. คลิกที่หัวเรื่อง/ตัวการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
3. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
dialog "Edit Adjustment Type" เปิดขึ้นพร้อมค่าของรายการบนการ์ดใบนั้นครบทุกช่อง (`ListCard.onOpen` ผูกกับ `onEdit`); กด Cancel แล้ว dialog ปิดและยังอยู่ในมุมมองการ์ดเหมือนเดิม ไม่มีอะไรถูกบันทึก

---
## TC-AT-050003 — ข้อความยืนยันลบอ้างชื่อชนิดการปรับปรุง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; **สร้างรายการของเทสเองขึ้นมาใหม่** 1 รายการ และจดชื่อไว้
**Steps**
1. ค้นหารหัสนั้นใน list
2. เปิดเมนู Row actions ของแถวแล้วเลือก Delete
3. อ่านหัวข้อและข้อความใน dialog ยืนยัน แล้วกดยืนยันลบ
**Expected**
กล่องยืนยันเป็น `alertdialog` ที่มีหัวข้อ **"Delete Adjustment Type"** และข้อความ **"Are you sure you want to delete adjustment type "<ชื่อ>"? This action cannot be undone."** โดย `<ชื่อ>` คือ **ชื่อ (name)** ของรายการ ไม่ใช่รหัส (`entityNameField="name"`); ปุ่มในกล่องคือ Cancel และ Delete (สีแดง); กดยืนยันแล้วขึ้น toast "Adjustment Type deleted successfully" และแถวหายจาก list

---
## TC-AT-050004 — ลบชนิดการปรับปรุงจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com (มีสิทธิ์ลบและสัญญายังไม่หมดอายุ); **สร้างรายการของเทสเองขึ้นมาใหม่** 1 รายการ; อยู่ในมุมมองการ์ดบน desktop
**Steps**
1. ค้นหารหัสของรายการนั้นเพื่อให้เหลือการ์ดใบเดียว
2. คลิกปุ่มถังขยะที่ footer ของการ์ด
3. ยืนยันการลบ
**Expected**
กล่องยืนยันเดียวกับการลบจากตารางเปิดขึ้น (อ้างชื่อรายการ); ยืนยันแล้วขึ้น toast "Adjustment Type deleted successfully" และการ์ดใบนั้นหายจากกริด — ปุ่มลบบนการ์ดกับเมนูลบในตารางผ่าน `useDeleteGate` ตัวเดียวกัน จึงต้องทำงานเหมือนกันทุกประการ

---
## TC-AT-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีผู้ใช้ที่เห็นหน้า `/config/adjustment-type` ได้ (มี `configuration.adjustment_type.view`) แต่ **ไม่มี** `configuration.adjustment_type.create` และไม่ใช่ admin; สัญญาของ BU ยังไม่หมดอายุ
**Steps**
1. Login เป็นผู้ใช้นั้นแล้วไปที่ `/config/adjustment-type`
2. สังเกตปุ่ม "Add Adjustment Type"
3. คลิกปุ่มนั้น
**Expected**
ปุ่ม Add **ยังแสดงอยู่แต่จางลงและมี `aria-disabled`**; คลิกแล้ว **ไม่มี dialog สร้างรายการเปิดขึ้น** แต่เด้ง dialog แจ้งสิทธิ์ที่อ้างสิทธิ์ `configuration.adjustment_type.create` แทน (`dispatchPermissionDenied`); ตารางยังอ่านได้ตามปกติ

---
## TC-AT-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
มีผู้ใช้ที่มี `configuration.adjustment_type.view` แต่ **ไม่มี** `configuration.adjustment_type.update` และไม่ใช่ admin; มีชนิดการปรับปรุงอย่างน้อย 1 รายการ
**Steps**
1. Login เป็นผู้ใช้นั้นแล้วไปที่ `/config/adjustment-type`
2. คลิกค่าในคอลัมน์ Code ของแถวใดแถวหนึ่ง
3. ลองพิมพ์ในช่อง Name และลองเปิด dropdown Type
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว (`readOnly` มาจาก `updateDenied || !canWrite`): ทุกช่อง (Code, Name, Type, Description) และสวิตช์สถานะถูก **disabled** พิมพ์/เลือกไม่ได้; ปุ่มท้าย dialog เหลือปุ่มเดียวคือ **"Close"** — **ไม่มีปุ่ม Save**

---
## TC-AT-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
มีผู้ใช้ที่มี `configuration.adjustment_type.view` แต่ **ไม่มี** `configuration.adjustment_type.delete` และไม่ใช่ admin; สัญญาของ BU ยังไม่หมดอายุ; มีชนิดการปรับปรุงอย่างน้อย 1 รายการ
**Steps**
1. Login เป็นผู้ใช้นั้นแล้วไปที่ `/config/adjustment-type`
2. เปิดเมนู Row actions ของแถวแรก
3. คลิก "Delete"
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่มถังขยะที่ footer ของการ์ดใบเดียวกัน
**Expected**
รายการ Delete ในเมนูแสดงแบบจาง (`opacity-50`) พร้อม `aria-disabled` แต่ยังคลิกได้; คลิกแล้ว **ไม่มีกล่องยืนยันลบ** แต่เด้ง dialog แจ้งสิทธิ์ที่อ้าง `configuration.adjustment_type.delete`; ปุ่มลบบนการ์ดให้ผลเหมือนกันทุกประการ (ทั้งสองทางอ่าน `useDeleteGate` ตัวเดียวกัน); ไม่มีรายการใดถูกลบ

---
## TC-AT-100008 — ไม่มีสิทธิ์ดู — เมนู Adjustment Type เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีผู้ใช้ที่เข้าโมดูล Configuration ได้แต่ **ไม่มี** `configuration.adjustment_type.view`
**Steps**
1. Login เป็นผู้ใช้นั้น
2. เปิดเมนู Modules แล้วเข้าโมดูล Configuration
3. หารายการ "Adjustment Type" ในเมนูด้านข้างแล้วคลิก
**Expected**
รายการ Adjustment Type แสดงแบบจางและ **ไม่ใช่ลิงก์ที่พาไปหน้า** — คลิกแล้วเด้ง dialog แจ้งสิทธิ์ที่อ้าง `configuration.adjustment_type.view` และ URL ไม่เปลี่ยน; หน้านี้ **ไม่มี** เส้นทางล็อกเพราะ license (โมดูลไม่ได้ประกาศ `licenseFeature`) จึงต้องไม่เห็นไอคอนแม่กุญแจหรือ dialog เรื่องสัญญาที่รายการนี้

---
## TC-AT-200004 — เว้นรหัสว่างแล้วบันทึก ต้องขึ้นข้อความ "Code is required"
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type`
**Steps**
1. เปิด Add dialog
2. กรอกเฉพาะ Name (เว้น Code ว่าง) แล้วกด Create
3. อ่านข้อความ error ที่ช่อง Code (hover/focus ที่ไอคอนเตือนถ้าข้อความอยู่ใน tooltip)
4. กรอก Code แล้วสังเกตว่าข้อความหายหรือไม่
**Expected**
ฟอร์มไม่ถูกส่ง dialog ยังเปิดอยู่และไม่มี toast; ช่อง Code ถูกทำเครื่องหมาย `aria-invalid` พร้อมข้อความ **"Code is required"** (ข้อความมาจาก `adjustmentTypeSchema` ตรง ๆ ไม่ผ่าน i18n); ช่อง Name ที่กรอกไว้แล้วไม่มี error; กรอก Code แล้วกด Create ใหม่ ข้อความหายและรายการถูกสร้างสำเร็จ (อย่าลืมลบ record ที่สร้างออกตอน cleanup)

---
## TC-AT-200005 — ช่องรหัสจำกัด 10 ตัวอักษร และคำอธิบายจำกัด 256 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type`
**Steps**
1. เปิด Add dialog
2. พิมพ์/วางข้อความยาว 30 ตัวอักษรลงในช่อง Code แล้วอ่านค่าที่อยู่ในช่อง
3. พิมพ์/วางข้อความยาว 300 ตัวอักษรลงในช่อง Description แล้วอ่านค่าที่อยู่ในช่อง
4. กด Cancel
**Expected**
ค่าในช่อง Code ถูกตัดที่ **10 ตัวอักษร** (`maxLength={10}` — สั้นกว่าทุกโมดูลในชุด config ที่ใช้ 100) และค่าในช่อง Description ถูกตัดที่ **256 ตัวอักษร** (`maxLength={256}`); ไม่มีข้อความ validation ขึ้น เพราะการจำกัดเกิดที่ attribute ของ input ไม่ใช่ที่ schema

---
## TC-AT-200006 — ช่อง Type เป็นฟิลด์บังคับที่มีเพียงสองตัวเลือกและไม่มีสถานะว่าง
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/adjustment-type`
**Steps**
1. เปิด Add dialog แล้วสังเกตป้ายของช่อง Type และค่าที่แสดงอยู่
2. เปิด dropdown ของช่อง Type แล้วนับตัวเลือก
3. เลือก "Stock Out" แล้วเปิด dropdown อีกครั้ง
4. กด Escape เพื่อปิด dropdown โดยไม่เปลี่ยนค่า
**Expected**
ป้ายของช่อง Type มีเครื่องหมายบังคับกรอก; dropdown มี **เพียงสองตัวเลือกคือ "Stock In" และ "Stock Out"** (ตาม `ADJUSTMENT_TYPE_OPTIONS`) โดยไม่มีรายการว่างหรือ "All"; ช่องนี้ **ไม่มีทางอยู่ในสถานะว่างได้จากการใช้งานปกติ** เพราะ `toFormValues(null)` ตั้งค่าเริ่มต้นเป็น Stock In ไว้แล้ว — เคสนี้จึง assert ว่า UI แสดงตัวเลือกครบตามออกแบบ ไม่ใช่ assert ว่ามีข้อความ "Type is required" ขึ้น; เลือก Stock Out แล้วเปิดใหม่ ตัวเลือกที่เลือกอยู่ถูกทำเครื่องหมายไว้; กด Escape แล้วค่าที่เลือกไว้ไม่เปลี่ยน
