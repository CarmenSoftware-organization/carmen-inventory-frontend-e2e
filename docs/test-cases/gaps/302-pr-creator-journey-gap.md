# Purchase Request — เส้นทางผู้สร้างใบขอซื้อ (Requestor Journey) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของเส้นทางนี้ — ส่วนที่ทดสอบจริงอยู่แล้วอยู่ใน `tests/302-pr-creator-journey.spec.ts` (`TC-PR-0501xx`–`0506xx`, `0508xx`, `0509xx`) และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/302-pr-creator-journey.md` · สเปกนี้สุขภาพดี (42 เคสที่รันจริง / 52 assertion / เงียบ 1) ช่องว่างจึงไม่เยอะและเน้นที่ "พฤติกรรมที่ซอร์สรับประกันแต่ไม่มีใครถาม"_

**Module:** Purchase Request — Creator (Requestor) journey · สร้าง → บันทึกร่าง → กลับมาแก้ → ส่งใบ → คอมเมนต์/ลบ
**Frontend route:** `routes/procurement/purchase-request/` (`pr-component.tsx` → `pr-create-dialog.tsx` → `purchase-request-new.route.tsx` / `pr-new-content.tsx` → `pr-form.tsx` + `pr-header.tsx` + `pr-item-fields.tsx` + `workflow/pr-footer-action.tsx` + `use-pr-form-actions.ts`)  •  **URL:** `/procurement/purchase-request` · `/procurement/purchase-request/new` · `/procurement/purchase-request/:id`
**Prefix:** `PR` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/302-pr-creator-journey.spec.ts` · `tests/301-pr.spec.ts` · `tests/303-pr-approver-journey.spec.ts` · `tests/304-pr-purchaser-journey.spec.ts`
**Total test cases:** 34

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **ช่วงเลขที่เลือก — `TC-PR-050701`–`TC-PR-050734`** · prefix `PR` ลงทะเบียน section block `05` ไว้แล้ว (`docs/test-id-scheme.md`) สเปกใช้ sub-block `0501xx`–`0506xx`, `0508xx`, `0509xx` ไปแล้ว และ gap report อีกสองไฟล์ใช้ `0101xx`/`0201xx`/`4001xx` (`gaps/301-pr-core-gap.md`) กับ `1000xx` (`gaps/301-pr-from-template-gap.md`) ⇒ **`0507xx` เป็น sub-block เดียวที่ยังว่างทั้งบล็อกภายใน section 05** ตรวจด้วย `grep -rhoE 'TC-PR-[0-9]{6}' tests/ docs/ | sort -u` แล้วไม่พบ `TC-PR-0507xx` แม้แต่ตัวเดียว · ไม่ต้องแก้ `docs/test-id-scheme.md`
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `TC-PR-050150` (BU = BLAVG), `0501xx` (เปิดหน้ารายการ, สลับ tab, ค้นหา, กรองสถานะ, เรียง, คลิกแถวเข้ารายละเอียด, ปุ่มสร้าง), `0502xx` (เปิดฟอร์มใหม่, กรอกหัว, เพิ่ม/แก้/ลบรายการ, บันทึกร่างแล้ว redirect, บันทึกโดยไม่มีรายการ), `0503xx` (สร้างจากเทมเพลต — รายละเอียดที่เหลืออยู่ใน `gaps/301-pr-from-template-gap.md`), `0504xx` (หน้ารายละเอียดใบร่าง, ปุ่ม Edit/Delete/Submit, ใบ In Progress ไม่มี Edit/Delete), `0505xx` (เข้า/ออกโหมดแก้ไข, แก้หัว/รายการ, Cancel), `0506xx` (กล่องยืนยันส่งใบ, ยกเลิก, ยืนยัน, ส่งใบเปล่า), `0508xx` (กล่องยืนยันลบ, ยกเลิก, ยืนยัน), `0509xx` (golden journey)
>
> **ไม่เขียนซ้ำกับ gap report พี่น้อง** — `gaps/301-pr-core-gap.md` ครอบหน้ารายการ (`0101xx`), หัวเอกสาร/โหมดแก้ไข (`0201xx`) และตารางรายการสินค้า (`4001xx`) ไปแล้ว ไฟล์นี้จึง **ไม่แตะ**: การติ๊กหลายใบในหน้ารายการ, เมนูรายแถว, Duplicate จากแถว, Export, หัวเอกสารของใบที่บันทึกแล้ว (`020101`–`020103`), workflow แก้ได้เมื่อไร (`020104`), แถบขั้นตอน workflow โผล่เมื่อไร (`020105`), Discard จากปุ่ม Cancel ในโหมดแก้ไข (`020108`/`020109`), ปุ่ม Back (`020110`), toast ตอน Save ในโหมดแก้ไข (`020111`), Duplicate/Print ในเมนูเฉพาะโหมดอ่าน (`020112`), และทุกเคสของตารางรายการ (`400101`–`400118`) · `gaps/301-pr-from-template-gap.md` ครอบ wizard เทมเพลตทั้งเส้น (`100001`–`100025`)
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้**
> 1. **ใบร่างของผู้ขอไม่มีคอลัมน์ select และไม่มีปุ่มกางแถว** — `use-pr-item-table.tsx:478-482` ต่อ `baseCols` ด้วย `...(isDraft || isCreateRole ? [] : [prSelectColumn])` และ **ปุ่ม chevron กางแถวอยู่ในคอลัมน์ select ตัวเดียวกัน** (`use-pr-item-table.tsx:165-195` + คอมเมนต์ที่ 204-206 "ไม่มีคอลัมน์ expand แยกแล้ว") ⇒ ผู้ขอบนใบร่าง **กางแถวไม่ได้เลย** จึงไม่มีทางเห็นบล็อก vendor/ราคา/ส่วนลด/ภาษีใน `PrItemExpand` และไม่มีทางติ๊กแถว · ผลต่อเนื่อง: เมนู **Ask AI** โผล่เฉพาะเมื่อ `selectedRows.length > 0` (`pr-item-fields.tsx:459-461`) และปุ่ม **Expand all/Collapse all** โผล่เฉพาะ role `approve`/`purchase` (`pr-item-fields.tsx:474`) ⇒ ทั้งสองปุ่มไม่มีวันปรากฏให้ผู้ขอบนใบร่าง **หมายเหตุข้ามไฟล์:** `gaps/301-pr-core-gap.md` `TC-PR-400111` เขียนว่า "ผู้ขอกางแถวได้ แต่ทุกช่องราคาเป็นข้อความอ่านอย่างเดียว" — ตามซอร์สข้างต้น **ผู้ขอกางไม่ได้ตั้งแต่ต้น** ควรสะสางเคสนั้นก่อนเขียนเป็นสเปก ไฟล์นี้จึงเขียน `TC-PR-050709` ตามพฤติกรรมจริงแทน
> 2. **ปุ่ม Save/Submit ไม่เคยถูก disable ด้วยเหตุผลของ validation** — คอมเมนต์ที่ `use-pr-form-actions.ts:474-480` ระบุตรง ๆ ว่าเลิกใช้ `isAllItemsComplete` ที่ปิดปุ่มแล้ว กติกาทั้งหมดย้ายไป zod: กดได้เสมอ แล้ว `revealInvalid` (`use-pr-form-actions.ts:482-490`) เลื่อนจอไปหาช่องแรกที่ผิดพร้อม toast · `countInvalidItems` (`lib/form-helpers.ts:233-239`) นับเฉพาะ error ราย index ของ `items` ⇒ ฟอร์มเปล่า (error อยู่ที่ตัว array เองจาก `.min(1)`) ได้ข้อความ **"Some details are missing — jumped to the field to fix."** ไม่ใช่ข้อความนับรายการ — สเปก `TC-PR-050210`/`TC-PR-050604` ปัจจุบันเขียนแบบ "disabled **หรือ** ไม่ redirect" ซึ่งผ่านได้โดยไม่ต้องรู้ว่าอันไหนจริง `TC-PR-050706`/`TC-PR-050719` ในไฟล์นี้เขียน oracle ที่ล้มได้จริง
> 3. **กฎ "ต้องมีจำนวน" เป็นด่านของปุ่มส่งใบ ไม่ใช่ของปุ่มบันทึก** — `findRowsMissingQty` (`pr-form-schema.ts:196-208`) อยู่นอก zod โดยตั้งใจ (คอมเมนต์ที่ `pr-form-schema.ts:176-194`) และถูกเรียกจาก `blockOnMissingQty` เฉพาะใน `validateSubmitPr`/`handleSubmitPr` (`use-pr-form-actions.ts:496-509, 520-522, 534-536`) ⇒ **ร่างที่จำนวนยังเป็น 0 ต้องบันทึกได้** ส่วน `requested_qty` ใน zod เป็น `min(0)` (`pr-form-schema.ts:47-51`) กันแค่ค่าติดลบ
> 4. **ระบบเติมค่าให้เองตอนกดปุ่ม ไม่ใช่ตอนโหลดฟอร์ม** — `fillKnownItemDefaults` (`use-pr-form-actions.ts:433-479`) เติม **สกุลเงิน** (ค่าเริ่มต้นของ BU), **วันที่ต้องการ = พรุ่งนี้** และ **หน่วยที่ขอ = หน่วยนับของสินค้า** ให้ทุกแถวที่ยังว่าง โดยจงใจเรียกตอน Save/Submit เท่านั้น (คอมเมนต์ที่ 428-431: เติมตอน mount จะทำให้ฟอร์ม dirty เองแล้วเด้ง discard) ⇒ ผู้ขอกรอกจริงแค่ **คลัง · สินค้า · จุดส่งของ · จำนวน**
> 5. **ปุ่ม Submit อยู่ที่แถบท้ายหน้าเดียวกับยอดรวม แต่ยอดรวมโผล่เฉพาะใบที่บันทึกแล้ว** — `SummaryFooterBar` render `SummaryBar` ก็ต่อเมื่อ `hasRecord` (`components/ui/summary-bar.tsx:80`) แต่ `children` (กลุ่มปุ่ม) render เสมอ (บรรทัด 81) และ `showSubmit = canSubmit && !isVoided` โดย `canSubmit = role === STAGE_ROLE.CREATE` **ไม่ผูกกับ `hasRecord`** (`workflow/pr-footer-action.tsx:89, 101`) ⇒ หน้า `/new` มีปุ่ม Submit ให้กดได้ และเส้นทาง "สร้างแล้วส่งเลยในครั้งเดียว" มีจริง (`doCreateAndSubmitPr`, `use-pr-form-actions.ts:388-418`) — สเปกปัจจุบันไม่เคยเดินเส้นนี้
> 6. **กล่องยืนยันส่งใบไม่มีช่องกรอกข้อความ** — `PrActionDialog` ตัวที่ผูกกับ `confirm` ถูกส่ง `showMessage={false}` (`workflow/pr-footer-action.tsx:329`) ต่างจากกล่อง "ส่งกลับ" ที่เปิดช่องข้อความรายรายการ · หัวเรื่อง/คำอธิบาย/ปุ่มมาจาก `submitTitle` = "Submit Purchase Request", `submitConfirm` = "This will submit the PR for approval. Are you sure?", ปุ่มยืนยัน = "Submit"
> 7. **ส่งใบสำเร็จแล้วเด้งกลับหน้ารายการ ไม่ใช่ค้างที่ใบ** — `onSuccessList` (`use-pr-form-actions.ts:187-190`) ขึ้น toast แล้ว `navigate("/procurement/purchase-request")` ข้อความคือ `submitted` = **"Purchase request submitted"** (ไม่ใช่ `toast.submitSuccess`)
> 8. **สร้างสำเร็จแล้วใช้ `navigate(..., { replace: true })`** — `use-pr-form-actions.ts:300-312` ปิด navigation guard ก่อนยิง mutation เพื่อให้ `/new` ถูกแทนที่จริงใน history (คอมเมนต์ที่ 296-298) ⇒ กด Back จากหน้ารายละเอียดใบที่เพิ่งสร้างต้องไปหน้ารายการ **ไม่ใช่ย้อนกลับเข้าฟอร์มเปล่า** · toast คือ `toast.createSuccess` = "Purchase Request created successfully"
> 9. **มี guard สองชั้นตอนออกจากฟอร์มที่กรอกค้าง** — `useNavigationGuard` (`use-pr-form-actions.ts:175-180`) ดักการคลิก `<a>` ในแอปและปุ่ม Back ของเบราว์เซอร์ (`hooks/use-navigation-guard.ts:21-60`) แล้วเปิด `DiscardDialog` ตัวที่สอง ส่วน `useDiscardConfirm` (บรรทัด 165) เป็นของปุ่ม Cancel/Back ในหน้า · กล่องมีปุ่ม **"Keep editing"** กับ **"Discard"** และหัวเรื่อง **"Discard changes?"** (`components/ui/discard-dialog.tsx:35-36, 59-71`) · นอกจากนี้ `useUnsavedChanges` (`pr-form.tsx:125`) ผูก `beforeunload` ไว้ด้วย
> 10. **ไม่มีที่แนบไฟล์ในตัวใบขอซื้อ** — `grep -rn attachment routes/procurement/purchase-request/` ไม่พบอะไรเลย การแนบไฟล์ของโมดูลนี้ทำผ่าน **แผงคอมเมนต์** (`components/ui/comment-sheet.tsx`) ซึ่ง PR เปิดด้วย `directFileUpload` (`components/share/entity-comment-sheet.tsx:51`) ⇒ `accept="image/*,.pdf,.txt,.csv"` `multiple` (บรรทัด 718-724), เพดาน **10 MB** ต่อไฟล์ (`MAX_FILE_SIZE`, บรรทัด 84) และไฟล์ที่ไม่ผ่านจะขึ้น toast รายไฟล์ (บรรทัด 303-311) — **ห้ามเขียนเคสแนบไฟล์กับตัวใบ เพราะไม่มี UI นั้นอยู่จริง**
> 11. **ทางเข้าคอมเมนต์/ประวัติ/พิมพ์อยู่ในเมนู "More"** — `DocActionsMenu` (`components/share/doc-actions-menu.tsx`) เป็นปุ่ม `More` ที่กางเป็น Duplicate / Comment (N) / Activity / Print โดยเมนูที่ไม่ได้ส่ง callback มาจะไม่แสดง (บรรทัด 72, 95-134) · เมื่อมีคอมเมนต์ ปุ่มจะมี **จุดกลม** อยู่ในแถวเดียวกับข้อความ (บรรทัด 86-92) และตัวเลขอยู่ในเมนู · จำนวนอ่านจาก `usePurchaseRequestComments` ที่ยิงเฉพาะใบที่บันทึกแล้ว (`pr-form-actions.tsx:56-58`)
> 12. **แผงประวัติ workflow เป็น Sheet และไม่ render เลยถ้ายังไม่มีประวัติ** — `pr-form-dialogs.tsx:144-168` ครอบด้วย `!!workflowHistory?.length` ⇒ ใบร่างไม่มีแผงนี้ ส่วนปุ่มเปิดอยู่บนแถบขั้นตอนของหัวเอกสาร (`pr-header.tsx:166-170`) · **หน้ารายละเอียดไม่มี `role="tab"` อยู่เลย** — สเปก `TC-PR-050401`/`TC-PR-050402` จึงตกเข้าสาขา skip ทุกรอบ (บันทึกไว้แล้วใน `gaps/301-pr-core-gap.md` ข้อ 1)
> 13. **ใบที่ส่งแล้วเปลี่ยนหน้าตาเพราะ `role` ไม่ใช่เพราะสถานะ** — `descriptionReadOnly = isView || role !== STAGE_ROLE.CREATE` (`pr-form.tsx:159`) และปุ่ม Add Item ผูกกับ `role === STAGE_ROLE.CREATE` (`pr-item-fields.tsx:494`) ส่วนปุ่ม Delete ผูกกับ `prStatus === PR_STATUS.DRAFT` (`pr-form-actions.tsx:98`) และปุ่ม Edit หายเมื่อ `role === STAGE_ROLE.VIEW_ONLY` หรือใบถูกยกเลิก (`pr-form-actions.tsx:67`)
> 14. **ช่องคำอธิบายจำกัด 256 ตัวอักษรที่ตัว `<input>`** — `DESCRIPTION_MAX = 256` ใน `pr-general-fields.tsx:9` ส่งเป็น `maxLength` ของ `<Input id="pr-description">` (บรรทัด 63-71) ⇒ เบราว์เซอร์ตัดให้เองตั้งแต่พิมพ์ ไม่มีข้อความเตือน
> 15. **กด Enter ในช่อง `<input>` ของฟอร์มไม่ส่งฟอร์ม** — effect ที่ `pr-form.tsx:230-240` ดัก `keydown` ระดับ `<form id="purchase-request-form">` แล้ว `preventDefault()` ทุกครั้งที่ target เป็น `HTMLInputElement`
> 16. **`viewMode` ของหน้ารายการอยู่ใน `?view=`** — `pr-component.tsx:89-93` (ค่าเริ่มต้น `my-pending`) และการเรียงเริ่มต้นต่างกันตาม tab: `pr_date:asc` สำหรับ **My pending** กับ `pr_date:desc` สำหรับ **All Documents** (บรรทัด 126, 137) · ป้าย tab คือ "My pending" / "All Documents" และปุ่มสร้างคือ "New Purchase Request"
>
> **Role / ข้อมูลที่ต้องเตรียม**
> - **Default role ของไฟล์นี้คือ Requestor (`requestor@blueledgers.com`, BU = `BLAVG`)** ตัวเดียวกับที่ `tests/302-pr-creator-journey.spec.ts` ใช้ผ่าน `createAuthTest` — ทุกเคสที่ไม่ระบุเป็นอย่างอื่นให้ใช้บัญชีนี้ และให้ pin BU ด้วย `ensureActiveBu(page, BU_CODE)` แบบเดียวกับ `TC-PR-050150`
> - **เคสที่รันได้โดยไม่ต้องมีข้อมูลตั้งต้น** (สร้างของเองในเทส): `050703`, `050704`, `050705`, `050706`, `050707`, `050708`, `050717`, `050718`, `050720`
> - **เคสที่ต้องมี workflow PR ที่บัญชีนี้เริ่มใบได้อย่างน้อยหนึ่งอัน** (ทุกเคสที่แตะฟอร์ม): `CreateWorkflowGate` (`pr-new-content.tsx:42-49`) บล็อกทั้งหน้าเมื่อไม่มี
> - **เคสที่ต้องสร้างใบร่างขึ้นมาเองก่อน** — ใช้ `createDraftPR()` จาก `tests/pages/pr-creator.helpers.ts`: `050713`–`050716`, `050726`–`050734`
> - **เคสที่ต้องมีใบของผู้ขอ *คนอื่น* ที่อยู่ระหว่างอนุมัติ**: `050725` — seed ด้วย `submitPRAsRequestor()` (`tests/pages/pr-approver.helpers.ts`) จากบัญชีอื่น หรือใช้ tab "All Documents" หาใบที่ `requestor` ไม่ใช่บัญชีที่ล็อกอิน
> - **เคสที่ต้องมีใบมากกว่าหนึ่งใบเพื่อดูลำดับการเรียง**: `050702`
> - **เคสที่ต้องมีไฟล์จริงบนดิสก์** สำหรับ `setInputFiles`: `050730` (ไฟล์ `.txt` หรือ `.pdf` เล็ก ๆ) และ `050731` (ไฟล์ชนิดนอก allowlist เช่น `.zip`) — สร้างไฟล์ชั่วคราวในเทส อย่า commit ลง repo
>
> **🚫 Blocker / เคสที่เปลี่ยนสถานะเอกสารแบบย้อนไม่ได้**
> - **เปลี่ยนสถานะเอกสารแบบย้อนกลับไม่ได้ (ต้อง seed ใบใหม่ทุกรอบ ห้ามใช้ใบที่มีอยู่):** `TC-PR-050721` (สร้างแล้วส่งเลยจาก `/new`), `TC-PR-050723`, `TC-PR-050724` (ทั้งสองต้องส่งใบก่อนจึงจะตรวจได้) · ใบที่ส่งแล้วเดินเข้า workflow ของ HOD และ **ผู้ขอเอากลับมาแก้เองไม่ได้** — ไม่มีปุ่ม Recall ในซอร์ส
> - **สร้าง/ลบข้อมูลถาวรแต่ทำซ้ำได้:** `TC-PR-050728`, `TC-PR-050729`, `TC-PR-050730`, `TC-PR-050731`, `TC-PR-050732` (คอมเมนต์และไฟล์แนบเก็บฝั่ง backend — ตั้งข้อความด้วย UID ของรอบรันและลบทิ้งท้ายเทส), `TC-PR-050711`–`TC-PR-050716` (สร้างใบร่าง — ลบทิ้งด้วย `deleteDraftPR()`), `TC-PR-050734` (ลบใบร่างที่เทสสร้างเอง)
> - **อ่านอย่างเดียว รันซ้ำได้ไม่จำกัด:** `050701`, `050702`, `050703`, `050704`, `050705`, `050706`, `050707`, `050708`, `050709`, `050710`, `050717`, `050718`, `050719`, `050720`, `050722`, `050725`, `050726`, `050727`, `050733` — เคสกลุ่ม validation ทั้งหมดจบก่อนถึง network write
> - **🚫 ไม่มีทางทดสอบในสูทนี้ตอนนี้** — กล่องเตือน "Your profile does not have a department assigned." (`pr-form.tsx:63` + `pr-form-dialogs.tsx:170-174`) ต้องใช้บัญชีที่ **ไม่มีแผนก** ใน BU ปัจจุบัน `tests/test-users.ts` ยังไม่มีบัญชีแบบนั้น จึง **ไม่เขียนเคสนี้ไว้ในไฟล์** จนกว่าจะเตรียม fixture ฝั่ง backend ได้
>
> **page object ที่ล้าสมัย (ต้องแก้ก่อนแปลงเคสพวกนี้เป็นสเปก)** — `tests/pages/purchase-request.page.ts` ยังถือ locator ของฟอร์มรุ่นก่อนออกแบบใหม่: `prTypeTrigger()`, `justificationInput()`, `deliveryDateInput()`, `hidePriceToggle()`, `notesInput()`, `internalNotesInput()` ไม่มี field ใดอยู่ในฟอร์มจริงอีกแล้ว — หัวฟอร์มเหลือแค่ **workflow + description** (`pr-header.tsx:107-116`, `pr-general-fields.tsx`) และ `fillHeader()` (บรรทัด 228-235) ก็ **ไม่เขียนค่า `deliveryDate`/`prType` ลงฟอร์มเลย** รับ parameter ไว้เฉย ๆ ⇒ สเปก `TC-PR-050211` ("delivery date ในอดีต") ไม่ได้ตั้งวันที่อะไรทั้งนั้น และวันที่ต้องการเป็นของ **รายบรรทัด** (`pr-item-cells/delivery-date-cell.tsx:44` ตั้ง `fromDate={today}`) · `tabItems()`/`tabWorkflowHistory()` ชี้ไปที่ `role="tab"` ที่ไม่มีอยู่ · `editLineItem()` หาช่องด้วย `getByLabel(/^quantity$/i)` แต่ช่องจริงคือ `input[name="items.N.requested_qty"]` ในตาราง
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-050701 | สลับกลุ่มเอกสารเขียนลง `?view=` และกลับจากใบมาเจอกลุ่มเดิม | Medium | Functional |
| TC-PR-050702 | การเรียงเริ่มต้นต่างกันตามกลุ่มเอกสาร | Low | Functional |
| TC-PR-050703 | กล่องเลือกวิธีสร้างมีสองทางเลือกพร้อมคำอธิบายของตัวเอง | Medium | Functional |
| TC-PR-050704 | ปิดกล่องเลือกวิธีสร้างด้วย Esc แล้วยังอยู่หน้ารายการ | Low | Alternate Flow |
| TC-PR-050705 | หัวฟอร์มใบใหม่ยังไม่มีเลขที่ใบ สถานะ และรุ่นเอกสาร แต่มีผู้ขอ · แผนก · วันที่ | Medium | Functional |
| TC-PR-050706 | กดบันทึกบนฟอร์มเปล่า — ปุ่มกดได้ และระบบชี้ว่าขาด workflow | High | Validation |
| TC-PR-050707 | ช่องคำอธิบายรับได้ไม่เกิน 256 ตัวอักษร | Low | Validation |
| TC-PR-050708 | กด Enter ในช่องกรอกไม่ส่งฟอร์ม | Medium | Edge Case |
| TC-PR-050709 | ตารางรายการของใบร่างไม่มีช่องติ๊กและกางแถวไม่ได้ | Medium | Functional |
| TC-PR-050710 | แถบเครื่องมือของใบร่างมีแค่ตัวกรองกับปุ่มเพิ่มรายการ | Medium | Authorization |
| TC-PR-050711 | บันทึกร่างที่ยังไม่ได้ใส่จำนวนได้ | High | Validation |
| TC-PR-050712 | ระบบเติมหน่วย วันที่ต้องการ และสกุลเงินให้เองตอนกดบันทึก | High | Functional |
| TC-PR-050713 | บันทึกร่างสำเร็จ — แจ้งผล แล้วใบโผล่ในกลุ่ม My pending | High | Happy Path |
| TC-PR-050714 | กดย้อนกลับหลังบันทึกร่าง ไม่ย้อนกลับเข้าฟอร์มเปล่า | Medium | Edge Case |
| TC-PR-050715 | เปิดใบร่างที่เพิ่งบันทึกซ้ำ ค่าที่กรอกอยู่ครบ | High | CRUD |
| TC-PR-050716 | แก้ใบร่างแล้วค่ายังอยู่หลังโหลดหน้าใหม่ | High | CRUD |
| TC-PR-050717 | คลิกลิงก์ออกจากฟอร์มขณะกรอกค้าง — ถามก่อน และกลับมาแก้ต่อได้ | High | Alternate Flow |
| TC-PR-050718 | ยืนยันทิ้งของที่กรอกค้าง — ออกจริงและไม่มีใบถูกสร้าง | Medium | Alternate Flow |
| TC-PR-050719 | กดส่งใบทั้งที่กรอกไม่ครบ — ไม่เปิดกล่องยืนยันเลย | High | Validation |
| TC-PR-050720 | ฟอร์มใบใหม่ไม่มียอดรวม แต่มีปุ่มส่งใบอยู่ที่แถบท้ายหน้า | Medium | Functional |
| TC-PR-050721 | สร้างแล้วส่งใบในครั้งเดียวจากฟอร์มใบใหม่ | High | Happy Path |
| TC-PR-050722 | กล่องยืนยันส่งใบไม่มีช่องให้กรอกข้อความ | Medium | Functional |
| TC-PR-050723 | ใบที่ส่งแล้ว — คำอธิบายกับ workflow กลายเป็นข้อความ และไม่มีปุ่มเพิ่มรายการ | High | Authorization |
| TC-PR-050724 | ประวัติ workflow ของใบที่ส่งแล้วบันทึกการส่งของผู้ขอไว้ | Medium | Functional |
| TC-PR-050725 | ผู้ขอเปิดใบของคนอื่นที่อยู่ระหว่างอนุมัติ — ไม่มีปุ่มจัดการใด ๆ | High | Authorization |
| TC-PR-050726 | ปุ่ม More ติดจุดแจ้งเตือนและบอกจำนวนคอมเมนต์ | Medium | Functional |
| TC-PR-050727 | แผงคอมเมนต์ของใบที่ยังไม่มีใครคอมเมนต์ | Medium | Functional |
| TC-PR-050728 | เขียนคอมเมนต์บนใบร่างของตัวเอง | High | CRUD |
| TC-PR-050729 | Enter ส่งคอมเมนต์ Shift+Enter ขึ้นบรรทัดใหม่ | Medium | Functional |
| TC-PR-050730 | แนบไฟล์ไปกับคอมเมนต์ | High | Functional |
| TC-PR-050731 | แนบไฟล์ชนิดที่ไม่รับ — เตือนพร้อมชื่อไฟล์และไม่เข้าคิว | Medium | Negative |
| TC-PR-050732 | แก้และลบคอมเมนต์ของตัวเอง | Medium | CRUD |
| TC-PR-050733 | เปิดบันทึกการเปลี่ยนแปลงของใบร่าง | Medium | Functional |
| TC-PR-050734 | กล่องยืนยันลบเอ่ยเลขที่ใบ และลบแล้วแจ้งผล | Medium | CRUD |

---

## TC-PR-050701 — สลับกลุ่มเอกสารเขียนลง `?view=` และกลับจากใบมาเจอกลุ่มเดิม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor (`requestor@blueledgers.com`) active BU = `BLAVG`; มีใบขอซื้ออย่างน้อยหนึ่งใบที่มองเห็นได้ในกลุ่ม "All Documents"
**Steps**
1. เปิด `/procurement/purchase-request` โดยไม่มี query string
2. อ่าน URL แล้วกดปุ่มกลุ่ม "All Documents"
3. อ่าน URL อีกครั้ง
4. คลิกเลขที่ใบในแถวแรกเพื่อเข้าหน้ารายละเอียด
5. กดปุ่มย้อนกลับของเบราว์เซอร์
**Expected**
เปิดครั้งแรกอยู่ที่กลุ่ม "My pending" (ค่าเริ่มต้นเมื่อไม่มี `view` ใน URL) · หลังกด "All Documents" URL มี `view=all-document` · หลังกดย้อนกลับจากหน้ารายละเอียด หน้ารายการกลับมาพร้อม `view=all-document` เหมือนเดิม ไม่เด้งกลับไปกลุ่ม "My pending"

---

## TC-PR-050702 — การเรียงเริ่มต้นต่างกันตามกลุ่มเอกสาร
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; ทั้งสองกลุ่มมีใบขอซื้ออย่างน้อย 2 ใบที่วันที่ไม่เท่ากัน
**Steps**
1. เปิด `/procurement/purchase-request` (กลุ่ม My pending) โดย URL ยังไม่มีพารามิเตอร์ `sort`
2. อ่านค่าคอลัมน์วันที่ของแถวแรกและแถวสุดท้าย และอ่านทิศของลูกศรบนหัวคอลัมน์วันที่
3. กดปุ่มกลุ่ม "All Documents" แล้วอ่านทิศของลูกศรอีกครั้ง
**Expected**
กลุ่ม "My pending" เรียงจากเก่าไปใหม่ (ใบที่ค้างนานที่สุดขึ้นก่อน) ส่วนกลุ่ม "All Documents" เรียงจากใหม่ไปเก่า · ทิศของลูกศรบนหัวคอลัมน์วันที่ต่างกันระหว่างสองกลุ่มแม้ URL จะยังไม่มี `sort` ทั้งคู่

---

## TC-PR-050703 — กล่องเลือกวิธีสร้างมีสองทางเลือกพร้อมคำอธิบายของตัวเอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request` และบัญชีมี workflow ที่เริ่มใบได้อย่างน้อยหนึ่งอัน
**Steps**
1. กดปุ่ม "New Purchase Request"
2. อ่านหัวเรื่องและคำอธิบายของกล่อง
3. นับปุ่มทางเลือกในกล่องและอ่านหัวข้อกับคำอธิบายของแต่ละอัน
**Expected**
กล่องมีหัวเรื่อง "Create Purchase Request" และคำอธิบาย "Choose how you want to create a new purchase request." · มีทางเลือก 2 อันเป็นปุ่ม: "Blank PR" (คำอธิบาย "Fill in every field yourself for a tailored request.") และ "PR Template" (คำอธิบาย "Use a saved template to save time and enforce best practices.") · กด "Blank PR" ไป `/procurement/purchase-request/new` และกด "PR Template" ไป `/procurement/purchase-request/from-template`

