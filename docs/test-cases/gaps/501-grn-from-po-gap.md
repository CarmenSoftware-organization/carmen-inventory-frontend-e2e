# Goods Receive Note — Create from PO (wizard) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — ส่วนที่เหลือของ Goods Receive Note ถูกทดสอบจริงอยู่แล้วใน `tests/501-grn.spec.ts` (94 เคส) และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/501-grn.md`_

**Module:** Goods Receive Note → Create from Purchase Order (wizard 2 ขั้น)
**Frontend route:** `routes/procurement/goods-receive-note/from-po/`  •  **URL:** `/procurement/goods-receive-note/from-po`
**Prefix:** `GRN`  •  **Section block:** `04` (ช่วง `TC-GRN-040005`–`TC-GRN-040028`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/501-grn.spec.ts`
**Total test cases:** 24

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **1. ทำไมยังว่าง** — `docs/test-cases/COVERAGE.md` รายงานเส้นทาง `/procurement/goods-receive-note/from-po` ว่าไม่มีทั้งสเปกและแคตตาล็อก ตรวจซ้ำแล้วยืนยัน: `grep -n "from-po\|fromPo\|from po" tests/501-grn.spec.ts` ได้ **0 บรรทัด** — สเปก 94 เคสไม่เคยเข้าหน้านี้เลย
>
> **2. ทำไมเลือก section `04`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `GRN` ไว้แค่ `01–18, 90` และสเปกใช้ครบทุก section แล้ว จึงต้องหยิบ **ช่วงเลขที่ยังว่างภายใน section ที่ลงทะเบียนไว้** ไม่ใช่เปิด section ใหม่ (ไม่แก้ scheme) · section `04` คือบล็อก **“Create from Multiple POs”** (หัวข้อ `TC-GRN-900004`) ซึ่งตรงกับ wizard นี้ที่สุด — ขั้นที่ 2 ของมันเลือกใบสั่งซื้อได้ทีละหลายใบพร้อมกัน · section `04` ในสเปกใช้แค่ `040002`, `040003`, `040004` จึงเริ่มที่ **`040005`** ต่อเนื่องไปถึง `040028`
>
> **3. `TC-GRN-040001` ยังว่างแต่จงใจไม่หยิบ** — เป็นรูโหว่กลางบล็อกเดิมของสเปก ปล่อยไว้ให้สเปกเคลมคืนได้ ไม่เอามาปนกับชุดใหม่
>
> **4. เรื่องที่ “ไม่เขียนซ้ำ” เพราะมี ID เคลมไว้แล้ว** — **สกุลเงินไม่ตรงกันระหว่าง PO หลายใบ** (toast `mixedCurrencyError` = “Selected POs use different currencies…” ใน `from-po-content.tsx:handleConfirm`) ถูกเคลมไว้โดย **`TC-GRN-040002` Create GRN from Multiple POs - Invalid PO Selection** แล้ว จึงไม่เขียนซ้ำที่นี่ · ข้อควรรู้: เคสเดิมนั้นเขียน steps ไว้ที่ทางเข้าอื่น (`/procurement/purchase-order`) และ body เป็น stub — ถ้าจะแปลง ควร **อัปเดต `TC-GRN-040002` ให้มาใช้ทางเข้านี้** ไม่ใช่ตั้ง ID ใหม่ · เรื่องอื่นที่ section 03/04 เคลมไว้ (`030001`, `030003`, `030004`, `030005`, `040003`, `040004`) ก็เช่นกัน — ชื่อหัวข้อคลุมการสร้าง GRN จาก PO แต่ steps อ้างทางเข้าเก่าและไม่มี assertion จริง เคสในไฟล์นี้จึงเลี่ยงหัวข้อเหล่านั้นทั้งหมด (ไม่มีเคสไหนกดบันทึกเอกสาร)
>
> **5. ข้อเท็จจริงของหน้านี้ที่ผู้แปลงเป็นสเปกต้องรู้ (ไม่ใช่บั๊ก)**
> - หน้านี้ **ไม่สร้างเอกสารเอง** — กด Confirm แล้วมันเก็บของที่เลือกลง `sessionStorage` คีย์ `grn-wizard-data` แล้วพาไป `/procurement/goods-receive-note/new?doc_type=purchase_order` · การสร้างจริงเกิดที่ฟอร์มนั้น
> - `grn-form.tsx` **ล้างคีย์นั้นตอน unmount** แต่ไม่ล้างตอนรีเฟรชหน้า (ดู `useEffect` + `beforeunload`) — จึงรีเฟรชแล้วข้อมูลยังอยู่ แต่เดินออกแบบ SPA แล้วกลับเข้า `/new` ใหม่จะได้ฟอร์มว่าง
> - รายการที่หลังบ้านส่ง `can_use: false` มา **ยังแสดงอยู่แต่ติ๊กไม่ได้และจางลง** (`grn-po-usable.ts`) — ไม่ได้ซ่อน
> - ทุกเคสที่ไปถึงขั้น 2 **บล็อกด้วยข้อมูลหลังบ้าน**: ต้องมีผู้ขายที่มีใบสั่งซื้ออนุมัติแล้วและยังรับของไม่ครบ (`grn_status` = `open` หรือ `partial`) อยู่ใน BU = `BLAVG` มิฉะนั้นขั้น 1 จะขึ้น empty state และเดินต่อไม่ได้ · endpoint ที่ป้อนข้อมูลคือ `PURCHASE_ORDER_GRN_VENDORS(buCode)` และ `PURCHASE_ORDER_GRN_VENDOR(buCode, vendorId)`
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-GRN-040005 | เข้า wizard จาก dialog เลือกประเภทเอกสาร | High | Functional |
| TC-GRN-040006 | เปิด URL `/from-po` ตรง ๆ แล้วเริ่มที่ขั้นที่ 1 | Medium | Smoke |
| TC-GRN-040007 | ลูกศรย้อนกลับตอนยังไม่ได้เลือกอะไร | Medium | Alternate Flow |
| TC-GRN-040008 | ปุ่ม Cancel ตอนยังไม่ได้เลือกอะไร | Medium | Alternate Flow |
| TC-GRN-040009 | ปุ่ม Next ปิดอยู่จนกว่าจะเลือกผู้ขาย | High | Validation |
| TC-GRN-040010 | เลือกผู้ขายในขั้นที่ 1 | High | Happy Path |
| TC-GRN-040011 | ค้นหาผู้ขายกรองทันทีขณะพิมพ์ | Medium | Functional |
| TC-GRN-040012 | ค้นหาผู้ขายไม่พบ แสดง empty state | Medium | Edge Case |
| TC-GRN-040013 | เปลี่ยนผู้ขายแล้วรายการที่ติ๊กไว้ถูกล้าง | High | Edge Case |
| TC-GRN-040014 | ไปขั้นที่ 2 แล้วเห็นใบสั่งซื้อของผู้ขายที่เลือก | High | Happy Path |
| TC-GRN-040015 | ปุ่ม Confirm ปิดอยู่จนกว่าจะติ๊กรายการ | High | Validation |
| TC-GRN-040016 | ติ๊กที่หัวใบสั่งซื้อเลือกทุกบรรทัดในใบนั้น | High | Functional |
| TC-GRN-040017 | Select all และล้างทั้งหมด | Medium | Functional |
| TC-GRN-040018 | ติ๊กบางบรรทัดทำให้ checkbox ระดับใบเป็น indeterminate | Medium | Edge Case |
| TC-GRN-040019 | แถวใบสั่งซื้อแสดงสถานะ ยอดรวม และสกุลเงิน | Medium | Functional |
| TC-GRN-040020 | บรรทัดสินค้าแสดงคลังที่ของจะเข้า | Medium | Functional |
| TC-GRN-040021 | ผู้ขายที่ไม่มีใบสั่งซื้อให้รับ แสดง empty state | Low | Edge Case |
| TC-GRN-040022 | ปุ่ม Back กลับขั้นที่ 1 โดยยังจำค่าที่เลือกไว้ | Medium | Alternate Flow |
| TC-GRN-040023 | กด stepper ข้ามไปขั้นที่ 2 ก่อนเลือกผู้ขายไม่ได้ | Medium | Validation |
| TC-GRN-040024 | Cancel ขณะมีของค้าง แล้วกด Keep editing | High | Alternate Flow |
| TC-GRN-040025 | Cancel ขณะมีของค้าง แล้วกด Discard | Medium | Alternate Flow |
| TC-GRN-040026 | Confirm แล้วไปต่อที่ฟอร์มใบรับสินค้าพร้อมข้อมูลจาก PO | High | Happy Path |
| TC-GRN-040027 | รีเฟรชหน้าฟอร์มหลัง Confirm ข้อมูลยังอยู่ | Medium | Edge Case |
| TC-GRN-040028 | ผู้ใช้ที่ไม่มีสิทธิ์สร้างใบรับสินค้าเปิด `/from-po` | High | Authorization |

---

## TC-GRN-040005 — เข้า wizard จาก dialog เลือกประเภทเอกสาร
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`) BU = `BLAVG` และอยู่ที่ `/procurement/goods-receive-note`
**Steps**
1. กดปุ่มเพิ่มเอกสาร (`New Goods Receive Note`)
2. ใน dialog `Select Document Type` กดการ์ด `Purchase Order` (คำบรรยาย `Receive from approved PO`)
**Expected**
dialog ปิด และ URL เปลี่ยนเป็น `/procurement/goods-receive-note/from-po` โดยหน้าแสดงหัวข้อ `From Purchase Order` พร้อมคำอธิบาย `Receive goods against purchase orders that are still open.` และแถบ stepper 2 ขั้น (`Select Vendor`, `Select Purchase Orders`) โดยขั้นที่ 1 ทำงานอยู่

