# Operation Plan — Category — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/operation-plan/category`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Operation Plan — Category (Recipe Category)
**Frontend route:** `routes/operation-plan/category`  •  **URL:** `/operation-plan/category` (และ `/operation-plan/category/new`, `/operation-plan/category/:id`)
**Prefix:** `OPCAT`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 25

> **หมายเหตุสำคัญสำหรับผู้รีวิว:** สอบทานกับโค้ดปัจจุบันเมื่อ 2026-09-20 (`routes/operation-plan/category/*` ทั้ง 13 ไฟล์ + `routes/router.tsx`, `constant/module-list.ts`, `constant/permissions.ts`, `messages/en.json`) ข้อเท็จจริงที่กระทบการเขียนเทส:
>
> 1. **โมดูลนี้เป็น 3 หน้าแยก ไม่ใช่ dialog** — `category.route` (list), `category-new.route` (`/new`), `category-edit.route` (`/:id`) ปุ่ม "Add Category" ทำ `navigate("/operation-plan/category/new")` ต่างจากโมดูล config หลายตัวที่ฟอร์มเป็น dialog
> 2. **บันทึกสำเร็จแล้วเด้งกลับหน้า list เสมอ** ทั้ง create และ update (`f.backToList()` ใน `recipe-category-form.tsx`) — พินไว้แล้วใน `recipe-category-form.characterization.test.tsx` ของฝั่งแอป ไม่ใช่อยู่หน้าเดิมและไม่เด้งไปใบที่เพิ่งสร้าง
> 3. **ฟอร์มไม่มีสวิตช์สถานะ** — `mapToPayload()` ส่ง `is_active: true` ตายตัวทุกครั้ง จึงสร้าง/แก้ให้เป็น inactive จากหน้านี้ไม่ได้ เคสกรอง Inactive (TC-OPCAT-010003) ต้องอาศัยข้อมูล inactive ที่มาจากทางอื่น (seed/backend)
> 4. **`level` ไม่มีช่องกรอกบนหน้าจอ** — อยู่ใน schema/payload และคำนวณอัตโนมัติจาก parent (`parent.level + 1`, ไม่มี parent = 1) จึงไม่มีเคสไหน assert ค่า level ผ่าน UI
> 5. **ปุ่ม Export / Print บนหัว list ถูก `disabled` พร้อม `title="Coming soon"`** (ทั้งปุ่มบน desktop และเมนู "..." บนมือถือ) — ยังไม่ได้ทำ จึงจงใจไม่มีเทสเคสครอบ
> 6. **ตัวกรองฝั่ง desktop เป็น popover สองชั้น** (กดปุ่ม Filter → เลื่อนไปที่ field → submenu โผล่ให้เลือก) ส่วนมือถือยังเป็น bottom sheet — สเตปของ TC-OPCAT-010003/010004 เขียนตามฝั่ง desktop เลือกค่าแล้วมีผลทันที ไม่มีปุ่ม Apply
> 7. **ตัวเลือกใน Parent filter มาจากหมวดหมู่ที่ `is_active = true` เท่านั้น** (ดึงทั้งชุดด้วย `perpage: -1`) หมวดหมู่ inactive จะไม่ปรากฏเป็นตัวเลือกให้กรอง
> 8. **คอลัมน์ Created / Updated มีอยู่จริงแต่ถูกซ่อนตั้งต้น** (`initialState.columnVisibility`) ต้องเปิดจากเมนู Toggle columns
> 9. **เมนูจุดสามจุดในแถวมีแค่ Activity กับ Delete ไม่มี Edit** — การเปิดรายละเอียดทำโดยคลิกที่ Code หรือ Name ซึ่งเป็น `<button>` (`CellAction`) **ไม่ใช่ `<a href>`** อย่าใช้ locator แบบลิงก์
> 10. **สิทธิ์เข้าหน้า** — `RouteGuard` เช็ค license ก่อน permission เสมอ; leaf ของหน้านี้คือ `permission: operation_plan.view` และ `licenseFeature: "operation_plan.category"` ไม่มีสิทธิ์ = เห็นกล่อง `AccessDeniedBlock` (`role="alert"` + หัวข้อ "Permission Denied") คาที่หน้าเดิม **ไม่ได้ redirect** — การเด้งออกแบบเงียบเกิดเฉพาะตอน feature ถูก `hidden` เท่านั้น และ admin bypass ใช้ได้กับ permission แต่ใช้กับ license ไม่ได้
> 11. **ข้อความ toast/dialog เป็นภาษาอังกฤษจาก `messages/en.json`** — "Recipe Category created successfully" / "updated" / "deleted", หัวข้อลบคือ "Delete Recipe Category", DiscardDialog คือ "Discard changes?" พร้อมปุ่ม "Keep editing" / "Discard"
> 12. **สเปกนี้อยู่ในหมวด section ที่ลงทะเบียนไว้แล้วของ `OPCAT` (01–05, 10, 20, 90) เท่านั้น** — พฤติกรรมเฉพาะโมดูล (parent lookup ตัดตัวเอง, โหมด view/edit) จึงไปอยู่ในบล็อก 04 แทนที่จะเปิด section 40 ใหม่

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-OPCAT-010001 | แสดงรายการหมวดหมู่สูตรอาหาร | High | Smoke |
| TC-OPCAT-010002 | ค้นหาหมวดหมู่ด้วยชื่อ/รหัส | High | Functional |
| TC-OPCAT-010003 | กรองตามสถานะ Active | Medium | Functional |
| TC-OPCAT-010004 | กรองตาม Parent category | Medium | Functional |
| TC-OPCAT-010005 | สลับมุมมอง List / Grid | Low | Functional |
| TC-OPCAT-010006 | เปิดคอลัมน์ Created/Updated จากเมนู Toggle columns | Low | Functional |
| TC-OPCAT-010007 | เรียงลำดับจากเมนู Sort และล้างกลับค่าเริ่มต้น | Low | Functional |
| TC-OPCAT-020001 | เปิดหน้ารายละเอียดหมวดหมู่จาก list | Medium | Happy Path |
| TC-OPCAT-020002 | เปิดแผง Activity จากหน้ารายละเอียด | Low | Functional |
| TC-OPCAT-030001 | สร้างหมวดหมู่ใหม่สำเร็จ | High | CRUD |
| TC-OPCAT-030002 | สร้างหมวดหมู่ย่อยโดยเลือก Parent | Medium | Happy Path |
| TC-OPCAT-030003 | ออกจากฟอร์มสร้างที่ยังไม่บันทึกแล้วมีกล่องเตือน | Medium | Alternate Flow |
| TC-OPCAT-040001 | แก้ไขชื่อหมวดหมู่แล้วค่าคงอยู่ | High | CRUD |
| TC-OPCAT-040002 | แก้ไขค่า Cost Settings และ Profit Margins | Medium | CRUD |
| TC-OPCAT-040003 | หน้ารายละเอียดอ่านอย่างเดียวจนกว่าจะกด Edit | Medium | Functional |
| TC-OPCAT-040004 | Parent lookup ไม่แสดงหมวดหมู่ที่กำลังแก้ไขเอง | Medium | Functional |
| TC-OPCAT-050001 | ลบหมวดหมู่จากเมนูในแถวของตาราง | High | CRUD |
| TC-OPCAT-050002 | ยกเลิกการลบใน dialog | Medium | Alternate Flow |
| TC-OPCAT-050003 | ลบหมวดหมู่จากปุ่ม Delete ในโหมด Edit | Medium | CRUD |
| TC-OPCAT-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าหมวดหมู่ | High | Authorization |
| TC-OPCAT-200001 | บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง | High | Validation |
| TC-OPCAT-200002 | จำกัดความยาว Code ไม่เกิน 10 ตัวอักษร | Medium | Validation |
| TC-OPCAT-200003 | จำกัดความยาว Name 100 และ Description 256 ตัวอักษร | Low | Validation |
| TC-OPCAT-900001 | ค้นหาด้วยคำที่ไม่มีผลลัพธ์ | Low | Edge Case |
| TC-OPCAT-900002 | เปิดหมวดหมู่ด้วย id ที่ไม่มีอยู่จริง | Low | Edge Case |

