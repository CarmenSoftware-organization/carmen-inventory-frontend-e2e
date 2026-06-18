# Spot Check — User Stories

_Authored from the test-case catalog `docs/test-cases/760-spot-check.md` (documentation only — no automated spec yet)._

**Module:** Spot Check
**Frontend route:** `routes/inventory-management/spot-check`  •  **URL:** `/inventory-management/spot-check`
**Prefix:** `SPC`
**Default role:** Store Manager
**Total test cases:** 32

> หมายเหตุ: Spot Check เป็นการสุ่ม/เลือกสินค้านับเฉพาะจุดตาม location โดยมี 3 วิธี (Random / High Value / Manual) แล้วไหลตามขั้นตอน setup → entry → review/finalize พร้อมคำนวณ variance

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SPC-010001 | หน้า Spot Check โหลดสำเร็จ | High | Smoke |
| TC-SPC-010002 | สลับ view Locations / History ได้ | Medium | Functional |
| TC-SPC-010003 | KPI tiles (All/Resume/Not Started) แสดงและกรองได้ | High | Functional |
| TC-SPC-010004 | ช่องค้นหา location (name/code) ใช้งานได้ | Medium | Functional |
| TC-SPC-010005 | ค้นหา location ที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-SPC-010006 | checkbox Include Not Count ปรับรายการ location ได้ | Low | Functional |
| TC-SPC-010007 | location card แสดง resume info และ method badge | Medium | Functional |
| TC-SPC-010008 | History tab ค้นหา/filter (location/status/method) ได้ | Medium | Functional |
| TC-SPC-010050 | active BU = BLAVG | High | Smoke |
| TC-SPC-030001 | เปิดหน้า new spot check (location-based) สำเร็จ | High | Smoke |
| TC-SPC-030002 | สร้าง spot check วิธี Random (items) สำเร็จ | High | CRUD |
| TC-SPC-030003 | สร้าง spot check วิธี High Value (items + min value) สำเร็จ | High | CRUD |
| TC-SPC-030004 | สร้าง spot check วิธี Manual (เลือก product) สำเร็จ | High | CRUD |
| TC-SPC-030005 | method picker สลับ Random/High Value/Manual ปรับ field ตามวิธี | Medium | Functional |
| TC-SPC-030006 | product transfer (Manual) ย้าย product ระหว่างสองฝั่งได้ | Medium | Functional |
| TC-SPC-030050 | สร้าง spot check (store manager/BLAVG) สำเร็จ | High | CRUD |
| TC-SPC-040001 | แก้ไข spot check ที่บันทึกแล้ว save สำเร็จ | High | CRUD |
| TC-SPC-050001 | ลบ spot check สำเร็จ (delete) | High | CRUD |
| TC-SPC-060001 | กรอก count ของ item แล้ว Save for Resume สำเร็จ | High | Functional |
| TC-SPC-060002 | filter pills (All/Counted/Uncounted) ในหน้า entry ใช้งานได้ | Medium | Functional |
| TC-SPC-060003 | เพิ่ม note/evidence และใช้ calculator ที่ item ได้ | Medium | Functional |
| TC-SPC-060004 | Set empty to zero กับ item ที่ยังไม่นับ | Medium | Functional |
| TC-SPC-060005 | Resume spot check ที่ค้างไว้กลับมานับต่อได้ | Medium | Alternate Flow |
| TC-SPC-060006 | Reset spot check (confirm dialog) ล้างค่าที่นับ | Medium | Alternate Flow |
| TC-SPC-070001 | Submit for Review เมื่อนับครบนำไปหน้า review | High | Functional |
| TC-SPC-070002 | หน้า review แสดง stat tiles และ variance grid | High | Functional |
| TC-SPC-070003 | Submit spot check (finalize) เปลี่ยนสถานะเป็น completed | High | Functional |
| TC-SPC-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Spot Check ต้องถูกบล็อก | High | Authorization |
| TC-SPC-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SPC-200001 | สร้างโดยไม่กรอก items (Random) ต้องแสดง error | High | Validation |
| TC-SPC-200002 | Manual โดยไม่เลือก product ต้องแสดง error | High | Validation |
| TC-SPC-200003 | High Value min value ติดลบต้องแสดง error | Medium | Validation |

