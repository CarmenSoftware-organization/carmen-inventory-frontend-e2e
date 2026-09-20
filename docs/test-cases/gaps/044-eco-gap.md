# Eco Certification — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/044-eco.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/044-eco.md`_

**Module:** Product Management — Eco Certification (ใบรับรองสิ่งแวดล้อม / eco label)
**Frontend route:** `routes/product-management/eco`  •  **URL:** `/product-management/eco`
**Prefix:** `ECO`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/044-eco.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 29

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/044-eco.spec.ts` ถือ ID `TC-ECO-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-ECO-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, สร้างด้วย code+name แล้วแถวโผล่ในตาราง, แก้ name + toast, แก้ name แล้ว persist, toggle `is_active` แล้ว persist, ยกเลิกการแก้ไขแล้วค่าไม่ถูกบันทึก, ลบ, ยกเลิกการลบ, บันทึกโดยไม่กรอก code/name → error, ล้าง name ตอนแก้ไข → error, สร้าง code ซ้ำถูก reject, XSS payload ในชื่อ, SQL payload ในช่องค้นหา และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **`TC-ECO-100004` เป็น `test.skip`** — สเปกส่ง `skipAuth: true` ให้ helper แปลว่าเคส authorization ของ user สิทธิ์ต่ำ **ไม่เคยรันจริง** เอกสารนี้จึงเขียนเคส authorization ชุดใหม่ที่ `100005..100008` โดยไม่แตะ ID เดิม
> 3. **Section 02/30/90 ใช้ไม่ได้กับ prefix `ECO`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `044-eco.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30), เคส edge (ปกติอยู่บล็อก 90) และเคสมุมมอง/ดูรายละเอียด (ปกติอยู่บล็อก 02) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งหมดเป็นพฤติกรรมของแถบเครื่องมือ/ตารางหน้า list — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `02`/`30`/`90` ลงในแถวของ `044-eco.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 4. **⚠️ payload ที่ endpoint ต้องการยังเป็นแบบห่อ `metadata` จริง — ยืนยันแล้วในโค้ดปัจจุบัน** `eco-dialog.tsx` (`toPayload`) สร้าง body เป็น `{ code, name, description, is_active, metadata: { code, name, description, is_active, doc_version } }` โดยคอมเมนต์ในไฟล์ระบุชัดว่า backend อ่าน `doc_version` **จากใน `metadata`** — ละไว้ตอน PATCH แล้วได้ `400 "doc_version: Required"` ทาง `ConfigEntityDialog.onSubmit` ยังแนบ `doc_version` ระดับบนสุดมาด้วยอีกชั้น (`{ id, doc_version, ...payload }`) แล้ว `createConfigCrud.useUpdate` ตัดเฉพาะ `id` ทิ้ง — body จริงจึงมี `doc_version` **สองที่** endpoint คือ `PATCH /api/proxy/api/config/{bu}/product-master-eco-labels/{id}` (create ใช้ `POST` ที่ path เดียวกัน, `doc_version` เป็น `undefined`) **ผลต่อการเขียนสเปก:** เทสที่ดักหรือ assert request body ต้องอ่านค่าจาก `metadata` ไม่ใช่ระดับบนสุด และเทสแก้ไขต้องเปิด dialog จากแถวจริงเสมอ (ค่า `doc_version` มาจาก entity ในแถว — ยิง PATCH เองโดยไม่มีมันจะ 400)
> 5. **⚠️ Blocker — การลบกระทบสินค้าที่อ้างอยู่** แท็บ Eco Labels ในหน้า product (`routes/product-management/product/pd-tab-eco.tsx`) เก็บเฉพาะ `master_eco_label_id` แล้ว resolve ชื่อฝั่ง client ด้วย `masterMap.get(...)?.name ?? row.original.master_eco_label_id` — ถ้า master record ถูกลบ ช่อง Eco Label ของสินค้านั้นจะ **แสดง UUID ดิบแทนชื่อ** และ frontend ไม่มี guard ใด ๆ กันการลบ record ที่ถูกอ้างอยู่ (ไม่เช็คก่อนลบ ไม่มีข้อความเตือน) ยังไม่ยืนยันว่า backend reject หรือไม่ **เอกสารนี้จึงไม่เขียนเคสลบ record ที่ถูกสินค้าอ้างอยู่** เพราะผลลัพธ์ที่ถูกต้องยังไม่ถูกตัดสิน — ต้องให้ทีมสรุป contract ก่อน (reject 409 / soft-delete / cascade) เคสลบทั้งหมดในเอกสารนี้จึงใช้ record ที่สร้างขึ้นเองและไม่มีสินค้าอ้าง
> 6. **prefix สิทธิ์ของโมดูลนี้เป็นระดับโมดูล ไม่ใช่ระดับ entity** — `constant/module-list.ts` ให้ leaf ของ eco มี `permission: PERMISSIONS.product_management.view` ดังนั้น `usePermissionPrefix()` คืน `"product_management"` และ gate ทั้งหมดใช้คีย์ `product_management.create` / `.update` / `.delete` (ไม่ใช่ `product_management.eco_label.*`) ซึ่งเป็นคีย์ชุดเดียวกับหน้าอื่นในโมดูล — เคส `TC-ECO-100005..100007` จึงต้องใช้บัญชีที่ขาดคีย์ระดับโมดูลนี้ และ **admin ของ BU bypass ทุก permission** (`hooks/use-can.ts`) จึงใช้ admin ทดสอบไม่ได้ · leaf ยังผูก `licenseFeature: "product_management.master_eco_label"` ไว้ด้วย
> 7. **ป้ายของช่อง code คือ "ISO" แต่ข้อความ error พูดว่า "Code"** — `eco-dialog.tsx` ใช้ `t("iso")` เป็น label/หัวคอลัมน์ ส่วน `eco-form-schema.ts` สร้างข้อความด้วย `tv("required", { field: tf("code") })` → ข้อความที่เห็นคือ "Code is required" ทั้งที่ label เขียนว่า "ISO" บันทึกไว้เป็นข้อเท็จจริง — `TC-ECO-200005` จึง assert แค่ว่ามี error ใต้ช่อง ISO และ dialog ยังเปิด ไม่ผูกกับตัวข้อความ
> 8. **ช่อง ISO (code) ไม่มี `maxLength`** — ต่างจาก `name` (100) และ `description` (256) ที่มี attribute กำกับ ฝั่ง schema ก็มีแค่ `min(1)` ไม่มีเพดานบน บันทึกไว้เป็นข้อเท็จจริง ไม่เขียนเป็นเทสเคส เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นช่องโหว่
> 9. **คอลัมน์สถานะไม่มี `meta.headerTitle`** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ไม่ตั้ง `headerTitle` ขณะที่เมนูเรียงลำดับและเมนูคอลัมน์ทั้งคู่ render `meta.headerTitle || column.id` ชื่อที่เห็นในเมนูจึงเป็น `is_active` ไม่ใช่ "Status" — `TC-ECO-010012` assert สิ่งที่ UI แสดงจริงตามโครงที่โค้ดเขียนไว้
> 10. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## สิ่งที่โมดูลนี้ต่างจาก `083-shelf.md` (ใช้เทียบเป็นเช็กลิสต์ แต่ไม่ลอก)