---

## TC-GRN-040006 — เปิด URL `/from-po` ตรง ๆ แล้วเริ่มที่ขั้นที่ 1
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
Login เป็น Admin BU = `BLAVG`
**Steps**
1. ไปที่ `/procurement/goods-receive-note/from-po` โดยตรง
**Expected**
หน้าโหลดสำเร็จ (ไม่ redirect ออก) แสดงหัวข้อ `From Purchase Order`, stepper อยู่ที่ขั้นที่ 1 `Select Vendor`, ช่องค้นหาผู้ขายปรากฏ และแถบท้ายหน้ามีปุ่ม `Cancel` กับ `Next` เท่านั้น (ยังไม่มี `Back` และ `Confirm`)

---

## TC-GRN-040007 — ลูกศรย้อนกลับตอนยังไม่ได้เลือกอะไร
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` และยังไม่ได้เลือกผู้ขายหรือติ๊กรายการใด
**Steps**
1. กดปุ่มลูกศรย้อนกลับมุมบนซ้าย (aria-label `Go back`)
**Expected**
กลับไปที่ `/procurement/goods-receive-note` ทันทีโดย **ไม่มี** dialog `Discard changes?` ขึ้นมาถาม

---

## TC-GRN-040008 — ปุ่ม Cancel ตอนยังไม่ได้เลือกอะไร
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` และยังไม่ได้เลือกผู้ขายหรือติ๊กรายการใด
**Steps**
1. กดปุ่ม `Cancel` ที่แถบท้ายหน้า
**Expected**
กลับไปที่ `/procurement/goods-receive-note` ทันทีโดยไม่มี dialog ยืนยันการทิ้งงาน

