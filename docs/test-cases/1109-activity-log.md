# Activity Log — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/activity-log`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Activity Log (หัวหน้าจอ/เมนูขึ้นว่า "Activity Monitor")
**Frontend route:** `routes/system-admin/activity-log`  •  **URL:** `/system-admin/activity-log`
**Prefix:** `ALOG`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 28

_หน้าอ่านอย่างเดียว (audit trail) ของทุกการเปลี่ยนแปลงในระบบ — ตาราง/การ์ด, ค้นหา, ตัวกรอง 3 แกน (action / record type / user), detail sheet พร้อม old/new data, export xlsx, สิทธิ์เข้าถึง_

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **ชื่อบนจอไม่ตรงกับชื่อโมดูล** — `systemAdmin.activityLog.title` = **"Activity Monitor"** (ทั้ง `<h1>` และเมนู `modules.activityLog`) ส่วนคำว่า "Activity Log" เหลืออยู่แค่คีย์ `entity` เคสทั้งหมดจึงยืนยันข้อความ "Activity Monitor"
> 2. **อย่าสับสนกับ `/system-admin/user-activity`** (แคตตาล็อกของตัวเองที่ `1106-user-activity.md`, prefix `UACT`) — คนละ component คนละ route ต่างกันตรง: user-activity **ปัก `entity_type=auth`** ตายตัว (เห็นเฉพาะ login/logout), มีตัวกรอง 2 ตัว (Action มีแค่ Login/Logout, User) และส่ง `action=` ต่อเมื่อเลือกค่าเดียว, ตารางไม่มีคอลัมน์ Record Type / Record ID แต่มีคอลัมน์ User Agent, และ detail sheet **ไม่มีส่วน Data Changes** ส่วน activity-log ตัวนี้เห็นทุก entity_type และมี Data Changes ทั้งสองหน้าใช้ `licenseFeature: "system_admin.activity_log"` **ร่วมกัน** จึงเปิด/ปิดตาม license พร้อมกัน — ห้ามใช้ผลของหน้าหนึ่งแทนอีกหน้า
> 3. **เป็นหน้าอ่านอย่างเดียวจริง ๆ** — ไม่มีปุ่มสร้าง/แก้/ลบ, `useConfigTable` ถูกเรียกด้วย `hideStatus: true` และไม่ส่ง `onDelete` จึงไม่มีคอลัมน์ Status และไม่มีเมนู row actions; detail sheet ไม่มีฟอร์มให้แก้ ไม่มีเคสใดในไฟล์นี้เขียนข้อมูล
> 4. **เคสที่ต้องมี "กิจกรรมเกิดขึ้นก่อน"** (ต้องมีแถวใน BU นั้นจริง เช่น เพิ่งสร้าง/แก้เอกสารสักใบ หรืออย่างน้อยมี login ค้างอยู่): 010002, 010004, 010008, 010012, 020001–020005, 040001–040005, 300001–300002
>    **เคสที่รันได้กับ BU ที่ยังไม่มีข้อมูลเลย:** 010001, 010005, 010006, 010007, 010009, 010010, 010011, 040006, 100001, 100002, 100003, 300003
> 5. **ชิป (badge) ของ action ถูกถอดออกไปแล้ว** (คอมมิต `72d6cd34` "ทิ้งชิปในตาราง activity log…" และ `86446384`) ตอนนี้คอลัมน์ Action เป็น `ActivityActionLabel` = **ไอคอน + ข้อความ action ดิบ (lowercase) ไม่มีกรอบ** — เคสเดิม TC-ALOG-010002/010004 ที่เขียนว่า "badge" กับ "badge Title Case" **ยืนยันสิ่งที่ตรงข้ามกับโค้ดปัจจุบัน** แก้ทั้งสองเคสแล้ว (คง ID เดิม) เช่นเดียวกับ Record Type ที่ตอนนี้เป็นข้อความธรรมดา (Title Case จาก `formatEntityType`) ไม่ใช่ badge
> 6. **ไม่ยืนยันลำดับแถว** — หน้านี้ส่ง `defaultSort: "-created_at"` ซึ่ง **ไม่ใช่รูป `field:dir`** ที่หน้าอื่นทั้งแอปใช้ (`useDataGridState` แยกด้วย `":"`) ผลคือไม่มีคอลัมน์ไหนถูก mark ว่ากำลังเรียงอยู่ และฝั่ง frontend พิสูจน์ลำดับจริงไม่ได้ **TC-ALOG-010003 เดิม ("รายการเรียงตามเวลาล่าสุดก่อน") จึงถูกลบ** และเรื่องการเรียงย้ายไปอยู่ที่ 010009 ซึ่งยืนยันเฉพาะพฤติกรรมของเมนู Sort by + ค่า `sort` บน URL (ID 010003 ถูกปลดระวาง ห้ามนำกลับมาใช้ซ้ำ)
> 7. **หัวคอลัมน์บนจอกับในไฟล์ export คนละชุดคีย์** — จอใช้ `systemAdmin.activityLog.*` → "Date / Time", "Record Type", "Record ID" ส่วนไฟล์ xlsx ใช้ `field.*` → "Date", "Document Type", "Document ID" เคส 300001 จึงยืนยันชื่อหัวตามไฟล์ ไม่ใช่ตามจอ
> 8. **Export ได้เฉพาะหน้าปัจจุบัน** — `handleExport` ส่ง `params: queryParams` ชุดเดียวกับตาราง ซึ่งมี `page`/`perpage` ติดไปด้วย (ค่าเริ่มต้น perpage = 10) toast "Exported {count} records" จึงเท่ากับจำนวนแถวในหน้านั้น ไม่ใช่ยอดรวมทั้ง BU — บันทึกไว้เป็นข้อเท็จจริง ไม่ได้เขียนเคสยืนยันว่าผิด
> 9. **ห้ามกดปุ่ม Print ในเทสอัตโนมัติ** — `onClick={() => globalThis.print()}` เปิด dialog ของเบราว์เซอร์ที่ทำให้ runner ค้าง 010010 จึงยืนยันแค่ว่าปุ่มปรากฏและ enabled
> 10. **แคตตาล็อกนี้เขียนบนสมมุติฐาน desktop viewport** — บนมือถือ ปุ่ม Export/Print ถูกซ่อน (`hidden sm:inline-flex`) แล้วย้ายเข้าเมนู "More actions", ฝั่งขวาของ toolbar (Sort / Toggle columns / สลับ list-grid) ไม่ render เลย และ `useInfiniteScroll = isMobile || displayMode === "grid"` บังคับโหมดการ์ด + infinite scroll เสมอ
> 11. **เมนู Filter บน desktop ไม่มีหัวข้อ section** (จงใจ — สไตล์ Linear มีแต่เส้นคั่น) หัวข้อ "Document" / "People" จะเห็นเฉพาะใน bottom sheet ของมือถือ
> 12. **ค่าบนชิปของ filter เป็นค่าดิบ** — ทั้ง 3 field ประกาศเป็น `control: "custom"` จึงไม่มี `options` ให้ `chipValueText` แปลงเป็น label ผลคือชิปโชว์ค่าจาก URL (ขีดล่างกลายเป็นช่องว่าง เช่น `purchase request`) ส่วน User ที่เป็น UUID โชว์เป็น **จำนวนที่เลือก** ไม่ใช่ชื่อคน
> 13. **100003 (license) ต้องใช้ BU ที่ไม่ได้ซื้อ feature** — `RouteGuard` เช็ค license ก่อน permission และ **ไม่มี admin bypass** ถ้า BLAVG มีสิทธิ์อยู่แล้วเคสนี้ต้องหา BU อื่นหรือข้ามไป (เขียนไว้ใน Preconditions)
> 14. **Section blocks ไม่เปลี่ยน** — ยังใช้ 01, 02, 04, 10, 30 ตามที่ลงทะเบียนไว้ใน `docs/test-id-scheme.md` จึง **ไม่ต้องลงทะเบียน section เพิ่ม** หมายเหตุ: บล็อก 04 ในไฟล์นี้ถูกใช้เป็นบล็อก "ตัวกรอง" มาแต่เดิม (ไม่ใช่ Edit ตามเทมเพลต) คงไว้เพื่อไม่ให้ ID เดิมเลื่อน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ALOG-010001 | หน้า Activity Monitor โหลดสำเร็จ | High | Smoke |
| TC-ALOG-010002 | คอลัมน์ของตารางแสดงครบตามที่ประกาศไว้ | Medium | Functional |
| TC-ALOG-010004 | คอลัมน์ Action แสดงไอคอน + ชื่อ action (ไม่ใช่ชิป) | Medium | Functional |
| TC-ALOG-010005 | ค้นหาด้วยการกด Enter แล้วเขียน `search` ลง URL | Medium | Functional |
| TC-ALOG-010006 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-ALOG-010007 | สลับมุมมอง List / Grid ได้ | Low | Functional |
| TC-ALOG-010008 | ซ่อน/แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-ALOG-010009 | เมนู Sort by เริ่มที่ Default และเลือกคอลัมน์แล้วเขียน `sort` ลง URL | Medium | Functional |
| TC-ALOG-010010 | ปุ่ม Export และ Print แสดงบนหัวหน้าจอ (desktop) | Low | Functional |
| TC-ALOG-010011 | เมนู Filter แสดง field ครบ 3 ตัวพร้อมเมนูย่อยและปุ่มท้ายเมนู | Medium | Functional |
| TC-ALOG-010012 | แถบแบ่งหน้าแสดงจำนวนและเปลี่ยนหน้าได้ | Medium | Functional |
| TC-ALOG-020001 | คลิกแถวเปิด detail sheet | High | Smoke |
| TC-ALOG-020002 | detail sheet แสดงส่วน General Information ครบ | Medium | Functional |
| TC-ALOG-020003 | detail sheet แสดงส่วน Data Changes (Before / After) | High | Functional |
| TC-ALOG-020004 | detail sheet แสดงส่วน Details เมื่อมี meta_data | Low | Functional |
| TC-ALOG-020005 | ปิด detail sheet ได้ และ URL ไม่เปลี่ยนตลอดการเปิด-ปิด | Medium | Functional |
| TC-ALOG-040001 | กรองตาม Action ใช้งานได้ | High | Functional |
| TC-ALOG-040002 | กรองตาม Record Type ใช้งานได้ | High | Functional |
| TC-ALOG-040003 | กรองตาม User ใช้งานได้ | High | Functional |
| TC-ALOG-040004 | ใช้ทั้ง 3 ตัวกรองพร้อมกันแล้วกด Clear ล้างได้หมด | Medium | Functional |
| TC-ALOG-040005 | ชิปในแถบ Filters แก้ค่าได้ในตัวและลบทีละตัวได้ | Medium | Functional |
| TC-ALOG-040006 | เลือกครบทุกตัวเลือกหรือกด All แล้วตัวกรองถูกล้าง | Medium | Edge Case |
| TC-ALOG-100001 | ผู้ใช้ที่ไม่มีสิทธิ์ต้องเจอกล่อง Permission Denied | High | Authorization |
| TC-ALOG-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป `/login` | High | Auth-guard |
| TC-ALOG-100003 | BU ที่ไม่มี license ของ feature ต้องเจอกล่อง Feature Not Licensed | Medium | Authorization |
| TC-ALOG-300001 | Export ข้อมูลเป็นไฟล์ xlsx สำเร็จ | Medium | Functional |
| TC-ALOG-300002 | Export ตามเงื่อนไขตัวกรอง/คำค้นที่เปิดอยู่ | Medium | Functional |
| TC-ALOG-300003 | Export เมื่อไม่มีข้อมูลต้องขึ้น toast เตือน | Low | Negative |

