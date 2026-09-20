# Stock Transaction / Movement — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/inventory-management/transaction`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Stock Transaction / Movement
**Frontend route:** `routes/inventory-management/transaction`  •  **URL:** `/inventory-management/transaction`
**Prefix:** `STKT`
**Default role:** Admin (`admin@blueledgers.com`, active BU = BLAVG)
**Total test cases:** 38

> **หมายเหตุสำคัญสำหรับผู้รีวิว:** (สอบทานกับโค้ดจริง 2026-09-20 — โมดูลนี้มี 20 คอมมิตหลังจากเขียน catalog รอบแรก โครงหน้าเปลี่ยนไปมาก)
>
> 1. **หน้านี้เป็น ledger อ่านอย่างเดียวจริง ๆ** — มี route เดียว (`routes/router.tsx` → `transaction.route.tsx`) ไม่มีหน้า detail, ไม่มีปุ่ม create/edit/delete และ `DataGridTable` **ไม่ได้รับ `onRowClick`** ดังนั้นแถวไม่ใช่ปุ่ม (ไม่มี `role="button"`, ไม่มี cursor-pointer) — อย่าเขียนเคสที่กดแถวแล้วคาดว่าจะเปิดอะไร
> 2. **ตัวกรองทั้งหมดย้ายเข้าไปอยู่หลังปุ่ม "Filter" แล้ว** (catalog เดิมเขียนเหมือนมี dropdown/pills ลอยอยู่บนหน้า ซึ่งไม่จริงอีกต่อไป) — desktop (`≥768px`) เป็น **popover เมนูสองชั้นแบบ Linear** (`ListFilterMenu`): แถวของ field (icon + ชื่อ + ค่าย่อ + chevron) hover แล้ว submenu เด้งฝั่งขวา; mobile (`<768px`) ยังเป็น **bottom sheet** เดิม (`ListFilter`) · ค่าที่เลือก **มีผลทันที** ไม่ใช่ draft — ปุ่ม Done ในชีทมือถือแค่ปิดชีทเฉย ๆ
> 3. **ข้อความปุ่มล้างคือ "Clear"** (`common.clearAll` = `"Clear"`) ไม่ใช่ "Clear All" และหัวแถบ chip คือ **"Filters:"** (`common.activeFilter`) — อย่า locator ด้วยข้อความเดิม
> 4. **ชิปประเภทเอกสารเปลี่ยนความหมายสีทั้งชุด** — เดิมเป็น Badge ทึบเจ็ดสี ตอนนี้เป็น `StatusDotBadge` (ชิปสีกลาง + จุดสีเดียว) ที่สีบอก **ทิศทางของของ** ไม่ใช่ชนิดเอกสาร: SI/GRN = เขียว (success), SO/SR/CN = เหลือง (warning), PR/PO = เทา (neutral) · เคส `TC-STKT-010003` เดิมยืนยันชุดสีที่ตรงข้ามกับโค้ดปัจจุบัน (SI=info, CN=destructive, SR=invert) จึงถูกเขียนใหม่ทั้งบล็อก
> 5. **คอลัมน์เปลี่ยนชื่อ/เพิ่มคอลัมน์** — หัวคอลัมน์คือ `Document No.` (`inventoryManagement.transaction.parentDocNo`) ไม่ใช่ "Parent Doc No" อีกแล้ว และมีคอลัมน์ลำดับ `#` (`indexColumn`) นำหน้าเสมอ รวมเป็น 10 คอลัมน์
> 6. **ค้นหาไม่ทำงานระหว่างพิมพ์** — `SearchInput` ยิง `onSearch` เฉพาะตอนกด **Enter** หรือกดปุ่มแว่นขยาย (มีค่าอยู่แล้วปุ่มจะกลายเป็น X = ล้างคำค้น)
> 7. **ข้อความบน chip ของ Location/Category เป็นตัวเลข ไม่ใช่ชื่อ** — `chipValueText` เห็นค่าเป็น uuid จึงคืนจำนวนรายการ ("1") ชื่อคลังที่ cache ไว้ (`locationLabel`) ใช้เป็น `defaultLabel` ของ combobox เท่านั้น · และ chip ของ "Select date range" จะแสดง **`00.000Z`** เพราะสูตรเดียวกันตัดข้อความหลัง `:` ตัวสุดท้ายของ ISO string — **อย่า assert ข้อความค่าบน chip สองตัวนี้** ให้ assert ที่ label + การมีอยู่ของ chip แทน
> 8. **`sort` ที่ส่งไป backend ใช้ชื่อคอลัมน์ของ TanStack** — `audit.created.at` ถูกแปลงเป็น id `audit_created_at` (จุดกลายเป็น `_`) จึงได้ `?sort=audit_created_at:asc` · คอลัมน์ Product/Location ประกาศ `accessorKey: "product"` / `"location"` ซึ่ง **ไม่มีอยู่จริงใน payload** (ชื่ออยู่ใน `details[]`) จึงเรียงได้ที่ UI แต่ส่ง key ที่ backend อาจไม่รู้จัก — เคสในเอกสารนี้ assert แค่ URL/ทิศของไอคอน ไม่ assert ลำดับแถว ผู้แปลงเป็น spec ควรยืนยันกับ backend ก่อนจะยกระดับ
> 9. **การบล็อกสิทธิ์เป็นหน้าที่ของ `RouteGuard`** (ใน `routes/root-layout.tsx`) ไม่ใช่ของหน้านี้ — เช็ค **license ก่อน permission** แต่สวิตช์ `LICENSE_ENFORCEMENT` default เป็น `false` จึงปกติจะบล็อกด้วย permission `inventory_management.view` เท่านั้น · `useCan()` มี **admin bypass** (`defaultBu.system_level === "admin"` ผ่านทุกข้อ) ดังนั้น `TC-STKT-100001` ต้องใช้ผู้ใช้ที่ไม่ใช่ admin และไม่มีสิทธิ์นี้ — **ยังไม่ได้ยืนยันว่าบัญชีใดใน `tests/test-users.ts` เข้าเงื่อนไข ต้องตรวจ `defaultBu.permissions` ของแต่ละ role ก่อนเขียน spec (blocker)**
> 10. **`TC-STKT-010007` เป็น regression guard ของบั๊กจริง** — เคยกดเปลี่ยนหน้าแล้ว URL/query เปลี่ยนแต่ตารางค้างแถวเดิม (React Compiler reuse ก้อน JSX) แก้ด้วย directive `"use no memo"` ใน `transaction-component.tsx` · ให้ assert **เนื้อแถว/เลข `#`** ไม่ใช่แค่ URL ไม่งั้นเคสจะผ่านทั้งที่บั๊กกลับมา
> 11. **ค่าบนการ์ดสรุป animate ด้วย `useCountUp` 800ms** (นับจาก 0 ขึ้นไป) — อย่าอ่านค่าทันทีหลังโหลด ให้รอจนค่านิ่ง
> 12. **query ไม่ยิงจนกว่า `buCode` จะพร้อม** (`enabled: !!buCode` ใน `use-transaction.ts`, query key = `[TRANSACTIONS, buCode, params]`) — สลับ BU แล้วรายการโหลดใหม่ทั้งชุด
> 13. **ข้อเท็จจริงที่ดูเหมือนบั๊ก แต่เอกสารนี้ไม่ตั้งเป็นเคส** — (ก) subtitle ของการ์ด Net Change ใช้คีย์ `unitsNet` = `"+{count} units net"` ซึ่งมีเครื่องหมาย `+` ติดมาเสมอแม้ค่าติดลบ (ต่างจากตัวเลขหลักที่ผ่าน `formatSigned`) · (ข) Reference Type มีตัวเลือก **PC** (`physical_count`) แต่ `TransactionDocType` และ `DOC_TYPE_CONFIG` ไม่มีชนิดนี้ ถ้า backend คืนแถวชนิดนี้จริง ชิปจะ fallback เป็นข้อความดิบ + จุดเทา
> 14. **ไม่มีเคสของ saved view ที่เป็น scope `bu`** เพราะปุ่มตัวเลือก "Everyone in this business unit" ใน `SaveViewDialog` แสดงเฉพาะเมื่อ `canManageBu` ซึ่งขึ้นกับสิทธิ์ของบัญชีที่ใช้ทดสอบ — ยืนยันก่อนค่อยเพิ่ม

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-STKT-010001 | หน้า Transaction โหลดสำเร็จ | High | Smoke |
| TC-STKT-010002 | ตารางแสดงครบ 10 คอลัมน์ตามลำดับ | Medium | Functional |
| TC-STKT-010003 | ชิปประเภทเอกสารแสดงตัวย่อ + จุดสีตามทิศทางของ | Medium | Functional |
| TC-STKT-010004 | ค้นหาด้วยการกด Enter และอัปเดต URL | Medium | Functional |
| TC-STKT-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-STKT-010006 | เรียงลำดับคอลัมน์ Date สลับ asc/desc/ยกเลิกได้ | Low | Functional |
| TC-STKT-010007 | เปลี่ยนหน้าแล้วแถวในตารางเปลี่ยนตามจริง | High | Functional |
| TC-STKT-010008 | เปลี่ยนจำนวนแถวต่อหน้า (Rows) ได้ | Low | Functional |
| TC-STKT-010009 | คอลัมน์ที่เรียงได้เป็นปุ่ม ส่วนคอลัมน์คำนวณเรียงไม่ได้ | Low | Functional |
| TC-STKT-010050 | รายการผูกกับ active BU = BLAVG | High | Smoke |
| TC-STKT-010060 | การ์ดสรุป 4 ใบแสดงครบพร้อม subtitle | High | Smoke |
| TC-STKT-010061 | Net Change แสดงเครื่องหมายและโทนสีตามค่าบวก/ลบ | Low | Functional |
| TC-STKT-010062 | Total Inbound/Outbound แสดงเป็นจำนวนเงิน ไม่ใช่จำนวนหน่วย | Medium | Functional |
| TC-STKT-020001 | preset ช่วงวันที่ (Today/7 Days/30 Days/This Month) กรองได้ | High | Functional |
| TC-STKT-020002 | กด preset ที่ active ซ้ำเพื่อยกเลิกการกรอง | Medium | Functional |
| TC-STKT-020003 | filter Location เลือกได้ทีละคลัง | Medium | Functional |
| TC-STKT-020004 | filter Category เลือกได้ทีละหมวด | Medium | Functional |
| TC-STKT-020005 | Reference Type เลือกได้หลายค่าพร้อมกัน | High | Functional |
| TC-STKT-020006 | แถบ Filters แสดง chip, ลบทีละตัว และ Clear ล้างทั้งหมด | Medium | Functional |
| TC-STKT-020007 | mobile: bottom sheet ของ filter เปิด/ปิดและ apply ได้ | Low | Edge Case |
| TC-STKT-020008 | desktop: ปุ่ม Filter เปิดเมนู field และ submenu เด้งตอน hover | High | Functional |
| TC-STKT-020009 | เลือกช่วงวันที่กำหนดเองเขียนค่าคู่ from/to และลบพร้อมกัน | High | Functional |
| TC-STKT-020010 | ช่วงวันที่กำหนดเองมีลำดับความสำคัญเหนือ preset | Medium | Functional |
| TC-STKT-020011 | badge บนปุ่ม Filter นับจำนวน filter ที่ใช้งานอยู่ | Medium | Functional |
| TC-STKT-020012 | คลิกที่ตัว chip เพื่อแก้ค่า filter ได้ทันที | Medium | Functional |
| TC-STKT-020013 | บันทึกตัวกรองปัจจุบันเป็น saved view ใหม่ | Medium | Functional |
| TC-STKT-020014 | เลือก saved view แล้วตัวกรองถูก apply กลับมา | Medium | Functional |
| TC-STKT-020015 | แก้ตัวกรองหลัง apply view แล้วขึ้น (modified) และ Revert ได้ | Low | Functional |
| TC-STKT-020016 | แถว Clear ในเมนู Filter ถูก disable เมื่อยังไม่มีตัวกรอง | Low | Edge Case |
| TC-STKT-030001 | Qty In/Qty Out เป็นผลรวมของ details และแสดง "-" เมื่อเป็น 0 | High | Functional |
| TC-STKT-030002 | ค่าในการ์ดสรุปเปลี่ยนตามตัวกรองที่เลือก | Medium | Functional |
| TC-STKT-030003 | Items นับจำนวน details และ Product/Location ตัดชื่อซ้ำ | Medium | Functional |
| TC-STKT-030004 | Total เป็นผลรวม total_cost พร้อมรหัสสกุลเงินหลัก | Medium | Functional |
| TC-STKT-100001 | ผู้ใช้ที่ไม่มีสิทธิ์ inventory_management.view ถูกบล็อก | High | Authorization |
| TC-STKT-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ถูก redirect ไป /login | High | Auth-guard |
| TC-STKT-900001 | error state แสดงปุ่ม Try again และโหลดข้อมูลใหม่ได้ | Low | Edge Case |
| TC-STKT-900002 | ไม่มีข้อมูลเลย: การ์ดสรุปเป็น 0 และไม่มีแถบแบ่งหน้า | Low | Edge Case |
| TC-STKT-900003 | เปิดลิงก์ที่มี sv ของ view ที่ถูกลบแล้ว | Low | Edge Case |

