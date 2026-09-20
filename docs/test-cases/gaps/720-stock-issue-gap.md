# Stock Issue (ใบเบิกชนิดจ่ายออก) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูลนี้ — เคสที่สเปกแตะไปแล้ว (เปิดหน้ารายการ, เปิดใบจากแถวแรก, กดปุ่มที่หาไม่เจอแล้วปล่อยผ่าน) อยู่ใน `tests/720-stock-issue.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/720-stock-issue.md`_

**Module:** Stock Issue — ใบเบิกร้านค้า (`store_requisition`) ที่ปลายทางเป็นคลังชนิด `direct` ระบบจึงตีเป็นชนิด `issue` ไม่ใช่ `transfer`
**Frontend route:** `routes/store-operation/store-requisition/` (`store-requisition.route.tsx`, `store-requisition-new.route.tsx`, `store-requisition-edit.route.tsx`)  •  **URL:** `/store-operation/store-requisition` · `/store-operation/store-requisition/new` · `/store-operation/store-requisition/:id`
**Prefix:** `SI` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/720-stock-issue.spec.ts` (และ `tests/701-sr.spec.ts` ซึ่งขับ route เดียวกันด้วย prefix `SR`)
**Total test cases:** 44

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **ไม่มี route ชื่อ "stock issue" ในแอป — และไม่เคยมี** `routes/router.tsx:439-471` มีใต้ `store-operation` แค่ `store-requisition`, `stock-replenishment`, `wastage-reporting` · `constant/module-list.ts:256-282` ก็ลงเมนูไว้สามตัวนี้ · `git log` ของ repo frontend ไม่มี commit ที่แตะไฟล์ชื่อ `*stock-issue*` เลย และค้นทั้ง `routes/ components/ constant/ hooks/ messages/` ไม่เจอสตริง `stock-issue` / `stockIssue` / `stock_issue` สักที่ · **สิ่งที่โมดูลนี้หมายถึงจริง ๆ** คือใบเบิกร้านค้าที่ `to_location.location_type === "direct"` ซึ่ง `sr-form.tsx:197-204` แปลงเป็น `sr_type = issue` (ไม่ใช่ `transfer`) — เป็นค่า **derived** จากคลังปลายทาง ไม่ใช่ฟิลด์ที่ผู้ใช้เลือก และ `LIST_PATH` ใน `tests/pages/stock-issue.page.ts:4` ก็ชี้ `/store-operation/store-requisition` อยู่แล้ว ไฟล์นี้จึงเขียนบนพื้นฐานของ UI ใบเบิกจริง ไม่ใช่หน้าจอ "Stock Issue" ที่ไม่มีอยู่
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/720-stock-issue.spec.ts` มี **25 `test(...)` จริง** (ที่เห็นเป็น `TC-SI-9000xx` อีก 6 ตัวคือหัวข้อคอมเมนต์คั่นบล็อก ไม่ใช่เทส): เปิดหน้ารายการ (`TC-SI-010001` — เป็นเคสเดียวที่ assert อะไรที่มีความหมาย คือ URL), กด next page ถ้ามี (`010004`), เปิดใบจากแถวที่ 2 (`020001`), พิมพ์คำค้นลงช่องค้นหา (`030001`–`030003`, `030005`), เข้า URL ตรง ๆ ในบทบาทที่ไม่มีสิทธิ์ (`020003`, `030004`), กดปุ่มที่ไม่มีในแอป (`040001`, `040005`, `050001`, `060001`), และเคสที่เหลือคือ `gotoList()` แล้วจบ (`010003`, `020002`, `040003`, `040004`, `050003`, `050005`, `060003`) หรือ `gotoDetail()` ของ id มั่ว ๆ แล้วจบ (`050004`, `060004`) ไฟล์นี้จึงเก็บพฤติกรรมชั้นในทั้งหมดที่ยังไม่มีใครยืนยัน
>
> **จำนวน skip / fixme / `.catch()`** — `test.skip` แบบมีเงื่อนไขในตัวเทส **1 ตัว** (`TC-SI-020001`, `purchaseTest.skip(true, "No SR available")` ที่ `720-stock-issue.spec.ts:109`) · `test.fixme` **1 ตัว** (`TC-SI-050002` ที่บรรทัด 522 — คอมเมนต์เหนือมันบันทึกไว้เองว่าเคสกลุ่มนี้ "ผ่าน" เพราะถูก `.catch(() => {})` กลืน) · `.catch(() => {})` ในโค้ดจริง **9 จุด** (บรรทัด 80, 187, 210, 234, 257, 313, 380, 441, 578 — อีกหนึ่งที่ grep เจอคือข้อความในคอมเมนต์) กระจายอยู่ใน **9 เทส** ทั้งหมด**ครอบ action** (`click` / `fill`) **ไม่มีสักจุดที่ครอบ assertion** · ที่ต้องรู้คู่กันคือ **มี `expect(...)` แค่ 8 ครั้งทั้งไฟล์ และ 3 ในนั้นคือ `expect(true).toBe(true)`** (บรรทัด 410, 546, 647) — พูดอีกแบบคือ 25 เคสนี้มีเคสที่ยืนยันอะไรได้จริงอยู่ 4 เคส
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้** —
> (1) **ปุ่มที่ page object หาอยู่ไม่มีในแอป** `viewFullSRButton()` (`/view full sr|view sr/i`), `viewExpenseAllocationButton()` (`/view expense allocation/i`) และ `completeButton()` ไม่ตรงกับอะไรเลยใน `routes/store-operation/store-requisition/` — ไม่มีหน้าจอ "View Full SR" (ใบเบิกคือใบเดียวกันอยู่แล้ว) และไม่มี "Expense Allocation" ในโมดูลนี้ ส่วน `printButton()` (`/^print$/i`) ก็หาไม่เจอบนหัวใบเพราะ **Print เป็น `DropdownMenuItem` อยู่ใต้ปุ่ม "More"** (`sr-header.tsx:180-197` → `components/share/doc-actions-menu.tsx`) ปุ่ม Print เดี่ยว ๆ มีที่เดียวคือในแท็บ Stock Movement (`sr-stock-table.tsx:208-214`)
> (2) **ไม่มีการ์ด From Location / To Location / Department / Expense Account** อย่างที่ annotation ของสเปกบรรยาย — สี่ค่านี้เป็นช่องในฟอร์ม (`sr-request-details.tsx`) กับข้อความบนแถบหัวเอกสาร (`sr-header.tsx:246-272`) locator `fromLocationCard()` ฯลฯ จึงไปคว้า `[data-slot='card']` ใบแรกที่บังเอิญมีคำนั้นอยู่
> (3) **ช่องค้นหายิงตอน Enter เท่านั้น** (`components/search-input.tsx:35-40`) และปุ่มท้ายช่อง **เปลี่ยนเป็นปุ่ม Clear ทันทีที่มีข้อความ** (`onClick={inputValue ? handleClear : handleSearch}`) — `fill()` เฉย ๆ อย่างที่สเปกทำจึงไม่กรองอะไรเลย
> (4) **บทบาทเป็นตัวกำหนดคอลัมน์** `use-sr-item-table.tsx:423-427, 480-524` — `role = create` ไม่เห็นทั้ง Approved และ Issued · `approve` เห็น Approved แต่ **ไม่เห็น Issued** · `issue` เห็นทั้งคู่แต่ Approved ถูกล็อก · `view_only` อ่านอย่างเดียวและไม่มี checkbox (`use-sr-item-table.tsx:587-591`) · `role` มาจาก backend ในตัวใบ (`storeRequisition.role`) ไม่ใช่ permission ฝั่งหน้าจอ
> (5) **การ "จ่ายของ" คือปุ่ม Issue ใน footer** (`sr-footer.tsx:151-163`) ซึ่งโผล่เมื่อ `role === issue` **และ** ทุกแถวถูกตั้งเป็น approved แล้วเท่านั้น (`computeSrAction`) กดแล้วขึ้น `SrActionDialog` หัวข้อ "Issue Store Requisition" (`sr-form-dialogs.tsx:100-114`) สำเร็จแล้ว toast ว่า "Items issued — stock moved out" (`messages/en.json` → `storeOperation.storeRequisition.issued`)
> (6) **แท็บ Stock Movement เปิดดูได้เฉพาะใบที่ `doc_status === "completed"`** (`sr-form-helpers.ts:srStockVisible`) ก่อนหน้านั้นเห็น empty state "Stock movement shows after this requisition is completed" และ**ไม่ยิง request** · ถ้า `is_posted === false` จะมีบรรทัด "Not posted to stock yet — these figures are projected from the requisition" คาดไว้เหนือตาราง
> (7) **คีย์ i18n ที่ห้ามเขียนเคสอิงถึง** `overIssuedTitle` / `overIssuedDesc` / `overIssuedCount` / `overApproved` / `transferSummary` / `summaryTotalRequested` / `summaryTotalApproved` / `summaryTotalIssued` มีอยู่ใน `messages/en.json` แต่ **ไม่มีโค้ดที่ไหนเรียกใช้** (grep ทั้ง `routes/` + `components/`) — การเตือน "จ่ายเกินที่อนุมัติ" จึงยังไม่มีใน UI ไฟล์นี้ไม่มีเคสของมัน
> (8) **`tests/701-sr.spec.ts` ขับ route เดียวกัน** ด้วย prefix `SR` — ส่วนที่ทับกันจริงคือ `TC-SR-120001` / `TC-SR-120003` (Full/Partial Issuance) แต่สองเคสนั้นหาปุ่ม `recordIssuanceButton()` กับ signature pad ที่ไม่มีในแอป และตัวหนึ่ง `gotoList()` แล้วจบ จึงยังไม่ได้ยืนยันการจ่ายของจริง — เคส `TC-SI-0601xx` ในไฟล์นี้เขียนบนกลไกจริง (`role=issue` + ปุ่ม Issue + dialog) และตั้งใจให้ไปแทนที่สองเคสนั้นเมื่อถูกแปลงเป็นสเปก
>
> **ช่วงเลขที่เลือก** — `SI` ลงทะเบียน section `01–06, 90` ไว้แล้วใน `docs/test-id-scheme.md:56` ไฟล์นี้จึงอยู่ในชุดเดิมทั้งหมด ไม่เปิด section ใหม่ · สเปกใช้ seq `0001`–`0005` ของแต่ละ section ไฟล์นี้จึงเลือก sub-block `01xx` ของ section เดิม (`TC-SI-0101xx`, `TC-SI-0201xx`, …, `TC-SI-0601xx`) ซึ่งว่างทั้งหมด ไม่ชนกับ ID ใดในสเปกหรือ helper · **ความหมายของ section ถูกปรับให้ตรงของจริง**: section 04 เดิมชื่อ "View Full SR" (หน้าจอที่ไม่มี) ใช้เป็น "เปิดใบ + เมนู action รอง" แทน และ section 06 เดิมชื่อ "Expense Allocation" (ฟีเจอร์ที่ไม่มี) ใช้เป็น "จ่ายของจริง / ต้นทุน / การเคลื่อนไหวสต๊อก" ซึ่งเป็นเนื้อหาที่ section นั้นควรครอบในแอปนี้
>
> **Role** — ค่าเริ่มต้นคือ Admin (`admin@blueledgers.com`, BU = `BLAVG`) · เคสที่ผูกกับบทบาทในใบ (`TC-SI-0601xx` ส่วนใหญ่) ต้องการใบที่ backend ตอบ `role` ตามที่เคสระบุ สเปกเดิมใช้ `purchase@blueledgers.com` เป็นฝั่งคลังและ `requestor@blueledgers.com` เป็นฝั่งไม่มีสิทธิ์ คนแปลงเป็นสเปก reuse fixture เดิมได้
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SI-010101 | คอลัมน์ Type แยกใบ ISSUE ออกจาก TRANSFER ในตาราง | High | Functional |
| TC-SI-010102 | กรอง Type = Issue เหลือเฉพาะใบจ่ายออก | High | Functional |
| TC-SI-010103 | สลับ My pending ↔ All Documents ล้างคำค้น/หน้า/ขั้นตอน | Medium | Functional |
| TC-SI-010104 | Export รายการได้ไฟล์ที่มีคอลัมน์ Type และ From → To | Medium | Functional |
| TC-SI-010105 | Export ขณะไม่มีแถวตรงเงื่อนไข ขึ้น toast เตือน ไม่ดาวน์โหลด | Medium | Edge Case |
| TC-SI-010106 | โหมดการ์ดแสดงแถว Type และโหลดต่อเนื่องเมื่อเลื่อนสุด | Low | Functional |
| TC-SI-010107 | ไม่มี workflow ที่เริ่มได้ ปุ่มสร้างใบจางและบอกเหตุผล | Medium | Authorization |
| TC-SI-020101 | หัวใบแสดงเลขที่ + สถานะ + ชนิด ISSUE + เลขรุ่นเอกสาร | High | Functional |
| TC-SI-020102 | แถบใต้เลขที่ใบเป็นข้อความ ผู้ขอ/แผนก/วันที่ ไม่ใช่ช่องกรอก | Medium | Functional |
| TC-SI-020103 | โปรไฟล์ไม่มีแผนก ขึ้นคำเตือนและปุ่มบันทึกถูกปิด | High | Validation |
| TC-SI-020104 | ใบ draft ไม่มีแถบขั้นตอน ใบที่เดินแล้วมี prev → current → next | High | Functional |
| TC-SI-020105 | กดแถบขั้นตอนเปิด Sheet ประวัติ workflow | Medium | Functional |
| TC-SI-020106 | ใบที่ปิดจบแล้วไม่แสดงขั้นตอนถัดไป | Medium | Edge Case |
| TC-SI-020107 | บทบาท issue แก้หัวใบไม่ได้ทั้งบล็อก | High | Authorization |
| TC-SI-030101 | ค้นหาทำงานตอนกด Enter ไม่ใช่ตอนพิมพ์ | High | Functional |
| TC-SI-030102 | ปุ่มท้ายช่องค้นหากลายเป็นปุ่มล้างเมื่อมีข้อความ | Medium | Edge Case |
| TC-SI-030103 | กรองสถานะหลายค่าพร้อมกัน | High | Functional |
| TC-SI-030104 | กรองด้วยขั้นตอนปัจจุบันและ workflow | Medium | Functional |
| TC-SI-030105 | กรองคลังต้นทางและคลังปลายทาง | High | Functional |
| TC-SI-030106 | กรองผู้ขอและแผนก | Medium | Functional |
| TC-SI-030107 | กรองช่วงวันที่ของใบ | Medium | Functional |
| TC-SI-030108 | ป้ายตัวกรองที่ใช้อยู่และปุ่มล้างทั้งหมด | Medium | Functional |
| TC-SI-040101 | เปิดใบจากเลขที่ใบ ไม่ใช่คลิกทั้งแถว | High | Functional |
| TC-SI-040102 | เมนู More ในโหมดดูมี Duplicate / Comment / Activity / Print | Medium | Functional |
| TC-SI-040103 | Duplicate เปิดใบใหม่พร้อม duplicate_id และล้างจำนวนที่อนุมัติ/จ่าย | High | Functional |
| TC-SI-040104 | Duplicate ถูกบล็อกเมื่อไม่มี workflow ที่เริ่มได้ | Medium | Authorization |
| TC-SI-040105 | ปุ่ม Edit โผล่ตามบทบาทในใบเท่านั้น | High | Authorization |
| TC-SI-040106 | กดย้อนกลับขณะแก้ไขค้าง ขึ้น dialog ยืนยันทิ้งงาน | Medium | Alternate Flow |
| TC-SI-050101 | Print อยู่ในเมนู More ไม่ใช่ปุ่มบนแถบหัวใบ | High | Functional |
| TC-SI-050102 | โหมดแก้ไขไม่มี Duplicate และ Print ในเมนู | Medium | Edge Case |
| TC-SI-050103 | ปุ่ม Print ในแท็บ Stock Movement ของใบที่ปิดจบแล้ว | Medium | Functional |
| TC-SI-050104 | ยังไม่ได้เลือกกิจการ กด Print แล้วเตือน ไม่ยิงคำขอ | Low | Negative |
| TC-SI-060101 | บทบาท create ไม่เห็นคอลัมน์ Approved และ Issued | High | Authorization |
| TC-SI-060102 | บทบาท approve เห็น Approved แต่ไม่เห็น Issued | High | Authorization |
| TC-SI-060103 | บทบาท issue แก้ Issued ได้ แต่ Approved ถูกล็อก | High | Authorization |
| TC-SI-060104 | บทบาท view_only อ่านอย่างเดียว ไม่มีช่องติ๊ก | Medium | Authorization |
| TC-SI-060105 | ติ๊กช่องหัวตารางเปิด dialog เลือกรายการพร้อมจำนวนสองแบบ | Medium | Functional |
| TC-SI-060106 | ติ๊กรายการแล้วมีปุ่มตัดสินรายแถว | High | Functional |
| TC-SI-060107 | ปุ่ม Issue โผล่เฉพาะบทบาท issue และเมื่อทุกแถวเป็น approved | High | Functional |
| TC-SI-060108 | ยืนยันจ่ายของสำเร็จ ขึ้น toast ว่าสต๊อกถูกตัดออกแล้ว | High | Happy Path |
| TC-SI-060109 | ยอดรวมท้ายใบเท่ากับผลรวมคอลัมน์ Total | Medium | Functional |
| TC-SI-060110 | ใบที่ยังไม่ปิดจบ แท็บ Stock Movement ว่างพร้อมคำอธิบาย | High | Edge Case |
| TC-SI-060111 | ใบที่ปิดจบแล้ว แท็บ Stock Movement แสดง lot / เข้า / ออก / ต้นทุน | High | Functional |
| TC-SI-060112 | กรองทิศทางเข้า-ออก ตารางเปลี่ยน ยอดสรุปท้ายจอไม่เปลี่ยน | Medium | Edge Case |

