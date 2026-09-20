# Recipe — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/recipe`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Recipe
**Frontend route:** `routes/operation-plan/recipe`  •  **URL:** `/operation-plan/recipe` (และ `/operation-plan/recipe/new`, `/operation-plan/recipe/:id`)
**Prefix:** `RCP`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 59

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> แคตตาล็อกนี้สอบทานใหม่ทั้งฉบับกับโค้ดปัจจุบัน (frontend มี 46 คอมมิตในโมดูลนี้ตั้งแต่ 2026-06-17) ข้อเท็จจริงที่เปลี่ยนไปและมีผลกับการเขียนเทส:
>
> 1. **ตาราง Ingredients ยังไม่ถูกบันทึก** — `ingredients` เก็บใน `useState` ของ `recipe-form.tsx` และ **ไม่อยู่ใน** `buildRecipePayload()` ตัวแอปเองแปะป้าย `warning` ไว้เหนือตารางว่า _"Preview only — ingredients are not yet persisted with the recipe."_ และแถวสรุปชื่อ _"Ingredient lines (preview)"_ เคสในบล็อก 40 จึง assert เฉพาะพฤติกรรม UI (เพิ่ม/แก้/ลบแถว + ผลรวม preview) **ห้ามเขียนเคสที่คาดหวังว่าวัตถุดิบจะยังอยู่หลัง reload**
> 2. **ผลรวมวัตถุดิบ ≠ Total recipe cost** — `total_ingredient_cost` เป็น **ช่องกรอกมือ** ใน section Cost Breakdown ไม่ได้รับค่าจากตาราง Ingredients เลย TC-RCP-400004 เดิมที่เขียนว่า "คำนวณ Total Recipe Cost จากวัตถุดิบ" จึงถูกเขียนใหม่ให้ตรงของจริง
> 3. **stepper +/− ของ Prep / Cook Time และ Base Yield ถูกถอดออกแล้ว** (คอมมิต `e56e04c4`) ตอนนี้เป็น `<input type="number">` ธรรมดาจัดชิดขวา — TC-RCP-410001 เขียนใหม่ตามนี้
> 4. **ไม่มี "คอนโซลต้นทุน sticky" แล้ว** — ฟอร์มถูก redesign เป็นหน้าเดียว flatten (คอมมิต `c8d1f29e`) ส่วนต้นทุนแตกเป็น 4 section ต่อกัน: `Cost & price` → `Cost Breakdown` → `Margins` → `Other metrics` — TC-RCP-420001 เขียนใหม่และเพิ่ม 420002–420005 ให้ครอบ
> 5. **กด Save/Create สำเร็จแล้วเด้งกลับหน้า list เสมอ** (`f.backToList()`) ไม่ได้อยู่หน้าเดิม — เคสที่ต้องยืนยันค่าที่บันทึกต้องเปิดสูตรนั้นซ้ำ
> 6. **ลบได้ 3 ทาง**: ปุ่ม Delete ใน toolbar โหมดแก้ไข · เมนูจุดไข่ปลาท้ายแถวในตาราง · ปุ่มถังขยะท้ายการ์ดในโหมด grid — ทั้งสามเปิด `DeleteDialog` ตัวเดียวกัน (050001/050003/050004)
> 7. **คอลัมน์ Status ในตารางคือ `is_active` (Active/Inactive)** ไม่ใช่ `status` ของสูตร (DRAFT/PUBLISHED/ARCHIVED) ซึ่งมีอยู่เฉพาะใน toolbar ของฟอร์ม — และ **ไม่มีตัวกรองสำหรับ DRAFT/PUBLISHED/ARCHIVED** ในหน้า list
> 8. **ตัวกรองบน desktop เป็น popover menu สองชั้นแบบ Linear** (hover แถว field แล้ว submenu เด้ง) ไม่ใช่ sheet ฝั่งขวาแบบเดิม · มือถือยังเป็น bottom sheet · chip ใน ActiveFilterBar กดแก้ค่าได้เลย
> 9. **เมนูท้ายแถวมีแค่ Delete** — `useRecipeTable` ส่งเฉพาะ `onDelete` ไม่ได้ส่ง `onEdit` และไม่ได้เปิดเมนู Activity (recipe ไม่อยู่ใน activity registry) · ตารางมีคอลัมน์ checkbox เลือกแถวแต่ **ไม่มี UI bulk action**
> 10. **การคุมสิทธิ์อยู่ที่ `RouteGuard` ระดับ root-layout** (`routes/root-layout.tsx`) ซึ่งหา leaf จาก `constant/module-list.ts` — license `operation_plan.recipe` มาก่อน permission `operation_plan.view` เมื่อถูกปฏิเสธจะเห็น **กล่อง AccessDeniedBlock** (`role="alert"`) ไม่ใช่การ redirect · ส่วนคนที่ไม่มี token จะถูก `RequireAuth` เด้งไป `/login`
> 11. **ปุ่ม Export / Print มีอยู่แต่ `disabled` ถาวร** พร้อม `title="Coming soon"` (บนมือถืออยู่ในเมนู "…") — ทุกเคสที่แตะปุ่มนี้ assert ว่าปุ่มปรากฏและถูกปิด ไม่ใช่ว่าใช้งานได้
> 12. **create/update ยิงเป็น multipart FormData** (`data` + `gallery` + `images`) และ update แนบ `doc_version` เพื่อ optimistic concurrency — ถ้า backend ตอบ 400 เรื่อง `doc_version` ให้ถือเป็นบั๊กฝั่งแอป ไม่ใช่เทสผิด
> 13. **ไม่มีเคสใดถูกลบ** — 28 เคสเดิมยังตรวจของที่มีอยู่จริงทั้งหมด มี 3 เคสที่ถูกเขียนใหม่ (400004 / 410001 / 420001) และเพิ่มใหม่ 31 เคส
> 14. **section ที่ลงทะเบียนให้ `RCP` คือ 01–05, 10, 20, 40–44** — ไม่มี 90 (edge case) เคส "เปิดสูตรที่ไม่มีอยู่จริง" จึงถูกจัดไว้ที่ 02 (detail/view) แทน ถ้าจะแยก 90 ต้องลงทะเบียนใน `docs/test-id-scheme.md` ก่อน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RCP-010001 | แสดงรายการสูตรอาหาร | High | Smoke |
| TC-RCP-010002 | ค้นหาสูตรอาหารด้วยชื่อ/รหัส | High | Functional |
| TC-RCP-010003 | กรองตาม Cuisine | Medium | Functional |
| TC-RCP-010004 | กรองตาม Category | Medium | Functional |
| TC-RCP-010005 | กรองตาม Difficulty | Medium | Functional |
| TC-RCP-010006 | สลับมุมมอง List / Grid | Low | Functional |
| TC-RCP-010007 | แสดง Difficulty badge ในตาราง | Low | Functional |
| TC-RCP-010008 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-RCP-010009 | แก้ค่าตัวกรองจาก chip และล้างทั้งหมด | Low | Functional |
| TC-RCP-010010 | เรียงลำดับผ่านเมนู Sort บน toolbar | Medium | Functional |
| TC-RCP-010011 | เปิดคอลัมน์ Created / Updated ที่ซ่อนอยู่ | Low | Functional |
| TC-RCP-010012 | บันทึกมุมมอง (Saved View) จากตัวกรองปัจจุบัน | Medium | Functional |
| TC-RCP-010013 | ปุ่ม Export / Print ปรากฏแต่ถูกปิดใช้งาน | Low | Functional |
| TC-RCP-020001 | เปิดหน้าสูตรอาหารจาก list (โหมด view) | Medium | Happy Path |
| TC-RCP-020002 | โหมด view ล็อกทุกฟิลด์ไม่ให้แก้ไข | Medium | Functional |
| TC-RCP-020003 | กด Back จากโหมด view กลับ list ทันที | Low | Alternate Flow |
| TC-RCP-020004 | เปิดสูตรที่ไม่มีอยู่จริงแล้วเจอ Recipe not found | Medium | Edge Case |
| TC-RCP-030001 | สร้างสูตรอาหารใหม่สำเร็จ (ฟิลด์บังคับครบ) | High | CRUD |
| TC-RCP-030002 | ยกเลิกการสร้างเมื่อมีการแก้ไขค้าง (Discard) | Medium | Alternate Flow |
| TC-RCP-030003 | โหมดสร้างไม่มีปุ่ม Delete | Low | Functional |
| TC-RCP-030004 | เตือนเมื่อออกจากฟอร์มผ่านเมนูข้างขณะยังไม่บันทึก | Medium | Alternate Flow |
| TC-RCP-040001 | แก้ไขข้อมูลสูตรอาหารแล้วค่าคงอยู่ | High | CRUD |
| TC-RCP-040002 | เปลี่ยนสถานะสูตร DRAFT → PUBLISHED | Medium | CRUD |
| TC-RCP-040003 | กด Cancel ในโหมดแก้ไขคืนค่าเดิมและกลับสู่โหมด view | Medium | Alternate Flow |
| TC-RCP-040004 | สลับสถานะ Active / Inactive จากปุ่มใน hero | Medium | CRUD |
| TC-RCP-050001 | ลบสูตรอาหารจากหน้าแก้ไขสำเร็จ | High | CRUD |
| TC-RCP-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-RCP-050003 | ลบสูตรอาหารจากเมนูท้ายแถวในตาราง | High | CRUD |
| TC-RCP-050004 | ลบสูตรอาหารจากการ์ดในโหมด grid | Medium | CRUD |
| TC-RCP-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าสูตรอาหาร | High | Authorization |
| TC-RCP-100002 | เข้า URL สูตรอาหารโดยไม่ได้ล็อกอิน | High | Auth-guard |
| TC-RCP-100003 | BU ที่ไม่มี license ของโมดูลสูตรอาหารถูกบล็อก | Medium | Authorization |
| TC-RCP-200001 | บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับ | High | Validation |
| TC-RCP-200002 | บังคับเลือก Cuisine, Category และ Yield Unit | High | Validation |
| TC-RCP-200003 | เลื่อนไปยังฟิลด์ที่ผิดพลาดเมื่อ submit ไม่ผ่าน | Medium | Validation |
| TC-RCP-200004 | Code รับได้ไม่เกิน 10 ตัวอักษร | Medium | Validation |
| TC-RCP-200005 | Name รับได้ไม่เกิน 100 ตัวอักษรพร้อมตัวนับ | Medium | Validation |
| TC-RCP-200006 | Description และ Internal Note รับได้ไม่เกิน 256 ตัวอักษร | Low | Validation |
| TC-RCP-400001 | เพิ่มวัตถุดิบ (ingredient) ในตาราง | High | Functional |
| TC-RCP-400002 | แก้ไขปริมาณ/หน่วย/ต้นทุนของวัตถุดิบ | High | Functional |
| TC-RCP-400003 | ลบแถววัตถุดิบ | Medium | Functional |
| TC-RCP-400004 | ผลรวมแถววัตถุดิบ (preview) เท่ากับผลรวม Cost ทุกแถว | High | Functional |
| TC-RCP-400005 | เตือนเมื่อ Yield % ต่ำกว่า 90 | Low | Edge Case |
| TC-RCP-400006 | แสดงป้าย "Preview only" เหนือตารางวัตถุดิบ | Medium | Functional |
| TC-RCP-400007 | สถานะว่างของตารางวัตถุดิบพร้อมปุ่ม Add first ingredient | Low | Functional |
| TC-RCP-410001 | กรอก Prep / Cook Time และ Base Yield แล้ว Quick Stats อัปเดต | Medium | Functional |
| TC-RCP-410002 | เลือก Yield Unit จาก lookup และสร้างหน่วยใหม่แบบ inline | Medium | Functional |
| TC-RCP-420001 | คำนวณ Cost per Portion จากต้นทุนรวมหาร Base Yield | High | Functional |
| TC-RCP-420002 | คำนวณ Gross Margin และ Food Cost % เทียบเป้าหมาย | High | Functional |
| TC-RCP-420003 | แสดงราคาที่แนะนำจาก Target Food Cost % | Medium | Functional |
| TC-RCP-420004 | แถบสัดส่วนต้นทุนและ Total recipe cost ใน Cost Breakdown | Medium | Functional |
| TC-RCP-420005 | Other metrics — Labor / Overhead ratio และ Carbon Footprint | Low | Functional |
| TC-RCP-430001 | เลือกสารก่อภูมิแพ้มาตรฐานและกรอกแบบกำหนดเอง | Medium | Functional |
| TC-RCP-430002 | สลับ Tag และ toggle Deduct from stock | Low | Functional |
| TC-RCP-440001 | อัปโหลดรูปภาพในแกลเลอรีสูตรอาหาร | Medium | Functional |
| TC-RCP-440002 | ตั้งรูป hero และเรียงลำดับรูปในแกลเลอรี | Medium | Functional |
| TC-RCP-440003 | ลบรูปออกจากแกลเลอรี | Medium | Functional |
| TC-RCP-440004 | ปฏิเสธไฟล์ผิดชนิดหรือใหญ่เกิน 2 MB | Medium | Validation |
| TC-RCP-440005 | จำกัดจำนวนรูปไม่เกิน 10 รูปต่อสูตร | Low | Edge Case |