---
## TC-STKT-010001 — หน้า Transaction โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (`admin@blueledgers.com`); active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/transaction`
**Expected**
URL ตรงกับ `/inventory-management/transaction`; หัวหน้าเพจแสดงไอคอนโมดูล + หัวข้อ `Transaction` + คำอธิบาย `Every movement of stock, in and out, with the document behind it.`; มีแถวเครื่องมือ (ช่องค้นหา + ปุ่ม view + ปุ่ม `Filter`), การ์ดสรุป 4 ใบ และตารางข้อมูลปรากฏภายใน 10 วินาที; เมื่อมีข้อมูล จะมี badge จำนวนรวมอยู่ข้างหัวข้อ

---
## TC-STKT-010002 — ตารางแสดงครบ 10 คอลัมน์ตามลำดับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจหัวคอลัมน์ของตารางจากซ้ายไปขวา
**Expected**
หัวคอลัมน์เรียงเป็น `#`, `Date`, `Type`, `Document No.`, `Product`, `Location`, `Qty In`, `Qty Out`, `Items`, `Total` ครบ 10 คอลัมน์; คอลัมน์ `#` แสดงลำดับต่อเนื่องตามหน้า (หน้า 2 เริ่มที่ 11 เมื่อ perpage = 10)

---
## TC-STKT-010003 — ชิปประเภทเอกสารแสดงตัวย่อ + จุดสีตามทิศทางของ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction หลายประเภทเอกสาร
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจชิปในคอลัมน์ `Type` ของแต่ละแถว
**Expected**
แต่ละแถวแสดงชิปสีกลาง (secondary) ที่มีจุดสีนำหน้าตัวอักษรย่อ; ตัวย่อตรงกับชนิดเอกสาร — `stock_in`→SI, `good_received_note`→GRN, `stock_out`→SO, `store_requisition`→SR, `credit_note`→CN, `purchase_request`→PR, `purchase_order`→PO; สีของจุดบอกทิศทางของ: SI/GRN = เขียว (success), SO/SR/CN = เหลือง (warning), PR/PO = เทา (neutral); ตัวอักษรบนชิปไม่ถูกย้อมสีตามสถานะ