---
## TC-SPC-010001 — หน้า Spot Check โหลดสำเร็จ
> **As a** Store Manager, **I want** the Spot Check page to load reliably, **so that** I can launch targeted counts per location.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มีสิทธิ์เข้าถึง Inventory Management
**Steps**
1. ไปที่ `/inventory-management/spot-check`
**Expected**
URL ตรงกับ `/inventory-management/spot-check`; หัวข้อหน้า, KPI tiles และรายการ location (view Locations) แสดงภายใน 10 วินาที

---
## TC-SPC-010002 — สลับ view Locations / History ได้
> **As a** Store Manager, **I want** to switch between the Locations and History views, **so that** I can both start new checks and review past ones.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า spot-check
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. กดปุ่มสลับเป็น "History" แล้วกลับ "Locations"
**Expected**
มุมมองสลับระหว่างรายการ location และประวัติ spot check ได้ถูกต้อง

---
## TC-SPC-010003 — KPI tiles (All/Resume/Not Started) แสดงและกรองได้
> **As a** Store Manager, **I want** clickable KPI tiles by status, **so that** I can focus on locations that need attention.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location หลายสถานะ
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. กด tile "Resume"
**Expected**
แสดง 3 tiles (All, Resume, Not Started) พร้อมจำนวน; กด tile กรองให้แสดงเฉพาะ location ในสถานะนั้น

---
## TC-SPC-010004 — ช่องค้นหา location (name/code) ใช้งานได้
> **As a** Store Manager, **I want** to search locations by name or code, **so that** I can jump to a specific location fast.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location หลายรายการ
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. พิมพ์ชื่อหรือรหัส location ในช่องค้นหา
**Expected**
รายการ location ถูกกรองตามชื่อ/รหัส

---
## TC-SPC-010005 — ค้นหา location ที่ไม่มีต้องแสดง empty state
> **As a** Store Manager, **I want** a clear empty state when a location search matches nothing, **so that** I know the result is genuinely empty.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า spot-check
**Steps**
1. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
ไม่มี location ในแต่ละ section และแสดง empty state

---
## TC-SPC-010006 — checkbox Include Not Count ปรับรายการ location ได้
> **As a** Store Manager, **I want** to include not-countable locations on demand, **so that** I can see the full location set when needed.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ทั้ง countable และ not countable
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ติ๊ก checkbox "Include Not Count"
**Expected**
รายการ location รวม location ที่ not countable เข้ามาแสดงด้วย

---
## TC-SPC-010007 — location card แสดง resume info และ method badge
> **As a** Store Manager, **I want** resume info and method on each in-progress card, **so that** I can pick up a spot check with full context.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มี spot check in-progress
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ตรวจ location card ใน section Resume
**Expected**
card แสดงเลข spot check, status badge (dot pulsing สำหรับ in_progress), method badge พร้อมไอคอน, start date และ progress "X / Y items" พร้อมปุ่ม Resume และ Reset

---
## TC-SPC-010008 — History tab ค้นหา/filter (location/status/method) ได้
> **As a** Store Manager, **I want** to search and filter the spot-check history, **so that** I can audit past checks by location, status, or method.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี spot check ที่ผ่านมาแล้ว
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. สลับไป view History
3. ใช้ filter Location/Status/Method และค้นหา
**Expected**
รายการประวัติถูกกรองตามเงื่อนไข; กรณีไม่มีข้อมูลแสดง "No spot checks found"

---
## TC-SPC-010050 — active BU = BLAVG
> **As a** Store Manager, **I want** the active business unit to be BLAVG, **so that** I only see locations and spot checks scoped to my business unit.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ระบบ ensureActiveBu ตั้ง active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ตรวจตัวบ่งชี้ business unit ที่ active
**Expected**
Active business unit คือ BLAVG; location และ spot check ที่แสดงเป็นของ BU BLAVG เท่านั้น (endpoint อ้าง buCode)

