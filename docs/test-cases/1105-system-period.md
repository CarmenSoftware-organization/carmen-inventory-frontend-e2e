# System Period — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/inventory-period`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Inventory Period (เดิมชื่อ System Period)
**Frontend route:** `routes/system-admin/inventory-period`  •  **URL:** `/system-admin/inventory-period`
**Prefix:** `SPER`
**Default role:** Platform Admin
**Total test cases:** 32

> หมายเหตุสำคัญสำหรับผู้รีวิว: เอกสารฉบับนี้ถูกสอบทานใหม่ทั้งฉบับกับโค้ดปัจจุบัน (2026-09-20)
>
> - **โมดูลถูกเปลี่ยนชื่อ** จาก `period` เป็น `inventory-period` ที่คอมมิต `06c68975` (2026-09-16 — `refactor(system-admin): เปลี่ยนชื่อ Period เป็น Inventory Period`) และตามด้วย `1caecb42` (`feat(inventory-period)!: ยิง endpoint และคีย์ license ชุดใหม่ของ backend`) path `routes/system-admin/period` ไม่มีอยู่จริงแล้ว ส่วน URL `/system-admin/period` ยังเข้าได้แต่เป็น `<Navigate to="/system-admin/inventory-period" replace />` ใน `routes/router.tsx` (คอมเมนต์ในโค้ดระบุว่าเก็บไว้ "กัน bookmark เก่าพัง") — endpoint หลังบ้านคือ `/api/{bu}/inventory-periods` และ `/api/{bu}/inventory-periods/next`
> - **ไม่มีเคสใดถูกลบ** — 27 เคสเดิมยังมีพฤติกรรมรองรับอยู่จริงทั้งหมด แต่ **แก้เนื้อหาโดยคง ID เดิม** เกือบทุกเคส เพราะข้อความบน UI เปลี่ยนไป: หัวคอลัมน์เป็น `Inventory Period / Fiscal Year / Fiscal Month / Start Date / End Date / Status`, ป้ายสถานะเปลี่ยนจาก Badge สีเป็น `StatusIconLabel` (ไอคอน + ตัวอักษรพิมพ์ใหญ่ `OPEN` / `CLOSED` / `LOCKED` จาก `createStatusConfig`), toast อ้าง entity ว่า `Inventory Period`, ลิงก์ล้างตัวกรองเขียนว่า **Clear** (ไม่ใช่ "Clear all") และแถบ chip ขึ้นหัวว่า **Filters:**
> - **ตัวกรองสถานะไม่ใช่ dropdown ลอยอยู่บน toolbar อีกแล้ว** — อยู่หลังปุ่ม **Filter** (`ListFilterMenu` แบบ popover สองชั้น บน desktop / bottom sheet บนมือถือ) แล้วจึงเลือกฟิลด์ Status (TC-SPER-010005 ถูกแก้ตาม)
> - **เคสที่เพิ่มใหม่ 5 เคส**: `TC-SPER-010008` (redirect ของ URL เดิม), `TC-SPER-010009` (แถบแบ่งหน้าฝั่ง desktop), `TC-SPER-010010` (Save current filters as view), `TC-SPER-100003` (BU ที่ไม่ได้ซื้อ feature `system_admin.inventory_period`), `TC-SPER-900002` (เมนู More actions บนมือถือ)
> - **ข้อเท็จจริงที่ไม่ได้เขียนเป็นเคส** เพราะจะกลายเป็นเคสแดงเมื่อ dev ทำเพิ่ม: หน้านี้ **ไม่มีปุ่มลบ** (`InventoryPeriodCard` รับ prop `onDelete` ได้แต่หน้า list ไม่ส่งมา และ `systemAdmin.inventoryPeriod.deleteTitle` / `deleteConfirm` มีใน `messages/en.json` แต่ยังไม่มีที่เรียกใช้) จึงไม่มีเคส block 05 · `ListToolbar` ถูกเรียกโดย**ไม่ส่ง prop `table`** หน้านี้จึงไม่มีเมนู Sort และ Toggle Columns (ต่างจากหน้ารายการอื่น) · ปุ่ม Generate / Export / Print ถูกซ่อนบนจอเล็กด้วย `hidden sm:inline-flex` แล้วไปโผล่ในเมนู More actions แทน
> - **RBAC/สิทธิ์**: route ไม่มี guard ของตัวเองใน `router.tsx` — การบล็อกมาจาก `RouteGuard` ที่ `root-layout.tsx` ซึ่งอ่าน leaf จาก `constant/module-list.ts` (`permission: PERMISSIONS.system_configuration.view`, `licenseFeature: "system_admin.inventory_period"`) และเช็ค **license ก่อน permission เสมอ** โดย admin bypass ได้เฉพาะชั้น permission

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SPER-010001 | หน้า list รอบสินค้าคงคลังโหลดสำเร็จ | High | Smoke |
| TC-SPER-010002 | คอลัมน์ตารางแสดงครบ 6 คอลัมน์ | Medium | Functional |
| TC-SPER-010003 | ค้นหารอบสินค้าคงคลังใช้งานได้ | Medium | Functional |
| TC-SPER-010004 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-SPER-010005 | filter สถานะ (OPEN/CLOSED/LOCKED) ใช้งานได้ | Medium | Functional |
| TC-SPER-010006 | chip ของตัวกรองและลิงก์ Clear ทำงาน | Medium | Functional |
| TC-SPER-010007 | badge จำนวนรวมตรงกับ total records | Low | Functional |
| TC-SPER-010008 | เปิด URL เดิม /system-admin/period แล้วถูก redirect | High | Functional |
| TC-SPER-010009 | แถบแบ่งหน้าฝั่ง desktop ทำงาน | Medium | Functional |
| TC-SPER-010010 | บันทึกตัวกรองปัจจุบันเป็น view | Low | Functional |
| TC-SPER-020001 | คลิกค่าในคอลัมน์ Inventory Period เปิด dialog แก้ไข | High | Smoke |
| TC-SPER-030001 | เปิด dialog Add Inventory Period สำเร็จ | High | Smoke |
| TC-SPER-030002 | สร้างรอบใหม่ (year/month/start/end/status) สำเร็จ | High | CRUD |
| TC-SPER-030003 | สร้างรอบด้วยสถานะ Closed สำเร็จ | Medium | CRUD |
| TC-SPER-040001 | แก้ไขวันที่สิ้นสุดของรอบแล้ว Save สำเร็จ | High | CRUD |
| TC-SPER-040002 | เปลี่ยนสถานะรอบจาก Open → Closed | High | Functional |
| TC-SPER-040003 | เปลี่ยนสถานะรอบเป็น Locked | High | Functional |
| TC-SPER-040004 | กด Cancel ใน dialog ไม่บันทึกการแก้ไข | Medium | Functional |
| TC-SPER-050001 | Generate next 12 inventory periods สำเร็จ | High | Functional |
| TC-SPER-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าหน้านี้ต้องเจอ Permission Denied | High | Authorization |
| TC-SPER-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SPER-100003 | BU ที่ไม่ได้ซื้อ feature ต้องเจอ Feature Not Licensed | Medium | Authorization |
| TC-SPER-200001 | บันทึกโดยไม่กรอก Fiscal Year ต้องแสดง error | High | Validation |
| TC-SPER-200002 | Fiscal Month นอกช่วง 1-12 ต้องแสดง error | High | Validation |
| TC-SPER-200003 | บันทึกโดยไม่เลือก Start Date ต้องแสดง error | Medium | Validation |
| TC-SPER-200004 | บันทึกโดยไม่เลือก End Date ต้องแสดง error | Medium | Validation |
| TC-SPER-200005 | End Date ก่อน Start Date ต้องแสดง error | High | Validation |
| TC-SPER-300001 | Export รอบสินค้าคงคลังเป็นไฟล์ xlsx สำเร็จ | Medium | Functional |
| TC-SPER-300002 | Export ขณะไม่มีข้อมูลแสดง warning | Low | Edge Case |
| TC-SPER-300003 | Print เรียก print dialog ของเบราว์เซอร์ | Low | Functional |
| TC-SPER-900001 | mobile แสดงแบบ card list และ infinite scroll | Low | Edge Case |
| TC-SPER-900002 | mobile ย้าย Generate/Export/Print ไปเมนู More actions | Low | Edge Case |