---

## TC-SI-010101 — คอลัมน์ Type แยกใบ ISSUE ออกจาก TRANSFER ในตาราง
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, BU = `BLAVG`); ใน BU มีใบเบิกอย่างน้อยหนึ่งใบที่ปลายทางเป็นคลังชนิด `direct` (จึงเป็น `sr_type = issue`) และอย่างน้อยหนึ่งใบที่เป็น `transfer`
**Steps**
1. เปิด `/store-operation/store-requisition`
2. สลับไปมุมมอง "All Documents"
3. อ่านคอลัมน์ Type ของตาราง
**Expected**
ตารางมีคอลัมน์ Type อยู่ถัดจากคอลัมน์เลขที่ใบ จัดกึ่งกลาง และแต่ละแถวแสดงคำว่า `ISSUE` หรือ `TRANSFER` เป็นตัวพิมพ์ใหญ่พร้อมไอคอนสถานะ — ค่านี้เป็นข้อความสีเทา (ไม่ย้อมสี เพราะสีสงวนไว้ให้คอลัมน์ Status)

---

## TC-SI-010102 — กรอง Type = Issue เหลือเฉพาะใบจ่ายออก
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` มุมมอง "All Documents"; มีใบทั้งสองชนิดอยู่ใน BU
**Steps**
1. กดปุ่มตัวกรอง
2. ในหมวดเอกสาร เลือกช่อง Type แล้วติ๊ก "Issue"
3. ปิดเมนูตัวกรองแล้วรอให้ตารางโหลดใหม่
**Expected**
ทุกแถวที่เหลือมีคอลัมน์ Type เป็น `ISSUE` และไม่มีแถวไหนเป็น `TRANSFER` · มีป้ายตัวกรองที่ใช้อยู่ปรากฏเหนือตาราง

---

## TC-SI-010103 — สลับ My pending ↔ All Documents ล้างคำค้น/หน้า/ขั้นตอน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition`; มีใบมากพอให้มีมากกว่าหนึ่งหน้า
**Steps**
1. ที่มุมมอง "My pending" พิมพ์คำค้นแล้วกด Enter
2. กรองขั้นตอนปัจจุบันไว้หนึ่งค่า แล้วกดไปหน้า 2
3. กดสลับเป็น "All Documents"
**Expected**
ช่องค้นหากลับเป็นว่าง ตัวกรองขั้นตอนถูกล้าง และรายการกลับมาอยู่หน้า 1 (URL ไม่เหลือพารามิเตอร์ `search`, `page`, `workflow_current_stage`) — สองมุมมองนี้เป็นคนละชุดข้อมูล เงื่อนไขจากมุมมองเดิมจึงต้องไม่ติดตามมา