---

## TC-PR-050704 — ปิดกล่องเลือกวิธีสร้างด้วย Esc แล้วยังอยู่หน้ารายการ
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
กล่อง "Create Purchase Request" เปิดอยู่บนหน้า `/procurement/purchase-request`
**Steps**
1. กดปุ่ม Escape
2. อ่าน URL และสถานะของกล่อง
**Expected**
กล่องปิดลง · URL ยังเป็น `/procurement/purchase-request` ไม่เปลี่ยนเป็น `/new` หรือ `/from-template` · ตารางรายการยังแสดงอยู่และปุ่ม "New Purchase Request" ยังกดได้อีกครั้ง

---

## TC-PR-050705 — หัวฟอร์มใบใหม่ยังไม่มีเลขที่ใบ สถานะ และรุ่นเอกสาร แต่มีผู้ขอ · แผนก · วันที่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor ที่โปรไฟล์มีแผนกใน BU `BLAVG`; เปิด `/procurement/purchase-request/new`
**Steps**
1. อ่านหัวเรื่องบนสุดของหน้า
2. ตรวจว่ามีป้ายสถานะหรือข้อความรุ่นเอกสารอยู่ข้างหัวเรื่องหรือไม่
3. อ่านบรรทัดใต้หัวเรื่อง (ชื่อผู้ขอ · แผนก · วันที่)
4. ตรวจว่ามีแถบขั้นตอน workflow ใต้หัวเรื่องหรือไม่
**Expected**
หัวเรื่องอ่านว่า "Purchase Request" (ไม่ใช่เลขที่ใบ — ใบยังไม่มีเลข) · **ไม่มี** ป้ายสถานะและ **ไม่มี** ข้อความ "Edition N" ข้างหัวเรื่อง · บรรทัดใต้หัวเรื่องแสดงชื่อ-นามสกุลของผู้ล็อกอิน, ชื่อแผนกของ BU ปัจจุบัน และวันที่ของวันนี้ในรูปแบบวันที่ของผู้ใช้ · **ไม่มี** แถบขั้นตอน workflow (ใบยังไม่เข้า workflow)