---
## TC-SPER-010001 — หน้า list รอบสินค้าคงคลังโหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin ที่มีสิทธิ์ System Administration และเลือก BU ที่ซื้อ feature `system_admin.inventory_period` แล้ว
**Steps**
1. ไปที่ `/system-admin/inventory-period`
**Expected**
URL ตรงกับ `/system-admin/inventory-period`; หัวข้อหน้าแสดงคำว่า "Inventory Period" พร้อมคำอธิบาย "Inventory periods — open one to post into, close it when the month is done." และตาราง DataGrid (desktop) แสดงภายใน 10 วินาที

---
## TC-SPER-010002 — คอลัมน์ตารางแสดงครบ 6 คอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบสินค้าคงคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. ตรวจหัวคอลัมน์ของตาราง
3. ตรวจเซลล์ของคอลัมน์ Status ในแถวแรก
**Expected**
ตารางแสดงคอลัมน์ Inventory Period, Fiscal Year, Fiscal Month, Start Date, End Date และ Status ตามลำดับ; คอลัมน์ Status แสดง `StatusIconLabel` (ไอคอน + ข้อความพิมพ์ใหญ่ OPEN / CLOSED / LOCKED) ไม่ใช่ badge สีทึบ

---
## TC-SPER-010003 — ค้นหารอบสินค้าคงคลังใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบที่ทราบค่า period แน่นอน
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. พิมพ์ค่า period ในช่องค้นหา (placeholder "Search...")
3. กด Enter (ช่องค้นหายิงคำค้นเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น ไม่ค้นหาระหว่างพิมพ์)
**Expected**
ตารางกรองแสดงเฉพาะรายการที่ตรงกับคำค้นภายใน 10 วินาที และปุ่มท้ายช่องค้นหาเปลี่ยนเป็นกากบาท (Clear search)