---

## TC-SI-010104 — Export รายการได้ไฟล์ที่มีคอลัมน์ Type และ From → To
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` และมีใบอย่างน้อย 1 ใบในมุมมองที่เปิดอยู่
**Steps**
1. กดปุ่ม Export บนแถบหัวรายการ
2. รอจนปุ่มหายสถานะกำลังทำงาน
**Expected**
ไฟล์ถูกดาวน์โหลดและขึ้น toast แจ้งจำนวนรายการที่ export · คอลัมน์ในไฟล์เรียงตาม SR No / Type / Date / From → To / Requester / Department / Status / Workflow / Current stage / Description โดยช่อง From → To เป็นชื่อคลังต้นทางกับปลายทางคั่นด้วยลูกศร

---

## TC-SI-010105 — Export ขณะไม่มีแถวตรงเงื่อนไข ขึ้น toast เตือน ไม่ดาวน์โหลด
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/store-operation/store-requisition`
**Steps**
1. พิมพ์คำค้นที่ไม่ตรงกับใบไหนเลย (เช่น `__NO_SUCH_SR__`) แล้วกด Enter จนตารางว่าง
2. กดปุ่ม Export
**Expected**
ขึ้น toast แบบเตือน (ไม่ใช่สำเร็จ) ว่าไม่มีข้อมูลให้ export และไม่มีไฟล์ถูกดาวน์โหลด

