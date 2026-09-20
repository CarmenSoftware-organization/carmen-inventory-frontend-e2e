# Spot Check — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/inventory-management/spot-check`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Spot Check
**Frontend route:** `routes/inventory-management/spot-check`  •  **URL:** `/inventory-management/spot-check` (และ `/inventory-management/spot-check/location/:location_id`, `/inventory-management/spot-check/:id`, `/inventory-management/spot-check/:id/review`)
**Prefix:** `SPC`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 44
**สอบทานกับ source ล่าสุด:** 2026-09-20

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> - **ไม่มีหน้า view / edit / delete ของใบ spot check** — `/inventory-management/spot-check/:id` เรนเดอร์ `ScEntryComponent` (หน้านับ) ตรง ๆ ส่วนเส้น edit ของ `ScForm` ถูกลบทิ้งแล้ว (commit `0647b32e` "ลบเส้น edit ของ ScForm ที่ตายมาตั้งแต่วันแรก") และไม่มีปุ่มลบที่ใดในโมดูล เคสเดิม TC-SPC-040001 / TC-SPC-050001 จึงถูกถอดออก — `useUpdateSpotCheck` / `useDeleteSpotCheck` และข้อความ `deleteTitle` / `deleteConfirm` ยังค้างอยู่ใน source แต่ไม่มี UI เรียกใช้
> - **สร้างได้จาก location card เท่านั้น** — ฟอร์มสร้างอยู่ที่ `/spot-check/location/:location_id` และ **ไม่มีช่อง Location** (`ScForm` ส่ง `hideLocation`) location มาจาก URL ล้วน ๆ; ปุ่ม **Start** ขึ้นเฉพาะ location ที่ `latest_spot_check === null` (section Not Started) ฉะนั้นหนึ่ง location มีใบค้างได้ทีละใบ ต้อง Reset หรือปิดใบเดิมก่อนจึงจะกด Start ได้อีก
> - **เคสตั้งแต่บล็อก 06 เป็นต้นไปต้องมีรอบนับที่เปิดอยู่** — TC-SPC-060001…060012 และ 070001…070004 ต้องมีใบ spot check ที่ยังไม่ปิด (สร้างจากเคสบล็อก 03 ก่อน หรือใช้ location ที่อยู่ section Resume) ส่วนหน้า review ต้องผ่าน **Submit for Review** มาก่อน หรือเปิด `/spot-check/:id/review` ตรง ๆ ของใบที่มี review data แล้ว
> - **กด Submit (ปิดใบ) แล้วย้อนไม่ได้** — ใบกลายเป็น completed และไปอยู่ใน History; ถ้าเปิดใบ completed จาก History card จะเข้า **หน้านับหน้าเดิม** (ไม่มีโหมดอ่านอย่างเดียว) และเพราะนับครบแล้ว ปุ่มล่างจะเป็น "Submit for Review" ซึ่งกดซ้ำได้ — ออกแบบสเปกให้เลี่ยงการกดโดยไม่ตั้งใจ
> - **"Set N empty to 0" ไม่ลดตัวเลข Pending** — `isCountedFn` ถือว่า counted ก็ต่อเมื่อ qty > 0 (เจตนา เพื่อให้แก้ 1 → 0 ลด progress ได้) การกดปุ่มจึงเติม 0 ลงช่องนับของ item ที่ยังว่าง แต่ตัวนับ Counted / Pending และเงื่อนไขปุ่ม Submit for Review ไม่เปลี่ยน — TC-SPC-060004 จึง assert แค่ "ช่องถูกเติมเป็น 0" ไม่ใช่ "Pending = 0"
> - **สร้างเสร็จแล้วหน้า list อาจยังไม่อัปเดตทันที** — `useCreateSpotCheck` invalidate แค่ `QUERY_KEYS.SPOT_CHECKS` ไม่ได้ invalidate `SPOT_CHECK_CURRENT` ที่หน้า list ใช้ (staleTime 1 นาที) ถ้าจะ assert ว่า location ย้ายจาก Not Started ไป Resume ต้อง reload หน้า list ก่อน
> - **Manual ต้องมี product ผูกกับ location** — รายการฝั่ง "Available products" มาจาก `location.product_location` ถ้า location นั้นไม่มีสินค้าผูกไว้ แผงจะว่าง ("No items") และส่งฟอร์มไม่ผ่าน validation
> - **badge สถานะไม่กะพริบแล้ว** — `sc-status-visual.ts` ตั้ง `pulse: false` ทุกสถานะตาม DESIGN.md ("avoid neon") อย่า assert `animate-pulse` บน status dot
> - **Admin ข้าม permission check** — `RouteGuard` ปล่อยผ่านทันทีเมื่อ `isAdmin` เคส TC-SPC-100001 จึงต้องใช้ผู้ใช้ที่ **ไม่ใช่ admin** และไม่มีสิทธิ์ `inventory_management.spot_check.view`
> - **ทุก mutation ส่ง `doc_version`** — save / review / submit ส่ง doc_version ไปด้วย (optimistic concurrency) เปิดใบเดียวกันสองแท็บแล้วบันทึกสลับกัน ใบหลังจะถูก backend ปฏิเสธ
> - **ข้อความ UI ยึดตาม `messages/en.json`** — ปุ่มบันทึกร่างคือ **"Save Draft"** (ไม่ใช่ "Save For Resume"), filter pill ของที่ยังไม่นับคือ **"Pending"** (ไม่ใช่ "Uncounted"), ปุ่มปิดใบในหน้า review คือ **"Submit"**, ปุ่มส่งฟอร์มสร้างคือ **"Create"**
> - **Default role เดิมในแคตตาล็อกคือ "Store Manager"** — เปลี่ยนเป็น Admin ให้ตรงกับมาตรฐาน BU = BLAVG ของ suite นี้; ถ้าอยากรันแบบเจาะ role ยังมีบัญชี `storemanager@blueledgers.com` ใน `tests/test-users.ts` แต่ยังไม่ได้ยืนยันว่า role นั้นมีสิทธิ์ `inventory_management.spot_check.view`

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SPC-010001 | หน้า Spot Check โหลดสำเร็จ | High | Smoke |
| TC-SPC-010002 | สลับ view Locations / History ได้ | Medium | Functional |
| TC-SPC-010003 | KPI tiles (All/Resume/Not Started) แสดงและกรองได้ | High | Functional |
| TC-SPC-010004 | ช่องค้นหา location (name/code) กรองทันทีขณะพิมพ์ | Medium | Functional |
| TC-SPC-010005 | ค้นหา location ที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-SPC-010006 | checkbox Include Not Count ดึงรายการใหม่รวม location ที่ไม่ต้องนับ | Low | Functional |
| TC-SPC-010007 | location card ใน section Resume แสดง resume info panel ครบ | Medium | Functional |
| TC-SPC-010008 | History view ค้นหา/filter (Location/Status/Method) ได้ | Medium | Functional |
| TC-SPC-010009 | location card ที่ยังไม่เริ่มแสดงปุ่ม Start และลิงก์ไปหน้า location | Medium | Functional |
| TC-SPC-010010 | คลิก History card เปิดหน้านับของใบนั้น | Medium | Functional |
| TC-SPC-010050 | active BU = BLAVG | High | Smoke |
| TC-SPC-030001 | เปิดฟอร์มสร้าง spot check จากปุ่ม Start สำเร็จ | High | Smoke |
| TC-SPC-030002 | สร้าง spot check วิธี Random (items) สำเร็จ | High | CRUD |
| TC-SPC-030003 | สร้าง spot check วิธี High Value (items + min value) สำเร็จ | High | CRUD |
| TC-SPC-030004 | สร้าง spot check วิธี Manual (เลือก product) สำเร็จ | High | CRUD |
| TC-SPC-030005 | method picker สลับ Random/High Value/Manual ปรับ field และ tip ตามวิธี | Medium | Functional |
| TC-SPC-030006 | แผง Selected / Available products เลือกและยกเลิกเลือกได้ | Medium | Functional |
| TC-SPC-030007 | ออกจากฟอร์มที่แก้แล้วยังไม่บันทึก ต้องขึ้น Discard dialog | Medium | Alternate Flow |
| TC-SPC-030008 | เปิดฟอร์มด้วย location_id ที่ไม่มีอยู่จริง ต้องแสดง error state พร้อมทางออก | Medium | Edge Case |
| TC-SPC-030050 | สร้าง spot check (admin/BLAVG) สำเร็จ | High | CRUD |
| TC-SPC-060001 | กรอก count ของ item แล้ว Save Draft สำเร็จ | High | Functional |
| TC-SPC-060002 | filter pills (All/Counted/Pending) ในหน้านับใช้งานได้ | Medium | Functional |
| TC-SPC-060003 | เพิ่ม note และรูป evidence ที่ item ได้ | Medium | Functional |
| TC-SPC-060004 | ปุ่ม Set N empty to 0 เติมเลข 0 ให้ item ที่ยังไม่นับ | Medium | Functional |
| TC-SPC-060005 | Resume spot check ที่ค้างไว้กลับมานับต่อได้ | Medium | Alternate Flow |
| TC-SPC-060006 | Reset spot check (confirm dialog) ล้างค่าที่นับ | Medium | Alternate Flow |
| TC-SPC-060007 | calculator แปลงหน่วยแล้วเติมยอดรวมเข้าช่องนับ | Medium | Functional |
| TC-SPC-060008 | header หน้านับแสดง location/สถานะ/วิธี/ความคืบหน้า | Medium | Functional |
| TC-SPC-060009 | ค้นหาสินค้าในหน้านับกรองรายการได้ | Medium | Functional |
| TC-SPC-060010 | Export ยอดนับเป็นไฟล์ Excel | Low | Functional |
| TC-SPC-060011 | เปิด Import dialog และเห็นคอลัมน์ที่ต้องมี | Low | Functional |
| TC-SPC-060012 | ปุ่ม Refresh products ดึงรายการใหม่พร้อม toast | Low | Functional |
| TC-SPC-070001 | Submit for Review เมื่อนับครบนำไปหน้า review | High | Functional |
| TC-SPC-070002 | หน้า review แสดง stat tiles และ variance grid | High | Functional |
| TC-SPC-070003 | Submit ในหน้า review ปิดใบและกลับหน้า list | High | Functional |
| TC-SPC-070004 | ไม่มี variance ต้องแสดงข้อความแทนตาราง | Medium | Edge Case |
| TC-SPC-100001 | ผู้ใช้ไม่มีสิทธิ์เข้าถึง Spot Check ต้องเจอ Permission Denied | High | Authorization |
| TC-SPC-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SPC-100003 | route ย่อยของ spot check ถูก RouteGuard คุ้มครองด้วย | High | Authorization |
| TC-SPC-200001 | สร้างโดยไม่กรอก items (Random) ต้องแสดง error | High | Validation |
| TC-SPC-200002 | Manual โดยไม่เลือก product ต้องแสดง error | High | Validation |
| TC-SPC-200003 | High Value min value ติดลบต้องแสดง error | Medium | Validation |
| TC-SPC-200004 | High Value ไม่กรอก items ต้องแสดง error | Medium | Validation |
| TC-SPC-200005 | กด Create ทั้งที่ฟอร์มไม่ผ่าน ต้องไม่เรียก API และเลื่อนไปช่องที่ผิด | Medium | Negative |

