# Price List Template — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบอยู่แล้วใน `tests/160-pl-template.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/160-pl-template.md`_

**Module:** Vendor Management — Price List Template (แม่แบบใบราคา)
**Frontend route:** `routes/vendor-management/price-list-template`  •  **URL:** `/vendor-management/price-list-template`, `/vendor-management/price-list-template/new`, `/vendor-management/price-list-template/:id`
**Prefix:** `PT`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/160-pl-template.spec.ts` (**33 `test()` จริง** — 1 เป็น `.fixme`, อีก 6 เรียก `.skip(true, …)` แบบมีเงื่อนไขในตัวเทส)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 58

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกมี 33 เทสจริง ไม่ใช่ 39** — `grep -o 'TC-PT-[0-9]\{6\}' tests/` คืน 39 ID เพราะนับ **ID ที่อยู่ในคอมเมนต์หัวข้อ** ด้วย คือ `TC-PT-900001..900006` ซึ่งเป็นป้ายกำกับกลุ่ม (`// TC-PT-900001 — Create Pricelist Template`) ไม่ใช่ `test()` เอกสารนี้ **ไม่หยิบเลข 900001–900006 มาใช้ซ้ำ** และเริ่มบล็อก 90 ที่ `900007`
>
> 2. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — ถือ ID `TC-PT-010001`, `010002`, `010004`, `010005`, `010050`, `010051`, `020001..020004`, `030001..030005`, `040001..040004`, `040050`, `040051`, `050001`, `050003..050005`, `050050`, `050051`, `060001..060005`, `200050` **ไม่มี helper ตัวใดผลิตเคสของ `PT` เลย** (สเปกไม่ได้ import `tests/helpers/security-cases.ts`; ที่ import คือ `fixtures/auth.fixture`, `pages/price-list-template.page`, `helpers/bu`, `pages/bu-switcher.page`, `helpers/test-data`, `helpers/list-row`) เรื่องที่ครอบแล้วคือ: สร้างสำเร็จ (ชื่อ+currency+description), ชื่อว่างบล็อกการบันทึก, สร้างโดยไม่กรอก description ได้, staff กดปุ่ม Add ไม่ได้, empty state ของตารางสินค้า, ติ๊กสินค้าจาก tree แล้วมีแถวเกิด, ลบสินค้าแล้วกลับเป็น empty state, staff ไม่เห็นช่องค้นหาของ tree, แก้ชื่อแล้ว save, validity 0 ถูกบล็อกด้วย native `min=1` (โหมดแก้ไข), ไม่มีปุ่ม/เมนู Clone ทั้ง detail · row actions · edit mode · ฝั่ง staff, สร้างพร้อม status = Active, dropdown สถานะมีสามค่าเท่านั้น, สลับสถานะรัว ๆ แล้ว save ได้, staff ไม่เห็น status select, เปิด template รายการแรกได้ URL `/:id`, ค้นหาคำที่ไม่มีแล้วเจอ empty message, เรียงลำดับด้วยหัวคอลัมน์ Name, active BU = BLAVG, admin สร้าง/แก้/ยกเลิกการแก้/ลบ, ชื่อซ้ำถูก reject — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 3. **⚠️ เคสที่ "ผ่านโดยไม่ได้ตรวจจริง" — นับให้ครบก่อนเชื่อผลรันสีเขียว** (ตัวเลขจากไฟล์สเปกวันที่เขียนรายงานนี้):
>     - **`.catch()` ทั้งไฟล์ 21 จุด** (บรรทัด 52 เป็นคอมเมนต์ ไม่นับ) — **1 จุดครอบ assertion** คือ `TC-PT-010004` (`tests/160-pl-template.spec.ts:139-141`: `await expect(...).toBeVisible({ timeout: 5_000 }).catch(() => {})`) อีก **20 จุดครอบ action** (`editButton().click().catch()`, `saveButton().click().catch()`, `search.fill().catch()`, `search.press("Enter").catch()`)
>     - **`expect(true).toBe(true)` 6 จุด** เป็น escape hatch เมื่อไม่มีข้อมูล — `TC-PT-010004`, `020003`, `040001`, `040003`, `040004`, `050004`
>     - **`TC-PT-010004` ผ่านเสมอทุกทาง** — สาขา `count() === 0` จบด้วย `expect(true).toBe(true)` ส่วนสาขา else ทั้งคลิกและ assertion ถูก `.catch()` กลืน ไม่มีทางแดง
>     - **2 เคสไม่มี assertion เลยแม้แต่บรรทัดเดียว** — `TC-PT-030004` และ `TC-PT-030005` (คลิก Edit แล้ว Save โดยที่ทั้งสองคลิกถูก `.catch()` ครอบ แล้วจบฟังก์ชัน)
>     - **`TC-PT-030003` เป็น false positive เชิงโครงสร้าง** — assert `tpl.anyError().first()` visible แต่ `BasePage.anyError()` (`tests/pages/base.page.ts:33-35`) แมตช์ `.text-destructive` ด้วย และฟอร์มนี้ render เครื่องหมายบังคับกรอกเป็น `<span className="text-destructive"> *</span>` ข้าง label **Name และ Currency ทุกครั้งที่อยู่โหมด add/edit** (`plt-form.tsx:215, 235`) ⇒ `anyError()` มองเห็นดาวสองดวงเสมอ เคสจึงเขียวโดยไม่เกี่ยวกับ validation ใด ๆ เลย (`TC-PT-020002` ที่เป็น `.fixme` ก็ใช้ oracle เดียวกัน — ถ้าปลด fixme โดยไม่เปลี่ยน oracle จะได้เคสเขียวปลอมอีกตัว)
>     - **`TC-PT-060004` ข้าม (`skip`) ทุกครั้ง** — ดูข้อ 5
>     - รวมแล้ว **เคสที่ไม่ให้สัญญาณอะไรเลย 9 ตัวจาก 33** (`010004`, `020002` fixme, `030003`, `030004`, `030005`, `040001`/`040003`/`040004` ในสาขา list ว่าง, `060004`) **เอกสารนี้ไม่ถือว่าเรื่องที่เคสเหล่านี้อ้างว่าครอบ ถูกครอบแล้ว** — เคสที่เขียนใหม่จึงกลับไปแตะเรื่องเดียวกันบางส่วนด้วย **oracle ที่ผูกกับของจริง** (เช่น `TC-PT-200001` ใช้ข้อความ error ใต้ช่องแทน `anyError()`)
>
> 4. **Section block ที่ `PT` ลงทะเบียนไว้คือ `01–06, 20, 90`** (`docs/test-id-scheme.md:47`) — **ไม่ต้องแก้ scheme** แต่ต้องจัดสองกลุ่มเข้าบล็อกใกล้เคียงเพราะ `10–19` (Security/Authorization) และ `30` (Export/integration) ไม่ได้ลงทะเบียนให้ `PT`:
>     - เคส **Authorization / License** (ตามขนบอยู่บล็อก 10) → จัดเข้า **06** เพราะทั้งสามเคส (`TC-PT-060019..060021`) เป็นเรื่องของ *หน้ารายการ*: `RouteGuard` ตัดสินที่ `pathname` ของ list และ deep link, ส่วนการแยกข้อมูลตาม BU วัดจากแถวในตารางรายการ
>     - เคส **Export** (ตามขนบอยู่บล็อก 30) → จัดเข้า **06** เพราะปุ่ม Export อยู่ในแถบหัวของหน้า list เดียวกัน (`DocumentListActions`) และผลลัพธ์ผูกกับตัวกรอง/หน้าปัจจุบันของตาราง
>
>     ที่เหลือใช้ความหมายเดิมของแต่ละบล็อกตามที่สเปกวางไว้: **01** = ฟอร์มสร้าง `/new` · **02** = การเลือกสินค้าในฟอร์ม · **03** = โหมดแก้ไขบน `/:id` · **04** = โหมดดู/deep link/ประวัติ/ลบจากหน้ารายละเอียด · **05** = สถานะและการลบจากหน้ารายการ · **06** = หน้ารายการ · **20** = validation · **90** = edge case
>
> 5. **⚠️ page object ล้าสมัยเทียบกับ UI ปัจจุบัน — ต้องตามแก้ก่อนแปลงเคสในเอกสารนี้เป็นสเปก** (ยืนยันจากโค้ดแอปวันที่เขียนรายงานนี้ **ห้ามแก้ไฟล์เหล่านี้ในงานนี้** แต่ผู้เขียนสเปกต้องรู้):
>     - **`statusTab()` (`tests/pages/price-list-template.page.ts:63-65`) อ้าง `getByRole("tab")` ซึ่งไม่มีในแอปแล้ว** — หน้ารายการปัจจุบันประกอบจาก `DocumentListHeader` + `DocumentListActions` + `ListToolbar` + `DataGrid` (`plt-component.tsx:181-261`) **ไม่มี Radix Tabs อยู่เลย** ตัวกรองสถานะเป็น `MultiSelectFilter` ใน submenu ของปุ่ม Filter ⇒ ขั้นตอน "คลิก status tab 'All'" ใน annotation ของ `TC-PT-060001` และ `TC-PT-060004` อธิบาย UI ที่ไม่มีอยู่จริง
>     - **`filterByProductCount()` / `applyFilterButton()` อ้างฟีเจอร์ที่ไม่มีในแอป** — grep ทั้ง frontend ไม่เจอข้อความ "Filter by Product Count" หรือ "Apply filter" ใด ๆ ตัวกรองเดียวของหน้านี้คือ Status (`plt-component.tsx:72-101`) ⇒ **`TC-PT-060004` เข้าสาขา `skip` ทุกครั้งที่รัน** เอกสารนี้จึงเขียน `TC-PT-060009` ครอบตัวกรองที่มีอยู่จริงแทน
>     - **`templateCard()` / `openTemplate()` ใช้ไม่ได้ตามที่ docstring บอก** — `openTemplate()` fallback ไป `templateRow(text).click()` แต่ `<tr>` ของ DataGrid **ไม่ใช่ตัวเปิดรายการ** ทางเข้าคือปุ่มลิงก์ในคอลัมน์ Name (`CellAction` ใน `use-plt-table.tsx:50-54`) ส่วนการ์ดในมุมมองกริดคือ `ListCard` ที่มี `onOpen` ไม่ใช่ `[data-slot='card'] / article / .card` ที่ locator เดาไว้ (ดูบันทึกของ `tests/helpers/list-row.ts:16-27` เรื่อง `row.click()` ที่ค้างจนหมดเวลา)
>     - **`TC-PT-060005` อ่านคอลัมน์ผิดหลัก** — สเปกเก็บค่าด้วย `page.locator("tbody tr td:nth-child(2)")` แต่คอลัมน์ที่ 1 คือช่องเลือก (`selectColumn`) และคอลัมน์ที่ 2 คือลำดับที่ (`indexColumn`) **ชื่อ template อยู่คอลัมน์ที่ 3** (`use-plt-table.tsx:125-133`) ⇒ สิ่งที่เทียบกันคือเลข `1,2,3,…` ซึ่งไม่เปลี่ยนเมื่อเรียงใหม่ ทำให้ `expect(descending).not.toEqual(ascending)` ล้มเหลว **นี่คือเคสที่แดงเพราะเทสผิด ไม่ใช่แอปผิด — แก้เป็น `td:nth-child(3)` ก่อนอย่างอื่น**
>     - **`pickFirstProduct()` มีตัวกรองที่ไม่เคยแมตช์อะไร** — `.filter({ hasNot: getByRole("button", { name: /expand|collapse/i }) })` ตั้งใจเลี่ยงโหนดกลุ่ม แต่ปุ่มกางโหนดใน `TreeProductLookup` (`components/share/tree-product-lookup.tsx:316-327`) เป็น `<button>` ที่มีแต่ไอคอน `ChevronRight` **ไม่มี `aria-label` และไม่มีข้อความ** ⇒ ไม่มี accessible name ให้แมตช์ การกันไม่ให้ติ๊กโหนดกลุ่ม (ซึ่งเลือกสินค้าทั้งหมู่ทีเดียว) จึงเหลือแต่ `.last()` ล้วน ๆ (ดูบันทึกทีมเรื่อง `hasNot` ใน reference กับดัก Playwright)
>     - **`removeProductRowButton()` ไม่ได้ชี้ปุ่ม "Remove tier" อย่างที่ชื่อบอก** — regex เป็น `/remove tier|remove product/i` แต่ปุ่ม **Remove tier แสดงเฉพาะเมื่อสินค้านั้นมี MOQ tier มากกว่า 1 แถว** (`plt-item-cards.tsx:134`) หลังติ๊กสินค้าหนึ่งรายการจาก tree จะมีแค่ปุ่ม **Remove product** ⇒ `TC-PT-020001` / `TC-PT-020004` กำลังตรวจปุ่มลบทั้งสินค้า ไม่ใช่ลบ tier (และ `removeFirstProduct()` ก็ไปยืนยันกล่อง `Remove Product "<ชื่อ>"` ไม่ใช่ `Remove MOQ Tier`)
>     - **docstring ของ class บรรยาย UI ผิดสามจุด** — (ก) `"a hero NameField"` ของจริงคือ `FieldInput id="plt-name"` (`plt-form.tsx:220-226`) `nameInput()` ที่เจาะด้วย placeholder ยังแมตช์อยู่เพราะ `namePlaceholder` ยังเป็น `"e.g. Fresh Produce Template"` แต่ **`#plt-name` คือ handle ที่ควรใช้** (ข) `"an \"Add Template\" button"` ป้ายจริงคือ **"Add Price List Template"** (`messages/en.json` → `vendorManagement.priceListTemplate.add`) (ค) `"an optional description Textarea"` ถูก แต่ไม่ได้บอกว่ามันถูกปิด maxLength ไว้ที่ 256
>     - **`productCards()` เป็นสำเนาซ้ำของ `removeProductRowButton()`** (regex ต่างกันแค่ลำดับ) และไม่มีใครเรียกใช้ — ลบได้
>     - `validityDaysInput()` = `getByRole("spinbutton").first()` ยังถูกอยู่ (ช่อง validity อยู่ก่อนตารางสินค้าใน DOM) แต่ต้องรู้ว่า **`QtyCell` ก็เป็น `type="number"`** (`plt-item-cells.tsx:105`) พอมีสินค้าในฟอร์มแล้ว spinbutton จะมีหลายตัว — อย่าเปลี่ยนไปใช้ `.last()` หรือ `.nth()`
>
> 6. **กับดัก toast — สาม toast มีคำว่า `success` เหมือนกันหมด** `messages/en.json` กำหนด `toast.createSuccess = "{entity} created successfully"`, `updateSuccess`, `deleteSuccess` และ `t("entity") = "Price List Template"` regex กว้าง ๆ อย่าง `/success|saved|created|updated|deleted|สำเร็จ/i` (ซึ่ง `PriceListTemplatePage.successToast()` ใช้อยู่) จึงแมตช์ toast ของ *ทุก* การกระทำ **เคสใหม่ทุกเคสในเอกสารนี้ให้ผูก assertion กับข้อความเต็ม** เช่น `/Price List Template created successfully/i`, `/Price List Template updated successfully/i` หรือรอ response ของ PATCH/POST ด้วย `waitForResponse` แทน
>
> 7. **สร้างสำเร็จแล้วเด้งกลับหน้า *list* ไม่ใช่หน้ารายละเอียด** — `use-plt-form-actions.ts:122-125` เรียก `navigate("/vendor-management/price-list-template")` ใน `onSuccess` ของ create (ต่างจากโมดูล vendor ที่ไปหน้า `/:id`) สเปกปัจจุบัน **ไม่มีเคสใดตรวจปลายทางหลังสร้างเลย** — `TC-PT-010053` ปิดช่องนี้
>
> 8. **`currency` เป็น required แต่เคส "currency ว่าง" เข้าไม่ถึงผ่าน UI ปกติ** — `getDefaultValues()` เติม `currency_id` จาก `defaultCurrencyId` ของ BU (`plt-form-schema.ts:80`, `use-profile.ts:75`) และ `LookupCurrency` เป็น Radix `Select` ที่ **ไม่มีตัวเลือกว่างให้ล้างค่า** (`components/lookup/lookup-currency.tsx:109-119`) ⇒ เมื่อ BU ตั้ง default currency ไว้ ช่องนี้จะไม่มีวันว่าง **เอกสารนี้จึงไม่เขียนเคส "บันทึกโดยไม่เลือก currency"** บันทึกไว้เป็นข้อเท็จจริงแทน — ถ้าทีมต้องการเคสนี้จริง ต้องเตรียม BU ที่ `config.default_currency_id` ว่าง
>
> 9. **`unit_id` เป็น required ใน schema แต่ก็เข้าไม่ถึงเช่นกัน** — `LookupProductUnit` มี effect auto-select หน่วยแรกทุกครั้งที่ค่าปัจจุบันไม่อยู่ในรายการ (`components/lookup/lookup-product-unit.tsx:67-72`) ⇒ แถวสินค้าที่มีหน่วยอย่างน้อยหนึ่งหน่วย จะมี `unit_id` เสมอ **ไม่มีเคส "แถวสินค้าไม่มีหน่วย"** ในเอกสารนี้ (สินค้าที่ *ไม่มีหน่วยเลย* จะทำให้ save ติด `Unit is required` ได้จริง แต่ต้องเตรียม master data พิเศษ — เป็นงานคนละใบ)
>
> 10. **บันทึก template ที่ไม่มีสินค้าเลย "สำเร็จ" ได้** — `createPltSchema` ประกาศ `details: z.array(...)` **โดยไม่มี `.min(1)`** (`plt-form-schema.ts:23`) และ `onSubmit` ส่ง `products: {}` เมื่อไม่มีรายการ (`use-plt-form-actions.ts:79-81`) นี่คือสาเหตุที่ `TC-PT-020002` ถูกแขวนเป็น `.fixme` **เอกสารนี้ไม่เขียนเคสที่ยืนยันว่า "ต้องมีสินค้าอย่างน้อย 1 รายการ"** เพราะกฎนั้นยังไม่มีอยู่ในโค้ด — ต้องตัดสินใจฝั่ง product ก่อนว่าจะบังคับหรือไม่
>
> 11. **ชื่อที่เป็นช่องว่างล้วนผ่าน validation** — `name: z.string().min(1, …)` นับความยาวสตริงดิบ ไม่มี `.trim()` ⇒ `"   "` (ค่าคงที่ `INVALID_NAME` ที่ประกาศไว้ในสเปกบรรทัด 24 แต่ **ไม่เคยถูกใช้เลย**) จะผ่านฝั่ง client บันทึกแล้วหัวเรื่องหน้ารายละเอียดกลายเป็นช่องว่าง และคอลัมน์ Name ในตารางแสดง `"..."` (fallback ใน `use-plt-table.tsx:52`) **เอกสารนี้ไม่เขียนเคสที่ยืนยันพฤติกรรมนี้** เพราะมันคือช่องโหว่ที่ควรแก้ ไม่ใช่สัญญาที่ควรตรึง — บันทึกเป็นข้อเท็จจริงไว้ให้ทีมตัดสินใจ
>
> 12. **เมนู row actions ของหน้านี้ไม่มีรายการ Edit** — `use-plt-table.tsx:129-132` ส่งให้ `actionColumn()` แค่ `onDelete` + `activity` ไม่ได้ส่ง `onEdit` ⇒ `DataGridRowActions` render เฉพาะ **Activity** กับ **Delete** (`components/ui/data-grid/data-grid-row-actions.tsx:95-135`) **annotation ของ `TC-PT-040002` ที่เขียนว่า "มีเพียง Edit / Delete" จึงผิด** (ตัวเทสเองไม่ได้ assert เรื่องนี้ มัน assert แค่ว่าไม่มี Clone) — `TC-PT-060017` เขียน oracle ที่ตรงกับ UI จริง
>
> 13. **หน้านี้ถูก gate ด้วย license ด้วย ไม่ใช่แค่ RBAC** — `constant/module-list.ts:228-232` ประกาศ `licenseFeature: "vendor_management.price_list_template"` (ต่างจากโมดูล vendor ที่ไม่มี) และ `RouteGuard` เช็ค **license ก่อน permission เสมอ พร้อมระบุว่าไม่มี admin bypass** (`components/route-guard.tsx:56-72`) ⇒ มีสองสถานะปฏิเสธคนละกล่อง: `Feature Not Licensed` (license) กับ `Permission Denied` (RBAC) — `TC-PT-060019` / `TC-PT-060020` แยกสองเรื่องนี้ออกจากกัน ส่วน `TC-PT-060003` ในสเปกปัจจุบันเป็น assertion แบบ "อยู่หน้า list **หรือ** ถูกเด้ง" ซึ่งเป็นจริงเสมอ
>
> 14. **`permission` ของ leaf นี้คือ `vendor_management.view` ซึ่งใช้ร่วมกับทุกโมดูลใต้ vendor-management** — ไม่มี permission เฉพาะของ price-list-template และ `useDeleteGate()` derive `deletePermission` เป็น `vendor_management.delete` ผ่าน `usePermissionPrefix()` (`hooks/use-permission-prefix.ts:21-27`) ⇒ เคสสิทธิ์ของโมดูลนี้ **ไม่สามารถแยกจาก vendor / certification / request-price-list ได้** ต้องตั้ง precondition ที่ระดับ `vendor_management` เสมอ
>
> 15. **`RouteGuard` ครอบ `/new` และ `/:id` ด้วย** — `findRouteLeaf()` (`constant/module-list.ts:114-126`) จับแบบ prefix (`pathname.startsWith(m.path + "/")`) ดังนั้น deep link เข้าฟอร์มก็ถูกเช็ค license + `vendor_management.view` เหมือนหน้า list
>
> 16. **ปุ่ม Add · Edit · Delete บนฟอร์มไม่ถูกเช็ค permission ฝั่ง UI** — `plt-component.tsx:190-195` เรียก `DocumentListActions` โดย **ไม่ส่ง `addDisabled`** และ `plt-form.tsx:133-192` วางปุ่ม Edit / Delete / Activity เป็น `<Button>` ดิบใน `DocFormHeader` ไม่ได้ผ่าน `FormToolbar` ที่เช็คสิทธิ์ให้ ทางเดียวที่ยังกั้นอยู่คือ `RouteGuard` กับปุ่มลบในแถวตาราง/บนการ์ดที่ผ่าน `useDeleteGate()` **เอกสารนี้จึงไม่เขียนเคสที่ assert ว่าปุ่ม Add/Edit/Delete บนฟอร์มถูกกั้น** — บันทึกเป็นข้อเท็จจริงไว้ที่นี่ให้ทีมตัดสินใจว่าจะแก้แอปหรือรับไว้
>
> 17. **ปุ่ม "Add Item" ในกล่องว่างของโหมดดู ไม่ได้พาเข้าโหมดแก้ไข** — `plt-item-fields.tsx:141-147` ผูก `onAdd={handleAddProduct}` ซึ่ง `prependDetail()` ลงใน field array เฉย ๆ **โดยไม่เรียก `setMode("edit")`** ฟอร์มจึงยังอยู่โหมด view แล้วสลับไป render `PltItemGroupedView` จาก `priceListTemplate.products` ที่ยังว่าง ได้ตารางเปล่า **`TC-PT-040011` จึง assert แค่ว่าปุ่มและกล่องว่างปรากฏตามออกแบบ ไม่ assert ผลของการกด** — ถ้าทีมแก้ให้กดแล้วเข้าโหมดแก้ไขเมื่อไร ค่อยเพิ่ม assertion ทีหลัง (คอมเมนต์ใน page object บรรทัด 217-219 ที่ว่า "a shortcut into edit mode" ก็ไม่ตรงกับโค้ดแล้ว)
>
> 18. **ตัวกรองสถานะล้างตัวเองเมื่อเลือกครบทุกค่า** — `MultiSelectFilter.toggle()` เรียก `onChange(next.length >= options.length ? "" : next.join(","))` (`components/ui/multi-select-filter.tsx:88-93`) ⇒ ติ๊กครบ Draft + Active + Inactive เท่ากับไม่กรอง (chip หาย, `filter` หลุดจาก URL) — พฤติกรรมตั้งใจ ไม่ใช่บั๊ก `TC-PT-060009` ตรวจข้อนี้ด้วย
>
> 19. **ปุ่ม Filter บน desktop เปิด `ListFilterMenu` (popover สองชั้น) ไม่ใช่ sheet** — แถวของ field เป็น `<button>` ธรรมดา แต่ **ตัวเลือกสถานะใน submenu เป็น `CommandItem` ⇒ มี `role="option"` จริง** (ต่างจากโมดูล vendor ที่ submenu สถานะเป็นปุ่มเปล่า) เพราะหน้านี้ประกาศ field เป็น `control: "custom"` ที่ render `MultiSelectFilter` (`plt-component.tsx:90-97`)
>
> 20. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PT-010052 | โครงหน้า /new — หัวเรื่อง แถบปุ่ม และสี่หมวดของฟอร์ม | Medium | Functional |
| TC-PT-010053 | สร้างสำเร็จแล้วเด้งกลับหน้ารายการ ไม่ใช่หน้ารายละเอียด | High | Happy Path |
| TC-PT-010054 | Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับรายการ | Medium | Alternate Flow |
| TC-PT-010055 | ปุ่ม Go back — ดักเมื่อ dirty และกลับทันทีเมื่อยังไม่แก้อะไร | Medium | Functional |
| TC-PT-010056 | กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-PT-010057 | ตัวปรับ Validity period — ปุ่มลบ/บวก ปุ่ม preset และป้ายหน่วยวัน | Medium | Functional |
| TC-PT-010058 | สร้างพร้อมคำอธิบายและคำสั่งถึงผู้ขาย แล้วค่าคงอยู่ | Medium | CRUD |
| TC-PT-010059 | ช่อง Currency ถูกเติมด้วยสกุลเงินตั้งต้นของ BU ตั้งแต่เปิดฟอร์ม | Medium | Functional |
| TC-PT-020005 | โครงกล่อง Product Catalog — หัวข้อ ตัวนับ ช่องค้นหา และทรีสามชั้น | Medium | Functional |
| TC-PT-020006 | ค้นหาในทรีสินค้า กางอัตโนมัติ และสถานะไม่พบ | Medium | Functional |
| TC-PT-020007 | ติ๊กโหนดกลุ่มเลือกสินค้าใต้กลุ่มทั้งหมด และสถานะกึ่งเลือก | High | Functional |
| TC-PT-020008 | ถอดติ๊กสินค้าจากทรี แถวของสินค้านั้นหายจากฝั่งขวา | High | Functional |
| TC-PT-020009 | เพิ่ม MOQ tier ให้สินค้าเดิม และปุ่มลบ tier โผล่เมื่อมีเกินหนึ่งแถว | High | Functional |
| TC-PT-020010 | ลบ MOQ tier ต้องยืนยันในกล่อง Remove MOQ Tier | Medium | Functional |
| TC-PT-020011 | ลบทั้งสินค้าต้องยืนยันในกล่องที่เอ่ยชื่อสินค้า | Medium | Functional |
| TC-PT-020012 | MOQ ที่ซ้ำกันในสินค้าเดียวถูกบวกขึ้นอัตโนมัติตอนออกจากช่อง | Medium | Edge Case |
| TC-PT-020013 | ช่องหน่วยของแต่ละแถวมีเฉพาะหน่วยของสินค้านั้น | Medium | Functional |
| TC-PT-020014 | ตัวนับข้างหัวข้อหมวดสินค้าตรงกับจำนวนแถวจริง | Low | Functional |
| TC-PT-030006 | แถบปุ่มต่างกันระหว่างโหมดดูกับโหมดแก้ไข | High | Functional |
| TC-PT-030007 | แก้สกุลเงิน อายุใบเสนอราคา คำอธิบาย และคำสั่งถึงผู้ขาย แล้วค่าคงอยู่ | High | CRUD |
| TC-PT-030008 | ยกเลิกการแก้ไขที่ dirty ต้องคืนค่าและกลับโหมดดู ไม่ใช่กลับรายการ | High | Alternate Flow |
| TC-PT-030009 | เพิ่มสินค้าในโหมดแก้ไขแล้วค่าคงอยู่ | High | CRUD |
| TC-PT-030010 | ลบสินค้าในโหมดแก้ไขแล้วหายจริงหลังโหลดใหม่ | High | CRUD |
| TC-PT-030011 | แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดสินค้าซ้ำ | High | Edge Case |
| TC-PT-030012 | บันทึกโดยไม่แตะรายการสินค้า สินค้าเดิมต้องครบเท่าเดิม | High | Edge Case |
| TC-PT-030013 | กดปุ่ม Back ของเบราว์เซอร์ขณะแก้ไข dirty ต้องถูกดัก | Medium | Functional |
| TC-PT-040005 | โหมดดูแสดงทุกค่าเป็นข้อความและแก้ไม่ได้ | High | Functional |
| TC-PT-040006 | ตารางสินค้าในโหมดดู — จัดกลุ่มตามสินค้าและชี้หน่วยสั่งซื้อ | High | Functional |
| TC-PT-040007 | deep link เข้าหน้ารายละเอียดโดยตรงได้โหมดดู | Medium | Functional |
| TC-PT-040008 | deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดงข้อความไม่พบรายการ | Medium | Edge Case |
| TC-PT-040009 | เปิดแผงประวัติกิจกรรมได้ทั้งโหมดดูและโหมดแก้ไข | Medium | Functional |
| TC-PT-040010 | ลบจากหน้ารายละเอียดแล้วเด้งกลับหน้ารายการ | High | CRUD |
| TC-PT-040011 | หน้ารายละเอียดที่ยังไม่มีสินค้าแสดงกล่องว่างพร้อมปุ่มเพิ่ม | Low | Functional |
| TC-PT-050006 | สถานะตั้งต้นของรายการใหม่คือ Draft และไหลไปถึงคอลัมน์ในรายการ | High | Functional |
| TC-PT-050007 | เปลี่ยนสถานะในโหมดแก้ไขแล้วสะท้อนทุกที่ | High | CRUD |
| TC-PT-050008 | ลบจากปุ่มบนการ์ดในมุมมองกริด | Low | CRUD |
| TC-PT-060006 | หน้ารายการแสดงหัวเรื่อง จำนวน ปุ่มหัวหน้า และคอลัมน์มาตรฐาน | High | Smoke |
| TC-PT-060007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-PT-060008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-PT-060009 | กรองตามสถานะแบบเลือกหลายค่า และล้างเมื่อเลือกครบ | High | Functional |
| TC-PT-060010 | เมนูเรียงลำดับในแถบเครื่องมือ — ไม่มีค่าเริ่มต้น สลับทิศ กลับ Default | Medium | Functional |
| TC-PT-060011 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-PT-060012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Medium | Functional |
| TC-PT-060013 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-PT-060014 | ส่งออกรายการเป็นไฟล์ XLSX ห้าคอลัมน์ | Medium | Functional |
| TC-PT-060015 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-PT-060016 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-PT-060017 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Medium | Functional |
| TC-PT-060018 | คอลัมน์ Name เป็นทางเข้าเดียวของแถว | Medium | Functional |
| TC-PT-060019 | ไม่มีสิทธิ์ดู — เมนูหาย และ deep link เจอกล่อง Permission Denied | High | Authorization |
| TC-PT-060020 | BU ที่ไม่ได้ซื้อฟีเจอร์ — เจอกล่อง Feature Not Licensed แม้เป็น admin | High | Authorization |
| TC-PT-060021 | รายการ template แยกตาม business unit | High | Security |
| TC-PT-200001 | ชื่อว่างแสดงข้อความ error ใต้ช่องและเลื่อนไปช่องแรกที่ผิด | High | Validation |
| TC-PT-200002 | ขีดจำกัดความยาวฝั่ง client ของทุกช่องข้อความ | Medium | Validation |
| TC-PT-200003 | อายุใบเสนอราคาเว้นว่างได้ แต่ค่าติดลบถูกบล็อก | Medium | Validation |
| TC-PT-200004 | MOQ ติดลบถูกบล็อกด้วย min=0 ของช่องจำนวน | Medium | Validation |
| TC-PT-900007 | ชื่อความยาวเต็มเพดาน 100 ตัวอักษร | Low | Edge Case |
| TC-PT-900008 | กดปุ่มสร้างรัว ๆ ต้องไม่เกิดรายการซ้ำ | Medium | Edge Case |