---

## TC-SI-010106 — โหมดการ์ดแสดงแถว Type และโหลดต่อเนื่องเมื่อเลื่อนสุด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` บนจอขนาด desktop; มีใบมากกว่าหนึ่งหน้า
**Steps**
1. กดปุ่มสลับเป็นมุมมองการ์ดที่มุมขวาของแถบเครื่องมือ
2. อ่านการ์ดใบแรก
3. เลื่อนลงจนสุดรายการแล้วรอ
**Expected**
การ์ดแต่ละใบมีแถว Type แสดง `ISSUE`/`TRANSFER` พร้อมแถว Date / From → To / Requester / Department · ในโหมดการ์ดไม่มีแถบเลขหน้า แต่เลื่อนจนสุดแล้วมีตัวหมุนและรายการชุดถัดไปถูกต่อท้ายให้เอง

---

## TC-SI-010107 — ไม่มี workflow ที่เริ่มได้ ปุ่มสร้างใบจางและบอกเหตุผล
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี SR workflow ที่ `can_create = true` สักตัวใน BU ที่ใช้งานอยู่
**Steps**
1. เปิด `/store-operation/store-requisition`
2. สังเกตปุ่มสร้างใบใหม่บนแถบหัวรายการ
3. กดปุ่มนั้น
**Expected**
ปุ่มยังอยู่ในหน้าแต่อยู่ในสถานะปิด และเมื่อกดจะขึ้น dialog แจ้งเหตุผลว่า "None of the approval flows let you start a store requisition." — ระบบไม่พาไปหน้า `/store-operation/store-requisition/new` และไม่ซ่อนปุ่มทิ้งเงียบ ๆ

---

## TC-SI-020101 — หัวใบแสดงเลขที่ + สถานะ + ชนิด ISSUE + เลขรุ่นเอกสาร
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบเบิกชนิด `issue` (ปลายทางเป็นคลัง `direct`) อย่างน้อยหนึ่งใบที่พ้นสถานะ draft แล้ว
**Steps**
1. เปิด `/store-operation/store-requisition`
2. เปิดใบชนิด Issue จากคอลัมน์เลขที่ใบ
3. อ่านแถบหัวเอกสาร
**Expected**
ชื่อเรื่องคือเลขที่ใบ และถัดไปหลังเส้นคั่นมีสถานะเอกสาร, คำว่า `ISSUE` เป็นตัวพิมพ์ใหญ่ และข้อความ "Version &lt;n&gt;" อยู่บรรทัดเดียวกันทั้งหมด

---

## TC-SI-020102 — แถบใต้เลขที่ใบเป็นข้อความ ผู้ขอ/แผนก/วันที่ ไม่ใช่ช่องกรอก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกชนิด Issue อยู่ในโหมดดู
**Steps**
1. อ่านบรรทัดใต้เลขที่ใบบนแถบหัวเอกสาร
2. ลองคลิกที่ชื่อผู้ขอและที่วันที่
**Expected**
บรรทัดนั้นมีสามค่าเรียงกันพร้อมไอคอน — ผู้ขอ, แผนก (พร้อมรหัสแผนกในวงเล็บถ้ามี) และวันที่ของใบตามรูปแบบวันที่ของผู้ใช้ — ทั้งสามเป็นข้อความอย่างเดียว ไม่มี input ให้โฟกัสหรือแก้ไข แม้ในโหมดแก้ไข

---

## TC-SI-020103 — โปรไฟล์ไม่มีแผนก ขึ้นคำเตือนและปุ่มบันทึกถูกปิด
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login ด้วยบัญชีที่โปรไฟล์ยังไม่ได้ผูกแผนกใน BU ที่ใช้งานอยู่
**Steps**
1. เปิด `/store-operation/store-requisition/new`
2. อ่านบรรทัดแผนกบนแถบหัวเอกสาร
3. สังเกตปุ่มบันทึก
**Expected**
ช่องแผนกแสดงข้อความ "Your profile does not have a department assigned. Please contact your administrator." ด้วยสีเตือน มี toast ข้อความเดียวกันเด้งตอนเปิดหน้า และปุ่มบันทึกอยู่ในสถานะปิดพร้อม tooltip ข้อความเดียวกัน

---

## TC-SI-020104 — ใบ draft ไม่มีแถบขั้นตอน ใบที่เดินแล้วมี prev → current → next
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบ draft อย่างน้อยหนึ่งใบ และใบที่อยู่ระหว่างดำเนินการ (`in_progress`) อย่างน้อยหนึ่งใบ
**Steps**
1. เปิดใบที่สถานะ draft แล้วดูใต้บรรทัดผู้ขอ/แผนก/วันที่
2. กลับรายการแล้วเปิดใบที่สถานะ in progress
3. ดูตำแหน่งเดียวกัน
**Expected**
ใบ draft ไม่มีแถบขั้นตอนใด ๆ · ใบ in progress มีแถบที่ไล่จากขั้นก่อนหน้า → ขั้นปัจจุบัน → ขั้นถัดไป โดยขั้นปัจจุบันถูกเน้น

---

## TC-SI-020105 — กดแถบขั้นตอนเปิด Sheet ประวัติ workflow
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบที่ผ่านการส่ง/อนุมัติมาแล้วอย่างน้อยหนึ่งครั้ง (มี workflow history)
**Steps**
1. กดที่แถบขั้นตอนบนแถบหัวเอกสาร
2. อ่านแผงที่เลื่อนออกมาทางขวา
**Expected**
Sheet หัวข้อ "Workflow History" เลื่อนออกมาจากขอบขวา แสดงไทม์ไลน์ของการกระทำ (submitted / approved / rejected / sent back / reviewed / completed) พร้อมชื่อผู้ทำและเวลา โดยรายการแรกสุดคือการสร้างใบโดยผู้ขอ · ใบที่ไม่มีประวัติจะกดแถบขั้นตอนไม่ได้

