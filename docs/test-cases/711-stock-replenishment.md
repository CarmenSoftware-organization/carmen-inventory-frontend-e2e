# Stock Replenishment — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/store-operation/stock-replenishment`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Stock Replenishment
**Frontend route:** `routes/store-operation/stock-replenishment`  •  **URL:** `/store-operation/stock-replenishment`
**Prefix:** `SRPL`
**Default role:** Store Manager
**Total test cases:** 23

> หมายเหตุ: โมดูลนี้เป็นหน้าสรุป (read-only dashboard) ของสินค้าที่ต้องเติมสต็อก ไม่มีหน้า create/edit/delete เอกสารแยก — แสดงข้อมูลแบบจัดกลุ่มตาม location (collapsible) พร้อม status critical/warning/low และให้เลือกสินค้าเพื่อสร้าง PR/SR. ปัจจุบัน hook โหลดจาก mock data (ผูกกับ BU code ผ่าน `useBuCode`).

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SRPL-010001 | หน้า Stock Replenishment โหลดสำเร็จ | High | Smoke |
| TC-SRPL-010002 | แถบสรุป (locations/items/critical/warning/low/totalNeed) แสดงครบ | High | Functional |
| TC-SRPL-010003 | location แสดงแบบ collapsible พร้อม badge สรุปสถานะ | Medium | Functional |
| TC-SRPL-010004 | ขยาย/ยุบ location เดี่ยวได้ | Medium | Functional |
| TC-SRPL-010005 | ปุ่ม Expand All / Collapse All ทำงาน | Medium | Functional |
| TC-SRPL-010006 | คอลัมน์ตารางสินค้า (สินค้า/หมวด/หมวดย่อย/กลุ่ม/current/par level/need/สถานะ) แสดงครบ | Medium | Functional |
| TC-SRPL-010007 | ค้นหาด้วยชื่อสินค้า/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้ | Medium | Functional |
| TC-SRPL-010008 | ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ | Medium | Functional |
| TC-SRPL-010009 | ปุ่ม Refresh โหลดข้อมูลใหม่ | Low | Functional |
| TC-SRPL-010050 | active BU = BLAVG | High | Smoke |
| TC-SRPL-020001 | badge สถานะสินค้า (critical/warning/low) แสดงสีถูกต้อง | Medium | Functional |
| TC-SRPL-020002 | คอลัมน์ need แสดงค่าจำนวนที่ต้องเติม (par level - current) | Medium | Functional |
| TC-SRPL-060001 | เลือกสินค้าในแถวเดียวด้วย checkbox ได้ | High | Functional |
| TC-SRPL-060002 | เลือกทั้งหมดใน location ด้วย header checkbox ได้ | Medium | Functional |
| TC-SRPL-060003 | header checkbox แสดงสถานะ indeterminate เมื่อเลือกบางส่วน | Medium | Functional |
| TC-SRPL-060004 | เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง | Medium | Functional |
| TC-SRPL-060005 | ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก | High | Functional |
| TC-SRPL-060006 | ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป | Medium | Functional |
| TC-SRPL-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Stock Replenishment ต้องถูกบล็อก | High | Authorization |
| TC-SRPL-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SRPL-300001 | Create PR จากสินค้าที่เลือกนำสินค้าไปยังการสร้าง Purchase Request | High | Functional |
| TC-SRPL-300002 | Create SR จากสินค้าที่เลือกนำสินค้าไปยังการสร้าง Store Requisition | High | Functional |
| TC-SRPL-900001 | กรณีไม่มีสินค้าต้องเติม / empty state | Low | Edge Case |

---
## TC-SRPL-010001 — หน้า Stock Replenishment โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มีสิทธิ์เข้าถึง Store Operation
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
**Expected**
URL ตรงกับ `/store-operation/stock-replenishment`; หัวข้อหน้าและคำอธิบายแสดง พร้อมรายการ location ที่ต้องเติมสต็อกภายใน 10 วินาที

---
## TC-SRPL-010002 — แถบสรุป (locations/items/critical/warning/low/totalNeed) แสดงครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีข้อมูลสินค้าที่ต้องเติมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจแถบสรุปด้านบน
**Expected**
แถบสรุปแสดงจำนวน locations, จำนวน items, badge critical/warning/low (ตามจำนวนแต่ละสถานะ) และ totalNeed (ผลรวมจำนวนที่ต้องเติมทั้งหมด)

