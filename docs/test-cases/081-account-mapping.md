# Account Mapping — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/config/account-mapping` (`am.route.tsx`, `am-component.tsx`, `use-am-table.tsx`, `am-mock.ts`). Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Configuration — Account Mapping
**Frontend route:** `routes/config/account-mapping`  •  **URL:** `/config/account-mapping`
**Prefix:** `ACMAP`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 23

> หมายเหตุสำคัญสำหรับผู้รีวิว: หน้านี้ยัง **อ่านจาก mock ในไฟล์ `am-mock.ts` ทั้งหมด (12 แถว — AP 8 / GL 4) ไม่ยิง API** และปุ่มบนแถบเครื่องมือ (Import / Export / Scan for New Code / Bulk Map / Edit) รวมถึงปุ่มดินสอท้ายแถว **ยังไม่ผูก handler** — กดแล้วไม่มีอะไรเกิดขึ้น เทสเคสด้านล่างจึงครอบเฉพาะ list / search / tabs / การแสดงผล ไม่มี create / edit / delete
>
> เทสเคสในเอกสารนี้ยืนยันแค่ว่า **ปุ่มปรากฏตามที่ออกแบบ** ไม่ได้ยืนยันว่า "กดแล้วต้องไม่มีอะไรเกิดขึ้น" — การผูก handler เป็นงานที่รออยู่ ไม่ใช่พฤติกรรมที่ต้องคงไว้ ถ้าเขียนเทสล็อกสภาพนี้ไว้ เทสจะแดงในวันที่ฟีเจอร์ทำงานได้จริง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ACMAP-010001 | แสดงหน้า Account Mapping พร้อมตารางของแท็บ AP | High | Smoke |
| TC-ACMAP-010002 | ตารางแสดงคอลัมน์ครบตามที่กำหนด | High | Functional |
| TC-ACMAP-010003 | ค้นหาด้วยรหัสบัญชี (Account Code) | High | Functional |
| TC-ACMAP-010004 | ค้นหาด้วยชื่อ/รหัสคลัง (Location) | Medium | Functional |
| TC-ACMAP-010005 | ค้นหาด้วยชื่อ Business Unit ที่ไม่มีคอลัมน์แสดง | Medium | Functional |
| TC-ACMAP-010006 | ค้นหาไม่สนตัวพิมพ์เล็ก-ใหญ่ | Low | Functional |
| TC-ACMAP-010007 | ค้นหาแล้วไม่พบข้อมูล แสดง empty state | Medium | Negative |
| TC-ACMAP-010008 | ล้างคำค้นด้วยปุ่มกากบาทแล้วรายการกลับมาครบ | Medium | Alternate Flow |
| TC-ACMAP-100001 | ผู้ใช้ที่ยังไม่ล็อกอินเปิด URL ตรง ๆ | High | Auth-guard |
| TC-ACMAP-100002 | ผู้ใช้ที่ล็อกอินแล้วทุก role เข้าหน้านี้ได้ (ยังไม่ผูก permission/license) | Medium | Authorization |
| TC-ACMAP-400001 | สลับแท็บ Posting to AP ↔ Posting to GL | High | Functional |
| TC-ACMAP-400002 | ตัวเลขบนหัวแท็บตรงกับจำนวนแถวในตารางของแท็บนั้น | Medium | Functional |
| TC-ACMAP-400003 | ตัวเลขบนหัวแท็บทั้งสองอัปเดตพร้อมกันเมื่อค้นหา | Medium | Functional |
| TC-ACMAP-400004 | คอลัมน์ Mapped แสดงเครื่องหมายถูก/กากบาทตามสถานะ | High | Functional |
| TC-ACMAP-400005 | คอลัมน์ Last Scanned แสดงวันที่ หรือขีดเมื่อไม่มีค่า | Medium | Functional |
| TC-ACMAP-400006 | แถบเครื่องมือแสดงปุ่มครบทั้ง 5 ปุ่ม | Medium | Functional |
| TC-ACMAP-400007 | แต่ละแถวมีเฉพาะปุ่มดินสอในคอลัมน์ท้ายสุด | Medium | Functional |
| TC-ACMAP-400008 | ปรับความกว้างคอลัมน์และเลื่อนตารางแนวนอน | Low | Functional |
| TC-ACMAP-900001 | พิมพ์คำค้นแล้วยังไม่กด Enter ตารางไม่เปลี่ยน | Medium | Edge Case |
| TC-ACMAP-900002 | คลิกหัวคอลัมน์เพื่อเรียงลำดับ ลำดับแถวไม่เปลี่ยน | Low | Edge Case |
| TC-ACMAP-900003 | สลับ Business Unit แล้วข้อมูลในตารางไม่เปลี่ยน (ยังเป็น mock) | Medium | Edge Case |
| TC-ACMAP-900004 | ค้นหาคำว่า GL แมตช์กับ mapping type ของแถว | Low | Edge Case |
| TC-ACMAP-900005 | ข้อความยาวในคอลัมน์ถูกตัดท้ายและมี tooltip แสดงค่าเต็ม | Low | Edge Case |