---

## TC-SI-020106 — ใบที่ปิดจบแล้วไม่แสดงขั้นตอนถัดไป
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
มีใบที่สถานะ `completed` (หรือ `cancelled` / `voided`) อย่างน้อยหนึ่งใบ
**Steps**
1. เปิดใบที่ปิดจบแล้ว
2. อ่านแถบขั้นตอนบนแถบหัวเอกสาร
**Expected**
แถบขั้นตอนแสดงเฉพาะขั้นก่อนหน้ากับขั้นปัจจุบัน ไม่มีช่องขั้นถัดไป · กรณีใบที่ถูก void แถบขั้นตอนอยู่ในสถานะสิ้นสุดแบบ voided

---

## TC-SI-020107 — บทบาท issue แก้หัวใบไม่ได้ทั้งบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ backend ตอบ `role = issue` บนใบที่เปิด (ผู้ใช้ฝั่งคลังที่ใบเดินมาถึงขั้นจ่ายของแล้ว)
**Steps**
1. เปิดใบนั้น แล้วกดปุ่ม Edit
2. ลองแก้ช่อง Workflow, Expected date, From location, To location และ Description
**Expected**
ทั้งห้าช่องอยู่ในสถานะปิดถาวร (ไม่ใช่ปิดชั่วคราวระหว่างบันทึก) — ผู้ใช้ขั้นจ่ายของแก้ได้แค่จำนวนในตารางรายการเท่านั้น ไม่ใช่ข้อมูลหัวใบ

---

## TC-SI-030101 — ค้นหาทำงานตอนกด Enter ไม่ใช่ตอนพิมพ์
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` และมีใบที่ค้นเจอด้วยคำค้นที่เตรียมไว้
**Steps**
1. พิมพ์เลขที่ใบบางส่วนลงช่องค้นหา แล้วรอสองวินาทีโดยยังไม่กดอะไร
2. สังเกตจำนวนแถวในตาราง
3. กด Enter
**Expected**
ในขั้นที่ 2 ตารางยังเป็นชุดเดิมและ URL ยังไม่มีพารามิเตอร์ `search` · หลังกด Enter ในขั้นที่ 3 ตารางจึงกรองเหลือเฉพาะใบที่ตรงคำค้น — พิมพ์เฉย ๆ ไม่กรองให้

---

## TC-SI-030102 — ปุ่มท้ายช่องค้นหากลายเป็นปุ่มล้างเมื่อมีข้อความ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` โดยช่องค้นหายังว่าง
**Steps**
1. อ่านป้ายกำกับ (aria-label) ของปุ่มท้ายช่องค้นหาตอนช่องยังว่าง
2. พิมพ์ข้อความลงไปหนึ่งคำ แล้วอ่านป้ายกำกับของปุ่มเดิมอีกครั้ง
3. กดปุ่มนั้น
**Expected**
ตอนช่องว่างปุ่มเป็นปุ่มค้นหา · ทันทีที่มีข้อความปุ่มเปลี่ยนเป็นปุ่มล้างคำค้น และกดแล้วช่องถูกล้างพร้อมรายการกลับมาเป็นชุดเต็ม — ไม่ใช่การกดค้นหาด้วยคำที่พิมพ์ไว้

---

## TC-SI-030103 — กรองสถานะหลายค่าพร้อมกัน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` มุมมอง "All Documents"; มีใบหลายสถานะใน BU
**Steps**
1. เปิดเมนูตัวกรอง แล้วไปที่ช่อง Status ในหมวดเอกสาร
2. ติ๊กทั้ง "Draft" และ "In progress"
3. ปิดเมนูแล้วรอตารางโหลดใหม่
**Expected**
ทุกแถวที่เหลือมีสถานะเป็นหนึ่งในสองค่าที่ติ๊กไว้ (เป็น OR ไม่ใช่ AND) และมีป้ายตัวกรองปรากฏเหนือตารางหนึ่งป้ายต่อค่า

---

## TC-SI-030104 — กรองด้วยขั้นตอนปัจจุบันและ workflow
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition`; BU มี SR workflow อย่างน้อยหนึ่งตัวและมีใบที่เดินอยู่ในขั้นตอนต่าง ๆ
**Steps**
1. เปิดเมนูตัวกรอง เลือกขั้นตอนหนึ่งค่าในช่อง Stage
2. อ่านคอลัมน์ Current stage ของแถวที่เหลือ
3. ล้างตัวกรองนั้นแล้วเลือก workflow หนึ่งตัวในช่อง Workflow แทน
**Expected**
ขั้นที่ 2 ทุกแถวมีคอลัมน์ Current stage ตรงกับขั้นที่เลือก · ขั้นที่ 3 ทุกแถวมีคอลัมน์ Workflow ตรงกับ workflow ที่เลือก · ตัวเลือกในช่อง Stage มาจากขั้นตอนจริงของ workflow ใน BU ไม่ใช่รายการตายตัว

---

## TC-SI-030105 — กรองคลังต้นทางและคลังปลายทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition`; มีใบที่ใช้คลังต้นทาง/ปลายทางมากกว่าหนึ่งคู่
**Steps**
1. เปิดเมนูตัวกรอง ไปหมวดคลัง เลือกคลังต้นทางหนึ่งแห่ง
2. อ่านคอลัมน์ From → To ของแถวที่เหลือ
3. เพิ่มการเลือกคลังปลายทางที่เป็นชนิด direct
**Expected**
ขั้นที่ 2 ทุกแถวมีชื่อคลังต้นทางที่เลือกอยู่ก่อนลูกศร · ขั้นที่ 3 ทุกแถวมีทั้งต้นทางและปลายทางตรงตามที่เลือก และคอลัมน์ Type ของแถวเหล่านั้นเป็น `ISSUE` (ปลายทาง direct คือเงื่อนไขที่ทำให้ใบเป็นชนิดจ่ายออก)

---

## TC-SI-030106 — กรองผู้ขอและแผนก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` มุมมอง "All Documents"; มีใบจากผู้ขอและแผนกมากกว่าหนึ่งราย
**Steps**
1. เปิดเมนูตัวกรอง ไปหมวดบุคคล เลือกผู้ขอหนึ่งคน
2. อ่านคอลัมน์ Requester ของแถวที่เหลือ
3. ล้างแล้วเลือกแผนกหนึ่งแผนกแทน
**Expected**
ทุกแถวมีผู้ขอ (แล้วแผนกในขั้นที่ 3) ตรงกับค่าที่เลือก และจำนวนใบบนหัวรายการปรับตามผลที่กรองได้

---