---
## TC-ALOG-010001 — หน้า Activity Monitor โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (`admin@blueledgers.com`) และเลือก BU `BLAVG` อยู่ — หน้านี้ไม่ยิง API จนกว่า `buCode` จะพร้อม (`enabled: !!buCode`)
**Steps**
1. ไปที่ `/system-admin/activity-log`
**Expected**
URL คงอยู่ที่ `/system-admin/activity-log`; หัวหน้าจอ (`DocumentListHeader`) แสดง `<h1>` ข้อความ "Activity Monitor" พร้อมคำอธิบาย "The trail of who changed what, across every document."; เมื่อมีข้อมูล จะมี badge ตัวเลขจำนวนรายการต่อท้ายหัวข้อ; แถบเครื่องมือ (ช่องค้นหา / ปุ่ม View / ปุ่ม Filter) และตาราง DataGrid แสดงภายใน 10 วินาที; ไม่มีปุ่มสร้าง/เพิ่มรายการใด ๆ บนหน้า

---
## TC-ALOG-010002 — คอลัมน์ของตารางแสดงครบตามที่ประกาศไว้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) และ BU นั้นมีบันทึกกิจกรรมอย่างน้อย 1 รายการ (ถ้ายังไม่มี ให้สร้าง/แก้เอกสารสักใบก่อน)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ตรวจหัวคอลัมน์ของตารางบนมุมมอง List (desktop)
3. ตรวจเซลล์ของแถวแรก
**Expected**
หัวตารางเรียงเป็น: ช่องติ๊กเลือก (aria-label "Select all") → "#" → "Date / Time" → "Action" → "User" → "Record Type" → "Description" → "Record ID" → "IP Address"; **ไม่มี**คอลัมน์ Status และไม่มีคอลัมน์เมนู row actions; เซลล์ Date / Time แสดงวันที่บรรทัดบนและเวลารูป `HH:mm:ss` บรรทัดล่าง; เซลล์ User แสดงชื่อ-นามสกุล และแสดง username บรรทัดที่สองเมื่อค่าต่างกัน; เซลล์ Record Type เป็นข้อความ Title Case (เช่น `purchase_request` → "Purchase Request"); เซลล์ Record ID แสดง 8 ตัวแรกตามด้วย `…`; ค่าที่ว่างแสดงเป็น `—`

