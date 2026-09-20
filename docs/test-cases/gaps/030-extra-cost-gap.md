# Extra Cost Type — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/030-extra-cost.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/030-extra-cost.md`_

**Module:** Config — Extra Cost Type (ค่าใช้จ่ายเพิ่มเติม)
**Frontend route:** `routes/config/extra-cost`  •  **URL:** `/config/extra-cost`
**Prefix:** `EC`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/030-extra-cost.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 29

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/030-extra-cost.spec.ts` ถือ ID `TC-EC-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-EC-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, create/edit name/delete ครบรอบ, toggle `is_active` แล้ว persist, แก้ชื่อแล้ว persist, กด Cancel แล้วค่าไม่ถูกบันทึก, ยกเลิกการลบ, name ว่าง (ทั้งตอนสร้างและตอนแก้), name ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 30/90 ใช้ไม่ได้กับ prefix `EC`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `030-extra-cost.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ตามขนบอยู่บล็อก 30) และเคส edge (ตามขนบอยู่บล็อก 90) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือ/แถบหัวหน้า list — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `030-extra-cost.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 3. **Extra Cost Type ไม่มีทั้ง `code` และ `description`** — ต่างจาก `083-shelf.md` ที่ใช้เทียบ: ฟอร์มทั้งใบมีแค่ **Name** (บังคับ, `maxLength=100`, `id="extra-cost-name"`, placeholder `"e.g. Shipping, Insurance"`) กับ **สวิตช์สถานะ** (`id="extra-cost-is-active"`) เท่านั้น ยืนยันจาก `extra-cost-dialog.tsx` + `extra-cost-form-schema.ts` (`z.object({ name, is_active })`) เคสของ shelf ที่ผูกกับ code / description / ลำดับ จึง**ถูกตัดทิ้ง ไม่ได้แปลงมาเป็นฟิลด์อื่น** เพราะโมดูลนี้ไม่มีฟิลด์อื่นให้แปลงไปหา
> 4. **ลำดับคอลัมน์ไม่เหมือน config module ตัวอื่น** — `use-extra-cost-table.tsx` ส่ง `hideStatus: true` ให้ `useConfigTable` แล้ว**ใส่ `statusColumn()` เข้ามาเองใน `columns`** ก่อน `auditColumns` ผลคือ Status อยู่ **ระหว่าง Name กับ Created** ไม่ใช่ท้ายสุดก่อนคอลัมน์ปุ่มแบบที่ `useConfigTable` วางให้ตามปริยาย และตารางนี้**ไม่มีคอลัมน์ Description**
> 5. **เมนูเรียงลำดับและเมนูคอลัมน์เรียกคอลัมน์สถานะว่า `is_active`** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ไม่ได้ตั้ง `meta.headerTitle` ทั้ง `DataGridSortMenu` และ `DataGridColumnVisibility` จึง fallback ไปใช้ `column.id` (= `is_active`) ส่วนหัวคอลัมน์ในตารางยังอ่านว่า "Status" ปกติ — บันทึกไว้เป็นข้อเท็จจริง เคส `TC-EC-010011` / `TC-EC-010013` จึง assert ว่า **มีรายการของคอลัมน์สถานะและใช้งานได้** ไม่ได้ assert ว่าข้อความต้องเป็น "Status"
> 6. **หน้านี้มี default sort แต่ URL ไม่มี `sort`** — `defaultSort="name:asc"` ถูกส่งให้ `ConfigListTemplate` → `useDataGridState` เติม sorting state ให้ แต่ไม่เขียนลง URL ผลตามที่ `DataGridSortMenu` เขียนคอมเมนต์ไว้คือ **แถว "Default" ติดเครื่องหมายอยู่ พร้อมกับแถว Name ที่มีลูกศรขึ้น ในเมนูเดียวกัน** และไม่มีทางกลับไปสถานะ "ไม่เรียง" ได้เลย (กด Default = กลับไป `name:asc` ตาม default) — เป็นพฤติกรรมตามออกแบบ ไม่ใช่บั๊ก
> 7. **ข้อความ validation ไม่ได้อยู่ใต้ช่อง** — `FieldInput` แสดง error เป็น `aria-invalid="true"` บน input + ไอคอน `CircleAlert` สีแดงในช่อง + **tooltip** ที่ขึ้นตอน hover/focus ไม่มีบรรทัดข้อความใต้ช่องแบบ `FieldError` สเปกเดิม (`TC-EC-200001`) assert แค่ `[aria-invalid='true']` `TC-EC-200004` จึงมาเก็บเนื้อความ "Name is required" ที่ tooltip
> 8. **เมนู Row actions ของแถวไม่มี Edit** — `useExtraCostTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` → `actionColumn` จึง render เฉพาะ Activity + Delete ทางเข้าแก้ไขมีสองทางคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction`) และการคลิกตัวการ์ดในมุมมองการ์ด
> 9. **โมดูลนี้มี `licenseFeature`** — `constant/module-list.ts` ระบุ `licenseFeature: "configuration.extra_cost_type"` (ต่างจาก business-type ที่ไม่มี) BU ที่ไม่ได้ซื้อจึงเห็นแม่กุญแจใน sidebar และโดน `AccessDeniedBlock` แบบ "Feature Not Licensed" ตอนเข้า URL ตรง ๆ — `TC-EC-100009` มีได้เพราะข้อนี้
> 10. **`useExtraCostTable` ไม่ได้รับ `permissionPrefix` ต่อ** — `ConfigListTemplate` ส่ง `permissionPrefix` เข้ามาใน `useTable(...)` แต่ `UseExtraCostTableOptions` ไม่ได้ประกาศฟิลด์นี้ จึงไม่ถูกส่งต่อให้ `useConfigTable` → `useDeleteGate(undefined)` ตก fallback ไปใช้ `usePermissionPrefix()` ที่ derive จาก route ซึ่งได้ `configuration.extra_cost` เท่ากันพอดี **วันนี้จึงไม่มีผลต่อพฤติกรรม** — บันทึกไว้เพราะถ้า route กับ permission ของโมดูลนี้แยกจากกันเมื่อไหร่ ปุ่มลบจะเช็คสิทธิ์ผิดตัวเงียบ ๆ
> 11. **ชื่อที่เป็นช่องว่างล้วนผ่าน client validation** (`z.string().min(1)` นับช่องว่างเป็น 1 ตัวอักษร) และปุ่มลิงก์บนคอลัมน์ Name จะกลายเป็นปุ่มที่มองไม่เห็นข้อความ (fallback `|| "..."` ทำงานเฉพาะตอน name เป็นสตริงว่างจริง ๆ) — บันทึกเป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นบั๊ก
> 12. **ไฟล์ export มีแค่ 2 คอลัมน์** — `exportColumns` ของโมดูลนี้คือ Name กับ Status เท่านั้น (ไม่มี Created/Updated) ต่างจาก unit ที่มี 4 คอลัมน์
> 13. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EC-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์ตามลำดับของโมดูลนี้ | High | Smoke |
| TC-EC-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-EC-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-EC-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-EC-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-EC-010011 | เมนูเรียงลำดับ — default `name:asc` ที่ไม่อยู่ใน URL | Medium | Functional |
| TC-EC-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-EC-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-EC-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-EC-010015 | ส่งออกรายการเป็นไฟล์ XLSX สองคอลัมน์ | Medium | Functional |
| TC-EC-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-EC-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-EC-010018 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-EC-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-EC-030003 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-EC-030004 | ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และปิด dialog ไม่ได้ | Medium | Functional |
| TC-EC-040005 | หัวข้อ/ปุ่ม/ข้อความ toast ของโหมดแก้ไข | Medium | Functional |
| TC-EC-040006 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-EC-040007 | เปิดสองรายการติดกัน ฟอร์มต้องรีเซ็ตตามรายการที่เปิด | Medium | Functional |
| TC-EC-050003 | ข้อความยืนยันลบแสดงชื่อรายการ | Medium | Functional |
| TC-EC-050004 | ลบรายการจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-EC-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-EC-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-EC-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete และปุ่มบนการ์ดเด้งแจ้งสิทธิ์ | Medium | Authorization |
| TC-EC-100008 | ไม่มีสิทธิ์ดู — เมนู sidebar เป็นปุ่มจาง และ URL ตรงถูกบล็อก | High | Authorization |
| TC-EC-100009 | BU ไม่ได้ซื้อ feature — แม่กุญแจใน sidebar และกล่อง Feature Not Licensed | Medium | Authorization |
| TC-EC-100010 | สัญญาหมดอายุ — เขียนไม่ได้ทั้งหน้าแม้เป็น admin | Medium | Security |
| TC-EC-200004 | ข้อความ error ของ Name อยู่ใน tooltip ไม่ใช่ใต้ช่อง | Medium | Validation |
| TC-EC-200005 | บันทึกไม่สำเร็จต้องมี error toast ให้ผู้ใช้เห็น | Medium | Negative |

---
## TC-EC-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์ตามลำดับของโมดูลนี้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีรายการค่าใช้จ่ายเพิ่มเติมอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/extra-cost`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Extra Cost Type" พร้อมคำอธิบายใต้ชื่อ ("Charges that ride along with a delivery — freight, insurance, customs — and get shared into item cost."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), **Name, Status**, Created, Updated และคอลัมน์ปุ่มจัดการท้ายแถว โดย **Status อยู่ก่อน Created ไม่ใช่ท้ายสุด** และ **ไม่มีคอลัมน์ Description**; คอลัมน์ Created / Updated ถูกซ่อนไว้ตั้งแต่ต้น; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Extra Cost Type"

