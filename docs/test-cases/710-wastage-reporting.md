# Wastage Reporting — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/store-operation/wastage-reporting`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Wastage Reporting
**Frontend route:** `routes/store-operation/wastage-reporting`  •  **URL:** `/store-operation/wastage-reporting`
**Prefix:** `WAST`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 20

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> - **โมดูลถูกรื้อใหม่ทั้งชุด** (คอมมิต `061a0f3f`, 2026-08-20) — ของเดิมเป็น mock "ใบรายงานของเสีย" แบบ CRUD ปัจจุบันเป็นรายการ **lot สินค้าจาก GRN ที่หมดอายุ/ใกล้หมดอายุ** ซึ่งอ่านอย่างเดียว ต่อ `GET /api/{bu}/wastage-reporting` ของจริง ไฟล์ฟอร์ม/mock CRUD ถูกลบ 8 ไฟล์ และ route `new` / `:id` ถูกถอดออกจาก `routes/router.tsx` แล้ว → เคสเดิมของ create/edit/delete/detail/validation **ถูกลบทั้งหมด** (ดูรายการท้ายหมายเหตุ)
> - **หน้านี้มี URL เดียว** คือ `/store-operation/wastage-reporting` (ไม่มีหน้า detail ของตัวเอง) — โค้ดทั้งโมดูลเหลือ 4 ไฟล์: `wastage-reporting.route.tsx`, `wr-component.tsx`, `use-wastage-report.ts`, `use-wr-table.tsx`
> - **ไม่มีปุ่ม Add / Edit / Delete / row actions / checkbox เลย** และเพราะ `ListToolbar` ถูกเรียกด้วย `variant="bare"` โดย **ไม่ส่ง prop `table`** จึงไม่มีเมนู Sort และปุ่ม Toggle Columns ด้วย — toolbar เหลือแค่ ช่องค้น + View selector + ปุ่ม Filter
> - **blocker เรื่องข้อมูลทดสอบ:** สร้างข้อมูลจากหน้านี้ไม่ได้ (backend ไม่มี endpoint เขียน) — ต้องมี GRN ใน BU BLAVG ที่มี lot พร้อม `expired_at` และของคงเหลือก่อน จึงจะมีแถวให้ทดสอบ เคสที่ต้องมีข้อมูล ≥ 1 แถว / ≥ 2 หน้า / มีทั้ง expired และ expiring ต้องเตรียมผ่านโมดูล GRN ล่วงหน้า
> - **สถานะมีแค่ 2 ค่า** คือ `expired` (จุดแดง) กับ `expiring` (จุดเหลือง) — ไม่มี pending/approved/rejected อีกแล้ว ค่าที่ filter เขียนลง URL คือ `filter=status|string:expired`
> - **จุดที่กดได้จุดเดียวคือคอลัมน์ GRN No.** ซึ่งเป็น `<button>` (ไม่ใช่ `<a href>`) และกดแล้ว **ออกจากโมดูล** ไปที่ `/procurement/goods-receive-note/{grn_id}` — คลิกที่แถวหรือเซลล์อื่นไม่นำทางไปไหน
> - **RouteGuard เช็ค license ก่อน permission เสมอ** — license feature คือ `store_operations.wastage_reporting`, permission คือ `inventory_management.stock_out.view` (`constant/module-list.ts`) · admin bypass ใช้ได้กับ permission เท่านั้น **ไม่ใช้กับ license**
> - **ยังยืนยันไม่ได้จากโค้ด frontend:** (ก) role ไหนบ้างที่ *ไม่มี* `inventory_management.stock_out.view` จริง — mapping role→permission อยู่ฝั่ง backend จึงต้องยืนยันตอนรัน · (ข) BU ที่ไม่ได้ซื้อ feature นี้มีอยู่จริงหรือไม่ (TC-WAST-100003 ต้องการ BU แบบนั้น) · (ค) backend รองรับ `search` / `sort` ของ endpoint นี้ครบแค่ไหน — frontend ส่ง `search`, `sort`, `page`, `perpage`, `filter` ไป backend ทั้งหมด (server-side ล้วน ไม่มีการกรอง/เรียงฝั่ง client)
> - **summary bar เป็นยอดของทั้งชุดข้อมูล ไม่ใช่เฉพาะหน้าปัจจุบัน** และ render เฉพาะเมื่อ response มี `summary` เท่านั้น
> - **เรียงลำดับได้แค่ 2 คอลัมน์** คือ GRN No. และ Expiry Date (คอลัมน์อื่นตั้ง `enableSorting: false`) และหน้านี้ไม่ได้ตั้ง `defaultSort` จึงเข้ามาครั้งแรกโดยไม่มี `sort` ใน URL
> - **ID ที่ลบทิ้งในรอบนี้** (ห้ามนำกลับมาใช้ซ้ำ): `TC-WAST-010003` (ปุ่ม Add), `TC-WAST-020002` (หน้า detail ของ WR), `TC-WAST-030001`–`030006`, `TC-WAST-030050` (สร้าง), `TC-WAST-040001`–`040002` (แก้ไข), `TC-WAST-050001`–`050002` (ลบ), `TC-WAST-200001`–`200002` (validation ของฟอร์ม) — ทั้งหมดอ้างถึง UI ที่ไม่มีอยู่ในแอปแล้ว

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-WAST-010001 | หน้า list Wastage Reporting โหลดสำเร็จ | High | Smoke |
| TC-WAST-010002 | คอลัมน์ตาราง (GRN/สินค้า/สถานที่/lot/วันหมดอายุ/เหลือกี่วัน/สถานะ/ของเหลือ/ต้นทุน/มูลค่า) แสดงครบ | Medium | Functional |
| TC-WAST-010004 | ค้นหาด้วยการกด Enter ในช่อง Search กรองรายการได้ | Medium | Functional |
| TC-WAST-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-WAST-010006 | filter สถานะ (Expired / Expiring) ใช้งานได้ | High | Functional |
| TC-WAST-010007 | pagination เปลี่ยนหน้าและเปลี่ยนจำนวนแถวต่อหน้าได้ | Low | Functional |
| TC-WAST-010008 | summary bar แสดงจำนวนรายการ/หมดอายุ/ใกล้หมดอายุ และจำนวน-มูลค่าที่เสี่ยง | High | Functional |
| TC-WAST-010009 | chip ใน Active filter bar แก้ค่าและลบ filter ได้ | Medium | Functional |
| TC-WAST-010010 | เรียงลำดับได้เฉพาะคอลัมน์ GRN No. และ Expiry Date | Medium | Functional |
| TC-WAST-010011 | บันทึกและเรียกใช้ saved view ของหน้านี้ได้ | Low | Functional |
| TC-WAST-010012 | ปุ่มล้างในช่องค้นหาคืนรายการทั้งหมด | Low | Alternate Flow |
| TC-WAST-010050 | active BU = BLAVG | High | Smoke |
| TC-WAST-020001 | กด GRN No. เปิดใบ GRN ต้นทาง | High | Smoke |
| TC-WAST-020003 | คลิกเซลล์อื่นหรือตัวแถวไม่นำทางออกจากหน้า | Low | Functional |
| TC-WAST-100001 | ผู้ใช้ไม่มีสิทธิ์ stock_out.view ต้องเห็นกล่องปฏิเสธสิทธิ์ | High | Authorization |
| TC-WAST-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-WAST-100003 | BU ที่ไม่ได้ซื้อ feature wastage_reporting ถูกล็อกแม้เป็น admin | Low | Authorization |
| TC-WAST-900001 | mobile ใช้ bottom sheet สำหรับ filter และตารางเลื่อนแนวนอนได้ | Low | Edge Case |
| TC-WAST-900002 | API ล้มเหลวต้องแสดง ErrorState พร้อมปุ่มลองใหม่ | Medium | Edge Case |
| TC-WAST-900003 | เปิดลิงก์ที่มี `sv` ของ view ที่ถูกลบแล้ว ต้องเตือนและล้างค่าออก | Low | Edge Case |

