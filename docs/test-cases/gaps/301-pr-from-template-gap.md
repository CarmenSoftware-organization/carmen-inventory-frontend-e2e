# Purchase Request — From Template — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของเส้นทางนี้ — ส่วนที่ทดสอบจริงอยู่แล้วคือ `TC-PR-050301`–`TC-PR-050305` ใน `tests/302-pr-creator-journey.spec.ts` (describe "Step 3 — Create from Template") ซึ่งครอบ: เปิด dialog สร้าง → เลือกตัวเลือก From Template → หน้า picker ขึ้น, เดิน wizard จนถึง `/new` แล้วเห็นแถวสินค้าแถวแรก, แก้จำนวนบนฟอร์ม, Save as Draft แล้วได้ `/purchase-request/<id>`, และ empty-state ตอนไม่มีเทมเพลตเลย_

**Module:** Purchase Request — Create from Template
**Frontend route:** `routes/procurement/purchase-request/from-template/` (`from-template.route.tsx` → `from-template-content.tsx` → `template-card.tsx` / `qty-step.tsx`)  •  **URL:** `/procurement/purchase-request/from-template`
**Prefix:** `PR`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/302-pr-creator-journey.spec.ts` (TC-PR-0503xx) · `tests/301-pr.spec.ts` (โมดูลแม่) · `tests/310-pr-template.spec.ts` (ตัวเทมเพลตเอง, prefix `PRT`)
**Total test cases:** 25

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> - **ช่วง ID ที่เลือก: บล็อก `10` (`TC-PR-100001`–`TC-PR-100025`)** — `docs/test-id-scheme.md` ลงทะเบียนบล็อก `01–09, 10–13, 20–22, 30–39, 40–49, 60–63, 90` ให้ prefix `PR` ไว้ ปัจจุบันสเปกใช้ไปแล้ว 01–09, 11–13, 21–22, 31–35, 40–49, 60–63, 90 เหลือว่างคือ 10, 20, 30, 36–39 จึงเลือก **10** ซึ่งเป็นบล็อกว่างที่เลขต่ำสุดและอยู่ติดกับบล็อกสร้าง/วงจรชีวิตของใบขอซื้อ (01–09) ไม่ชนกับ ID ใดในสเปกทั้งสามไฟล์
> - ไฟล์นี้ **ไม่ใช่แคตตาล็อกโมดูล** เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง
> - **ข้อเท็จจริงของโค้ดที่คนแปลงเป็นสเปกต้องรู้ (ไม่ใช่บั๊ก — อย่าเขียน assert ว่า "พัง"):**
>   - เทมเพลตถูกส่งไปหน้า `/new` ทาง **router state** ไม่ใช่ query string (`from-template-content.tsx:53-62`) URL ปลายทางจึงเป็น `/procurement/purchase-request/new` เปล่า ๆ — ห้าม assert `template_id` ใน URL
>   - refresh หน้า `/new` แล้ว router state หาย → ได้ฟอร์มเปล่า เป็นพฤติกรรมที่ตั้งใจ (คอมเมนต์ที่ `pr-new-content.tsx:13-15`)
>   - `getDefaultValues` สาขาเทมเพลต (`pr-form-schema.ts:355-366`) **ไม่** คัดลอก `description` และ **ไม่มี** `department` ให้คัดลอกเลย (header ของ `PurchaseRequestTemplate` ไม่มีฟิลด์นี้) — Department บนหัวฟอร์มมาจาก default BU ของผู้ใช้ (`pr-form.tsx:177-183`)
>   - ฟอร์มที่มาจากเทมเพลตมี `workflowEditable === false` เสมอ (`pr-form.tsx:164-165`) → ไม่มี field ให้เลือก workflow มีแต่ชื่อ workflow บนแถบหัว
>   - ช่อง Requested คือ `InputSuffixQty` = `input[type=number]` `min=0` `step="any"` และ `capQtyDecimals` ตัดทศนิยมเหลือ 2 ตำแหน่ง (`input-suffix.tsx:160-181`, `qty-decimals.ts:13,22-34`)
>   - คอลัมน์ที่เรียงได้มีแค่ Location กับ Product ส่วน #, Requested, Currency, Delivery Point ตั้ง `enableSorting: false` (`qty-step.tsx:29-132`)
> - **Blocker ที่ยังไม่มีทางแก้ในสูทนี้:** `TC-PR-100025` ต้องใช้บัญชีที่ `can_create` ของทุก PR workflow เป็น false (`CreateWorkflowGate` + `useCreatableWorkflows`) ปัจจุบัน `tests/test-users.ts` ยังไม่มีบัญชีที่ยืนยันได้ว่าเข้าเงื่อนไขนี้ — ต้องเตรียม fixture ฝั่ง backend ก่อน ไม่งั้นเคสนี้จะกลายเป็น dynamic skip
> - **Blocker เรื่องข้อมูล:** เคสส่วนใหญ่ต้องมีเทมเพลต PR ในระบบ และหลายเคสต้องมีเทมเพลตที่มีรายการ **มากกว่า 3 แถว** (`TC-PR-100007`, `TC-PR-100019`) หรือ **อย่างน้อย 2 แถว** (`TC-PR-100012`, `TC-PR-100014`, `TC-PR-100016`) หรือมี **อย่างน้อย 2 เทมเพลต** (`TC-PR-100002`, `TC-PR-100018`) ควร seed ผ่าน `tests/310-pr-template.spec.ts` flow หรือ seeder ก่อน ไม่ใช่พึ่งข้อมูลที่บังเอิญมีอยู่

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PR-100001 | เปิดหน้าเลือกเทมเพลตด้วย deep link | Medium | Smoke |
| TC-PR-100002 | ค้นหาเทมเพลตด้วยชื่อ กรองทันทีขณะพิมพ์ | Medium | Functional |
| TC-PR-100003 | ค้นหาเทมเพลตด้วยชื่อ workflow | Low | Functional |
| TC-PR-100004 | ค้นหาแล้วไม่พบ แสดง empty state ของผลค้นหา | Medium | Edge Case |
| TC-PR-100005 | ล้างคำค้นแล้วการ์ดกลับมาครบ | Low | Alternate Flow |
| TC-PR-100006 | การ์ดเทมเพลตแสดง badge จำนวนและพรีวิวรายการ | Medium | Functional |
| TC-PR-100007 | การ์ดที่มีรายการเกิน 3 แสดง "+N more item(s)" | Low | Edge Case |
| TC-PR-100008 | ปุ่มย้อนกลับบนหน้าเลือกเทมเพลตกลับไปหน้ารายการ PR | Medium | Alternate Flow |
| TC-PR-100009 | ขั้นกรอกจำนวนแสดงหัวเรื่อง workflow · ชื่อเทมเพลต | Medium | Functional |
| TC-PR-100010 | ตารางขั้นกรอกจำนวนแสดงคอลัมน์ครบตามออกแบบ | Medium | Functional |
| TC-PR-100011 | ช่อง Requested ตั้งต้นด้วยจำนวนของเทมเพลตพร้อมหน่วย | High | Functional |
| TC-PR-100012 | ตั้งจำนวนแถวหนึ่งเป็น 0 แล้วตัวนับรายการลดลง | High | Functional |
| TC-PR-100013 | ตั้งทุกแถวเป็น 0 แล้วปุ่ม Next ถูกปิด | High | Negative |
| TC-PR-100014 | ล้างช่องจำนวนจนว่างถูกนับเป็น 0 | Medium | Edge Case |
| TC-PR-100015 | พิมพ์ทศนิยมเกิน 2 ตำแหน่งถูกตัดให้เหลือ 2 | Medium | Validation |
| TC-PR-100016 | เรียงลำดับได้เฉพาะคอลัมน์ Location และ Product | Low | Functional |
| TC-PR-100017 | ปุ่มย้อนกลับในขั้นกรอกจำนวนกลับไปหน้ารายการเทมเพลต | Medium | Alternate Flow |
| TC-PR-100018 | เปลี่ยนเทมเพลตแล้วจำนวนที่กรอกค้างไม่ตามมา | High | Edge Case |
| TC-PR-100019 | กด Next แล้วฟอร์มมีเฉพาะแถวที่จำนวนมากกว่า 0 | High | Functional |
| TC-PR-100020 | ฟอร์มจากเทมเพลตไม่คัดลอก Notes ของเทมเพลต | Medium | Functional |
| TC-PR-100021 | Department บนหัวฟอร์มมาจาก default BU ไม่ใช่เทมเพลต | Medium | Functional |
| TC-PR-100022 | Workflow บนฟอร์มจากเทมเพลตเป็นค่าอ่านอย่างเดียว | High | Functional |
| TC-PR-100023 | refresh หน้า /new หลังมาจากเทมเพลตได้ฟอร์มเปล่า | Low | Edge Case |
| TC-PR-100024 | ไม่มีเทมเพลตในระบบแล้วช่องค้นหาไม่แสดง | Low | Edge Case |
| TC-PR-100025 | ผู้ใช้ที่ไม่มี workflow PR ให้สร้างถูกบล็อกที่หน้านี้ | High | Authorization |

---

## TC-PR-100001 — เปิดหน้าเลือกเทมเพลตด้วย deep link
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`) active BU = BLAVG และมีสิทธิ์สร้างใบขอซื้ออย่างน้อยหนึ่ง workflow
**Steps**
1. ไปที่ URL `/procurement/purchase-request/from-template` โดยตรง (ไม่ผ่าน dialog สร้าง)
**Expected**
หน้าเลือกเทมเพลตแสดงผล: heading "Select Template" และคำอธิบาย "Choose a template to prefill your purchase request." โดย URL ยังคงเป็น `/procurement/purchase-request/from-template` ไม่ถูก redirect