---
## TC-OPCAT-010001 — แสดงรายการหมวดหมู่สูตรอาหาร
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหมวดหมู่สูตรอาหารอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/operation-plan/category`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวข้อหน้าแสดง "Recipe Category" พร้อม badge จำนวนรายการ (แสดงเมื่อจำนวน > 0) และคำอธิบายใต้หัวข้อ; ตารางแสดงคอลัมน์ checkbox, #, Code, Name, Parent, Status และเมนูจุดสามจุดท้ายแถว โดยแถวที่ไม่มี parent แสดง "—"

---
## TC-OPCAT-010002 — ค้นหาหมวดหมู่ด้วยชื่อ/รหัส
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` และมีหลายหมวดหมู่
**Steps**
1. คลิกที่ช่อง Search บนแถบเครื่องมือ
2. พิมพ์ชื่อหรือรหัสของหมวดหมู่ที่มีอยู่
3. กด Enter
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ที่ตรงกับคำค้นหา (ค้นที่ฝั่ง server) — การพิมพ์อย่างเดียวไม่ยิงค้นหา ต้องกด Enter หรือกดปุ่มแว่นขยายเท่านั้น; เมื่อมีข้อความในช่อง ปุ่มท้ายช่องเปลี่ยนเป็นปุ่มล้าง (Clear search) ที่กดแล้วกลับมาแสดงทั้งหมด

