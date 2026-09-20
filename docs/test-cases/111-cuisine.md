# Cuisine Type — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/cuisine`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Cuisine Type
**Frontend route:** `routes/operation-plan/cuisine`  •  **URL:** `/operation-plan/cuisine` (และ `/operation-plan/cuisine/new`, `/operation-plan/cuisine/:id`)
**Prefix:** `CUIS`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 31

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> สอบทานกับโค้ดจริงเมื่อ 2026-09-20 (แคตตาล็อกเดิมเขียน 2026-06-17 · โมดูลนี้มี 41 คอมมิตหลังจากนั้น) สรุปสิ่งที่เปลี่ยน:
>
> - **ลบ 1 เคส** — `TC-CUIS-200002` (Region เป็นฟิลด์บังคับ) ยืนยันผ่าน UI ไม่ได้: schema มี `region: z.string().min(1, "Region is required")` จริง แต่ `EMPTY_FORM.region = "ASIA"` และ `FieldSelect` ของ region ไม่มีตัวเลือก "ว่าง"/ปุ่มล้างค่า ผู้ใช้จึงทำให้ region ว่างไม่ได้เลย → error นี้ไม่มีทางถูกทริกเกอร์ **ห้ามนำ ID 200002 กลับมาใช้ซ้ำ**
> - **แก้ 9 เคสเดิม** ที่ยืนยันสิ่งที่ตรงข้ามกับโค้ดปัจจุบัน หรือสเต็ปไม่ตรง UI แล้ว จุดใหญ่ ๆ:
>   - **Region ไม่ใช่ badge สีอีกต่อไป** (commit `3174e9df` "คอลัมน์ Region เป็นข้อความล้วน เลิกใช้ badge 6 สี") — `TC-CUIS-010004` เดิม assert badge สี จึงต้องแดงแน่นอน ตอนนี้เป็นข้อความ label ที่แปลแล้ว (`CUISINE_REGION_LABEL_KEY` → `operationPlan.cuisine.regionAsia` ฯลฯ) และใน `CuisineCard` ก็เป็นข้อความเช่นกัน (commit `7cbbc817`)
>   - **สร้าง/แก้ไขเป็นหน้าเต็ม ไม่ใช่ dialog** — `/operation-plan/cuisine/new` และ `/operation-plan/cuisine/:id` (router.tsx:496-508) เปิด `/:id` แล้วฟอร์มเริ่มที่โหมด **view** (`useEntityForm`: `useState(entity ? "view" : "add")`) ต้องกด Edit ก่อนจึงแก้ได้
>   - **เซฟแล้วเด้งกลับหน้า list ทุกกรณี** (`f.backToList()` ทั้ง create และ update) — เคสเดิมที่บอกว่า "ค่าใหม่แสดงในตาราง" ยังถูก แต่สเต็ป "reload หน้า" ที่ตามมาต้องเป็นหน้า list
>   - **Filter ย้ายเข้าปุ่ม Filter** — ไม่มี "Status filter" เปล่า ๆ บน toolbar แล้ว ทั้ง Status และ Region อยู่ในเมนู popover (desktop) / bottom sheet (มือถือ) ของ `ListToolbar` (commits `01edd84d`, `251be8fc`, `c8e990b8`)
>   - **Security เดิมผิดทั้งเคส** — `TC-CUIS-100001` assert ว่า user ที่ไม่มีสิทธิ์เปิด URL แล้วโดนบล็อก แต่ route นี้ **ไม่มี permission guard เลย** มีแค่ `RequireAuth` (ตรวจ token) ครอบ `ProtectedShell` เท่านั้น (router.tsx:9-13, 57) จึงเขียนใหม่เป็นเคส auth-guard ที่ยืนยันได้จริง
> - **เพิ่ม 21 เคสใหม่** ครอบพฤติกรรมที่เพิ่งมี: Region filter, Clear filters, สลับ list/grid, Toggle Columns (Created/Updated ซ่อนโดยค่าเริ่มต้น), sort บนหัวคอลัมน์, ปุ่ม Export/Print ที่ปิดใช้งาน, Activity sheet, not-found state, ปุ่ม Back, Discard dialog (สองชั้น), Cancel คืนค่าเดิม, ลบจากหน้ารายละเอียด, maxLength, Info เป็น JSON, ล้างคำค้น
>
> **Blocker / ข้อควรรู้ก่อนแปลงเป็น spec**
>
> 1. **สิทธิ์ของ role อื่นยังไม่ทราบ** — `constant/module-list.ts:343-347` ผูก entry นี้กับ `PERMISSIONS.operation_plan.view` แต่ใช้แค่กับ **module launcher** (กดแล้วเด้ง permission-denied dialog ผ่าน `dispatchPermissionDenied`, `components/module-landing.tsx:105-125`) ไม่ได้กันที่ route การพิมพ์ URL ตรง ๆ จึงเข้าได้เสมอตราบใดที่ยังมี token · ยังยืนยันไม่ได้ว่า TEST_USERS คนไหนใน `tests/test-users.ts` ถูก deny จึงยังไม่เขียนเคสนั้น — ต้องตรวจสิทธิ์จริงของ BU BLAVG ก่อน
> 2. **ปุ่ม Export / Print ถูก `disabled` ถาวร** พร้อม `title="Coming soon"` (cuisine-component.tsx:155-202) — เขียนเป็นเคสยืนยันว่า "ปุ่มมีอยู่และปิดใช้งาน" ไม่ใช่ "กดแล้วไม่มีอะไรเกิดขึ้น" เมื่อฟีเจอร์มาจริงเคสนี้ต้องถูกเขียนใหม่
> 3. **ช่อง Info เก็บ JSON แบบเงียบ** — `textToObject()` (`lib/form-helpers.ts:78-85`) `JSON.parse` ล้มเหลวแล้ว `return null` ไม่มี error ไม่มี toast ผู้ใช้จะไม่รู้ว่าค่าหาย → **ยังไม่เขียนเป็นเคส** (จะเป็นการล็อกพฤติกรรมที่น่าจะเป็นบั๊ก) บันทึกไว้ตรงนี้ให้ทีมตัดสินใจ เคส `TC-CUIS-200005` ทดสอบเฉพาะ JSON ที่ถูกต้อง
> 4. **doc_version จำเป็นตอน update** — `cuisine-form.tsx:58` ส่ง `doc_version` ของ record ที่โหลดมาไปด้วย (optimistic concurrency) เปิดฟอร์มค้างไว้แล้วมีคนแก้ก่อนจะได้ error จาก backend
> 5. **แถวเปิดด้วยปุ่ม ไม่ใช่ลิงก์** — ชื่อ cuisine ใน DataGrid คือ `<CellAction>` ซึ่ง render เป็น `<button type="button">` (`components/ui/cell-action.tsx`) ไม่มี `<a href>` ให้คลิก
> 6. **ไม่มีปุ่ม Edit ในเมนูแถวของตาราง** — `useCuisineTable` ส่งแต่ `onDelete` เข้า `useConfigTable` เมนู ⋯ จึงมีแค่ Activity กับ Delete (`use-config-table.ts:89`, `columns.tsx:95-135`)
> 7. **ตาราง cuisine ไม่มีคอลัมน์ Code** — schema ไม่มีฟิลด์ code (ถึงแม้ข้อความ `generalInfoDesc` ใน en.json จะยังเขียนว่า "Name and code" ซึ่งเป็นข้อความค้าง)

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CUIS-010001 | แสดงรายการ Cuisine Type | High | Smoke |
| TC-CUIS-010002 | ค้นหา Cuisine ด้วยชื่อ | High | Functional |
| TC-CUIS-010003 | กรองตามสถานะ Active/Inactive | Medium | Functional |
| TC-CUIS-010004 | คอลัมน์ Region แสดงเป็นข้อความที่แปลแล้ว | Low | Functional |
| TC-CUIS-010005 | กรองตาม Region แบบเลือกหลายค่า | Medium | Functional |
| TC-CUIS-010006 | ล้างตัวกรองทั้งหมดด้วยปุ่ม Clear | Medium | Functional |
| TC-CUIS-010007 | สลับมุมมองตาราง ↔ การ์ด | Medium | Functional |
| TC-CUIS-010008 | เปิดคอลัมน์ Created/Updated ที่ซ่อนไว้ | Low | Functional |
| TC-CUIS-010009 | เรียงลำดับด้วยหัวคอลัมน์ Name | Medium | Functional |
| TC-CUIS-010010 | ปุ่ม Export / Print แสดงแบบปิดใช้งาน | Low | Functional |
| TC-CUIS-020001 | เปิดหน้ารายละเอียด Cuisine จาก list | Medium | Happy Path |
| TC-CUIS-020002 | เปิด Activity sheet จากหน้ารายละเอียด | Low | Functional |
| TC-CUIS-020003 | เปิด id ที่ไม่มีอยู่จริงแล้วเจอสถานะไม่พบข้อมูล | Medium | Negative |
| TC-CUIS-020004 | ปุ่ม Back กลับหน้า list | Low | Happy Path |
| TC-CUIS-030001 | สร้าง Cuisine ใหม่สำเร็จ | High | CRUD |
| TC-CUIS-030002 | สร้าง Cuisine พร้อม Popular Dishes / Key Ingredients | Medium | Happy Path |
| TC-CUIS-030003 | กด Cancel ตอนกรอกฟอร์มใหม่ค้างไว้แล้วเจอ Discard dialog | Medium | Alternate Flow |
| TC-CUIS-040001 | แก้ไขชื่อและ Region แล้วค่าคงอยู่ | High | CRUD |
| TC-CUIS-040002 | สลับสถานะ Active เป็น Inactive | Medium | CRUD |
| TC-CUIS-040003 | กด Cancel ในโหมด edit แล้วค่าเดิมกลับคืน | Medium | Alternate Flow |
| TC-CUIS-040004 | ออกจากฟอร์มที่ยังไม่บันทึกผ่านเมนูด้านข้างแล้วถูกดัก | Medium | Alternate Flow |
| TC-CUIS-050001 | ลบ Cuisine จากเมนูแถวในตารางสำเร็จ | High | CRUD |
| TC-CUIS-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-CUIS-050003 | ลบ Cuisine จากปุ่ม Delete ในหน้ารายละเอียด | Medium | CRUD |
| TC-CUIS-100001 | เข้าหน้า Cuisine โดยไม่มี session แล้วถูกส่งไป /login | High | Auth-guard |
| TC-CUIS-200001 | บันทึกไม่ได้เมื่อเว้น Name ว่าง | High | Validation |
| TC-CUIS-200003 | ช่อง Name รับได้ไม่เกิน 100 ตัวอักษร | Medium | Validation |
| TC-CUIS-200004 | ช่อง Description รับได้ไม่เกิน 256 ตัวอักษร | Low | Validation |
| TC-CUIS-200005 | กรอก Info เป็น JSON ที่ถูกต้องแล้วค่ากลับมาแสดง | Low | Validation |
| TC-CUIS-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |
| TC-CUIS-900002 | ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ | Low | Edge Case |

