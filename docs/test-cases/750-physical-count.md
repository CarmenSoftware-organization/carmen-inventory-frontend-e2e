# Physical Count — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/inventory-management/physical-count`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Physical Count
**Frontend route:** `routes/inventory-management/physical-count`  •  **URL:** `/inventory-management/physical-count` (และ `/inventory-management/physical-count/new`, `/inventory-management/physical-count/:id`, `/inventory-management/physical-count/:id/entry`, `/inventory-management/physical-count/:id/review`)
**Prefix:** `PCNT`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 41

> หมายเหตุสำคัญสำหรับผู้รีวิว: สอบทานกับโค้ดจริงทั้งโมดูลเมื่อ 2026-09-20 (ไฟล์ล่าสุดของโมดูลคือ `e298dcfb` 2026-09-16 · merge ล่าสุด `33066158`) ทุกข้อความ/ป้ายปุ่มในเอกสารนี้อ้างอิง `messages/en.json` และคอมโพเนนต์จริง
>
> **ลบ 2 เคส** — `TC-PCNT-030002`, `TC-PCNT-030050` (เดิม: "สร้าง count session ผ่านฟอร์มแล้วปรากฏในรายการ") หน้า list **ไม่ได้แสดงรายการเอกสารใบนับ** แต่แสดงรายการ *location* ของรอบตรวจนับ จึง assert "ปรากฏในรายการ" ไม่ได้เลย และ payload ที่ฟอร์มส่งคือ `{ department_id }` ขณะที่ `CreatePhysicalCountDto` คือ `{ physical_count_period_id, location_id, description? }` (pc-form.tsx แปลงด้วย `as unknown as`) — ยืนยันความสำเร็จไม่ได้ เส้นทางสร้างใบนับจริงคือปุ่ม **Start** บนการ์ด location (`useOpenPhysicalCount`, commit `77ac4083`) ซึ่งครอบไว้แล้วที่ `TC-PCNT-060001`
>
> **แก้เนื้อหาเคสเดิมที่ขัดกับโค้ดปัจจุบัน** — `TC-PCNT-040001` เดิม assert "save สำเร็จ + ฟอร์มแสดงค่าที่แก้แล้ว" แต่หน้านี้อ่านข้อมูลจาก `PhysicalCountData` ซึ่ง **ไม่มีฟิลด์ `department_id`** (pc-edit-content cast ข้ามชนิด) ช่อง Department จึงว่างเสมอ — เปลี่ยนเป็น assert โหมด view/edit ที่ตรวจได้จริง และเพิ่ม `TC-PCNT-040002` · `TC-PCNT-070004` ป้ายปุ่มจริงคือ **"Submit"** ไม่ใช่ "Submit physical count" · `TC-PCNT-070001` ถอดข้อความ "entry ถูกล็อกจากการแก้ไข" (ฝั่ง frontend ไม่มีอะไรล็อก) · `TC-PCNT-010005` ผลลัพธ์ต่างกันตาม filter ที่เลือก (ดูในเคส) · `TC-PCNT-200002` ค่าติดลบ **ถูกปรับเป็น 0** ไม่ใช่ถูกปฏิเสธ
>
> **เพิ่ม 10 เคส** — `010009`, `040002`, `060008`–`060010`, `070005`, `200003`, `900002`–`900004` ครอบพฤติกรรมที่ยังไม่มีใครดู (ลิงก์การ์ดไปหน้า Location, ค้นหา/รีเฟรชในหน้า entry, dialog "Counting has not started", หัวหน้า review, การตรวจไฟล์แนบ, เคส import ที่ผิดรูป, id ที่ไม่มีอยู่จริง)
>
> **Default role เปลี่ยนจาก Store Manager → Admin** — `StoreManager` มีอยู่จริงใน `tests/test-users.ts` (storemanager@blueledgers.com) แต่สิทธิ์ `inventory_management.physical_count.*` ของบัญชีนั้นยังไม่ได้ยืนยัน และทั้ง `FormToolbar` กับเมนูโมดูลข้ามการเช็คสิทธิ์ให้เฉพาะ admin ถ้าจะรันด้วย storemanager ต้องตรวจสิทธิ์ก่อน
>
> **Section ที่ใช้ยังเป็นชุดเดิม (01, 03–08, 10, 20, 90) — ไม่ต้องลงทะเบียน section เพิ่มใน `docs/test-id-scheme.md`**
>
> **Blocker ที่คนแปลงเป็น spec ต้องรู้**
> 1. **ต้องมีรอบตรวจนับที่สถานะ `counting`** ถึงจะกด Start ได้ รอบถูกสร้างเป็น `draft` อัตโนมัติตอนเรียก `/physical-count-periods/current` แล้วต้องไปกด **"Start Period Close"** ที่ `/inventory-management/period-end` เพื่อเลื่อนเป็น `counting` — การกดนั้น **ย้อนไม่ได้** และถ้ายังมีเอกสารค้างในงวด backend จะตอบ 422 พร้อม dialog รายการเอกสาร
> 2. เคสหมวด 06/07/08 **สร้างและแก้ข้อมูลจริง** (POST ใบนับ, PATCH save/review/submit) เมื่อ submit แล้ว location กลายเป็น `completed` การ์ดเปลี่ยนเป็นข้อความ "Done" ที่กดไม่ได้ — ทำซ้ำในงวดเดิมไม่ได้ ต้องเรียงลำดับ (`test.describe.serial`) หรือใช้คนละ location
> 3. **ไม่มีลิงก์ใน UI ไปหน้า `/new` และ `/:id`** ทั้งสองหน้าต้องเข้าด้วยการพิมพ์ URL (`:id` ได้จาก URL หลังกด Start)
> 4. ค่าที่กรอก/นำเข้าในหน้า entry อยู่ใน state ของหน้าเท่านั้น รีเฟรชก่อนกด Save for Resume แล้วหาย
> 5. งวด/รอบและใบนับผูกกับ BU — ต้อง active BU = BLAVG ก่อนทุกเคส
> 6. ข้อเท็จจริงที่ **จงใจไม่ล็อกเป็นสเปก**: (ก) การ์ดสถานะ completed render เป็นข้อความ ไม่ใช่ปุ่ม dialog "Coming soon" ใน `pc-component` จึงเข้าไม่ถึงจากหน้านี้ (ข) เปิด `/:id` ที่ไม่มีอยู่จริงจะได้ข้อความ error ทั่วไป ไม่ใช่ "Physical count not found" เพราะ `usePhysicalCountById` โยน `Error` ธรรมดา สถานะ 404 จึงหายไประหว่างทาง (ค) toast หลัง Save for Resume ใช้ข้อความเดียวกับป้ายปุ่ม ("Save for Resume") (ง) ตัวเลขบน KPI tiles ไม่ขยับตามคำค้น เพราะนับจากทั้งงวด — อย่า assert ว่าเปลี่ยน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PCNT-010001 | หน้า Physical Count โหลดสำเร็จ | High | Smoke |
| TC-PCNT-010002 | การ์ดเลือกงวดแสดงงวดปัจจุบันและเลือกงวดก่อนหน้าได้ | Medium | Functional |
| TC-PCNT-010003 | KPI tiles 4 ใบกรองรายการ location ได้ | High | Functional |
| TC-PCNT-010004 | ค้นหา location ตามชื่อหรือรหัส | Medium | Functional |
| TC-PCNT-010005 | ค้นหาแล้วไม่พบ location | Medium | Functional |
| TC-PCNT-010006 | checkbox Include Not Count ปรับรายการ location ได้ | Low | Functional |
| TC-PCNT-010007 | การ์ด location แสดงปุ่มตามสถานะและความคืบหน้า | Medium | Functional |
| TC-PCNT-010008 | การ์ดสรุปความคืบหน้ารวม (StatusHero) | Low | Functional |
| TC-PCNT-010009 | กดชื่อ/รหัส location บนการ์ดไปหน้า Location | Low | Functional |
| TC-PCNT-010050 | active BU = BLAVG | High | Smoke |
| TC-PCNT-030001 | เปิดหน้าสร้างใบนับ (/new) สำเร็จ | High | Smoke |
| TC-PCNT-030003 | ออกจากฟอร์มที่ยังไม่บันทึกต้องถามยืนยัน | Medium | Functional |
| TC-PCNT-040001 | เปิดใบนับ /physical-count/:id ในโหมด view | Medium | Functional |
| TC-PCNT-040002 | สลับเข้าโหมดแก้ไขและยกเลิกกลับโหมด view | Medium | Functional |
| TC-PCNT-050001 | ลบใบนับจากหน้า detail | High | CRUD |
| TC-PCNT-060001 | กด Start เปิดใบนับและเข้าหน้า entry | High | Functional |
| TC-PCNT-060002 | กรอก Actual Count แล้ว Save for Resume | High | Functional |
| TC-PCNT-060003 | filter pills All / Counted / Uncounted ในหน้า entry | Medium | Functional |
| TC-PCNT-060004 | เพิ่ม note และรูป evidence ให้รายการ | Medium | Functional |
| TC-PCNT-060005 | เครื่องคิดเลขแปลงหน่วยเพื่อหายอดนับ | Medium | Functional |
| TC-PCNT-060006 | Set empty to zero กับรายการที่ยังไม่นับ | Medium | Functional |
| TC-PCNT-060007 | Resume การนับที่ค้างไว้ | Medium | Alternate Flow |
| TC-PCNT-060008 | ค้นหาสินค้าในหน้า entry | Medium | Functional |
| TC-PCNT-060009 | ปุ่ม Refresh products ในหน้า entry | Low | Functional |
| TC-PCNT-060010 | กด Start ขณะรอบตรวจนับยังไม่เปิด | High | Alternate Flow |
| TC-PCNT-070001 | Submit for Review เมื่อนับครบทุกรายการ | High | Functional |
| TC-PCNT-070002 | หน้า review แสดง stat tiles 4 ใบ | High | Functional |
| TC-PCNT-070003 | ตาราง Variance Details แสดงผลต่างถูกต้อง | High | Functional |
| TC-PCNT-070004 | ยืนยันส่งผลนับ (Submit) เปลี่ยนสถานะใบนับ | High | Functional |
| TC-PCNT-070005 | หัวหน้า review และปุ่มย้อนกลับ | Low | Functional |
| TC-PCNT-080001 | Import ผลนับจากไฟล์ .xlsx/.csv | Medium | Functional |
| TC-PCNT-080002 | Export รายการเป็นไฟล์ Excel | Low | Functional |
| TC-PCNT-100001 | ผู้ใช้ที่ไม่มีสิทธิ์ดู Physical Count ถูกกันที่เมนูโมดูล | High | Authorization |
| TC-PCNT-100002 | ผู้ที่ไม่ได้เข้าสู่ระบบเปิด URL ตรง ๆ ถูกส่งไป /login | High | Auth-guard |
| TC-PCNT-200001 | บันทึกฟอร์มโดยไม่เลือก Department ต้องแสดง error | High | Validation |
| TC-PCNT-200002 | Actual Count ไม่รับค่าติดลบ | Medium | Validation |
| TC-PCNT-200003 | ไฟล์ evidence ที่ใหญ่เกินหรือไม่ใช่รูปถูกปฏิเสธ | Medium | Validation |
| TC-PCNT-900001 | Import ไฟล์ที่คอลัมน์ไม่ครบ | Low | Edge Case |
| TC-PCNT-900002 | Import ไฟล์ที่ไม่มีแถวใดจับคู่ได้ | Low | Edge Case |
| TC-PCNT-900003 | เปิดใบนับด้วย id ที่ไม่มีอยู่จริง | Low | Edge Case |
| TC-PCNT-900004 | ลากไฟล์ที่ไม่ใช่สเปรดชีตลงกล่อง Import | Low | Edge Case |