---
## TC-OPCAT-010003 — กรองตามสถานะ Active
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop; มีหมวดหมู่ทั้งสถานะ active และ inactive (ข้อมูล inactive ต้องเตรียมจาก seed/backend เพราะฟอร์มสร้างไม่ได้ — ดูหมายเหตุข้อ 3)
**Steps**
1. คลิกปุ่ม "Filter"
2. เลื่อน/คลิกที่แถว "Status" ในเมนู เพื่อเปิด submenu
3. เลือก "Active"
**Expected**
ตารางแสดงเฉพาะแถวที่คอลัมน์ Status เป็น Active ทันทีโดยไม่ต้องกดยืนยัน; ปุ่ม Filter ขึ้น badge จำนวนตัวกรองที่ใช้อยู่ และแถบ "Filters:" (ActiveFilterBar) ใต้แถบเครื่องมือแสดง chip ของ Status พร้อมปุ่ม X สำหรับลบ

---
## TC-OPCAT-010004 — กรองตาม Parent category
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop; มีหมวดหมู่ที่กำหนด parent อย่างน้อย 1 รายการ และ parent นั้นมีสถานะ active
**Steps**
1. คลิกปุ่ม "Filter"
2. เลื่อน/คลิกที่แถว "Parent" เพื่อเปิด submenu (multi-select)
3. เลือก parent category หนึ่งรายการ
**Expected**
ตารางแสดงเฉพาะหมวดหมู่ลูกของ parent ที่เลือก และ ActiveFilterBar แสดง chip ของ Parent; รายชื่อในตัวเลือกมีเฉพาะหมวดหมู่ที่ active เท่านั้น

---
## TC-OPCAT-010005 — สลับมุมมอง List / Grid
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop (ปุ่มสลับมุมมองซ่อนบนจอเล็ก และจอมือถือถูกบังคับเป็น grid อยู่แล้ว)
**Steps**
1. คลิกปุ่ม "Grid view"
2. คลิกปุ่ม "List view" กลับ
**Expected**
โหมด grid แสดงการ์ดหมวดหมู่ (ชื่อเป็นหัวการ์ด พร้อมแถวสถานะ / Code / Parent Category / Description เท่าที่มีค่า) และเลื่อนลงเพื่อโหลดเพิ่มแบบ infinite scroll; กลับเป็น list แล้วได้ตารางพร้อมแถบแบ่งหน้าเหมือนเดิมและข้อมูลครบ

---
## TC-OPCAT-010006 — เปิดคอลัมน์ Created/Updated จากเมนู Toggle columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop; มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. ตรวจว่าตารางยังไม่มีคอลัมน์ Created และ Updated
2. คลิกปุ่ม "Toggle columns"
3. ติ๊กเปิด "Created" และ "Updated"
**Expected**
ตั้งต้นคอลัมน์ Created/Updated ถูกซ่อน; หลังติ๊กเปิดแล้วทั้งสองคอลัมน์ปรากฏในตารางพร้อมค่าเวลาจาก audit ของแต่ละแถว