---
## TC-SRPL-010003 — location แสดงแบบ collapsible พร้อม badge สรุปสถานะ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีหลาย location ที่มีสินค้าต้องเติม
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจหัวแถวของแต่ละ location
**Expected**
แต่ละ location แสดงเป็นแถบ collapsible พร้อมชื่อ location, badge จำนวน items และ badge critical/warning/low เฉพาะที่มีจำนวน > 0

---
## TC-SRPL-010004 — ขยาย/ยุบ location เดี่ยวได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดที่หัวแถวของ location หนึ่ง
**Expected**
location เปิดออกแสดงตารางสินค้าด้านใน (ไอคอน chevron หมุน); กดซ้ำเพื่อยุบกลับได้

---
## TC-SRPL-010005 — ปุ่ม Expand All / Collapse All ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location มากกว่า 1 แห่ง
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดปุ่ม Expand All
3. กดปุ่ม Collapse All
**Expected**
Expand All ขยายทุก location พร้อมกัน และปุ่มสลับเป็น Collapse All; Collapse All ยุบทุก location กลับ

---
## TC-SRPL-010006 — คอลัมน์ตารางสินค้า (สินค้า/หมวด/หมวดย่อย/กลุ่ม/current/par level/need/สถานะ) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด location ที่มีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location หนึ่งและตรวจหัวตาราง
**Expected**
ตารางสินค้าแสดงคอลัมน์: checkbox เลือก, ลำดับ, สินค้า, หมวดหมู่, หมวดย่อย, กลุ่มสินค้า, current (ชิดขวา), par level (ชิดขวา), need (ชิดขวา ตัวหนา) และสถานะ (badge)

---
## TC-SRPL-010007 — ค้นหาด้วยชื่อสินค้า/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าหลายรายการในหลาย location
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. พิมพ์คำค้น (เช่น ชื่อสินค้าบางส่วน) ในช่อง Search
**Expected**
แสดงเฉพาะ location ที่มีสินค้าตรงคำค้น และในแต่ละ location เหลือเฉพาะสินค้าที่ชื่อ/หมวด/หมวดย่อย/กลุ่มตรงกับคำค้น (case-insensitive)

---
## TC-SRPL-010008 — ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. พิมพ์คำค้นที่ไม่มีในระบบ (เช่น "zzzznotfound")
**Expected**
ไม่มี location แสดง (location ที่ไม่มีสินค้าตรงคำค้นถูกกรองออกทั้งหมด); แถบสรุปแสดงจำนวนเป็น 0

---
## TC-SRPL-010009 — ปุ่ม Refresh โหลดข้อมูลใหม่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. กดปุ่ม Refresh มุมขวาบน
**Expected**
ข้อมูลถูก refetch และรายการ location/สรุปแสดงผลใหม่โดยไม่ต้อง reload ทั้งหน้า

---
## TC-SRPL-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ผู้ใช้ผูกกับ BU BLAVG
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจ BU ที่ active บน header/BU switcher
**Expected**
Business Unit ที่ active คือ BLAVG; ข้อมูล stock replenishment ถูกผูกกับ BU BLAVG (query key รวม buCode) และจะไม่ fetch จนกว่า buCode พร้อม

---
## TC-SRPL-020001 — badge สถานะสินค้า (critical/warning/low) แสดงสีถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าครบทั้ง 3 สถานะ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location และตรวจ badge ในคอลัมน์สถานะ
**Expected**
critical แสดง badge สี destructive, warning แสดง badge สี warning และ low แสดง badge สี secondary ตรงกับสถานะของแต่ละสินค้า

---
## TC-SRPL-020002 — คอลัมน์ need แสดงค่าจำนวนที่ต้องเติม (par level - current)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด location ที่มีสินค้า
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location และตรวจคอลัมน์ current, par level และ need
**Expected**
คอลัมน์ need แสดงจำนวนที่ต้องเติม (ตัวหนา, ชิดขวา) สอดคล้องกับ par level เทียบกับ current; ค่ารวมตรงกับ totalNeed ในแถบสรุป

---
## TC-SRPL-060001 — เลือกสินค้าในแถวเดียวด้วย checkbox ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด location ที่มีสินค้า
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location หนึ่ง
3. ติ๊ก checkbox ของสินค้า 1 รายการ
**Expected**
แถวนั้นถูกเลือก; ปุ่ม Create PR / Create SR ปรากฏและแสดงจำนวนที่เลือก (1)