---
## TC-STKT-010004 — ค้นหาด้วยการกด Enter และอัปเดต URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ทราบเลขเอกสาร (`Document No.`) ของแถวใดแถวหนึ่ง
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. พิมพ์เลขเอกสารลงในช่องค้นหา (ยังไม่กด Enter) แล้วสังเกตว่าตารางยังไม่เปลี่ยน
3. กด Enter
4. กดปุ่ม X ท้ายช่องค้นหาเพื่อล้างคำค้น
**Expected**
ระหว่างพิมพ์ตารางยังไม่ถูกกรอง (ยิงค้นหาเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น); หลังกด Enter URL มี `search=<คำค้น>` และ `page` ถูกรีเซ็ต; ตารางแสดงเฉพาะรายการที่ตรงคำค้น; กด X แล้ว `search` หายจาก URL และรายการกลับมาครบ

---
## TC-STKT-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่หน้า transaction
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999` แล้วกด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty state ข้อความ `No data found` พร้อมภาพประกอบโฟลเดอร์ว่าง; แถบแบ่งหน้าไม่ถูก render (เพราะจำนวนรายการเป็น 0)

---
## TC-STKT-010006 — เรียงลำดับคอลัมน์ Date สลับ asc/desc/ยกเลิกได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction หลายรายการต่างวันที่; เปิดหน้าโดยยังไม่มี `sort` ใน URL
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. คลิกหัวคอลัมน์ `Date` (เป็นปุ่ม) ครั้งที่ 1
3. คลิกครั้งที่ 2
4. คลิกครั้งที่ 3
**Expected**
ครั้งที่ 1 URL ได้ `sort=audit_created_at:asc` และไอคอนบนหัวคอลัมน์เป็นลูกศรขึ้น; ครั้งที่ 2 ได้ `sort=audit_created_at:desc` และไอคอนเป็นลูกศรลง; ครั้งที่ 3 `sort` ถูกล้างออกจาก URL และไอคอนกลับเป็นลูกศรสองทาง; ทุกครั้งที่เปลี่ยนการเรียง หน้าจะถูกรีเซ็ตกลับหน้า 1

---
## TC-STKT-010007 — เปลี่ยนหน้าแล้วแถวในตารางเปลี่ยนตามจริง
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction มากกว่า 1 หน้า (มากกว่า 10 รายการ)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. จดเลข `#` และเลขเอกสารของแถวแรกในหน้า 1
3. กดปุ่มหน้า 2 (หรือปุ่มลูกศรถัดไป) ในแถบแบ่งหน้า
4. กดกลับหน้า 1
**Expected**
แถบแบ่งหน้าแสดง `Showing 1–10 of <จำนวนรวม>` ในหน้า 1; หลังไปหน้า 2 URL ได้ `page=2`, ข้อความเปลี่ยนเป็น `Showing 11–20 of <จำนวนรวม>` และ **เนื้อแถว + เลข `#` เปลี่ยนจริง** (แถวแรกของหน้า 2 มี `#` = 11 และเลขเอกสารต่างจากที่จดไว้); กดกลับหน้า 1 แล้วแถวกลับมาเป็นชุดเดิม (regression guard ของบั๊กตารางค้างหน้าเดิม)

