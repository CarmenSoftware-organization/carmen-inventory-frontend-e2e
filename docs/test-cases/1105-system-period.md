# System Period — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/period`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** System Period
**Frontend route:** `routes/system-admin/period`  •  **URL:** `/system-admin/period`
**Prefix:** `SPER`
**Default role:** Platform Admin
**Total test cases:** 27

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SPER-010001 | หน้า list งวดบัญชีโหลดสำเร็จ | High | Smoke |
| TC-SPER-010002 | คอลัมน์ตาราง (Period, Fiscal Year/Month, Start/End, Status) แสดงครบ | Medium | Functional |
| TC-SPER-010003 | ค้นหางวดบัญชีใช้งานได้ | Medium | Functional |
| TC-SPER-010004 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-SPER-010005 | filter สถานะ (open/closed/locked) ใช้งานได้ | Medium | Functional |
| TC-SPER-010006 | active filter badge และ Clear all ทำงาน | Medium | Functional |
| TC-SPER-010007 | badge จำนวนรวมตรงกับ total records | Low | Functional |
| TC-SPER-020001 | คลิกแถว period เปิด dialog แก้ไข | High | Smoke |
| TC-SPER-030001 | เปิด dialog Add สำเร็จ | High | Smoke |
| TC-SPER-030002 | สร้างงวดบัญชีใหม่ (year/month/start/end/status) สำเร็จ | High | CRUD |
| TC-SPER-030003 | สร้างงวดด้วยสถานะ closed สำเร็จ | Medium | CRUD |
| TC-SPER-040001 | แก้ไขวันที่สิ้นสุดของงวดแล้ว save สำเร็จ | High | CRUD |
| TC-SPER-040002 | เปลี่ยนสถานะงวดจาก open → closed (close period) | High | Functional |
| TC-SPER-040003 | เปลี่ยนสถานะงวดเป็น locked (lock period) | High | Functional |
| TC-SPER-040004 | กด Cancel ใน dialog ไม่บันทึกการแก้ไข | Medium | Functional |
| TC-SPER-050001 | Generate Next สร้างงวดล่วงหน้า 12 งวดสำเร็จ | High | Functional |
| TC-SPER-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง period ต้องถูกบล็อก | High | Authorization |
| TC-SPER-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SPER-200001 | บันทึกโดยไม่กรอก fiscal year ต้องแสดง error | High | Validation |
| TC-SPER-200002 | fiscal month นอกช่วง 1-12 ต้องแสดง error | High | Validation |
| TC-SPER-200003 | บันทึกโดยไม่เลือก start date ต้องแสดง error | Medium | Validation |
| TC-SPER-200004 | บันทึกโดยไม่เลือก end date ต้องแสดง error | Medium | Validation |
| TC-SPER-200005 | end date ก่อน start date ต้องแสดง error | High | Validation |
| TC-SPER-300001 | Export งวดบัญชีเป็นไฟล์สำเร็จ | Medium | Functional |
| TC-SPER-300002 | Export ขณะไม่มีข้อมูลแสดง warning | Low | Edge Case |
| TC-SPER-300003 | Print เรียก print dialog ของเบราว์เซอร์ | Low | Functional |
| TC-SPER-900001 | mobile แสดงแบบ card list และ infinite scroll | Low | Edge Case |

---
## TC-SPER-010001 — หน้า list งวดบัญชีโหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin
**Steps**
1. ไปที่ `/system-admin/period`
**Expected**
URL ตรงกับ `/system-admin/period`; หัวข้อหน้าและตาราง DataGrid (desktop) แสดงภายใน 10 วินาที

---
## TC-SPER-010002 — คอลัมน์ตาราง (Period, Fiscal Year/Month, Start/End, Status) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดบัญชีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/period`
2. ตรวจหัวคอลัมน์ของตาราง
**Expected**
ตารางแสดงคอลัมน์ Period, Fiscal Year, Fiscal Month, Start At, End At และ Status (badge สีตามสถานะ)

---
## TC-SPER-010003 — ค้นหางวดบัญชีใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดบัญชีที่ค่า period รู้แน่นอน
**Steps**
1. ไปที่ `/system-admin/period`
2. พิมพ์ค่า period ในช่องค้นหาแล้วกด Enter
**Expected**
ตารางกรองแสดงเฉพาะงวดที่ตรงกับคำค้นภายใน 10 วินาที