---
## TC-SPER-010004 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. พิมพ์คำสุ่มที่ไม่มีในระบบแล้วกด Enter
**Expected**
ตารางแสดง `EmptyComponent` พร้อมข้อความ "No data found" ภายใน 10 วินาที

---
## TC-SPER-010005 — filter สถานะ (OPEN/CLOSED/LOCKED) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบหลายสถานะใน DB
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกปุ่ม **Filter** บน toolbar
3. เลือกฟิลด์ **Status** ในเมนู (desktop เปิด submenu ฝั่งซ้าย / มือถือเปิด bottom sheet)
4. เลือกตัวเลือก **OPEN**
**Expected**
ตัวกรองมีผลทันทีโดยไม่ต้องกดยืนยัน; ตารางแสดงเฉพาะรอบสถานะ OPEN, ปุ่ม Filter ขึ้น badge จำนวน 1 และแถบ chip ตัวกรองปรากฏใต้ toolbar

---
## TC-SPER-010006 — chip ของตัวกรองและลิงก์ Clear ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. เปิดเมนู Filter แล้วเลือก Status = CLOSED
2. ตรวจแถบ chip ที่ปรากฏใต้ toolbar
3. คลิกลิงก์ **Clear** ท้ายแถบ chip
**Expected**
ขั้นที่ 2 แถบขึ้นหัวว่า "Filters:" พร้อม chip ของ Status ที่มีปุ่มกากบาทในตัว; หลังขั้นที่ 3 ตัวกรองถูกล้างทั้งชุด แถบ chip หายไป badge บนปุ่ม Filter หายไป และตารางกลับมาแสดงทุกสถานะ

