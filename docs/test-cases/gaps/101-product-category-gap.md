# Product Category — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/101-product-category.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/101-product-category.md`_

**Module:** Product Management — Category (หมวดสินค้า สามชั้น: Category → Sub Category → Item Group)
**Frontend route:** `routes/product-management/category`  •  **URL:** `/product-management/category` (**หน้าเดียว** — ดูหมายเหตุข้อ 1)
**Prefix:** `CAT`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/101-product-category.spec.ts` (23 เคส — `test.fixme` 2 เคส, ไม่มี `test.skip`)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 39

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **โมดูลนี้มีหน้าเดียว ไม่มี `/new` และไม่มี `/:id`** — ตรวจกับ `routes/router.tsx:562-566` แล้ว: ใต้ `product-management` มี `path: "category"` ลำพัง (ต่างจาก `product` ที่มีครบ `product` / `product/new` / `product/:id` ที่บรรทัด 566-580) การสร้าง/แก้ไขทั้งสามชั้นทำผ่าน **dialog** ที่อยู่บนหน้า list เท่านั้น (`CategoryDialog` → `CategoryForm`) และ tree ทั้งก้อนโหลดครั้งเดียวด้วย `perpage: -1` จากสาม endpoint (category / sub-category / item-group) — **ไม่มี pagination, ไม่มีหน้ารายละเอียด, ไม่มี deep link ของ node** เอกสารนี้จึงไม่มีเคสกลุ่ม "หน้า /new" หรือ "deep link เข้า record" เลย
>
> 2. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/101-product-category.spec.ts` ถือ ID `TC-CAT-010001..010005`, `010050`, `020002`, `030003`, `030050..030052`, `040002`, `040050`, `040051`, `050003`, `050050..050053`, `090001..090004` เรื่องที่ครอบจริงคือ: เปิดหน้า list ได้และปุ่ม Add แสดง, กดปุ่ม Expand / Collapse แล้วหน้าไม่พัง, tree ยังแสดงผลแม้ชื่อยาว, active BU = BLAVG, **สร้าง root category ครบรอบ create → edit ชื่อ → delete** (ยืนยัน persist หลัง reload), **สร้าง subcategory ผ่านปุ่ม Add child แล้วลบ**, ลบ root ที่ว่างจากลูก, ค้นหาแล้วเจอ/ไม่เจอ/คำค้นว่าง — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ** เคสที่ดูใกล้เคียง (เช่น `TC-CAT-010063` เรื่อง Expand/Collapse) เจาะเฉพาะส่วนที่สเปกเดิม**ไม่ได้ assert** และระบุไว้ในตัวเคสแล้ว
>
> 3. **มี 2 เคสในสเปกที่เป็น `test.fixme` — ถือ ID ไว้แต่ไม่ได้ทดสอบจริง** ได้แก่ `TC-CAT-040051` (สร้าง item group) และ `TC-CAT-050051` (ลบ item group) เหตุผลที่คอมเมนต์ในสเปกระบุ (ตรวจกับ backend `:4000` เมื่อ 2026-09-19) คือ `POST /api/config/{bu}/product-item-groups` ตอบ 400 `Unknown argument \`is_used_in_purchase_order\`` ซึ่งเป็น Prisma error ฝั่ง backend — frontend ไม่ได้ส่ง field นี้ (`category-form-schema.ts` มีแต่ `is_used_in_recipe`) **ผลคือชั้นที่ 3 ของ tree สร้างไม่ได้เลย** เคสใดในเอกสารนี้ที่ต้องใช้ item group จริงจึงถูกทำเครื่องหมาย blocker ไว้ (ดูข้อ 9) ส่วน `test.skip` ไม่มีเลยในสเปกนี้
>
> 4. **งานตามเก็บ — `tests/pages/product-category.page.ts` ล้าสมัยหลายจุด (ยืนยันจากโค้ดแอป) เอกสารนี้ไม่แก้ไฟล์นั้น** สเปกเองก็ยอมรับเรื่องนี้แล้ว (คอมเมนต์ที่ `tests/101-product-category.spec.ts:445-452`) และเลี่ยงด้วยการประกาศ locator ของตัวเองในบล็อก admin จุดที่ยังผิดคือ:
>     - `codeInput().fill()` / `fillAndSave({ code })` — `#code` ถูกตั้ง `disabled` **แบบไม่มีเงื่อนไข** ใน `category-form.tsx:261` (ทั้งโหมด add และ edit) `.fill()` จะรอให้ช่องแก้ไขได้ตลอดไป และเพราะ `actionTimeout` เป็น 0 เทสจะ **ค้างจนหมด timeout** แทนที่จะ fail
>     - `dialog()` คืน `getByRole("dialog")` แบบไม่มี `.first()`/`.last()` — แอป mount Command Palette เป็น dialog ค้างไว้ตลอด จึงแมตช์มากกว่า 1 node และ action ใด ๆ ที่ scope กับมันจะติด strict mode (สเปกใช้ `.last()` จึงรอด)
>     - `expandAll()` หาปุ่มชื่อ `/expand all/i` แต่ label จริงคือ `"Expand"` (`messages/en.json` → `productManagement.category.expand`) — ไม่เคยแมตช์ และถูกกลืนด้วย `.catch(() => {})`
>     - `emptyState()` ใช้ regex `/no.*categor|no.*data|no.*found|empty|ไม่พบ/i` ซึ่งแมตช์ `"No categories yet…"` แต่ **ไม่แมตช์** ข้อความไม่พบผลค้นหา `"No results for \"…\""`
>     - page object ไม่มี locator ของปุ่ม Activity (ปุ่ม History บนแถว) ซึ่งเป็นปุ่มที่ 3 ในแถบ hover
>
> 5. **ปุ่มสร้าง / แก้ไข / ลบ ของโมดูลนี้ไม่มี RBAC gate ฝั่ง UI เลย** — ไฟล์ทั้งหมดใน `routes/product-management/category/` ไม่ import `useCan` / `PermissionButton` / `useDeleteGate` (ต่างจาก department) การป้องกันมีแค่ `RouteGuard` ที่ระดับ route ซึ่งเช็ค `product_management.category.view` (`constant/module-list.ts:186-189`, ไม่มี `licenseFeature`) **ผู้ใช้ที่มีสิทธิ์ view แต่ไม่มี create/update/delete จึงยังเห็นและกดปุ่มได้ แล้วไปตกที่ backend** เอกสารนี้จึง**ไม่เขียนเคส** "ปุ่ม Add/Edit/Delete ถูกกั้นเมื่อไม่มีสิทธิ์" เพราะจะเป็นการยืนยันสิ่งที่ยังไม่มีอยู่ — บันทึกเป็นข้อเท็จจริงไว้ตรงนี้แทน และเขียนเฉพาะ `TC-CAT-100010` ที่ทดสอบสิ่งที่มีจริง (RouteGuard)
>
> 6. **เคส permission-denial 5 ตัวที่มีอยู่ในสเปก (`TC-CAT-010002`, `020002`, `030003`, `040002`, `050003`, `090004`) มี oracle ที่เป็นจริงเสมอ** ทุกตัวทำแค่ `page.goto(LIST_PATH)` แล้ว assert `/category/.test(url) || /unauthorized|denied|403|login/i.test(url)` — พจน์แรกเป็นจริงทันทีเพราะ URL คือ `/product-management/category` อยู่แล้ว เทสจึงผ่านทั้งกรณีที่ถูกบล็อกและกรณีที่ไม่ถูกบล็อก `TC-CAT-100010` ในเอกสารนี้เขียนขึ้นเพื่อ assert สิ่งที่ `RouteGuard` ทำจริง (การ์ด `role="alert"` ที่มีคำว่า "Restricted" / "Permission Denied") ไม่ใช่การเขียนซ้ำ
>
> 7. **กับดัก toast — `success` ชนกันทั้งสามการกระทำ และชนข้ามระดับด้วย** `messages/en.json` กำหนด `toast.createSuccess = "{entity} created successfully"`, `updateSuccess`, `deleteSuccess` โดย `{entity}` เป็น **ชื่อระดับของ node** (`Category` / `Subcategory` / `Item Group`) regex ที่สเปกเดิมใช้ (`/created successfully|สร้าง.*สำเร็จ/i`) จึงแมตช์ toast ของ *ทุกระดับ* — สร้าง subcategory สำเร็จก็ทำให้ assertion ที่ตั้งใจรอ toast ของ category ผ่านได้ **เคสใหม่ทุกเคสในเอกสารนี้ให้ผูกกับข้อความเต็มพร้อมชื่อระดับ เช่น `/Subcategory created successfully/i` หรือรอ response ของ API ด้วย `waitForResponse` แทน**
>
> 8. **`SearchInput` ของหน้านี้กรอง "ระหว่างพิมพ์" ไม่ใช่ตอนกด Enter** — `category-component.tsx` ส่ง **ทั้ง** `onSearch={setSearch}` และ `onInputChange={setSearch}` ต่างจากโมดูลอื่นในแอปที่ส่งเฉพาะ `onSearch` (ซึ่ง `SearchInput` ยิงเฉพาะตอน Enter / กดปุ่มแว่นขยาย) การกรองยังเป็นแบบ **client-side ล้วน** บนข้อมูลที่โหลดมาครบแล้ว ไม่มีพารามิเตอร์ `search` ใน URL และไม่มี request ใหม่
>
> 9. **Blocker เรื่องข้อมูลที่ต้องเตรียม (ยืนยันแล้ว):**
>     - **ต้องมี Tax Profile ที่ `is_active` อย่างน้อย 1 รายการใน BU** — `tax_profile_id` เป็น `z.string().min(1)` ในสกีมา และ `LookupTaxProfile` กรอง `.filter((t) => t.is_active)` พร้อม `perpage: 30` ถ้าไม่มี tax profile ที่ active เลย **สร้าง root category ไม่ได้เลยทั้งโมดูล** (เคสสร้างของสเปกเดิมก็จะพังตาม)
>     - **ชั้นที่ 3 (Item Group) สร้างไม่ได้เพราะ backend 400** (ดูข้อ 3) — `TC-CAT-010067`, `TC-CAT-010068`, `TC-CAT-050061` และ `TC-CAT-110002` ต้องมี item group ที่มีอยู่แล้วใน BU (เตรียมด้วยวิธีอื่น เช่น seed ฝั่ง backend) มิฉะนั้นต้องรอ backend แก้
>     - **โซ่ผูกกับโมดูล product** — `docs/test-cases/100-product.md` ระบุว่าการสร้างสินค้าบังคับกรอก Category → Sub Category → Item Group ครบสาย และตรวจกับโค้ดแล้วเป็นจริง: `LookupCategory` (`components/lookup/lookup-category.tsx:36`) กรอง `.filter((c) => c.is_active)` เช่นเดียวกับ `lookup-sub-category` / `lookup-item-group` **ผลคือการปิดใช้งาน (`is_active = false`) หรือการลบหมวดใด ๆ จะทำให้สินค้าใหม่เลือกสายนั้นไม่ได้อีก** และเทสของโมดูล product ที่ต้องสร้างสินค้าจะพังตาม — **เคสสร้าง/ลบในเอกสารนี้ทุกเคสต้องใช้หมวดที่สร้างขึ้นเองสำหรับเทสนั้น ๆ ห้ามแตะหมวดที่ `100-product.md` ใช้เป็น fixture** ส่วนคำถามว่า "ลบหมวดที่มีสินค้าอ้างอยู่ได้หรือไม่" **ยืนยันจาก frontend ไม่ได้** (ไม่มีการเช็คใด ๆ ฝั่ง client) จึงไม่มีเคสเรื่องนี้ในเอกสารนี้
>
> 10. **ช่อง Qty Dev. % / Price Dev. % ไม่มีที่แสดงข้อความ error** — สองช่องนี้ใช้ `Input` ธรรมดา ไม่ใช่ `FieldInput` ที่รับ prop `error` และไม่มี `<FieldError>` กำกับ (`category-form.tsx:307-348`) ขณะที่สกีมาบังคับ `.min(0).max(100)` ผลคือค่าที่เกินช่วงจะ **บล็อกการ submit เงียบ ๆ** `TC-CAT-070004` จึง assert เฉพาะสิ่งที่พิสูจน์ได้ (dialog ไม่ปิด, ไม่มี toast สำเร็จ) และบันทึกการไม่มีข้อความ error ไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเคส
>
> 11. **ข้อความ error ของ Name เป็น tooltip ไม่ใช่ข้อความใต้ช่อง** — `FieldInput` (`components/ui/field.tsx:308-350`) เมื่อมี `error` จะตั้ง `aria-invalid="true"` + ไอคอน `CircleAlert` + **`TooltipContent`** ส่วน Tax Profile ต่างออกไป: `category-form.tsx:299-303` render `<FieldError>` ใต้ช่องจริง ๆ `TC-CAT-070001` / `TC-CAT-070002` จึง assert คนละแบบโดยตั้งใจ
>
> 12. **dialog "Confirm Changes" ใช้คอมโพเนนต์ `DeleteDialog`** — `category-form.tsx:431-448` ส่ง `title = "Confirm Changes"` เข้า `DeleteDialog` ซึ่ง hard-code ไอคอนถังขยะและปุ่มยืนยันชื่อ **"Delete"** (variant destructive) กล่องยืนยันการเปลี่ยน flag จึงมีปุ่มชื่อ "Delete" ทั้งที่ทำหน้าที่ "ยืนยันการบันทึก" `TC-CAT-040063` assert ตามที่ UI แสดงจริง — ถ้าทีมมองว่าควรเป็น "Continue" นั่นคืองานแก้แอป ไม่ใช่งานแก้เทส
>
> 13. **ข้อจำกัดของ search ที่ต้องรู้ก่อนเขียนเคส** — `filteredData` กรองเฉพาะ **ระดับบนสุด** (`categoryData.filter(...)`) ส่วน `children` ไม่ถูกกรองเลย เมื่อ root ถูกกางเพราะลูกตัวหนึ่งแมตช์ **ลูกที่ไม่แมตช์ก็ยังแสดงอยู่ด้วย** และแถบสรุปจำนวนด้านบนคำนวณจากข้อมูลดิบ ไม่ใช่ผลค้นหา จึง **ไม่เปลี่ยนตามคำค้น** — `TC-CAT-090013` / `TC-CAT-010061` เขียนให้สอดคล้องกับพฤติกรรมนี้
>
> 14. **คำอธิบายบนแถว node แสดงเฉพาะจอกว้าง ≥ 1280px** — `tree-node.tsx:721` ใช้ `hidden … xl:inline` ซึ่ง `xl` ของ Tailwind คือ 1280px และ viewport ของ `devices["Desktop Chrome"]` คือ 1280×720 พอดี เคสที่ assert คำอธิบาย (`TC-CAT-010065`) จึงต้องไม่ย่อ viewport
>
> 15. **Section ที่ `CAT` ลงทะเบียนไว้คือ `01–15, 20–29, 90`** (`docs/test-id-scheme.md:42`) — ครอบคลุมทุกบล็อกที่เอกสารนี้ใช้ (`01, 02, 03, 04, 05, 07, 08, 09, 10, 11`) **จึงไม่ต้องแก้ scheme และไม่มี section ที่ต้องลงทะเบียนเพิ่ม** หมายเหตุ: หมายเลข `TC-CAT-9000xx` ที่เห็นในสเปกเป็นหัวข้อในคอมเมนต์ ไม่ใช่ test title จึงไม่ถูก audit จับและไม่ถูกใช้ซ้ำในเอกสารนี้
>
> 16. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CAT-010060 | หัวเรื่อง คำอธิบาย และองค์ประกอบหลักของหน้า | High | Smoke |
| TC-CAT-010061 | แถบสรุปจำนวนสามระดับและผลรวม | Medium | Functional |
| TC-CAT-010062 | ค่าเริ่มต้นของการกาง — root กางเอง ชั้นลึกกว่ายังพับ | Medium | Functional |
| TC-CAT-010063 | Expand / Collapse กางและพับถึงชั้นที่ลึกที่สุด | Medium | Functional |
| TC-CAT-010064 | กาง-พับรายต้นด้วยการคลิกแถวและคลิกลูกศร | Medium | Functional |
| TC-CAT-010065 | องค์ประกอบของแถว node — badge code, ชื่อ, คำอธิบาย | Medium | Functional |
| TC-CAT-010066 | node ที่ปิดใช้งานแสดงป้าย Inactive | Medium | Functional |
| TC-CAT-010067 | ไอคอนของ node ต่างกันตามระดับและสถานะการกาง | Low | Functional |
| TC-CAT-010068 | ชุดปุ่ม hover ของแถว และข้อยกเว้นของ Item Group | Medium | Functional |
| TC-CAT-010069 | ลำดับของ tree เรียงตาม code แบบ numeric-aware ทุกระดับ | Low | Functional |
| TC-CAT-010070 | หน้านี้ไม่มีแถบเครื่องมือของ DataGrid และไม่มี pagination | Low | Functional |
| TC-CAT-020010 | dialog Add Category — หัวข้อและค่าเริ่มต้นของทุกช่อง | High | Functional |
| TC-CAT-020011 | ช่อง Code แก้ไม่ได้และ backend เป็นผู้กำหนดรหัส | High | Functional |
| TC-CAT-020012 | ตัวเลือก Tax Profile มีเฉพาะรายการที่ active | Medium | Functional |
| TC-CAT-020013 | ปุ่ม Cancel ปิด dialog โดยไม่บันทึก | Medium | Alternate Flow |
| TC-CAT-030060 | dialog ของ subcategory แสดง parent แบบอ่านอย่างเดียว | Medium | Functional |
| TC-CAT-030061 | ค่าที่สืบทอดจาก parent ถูกเติมล่วงหน้าในฟอร์มลูก | High | Functional |
| TC-CAT-030062 | toast และหัวข้อ dialog ใช้ชื่อระดับของ node ที่กำลังทำ | Medium | Functional |
| TC-CAT-040060 | dialog โหมดแก้ไขแสดงค่าเดิมครบและหัวข้อ Edit ตามระดับ | High | Functional |
| TC-CAT-040061 | แก้ Description / deviation / Tax Profile แล้วค่าคงอยู่ | High | CRUD |
| TC-CAT-040062 | ปิดใช้งาน category แล้วแถวขึ้นป้าย Inactive | Medium | CRUD |
| TC-CAT-040063 | เปลี่ยน flag Recipe / Sold Directly ต้องยืนยันก่อนบันทึก | High | Functional |
| TC-CAT-040064 | ยกเลิกกล่อง Confirm Changes แล้วไม่มีการบันทึก | Medium | Alternate Flow |
| TC-CAT-050060 | ข้อความใน dialog ยืนยันลบ และปุ่ม Cancel ยกเลิกได้ | High | CRUD |
| TC-CAT-050061 | หัวข้อ dialog ลบเปลี่ยนตามระดับของ node | Medium | Functional |
| TC-CAT-050062 | ปิด dialog ลบด้วย Escape แล้วไม่มีอะไรถูกลบ | Low | Edge Case |
| TC-CAT-070001 | Name ว่าง — ฟอร์มไม่ถูกส่งและช่องเข้าสถานะ invalid | High | Validation |
| TC-CAT-070002 | ไม่เลือก Tax Profile — ข้อความ error ใต้ช่อง | High | Validation |
| TC-CAT-070003 | ขีดจำกัดความยาวของ Name และ Description | Low | Validation |
| TC-CAT-070004 | ค่า deviation นอกช่วง 0–100 ไม่ถูกบันทึก | Medium | Validation |
| TC-CAT-080001 | ปุ่ม Activity บนแถวเปิด sheet ของ node นั้น | Medium | Functional |
| TC-CAT-090010 | ค้นหากรองทันทีระหว่างพิมพ์ โดยไม่ต้องกด Enter | High | Functional |
| TC-CAT-090011 | คำค้นถูก highlight ด้วย mark ในทั้ง code และ name | Medium | Functional |
| TC-CAT-090012 | ค้นด้วย code และ description ก็พบรายการ | Medium | Functional |
| TC-CAT-090013 | ค้นเจอลูก แล้วบรรพบุรุษถูกกางให้อัตโนมัติ | High | Functional |
| TC-CAT-090014 | ข้อความไม่พบผลลัพธ์ และปุ่มกากบาทล้างคำค้น | Medium | Functional |
| TC-CAT-100010 | ไม่มีสิทธิ์ดู — RouteGuard บล็อกทั้ง sidebar และ deep link | High | Authorization |
| TC-CAT-110001 | ปิดใช้งาน category แล้วหายจาก Lookup ของฟอร์มสินค้า | High | Functional |
| TC-CAT-110002 | สายหมวดที่สร้างใหม่ครบสามชั้นเลือกได้ในฟอร์มสินค้า | High | Functional |