---
## TC-OPCAT-010007 — เรียงลำดับจากเมนู Sort และล้างกลับค่าเริ่มต้น
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/operation-plan/category` บน viewport แบบ desktop; มีหมวดหมู่หลายรายการ
**Steps**
1. คลิกปุ่ม "Sort by" บนแถบเครื่องมือ
2. เลือก "Name"
3. คลิก "Name" ซ้ำอีกครั้งเพื่อสลับทิศ
4. เลือกแถว "Default"
**Expected**
เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้ (Code, Name, Parent, Status, Created, Updated); เลือกแล้วลำดับแถวเปลี่ยนตามและพารามิเตอร์ `sort` ถูกเขียนลง URL พร้อมปุ่ม Sort ติดสี primary; กด "Default" แล้ว `sort` ถูกล้างออกจาก URL และปุ่มกลับสีปกติ

---
## TC-OPCAT-020001 — เปิดหน้ารายละเอียดหมวดหมู่จาก list
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`; มีหมวดหมู่อย่างน้อย 1 รายการ
**Steps**
1. คลิกที่ข้อความ Code (หรือ Name) ของหมวดหมู่ในตาราง — เป็นปุ่ม ไม่ใช่ลิงก์
**Expected**
นำทางไปที่ `/operation-plan/category/{id}`; หัวฟอร์มแสดงชื่อหมวดหมู่พร้อม badge รหัส และปุ่ม Activity กับ Edit; ตัวฟอร์มแสดง 3 ส่วนคือ General Information, Default Cost Settings, Default Profit Margins พร้อมค่าที่บันทึกไว้

---
## TC-OPCAT-020002 — เปิดแผง Activity จากหน้ารายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/category/{id}` ของหมวดหมู่ที่บันทึกไว้แล้ว
**Steps**
1. คลิกปุ่ม "Activity" บนหัวฟอร์ม
**Expected**
เปิดแผง Activity ของ record นั้น (หัวข้อ "Activity") — ปุ่มนี้มีให้ทั้งโหมด view และ edit เพราะเป็นการดูไม่ใช่การแก้ และไม่มีในหน้า `/new` ที่ยังไม่มี record

---
## TC-OPCAT-030001 — สร้างหมวดหมู่ใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/operation-plan/category`
**Steps**
1. คลิกปุ่ม "Add Category"
2. ตรวจว่า URL เป็น `/operation-plan/category/new`
3. กรอก Code และ Name ด้วยค่าที่ไม่ซ้ำ
4. (เลือกได้) กรอก Description
5. คลิกปุ่ม "Create"
**Expected**
แสดง toast "Recipe Category created successfully"; แอปเด้งกลับไปที่ `/operation-plan/category` และหมวดหมู่ใหม่ปรากฏในตาราง (สถานะ Active เสมอ — ดูหมายเหตุข้อ 3)

---
## TC-OPCAT-030002 — สร้างหมวดหมู่ย่อยโดยเลือก Parent
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มี root category ที่ active อย่างน้อย 1 รายการ; อยู่ที่ `/operation-plan/category/new`
**Steps**
1. กรอก Code และ Name
2. คลิกช่อง "Parent Category" (ค่าเริ่มต้นคือ "Not Set") แล้วเลือก parent จาก lookup
3. คลิกปุ่ม "Create"
**Expected**
กลับไปหน้า list พร้อม toast สร้างสำเร็จ และแถวของหมวดหมู่ใหม่แสดงชื่อ parent ที่เลือกในคอลัมน์ Parent

---
## TC-OPCAT-030003 — ออกจากฟอร์มสร้างที่ยังไม่บันทึกแล้วมีกล่องเตือน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/operation-plan/category/new`
**Steps**
1. กรอก Code และ Name บางส่วน (ฟอร์มกลายเป็น dirty)
2. คลิกปุ่มย้อนกลับ (aria-label "Go back") ที่มุมซ้ายของหัวฟอร์ม
3. ในกล่องเตือน คลิก "Keep editing"
4. คลิกปุ่มย้อนกลับอีกครั้ง แล้วคลิก "Discard"
**Expected**
ขั้นที่ 2 ขึ้นกล่อง "Discard changes?" พร้อมข้อความว่ามีข้อมูลที่ยังไม่ได้บันทึก; "Keep editing" ปิดกล่องโดยยังอยู่หน้าเดิมและค่าที่กรอกยังอยู่ครบ; "Discard" พากลับไป `/operation-plan/category` โดยไม่สร้างรายการใหม่