---
## TC-STKT-010008 — เปลี่ยนจำนวนแถวต่อหน้า (Rows) ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction มากกว่า 25 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เปิด dropdown `Rows` ในแถบแบ่งหน้า แล้วเลือก `25`
**Expected**
ตัวเลือกใน dropdown คือ 5 / 10 / 25 / 50 / 100 (ค่าเริ่มต้น 10); หลังเลือก 25 URL ได้ `perpage=25`, ตารางแสดงสูงสุด 25 แถว และข้อความเปลี่ยนเป็น `Showing 1–25 of <จำนวนรวม>`

---
## TC-STKT-010009 — คอลัมน์ที่เรียงได้เป็นปุ่ม ส่วนคอลัมน์คำนวณเรียงไม่ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจว่าหัวคอลัมน์ใดเป็นปุ่มกดได้ (มีไอคอนเรียงลำดับ) และหัวคอลัมน์ใดเป็นข้อความเฉย ๆ
**Expected**
หัวคอลัมน์ `Date`, `Type`, `Document No.`, `Product`, `Location` เป็นปุ่มและมีไอคอนเรียงลำดับ; หัวคอลัมน์ `#`, `Qty In`, `Qty Out`, `Items`, `Total` เป็นข้อความเฉย ๆ ไม่มีไอคอนเรียงลำดับและกดไม่ได้ (เป็นคอลัมน์คำนวณจาก `details[]` ไม่มี accessor)

---
## TC-STKT-010050 — รายการผูกกับ active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin ที่มีสิทธิ์ใน BU BLAVG; โปรไฟล์โหลดเสร็จแล้ว
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. ตรวจตัวบ่งชี้ business unit ที่ active บน navbar
3. ดักดู request ที่ยิงไปยัง endpoint transaction
**Expected**
Active business unit คือ BLAVG; request ของรายการ transaction มี buCode ของ BLAVG อยู่ใน path; ก่อนโปรไฟล์ (และ buCode) พร้อม จะไม่มีการยิง request ของหน้านี้เลย

---
## TC-STKT-010060 — การ์ดสรุป 4 ใบแสดงครบพร้อม subtitle
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. รอให้ค่าตัวเลขบนการ์ดนิ่ง (มี animation นับขึ้นประมาณ 0.8 วินาที)
3. ตรวจหัวข้อและ subtitle ของการ์ดทั้งสี่
**Expected**
แสดง 4 การ์ดเรียงกัน: `Total Transactions` (subtitle `<n> adjustments`), `Total Inbound` (subtitle `<n> units received`), `Total Outbound` (subtitle `<n> units issued`), `Net Change` (subtitle `+<n> units net`); บนจอกว้างจัดเป็น 4 คอลัมน์ บนจอแคบจัดเป็น 2 คอลัมน์

---
## TC-STKT-010061 — Net Change แสดงเครื่องหมายและโทนสีตามค่าบวก/ลบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีชุดข้อมูลที่ทำให้ Net Change เป็นบวกได้ และอีกชุดที่ทำให้ติดลบได้ (ใช้ตัวกรอง Reference Type เลือกเฉพาะขาเข้า/ขาออกช่วยจัดสถานการณ์)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กรอง Reference Type ให้เหลือเฉพาะเอกสารขาเข้า (GRN/SI) แล้วดูการ์ด Net Change
3. เปลี่ยนตัวกรองให้เหลือเฉพาะเอกสารขาออก (SR/SO) แล้วดูการ์ดเดิมอีกครั้ง
**Expected**
เมื่อค่ามากกว่าหรือเท่ากับ 0 ตัวเลขนำหน้าด้วย `+` และใช้โทนสีเขียว (success); เมื่อค่าน้อยกว่า 0 ตัวเลขนำหน้าด้วย `-` และใช้โทนสีแดง (destructive) ทั้งไอคอนและตัวเลข