---
## TC-CUIS-010001 — แสดงรายการ Cuisine Type
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/cuisine`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวหน้าแสดงชื่อ "Cuisine Type" พร้อมคำอธิบาย "The kitchen a recipe comes from — Thai, Italian, Japanese." และ Badge จำนวนรายการ (แสดงเฉพาะเมื่อจำนวน > 0); ตารางมีคอลัมน์ checkbox, ลำดับ, Name, Region, Status และเมนู ⋯ ท้ายแถว โดย Created/Updated ถูกซ่อนไว้ตามค่าเริ่มต้น; ปุ่ม "Add Cuisine Type" แสดงอยู่มุมขวาบน

---
## TC-CUIS-010002 — ค้นหา Cuisine ด้วยชื่อ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มี cuisine หลายรายการที่ชื่อไม่ซ้ำกัน
**Steps**
1. คลิกที่ช่อง Search (placeholder "Search...")
2. พิมพ์ชื่อ cuisine ที่มีอยู่
3. กด Enter
**Expected**
ตารางแสดงเฉพาะ cuisine ที่ตรงกับคำค้น และ URL มีพารามิเตอร์ `search` ตามคำที่พิมพ์
**Note**
`SearchInput` ยิง `onSearch` เมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น — พิมพ์เฉย ๆ ไม่ค้นให้

---
## TC-CUIS-010003 — กรองตามสถานะ Active/Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มี cuisine ทั้งสถานะ active และ inactive
**Steps**
1. กดปุ่ม "Filter" บนแถบเครื่องมือ
2. เลือกแถว "Status" ในกลุ่ม Document แล้วเลือก "Inactive"
**Expected**
ตารางแสดงเฉพาะแถวที่คอลัมน์ Status เป็น Inactive; ปุ่ม Filter ขึ้น badge จำนวนตัวกรองที่ใช้อยู่ และแถบ chip ใต้ toolbar แสดง chip ของ Status

---
## TC-CUIS-010004 — คอลัมน์ Region แสดงเป็นข้อความที่แปลแล้ว
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี cuisine ที่ระบุ region ไว้ (เช่น ASIA, EUROPE)
**Steps**
1. เปิดหน้า `/operation-plan/cuisine`
2. อ่านค่าในคอลัมน์ Region ของแถวที่ทราบ region
**Expected**
เซลล์แสดงเป็นข้อความ label ที่แปลแล้ว ("Asia" / "Europe" / "Americas" / "Africa" / "Middle East" / "Oceania") ไม่ใช่ badge สี และไม่ใช่ค่าดิบอย่าง `MIDDLE_EAST`

---
## TC-CUIS-010005 — กรองตาม Region แบบเลือกหลายค่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มี cuisine อย่างน้อย 2 region ที่ต่างกัน
**Steps**
1. กดปุ่ม "Filter"
2. เลือกแถว "Region" ในกลุ่ม Category
3. ติ๊กเลือก 2 region (เช่น Asia และ Europe)
**Expected**
ตารางแสดงเฉพาะ cuisine ที่ region ตรงกับค่าใดค่าหนึ่งที่เลือก; แถบ chip แสดง chip ของ Region พร้อมค่าย่อที่เลือกไว้

---
## TC-CUIS-010006 — ล้างตัวกรองทั้งหมดด้วยปุ่ม Clear
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine` และมีตัวกรองเปิดอยู่อย่างน้อย 1 ตัว (เช่นทำ TC-CUIS-010003 มาก่อน)
**Steps**
1. กดปุ่ม "Clear" บนแถบ chip ของตัวกรอง
**Expected**
chip ทุกตัวหายไป, badge จำนวนบนปุ่ม Filter หายไป และตารางกลับมาแสดงรายการทั้งหมดเท่ากับจำนวนใน Badge ที่หัวหน้า

