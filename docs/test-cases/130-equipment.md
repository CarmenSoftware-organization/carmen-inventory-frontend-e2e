# Equipment — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/equipment`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Equipment
**Frontend route:** `routes/operation-plan/equipment`  •  **URL:** `/operation-plan/equipment` (และ `/operation-plan/equipment/new`, `/operation-plan/equipment/:id`)
**Prefix:** `EQP`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 45

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> แคตตาล็อกนี้สอบทานใหม่ทั้งฉบับกับโค้ดปัจจุบัน (frontend มี 39 คอมมิตในโมดูลนี้ตั้งแต่ 2026-06-17) ข้อเท็จจริงที่เปลี่ยนไปและมีผลกับการเขียนเทส:
>
> 1. **`category_id` ไม่ได้ถูกบังคับใน schema** — `eq-form-schema.ts` ประกาศเป็น `z.string().nullable()` มีเพียง `code` กับ `name` เท่านั้นที่เป็น `min(1)` ส่วน `FieldLabel` ของ Category ยังติด `required` (ดาวแดง) อยู่ **ห้ามเขียนเคสที่คาดหวังว่า Category ว่างแล้วฟอร์มจะบล็อก** — TC-EQP-200002 เดิมที่ยืนยันแบบนั้นถูกเขียนใหม่ให้ assert เฉพาะเครื่องหมายบังคับบน label
> 2. **create กับ update ไปคนละทางหลังสำเร็จ** — create ขึ้น toast แล้ว `f.backToList()` เด้งกลับหน้า list เสมอ (ถ้าค้างที่ `/new` ปุ่มจะกลายเป็น Edit แล้วกด Save ซ้ำจะสร้างใบใหม่) ส่วน update ขึ้น toast แล้ว **อยู่หน้าเดิม** สลับกลับเป็นโหมด view — เคสที่ต้องยืนยันค่าที่บันทึกหลัง create ต้องเปิดอุปกรณ์นั้นซ้ำจาก list
> 3. **ฟอร์มมี 3 โหมดจาก `useEntityForm`** — `/new` = `add`, `/:id` = `view` (ทุกฟิลด์ `disabled`) แล้วกด Edit ถึงเข้า `edit` · **ปุ่ม Delete โผล่เฉพาะโหมด `edit`** (`isEdit && onDelete`) ไม่มีในโหมด view และไม่มีในโหมด add · status badge ใน toolbar ไม่ render ตอน add
> 4. **ฟอร์มถูก redesign เป็น `SettingSection` ต่อกัน 7 ส่วน** (คอมมิต `39ed6f50` / `db4fd488` / `ce728835`): General Information → Specifications → Photo → Quantity & Settings → Instructions → Maintenance → Additional — **Capacity / Power Rating / Station ย้ายไปอยู่ Specifications** ไม่ได้อยู่ในส่วน General แล้ว
> 5. **Quantity & Settings มี 4 ช่อง ไม่ใช่ 2** — Available Qty · Total Qty · Usage Count · Avg. Usage Time (min) ทั้งสี่เป็น `type="number"` `min={0}` และ zod `min(0)` ข้อความ error ใช้ label กลางว่า `Qty must be at least 0` (มาจาก `tf("qty")`) **ไม่ใช่ชื่อช่องนั้น ๆ**
> 6. **มีส่วนอัปโหลดรูป (`EqImageField`)** ที่แคตตาล็อกเดิมไม่มีเคสครอบเลย — รับ JPEG/PNG/WebP ขนาด ≤ 2 MB (`IMAGE_MAX_BYTES`) ผิดชนิด/ใหญ่เกินขึ้น `toast.warning` ไม่ใช่ error ใต้ฟิลด์ · create/update ยิงเป็น **multipart** (`metadata` + `image`) และ update แนบ `doc_version` เพื่อ optimistic concurrency
> 7. **section ที่ลงทะเบียนให้ `EQP` คือ 01–05, 10, 20, 40–42** ไม่มี 90 (edge case) และไม่มี 43 — เคส "เปิดอุปกรณ์ที่ไม่มีอยู่จริง" จึงอยู่ที่บล็อก 02 และเคสรูปภาพถูกกระจายเข้า 03 / 04 / 20 แทนที่จะเปิดบล็อกใหม่ ถ้าจะแยกต้องลงทะเบียนใน `docs/test-id-scheme.md` ก่อน
> 8. **ลบได้ 3 ทาง** — ปุ่ม Delete ใน toolbar โหมดแก้ไข · เมนูจุดไข่ปลาท้ายแถวในตาราง · ปุ่มถังขยะท้ายการ์ดในโหมด grid — ทั้งสามเปิด `DeleteDialog` ตัวเดียวกัน (050001 / 050003 / 050004)
> 9. **เมนูท้ายแถวมีแค่ Delete** — `useEquipmentTable` ส่งเฉพาะ `onDelete` ไม่ได้ส่ง `onEdit` และ **ไม่ได้เปิดเมนู Activity** (equipment ไม่อยู่ใน activity registry — มีคอมเมนต์ระบุไว้ตรง ๆ ใน `use-config-table.ts`) · ตารางมีคอลัมน์ checkbox เลือกแถวแต่ **ไม่มี UI bulk action**
> 10. **คอลัมน์ Created / Updated มีอยู่จริงแต่ถูกซ่อนตั้งต้น** (`initialState.columnVisibility`) ต้องเปิดจากปุ่ม Toggle columns — คอมมิต `016d1da3` เพิ่มคอลัมน์ ส่วน `7e1b9178` ยุบมาเป็น `auditColumns` ตัวกลาง
> 11. **แถบเครื่องมือเป็น `ListToolbar` ตัวกลาง** (คอมมิต `c8e990b8`) — ช่องค้น · saved view · ปุ่ม Filter · ปุ่ม Sort · ปุ่ม Toggle columns · สวิตช์ list/grid — ฝั่งขวาทั้งชุด `hidden sm:flex` จึงเห็นเฉพาะ desktop · ตัวกรองบน desktop เป็น **popover menu สองชั้นแบบ Linear** (คอมมิต `251be8fc`) มือถือยังเป็น bottom sheet · chip ใน `ActiveFilterBar` กดแก้ค่าได้เลย (คอมมิต `3b12e568`)
> 12. **ช่องค้นหายิง query เมื่อกด Enter เท่านั้น** — `SearchInput` ผูก `onSearch` ไว้กับ `keydown` Enter และปุ่มท้ายช่อง ซึ่งจะกลายเป็นปุ่มล้าง (X) ทันทีที่มีข้อความ การพิมพ์เฉย ๆ ไม่ยิงอะไร
> 13. **ตัวกรองของหน้านี้มี 2 ตัว** — Status (`is_active|bool:true/false`) และ Category (multi-select จาก `useEquipmentCategory` เฉพาะที่ `is_active`) ไม่มีตัวกรองอื่น
> 14. **ปุ่ม Export / Print มีอยู่แต่ `disabled` ถาวร** พร้อม `title="Coming soon"` (บนมือถืออยู่ในเมนู "…" และก็ disabled เหมือนกัน) — เคสที่แตะปุ่มนี้ assert ว่าปรากฏและถูกปิด ไม่ใช่ว่าใช้งานได้
> 15. **การคุมสิทธิ์อยู่ที่ `RouteGuard` ระดับ root-layout** (`routes/root-layout.tsx`) ซึ่งหา leaf จาก `constant/module-list.ts` — leaf ของหน้านี้คือ `operation_plan.view` + license `operation_plan.equipment` (license มาก่อน permission และ **ไม่มี admin bypass**) เมื่อถูกปฏิเสธจะเห็น **กล่อง AccessDeniedBlock** (`role="alert"`) ไม่ใช่ redirect · คนที่ไม่มี token ถูก `RequireAuth` เด้งไป `/login` · router เองไม่มี guard รายเส้นทาง
> 16. **มีเคสถูกลบ 0 เคส แต่เขียนใหม่ 1 เคส** — 18 เคสเดิมยังตรวจของที่มีอยู่จริงทั้งหมด (TC-EQP-200002 ถูกเขียนใหม่ตามข้อ 1) และเพิ่มใหม่ 27 เคส

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EQP-010001 | แสดงรายการอุปกรณ์ | High | Smoke |
| TC-EQP-010002 | ค้นหาอุปกรณ์ด้วยชื่อ/รหัส | High | Functional |
| TC-EQP-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-EQP-010004 | สลับมุมมอง List / Grid | Low | Functional |
| TC-EQP-010005 | กรองตามหมวดหมู่อุปกรณ์ | Medium | Functional |
| TC-EQP-010006 | แก้ค่าตัวกรองจาก chip และล้างทั้งหมด | Low | Functional |
| TC-EQP-010007 | เรียงลำดับผ่านเมนู Sort บน toolbar | Medium | Functional |
| TC-EQP-010008 | เปิดคอลัมน์ Created / Updated ที่ซ่อนอยู่ | Low | Functional |
| TC-EQP-010009 | บันทึกมุมมอง (Saved View) จากตัวกรองปัจจุบัน | Medium | Functional |
| TC-EQP-010010 | ปุ่ม Export / Print ปรากฏแต่ถูกปิดใช้งาน | Low | Functional |
| TC-EQP-010011 | ค้นหาไม่พบแล้วแสดงสถานะว่าง | Low | Edge Case |
| TC-EQP-010012 | เปลี่ยนหน้าและจำนวนแถวต่อหน้า | Medium | Functional |
| TC-EQP-020001 | เปิดหน้ารายละเอียดอุปกรณ์ (view) | Medium | Happy Path |
| TC-EQP-020002 | โหมด view ล็อกทุกฟิลด์ไม่ให้แก้ไข | Medium | Functional |
| TC-EQP-020003 | กด Back จากโหมด view กลับ list ทันที | Low | Alternate Flow |
| TC-EQP-020004 | เปิดอุปกรณ์ที่ไม่มีอยู่จริงแล้วเจอ Equipment not found | Medium | Edge Case |
| TC-EQP-030001 | สร้างอุปกรณ์ใหม่สำเร็จ (ฟิลด์บังคับครบ) | High | CRUD |
| TC-EQP-030002 | สร้างอุปกรณ์พร้อมข้อมูลผู้ผลิตและสเปก | Medium | Happy Path |
| TC-EQP-030003 | ยกเลิกการสร้างเมื่อมีข้อมูลค้าง (Discard) | Medium | Alternate Flow |
| TC-EQP-030004 | โหมดสร้างไม่มีปุ่ม Delete และไม่มี status badge | Low | Functional |
| TC-EQP-030005 | เตือนเมื่อออกจากฟอร์มผ่านเมนูข้างขณะยังไม่บันทึก | Medium | Alternate Flow |
| TC-EQP-030006 | สร้างอุปกรณ์พร้อมแนบรูปภาพ | Medium | Happy Path |
| TC-EQP-040001 | แก้ไขข้อมูลอุปกรณ์แล้วค่าคงอยู่ | High | CRUD |
| TC-EQP-040002 | แก้ไขจำนวนในส่วน Quantity & Settings | Medium | CRUD |
| TC-EQP-040003 | กด Cancel ในโหมดแก้ไขคืนค่าเดิมและกลับสู่โหมด view | Medium | Alternate Flow |
| TC-EQP-040004 | บันทึกแล้วกลับเข้าโหมด view โดยไม่ออกจากหน้า | Medium | Functional |
| TC-EQP-040005 | เปลี่ยนรูปและลบรูปในโหมดแก้ไข | Medium | CRUD |
| TC-EQP-050001 | ลบอุปกรณ์จากหน้าแก้ไขสำเร็จ | High | CRUD |
| TC-EQP-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-EQP-050003 | ลบอุปกรณ์จากเมนูท้ายแถวในตาราง | High | CRUD |
| TC-EQP-050004 | ลบอุปกรณ์จากปุ่มถังขยะท้ายการ์ดในโหมด grid | Medium | CRUD |
| TC-EQP-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าอุปกรณ์ | High | Authorization |
| TC-EQP-100002 | ผู้ใช้ที่ไม่ได้ล็อกอินถูกเด้งไปหน้า Login | High | Auth-guard |
| TC-EQP-200001 | บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง | High | Validation |
| TC-EQP-200002 | ฟิลด์ Code / Name / Category แสดงเครื่องหมายบังคับ | Medium | Validation |
| TC-EQP-200003 | ไม่รับจำนวนติดลบในส่วน Quantity & Settings | Medium | Validation |
| TC-EQP-200004 | ช่อง Code จำกัดความยาว 10 ตัวอักษร | Medium | Validation |
| TC-EQP-200005 | ช่องข้อความอื่นจำกัดความยาวตามที่ออกแบบ | Low | Validation |
| TC-EQP-200006 | อัปโหลดไฟล์ผิดชนิดแล้วขึ้นคำเตือน | Medium | Validation |
| TC-EQP-200007 | อัปโหลดรูปเกิน 2 MB แล้วขึ้นคำเตือน | Medium | Validation |
| TC-EQP-400001 | กรอกข้อมูลตารางบำรุงรักษาและวันที่ | Medium | Functional |
| TC-EQP-400002 | ล้างวันที่บำรุงรักษาด้วยปุ่ม Clear | Low | Alternate Flow |
| TC-EQP-410001 | กรอกคำแนะนำการใช้งาน / ความปลอดภัย / การทำความสะอาด | Low | Functional |
| TC-EQP-420001 | toggle Portable และ Active ในส่วน Additional | Low | Functional |
| TC-EQP-420002 | บันทึกหมายเหตุ (Note) ในส่วน Additional | Low | Functional |