---
## TC-SPC-030001 — เปิดหน้า new spot check (location-based) สำเร็จ
> **As a** Store Manager, **I want** to open the new spot check form scoped to a location, **so that** I can configure a check for that location.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location สถานะ Not started
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. กดปุ่ม "Start" บน location card
**Expected**
นำไปยัง `.../location/{location_id}`; ฟอร์มแสดงโหมด add โดยช่อง Location ถูกล็อกตาม location ที่เลือก และมี method picker

---
## TC-SPC-030002 — สร้าง spot check วิธี Random (items) สำเร็จ
> **As a** Store Manager, **I want** to create a Random spot check by item count, **so that** the system samples products for me to count.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; อยู่ในหน้า new spot check
**Steps**
1. เลือก method "Random"
2. กรอกจำนวน Items (>= 1)
3. กดปุ่ม Create
**Expected**
แสดง toast สร้างสำเร็จ; redirect ไปยังหน้า entry; spot check สถานะ pending พร้อม item สุ่มตามจำนวนที่ระบุ

---
## TC-SPC-030003 — สร้าง spot check วิธี High Value (items + min value) สำเร็จ
> **As a** Store Manager, **I want** to create a High Value spot check, **so that** the system samples high-value products above a threshold.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; อยู่ในหน้า new spot check
**Steps**
1. เลือก method "High Value"
2. กรอก Items (>= 1) และ Min Value (>= 0)
3. กดปุ่ม Create
**Expected**
แสดง toast สร้างสำเร็จ; redirect ไปหน้า entry; item ที่เลือกเป็นสินค้ามูลค่า >= min value

---
## TC-SPC-030004 — สร้าง spot check วิธี Manual (เลือก product) สำเร็จ
> **As a** Store Manager, **I want** to create a Manual spot check by hand-picking products, **so that** I can target specific items of concern.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; อยู่ในหน้า new spot check
**Steps**
1. เลือก method "Manual"
2. ใน product transfer เลือก product อย่างน้อย 1 รายการ
3. กดปุ่ม Create
**Expected**
แสดง toast สร้างสำเร็จ; redirect ไปหน้า entry; item ตรงกับ product ที่เลือกเอง

---
## TC-SPC-030005 — method picker สลับ Random/High Value/Manual ปรับ field ตามวิธี
> **As a** Store Manager, **I want** the form fields to adapt to the chosen method, **so that** I only see inputs relevant to that method.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new spot check
**Steps**
1. กดเลือกแต่ละ method card
2. ตรวจ field ที่แสดง
**Expected**
Random/High Value แสดงช่อง Items (High Value เพิ่ม Min Value); Manual แสดง product transfer แทน; method card ที่เลือกแสดง checkmark และ summary/tip ปรับตามวิธี

---
## TC-SPC-030006 — product transfer (Manual) ย้าย product ระหว่างสองฝั่งได้
> **As a** Store Manager, **I want** to move products between available and selected panes, **so that** I can curate the Manual check set precisely.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เลือก method Manual ในหน้า new
**Steps**
1. ค้นหา product ในฝั่ง Products Available
2. ติ๊ก checkbox เพื่อย้ายเข้าฝั่ง Products Selected
**Expected**
product ย้ายระหว่างสองฝั่งได้; ตัวนับ selected/total อัปเดต; รองรับ select all และ empty state เมื่อค้นไม่พบ

---
## TC-SPC-030050 — สร้าง spot check (store manager/BLAVG) สำเร็จ
> **As a** Store Manager, **I want** to create a spot check under BU BLAVG, **so that** the check is scoped to the correct business unit.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG
**Steps**
1. เปิดหน้า new spot check จาก location card
2. เลือก method Random และกรอก Items
3. กด Create
**Expected**
spot check ถูกสร้างภายใต้ BU BLAVG; toast สร้างสำเร็จและ redirect ไปหน้า entry