---
## TC-SPC-010001 — หน้า Spot Check โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG; มีสิทธิ์ `inventory_management.spot_check.view`
**Steps**
1. ไปที่ `/inventory-management/spot-check`
**Expected**
URL คงเป็น `/inventory-management/spot-check`; หัวข้อ "Spot Check" พร้อมคำอธิบาย "Quick counts on a handful of items, without closing the whole store."; ปุ่มสลับ view "Locations" / "History"; KPI tiles 3 ใบ (All / Resume / Not Started) และรายการ location แสดงภายใน 10 วินาที (ระหว่างโหลดเป็น location skeleton)

---
## TC-SPC-010002 — สลับ view Locations / History ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่หน้า `/inventory-management/spot-check`
**Steps**
1. กดปุ่ม "History"
2. กดปุ่ม "Locations" กลับ
**Expected**
ตอนอยู่ view History: KPI tiles 3 ใบและ checkbox "Include Not Count" หายไป แทนที่ด้วย filter 3 ตัว (Location / Status / Method) และรายการเป็น history card; กด "Locations" กลับมาแล้ว KPI tiles + checkbox + รายการ location กลับมาเหมือนเดิม

---
## TC-SPC-010003 — KPI tiles (All/Resume/Not Started) แสดงและกรองได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่ view Locations และมี location อย่างน้อย 1 รายการ
**Steps**
1. อ่านตัวเลขบน tile "All", "Resume", "Not Started"
2. กด tile "Resume"
3. กด tile "All" กลับ
**Expected**
tile "All" = จำนวน location ทั้งหมด และเท่ากับ Resume + Not Started; หลังกด "Resume" tile นั้นมีขอบเน้น (active) และรายการเหลือเฉพาะ section "Resume" — ถ้า section นั้นว่างจะแสดงกล่อง "No locations in this status"; กด "All" กลับแล้วเห็น section ที่มีข้อมูลทั้งหมดอีกครั้ง

