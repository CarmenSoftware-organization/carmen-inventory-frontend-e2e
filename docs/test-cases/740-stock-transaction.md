# Stock Transaction / Movement — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/inventory-management/transaction`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Stock Transaction / Movement
**Frontend route:** `routes/inventory-management/transaction`  •  **URL:** `/inventory-management/transaction`
**Prefix:** `STKT`
**Default role:** Inventory Controller
**Total test cases:** 21

> หมายเหตุ: โมดูลนี้เป็นหน้า **ledger แบบอ่านอย่างเดียว** (read-only) แสดงประวัติการเคลื่อนไหวสต็อก — ไม่มีการ create / edit / delete จึงเน้นทดสอบ list, filter, summary และความสอดคล้องของยอด in/out

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-STKT-010001 | หน้า Stock Transaction โหลดสำเร็จ | High | Smoke |
| TC-STKT-010002 | คอลัมน์ตาราง (Date/Type/Parent Doc No/Product/Location/Qty In/Qty Out/Items/Total) แสดงครบ | Medium | Functional |
| TC-STKT-010003 | badge ประเภทเอกสาร (SI/SO/GRN/SR/PR/PO/CN) แสดงสีถูกต้อง | Medium | Functional |
| TC-STKT-010004 | ช่องค้นหาใช้งานได้ | Medium | Functional |
| TC-STKT-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-STKT-010006 | sort คอลัมน์ Date ใช้งานได้ | Low | Functional |
| TC-STKT-010007 | pagination เปลี่ยนหน้าได้ และ record count ตรง | Medium | Functional |
| TC-STKT-010050 | active BU = BLAVG | High | Smoke |
| TC-STKT-010060 | summary cards (Total Transactions/Inbound/Outbound/Net Change) แสดง | High | Smoke |
| TC-STKT-010061 | summary Net Change แสดงโทนสีตามค่าบวก/ลบ | Low | Functional |
| TC-STKT-020001 | date range preset (Today/7d/30d/This Month) กรองข้อมูลได้ | High | Functional |
| TC-STKT-020002 | กด preset ซ้ำเพื่อยกเลิกการกรองได้ | Medium | Functional |
| TC-STKT-020003 | filter Location (single-select) ใช้งานได้ | Medium | Functional |
| TC-STKT-020004 | filter Category (single-select) ใช้งานได้ | Medium | Functional |
| TC-STKT-020005 | Reference Type pills (GRN/SR/SI/SO/PC) multi-select ใช้งานได้ | High | Functional |
| TC-STKT-020006 | active filter bar และ Clear All ทำงาน | Medium | Functional |
| TC-STKT-020007 | mobile filter sheet เปิด/ปิด และมี badge นับ filter | Low | Edge Case |
| TC-STKT-030001 | Qty In/Qty Out สอดคล้องกับประเภทเอกสาร (in→เขียว, out→แดง) | High | Functional |
| TC-STKT-030002 | summary inbound/outbound สอดคล้องกับ filter ที่เลือก | Medium | Functional |
| TC-STKT-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Transaction ต้องถูกบล็อก | High | Authorization |
| TC-STKT-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-STKT-900001 | error state แสดงปุ่ม Retry และโหลดข้อมูลใหม่ได้ | Low | Edge Case |

---
## TC-STKT-010001 — หน้า Stock Transaction โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG; มีสิทธิ์เข้าถึง Inventory Management
**Steps**
1. ไปที่ `/inventory-management/transaction`
**Expected**
URL ตรงกับ `/inventory-management/transaction`; หัวข้อหน้า, summary cards และตารางแสดงภายใน 10 วินาที

---
## TC-STKT-010002 — คอลัมน์ตาราง (Date/Type/Parent Doc No/Product/Location/Qty In/Qty Out/Items/Total) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Date, Type, Parent Doc No, Product, Location, Qty In, Qty Out, Items, Total

---
## TC-STKT-010003 — badge ประเภทเอกสาร (SI/SO/GRN/SR/PR/PO/CN) แสดงสีถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลายประเภท
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจ badge ในคอลัมน์ Type
**Expected**
badge แสดงป้าย SI (info), SO (warning), GRN (success), SR (invert), CN (destructive), PR/PO ตามประเภทเอกสารที่ตรงกับข้อมูลแถว

---
## TC-STKT-010004 — ช่องค้นหาใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. พิมพ์คำค้น (เช่น เลขเอกสารอ้างอิง) ลงในช่องค้นหา
**Expected**
รายการในตารางถูกกรองตามคำค้น และ URL state อัปเดต

---
## TC-STKT-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ที่หน้า transaction
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty state

---
## TC-STKT-010006 — sort คอลัมน์ Date ใช้งานได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลายรายการต่างวันที่
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. คลิกหัวคอลัมน์ Date เพื่อสลับลำดับ
**Expected**
รายการถูกเรียงตามวันที่ (audit.created.at) สลับ ascending/descending ตามการคลิก

---
## TC-STKT-010007 — pagination เปลี่ยนหน้าได้ และ record count ตรง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction มากกว่า 1 หน้า (>10 รายการ)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดเปลี่ยนหน้าใน pagination
**Expected**
ตารางแสดงรายการของหน้าถัดไป; จำนวนรวม (paginate.total) ตรงกับที่แสดง

