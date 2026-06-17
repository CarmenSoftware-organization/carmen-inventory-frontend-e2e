# Product — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/product-management`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Product
**Frontend route:** `routes/product-management/product/...`  •  **URL:** `/product-management/product/...`
**Prefix:** `PROD`
**Default role:** Product Manager / Admin
**Total test cases:** 30

> โมดูล Product เป็น entity ที่มีรายละเอียดมาก — หน้า list รองรับ list/grid view, ค้นหา, filter ตาม status + category + sub-category + item-group (multi-select), active-filter bar, export, print, column visibility และ pagination. หน้า new/detail ใช้ฟอร์มแบบ tabs: **General** (Identification: name/code/local name/description/item group + category·sub-category ที่ derive มาจาก item group/inventory unit/tax profile/price & qty deviation limit; Codes & Cost: SKU/barcode/price; Flags: status·used in recipe·sold directly; Attributes: info rows; Images), **Units** (order units + ingredient units พร้อม unit conversion), **Locations** (min/max/re-order/par qty ต่อ location) และ **Eco-Labels** (แสดงเฉพาะตอน edit product ที่มีอยู่ — CRUD อิสระยิง API ทันที). หน้า detail เปิดมาในโหมด view ต้องกด Edit ก่อนแก้ไข. ฟอร์ม add มี Required checklist (7 ช่อง: name/local name/item group/inventory unit/price/order unit/barcode). Validation หลัก: code required + max 10, name required, local name required + max 100, item group required, inventory unit required, description max 256, price >= 0, deviation limit 0–100, conversion qty >= 1.
>
> หมายเหตุ: sub-category / item-group เป็น nested config ภายใต้ category (`routes/product-management/category`) และอยู่นอกขอบเขตเอกสารนี้ — เอกสารนี้โฟกัสที่ Product entity เท่านั้น แต่ใช้ค่าเหล่านั้นเป็น filter/lookup.

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PROD-010001 | หน้า list สินค้าโหลดสำเร็จ | High | Smoke |
| TC-PROD-010002 | ปุ่ม Add แสดงและคลิกไปหน้า new ได้ | High | Smoke |
| TC-PROD-010003 | ตาราง list แสดงคอลัมน์ครบ (code/name/local name/unit/category/sub-category/item group/status) | Medium | Functional |
| TC-PROD-010004 | ค้นหาด้วยคำที่มีอยู่ — list กรองตรงคำค้น | Medium | Functional |
| TC-PROD-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-PROD-010006 | filter status (active/inactive) ใช้งานได้ | Medium | Functional |
| TC-PROD-010007 | filter category/sub-category/item group (multi-select) ใช้งานได้ | Medium | Functional |
| TC-PROD-010008 | active-filter bar แสดง badge และลบทีละอัน / Clear all ได้ | Medium | Functional |
| TC-PROD-010009 | สลับ list / grid view ได้ | Low | Functional |
| TC-PROD-010010 | export และ print ทำงานได้ | Low | Functional |
| TC-PROD-020001 | คลิกแถวสินค้าเปิดหน้า detail ในโหมด view | High | Smoke |
| TC-PROD-020002 | หน้า detail แสดง tabs ครบ (General/Units/Locations/Eco-Labels) | Medium | Functional |
| TC-PROD-020003 | โหมด view เป็น read-only จนกว่าจะกด Edit | High | Functional |
| TC-PROD-030001 | เปิดหน้า new form สำเร็จ | High | Smoke |
| TC-PROD-030002 | Required checklist อัปเดตเมื่อกรอกช่องบังคับ | Medium | Functional |
| TC-PROD-030003 | สร้างสินค้าขั้นต่ำ (general fields บังคับ) สำเร็จ | High | CRUD |
| TC-PROD-030004 | สร้างสินค้าพร้อม attribute (info) row | Medium | CRUD |
| TC-PROD-030005 | สร้างสินค้าพร้อม location 1 รายการ | Medium | CRUD |
| TC-PROD-040001 | แก้ name/price ของสินค้าแล้ว save persist | High | CRUD |
| TC-PROD-040002 | toggle status active → inactive แล้ว persist | Medium | CRUD |
| TC-PROD-040003 | Cancel ระหว่าง edit ที่ dirty ต้องเตือน discard | Medium | Functional |
| TC-PROD-050001 | เปิด delete dialog จาก list แล้ว cancel — แถวยังอยู่ | Medium | Functional |
| TC-PROD-050002 | ลบสินค้าสำเร็จ (success toast) และหายจาก list | High | CRUD |
| TC-PROD-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-PROD-200001 | บันทึกโดยไม่กรอก code/name/item group/inventory unit ต้องแสดง error | High | Validation |
| TC-PROD-200002 | code เกิน 10 ตัวอักษรถูกจำกัด | Medium | Validation |
| TC-PROD-200003 | สร้าง code ซ้ำ ต้องถูก reject | High | Negative |
| TC-PROD-400001 | เพิ่ม order unit conversion และตั้ง default ได้ | Medium | Functional |
| TC-PROD-400002 | conversion qty < 1 ถูก reject | Medium | Validation |
| TC-PROD-900001 | mobile view แสดงเป็น card grid + infinite scroll | Low | Edge Case |