---
## TC-SPC-010004 — ช่องค้นหา location (name/code) กรองทันทีขณะพิมพ์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่ view Locations และมี location หลายรายการ
**Steps**
1. จดชื่อและรหัสของ location รายการแรก
2. พิมพ์บางส่วนของชื่อนั้นลงช่องค้นหา (ไม่ต้องกด Enter)
3. ล้างช่องค้นหาแล้วพิมพ์รหัส location แทน
**Expected**
รายการถูกกรองทันทีตั้งแต่ตอนพิมพ์ (ไม่ต้องกด Enter); ทั้งการค้นด้วยชื่อและด้วยรหัสให้ location เป้าหมายติดอยู่ในผลลัพธ์ และจำนวนบน section header ลดลงตามที่กรอง

---
## TC-SPC-010005 — ค้นหา location ที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่ view Locations โดย filter เป็น "All"
**Steps**
1. พิมพ์คำค้นที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
ไม่มี section ของ location เหลืออยู่ และแสดง empty state กลางหน้า ข้อความ "No data found"

---
## TC-SPC-010006 — checkbox Include Not Count ดึงรายการใหม่รวม location ที่ไม่ต้องนับ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; BU มี location ทั้งแบบ countable และ not countable
**Steps**
1. จดตัวเลขบน tile "All"
2. ติ๊ก checkbox "Include Not Count"
**Expected**
แอปยิง `GET .../spot-checks/current?include_not_count=true` ใหม่; ตัวเลขบน tile "All" เพิ่มขึ้น (หรือเท่าเดิมถ้า BU ไม่มี location ประเภทนั้น) และมี location card ที่แสดงไอคอนสถานะ "Not countable" ปรากฏในรายการ

---
## TC-SPC-010007 — location card ใน section Resume แสดง resume info panel ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location อย่างน้อย 1 แห่งที่มี spot check ค้างอยู่ (อยู่ใน section "Resume")
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ตรวจ location card ใบแรกใน section "Resume"
**Expected**
card แสดงเลขที่ใบ spot check, badge สถานะพร้อมจุดสี (จุดนิ่ง ไม่กะพริบ), badge วิธีนับพร้อมไอคอน, "Start Date" กับวันที่, และความคืบหน้ารูปแบบ "X / Y items"; ที่มุมขวาบนมีปุ่มไอคอน Reset (aria-label "Reset") และปุ่ม "Resume"

