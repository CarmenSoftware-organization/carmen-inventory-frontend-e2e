# Purchase Order — Create Flows (From PR / From Price List) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของสองเส้นทางนี้ — เคสที่สเปกครอบแล้ว (เข้าหน้า, เดินไป step ถัดไป, กด submit, skip เมื่อไม่มีข้อมูล) ถูกทดสอบจริงอยู่ใน `tests/401-po.spec.ts` และ `tests/402-po-purchaser-journey.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/401-po.md` / `docs/user-stories/402-po-purchaser-journey.md`_

**Module:** Purchase Order — Create Flows
**Frontend route:** `routes/procurement/purchase-order/from-pr` + `routes/procurement/purchase-order/from-price-list`  •  **URL:** `/procurement/purchase-order/from-pr` · `/procurement/purchase-order/from-price-list`
**Prefix:** `PO` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/401-po.spec.ts`, `tests/402-po-purchaser-journey.spec.ts`, `tests/403-po-approver-journey.spec.ts`
**Total test cases:** 29

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **ช่วงเลขที่เลือก** — section `06` (sub-journey ของ Purchaser) ซึ่งลงทะเบียนไว้แล้วให้ `PO` (`01–07, 10–19, 20–29, 30–39, 90`) เส้นทางสร้างทั้งสองนี้อยู่ใน sub-journey เดียวกับที่ `402-po-purchaser-journey.spec.ts` ใช้อยู่แล้ว (`TC-PO-0602xx`) จึงเก็บไว้ที่ section เดิม ไม่เปิด section ใหม่ · sub-block ที่ยังว่างทั้งหมดใน section 06 คือ `0606xx`, `0607xx`, `0608xx` (ที่ใช้ไปแล้วคือ `060001–060004`, `0601xx`, `0602xx`, `0603xx`, `0604xx`, `0605xx`, `060901`) จึงเลือก **`TC-PO-0606xx` ให้ From PR** และ **`TC-PO-0607xx` ให้ From Price List** — ไม่ชนกับ ID ใดในสเปกทั้งสามไฟล์
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `TC-PO-010001` (happy path สร้าง PO จาก PR ที่อนุมัติแล้ว), `TC-PO-010003` (ไม่มี PR อนุมัติเลย), `TC-PO-060205`–`060208` (เปิด wizard From Price List, เลือก vendor แล้วไป step 2, กด submit, skip เมื่อไม่มี price list/vendor), `TC-PO-060209`–`060212` (เปิด wizard From PR, เลือก PR แล้วไป step 2, กด submit, skip เมื่อไม่มี PR) ไฟล์นี้จึงเก็บเฉพาะพฤติกรรมชั้นใน: การ gate ด้วย workflow, ลำดับบังคับของฟิลด์, empty state ที่แยกความหมายกัน, กติกา cross-workflow, กติกาสกุลเงินเดียวต่อใบ, หน้าสรุปหลังสร้าง และ discard dialog
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้** — (1) ทั้งสอง route ถูกห่อด้วย `CreateWorkflowGate` (`from-pr.route.tsx:10`, `from-price-list.route.tsx:10`) ถ้าผู้ใช้ไม่มี PO workflow ที่ `can_create = true` เลย จะเห็น `AccessDeniedBlock` แทนทั้งหน้า ไม่ใช่ wizard · (2) ตัวเลือก "วิธีสร้าง PO" เป็น **dialog ของการ์ด `<button>`** (`po-create-dialog.tsx`) ไม่ใช่ dropdown menu — ชื่อการ์ดคือ `Blank PO` / `From Price List` / `From PR` และ regex `/from pr/i` จะชนกับ `From **Pr**ice List` (page object แก้ไว้แล้วที่ `createFromPRMenuItem`) · (3) คอมเมนต์ในสเปกทั้ง `401` และ `402` บันทึกว่า BU `BLAVG` **ไม่มี purchase request เลยสักใบ** (ยืนยันกับ `/api/BLAVG/purchase-requests`) เคสฝั่ง From PR ที่ต้องมีข้อมูลจริงจึง skip ทั้งหมดจนกว่าจะ seed PR ที่อนุมัติแล้ว · (4) การกด Confirm ใน From PR เป็น **destructive** — backend ระบุเองว่า "PR ที่ใช้ไปแล้วเลือกซ้ำไม่ได้" (`confirmCreateDesc`) เคสที่สร้างจริงจึงต้อง seed PR ใหม่ทุกรอบ · (5) รายการผู้ขายใน From Price List มาจาก price list ที่ active **ณ วันส่งมอบที่เลือก** (`usePriceListActiveVendors(apiDate)`) เลือกวันที่ผิดก็ได้ empty state ไม่ใช่บั๊ก
>
> **Role** — ใช้ Admin (`admin@blueledgers.com`, BU = `BLAVG`) เป็นค่าเริ่มต้น สเปก `402` ใช้ `purchase@blueledgers.com` กับ wizard ชุดเดียวกัน คนแปลงเป็นสเปกจะ reuse fixture นั้นก็ได้ถ้าสะดวกกว่า
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PO-060601 | From PR — ไม่มี workflow ที่สร้างได้ ถูกบล็อกทั้งหน้า | Medium | Authorization |
| TC-PO-060602 | From PR — ยังไม่เลือก workflow ตาราง PR ไม่โหลด | High | Functional |
| TC-PO-060603 | From PR — ปุ่ม Next ปิดจนกว่าจะครบ workflow + PR | High | Validation |
| TC-PO-060604 | From PR — ปุ่ม Filter ปิดจนกว่าตารางจะมีข้อมูล | Low | Functional |
| TC-PO-060605 | From PR — กรองจนไม่เหลือแถว แสดงข้อความคนละชุดกับ "ไม่มี PR" | Medium | Edge Case |
| TC-PO-060606 | From PR — ติ๊ก PR ข้าม workflow ขึ้น dialog เตือน | High | Validation |
| TC-PO-060607 | From PR — ยืนยัน dialog ข้าม workflow เหลือเฉพาะใบที่ workflow ตรงกัน | Medium | Functional |
| TC-PO-060608 | From PR — step 2 แสดงตารางใบสั่งซื้อที่จัดกลุ่มแล้วพร้อมยอดรวม | High | Functional |
| TC-PO-060609 | From PR — กางแถวใน step 2 เห็นสินค้ารายบรรทัด | Medium | Functional |
| TC-PO-060610 | From PR — กด Back จาก step 2 กลับ step 1 โดยการเลือกไม่หาย | Medium | Alternate Flow |
| TC-PO-060611 | From PR — ปุ่ม Confirm โผล่เฉพาะ step 2 และเปิด dialog ยืนยันพร้อมจำนวน | High | Functional |
| TC-PO-060612 | From PR — หน้าสรุปหลังสร้างสำเร็จพร้อมลิงก์เข้าใบที่สร้าง | High | Happy Path |
| TC-PO-060613 | From PR — กด Cancel ขณะมีการเลือกค้าง ขึ้น dialog ยืนยันทิ้งงาน | Medium | Alternate Flow |
| TC-PO-060701 | From Price List — ไม่มี workflow ที่สร้างได้ ถูกบล็อกทั้งหน้า | Medium | Authorization |
| TC-PO-060702 | From Price List — step 1 แสดงวันที่/ผู้ซื้อ/แผนก แบบอ่านอย่างเดียว | Low | Functional |
| TC-PO-060703 | From Price List — ยังไม่เลือกวันส่งมอบ รายชื่อผู้ขายยังไม่โหลด | High | Functional |
| TC-PO-060704 | From Price List — วันส่งมอบที่ไม่มี price list ใช้งานอยู่ | Medium | Edge Case |
| TC-PO-060705 | From Price List — ค้นหาผู้ขายด้วยรหัสหรือชื่อ กรองทันทีที่พิมพ์ | Medium | Functional |
| TC-PO-060706 | From Price List — ปุ่ม Next ของ step 1 ปิดจนกว่าจะครบสามช่อง | High | Validation |
| TC-PO-060707 | From Price List — step 2 ช่องจำนวนและคลังปิดอยู่จนกว่าจะติ๊กแถว | High | Functional |
| TC-PO-060708 | From Price List — ล็อกหนึ่งใบหนึ่งสกุลเงิน | High | Validation |
| TC-PO-060709 | From Price List — แถวที่ใช้ไม่ได้ถูกทำจางและติ๊กไม่ได้ | Medium | Edge Case |
| TC-PO-060710 | From Price List — ปุ่ม Next ของ step 2 ปิดจนกว่าทุกแถวที่ติ๊กจะมีคลัง | High | Validation |
| TC-PO-060711 | From Price List — ค้นสินค้าจนไม่เหลือแถว แสดงข้อความคนละชุดกับ "ไม่มีของ" | Medium | Edge Case |
| TC-PO-060712 | From Price List — ป้ายจำนวนสินค้าและยอดรวมขยับตามการติ๊ก | Low | Functional |
| TC-PO-060713 | From Price List — step 3 มีปุ่ม Edit พากลับไปแก้ step ต้นทาง | Medium | Functional |
| TC-PO-060714 | From Price List — ยอด Subtotal / Tax / Grand total ใน step 3 | High | Functional |
| TC-PO-060715 | From Price List — Confirm สำเร็จแล้วเด้งเข้าใบที่เพิ่งสร้าง | High | Happy Path |
| TC-PO-060716 | From Price List — กด Cancel ขณะกรอกค้าง ขึ้น dialog ยืนยันทิ้งงาน | Medium | Alternate Flow |

---

## TC-PO-060601 — From PR — ไม่มี workflow ที่สร้างได้ ถูกบล็อกทั้งหน้า
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี PO workflow ที่ `can_create = true` สักตัวใน BU ที่ใช้งานอยู่ (เช่นบัญชีที่ไม่ใช่สายจัดซื้อ) — `CreateWorkflowGate` ตัดสินจากผลของ `useCreatableWorkflows(WORKFLOW_TYPE.PO)`
**Steps**
1. เปิด URL `/procurement/purchase-order/from-pr` ตรง ๆ
2. รอให้ skeleton ของหน้าโหลดเสร็จ
**Expected**
หน้าแสดงบล็อกปฏิเสธสิทธิ์พร้อมข้อความ "None of the approval flows let you start a purchase order." และไม่มี stepper "Select PRs / Review POs" หรือช่อง Target workflow ให้เห็นเลย

---

## TC-PO-060602 — From PR — ยังไม่เลือก workflow ตาราง PR ไม่โหลด
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, BU = `BLAVG`); ผู้ใช้มี PO workflow ที่สร้างได้อย่างน้อยหนึ่งตัว
**Steps**
1. เปิด `/procurement/purchase-order/from-pr`
2. ยังไม่แตะช่อง Target workflow
**Expected**
พื้นที่ใต้ช่อง Target workflow เป็นกรอบเส้นประที่มีข้อความ "Select a workflow first" และคำอธิบาย "Pick the target workflow above before choosing purchase requests." — ไม่มีตารางใบขอซื้อและไม่มี checkbox ให้ติ๊ก (ตารางจะเริ่มยิง request ก็ต่อเมื่อเลือก workflow แล้วเท่านั้น)

---

## TC-PO-060603 — From PR — ปุ่ม Next ปิดจนกว่าจะครบ workflow + PR
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr` step 1; มีใบขอซื้อที่พร้อมทำใบสั่งซื้ออย่างน้อย 1 ใบใน workflow ที่จะเลือก
**Steps**
1. สังเกตปุ่ม Next ตอนยังไม่เลือกอะไรเลย
2. เลือก Target workflow แล้วสังเกตปุ่ม Next อีกครั้ง (ยังไม่ติ๊ก PR)
3. ติ๊กใบขอซื้อ 1 ใบ
**Expected**
ปุ่ม Next ถูก disable ทั้งในขั้นที่ 1 และขั้นที่ 2 และกลับมากดได้หลังจากติ๊กใบขอซื้อในขั้นที่ 3 (ต้องครบทั้ง workflow และ PR อย่างน้อยหนึ่งใบ)

