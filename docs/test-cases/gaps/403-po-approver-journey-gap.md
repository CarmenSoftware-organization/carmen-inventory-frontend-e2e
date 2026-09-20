# Purchase Order — เส้นทางผู้อนุมัติ (PO Approver Journey) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของเส้นทางนี้ — เคสที่ครอบแล้ว (เปิดหน้ารายละเอียด PO ที่สถานะ IN PROGRESS, ช่องผู้ขายอ่านอย่างเดียว, ปุ่ม Edit/Comment ปรากฏ, เข้าโหมดแก้ไขแล้วติ๊กแถวจนแถบตัดสินโผล่, ติดป้าย Approve/Review/Reject รายแถว, ปุ่มตัดสินท้ายใบ, กล่องยืนยัน Approve/Send Back/Reject, ยืนยัน Approve แล้ว PATCH สำเร็จ, Golden Journey FC→GM) ถูกทดสอบจริงอยู่ใน `tests/403-po-approver-journey.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/403-po-approver-journey.md`_

**Module:** Procurement — Purchase Order (มุมผู้อนุมัติ ที่ **หน้ารายละเอียดใบสั่งซื้อ**)
**Frontend route:** `routes/procurement/purchase-order/` (`purchase-order-edit.route.tsx` → `po-edit-content.tsx` → `po-form.tsx` + `po-header.tsx` + `po-item-fields.tsx` + `use-po-item-table.tsx` + `po-footer-action.tsx` + `po-action-dialog.tsx` + `use-po-form-handlers.ts`)  •  **URL:** `/procurement/purchase-order/<uuid>`
**Prefix:** `PO` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/403-po-approver-journey.spec.ts`, `tests/402-po-purchaser-journey.spec.ts`, `tests/401-po.spec.ts`
**Total test cases:** 49

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **🔴 เทสกลวงที่ยืนยันด้วยตาแล้ว (ต้องอ่านก่อนใช้ไฟล์นี้)** — `tests/403-po-approver-journey.spec.ts:32-36`, `:52-54`, `:78-80` ยิง `page.goto("/procurement/my-approvals")` (มี `.catch()` fallback เป็น `/procurement/purchase-requests/my-approvals`) **ทั้งสองเส้นทางไม่มีอยู่ใน router** — `routes/router.tsx` มีเพียง `path: "approval"` ใต้ `procurement` (`routes/router.tsx:272-273`) และมี catch-all `{ path: "*", lazy: () => import("./not-found/not-found.route") }` (`routes/router.tsx:853`) ⇒ เบราว์เซอร์ได้หน้า 404 ของแอป **แต่ `page.goto()` ไม่ throw** (SPA คืน `index.html` เสมอ) จึงไม่เข้า `.catch()` เลย และ URL ยังค้างที่ `/procurement/my-approvals` · assertion เดียวของ `TC-PO-070101` คือ `await expect(page).toHaveURL(/approval|dashboard/i)` ซึ่งสตริง `"my-approvals"` **มีคำว่า `approval` อยู่ในตัว** จึงผ่าน regex ทันทีทั้งที่หน้าจอเป็น 404 ⇒ **`TC-PO-070101` เป็นเทสกลวงเต็มตัว** · `TC-PO-070102` ยิง URL เดียวกันแล้วหา `role="tab"` ซึ่งไม่มีบนหน้า 404 → `fcTest.skip(...)` ทุกครั้ง · `TC-PO-070103` seed PO จริงแต่ไปหาแถวบนหน้า 404 → `fcTest.skip(...)` ทุกครั้ง **สรุป: เคสทั้งสามที่ผูกกับหน้าคิวในสเปกนี้ยังไม่ได้ครอบอะไรจริงเลย** (บันทึกเป็นข้อเท็จจริง ไม่มีเคสในไฟล์นี้ที่ assert ว่า "ฟีเจอร์นี้พัง")
> - **เคสทดแทนที่ใช้ URL ที่ถูกต้อง** — งานฝั่ง "หน้าคิว" ที่ใช้ `/procurement/approval` มีที่อยู่แล้วใน `docs/test-cases/gaps/201-my-approvals-gap.md` (`TC-MA-020101` เปิดใบ PO จากคิวไปหน้ารายละเอียด, `TC-MA-020104` กด Back กลับคิวโดยสถานะคงเดิม, `TC-MA-020105` อนุมัติแล้วใบหลุดจากคิว) **ไฟล์นี้จึงไม่เขียนซ้ำ** และเก็บไว้เพียงเคสเดียวที่เป็นของเส้นทาง PO โดยเฉพาะและไม่มีในไฟล์นั้นคือ `TC-PO-070449` (ใบหลุดจากคิวของ FC แล้วไปโผล่ในคิวของ GM) ส่วนเคสที่เหลือทั้งหมดในไฟล์นี้อยู่ที่ **หน้ารายละเอียด PO** ตามขอบเขตที่ตกลงกันไว้
>
> **ช่วงเลขที่เลือก** — `PO` section `07` (persona journey ของผู้อนุมัติ) ถูกใช้ไปแล้วที่ `070001`, `070101–070103`, `070201–070203`, `070301–070312`, `070901` ⇒ ไฟล์นี้ใช้ **`TC-PO-070401–070449`** ต่อเนื่องกันทั้งไฟล์ ไม่ทับกับเลขใดในทั้ง `tests/` และ `docs/` (รวมถึง `gaps/401-po-create-flows-gap.md` ที่ใช้ `060601–060613` / `060701–060716`) **ไม่ต้องแก้ `docs/test-id-scheme.md`**
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `TC-PO-070201` (เปิดหน้ารายละเอียดแล้วป้ายสถานะเป็น IN PROGRESS), `TC-PO-070202` (ช่องผู้ขายอ่านอย่างเดียวในโหมดอ่าน), `TC-PO-070203` (ปุ่ม Edit + Comment ปรากฏ), `TC-PO-070301` (เข้าโหมดแก้ไข ติ๊กแถว แล้วแถบตัดสินโผล่), `TC-PO-070302/070303/070304` (ติดป้าย Approved / Review / Reject รายแถว), `TC-PO-070305` (ทุกแถว Approved แล้วปุ่ม Approve ท้ายใบใช้งานได้), `TC-PO-070306` (กล่องยืนยัน Approve และข้อความในกล่อง), `TC-PO-070307` (ยืนยันแล้ว PATCH `/approve` สำเร็จ), `TC-PO-070308/070309` (กล่อง Send Back และการยืนยัน), `TC-PO-070310` (กล่อง Reject พร้อมช่องเหตุผล), `TC-PO-070312` (กด Cancel ตอนยังไม่ติ๊กอะไร), `TC-PO-070901` (Golden Journey FC → GM) · `TC-PO-070311` ถูกทำเครื่องหมาย `fcTest.fixme` ไว้ — ไฟล์นี้ **ไม่** เขียนเคสที่ยืนยันว่ามันพัง และ **ไม่** เขียนเคสซ้ำกับมัน
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้**
> 1. **"ผู้อนุมัติ" คือ role ที่ backend ติดมากับเอกสาร ไม่ใช่สิทธิ์ของผู้ใช้** — `po-form.tsx:74` อ่าน `purchaseOrder?.role` (ค่าจาก `types/stage-role.ts:1-7` = `create | approve | purchase | issue | view_only`) และ `po-footer-action.tsx:126-127` นิยาม `isApprover = role === STAGE_ROLE.APPROVE && poStatus === PO_STATUS.IN_PROGRESS` ⇒ คนเดียวกันเป็นผู้อนุมัติบนใบหนึ่งแต่เป็น `view_only` บนอีกใบได้ · ฝั่งเมนู leaf `purchaseOrder` ใน `constant/module-list.ts:157-163` มีแต่ `licenseFeature` **ไม่มี `permission`** ⇒ ไม่มี RBAC guard ระดับหน้า ทุก role ที่มี license เปิด URL ได้ สิ่งที่ต่างคือปุ่มที่ backend อนุญาตผ่านค่า `role`
> 2. **การอนุมัติ PO ไม่ใช่ปุ่มเดียว** — `computePoAction(itemStatuses)` (`constant/purchase-order.ts:45-54`) ตัดสินว่าท้ายใบจะโชว์ปุ่มอะไร โดยเรียงลำดับความสำคัญแบบนี้เป๊ะ: มีแถว `review` แม้แถวเดียว → `"review"` (Send Back) · มีแถว `pending` หรือสตริงว่าง → `"none"` (ไม่มีปุ่ม) · มีแถว `approved` → `"approved"` · ทุกแถวเป็น `rejected` → `"rejected"` ⇒ **ใบที่ผสมอนุมัติกับปฏิเสธจะได้ปุ่ม Approve ไม่ใช่ Reject** และ **ใบที่เพิ่งถูกส่งมามีทุกแถวเป็น `""` จึงไม่มีปุ่มท้ายใบเลยจนกว่าจะติดป้ายรายแถวครบ** (`po-footer-action.tsx:99-103, 128-131`)
> 3. **ช่องติ๊กรายแถวคือ "การกระทำ" ป้ายสถานะคือ "ข้อมูล"** — `po-item-fields.tsx:79-84`: `showApproveCheckbox = isEditMode && poStatus !== "draft"` แต่ `showStatusBadge = poStatus !== "draft"` เฉย ๆ ⇒ โหมดอ่านเห็นสถานะรายแถวได้แต่ติ๊กไม่ได้ · `use-po-item-table.tsx:331-342` เติมคอลัมน์ `selectColumn()` (`components/ui/data-grid/columns.tsx:27-42` — มีหัวตาราง `DataGridTableRowSelectAll` = ติ๊กทั้งหมด) และ `:375` ตั้ง `enableRowSelection: showApproveCheckbox`
> 4. **ผู้อนุมัติแก้เนื้อใบไม่ได้แม้อยู่ในโหมดแก้ไข** — `po-form.tsx:80` `isReadOnly = role === STAGE_ROLE.APPROVE || terminalStatus` และ `:183` `isDisabled = (isView && role !== APPROVE) || isPending` · `po-item-fields.tsx:74` `readOnly = role === STAGE_ROLE.APPROVE` ทำให้ `use-po-item-table.tsx:135-138` ตั้ง `showAction = false` / `viewMode = true` ⇒ เซลล์ทุกช่องเป็นตัวหนังสือ · `:246` ปุ่ม "เพิ่มรายการ" ผูกกับ `(!role || role === STAGE_ROLE.CREATE)` จึงไม่มีให้ผู้อนุมัติ · `po-form.tsx:205-208` ปิดช่องคลังในโหมดอ่านด้วย (`locationsDisabled = isDisabled || isFromPr || isView`) พร้อมคอมเมนต์อธิบายว่าการยกเว้นผู้อนุมัติเคยรั่วมาถึงช่องนี้
> 5. **แถวของผู้อนุมัติมีปุ่มประวัติแทนปุ่มลบ และช่องหมายเหตุปิดอยู่** — `use-po-item-table.tsx:162-169` สลับ `PoItemDeleteButton` (โหมดแก้ไขของผู้สร้าง) กับ `PoItemHistoryButton` (`:62-78` — แสดงเฉพาะเมื่อ `item.history` ไม่ว่าง) · ช่องหมายเหตุรายแถวเป็น `Input` ที่ `disabled={isDisabled}` โดยส่ง `isDisabled={viewMode}` มา (`po-item-cells/comment-footer-row.tsx:41-48`, `use-po-item-table.tsx:153-160`) ⇒ ผู้อนุมัติพิมพ์ไม่ได้
> 6. **ปุ่มตัดสินหมู่มีสามปุ่มและทำงานไม่เหมือนกัน** — `po-item-fields.tsx:264-330`: **Approve** (`:269-282` → `handleBulkApprove` `:187-193`) และ **Review** (`:283-296` → `handleBulkReview` `:195-201`) เปลี่ยนสถานะทันที **ไม่มีกล่องยืนยัน** ส่วน **Reject** (`:297-310`) เปิดกล่องยืนยัน (`setBulkAction("reject")` → `:433-443` + config `:232-237`) ที่มีช่องเหตุผลเดียวซึ่ง `handleBulkActionConfirm` (`:203-215`) เอา `messages[0]` ไปใส่ **ทุกแถวที่ติ๊ก** · ทั้งสามเส้นทางจบด้วย `table.resetRowSelection()` ⇒ การติ๊กหายหลังกด · เงื่อนไขปุ่ม: `canBulkAct = isApprover && isEditMode && selectedRows.length > 0` (`:184`) และ `showBulkActions` (`:185`)
> 7. **ล้างสถานะรายแถวได้** — `po-item-fields.tsx:94-97` ส่ง `canResetStatus = isApprover && isEditMode` ลงไปถึง `po-item-cells/status-cell.tsx` ซึ่งแสดงปุ่มกากบาท `aria-label="Reset status"` ใน tooltip เฉพาะเมื่อ `canReset && status !== "pending"` (`:35, :44-52`) และกดแล้วตั้งกลับเป็น `pending` (`:29-32`) ⇒ ล้างแถวเดียวก็ทำให้ `computePoAction` ตกกลับเป็น `"none"` และปุ่มท้ายใบหายไป
> 8. **กล่อง Send Back บังคับเลือกขั้นปลายทาง** — `po-action-dialog.tsx:121-122` `stageRequired = hasStages && !selectedStage` และ `:294` `disabled={isPending || stageRequired}` ⇒ ปุ่มยืนยันปิดจนกว่าจะเลือก radio ขั้นใดขั้นหนึ่ง · ตัวเลือกมาจาก `usePoPreviousStages` (`routes/procurement/shared/use-purchase-order.ts:337-359` — `GET .../<id>/previous-stages` คืน object `{ "1": "Create Request", ... }` แล้วแปลงเป็น array) · กล่องยังโชว์ป้ายจำนวนรายการที่ถูกตีกลับ (`:163-170`, มาจาก `reviewItems` ใน `po-footer-action.tsx:105-111` ที่กรองเฉพาะแถว `current_stage_status === "review"`) และช่องเหตุผล **แยกต่อรายการ** (`:221-258`, `maxLength=256`)
> 9. **กล่องยืนยันของ Approve ไม่มีช่องเหตุผล แต่กล่อง Reject มี (และไม่บังคับ)** — `po-footer-action.tsx:274-289` ส่ง `showMessage={false}` ให้กล่องยืนยันรวม (ที่ Approve/Submit ใช้) · ส่วนกล่อง Reject ท้ายใบเป็นคนละตัว เปิดจาก `po-form.tsx:333-344` ผ่าน `dialogs.setShowReject(true)` และใช้ค่า default `showMessage = true` (`po-action-dialog.tsx:107`) จึง render ช่องเหตุผลเดี่ยวที่ติดป้าย `(optional)` (`:260-279`) และ **ไม่มี** RadioGroup ขั้นปลายทาง (ไม่ได้ส่ง `stages` มา)
> 10. **กล่องยืนยันทุกตัวเป็น Radix AlertDialog** (`po-action-dialog.tsx:13-21, 142-146`) ⇒ `role="alertdialog"` ซึ่ง `getByRole("dialog")` **ไม่แมตช์** (ดู `tests/pages/my-approvals.page.ts` `confirmDialogButton` และ `reference_playwright_hang_traps.md`) · ปิดกล่องแล้วสถานะในกล่องถูกล้างทิ้งทั้งหมด (`:128-140` — `setMessages({})` + `setSelectedStage("")`)
> 11. **ผลลัพธ์ของสามการกระทำไม่เหมือนกัน** — `use-po-form-handlers.ts`: **Approve** (`:463-479`) → `onSuccessList(t("approved"))` = toast แล้ว `navigate("/procurement/purchase-order")` (`:272-275`) ⇒ **ออกจากหน้า** · **Reject** (`:481-504`) → toast + `setShowReject(false)` + `setMode("view")` ⇒ **อยู่หน้าเดิม** · **Send Back** (`:506-532`) → toast + `setMode("view")` ⇒ **อยู่หน้าเดิม** · ข้อความ toast อยู่ที่ `messages/en.json:3857-3859` = `"Purchase order approved"` / `"Purchase order rejected"` / `"Purchase order sent back"`
> 12. **ทุก action ดึง PO สดก่อนยิงเสมอ** — `fetchFreshPo()` (`use-po-form-handlers.ts:226-256`) + `resolveDocVersion()` (`:257-262`) แนบ `doc_version` ไปกับ payload ทุกครั้ง เพราะ backend ล็อกแบบ optimistic ทั้งหัวเอกสารและราย row (`tb_purchase_order` / `tb_purchase_order_detail`) — สอดคล้องกับบันทึก `project_config_update_doc_version` · เลขรุ่นนี้โชว์อยู่บนหัวใบด้วย (`po-header.tsx:116-120`)
> 13. **ปุ่มบนหัวใบของผู้อนุมัติ** — `po-header.tsx:141-151` Edit (เงื่อนไข `isView && canEdit` โดย `canEdit = !isViewOnly && !terminalStatus` จาก `po-form.tsx:82`) · `:152-173` Cancel + Save ในโหมดแก้ไข · `:174-184` **Delete โผล่ให้ทุกคนที่ `canEdit` รวมถึงผู้อนุมัติ** (กล่องยืนยันอยู่ที่ `po-form.tsx:290-299` ข้อความจาก `messages/en.json:3737-3738` ซึ่งอ้างเลขที่ใบ) · `:185-195` Send Email โผล่เฉพาะสถานะใน `SEND_EMAIL_STATUSES` (`:25-31` = approved / sent_or_print / partial / closed / completed) จึง **ไม่มี** บนใบ `in_progress` · `:128-140` Close ผูกกับ `canClose` (`po-form.tsx:89-93`) จึงไม่มีบนใบ `in_progress` เช่นกัน · `:196-211` เมนู ⋯ (`components/share/doc-actions-menu.tsx:94-130`) มี Comment / Activity / Print โดย Print ส่งมาเฉพาะโหมดอ่าน
> 14. **แถบขั้นตอนบนหัวใบกดได้** — `po-header.tsx:259-275` render `WorkflowTrack` (ขั้นก่อนหน้า / ปัจจุบัน / ถัดไป) ห่อด้วย `WorkflowStepButton` (`components/share/workflow-step-button.tsx:15-35`) ซึ่งกลายเป็น `<button aria-label=...>` **เฉพาะเมื่อ `hasHistory`** (`po-form.tsx:87`) ไม่งั้นคืน children เปล่า ๆ · กดแล้วเปิด Sheet ประวัติ (`po-form.tsx:308-332`, หัวเรื่องจาก `messages/en.json:3714`)
> 15. **แถบสรุปยอดท้ายใบแสดงให้ผู้อนุมัติเสมอ** — `po-footer-action.tsx:133-137` `showBar = isEditMode || showActions || hasItems` และ `:141-176` แสดงห้าช่อง Subtotal / Discount / Net / Tax / Grand total โดยคำนวณจาก `computeItemPricing` ตัวเดียวกับที่ตารางใช้ (`:75-97`)
> 16. **เปิดใบที่ไม่มีสิทธิ์/ไม่มีอยู่** — `po-edit-content.tsx:16-25` แสดง `FormSkeleton` ระหว่างโหลด แล้วถ้า `error || !purchaseOrder` จะแสดง `ErrorState` พร้อม `notFoundMessage = "Purchase order not found"` (`messages/en.json:3739`) และปุ่มกลับไป `/procurement/purchase-order` · query ผูกกับ `buCode` ⇒ สลับ BU แล้วเปิด id เดิมได้ผลเดียวกัน
> 17. **ยกเลิกงานที่ค้าง** — ติ๊กแถวทำให้ `form.setValue` ⇒ ฟอร์ม dirty · `handleCancel` (`use-po-form-handlers.ts:198-207`) และ `handleBack` (`:215-221`) เรียก `discard.confirm(...)` เมื่ออยู่โหมดแก้ไข ⇒ ขึ้นกล่องยืนยันทิ้งงานก่อน แล้วจึง `form.reset(defaultValues)` + กลับโหมดอ่าน · Back จากโหมดอ่านไปหน้ารายการทันทีโดยไม่ถาม (`:209-213`)
>
> **Role / ข้อมูลที่ต้องเตรียม**
> - **เวิร์กโฟลว์ General PO ของ BU `BLAVG` คือ Create Request (`purchase@blueledgers.com`) → FC (`fc@blueledgers.com`) → GM (`gm@blueledgers.com`) → Completed** ตามที่ `tests/pages/po-approver.helpers.ts` บันทึกไว้ (ดู doc comment ของ `approveAsFC` / `approveAsGM`) ⇒ **default role ของไฟล์นี้คือ FC** ซึ่งเป็นขั้นอนุมัติแรก และใช้ **GM** เมื่อต้องการ "ผู้อนุมัติขั้นถัดไป" · ทุกบัญชีที่อ้างถึงมีอยู่จริงใน `tests/test-users.ts` และ BU คือ `BU_CODE = "BLAVG"`
> - **ทุกเคสในไฟล์นี้ต้อง seed ใบเองด้วย `submitPOAsPurchaser(browser)`** (`tests/pages/po-approver.helpers.ts`) ซึ่งเปิด context ของ Purchaser จาก storageState สร้างใบ + 1 รายการ แล้วรอ PATCH `.../submit` จริง ⇒ ได้ใบที่สถานะ `in_progress` และค้างอยู่ที่ขั้นของ FC · **ห้ามพึ่งใบที่มีอยู่แล้วใน BU** เพราะไม่รู้ว่ามันค้างอยู่ขั้นไหน
> - **เคสที่ต้องมี ≥ 2 รายการในใบ** (สำหรับผสมสถานะรายแถว / ติ๊กหลายแถว): `070416`, `070417`, `070419`, `070420`, `070423`, `070424`, `070425`, `070426`, `070427`, `070431` — `submitPOAsPurchaser` ปัจจุบันสร้างแค่ 1 รายการ (`createDraftOnPage` เรียก `addItemToPO` ครั้งเดียว) ⇒ ต้องขยาย helper ให้รับจำนวนรายการ หรือเพิ่มรายการในฐานะ Purchaser ก่อนส่ง
> - **เคสที่ต้องใช้สองบัญชีพร้อมกัน**: `070440`, `070443`, `070444`, `070449` (FC + GM), `070442` (FC + Purchaser), `070445` (Purchaser เปิดใบที่ส่งแล้ว)
> - **เคสที่ต้องมีคอมเมนต์อยู่บนใบก่อน**: `070405` (เปิด Activity) — ไม่บังคับ แต่ทำให้ assert ได้แน่นกว่า
> - **เคสที่ต้องมีบัญชีสังกัดมากกว่าหนึ่ง BU**: `070447`
>
> **🚫 Blocker — เคสที่เปลี่ยนสถานะเอกสารถาวรและย้อนไม่ได้**
> - **ต้อง seed ใบใหม่ทุกรอบด้วย `submitPOAsPurchaser()` ห้ามใช้ซ้ำและห้ามพึ่งข้อมูลที่มีอยู่ใน BU**: `070436` (Approve สำเร็จ), `070437` (Reject สำเร็จ), `070438` (Send Back สำเร็จ), `070439` (เปิดใบที่ตัวเองอนุมัติแล้วซ้ำ), `070440` (GM เห็นปุ่มหลัง FC อนุมัติ), `070441` (ใบที่อนุมัติครบทุกขั้น — ต้อง `seedApprovedPO()`), `070442` (ใบที่ถูกตีกลับกลับไปหาผู้สร้าง), `070443` (ประวัติ workflow หลังอนุมัติ), `070444` (ผู้อนุมัติขั้นหลังเปิดใบที่ยังไม่ถึงขั้นของตน — ใช้ใบที่ยังไม่ถูกตัดสินก็ได้ แต่ต้องเป็นใบใหม่), `070449` (ใบย้ายจากคิว FC ไปคิว GM)
> - **เคสที่ติดป้ายรายแถวแต่ยังไม่ยืนยันทั้งใบ** (`070415–070435`) **ไม่** เปลี่ยนสถานะในฐานข้อมูล — การติดป้ายอยู่ใน form state ของหน้าเท่านั้น (`form.setValue` ใน `po-item-fields.tsx:187-215`) การกด Cancel หรือออกจากหน้าโดยไม่ยืนยันจะทิ้งไปทั้งหมด ⇒ **รันซ้ำบนใบเดิมได้** แต่ยังต้อง seed ใบที่สถานะ `in_progress` อยู่ดี
> - **เคสอ่านอย่างเดียวล้วน ๆ** (`070401–070414`, `070445–070448`) รันซ้ำได้ไม่จำกัด
> - `070446` ต้องกดปุ่ม Delete จริงเพื่อให้กล่องยืนยันเปิด แต่ **ต้องกด Cancel เท่านั้น** — ห้ามยืนยันลบ ไม่งั้นใบที่ seed ไว้หายและเคสถัดไปในไฟล์เดียวกันพัง
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PO-070401 | แถบขั้นตอนบนหัวใบแสดงขั้นก่อนหน้า ปัจจุบัน และถัดไป | Medium | Functional |
| TC-PO-070402 | กดแถบขั้นตอนเปิดแผงประวัติเวิร์กโฟลว์ | Medium | Functional |
| TC-PO-070403 | หัวใบแสดงสถานะ ประเภทใบ และเลขรุ่นเอกสาร | Low | Functional |
| TC-PO-070404 | เมนู ⋯ ของผู้อนุมัติมี Comment / Activity / Print ในโหมดอ่าน | Medium | Functional |
| TC-PO-070405 | เปิดแผง Activity ของใบจากเมนู ⋯ | Medium | Functional |
| TC-PO-070406 | ผู้อนุมัติไม่เห็นปุ่ม Send Email และ Close บนใบที่ยังอยู่ระหว่างอนุมัติ | Medium | Authorization |
| TC-PO-070407 | ช่องหัวใบยังแก้ไม่ได้แม้ผู้อนุมัติเข้าโหมดแก้ไขแล้ว | High | Authorization |
| TC-PO-070408 | ช่องคลังของรายการเป็นข้อความในโหมดอ่าน ไม่ใช่ตัวเลือก | Medium | Functional |
| TC-PO-070409 | ช่องติ๊กรายแถวและช่องติ๊กทั้งหมดโผล่เฉพาะในโหมดแก้ไข | High | Functional |
| TC-PO-070410 | ป้ายสถานะรายแถวแสดงตั้งแต่โหมดอ่าน | Medium | Functional |
| TC-PO-070411 | เซลล์จำนวนและราคาเป็นตัวหนังสือ ผู้อนุมัติแก้ไม่ได้แม้ในโหมดแก้ไข | High | Authorization |
| TC-PO-070412 | ช่องหมายเหตุรายแถวปิดอยู่สำหรับผู้อนุมัติ | Medium | Authorization |
| TC-PO-070413 | แถวของผู้อนุมัติแสดงปุ่มประวัติรายการแทนปุ่มลบ | Medium | Functional |
| TC-PO-070414 | ผู้อนุมัติไม่มีปุ่มเพิ่มรายการ | Medium | Authorization |
| TC-PO-070415 | แถบปุ่มตัดสินหมู่โผล่และหายตามการติ๊ก และมีครบสามปุ่ม | High | Functional |
| TC-PO-070416 | ติ๊กหลายแถวแล้วกด Approve ครั้งเดียว ทุกแถวเปลี่ยนสถานะและการติ๊กถูกล้าง | High | Functional |
| TC-PO-070417 | กด Review หมู่ ทุกแถวที่ติ๊กเป็น Review โดยไม่มีกล่องยืนยัน | Medium | Functional |
| TC-PO-070418 | กด Reject ที่แถบรายการเปิดกล่องยืนยันพร้อมช่องเหตุผล | High | Functional |
| TC-PO-070419 | เหตุผลในกล่อง Reject รายแถวถูกใช้กับทุกแถวที่ติ๊ก | Medium | Functional |
| TC-PO-070420 | ยกเลิกกล่อง Reject รายแถว สถานะของแถวไม่เปลี่ยน | Medium | Alternate Flow |
| TC-PO-070421 | ล้างสถานะรายแถวด้วยปุ่มกากบาทใน tooltip | Medium | Functional |
| TC-PO-070422 | แถวที่ยังรออยู่ไม่มีปุ่มล้างสถานะ | Low | Edge Case |
| TC-PO-070423 | ล้างสถานะเพียงแถวเดียว ปุ่ม Approve ท้ายใบหายไป | High | Edge Case |
| TC-PO-070424 | ติดป้ายอนุมัติไม่ครบทุกแถว ปุ่มท้ายใบยังไม่โผล่ | High | Edge Case |
| TC-PO-070425 | ผสมอนุมัติกับปฏิเสธ ปุ่มท้ายใบเป็น Approve ไม่ใช่ Reject | High | Edge Case |
| TC-PO-070426 | มีแถว Review แม้แถวเดียว ปุ่มท้ายใบเหลือเพียง Send Back | High | Edge Case |
| TC-PO-070427 | ปุ่ม Reject ท้ายใบโผล่เมื่อทุกแถวถูกปฏิเสธ | High | Functional |
| TC-PO-070428 | กล่องยืนยัน Approve ไม่มีช่องเหตุผล | Medium | Functional |
| TC-PO-070429 | กด Cancel ในกล่องยืนยัน Approve ใบไม่ถูกอนุมัติ | High | Alternate Flow |
| TC-PO-070430 | กล่อง Send Back บังคับเลือกขั้นปลายทางก่อนจึงกดยืนยันได้ | High | Validation |
| TC-PO-070431 | กล่อง Send Back แสดงจำนวนรายการที่ถูกตีกลับเป็นป้าย | Medium | Functional |
| TC-PO-070432 | ขั้นปลายทางในกล่อง Send Back มาจาก previous-stages ของใบนั้น | Medium | Functional |
| TC-PO-070433 | ปิดกล่อง Send Back แล้วเปิดใหม่ ค่าที่กรอกถูกล้าง | Medium | Edge Case |
| TC-PO-070434 | กล่อง Reject ท้ายใบไม่มีตัวเลือกขั้นปลายทาง | Low | Functional |
| TC-PO-070435 | แถบสรุปยอดท้ายใบแสดงครบห้าช่องให้ผู้อนุมัติ | Medium | Functional |
| TC-PO-070436 | Approve สำเร็จ ขึ้นข้อความยืนยันและเด้งกลับหน้ารายการ | High | Happy Path |
| TC-PO-070437 | Reject สำเร็จ ขึ้นข้อความยืนยันและกลับสู่โหมดอ่านโดยไม่ออกจากหน้า | High | Happy Path |
| TC-PO-070438 | Send Back สำเร็จ ขึ้นข้อความยืนยันและกลับสู่โหมดอ่าน | High | Happy Path |
| TC-PO-070439 | ผู้อนุมัติเปิดใบที่ตัวเองอนุมัติไปแล้วซ้ำ ไม่เหลือปุ่มตัดสิน | High | Authorization |
| TC-PO-070440 | ผู้อนุมัติขั้นถัดไปเห็นปุ่มตัดสินหลังขั้นก่อนหน้าอนุมัติ | High | Functional |
| TC-PO-070441 | ใบที่อนุมัติครบทุกขั้นแล้ว ไม่มีทั้งปุ่ม Edit และ Delete | High | Authorization |
| TC-PO-070442 | ใบที่ถูกตีกลับ กลับไปอยู่ในมือผู้สร้างอีกครั้ง | High | Alternate Flow |
| TC-PO-070443 | ประวัติเวิร์กโฟลว์บันทึกการกระทำของผู้อนุมัติ | Medium | Functional |
| TC-PO-070444 | ผู้อนุมัติขั้นหลังเปิดใบที่ยังไม่ถึงขั้นของตน ไม่มีปุ่มตัดสิน | High | Authorization |
| TC-PO-070445 | ผู้สร้างใบเปิดใบที่ส่งแล้ว ไม่มีปุ่มตัดสิน | High | Authorization |
| TC-PO-070446 | ผู้อนุมัติกด Delete บนใบระหว่างอนุมัติ กล่องยืนยันอ้างเลขที่ใบ และ Cancel ไม่ลบ | Medium | Security |
| TC-PO-070447 | เปิดใบสั่งซื้อของอีกหน่วยธุรกิจ ไม่พบเอกสาร | High | Security |
| TC-PO-070448 | เปิดใบสั่งซื้อด้วยรหัสที่ไม่มีอยู่ ขึ้นหน้าแจ้งไม่พบพร้อมทางกลับ | Medium | Edge Case |
| TC-PO-070449 | หลัง FC อนุมัติ ใบหลุดจากคิวของ FC และไปปรากฏในคิวของ GM | High | Functional |

---

## TC-PO-070401 — แถบขั้นตอนบนหัวใบแสดงขั้นก่อนหน้า ปัจจุบัน และถัดไป
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC (`fc@blueledgers.com`) หน่วยธุรกิจ `BLAVG`
- มีใบสั่งซื้อที่สถานะ `in_progress` ค้างอยู่ที่ขั้นของ FC (seed ด้วย `submitPOAsPurchaser()`)

**Steps**
1. เปิด `/procurement/purchase-order/<uuid>` ของใบที่ seed ไว้
2. ดูบรรทัดใต้เลขที่ใบบนหัวเอกสาร

**Expected**
- แถบขั้นตอนปรากฏ แสดงชื่อขั้นสามช่องเรียงกัน: ขั้นก่อนหน้า (Create Request) · ขั้นปัจจุบัน (ขั้นของ FC) · ขั้นถัดไป (ขั้นของ GM)
- ช่องขั้นปัจจุบันถูกเน้นต่างจากอีกสองช่อง (ตัวหนา/พื้นหลังคนละเฉด) และช่องขั้นก่อนหน้าแสดงเป็นขั้นที่ผ่านแล้ว

---

## TC-PO-070402 — กดแถบขั้นตอนเปิดแผงประวัติเวิร์กโฟลว์
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- ต่อจาก `TC-PO-070401` — ใบผ่านการส่งอนุมัติมาแล้วจึงมีประวัติอย่างน้อยหนึ่งรายการ

**Steps**
1. เปิดหน้ารายละเอียดของใบ
2. กดที่แถบขั้นตอนใต้เลขที่ใบ

**Expected**
- แผงด้านข้างเปิดขึ้น หัวเรื่อง "Workflow History"
- ในแผงมีรายการประวัติอย่างน้อยหนึ่งบรรทัดที่ระบุการส่งอนุมัติของผู้สร้าง พร้อมชื่อผู้ทำและเวลา
- กดปิดแผงแล้วกลับมาที่หน้ารายละเอียดโดย URL ไม่เปลี่ยน

---

## TC-PO-070403 — หัวใบแสดงสถานะ ประเภทใบ และเลขรุ่นเอกสาร
**Priority:** Low · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบ `in_progress` ที่ seed ไว้ (ใบที่สร้างผ่านฟอร์มมี `po_type = manual`)

**Steps**
1. เปิดหน้ารายละเอียดของใบ
2. ดูกลุ่มป้ายที่อยู่ถัดจากเลขที่ใบบนหัวเอกสาร

**Expected**
- มีป้ายสถานะข้อความตรงกับ `In Progress`
- มีป้ายประเภทใบข้อความตรงกับ `Manual`
- มีข้อความเลขรุ่นเอกสาร (`Version <n>`) โดย `<n>` เป็นจำนวนเต็ม

---

## TC-PO-070404 — เมนู ⋯ ของผู้อนุมัติมี Comment / Activity / Print ในโหมดอ่าน
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress` ในโหมดอ่าน (ยังไม่กด Edit)