---
## TC-SPC-010008 — History view ค้นหา/filter (Location/Status/Method) ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีใบ spot check ที่เคยสร้างไว้แล้วอย่างน้อย 1 ใบ
**Steps**
1. ไปที่ `/inventory-management/spot-check` แล้วกด "History"
2. เปิด filter "Status" แล้วเลือกสถานะหนึ่ง
3. ล้าง filter แล้วพิมพ์เลขที่ใบ (หรือชื่อ/รหัส location) ลงช่องค้นหา
**Expected**
รายการถูกกรองตามสถานะที่เลือก และตามคำค้น (จับคู่กับเลขที่ใบ ชื่อ location หรือรหัส location); filter Location / Method ทำงานแบบเดียวกัน; ถ้าเงื่อนไขไม่ตรงกับใบใดเลย section แสดงข้อความ "No spot check history yet"

---
## TC-SPC-010009 — location card ที่ยังไม่เริ่มแสดงปุ่ม Start และลิงก์ไปหน้า location
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location อย่างน้อย 1 แห่งใน section "Not Started"
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ตรวจ location card ใบแรกใน section "Not Started"
3. คลิกที่รหัส location บน card
**Expected**
card แสดงชื่อ location, รหัส, ไอคอนสถานะ "Countable" หรือ "Not countable", ประเภท location และปุ่ม "Start" (ไม่มี resume info panel และไม่มีปุ่ม Reset); คลิกรหัสแล้วเปิดหน้า `/config/location/{location_id}`

---
## TC-SPC-010010 — คลิก History card เปิดหน้านับของใบนั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีใบ spot check อย่างน้อย 1 ใบใน History
**Steps**
1. ไปที่ `/inventory-management/spot-check` แล้วกด "History"
2. จดเลขที่ใบบน card ใบแรก แล้วคลิก card นั้น
**Expected**
URL เปลี่ยนเป็น `/inventory-management/spot-check/{id}` และเปิดหน้านับ (eyebrow "Counting") ของ location เดียวกับที่อยู่บน card — โมดูลนี้ไม่มีหน้าอ่านอย่างเดียวแยกต่างหาก

---
## TC-SPC-010050 — active BU = BLAVG
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; ระบบตั้ง active BU = BLAVG
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. ตรวจตัวบ่งชี้ business unit ที่ active และ URL ของ request ที่ยิงออกไป
**Expected**
Active business unit คือ BLAVG; request ของหน้านี้เป็น `/api/proxy/api/BLAVG/spot-checks/current` และ `/api/proxy/api/BLAVG/spot-checks` — ข้อมูลที่แสดงเป็นของ BU BLAVG เท่านั้น

---
## TC-SPC-030001 — เปิดฟอร์มสร้าง spot check จากปุ่ม Start สำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location อย่างน้อย 1 แห่งใน section "Not Started"
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. จดชื่อ location ของ card ใบแรกใน section "Not Started" แล้วกดปุ่ม "Start" บน card นั้น
**Expected**
URL เป็น `/inventory-management/spot-check/location/{location_id}`; หัวข้อหน้าเป็นชื่อ location ที่เลือก; หน้าแสดง method picker 3 ใบ (Random / High Value / Manual) โดย Random ถูกเลือกไว้ก่อน, ช่อง "Items", ช่อง "Description" และปุ่ม "Create" กับ "Cancel"; **ไม่มีช่องให้เลือก Location** (location ล็อกมาจาก URL)

---
## TC-SPC-030002 — สร้าง spot check วิธี Random (items) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` ของ location ที่ยังไม่มีใบค้าง
**Steps**
1. เลือก method card "Random"
2. กรอกช่อง "Items" ด้วยจำนวนที่ >= 1 (เช่น 3)
3. กดปุ่ม "Create"
**Expected**
แสดง toast "Spot Check created successfully"; URL เปลี่ยนเป็น `/inventory-management/spot-check/{new_id}` ซึ่งเป็นหน้านับ; header หน้านับแสดง location เดิม, วิธี "Random" และความคืบหน้า "0 / N"

---
## TC-SPC-030003 — สร้าง spot check วิธี High Value (items + min value) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` ของ location ที่ยังไม่มีใบค้าง
**Steps**
1. เลือก method card "High Value"
2. กรอก "Items" >= 1 และ "Min Value" >= 0
3. กดปุ่ม "Create"
**Expected**
แสดง toast "Spot Check created successfully"; redirect ไปหน้านับ `/inventory-management/spot-check/{new_id}` โดย header ระบุวิธี "High Value"

---
## TC-SPC-030004 — สร้าง spot check วิธี Manual (เลือก product) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` ของ location ที่ **มีสินค้าผูกไว้** และยังไม่มีใบค้าง
**Steps**
1. เลือก method card "Manual"
2. ในแผง "Available products" ติ๊ก checkbox ของสินค้าอย่างน้อย 1 รายการ
3. กดปุ่ม "Create"
**Expected**
แสดง toast "Spot Check created successfully"; redirect ไปหน้านับ `/inventory-management/spot-check/{new_id}` โดยรายการที่ต้องนับตรงกับสินค้าที่ติ๊กไว้ และ header ระบุวิธี "Manual"