---
## TC-SPC-040001 — แก้ไข spot check ที่บันทึกแล้ว save สำเร็จ
> **As a** Store Manager, **I want** to edit a saved spot check, **so that** I can adjust its description or parameters before counting.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี spot check ที่บันทึกแล้ว (ยังไม่ completed)
**Steps**
1. เปิด detail ของ spot check ในโหมด view
2. กด Edit แล้วแก้ description/พารามิเตอร์
3. กด Save
**Expected**
แสดง toast save สำเร็จ; ฟอร์มกลับเป็นโหมด view พร้อมค่าที่แก้ไข

---
## TC-SPC-050001 — ลบ spot check สำเร็จ (delete)
> **As a** Store Manager, **I want** to delete a spot check, **so that** I can remove checks created in error.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี spot check ที่บันทึกแล้ว
**Steps**
1. เปิด detail ของ spot check และกด Edit
2. กดปุ่ม Delete แล้วยืนยัน
**Expected**
แสดง toast deleteSuccess; spot check ถูกลบและไม่ปรากฏในรายการ

---
## TC-SPC-060001 — กรอก count ของ item แล้ว Save for Resume สำเร็จ
> **As a** Store Manager, **I want** to save partial spot-check counts for resume, **so that** I can pause and continue later without losing data.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่มี item ให้นับ
**Steps**
1. กรอกจำนวนนับให้บาง item
2. กดปุ่ม "Save For Resume"
**Expected**
แสดง toast บันทึกสำเร็จ; progress และ percent complete อัปเดต; redirect กลับหน้า list

---
## TC-SPC-060002 — filter pills (All/Counted/Uncounted) ในหน้า entry ใช้งานได้
> **As a** Store Manager, **I want** to filter entry items by counted status, **so that** I can quickly find what still needs counting.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่มีทั้ง item นับแล้วและยังไม่นับ
**Steps**
1. กด filter pill "Counted" แล้ว "Uncounted"
**Expected**
แสดงเฉพาะ item ตามสถานะที่เลือก; จำนวนบน pill ตรงกับรายการที่กรอง

---
## TC-SPC-060003 — เพิ่ม note/evidence และใช้ calculator ที่ item ได้
> **As a** Store Manager, **I want** notes/evidence and a unit calculator per item, **so that** I can document and total counts accurately.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry
**Steps**
1. เปิด notes dialog ที่ item แล้วกรอก note/แนบรูป และบันทึก
2. เปิด calculator แปลงหน่วยแล้วใช้ค่า total
**Expected**
note และรูปถูกบันทึกแสดงใต้ item; calculator คำนวณ total เป็นหน่วยฐานและกรอกเข้าช่องนับ

---
## TC-SPC-060004 — Set empty to zero กับ item ที่ยังไม่นับ
> **As a** Store Manager, **I want** to set uncounted items to zero at once, **so that** I can finalize when remaining items have no stock.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่ยังมี item ยังไม่นับ (uncounted > 0)
**Steps**
1. กดปุ่ม "Set X Empty to Zero"
**Expected**
item ที่ยังไม่นับถูกตั้งเป็น 0 และนับว่า counted; uncounted ลดลงเป็น 0 และปุ่มเปลี่ยนเป็น Submit For Review

---
## TC-SPC-060005 — Resume spot check ที่ค้างไว้กลับมานับต่อได้
> **As a** Store Manager, **I want** to resume an in-progress spot check, **so that** I can continue from where I left off.

**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มี spot check in-progress
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. กดปุ่ม "Resume" บน location card
**Expected**
เปิดหน้า entry (`.../{id}`) พร้อมค่าที่นับไว้และ progress คงเดิม สามารถนับต่อได้

---
## TC-SPC-060006 — Reset spot check (confirm dialog) ล้างค่าที่นับ
> **As a** Store Manager, **I want** to reset a spot check with confirmation, **so that** I can restart counting after clearing prior entries.