---
## TC-PT-010052 — โครงหน้า /new — หัวเรื่อง แถบปุ่ม และสี่หมวดของฟอร์ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ยังไม่เคยเปิดฟอร์มในรอบนี้
**Steps**
1. ไปที่ `/vendor-management/price-list-template` แล้วคลิกปุ่ม "Add Price List Template"
2. อ่านหัวเรื่อง ป้ายสถานะ และแถบปุ่ม
3. ไล่อ่านทุกหมวดของฟอร์มจากบนลงล่าง
**Expected**
URL เป็น `/vendor-management/price-list-template/new`; หัวเรื่องเป็นข้อความ placeholder "e.g. Fresh Produce Template" แสดงเป็น **ตัวเอียงสีจาง** (`titleMuted` เมื่อยังไม่กรอกชื่อ) และข้างหัวเรื่องมีป้ายสถานะ **DRAFT** ตัวพิมพ์ใหญ่; แถบปุ่มมีเฉพาะ **Cancel** กับ **Create** พร้อมปุ่ม Go back หน้าหัวเรื่อง — **ไม่มีปุ่ม Delete และไม่มีปุ่ม Activity** (ทั้งคู่ render เมื่อมี record เท่านั้น); หมวดแรกชื่อ "General" คำอธิบาย "Currency, validity period, description and status." มีช่อง Name (`#plt-name`, placeholder "e.g. Fresh Produce Template") และ Currency โดย label ของทั้งสองมีเครื่องหมาย `*`, ตามด้วย Validity Period, Description (placeholder "Optional") และ Status ซึ่ง label **ไม่มี** เครื่องหมายบังคับกรอก; หมวดที่สองชื่อ "Instructions to vendor" มี textarea ช่องเดียว; หมวดที่สามชื่อ "Products in this template" มีตัวเลข **0** ข้างหัวข้อ ฝั่งซ้ายเป็นกล่อง "Product Catalog" ฝั่งขวาเป็นกรอบประข้อความ "No products yet" + "Add products that any vendor receiving this template will be asked to price. MOQ tiers can vary per unit."