---
## TC-SPC-030005 — method picker สลับ Random/High Value/Manual ปรับ field และ tip ตามวิธี
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}`
**Steps**
1. กดเลือก method card "Random" แล้วตรวจฟิลด์ที่แสดง
2. กดเลือก "High Value" แล้วตรวจฟิลด์ที่แสดง
3. กดเลือก "Manual" แล้วตรวจฟิลด์ที่แสดง
**Expected**
Random → เห็นเฉพาะช่อง "Items"; High Value → เห็นทั้ง "Items" และ "Min Value"; Manual → ทั้งสองช่องหายไป แทนที่ด้วยแผงเลือกสินค้า; card ที่เลือกอยู่มีเครื่องหมายถูกมุมขวาบนและ `aria-pressed="true"`; การ์ด "Spot check tip" ด้านข้าง (จอกว้าง) เปลี่ยนข้อความตามวิธีที่เลือก

---
## TC-SPC-030006 — แผง Selected / Available products เลือกและยกเลิกเลือกได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` ของ location ที่มีสินค้าหลายรายการ และเลือก method "Manual" แล้ว
**Steps**
1. ติ๊ก checkbox ของสินค้า 2 รายการในแผงขวา "Available products"
2. ติ๊ก checkbox ของสินค้า 1 รายการในแผงซ้าย "Selected products" เพื่อเอาออก
3. พิมพ์คำค้นที่ไม่มีอยู่จริงในช่องค้นหาของแผง "Available products"
**Expected**
สินค้าที่ติ๊กปรากฏในแผงซ้าย "Selected products" และตัวเลขบน badge ของแผงซ้ายเท่ากับจำนวนที่เลือก ส่วน badge ของแผงขวาเป็นรูปแบบ "เลือกแล้ว/ทั้งหมด"; ยกเลิกติ๊กในแผงซ้ายแล้วรายการนั้นหายจากแผงซ้ายและ checkbox ในแผงขวาถูกยกเลิกตาม; ค้นหาไม่พบ แผงแสดง "No matches found"; checkbox ที่หัวแผงเลือก/ยกเลิกทุกรายการที่มองเห็นได้

---
## TC-SPC-030007 — ออกจากฟอร์มที่แก้แล้วยังไม่บันทึก ต้องขึ้น Discard dialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}`
**Steps**
1. กรอกช่อง "Items" หรือ "Description" ให้ฟอร์มมีการเปลี่ยนแปลง
2. กดปุ่ม "Cancel"
3. ในกล่องที่ขึ้นมา กด "Keep editing"
4. กดปุ่ม "Cancel" อีกครั้ง แล้วกด "Discard"
**Expected**
ขั้นที่ 2 ขึ้นกล่องยืนยันหัวข้อ "Discard changes?" ข้อความ "You have unsaved changes that will be lost." พร้อมปุ่ม "Keep editing" และ "Discard"; กด "Keep editing" แล้วยังอยู่ในฟอร์มพร้อมค่าที่กรอกไว้; กด "Discard" แล้วกลับไปที่ `/inventory-management/spot-check`

---
## TC-SPC-030008 — เปิดฟอร์มด้วย location_id ที่ไม่มีอยู่จริง ต้องแสดง error state พร้อมทางออก
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG
**Steps**
1. เปิด URL `/inventory-management/spot-check/location/00000000-0000-0000-0000-000000000000` ตรง ๆ
**Expected**
แสดงกล่อง error (role="alert") หัวข้อ "Something went wrong" พร้อมข้อความ "Spot check not found"; มีปุ่ม "Back to list" ที่พากลับไป `/inventory-management/spot-check` และปุ่ม "Go to dashboard"; ไม่มีฟอร์มสร้างแสดงขึ้นมา

---
## TC-SPC-030050 — สร้าง spot check (admin/BLAVG) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG; มี location ใน section "Not Started"
**Steps**
1. ไปที่ `/inventory-management/spot-check` แล้วกด "Start" บน location card
2. เลือก method "Random" และกรอก "Items" = 2
3. กด "Create"
**Expected**
request สร้างยิงไปที่ `/api/proxy/api/BLAVG/spot-checks`; toast "Spot Check created successfully"; redirect ไปหน้านับของใบใหม่ใต้ BU BLAVG

---
## TC-SPC-060001 — กรอก count ของ item แล้ว Save Draft สำเร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับ `/inventory-management/spot-check/{id}` ที่มี item อย่างน้อย 2 รายการและยังนับไม่ครบ
**Steps**
1. กรอกจำนวนที่มากกว่า 0 ลงช่อง "Actual Count" ของ item รายการแรก
2. กดปุ่ม "Save Draft"
**Expected**
item ที่กรอกขึ้น badge "Counted" และตัวเลข "X / Y" กับ "{percent}% complete" ที่ header อัปเดตทันที; หลังกด Save Draft แสดง toast "Counts saved" และกลับไปหน้า `/inventory-management/spot-check`