## TC-SI-030107 — กรองช่วงวันที่ของใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition`; มีใบกระจายอยู่หลายวัน
**Steps**
1. เปิดเมนูตัวกรอง ไปหมวดวันที่ เลือกช่วงวันที่ที่คลุมเฉพาะบางใบ
2. ปิดเมนูแล้วอ่านคอลัมน์ Date
**Expected**
ทุกแถวมีวันที่ของใบอยู่ในช่วงที่เลือก (รวมวันหัวท้าย) และรายการเรียงจากวันที่ใหม่ไปเก่าเป็นค่าเริ่มต้น

---

## TC-SI-030108 — ป้ายตัวกรองที่ใช้อยู่และปุ่มล้างทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` และยังไม่มีตัวกรองใดถูกตั้งไว้
**Steps**
1. ตั้งตัวกรองสองอย่างที่ต่างหมวดกัน (เช่น Type = Issue และแผนกหนึ่งแผนก)
2. อ่านแถบใต้แถบเครื่องมือ
3. กดปุ่มล้างทั้งหมด
**Expected**
ขั้นที่ 2 มีป้ายหนึ่งใบต่อหนึ่งตัวกรองที่ตั้งไว้ และตัวเลขจำนวนตัวกรองที่ใช้อยู่ปรากฏบนปุ่มตัวกรอง · ขั้นที่ 3 ป้ายทั้งหมดหายไป ตัวเลขบนปุ่มหายไป และตารางกลับมาเป็นชุดเต็ม

---

## TC-SI-040101 — เปิดใบจากเลขที่ใบ ไม่ใช่คลิกทั้งแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation/store-requisition` และมีใบอย่างน้อยหนึ่งใบ
**Steps**
1. คลิกที่พื้นที่ว่างกลางแถวแรก (ไม่ใช่ที่เลขที่ใบ)
2. คลิกที่ข้อความเลขที่ใบของแถวเดียวกัน
**Expected**
ขั้นที่ 1 ไม่เกิดการนำทาง (URL ยังเป็นหน้ารายการ) · ขั้นที่ 2 ระบบพาไป `/store-operation/store-requisition/<uuid>` และหน้ารายละเอียดของใบนั้นถูกโหลด — แถวรายการเปิดเอกสารจากปุ่มที่หน้าตาเหมือนลิงก์บนเลขที่ใบเท่านั้น

---

## TC-SI-040102 — เมนู More ในโหมดดูมี Duplicate / Comment / Activity / Print
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่บันทึกแล้วอยู่ในโหมดดู
**Steps**
1. กดปุ่ม "More" ที่มุมขวาของแถบหัวเอกสาร
2. อ่านรายการในเมนู
**Expected**
เมนูมีรายการ Duplicate, Comment, Activity และ Print ครบทั้งสี่ · ถ้าใบนี้มีคอมเมนต์อยู่แล้ว จะมีจุดเล็ก ๆ อยู่ในแถวเดียวกับข้อความบนปุ่ม "More" และจำนวนคอมเมนต์อยู่ในเมนู

---

## TC-SI-040103 — Duplicate เปิดใบใหม่พร้อม duplicate_id และล้างจำนวนที่อนุมัติ/จ่าย
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกชนิด Issue ที่มีรายการสินค้าอย่างน้อยหนึ่งแถวและเคยผ่านการอนุมัติ/จ่ายของมาแล้ว (Approved/Issued ไม่เป็นศูนย์)
**Steps**
1. กด More → Duplicate
2. อ่าน URL ที่ไปถึง
3. อ่านตารางรายการในใบใหม่
**Expected**
ระบบพาไป `/store-operation/store-requisition/new?duplicate_id=<uuid ของใบเดิม>` · ใบใหม่คัดมาเฉพาะ workflow, แผนก, คลังต้นทาง-ปลายทาง, คำอธิบาย, รายการสินค้าและจำนวนที่ขอ · วันที่ของใบเป็นวันนี้ ผู้ขอเป็นผู้กด และจำนวนที่อนุมัติกับจำนวนที่จ่ายของทุกแถวเป็น 0 พร้อมสถานะแถวเป็น pending · ฟอร์มนับเป็นแก้ไขค้างตั้งแต่เปิด (กดย้อนกลับแล้วต้องถามยืนยันทิ้งงาน)

---

## TC-SI-040104 — Duplicate ถูกบล็อกเมื่อไม่มี workflow ที่เริ่มได้
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี SR workflow ที่ `can_create = true` แต่ยังเปิดดูใบเบิกใบหนึ่งได้
**Steps**
1. เปิดใบนั้น
2. กด More → Duplicate
**Expected**
ขึ้น dialog แจ้งเหตุผลว่า "None of the approval flows let you start a store requisition." และ URL ยังอยู่ที่หน้าใบเดิม ไม่ถูกพาไปหน้าสร้างใบใหม่ — เกณฑ์เดียวกับปุ่มสร้างใบในหน้ารายการ

---

## TC-SI-040105 — ปุ่ม Edit โผล่ตามบทบาทในใบเท่านั้น
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีใบที่ผู้ใช้ปัจจุบันได้บทบาท `view_only` และใบที่ได้บทบาท `create` / `approve` / `issue`
**Steps**
1. เปิดใบที่ผู้ใช้มีบทบาท view_only แล้วดูแถบหัวเอกสาร
2. เปิดใบที่ผู้ใช้มีบทบาทอื่นในสามค่านั้น แล้วดูตำแหน่งเดียวกัน
**Expected**
ขั้นที่ 1 ไม่มีปุ่ม Edit บนแถบหัวเอกสารเลย (ยังเห็นปุ่ม More ได้) · ขั้นที่ 2 ปุ่ม Edit ปรากฏและกดแล้วฟอร์มเข้าสู่โหมดแก้ไข โดยมีปุ่ม Cancel / Save / Delete มาแทน

---

## TC-SI-040106 — กดย้อนกลับขณะแก้ไขค้าง ขึ้น dialog ยืนยันทิ้งงาน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดใบเบิกที่แก้ไขได้ และกด Edit เข้าโหมดแก้ไขแล้ว
**Steps**
1. แก้ค่าในช่องคำอธิบายให้ต่างจากเดิม
2. กดปุ่มย้อนกลับบนแถบหัวเอกสาร
3. เลือกยกเลิกใน dialog แล้วลองกดย้อนกลับซ้ำ คราวนี้เลือกยืนยันทิ้ง
**Expected**
ขั้นที่ 2 ขึ้น dialog แบบเตือนให้ยืนยันว่าจะทิ้งการแก้ไข และยังไม่ออกจากหน้า · เลือกยกเลิกแล้วค่าที่แก้ยังอยู่ · เลือกยืนยันทิ้งแล้วจึงกลับไปหน้ารายการโดยไม่บันทึก

---