---
## TC-CAT-010060 — หัวเรื่อง คำอธิบาย และองค์ประกอบหลักของหน้า
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category อย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/product-management/category`
2. รอให้ tree โหลดเสร็จ (skeleton 6 แถวหายไป)
3. อ่านหัวเรื่อง แถบค้นหา แถบสรุป และหัวของกล่อง tree
**Expected**
หัวเรื่อง `<h1>` คือ **"Category"** พร้อมไอคอนของโมดูล และคำอธิบายใต้ชื่อคือ **"How the catalogue is organised — category, sub-category, and item group."**; **ไม่มี badge จำนวนข้างหัวเรื่อง** (`DocumentListHeader` ถูกเรียกโดยไม่ส่ง prop `count`); ปุ่มเดียวในแถบหัวคือ **"Add Category"** (มีไอคอน Plus); ใต้หัวมีช่องค้นหาที่มี placeholder **"Search..."** และปุ่มแว่นขยายท้ายช่อง (aria-label "Search"); ถัดลงมาเป็นแถบสรุปตัวเลข แล้วจึงเป็นกล่อง tree ที่มีแถบหัวเขียนว่า **"Category Tree"** (ไอคอน FolderTree) พร้อมปุ่ม **Expand** และ **Collapse** ที่มุมขวาของแถบหัว

---
## TC-CAT-010061 — แถบสรุปจำนวนสามระดับและผลรวม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มี category, subcategory และ item group อย่างน้อยอย่างละ 1 รายการ
**Steps**
1. ไปที่ `/product-management/category` แล้วรอให้โหลดเสร็จ
2. อ่านตัวเลขทั้งสี่ในแถบสรุป
3. พิมพ์คำค้นที่ตัดรายการออกไปจำนวนมากลงในช่องค้นหา
4. อ่านตัวเลขในแถบสรุปอีกครั้ง
**Expected**
แถบสรุปแสดงสี่ค่าคั่นด้วยเส้นตั้ง ตามลำดับ **"{N} items" | "{N} categories" | "{N} subcategories" | "{N} item groups"** โดยค่าแรกเท่ากับผลบวกของอีกสามค่าพอดี; แถบนี้แสดงเฉพาะเมื่อโหลดเสร็จแล้ว (ระหว่างโหลดไม่มี); หลังพิมพ์คำค้น **ตัวเลขทั้งสี่ไม่เปลี่ยน** เพราะคำนวณจากข้อมูลดิบทั้งหมดของ BU ไม่ใช่จากผลการกรอง (ดูหมายเหตุข้อ 13) — การ assert ต้องยึดตามนี้ ไม่ใช่คาดว่าตัวเลขจะลดลง

---
## TC-CAT-010062 — ค่าเริ่มต้นของการกาง — root กางเอง ชั้นลึกกว่ายังพับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่มี subcategory ใต้สังกัด และ subcategory นั้นมี item group ใต้สังกัด
**Steps**
1. ไปที่ `/product-management/category` แล้วรอให้ tree โหลดเสร็จ
2. **ยังไม่กดปุ่ม Expand** แล้วมองหาแถวของ subcategory นั้น
3. มองหาแถวของ item group ใต้ subcategory นั้น
**Expected**
เมื่อเข้าหน้าครั้งแรกโดยยังไม่กดอะไร **category ระดับบนสุดทุกตัวถูกกางไว้แล้ว** (`useCategoryTree` ตั้ง `expandedResult[cat.id] = true` ให้ root ทุกตัว) — แถวของ subcategory จึงแสดงอยู่ในทันที; แต่ **subcategory ยังพับอยู่** จึง **ไม่มีแถวของ item group ใน DOM เลย** (node ที่พับไม่ถูก render ไม่ใช่แค่ถูกซ่อน); ไอคอนลูกศรหน้าแถว root ชี้ลง (หมุน 90°) ส่วนของ subcategory ยังชี้ขวา

---
## TC-CAT-010063 — Expand / Collapse กางและพับถึงชั้นที่ลึกที่สุด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสาย category → subcategory → item group ครบสามชั้นอย่างน้อย 1 สาย และรู้ชื่อของ item group นั้น
**Steps**
1. ไปที่ `/product-management/category`
2. คลิกปุ่ม **Expand**
3. มองหาแถวของ item group (ชั้นที่ 3)
4. คลิกปุ่ม **Collapse**
5. มองหาแถวของ subcategory และของ item group
**Expected**
หลังกด Expand **แถวของ item group ชั้นที่ 3 ปรากฏใน DOM** พร้อมระยะย่อหน้าที่ลึกกว่า subcategory (ระยะเยื้องคือ `level * 20 + 4` px); หลังกด Collapse **เหลือเฉพาะแถวของ category ระดับบนสุด** — ทั้งแถวของ subcategory และของ item group หายจาก DOM และลูกศรของทุกแถว root กลับมาชี้ขวา
_(เคส `TC-CAT-010003` ในสเปกกดปุ่มสองปุ่มนี้เหมือนกัน แต่ assert เพียงว่า "มี node สักตัวหรือ empty state แสดงอยู่" ซึ่งเป็นจริงทั้งก่อนและหลังกด — เคสนี้จึงเจาะสิ่งที่ยังไม่มีใครตรวจ คือชั้นที่ 3 ถูกกางจริงและถูกพับจริง)_

---
## TC-CAT-010064 — กาง-พับรายต้นด้วยการคลิกแถวและคลิกลูกศร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่มี subcategory ใต้สังกัดอย่างน้อย 1 ตัว และมี category อีกตัวที่**ไม่มีลูกเลย**
**Steps**
1. ไปที่ `/product-management/category` แล้วกดปุ่ม Collapse เพื่อพับทุกอย่างก่อน
2. คลิกที่ **เนื้อแถว** ของ category ที่มีลูก (ส่วนที่เป็น badge code + ชื่อ)
3. คลิกที่ **ปุ่มลูกศร** หน้าแถวเดิมอีกครั้ง
4. คลิกที่ปุ่มลูกศรหน้าแถวของ category ที่ไม่มีลูก
**Expected**
คลิกเนื้อแถวแล้ว subcategory ใต้สังกัดปรากฏ และลูกศรหมุนเป็นชี้ลง (`toggleExpand` ผูกอยู่กับปุ่มเนื้อแถว); คลิกลูกศรอีกครั้งแล้วพับกลับ; แถวที่ **ไม่มีลูก** จะไม่มีไอคอนลูกศร (render เป็นช่องว่างขนาด 3 หน่วยแทน) และคลิกตรงนั้นแล้วไม่มีอะไรเปลี่ยนแปลง; การคลิกแถวไม่ทำให้ URL เปลี่ยนเลย — โมดูลนี้ไม่มีหน้ารายละเอียด (ดูหมายเหตุข้อ 1)

---
## TC-CAT-010065 — องค์ประกอบของแถว node — badge code, ชื่อ, คำอธิบาย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ **และกรอก Description ไว้**; viewport กว้างอย่างน้อย 1280px (ค่าเริ่มต้นของ `devices["Desktop Chrome"]`)
**Steps**
1. ไปที่ `/product-management/category` แล้วหาแถวของ category นั้น
2. อ่านองค์ประกอบในแถวจากซ้ายไปขวา
3. ลบ category ที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แถวประกอบด้วยตามลำดับ: ปุ่มลูกศรกาง-พับ, ไอคอนของระดับ, **Badge ที่มีข้อความเป็น `code` ของ node**, ชื่อ node (ตัวหนาขนาดเล็ก ตัดด้วย `truncate` เมื่อยาวเกิน), และคำอธิบายที่ขึ้นต้นด้วยเครื่องหมาย **"—"** ต่อท้ายชื่อ; คำอธิบายแสดงเฉพาะเมื่อ node มีค่า `description` และเฉพาะบนจอกว้าง ≥ 1280px (ดูหมายเหตุข้อ 14); ทั้ง code, ชื่อ และคำอธิบายอยู่ใน `<button>` ปุ่มเดียวกันที่ทำหน้าที่กาง-พับ — **ไม่มี `<a href>` และไม่มีลิงก์ไปหน้าอื่น**

---
## TC-CAT-010066 — node ที่ปิดใช้งานแสดงป้าย Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้ 2 รายการ — รายการหนึ่งเปิดใช้งาน อีกรายการปิดใช้งาน (`is_active = false`)
**Steps**
1. ไปที่ `/product-management/category` แล้วหาแถวของทั้งสองรายการ
2. เทียบส่วนท้ายของแถว (ก่อนถึงแถบปุ่ม hover) ของทั้งสองแถว
3. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แถวของรายการที่ปิดใช้งานมี Badge ขนาดเล็กข้อความ **"Inactive"** อยู่ท้ายแถว; แถวของรายการที่เปิดใช้งาน **ไม่มี Badge ใด ๆ ท้ายแถว** — UI แสดงเฉพาะสถานะปิดเท่านั้น ไม่มีป้าย "Active" คู่กัน (`tree-node.tsx` render badge เมื่อ `!node.is_active` เท่านั้น) การ assert จึงต้องเป็น "ไม่มีป้าย" ไม่ใช่ "มีป้าย Active"

---
## TC-CAT-010067 — ไอคอนของ node ต่างกันตามระดับและสถานะการกาง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสาย category → subcategory → item group ครบสามชั้น (**blocker:** ชั้น item group ต้องเตรียมจากฝั่ง backend — ดูหมายเหตุข้อ 9)
**Steps**
1. ไปที่ `/product-management/category` แล้วกดปุ่ม Collapse
2. ดูไอคอนหน้าแถวของ category
3. กดปุ่ม Expand แล้วดูไอคอนของ category อีกครั้ง
4. ดูไอคอนของ subcategory และของ item group
**Expected**
category ที่พับอยู่ใช้ไอคอนโฟลเดอร์ปิด (`Folder`) และเมื่อถูกกางจะเปลี่ยนเป็นโฟลเดอร์เปิด (`FolderOpen`); subcategory ใช้ไอคอนชั้น (`Layers`) และ item group ใช้ไอคอนกล่อง (`Box`) — สองระดับหลัง **ไอคอนไม่เปลี่ยนตามสถานะกาง-พับ**; ไอคอนทั้งหมดขนาดเท่ากัน (h-3 w-3) และเป็นสีจาง

---
## TC-CAT-010068 — ชุดปุ่ม hover ของแถว และข้อยกเว้นของ Item Group
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสาย category → subcategory → item group ครบสามชั้น (**blocker:** ดูหมายเหตุข้อ 9)
**Steps**
1. ไปที่ `/product-management/category` แล้วกดปุ่ม Expand
2. เลื่อนเมาส์ออกจากทุกแถวแล้วสังเกตว่ามีปุ่มใดแสดงอยู่หรือไม่
3. hover ที่แถวของ category แล้วอ่าน `aria-label` ของปุ่มที่โผล่มาตามลำดับ
4. hover ที่แถวของ subcategory
5. hover ที่แถวของ item group
**Expected**
เมื่อไม่ได้ hover **ไม่มีปุ่มจัดการใด ๆ แสดง** (แถบปุ่มเป็น `hidden` จนกว่าจะ `group-hover/node`) — เทสจึงต้อง `hover()` ที่แถวก่อนเสมอ; แถวของ category และ subcategory แสดงปุ่ม 4 ตัวตามลำดับซ้ายไปขวา **"Add child" → "Edit" → "Activity" → "Delete"**; แถวของ **item group แสดงเพียง 3 ตัว — ไม่มี "Add child"** เพราะเป็นชั้นล่างสุดของโครงสร้าง; ทุกปุ่มเป็น `<button>` ที่มีทั้ง `title` และ `aria-label` เป็นข้อความเดียวกัน

---
## TC-CAT-010069 — ลำดับของ tree เรียงตาม code แบบ numeric-aware ทุกระดับ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้อย่างน้อย 3 รายการ ที่ code มีเลขท้ายต่างกันจนแยกลำดับแบบตัวอักษรกับแบบตัวเลขได้ (เช่นชุดที่มีทั้งเลขหลักเดียวและสองหลัก)
**Steps**
1. ไปที่ `/product-management/category`
2. อ่าน code จาก Badge ของทุกแถวระดับบนสุดตามลำดับที่ปรากฏ
3. กดปุ่ม Expand แล้วอ่าน code ของ subcategory ใต้ category หนึ่งตามลำดับที่ปรากฏ
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ลำดับแถวเรียงตาม `code` จากน้อยไปมากแบบ **numeric-aware** — รหัสที่เลขท้ายเป็นหลักเดียวมาก่อนรหัสที่เลขท้ายเป็นสองหลัก (`localeCompare` ด้วย `{ numeric: true, sensitivity: "base" }` ใน `useCategoryTree`) ไม่ใช่เรียงแบบ lexical ที่จะสลับลำดับนั้น; การเรียงใช้กฎเดียวกันทั้งสามระดับ ไม่ใช่เฉพาะระดับบนสุด; **ไม่มีเมนูเปลี่ยนการเรียงลำดับในหน้านี้** — ลำดับนี้คงที่เสมอ

---
## TC-CAT-010070 — หน้านี้ไม่มีแถบเครื่องมือของ DataGrid และไม่มี pagination
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีหมวดรวมกันมากกว่า 10 รายการ
**Steps**
1. ไปที่ `/product-management/category` แล้วรอให้โหลดเสร็จ
2. มองหาปุ่ม Filter, Export, Print, ปุ่มสลับมุมมอง list/grid และปุ่มเมนูคอลัมน์
3. เลื่อนไปท้ายกล่อง tree แล้วมองหาแถบ pagination และตัวเลือกจำนวนแถวต่อหน้า
4. ตรวจ query string ของหน้า
**Expected**
**ไม่มี** ปุ่ม Filter / Export / Print / สลับมุมมอง / Toggle Columns / checkbox เลือกหลายแถวในหน้านี้เลย — ต่างจากโมดูล config อื่นที่ใช้ `ConfigListTemplate` โมดูลนี้ render tree เอง; **ไม่มีแถบ pagination และไม่มีตัวเลือก Rows per page** เพราะทั้งสาม endpoint ถูกเรียกด้วย `perpage: -1` (โหลดทั้งหมดครั้งเดียว) รายการทั้งหมดจึงอยู่ใน `ScrollArea` ที่เลื่อนดูได้; query string ของหน้าว่างเปล่า — ทั้งคำค้นและสถานะกาง-พับเป็น state ใน React ล้วน ไม่ไหลลง URL และ **หายหมดเมื่อ reload**

---
## TC-CAT-020010 — dialog Add Category — หัวข้อและค่าเริ่มต้นของทุกช่อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ (ดูหมายเหตุข้อ 9)
**Steps**
1. ไปที่ `/product-management/category` แล้วคลิกปุ่ม "Add Category"
2. อ่านหัวข้อของ dialog
3. ไล่อ่าน label, ค่าเริ่มต้น และเครื่องหมายบังคับกรอกของทุกช่อง
4. อ่านชื่อปุ่มในแถบท้าย dialog
**Expected**
เปิด dialog ที่มีหัวข้อ **"Add Category"** พร้อมไอคอน FolderTree และ URL **ไม่เปลี่ยน** (ยังเป็น `/product-management/category`); ภายในมีช่องตามลำดับ **Code** (ว่าง, disabled, placeholder "Auto-generated", label ไม่มีดอกจัน), **Name** (ว่าง, label มีดอกจันสีแดง), **Tax Profile** (ยังไม่เลือก แสดง placeholder "Select Tax Profile", label มีดอกจัน), **Qty Dev. %** และ **Price Dev. %** (ทั้งคู่เป็น number input ค่าเริ่มต้น `0` มีสัญลักษณ์ `%` จาง ๆ ท้ายช่อง), สวิตช์ **"Used in Recipe"** และ **"Sold Directly"** ที่เริ่มต้น **ปิด** ทั้งคู่ (badge ใต้สวิตช์อ่านว่า "Not Used in Recipe" และ "Not Sold Directly"), สวิตช์สถานะที่เริ่มต้น **เปิด** (label "Active", คำอธิบาย "Enable or disable this record", badge "Active"), และ **Description** เป็น textarea 2 บรรทัดที่ว่างอยู่; **ไม่มีช่องเลือก parent** เพราะเป็น root; แถบท้ายมีปุ่ม **Cancel** และ **Create** เท่านั้น
_(เคส `TC-CAT-030050` ในสเปกเปิด dialog นี้เพื่อสร้างจริง แต่ไม่ได้ตรวจหัวข้อหรือค่าเริ่มต้นของช่องใดเลย)_

---
## TC-CAT-020011 — ช่อง Code แก้ไม่ได้และ backend เป็นผู้กำหนดรหัส
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ
**Steps**
1. เปิด dialog "Add Category"
2. ตรวจสถานะของช่อง Code (อย่าใช้ `.fill()` — ดูหมายเหตุข้อ 4)
3. กรอก Name และเลือก Tax Profile แล้วกด Create
4. หาแถวของ category ที่เพิ่งสร้างแล้วอ่าน Badge รหัสของแถวนั้น
5. hover แถวนั้นแล้วกด Edit และตรวจสถานะของช่อง Code อีกครั้ง
6. ปิด dialog แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ช่อง Code มีคุณสมบัติ `disabled` และ placeholder **"Auto-generated"** ในโหมดสร้าง — พิมพ์ลงไปไม่ได้ (`maxLength` ที่ตั้งไว้ 10 จึงไม่มีผลกับผู้ใช้); หลังกด Create แถวใหม่ใน tree มี Badge รหัสที่ **ไม่ว่าง** ซึ่งมาจาก backend (ฟอร์มตัด field `code` ออกจาก payload ในโหมด add — `stripAutoCode`); ในโหมดแก้ไขช่อง Code **แสดงรหัสเดิมแต่ยังคง `disabled`** และ **ไม่มี placeholder** — รหัสจึงเปลี่ยนไม่ได้ตลอดอายุของ record

---
## TC-CAT-020012 — ตัวเลือก Tax Profile มีเฉพาะรายการที่ active
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มี Tax Profile ที่ `is_active = true` อย่างน้อย 1 รายการ **และที่ `is_active = false` อย่างน้อย 1 รายการ** (เตรียมได้จาก `/config/tax-profile`) โดยรู้ชื่อของทั้งสองรายการ
**Steps**
1. เปิด dialog "Add Category"
2. คลิกที่ช่อง Tax Profile เพื่อเปิดรายการตัวเลือก
3. อ่านรายชื่อในรายการตัวเลือกทั้งหมด
4. เลือกรายการหนึ่งแล้วปิด dialog ด้วย Cancel
**Expected**
รายการตัวเลือกแสดง **ชื่อ** ของ tax profile (ไม่ใช่รหัสหรืออัตราภาษี); รายการที่ปิดใช้งานอยู่ **ไม่ปรากฏในรายการเลย** (`LookupTaxProfile` กรอง `.filter((t) => t.is_active)`); เลือกแล้วช่องแสดงชื่อรายการนั้นและ dialog ยังเปิดค้างอยู่
_(ข้อจำกัดที่ต้องรู้ตอนเขียนสเปก: lookup ดึงมาแค่ `perpage: 30` — ถ้า BU มี tax profile มากกว่า 30 รายการ รายการที่เกินจะไม่อยู่ในตัวเลือก จึงควรเลือกรายการที่แน่ใจว่าอยู่ใน 30 ตัวแรก)_

---
## TC-CAT-020013 — ปุ่ม Cancel ปิด dialog โดยไม่บันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; รู้ชื่อที่จะกรอกและแน่ใจว่ายังไม่มีใน BU
**Steps**
1. เปิด dialog "Add Category"
2. กรอก Name และเลือก Tax Profile
3. คลิกปุ่ม **Cancel**
4. ค้นหาชื่อที่เพิ่งกรอกในช่องค้นหาของหน้า list
5. เปิด dialog "Add Category" ใหม่อีกครั้งแล้วดูค่าในช่อง Name
**Expected**
กด Cancel แล้ว dialog ปิดทันที **โดยไม่มีกล่อง "Discard changes?" ใด ๆ** — โมดูลนี้ไม่มี navigation guard เพราะเป็น dialog ไม่ใช่หน้า (ต่างจากโมดูล config แบบหน้าเต็ม); ค้นหาชื่อนั้นแล้ว **ไม่พบรายการ** (ไม่มีอะไรถูกบันทึก); เปิด dialog ใหม่แล้วทุกช่องกลับเป็นค่าเริ่มต้นเปล่า — ฟอร์มถูก mount ใหม่ทุกครั้งที่ dialog เปิด (`{open && <CategoryForm/>}`) ค่าที่พิมพ์ค้างไว้จึงไม่ตกค้าง

---
## TC-CAT-030060 — dialog ของ subcategory แสดง parent แบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ และรู้ทั้ง code และชื่อของมัน
**Steps**
1. ไปที่ `/product-management/category` แล้ว hover ที่แถวของ category นั้น
2. คลิกปุ่ม **"Add child"**
3. อ่านหัวข้อ dialog และช่องแรกสุดในฟอร์ม
4. พยายามแก้ค่าในช่องแรกนั้น
5. ปิดด้วย Cancel แล้วลบ category ที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog คือ **"Add Subcategory"** (ไม่ใช่ "Add Category") — ชื่อระดับมาจาก parent ที่กด Add child; ช่องแรกของฟอร์มเป็นช่องอ้างอิง parent ที่มี label **"Category"** และค่าเป็นข้อความรูปแบบ **`<code> - <ชื่อ>`** ของ parent; ช่องนี้เป็น `disabled` และมีพื้นหลังจาง — **แก้ไขไม่ได้และไม่มีทางเลือก parent อื่นในฟอร์ม** (ย้ายหมวดข้ามสายต้องทำด้วยวิธีอื่น ซึ่งโมดูลนี้ไม่มี UI ให้); ช่องที่เหลือ (Code / Name / Tax Profile / deviation / flags / สถานะ / Description) เหมือนฟอร์มของ root ทุกประการ

---
## TC-CAT-030061 — ค่าที่สืบทอดจาก parent ถูกเติมล่วงหน้าในฟอร์มลูก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยตั้งค่าให้**ต่างจากค่าเริ่มต้น**ทั้งหมด — Tax Profile เป็นรายการที่ระบุได้, Qty Dev. % และ Price Dev. % เป็นค่าที่ไม่ใช่ 0, และเปิดสวิตช์ "Used in Recipe" กับ "Sold Directly" ไว้
**Steps**
1. hover ที่แถวของ category นั้นแล้วคลิก "Add child"
2. อ่านค่าใน Tax Profile, Qty Dev. %, Price Dev. % และสถานะของสวิตช์ทั้งสอง
3. อ่านค่าในช่อง Name และ Description
4. ปิดด้วย Cancel แล้วลบ category ที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ฟอร์มของลูก **เติมค่าจาก parent มาให้ล่วงหน้าครบ** — Tax Profile เป็นรายการเดียวกับ parent (จึงไม่ต้องเลือกซ้ำ), Qty Dev. % / Price Dev. % เท่ากับของ parent, และสวิตช์ "Used in Recipe" / "Sold Directly" อยู่ในสถานะเดียวกับ parent (`getDefaultValues` ใช้ `?? parentNode?.<field>`); ส่วน **Name และ Description ว่างเปล่า** และสวิตช์สถานะเป็น "Active" เสมอ (สองอย่างนี้ไม่สืบทอด); เพราะ Tax Profile ถูกเติมมาแล้ว การสร้างลูกจึงกรอกเพียง Name แล้วกด Create ได้ทันที

---
## TC-CAT-030062 — toast และหัวข้อ dialog ใช้ชื่อระดับของ node ที่กำลังทำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ
**Steps**
1. สร้าง root category ใหม่แล้วอ่านข้อความ toast **ทั้งประโยค**
2. hover แถวนั้นแล้วกด "Add child" สร้าง subcategory แล้วอ่าน toast ทั้งประโยค
3. hover แถวของ subcategory แล้วกด Edit แก้ Name เป็นค่าใหม่ กด Save แล้วอ่าน toast
4. ลบ subcategory แล้วลบ root เพื่อคืนสภาพ พร้อมอ่าน toast ของแต่ละครั้ง
**Expected**
ข้อความ toast อ้างชื่อระดับของ node ที่ทำจริง ไม่ใช่คำกลาง ๆ: สร้าง root ได้ **"Category created successfully"**, สร้างลูกของ root ได้ **"Subcategory created successfully"**, แก้ไข subcategory ได้ **"Subcategory updated successfully"**, ลบได้ **"Subcategory deleted successfully"** แล้วตามด้วย **"Category deleted successfully"**; หัวข้อ dialog แก้ไขก็เปลี่ยนตามระดับเช่นกัน (**"Edit Subcategory"** ไม่ใช่ "Edit Category")
_(สำคัญ: สเปกเดิมใช้ regex `/created successfully|สร้าง.*สำเร็จ/i` ซึ่งแมตช์ทุกระดับเหมือนกันหมด เคสนี้ต้องผูกกับประโยคเต็มพร้อมชื่อระดับ — ดูหมายเหตุข้อ 7)_

---
## TC-CAT-040060 — dialog โหมดแก้ไขแสดงค่าเดิมครบและหัวข้อ Edit ตามระดับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยกรอกครบทุกช่อง (Name, Tax Profile, deviation สองค่าที่ไม่ใช่ 0, flags ที่เปิดไว้, Description) และรู้ค่าทุกช่อง
**Steps**
1. hover ที่แถวของ category นั้นแล้วคลิกปุ่ม **Edit**
2. อ่านหัวข้อ dialog
3. เทียบค่าทุกช่องกับค่าที่บันทึกไว้
4. ปิดด้วย Cancel แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog คือ **"Edit Category"**; ทุกช่องแสดงค่าที่บันทึกไว้ครบ — Code (disabled), Name, Tax Profile, Qty Dev. %, Price Dev. %, สวิตช์ทั้งสาม และ Description; ปุ่มท้าย dialog เป็น **Cancel** กับ **Save** (ไม่ใช่ Create); **ไม่มีช่องอ้างอิง parent** เมื่อแก้ไข root แต่จะมีเมื่อแก้ไข subcategory / item group; URL ไม่เปลี่ยนตลอดทั้งขั้นตอน

---
## TC-CAT-040061 — แก้ Description / deviation / Tax Profile แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; BU มี Tax Profile ที่ active อย่างน้อย 2 รายการ
**Steps**
1. hover แถวของ category นั้นแล้วกด Edit
2. แก้ Description เป็นข้อความใหม่, เปลี่ยน Qty Dev. % และ Price Dev. % เป็นค่าใหม่ในช่วง 0–100 และเปลี่ยน Tax Profile เป็นรายการที่สอง
3. กด **Save** แล้วรอ toast
4. reload หน้า แล้วเปิด dialog แก้ไขของรายการเดิมอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast **"Category updated successfully"** (ผูกกับประโยคเต็ม ไม่ใช่คำว่า success ลอย ๆ — ดูหมายเหตุข้อ 7) และ dialog ปิดเอง; คำอธิบายใหม่ปรากฏต่อท้ายชื่อในแถวของ tree ทันที; หลัง reload ค่าทั้งสามยังเป็นค่าใหม่ (persist จริง ไม่ใช่ optimistic) — การอัปเดตส่ง `doc_version` ของ record ที่โหลดมาไปด้วยตาม optimistic concurrency ของ backend ถ้า backend ตอบ 400 เรื่อง `doc_version` ให้ถือเป็นบั๊กของแอป ไม่ใช่ของเทส
_(สเปกเดิม `TC-CAT-040050` แก้เฉพาะช่อง Name เท่านั้น ช่องที่เหลือยังไม่มีใครตรวจว่าบันทึกได้จริง)_

---
## TC-CAT-040062 — ปิดใช้งาน category แล้วแถวขึ้นป้าย Inactive
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและกำลังเปิดใช้งานอยู่
**Steps**
1. hover แถวของ category นั้นแล้วกด Edit
2. ปิดสวิตช์สถานะ (จาก Active เป็น Inactive) แล้วสังเกต badge ใต้สวิตช์
3. กด Save แล้วรอ toast
4. reload หน้า แล้วดูแถวของรายการนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ปิดสวิตช์แล้ว badge ใต้สวิตช์เปลี่ยนจาก "Active" เป็น **"Inactive"** ทันทีใน dialog; หลัง Save ได้ toast **"Category updated successfully"** และแถวใน tree ขึ้น Badge **"Inactive"** ท้ายแถว; หลัง reload ป้ายยังอยู่; **รายการที่ปิดใช้งานยังคงแสดงอยู่ใน tree ตามปกติ ไม่ถูกซ่อน** — หน้านี้ไม่มีตัวกรองสถานะ (ผลกระทบข้ามโมดูลอยู่ที่ `TC-CAT-110001`)

---
## TC-CAT-040063 — เปลี่ยน flag Recipe / Sold Directly ต้องยืนยันก่อนบันทึก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ โดยสวิตช์ "Used in Recipe" ปิดอยู่
**Steps**
1. hover แถวของ category นั้นแล้วกด Edit
2. เปิดสวิตช์ **"Used in Recipe"** โดยไม่แตะช่องอื่น
3. กด **Save**
4. อ่านหัวข้อ คำอธิบาย และชื่อปุ่มในกล่องที่เด้งขึ้นมา
5. กดปุ่มยืนยันในกล่องนั้น แล้วรอ toast
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กด Save แล้ว **ยังไม่มีการบันทึกทันที** แต่เด้ง alert dialog หัวข้อ **"Confirm Changes"** คำอธิบาย **"Changing \"Recipe\" or \"Sold Directly\" flags may affect child items. Continue?"**; ปุ่มในกล่องคือ **Cancel** และปุ่มยืนยันที่มีชื่อว่า **"Delete"** พร้อมไอคอนถังขยะและสีเตือน — กล่องนี้ reuse คอมโพเนนต์ `DeleteDialog` จึงได้ป้ายของการลบมาด้วย (ดูหมายเหตุข้อ 12 — assert ตามที่ UI แสดงจริง); กดปุ่มยืนยันแล้วจึงเกิดการบันทึกและได้ toast **"Category updated successfully"**; **การแก้ช่องอื่นโดยไม่แตะสองสวิตช์นี้จะไม่เด้งกล่องยืนยัน** (เทียบได้กับ `TC-CAT-040061` ที่บันทึกผ่านเลย)

---
## TC-CAT-040064 — ยกเลิกกล่อง Confirm Changes แล้วไม่มีการบันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยสวิตช์ "Sold Directly" ปิดอยู่
**Steps**
1. hover แถวนั้นแล้วกด Edit แล้วเปิดสวิตช์ **"Sold Directly"**
2. กด Save แล้วกด **Cancel** ในกล่อง "Confirm Changes"
3. สังเกตว่า dialog แก้ไขยังเปิดอยู่หรือไม่ และสวิตช์อยู่สถานะใด
4. ปิด dialog แก้ไขด้วย Cancel แล้วเปิดใหม่เพื่อตรวจค่าที่บันทึกไว้จริง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กด Cancel ในกล่องยืนยันแล้วกล่องปิด **แต่ dialog แก้ไขยังเปิดค้างอยู่** พร้อมค่าที่แก้ไว้บนหน้าจอ (สวิตช์ยังเปิด) — ยังไม่มี request ใด ๆ ถูกส่ง; **ไม่มี toast ใด ๆ ขึ้น**; ปิด dialog แล้วเปิดใหม่ สวิตช์กลับไปเป็นสถานะเดิมที่บันทึกไว้ (ปิด) ยืนยันว่าการยกเลิกไม่ทิ้งอะไรไว้

---
## TC-CAT-050060 — ข้อความใน dialog ยืนยันลบ และปุ่ม Cancel ยกเลิกได้
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. hover ที่แถวของ category นั้นแล้วคลิกปุ่ม **Delete**
2. อ่านหัวข้อ คำอธิบาย และชื่อปุ่มทั้งสองในกล่องที่เด้งขึ้น
3. กด **Cancel**
4. ตรวจว่าแถวนั้นยังอยู่ใน tree หรือไม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
เด้ง alert dialog หัวข้อ **"Delete Category"** และคำอธิบาย **"Are you sure you want to delete \"<ชื่อ>\"? This action cannot be undone."** โดยในข้อความอ้าง **ชื่อ** ของ node ไม่ใช่รหัส; footer มีปุ่ม **Cancel** (ไอคอนกากบาท) และ **Delete** (ไอคอนถังขยะ สีเตือน); กด Cancel แล้วกล่องปิด, **ไม่มี toast**, และแถวนั้นยังอยู่ใน tree ครบถ้วน
_(สเปกเดิม `TC-CAT-050050` กดยืนยันทันทีโดยไม่ตรวจข้อความในกล่องและไม่เคยทดสอบทางออก Cancel)_

---
## TC-CAT-050061 — หัวข้อ dialog ลบเปลี่ยนตามระดับของ node
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสาย category → subcategory → item group ครบสามชั้นที่สร้างไว้สำหรับเทสนี้ (**blocker:** ชั้น item group ต้องเตรียมจากฝั่ง backend — ดูหมายเหตุข้อ 9)
**Steps**
1. กดปุ่ม Expand เพื่อกางทุกระดับ
2. hover ที่แถวของ **item group** แล้วกด Delete และอ่านหัวข้อกล่อง จากนั้นกด Cancel
3. ทำซ้ำกับแถวของ **subcategory** แล้วกด Cancel
4. ทำซ้ำกับแถวของ **category** แล้วกด Cancel
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ (ไล่จากชั้นล่างขึ้นบน)
**Expected**
หัวข้อของกล่องยืนยันเปลี่ยนตามระดับของแถวที่กด — **"Delete Item Group"**, **"Delete Subcategory"** และ **"Delete Category"** ตามลำดับ; คำอธิบายใช้รูปประโยคเดียวกันทุกระดับโดยเปลี่ยนเฉพาะชื่อ node; กด Cancel ทุกครั้งแล้วไม่มีรายการใดหายไปจาก tree

---
## TC-CAT-050062 — ปิด dialog ลบด้วย Escape แล้วไม่มีอะไรถูกลบ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. hover แถวนั้นแล้วกดปุ่ม Delete
2. กดปุ่ม **Escape** บนคีย์บอร์ด
3. ตรวจ tree และตรวจว่ามี toast ขึ้นหรือไม่
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กล่องยืนยันปิดลงโดยไม่มีการลบ — แถวนั้นยังอยู่ใน tree และ **ไม่มี toast ใด ๆ**; เปิดกล่องเดิมซ้ำได้ตามปกติ; ระหว่างที่การลบกำลังทำงานอยู่ (สถานะ pending) กล่องจะปิดด้วย Escape ไม่ได้และปุ่มยืนยันอ่านว่า **"Deleting..."** — `DeleteDialog` บล็อก `onOpenChange` ขณะ `isPending`

---
## TC-CAT-070001 — Name ว่าง — ฟอร์มไม่ถูกส่งและช่องเข้าสถานะ invalid
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ
**Steps**
1. เปิด dialog "Add Category"
2. เลือก Tax Profile แต่ **เว้นช่อง Name ว่างไว้**
3. กดปุ่ม Create
4. ตรวจสถานะของช่อง Name และดูว่ามี toast หรือไม่
5. กรอก Name แล้วกด Create ซ้ำ จากนั้นลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ฟอร์ม **ไม่ถูก submit** — dialog ยังเปิดอยู่และไม่มี toast สร้างสำเร็จ; ช่อง Name ได้ `aria-invalid="true"` พร้อมไอคอนเตือนวงกลมในช่อง และข้อความ **"Name is required"** ปรากฏเป็น **tooltip** เมื่อ hover/โฟกัสช่องนั้น — **ไม่ใช่ข้อความใต้ช่อง** (ดูหมายเหตุข้อ 11); หน้าเลื่อนไปยังช่องที่ผิดช่องแรกและโฟกัสให้ (`scrollToFirstInvalidField` เล็งที่ `[aria-invalid="true"]`); หลังกรอก Name แล้วกดซ้ำ ฟอร์มถูกส่งได้ตามปกติ

---
## TC-CAT-070002 — ไม่เลือก Tax Profile — ข้อความ error ใต้ช่อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เปิด dialog "Add Category"
2. กรอก Name แต่ **ไม่เลือก Tax Profile**
3. กดปุ่ม Create
4. อ่านข้อความใต้ช่อง Tax Profile
5. เลือก Tax Profile แล้วกด Create ซ้ำ จากนั้นลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ฟอร์มไม่ถูก submit และ dialog ยังเปิดอยู่; ใต้ช่อง Tax Profile แสดงข้อความ **"Tax profile is required"** เป็นข้อความจริงในหน้า (ช่องนี้ render `<FieldError>` ต่างจากช่อง Name ที่ใช้ tooltip — ดูหมายเหตุข้อ 11); ช่อง Name ที่กรอกไว้แล้ว **ไม่มี** สถานะ invalid; หลังเลือก Tax Profile ข้อความหายไปและกด Create สำเร็จ
_(ข้อสังเกตสำหรับการเตรียมข้อมูล: ถ้า BU ไม่มี tax profile ที่ active เลย จะติดเคสนี้ตลอดไปและสร้างหมวดไม่ได้ — ดูหมายเหตุข้อ 9)_

---
## TC-CAT-070003 — ขีดจำกัดความยาวของ Name และ Description
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เปิด dialog "Add Category"
2. พิมพ์ข้อความยาว 150 ตัวอักษรลงในช่อง Name แล้วอ่านความยาวของค่าที่ค้างอยู่ในช่อง
3. พิมพ์ข้อความยาว 300 ตัวอักษรลงในช่อง Description แล้วอ่านความยาวของค่าที่ค้างอยู่
4. ปิดด้วย Cancel
**Expected**
ค่าในช่อง Name ถูกตัดที่ **100 ตัวอักษร** และค่าในช่อง Description ถูกตัดที่ **256 ตัวอักษร** (`maxLength` ของ `FieldInput` และ `Textarea` ใน `category-form.tsx`); **ไม่มีข้อความ validation ใด ๆ ขึ้น** เพราะ input ตัดค่าให้ตั้งแต่ตอนพิมพ์ ไม่ได้ปล่อยให้เกินแล้วค่อยเตือน; ขีดจำกัดเดียวกันนี้ใช้กับทั้งสามระดับและทั้งโหมดสร้างกับโหมดแก้ไข เพราะเป็นฟอร์มคอมโพเนนต์เดียวกัน

---
## TC-CAT-070004 — ค่า deviation นอกช่วง 0–100 ไม่ถูกบันทึก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ
**Steps**
1. เปิด dialog "Add Category" แล้วกรอก Name และเลือก Tax Profile ให้ครบ
2. กรอก **Qty Dev. %** เป็น `150`
3. กดปุ่ม Create
4. แก้ค่าเป็น `-5` แล้วกด Create อีกครั้ง
5. แก้ค่าเป็น `50` แล้วกด Create จากนั้นลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ทั้งกรณี `150` และ `-5` ฟอร์ม **ไม่ถูก submit** — dialog ยังเปิดอยู่, ไม่มี toast สร้างสำเร็จ และไม่มีแถวใหม่ใน tree (สกีมาบังคับ `.min(0).max(100)`); เมื่อแก้เป็น `50` แล้วกด Create จึงสร้างสำเร็จและค่าที่บันทึกคือ 50
_(สิ่งที่ยืนยันไม่ได้และห้าม assert: **ไม่มีข้อความ error ใด ๆ แสดงให้ผู้ใช้เห็น** สำหรับสองช่องนี้ เพราะใช้ `Input` ธรรมดาที่ไม่มี prop `error` และไม่มี `<FieldError>` กำกับ — ดูหมายเหตุข้อ 10 ผลคือผู้ใช้เห็นแค่ปุ่มกดแล้วไม่มีอะไรเกิดขึ้น)_

---
## TC-CAT-080001 — ปุ่ม Activity บนแถวเปิด sheet ของ node นั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้และ **เคยถูกแก้ไขอย่างน้อย 1 ครั้ง** และรู้ชื่อแน่นอน
**Steps**
1. hover ที่แถวของ category นั้น
2. คลิกปุ่มที่มี `aria-label` ว่า **"Activity"** (ปุ่มที่ 3 ในแถบ hover ไอคอนนาฬิกาย้อนเวลา)
3. อ่านหัวเรื่องและคำอธิบายของ sheet ที่เปิดขึ้น
4. ปิด sheet แล้วตรวจ URL
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
เปิด sheet ประวัติกิจกรรมที่หัวเรื่องคือ **"Activity"** พร้อมคำอธิบาย "Everything done to this record, newest first" และอ้างถึง **ชื่อ** ของ node นั้น (`openActivity(node.id, node.name)` ส่งชื่อเป็น label); sheet ถูก lazy-load จึงอาจใช้เวลาโหลดครั้งแรก — ต้องรอด้วย `waitFor` ไม่ใช่เช็คทันที; รายการกิจกรรมแสดงการแก้ไขที่เคยทำ; ปิด sheet แล้ว **URL ไม่เปลี่ยนเลย** และ tree ยังอยู่ในสถานะกาง-พับเดิม
_(ปุ่มนี้ยังไม่มี locator ใน page object — ดูหมายเหตุข้อ 4)_

---
## TC-CAT-090010 — ค้นหากรองทันทีระหว่างพิมพ์ โดยไม่ต้องกด Enter
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยชื่อไม่ซ้ำกับรายการอื่น และมี category อื่นอยู่ใน BU อีกอย่างน้อย 2 รายการ
**Steps**
1. ไปที่ `/product-management/category`
2. พิมพ์ชื่อของ category นั้นลงในช่องค้นหา **โดยยังไม่กด Enter**
3. สังเกตจำนวนแถวในระดับบนสุดและตรวจ query string ของหน้า
4. ลบคำค้นออกทีละตัวจนว่าง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
tree ถูกกรองเหลือเฉพาะรายการที่ตรง **ทันทีระหว่างพิมพ์ ไม่ต้องกด Enter** (`category-component.tsx` ส่งทั้ง `onSearch` และ `onInputChange` ให้ `SearchInput` — ดูหมายเหตุข้อ 8); **query string ยังว่างเปล่า ไม่มีพารามิเตอร์ `search`** และไม่มี request ใหม่ถูกยิง เพราะเป็นการกรองฝั่ง client บนข้อมูลที่โหลดมาครบแล้ว; ลบคำค้นจนว่าง tree กลับมาครบทุกรายการทันที
_(สเปกเดิม `TC-CAT-090001` / `090002` กด Enter ทุกครั้ง จึงไม่เคยพิสูจน์ว่าการกรองเกิดตั้งแต่ตอนพิมพ์)_

---
## TC-CAT-090011 — คำค้นถูก highlight ด้วย mark ในทั้ง code และ name
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้และรู้ทั้ง code และชื่อ
**Steps**
1. พิมพ์เศษของ **ชื่อ** category นั้นลงในช่องค้นหา
2. ดูว่าส่วนที่ตรงกับคำค้นในชื่อถูกเน้นอย่างไร
3. ล้างคำค้นแล้วพิมพ์เศษของ **code** แทน
4. ดูว่าส่วนที่ตรงกันใน Badge รหัสถูกเน้นหรือไม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ส่วนของข้อความที่ตรงกับคำค้นถูกหุ้มด้วยแท็ก **`<mark>`** ที่มีพื้นหลังสีเน้น ส่วนที่เหลือของข้อความยังเป็นตัวอักษรธรรมดา; การเน้นเกิดทั้งใน **ชื่อ node** และใน **Badge รหัส** และในคำอธิบายด้วย (`highlight()` ถูกเรียกกับทั้งสามส่วน); การเทียบไม่สนตัวพิมพ์เล็ก-ใหญ่; คำค้นที่มีอักขระพิเศษของ regex (เช่น `(` หรือ `.`) ต้องไม่ทำให้หน้าพัง เพราะ `highlight()` escape ให้ก่อนสร้าง regex

---
## TC-CAT-090012 — ค้นด้วย code และ description ก็พบรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยกรอก Description ที่มีคำเฉพาะซึ่งไม่ปรากฏในชื่อหรือรหัสของรายการใดเลย และรู้ code ที่ backend กำหนดให้
**Steps**
1. พิมพ์ **code** ของรายการนั้นลงในช่องค้นหา
2. ตรวจว่าพบแถวนั้นหรือไม่
3. ล้างคำค้นแล้วพิมพ์ **คำเฉพาะจาก Description** แทน
4. ตรวจว่าพบแถวนั้นหรือไม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ค้นด้วย code แล้วพบแถวนั้น และค้นด้วยคำจาก description ก็พบแถวเดียวกัน — `nodeMatches()` เทียบคำค้นกับ **code, name และ description** ครบสามอย่าง; ทั้งสองกรณีคำที่ตรงถูก highlight ตาม `TC-CAT-090011`; รายการอื่นที่ไม่มีคำนั้นทั้งในสามฟิลด์และในลูกของตัวเองจะหายจากผลลัพธ์

---
## TC-CAT-090013 — ค้นเจอลูก แล้วบรรพบุรุษถูกกางให้อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้พร้อม subcategory ใต้สังกัด **2 ตัว** ที่ชื่อต่างกันชัดเจน — ชื่อของ subcategory ตัวแรกต้องไม่ปรากฏในชื่อของ category แม่
**Steps**
1. กดปุ่ม Collapse เพื่อพับทุกอย่างก่อน
2. พิมพ์ชื่อของ **subcategory ตัวแรก** ลงในช่องค้นหา
3. สังเกตว่า category แม่และ subcategory ตัวแรกแสดงอยู่หรือไม่
4. สังเกตว่า subcategory ตัวที่สอง (ซึ่งไม่ตรงคำค้น) แสดงอยู่ด้วยหรือไม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
category แม่ยังแสดงอยู่ในผลลัพธ์แม้ตัวมันเองไม่ตรงคำค้น (`nodeMatches` ไล่เช็คลูกแบบ recursive) และ **ถูกกางให้อัตโนมัติ** จนเห็น subcategory ที่ตรงคำค้น โดยไม่ต้องกดกางเอง — สถานะกางขณะค้นหามาจาก `searchExpanded` ไม่ใช่สถานะที่ผู้ใช้ตั้งไว้ จึงลบล้างผลของปุ่ม Collapse ที่กดไปในขั้นตอนแรก; **subcategory ตัวที่สองที่ไม่ตรงคำค้นก็ยังแสดงอยู่ด้วย** เพราะการกรองทำที่ระดับบนสุดเท่านั้น ลูกไม่ถูกกรอง (ดูหมายเหตุข้อ 13) — assertion ต้องยึดตามนี้ ไม่ใช่คาดว่าจะเหลือเฉพาะลูกที่ตรง

---
## TC-CAT-090014 — ข้อความไม่พบผลลัพธ์ และปุ่มกากบาทล้างคำค้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มี category อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/product-management/category`
2. สังเกตไอคอนของปุ่มท้ายช่องค้นหาขณะช่องยังว่าง
3. พิมพ์คำที่แน่ใจว่าไม่ตรงกับอะไรเลย แล้วอ่านข้อความที่แสดงแทน tree
4. สังเกตไอคอนของปุ่มท้ายช่องค้นหาอีกครั้ง แล้วคลิกปุ่มนั้น
**Expected**
ขณะช่องว่าง ปุ่มท้ายช่องเป็นแว่นขยาย (aria-label **"Search"**); เมื่อไม่พบผลลัพธ์ กล่อง tree แสดงข้อความ **"No results for \"<คำค้น>\""** โดยมีคำค้นอยู่ในข้อความจริง ๆ (ไม่ใช่ข้อความว่างหรือ tree เปล่า); เมื่อช่องมีข้อความ ปุ่มท้ายช่องเปลี่ยนเป็นกากบาท (aria-label **"Clear search"**) — คลิกแล้วช่องว่างลงและ tree กลับมาแสดงทุกรายการทันทีโดยไม่ต้องกด Enter
_(สเปกเดิม `TC-CAT-090002` assert ว่าจำนวน node เป็น 0 แต่ไม่เคยตรวจข้อความที่แสดงแทน และ `emptyState()` ใน page object ก็แมตช์ข้อความนี้ไม่ได้ — ดูหมายเหตุข้อ 4)_

---
## TC-CAT-100010 — ไม่มีสิทธิ์ดู — RouteGuard บล็อกทั้ง sidebar และ deep link
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** สิทธิ์ `product_management.category.view` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Product Management ใน sidebar แล้วสังเกตรายการ "Category"
2. คลิกรายการนั้น
3. `page.goto("/product-management/category")` ตรง ๆ
4. อ่านองค์ประกอบของการ์ดที่แสดงแทนเนื้อหน้า
**Expected**
รายการ "Category" ใน sidebar ถูกทำให้จางและ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/product-management/category">` ให้กด; คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; deep link ถูก `RouteGuard` บล็อกโดยแสดงการ์ด `role="alert"` ที่มีคำว่า **"Restricted"**, หัวข้อ **"Permission Denied"**, ข้อความ **"You don't have permission to view this page."**, บรรทัด **"Contact your administrator to request access."** และปุ่ม **"Go to an available page"** — **ไม่ใช่การ redirect เงียบ ๆ และไม่ใช่หน้า tree ที่ว่างเปล่า**; **ไม่มีไอคอนแม่กุญแจ** เพราะ leaf ของ category ไม่มี `licenseFeature` (`constant/module-list.ts:186-189`)
_(เคส `TC-CAT-010002` / `020002` / `030003` / `040002` / `050003` / `090004` ในสเปกอ้างว่าครอบเรื่องนี้แล้ว แต่ oracle ของทั้งหกเป็นจริงเสมอ — ดูหมายเหตุข้อ 6 และอย่าลืมข้อ 5: **ห้ามขยายเคสนี้ไปตรวจว่าปุ่ม Add/Edit/Delete ถูกกั้น** เพราะโมดูลนี้ยังไม่มี RBAC gate ที่ปุ่ม)_

---
## TC-CAT-110001 — ปิดใช้งาน category แล้วหายจาก Lookup ของฟอร์มสินค้า
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี category ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (**ห้ามใช้หมวดที่เป็น fixture ของ `docs/test-cases/100-product.md`** — ดูหมายเหตุข้อ 9) และกำลังเปิดใช้งานอยู่; ผู้ใช้มีสิทธิ์เข้าหน้า `/product-management/product/new`
**Steps**
1. ไปที่ `/product-management/product/new` แล้วเปิดช่อง Category — ตรวจว่ามีรายการที่สร้างไว้ในตัวเลือก
2. กลับไปที่ `/product-management/category` แล้วแก้ category นั้นให้ปิดใช้งาน แล้ว Save
3. กลับไปที่ `/product-management/product/new` (โหลดใหม่) แล้วเปิดช่อง Category อีกครั้ง
4. ลบ category ที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ก่อนปิดใช้งาน รายการนั้นอยู่ในตัวเลือกของช่อง Category โดยแสดงในรูป **`<code> — <ชื่อ>`**; หลังปิดใช้งาน **รายการนั้นหายจากตัวเลือกทั้งหมด** — `LookupCategory` กรอง `.filter((c) => c.is_active)` เช่นเดียวกับ lookup ของ Sub Category และ Item Group; ช่อง Sub Category ยังคงถูก disable จนกว่าจะเลือก Category (พฤติกรรม cascade ของฟอร์มสินค้า)
_(นี่คือเหตุผลที่การปิดใช้งานหรือการลบหมวดเป็น blocker ต่อโมดูล product: สินค้าใหม่บังคับกรอกครบทั้งสามชั้น ถ้าสายที่เทสของ product ใช้ถูกปิดใช้งาน เทสชุดนั้นจะพังทันที — ดูหมายเหตุข้อ 9)_

---
## TC-CAT-110002 — สายหมวดที่สร้างใหม่ครบสามชั้นเลือกได้ในฟอร์มสินค้า
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี Tax Profile ที่ active อย่างน้อย 1 รายการ; **blocker:** ชั้น item group ยังสร้างผ่าน UI ไม่ได้เพราะ backend ตอบ 400 (ดูหมายเหตุข้อ 3 และ 9) — เคสนี้รันได้ต่อเมื่อ backend แก้แล้ว หรือเตรียม item group ไว้ล่วงหน้าจากฝั่ง backend
**Steps**
1. ที่ `/product-management/category` สร้าง category ใหม่, สร้าง subcategory ใต้มัน แล้วสร้าง item group ใต้ subcategory นั้น
2. ไปที่ `/product-management/product/new`
3. เปิดช่อง Category แล้วเลือกรายการที่เพิ่งสร้าง
4. เปิดช่อง Sub Category แล้วเลือกรายการที่เพิ่งสร้าง จากนั้นเปิดช่อง Item Group แล้วเลือกรายการที่เพิ่งสร้าง
5. ออกจากหน้าสินค้าโดยไม่บันทึก แล้วลบหมวดทั้งสามชั้นไล่จากล่างขึ้นบนเพื่อคืนสภาพ
**Expected**
ทั้งสามรายการที่เพิ่งสร้างปรากฏในตัวเลือกของช่องที่ตรงระดับกัน และเลือกได้ครบทั้งสาย; ช่อง Sub Category ใช้งานได้หลังเลือก Category และแสดงเฉพาะรายการใต้ Category ที่เลือก; ช่อง Item Group ใช้งานได้หลังเลือก Sub Category และแสดงเฉพาะรายการใต้ Sub Category ที่เลือก; การลบคืนสภาพต้องไล่จากชั้นล่างสุดขึ้นบน
