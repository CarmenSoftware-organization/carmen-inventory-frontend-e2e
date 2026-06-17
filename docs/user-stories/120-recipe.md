# Recipe — User Stories

_Authored from the test-case catalog `docs/test-cases/120-recipe.md` (documentation only — no automated spec yet)._

**Module:** Operation Plan — Recipe
**Frontend route:** `routes/operation-plan/recipe`  •  **URL:** `/operation-plan/recipe`
**Prefix:** `RCP`
**Default role:** Operation Planner / Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 28

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
| TC-RCP-020001 | เปิดหน้ารายละเอียดสูตรอาหาร (view) | Medium | Happy Path |
| TC-RCP-030001 | สร้างสูตรอาหารใหม่สำเร็จ (ฟิลด์บังคับครบ) | High | CRUD |
| TC-RCP-030002 | ยกเลิกการสร้างเมื่อมีการแก้ไขค้าง (Discard) | Medium | Alternate Flow |
| TC-RCP-040001 | แก้ไขข้อมูลสูตรอาหารแล้วค่าคงอยู่ | High | CRUD |
| TC-RCP-040002 | เปลี่ยนสถานะสูตร DRAFT → PUBLISHED | Medium | CRUD |
| TC-RCP-050001 | ลบสูตรอาหารสำเร็จ | High | CRUD |
| TC-RCP-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-RCP-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าสูตรอาหาร | High | Authorization |
| TC-RCP-200001 | บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับ | High | Validation |
| TC-RCP-200002 | บังคับเลือก Cuisine, Category และ Yield Unit | High | Validation |
| TC-RCP-200003 | เลื่อนไปยังฟิลด์ที่ผิดพลาดเมื่อ submit ไม่ผ่าน | Medium | Validation |
| TC-RCP-400001 | เพิ่มวัตถุดิบ (ingredient) ในตาราง | High | Functional |
| TC-RCP-400002 | แก้ไขปริมาณ/หน่วย/ต้นทุนของวัตถุดิบ | High | Functional |
| TC-RCP-400003 | ลบแถววัตถุดิบ | Medium | Functional |
| TC-RCP-400004 | คำนวณ Total Recipe Cost จากวัตถุดิบ | High | Functional |
| TC-RCP-400005 | เตือนเมื่อ Yield % ต่ำกว่า 90 | Low | Edge Case |
| TC-RCP-410001 | กำหนด Prep / Cook time และ Base Yield ด้วย stepper | Medium | Functional |
| TC-RCP-420001 | คำนวณ Cost per Portion / Margin ในคอนโซลต้นทุน | High | Functional |
| TC-RCP-430001 | เลือกสารก่อภูมิแพ้มาตรฐานและกรอกแบบกำหนดเอง | Medium | Functional |
| TC-RCP-430002 | สลับ Tag และ toggle Deduct from stock | Low | Functional |
| TC-RCP-440001 | อัปโหลดรูปภาพในแกลเลอรีสูตรอาหาร | Medium | Functional |

---
## TC-RCP-010001 — แสดงรายการสูตรอาหาร
> **As an** Operation Planner, **I want** the recipe list page to load, **so that** I can review all recipes in my business unit.

**Priority:** High · **Test Type:** Smoke

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสูตรอาหารอย่างน้อย 1 รายการ

**Steps**
1. ไปที่ `/operation-plan/recipe`
2. รอให้ DataGrid โหลดเสร็จ

**Expected**
ตารางแสดงคอลัมน์ Code, Name, Cuisine, Category, Difficulty (badge) พร้อม badge จำนวนรายการ

---
## TC-RCP-010002 — ค้นหาสูตรอาหารด้วยชื่อ/รหัส
> **As an** Operation Planner, **I want** to search recipes by name or code, **so that** I can quickly find a specific recipe.