---

## TC-PO-060604 — From PR — ปุ่ม Filter ปิดจนกว่าตารางจะมีข้อมูล
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr` step 1
**Steps**
1. สังเกตปุ่ม Filter ข้างช่อง Target workflow ตอนยังไม่เลือก workflow
2. เลือก Target workflow ที่มีใบขอซื้อรออยู่ แล้วรอตารางโหลดเสร็จ
3. สังเกตปุ่ม Filter อีกครั้ง
**Expected**
ปุ่ม Filter ปรากฏอยู่เสมอ (ไม่หายไป) แต่ถูก disable ในขั้นที่ 1 และกดเปิดเมนูกรองได้หลังตารางมีข้อมูลในขั้นที่ 3 โดยเมนูมีช่องกรอง Requester, Department และ PR Workflow

---

## TC-PO-060605 — From PR — กรองจนไม่เหลือแถว แสดงข้อความคนละชุดกับ "ไม่มี PR"
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr` step 1 และเลือก workflow ที่มีใบขอซื้ออย่างน้อย 1 ใบแล้ว
**Steps**
1. เปิดเมนู Filter
2. ตั้งค่ากรอง Requester (หรือ Department) เป็นค่าที่ไม่มีใบขอซื้อใบไหนตรงเลย
**Expected**
ตารางแสดงข้อความ "No results match your search" พร้อมคำแนะนำให้ปรับเงื่อนไขการค้นหา — ต้อง **ไม่ใช่** ข้อความ "No Purchase Requests" ซึ่งสงวนไว้สำหรับกรณีที่ไม่มีใบขอซื้อรออยู่จริง ๆ