---
## TC-SPER-010007 — badge จำนวนรวมตรงกับ total records
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบสินค้าคงคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. อ่านค่า badge ข้างหัวข้อ "Inventory Period"
**Expected**
badge แสดงจำนวนรวมเป็นตัวเลขรูปแบบ locale (`toLocaleString`) ตรงกับ total ที่ระบบรายงาน และ badge จะไม่ถูก render เมื่อ total = 0

---
## TC-SPER-010008 — เปิด URL เดิม /system-admin/period แล้วถูก redirect
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin ที่มีสิทธิ์เข้าหน้านี้ (route redirect อยู่ใต้ ProtectedShell จึงต้อง login ก่อน)
**Steps**
1. เปิด URL เดิม `/system-admin/period` โดยตรง
2. รอให้ router ทำงาน
**Expected**
URL เปลี่ยนเป็น `/system-admin/inventory-period` และหน้ารายการแสดงตามปกติ; เป็นการ redirect แบบ `replace` — กดปุ่ม Back ของเบราว์เซอร์แล้วไม่วนกลับมาที่ `/system-admin/period` อีก

---
## TC-SPER-010009 — แถบแบ่งหน้าฝั่ง desktop ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิดด้วย viewport ขนาด desktop; มีรอบมากกว่า 1 หน้า
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. อ่านแถบล่างของตาราง (`aria-label` = "Pagination")
3. คลิกปุ่มที่มี `aria-label` = "Go to next page"
**Expected**
แถบแสดงข้อความ "Showing … of …" พร้อมตัวเลือก "Rows" (Rows per page) และปุ่มเลื่อนหน้า Go to first/previous/next/last page; หลังคลิก Next ตารางแสดงข้อมูลหน้าถัดไปและเลขหน้าที่ถูกไฮไลต์ขยับตาม

---
## TC-SPER-010010 — บันทึกตัวกรองปัจจุบันเป็น view
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ตั้งตัวกรอง Status ไว้แล้ว 1 ค่า
**Steps**
1. คลิกปุ่ม **Filter**
2. เลือกรายการ **Save current filters as view** ท้ายเมนู
**Expected**
เมนูปิดแล้วเปิด dialog หัวข้อ "Save view" ซึ่งมีช่อง "View name" และตัวเลือก "Visibility" (Only me / Everyone in this business unit) พร้อมปุ่ม Save

---
## TC-SPER-020001 — คลิกค่าในคอลัมน์ Inventory Period เปิด dialog แก้ไข
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบสินค้าคงคลังอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกค่าในคอลัมน์ Inventory Period ของแถวแรก (ปุ่มแบบ `CellAction` ไม่ใช่การคลิกทั้งแถว)
**Expected**
เปิด dialog หัวข้อ "Edit Inventory Period" พร้อมเติมค่าเดิมของรอบที่เลือกครบทุกฟิลด์ (Fiscal Year, Fiscal Month, Start Date, End Date, Status) และปุ่มยืนยันเขียนว่า **Save**

---
## TC-SPER-030001 — เปิด dialog Add Inventory Period สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกปุ่ม **Add Inventory Period**
**Expected**
เปิด dialog หัวข้อ "Add Inventory Period" พร้อมฟิลด์ Fiscal Year (ค่าเริ่มต้น = ปีปัจจุบัน), Fiscal Month (ค่าเริ่มต้น 1, placeholder "1-12"), Start Date และ End Date (ว่าง) และ Status ค่าเริ่มต้น Open; ปุ่มยืนยันเขียนว่า **Create**