---
## TC-PT-010053 — สร้างสำเร็จแล้วเด้งกลับหน้ารายการ ไม่ใช่หน้ารายละเอียด
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ชื่อ template ที่จะใช้ยังไม่มีใน DB; BU มีสกุลเงินที่ `is_active` อย่างน้อย 1 รายการ
**Steps**
1. เปิด `/vendor-management/price-list-template/new`
2. กรอกชื่อ template ที่ไม่ซ้ำ
3. กด Create แล้วรอ toast
4. อ่าน URL ที่ได้หลังบันทึก
5. ค้นหาชื่อนั้นในหน้ารายการ แล้วลบทิ้งเพื่อคืนสภาพ
**Expected**
แสดง toast **"Price List Template created successfully"** (ผูกกับข้อความเต็ม ไม่ใช่คำว่า success ลอย ๆ — ดูหมายเหตุข้อ 6); **URL กลับเป็น `/vendor-management/price-list-template` ไม่ใช่ `/vendor-management/price-list-template/<uuid>`** (ต่างจากโมดูล vendor — ดูหมายเหตุข้อ 7); แถวใหม่ปรากฏในตารางโดยคอลัมน์ Status เป็น **DRAFT** และคอลัมน์ Currency เป็นรหัสสกุลเงินตั้งต้นของ BU; เพราะ navigate ไม่ได้ใช้ `replace` การกด Back ของเบราว์เซอร์จะย้อนกลับไปหน้า `/new` ที่ว่างแล้ว (ฟอร์มถูก unmount ไปแล้ว ไม่มี navigation guard ค้าง)

---
## TC-PT-010054 — Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับรายการ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` และกรอกชื่อไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ในแถบปุ่ม
2. อ่านหัวข้อ คำอธิบาย และปุ่มใน dialog ที่เด้งขึ้น
3. กดปุ่ม "Keep editing"
4. คลิก Cancel อีกครั้งแล้วกดปุ่ม "Discard"
5. ค้นหาชื่อที่กรอกไว้ในหน้ารายการ
**Expected**
กด Cancel แล้วเด้ง alert dialog หัวข้อ **"Discard changes?"** คำอธิบาย "You have unsaved changes that will be lost." และปุ่มสองตัวคือ "Keep editing" กับ "Discard" (variant warning); กด "Keep editing" แล้ว dialog ปิดและยังอยู่ที่ `/vendor-management/price-list-template/new` โดยค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วกลับไปหน้า `/vendor-management/price-list-template` (ในโหมดสร้าง `handleCancel` เรียก `navigate(listPath)` ตรง ๆ); ค้นหาชื่อนั้นแล้วไม่พบรายการ (ไม่มีอะไรถูกบันทึก)

---
## TC-PT-010055 — ปุ่ม Go back — ดักเมื่อ dirty และกลับทันทีเมื่อยังไม่แก้อะไร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด `/vendor-management/price-list-template/new` ได้
**Steps**
1. เปิด `/new` โดยยังไม่พิมพ์อะไรเลย แล้วคลิกปุ่ม Go back (ปุ่มลูกศรซ้ายหน้าหัวเรื่อง, label "Go back")
2. เปิด `/new` อีกครั้ง แล้วกรอกชื่อ template
3. คลิกปุ่ม Go back
4. กด "Keep editing" แล้วตรวจ URL
**Expected**
รอบแรกกลับไปหน้า `/vendor-management/price-list-template` **ทันทีโดยไม่มี Discard dialog** (ฟอร์มยังไม่ dirty); รอบที่สองเด้ง Discard dialog ใบเดียวกับ `TC-PT-010054` ก่อน; กด "Keep editing" แล้ว URL ยังเป็น `/vendor-management/price-list-template/new` และค่าที่กรอกไว้ยังอยู่; ทั้งสองรอบปลายทางคือหน้ารายการเสมอ **ไม่ใช่การถอย history ทีละหน้า** (`goBack` เรียก `navigate(listPath)`)

---
## TC-PT-010056 — กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` และกรอกชื่อไว้แล้ว (ฟอร์ม dirty) โดยยังไม่กด Create
**Steps**
1. คลิกเมนูอื่นใน sidebar ที่ไปคนละ path (เช่น Vendor หรือ Request Price List)
2. อ่าน dialog ที่เด้งขึ้นแล้วกด "Keep editing"
3. ตรวจ URL และค่าที่กรอกไว้
4. คลิกเมนูเดิมซ้ำแล้วกด "Discard"
**Expected**
คลิกลิงก์แล้ว **ยังไม่ navigate** แต่เด้ง Discard dialog ใบเดียวกับ `TC-PT-010054` (`useNavigationGuard` เปิดทำงานเมื่อ `(isAdd || isEdit) && isDirty && !isSubmitting`); กด "Keep editing" แล้ว URL ยังเป็น `/vendor-management/price-list-template/new` และค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วจึงไปยังหน้าปลายทางของลิงก์นั้นจริง

---
## TC-PT-010057 — ตัวปรับ Validity period — ปุ่มลบ/บวก ปุ่ม preset และป้ายหน่วยวัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`
**Steps**
1. ดูค่าเริ่มต้นในช่อง Validity period, สถานะของปุ่มลบ และคำใต้ช่อง
2. คลิกปุ่มบวก (aria-label "increase") สองครั้ง
3. คลิกปุ่มลบ (aria-label "decrease") จนค่าเป็น 1 แล้วกดต่ออีกครั้ง
4. คลิกปุ่ม preset "30d"
5. คลิกปุ่ม preset "7d"
**Expected**
ค่าเริ่มต้นว่าง (ช่องแสดง placeholder `—`) และ **ปุ่มลบถูก disable** ตั้งแต่ต้น (`disabled = !value || value <= 1`); ใต้ช่องมีคำอธิบาย "How long quotations stay valid" และแถวปุ่ม preset ขึ้นต้นด้วยคำว่า "Presets" ตามด้วยปุ่ม **7d / 14d / 30d / 60d / 90d** ห้าปุ่ม; กดบวกครั้งแรกได้ค่า 1 พร้อมป้ายหน่วย **"day"** (เอกพจน์) ครั้งที่สองได้ 2 พร้อมป้าย **"days"**; กดลบจนถึง 1 แล้วปุ่มลบ disable อีกครั้ง ค่าไม่ต่ำกว่า 1; กด "30d" แล้วช่องเป็น 30 และปุ่มนั้นถูกไฮไลต์เป็นปุ่มที่เลือกอยู่; กด "7d" แล้วไฮไลต์ย้ายไปปุ่ม 7d และช่องเป็น 7