---
## TC-EQP-010001 — แสดงรายการอุปกรณ์
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีอุปกรณ์อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/equipment`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวหน้าแสดง "Equipment" + badge จำนวนรายการ + คำอธิบายของโมดูล; ตารางแสดงคอลัมน์ checkbox, #, Code, Name, Category, Brand, Model, Station, Capacity, Status และคอลัมน์เมนูท้ายแถว — คอลัมน์ Created / Updated ถูกซ่อนตั้งต้น

---
## TC-EQP-010002 — ค้นหาอุปกรณ์ด้วยชื่อ/รหัส
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment`; มีหลายอุปกรณ์
**Steps**
1. คลิกที่ช่อง Search แล้วพิมพ์ชื่อหรือรหัสของอุปกรณ์ที่มีอยู่ (ยังไม่กดอะไร)
2. กด Enter
3. กดปุ่ม X ท้ายช่องค้นหาเพื่อล้าง
**Expected**
ขั้นที่ 1 ตารางยังไม่เปลี่ยน (ยิง query เมื่อกด Enter เท่านั้น); ขั้นที่ 2 ตารางแสดงเฉพาะอุปกรณ์ที่ตรงกับคำค้นและ URL มีพารามิเตอร์ `search`; ขั้นที่ 3 คำค้นหายและรายการกลับมาครบ