---
## TC-ALOG-010004 — คอลัมน์ Action แสดงไอคอน + ชื่อ action (ไม่ใช่ชิป)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); มีบันทึกกิจกรรมอย่างน้อย 1 รายการ (ยิ่งมีหลายชนิด action ยิ่งดี)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ดูคอลัมน์ Action ของแถวต่าง ๆ
**Expected**
แต่ละแถวแสดงเป็น `<span data-slot="action">` ที่มีไอคอนนำหน้าและตามด้วย **ข้อความ action ดิบตามที่ API ส่งมา (ตัวพิมพ์เล็ก เช่น `create`, `update`, `login`)** — ไม่ใช่ชิป/กรอบสีทึบ; ไอคอนต่างกันตามชนิด action ตามทะเบียนใน `ActivityActionLabel` (create = เครื่องหมายบวก, update = ปากกา, delete = ถังขยะ, login = ลูกศรเข้า, logout = ลูกศรออก, approve = เครื่องหมายถูก, reject = กากบาท ฯลฯ); action ที่ไม่อยู่ในทะเบียน (เช่น `other`) ใช้ไอคอนขีด `—` สี muted; ค่า action ว่างแสดงเป็น `—`

---
## TC-ALOG-010005 — ค้นหาด้วยการกด Enter แล้วเขียน `search` ลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); อยู่ที่หน้า `/system-admin/activity-log`
**Steps**
1. พิมพ์คำค้นลงช่องค้นหา (placeholder "Search...")
2. กด Enter
3. กดปุ่ม X (aria-label "Clear search") ท้ายช่องค้นหา
**Expected**
หลังกด Enter URL มี query `search=<คำค้น>` และ `page` ถูกล้าง (กลับหน้า 1) ตารางโหลดผลใหม่ภายใน 10 วินาที; **การค้นหาทำงานจากปุ่ม Enter เท่านั้น** — ปุ่มท้ายช่องจะกลายเป็น X (ล้างคำค้น) ทันทีที่มีตัวอักษรในช่อง ไม่ใช่ปุ่มยิงค้นหา; หลังกด X ช่องค้นหาว่าง `search` หายจาก URL และตารางกลับมาแสดงผลไม่กรอง