---

## TC-PR-100002 — ค้นหาเทมเพลตด้วยชื่อ กรองทันทีขณะพิมพ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request/from-template` และมีเทมเพลตอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. จดชื่อเทมเพลตของการ์ดใบแรกและจำนวนการ์ดทั้งหมด
2. พิมพ์บางส่วนของชื่อเทมเพลตใบแรกลงในช่องค้นหา (ไม่ต้องกด Enter)
**Expected**
รายการการ์ดถูกกรองทันทีระหว่างพิมพ์ เหลือเฉพาะการ์ดที่ชื่อมีคำค้นนั้น และจำนวนการ์ดน้อยกว่าตอนก่อนพิมพ์

---

## TC-PR-100003 — ค้นหาเทมเพลตด้วยชื่อ workflow
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request/from-template` และมีเทมเพลตอย่างน้อย 1 รายการที่แสดงชื่อ workflow ใต้ชื่อเทมเพลต
**Steps**
1. จดชื่อ workflow ที่แสดงบนการ์ดใบแรก
2. พิมพ์บางส่วนของชื่อ workflow นั้นลงในช่องค้นหา
**Expected**
การ์ดที่ผูกกับ workflow นั้นยังคงแสดงอยู่ในผลการกรอง (ตัวกรองมองทั้งชื่อเทมเพลตและชื่อ workflow)

---

## TC-PR-100004 — ค้นหาแล้วไม่พบ แสดง empty state ของผลค้นหา
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-request/from-template` และมีเทมเพลตอย่างน้อย 1 รายการ
**Steps**
1. พิมพ์คำค้นที่ไม่มีทางตรงกับเทมเพลตใด เช่น `zzz-no-such-template`
**Expected**
ไม่มีการ์ดเทมเพลตเหลือ และแสดงกล่อง empty state หัวข้อ "No templates found" พร้อมคำอธิบาย "Try searching with different keywords" (คนละข้อความกับ "No Templates Available" ที่ใช้ตอนระบบไม่มีเทมเพลตเลย)