## TC-SI-050101 — Print อยู่ในเมนู More ไม่ใช่ปุ่มบนแถบหัวใบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่บันทึกแล้วอยู่ในโหมดดู; BU ที่ใช้งานอยู่ถูกเลือกไว้เรียบร้อย
**Steps**
1. กวาดสายตาหาปุ่มที่ชื่อ "Print" บนแถบหัวเอกสาร
2. กดปุ่ม More แล้วเลือก Print
**Expected**
ขั้นที่ 1 ไม่มีปุ่มชื่อ Print อยู่บนแถบหัวเอกสาร · ขั้นที่ 2 รายการ Print อยู่ในเมนูและกดได้ โดยระบบเรียกพิมพ์เอกสารชนิด SR ของใบนี้พร้อมเลขที่ใบเป็นเงื่อนไข และระหว่างทำงานรายการนั้นอยู่ในสถานะกำลังพิมพ์

---

## TC-SI-050102 — โหมดแก้ไขไม่มี Duplicate และ Print ในเมนู
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิดใบเบิกที่แก้ไขได้
**Steps**
1. กด Edit เข้าโหมดแก้ไข
2. กดปุ่ม More แล้วอ่านรายการในเมนู
**Expected**
เมนูเหลือเฉพาะ Comment และ Activity — ไม่มี Duplicate และไม่มี Print เพราะค่าที่อยู่บนจอตอนแก้ไขยังไม่ถูกบันทึก การพิมพ์หรือคัดลอกจากค่าเหล่านั้นจะได้ของที่ไม่ตรงกับเอกสารจริง

---

## TC-SI-050103 — ปุ่ม Print ในแท็บ Stock Movement ของใบที่ปิดจบแล้ว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบเบิกที่สถานะ `completed` อย่างน้อยหนึ่งใบ
**Steps**
1. เปิดใบนั้นแล้วกดแท็บ Stock Movement
2. มองแถบเครื่องมือเหนือตาราง
3. กดปุ่ม Print
**Expected**
มีปุ่ม Print พร้อมไอคอนเครื่องพิมพ์อยู่ชิดขวาของแถบเครื่องมือ (คู่กับตัวกรองทิศทางที่อยู่ชิดซ้าย) กดได้เพราะใบมี id แล้ว และกดแล้วเรียกพิมพ์เอกสารชนิด SR ใบเดียวกับที่เมนู More เรียก

---

## TC-SI-050104 — ยังไม่ได้เลือกกิจการ กด Print แล้วเตือน ไม่ยิงคำขอ
**Priority:** Low · **Test Type:** Negative
**Preconditions**
Login ด้วยบัญชีที่ยังไม่มี BU ที่ใช้งานอยู่ (เลือกกิจการไม่ได้) แต่เปิดหน้าใบเบิกได้
**Steps**
1. เปิดใบเบิกใบหนึ่ง
2. กด More → Print
**Expected**
ขึ้น toast แบบเตือน (ไม่ใช่ข้อความ error ของระบบ) ว่ายังไม่ได้เลือกกิจการ และไม่มีคำขอพิมพ์ถูกส่งออกไป — สถานะกำลังพิมพ์ไม่ถูกตั้งเลย

---

## TC-SI-060101 — บทบาท create ไม่เห็นคอลัมน์ Approved และ Issued
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่ backend ตอบ `role = create` สำหรับผู้ใช้ปัจจุบัน (ใบของตัวเองที่ยังอยู่ขั้นสร้าง/ส่ง)
**Steps**
1. เปิดใบนั้นแล้วอยู่ที่แท็บ Items
2. อ่านหัวคอลัมน์ของตารางรายการ
**Expected**
ตารางมีคอลัมน์ #, Product, Requested, Total, Status — **ไม่มี** Approved และ **ไม่มี** Issued · และไม่มีคอลัมน์ช่องติ๊กหน้าแถว

---

## TC-SI-060102 — บทบาท approve เห็น Approved แต่ไม่เห็น Issued
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่ backend ตอบ `role = approve` สำหรับผู้ใช้ปัจจุบัน
**Steps**
1. เปิดใบนั้น กด Edit เข้าโหมดแก้ไข
2. อ่านหัวคอลัมน์ของตารางรายการ
3. ลองแก้ค่าในคอลัมน์ Requested
**Expected**
มีคอลัมน์ Approved ที่แก้ได้ แต่**ไม่มี**คอลัมน์ Issued · คอลัมน์ Requested แสดงเป็นข้อความอ่านอย่างเดียว แก้ไม่ได้ · ผู้อนุมัติตัดสินได้เฉพาะจำนวนที่อนุมัติ ไม่เห็นและไม่แตะจำนวนที่จ่ายจริง

---

## TC-SI-060103 — บทบาท issue แก้ Issued ได้ แต่ Approved ถูกล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกชนิด Issue ที่ backend ตอบ `role = issue` สำหรับผู้ใช้ปัจจุบัน และใบเดินมาถึงขั้นจ่ายของแล้ว
**Steps**
1. เปิดใบนั้น กด Edit เข้าโหมดแก้ไข
2. อ่านหัวคอลัมน์ของตารางรายการ
3. ลองแก้ค่าในคอลัมน์ Approved แล้วลองแก้ค่าในคอลัมน์ Issued
**Expected**
มีครบทั้ง Requested / Approved / Issued · Requested และ Approved เป็นข้อความอ่านอย่างเดียว · มีเพียงคอลัมน์ Issued ที่เป็นช่องกรอกและรับค่าได้ โดยหน่วยนับต่อท้ายตัวเลขในช่องเดียวกัน

---

## TC-SI-060104 — บทบาท view_only อ่านอย่างเดียว ไม่มีช่องติ๊ก
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
เปิดใบเบิกที่ backend ตอบ `role = view_only` สำหรับผู้ใช้ปัจจุบัน
**Steps**
1. เปิดใบนั้น
2. อ่านหัวตารางรายการและมองหาช่องติ๊กหน้าแถว
3. มองหาปุ่ม Add Item
**Expected**
ไม่มีคอลัมน์ช่องติ๊ก ไม่มีคอลัมน์ Issued ไม่มีปุ่ม Add Item และไม่มีปุ่มลบท้ายแถว · ทุกจำนวนแสดงเป็นข้อความ

---

## TC-SI-060105 — ติ๊กช่องหัวตารางเปิด dialog เลือกรายการพร้อมจำนวนสองแบบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกในโหมดแก้ไขด้วยบทบาท `approve` หรือ `issue` และตารางมีรายการหลายแถว โดยบางแถวยังเป็นสถานะ pending
**Steps**
1. ติ๊กช่องที่หัวคอลัมน์แรกของตาราง
2. อ่าน dialog ที่เปิดขึ้น
3. เลือก "Select pending"
**Expected**
การติ๊กหัวตาราง**ไม่ได้**เลือกทุกแถวทันที แต่เปิด dialog "Select Items" ที่มีสองทางเลือกพร้อมคำอธิบาย — "Select all" (ทุกแถวในตาราง) และ "Select pending" (เฉพาะแถวที่ยังรอตัดสิน) · เลือก Select pending แล้วมีเฉพาะแถวสถานะ pending ที่ถูกติ๊ก และช่องหัวตารางอยู่ในสถานะกึ่งกลาง (indeterminate)

---

