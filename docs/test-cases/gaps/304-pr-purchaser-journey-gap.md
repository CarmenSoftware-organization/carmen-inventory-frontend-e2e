# Purchase Request — เส้นทางฝ่ายจัดซื้อ (Purchaser journey) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของเส้นทางนี้ — เคสที่ครอบแล้ว (เปิดรายการ/สลับแท็บ/ค้นหา, เปิดหน้ารายละเอียด, กด Edit แล้วเห็นปุ่ม Save/Cancel, กดปุ่ม Approve/Reject/Send for Review/Split รายแถวในโหมดแก้ไข, เข้าไม่ได้เมื่อใบยังไม่ถึงขั้นจัดซื้อ) ถูกทดสอบจริงอยู่ใน `tests/304-pr-purchaser-journey.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/304-pr-purchaser-journey.md`_

**Module:** Procurement — Purchase Request (Purchaser journey: กำหนดผู้ขาย/ราคา → แปลงเป็น PO)
**Frontend route:** `routes/procurement/purchase-request/` (`pr-pricelist-compare.tsx` + `pr-pricelist-dialog.tsx` + `pr-auto-allocate.ts` + `pr-item-expand.tsx` + `workflow/pr-footer-action.tsx`) และ `routes/procurement/purchase-order/from-pr/` (`from-pr-content.tsx` + `step-select-pr.tsx` + `step-review-group.tsx` + `step-result.tsx`)
**URL:** `/procurement/purchase-request/:id` (โหมดแก้ไขของขั้น purchase) และ `/procurement/purchase-order/from-pr`
**Prefix:** `PR` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/304-pr-purchaser-journey.spec.ts`, `tests/303-pr-approver-journey.spec.ts`, `tests/301-pr.spec.ts`
**Total test cases:** 36

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **ช่วงเลขที่เลือก** — section `07` ลงทะเบียนไว้แล้วใน `docs/test-id-scheme.md:49` (`PR` = `01–09, …`) สเปกใช้ `TC-PR-0701xx`–`0704xx` และ `070901` ไปแล้ว ไฟล์นี้จึงใช้ **`TC-PR-0705xx`** (งานบนตัวใบ PR: เลือกผู้ขาย/ราคา/สกุลเงิน/อนุมัติทั้งใบ/สิทธิ์) และ **`TC-PR-0706xx`** (เส้นทางแปลง PR เป็น PO) — ตรวจแล้วว่าเลขทั้งสองชุดยังไม่ถูกใช้ที่ใดใน `tests/` หรือ `docs/` (`grep -rhoE 'TC-PR-[0-9]{6}' tests/ docs/`) และไม่ทับกับ `gaps/301-pr-core-gap.md` (ใช้ `01/02/09/40/42/44/45/47/61/62/63`) หรือ `gaps/301-pr-from-template-gap.md` (ใช้ `0503/05/10`)
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `TC-PR-070150` (BU = BLAVG), `070101–070105` (รายการ: โหลด, สลับ All Documents, dropdown Stage, ปุ่ม Filter, ค้นหา), `070201–070204` (รายละเอียด: แท็บ Items ค่าเริ่มต้น, แท็บ Workflow History, ไม่มีปุ่ม Approve/Reject/Return เดี่ยว ๆ, ปุ่ม Edit), `070301` (เข้าโหมดแก้ไขแล้วเห็น Save/Cancel), `070306` (Approved Qty อ่านอย่างเดียว), `070307` (คลิกปุ่ม Auto Allocate), `070308–070310` (หลายรายการ/Save/Cancel), `070401–070404` (ปุ่มรายแถว Approve/Reject/Send for Review/Split ในโหมดแก้ไข), `070405` (ใบที่ยังไม่ถึงขั้นจัดซื้อแก้ไม่ได้), `070901` (golden journey)
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้**
> 1. **ช่องผู้ขาย/ราคา/อัตราแลกเปลี่ยนอยู่ใน "แถวที่กางออก" ไม่ใช่แถวปกติ** — คอลัมน์ของตารางรายการมีแค่ select, #, Location, Product, Requested, Approved, FOC, Amount, Delivery Point, Delivery Date, action (`routes/procurement/purchase-request/use-pr-item-table.tsx:136-437`) · Vendor / Pricelist No / Unit Price / Exchange Rate / Discount / Tax Profile ถูกเรนเดอร์ใน `expandedContent` เท่านั้น (`use-pr-item-table.tsx:217-226` → `pr-item-expand.tsx:172-340`) ⇒ **ทุกเคสในไฟล์นี้ต้องกางแถวก่อน** ด้วยปุ่ม chevron ของคอลัมน์ select (`use-pr-item-table.tsx:176-196`, `aria-label` = `aria.expandRow`/`aria.collapseRow`) หรือปุ่ม Expand All (`pr-item-fields.tsx:474-493`)
> 2. **เพราะข้อ 1 สเปกปัจจุบันน่าจะ skip ทั้งบล็อก Step 3** — `tests/pages/purchase-request.page.ts:242-244` นิยาม `itemRow(i)` เป็น `<tr>` ที่มี input/button ตัวที่ i แล้ว `vendorInput/unitPriceInput/discountInput/taxProfileSelect` (`purchase-request.page.ts:616-630`) ค้นหา label ภายในแถวนั้น ซึ่งไม่มีช่องเหล่านั้นอยู่เมื่อแถวยังหุบ → `count() === 0` → `purchaseTest.skip(...)` ที่ `tests/304-pr-purchaser-journey.spec.ts:306, 336, 368, 398` บันทึกเป็นข้อเท็จจริง — ไฟล์นี้จึง**ไม่**เขียนเคสซ้ำกับสเปก แต่เคสในไฟล์นี้ระบุขั้นตอน "กางแถว" ไว้ชัดเจนทุกเคส
> 3. **"Bulk Approve" ในสเปก ≠ อนุมัติเอกสาร** — ปุ่ม Approve/Send back/Reject/Split บนแถบเครื่องมือ (`pr-item-fields.tsx:404-445`) แค่ตั้งค่า `stage_status` / `current_stage_status` ของแถวที่ติ๊กในฟอร์ม (`pr-item-fields.tsx:267-290`) ไม่ยิง API ใด ๆ · การเดินเอกสารจริงอยู่ที่ **ปุ่มบนแถบสรุปท้ายหน้า** (`workflow/pr-footer-action.tsx:232-296`) ซึ่งโผล่เฉพาะเมื่อ `computePurchaseAction()` สรุปจากสถานะของทุกแถวได้เป็น `approved` / `rejected` / `review` (`workflow/pr-purchase-action.ts:16-32`) ⇒ `TC-PR-070401` ของสเปกที่ assert แค่ URL ไม่ได้พิสูจน์ว่าใบเดินไปขั้นถัดไป — `TC-PR-070518`–`070520` ในไฟล์นี้ครอบส่วนนั้น
> 4. **ปุ่มเทียบราคาอยู่ใน gutter ซ้ายของแถวที่กาง ไม่ใช่ในแถบเครื่องมือ** — `use-pr-item-table.tsx:206-216` (`expandedLeading`) เรนเดอร์ `PrPricelistCompare` และตัวมันเองคืน `null` เมื่อยังไม่มี `product_id` / `requested_unit_id` / `currency_id` ครบ หรือ role ไม่ใช่ `purchase`/`approve` (`pr-pricelist-compare.tsx:62-68`) · เป็น `<Button variant="ghost" size="icon-xs">` ที่มีแต่ไอคอนตาชั่ง `aria-label` = `common.comparePrice` = **"Compare price"** (`pr-pricelist-compare.tsx:90-99`, `messages/en.json:478`)
> 5. **ตารางเทียบราคาเลือกด้วยปุ่ม Assign เท่านั้น** — คอลัมน์ Assign ถูกต่อท้ายเฉพาะเมื่อ `readOnly === false` (`pr-pricelist-dialog.tsx:154-173`) และ `readOnly = isDisabled || role !== STAGE_ROLE.PURCHASE` (`pr-pricelist-compare.tsx:118`) ⇒ **ผู้อนุมัติเปิดดูได้แต่ไม่มีปุ่ม Assign** · คอมเมนต์ในซอร์สระบุตรง ๆ ว่าแถวไม่ใช่เป้าคลิกจึงไม่มี pointer (`pr-pricelist-dialog.tsx:345-346`)
> 6. **กด Assign เขียน 6 ค่าเข้าแถว** — `vendor_id`, `vendor_name`, `pricelist_price`, `pricelist_detail_id`, `pricelist_no` และ `pricelist_type = MANUAL_SELECT` แล้วปิดกล่อง (`pr-pricelist-compare.tsx:70-83`, `pr-pricelist-dialog.tsx:249-253`) · **ไม่ได้**เขียน `tax_profile_id` / `exchange_rate` ให้ (ต่างจาก Auto Allocate — ดูข้อ 8)
> 7. **ป้าย Best ผูกกับราคาต่ำสุดที่ > 0** — `minPrice` คำนวณจาก `rows` หลังรวม `selected` เข้ามาแล้ว และกรองเฉพาะราคาที่มากกว่า 0 (`pr-pricelist-dialog.tsx:256-268`) แถวที่ `price === minPrice && minPrice > 0` ได้ Badge `t("best")` = "Best" (`pr-pricelist-dialog.tsx:112-125`, `messages/en.json:3664`) · ป้าย "preferred" เป็น **ไอคอนมงกุฎล้วน ๆ** เพราะข้อความถูกคอมเมนต์ทิ้งไว้ในซอร์ส (`pr-pricelist-dialog.tsx:76-85`, บรรทัด `83`) ⇒ ห้าม assert ข้อความ "Preferred"
> 8. **Auto Allocate ทำกับทุกแถวในใบ ไม่ใช่แถวที่ติ๊ก** — `runPrAutoAllocate` อ่าน `form.getValues("items")` ทั้งก้อน (`pr-auto-allocate.ts:72`) และข้ามแถวที่ขาด `product_id`/`requested_unit_id`/`currency_id` (`pr-auto-allocate.ts:80-81`) · เจอราคา → เขียน vendor, price, `pricelist_type = AUTOMATIC`, `pricelist_detail_id`, `pricelist_no`, **`exchange_rate`, `tax_profile_id`, `tax_profile_name`, `tax_rate`** แล้วคำนวณยอด derive (`pr-auto-allocate.ts:107-132`) · ไม่เจอ → **ล้าง** vendor/price/pricelist ทิ้งและตั้งยอดเป็น 0 (`pr-auto-allocate.ts:95-105`) · ปุ่มนี้มีเฉพาะ role `purchase` และปิดเมื่อกำลังทำงานหรือไม่มีรายการ (`pr-item-fields.tsx:504-518`)
> 9. **toast ของ Auto Allocate มีสามแบบ** (`pr-auto-allocate.ts:137-141`, `messages/en.json:3631-3633`) — สำเร็จ `"Allocated {allocated} of {total} items"`, ล้มเหลวบางส่วน `"{count} item(s) failed to allocate"`, ไม่เจอราคาเลย (`allocated === 0 && failed === 0`) เป็น **warning** `"No price list found for the items"` · ระหว่างทำงานมี loading toast `"Allocating {count} items..."`
> 10. **สกุลเงินแก้ได้ที่แถวปกติ แต่ราคา/อัตราแลกเปลี่ยนแก้ได้เฉพาะในแถวที่กาง** — `CurrencyCell` ฝังอยู่ในคอลัมน์ Amount (`use-pr-item-table.tsx:374-388`) และปิดตาม `isDisabled` ของฟอร์มอย่างเดียว ไม่ได้ผูกกับ role (`pr-item-cells/currency-cell.tsx:27-33`) · เลือกสกุลใหม่แล้ว `exchange_rate` ถูกตั้งค่าใหม่ตามสกุลนั้นให้อัตโนมัติ (`currency-cell.tsx:45-54`) · ส่วน `expandedContent` ส่ง `isDisabled={isDisabled || role !== STAGE_ROLE.PURCHASE}` (`use-pr-item-table.tsx:221`) ⇒ **HOD ในโหมดแก้ไขเห็น Vendor/Unit Price เป็นข้อความอ่านอย่างเดียว**
> 11. **ช่องอัตราแลกเปลี่ยนถูกปิดเมื่อเป็นสกุลหลัก** — `isForeignCurrency = baseCurrencyCode && currencyCode && currencyCode !== baseCurrencyCode` (`pr-item-expand.tsx:99-102`) และ input มี `disabled={!isForeignCurrency}` พร้อมทศนิยมตายตัว 5 ตำแหน่ง (`pr-item-expand.tsx:310-328`, `EXCHANGE_RATE_DECIMALS`) · เฉพาะสกุลต่างประเทศเท่านั้นที่มีแถบยอดสกุลหลักเพิ่มมาใต้ Subtotal/Discount/Net/Tax/Total (`pr-item-expand.tsx:449-461` → `pr-item-summary.tsx`)
> 12. **กฎบังคับกรอกของขั้นจัดซื้อผูกกับ role และสถานะรายแถว** — `createPrSchema` เปิด `superRefine` เฉพาะ `role === STAGE_ROLE.PURCHASE` (`pr-form-schema.ts:119, 135-136`) แล้วบังคับ `vendor_id`, `pricelist_price > 0`, `currency_id`, `tax_profile_id` **เฉพาะแถวที่ยังไม่ถูกทำเครื่องหมาย reject/review** (`pr-form-schema.ts:137-176`) · กดปุ่ม Approve รายแถวแล้วมีแถวที่กรอกไม่ครบ → `guardSelectedItemErrors()` กางแถวที่ผิด เลื่อนจอไปหาช่องแรกที่ผิด และขึ้น toast `"Please fill in vendor, price, and tax profile for all items before approving."` (`pr-item-fields.tsx:231-247`, `messages/en.json:3610`)
> 13. **เลือกผู้ขายให้แถว = ทำเครื่องหมายอนุมัติแถวนั้นทันที** — `LookupVendor.onValueChange` ตั้ง `stage_status` และ `current_stage_status` เป็น `"approve"` เมื่อค่าที่เลือกไม่ว่าง (`pr-item-expand.tsx:224-236`) · ส่วนการพิมพ์ราคาเองตั้ง `pricelist_type = MANUAL_INPUT` (`pr-item-expand.tsx:284-294`)
> 14. **ฝ่ายจัดซื้อแก้แถวที่ "อนุมัติมาแล้ว" ได้ แต่แตะแถวที่ "ถูกปฏิเสธมา" ไม่ได้** — `isRowLocked()` ยกเว้นให้เฉพาะ `role === PURCHASE` คู่กับสถานะเริ่มต้น `approved` (`pr-item-cells/helpers.tsx:69-86`) มี unit test รองรับที่ `pr-item-cells/row-lock.test.ts:30-54` แต่ยังไม่มีเทส e2e
> 15. **เส้นทางแปลง PR เป็น PO อยู่ที่หน้าใหม่ ไม่ใช่ปุ่มบนใบ PR** — ไม่มีปุ่ม "Create PO" ที่ใดในโฟลเดอร์ `purchase-request/` ทางเข้าคือ PO list → New → การ์ด "From PR" ในกล่องเลือกวิธีสร้าง ซึ่ง `navigate("/procurement/purchase-order/from-pr")` (`purchase-order/po-create-dialog.tsx:39-42, 93-107`) route ประกาศที่ `routes/router.tsx:240-242`
> 16. **หน้า from-pr ถูกกั้นด้วย workflow ไม่ใช่ permission** — `from-pr.route.tsx:10-15` ครอบด้วย `CreateWorkflowGate` ซึ่งคืน `AccessDeniedBlock` เมื่อไม่มี PO workflow ที่ `can_create` (`components/share/create-workflow-gate.tsx:32-36`) ข้อความ `"None of the approval flows let you start a purchase order."` (`messages/en.json` คีย์ `purchaseOrder.noCreatableWorkflow`) · ส่วน leaf `purchaseOrder` ใน `constant/module-list.ts:157-163` มีแต่ `licenseFeature: "procurement.purchase_order"` **ไม่มี `permission`** ⇒ `RouteGuard` บล็อกด้วย license เท่านั้น ไม่ใช่ RBAC
> 17. **ต้องเลือก workflow ปลายทางก่อน รายการ PR ถึงจะโหลด** — query มี `enabled: !!buCode && !!workflowId` (`from-pr/step-select-pr.tsx:96-107`) ก่อนหน้านั้นเป็นกล่องประ "Select a workflow first" / "Pick the target workflow above before choosing purchase requests." (`step-select-pr.tsx:258-265`) และปุ่ม Filter เป็นปุ่มที่ **กดไม่ได้** ไม่ใช่ไม่มีปุ่ม (`step-select-pr.tsx:122, 239-252`) · endpoint คือ `GET /api/.../purchase-requests/for-po` (`constant/api-endpoints.ts:338-339`)
> 18. **ติ๊ก PR ข้าม workflow ไม่ได้** — `applySelection()` ตรวจว่าชุดที่ติ๊กมาจาก workflow เดียวกันหรือไม่ ถ้าไม่ จะเปิด `ConfirmDialog` หัวข้อ "Requests use different approval flows" แล้ว**เหลือไว้เฉพาะใบที่ workflow ตรงกับใบที่เพิ่งติ๊กล่าสุด** (`step-select-pr.tsx:170-201, 299-313`, `messages/en.json:3721-3722`) · ตัวกรอง (ผู้ขอ/แผนก/PR workflow) เป็นการกรองฝั่งไคลเอนต์และผูก selection กับ `row.id` ไม่ใช่ index จึงตัดแถวออกแล้วใบที่ติ๊กไว้ไม่หลุด (`step-select-pr.tsx:43-65, 113-120, 203-215`)
> 19. **ขั้นที่ 2 จัดกลุ่มโดย backend** — กด Next ยิง `POST .../purchase-orders/group-pr` ด้วย `{ pr_ids }` แล้วเก็บ `json.data.groups` (`from-pr-content.tsx:89-108`, `constant/api-endpoints.ts:323-324`) · ตารางรีวิวมีคอลัมน์ PR Ref / Vendor / Delivery Date / Total **หนึ่งแถวต่อหนึ่งใบสั่งซื้อ** และกางดูสินค้าในใบได้ (`step-review-group.tsx:103-169`) · ยอดรวมใหญ่ = Σ(ยอดในใบ × อัตราแลกเปลี่ยน) แสดงเป็นสกุลหลักของโปรไฟล์ (`step-review-group.tsx:89-101, 200-208`)
> 20. **ยืนยันแล้วหน้าสรุปทับทั้งหน้า** — `POST .../purchase-orders/confirm-pr` ด้วย `{ workflow_id, pr_ids, buyer_id, buyer_name }` (`from-pr-content.tsx:115-149`, `constant/api-endpoints.ts:315-316`) สำเร็จแล้ว `setResult()` ทำให้ `StepResult` แทนที่ทั้งหน้า ไม่เหลือ stepper/ปุ่มเดิม (`from-pr-content.tsx:151-153`) · หน้าสรุปแสดง `"{count} purchase orders created"` / `"From {prCount} purchase requests · {detailCount} lines"` และตารางที่เลขที่ PO เป็น `<Link>` ไป `/procurement/purchase-order/<uuid>` (`from-pr/step-result.tsx:64-76, 168-179`, `messages/en.json:3724-3725`)
>
> **Role / ข้อมูลที่ต้องเตรียม**
> - **Default role ของไฟล์นี้คือ Purchaser (`purchase@blueledgers.com`, BU = `BLAVG`)** — บัญชีเดียวกับที่ `tests/304-pr-purchaser-journey.spec.ts:18` ใช้ (`tests/test-users.ts:4`, `BU_CODE = "BLAVG"` ที่ `tests/test-users.ts:20`) ทุกเคสต้อง `ensureActiveBu(page, BU_CODE)` ก่อนเหมือน `TC-PR-070150`
> - **เคสที่ต้องมีใบ PR เดินมาถึงขั้นจัดซื้อ** (แทบทุกเคสของ `0705xx`) — seed ด้วย `submitPRAsRequestor(browser, { items: 1 })` แล้ว `approveAsHOD(browser, created.ref)` จาก `tests/pages/pr-approver.helpers.ts` ตามที่สเปกทำอยู่ · ถ้าใบที่ seed ไม่ถูก workflow พาไปขั้นที่ purchaser แก้ได้ จะไม่มีปุ่ม Edit — เป็นข้อจำกัดของสภาพแวดล้อม ไม่ใช่บั๊ก UI (สเปก skip ไว้ที่ `tests/304-pr-purchaser-journey.spec.ts:248-271`)
> - **เคสที่ต้องมีสินค้าที่มี price list หลายเจ้าในวันส่งมอบนั้น**: `070502`, `070503`, `070505`, `070508` — ถ้า BU ทดสอบยังไม่มี ให้ seed price list ก่อน มิฉะนั้นจะได้หน้าว่างแทน
> - **เคสที่ต้องมีสินค้าที่ไม่มี price list เลย**: `070506`, `070511`
> - **เคสที่ต้องมีรายการสกุลต่างประเทศ (ไม่ใช่สกุลหลักของ BLAVG)**: `070513`, `070514`, `070515`
> - **เคสที่ต้องมีใบที่มีแถวถูก reject มาจากขั้นก่อนหน้า**: `070522` — seed โดยให้ HOD reject บางแถวก่อนส่งต่อ
> - **เคสที่ต้องใช้บัญชีอื่น**: `070523` (`hod@blueledgers.com`), `070524` (`requestor@blueledgers.com`), `070525` (`hod@blueledgers.com`)
> - **เคสที่ต้องมี PR ที่ผ่านขั้นจัดซื้อแล้วอย่างน้อย 2 ใบจาก workflow เดียวกัน**: `070606`, `070607`, `070608` — และ **อย่างน้อย 2 ใบจากคนละ workflow** สำหรับ `070604`
>
> **🚫 Blocker — เคสที่สร้างของจริงและย้อนกลับไม่ได้ ต้อง seed ใหม่ทุกรอบ**
> - `TC-PR-070519` (อนุมัติทั้งใบที่ขั้นจัดซื้อ) และ `TC-PR-070520` (ปฏิเสธทั้งใบ) — ยิง `purchase-approve` / `reject` จริง ใบเดินออกจากคิวของ purchaser และ **ใช้ซ้ำไม่ได้** ⇒ ต้อง seed ใบใหม่ทุกครั้ง ห้ามพึ่งใบที่ค้างอยู่ใน BU
> - `TC-PR-070608` และ `TC-PR-070609` — **สร้างใบสั่งซื้อจริง** ผ่าน `POST .../purchase-orders/confirm-pr` (`from-pr-content.tsx:126-134`) ข้อความในกล่องยืนยันระบุเองว่า "Requests that go in cannot be picked again." (`messages/en.json:3723`) ⇒ PR ที่ใช้ไปแล้วหายจากรายการถาวร และ PO ที่เกิดขึ้นลบออกจากระบบไม่ได้จากหน้านี้ · ต้อง seed PR ชุดใหม่ทุกรอบ และควรรันเคสสองตัวนี้แบบ `test.describe.serial` ร่วมกันเพื่อใช้ชุด seed เดียว
> - `TC-PR-070516`–`070518`, `070521` บันทึกค่าลงใบ (`/save` ผ่าน `saveDirtyEdits()` ที่ `use-pr-form-actions.ts:249-271`) แต่ **ไม่เปลี่ยนขั้น** — รันซ้ำบนใบเดิมได้ตราบที่ใบยังอยู่ขั้นจัดซื้อ
> - เคสที่เหลือ (เปิดกล่องเทียบราคา, อ่านคอลัมน์, ตรวจสิทธิ์, เดินขั้นที่ 1–2 ของ from-pr โดยไม่กด Confirm) **ไม่เขียนข้อมูล** รันซ้ำได้ไม่จำกัด — ปิดกล่องด้วย Escape และออกจากหน้า from-pr ด้วยปุ่ม Cancel
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-070501 | ปุ่มเทียบราคาโผล่เฉพาะในแถวที่กางออกแล้ว | High | Functional |
| TC-PR-070502 | คอลัมน์ของตารางเทียบราคา และปุ่ม Assign สำหรับฝ่ายจัดซื้อ | High | Functional |
| TC-PR-070503 | ป้าย Best ติดที่แถวราคาต่ำสุดเพียงแถวเดียว | Medium | Functional |
| TC-PR-070504 | หัวกล่องเทียบราคาบอกสินค้า จำนวนที่ขอ และจำนวนที่อนุมัติ | Medium | Functional |
| TC-PR-070505 | กด Assign แล้วผู้ขาย ราคา และเลขที่ price list ลงในแถว | High | Happy Path |
| TC-PR-070506 | สินค้าที่ไม่มี price list แสดงกล่องว่าง ไม่ใช่ตารางเปล่า | Medium | Edge Case |
| TC-PR-070507 | คำขอเทียบราคาส่งสินค้า/หน่วย/สกุลเงิน/วันที่ และไม่ใช้แคช | Medium | Functional |
| TC-PR-070508 | แก้จำนวนที่อนุมัติแล้วเปิดเทียบราคาใหม่ ได้ราคาตามขั้นบันได | Medium | Functional |
| TC-PR-070509 | Auto Allocate จัดราคาให้ทุกแถวในใบ ไม่ใช่เฉพาะแถวที่ติ๊ก | High | Functional |
| TC-PR-070510 | Auto Allocate เติมภาษีและอัตราแลกเปลี่ยนให้ด้วย | High | Functional |
| TC-PR-070511 | Auto Allocate ไม่พบราคาเลย ล้างค่าเดิมและเตือนด้วย toast | Medium | Edge Case |
| TC-PR-070512 | Auto Allocate ทับค่าที่เลือกเองไว้ก่อนหน้า | Medium | Edge Case |
| TC-PR-070513 | ช่องอัตราแลกเปลี่ยนถูกปิดเมื่อรายการเป็นสกุลหลักของหน่วยธุรกิจ | Medium | Functional |
| TC-PR-070514 | เปลี่ยนสกุลเงินของรายการแล้วอัตราแลกเปลี่ยนถูกตั้งใหม่ตามสกุลนั้น | High | Functional |
| TC-PR-070515 | รายการสกุลต่างประเทศแสดงแถบยอดสกุลหลักเพิ่ม | Medium | Functional |
| TC-PR-070516 | อนุมัติแถวที่ยังไม่มีผู้ขาย ระบบกางแถวที่ผิดและเตือน | High | Validation |
| TC-PR-070517 | แถวที่ทำเครื่องหมายส่งกลับหรือไม่อนุมัติ ไม่ถูกบังคับกรอกผู้ขาย/ราคา/ภาษี | High | Validation |
| TC-PR-070518 | ปุ่มอนุมัติทั้งใบโผล่เมื่อทุกแถวถูกตัดสินครบแล้วเท่านั้น | High | Functional |
| TC-PR-070519 | อนุมัติทั้งใบที่ขั้นจัดซื้อ ใบเดินไปขั้นถัดไปและหลุดจากคิว | High | Happy Path |
| TC-PR-070520 | ปฏิเสธทุกแถวแล้วได้ปุ่มไม่อนุมัติทั้งใบแทนปุ่มอนุมัติ | Medium | Alternate Flow |
| TC-PR-070521 | เลือกผู้ขายให้แถวแล้วแถวนั้นถูกทำเครื่องหมายอนุมัติเอง | Medium | Functional |
| TC-PR-070522 | แถวที่ถูกปฏิเสธมาจากขั้นก่อนหน้ายังล็อกสำหรับฝ่ายจัดซื้อ | Medium | Edge Case |
| TC-PR-070523 | ผู้อนุมัติเข้าโหมดแก้ไข แต่ผู้ขายกับราคาเป็นข้อความอ่านอย่างเดียว | High | Authorization |
| TC-PR-070524 | ผู้ขอซื้อไม่เห็นปุ่มเทียบราคาและปุ่ม Auto Allocate | High | Authorization |
| TC-PR-070525 | ผู้อนุมัติเปิดตารางเทียบราคาได้ แต่ไม่มีปุ่ม Assign | Medium | Authorization |
| TC-PR-070526 | ฝ่ายจัดซื้อเปิดหน้าสร้างใบสั่งซื้อจากใบขอซื้อได้ด้วยสิทธิ์ของตัวเอง | Medium | Authorization |
| TC-PR-070601 | เข้าหน้าสร้าง PO จาก PR ผ่านการ์ด From PR | High | Smoke |
| TC-PR-070602 | ยังไม่เลือก workflow รายการใบขอซื้อไม่โหลดและปุ่ม Filter กดไม่ได้ | High | Functional |
| TC-PR-070603 | กรองรายการใบขอซื้อฝั่งไคลเอนต์โดยที่ใบที่ติ๊กไว้ไม่หลุด | Medium | Functional |
| TC-PR-070604 | ติ๊กใบข้าม workflow ระบบถามยืนยันแล้วตัดใบที่ไม่ตรงออก | High | Edge Case |
| TC-PR-070605 | ปุ่ม Next ปิดจนกว่าจะเลือกทั้ง workflow และใบขอซื้ออย่างน้อยหนึ่งใบ | Medium | Validation |
| TC-PR-070606 | ขั้นรีวิวแยกใบสั่งซื้อตามผู้ขาย พร้อมยอดรวมใหญ่สกุลหลัก | High | Functional |
| TC-PR-070607 | กางแถวใบสั่งซื้อในขั้นรีวิวเพื่อดูรายการสินค้า | Medium | Functional |
| TC-PR-070608 | ยืนยันแล้วสร้างใบสั่งซื้อจริงและหน้าสรุปแทนที่ทั้งหน้า | High | Happy Path |
| TC-PR-070609 | ใบขอซื้อที่ถูกใช้สร้างใบสั่งซื้อแล้ว ไม่กลับมาในรายการอีก | High | Edge Case |
| TC-PR-070610 | ออกจากหน้ากลางคันหลังเลือกไว้แล้ว ระบบเตือนก่อนทิ้งงาน | Medium | Alternate Flow |

---

## TC-PR-070501 — ปุ่มเทียบราคาโผล่เฉพาะในแถวที่กางออกแล้ว
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser (`purchase@blueledgers.com`, BU = `BLAVG`); มีใบ PR ที่เดินมาถึงขั้นจัดซื้อและมีรายการอย่างน้อย 1 แถวที่มีสินค้า หน่วย และสกุลเงินครบ; อยู่ที่หน้ารายละเอียดของใบนั้นในโหมดแก้ไข
**Steps**
1. ตรวจว่าในแถวรายการที่ยังหุบอยู่ มีปุ่มที่ `aria-label` ว่า "Compare price" หรือไม่
2. กดปุ่ม chevron ของแถวแรกเพื่อกางแถว
3. ตรวจปุ่ม "Compare price" อีกครั้งในพื้นที่ที่กางออกมา
**Expected**
ขณะแถวหุบ ไม่มีปุ่ม "Compare price" ปรากฏ · หลังกางแถว มีปุ่มไอคอนตาชั่ง `aria-label="Compare price"` หนึ่งปุ่มอยู่ในช่องว่างซ้ายของแถวที่กาง ตรงบรรทัด Pricelist และกดได้

---

## TC-PR-070502 — คอลัมน์ของตารางเทียบราคา และปุ่ม Assign สำหรับฝ่ายจัดซื้อ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบ PR อยู่ขั้นจัดซื้อและอยู่ในโหมดแก้ไข; รายการแถวแรกเป็นสินค้าที่มี price list อย่างน้อยหนึ่งรายการในวันส่งมอบที่ระบุ
**Steps**
1. กางแถวแรก แล้วกดปุ่ม "Compare price"
2. รอให้ตารางในกล่องโหลดเสร็จ (ไม่ใช่สปินเนอร์)
3. อ่านหัวคอลัมน์ทั้งหมดของตารางตามลำดับ
4. ตรวจว่าทุกแถวมีปุ่ม Assign ในคอลัมน์สุดท้าย
**Expected**
กล่องเปิดขึ้นพร้อมหัวเรื่อง "Price Comparison" · หัวคอลัมน์เรียงเป็น `#`, Vendor, Pricelist No, Unit, Price, Effective แล้วปิดท้ายด้วยคอลัมน์ไม่มีชื่อที่บรรจุปุ่ม "Assign" หนึ่งปุ่มต่อแถว · คอลัมน์ Price แสดงตัวเลขคู่กับรหัสสกุลเงินของราคานั้น และคอลัมน์ Effective แสดงช่วงวันที่ในรูป `from → to`