---
## TC-EC-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost`; มีรายการหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับรายการที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-EC-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search..."); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-EC-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` บน desktop; มีรายการทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. เปิดแถว Status ในเมนู แล้วเลือก "Active" จากรายการ All / Active / Inactive
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เปลี่ยนเป็น "Inactive"
**Expected**
โมดูลนี้มีตัวกรองชุดเดียวคือ Status (ดู `EXTRA_COST_FILTER_FIELDS`); ตารางเหลือเฉพาะรายการที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip ของ Status พร้อมปุ่มลบ; query string มี `filter=is_active|bool:true` (encode แล้ว) และ `page` ถูกรีเซ็ต; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน (`is_active|bool:false`)

---
## TC-EC-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-EC-010011 — เมนูเรียงลำดับ — default `name:asc` ที่ไม่อยู่ใน URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/extra-cost` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีรายการอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายการในเมนู
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
เข้าครั้งแรก URL **ไม่มี** `sort` แต่แถวเรียงตามชื่อ A→Z ตาม `defaultSort="name:asc"`; ในเมนูมีทั้งเครื่องหมายที่แถว "Default" และลูกศรขึ้นที่แถว Name พร้อมกัน (ตามที่อธิบายไว้ในหมายเหตุข้อ 6); เมนูแสดงคอลัมน์ที่เรียงได้ 4 รายการคือ Name, คอลัมน์สถานะ (ป้ายอ่านว่า `is_active` — ดูหมายเหตุข้อ 5), Created, Updated; เลือก Name ครั้งแรกได้ `sort=name:desc` พร้อมลูกศรลงและลำดับแถวสลับ, เลือกซ้ำได้ `sort=name:asc`; เลือก Default ล้าง `sort` ออกจาก URL และลำดับกลับเป็น A→Z (ไม่มีสถานะ "ไม่เรียง")

