# Physical Count — User Stories

_Authored from the test-case catalog `docs/test-cases/750-physical-count.md` (documentation only — no automated spec yet)._

**Module:** Physical Count
**Frontend route:** `routes/inventory-management/physical-count`  •  **URL:** `/inventory-management/physical-count`
**Prefix:** `PCNT`
**Default role:** Store Manager
**Total test cases:** 33

> หมายเหตุ: รอบการนับ (count session) ไหลตามขั้นตอน setup → entry → review/finalize โดยแยกตาม location และมีการคำนวณ variance เทียบ system qty

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PCNT-010001 | หน้า Physical Count โหลดสำเร็จ | High | Smoke |
| TC-PCNT-010002 | period selector แสดงงวดปัจจุบัน/ก่อนหน้า | Medium | Functional |
| TC-PCNT-010003 | KPI tiles (All/In Progress/Not Started/Complete) แสดงและกรองได้ | High | Functional |
| TC-PCNT-010004 | ช่องค้นหา location (name/code) ใช้งานได้ | Medium | Functional |
| TC-PCNT-010005 | ค้นหา location ที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-PCNT-010006 | checkbox Include Not Count ปรับรายการ location ได้ | Low | Functional |
| TC-PCNT-010007 | location card แสดง progress และปุ่มตามสถานะ | Medium | Functional |
| TC-PCNT-010008 | status hero card แสดง progress รวมและเปอร์เซ็นต์ | Low | Functional |
| TC-PCNT-010050 | active BU = BLAVG | High | Smoke |
| TC-PCNT-030001 | เปิดหน้า new count session สำเร็จ | High | Smoke |
| TC-PCNT-030002 | สร้าง count session (department + period) สำเร็จ | High | CRUD |
| TC-PCNT-030003 | กด Cancel ขณะฟอร์ม dirty แสดง discard dialog | Medium | Functional |
| TC-PCNT-030050 | สร้าง count session (store manager/BLAVG) สำเร็จ | High | CRUD |
| TC-PCNT-040001 | แก้ไข count session ที่บันทึกแล้ว save สำเร็จ | High | CRUD |
| TC-PCNT-050001 | ลบ count session สำเร็จ (delete dialog) | High | CRUD |
| TC-PCNT-060001 | เริ่มนับ (Start) จาก location card นำไปหน้า entry | High | Functional |
| TC-PCNT-060002 | กรอก actual count ของ item แล้ว Save for Resume สำเร็จ | High | Functional |
| TC-PCNT-060003 | filter pills (All/Counted/Uncounted) ในหน้า entry ใช้งานได้ | Medium | Functional |
| TC-PCNT-060004 | เพิ่ม note และแนบรูป evidence ให้ item ได้ | Medium | Functional |
| TC-PCNT-060005 | ใช้ calculator แปลงหน่วยเพื่อหา total count | Medium | Functional |
| TC-PCNT-060006 | Set empty to zero กับ item ที่ยังไม่นับ | Medium | Functional |
| TC-PCNT-060007 | Resume การนับที่ค้างไว้กลับมานับต่อได้ | Medium | Alternate Flow |
| TC-PCNT-070001 | Submit for Review เมื่อนับครบทุก item นำไปหน้า review | High | Functional |
| TC-PCNT-070002 | หน้า review แสดง stat tiles (Matches/Variances/Overages/Shortages) | High | Functional |
| TC-PCNT-070003 | variance grid แสดง system/actual/variance ถูกต้อง | High | Functional |
| TC-PCNT-070004 | Submit physical count (finalize) เปลี่ยนสถานะเป็น completed | High | Functional |
| TC-PCNT-080001 | import ผลนับจากไฟล์ Excel/CSV ได้ | Medium | Functional |
| TC-PCNT-080002 | export รายการ item เป็นไฟล์ Excel ได้ | Low | Functional |
| TC-PCNT-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Physical Count ต้องถูกบล็อก | High | Authorization |
| TC-PCNT-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-PCNT-200001 | บันทึก count session โดยไม่เลือก department ต้องแสดง error | High | Validation |
| TC-PCNT-200002 | actual count ติดลบต้องไม่ถูกรับ (min 0) | Medium | Validation |
| TC-PCNT-900001 | import ไฟล์ที่คอลัมน์ไม่ครบต้องแสดง error | Low | Edge Case |

