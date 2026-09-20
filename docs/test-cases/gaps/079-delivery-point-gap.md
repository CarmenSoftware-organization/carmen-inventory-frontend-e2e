# Delivery Point — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/079-delivery-point.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/079-delivery-point.md`_

**Module:** Config — Delivery Point (จุดส่งของ)
**Frontend route:** `routes/config/delivery-point`  •  **URL:** `/config/delivery-point`
**Prefix:** `DP`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/079-delivery-point.spec.ts` (50 เคส)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 30

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกนี้ใหญ่ผิดปกติ (50 เคส เทียบกับ config module อื่นที่ 14–16) แต่ 10 เคสไม่เคยรันจริง** — นี่คือ "ช่องว่างที่ซ่อนอยู่" ของโมดูลนี้ ทั้ง 10 ถือ TC-ID ไว้และรายงานผลเป็น `skipped` ไม่ใช่ `failed` จึงไม่มีใครเห็นว่าไม่ได้ทดสอบ:
>    - **8 เคสของมุมมองการ์ดตายเพราะ locator ผิด** — `TC-DP-010013`, `010014`, `010015`, `010016`, `010017`, `010018`, `010024`, `010026` ทุกตัวเริ่มด้วย `if (!(await list.viewToggleCard().isVisible())) test.skip()` และ `DeliveryPointListPage.viewToggleCard()` คือ `getByRole("button", { name: /card view/i })` แต่ปุ่มจริงใน `config-list-template.tsx:405-424` ใช้ `aria-label` จาก `common.aria.listView` = **"List view"** และ `common.aria.gridView` = **"Grid view"** — ไม่มีคำว่า "card view" อยู่ในหน้าเลย เงื่อนไขจึงเป็นจริงเสมอและ **ทั้ง 8 เคส skip ทุกครั้งที่รัน** (`viewToggleTable()` = `/table view/i` ก็ไม่แมตช์เช่นกัน แต่เคสตายก่อนถึงบรรทัดนั้น)
>    - **1 เคสของตัวกรองตายเพราะ role ผิด** — `TC-DP-010009` หา `getByRole("option", { name: /active/i })` แต่บน desktop `ListFilter` มอบงานให้ `ListFilterMenu` ซึ่งเป็น Popover ที่ render แถวเป็น `<button>` ธรรมดา (`list-filter-menu.tsx` → `MenuRow`) และตัวเลือกสถานะอยู่ใน **submenu ชั้นสองที่ต้อง hover/คลิกแถว "Status" ก่อน** ไม่มี `role="option"` ให้เจอ เคสจึงกด Escape แล้ว `test.skip()` ทุกครั้ง
>    - **1 เคสเป็น `test.fixme`** — `TC-DP-200002` (name ซ้ำ) ถูก `test.fixme` ไว้พร้อมคอมเมนต์อธิบายว่าเป็นบั๊กฝั่ง frontend: backend ตอบ 409 `DELIVERY_POINT_ALREADY_EXISTS` ถูกต้องแล้ว แต่ `lib/error-message.ts:87` แปลง 409 ทุกตัวเป็นข้อความ `documentChanged` **เอกสารนี้จึงไม่เขียนเคส "ชื่อซ้ำ" ซ้ำอีก** เพราะจะกลายเป็นเคสที่ยืนยันว่าฟีเจอร์ยังไม่ทำงาน
>
>    **สรุป: เรื่อง "มุมมองการ์ด" และ "ตัวกรองสถานะ" ยังไม่เคยถูกทดสอบจริง** เอกสารนี้จึงเขียนเคสของสองเรื่องนั้นไว้ (`TC-DP-010104`, `010105`, `010108`, `010109`, `040102`, `050102`) แม้สเปกจะ "ถือ ID" ของหัวข้อคล้ายกันอยู่แล้ว
>
> 2. **สเปกครอบอะไรไปแล้วจริง ๆ (ห้ามเขียนซ้ำ)** — `TC-DP-010001..010008`, `010010..010012`, `010019..010023`, `010025`, `010050`, `030001..030006`, `040001..040007`, `050001..050005`, `200001`, `200003..200005` เรื่องที่ครอบแล้วคือ: โหลดหน้า list + ปุ่ม Add, default 10 แถว/หน้า, เปลี่ยน per page 25/50/100, ไม่มีตัวเลือก 200, next/prev page, ค้นหาแล้วกรองได้, empty state, ค้นด้วย special char, sort หัวคอลัมน์ Name ครั้งที่ 1 (A→Z) และครั้งที่ 2 (Z→A), search+sort พร้อมกัน, เมนู Toggle Columns เปิด/ซ่อน/แสดงคอลัมน์ Name/ซ่อนทุกคอลัมน์ไม่ได้/คอลัมน์ที่ซ่อนยังค้นได้/refresh แล้วกลับ default, สร้าง (dialog เปิด, name ว่าง, active default true, บันทึก, cancel, สร้างแบบ inactive), แก้ไข (เปิดจากคอลัมน์ Name, prefill name/active, เปลี่ยนชื่อ, ชื่อเดิม, cancel, toggle active + persist), ลบ (กล่องยืนยันเปิด, confirm, cancel, count ลดลง, ลบแถวสุดท้ายของหน้า), validation (name ว่างตอนสร้าง, name ยาวเกิน 100, name เป็น space ล้วน, ลบ name ตอนแก้ไข) และ active BU = BLAVG — **เอกสารนี้ไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 3. **Section ที่ใช้** — `docs/test-id-scheme.md` ลงทะเบียนให้ `079-delivery-point.spec.ts` ไว้ที่ `01, 03–05, 10–19, 20` ซึ่ง**กว้างพอสำหรับทุกเคสในเอกสารนี้แล้ว ไม่ต้องแก้ scheme** เคส Export (ตามขนบอยู่บล็อก 30) และเคส edge (ตามขนบอยู่บล็อก 90) ถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือหน้า list ตามธรรมเนียมของโฟลเดอร์นี้ (ดู `README.md`) ส่วนบล็อก **10** ใช้กับเคส Security/Authorization และ **20** ใช้กับ Validation
>
> 4. **เลข ID เริ่มที่ 010101 / 030101 / 040101 / 050101 / 100101 / 200101** เว้นช่องว่างจากเลขที่สเปกถือไว้ (สูงสุดคือ `010050`) เพื่อให้สเปกขยายต่อในบล็อกเดิมได้โดยไม่ชนกัน
>
> 5. **Delivery Point ต่างจาก config module ตัวอื่นตรงไหน** (ยืนยันจากโค้ดของโมดูลนี้เอง ไม่ได้ลอกจาก `083-shelf.md`):
>    - **ฟอร์มมีแค่ 2 ฟิลด์** — Name (บังคับ, `maxLength=100`, `z.string().trim().min(1)`) และ status switch ไม่มี `code`, ไม่มี `description`, ไม่มี `order` (`components/share/delivery-point-dialog.tsx`) ต่างจาก shelf ที่มี code/description/order
>    - **ไม่มี `defaultSort`** — `delivery-point-component.tsx` ไม่ส่ง `defaultSort` ให้ `ConfigListTemplate` หน้าจึงเปิดมาโดยไม่มี `sort` ใน URL และการคลิกหัวคอลัมน์วนสามจังหวะ asc → desc → **ล้างการเรียง** (`data-grid-column-header.tsx:68-76` + `use-data-grid-state.ts:71-91` สาขา `else setSort("")`) ต่างจาก shelf ที่ `code:asc` เป็นค่าเริ่มต้นและคลิกได้แค่สลับสองทิศ
>    - **`initialState.columnVisibility` ซ่อน `created_at` / `updated_at` ไว้ตั้งแต่ต้น** (`use-delivery-point-table.tsx:60-62`)
>    - **มีเมนู Activity ต่อแถว** — ส่ง `activity: { id, label }` เข้า `useConfigTable` (ตรงข้ามกับ certification/eco/equipment ที่จงใจไม่เปิด เพราะ backend ไม่ได้บันทึกกิจกรรมให้)
>    - **ไม่มี `licenseFeature`** — `constant/module-list.ts:493-498` ให้เฉพาะ `permission: PERMISSIONS.configuration.delivery_point.view` ไม่มีบรรทัด `licenseFeature` (ต่างจาก `unit` ที่มี `licenseFeature: "configuration.unit"`) ดังนั้น **ด่านเดียวของหน้านี้คือ RBAC ไม่มีเคส "feature ไม่อยู่ในสัญญา"**
>    - **Permission prefix ถูกระบุตรง ๆ** เป็น `configuration.delivery_point` ไม่ได้ derive จาก route
>    - **ตัวกรองมีชุดเดียว** — `DELIVERY_POINT_FILTER_FIELDS` มีแค่ field `filter` control `status` (Active / Inactive) เข้ารหัสเป็น `is_active|bool:true` / `is_active|bool:false`
>    - **Export มี 2 คอลัมน์** — Name และ Status เท่านั้น (`delivery-point-component.tsx:27-34`)
>    - **เมนู Row actions ไม่มี Edit** — `actionColumn` ได้รับแค่ `onDelete` ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction` = `<button>` สีฟ้า ขีดเส้นใต้ตอน hover) เท่านั้น
>
> 6. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DP-010101 | หน้า list แสดงหัวเรื่อง คอลัมน์มาตรฐาน และปุ่มบนแถบเครื่องมือครบ | High | Smoke |
| TC-DP-010102 | ค้นหายิงเมื่อกด Enter เท่านั้น และไหลลง query string | Medium | Functional |
| TC-DP-010103 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-DP-010104 | กรองตามสถานะจากเมนู Filter บน desktop | Medium | Functional |
| TC-DP-010105 | ล้างตัวกรองจากแถบ chip ทั้งแบบทีละตัวและทั้งชุด | Low | Functional |
| TC-DP-010106 | เมนูเรียงลำดับบนแถบเครื่องมือ — รายการคอลัมน์ สลับทิศ และ Default | Medium | Functional |
| TC-DP-010107 | คลิกหัวคอลัมน์ Name ครั้งที่สามแล้วล้างการเรียง | Medium | Functional |
| TC-DP-010108 | สลับมุมมองตาราง / การ์ด และเนื้อหาบนการ์ด | Medium | Functional |
| TC-DP-010109 | มุมมองการ์ดไม่มีเมนูคอลัมน์และไม่มีแถบ pagination | Low | Functional |
| TC-DP-010110 | คอลัมน์ Created / Updated ถูกซ่อนไว้ตั้งแต่ต้นและเปิดได้จากเมนูคอลัมน์ | Medium | Functional |
| TC-DP-010111 | ส่งออกรายการจุดส่งของเป็นไฟล์ XLSX | Medium | Functional |
| TC-DP-010112 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-DP-010113 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-DP-010114 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-DP-010115 | เปิดแผง Activity ของจุดส่งของจากเมนู Row actions | Medium | Functional |
| TC-DP-010116 | เลือกแถวด้วย checkbox และเลือกทั้งหน้า | Low | Functional |
| TC-DP-010117 | ปุ่มไปหน้าแรก / หน้าสุดท้าย และข้อความจำนวนรายการ | Medium | Functional |
| TC-DP-030101 | หัวข้อ ไอคอน ปุ่ม และ placeholder ของ dialog ตอนกด Add | Low | Functional |
| TC-DP-030102 | ปิด dialog สร้างด้วยปุ่ม Escape แล้วไม่บันทึก | Low | Alternate Flow |
| TC-DP-030103 | ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และปิด dialog ไม่ได้ | Low | Functional |
| TC-DP-040101 | หัวข้อและปุ่มของ dialog ตอนแก้ไขต่างจากตอนสร้าง | Low | Functional |
| TC-DP-040102 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-DP-040103 | แก้ไขแล้วคอลัมน์ Updated สะท้อนเวลาและผู้แก้ไขล่าสุด | Medium | CRUD |
| TC-DP-050101 | กล่องยืนยันลบแสดงหัวข้อและชื่อจุดส่งของที่จะลบ | Medium | Functional |
| TC-DP-050102 | ลบจุดส่งของจากปุ่มถังขยะบนการ์ด | Low | CRUD |
| TC-DP-100101 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งกล่องแจ้งสิทธิ์ | High | Authorization |
| TC-DP-100102 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-DP-100103 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งกล่องแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-DP-100104 | ไม่มีสิทธิ์ดู — เมนูใน sidebar ถูกกั้น และเปิด URL ตรงก็ถูกบล็อก | High | Authorization |
| TC-DP-200101 | ชื่อที่มีช่องว่างนำหน้า/ต่อท้ายถูกตัดก่อนบันทึก | Medium | Validation |