---

## TC-GRN-040009 — ปุ่ม Next ปิดอยู่จนกว่าจะเลือกผู้ขาย
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` ขั้นที่ 1 และยังไม่ได้เลือกผู้ขาย
**Steps**
1. ดูปุ่ม `Next` ที่แถบท้ายหน้า
2. เลือกผู้ขายรายหนึ่งในรายการ
3. ดูปุ่ม `Next` อีกครั้ง
**Expected**
ก่อนเลือกผู้ขายปุ่ม `Next` อยู่ในสถานะ disabled และ stepper ยังอยู่ขั้นที่ 1 · หลังเลือกผู้ขายแล้วปุ่ม `Next` กดได้

---

## TC-GRN-040010 — เลือกผู้ขายในขั้นที่ 1
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีผู้ขายอย่างน้อย 1 รายที่มีใบสั่งซื้ออนุมัติแล้วและยังรับของไม่ครบใน BU = `BLAVG`
**Steps**
1. ไปที่ `/procurement/goods-receive-note/from-po`
2. รอรายการผู้ขายโหลดเสร็จ (skeleton หายไป)
3. คลิกที่แถวผู้ขายรายแรก
**Expected**
radio ของแถวนั้นถูกเลือก แถวถูกไฮไลต์ และแถวแสดงครบสามส่วน: badge รหัสผู้ขาย, ชื่อผู้ขายตัวหนา และจำนวนใบสั่งซื้อในรูป `N PO(s)` ทางขวาสุด · ปุ่ม `Next` กดได้

---

## TC-GRN-040011 — ค้นหาผู้ขายกรองทันทีขณะพิมพ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นที่ 1 และมีผู้ขายมากกว่า 1 รายในรายการ
**Steps**
1. จดชื่อหรือรหัสของผู้ขายรายหนึ่งไว้
2. พิมพ์ข้อความบางส่วนของรหัสผู้ขายลงในช่องค้นหา โดย **ไม่กด Enter**
**Expected**
รายการถูกกรองทันทีตั้งแต่พิมพ์ เหลือเฉพาะผู้ขายที่ชื่อหรือรหัสมีข้อความนั้น (ไม่สนตัวพิมพ์เล็กใหญ่) — ต่างจากช่องค้นหาที่อื่นในแอปที่ต้องกด Enter ก่อน

---

## TC-GRN-040012 — ค้นหาผู้ขายไม่พบ แสดง empty state
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ขั้นที่ 1 และรายการผู้ขายโหลดเสร็จแล้ว
**Steps**
1. พิมพ์ข้อความที่ไม่ตรงกับผู้ขายรายใดเลยลงในช่องค้นหา (เช่น `zzz-no-such-vendor`)
**Expected**
รายการว่าง และแสดง empty state หัวข้อ `No Vendors` พร้อมคำอธิบาย `No vendors with available purchase orders.` · ปุ่ม `Next` ยังคง disabled

---

## TC-GRN-040013 — เปลี่ยนผู้ขายแล้วรายการที่ติ๊กไว้ถูกล้าง
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
มีผู้ขายอย่างน้อย 2 รายที่มีใบสั่งซื้อให้รับใน BU = `BLAVG`
**Steps**
1. ไปที่ `/procurement/goods-receive-note/from-po` แล้วเลือกผู้ขายรายที่ 1
2. กด `Next` แล้วติ๊กรายการอย่างน้อย 1 บรรทัด (สังเกต badge `N selected` ที่หัวหน้า)
3. กด `Back` กลับขั้นที่ 1
4. เลือกผู้ขายรายที่ 2
5. กด `Next`
**Expected**
badge `N selected` ที่หัวหน้าหายไปหลังเปลี่ยนผู้ขาย และในขั้นที่ 2 ไม่มี checkbox ใดถูกติ๊กค้างไว้ — รายการที่ติ๊กของผู้ขายรายเดิมถูกล้างทั้งหมด · ปุ่ม `Confirm` กลับไป disabled

---

## TC-GRN-040014 — ไปขั้นที่ 2 แล้วเห็นใบสั่งซื้อของผู้ขายที่เลือก
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เลือกผู้ขายที่มีใบสั่งซื้ออนุมัติแล้วและยังรับของไม่ครบ อยู่ที่ขั้นที่ 1
**Steps**
1. กดปุ่ม `Next`
2. รอรายการใบสั่งซื้อโหลดเสร็จ (spinner หายไป)
**Expected**
stepper ย้ายมาขั้นที่ 2 `Select Purchase Orders` และขั้นที่ 1 ขึ้นเครื่องหมายถูก · รายการแสดงแถบ `Select all` ด้านบน ตามด้วยหัวคอลัมน์ `PRODUCT` / `QUANTITY` / `UNIT` / `PRICE` / `AMOUNT` และใบสั่งซื้ออย่างน้อย 1 ใบ · แถบท้ายหน้าเปลี่ยนเป็น `Cancel` / `Back` / `Confirm`

---

## TC-GRN-040015 — ปุ่ม Confirm ปิดอยู่จนกว่าจะติ๊กรายการ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ขั้นที่ 2 และยังไม่ได้ติ๊กรายการใด
**Steps**
1. ดูปุ่ม `Confirm` ที่แถบท้ายหน้า
2. ติ๊ก checkbox ของบรรทัดสินค้าหนึ่งบรรทัด
3. ดูปุ่ม `Confirm` อีกครั้ง
**Expected**
ก่อนติ๊กปุ่ม `Confirm` อยู่ในสถานะ disabled · หลังติ๊กแล้วปุ่มกดได้ และ badge `1 selected` ปรากฏที่หัวหน้าและที่แถบ `Select all`

---

## TC-GRN-040016 — ติ๊กที่หัวใบสั่งซื้อเลือกทุกบรรทัดในใบนั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นที่ 2 และมีใบสั่งซื้ออย่างน้อย 1 ใบที่มีบรรทัดสินค้าที่ติ๊กได้ตั้งแต่ 2 บรรทัดขึ้นไป
**Steps**
1. ติ๊ก checkbox ที่แถวหัวใบสั่งซื้อ (แถวที่แสดงเลขที่ PO)
2. ดู checkbox ของบรรทัดสินค้าทุกบรรทัดใต้ใบนั้น
3. ติ๊กที่หัวใบเดิมซ้ำอีกครั้ง
**Expected**
ครั้งแรก: บรรทัดสินค้าที่ติ๊กได้ทุกบรรทัดในใบนั้นถูกติ๊ก และ badge นับจำนวนตรงกับจำนวนบรรทัดที่ถูกติ๊ก · ครั้งที่สอง: บรรทัดทั้งหมดในใบนั้นถูกยกเลิกการติ๊ก และ badge หายไป (ถ้าไม่มีใบอื่นถูกติ๊กอยู่)

---

## TC-GRN-040017 — Select all และล้างทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นที่ 2 และมีใบสั่งซื้อที่มีบรรทัดติ๊กได้อย่างน้อย 1 ใบ
**Steps**
1. อ่านจำนวนรายการทั้งหมดจากข้อความใต้ `Select all` (รูปแบบ `N PO(s) · M items`)
2. ติ๊ก checkbox `Select all`
3. ติ๊ก `Select all` ซ้ำอีกครั้ง
**Expected**
ครั้งแรก: badge เปลี่ยนเป็น `M selected` โดย `M` ตรงกับจำนวนรายการที่ประกาศไว้ และ checkbox ของทุกใบเป็นสถานะติ๊กเต็ม · ครั้งที่สอง: badge หายไปและ checkbox ทั้งหมดถูกล้าง ปุ่ม `Confirm` กลับไป disabled

---

## TC-GRN-040018 — ติ๊กบางบรรทัดทำให้ checkbox ระดับใบเป็น indeterminate
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ขั้นที่ 2 และมีใบสั่งซื้อที่มีบรรทัดติ๊กได้ตั้งแต่ 2 บรรทัดขึ้นไป
**Steps**
1. ติ๊ก checkbox ของบรรทัดสินค้าเพียง 1 บรรทัดในใบนั้น
**Expected**
checkbox ที่หัวใบสั่งซื้อแสดงสถานะกึ่งกลาง (indeterminate) ไม่ใช่ติ๊กเต็มและไม่ใช่ว่าง · checkbox `Select all` ด้านบนก็แสดงสถานะกึ่งกลางเช่นกัน

---

## TC-GRN-040019 — แถวใบสั่งซื้อแสดงสถานะ ยอดรวม และสกุลเงิน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นที่ 2 และมีใบสั่งซื้ออย่างน้อย 1 ใบ
**Steps**
1. ดูแถวหัวของใบสั่งซื้อใบแรก
**Expected**
แถวแสดงเลขที่ใบสั่งซื้อ, badge สถานะที่เป็น `OPEN` หรือ `PARTIAL` อย่างใดอย่างหนึ่ง, วันที่สั่งซื้อตามรูปแบบวันที่ของโปรไฟล์ผู้ใช้ และยอดรวมของใบพร้อมรหัสสกุลเงินต่อท้ายทางขวาสุด

---

## TC-GRN-040020 — บรรทัดสินค้าแสดงคลังที่ของจะเข้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นที่ 2 และมีบรรทัดสินค้าที่ผูกคลังไว้อย่างน้อย 1 บรรทัด
**Steps**
1. ดูใต้บรรทัดสินค้าที่ผูกคลังไว้
**Expected**
มีแถวย่อยของคลังอย่างน้อย 1 แถว แต่ละแถวประกอบด้วยไอคอนที่มี aria-label `Location`, ชื่อคลังพร้อมรหัสคลังเป็นบรรทัดรอง, ป้ายประเภทคลัง และจำนวนที่จะรับพร้อมป้าย `RECEIVED` และหน่วยสั่งซื้อ · บรรทัดสินค้าเองแสดงชื่อสินค้าพร้อมชื่อท้องถิ่นเป็นบรรทัดรอง และตัวเลขเรียงใต้หัวคอลัมน์ `QUANTITY` / `UNIT` / `PRICE` / `AMOUNT`

---

## TC-GRN-040021 — ผู้ขายที่ไม่มีใบสั่งซื้อให้รับ แสดง empty state
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มีผู้ขายที่รายการใบสั่งซื้อสำหรับรับของว่างเปล่า (ต้องเตรียมข้อมูลหลังบ้าน — ดูหมายเหตุข้อ 5)
**Steps**
1. ไปที่ `/procurement/goods-receive-note/from-po`
2. เลือกผู้ขายรายนั้น แล้วกด `Next`
3. รอ spinner หายไป
**Expected**
ขั้นที่ 2 แสดง empty state หัวข้อ `No Purchase Orders` พร้อมคำอธิบาย `No approved purchase orders available for receiving.` ในกรอบเส้นประ · ปุ่ม `Confirm` อยู่ในสถานะ disabled

---

## TC-GRN-040022 — ปุ่ม Back กลับขั้นที่ 1 โดยยังจำค่าที่เลือกไว้
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ขั้นที่ 2 หลังเลือกผู้ขายและติ๊กรายการไว้อย่างน้อย 1 บรรทัด
**Steps**
1. กดปุ่ม `Back` ที่แถบท้ายหน้า
2. กดปุ่ม `Next` กลับมาขั้นที่ 2 อีกครั้ง
**Expected**
ขั้นที่ 1 กลับมาแสดงโดยผู้ขายรายเดิมยังถูกเลือกอยู่ และ badge `N selected` ที่หัวหน้ายังคงอยู่ · เมื่อกลับมาขั้นที่ 2 รายการที่ติ๊กไว้ยังถูกติ๊กเหมือนเดิม

---

## TC-GRN-040023 — กด stepper ข้ามไปขั้นที่ 2 ก่อนเลือกผู้ขายไม่ได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` ขั้นที่ 1 และยังไม่ได้เลือกผู้ขาย
**Steps**
1. คลิกที่หัวขั้นที่ 2 (`Select Purchase Orders`) บนแถบ stepper
**Expected**
หน้ายังอยู่ที่ขั้นที่ 1 — ช่องค้นหาผู้ขายและรายการผู้ขายยังแสดงอยู่ และแถบท้ายหน้ายังมีปุ่ม `Next` (ไม่ใช่ `Confirm`)