---
## TC-PT-010058 — สร้างพร้อมคำอธิบายและคำสั่งถึงผู้ขาย แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ชื่อที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/vendor-management/price-list-template/new` แล้วกรอกชื่อที่ไม่ซ้ำ
2. กรอก Description เป็นข้อความสองบรรทัด
3. กรอกช่องในหมวด "Instructions to vendor" เป็นข้อความหลายบรรทัด
4. ตั้ง Validity period เป็น 30 ด้วยปุ่ม preset
5. กด Create แล้วรอ toast
6. เปิด template ที่สร้างจากหน้ารายการ แล้วโหลดหน้าซ้ำ
7. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Price List Template created successfully"; เปิดรายการนั้นในโหมดดูแล้ว ช่อง Description และ "Instructions to vendor" แสดงข้อความที่กรอกครบ **โดยขึ้นบรรทัดใหม่ตามที่พิมพ์** (`whitespace-pre-wrap`) และ Validity Period แสดงเป็น "30 days"; หลังโหลดหน้าซ้ำค่าทั้งสามยังครบเหมือนเดิม (persist จริง ไม่ใช่แค่ optimistic); คอลัมน์ Validity Period ในหน้ารายการของแถวนี้แสดง "30 days" เช่นกัน

---
## TC-PT-010059 — ช่อง Currency ถูกเติมด้วยสกุลเงินตั้งต้นของ BU ตั้งแต่เปิดฟอร์ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG ซึ่งตั้งค่า `config.default_currency_id` ไว้แล้ว และสกุลเงินนั้น `is_active`
**Steps**
1. เปิด `/vendor-management/price-list-template/new` โดยยังไม่แตะอะไร
2. อ่านค่าที่แสดงในช่อง Currency
3. เปิด dropdown ของ Currency แล้วอ่านรายการ
4. เลือกสกุลเงินอื่นแล้วปิด dropdown
**Expected**
ช่อง Currency **มีค่าอยู่แล้วตั้งแต่เปิดฟอร์ม** เป็นรหัสสกุลเงินตั้งต้นของ BU ไม่ใช่ข้อความ "Select Currency" (`getDefaultValues` เติม `currency_id` จาก profile); dropdown แสดง **เฉพาะสกุลเงินที่ `is_active`** โดยแสดงเป็นรหัส (เช่น THB) และ **ไม่มีตัวเลือกว่างสำหรับล้างค่า** — เมื่อเลือกแล้วจะเปลี่ยนได้เท่านั้น ล้างไม่ได้ (ดูหมายเหตุข้อ 8); เลือกสกุลเงินอื่นแล้วปุ่มแสดงรหัสใหม่และ dropdown ปิดลง

---
## TC-PT-020005 — โครงกล่อง Product Catalog — หัวข้อ ตัวนับ ช่องค้นหา และทรีสามชั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีสินค้าที่ผูกหมวดหมู่ / หมวดย่อย / กลุ่มสินค้าอย่างน้อย 1 สาย
**Steps**
1. เปิด `/vendor-management/price-list-template/new`
2. อ่านแถบหัวของกล่องฝั่งซ้าย
3. อ่านโครงสร้างของทรีในกล่อง
4. คลิกปุ่มลูกศรหน้าโหนดหมวดหมู่หนึ่งโหนด
**Expected**
กล่องฝั่งซ้ายมีหัวข้อ **"Product Catalog"** และป้ายตัวนับทางขวาในรูป `<เลือกแล้ว>/<ทั้งหมด>` โดยเริ่มที่ `0/<จำนวนสินค้าทั้ง BU>`; ใต้หัวมีช่องค้นหา placeholder **"Search by code or name..."** (ข้อความนี้ hard-code เป็นอังกฤษ ไม่ผ่าน i18n); ทรีมีสามชั้นคือ หมวดหมู่ → หมวดย่อย → กลุ่มสินค้า แล้วจึงเป็นสินค้า โดยโหนดที่ไม่ใช่สินค้าแต่ละตัวมี **checkbox + ไอคอน + ชื่อ + ป้ายจำนวนสินค้าใต้โหนด**; **ชั้นหมวดหมู่และหมวดย่อยกางไว้ตั้งแต่แรก ส่วนชั้นกลุ่มสินค้าหุบอยู่**; แถวสินค้ามีเฉพาะ checkbox กับชื่อในรูป `<code> — <name>` และ **ไม่มีปุ่มลูกศรกาง**; คลิกลูกศรแล้วโหนดนั้นหุบ/กางสลับกัน — **ปุ่มลูกศรไม่มี accessible name** จึงต้องเจาะด้วยตำแหน่งในแถว ไม่ใช่ `getByRole("button", { name: /expand/i })` (ดูหมายเหตุข้อ 5)

---
## TC-PT-020006 — ค้นหาในทรีสินค้า กางอัตโนมัติ และสถานะไม่พบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`; รู้รหัสหรือชื่อส่วนหนึ่งของสินค้าที่มีอยู่จริงใน BU
**Steps**
1. พิมพ์คำค้นที่ตรงกับสินค้าจริงลงในช่อง "Search by code or name..."
2. อ่านโครงทรีที่เหลือ
3. ล้างคำค้นแล้วพิมพ์คำที่ไม่มีทางตรงกับอะไร
4. ล้างคำค้นอีกครั้ง
**Expected**
ระหว่างพิมพ์ ทรีกรองทันทีแบบ client-side (ไม่ยิง backend) เหลือเฉพาะสายที่มีสินค้าตรงคำค้น และ **ทุกโหนดถูกกางออกหมดระหว่างมีคำค้น** (`forceExpand`) จึงเห็นสินค้าโดยไม่ต้องกดกางเอง; คำค้นเทียบกับข้อความ `<code> — <name>` แบบไม่สนตัวพิมพ์ใหญ่เล็ก; พิมพ์คำที่ไม่ตรงอะไรเลยแล้วกล่องแสดงข้อความ **"No products match your search."** โดยไม่มีโหนดใดเหลือ; ล้างคำค้นแล้วทรีกลับมาครบและกลับไปใช้สถานะกาง/หุบเดิม (หมวดหมู่กับหมวดย่อยกาง กลุ่มสินค้าหุบ); ตัวนับในแถบหัวไม่เปลี่ยนตามคำค้น (มันนับสิ่งที่เลือก ไม่ใช่สิ่งที่มองเห็น)

---
## TC-PT-020007 — ติ๊กโหนดกลุ่มเลือกสินค้าใต้กลุ่มทั้งหมด และสถานะกึ่งเลือก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`; มีกลุ่มสินค้าที่มีสินค้าใต้กลุ่มตั้งแต่ 2 รายการขึ้นไป และรู้จำนวนที่แน่นอนจากป้ายตัวเลขข้างชื่อกลุ่ม
**Steps**
1. กางลงไปจนเห็นกลุ่มสินค้าที่มีสินค้าหลายรายการ แล้วอ่านป้ายจำนวนข้างชื่อกลุ่ม
2. ติ๊ก checkbox ของโหนดกลุ่มนั้น
3. อ่านตัวนับในแถบหัว จำนวนการ์ดสินค้าฝั่งขวา และ checkbox ของโหนดแม่เหนือขึ้นไป
4. ถอดติ๊กสินค้าหนึ่งรายการใต้กลุ่มนั้น
5. ติ๊ก checkbox ของโหนดกลุ่มซ้ำอีกครั้ง
**Expected**
ติ๊กโหนดกลุ่มแล้ว **สินค้าใต้กลุ่มถูกเลือกครบทุกรายการในคลิกเดียว** ตัวนับในแถบหัวเพิ่มเท่ากับป้ายจำนวนของกลุ่มนั้น และฝั่งขวาเกิดการ์ดสินค้าจำนวนเท่ากัน (แต่ละการ์ดมีชื่อสินค้าและ MOQ tier หนึ่งแถว); checkbox ของโหนดแม่ (หมวดย่อย/หมวดหมู่) แสดงสถานะ **กึ่งเลือก (indeterminate)** ตราบใดที่ยังมีสินค้าในสายที่ไม่ถูกเลือก; ถอดติ๊กสินค้าหนึ่งรายการแล้ว checkbox ของกลุ่มเปลี่ยนจากเลือกครบเป็นกึ่งเลือก และการ์ดของสินค้านั้นหายไป; ติ๊กโหนดกลุ่มซ้ำตอนที่ยังไม่ครบ **จะเลือกเพิ่มให้ครบ ไม่ใช่ถอดทั้งหมด** (`toggleGroup` ถอดออกเฉพาะเมื่อครบอยู่แล้ว)
_(สำคัญสำหรับคนเขียนสเปก: อย่าติ๊กโหนดชั้นหมวดหมู่ในข้อมูลจริง — เคยวัดได้ว่าเลือกทีเดียว 450 รายการ ให้ใช้ช่องค้นหาบีบทรีก่อนเสมอ)_

---
## TC-PT-020008 — ถอดติ๊กสินค้าจากทรี แถวของสินค้านั้นหายจากฝั่งขวา
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` และติ๊กสินค้าไว้แล้ว 2 รายการจากคนละกลุ่ม โดยสินค้ารายการแรกถูกเพิ่ม MOQ tier ไว้ 2 แถว
**Steps**
1. อ่านจำนวนการ์ดสินค้าฝั่งขวาและตัวนับในแถบหัว
2. ถอดติ๊กสินค้ารายการแรก (ตัวที่มีสอง tier) ออกจากทรี
3. อ่านการ์ดที่เหลือและตัวนับ
**Expected**
ถอดติ๊กแล้วการ์ดของสินค้ารายการนั้นหายไปทั้งใบ **พร้อมกับ MOQ tier ทุกแถวของมัน** (ไม่เหลือแถวกำพร้า) — `handleTreeSelectionChange` เก็บ index ของทุกแถวที่ `product_id` หลุดจากชุดที่เลือก แล้วลบทีเดียว; ตัวนับในแถบหัวลดลง 1 และการ์ดของสินค้าอีกรายการยังอยู่ครบพร้อมค่าที่กรอกไว้; ตัวเลขข้างหัวข้อ "Products in this template" ลดลงเท่ากับจำนวน tier ที่ถูกลบ (ตัวเลขนี้นับ *แถว* ไม่ใช่ *สินค้า* — ดู `TC-PT-020014`); **การถอดติ๊กจากทรีไม่มีกล่องยืนยัน** ต่างจากปุ่มถังขยะบนการ์ด (`TC-PT-020011`)

---
## TC-PT-020009 — เพิ่ม MOQ tier ให้สินค้าเดิม และปุ่มลบ tier โผล่เมื่อมีเกินหนึ่งแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` และติ๊กสินค้าไว้ 1 รายการ
**Steps**
1. อ่านการ์ดของสินค้านั้น — หัวการ์ด แถวป้ายคอลัมน์ แถว tier และปุ่มท้ายการ์ด
2. ตั้ง MOQ ของ tier แรกเป็น 5
3. คลิกปุ่ม "Add tier" ท้ายการ์ด
4. อ่านค่า MOQ ของแถวใหม่และปุ่มท้ายแต่ละแถว
**Expected**
ตอนมี tier เดียว การ์ดมี หัวการ์ด (ชื่อสินค้า + ปุ่มถังขยะ aria-label "Remove product"), แถวป้ายคอลัมน์ **MOQ / Unit / Note**, แถวกรอกหนึ่งแถว และปุ่ม **"Add tier"** ท้ายการ์ด — **ยังไม่มีปุ่ม "Remove tier"** เพราะปุ่มนี้ render เฉพาะเมื่อสินค้ามีมากกว่าหนึ่ง tier (ดูหมายเหตุข้อ 5); กด "Add tier" แล้วเกิดแถวที่สอง **ต่อท้าย** (ไม่ใช่แทรกบนสุด) โดย MOQ ถูกตั้งเป็น **6** อัตโนมัติ (ค่าสูงสุดของ tier เดิม +1) และหน่วยถูกเลือกให้เองเป็นหน่วยแรกของสินค้านั้น; ตอนนี้ทั้งสองแถวมีปุ่ม **"Remove tier"** ปรากฏท้ายแถว และแถวป้ายคอลัมน์มีช่องว่างสำรองไว้ให้ปุ่มนั้น; ตัวเลขข้างหัวข้อหมวดเป็น 2

---
## TC-PT-020010 — ลบ MOQ tier ต้องยืนยันในกล่อง Remove MOQ Tier
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` มีสินค้า 1 รายการที่มี MOQ tier 2 แถว โดยกรอก MOQ ต่างกันพอให้แยกแถวออก
**Steps**
1. คลิกปุ่ม "Remove tier" ของแถวที่สอง
2. อ่านหัวข้อ คำอธิบาย และปุ่มในกล่องที่เด้งขึ้น
3. กด Cancel แล้วตรวจแถวที่เหลือ
4. คลิก "Remove tier" อีกครั้งแล้วกด Delete เพื่อยืนยัน
**Expected**
กล่องที่เด้งขึ้นเป็น alert dialog หัวข้อ **"Remove MOQ Tier"** คำอธิบาย "Are you sure you want to remove this MOQ tier?" และ footer มีปุ่ม **Cancel** กับ **Delete**; กด Cancel แล้วทั้งสองแถวยังอยู่ครบพร้อมค่าที่กรอกไว้ ตัวเลขข้างหัวข้อหมวดยังเป็น 2; ยืนยันแล้วเหลือแถวเดียว ตัวเลขข้างหัวข้อหมวดเป็น 1 **และปุ่ม "Remove tier" หายไปจากแถวที่เหลือ** (กลับไปเงื่อนไข tier เดียว) ส่วนการ์ดของสินค้ายังอยู่ ไม่หายไปด้วย

---
## TC-PT-020011 — ลบทั้งสินค้าต้องยืนยันในกล่องที่เอ่ยชื่อสินค้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` มีสินค้า 2 รายการ โดยรายการแรกมี MOQ tier 2 แถว และรู้ชื่อสินค้ารายการแรกแน่นอน
**Steps**
1. คลิกปุ่มถังขยะบนหัวการ์ดของสินค้ารายการแรก (aria-label "Remove product")
2. อ่านหัวข้อและคำอธิบายของกล่องที่เด้งขึ้น
3. กด Cancel
4. คลิกปุ่มถังขยะอีกครั้งแล้วกด Delete
5. ดู checkbox ของสินค้านั้นในทรีฝั่งซ้ายและตัวนับในแถบหัว
**Expected**
กล่องที่เด้งขึ้นมีหัวข้อ **`Remove Product "<ชื่อสินค้า>"`** ที่ระบุชื่อสินค้าจริง และคำอธิบาย "Removing this product will delete all of its MOQ tiers. Continue?" พร้อมปุ่ม Cancel / Delete; กด Cancel แล้วการ์ดยังอยู่ครบทั้งสอง tier; ยืนยันแล้วการ์ดทั้งใบหายพร้อม tier ทั้งสองแถว เหลือเฉพาะการ์ดของสินค้าอีกรายการ; **checkbox ของสินค้านั้นในทรีถูกถอดติ๊กตามไปด้วย และตัวนับในแถบหัวลดลง 1** (การ์ดกับทรีอ่าน state ชุดเดียวกัน)