---
## TC-RCP-010001 — แสดงรายการสูตรอาหาร
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสูตรอาหารอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/recipe`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวหน้าแสดงชื่อ "Recipe" พร้อม badge จำนวนรายการและคำอธิบายใต้หัว; ตารางแสดงคอลัมน์ checkbox เลือกแถว, `#`, Code, Name, Cuisine, Category, Difficulty (badge), Status (Active/Inactive) และเมนูจุดไข่ปลาท้ายแถว; คอลัมน์ Created/Updated ถูกซ่อนเป็นค่าตั้งต้น

---
## TC-RCP-010002 — ค้นหาสูตรอาหารด้วยชื่อ/รหัส
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe`; มีหลายสูตร
**Steps**
1. คลิกที่ช่อง Search บน toolbar
2. พิมพ์ชื่อหรือรหัสของสูตรที่มีอยู่
3. กด Enter (หรือคลิกไอคอนแว่นขยายท้ายช่อง)
**Expected**
ตารางแสดงเฉพาะสูตรที่ตรงกับคำค้น; ไอคอนท้ายช่องเปลี่ยนเป็น X สำหรับล้างคำค้น — การพิมพ์อย่างเดียวยังไม่ยิงค้นหา ต้องกด Enter หรือปุ่มเท่านั้น

---
## TC-RCP-010003 — กรองตาม Cuisine
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop; มีสูตรที่กำหนด cuisine หลากหลาย และ cuisine นั้น active
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลื่อนเมาส์ไปที่แถว Cuisine (อยู่ในกลุ่มหมวดหมู่) ให้ submenu เด้งออกมา
3. เลือก cuisine หนึ่งรายการจากรายการ multi-select
**Expected**
ตารางแสดงเฉพาะสูตรใน cuisine ที่เลือก และมี chip ของตัวกรองปรากฏในแถบ Active filter ใต้ toolbar

---
## TC-RCP-010004 — กรองตาม Category
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop; มีสูตรที่กำหนด recipe category หลากหลาย และ category นั้น active
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลื่อนเมาส์ไปที่แถว Category ให้ submenu เด้งออกมา
3. เลือก category หนึ่งรายการ
**Expected**
ตารางแสดงเฉพาะสูตรในหมวดหมู่ที่เลือก และมี chip ของตัวกรองปรากฏในแถบ Active filter

---
## TC-RCP-010005 — กรองตาม Difficulty
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe`; มีสูตรที่มีระดับความยาก Easy / Medium / Hard
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลื่อนเมาส์ไปที่แถว Difficulty ให้ submenu เด้งออกมา
3. เลือก Hard
**Expected**
ตารางแสดงเฉพาะสูตรที่ระดับความยาก Hard และ chip Difficulty ปรากฏในแถบ Active filter