**Steps**
1. กดปุ่ม `More` (⋯) บนแถบหัวเอกสาร
2. อ่านรายการในเมนูที่เปิดออกมา

**Expected**
- เมนูมีรายการ Comment, Activity และ Print ครบสามรายการ
- ไม่มีรายการ Duplicate (หน้า PO ไม่ได้ส่ง callback นี้มา)

---

## TC-PO-070405 — เปิดแผง Activity ของใบจากเมนู ⋯
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress` ในโหมดอ่าน

**Steps**
1. กดปุ่ม `More` (⋯)
2. เลือกรายการ Activity

**Expected**
- แผง Activity เปิดขึ้น และหัวแผงอ้างเลขที่ใบสั่งซื้อใบนี้
- URL ไม่เปลี่ยน และเมื่อปิดแผงแล้วหน้ารายละเอียดยังอยู่ในโหมดอ่าน

---

## TC-PO-070406 — ผู้อนุมัติไม่เห็นปุ่ม Send Email และ Close บนใบที่ยังอยู่ระหว่างอนุมัติ
**Priority:** Medium · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียดของใบ
2. กวาดดูปุ่มทั้งหมดบนแถบหัวเอกสาร

**Expected**
- ไม่มีปุ่มส่งอีเมลถึงผู้ขาย
- ไม่มีปุ่ม Close
- ปุ่มที่ยังมีคือ Edit และปุ่ม ⋯

---

## TC-PO-070407 — ช่องหัวใบยังแก้ไม่ได้แม้ผู้อนุมัติเข้าโหมดแก้ไขแล้ว
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียดของใบ
2. กดปุ่ม Edit จนแถบหัวเอกสารเปลี่ยนเป็น Cancel + Save
3. ลองแก้ช่องผู้ขาย ช่องคำอธิบาย และช่องวันที่ส่งมอบบนหัวใบ

**Expected**
- ทั้งสามช่องยังคงปิดอยู่ (disabled หรือ `aria-disabled="true"`) และพิมพ์ทับไม่ได้
- ค่าที่แสดงยังเป็นค่าเดิมหลังพยายามแก้
- สิ่งที่เปลี่ยนไปหลังกด Edit คือช่องติ๊กรายแถวในตารางรายการเท่านั้น

---

## TC-PO-070408 — ช่องคลังของรายการเป็นข้อความในโหมดอ่าน ไม่ใช่ตัวเลือก
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress` ในโหมดอ่าน