---
## TC-WAST-010001 — หน้า list Wastage Reporting โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG; BU มี license `store_operations.wastage_reporting`
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
**Expected**
URL ตรงกับ `/store-operation/wastage-reporting`; หัวข้อหน้า "Wastage Reporting" และคำอธิบาย "Expired and expiring stock lots — quantity and value at risk." แสดง; toolbar มีช่องค้นหา, View selector และปุ่ม Filter (ไม่มีปุ่ม Add); DataGrid แสดงผลภายใน 10 วินาที

---
## TC-WAST-010002 — คอลัมน์ตาราง (GRN/สินค้า/สถานที่/lot/วันหมดอายุ/เหลือกี่วัน/สถานะ/ของเหลือ/ต้นทุน/มูลค่า) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี lot ใน BU อย่างน้อย 1 รายการ (ต้องมี GRN ที่มี lot + วันหมดอายุมาก่อน)
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. ตรวจหัวตารางและเซลล์ในแถวแรก
**Expected**
หัวตารางเรียงเป็น `#`, GRN No., Product, Location, Lot No., Expiry Date, Days Left, Status, Remaining Qty, Cost/Unit, Remaining Value; คอลัมน์ Product แสดงชื่อสินค้าและชื่อท้องถิ่นบรรทัดรอง (ถ้ามี); Location แสดงรหัสนำหน้าชื่อ; Expiry Date ถูกจัดรูปแบบตาม dateFormat ของ profile; Days Left / Remaining Qty / Cost/Unit / Remaining Value ชิดขวาแบบ tabular-nums โดย Remaining Qty ต่อท้ายด้วยชื่อหน่วยนับ ส่วน Cost/Unit และ Remaining Value จัดรูปแบบเป็นสกุลเงิน; Status เป็น badge จุดสี (Expired = แดง, Expiring = เหลือง) จัดกึ่งกลาง

