# Inventory Adjustment — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/inventory-management/inventory-adjustment`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Inventory Adjustment
**Frontend route:** `routes/inventory-management/inventory-adjustment`  •  **URL:** `/inventory-management/inventory-adjustment`
**Prefix:** `IADJ`
**Default role:** Inventory Controller
**Total test cases:** 28

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-IADJ-010001 | หน้า list Inventory Adjustment โหลดสำเร็จ | High | Smoke |
| TC-IADJ-010002 | ปุ่ม Stock In / Stock Out แสดงบน toolbar | High | Smoke |
| TC-IADJ-010003 | คอลัมน์ตาราง (Adjustment/Date/Type/Location/Reason/Items/Total/Status) แสดงครบ | Medium | Functional |
| TC-IADJ-010004 | ช่องค้นหาใช้งานได้ | Medium | Functional |
| TC-IADJ-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-IADJ-010006 | filter Type (Stock In / Stock Out) ใช้งานได้ | Medium | Functional |
| TC-IADJ-010007 | filter Status (draft/in_progress/completed/voided) ใช้งานได้ | Medium | Functional |
| TC-IADJ-010008 | active filter bar และ Clear All ทำงาน | Medium | Functional |
| TC-IADJ-010009 | สลับ List View / Grid View บน desktop ได้ | Low | Functional |
| TC-IADJ-010050 | active BU = BLAVG | High | Smoke |
| TC-IADJ-020001 | คลิกแถวเปิดหน้า detail (view mode) สำเร็จ | High | Smoke |
| TC-IADJ-020002 | หน้า detail แสดง Document Info และ Summary ครบ | Medium | Functional |
| TC-IADJ-030001 | เปิดหน้า new Stock In สำเร็จ | High | Smoke |
| TC-IADJ-030002 | สร้าง Stock In (location/reason/date + 1 item) สำเร็จ | High | CRUD |
| TC-IADJ-030003 | สร้าง Stock Out (location/reason/date + 1 item) สำเร็จ | High | CRUD |
| TC-IADJ-030004 | เพิ่ม line item ได้หลายรายการ | Medium | Functional |
| TC-IADJ-030005 | ลบ line item ได้ (Remove dialog) | Medium | Functional |
| TC-IADJ-030006 | Stock In auto-fill cost per unit จากต้นทุนเฉลี่ย | Medium | Functional |
| TC-IADJ-030050 | สร้าง Inventory Adjustment (controller/BLAVG) สำเร็จ | High | CRUD |
| TC-IADJ-040001 | แก้ description ของ adjustment ที่เป็น draft แล้ว save สำเร็จ | High | CRUD |
| TC-IADJ-040050 | แก้ไข adjustment แล้ว persist หลัง reload | High | CRUD |
| TC-IADJ-050001 | ลบ adjustment ที่เป็น draft สำเร็จ | High | CRUD |
| TC-IADJ-060001 | Void adjustment (ใส่เหตุผล) แล้วเอกสารกลายเป็น read-only | High | Functional |
| TC-IADJ-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Inventory Adjustment ต้องถูกบล็อก | High | Authorization |
| TC-IADJ-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-IADJ-200001 | บันทึกโดยไม่เลือก location ต้องแสดง error | High | Validation |
| TC-IADJ-200002 | บันทึกโดยไม่เลือก reason (adjustment type) ต้องแสดง error | High | Validation |
| TC-IADJ-200003 | บันทึกโดยไม่มี line item ต้องแสดง error | High | Validation |
| TC-IADJ-200004 | qty น้อยกว่า 1 ต้องแสดง error | Medium | Validation |
| TC-IADJ-200005 | date นอกช่วง period ปัจจุบันต้องแสดง error | Medium | Validation |
| TC-IADJ-300001 | Export รายการ adjustment เป็นไฟล์สำเร็จ | Medium | Functional |
| TC-IADJ-900001 | mobile แสดงแบบ card list และ infinite scroll | Low | Edge Case |