---
## TC-ACMAP-010001 — แสดงหน้า Account Mapping พร้อมตารางของแท็บ AP
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ข้อมูลหน้านี้มาจาก mock `am-mock.ts` (12 แถว — AP 8 / GL 4)
**Steps**
1. ไปที่ `/config/account-mapping`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
เห็นหัวข้อ Account Mapping พร้อมคำอธิบายใต้หัวข้อ, แถบแท็บ Posting to AP / Posting to GL โดยแท็บ Posting to AP ถูกเลือกอยู่ และตารางแสดงแถวของ mapping type AP

---
## TC-ACMAP-010002 — ตารางแสดงคอลัมน์ครบตามที่กำหนด
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` และตารางโหลดข้อมูลแล้ว
**Steps**
1. ดูแถวหัวตาราง (เลื่อนตารางแนวนอนจนสุดขวาเพื่อเห็นคอลัมน์ท้ายสุด)
**Expected**
หัวตารางมีคอลัมน์ `#`, Location, Category, Sub Category, Item Group, Department, Account Code, Mapped, Last Scanned และคอลัมน์ action ท้ายสุดที่ไม่มีข้อความหัวคอลัมน์; คอลัมน์ `#` แสดงลำดับแถวเริ่มที่ 1

---
## TC-ACMAP-010003 — ค้นหาด้วยรหัสบัญชี (Account Code)
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; แท็บ Posting to AP ถูกเลือกอยู่
**Steps**
1. คลิกที่ช่อง Search บนแถบเครื่องมือ
2. พิมพ์รหัสบัญชีของแถวที่มีอยู่ เช่น `1106002`
3. กด Enter
**Expected**
ตารางแสดงเฉพาะแถวที่มีรหัสบัญชีนั้น และตัวเลขบนหัวแท็บลดลงตามจำนวนผลลัพธ์

---
## TC-ACMAP-010004 — ค้นหาด้วยชื่อ/รหัสคลัง (Location)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`
**Steps**
1. พิมพ์รหัสคลังในช่อง Search เช่น `1MK01`
2. กด Enter
**Expected**
ตารางแสดงเฉพาะแถวที่คอลัมน์ Location ตรงกับรหัสที่ค้น (ค้นด้วยชื่อคลังก็ให้ผลลัพธ์ชุดเดียวกัน)

---
## TC-ACMAP-010005 — ค้นหาด้วยชื่อ Business Unit ที่ไม่มีคอลัมน์แสดง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ข้อมูล mock มีฟิลด์ business_unit แต่ไม่ได้แสดงเป็นคอลัมน์ในตาราง
**Steps**
1. พิมพ์ชื่อ business unit ของแถวที่มีอยู่ในช่อง Search
2. กด Enter
**Expected**
ตารางกรองแถวตาม business unit ได้ ถึงแม้จะไม่มีคอลัมน์ business unit แสดงอยู่ในตาราง