---
## TC-PT-020012 — MOQ ที่ซ้ำกันในสินค้าเดียวถูกบวกขึ้นอัตโนมัติตอนออกจากช่อง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` มีสินค้า 1 รายการที่มี MOQ tier 3 แถว ค่า 1 / 2 / 3
**Steps**
1. แก้ MOQ ของแถวที่สามเป็น 1 แล้วคลิกที่อื่นเพื่อให้ช่องหลุดโฟกัส
2. อ่านค่าที่เหลืออยู่ในแถวที่สาม
3. แก้ MOQ ของแถวที่สองเป็น 1 แล้วหลุดโฟกัส
4. เพิ่มสินค้าอีกหนึ่งรายการแล้วตั้ง MOQ ของมันเป็น 1 แล้วหลุดโฟกัส
**Expected**
ค่าที่ซ้ำถูกไล่ขึ้นจนได้ค่าว่าง **เฉพาะตอน blur ไม่ใช่ทุกครั้งที่พิมพ์** — แถวที่สามที่พิมพ์ 1 กลายเป็น **4** (1, 2, 3 ถูกใช้แล้ว); แถวที่สองที่พิมพ์ 1 กลายเป็น **5** หลังจากนั้น (1, 2 ที่เหลือ และ 4 ถูกใช้แล้ว — ตัวเลขที่ได้ขึ้นกับสถานะจริงในตอนนั้น ให้ assert ว่า "ไม่มี MOQ ซ้ำกันภายในสินค้าเดียว" แทนการผูกกับเลขตายตัว); ค่า 0 หรือค่าว่างไม่ถูกไล่ขึ้น (`dedupeQty` คืนทันทีเมื่อ `q <= 0`); MOQ ของ **สินค้าอีกรายการ** ตั้งเป็น 1 ได้โดยไม่ถูกบวกขึ้น เพราะการตรวจซ้ำจำกัดอยู่ภายใน `product_id` เดียวกันเท่านั้น

---
## TC-PT-020013 — ช่องหน่วยของแต่ละแถวมีเฉพาะหน่วยของสินค้านั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`; รู้สินค้าสองรายการที่ตั้งหน่วยไว้คนละชุด (เช่น รายการหนึ่งมี Kg/Box อีกรายการมี Bottle/Case)
**Steps**
1. ติ๊กสินค้ารายการแรกจากทรี
2. อ่านค่าที่ถูกเลือกไว้ในช่อง Unit ของแถวนั้น
3. เปิด dropdown ของ Unit แล้วอ่านรายการ
4. ติ๊กสินค้ารายการที่สอง แล้วเปิด dropdown ของ Unit ในการ์ดของมัน
**Expected**
ช่อง Unit **ถูกเลือกให้เองทันทีเป็นหน่วยแรกของสินค้านั้น** ไม่เคยว่าง (ดูหมายเหตุข้อ 9); dropdown ของแถวแรกแสดงเฉพาะหน่วยที่สินค้ารายการแรกรองรับ; dropdown ของแถวที่สองแสดงเฉพาะหน่วยของสินค้ารายการที่สอง **ไม่ปนกัน** (`LookupProductUnit` cascade จาก `details.<i>.product_id`); ระหว่างที่รายการหน่วยยังโหลด ปุ่มจะถูก disable และแสดงตัวหมุน

---
## TC-PT-020014 — ตัวนับข้างหัวข้อหมวดสินค้าตรงกับจำนวนแถวจริง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` โดยยังไม่เลือกสินค้าใด
**Steps**
1. อ่านตัวเลขข้างหัวข้อ "Products in this template"
2. ติ๊กสินค้า 2 รายการจากทรี แล้วอ่านตัวเลขซ้ำ
3. กด "Add tier" บนการ์ดของสินค้ารายการแรก แล้วอ่านตัวเลขซ้ำ
4. ลบทั้งสินค้ารายการแรกแล้วอ่านตัวเลขซ้ำ
**Expected**
เริ่มต้นเป็น **0** พร้อมกรอบประ "No products yet"; ติ๊กสองรายการแล้วเป็น **2**; เพิ่ม tier แล้วเป็น **3** — **ตัวเลขนี้นับจำนวน MOQ tier ไม่ใช่จำนวนสินค้า** (`count={detailFields.length}` ใน `plt-item-fields.tsx:137`) ขณะที่ป้ายตัวนับในแถบหัวของกล่อง Product Catalog นับ *สินค้า* ⇒ สองตัวเลขนี้ **ไม่เท่ากันเมื่อมีสินค้าที่มีหลาย tier** ซึ่งถูกต้องตามออกแบบ; ลบสินค้ารายการแรก (2 tier) แล้วตัวเลขข้างหัวข้อเหลือ **1** ส่วนตัวนับในกล่องเหลือ 1 เช่นกัน

---
## TC-PT-030006 — แถบปุ่มต่างกันระหว่างโหมดดูกับโหมดแก้ไข
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template อย่างน้อย 1 รายการและเปิดหน้ารายละเอียดของมันได้
**Steps**
1. เปิด template จากคอลัมน์ Name ในหน้ารายการ
2. อ่านปุ่มทั้งหมดในแถบหัว
3. กด Edit
4. อ่านปุ่มทั้งหมดอีกครั้ง
**Expected**
โหมดดูมีปุ่ม **Edit / Delete / Activity** และปุ่ม Go back — ไม่มี Cancel และไม่มี Save; กด Edit แล้วแถบปุ่มเปลี่ยนเป็น **Cancel / Save / Delete / Activity** โดย **ปุ่ม Edit หายไปและปุ่ม Save โผล่แทน** — ปุ่ม Delete และ Activity **อยู่ครบทั้งสองโหมด** (ทั้งคู่อยู่นอก ternary ของโหมด `plt-form.tsx:166-192`); ปุ่ม Save เป็น `type="submit"` ที่ผูกกับฟอร์มด้วย `form="plt-form"` จึงอยู่นอก `<form>` แต่ยังสั่ง submit ได้; URL ไม่เปลี่ยนตอนสลับโหมด (โหมดเป็น state ในหน้า ไม่ใช่ route)

---
## TC-PT-030007 — แก้สกุลเงิน อายุใบเสนอราคา คำอธิบาย และคำสั่งถึงผู้ขาย แล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ และ BU มีสกุลเงินที่ `is_active` อย่างน้อย 2 สกุล
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. เปลี่ยน Currency เป็นอีกสกุลหนึ่ง
3. เปลี่ยน Validity period ด้วยปุ่ม preset เป็น 60
4. แก้ Description และช่องในหมวด "Instructions to vendor"
5. กด Save แล้วรอ toast
6. โหลดหน้าซ้ำแล้วอ่านค่าทั้งสี่
7. กลับหน้ารายการแล้วดูแถวของ template นี้
8. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast **"Price List Template updated successfully"** และหน้ากลับเข้า **โหมดดู** เอง (`onSuccess` เรียก `form.reset(values)` แล้ว `setMode("view")`) โดยไม่ต้องกดอะไรเพิ่ม; หลังโหลดหน้าซ้ำ ค่าทั้งสี่ยังเป็นค่าใหม่ครบ (persist จริง ไม่ใช่แค่ state ในหน้า); ในหน้ารายการ คอลัมน์ Currency แสดงรหัสสกุลใหม่ และคอลัมน์ Validity Period แสดง "60 days"

---
## TC-PT-030008 — ยกเลิกการแก้ไขที่ dirty ต้องคืนค่าและกลับโหมดดู ไม่ใช่กลับรายการ
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้และรู้ชื่อ/คำอธิบายเดิมแน่นอน
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. แก้ชื่อและคำอธิบายเป็นค่าทิ้ง
3. กด Cancel แล้วอ่าน dialog ที่เด้งขึ้น
4. กด "Keep editing" แล้วตรวจค่าที่กรอกไว้
5. กด Cancel อีกครั้งแล้วกด "Discard"
6. โหลดหน้าซ้ำแล้วอ่านค่า
**Expected**
เด้ง Discard dialog ใบเดียวกับฟอร์มสร้าง; กด "Keep editing" แล้วยังอยู่ในโหมดแก้ไขพร้อมค่าทิ้งที่กรอกไว้; กด "Discard" แล้ว **กลับเข้าโหมดดูของ template เดิม ไม่ใช่เด้งกลับหน้ารายการ** (ในโหมดแก้ไข `handleCancel` เรียก `form.reset(defaultValues)` + `setMode("view")` — ต่างจากโหมดสร้างที่ navigate ออก) และค่าบนหน้าจอกลับเป็นชื่อ/คำอธิบายเดิมทันที; URL ยังเป็น `/vendor-management/price-list-template/<uuid>` ตลอด; หลังโหลดหน้าซ้ำค่ายังเป็นของเดิม (ไม่มีอะไรถูกบันทึก)
_(เคสนี้ต่างจาก `TC-PT-040051` ในสเปก ซึ่งตรวจแค่ว่าชื่อเดิมยัง "ค้นเจอในหน้ารายการ" — ไม่ได้ตรวจปลายทางของปุ่ม Cancel และไม่ได้ตรวจว่าค่าบนหน้าจอถูกคืน)_

---
## TC-PT-030009 — เพิ่มสินค้าในโหมดแก้ไขแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยมีสินค้าอยู่แล้ว 1 รายการ และรู้ชื่อสินค้าอีกรายการที่ยังไม่อยู่ใน template
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. ค้นหาสินค้ารายการใหม่ในทรีแล้วติ๊กเลือก
3. ตั้ง MOQ ของแถวใหม่เป็น 10 และกรอก Note
4. กด Save แล้วรอ toast
5. โหลดหน้าซ้ำแล้วอ่านตารางสินค้าในโหมดดู
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Price List Template updated successfully" และกลับเข้าโหมดดู; ตารางสินค้าในโหมดดูมี **สองสินค้า** โดยสินค้าใหม่แสดง MOQ 10 หน่วยที่เลือก และ Note ที่กรอก; หลังโหลดหน้าซ้ำยังครบเหมือนเดิม; **สินค้าเดิมต้องไม่หายและต้องไม่ซ้ำ** — ตอนแก้ไข payload ถูกส่งเป็น full replace (`remove` ของเดิมทั้งหมด + `add` ชุดปัจจุบัน) เมื่อ `dirtyFields.details` เป็นจริง ดังนั้นจำนวนแถวหลังบันทึกต้องเท่ากับจำนวนที่เห็นบนฟอร์มพอดี

---
## TC-PT-030010 — ลบสินค้าในโหมดแก้ไขแล้วหายจริงหลังโหลดใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดยมีสินค้า 2 รายการ และรู้ชื่อทั้งสอง
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. คลิกปุ่มถังขยะบนการ์ดของสินค้ารายการแรก แล้วยืนยันในกล่อง
3. กด Save แล้วรอ toast
4. โหลดหน้าซ้ำแล้วอ่านตารางสินค้า
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Price List Template updated successfully"; ตารางสินค้าในโหมดดูเหลือสินค้ารายการที่สองรายการเดียว และ **สินค้ารายการแรกไม่กลับมาหลังโหลดหน้าซ้ำ**; ถ้าลบสินค้าออกจนไม่เหลือเลยแล้วกด Save ระบบ **ยอมบันทึก** โดยไม่มี validation error (ดูหมายเหตุข้อ 10) — เคสนี้จึงลบเพียงหนึ่งรายการ ไม่ลบจนหมด

---
## TC-PT-030011 — แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดสินค้าซ้ำ
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดยมีสินค้า 1 รายการ
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. เพิ่มสินค้าอีก 1 รายการจากทรี แล้วกด Save และรอให้กลับโหมดดู
3. กด Edit อีกครั้ง **โดยไม่ออกจากหน้าและไม่โหลดหน้าใหม่**
4. เพิ่มสินค้ารายการที่สาม แล้วกด Save
5. โหลดหน้าซ้ำแล้วนับแถวในตารางสินค้า
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หลังบันทึกรอบแรกตารางมี 2 สินค้า หลังรอบสองมี **3 สินค้าพอดี ไม่ใช่ 5** และไม่มีสินค้าใดปรากฏซ้ำสองแถว; หลังโหลดหน้าซ้ำยังเป็น 3 เท่าเดิม
_(เหตุที่ต้องมีเคสนี้: การบันทึกครั้งที่สองส่ง `remove` โดยอ้าง `id` ของ product ที่อ่านจาก `priceListTemplate.products` ถ้า form ไม่ re-sync กับ response ใหม่หลังบันทึกครั้งแรก มันจะอ้าง id ที่ถูกลบไปแล้ว แล้ว `add` ทับเข้าไปกลายเป็นของซ้ำ — `plt-form.tsx:82-90` มี `useEffect` ที่ reset ฟอร์มโดย key ด้วยชุด product id เพื่อกันเรื่องนี้ไว้ เคสนี้คือตัวเฝ้าว่ากลไกนั้นยังทำงาน)_