---
## TC-SPC-060002 — filter pills (All/Counted/Pending) ในหน้านับใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มีทั้ง item ที่นับแล้ว (qty > 0) และที่ยังไม่นับ
**Steps**
1. กด pill "Counted"
2. กด pill "Pending"
3. กด pill "All"
**Expected**
pill ทั้งสามแสดงตัวเลขกำกับ และ All = Counted + Pending; กด "Counted" เหลือเฉพาะ item ที่มี badge "Counted"; กด "Pending" เหลือเฉพาะ item ที่ยังไม่มี badge; กด "All" กลับมาเห็นครบ; จำนวนรายการที่แสดงตรงกับตัวเลขบน pill ที่เลือก

---
## TC-SPC-060003 — เพิ่ม note และรูป evidence ที่ item ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มี item อย่างน้อย 1 รายการ
**Steps**
1. กดลิงก์ "Add notes" ใต้ item รายการแรก
2. พิมพ์ข้อความลงช่อง "Notes"
3. แนบไฟล์รูป (JPG/PNG/WebP ขนาดไม่เกิน 3 MB) ในส่วน "Evidence"
4. กดปุ่ม "Save Note"
**Expected**
dialog เปิดโดยมีชื่อสินค้าเป็นหัวข้อ; หลังบันทึกแสดง toast "Save Note" และ dialog ปิด; ใต้ item ปรากฏกล่องสรุปที่มีข้อความ note, รูปย่อ และป้ายจำนวนรูป พร้อมปุ่มดินสอไว้แก้ไขซ้ำ

---
## TC-SPC-060004 — ปุ่ม Set N empty to 0 เติมเลข 0 ให้ item ที่ยังไม่นับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่ยังมี item ที่ยังไม่นับ (pill "Pending" > 0)
**Steps**
1. จดตัวเลขบน pill "Pending"
2. กดปุ่ม "Set {N} empty to 0" ที่แถบล่าง (N ตรงกับตัวเลขบน pill "Pending")
**Expected**
ช่อง "Actual Count" ของ item ที่เคยว่างถูกเติมเป็น `0` ทุกรายการ; ปุ่มแถบล่างยังคงเป็น "Set {N} empty to 0" คู่กับ "Save Draft" (ดูหมายเหตุผู้รีวิว — ระบบถือว่า counted เมื่อ qty > 0 เท่านั้น ตัวเลข Counted/Pending จึงไม่เปลี่ยน)

---
## TC-SPC-060005 — Resume spot check ที่ค้างไว้กลับมานับต่อได้
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location ใน section "Resume" ที่เคยบันทึกยอดนับไว้บางรายการแล้ว
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. จดค่าความคืบหน้า "X / Y items" บน card
3. กดปุ่ม "Resume" บน location card นั้น
**Expected**
เปิดหน้านับ `/inventory-management/spot-check/{id}`; ค่าที่เคยนับไว้ยังอยู่ในช่อง "Actual Count" และตัวเลข "X / Y" ที่ header ตรงกับที่จดไว้จาก card — นับต่อและกด "Save Draft" ได้

---
## TC-SPC-060006 — Reset spot check (confirm dialog) ล้างค่าที่นับ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี location ใน section "Resume" ที่นับไปแล้วบางรายการ
**Steps**
1. ไปที่ `/inventory-management/spot-check`
2. กดปุ่มไอคอน Reset (aria-label "Reset") บน location card ใน section "Resume"
3. กดปุ่ม "Reset" ในกล่องยืนยัน
**Expected**
กล่องยืนยันหัวข้อ "Reset Spot Check" ข้อความ "Reset will clear counted quantities and reopen this spot check. Continue?" พร้อมปุ่ม "Cancel" / "Reset"; หลังยืนยันแสดง toast "Spot check reset successfully" และความคืบหน้าบน card กลับเป็น "0 / Y items"

---
## TC-SPC-060007 — calculator แปลงหน่วยแล้วเติมยอดรวมเข้าช่องนับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มี item อย่างน้อย 1 รายการซึ่งสินค้ามีหน่วยให้เลือกมากกว่าหนึ่ง
**Steps**
1. กดปุ่มไอคอนเครื่องคิดเลข (aria-label "Calculator") ท้ายช่อง "Actual Count" ของ item รายการแรก
2. กรอกจำนวนในแถวแรก แล้วกด "Add Another Unit" และกรอกอีกแถวด้วยหน่วยอื่น
3. กดปุ่ม "Use This Total"
**Expected**
dialog เปิดโดยมีชื่อสินค้าเป็นหัวข้อ; แต่ละแถวที่ไม่ใช่หน่วยฐานแสดงบรรทัดแปลงค่า "= {value} {unit}"; บรรทัด "Total" แสดงผลรวมเป็นหน่วยฐาน; กด "Use This Total" แล้ว dialog ปิดและยอดนั้นถูกเติมลงช่อง "Actual Count" ของ item