---
## TC-PCNT-010001 — หน้า Physical Count โหลดสำเร็จ
> **As a** Store Manager, **I want** the Physical Count page to load reliably, **so that** I can begin or monitor counting per location.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มี period ที่ active
**Steps**
1. ไปที่ `/inventory-management/physical-count`
**Expected**
URL ตรงกับ `/inventory-management/physical-count`; หัวข้อหน้า, period selector และรายการ location แสดงภายใน 10 วินาที

---
## TC-PCNT-010002 — period selector แสดงงวดปัจจุบัน/ก่อนหน้า
> **As a** Store Manager, **I want** to see and pick the current or previous period, **so that** I count against the correct accounting window.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีงวด (period) อย่างน้อย 1 งวด
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจการ์ด period selector
**Expected**
แสดงชื่องวด, วันสิ้นสุด ("Ends: ...") และ badge CURRENT/PREVIOUS; กรณีไม่มีงวดแสดง "No active period found"

---
## TC-PCNT-010003 — KPI tiles (All/In Progress/Not Started/Complete) แสดงและกรองได้
> **As a** Store Manager, **I want** clickable KPI tiles by status, **so that** I can focus on locations at a particular counting stage.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location หลายสถานะ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กด tile "In Progress"
**Expected**
แสดง 4 tiles (All, In Progress, Not Started, Complete) พร้อมจำนวน; กด tile กรองให้แสดงเฉพาะ location ในสถานะนั้น

---
## TC-PCNT-010004 — ช่องค้นหา location (name/code) ใช้งานได้
> **As a** Store Manager, **I want** to search locations by name or code, **so that** I can jump to a specific location fast.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location หลายรายการ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. พิมพ์ชื่อหรือรหัส location ในช่องค้นหา
**Expected**
รายการ location ถูกกรองตามชื่อ/รหัสแบบ case-insensitive

---
## TC-PCNT-010005 — ค้นหา location ที่ไม่มีต้องแสดง empty state
> **As a** Store Manager, **I want** a clear empty state when a location search matches nothing, **so that** I know the result is genuinely empty.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า physical-count
**Steps**
1. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
ไม่มี location ในแต่ละ section และแสดงข้อความ "No locations in this status"

---
## TC-PCNT-010006 — checkbox Include Not Count ปรับรายการ location ได้
> **As a** Store Manager, **I want** to include not-count locations on demand, **so that** I can see the full location set when needed.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location ทั้งที่ countable และ not count
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ติ๊ก checkbox "Include Not Count"
**Expected**
รายการ location รวม location ประเภท Not count เข้ามาแสดงด้วย

---
## TC-PCNT-010007 — location card แสดง progress และปุ่มตามสถานะ
> **As a** Store Manager, **I want** each location card to show progress and a status-appropriate action, **so that** I know what to do next per location.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location หลายสถานะ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจ location card แต่ละสถานะ
**Expected**
Not started แสดงปุ่ม "Start"; In progress แสดงปุ่ม "Resume"; Completed แสดงข้อความ "Done"; card แสดง progress "counted/total (percent%)" และ badge Count/Not count

---
## TC-PCNT-010008 — status hero card แสดง progress รวมและเปอร์เซ็นต์
> **As a** Store Manager, **I want** a hero card with overall progress, **so that** I can gauge how far the whole count has advanced.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ใช้งานบน desktop
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจ status hero card ทางขวา
**Expected**
แสดง check progress พร้อม progress bar และจำนวน done/active/pending สอดคล้องกับรายการ location

---
## TC-PCNT-010050 — active BU = BLAVG
> **As a** Store Manager, **I want** the active business unit to be BLAVG, **so that** I only see locations and count sessions scoped to my business unit.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ระบบ ensureActiveBu ตั้ง active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจตัวบ่งชี้ business unit ที่ active
**Expected**
Active business unit คือ BLAVG; location และ count session ที่แสดงเป็นของ BU BLAVG เท่านั้น