---
## TC-IADJ-010001 — หน้า list Inventory Adjustment โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG; มีสิทธิ์เข้าถึง Inventory Management
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
**Expected**
URL ตรงกับ `/inventory-management/inventory-adjustment`; หัวข้อหน้าพร้อม badge จำนวนรวม และตาราง/การ์ดแสดงภายใน 10 วินาที

---
## TC-IADJ-010002 — ปุ่ม Stock In / Stock Out แสดงบน toolbar
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ที่หน้า list (desktop)
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. ตรวจ toolbar ด้านบน
**Expected**
ปุ่ม "Stock In" (variant สีเขียว) และ "Stock Out" (variant สีแดง) แสดง; กด Stock In นำไปยัง `.../new?type=stock-in` และ Stock Out ไปยัง `.../new?type=stock-out`

---
## TC-IADJ-010003 — คอลัมน์ตาราง (Adjustment/Date/Type/Location/Reason/Items/Total/Status) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment อย่างน้อย 1 รายการ; อยู่ใน List View
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Adjustment, Date, Type, Location, Reason, Items, Total, Status; คอลัมน์ Type แสดง badge "STOCK IN"/"STOCK OUT" และ Status แสดง badge Draft/In Progress/Completed/Voided

---
## TC-IADJ-010004 — ช่องค้นหาใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. พิมพ์เลขเอกสาร (si_no/so_no) ลงในช่องค้นหา
**Expected**
รายการในตาราง/การ์ดถูกกรองให้เหลือเฉพาะที่ตรงกับคำค้น

---
## TC-IADJ-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty state

---
## TC-IADJ-010006 — filter Type (Stock In / Stock Out) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มีเอกสารทั้ง stock-in และ stock-out
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. เลือก filter Type = Stock In
**Expected**
แสดงเฉพาะเอกสารที่มี badge "STOCK IN" และ active filter bar แสดง pill ของ filter ที่เลือก

---
## TC-IADJ-010007 — filter Status (draft/in_progress/completed/voided) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มีเอกสารหลายสถานะ
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. เลือก filter Status = Completed
**Expected**
แสดงเฉพาะเอกสารที่มีสถานะ Completed

---
## TC-IADJ-010008 — active filter bar และ Clear All ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ได้ตั้ง filter Type และ Status ไว้
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. ตั้ง filter Type และ Status
3. กด Clear All
**Expected**
ก่อนกด: active filter bar แสดง badge ของแต่ละ filter พร้อมปุ่มลบ (X); หลังกด Clear All filter ทั้งหมดถูกล้างและรายการกลับมาแสดงครบ

---
## TC-IADJ-010009 — สลับ List View / Grid View บน desktop ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ใช้งานบนหน้าจอ desktop
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. กดปุ่มสลับเป็น Grid View แล้วกลับเป็น List View
**Expected**
มุมมองสลับระหว่างตารางและการ์ด grid ได้ถูกต้อง โดยข้อมูลรายการเดียวกันยังคงแสดง

---
## TC-IADJ-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ระบบ ensureActiveBu ตั้ง active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. ตรวจตัวบ่งชี้ business unit ที่ active บน header/โปรไฟล์
**Expected**
Active business unit คือ BLAVG; ข้อมูล adjustment ที่แสดงเป็นของ BU BLAVG เท่านั้น

---
## TC-IADJ-020001 — คลิกแถวเปิดหน้า detail (view mode) สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. คลิกเลขเอกสารในคอลัมน์ Adjustment
**Expected**
นำไปยัง `.../{id}?type=...`; หน้า detail แสดงในโหมด view พร้อม hero header (เลขเอกสาร, type, date, location, status) และปุ่ม Edit

---
## TC-IADJ-020002 — หน้า detail แสดง Document Info และ Summary ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; เปิดเอกสาร adjustment ในโหมด view
**Steps**
1. เปิดหน้า detail ของ adjustment
2. ตรวจการ์ด Document Info และ Summary
**Expected**
Document Info แสดง Date, Reason, Location, Description; Summary แสดง Status, Date, Reason, Location, Lines, Total Qty และ Grand Total พร้อมกล่องข้อมูล posting (เพิ่ม/ลดสต็อก)

