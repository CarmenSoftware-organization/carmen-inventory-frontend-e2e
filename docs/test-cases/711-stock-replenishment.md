# Stock Replenishment — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/store-operation/stock-replenishment`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Stock Replenishment
**Frontend route:** `routes/store-operation/stock-replenishment`  •  **URL:** `/store-operation/stock-replenishment`
**Prefix:** `SRPL`
**Default role:** Store Manager (storemanager@blueledgers.com, active BU = BLAVG)
**Total test cases:** 36

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> - **Blocker หลัก — ต้องมีข้อมูลสต็อกที่ถึงจุดสั่งซื้อจริงใน BU BLAVG ก่อน** หน้าจึงจะมีแถว location ให้ทดสอบ ข้อมูลมาจาก `GET /api/{bu}/stock-replenishments` ตรง ๆ (`useStockReplenishment`) ไม่มี mock แล้ว และไม่มีปุ่มสร้างข้อมูลในหน้านี้ ถ้า backend คืน array ว่าง หน้าจะแสดงแถบสรุปที่เป็น 0 ทุกค่าโดย **ไม่มีข้อความ empty state เฉพาะ** (ดู TC-SRPL-900001)
> - **โมดูลนี้เป็นหน้าอ่านอย่างเดียว ไม่มี create/edit/delete เอกสารของตัวเอง** ปลายทางเดียวที่เขียนข้อมูลคือ wizard สร้าง PR/SR
> - **เคสที่กด Create จริง (TC-SRPL-300001/300002/300003) จะสร้างเอกสาร PR/SR จริงในระบบและถอนไม่ได้** — ไม่มี endpoint ยกเลิกในฝั่งนี้ และ `handleSubmit` ของ PR ยิงทีละคลังตามลำดับ ถ้าพังกลางทางใบที่สร้างไปแล้วยังอยู่ ให้รันบนสภาพแวดล้อมที่ยอมรับข้อมูลทดสอบค้างได้
> - **Create PR / Create SR ผูกกับ "มี workflow ที่เริ่มได้" ไม่ใช่ permission ใน catalog** (`useCreatableWorkflows(WORKFLOW_TYPE.PR|SR)` → `can_create !== false`) ถ้าบัญชีทดสอบไม่มี workflow ที่เริ่มได้ ปุ่มจะจางลงแต่ **ยังกดได้จริง** (เป็น `aria-disabled` ไม่ใช่ `disabled` — Playwright คลิกผ่าน) แล้วเด้ง permission-denied dialog แทนที่จะเปิด wizard ดู TC-SRPL-900003
> - **สิทธิ์เข้าหน้า** ถูกบังคับที่ `RouteGuard` (ใน `routes/root-layout.tsx`) จาก `moduleList` leaf: license `store_operations.stock_replenishment` และ permission `inventory_management.stock_in.view` — license ตรวจก่อน permission และ **admin bypass ได้เฉพาะ permission ไม่ bypass license** ถ้าบัญชี Store Manager ไม่มี `stock_in.view` จะเจอ AccessDeniedBlock ให้สลับไปใช้ Admin (admin@blueledgers.com) เป็น default role ของรอบทดสอบแทน
> - **ช่องค้นหายิงเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น** (`SearchInput` → `onSearch`) พิมพ์เฉย ๆ ไม่กรอง — อย่าเขียนสเปกที่คาดหวัง debounce
> - **ชุดคอลัมน์ตัวเลขเปลี่ยนไปแล้ว** จาก current/par level/need เดิม เป็น On Hand / Min / Max / Par / Reorder ตาม field จริงของ API (`on_hand_qty`, `min_qty`, `max_qty`, `par_qty`, `reorder_qty`) — catalog รอบนี้แก้ให้ตรงแล้ว
> - **select-all ย้ายที่** จากหัวตารางไปอยู่บนแถบหัว location (checkbox ซ้ายสุดของแถบ) หัวคอลัมน์ select ในตารางเป็นช่องว่างโดยตั้งใจ
> - Expand all / Collapse all เป็น **ปุ่มเดียวที่สลับป้าย** ตามสถานะ ไม่ใช่สองปุ่ม
> - ยังไม่มี Playwright spec สำหรับโมดูลนี้ มีแต่ unit test ฝั่งแอป (`stock-repl-location.test.tsx` 3 เคสเรื่อง selection)

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SRPL-010001 | หน้า Stock Replenishment โหลดสำเร็จ | High | Smoke |
| TC-SRPL-010002 | แถบสรุป (locations/items/critical/warning/low/Total reorder) แสดงครบ | High | Functional |
| TC-SRPL-010003 | แถบหัว location แสดง checkbox + รหัส/ชื่อคลัง + badge จำนวนและสถานะ | Medium | Functional |
| TC-SRPL-010004 | ขยาย/ยุบ location เดี่ยวได้ | Medium | Functional |
| TC-SRPL-010005 | ปุ่มสลับ Expand all / Collapse all ทำงาน | Medium | Functional |
| TC-SRPL-010006 | คอลัมน์ตารางสินค้า (select/#/Product/Category/Sub Category/Item Group/On Hand/Min/Max/Par/Reorder/Status) แสดงครบ | Medium | Functional |
| TC-SRPL-010007 | ค้นหาด้วยชื่อ/รหัส/ชื่อท้องถิ่น/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้ | Medium | Functional |
| TC-SRPL-010008 | ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ | Medium | Functional |
| TC-SRPL-010009 | ปุ่ม Refresh โหลดข้อมูลใหม่ | Low | Functional |
| TC-SRPL-010010 | ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ | Low | Functional |
| TC-SRPL-010050 | active BU = BLAVG | High | Smoke |
| TC-SRPL-020001 | badge สถานะสินค้า (Critical/Warning/Low) แสดงโทนถูกต้อง | Medium | Functional |
| TC-SRPL-020002 | คอลัมน์ Reorder แสดง reorder_qty ตัวหนา และผลรวมตรงกับ Total reorder | Medium | Functional |
| TC-SRPL-020003 | คอลัมน์ Product แสดงชื่อท้องถิ่นเป็นบรรทัดรอง | Low | Functional |
| TC-SRPL-060001 | เลือกสินค้าในแถวเดียวด้วย checkbox ได้ | High | Functional |
| TC-SRPL-060002 | เลือกทั้งหมดใน location ด้วย checkbox บนแถบหัว location | Medium | Functional |
| TC-SRPL-060003 | checkbox แถบหัว location แสดงสถานะ indeterminate เมื่อเลือกบางส่วน | Medium | Functional |
| TC-SRPL-060004 | เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง | Medium | Functional |
| TC-SRPL-060005 | ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก | High | Functional |
| TC-SRPL-060006 | ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป | Medium | Functional |
| TC-SRPL-060007 | กด Create PR เปิด wizard พร้อมตารางรายการที่ติ๊ก | High | Functional |
| TC-SRPL-060008 | ปุ่ม Create ใน PR wizard ปิดจนกว่าจะเลือก workflow + หน่วย + จำนวน > 0 | High | Validation |
| TC-SRPL-060009 | ตัดแถวออกจาก PR wizard ด้วยปุ่มถังขยะ | Medium | Functional |
| TC-SRPL-060010 | กด Create SR (ติ๊กคลังเดียว) เปิด wizard พร้อม Workflow / Request From / Deliver To | High | Functional |
| TC-SRPL-060011 | ช่อง Request From ของ SR wizard ไม่มีคลังปลายทางให้เลือก | Medium | Functional |
| TC-SRPL-060012 | ปิด wizard ด้วย Cancel แล้วไม่มีเอกสารเกิดขึ้นและรายการที่ติ๊กยังอยู่ | Medium | Functional |
| TC-SRPL-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ ต้องเจอ Access Denied | High | Authorization |
| TC-SRPL-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SRPL-100003 | Admin เข้าหน้าได้แม้ไม่มี permission ตรง ๆ | Medium | Authorization |
| TC-SRPL-300001 | Create PR สร้างใบขอซื้อจากรายการที่เลือกได้สำเร็จ | High | Integration |
| TC-SRPL-300002 | Create SR สร้างใบเบิกจากรายการที่เลือกได้สำเร็จ | High | Integration |
| TC-SRPL-300003 | ติ๊กข้ามหลายคลังแล้ว Create PR ได้ใบขอซื้อคลังละใบ | High | Integration |
| TC-SRPL-900001 | กรณีไม่มีสินค้าต้องเติม / empty state | Low | Edge Case |
| TC-SRPL-900002 | กด Create SR ขณะติ๊กข้าม 2 คลังขึ้นไป ต้องเตือนว่าใบเบิกทำได้ทีละคลัง | High | Edge Case |
| TC-SRPL-900003 | ไม่มี workflow ที่เริ่มได้ กด Create PR/SR แล้วเด้ง Permission Denied | Medium | Edge Case |
| TC-SRPL-900004 | โหลดข้อมูลล้มเหลวต้องแสดง error state พร้อมปุ่ม Try again | Low | Edge Case |

---
## TC-SRPL-010001 — หน้า Stock Replenishment โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; บัญชีมีสิทธิ์ `inventory_management.stock_in.view` และ BU มี license `store_operations.stock_replenishment`
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
**Expected**
URL ตรงกับ `/store-operation/stock-replenishment`; หัวข้อหน้า "Stock Replenishment" และคำอธิบาย "What is running low, and how much to order to bring it back up." แสดง; ข้อความ "Loading..." หายไปและแถบสรุป + รายการ location แสดงภายใน 10 วินาที

---
## TC-SRPL-010002 — แถบสรุป (locations/items/critical/warning/low/Total reorder) แสดงครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าที่ต้องเติมอย่างน้อย 1 รายการใน BU BLAVG
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจแถบสรุปด้านบนสุดของรายการ
**Expected**
แถบสรุปแสดง "{n} locations", "{n} items", badge "{n} critical" / "{n} warning" / "{n} low" (แสดงทั้ง 3 ตัวเสมอแม้ค่าเป็น 0) และ "Total reorder:" ตามด้วยผลรวม `reorder_qty` ของทุกสินค้าในรายการที่แสดงอยู่ (จัดรูปแบบด้วยตัวคั่นหลักพัน)

---
## TC-SRPL-010003 — แถบหัว location แสดง checkbox + รหัส/ชื่อคลัง + badge จำนวนและสถานะ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีมากกว่า 1 location ที่มีสินค้าต้องเติม
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจแถบหัวของแต่ละ location
**Expected**
แต่ละ location เป็นแถบเดียวประกอบด้วย checkbox (aria-label "Select all products in {location}") ทางซ้าย ถัดมาเป็นปุ่ม collapsible ที่มีไอคอน chevron, `location_code` ตัวเล็กนำหน้า `location_name`, badge "{n} items" และ badge "{n} critical" / "{n} warning" / "{n} low" **เฉพาะสถานะที่มีจำนวนมากกว่า 0**

---
## TC-SRPL-010004 — ขยาย/ยุบ location เดี่ยวได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment และมีอย่างน้อย 1 location
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดที่ปุ่ม collapsible บนแถบหัว location หนึ่ง (ไม่ใช่ checkbox)
3. กดซ้ำที่ปุ่มเดิม
**Expected**
ครั้งแรกตารางสินค้าของ location นั้นเปิดออกและไอคอน chevron หมุน 90 องศา; ครั้งที่สองตารางยุบกลับ; location อื่นไม่เปลี่ยนสถานะ

---
## TC-SRPL-010005 — ปุ่มสลับ Expand all / Collapse all ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location มากกว่า 1 แห่งในรายการที่แสดงอยู่
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดปุ่มขวาสุดของแถบสรุปที่มีป้าย "Expand all"
3. กดปุ่มเดิมอีกครั้ง
**Expected**
กดครั้งแรกทุก location เปิดออกพร้อมกันและป้ายปุ่มเปลี่ยนเป็น "Collapse all" (ไอคอนสลับเป็น chevrons-down-up); กดครั้งที่สองทุก location ยุบกลับและป้ายกลับเป็น "Expand all" — เป็นปุ่มเดียวที่สลับป้าย ไม่ใช่สองปุ่มแยกกัน

---
## TC-SRPL-010006 — คอลัมน์ตารางสินค้า (select/#/Product/Category/Sub Category/Item Group/On Hand/Min/Max/Par/Reorder/Status) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location หนึ่งและตรวจหัวตาราง
**Expected**
ตารางแสดงคอลัมน์ตามลำดับ: คอลัมน์ checkbox (หัวคอลัมน์เป็นช่องว่าง), "#", "Product", "Category", "Sub Category", "Item Group", "On Hand", "Min", "Max", "Par", "Reorder", "Status"; คอลัมน์ตัวเลขทั้ง 5 ชิดขวา ส่วน "#" และ "Status" ชิดกลาง; ทุกคอลัมน์ปิดการเรียงลำดับ (ไม่มีปุ่ม sort ในหัวตาราง)

---
## TC-SRPL-010007 — ค้นหาด้วยชื่อ/รหัส/ชื่อท้องถิ่น/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าหลายรายการในหลาย location
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. พิมพ์คำค้น (เช่น ส่วนหนึ่งของชื่อสินค้า) ในช่อง Search บน toolbar
3. กด Enter (หรือกดปุ่มแว่นขยายท้ายช่อง)
**Expected**
รายการกรองหลังกด Enter เท่านั้น (พิมพ์เฉย ๆ ไม่กรอง); แสดงเฉพาะ location ที่ยังเหลือสินค้าตรงคำค้น และในแต่ละ location เหลือเฉพาะสินค้าที่ `name`, `code`, ชื่อท้องถิ่น, Category, Sub Category หรือ Item Group ตรงกับคำค้นแบบ case-insensitive; แถบสรุปคำนวณใหม่จากผลที่กรองแล้ว

---
## TC-SRPL-010008 — ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment และมีข้อมูลอย่างน้อย 1 location
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. พิมพ์คำค้นที่ไม่มีในระบบ (เช่น "zzzznotfound") แล้วกด Enter
**Expected**
ไม่มีแถบ location แสดงเลย (location ที่ไม่เหลือสินค้าถูกตัดออกทั้งหมด); แถบสรุปแสดง "0 locations", "0 items", critical/warning/low เป็น 0 และ Total reorder เป็น 0; ไม่มีข้อความ empty state เฉพาะ

---
## TC-SRPL-010009 — ปุ่ม Refresh โหลดข้อมูลใหม่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดปุ่ม "Refresh" มุมขวาบนของหัวเพจ
**Expected**
เกิด request ใหม่ไปยัง `/api/{bu}/stock-replenishments` และรายการ location + แถบสรุปแสดงผลใหม่โดย URL ไม่เปลี่ยนและไม่มีการ reload ทั้งหน้า

---
## TC-SRPL-010010 — ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; กรองด้วยคำค้นที่ทำให้เหลือ location น้อยกว่าทั้งหมดอยู่
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. พิมพ์คำค้นแล้วกด Enter จนรายการถูกกรอง
3. กดปุ่ม X ท้ายช่อง Search
**Expected**
ช่องค้นหาว่าง; รายการ location กลับมาครบเท่าก่อนกรอง และแถบสรุปกลับเป็นค่ารวมทั้งหมด (ไม่ต้องกด Enter ซ้ำ)

---
## TC-SRPL-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ผู้ใช้มีสิทธิ์ใน BU BLAVG
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจ BU ที่ active บน header/BU switcher
3. ตรวจ request ที่หน้ายิงออกไป
**Expected**
Business Unit ที่ active คือ BLAVG; หน้ายิง `GET /api/proxy/api/BLAVG/stock-replenishments`; query key ผูกกับ buCode และจะไม่ fetch เลยจนกว่า buCode จะพร้อม (`enabled: !!buCode`)

---
## TC-SRPL-020001 — badge สถานะสินค้า (Critical/Warning/Low) แสดงโทนถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าครบทั้ง 3 สถานะในรายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location และตรวจคอลัมน์ Status
**Expected**
แต่ละแถวแสดง StatusDotBadge ป้าย "Critical" (โทน destructive) / "Warning" (โทน warning) / "Low" (โทน neutral) ตรงกับค่า `status` ของสินค้านั้น; สีอยู่ที่จุดนำหน้าป้าย ไม่ใช่พื้นหลังทั้ง badge

---
## TC-SRPL-020002 — คอลัมน์ Reorder แสดง reorder_qty ตัวหนา และผลรวมตรงกับ Total reorder
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มีสินค้าอย่างน้อย 2 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กด Expand all แล้วอ่านค่าคอลัมน์ On Hand / Min / Max / Par / Reorder ของทุกแถว
3. เทียบผลรวมคอลัมน์ Reorder กับ "Total reorder:" บนแถบสรุป
**Expected**
คอลัมน์ Reorder แสดงค่า `reorder_qty` ที่ backend ส่งมาตรง ๆ (ตัวหนา ชิดขวา ตัวเลขแบบ tabular) — frontend ไม่คำนวณจาก Par ลบ On Hand เอง; ผลรวมของทุกแถวที่แสดงอยู่เท่ากับค่า Total reorder ในแถบสรุปพอดี

---
## TC-SRPL-020003 — คอลัมน์ Product แสดงชื่อท้องถิ่นเป็นบรรทัดรอง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าที่มีค่า `local_name` อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location ที่มีสินค้านั้นและดูเซลล์คอลัมน์ Product
**Expected**
เซลล์แสดงชื่อสินค้าเป็นบรรทัดหลักและชื่อท้องถิ่นเป็นบรรทัดรองตัวเล็กสีจาง; สินค้าที่ไม่มีชื่อท้องถิ่นแสดงบรรทัดเดียว; ข้อความที่ยาวเกินความกว้างคอลัมน์ถูกตัดด้วย ellipsis ไม่ดันตารางให้กว้างขึ้น

---
## TC-SRPL-060001 — เลือกสินค้าในแถวเดียวด้วย checkbox ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มีสินค้าอย่างน้อย 2 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location หนึ่ง
3. ติ๊ก checkbox ของสินค้า 1 รายการ (aria-label "Select {ชื่อสินค้า}")
**Expected**
checkbox ของแถวนั้นถูกติ๊กเพียงแถวเดียว ไม่พ่วงทั้ง location; ส่วนปุ่มสร้างเอกสารใต้แถบสรุปปรากฏขึ้นพร้อม "Create PR (1)" และ "Create SR (1)"

---
## TC-SRPL-060002 — เลือกทั้งหมดใน location ด้วย checkbox บนแถบหัว location
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มีสินค้าหลายรายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊ก checkbox ซ้ายสุดบนแถบหัว location (aria-label "Select all products in {location}")
3. ขยาย location เพื่อตรวจแถวด้านใน
**Expected**
ทุกสินค้าใน location นั้นถูกติ๊กครบ; ตัวนับบนปุ่ม Create PR/SR เท่ากับจำนวนสินค้าใน location นั้น; หัวคอลัมน์ select ในตารางยังเป็นช่องว่าง (ไม่มี select-all ซ้ำในหัวตาราง); ติ๊กซ้ำเพื่อยกเลิกทั้ง location ได้

---
## TC-SRPL-060003 — checkbox แถบหัว location แสดงสถานะ indeterminate เมื่อเลือกบางส่วน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มีสินค้าตั้งแต่ 2 รายการขึ้นไป
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location แล้วติ๊กสินค้าเพียงบางรายการ (ไม่ครบทุกแถว)
3. ติ๊กแถวที่เหลือจนครบ
**Expected**
ขั้นที่ 2 checkbox บนแถบหัว location แสดงสถานะ indeterminate (ขีดกลาง); ขั้นที่ 3 กลายเป็น checked เต็ม; ยกเลิกจนไม่เหลือแถวที่ติ๊ก checkbox กลับเป็นว่าง

---
## TC-SRPL-060004 — เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีอย่างน้อย 2 location ที่มีสินค้า
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location A แล้วติ๊กสินค้า 2 รายการ
3. ขยาย location B แล้วติ๊กสินค้า 1 รายการ
**Expected**
ตัวนับบนปุ่ม Create PR/SR เป็น (3) ซึ่งเป็นผลรวมข้ามทุก location; การติ๊กของ location A ไม่หายเมื่อไปติ๊ก location B (selection เก็บแยกต่อ location)

---
## TC-SRPL-060005 — ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment และยังไม่ได้ติ๊กอะไร
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ก่อนติ๊ก: ตรวจพื้นที่ใต้แถบสรุป
3. ติ๊กสินค้าอย่างน้อย 1 รายการ
**Expected**
ก่อนติ๊กไม่มีปุ่ม Create PR/Create SR อยู่ในหน้าเลย; หลังติ๊กมีแถวปุ่มชิดซ้ายใต้แถบสรุป แสดง "Create PR (n)" (ไอคอนรถเข็น) และ "Create SR (n)" (ไอคอนเอกสาร) โดย n เท่ากับจำนวนที่ติ๊กรวมทุก location

---
## TC-SRPL-060006 — ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าที่ติ๊กไว้อยู่แล้วอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้าบางรายการ
3. ยกเลิกการติ๊กทุกรายการ
**Expected**
แถวปุ่ม Create PR / Create SR หายไปจากหน้าทั้งแถว (ไม่ใช่แค่ disabled); แถบสรุปและรายการ location ยังอยู่เหมือนเดิม

---
## TC-SRPL-060007 — กด Create PR เปิด wizard พร้อมตารางรายการที่ติ๊ก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท PR ที่เริ่มได้อย่างน้อย 1 สาย; ติ๊กสินค้าไว้อย่างน้อย 2 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้า 2 รายการ
3. กดปุ่ม "Create PR (2)"
**Expected**
เปิด dialog หัวข้อ "Create Purchase Request" คำอธิบาย "Review the selected items and create a purchase request."; มีช่อง Workflow (บังคับ) ที่เลือกได้เฉพาะสายที่เริ่มได้, ข้อความ "2 items"; ตารางด้านล่างมีคอลัมน์ #, Location, Product (รหัสสินค้าเป็นบรรทัดรอง), Request, Unit และปุ่มถังขยะ; ช่อง Request ตั้งต้นเป็นค่า Reorder ของแต่ละแถว และช่อง Unit เลือกหน่วยแรกของสินค้าให้อัตโนมัติเมื่อโหลดเสร็จ

---
## TC-SRPL-060008 — ปุ่ม Create ใน PR wizard ปิดจนกว่าจะเลือก workflow + หน่วย + จำนวน > 0
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด wizard "Create Purchase Request" จากรายการที่ติ๊กไว้แล้ว
**Steps**
1. ก่อนเลือก Workflow: ตรวจปุ่ม "Create" ที่ท้าย dialog
2. เลือก Workflow แล้วตรวจปุ่มอีกครั้ง
3. แก้ช่อง Request ของแถวหนึ่งให้เป็น 0
4. คืนค่าจำนวนเป็นจำนวนบวกอีกครั้ง
**Expected**
ขั้นที่ 1 ปุ่ม Create ถูก disable; ขั้นที่ 2 ปุ่มเปิดใช้งานได้ (เมื่อทุกแถวมีหน่วยและจำนวน > 0 แล้ว); ขั้นที่ 3 ปุ่มกลับมา disable ทันที; ขั้นที่ 4 ปุ่มเปิดใช้งานอีกครั้ง — ไม่มีการยิง request ใด ๆ ระหว่างนี้

---
## TC-SRPL-060009 — ตัดแถวออกจาก PR wizard ด้วยปุ่มถังขยะ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด wizard "Create Purchase Request" ที่มีรายการอย่างน้อย 2 แถว
**Steps**
1. กดปุ่มถังขยะ (aria-label "Delete") ที่ท้ายแถวหนึ่ง
2. ตรวจตารางและข้อความนับจำนวน
**Expected**
แถวนั้นหายจากตารางทันทีโดยไม่มี dialog ยืนยัน; ข้อความ "{n} items" ลดลง 1; การติ๊กในหน้าเบื้องหลังไม่ถูกแก้ (ปิด wizard แล้วเปิดใหม่ แถวที่ตัดไปกลับมาอีกครั้งเพราะ wizard ตั้งค่าใหม่ทุกครั้งที่เปิด); ถ้าตัดจนไม่เหลือแถว ปุ่ม Create ถูก disable

---
## TC-SRPL-060010 — กด Create SR (ติ๊กคลังเดียว) เปิด wizard พร้อม Workflow / Request From / Deliver To
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท SR ที่เริ่มได้อย่างน้อย 1 สาย; ติ๊กสินค้าภายใน location เดียวเท่านั้น
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้า 2 รายการใน location เดียวกัน
3. กดปุ่ม "Create SR (2)"
**Expected**
เปิด dialog หัวข้อ "Create Store Requisition" คำอธิบาย "Review the selected items and create a store requisition."; มี 3 ช่องเรียงกัน: Workflow (บังคับ), "Request From" (บังคับ, เลือกคลังต้นทาง) และ "Deliver To (Destination)" ที่ถูก disable และตรึงเป็น location ที่ติ๊กมา; ตารางมีคอลัมน์ #, Product, Request และปุ่มถังขยะ — **ไม่มีคอลัมน์ Unit** (ต่างจาก PR wizard โดยตั้งใจ)

---
## TC-SRPL-060011 — ช่อง Request From ของ SR wizard ไม่มีคลังปลายทางให้เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด wizard "Create Store Requisition" จากสินค้าใน location หนึ่ง; ระบบมีคลังมากกว่า 1 แห่ง
**Steps**
1. เปิด dropdown ของช่อง "Request From"
2. ค้นหาชื่อคลังปลายทาง (คลังเดียวกับที่แสดงในช่อง Deliver To) ในรายการ
**Expected**
รายการตัวเลือกแสดงคลังอื่น ๆ แต่ไม่มีคลังปลายทางอยู่ในรายการเลย (เบิกจากคลังตัวเองไม่ได้); เลือกคลังอื่นได้ตามปกติและปุ่ม Create เปิดใช้งานเมื่อครบทั้ง Workflow และ Request From

---
## TC-SRPL-060012 — ปิด wizard ด้วย Cancel แล้วไม่มีเอกสารเกิดขึ้นและรายการที่ติ๊กยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด wizard สร้าง PR หรือ SR จากรายการที่ติ๊กไว้
**Steps**
1. เลือก Workflow และแก้จำนวนในตาราง
2. กดปุ่ม "Cancel" ที่ท้าย dialog
3. ตรวจหน้าเบื้องหลัง
**Expected**
dialog ปิดโดยไม่ยิง POST ใด ๆ; ไม่มี toast สร้างสำเร็จ; รายการที่ติ๊กไว้ยังอยู่ครบและปุ่ม Create PR/SR ยังแสดงจำนวนเดิม; เปิด wizard ใหม่แล้วค่า Workflow/จำนวน/แถวที่ตัดออกถูกรีเซ็ตกลับเป็นค่าตั้งต้น

---
## TC-SRPL-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ ต้องเจอ Access Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ **ไม่ใช่ admin** และไม่มี permission `inventory_management.stock_in.view` ใน BU ที่ active
**Steps**
1. พิมพ์ `/store-operation/stock-replenishment` ที่ address bar โดยตรง
**Expected**
ไม่มีข้อมูล stock replenishment แสดงเลย; แสดงกล่อง Access Denied (`role="alert"`) หัวข้อ "Permission Denied" พร้อมบรรทัดแนะนำให้ติดต่อผู้ดูแลระบบ และปุ่มพาไปหน้าที่เข้าถึงได้; เมนู Stock Replenishment ก็ไม่ปรากฏใน Modules launcher / sidebar ของบัญชีนี้

---
## TC-SRPL-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (logout แล้ว หรือ browser context ใหม่ที่ไม่มี token)
**Steps**
1. เปิด `/store-operation/stock-replenishment` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` ทันที (replace) และไม่มีข้อมูล stock replenishment ปรากฏ; ระบบจำ path เดิมไว้ใน state สำหรับพากลับหลัง login

---
## TC-SRPL-100003 — Admin เข้าหน้าได้แม้ไม่มี permission ตรง ๆ
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG ซึ่งมี license `store_operations.stock_replenishment`
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
**Expected**
หน้าเปิดได้ตามปกติ ไม่มีกล่อง Access Denied — RouteGuard ยกเว้นการตรวจ permission ให้ admin; หมายเหตุ: การยกเว้นนี้ใช้กับ permission เท่านั้น ถ้า BU ไม่มี license ของ feature นี้ admin ก็ยังถูกบล็อก

---
## TC-SRPL-300001 — Create PR สร้างใบขอซื้อจากรายการที่เลือกได้สำเร็จ
**Priority:** High · **Test Type:** Integration
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท PR ที่เริ่มได้; ติ๊กสินค้าภายใน location เดียวไว้อย่างน้อย 1 รายการ; **ยอมรับได้ว่าจะเกิดใบขอซื้อจริงในระบบ (ถอนไม่ได้)**
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้าใน location เดียวแล้วกด "Create PR"
3. เลือก Workflow, ตรวจจำนวนและหน่วยของแต่ละแถว
4. กดปุ่ม "Create"
**Expected**
เกิด `POST /api/{bu}/stock-replenishments/pr` โดย body มี `workflow_id`, `location_id` ของคลังที่ติ๊ก และ `products[]` ที่แต่ละตัวมี `id`, `request_unit_id`, `request_qty`; สำเร็จแล้วขึ้น toast "Created 1 purchase request(s)"; dialog ปิดเอง; การติ๊กในหน้าถูกล้างทั้งหมดและปุ่ม Create PR/SR หายไป; รายการ stock replenishment ถูก refetch

---
## TC-SRPL-300002 — Create SR สร้างใบเบิกจากรายการที่เลือกได้สำเร็จ
**Priority:** High · **Test Type:** Integration
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท SR ที่เริ่มได้; ติ๊กสินค้าภายใน location เดียวไว้อย่างน้อย 1 รายการ; **ยอมรับได้ว่าจะเกิดใบเบิกจริงในระบบ (ถอนไม่ได้)**
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้าใน location เดียวแล้วกด "Create SR"
3. เลือก Workflow และ "Request From" (คลังต้นทาง)
4. กดปุ่ม "Create"
**Expected**
เกิด `POST /api/{bu}/stock-replenishments/sr` โดย body มี `workflow_id`, `location_id` (คลังปลายทางที่ของขาด), `from_location` (คลังต้นทางที่เลือก) และ `products[]` ที่มีเพียง `id` กับ `request_qty` (ไม่มี `request_unit_id`); สำเร็จแล้วขึ้น toast "SR created successfully"; dialog ปิดเอง; การติ๊กถูกล้างและรายการถูก refetch

---
## TC-SRPL-300003 — ติ๊กข้ามหลายคลังแล้ว Create PR ได้ใบขอซื้อคลังละใบ
**Priority:** High · **Test Type:** Integration
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท PR ที่เริ่มได้; มีอย่างน้อย 2 location ที่มีสินค้าต้องเติม; **ยอมรับได้ว่าจะเกิดใบขอซื้อจริงหลายใบ (ถอนไม่ได้)**
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้าใน location A 1 รายการ และ location B 1 รายการ
3. กด "Create PR (2)"
4. เลือก Workflow แล้วกด "Create"
**Expected**
ก่อนกด Create ใน dialog มีข้อความ "2 purchase requests will be created — one per location"; ตารางแสดงคอลัมน์ Location แยกคลังของแต่ละแถว; กด Create แล้วเกิด `POST .../pr` **ทีละคลังตามลำดับ (ไม่ขนาน)** คลังละ 1 request โดยแต่ละ body มี `location_id` ของคลังนั้นและเฉพาะสินค้าของคลังนั้น; สำเร็จทั้งคู่แล้ว toast แจ้ง "Created 2 purchase request(s)"

---
## TC-SRPL-900001 — กรณีไม่มีสินค้าต้องเติม / empty state
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; BU ที่ active ไม่มี location ใดที่มีสินค้าถึงจุดสั่งซื้อ (backend คืน array ว่าง)
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจพื้นที่แสดงรายการ
**Expected**
หัวเพจ ช่องค้นหา และปุ่ม Refresh ยังแสดงตามปกติ; แถบสรุปแสดง "0 locations", "0 items", 0 ทั้ง critical/warning/low และ Total reorder 0; ไม่มีแถบ location ใดเลย; ไม่มีปุ่ม Create PR/SR; **หน้าไม่มีข้อความ empty state เฉพาะ** — ห้ามคาดหวังข้อความว่า "ไม่พบข้อมูล"

---
## TC-SRPL-900002 — กด Create SR ขณะติ๊กข้าม 2 คลังขึ้นไป ต้องเตือนว่าใบเบิกทำได้ทีละคลัง
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี workflow ประเภท SR ที่เริ่มได้; มีอย่างน้อย 2 location ที่มีสินค้า
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้าใน location A และ location B อย่างละ 1 รายการ
3. กดปุ่ม "Create SR (2)"
**Expected**
ไม่เปิด wizard สร้างใบเบิก แต่เด้งกล่องเตือนหัวข้อ "One location per requisition" ข้อความอธิบายว่าใบเบิกย้ายของระหว่างคลังต้นทางเดียวกับปลายทางเดียว ให้เลือกของทีละคลัง พร้อมปุ่ม "Go back"; กดปุ่มแล้วกล่องปิดและรายการที่ติ๊กยังอยู่ครบ; หมายเหตุ: ปุ่ม Create PR ในสถานการณ์เดียวกันเปิด wizard ได้ตามปกติ (ดู TC-SRPL-300003)

---
## TC-SRPL-900003 — ไม่มี workflow ที่เริ่มได้ กด Create PR/SR แล้วเด้ง Permission Denied
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มี workflow ประเภท PR (และ/หรือ SR) ที่เริ่มได้เลยใน BU ที่ active; มีสินค้าที่ติ๊กไว้อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ติ๊กสินค้า 1 รายการแล้วดูปุ่ม Create PR / Create SR
3. กดปุ่มที่จางอยู่
**Expected**
ปุ่มแสดงแบบจางลงและมี `aria-disabled` แต่ยัง **คลิกได้จริง** (ไม่ใช่ `disabled`); กดแล้วไม่เปิด wizard แต่เด้งกล่อง "Permission Denied" ที่มีข้อความ "None of the approval flows let you start a purchase request." (ฝั่ง SR เป็น "...store requisition."); ปิดกล่องแล้วการติ๊กยังอยู่ครบ

---
## TC-SRPL-900004 — โหลดข้อมูลล้มเหลวต้องแสดง error state พร้อมปุ่ม Try again
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; จำลองให้ `GET /api/{bu}/stock-replenishments` ตอบ 500 (เช่นด้วย route interception ของ Playwright)
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจเนื้อหาในหน้า
3. ปลดการจำลองความล้มเหลวแล้วกดปุ่ม "Try again"
**Expected**
แทนที่จะเห็นแถบสรุป/รายการ หน้าแสดงกล่อง error พร้อมข้อความแจ้งผู้ใช้และรหัสอ้างอิงสำหรับความผิดพลาดฝั่งเซิร์ฟเวอร์ (5xx) และมีปุ่ม "Try again"; กดปุ่มแล้วหน้ายิง request ใหม่และแสดงรายการได้ตามปกติ; หมายเหตุ: สถานะแบบทางตัน (400/404/422) จะไม่มีปุ่ม Try again ให้กด