---

## TC-PR-070503 — ป้าย Best ติดที่แถวราคาต่ำสุดเพียงแถวเดียว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; สินค้าของแถวแรกมี price list จากผู้ขายตั้งแต่ 2 เจ้าขึ้นไปและราคาไม่เท่ากัน
**Steps**
1. กางแถวแรกแล้วเปิดกล่องเทียบราคา
2. อ่านค่าราคาของทุกแถวในตาราง
3. หาแถวที่มีป้าย "Best"
**Expected**
มีป้าย "Best" ปรากฏเพียงแถวเดียว และเป็นแถวที่ราคาต่ำที่สุดในบรรดาราคาที่มากกว่า 0 · แถวอื่นไม่มีป้ายนี้ · ถ้าผู้ขายรายใดถูกทำเครื่องหมายเป็นเจ้าประจำ จะเห็นเป็น **ไอคอนมงกุฎอย่างเดียว** ข้างชื่อผู้ขาย (ไม่มีข้อความกำกับ)

---

## TC-PR-070504 — หัวกล่องเทียบราคาบอกสินค้า จำนวนที่ขอ และจำนวนที่อนุมัติ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกมีทั้งจำนวนที่ขอและจำนวนที่ผู้อนุมัติตั้งไว้ (มากกว่า 0)
**Steps**
1. จดจำนวนที่ขอและจำนวนที่อนุมัติของแถวแรกจากตารางรายการ
2. กางแถวแล้วเปิดกล่องเทียบราคา
3. อ่านบรรทัดคำอธิบายและแถบข้อมูลใต้หัวเรื่อง
**Expected**
บรรทัดใต้หัวเรื่องคือชื่อสินค้าของแถวนั้น · แถบข้อมูลแสดง "Requested: `<จำนวน> <หน่วย>`" ตรงกับที่จดไว้ และเพราะจำนวนที่อนุมัติมากกว่า 0 จึงมีส่วน "Approved: `<จำนวน> <หน่วย>`" ต่อท้ายหลังเส้นคั่นด้วย · ถ้าเปิดกล่องเดียวกันบนแถวที่จำนวนที่อนุมัติเป็น 0 ส่วน Approved จะไม่ปรากฏเลย