---
## TC-SPC-060008 — header หน้านับแสดง location/สถานะ/วิธี/ความคืบหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับ `/inventory-management/spot-check/{id}`
**Steps**
1. ตรวจส่วนหัวของหน้า
2. กดปุ่มย้อนกลับ (aria-label "Go back") ที่มุมซ้ายบน
**Expected**
header แสดง eyebrow "Counting", ชื่อ location เป็นหัวข้อ, รหัส location, badge สถานะพร้อมจุดสี (ไม่กะพริบ), ตัวเลข "X / Y", ข้อความ "{percent}% complete", แถบ progress และแถวข้อมูล location / วิธีนับ / วันที่เริ่ม; กดปุ่มย้อนกลับแล้วกลับไปที่ `/inventory-management/spot-check`

---
## TC-SPC-060009 — ค้นหาสินค้าในหน้านับกรองรายการได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มี item หลายรายการ
**Steps**
1. จดชื่อสินค้าของ item รายการแรก
2. พิมพ์บางส่วนของชื่อนั้นลงช่องค้นหาด้านบนของรายการ
3. ล้างคำค้นแล้วพิมพ์คำที่ไม่มีอยู่จริง เช่น `zzzzz999`
**Expected**
หลังพิมพ์ราวครึ่งวินาที (มี debounce) รายการเหลือเฉพาะ item ที่ตรงกับคำค้น (จับคู่กับชื่อสินค้า รหัส SKU หรือชื่อท้องถิ่น); เมื่อค้นด้วยคำที่ไม่มี แสดงกล่อง "No items match your search" โดยตัวเลขบน pill และที่ header ไม่เปลี่ยน

---
## TC-SPC-060010 — Export ยอดนับเป็นไฟล์ Excel
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มี item อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่ม "Export"
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ `.xlsx` ชื่อขึ้นต้นด้วย `spot-check-` ตามด้วยรหัส location และวันที่; แสดง toast "Exported {count} items" โดย count เท่ากับจำนวน item ทั้งหมดในใบ

---
## TC-SPC-060011 — เปิด Import dialog และเห็นคอลัมน์ที่ต้องมี
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่มี item อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่ม "Import"
**Expected**
เปิด dialog หัวข้อ "Import Counts" พร้อมคำอธิบาย "Drop an Excel or CSV file with the count results.", โซนวางไฟล์ที่บอก ".xlsx · .xls · .csv", ปุ่ม "Choose file" และส่วน "Required columns" ที่ระบุคอลัมน์ `id`, `product_code`, `product_name`, `product_local_name`, `product_sku`, `inventory_unit_name`, `actual_qty`; ปิด dialog แล้วยอดนับในหน้าไม่เปลี่ยน

---
## TC-SPC-060012 — ปุ่ม Refresh products ดึงรายการใหม่พร้อม toast
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับ `/inventory-management/spot-check/{id}`
**Steps**
1. กดปุ่มไอคอนรีเฟรช (aria-label "Refresh products") ข้างช่องค้นหา
**Expected**
ปุ่มหมุนระหว่างโหลดและกดซ้ำไม่ได้; แอปยิง request ดึงใบ spot check ใหม่; เมื่อเสร็จแสดง toast "Products refreshed" และรายการ item ยังแสดงครบ

---
## TC-SPC-070001 — Submit for Review เมื่อนับครบนำไปหน้า review
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในหน้านับที่กรอกจำนวน > 0 ให้ครบทุก item แล้ว (pill "Pending" = 0)
**Steps**
1. ตรวจว่าปุ่มที่แถบล่างเปลี่ยนเป็น "Submit for Review"
2. กดปุ่ม "Submit for Review"
**Expected**
เมื่อ Pending = 0 ปุ่ม "Save Draft" กับ "Set N empty to 0" หายไป เหลือปุ่ม "Submit for Review" (มี tooltip "Submit all counts for review"); หลังกดแสดง toast "Submitted for review" และ redirect ไป `/inventory-management/spot-check/{id}/review`

---
## TC-SPC-070002 — หน้า review แสดง stat tiles และ variance grid
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่ `/inventory-management/spot-check/{id}/review` ของใบที่มีผลต่างอย่างน้อย 1 รายการ
**Steps**
1. ตรวจหัวข้อและ stat tiles
2. ตรวจตารางใต้หัวข้อ "Variance Details"
**Expected**
หัวข้อ "Spot Check Review" พร้อมรหัส·ชื่อ location; stat tiles 4 ใบ "Matches", "Variances", "Overages", "Shortages" พร้อมคำอธิบายใต้ตัวเลข; ตาราง variance มีคอลัมน์ Product / System / Actual / Variance / Unit; ค่าผลต่างบวกขึ้นต้นด้วย `+` และเป็นสีเขียว ค่าลบเป็นสีแดง; ป้ายจำนวนข้างหัวข้อ "Variance Details" เท่ากับจำนวนแถวในตาราง

---
## TC-SPC-070003 — Submit ในหน้า review ปิดใบและกลับหน้า list
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ที่ `/inventory-management/spot-check/{id}/review` และตรวจผลต่างเรียบร้อยแล้ว (ใบนี้จะถูกปิดถาวร)
**Steps**
1. กดปุ่ม "Submit" ที่แถบล่าง
**Expected**
แสดง toast "Spot check submitted"; กลับไปที่ `/inventory-management/spot-check`; ใบนี้ปรากฏใน view History ด้วย badge สถานะ "Completed" และ location เดิมย้ายออกจาก section "Resume"