---

## TC-PO-060606 — From PR — ติ๊ก PR ข้าม workflow ขึ้น dialog เตือน
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr` step 1; ตารางมีใบขอซื้อที่อยู่คนละ workflow กันอย่างน้อย 2 ใบ (ดูจากคอลัมน์ PR Workflow)
**Steps**
1. ติ๊กใบขอซื้อใบแรก
2. ติ๊กใบขอซื้ออีกใบที่คอลัมน์ PR Workflow เป็นคนละค่ากับใบแรก
**Expected**
เปิด dialog ยืนยันหัวข้อ "Requests use different approval flows" พร้อมคำอธิบายที่ระบุชื่อ workflow ที่จะถูกเก็บไว้ และยังไม่มีการเปลี่ยน step

---

## TC-PO-060607 — From PR — ยืนยัน dialog ข้าม workflow เหลือเฉพาะใบที่ workflow ตรงกัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
dialog "Requests use different approval flows" เปิดอยู่ (ต่อจาก TC-PO-060606)
**Steps**
1. กดปุ่ม Confirm ใน dialog
**Expected**
dialog ปิด และเหลือติ๊กไว้เฉพาะใบขอซื้อที่อยู่ workflow เดียวกับใบที่เพิ่งติ๊กล่าสุด ส่วนใบเดิมที่ workflow ไม่ตรงถูกยกเลิกการติ๊กให้อัตโนมัติ

---

## TC-PO-060608 — From PR — step 2 แสดงตารางใบสั่งซื้อที่จัดกลุ่มแล้วพร้อมยอดรวม
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr`; เลือก workflow และติ๊กใบขอซื้ออย่างน้อย 1 ใบแล้ว
**Steps**
1. กดปุ่ม Next
2. รอให้ step 2 "Review POs" แสดงผล
**Expected**
step 2 แสดงตารางที่มีคอลัมน์ PR Ref, Vendor, Delivery Date และ Total พร้อมบรรทัด "Target workflow: <ชื่อ workflow>" อยู่เหนือตาราง และแถบ Grand Total ที่มุมล่างขวาของตาราง