---
## TC-ALOG-010006 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); อยู่ที่หน้า `/system-admin/activity-log` (รันได้แม้ BU ยังไม่มีข้อมูลเลย)
**Steps**
1. พิมพ์คำสุ่มที่ไม่มีทางตรงกับข้อมูลใด ๆ ลงช่องค้นหา แล้วกด Enter
**Expected**
ตารางแสดง `EmptyComponent` — ภาพประกอบโฟลเดอร์ว่างพร้อมข้อความ "No data found" ภายใน 10 วินาที; แถบแบ่งหน้าไม่แสดง (`recordCount <= 0` ทำให้ `DataGridPagination` ไม่ render)

---
## TC-ALOG-010007 — สลับมุมมอง List / Grid ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport (ฝั่งขวาของ toolbar ซ่อนบนจอเล็ก)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม aria-label "Grid view"
3. คลิกปุ่ม aria-label "List view" เพื่อกลับ
**Expected**
หลังกด Grid view ตาราง DataGrid หายไป แทนที่ด้วยการ์ด `ActivityLogCard` เรียงเป็น grid (1 คอลัมน์บนจอแคบ ถึง 4 คอลัมน์บนจอกว้าง) แต่ละการ์ดมีเลขลำดับ, ไอคอน+ชื่อ action, วันเวลา, ชื่อผู้ใช้, Record Type, คำอธิบาย และ IP ท้ายการ์ด; โหมด grid โหลดต่อแบบ infinite scroll (ไม่มีแถบแบ่งหน้า มี sentinel + สปินเนอร์เมื่อยังมีข้อมูลเพิ่ม); ปุ่มที่ถูกเลือกอยู่เป็นสถานะ secondary; กด List view แล้วกลับมาเป็นตารางพร้อมแถบแบ่งหน้าเหมือนเดิม

---
## TC-ALOG-010008 — ซ่อน/แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport, มุมมอง List, มีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม aria-label "Toggle columns"
3. ติ๊กออกรายการ "Record ID"
4. ติ๊กกลับเข้าไปใหม่
**Expected**
เมนูเปิดขึ้นพร้อมหัวข้อ "Toggle Columns" และรายการติ๊กได้ 7 รายการ = Date / Time, Action, User, Record Type, Description, Record ID, IP Address (ช่องติ๊กเลือกแถวและคอลัมน์ "#" **ไม่อยู่ในรายการ** เพราะไม่มี accessor และปิด `enableHiding`); หลังติ๊กออก คอลัมน์ Record ID หายจากตารางทันทีโดยเมนูยังเปิดค้างอยู่; ติ๊กกลับแล้วคอลัมน์กลับมา