**Steps**
1. ดูคอลัมน์คลัง (Location) ของแถวรายการแรก

**Expected**
- คอลัมน์คลังแสดงเป็นข้อความ ไม่มี combobox ให้กดเลือก
- กดที่ค่านั้นแล้วไม่มีรายการตัวเลือกใดเปิดขึ้น

---

## TC-PO-070409 — ช่องติ๊กรายแถวและช่องติ๊กทั้งหมดโผล่เฉพาะในโหมดแก้ไข
**Priority:** High · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียดในโหมดอ่าน แล้วนับช่องติ๊กในตารางรายการ
2. กดปุ่ม Edit
3. นับช่องติ๊กอีกครั้ง ทั้งในหัวตารางและในแถว

**Expected**
- ขั้นที่ 1: ไม่มีช่องติ๊กเลยทั้งในหัวตารางและในแถว
- ขั้นที่ 3: หัวตารางมีช่องติ๊ก "เลือกทั้งหมด" หนึ่งช่อง และทุกแถวรายการมีช่องติ๊กของตัวเอง
- กดช่องติ๊กบนหัวตารางแล้วทุกแถวถูกเลือกพร้อมกัน กดซ้ำแล้วถูกยกเลิกทั้งหมด

---

## TC-PO-070410 — ป้ายสถานะรายแถวแสดงตั้งแต่โหมดอ่าน
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress` ในโหมดอ่าน (ยังไม่มีใครติดป้ายรายแถว)

**Steps**
1. ดูคอลัมน์คลังของแต่ละแถว ซึ่งมีจุดสถานะของรายการอยู่ด้วย

**Expected**
- ทุกแถวแสดงจุดสถานะพร้อมข้อความ `Pending`
- จุดสถานะแสดงอยู่แม้ยังไม่ได้กด Edit (ต่างจากช่องติ๊กที่ต้องเข้าโหมดแก้ไขก่อน)

---

## TC-PO-070411 — เซลล์จำนวนและราคาเป็นตัวหนังสือ ผู้อนุมัติแก้ไม่ได้แม้ในโหมดแก้ไข
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียดแล้วกด Edit
2. ลองแก้ช่องจำนวนสั่ง ช่องราคาต่อหน่วย ช่องส่วนลด และช่องภาษีของแถวรายการแรก

**Expected**
- ทุกช่องข้างต้นแสดงเป็นข้อความ ไม่มี input ให้พิมพ์ (หรือมีแต่ปิดอยู่)
- ยอดรวมของแถวและยอดรวมท้ายใบไม่เปลี่ยนแปลงหลังพยายามแก้

---

## TC-PO-070412 — ช่องหมายเหตุรายแถวปิดอยู่สำหรับผู้อนุมัติ
**Priority:** Medium · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress`