---
## TC-EC-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` บนหน้าจอขนาด desktop; มีรายการอย่างน้อย 1 รายการที่เคยถูกแก้ไขแล้ว (มีทั้ง created และ updated ใน audit)
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อรายการเป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive) ตามด้วยแถว Created / By / Updated **เท่านั้น** — ไม่มีแถว Code หรือ Description เพราะโมดูลนี้ไม่มีฟิลด์เหล่านั้น (ดู `extra-cost-card.tsx`); footer ของการ์ดมีปุ่ม Delete; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-EC-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตรายการในเมนูและสถานะติ๊กของ Created กับ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Name
**Expected**
เมนูมี 4 รายการคือ Name, คอลัมน์สถานะ, Created, Updated (ช่องเลือก, ลำดับที่ และคอลัมน์ปุ่มไม่อยู่ในเมนูเพราะไม่มี accessor); Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น ตรงกับ `columnVisibility: { created_at: false, updated_at: false }` ใน `use-extra-cost-table.tsx`; เปิดแล้วคอลัมน์ทั้งสองปรากฏพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Name แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-EC-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` ในมุมมองตาราง; BU มีรายการมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-EC-010015 — ส่งออกรายการเป็นไฟล์ XLSX สองคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` บน desktop; มีรายการอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ชื่อ `extraCost_<YYYY-MM-DD>.xlsx` (prefix มาจากส่วนท้ายของ `translationNamespace` เพราะโมดูลนี้ไม่ได้ตั้ง `exportFileNamePrefix`); ชีทชื่อ "Extra Cost Type" มี **2 คอลัมน์เท่านั้น** คือ Name และ Status โดย Status เป็นคำว่า Active/Inactive ไม่ใช่ true/false; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-EC-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-EC-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/extra-cost` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่องชื่อ (จำกัด 120 ตัวอักษร) และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็น `View: <ชื่อ>` และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-EC-010018 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/extra-cost` และมีรายการอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name หรือการคลิกการ์ด); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมของรายการแถวนั้น โดยหัวเรื่อง sheet อ้างชื่อรายการ (`activity.label` = `r.name`) และปิด sheet กลับมาหน้าเดิมได้โดยข้อมูลไม่เปลี่ยน