---

## TC-GRN-040024 — Cancel ขณะมีของค้าง แล้วกด Keep editing
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` และเลือกผู้ขายไว้แล้ว (ถือเป็นของค้างตั้งแต่เลือกผู้ขาย ไม่ต้องรอติ๊กรายการ)
**Steps**
1. กดปุ่ม `Cancel` ที่แถบท้ายหน้า
2. ใน dialog ที่ขึ้นมา กดปุ่ม `Keep editing`
**Expected**
ขั้นที่ 1 กด `Cancel` แล้วมี alert dialog หัวข้อ `Discard changes?` พร้อมคำอธิบาย `You have unsaved changes that will be lost.` และปุ่ม `Keep editing` / `Discard` · หลังกด `Keep editing` dialog ปิด URL ยังเป็น `/procurement/goods-receive-note/from-po` และผู้ขายที่เลือกไว้ยังถูกเลือกอยู่

---

## TC-GRN-040025 — Cancel ขณะมีของค้าง แล้วกด Discard
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/from-po` และเลือกผู้ขายไว้แล้ว
**Steps**
1. กดปุ่ม `Cancel`
2. ใน dialog `Discard changes?` กดปุ่ม `Discard`
**Expected**
dialog ปิดและ URL เปลี่ยนเป็น `/procurement/goods-receive-note` โดยหน้ารายการใบรับสินค้าแสดงตามปกติ และไม่มีเอกสารใหม่ถูกสร้าง