---
## TC-CUIS-010007 — สลับมุมมองตาราง ↔ การ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine` บนจอขนาด desktop; มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่มไอคอน "Grid view" ที่มุมขวาของแถบเครื่องมือ
2. สังเกตเนื้อหาที่แสดง
3. กดปุ่มไอคอน "List view" เพื่อกลับ
**Expected**
โหมด grid แสดงการ์ดเรียงเป็นตาราง 1-3 คอลัมน์ตามความกว้างจอ แต่ละการ์ดมีชื่อ cuisine, แถวสถานะ Active/Inactive, แถว Region และแถว Description (เมื่อมีค่า); กดกลับ List view แล้วกลับมาเป็น DataGrid เหมือนเดิม

---
## TC-CUIS-010008 — เปิดคอลัมน์ Created/Updated ที่ซ่อนไว้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine` บนจอขนาด desktop
**Steps**
1. กดปุ่มไอคอน "Toggle columns" บนแถบเครื่องมือ
2. ติ๊กเปิดคอลัมน์ "Created" และ "Updated"
**Expected**
ตารางเพิ่มคอลัมน์ Created และ Updated ที่แสดงวันเวลาตามรูปแบบใน profile ของผู้ใช้ และเครื่องหมายถูกในเมนูอัปเดตตามที่ติ๊ก