---

## TC-PR-070505 — กด Assign แล้วผู้ขาย ราคา และเลขที่ price list ลงในแถว
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกยังไม่มีผู้ขาย และสินค้ามี price list อย่างน้อย 1 รายการ
**Steps**
1. กางแถวแรกแล้วเปิดกล่องเทียบราคา
2. จดชื่อผู้ขาย ราคา และเลขที่ price list ของแถวใดแถวหนึ่ง (เช่นแถวที่มีป้าย Best)
3. กดปุ่ม "Assign" ของแถวนั้น
4. อ่านช่อง Pricelist, Vendor และ Unit Price ในแถวที่กางอยู่
**Expected**
กล่องปิดทันทีที่กด Assign · ช่อง Vendor แสดงชื่อผู้ขายที่เลือก, ช่อง Unit Price มีค่าตรงกับราคาที่จดไว้, ช่อง Pricelist (ข้อความอ่านอย่างเดียว) แสดงเลขที่ price list ที่จดไว้แทนขีด "—" · ยอด Subtotal/Net/Total ของแถวถูกคำนวณใหม่ตามราคานั้น · **หมายเหตุ:** การ Assign ไม่ได้เติม Tax Profile ให้ ช่องนั้นยังว่างอยู่ถ้าเดิมว่าง