---

## TC-PR-100005 — ล้างคำค้นแล้วการ์ดกลับมาครบ
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต มีเทมเพลตอย่างน้อย 1 รายการ และพิมพ์คำค้นที่กรองการ์ดออกไปบางส่วนแล้ว
**Steps**
1. จดจำนวนการ์ดตอนยังไม่ได้ค้นหา
2. พิมพ์คำค้นลงช่องค้นหา
3. คลิกปุ่มล้างคำค้น (aria-label "Clear search")
**Expected**
ช่องค้นหาว่างเปล่า และจำนวนการ์ดกลับมาเท่ากับตอนยังไม่ได้ค้นหา

---

## TC-PR-100006 — การ์ดเทมเพลตแสดง badge จำนวนและพรีวิวรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต และมีเทมเพลตอย่างน้อย 1 รายการที่มีรายการสินค้าอย่างน้อย 1 แถว
**Steps**
1. ตรวจการ์ดเทมเพลตใบแรก
**Expected**
การ์ดแสดงชื่อเทมเพลต, badge ข้อความรูปแบบ "N item(s)" และกล่องพรีวิวที่มีรายการไม่เกิน 3 แถว แต่ละแถวประกอบด้วย product code (badge), ชื่อสินค้า และจำนวนพร้อมหน่วย