---
## TC-OPCAT-040001 — แก้ไขชื่อหมวดหมู่แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่สร้างไว้แล้ว (เช่น จาก TC-OPCAT-030001)
**Steps**
1. เปิดหมวดหมู่จาก list แล้วคลิกปุ่ม "Edit"
2. แก้ไข Name เป็นค่าใหม่
3. คลิกปุ่ม "Save"
4. reload หน้า list
**Expected**
แสดง toast "Recipe Category updated successfully" และเด้งกลับไปหน้า list; ชื่อใหม่แสดงในตารางและยังคงอยู่หลัง reload

---
## TC-OPCAT-040002 — แก้ไขค่า Cost Settings และ Profit Margins
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่สร้างไว้แล้ว และเปิดหน้ารายละเอียดของหมวดหมู่นั้นอยู่
**Steps**
1. คลิก "Edit"
2. กรอกค่า Labor Cost Percentage, Overhead Percentage, Target Food Cost Percentage ในส่วน Default Cost Settings
3. กรอกค่า Minimum Profit Margin และ Target Profit Margin ในส่วน Default Profit Margins
4. คลิก "Save"
5. เปิดหมวดหมู่นั้นจาก list อีกครั้ง
**Expected**
ทุกช่องเป็น input ตัวเลข (step 0.01, ค่าต่ำสุด 0) มีสัญลักษณ์ % กำกับท้ายช่อง; หลังบันทึกกลับหน้า list พร้อม toast อัปเดตสำเร็จ และเมื่อเปิดซ้ำค่า cost settings กับ margins ที่กรอกแสดงเหมือนเดิม

---
## TC-OPCAT-040003 — หน้ารายละเอียดอ่านอย่างเดียวจนกว่าจะกด Edit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/operation-plan/category/{id}` ของหมวดหมู่ที่มีอยู่จริง
**Steps**
1. ตรวจสถานะของช่อง Code, Name, Parent Category, Description และช่องเปอร์เซ็นต์ทั้งห้า
2. คลิกปุ่ม "Edit"
3. ตรวจสถานะของช่องเดิมอีกครั้ง
4. คลิก "Cancel"
**Expected**
ก่อนกด Edit ทุกช่องถูก disable และหัวฟอร์มมีแค่ปุ่ม Activity กับ Edit; หลังกด Edit ช่องทั้งหมดแก้ไขได้และปุ่มเปลี่ยนเป็น Cancel / Save / Delete; กด Cancel ขณะยังไม่แก้อะไรจะกลับสู่โหมดอ่านอย่างเดียวทันทีโดยไม่มีกล่องเตือน

---
## TC-OPCAT-040004 — Parent lookup ไม่แสดงหมวดหมู่ที่กำลังแก้ไขเอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีหมวดหมู่ที่ active อย่างน้อย 2 รายการ; เปิดหน้ารายละเอียดของหมวดหมู่ A และกด "Edit" แล้ว
**Steps**
1. คลิกช่อง "Parent Category" เพื่อเปิด lookup
2. ค้นหาด้วยชื่อของหมวดหมู่ A เอง
**Expected**
รายการใน lookup ไม่มีหมวดหมู่ A (ถูกตัดออกด้วย `excludeIds`) และมีเฉพาะหมวดหมู่ที่ active เท่านั้น จึงเลือกตัวเองเป็น parent ไม่ได้

---
## TC-OPCAT-050001 — ลบหมวดหมู่จากเมนูในแถวของตาราง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่ไม่ถูกอ้างอิงและสามารถลบได้; อยู่ที่หน้า `/operation-plan/category` ในโหมด list
**Steps**
1. คลิกเมนูจุดสามจุด (aria-label "Row actions") ท้ายแถวของหมวดหมู่นั้น
2. คลิก "Delete"
3. ในกล่องยืนยัน คลิกปุ่ม "Delete"
4. reload หน้า
**Expected**
กล่องยืนยันมีหัวข้อ "Delete Recipe Category" และข้อความที่มีชื่อหมวดหมู่นั้น; ยืนยันแล้วแสดง toast "Recipe Category deleted successfully" หมวดหมู่หายไปจากตารางและไม่กลับมาหลัง reload

---
## TC-OPCAT-050002 — ยกเลิกการลบใน dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีหมวดหมู่อย่างน้อย 1 รายการ; อยู่ที่หน้า list
**Steps**
1. เปิดเมนูจุดสามจุดของแถวแล้วคลิก "Delete"
2. ในกล่องยืนยัน คลิก "Cancel"
**Expected**
กล่องปิดลงโดยไม่มีการลบ ไม่มี toast และหมวดหมู่ยังอยู่ในตารางเหมือนเดิม