**Steps**
1. ดูแถวหมายเหตุที่อยู่ใต้แถวรายการ (ช่องกรอกที่มี placeholder ว่า Comment)
2. ลองพิมพ์ลงช่องนั้น ทั้งในโหมดอ่านและหลังกด Edit

**Expected**
- ช่องหมายเหตุอยู่ในสถานะปิด (disabled) ทั้งสองโหมด
- พิมพ์แล้วไม่มีตัวอักษรปรากฏในช่อง

---

## TC-PO-070413 — แถวของผู้อนุมัติแสดงปุ่มประวัติรายการแทนปุ่มลบ
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ผ่านการส่งอนุมัติมาแล้ว (รายการจึงมีประวัติอย่างน้อยหนึ่งรายการ)

**Steps**
1. เปิดหน้ารายละเอียด
2. ดูช่องซ้ายสุดของแถวหมายเหตุใต้แถวรายการแรก
3. กดปุ่มที่พบ

**Expected**
- ไม่มีปุ่มถังขยะ (ลบรายการ) ให้ผู้อนุมัติ
- มีปุ่มประวัติของรายการแทน และกดแล้วเปิดแผงประวัติของรายการนั้นพร้อมชื่อสินค้า
- ถ้ารายการยังไม่มีประวัติเลย ช่องนั้นจะว่าง ไม่ใช่ปุ่มลบ