---
## TC-EQP-010003 — กรองตามสถานะ Active/Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop; มีอุปกรณ์ทั้งสถานะ active และ inactive
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลื่อนไปที่แถว Status ในหมวด Document แล้วเลือก Active จาก submenu
**Expected**
ตารางแสดงเฉพาะอุปกรณ์ที่ Status = Active; ปุ่ม Filter ติด badge จำนวน 1 และมี chip Status ปรากฏในแถบ Filters

---
## TC-EQP-010004 — สลับมุมมอง List / Grid
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop (สวิตช์นี้ซ่อนบนจอแคบ เพราะมือถือถูกบังคับเป็น grid อยู่แล้ว)
**Steps**
1. คลิกปุ่ม Grid view (aria-label `Grid view`)
2. คลิกปุ่ม List view กลับ
**Expected**
โหมด grid แสดงการ์ดอุปกรณ์ (สถานะ Active/Inactive, Code, Category, Brand, Model, Station และแถว audit ท้ายการ์ด) พร้อมโหลดเพิ่มแบบ infinite scroll ไม่มีแถบ pagination; กลับโหมด list แล้วเห็นตารางเดิมพร้อมแถบ pagination

---
## TC-EQP-010005 — กรองตามหมวดหมู่อุปกรณ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop; มี equipment category ที่ active อย่างน้อย 1 รายการและมีอุปกรณ์ผูกกับหมวดนั้น
**Steps**
1. คลิกปุ่ม Filter
2. เลื่อนไปที่แถว Category ในหมวด Category แล้วติ๊กหมวดหมู่หนึ่งจาก submenu
**Expected**
ตารางแสดงเฉพาะอุปกรณ์ในหมวดที่เลือก; รายการตัวเลือกมีเฉพาะหมวดที่ `is_active`; chip Category ปรากฏในแถบ Filters