---

## TC-PO-060609 — From PR — กางแถวใน step 2 เห็นสินค้ารายบรรทัด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ step 2 "Review POs" ของ `/procurement/purchase-order/from-pr` และมีอย่างน้อย 1 แถว
**Steps**
1. กดปุ่มลูกศรหน้าแถวแรก (aria-label `Expand`)
**Expected**
แถวถูกกางออกแสดงตารางย่อยของสินค้าในใบนั้น หัวคอลัมน์คือ Product, Quantity, Price และ Total (โดย Price/Total มีรหัสสกุลเงินของใบนั้นกำกับ) และปุ่มเปลี่ยน aria-label เป็น `Collapse`

---

## TC-PO-060610 — From PR — กด Back จาก step 2 กลับ step 1 โดยการเลือกไม่หาย
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ step 2 "Review POs" ของ `/procurement/purchase-order/from-pr` โดยจำจำนวนใบขอซื้อที่ติ๊กไว้ใน step 1 ได้
**Steps**
1. กดปุ่ม Back ที่แถบล่าง
**Expected**
กลับมาที่ step 1 "Select PRs" โดย Target workflow และใบขอซื้อที่ติ๊กไว้ยังคงเดิมครบทุกใบ และปุ่ม Next ยังกดได้

---

## TC-PO-060611 — From PR — ปุ่ม Confirm โผล่เฉพาะ step 2 และเปิด dialog ยืนยันพร้อมจำนวน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr`; มีใบขอซื้อที่พร้อมทำใบสั่งซื้ออย่างน้อย 1 ใบ
**Steps**
1. สังเกตแถบหัวเรื่องตอนอยู่ step 1 ว่ามีปุ่ม Confirm หรือไม่
2. เลือก workflow ติ๊กใบขอซื้อ แล้วกด Next ไป step 2
3. กดปุ่ม Confirm ที่มุมขวาบน
**Expected**
step 1 ไม่มีปุ่ม Confirm ในแถบหัวเรื่อง · step 2 มีปุ่ม Confirm และเมื่อกดจะเปิด dialog หัวข้อ "Create purchase orders?" ที่ระบุจำนวนใบสั่งซื้อที่จะถูกสร้างและจำนวนใบขอซื้อที่ใช้ พร้อมประโยคเตือนว่าใบขอซื้อที่ใช้ไปแล้วเลือกซ้ำไม่ได้