---

## TC-PO-070414 — ผู้อนุมัติไม่มีปุ่มเพิ่มรายการ
**Priority:** Medium · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียด แล้วดูแถบเครื่องมือมุมขวาเหนือตารางรายการ
2. กด Edit แล้วดูอีกครั้ง

**Expected**
- ไม่มีปุ่มเพิ่มรายการทั้งสองโหมด
- ปุ่มที่ยังมีในแถบเครื่องมือคือปุ่มกาง/ยุบทุกแถวเท่านั้น

---

## TC-PO-070415 — แถบปุ่มตัดสินหมู่โผล่และหายตามการติ๊ก และมีครบสามปุ่ม
**Priority:** High · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ยืนยันว่ายังไม่มีแถบปุ่มตัดสินเหนือตาราง
3. ติ๊กแถวรายการแรก
4. ยกเลิกการติ๊กแถวนั้น

**Expected**
- ขั้นที่ 2: ไม่มีปุ่ม Approve / Review / Reject เหนือตาราง
- ขั้นที่ 3: แถบปุ่มปรากฏทางซ้ายเหนือตาราง มีปุ่มครบสามปุ่ม Approve, Review และ Reject และ **ไม่มี** ปุ่ม Close (ใบยังไม่ถึงสถานะที่ปิดได้)
- ขั้นที่ 4: แถบปุ่มหายไปทั้งแถบ

---

## TC-PO-070416 — ติ๊กหลายแถวแล้วกด Approve ครั้งเดียว ทุกแถวเปลี่ยนสถานะและการติ๊กถูกล้าง
**Priority:** High · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวรายการทั้งสอง
3. กดปุ่ม Approve บนแถบปุ่มตัดสิน

**Expected**
- จุดสถานะของทั้งสองแถวเปลี่ยนเป็น `Approved`
- ช่องติ๊กของทุกแถวถูกยกเลิกอัตโนมัติ และแถบปุ่มตัดสินหายไป
- ไม่มีกล่องยืนยันใด ๆ เปิดขึ้นระหว่างทาง

---

## TC-PO-070417 — กด Review หมู่ ทุกแถวที่ติ๊กเป็น Review โดยไม่มีกล่องยืนยัน
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวรายการทั้งสอง
3. กดปุ่ม Review บนแถบปุ่มตัดสิน

**Expected**
- จุดสถานะของทั้งสองแถวเปลี่ยนเป็น `Review`
- ไม่มีกล่องยืนยันเปิดขึ้น และการติ๊กถูกล้าง
- ปุ่มท้ายใบเปลี่ยนเป็น Send Back

---

## TC-PO-070418 — กด Reject ที่แถบรายการเปิดกล่องยืนยันพร้อมช่องเหตุผล
**Priority:** High · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวรายการแรก
3. กดปุ่ม Reject บนแถบปุ่มตัดสิน

**Expected**
- กล่องยืนยันชนิด `alertdialog` เปิดขึ้น หัวเรื่อง "Reject Purchase Order"
- ในกล่องมีช่องกรอกเหตุผลหนึ่งช่อง และมีปุ่ม Cancel กับปุ่มยืนยันชื่อ Reject
- ต่างจากกล่อง Send Back ตรงที่ไม่มีรายการขั้นปลายทางให้เลือก

---

## TC-PO-070419 — เหตุผลในกล่อง Reject รายแถวถูกใช้กับทุกแถวที่ติ๊ก
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวรายการทั้งสอง
3. กด Reject บนแถบปุ่มตัดสิน แล้วกรอกเหตุผลหนึ่งข้อความ
4. ยืนยันในกล่อง

