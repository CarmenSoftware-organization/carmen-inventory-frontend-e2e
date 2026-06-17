# Wastage Reporting — User Stories

_Authored from the test-case catalog `docs/test-cases/710-wastage-reporting.md` (documentation only — no automated spec yet)._

**Module:** Wastage Reporting
**Frontend route:** `routes/store-operation/wastage-reporting`  •  **URL:** `/store-operation/wastage-reporting`
**Prefix:** `WAST`
**Default role:** Store Manager
**Total test cases:** 26

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-WAST-010001 | หน้า list Wastage Reporting โหลดสำเร็จ | High | Smoke |
| TC-WAST-010002 | คอลัมน์ตาราง (WR No/สถานที่/วันที่/จำนวนรวม/มูลค่าเสียหาย/ผู้รายงาน/สถานะ) แสดงครบ | Medium | Functional |
| TC-WAST-010003 | ปุ่ม Add บน toolbar นำไปหน้า new | High | Smoke |
| TC-WAST-010004 | ค้นหาด้วย WR No / สถานที่ / เหตุผล / ผู้รายงาน ใช้งานได้ | Medium | Functional |
| TC-WAST-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-WAST-010006 | filter สถานะ (pending/approved/rejected) ใช้งานได้ | Medium | Functional |
| TC-WAST-010007 | pagination เปลี่ยนหน้าได้ | Low | Functional |
| TC-WAST-010050 | active BU = BLAVG | High | Smoke |
| TC-WAST-020001 | คลิกแถวเปิดหน้า detail (view mode) สำเร็จ | High | Smoke |
| TC-WAST-020002 | หน้า detail แสดงหัวเอกสาร (WR No + badge สถานะ) และรายการสินค้าครบ | Medium | Functional |
| TC-WAST-030001 | เปิดหน้า new Wastage Report สำเร็จ | High | Smoke |
| TC-WAST-030002 | สร้าง WR (วันที่/สถานที่/เหตุผล + 1 item) สำเร็จ | High | CRUD |
| TC-WAST-030003 | ผู้รายงาน (Reporter) auto-fill จาก profile | Medium | Functional |
| TC-WAST-030004 | เพิ่ม line item ได้หลายรายการ | Medium | Functional |
| TC-WAST-030005 | ลบ line item ได้ (Remove dialog) | Medium | Functional |
| TC-WAST-030006 | กด Cancel ในโหมด add กลับหน้า list โดยไม่บันทึก | Low | Alternate Flow |
| TC-WAST-030050 | สร้าง Wastage Report (Store Manager/BLAVG) สำเร็จ | High | CRUD |
| TC-WAST-040001 | แก้ไข WR (เหตุผล/จำนวน) แล้ว save สำเร็จ | High | CRUD |
| TC-WAST-040002 | กด Cancel ในโหมด edit กลับสู่ view mode โดยไม่บันทึก | Medium | Alternate Flow |
| TC-WAST-050001 | ลบ WR จากหน้า list (Delete dialog) สำเร็จ | High | CRUD |
| TC-WAST-050002 | ลบ WR จากในฟอร์ม (โหมด edit) สำเร็จ | Medium | CRUD |
| TC-WAST-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Wastage Reporting ต้องถูกบล็อก | High | Authorization |
| TC-WAST-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-WAST-200001 | บันทึกโดยไม่เลือกวันที่ / สถานที่ / เหตุผล ต้องแสดง error | High | Validation |
| TC-WAST-200002 | line item ไม่เลือกสินค้า/หน่วย หรือ qty < 1 ต้องแสดง error | High | Validation |
| TC-WAST-900001 | mobile แสดงรายการแบบ card list และฟอร์มใช้งานได้ | Low | Edge Case |

---
## TC-WAST-010001 — หน้า list Wastage Reporting โหลดสำเร็จ
> **As a** Store Manager, **I want** to open the Wastage Reporting list and see it load reliably, **so that** I can review reported wastage for my store.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มีสิทธิ์เข้าถึง Store Operation
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
**Expected**
URL ตรงกับ `/store-operation/wastage-reporting`; หัวข้อหน้าและคำอธิบายแสดง พร้อม DataGrid รายการ WR ภายใน 10 วินาที

---
## TC-WAST-010002 — คอลัมน์ตาราง (WR No/สถานที่/วันที่/จำนวนรวม/มูลค่าเสียหาย/ผู้รายงาน/สถานะ) แสดงครบ
> **As a** Store Manager, **I want** every wastage column rendered, **so that** I can scan the key facts of each report at a glance.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า list และมีข้อมูล WR อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. ตรวจหัวตารางและเซลล์ในแถวแรก
**Expected**
ตารางแสดงคอลัมน์ WR No, สถานที่, วันที่, จำนวนรวม (totalQty, ชิดขวา), มูลค่าเสียหาย (lossValue, format เป็นสกุลเงิน ชิดขวา), ผู้รายงาน และสถานะ (badge); WR No เป็นลิงก์กดเปิด detail ได้