---

## TC-PR-050706 — กดบันทึกบนฟอร์มเปล่า — ปุ่มกดได้ และระบบชี้ว่าขาด workflow
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น Requestor; เปิด `/procurement/purchase-request/new` โดยยังไม่แตะอะไรเลย
**Steps**
1. อ่านสถานะ `disabled` ของปุ่ม "Save"
2. กดปุ่ม "Save"
3. อ่านข้อความแจ้งเตือนที่เด้งขึ้นมา
4. อ่านสถานะของช่อง Workflow บนหัวฟอร์ม
**Expected**
ปุ่ม "Save" **กดได้** (ไม่ถูก disabled ด้วยเหตุผลของ validation) · หลังกด มี toast เตือนว่า "Some details are missing — jumped to the field to fix." · ตัวเลือก Workflow มี `aria-invalid="true"` และมีข้อความ "Workflow is required" ให้อ่านได้ · URL ยังเป็น `/procurement/purchase-request/new` ไม่มีใบถูกสร้าง

---

## TC-PR-050707 — ช่องคำอธิบายรับได้ไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น Requestor; เปิด `/procurement/purchase-request/new`
**Steps**
1. อ่านค่า `maxlength` ของช่องคำอธิบาย (`#pr-description`)
2. กรอกข้อความยาว 300 ตัวอักษรลงในช่อง
3. อ่านค่าที่ค้างอยู่ในช่อง
**Expected**
ช่องมี `maxlength="256"` · ค่าที่อยู่ในช่องหลังกรอกยาว 300 ตัวอักษรมีความยาว 256 ตัวอักษรพอดี (เบราว์เซอร์ตัดให้เอง) · ไม่มีข้อความเตือนใด ๆ เด้งขึ้น เพราะกติกานี้บังคับที่ตัวช่อง ไม่ใช่ที่ validator