**Expected**
- จุดสถานะของทั้งสองแถวเปลี่ยนเป็น `Rejected`
- การติ๊กถูกล้าง และกล่องปิดลง
- ยังไม่มีการยิงคำขอไปยัง backend (การปฏิเสธจริงเกิดตอนกดปุ่ม Reject ท้ายใบ)

---

## TC-PO-070420 — ยกเลิกกล่อง Reject รายแถว สถานะของแถวไม่เปลี่ยน
**Priority:** Medium · **Test Type:** Alternate Flow

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวรายการแรก แล้วกด Reject
3. กรอกเหตุผลลงในกล่อง แล้วกด Cancel

**Expected**
- กล่องปิดลง
- จุดสถานะของแถวยังเป็น `Pending` เหมือนเดิม
- เปิดกล่องเดิมอีกครั้งแล้วช่องเหตุผลว่างเปล่า ไม่มีข้อความเดิมค้างอยู่

---

## TC-PO-070421 — ล้างสถานะรายแถวด้วยปุ่มกากบาทใน tooltip
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` และติดป้าย `Approved` ให้แถวรายการแรกไว้แล้ว

**Steps**
1. ชี้เมาส์ (hover) ที่จุดสถานะของแถวรายการแรกจน tooltip ปรากฏ
2. กดปุ่มกากบาทที่ชื่อว่า `Reset status` ใน tooltip

**Expected**
- จุดสถานะของแถวกลับเป็น `Pending`
- ปุ่มกากบาทหายไปจาก tooltip ของแถวนั้น

---

## TC-PO-070422 — แถวที่ยังรออยู่ไม่มีปุ่มล้างสถานะ
**Priority:** Low · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` ที่ยังไม่ได้ติดป้ายรายแถวใด ๆ

**Steps**
1. ชี้เมาส์ที่จุดสถานะของแถวรายการแรกจน tooltip ปรากฏ

**Expected**
- tooltip แสดงข้อความ `Pending` แต่ไม่มีปุ่มกากบาท `Reset status`

---

## TC-PO-070423 — ล้างสถานะเพียงแถวเดียว ปุ่ม Approve ท้ายใบหายไป
**Priority:** High · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด กด Edit แล้วติ๊กทุกแถว กด Approve จนทุกแถวเป็น `Approved`
2. ยืนยันว่าปุ่ม Approve ปรากฏบนแถบสรุปยอดท้ายใบ
3. ชี้เมาส์ที่จุดสถานะของแถวใดแถวหนึ่ง แล้วกดปุ่มกากบาท `Reset status`

**Expected**
- ขั้นที่ 2: ปุ่ม Approve ปรากฏที่ท้ายใบ
- ขั้นที่ 3: แถวนั้นกลับเป็น `Pending` และปุ่ม Approve ท้ายใบหายไปทันที (เหลือเพียงแถบสรุปยอด)

---

## TC-PO-070424 — ติดป้ายอนุมัติไม่ครบทุกแถว ปุ่มท้ายใบยังไม่โผล่
**Priority:** High · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กเพียงแถวแรกแถวเดียว แล้วกด Approve
3. ดูแถบสรุปยอดท้ายใบ

**Expected**
- แถวแรกเป็น `Approved` ส่วนแถวที่สองยังเป็น `Pending`
- ท้ายใบไม่มีปุ่ม Approve, Reject หรือ Send Back ใด ๆ — มีแต่ตัวเลขสรุปยอด

---

## TC-PO-070425 — ผสมอนุมัติกับปฏิเสธ ปุ่มท้ายใบเป็น Approve ไม่ใช่ Reject
**Priority:** High · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวแรก กด Approve
3. ติ๊กแถวที่สอง กด Reject แล้วกรอกเหตุผลและยืนยันในกล่อง
4. ดูปุ่มบนแถบสรุปยอดท้ายใบ

**Expected**
- แถวแรกเป็น `Approved` แถวที่สองเป็น `Rejected`
- ท้ายใบแสดงปุ่ม **Approve** เพียงปุ่มเดียว ไม่มีปุ่ม Reject และไม่มีปุ่ม Send Back

---

## TC-PO-070426 — มีแถว Review แม้แถวเดียว ปุ่มท้ายใบเหลือเพียง Send Back
**Priority:** High · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กแถวแรก กด Approve
3. ติ๊กแถวที่สอง กด Review
4. ดูปุ่มบนแถบสรุปยอดท้ายใบ

**Expected**
- ท้ายใบแสดงปุ่ม Send Back เพียงปุ่มเดียว
- ไม่มีปุ่ม Approve และไม่มีปุ่ม Reject แม้จะมีแถวที่ติดป้าย `Approved` อยู่

---

## TC-PO-070427 — ปุ่ม Reject ท้ายใบโผล่เมื่อทุกแถวถูกปฏิเสธ
**Priority:** High · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC

**Steps**
1. เปิดหน้ารายละเอียด แล้วกด Edit
2. ติ๊กทุกแถวในตาราง กด Reject บนแถบปุ่มตัดสิน แล้วกรอกเหตุผลและยืนยัน
3. ดูปุ่มบนแถบสรุปยอดท้ายใบ

**Expected**
- ทุกแถวเป็น `Rejected`
- ท้ายใบแสดงปุ่ม Reject เพียงปุ่มเดียว ไม่มีปุ่ม Approve

---

## TC-PO-070428 — กล่องยืนยัน Approve ไม่มีช่องเหตุผล
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` โดยติดป้าย `Approved` ให้ทุกแถวแล้วและปุ่ม Approve ท้ายใบปรากฏ

**Steps**
1. กดปุ่ม Approve ที่ท้ายใบ
2. ตรวจเนื้อหาในกล่องที่เปิดขึ้น

**Expected**
- กล่องมีหัวเรื่อง "Approve Purchase Order" และคำอธิบาย "Once approved, the PO will be sent to the vendor. Are you sure?"
- ในกล่อง **ไม่มี** ช่องกรอกเหตุผลและไม่มีรายการขั้นปลายทาง
- มีเพียงปุ่ม Cancel และปุ่มยืนยันชื่อ Approve ซึ่งใช้งานได้ทันที

---

## TC-PO-070429 — กด Cancel ในกล่องยืนยัน Approve ใบไม่ถูกอนุมัติ
**Priority:** High · **Test Type:** Alternate Flow

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` โดยติดป้าย `Approved` ให้ทุกแถวแล้ว

**Steps**
1. กดปุ่ม Approve ที่ท้ายใบ
2. กด Cancel ในกล่องยืนยัน
3. รีโหลดหน้าแล้วดูป้ายสถานะบนหัวใบ

**Expected**
- กล่องปิดลง และยังอยู่หน้ารายละเอียดใบเดิม (ไม่ถูกพากลับหน้ารายการ)
- หลังรีโหลด ป้ายสถานะยังเป็น `In Progress` และปุ่ม Edit ยังมีให้ FC กด
- ไม่มีข้อความแจ้งผลสำเร็จปรากฏ

---

## TC-PO-070430 — กล่อง Send Back บังคับเลือกขั้นปลายทางก่อนจึงกดยืนยันได้
**Priority:** High · **Test Type:** Validation

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` โดยติดป้าย `Review` ให้อย่างน้อยหนึ่งแถวแล้ว

**Steps**
1. กดปุ่ม Send Back ที่ท้ายใบ
2. ตรวจสถานะของปุ่มยืนยันในกล่องขณะที่ยังไม่ได้เลือกขั้นใด
3. เลือกขั้นปลายทางหนึ่งขั้นจากรายการ
4. ตรวจสถานะปุ่มยืนยันอีกครั้ง

**Expected**
- ขั้นที่ 2: ปุ่มยืนยัน (Send Back) อยู่ในสถานะปิด กดไม่ได้ และหัวข้อรายการขั้นมีเครื่องหมาย `*` กำกับว่าบังคับ
- ขั้นที่ 4: ปุ่มยืนยันเปิดใช้งาน และขั้นที่เลือกถูกเน้นต่างจากขั้นอื่น

---

## TC-PO-070431 — กล่อง Send Back แสดงจำนวนรายการที่ถูกตีกลับเป็นป้าย
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่มีรายการอย่างน้อย 2 รายการ

**Steps**
1. เปิดหน้ารายละเอียด กด Edit แล้วติ๊กแถวเดียว กด Review
2. กดปุ่ม Send Back ที่ท้ายใบ แล้วอ่านป้ายจำนวนรายการในกล่อง
3. ปิดกล่อง ติ๊กแถวที่สองแล้วกด Review อีกครั้ง
4. เปิดกล่อง Send Back ใหม่ แล้วอ่านป้ายจำนวนรายการ

**Expected**
- ขั้นที่ 2: ป้ายแสดงจำนวน 1 รายการ และในกล่องมีช่องเหตุผลหนึ่งช่องพร้อมชื่อสินค้าของแถวนั้น
- ขั้นที่ 4: ป้ายแสดงจำนวน 2 รายการ และมีช่องเหตุผลสองช่อง แต่ละช่องกำกับด้วยชื่อสินค้าของแถวตัวเอง

---

## TC-PO-070432 — ขั้นปลายทางในกล่อง Send Back มาจาก previous-stages ของใบนั้น
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` ที่ติดป้าย `Review` ไว้อย่างน้อยหนึ่งแถว
- ใบผ่านมาแล้วหนึ่งขั้น (Create Request) จึงมีขั้นก่อนหน้าให้ตีกลับ