---
## TC-OPCAT-050003 — ลบหมวดหมู่จากปุ่ม Delete ในโหมด Edit
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีหมวดหมู่ที่ลบได้ และเปิดหน้ารายละเอียดของหมวดหมู่นั้นอยู่
**Steps**
1. ตรวจว่าโหมด view ยังไม่มีปุ่ม Delete
2. คลิก "Edit"
3. คลิกปุ่ม "Delete" (ปุ่มสีแดง)
4. ยืนยันในกล่อง "Delete Recipe Category"
**Expected**
ปุ่ม Delete ปรากฏเฉพาะในโหมด edit เท่านั้น; ยืนยันแล้วแสดง toast ลบสำเร็จและแอปกลับไปที่ `/operation-plan/category` โดยไม่มีหมวดหมู่นั้นในตาราง

---
## TC-OPCAT-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าหมวดหมู่
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่ได้ถือ permission `operation_plan.view` และไม่ใช่ admin (BU เดียวกันและ feature `operation_plan.category` ยังอยู่ในสัญญา)
**Steps**
1. เข้า URL `/operation-plan/category` ตรง ๆ
**Expected**
ยังอยู่ที่ URL เดิมแต่เนื้อหาถูกแทนด้วยกล่อง `role="alert"` หัวข้อ "Permission Denied" พร้อมข้อความ "You don't have permission to view this page." และบรรทัด "Contact your administrator to request access." กับปุ่มพาไปหน้าที่เข้าได้ — ไม่มีข้อมูลหมวดหมู่ใด ๆ แสดง

---
## TC-OPCAT-200001 — บันทึกไม่ได้เมื่อเว้น Code/Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/category/new`
**Steps**
1. ปล่อยช่อง Code และ Name ว่าง
2. คลิก "Create"
**Expected**
แสดงข้อความ error "Code is required" และ "Name is required" ใต้ช่องที่ผิด, หน้าเลื่อนไปที่ช่องแรกที่ไม่ผ่าน, ไม่มี toast และไม่มีการสร้างหมวดหมู่ (ยังอยู่หน้า `/new`)

---
## TC-OPCAT-200002 — จำกัดความยาว Code ไม่เกิน 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/category/new`
**Steps**
1. พิมพ์ข้อความยาวเกิน 10 ตัวอักษรลงในช่อง Code
**Expected**
ช่อง Code รับได้สูงสุด 10 ตัวอักษร (`maxLength=10`) ส่วนที่เกินไม่ถูกรับเข้าช่อง

---
## TC-OPCAT-200003 — จำกัดความยาว Name 100 และ Description 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/operation-plan/category/new`
**Steps**
1. พิมพ์ข้อความยาวเกิน 100 ตัวอักษรลงในช่อง Name
2. พิมพ์ข้อความยาวเกิน 256 ตัวอักษรลงในช่อง Description
**Expected**
Name ถูกตัดที่ 100 ตัวอักษร และ Description (textarea) ถูกตัดที่ 256 ตัวอักษร ตาม `maxLength` ของแต่ละช่อง

---
## TC-OPCAT-900001 — ค้นหาด้วยคำที่ไม่มีผลลัพธ์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/operation-plan/category`
**Steps**
1. พิมพ์คำค้นหาที่ไม่ตรงกับหมวดหมู่ใด เช่น "zzzznotfound"
2. กด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดงสถานะว่าง (EmptyComponent) พร้อมข้อความ "No data found" — ใช้ได้ทั้งโหมด list และ grid

---
## TC-OPCAT-900002 — เปิดหมวดหมู่ด้วย id ที่ไม่มีอยู่จริง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เข้า URL `/operation-plan/category/{uuid ที่ไม่มีอยู่ในระบบ}` ตรง ๆ
**Expected**
แสดงกล่อง `role="alert"` หัวข้อ "Something went wrong" พร้อมข้อความเฉพาะโมดูล "Recipe category not found"; ไม่มีปุ่ม "Try again" (เป็นทางตัน) แต่มีปุ่ม "Back to list" ที่พากลับไป `/operation-plan/category` และปุ่ม "Go to dashboard"