---
## TC-SPC-070004 — ไม่มี variance ต้องแสดงข้อความแทนตาราง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีใบ spot check ที่นับตรงกับระบบทุกรายการ แล้วเปิด `/inventory-management/spot-check/{id}/review`
**Steps**
1. ตรวจส่วน "Variance Details"
**Expected**
tile "Variances" เป็น 0; แทนที่ตารางด้วยกล่องข้อความ "No variances — all counts match the system"; ปุ่ม "Submit" ที่แถบล่างยังกดได้ตามปกติ

---
## TC-SPC-100001 — ผู้ใช้ไม่มีสิทธิ์เข้าถึง Spot Check ต้องเจอ Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ **ไม่ใช่ admin** และไม่มีสิทธิ์ `inventory_management.spot_check.view` ใน BU ที่ active
**Steps**
1. เปิด URL `/inventory-management/spot-check` โดยตรง
**Expected**
แสดงกล่อง (role="alert") ป้าย "Restricted" หัวข้อ "Permission Denied" ข้อความ "You don't have permission to view this page." และ "Contact your administrator to request access." พร้อมปุ่ม "Go to an available page"; ไม่มีรายการ location หรือ spot check แสดงออกมา

---
## TC-SPC-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ยังไม่ได้เข้าสู่ระบบ (ไม่มี token ใน session)
**Steps**
1. เปิด URL `/inventory-management/spot-check` โดยตรง
**Expected**
ถูก redirect ไปยัง `/login` ทันที และไม่มีเนื้อหาของโมดูล spot check แสดงขึ้นมาก่อนหน้านั้น

---
## TC-SPC-100003 — route ย่อยของ spot check ถูก RouteGuard คุ้มครองด้วย
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบเป็นผู้ใช้ที่ไม่ใช่ admin และไม่มีสิทธิ์ `inventory_management.spot_check.view`
**Steps**
1. เปิด `/inventory-management/spot-check/location/<uuid ใดก็ได้>` โดยตรง
2. เปิด `/inventory-management/spot-check/<uuid ใดก็ได้>` โดยตรง
3. เปิด `/inventory-management/spot-check/<uuid ใดก็ได้>/review` โดยตรง
**Expected**
ทั้งสาม URL แสดงกล่อง "Permission Denied" แบบเดียวกับ TC-SPC-100001 (RouteGuard จับ leaf ของ spot check จาก prefix ของ path); ไม่มีฟอร์มสร้าง หน้านับ หรือหน้า review แสดงออกมา

---
## TC-SPC-200001 — สร้างโดยไม่กรอก items (Random) ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` และเลือก method "Random"
**Steps**
1. ล้างช่อง "Items" ให้ว่าง (หรือใส่ 0)
2. กดปุ่ม "Create"
**Expected**
ใต้ช่อง "Items" แสดงข้อความ "Items must be at least 1"; ไม่มี request สร้างถูกยิงออกไป และยังอยู่หน้าเดิม

---
## TC-SPC-200002 — Manual โดยไม่เลือก product ต้องแสดง error
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` และเลือก method "Manual"
**Steps**
1. ไม่ติ๊กสินค้าใด ๆ (แผง "Selected products" ว่าง)
2. กดปุ่ม "Create"
**Expected**
ใต้แผงเลือกสินค้าแสดงข้อความ "At least one Product is required"; ไม่มี request สร้างถูกยิงออกไป และยังอยู่หน้าเดิม

---
## TC-SPC-200003 — High Value min value ติดลบต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` และเลือก method "High Value"
**Steps**
1. กรอก "Items" = 1
2. กรอก "Min Value" เป็นค่าติดลบ เช่น -1
3. กดปุ่ม "Create"
**Expected**
ใต้ช่อง "Min Value" แสดงข้อความ "Min Value must be at least 0"; ไม่มี request สร้างถูกยิงออกไป

---
## TC-SPC-200004 — High Value ไม่กรอก items ต้องแสดง error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` และเลือก method "High Value"
**Steps**
1. ล้างช่อง "Items" ให้ว่าง (หรือใส่ 0) แต่กรอก "Min Value" = 100
2. กดปุ่ม "Create"
**Expected**
ใต้ช่อง "Items" แสดงข้อความ "Items must be at least 1" (กติกาเดียวกับ Random) และไม่มีข้อความ error ใต้ "Min Value"; ไม่มี request สร้างถูกยิงออกไป

---
## TC-SPC-200005 — กด Create ทั้งที่ฟอร์มไม่ผ่าน ต้องไม่เรียก API และเลื่อนไปช่องที่ผิด
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
เข้าสู่ระบบเป็น Admin; active BU = BLAVG; อยู่ในฟอร์ม `/spot-check/location/{location_id}` เลือก method "High Value" และเลื่อนหน้าลงจนช่อง "Items" ออกนอกจอ
**Steps**
1. ล้างช่อง "Items" ให้ว่าง
2. กดปุ่ม "Create"
**Expected**
ไม่มี request `POST .../spot-checks` ถูกยิงออกไป; หน้าเลื่อนกลับไปยังช่องแรกที่ไม่ผ่าน validation และช่องนั้นอยู่ในสถานะ invalid พร้อมข้อความ error; URL ยังเป็น `/inventory-management/spot-check/location/{location_id}`