---
## TC-PCNT-030001 — เปิดหน้า new count session สำเร็จ
> **As a** Store Manager, **I want** to open the new count session form, **so that** I can set up a count for a department.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/physical-count/new`
**Expected**
ฟอร์มแสดงในโหมด add พร้อมช่อง Department และ Physical Count Period

---
## TC-PCNT-030002 — สร้าง count session (department + period) สำเร็จ
> **As a** Store Manager, **I want** to create a count session with department and period, **so that** counting can begin against the right scope.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มี department และ period ให้เลือก
**Steps**
1. เปิดหน้า new count session
2. เลือก Department
3. เลือก Physical Count Period (optional)
4. กด Submit
**Expected**
แสดง toast createSuccess; redirect กลับหน้า list; count session ใหม่ปรากฏในรายการ

---
## TC-PCNT-030003 — กด Cancel ขณะฟอร์ม dirty แสดง discard dialog
> **As a** Store Manager, **I want** a discard warning when I cancel a dirty form, **so that** I don't lose unsaved changes accidentally.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new และแก้ไขฟอร์มแล้ว
**Steps**
1. เปิดหน้า new count session
2. เลือก Department
3. กด Cancel หรือ Back
**Expected**
แสดง discard dialog (variant warning) เพื่อยืนยันการละทิ้งการเปลี่ยนแปลง

---
## TC-PCNT-030050 — สร้าง count session (store manager/BLAVG) สำเร็จ
> **As a** Store Manager, **I want** to create a count session under BU BLAVG, **so that** the session is scoped to the correct business unit.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG
**Steps**
1. เปิดหน้า new count session
2. เลือก Department และ Period
3. กด Submit
**Expected**
count session ถูกสร้างภายใต้ BU BLAVG; toast createSuccess และปรากฏในหน้า list

---
## TC-PCNT-040001 — แก้ไข count session ที่บันทึกแล้ว save สำเร็จ
> **As a** Store Manager, **I want** to edit a saved count session, **so that** I can correct the department or period before counting.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี count session ที่บันทึกแล้ว
**Steps**
1. เปิด detail ของ count session
2. กด Edit แล้วเปลี่ยน Department/Period
3. กด Submit
**Expected**
แสดง toast updateSuccess; ฟอร์มกลับเป็นโหมด view พร้อมค่าที่แก้ไขแล้ว

---
## TC-PCNT-050001 — ลบ count session สำเร็จ (delete dialog)
> **As a** Store Manager, **I want** to delete a count session with confirmation, **so that** I can remove sessions created in error.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี count session ที่บันทึกแล้ว
**Steps**
1. เปิด detail ของ count session ในโหมด view
2. กดปุ่ม Delete
3. ยืนยันใน delete dialog
**Expected**
แสดง dialog "Delete Physical Count"; เมื่อยืนยันแสดง toast deleteSuccess และ redirect กลับหน้า list โดยรายการหายไป

---
## TC-PCNT-060001 — เริ่มนับ (Start) จาก location card นำไปหน้า entry
> **As a** Store Manager, **I want** to start counting from a location card, **so that** I can move straight into entering counts.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location สถานะ Not started
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กดปุ่ม "Start" บน location card
**Expected**
นำไปยังหน้า entry (`.../{id}/entry`); แสดง header location, progress bar และรายการ item ที่ต้องนับ

---
## TC-PCNT-060002 — กรอก actual count ของ item แล้ว Save for Resume สำเร็จ
> **As a** Store Manager, **I want** to save partial counts for resume, **so that** I can pause and continue counting later without losing data.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry และมี item ให้นับ
**Steps**
1. กรอก Actual Count ให้บาง item
2. กดปุ่ม "Save for Resume"
**Expected**
แสดง toast บันทึกสำเร็จ; item ที่กรอกแสดง badge "COUNTED"; เวลา last saved อัปเดต และ progress เพิ่มขึ้น

---
## TC-PCNT-060003 — filter pills (All/Counted/Uncounted) ในหน้า entry ใช้งานได้
> **As a** Store Manager, **I want** to filter entry items by counted status, **so that** I can quickly find what still needs counting.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่มีทั้ง item นับแล้วและยังไม่นับ
**Steps**
1. กด filter pill "Uncounted"
**Expected**
แสดงเฉพาะ item ที่ยังไม่ถูกนับ; จำนวนบน pill ตรงกับรายการที่กรอง

---
## TC-PCNT-060004 — เพิ่ม note และแนบรูป evidence ให้ item ได้
> **As a** Store Manager, **I want** to attach notes and photo evidence to an item, **so that** I can document discrepancies during the count.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry
**Steps**
1. กดลิงก์ "Add notes & evidence" ที่ item
2. กรอก note และแนบรูปภาพ (JPG/PNG/WebP ≤ 3 MB)
3. กด "Save Note"
**Expected**
note และ thumbnail รูปถูกบันทึกและแสดงใต้ item; ไฟล์ที่ใหญ่เกิน 3 MB หรือไม่ใช่รูปถูกปฏิเสธพร้อม error

---
## TC-PCNT-060005 — ใช้ calculator แปลงหน่วยเพื่อหา total count
> **As a** Store Manager, **I want** a unit-conversion calculator, **so that** I can total mixed-unit quantities accurately into the base unit.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่ item มีหลายหน่วย
**Steps**
1. กดไอคอน Calculator ที่ item
2. เพิ่มแถว qty + unit แล้วตรวจ total
3. กด "Use This Total"
**Expected**
calculator คำนวณ total เป็นหน่วยฐานและกรอกค่าเข้า Actual Count ของ item

---
## TC-PCNT-060006 — Set empty to zero กับ item ที่ยังไม่นับ
> **As a** Store Manager, **I want** to set all uncounted items to zero at once, **so that** I can finalize a count where remaining items have no stock.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่ยังมี item ยังไม่นับ (uncounted > 0)
**Steps**
1. กดปุ่ม "Set empty to zero (N items)"
**Expected**
item ที่ยังไม่นับถูกตั้งค่าเป็น 0 และนับว่า counted; uncounted count ลดลงเป็น 0

---
## TC-PCNT-060007 — Resume การนับที่ค้างไว้กลับมานับต่อได้
> **As a** Store Manager, **I want** to resume an in-progress count, **so that** I can continue from where I left off.

**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี location สถานะ In progress ที่บันทึกค้างไว้
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กดปุ่ม "Resume" บน location card
**Expected**
เปิดหน้า entry พร้อมค่าที่นับไว้ก่อนหน้าและ progress คงเดิม สามารถนับต่อได้

---
## TC-PCNT-070001 — Submit for Review เมื่อนับครบทุก item นำไปหน้า review
> **As a** Store Manager, **I want** to submit for review when all items are counted, **so that** variances can be assessed before finalizing.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; นับ item ครบทุกรายการในหน้า entry (uncounted = 0)
**Steps**
1. เมื่อนับครบ กดปุ่ม "Submit for Review"
**Expected**
แสดง toast submitted for review; redirect ไปยังหน้า review (`.../{id}/review`); entry ถูกล็อกจากการแก้ไข

---
## TC-PCNT-070002 — หน้า review แสดง stat tiles (Matches/Variances/Overages/Shortages)
> **As a** Store Manager, **I want** review stat tiles, **so that** I can see the variance breakdown at a glance.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิดหน้า review ของ count session
**Steps**
1. เปิดหน้า review
2. ตรวจ stat tiles
**Expected**
แสดง 4 tiles: Matches (diff = 0), Variances (diff ≠ 0), Overages (diff > 0), Shortages (diff < 0) พร้อมจำนวนที่ถูกต้อง

---
## TC-PCNT-070003 — variance grid แสดง system/actual/variance ถูกต้อง
> **As a** Store Manager, **I want** an accurate variance grid, **so that** I can verify each discrepancy before finalizing.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิดหน้า review ที่มีรายการ variance
**Steps**
1. เปิดหน้า review
2. ตรวจตาราง variance (คอลัมน์ Product/System/Actual/Variance/Unit)
**Expected**
System = on_hand_qty, Actual = actual_qty, Variance = diff_qty (ค่าบวกสีเขียวพร้อม +, ค่าลบสีแดง); กรณีไม่มี variance แสดง "No variances — all counts match the system"

---
## TC-PCNT-070004 — Submit physical count (finalize) เปลี่ยนสถานะเป็น completed
> **As a** Store Manager, **I want** to finalize the physical count, **so that** the session is locked and marked completed.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า review หลังตรวจ variance แล้ว
**Steps**
1. กดปุ่ม "Submit physical count"
**Expected**
แสดง toast physical count submitted; redirect กลับหน้า list; สถานะของ count session/location เปลี่ยนเป็น completed

---
## TC-PCNT-080001 — import ผลนับจากไฟล์ Excel/CSV ได้
> **As a** Store Manager, **I want** to import count results from a file, **so that** I can bulk-load counts gathered offline.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry; มีไฟล์ที่มีคอลัมน์ id/product_sku/actual_qty
**Steps**
1. กดปุ่ม Import
2. เลือกไฟล์ .xlsx/.csv ที่ถูกต้อง
3. ตรวจ preview แล้วกด "Apply Import"
**Expected**
แสดง preview (total/matched/skipped); หลัง apply ค่า actual_qty ถูกเติมให้ item ที่ match และแสดง toast importSuccess

---
## TC-PCNT-080002 — export รายการ item เป็นไฟล์ Excel ได้
> **As a** Store Manager, **I want** to export the item list to Excel, **so that** counters can record results offline.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry ที่มี item
**Steps**
1. กดปุ่ม Export
**Expected**
ดาวน์โหลดไฟล์ .xlsx (ชื่อ physical-count-{location}-{date}.xlsx) พร้อมคอลัมน์ id/product/sku/unit/actual_qty; แสดง toast exportSuccess

---
## TC-PCNT-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Physical Count ต้องถูกบล็อก
> **As a** security stakeholder, **I want** users without Inventory Management permission blocked, **so that** count data stays protected.

**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ไม่มีสิทธิ์ Inventory Management
**Steps**
1. ไปที่ `/inventory-management/physical-count`
**Expected**
ระบบบล็อกการเข้าถึง (redirect หรือแสดงข้อความไม่มีสิทธิ์); ไม่แสดงรายการ count session

---
## TC-PCNT-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** security stakeholder, **I want** unauthenticated direct access redirected to login, **so that** only authenticated users reach the module.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี session)
**Steps**
1. เปิด URL `/inventory-management/physical-count` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login`