---
## TC-SPER-030002 — สร้างรอบใหม่ (year/month/start/end/status) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; รอบของ fiscal year/month ที่จะสร้างยังไม่มีใน DB
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. กรอก Fiscal Year และ Fiscal Month (1-12)
3. เลือก Start Date และ End Date ผ่าน DatePicker (End ≥ Start)
4. เลือก Status = Open
5. กดปุ่ม **Create**
**Expected**
ระหว่างรอ ปุ่มเปลี่ยนข้อความเป็น "Creating..." และฟิลด์ทั้งหมดถูก disable; เมื่อสำเร็จแสดง toast "Inventory Period created successfully", dialog ปิดเอง และรอบใหม่ปรากฏในตาราง

---
## TC-SPER-030003 — สร้างรอบด้วยสถานะ Closed สำเร็จ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; รอบที่จะสร้างยังไม่มีใน DB
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. กรอก Fiscal Year / Fiscal Month และเลือก Start Date / End Date
3. เปิด dropdown Status แล้วเลือก **Closed**
4. กดปุ่ม Create
**Expected**
แสดง toast "Inventory Period created successfully"; แถวใหม่ในตารางแสดงสถานะเป็น `StatusIconLabel` ข้อความ **CLOSED**

---
## TC-SPER-040001 — แก้ไขวันที่สิ้นสุดของรอบแล้ว Save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีรอบสินค้าคงคลังใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. คลิกค่าในคอลัมน์ Inventory Period เพื่อเปิด dialog "Edit Inventory Period"
2. เปลี่ยนค่า End Date ให้ยังคง ≥ Start Date
3. กดปุ่ม **Save**
**Expected**
ระหว่างรอ ปุ่มเปลี่ยนข้อความเป็น "Saving..."; เมื่อสำเร็จแสดง toast "Inventory Period updated successfully", dialog ปิดเอง และค่า End Date ใหม่แสดงในตาราง (คำขอ update ส่ง `doc_version` ของเรกคอร์ดที่โหลดมาไปด้วยตาม optimistic concurrency ของ backend)

---
## TC-SPER-040002 — เปลี่ยนสถานะรอบจาก Open → Closed
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีรอบสถานะ OPEN ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด dialog แก้ไขของรอบที่สถานะ OPEN
2. เปลี่ยน Status เป็น **Closed**
3. กดปุ่ม Save
**Expected**
แสดง toast "Inventory Period updated successfully" และสถานะของรอบในตารางเปลี่ยนเป็น **CLOSED**

---
## TC-SPER-040003 — เปลี่ยนสถานะรอบเป็น Locked
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีรอบสถานะ OPEN หรือ CLOSED ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด dialog แก้ไขของรอบ
2. เปลี่ยน Status เป็น **Locked**
3. กดปุ่ม Save
**Expected**
แสดง toast "Inventory Period updated successfully" และสถานะของรอบในตารางเปลี่ยนเป็น **LOCKED**

---
## TC-SPER-040004 — กด Cancel ใน dialog ไม่บันทึกการแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีรอบสินค้าคงคลังใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. เปิด dialog แก้ไขของรอบ
2. เปลี่ยนค่า Fiscal Month
3. กดปุ่ม **Cancel**
**Expected**
dialog ปิดโดยไม่ยิงคำขอบันทึกและไม่มี toast; ค่าของรอบในตารางคงเดิม; เปิด dialog ซ้ำแล้วฟอร์มถูก reset กลับเป็นค่าจากเรกคอร์ดเดิม

---
## TC-SPER-050001 — Generate next 12 inventory periods สำเร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิดด้วย viewport ขนาด desktop (ปุ่มนี้ถูกซ่อนบนจอเล็ก)
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกปุ่ม **Generate next 12 inventory periods** (ไอคอน CalendarPlus)
**Expected**
ระบบยิง POST `/api/{bu}/inventory-periods/next` ด้วย payload `{ count: 12, start_day: 1 }`; ระหว่างรอปุ่มถูก disable; เมื่อสำเร็จแสดง toast "Inventory Period created successfully" และรายการในตารางถูกรีเฟรชพร้อมรอบใหม่