---

## TC-PR-100007 — การ์ดที่มีรายการเกิน 3 แสดง "+N more item(s)"
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต และมีเทมเพลตอย่างน้อย 1 รายการที่มีรายการสินค้ามากกว่า 3 แถว (badge บอกจำนวน > 3)
**Steps**
1. เลือกการ์ดที่ badge บอกจำนวนมากกว่า 3
2. นับจำนวนแถวพรีวิวในการ์ดนั้น
**Expected**
กล่องพรีวิวมีแถวสินค้าเพียง 3 แถว และมีบรรทัดท้ายกล่องข้อความรูปแบบ "+N more item(s)" โดย N = จำนวนรายการทั้งหมดลบ 3

---

## TC-PR-100008 — ปุ่มย้อนกลับบนหน้าเลือกเทมเพลตกลับไปหน้ารายการ PR
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/purchase-request/from-template`
**Steps**
1. คลิกปุ่มย้อนกลับที่หัวหน้า (ปุ่มไอคอน aria-label "Go back")
**Expected**
URL เปลี่ยนเป็น `/procurement/purchase-request` และหน้ารายการใบขอซื้อแสดงผล

---

## TC-PR-100009 — ขั้นกรอกจำนวนแสดงหัวเรื่อง workflow · ชื่อเทมเพลต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต และมีเทมเพลตอย่างน้อย 1 รายการที่มีชื่อ workflow แสดงบนการ์ด
**Steps**
1. จดชื่อ workflow และชื่อเทมเพลตบนการ์ดใบแรก
2. คลิกการ์ดใบนั้น
**Expected**
เข้าสู่ขั้นกรอกจำนวนในหน้าเดิม (URL ยังเป็น `/procurement/purchase-request/from-template`) หัวเรื่องแสดงชื่อ workflow ตามด้วยตัวคั่น `·` แล้วตามด้วยชื่อเทมเพลต และมีคำอธิบาย "Set the quantity for this round. Items left at 0 are not included."

---

## TC-PR-100010 — ตารางขั้นกรอกจำนวนแสดงคอลัมน์ครบตามออกแบบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการสินค้าอย่างน้อย 1 แถว
**Steps**
1. ตรวจแถวหัวตารางในขั้นกรอกจำนวน
**Expected**
หัวตารางแสดงคอลัมน์ `#`, Location, Product, Requested, Currency และ Delivery Point ตามลำดับ และจำนวนแถวข้อมูลเท่ากับจำนวนรายการของเทมเพลตที่เลือก