---

## TC-PR-070506 — สินค้าที่ไม่มี price list แสดงกล่องว่าง ไม่ใช่ตารางเปล่า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; มีรายการที่เป็นสินค้าซึ่งไม่มี price list ใดครอบคลุมในวันส่งมอบและสกุลเงินที่ระบุ
**Steps**
1. กางแถวของสินค้านั้นแล้วเปิดกล่องเทียบราคา
2. รอให้การโหลดเสร็จ
3. อ่านเนื้อหาในพื้นที่ตาราง
**Expected**
พื้นที่ตารางแสดงกล่องว่างพร้อมหัวข้อ "No Price List Found" และคำอธิบาย "No price list found for this item." · ไม่มีแถวข้อมูลและไม่มีปุ่ม Assign ใด ๆ · กด Escape ปิดกล่องแล้วค่าในแถวยังเหมือนเดิมทุกช่อง (การเปิดดูไม่แก้ข้อมูล)

---

## TC-PR-070507 — คำขอเทียบราคาส่งสินค้า/หน่วย/สกุลเงิน/วันที่ และไม่ใช้แคช
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; ดักจับคำขอเครือข่ายที่ URL ลงท้ายด้วย `/pricelists/price-compare`
**Steps**
1. จดสินค้า หน่วยที่ขอ สกุลเงิน และวันส่งมอบของแถวแรก
2. กางแถวแล้วเปิดกล่องเทียบราคา
3. อ่าน query string ของคำขอที่ถูกยิง
4. ปิดกล่องแล้วเปิดใหม่อีกครั้ง
**Expected**
มีคำขอไปที่ `/pricelists/price-compare` ของหน่วยธุรกิจปัจจุบัน พร้อม query `product_id`, `unit_id`, `currency_id` ตรงกับค่าที่จดไว้ และ `at_date` อยู่ในรูป `yyyy-MM-dd` ของวันส่งมอบ · มี `qty` เท่ากับจำนวนที่ขอ (ถ้าจำนวนที่ขอเป็น 0 พารามิเตอร์ `qty` จะถูกตัดทิ้งไม่ส่งไป) · การเปิดกล่องรอบที่สองยิงคำขอใหม่อีกครั้ง ไม่ได้อ่านจากแคชของเบราว์เซอร์

---