---
## TC-ACMAP-010006 — ค้นหาไม่สนตัวพิมพ์เล็ก-ใหญ่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`
**Steps**
1. พิมพ์คำค้นเป็นตัวพิมพ์เล็กทั้งหมดของค่าที่ในข้อมูลเป็นตัวพิมพ์ใหญ่ เช่น `inventory`
2. กด Enter
**Expected**
ตารางแสดงผลลัพธ์เดียวกับการพิมพ์เป็นตัวพิมพ์ใหญ่ (การเทียบคำค้นแปลงเป็นตัวพิมพ์เล็กทั้งสองฝั่ง)

---
## TC-ACMAP-010007 — ค้นหาแล้วไม่พบข้อมูล แสดง empty state
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`
**Steps**
1. พิมพ์คำค้นที่ไม่ตรงกับข้อมูลใดเลย เช่น `zzzz-no-match`
2. กด Enter
**Expected**
ตารางของทั้งสองแท็บไม่มีแถวข้อมูล แสดง empty state แทน และตัวเลขบนหัวแท็บทั้ง AP และ GL เป็น 0

---
## TC-ACMAP-010008 — ล้างคำค้นด้วยปุ่มกากบาทแล้วรายการกลับมาครบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` และค้นหาไว้แล้วจนรายการถูกกรอง
**Steps**
1. คลิกปุ่มกากบาท (Clear search) ที่อยู่ท้ายช่อง Search
**Expected**
ช่อง Search ว่าง และตารางกลับมาแสดงรายการทั้งหมดของแท็บที่เปิดอยู่ พร้อมตัวเลขบนหัวแท็บกลับเป็นค่าเดิม

---
## TC-ACMAP-100001 — ผู้ใช้ที่ยังไม่ล็อกอินเปิด URL ตรง ๆ
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context ที่ยังไม่ได้ล็อกอิน)
**Steps**
1. เปิด URL `/config/account-mapping` ตรง ๆ
**Expected**
ถูก redirect ไปหน้า `/login` และไม่เห็นข้อมูลผังการผูกบัญชี

---
## TC-ACMAP-100002 — ผู้ใช้ที่ล็อกอินแล้วทุก role เข้าหน้านี้ได้ (ยังไม่ผูก permission/license)
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็นผู้ใช้ที่ไม่ใช่ admin เช่น requestor@blueledgers.com; active BU = BLAVG; leaf ของหน้านี้ใน `constant/module-list.ts` ยังไม่ประกาศ permission และไม่ถูก map เข้า license feature
**Steps**
1. ไปที่ `/config/account-mapping`
**Expected**
หน้าแสดงได้ตามปกติ ไม่มีกล่อง Access Denied และไม่ถูก redirect (RouteGuard ปล่อยผ่าน leaf ที่ไม่ประกาศ permission)

---
## TC-ACMAP-400001 — สลับแท็บ Posting to AP ↔ Posting to GL
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` และแท็บ Posting to AP ถูกเลือกอยู่
**Steps**
1. คลิกแท็บ Posting to GL
2. ดูข้อมูลในตาราง
3. คลิกแท็บ Posting to AP กลับ
**Expected**
เนื้อหาตารางเปลี่ยนเป็นชุดของแท็บที่เลือกทุกครั้ง โดยไม่มีการเปลี่ยน URL และแถวของอีก mapping type ไม่ปะปนกัน

---
## TC-ACMAP-400002 — ตัวเลขบนหัวแท็บตรงกับจำนวนแถวในตารางของแท็บนั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` โดยยังไม่ได้ค้นหา
**Steps**
1. อ่านตัวเลขที่ต่อท้ายชื่อแท็บ Posting to AP แล้วนับจำนวนแถวในตาราง
2. คลิกแท็บ Posting to GL แล้วทำแบบเดียวกัน
**Expected**
ตัวเลขบนหัวแท็บแต่ละอันเท่ากับจำนวนแถวในตารางของแท็บนั้น และผลรวมทั้งสองแท็บเท่ากับจำนวนรายการทั้งหมดของข้อมูล