---
## TC-EC-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/extra-cost`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Extra Cost Type"
2. อ่านหัวข้อ dialog และทุกอย่างในฟอร์ม
**Expected**
หัวข้อ dialog คือ "Add Extra Cost Type"; **ฟอร์มมีของแค่สองชิ้น** คือช่อง Name (`#extra-cost-name`) ที่ว่าง มี placeholder "e.g. Shipping, Insurance", มี `*` สีแดงท้าย label และ `maxlength="100"` กับกล่องสวิตช์สถานะ (`#extra-cost-is-active`) ที่หัวข้อ "Active" คำอธิบาย "Enable or disable this record" — **ไม่มีช่อง Code และไม่มีช่อง Description**; สวิตช์อยู่ที่เปิดใช้งาน (`aria-checked="true"`) พร้อมป้าย "Active" สีเขียวใต้สวิตช์; footer มีปุ่ม Cancel และปุ่ม Create (ไม่ใช่ Save)

---
## TC-EC-030003 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/extra-cost`; เปิด dialog "Add Extra Cost Type" กรอก Name และปิดสวิตช์สถานะไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Extra Cost Type" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่า `EMPTY_FORM` (Name ว่าง, สวิตช์กลับมาเปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-EC-030004 — ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และปิด dialog ไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Extra Cost Type" และกรอก Name ที่ไม่ซ้ำไว้แล้ว; ต้องดูจังหวะระหว่างคำขอ create ยังค้างอยู่ (หน่วง response ฝั่งเทสได้ถ้าเครือข่ายเร็วเกินจะจับทัน)
**Steps**
1. คลิกปุ่ม Create แล้วสังเกตปุ่มทั้งสองใน footer ทันที
2. ระหว่างที่ยังบันทึกไม่เสร็จ ลองกด Escape และคลิกนอก dialog
3. รอจนคำขอเสร็จ
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ระหว่างบันทึก ปุ่ม submit เปลี่ยนข้อความเป็น "Creating..." และถูก disable, ปุ่ม Cancel ถูก disable ด้วย; กด Escape หรือคลิกนอก dialog แล้ว dialog **ไม่ปิด** (`ConfigEntityDialog` ส่ง `onOpenChange` เป็น `undefined` ขณะ `isPending`); เมื่อคำขอสำเร็จ toast "Extra Cost Type created successfully" ขึ้นและ dialog ปิดเอง

