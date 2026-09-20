# Price List — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/159-pl.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/159-pl.md`_

**Module:** Vendor Management — Price List (รายการราคาของผู้ขาย)
**Frontend route:** `routes/vendor-management/price-list`  •  **URL:** `/vendor-management/price-list`, `/vendor-management/price-list/new`, `/vendor-management/price-list/:id`
**Prefix:** `PL`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/159-pl.spec.ts` (28 เคส — 4 ใน 28 เป็น `test.fixme`)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 65

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/159-pl.spec.ts` ถือ ID `TC-PL-010001..010005`, `010050..010052`, `020001..020003`, `030001..030005`, `040001`, `040002`, `050001..050003`, `060001..060003`, `070002`, `070003`, `080001`, `080003` รวม **28 เคส** (ไฟล์มีสตริง `TC-PL-` 36 ตัว เพราะหัวคอมเมนต์คั่นบล็อกอีก 8 ตัวคือ `TC-PL-900001..900008` ซึ่ง**ไม่ใช่ชื่อเทส** — audit อ่านเฉพาะ ID ในชื่อ `test()` จึงไม่ถูกนับ แต่เอกสารนี้เลี่ยงเลขชุดนั้นอยู่ดี) **ไม่มี helper ตัวใดผลิตเคสของ `PL` เลย** — `grep -rn "TC-PL-" tests/` เจอเฉพาะไฟล์สเปกเอง (สเปกไม่ได้ import `tests/helpers/security-cases.ts`; import มีแค่ `fixtures/auth.fixture`, `pages/price-list.page`, `test-users`, `helpers/bu`, `pages/bu-switcher.page`, `helpers/test-data`)
>
>     เรื่องที่ครอบแล้วคือ: เปิดหน้า list ได้ · ปุ่ม Add แสดง · ค้นคำที่ไม่มีแล้วเจอ empty state (สองเคส) · แตะตัวกรองสถานะ · deep link หน้า list/detail ด้วย id มั่ว (assert แค่ว่า URL ยังมี `price-list`) · active BU = BLAVG · heading "Price List" · เปิดฟอร์มสร้างแล้วกรอก header + 1 แถวสินค้าแล้วกด Save · บันทึกโดยไม่เลือก vendor / ไม่กรอกราคาแล้วต้องมี error · คลิกแถวเปิดหน้า detail แล้ว URL เป็น `/price-list/:id` · กด Edit แล้วแก้วันที่/notes แล้ว Save · เปิดเมนูในแถวแล้วกด Delete → Cancel · กดปุ่ม Export · เคสสิทธิ์ของ requestor (list / edit / duplicate / delete) — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 2. **`test.skip` / `test.fixme` และ `.catch()` ในสเปก (นับแล้ว):**
>     - **`test.fixme` = 4 เคส** — `TC-PL-040002` (กรอกวันที่รูปแบบผิดไม่ได้อีกแล้ว เพราะเป็นปฏิทิน), `TC-PL-050001` (Duplicate หายจาก UI), `TC-PL-060002` (ปุ่ม Export ไม่ถูกกั้นสิทธิ์จริง), `TC-PL-080001` (Mark as Expired หายจาก UI)
>     - **`test.skip` ระดับประกาศ = 0 เคส** — มี `skip` ตัวเดียวคือ `adminTest.skip(true, …)` **ในตัวบอดี้ของ `TC-PL-080003`** (ข้ามตอนรันเมื่อหา active price list ได้ไม่ถึง 2 ใบ) ซึ่งแปลว่าเคสนั้นรายงานเป็น skipped แทบทุกครั้งบน BLAVG ที่ใบราคาเป็น draft ทั้งหมด **และมันเรียก `adminTest` ที่ถูกประกาศด้วย `const` อยู่ "ใต้" จุดเรียกในไฟล์** (ทำงานได้เพราะเรียกตอน runtime ไม่ใช่ตอน evaluate) — สับสนแต่ไม่ใช่บั๊ก
>     - **`.catch(() => {})` = 21 จุดจริง** (อีก 3 จุดที่ grep เจอเป็นข้อความในคอมเมนต์) กระจายใน **13 เคส**: `010005`(1), `020002`(2), `020003`(2), `040001`(1), `040002`(1), `050001`(3), `050002`(1), `060001`(1), `060003`(1), `070002`(1), `070003`(3), `080001`(2), `080003`(2)
>     - **`.catch()` ที่ครอบ assertion = 0 จุด** — ทั้ง 21 จุดครอบ **action** (`.click()`) ล้วน ๆ ไม่มีจุดไหนครอบ `expect(...)` (รอบถอด `.catch` ที่ครอบ assertion ทำจบไปแล้วตาม PR #57) **แต่การครอบ action ก็ยังทำให้ oracle อ่อน** — เช่น `TC-PL-070003` (กด Delete แล้ว Cancel) ครอบทั้งสามคลิกและ **ไม่มี assert ใดเลยหลังจากนั้น** เคสจึงเขียว 100% แม้เมนูไม่เปิด กล่องไม่ขึ้น และไม่มีอะไรถูกยกเลิก · `TC-PL-060001`/`060003` assert แค่ว่าปุ่ม Export **มีอยู่** แล้วคลิกแบบ swallow ไม่ได้ตรวจว่าไฟล์ถูกดาวน์โหลด — เคสใหม่ในบล็อก 06/07 ของเอกสารนี้เขียนแทนด้วย oracle ที่ผูกกับผลจริง
>
> 3. **`TC-PL-030005` ("Edge Case - Empty Line Items") ไม่ได้ทดสอบสิ่งที่ชื่อบอก** — บอดี้มีแค่ `gotoList()` → นับแถว → `row.click()` แล้วจบ ไม่มี assert เรื่องรายการสินค้าเลย (และ `row.click()` บน `<tr>` ก็ไม่เปิดหน้า detail อยู่ดี — เปิดด้วยปุ่มในเซลล์ `No.` ตามที่คอมเมนต์ของ `TC-PL-030001` เขียนไว้เอง) **เอกสารนี้จงใจไม่เขียนเคส "ใบราคาที่ไม่มีสินค้าในโหมด view" ซ้ำ** เพื่อไม่ให้ ID สองตัวอ้างเรื่องเดียวกัน — ให้ซ่อม `TC-PL-030005` ที่ตัวสเปกแทน (กล่องที่ต้องขึ้นคือ `EmptyProducts` หัวข้อ "No Products Yet" คำอธิบาย "Add products to this price list.")
>
> 4. **Section block ที่ `PL` ลงทะเบียนไว้คือ `01–08, 90`** (`docs/test-id-scheme.md` บรรทัด 46) — **ไม่ต้องแก้ scheme และเอกสารนี้ไม่ขอ section ใหม่** แต่ต้องจัดสามกลุ่มเข้าบล็อกที่ไม่ตรงขนบ เพราะ `10–19` (Security/Authorization), `20` (Validation) และ `30` (Integration) ไม่ได้ลงทะเบียนให้ `PL`:
>     - เคส **Validation** (ขนบอยู่บล็อก 20) และ **Edge case** → จัดเข้า **90** ซึ่งลงทะเบียนไว้แล้ว เริ่มที่ `900010` (เลี่ยง `900001..900008` ที่ถูกใช้เป็นหัวคอมเมนต์คั่นบล็อกในสเปก — ถ้าเอามาใช้ เลขเดิมจะเปลี่ยนความหมายเวลาใครไล่อ่านไฟล์สเปก)
>     - เคส **Authorization** (ขนบอยู่ 10–19) → จัดเข้า **01** เมื่อเป็นการกั้นทั้งหน้า (`TC-PL-010021`) และเข้า **07** เมื่อเป็นการกั้นปุ่มลบ (`TC-PL-070007`) เพราะทั้งคู่เป็นพฤติกรรมของหน้าที่มันอยู่จริง
>     - **ไม่ใช้บล็อก `05` (Duplicate) และ `08` (Mark as Expired) เลย** ทั้งที่ว่าง — สองฟีเจอร์นั้นถูกถอดออกจาก UI แล้ว (ดูข้อ 6) การเอาเลขในบล็อกนั้นไปใส่เรื่องอื่นจะทำให้เลขโกหกความหมายของตัวเอง
>     - เลขที่ถูกข้ามไว้ในสเปก (`TC-PL-070001`) **ไม่ถูกหยิบมาใช้** — เคสใหม่ของแต่ละบล็อกเริ่มนับต่อจากเลขสูงสุดของบล็อกนั้น
>
> 5. **⚠️ ความสัมพันธ์กับพอร์ทัลภายนอก `/pl/:url_token` — เอกสารนี้ครอบ "ฝั่งภายใน" เท่านั้น**
>     - **เป็นเรคคอร์ดเดียวกัน ไม่ใช่คนละเรื่อง** — พอร์ทัลภายนอกยิง `POST /api/external/api/check-pricelist/{token}` แล้ว PATCH กลับด้วย payload ที่มี `tb_pricelist_detail` โครงเดียวกับ `pricelist_detail` ของฟอร์มภายใน (ดูคอมเมนต์ใน `routes/external/pl/use-price-list-external.ts`: _"โครงเดียวกับ price list ปกติ เรื่องเดียวกัน ต่างแค่ vendor เป็นคนกรอก"_) สิ่งที่ vendor กรอกในพอร์ทัลจึงโผล่ที่ `/vendor-management/price-list/:id` ของฝั่งภายในโดยตรง และ MOQ tier ที่ vendor เพิ่มเข้ามาก็คือ `pricelist_detail` แถวใหม่ที่ product เดิม ซึ่งฝั่งภายในแสดงเป็น "กลุ่มเดียวกัน" ด้วย `buildProductGroups()` (ดู `TC-PL-030013`)
>     - **`docs/test-cases/1002-external-price-list.md` (prefix `EPL`, 42 เคส, สอบทาน 2026-09-20) เป็นเจ้าของฝั่ง vendor ทั้งหมด** — เปิดลิงก์ด้วย token, โหมดกรอกราคา, Save Draft / Submit, Excel download/import, MOQ tier ในพอร์ทัล, token หมดอายุ **เอกสารนี้ไม่เขียนทับส่วนนั้นแม้แต่เคสเดียว**
>     - **"การสร้างคำขอราคา" ไม่ได้อยู่ในโมดูลนี้** — การส่ง RFQ ไปหา vendor อยู่ที่ `/vendor-management/request-price-list` (`routes/vendor-management/request-price-list`, endpoint `REQUEST_PRICE_LISTS`, ปุ่มส่งอีเมลอยู่ใน `rfp-send-email-dialog.tsx`) ซึ่ง**มีสเปกของตัวเองแล้ว**คือ `tests/1001-campaign.spec.ts` prefix `CAM` (46 เคส) เอกสารนี้จึงไม่เขียนเคสสร้าง/ส่งคำขอราคาเลย — ช่องว่างตรงนั้นเป็นของ `CAM` ไม่ใช่ `PL`
>     - **"การอนุมัติ/ใช้งานราคา" ในโมดูลนี้ไม่มีปุ่ม Approve** — สถานะมี 4 ค่า (`draft` · `submitted` · `active` · `inactive` จาก `constant/price-list.ts`) และเปลี่ยนผ่าน **ช่อง Status ธรรมดาในฟอร์มโหมดแก้ไข** เท่านั้น ไม่มี workflow/ปุ่มอนุมัติ/ลายเซ็นใด ๆ ในโค้ด **เคสในเอกสารนี้จึง assert ว่า "เปลี่ยนสถานะผ่านช่อง Status แล้วมีผลทุกหน้าจอ" (`TC-PL-040010`, `TC-PL-040011`) ไม่ใช่ "กดอนุมัติ"** — ถ้าผลิตภัณฑ์ตั้งใจให้มีขั้นอนุมัติจริง นั่นคือฟีเจอร์ที่ยังไม่มี ไม่ใช่เทสที่เขียนผิด
>     - คำอธิบายของสถานะที่ UI เขียนไว้เอง (`vendorManagement.priceList.statusDescription` ใน `messages/en.json`) ระบุว่า draft = ฝ่ายจัดซื้อมองไม่เห็นและสั่งอัตโนมัติไม่ได้ · active = ถูกใช้ซื้อจริง · inactive = เก็บเข้ากรุ **แต่ไม่มี component ไหนใน `routes/vendor-management/price-list` เรียก key ชุดนี้เลย** (grep แล้วไม่เจอผู้ใช้) — เป็นข้อความที่เขียนไว้แต่ยังไม่ได้แสดง จึง**ไม่มีเคสไหนในเอกสารนี้ assert ข้อความสามบรรทัดนั้น**
>
> 6. **สองฟีเจอร์ที่หายไปจาก UI แล้ว — ไม่มีเคสใหม่ให้** (ยืนยันจากซอร์สวันที่เขียนรายงาน): เมนูในแถวมีแค่ **Activity** กับ **Delete** (`actionColumn()` ใน `use-pl-table.tsx` ส่งแค่ `onDelete` + `activity` ไม่ได้ส่ง `onEdit` ด้วยซ้ำ) และหน้า detail มีแค่ **Edit / Delete / Activity** ไม่มี **Duplicate** และไม่มี **Mark as Expired** ที่ไหนเลย ทั้ง `PL_STATUS_TONE` จะมีสี `expired` ค้างอยู่ก็ตาม (สถานะ `expired` ไม่อยู่ใน `PRICE_LIST_STATUS_OPTIONS` และไม่อยู่ในตัวกรอง) — `TC-PL-050001` / `TC-PL-080001` ที่เป็น `fixme` อยู่แล้วสะท้อนเรื่องนี้ถูกต้อง **เอกสารนี้ไม่เขียนเคสที่ยืนยันว่าฟีเจอร์ยังไม่ทำงาน**
>
> 7. **⚠️ `tests/pages/price-list.page.ts` ยังมีของที่ชี้ไปยัง UI ที่ไม่มีแล้ว — ต้องตามเก็บก่อนแปลงเคสในเอกสารนี้เป็นสเปก** (ห้ามแก้ไฟล์นี้ในงานนี้ แต่ผู้เขียนสเปกต้องรู้):
>     - `duplicateButton()` และ `markExpiredButton()` ยังอยู่ทั้งที่ไม่มีปุ่มสองตัวนั้นในแอปแล้ว (ข้อ 6)
>     - `statusOption()` / `openStatusFilter()` คาดหวัง `role="option"` — ถูกเฉพาะตัวกรอง **Status** กับ **Currency** ของหน้านี้ที่ใช้ `MultiSelectFilter` (→ `CommandItem` = `role="option"`) ส่วนตัวกรอง **Vendor** (`control: "vendor"`) และ **Effective Period** (`control: "date-range"`) เป็นคนละ control อย่าเหมารวม
>     - `unitInput()` = `getByLabel(/^unit$/i)` หาไม่เจอ — ช่อง Unit ในแถวสินค้าเป็น Radix `Select` ที่ไม่มี label ผูก (`unitTrigger()` ที่เจาะด้วยตำแหน่งในแถวคือตัวที่ใช้ได้จริง)
>     - `numberInput()` ชื่อหลอก — มันคือช่อง **Name** (`#pl-name`) ตามที่ docstring ของมันเองอธิบายไว้ ฟอร์มนี้ไม่มีช่อง "Price List Number" ให้กรอก (เลขที่ `No.` ถูก generate และโผล่เป็น badge ข้างหัวข้อหลังบันทึกแล้วเท่านั้น) — **ชื่อเมธอดควรถูกเปลี่ยนก่อนที่เคสใหม่จะไปเรียกใช้**
>     - `fillHeader()` ตีความ `validFrom` / `validTo` เป็น "สั่งให้ตั้งค่าช่องวันที่" ไม่ใช่ค่าจริง (มันกดปฏิทินแล้วหยิบวันที่ 15 / 20 ของเดือนที่โชว์อยู่) เคสที่ต้องการวันที่เจาะจง เช่น `TC-PL-900011` **ต้องขับปฏิทินเอง**
>     - `emptyState()` ใช้ regex `/no.*found|no.*data|empty|ไม่พบ/i` ซึ่งกว้างพอจะไปแมตช์ข้อความอื่นบนหน้าได้ — ของจริงที่ตารางว่างแสดงคือ `EmptyComponent` (`common.noData` = "No data")
>
> 8. **กับดัก toast — สาม toast ลงท้ายเหมือนกันหมด** `messages/en.json` กำหนด `toast.createSuccess = "{entity} created successfully"`, `updateSuccess`, `deleteSuccess` โดย `t("entity") = "Price List"` regex กว้าง ๆ อย่างที่ `expectSavedToast()` ใช้ (`/success|saved|created|updated|deleted|…/i`) จึงแมตช์ toast ของ *ทุก* การกระทำ รวมถึง toast ของ export (`common.exportSuccess` = "Exported {count} records") ด้วย **เคสใหม่ทุกเคสในเอกสารนี้ให้ผูก assertion กับข้อความเต็ม** เช่น `/Price List updated successfully/i` หรือรอ response ของ PATCH ด้วย `waitForResponse` แทน (ดูบันทึกทีมเรื่อง department ที่ regex กว้างทำให้ reload ตัด PATCH กลางคัน)
>
> 9. **หน้านี้ไม่ได้กั้นปุ่มด้วยสิทธิ์ ยกเว้นสองจุด** — `pl-component.tsx` เรียก `DocumentListActions` โดย **ไม่ส่ง `addDisabled`** และ `pl-form.tsx` วางปุ่ม Edit / Delete / Activity เป็น `<Button>` ดิบใน `DocFormHeader` ไม่ได้ผ่าน `FormToolbar` ที่เช็คสิทธิ์ให้ ผลคือปุ่ม **Add · Export · Print · Edit · Delete บนฟอร์ม ไม่ถูกเช็ค permission ฝั่ง UI เลย** (ไปตาย 403 เอาข้างหน้า) — ตรงกับที่คอมเมนต์ `TC-PL-060002` ในสเปกบันทึกไว้ สองจุดที่กั้นจริงคือ **`RouteGuard`** (สิทธิ์ `vendor_management.price_list.view`, จับแบบ prefix จึงครอบ `/new` และ `/:id` ด้วย — `findRouteLeaf()` ใน `constant/module-list.ts`) และ **ปุ่มลบในแถว/บนการ์ด** ที่ผ่าน `useDeleteGate()` **เอกสารนี้จึงมีเคสสิทธิ์แค่สองตัว (`TC-PL-010021`, `TC-PL-070007`) ตรงกับสองจุดนั้นพอดี** ส่วนที่เหลือบันทึกเป็นข้อเท็จจริงไว้ให้ทีมตัดสินใจ
>
> 10. **`price-list` ไม่มี `licenseFeature`** ใน `constant/module-list.ts:219-225` (ต่างจาก `price-list-template` และ `request-price-list` ที่มี) จึงไม่มีสถานะ "locked / ยังไม่ได้ซื้อ" ให้ทดสอบในโมดูลนี้ — เคสสิทธิ์ทั้งหมดเป็น RBAC ล้วน
>
> 11. **บทบาทที่ใช้ตั้ง precondition ของเคสสิทธิ์ต้องยืนยันก่อน** — คอมเมนต์ของ `TC-PL-060002` ในสเปกบันทึกไว้ว่า `requestor@blueledgers.com` **เปิดหน้าและฟอร์มสร้างของโมดูลนี้ได้** แปลว่า requestor มีสิทธิ์ `price_list.view` อยู่ **อย่าใช้ requestor เป็น "ผู้ใช้ที่ไม่มีสิทธิ์" ใน `TC-PL-010021` / `TC-PL-070007`** — ต้องเตรียม role ที่ยืนยันแล้วว่าไม่มี `vendor_management.price_list.view` / `.delete` จริง (ตั้งที่ `/system-administration/role`) ไม่ใช่เดาจากชื่อบทบาท
>
> 12. **ค่าที่ผู้ใช้กรอกในช่อง Price คือราคา "รวมภาษี" (gross)** ส่วน PWT (ก่อนภาษี) และ Tax เป็นค่าที่ derive ให้สดจาก tax rate ของ Tax Profile ที่เลือก (`useRowPriceParts()` ใน `pl-item-cells.tsx` และ `mapDetailToPayload()` ใน `pl-form-schema.ts` ใช้สูตรเดียวกัน: `pwt = round2(price / (1 + rate/100))`, `tax = round2(price - pwt)`, `amount = price`) — เคสที่แตะราคาทุกเคสในเอกสารนี้เขียนตามนิยามนี้ อย่าอ่านคอลัมน์ Amount เป็น "ราคา × จำนวน"
>
> 13. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PL-010006 | หน้า list แสดงหัวเรื่อง จำนวนรายการ ปุ่มในแถบหัว และคอลัมน์มาตรฐาน | High | Smoke |
| TC-PL-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-PL-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-PL-010009 | กรองตามสถานะ เลือกได้หลายค่าพร้อมไอคอนชุดเดียวกับตาราง | High | Functional |
| TC-PL-010010 | กรองตามสกุลเงิน (ค้นหาได้ และมีเฉพาะสกุลที่เปิดใช้งาน) | Medium | Functional |
| TC-PL-010011 | กรองตามผู้ขายจากเมนู Filter | Medium | Functional |
| TC-PL-010012 | กรองตามช่วงวันเริ่มมีผล (Effective Period) | Medium | Functional |
| TC-PL-010013 | ใช้ตัวกรองหลายตัวพร้อมกัน แล้วล้างทั้งหมดด้วย Clear | Medium | Functional |
| TC-PL-010014 | เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามเลขที่ และสลับทิศได้เสมอ | Medium | Functional |
| TC-PL-010015 | ซ่อน-แสดงคอลัมน์ และคอลัมน์ Created / Updated ที่ถูกซ่อนไว้แต่แรก | Low | Functional |
| TC-PL-010016 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Medium | Functional |
| TC-PL-010017 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-PL-010018 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-PL-010019 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-PL-010020 | คอลัมน์สถานะแสดงครบทั้งสี่สถานะด้วยไอคอนและป้ายชุดเดียวกัน | Medium | Functional |
| TC-PL-010021 | ผู้ใช้ที่ไม่มีสิทธิ์ดูถูก RouteGuard บล็อกทั้งหน้า list และ deep link | High | Authorization |
| TC-PL-010022 | รายการใบราคาแยกตาม business unit | High | Security |
| TC-PL-020004 | โครงหน้า /new — หัวข้อ สถานะเริ่มต้น และปุ่มที่ต้องมี/ไม่มี | High | Functional |
| TC-PL-020005 | สกุลเงินถูกเติมจากค่าเริ่มต้นของโปรไฟล์โดยฟอร์มยังไม่ dirty | Medium | Functional |
| TC-PL-020006 | เลือกผู้ขายจาก lookup ที่ค้นหาได้และมีเฉพาะผู้ขายที่เปิดใช้งาน | High | Functional |
| TC-PL-020007 | ปฏิทิน Effective To ปิดวันที่ก่อน Effective From | Medium | Functional |
| TC-PL-020008 | กด Add Item แล้วแถวใหม่ถูกวางบนสุด | Medium | Functional |
| TC-PL-020009 | เลือกสินค้าแล้วหน่วยนับถูกเลือกให้อัตโนมัติจากหน่วยของสินค้านั้น | High | Functional |
| TC-PL-020010 | เลือก Tax Profile แล้ว PWT / Tax / Amount คำนวณใหม่ทันที | High | Functional |
| TC-PL-020011 | เลือกสินค้าซ้ำกับแถวอื่นต้องยืนยันในกล่อง Duplicate product | Medium | Functional |
| TC-PL-020012 | ลบแถวสินค้าในฟอร์มต้องยืนยันในกล่อง Remove Product | Medium | Functional |
| TC-PL-020013 | สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของใบใหม่พร้อมเลขที่ที่ระบบออกให้ | High | Happy Path |
| TC-PL-020014 | Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list | Medium | Alternate Flow |
| TC-PL-020015 | กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-PL-020016 | สร้างใบราคาที่ยังไม่มีสินค้าเลย | Medium | Edge Case |
| TC-PL-030006 | หน้ารายละเอียดโหมด view แสดงข้อมูลครบและแก้ไม่ได้ | High | Functional |
| TC-PL-030007 | ตารางสินค้าโหมด view จัดกลุ่มตามสินค้าและเรียง tier ตาม MOQ | High | Functional |
| TC-PL-030008 | คอลัมน์และค่าที่แสดงในตารางสินค้าโหมด view | Medium | Functional |
| TC-PL-030009 | tier ที่ถูกตั้งเป็น preferred แสดงไอคอนมงกุฎ | Low | Functional |
| TC-PL-030010 | deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view | Medium | Functional |
| TC-PL-030011 | ระหว่างรอข้อมูลของหน้ารายละเอียดแสดง skeleton ของฟอร์ม | Low | Functional |
| TC-PL-030012 | เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด | Low | Functional |
| TC-PL-030013 | ใบราคาที่ vendor ส่งกลับจากพอร์ทัลเปิดดูฝั่งภายในได้ครบ | High | Functional |
| TC-PL-040003 | กด Edit แล้วเข้าโหมดแก้ไขทั้งส่วนหัวและตารางสินค้า | High | Functional |
| TC-PL-040004 | คอลัมน์ของตารางสินค้าในโหมดแก้ไข | Medium | Functional |
| TC-PL-040005 | เพิ่มสินค้าใหม่ในโหมดแก้ไขแล้วค่าคงอยู่หลังโหลดใหม่ | High | CRUD |
| TC-PL-040006 | แก้ราคาและ lead time ของแถวเดิมแล้วค่าคงอยู่ | High | CRUD |
| TC-PL-040007 | ลบแถวสินค้าเดิมแล้วหายจริงหลังโหลดใหม่ | High | CRUD |
| TC-PL-040008 | แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดแถวซ้ำ | High | Edge Case |
| TC-PL-040009 | ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view | Medium | Alternate Flow |
| TC-PL-040010 | เปลี่ยนสถานะใบราคาเป็น Active เพื่อเปิดใช้งานราคา | High | CRUD |
| TC-PL-040011 | ปิดใช้งานใบราคา (Inactive) แล้วสถานะเปลี่ยนทุกหน้าจอ | Medium | CRUD |
| TC-PL-040012 | กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก | Medium | Functional |
| TC-PL-040013 | ปุ่มบันทึกเปลี่ยนป้ายและถูก disable ระหว่างกำลังบันทึก | Low | Functional |
| TC-PL-060004 | ส่งออกรายการใบราคาเป็นไฟล์ XLSX ที่มีหกคอลัมน์ | Medium | Functional |
| TC-PL-060005 | ส่งออกขณะมีตัวกรองอยู่ และกรณีไม่มีข้อมูลให้ส่งออก | Medium | Edge Case |
| TC-PL-060006 | ปุ่ม Export เปลี่ยนป้ายและถูก disable ระหว่างส่งออก | Low | Functional |
| TC-PL-070004 | ลบใบราคาจากเมนูในแถวแล้วแถวหายจริง | High | CRUD |
| TC-PL-070005 | ลบใบราคาจากหน้ารายละเอียดแล้วเด้งกลับหน้า list | High | CRUD |
| TC-PL-070006 | ลบใบราคาจากปุ่มลบบนการ์ดในมุมมองกริด | Low | CRUD |
| TC-PL-070007 | ผู้ใช้ที่ไม่มีสิทธิ์ลบ กดเมนู Delete แล้วเจอกล่องแจ้งสิทธิ์ | High | Authorization |
| TC-PL-900010 | บันทึกฟอร์มเปล่าแล้วขึ้นข้อความ required ครบทุกช่องบังคับ | High | Validation |
| TC-PL-900011 | Effective To ก่อน Effective From ถูกบล็อกพร้อมข้อความ | Medium | Validation |
| TC-PL-900012 | แถวสินค้าที่ยังไม่เลือก Product / Unit / Tax Profile บล็อกการบันทึก | High | Validation |
| TC-PL-900013 | MOQ ซ้ำกับ tier เดิมของสินค้าและหน่วยเดียวกันถูกบล็อก | High | Validation |
| TC-PL-900014 | tier ที่ MOQ สูงกว่าแต่ราคาแพงกว่าถูกบล็อก | High | Validation |
| TC-PL-900015 | ช่อง MOQ / Price / Lead Time เป็น number input ที่มี min = 0 | Low | Validation |
| TC-PL-900016 | ขีดจำกัดความยาวของช่อง Name และ Description | Low | Validation |
| TC-PL-900017 | การปัดทศนิยมของ PWT และ Tax เมื่อราคาหารไม่ลงตัว | Medium | Edge Case |
| TC-PL-900018 | วันที่มีผลแสดงตรงกันระหว่างหน้า list กับฟอร์ม (ไม่หล่นไปหนึ่งวัน) | Medium | Edge Case |

---
## TC-PL-010006 — หน้า list แสดงหัวเรื่อง จำนวนรายการ ปุ่มในแถบหัว และคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบราคาอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/vendor-management/price-list`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. อ่านแถบหัว แถบเครื่องมือ และหัวตาราง
**Expected**
หัวหน้าแสดงไอคอนโมดูล ชื่อ "Price List" และ badge จำนวนรายการรวม (แสดงเฉพาะเมื่อ > 0 — `DocumentListHeader`) พร้อมคำอธิบายใต้ชื่อ "Prices each vendor has quoted, and how long each price holds."; แถบหัวมีปุ่ม **Export**, **Print** และ **"Add Price List"**; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), **No.**, **Name**, **Vendor**, **Effective Period**, **Status** (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ **Created / Updated ถูกซ่อนไว้ตั้งแต่ต้น** (`initialState.columnVisibility` ใน `use-pl-table.tsx`); ค่าในคอลัมน์ No. เป็นปุ่มลิงก์ (`CellAction` — `<button>` ไม่ใช่ `<a>`); แถบเครื่องมือมีช่องค้นหา (placeholder "Search..."), ปุ่ม saved view (ป้าย "No view"), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และปุ่มสลับมุมมอง list/grid

---
## TC-PL-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; มีใบราคาหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับใบราคาที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต (`handleSetSearch` เรียก `setPage("")`)

---
## TC-PL-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search"); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-PL-010009 — กรองตามสถานะ เลือกได้หลายค่าพร้อมไอคอนชุดเดียวกับตาราง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list` บนหน้าจอ desktop; BU มีใบราคาอย่างน้อยสองสถานะที่ต่างกัน (เช่น draft และ active)
**Steps**
1. คลิกปุ่ม **Filter**
2. เลือกหัวข้อ **Status** ในหมวด "Document"
3. เลือก **Draft** หนึ่งค่า แล้วอ่านแถบ chip กับตาราง
4. เลือก **Active** เพิ่มอีกหนึ่งค่า แล้วอ่าน chip กับตารางอีกครั้ง
**Expected**
เมนูสถานะแสดงสี่ตัวเลือก **Draft · Submitted · Active · Inactive** โดยแต่ละตัวมีไอคอนสถานะชุดเดียวกับที่คอลัมน์ Status ในตารางใช้ (`MultiSelectFilter` + `StatusIconLabel`); เลือกค่าเดียวแล้วตารางเหลือเฉพาะใบที่สถานะตรง และแถบ `ActiveFilterBar` ขึ้น chip ที่แสดง **ป้ายภาษาของสถานะ ไม่ใช่ค่าดิบ** (`valueText` ใน `pl-component.tsx`); เลือกค่าที่สองแล้ว chip แสดงเป็น `<ป้ายแรก> +1` และตารางแสดงใบของทั้งสองสถานะ; query string มีพารามิเตอร์ `filter` ที่รวม clause ของสถานะที่เลือก

---
## TC-PL-010010 — กรองตามสกุลเงิน (ค้นหาได้ และมีเฉพาะสกุลที่เปิดใช้งาน)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; BU มีใบราคาอย่างน้อยสองสกุลเงินที่ต่างกัน; รายการสกุลเงินของ BU มีทั้งที่ `is_active` และที่ปิดใช้งาน
**Steps**
1. คลิกปุ่ม **Filter** แล้วเลือกหัวข้อ **Currency**
2. พิมพ์รหัสสกุลเงินลงในช่องค้นของเมนู
3. เลือกสกุลเงินหนึ่งค่า
4. อ่านตารางและ chip
**Expected**
เมนูสกุลเงินค้นหาได้ (`searchable`) และแสดง **รหัสสกุลเงิน** เป็นป้าย (เช่น "THB", "USD") โดยมีเฉพาะสกุลที่ `is_active` เท่านั้น (สกุลที่ปิดใช้งานไม่อยู่ในรายการ); เลือกแล้วตารางเหลือเฉพาะใบราคาของสกุลนั้น และขึ้น chip ของตัวกรอง Currency; ค่าที่ส่งไป backend เป็น clause รูป `currency_code|string:<code>`

---
## TC-PL-010011 — กรองตามผู้ขายจากเมนู Filter
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; BU มีใบราคาของผู้ขายอย่างน้อยสองราย
**Steps**
1. เปิด DevTools แท็บ Network แล้วคลิกปุ่ม **Filter**
2. ดูว่ามีการเรียก API ทะเบียนผู้ขายตอนเปิดหน้า list หรือไม่
3. เลือกหัวข้อ **Vendor** ในหมวด "People" แล้วเลือกผู้ขายหนึ่งราย
4. อ่านตารางและ chip
**Expected**
**ตอน mount หน้า list ไม่มีการยิงทะเบียนผู้ขาย** — คำขอจะเกิดตอนเปิด popover ของตัวกรอง Vendor เท่านั้น (คอมเมนต์ใน `pl-component.tsx` ระบุว่าทะเบียนใหญ่หลักร้อย KB จึงเลี่ยงไม่จ่ายค่านั้นตอน mount); หลังเลือกผู้ขาย ตารางเหลือเฉพาะใบราคาของผู้ขายนั้น คอลัมน์ Vendor แสดงชื่อเดียวกันทุกแถว และ chip แสดง **ชื่อผู้ขาย** ไม่ใช่ id

---
## TC-PL-010012 — กรองตามช่วงวันเริ่มมีผล (Effective Period)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; BU มีใบราคาที่วันเริ่มมีผลอยู่คนละช่วงกันอย่างน้อยสองใบ
**Steps**
1. คลิกปุ่ม **Filter** แล้วเลือกหัวข้อ **Effective Period** ในหมวด "Date"
2. เลือกช่วงวันที่ที่คลุมใบราคาเพียงใบเดียว
3. อ่านตาราง
**Expected**
ตัวกรองเป็นแบบช่วงวันที่ (`control: "date-range"`) และกรองที่ฟิลด์ **`effective_from_date`** คือ "วันเริ่มมีผล" ไม่ใช่ทั้งช่วง (ดูคอมเมนต์ในนิยาม field ของ `pl-component.tsx`); ตารางเหลือเฉพาะใบที่วันเริ่มมีผลอยู่ในช่วงที่เลือก และขึ้น chip ของตัวกรองนี้; ใบที่วัน**สิ้นสุด**อยู่ในช่วงแต่วันเริ่มอยู่นอกช่วง **ไม่ถูกนับเข้ามา**

---
## TC-PL-010013 — ใช้ตัวกรองหลายตัวพร้อมกัน แล้วล้างทั้งหมดด้วย Clear
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; BU มีข้อมูลพอให้ตัวกรองสองตัวตัดกันแล้วยังเหลือผลลัพธ์
**Steps**
1. ตั้งตัวกรอง **Status** หนึ่งค่า
2. ตั้งตัวกรอง **Currency** อีกหนึ่งค่า
3. อ่านจำนวน chip บนแถบตัวกรองและจำนวนที่แสดงบนปุ่ม Filter
4. กด **Clear** ในเมนู Filter
**Expected**
ตารางแสดงเฉพาะใบที่เข้าเงื่อนไขทั้งสองข้อพร้อมกัน; แถบตัวกรองมี chip สองใบและปุ่ม Filter แสดงจำนวนตัวกรองที่เปิดอยู่ (`activeCount`); กด Clear แล้ว chip หายทั้งหมด พารามิเตอร์ `filter` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมด

---
## TC-PL-010014 — เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามเลขที่ และสลับทิศได้เสมอ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list`; มีใบราคาอย่างน้อย 3 รายการที่เลขที่ต่างกัน
**Steps**
1. อ่านลำดับแถวและ query string ตอนเพิ่งเข้าหน้า
2. เปิดเมนูเรียงลำดับแล้วสลับทิศของคอลัมน์ No.
3. คลิกสลับซ้ำอีกหลายครั้ง
**Expected**
ค่าเริ่มต้นคือเรียงตาม **`pricelist_no` จากน้อยไปมาก** (`defaultSort: "pricelist_no:asc"` ใน `pl-component.tsx`) โดยที่ query string ยังไม่มีพารามิเตอร์ `sort` จนกว่าผู้ใช้จะสั่งเอง; สลับแล้ว URL มี `sort=pricelist_no:desc` และลำดับแถวกลับด้าน; **ไม่มีสถานะ "ไม่เรียง"** — คลิกซ้ำจะสลับ asc ↔ desc ไปเรื่อย ๆ (`onSortingChange` พลิกทิศเมื่อ TanStack ขอถอด sort ออก) และการเปลี่ยน sort รีเซ็ต `page` กลับหน้าแรก

---
## TC-PL-010015 — ซ่อน-แสดงคอลัมน์ และคอลัมน์ Created / Updated ที่ถูกซ่อนไว้แต่แรก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list` บนหน้าจอ desktop
**Steps**
1. เปิดเมนูคอลัมน์ (ปุ่ม aria-label "Toggle columns")
2. อ่านรายการคอลัมน์และเครื่องหมายถูก
3. ติ๊กเปิดคอลัมน์ **Created** แล้วปิดคอลัมน์ **Vendor**
**Expected**
รายการคอลัมน์มี Created และ Updated อยู่ในเมนูโดย **ไม่ถูกติ๊ก** (ซ่อนไว้ตั้งแต่ต้น); เปิด Created แล้วคอลัมน์โผล่ในตารางพร้อมค่าผู้ทำและเวลาในรูปแบบ `dateTimeFormat` ของโปรไฟล์; ปิด Vendor แล้วคอลัมน์หายจากตารางและเครื่องหมายถูกในเมนูอัปเดตตามทันที (หน้านี้ใส่ `"use no memo"` ไว้ที่ `ListToolbar` เพื่อกันอาการเครื่องหมายถูกค้าง)

---
## TC-PL-010016 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list` บนหน้าจอ desktop; มีใบราคาอย่างน้อย 1 รายการที่มีผู้ขายและช่วงวันที่มีผลครบ
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. อ่านข้อมูลบนการ์ดใบแรก
3. คลิกที่หัวการ์ดเพื่อเปิดรายการ
**Expected**
หน้าเปลี่ยนเป็นการ์ดเรียงเป็นกริด (1 / 2 / 3 คอลัมน์ตามความกว้างจอ); แต่ละการ์ดมีชื่อใบราคาเป็นหัวข้อ (ถ้าไม่มีชื่อจะแสดง "..."), badge สถานะแบบตัวพิมพ์ใหญ่, และแถวข้อมูล **No. · Vendor · Effective Period** (ช่วงวันที่ถูกฟอร์แมตตาม `dateFormat` ของโปรไฟล์ และแสดง "—" เมื่อแปลงวันไม่ได้) พร้อมแถวข้อมูล audit ท้ายการ์ด; คลิกหัวการ์ดแล้วไปที่ `/vendor-management/price-list/<id>`; หน้าจอขนาดมือถือถูกบังคับเป็นมุมมองการ์ดเสมอและเลื่อนลงเพื่อโหลดเพิ่ม (infinite scroll) แทน pagination

---
## TC-PL-010017 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/price-list` ในมุมมองตาราง; BU มีใบราคามากกว่า 10 รายการ
**Steps**
1. อ่านจำนวนแถวที่แสดงและ query string ตอนเพิ่งเข้าหน้า
2. เปลี่ยนจำนวนแถวต่อหน้าเป็นค่าที่มากขึ้น
3. กดไปหน้าถัดไป
**Expected**
ค่าเริ่มต้นคือ **10 แถวต่อหน้า** โดยที่ URL ยังไม่มี `perpage` (`defaultPerpage = 10` ใน `use-list-page-state.ts`); เปลี่ยนค่าแล้ว URL มี `perpage=<ค่าใหม่>` และจำนวนแถวเปลี่ยนตาม; กดหน้าถัดไปแล้ว URL มี `page=2` และคอลัมน์ลำดับที่ (#) นับต่อจากหน้าก่อนไม่ใช่เริ่มที่ 1 ใหม่ (`indexColumn(params)`)

---
## TC-PL-010018 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/price-list` โดยตั้งตัวกรองไว้แล้วอย่างน้อยหนึ่งตัว
**Steps**
1. เปิดเมนู Filter แล้วกด **"Save current filters as view"**
2. ตั้งชื่อ view และเลือกขอบเขต "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เลือก view ที่เพิ่งบันทึกจากปุ่ม saved view
5. ลบ view ทิ้งเพื่อคืนสภาพ
**Expected**
กล่อง "Save view" เปิดขึ้นพร้อมช่องชื่อและตัวเลือกขอบเขต (Only me / Everyone in this business unit — ตัวหลังขึ้นเฉพาะผู้ที่จัดการ BU ได้); บันทึกแล้วขึ้น toast `View "<ชื่อ>" saved` และปุ่ม saved view เปลี่ยนป้ายเป็นชื่อ view; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรองและการเรียงลำดับกลับมาเหมือนตอนบันทึก; ตั้งชื่อซ้ำกับ view เดิมจะถูกถามให้ยืนยันแทนที่ (`A view named "…" already exists. Replace it?`)

---
## TC-PL-010019 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/price-list`; มีใบราคาอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มสามจุดท้ายแถวแรก (aria-label "Row actions")
2. อ่านรายการเมนู
3. คลิก **Activity**
**Expected**
เมนูมีเพียงสองรายการคือ **Activity** และ **Delete** (ปุ่มลบใช้สไตล์ destructive) — **ไม่มี Edit, ไม่มี Duplicate และไม่มี Mark as Expired** เพราะ `use-pl-table.tsx` ส่งให้ `actionColumn()` แค่ `onDelete` กับ `activity`; คลิก Activity แล้วแผง activity ของใบนั้นเปิดขึ้นโดยอ้างอิงด้วยเลขที่ใบราคา (`activity: { id: r.id, label: r.no }`) และ URL ไม่เปลี่ยน

---
## TC-PL-010020 — คอลัมน์สถานะแสดงครบทั้งสี่สถานะด้วยไอคอนและป้ายชุดเดียวกัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; BU มีใบราคาครบทั้งสี่สถานะ (draft, submitted, active, inactive) — เตรียมโดยสร้างใบใหม่แล้วตั้งสถานะจากฟอร์ม (ดู `TC-PL-040010`)
**Steps**
1. ไปที่ `/vendor-management/price-list` แล้วกรองทีละสถานะจนเห็นครบทั้งสี่
2. อ่านคอลัมน์ Status ของแต่ละกลุ่ม
3. เปิดใบหนึ่งใบแล้วเทียบสถานะบนหัวหน้ารายละเอียดกับที่ตาราง
**Expected**
คอลัมน์ Status แสดงเป็นไอคอน + ป้ายตัวพิมพ์ใหญ่ จัดกึ่งกลางคอลัมน์ โดยมีสี่ค่าเท่านั้น **DRAFT · SUBMITTED · ACTIVE · INACTIVE** (ไม่มีค่า "EXPIRED" ปรากฏในตารางหรือในตัวกรอง แม้ `PL_STATUS_TONE` จะมีสีของ `expired` ค้างอยู่ก็ตาม); ป้ายมาจาก i18n ชุดเดียวกับที่ตัวกรองใช้ และไอคอน/โทนสีบนหัวหน้ารายละเอียดเป็นชุดเดียวกับในตาราง

---
## TC-PL-010021 — ผู้ใช้ที่ไม่มีสิทธิ์ดูถูก RouteGuard บล็อกทั้งหน้า list และ deep link
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีบัญชีที่ **ยืนยันแล้วว่าไม่มี permission `vendor_management.price_list.view`** และไม่ใช่ admin (ตั้งที่ `/system-administration/role` — **อย่าใช้ requestor@blueledgers.com** ซึ่งเปิดหน้าโมดูลนี้ได้ ดูหมายเหตุข้อ 11); รู้ id ของใบราคาที่มีอยู่จริงใบหนึ่ง
**Steps**
1. Login ด้วยบัญชีนั้น แล้วเปิดเมนู Modules → Vendor Management
2. ไปที่ `/vendor-management/price-list` ตรง ๆ
3. ไปที่ `/vendor-management/price-list/<id ที่มีอยู่จริง>` ตรง ๆ
4. ไปที่ `/vendor-management/price-list/new` ตรง ๆ
**Expected**
เมนู Price List ไม่ปรากฏในรายการที่เข้าได้; ทั้งสาม URL แสดงกล่อง `AccessDeniedBlock` ที่มี `role="alert"` — eyebrow "Restricted", หัวข้อ **"Permission Denied"**, คำอธิบาย "You don't have permission to view this page.", บรรทัด "Contact your administrator to request access." และปุ่ม **"Go to an available page"** ที่พากลับหน้า landing แบบ `replace`; **`/new` และ `/:id` ถูกกั้นด้วยสิทธิ์ `view` ตัวเดียวกัน** เพราะ `findRouteLeaf()` จับ path แบบ prefix

---
## TC-PL-010022 — รายการใบราคาแยกตาม business unit
**Priority:** High · **Test Type:** Security
**Preconditions**
Login เป็น admin@blueledgers.com ที่เป็นสมาชิกอย่างน้อยสอง BU; BU ที่สองมีใบราคาคนละชุดกับ BLAVG (หรือไม่มีเลย); จำเลขที่ใบราคาใบหนึ่งของ BLAVG ไว้
**Steps**
1. ที่ BU = BLAVG เปิด `/vendor-management/price-list` แล้วจดเลขที่ใบแรก
2. สลับ BU จาก BU switcher บน navbar ไปอีก BU หนึ่ง
3. เปิดหน้า list อีกครั้งแล้วค้นด้วยเลขที่ที่จดไว้
4. สลับกลับมาที่ BLAVG
**Expected**
หลังสลับ BU ขึ้น toast `Switched to <ชื่อ BU>` และรายการในตารางเปลี่ยนเป็นของ BU ใหม่ทั้งหมด; ค้นด้วยเลขที่ของ BLAVG ในอีก BU แล้ว **ไม่พบ** (ตารางแสดง empty state) เพราะทุกคำขอยิงไปที่ endpoint ที่มี buCode อยู่ใน path (`/api/proxy/api/config/{buCode}/pricelists`); สลับกลับมาที่ BLAVG แล้วรายการเดิมกลับมาครบ

---
## TC-PL-020004 — โครงหน้า /new — หัวข้อ สถานะเริ่มต้น และปุ่มที่ต้องมี/ไม่มี
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/vendor-management/price-list` แล้วกดปุ่ม **"Add Price List"**
2. อ่านหัวหน้าฟอร์ม แถบปุ่ม และหัวข้อของสองส่วนในฟอร์ม
**Expected**
URL เป็น `/vendor-management/price-list/new`; หัวข้อหน้าแสดงข้อความจาง ๆ ว่า **"e.g. Quotation - Fresh Produce"** (placeholder ของชื่อ) โดย**ไม่มี badge เลขที่ใบ** เพราะเลขที่ยังไม่ถูกออกให้; badge สถานะแสดง **DRAFT**; แถบปุ่มมี **Go back**, **Cancel** และ **Create** เท่านั้น — **ไม่มีปุ่ม Delete และไม่มีปุ่ม Activity** (ทั้งสองผูกกับเงื่อนไข `priceList &&` ใน `pl-form.tsx`); ฟอร์มมีสองส่วนคือ **General** (คำอธิบาย "Vendor, currency, effective period, description and status.") ที่มีช่อง Name*, Vendor*, Currency*, Effective From*, Effective To*, Description, Status และส่วน **Products** ที่มีปุ่ม **Add Item** และกล่องว่าง "No Products Yet" / "Add products to this price list."

---
## TC-PL-020005 — สกุลเงินถูกเติมจากค่าเริ่มต้นของโปรไฟล์โดยฟอร์มยังไม่ dirty
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; โปรไฟล์/BU มีสกุลเงินเริ่มต้นตั้งไว้แล้ว
**Steps**
1. ไปที่ `/vendor-management/price-list/new`
2. อ่านค่าในช่อง Currency โดยยังไม่แตะอะไรเลย
3. กดปุ่ม **Go back** ทันที
**Expected**
ช่อง Currency ถูกเติมสกุลเงินเริ่มต้นของ BU ให้อัตโนมัติ; กด Go back แล้ว **กลับหน้า list ทันทีโดยไม่มีกล่อง "Discard changes?"** — การเติมค่าเริ่มต้นใช้ `form.reset(..., { keepDirtyValues: true })` จึงไม่ทำให้ฟอร์มกลายเป็น dirty (คอมเมนต์ใน `pl-form.tsx` อธิบายไว้ตรง ๆ ว่าเป็นการกัน guard ค้าง)

---
## TC-PL-020006 — เลือกผู้ขายจาก lookup ที่ค้นหาได้และมีเฉพาะผู้ขายที่เปิดใช้งาน
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`; BU มีผู้ขายที่เปิดใช้งานหลายราย และมีผู้ขายที่ปิดใช้งานอย่างน้อย 1 ราย
**Steps**
1. คลิกช่อง **Vendor** (ปุ่มที่เขียนว่า "Select Vendor")
2. พิมพ์บางส่วนของรหัสหรือชื่อผู้ขายลงในช่องค้น
3. เลือกผู้ขายจากรายการ
4. เปิดช่องซ้ำอีกครั้งแล้วมองหาผู้ขายที่ปิดใช้งาน
**Expected**
ช่องเป็น combobox แบบ popover ที่มีช่องค้นในตัว; แต่ละรายการแสดง **badge รหัสผู้ขาย + ชื่อ** และค้นได้ทั้งจากรหัสและชื่อ (ค้นฝั่ง server); เลือกแล้วปุ่มแสดงเป็น `"<รหัส> - <ชื่อ>"`; **ผู้ขายที่ `is_active = false` ไม่ปรากฏในรายการเลย**; รายการโหลดเพิ่มทีละชุดเมื่อเลื่อนลง (perpage 30)

---
## TC-PL-020007 — ปฏิทิน Effective To ปิดวันที่ก่อน Effective From
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`
**Steps**
1. เปิดปฏิทินของ **Effective From** แล้วเลือกวันที่หนึ่ง (เช่นวันที่ 15 ของเดือนปัจจุบัน)
2. เปิดปฏิทินของ **Effective To**
3. พยายามคลิกวันที่ก่อนหน้าวันที่ที่เลือกไว้ในข้อ 1
4. เลือกวันที่หลังจากนั้นแทน แล้วกดปุ่มกากบาทท้ายช่อง Effective From
**Expected**
ทั้งสองช่องเป็นปุ่มเปิดปฏิทินที่ขึ้นข้อความ **"Pick a date"** เมื่อยังไม่มีค่า และเปลี่ยนเป็นวันที่ตามรูปแบบของโปรไฟล์เมื่อเลือกแล้ว; ในปฏิทินของ Effective To วันก่อนหน้า Effective From **ถูก disable กดไม่ได้** (`fromDate={watchedFrom}` ใน `pl-general-card.tsx`); เลือกวันที่ถูกต้องแล้วปุ่มแสดงวันนั้นและมีปุ่มกากบาท (aria-label "Clear") ท้ายช่องสำหรับล้างค่า

---
## TC-PL-020008 — กด Add Item แล้วแถวใหม่ถูกวางบนสุด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และเพิ่มแถวสินค้าไว้แล้ว 1 แถวที่เลือกสินค้าเรียบร้อย
**Steps**
1. อ่านจำนวนที่แสดงข้างหัวข้อ **Products**
2. กดปุ่ม **Add Item**
3. อ่านลำดับแถวและค่าตั้งต้นของแถวใหม่
**Expected**
จำนวนข้างหัวข้อ Products เพิ่มขึ้นหนึ่ง; **แถวใหม่ถูกวางไว้บนสุดของตาราง** (ใช้ `prepend` ไม่ใช่ append) และแถวที่กรอกไว้เดิมเลื่อนลงมาพร้อมค่าเดิมครบ **ไม่มีค่าค้างสลับแถว** (ตารางตั้ง `getRowId` จาก id ของ field array จึง remount ถูกแถว); แถวใหม่มี MOQ = 0, Price = 0, Lead Time = 0, ช่องเลือกสินค้า/หน่วย/Tax Profile ว่าง และ checkbox Preferred ไม่ถูกติ๊ก

---
## TC-PL-020009 — เลือกสินค้าแล้วหน่วยนับถูกเลือกให้อัตโนมัติจากหน่วยของสินค้านั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกด Add Item ไว้ 1 แถว; มีสินค้าที่ตั้งหน่วยไว้มากกว่าหนึ่งหน่วย
**Steps**
1. เปิดช่อง **Unit** ของแถวนั้น **ก่อน** เลือกสินค้า
2. เลือกสินค้าจากช่อง Product
3. อ่านค่าในช่อง Unit อีกครั้ง แล้วเปิดดูรายการหน่วยที่เลือกได้
**Expected**
ก่อนเลือกสินค้า ช่อง Unit เปิดได้แต่**ไม่มีตัวเลือกให้เลือก**; หลังเลือกสินค้าแล้ว **หน่วยแรกของสินค้านั้นถูกเลือกให้อัตโนมัติ** (`LookupProductUnit` เรียก `onValueChange(units[0].id)` เมื่อค่าเดิมว่างหรือไม่ตรงกับหน่วยของสินค้า) และรายการในช่องมีเฉพาะหน่วยที่สินค้าชิ้นนั้นรองรับ; เปลี่ยนสินค้าเป็นอีกชิ้นแล้วหน่วยถูกตั้งใหม่ตามสินค้าใหม่ ไม่ค้างหน่วยของสินค้าเดิม

---
## TC-PL-020010 — เลือก Tax Profile แล้ว PWT / Tax / Amount คำนวณใหม่ทันที
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และมีแถวสินค้าที่เลือกสินค้าและหน่วยแล้ว; BU มี tax profile ที่เปิดใช้งานและอัตราไม่ใช่ 0 (เช่น VAT 7%)
**Steps**
1. กรอกช่อง **Price** ของแถวนั้นเป็น `107`
2. อ่านค่าในคอลัมน์ **PWT** และ **Amount** ก่อนเลือก Tax Profile
3. เลือก Tax Profile ที่อัตรา 7%
4. อ่านค่าในคอลัมน์ PWT และ Amount อีกครั้ง
**Expected**
ก่อนเลือก Tax Profile อัตราภาษีเป็น 0 ดังนั้น **PWT = 107.00** และ **Amount = 107.00**; หลังเลือกโปรไฟล์ 7% ค่าถูกคำนวณใหม่ทันทีโดยไม่ต้องกดอะไรอีก เป็น **PWT = 100.00** และ **Amount = 107.00** (ราคาที่กรอกคือราคารวมภาษี — ดูหมายเหตุข้อ 12); รายการใน Tax Profile มีเฉพาะโปรไฟล์ที่ `is_active`; **หมายเหตุสำหรับผู้เขียนสเปก:** BU นี้ยังมี tax profile ชื่อ `<script>alert('xss-e2e')</script>` ค้างจากเทสความปลอดภัย ให้เจาะเลือกด้วยชื่อที่แน่นอน อย่าใช้ regex กว้าง (ดูคอมเมนต์ใน `selectFirstTaxProfile()` ของ page object)

---
## TC-PL-020011 — เลือกสินค้าซ้ำกับแถวอื่นต้องยืนยันในกล่อง Duplicate product
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และมีแถวสินค้าที่เลือกสินค้า A ไว้แล้ว 1 แถว
**Steps**
1. กด **Add Item** เพื่อเพิ่มแถวที่สอง
2. เลือกสินค้า **A** ตัวเดิมในแถวที่สอง
3. กด **Cancel** ในกล่องที่เด้งขึ้น แล้วอ่านค่าในแถวที่สอง
4. เลือกสินค้า A อีกครั้ง แล้วกดยืนยัน
**Expected**
กล่องยืนยันเด้งขึ้นหัวข้อ **"Duplicate product"** พร้อมข้อความ `"<ชื่อสินค้า>" is already in this list. Add it again?` และปุ่มสองปุ่มคือ **Cancel** กับ **"Add anyway"**; กด Cancel แล้ว **ช่องสินค้าของแถวที่สองยังว่างเหมือนเดิม** (ค่าใหม่ยังไม่ถูก apply เลย ไม่ใช่การย้อนค่า); กด "Add anyway" แล้วแถวที่สองได้สินค้า A และทั้งสองแถวอยู่ในตารางพร้อมกัน — นี่คือวิธีสร้าง MOQ tier หลายชั้นของสินค้าเดียวกัน

---
## TC-PL-020012 — ลบแถวสินค้าในฟอร์มต้องยืนยันในกล่อง Remove Product
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และมีแถวสินค้าอยู่ 2 แถวที่กรอกค่าต่างกัน
**Steps**
1. กดปุ่มถังขยะท้ายแถวแรก
2. กด **Cancel** ในกล่องที่เด้งขึ้น
3. กดปุ่มถังขยะท้ายแถวแรกอีกครั้ง แล้วกด **Delete**
**Expected**
กล่องยืนยันมีหัวข้อ **"Remove Product"** และคำอธิบาย "Are you sure you want to remove this product?"; กด Cancel แล้วยังมีสองแถวครบและค่าไม่เปลี่ยน; กด Delete แล้วเหลือแถวเดียวคือแถวที่สอง **พร้อมค่าเดิมของมันเอง ไม่ใช่ค่าของแถวที่ถูกลบ** และจำนวนข้างหัวข้อ Products ลดลงหนึ่ง

---
## TC-PL-020013 — สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของใบใหม่พร้อมเลขที่ที่ระบบออกให้
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่เปิดใช้งาน, สินค้า และ tax profile ที่เปิดใช้งานอย่างละอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/vendor-management/price-list/new`
2. กรอก Name ด้วยชื่อที่ไม่ซ้ำ เลือก Vendor เลือก Effective From และ Effective To
3. กด Add Item แล้วเลือก Product, ปล่อยให้ Unit ถูกเลือกอัตโนมัติ, กรอก MOQ และ Price, เลือก Tax Profile
4. กดปุ่ม **Create**
5. อ่าน URL หัวหน้า และกดปุ่ม Back ของเบราว์เซอร์หนึ่งครั้ง
**Expected**
ขึ้น toast **"Price List created successfully"**; หน้าเปลี่ยนไปที่ `/vendor-management/price-list/<id ใหม่>` ในโหมด **view** โดยหัวข้อเป็นชื่อที่กรอกและมี **badge เลขที่ใบที่ระบบออกให้** (`· <No.>`) ต่อท้าย พร้อม badge สถานะ DRAFT; กด Back ของเบราว์เซอร์แล้ว **ไม่ย้อนกลับไปที่ `/new`** เพราะ navigate ใช้ `replace: true`; กลับไปที่หน้า list แล้วใบใหม่ปรากฏในตาราง

---
## TC-PL-020014 — Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`
**Steps**
1. กรอก Name บางส่วน
2. กดปุ่ม **Cancel**
3. กด **"Keep editing"** ในกล่องที่เด้งขึ้น
4. กด Cancel ซ้ำแล้วกด **Discard**
**Expected**
กล่อง "Discard changes?" เด้งขึ้นพร้อมข้อความ "You have unsaved changes that will be lost." และปุ่ม **Keep editing** / **Discard**; กด Keep editing แล้วยังอยู่ที่ `/new` พร้อมข้อความที่กรอกไว้ครบ; กด Discard แล้วกลับไปที่ `/vendor-management/price-list` และไม่มีใบราคาใหม่ถูกสร้าง

---
## TC-PL-020015 — กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกรอกข้อมูลไว้บางส่วนแล้ว
**Steps**
1. คลิกเมนูอื่นใน sidebar (เช่น Vendor)
2. กด **Keep editing** ในกล่องที่เด้งขึ้น
3. คลิกเมนูเดิมซ้ำแล้วกด **Discard**
**Expected**
การคลิกลิงก์นอกฟอร์มถูกดักด้วย `useNavigationGuard` และเด้งกล่อง "Discard changes?" เหมือนปุ่ม Cancel; กด Keep editing แล้วยังอยู่ที่ `/new` พร้อมค่าที่กรอกไว้ และ **URL ไม่เปลี่ยนเป็นเมนูปลายทางแม้ชั่วขณะ**; กด Discard แล้วจึงไปหน้าปลายทางนั้น

---
## TC-PL-020016 — สร้างใบราคาที่ยังไม่มีสินค้าเลย
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่เปิดใช้งานอย่างน้อย 1 ราย
**Steps**
1. ไปที่ `/vendor-management/price-list/new`
2. กรอก Name, เลือก Vendor, เลือก Effective From และ Effective To **โดยไม่กด Add Item เลย**
3. กด **Create**
4. อ่านหน้าที่ปลายทาง
**Expected**
บันทึกสำเร็จ — `pricelist_detail` ไม่มี `add` เลยใน payload (`submitCreate()` ใส่ `add` เฉพาะเมื่อมีแถว) และ schema ยอมรับ array ว่าง; ขึ้น toast "Price List created successfully" และไปที่หน้ารายละเอียดของใบใหม่ ซึ่งส่วน Products แสดงจำนวน **0** พร้อมกล่อง **"No Products Yet"** / "Add products to this price list."; **หมายเหตุ:** นี่คือขั้นเตรียมใบเปล่าก่อนส่งให้ vendor กรอก — การส่งลิงก์ให้ vendor อยู่ที่โมดูล Request Price List (`CAM`) ไม่ใช่ที่นี่

---
## TC-PL-030006 — หน้ารายละเอียดโหมด view แสดงข้อมูลครบและแก้ไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบราคาที่กรอกข้อมูลครบ (ผู้ขาย สกุลเงิน ช่วงวันที่ คำอธิบาย และสินค้าอย่างน้อย 1 รายการ)
**Steps**
1. เปิดใบราคานั้นจากหน้า list โดยคลิกค่าในคอลัมน์ **No.**
2. อ่านหัวหน้า แถบปุ่ม และส่วน General
3. พยายามพิมพ์ลงในช่อง Name และพยายามเปิดช่อง Vendor
**Expected**
หัวหน้าแสดงชื่อใบราคา, badge `· <เลขที่ใบ>` และป้ายสถานะแบบตัวพิมพ์ใหญ่โทนจาง; แถบปุ่มมี **Edit · Delete · Activity** (ไม่มี Cancel/Save); ส่วน General แสดงค่าเป็น **ข้อความอ่านอย่างเดียว** ทุกช่อง — Name, ชื่อผู้ขาย, รหัสสกุลเงิน, วันที่มีผลในรูปแบบของโปรไฟล์, คำอธิบายแบบคงการขึ้นบรรทัด และสถานะเป็นไอคอน+ป้าย — **ไม่มี `<input>`, `<textarea>` หรือ combobox ของช่องเหล่านี้อยู่ใน DOM เลย** (สาขา `isView` ใน `pl-general-card.tsx` render `FieldPlainText`); พิมพ์อะไรไม่ได้และเปิดช่อง Vendor ไม่ได้

---
## TC-PL-030007 — ตารางสินค้าโหมด view จัดกลุ่มตามสินค้าและเรียง tier ตาม MOQ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่มีสินค้า A สามแถวที่ MOQ ต่างกัน (เช่น 100, 1, 50) และสินค้า B อีกหนึ่งแถว
**Steps**
1. เปิดใบราคานั้นในโหมด view
2. อ่านคอลัมน์แรก (#) และคอลัมน์ Product
3. อ่านลำดับของสามแถวของสินค้า A
**Expected**
สินค้า A ถูกยุบเป็น **กลุ่มเดียว**: เลขลำดับและชื่อสินค้าแสดงเพียงครั้งเดียวโดยเซลล์กิน `rowspan` เท่าจำนวน tier และจัดกึ่งกลางแนวตั้ง ส่วนสินค้า B เป็นกลุ่มที่สอง (ลำดับ 2); สาม tier ของสินค้า A เรียง **MOQ จากน้อยไปมาก (1 → 50 → 100)** ไม่ใช่ตามลำดับที่บันทึก; ไม่มีเส้นคั่นระหว่าง tier ภายในกลุ่ม มีเฉพาะเส้นคั่นระหว่างกลุ่ม; ชื่อสินค้าแสดงชื่อหลักพร้อมบรรทัดรอง (ชื่อท้องถิ่น ถ้าไม่มีจึงใช้รหัสสินค้า)

---
## TC-PL-030008 — คอลัมน์และค่าที่แสดงในตารางสินค้าโหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่มีสินค้าอย่างน้อย 1 แถวที่ตั้ง MOQ, หน่วย, lead time, ราคา และ tax profile ครบ
**Steps**
1. เปิดใบราคานั้นในโหมด view
2. อ่านหัวตารางส่วน Products
3. อ่านค่าที่แสดงในแถวแรก
**Expected**
หัวตารางมีเจ็ดช่องตามลำดับ **# · Product · MOQ · PWT · Tax · Amount · Note**; ช่อง MOQ แสดงเป็น `<จำนวน>+ <ชื่อหน่วย>` ตามด้วย lead time แบบ `· <n>d` ในบรรทัดเดียวกัน; **PWT / Tax / Amount แสดงทศนิยมสองตำแหน่งเสมอ** โดย Amount = ราคารวมภาษีที่บันทึกไว้, PWT = ราคาก่อนภาษีที่บันทึกไว้ และ Tax = ผลต่างของสองค่านั้น (อ่านจากค่าที่เก็บไว้ ไม่ได้คำนวณใหม่จากอัตรา); ช่อง Note แสดง "—" เมื่อไม่มีหมายเหตุ; **ตารางโหมดนี้ไม่มีคอลัมน์ Unit, Tax Profile, Preferred แยกต่างหาก และไม่มีปุ่มลบ**

---
## TC-PL-030009 — tier ที่ถูกตั้งเป็น preferred แสดงไอคอนมงกุฎ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่มีสินค้าอย่างน้อยสองแถว โดยติ๊ก Preferred ไว้หนึ่งแถว (ติ๊กจากโหมดแก้ไข)
**Steps**
1. เปิดใบราคานั้นในโหมด view
2. อ่านช่อง MOQ ของทั้งสองแถว
3. กด Edit แล้วอ่านคอลัมน์ Preferred ของสองแถวเดียวกัน
**Expected**
ในโหมด view แถวที่ตั้ง preferred มี **ไอคอนมงกุฎ (`aria-label="preferred"`)** นำหน้าค่า MOQ ส่วนแถวที่ไม่ได้ตั้งไม่มีไอคอน; ในโหมดแก้ไข คอลัมน์ **Preferred** ของแถวนั้นมี checkbox ที่ถูกติ๊ก (`aria-label="preferred"`) ส่วนอีกแถวไม่ถูกติ๊ก — สถานะตรงกันทั้งสองโหมด

---
## TC-PL-030010 — deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; รู้ id ของใบราคาที่มีอยู่จริงใน BU
**Steps**
1. เปิด `/vendor-management/price-list/<id>` ตรง ๆ จากแถบที่อยู่ (ไม่ผ่านหน้า list)
2. อ่านแถบปุ่มและสถานะของช่องต่าง ๆ
3. กดปุ่ม **Go back**
**Expected**
หน้าเปิดในโหมด **view** (ปุ่ม Edit/Delete/Activity, ช่องเป็นข้อความอ่านอย่างเดียว) — `useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่ mount เมื่อมี entity; กด Go back แล้ว **ไปที่ `/vendor-management/price-list` ตรง ๆ ในครั้งเดียว** ไม่ใช่ถอย history (`handleBack` เรียก `backToList()` เสมอเมื่ออยู่โหมด view)

---
## TC-PL-030011 — ระหว่างรอข้อมูลของหน้ารายละเอียดแสดง skeleton ของฟอร์ม
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; รู้ id ของใบราคาที่มีอยู่จริง; สามารถหน่วงคำขอ `GET …/pricelists/<id>` ได้ (เช่น network throttling หรือ route interception)
**Steps**
1. หน่วงคำขอรายละเอียดใบราคาไว้
2. เปิด `/vendor-management/price-list/<id>`
3. สังเกตหน้าจอระหว่างรอ แล้วปล่อยให้คำขอเสร็จ
**Expected**
ระหว่างรอแสดง **skeleton ของฟอร์ม** (`FormSkeleton`) ไม่ใช่หน้าขาวและไม่ใช่ฟอร์มเปล่าที่ค่าโผล่ทีหลัง; เมื่อข้อมูลมาถึง skeleton ถูกแทนที่ด้วยฟอร์มโหมด view ที่มีค่าครบ; ถ้าคำขอล้มเหลวจะแสดง `ErrorState` พร้อมปุ่มลองใหม่และปุ่มกลับไปที่ `/vendor-management/price-list`

---
## TC-PL-030012 — เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่เคยถูกแก้ไขอย่างน้อยหนึ่งครั้ง
**Steps**
1. เปิดใบราคานั้นในโหมด view แล้วกดปุ่ม **Activity**
2. อ่านหัวข้อของแผงที่เปิดขึ้น
3. ปิดแผง กด **Edit** แล้วอ่านแถบปุ่มอีกครั้ง
**Expected**
แผง Activity เปิดขึ้นโดยอ้างอิงใบราคาด้วยเลขที่ใบ และ URL ไม่เปลี่ยน; **ปุ่ม Activity ยังอยู่ในโหมดแก้ไขด้วย** — มันถูกวางไว้นอก ternary ของโหมดโดยตั้งใจ (คอมเมนต์ใน `pl-form.tsx` ระบุว่า "เป็นการดู ไม่ใช่การแก้") ต่างจากปุ่ม Edit ที่หายไปเมื่อเข้าโหมดแก้ไข

---
## TC-PL-030013 — ใบราคาที่ vendor ส่งกลับจากพอร์ทัลเปิดดูฝั่งภายในได้ครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบราคาที่ถูกส่งให้ vendor ผ่านพอร์ทัลภายนอกและ vendor กด Submit ราคากลับมาแล้ว (เตรียมผ่านโมดูล Request Price List + หน้า `/pl/:url_token` — **การทดสอบฝั่งพอร์ทัลเป็นของ `docs/test-cases/1002-external-price-list.md` เคสนี้เริ่มนับจากตอนที่ vendor ส่งกลับมาแล้ว**); Login เป็น admin@blueledgers.com ที่ BU เดียวกัน
**Steps**
1. ไปที่ `/vendor-management/price-list` แล้วกรองสถานะ **Submitted**
2. เปิดใบที่ vendor เพิ่งส่งกลับ
3. เทียบราคา, MOQ tier, หน่วย และ tax profile ของแต่ละแถวกับที่ vendor กรอกในพอร์ทัล
**Expected**
ใบนั้นปรากฏในหน้า list ฝั่งภายในโดยมีสถานะ **SUBMITTED**; หน้ารายละเอียดแสดงราคาที่ vendor กรอกครบทุกแถว โดยราคาที่ vendor กรอกเป็น **ราคารวมภาษี** และคอลัมน์ PWT/Tax ฝั่งภายในคำนวณจากสูตรเดียวกับพอร์ทัล; **MOQ tier ที่ vendor เพิ่มเข้ามาในพอร์ทัลปรากฏเป็น tier ภายใต้กลุ่มสินค้าเดียวกัน** (ไม่ใช่สินค้าคนละรายการ) เพราะ tier ถูกบันทึกเป็น `pricelist_detail` แถวใหม่ที่ `product_id` เดิม แล้ว `buildProductGroups()` จับกลุ่มด้วย `product_id`; ผู้ใช้ภายในแก้ไขใบนี้ต่อได้ตามปกติ (ปุ่ม Edit ยังอยู่)

---
## TC-PL-040003 — กด Edit แล้วเข้าโหมดแก้ไขทั้งส่วนหัวและตารางสินค้า
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้ารายละเอียดของใบราคาที่มีสินค้าอย่างน้อย 1 แถว ในโหมด view
**Steps**
1. กดปุ่ม **Edit**
2. อ่านแถบปุ่มและส่วน General
3. อ่านตารางส่วน Products
**Expected**
URL **ไม่เปลี่ยน** (โหมดเป็น state ในหน้าเดียวกัน ไม่มี `/edit` แยก); แถบปุ่มเปลี่ยนเป็น **Cancel · Save · Delete · Activity** และปุ่ม Edit หายไป; ส่วน General กลับมาเป็นช่องกรอกได้ทั้งหมดพร้อมเครื่องหมาย `*` ที่ Name, Vendor, Currency, Effective From, Effective To; ส่วน Products เปลี่ยนจากตารางจัดกลุ่มแบบอ่านอย่างเดียวเป็น **DataGrid ที่แก้ไขได้** โดยแต่ละแถวเป็นหนึ่ง `pricelist_detail` (สินค้าที่มีหลาย tier จะเห็นเป็นหลายแถวแยกกัน ไม่ถูกยุบกลุ่มแล้ว) และปุ่ม **Add Item** โผล่ที่หัวข้อ Products

---
## TC-PL-040004 — คอลัมน์ของตารางสินค้าในโหมดแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ในโหมดแก้ไขของใบราคาที่มีสินค้าอย่างน้อย 1 แถว
**Steps**
1. อ่านหัวตารางส่วน Products
2. อ่านชนิดของ control ในแต่ละเซลล์ของแถวแรก
**Expected**
หัวตารางมีสิบเอ็ดช่องตามลำดับ **# · Product · Unit · MOQ · Price · Tax Profile · PWT · Lead Time · Amount · Preferred · (คอลัมน์ปุ่มลบ ไม่มีหัวข้อ)**; Product เป็น lookup แบบ popover, Unit และ Tax Profile เป็น Radix Select (`role="combobox"`), MOQ / Price / Lead Time เป็น `<input type="number">`, Preferred เป็น checkbox, ส่วน **PWT และ Amount เป็นข้อความคำนวณให้ แก้ไม่ได้**; ปุ่มท้ายแถวเป็นปุ่มถังขยะที่มี `aria-label` = "Remove product"

---
## TC-PL-040005 — เพิ่มสินค้าใหม่ในโหมดแก้ไขแล้วค่าคงอยู่หลังโหลดใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้และมีสินค้าอยู่แล้ว 1 แถว; มีสินค้าอีกชิ้นที่ยังไม่อยู่ในใบ
**Steps**
1. เปิดใบนั้นแล้วกด **Edit**
2. กด **Add Item** แล้วเลือกสินค้าชิ้นใหม่ กรอก MOQ, Price, Lead Time และเลือก Tax Profile
3. กด **Save**
4. โหลดหน้าซ้ำ (F5) แล้วอ่านตารางสินค้า
**Expected**
ขึ้น toast **"Price List updated successfully"** และหน้ากลับเป็นโหมด view เอง; หลังโหลดซ้ำ ตารางโหมด view มีสองกลุ่มสินค้าและค่า MOQ / PWT / Amount / lead time ของแถวใหม่ตรงกับที่กรอก; payload ที่ส่งเป็น PATCH ที่มี `pricelist_detail.add` เฉพาะแถวที่ยังไม่มี id (`buildItemChanges()`) — แถวเดิมที่ไม่ได้แก้ต้องไม่ถูกส่งซ้ำใน `update`

---
## TC-PL-040006 — แก้ราคาและ lead time ของแถวเดิมแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้และมีสินค้าอย่างน้อย 1 แถวที่ตั้งราคาไว้แล้ว
**Steps**
1. เปิดใบนั้นแล้วกด **Edit**
2. แก้ค่าในช่อง **Price** ของแถวแรกเป็นค่าที่ต่างจากเดิม และแก้ **Lead Time**
3. อ่านคอลัมน์ PWT และ Amount ก่อนกด Save
4. กด **Save** แล้วโหลดหน้าซ้ำ
**Expected**
PWT และ Amount อัปเดตตามราคาใหม่ทันทีตั้งแต่ก่อนกด Save; หลังบันทึกขึ้น toast "Price List updated successfully" และกลับโหมด view; หลังโหลดซ้ำค่าที่แสดงคือค่าใหม่ทั้ง Amount, PWT, Tax และ lead time; payload เป็น PATCH ที่มี `doc_version` ของใบนั้นและมี `pricelist_detail.update` เฉพาะแถวที่ค่าจริงเปลี่ยน

---
## TC-PL-040007 — ลบแถวสินค้าเดิมแล้วหายจริงหลังโหลดใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้และมีสินค้าสองแถวที่คนละสินค้า
**Steps**
1. เปิดใบนั้นแล้วกด **Edit**
2. กดปุ่มถังขยะท้ายแถวแรก แล้วยืนยัน **Delete** ในกล่อง "Remove Product"
3. กด **Save**
4. โหลดหน้าซ้ำแล้วอ่านตารางสินค้า
**Expected**
หลังยืนยันในกล่อง แถวหายจากตารางทันทีและจำนวนข้างหัวข้อ Products ลดลง แต่ยังไม่ถูกบันทึกจนกว่าจะกด Save; หลัง Save ขึ้น toast "Price List updated successfully"; หลังโหลดซ้ำเหลือสินค้าเพียงกลุ่มเดียว; payload มี `pricelist_detail.remove` ที่อ้าง id ของแถวที่ถูกลบ

---
## TC-PL-040008 — แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดแถวซ้ำ
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้
**Steps**
1. เปิดใบนั้น กด **Edit** เพิ่มสินค้าใหม่หนึ่งแถว แล้วกด **Save**
2. **อยู่ที่หน้าเดิม** ไม่ต้องโหลดซ้ำ กด **Edit** อีกครั้ง
3. แก้ราคาแถวใดแถวหนึ่งแล้วกด **Save** อีกครั้ง
4. โหลดหน้าซ้ำแล้วนับจำนวนแถวสินค้า
**Expected**
หลังบันทึกรอบที่สอง จำนวนแถวสินค้า **เท่าเดิม ไม่เพิ่มเป็นสองเท่า** — แถวที่เพิ่งเพิ่มในรอบแรกต้องไม่ถูกส่งเป็น `add` ซ้ำในรอบที่สอง (`pl-form.tsx` sync ฟอร์มกับ `priceList` ที่ refetch มาใหม่โดย key ที่ลายเซ็นของ id ทุกแถว ดู `detailIdsKey`); ราคาที่แก้ในรอบที่สองถูกบันทึกถูกต้อง และไม่มีแถวใดหายไป

---
## TC-PL-040009 — ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้ารายละเอียดของใบราคาที่มีชื่อและคำอธิบายอยู่แล้ว
**Steps**
1. กด **Edit** แล้วแก้ช่อง Name เป็นข้อความอื่น และแก้ราคาแถวแรก
2. กด **Cancel**
3. กด **Discard** ในกล่องที่เด้งขึ้น
4. อ่านค่าที่แสดงบนหน้าจอ แล้วกด Edit อีกครั้งเพื่อดูค่าในช่อง
**Expected**
กล่อง "Discard changes?" เด้งขึ้น; กด Discard แล้ว **ยังอยู่ที่หน้ารายละเอียดใบเดิม** (ไม่เด้งกลับ list) และกลับเป็นโหมด view; **ค่าที่แสดงคือค่าเดิมก่อนแก้ ไม่ใช่ค่าที่เพิ่งยกเลิกไป** — ทั้งบนหน้าจอและในช่องกรอกเมื่อกด Edit ซ้ำ (`handleCancel` reset ด้วย `keepFieldsRef: true` เพื่อเขียนค่ากลับลง DOM จริง)

---
## TC-PL-040010 — เปลี่ยนสถานะใบราคาเป็น Active เพื่อเปิดใช้งานราคา
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาสถานะ **Draft** หรือ **Submitted** ที่สร้างไว้สำหรับเทสนี้ และมีสินค้าอย่างน้อย 1 แถวพร้อมราคา
**Steps**
1. เปิดใบนั้นแล้วกด **Edit**
2. เปิดช่อง **Status** แล้วอ่านตัวเลือกทั้งหมด
3. เลือก **Active** แล้วกด **Save**
4. กลับไปหน้า list แล้วกรองสถานะ Active
**Expected**
ช่อง Status มีสี่ตัวเลือก **Draft · Submitted · Active · Inactive** โดยแต่ละตัวมีไอคอนสถานะกำกับ และ **ไม่มีตัวเลือก "Expired"**; เลือก Active แล้ว badge สถานะบนหัวหน้าเปลี่ยนเป็น ACTIVE ตั้งแต่ก่อนกด Save (ผูกกับ `useWatch`); หลัง Save ขึ้น toast **"Price List updated successfully"** และกลับโหมด view; ใบนั้นปรากฏเมื่อกรองสถานะ Active ในหน้า list; **หมายเหตุเชิงผลิตภัณฑ์:** ไม่มีปุ่ม Approve / ขั้นอนุมัติใด ๆ — การ "เปิดใช้งานราคา" คือการแก้ฟิลด์ Status ธรรมดาที่ใครก็ตามที่แก้ใบนี้ได้ทำได้ (ดูหมายเหตุข้อ 5)

---
## TC-PL-040011 — ปิดใช้งานใบราคา (Inactive) แล้วสถานะเปลี่ยนทุกหน้าจอ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาสถานะ Active ที่สร้างไว้สำหรับเทสนี้
**Steps**
1. เปิดใบนั้น กด **Edit** เลือก Status = **Inactive** แล้วกด **Save**
2. กลับไปหน้า list แล้วค้นหาใบนั้น
3. สลับไปมุมมองการ์ดแล้วอ่าน badge บนการ์ดใบเดียวกัน
**Expected**
หลังบันทึก badge บนหัวหน้ารายละเอียดเป็น **INACTIVE**; คอลัมน์ Status ในตารางเป็น INACTIVE ด้วยไอคอนโทนกลาง; badge บนการ์ดในมุมมองกริดก็เป็น INACTIVE เช่นกัน — ทั้งสามจุดใช้ `StatusIconLabel` ชุดเดียวกันจึงต้องตรงกันหมด; กรองสถานะ Active แล้วใบนี้ไม่อยู่ในผลลัพธ์อีก

---
## TC-PL-040012 — กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้ารายละเอียดใบราคาหนึ่ง (เดินทางมาจากหน้า list)
**Steps**
1. กด **Edit** แล้วแก้ค่าช่องใดช่องหนึ่ง
2. กดปุ่ม Back ของเบราว์เซอร์
3. กด **Keep editing**
4. กด Back อีกครั้งแล้วกด **Discard**
**Expected**
การกด Back ถูกดักด้วย `useNavigationGuard` และเด้งกล่อง "Discard changes?"; กด Keep editing แล้ว **ยังอยู่ที่หน้ารายละเอียดใบเดิมในโหมดแก้ไข พร้อมค่าที่แก้ไว้ และ URL ไม่เปลี่ยน**; กด Discard แล้วจึงย้อนกลับไปหน้าก่อนหน้า

---
## TC-PL-040013 — ปุ่มบันทึกเปลี่ยนป้ายและถูก disable ระหว่างกำลังบันทึก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; สามารถหน่วงคำขอ PATCH/POST ของ pricelists ได้
**Steps**
1. เปิดใบราคาหนึ่ง กด **Edit** แก้ค่าแล้วหน่วงคำขอ PATCH ไว้
2. กดปุ่ม **Save** แล้วอ่านป้ายและสถานะของปุ่ม Save กับปุ่ม Cancel ระหว่างรอ
3. ทำซ้ำที่ฟอร์มสร้าง `/new` แล้วอ่านป้ายปุ่ม Create
**Expected**
ระหว่างรอ ปุ่มบันทึกเปลี่ยนป้ายเป็น **"Saving..."** ในโหมดแก้ไข และ **"Creating..."** ในโหมดสร้าง (`getSubmitLabel`) และทั้งปุ่มบันทึกกับปุ่ม Cancel ถูก `disabled` กดซ้ำไม่ได้; ปุ่ม Delete บนหัวหน้าก็ถูก disable ด้วยในช่วงนั้น; เมื่อคำขอเสร็จ ป้ายกลับเป็น "Save" / "Create" และปุ่มใช้งานได้ตามปกติ

---
## TC-PL-060004 — ส่งออกรายการใบราคาเป็นไฟล์ XLSX ที่มีหกคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบราคาอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/vendor-management/price-list`
2. กดปุ่ม **Export** แล้วรอไฟล์ถูกดาวน์โหลด
3. เปิดไฟล์แล้วอ่านชื่อชีตและหัวคอลัมน์
**Expected**
ไฟล์ถูกดาวน์โหลดจริง (จับด้วย download event ไม่ใช่แค่กดปุ่ม) ชื่อไฟล์ขึ้นต้นด้วย **`price-list`** และนามสกุล `.xlsx`; ชีตชื่อ **"Price Lists"**; หัวคอลัมน์หกช่องตามลำดับ **No. · Name · Vendor · Effective Period · Status · Description**; ค่าในคอลัมน์ Status เป็นป้ายภาษาเดียวกับที่ตารางแสดง ไม่ใช่ค่าดิบ; ขึ้น toast **"Exported <จำนวน> records"**

---
## TC-PL-060005 — ส่งออกขณะมีตัวกรองอยู่ และกรณีไม่มีข้อมูลให้ส่งออก
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; BU มีใบราคาหลายสถานะ
**Steps**
1. ตั้งตัวกรองให้ตารางเหลือผลลัพธ์จำนวนน้อยที่นับได้ แล้วกด **Export**
2. เทียบจำนวนที่ toast บอกกับจำนวนแถวที่ตารางแสดง
3. ค้นด้วยคำที่ไม่มีอยู่จริงจนตารางว่าง แล้วกด **Export** อีกครั้ง
**Expected**
การส่งออกใช้ `queryParams` ชุดเดียวกับตาราง (รวม `search` และ `filter`) ดังนั้นจำนวนที่ toast "Exported N records" บอกต้องตรงกับผลลัพธ์ที่ถูกกรองอยู่ ไม่ใช่ทั้ง BU; เมื่อไม่มีข้อมูลให้ส่งออก **ไม่มีไฟล์ถูกดาวน์โหลด** และขึ้น toast แบบเตือนว่า **"No data to export"**; ถ้าคำขอล้มเหลวจะขึ้น toast ข้อผิดพลาดจาก `useExportErrorToast` แทน

---
## TC-PL-060006 — ปุ่ม Export เปลี่ยนป้ายและถูก disable ระหว่างส่งออก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า list; สามารถหน่วงคำขอรายการใบราคาได้
**Steps**
1. หน่วงคำขอที่ใช้ดึงข้อมูลสำหรับ export
2. กดปุ่ม **Export** แล้วอ่านป้ายและสถานะของปุ่มระหว่างรอ
3. ย่อหน้าจอเป็นขนาดมือถือแล้วมองหาปุ่ม Export
**Expected**
ระหว่างรอ ปุ่มแสดงสปินเนอร์และป้าย **"Exporting..."** พร้อมถูก `disabled` กดซ้ำไม่ได้ จากนั้นกลับเป็น "Export"; บนหน้าจอมือถือ ปุ่ม Export และ Print ถูกยุบเข้าเมนูสามจุด (aria-label "More actions") โดยรายการ Export ในเมนูก็ถูก disable ระหว่างส่งออกเช่นกัน

---
## TC-PL-070004 — ลบใบราคาจากเมนูในแถวแล้วแถวหายจริง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและจำชื่อไว้
**Steps**
1. ไปที่ `/vendor-management/price-list` แล้วค้นหาใบนั้น
2. เปิดเมนูสามจุดท้ายแถวแล้วกด **Delete**
3. อ่านหัวข้อและคำอธิบายในกล่องยืนยัน
4. กด **Delete** ในกล่อง แล้วค้นหาใบเดิมซ้ำ
**Expected**
กล่องยืนยันมีหัวข้อ **"Delete Price List"** และคำอธิบาย `Are you sure you want to delete price list "<ชื่อใบ>"? This action cannot be undone.` พร้อมปุ่ม Cancel / Delete; หลังยืนยันขึ้น toast **"Price List deleted successfully"**, กล่องปิดเอง, แถวหายจากตารางและจำนวนบน badge หัวหน้าลดลง; ค้นหาชื่อเดิมอีกครั้งแล้วไม่พบ (empty state)

---
## TC-PL-070005 — ลบใบราคาจากหน้ารายละเอียดแล้วเด้งกลับหน้า list
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดใบนั้นในโหมด view แล้วกดปุ่ม **Delete** บนแถบปุ่ม
2. กด **Cancel** ในกล่องที่เด้งขึ้น
3. กด Delete อีกครั้งแล้วยืนยัน
**Expected**
กล่องยืนยันหัวข้อ "Delete Price List" และคำอธิบายที่มีชื่อใบเหมือนกล่องในหน้า list; กด Cancel แล้วยังอยู่ที่หน้ารายละเอียดและใบยังอยู่; ยืนยันแล้วขึ้น toast **"Price List deleted successfully"** และหน้าเปลี่ยนไปที่ `/vendor-management/price-list` โดยใบนั้นหายจากตาราง; ระหว่างลบปุ่มในกล่องถูก disable และป้ายเปลี่ยนเป็นสถานะกำลังลบ

---
## TC-PL-070006 — ลบใบราคาจากปุ่มลบบนการ์ดในมุมมองกริด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบราคาที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; อยู่ที่หน้า list ในมุมมองการ์ด
**Steps**
1. หาการ์ดของใบนั้น แล้วกดปุ่มถังขยะท้ายการ์ด
2. ยืนยันในกล่องที่เด้งขึ้น
**Expected**
กล่องยืนยันเป็นตัวเดียวกับที่มุมมองตารางใช้ (หัวข้อ "Delete Price List" + ชื่อใบในคำอธิบาย); หลังยืนยันขึ้น toast "Price List deleted successfully" และการ์ดหายจากกริด — ปุ่มลบบนการ์ดผ่าน `useDeleteGate()` เหมือนเมนูในแถว จึงคุมสิทธิ์ด้วยกติกาเดียวกัน

---
## TC-PL-070007 — ผู้ใช้ที่ไม่มีสิทธิ์ลบ กดเมนู Delete แล้วเจอกล่องแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีบัญชีที่ **มีสิทธิ์ `vendor_management.price_list.view` แต่ไม่มี `.delete`** และไม่ใช่ admin (ยืนยันที่ `/system-administration/role` — ดูหมายเหตุข้อ 11); มีใบราคาอย่างน้อย 1 รายการใน BU
**Steps**
1. Login ด้วยบัญชีนั้นแล้วไปที่ `/vendor-management/price-list`
2. เปิดเมนูสามจุดท้ายแถวแล้วอ่านรายการ Delete
3. คลิกรายการ Delete
4. สลับไปมุมมองการ์ดแล้วกดปุ่มถังขยะบนการ์ด
**Expected**
รายการ **Delete ยังแสดงอยู่ในเมนูแต่จาง (opacity ลดลง) และมี `aria-disabled="true"`**; คลิกแล้ว **ไม่มีกล่อง "Delete Price List" เปิดขึ้นและไม่มีคำขอลบถูกยิง** — สิ่งที่ขึ้นแทนคือกล่องแจ้งสิทธิ์ (หัวข้อ "Permission Denied" คำอธิบาย "You don't have permission to perform this action."); ปุ่มลบบนการ์ดให้ผลเหมือนกันทุกประการ; ใบราคายังอยู่ครบหลังปิดกล่อง

---
## TC-PL-900010 — บันทึกฟอร์มเปล่าแล้วขึ้นข้อความ required ครบทุกช่องบังคับ
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`; ล้างค่าสกุลเงินที่ถูกเติมอัตโนมัติออกก่อน (ถ้าต้องการตรวจข้อความของ Currency ด้วย)
**Steps**
1. กดปุ่ม **Create** ทันทีโดยไม่กรอกอะไร
2. อ่านข้อความใต้/ข้างช่องที่บังคับ
3. สังเกตว่าหน้าจอเลื่อนไปที่ไหนและ focus อยู่ที่ช่องใด
**Expected**
ฟอร์มไม่ถูก submit — ยังอยู่ที่ `/new`, **ไม่มีคำขอ POST ถูกยิง** และไม่มี toast สำเร็จ; ช่องที่บังคับแสดงสถานะ invalid พร้อมข้อความ **"Name is required"**, **"Vendor is required"**, **"Currency is required"**, **"Start Date is required"**, **"End Date is required"** (จาก `createPriceListSchema` + `validation.required`); หน้าจอเลื่อนไปที่ช่องแรกที่ผิดแบบ smooth และ focus ลงที่ control ของช่องนั้น (`scrollToFirstInvalidField` มองหา `[aria-invalid="true"]`); หลังกรอกครบแล้วกด Create ซ้ำบันทึกได้

---
## TC-PL-900011 — Effective To ก่อน Effective From ถูกบล็อกพร้อมข้อความ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกรอก Name กับ Vendor ไว้แล้ว
**Steps**
1. ตั้ง **Effective To** เป็นวันที่ 10 ของเดือนหนึ่ง (ตั้งช่องนี้ก่อนเพื่อเลี่ยงข้อจำกัดของปฏิทิน)
2. ตั้ง **Effective From** เป็นวันที่ 20 ของเดือนเดียวกัน
3. กด **Create**
4. แก้ Effective To ให้เป็นวันหลัง Effective From แล้วกด Create อีกครั้ง
**Expected**
ครั้งแรกฟอร์มไม่ถูก submit และช่อง **Effective To** แสดงข้อความ **"End date must not be before start date"** (มาจาก `.refine()` ที่ผูก path ไว้ที่ `effective_to_date`); หลังแก้วันที่ให้ถูกต้องแล้วข้อความหายและบันทึกสำเร็จ; **หมายเหตุ:** ลำดับการตั้งค่าตามข้อ 1–2 สำคัญ — ถ้าตั้ง From ก่อน ปฏิทินของ To จะ disable วันก่อนหน้าไว้อยู่แล้ว (ดู `TC-PL-020007`) เส้นทางนี้จึงเป็นทางเดียวที่ทำให้กติกาใน schema ทำงานจากหน้า UI

---
## TC-PL-900012 — แถวสินค้าที่ยังไม่เลือก Product / Unit / Tax Profile บล็อกการบันทึก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกรอกส่วน General ครบแล้ว
**Steps**
1. กด **Add Item** แล้วกด **Create** ทันทีโดยไม่เลือกอะไรในแถว
2. อ่านข้อความของช่อง Product, Unit และ Tax Profile
3. เลือก Product (ซึ่งจะทำให้ Unit ถูกเลือกอัตโนมัติ) แล้วกด Create อีกครั้ง
4. เลือก Tax Profile แล้วกด Create อีกครั้ง
**Expected**
ครั้งแรกฟอร์มไม่ถูก submit และแสดงข้อความ **"Product is required"**, **"Unit is required"** และ **"Tax Profile is required"** ที่ช่องของแถวนั้น; ครั้งที่สองยังติดที่ **"Tax Profile is required"** เพียงตัวเดียว — **ช่องนี้คือสาเหตุที่การสร้างใบราคาดู "เงียบแล้วไม่บันทึก"** (มันเริ่มต้นเป็นค่าว่างเสมอและ `aria-invalid` ขึ้นที่ตัวมันเอง ดู docstring ของ `taxProfileTrigger()` ใน page object); ครั้งที่สามบันทึกสำเร็จ

---
## TC-PL-900013 — MOQ ซ้ำกับ tier เดิมของสินค้าและหน่วยเดียวกันถูกบล็อก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกรอกส่วน General ครบแล้ว
**Steps**
1. เพิ่มแถวสินค้า A: MOQ = 10, Price = 100, เลือกหน่วยและ Tax Profile
2. เพิ่มอีกแถวเป็นสินค้า A ตัวเดิม (ยืนยันในกล่อง Duplicate product) **หน่วยเดียวกัน** MOQ = 10, Price = 90
3. กด **Create**
4. แก้ MOQ ของแถวที่สองเป็น 20 แล้วกด Create อีกครั้ง
**Expected**
ฟอร์มไม่ถูก submit และช่อง **MOQ ของแถวที่สอง** แสดงข้อความ **"Duplicate MOQ tier for the same product and unit"**; หลังแก้ MOQ ให้ไม่ซ้ำแล้วบันทึกสำเร็จ; กติกานี้เทียบเฉพาะแถวที่ **product + unit เดียวกัน** — สินค้าเดียวกันแต่คนละหน่วยตั้ง MOQ เท่ากันได้

---
## TC-PL-900014 — tier ที่ MOQ สูงกว่าแต่ราคาแพงกว่าถูกบล็อก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และกรอกส่วน General ครบแล้ว
**Steps**
1. เพิ่มแถวสินค้า A: MOQ = 10, Price = 100, เลือกหน่วยและ Tax Profile
2. เพิ่มแถวสินค้า A ตัวเดิม หน่วยเดียวกัน: MOQ = 50, Price = **120**
3. กด **Create**
4. แก้ราคาของแถว MOQ 50 ให้เป็น 90 แล้วกด Create อีกครั้ง
**Expected**
ฟอร์มไม่ถูก submit และช่อง **Price ของ tier ที่ MOQ สูงกว่า** แสดงข้อความ **"A higher MOQ tier must not have a higher unit price"**; ข้อความไปขึ้นที่แถวที่ MOQ สูงกว่าเสมอ ไม่ใช่แถวแรกที่กรอก (schema เรียง tier ตาม MOQ ก่อนเทียบ ไม่ได้เรียงตามลำดับแถวบนจอ); หลังแก้ราคาให้ไม่แพงกว่าแล้วบันทึกสำเร็จ; การเทียบใช้ **ราคา gross ที่กรอก** ไม่ใช่ราคาก่อนภาษี

---
## TC-PL-900015 — ช่อง MOQ / Price / Lead Time เป็น number input ที่มี min = 0
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new` และมีแถวสินค้าอยู่ 1 แถว
**Steps**
1. อ่าน attribute ของช่อง MOQ, Price และ Lead Time
2. พยายามกรอกค่าติดลบลงในแต่ละช่องแล้วกด **Create**
3. กรอก Price เป็นทศนิยมสองตำแหน่ง
**Expected**
ทั้งสามช่องเป็น `<input type="number">` ที่มี `min="0"` และ `inputMode="decimal"` โดยช่อง Price มี `step="0.01"` เพิ่มมา (ช่อง MOQ และ Lead Time ไม่มี step จึงไม่ได้จำกัดเป็นจำนวนเต็มด้วย attribute); ค่าติดลบถูกบล็อกและขึ้นข้อความของ schema (`.min(0)`) แทนการบันทึก; ทศนิยมสองตำแหน่งในช่อง Price กรอกได้ปกติ

---
## TC-PL-900016 — ขีดจำกัดความยาวของช่อง Name และ Description
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`
**Steps**
1. พิมพ์ข้อความยาวเกิน 100 ตัวอักษรลงในช่อง **Name**
2. พิมพ์ข้อความยาวเกิน 256 ตัวอักษรลงในช่อง **Description**
3. อ่านค่าที่ค้างอยู่ในแต่ละช่อง แล้วกรอกส่วนที่เหลือให้ครบและกด Create
**Expected**
ค่าถูกตัดตั้งแต่ตอนพิมพ์ตาม `maxLength` ของแต่ละช่อง (**Name = 100**, **Description = 256**) โดย **ไม่มีข้อความ validation ใด ๆ ขึ้น**; ฟอร์มบันทึกสำเร็จด้วยค่าที่ถูกตัดแล้ว และค่าที่อ่านกลับมาหลังบันทึกยาวเท่าที่ตัดไว้ — **อย่าเขียนเคสที่คาดหวังข้อความ "too long"** เพราะ schema ไม่ได้ตั้งเพดานความยาวไว้เลย ขีดจำกัดมาจาก attribute ของ input ฝั่งเดียว

---
## TC-PL-900017 — การปัดทศนิยมของ PWT และ Tax เมื่อราคาหารไม่ลงตัว
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/price-list/new`; มี tax profile อัตรา 7% ที่เปิดใช้งาน
**Steps**
1. เพิ่มแถวสินค้าแล้วเลือก Tax Profile 7%
2. กรอก Price = `100`
3. อ่านค่าในคอลัมน์ PWT และ Amount
4. กด Create แล้วเปิดใบที่บันทึกแล้วอ่านคอลัมน์ PWT / Tax / Amount ในโหมด view
**Expected**
ในฟอร์ม **PWT = 93.46** (100 ÷ 1.07 ปัดสองตำแหน่ง) และ **Amount = 100.00**; หลังบันทึกแล้วเปิดดูโหมด view ค่าที่แสดงคือ **PWT 93.46 · Tax 6.54 · Amount 100.00** โดย Tax มาจากผลต่าง `Amount − PWT` ไม่ใช่จากการคูณอัตราใหม่ — ทั้งฝั่งฟอร์ม (`useRowPriceParts`), ฝั่ง payload (`mapDetailToPayload`) และฝั่งตารางโหมด view (`pl-item-grouped-view.tsx`) ใช้การปัดสองตำแหน่งชุดเดียวกัน ค่าทั้งสามจุดจึงต้องตรงกันเป๊ะ ไม่คลาดกัน 0.01

---
## TC-PL-900018 — วันที่มีผลแสดงตรงกันระหว่างหน้า list กับฟอร์ม (ไม่หล่นไปหนึ่งวัน)
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; เครื่องที่รันตั้ง timezone เป็น UTC+7 (Asia/Bangkok); มีใบราคาที่ตั้งวันเริ่มมีผลเป็นวันที่แน่นอนหนึ่งวัน
**Steps**
1. ไปที่หน้า list แล้วอ่านค่าในคอลัมน์ **Effective Period** ของใบนั้น
2. เปิดใบเดียวกันในโหมด view แล้วอ่าน Effective From / Effective To
3. กด **Edit** แล้วอ่านวันที่บนปุ่มปฏิทินทั้งสองช่อง
4. สลับไปมุมมองการ์ดแล้วอ่านแถว Effective Period บนการ์ด
**Expected**
วันที่ที่แสดงทั้งสี่จุด (ตาราง · ฟอร์มโหมด view · ปุ่มปฏิทินโหมดแก้ไข · การ์ด) **ตรงกันทุกจุด ไม่คลาดกันหนึ่งวัน** — `getDefaultValues()` จงใจเก็บ ISO string ดิบไว้แทนการ round-trip ผ่าน `toISOString().split()` เพราะการบีบเป็น UTC ทำให้วันหล่นไปหนึ่งวันบน timezone บวก (คอมเมนต์ใน `pl-form-schema.ts` บันทึกไว้ตรง ๆ) และทุกจุดฟอร์แมตด้วย `formatDate(..., dateFormat)` ของโปรไฟล์เดียวกัน; แก้วันที่แล้วบันทึก วันที่ที่อ่านกลับมาก็ยังตรงกับที่เลือกในปฏิทิน