---

## TC-PO-060612 — From PR — หน้าสรุปหลังสร้างสำเร็จพร้อมลิงก์เข้าใบที่สร้าง
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
dialog "Create purchase orders?" เปิดอยู่ (ต่อจาก TC-PO-060611); **destructive** — ใบขอซื้อที่ใช้จะถูกกินไปและเลือกซ้ำไม่ได้ ต้อง seed ใบใหม่ก่อนรันรอบถัดไป
**Steps**
1. กดปุ่ม Confirm ใน dialog
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast "Purchase Order created successfully" และหน้าทั้งหน้าถูกแทนด้วยหน้าสรุป: หัวเรื่อง "<N> purchase orders created" พร้อมบรรทัดสรุปจำนวนใบขอซื้อและจำนวนบรรทัดที่ประมวลผล, ตารางใบสั่งซื้อที่สร้าง (คอลัมน์ PO No., Vendor, Delivery Date, Items, Qty, Subtotal, Tax, Total) และปุ่ม "Purchase Order" สำหรับกลับหน้ารายการ — ไม่มี stepper "Select PRs / Review POs" และไม่มีปุ่ม Next/Back/Cancel เหลืออยู่ · เมื่อคลิกเลขใบในคอลัมน์ PO No. จะไปที่ `/procurement/purchase-order/<id>` ของใบนั้น

---

## TC-PO-060613 — From PR — กด Cancel ขณะมีการเลือกค้าง ขึ้น dialog ยืนยันทิ้งงาน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-pr` step 1 และเลือก Target workflow ไว้แล้ว (หรือติ๊กใบขอซื้อไว้แล้ว) — สถานะนี้ถือว่ามีงานค้าง
**Steps**
1. กดปุ่ม Cancel ที่แถบล่าง (หรือปุ่มลูกศรย้อนกลับที่มุมซ้ายบน)
**Expected**
ขึ้น dialog ถามยืนยันทิ้งการเปลี่ยนแปลง ("Discard changes?") และหน้ายังไม่ออกจาก wizard · เมื่อกดยืนยันทิ้งจึงกลับไปที่ `/procurement/purchase-order`

---

## TC-PO-060701 — From Price List — ไม่มี workflow ที่สร้างได้ ถูกบล็อกทั้งหน้า
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี PO workflow ที่ `can_create = true` สักตัวใน BU ที่ใช้งานอยู่
**Steps**
1. เปิด URL `/procurement/purchase-order/from-price-list` ตรง ๆ
2. รอให้ skeleton ของหน้าโหลดเสร็จ
**Expected**
หน้าแสดงบล็อกปฏิเสธสิทธิ์พร้อมข้อความ "None of the approval flows let you start a purchase order." และไม่มี stepper "Order & Vendor / Select Items / Review & Confirm" ให้เห็น

---