---
## TC-PCNT-010001 — หน้า Physical Count โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG; งวดปัจจุบันมีรอบตรวจนับอยู่ (สถานะ draft หรือ counting ก็ได้)
**Steps**
1. ไปที่ `/inventory-management/physical-count`
**Expected**
URL ยังเป็น `/inventory-management/physical-count`; หัวข้อหน้า "Physical Count" พร้อมคำอธิบาย "Full counts by location — what is on the shelf against what the system says." และ badge จำนวน location; การ์ดเลือกงวด, KPI tiles, ช่องค้นหา และรายการ location แสดงครบภายใน 10 วินาที

---
## TC-PCNT-010002 — การ์ดเลือกงวดแสดงงวดปัจจุบันและเลือกงวดก่อนหน้าได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีรอบตรวจนับอย่างน้อย 2 รอบ (รอบปัจจุบัน + รอบเก่าที่วันเริ่มไม่เกินวันนี้)
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจการ์ดงวดใต้หัวข้อหน้า
3. เปิด lookup "Previous Physical Count Period" แล้วเลือกรอบเก่าหนึ่งรอบ
**Expected**
ก่อนเลือก: การ์ดแสดงชื่องวดรูปแบบ "<Month> <Year>" (เช่น "May 2026"), บรรทัด "Ends: <วันที่สิ้นงวด>" และ badge "Current"; ตัวเลือกใน lookup เป็นช่วงวันที่รูปแบบ "DD MMM YYYY — DD MMM YYYY"; หลังเลือกรอบเก่า badge เปลี่ยนเป็น "Previous" และรายการ location โหลดใหม่เป็นของรอบที่เลือก; ถ้าไม่มีรอบเลย การ์ดแสดง "No active period found"