---
## TC-STKT-010062 — Total Inbound/Outbound แสดงเป็นจำนวนเงิน ไม่ใช่จำนวนหน่วย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction ที่มีต้นทุนมากกว่า 0
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เทียบตัวเลขหลักของการ์ด `Total Inbound` / `Total Outbound` กับ subtitle ใต้การ์ด
**Expected**
ตัวเลขหลักของทั้งสองการ์ดเป็นจำนวนเงิน (จัดรูปแบบตาม amount format ของโปรไฟล์ มีทศนิยม/ตัวคั่นหลักพัน) ส่วนจำนวนหน่วยอยู่ใน subtitle (`units received` / `units issued`) เท่านั้น; การ์ด `Total Transactions` เป็นจำนวนนับล้วน ไม่จัดรูปแบบเป็นเงิน

---
## TC-STKT-020001 — preset ช่วงวันที่ (Today/7 Days/30 Days/This Month) กรองได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport desktop (กว้างอย่างน้อย 768px); มี transaction หลายช่วงวันที่
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วชี้ที่แถว `Date Range`
3. ใน submenu กดปุ่ม `7 Days`
**Expected**
submenu แสดงปุ่ม 4 ตัวเรียงติดกัน: `Today`, `7 Days`, `30 Days`, `This Month`; หลังกด `7 Days` ปุ่มนั้นเปลี่ยนเป็นสถานะเลือก (พื้นสี primary), URL ได้ `dateRange=7d` และ `page` ถูกรีเซ็ต; แถบ `Filters:` แสดง chip ของ `Date Range`; request ที่ยิงมี clause `created_at|daterange:<7 วันก่อน>,<วันนี้>` อยู่ในพารามิเตอร์ `filter`

---
## TC-STKT-020002 — กด preset ที่ active ซ้ำเพื่อยกเลิกการกรอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; เลือก preset `7 Days` ไว้แล้ว (`dateRange=7d` อยู่ใน URL)
**Steps**
1. กดปุ่ม `Filter` แล้วชี้ที่แถว `Date Range`
2. กดปุ่ม `7 Days` ที่กำลัง active อยู่ซ้ำอีกครั้ง
**Expected**
ปุ่มกลับเป็นสถานะไม่เลือก; `dateRange` หายจาก URL; chip ของ `Date Range` หายจากแถบ `Filters:`; clause ช่วงวันที่หายจากพารามิเตอร์ `filter` และรายการกลับมาแสดงครบ

---
## TC-STKT-020003 — filter Location เลือกได้ทีละคลัง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location ที่ `is_active = true` อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วชี้ที่แถว `Location`
3. กดปุ่ม combobox ใน submenu (ข้อความเริ่มต้น `All Locations`) แล้วเลือก location หนึ่งรายการ
**Expected**
รายการใน combobox แสดงเป็น badge รหัสคลัง + ชื่อคลัง + ป้ายประเภทคลัง และค้นหาได้; เลือกแล้ว URL ได้ `location_id=<uuid>` และ `page` ถูกรีเซ็ต; request มี clause `location_id:<uuid>`; แถบ `Filters:` แสดง chip ที่มี label `Location` (ค่าบน chip เป็นตัวเลขนับรายการ ไม่ใช่ชื่อคลัง — ดูหมายเหตุข้อ 7)

---
## TC-STKT-020004 — filter Category เลือกได้ทีละหมวด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี product category อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วชี้ที่แถว `Category`
3. กดปุ่ม combobox ใน submenu (ข้อความเริ่มต้น `Select category`) แล้วเลือกหมวดหนึ่งรายการ
**Expected**
URL ได้ `category_id=<uuid>` และ `page` ถูกรีเซ็ต; request มี clause `category_id:<uuid>`; แถบ `Filters:` แสดง chip ที่มี label `Category`

---
## TC-STKT-020005 — Reference Type เลือกได้หลายค่าพร้อมกัน
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction หลายประเภทเอกสาร
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วชี้ที่แถว `Reference Type`
3. กด pill `GRN` แล้วกด pill `SR` ต่อ
4. กด pill `GRN` ซ้ำเพื่อเอาออก
**Expected**
submenu แสดง pill 5 ตัว: `GRN`, `SR`, `SI`, `SO`, `PC`; pill ที่เลือกเปลี่ยนเป็นขอบ/พื้นสี primary; หลังเลือกสองค่า URL ได้ `inventory_doc_type=good_received_note,store_requisition` และ request มี clause `inventory_doc_type|in:good_received_note,store_requisition`; chip ในแถบ `Filters:` แสดง label `Reference Type` พร้อมค่าย่อแบบ `good received note +1`; กด `GRN` ซ้ำแล้วเหลือเฉพาะ `store_requisition`

---
## TC-STKT-020006 — แถบ Filters แสดง chip, ลบทีละตัว และ Clear ล้างทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ตั้งตัวกรองไว้อย่างน้อย 2 ตัว เช่น `Date Range` = 7 Days และ `Reference Type` = GRN
**Steps**
1. ตรวจแถบ chip ที่อยู่ใต้แถวเครื่องมือ
2. กดปุ่ม X บน chip ของ `Date Range`
3. กดลิงก์ `Clear` ที่ท้ายแถบ
**Expected**
แถบขึ้นต้นด้วยข้อความ `Filters:` และมี chip หนึ่งตัวต่อหนึ่งตัวกรองที่ตั้งไว้; กด X แล้ว chip นั้นหายและค่า key ของมันหายจาก URL ทีละตัว; กด `Clear` แล้ว chip หายหมด, ค่าตัวกรองทุก key (รวม `sv`) ถูกล้างจาก URL, แถบ chip หายไปทั้งแถบ และรายการกลับมาแสดงครบ