---
## TC-EQP-010006 — แก้ค่าตัวกรองจาก chip และล้างทั้งหมด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` โดยมีตัวกรอง Status และ Category เปิดอยู่อย่างละ 1 ค่า
**Steps**
1. คลิกที่ตัว chip Status ในแถบ Filters
2. เปลี่ยนค่าเป็น Inactive จาก popover ที่เด้งขึ้น
3. คลิกปุ่ม X บน chip Category
4. คลิก Clear ท้ายแถบ Filters
**Expected**
ขั้นที่ 2 ตารางอัปเดตตามค่าใหม่โดยไม่ต้องเปิดเมนู Filter; ขั้นที่ 3 chip Category หายและตัวกรองหมวดหมู่ถูกถอด; ขั้นที่ 4 แถบ Filters หายทั้งแถบและรายการกลับมาครบ

---
## TC-EQP-010007 — เรียงลำดับผ่านเมนู Sort บน toolbar
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop; มีอุปกรณ์หลายรายการ
**Steps**
1. คลิกปุ่ม Sort (aria-label `Sort by`)
2. เลือก Name
3. คลิก Name ซ้ำอีกครั้ง
4. เลือกแถว Default
**Expected**
ขั้นที่ 2 URL มี `sort=name:asc` และแถว Name มีลูกศรขึ้น; ขั้นที่ 3 กลับเป็น `name:desc` พร้อมลูกศรลง; ขั้นที่ 4 พารามิเตอร์ `sort` ถูกล้างออกจาก URL และปุ่ม Sort เลิกติดสี primary

---
## TC-EQP-010008 — เปิดคอลัมน์ Created / Updated ที่ซ่อนอยู่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop ในโหมด list
**Steps**
1. คลิกปุ่ม Toggle columns (aria-label `Toggle columns`)
2. ติ๊กเปิด Created และ Updated
**Expected**
ตารางเพิ่มคอลัมน์ Created และ Updated แสดงวันที่-เวลาและชื่อผู้ทำรายการตามรูปแบบวันที่ของ BU

---
## TC-EQP-010009 — บันทึกมุมมอง (Saved View) จากตัวกรองปัจจุบัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` โดยตั้งตัวกรอง Status = Active ไว้แล้ว
**Steps**
1. เปิดเมนู Filter แล้วกด "Save current filters as view" (หรือเลือกจากเมนู View)
2. กรอกชื่อ view และเลือก Visibility = Only me
3. กด Save
4. รีเฟรชหน้าแล้วเลือก view ที่บันทึกไว้จากเมนู View
**Expected**
ขึ้น toast ว่าบันทึก view แล้ว; ชื่อ view ปรากฏบนปุ่ม View และในกลุ่ม My views; เลือกแล้วตัวกรองเดิมถูก apply กลับมา

---
## TC-EQP-010010 — ปุ่ม Export / Print ปรากฏแต่ถูกปิดใช้งาน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` บน desktop
**Steps**
1. มองหาปุ่ม Export และ Print ข้างปุ่ม Add Equipment
2. เลื่อนเมาส์ไปวางบนปุ่ม
**Expected**
ปุ่มทั้งสองปรากฏในสถานะ disabled และมี `title` ว่า "Coming soon" — กดไม่ได้และไม่มีไฟล์ใดถูกสร้าง

---
## TC-EQP-010011 — ค้นหาไม่พบแล้วแสดงสถานะว่าง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment`
**Steps**
1. พิมพ์คำค้นที่ไม่มีทางตรงกับอุปกรณ์ใด (เช่น `zzz-no-such-equipment`)
2. กด Enter
**Expected**
ตารางไม่มีแถวข้อมูลและแสดงกล่องสถานะว่างพร้อมข้อความ "No data found"