---
## TC-CUIS-010009 — เรียงลำดับด้วยหัวคอลัมน์ Name
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มี cuisine อย่างน้อย 2 รายการ
**Steps**
1. คลิกหัวคอลัมน์ "Name"
2. คลิกหัวคอลัมน์ "Name" ซ้ำอีกครั้ง
**Expected**
คลิกแรก URL มีพารามิเตอร์ `sort=name:asc` และหัวคอลัมน์แสดงลูกศรขึ้น; คลิกที่สองเปลี่ยนเป็น `sort=name:desc` พร้อมลูกศรลง และลำดับแถวกลับด้าน
**Note**
หน้านี้ไม่ได้กำหนด `defaultSort` จึงเริ่มต้นโดยไม่มีพารามิเตอร์ sort ใน URL

---
## TC-CUIS-010010 — ปุ่ม Export / Print แสดงแบบปิดใช้งาน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine` บนจอขนาด desktop
**Steps**
1. สังเกตปุ่มฝั่งขวาของหัวหน้า list
**Expected**
ปุ่ม "Export" และ "Print" ปรากฏอยู่ในสถานะ disabled พร้อม `title="Coming soon"`; ปุ่ม "Add Cuisine Type" ข้าง ๆ กดได้ตามปกติ

---
## TC-CUIS-020001 — เปิดหน้ารายละเอียด Cuisine จาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`; มี cuisine อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ชื่อ cuisine ในคอลัมน์ Name (เป็นปุ่ม ไม่ใช่ลิงก์)
**Expected**
นำทางไปที่ `/operation-plan/cuisine/{id}`; หัวฟอร์มแสดงชื่อ cuisine พร้อมป้ายสถานะ Active/Inactive; ทุกช่องกรอกอยู่ในสถานะ disabled และ toolbar แสดงปุ่ม "Activity" กับ "Edit" (ยังไม่มี Save/Cancel/Delete จนกว่าจะกด Edit)