---
## TC-ALOG-010009 — เมนู Sort by เริ่มที่ Default และเลือกคอลัมน์แล้วเขียน `sort` ลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; เปิดหน้าสด ๆ โดย URL ยังไม่มี query `sort`
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม aria-label "Sort by"
3. คลิกรายการ "Action"
4. คลิกรายการ "Action" ซ้ำอีกครั้ง
5. คลิกรายการ "Default"
**Expected**
เมนูเปิดพร้อมหัวข้อ "Sort by", รายการ "Default" ที่มีไอคอนกำกับอยู่ตอนเริ่ม (เพราะ URL ยังไม่มี `sort`) แล้วตามด้วยคอลัมน์ที่เรียงได้ 7 รายการ (Date / Time, Action, User, Record Type, Description, Record ID, IP Address); คลิก "Action" ครั้งแรก → URL มี `sort=action:asc`, แถวนั้นขึ้นลูกศรชี้ขึ้น, ปุ่ม Sort by เปลี่ยนเป็นสี primary, `page` ถูกรีเซ็ตกลับหน้า 1; คลิกซ้ำ → `sort=action:desc` และลูกศรชี้ลง; คลิก "Default" → `sort` หายจาก URL และปุ่มกลับเป็นสีปกติ
_หมายเหตุ: เคสนี้ไม่ยืนยันลำดับข้อมูลจริง — ดูข้อ 6 ของ callout_

---
## TC-ALOG-010010 — ปุ่ม Export และ Print แสดงบนหัวหน้าจอ (desktop)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ตรวจปุ่มมุมขวาบนของหัวหน้าจอ (ไม่ต้องกด)
**Expected**
มีปุ่ม "Export" และปุ่ม "Print" แบบ outline แสดงอยู่และอยู่ในสถานะกดได้ (enabled); ปุ่มเมนูสามจุด (aria-label "More actions") ที่รวมสองคำสั่งนี้ไว้สำหรับมือถือ **ไม่แสดง** บน desktop
_หมายเหตุ: ห้ามคลิก Print ในเทสอัตโนมัติ — มันเรียก `globalThis.print()` ซึ่งเปิด dialog ของเบราว์เซอร์และทำให้ runner ค้าง_

---
## TC-ALOG-010011 — เมนู Filter แสดง field ครบ 3 ตัวพร้อมเมนูย่อยและปุ่มท้ายเมนู
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; ยังไม่มีตัวกรองใดถูกเลือก
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม "Filter"
3. เลื่อนเมาส์ไปที่แถว "Action"
**Expected**
เปิด popover ที่มีแถว field เรียงตามลำดับ: "Action", "Record Type", (เส้นคั่น), "User" — แต่ละแถวมีไอคอนนำหน้าและ chevron ท้ายแถว **โดยไม่มีหัวข้อ section** (หัวข้อ "Document"/"People" มีเฉพาะ bottom sheet ของมือถือ); ท้ายเมนูมีเส้นคั่นแล้วตามด้วยแถว "Clear" (สถานะ disabled เพราะยังไม่มีตัวกรองใดถูกเลือก) และแถว "Save current filters as view"; เมื่อ hover แถว "Action" เมนูย่อยเด้งออกด้านข้างพร้อมช่องค้นหา "Search action..." รายการ "All" และตัวเลือก action ครบ 25 ค่า (View, Create, Update, Delete, Login, Logout, Approve, Reject, Cancel, Void, Print, Email, Other, Upload, Download, Export, Import, Copy, Move, Rename, Save, Comment, Submit, Review, Email Sent)

---
## TC-ALOG-010012 — แถบแบ่งหน้าแสดงจำนวนและเปลี่ยนหน้าได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport, มุมมอง List; BU มีบันทึกกิจกรรมมากกว่า 10 รายการ (ค่า perpage เริ่มต้นคือ 10)
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. อ่านข้อความสรุปจำนวนที่มุมซ้ายล่างของตาราง
3. คลิกปุ่มเลขหน้า "2"
4. เปลี่ยนค่า "Rows" เป็น 25
**Expected**
แถบแบ่งหน้า (`role="navigation"` aria-label "Pagination") แสดงข้อความ "Showing 1–10 of \<จำนวนรวม\>" และตัวเลือก "Rows" ที่ค่าเริ่มต้น 10; คลิกหน้า 2 แล้ว URL มี `page=2`, ปุ่มหน้า 2 ได้ `aria-current="page"` และข้อความเปลี่ยนเป็น "Showing 11–20 of …"; เปลี่ยน Rows เป็น 25 แล้ว URL มี `perpage=25` และตารางแสดงได้ถึง 25 แถว

---
## TC-ALOG-020001 — คลิกแถวเปิด detail sheet
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกที่เซลล์ใดก็ได้ของแถวแรก (เลี่ยงคอลัมน์ช่องติ๊กเลือก)
**Expected**
เปิด `ActivityLogDetailSheet` เลื่อนออกมาด้านขวา; หัว sheet แสดงไอคอน + ชื่อ action ของแถวนั้น ตามด้วย Record Type แบบ Title Case และบรรทัดคำอธิบายของ log (ถ้าไม่มี description จะ fallback เป็นข้อความ "The trail of who changed what, across every document."); แถวของตารางที่คลิกได้ถูกประกาศเป็น `role="button"` และกด Enter/Space ที่แถวก็เปิด sheet ได้เช่นกัน