## TC-PR-070508 — แก้จำนวนที่อนุมัติแล้วเปิดเทียบราคาใหม่ ได้ราคาตามขั้นบันได
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกเป็นสินค้าที่มี price list กำหนดราคาแบบขั้นบันไดตามจำนวน (MOQ) อย่างน้อยสองขั้น; ดักจับคำขอ `/pricelists/price-compare`
**Steps**
1. เปิดกล่องเทียบราคาของแถวแรกหนึ่งครั้ง แล้วจด `qty` ในคำขอและราคาที่ได้
2. ปิดกล่อง แล้วแก้จำนวนที่ขอของแถวนั้นให้ข้ามขั้นราคาถัดไป
3. เปิดกล่องเทียบราคาของแถวเดิมอีกครั้ง
4. อ่าน `qty` ในคำขอรอบใหม่และราคาในตาราง
**Expected**
คำขอรอบที่สองส่ง `qty` เป็นจำนวนใหม่ (ไม่ใช่ค่าเดิมที่แคชไว้) · แถบข้อมูลบนหัวกล่องแสดง "Requested" เป็นจำนวนใหม่ · ราคาที่ตารางแสดงเปลี่ยนไปตามขั้นบันไดของจำนวนใหม่

---

## TC-PR-070509 — Auto Allocate จัดราคาให้ทุกแถวในใบ ไม่ใช่เฉพาะแถวที่ติ๊ก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบ PR ที่ขั้นจัดซื้อมีรายการอย่างน้อย 2 แถว ทุกแถวมีสินค้า หน่วย และสกุลเงินครบ และทุกแถวยังไม่มีผู้ขาย; อยู่ในโหมดแก้ไข
**Steps**
1. ติ๊กเลือกเฉพาะแถวแรกแถวเดียว
2. กดปุ่ม "Auto Allocate"
3. รอ toast สรุปผล
4. กางทุกแถวแล้วอ่านช่อง Vendor และ Unit Price
**Expected**
ทุกแถวที่มี price list รองรับได้ผู้ขายและราคาเติมให้ครบ **ไม่ใช่เฉพาะแถวที่ติ๊กไว้** · แถวที่ขาดสินค้า หน่วย หรือสกุลเงิน ถูกข้ามไปโดยไม่มีการเปลี่ยนแปลงและไม่ทำให้เกิด error · การติ๊กเลือกไม่มีผลต่อผลลัพธ์ของปุ่มนี้

---

## TC-PR-070510 — Auto Allocate เติมภาษีและอัตราแลกเปลี่ยนให้ด้วย
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกยังไม่มีผู้ขาย ไม่มี Tax Profile และสินค้ามี price list ที่กำหนดโปรไฟล์ภาษีไว้
**Steps**
1. กางแถวแรกแล้วจดว่าช่อง Tax Profile ว่างและ Exchange Rate เป็นค่าใด
2. กดปุ่ม "Auto Allocate" แล้วรอ toast สรุป
3. อ่านช่อง Vendor, Unit Price, Tax Profile, Exchange Rate และยอด Tax/Total ของแถว
**Expected**
นอกจากผู้ขายกับราคาแล้ว ช่อง Tax Profile ถูกเติมด้วยโปรไฟล์ภาษีจาก price list และช่อง Exchange Rate ถูกตั้งค่าตามที่ price list ส่งมา · ยอดภาษีและยอดรวมของแถวถูกคำนวณใหม่ตามอัตราภาษีนั้นโดยไม่ต้องกางแถวก่อน (แถวที่หุบอยู่ก็มียอดถูกต้อง) · จุดนี้ต่างจากการกด Assign ในกล่องเทียบราคา ซึ่งไม่เติมภาษีให้

---

## TC-PR-070511 — Auto Allocate ไม่พบราคาเลย ล้างค่าเดิมและเตือนด้วย toast
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; ทุกรายการในใบเป็นสินค้าที่ไม่มี price list ครอบคลุมในวันส่งมอบและสกุลเงินนั้น
**Steps**
1. กางแถวแรก พิมพ์ราคาเองสักค่าหนึ่ง แล้วหุบกลับ
2. กดปุ่ม "Auto Allocate"
3. อ่าน toast ที่ขึ้นมา
4. กางแถวแรกอีกครั้งแล้วอ่านช่อง Vendor, Unit Price และยอด Total
**Expected**
ขึ้น toast แบบคำเตือน (ไม่ใช่ error) ข้อความ "No price list found for the items" · ช่อง Vendor กลับเป็นว่าง, Unit Price เป็น 0, ช่อง Pricelist เป็นขีด "—" และยอดรวมของแถวเป็น 0 — ค่าที่พิมพ์เองไว้ก่อนหน้าถูกล้างทิ้ง

---

## TC-PR-070512 — Auto Allocate ทับค่าที่เลือกเองไว้ก่อนหน้า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกเป็นสินค้าที่มี price list จากผู้ขายหลายเจ้า และราคาต่ำสุดไม่ใช่ของเจ้าที่จะเลือกในขั้นตอนที่ 1
**Steps**
1. เปิดกล่องเทียบราคาของแถวแรก แล้วกด Assign ให้ผู้ขายที่ **ไม่ใช่** แถวที่มีป้าย Best จดชื่อผู้ขายกับราคาไว้
2. กดปุ่ม "Auto Allocate" แล้วรอ toast สรุปผล
3. อ่านช่อง Vendor และ Unit Price ของแถวนั้นอีกครั้ง
**Expected**
ค่าที่เลือกเองไว้ในขั้นตอนที่ 1 ถูกเขียนทับด้วยผู้ขายและราคาที่ระบบเลือกให้ · toast รายงาน "Allocated `<n>` of `<n>` items" ตามจำนวนรายการทั้งใบ · เคสนี้ยืนยันว่า Auto Allocate ไม่มีการถามยืนยันและไม่เว้นแถวที่ผู้ใช้จัดเองไว้แล้ว — เป็นพฤติกรรมที่ตั้งใจ ไม่ใช่บั๊ก

---

## TC-PR-070513 — ช่องอัตราแลกเปลี่ยนถูกปิดเมื่อรายการเป็นสกุลหลักของหน่วยธุรกิจ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกใช้สกุลเงินเดียวกับสกุลหลักของ BU `BLAVG`
**Steps**
1. กางแถวแรก
2. ตรวจสถานะของช่อง Exchange Rate (อ่าน `disabled` / `aria-disabled`)
3. อ่านค่าที่แสดงในช่องนั้น
**Expected**
ช่อง Exchange Rate อยู่ในสถานะปิดใช้งาน กรอกไม่ได้ แต่ยังเห็นค่าอยู่ (ไม่ได้ถูกซ่อน) · ค่าที่แสดงคือ `1.00000` (ทศนิยมตายตัว 5 ตำแหน่ง) · ไม่มีแถบยอดสกุลหลักเพิ่มเติมใต้กลุ่มยอด Subtotal/Discount/Net/Tax/Total

---

## TC-PR-070514 — เปลี่ยนสกุลเงินของรายการแล้วอัตราแลกเปลี่ยนถูกตั้งใหม่ตามสกุลนั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; มีสกุลเงินต่างประเทศอย่างน้อยหนึ่งสกุลที่ตั้งค่าอัตราแลกเปลี่ยนไว้ในระบบ
**Steps**
1. ในแถวแรกที่ยังหุบอยู่ เปิดตัวเลือกสกุลเงินในคอลัมน์จำนวนเงิน แล้วเลือกสกุลต่างประเทศ
2. กางแถวนั้นออก
3. อ่านช่อง Currency และ Exchange Rate
**Expected**
ตัวเลือกสกุลเงินอยู่ในแถวปกติ (คอลัมน์จำนวนเงิน) ไม่ใช่ในแถวที่กาง และเปลี่ยนค่าได้ · หลังเปลี่ยนสกุล ช่อง Exchange Rate เปลี่ยนจาก `1.00000` เป็นอัตราของสกุลที่เลือก โดยไม่ต้องกรอกเอง · ช่องนั้นเปลี่ยนจากสถานะปิดเป็นแก้ไขได้

---

## TC-PR-070515 — รายการสกุลต่างประเทศแสดงแถบยอดสกุลหลักเพิ่ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกถูกตั้งเป็นสกุลต่างประเทศแล้ว มีราคาและจำนวนอนุมัติมากกว่า 0
**Steps**
1. กางแถวแรก แล้วจดค่า Exchange Rate และยอด Total ของแถว
2. อ่านแถบยอดที่อยู่ใต้กลุ่ม Subtotal / Discount / Net / Tax / Total
3. แก้ Exchange Rate เป็นค่าอื่น แล้วอ่านแถบนั้นอีกครั้ง
**Expected**
มีแถบยอดสกุลหลักเพิ่มขึ้นมาอีกหนึ่งชุด กำกับด้วยรหัสสกุลหลักของ BU (ต่างจากเคสสกุลหลักที่ไม่มีแถบนี้) · ยอดในแถบนั้นเท่ากับยอดของแถว × อัตราแลกเปลี่ยน และอัปเดตทันทีเมื่อแก้อัตราแลกเปลี่ยน · ช่องอัตราแลกเปลี่ยนรับค่าได้ถึง 5 ตำแหน่งทศนิยม

---