---
## TC-IADJ-030001 — เปิดหน้า new Stock In สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. กดปุ่ม "Stock In"
**Expected**
นำไปยัง `.../new?type=stock-in`; ฟอร์มแสดง Document Info (Date/Reason/Location/Description) และ section line items ในโหมด add

---
## TC-IADJ-030002 — สร้าง Stock In (location/reason/date + 1 item) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG; มี location ประเภท inventory และ adjustment type (stock-in) ที่ active
**Steps**
1. เปิดหน้า new Stock In
2. เลือก Date ภายใน period ปัจจุบัน, Reason, Location
3. กด Add Item แล้วเลือก product และกรอก qty
4. กดปุ่ม Create
**Expected**
แสดง toast createSuccess; redirect กลับไปหน้า list; เอกสารใหม่สถานะ Draft แสดงในตาราง

---
## TC-IADJ-030003 — สร้าง Stock Out (location/reason/date + 1 item) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG; มี adjustment type (stock-out) ที่ active และมีสต็อกพอ
**Steps**
1. เปิดหน้า new Stock Out (`.../new?type=stock-out`)
2. เลือก Date, Reason, Location
3. กด Add Item เลือก product และกรอก qty
4. กดปุ่ม Create
**Expected**
แสดง toast createSuccess; redirect กลับหน้า list; เอกสาร badge "STOCK OUT" สถานะ Draft แสดงในตาราง (คอลัมน์ Cost Per Unit ถูกซ่อนในตาราง item ของ stock-out)

---
## TC-IADJ-030004 — เพิ่ม line item ได้หลายรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ในหน้า new และเลือก location แล้ว
**Steps**
1. เปิดหน้า new Stock In และเลือก Location
2. กด Add Item ซ้ำหลายครั้งและเลือก product ต่างกัน
**Expected**
มี row line item เพิ่มขึ้นตามจำนวนครั้งที่กด; product ที่เลือกแล้วถูกตัดออกจากตัวเลือกของ row อื่น; ปุ่ม Add Item ถูก disable เมื่อยังไม่เลือก location

---
## TC-IADJ-030005 — ลบ line item ได้ (Remove dialog)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ในฟอร์มมี line item อย่างน้อย 2 รายการ
**Steps**
1. กดไอคอนถังขยะที่ท้าย row หนึ่ง
2. ยืนยันใน dialog Remove Item
**Expected**
แสดง dialog "Remove Item"; เมื่อยืนยัน row นั้นถูกลบออกจากตาราง

---
## TC-IADJ-030006 — Stock In auto-fill cost per unit จากต้นทุนเฉลี่ย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; เปิดหน้า new Stock In และเลือก location แล้ว
**Steps**
1. กด Add Item แล้วเลือก product ที่มีต้นทุนในระบบ
2. กรอก qty
**Expected**
ช่อง Cost Per Unit และ Total Cost ถูกเติมอัตโนมัติจากต้นทุนเฉลี่ยของ product ที่ location นั้น; Total Cost = qty × cost per unit

---
## TC-IADJ-030050 — สร้าง Inventory Adjustment (controller/BLAVG) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG
**Steps**
1. เปิดหน้า new Stock In
2. กรอก Date/Reason/Location และเพิ่ม 1 item พร้อม qty
3. กด Create
**Expected**
เอกสารถูกสร้างภายใต้ BU BLAVG; toast createSuccess และเอกสารปรากฏในหน้า list

---
## TC-IADJ-040001 — แก้ description ของ adjustment ที่เป็น draft แล้ว save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment สถานะ Draft
**Steps**
1. เปิด detail ของ adjustment สถานะ Draft
2. กด Edit
3. แก้ไขช่อง Description
4. กด Save
**Expected**
แสดง toast updateSuccess; redirect กลับหน้า list; description ใหม่ถูกบันทึก

---
## TC-IADJ-040050 — แก้ไข adjustment แล้ว persist หลัง reload
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; active BU = BLAVG; มี adjustment สถานะ Draft
**Steps**
1. แก้ไข Description ของ adjustment และ Save
2. เปิด detail ของเอกสารเดิมอีกครั้ง (reload)
**Expected**
ค่า Description ที่แก้ไขยังคงอยู่หลังเปิดใหม่