---
## TC-ACMAP-400003 — ตัวเลขบนหัวแท็บทั้งสองอัปเดตพร้อมกันเมื่อค้นหา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; แท็บ Posting to AP ถูกเลือกอยู่
**Steps**
1. พิมพ์คำค้นที่ตรงกับแถวของแท็บ GL เท่านั้น แล้วกด Enter
2. อ่านตัวเลขบนหัวแท็บทั้งสองโดยยังไม่สลับแท็บ
**Expected**
ตัวเลขบนหัวแท็บ Posting to AP เป็น 0 ขณะที่ Posting to GL แสดงจำนวนผลลัพธ์ที่เจอ (ผู้ใช้เห็นได้ว่าอีกแท็บมีผลลัพธ์รออยู่โดยไม่ต้องกดสลับ)

---
## TC-ACMAP-400004 — คอลัมน์ Mapped แสดงเครื่องหมายถูก/กากบาทตามสถานะ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ข้อมูลมีทั้งแถวที่ผูกแล้วและยังไม่ผูก
**Steps**
1. ดูคอลัมน์ Mapped ของแถวที่ผูกบัญชีแล้ว
2. ดูคอลัมน์ Mapped ของแถวที่ยังไม่ผูกบัญชี
**Expected**
แถวที่ผูกแล้วแสดงไอคอนเครื่องหมายถูกที่มี aria-label ว่า Mapped ส่วนแถวที่ยังไม่ผูกแสดงไอคอนกากบาทที่มี aria-label ว่า Not mapped (แยกได้จากรูปทรงโดยไม่ต้องพึ่งสี)

---
## TC-ACMAP-400005 — คอลัมน์ Last Scanned แสดงวันที่ หรือขีดเมื่อไม่มีค่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ข้อมูลมีทั้งแถวที่มีค่า last scanned และแถวที่ยังไม่เคยสแกน
**Steps**
1. ดูคอลัมน์ Last Scanned ของแถวที่เคยสแกนแล้ว
2. ดูคอลัมน์ Last Scanned ของแถวที่ยังไม่เคยสแกน
**Expected**
แถวที่เคยสแกนแสดงวันที่-เวลาในรูปแบบตามการตั้งค่าของโปรไฟล์ผู้ใช้ ส่วนแถวที่ไม่มีค่าแสดงขีด (—) แทนช่องว่าง

---
## TC-ACMAP-400006 — แถบเครื่องมือแสดงปุ่มครบทั้ง 5 ปุ่ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`
**Steps**
1. ดูปุ่มด้านขวาของแถบเครื่องมือ
**Expected**
เห็นปุ่มครบทั้ง 5 ปุ่มและกดได้: Import, Export, Scan for New Code, Bulk Map, Edit

---
## TC-ACMAP-400007 — แต่ละแถวมีเฉพาะปุ่มดินสอในคอลัมน์ท้ายสุด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` และตารางมีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. ดูคอลัมน์ท้ายสุดของแถวแรก
**Expected**
แถวมีปุ่มดินสอ (aria-label Edit) ในคอลัมน์ท้ายสุด และไม่มี checkbox เลือกแถว ไม่มีเมนู row action ไม่มีปุ่มลบ

---
## TC-ACMAP-400008 — ปรับความกว้างคอลัมน์และเลื่อนตารางแนวนอน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/account-mapping` บน desktop; ตารางเปิดโหมด columns resizable และเลื่อนแนวนอนได้
**Steps**
1. เลื่อนตารางไปทางขวาจนสุด
2. ลากเส้นแบ่งที่ขอบขวาของหัวคอลัมน์หนึ่งเพื่อเปลี่ยนความกว้าง
**Expected**
ตารางเลื่อนแนวนอนได้จนเห็นคอลัมน์ท้ายสุด, ความกว้างของคอลัมน์เปลี่ยนตามที่ลาก และแถวหัวตารางยังปักอยู่ด้านบน (header sticky) ขณะเลื่อน