---
## TC-CUIS-020002 — เปิด Activity sheet จากหน้ารายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/{id}` ของ cuisine ที่บันทึกไว้แล้ว
**Steps**
1. กดปุ่ม "Activity" บน toolbar ของฟอร์ม
**Expected**
Activity sheet เปิดขึ้นโดยอ้างอิงชื่อ cuisine ที่กำลังเปิดอยู่; ปิด sheet แล้วกลับมาที่ฟอร์มในโหมดเดิมโดยไม่มีการเปลี่ยนแปลงข้อมูล
**Note**
เมนู "Activity" มีให้ที่เมนู ⋯ ท้ายแถวของตารางด้วย (`useCuisineTable` ส่ง `activity: { id, label: name }`)

---
## TC-CUIS-020003 — เปิด id ที่ไม่มีอยู่จริงแล้วเจอสถานะไม่พบข้อมูล
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/operation-plan/cuisine/00000000-0000-0000-0000-000000000000` โดยตรง
2. รอให้ skeleton ของฟอร์มหายไป
**Expected**
แสดงสถานะ error พร้อมข้อความ "Cuisine not found" และปุ่มย้อนกลับที่พาไป `/operation-plan/cuisine` (ไม่แสดงฟอร์มเปล่าและไม่ค้างที่ skeleton)

---
## TC-CUIS-020004 — ปุ่ม Back กลับหน้า list
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/{id}` ในโหมด view โดยยังไม่ได้แก้อะไร
**Steps**
1. กดปุ่มย้อนกลับ (aria-label "Go back") ที่หัวฟอร์ม
**Expected**
กลับไปที่ `/operation-plan/cuisine` ในครั้งเดียว โดยไม่มี dialog ถามยืนยัน
**Note**
ปุ่มนี้ navigate ไป list path ตรง ๆ ไม่ใช่ `history.back()` (commit `77002718`) — เปิด `/:id` จาก URL ตรง ๆ ก็ยังกลับมาที่ list ได้