## TC-PO-060702 — From Price List — step 1 แสดงวันที่/ผู้ซื้อ/แผนก แบบอ่านอย่างเดียว
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, BU = `BLAVG`); เปิด `/procurement/purchase-order/from-price-list`
**Steps**
1. ดูแถบข้อมูลด้านบนของ step 1 "Order & Vendor"
**Expected**
แถบบนแสดงสามช่องคือ Date (วันที่ของวันนี้ตามรูปแบบวันที่ของผู้ใช้), Buyer (ชื่อ-นามสกุลของผู้ใช้ที่ล็อกอิน) และ Department (แผนกจาก BU ปัจจุบัน) โดยทั้งสามเป็นข้อความอ่านอย่างเดียว ไม่มี input ให้แก้

---

## TC-PO-060703 — From Price List — ยังไม่เลือกวันส่งมอบ รายชื่อผู้ขายยังไม่โหลด
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-price-list` step 1 และยังไม่ได้เลือก Delivery Date
**Steps**
1. ดูกล่องรายชื่อ Vendor ใต้ช่อง Delivery Date
**Expected**
กล่องรายชื่อผู้ขายแสดงข้อความ "Pick a delivery date first" พร้อมคำอธิบาย "Vendors are listed from the price lists active on that date." และไม่มี radio ให้เลือกผู้ขายเลย

---

## TC-PO-060704 — From Price List — วันส่งมอบที่ไม่มี price list ใช้งานอยู่
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-price-list` step 1; ทราบช่วงวันที่ที่ไม่มี price list ของผู้ขายรายใด active อยู่ (เช่นวันที่ในอนาคตไกล)
**Steps**
1. เลือก Delivery Date เป็นวันที่ที่ไม่มี price list ครอบคลุม
2. รอให้รายชื่อผู้ขายโหลดเสร็จ
**Expected**
กล่องรายชื่อผู้ขายแสดง "No active vendors" พร้อมคำอธิบาย "No vendor has an active price list on the selected delivery date." และปุ่ม Next ยังคงถูก disable

---

## TC-PO-060705 — From Price List — ค้นหาผู้ขายด้วยรหัสหรือชื่อ กรองทันทีที่พิมพ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-price-list` step 1 และเลือก Delivery Date ที่มีผู้ขายอย่างน้อย 2 รายแล้ว
**Steps**
1. จดรหัส (badge) ของผู้ขายรายแรกไว้
2. พิมพ์รหัสนั้นลงช่องค้นหา "Search vendor by code or name…" โดยไม่กด Enter
**Expected**
รายชื่อผู้ขายถูกกรองทันทีระหว่างพิมพ์ (ไม่ต้องกด Enter) เหลือเฉพาะรายที่รหัสหรือชื่อมีข้อความที่พิมพ์อยู่ และการค้นหาไม่สนตัวพิมพ์เล็ก-ใหญ่

---

## TC-PO-060706 — From Price List — ปุ่ม Next ของ step 1 ปิดจนกว่าจะครบสามช่อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
เพิ่งเปิด `/procurement/purchase-order/from-price-list` ยังไม่กรอกอะไร; มีผู้ขายที่มี price list active อย่างน้อย 1 ราย
**Steps**
1. สังเกตปุ่ม Next ตอนยังไม่กรอกอะไร
2. เลือก Workflow แล้วสังเกตปุ่ม Next
3. เลือก Delivery Date แล้วสังเกตปุ่ม Next
4. เลือกผู้ขาย 1 ราย
**Expected**
ปุ่ม Next ถูก disable ในขั้นที่ 1–3 และกดได้เฉพาะเมื่อครบทั้ง Workflow, Delivery Date และ Vendor ในขั้นที่ 4

---

## TC-PO-060707 — From Price List — step 2 ช่องจำนวนและคลังปิดอยู่จนกว่าจะติ๊กแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
ผ่าน step 1 มาแล้ว (เลือก workflow, delivery date และผู้ขายที่มีรายการราคาใช้งานอยู่) และอยู่ที่ step 2 "Select Items"
**Steps**
1. ดูหัวคอลัมน์ของตารางรายการราคา
2. ดูช่อง Qty และช่อง Location ของแถวแรกตอนที่ยังไม่ติ๊ก
3. ติ๊ก checkbox ของแถวแรก
**Expected**
ตารางมีคอลัมน์ Price List No, Product, Unit, Unit Price, Qty และ Location · ก่อนติ๊ก ช่อง Qty และ Location ของแถวนั้นถูก disable · หลังติ๊กแล้วทั้งสองช่องแก้ไขได้ และ Qty ถูกตั้งค่าเริ่มต้นจากจำนวนสั่งซื้อขั้นต่ำของบรรทัดนั้น