---
## TC-ALOG-020002 — detail sheet แสดงส่วน General Information ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); เปิด detail sheet ของบันทึกกิจกรรมหนึ่งรายการอยู่ (ต่อจาก TC-ALOG-020001)
**Steps**
1. อ่านส่วนหัวข้อ "General Information" ใน sheet
**Expected**
ส่วนนี้แสดงแถวข้อมูลพร้อมไอคอนกำกับ: "Date / Time" (วันที่ + เวลารูป `HH:mm:ss`), "User" (ชื่อเต็มบรรทัดบน / username บรรทัดล่าง, ไม่มีทั้งคู่แสดง `—`), "Record Type", "Record ID" (**UUID เต็ม ไม่ตัดสั้นเหมือนในตาราง**), "IP Address"; แถว "User Agent" แสดง**ต่อเมื่อ** log นั้นมีค่า `user_agent`

---
## TC-ALOG-020003 — detail sheet แสดงส่วน Data Changes (Before / After)
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); มีบันทึกกิจกรรม action `update` ที่ backend บันทึก `old_data` และ `new_data` ไว้จริง (เช่น เพิ่งแก้ชื่อแผนกสักรายการแล้วกลับมาดู) — ถ้า payload ของ list ไม่มีสองคีย์นี้ ส่วน Data Changes จะไม่ render เลย
**Steps**
1. ไปที่ `/system-admin/activity-log` แล้วกรอง Action = Update
2. คลิกแถวที่ต้องการเพื่อเปิด sheet
3. เลื่อนลงดูใต้ส่วน General Information
**Expected**
มีหัวข้อ "Data Changes" ตามด้วยบล็อก "Before" และ "After" ซึ่งแต่ละบล็อกเป็น `<pre>` แสดง JSON แบบ pretty-print (เยื้อง 2 ช่อง) เลื่อนดูได้ในกรอบสูงจำกัด; บล็อกใดที่ข้อมูลเป็น null หรือเป็น object ว่างจะไม่ render บล็อกนั้น
_หมายเหตุ: sheet อ่าน `old_data`/`new_data` จาก payload ของ list โดยตรง — ไม่ได้เรียก endpoint `/activity-logs/:id/detail` (hook `useActivityLogDetail` มีอยู่แต่หน้านี้ไม่ได้ใช้) จึงไม่มีการแสดง diff รายฟิลด์_

---
## TC-ALOG-020004 — detail sheet แสดงส่วน Details เมื่อมี meta_data
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); มีบันทึกกิจกรรมที่ backend แนบ `meta_data` มาด้วย (log ของ login/logout มักมี)
**Steps**
1. เปิด detail sheet ของบันทึกกิจกรรมนั้น
2. เลื่อนลงจนสุด sheet
**Expected**
มีหัวข้อ "Details" ท้ายสุดของ sheet แสดง `meta_data` เป็น JSON แบบ pretty-print; บันทึกที่ `meta_data` เป็น null หรือ object ว่าง **จะไม่มีหัวข้อ "Details" เลย** (ไม่ใช่แสดงหัวข้อพร้อมค่าว่าง)

---
## TC-ALOG-020005 — ปิด detail sheet ได้ และ URL ไม่เปลี่ยนตลอดการเปิด-ปิด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`); มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log` แล้วจดค่า URL ปัจจุบัน
2. คลิกแถวเพื่อเปิด detail sheet
3. กดปุ่มปิดของ sheet (หรือกด Escape)
**Expected**
sheet ปิดลงและตารางยังอยู่ที่หน้าเดิมโดยไม่โหลดใหม่; URL **เท่าเดิมทุกขั้นตอน** — หน้านี้ไม่มี route ของ detail (`/system-admin/activity-log/:id` ไม่มีใน `routes/router.tsx`) และไม่มี query string ใดถูกเพิ่ม; ไม่มีปุ่มแก้ไข/บันทึก/ลบ ใน sheet เลย

---
## TC-ALOG-040001 — กรองตาม Action ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; มีบันทึกกิจกรรมหลายชนิด action
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม "Filter" แล้ว hover แถว "Action"
3. ติ๊กเลือก "Update" ในเมนูย่อย
**Expected**
ค่ามีผลทันทีโดยไม่ต้องกดยืนยัน; URL มี `action=update` และ `page` ถูกล้าง; ตารางโหลดใหม่โดยส่ง query param `action=update` ไปยัง backend; ปุ่ม Filter ขึ้น badge เลข 1; แถบ Filters ใต้ toolbar แสดงชิป "Action update" พร้อมปุ่มลบ (aria-label "Remove Action filter")

---
## TC-ALOG-040002 — กรองตาม Record Type ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; มีบันทึกกิจกรรมจาก entity หลายชนิด
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม "Filter" แล้ว hover แถว "Record Type"
3. พิมพ์ในช่องค้นหา "Search record type..." แล้วติ๊กเลือก "Vendor"
**Expected**
เมนูย่อยมีตัวเลือก 13 ค่า (Purchase Request, Purchase Order, Goods Received Note, Credit Note, Store Requisition, Inventory Transaction, Product, Vendor, Location, Department, Currency, Period, Auth) และค้นหากรองรายการได้; หลังเลือก URL มี `entity_type=vendor`, ตารางส่ง query param `entity_type=vendor`, และแถบ Filters แสดงชิป "Record Type vendor"