---
## TC-PCNT-200001 — บันทึก count session โดยไม่เลือก department ต้องแสดง error
> **As a** Store Manager, **I want** a required-department error on save, **so that** every count session is tied to a department.

**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า new
**Steps**
1. เปิดหน้า new count session
2. ปล่อยช่อง Department ว่าง แล้วกด Submit
**Expected**
แสดง error "Department is required" ใต้ช่อง Department และไม่บันทึก

---
## TC-PCNT-200002 — actual count ติดลบต้องไม่ถูกรับ (min 0)
> **As a** Store Manager, **I want** negative counts rejected, **so that** counted quantities are always non-negative.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry
**Steps**
1. กรอกค่าติดลบในช่อง Actual Count ของ item
**Expected**
ช่องไม่รับค่าติดลบ (min = 0); ค่าที่บันทึกต้อง >= 0

---
## TC-PCNT-900001 — import ไฟล์ที่คอลัมน์ไม่ครบต้องแสดง error
> **As a** Store Manager, **I want** an error when an import file is missing required columns, **so that** I don't load malformed data.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ในหน้า entry; มีไฟล์ที่ขาดคอลัมน์ที่จำเป็น
**Steps**
1. กดปุ่ม Import
2. เลือกไฟล์ที่ขาดคอลัมน์ (เช่น ไม่มี actual_qty)
**Expected**
แสดง error แจ้งคอลัมน์ที่หายไป และไม่นำเข้าข้อมูล