---
## TC-SRPL-060002 — เลือกทั้งหมดใน location ด้วย header checkbox ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด location ที่มีสินค้าหลายรายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location
3. ติ๊ก checkbox บน header ของตาราง
**Expected**
ทุกสินค้าใน location ถูกเลือก; ตัวนับจำนวนที่เลือกเท่ากับจำนวนสินค้าใน location นั้น

---
## TC-SRPL-060003 — header checkbox แสดงสถานะ indeterminate เมื่อเลือกบางส่วน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; location มีสินค้าตั้งแต่ 2 รายการขึ้นไป
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location แล้วเลือกสินค้าเพียงบางรายการ (ไม่ครบทุกแถว)
**Expected**
header checkbox แสดงสถานะ indeterminate (เลือกบางส่วน); เมื่อเลือกครบทุกแถวจึงกลายเป็น checked เต็ม

---
## TC-SRPL-060004 — เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีอย่างน้อย 2 location ที่มีสินค้า
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ขยาย location A เลือกสินค้า 2 รายการ
3. ขยาย location B เลือกสินค้า 1 รายการ
**Expected**
ตัวนับจำนวนที่เลือกบนปุ่ม Create PR/SR เท่ากับผลรวมข้ามทุก location (3) และการเลือกของแต่ละ location ถูกเก็บแยกกัน

---
## TC-SRPL-060005 — ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า Stock Replenishment
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ก่อนเลือก: ตรวจ toolbar
3. เลือกสินค้าอย่างน้อย 1 รายการ
**Expected**
ก่อนเลือกไม่มีปุ่ม Create PR/SR; หลังเลือกปุ่ม Create PR และ Create SR ปรากฏพร้อมจำนวนที่เลือกในวงเล็บ

---
## TC-SRPL-060006 — ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีสินค้าที่ถูกเลือกอยู่
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. เลือกสินค้าบางรายการ
3. ยกเลิกการติ๊กทุกรายการ
**Expected**
ตัวนับการเลือกกลับเป็น 0 และปุ่ม Create PR / Create SR หายไปจาก toolbar

---
## TC-SRPL-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Stock Replenishment ต้องถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ Store Operation / Stock Replenishment
**Steps**
1. พยายามเข้า `/store-operation/stock-replenishment` โดยตรง
**Expected**
ระบบไม่แสดงข้อมูล stock replenishment; แสดงหน้า/ข้อความปฏิเสธสิทธิ์ หรือ redirect ออกจากหน้า

---
## TC-SRPL-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (logout / ไม่มี token)
**Steps**
1. เปิด `/store-operation/stock-replenishment` โดยตรงใน browser ที่ไม่มี session
**Expected**
ถูก redirect ไปยัง `/login` และไม่มีข้อมูล stock replenishment ปรากฏ

---
## TC-SRPL-300001 — Create PR จากสินค้าที่เลือกนำสินค้าไปยังการสร้าง Purchase Request
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เลือกสินค้าที่ต้องเติมไว้อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. เลือกสินค้าที่ต้องการเติม
3. กดปุ่ม Create PR
**Expected**
สินค้าที่เลือกถูกส่งไปเป็นรายการตั้งต้นของการสร้าง Purchase Request (getSelectedProducts รวบรวมรายการที่ติ๊กข้ามทุก location)

---
## TC-SRPL-300002 — Create SR จากสินค้าที่เลือกนำสินค้าไปยังการสร้าง Store Requisition
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เลือกสินค้าที่ต้องเติมไว้อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. เลือกสินค้าที่ต้องการเติม
3. กดปุ่ม Create SR
**Expected**
สินค้าที่เลือกถูกส่งไปเป็นรายการตั้งต้นของการสร้าง Store Requisition

---
## TC-SRPL-900001 — กรณีไม่มีสินค้าต้องเติม / empty state
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ไม่มี location ที่มีสินค้าต้องเติม (หรือ filter คำค้นไม่พบ)
**Steps**
1. ไปที่ `/store-operation/stock-replenishment`
2. ตรวจพื้นที่แสดงรายการ
**Expected**
ไม่มีแถว location แสดง; แถบสรุปแสดงค่าเป็น 0 ทุกตัว และไม่มีปุ่ม Create PR/SR