---
## TC-STKT-020007 — mobile: bottom sheet ของ filter เปิด/ปิดและ apply ได้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ตั้ง viewport กว้างน้อยกว่า 768px
**Steps**
1. เปิด `/inventory-management/transaction` บน viewport มือถือ
2. กดปุ่ม `Filter`
3. เลือก preset `30 Days` ในหัวข้อ `Date`
4. กดปุ่ม `Done`
**Expected**
เปิดเป็น bottom sheet (ไม่ใช่ popover เมนู) หัวข้อ `Filter` พร้อมกลุ่มหัวข้อ `Date`, `Location`, `Category`, `Document` เรียงตามลำดับ และมี field label กำกับแต่ละ control; ค่าที่เลือกมีผลทันทีตั้งแต่ก่อนกด Done (URL ได้ `dateRange=30d`); footer มีปุ่ม `Clear`, `Save current filters as view`, `Done`; กด `Done` แล้ว sheet ปิดโดยค่าตัวกรองยังอยู่

---
## TC-STKT-020008 — desktop: ปุ่ม Filter เปิดเมนู field และ submenu เด้งตอน hover
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport desktop (กว้างอย่างน้อย 768px)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter`
3. เลื่อนเมาส์ไปที่แถว `Location`
4. เลื่อนออกไปนอกแถวและ submenu
**Expected**
เปิดเป็น popover รายชื่อ field พร้อมไอคอนและ chevron ท้ายแถว เรียงเป็น `Date Range`, `Select date range`, `Location`, `Category`, `Reference Type` และมีเส้นคั่นเมื่อขึ้นกลุ่มใหม่; ท้ายเมนูมีแถว `Clear` และ `Save current filters as view`; hover แถว `Location` แล้ว submenu เด้งออกมาฝั่งข้างโดยไม่ต้องคลิก (คลิกที่แถวก็เปิด/ปิดได้เช่นกัน); เลื่อนเมาส์ออกแล้ว submenu ปิดตัวเอง (มีหน่วงเล็กน้อยกันเมาส์หลุดระหว่างลาก); field ที่ซ่อน (`created_at_to`) ไม่ปรากฏเป็นแถวในเมนู

---
## TC-STKT-020009 — เลือกช่วงวันที่กำหนดเองเขียนค่าคู่ from/to และลบพร้อมกัน
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport desktop; ยังไม่มี `created_at_from` / `created_at_to` ใน URL
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วชี้ที่แถว `Select date range`
3. เลือกวันเริ่มต้นและวันสิ้นสุดบนปฏิทินใน submenu
4. ปิดเมนู แล้วกดปุ่ม X บน chip ของ `Select date range`
**Expected**
submenu แสดงปฏิทินแบบช่วง (สองเดือน) ตรง ๆ โดยไม่มีปุ่ม trigger ซ้อน; หลังเลือกครบสองวัน URL ได้ทั้ง `created_at_from` และ `created_at_to`; request มี clause `created_at|daterange:<YYYY-MM-DD>,<YYYY-MM-DD>`; แถบ `Filters:` มี chip **เพียงตัวเดียว** ชื่อ `Select date range` (ไม่มี chip ซ้ำของ key คู่); กด X บน chip นั้นแล้วทั้ง `created_at_from` และ `created_at_to` หายจาก URL พร้อมกัน

---
## TC-STKT-020010 — ช่วงวันที่กำหนดเองมีลำดับความสำคัญเหนือ preset
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport desktop
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เลือก preset `Today` ในแถว `Date Range`
3. เลือกช่วงวันที่กำหนดเองในแถว `Select date range` ให้เป็นช่วงที่ต่างจากวันนี้ชัดเจน
4. ดักดู request ที่ยิงหลังขั้นตอนที่ 3
**Expected**
chip ของทั้ง `Date Range` และ `Select date range` ปรากฏพร้อมกันในแถบ `Filters:` (ทั้งคู่ยังเป็นค่าที่ตั้งอยู่จริง); แต่ clause `created_at|daterange:` ใน request ใช้วันที่จาก **ช่วงที่กำหนดเอง** ไม่ใช่ของ preset; ลบ chip ของช่วงกำหนดเองออกแล้ว clause กลับไปใช้ช่วงของ preset `Today`

---
## TC-STKT-020011 — badge บนปุ่ม Filter นับจำนวน filter ที่ใช้งานอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ยังไม่มีตัวกรองใด ๆ
**Steps**
1. ไปที่ `/inventory-management/transaction` แล้วดูปุ่ม `Filter`
2. ตั้งตัวกรอง `Date Range` = 7 Days
3. ตั้งตัวกรอง `Reference Type` = GRN เพิ่ม
4. เลือกช่วงวันที่กำหนดเองเพิ่มอีกหนึ่งช่วง
**Expected**
ตอนแรกปุ่ม `Filter` ไม่มี badge; ตั้ง 1 ตัวได้ badge `1`; ตั้งเพิ่มเป็น 2 ตัวได้ badge `2`; หลังเพิ่มช่วงวันที่กำหนดเองได้ badge `3` — นับเท่ากับจำนวน chip ในแถบ `Filters:` เสมอ (key ที่ซ่อนอย่าง `created_at_to` ไม่ถูกนับซ้ำ)

---
## TC-STKT-020012 — คลิกที่ตัว chip เพื่อแก้ค่า filter ได้ทันที
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ตั้งตัวกรอง `Reference Type` = GRN ไว้แล้ว
**Steps**
1. คลิกที่ตัวข้อความของ chip `Reference Type` ในแถบ `Filters:` (ไม่ใช่ปุ่ม X)
2. ใน popover ที่เปิดขึ้น กด pill `SR` เพิ่ม
**Expected**
คลิกที่ chip แล้วเปิด popover ที่มี control ชุดเดียวกับใน submenu ของเมนู Filter; เลือกค่าเพิ่มแล้วมีผลทันที — URL อัปเดตเป็น `inventory_doc_type=good_received_note,store_requisition` และค่าย่อบน chip เปลี่ยนตาม; ปุ่ม X ของ chip ยังทำงานแยกจากส่วนที่กดเปิด popover

---
## TC-STKT-020013 — บันทึกตัวกรองปัจจุบันเป็น saved view ใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ตั้งตัวกรองไว้อย่างน้อย 1 ตัว; ยังไม่มี view ชื่อที่จะใช้ทดสอบ
**Steps**
1. กดปุ่ม `Filter` แล้วเลือกแถว `Save current filters as view` (หรือกดจากเมนู view ก็ได้)
2. กรอกชื่อ view ที่ไม่ซ้ำ
3. กดปุ่มบันทึก
**Expected**
เมนู Filter ปิดแล้วเปิด dialog หัวข้อ `Save view` ที่มีช่อง `View name` และตัวเลือก `Visibility` (อย่างน้อยมี `Only me`); บันทึกแล้ว dialog ปิด, ขึ้น toast แจ้งว่าบันทึก view แล้ว, URL ได้พารามิเตอร์ `sv=<id ของ view>` และปุ่ม view บนแถวเครื่องมือเปลี่ยนจาก `No view` เป็นชื่อ view ที่เพิ่งบันทึก

---
## TC-STKT-020014 — เลือก saved view แล้วตัวกรองถูก apply กลับมา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี saved view ของหน้านี้อยู่แล้วอย่างน้อย 1 รายการ (จาก TC-STKT-020013); ปัจจุบันไม่ได้ apply view ใด
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม view (ข้อความ `No view`)
3. คลิกชื่อ view ในกลุ่ม `My views`
**Expected**
เมนูแสดงแถว `No view`, กลุ่ม `My views` (และ `Business unit views` เมื่อมี) และแถวท้าย `Save current filters as view`; คลิกชื่อ view แล้ว URL ถูกเขียนใหม่ด้วยค่าตัวกรองของ view นั้นพร้อม `sv=<id>` และ `page` ถูกรีเซ็ต; แถบ `Filters:` แสดง chip ตรงกับตัวกรองที่บันทึกไว้; ปุ่ม view แสดงชื่อ view นั้น

---
## TC-STKT-020015 — แก้ตัวกรองหลัง apply view แล้วขึ้น (modified) และ Revert ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; กำลัง apply saved view อยู่ (`sv` อยู่ใน URL)
**Steps**
1. เพิ่มหรือเปลี่ยนตัวกรองหนึ่งตัวให้ต่างจากที่ view บันทึกไว้
2. เปิดเมนู view
3. เลือก `Revert to view`
**Expected**
หลังแก้ตัวกรอง ปุ่ม view แสดงชื่อ view ต่อท้ายด้วย `(modified)`; เมนู view มีชุดคำสั่งเพิ่มด้านบน ได้แก่ `Update this view`, `Save as new view`, `Revert to view`; กด `Revert to view` แล้วตัวกรองกลับไปเป็นชุดที่ view บันทึกไว้ และ `(modified)` หายไป

---
## TC-STKT-020016 — แถว Clear ในเมนู Filter ถูก disable เมื่อยังไม่มีตัวกรอง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; เปิดหน้าโดยไม่มีตัวกรองใด ๆ ใน URL
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. กดปุ่ม `Filter` แล้วดูแถว `Clear` ท้ายเมนู
3. ตั้งตัวกรองหนึ่งตัว แล้วเปิดเมนูดูอีกครั้ง
**Expected**
ตอนยังไม่มีตัวกรอง แถว `Clear` อยู่ในสถานะ disabled (จาง กดไม่ได้); หลังตั้งตัวกรองแล้วแถว `Clear` กดได้ และกดแล้วล้างตัวกรองทุกตัวพร้อมปิดสถานะ view (`sv`)

---
## TC-STKT-030001 — Qty In/Qty Out เป็นผลรวมของ details และแสดง "-" เมื่อเป็น 0
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction ทั้งฝั่งรับเข้า (GRN/SI) และจ่ายออก (SR/SO)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เทียบค่าในคอลัมน์ `Qty In` / `Qty Out` ของแถวขาเข้าและขาออกกับข้อมูลใน response
**Expected**
`Qty In` คือผลรวม `qty_in` ของทุก `details[]` ในแถวนั้น และ `Qty Out` คือผลรวม `qty_out`; ค่าที่เป็น 0 แสดงเป็น `-` ไม่ใช่เลข 0; ค่าที่ไม่เป็น 0 ของ `Qty In` แสดงด้วยสีเขียว (success) และของ `Qty Out` แสดงด้วยสีแดง (destructive); ทั้งสองคอลัมน์ชิดขวา

---
## TC-STKT-030002 — ค่าในการ์ดสรุปเปลี่ยนตามตัวกรองที่เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction หลายประเภทและหลายช่วงวันที่
**Steps**
1. ไปที่ `/inventory-management/transaction` แล้วจดค่าบนการ์ดทั้งสี่
2. ตั้งตัวกรอง `Reference Type` = GRN
3. รอให้ค่าบนการ์ดนิ่ง แล้วเทียบกับค่าที่จดไว้และกับ `summary` ใน response
**Expected**
ค่าบนการ์ดทั้งสี่ถูกคำนวณใหม่ตามชุดข้อมูลที่กรอง (มาจากก้อน `summary` ของ response เดียวกับรายการ ไม่ใช่คำนวณจากแถวบนหน้าจอ); `Net Change` เท่ากับ `Total Inbound` ลบด้วย `Total Outbound`; ล้างตัวกรองแล้วค่ากลับไปเท่ากับที่จดไว้ตอนแรก

---
## TC-STKT-030003 — Items นับจำนวน details และ Product/Location ตัดชื่อซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี transaction อย่างน้อยหนึ่งใบที่มีหลายรายการย่อย (`details` มากกว่า 1)
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เลือกแถวที่มีหลายรายการย่อย แล้วเทียบคอลัมน์ `Items`, `Product`, `Location` กับข้อมูลใน response
**Expected**
`Items` เท่ากับจำนวนสมาชิกของ `details[]` พอดี; `Product` แสดงชื่อสินค้าที่ไม่ซ้ำกันคั่นด้วย `, ` และ `Location` แสดงชื่อคลังที่ไม่ซ้ำกันคั่นด้วย `, ` (ชื่อซ้ำถูกยุบเหลือหนึ่งครั้ง); ข้อความที่ยาวเกินถูกตัดที่ 2 บรรทัด และมี tooltip (`title`) ที่เก็บข้อความเต็มไว้

---
## TC-STKT-030004 — Total เป็นผลรวม total_cost พร้อมรหัสสกุลเงินหลัก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; โปรไฟล์มีสกุลเงินหลักของกิจการตั้งไว้; มี transaction ที่มีต้นทุนมากกว่า 0
**Steps**
1. ไปที่ `/inventory-management/transaction`
2. เทียบค่าในคอลัมน์ `Total` ของแถวหนึ่งกับผลรวม `total_cost` ของ `details[]` ในแถวเดียวกัน
**Expected**
`Total` เท่ากับผลรวม `total_cost` ของทุกรายการย่อย จัดรูปแบบตาม amount format ของโปรไฟล์ และต่อท้ายด้วยรหัสสกุลเงินหลักของกิจการ (ไม่ใช่สกุลของเอกสารต้นทาง); คอลัมน์ชิดขวา

---
## TC-STKT-100001 — ผู้ใช้ที่ไม่มีสิทธิ์ inventory_management.view ถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ **ไม่ใช่ admin ของ BU** (`system_level ≠ "admin"`) และไม่มี permission `inventory_management.view` ใน BU ที่ active อยู่ — ต้องยืนยันสิทธิ์ของบัญชีจาก profile ก่อน (ดูหมายเหตุข้อ 9)
**Steps**
1. เปิด URL `/inventory-management/transaction` โดยตรง
**Expected**
ไม่แสดงหัวข้อหน้า, การ์ดสรุป หรือแถวข้อมูล transaction ใด ๆ; แสดงกล่อง Permission Denied (`role="alert"`) ที่มีคำว่า `Restricted`, หัวข้อ `Permission Denied`, ข้อความ `You don't have permission to view this page.` พร้อมบรรทัด `Contact your administrator to request access.` และปุ่ม `Go to an available page` ที่พากลับไปหน้า landing ที่ผู้ใช้เข้าได้