---
## TC-RCP-010006 — สลับมุมมอง List / Grid
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop (ปุ่มสลับมุมมองซ่อนบนจอเล็ก และมือถือถูกบังคับเป็น grid อยู่แล้ว)
**Steps**
1. คลิกปุ่มที่มี aria-label ของมุมมอง Grid
2. คลิกปุ่มที่มี aria-label ของมุมมอง List เพื่อกลับ
**Expected**
โหมด grid แสดงการ์ดสูตรอาหาร (ชื่อ, สถานะ Active, Code, Cuisine, Category, Difficulty, Total Time และแถว audit) พร้อม infinite scroll; กลับมาโหมด list แล้วตารางแสดงข้อมูลครบเหมือนเดิม

---
## TC-RCP-010007 — แสดง Difficulty badge ในตาราง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` โหมด list; มีสูตรที่ระดับความยากต่างกัน
**Steps**
1. เปิดหน้า `/operation-plan/recipe`
2. สังเกตคอลัมน์ Difficulty
**Expected**
Easy แสดง badge โทน success-light, Medium โทน warning-light, Hard โทน destructive-light จัดกึ่งกลางคอลัมน์ — หมายเหตุ: ในโหมด grid ระดับความยากแสดงเป็นข้อความธรรมดา ไม่ใช่ badge สี

---
## TC-RCP-010008 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe`; มีสูตรทั้งที่ active และ inactive
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลื่อนเมาส์ไปที่แถว Status ให้ submenu เด้งออกมา
3. เลือก Inactive
**Expected**
ตารางแสดงเฉพาะสูตรที่คอลัมน์ Status เป็น Inactive; ตัวกรองนี้อิง `is_active` เท่านั้น ไม่มีตัวเลือก Draft/Published/Archived ในเมนูนี้

---
## TC-RCP-010009 — แก้ค่าตัวกรองจาก chip และล้างทั้งหมด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` และมีตัวกรองเปิดใช้งานอยู่อย่างน้อย 1 ตัว (เช่นจาก TC-RCP-010005)
**Steps**
1. คลิกที่ตัว chip ในแถบ Active filter (ไม่ใช่ปุ่ม X)
2. เปลี่ยนค่าที่เลือกใน popover ที่เด้งใต้ chip
3. คลิกปุ่ม X บน chip เพื่อลบตัวกรองตัวนั้น
4. เปิดตัวกรองใหม่อีกครั้งแล้วคลิกลิงก์ Clear all ท้ายแถบ chip
**Expected**
ขั้นที่ 2 ตารางอัปเดตตามค่าที่เปลี่ยนทันที; ขั้นที่ 3 chip หายและผลลัพธ์กลับมาไม่ถูกกรองด้วย field นั้น; ขั้นที่ 4 chip หายทั้งหมดและแถบ Active filter ไม่ render

---
## TC-RCP-010010 — เรียงลำดับผ่านเมนู Sort บน toolbar
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop; มีสูตรหลายรายการ
**Steps**
1. คลิกปุ่มไอคอน Sort (aria-label = Sort by) ฝั่งขวาของ toolbar
2. เลือกคอลัมน์ Name จากรายการ
3. คลิกคอลัมน์ Name ซ้ำอีกครั้ง
4. เลือกแถว Default
**Expected**
ขั้นที่ 2 เรียงจากน้อยไปมากพร้อมลูกศรขึ้นข้างแถว; ขั้นที่ 3 สลับเป็นมากไปน้อยพร้อมลูกศรลง และเมนูเปิดค้างให้กดต่อได้; ขั้นที่ 4 ล้างพารามิเตอร์ `sort` บน URL กลับไปลำดับตั้งต้น และปุ่ม Sort เลิกติดสี primary

---
## TC-RCP-010011 — เปิดคอลัมน์ Created / Updated ที่ซ่อนอยู่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` โหมด list บน desktop
**Steps**
1. คลิกปุ่มไอคอนคอลัมน์ (aria-label = Toggle columns)
2. ติ๊กเปิดคอลัมน์ Created และ Updated
**Expected**
ก่อนกดทั้งสองคอลัมน์ไม่ปรากฏในตาราง; หลังติ๊กแล้วคอลัมน์ Created และ Updated แสดงวันที่ตามรูปแบบวันเวลาของ BU พร้อมชื่อผู้ทำรายการ

---
## TC-RCP-010012 — บันทึกมุมมอง (Saved View) จากตัวกรองปัจจุบัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` และตั้งตัวกรอง/การเรียงไว้แล้วอย่างน้อย 1 อย่าง
**Steps**
1. คลิกปุ่ม Filter บน toolbar
2. เลือกแถว Save current view ท้ายเมนู
3. ตั้งชื่อมุมมองใน SaveViewDialog แล้วกดบันทึก
4. เปิด ViewSelector บน toolbar
**Expected**
เมนูตัวกรองปิดลงและ SaveViewDialog เปิดขึ้น; หลังบันทึก มุมมองที่ตั้งชื่อไว้ปรากฏใน ViewSelector และเลือกแล้วคืนค่าตัวกรอง + การเรียงชุดเดิม