## TC-SI-060106 — ติ๊กรายการแล้วมีปุ่มตัดสินรายแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกในโหมดแก้ไขด้วยบทบาท `approve` หรือ `issue` และติ๊กรายการไว้อย่างน้อยหนึ่งแถว
**Steps**
1. อ่านแถบเหนือตารางรายการ
2. กดปุ่ม Reject
3. ยกเลิก dialog แล้วกดปุ่ม Approve แทน
**Expected**
เมื่อมีแถวถูกติ๊ก แถบเหนือตารางมีปุ่มเรียงจากซ้าย Approve → Reject → Send back (ปุ่ม Add Item ยังอยู่ชิดขวา) · ปุ่ม Reject เปิด dialog ที่ลิสต์ชื่อสินค้าของแถวที่ติ๊กไว้และมีช่องกรอกเหตุผลรายแถว · กด Approve แล้วสถานะของแถวที่ติ๊กเปลี่ยนเป็น approve และการติ๊กถูกล้าง

---

## TC-SI-060107 — ปุ่ม Issue โผล่เฉพาะบทบาท issue และเมื่อทุกแถวเป็น approved
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกชนิด Issue ด้วยบัญชีที่ได้บทบาท `issue` บนใบนั้น
**Steps**
1. ดูแถบสรุปท้ายจอตอนที่รายการยังไม่ถูกตั้งเป็น approved
2. ติ๊กรายการทั้งหมดแล้วกด Approve ให้ทุกแถวเป็น approve
3. ดูแถบสรุปท้ายจออีกครั้ง
**Expected**
ขั้นที่ 1 ยังไม่มีปุ่ม Issue · ขั้นที่ 3 ปุ่ม Issue (สีเขียว พร้อมไอคอนกล่องมีเครื่องหมายถูก) ปรากฏในแถบสรุปท้ายจอ · บัญชีที่ได้บทบาท `approve` บนใบเดียวกันจะเห็นปุ่ม Approve ที่ตำแหน่งนั้นแทน ไม่ใช่ปุ่ม Issue

---

## TC-SI-060108 — ยืนยันจ่ายของสำเร็จ ขึ้น toast ว่าสต๊อกถูกตัดออกแล้ว
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่บนใบเบิกชนิด Issue ที่ปุ่ม Issue ปรากฏแล้ว (บทบาท `issue` และทุกแถวเป็น approved) และกรอกจำนวนในคอลัมน์ Issued ครบทุกแถวแล้ว
**Steps**
1. กดปุ่ม Issue
2. อ่าน dialog ที่เปิดขึ้น
3. กดยืนยัน
**Expected**
Dialog หัวข้อ "Issue Store Requisition" พร้อมข้อความ "Confirm issuing the requested items?" และเลขที่ใบ โดยปุ่มยืนยันเขียนว่า Issue และ**ไม่มี**ช่องกรอกข้อความ · ยืนยันแล้วขึ้น toast สำเร็จข้อความ "Items issued — stock moved out" และหน้ากลับสู่โหมดดูพร้อมสถานะ/ขั้นตอนของใบที่อัปเดตแล้ว

---

## TC-SI-060109 — ยอดรวมท้ายใบเท่ากับผลรวมคอลัมน์ Total
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบเบิกที่มีรายการสินค้าอย่างน้อยสองแถวและต้นทุนถูกดึงมาแล้ว (คอลัมน์ Total ไม่เป็น 0 ทุกแถว)
**Steps**
1. อยู่ที่แท็บ Items
2. อ่านค่าในคอลัมน์ Total ของทุกแถว
3. อ่านค่า Grand total ในแถบสรุปท้ายจอ
**Expected**
Grand total เท่ากับผลรวมของคอลัมน์ Total ทุกแถวพอดี และแสดงเป็นรูปแบบสกุลเงิน · แถบสรุปยังแสดงอยู่แม้ใบจะปิดจบจนไม่มีปุ่มให้กดแล้ว ตราบใดที่ใบมีรายการ

---

## TC-SI-060110 — ใบที่ยังไม่ปิดจบ แท็บ Stock Movement ว่างพร้อมคำอธิบาย
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
เปิดใบเบิกที่สถานะยังเป็น `draft` หรือ `in_progress`
**Steps**
1. กดแท็บ Stock Movement
2. อ่านเนื้อหาในแท็บ
**Expected**
แท็บแสดง empty state ข้อความ "Stock movement shows after this requisition is completed" — ไม่มีตาราง ไม่มีตัวกรองทิศทาง และไม่มีปุ่ม Print · ก่อนใบปิดจบตัวเลขยังเป็นการคาดการณ์ การโชว์ตารางไว้จะทำให้เข้าใจผิดว่าของถูกตัดสต๊อกไปแล้ว

---

## TC-SI-060111 — ใบที่ปิดจบแล้ว แท็บ Stock Movement แสดง lot / เข้า / ออก / ต้นทุน
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบเบิกชนิด Issue ที่สถานะ `completed` และมีการเคลื่อนไหวสต๊อกบันทึกไว้แล้ว
**Steps**
1. เปิดใบนั้นแล้วกดแท็บ Stock Movement
2. อ่านหัวคอลัมน์ของตาราง
3. อ่านแถบสรุปท้ายจอ
**Expected**
ตารางมีคอลัมน์ #, Location, Product, Unit, Lot no., In, Out, Unit price, Total amount โดยแถวที่ไม่มี lot แสดงขีดแทนค่าว่าง · แถบสรุปท้ายจอเปลี่ยนจาก Grand total เป็นสี่ค่า — In, Out, Value in, Value out โดย Value out ถูกเน้น · ถ้าข้อมูลยังไม่ถูกลงบัญชีสต๊อกจริงจะมีบรรทัด "Not posted to stock yet — these figures are projected from the requisition" อยู่เหนือแถบเครื่องมือ

---

## TC-SI-060112 — กรองทิศทางเข้า-ออก ตารางเปลี่ยน ยอดสรุปท้ายจอไม่เปลี่ยน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่แท็บ Stock Movement ของใบที่ปิดจบแล้วและมีทั้งแถวขาเข้าและขาออก
**Steps**
1. จดค่าทั้งสี่ในแถบสรุปท้ายจอ
2. ตั้งตัวกรองทิศทางเป็น "Out"
3. อ่านตารางและแถบสรุปท้ายจออีกครั้ง
4. ตั้งตัวกรองให้ไม่เหลือแถวเลย (เลือกทิศทางที่ใบนี้ไม่มี)
**Expected**
ขั้นที่ 3 ตารางเหลือเฉพาะแถวที่มีจำนวนขาออก แต่ค่าทั้งสี่ในแถบสรุปยังเท่าเดิมทุกตัว (ยอดสรุปเป็นของทั้งใบ มาจาก API ไม่ได้บวกจากแถวที่เห็น) · ขั้นที่ 4 ตารางแสดงข้อความว่าหาข้อมูลไม่พบ ซึ่งเป็นคนละข้อความกับ empty state ของใบที่ไม่มีรายการเลย

---