---
## TC-EQP-010012 — เปลี่ยนหน้าและจำนวนแถวต่อหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` ในโหมด list; มีอุปกรณ์มากพอให้เกิน 1 หน้า
**Steps**
1. เลือกจำนวนแถวต่อหน้าเป็น 5 จาก select ท้ายตาราง
2. กดปุ่มไปหน้าถัดไป
**Expected**
ตารางแสดงไม่เกิน 5 แถว; URL อัปเดตพารามิเตอร์ `perpage` และ `page`; ข้อมูลในหน้าที่ 2 ต่างจากหน้าแรก

---
## TC-EQP-020001 — เปิดหน้ารายละเอียดอุปกรณ์ (view)
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment`; มีอุปกรณ์อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ Code ของอุปกรณ์ในตาราง (เป็นปุ่มลิงก์ ไม่ใช่การคลิกทั้งแถว)
**Expected**
นำทางไปที่ `/operation-plan/equipment/{id}`; toolbar แสดงชื่ออุปกรณ์เป็นหัวเรื่อง, code pill, status badge Active/Inactive และปุ่ม Edit เพียงปุ่มเดียว (ไม่มี Save/Cancel/Delete)

---
## TC-EQP-020002 — โหมด view ล็อกทุกฟิลด์ไม่ให้แก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/equipment/{id}` ในโหมด view
**Steps**
1. ไล่ดูทุก section: General Information, Specifications, Photo, Quantity & Settings, Instructions, Maintenance, Additional
2. ลองพิมพ์ในช่อง Name และลองกดที่กรอบอัปโหลดรูป
**Expected**
ทุก input / textarea / lookup / date picker / switch อยู่ในสถานะ disabled; กรอบรูปกดไม่ได้และไม่มีปุ่ม Change / Remove image; ค่าที่แสดงไม่เปลี่ยน