---
## TC-SPER-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าหน้านี้ต้องเจอ Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่ใช่ admin และไม่มีสิทธิ์ `system_configuration.view`; BU ปัจจุบันซื้อ feature `system_admin.inventory_period` แล้ว (เพื่อแยกผลจาก TC-SPER-100003)
**Steps**
1. เปิด URL `/system-admin/inventory-period` โดยตรง
**Expected**
`RouteGuard` บล็อกและแสดงกล่อง `role="alert"` หัวข้อ "Permission Denied" พร้อมข้อความ "You don't have permission to view this page." และ "Contact your administrator to request access." กับปุ่ม "Go to an available page"; ไม่มีตารางรอบสินค้าคงคลังแสดงเลย

---
## TC-SPER-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว / ไม่มี token ใน store)
**Steps**
1. เปิด URL `/system-admin/inventory-period` โดยตรง
**Expected**
`RequireAuth` redirect ไปยัง `/login` แบบ `replace` (พา path เดิมไปใน state `from`); ไม่แสดงเนื้อหาโมดูลเลย

---
## TC-SPER-100003 — BU ที่ไม่ได้ซื้อ feature ต้องเจอ Feature Not Licensed
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่มีสิทธิ์ (รวมถึงบัญชี admin) แต่เลือก BU ที่สัญญาไม่รวม feature `system_admin.inventory_period`; เปิดการบังคับ license (`LICENSE_ENFORCEMENT`)
**Steps**
1. เปิด URL `/system-admin/inventory-period` โดยตรง
**Expected**
`RouteGuard` เช็ค license ก่อน permission จึงบล็อกแม้ผู้ใช้เป็น admin (ชั้นนี้ไม่มี admin bypass) และแสดงกล่อง `role="alert"` พร้อมข้อความ "This feature is not included in your organization's subscription. Contact your administrator or sales representative to enable it." กับปุ่ม "Go to an available page"

---
## TC-SPER-200001 — บันทึกโดยไม่กรอก Fiscal Year ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด dialog "Add Inventory Period"
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. ล้างค่าในช่อง Fiscal Year ให้ว่าง (ค่าเริ่มต้นเป็นปีปัจจุบัน) แต่กรอกฟิลด์อื่นครบ
3. กดปุ่ม Create
**Expected**
แสดงข้อความ "Fiscal Year is required" ใต้ช่อง Fiscal Year; ฟอร์มไม่ถูก submit, dialog ยังเปิดอยู่ และไม่มี toast สำเร็จ

---
## TC-SPER-200002 — Fiscal Month นอกช่วง 1-12 ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด dialog "Add Inventory Period"
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. พิมพ์ค่า Fiscal Month = 13
3. กดปุ่ม Create
**Expected**
แสดงข้อความ "Max 12" ใต้ช่อง Fiscal Month และฟอร์มไม่ถูก submit (พิมพ์ค่า 0 จะได้ข้อความ "Min 1" ด้วยกลไกเดียวกัน)

---
## TC-SPER-200003 — บันทึกโดยไม่เลือก Start Date ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด dialog "Add Inventory Period"
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. กรอก Fiscal Year / Fiscal Month และเลือกเฉพาะ End Date โดยเว้น Start Date ไว้
3. กดปุ่ม Create
**Expected**
แสดงข้อความ "Start Date is required" ใต้ช่อง Start Date และฟอร์มไม่ถูก submit

---
## TC-SPER-200004 — บันทึกโดยไม่เลือก End Date ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด dialog "Add Inventory Period"
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. กรอก Fiscal Year / Fiscal Month และเลือกเฉพาะ Start Date โดยเว้น End Date ไว้
3. กดปุ่ม Create
**Expected**
แสดงข้อความ "End Date is required" ใต้ช่อง End Date และฟอร์มไม่ถูก submit