---

## TC-PO-060708 — From Price List — ล็อกหนึ่งใบหนึ่งสกุลเงิน
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ step 2 "Select Items" และตารางมีรายการที่อยู่คนละสกุลเงินกันอย่างน้อย 2 แถว (ดูรหัสสกุลเงินท้ายคอลัมน์ Unit Price)
**Steps**
1. ติ๊กแถวที่เป็นสกุลเงิน A
2. พยายามติ๊กแถวที่เป็นสกุลเงินอื่น
3. เอาการติ๊กทั้งหมดออก
**Expected**
หลังขั้นที่ 1 มีแถบเตือน "One currency per order..." ที่ระบุสกุลเงินที่ถูกล็อกไว้ และแถวสกุลอื่นถูกทำจาง + checkbox ถูก disable ติ๊กไม่ได้ในขั้นที่ 2 · หลังเอาการติ๊กออกหมดในขั้นที่ 3 แถบเตือนหายไปและทุกแถวกลับมาติ๊กได้อีกครั้ง

---

## TC-PO-060709 — From Price List — แถวที่ใช้ไม่ได้ถูกทำจางและติ๊กไม่ได้
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ step 2 "Select Items" ของผู้ขายที่มีบรรทัดรายการราคาซึ่งใช้กับใบสั่งซื้อนี้ไม่ได้ (backend ส่ง `can_use = false` มาที่ระดับใบหรือระดับบรรทัด) และยังไม่ได้ติ๊กแถวใดเลย
**Steps**
1. ดูข้อความเหนือตาราง
2. พยายามติ๊ก checkbox ของแถวที่ถูกทำจาง
**Expected**
เหนือตารางมีข้อความบอกครั้งเดียว "Items shown in grey cannot be selected because they are not available for this purchase order." (ไม่ติดป้ายซ้ำรายแถว) และ checkbox ของแถวนั้นถูก disable ติ๊กไม่ติด จำนวนสินค้าที่เลือกไม่เปลี่ยน

---

## TC-PO-060710 — From Price List — ปุ่ม Next ของ step 2 ปิดจนกว่าทุกแถวที่ติ๊กจะมีคลัง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ step 2 "Select Items" และมีรายการที่ติ๊กได้อย่างน้อย 2 แถวในสกุลเงินเดียวกัน
**Steps**
1. ติ๊กรายการ 2 แถว
2. สังเกตปุ่ม Next ตอนที่ยังไม่เลือก Location ให้แถวใดเลย
3. เลือก Location ให้แถวแรกแถวเดียว แล้วสังเกตปุ่ม Next
4. เลือก Location ให้แถวที่สองด้วย
**Expected**
ปุ่ม Next ถูก disable ในขั้นที่ 2 และขั้นที่ 3 (ยังมีแถวที่ยังไม่มีคลัง) และกดได้เฉพาะเมื่อทุกแถวที่ติ๊กมี Location ครบในขั้นที่ 4

---

## TC-PO-060711 — From Price List — ค้นสินค้าจนไม่เหลือแถว แสดงข้อความคนละชุดกับ "ไม่มีของ"
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ step 2 "Select Items" และตารางมีรายการอย่างน้อย 1 แถว
**Steps**
1. พิมพ์ข้อความที่ไม่ตรงกับสินค้าหรือเลขที่รายการราคาใดเลยลงช่อง "Search product by code or name…"
**Expected**
ตารางแสดง "No results match your search" พร้อมคำแนะนำให้ปรับเงื่อนไข — ต้อง **ไม่ใช่** ข้อความ "No items in active price lists" ซึ่งสงวนไว้สำหรับกรณีที่ผู้ขายรายนั้นไม่มีรายการราคาใช้งานอยู่ในวันส่งมอบที่เลือกจริง ๆ

---