---
## TC-STKT-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี token ใน session)
**Steps**
1. เปิด URL `/inventory-management/transaction` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` (แบบ replace ไม่ทิ้ง history) และไม่มี request ของรายการ transaction ถูกยิงออกไป

---
## TC-STKT-900001 — error state แสดงปุ่ม Try again และโหลดข้อมูลใหม่ได้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; จำลองให้ request ของรายการ transaction ล้มเหลว (เช่น intercept แล้วคืน 500)
**Steps**
1. ไปที่ `/inventory-management/transaction` ขณะ request ล้มเหลว
2. ปลดการจำลองความล้มเหลว แล้วกดปุ่ม `Try again`
**Expected**
ทั้งหน้าถูกแทนที่ด้วยกล่อง error (`role="alert"`) หัวข้อ `Something went wrong` พร้อมปุ่ม `Try again` — ไม่มีหัวข้อหน้า/การ์ดสรุป/ตารางเหลืออยู่; กด `Try again` แล้วระบบ refetch และกลับมาแสดงหน้าปกติพร้อมข้อมูล

---
## TC-STKT-900002 — ไม่มีข้อมูลเลย: การ์ดสรุปเป็น 0 และไม่มีแถบแบ่งหน้า
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ตั้งตัวกรองให้ไม่มีผลลัพธ์เลย (เช่น ช่วงวันที่ในอนาคตรวมกับ Reference Type ที่ไม่มีข้อมูล)
**Steps**
1. ตั้งตัวกรองให้ไม่เหลือรายการใดเลย
2. ตรวจหัวหน้าเพจ, การ์ดสรุป, ตาราง และแถบแบ่งหน้า
**Expected**
badge จำนวนรวมข้างหัวข้อไม่แสดง (ซ่อนเมื่อจำนวนเป็น 0); การ์ดสรุปทั้งสี่แสดงค่า 0 (Net Change แสดงเป็น `+0`); ตารางแสดง empty state `No data found`; แถบแบ่งหน้าไม่ถูก render เลย

---
## TC-STKT-900003 — เปิดลิงก์ที่มี sv ของ view ที่ถูกลบแล้ว
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี id ของ saved view ที่ถูกลบไปแล้ว (หรือ id สุ่มที่ไม่มีอยู่จริง)
**Steps**
1. เปิด `/inventory-management/transaction?sv=<id-ที่ไม่มีอยู่>`
2. รอให้รายการ view โหลดเสร็จ
**Expected**
ขึ้น toast ข้อความ `That view no longer exists` เพียงครั้งเดียว; พารามิเตอร์ `sv` ถูกลบออกจาก URL; ปุ่ม view กลับไปแสดง `No view`; หน้ายังใช้งานได้ตามปกติ (ตาราง/การ์ดสรุปแสดงตามตัวกรองที่เหลืออยู่)