---
## TC-PCNT-010003 — KPI tiles 4 ใบกรองรายการ location ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; งวดปัจจุบันมี location มากกว่าหนึ่งสถานะ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. อ่านตัวเลขบน tile ทั้ง 4 (All, In Progress, Not Started, Complete)
3. กด tile "In Progress"
**Expected**
ตัวเลขบนแต่ละ tile ตรงกับจำนวน location ในสถานะนั้น และ All = ผลรวมของอีกสามตัว; หลังกด "In Progress" tile ถูกไฮไลต์ด้วยขอบสี primary และหน้าเหลือเฉพาะ section "In Progress"; ถ้า section นั้นไม่มีรายการ ยังคงแสดงหัวข้อ section พร้อมกล่องว่าง "No locations in this status"

---
## TC-PCNT-010004 — ค้นหา location ตามชื่อหรือรหัส
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และมี location หลายรายการ
**Steps**
1. พิมพ์บางส่วนของชื่อหรือรหัส location ลงช่องค้นหา (`input[name="search"]`)
**Expected**
รายการ location ถูกกรองทันทีขณะพิมพ์ (ไม่ต้องกด Enter) โดยเทียบทั้งชื่อและรหัสแบบไม่สนตัวพิมพ์ใหญ่เล็ก; ตัวเลขบน KPI tiles **ไม่เปลี่ยน** เพราะนับจากทั้งงวด ไม่ใช่จากผลค้นหา

---
## TC-PCNT-010005 — ค้นหาแล้วไม่พบ location
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list โดย filter เป็น "All"
**Steps**
1. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
2. กด tile "Not Started"
**Expected**
ขั้นที่ 1 ไม่มี section ใดแสดงเลย และหน้าแสดงสถานะว่างกลาง "No data found"; ขั้นที่ 2 แสดงหัวข้อ section "Not Started" พร้อมกล่องว่าง "No locations in this status"

---
## TC-PCNT-010006 — checkbox Include Not Count ปรับรายการ location ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; งวดปัจจุบันมีทั้ง location ที่ต้องนับและที่ตั้งค่าเป็นไม่ต้องนับ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ติ๊ก checkbox "Include Not Count"
3. เอาติ๊กออก
**Expected**
เมื่อติ๊ก รายการถูกโหลดใหม่และมี location ที่ badge เป็น "Not count" รวมอยู่ด้วย (จำนวนบน KPI tiles เพิ่มตาม); เมื่อเอาติ๊กออก รายการกลับเป็นเฉพาะ location ที่ badge เป็น "Count"