---

## TC-GRN-040026 — Confirm แล้วไปต่อที่ฟอร์มใบรับสินค้าพร้อมข้อมูลจาก PO
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ขั้นที่ 2 หลังเลือกผู้ขายที่มีใบสั่งซื้อให้รับ และจดชื่อผู้ขาย / รหัสสกุลเงิน / จำนวนบรรทัดที่จะติ๊กไว้แล้ว
**Steps**
1. ติ๊กรายการสินค้าจากใบสั่งซื้อใบเดียว (สกุลเงินเดียวกัน) อย่างน้อย 1 บรรทัด
2. กดปุ่ม `Confirm`
**Expected**
URL เปลี่ยนเป็น `/procurement/goods-receive-note/new?doc_type=purchase_order` และฟอร์มใบรับสินค้าใหม่เปิดขึ้นโดยเติมค่ามาให้แล้ว: ชื่อผู้ขายตรงกับที่เลือกในขั้นที่ 1, สกุลเงินตรงกับสกุลเงินของใบสั่งซื้อที่เลือก และตารางรายการสินค้ามีแถวอย่างน้อยเท่ากับจำนวนคลังของบรรทัดที่ติ๊กไว้ (หนึ่งคลัง = หนึ่งแถว) · ยังไม่มีการบันทึกเอกสาร — กดออกจากหน้านี้ได้โดยไม่สร้างข้อมูล