---
## TC-EQP-020003 — กด Back จากโหมด view กลับ list ทันที
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/equipment/{id}` ในโหมด view (เข้ามาจากหน้าอื่นที่ไม่ใช่ list ก็ได้)
**Steps**
1. คลิกปุ่มย้อนกลับ (aria/label `Go back`) บน toolbar
**Expected**
กลับไปที่ `/operation-plan/equipment` ในครั้งเดียวโดยไม่มี dialog ถามยืนยัน (โหมด view ไม่มีข้อมูลค้าง)

---
## TC-EQP-020004 — เปิดอุปกรณ์ที่ไม่มีอยู่จริงแล้วเจอ Equipment not found
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เปิด URL `/operation-plan/equipment/00000000-0000-0000-0000-000000000000` ตรง ๆ
**Expected**
หลังโครงร่างฟอร์มหายไป แสดงกล่อง error พร้อมข้อความ "Equipment not found" และปุ่มกลับไปหน้า `/operation-plan/equipment` — ไม่มีฟอร์มให้แก้ไข

---
## TC-EQP-030001 — สร้างอุปกรณ์ใหม่สำเร็จ (ฟิลด์บังคับครบ)
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี equipment category ที่ active อย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่ม Add Equipment (ไปที่ `/operation-plan/equipment/new`)
2. กรอก Code และ Name ในส่วน General Information
3. เลือก Category จาก lookup
4. คลิก Create
**Expected**
ขึ้น toast "Equipment created successfully"; ระบบเด้งกลับไปที่ `/operation-plan/equipment` และอุปกรณ์ใหม่ปรากฏในรายการ

---
## TC-EQP-030002 — สร้างอุปกรณ์พร้อมข้อมูลผู้ผลิตและสเปก
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่ที่ `/operation-plan/equipment/new`
**Steps**
1. กรอก Code, Name และเลือก Category
2. กรอก Brand, Model, Serial No. ในส่วน General Information
3. กรอก Station, Capacity, Power Rating ในส่วน Specifications
4. คลิก Create แล้วเปิดอุปกรณ์นั้นจาก list ซ้ำ
**Expected**
สร้างสำเร็จและคอลัมน์ Brand / Model / Station / Capacity ในตารางแสดงค่าที่กรอก; เปิดซ้ำแล้วทุกค่ารวมถึง Serial No. และ Power Rating ยังอยู่ครบ

---
## TC-EQP-030003 — ยกเลิกการสร้างเมื่อมีข้อมูลค้าง (Discard)
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่และกรอก Name ไปแล้วบางส่วน
**Steps**
1. คลิกปุ่ม Cancel บน toolbar
2. ใน dialog "Discard changes?" กด Keep editing
3. คลิก Cancel อีกครั้งแล้วกด Discard
**Expected**
ขั้นที่ 2 ยังอยู่ในฟอร์มเดิมพร้อมข้อมูลที่กรอกไว้; ขั้นที่ 3 กลับไปที่ `/operation-plan/equipment` โดยไม่มีอุปกรณ์ใหม่ถูกสร้าง

---
## TC-EQP-030004 — โหมดสร้างไม่มีปุ่ม Delete และไม่มี status badge
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่ที่ `/operation-plan/equipment/new`
**Steps**
1. ตรวจแถบปุ่มบน toolbar
2. ตรวจกลุ่ม badge ข้างหัวเรื่อง
**Expected**
toolbar มีเฉพาะ Cancel และ Create (ไม่มี Delete); หัวเรื่องคือ "Add Equipment"; มีเพียง code pill ที่ขึ้นว่า "no code" จนกว่าจะพิมพ์ Code และยังไม่มี badge Active/Inactive

---
## TC-EQP-030005 — เตือนเมื่อออกจากฟอร์มผ่านเมนูข้างขณะยังไม่บันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่และกรอกข้อมูลไปแล้วบางส่วน
**Steps**
1. คลิกลิงก์เมนูอื่นใน sidebar
2. ใน dialog ที่เด้งขึ้น กด Keep editing
3. ทำซ้ำแล้วกด Discard
**Expected**
ขั้นที่ 2 ยังอยู่ที่ `/operation-plan/equipment/new` พร้อมข้อมูลเดิม; ขั้นที่ 3 ออกไปยังหน้าเป้าหมายและข้อมูลที่กรอกถูกทิ้ง

---
## TC-EQP-030006 — สร้างอุปกรณ์พร้อมแนบรูปภาพ
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่; มีไฟล์ JPEG หรือ PNG ขนาดไม่เกิน 2 MB
**Steps**
1. กรอก Code, Name และเลือก Category
2. คลิกกรอบ "Drop photo or click to upload" ในส่วน Photo แล้วเลือกไฟล์รูป
3. คลิก Create แล้วเปิดอุปกรณ์นั้นซ้ำจาก list
**Expected**
ขั้นที่ 2 กรอบเปลี่ยนเป็นภาพตัวอย่างพร้อมปุ่ม Change และปุ่มลบรูป; หลังสร้างสำเร็จและเปิดซ้ำ ส่วน Photo แสดงรูปที่อัปโหลดไว้

---
## TC-EQP-040001 — แก้ไขข้อมูลอุปกรณ์แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีอุปกรณ์ที่สร้างไว้แล้ว และเปิดอยู่ที่ `/operation-plan/equipment/{id}`
**Steps**
1. คลิก Edit บน toolbar
2. แก้ไข Name และ Description
3. คลิก Save
4. กลับไปหน้า list แล้วเปิดอุปกรณ์นั้นอีกครั้ง
**Expected**
ขึ้น toast "Equipment updated successfully"; ค่าที่แก้ไขแสดงเดิมเมื่อเปิดซ้ำ และคอลัมน์ Name ในตารางเปลี่ยนตาม

---
## TC-EQP-040002 — แก้ไขจำนวนในส่วน Quantity & Settings
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Quantity & Settings
**Steps**
1. แก้ไข Available Qty, Total Qty, Usage Count และ Avg. Usage Time (min)
2. คลิก Save
3. เปิดอุปกรณ์นั้นซ้ำ
**Expected**
บันทึกสำเร็จและค่าทั้งสี่ช่องแสดงค่าที่แก้ไขเมื่อเปิดซ้ำ

---
## TC-EQP-040003 — กด Cancel ในโหมดแก้ไขคืนค่าเดิมและกลับสู่โหมด view
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์และแก้ค่า Name ไปแล้วแต่ยังไม่ Save
**Steps**
1. คลิก Cancel
2. ใน dialog "Discard changes?" กด Discard
**Expected**
ช่อง Name กลับไปเป็นค่าที่โหลดมาตอนแรกบนหน้าจอจริง ๆ; ฟอร์มกลับเป็นโหมด view (toolbar เหลือปุ่ม Edit) โดยไม่ออกจากหน้า

---
## TC-EQP-040004 — บันทึกแล้วกลับเข้าโหมด view โดยไม่ออกจากหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์และแก้ไขค่าบางอย่างแล้ว
**Steps**
1. คลิก Save
2. หลังเห็น toast ให้กด Cancel/Back ทันที
**Expected**
หลัง Save ยังอยู่ที่ `/operation-plan/equipment/{id}` และ toolbar สลับกลับเป็นโหมด view (ปุ่ม Edit); กด Back แล้วกลับ list ทันทีโดย **ไม่มี** dialog ถามทิ้งข้อมูล (baseline ถูก reset หลังบันทึกแล้ว)

---
## TC-EQP-040005 — เปลี่ยนรูปและลบรูปในโหมดแก้ไข
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีอุปกรณ์ที่มีรูปอยู่แล้ว และอยู่ในโหมด edit ของอุปกรณ์นั้น
**Steps**
1. กดปุ่ม Change ในส่วน Photo แล้วเลือกไฟล์รูปใหม่ที่ถูกต้อง
2. คลิก Save แล้วเปิดซ้ำเพื่อยืนยันรูปใหม่
3. เข้าโหมด edit อีกครั้ง กดปุ่มลบรูป (X) แล้วคลิก Save
**Expected**
ขั้นที่ 2 ส่วน Photo แสดงรูปใหม่; ขั้นที่ 3 หลังบันทึกและเปิดซ้ำ ส่วน Photo กลับเป็นกรอบ "Drop photo or click to upload" ว่าง ๆ

---
## TC-EQP-050001 — ลบอุปกรณ์จากหน้าแก้ไขสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีอุปกรณ์ที่สร้างขึ้นมาสำหรับเทสโดยเฉพาะและสามารถลบได้
**Steps**
1. เปิดอุปกรณ์นั้นแล้วคลิก Edit (ปุ่ม Delete มีเฉพาะในโหมด edit)
2. คลิกปุ่ม Delete
3. ยืนยันใน dialog "Delete Equipment"
**Expected**
ขึ้น toast "Equipment deleted successfully"; ระบบกลับไปที่ `/operation-plan/equipment` และอุปกรณ์หายจากรายการ

---
## TC-EQP-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์
**Steps**
1. คลิกปุ่ม Delete
2. ใน dialog กด Cancel
**Expected**
Dialog ปิดโดยไม่ลบ; ยังอยู่ที่หน้าอุปกรณ์เดิมในโหมด edit และรายการยังมีอุปกรณ์นั้น

---
## TC-EQP-050003 — ลบอุปกรณ์จากเมนูท้ายแถวในตาราง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` ในโหมด list; มีอุปกรณ์สำหรับเทสที่ลบได้
**Steps**
1. คลิกปุ่มจุดไข่ปลาท้ายแถวของอุปกรณ์นั้น (aria-label `Row actions`)
2. เลือก Delete
3. ยืนยันใน dialog
**Expected**
เมนูมีเฉพาะรายการ Delete (ไม่มี Edit และไม่มี Activity); หลังยืนยันขึ้น toast "Equipment deleted successfully" และแถวหายจากตารางโดยไม่ออกจากหน้า list