---
## TC-WAST-010004 — ค้นหาด้วยการกด Enter ในช่อง Search กรองรายการได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีรายการในตารางหลายแถวและจดค่า GRN No. ของแถวแรกไว้
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. พิมพ์ GRN No. ของแถวแรกลงในช่อง Search
3. กด Enter
**Expected**
URL เพิ่ม `search=<คำค้น>` และ `page` ถูกรีเซ็ต; ตารางยิง request ใหม่และแสดงเฉพาะรายการที่ตรงกับคำค้น (แถวที่จดไว้ยังอยู่); การพิมพ์เฉย ๆ โดยไม่กด Enter ต้องไม่เปลี่ยนผลลัพธ์

---
## TC-WAST-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และมีข้อมูลอยู่ก่อนอย่างน้อย 1 แถว
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. พิมพ์คำค้นที่ไม่มีในระบบ (เช่น "zzzznotfound") แล้วกด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty component ข้อความ "No data found" แทน; ตัวนับจำนวนรายการของ DataGrid เป็น 0

---
## TC-WAST-010006 — filter สถานะ (Expired / Expiring) ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport เดสก์ท็อป; มีข้อมูลทั้งสถานะ expired และ expiring
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดปุ่ม Filter (เมนู popover)
3. hover แถว Status ใต้หัวข้อ Document แล้วเลือก "Expired" จาก submenu
**Expected**
URL เพิ่ม `filter=status|string:expired` และรีเซ็ต `page`; ตารางแสดงเฉพาะแถวที่ badge สถานะเป็น Expired; ปุ่ม Filter ขึ้น badge จำนวน 1; Active filter bar แสดง chip "Status Expired"; ตัวเลือกมีแค่ All / Expired / Expiring เท่านั้น

---
## TC-WAST-010007 — pagination เปลี่ยนหน้าและเปลี่ยนจำนวนแถวต่อหน้าได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีข้อมูลมากกว่า 10 แถว (ค่าเริ่มต้น perpage = 10)
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดปุ่มไปหน้าถัดไปบนแถบ pagination
3. เปลี่ยนจำนวนแถวต่อหน้าเป็น 25
**Expected**
ขั้นที่ 2: URL เพิ่ม `page=2`, ตารางโหลดชุดถัดไป และเลข `#` ของแถวแรกต่อเนื่องจากหน้าก่อน (เช่น 11); ขั้นที่ 3: URL เพิ่ม `perpage=25` และตารางแสดงได้สูงสุด 25 แถว (ตัวเลือกคือ 5/10/25/50/100)

---
## TC-WAST-010008 — summary bar แสดงจำนวนรายการ/หมดอายุ/ใกล้หมดอายุ และจำนวน-มูลค่าที่เสี่ยง
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; response ของ `GET /api/BLAVG/wastage-reporting` มีก้อน `summary`
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. ตรวจแถบสรุปเหนือตาราง
**Expected**
แถบสรุปแสดง "{n} items", badge จุดแดง "{n} expired", badge จุดเหลือง "{n} expiring", "Qty at risk:" พร้อมจำนวนรวม และ "Value at risk:" พร้อมมูลค่ารวมที่จัดรูปแบบเป็นสกุลเงิน; ตัวเลขเป็นยอดของทั้งชุดข้อมูล ไม่ใช่เฉพาะหน้าปัจจุบัน (เปลี่ยนหน้าแล้วค่าคงเดิม)