---

## TC-PR-100011 — ช่อง Requested ตั้งต้นด้วยจำนวนของเทมเพลตพร้อมหน่วย
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต และมีเทมเพลตที่รายการแถวแรกมีจำนวน (qty) มากกว่า 0 พร้อมหน่วย
**Steps**
1. จดจำนวนและหน่วยของรายการแถวแรกจากพรีวิวบนการ์ด
2. คลิกการ์ดเพื่อเข้าขั้นกรอกจำนวน
3. ตรวจช่อง Requested ของแถวแรก
**Expected**
ช่อง Requested ของแถวแรกมีค่าเท่ากับจำนวนที่เทมเพลตเก็บไว้ (ไม่ใช่ 0) เป็น `input[type=number]` ที่มี `min=0` และมี addon ด้านขวาแสดงชื่อหน่วยของแถวนั้น

---

## TC-PR-100012 — ตั้งจำนวนแถวหนึ่งเป็น 0 แล้วตัวนับรายการลดลง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการอย่างน้อย 2 แถว และทุกแถวมีจำนวนเริ่มต้นมากกว่า 0
**Steps**
1. จดตัวเลขบนบรรทัดตัวนับใต้ตาราง (รูปแบบ "N item(s)")
2. แก้ช่อง Requested ของแถวแรกเป็น `0`
**Expected**
บรรทัดตัวนับใต้ตารางลดลง 1 รายการ แถวนั้นยังคงแสดงอยู่ในตาราง และปุ่ม Next ยังกดได้

---

## TC-PR-100013 — ตั้งทุกแถวเป็น 0 แล้วปุ่ม Next ถูกปิด
**Priority:** High · **Test Type:** Negative
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการสินค้า และปุ่ม Next ยังกดได้อยู่
**Steps**
1. แก้ช่อง Requested ของทุกแถวให้เป็น `0`
**Expected**
บรรทัดตัวนับใต้ตารางแสดง "0 item(s)" และปุ่ม Next อยู่ในสถานะ disabled กดไม่ได้ (ไม่มีการนำทางไป `/new`)

---

## TC-PR-100014 — ล้างช่องจำนวนจนว่างถูกนับเป็น 0
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการอย่างน้อย 2 แถว ทุกแถวมีจำนวนมากกว่า 0
**Steps**
1. จดตัวเลขบนบรรทัดตัวนับใต้ตาราง
2. ล้างค่าในช่อง Requested ของแถวแรกให้ว่างเปล่า (ไม่พิมพ์เลขใหม่)
**Expected**
บรรทัดตัวนับลดลง 1 รายการเหมือนกรณีตั้งค่าเป็น 0 (ค่าว่างถูกตีเป็น 0) และไม่มีข้อความ error ปรากฏ

---

## TC-PR-100015 — พิมพ์ทศนิยมเกิน 2 ตำแหน่งถูกตัดให้เหลือ 2
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการสินค้าอย่างน้อย 1 แถว
**Steps**
1. ล้างช่อง Requested ของแถวแรก
2. พิมพ์ `2.555`
**Expected**
ค่าในช่องถูกตัดเหลือ `2.55` (ทศนิยมสูงสุด 2 ตำแหน่ง) และแถวนั้นยังถูกนับอยู่ในบรรทัดตัวนับใต้ตาราง

---

## TC-PR-100016 — เรียงลำดับได้เฉพาะคอลัมน์ Location และ Product
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการสินค้าอย่างน้อย 2 แถว ที่ชื่อสินค้าต่างกัน
**Steps**
1. จดลำดับชื่อสินค้าในคอลัมน์ Product
2. คลิกหัวคอลัมน์ Product เพื่อเรียงลำดับ
3. ตรวจหัวคอลัมน์ Currency และ Delivery Point ว่ามีปุ่มเรียงลำดับหรือไม่
**Expected**
ลำดับแถวในคอลัมน์ Product เปลี่ยนไปตามการเรียง (เรียงฝั่ง client ไม่มีการโหลดหน้าใหม่) ขณะที่หัวคอลัมน์ Currency, Delivery Point, Requested และ `#` ไม่มีตัวควบคุมการเรียงลำดับให้คลิก