---
## TC-WAST-010003 — ปุ่ม Add บน toolbar นำไปหน้า new
> **As a** Store Manager, **I want** the Add button to take me to a fresh form, **so that** I can start a new wastage report quickly.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดปุ่ม Add (ไอคอน +) มุมขวาบน
**Expected**
นำทางไปยัง `/store-operation/wastage-reporting/new` และแสดงฟอร์มสร้างใหม่

---
## TC-WAST-010004 — ค้นหาด้วย WR No / สถานที่ / เหตุผล / ผู้รายงาน ใช้งานได้
> **As a** Store Manager, **I want** to search by WR No, location, reason, or reporter, **so that** I can find a specific report fast.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีข้อมูล WR หลายรายการ
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. พิมพ์คำค้น (เช่น WR No บางส่วน) ลงในช่อง Search แล้วกด Enter
**Expected**
ตารางกรองเหลือเฉพาะรายการที่ WR No, ชื่อสถานที่, เหตุผล หรือชื่อผู้รายงานตรงกับคำค้น

---
## TC-WAST-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
> **As a** Store Manager, **I want** a clear empty state for no-match searches, **so that** I know there are no matching reports rather than a broken page.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. พิมพ์คำค้นที่ไม่มีในระบบ (เช่น "zzzznotfound") แล้วกด Enter
**Expected**
ตารางไม่แสดงแถวข้อมูล และแสดง empty component (ไม่พบข้อมูล) แทน

---
## TC-WAST-010006 — filter สถานะ (pending/approved/rejected) ใช้งานได้
> **As a** Store Manager, **I want** to filter reports by status, **so that** I can focus on pending, approved, or rejected wastage.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีข้อมูล WR หลายสถานะ
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. เปิด Status filter แล้วเลือกสถานะหนึ่ง (เช่น pending)
**Expected**
ตารางแสดงเฉพาะรายการที่มีสถานะตรงกับตัวเลือก; เมื่อล้าง filter รายการกลับมาแสดงทั้งหมด

---
## TC-WAST-010007 — pagination เปลี่ยนหน้าได้
> **As a** Store Manager, **I want** pagination to work, **so that** I can browse beyond the first page of reports.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีข้อมูล WR มากกว่า 1 หน้า (เกิน perpage)
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดปุ่มไปหน้าถัดไปบนแถบ pagination
**Expected**
DataGrid โหลดรายการชุดถัดไป และตัวบอกหน้าปัจจุบันอัปเดต

---
## TC-WAST-010050 — active BU = BLAVG
> **As a** Store Manager, **I want** the active Business Unit to be BLAVG, **so that** I only see and act on wastage data scoped to my unit.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ผู้ใช้ผูกกับ BU BLAVG
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. ตรวจ BU ที่ active บน header/BU switcher
**Expected**
Business Unit ที่ active คือ BLAVG และรายการ WR ที่แสดงเป็นของ BU BLAVG

---
## TC-WAST-020001 — คลิกแถวเปิดหน้า detail (view mode) สำเร็จ
> **As a** Store Manager, **I want** clicking a WR No to open its detail in read-only view, **so that** I can inspect it without risk of accidental edits.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มีข้อมูล WR อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. คลิก WR No ในแถวแรก
**Expected**
นำทางไปยัง `/store-operation/wastage-reporting/{id}`; ฟอร์มเปิดในโหมด view (ฟิลด์ถูก disabled) และแสดงปุ่ม Edit

---
## TC-WAST-020002 — หน้า detail แสดงหัวเอกสาร (WR No + badge สถานะ) และรายการสินค้าครบ
> **As a** Store Manager, **I want** the detail page to show the header and all line items, **so that** I can verify what was wasted and its current status.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า detail ของ WR ที่มี item อย่างน้อย 1 รายการ
**Steps**
1. เปิด `/store-operation/wastage-reporting/{id}`
2. ตรวจส่วนหัว, ฟิลด์ผู้รายงาน/วันที่/สถานที่/เหตุผล และส่วน Items
**Expected**
ส่วนหัวแสดง WR No พร้อม badge สถานะ; ฟิลด์ผู้รายงาน, วันที่, สถานที่ และเหตุผลตรงกับข้อมูล; ตาราง Items แสดงจำนวนรายการในวงเล็บและรายการสินค้าทั้งหมด