---
## TC-PCNT-010007 — การ์ด location แสดงปุ่มตามสถานะและความคืบหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; งวดปัจจุบันมี location ครบทั้งสามสถานะ (ไม่ครบให้ตรวจเท่าที่มี)
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจการ์ดของแต่ละสถานะ
**Expected**
สถานะ Not started แสดงปุ่ม "Start"; In progress แสดงปุ่ม "Resume"; Completed แสดงเป็น **ข้อความ** "Done" พร้อมไอคอนถูก ไม่ใช่ปุ่มและกดไม่ได้; ทุกการ์ดแสดงแถบ "Progress" พร้อมตัวเลข "counted/total (n%)", badge "Count" หรือ "Not count", ชนิดคลัง และแถวล่าง "N items" (มี "Started <วันที่>" เพิ่มเมื่อใบนับเริ่มหรือปิดแล้ว)

---
## TC-PCNT-010008 — การ์ดสรุปความคืบหน้ารวม (StatusHero)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; ใช้ viewport กว้างระดับ lg ขึ้นไป (การ์ดนี้ซ่อนบนจอเล็ก)
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจการ์ดสรุปคอลัมน์ขวา
**Expected**
การ์ดหัวข้อ "Count progress" แสดง "<จำนวนที่เสร็จ> / <ทั้งหมด>", เปอร์เซ็นต์ = เสร็จ/ทั้งหมด, แถบ progress และช่องสามช่องเรียงลำดับ In Progress · Not Started · Complete โดย Not Started = ทั้งหมด − เสร็จ − กำลังนับ; ทุกตัวเลขตรงกับ KPI tiles ฝั่งซ้าย

---
## TC-PCNT-010009 — กดชื่อ/รหัส location บนการ์ดไปหน้า Location
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; หน้า list มี location อย่างน้อย 1 รายการ
**Steps**
1. กดที่ชื่อ location บนการ์ด (หรือรหัสที่อยู่ถัดไป)
**Expected**
ไปยัง `/config/location/<location id>` ไม่ใช่หน้า entry ของใบนับ

---
## TC-PCNT-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; ระบบตั้ง active BU = BLAVG แล้ว
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. ตรวจตัวบ่งชี้ business unit ที่ active บนแถบนำทาง
**Expected**
active business unit คือ BLAVG; รอบตรวจนับและรายการ location ที่แสดงเป็นของ BU BLAVG เท่านั้น (ทุก request ของหน้านี้ยิงด้วย bu code เดียวกัน)

---
## TC-PCNT-030001 — เปิดหน้าสร้างใบนับ (/new) สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; เข้าหน้านี้ด้วยการพิมพ์ URL เท่านั้น — ไม่มีปุ่มใดใน UI พาไปหน้านี้
**Steps**
1. ไปที่ `/inventory-management/physical-count/new`
**Expected**
หัวข้อหน้า "Add Physical Count"; การ์ดฟอร์มมีสองช่องเป็น lookup คือ "Department" และ "Previous Physical Count Period"; แถบปุ่มมีปุ่มย้อนกลับ, "Cancel" และปุ่ม submit "Create"; ในโหมด add ไม่มีปุ่ม Delete / Activity / Print

---
## TC-PCNT-030003 — ออกจากฟอร์มที่ยังไม่บันทึกต้องถามยืนยัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่ `/inventory-management/physical-count/new`
**Steps**
1. เลือกค่าในช่อง Department (ฟอร์มกลายเป็น dirty)
2. กด "Cancel"
3. ในกล่องยืนยัน กด "Keep editing"
4. กดปุ่มย้อนกลับ แล้วกด "Discard"
**Expected**
ขั้นที่ 2 ขึ้น alert dialog หัวข้อ "Discard changes?" ข้อความ "You have unsaved changes that will be lost." พร้อมปุ่ม "Keep editing" และ "Discard"; "Keep editing" ปิด dialog และยังอยู่ในฟอร์มพร้อมค่าที่เลือกไว้; "Discard" พากลับไป `/inventory-management/physical-count`; การกดเมนู sidebar ขณะฟอร์มยัง dirty ก็ถูกดักด้วย dialog เดียวกัน

---
## TC-PCNT-040001 — เปิดใบนับ /physical-count/:id ในโหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี id ของใบนับที่มีอยู่จริง (คัดลอกจาก URL หลังกด Start ใน TC-PCNT-060001); หน้านี้เข้าได้ด้วยการพิมพ์ URL เท่านั้น
**Steps**
1. ไปที่ `/inventory-management/physical-count/<id>`
**Expected**
หัวข้อหน้าเป็น "Physical Count"; ฟอร์มอยู่ในโหมด view — ช่อง "Department" และ "Previous Physical Count Period" ถูก disable แก้ไขไม่ได้; แถบปุ่มมี "Edit", "Delete", "Activity", "Print" และปุ่มย้อนกลับ