---
## TC-PT-030012 — บันทึกโดยไม่แตะรายการสินค้า สินค้าเดิมต้องครบเท่าเดิม
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดยมีสินค้า 2 รายการ รายการหนึ่งมี MOQ tier 2 แถว
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. แก้ **เฉพาะ Description** อย่างเดียว โดยไม่แตะทรีสินค้าและไม่แตะช่อง MOQ/Unit/Note ใด ๆ
3. กด Save แล้วรอ toast
4. โหลดหน้าซ้ำแล้วนับสินค้าและ MOQ tier ในตาราง
**Expected**
แสดง toast "Price List Template updated successfully"; หลังโหลดหน้าซ้ำ **สินค้าทั้ง 2 รายการและ MOQ tier ทั้ง 3 แถวยังครบเท่าเดิม** ไม่หาย ไม่ซ้ำ (เมื่อ `dirtyFields.details` เป็นเท็จ `onSubmit` ส่ง `products: {}` ⇒ backend ไม่แตะรายการสินค้าเลย) และ Description เป็นค่าใหม่

---
## TC-PT-030013 — กดปุ่ม Back ของเบราว์เซอร์ขณะแก้ไข dirty ต้องถูกดัก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; เข้าหน้ารายละเอียดของ template ผ่านหน้ารายการ (มี history ให้ถอย) แล้วกด Edit และแก้ชื่อไว้
**Steps**
1. กดปุ่ม Back ของเบราว์เซอร์
2. อ่าน dialog ที่เด้งขึ้นแล้วกด "Keep editing"
3. ตรวจ URL และค่าที่กรอกไว้
4. กด Back อีกครั้งแล้วกด "Discard"
**Expected**
กด Back แล้ว **ยังไม่ออกจากหน้า** แต่เด้ง Discard dialog ก่อน (`useNavigationGuard` ดักทั้ง in-app link และ popstate); กด "Keep editing" แล้ว URL ยังเป็น `/vendor-management/price-list-template/<uuid>` และค่าที่แก้ไว้ยังอยู่; กด "Discard" แล้วจึงถอยกลับไปหน้ารายการจริง และค่าที่แก้ไว้ไม่ถูกบันทึก

---
## TC-PT-040005 — โหมดดูแสดงทุกค่าเป็นข้อความและแก้ไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยกรอกครบทุกช่อง (ชื่อ, currency, validity 30, description, vendor instruction) และมีสินค้า 1 รายการ
**Steps**
1. เปิด template นั้นจากหน้ารายการ
2. ไล่อ่านทุกช่องในหมวด General และหมวด Instructions to vendor
3. นับจำนวน `<input>` / `<textarea>` / dropdown ในเนื้อหน้า
**Expected**
หัวเรื่องเป็นชื่อ template แบบ **ไม่เอียง** พร้อมป้ายสถานะข้างหัวเรื่อง; ทุกช่องแสดงเป็นข้อความอ่านอย่างเดียว — Name, Currency (แสดงเป็นรหัส), Validity Period (แสดง "30 days"), Description และ Instructions to vendor แสดงเป็นข้อความที่ **ขึ้นบรรทัดใหม่ตามที่พิมพ์** ส่วน Status แสดงเป็นป้ายไอคอน+ข้อความตัวพิมพ์ใหญ่; **label ของ Name และ Currency ไม่มีเครื่องหมาย `*` ในโหมดนี้** (asterisk render เฉพาะเมื่อไม่ใช่โหมดดู — เป็นเหตุผลที่ oracle แบบ `anyError()` ใช้ไม่ได้ ดูหมายเหตุข้อ 3); **ไม่มี `<input>`, `<textarea>` หรือปุ่ม dropdown ของฟอร์มในเนื้อหน้าเลย** และกล่อง Product Catalog ฝั่งซ้ายไม่ถูก render (มีเฉพาะโหมด add/edit)

---
## TC-PT-040006 — ตารางสินค้าในโหมดดู — จัดกลุ่มตามสินค้าและชี้หน่วยสั่งซื้อ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดยมีสินค้า 2 รายการ รายการแรกมี MOQ tier 2 แถวที่ค่า 5 และ 2 (กรอกสลับลำดับโดยตั้งใจ) รายการที่สองมี tier เดียวที่ใช้หน่วยสั่งซื้อของสินค้านั้น
**Steps**
1. เปิด template นั้นในโหมดดู
2. อ่านหัวตารางในหมวด "Products in this template"
3. อ่านแถวของสินค้ารายการแรก
4. อ่านแถวของสินค้ารายการที่สอง
**Expected**
ตารางมีหัวคอลัมน์ห้าช่องตามลำดับ **# / Product / MOQ / Unit / Note**; สินค้ารายการแรกใช้ **หนึ่งเลขลำดับและหนึ่งชื่อสินค้าที่กินความสูงสองแถว** (`rowSpan`) โดยมีสอง tier อยู่ข้างใน และ **tier ถูกเรียงจาก MOQ น้อยไปมาก (2 แล้วจึง 5) ไม่ใช่ตามลำดับที่กรอก**; ช่อง Product แสดงชื่อสินค้าเป็นบรรทัดหลักและ local name หรือ code เป็นบรรทัดรอง; แถวที่ใช้หน่วยเดียวกับหน่วยสั่งซื้อของสินค้ามีข้อความ **"· Order Unit"** ต่อท้ายชื่อหน่วย ส่วนแถวที่ไม่ใช่ไม่มี; ช่องที่ไม่มีค่าแสดงขีด `—` (MOQ ที่เป็น 0 แสดงเป็นขีดและเป็นตัวเอียงสีจาง)

---
## TC-PT-040007 — deep link เข้าหน้ารายละเอียดโดยตรงได้โหมดดู
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; รู้ `uuid` ของ template ที่มีอยู่จริงใน BU นี้
**Steps**
1. เปิด URL `/vendor-management/price-list-template/<uuid>` ตรง ๆ โดยไม่ผ่านหน้ารายการ
2. รอให้ skeleton หายแล้วอ่านหน้า
3. กดปุ่ม Go back
**Expected**
ระหว่างโหลดแสดง form skeleton แล้วจึงแสดงหน้ารายละเอียดใน **โหมดดู** (มีปุ่ม Edit ไม่ใช่ Save) พร้อมข้อมูลครบ; RouteGuard ปล่อยผ่านเพราะ `findRouteLeaf()` จับ `/:id` เป็น leaf เดียวกับหน้ารายการ (ดูหมายเหตุข้อ 15); กดปุ่ม Go back แล้วไปหน้า `/vendor-management/price-list-template` ได้แม้ไม่มี history ให้ถอย

---
## TC-PT-040008 — deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดงข้อความไม่พบรายการ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. เปิด URL `/vendor-management/price-list-template/00000000-0000-0000-0000-000000000000`
2. รอให้ skeleton หายแล้วอ่านหน้า
3. กดปุ่มที่ให้กลับหน้ารายการ
**Expected**
แสดงกล่องสถานะข้อผิดพลาด (`role="alert"`) ที่มีข้อความ **"Price list template not found"** พร้อมปุ่มกลับไปหน้า `/vendor-management/price-list-template` — **ไม่ใช่ฟอร์มเปล่าและไม่ใช่หน้าขาว**; ไม่มีแถบปุ่ม Edit / Delete / Activity บนหน้านี้; กดปุ่มกลับแล้วไปหน้ารายการได้

---
## TC-PT-040009 — เปิดแผงประวัติกิจกรรมได้ทั้งโหมดดูและโหมดแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่ถูกแก้ไขมาแล้วอย่างน้อยหนึ่งครั้ง และรู้ชื่อของมัน
**Steps**
1. เปิด template นั้นในโหมดดู แล้วคลิกปุ่ม Activity
2. อ่านหัวข้อและเนื้อหาของแผงที่เปิดออกมา
3. ปิดแผง แล้วกด Edit
4. คลิกปุ่ม Activity อีกครั้งในโหมดแก้ไข
**Expected**
เปิด sheet ประวัติกิจกรรมหัวข้อ **"Activity"** ที่อ้างถึง **ชื่อ template** (ไม่ใช่ id — `openActivity(priceListTemplate.id, priceListTemplate.name)`); ปิด sheet แล้วกลับมาหน้าเดิมโดย URL และโหมดไม่เปลี่ยน; **ปุ่ม Activity ยังอยู่และยังกดได้ในโหมดแก้ไข** (ปุ่มนี้อยู่นอก ternary ของโหมดเพราะเป็นการดู ไม่ใช่การแก้) และการเปิดแผงไม่ทำให้ค่าที่กำลังแก้อยู่หาย

---
## TC-PT-040010 — ลบจากหน้ารายละเอียดแล้วเด้งกลับหน้ารายการ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิด template นั้นในโหมดดู
2. คลิกปุ่ม Delete ในแถบหัว
3. อ่านหัวข้อ คำอธิบาย และปุ่มในกล่องที่เด้งขึ้น แล้วกด Cancel
4. คลิก Delete อีกครั้งแล้วกด Delete เพื่อยืนยัน
5. ค้นหาชื่อนั้นในหน้ารายการ
**Expected**
กล่องยืนยันมีหัวข้อ **"Delete Price List Template"** และคำอธิบาย **`Are you sure you want to delete template "<ชื่อ>"? This action cannot be undone.`** ที่เอ่ยชื่อจริง พร้อมปุ่ม Cancel / Delete; กด Cancel แล้วยังอยู่หน้าเดิมและ template ยังอยู่; ยืนยันแล้วแสดง toast **"Price List Template deleted successfully"** และ **เด้งกลับไปหน้า `/vendor-management/price-list-template` เอง**; ค้นหาชื่อนั้นแล้วไม่พบ
_(เคสนี้เป็นคนละทางกับ `TC-PT-050050` / `TC-PT-050051` ในสเปก ซึ่งลบผ่านเมนู row actions ในหน้ารายการ — ปุ่มลบบนฟอร์มมี `DeleteDialog` คนละใบ และมี navigate ตามหลัง)_

---
## TC-PT-040011 — หน้ารายละเอียดที่ยังไม่มีสินค้าแสดงกล่องว่างพร้อมปุ่มเพิ่ม
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดย **ไม่มีสินค้าเลย** (สร้างได้ ดูหมายเหตุข้อ 10)
**Steps**
1. เปิด template นั้นในโหมดดู
2. อ่านหมวด "Products in this template"
**Expected**
ตัวเลขข้างหัวข้อหมวดเป็น **0**; ในหมวดแสดงกล่องกรอบประที่มีไอคอนป้ายราคา หัวข้อ **"No products yet"** คำอธิบาย "Add products that any vendor receiving this template will be asked to price. MOQ tiers can vary per unit." และปุ่ม **"Add Item"**; **ไม่มีตารางสินค้าและไม่มีกล่อง Product Catalog** ในโหมดนี้
_(อย่า assert ผลของการกดปุ่ม "Add Item" — ปัจจุบันมันไม่ได้พาเข้าโหมดแก้ไข ดูหมายเหตุข้อ 17 ถ้าทีมแก้แล้วค่อยเพิ่ม assertion)_

---
## TC-PT-050006 — สถานะตั้งต้นของรายการใหม่คือ Draft และไหลไปถึงคอลัมน์ในรายการ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ชื่อที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/vendor-management/price-list-template/new` แล้วอ่านค่าในช่อง Status และป้ายข้างหัวเรื่อง **โดยไม่แตะ dropdown**
2. กรอกชื่อแล้วกด Create
3. ค้นหารายการที่สร้างในหน้ารายการแล้วอ่านคอลัมน์ Status
4. เปิดรายการนั้นแล้วอ่านช่อง Status ในโหมดดู
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ช่อง Status บนฟอร์มสร้างมีค่า **Draft** อยู่แล้วตั้งแต่ต้น (ไม่ใช่ placeholder "Select status") และป้ายข้างหัวเรื่องแสดง **DRAFT**; หลังสร้าง คอลัมน์ Status ของแถวนั้นในหน้ารายการแสดงไอคอน + คำว่า **DRAFT** ตัวพิมพ์ใหญ่จัดกึ่งกลาง; หน้ารายละเอียดในโหมดดูแสดงป้ายเดียวกัน — **ไม่ใช่ dropdown** (ตัวเลือกสถานะ render เฉพาะโหมด add/edit)

---
## TC-PT-050007 — เปลี่ยนสถานะในโหมดแก้ไขแล้วสะท้อนทุกที่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยสถานะเป็น Draft
**Steps**
1. เปิด template นั้นแล้วกด Edit
2. เปลี่ยน Status เป็น "Active" แล้วสังเกตป้ายข้างหัวเรื่อง **ก่อนกด Save**
3. กด Save แล้วรอ toast
4. กลับหน้ารายการแล้วตั้งตัวกรอง Status = Active
5. เปิดรายการนั้นอีกครั้งแล้วกด Edit เปลี่ยนเป็น "Inactive" แล้ว Save
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ป้ายข้างหัวเรื่องเปลี่ยนเป็น **ACTIVE ทันทีที่เลือก ก่อนจะกด Save** (มันผูกกับ `useWatch` ของ `status` ไม่ใช่กับข้อมูลที่บันทึกแล้ว) — นี่คือสถานะบนฟอร์ม ไม่ใช่สถานะที่ persist แล้ว; หลัง Save แสดง toast "Price List Template updated successfully" และกลับเข้าโหมดดู; ในหน้ารายการ คอลัมน์ Status ของแถวนั้นเป็น **ACTIVE** และ **ตัวกรอง Status = Active ค้นเจอรายการนี้**; เปลี่ยนเป็น Inactive แล้ว Save อีกครั้ง คอลัมน์และตัวกรองเปลี่ยนตามเช่นกัน