---
## TC-WAST-010009 — chip ใน Active filter bar แก้ค่าและลบ filter ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list โดยเลือก filter Status = Expired ไว้แล้ว (มี chip ใน Active filter bar)
**Steps**
1. กดที่ตัว chip "Status Expired"
2. เลือก "Expiring" จาก popover ที่เปิดขึ้น
3. กดปุ่ม X บน chip
**Expected**
ขั้นที่ 2: URL เปลี่ยนเป็น `filter=status|string:expiring` และตารางแสดงเฉพาะแถว Expiring โดยไม่ต้องเปิดเมนู Filter ใหม่; ขั้นที่ 3: chip หายไป, `filter` ถูกล้างจาก URL, Active filter bar ไม่แสดง และตารางกลับมาแสดงทุกสถานะ

---
## TC-WAST-010010 — เรียงลำดับได้เฉพาะคอลัมน์ GRN No. และ Expiry Date
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีข้อมูลอย่างน้อย 2 แถว
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดหัวคอลัมน์ Expiry Date หนึ่งครั้ง แล้วกดซ้ำอีกครั้ง
3. ตรวจหัวคอลัมน์ Lot No., Days Left, Status, Remaining Qty, Cost/Unit, Remaining Value
**Expected**
ขั้นที่ 2: URL เป็น `sort=expired_at:asc` แล้วเปลี่ยนเป็น `sort=expired_at:desc` พร้อมรีเซ็ต `page` และลูกศรบนหัวคอลัมน์สลับทิศ; ขั้นที่ 3: คอลัมน์เหล่านั้นไม่มีปุ่มเรียงลำดับ (กดแล้ว URL ไม่มี `sort` เพิ่ม) — เรียงได้เฉพาะ GRN No. กับ Expiry Date เท่านั้น

---
## TC-WAST-010011 — บันทึกและเรียกใช้ saved view ของหน้านี้ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport เดสก์ท็อป; เลือก filter Status = Expired ไว้แล้ว
**Steps**
1. กดปุ่ม Filter แล้วกด "Save current filters as view"
2. ตั้งชื่อ view แล้วบันทึก
3. กด Clear ให้ filter ว่าง
4. เปิด View selector แล้วเลือก view ที่เพิ่งบันทึก
**Expected**
หลังบันทึก View selector แสดงชื่อ view ที่บันทึกไว้ และ URL มี `sv=<view id>`; หลังเลือก view ซ้ำ filter `status|string:expired` ถูกใส่กลับเข้า URL และตารางกรองตามนั้นอีกครั้ง

---
## TC-WAST-010012 — ปุ่มล้างในช่องค้นหาคืนรายการทั้งหมด
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และค้นหาคำหนึ่งไว้แล้ว (ช่องค้นมีข้อความ)
**Steps**
1. กดปุ่มไอคอนในช่องค้น (ขณะมีข้อความจะเป็นไอคอน X)
**Expected**
ช่องค้นว่าง, `search` ถูกล้างจาก URL, `page` ถูกรีเซ็ต และตารางกลับมาแสดงรายการทั้งหมดของ BU

---
## TC-WAST-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; ผู้ใช้ผูกกับ BU BLAVG
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. ตรวจ BU ที่ active บน header/BU switcher
**Expected**
Business Unit ที่ active คือ BLAVG และ request ที่ยิงคือ `GET /api/BLAVG/wastage-reporting` (ข้อมูลผูกกับ BU ผ่าน path ของ endpoint)

---
## TC-WAST-020001 — กด GRN No. เปิดใบ GRN ต้นทาง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีรายการในตารางอย่างน้อย 1 แถว; ผู้ใช้เข้าถึงโมดูล Goods Receive Note ได้
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดที่ค่า GRN No. ในแถวแรก (เป็นปุ่มลิงก์ ไม่ใช่ `<a href>`)
**Expected**
นำทางไปยัง `/procurement/goods-receive-note/{grn_id}` ของ lot นั้น และหน้า GRN เปิดขึ้น; กดปุ่มย้อนกลับของเบราว์เซอร์แล้วกลับมาที่ `/store-operation/wastage-reporting` พร้อม query เดิม

---
## TC-WAST-020003 — คลิกเซลล์อื่นหรือตัวแถวไม่นำทางออกจากหน้า
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และมีรายการอย่างน้อย 1 แถว
**Steps**
1. คลิกที่เซลล์ Product ของแถวแรก
2. คลิกที่เซลล์ Lot No. และพื้นที่ว่างของแถวเดียวกัน
**Expected**
URL ยังคงเป็น `/store-operation/wastage-reporting` (ไม่มีการนำทาง ไม่มี dialog เปิด) — มีเพียงคอลัมน์ GRN No. เท่านั้นที่กดได้ และไม่มี checkbox หรือเมนู row actions ในตารางนี้