---
## TC-PCNT-040002 — สลับเข้าโหมดแก้ไขและยกเลิกกลับโหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิด `/inventory-management/physical-count/<id>` อยู่ในโหมด view (ต่อจาก TC-PCNT-040001)
**Steps**
1. กดปุ่ม "Edit"
2. กดปุ่ม "Cancel" โดยยังไม่แก้ค่าใด
**Expected**
ขั้นที่ 1 หัวข้อเปลี่ยนเป็น "Edit Physical Count", ช่องกรอกใช้งานได้ และแถบปุ่มเปลี่ยนเป็น "Cancel" + "Save" (ปุ่ม Delete / Activity ยังอยู่); ขั้นที่ 2 กลับสู่โหมด view ทันทีโดยไม่มี dialog ถามยืนยัน (เพราะฟอร์มยังไม่ dirty)

---
## TC-PCNT-050001 — ลบใบนับจากหน้า detail
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีใบนับที่สร้างไว้สำหรับทิ้งโดยเฉพาะและทราบ id (อย่าใช้ใบที่เคสอื่นกำลังใช้)
**Steps**
1. ไปที่ `/inventory-management/physical-count/<id>`
2. กดปุ่ม "Delete"
3. กดยืนยันใน dialog
**Expected**
ขั้นที่ 2 ขึ้น alert dialog หัวข้อ "Delete Physical Count" ข้อความ "Are you sure you want to delete this physical count? This action cannot be undone."; เมื่อยืนยันสำเร็จขึ้น toast "Physical Count deleted successfully" และกลับไปที่ `/inventory-management/physical-count`

---
## TC-PCNT-060001 — กด Start เปิดใบนับและเข้าหน้า entry
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; **รอบตรวจนับของงวดอยู่สถานะ counting** (เปิดจากปุ่ม "Start Period Close" ที่ `/inventory-management/period-end`); มี location สถานะ Not started ที่ยังไม่มีใบนับ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กดปุ่ม "Start" บนการ์ด location
**Expected**
ปุ่มแสดง spinner ระหว่างสร้างใบนับ แล้วเปลี่ยนหน้าไป `/inventory-management/physical-count/<id>/entry`; หัวหน้า entry แสดงชื่อคลัง, รหัสคลัง, badge สถานะ, ตัวนับ "0 / <จำนวนสินค้า>", "0% Complete", "Last saved: --:--" และแถบ progress; ด้านล่างมีรายการสินค้าที่ต้องนับ พร้อมช่องค้นหาและ filter pills

---
## TC-PCNT-060002 — กรอก Actual Count แล้ว Save for Resume
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่ยังมีรายการที่ยังไม่นับ (ปุ่ม "Save for Resume" แสดงเฉพาะตอนยังมีรายการค้าง)
**Steps**
1. กรอกจำนวนในช่อง Actual Count ของรายการแรก แล้วกด Enter หรือคลิกออกจากช่อง
2. กดปุ่ม "Save for Resume"
**Expected**
รายการที่กรอกขึ้น badge "Counted"; ตัวนับบนหัวหน้าจอและตัวเลขบน pill "Counted" เพิ่มขึ้น ส่วน "Uncounted" ลดลง; หลังกดบันทึกขึ้น toast "Save for Resume" และบรรทัด "Last saved:" เปลี่ยนจาก `--:--` เป็นเวลาปัจจุบัน

---
## TC-PCNT-060003 — filter pills All / Counted / Uncounted ในหน้า entry
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่มีทั้งรายการที่นับแล้วและยังไม่นับ
**Steps**
1. กด pill "Uncounted"
2. กด pill "Counted"
3. กด pill "All"
**Expected**
pill แต่ละตัวมีตัวเลขกำกับ และ All = Counted + Uncounted เสมอ; "Uncounted" แสดงเฉพาะรายการที่ช่อง Actual Count ยังว่าง; "Counted" แสดงเฉพาะรายการที่มีค่าแล้ว; "All" กลับมาแสดงครบ และ pill ที่เลือกอยู่มีขอบสีต่างจากตัวอื่น

---
## TC-PCNT-060004 — เพิ่ม note และรูป evidence ให้รายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; มีไฟล์รูป .png หรือ .jpg ขนาดไม่เกิน 3 MB
**Steps**
1. กดลิงก์ "Add notes & evidence" ใต้รายการหนึ่ง
2. พิมพ์ข้อความในช่อง Notes
3. แนบไฟล์รูปในกล่อง Evidence
4. กดปุ่ม "Save Note"
**Expected**
dialog แสดงชื่อสินค้าเป็นหัวข้อ, ช่อง "Notes", กล่อง "Evidence" พร้อมคำอธิบาย "Max 3 MB per image · JPG, PNG, WebP"; รูปที่แนบขึ้น thumbnail พร้อมชื่อและขนาดไฟล์; หลังกดบันทึกขึ้น toast "Save Note", dialog ปิด และใต้รายการนั้นแสดงกล่อง preview ของข้อความ + thumbnail พร้อมปุ่มแก้ไข

---
## TC-PCNT-060005 — เครื่องคิดเลขแปลงหน่วยเพื่อหายอดนับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; สินค้าที่ใช้ทดสอบมีหน่วยนับมากกว่าหนึ่งหน่วย
**Steps**
1. กดปุ่มไอคอนเครื่องคิดเลขท้ายช่อง Actual Count (aria-label "Calculator")
2. กรอกจำนวนและเลือกหน่วยในแถวแรก
3. กด "Add Another Unit" แล้วกรอกแถวที่สอง
4. กด "Use This Total"
**Expected**
dialog แสดงแถว จำนวน + หน่วย พร้อมปุ่มเพิ่ม/ลดจำนวน และบรรทัด "Total" ที่อัปเดตเป็นผลรวมซึ่งแปลงเป็นหน่วยฐานแล้วทุกครั้งที่แก้ค่า; หลังกด "Use This Total" dialog ปิดและค่า Total ถูกเติมลงช่อง Actual Count ของรายการนั้น ทำให้รายการขึ้น badge "Counted"