---

## TC-GRN-040027 — รีเฟรชหน้าฟอร์มหลัง Confirm ข้อมูลยังอยู่
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เพิ่งกด `Confirm` จาก wizard จนมาถึง `/procurement/goods-receive-note/new?doc_type=purchase_order` และฟอร์มมีข้อมูลจากใบสั่งซื้ออยู่
**Steps**
1. จดชื่อผู้ขายและจำนวนแถวในตารางรายการสินค้าไว้
2. รีโหลดหน้าเบราว์เซอร์ที่ URL เดิม
**Expected**
หลังรีโหลด ฟอร์มยังคงมีชื่อผู้ขายและจำนวนแถวสินค้าเท่าเดิม — ข้อมูลที่ wizard ส่งต่อมาอยู่รอดจากการรีเฟรช (ออกแบบไว้ใน `grn-form.tsx` โดยเก็บใน sessionStorage และล้างเฉพาะตอนออกจากหน้าแบบ SPA)

---

## TC-GRN-040028 — ผู้ใช้ที่ไม่มีสิทธิ์สร้างใบรับสินค้าเปิด `/from-po`
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์สร้างใบรับสินค้า (เช่น role ที่ปุ่มเพิ่มเอกสารบนหน้ารายการไม่ปรากฏ)
**Steps**
1. ไปที่ `/procurement/goods-receive-note/from-po` โดยพิมพ์ URL ตรง ๆ
**Expected**
ผู้ใช้เข้าไม่ถึงหน้าสร้าง — ถูก redirect ออกจาก `/from-po` หรือเห็นหน้าปฏิเสธสิทธิ์ โดยไม่เห็นรายชื่อผู้ขายและใบสั่งซื้อของ BU นั้น