## TC-PR-070516 — อนุมัติแถวที่ยังไม่มีผู้ขาย ระบบกางแถวที่ผิดและเตือน
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; มีรายการอย่างน้อย 2 แถว โดยแถวที่สองยังไม่มีผู้ขาย ไม่มีราคา และไม่มี Tax Profile; ทุกแถวหุบอยู่
**Steps**
1. ติ๊กเลือกทุกแถว
2. กดปุ่ม Approve บนแถบเครื่องมือของตารางรายการ
3. อ่าน toast ที่ขึ้น และดูว่าแถวใดถูกกางออกเอง
4. อ่านสถานะกรอบของช่อง Vendor / Unit Price / Tax Profile ในแถวที่ถูกกาง
**Expected**
ขึ้น toast แบบคำเตือน "Please fill in vendor, price, and tax profile for all items before approving." · แถวที่กรอกไม่ครบ **ถูกกางออกให้เอง** และหน้าจอเลื่อนไปหาช่องแรกที่ผิด · ช่อง Vendor, Unit Price และ Tax Profile ของแถวนั้นมีสถานะไม่ถูกต้อง (`aria-invalid`) · ไม่มีแถวใดถูกทำเครื่องหมายอนุมัติ และปุ่มอนุมัติทั้งใบบนแถบสรุปท้ายหน้ายังไม่ปรากฏ

---

## TC-PR-070517 — แถวที่ทำเครื่องหมายส่งกลับหรือไม่อนุมัติ ไม่ถูกบังคับกรอกผู้ขาย/ราคา/ภาษี
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; มีรายการอย่างน้อย 2 แถว ทั้งสองแถวยังไม่มีผู้ขาย/ราคา/ภาษี
**Steps**
1. ติ๊กเฉพาะแถวที่สอง แล้วกดปุ่ม Reject บนแถบเครื่องมือ ยืนยันในกล่องที่ขึ้นมา
2. ติ๊กเฉพาะแถวแรก แล้วกรอกผู้ขาย ราคา และ Tax Profile ให้ครบ
3. กดปุ่ม Approve ขณะที่ยังติ๊กแถวแรกอยู่
**Expected**
ขั้นตอนที่ 3 ผ่านโดยไม่มี toast เตือนและไม่มีกรอบแดง แม้แถวที่สองจะยังไม่มีผู้ขาย/ราคา/ภาษีเลย — กฎบังคับกรอกข้ามแถวที่ถูกทำเครื่องหมายไม่อนุมัติหรือส่งกลับ · แถวแรกถูกทำเครื่องหมายอนุมัติ · ทำซ้ำเคสเดียวกันโดยเปลี่ยนขั้นตอนที่ 1 เป็นปุ่ม Send back ต้องได้ผลเหมือนกัน

---

## TC-PR-070518 — ปุ่มอนุมัติทั้งใบโผล่เมื่อทุกแถวถูกตัดสินครบแล้วเท่านั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; มีรายการ 2 แถว กรอกผู้ขาย/ราคา/ภาษีครบทั้งสองแถว
**Steps**
1. ก่อนกดอะไร อ่านแถบสรุปท้ายหน้าว่ามีปุ่มเดินเอกสารหรือไม่
2. ติ๊กเฉพาะแถวแรก แล้วกดปุ่ม Approve บนแถบเครื่องมือ
3. อ่านแถบสรุปท้ายหน้าอีกครั้ง
4. ติ๊กแถวที่สอง แล้วกดปุ่ม Approve
5. อ่านแถบสรุปท้ายหน้าเป็นครั้งสุดท้าย
**Expected**
ขั้นตอนที่ 1 และ 3 แถบสรุปท้ายหน้ายังแสดงแต่ยอด Subtotal/Discount/Net/Tax/Grand Total **ไม่มีปุ่มเดินเอกสาร** เพราะยังมีแถวที่ยังไม่ถูกตัดสิน · หลังขั้นตอนที่ 4 ปุ่มอนุมัติ (ไอคอนรถเข็น) ปรากฏบนแถบสรุป · เคสนี้ยืนยันว่าปุ่ม Approve บนแถบเครื่องมือเป็นการตัดสินรายแถวเท่านั้น ยังไม่ส่งเอกสารไปขั้นถัดไป

---

## TC-PR-070519 — อนุมัติทั้งใบที่ขั้นจัดซื้อ ใบเดินไปขั้นถัดไปและหลุดจากคิว
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น purchaser; **seed ใบใหม่ทุกรอบ** (submit โดย requestor แล้วให้ HOD อนุมัติ) จนใบมาอยู่ขั้นจัดซื้อ; อยู่ในโหมดแก้ไข; จดเลขที่ใบไว้
**Steps**
1. กรอกผู้ขาย ราคา และ Tax Profile ให้ครบทุกแถว (ด้วย Auto Allocate หรือกล่องเทียบราคา)
2. ติ๊กทุกแถว แล้วกดปุ่ม Approve บนแถบเครื่องมือ
3. กดปุ่มอนุมัติ (ไอคอนรถเข็น) บนแถบสรุปท้ายหน้า
4. ยืนยันในกล่องที่ขึ้นมา
5. กลับไปที่รายการ PR แล้วค้นหาใบด้วยเลขที่ที่จดไว้ และเปิดใบนั้น
**Expected**
กล่องยืนยันหัวข้อเรื่องการอนุมัติของขั้นจัดซื้อเปิดขึ้น · ยืนยันแล้วขึ้น toast "Purchase approved" และหน้าถูกพากลับไปยังรายการ PR · ใบนั้นไม่อยู่ในแท็บงานค้างของ purchaser อีกต่อไป · เปิดใบนั้นซ้ำแล้ว **ไม่มีปุ่ม Edit** สำหรับ purchaser แล้ว และแท็บ Workflow History มีรายการของขั้นจัดซื้อเพิ่มขึ้นหนึ่งรายการ
**⚠️ ย้อนกลับไม่ได้** — ใบที่อนุมัติแล้วใช้ทดสอบซ้ำไม่ได้ ต้อง seed ใหม่ทุกรอบ

---

## TC-PR-070520 — ปฏิเสธทุกแถวแล้วได้ปุ่มไม่อนุมัติทั้งใบแทนปุ่มอนุมัติ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น purchaser; **seed ใบใหม่ทุกรอบ** จนมาถึงขั้นจัดซื้อ; อยู่ในโหมดแก้ไข; ใบมีรายการอย่างน้อย 1 แถวที่ยังไม่มีผู้ขาย
**Steps**
1. ติ๊กทุกแถว แล้วกดปุ่ม Reject บนแถบเครื่องมือ ยืนยันในกล่องที่ขึ้นมา
2. อ่านปุ่มบนแถบสรุปท้ายหน้า
3. กดปุ่มไม่อนุมัติ แล้วยืนยัน
**Expected**
เมื่อทุกแถวถูกทำเครื่องหมายไม่อนุมัติ แถบสรุปท้ายหน้าแสดง **ปุ่มไม่อนุมัติ (แบบทำลาย)** ไม่ใช่ปุ่มอนุมัติ · ไม่มีการเตือนว่ากรอกผู้ขาย/ราคาไม่ครบ เพราะแถวที่ถูกปฏิเสธไม่เข้าเงื่อนไขบังคับกรอก · ยืนยันแล้วขึ้น toast "Purchase request rejected" และกลับไปที่รายการ
**⚠️ ย้อนกลับไม่ได้** — ต้อง seed ใบใหม่ทุกรอบ

---

## TC-PR-070521 — เลือกผู้ขายให้แถวแล้วแถวนั้นถูกทำเครื่องหมายอนุมัติเอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; ใบอยู่ขั้นจัดซื้อและในโหมดแก้ไข; แถวแรกยังไม่มีผู้ขายและสถานะยังเป็นรออยู่
**Steps**
1. จดสถานะที่แสดงในคอลัมน์สถานะของแถวแรก
2. กางแถวแรก แล้วเลือกผู้ขายจากช่อง Vendor (ไม่ต้องกดปุ่ม Approve ใด ๆ)
3. อ่านคอลัมน์สถานะของแถวนั้นอีกครั้ง
**Expected**
เมื่อเลือกผู้ขายแล้ว สถานะของแถวเปลี่ยนเป็น "อนุมัติ" โดยอัตโนมัติ ทั้งที่ยังไม่ได้กดปุ่ม Approve · กรอบแดงของช่อง Vendor (ถ้ามีจากการ validate ก่อนหน้า) หายทันทีที่เลือก · ถ้าล้างค่าผู้ขายออก สถานะจะไม่ถูกเปลี่ยนกลับให้เอง (เขียนค่าเฉพาะตอนเลือกค่าที่ไม่ว่าง)

---

## TC-PR-070522 — แถวที่ถูกปฏิเสธมาจากขั้นก่อนหน้ายังล็อกสำหรับฝ่ายจัดซื้อ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น purchaser; **seed ใบที่ HOD ปฏิเสธไปบางแถวแล้วอนุมัติแถวที่เหลือ** จนใบมาถึงขั้นจัดซื้อ; อยู่ในโหมดแก้ไข
**Steps**
1. หาแถวที่สถานะเป็น "ไม่อนุมัติ" มาแต่เดิม และแถวที่สถานะเป็น "อนุมัติ" มาแต่เดิม
2. ตรวจว่าแต่ละแถวติ๊กเลือกได้หรือไม่
3. กางทั้งสองแถวแล้วตรวจว่าช่อง Vendor / Unit Price แก้ไขได้หรือไม่
**Expected**
แถวที่ **อนุมัติ** มาจากขั้นก่อนหน้า ยังติ๊กได้และช่อง Vendor/Unit Price ยังแก้ไขได้ — เพราะการอนุมัตินั้นเป็นผลของขั้นก่อน ไม่ใช่คำตัดสินของขั้นจัดซื้อ · แถวที่ **ถูกปฏิเสธ** มาจากขั้นก่อนหน้า ติ๊กไม่ได้และช่องในแถวเป็นข้อความอ่านอย่างเดียว · ทั้งสองแถวยังกางดูได้ตามปกติ

---