---
## TC-PCNT-060006 — Set empty to zero กับรายการที่ยังไม่นับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่ยังมีรายการยังไม่นับมากกว่า 0
**Steps**
1. กดปุ่ม "Set empty to zero (N items)"
**Expected**
ทุกรายการที่ยังไม่มีค่าถูกตั้งเป็น 0 และได้ badge "Counted"; pill "Uncounted" เหลือ 0 และ "Counted" เท่ากับจำนวนรายการทั้งหมด; แถบปุ่มด้านล่างเปลี่ยนจาก "Set empty to zero" + "Save for Resume" เป็นปุ่ม "Submit for Review" เพียงปุ่มเดียว

---
## TC-PCNT-060007 — Resume การนับที่ค้างไว้
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี location สถานะ In progress ที่เคยบันทึกค้างไว้ (เช่นต่อจาก TC-PCNT-060002)
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กดปุ่ม "Resume" บนการ์ด location นั้น
**Expected**
เปิด `/inventory-management/physical-count/<id>/entry` ของใบเดิมโดยไม่สร้างใบใหม่; ช่อง Actual Count แสดงค่าที่เคยบันทึกไว้ และตัวนับ counted/total ตรงกับตัวเลขบนการ์ดในหน้า list

---
## TC-PCNT-060008 — ค้นหาสินค้าในหน้า entry
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่มีสินค้าหลายรายการ
**Steps**
1. พิมพ์ชื่อ/รหัส/SKU บางส่วนของสินค้าลงช่องค้นหา
2. พิมพ์คำที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
รายการถูกกรองตามชื่อสินค้า รหัส SKU หรือชื่อท้องถิ่น หลังหน่วงประมาณ 200 มิลลิวินาที; เมื่อไม่มีรายการตรงแสดงกล่อง "No items match your search"; ตัวเลขบน filter pills ยังเป็นของทั้งใบ ไม่เปลี่ยนตามคำค้น

---
## TC-PCNT-060009 — ปุ่ม Refresh products ในหน้า entry
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ของใบนับที่ยังไม่ถูกส่งตรวจ
**Steps**
1. กดปุ่มไอคอนรีเฟรชข้างช่องค้นหา (aria-label "Refresh products")
**Expected**
ไอคอนหมุนและปุ่มถูก disable ระหว่างทำงาน; เมื่อสำเร็จขึ้น toast "Products refreshed" และรายการสินค้าถูกดึงใหม่ (จำนวนรายการอาจเปลี่ยนถ้ามีสินค้าเพิ่ม/ถูกถอดออกจากคลัง)

---
## TC-PCNT-060010 — กด Start ขณะรอบตรวจนับยังไม่เปิด
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; งวดปัจจุบันมีรอบตรวจนับสถานะ draft (ยังไม่ได้กดเริ่มนับที่หน้า Period End); location ที่ใช้ทดสอบยังไม่มีใบนับ
**Steps**
1. ไปที่ `/inventory-management/physical-count`
2. กดปุ่ม "Start" บนการ์ด location
**Expected**
ไม่มีการสร้างใบนับและไม่เปลี่ยนหน้า; ขึ้น dialog หัวข้อ "Counting has not started" พร้อมคำอธิบายให้ไปเปิดรอบที่ Period End และปุ่มสองปุ่มคือ "Close" กับ "Go to Period End" (ลิงก์ไป `/inventory-management/period-end`)

---
## TC-PCNT-070001 — Submit for Review เมื่อนับครบทุกรายการ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่นับครบแล้ว (pill "Uncounted" = 0 เช่นต่อจาก TC-PCNT-060006)
**Steps**
1. กดปุ่ม "Submit for Review"
**Expected**
ปุ่มนี้แสดงแทนปุ่ม Save เมื่อไม่มีรายการค้าง; ระหว่างส่งป้ายเปลี่ยนเป็น "Submitting..." และปุ่มถูก disable; สำเร็จแล้วขึ้น toast "Submitted for review" และเปลี่ยนหน้าไป `/inventory-management/physical-count/<id>/review` โดยไม่มี dialog ยืนยันคั่น

---
## TC-PCNT-070002 — หน้า review แสดง stat tiles 4 ใบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิดหน้า `/inventory-management/physical-count/<id>/review` ของใบที่ส่งตรวจแล้ว
**Steps**
1. ตรวจ stat tiles แถวบน
**Expected**
แสดง 4 tiles คือ "Matches" (Items with no variance), "Variances" (Items requiring attention), "Overages" (Items over system count), "Shortages" (Items under system count); Variances = Overages + Shortages; Matches นับเฉพาะรายการที่นับแล้วและผลต่างเป็น 0 — รายการที่ยังไม่ได้นับไม่ถูกนับรวมใน tile ใดเลย