---
## TC-STKT-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ระบบ ensureActiveBu ตั้ง active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจตัวบ่งชี้ business unit ที่ active
**Expected**
Active business unit คือ BLAVG; transaction ที่แสดงเป็นของ BU BLAVG เท่านั้น

---
## TC-STKT-010060 — summary cards (Total Transactions/Inbound/Outbound/Net Change) แสดง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจการ์ดสรุปด้านบน
**Expected**
แสดง 4 การ์ด: Total Transactions, Total Inbound, Total Outbound, Net Change พร้อมค่าและ subtitle (count units) ที่ animate ขึ้น

---
## TC-STKT-010061 — summary Net Change แสดงโทนสีตามค่าบวก/ลบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction inbound/outbound
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจการ์ด Net Change
**Expected**
ค่า Net Change แสดงเครื่องหมาย +/- และโทนสีเขียวเมื่อ >= 0 หรือสีแดงเมื่อ < 0

---
## TC-STKT-020001 — date range preset (Today/7d/30d/This Month) กรองข้อมูลได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลายช่วงวันที่
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม preset "7 Days"
**Expected**
รายการถูกกรองให้อยู่ในช่วง 7 วันล่าสุด; active filter bar แสดง pill ของ date range ที่เลือก

---
## TC-STKT-020002 — กด preset ซ้ำเพื่อยกเลิกการกรองได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; เลือก preset date range ไว้แล้ว
**Steps**
1. กดปุ่ม preset ที่กำลัง active อยู่ซ้ำอีกครั้ง
**Expected**
การกรองช่วงวันที่ถูกยกเลิก และรายการกลับมาแสดงครบ

---
## TC-STKT-020003 — filter Location (single-select) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลาย location
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เลือก location จาก dropdown (placeholder "All Locations")
**Expected**
แสดงเฉพาะ transaction ของ location ที่เลือก; active filter bar แสดง label ของ location

---
## TC-STKT-020004 — filter Category (single-select) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลาย category
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เลือก category จาก dropdown
**Expected**
แสดงเฉพาะ transaction ของ category ที่เลือก และ active filter bar แสดง label

---
## TC-STKT-020005 — Reference Type pills (GRN/SR/SI/SO/PC) multi-select ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลายประเภทเอกสาร
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กด pill "GRN" และ "SR" ในส่วน Reference Type
**Expected**
สามารถเลือกได้หลายค่าพร้อมกัน; แสดงเฉพาะ transaction ที่ inventory_doc_type ตรงกับ pill ที่เลือก

---
## TC-STKT-020006 — active filter bar และ Clear All ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ตั้ง filter date range, location และ ref type ไว้
**Steps**
1. ตั้ง filter หลายตัว
2. กด X ที่ chip หนึ่ง แล้วกด Clear All
**Expected**
chip ที่กด X ถูกลบทีละตัว; กด Clear All ล้าง filter ทั้งหมดและรายการกลับมาแสดงครบ

---
## TC-STKT-020007 — mobile filter sheet เปิด/ปิด และมี badge นับ filter
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ใช้งานบน viewport mobile
**Steps**
1. เปิด `/inventory-management/transaction` บน mobile
2. กดปุ่มไอคอน Filter เพื่อเปิด bottom sheet
3. ตั้ง filter แล้วกด Done
**Expected**
bottom sheet แสดง date range, location/category และ ref type pills; ปุ่ม Filter แสดง badge จำนวน filter ที่ active; กด Done ปิด sheet และ apply filter

---
## TC-STKT-030001 — Qty In/Qty Out สอดคล้องกับประเภทเอกสาร (in→เขียว, out→แดง)
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction ทั้งฝั่ง inbound และ outbound
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจคอลัมน์ Qty In และ Qty Out ของแถวต่าง ๆ
**Expected**
Qty In แสดงตัวเลขสีเขียว (ค่า 0 แสดง "-"); Qty Out แสดงตัวเลขสีแดง/destructive (ค่า 0 แสดง "-") สอดคล้องกับทิศทางการเคลื่อนไหวของเอกสาร

---
## TC-STKT-030002 — summary inbound/outbound สอดคล้องกับ filter ที่เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี transaction หลายประเภท
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตั้ง filter date range หรือ ref type
3. ตรวจค่าในการ์ด Total Inbound / Total Outbound / Net Change
**Expected**
ค่าใน summary cards ปรับตามชุดข้อมูลที่ถูกกรอง และ Net Change = Inbound - Outbound

---
## TC-STKT-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Transaction ต้องถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ไม่มีสิทธิ์ Inventory Management
**Steps**
1. ไปที่ `/inventory-management/transaction`
**Expected**
ระบบบล็อกการเข้าถึง (redirect หรือแสดงข้อความไม่มีสิทธิ์); ไม่แสดงรายการ transaction

---
## TC-STKT-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี session)
**Steps**
1. เปิด URL `/inventory-management/transaction` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login`

---
## TC-STKT-900001 — error state แสดงปุ่ม Retry และโหลดข้อมูลใหม่ได้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; จำลองสถานการณ์ API เรียกข้อมูล transaction ล้มเหลว
**Steps**
1. ไปที่ `/inventory-management/transaction` ขณะ API ล้มเหลว
2. กดปุ่ม Retry
**Expected**
แสดง error state พร้อมปุ่ม Retry; กด Retry เรียก refetch และแสดงข้อมูลเมื่อสำเร็จ