---
## TC-RCP-010013 — ปุ่ม Export / Print ปรากฏแต่ถูกปิดใช้งาน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop
**Steps**
1. สังเกตปุ่ม Export และ Print ข้างปุ่ม Add Recipe
2. ชี้เมาส์ที่ปุ่มเพื่ออ่าน tooltip/title
**Expected**
ปุ่มทั้งสองแสดงอยู่ในสถานะ `disabled` และมี title = "Coming soon"; บนจอเล็กปุ่มทั้งสองย้ายไปอยู่ในเมนู "…" (aria-label = More actions) และเป็น menu item ที่ disabled เช่นกัน

---
## TC-RCP-020001 — เปิดหน้าสูตรอาหารจาก list (โหมด view)
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe`; มีสูตรอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ข้อความ Code หรือ Name ของสูตรในตาราง (เป็นปุ่มสไตล์ลิงก์ ไม่ใช่ `<a>`)
**Expected**
นำทางไปที่ `/operation-plan/recipe/{uuid}` ในโหมด view; toolbar แสดงชื่อสูตร, pill รหัส, badge สถานะแบบจุด (Draft = info, Published = success, Archived = warning) และปุ่ม Edit เพียงปุ่มเดียว; เนื้อหาแสดงแกลเลอรีรูป, ชื่อ, คำอธิบาย และ Quick Stats (Prep / Cook / Yield / Total)

---
## TC-RCP-020002 — โหมด view ล็อกทุกฟิลด์ไม่ให้แก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดสูตรอาหารอยู่ที่ `/operation-plan/recipe/{uuid}` ในโหมด view
**Steps**
1. ลองพิมพ์ในช่อง Recipe name ใน hero
2. ลองกด pill Active / Deducts stock และ select Difficulty
3. เลื่อนลงไปที่ Ingredients, Cost Breakdown และ Safety & Compliance
**Expected**
ทุกช่องกรอก ปุ่ม pill และ select อยู่ในสถานะ disabled แก้ค่าไม่ได้; ในแกลเลอรีไม่มีปุ่ม Set as hero / Move / Remove; ตาราง Ingredients ไม่มีปุ่ม Add ingredient; toolbar ไม่มีปุ่ม Save และไม่มีปุ่ม Delete

---
## TC-RCP-020003 — กด Back จากโหมด view กลับ list ทันที
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เปิดสูตรอาหารอยู่ที่ `/operation-plan/recipe/{uuid}` ในโหมด view (ยังไม่กด Edit)
**Steps**
1. คลิกปุ่ม Back ซ้ายมือของชื่อสูตรบน toolbar
**Expected**
กลับไปที่ `/operation-plan/recipe` ทันทีโดยไม่มี DiscardDialog ขึ้นมาถาม (ปุ่ม Back ไปหน้า list เสมอ ไม่ใช่การถอย history)

---
## TC-RCP-020004 — เปิดสูตรที่ไม่มีอยู่จริงแล้วเจอ Recipe not found
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เข้า URL `/operation-plan/recipe/{uuid ที่ไม่มีอยู่จริง}` ตรง ๆ
2. รอให้การโหลดข้อมูลจบ
**Expected**
ระหว่างโหลดแสดง form skeleton จากนั้นแสดงหน้า error ที่มีข้อความ "Recipe not found" พร้อมปุ่มกลับไปที่ `/operation-plan/recipe` — ไม่เกิดหน้าขาวและไม่ค้างที่ skeleton

---
## TC-RCP-030001 — สร้างสูตรอาหารใหม่สำเร็จ (ฟิลด์บังคับครบ)
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี cuisine, recipe category และ unit ที่ active อย่างน้อยอย่างละ 1 รายการ
**Steps**
1. ที่หน้า list คลิกปุ่ม Add Recipe (ไปที่ `/operation-plan/recipe/new`)
2. กรอกชื่อสูตรในช่อง Recipe name ของ hero
3. กรอก Code ใน section Recipe Details
4. เลือก Cuisine และ Category
5. กรอก Base Yield และเลือก Yield Unit
6. คลิกปุ่ม Create บน toolbar
**Expected**
toolbar เปลี่ยนป้ายปุ่มเป็น Creating… ระหว่างยิง; เมื่อสำเร็จแสดง toast "Recipe created successfully" และ redirect กลับไปที่ `/operation-plan/recipe` โดยมีสูตรใหม่อยู่ในรายการ

---
## TC-RCP-030002 — ยกเลิกการสร้างเมื่อมีการแก้ไขค้าง (Discard)
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` และได้กรอกข้อมูลบางส่วนแล้ว (ฟอร์ม dirty)
**Steps**
1. คลิกปุ่ม Back หรือ Cancel บน toolbar
2. ใน DiscardDialog คลิกปุ่ม Discard
**Expected**
DiscardDialog แบบ warning เปิดขึ้น หัวข้อ "Discard changes?" พร้อมปุ่ม Keep editing และ Discard; กด Discard แล้วกลับไปที่ `/operation-plan/recipe` โดยไม่มีสูตรใหม่ถูกสร้าง

---
## TC-RCP-030003 — โหมดสร้างไม่มีปุ่ม Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new`
**Steps**
1. สังเกตแถบปุ่มฝั่งขวาของ toolbar
**Expected**
มีเฉพาะปุ่ม Cancel และ Create; ไม่มีปุ่ม Delete และไม่มี DeleteDialog อยู่ใน DOM เลย (ปุ่มลบมีเฉพาะโหมดแก้ไขของสูตรที่มีอยู่แล้ว)

---
## TC-RCP-030004 — เตือนเมื่อออกจากฟอร์มผ่านเมนูข้างขณะยังไม่บันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` หรือโหมดแก้ไข และได้แก้ข้อมูลบางส่วนแล้ว (ฟอร์ม dirty)
**Steps**
1. คลิกเมนูโมดูลอื่นใน sidebar เพื่อออกจากหน้าฟอร์ม
2. เลือก Keep editing ใน dialog ที่ขึ้นมา
3. ทำซ้ำขั้นที่ 1 แล้วเลือก Discard
**Expected**
ขั้นที่ 1 มี DiscardDialog ขึ้นเตือน (navigation guard) ไม่ปล่อยให้หลุดออกไปเงียบ ๆ; เลือก Keep editing แล้วยังอยู่ในฟอร์มพร้อมข้อมูลเดิม; เลือก Discard แล้วจึงนำทางไปหน้าที่กด

---
## TC-RCP-040001 — แก้ไขข้อมูลสูตรอาหารแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีสูตรที่สร้างไว้แล้ว (เช่นจาก TC-RCP-030001)
**Steps**
1. เปิดสูตรจาก list แล้วคลิกปุ่ม Edit
2. แก้ไข Recipe name ใน hero และ Description ใน Recipe Details
3. คลิกปุ่ม Save
4. เปิดสูตรนั้นอีกครั้งจาก list
**Expected**
แสดง toast "Recipe updated successfully" และ redirect กลับไปที่ `/operation-plan/recipe`; เปิดสูตรซ้ำแล้วชื่อและคำอธิบายเป็นค่าที่แก้ไว้