---

## TC-PR-050708 — กด Enter ในช่องกรอกไม่ส่งฟอร์ม
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น Requestor; เปิด `/procurement/purchase-request/new` และเลือก workflow แล้ว (ฟอร์มยังไม่มีรายการสินค้า)
**Steps**
1. คลิกที่ช่องคำอธิบายแล้วพิมพ์ข้อความสั้น ๆ
2. กดปุ่ม Enter ที่แป้นพิมพ์
3. รอ 1 วินาที แล้วอ่าน URL และตรวจว่ามี toast เตือน validation เด้งขึ้นหรือไม่
**Expected**
ไม่มีการส่งฟอร์ม: URL ยังเป็น `/procurement/purchase-request/new` · **ไม่มี** toast เตือนว่ากรอกไม่ครบ (ซึ่งจะต้องเด้งถ้าฟอร์มถูกส่งจริง) · ข้อความที่พิมพ์ยังอยู่ในช่องครบถ้วน

---

## TC-PR-050709 — ตารางรายการของใบร่างไม่มีช่องติ๊กและกางแถวไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` และเพิ่มรายการสินค้าไว้แล้ว 1 รายการ (เลือกคลังและสินค้าครบ)
**Steps**
1. อ่านหัวคอลัมน์ทั้งหมดของตารางรายการเรียงจากซ้ายไปขวา
2. นับ checkbox ในตารางรายการ
3. นับปุ่มที่มี `aria-label` ว่า "Expand row" หรือ "Collapse row"
**Expected**
คอลัมน์แรกของตารางคือเลขลำดับ `#` — **ไม่มี** คอลัมน์ checkbox นำหน้า · จำนวน checkbox ในตารางรายการเป็น 0 · จำนวนปุ่มกาง/ยุบแถวเป็น 0 ⇒ ผู้ขอบนใบร่างเห็นเฉพาะข้อมูลบรรทัดที่ตัวเองกรอก ไม่มีทางเปิดบล็อก vendor/ราคา/ส่วนลด/ภาษี