**Priority:** High · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe`; มีหลายสูตร

**Steps**
1. คลิกที่ช่อง Search
2. พิมพ์ชื่อหรือรหัสของสูตรที่มีอยู่
3. กด Enter

**Expected**
ตารางแสดงเฉพาะสูตรที่ตรงกับคำค้นหา

---
## TC-RCP-010003 — กรองตาม Cuisine
> **As an** Operation Planner, **I want** to filter recipes by cuisine, **so that** I can review recipes of a particular cuisine.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีสูตรที่กำหนด cuisine หลากหลาย

**Steps**
1. เปิด Cuisine multi-select filter
2. เลือก cuisine หนึ่งรายการ

**Expected**
ตารางแสดงเฉพาะสูตรที่อยู่ใน cuisine ที่เลือก และมี chip filter ปรากฏ

---
## TC-RCP-010004 — กรองตาม Category
> **As an** Operation Planner, **I want** to filter recipes by category, **so that** I can review recipes within one category.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีสูตรที่กำหนด recipe category หลากหลาย

**Steps**
1. เปิด Category multi-select filter
2. เลือก category หนึ่งรายการ

**Expected**
ตารางแสดงเฉพาะสูตรในหมวดหมู่ที่เลือก

---
## TC-RCP-010005 — กรองตาม Difficulty
> **As an** Operation Planner, **I want** to filter recipes by difficulty, **so that** I can plan for kitchen skill levels.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีสูตรที่มีระดับความยาก EASY / MEDIUM / HARD

**Steps**
1. เปิด Difficulty filter
2. เลือก HARD

**Expected**
ตารางแสดงเฉพาะสูตรที่ระดับความยาก HARD

---
## TC-RCP-010006 — สลับมุมมอง List / Grid
> **As an** Operation Planner, **I want** to switch between list and grid views, **so that** I can browse recipes in the layout I prefer.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ที่หน้า `/operation-plan/recipe` บน desktop

**Steps**
1. คลิกปุ่ม Grid view
2. คลิกปุ่ม List view กลับ

**Expected**
มุมมองสลับระหว่างการ์ดและตาราง โดยข้อมูลสูตรยังครบ

---
## TC-RCP-010007 — แสดง Difficulty badge ในตาราง
> **As an** Operation Planner, **I want** difficulty shown as a color-coded badge, **so that** I can gauge complexity at a glance.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
มีสูตรที่ระดับความยากต่างกัน

**Steps**
1. เปิดหน้า `/operation-plan/recipe`
2. สังเกตคอลัมน์ Difficulty

**Expected**
EASY แสดง badge สีเขียว (success), MEDIUM สีเหลือง (warning), HARD สีแดง (destructive)

---
## TC-RCP-020001 — เปิดหน้ารายละเอียดสูตรอาหาร (view)
> **As an** Operation Planner, **I want** to open a recipe's detail page, **so that** I can review its full information before editing.

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**
มีสูตรอย่างน้อย 1 รายการ

**Steps**
1. คลิกที่ Code หรือ Name ของสูตรในตาราง

**Expected**
นำทางไปที่ `/operation-plan/recipe/{id}` ในโหมด view; toolbar แสดง status badge และปุ่ม Edit; hero แสดงรูป/ชื่อ/quick stats

---
## TC-RCP-030001 — สร้างสูตรอาหารใหม่สำเร็จ (ฟิลด์บังคับครบ)
> **As an** Operation Planner, **I want** to create a new recipe with all required fields, **so that** it can be costed and produced.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี cuisine, recipe category และ unit ที่ active

**Steps**
1. คลิกปุ่ม Add (ไปที่ `/operation-plan/recipe/new`)
2. กรอก Code และ Name
3. เลือก Cuisine และ Category ใน Recipe Details
4. เลือก Yield Unit และกำหนด Base Yield
5. คลิก Create

**Expected**
แสดง toast สร้างสำเร็จ และระบบ redirect กลับไปที่ `/operation-plan/recipe` พร้อมสูตรใหม่ในรายการ

---
## TC-RCP-030002 — ยกเลิกการสร้างเมื่อมีการแก้ไขค้าง (Discard)
> **As an** Operation Planner, **I want** a discard warning when I leave a dirty form, **so that** I do not lose work by accident.

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
อยู่ในฟอร์มสร้างสูตรใหม่และได้กรอกข้อมูลบางส่วนแล้ว (form dirty)

**Steps**
1. คลิกปุ่ม Back หรือ Cancel
2. ใน DiscardDialog เลือกยืนยันการละทิ้ง

**Expected**
แสดง DiscardDialog เตือนการละทิ้ง; เมื่อยืนยันจะกลับไปที่ list โดยไม่บันทึกสูตร

---
## TC-RCP-040001 — แก้ไขข้อมูลสูตรอาหารแล้วค่าคงอยู่
> **As an** Operation Planner, **I want** my recipe edits to persist, **so that** the recipe stays up to date.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีสูตรที่สร้างไว้แล้ว

**Steps**
1. เปิดสูตรจาก list แล้วคลิก Edit
2. แก้ไข Name และ Description
3. คลิก Save
4. เปิดสูตรนั้นอีกครั้ง

**Expected**
แสดง toast อัปเดตสำเร็จ; ค่าที่แก้ไขแสดงเดิมเมื่อเปิดซ้ำ

---
## TC-RCP-040002 — เปลี่ยนสถานะสูตร DRAFT → PUBLISHED
> **As an** Operation Planner, **I want** to publish a draft recipe, **so that** it becomes available for use across the operation.

**Priority:** Medium · **Test Type:** CRUD

**Preconditions**
มีสูตรสถานะ DRAFT อยู่

**Steps**
1. เปิดสูตรแล้วคลิก Edit
2. เปลี่ยน Status select ใน toolbar เป็น PUBLISHED
3. คลิก Save

**Expected**
สถานะถูกบันทึกเป็น PUBLISHED และ toolbar badge แสดงสถานะ Published (สีเขียว) ในโหมด view

---
## TC-RCP-050001 — ลบสูตรอาหารสำเร็จ
> **As an** Operation Planner, **I want** to delete a recipe, **so that** obsolete recipes are removed.

**Priority:** High · **Test Type:** CRUD

**Preconditions**
มีสูตรที่สามารถลบได้และอยู่ในโหมด Edit

**Steps**
1. เปิดสูตรแล้วคลิก Edit
2. คลิกปุ่ม Delete
3. ยืนยันใน DeleteDialog

**Expected**
แสดง toast ลบสำเร็จ; redirect กลับไปที่ `/operation-plan/recipe` และสูตรหายจากรายการ

---
## TC-RCP-050002 — ยกเลิกการลบใน dialog
> **As an** Operation Planner, **I want** to cancel a delete I started by mistake, **so that** the recipe is not removed.

**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
อยู่ในหน้า Edit ของสูตรอาหาร

**Steps**
1. คลิกปุ่ม Delete
2. ใน DeleteDialog คลิก Cancel

**Expected**
Dialog ปิดลงโดยไม่ลบ และยังอยู่ในหน้าสูตรเดิม

---
## TC-RCP-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าสูตรอาหาร
> **As a** user without recipe permission, **I want** access to be blocked, **so that** unauthorized data is not exposed.

**Priority:** High · **Test Type:** Authorization

**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ดูสูตรอาหาร

**Steps**
1. ไปที่ `/operation-plan/recipe`

**Expected**
ผู้ใช้ถูกปฏิเสธสิทธิ์ (redirect หรือเห็นข้อความ error) และไม่เห็นข้อมูลสูตร

---
## TC-RCP-200001 — บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับ
> **As an** Operation Planner, **I want** the form to block empty required fields, **so that** every recipe has a code and a name.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มสร้างสูตรใหม่

**Steps**
1. ปล่อย Code และ Name ว่าง
2. คลิก Create

**Expected**
แสดงข้อความ error สำหรับ Code และ Name (required); ไม่มีการสร้างสูตร

---
## TC-RCP-200002 — บังคับเลือก Cuisine, Category และ Yield Unit
> **As an** Operation Planner, **I want** the form to require cuisine, category and yield unit, **so that** each recipe is fully classified and costable.

**Priority:** High · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มสร้างสูตรใหม่ โดยกรอก Code และ Name แต่ยังไม่เลือก lookup

**Steps**
1. ปล่อย Cuisine, Category และ Yield Unit ว่าง
2. คลิก Create

**Expected**
แสดงข้อความ error required สำหรับ Cuisine, Category และ Yield Unit; ไม่มีการสร้างสูตร

---
## TC-RCP-200003 — เลื่อนไปยังฟิลด์ที่ผิดพลาดเมื่อ submit ไม่ผ่าน
> **As an** Operation Planner, **I want** the page to scroll to the first invalid field, **so that** I can quickly fix what's wrong on a long form.

**Priority:** Medium · **Test Type:** Validation

**Preconditions**
อยู่ในฟอร์มสร้างสูตรใหม่และมีฟิลด์บังคับว่างอยู่ด้านล่างของหน้า

**Steps**
1. คลิก Create โดยมีฟิลด์ผิดพลาด

**Expected**
หน้าเลื่อน (scroll) ไปยังฟิลด์แรกที่ไม่ผ่าน validation

---
## TC-RCP-400001 — เพิ่มวัตถุดิบ (ingredient) ในตาราง
> **As an** Operation Planner, **I want** to add ingredient rows to a recipe, **so that** I can build out the recipe composition.

**Priority:** High · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร ในส่วน Ingredients (โหมด edit)

**Steps**
1. คลิก Add first ingredient (เมื่อยังว่าง) หรือ Add ingredient
2. กรอกชื่อวัตถุดิบในแถวใหม่

**Expected**
แถววัตถุดิบใหม่ถูกเพิ่มในตาราง พร้อมคอลัมน์ Name, Qty, Unit, Cost, Yield %, Prep Notes และจำนวน ingredient count อัปเดต

---
## TC-RCP-400002 — แก้ไขปริมาณ/หน่วย/ต้นทุนของวัตถุดิบ
> **As an** Operation Planner, **I want** to edit each ingredient's quantity, unit and cost, **so that** the recipe cost reflects real values.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มีแถววัตถุดิบอย่างน้อย 1 แถวในตาราง Ingredients

**Steps**
1. แก้ไขค่า Qty, Unit และ Cost ในแถววัตถุดิบ

**Expected**
ค่าที่กรอกถูกบันทึกในแถว และยอดรวมต้นทุนปรับตามทันที

---
## TC-RCP-400003 — ลบแถววัตถุดิบ
> **As an** Operation Planner, **I want** to remove an ingredient row, **so that** the recipe composition stays correct.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
มีแถววัตถุดิบอย่างน้อย 1 แถว

**Steps**
1. คลิกปุ่ม X (Remove ingredient) ที่ท้ายแถว

**Expected**
แถวถูกลบออกและ ingredient count ลดลง; ยอดรวมต้นทุนปรับตาม

---
## TC-RCP-400004 — คำนวณ Total Recipe Cost จากวัตถุดิบ
> **As an** Operation Planner, **I want** the total recipe cost to sum the ingredient costs, **so that** I can see the recipe's material cost instantly.

**Priority:** High · **Test Type:** Functional

**Preconditions**
มีวัตถุดิบหลายแถวพร้อมค่า Cost

**Steps**
1. กรอกค่า Cost ให้แต่ละแถว
2. สังเกตแถวสรุป Total Recipe Cost

**Expected**
ค่า Total Recipe Cost (฿) เท่ากับผลรวมของ Cost ทุกแถว แสดงในแถวสรุปและหัวตาราง

---
## TC-RCP-400005 — เตือนเมื่อ Yield % ต่ำกว่า 90
> **As an** Operation Planner, **I want** a visual warning on low ingredient yield, **so that** I notice high-waste ingredients.

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**
มีแถววัตถุดิบในตาราง

**Steps**
1. กรอกค่า Yield % เป็นค่าน้อยกว่า 90 (เช่น 80)

**Expected**
ช่อง Yield % ของแถวนั้นแสดงด้วยสีเตือน (warning) เพื่อบ่งชี้ yield ต่ำ

---
## TC-RCP-410001 — กำหนด Prep / Cook time และ Base Yield ด้วย stepper
> **As an** Operation Planner, **I want** stepper controls for prep/cook time and base yield, **so that** I can set timings precisely and see live totals.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร ในส่วน Recipe Details (โหมด edit)

**Steps**
1. ใช้ปุ่ม + / − ของ Prep Time, Cook Time และ Base Yield ปรับค่า
2. สังเกต Quick Stats ใน hero

**Expected**
ค่าตัวเลขเปลี่ยนตาม stepper (ไม่ต่ำกว่า 0) และ Quick Stats (Prep, Cook, Yield, Total time) อัปเดตให้ตรงกัน

---
## TC-RCP-420001 — คำนวณ Cost per Portion / Margin ในคอนโซลต้นทุน
> **As an** Operation Planner, **I want** the cost console to compute cost-per-portion and margin, **so that** I can price the recipe profitably.

**Priority:** High · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มแก้ไขสูตรที่มีต้นทุนวัตถุดิบ/แรงงาน/overhead และ base yield

**Steps**
1. กรอกค่า Labor cost, Overhead cost และ Selling price ในคอนโซลต้นทุน (sticky)
2. สังเกตค่าที่คำนวณได้

**Expected**
คอนโซลต้นทุนแสดง Cost per Portion, Gross Margin และ Food Cost % ที่คำนวณจากต้นทุนรวมหารด้วย base yield

---
## TC-RCP-430001 — เลือกสารก่อภูมิแพ้มาตรฐานและกรอกแบบกำหนดเอง
> **As an** Operation Planner, **I want** to flag standard allergens and add custom ones, **so that** the recipe carries accurate allergen compliance data.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร ในส่วน Safety & Compliance

**Steps**
1. คลิกเลือก allergen chip มาตรฐาน (เช่น Milk, Eggs)
2. กรอก allergen แบบกำหนดเองในช่อง Other allergens (คั่นด้วยจุลภาค)
3. คลิก Save

**Expected**
allergen ที่เลือก/กรอกถูกรวมเป็นรายการเดียวและบันทึก; ตัวนับ flagged count อัปเดตตามจำนวน

---
## TC-RCP-430002 — สลับ Tag และ toggle Deduct from stock
> **As an** Operation Planner, **I want** to tag a recipe and control stock deduction, **so that** the recipe is categorized and inventory behaves correctly.

**Priority:** Low · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มแก้ไขสูตร

**Steps**
1. คลิก tag chip (เช่น Best Seller, Vegetarian) เพื่อเปิด/ปิด
2. คลิก toggle Deduct from stock ใน hero
3. คลิก Save

**Expected**
Tag ที่เลือกถูกบันทึกเป็นรายการ และสถานะ Deduct from stock ถูกบันทึกตามที่ toggle

---
## TC-RCP-440001 — อัปโหลดรูปภาพในแกลเลอรีสูตรอาหาร
> **As an** Operation Planner, **I want** to upload images to a recipe gallery, **so that** the recipe has visual reference for the kitchen.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**
อยู่ในฟอร์มสร้าง/แก้ไขสูตร (โหมด edit) ที่มี Recipe Image Gallery

**Steps**
1. เพิ่มไฟล์รูปภาพในแกลเลอรี hero
2. คลิก Save

**Expected**
รูปภาพถูกแนบกับ payload (images + gallery manifest) และแสดงในแกลเลอรีหลังบันทึก