## TC-PO-060712 — From Price List — ป้ายจำนวนสินค้าและยอดรวมขยับตามการติ๊ก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ step 2 "Select Items" และยังไม่ได้ติ๊กแถวใด
**Steps**
1. ดูป้ายมุมขวาบนของตารางตอนยังไม่ติ๊ก
2. ติ๊กรายการ 1 แถว
3. แก้จำนวนในช่อง Qty ของแถวนั้นให้มากขึ้น
**Expected**
ก่อนติ๊กป้ายอ่านว่า "No products" และยังไม่มีป้ายยอดรวม · หลังติ๊ก 1 แถวป้ายเปลี่ยนเป็น "1 product" และมีป้าย Total แสดงยอด · เมื่อเพิ่มจำนวนในขั้นที่ 3 ยอดในป้าย Total เพิ่มตาม

---

## TC-PO-060713 — From Price List — step 3 มีปุ่ม Edit พากลับไปแก้ step ต้นทาง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ผ่าน step 1 และ step 2 มาแล้ว (ติ๊กสินค้าและเลือกคลังครบ) และกด Next จนอยู่ที่ step 3 "Review & Confirm"
**Steps**
1. ดูโครงหน้าของ step 3
2. กดปุ่ม Edit ที่หัวข้อส่วน Vendor
3. กลับมาที่ step 3 อีกครั้ง แล้วกดปุ่ม Edit ที่หัวข้อส่วน Items
**Expected**
step 3 มีสามส่วนคือรายละเอียดคำสั่งซื้อ, Vendor และ Items แต่ละส่วนมีปุ่ม Edit ของตัวเอง · ปุ่ม Edit ของส่วน Vendor พากลับไป step 1 "Order & Vendor" · ปุ่ม Edit ของส่วน Items พากลับไป step 2 "Select Items" โดยค่าที่กรอกไว้ยังอยู่ครบ

---

## TC-PO-060714 — From Price List — ยอด Subtotal / Tax / Grand total ใน step 3
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ step 3 "Review & Confirm" โดยจดจำนวนและราคาต่อหน่วยของสินค้าที่เลือกไว้จาก step 2
**Steps**
1. ดูส่วน Items ของ step 3
**Expected**
ส่วน Items แสดงสินค้าที่เลือกครบทุกบรรทัดพร้อมคลังที่กำหนดไว้ และยอดสรุปสามค่า (Subtotal, Tax, Grand total) โดย Subtotal เท่ากับผลรวมของ จำนวน × ราคาต่อหน่วย ของทุกบรรทัด และ Grand total เท่ากับ Subtotal บวก Tax

---

## TC-PO-060715 — From Price List — Confirm สำเร็จแล้วเด้งเข้าใบที่เพิ่งสร้าง
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ step 3 "Review & Confirm" โดยกรอกครบทุก step แล้ว; **สร้างข้อมูลจริง** — จะได้ใบสั่งซื้อใหม่ 1 ใบทุกครั้งที่รัน
**Steps**
1. กดปุ่ม Confirm
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast "Purchase Order created successfully" และเบราว์เซอร์ถูกพาไปที่ `/procurement/purchase-order/<id>` ของใบที่เพิ่งสร้าง โดยหน้ารายละเอียดแสดงผู้ขาย วันส่งมอบ และรายการสินค้าตรงกับที่สรุปไว้ใน step 3 · กดปุ่ม Back ของเบราว์เซอร์แล้วต้องไม่ถูกเด้งกลับเข้า wizard พร้อม dialog ทิ้งงาน

---

## TC-PO-060716 — From Price List — กด Cancel ขณะกรอกค้าง ขึ้น dialog ยืนยันทิ้งงาน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/purchase-order/from-price-list` และกรอกข้อมูลไปแล้วอย่างน้อยหนึ่งช่อง (เช่นเลือก Workflow หรือ Delivery Date)
**Steps**
1. กดปุ่ม Cancel ที่แถบล่าง (หรือปุ่มลูกศรย้อนกลับที่มุมซ้ายบน)
**Expected**
ขึ้น dialog ถามยืนยันทิ้งการเปลี่ยนแปลง ("Discard changes?") และหน้ายังไม่ออกจาก wizard · เมื่อกดยืนยันทิ้งจึงกลับไปที่ `/procurement/purchase-order` และเมื่อกดยกเลิกใน dialog ค่าที่กรอกไว้ยังอยู่ครบ