---
## TC-SPER-200005 — End Date ก่อน Start Date ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด dialog "Add Inventory Period"
**Steps**
1. คลิกปุ่ม Add Inventory Period
2. กรอก Fiscal Year / Fiscal Month
3. เลือก Start Date แล้วเลือก End Date ที่อยู่ก่อน Start Date
4. กดปุ่ม Create
**Expected**
แสดงข้อความ "End date must not be before start date" ใต้ช่อง End Date (มาจาก `.refine()` ของ zod schema ที่ผูก path ไว้ที่ `end_at`) และฟอร์มไม่ถูก submit

---
## TC-SPER-300001 — Export รอบสินค้าคงคลังเป็นไฟล์ xlsx สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีรอบสินค้าคงคลังอย่างน้อย 1 รายการ; เปิดด้วย viewport ขนาด desktop
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกปุ่ม **Export**
**Expected**
ระหว่างรอ ปุ่มเปลี่ยนเป็น "Exporting..." พร้อม spinner และถูก disable; ระบบดาวน์โหลดไฟล์ xlsx ชื่อขึ้นต้นด้วย `inventory-period` (sheet "Inventory Periods") ที่มีคอลัมน์ Inventory Period / Fiscal Year / Fiscal Month / Start Date / End Date / Status และแสดง toast "Exported {count} records" ตามจำนวนแถวที่ export (เคารพคำค้นและตัวกรองที่เปิดอยู่)

---
## TC-SPER-300002 — Export ขณะไม่มีข้อมูลแสดง warning
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ตั้งคำค้น/ตัวกรองจนผลลัพธ์เป็น 0 แถว
**Steps**
1. ตั้ง filter หรือคำค้นให้ไม่พบรอบใด ๆ
2. คลิกปุ่ม Export
**Expected**
แสดง toast แบบ warning ข้อความ "No data to export" และไม่มีไฟล์ถูกดาวน์โหลด

---
## TC-SPER-300003 — Print เรียก print dialog ของเบราว์เซอร์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list; เปิดด้วย viewport ขนาด desktop
**Steps**
1. ไปที่ `/system-admin/inventory-period`
2. คลิกปุ่ม **Print**
**Expected**
ระบบเรียก `globalThis.print()` (เปิด print dialog ของเบราว์เซอร์) โดยไม่มีการนำทางออกจากหน้า

---
## TC-SPER-900001 — mobile แสดงแบบ card list และ infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิดหน้าด้วย viewport ขนาด mobile; มีรอบมากกว่า 1 หน้า
**Steps**
1. เปิด `/system-admin/inventory-period` ด้วย viewport mobile
2. เลื่อนลงจนสุดรายการ
**Expected**
หน้าแสดงรายการเป็นการ์ด (grid 1 คอลัมน์) ที่มีหัวการ์ดเป็นค่า period, ป้ายสถานะ และแถว Fiscal Year / Fiscal Month / Start Date / End Date; เลื่อนถึง sentinel แล้วโหลดหน้าถัดไปต่อท้ายอัตโนมัติพร้อม spinner (ไม่มีแถบแบ่งหน้าแบบ desktop)

---
## TC-SPER-900002 — mobile ย้าย Generate/Export/Print ไปเมนู More actions
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิดหน้าด้วย viewport ขนาด mobile
**Steps**
1. เปิด `/system-admin/inventory-period` ด้วย viewport mobile
2. คลิกปุ่มไอคอนสามจุดที่มี `aria-label` = "More actions"
**Expected**
ปุ่ม Generate next 12 inventory periods / Export / Print ไม่ปรากฏบนแถบด้านบน แต่อยู่ในเมนู dropdown ที่เปิดขึ้นครบทั้ง 3 รายการ ส่วนปุ่ม Add Inventory Period ยังคงอยู่บนแถบด้านบนตามเดิม
