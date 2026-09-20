# Product — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/product-management/product`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Product
**Frontend route:** `routes/product-management/product/...`  •  **URL:** `/product-management/product` (และ `/product-management/product/new`, `/product-management/product/:id`)
**Prefix:** `PROD`
**Default role:** Product Manager / Admin
**Total test cases:** 52

> หมายเหตุสำคัญสำหรับผู้รีวิว: แคตตาล็อกนี้ถูกสอบทานใหม่กับโค้ดจริงเมื่อ 2026-09-20 (ของเดิมเขียน 2026-06-17 และโมดูลนี้มี 78 คอมมิตหลังจากนั้น) สิ่งที่เปลี่ยน:
>
> - **ลบ 3 เคส** เพราะฟีเจอร์ที่ทดสอบไม่มีอยู่แล้ว — `TC-PROD-030002` (Required checklist 7 ช่อง ถูกถอดออก เหลือแค่ข้อความ hint "Fill in the required fields to save" ข้าง badge Draft), `TC-PROD-200002` + `TC-PROD-200003` (ช่อง **Code ถูกล็อกแล้ว** — โหมด add เป็น disabled input placeholder "Auto-generated" และ `buildPayload` ส่ง `code: undefined` ตอนสร้าง เซิร์ฟเวอร์ออกรหัสให้เอง schema ไม่มี `max(10)` แล้ว จึงพิมพ์ code เองไม่ได้และทดสอบ code ซ้ำจากหน้า UI ไม่ได้)
> - **แก้เนื้อหาโดยคง ID เดิมทั้งหมด** ของอีก 27 เคส จุดที่ต่างจากเอกสารเดิม:
>   - ชื่อแท็บจริงคือ **General / Unit / Location Assignment / Eco Labels** (ไม่ใช่ Units/Locations) และทุกแท็บมี badge ตัวนับต่อท้าย
>   - **ช่องบังคับชุดใหม่**: name, Local name, Category, Sub Category, Item Group, Inventory Unit, Price — โดย category/sub-category กลายเป็นช่องบังคับใน zod แล้ว (เดิมเป็น state เฉย ๆ) และ **cascade**: Sub Category ถูก disable จนกว่าจะเลือก Category, Item Group ถูก disable จนกว่าจะเลือก Sub Category
>   - submit ไม่ผ่าน → **toast.warning** `"Some details are missing — jumped to the field to fix."` (ไม่ใช่ error toast) + จุดแดงบนแท็บ + **เด้งไปแท็บแรกที่ผิดให้เอง**
>   - status badge ของ list ใช้ `StatusDotBadge` tone `success`/**`neutral`** (ไม่ใช่ `destructive`)
>   - ตาราง list มีคอลัมน์ **Created/Updated เพิ่มเข้ามาแต่ซ่อนไว้เป็นค่าเริ่มต้น** เปิดได้จากเมนูเลือกคอลัมน์
>   - ตาราง Location Assignment **ไม่มีคอลัมน์ Reorder Qty แล้ว** (เหลือ Min Qty / Max Qty / Par Qty) แต่เพิ่มคอลัมน์ **Shelf** และช่องค้นหาในหัว section
>   - Attribute label เป็น **Select จากรายการตายตัว 15 ค่า + "Custom…"** ไม่ใช่ช่องพิมพ์อิสระ
>   - ปุ่ม Delete ในฟอร์มแสดง **เฉพาะโหมด edit**; โหมด view มีแค่ Activity + Edit
>   - filter desktop เปลี่ยนจาก sheet เป็น **popover เมนูสองชั้น**; มือถือยังเป็น bottom sheet; ปุ่มล้างทั้งหมดใน ActiveFilterBar มีป้ายว่า **"Clear"**
> - **เพิ่ม 25 เคสใหม่** ครอบพฤติกรรมที่เพิ่งมี: saved views / sort menu / column visibility / chip แก้ค่า inline (01), Activity sheet + หน้า 404 + ปุ่ม Back (02), code auto-generate + cascade + auto-fill จาก item group + order unit ที่เติมให้อัตโนมัติ (03), Save disabled จนกว่าจะ dirty + navigation guard + รูปที่อัปโหลดตอน Save (04), ลบจากฟอร์ม/จากการ์ด (05), permission-denied dialog (10), maxLength ของ local name/description + เพดาน deviation + เด้งแท็บ (20), ingredient unit gate + eco label dialog + shelf/location cascade (40)
> - **Blocker ที่คนแปลงเป็น spec ต้องรู้**:
>   1. **ไม่มีทางกรอก product code เองได้เลย** เคสใด ๆ ที่ต้องการ code ที่คาดเดาได้ต้องอ่าน code จากหน้า detail หลังสร้าง ไม่ใช่กำหนดล่วงหน้า และ `buildEntity`/`fakeCode` ใช้กับโมดูลนี้ไม่ได้ในส่วนของ code
>   2. การสร้างสินค้าต้องมี master data พร้อม 3 ชั้น (Category → Sub Category → Item Group ที่ `is_active`) + Unit อย่างน้อย 1 ตัว ถ้าไม่มี ฟอร์มจะติดที่ cascade ไปต่อไม่ได้
>   3. section **Images แสดงเฉพาะเมื่อมี product แล้ว** (`{product && ...}`) จึงทดสอบรูปได้เฉพาะโหมด view/edit ไม่ใช่หน้า `/new`
>   4. แท็บ **Eco Labels แสดงเฉพาะเมื่อมี `product.id`** และเป็น CRUD อิสระที่ยิง API ทันที ไม่ผ่านปุ่ม Save ของฟอร์ม
>   5. ปุ่มฝั่งขวาของ toolbar (sort / column visibility / สลับ list-grid) **ซ่อนบนจอ < 640px** และจอ < 768px ถูกบังคับเป็น grid + infinite scroll เสมอ
>   6. Save ในโหมด edit ถูก disable จนกว่าฟอร์มจะ dirty — ต้องแก้ค่าจริงก่อนถึงจะกดได้
>
> หมายเหตุเดิมที่ยังจริง: sub-category / item-group เป็น nested config ภายใต้ category (`routes/product-management/category`) อยู่นอกขอบเขตเอกสารนี้ แต่ใช้เป็น filter/lookup

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PROD-010001 | หน้า list สินค้าโหลดสำเร็จ | High | Smoke |
| TC-PROD-010002 | ปุ่ม Add Product แสดงและคลิกไปหน้า new ได้ | High | Smoke |
| TC-PROD-010003 | ตาราง list แสดงคอลัมน์ครบตามที่ออกแบบ | Medium | Functional |
| TC-PROD-010004 | ค้นหาด้วยคำที่มีอยู่ — list กรองตรงคำค้น | Medium | Functional |
| TC-PROD-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-PROD-010006 | filter Status (Active/Inactive) ใช้งานได้ | Medium | Functional |
| TC-PROD-010007 | filter Category / Sub Category / Item Group (multi-select) ใช้งานได้ | Medium | Functional |
| TC-PROD-010008 | ActiveFilterBar ลบ chip ทีละอัน และปุ่ม Clear | Medium | Functional |
| TC-PROD-010009 | สลับ list / grid view บน desktop | Low | Functional |
| TC-PROD-010010 | Export เป็นไฟล์ xlsx และ Print | Low | Functional |
| TC-PROD-010011 | กด chip ใน ActiveFilterBar แล้วแก้ค่า filter ได้ทันที | Low | Functional |
| TC-PROD-010012 | เมนู Sort เรียงคอลัมน์และกลับค่า Default ได้ | Medium | Functional |
| TC-PROD-010013 | เมนูเลือกคอลัมน์เปิด/ปิดคอลัมน์ Created·Updated ได้ | Low | Functional |
| TC-PROD-010014 | บันทึก filter ปัจจุบันเป็น saved view แล้วเรียกกลับมาใช้ได้ | Medium | Functional |
| TC-PROD-020001 | คลิก code หรือ name เปิดหน้า detail ในโหมด view | High | Smoke |
| TC-PROD-020002 | หน้า detail แสดงแท็บครบพร้อม badge ตัวนับ | Medium | Functional |
| TC-PROD-020003 | โหมด view เป็น read-only จนกว่าจะกด Edit | High | Functional |
| TC-PROD-020004 | ปุ่ม Activity ในหัวฟอร์มเปิดแผงประวัติได้ | Low | Functional |
| TC-PROD-020005 | เปิด product id ที่ไม่มีอยู่จริงต้องเจอ error state | Medium | Negative |
| TC-PROD-020006 | ปุ่ม Back กลับหน้า list เสมอ | Medium | Functional |
| TC-PROD-030001 | เปิดหน้า new form สำเร็จ | High | Smoke |
| TC-PROD-030003 | สร้างสินค้าขั้นต่ำสำเร็จ | High | CRUD |
| TC-PROD-030004 | สร้างสินค้าพร้อม attribute row | Medium | CRUD |
| TC-PROD-030005 | สร้างสินค้าพร้อม location 1 รายการ | Medium | CRUD |
| TC-PROD-030006 | ช่อง Code ในโหมด add ถูกล็อกและขึ้นว่า Auto-generated | Medium | Functional |
| TC-PROD-030007 | Category → Sub Category → Item Group ทำงานแบบ cascade | High | Functional |
| TC-PROD-030008 | เลือก Item Group แล้วเติมค่า deviation·flags·tax profile ให้อัตโนมัติ | Medium | Functional |
| TC-PROD-030009 | สร้างสินค้าโดยไม่เพิ่ม order unit แล้วระบบเติม order unit เริ่มต้นให้ | Medium | CRUD |
| TC-PROD-040001 | แก้ name/price ของสินค้าแล้ว save persist | High | CRUD |
| TC-PROD-040002 | toggle Status active → inactive แล้ว persist | Medium | CRUD |
| TC-PROD-040003 | Cancel ระหว่าง edit ที่ dirty ต้องเตือน discard | Medium | Functional |
| TC-PROD-040004 | ปุ่ม Save ในโหมด edit ถูกปิดจนกว่าฟอร์มจะถูกแก้ | Medium | Functional |
| TC-PROD-040005 | ออกจากฟอร์มที่ยังไม่ได้บันทึกผ่านเมนูข้างต้องถูกเตือน | Medium | Functional |
| TC-PROD-040006 | เลือกรูปในโหมด edit แล้วอัปโหลดจริงตอนกด Save | Medium | CRUD |
| TC-PROD-050001 | เปิด delete dialog จาก list แล้ว cancel — แถวยังอยู่ | Medium | Functional |
| TC-PROD-050002 | ลบสินค้าจาก list สำเร็จและหายจาก list | High | CRUD |
| TC-PROD-050003 | ลบสินค้าจากปุ่ม Delete ในหัวฟอร์มโหมด edit | Medium | CRUD |
| TC-PROD-050004 | ลบสินค้าจากการ์ดในโหมด grid | Low | CRUD |
| TC-PROD-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-PROD-100002 | ผู้ใช้ที่ไม่มีสิทธิ์ลบกด Delete แล้วเจอ permission dialog | Medium | Authorization |
| TC-PROD-200001 | บันทึกโดยไม่กรอกช่องบังคับ ต้องถูกบล็อกพร้อมเตือน | High | Validation |
| TC-PROD-200004 | Local name ถูกจำกัดที่ 100 ตัวอักษร | Medium | Validation |
| TC-PROD-200005 | Description ถูกจำกัดที่ 256 ตัวอักษร | Low | Validation |
| TC-PROD-200006 | Price Dev. / Qty Dev. เกิน 100 ถูก reject | Medium | Validation |
| TC-PROD-200007 | submit จากแท็บอื่นแล้วเด้งไปแท็บที่กรอกผิด | Medium | Functional |
| TC-PROD-400001 | เพิ่ม order unit conversion และตั้ง default ได้ | Medium | Functional |
| TC-PROD-400002 | To Qty น้อยกว่า 1 ถูก reject | Medium | Validation |
| TC-PROD-400003 | Ingredient Unit เพิ่มได้ต่อเมื่อเปิด Used in Recipe | Medium | Functional |
| TC-PROD-400004 | เพิ่ม Eco Label ผ่าน dialog และตัวนับบนแท็บอัปเดต | Medium | CRUD |
| TC-PROD-400005 | ตาราง Location ค้นหาได้ และคลังที่เลือกแล้วไม่ถูกเสนอซ้ำ | Medium | Functional |
| TC-PROD-400006 | ช่อง Shelf ผูกกับ Location ที่เลือก | Medium | Functional |
| TC-PROD-900001 | จอ mobile แสดงเป็น card grid + infinite scroll | Low | Edge Case |

---
## TC-PROD-010001 — หน้า list สินค้าโหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Product Manager/Admin ที่มีสิทธิ์ `product_management.product.view` และเลือก Business Unit แล้ว
**Steps**
1. ไปที่ `/product-management/product`
2. รอให้หน้าโหลดเสร็จ
**Expected**
URL ตรงกับ `/product-management/product`, หัวข้อหน้า "Products" พร้อมคำอธิบายใต้หัวข้อแสดง (มี badge จำนวนรายการต่อท้ายเมื่อจำนวน > 0) และตาราง/empty-state ปรากฏภายใน 10s

---
## TC-PROD-010002 — ปุ่ม Add Product แสดงและคลิกไปหน้า new ได้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product`
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม "Add Product"
**Expected**
ปุ่ม "Add Product" visible และเมื่อคลิกแล้ว URL เปลี่ยนเป็น `/product-management/product/new`

---
## TC-PROD-010003 — ตาราง list แสดงคอลัมน์ครบตามที่ออกแบบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าอย่างน้อย 1 รายการใน list และอยู่ในโหมด list (desktop)
**Steps**
1. ไปที่ `/product-management/product`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดง checkbox เลือกแถว, คอลัมน์ลำดับ (#), Code, Name, Local Name, Unit, Category, Sub Category, Item Group, Status และคอลัมน์ action ท้ายแถว — Status เป็น dot badge tone success เมื่อ active และ neutral เมื่อ inactive; คอลัมน์ Created และ Updated ถูกซ่อนเป็นค่าเริ่มต้น

---
## TC-PROD-010004 — ค้นหาด้วยคำที่มีอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่ทราบ code/name อยู่ใน DB
**Steps**
1. ไปที่ `/product-management/product`
2. พิมพ์คำค้น (code หรือ name ที่มีอยู่) ในช่องค้นหา แล้วกด Enter (ช่องค้นยิงเฉพาะตอน Enter หรือกดปุ่มแว่น)
**Expected**
list แสดงเฉพาะแถวที่ตรงคำค้น และ badge จำนวนรายการอัปเดตตามผลลัพธ์

---
## TC-PROD-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product`
**Steps**
1. ไปที่ `/product-management/product`
2. พิมพ์คำที่ไม่มี (เช่น `__NOPE__<UID>`) ในช่องค้นหาแล้วกด Enter
**Expected**
empty-state placeholder ปรากฏภายใน 10s และไม่มีแถวข้อมูลในตาราง

---
## TC-PROD-010006 — filter Status (Active/Inactive)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product` บน desktop (≥ 768px)
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม Filter แล้วชี้ที่แถว Status เพื่อเปิด submenu
3. เลือก Active
**Expected**
list แสดงเฉพาะสินค้าที่ status active, badge จำนวนอัปเดต, ปุ่ม Filter มี badge นับจำนวน filter และ ActiveFilterBar แสดง chip ของ Status ที่เลือก

---
## TC-PROD-010007 — filter Category / Sub Category / Item Group (multi-select)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มี Category / Sub Category / Item Group ที่ `is_active` อย่างน้อยอย่างละ 1 รายการ และมีสินค้าที่ผูกกับค่าเหล่านั้น
**Steps**
1. ไปที่ `/product-management/product`
2. เปิดเมนู Filter → หมวด Category แล้วเลือก 1 ค่า
3. เปิดเมนู Filter → Item Group แล้วเลือก 1 ค่า
**Expected**
list กรองตามทุกค่าที่เลือกพร้อมกัน, หน้าถูก reset กลับหน้า 1 และ chip ของแต่ละ filter แสดงใน ActiveFilterBar — ตัวเลือกของสามช่องนี้เป็นอิสระต่อกัน (เลือก Category แล้วรายการ Sub Category/Item Group ไม่ถูกกรองตาม)

---
## TC-PROD-010008 — ActiveFilterBar ลบ chip ทีละอัน และปุ่ม Clear
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มี filter อย่างน้อย 2 ตัวถูกเลือกไว้ (เช่น Status + Category)
**Steps**
1. ไปที่ `/product-management/product` แล้วเลือก filter หลายตัว
2. คลิกปุ่ม X (`Remove <label> filter`) บน chip หนึ่งใน ActiveFilterBar
3. คลิกปุ่ม "Clear" ท้ายแถบ
**Expected**
การกด X ลบเฉพาะ filter ตัวนั้น (chip อื่นยังอยู่) และปุ่ม Clear ล้าง filter ทั้งชุดจน ActiveFilterBar หายไปและ list กลับมาแสดงทั้งหมด

---
## TC-PROD-010009 — สลับ list / grid view บน desktop
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน viewport desktop (≥ 640px), มีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม grid view (aria-label ของ grid view)
3. คลิกปุ่ม list view กลับ
**Expected**
grid view แสดงสินค้าเป็นการ์ด (ชื่อ + badge สถานะ + แถว Code/Local Name/Unit/Category/Sub Category/Item Group), list view แสดงเป็นตาราง — สลับได้โดยไม่มี error

---
## TC-PROD-010010 — Export เป็นไฟล์ xlsx และ Print
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, มีสินค้าใน list อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม Export แล้วรอไฟล์
3. คลิกปุ่ม Print
**Expected**
Export ดาวน์โหลดไฟล์ `.xlsx` ที่ชื่อขึ้นต้นด้วย `product` และมีคอลัมน์ Code / Name / Local Name / Unit / Category / Sub Category / Item Group / Status พร้อม toast "Exported {count} records" (ถ้าไม่มีข้อมูลจะได้ warning "No data to export"); Print เปิด print dialog ของเบราว์เซอร์

---
## TC-PROD-010011 — กด chip ใน ActiveFilterBar แล้วแก้ค่า filter ได้ทันที
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, เลือก filter Status = Active ไว้แล้ว (มี chip ใน ActiveFilterBar)
**Steps**
1. ไปที่ `/product-management/product` แล้วตั้ง filter Status = Active
2. คลิกที่ตัว chip (ไม่ใช่ปุ่ม X)
3. เลือก Inactive ใน popover ที่เด้งขึ้นมา
**Expected**
popover ตัวเลือกของ field นั้นเปิดใต้ chip, เลือกค่าใหม่แล้ว list กรองตามค่าใหม่ทันทีและข้อความบน chip เปลี่ยนตาม โดยไม่ต้องกลับไปเปิดเมนู Filter

---
## TC-PROD-010012 — เมนู Sort เรียงคอลัมน์และกลับค่า Default ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, มีสินค้าอย่างน้อย 2 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. เปิดเมนู Sort บน toolbar แล้วเลือกคอลัมน์ Name
3. กดคอลัมน์ Name ซ้ำเพื่อสลับทิศ
4. เลือกแถว "Default"
**Expected**
เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้ (Code, Name, Local Name, Unit, Status), เลือกแล้วลำดับแถวเปลี่ยนตามและ `sort` ปรากฏใน URL, กดซ้ำสลับทิศ, เลือก Default แล้ว `sort` ถูกล้างออกจาก URL

---
## TC-PROD-010013 — เมนูเลือกคอลัมน์เปิด/ปิดคอลัมน์ Created·Updated ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, อยู่ในโหมด list และมีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. เปิดเมนูเลือกคอลัมน์ (ปุ่มไอคอนคอลัมน์บน toolbar)
3. ติ๊กเปิดคอลัมน์ Created และ Updated
**Expected**
ก่อนติ๊ก ตารางไม่มีคอลัมน์ Created/Updated; หลังติ๊ก ทั้งสองคอลัมน์ปรากฏในตารางพร้อมวันที่-เวลา และเครื่องหมายถูกในเมนูตรงกับสถานะจริงของคอลัมน์

---
## TC-PROD-010014 — บันทึก filter ปัจจุบันเป็น saved view แล้วเรียกกลับมาใช้ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, ยังไม่มี saved view ชื่อเดียวกับที่จะใช้ทดสอบ
**Steps**
1. ไปที่ `/product-management/product` แล้วตั้ง filter Status = Active
2. เปิด dropdown View แล้วเลือก "Save current filters as view"
3. ตั้งชื่อ view + เลือก Visibility = "Only me" แล้วกด Save
4. เปิด dropdown View แล้วเลือก "No view" จากนั้นเลือก view ที่เพิ่งบันทึกกลับมา
**Expected**
บันทึกแล้วขึ้น toast `View "<name>" saved`, ชื่อ view ปรากฏบนปุ่ม View และอยู่ในกลุ่ม "My views"; เมื่อเลือกกลับมา filter Status = Active ถูก apply อีกครั้งและ chip กลับมาแสดง

---
## TC-PROD-020001 — คลิก code หรือ name เปิดหน้า detail ในโหมด view
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, มีสินค้าอย่างน้อย 1 รายการใน list
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกข้อความ code (หรือ name) ของสินค้าแถวหนึ่ง
**Expected**
URL เปลี่ยนเป็น `/product-management/product/<uuid>`, หัวฟอร์มแสดงชื่อสินค้าเป็น title + local name เป็น subtitle + badge สถานะ, ทุกช่องเป็น read-only และปุ่ม Edit กับ Activity visible

---
## TC-PROD-020002 — หน้า detail แสดงแท็บครบพร้อม badge ตัวนับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่
**Steps**
1. เปิด `/product-management/product/<id>`
2. ตรวจรายการแท็บ
3. คลิกสลับแต่ละแท็บ
**Expected**
มีแท็บ "General", "Unit", "Location Assignment" และ "Eco Labels" (แท็บ Eco Labels แสดงเฉพาะเมื่อเปิดสินค้าที่มีอยู่แล้ว) — แต่ละแท็บมี badge ตัวเลขต่อท้ายเมื่อมีรายการ (General นับ attribute, Unit นับ order + ingredient units, Location Assignment นับ location, Eco Labels นับใบรับรอง) และสลับแท็บได้โดยไม่ error

---
## TC-PROD-020003 — โหมด view เป็น read-only จนกว่าจะกด Edit
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่ (โหมด view)
**Steps**
1. เปิด `/product-management/product/<id>`
2. สังเกตช่องในแท็บ General (แสดงเป็นกล่องค่าแบบ disabled — ค่าว่างขึ้น `—`) และตารางในแท็บอื่น ๆ ที่ไม่มีปุ่มเพิ่ม/ลบแถว
3. กดปุ่ม Edit
**Expected**
ก่อนกด Edit: ไม่มี input ที่พิมพ์ได้, ไม่มีปุ่ม "Add attribute"/"Add Location"/"Add Order Unit"/"Add Eco Label", และปุ่มที่เห็นมีแค่ Activity กับ Edit; หลังกด Edit: ช่องกลายเป็น input แก้ไขได้ ปุ่มเปลี่ยนเป็น Activity / Delete / Cancel / Save และปุ่มเพิ่มแถวของแต่ละตารางปรากฏ

---
## TC-PROD-020004 — ปุ่ม Activity ในหัวฟอร์มเปิดแผงประวัติได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่
**Steps**
1. เปิด `/product-management/product/<id>`
2. คลิกปุ่ม "Activity"
**Expected**
แผง Activity เปิดขึ้นพร้อมหัวข้อ "Activity" และคำอธิบาย "Everything done to this record, newest first" — แสดงรายการกิจกรรมของสินค้านั้น หรือข้อความ "No activity recorded yet" เมื่อยังไม่มีประวัติ

---
## TC-PROD-020005 — เปิด product id ที่ไม่มีอยู่จริงต้องเจอ error state
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ล็อกอินแล้ว, มี uuid ที่ไม่ตรงกับสินค้าใด ๆ
**Steps**
1. เปิด `/product-management/product/00000000-0000-0000-0000-000000000000` โดยตรง
**Expected**
หน้าแสดง error state พร้อมข้อความ "Product not found" และมีปุ่มกลับไปหน้า `/product-management/product` — ไม่มีฟอร์มเปล่าค้างอยู่และไม่ crash

---
## TC-PROD-020006 — ปุ่ม Back กลับหน้า list เสมอ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่ในโหมด view (ยังไม่แก้อะไร)
**Steps**
1. ไปที่ `/product-management/product` แล้วคลิกเข้าสินค้าหนึ่ง
2. สลับไปแท็บ "Unit" แล้วกลับมาแท็บ "General"
3. กดปุ่ม Back ("Go back") ที่หัวฟอร์ม
**Expected**
URL กลับไปที่ `/product-management/product` ในคลิกเดียว (ไม่ถอย history ทีละหน้า) และหน้า list แสดงตามปกติ

---
## TC-PROD-030001 — เปิดหน้า new form สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, มีสิทธิ์สร้างสินค้า
**Steps**
1. ไปที่ `/product-management/product/new`
**Expected**
URL ตรงกับ `/product-management/product/new`, หัวฟอร์มแสดง title "New product", badge "Draft", subtitle "Never saved", ข้อความ "Fill in the required fields to save" ข้าง badge และปุ่ม "Create product" visible (ไม่มีปุ่ม Delete และไม่มีปุ่ม Activity ในโหมดนี้)

---
## TC-PROD-030003 — สร้างสินค้าขั้นต่ำสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มี Category → Sub Category → Item Group ที่ `is_active` ครบสายอย่างน้อย 1 ชุด และมี Unit อย่างน้อย 1 ตัว; NAME ที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/product-management/product/new`
2. กรอก Name และ Local name
3. เลือก Category → Sub Category → Item Group ตามลำดับ
4. เลือก Inventory Unit
5. กรอก Price
6. กด "Create product"
7. กลับหน้า list แล้วค้นหาด้วย NAME
**Expected**
แสดง toast "Product created successfully", redirect ไปหน้า detail ของสินค้าใหม่ (`/product-management/product/<uuid>`) ที่มี product code ซึ่งระบบออกให้เอง และค้นหาเจอสินค้านั้นใน list ภายใน 10s

---
## TC-PROD-030004 — สร้างสินค้าพร้อม attribute row
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, NAME ที่จะใช้ยังไม่มีใน DB และ master data สำหรับ cascade พร้อม
**Steps**
1. เปิด new form แล้วกรอกช่องบังคับให้ครบ (ดู TC-PROD-030003)
2. เลื่อนไป section "Additional Attributes" แล้วกดปุ่ม "Add first attribute"
3. ในคอลัมน์ Name เลือก label จากรายการ (เช่น `country of origin`) และกรอกคอลัมน์ Description = `Thailand`
4. กด "Create product"
5. เปิดหน้า detail ของสินค้าที่สร้าง
**Expected**
ช่อง label เป็น Select ที่มีตัวเลือกตายตัว (allergens, calories, serving size, … , warranty) และตัวเลือก "Custom…" ไม่ใช่ช่องพิมพ์อิสระ; สร้างสำเร็จแล้ว section "Additional Attributes" ในหน้า detail แสดง `country of origin: Thailand` และแท็บ General มี badge ตัวนับ 1

---
## TC-PROD-030005 — สร้างสินค้าพร้อม location 1 รายการ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, NAME ที่จะใช้ยังไม่มีใน DB, มี Location ที่เลือกได้อย่างน้อย 1 แห่ง
**Steps**
1. เปิด new form แล้วกรอกช่องบังคับให้ครบ
2. ไปแท็บ "Location Assignment" แล้วกดปุ่ม "Add Location"
3. เลือก Location แล้วกรอก Min Qty / Max Qty / Par Qty
4. กด "Create product"
5. เปิด detail ของสินค้าที่สร้าง แล้วไปแท็บ "Location Assignment"
**Expected**
ตาราง location มีคอลัมน์ #, Location, Type, Shelf, Min Qty, Max Qty, Par Qty, Status (ไม่มีคอลัมน์ Reorder Qty); สร้างสำเร็จแล้ว detail แสดง location ที่เพิ่มพร้อมค่า qty ที่กรอก และแท็บมี badge ตัวนับ 1

---
## TC-PROD-030006 — ช่อง Code ในโหมด add ถูกล็อกและขึ้นว่า Auto-generated
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด `/product-management/product/new`
2. พยายามคลิกและพิมพ์ในช่อง Code
**Expected**
ช่อง Code อยู่ใน section "Product Identification" แต่ถูก disable และแสดง placeholder "Auto-generated" — พิมพ์ค่าลงไปไม่ได้ และไม่มี asterisk บังคับกรอก

---
## TC-PROD-030007 — Category → Sub Category → Item Group ทำงานแบบ cascade
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`, มี Category ที่มี Sub Category และ Item Group ใต้สังกัดอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. เปิด new form แล้วดู section "Classification"
2. เลือก Category แล้วเปิด Sub Category
3. เลือก Sub Category แล้วเปิด Item Group
4. กลับไปเปลี่ยน Category เป็นค่าอื่น
**Expected**
ก่อนเลือก Category ช่อง Sub Category ถูก disable; เลือก Category แล้ว Sub Category ใช้งานได้และแสดงเฉพาะรายการใต้ Category นั้น; ก่อนเลือก Sub Category ช่อง Item Group ถูก disable; เมื่อเปลี่ยน Category ค่า Sub Category และ Item Group เดิมถูกล้างให้ว่าง — ทั้งสามช่องมีเครื่องหมายบังคับกรอก

---
## TC-PROD-030008 — เลือก Item Group แล้วเติมค่า deviation·flags·tax profile ให้อัตโนมัติ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มี Item Group ที่ตั้งค่า price deviation limit / qty deviation limit / used in recipe / sold directly / tax profile ไว้แล้ว
**Steps**
1. เปิด `/product-management/product/new`
2. เลือก Category → Sub Category → Item Group ที่เตรียมไว้
3. ดู section "Deviations & Thresholds", "Unit & Tax" และ "Product Flags"
**Expected**
ช่อง Price Dev. และ Qty Dev. ถูกเติมด้วยค่าจาก item group, สวิตช์ "Used in Recipe" และ "Sold Directly" ถูกตั้งตามค่าของ item group และช่อง Tax Profile ถูกเติมให้เมื่อ item group ผูก tax profile ไว้ — ทั้งหมดยังแก้ทับได้เอง

---
## TC-PROD-030009 — สร้างสินค้าโดยไม่เพิ่ม order unit แล้วระบบเติม order unit เริ่มต้นให้
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, NAME ที่จะใช้ยังไม่มีใน DB, master data สำหรับ cascade พร้อม
**Steps**
1. เปิด new form แล้วกรอกช่องบังคับให้ครบ โดยไม่แตะแท็บ "Unit" เลย
2. กด "Create product"
3. เปิดหน้า detail ของสินค้าที่สร้าง แล้วไปแท็บ "Unit"
**Expected**
สร้างสำเร็จ และในส่วน "Order Unit" มี 1 แถวที่ From Unit และ To Unit เป็น Inventory Unit ที่เลือกไว้ ด้วย From Qty = 1, To Qty = 1 และถูกตั้งเป็น Default

---
## TC-PROD-040001 — แก้ name/price ของสินค้าแล้ว save persist
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่สร้างไว้แล้ว (เช่นจาก TC-PROD-030003)
**Steps**
1. เปิด detail ของสินค้านั้น แล้วกด Edit
2. แก้ Name เป็น NAME_UPDATED
3. แก้ Price เป็นค่าใหม่
4. กด Save
5. กลับหน้า list แล้วค้นหาด้วย NAME_UPDATED
**Expected**
แสดง toast "Product updated successfully", ฟอร์มกลับสู่โหมด view (ปุ่มกลับเป็น Edit) และค้นหาเจอ NAME_UPDATED ใน list ภายใน 10s

---
## TC-PROD-040002 — toggle Status active → inactive แล้ว persist
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่ status active ซึ่งแก้ได้อย่างปลอดภัย
**Steps**
1. เปิด detail ของสินค้านั้นแล้วกด Edit
2. ใน section "Product Flags" ปิดสวิตช์ Status (active → inactive)
3. กด Save
4. กลับหน้า list แล้ว filter Status = Inactive
**Expected**
แสดง toast update success, badge สถานะที่หัวฟอร์มเปลี่ยนเป็น "Inactive" (dot badge tone neutral) และสินค้านั้นปรากฏใน list เมื่อ filter Inactive

---
## TC-PROD-040003 — Cancel ระหว่าง edit ที่ dirty ต้องเตือน discard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าและกด Edit แล้ว
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ Name (ทำให้ฟอร์ม dirty)
3. กดปุ่ม Cancel
4. ยืนยัน discard
**Expected**
มี discard dialog (variant warning) ปรากฏก่อน; เมื่อยืนยัน ฟอร์มกลับสู่โหมด view และช่อง Name แสดงค่าเดิมบนหน้าจอ (ค่าที่แก้ถูกทิ้งจริง ไม่ค้างในช่อง)

---
## TC-PROD-040004 — ปุ่ม Save ในโหมด edit ถูกปิดจนกว่าฟอร์มจะถูกแก้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่
**Steps**
1. เปิด detail แล้วกด Edit
2. ตรวจสถานะปุ่ม Save ทันทีหลังเข้าโหมด edit โดยยังไม่แก้อะไร
3. แก้ Name หนึ่งตัวอักษร แล้วตรวจสถานะปุ่ม Save อีกครั้ง
**Expected**
ทันทีหลังกด Edit ปุ่ม Save ถูก disable; หลังแก้ค่าใด ๆ ปุ่ม Save กลับมากดได้

---
## TC-PROD-040005 — ออกจากฟอร์มที่ยังไม่ได้บันทึกผ่านเมนูข้างต้องถูกเตือน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าและกด Edit แล้ว
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ Name (ทำให้ฟอร์ม dirty)
3. คลิกเมนูไปหน้าอื่นจาก sidebar/นำทาง (ไม่ใช่ปุ่ม Back หรือ Cancel ของฟอร์ม)
**Expected**
discard dialog (variant warning) ปรากฏก่อนออกจากหน้า; กดยกเลิกแล้วยังอยู่ที่ฟอร์มพร้อมค่าที่แก้ไว้ กดยืนยันแล้วจึงออกไปหน้าปลายทาง

---
## TC-PROD-040006 — เลือกรูปในโหมด edit แล้วอัปโหลดจริงตอนกด Save
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่, เตรียมไฟล์รูปที่ผ่านเกณฑ์ไว้ 1 ไฟล์
**Steps**
1. เปิด detail แล้วกด Edit
2. ใน section "Images" เลือกไฟล์รูป 1 ไฟล์
3. สังเกตว่าปุ่ม Save ใช้งานได้แม้ยังไม่ได้แก้ช่องอื่น
4. กด Save แล้ว reload หน้า detail
**Expected**
รูปที่เลือกแสดงเป็น preview ทันทีโดยยังไม่ถูกอัปโหลด, ปุ่ม Save เปิดใช้งานเพราะนับว่าฟอร์มมีของค้าง, หลังกด Save ได้ toast update success และรูปยังอยู่หลัง reload (อัปโหลดจริงแล้ว)

---
## TC-PROD-050001 — เปิด delete dialog จาก list แล้ว cancel
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ลบ, มีสินค้าอย่างน้อย 1 รายการใน list
**Steps**
1. ไปที่ `/product-management/product`
2. เปิดเมนู row actions ท้ายแถว แล้วคลิก Delete
3. ใน dialog กด Cancel
**Expected**
เมนู row actions มีรายการ Activity และ Delete; dialog ยืนยันแสดงข้อความ `Are you sure you want to delete product "<name>"? This action cannot be undone.` และเมื่อกด Cancel dialog ปิดโดยแถวสินค้ายังอยู่ใน list

---
## TC-PROD-050002 — ลบสินค้าจาก list สำเร็จและหายจาก list
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ลบ, มีสินค้าที่สร้างในชุดทดสอบ (ลบได้ปลอดภัย)
**Steps**
1. ไปที่ `/product-management/product` แล้วค้นหาสินค้านั้น
2. เปิดเมนู row actions แล้วคลิก Delete
3. ใน dialog กดยืนยัน
**Expected**
แสดง toast "Product deleted successfully" ภายใน 10s และเมื่อค้นหาสินค้านั้นอีกครั้งต้องไม่พบ (empty state)

---
## TC-PROD-050003 — ลบสินค้าจากปุ่ม Delete ในหัวฟอร์มโหมด edit
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ลบ, มีสินค้าที่สร้างในชุดทดสอบ
**Steps**
1. เปิด detail ของสินค้านั้น แล้วกด Edit
2. กดปุ่ม Delete ที่หัวฟอร์ม
3. ยืนยันใน dialog
**Expected**
ปุ่ม Delete ปรากฏเฉพาะในโหมด edit (ไม่มีในโหมด view), หลังยืนยันได้ toast delete success และถูกพากลับไปหน้า `/product-management/product`

---
## TC-PROD-050004 — ลบสินค้าจากการ์ดในโหมด grid
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ลบบน desktop, มีสินค้าที่สร้างในชุดทดสอบ
**Steps**
1. ไปที่ `/product-management/product` แล้วสลับเป็น grid view
2. หาการ์ดของสินค้านั้น แล้วกดปุ่มลบท้ายการ์ด
3. ยืนยันใน dialog
**Expected**
การ์ดมีปุ่มลบท้ายการ์ด, กดแล้วเปิด dialog เดียวกับในตาราง, ยืนยันแล้วได้ toast delete success และการ์ดหายจาก grid

---
## TC-PROD-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session/ไม่ได้ล็อกอิน (no storageState)
**Steps**
1. เปิด `/product-management/product` โดยตรงโดยไม่ได้ล็อกอิน
**Expected**
ถูก redirect ไป `/login` และไม่เห็นเนื้อหา list สินค้า

---
## TC-PROD-100002 — ผู้ใช้ที่ไม่มีสิทธิ์ลบกด Delete แล้วเจอ permission dialog
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ `product_management.product.view` แต่ไม่มี `product_management.product.delete` และไม่ใช่ admin; มีสินค้าอย่างน้อย 1 รายการใน list
**Steps**
1. ไปที่ `/product-management/product`
2. เปิดเมนู row actions ท้ายแถว แล้วคลิก Delete
**Expected**
ไม่มี delete dialog ยืนยันการลบ แต่ขึ้น alert dialog แจ้งว่าไม่มีสิทธิ์ (permission denied) แทน และสินค้ายังอยู่ใน list

---
## TC-PROD-200001 — บันทึกโดยไม่กรอกช่องบังคับ ต้องถูกบล็อกพร้อมเตือน
**Priority:** High · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form โดยไม่กรอกอะไรเลย
2. กด "Create product"
**Expected**
แสดง toast warning "Some details are missing — jumped to the field to fix.", มีจุดแดงบนแท็บ General, มีข้อความ required ใต้ช่อง Name / Local name / Category / Sub Category / Item Group / Inventory Unit / Price และ URL ยังคงอยู่ที่ `/product-management/product/new` (ไม่มีสินค้าใหม่ถูกสร้าง)

---
## TC-PROD-200004 — Local name ถูกจำกัดที่ 100 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form
2. พิมพ์ข้อความยาว 150 ตัวอักษรลงช่อง "Local name"
**Expected**
ค่าในช่องถูกตัดที่ 100 ตัวอักษร (maxLength = 100) — พิมพ์เกินไปไม่ได้ และ schema ก็บังคับ max 100 เช่นกัน

---
## TC-PROD-200005 — Description ถูกจำกัดที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form
2. พิมพ์ข้อความยาว 300 ตัวอักษรลงช่อง Description
**Expected**
ค่าในช่อง Description ถูกตัดที่ 256 ตัวอักษร (maxLength = 256) และไม่มี error ค้างเมื่อความยาวไม่เกินเพดาน

---
## TC-PROD-200006 — Price Dev. / Qty Dev. เกิน 100 ถูก reject
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new` และกรอกช่องบังคับอื่นครบแล้ว
**Steps**
1. กรอกช่องบังคับให้ครบ
2. กรอก Price Dev. = 150
3. กด "Create product"
**Expected**
ถูกบล็อกไม่ให้ส่ง — แสดง toast warning "Some details are missing — jumped to the field to fix.", มีจุดแดงบนแท็บ General, ช่อง Price Dev. มี error และ URL ยังอยู่ที่ `/new`

---
## TC-PROD-200007 — submit จากแท็บอื่นแล้วเด้งไปแท็บที่กรอกผิด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form โดยไม่กรอกช่องบังคับ
2. สลับไปแท็บ "Location Assignment"
3. กด "Create product"
**Expected**
ระบบสลับกลับไปแท็บ "General" ให้เอง (แท็บแรกที่มีช่องผิด), เลื่อนหน้าไปหาช่องแรกที่ผิด และมีจุดแดงบนแท็บที่มี error — พร้อม toast warning เดียวกับ TC-PROD-200001

---
## TC-PROD-400001 — เพิ่ม order unit conversion และตั้ง default ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มโหมด add หรือ edit และเลือก Inventory Unit แล้ว (ปุ่ม Add จะถูก disable ถ้ายังไม่เลือก)
**Steps**
1. ไปแท็บ "Unit" แล้วดูปุ่ม "Add Order Unit" ก่อน/หลังเลือก Inventory Unit
2. กด "Add Order Unit" แล้วเลือก From Unit และกรอก To Qty
3. เพิ่มแถวที่ 2 แล้วกด radio Default ที่แถวใหม่
**Expected**
ก่อนเลือก Inventory Unit ปุ่ม Add ถูก disable; ตารางมีคอลัมน์ #, From Unit, From Qty, To Unit, To Qty, Conversion, Default, Active; แถวใหม่มี From Qty = 1 และ To Unit เป็น Inventory Unit, คอลัมน์ Conversion แสดงอัตราแปลงที่คำนวณได้ และเมื่อตั้ง Default ที่แถวหนึ่ง radio ของแถวอื่นถูกล้าง (มี default ได้แถวเดียว)

---
## TC-PROD-400002 — To Qty น้อยกว่า 1 ถูก reject
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มที่แท็บ "Unit" และมี order unit row อย่างน้อย 1 แถว
**Steps**
1. ไปแท็บ "Unit" แล้วเพิ่ม order unit 1 แถว (เลือก From Unit ให้ครบ)
2. แก้ To Qty เป็น 0
3. กด Save / "Create product"
**Expected**
ถูกบล็อกไม่ให้ส่ง — ช่อง To Qty แสดง error "To Qty must be at least 1", มีจุดแดงบนแท็บ "Unit" และไม่มี success toast

---
## TC-PROD-400003 — Ingredient Unit เพิ่มได้ต่อเมื่อเปิด Used in Recipe
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มโหมด add/edit ที่เลือก Inventory Unit แล้ว และสวิตช์ "Used in Recipe" ปิดอยู่
**Steps**
1. ไปแท็บ "Unit" แล้วดูส่วน "Ingredient Unit"
2. กลับไปแท็บ General เปิดสวิตช์ "Used in Recipe"
3. กลับมาแท็บ "Unit" แล้วดูส่วน "Ingredient Unit" อีกครั้ง
**Expected**
ตอนปิดสวิตช์: ส่วน Ingredient Unit แสดงข้อความ `Enable "Used in Recipe" in Product Info to add ingredient units.` และปุ่ม "Add Ingredient Unit" ถูก disable; หลังเปิดสวิตช์: ข้อความหายไปและปุ่ม Add กดได้ เพิ่มแถวได้ตามปกติ

---
## TC-PROD-400004 — เพิ่ม Eco Label ผ่าน dialog และตัวนับบนแท็บอัปเดต
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่และกด Edit แล้ว; มี master eco label ที่ `is_active` อย่างน้อย 1 รายการ
**Steps**
1. ไปแท็บ "Eco Labels" แล้วกด "Add Eco Label"
2. เลือก Eco Label, กรอก Certificate No., เลือก Issued Date และ Expiry Date (ให้ Expiry ≥ Issued)
3. กดบันทึกใน dialog
**Expected**
แถวใหม่ปรากฏในตาราง (คอลัมน์ #, Certificate No., Eco Label, Issued Date, Expiry Date, Status) ทันทีโดยไม่ต้องกด Save ของฟอร์ม และ badge ตัวนับบนแท็บ "Eco Labels" เพิ่มขึ้น 1

---
## TC-PROD-400005 — ตาราง Location ค้นหาได้ และคลังที่เลือกแล้วไม่ถูกเสนอซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มโหมด add/edit, มี Location ที่เลือกได้อย่างน้อย 2 แห่ง
**Steps**
1. ไปแท็บ "Location Assignment" แล้วกด "Add Location" เลือก Location A
2. กด "Add Location" อีกครั้ง แล้วเปิด lookup ของแถวใหม่
3. พิมพ์ชื่อ Location A ในช่องค้นหาที่หัว section แล้วกด Enter
**Expected**
lookup ของแถวที่ 2 ไม่แสดง Location A ให้เลือกซ้ำ; ช่องค้นหาที่หัว section กรองแถวในตารางตามชื่อ/ประเภท/delivery point (แถวที่ยังไม่ได้เลือก location ยังคงแสดงอยู่) และปุ่ม X ในช่องค้นล้างคำค้นกลับมาแสดงทุกแถว

---
## TC-PROD-400006 — ช่อง Shelf ผูกกับ Location ที่เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มโหมด add/edit, มี Location อย่างน้อย 2 แห่งและมี Shelf ใน BU อย่างน้อย 1 รายการ
**Steps**
1. ไปแท็บ "Location Assignment" แล้วกด "Add Location"
2. ดูช่อง Shelf ของแถวใหม่ก่อนเลือก Location
3. เลือก Location แล้วเลือก Shelf
4. เปลี่ยน Location ของแถวนั้นเป็นแห่งอื่น
**Expected**
ก่อนเลือก Location ช่อง Shelf ถูก disable; หลังเลือก Location ช่อง Shelf เลือกได้ (มีตัวเลือก "—" สำหรับล้างค่า); เมื่อเปลี่ยน Location ค่า Shelf เดิมถูกล้างเป็นว่าง

---
## TC-PROD-900001 — จอ mobile แสดงเป็น card grid + infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ล็อกอินแล้ว, เปิดที่ viewport กว้างน้อยกว่า 768px, มีสินค้ามากกว่า 20 รายการ
**Steps**
1. เปิด `/product-management/product` บน viewport mobile
2. สังเกต toolbar และรูปแบบการแสดงผล
3. เลื่อนหน้าลงจนถึงท้ายรายการ
**Expected**
list ถูกบังคับเป็นการ์ด (ไม่มีตารางและไม่มีปุ่มสลับ list/grid, ปุ่ม sort/เลือกคอลัมน์ถูกซ่อน), ปุ่ม Filter เปิดเป็น bottom sheet และเมื่อเลื่อนถึงท้ายจะโหลดสินค้าชุดถัดไปต่อท้ายอัตโนมัติ (มี loader หมุนระหว่างโหลด)