---
## TC-RCP-040002 — เปลี่ยนสถานะสูตร DRAFT → PUBLISHED
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีสูตรสถานะ Draft อยู่
**Steps**
1. เปิดสูตรแล้วคลิก Edit
2. เปลี่ยน select สถานะบน toolbar (aria-label = status) จาก Draft เป็น Published
3. คลิก Save
4. เปิดสูตรนั้นอีกครั้ง
**Expected**
บันทึกสำเร็จและกลับหน้า list; เปิดสูตรซ้ำแล้วโหมด view แสดง badge จุดสถานะ Published โทน success แทน select — ตัวเลือกใน select มีครบ 3 ค่า Draft / Published / Archived

---
## TC-RCP-040003 — กด Cancel ในโหมดแก้ไขคืนค่าเดิมและกลับสู่โหมด view
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดสูตรที่มีอยู่แล้วกด Edit และแก้ Recipe name ไปแล้ว (ฟอร์ม dirty)
**Steps**
1. คลิกปุ่ม Cancel บน toolbar
2. ใน DiscardDialog คลิก Discard
**Expected**
ยังอยู่หน้าเดิม `/operation-plan/recipe/{uuid}` แต่กลับเป็นโหมด view; ช่อง Recipe name แสดงค่าเดิมก่อนแก้ (ไม่ใช่ค่าที่เพิ่งยกเลิกค้างอยู่บนจอ) และรูปที่เพิ่งเพิ่มในแกลเลอรีถูกรีเซ็ตกลับด้วย

---
## TC-RCP-040004 — สลับสถานะ Active / Inactive จากปุ่มใน hero
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เปิดสูตรที่สถานะ Active อยู่ และกด Edit แล้ว
**Steps**
1. คลิกปุ่ม pill ที่แสดงข้อความ Active ในแถว pill ของ hero
2. คลิก Save
3. กลับไปที่ list แล้วดูคอลัมน์ Status ของสูตรนั้น
**Expected**
pill สลับเป็น Inactive และ `aria-pressed` เปลี่ยนเป็น false; หลังบันทึก คอลัมน์ Status ในตารางแสดง Inactive และตัวกรอง Status = Inactive ค้นเจอสูตรนี้

---
## TC-RCP-050001 — ลบสูตรอาหารจากหน้าแก้ไขสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีสูตรที่สามารถลบได้ (ควรเป็นสูตรที่สร้างขึ้นในเทสชุดนี้เอง)
**Steps**
1. เปิดสูตรแล้วคลิก Edit
2. คลิกปุ่ม Delete (ปุ่มโทน destructive)
3. ยืนยันด้วยปุ่ม Delete ใน DeleteDialog
**Expected**
DeleteDialog แสดงหัวข้อ "Delete Recipe" และข้อความยืนยันที่มีชื่อสูตรอยู่ด้วย; เมื่อยืนยันแสดง toast "Recipe deleted successfully" และ redirect กลับไปที่ `/operation-plan/recipe` โดยสูตรหายจากรายการ

---
## TC-RCP-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในหน้าสูตรอาหารโหมดแก้ไข
**Steps**
1. คลิกปุ่ม Delete
2. ใน DeleteDialog คลิกปุ่ม Cancel
**Expected**
Dialog ปิดลงโดยไม่มีการลบ; ยังอยู่หน้าเดิมในโหมดแก้ไขและสูตรยังอยู่ในรายการ

---
## TC-RCP-050003 — ลบสูตรอาหารจากเมนูท้ายแถวในตาราง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/operation-plan/recipe` โหมด list; มีสูตรที่ลบได้และผู้ใช้มีสิทธิ์ลบ
**Steps**
1. คลิกปุ่มจุดไข่ปลาท้ายแถว (aria-label = Row actions)
2. เลือกเมนู Delete
3. ยืนยันใน DeleteDialog
**Expected**
เมนูมีเฉพาะรายการ Delete (ไม่มี Edit และไม่มี Activity); เมื่อยืนยันแสดง toast "Recipe deleted successfully" และแถวหายจากตารางโดยไม่ต้องออกจากหน้า list

---
## TC-RCP-050004 — ลบสูตรอาหารจากการ์ดในโหมด grid
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/operation-plan/recipe` และสลับเป็นโหมด grid แล้ว; มีสูตรที่ลบได้
**Steps**
1. คลิกปุ่มถังขยะท้ายการ์ดของสูตรที่ต้องการลบ
2. ยืนยันใน DeleteDialog
**Expected**
ใช้ DeleteDialog ตัวเดียวกับโหมด list; เมื่อยืนยันแสดง toast "Recipe deleted successfully" และการ์ดหายจาก grid — สิทธิ์ลบของการ์ดกับของแถวในตารางถูกคุมด้วยตัวเดียวกัน จึงต้องเห็น/ไม่เห็นปุ่มสอดคล้องกัน

---
## TC-RCP-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าสูตรอาหาร
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี permission `operation_plan.view` และไม่ใช่ admin; BU มี license ของโมดูลนี้
**Steps**
1. เข้า URL `/operation-plan/recipe` ตรง ๆ
**Expected**
ไม่เห็นข้อมูลสูตรเลย; แสดงกล่อง Access denied (`role="alert"`) ที่มีไอคอนโล่, หัวข้อ "Permission Denied", ข้อความ "You don't have permission to view this page." พร้อมบรรทัดแนะนำให้ติดต่อผู้ดูแลระบบ และปุ่มพาไปหน้าที่เข้าได้ — ไม่ใช่การ redirect เงียบ ๆ

---
## TC-RCP-100002 — เข้า URL สูตรอาหารโดยไม่ได้ล็อกอิน
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session/token ในเบราว์เซอร์ (context ใหม่ที่ไม่โหลด storageState)
**Steps**
1. เข้า URL `/operation-plan/recipe` ตรง ๆ
2. ทำซ้ำกับ `/operation-plan/recipe/new`
**Expected**
ทั้งสอง URL ถูกเด้งไปที่ `/login` (แบบ replace) และไม่มีข้อมูลสูตรอาหารปรากฏระหว่างทาง

---
## TC-RCP-100003 — BU ที่ไม่มี license ของโมดูลสูตรอาหารถูกบล็อก
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ active BU ไม่มี license feature `operation_plan.recipe` (รวมกรณีที่เป็น admin ของ BU นั้น — license ไม่มี admin bypass)
**Steps**
1. เข้า URL `/operation-plan/recipe` ตรง ๆ
**Expected**
แสดงกล่อง Access denied ที่ใช้คำอธิบายเชิง license (ไม่มีบรรทัด "ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์") พร้อมปุ่มพาไปหน้าที่เข้าได้; การเป็น admin ไม่ช่วยให้ผ่าน

---
## TC-RCP-200001 — บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new`
**Steps**
1. ปล่อย Code และ Recipe name ว่าง
2. คลิกปุ่ม Create
**Expected**
แสดงข้อความ "Code is required" ใต้ช่อง Code และข้อความ required ใต้ช่อง Recipe name (ช่องชื่อเปลี่ยนเส้นใต้เป็นสี destructive และมี `aria-invalid`); ไม่มีสูตรถูกสร้างและไม่ redirect