---
## TC-ACMAP-900001 — พิมพ์คำค้นแล้วยังไม่กด Enter ตารางไม่เปลี่ยน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ช่อง Search ว่างอยู่
**Steps**
1. พิมพ์คำค้นลงในช่อง Search โดยยังไม่กด Enter
2. คลิกพื้นที่ว่างนอกช่อง Search
**Expected**
จำนวนแถวในตารางและตัวเลขบนหัวแท็บยังเท่าเดิม (การค้นหาทำงานเมื่อกด Enter เท่านั้น — เมื่อช่องมีข้อความแล้ว ปุ่มท้ายช่องจะกลายเป็นปุ่มล้างคำค้น ไม่ใช่ปุ่มค้นหา)

---
## TC-ACMAP-900002 — คลิกหัวคอลัมน์เพื่อเรียงลำดับ ลำดับแถวไม่เปลี่ยน
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ตารางมีหลายแถว; ตารางนี้ไม่ได้ต่อ sorted row model
**Steps**
1. จดลำดับค่าในคอลัมน์ Account Code ของ 3 แถวแรก
2. คลิกหัวคอลัมน์ Account Code
3. เทียบลำดับแถวกับที่จดไว้
**Expected**
ไอคอนบนหัวคอลัมน์เปลี่ยนเป็นสถานะเรียงลำดับ แต่ลำดับแถวในตารางยังเหมือนเดิม (พฤติกรรมปัจจุบันของหน้านี้ — ใช้เฉพาะ core row model)

---
## TC-ACMAP-900003 — สลับ Business Unit แล้วข้อมูลในตารางไม่เปลี่ยน (ยังเป็น mock)
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com ที่มีมากกว่า 1 BU; อยู่ที่หน้า `/config/account-mapping`; หน้านี้อ่านจาก `am-mock.ts` ไม่ยิง API
**Steps**
1. จดจำนวนแถวและค่าในแถวแรกของแท็บ Posting to AP
2. สลับ active BU จากเมนูผู้ใช้
3. กลับมาที่ `/config/account-mapping`
**Expected**
ตารางยังแสดงข้อมูลชุดเดิมทุกแถว ไม่ผูกกับ BU ที่เลือก (ยืนยันว่ายังเป็นข้อมูลตัวอย่าง — ต้องกลับมาทบทวนเทสเคสชุดนี้ใหม่เมื่อ endpoint จริงพร้อม)

---
## TC-ACMAP-900004 — ค้นหาคำว่า GL แมตช์กับ mapping type ของแถว
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; ตัวกรองค้นหารวมค่า mapping type (AP/GL) เข้าไปในข้อความที่ใช้เทียบด้วย
**Steps**
1. พิมพ์ `GL` ในช่อง Search
2. กด Enter
**Expected**
ตัวเลขบนหัวแท็บ Posting to AP เป็น 0 ส่วนแท็บ Posting to GL ยังแสดงรายการอยู่ — คำค้นไปแมตช์กับ mapping type ของแถว ไม่ใช่แค่ข้อความที่แสดงในคอลัมน์

---
## TC-ACMAP-900005 — ข้อความยาวในคอลัมน์ถูกตัดท้ายและมี tooltip แสดงค่าเต็ม
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/account-mapping`; มีแถวที่ชื่อ Item Group หรือ Account Code ยาวเกินความกว้างคอลัมน์
**Steps**
1. หาแถวที่ข้อความในคอลัมน์ Account Code ถูกตัดท้ายด้วย ellipsis
2. ชี้เมาส์ค้างบนข้อความนั้น
**Expected**
ข้อความถูกตัดให้พอดีความกว้างคอลัมน์ (ไม่ดันตารางเสียรูป) และมี tooltip จาก attribute `title` แสดงค่าเต็มทั้งบรรทัดรหัสและบรรทัดชื่อ