---
## TC-CUIS-030001 — สร้าง Cuisine ใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/operation-plan/cuisine`
**Steps**
1. กดปุ่ม "Add Cuisine Type"
2. ยืนยันว่า URL เป็น `/operation-plan/cuisine/new` และหัวฟอร์มเขียนว่า "Add Cuisine Type"
3. กรอก Name ด้วยค่าที่ไม่ซ้ำ
4. ตรวจว่า Region ตั้งไว้เป็น "Asia" ตามค่าเริ่มต้น แล้วเปลี่ยนเป็น region อื่นหากต้องการ
5. กดปุ่ม "Create"
**Expected**
แสดง toast "Cuisine Type created successfully"; ระบบพากลับไปที่ `/operation-plan/cuisine` และ cuisine ใหม่ปรากฏในตารางพร้อมสถานะ Active

---
## TC-CUIS-030002 — สร้าง Cuisine พร้อม Popular Dishes / Key Ingredients
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. กรอก Name ด้วยค่าที่ไม่ซ้ำ และเลือก Region
2. ในส่วน "Cuisine Details" กรอก Popular Dishes หลายรายการโดยขึ้นบรรทัดใหม่คั่นแต่ละรายการ
3. กรอก Key Ingredients ในรูปแบบเดียวกัน
4. กดปุ่ม "Create"
5. เปิด cuisine ที่เพิ่งสร้างจากตาราง
**Expected**
สร้างสำเร็จพร้อม toast; เปิดกลับมาแล้วช่อง Popular Dishes และ Key Ingredients แสดงรายการเดิมครบ บรรทัดละรายการ (บรรทัดว่างและช่องว่างหัวท้ายถูกตัดทิ้ง)

---
## TC-CUIS-030003 — กด Cancel ตอนกรอกฟอร์มใหม่ค้างไว้แล้วเจอ Discard dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. กรอก Name ลงไปบางส่วน
2. กดปุ่ม "Cancel"
3. ใน dialog กด "Keep editing"
4. กดปุ่ม "Cancel" อีกครั้งแล้วกด "Discard"
**Expected**
ขั้นที่ 2 แสดง dialog หัวข้อ "Discard changes?" พร้อมข้อความ "You have unsaved changes that will be lost."; กด Keep editing แล้วยังอยู่ที่ฟอร์มพร้อมค่าที่พิมพ์ไว้; กด Discard แล้วกลับไปที่ `/operation-plan/cuisine` โดยไม่มีรายการใหม่ถูกสร้าง

---
## TC-CUIS-040001 — แก้ไขชื่อและ Region แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่สร้างไว้แล้ว (เช่นจาก TC-CUIS-030001)
**Steps**
1. เปิด cuisine จากตารางแล้วกดปุ่ม "Edit"
2. แก้ Name และเปลี่ยน Region เป็นค่าอื่น
3. กดปุ่ม "Save"
4. reload หน้า list แล้วเปิด cuisine นั้นอีกครั้ง
**Expected**
แสดง toast "Cuisine Type updated successfully" และกลับไปที่ `/operation-plan/cuisine`; ชื่อและ Region ใหม่แสดงในตาราง และยังคงอยู่หลัง reload
**Note**
payload ของ update แนบ `doc_version` ของ record ที่โหลดมาด้วย — ถ้าเปิดฟอร์มค้างไว้นานแล้วมีคนอื่นแก้ก่อน backend จะปฏิเสธ

---
## TC-CUIS-040002 — สลับสถานะ Active เป็น Inactive
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่สถานะ Active อยู่
**Steps**
1. เปิด cuisine แล้วกดปุ่ม "Edit"
2. ในส่วน "Additional" ปิดสวิตช์ "Active"
3. กดปุ่ม "Save"
4. กลับมาที่ list แล้วกรองด้วย Status = Inactive
**Expected**
ป้ายใต้สวิตช์เปลี่ยนเป็น "Inactive" ทันทีที่ปิดสวิตช์; หลัง Save แสดง toast อัปเดตสำเร็จ และ cuisine ปรากฏในผลการกรอง Inactive พร้อม Status badge เป็น Inactive