---
## TC-WAST-030001 — เปิดหน้า new Wastage Report สำเร็จ
> **As a** Store Manager, **I want** the new-report form to open in a clean add state, **so that** I can begin recording wastage from scratch.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
**Expected**
แสดงฟอร์มในโหมด add: หัวข้อสร้างใหม่, ฟิลด์ผู้รายงาน auto-fill, ช่องวันที่/สถานที่/เหตุผล ว่าง และส่วน Items ว่าง (มีปุ่ม Add Item)

---
## TC-WAST-030002 — สร้าง WR (วันที่/สถานที่/เหตุผล + 1 item) สำเร็จ
> **As a** Store Manager, **I want** to create a wastage report with one item, **so that** the loss is recorded and routed for approval.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG; มี location และ product ที่ใช้งานได้
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. เลือกวันที่จาก DatePicker
3. เลือกสถานที่จาก Lookup Location
4. กรอกเหตุผลในช่อง Reason
5. กด Add Item แล้วเลือกสินค้า, หน่วย, กรอก qty และ unit cost
6. กดปุ่ม Save
**Expected**
แสดง toast createSuccess และนำทางกลับไปยัง `/store-operation/wastage-reporting`; รายการ WR ใหม่ปรากฏในตาราง

---
## TC-WAST-030003 — ผู้รายงาน (Reporter) auto-fill จาก profile
> **As a** Store Manager, **I want** the Reporter field auto-filled from my profile, **so that** I do not have to enter my own name on every report.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager ที่มีชื่อ-นามสกุลใน profile
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. ตรวจฟิลด์ Reporter ในส่วนหัวฟอร์ม
**Expected**
ฟิลด์ Reporter แสดงชื่อ-นามสกุลของผู้ใช้ที่ login (จาก profile.user_info) โดยอัตโนมัติ และเป็น readonly

---
## TC-WAST-030004 — เพิ่ม line item ได้หลายรายการ
> **As a** Store Manager, **I want** to add multiple line items, **so that** I can report several wasted products on one document.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า new หรือ edit
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. กด Add Item สามครั้งและกรอกข้อมูลแต่ละแถว
**Expected**
ส่วน Items แสดง 3 แถว; ตัวนับจำนวนในหัวข้อ Items อัปเดตเป็น (3); รายการใหม่ถูก prepend ไว้ด้านบนสุด

---
## TC-WAST-030005 — ลบ line item ได้ (Remove dialog)
> **As a** Store Manager, **I want** to remove a line item with a confirmation dialog, **so that** I do not delete the wrong row by accident.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ฟอร์มมี line item อย่างน้อย 1 รายการ (โหมด add/edit)
**Steps**
1. เปิดฟอร์มในโหมด add/edit ที่มี item
2. กดปุ่มลบของแถว item
3. ยืนยันใน Remove dialog
**Expected**
Remove dialog แสดงคำอธิบายของรายการที่จะลบ; เมื่อยืนยัน แถวนั้นหายไปและตัวนับ Items ลดลง

---
## TC-WAST-030006 — กด Cancel ในโหมด add กลับหน้า list โดยไม่บันทึก
> **As a** Store Manager, **I want** Cancel to discard an in-progress new report, **so that** nothing is saved when I change my mind.

**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า new
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. กรอกข้อมูลบางส่วน
3. กดปุ่ม Cancel
**Expected**
นำทางกลับไปยัง `/store-operation/wastage-reporting` โดยไม่บันทึกข้อมูล และไม่แสดง toast สำเร็จ

---
## TC-WAST-030050 — สร้าง Wastage Report (Store Manager/BLAVG) สำเร็จ
> **As a** Store Manager, **I want** a created report to persist under BU BLAVG, **so that** my wastage record survives reloads and is correctly scoped.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; active BU = BLAVG
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. กรอกวันที่/สถานที่/เหตุผล และเพิ่ม 1 item ครบถ้วน
3. กด Save แล้วรอกลับหน้า list
4. ค้นหา WR ที่เพิ่งสร้าง
**Expected**
WR ถูกสร้างภายใต้ BU BLAVG, แสดงในตาราง และคงอยู่หลัง reload หน้า

---
## TC-WAST-040001 — แก้ไข WR (เหตุผล/จำนวน) แล้ว save สำเร็จ
> **As a** Store Manager, **I want** to edit a report's reason and quantity and save, **so that** I can correct or update wastage details.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี WR ที่แก้ไขได้อย่างน้อย 1 รายการ
**Steps**
1. เปิด `/store-operation/wastage-reporting/{id}` (view mode)
2. กดปุ่ม Edit
3. แก้ไขเหตุผลและ qty ของ item หนึ่งรายการ
4. กดปุ่ม Save
**Expected**
แสดง toast updateSuccess และนำทางกลับไปยัง `/store-operation/wastage-reporting`; ค่าที่แก้คงอยู่เมื่อเปิดดูใหม่