---
## TC-WAST-100001 — ผู้ใช้ไม่มีสิทธิ์ stock_out.view ต้องเห็นกล่องปฏิเสธสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ **ไม่มี** permission `inventory_management.stock_out.view` และ **ไม่ใช่ admin ของ BU** (ต้องยืนยัน role ที่ใช้กับ backend ก่อน — ดูหมายเหตุ); BU มี license ของ feature นี้
**Steps**
1. พยายามเข้า `/store-operation/wastage-reporting` โดยตรง
**Expected**
ไม่มีตารางหรือ summary ปรากฏ; แสดงกล่อง AccessDeniedBlock (`role="alert"`) พร้อมข้อความปฏิเสธสิทธิ์และบรรทัดให้ติดต่อผู้ดูแลระบบ และปุ่มพาไปหน้าที่ผู้ใช้เข้าถึงได้; ไม่มี request `GET /api/BLAVG/wastage-reporting` ถูกยิง

---
## TC-WAST-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (logout / ไม่มี token)
**Steps**
1. เปิด `/store-operation/wastage-reporting` โดยตรงใน browser context ที่ไม่มี session
**Expected**
ถูก redirect ไปยัง `/login` (แทนที่ history) และไม่มีข้อมูล lot ปรากฏบนจอ

---
## TC-WAST-100003 — BU ที่ไม่ได้ซื้อ feature wastage_reporting ถูกล็อกแม้เป็น admin
**Priority:** Low · **Test Type:** Authorization
**Preconditions**
มี BU ที่ license ไม่รวม `store_operations.wastage_reporting` และผู้ใช้เป็น admin ของ BU นั้น (ต้องยืนยันว่ามี BU แบบนี้ในสภาพแวดล้อมทดสอบก่อน); สลับ active BU เป็น BU นั้น
**Steps**
1. เข้า `/store-operation/wastage-reporting` โดยตรง
**Expected**
แสดงกล่องปฏิเสธสิทธิ์เหตุผล license (ข้อความชุด license ไม่มีบรรทัด "ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์") พร้อมปุ่มพาไปหน้าที่เข้าถึงได้; การเป็น admin ไม่ช่วยให้ผ่าน เพราะ license ถูกเช็คก่อน permission และไม่มี admin bypass

---
## TC-WAST-900001 — mobile ใช้ bottom sheet สำหรับ filter และตารางเลื่อนแนวนอนได้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport ขนาดมือถือ; มีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. เปิด `/store-operation/wastage-reporting` ด้วย viewport มือถือ
2. กดปุ่ม Filter
3. เลือก Expired แล้วกด Done
**Expected**
ปุ่ม Filter เปิด **bottom sheet** (ไม่ใช่ popover menu แบบเดสก์ท็อป) หัวข้อ "Filter" พร้อมปุ่ม Clear / Save current filters as view / Done; เลือกค่าแล้วตารางกรองทันทีโดยไม่ต้องกด Done (Done แค่ปิดชีท); แถบสรุปขึ้นบรรทัดใหม่ได้และตารางเลื่อนแนวนอนได้โดยหน้าไม่ล้น

---
## TC-WAST-900002 — API ล้มเหลวต้องแสดง ErrorState พร้อมปุ่มลองใหม่
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; สามารถ intercept/บล็อก request `**/api/*/wastage-reporting*` ให้ตอบ error ได้
**Steps**
1. ตั้ง route interception ให้ endpoint ของโมดูลตอบ 500
2. เปิด `/store-operation/wastage-reporting`
3. ปลด interception แล้วกดปุ่มลองใหม่บนกล่อง error
**Expected**
ขั้นที่ 2: ทั้งหน้าแทนที่ด้วย ErrorState (ไม่มีตาราง ไม่มี summary) พร้อมข้อความ error ตาม locale และรหัสอ้างอิง (เฉพาะกรณี 5xx); ขั้นที่ 3: กดลองใหม่แล้ว query ยิงซ้ำและตารางแสดงผลตามปกติ

---
## TC-WAST-900003 — เปิดลิงก์ที่มี `sv` ของ view ที่ถูกลบแล้ว ต้องเตือนและล้างค่าออก
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ทราบ id ที่ไม่มีอยู่จริงของ saved view (เช่น uuid สุ่ม หรือ view ที่เพิ่งลบทิ้ง)
**Steps**
1. เปิด `/store-operation/wastage-reporting?sv=<id ที่ไม่มีอยู่จริง>`
**Expected**
แสดง toast "That view no longer exists" หนึ่งครั้ง (ไม่ซ้ำ), `sv` ถูกลบออกจาก URL, View selector กลับเป็น "No view" และตารางยังแสดงรายการตามปกติ