---

## TC-PR-050710 — แถบเครื่องมือของใบร่างมีแค่ตัวกรองกับปุ่มเพิ่มรายการ
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` และมีรายการสินค้าอย่างน้อย 1 รายการ
**Steps**
1. อ่านปุ่มทั้งหมดในแถบเหนือตารางรายการ
2. ตรวจหาปุ่ม "Add Item", ปุ่มตัวกรองรายการ, ปุ่ม "Expand all", เมนูถาม AI และปุ่ม "Auto Allocate"
**Expected**
มีปุ่ม "Add Item" และปุ่มตัวกรองรายการ · **ไม่มี** ปุ่ม "Expand all"/"Collapse all" (มีเฉพาะขั้นอนุมัติและจัดซื้อ) · **ไม่มี** เมนูถาม AI (ต้องติ๊กแถวก่อน ซึ่งใบร่างติ๊กไม่ได้) · **ไม่มี** ปุ่ม "Auto Allocate" (ของขั้นจัดซื้อ) · **ไม่มี** ปุ่มตัดสินรายบรรทัด (Approve / Reject / Send back / Split)

---

## TC-PR-050711 — บันทึกร่างที่ยังไม่ได้ใส่จำนวนได้
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` เลือก workflow แล้ว และเพิ่มรายการที่เลือก **คลัง + สินค้า + จุดส่งของ** ครบแต่ **ไม่กรอกจำนวน** (ปล่อยเป็น 0) และไม่กรอกของแถม
**Steps**
1. กดปุ่ม "Save"
2. รอให้หน้าเปลี่ยน
3. เปิดใบที่ได้แล้วอ่านค่าจำนวนของรายการนั้น
**Expected**
บันทึกสำเร็จ: มี toast "Purchase Request created successfully" และ URL เปลี่ยนเป็น `/procurement/purchase-request/<uuid>` · ไม่มีข้อความเตือนเรื่องจำนวน (กติกา "ต้องมีจำนวนหรือของแถม" เป็นด่านของปุ่มส่งใบเท่านั้น) · รายการในใบที่บันทึกแล้วแสดงจำนวนเป็น 0
**หมายเหตุ:** เก็บกวาดด้วยการลบใบร่างที่สร้างขึ้นท้ายเทส

---

## TC-PR-050712 — ระบบเติมหน่วย วันที่ต้องการ และสกุลเงินให้เองตอนกดบันทึก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` เลือก workflow แล้ว และเพิ่มรายการโดยเลือก **คลัง + สินค้า + จุดส่งของ** และกรอกจำนวน แต่ **ไม่แตะช่องหน่วย ไม่แตะวันที่ต้องการ และไม่แตะสกุลเงิน**
**Steps**
1. ก่อนกดบันทึก อ่านค่าที่ช่องวันที่ต้องการของแถวนั้น
2. กดปุ่ม "Save"
3. เปิดใบที่บันทึกแล้ว อ่านค่าหน่วยข้างจำนวน วันที่ต้องการ และรหัสสกุลเงินของรายการนั้น
**Expected**
ก่อนกดบันทึก ช่องวันที่ต้องการยังว่าง · หลังบันทึก รายการมี **หน่วย = หน่วยนับของสินค้าที่เลือก**, **วันที่ต้องการ = วันพรุ่งนี้** และ **สกุลเงิน = สกุลเงินเริ่มต้นของ BU `BLAVG`** ครบทั้งสามค่าโดยที่ผู้ใช้ไม่เคยกรอก

---