---
## TC-PT-050008 — ลบจากปุ่มบนการ์ดในมุมมองกริด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. ไปที่หน้ารายการแล้วคลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. หาการ์ดของ template นั้น แล้วคลิกปุ่มลบบนการ์ด
3. อ่านกล่องที่เด้งขึ้นแล้วกด Cancel
4. คลิกปุ่มลบอีกครั้งแล้วยืนยัน
5. สลับกลับเป็นมุมมองตารางแล้วค้นหาชื่อนั้น
**Expected**
กล่องยืนยันเป็นใบเดียวกับที่ลบจากตาราง (หัวข้อ "Delete Price List Template" + คำอธิบายที่เอ่ยชื่อ); กด Cancel แล้วการ์ดยังอยู่; ยืนยันแล้วแสดง toast "Price List Template deleted successfully" การ์ดหายจากกริด **โดยไม่ต้องโหลดหน้าใหม่**; สลับกลับเป็นตารางแล้วค้นหาชื่อนั้นไม่พบ; **การคลิกเนื้อการ์ด (ไม่ใช่ปุ่มลบ) ต้องพาไปหน้ารายละเอียด ไม่ใช่เปิดกล่องลบ**

---
## TC-PT-060006 — หน้ารายการแสดงหัวเรื่อง จำนวน ปุ่มหัวหน้า และคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มี template อย่างน้อย 1 รายการใน BU; ใช้หน้าจอขนาด desktop
**Steps**
1. ไปที่ `/vendor-management/price-list-template`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. อ่านแถบหัว แถบเครื่องมือ และหัวตาราง
**Expected**
แถบหัวแสดงไอคอนโมดูล ชื่อ **"Price List Template"** และ badge จำนวนรายการรวม พร้อมคำอธิบายใต้ชื่อ "The item lists you hand vendors when you ask them to quote."; ฝั่งขวามีปุ่ม **Export**, **Print** และ **"Add Price List Template"** (ไม่ใช่ "Add Template" — ดูหมายเหตุข้อ 5); ตารางมีคอลัมน์ตามลำดับ **ช่องเลือก (checkbox), ลำดับที่ (#), Name, Currency, Validity Period, Status** และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ **Created / Updated ถูกซ่อนไว้ตั้งแต่ต้น** (`initialState.columnVisibility` ใน `use-plt-table.tsx:140-142`); คอลัมน์ Currency และ Status จัดกึ่งกลาง, Validity Period แสดงเป็น "{n} days" หรือขีด `—` เมื่อไม่มีค่า, Name ที่ว่างแสดงจุดไข่ปลา `...`; แถบเครื่องมือมีช่องค้นหา (placeholder "Search..."), ปุ่ม saved view (ป้าย "No view"), ปุ่ม Filter, ปุ่มเรียงลำดับ (aria-label "Sort by"), ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และปุ่มสลับมุมมอง list/grid

---
## TC-PT-060007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template`; มี template หลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับ template ที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
4. กดปุ่มแว่นขยายท้ายช่องขณะช่องว่าง
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มท้ายช่อง); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต; ขณะช่องว่างปุ่มท้ายช่องเป็นแว่นขยาย (aria-label "Search") และกดแล้วยิงค้นด้วยคำว่าง (ตารางกลับมาครบ)
_(เคสนี้ไม่ทับ `TC-PT-060002` ในสเปก ซึ่งตรวจเฉพาะ empty message เมื่อค้นคำที่ไม่มี)_

---
## TC-PT-060008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label **"Clear search"**) แทนไอคอนแว่นขยาย; คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมด **โดยไม่ต้องกด Enter ซ้ำ**

---
## TC-PT-060009 — กรองตามสถานะแบบเลือกหลายค่า และล้างเมื่อเลือกครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` บนหน้าจอขนาด desktop; BU มี template ครบทั้งสามสถานะ (draft / active / inactive) อย่างน้อยสถานะละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ แล้วอ่านรายการแถวในเมนู
2. ชี้/คลิกแถว "Status" แล้วอ่านตัวเลือกในกล่องที่กางออกด้านข้าง
3. เลือก "Draft" แล้วสังเกตตาราง ปุ่ม Filter แถบ chip และ query string
4. เลือก "Active" เพิ่มโดยไม่ปิดเมนู
5. เลือก "Inactive" เพิ่มเป็นตัวที่สาม
6. เลือก "Draft" ตัวเดียวอีกครั้ง แล้วคลิกปุ่มกากบาทบน chip
**Expected**
เมนู Filter บน desktop เป็น popover สองชั้น มีแถว "Status", แถว "Clear" และแถว "Save current filters as view" — **แถวของ field เป็น `<button>` ธรรมดา ไม่ใช่ `role="menuitem"`**; กล่องด้านข้างของ Status เป็นรายการที่ **render เป็น `role="option"`** (เป็น `CommandItem` ของ `MultiSelectFilter` — ดูหมายเหตุข้อ 19) มีแถว **"All"** อยู่บนสุดพร้อม checkbox ตามด้วย **Draft / Active / Inactive** แต่ละตัวมี checkbox และไอคอนสถานะ; เลือก Draft แล้วตารางเหลือเฉพาะแถวสถานะ DRAFT, ปุ่ม Filter มี badge เลข 1, แถบ chip ใต้แถบเครื่องมือแสดง chip "Draft" พร้อมปุ่มลบ (aria-label "Remove Status filter"), query string มี `filter=status|string:draft` (encode แล้ว) และ `page` ถูกล้าง; เลือก Active เพิ่มแล้วค่าใน URL ต่อกันด้วยจุลภาค (`status|string:draft,status|string:active`) และ chip แสดงเป็น **"Draft +1"**; **เลือกครบทั้งสามค่าแล้วตัวกรองถูกล้างเอง** — `filter` หลุดจาก URL, chip หายไป, badge บนปุ่ม Filter หาย และตารางกลับมาครบ (ดูหมายเหตุข้อ 18); คลิกกากบาทบน chip ล้างตัวกรองได้เช่นกัน

---
## TC-PT-060010 — เมนูเรียงลำดับในแถบเครื่องมือ — ไม่มีค่าเริ่มต้น สลับทิศ กลับ Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/vendor-management/price-list-template` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มี template อย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกต URL ตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วอ่านรายชื่อในเมนู
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้ **ไม่มี default sort** (`plt-component.tsx:55` เรียก `useDataGridState()` โดยไม่ส่ง `defaultSort`) — เข้าครั้งแรก URL ไม่มี `sort` และแถว "Default" มีไอคอนกำกับอยู่; เมนูมีหัวข้อ "Sort by" และมี **6 แถวคือ Name, Currency, Validity Period, Status, Created, Updated** (ทุกคอลัมน์ที่มี accessor และ sort ได้ — ช่องเลือก/ลำดับที่/ปุ่มจัดการไม่อยู่ในเมนู) โดยแสดงเป็นชื่อที่อ่านออกเพราะทุกคอลัมน์ตั้ง `meta.headerTitle` ไว้; เลือก Name ครั้งแรกได้ `sort=name:asc` พร้อมลูกศรขึ้นบนแถวนั้นและลำดับแถวเปลี่ยนตาม, เลือกซ้ำได้ `sort=name:desc` พร้อมลูกศรลง; **เมนูเปิดค้างระหว่างสลับทิศ**; เลือก Default ล้าง `sort` และ `page` ออกจาก URL
_(เคสนี้เป็นคนละทางกับ `TC-PT-060005` ในสเปกที่คลิกหัวคอลัมน์ — เมนูนี้เป็นทางเดียวที่ใช้ได้ในมุมมองการ์ดและบนมือถือ ซึ่งไม่มีหัวคอลัมน์ให้กด)_

---
## TC-PT-060011 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Currency
**Expected**
เมนูมีหัวข้อ **"Toggle Columns"** (hard-code เป็นอังกฤษ ไม่ผ่าน i18n) และรายการ **6 รายการคือ Name, Currency, Validity Period, Status, Created, Updated** พร้อม checkbox (ช่องเลือก/ลำดับที่/ปุ่มจัดการไม่อยู่ในเมนูเพราะไม่มี `accessorFn`); **Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น**; เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลาและชื่อผู้ทำรายการ; ปิด Currency แล้วคอลัมน์นั้นหายจากตาราง และ **เมนูยังเปิดค้างให้ติ๊กต่อได้** พร้อมเครื่องหมายถูกที่อัปเดตตามจริง

---
## TC-PT-060012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` บนหน้าจอขนาด desktop; มี template อย่างน้อย 1 รายการที่กรอก description, currency และ validity period ครบ
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดของ template รายการนั้นและท้ายรายการ
3. คลิกที่เนื้อการ์ด (ไม่ใช่ปุ่มลบที่ footer)
4. กลับหน้ารายการแล้วคลิกปุ่มมุมมองตาราง (aria-label "List view")
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดง **ชื่อ template เป็นหัวเรื่อง** (หรือ `...` เมื่อชื่อว่าง) และป้ายสถานะตัวพิมพ์ใหญ่ ส่วนเนื้อการ์ดมีแถว **Description, Currency, Validity Period** ตามลำดับ โดยแต่ละแถว **แสดงเฉพาะเมื่อมีค่า** และท้ายการ์ดเป็นแถว Created / Updated พร้อมปุ่มลบ; ในมุมมองการ์ด **ไม่มีแถบ pagination** (โหลดเพิ่มแบบ infinite scroll ผ่าน sentinel ของ `useGridPagination`) และเมื่อไม่มีข้อมูลจะแสดงกล่อง "No data found" แทน; คลิกเนื้อการ์ดแล้ว navigate ไปหน้ารายละเอียด `/vendor-management/price-list-template/<uuid>`; กลับมาแล้วสลับเป็นตารางได้ข้อมูลครบเหมือนเดิม

---
## TC-PT-060013 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` ในมุมมองตาราง; BU มี template มากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ **10** และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม, **คอลัมน์ลำดับที่ (#) เริ่มนับต่อเนื่องจากหน้าก่อน (6, 7, … ไม่รีเซ็ตเป็น 1)** — `indexColumn(params)` บวก offset จาก `page`/`perpage` ให้ — และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-PT-060014 — ส่งออกรายการเป็นไฟล์ XLSX ห้าคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` บน desktop; มี template อย่างน้อย 1 รายการในหน้าปัจจุบัน และอย่างน้อย 1 รายการกรอก description กับ validity period ไว้
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
3. เปิดไฟล์ที่ดาวน์โหลดมา
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX (ชื่อขึ้นต้นด้วย `price-list-template`, sheet ชื่อ **"Price List Templates"**) ที่มี **5 คอลัมน์ตามลำดับ Name / Currency / Validity Period / Status / Description**; ช่อง Currency เป็นรหัสสกุลเงิน (ว่างเมื่อไม่มี), ช่อง Validity Period เป็นข้อความ "{n} days" (ว่างเมื่อเป็น null ไม่ใช่เลข 0), ช่อง Status เป็นคำว่า Draft / Active / Inactive **ไม่ใช่ค่าดิบ**; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น (ยิงด้วย `queryParams` ซึ่งมี `page`/`perpage` ติดไปด้วย) และเคารพตัวกรอง/คำค้นที่เปิดอยู่; แสดง toast **"Exported {N} records"** โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-PT-060015 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list-template` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
**ไม่มีไฟล์ถูกดาวน์โหลด**; แสดง toast เตือน **"No data to export"** (ไม่ใช่ toast สำเร็จ); ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-PT-060016 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/price-list-template` และตั้งตัวกรอง Status = Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือกขอบเขต "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนูของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog บันทึก view มีหัวข้อ **"Save view"** ช่อง "View name" และตัวเลือกขอบเขต "Only me" / "Everyone in this business unit"; บันทึกแล้วแสดง toast `View "<ชื่อ>" saved`, ป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรอง Status = Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อกลุ่ม **"My views"**; ลบ view แล้วรายการหายจากเมนู, แสดง toast "View deleted" และ `sv` ถูกล้างออกจาก URL
_(saved view เก็บทั้ง filter และ sort — `ViewSelector` รับ `snapshot={{ filters, sort }}` — ดังนั้นตั้ง sort ไว้ด้วยจะถูกเรียกคืนพร้อมกัน)_

---
## TC-PT-060017 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/price-list-template` และมี template อย่างน้อย 1 รายการที่รู้ชื่อแน่นอน
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมาทั้งหมด
3. เลือก Activity
4. ปิด sheet แล้วกลับหน้าเดิม
**Expected**
เมนูมี **เฉพาะ 2 รายการคือ Activity และ Delete** (Delete เป็น variant สีเตือน) — **ไม่มีรายการ Edit** เพราะ `usePriceListTemplateTable` ส่งให้ `actionColumn()` แค่ `onDelete` + `activity` ไม่ได้ส่ง `onEdit` (ดูหมายเหตุข้อ 12) ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name เท่านั้น; เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมหัวข้อ "Activity" โดยอ้าง **ชื่อ** ของแถวนั้น (`activity.label: (r) => r.name`); ปิด sheet แล้วกลับมาหน้ารายการโดย URL และข้อมูลไม่เปลี่ยน