---
## TC-RCP-200002 — บังคับเลือก Cuisine, Category และ Yield Unit
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` โดยกรอก Code และ Recipe name แล้วแต่ยังไม่เลือก lookup ใด ๆ
**Steps**
1. ปล่อย Cuisine, Category และ Yield Unit ว่าง
2. คลิกปุ่ม Create
**Expected**
แสดงข้อความ required สำหรับ Cuisine, Category และ Unit ที่ lookup ทั้งสามตัว; ไม่มีสูตรถูกสร้าง — หมายเหตุ: Status และ Difficulty ไม่เคยว่างเพราะมีค่าตั้งต้น Draft / Easy

---
## TC-RCP-200003 — เลื่อนไปยังฟิลด์ที่ผิดพลาดเมื่อ submit ไม่ผ่าน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` กรอกข้อมูลด้านบนครบแต่เว้น Yield Unit ว่าง แล้วเลื่อนหน้าลงไปท้ายฟอร์ม
**Steps**
1. คลิกปุ่ม Create ขณะที่ฟิลด์ที่ผิดอยู่นอกจอ
**Expected**
หน้าเลื่อนแบบ smooth ให้ฟิลด์แรกที่มี `aria-invalid="true"` มาอยู่กลางจอ และ focus ตกที่ control ของฟิลด์นั้น

---
## TC-RCP-200004 — Code รับได้ไม่เกิน 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new`
**Steps**
1. พิมพ์ข้อความยาวเกิน 10 ตัวอักษรลงช่อง Code
**Expected**
ช่องรับเข้าเพียง 10 ตัวอักษรแรก (maxLength ของ input) ตัวที่เกินไม่ถูกพิมพ์เข้าไป

---
## TC-RCP-200005 — Name รับได้ไม่เกิน 100 ตัวอักษรพร้อมตัวนับ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new`
**Steps**
1. พิมพ์ชื่อสูตรลงช่อง Recipe name ใน hero
2. พิมพ์ต่อจนเกิน 100 ตัวอักษร
**Expected**
ตัวนับมุมขวาล่างของช่องแสดงรูปแบบ `{จำนวนที่พิมพ์}/100` และอัปเดตตามที่พิมพ์; ช่องหยุดรับที่ 100 ตัวอักษร; ข้อความช่วยเหลือใต้ช่องเปลี่ยนตามสถานะ (ว่าง = Required field, กำลังโฟกัส = Press Enter to save, มีค่าแล้ว = Click to rename)

---
## TC-RCP-200006 — Description และ Internal Note รับได้ไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` ใน section Recipe Details
**Steps**
1. พิมพ์ข้อความยาวเกิน 256 ตัวอักษรลง Description
2. ทำซ้ำกับ Internal Note
**Expected**
ทั้งสอง textarea หยุดรับที่ 256 ตัวอักษร และยังแสดงข้อความอธิบายใต้ช่องตามเดิม (Description เป็นข้อความสาธารณะ, Internal Note เห็นเฉพาะพนักงาน)

---
## TC-RCP-400001 — เพิ่มวัตถุดิบ (ingredient) ในตาราง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสร้างหรือแก้ไขสูตร (โหมด add/edit) เลื่อนไปที่ section Ingredients
**Steps**
1. คลิก Add first ingredient (เมื่อตารางยังว่าง) หรือปุ่ม Add Ingredient มุมขวาของ section
2. กรอกชื่อวัตถุดิบในแถวใหม่
**Expected**
แถวใหม่ถูกเพิ่มพร้อมคอลัมน์ `#`, Ingredient, Qty, Unit, Cost, Yield %, Prep notes และปุ่มลบท้ายแถว; ค่าตั้งต้นของแถวใหม่คือ Qty = 1 และ Yield % = 100; ตัวนับเหนือตารางเปลี่ยนจาก "no ingredients" เป็นจำนวนแถวปัจจุบัน

---
## TC-RCP-400002 — แก้ไขปริมาณ/หน่วย/ต้นทุนของวัตถุดิบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีแถววัตถุดิบอย่างน้อย 1 แถวในตาราง Ingredients และอยู่ในโหมดแก้ไข
**Steps**
1. แก้ค่า Qty ในแถววัตถุดิบ
2. พิมพ์หน่วยในช่อง Unit (เป็นข้อความอิสระ ไม่ใช่ lookup)
3. แก้ค่า Cost
**Expected**
ค่าที่กรอกอยู่ในแถวตามที่พิมพ์; ยอดรวมในแถบด้านบนและแถวสรุปท้ายตารางปรับตามค่า Cost ทันที — ยอดในส่วน Cost Breakdown **ไม่** เปลี่ยนตาม เพราะเป็นคนละช่องกัน (ดู TC-RCP-400004)

---
## TC-RCP-400003 — ลบแถววัตถุดิบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีแถววัตถุดิบอย่างน้อย 1 แถวและอยู่ในโหมดแก้ไข
**Steps**
1. คลิกปุ่ม X ท้ายแถว (aria-label = Remove ingredient)
**Expected**
แถวถูกลบออกจากตาราง ตัวนับจำนวนวัตถุดิบลดลง และยอดรวม preview ปรับตาม; เมื่อลบจนไม่เหลือแถว ตารางกลับไปแสดงสถานะว่างพร้อมปุ่ม Add first ingredient

---
## TC-RCP-400004 — ผลรวมแถววัตถุดิบ (preview) เท่ากับผลรวม Cost ทุกแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีแถววัตถุดิบหลายแถวพร้อมค่า Cost และอยู่ในโหมดแก้ไข
**Steps**
1. กรอกค่า Cost ให้แต่ละแถว
2. สังเกตยอดรวมในบรรทัดสรุปเหนือตาราง และแถว "Ingredient lines (preview)" ท้ายตาราง
3. เลื่อนลงไปดูค่า Ingredient Cost ใน section Cost Breakdown
**Expected**
ยอดทั้งสองจุดเท่ากับผลรวมของ Cost ทุกแถว แสดงในรูปแบบสกุลเงินบาท; ค่า Ingredient Cost ใน Cost Breakdown **ไม่เปลี่ยนตาม** เพราะเป็นช่องกรอกมือแยกต่างหาก — ตัวเลขทั้งสองฝั่งไม่ผูกกันโดยออกแบบปัจจุบัน

---
## TC-RCP-400005 — เตือนเมื่อ Yield % ต่ำกว่า 90
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มีแถววัตถุดิบในตารางและอยู่ในโหมดแก้ไข
**Steps**
1. กรอกค่า Yield % ของแถวนั้นเป็นค่าน้อยกว่า 90 (เช่น 80)
2. เปลี่ยนกลับเป็น 100
**Expected**
เมื่อค่า < 90 ตัวเลขในช่อง Yield % เปลี่ยนเป็นสีเตือน (warning ink); เมื่อกลับเป็น 100 สีกลับเป็นปกติ; ช่องนี้จำกัดช่วง 0–100