---
## TC-PCNT-070003 — ตาราง Variance Details แสดงผลต่างถูกต้อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า review ของใบที่มีอย่างน้อยหนึ่งรายการผลต่างไม่เป็นศูนย์
**Steps**
1. เลื่อนลงไปที่ส่วน "Variance Details"
2. ตรวจคอลัมน์ในตาราง
**Expected**
หัวข้อ "Variance Details" พร้อมตัวเลขเท่ากับ tile "Variances"; ตารางมีคอลัมน์ Product / System / Actual / Variance / Unit และแสดง **เฉพาะ** รายการที่ผลต่างไม่เป็นศูนย์; ค่าบวกแสดงเครื่องหมาย + เป็นสีเขียว ค่าลบเป็นสีแดง; ถ้าไม่มีผลต่างเลย แสดงกล่อง "No variances — all counts match the system" แทนตาราง

---
## TC-PCNT-070004 — ยืนยันส่งผลนับ (Submit) เปลี่ยนสถานะใบนับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า review และตรวจผลต่างแล้ว; ทราบว่าการส่งนี้ปิดใบนับของคลังนั้นในงวดปัจจุบันและย้อนกลับไม่ได้
**Steps**
1. กดปุ่ม "Submit" ที่แถบล่างขวา
**Expected**
ระหว่างส่งป้ายปุ่มเปลี่ยนเป็น "Submitting..." และปุ่มถูก disable; สำเร็จแล้วขึ้น toast "Physical count submitted" และกลับไปที่ `/inventory-management/physical-count`; การ์ดของคลังนั้นย้ายไป section "Complete" และแสดงข้อความ "Done"

---
## TC-PCNT-070005 — หัวหน้า review และปุ่มย้อนกลับ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เข้าหน้า review ต่อจากการกด "Submit for Review" ในหน้า entry
**Steps**
1. ตรวจหัวหน้า review
2. กดปุ่มย้อนกลับซ้ายหัวข้อ
**Expected**
หัวข้อ "Physical Count Review" พร้อมบรรทัดรอง "<รหัสคลัง> · <ชื่อคลัง>"; กดปุ่มย้อนกลับแล้วกลับไปหน้าก่อนหน้าใน history (หน้า entry ของใบเดิม)

---
## TC-PCNT-080001 — Import ผลนับจากไฟล์ .xlsx/.csv
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; เตรียมไฟล์ที่มีครบทั้ง 7 คอลัมน์ `id, product_code, product_name, product_local_name, product_sku, inventory_unit_name, actual_qty` และมีอย่างน้อยหนึ่งแถวที่ `id` หรือ `product_sku` ตรงกับรายการในใบ (วิธีที่ง่ายที่สุดคือกด Export ก่อนแล้วแก้ไฟล์ที่ได้)
**Steps**
1. กดปุ่ม "Import"
2. เลือกไฟล์ที่เตรียมไว้
3. ตรวจตัวเลข preview
4. กด "Apply Import"
**Expected**
dialog "Import Counts" แสดงชื่อไฟล์กับขนาด และ preview สามช่อง "Total rows" / "Matched" / "Skipped"; หลังกด Apply dialog ปิด ค่า actual_qty ถูกเติมให้รายการที่จับคู่ได้ (รายการเหล่านั้นขึ้น badge "Counted") และขึ้น toast "Imported {matched} of {total} rows" — ถ้ามีแถวจับคู่ไม่ได้จะเป็นข้อความที่มี "({skipped} skipped — id/SKU not found)" แทน; ค่าที่นำเข้ายังอยู่แค่บนหน้าจนกว่าจะกด "Save for Resume" หรือ "Submit for Review"

---
## TC-PCNT-080002 — Export รายการเป็นไฟล์ Excel
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่มีรายการสินค้าอย่างน้อย 1 รายการ
**Steps**
1. กดปุ่ม "Export"
**Expected**
ดาวน์โหลดไฟล์ชื่อ `physical-count-<รหัสคลัง>-<YYYY-MM-DD>.xlsx` (อักขระที่ไม่ใช่ตัวอักษร ตัวเลข หรือขีด ในรหัสคลังถูกแทนด้วย `_`) มี 7 คอลัมน์ตามลำดับ `id, product_code, product_name, product_local_name, product_sku, inventory_unit_name, actual_qty` และค่าที่กรอกอยู่บนหน้าจอขณะนั้น (ช่องที่ยังไม่นับเป็นค่าว่าง); ขึ้น toast "Exported N items"; ถ้าใบไม่มีรายการเลย ปุ่ม Export ถูก disable