---

## TC-PR-100017 — ปุ่มย้อนกลับในขั้นกรอกจำนวนกลับไปหน้ารายการเทมเพลต
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตใบใดใบหนึ่ง
**Steps**
1. คลิกปุ่มย้อนกลับที่หัวหน้าของขั้นกรอกจำนวน (ปุ่มไอคอน aria-label "Go back")
**Expected**
กลับมาที่รายการการ์ดเทมเพลตพร้อม heading "Select Template" โดย URL ยังคงเป็น `/procurement/purchase-request/from-template` (ไม่ออกไปหน้ารายการ PR)

---

## TC-PR-100018 — เปลี่ยนเทมเพลตแล้วจำนวนที่กรอกค้างไม่ตามมา
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้าเลือกเทมเพลต และมีเทมเพลตอย่างน้อย 2 รายการที่มีรายการสินค้า
**Steps**
1. คลิกเทมเพลตใบแรก แล้วแก้ช่อง Requested ของแถวแรกเป็นค่าที่จำง่าย เช่น `77`
2. คลิกปุ่มย้อนกลับกลับไปหน้ารายการเทมเพลต
3. คลิกเทมเพลตใบที่สอง
4. คลิกปุ่มย้อนกลับ แล้วคลิกเทมเพลตใบแรกอีกครั้ง
**Expected**
ขั้นกรอกจำนวนของเทมเพลตใบที่สองแสดงจำนวนตั้งต้นของเทมเพลตใบนั้นเอง (ไม่มีค่า `77` ปรากฏ) และเมื่อกลับเข้าเทมเพลตใบแรกอีกครั้ง ช่อง Requested แถวแรกกลับมาเป็นค่าตั้งต้นของเทมเพลตนั้น ไม่ใช่ `77` ที่เคยกรอกไว้

---

## TC-PR-100019 — กด Next แล้วฟอร์มมีเฉพาะแถวที่จำนวนมากกว่า 0
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ขั้นกรอกจำนวนของเทมเพลตที่มีรายการอย่างน้อย 3 แถว และทุกแถวมีจำนวนมากกว่า 0
**Steps**
1. จดจำนวนแถวทั้งหมดในตาราง
2. แก้ช่อง Requested ของแถวแรกเป็น `0`
3. ตรวจบรรทัดตัวนับใต้ตารางให้เหลือจำนวนทั้งหมดลบ 1
4. คลิกปุ่ม Next
**Expected**
นำทางไป `/procurement/purchase-request/new` และตารางรายการสินค้าบนฟอร์มมีจำนวนแถวเท่ากับตัวนับในขั้นก่อนหน้า (น้อยกว่าจำนวนแถวของเทมเพลตอยู่ 1 แถว) โดยไม่มีแถวของสินค้าที่ตั้งจำนวนเป็น 0

---

## TC-PR-100020 — ฟอร์มจากเทมเพลตไม่คัดลอก Notes ของเทมเพลต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีเทมเพลตที่กรอกคำอธิบาย (description) ของตัวเทมเพลตไว้ และเดิน wizard จนถึงหน้า `/procurement/purchase-request/new` แล้ว
**Steps**
1. เดิน wizard จากเทมเพลตนั้นจนกด Next เข้าหน้า `/new`
2. ตรวจช่อง Notes / Description บนหัวฟอร์ม
**Expected**
ช่อง Notes ของใบขอซื้อว่างเปล่า (คำอธิบายของตัวเทมเพลตไม่ถูกคัดลอกลงมา) และยังแก้ไขได้ ขณะที่ตารางรายการสินค้าถูกเติมจากเทมเพลตเรียบร้อย

---