---
## TC-CUIS-040003 — กด Cancel ในโหมด edit แล้วค่าเดิมกลับคืน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/{id}` ของ cuisine ที่มีชื่อเดิมที่ทราบค่า
**Steps**
1. กดปุ่ม "Edit"
2. แก้ค่าในช่อง Name เป็นข้อความอื่น
3. กดปุ่ม "Cancel" แล้วกด "Discard" ใน dialog
**Expected**
ฟอร์มกลับมาเป็นโหมด view (ช่องกรอก disabled, toolbar แสดง Edit อีกครั้ง) โดยยังอยู่ที่ URL เดิม และช่อง Name **บนหน้าจอ** แสดงค่าเดิมก่อนแก้ ไม่ใช่ข้อความที่เพิ่งยกเลิกไป

---
## TC-CUIS-040004 — ออกจากฟอร์มที่ยังไม่บันทึกผ่านเมนูด้านข้างแล้วถูกดัก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/{id}` ในโหมด edit และแก้ค่าไปแล้วอย่างน้อย 1 ช่อง
**Steps**
1. คลิกเมนูอื่นในแถบนำทางด้านข้าง (ไม่ใช่ปุ่มในฟอร์ม)
2. ใน dialog กด "Keep editing"
3. คลิกเมนูเดิมอีกครั้งแล้วกด "Discard"
**Expected**
ขั้นที่ 1 ถูกดักด้วย dialog "Discard changes?" และยังไม่เปลี่ยนหน้า; Keep editing แล้วยังอยู่ที่ฟอร์มพร้อมค่าที่แก้; Discard แล้วจึงไปยังหน้าปลายทางที่กด โดยไม่มีการบันทึก

---
## TC-CUIS-050001 — ลบ Cuisine จากเมนูแถวในตารางสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่ลบได้ (สร้างขึ้นเพื่อทดสอบ) อยู่ในตาราง
**Steps**
1. กดปุ่มเมนู ⋯ (aria-label "Row actions") ที่ท้ายแถวของ cuisine นั้น
2. เลือก "Delete"
3. ใน dialog ยืนยันด้วยปุ่ม "Delete"
4. reload หน้า
**Expected**
dialog มีหัวข้อ "Delete Cuisine Type" และข้อความยืนยันที่ระบุชื่อ cuisine; หลังยืนยันแสดง toast "Cuisine Type deleted successfully"; แถวหายไปจากตารางและไม่กลับมาหลัง reload
**Note**
เมนู ⋯ ของแถวมีเฉพาะ "Activity" และ "Delete" — ไม่มีเมนู Edit (เปิดรายละเอียดด้วยการคลิกชื่อแทน)

---
## TC-CUIS-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มี cuisine อย่างน้อย 1 รายการในตาราง
**Steps**
1. กดเมนู ⋯ ท้ายแถวแล้วเลือก "Delete"
2. ใน dialog กดปุ่ม "Cancel"
**Expected**
Dialog ปิดลงโดยไม่มี request ลบ; cuisine ยังคงอยู่ในตารางและจำนวนใน Badge ที่หัวหน้าไม่เปลี่ยน

---
## TC-CUIS-050003 — ลบ Cuisine จากปุ่ม Delete ในหน้ารายละเอียด
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มี cuisine ที่ลบได้ และเปิดอยู่ที่ `/operation-plan/cuisine/{id}`
**Steps**
1. กดปุ่ม "Edit" เพื่อเข้าโหมด edit
2. กดปุ่ม "Delete" สีแดงบน toolbar
3. ใน dialog ยืนยันด้วยปุ่ม "Delete"
**Expected**
ปุ่ม Delete แสดงเฉพาะในโหมด edit ของ record ที่บันทึกแล้ว (ไม่มีในโหมด view และไม่มีที่ `/new`); หลังยืนยันแสดง toast ลบสำเร็จ และระบบพากลับไปที่ `/operation-plan/cuisine` โดยไม่มี cuisine นั้นในรายการ