## TC-PR-070523 — ผู้อนุมัติเข้าโหมดแก้ไข แต่ผู้ขายกับราคาเป็นข้อความอ่านอย่างเดียว
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น HOD (`hod@blueledgers.com`, BU = `BLAVG`); มีใบ PR ที่รออนุมัติอยู่ที่ขั้นของ HOD; อยู่ที่หน้ารายละเอียดของใบนั้น
**Steps**
1. กดปุ่ม Edit
2. กางแถวแรก
3. ตรวจช่อง Vendor, Unit Price และ Exchange Rate ว่าเป็น input หรือข้อความ
4. ตรวจว่าในคอลัมน์จำนวนเงินของแถวปกติ ยังเปลี่ยนสกุลเงินได้หรือไม่
**Expected**
เข้าโหมดแก้ไขได้ตามปกติ และ Approved Qty แก้ได้ · แต่ในแถวที่กาง ช่อง Vendor / Unit Price / Exchange Rate แสดงเป็น **ข้อความอ่านอย่างเดียว** (หรือขีด "—" เมื่อยังว่าง) ไม่ใช่ input — สิทธิ์แก้ราคาเป็นของขั้นจัดซื้อเท่านั้น · ตัวเลือกสกุลเงินในแถวปกติ **ยังเปลี่ยนได้** เพราะผูกกับสถานะโหมดแก้ไข ไม่ได้ผูกกับ role

---

## TC-PR-070524 — ผู้ขอซื้อไม่เห็นปุ่มเทียบราคาและปุ่ม Auto Allocate
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น requestor (`requestor@blueledgers.com`, BU = `BLAVG`); มีใบ PR ที่ตนเองเป็นเจ้าของและยังเป็นฉบับร่าง; อยู่ที่หน้ารายละเอียดในโหมดแก้ไข
**Steps**
1. ตรวจแถบเครื่องมือของตารางรายการว่ามีปุ่ม "Auto Allocate" หรือไม่ และมีปุ่ม Expand All หรือไม่
2. กางแถวแรกด้วยปุ่ม chevron
3. ตรวจว่ามีปุ่ม `aria-label="Compare price"` ในพื้นที่ที่กางออกมาหรือไม่
**Expected**
ไม่มีปุ่ม "Auto Allocate" (ปุ่มนี้มีเฉพาะขั้นจัดซื้อ) และไม่มีปุ่ม Expand All (มีเฉพาะขั้นอนุมัติกับขั้นจัดซื้อ) · แถบเครื่องมือแสดงปุ่ม "Add Item" แทน ซึ่งเป็นปุ่มของขั้นสร้างเอกสาร · ไม่มีปุ่ม "Compare price" ในแถวที่กาง

---

## TC-PR-070525 — ผู้อนุมัติเปิดตารางเทียบราคาได้ แต่ไม่มีปุ่ม Assign
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็น HOD; มีใบ PR ที่รออนุมัติอยู่ที่ขั้นของ HOD และรายการมีสินค้า หน่วย สกุลเงินครบ; อยู่ในโหมดแก้ไข
**Steps**
1. กางแถวแรก แล้วกดปุ่ม "Compare price"
2. อ่านหัวคอลัมน์ทั้งหมดของตาราง
3. ตรวจว่ามีปุ่ม "Assign" ในแถวใดหรือไม่
4. กด Escape เพื่อปิด
**Expected**
กล่อง "Price Comparison" เปิดได้และแสดงข้อมูลราคาครบทุกคอลัมน์ (`#`, Vendor, Pricelist No, Unit, Price, Effective) รวมถึงป้าย Best · **ไม่มีคอลัมน์สุดท้ายและไม่มีปุ่ม Assign เลย** — ผู้อนุมัติดูราคาเพื่อประกอบการตัดสินใจได้ แต่ผูกผู้ขายให้รายการไม่ได้ · ปิดกล่องแล้วค่าในแถวไม่เปลี่ยน

---

## TC-PR-070526 — ฝ่ายจัดซื้อเปิดหน้าสร้างใบสั่งซื้อจากใบขอซื้อได้ด้วยสิทธิ์ของตัวเอง
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็น purchaser; BU `BLAVG` เปิดใช้งานฟีเจอร์ purchase order; ผู้ใช้มี PO workflow ที่เริ่มเอกสารได้อย่างน้อยหนึ่งตัว
**Steps**
1. เปิด `/procurement/purchase-order/from-pr` ตรง ๆ จาก URL
2. รอให้หน้าโหลดเสร็จ
3. อ่านหัวเรื่องของหน้าและแถบขั้นตอน
**Expected**
หน้าเปิดได้ ไม่ถูกเด้งออกและไม่มีกล่องปฏิเสธสิทธิ์ — รายการเมนู purchase order ไม่ได้ผูกกับ permission ใดใน catalog มีแต่เงื่อนไข license ของ BU · เห็นหัวเรื่อง "From PR" พร้อมแถบสองขั้นตอน "Select PRs" → "Review POs" โดยขั้นที่ 1 ถูกเลือกอยู่

---

## TC-PR-070601 — เข้าหน้าสร้าง PO จาก PR ผ่านการ์ด From PR
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น purchaser; อยู่ที่หน้ารายการใบสั่งซื้อ `/procurement/purchase-order`
**Steps**
1. กดปุ่มสร้างใบสั่งซื้อใหม่
2. อ่านการ์ดทั้งหมดในกล่องที่เปิดขึ้น
3. กดการ์ด "From PR"
**Expected**
กล่องเลือกวิธีสร้างเปิดขึ้นพร้อมการ์ด 3 ใบ เรียงเป็น "Blank PO", "From Price List", "From PR" · กด "From PR" แล้วกล่องปิดและเบราว์เซอร์ไปที่ `/procurement/purchase-order/from-pr` (ไม่ได้เปิดกล่องซ้อนอีกใบ) · **หมายเหตุ:** ไม่มีทางเข้าจากหน้าใบ PR โดยตรง — ทางเข้าเดียวคือจากหน้ารายการใบสั่งซื้อ

---

## TC-PR-070602 — ยังไม่เลือก workflow รายการใบขอซื้อไม่โหลดและปุ่ม Filter กดไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; อยู่ที่ `/procurement/purchase-order/from-pr` ขั้นที่ 1 โดยยังไม่เลือกอะไร; ดักจับคำขอที่ URL ลงท้ายด้วย `/purchase-requests/for-po`
**Steps**
1. อ่านเนื้อหาในพื้นที่ตาราง และสถานะของปุ่ม Filter
2. ตรวจว่ามีคำขอ `/purchase-requests/for-po` ถูกยิงไปหรือยัง
3. เลือก workflow ปลายทางจากช่อง "Target workflow"
4. อ่านพื้นที่ตารางและปุ่ม Filter อีกครั้ง
**Expected**
ก่อนเลือก workflow: พื้นที่ตารางเป็นกล่องเส้นประ หัวข้อ "Select a workflow first" คำอธิบาย "Pick the target workflow above before choosing purchase requests." · ปุ่ม Filter **มีอยู่แต่กดไม่ได้** (ไม่ใช่ไม่มีปุ่ม) · ยังไม่มีคำขอ `/purchase-requests/for-po` ถูกยิงเลย · หลังเลือก workflow: คำขอถูกยิงและตารางใบขอซื้อแสดงขึ้นมาพร้อมคอลัมน์ PR No / Date / Requester / Department / PR Workflow / Description และช่องติ๊กหน้าแถว

---

## TC-PR-070603 — กรองรายการใบขอซื้อฝั่งไคลเอนต์โดยที่ใบที่ติ๊กไว้ไม่หลุด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; อยู่ขั้นที่ 1 ของ from-pr และเลือก workflow แล้ว; รายการมีใบขอซื้อจากผู้ขอหรือแผนกอย่างน้อยสองกลุ่ม; ดักจับคำขอ `/purchase-requests/for-po`
**Steps**
1. ติ๊กเลือกใบหนึ่งใบจากกลุ่ม A จดเลขที่ไว้
2. กดปุ่ม Filter แล้วกรองด้วยผู้ขอหรือแผนกของกลุ่ม B เพื่อให้ใบที่ติ๊กหายไปจากตาราง
3. ตรวจว่ามีคำขอ `/purchase-requests/for-po` ถูกยิงซ้ำหรือไม่
4. ล้างตัวกรองทั้งหมด
5. ตรวจสถานะช่องติ๊กของใบที่จดไว้
**Expected**
ตัวเลือกในเมนูกรองมีสามช่อง: ผู้ขอ, แผนก และ PR Workflow · การกรองเกิดขึ้นฝั่งไคลเอนต์ — **ไม่มี**คำขอใหม่ไปที่ `/purchase-requests/for-po` · เมื่อกรองจนไม่เหลือแถว ข้อความว่างเป็นชุด "ไม่พบผลการค้นหา" ไม่ใช่ "No Purchase Requests" · หลังล้างตัวกรอง ใบที่จดไว้กลับมาและ **ยังถูกติ๊กอยู่**

---

## TC-PR-070604 — ติ๊กใบข้าม workflow ระบบถามยืนยันแล้วตัดใบที่ไม่ตรงออก
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น purchaser; อยู่ขั้นที่ 1 ของ from-pr และเลือก workflow ปลายทางแล้ว; รายการมีใบขอซื้อจาก **สอง PR workflow ที่ต่างกัน** อย่างน้อยฝั่งละหนึ่งใบ
**Steps**
1. ติ๊กใบจาก workflow A จดเลขที่ไว้
2. ติ๊กใบจาก workflow B
3. อ่านกล่องที่ขึ้นมา แล้วกดยืนยัน
4. ตรวจสถานะช่องติ๊กของทั้งสองใบ
**Expected**
กล่องยืนยันหัวข้อ "Requests use different approval flows" ขึ้นมาทันทีที่ติ๊กใบที่สอง พร้อมคำอธิบายที่ระบุชื่อ workflow ของใบที่เพิ่งติ๊ก · กดยืนยันแล้ว **เหลือเฉพาะใบของ workflow B (ใบที่เพิ่งติ๊ก)** ส่วนใบของ workflow A ถูกเอาติ๊กออก · ถ้าปิดกล่องโดยไม่ยืนยัน การติ๊กใบที่สองไม่มีผล ใบของ workflow A ยังถูกติ๊กอยู่เหมือนเดิม