- **route คนละกลุ่ม** — eco อยู่ใต้ product-management (`/product-management/eco`) ไม่ใช่ `/config/*` sidebar ที่ต้องกดคือเมนูของโมดูล Product Management
- **ฟิลด์ code ชื่อ "ISO"** ไม่ใช่ "Code" และไม่มีฟิลด์ `order`/`ลำดับ` แบบ shelf — ฟอร์มมีแค่ ISO (บังคับ), Name (บังคับ, maxLength 100), Description (textarea, maxLength 256) และ status switch
- **ตารางไม่มีคอลัมน์ Description** — คอลัมน์คือ ISO, Name, Status + Created/Updated ที่ซ่อนไว้ ส่วน Description เห็นได้จาก dialog กับการ์ดเท่านั้น
- **เมนู Row actions มีรายการเดียวคือ Delete** — `use-eco-table.tsx` ส่งแค่ `onDelete` ให้ `useConfigTable` และ **ไม่ส่ง `activity`** (คอมเมนต์ใน `use-config-table.tsx` ระบุชื่อ eco ไว้ตรง ๆ ว่าไม่อยู่ใน activity-registry) เมนูจึงไม่มีทั้ง Edit และ Activity — ทางเข้าแก้ไขในตารางคือปุ่มลิงก์บนคอลัมน์ ISO (`CellAction`) เท่านั้น
- **การ์ดใช้ name เป็นหัวเรื่อง แต่ตารางใช้ code เป็นปุ่มเปิด** — `eco-card.tsx` ตั้ง `title={item.name}` แล้ววาง code เป็นแถวข้อมูลข้างใน สลับกับตาราง
- **default sort = `code:asc`** (ประกาศใน `eco-component.tsx`) ต่างจากหน้าที่ไม่มี default sort เลย
- **export มี 3 คอลัมน์** — ISO / Name / Status (ไม่มี Description)
- **สิทธิ์เป็นระดับโมดูล** (`product_management.*`) ไม่ใช่คีย์เฉพาะ entity แบบ `configuration.shelf.*` ของ shelf
- **backend มีจริงและใช้งานได้** ต่างจาก shelf ที่ยังไม่มี endpoint — แต่มีเงื่อนไข payload `metadata` ตามข้อ 4
- **มีโมดูลอื่นอ้างถึง** — สินค้าผูก eco label ผ่านแท็บ Eco Labels ซึ่ง shelf ไม่มี

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ECO-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-ECO-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-ECO-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-ECO-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-ECO-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-ECO-010011 | เรียงลำดับเริ่มต้นตาม ISO และสลับทิศจากเมนูเรียงลำดับ | Medium | Functional |
| TC-ECO-010012 | รายชื่อคอลัมน์ในเมนูเรียงลำดับและเมนูคอลัมน์ | Low | Functional |
| TC-ECO-010013 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-ECO-010014 | ซ่อน-แสดงคอลัมน์ Created / Updated ผ่านเมนูคอลัมน์ | Low | Functional |
| TC-ECO-010015 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-ECO-010016 | ส่งออกรายการเป็นไฟล์ XLSX สามคอลัมน์ | Medium | Functional |
| TC-ECO-010017 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-ECO-010018 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-ECO-010019 | เมนู Row actions ของแถวมีเฉพาะ Delete | Low | Functional |
| TC-ECO-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-ECO-030003 | สร้างพร้อมกรอก Description แล้วค่าคงอยู่ | Medium | Happy Path |
| TC-ECO-030004 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-ECO-030005 | ระหว่างบันทึก ปุ่มเปลี่ยนสถานะและ dialog ปิดไม่ได้ | Low | Functional |
| TC-ECO-040005 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-ECO-040006 | แก้ไขรหัส ISO แล้วค่าคงอยู่ทั้งตารางและ dialog | High | CRUD |
| TC-ECO-040007 | ปิดใช้งานแล้วหายจากตัวเลือกในแท็บ Eco Labels ของสินค้า | Medium | Functional |
| TC-ECO-050003 | ข้อความยืนยันลบอ้างชื่อ ไม่ใช่รหัส ISO | Medium | Functional |
| TC-ECO-050004 | ลบจากปุ่ม Delete บนการ์ด | Low | CRUD |
| TC-ECO-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-ECO-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-ECO-100007 | ไม่มีสิทธิ์ลบ — ทั้งเมนูแถวและปุ่มบนการ์ดเด้งแจ้งสิทธิ์ | Medium | Authorization |
| TC-ECO-100008 | ไม่มีสิทธิ์ดู — เมนู Eco ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-ECO-200004 | ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร | Medium | Validation |
| TC-ECO-200005 | แก้ไข: ล้างช่อง ISO แล้วบันทึกต้องแสดง error | Medium | Validation |