---
## TC-IADJ-050001 — ลบ adjustment ที่เป็น draft สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment สถานะ Draft (ไม่ใช่ voided/completed)
**Steps**
1. เปิด detail ของ adjustment สถานะ Draft
2. กด Edit แล้วกดปุ่ม Delete
3. ยืนยันใน delete dialog
**Expected**
แสดง toast deleteSuccess; redirect กลับหน้า list; เอกสารหายไปจากรายการ

---
## TC-IADJ-060001 — Void adjustment (ใส่เหตุผล) แล้วเอกสารกลายเป็น read-only
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment ที่ยังไม่ voided/completed
**Steps**
1. เปิด detail ของ adjustment แล้วกด Edit
2. กดปุ่ม Void
3. กรอกเหตุผลใน void dialog และยืนยัน
**Expected**
แสดง toast voidSuccess; สถานะเปลี่ยนเป็น Voided; เอกสารกลายเป็น read-only (ไม่มีปุ่ม Edit/Delete/Void)

---
## TC-IADJ-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Inventory Adjustment ต้องถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ไม่มีสิทธิ์ Inventory Management
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
**Expected**
ระบบบล็อกการเข้าถึง (redirect หรือแสดงข้อความไม่มีสิทธิ์); ไม่แสดงรายการ adjustment

---
## TC-IADJ-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี session)
**Steps**
1. เปิด URL `/inventory-management/inventory-adjustment` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login`

---
## TC-IADJ-200001 — บันทึกโดยไม่เลือก location ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ในหน้า new
**Steps**
1. เปิดหน้า new Stock In
2. ปล่อยช่อง Location ว่าง แล้วกด Create
**Expected**
แสดง error ใต้ช่อง Location ("Location is required") และไม่บันทึก

---
## TC-IADJ-200002 — บันทึกโดยไม่เลือก reason (adjustment type) ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ในหน้า new
**Steps**
1. เปิดหน้า new Stock In
2. ปล่อยช่อง Reason ว่าง แล้วกด Create
**Expected**
แสดง error ("Adjustment Type is required") และไม่บันทึก

---
## TC-IADJ-200003 — บันทึกโดยไม่มี line item ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; อยู่ในหน้า new
**Steps**
1. เปิดหน้า new Stock In
2. กรอก Date/Reason/Location แต่ไม่เพิ่ม item ใด ๆ
3. กด Create
**Expected**
แสดง error "At least one product is required" และไม่บันทึก

---
## TC-IADJ-200004 — qty น้อยกว่า 1 ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ในฟอร์มมี line item 1 รายการที่เลือก product แล้ว
**Steps**
1. กรอก qty = 0 ในช่อง Qty ของ line item
2. กด Create
**Expected**
แสดง error "Quantity must be at least 1" ใต้ช่อง Qty และไม่บันทึก

---
## TC-IADJ-200005 — date นอกช่วง period ปัจจุบันต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี period ปัจจุบันที่กำหนด start/end
**Steps**
1. เปิดหน้า new Stock In
2. เลือก Date ที่อยู่นอกช่วง period ปัจจุบัน
3. กด Create
**Expected**
แสดง error "Date is outside the current period" และไม่บันทึก

---
## TC-IADJ-300001 — Export รายการ adjustment เป็นไฟล์สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; มี adjustment อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/inventory-adjustment`
2. กดปุ่ม Export
**Expected**
ไฟล์ถูกดาวน์โหลดพร้อมคอลัมน์ Adjustment, Date, Type, Location, Reason, Items, Total, Status, Description; แสดง toast exportSuccess

---
## TC-IADJ-900001 — mobile แสดงแบบ card list และ infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Inventory Controller; ใช้งานบน viewport ขนาด mobile; มี adjustment จำนวนมาก
**Steps**
1. เปิด `/inventory-management/inventory-adjustment` บน mobile
2. เลื่อนลงจนสุดรายการ
**Expected**
แสดงเป็นการ์ดแทนตาราง และโหลดข้อมูลเพิ่มแบบ infinite scroll เมื่อเลื่อนถึงท้ายรายการ