---
## TC-EQP-050004 — ลบอุปกรณ์จากปุ่มถังขยะท้ายการ์ดในโหมด grid
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/operation-plan/equipment` และสลับเป็นโหมด Grid; มีอุปกรณ์สำหรับเทสที่ลบได้
**Steps**
1. หาการ์ดของอุปกรณ์นั้นแล้วกดปุ่มถังขยะท้ายการ์ด
2. ยืนยันใน dialog "Delete Equipment"
**Expected**
เป็น dialog ตัวเดียวกับการลบจากตาราง; หลังยืนยันขึ้น toast "Equipment deleted successfully" และการ์ดหายจาก grid

---
## TC-EQP-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าอุปกรณ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ role ไม่มี permission `operation_plan.view` และไม่ใช่ admin ของ BU (ต้องเตรียม role เฉพาะ — บัญชีใน `tests/test-users.ts` ทั้ง 9 ตัวไม่ได้การันตีว่าตัวใดขาดสิทธิ์นี้)
**Steps**
1. เปิด URL `/operation-plan/equipment` ตรง ๆ
**Expected**
เห็นกล่อง `role="alert"` หัวข้อ "Permission Denied" พร้อมบรรทัดให้ติดต่อผู้ดูแลระบบและปุ่ม "Go to an available page"; ไม่มีตารางหรือข้อมูลอุปกรณ์แสดง และ URL ไม่ถูก redirect

---
## TC-EQP-100002 — ผู้ใช้ที่ไม่ได้ล็อกอินถูกเด้งไปหน้า Login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
Browser context ที่ไม่มี token (ยังไม่ได้ล็อกอิน หรือล้าง storage แล้ว)
**Steps**
1. เปิด URL `/operation-plan/equipment` ตรง ๆ
**Expected**
ถูกเด้งไปที่ `/login` แบบ replace และไม่เห็นข้อมูลอุปกรณ์ใด ๆ

---
## TC-EQP-200001 — บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่ที่ `/operation-plan/equipment/new`
**Steps**
1. ปล่อย Code และ Name ว่าง
2. คลิก Create
**Expected**
แสดงข้อความ "Code is required" และ "Name is required" ที่ช่องทั้งสอง; หน้าจอเลื่อนไปยังฟิลด์แรกที่ผิด; ไม่มีอุปกรณ์ถูกสร้างและยังอยู่ที่ `/new`

---
## TC-EQP-200002 — ฟิลด์ Code / Name / Category แสดงเครื่องหมายบังคับ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่ที่ `/operation-plan/equipment/new`
**Steps**
1. ตรวจ label ของ Code, Name และ Category ในส่วน General Information
2. ตรวจ label ของฟิลด์อื่นในส่วนเดียวกัน (Brand, Model, Serial No., Description)
**Expected**
label ของ Code, Name และ Category มีเครื่องหมาย `*` สีแดงต่อท้าย; label ของฟิลด์อื่นไม่มี — ดูหมายเหตุข้อ 1 ประกอบว่า schema บังคับจริงเฉพาะ Code กับ Name

---
## TC-EQP-200003 — ไม่รับจำนวนติดลบในส่วน Quantity & Settings
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Quantity & Settings
**Steps**
1. กรอก Available Qty (หรือ Total Qty / Usage Count / Avg. Usage Time) เป็นค่าติดลบ
2. คลิก Save
**Expected**
แสดงข้อความ "Qty must be at least 0" ที่ช่องนั้น (ข้อความใช้คำกลางว่า Qty ทุกช่อง); ไม่มีการบันทึกและยังอยู่ในโหมด edit

---
## TC-EQP-200004 — ช่อง Code จำกัดความยาว 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่
**Steps**
1. พิมพ์ข้อความยาว 15 ตัวอักษรลงในช่อง Code
**Expected**
ช่องรับเข้าไปแค่ 10 ตัวอักษรแรก (ถูกตัดที่ระดับ input ไม่ใช่ขึ้น error)

---
## TC-EQP-200005 — ช่องข้อความอื่นจำกัดความยาวตามที่ออกแบบ
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างอุปกรณ์ใหม่
**Steps**
1. พิมพ์ข้อความยาวเกิน 100 ตัวอักษรลงในช่อง Name, Brand, Model, Serial No., Station, Capacity, Power Rating
2. พิมพ์ข้อความยาวเกิน 256 ตัวอักษรลงใน Description, Maintenance Schedule, Note และ textarea ในส่วน Instructions
**Expected**
ช่องกลุ่มแรกรับได้สูงสุด 100 ตัวอักษร; textarea กลุ่มหลังรับได้สูงสุด 256 ตัวอักษร — ส่วนเกินถูกตัดทิ้งโดยไม่ขึ้น error

---
## TC-EQP-200006 — อัปโหลดไฟล์ผิดชนิดแล้วขึ้นคำเตือน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างหรือแก้ไขอุปกรณ์; มีไฟล์ที่ไม่ใช่รูป (เช่น `.pdf` หรือ `.gif`)
**Steps**
1. เปิดตัวเลือกไฟล์จากกรอบ Photo แล้วเลือกไฟล์นั้น
**Expected**
ขึ้น toast เตือน "Only JPEG, PNG or WebP images are allowed"; กรอบ Photo ไม่เปลี่ยนเป็นภาพตัวอย่างและไม่มีไฟล์ถูกแนบไปกับฟอร์ม

---
## TC-EQP-200007 — อัปโหลดรูปเกิน 2 MB แล้วขึ้นคำเตือน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างหรือแก้ไขอุปกรณ์; มีไฟล์ JPEG/PNG ขนาดเกิน 2 MB
**Steps**
1. เปิดตัวเลือกไฟล์จากกรอบ Photo แล้วเลือกไฟล์นั้น
**Expected**
ขึ้น toast เตือน "Image is too large (max 2.0 MB)"; ไม่มีภาพตัวอย่างและไม่มีไฟล์ถูกแนบไปกับฟอร์ม

---
## TC-EQP-400001 — กรอกข้อมูลตารางบำรุงรักษาและวันที่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Maintenance
**Steps**
1. เลือก Last Maintenance Date และ Next Maintenance Date จาก date picker
2. กรอก Maintenance Schedule
3. คลิก Save แล้วเปิดอุปกรณ์นั้นซ้ำ
**Expected**
วันที่ทั้งสองและข้อความตารางบำรุงรักษาถูกบันทึกและแสดงค่าเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-400002 — ล้างวันที่บำรุงรักษาด้วยปุ่ม Clear
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ที่มี Last Maintenance Date อยู่แล้ว
**Steps**
1. กดปุ่ม X (aria-label `Clear`) ท้าย date picker ของ Last Maintenance Date
2. คลิก Save แล้วเปิดอุปกรณ์นั้นซ้ำ
**Expected**
ช่องวันที่กลับเป็นข้อความชวน "Pick a date"; หลังบันทึกและเปิดซ้ำ ช่องยังว่างอยู่

---
## TC-EQP-410001 — กรอกคำแนะนำการใช้งาน / ความปลอดภัย / การทำความสะอาด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Instructions
**Steps**
1. กรอก Operation Instructions, Safety Notes และ Cleaning Instructions
2. คลิก Save แล้วเปิดอุปกรณ์นั้นซ้ำ
**Expected**
ข้อความทั้งสามช่องถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-EQP-420001 — toggle Portable และ Active ในส่วน Additional
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Additional
**Steps**
1. สลับสวิตช์ Active
2. สลับสวิตช์ Portable
3. คลิก Save แล้วเปิดอุปกรณ์นั้นซ้ำ
**Expected**
สวิตช์ Active มี badge Active/Inactive กำกับและเปลี่ยนตามค่าที่เลือก ส่วน Portable ไม่มี badge; หลังบันทึก badge สถานะบน toolbar และคอลัมน์ Status ในตารางแสดงค่าที่ถูกต้อง และทั้งสองสวิตช์คงค่าเมื่อเปิดซ้ำ

---
## TC-EQP-420002 — บันทึกหมายเหตุ (Note) ในส่วน Additional
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในโหมด edit ของอุปกรณ์ ที่ส่วน Additional
**Steps**
1. กรอกข้อความลงในช่อง Note
2. คลิก Save แล้วเปิดอุปกรณ์นั้นซ้ำ
**Expected**
ข้อความใน Note ถูกบันทึกและแสดงเดิมเมื่อเปิดซ้ำ