---
## TC-EC-040005 — หัวข้อ/ปุ่ม/ข้อความ toast ของโหมดแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีรายการที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. ค้นหารายการนั้นแล้วคลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog
2. อ่านหัวข้อ dialog และป้ายปุ่มใน footer
3. แก้ชื่อเล็กน้อยแล้วกดปุ่มบันทึก
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog คือ "Edit Extra Cost Type" (ไม่ใช่ "Add ..."); ปุ่ม submit มีป้ายว่า "Save" ไม่ใช่ "Create" และระหว่างบันทึกเปลี่ยนเป็น "Saving..."; บันทึกสำเร็จแล้วขึ้น toast ข้อความเต็มว่า **"Extra Cost Type updated successfully"** และ dialog ปิดเอง

---
## TC-EC-040006 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/extra-cost` และสลับเป็นมุมมองการ์ดแล้ว; มีรายการอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Extra Cost Type" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Name และสถานะสวิตช์ตรงกับป้าย Status บนการ์ด); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-EC-040007 — เปิดสองรายการติดกัน ฟอร์มต้องรีเซ็ตตามรายการที่เปิด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีรายการที่สร้างไว้สำหรับเทสนี้ 2 รายการที่ชื่อและสถานะต่างกัน (รายการหนึ่ง Active อีกรายการ Inactive)
**Steps**
1. คลิกชื่อรายการแรกเพื่อเปิด dialog แล้วอ่านค่าในฟอร์ม
2. กด Cancel
3. คลิกชื่อรายการที่สองเพื่อเปิด dialog
4. ลบทั้งสองรายการเพื่อคืนสภาพ
**Expected**
ครั้งที่สอง ฟอร์มแสดงชื่อและสถานะของ**รายการที่สอง** ไม่มีค่าค้างจากรายการแรกเลย (ทั้งช่อง Name และสวิตช์สถานะ) — `ConfigEntityDialog` `reset` ใหม่ทุกครั้งที่ `open`/`entity` เปลี่ยน

---
## TC-EC-050003 — ข้อความยืนยันลบแสดงชื่อรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีรายการที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยัน (role `alertdialog`) มีหัวข้อ "Delete Extra Cost Type" และคำอธิบายเต็มว่า `Are you sure you want to delete extra cost type "<ชื่อ>"? This action cannot be undone.`; footer มีปุ่ม Cancel และปุ่ม Delete สีเตือน (ระหว่างลบเปลี่ยนเป็น "Deleting..."); ยืนยันแล้วขึ้น toast "Extra Cost Type deleted successfully"

---
## TC-EC-050004 — ลบรายการจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีรายการที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของรายการนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (guard `closest("button")` ใน `ListCard` กันการคลิกทะลุไปเป็นการเปิดการ์ด) แต่เปิด dialog ยืนยันลบใบเดียวกับที่เปิดจากแถวในตาราง; ยืนยันแล้วแสดง toast "Extra Cost Type deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-EC-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.extra_cost.view` แต่ไม่มี `configuration.extra_cost.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`); สัญญาของ BU ยังไม่หมดอายุ (ไม่งั้นจะได้ dialog คนละใบ — ดู TC-EC-100010)
**Steps**
1. ไปที่ `/config/extra-cost`
2. สังเกตสภาพปุ่ม "Add Extra Cost Type"
3. คลิกปุ่มนั้น
**Expected**
ปุ่ม "Add Extra Cost Type" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้างรายการ แต่เด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน

---
## TC-EC-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.extra_cost.view` แต่ไม่มี `configuration.extra_cost.update` และไม่ใช่ admin ของ BU; มีรายการอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/extra-cost`
2. คลิกชื่อรายการในคอลัมน์ Name เพื่อเปิด dialog
3. ลองแก้ค่าในช่อง Name และสลับสวิตช์สถานะ
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง Name และสวิตช์สถานะถูก disable ทั้งคู่ แก้ค่าไม่ได้; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-EC-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete และปุ่มบนการ์ดเด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.extra_cost.view` แต่ไม่มี `configuration.extra_cost.delete` และไม่ใช่ admin ของ BU; สัญญาของ BU ยังไม่หมดอายุ; มีรายการอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/extra-cost`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"` (ยังคลิกได้ ไม่ได้ถูก disable จริง); คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน `useDeleteGate` ตัวเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-EC-100008 — ไม่มีสิทธิ์ดู — เมนู sidebar เป็นปุ่มจาง และ URL ตรงถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `configuration.extra_cost.view` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบ**ยังมี license `configuration.extra_cost_type`** (ไม่งั้นจะกลายเป็นเคส TC-EC-100009 ซึ่งเป็นคนละเหตุผล)
**Steps**
1. เข้าโมดูล Config แล้วมองหารายการ "Extra Cost Type" ใน sidebar
2. คลิกรายการนั้น
3. พิมพ์ URL `/config/extra-cost` ตรง ๆ
**Expected**
รายการ "Extra Cost Type" ยังอยู่ในเมนูแต่ถูกทำให้จาง (opacity ต่ำลง) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/extra-cost">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจ** (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; เข้า URL ตรง ๆ ถูก `RouteGuard` บล็อกด้วยกล่อง "Permission Denied" ที่มีบรรทัด "Contact your administrator to request access." และปุ่มพาไปหน้าที่เข้าได้ โดยไม่เห็นข้อมูลของโมดูลเลย

---
## TC-EC-100009 — BU ไม่ได้ซื้อ feature — แม่กุญแจใน sidebar และกล่อง Feature Not Licensed
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เข้า BU ที่สัญญา**ไม่รวม** feature `configuration.extra_cost_type` (`constant/module-list.ts` ผูก licenseFeature นี้ไว้กับ `/config/extra-cost`); บัญชีที่ใช้ทดสอบเป็น admin ของ BU นั้นก็ได้ เพราะ license **ไม่มี admin bypass**
**Steps**
1. เข้าโมดูล Config แล้วมองหารายการ "Extra Cost Type" ใน sidebar
2. คลิกรายการนั้น
3. พิมพ์ URL `/config/extra-cost` ตรง ๆ
**Expected**
รายการ "Extra Cost Type" แสดงแบบจางพร้อม **ไอคอนแม่กุญแจ** ต่อท้ายชื่อ และไม่ใช่ลิงก์; คลิกแล้วเด้ง dialog เหตุผล license หัวข้อ "Feature Not Licensed"; เข้า URL ตรง ๆ ได้กล่อง `AccessDeniedBlock` ที่คำอธิบายเป็นข้อความ license ("This feature is not included in your organization's subscription...") และ **ไม่มี**บรรทัด "Contact your administrator to request access." (บรรทัดนั้นมีเฉพาะเหตุผล permission); แม้ล็อกอินเป็น admin ของ BU นั้นก็ยังเข้าไม่ได้