---
## TC-PROD-010001 — หน้า list สินค้าโหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Product Manager/Admin และมีสิทธิ์เข้าถึง Product Management > Product
**Steps**
1. ไปที่ `/product-management/product`
2. รอให้หน้าโหลดเสร็จ
**Expected**
URL ตรงกับ `/product-management/product`, หัวข้อหน้า Product แสดงพร้อม badge จำนวนรายการ และตาราง/empty-state ปรากฏภายใน 10s

---
## TC-PROD-010002 — ปุ่ม Add แสดงและคลิกไปหน้า new ได้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product`
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม Add
**Expected**
ปุ่ม Add visible และเมื่อคลิกแล้ว URL เปลี่ยนเป็น `/product-management/product/new`

---
## TC-PROD-010003 — ตาราง list แสดงคอลัมน์ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าอย่างน้อย 1 รายการใน list (list view)
**Steps**
1. ไปที่ `/product-management/product`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ code, name, local name, unit (inventory unit), category, sub-category, item group และ status (badge active=success / inactive=destructive)

---
## TC-PROD-010004 — ค้นหาด้วยคำที่มีอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่ทราบ code/name อยู่ใน DB
**Steps**
1. ไปที่ `/product-management/product`
2. พิมพ์คำค้น (code หรือ name ที่มีอยู่) ในช่องค้นหา แล้วกด Enter
**Expected**
list แสดงเฉพาะแถวที่ตรงคำค้น และ badge จำนวนรายการอัปเดตตามผลลัพธ์

---
## TC-PROD-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product`
**Steps**
1. ไปที่ `/product-management/product`
2. ค้นหาด้วยคำที่ไม่มี (เช่น `__NOPE__<UID>`) แล้วกด Enter
**Expected**
empty-state placeholder ปรากฏภายใน 10s (ไม่มีแถวที่ตรงคำค้น)

---
## TC-PROD-010006 — filter status (active/inactive)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product`
**Steps**
1. ไปที่ `/product-management/product`
2. เปิด Status filter
3. เลือก Active
**Expected**
list แสดงเฉพาะสินค้าที่ status active, badge จำนวนอัปเดต และ active-filter bar แสดง chip ของ status ที่เลือก

---
## TC-PROD-010007 — filter category/sub-category/item group (multi-select)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มี category/sub-category/item group ที่ is_active อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. เปิด Category filter (multi-select) แล้วเลือก 1 ค่า
3. เปิด Item Group filter แล้วเลือก 1 ค่า
**Expected**
list กรองตามค่าที่เลือกทุกตัวพร้อมกัน (รวม filter ด้วย AND), page reset กลับหน้า 1 และ chip ของแต่ละ filter แสดงใน active-filter bar