---
## TC-PT-060018 — คอลัมน์ Name เป็นทางเข้าเดียวของแถว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มี template ที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. ค้นหา template รายการนั้นในหน้ารายการ
2. คลิกที่เซลล์คอลัมน์ **Currency** ของแถวนั้น
3. คลิกที่เซลล์คอลัมน์ **Validity Period** ของแถวนั้น
4. คลิกที่ข้อความในคอลัมน์ **Name** ของแถวเดียวกัน
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
คลิกที่เซลล์ Currency และ Validity Period **ไม่ navigate ไปไหน** URL ไม่เปลี่ยน (เซลล์เหล่านี้เป็นข้อความเปล่า และ `<tr>` ไม่มี handler คลิก); คอลัมน์ Name render เป็น **`<button>` ที่มีสไตล์ลิงก์** (`CellAction` — ไม่ใช่ `<a href>` จึงต้องคลิกที่ปุ่ม ไม่ใช่ที่แถว ซึ่งมี checkbox กับเมนูจัดการอยู่ด้วย); คลิกแล้วพาไปหน้า `/vendor-management/price-list-template/<uuid>` ของรายการนั้นในโหมดดู (มีปุ่ม Edit ไม่ใช่ปุ่ม Save)
_(สำคัญสำหรับคนเขียนสเปก: `PriceListTemplatePage.openTemplate()` ปัจจุบัน fallback ไป `templateRow(text).click()` ซึ่งไม่ทำอะไรเลยและจะค้างจนหมด `actionTimeout` — ใช้ `openFirst()` / `openRecordFromRow()` แทน ดูหมายเหตุข้อ 5)_

---
## TC-PT-060019 — ไม่มีสิทธิ์ดู — เมนูหาย และ deep link เจอกล่อง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น role ที่ **ไม่มีสิทธิ์ `vendor_management.view`** ใน BU = BLAVG และ **ไม่ใช่ admin** (ต้องยืนยันจาก permission matrix ของ BU ก่อนเขียนสเปก — ถ้าไม่มี role ใดใน `TEST_USERS` ที่เข้าเงื่อนไข ต้องเตรียม role ขึ้นมาก่อน ไม่ใช่ปล่อยให้เทส skip เงียบ ๆ); BU **มี** license ของฟีเจอร์นี้ (เพื่อแยกออกจาก `TC-PT-060020`)
**Steps**
1. เปิดหน้าใดก็ได้ที่มี sidebar แล้วหาเมนู Price List Template
2. เปิด URL `/vendor-management/price-list-template` ตรง ๆ
3. อ่านกล่องที่แสดงและกดปุ่มในกล่อง
4. เปิด URL `/vendor-management/price-list-template/new` ตรง ๆ
**Expected**
เมนู Price List Template **ไม่ปรากฏใน sidebar**; เปิด URL ตรง ๆ แล้ว `RouteGuard` แสดงกล่อง `role="alert"` หัวข้อ **"Permission Denied"** พร้อมคำอธิบาย "You don't have permission to view this page." และบรรทัด "Contact your administrator to request access." — **ไม่ใช่หน้ารายการเปล่าและไม่ใช่การ redirect เงียบ ๆ**; ปุ่มในกล่องพาไปหน้าที่ role นั้นเข้าได้ (landing path) ไม่ใช่การถอย history; deep link เข้า `/new` ถูกบล็อกด้วยกล่องเดียวกัน (`findRouteLeaf` จับแบบ prefix)

---
## TC-PT-060020 — BU ที่ไม่ได้ซื้อฟีเจอร์ — เจอกล่อง Feature Not Licensed แม้เป็น admin
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น **admin@blueledgers.com** และสลับไป BU ที่ **ไม่มี license `vendor_management.price_list_template`** (ต้องเตรียม BU ที่เข้าเงื่อนไขจริงก่อน — ถ้าทุก BU ในชุดทดสอบมี license ครบ เคสนี้เขียนเป็นสเปกไม่ได้ ให้แจ้งทีม backend ก่อน)
**Steps**
1. สลับ active BU ไปยัง BU ที่ไม่มี license นี้
2. เปิด URL `/vendor-management/price-list-template` ตรง ๆ
3. อ่านกล่องที่แสดง
4. สลับกลับไป BLAVG แล้วเปิด URL เดิม
**Expected**
แสดงกล่อง `role="alert"` หัวข้อ **"Permission Denied"** พร้อมคำอธิบายของ license คือ "This feature is not included in your organization's subscription. Contact your administrator or sales representative to enable it." และ **ไม่มีบรรทัด "Contact your administrator to request access."** (บรรทัดนั้นขึ้นเฉพาะเหตุผลเรื่องสิทธิ์); **การเป็น admin ไม่ช่วยให้ผ่าน** — `RouteGuard` เช็ค license ก่อน permission และสาขา license ไม่มี admin bypass เลย (ดูหมายเหตุข้อ 13); สลับกลับ BLAVG แล้วเข้าหน้าได้ตามปกติ โดยไม่ต้องโหลดหน้าใหม่

---
## TC-PT-060021 — รายการ template แยกตาม business unit
**Priority:** High · **Test Type:** Security
**Preconditions**
Login เป็น admin@blueledgers.com ซึ่งเป็นสมาชิกของ BU อย่างน้อยสองแห่ง; สร้าง template ที่ชื่อไม่ซ้ำไว้ใน BLAVG หนึ่งรายการ
**Steps**
1. อยู่ที่ BU = BLAVG แล้วค้นหาชื่อ template นั้นในหน้ารายการ
2. สลับ active BU เป็นอีกแห่งหนึ่งผ่าน BU switcher บน navbar
3. ค้นหาชื่อเดิมอีกครั้งในหน้ารายการ
4. สลับกลับ BLAVG แล้วค้นหาอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ที่ BLAVG ค้นเจอ template นั้น; หลังสลับ BU ตารางโหลดใหม่เองและ **ค้นหาชื่อเดิมไม่พบ** (ข้อมูลผูกกับ `buCode` ที่ใช้ประกอบ endpoint); จำนวนรายการรวมใน badge ของแถบหัวเปลี่ยนตาม BU; สลับกลับ BLAVG แล้วค้นเจออีกครั้ง — ข้อมูลไม่ปนข้าม BU ทั้งสองทาง

---
## TC-PT-200001 — ชื่อว่างแสดงข้อความ error ใต้ช่องและเลื่อนไปช่องแรกที่ผิด
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`
**Steps**
1. เลื่อนหน้าลงไปจนช่อง Name หลุดออกนอกจอ (เช่น ติ๊กสินค้าหลายรายการให้หน้ายาว)
2. กด Create โดยปล่อยช่อง Name ว่าง
3. อ่านสิ่งที่เกิดขึ้นกับตำแหน่งการเลื่อนหน้าและช่อง Name
4. กรอกชื่อแล้วกด Create อีกครั้ง
**Expected**
การ submit ถูกบล็อก, URL ยังเป็น `/vendor-management/price-list-template/new` และ **ไม่มี toast สำเร็จ**; **หน้าเลื่อนกลับขึ้นไปที่ช่อง Name เอง** (`scrollToFirstInvalidField()` ใน error handler ของ `handleSubmit`); ช่อง Name มี `aria-invalid="true"` และมีข้อความ **"Name is required"** แสดงคู่กับช่อง (มาจาก `validation.required` ผ่าน `FieldInput error=`) — **ให้ผูก assertion กับข้อความนี้ ไม่ใช่กับ `BasePage.anyError()`** ซึ่งแมตช์เครื่องหมายดอกจันของ label ด้วยและเป็นจริงตลอดเวลาในโหมดสร้าง (ดูหมายเหตุข้อ 3); กรอกชื่อแล้วกด Create อีกครั้ง บันทึกสำเร็จและข้อความ error หายไป

---
## TC-PT-200002 — ขีดจำกัดความยาวฝั่ง client ของทุกช่องข้อความ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` และติ๊กสินค้าไว้ 1 รายการ (เพื่อให้มีช่อง Note)
**Steps**
1. พิมพ์ตัวอักษร 150 ตัวลงในช่อง Name แล้วอ่านความยาวที่เหลืออยู่
2. พิมพ์ 300 ตัวลงในช่อง Description แล้วอ่านความยาว
3. พิมพ์ 1,200 ตัวลงในช่อง Instructions to vendor แล้วอ่านความยาว
4. พิมพ์ 300 ตัวลงในช่อง Note ของแถวสินค้า แล้วอ่านความยาว
**Expected**
ทุกช่องถูกตัดโดย `maxLength` ฝั่ง client **ก่อนถึง validation** ดังนี้ — Name เหลือ **100** ตัว, Description เหลือ **256**, Instructions to vendor เหลือ **1000**, Note เหลือ **256**; **ไม่มีข้อความ error ใด ๆ ปรากฏ** เพราะค่าที่เหลือผ่าน schema อยู่แล้ว (schema ไม่มี `.max()` เลย — เพดานทั้งหมดมาจาก attribute ของ input); กด Create แล้วบันทึกสำเร็จด้วยค่าที่ถูกตัดแล้ว

---
## TC-PT-200003 — อายุใบเสนอราคาเว้นว่างได้ แต่ค่าติดลบถูกบล็อก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new`; ชื่อที่จะใช้ยังไม่มีใน DB
**Steps**
1. กรอกชื่อ template แล้วกด Create โดย **ไม่แตะช่อง Validity period เลย**
2. เปิด `/new` อีกครั้ง กรอกชื่อใหม่ แล้วพิมพ์ `-5` ลงในช่อง Validity period
3. กด Create
4. แก้ค่าเป็น 15 แล้วกด Create
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
รอบแรกบันทึก **สำเร็จ** โดยไม่ต้องกรอก validity (schema เป็น `z.coerce.number().nullable()` ไม่ใช่ required) และคอลัมน์ Validity Period ในหน้ารายการแสดงขีด `—`; รอบที่สองการ submit **ถูกบล็อกโดย native constraint `min=1` ของช่อง** (rangeUnderflow) — ไม่มี toast สำเร็จ, URL ยังเป็น `/new`, และเบราว์เซอร์ชี้ไปที่ช่องนั้นเอง โดย **ไม่มีข้อความ error จาก zod** (การบล็อกเกิดก่อน `handleSubmit` จะถูกเรียก); แก้เป็น 15 แล้วบันทึกสำเร็จและคอลัมน์แสดง "15 days"
_(เคสนี้ไม่ทับ `TC-PT-030002` ในสเปก ซึ่งทดสอบค่า 0 ในโหมด **แก้ไข** เท่านั้น — ที่นี่ครอบโหมดสร้าง ค่าว่าง และค่าติดลบ)_

---
## TC-PT-200004 — MOQ ติดลบถูกบล็อกด้วย min=0 ของช่องจำนวน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list-template/new` กรอกชื่อไว้แล้ว และติ๊กสินค้า 1 รายการ
**Steps**
1. พิมพ์ `-1` ลงในช่อง MOQ ของแถวสินค้า
2. กด Create
3. แก้ค่าเป็น 0 แล้วกด Create
4. แก้ค่าเป็น 3 แล้วกด Create
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ค่า `-1` ทำให้ช่องเป็น rangeUnderflow ตาม `min={0}` ⇒ **submit ถูกบล็อก ไม่มี toast สำเร็จ และ URL ยังเป็น `/new`**; ค่า 0 **ผ่าน** (schema เป็น `z.coerce.number().min(0)` และช่องตั้ง `min={0}`) บันทึกสำเร็จ โดยตารางสินค้าในโหมดดูแสดง MOQ เป็นขีด `—` ตัวเอียง; ค่า 3 บันทึกสำเร็จและแสดงเป็นเลข 3

---
## TC-PT-900007 — ชื่อความยาวเต็มเพดาน 100 ตัวอักษร
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เตรียมสตริงยาว 100 ตัวอักษรที่ไม่ซ้ำกับรายการใน DB
**Steps**
1. เปิด `/vendor-management/price-list-template/new` แล้วกรอกชื่อยาว 100 ตัวอักษร
2. สังเกตหัวเรื่องของหน้าขณะพิมพ์
3. กด Create แล้วรอ toast
4. เปิดรายการนั้นจากหน้ารายการแล้วอ่านหัวเรื่องและช่อง Name
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวเรื่องของหน้าอัปเดตตามที่พิมพ์แบบ realtime (ผูกกับ `useWatch` ของ `name`) และ **ถูกตัดท้ายด้วยจุดไข่ปลาในบรรทัดเดียว ไม่ห่อลงบรรทัดที่สอง** (จงใจ — ข้อความเต็มอยู่ใน attribute `title` ของ `<h1>`); บันทึกสำเร็จ toast "Price List Template created successfully"; ในหน้ารายการ คอลัมน์ Name แสดงข้อความที่ถูก clamp แต่ค่าที่เก็บครบ 100 ตัว; เปิดหน้ารายละเอียดแล้วช่อง Name ในโหมดดูแสดงข้อความเต็ม 100 ตัว และปุ่มในแถบหัว **ไม่ถูกดันตกบรรทัด** (หัวเรื่องเป็นฝ่ายย่อ)

---
## TC-PT-900008 — กดปุ่มสร้างรัว ๆ ต้องไม่เกิดรายการซ้ำ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่ `/vendor-management/price-list-template/new` และกรอกชื่อที่ไม่ซ้ำไว้แล้ว
**Steps**
1. กดปุ่ม Create สามครั้งติดกันเร็วที่สุดเท่าที่ทำได้
2. อ่านป้ายบนปุ่มระหว่างที่คำขอยังไม่เสร็จ
3. รอ toast แล้วค้นหาชื่อนั้นในหน้ารายการ
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ทันทีที่กดครั้งแรก ปุ่มเปลี่ยนป้ายเป็น **"Creating..."** และถูก `disabled` (`getSubmitLabel` + `disabled={actions.isPending}`) ⇒ การกดครั้งที่สองและสามไม่ส่งคำขอเพิ่ม; ปุ่ม Cancel ก็ถูก disable ระหว่างนั้นเช่นกัน; แสดง toast "Price List Template created successfully" **เพียงใบเดียว**; ค้นหาชื่อนั้นในหน้ารายการแล้ว **เจอแถวเดียวเท่านั้น ไม่ใช่สองหรือสามแถว**