## TC-PR-050713 — บันทึกร่างสำเร็จ — แจ้งผล แล้วใบโผล่ในกลุ่ม My pending
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` กรอก workflow + คำอธิบายที่มี UID ของรอบรัน + รายการสินค้าครบ 1 รายการ
**Steps**
1. กดปุ่ม "Save"
2. อ่านข้อความแจ้งผลและ URL ปลายทาง แล้วจดเลขที่ใบจากหัวเอกสาร
3. เปิด `/procurement/purchase-request` ในกลุ่ม "My pending"
4. ค้นหาด้วยเลขที่ใบที่จดไว้
**Expected**
toast อ่านว่า "Purchase Request created successfully" · URL เป็น `/procurement/purchase-request/<uuid>` และหัวเอกสารแสดงเลขที่ใบที่ backend ออกให้ (ไม่ใช่คำว่า "Purchase Request") · ใบนั้นปรากฏเป็นแถวในกลุ่ม "My pending" พร้อมสถานะ Draft
**หมายเหตุ:** ลบใบร่างที่สร้างขึ้นท้ายเทส

---

## TC-PR-050714 — กดย้อนกลับหลังบันทึกร่าง ไม่ย้อนกลับเข้าฟอร์มเปล่า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น Requestor; เดินจาก `/procurement/purchase-request` → กด "New Purchase Request" → "Blank PR" → กรอกครบ → กด "Save" จนได้หน้ารายละเอียดของใบใหม่
**Steps**
1. ยืนยันว่าอยู่ที่ `/procurement/purchase-request/<uuid>`
2. กดปุ่มย้อนกลับของเบราว์เซอร์หนึ่งครั้ง
3. อ่าน URL ปลายทาง
**Expected**
ไปที่ `/procurement/purchase-request` (หน้ารายการ) โดยตรง · **ไม่** แวะที่ `/procurement/purchase-request/new` และ **ไม่** มีกล่อง "Discard changes?" เด้งขึ้น — หน้าสร้างถูกแทนที่ออกจากประวัติตอนบันทึกสำเร็จ
**หมายเหตุ:** ลบใบร่างที่สร้างขึ้นท้ายเทส

---

## TC-PR-050715 — เปิดใบร่างที่เพิ่งบันทึกซ้ำ ค่าที่กรอกอยู่ครบ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น Requestor; มีใบร่างที่เทสสร้างเองโดยรู้ค่าที่กรอกไว้ (คำอธิบายที่มี UID, ชื่อสินค้า, คลัง, จำนวนที่ตั้งไว้เป็นเลขเฉพาะเช่น 7)
**Steps**
1. เปิด `/procurement/purchase-request` แล้วเข้าใบร่างนั้นจากรายการ (ไม่ใช่จาก URL ที่ค้างอยู่หลังบันทึก)
2. อ่านค่าในช่องคำอธิบายบนหัวเอกสาร
3. อ่านชื่อสินค้า ชื่อคลัง และจำนวนของรายการแรก
**Expected**
คำอธิบายตรงกับที่กรอกไว้ทุกตัวอักษร (รวม UID ของรอบรัน) · ชื่อสินค้าและชื่อคลังตรงกับที่เลือกไว้ · จำนวนเท่ากับที่กรอก — ค่าเดินทางครบจากฟอร์มไป backend และกลับมา ไม่ใช่แค่ URL เปลี่ยน

---

## TC-PR-050716 — แก้ใบร่างแล้วค่ายังอยู่หลังโหลดหน้าใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น Requestor; มีใบร่างของตัวเองที่มีรายการสินค้าอย่างน้อย 1 รายการ
**Steps**
1. เปิดหน้ารายละเอียดของใบร่าง แล้วกด "Edit"
2. เปลี่ยนคำอธิบายเป็นข้อความใหม่ที่มี UID ของรอบรัน และเปลี่ยนจำนวนของรายการแรกเป็นเลขใหม่
3. กด "Save" แล้วรอข้อความแจ้งผล
4. โหลดหน้าเดิมใหม่ (reload)
5. อ่านคำอธิบายและจำนวนของรายการแรกอีกครั้ง
**Expected**
มี toast "Purchase Request updated successfully" และฟอร์มกลับสู่โหมดอ่าน (ปุ่ม "Edit" กลับมา) · หลัง reload คำอธิบายเป็นข้อความใหม่ และจำนวนของรายการแรกเป็นเลขใหม่ — ไม่ใช่ค่าก่อนแก้

---

## TC-PR-050717 — คลิกลิงก์ออกจากฟอร์มขณะกรอกค้าง — ถามก่อน และกลับมาแก้ต่อได้
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` และกรอกคำอธิบายไปแล้วอย่างน้อยหนึ่งตัวอักษร (ฟอร์มเป็น dirty)
**Steps**
1. คลิกลิงก์ไปหน้าอื่นในแอป (เช่นรายการเมนูด้านข้างของโมดูลเดียวกัน)
2. อ่านหัวเรื่องและปุ่มของกล่องที่เด้งขึ้น
3. กดปุ่ม "Keep editing"
4. อ่าน URL และค่าที่ค้างในช่องคำอธิบาย
**Expected**
การคลิกลิงก์ **ไม่** พาออกจากหน้าไปทันที — มีกล่องเตือนหัวเรื่อง "Discard changes?" คำอธิบาย "You have unsaved changes that will be lost." และปุ่มสองปุ่ม "Keep editing" กับ "Discard" · หลังกด "Keep editing" กล่องปิด, URL ยังเป็น `/procurement/purchase-request/new` และข้อความที่กรอกไว้ยังอยู่ครบ

---

## TC-PR-050718 — ยืนยันทิ้งของที่กรอกค้าง — ออกจริงและไม่มีใบถูกสร้าง
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ต่อจาก `TC-PR-050717`: กล่อง "Discard changes?" เปิดอยู่บนฟอร์ม `/new` ที่กรอกค้างด้วยคำอธิบายที่มี UID ของรอบรัน
**Steps**
1. กดปุ่ม "Discard"
2. อ่าน URL ปลายทาง
3. กลับไปที่ `/procurement/purchase-request` แล้วค้นหาด้วย UID ของรอบรัน
**Expected**
ออกไปยังหน้าที่คลิกไว้จริง (ไม่ค้างที่ `/new`) · ค้นหาด้วย UID ของรอบรันแล้ว **ไม่พบใบใด** — การทิ้งของที่กรอกค้างไม่ได้สร้างใบร่างไว้เบื้องหลัง

---