**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ที่มี spot check in-progress
**Steps**
1. กดปุ่ม "Reset" บน location card (section Resume)
2. ยืนยันใน reset dialog
**Expected**
แสดง dialog ยืนยัน reset; เมื่อยืนยันค่าที่นับถูกล้างและสถานะกลับเป็น pending พร้อม toast resetSuccess

---
## TC-SPC-070001 — Submit for Review เมื่อนับครบนำไปหน้า review
> **As a** Store Manager, **I want** to submit for review when counting is complete, **so that** variances can be assessed before finalizing.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; นับ item ครบทุกรายการในหน้า entry (uncounted = 0)
**Steps**
1. กดปุ่ม "Submit For Review"
**Expected**
แสดง toast submitted for review; redirect ไปยังหน้า review (`.../{id}/review`)

---
## TC-SPC-070002 — หน้า review แสดง stat tiles และ variance grid
> **As a** Store Manager, **I want** review stat tiles and a variance grid, **so that** I can verify discrepancies before finalizing.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิดหน้า review ของ spot check
**Steps**
1. เปิดหน้า review
2. ตรวจ stat tiles และตาราง variance
**Expected**
แสดง tiles Matches/Variances/Overages/Shortages และ variance grid (Product/System Qty/Actual Qty/Variance) โดยค่าลบเป็นสีแดง ค่าบวกเป็นสีเขียว

---
## TC-SPC-070003 — Submit spot check (finalize) เปลี่ยนสถานะเป็น completed
> **As a** Store Manager, **I want** to finalize the spot check, **so that** the document is locked and marked completed.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า review หลังตรวจ variance แล้ว
**Steps**
1. กดปุ่ม "Submit Spot Check"
**Expected**
แสดง toast spot check เสร็จสมบูรณ์; redirect กลับหน้า list; doc_status เปลี่ยนเป็น completed (badge สีเขียว ไม่ pulse)

---
## TC-SPC-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Spot Check ต้องถูกบล็อก
> **As a** security stakeholder, **I want** users without Inventory Management permission blocked, **so that** spot-check data stays protected.

**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ไม่มีสิทธิ์ Inventory Management
**Steps**
1. ไปที่ `/inventory-management/spot-check`
**Expected**
ระบบบล็อกการเข้าถึง (redirect หรือแสดงข้อความไม่มีสิทธิ์); ไม่แสดงรายการ spot check

---
## TC-SPC-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** security stakeholder, **I want** unauthenticated direct access redirected to login, **so that** only authenticated users reach the module.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี session)
**Steps**
1. เปิด URL `/inventory-management/spot-check` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login`

---
## TC-SPC-200001 — สร้างโดยไม่กรอก items (Random) ต้องแสดง error
> **As a** Store Manager, **I want** a required-items error for Random, **so that** a sample size is always specified.

**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new spot check เลือก method Random
**Steps**
1. ปล่อยช่อง Items ว่าง (หรือ 0)
2. กดปุ่ม Create
**Expected**
แสดง error (items ต้อง >= 1) และไม่บันทึก

---
## TC-SPC-200002 — Manual โดยไม่เลือก product ต้องแสดง error
> **As a** Store Manager, **I want** a select-at-least-one-product error for Manual, **so that** an empty Manual check cannot be created.

**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new spot check เลือก method Manual
**Steps**
1. ไม่เลือก product ใด ๆ ในฝั่ง Products Selected
2. กดปุ่ม Create
**Expected**
แสดง error "Please select at least one product" ใต้ product transfer และไม่บันทึก

---
## TC-SPC-200003 — High Value min value ติดลบต้องแสดง error
> **As a** Store Manager, **I want** a non-negative min-value error for High Value, **so that** the value threshold is always valid.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new spot check เลือก method High Value
**Steps**
1. กรอก Min Value เป็นค่าติดลบ
2. กดปุ่ม Create
**Expected**
แสดง error (min value ต้อง >= 0) และไม่บันทึก