---
## TC-SPER-010004 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/period`
2. ค้นหาด้วยคำสุ่มที่ไม่มีในระบบ
**Expected**
แสดง EmptyComponent (ไม่มีรายการที่ตรงกับคำค้น) ภายใน 10 วินาที

---
## TC-SPER-010005 — filter สถานะ (open/closed/locked) ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดหลายสถานะใน DB
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิก StatusFilter
3. เลือกสถานะ Open
**Expected**
ตารางแสดงเฉพาะงวดสถานะ Open และมี active filter badge ปรากฏ

---
## TC-SPER-010006 — active filter badge และ Clear all ทำงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ได้เลือก filter สถานะไว้แล้ว
**Steps**
1. เลือก filter สถานะ Closed
2. คลิก Clear all ใน ActiveFilterBar
**Expected**
filter ถูกล้าง; ตารางกลับมาแสดงทุกสถานะ และ active filter badge หายไป

---
## TC-SPER-010007 — badge จำนวนรวมตรงกับ total records
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดบัญชีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/period`
2. อ่านค่า badge ข้างหัวข้อหน้า
**Expected**
badge แสดงจำนวนรวมเป็นตัวเลขรูปแบบ locale ตรงกับ total ที่ระบบรายงาน (ซ่อนเมื่อ total = 0)

---
## TC-SPER-020001 — คลิกแถว period เปิด dialog แก้ไข
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดบัญชีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิกค่าในคอลัมน์ Period (CellAction)
**Expected**
เปิด PeriodDialog ในโหมดแก้ไข พร้อมเติมค่าเดิมของงวดที่เลือกในฟอร์ม

---
## TC-SPER-030001 — เปิด dialog Add สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิกปุ่ม Add
**Expected**
เปิด PeriodDialog หัวข้อ "Add" พร้อมฟิลด์ fiscal year, fiscal month, start, end, status (ค่าเริ่มต้น open)

---
## TC-SPER-030002 — สร้างงวดบัญชีใหม่ (year/month/start/end/status) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; งวด year/month ที่จะสร้างยังไม่มีใน DB
**Steps**
1. คลิก Add
2. กรอก fiscal year และ fiscal month (1-12)
3. เลือก start date และ end date (end ≥ start)
4. เลือก status = Open
5. กด Create
**Expected**
แสดง toast สร้างสำเร็จ; dialog ปิด และงวดใหม่ปรากฏในตาราง

---
## TC-SPER-030003 — สร้างงวดด้วยสถานะ closed สำเร็จ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; งวดที่จะสร้างยังไม่มีใน DB
**Steps**
1. คลิก Add
2. กรอก fiscal year/month + start/end
3. เลือก status = Closed
4. กด Create
**Expected**
งวดถูกสร้างด้วยสถานะ Closed; badge สถานะในตารางแสดง "Closed"

---
## TC-SPER-040001 — แก้ไขวันที่สิ้นสุดของงวดแล้ว save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีงวดบัญชีใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. คลิกแถวงวดเพื่อเปิด dialog แก้ไข
2. เปลี่ยนค่า end date (ยังคง ≥ start)
3. กด Save
**Expected**
แสดง toast แก้ไขสำเร็จ; dialog ปิด และค่า end date ใหม่แสดงในตาราง

---
## TC-SPER-040002 — เปลี่ยนสถานะงวดจาก open → closed (close period)
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีงวดสถานะ Open ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. คลิกแถวงวด Open เพื่อเปิด dialog
2. เปลี่ยน status เป็น Closed
3. กด Save
**Expected**
แสดง toast แก้ไขสำเร็จ; badge สถานะของงวดเปลี่ยนเป็น "Closed"

---
## TC-SPER-040003 — เปลี่ยนสถานะงวดเป็น locked (lock period)
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีงวดสถานะ Open หรือ Closed ใน DB; เข้าสู่ระบบเป็น Platform Admin
**Steps**
1. คลิกแถวงวดเพื่อเปิด dialog
2. เปลี่ยน status เป็น Locked
3. กด Save
**Expected**
แสดง toast แก้ไขสำเร็จ; badge สถานะของงวดเปลี่ยนเป็น "Locked"

---
## TC-SPER-040004 — กด Cancel ใน dialog ไม่บันทึกการแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีงวดบัญชีใน DB; เปิด dialog แก้ไขแล้วเปลี่ยนค่าบางส่วน
**Steps**
1. เปิด dialog แก้ไขของงวด
2. เปลี่ยนค่า fiscal month
3. กด Cancel
**Expected**
dialog ปิดโดยไม่บันทึก; ค่าของงวดในตารางคงเดิม

---
## TC-SPER-050001 — Generate Next สร้างงวดล่วงหน้า 12 งวดสำเร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ระบบรองรับการ generate งวดถัดไป
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิกปุ่ม Generate Next (CalendarPlus)
**Expected**
ระบบเรียก generate next (count=12, start_day=1); แสดง toast สร้างสำเร็จ และมีงวดใหม่เพิ่มในตาราง

---
## TC-SPER-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง period ต้องถูกบล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ System Admin
**Steps**
1. ไปที่ `/system-admin/period`
**Expected**
ระบบปฏิเสธการเข้าถึง (forbidden หรือ redirect ออก) ไม่แสดงรายการงวดบัญชี

---
## TC-SPER-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว)
**Steps**
1. เปิด URL `/system-admin/period` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` ไม่แสดงเนื้อหาโมดูล