---
## TC-CUIS-100001 — เข้าหน้า Cuisine โดยไม่มี session แล้วถูกส่งไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
เบราว์เซอร์ไม่มี session ที่ล็อกอินอยู่ (context ใหม่ หรือหลังออกจากระบบ)
**Steps**
1. ไปที่ `/operation-plan/cuisine` โดยตรง
**Expected**
ถูก redirect ไปที่ `/login` (แบบ replace) และไม่เห็นข้อมูล cuisine ใด ๆ; ทำเช่นเดียวกันกับ `/operation-plan/cuisine/new` และ `/operation-plan/cuisine/{id}` ได้ผลเหมือนกัน
**Note**
route ชุดนี้ป้องกันด้วย `RequireAuth` (ตรวจ token) เท่านั้น — **ไม่มี** permission guard ที่ระดับ route ดูข้อ 1 ในหมายเหตุด้านบนก่อนเขียนเคสสิทธิ์รายบทบาท

---
## TC-CUIS-200001 — บันทึกไม่ได้เมื่อเว้น Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. ปล่อยช่อง Name ว่างไว้
2. กดปุ่ม "Create"
**Expected**
ช่อง Name แสดงข้อความ error "Name is required" และถูก scroll/focus ให้เห็น; ไม่มี cuisine ถูกสร้าง และยังอยู่ที่ `/operation-plan/cuisine/new`

---
## TC-CUIS-200003 — ช่อง Name รับได้ไม่เกิน 100 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. วาง/พิมพ์ข้อความยาว 120 ตัวอักษรลงในช่อง Name
2. อ่านค่าที่อยู่ในช่องจริง
**Expected**
ช่อง Name เก็บได้สูงสุด 100 ตัวอักษร (ส่วนเกินไม่ถูกรับเข้าช่อง) ตาม `maxLength` ของ input

---
## TC-CUIS-200004 — ช่อง Description รับได้ไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. วาง/พิมพ์ข้อความยาว 300 ตัวอักษรลงในช่อง Description
2. อ่านค่าที่อยู่ในช่องจริง
**Expected**
ช่อง Description เก็บได้สูงสุด 256 ตัวอักษร; ช่อง Popular Dishes / Key Ingredients / Info / Dimension / Note ใช้ข้อจำกัดเดียวกันคือ 256 ตัวอักษร

---
## TC-CUIS-200005 — กรอก Info เป็น JSON ที่ถูกต้องแล้วค่ากลับมาแสดง
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/cuisine/new`
**Steps**
1. กรอก Name ด้วยค่าที่ไม่ซ้ำ
2. ในช่อง Info กรอก JSON object ที่ถูกต้อง เช่น `{"spice":"high"}`
3. กดปุ่ม "Create"
4. เปิด cuisine ที่เพิ่งสร้างขึ้นมาอีกครั้ง
**Expected**
สร้างสำเร็จ และเมื่อเปิดกลับมา ช่อง Info แสดง JSON เดิมในรูปแบบที่จัดย่อหน้าแล้ว (indent 2 ช่อง)
**Note**
ถ้ากรอกข้อความที่ไม่ใช่ JSON ที่ถูกต้อง ระบบจะบันทึกเป็น `null` แบบเงียบ ๆ โดยไม่เตือน — ดูข้อ 3 ในหมายเหตุด้านบน ยังไม่เขียนเป็นเคสจนกว่าทีมจะตัดสินใจว่าเป็นพฤติกรรมที่ตั้งใจหรือไม่

---
## TC-CUIS-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine`
**Steps**
1. พิมพ์คำค้นที่ไม่ตรงกับ cuisine ใดเลย (เช่นสตริงสุ่ม)
2. กด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดงสถานะว่างพร้อมภาพประกอบและข้อความ "No data found"

---
## TC-CUIS-900002 — ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/cuisine` และค้นหาไว้แล้ว (เช่นต่อจาก TC-CUIS-900001)
**Steps**
1. กดปุ่ม X (aria-label "Clear search") ท้ายช่องค้นหา
**Expected**
ช่องค้นหาว่าง, ไอคอนกลับเป็นแว่นขยาย, พารามิเตอร์ `search` หายไปจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ
