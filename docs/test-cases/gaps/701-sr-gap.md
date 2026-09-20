# Store Requisition (ใบเบิกร้านค้า) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบจริง** เท่านั้น — และคำว่า "ยังไม่ครอบ" ที่นี่ไม่ได้แปลว่า "ไม่มีเคส" `tests/701-sr.spec.ts` มี 46 เคสที่รันจริง แต่ทั้งไฟล์มี `expect(...)` รวมกัน **2 ครั้ง** เคสที่เหลืออีก 44 เดินผ่าน UI แล้วจบโดยไม่ตรวจอะไรเลย ไฟล์นี้จึงเขียนเคสที่มี oracle ล้มได้จริงให้กับพฤติกรรมที่เคสเดิม "อ้างว่าทดสอบ" แต่ไม่เคยยืนยัน_

**Module:** Store Requisition — ฟอร์มใบเบิก (สร้าง / แก้ไข / ตัดสินรายบรรทัด / ส่ง-อนุมัติ-ปฏิเสธ-ส่งกลับ-จ่ายของ)
**Frontend route:** `routes/store-operation/store-requisition/` (`store-requisition.route.tsx`, `store-requisition-new.route.tsx`, `store-requisition-edit.route.tsx` → `sr-form.tsx` + 24 ไฟล์ย่อย)  •  **URL:** `/store-operation/store-requisition` · `/store-operation/store-requisition/new` · `/store-operation/store-requisition/:id`
**Prefix:** `SR` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/701-sr.spec.ts` (และ `tests/720-stock-issue.spec.ts` + `docs/test-cases/gaps/720-stock-issue-gap.md` ซึ่งขับ route เดียวกันด้วย prefix `SI`)
**Total test cases:** 62

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **สเปกครอบอะไรไปแล้ว — คำตอบคือสองเคส ห้ามเขียนซ้ำ** ทั้งไฟล์ `701-sr.spec.ts` มี `expect(...)` อยู่ 2 จุด และทั้งสองจุดคือ assertion เดียวกันเป๊ะ: `expect(sr.anyError().first()).toBeVisible()` — (1) **`TC-SR-010004`** (`701-sr.spec.ts:83`) เปิดหน้ารายการ → กด New → กด Save → ยืนยันว่ามี element ที่เข้าเกณฑ์ `[aria-invalid="true"], .text-destructive, [role="alert"][data-slot="field-error"]` โผล่มาอย่างน้อยหนึ่งตัว · (2) **`TC-SR-050003`** (`701-sr.spec.ts:482`) เปิด `/new` → กดปุ่มชื่อ `submit for approval` (ซึ่งไม่มีในแอป การกดถูก `.catch(() => {})` กลืนไป) → ยืนยัน element เดียวกัน · **`TC-SR-010002`** เป็น `test.fixme` ไม่ได้รัน และตัวมันเองมี `expect(true).toBe(true)` อยู่หนึ่งสาขา · เคสที่เหลือ **44 เคส** จบที่ `gotoList()` / `gotoNew()` หรือกดปุ่มแล้วจบ ไม่มี assertion เลย ไฟล์นี้จึงถือว่า "ครอบแล้ว" แค่ประโยคเดียวคือ *"กด Save บนฟอร์มสร้างที่ยังไม่ได้กรอก แล้วมีสัญญาณ error โผล่บนจอ"* — เคสในไฟล์นี้ที่แตะ validation จึงผูกกับ **ข้อความจริง ช่องจริง และ toast จริง** ไม่ใช่ "มี error สักตัว"
>
> **ไม่เขียนทับ `720-stock-issue-gap.md`** ไฟล์นั้น (44 เคส prefix `SI`) ขับ route เดียวกันและครอบ **หน้ารายการ + หัวเอกสาร + ค้นหา/กรอง + เมนู More/Duplicate/Print + การมองเห็นคอลัมน์ตามบทบาท + ปุ่ม Issue กับ toast ของมัน + ยอดรวมท้ายใบ + แท็บ Stock Movement** ไปแล้ว (`TC-SI-010101`–`060110`) ไฟล์นี้จึงจงใจ **ไม่** เขียนเรื่องเหล่านั้นซ้ำ และเก็บเฉพาะสิ่งที่ยังไม่มีใครยืนยัน: **ตัวฟอร์มสร้าง/แก้ไข กติกาของช่องหัวใบ การเพิ่ม-ลบรายการ กล่องข้อมูลสต๊อกรายแถว การบันทึก/ทิ้งงาน และเนื้อในของกล่องยืนยัน 5 ตัว (Submit / Approve / Reject / Send Back / Issue)** · จุดที่ใกล้กันที่สุดสองจุดถูกเขียนให้ไม่ทับกันโดยตั้งใจ: `TC-SR-010109` ยืนยัน**การ derive ชนิดใบแบบสด ๆ ขณะกรอกฟอร์มใหม่** ส่วน `TC-SI-020101` ยืนยันป้ายชนิดใบบนหัวใบที่บันทึกแล้ว · `TC-SR-080103` ยืนยัน**เนื้อในกล่อง Reject หมู่** ส่วน `TC-SI-060106` ยืนยันแค่ว่าปุ่มตัดสินรายแถวโผล่
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้** —
> (1) **`/new` ถูกห่อด้วย `CreateWorkflowGate`** (`store-requisition-new.route.tsx:20-23`) ต่างจากหน้ารายการที่แค่ทำปุ่มให้จาง — ไม่มี SR workflow ที่ `can_create = true` เลยจะเห็น `AccessDeniedBlock` แทนทั้งฟอร์ม ข้อความคือ `"None of the approval flows let you start a store requisition."` · คอมเมนต์ใน `701-sr.spec.ts:110-117` ที่บันทึกว่า "โมดูลนี้ไม่มี client-side role gate ต่างจาก Purchase Order" **ล้าสมัยแล้ว** — gate มีอยู่จริง แค่ตัดสินจาก *workflow ที่เริ่มได้* ไม่ใช่ RBAC role
> (2) **ไม่มีปุ่ม "Save as Draft" / "Save and Close" / "Submit for Approval" / "Record Issuance" / "Bulk Actions" / "Delegate Approvals" / "Sort By" / signature pad ในโมดูลนี้** — locator ของ page object (`tests/pages/store-requisition.page.ts`) หาปุ่มเหล่านี้ทั้งหมด และเกือบทุกจุดเรียกถูกห่อ `.catch(() => {})` ไว้ เคสเลย "ผ่าน" โดยไม่ได้กดอะไร · ของจริงคือ ปุ่ม **Save** (`type="submit" form="store-requisition-form"`) บนแถบหัว, ปุ่ม **Submit / Approve / Reject / Send Back / Issue** ใน **footer bar** (`sr-footer.tsx`), และ **Add Item** เหนือตาราง · `saveAsDraftButton()` รอดมาได้เพราะ regex มี `/^save$/i` พ่วงอยู่ ส่วนที่เหลือไม่แมตช์อะไรเลย
> (3) **ไม่มี auto-save** ทั้งโมดูล (grep `setInterval` / `autosave` ใน `routes/store-operation/store-requisition/` ได้ศูนย์) — กลไกจริงที่กันงานหายคือ `useNavigationGuard` + `DiscardDialog` หัวข้อ `"Discard changes?"` ปุ่ม `Keep editing` / `Discard` เคส `TC-SR-040003` ของสเปก ("Auto-Save Draft Every 60 Seconds") จึงไม่มีอะไรให้ยืนยัน ไฟล์นี้เขียน `TC-SR-040105` บนกลไกที่มีจริงแทน
> (4) **ไม่มี "draft" ให้กดแยกต่างหาก** — การกด Save *คือ* การสร้างใบสถานะ draft แล้ว `navigate(/:id, { replace: true })` เข้าโหมดดูทันที (`use-sr-form-actions.ts:186-200`) toast คือ `"Store Requisition created successfully"` ไม่ใช่ข้อความเฉพาะของโมดูล
> (5) **ปุ่ม Submit กดได้ตั้งแต่ใบที่ยังไม่เคยบันทึก** (`sr-form.tsx:202-208` `canSubmit = isAdd || ...`) และ `openSubmitDialog` วิ่ง `form.handleSubmit` ก่อน — กรอกไม่ครบ **กล่องยืนยันจะไม่เปิด** แต่ขึ้น toast `"Some details are missing — jumped to the field to fix."` หรือ `"{n} items are still incomplete — jumped to the first field to fix."` แทน · ยืนยันแล้วระบบ create → submit ให้เองในคราวเดียว
> (6) **ช่องจำนวนไม่มีข้อความ error เป็นตัวหนังสือ** `QtyUnitCell` ส่งแค่ `error={!!error}` (`use-sr-item-table.tsx:334`) ไม่ส่ง `errorMessage` ผลคือกล่อง `[data-slot="input-suffix-field"]` ได้ `data-invalid="true"` + กรอบแดง แต่ **ไม่มี tooltip และไม่มีข้อความ** · และมีแค่ `requested_qty` ที่มีกติกา `.min(0)` (`sr-form-schema.ts:22-24`) — `approved_qty` / `issued_qty` เป็น `z.coerce.number()` เปล่า ๆ ไม่มีเพดานเทียบกับ requested เลย
> (7) **ปุ่มในแถบท้ายจอมาจาก `computeSrAction(สถานะรายแถว)` ไม่ใช่จากสถานะใบ** (`sr-form-schema.ts:118-135`) — มีแถวไหนเป็น `review` แม้แถวเดียว action ของทั้งใบเป็น `review` (ชนะทุกอย่าง) → เห็นปุ่ม **Send Back** ปุ่มเดียว · ทุกแถวที่ตัดสินเป็น `reject` → **Reject** · ผสม approve/reject โดยมี approve อย่างน้อยหนึ่ง → **Approve** (บทบาท `approve`) หรือ **Issue** (บทบาท `issue`) · ยังไม่ตัดสินอะไรเลย → `none` = **ไม่มีปุ่มให้กด**
> (8) **กล่องยืนยันทั้งห้าเป็น Radix `AlertDialog` (`role="alertdialog"`) ไม่ใช่ `dialog`** — `getByRole("dialog")` ไม่แมตช์ (page object แก้ไว้แล้วที่ `confirmDialogButton`/`reasonInput`) · และ **ช่องเหตุผลมีเฉพาะกล่อง Send Back กับกล่อง Reject หมู่จากแถบเหนือตาราง** เท่านั้น — กล่อง Approve / Reject / Issue ที่มาจาก footer ส่งมาด้วย `showMessage={false}` (`sr-form-dialogs.tsx:97, 113, 129`) จึง **ไม่มีช่องให้กรอกเหตุผล** ทั้งที่ข้อความในกล่อง Reject เขียนว่า `"Please provide a reason."` — ความไม่ลงรอยนี้บันทึกไว้เป็นข้อเท็จจริง เคส `TC-SR-110102` ยืนยัน UI ตามที่ออกแบบไว้จริง ไม่ได้ยืนยันว่ามันพัง
> (9) **`reasonPlaceholder` คือ `"Enter reason (optional)..."` และไม่มีกติกาความยาวขั้นต่ำที่ไหนเลย** — เคสเดิมของสเปกที่อ้าง `"Rejection reason must be at least 50 characters"` (`TC-SR-110002`) และ `"Review comments are required (min 20 characters)"` (`TC-SR-100002`) ไม่มีที่มาใน source · สิ่งที่ **บังคับ** จริงในกล่อง Send Back คือ **ขั้นตอนปลายทาง** (`stageRequired` ใน `sr-action-dialog.tsx:124`) ซึ่งทำให้ปุ่มยืนยัน disabled จนกว่าจะเลือก
> (10) **คีย์ i18n ที่ห้ามเขียนเคสอิงถึง** `overIssuedTitle` / `overIssuedDesc` / `overIssuedCount` / `overApproved` / `transferSummary` / `summaryTotalRequested` / `summaryTotalApproved` / `summaryTotalIssued` / `footerNote` / `documentInfo` / `sectionNotes` มีอยู่ใน `messages/en.json` แต่ไม่มีโค้ดที่ไหนเรียกใช้ (ตรงกับที่ `720-stock-issue-gap.md` ข้อ 7 บันทึกไว้) — ไฟล์นี้ไม่มีเคสของมัน
> (11) **กล่องข้อมูลสต๊อกรายแถวเปิดด้วยการ "คลิก" ไม่ใช่ hover** (`components/share/inventory-dialog.tsx:131-133` เขียนเหตุผลไว้เอง) ปุ่มมี `aria-label="Inventory Information"` · ยังไม่เลือกสินค้ากล่องจะเล็กและมีแค่บรรทัด `"Select a product to view inventory"` · เลือกแล้วเห็นสี่ค่า `On Hand` / `On Order` / `Re-order` / `Re-stock` โดยสองค่าแรกเป็นปุ่มเปิดกล่องรายละเอียดต่อ — นี่คือ "real-time inventory check" ที่เคส `TC-SR-030001`–`030004` ของสเปกบรรยายไว้ 4 เคสแล้ว `gotoList()` จบ
> (12) **ยอดเงินรายแถวมาจาก API ไม่ใช่คำนวณในหน้าจอ** `SrItemCostSync` ยิง `GET /{bu}/cost/products/{product}/location/{from}/qty/{qty}` แล้วเขียน `total_cost` กลับเข้าฟอร์ม **โดยไม่ตั้ง `shouldDirty`** (`sr-item-cost-sync.tsx:44-55`) — ต้นทุนที่ไหลเข้ามาเองจึงต้องไม่ทำให้ฟอร์มติด discard dialog
>
> **ช่วงเลขที่เลือก** — `SR` ลงทะเบียน section `01–12, 90` ไว้แล้วที่ `docs/test-id-scheme.md:55` ไฟล์นี้อยู่ในชุดเดิมทั้งหมด **ไม่ต้องลงทะเบียน section เพิ่ม** · สเปกใช้ seq `0001`–`0005` ของแต่ละ section (และ `TC-SR-9000xx` เป็นหัวข้อคอมเมนต์คั่นบล็อก ไม่ใช่เทส) ไฟล์นี้จึงเลือก sub-block `01xx` ของ section เดิม (`TC-SR-0101xx`, `TC-SR-0201xx`, …, `TC-SR-1201xx`) ซึ่งว่างทั้งหมด ไม่ชนกับ ID ใดในสเปกหรือ helper · **section 06 ถูกใช้ตามของจริง**: ชื่อเดิมในสเปกคือ "Approver Navigation & List Actions" แต่หน้ารายการถูก `720-stock-issue-gap.md` ครอบไปหมดแล้ว ที่นี่จึงใช้ 06 เป็น **"แถบสรุปท้ายจอและชุดปุ่มตามบทบาท"** ซึ่งเป็นพื้นผิวที่ผู้อนุมัติใช้ทำงานจริงในหน้าใบ
>
> **Role** — ค่าเริ่มต้นคือ Admin (`admin@blueledgers.com`, BU = `BLAVG`) สำหรับฝั่งสร้าง/แก้ไข · เคสที่ผูกกับบทบาทในใบ (`role` ที่ backend ส่งมาในตัวใบ ไม่ใช่ permission ฝั่งหน้าจอ) ต้องการใบที่ `storeRequisition.role` เป็น `approve` / `issue` / `view_only` ตามที่เคสระบุ — สเปกเดิมใช้ `purchase@blueledgers.com` เป็นฝั่งอนุมัติ/คลัง และ `requestor@blueledgers.com` เป็นฝั่งไม่มีสิทธิ์ คนแปลงเป็นสเปก reuse fixture เดิมได้ (ทั้งสามบัญชีมีอยู่จริงใน `tests/test-users.ts`)
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SR-010101 | ไม่มี workflow ที่เริ่มได้ หน้า /new ถูกบล็อกทั้งหน้า | High | Authorization |
| TC-SR-010102 | ใบใหม่ตั้งวันที่ขอเป็นวันนี้ และวันที่คาดว่าจะได้รับเป็นพรุ่งนี้ | High | Functional |
| TC-SR-010103 | แถบหัวใบของใบใหม่: ชื่อโมดูล ป้าย New ผู้ขอและแผนกจากโปรไฟล์ | Medium | Functional |
| TC-SR-010104 | บล็อก Request details มีห้าช่อง และสี่ช่องแรกติดดาวบังคับ | High | Functional |
| TC-SR-010105 | ช่องคลังปลายทางถูกปิดจนกว่าจะเลือกคลังต้นทาง | High | Validation |
| TC-SR-010106 | รายการคลังต้นทางมีเฉพาะคลังชนิด inventory และ consignment | High | Functional |
| TC-SR-010107 | คลังต้นทางไม่โผล่ในรายการปลายทาง และเลือกทับกันแล้วปลายทางถูกล้าง | High | Validation |
| TC-SR-010108 | วันที่คาดว่าจะได้รับเลือกย้อนก่อนวันที่ขอไม่ได้ | Medium | Validation |
| TC-SR-010109 | ป้ายชนิดใบสลับ ISSUE/TRANSFER ทันทีตามชนิดคลังปลายทาง | High | Functional |
| TC-SR-010110 | ช่องคำอธิบายรับได้ไม่เกิน 256 ตัวอักษร | Low | Edge Case |
| TC-SR-020101 | ยังไม่ครบ workflow + คลังสองชั้น กด Add Item แล้วขึ้นกล่องบอกเหตุผล | High | Validation |
| TC-SR-020102 | คู่คลังที่ไม่มีสินค้าให้เบิก ขึ้นกล่องคนละใบกับกรณีกรอกไม่ครบ | High | Edge Case |
| TC-SR-020103 | ตารางรายการที่ยังว่างแสดง empty state ของตัวเอง | Low | Functional |
| TC-SR-020104 | Add Item แทรกแถวใหม่ไว้บนสุด ไม่ใช่ต่อท้าย | Medium | Functional |
| TC-SR-020105 | เลือกสินค้าแล้วหน่วยมาเอง และโฟกัสเด้งไปช่องจำนวนแถวเดียวกัน | High | Functional |
| TC-SR-020106 | เปลี่ยนคลังหรือ workflow ล้างสินค้าทุกแถว แต่แถวไม่หาย | High | Edge Case |
| TC-SR-020107 | ลบรายการต้องผ่านกล่องยืนยันที่อ้างชื่อสินค้าของแถวนั้น | Medium | Functional |
| TC-SR-020108 | บันทึกใบที่ไม่มีรายการเลย ขึ้นข้อความบังคับและเติมแถวเปล่าให้ | High | Validation |
| TC-SR-030101 | ยังไม่เลือกสินค้า กล่องข้อมูลสต๊อกบอกให้เลือกสินค้าก่อน | Medium | Edge Case |
| TC-SR-030102 | เลือกสินค้าแล้วกล่องข้อมูลสต๊อกแสดงสี่ค่าของคลังต้นทาง | High | Functional |
| TC-SR-030103 | กด On Hand / On Order เปิดกล่องรายละเอียดรายคลังและใบสั่งซื้อ | Medium | Functional |
| TC-SR-030104 | คอลัมน์ Total ของแถวมาจากต้นทุนจริง ไม่ค้างที่ศูนย์ | High | Functional |
| TC-SR-030105 | ต้นทุนที่ระบบเติมให้เองไม่ทำให้ฟอร์มกลายเป็นงานค้าง | Medium | Edge Case |
| TC-SR-040101 | บันทึกใบใหม่สำเร็จ เด้งเข้าหน้าใบในโหมดดูพร้อม toast | High | Happy Path |
| TC-SR-040102 | บันทึกไม่ผ่าน ขึ้น toast บอกจำนวนรายการที่ยังไม่ครบ และดึงกลับแท็บ Items | High | Validation |
| TC-SR-040103 | แก้ใบเดิมแล้วบันทึก กลับเป็นโหมดดูโดย URL ไม่เปลี่ยน | High | Happy Path |
| TC-SR-040104 | กด Cancel ขณะแก้ไขค้าง ขึ้นกล่องทิ้งงานแล้วคืนค่าเดิม | Medium | Alternate Flow |
| TC-SR-040105 | ไม่มี auto-save — ออกจากหน้าโดยยังไม่บันทึก ระบบถามก่อนทิ้ง | High | Functional |
| TC-SR-040106 | ลบใบจากโหมดแก้ไข กล่องยืนยันอ้างเลขที่ใบ แล้วกลับหน้ารายการ | Medium | Functional |
| TC-SR-050101 | ปุ่มส่งมีให้กดตั้งแต่ใบใหม่ที่ยังไม่เคยบันทึก | Medium | Functional |
| TC-SR-050102 | กดส่งทั้งที่กรอกไม่ครบ กล่องยืนยันไม่เปิด | High | Validation |
| TC-SR-050103 | กล่องยืนยันส่ง: หัวข้อ ข้อความอ้างเลขที่ใบ และปุ่มสองปุ่ม | High | Functional |
| TC-SR-050104 | ยืนยันส่งใบใหม่ ระบบบันทึกให้เองแล้วกลับหน้ารายการ | High | Happy Path |
| TC-SR-050105 | บทบาทผู้อนุมัติและผู้จ่ายไม่มีปุ่มส่ง | High | Authorization |
| TC-SR-060101 | แถบสรุปท้ายจอของใบใหม่มียอดรวมและปุ่มส่ง | Medium | Functional |
| TC-SR-060102 | ผู้อนุมัติที่ยังไม่ตัดสินแถวไหน ไม่มีปุ่มตัดสินให้กด | High | Functional |
| TC-SR-060103 | ตั้งแถวเดียวเป็นส่งกลับ แถบท้ายเหลือปุ่ม Send Back ปุ่มเดียว | High | Functional |
| TC-SR-060104 | เปิดแท็บ Stock Movement แถบสรุปเปลี่ยนเป็นยอดเข้า-ออก | Medium | Functional |
| TC-SR-070101 | กล่องยืนยันอนุมัติ: หัวข้อ ข้อความ ปุ่ม และไม่มีช่องเหตุผล | High | Functional |
| TC-SR-070102 | กล่องยืนยันอนุมัติไม่มีรายการขั้นตอนให้เลือก | Medium | Functional |
| TC-SR-070103 | ยืนยันอนุมัติสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ | High | Happy Path |
| TC-SR-080101 | ปุ่มตัดสินหมู่โผล่หลังติ๊กแถว เรียงอนุมัติ ปฏิเสธ ส่งกลับ | High | Functional |
| TC-SR-080102 | อนุมัติหมู่ไม่ถามอะไร เปลี่ยนสถานะแถวแล้วล้างการติ๊ก | High | Functional |
| TC-SR-080103 | ปฏิเสธหมู่เปิดกล่องที่มีช่องเหตุผลรายแถวและป้ายจำนวนรายการ | High | Functional |
| TC-SR-080104 | ปุ่มล้างสถานะในคอลัมน์ Status คืนแถวกลับเป็น Pending | Medium | Functional |
| TC-SR-080105 | แถวที่เซิร์ฟเวอร์ตัดสินไปแล้วไม่มีปุ่มล้างสถานะ | High | Authorization |
| TC-SR-080106 | ปุ่มประวัติรายบรรทัดโผล่เฉพาะแถวที่มีประวัติ | Medium | Functional |
| TC-SR-090101 | จำนวนที่ขอติดลบ ช่องขึ้นสถานะผิดและบันทึกไม่ผ่าน | High | Validation |
| TC-SR-090102 | ลบจำนวนจนช่องว่าง ค่ากลับเป็นศูนย์ ไม่ค้างสถานะผิด | Medium | Edge Case |
| TC-SR-090103 | ทุกคอลัมน์จำนวนแสดงหน่วยต่อท้ายในกล่องเดียวกับตัวเลข | Low | Functional |
| TC-SR-090104 | ผู้อนุมัติแก้จำนวนที่อนุมัติแล้วออกจากหน้า ระบบถามก่อนทิ้ง | Medium | Functional |
| TC-SR-100101 | กล่องส่งกลับบังคับเลือกขั้นตอนปลายทางก่อนจึงกดยืนยันได้ | High | Validation |
| TC-SR-100102 | ช่องเหตุผลมีเฉพาะแถวที่ตั้งเป็นส่งกลับ พร้อมป้ายนับจำนวน | Medium | Functional |
| TC-SR-100103 | เหตุผลเป็นตัวเลือก ไม่มีกติกาความยาวขั้นต่ำ | Medium | Functional |
| TC-SR-100104 | ปิดกล่องแล้วเปิดใหม่ เหตุผลและขั้นตอนที่เลือกถูกล้าง | Medium | Edge Case |
| TC-SR-100105 | ยืนยันส่งกลับสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ | High | Happy Path |
| TC-SR-110101 | ปุ่มปฏิเสธในแถบท้ายโผล่เฉพาะเมื่อทุกแถวที่ตัดสินเป็นปฏิเสธ | High | Functional |
| TC-SR-110102 | กล่องปฏิเสธจากแถบท้าย: หัวข้อ ข้อความ และปุ่มยืนยันสีแดง | Medium | Functional |
| TC-SR-110103 | ยืนยันปฏิเสธสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ | High | Happy Path |
| TC-SR-110104 | กดยกเลิกในกล่องปฏิเสธ สถานะแถวไม่เปลี่ยนและยังอยู่หน้าเดิม | Medium | Alternate Flow |
| TC-SR-120101 | กล่องยืนยันจ่ายของ: หัวข้อ ข้อความ ปุ่ม และไม่มีช่องเหตุผล | High | Functional |
| TC-SR-120102 | ใบที่ปิดจบแล้ว ทุกแถวไม่มีช่องติ๊กและไม่มีปุ่มตัดสิน | High | Authorization |

---

## TC-SR-010101 — ไม่มี workflow ที่เริ่มได้ หน้า /new ถูกบล็อกทั้งหน้า
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี SR workflow ที่ `can_create = true` สักตัวใน BU ที่ใช้งานอยู่ (สเปกเดิมใช้ `requestor@blueledgers.com` เป็นฝั่งไม่มีสิทธิ์) — `CreateWorkflowGate` ตัดสินจากผลของ `useCreatableWorkflows(WORKFLOW_TYPE.SR)`
**Steps**
1. เปิด URL `/store-operation/store-requisition/new` ตรง ๆ
2. รอให้ `FormSkeleton` หายไป
**Expected**
หน้าแสดงกล่องปฏิเสธสิทธิ์ (`[role="alert"]`) ที่มีคำว่า `Restricted`, หัวข้อ `Permission Denied`, คำอธิบาย `"None of the approval flows let you start a store requisition."` และบรรทัด `"Contact your administrator to request access."` พร้อมปุ่ม `Go Back` — และ **ไม่มี** ช่อง `Workflow` / `Request From` / `Deliver To (Destination)` หรือปุ่ม `Add Item` ให้เห็นเลย

---

## TC-SR-010102 — ใบใหม่ตั้งวันที่ขอเป็นวันนี้ และวันที่คาดว่าจะได้รับเป็นพรุ่งนี้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, BU = `BLAVG`) ที่มี SR workflow ที่เริ่มได้อย่างน้อยหนึ่งตัว
**Steps**
1. เปิด `/store-operation/store-requisition/new`
2. อ่านวันที่บนแถบหัวใบ (ไอคอนปฏิทินท้ายบรรทัดผู้ขอ/แผนก)
3. อ่านค่าที่อยู่ในช่อง `Expected Delivery`
**Expected**
วันที่บนแถบหัวใบเท่ากับวันปัจจุบันของเครื่องที่รันเทส และค่าในช่อง `Expected Delivery` เท่ากับวันถัดไปอีกหนึ่งวัน (ทั้งสองค่าจัดรูปตาม `dateFormat` ของโปรไฟล์) — ค่าทั้งคู่ต้องมาเองโดยไม่ต้องแตะอะไร

---

## TC-SR-010103 — แถบหัวใบของใบใหม่: ชื่อโมดูล ป้าย New ผู้ขอและแผนกจากโปรไฟล์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`) ที่โปรไฟล์มีแผนกผูกอยู่
**Steps**
1. เปิด `/store-operation/store-requisition/new`
2. อ่านแถบหัวเอกสารทั้งแถบ
**Expected**
หัวเรื่องคือ `Store Requisition` (ยังไม่มีเลขที่ใบ) มีป้าย `New` อยู่ในกลุ่มป้ายด้านขวาของหัวเรื่อง และบรรทัดใต้หัวเรื่องแสดงชื่อ-นามสกุลของผู้ล็อกอินกับชื่อแผนกในรูป `ชื่อแผนก (รหัส)` — **ไม่มี** ป้ายสถานะเอกสารและ **ไม่มี** บรรทัด `Edition` เพราะใบยังไม่ถูกบันทึก

---

## TC-SR-010104 — บล็อก Request details มีห้าช่อง และสี่ช่องแรกติดดาวบังคับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ในบทบาท Admin
**Steps**
1. อ่านป้ายกำกับของทุกช่องในบล็อกด้านบนของฟอร์ม
**Expected**
เห็นช่องครบห้าช่องตามลำดับ `Workflow`, `Expected Delivery`, `Request From`, `Deliver To (Destination)`, `Description` โดยสี่ป้ายแรกมีเครื่องหมายบังคับ (`*`) ส่วน `Description` ไม่มี — และ **ไม่มี** ช่อง `Request Date`, `Requested By` หรือ `Department` ให้กรอกในบล็อกนี้ (สามค่านั้นเป็นข้อความบนแถบหัวใบ ไม่ใช่ช่องกรอก)

---

## TC-SR-010105 — ช่องคลังปลายทางถูกปิดจนกว่าจะเลือกคลังต้นทาง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` และยังไม่ได้แตะช่องใดเลย
**Steps**
1. สังเกตปุ่มเปิดรายการของช่อง `Deliver To (Destination)`
2. เลือกคลังหนึ่งแห่งในช่อง `Request From`
3. สังเกตปุ่มเปิดรายการของช่อง `Deliver To (Destination)` อีกครั้ง
**Expected**
ในขั้นที่ 1 ปุ่มของ `Deliver To (Destination)` อยู่ในสถานะ disabled (กดแล้วไม่มีรายการเปิดขึ้น) และในขั้นที่ 3 ปุ่มเดียวกันกดได้และเปิดรายการคลังขึ้นมา

---

## TC-SR-010106 — รายการคลังต้นทางมีเฉพาะคลังชนิด inventory และ consignment
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; BU `BLAVG` มีคลังอย่างน้อยหนึ่งแห่งที่ชนิดเป็น `direct`
**Steps**
1. เปิดรายการของช่อง `Request From`
2. อ่านป้ายชนิดคลังของทุกตัวเลือกที่แสดงอยู่
3. เปิดรายการของช่อง `Deliver To (Destination)` (หลังเลือกต้นทางแล้ว) แล้วอ่านป้ายชนิดคลังเช่นกัน
**Expected**
รายการของ `Request From` มีแต่ตัวเลือกที่ป้ายชนิดเป็น Inventory หรือ Consignment เท่านั้น — ไม่มีตัวเลือกชนิด Direct โผล่เลยสักตัว ขณะที่รายการของ `Deliver To (Destination)` ไม่ถูกจำกัดชนิดและมีตัวเลือกชนิด Direct รวมอยู่ด้วย

---

## TC-SR-010107 — คลังต้นทางไม่โผล่ในรายการปลายทาง และเลือกทับกันแล้วปลายทางถูกล้าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; ผู้ใช้เข้าถึงคลังชนิด inventory ได้อย่างน้อยสองแห่ง (เรียกว่า A และ B)
**Steps**
1. เลือก `Request From` = คลัง A
2. เปิดรายการ `Deliver To (Destination)` แล้วมองหาคลัง A
3. เลือก `Deliver To (Destination)` = คลัง B
4. กลับไปเปลี่ยน `Request From` เป็นคลัง B (ตัวเดียวกับปลายทางที่เลือกไว้)
5. อ่านค่าที่อยู่ในช่อง `Deliver To (Destination)`
**Expected**
ในขั้นที่ 2 คลัง A **ไม่อยู่** ในรายการปลายทาง และในขั้นที่ 5 ช่อง `Deliver To (Destination)` ถูกล้างกลับเป็นสถานะยังไม่ได้เลือก (ป้ายบนปุ่มกลับไปเป็นข้อความชวนให้เลือก ไม่ใช่ชื่อคลัง B)

---

## TC-SR-010108 — วันที่คาดว่าจะได้รับเลือกย้อนก่อนวันที่ขอไม่ได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; วันที่ขอเป็นวันปัจจุบันตามค่าตั้งต้น
**Steps**
1. เปิดปฏิทินของช่อง `Expected Delivery`
2. พยายามเลือกวันที่ก่อนวันปัจจุบันหนึ่งวัน
**Expected**
ช่องวันของเมื่อวานในปฏิทินอยู่ในสถานะ disabled กดไม่ติด และค่าที่อยู่ในช่องยังคงเป็นวันพรุ่งนี้เหมือนเดิมหลังปิดปฏิทิน (กติกาเดียวกันมีสำรองไว้ที่ฝั่ง schema ด้วยข้อความ `"Expected date must not be before SR date"` ซึ่งจะโผล่ก็ต่อเมื่อค่าหลุดผ่านตัวปฏิทินมาได้)

---

## TC-SR-010109 — ป้ายชนิดใบสลับ ISSUE/TRANSFER ทันทีตามชนิดคลังปลายทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; BU `BLAVG` มีคลังชนิด `direct` อย่างน้อยหนึ่งแห่งและคลังชนิด `inventory` ที่ไม่ใช่ต้นทางอีกอย่างน้อยหนึ่งแห่ง
**Steps**
1. เลือก `Request From` เป็นคลังชนิด inventory
2. สังเกตกลุ่มป้ายบนแถบหัวใบตอนที่ยังไม่ได้เลือกปลายทาง
3. เลือก `Deliver To (Destination)` เป็นคลังชนิด **direct** แล้วอ่านกลุ่มป้ายอีกครั้ง
4. เปลี่ยน `Deliver To (Destination)` เป็นคลังชนิด **inventory** แล้วอ่านกลุ่มป้ายอีกครั้ง
**Expected**
ขั้นที่ 2 ยังไม่มีป้ายชนิดใบ · ขั้นที่ 3 ป้ายชนิดใบอ่านว่า `ISSUE` · ขั้นที่ 4 ป้ายเดียวกันเปลี่ยนเป็น `TRANSFER` — การเปลี่ยนเกิดขึ้นทันทีที่เลือกปลายทางโดยไม่ต้องบันทึกใบ และไม่มีช่องให้ผู้ใช้เลือกชนิดใบเองที่ไหนในฟอร์ม

---

## TC-SR-010110 — ช่องคำอธิบายรับได้ไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`
**Steps**
1. พิมพ์ข้อความยาว 300 ตัวอักษรลงในช่อง `Description`
2. อ่านค่าที่ค้างอยู่ในช่อง
**Expected**
ค่าที่อยู่ในช่องยาว 256 ตัวอักษรพอดี (ตัวที่เกินถูกตัดทิ้งตั้งแต่ตอนพิมพ์ ไม่ใช่ตอนบันทึก) และไม่มีข้อความ error ใด ๆ โผล่ขึ้นมา — ช่องนี้เป็น `<input>` บรรทัดเดียว ไม่ใช่ `<textarea>`

---

## TC-SR-020101 — ยังไม่ครบ workflow + คลังสองชั้น กด Add Item แล้วขึ้นกล่องบอกเหตุผล
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` โดยยังไม่ได้เลือก `Workflow` / `Request From` / `Deliver To (Destination)` ครบทั้งสามช่อง
**Steps**
1. กดปุ่ม `Add Item` ที่มุมขวาเหนือตารางรายการ
**Expected**
ขึ้นกล่องเตือนหัวข้อ `"Can't add items yet"` พร้อมคำอธิบาย `"Fill in the workflow, the store you are requesting from, and the destination store first — those three decide which products you can request."` และปุ่มเดียวคือ `Close` — ตารางรายการยังว่างเท่าเดิม ไม่มีแถวใหม่ถูกเพิ่ม

---

## TC-SR-020102 — คู่คลังที่ไม่มีสินค้าให้เบิก ขึ้นกล่องคนละใบกับกรณีกรอกไม่ครบ
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; เลือก `Workflow` + `Request From` + `Deliver To (Destination)` ครบแล้ว โดยเลือกคู่คลังที่ workflow นี้ไม่มีสินค้าอนุญาตให้ส่งถึงกันเลย
**Steps**
1. รอให้รายการสินค้าของคู่คลังโหลดเสร็จ
2. กดปุ่ม `Add Item`
**Expected**
ขึ้นกล่องเตือนหัวข้อ `"Nothing available to request"` พร้อมคำอธิบายที่ขึ้นต้นว่า `"The store you are requesting from has no products this workflow allows you to send to the destination store."` — ต้อง **ไม่ใช่** กล่อง `"Can't add items yet"` ซึ่งสงวนไว้สำหรับกรณีที่ยังเลือกไม่ครบสามช่อง และยังไม่มีแถวใหม่ถูกเพิ่มลงตาราง

---

## TC-SR-020103 — ตารางรายการที่ยังว่างแสดง empty state ของตัวเอง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` แท็บ `Items` และยังไม่มีรายการสินค้า
**Steps**
1. อ่านพื้นที่ตารางรายการ
**Expected**
ตารางแสดงหัวข้อ `"No Items Yet"` พร้อมคำอธิบาย `"Add items to this store requisition."` และไอคอนกล่อง — ต้องไม่มีแถวข้อมูลปลอมมานับรวม (แถวเดียวที่เห็นคือแถวข้อความ empty state ไม่ใช่แถวสินค้า)

---

## TC-SR-020104 — Add Item แทรกแถวใหม่ไว้บนสุด ไม่ใช่ต่อท้าย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new`; เลือก workflow และคลังครบสามช่องแล้ว และคู่คลังนี้มีสินค้าให้เบิกอย่างน้อยสองรายการ
**Steps**
1. กด `Add Item` แล้วเลือกสินค้าชิ้นแรกลงแถวที่ได้
2. กด `Add Item` อีกครั้ง
3. อ่านลำดับ `#` และชื่อสินค้าของทั้งสองแถว
**Expected**
แถวเปล่าที่เพิ่งเพิ่มอยู่ที่ตำแหน่ง `#1` และสินค้าที่เลือกไว้ในขั้นที่ 1 ถูกดันลงไปเป็น `#2` — ตารางมีสองแถวพอดี

---

## TC-SR-020105 — เลือกสินค้าแล้วหน่วยมาเอง และโฟกัสเด้งไปช่องจำนวนแถวเดียวกัน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` มีแถวเปล่าหนึ่งแถว และคู่คลัง+workflow ที่เลือกมีสินค้าให้เบิก
**Steps**
1. เปิดช่องเลือกสินค้าของแถวที่ 1 แล้วเลือกสินค้าหนึ่งรายการ
2. สังเกต element ที่ได้โฟกัสหลังจากเลือก
3. อ่านส่วนท้ายของช่องจำนวนในคอลัมน์ `Requested`
**Expected**
โฟกัสย้ายไปอยู่ที่ช่องจำนวนของคอลัมน์ `Requested` ในแถวเดียวกันทันที (พิมพ์ตัวเลขต่อได้เลยโดยไม่ต้องคลิก) และท้ายช่องจำนวนนั้นมีชื่อหน่วยนับของสินค้าที่เพิ่งเลือกแสดงอยู่ — หน่วยมาจากสินค้า ไม่ได้ให้ผู้ใช้เลือกเอง

---

## TC-SR-020106 — เปลี่ยนคลังหรือ workflow ล้างสินค้าทุกแถว แต่แถวไม่หาย
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ที่เลือก workflow + คลังครบและกรอกสินค้ากับจำนวนไว้แล้วสองแถว; มีคลังปลายทางตัวอื่นให้สลับไปได้
**Steps**
1. จดชื่อสินค้าและจำนวนของทั้งสองแถวไว้
2. เปลี่ยน `Deliver To (Destination)` เป็นคลังอีกแห่ง
3. อ่านตารางรายการอีกครั้ง
**Expected**
ตารางยังมีสองแถวเท่าเดิม แต่ช่องสินค้าของทั้งสองแถวกลับเป็นสถานะยังไม่ได้เลือก (ไม่มีชื่อสินค้าและไม่มีหน่วยต่อท้ายช่องจำนวนแล้ว) ขณะที่ตัวเลขจำนวนที่กรอกไว้ยังอยู่ — การล้างเกิดขึ้นเพราะเกณฑ์คัดสินค้าเปลี่ยน ไม่ใช่เพราะแถวถูกลบ

---

## TC-SR-020107 — ลบรายการต้องผ่านกล่องยืนยันที่อ้างชื่อสินค้าของแถวนั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์มใบเบิกในโหมดที่แก้ไขได้ และมีรายการสินค้าที่เลือกชื่อไว้แล้วอย่างน้อยหนึ่งแถว
**Steps**
1. กดปุ่มถังขยะ (`aria-label = Delete`) ที่ท้ายแถวนั้น
2. อ่านข้อความในกล่องที่เปิดขึ้น
3. กดยืนยันการลบ
**Expected**
กล่องที่เปิดขึ้นมีหัวข้อ `"Remove Item"` และคำอธิบายในรูป `Are you sure you want to remove "<ชื่อสินค้าของแถวนั้น>"?` (แถวที่ยังไม่ได้เลือกสินค้าจะขึ้นเป็น `Item #<ลำดับ>` แทน) — หลังยืนยันแล้วจำนวนแถวในตารางลดลงหนึ่งแถวและแถวนั้นหายไป

---

## TC-SR-020108 — บันทึกใบที่ไม่มีรายการเลย ขึ้นข้อความบังคับและเติมแถวเปล่าให้
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ที่กรอกหัวใบครบแล้ว (workflow + คลังต้นทาง + คลังปลายทาง + วันที่) แต่ยังไม่มีรายการสินค้าสักแถว
**Steps**
1. กดปุ่ม `Save` บนแถบหัวใบ
2. อ่านข้อความเหนือตารางรายการ
3. นับจำนวนแถวในตาราง
**Expected**
เหนือตารางมีข้อความ `role="alert"` ว่า `"At least one Items is required"` และระบบเติมแถวเปล่าให้หนึ่งแถวโดยอัตโนมัติเพื่อชี้ว่าต้องกรอกอะไรต่อ — URL ยังเป็น `/store-operation/store-requisition/new` (ไม่มีใบถูกสร้าง)

---

## TC-SR-030101 — ยังไม่เลือกสินค้า กล่องข้อมูลสต๊อกบอกให้เลือกสินค้าก่อน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ฟอร์มใบเบิกโหมดแก้ไข และมีแถวเปล่าที่ยังไม่ได้เลือกสินค้าอยู่หนึ่งแถว
**Steps**
1. กดปุ่มไอคอนกล่อง (`aria-label = Inventory Information`) ท้ายเซลล์สินค้าของแถวนั้น
2. อ่านเนื้อหาในกล่องที่เปิดขึ้น
**Expected**
กล่องหัวข้อ `Inventory Information` เปิดขึ้นและมีเพียงบรรทัดเดียวคือ `"Select a product to view inventory"` — ไม่มีตัวเลข `On Hand` / `On Order` / `Re-order` / `Re-stock` และไม่มีป้าย `Avg Cost` ให้เห็น

---

## TC-SR-030102 — เลือกสินค้าแล้วกล่องข้อมูลสต๊อกแสดงสี่ค่าของคลังต้นทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์มใบเบิกโหมดแก้ไข มีแถวที่เลือกสินค้าไว้แล้ว และหัวใบเลือกคลังต้นทางไว้แล้ว
**Steps**
1. กดปุ่มไอคอนกล่อง (`aria-label = Inventory Information`) ของแถวนั้น
2. อ่านค่าทั้งหมดในกล่อง
**Expected**
กล่องหัวข้อ `Inventory Information` แสดงป้าย `Avg Cost` พร้อมจำนวนเงินที่มุมขวาของหัวข้อ และมีสี่ค่าครบคือ `On Hand`, `On Order`, `Re-order`, `Re-stock` โดยแต่ละค่ามีชื่อหน่วยของสินค้าต่อท้ายตัวเลข — ค่าเหล่านี้อ้างอิงคลังต้นทางของทั้งใบ ไม่ใช่คลังรายแถว (ตารางนี้ไม่มีคอลัมน์คลังรายแถว)

---

## TC-SR-030103 — กด On Hand / On Order เปิดกล่องรายละเอียดรายคลังและใบสั่งซื้อ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดกล่อง `Inventory Information` ของแถวที่เลือกสินค้าไว้แล้ว (ต่อจาก TC-SR-030102)
**Steps**
1. กดที่ป้าย `On Hand` (ซึ่งเป็นปุ่มขีดเส้นใต้เมื่อมีสินค้า)
2. ปิดกล่องที่เปิดขึ้น แล้วกดที่ป้าย `On Order`
**Expected**
ขั้นที่ 1 เปิดกล่องใหม่หัวข้อ `On Hand` · ขั้นที่ 2 เปิดกล่องใหม่หัวข้อ `On Order` — ทั้งสองป้ายต้องเป็นปุ่มที่กดได้จริง (ในแถวที่ยังไม่ได้เลือกสินค้า ป้ายเดียวกันจะเป็นข้อความเฉย ๆ กดไม่ได้)

---

## TC-SR-030104 — คอลัมน์ Total ของแถวมาจากต้นทุนจริง ไม่ค้างที่ศูนย์
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ฟอร์มใบเบิกโหมดแก้ไข เลือกคลังต้นทางแล้ว และมีแถวที่เลือกสินค้าที่มีล็อตอยู่ในคลังต้นทางนั้น
**Steps**
1. กรอกจำนวนในคอลัมน์ `Requested` ของแถวนั้นเป็น `1`
2. รอให้คำขอต้นทุนตอบกลับ แล้วอ่านค่าในคอลัมน์ `Total` ของแถว
3. เปลี่ยนจำนวนเป็น `2` แล้วรออีกครั้ง
**Expected**
หลังขั้นที่ 2 คอลัมน์ `Total` ของแถวแสดงจำนวนเงินที่ไม่ใช่ `0.00` และหลังขั้นที่ 3 ค่านั้นเปลี่ยนไป (ต้นทุนผูกกับจำนวนที่ขอและคลังต้นทาง ระบบคิดจากฝั่ง backend ไม่ใช่คูณในหน้าจอ) — ยอดรวมในแถบสรุปท้ายจอขยับตามไปด้วยในค่าเดียวกัน

---

## TC-SR-030105 — ต้นทุนที่ระบบเติมให้เองไม่ทำให้ฟอร์มกลายเป็นงานค้าง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิดใบเบิกที่บันทึกไว้แล้วที่ `/store-operation/store-requisition/:id` ในโหมดดู แล้วกด `Edit` เข้าโหมดแก้ไข โดย **ไม่แตะช่องใดเลย**
**Steps**
1. รอให้คอลัมน์ `Total` ของทุกแถวมีตัวเลขขึ้นครบ (ต้นทุนไหลเข้ามาเอง)
2. กดปุ่มย้อนกลับบนแถบหัวใบ
**Expected**
ระบบพากลับไปหน้ารายการ `/store-operation/store-requisition` ทันทีโดย **ไม่** เด้งกล่อง `"Discard changes?"` — ค่าต้นทุนที่ระบบเขียนกลับเข้าฟอร์มต้องไม่ถูกนับเป็นการแก้ไขของผู้ใช้

---

## TC-SR-040101 — บันทึกใบใหม่สำเร็จ เด้งเข้าหน้าใบในโหมดดูพร้อม toast
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ในบทบาท Admin; กรอก workflow + คลังต้นทาง + คลังปลายทาง + รายการสินค้าหนึ่งแถวพร้อมจำนวนเรียบร้อย
**Steps**
1. กดปุ่ม `Save` บนแถบหัวใบ
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast `"Store Requisition created successfully"` · URL เปลี่ยนจาก `/new` ไปเป็น `/store-operation/store-requisition/<uuid>` · แถบหัวใบแสดงเลขที่ใบแทนคำว่า `Store Requisition` พร้อมป้ายสถานะ `Draft` และบรรทัด `Edition` · ปุ่มบนแถบหัวกลายเป็น `Edit` (โหมดดู) ไม่ใช่ `Save`/`Cancel` แล้ว

---

## TC-SR-040102 — บันทึกไม่ผ่าน ขึ้น toast บอกจำนวนรายการที่ยังไม่ครบ และดึงกลับแท็บ Items
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ที่กรอกหัวใบครบแล้ว และกด `Add Item` เพิ่มแถวเปล่าไว้หนึ่งแถวโดย **ยังไม่เลือกสินค้า**
**Steps**
1. สลับไปแท็บ `Stock Movement`
2. กดปุ่ม `Save` บนแถบหัวใบ
3. อ่าน toast และดูว่าแท็บไหนถูกเปิดอยู่
**Expected**
ขึ้น toast เตือนข้อความ `"1 item is still incomplete — jumped to the first field to fix."` และหน้าจอสลับกลับมาที่แท็บ `Items` เอง (ไม่ค้างอยู่แท็บ Stock Movement ที่ไม่มีช่องให้แก้) พร้อมกับช่องเลือกสินค้าของแถวที่ยังว่างขึ้นสถานะผิดพลาด — URL ยังเป็น `/new`

---

## TC-SR-040103 — แก้ใบเดิมแล้วบันทึก กลับเป็นโหมดดูโดย URL ไม่เปลี่ยน
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิดใบเบิกสถานะ `Draft` ที่ตัวเองสร้างไว้ที่ `/store-operation/store-requisition/:id` และบทบาทในใบเป็น `create`
**Steps**
1. กดปุ่ม `Edit` บนแถบหัวใบ
2. แก้ข้อความในช่อง `Description`
3. กดปุ่ม `Save`
**Expected**
ขึ้น toast `"Store Requisition updated successfully"` · URL ยังเป็น `/store-operation/store-requisition/<uuid>` ตัวเดิม (ไม่เด้งกลับหน้ารายการ) · ปุ่มบนแถบหัวกลับไปเป็น `Edit` และช่อง `Description` กลับเป็นสถานะอ่านอย่างเดียวที่มีข้อความใหม่อยู่

---

## TC-SR-040104 — กด Cancel ขณะแก้ไขค้าง ขึ้นกล่องทิ้งงานแล้วคืนค่าเดิม
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดใบเบิกที่แก้ไขได้ กด `Edit` เข้าโหมดแก้ไข และแก้ข้อความในช่อง `Description` ให้ต่างจากเดิม
**Steps**
1. กดปุ่ม `Cancel` บนแถบหัวใบ
2. อ่านกล่องที่เปิดขึ้น แล้วกดปุ่มยืนยันทิ้งงาน
3. อ่านค่าในช่อง `Description` และปุ่มบนแถบหัว
**Expected**
กล่องที่เปิดขึ้นมีหัวข้อ `"Discard changes?"` คำอธิบาย `"You have unsaved changes that will be lost."` และปุ่มสองปุ่มคือ `Keep editing` กับ `Discard` — หลังกด `Discard` ช่อง `Description` กลับไปเป็นข้อความเดิมก่อนแก้ และแถบหัวกลับเป็นโหมดดู (มีปุ่ม `Edit`) โดย URL ไม่เปลี่ยน

---

## TC-SR-040105 — ไม่มี auto-save — ออกจากหน้าโดยยังไม่บันทึก ระบบถามก่อนทิ้ง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` และกรอกช่อง `Description` ไว้แล้ว (ฟอร์มมีงานค้าง) โดยยังไม่กด `Save`
**Steps**
1. รอ 70 วินาทีโดยไม่แตะอะไร
2. กดปุ่มย้อนกลับบนแถบหัวใบ
3. อ่านกล่องที่เปิดขึ้น แล้วกด `Keep editing`
4. ตรวจว่ายังอยู่หน้าเดิมและข้อความที่กรอกไว้ยังอยู่
**Expected**
ขั้นที่ 1 ไม่มีตัวบ่งชี้การบันทึกอัตโนมัติใด ๆ โผล่ขึ้นมา และ URL ยังเป็น `/new` (ไม่มีใบถูกสร้างเงียบ ๆ) · ขั้นที่ 2 ขึ้นกล่อง `"Discard changes?"` · หลังกด `Keep editing` ยังอยู่ที่ `/store-operation/store-requisition/new` และข้อความใน `Description` ยังครบเหมือนเดิม

---

## TC-SR-040106 — ลบใบจากโหมดแก้ไข กล่องยืนยันอ้างเลขที่ใบ แล้วกลับหน้ารายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกสถานะ `Draft` ที่ลบได้ ที่ `/store-operation/store-requisition/:id` และจดเลขที่ใบไว้
**Steps**
1. กด `Edit` เข้าโหมดแก้ไข
2. กดปุ่ม `Delete` บนแถบหัวใบ
3. อ่านข้อความในกล่องที่เปิดขึ้น แล้วกดยืนยัน
**Expected**
ปุ่ม `Delete` ปรากฏเฉพาะในโหมดแก้ไขของใบที่บันทึกแล้ว (ใบใหม่ที่ยังไม่บันทึกไม่มีปุ่มนี้) · กล่องมีหัวข้อ `"Delete Store Requisition"` และคำอธิบาย `Are you sure you want to delete "<เลขที่ใบ>"? This action cannot be undone.` · หลังยืนยันขึ้น toast `"Store Requisition deleted successfully"` และ URL กลับไปเป็น `/store-operation/store-requisition`

---

## TC-SR-050101 — ปุ่มส่งมีให้กดตั้งแต่ใบใหม่ที่ยังไม่เคยบันทึก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/store-operation/store-requisition/new` ในบทบาทที่มี SR workflow ที่เริ่มได้
**Steps**
1. อ่านแถบสรุปท้ายจอทันทีที่ฟอร์มขึ้น (ยังไม่กรอกอะไร)
**Expected**
แถบท้ายจอมีปุ่ม `Submit` ที่กดได้ (ไม่ disabled) อยู่แล้วตั้งแต่ก่อนกรอก — ไม่มีปุ่มชื่อ `Save as Draft`, `Save and Close` หรือ `Submit for Approval` อยู่ที่ไหนในหน้านี้

---

## TC-SR-050102 — กดส่งทั้งที่กรอกไม่ครบ กล่องยืนยันไม่เปิด
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ที่ยังไม่ได้เลือก workflow และคลังใด ๆ
**Steps**
1. กดปุ่ม `Submit` ในแถบท้ายจอ
2. ตรวจว่ามี `[role="alertdialog"]` ที่มองเห็นได้หรือไม่
**Expected**
ไม่มีกล่องยืนยันเปิดขึ้นเลย และขึ้น toast เตือนข้อความ `"Some details are missing — jumped to the field to fix."` แทน (ถ้ามีรายการที่กรอกไม่ครบด้วยจะเป็นข้อความนับจำนวนรายการแทน) — หน้าจอเลื่อนไปที่ช่องแรกที่ยังไม่ครบและช่องนั้นขึ้นสถานะผิดพลาด

---

## TC-SR-050103 — กล่องยืนยันส่ง: หัวข้อ ข้อความอ้างเลขที่ใบ และปุ่มสองปุ่ม
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกสถานะ `Draft` ที่บันทึกแล้ว มีรายการสินค้าครบ และบทบาทในใบเป็น `create`
**Steps**
1. กดปุ่ม `Submit` ในแถบท้ายจอ
2. อ่านเนื้อหาในกล่องที่เปิดขึ้น
**Expected**
เปิดกล่อง `role="alertdialog"` หัวข้อ `"Submit Store Requisition"` คำอธิบาย `This will submit <เลขที่ใบ> for approval. Are you sure?` โดยเลขที่ใบเป็นตัวหนา และมีปุ่มสองปุ่มคือ `Cancel` กับ `Submit` — กล่องนี้ **ไม่มี** ช่องกรอกเหตุผลและไม่มีรายการขั้นตอนให้เลือก · (ในใบใหม่ที่ยังไม่เคยบันทึก ข้อความเดียวกันจะแสดงขีด `—` แทนเลขที่ใบ)

---

## TC-SR-050104 — ยืนยันส่งใบใหม่ ระบบบันทึกให้เองแล้วกลับหน้ารายการ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/store-operation/store-requisition/new` ที่กรอกครบทั้งหัวใบและรายการสินค้าหนึ่งแถว โดย **ยังไม่เคยกด `Save`**
**Steps**
1. กดปุ่ม `Submit` ในแถบท้ายจอ
2. กดปุ่ม `Submit` ในกล่องยืนยัน
3. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast `"Store requisition submitted"` และ URL กลับไปเป็น `/store-operation/store-requisition` — ผู้ใช้ไม่ต้องกด `Save` ก่อน ระบบสร้างใบแล้วส่งให้ในคราวเดียว · ใบที่เพิ่งส่งปรากฏในตารางหน้ารายการด้วยสถานะ `In Progress` ไม่ใช่ `Draft`

---

## TC-SR-050105 — บทบาทผู้อนุมัติและผู้จ่ายไม่มีปุ่มส่ง
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่ backend ตอบ `role` เป็น `approve` (หรือ `issue`) — สเปกเดิมใช้ `purchase@blueledgers.com` เป็นฝั่งอนุมัติ/คลัง
**Steps**
1. อ่านชุดปุ่มในแถบสรุปท้ายจอ
**Expected**
ไม่มีปุ่ม `Submit` ให้เห็นเลย — ปุ่มที่เป็นไปได้ในแถบท้ายของบทบาทนี้มีเฉพาะ `Approve` / `Reject` / `Send Back` / `Issue` และจะโผล่ก็ต่อเมื่อมีการตัดสินรายแถวไว้แล้วเท่านั้น

---

## TC-SR-060101 — แถบสรุปท้ายจอของใบใหม่มียอดรวมและปุ่มส่ง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/store-operation/store-requisition/new` ในบทบาทที่สร้างใบได้
**Steps**
1. อ่านแถบสรุปท้ายจอทั้งแถบ
**Expected**
แถบท้ายจอแสดงป้าย `Grand Total` พร้อมจำนวนเงิน (เป็นศูนย์เมื่อยังไม่มีรายการ) และปุ่ม `Submit` ที่ฝั่งขวา — ไม่มีป้าย `In` / `Out` / `Value in` / `Value out` ซึ่งเป็นของแท็บ Stock Movement เท่านั้น

---

## TC-SR-060102 — ผู้อนุมัติที่ยังไม่ตัดสินแถวไหน ไม่มีปุ่มตัดสินให้กด
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ทุกแถวยังอยู่สถานะ `Pending` และยังไม่ได้ติ๊กหรือตัดสินอะไร
**Steps**
1. อ่านชุดปุ่มในแถบสรุปท้ายจอ
**Expected**
แถบท้ายจอแสดงเฉพาะยอดรวม `Grand Total` โดย **ไม่มี** ปุ่ม `Approve`, `Reject`, `Send Back`, `Issue` หรือ `Submit` สักปุ่ม — ปุ่มตัดสินผูกกับสถานะรายแถว ไม่ใช่สถานะของใบ

---

## TC-SR-060103 — ตั้งแถวเดียวเป็นส่งกลับ แถบท้ายเหลือปุ่ม Send Back ปุ่มเดียว
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข มีรายการอย่างน้อยสามแถวที่ยังตัดสินได้
**Steps**
1. ติ๊กสองแถวแล้วกดปุ่ม `Approve` ในแถวปุ่มเหนือตาราง
2. อ่านชุดปุ่มในแถบท้ายจอ
3. ติ๊กแถวที่สามแล้วกดปุ่ม `Send Back`
4. อ่านชุดปุ่มในแถบท้ายจออีกครั้ง
**Expected**
ขั้นที่ 2 แถบท้ายมีปุ่ม `Approve` · ขั้นที่ 4 ปุ่ม `Approve` หายไปและเหลือปุ่ม `Send Back` เพียงปุ่มเดียว — การมีแถวสถานะส่งกลับแม้แถวเดียวชนะสถานะอื่นทั้งใบ

---

## TC-SR-060104 — เปิดแท็บ Stock Movement แถบสรุปเปลี่ยนเป็นยอดเข้า-ออก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่สถานะเป็น `Completed` (แท็บ Stock Movement ใช้งานได้เฉพาะใบที่ปิดจบแล้ว)
**Steps**
1. อ่านแถบสรุปท้ายจอขณะอยู่แท็บ `Items`
2. สลับไปแท็บ `Stock Movement` แล้วรอให้ข้อมูลโหลด
3. อ่านแถบสรุปท้ายจออีกครั้ง
**Expected**
ขั้นที่ 1 แถบท้ายมีป้ายเดียวคือ `Grand Total` · ขั้นที่ 3 ป้าย `Grand Total` หายไปและถูกแทนด้วยสี่ป้ายคือ `In`, `Out`, `Value in`, `Value out` — สองแท็บนี้สรุปคนละหน่วยและคนละความหมาย ไม่ใช่ตัวเลขชุดเดียวกัน

---

## TC-SR-070101 — กล่องยืนยันอนุมัติ: หัวข้อ ข้อความ ปุ่ม และไม่มีช่องเหตุผล
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` และตั้งอย่างน้อยหนึ่งแถวเป็น `Approve` จนปุ่ม `Approve` โผล่ในแถบท้ายจอ
**Steps**
1. กดปุ่ม `Approve` ในแถบท้ายจอ
2. อ่านเนื้อหาทั้งหมดในกล่องที่เปิดขึ้น
**Expected**
เปิดกล่อง `role="alertdialog"` หัวข้อ `"Approve Store Requisition"` คำอธิบายขึ้นต้นด้วยเลขที่ใบตัวหนาตามด้วย `— Confirm approval of selected items?` และมีปุ่มสองปุ่มคือ `Cancel` กับ `Approve` — ภายในกล่อง **ไม่มี** `<textarea>` หรือ `<input>` ให้กรอกเหตุผลเลยสักช่อง

---

## TC-SR-070102 — กล่องยืนยันอนุมัติไม่มีรายการขั้นตอนให้เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดกล่องยืนยันอนุมัติอยู่ (ต่อจาก TC-SR-070101)
**Steps**
1. มองหาหัวข้อย่อย `Stage` และกลุ่มตัวเลือกแบบ radio ในกล่อง
2. ตรวจสถานะของปุ่มยืนยัน
**Expected**
ในกล่องไม่มีหัวข้อ `Stage` และไม่มี `[role="radiogroup"]` เลย และปุ่ม `Approve` กดได้ทันที (ไม่ disabled) — ต่างจากกล่อง `Send Back` ที่บังคับให้เลือกขั้นตอนปลายทางก่อน

---

## TC-SR-070103 — ยืนยันอนุมัติสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิดกล่องยืนยันอนุมัติอยู่ โดยใบนั้นอยู่ในขั้นตอนที่ผู้ใช้เป็นผู้อนุมัติจริง
**Steps**
1. กดปุ่ม `Approve` ในกล่อง
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast `"Store requisition approved"` และ URL กลับไปเป็น `/store-operation/store-requisition` — ต้องไม่มีกล่อง `"Discard changes?"` แทรกขึ้นมาระหว่างทาง แม้ผู้ใช้จะเพิ่งติ๊กและตัดสินรายแถวไปก่อนหน้า

---

## TC-SR-080101 — ปุ่มตัดสินหมู่โผล่หลังติ๊กแถว เรียงอนุมัติ ปฏิเสธ ส่งกลับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` (หรือ `issue`) ในโหมดแก้ไข มีรายการที่ยังตัดสินได้อย่างน้อยหนึ่งแถว
**Steps**
1. อ่านแถวปุ่มเหนือตารางตอนที่ยังไม่ติ๊กแถวไหน
2. ติ๊ก checkbox (`aria-label = Select row`) ของแถวแรก
3. อ่านแถวปุ่มเหนือตารางอีกครั้ง
**Expected**
ขั้นที่ 1 แถวเหนือตารางมีแต่ปุ่ม `Add Item` ที่ชิดขวา · ขั้นที่ 3 มีปุ่มเพิ่มขึ้นสามปุ่มชิดซ้ายเรียงตามลำดับ `Approve` → `Reject` → `Send Back` โดยปุ่ม `Add Item` ยังอยู่ที่เดิม

---

## TC-SR-080102 — อนุมัติหมู่ไม่ถามอะไร เปลี่ยนสถานะแถวแล้วล้างการติ๊ก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข และติ๊กแถวไว้สองแถวแล้ว
**Steps**
1. กดปุ่ม `Approve` ในแถวปุ่มเหนือตาราง
2. อ่านคอลัมน์ `Status` ของสองแถวนั้น และดูสถานะ checkbox ของทั้งตาราง
**Expected**
ไม่มีกล่องยืนยันใด ๆ เปิดขึ้น · คอลัมน์ `Status` ของสองแถวเปลี่ยนจาก `PENDING` เป็น `APPROVE` ทันที · checkbox ของทุกแถวถูกล้างจนไม่มีแถวไหนถูกติ๊กอยู่ และปุ่มตัดสินหมู่สามปุ่มหายไปพร้อมกัน

---

## TC-SR-080103 — ปฏิเสธหมู่เปิดกล่องที่มีช่องเหตุผลรายแถวและป้ายจำนวนรายการ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข และติ๊กแถวที่มีชื่อสินค้าไว้สองแถว
**Steps**
1. กดปุ่ม `Reject` ในแถวปุ่มเหนือตาราง
2. อ่านเนื้อหาในกล่องที่เปิดขึ้น
3. พิมพ์เหตุผลลงช่องของแถวแรกแล้วกดปุ่ม `Reject` ในกล่อง
**Expected**
กล่องหัวข้อ `"Reject Store Requisition"` คำอธิบาย `"This will reject the selected items. Please provide a reason."` มีป้ายนับจำนวนอ่านว่า `2` ตามด้วยคำนับรายการ และมีบล็อกเหตุผลสองบล็อกเรียงลำดับ `1` และ `2` ที่แสดงชื่อสินค้าของแต่ละแถวพร้อมช่องกรอก placeholder `"Enter reason (optional)..."` — ต่างจากกล่อง `Reject` ที่มาจากแถบท้ายจอซึ่งไม่มีช่องเหตุผลเลย · หลังกดยืนยัน คอลัมน์ `Status` ของสองแถวเป็น `REJECT` และการติ๊กถูกล้าง

---

## TC-SR-080104 — ปุ่มล้างสถานะในคอลัมน์ Status คืนแถวกลับเป็น Pending
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข และเพิ่งตั้งแถวหนึ่งเป็น `Approve` ในรอบนี้ (สถานะที่เซิร์ฟเวอร์ส่งมาของแถวนั้นยังเป็น `pending`)
**Steps**
1. อ่านคอลัมน์ `Status` ของแถวนั้น
2. กดปุ่ม `aria-label = Reset status` ที่อยู่ข้างข้อความสถานะ
3. อ่านคอลัมน์ `Status` อีกครั้ง และดูแถบท้ายจอ
**Expected**
ขั้นที่ 1 สถานะอ่านว่า `APPROVE` และมีปุ่มกากบาทเล็กอยู่ข้าง ๆ · ขั้นที่ 3 สถานะกลับไปเป็น `PENDING` ปุ่มกากบาทหายไป และปุ่ม `Approve` ในแถบท้ายจอหายไปด้วยเพราะไม่เหลือแถวที่ตัดสินแล้ว

---

## TC-SR-080105 — แถวที่เซิร์ฟเวอร์ตัดสินไปแล้วไม่มีปุ่มล้างสถานะ
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข และมีอย่างน้อยหนึ่งแถวที่ backend ส่ง `current_stage_status` มาเป็น `approve` หรือ `reject` อยู่ก่อนแล้ว
**Steps**
1. อ่านคอลัมน์ `Status` ของแถวนั้น
2. มองหาปุ่ม `aria-label = Reset status` ในเซลล์เดียวกัน
**Expected**
เซลล์แสดงสถานะ `APPROVE` (หรือ `REJECT`) แต่ **ไม่มี** ปุ่มล้างสถานะให้กด — ผลที่เซิร์ฟเวอร์บันทึกไปแล้วถอยกลับจากหน้าจอไม่ได้ ต่างจากการตัดสินที่เพิ่งทำในรอบเดียวกัน (TC-SR-080104)

---

## TC-SR-080106 — ปุ่มประวัติรายบรรทัดโผล่เฉพาะแถวที่มีประวัติ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่เดินผ่าน workflow มาแล้วอย่างน้อยหนึ่งขั้น (มีทั้งแถวที่มีประวัติและแถวที่เพิ่งเพิ่มใหม่ หรือเทียบกับใบ `Draft` ที่ยังไม่เคยส่ง)
**Steps**
1. อ่านคอลัมน์ขวาสุดของแถวที่มีประวัติ workflow แล้วกดปุ่มประวัติ
2. อ่านหัวข้อของแผงที่เปิดขึ้น แล้วปิด
3. อ่านคอลัมน์ขวาสุดของแถวที่ยังไม่มีประวัติ
**Expected**
แถวที่มีประวัติมีปุ่มเปิดแผงประวัติและแผงที่เปิดขึ้นมีหัวข้อ `Workflow History` พร้อมชื่อสินค้าของแถวนั้น · แถวที่ยังไม่มีประวัติไม่มีปุ่มนี้ (เหลือเฉพาะปุ่มถังขยะเมื่ออยู่ในโหมดที่ลบได้ หรือว่างเปล่าเมื่อลบไม่ได้)

---

## TC-SR-090101 — จำนวนที่ขอติดลบ ช่องขึ้นสถานะผิดและบันทึกไม่ผ่าน
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ฟอร์มใบเบิกโหมดที่แก้ไขได้ มีแถวที่เลือกสินค้าไว้แล้วหนึ่งแถว
**Steps**
1. กรอก `-1` ลงช่องจำนวนในคอลัมน์ `Requested` ของแถวนั้น
2. กดปุ่ม `Save` บนแถบหัวใบ
3. ตรวจ attribute ของกล่องช่องจำนวนนั้น และอ่าน toast
**Expected**
กล่องของช่องจำนวน (`[data-slot="input-suffix-field"]`) ได้ `data-invalid="true"` และแสดงกรอบแดง · ขึ้น toast เตือน `"1 item is still incomplete — jumped to the first field to fix."` · ใบไม่ถูกบันทึก (URL ไม่เปลี่ยน และไม่มี toast สำเร็จ) · **หมายเหตุสำหรับผู้เขียนสเปก:** ช่องนี้ไม่แสดงข้อความ `"Qty must be at least 0"` เป็นตัวหนังสือบนจอ — ข้อความอยู่ใน schema แต่เซลล์ส่งต่อเฉพาะสถานะผิดพลาด อย่า assert ข้อความ

---

## TC-SR-090102 — ลบจำนวนจนช่องว่าง ค่ากลับเป็นศูนย์ ไม่ค้างสถานะผิด
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ฟอร์มใบเบิกโหมดที่แก้ไขได้ มีแถวที่กรอกจำนวน `5` ไว้แล้ว
**Steps**
1. ลบตัวเลขในช่องจำนวน `Requested` จนช่องว่าง
2. อ่านค่าและ attribute ของกล่องช่องนั้น
3. พิมพ์ `0` ลงไป แล้วอ่านอีกครั้ง
**Expected**
ในขั้นที่ 2 ค่าในฟอร์มถูกตั้งเป็น `0` และกล่องช่อง **ไม่** ติด `data-invalid="true"` ค้าง · ในขั้นที่ 3 ยังคงไม่มีสถานะผิดพลาด — การลบจนว่างต้องไม่กลายเป็นค่าที่ไม่ใช่ตัวเลขจนกรอบแดงค้างแม้พิมพ์เลขกลับเข้าไปแล้ว

---

## TC-SR-090103 — ทุกคอลัมน์จำนวนแสดงหน่วยต่อท้ายในกล่องเดียวกับตัวเลข
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกด้วยบทบาทที่เห็นคอลัมน์จำนวนมากกว่าหนึ่งคอลัมน์ (เช่น `role` เป็น `issue` ซึ่งเห็นทั้ง `Requested`, `Approved`, `Issued`) และแถวนั้นมีชื่อหน่วยของสินค้า
**Steps**
1. อ่านหัวตารางและจดว่ามีคอลัมน์จำนวนใดบ้าง
2. อ่านเนื้อในเซลล์จำนวนของแต่ละคอลัมน์ในแถวเดียวกัน
**Expected**
ทุกเซลล์จำนวนแสดงชื่อหน่วยเดียวกันต่อท้ายตัวเลขภายในกล่องเดียวกัน และ **ไม่มี** คอลัมน์ `Unit` แยกออกมาเป็นคอลัมน์ของตัวเองในตาราง

---

## TC-SR-090104 — ผู้อนุมัติแก้จำนวนที่อนุมัติแล้วออกจากหน้า ระบบถามก่อนทิ้ง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` แล้วกด `Edit` เข้าโหมดแก้ไข
**Steps**
1. แก้ตัวเลขในคอลัมน์ `Approved` ของแถวหนึ่งให้ต่างจากเดิม (ลองใส่ค่าที่มากกว่าจำนวนที่ขอด้วย)
2. อ่านว่ามีข้อความเตือนหรือสถานะผิดพลาดขึ้นที่ช่องนั้นหรือไม่
3. กดปุ่มย้อนกลับบนแถบหัวใบ
**Expected**
ขั้นที่ 2 ช่องรับค่าที่กรอกไว้ตามปกติ ไม่มีสถานะผิดพลาดและไม่มีคำเตือน (คอลัมน์นี้ไม่มีกติกาเพดานฝั่งหน้าจอ — การควบคุมอยู่ที่ backend) · ขั้นที่ 3 ขึ้นกล่อง `"Discard changes?"` ก่อนจะออกจากหน้า พิสูจน์ว่าการแก้จำนวนถูกนับเป็นงานค้างจริง

---

## TC-SR-100101 — กล่องส่งกลับบังคับเลือกขั้นตอนปลายทางก่อนจึงกดยืนยันได้
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` หรือ `issue` ซึ่งเดินผ่านขั้นตอนมาแล้วอย่างน้อยหนึ่งขั้น และตั้งอย่างน้อยหนึ่งแถวเป็น `Send Back` จนปุ่ม `Send Back` โผล่ในแถบท้ายจอ
**Steps**
1. กดปุ่ม `Send Back` ในแถบท้ายจอ
2. ตรวจสถานะของปุ่มยืนยันในกล่องตอนที่ยังไม่เลือกขั้นตอน
3. เลือกขั้นตอนปลายทางหนึ่งตัวเลือกในกลุ่ม radio
4. ตรวจสถานะของปุ่มยืนยันอีกครั้ง
**Expected**
กล่องมีหัวข้อ `"Send Back Store Requisition"` คำอธิบาย `"Send back the requisition for revision. Optionally choose a destination stage."` และหัวข้อย่อย `Stage` ที่มีดาวแดงกำกับ · ปุ่ม `Send Back` ในกล่องอยู่ในสถานะ disabled ในขั้นที่ 2 และกดได้ในขั้นที่ 4 — คำว่า "Optionally" ในคำอธิบายขัดกับกติกาจริงที่บังคับเลือก ให้ยึดพฤติกรรมของปุ่มเป็นหลัก

---

## TC-SR-100102 — ช่องเหตุผลมีเฉพาะแถวที่ตั้งเป็นส่งกลับ พร้อมป้ายนับจำนวน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข มีรายการอย่างน้อยสามแถว โดยตั้งสองแถวเป็น `Send Back` และอีกแถวเป็น `Approve`
**Steps**
1. กดปุ่ม `Send Back` ในแถบท้ายจอ
2. นับบล็อกเหตุผลในกล่อง และอ่านชื่อสินค้าของแต่ละบล็อก
3. อ่านป้ายนับจำนวนใต้หัวข้อกล่อง
**Expected**
กล่องมีบล็อกเหตุผล **สองบล็อก** ซึ่งเป็นชื่อสินค้าของสองแถวที่ตั้งเป็นส่งกลับเท่านั้น (แถวที่ตั้งเป็นอนุมัติไม่อยู่ในกล่อง) และป้ายนับจำนวนอ่านว่า `2` ตามด้วยคำนับรายการ — ทุกช่องมี placeholder `"Enter reason (optional)..."`

---

## TC-SR-100103 — เหตุผลเป็นตัวเลือก ไม่มีกติกาความยาวขั้นต่ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดกล่อง `Send Back` อยู่ และเลือกขั้นตอนปลายทางเรียบร้อยแล้ว
**Steps**
1. ปล่อยช่องเหตุผลทุกช่องว่างไว้ แล้วตรวจสถานะปุ่มยืนยัน
2. พิมพ์เหตุผลสั้น ๆ 5 ตัวอักษรลงช่องแรก แล้วตรวจอีกครั้ง
**Expected**
ปุ่ม `Send Back` ในกล่องกดได้ทั้งสองขั้น และไม่มีข้อความเตือนความยาวขั้นต่ำโผล่ขึ้นมาเลย — เหตุผลเป็นตัวเลือกจริงตามที่ placeholder บอก (ไม่มีกติกา `min 20` หรือ `min 50` ตัวอักษรอยู่ใน source ของโมดูลนี้)

---

## TC-SR-100104 — ปิดกล่องแล้วเปิดใหม่ เหตุผลและขั้นตอนที่เลือกถูกล้าง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิดกล่อง `Send Back` อยู่ มีบล็อกเหตุผลอย่างน้อยหนึ่งบล็อก
**Steps**
1. เลือกขั้นตอนปลายทางหนึ่งตัวเลือก และพิมพ์เหตุผลลงช่องแรก
2. กดปุ่ม `Cancel` ในกล่อง
3. กดปุ่ม `Send Back` ในแถบท้ายจอเพื่อเปิดกล่องอีกครั้ง
4. อ่านค่าในช่องเหตุผลและสถานะของกลุ่ม radio
**Expected**
เมื่อเปิดใหม่ ช่องเหตุผลว่างเปล่าและไม่มีตัวเลือกขั้นตอนใดถูกเลือกอยู่ ทำให้ปุ่มยืนยันกลับไป disabled อีกครั้ง — ค่าที่กรอกค้างไว้รอบก่อนต้องไม่ติดมา

---

## TC-SR-100105 — ยืนยันส่งกลับสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิดกล่อง `Send Back` อยู่ เลือกขั้นตอนปลายทางแล้ว และผู้ใช้เป็นผู้ตัดสินของขั้นตอนปัจจุบันจริง
**Steps**
1. กดปุ่ม `Send Back` ในกล่อง
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast `"Store requisition sent back"` และ URL กลับไปเป็น `/store-operation/store-requisition` โดยไม่มีกล่อง `"Discard changes?"` แทรกขึ้นมา

---

## TC-SR-110101 — ปุ่มปฏิเสธในแถบท้ายโผล่เฉพาะเมื่อทุกแถวที่ตัดสินเป็นปฏิเสธ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` ในโหมดแก้ไข มีรายการที่ยังตัดสินได้สองแถว
**Steps**
1. ติ๊กแถวแรกแล้วกด `Reject` (ยืนยันในกล่องที่เปิดขึ้น) จากนั้นอ่านชุดปุ่มในแถบท้ายจอ
2. ติ๊กแถวที่สองแล้วกด `Approve` จากนั้นอ่านชุดปุ่มในแถบท้ายจออีกครั้ง
**Expected**
ขั้นที่ 1 แถบท้ายจอมีปุ่ม `Reject` · ขั้นที่ 2 ปุ่ม `Reject` หายไปและถูกแทนด้วยปุ่ม `Approve` — ปุ่มปฏิเสธของทั้งใบจะโผล่ก็ต่อเมื่อไม่มีแถวไหนถูกตั้งเป็นอนุมัติเหลืออยู่เลย

---

## TC-SR-110102 — กล่องปฏิเสธจากแถบท้าย: หัวข้อ ข้อความ และปุ่มยืนยันสีแดง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `approve` และตั้งทุกแถวที่ตัดสินแล้วเป็น `Reject` จนปุ่ม `Reject` โผล่ในแถบท้ายจอ
**Steps**
1. กดปุ่ม `Reject` ในแถบท้ายจอ
2. อ่านเนื้อหาทั้งหมดในกล่องที่เปิดขึ้น
**Expected**
กล่อง `role="alertdialog"` หัวข้อ `"Reject Store Requisition"` คำอธิบายขึ้นต้นด้วยเลขที่ใบตัวหนาตามด้วย `— This will reject the selected items. Please provide a reason.` และมีปุ่ม `Cancel` กับ `Reject` · **กล่องนี้ไม่มีช่องกรอกเหตุผล** แม้ข้อความจะขอให้กรอก — ช่องเหตุผลอยู่ในกล่อง `Reject` ที่เรียกจากแถวปุ่มเหนือตารางเท่านั้น (TC-SR-080103) ให้ assert ว่าไม่มี `<textarea>`/`<input>` ในกล่องนี้ ตามที่ `showMessage={false}` กำหนดไว้

---

## TC-SR-110103 — ยืนยันปฏิเสธสำเร็จ ขึ้น toast แล้วกลับหน้ารายการ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิดกล่องปฏิเสธจากแถบท้ายจออยู่ และผู้ใช้เป็นผู้ตัดสินของขั้นตอนปัจจุบันจริง
**Steps**
1. กดปุ่ม `Reject` ในกล่อง
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast `"Store requisition rejected"` และ URL กลับไปเป็น `/store-operation/store-requisition` — เปิดใบเดิมซ้ำแล้วป้ายสถานะบนแถบหัวใบไม่ใช่ `In Progress` อีกต่อไป

---

## TC-SR-110104 — กดยกเลิกในกล่องปฏิเสธ สถานะแถวไม่เปลี่ยนและยังอยู่หน้าเดิม
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดกล่องปฏิเสธจากแถบท้ายจออยู่ โดยจดสถานะในคอลัมน์ `Status` ของทุกแถวไว้ก่อน
**Steps**
1. กดปุ่ม `Cancel` ในกล่อง
2. อ่านคอลัมน์ `Status` ของทุกแถว และอ่าน URL
**Expected**
กล่องปิดลง · สถานะทุกแถวยังเป็นค่าเดิมที่จดไว้ · URL ยังเป็น `/store-operation/store-requisition/<uuid>` ของใบเดิม และปุ่ม `Reject` ยังอยู่ในแถบท้ายจอให้กดใหม่ได้ — ไม่มี toast ใด ๆ ขึ้น

---

## TC-SR-120101 — กล่องยืนยันจ่ายของ: หัวข้อ ข้อความ ปุ่ม และไม่มีช่องเหตุผล
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่ `role` เป็น `issue` และทุกแถวที่ตัดสินแล้วเป็น `Approve` จนปุ่ม `Issue` โผล่ในแถบท้ายจอ
**Steps**
1. กดปุ่ม `Issue` ในแถบท้ายจอ
2. อ่านเนื้อหาทั้งหมดในกล่องที่เปิดขึ้น
**Expected**
กล่อง `role="alertdialog"` หัวข้อ `"Issue Store Requisition"` คำอธิบายขึ้นต้นด้วยเลขที่ใบตัวหนาตามด้วย `— Confirm issuing the requested items?` มีปุ่ม `Cancel` กับ `Issue` และ **ไม่มี** ทั้งช่องกรอกเหตุผลและกลุ่มตัวเลือกขั้นตอน · ไม่มีแผ่นเซ็นชื่อ (signature pad) หรือปุ่ม `Confirm Receipt` ที่ไหนในขั้นตอนนี้

---

## TC-SR-120102 — ใบที่ปิดจบแล้ว ทุกแถวไม่มีช่องติ๊กและไม่มีปุ่มตัดสิน
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่สถานะเป็น `Completed` (หรือ `Cancelled` / `Voided`) ด้วยบัญชีที่บทบาทในใบเป็น `approve` หรือ `issue`
**Steps**
1. อ่านคอลัมน์แรกของทุกแถวในตารางรายการ
2. มองหาปุ่มตัดสินหมู่เหนือตาราง และปุ่มตัดสินในแถบท้ายจอ
**Expected**
ไม่มี checkbox (`aria-label = Select row`) ในแถวใดเลย จึงติ๊กเพื่อตัดสินอะไรไม่ได้ · เหนือตารางไม่มีปุ่ม `Approve` / `Reject` / `Send Back` และแถบท้ายจอแสดงเฉพาะยอดรวมโดยไม่มีปุ่มตัดสินใด ๆ — ใบที่ปิดจบแล้วถูกล็อกรายแถว ไม่ได้ล็อกด้วยการซ่อนทั้งตาราง