## TC-PR-050719 — กดส่งใบทั้งที่กรอกไม่ครบ — ไม่เปิดกล่องยืนยันเลย
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` เลือก workflow แล้ว กด "Add Item" หนึ่งครั้งแล้ว **เลือกเฉพาะคลัง** (ยังไม่เลือกสินค้าและยังไม่เลือกจุดส่งของ)
**Steps**
1. กดปุ่ม "Submit" ที่แถบท้ายหน้า
2. ตรวจว่ามีกล่องยืนยันเด้งขึ้นหรือไม่
3. อ่านข้อความแจ้งเตือนที่เด้งขึ้น
**Expected**
**ไม่มี** กล่องยืนยันส่งใบเปิดขึ้นเลย (ตัวตรวจทำงานก่อนกล่อง) · มี toast เตือนที่นับจำนวนรายการที่ยังไม่ครบ เช่น "1 item is still incomplete — jumped to the first field to fix." · URL ยังเป็น `/procurement/purchase-request/new` และไม่มีใบถูกสร้างหรือถูกส่ง

---

## TC-PR-050720 — ฟอร์มใบใหม่ไม่มียอดรวม แต่มีปุ่มส่งใบอยู่ที่แถบท้ายหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; เปิด `/procurement/purchase-request/new`
**Steps**
1. อ่านแถบท้ายหน้า (แถบที่ปักอยู่ล่างสุด)
2. ตรวจหาป้าย Subtotal / Discount / Net / Tax / Grand Total
3. ตรวจหาปุ่ม "Submit"
4. เปรียบเทียบกับหน้ารายละเอียดของใบร่างที่บันทึกแล้ว
**Expected**
บนหน้า `/new` แถบท้ายหน้า **ไม่มี** ป้ายยอดรวมทั้งห้าค่า แต่ **มี** ปุ่ม "Submit" · บนหน้ารายละเอียดของใบร่างที่บันทึกแล้ว แถบเดียวกันแสดงยอดรวมครบห้าค่าเรียงตามลำดับ Subtotal · Discount · Net · Tax · Grand Total พร้อมรหัสสกุลเงินต่อท้ายยอดรวมสุดท้าย และยังมีปุ่ม "Submit" อยู่

---

## TC-PR-050721 — สร้างแล้วส่งใบในครั้งเดียวจากฟอร์มใบใหม่
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น Requestor; อยู่ที่ `/procurement/purchase-request/new` กรอก workflow + คำอธิบายที่มี UID ของรอบรัน + รายการสินค้าครบ 1 รายการพร้อมจำนวน > 0 — **ยังไม่เคยกดปุ่ม "Save"**
**Steps**
1. กดปุ่ม "Submit" ที่แถบท้ายหน้า
2. กดปุ่มยืนยันในกล่องที่เด้งขึ้น
3. อ่านข้อความแจ้งผลและ URL ปลายทาง
4. ค้นหาใบด้วย UID ของรอบรันในกลุ่ม "All Documents" แล้วเปิดดูสถานะ
**Expected**
toast อ่านว่า "Purchase request submitted" · หน้าเด้งกลับไปที่ `/procurement/purchase-request` (หน้ารายการ) ไม่ค้างที่ฟอร์ม · ใบที่ค้นเจอมีเลขที่ใบจริงและสถานะเป็น In Progress — ใบถูกสร้างและถูกส่งในจังหวะเดียวโดยไม่ต้องกด Save ก่อน
**🚫 เคสนี้เปลี่ยนสถานะเอกสารแบบย้อนกลับไม่ได้** — ใบเดินเข้า workflow ของผู้อนุมัติแล้วและผู้ขอเรียกคืนเองไม่ได้ ต้องสร้างใบใหม่ทุกรอบรัน ห้ามใช้ใบที่มีอยู่เดิมใน BU

---

## TC-PR-050722 — กล่องยืนยันส่งใบไม่มีช่องให้กรอกข้อความ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; เปิดใบร่างของตัวเองที่กรอกครบแล้ว (มีรายการที่จำนวน > 0)
**Steps**
1. กดปุ่ม "Submit"
2. อ่านหัวเรื่องและคำอธิบายของกล่องที่เด้งขึ้น
3. นับช่องกรอกข้อความ (`textarea` / `input[type=text]`) ในกล่อง
4. อ่านชื่อปุ่มทั้งสองในกล่อง แล้วกดปุ่มยกเลิก
**Expected**
กล่องมีหัวเรื่อง "Submit Purchase Request" และคำอธิบาย "This will submit the PR for approval. Are you sure?" · **ไม่มี** ช่องกรอกข้อความใด ๆ ในกล่อง (ต่างจากกล่อง "ส่งกลับ" ของผู้อนุมัติที่มีช่องข้อความรายรายการ) · ปุ่มยืนยันอ่านว่า "Submit" และมีปุ่มยกเลิกคู่กัน · หลังกดยกเลิก กล่องปิด สถานะของใบยังเป็น Draft และ URL ไม่เปลี่ยน

---

## TC-PR-050723 — ใบที่ส่งแล้ว — คำอธิบายกับ workflow กลายเป็นข้อความ และไม่มีปุ่มเพิ่มรายการ
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น Requestor; มีใบที่เทสสร้างและส่งเองจนสถานะเป็น In Progress
**Steps**
1. เปิดหน้ารายละเอียดของใบนั้น
2. อ่านช่องคำอธิบายและช่อง Workflow บนหัวเอกสาร แล้วลองพิมพ์ทับ
3. ตรวจหาปุ่ม "Add Item" ในแถบเหนือตารางรายการ
4. ตรวจหาปุ่ม "Delete"
**Expected**
ช่องคำอธิบายและช่อง Workflow อยู่ในสถานะกรอกไม่ได้ (พิมพ์ทับแล้วค่าไม่เปลี่ยน) — ช่องยังอยู่ตำแหน่งเดิมบนหัวเอกสาร ไม่ได้หายไป · **ไม่มี** ปุ่ม "Add Item" · **ไม่มี** ปุ่ม "Delete" (มีเฉพาะสถานะ Draft)
**🚫 ต้องใช้ใบที่ส่งแล้ว ซึ่งย้อนกลับไม่ได้** — seed ใบใหม่ต่อรอบรัน

---

## TC-PR-050724 — ประวัติ workflow ของใบที่ส่งแล้วบันทึกการส่งของผู้ขอไว้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; มีใบที่เทสสร้างและส่งเองจนสถานะเป็น In Progress (จึงมีประวัติ workflow อย่างน้อยหนึ่งรายการ)
**Steps**
1. เปิดหน้ารายละเอียดของใบนั้น
2. กดปุ่มเปิดประวัติบนแถบขั้นตอน workflow ใต้หัวเอกสาร
3. อ่านหัวเรื่องของแผงที่เลื่อนออกมาและรายการแรกในไทม์ไลน์
**Expected**
แผงเลื่อนออกมาทางขวาพร้อมหัวเรื่อง "Workflow History" · ไทม์ไลน์มีรายการอย่างน้อยหนึ่งบรรทัดที่ระบุชื่อผู้ขอและเวลาที่สร้าง/ส่งใบ · **ไม่** แสดงข้อความ "No workflow history."
**🚫 ต้องใช้ใบที่ส่งแล้ว ซึ่งย้อนกลับไม่ได้** — ใบร่างไม่มีแผงนี้ให้เปิดเลย

---

## TC-PR-050725 — ผู้ขอเปิดใบของคนอื่นที่อยู่ระหว่างอนุมัติ — ไม่มีปุ่มจัดการใด ๆ
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น Requestor; มีใบขอซื้อของผู้ขอ **คนอื่น** ใน BU `BLAVG` ที่สถานะเป็น In Progress และบัญชีนี้ไม่ได้เป็นผู้อนุมัติของขั้นปัจจุบัน (หาได้จากกลุ่ม "All Documents")
**Steps**
1. เปิดหน้ารายละเอียดของใบนั้น
2. ตรวจหาปุ่ม "Edit", "Delete" และ "Submit"
3. ตรวจว่าตารางรายการมีช่องกรอกที่แก้ได้หรือไม่
**Expected**
เปิดหน้าได้ตามปกติ ไม่ถูกเด้งออกหรือขึ้นหน้าปฏิเสธสิทธิ์ · **ไม่มี** ปุ่ม "Edit" (บัญชีนี้ไม่ใช่ actor ของขั้นปัจจุบัน) · **ไม่มี** ปุ่ม "Delete" · **ไม่มี** ปุ่ม "Submit" · ทุกค่าในตารางรายการเป็นข้อความอ่านอย่างเดียว

---

## TC-PR-050726 — ปุ่ม More ติดจุดแจ้งเตือนและบอกจำนวนคอมเมนต์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; มีใบร่างของตัวเองที่ **ยังไม่มีคอมเมนต์** และมีอีกใบ (หรือใบเดิมหลังเขียนคอมเมนต์ใน `TC-PR-050728`) ที่มีคอมเมนต์แล้วอย่างน้อย 1 อัน
**Steps**
1. เปิดใบที่ยังไม่มีคอมเมนต์ แล้วอ่านปุ่ม "More" ว่ามีจุดกลมอยู่ข้างข้อความหรือไม่
2. กางเมนูแล้วอ่านชื่อรายการเมนูคอมเมนต์
3. เปิดใบที่มีคอมเมนต์แล้วทำซ้ำข้อ 1–2
**Expected**
ใบที่ยังไม่มีคอมเมนต์: ปุ่ม "More" ไม่มีจุดกลม และรายการเมนูอ่านว่า "Comment" เฉย ๆ · ใบที่มีคอมเมนต์: ปุ่ม "More" มีจุดกลมอยู่ในแถวเดียวกับข้อความ และรายการเมนูอ่านว่า "Comment (N)" โดย N เท่ากับจำนวนคอมเมนต์จริงของใบนั้น · เมนูยังมีรายการ Duplicate, Activity และ Print อยู่ด้วยในโหมดอ่าน

---

## TC-PR-050727 — แผงคอมเมนต์ของใบที่ยังไม่มีใครคอมเมนต์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; มีใบร่างของตัวเองที่ยังไม่มีคอมเมนต์
**Steps**
1. เปิดหน้ารายละเอียดของใบ กางเมนู "More" แล้วเลือก "Comment"
2. อ่านหัวเรื่องของแผงที่เลื่อนออกมา
3. อ่านข้อความในพื้นที่รายการคอมเมนต์
4. อ่านสถานะของปุ่มส่ง (`aria-label` = "Send comment") ขณะที่ยังไม่พิมพ์อะไร
**Expected**
แผงเลื่อนออกมาพร้อมหัวเรื่อง "Comments (0)" · พื้นที่รายการแสดง "No Comments Yet" พร้อมคำอธิบาย "You haven't created any comments yet." · ปุ่มส่งอยู่ในสถานะกดไม่ได้ (ยังไม่มีทั้งข้อความและไฟล์) · มีปุ่มแนบไฟล์ (`aria-label` = "Attach file") และช่องพิมพ์ที่มี placeholder "Add comment..."

---

## TC-PR-050728 — เขียนคอมเมนต์บนใบร่างของตัวเอง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น Requestor; แผงคอมเมนต์ของใบร่างของตัวเองเปิดอยู่
**Steps**
1. พิมพ์ข้อความที่มี UID ของรอบรันลงในช่อง "Add comment..."
2. กดปุ่มส่ง (`aria-label` = "Send comment")
3. อ่านข้อความแจ้งผลและรายการคอมเมนต์ในแผง
4. ปิดแผงแล้วอ่านรายการเมนูคอมเมนต์ในเมนู "More" อีกครั้ง
**Expected**
มี toast "Comment added" · คอมเมนต์ใหม่ปรากฏในแผงพร้อมข้อความที่พิมพ์ ชื่อผู้เขียน และเวลาแบบสัมพัทธ์ (เช่น "Just now") · หัวเรื่องแผงเปลี่ยนเป็น "Comments (1)" · รายการเมนูเปลี่ยนเป็น "Comment (1)" และปุ่ม "More" มีจุดแจ้งเตือน
**หมายเหตุ:** ข้อมูลถาวรฝั่ง backend — ลบคอมเมนต์ทิ้งท้ายเทส (หรือลบทั้งใบร่าง)

---

## TC-PR-050729 — Enter ส่งคอมเมนต์ Shift+Enter ขึ้นบรรทัดใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; แผงคอมเมนต์ของใบร่างของตัวเองเปิดอยู่
**Steps**
1. พิมพ์ข้อความบรรทัดแรกที่มี UID ของรอบรัน แล้วกด Shift+Enter
2. พิมพ์ข้อความบรรทัดที่สอง แล้วอ่านค่าที่ค้างในช่อง
3. กด Enter เปล่า ๆ
4. อ่านรายการคอมเมนต์และสถานะของช่องพิมพ์
**Expected**
หลัง Shift+Enter ค่าที่ค้างในช่องมีขึ้นบรรทัดใหม่คั่นสองบรรทัดและ **ไม่มี** คอมเมนต์ถูกส่ง · หลังกด Enter เปล่า คอมเมนต์ถูกส่งทันที: มี toast "Comment added" คอมเมนต์สองบรรทัดปรากฏในรายการ และช่องพิมพ์ถูกล้างว่าง
**หมายเหตุ:** ข้อมูลถาวร — ลบคอมเมนต์ทิ้งท้ายเทส

---

## TC-PR-050730 — แนบไฟล์ไปกับคอมเมนต์
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; แผงคอมเมนต์ของใบร่างของตัวเองเปิดอยู่; มีไฟล์ `.txt` ขนาดเล็ก (< 10 MB) เตรียมไว้ในไดเรกทอรีชั่วคราวของรอบรัน
**Steps**
1. ตรวจ `accept` และ `multiple` ของ `input[type=file]` ที่ซ่อนอยู่ในแผง
2. ป้อนไฟล์ `.txt` เข้า `input[type=file]` นั้น
3. อ่านรายการไฟล์ที่รอส่งใต้ช่องพิมพ์ และอ่านสถานะปุ่มส่งขณะที่ยังไม่พิมพ์ข้อความ
4. พิมพ์ข้อความที่มี UID ของรอบรัน แล้วกดปุ่มส่ง
**Expected**
`input[type=file]` มี `accept="image/*,.pdf,.txt,.csv"` และมี attribute `multiple` · หลังป้อนไฟล์ มีรายการไฟล์ที่รอส่งพร้อมปุ่มเอาออกที่มี `aria-label` ขึ้นต้นด้วย "Remove " และชื่อไฟล์ · ปุ่มส่ง **กดได้** ตั้งแต่ยังไม่พิมพ์ข้อความ (มีไฟล์ก็พอ) · หลังกดส่ง มี toast "Comment added" และคอมเมนต์ในรายการแสดงไฟล์แนบชื่อเดิม
**หมายเหตุ:** ข้อมูลถาวร (คอมเมนต์ + ไฟล์) — ลบทิ้งท้ายเทส · ห้าม commit ไฟล์ตัวอย่างลง repo ให้สร้างในไดเรกทอรีชั่วคราว

---

## TC-PR-050731 — แนบไฟล์ชนิดที่ไม่รับ — เตือนพร้อมชื่อไฟล์และไม่เข้าคิว
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login เป็น Requestor; แผงคอมเมนต์ของใบร่างของตัวเองเปิดอยู่; มีไฟล์ชนิดนอก allowlist (เช่น `.zip`) เตรียมไว้ในไดเรกทอรีชั่วคราวของรอบรัน
**Steps**
1. ป้อนไฟล์ `.zip` เข้า `input[type=file]` ของแผงคอมเมนต์
2. อ่านข้อความแจ้งเตือนที่เด้งขึ้น
3. นับรายการไฟล์ที่รอส่งใต้ช่องพิมพ์
4. อ่านสถานะของปุ่มส่งขณะที่ยังไม่พิมพ์ข้อความ
**Expected**
มี toast เตือนที่ **เอ่ยชื่อไฟล์** ในรูป `"<ชื่อไฟล์>" — only images and documents are allowed` · **ไม่มี** ไฟล์เข้าคิวรอส่ง (จำนวนรายการไฟล์ที่รอส่งเป็น 0) · ปุ่มส่งยังกดไม่ได้ · แผงคอมเมนต์ยังเปิดอยู่และใช้งานต่อได้

---

## TC-PR-050732 — แก้และลบคอมเมนต์ของตัวเอง
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น Requestor; ใบร่างของตัวเองมีคอมเมนต์ที่บัญชีนี้เขียนไว้แล้วอย่างน้อย 1 อัน (สร้างในขั้นตอนของเทสเอง)
**Steps**
1. เปิดแผงคอมเมนต์แล้ววางเมาส์/โฟกัสที่คอมเมนต์ของตัวเอง
2. กดปุ่มแก้ไข แล้วเปลี่ยนข้อความเป็นข้อความใหม่ที่มี UID ของรอบรัน จากนั้นกดปุ่มบันทึก (`aria-label` = "Save comment")
3. อ่านข้อความแจ้งผลและข้อความของคอมเมนต์นั้น
4. กดปุ่มลบของคอมเมนต์เดิม แล้วอ่านกล่องยืนยัน จากนั้นยืนยันการลบ
**Expected**
ปุ่มแก้ไขและปุ่มลบมีอยู่บนคอมเมนต์ที่บัญชีนี้เขียนเอง · หลังบันทึกการแก้ มี toast "Comment updated" และข้อความในรายการเปลี่ยนเป็นข้อความใหม่ · กล่องยืนยันการลบมีหัวเรื่อง "Delete Comment" และคำอธิบาย "Are you sure you want to delete this comment? This action cannot be undone." · หลังยืนยัน มี toast "Comment deleted" คอมเมนต์หายจากรายการ และตัวเลขในหัวเรื่องแผงลดลงหนึ่ง
**หมายเหตุ:** ข้อมูลถาวร — เทสนี้จบด้วยการลบของที่ตัวเองสร้างอยู่แล้ว

---

## TC-PR-050733 — เปิดบันทึกการเปลี่ยนแปลงของใบร่าง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Requestor; มีใบร่างของตัวเองที่บันทึกแล้ว (รู้เลขที่ใบ)
**Steps**
1. เปิดหน้ารายละเอียดของใบร่าง กางเมนู "More" แล้วเลือกรายการ "Activity"
2. อ่านหัวเรื่องและคำอธิบายของแผงที่เลื่อนออกมา
3. ปิดแผงแล้วยืนยันว่ายังอยู่ที่หน้าเดิม
**Expected**
แผงเลื่อนออกมาทางขวาพร้อมหัวเรื่อง "Activity" · คำอธิบายใต้หัวเรื่องขึ้นต้นด้วยเลขที่ใบ ตามด้วย " · Everything done to this record, newest first" · ปิดแผงแล้ว URL ยังเป็นหน้ารายละเอียดใบเดิม และสถานะของใบไม่เปลี่ยน (เป็นการอ่านล้วน)

---

## TC-PR-050734 — กล่องยืนยันลบเอ่ยเลขที่ใบ และลบแล้วแจ้งผล
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น Requestor; มีใบร่างที่เทสสร้างขึ้นเองและรู้เลขที่ใบ
**Steps**
1. เปิดหน้ารายละเอียดของใบร่าง แล้วกดปุ่ม "Delete"
2. อ่านหัวเรื่องและคำอธิบายของกล่องยืนยัน
3. กดปุ่มยืนยันการลบ
4. อ่านข้อความแจ้งผลและ URL ปลายทาง แล้วค้นหาเลขที่ใบเดิมในหน้ารายการ
**Expected**
กล่องยืนยันมีหัวเรื่อง "Delete Purchase Request" และคำอธิบายที่ **เอ่ยเลขที่ใบตรงตัว** ในรูป `Are you sure you want to delete "<เลขที่ใบ>"? This action cannot be undone.` · หลังยืนยัน มี toast "Purchase Request deleted successfully" และหน้าเด้งกลับไปที่ `/procurement/purchase-request` · ค้นหาเลขที่ใบเดิมแล้วไม่พบแถวใด
**หมายเหตุ:** ลบข้อมูลจริง — ใช้เฉพาะใบร่างที่เทสสร้างขึ้นเองในรอบรันนั้น ห้ามลบใบที่มีอยู่เดิมใน BU