---
## TC-SPER-200001 — บันทึกโดยไม่กรอก fiscal year ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด Add dialog
**Steps**
1. คลิก Add
2. เว้น fiscal year (ค่า 0/ว่าง) แต่กรอกฟิลด์อื่น
3. กด Create
**Expected**
แสดงข้อความ error required ใต้ช่อง fiscal year และฟอร์มไม่ถูก submit

---
## TC-SPER-200002 — fiscal month นอกช่วง 1-12 ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด Add dialog
**Steps**
1. คลิก Add
2. กรอก fiscal month = 13 (หรือ 0)
3. กด Create
**Expected**
แสดงข้อความ error min/max month (1-12) ใต้ช่อง fiscal month และฟอร์มไม่ถูก submit

---
## TC-SPER-200003 — บันทึกโดยไม่เลือก start date ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด Add dialog
**Steps**
1. คลิก Add
2. กรอก fiscal year/month + end date แต่เว้น start date
3. กด Create
**Expected**
แสดงข้อความ error required ใต้ช่อง start date และฟอร์มไม่ถูก submit

---
## TC-SPER-200004 — บันทึกโดยไม่เลือก end date ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด Add dialog
**Steps**
1. คลิก Add
2. กรอก fiscal year/month + start date แต่เว้น end date
3. กด Create
**Expected**
แสดงข้อความ error required ใต้ช่อง end date และฟอร์มไม่ถูก submit

---
## TC-SPER-200005 — end date ก่อน start date ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิด Add dialog
**Steps**
1. คลิก Add
2. กรอก fiscal year/month
3. เลือก start date แล้วเลือก end date ที่อยู่ก่อน start date
4. กด Create
**Expected**
แสดงข้อความ error "end date after start" ใต้ช่อง end date (zod refine) และฟอร์มไม่ถูก submit

---
## TC-SPER-300001 — Export งวดบัญชีเป็นไฟล์สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; มีงวดบัญชีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิกปุ่ม Export
**Expected**
ระบบ export คอลัมน์ Period/Fiscal Year/Fiscal Month/Start/End/Status เป็นไฟล์; แสดง toast สำเร็จพร้อมจำนวนแถว

---
## TC-SPER-300002 — Export ขณะไม่มีข้อมูลแสดง warning
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; ผลการ filter ไม่มีรายการ (0 แถว)
**Steps**
1. ตั้ง filter/ค้นหาให้ไม่พบงวดใด ๆ
2. คลิกปุ่ม Export
**Expected**
แสดง toast warning (exportNoData) ว่าไม่มีข้อมูลให้ export

---
## TC-SPER-300003 — Print เรียก print dialog ของเบราว์เซอร์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/period`
2. คลิกปุ่ม Print
**Expected**
ระบบเรียก `window.print()` (เปิด print dialog ของเบราว์เซอร์)

---
## TC-SPER-900001 — mobile แสดงแบบ card list และ infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Platform Admin; เปิดหน้าด้วย viewport ขนาด mobile; มีงวดหลายรายการ
**Steps**
1. เปิด `/system-admin/period` ด้วย viewport mobile
2. เลื่อนลงจนสุดรายการ
**Expected**
หน้าแสดงงวดเป็น PeriodCard (grid 1 คอลัมน์) และโหลดเพิ่มแบบ infinite scroll เมื่อถึง sentinel