## TC-PR-100021 — Department บนหัวฟอร์มมาจาก default BU ไม่ใช่เทมเพลต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น Admin active BU = BLAVG ที่มี default department และเดิน wizard จากเทมเพลตจนถึงหน้า `/new`
**Steps**
1. เดิน wizard จากเทมเพลตจนกด Next เข้าหน้า `/new`
2. ตรวจค่า Department บนแถบข้อมูลหัวฟอร์ม
**Expected**
Department แสดงชื่อแผนกจาก default BU ของผู้ใช้ที่ล็อกอิน (ไม่ว่าง และไม่ได้มาจากเทมเพลต ซึ่ง header ของเทมเพลตไม่มีฟิลด์นี้)

---

## TC-PR-100022 — Workflow บนฟอร์มจากเทมเพลตเป็นค่าอ่านอย่างเดียว
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีเทมเพลตที่ผูกกับ workflow และจดชื่อ workflow นั้นไว้แล้ว
**Steps**
1. เดิน wizard จากเทมเพลตนั้นจนกด Next เข้าหน้า `/procurement/purchase-request/new`
2. ตรวจส่วน Workflow บนแถบข้อมูลหัวฟอร์ม
**Expected**
แถบหัวฟอร์มแสดงชื่อ workflow ของเทมเพลตเป็นข้อความอ่านอย่างเดียว และไม่มีตัวเลือก (combobox/select) ให้เปลี่ยน workflow — ต่างจากใบขอซื้อที่สร้างจากฟอร์มเปล่า

---

## TC-PR-100023 — refresh หน้า /new หลังมาจากเทมเพลตได้ฟอร์มเปล่า
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เดิน wizard จากเทมเพลตจนอยู่ที่ `/procurement/purchase-request/new` โดยมีรายการสินค้าเติมไว้แล้ว และยังไม่ได้กดบันทึก
**Steps**
1. ยืนยันว่ามีรายการสินค้าอย่างน้อย 1 แถวบนฟอร์ม
2. refresh หน้าเบราว์เซอร์ (reload)
**Expected**
ฟอร์มสร้างใบขอซื้อยังแสดงอยู่ที่ URL เดิม แต่เป็นฟอร์มเปล่าไม่มีรายการสินค้าจากเทมเพลตเหลืออยู่ (เทมเพลตถูกส่งทาง router state ซึ่งไม่รอด reload ตามออกแบบ) และไม่มีหน้าจอ error

---

## TC-PR-100024 — ไม่มีเทมเพลตในระบบแล้วช่องค้นหาไม่แสดง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-request/from-template` ด้วย BU ที่ยังไม่มีเทมเพลต PR เลย
**Steps**
1. รอให้โหลดเสร็จ (สปินเนอร์หายไป)
2. ตรวจว่ามีช่องค้นหาบนหน้าหรือไม่
**Expected**
ช่องค้นหาไม่ถูกเรนเดอร์เลย และแสดงเฉพาะกล่อง empty state หัวข้อ "No Templates Available" พร้อมคำอธิบาย "Create a template to prefill your purchase request." (ตัวข้อความ empty state ถูกครอบแล้วโดย `TC-PR-050305` เคสนี้ครอบเฉพาะการซ่อนช่องค้นหา)

---

## TC-PR-100025 — ผู้ใช้ที่ไม่มี workflow PR ให้สร้างถูกบล็อกที่หน้านี้
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ทุก PR workflow ของ BU นั้นตั้ง `can_create` เป็น false (ต้องเตรียม fixture ก่อน — ดูหมายเหตุ blocker ด้านบน)
**Steps**
1. ไปที่ `/procurement/purchase-request/from-template` โดยตรง
**Expected**
ไม่เห็นรายการเทมเพลตเลย แต่เห็นกล่องแจ้งสิทธิ์ (`role="alert"`) หัวข้อ "Permission Denied" พร้อมคำอธิบาย "None of the approval flows let you start a purchase request."