---
## TC-ALOG-040003 — กรองตาม User ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; BU มีผู้ใช้หลายคนและมีบันทึกกิจกรรมจากผู้ใช้เหล่านั้น
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม "Filter" แล้ว hover แถว "User"
3. ใช้ช่อง "Search user..." หาชื่อผู้ใช้แล้วติ๊กเลือก 1 คน
**Expected**
รายชื่อในเมนูย่อยมาจากผู้ใช้ทั้งหมดของ BU (`useAllUsers`, `perpage=-1`); หลังเลือก URL มี `actor_id=<uuid ของผู้ใช้>` และตารางส่ง query param `actor_id` ไปยัง backend แสดงเฉพาะกิจกรรมของผู้ใช้นั้น; ชิปในแถบ Filters แสดงเป็น "User 1" (**เป็นจำนวนที่เลือก ไม่ใช่ชื่อคน** เพราะค่าเป็น UUID — ดูข้อ 12 ของ callout)

---
## TC-ALOG-040004 — ใช้ทั้ง 3 ตัวกรองพร้อมกันแล้วกด Clear ล้างได้หมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; มีข้อมูลหลากหลาย action / record type / user
**Steps**
1. เลือก Action = Update, Record Type = Vendor และ User หนึ่งคน (ทีละตัวจากเมนู Filter)
2. คลิกลิงก์ "Clear" ท้ายแถบ Filters
**Expected**
ระหว่างขั้นที่ 1 URL สะสมครบทั้ง `action`, `entity_type`, `actor_id` และตารางส่งทั้งสาม param ไปพร้อมกัน; ปุ่ม Filter ขึ้น badge เลข 3 และแถบ Filters แสดงชิป 3 ตัว; หลังกด "Clear" ทั้งสาม param หายจาก URL พร้อมกับ `sv` และ `page`, แถบ Filters หายไปทั้งแถบ, badge บนปุ่ม Filter หายไป และตารางกลับมาแสดงผลไม่กรอง

---
## TC-ALOG-040005 — ชิปในแถบ Filters แก้ค่าได้ในตัวและลบทีละตัวได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; เลือกตัวกรอง Action = Update และ Record Type = Vendor ไว้แล้ว
**Steps**
1. คลิกที่ตัวชิป "Action update" (ไม่ใช่ปุ่ม X)
2. ในกล่องที่เด้งขึ้น ติ๊กเพิ่ม "Create"
3. คลิกปุ่ม X ของชิป "Record Type vendor"
**Expected**
คลิกที่ชิปเปิด popover ที่มีรายการตัวเลือกชุดเดียวกับเมนูย่อยของ Filter แก้ค่าได้ทันที; หลังติ๊กเพิ่ม URL เป็น `action=update,create` (หรือลำดับตามที่ติ๊ก) และข้อความบนชิปอัปเดตตาม; กดปุ่ม X ของชิป Record Type แล้ว `entity_type` หายจาก URL โดยชิป Action ยังอยู่ครบ และ badge บนปุ่ม Filter ลดจาก 2 เหลือ 1

---
## TC-ALOG-040006 — เลือกครบทุกตัวเลือกหรือกด All แล้วตัวกรองถูกล้าง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport (รันได้แม้ BU ยังไม่มีข้อมูล เพราะยืนยันพฤติกรรมของตัวควบคุม)
**Steps**
1. เปิดเมนู Filter → hover "Record Type"
2. ติ๊กเลือกทีละค่าจนครบทั้ง 13 ค่า
3. เลือกใหม่เพียง 1 ค่า แล้วคลิกรายการ "All" ที่หัวรายการ
**Expected**
เมื่อติ๊กครบทุกตัวเลือก `MultiSelectFilter` ถือว่า "ไม่ได้กรองอะไร" จึงส่งค่าว่างกลับ — `entity_type` หายจาก URL, ชิปหายจากแถบ Filters และ badge บนปุ่ม Filter หายไป (ไม่ใช่ค่าที่มี 13 ค่าคั่นด้วยคอมมา); คลิก "All" ก็ล้างค่าเช่นเดียวกันและช่องติ๊กหน้า "All" กลับมาถูกติ๊ก