---
## TC-WAST-040002 — กด Cancel ในโหมด edit กลับสู่ view mode โดยไม่บันทึก
> **As a** Store Manager, **I want** Cancel in edit mode to revert changes and return to view, **so that** unwanted edits are not saved.

**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า detail ของ WR
**Steps**
1. เปิด detail แล้วกด Edit
2. แก้ไขค่าบางฟิลด์
3. กดปุ่ม Cancel
**Expected**
ฟอร์ม reset กลับเป็นค่าเดิม และกลับสู่ view mode (ไม่นำทางออกจากหน้า) โดยไม่บันทึกการแก้ไข

---
## TC-WAST-050001 — ลบ WR จากหน้า list (Delete dialog) สำเร็จ
> **As a** Store Manager, **I want** to delete a report from the list with confirmation, **so that** obsolete wastage records are removed safely.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; มี WR ที่ลบได้อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/store-operation/wastage-reporting`
2. กดปุ่มลบ (action column) ในแถวที่ต้องการ
3. ยืนยันใน Delete dialog
**Expected**
Delete dialog แสดง WR No ที่จะลบ; เมื่อยืนยัน แสดง toast deleteSuccess และรายการหายจากตาราง

---
## TC-WAST-050002 — ลบ WR จากในฟอร์ม (โหมด edit) สำเร็จ
> **As a** Store Manager, **I want** to delete a report from within its edit form, **so that** I can remove it without returning to the list.

**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; เปิด WR ในโหมด edit
**Steps**
1. เปิด detail แล้วกด Edit
2. กดปุ่ม Delete (สีแดง) ในส่วนหัว
3. ยืนยันใน Delete dialog
**Expected**
แสดง toast deleteSuccess และนำทางกลับไปยัง `/store-operation/wastage-reporting`; WR หายจากตาราง

---
## TC-WAST-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Wastage Reporting ต้องถูกบล็อก
> **As a** Store Manager, **I want** users without permission to be blocked from Wastage Reporting, **so that** wastage data stays protected.

**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ Store Operation / Wastage Reporting
**Steps**
1. พยายามเข้า `/store-operation/wastage-reporting` โดยตรง
**Expected**
ระบบไม่แสดงข้อมูล WR; แสดงหน้า/ข้อความปฏิเสธสิทธิ์ หรือ redirect ออกจากหน้า

---
## TC-WAST-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
> **As a** Store Manager, **I want** anonymous access redirected to login, **so that** the module is never reachable without authentication.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (logout / ไม่มี token)
**Steps**
1. เปิด `/store-operation/wastage-reporting` โดยตรงใน browser ที่ไม่มี session
**Expected**
ถูก redirect ไปยัง `/login` และไม่มีข้อมูล WR ปรากฏ

---
## TC-WAST-200001 — บันทึกโดยไม่เลือกวันที่ / สถานที่ / เหตุผล ต้องแสดง error
> **As a** Store Manager, **I want** required header fields validated on save, **so that** I cannot submit an incomplete wastage report.

**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า new
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. เว้นวันที่, สถานที่ และเหตุผลให้ว่าง
3. กดปุ่ม Save
**Expected**
ฟอร์มไม่ถูกส่ง; แสดงข้อความ required ใต้ฟิลด์ date, location และ reason; โฟกัสเลื่อนไปยังฟิลด์ที่ผิดพลาดแรก

---
## TC-WAST-200002 — line item ไม่เลือกสินค้า/หน่วย หรือ qty < 1 ต้องแสดง error
> **As a** Store Manager, **I want** line-item fields validated on save, **so that** every reported item has a product, unit, and valid quantity.

**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; อยู่ที่หน้า new และเพิ่ม item ว่าง 1 แถว
**Steps**
1. ไปที่ `/store-operation/wastage-reporting/new`
2. กด Add Item แต่ไม่เลือกสินค้า/หน่วย และตั้ง qty = 0
3. กรอกฟิลด์หัวเอกสารให้ครบ แล้วกด Save
**Expected**
แสดง error: product required, unit required และ qty ต้องไม่น้อยกว่า 1; ฟอร์มไม่ถูกบันทึก

---
## TC-WAST-900001 — mobile แสดงรายการแบบ card list และฟอร์มใช้งานได้
> **As a** Store Manager, **I want** the list and form usable on a phone, **so that** I can report wastage on the floor without a desktop.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Store Manager; ใช้ viewport ขนาดมือถือ
**Steps**
1. เปิด `/store-operation/wastage-reporting` ด้วย viewport มือถือ
2. กดเปิด WR หนึ่งรายการและตรวจฟอร์ม
**Expected**
รายการแสดงในรูปแบบที่อ่านได้บนจอแคบ; ฟอร์ม detail/edit ใช้งานได้โดยฟิลด์ไม่ล้นจอ