---
## TC-ECO-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี eco certification อย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/product-management/eco`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Eco Certification" พร้อมคำอธิบายใต้ชื่อ ("Green certifications a product can carry — organic, fair-trade, carbon-neutral."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), ISO, Name, Status และคอลัมน์ปุ่มจัดการท้ายแถว; **ไม่มีคอลัมน์ Description** และคอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; ค่าในคอลัมน์ ISO เป็นปุ่มลิงก์ (กดได้) ไม่ใช่ข้อความเปล่า; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Eco Certification"

---
## TC-ECO-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco`; มี eco certification หลายรายการที่รหัส/ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับรายการที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอน Enter หรือกดปุ่มท้ายช่อง); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-ECO-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search"); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-ECO-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco`; มี eco certification ทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
**Expected**
ตารางเหลือเฉพาะรายการที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือขึ้นต้นด้วยคำว่า "Filters:" และมี chip ของสถานะพร้อมปุ่มกากบาท (aria-label "Remove ... filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน (สองตัวเลือกนี้คือทั้งหมดที่ `ECO_FILTER_FIELDS` ประกาศไว้ — โมดูลนี้ไม่มีตัวกรองอื่น)

---
## TC-ECO-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-ECO-010011 — เรียงลำดับเริ่มต้นตาม ISO และสลับทิศจากเมนูเรียงลำดับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/product-management/eco` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มี eco certification อย่างน้อย 2 รายการที่รหัส ISO ต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูสถานะของแถว "Default"
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้มี **default sort = `code:asc`** (ประกาศใน `eco-component.tsx`) — เข้าครั้งแรก URL ไม่มี `sort` แต่แถวเรียงตามรหัส ISO จากน้อยไปมาก และแถว "Default" มีไอคอนกำกับอยู่; เลือก Name ครั้งแรกได้ `sort=name:asc` พร้อมลูกศรขึ้นบนแถวนั้น, เลือกซ้ำได้ `sort=name:desc` พร้อมลูกศรลง และลำดับแถวสลับตาม; เลือก Default ล้าง `sort` ออกจาก URL แล้วกลับไปเรียงตาม ISO; ปุ่มเรียงลำดับเปลี่ยนเป็นสีเน้น (`text-primary`) เฉพาะตอนมี `sort` ใน URL

---
## TC-ECO-010012 — รายชื่อคอลัมน์ในเมนูเรียงลำดับและเมนูคอลัมน์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` ในมุมมองตารางบน desktop
**Steps**
1. เปิดเมนูเรียงลำดับ (aria-label "Sort by") แล้วอ่านรายชื่อคอลัมน์
2. ปิดเมนู แล้วเปิดเมนูคอลัมน์ (aria-label "Toggle columns") แล้วอ่านรายชื่อ
**Expected**
ทั้งสองเมนูแสดงรายการชุดเดียวกัน 5 รายการ (เฉพาะคอลัมน์ที่มี accessor): **ISO**, **Name**, **is_active**, **Created**, **Updated** — คอลัมน์สถานะขึ้นเป็น `is_active` ตามชื่อ column id เพราะ `statusColumn()` ไม่ได้ตั้ง `meta.headerTitle` (เมนูทั้งคู่ render `meta.headerTitle || column.id`) ส่วนในเมนูคอลัมน์จะเห็นเป็น "Is_active" เพราะ item มี class `capitalize`; ช่องเลือก, คอลัมน์ลำดับที่ (#) และคอลัมน์ปุ่มจัดการไม่ปรากฏในทั้งสองเมนู

---
## TC-ECO-010013 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` บนหน้าจอขนาด desktop; มี eco certification อย่างน้อย 1 รายการที่กรอก Description ไว้
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; **หัวการ์ดคือ `name`** (ไม่ใช่รหัส ISO — สลับกับตารางที่ใช้ ISO เป็นปุ่มเปิด) และในเนื้อการ์ดเรียงเป็นแถว Status (ป้าย Active/Inactive), แถว Code (แสดงเฉพาะเมื่อมีค่า), แถว Description (แสดงเฉพาะเมื่อมีค่า) และแถวข้อมูล Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-ECO-010014 — ซ่อน-แสดงคอลัมน์ Created / Updated ผ่านเมนูคอลัมน์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` ในมุมมองตารางบน desktop; มีรายการอย่างน้อย 1 รายการที่เคยถูกสร้าง/แก้ไขจึงมีข้อมูล audit
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Name
**Expected**
หัวเมนูเขียนว่า "Toggle Columns"; Created และ Updated **ไม่ถูกติ๊กตั้งแต่ต้น** (ตรงกับ `initialState.columnVisibility` ของ `useEcoLabelTable`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลาและชื่อผู้ทำรายการ; ปิด Name แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้ (item ใช้ `onSelect` แบบ preventDefault)

---
## TC-ECO-010015 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` ในมุมมองตาราง; BU มี eco certification มากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความสรุปจำนวนแถวและค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป
4. คลิกปุ่มไปหน้าแรก
**Expected**
ค่าเริ่มต้นของ Rows คือ 10; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, คอลัมน์ลำดับที่ (#) เริ่มนับต่อจากหน้าก่อน (ไม่รีเซ็ตเป็น 1 — `indexColumn` บวก offset จาก page/perpage) และปุ่มย้อนกลับ/หน้าแรกใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-ECO-010016 — ส่งออกรายการเป็นไฟล์ XLSX สามคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/product-management/eco` บน desktop; มี eco certification อย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่มี **3 คอลัมน์** ตามลำดับ ISO / Name / Status (Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false) — **ไม่มีคอลัมน์ Description** ในไฟล์ที่ส่งออก; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-ECO-010017 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/product-management/eco` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-ECO-010018 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/product-management/eco` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่อง "View name" และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-ECO-010019 — เมนู Row actions ของแถวมีเฉพาะ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/product-management/eco` และมี eco certification อย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. ปิดเมนู แล้วคลิกค่าในคอลัมน์ ISO ของแถวเดียวกัน
**Expected**
เมนูมีรายการเดียวคือ **Delete** — ไม่มีรายการ Edit และ **ไม่มีรายการ Activity** (โมดูลนี้ไม่ได้ส่ง `activity` ให้ `useConfigTable`; คอมเมนต์ในไฟล์ระบุ eco ไว้ว่าไม่อยู่ใน activity-registry) และไม่มีเส้นคั่นเพราะมีกลุ่มเดียว; คลิกค่าในคอลัมน์ ISO แล้วเปิด dialog "Edit Eco Certification" ของแถวนั้น — ยืนยันว่านี่คือทางเข้าแก้ไขทางเดียวในมุมมองตาราง

---
## TC-ECO-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/product-management/eco`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Eco Certification"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Eco Certification" พร้อมไอคอนใบไม้ (Leaf) ทางซ้าย; ช่อง ISO (`#eco-label-code`) ว่างและมี placeholder "e.g. ORG, FT, CN" พร้อมเครื่องหมายบังคับกรอกที่ label ซึ่งเขียนว่า "ISO"; ช่อง Name (`#eco-label-name`) ว่างและมี placeholder "e.g. USDA Organic, Fair Trade, Carbon Neutral" พร้อมเครื่องหมายบังคับกรอก; ช่อง Description (`#eco-label-description`) เป็น textarea 2 บรรทัด ว่าง และมี placeholder "Optional" (label ไม่มีเครื่องหมายบังคับกรอก); status switch (`#eco-label-is-active`) อยู่ที่เปิดใช้งาน (`aria-checked="true"`); footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save) และ dialog ไม่มีปุ่มกากบาทปิดมุมขวาบน

---
## TC-ECO-030003 — สร้างพร้อมกรอก Description แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/product-management/eco`; รหัส ISO ที่จะใช้ยังไม่มีใน BU
**Steps**
1. คลิกปุ่ม "Add Eco Certification"
2. กรอก ISO และ Name ที่ไม่ซ้ำ
3. กรอก Description เป็นข้อความสั้น ๆ ที่จดจำได้
4. คลิกปุ่ม Create
5. ค้นหารหัส ISO ที่เพิ่งสร้าง แล้วคลิกค่าในคอลัมน์ ISO เพื่อเปิด dialog ซ้ำ
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Eco Certification created successfully" และ dialog ปิดเอง; แถวใหม่ปรากฏในตาราง (ตารางไม่มีคอลัมน์ Description จึงตรวจจากตารางไม่ได้); เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Description ยังมีข้อความเดิมครบ — ยืนยันว่า `description` ถูกส่งและอ่านกลับได้จริง ไม่ใช่ถูกตัดทิ้งระหว่างทาง (payload ห่อ `metadata` ตามหมายเหตุข้อ 4)

---
## TC-ECO-030004 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/product-management/eco`; เปิด dialog "Add Eco Certification" และกรอก ISO, Name, Description ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Eco Certification" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้น (ISO ว่าง, Name ว่าง, Description ว่าง, status switch = เปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน — `ConfigEntityDialog` เรียก `form.reset(toFormValues(entity))` ทุกครั้งที่ `open` เปลี่ยนเป็น true

---
## TC-ECO-030005 — ระหว่างบันทึก ปุ่มเปลี่ยนสถานะและ dialog ปิดไม่ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/product-management/eco`; เปิด dialog "Add Eco Certification" และกรอก ISO + Name ที่ไม่ซ้ำไว้แล้ว; เทสต้องหน่วง response ของ `POST .../product-master-eco-labels` เพื่อให้เห็นช่วง pending (เช่น `page.route` + delay)
**Steps**
1. คลิกปุ่ม Create
2. ระหว่างที่คำขอยังไม่เสร็จ สังเกตปุ่ม Create และปุ่ม Cancel
3. ระหว่างนั้นกด Escape
4. ปล่อยให้คำขอเสร็จ แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ระหว่าง pending ปุ่ม submit เปลี่ยนข้อความเป็น "Creating..." และถูก disable, ปุ่ม Cancel ถูก disable ด้วย; กด Escape แล้ว dialog **ไม่ปิด** (`Dialog` ได้ `onOpenChange={undefined}` ขณะ `isPending`); เมื่อคำขอสำเร็จ dialog ปิดเองพร้อม toast "Eco Certification created successfully" (ในโหมดแก้ไข ข้อความบนปุ่มระหว่าง pending จะเป็น "Saving...")

---
## TC-ECO-040005 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/product-management/eco` และสลับเป็นมุมมองการ์ดแล้ว; มี eco certification อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Eco Certification" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (ISO, Name, Description, status switch); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน; การ์ดยังตอบสนองปุ่ม Enter/Space ด้วย (`role="button"` + `tabIndex=0`)

---
## TC-ECO-040006 — แก้ไขรหัส ISO แล้วค่าคงอยู่ทั้งตารางและ dialog
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี eco certification ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (ไม่มีสินค้าอ้างอยู่ — ดูหมายเหตุข้อ 5) และรู้รหัส ISO เดิม
**Steps**
1. ค้นหารหัสเดิมแล้วคลิกค่าในคอลัมน์ ISO เพื่อเปิด dialog แก้ไข
2. ล้างช่อง ISO แล้วกรอกรหัสใหม่ที่ไม่ซ้ำ
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. ค้นหาด้วยรหัสใหม่ แล้วเปิด dialog ของรายการนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog ตอนแก้ไขคือ "Edit Eco Certification" และปุ่มบันทึกคือ **Save**; แสดง toast "Eco Certification updated successfully" และ dialog ปิดเอง — **ไม่มี error 400 เรื่อง `doc_version`** (คำขอเป็น `PATCH .../product-master-eco-labels/{id}` ที่ส่ง `doc_version` ไว้ใน `metadata` ตามหมายเหตุข้อ 4); ค้นหาด้วยรหัสใหม่แล้วเจอแถวนั้น และค้นหาด้วยรหัสเดิมแล้วไม่เจอ; เปิด dialog ซ้ำแล้วช่อง ISO แสดงรหัสใหม่

---
## TC-ECO-040007 — ปิดใช้งานแล้วหายจากตัวเลือกในแท็บ Eco Labels ของสินค้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี eco certification ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและสถานะเปิดใช้งานอยู่; มีสินค้าอย่างน้อย 1 รายการที่เปิดหน้ารายละเอียดและแก้ไขได้
**Steps**
1. เปิดหน้ารายละเอียดสินค้า → แท็บ Eco Labels → กดปุ่มเพิ่ม แล้วเปิด dropdown ของช่อง Eco Label ตรวจว่ามีรายการที่เตรียมไว้ จากนั้นปิด dialog โดยไม่บันทึก
2. ไปที่ `/product-management/eco` เปิด dialog ของรายการนั้น ปิด status switch แล้วกด Save
3. กลับไปที่หน้าสินค้า แท็บ Eco Labels กดปุ่มเพิ่ม แล้วเปิด dropdown ของช่อง Eco Label อีกครั้ง
4. เปิดใช้งานรายการนั้นกลับ แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ก่อนปิดใช้งาน รายการปรากฏใน dropdown โดยแสดงเป็น **ชื่อ** (name); หลังปิดใช้งานแล้วรายการนั้น **หายจาก dropdown** ขณะที่รายการอื่นยังอยู่ — `pd-eco-label-dialog.tsx` กรองรายการต้นทางด้วย `.filter((c) => c.is_active)`; สินค้าที่เคยผูกรายการนี้ไว้ก่อนหน้ายังแสดงชื่อในตารางของแท็บได้ตามเดิม (ตารางอ่านจาก master ทั้งหมด ไม่ได้กรองสถานะ)

---
## TC-ECO-050003 — ข้อความยืนยันลบอ้างชื่อ ไม่ใช่รหัส ISO
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มี eco certification ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (ไม่มีสินค้าอ้างอยู่) และรู้ทั้งรหัส ISO และชื่อแน่นอนโดยตั้งให้สองค่าต่างกันชัดเจน
**Steps**
1. ค้นหารายการนั้น เปิดเมนู Row actions ของแถวแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Eco Certification" และคำอธิบายอ้าง **ชื่อ** ของรายการ ไม่ใช่รหัส ISO ("Are you sure you want to delete eco certification \"<ชื่อ>\"? This action cannot be undone.") — `entityNameField` ของโมดูลนี้คือ `name`; footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Eco Certification deleted successfully"

---
## TC-ECO-050004 — ลบจากปุ่ม Delete บนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มี eco certification ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (ไม่มีสินค้าอ้างอยู่); สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของรายการนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว **ไม่** เปิด dialog แก้ไข (event ถูก `stopPropagation` และ `ListCard` ยังกัน `closest("button")` อีกชั้น) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Eco Certification deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-ECO-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่เข้าหน้า `/product-management/eco` ได้ (มี `product_management.view`) แต่ **ไม่มี** `product_management.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`); BU ยังมี license `product_management.master_eco_label` อยู่ (ไม่งั้นจะเข้าเงื่อนไข license ซึ่งเป็นคนละเหตุผล)
**Steps**
1. ไปที่ `/product-management/eco`
2. สังเกตสภาพปุ่ม "Add Eco Certification"
3. คลิกปุ่มนั้น
**Expected**
ปุ่ม "Add Eco Certification" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว **ไม่** เปิด dialog สร้าง แต่เด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน (เหตุผล `permission` ไม่ใช่ `expired`)

---
## TC-ECO-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มี `product_management.view` แต่ **ไม่มี** `product_management.update` และไม่ใช่ admin ของ BU; มี eco certification อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/eco`
2. คลิกค่าในคอลัมน์ ISO เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง ISO, Name, Description และ status switch ถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า **"Close"** (ไม่ใช่ "Cancel"); ปิดแล้วไม่มีคำขอ PATCH ถูกส่ง

---
## TC-ECO-100007 — ไม่มีสิทธิ์ลบ — ทั้งเมนูแถวและปุ่มบนการ์ดเด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มี `product_management.view` แต่ **ไม่มี** `product_management.delete` และไม่ใช่ admin ของ BU; มี eco certification อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/eco`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ดใบเดียวกัน
**Expected**
รายการ Delete ในเมนูแสดงแบบจาง (`opacity-50`) และมี `aria-disabled="true"` แต่ยังคลิกได้; คลิกแล้ว **ไม่** เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน gate ชุดเดียวกันผ่าน `useDeleteGate`) และไม่มีรายการใดถูกลบ

---
## TC-ECO-100008 — ไม่มีสิทธิ์ดู — เมนู Eco ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** `product_management.view` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังมี license `product_management.master_eco_label` อยู่ (ไม่งั้นจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผลและมีไอคอนแม่กุญแจ)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Product Management ใน sidebar
2. สังเกตรายการ "Eco"
3. คลิกรายการ "Eco"
**Expected**
รายการ "Eco" ยังอยู่ในเมนูแต่ถูกทำให้จาง และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/product-management/eco">` ให้กดไปหน้า (`side-main.tsx` render เป็น `<button>` เมื่อ `denied`); **ไม่มีไอคอนแม่กุญแจ** (แม่กุญแจสงวนไว้ให้กรณี license เท่านั้น และ locked ชนะ denied เสมอเมื่อเป็นทั้งคู่); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied" ด้วยเหตุผล `permission`

---
## TC-ECO-200004 — ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/product-management/eco` และเปิด dialog "Add Eco Certification" อยู่
**Steps**
1. ตรวจ attribute `maxLength` ของ textarea Description (`#eco-label-description`)
2. กรอกข้อความยาว 300 ตัวอักษรลงในช่อง Description
3. อ่านค่าที่อยู่ในช่องจริง
**Expected**
textarea มี `maxlength="256"` และ `rows="2"`; ค่าที่อยู่ในช่องหลังกรอกยาวเกิน ถูก clamp ที่ **ไม่เกิน 256 ตัวอักษร**; ไม่มีข้อความ error ใต้ช่อง (Description เป็น optional ใน schema — `z.string().optional()`) และปุ่ม Create ยังกดได้

---
## TC-ECO-200005 — แก้ไข: ล้างช่อง ISO แล้วบันทึกต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี eco certification ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. ค้นหารายการนั้นแล้วคลิกค่าในคอลัมน์ ISO เพื่อเปิด dialog แก้ไข
2. ล้างค่าในช่อง ISO ให้ว่าง (ปล่อยช่อง Name ไว้ตามเดิม)
3. คลิกปุ่ม Save
4. กด Cancel แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
มีข้อความ error แสดงใต้ช่อง ISO และ dialog **ยังเปิดอยู่** (schema บังคับ `code` ด้วย `min(1)`); ไม่มีคำขอ PATCH ถูกส่งออกไปและไม่มี toast สำเร็จ; ช่อง Name ยังคงค่าเดิมไว้ไม่ถูกล้างตาม — **หมายเหตุ:** ข้อความ error ที่เห็นจริงอ้างคำว่า "Code" ไม่ใช่ "ISO" ตามป้ายของช่อง (ดูหมายเหตุข้อ 7) เคสนี้จึงไม่ผูก assertion กับตัวข้อความ