---
## TC-PCNT-100001 — ผู้ใช้ที่ไม่มีสิทธิ์ดู Physical Count ถูกกันที่เมนูโมดูล
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยผู้ใช้ที่ไม่มี permission `inventory_management.physical_count.view` และไม่ใช่ admin; active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management`
2. กดการ์ด "Physical Count"
**Expected**
การ์ด Physical Count แสดงแบบจาง มี `aria-disabled` และไม่ใช่ลิงก์; กดแล้วขึ้น alert dialog "Permission Denied" พร้อมข้อความให้ติดต่อผู้ดูแลระบบ โดยไม่เปลี่ยนหน้า; รายการในเมนู sidebar ของโมดูลนี้ทำงานแบบเดียวกัน

---
## TC-PCNT-100002 — ผู้ที่ไม่ได้เข้าสู่ระบบเปิด URL ตรง ๆ ถูกส่งไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี token ใน session)
**Steps**
1. เปิด `/inventory-management/physical-count` โดยตรง
2. ทำซ้ำกับ `/inventory-management/physical-count/new` และ `/inventory-management/physical-count/<id>/entry`
**Expected**
ทุกเส้นทางถูก redirect ไป `/login` ทันที (แทนที่ประวัติ ไม่ใช่ push) และไม่มีเนื้อหาของหน้า Physical Count แสดงออกมาเลย

---
## TC-PCNT-200001 — บันทึกฟอร์มโดยไม่เลือก Department ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่ `/inventory-management/physical-count/new`
**Steps**
1. ปล่อยช่อง Department ว่างไว้
2. กดปุ่ม "Create"
**Expected**
ไม่มี request ถูกส่งออกไป; ใต้ช่อง Department แสดงข้อความ "Department is required" และหน้าจอเลื่อนไปยังช่องที่ไม่ผ่านการตรวจช่องแรก; ยังอยู่ที่หน้า `/new`

---
## TC-PCNT-200002 — Actual Count ไม่รับค่าติดลบ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry ที่มีรายการยังไม่นับ
**Steps**
1. พิมพ์ `-5` ลงช่อง Actual Count ของรายการหนึ่ง
2. คลิกออกจากช่อง (blur) หรือกด Enter
**Expected**
ช่องเป็น input ชนิดตัวเลขที่กำหนด `min = 0`; หลัง blur ค่าที่ยึดไว้ถูกปรับเป็น **0** ไม่ใช่ `-5` และรายการนั้นถือว่า Counted; ค่าที่ส่งตอนบันทึกต้องไม่ติดลบ

---
## TC-PCNT-200003 — ไฟล์ evidence ที่ใหญ่เกินหรือไม่ใช่รูปถูกปฏิเสธ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; เตรียมไฟล์รูปขนาดเกิน 3 MB และไฟล์ที่ไม่ใช่รูป (เช่น .pdf)
**Steps**
1. กดลิงก์ "Add notes & evidence" ที่รายการหนึ่ง
2. แนบไฟล์รูปขนาดเกิน 3 MB
3. แนบไฟล์ที่ไม่ใช่รูป
**Expected**
ขั้นที่ 2 ขึ้น toast เตือน `"<ชื่อไฟล์>" exceeds 3 MB limit` และไม่มี thumbnail เพิ่มในรายการ; ขั้นที่ 3 ขึ้น toast เตือน `"<ชื่อไฟล์>" is not an image` และไม่มี thumbnail เพิ่มเช่นกัน; ตัวนับจำนวนรูปยังเท่าเดิม

---
## TC-PCNT-900001 — Import ไฟล์ที่คอลัมน์ไม่ครบ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; เตรียมไฟล์ .xlsx/.csv ที่ขาดคอลัมน์ เช่น ไม่มี `actual_qty`
**Steps**
1. กดปุ่ม "Import"
2. เลือกไฟล์ที่ขาดคอลัมน์
**Expected**
ใน dialog แสดงกล่องเตือน "Missing required columns: actual_qty" พร้อมรายชื่อคอลัมน์ที่ต้องมีครบทั้ง 7 คอลัมน์; ไม่มีตัวเลข preview; ปุ่ม "Apply Import" ยังกดไม่ได้ และค่าบนหน้า entry ไม่เปลี่ยน

---
## TC-PCNT-900002 — Import ไฟล์ที่ไม่มีแถวใดจับคู่ได้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; เตรียมไฟล์ที่คอลัมน์ครบทั้ง 7 แต่ค่า `id` และ `product_sku` ทุกแถวไม่ตรงกับรายการในใบนับ
**Steps**
1. กดปุ่ม "Import"
2. เลือกไฟล์ดังกล่าว
**Expected**
preview แสดง "Matched" = 0 และ "Skipped" = จำนวนแถวทั้งหมด; ปุ่ม "Apply Import" ยังกดไม่ได้; ค่าบนหน้า entry ไม่เปลี่ยน

---
## TC-PCNT-900003 — เปิดใบนับด้วย id ที่ไม่มีอยู่จริง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG
**Steps**
1. เปิด `/inventory-management/physical-count/<uuid ที่ไม่มีอยู่จริง>`
**Expected**
หน้าไม่ค้างอยู่ที่ skeleton และไม่แสดงฟอร์มเปล่า; แสดงแผงข้อผิดพลาด (`role="alert"`) พร้อมข้อความอธิบายและปุ่มทางออกอย่างน้อยหนึ่งปุ่มให้กดต่อได้ (ลองใหม่ / กลับหน้า list / ไป dashboard)

---
## TC-PCNT-900004 — ลากไฟล์ที่ไม่ใช่สเปรดชีตลงกล่อง Import
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ในหน้า entry; เตรียมไฟล์ที่ไม่ใช่สเปรดชีต เช่น .txt สั้น ๆ
**Steps**
1. กดปุ่ม "Import" เพื่อเปิด dialog
2. ลาก (drop) ไฟล์นั้นลงกล่องรับไฟล์
**Expected**
ไม่มีการนำเข้าข้อมูล — dialog แจ้งเตือนอย่างใดอย่างหนึ่ง (toast "Invalid file format" / "File is empty" หรือกล่อง "Missing required columns: ...") ปุ่ม "Apply Import" ยังกดไม่ได้ และค่าบนหน้า entry ไม่เปลี่ยน