---
## TC-PROD-010008 — active-filter bar ลบทีละอัน / Clear all
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มี filter อย่างน้อย 2 ตัวถูกเลือกไว้ (เช่น status + category)
**Steps**
1. ไปที่ `/product-management/product` แล้วเลือก filter หลายตัว
2. คลิก remove (x) บน chip หนึ่งใน active-filter bar
3. คลิก Clear all
**Expected**
การ remove chip ลบ filter เฉพาะตัวนั้น และ Clear all ล้าง filter ทั้งหมด (status + category + sub-category + item group) จน list กลับมาแสดงทั้งหมด

---
## TC-PROD-010009 — สลับ list / grid view
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้วบน desktop, มีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม grid view
3. คลิกปุ่ม list view กลับ
**Expected**
grid view แสดงสินค้าเป็น ProductCard, list view แสดงเป็นตาราง — ข้อมูลที่แสดงสอดคล้องกันและไม่มี error

---
## TC-PROD-010010 — export และ print
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าใน list อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/product`
2. คลิกปุ่ม Export
3. คลิกปุ่ม Print
**Expected**
Export สร้างไฟล์ที่มีคอลัมน์ code/name/local name/unit/category/sub-category/item group/status และแสดง success toast (หรือ warning ถ้าไม่มีข้อมูล); Print เปิด print dialog ของเบราว์เซอร์

---
## TC-PROD-020001 — เปิดหน้า detail ในโหมด view
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, มีสินค้าอย่างน้อย 1 รายการใน list
**Steps**
1. ไปที่ `/product-management/product`
2. คลิก code หรือ name ของสินค้าแถวหนึ่ง
**Expected**
URL เปลี่ยนเป็น `/product-management/product/<id>`, ฟอร์มเปิดในโหมด view (read-only) แสดงค่าจริงของสินค้า และปุ่ม Edit visible

---
## TC-PROD-020002 — หน้า detail แสดง tabs ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่
**Steps**
1. เปิด `/product-management/product/<id>`
2. ตรวจรายการ tab
3. คลิกสลับแต่ละ tab
**Expected**
มี tab General, Units, Locations และ Eco-Labels (tab Eco-Labels แสดงเฉพาะตอนมี product id แล้ว) — สลับ tab ได้โดยไม่ error

---
## TC-PROD-020003 — โหมด view เป็น read-only จนกว่าจะกด Edit
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าที่มีอยู่ (โหมด view)
**Steps**
1. เปิด `/product-management/product/<id>`
2. สังเกตว่า field ต่าง ๆ แสดงเป็นข้อความ read-only (ไม่มี input/ปุ่มเพิ่ม row)
3. กดปุ่ม Edit
**Expected**
ก่อนกด Edit ทุก field เป็น read-only และไม่มีปุ่มเพิ่ม attribute/unit/location; หลังกด Edit field กลายเป็น input ที่แก้ไขได้ และปุ่มเปลี่ยนเป็น Save/Cancel/Delete

---
## TC-PROD-030001 — เปิดหน้า new form สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว, มีสิทธิ์สร้างสินค้า
**Steps**
1. ไปที่ `/product-management/product/new`
**Expected**
URL ตรงกับ `/product-management/product/new`, ฟอร์มเปิดในโหมด add, badge สถานะ Draft แสดง, Required checklist แสดง และปุ่ม Create Product visible

---
## TC-PROD-030002 — Required checklist อัปเดตเมื่อกรอกช่องบังคับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form (checklist แสดง 7 ช่อง: name, local name, item group, inventory unit, price, order unit, barcode)
2. กรอก name แล้วสังเกต chip name
3. เลือก inventory unit แล้วสังเกต chip unit
**Expected**
chip ของช่องที่กรอกครบเปลี่ยนเป็นสถานะ done (ติ๊กถูก สีเขียว) และตัวนับ "done/total" เพิ่มขึ้นตามจำนวนที่กรอก

---
## TC-PROD-030003 — สร้างสินค้าขั้นต่ำสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, CODE/NAME ที่จะใช้ยังไม่มีใน DB; มี item group และ unit ให้เลือก
**Steps**
1. เปิด `/product-management/product/new`
2. กรอก name, code, local name
3. เลือก item group (category/sub-category จะ derive อัตโนมัติ)
4. เลือก inventory unit
5. กรอก price
6. กด Create Product
7. กลับ list และค้นหาด้วย NAME
**Expected**
แสดง create success toast, redirect ไปหน้า detail ของสินค้าใหม่ และค้นหาเจอสินค้านั้นใน list ภายใน 10s

---
## TC-PROD-030004 — สร้างสินค้าพร้อม attribute (info) row
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, CODE/NAME ยังไม่มีใน DB
**Steps**
1. เปิด new form กรอก field บังคับครบ
2. ใน section Attributes กด Add attribute
3. กรอก label='Origin' / value='Thailand'
4. กด Create Product
**Expected**
สินค้าถูกสร้างพร้อม attribute และเมื่อเปิด detail แล้ว attribute Origin: Thailand แสดงใน section Attributes

---
## TC-PROD-030005 — สร้างสินค้าพร้อม location 1 รายการ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, CODE/NAME ยังไม่มีใน DB; มี location ให้เลือก
**Steps**
1. เปิด new form กรอก field บังคับครบ
2. ไป tab Locations กด Add location
3. เลือก location และกรอก min/max/re-order/par qty
4. กด Create Product
**Expected**
สินค้าถูกสร้างพร้อม location และเมื่อเปิด detail tab Locations แสดง location ที่เพิ่มพร้อมค่า qty ที่กรอก

---
## TC-PROD-040001 — แก้ name/price แล้ว save persist
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่สร้างไว้แล้ว (เช่นจาก TC-PROD-030003)
**Steps**
1. เปิด detail ของสินค้านั้น แล้วกด Edit
2. แก้ name เป็น NAME_UPDATED
3. แก้ price เป็นค่าใหม่
4. กด Save
5. กลับ list ค้นหาด้วย NAME_UPDATED
**Expected**
แสดง update success toast, ฟอร์มกลับสู่โหมด view และค้นหาเจอ NAME_UPDATED ใน list ภายใน 10s (ค่าถูก persist)

---
## TC-PROD-040002 — toggle status active → inactive
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่ status active
**Steps**
1. เปิด detail แล้วกด Edit
2. ใน section Flags ปิด switch Status (active → inactive)
3. กด Save
4. กลับ list และ filter status = inactive
**Expected**
update success toast แสดง และสินค้านั้นปรากฏใน list เมื่อ filter inactive โดย badge status เป็น inactive (destructive)

---
## TC-PROD-040003 — Cancel ระหว่าง edit ที่ dirty ต้องเตือน discard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, เปิด detail ของสินค้าและกด Edit แล้ว
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ name (ทำให้ฟอร์ม dirty)
3. กดปุ่ม Cancel
**Expected**
มี Discard dialog (variant warning) ปรากฏ; เมื่อยืนยัน discard ฟอร์มกลับสู่โหมด view โดยค่าที่แก้ถูกทิ้ง (revert เป็นค่าเดิม)

---
## TC-PROD-050001 — เปิด delete dialog จาก list แล้ว cancel
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, มีสินค้าอย่างน้อย 1 รายการใน list
**Steps**
1. ไปที่ `/product-management/product`
2. เปิด row actions ของสินค้าแถวหนึ่ง แล้วคลิก Delete
3. ใน delete dialog กด Cancel
**Expected**
delete dialog ปิดและแถวสินค้ายังคง visible (ไม่ถูกลบ)

---
## TC-PROD-050002 — ลบสินค้าสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่สร้างในชุด test (ลบได้ปลอดภัย)
**Steps**
1. ไปที่ `/product-management/product` และค้นหาสินค้านั้น
2. เปิด row actions แล้วคลิก Delete
3. ใน delete dialog กดยืนยัน
**Expected**
แสดง delete success toast ภายใน 10s และเมื่อค้นหาสินค้านั้นอีกครั้งต้องไม่พบ (empty state)

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
## TC-PROD-200001 — บันทึกโดยไม่กรอกช่องบังคับ ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form โดยเว้น code, name, item group, inventory unit
2. กด Create Product
**Expected**
แสดง error toast รวมข้อความ required, มี error indicator (จุดแดงที่ tab General + ข้อความใต้ field) และ URL ยังคงอยู่ที่ `/new` (form block submit)

---
## TC-PROD-200002 — code เกิน 10 ตัวอักษรถูกจำกัด
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ที่ `/product-management/product/new`
**Steps**
1. เปิด new form
2. พยายามพิมพ์ code ยาว 20 ตัวอักษรในช่อง code
**Expected**
ค่าในช่อง code ถูกจำกัดที่ 10 ตัวอักษร (maxLength=10); หากส่งค่ายาวกว่าได้ schema `code.max(10)` จะ reject และบล็อก submit

---
## TC-PROD-200003 — สร้าง code ซ้ำ ต้องถูก reject
**Priority:** High · **Test Type:** Negative
**Preconditions**
ล็อกอินแล้ว, มีสินค้าที่ใช้ CODE หนึ่งอยู่แล้วใน DB
**Steps**
1. เปิด new form
2. กรอก code = CODE ที่มีอยู่ (ซ้ำ) + กรอก field บังคับอื่นด้วยค่าใหม่
3. กด Create Product
**Expected**
backend ปฏิเสธ (error toast), ไม่มีสินค้าใหม่ถูกสร้าง และยังอยู่ที่หน้า `/new`

---
## TC-PROD-400001 — เพิ่ม order unit conversion และตั้ง default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์ม (add/edit) และเลือก inventory unit แล้ว (ปุ่ม Add unit ต้องใช้ inventory unit)
**Steps**
1. ไป tab Units
2. ใน Order Unit กด Add แล้วเลือก from unit + กรอก to qty (conversion preview แสดงอัตราแปลง)
3. เพิ่ม row ที่ 2 แล้วตั้ง radio is_default ที่ row ใหม่
**Expected**
เพิ่ม conversion row ได้, conversion preview คำนวณถูกต้อง และเมื่อตั้ง default ที่ row หนึ่ง radio default ของ row อื่นถูกล้าง (default เดียวเท่านั้น)

---
## TC-PROD-400002 — conversion qty < 1 ถูก reject
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว, อยู่ในฟอร์มที่ tab Units มี order/ingredient unit row อย่างน้อย 1 row
**Steps**
1. ไป tab Units เพิ่ม unit row
2. กรอก to_unit_qty = 0 (น้อยกว่า 1)
3. กด Save / Create Product
**Expected**
schema `to_unit_qty.min(1)` reject — แสดง error ที่ cell qty, จุดแดงที่ tab Units และบล็อก submit (ไม่มี success toast)

---
## TC-PROD-900001 — mobile view แสดงเป็น card grid + infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ล็อกอินแล้ว, เปิดที่ขนาดหน้าจอ mobile, มีสินค้าจำนวนมากพอให้มีหลายหน้า
**Steps**
1. เปิด `/product-management/product` บน viewport mobile
2. เลื่อนหน้าลงจนถึงท้าย list
**Expected**
list แสดงเป็น ProductCard grid (บังคับ grid mode บน mobile) และเมื่อเลื่อนถึงท้ายจะโหลดสินค้าหน้าถัดไปแบบ infinite scroll (loader หมุนระหว่างโหลด)