---
## TC-DP-010101 — หน้า list แสดงหัวเรื่อง คอลัมน์มาตรฐาน และปุ่มบนแถบเครื่องมือครบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีจุดส่งของอย่างน้อย 1 รายการใน BU; ดูบนความกว้างระดับ desktop (ไม่ใช่ mobile breakpoint)
**Steps**
1. ไปที่ `/config/delivery-point`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. ไล่ดูหัวหน้า แถบเครื่องมือ และหัวคอลัมน์ของตาราง
**Expected**
หัวหน้าแสดงชื่อ "Delivery Point" พร้อมคำอธิบาย "Where vendors drop the goods off — loading dock, back door, kitchen entrance."; แถบปุ่มมุมขวาบนมี "Export", "Print" และ "Add Delivery Point"; แถบเครื่องมือมีช่องค้นหา (placeholder "Search..."), ปุ่ม saved view ที่แสดง "No view", ปุ่ม "Filter", ปุ่มเรียงลำดับ (aria-label "Sort by"), ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และกลุ่มปุ่มสลับมุมมอง "List view" / "Grid view"; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Name, Status และคอลัมน์ปุ่มจัดการท้ายแถว โดย **ไม่เห็นคอลัมน์ Created / Updated**

---
## TC-DP-010102 — ค้นหายิงเมื่อกด Enter เท่านั้น และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; มีจุดส่งของหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับจุดส่งของที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL และตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-DP-010103 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนและ aria-label ของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาทที่มี aria-label "Clear search" (แทนไอคอนแว่นขยาย aria-label "Search..."); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-DP-010104 — กรองตามสถานะจากเมนู Filter บน desktop
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; มีจุดส่งของทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม "Filter" บนแถบเครื่องมือ
2. ในเมนูที่เปิดขึ้น คลิกแถว "Status" เพื่อกาง submenu ชั้นสอง
3. เลือก "Active"
4. สังเกตปุ่ม Filter, แถบใต้แถบเครื่องมือ, ตาราง และ query string
**Expected**
เมนูเป็น popover ที่มีแถว "Status" พร้อมลูกศรชี้ขวา (ไม่ใช่รายการตัวเลือกแบน ๆ); เลือก "Active" แล้ว**มีผลทันทีโดยไม่ต้องกดยืนยัน**; ตารางเหลือเฉพาะแถวที่คอลัมน์ Status เป็นป้าย "Active"; ปุ่ม Filter มี badge เลข 1; แถบ "Filters:" ใต้แถบเครื่องมือแสดง chip ของสถานะ; query string มี `filter=is_active|bool:true`