---

## TC-PR-070605 — ปุ่ม Next ปิดจนกว่าจะเลือกทั้ง workflow และใบขอซื้ออย่างน้อยหนึ่งใบ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น purchaser; เพิ่งเปิด `/procurement/purchase-order/from-pr` โดยยังไม่เลือกอะไร; มีใบขอซื้อรอทำใบสั่งซื้ออย่างน้อย 1 ใบ
**Steps**
1. อ่านสถานะปุ่ม Next ตอนยังไม่เลือกอะไร
2. เลือก workflow ปลายทาง แล้วอ่านสถานะปุ่ม Next อีกครั้ง
3. ติ๊กใบขอซื้อหนึ่งใบ แล้วอ่านสถานะปุ่ม Next
4. เอาติ๊กออก แล้วอ่านอีกครั้ง
**Expected**
ปุ่ม Next ถูกปิดทั้งในขั้นตอนที่ 1 และ 2 (เลือก workflow อย่างเดียวยังไม่พอ) · เปิดใช้งานเฉพาะเมื่อมีทั้ง workflow และใบที่ติ๊กอย่างน้อยหนึ่งใบ · เอาติ๊กออกแล้วปุ่มปิดกลับทันที · ตลอดเวลานี้ไม่มีปุ่ม Confirm บนหัวหน้า (ปุ่มนั้นมีเฉพาะขั้นที่ 2)

---

## TC-PR-070606 — ขั้นรีวิวแยกใบสั่งซื้อตามผู้ขาย พร้อมยอดรวมใหญ่สกุลหลัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; **seed ใบขอซื้ออย่างน้อย 2 ใบจาก workflow เดียวกัน** ที่ผ่านขั้นจัดซื้อแล้วและระบุผู้ขายไว้คนละเจ้า; อยู่ขั้นที่ 1 ของ from-pr และเลือก workflow แล้ว
**Steps**
1. ติ๊กใบขอซื้อทั้งสองใบ
2. กด Next แล้วรอการจัดกลุ่ม
3. อ่านหัวคอลัมน์และแถวทั้งหมดในตารางรีวิว
4. อ่านแถบยอดรวมใหญ่ใต้ตาราง
**Expected**
ไปยังขั้นที่ 2 "Review POs" · ตารางมีคอลัมน์ PR Ref, Vendor, Delivery Date, Total (และเลขลำดับ) · **หนึ่งแถว = หนึ่งใบสั่งซื้อที่จะถูกสร้าง** แยกตามผู้ขาย — ผู้ขายคนละเจ้าต้องได้คนละแถว · มีบรรทัดบอก "Target workflow" ที่เลือกไว้เหนือตาราง · แถบท้ายตารางแสดง "Grand Total" ที่เท่ากับผลรวมของยอดทุกใบหลังคูณอัตราแลกเปลี่ยนแล้ว กำกับด้วยรหัสสกุลหลักของโปรไฟล์ · ปุ่ม Confirm ปรากฏบนหัวหน้าแล้ว

---

## TC-PR-070607 — กางแถวใบสั่งซื้อในขั้นรีวิวเพื่อดูรายการสินค้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น purchaser; อยู่ขั้นที่ 2 ของ from-pr โดยมีใบสั่งซื้ออย่างน้อยหนึ่งแถวที่มีสินค้ามากกว่าหนึ่งรายการ
**Steps**
1. กดปุ่มลูกศรกางของแถวแรก
2. อ่านตารางย่อยที่เปิดออกมา
3. กดปุ่มเดิมอีกครั้งเพื่อหุบ
**Expected**
ตารางย่อยเปิดออกมาพร้อมคอลัมน์ Product, Quantity, Price (`<รหัสสกุลของใบนั้น>`), Total (`<รหัสสกุลของใบนั้น>`) · จำนวนแถวในตารางย่อยเท่ากับจำนวนสินค้าในใบสั่งซื้อนั้น และผลรวมคอลัมน์ Total เท่ากับค่าในคอลัมน์ Total ของแถวแม่ · `aria-label` ของปุ่มสลับระหว่าง "Expand" และ "Collapse" ตามสถานะ · กดหุบแล้วตารางย่อยหายไปโดยไม่กระทบแถวอื่น

---

## TC-PR-070608 — ยืนยันแล้วสร้างใบสั่งซื้อจริงและหน้าสรุปแทนที่ทั้งหน้า
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น purchaser; **seed ใบขอซื้อชุดใหม่ทุกรอบ** ที่ผ่านขั้นจัดซื้อแล้ว; อยู่ขั้นที่ 2 ของ from-pr โดยจดจำนวนแถว (จำนวนใบสั่งซื้อที่จะเกิด) และจำนวน PR ที่เลือกไว้
**Steps**
1. กดปุ่ม Confirm บนหัวหน้า
2. อ่านข้อความในกล่องยืนยัน
3. กดยืนยัน
4. อ่านหัวเรื่อง คำบรรยาย และตารางของหน้าที่แสดงขึ้นมา
5. กดลิงก์เลขที่ใบสั่งซื้อของแถวแรก
**Expected**
กล่องยืนยันหัวข้อ "Create purchase orders?" ระบุจำนวนใบสั่งซื้อที่จะสร้างและจำนวนใบขอซื้อที่ใช้ ตรงกับที่จดไว้ พร้อมเตือนว่าใบขอซื้อที่ใช้แล้วเลือกซ้ำไม่ได้ · ยืนยันแล้วขึ้น toast แจ้งสร้างสำเร็จ และ **หน้าทั้งหน้าถูกแทนด้วยหน้าสรุป** — ไม่เหลือแถบขั้นตอน ปุ่ม Cancel/Back/Confirm เดิม และ **ไม่ถูกเด้งกลับไปหน้ารายการ** · หน้าสรุปแสดง "`<n>` purchase orders created" และบรรทัด "From `<n>` purchase requests · `<n>` lines" · ตารางมีคอลัมน์ PO No (เป็นลิงก์), Vendor, Delivery Date, Items, Qty, Subtotal, Tax, Total · กดลิงก์แล้วไปที่ `/procurement/purchase-order/<uuid>` ของใบนั้น
**⚠️ สร้างของจริง ย้อนกลับไม่ได้** — ใบสั่งซื้อที่เกิดขึ้นลบจากหน้านี้ไม่ได้ และใบขอซื้อที่ใช้ไปถูกตัดออกจากรายการถาวร

---

## TC-PR-070609 — ใบขอซื้อที่ถูกใช้สร้างใบสั่งซื้อแล้ว ไม่กลับมาในรายการอีก
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
รันต่อจาก `TC-PR-070608` ในชุดแบบเรียงลำดับ (ใช้ seed ชุดเดียวกัน) โดยจดเลขที่ใบขอซื้อที่ถูกใช้ไว้
**Steps**
1. จากหน้าสรุป กดปุ่มกลับไปหน้ารายการใบสั่งซื้อ
2. เข้า `/procurement/purchase-order/from-pr` อีกครั้ง
3. เลือก workflow ตัวเดิม
4. ค้นหาเลขที่ใบขอซื้อที่จดไว้ในตาราง
**Expected**
ใบขอซื้อที่ถูกใช้สร้างใบสั่งซื้อไปแล้ว **ไม่ปรากฏในรายการอีก** · ถ้าใบเหล่านั้นเป็นใบเดียวที่มีอยู่ พื้นที่ตารางแสดงกล่องว่าง "No Purchase Requests" / "No purchase requests available." ซึ่งเป็นคนละชุดข้อความกับกรณีกรองจนไม่เหลือแถว
**⚠️ ขึ้นกับสถานะที่แก้ไม่ได้** — ต้อง seed ใบขอซื้อชุดใหม่ทุกรอบ

---

## TC-PR-070610 — ออกจากหน้ากลางคันหลังเลือกไว้แล้ว ระบบเตือนก่อนทิ้งงาน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น purchaser; อยู่ขั้นที่ 1 ของ from-pr; มีใบขอซื้อรอทำใบสั่งซื้ออย่างน้อย 1 ใบ
**Steps**
1. ยังไม่เลือกอะไร กดปุ่ม Cancel แล้วสังเกตว่ามีกล่องเตือนหรือไม่
2. กลับเข้าหน้าเดิม เลือก workflow และติ๊กใบขอซื้อหนึ่งใบ
3. กดปุ่มลูกศรย้อนกลับที่หัวหน้า (หรือปุ่ม Cancel)
4. อ่านกล่องที่ขึ้นมา แล้วเลือกยกเลิก
5. กดอีกครั้งแล้วยืนยันทิ้งงาน
**Expected**
ขั้นตอนที่ 1 ออกจากหน้าได้ทันทีโดยไม่มีกล่องเตือน (ยังไม่มีอะไรจะเสีย) · หลังเลือก workflow หรือติ๊กใบแล้ว การออกจากหน้าเปิดกล่องเตือนทิ้งงานแบบคำเตือน · เลือกยกเลิกแล้วยังอยู่หน้าเดิมและสิ่งที่เลือกไว้ยังอยู่ครบ · ยืนยันแล้วกลับไปที่ `/procurement/purchase-order` · **ไม่มี**ใบสั่งซื้อใดถูกสร้างขึ้นตลอดเคสนี้