---
## TC-RCP-400006 — แสดงป้าย "Preview only" เหนือตารางวัตถุดิบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสูตรอาหาร (โหมดใดก็ได้) ที่ section Ingredients
**Steps**
1. สังเกตแถบเหนือตาราง Ingredients
2. สังเกตชื่อแถวสรุปท้ายตารางเมื่อมีวัตถุดิบอย่างน้อย 1 แถว
**Expected**
มี badge โทน warning พร้อมไอคอน Info ข้อความ "Preview only — ingredients are not yet persisted with the recipe." อยู่ฝั่งขวาของแถบ; แถวสรุปท้ายตารางใช้ชื่อ "Ingredient lines (preview)" — ป้ายนี้คือสัญญาของ UI ที่ต้องคงอยู่ตราบที่วัตถุดิบยังไม่ถูกบันทึก

---
## TC-RCP-400007 — สถานะว่างของตารางวัตถุดิบพร้อมปุ่ม Add first ingredient
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/recipe/new` (ตาราง Ingredients ยังว่าง)
**Steps**
1. เลื่อนไปที่ section Ingredients โดยยังไม่เพิ่มแถวใด ๆ
**Expected**
แสดงสถานะว่างหัวข้อ "No ingredients yet" คำอธิบาย "Add line items to start cost calculation." และปุ่ม Add first ingredient; ตัวนับเหนือตารางอ่านว่า "no ingredients" และ **ไม่มี** ปุ่ม Add Ingredient มุมขวาของ section (ปุ่มนั้นโผล่เมื่อมีแถวแล้วเท่านั้น)

---
## TC-RCP-410001 — กรอก Prep / Cook Time และ Base Yield แล้ว Quick Stats อัปเดต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร ที่ section Recipe Details (โหมด add/edit)
**Steps**
1. กรอกตัวเลขในช่อง Prep Time
2. กรอกตัวเลขในช่อง Cook Time
3. กรอกตัวเลขในช่อง Base Yield
4. เลื่อนขึ้นไปดู Quick Stats ใน hero
**Expected**
ทั้งสามเป็น `<input type="number">` จัดชิดขวา `min=0` (ไม่มีปุ่ม + / − แล้ว) โดย Prep/Cook Time มีคำอธิบาย "min" ใต้ช่อง; Quick Stats แสดง Prep, Cook, Yield ตามค่าที่กรอก และ Total = Prep + Cook

---
## TC-RCP-410002 — เลือก Yield Unit จาก lookup และสร้างหน่วยใหม่แบบ inline
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร ที่ section Recipe Details; มีหน่วยนับที่ active อย่างน้อย 1 รายการ
**Steps**
1. คลิก lookup Yield Unit เพื่อเปิด popover
2. พิมพ์คำค้นในช่องค้นหาของ popover
3. คลิกปุ่ม + มุมขวาบนของ popover เพื่อเปิด dialog สร้างหน่วยใหม่
4. สร้างหน่วยใหม่แล้วกดบันทึก
**Expected**
popover แสดงเฉพาะหน่วยที่ active และค้นหาแบบฝั่งเซิร์ฟเวอร์พร้อมโหลดเพิ่มเมื่อเลื่อน; หลังสร้างหน่วยใหม่สำเร็จ หน่วยนั้นถูกเลือกให้อัตโนมัติในช่อง Yield Unit

---
## TC-RCP-420001 — คำนวณ Cost per Portion จากต้นทุนรวมหาร Base Yield
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรและกำหนด Base Yield เป็นค่ามากกว่า 0 แล้ว
**Steps**
1. กรอก Ingredient Cost, Labor Cost และ Overhead Cost ใน section Cost Breakdown
2. เลื่อนไปดู section "Cost & price"
3. เลื่อนขึ้นไปดู Quick Stats ใน hero
**Expected**
ค่า Cost per Portion = (Ingredient + Labor + Overhead) ÷ Base Yield ปัดทศนิยม 2 ตำแหน่ง แสดงเป็นตัวเลขขนาดใหญ่นำหน้าด้วย ฿; เมื่อ Base Yield = 0 ค่านี้เป็น 0; ตัวเลขเดียวกันปรากฏเป็นบรรทัดย่อยใต้ Quick Stat "Total" เมื่อมากกว่า 0

---
## TC-RCP-420002 — คำนวณ Gross Margin และ Food Cost % เทียบเป้าหมาย
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่กรอกต้นทุนและ Base Yield แล้ว (ตาม TC-RCP-420001)
**Steps**
1. กรอก Selling Price ใน section "Cost & price"
2. กรอก Target Food Cost (%) ใน section Margins
3. สังเกตไทล์ Gross Margin และ Food Cost พร้อมข้อความสถานะใต้ไทล์
**Expected**
Gross Margin = Selling Price − Cost per Portion พร้อมเปอร์เซ็นต์เทียบราคาขาย; Food Cost % = Ingredient Cost ÷ Selling Price; เมื่อ Food Cost % ไม่เกินเป้า ข้อความแสดงว่าอยู่ในเป้าพร้อมตัวเลข margin, เมื่อเกินเป้าจะบอกว่าเกินกี่จุดและจุดนำหน้าเปลี่ยนเป็นสี destructive; Gross Margin ติดลบแสดงเป็นสี destructive

---
## TC-RCP-420003 — แสดงราคาที่แนะนำจาก Target Food Cost %
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่มี Cost per Portion มากกว่า 0
**Steps**
1. กรอก Target Food Cost เป็นค่าระหว่าง 0 ถึง 100 (เช่น 30)
2. สังเกต chip ใต้ช่อง Selling Price ใน section "Cost & price"
3. เปลี่ยน Target Food Cost เป็น 0
**Expected**
chip แสดงราคาที่แนะนำ = Cost per Portion ÷ (1 − target/100) พร้อมระบุเปอร์เซ็นต์เป้าหมาย; เมื่อ Target = 0 (หรือ ≥ 100) chip หายไป

---
## TC-RCP-420004 — แถบสัดส่วนต้นทุนและ Total recipe cost ใน Cost Breakdown
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร ที่ section Cost Breakdown
**Steps**
1. กรอก Ingredient Cost, Labor Cost และ Overhead Cost ให้ต่างกัน
2. สังเกตแถบแนวนอนด้านบนและตัวเลขเปอร์เซ็นต์ท้ายแต่ละแถว
3. สังเกตบรรทัด Total recipe cost ใต้เส้นคั่น
**Expected**
แถบแบ่งสามช่วงตามสัดส่วนของแต่ละต้นทุน (เข้ม → อ่อน) และเปอร์เซ็นต์ท้ายแถวรวมได้ 100%; Total recipe cost = ผลบวกของทั้งสามช่อง

---
## TC-RCP-420005 — Other metrics — Labor / Overhead ratio และ Carbon Footprint
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่กรอก Selling Price, Labor Cost และ Overhead Cost แล้ว
**Steps**
1. เลื่อนไปที่ section "Other metrics"
2. อ่านค่า Labor Cost และ Overhead
3. กรอกค่าในช่อง Carbon Footprint
**Expected**
Labor Cost = Labor ÷ Selling Price และ Overhead = Overhead ÷ Selling Price แสดงเป็น % ทศนิยม 1 ตำแหน่ง (แสดง "—" เมื่อยังไม่มีราคาขาย); เมื่อกรอก Carbon Footprint มากกว่า 0 บรรทัดสรุปด้านบนแสดงค่าพร้อมหน่วย และช่องกรอกมีป้ายหน่วย kg CO2e ชิดขวา

---
## TC-RCP-430001 — เลือกสารก่อภูมิแพ้มาตรฐานและกรอกแบบกำหนดเอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร ที่ section Safety & Compliance
**Steps**
1. คลิกเลือก chip สารก่อภูมิแพ้มาตรฐานสองรายการ (เช่น Eggs และ Dairy)
2. กรอกสารก่อภูมิแพ้เพิ่มเติมในช่อง Other Allergens โดยคั่นด้วยจุลภาค
3. คลิก Save แล้วเปิดสูตรนั้นอีกครั้ง
**Expected**
chip ที่เลือกแสดงเครื่องหมายถูกและ `aria-pressed=true`; รายการที่กรอกเองแสดงเป็น chip เส้นประกำกับคำว่า custom; ตัวนับข้าง Allergens แสดงจำนวนรวมของทั้งสองกลุ่ม; เปิดซ้ำแล้วค่าเดิมกลับมาแยกเป็นกลุ่มมาตรฐานและกลุ่มกำหนดเองตามเดิม

---
## TC-RCP-430002 — สลับ Tag และ toggle Deduct from stock
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร
**Steps**
1. คลิก chip แท็ก (ตัวเลือกคือ Seasonal, Best seller, New, High margin, Vegetarian) เพื่อเปิด แล้วคลิกซ้ำเพื่อปิด
2. คลิกปุ่ม pill "Deducts stock" ในแถว pill ของ hero
3. คลิก Save แล้วเปิดสูตรนั้นอีกครั้ง
**Expected**
chip แท็กสลับสถานะพร้อมเครื่องหมายถูกและ `aria-pressed`; ปุ่ม Deducts stock สลับสถานะเปิด/ปิดตามที่กด; เปิดสูตรซ้ำแล้วทั้งแท็กที่เลือกและสถานะ Deduct from stock ยังเป็นค่าที่บันทึกไว้

---
## TC-RCP-440001 — อัปโหลดรูปภาพในแกลเลอรีสูตรอาหาร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร (โหมด add/edit) ที่ยังไม่มีรูปในแกลเลอรี
**Steps**
1. คลิกพื้นที่ drop zone ที่เขียนว่า "Drop hero photo" เพื่อเปิดตัวเลือกไฟล์
2. เลือกไฟล์ JPEG หรือ PNG ที่ขนาดไม่เกิน 2 MB
3. คลิก Save แล้วเปิดสูตรนั้นอีกครั้ง
**Expected**
drop zone ระบุข้อจำกัด "JPEG · PNG · up to 2.0 MB"; หลังเลือกไฟล์ รูปแสดงเป็นภาพหลักแบบ object-contain พร้อมป้าย Hero มุมซ้ายบน ตัวนับ "1 / 1" มุมขวาบน และแถบภาพย่อด้านล่าง; หลังบันทึกและเปิดซ้ำ รูปยังอยู่ในแกลเลอรี

---
## TC-RCP-440002 — ตั้งรูป hero และเรียงลำดับรูปในแกลเลอรี
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่มีรูปในแกลเลอรีอย่างน้อย 2 รูป
**Steps**
1. คลิกภาพย่อรูปที่สองเพื่อให้เป็นภาพที่กำลังแสดง
2. คลิกปุ่ม "Set as hero"
3. ใช้ปุ่มลูกศรซ้าย/ขวามุมซ้ายล่างเพื่อเลื่อนลำดับรูปนั้น
4. คลิก Save แล้วเปิดสูตรนั้นอีกครั้ง
**Expected**
ป้าย Hero ย้ายมาที่รูปที่เลือกและดาวบนภาพย่อย้ายตาม; ปุ่ม "Set as hero" หายไปเมื่อรูปที่แสดงเป็น hero อยู่แล้ว; ปุ่มลูกศรถูกปิดเมื่ออยู่สุดปลายทั้งสองด้าน; หลังบันทึกและเปิดซ้ำ ลำดับและรูป hero เป็นไปตามที่ตั้งไว้

---
## TC-RCP-440003 — ลบรูปออกจากแกลเลอรี
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่มีรูปในแกลเลอรีอย่างน้อย 2 รูป
**Steps**
1. คลิกปุ่ม X มุมขวาล่างของภาพหลัก (aria-label = Remove image)
2. คลิก Save แล้วเปิดสูตรนั้นอีกครั้ง
**Expected**
รูปหายจากแกลเลอรีและตัวนับลดลงทันที; ถ้ารูปที่ลบเป็น hero ระบบเลื่อน hero ไปให้รูปแรกที่เหลือโดยอัตโนมัติ; หลังบันทึกและเปิดซ้ำ รูปที่ลบไม่กลับมา; ลบจนหมดแล้วกลับไปแสดง drop zone

---
## TC-RCP-440004 — ปฏิเสธไฟล์ผิดชนิดหรือใหญ่เกิน 2 MB
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร ที่แกลเลอรีรูปภาพ; เตรียมไฟล์ที่ไม่ใช่รูป (เช่น .pdf) และไฟล์รูปที่ใหญ่กว่า 2 MB
**Steps**
1. เลือกไฟล์ที่ไม่ใช่ JPEG/PNG/WebP
2. เลือกไฟล์รูปที่ใหญ่กว่า 2 MB
**Expected**
ขั้นที่ 1 แสดง toast เตือนว่ารับเฉพาะ JPEG, PNG หรือ WebP; ขั้นที่ 2 แสดง toast เตือนว่าไฟล์ใหญ่เกินกำหนดพร้อมระบุขนาดสูงสุด; ทั้งสองกรณีไม่มีรูปถูกเพิ่มเข้าแกลเลอรี

---
## TC-RCP-440005 — จำกัดจำนวนรูปไม่เกิน 10 รูปต่อสูตร
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่มีรูปในแกลเลอรีครบ 10 รูปแล้ว
**Steps**
1. สังเกตปุ่ม + ท้ายแถบภาพย่อ
2. ลากไฟล์รูปเพิ่มลงบนแกลเลอรี
**Expected**
ปุ่ม + ท้ายแถบภาพย่อไม่แสดงเมื่อครบ 10 รูป; การพยายามเพิ่มรูปแสดง toast เตือนว่ารับได้สูงสุด 10 รูปต่อสูตร และจำนวนรูปยังคงเป็น 10