---
## TC-DP-010105 — ล้างตัวกรองจากแถบ chip ทั้งแบบทีละตัวและทั้งชุด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบ "Filters:"
**Steps**
1. คลิกปุ่มกากบาทบน chip ของสถานะ
2. ตั้งตัวกรองสถานะขึ้นมาใหม่อีกครั้ง
3. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
ทั้งสองทางให้ผลเหมือนกัน: chip หายไป แถบ "Filters:" ไม่แสดงอีก, badge บนปุ่ม Filter หายไป, พารามิเตอร์ `filter` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมด

---
## TC-DP-010106 — เมนูเรียงลำดับบนแถบเครื่องมือ — รายการคอลัมน์ สลับทิศ และ Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยเพิ่งเปิดหน้ามาสด ๆ (URL ไม่มีพารามิเตอร์ `sort`); มีจุดส่งของอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. คลิกปุ่มเรียงลำดับ (aria-label "Sort by") บนแถบเครื่องมือ
2. อ่านรายการในเมนู
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
เมนูมีหัวข้อ "Sort by", แถว "Default" (มีเครื่องหมายกำกับอยู่เพราะ URL ยังไม่มี `sort`) แล้วตามด้วยรายชื่อคอลัมน์ที่เรียงได้ ได้แก่ Name, is_active, Created, Updated; เลือก "Name" ครั้งแรก → `sort=name:asc` ใน URL และมีลูกศรชี้ขึ้นที่แถวนั้น; เลือกซ้ำ → `sort=name:desc` และลูกศรพลิกลง; เมนูเปิดค้างไว้ตลอดสามจังหวะ; เลือก "Default" → พารามิเตอร์ `sort` และ `page` หายจาก URL และปุ่มบนแถบเครื่องมือกลับเป็นสีปกติ

---
## TC-DP-010107 — คลิกหัวคอลัมน์ Name ครั้งที่สามแล้วล้างการเรียง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดย URL ยังไม่มีพารามิเตอร์ `sort` (โมดูลนี้ไม่มี default sort)
**Steps**
1. คลิกปุ่มหัวคอลัมน์ "Name"
2. คลิกซ้ำครั้งที่สอง
3. คลิกซ้ำครั้งที่สาม
**Expected**
ครั้งแรก `sort=name:asc` และไอคอนหัวคอลัมน์เป็นลูกศรขึ้น; ครั้งที่สอง `sort=name:desc` และไอคอนเป็นลูกศรลง; **ครั้งที่สามล้างการเรียง** — พารามิเตอร์ `sort` หายจาก URL ไอคอนกลับเป็นลูกศรสองทิศ และตารางกลับไปเรียงตามลำดับเริ่มต้นของ backend

---
## TC-DP-010108 — สลับมุมมองตาราง / การ์ด และเนื้อหาบนการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; มีจุดส่งของอย่างน้อย 1 รายการที่มีข้อมูล audit ครบ (ผู้สร้าง/เวลาสร้าง/เวลาแก้ล่าสุด)
**Steps**
1. จดชื่อและสถานะของรายการแรกในตาราง
2. คลิกปุ่ม "Grid view" ที่มุมขวาของแถบเครื่องมือ
3. อ่านการ์ดใบแรก
4. คลิกปุ่ม "List view" เพื่อกลับ
**Expected**
ปุ่มสลับมุมมองมี aria-label "List view" และ "Grid view" (ไม่ใช่ "card view" / "table view"); กด "Grid view" แล้วตารางหายไปและแสดงเป็นกริดการ์ด; การ์ดใบแรกมีชื่อจุดส่งของเป็นหัวการ์ด และมีแถว Status ตรงกับที่จดไว้ ตามด้วยแถว Created / By / Updated และปุ่มถังขยะที่ท้ายการ์ด; กด "List view" แล้วกลับมาเป็นตารางที่แสดงข้อมูลชุดเดิม

---
## TC-DP-010109 — มุมมองการ์ดไม่มีเมนูคอลัมน์และไม่มีแถบ pagination
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; มีจุดส่งของมากกว่า 1 หน้า (เกิน 10 รายการ)
**Steps**
1. สังเกตว่าในมุมมองตารางมีปุ่มเมนูคอลัมน์และแถบ pagination อยู่
2. คลิกปุ่ม "Grid view"
3. สังเกตแถบเครื่องมือและท้ายรายการ
4. เลื่อนหน้าลงจนสุดรายการการ์ด
**Expected**
ในมุมมองการ์ด ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") **หายไป** และไม่มีแถบ pagination (ไม่มีข้อความ "Showing … of …" และไม่มีปุ่มข้ามหน้า); เลื่อนลงจนสุดแล้วมีการโหลดรายการชุดถัดไปต่อท้ายเอง (infinite scroll) พร้อม spinner ระหว่างโหลด

---
## TC-DP-010110 — คอลัมน์ Created / Updated ถูกซ่อนไว้ตั้งแต่ต้นและเปิดได้จากเมนูคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยเพิ่งเปิดหน้ามาสด ๆ (ยังไม่เคยแตะเมนูคอลัมน์ในรอบนี้)
**Steps**
1. อ่านหัวคอลัมน์ของตาราง
2. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
3. อ่านรายการและสถานะติ๊กถูกในเมนู
4. ติ๊ก "Created" และ "Updated"
**Expected**
ตอนเปิดหน้าไม่มีคอลัมน์ Created / Updated ในตาราง; เมนูมีหัวข้อ "Toggle Columns" และรายการ Name, is_active, Created, Updated โดย **Name และ is_active ติ๊กอยู่ ส่วน Created และ Updated ไม่ติ๊ก**; ติ๊กแล้วทั้งสองคอลัมน์โผล่ในตารางทันทีพร้อมค่าวันเวลา และเมนูยังเปิดค้างอยู่ให้ติ๊กต่อได้

---
## TC-DP-010111 — ส่งออกรายการจุดส่งของเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; ตารางมีข้อมูลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่ม "Export" ที่มุมขวาบน
2. รอให้ดาวน์โหลดเสร็จ
3. เปิดไฟล์ที่ได้
**Expected**
ระหว่างทำงานปุ่มเปลี่ยนข้อความเป็น "Exporting..." และกดซ้ำไม่ได้; ได้ไฟล์ `.xlsx` ที่ชื่อขึ้นต้นด้วย `deliveryPoint`; ชีทในไฟล์ชื่อ "Delivery Point" และมี **เฉพาะสองคอลัมน์** คือ Name และ Status (ค่าเป็น "Active" / "Inactive") ตามจำนวนแถวที่กำลังแสดงอยู่ในหน้า; มี toast "Exported {จำนวน} records"

---
## TC-DP-010112 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` และค้นหาด้วยคำที่ไม่มีผลลัพธ์จนตารางว่าง (แสดง "No data found")
**Steps**
1. คลิกปุ่ม "Export"
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ยังกดได้ตามปกติ (ไม่ค้างอยู่ในสถานะ "Exporting...")

---
## TC-DP-010113 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; ผู้ใช้เป็น admin ของ BU (จึงเห็นตัวเลือกขอบเขต "Everyone in this business unit")
**Steps**
1. ตั้งตัวกรองสถานะเป็น "Inactive" และเรียงลำดับตาม Name
2. คลิกปุ่ม saved view ที่แสดง "No view"
3. เลือก "Save current filters as view"
4. ตั้งชื่อ view แล้วเลือกขอบเขต "Only me" และกดบันทึก
5. ล้างตัวกรองทั้งหมด แล้วเปิดเมนู saved view อีกครั้งและเลือก view ที่เพิ่งบันทึก
**Expected**
กล่อง "Save view" ขอชื่อและขอบเขต ("Only me" / "Everyone in this business unit"); บันทึกแล้วมี toast ยืนยันและปุ่ม saved view เปลี่ยนไปแสดงชื่อ view นั้น; หลังล้างตัวกรอง ปุ่มกลับเป็น "No view"; เลือก view เดิมแล้วตัวกรองสถานะ Inactive และการเรียงตาม Name กลับมาครบ พร้อม `sv=<id>` ใน query string; แก้ตัวกรองต่อจากนั้นทำให้ชื่อ view ต่อท้ายด้วย "(modified)"

---
## TC-DP-010114 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยมีจุดส่งของอย่างน้อย 1 แถว; ผู้ใช้มีสิทธิ์ครบและสัญญายังไม่หมดอายุ
**Steps**
1. คลิกปุ่ม "Row actions" ท้ายแถวแรก
2. อ่านรายการในเมนู
3. กด Escape เพื่อปิดเมนู แล้วสังเกตคอลัมน์ Name ของแถวเดิม
**Expected**
เมนูมีเพียงสองรายการคือ "Activity" และ "Delete" (Delete เป็นสีแดง) — **ไม่มีรายการ "Edit"**; ทางเข้าแก้ไขคือชื่อในคอลัมน์ Name ซึ่ง render เป็นปุ่มสีหลักที่ขีดเส้นใต้เมื่อ hover (ไม่ใช่ลิงก์ `<a href>`)

---
## TC-DP-010115 — เปิดแผง Activity ของจุดส่งของจากเมนู Row actions
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; เลือกแถวของจุดส่งของที่เพิ่งถูกสร้างหรือแก้ไขในรอบทดสอบนี้
**Steps**
1. คลิกปุ่ม "Row actions" ของแถวนั้น
2. เลือก "Activity"
3. อ่านหัวข้อและเนื้อหาในแผงที่เปิดขึ้น
4. ปิดแผง
**Expected**
เมนูปิดลงก่อนแล้วแผงด้านข้างจึงเปิด (ไม่มีอาการ focus กระตุก); แผงมีหัวข้อ "Activity" พร้อมคำอธิบาย "Everything done to this record, newest first" และชื่อจุดส่งของกำกับ; รายการกิจกรรมเรียงใหม่สุดขึ้นก่อน หรือแสดง "No activity recorded yet" เมื่อยังไม่มีข้อมูล; ปิดแผงแล้วกลับมาที่ตารางโดยตารางไม่ถูกรีเฟรชซ้ำ

---
## TC-DP-010116 — เลือกแถวด้วย checkbox และเลือกทั้งหน้า
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` โดยมีจุดส่งของอย่างน้อย 2 แถวในหน้าปัจจุบัน
**Steps**
1. คลิก checkbox ของแถวแรก (aria-label "Select row")
2. คลิก checkbox บนหัวตาราง (aria-label "Select all")
3. คลิก checkbox บนหัวตารางซ้ำอีกครั้ง
**Expected**
คลิกแถวแรกแล้ว checkbox นั้นถูกติ๊กและแถวถูกทำเครื่องหมายว่าเลือกอยู่; คลิก "Select all" แล้วทุกแถวในหน้าถูกติ๊ก; คลิกซ้ำแล้วทุกแถวถูกยกเลิกการเลือก; ตามการออกแบบปัจจุบัน **การเลือกแถวไม่ทำให้มีแถบ bulk action โผล่ขึ้นมา** — ช่องเลือกเป็นส่วนมาตรฐานของ DataGrid

---
## TC-DP-010117 — ปุ่มไปหน้าแรก / หน้าสุดท้าย และข้อความจำนวนรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; มีจุดส่งของมากกว่า 1 หน้าที่ 10 แถวต่อหน้า
**Steps**
1. อ่านข้อความด้านซ้ายของแถบ pagination
2. คลิกปุ่ม "Go to last page"
3. คลิกปุ่ม "Go to first page"
**Expected**
ข้อความแสดงเป็น "Showing 1–10 of {จำนวนทั้งหมด}" และอัปเดตตามหน้าที่เปิดอยู่; ที่หน้าแรก ปุ่ม "Go to first page" และ "Go to previous page" ถูก disable; กด "Go to last page" แล้วไปหน้าสุดท้ายในคลิกเดียวและปุ่ม "Go to next page" / "Go to last page" ถูก disable แทน; `page` ใน URL เปลี่ยนตามทุกครั้ง

---
## TC-DP-030101 — หัวข้อ ไอคอน ปุ่ม และ placeholder ของ dialog ตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; ผู้ใช้มีสิทธิ์สร้าง
**Steps**
1. คลิกปุ่ม "Add Delivery Point"
2. อ่านหัวข้อ ไอคอน ปุ่มท้ายกล่อง และ placeholder ของช่อง Name
**Expected**
กล่องมีหัวข้อ "Add Delivery Point" พร้อมไอคอนหมุดปักแผนที่; ช่อง Name มีป้ายกำกับ "Name" ที่ทำเครื่องหมายว่าบังคับกรอก และ placeholder "e.g. Main entrance, Loading dock"; ปุ่มท้ายกล่องคือ "Cancel" และ "Create"; **ไม่มีปุ่มกากบาทปิดที่มุมกล่อง**

---
## TC-DP-030102 — ปิด dialog สร้างด้วยปุ่ม Escape แล้วไม่บันทึก
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; ผู้ใช้มีสิทธิ์สร้าง
**Steps**
1. คลิก "Add Delivery Point"
2. กรอกชื่อที่ไม่ซ้ำกับของเดิม
3. กดปุ่ม Escape
4. ค้นหาชื่อนั้นในตาราง
5. เปิดกล่องสร้างขึ้นมาใหม่อีกครั้ง
**Expected**
กล่องปิดลงทันทีเมื่อกด Escape (ไม่มีการถามยืนยันทิ้งการแก้ไข); ค้นหาแล้วไม่พบรายการนั้น ตารางแสดง "No data found"; เปิดกล่องใหม่แล้วช่อง Name ว่างและสวิตช์สถานะกลับเป็นเปิดใช้งาน

---
## TC-DP-030103 — ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และปิด dialog ไม่ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; ผู้ใช้มีสิทธิ์สร้าง; สามารถหน่วงการตอบกลับของ API สร้างจุดส่งของได้ (throttle หรือ network condition) เพื่อให้สังเกตสถานะระหว่างบันทึกทัน
**Steps**
1. คลิก "Add Delivery Point" แล้วกรอกชื่อที่ไม่ซ้ำ
2. กด "Create" แล้วสังเกตปุ่มทั้งสองระหว่างที่คำขอยังไม่ตอบกลับ
3. ลองกด Escape ระหว่างนั้น
4. รอจนคำขอเสร็จ
**Expected**
ระหว่างบันทึก ปุ่มส่งเปลี่ยนข้อความเป็น "Creating..." และถูก disable, ปุ่ม "Cancel" ก็ถูก disable, และกด Escape แล้วกล่องไม่ปิด; เมื่อคำขอสำเร็จ กล่องปิดเอง และมี toast "Delivery Point created successfully"

---
## TC-DP-040101 — หัวข้อและปุ่มของ dialog ตอนแก้ไขต่างจากตอนสร้าง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` และมีจุดส่งของอย่างน้อย 1 รายการ; ผู้ใช้มีสิทธิ์แก้ไข
**Steps**
1. คลิกชื่อจุดส่งของในคอลัมน์ Name
2. อ่านหัวข้อและปุ่มท้ายกล่อง
**Expected**
กล่องมีหัวข้อ "Edit Delivery Point" (ไม่ใช่ "Add Delivery Point"); ปุ่มท้ายกล่องคือ "Cancel" และ **"Save"** (ไม่ใช่ "Create"); ระหว่างบันทึกปุ่มจะเปลี่ยนเป็น "Saving..."

---
## TC-DP-040102 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; มีจุดส่งของอย่างน้อย 1 รายการ; ผู้ใช้มีสิทธิ์แก้ไข
**Steps**
1. คลิกปุ่ม "Grid view"
2. คลิกหัวการ์ดของรายการแรก
3. แก้ไขชื่อแล้วกด "Save"
4. สังเกตกริดการ์ดหลังบันทึก
**Expected**
คลิกหัวการ์ดแล้วเปิดกล่อง "Edit Delivery Point" ตัวเดียวกับที่เปิดจากตาราง โดยช่อง Name เติมชื่อเดิมไว้; บันทึกแล้วมี toast "Delivery Point updated successfully" กล่องปิดเอง และการ์ดใบนั้นแสดงชื่อใหม่โดยยังอยู่ในมุมมองการ์ด

---
## TC-DP-040103 — แก้ไขแล้วคอลัมน์ Updated สะท้อนเวลาและผู้แก้ไขล่าสุด
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; มีจุดส่งของที่ถูกสร้างไว้ก่อนหน้าแล้วอย่างน้อย 1 รายการ; เปิดคอลัมน์ Created และ Updated ไว้จากเมนูคอลัมน์แล้ว
**Steps**
1. จดค่าในคอลัมน์ Created และ Updated ของแถวเป้าหมาย
2. คลิกชื่อในคอลัมน์ Name แก้ชื่อแล้วกด "Save"
3. รอให้ตารางโหลดใหม่แล้วอ่านสองคอลัมน์เดิมอีกครั้ง
**Expected**
คอลัมน์ Updated แสดงเวลาที่ใหม่กว่าเดิม (ตามรูปแบบวันเวลาของ BU) และระบุผู้แก้ไขเป็นผู้ใช้ที่กำลังทดสอบ; คอลัมน์ Created **ไม่เปลี่ยน**

---
## TC-DP-050101 — กล่องยืนยันลบแสดงหัวข้อและชื่อจุดส่งของที่จะลบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; มีจุดส่งของที่รู้ชื่อแน่นอนอยู่ในตาราง; ผู้ใช้มีสิทธิ์ลบ
**Steps**
1. คลิกปุ่ม "Row actions" ของแถวนั้น แล้วเลือก "Delete"
2. อ่านหัวข้อและคำอธิบายในกล่องยืนยัน
**Expected**
กล่องยืนยันมีหัวข้อ "Delete Delivery Point" และคำอธิบาย `Are you sure you want to delete delivery point "<ชื่อจริงของแถวนั้น>"? This action cannot be undone.` โดยชื่อในข้อความตรงกับแถวที่เลือก; มีปุ่ม "Cancel" และปุ่มลบ

---
## TC-DP-050102 — ลบจุดส่งของจากปุ่มถังขยะบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/config/delivery-point` บนความกว้างระดับ desktop; มีจุดส่งของที่สร้างไว้สำหรับทิ้งโดยเฉพาะ; ผู้ใช้มีสิทธิ์ลบและสัญญายังไม่หมดอายุ
**Steps**
1. คลิกปุ่ม "Grid view"
2. หาการ์ดของรายการเป้าหมาย แล้วคลิกปุ่มถังขยะที่ท้ายการ์ด
3. ยืนยันในกล่องที่เปิดขึ้น
**Expected**
กล่องยืนยันเป็นใบเดียวกับที่เปิดจากตาราง (หัวข้อ "Delete Delivery Point" พร้อมชื่อรายการ); ยืนยันแล้วมี toast "Delivery Point deleted successfully" และการ์ดใบนั้นหายจากกริดโดยไม่ต้องรีโหลดหน้า

---
## TC-DP-100101 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งกล่องแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยผู้ใช้ที่มีสิทธิ์ `configuration.delivery_point.view` แต่**ไม่มี** `configuration.delivery_point.create` และ `system_level` ของ BU ไม่ใช่ `admin`; active BU = BLAVG
**Steps**
1. ไปที่ `/config/delivery-point`
2. สังเกตปุ่ม "Add Delivery Point"
3. คลิกปุ่มนั้น
**Expected**
หน้ารายการเปิดได้และอ่านข้อมูลได้ตามปกติ; ปุ่ม "Add Delivery Point" แสดงแบบจาง (opacity ลดลง) และมี `aria-disabled`; คลิกแล้ว**ไม่มี dialog สร้าง** แต่เด้งกล่อง "Permission Denied" พร้อมข้อความ "You don't have permission to perform this action." และบรรทัด "Contact your administrator to request access."

---
## TC-DP-100102 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยผู้ใช้ที่มีสิทธิ์ `configuration.delivery_point.view` แต่**ไม่มี** `configuration.delivery_point.update` และไม่ใช่ admin ของ BU; มีจุดส่งของอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/delivery-point`
2. คลิกชื่อจุดส่งของในคอลัมน์ Name
3. ลองพิมพ์ในช่อง Name และลองสลับสวิตช์สถานะ
**Expected**
กล่อง "Edit Delivery Point" เปิดขึ้นและแสดงค่าปัจจุบัน; ช่อง Name และสวิตช์สถานะถูก disable แก้ไม่ได้; **ไม่มีปุ่มบันทึก** และปุ่มเดียวที่เหลือมีข้อความ "Close" (ไม่ใช่ "Cancel")

---
## TC-DP-100103 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งกล่องแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยผู้ใช้ที่มีสิทธิ์ `configuration.delivery_point.view` แต่**ไม่มี** `configuration.delivery_point.delete` และไม่ใช่ admin ของ BU; มีจุดส่งของอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/delivery-point`
2. คลิกปุ่ม "Row actions" ของแถวแรก
3. คลิก "Delete"
4. สลับไปมุมมองการ์ดแล้วกดปุ่มถังขยะบนการ์ดใบเดียวกัน
**Expected**
รายการ "Delete" ในเมนูแสดงแบบจางและมี `aria-disabled`; คลิกแล้ว**ไม่มีกล่องยืนยันลบ** แต่เด้งกล่อง "Permission Denied" แทน; ปุ่มถังขยะบนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดคุมสิทธิ์ชุดเดียวกัน)

---
## TC-DP-100104 — ไม่มีสิทธิ์ดู — เมนูใน sidebar ถูกกั้น และเปิด URL ตรงก็ถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยผู้ใช้ที่**ไม่มี**สิทธิ์ `configuration.delivery_point.view` และไม่ใช่ admin ของ BU; active BU = BLAVG
**Steps**
1. เปิดโมดูล Configuration แล้วมองหาเมนู "Delivery Point" ใน sidebar
2. คลิกเมนูนั้น
3. พิมพ์ `/config/delivery-point` ลง address bar ตรง ๆ
**Expected**
เมนูยังแสดงอยู่แต่เป็นปุ่มจาง (opacity 50%) ที่ไม่ใช่ลิงก์ และ**ไม่มีไอคอนกุญแจ** (โมดูลนี้ไม่มี `licenseFeature` จึงล็อกด้วยสิทธิ์อย่างเดียว); คลิกแล้วเด้งกล่อง "Permission Denied" โดยไม่เปลี่ยนหน้า; เปิด URL ตรงแล้ว `RouteGuard` แสดงหน้าปฏิเสธการเข้าถึง (eyebrow "Restricted") พร้อมปุ่มทางออกไปหน้าที่เข้าถึงได้ แทนที่จะเห็นรายการจุดส่งของ

---
## TC-DP-200101 — ชื่อที่มีช่องว่างนำหน้า/ต่อท้ายถูกตัดก่อนบันทึก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้า `/config/delivery-point`; ผู้ใช้มีสิทธิ์สร้าง; เตรียมชื่อที่ไม่ซ้ำกับของเดิมไว้ 1 ชื่อ
**Steps**
1. คลิก "Add Delivery Point"
2. กรอกชื่อโดย**ใส่ช่องว่างนำหน้าและต่อท้าย** เช่น `␣␣Loading dock 7␣␣`
3. กด "Create"
4. ค้นหาชื่อนั้น (แบบไม่มีช่องว่าง) ในตาราง แล้วเปิดกล่องแก้ไขของแถวที่ได้
**Expected**
บันทึกสำเร็จพร้อม toast "Delivery Point created successfully"; ตารางแสดงชื่อที่**ถูกตัดช่องว่างหัวท้ายออกแล้ว**; เปิดกล่องแก้ไขแล้วช่อง Name มีค่าที่ตัดช่องว่างแล้วเช่นกัน (schema ใช้ `z.string().trim()` ก่อนตรวจความยาว)