---
## TC-ALOG-100001 — ผู้ใช้ที่ไม่มีสิทธิ์ต้องเจอกล่อง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ **ไม่ใช่ admin** และ **ไม่มี permission `system_configuration.view`** (leaf `activityLog` ใน `constant/module-list.ts` ผูกกับ permission นี้) โดย BU นั้นมี license ของ feature `system_admin.activity_log` อยู่
**Steps**
1. เปิด URL `/system-admin/activity-log` โดยตรง
**Expected**
`RouteGuard` บล็อกและแสดง `AccessDeniedBlock` (`role="alert"`) ที่มี eyebrow "Restricted", หัวข้อ "Permission Denied", คำอธิบาย "You don't have permission to view this page." พร้อมบรรทัด "Contact your administrator to request access." และปุ่ม "Go to an available page"; ไม่มีตาราง ไม่มีบันทึกกิจกรรมใดถูกแสดง; รายการ "Activity Monitor" ก็ไม่ปรากฏในเมนูของผู้ใช้รายนี้

---
## TC-ALOG-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป `/login`
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว หรือใช้ browser context ใหม่ที่ไม่มี storageState)
**Steps**
1. เปิด URL `/system-admin/activity-log` โดยตรง
**Expected**
`RequireAuth` เด้งไป `/login` แบบ replace พร้อมพก path เดิมไว้ใน location state; หน้า login แสดงขึ้น และไม่มีเนื้อหาของโมดูลรั่วออกมาก่อนเด้ง

---
## TC-ALOG-100003 — BU ที่ไม่มี license ของ feature ต้องเจอกล่อง Feature Not Licensed
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ active BU **ไม่ได้ซื้อ feature `system_admin.activity_log`** (เคสนี้ข้ามได้ถ้าทุก BU ที่ใช้ทดสอบมี feature นี้ครบ) — `RouteGuard` เช็ค license **ก่อน** permission และ **ไม่มี admin bypass** ดังนั้นแม้เป็น Admin ก็ต้องโดนบล็อก
**Steps**
1. เปิด URL `/system-admin/activity-log` โดยตรง
**Expected**
แสดง `AccessDeniedBlock` ที่มีคำอธิบาย "This feature is not included in your organization's subscription. Contact your administrator or sales representative to enable it." **โดยไม่มี**บรรทัด "Contact your administrator to request access." และมีปุ่ม "Go to an available page" พาไปหน้า landing ที่เข้าได้
_หมายเหตุ: `/system-admin/user-activity` ใช้ licenseFeature ตัวเดียวกัน จึงถูกบล็อกพร้อมกัน_

---
## TC-ALOG-300001 — Export ข้อมูลเป็นไฟล์ xlsx สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; มีบันทึกกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. คลิกปุ่ม "Export"
**Expected**
ระหว่างทำงาน ปุ่มเปลี่ยนข้อความเป็น "Exporting..." พร้อมสปินเนอร์และถูก disable; จบแล้วดาวน์โหลดไฟล์ชื่อ `activity-log_YYYY-MM-DD.xlsx` (ชีตชื่อ "Activity Logs") ที่มีหัวคอลัมน์ 7 คอลัมน์ตามลำดับ **Date, Action, Document Type, Document ID, User, IP Address, Description** (ชื่อจาก namespace `field.*` ซึ่งต่างจากหัวคอลัมน์บนจอ — ดูข้อ 7 ของ callout); ขึ้น toast สำเร็จ "Exported \<จำนวน\> records"
_หมายเหตุ: จำนวนที่ export เท่ากับจำนวนแถวของ **หน้าปัจจุบัน** ไม่ใช่ยอดรวมทั้ง BU (ดูข้อ 8 ของ callout)_

---
## TC-ALOG-300002 — Export ตามเงื่อนไขตัวกรอง/คำค้นที่เปิดอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport; มีบันทึกกิจกรรมหลาย action และรู้จำนวนที่ตรงกับตัวกรองที่จะใช้
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. เลือกตัวกรอง Action = Login (หรือ action ที่มีข้อมูลแน่นอน)
3. คลิกปุ่ม "Export"
**Expected**
คำขอ export ยิงไปที่ endpoint เดียวกับตารางด้วย query param ชุดเดียวกัน (`action`, `entity_type`, `actor_id`, `search`, `sort`, `page`, `perpage`); ไฟล์ที่ได้มีเฉพาะแถวที่ตรงกับตัวกรอง และจำนวนใน toast "Exported \<จำนวน\> records" ตรงกับจำนวนแถวที่ตารางแสดงอยู่ในหน้านั้น

---
## TC-ALOG-300003 — Export เมื่อไม่มีข้อมูลต้องขึ้น toast เตือน
**Priority:** Low · **Test Type:** Negative
**Preconditions**
เข้าสู่ระบบเป็น Admin (BU `BLAVG`) บน desktop viewport
**Steps**
1. ไปที่ `/system-admin/activity-log`
2. ค้นหาด้วยคำสุ่มที่ไม่มีทางตรงกับข้อมูลใด ๆ แล้วกด Enter จนตารางว่าง
3. คลิกปุ่ม "Export"
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; ขึ้น toast แบบ warning ข้อความ "No data to export"; ปุ่ม Export กลับมาอยู่ในสถานะปกติ (ไม่ค้างที่ "Exporting...")