---
## TC-EC-100010 — สัญญาหมดอายุ — เขียนไม่ได้ทั้งหน้าแม้เป็น admin
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login เข้า BU ที่สถานะสัญญาเป็น expired หรือ inactive (`useLicense().canWrite === false`) แต่ยังมี feature `configuration.extra_cost_type` อยู่ในสัญญา; บัญชีเป็น admin ของ BU นั้น
**Steps**
1. ไปที่ `/config/extra-cost`
2. สังเกตว่าตารางยังอ่านข้อมูลได้ไหม
3. คลิกปุ่ม "Add Extra Cost Type"
4. เปิดเมนู Row actions ของแถวแรกแล้วชี้ที่รายการ Delete
5. คลิกชื่อรายการในคอลัมน์ Name เพื่อเปิด dialog
**Expected**
ข้อมูลยัง**อ่านได้ปกติ** (สัญญาหมดอายุ = read-only ไม่ใช่บล็อกหน้า); ปุ่ม Add ถูกทำให้จางและคลิกแล้วเด้ง dialog เหตุผล "expired" (หัวข้อ "Subscription Expired") ไม่ใช่ "Permission Denied" ทั่วไป — และเด้งแม้ผู้ใช้เป็น admin เพราะ license ไม่มี bypass; รายการ Delete ในเมนู**ถูก disable จริง** (คลิกไม่ได้เลย ไม่ใช่แค่จาง) พร้อม `title` อธิบายว่าสัญญาหมดอายุ; dialog ที่เปิดจากคอลัมน์ Name เป็นโหมดอ่านอย่างเดียวและมีแค่ปุ่ม "Close"

---
## TC-EC-200004 — ข้อความ error ของ Name อยู่ใน tooltip ไม่ใช่ใต้ช่อง
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Extra Cost Type" โดยยังไม่กรอกอะไร
**Steps**
1. คลิกปุ่ม Create
2. สังเกตช่อง Name และพื้นที่ใต้ช่อง
3. hover หรือ focus ที่ช่อง Name แล้วอ่าน tooltip
**Expected**
ช่อง Name ได้ `aria-invalid="true"` และมีไอคอนวงกลมอัศเจรีย์สีแดงชิดขวาภายในช่อง; **ไม่มีบรรทัดข้อความ error ใต้ช่อง** (โมดูลนี้ใช้ `FieldInput` ที่แสดง error เป็น tooltip ไม่ได้ใช้ `FieldError`); tooltip ที่ขึ้นตอน hover/focus มีข้อความว่า **"Name is required"** (จาก `validation.required` + `field.name`); dialog ยังเปิดอยู่และไม่มีรายการถูกสร้าง

---
## TC-EC-200005 — บันทึกไม่สำเร็จต้องมี error toast ให้ผู้ใช้เห็น
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีรายการที่สร้างไว้แล้วและรู้ชื่อแน่นอน (ใช้ชื่อนั้นซ้ำเพื่อให้ backend ปฏิเสธ)
**Steps**
1. เปิด dialog "Add Extra Cost Type" แล้วกรอก Name ด้วยชื่อที่มีอยู่แล้ว
2. คลิกปุ่ม Create แล้วรอจนคำขอกลับมา
3. สังเกต toast, สภาพ dialog และปุ่ม submit
4. กด Cancel แล้วลบรายการต้นแบบเพื่อคืนสภาพ
**Expected**
มี toast แบบ error (สีแจ้งเตือน, บรรทัดเดียว, อยู่ราว 5 วินาที) ขึ้นมาแจ้งว่าบันทึกไม่สำเร็จ — ข้อความมาจาก backend ผ่าน `cleanServerMessage` และตกเป็น "Failed to create extra cost" เมื่อ backend ไม่ส่งข้อความมา (`MutationCache.onError` ใน `components/providers.tsx` เป็นคนยิง toast กลางให้ทุก mutation); dialog **ยังเปิดค้าง** พร้อมค่าที่กรอกไว้ครบ และปุ่ม submit กลับจาก "Creating..." เป็น "Create" ให้กดใหม่ได้; ไม่มีแถวใหม่เพิ่มในตาราง