**Steps**
1. กดปุ่ม Send Back ที่ท้ายใบ
2. อ่านรายการขั้นที่ให้เลือก

**Expected**
- รายการขั้นมีอย่างน้อยหนึ่งตัวเลือก และมีขั้นเริ่มต้นของเวิร์กโฟลว์ (Create Request) อยู่ในนั้น
- ไม่มีขั้นที่อยู่หลังขั้นปัจจุบัน (ขั้นของ GM) อยู่ในรายการ
- ระหว่างที่รายการยังโหลดไม่เสร็จ กล่องแสดงข้อความกำลังโหลดแทนรายการเปล่า

---

## TC-PO-070433 — ปิดกล่อง Send Back แล้วเปิดใหม่ ค่าที่กรอกถูกล้าง
**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` ที่ติดป้าย `Review` ไว้แล้ว

**Steps**
1. กดปุ่ม Send Back ที่ท้ายใบ
2. เลือกขั้นปลายทางหนึ่งขั้น และกรอกข้อความลงช่องเหตุผลของรายการแรก
3. กด Cancel
4. กดปุ่ม Send Back อีกครั้ง

**Expected**
- กล่องที่เปิดใหม่ไม่มีขั้นใดถูกเลือก และปุ่มยืนยันกลับไปอยู่ในสถานะปิด
- ช่องเหตุผลทุกช่องว่างเปล่า
- สถานะ `Review` ของแถวรายการยังอยู่เหมือนเดิม (การปิดกล่องไม่ล้างป้ายรายแถว)

---

## TC-PO-070434 — กล่อง Reject ท้ายใบไม่มีตัวเลือกขั้นปลายทาง
**Priority:** Low · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ในโหมดแก้ไขของใบ `in_progress` โดยติดป้าย `Rejected` ให้ทุกแถวแล้ว และปุ่ม Reject ท้ายใบปรากฏ

**Steps**
1. กดปุ่ม Reject ที่ท้ายใบ
2. ตรวจเนื้อหาในกล่องที่เปิดขึ้น

**Expected**
- กล่องมีหัวเรื่อง "Reject Purchase Order" และคำอธิบาย "Are you sure you want to reject this purchase order? Please provide a reason."
- ในกล่องมีช่องเหตุผลหนึ่งช่องที่กำกับว่า `(optional)` และ **ไม่มี** รายการขั้นปลายทาง
- ปุ่มยืนยันใช้งานได้ทันทีแม้ยังไม่กรอกเหตุผล

---

## TC-PO-070435 — แถบสรุปยอดท้ายใบแสดงครบห้าช่องให้ผู้อนุมัติ
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- Login เป็น FC · อยู่ที่หน้ารายละเอียดใบ `in_progress` ในโหมดอ่าน

**Steps**
1. ดูแถบที่ติดอยู่ท้ายหน้า

**Expected**
- แถบแสดงยอดครบห้าช่องเรียงกัน: Subtotal, Discount, Net, Tax และ Grand total
- ช่อง Grand total ถูกเน้นและมีรหัสสกุลเงินของใบต่อท้าย
- แถบนี้ปรากฏตั้งแต่โหมดอ่าน แม้ยังไม่มีปุ่มตัดสินใด ๆ

---

## TC-PO-070436 — Approve สำเร็จ ขึ้นข้อความยืนยันและเด้งกลับหน้ารายการ
**Priority:** High · **Test Type:** Happy Path

**Preconditions**
- Login เป็น FC · **ใบที่ seed ใหม่เฉพาะเคสนี้** ด้วย `submitPOAsPurchaser()` (เคสนี้เปลี่ยนสถานะถาวร ใช้ซ้ำไม่ได้)

**Steps**
1. เปิดหน้ารายละเอียด กด Edit ติ๊กทุกแถว แล้วกด Approve บนแถบปุ่มตัดสิน
2. กดปุ่ม Approve ที่ท้ายใบ
3. ยืนยันในกล่อง

**Expected**
- ข้อความแจ้งผล "Purchase order approved" ปรากฏ
- เบราว์เซอร์ถูกพากลับไปที่ `/procurement/purchase-order` (หน้ารายการ) ไม่ใช่ค้างที่หน้ารายละเอียด
- ไม่มีกล่องถามว่าจะทิ้งการแก้ไขหรือไม่ระหว่างทาง

---

## TC-PO-070437 — Reject สำเร็จ ขึ้นข้อความยืนยันและกลับสู่โหมดอ่านโดยไม่ออกจากหน้า
**Priority:** High · **Test Type:** Happy Path

**Preconditions**
- Login เป็น FC · **ใบที่ seed ใหม่เฉพาะเคสนี้** ด้วย `submitPOAsPurchaser()`

**Steps**
1. เปิดหน้ารายละเอียด กด Edit ติ๊กทุกแถว แล้วกด Reject บนแถบปุ่มตัดสิน กรอกเหตุผลและยืนยัน
2. กดปุ่ม Reject ที่ท้ายใบ
3. กรอกเหตุผลในกล่อง แล้วกดยืนยัน

**Expected**
- ข้อความแจ้งผล "Purchase order rejected" ปรากฏ
- **ยังอยู่ที่ URL เดิม** ของหน้ารายละเอียด (ต่างจาก Approve ที่พากลับหน้ารายการ)
- หน้ากลับสู่โหมดอ่าน — ไม่มีปุ่ม Save/Cancel เหลืออยู่

---

## TC-PO-070438 — Send Back สำเร็จ ขึ้นข้อความยืนยันและกลับสู่โหมดอ่าน
**Priority:** High · **Test Type:** Happy Path

**Preconditions**
- Login เป็น FC · **ใบที่ seed ใหม่เฉพาะเคสนี้** ด้วย `submitPOAsPurchaser()`

**Steps**
1. เปิดหน้ารายละเอียด กด Edit ติ๊กทุกแถว แล้วกด Review บนแถบปุ่มตัดสิน
2. กดปุ่ม Send Back ที่ท้ายใบ
3. เลือกขั้นปลายทาง กรอกเหตุผลของแต่ละรายการ แล้วกดยืนยัน

**Expected**
- ข้อความแจ้งผล "Purchase order sent back" ปรากฏ
- ยังอยู่ที่ URL เดิมของหน้ารายละเอียด และหน้ากลับสู่โหมดอ่าน
- รีโหลดแล้วสถานะของใบสะท้อนว่าถูกตีกลับ (ไม่ใช่ `Approved`)

---

## TC-PO-070439 — ผู้อนุมัติเปิดใบที่ตัวเองอนุมัติไปแล้วซ้ำ ไม่เหลือปุ่มตัดสิน
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- Login เป็น FC · **ใบที่ seed ใหม่เฉพาะเคสนี้** และให้ FC อนุมัติไปแล้ว (`submitPOAsPurchaser()` แล้ว `approveAsFC()`)

**Steps**
1. เปิด `/procurement/purchase-order/<uuid>` ของใบเดิมในฐานะ FC อีกครั้ง
2. ตรวจปุ่มบนแถบหัวเอกสารและที่ท้ายใบ

**Expected**
- ป้ายสถานะยังเป็น `In Progress` (ใบเดินไปรอที่ขั้นของ GM)
- ไม่มีปุ่ม Edit ให้ FC กด และไม่มีช่องติ๊กในตารางรายการ
- ท้ายใบไม่มีปุ่ม Approve / Reject / Send Back
- แถบขั้นตอนบนหัวใบแสดงขั้นปัจจุบันเป็นขั้นของ GM

---

## TC-PO-070440 — ผู้อนุมัติขั้นถัดไปเห็นปุ่มตัดสินหลังขั้นก่อนหน้าอนุมัติ
**Priority:** High · **Test Type:** Functional

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** และให้ FC อนุมัติไปแล้ว (`submitPOAsPurchaser()` แล้ว `approveAsFC()`)
- Login เป็น GM (`gm@blueledgers.com`)

**Steps**
1. เปิด `/procurement/purchase-order/<uuid>` ของใบนั้นในฐานะ GM
2. ตรวจปุ่มบนแถบหัวเอกสาร แล้วกด Edit และติ๊กแถวรายการ

**Expected**
- GM เห็นปุ่ม Edit
- หลังกด Edit มีช่องติ๊กรายแถว และติ๊กแล้วแถบปุ่มตัดสินสามปุ่มปรากฏ
- แถวรายการยังแก้จำนวน/ราคาไม่ได้ เช่นเดียวกับที่ FC เจอ

---

## TC-PO-070441 — ใบที่อนุมัติครบทุกขั้นแล้ว ไม่มีทั้งปุ่ม Edit และ Delete
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** และอนุมัติครบทั้ง FC และ GM แล้ว (`seedApprovedPO()`)
- Login เป็น FC

**Steps**
1. เปิดหน้ารายละเอียดของใบนั้น
2. ตรวจป้ายสถานะและปุ่มบนแถบหัวเอกสาร

**Expected**
- ป้ายสถานะเป็น `Approved`
- ไม่มีปุ่ม Edit และไม่มีปุ่ม Delete
- ไม่มีช่องติ๊กในตารางรายการ และไม่มีปุ่มตัดสินท้ายใบ
- ปุ่มส่งอีเมลถึงผู้ขายปรากฏขึ้นแทน (สถานะนี้อยู่ในชุดที่ส่งอีเมลได้)

---

## TC-PO-070442 — ใบที่ถูกตีกลับ กลับไปอยู่ในมือผู้สร้างอีกครั้ง
**Priority:** High · **Test Type:** Alternate Flow

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** และถูก FC ตีกลับไปขั้น Create Request แล้ว (ทำตาม `TC-PO-070438`)
- ต้องเปิดอีก context หนึ่งเป็น Purchaser (`purchase@blueledgers.com`)

**Steps**
1. เปิดหน้ารายละเอียดของใบนั้นในฐานะ Purchaser
2. ตรวจปุ่มบนแถบหัวเอกสารและที่ท้ายใบ

**Expected**
- Purchaser เห็นปุ่ม Edit และเมื่อเข้าโหมดแก้ไขสามารถแก้ช่องหัวใบและรายการได้
- ท้ายใบมีปุ่มส่งอนุมัติ (Submit) ให้กดอีกครั้ง
- แถบขั้นตอนบนหัวใบแสดงขั้นปัจจุบันกลับมาเป็นขั้นเริ่มต้นของเวิร์กโฟลว์

---

## TC-PO-070443 — ประวัติเวิร์กโฟลว์บันทึกการกระทำของผู้อนุมัติ
**Priority:** Medium · **Test Type:** Functional

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** และให้ FC อนุมัติไปแล้ว
- Login เป็น GM (หรือ FC ก็ได้ — เคสนี้แค่อ่านประวัติ)

**Steps**
1. เปิดหน้ารายละเอียดของใบนั้น
2. กดแถบขั้นตอนบนหัวใบเพื่อเปิดแผงประวัติเวิร์กโฟลว์
3. อ่านรายการในแผง

**Expected**
- ในแผงมีอย่างน้อยสองรายการ: การส่งอนุมัติของผู้สร้าง และการอนุมัติของ FC
- รายการของ FC ระบุชื่อผู้ทำและเวลาที่ทำ
- เรียงลำดับเป็นไทม์ไลน์ อ่านได้ว่าเหตุการณ์ใดเกิดก่อนหลัง

---

## TC-PO-070444 — ผู้อนุมัติขั้นหลังเปิดใบที่ยังไม่ถึงขั้นของตน ไม่มีปุ่มตัดสิน
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** ที่ยังค้างอยู่ที่ขั้นของ FC (ยังไม่มีใครอนุมัติ)
- Login เป็น GM

**Steps**
1. เปิด `/procurement/purchase-order/<uuid>` ของใบนั้นในฐานะ GM
2. ตรวจปุ่มบนแถบหัวเอกสารและตารางรายการ

**Expected**
- GM เปิดหน้าได้ เห็นข้อมูลใบครบ (ไม่ถูกบล็อกหรือ redirect)
- **ไม่มี** ปุ่ม Edit และไม่มีช่องติ๊กรายแถว
- ท้ายใบไม่มีปุ่ม Approve / Reject / Send Back — มีแต่แถบสรุปยอด

---

## TC-PO-070445 — ผู้สร้างใบเปิดใบที่ส่งแล้ว ไม่มีปุ่มตัดสิน
**Priority:** High · **Test Type:** Authorization

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** ที่ส่งอนุมัติแล้วและค้างอยู่ที่ขั้นของ FC
- Login เป็น Purchaser (`purchase@blueledgers.com`) ซึ่งเป็นผู้สร้างใบ

**Steps**
1. เปิดหน้ารายละเอียดของใบนั้นในฐานะ Purchaser
2. ตรวจปุ่มบนแถบหัวเอกสารและที่ท้ายใบ

**Expected**
- ไม่มีปุ่ม Approve / Reject / Send Back ให้ผู้สร้างกด
- ไม่มีช่องติ๊กรายแถวในตาราง
- ไม่มีปุ่มส่งอนุมัติซ้ำ (ใบไม่ได้อยู่ในมือผู้สร้างแล้ว)

---

## TC-PO-070446 — ผู้อนุมัติกด Delete บนใบระหว่างอนุมัติ กล่องยืนยันอ้างเลขที่ใบ และ Cancel ไม่ลบ
**Priority:** Medium · **Test Type:** Security

**Preconditions**
- Login เป็น FC · มีใบสถานะ `in_progress` ที่ค้างอยู่ที่ขั้นของ FC
- ⚠️ **ห้ามกดยืนยันลบ** — เคสนี้ต้องจบที่ Cancel เท่านั้น

**Steps**
1. เปิดหน้ารายละเอียดของใบ
2. กดปุ่ม Delete บนแถบหัวเอกสาร
3. อ่านข้อความในกล่องยืนยัน แล้วกด Cancel
4. รีโหลดหน้า

**Expected**
- กล่องยืนยันมีหัวเรื่อง "Delete Purchase Order" และคำอธิบายที่อ้างเลขที่ใบใบนี้ พร้อมระบุว่าย้อนกลับไม่ได้
- หลังกด Cancel กล่องปิดลงและยังอยู่หน้าเดิม
- หลังรีโหลด ใบยังอยู่ สถานะยังเป็น `In Progress`

---

## TC-PO-070447 — เปิดใบสั่งซื้อของอีกหน่วยธุรกิจ ไม่พบเอกสาร
**Priority:** High · **Test Type:** Security

**Preconditions**
- Login ด้วยบัญชีที่สังกัดมากกว่าหนึ่งหน่วยธุรกิจ
- จดรหัส `<uuid>` ของใบสั่งซื้อที่ seed ไว้ใน `BLAVG`

**Steps**
1. สลับหน่วยธุรกิจปัจจุบันไปเป็นหน่วยธุรกิจอื่นที่ไม่ใช่ `BLAVG`
2. เปิด `/procurement/purchase-order/<uuid>` ด้วยรหัสของใบใน `BLAVG`

**Expected**
- หน้าไม่แสดงข้อมูลของใบนั้น
- แสดงหน้าแจ้งข้อผิดพลาดพร้อมข้อความ "Purchase order not found" และปุ่มกลับไปหน้ารายการใบสั่งซื้อ
- ไม่มีเลขที่ใบ ชื่อผู้ขาย หรือยอดเงินของใบข้ามหน่วยธุรกิจปรากฏบนหน้าจอ

---

## TC-PO-070448 — เปิดใบสั่งซื้อด้วยรหัสที่ไม่มีอยู่ ขึ้นหน้าแจ้งไม่พบพร้อมทางกลับ
**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**
- Login เป็น FC หน่วยธุรกิจ `BLAVG`

**Steps**
1. เปิด `/procurement/purchase-order/00000000-0000-0000-0000-000000000000`
2. รอจนโครงหน้าโหลดเสร็จ
3. กดปุ่มกลับที่หน้าแจ้งข้อผิดพลาด

**Expected**
- ระหว่างโหลดแสดงโครงฟอร์ม (skeleton) ไม่ใช่หน้าขาว
- จากนั้นแสดงข้อความ "Purchase order not found" พร้อมปุ่มกลับ
- กดปุ่มกลับแล้วไปที่ `/procurement/purchase-order`

---

## TC-PO-070449 — หลัง FC อนุมัติ ใบหลุดจากคิวของ FC และไปปรากฏในคิวของ GM
**Priority:** High · **Test Type:** Functional

**Preconditions**
- **ใบที่ seed ใหม่เฉพาะเคสนี้** ด้วย `submitPOAsPurchaser()` (เคสนี้เปลี่ยนสถานะถาวร)
- ต้องใช้สองบัญชี: FC และ GM
- ⚠️ ใช้ URL คิวที่ถูกต้องคือ **`/procurement/approval`** เท่านั้น — `/procurement/my-approvals` ไม่มีอยู่ใน router และจะได้หน้า 404 ที่ยังผ่าน regex `/approval/` (ดูบล็อกหมายเหตุหัวไฟล์)

**Steps**
1. Login เป็น FC เปิด `/procurement/approval` แล้วยืนยันว่าใบที่ seed ไว้ปรากฏในคิว (ค้นด้วยเลขที่ใบแล้วกด Enter)
2. เปิดใบจากคิว อนุมัติจนสำเร็จ (ติ๊กทุกแถว → Approve รายการ → Approve ท้ายใบ → ยืนยัน)
3. กลับมาที่ `/procurement/approval` ในฐานะ FC แล้วค้นเลขที่ใบเดิมอีกครั้ง
4. Login เป็น GM เปิด `/procurement/approval` แล้วค้นเลขที่ใบเดิม

**Expected**
- ขั้นที่ 1: ใบปรากฏในคิวของ FC พร้อมป้ายประเภทเอกสาร `PO`
- ขั้นที่ 3: คิวของ FC ไม่มีใบนั้นแล้ว (ได้ผลลัพธ์ว่าง)
- ขั้นที่ 4: ใบนั้นปรากฏในคิวของ GM และลิงก์เลขที่เอกสารพาไปที่ `/procurement/purchase-order/<uuid>` ของใบเดิม
