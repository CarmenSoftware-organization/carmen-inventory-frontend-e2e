# Report — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/report`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Report
**Frontend route:** `routes/report`  •  **URL:** `/report` (และ `/report/list`, `/report/schedules`, `/report/history`)
**Prefix:** `RPT`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 50

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **Default role เปลี่ยนเป็น Admin** — `/report/list`, `/report/schedules`, `/report/history` ผ่าน `RouteGuard` (`components/route-guard.tsx` mount ที่ `routes/root-layout.tsx`) ซึ่งเช็ค **license ก่อน permission**: ทั้งสามหน้าผูกกับ `licenseFeature: "report.list"` + `PERMISSIONS.report_analytics.view` ใน `constant/module-list.ts` · admin **bypass permission ได้แต่ bypass license ไม่ได้** · ส่วน `/report` (index) นั้น `findRouteLeaf("/report")` เจอ node แม่ที่ **ไม่มี** `permission`/`licenseFeature` จึงไม่ถูกบล็อกด้วย RouteGuard เลย
> 2. **หน้า landing `/report` เป็นภาพนิ่งล้วน** — `report-landing.tsx` ไม่ยิง API สักเส้น ตัวเลขทั้งหมดในภาพประกอบ ("Catalog · 124 reports", "This week · 18 active", timeline ของ HistoryVisual, รายการ `PR-AGING`/`INV-LOWPAR`/…) เป็นค่าคงที่ใน source **ห้าม assert ว่าเป็นข้อมูลจริงของ BU**
> 3. **ปุ่มสองปุ่มที่ footer ของ landing ("Browse templates" / "Open the builder") ไม่มี `onClick`** และข้อความ "shortcut · ⌘1/⌘2/⌘3" ใต้ปุ่ม CTA เป็นข้อความตกแต่ง — ทั้งแอปมี keyboard shortcut แค่ ⌘K (command palette) ไม่มี handler ของ ⌘1–⌘3 เคสในเอกสารนี้จึง assert แค่ว่า **ปุ่ม/ข้อความปรากฏตามออกแบบ** ไม่ assert ผลของการกด
> 4. **ตัวกรอง report group ย้ายเข้าไปอยู่ในปุ่ม Filter แล้ว** (คอมมิต `251be8fc` + `01edd84d`) ไม่ใช่ Select ลอยบน toolbar อีกต่อไป — desktop เป็น popover สองชั้น (hover/คลิกแถว field → submenu เด้งฝั่งซ้าย, หน่วงปิด 150ms) มือถือเป็น bottom sheet · field อยู่ใต้หัวข้อ section "Category" (`listView.sectionCategory`) label = "All Types" · เป็น **single-select** และกรอง **ฝั่ง client เฉพาะหน้าปัจจุบัน** เท่านั้น
> 5. **badge จำนวนข้าง "Report" คือ `paginate.total` จาก backend ไม่ใช่จำนวนหลังกรอง** — `DocumentListHeader count={totalRecords}` และ `DocumentListHeader` ซ่อน badge เมื่อ `count === 0` · **ห้ามเขียนเคสที่คาดว่า badge ลดลงเมื่อเลือก group** (เคสเดิม TC-RPT-010004 เคยระบุไว้แบบนั้น — แก้แล้ว)
> 6. **`SearchInput` ยิงค้นเมื่อกด Enter หรือกดปุ่มแว่นเท่านั้น ไม่ debounce** และเมื่อมีข้อความอยู่แล้ว ปุ่มขวาจะกลายเป็นปุ่ม **ล้าง** ไม่ใช่ปุ่มค้น (`components/search-input.tsx`)
> 7. **Run Report เปิดแท็บใหม่ — ต้องดักด้วย `context.waitForEvent("page")` ก่อนกดปุ่ม** เพราะ `report-component.tsx` เรียก `window.open("about:blank", "_blank")` แบบ synchronous ก่อนยิง API แล้วค่อยเซ็ต `location.href` เมื่อได้ URL (กันตัวบล็อก popup) · ถ้ายิงพลาด โค้ดจะ `viewerWindow?.close()` ปิดแท็บนั้นเอง · toast ใช้ **id เดียวกัน** (`toast.loading` → `toast.success({id})`) จึง assert ขั้น loading กับ ready แยกกันได้ยาก ควร assert ปลายทางเป็นหลัก · ปุ่ม "Open" ใน toast จะเปิดแท็บเพิ่มอีกใบ
> 8. **ไม่มีการดาวน์โหลดไฟล์จาก `/report/list`** — ผลลัพธ์เป็น viewer URL ที่เปิดแท็บใหม่ · แต่ที่ `/report/history` ชื่อไฟล์เป็น `<a href={presigned url} target="_blank">` ถ้า presigned URL นั้นมี `content-disposition: attachment` เบราว์เซอร์จะดาวน์โหลดแทนการเปิดหน้า → เคส TC-RPT-020010 ต้องเผื่อทั้งสองทาง (`page.waitForEvent("download")` + `acceptDownloads`) · ทั้งโมดูล **ไม่มี** `window.print()` จึงไม่มีจุดที่ทำให้ headless ค้างจากกล่องพิมพ์
> 9. **URL ที่ backend คืนมาถูกกรองด้วย `safeNavigationHref`** — `javascript:`/`data:` จะตกลง catch (หน้า list ขึ้น toast error) หรือถูกลดรูปเป็นข้อความธรรมดา (หน้า history/การ์ด กดไม่ได้)
> 10. **เคสที่ต้องมีข้อมูลจริง** — repo นี้ไม่มี seed helper ของ report: TC-RPT-0100xx/020xxx ต้องมี report template อย่างน้อย 1 รายการใน BU, TC-RPT-010014..010016 / 020010..020011 ต้องมีประวัติการรัน, TC-RPT-010017 / 020012 / 040003..040004 ต้องมี schedule อยู่ก่อน · เคสที่ผูกกับ `@current_period`/`@previous_period` (TC-RPT-020003, TC-RPT-020007) ต้องมี **งวดบัญชี** ใน BU ไม่งั้น lookup คืนว่างและ date field ตกไปใช้วันที่ 1 ของเดือนปัจจุบันแทน
> 11. **เคส error ฝั่ง backend ต้อง intercept** — TC-RPT-010018 (`loadError` + ปุ่มลองใหม่) และ TC-RPT-030002 (`runError`) บังคับให้ backend พังตรง ๆ ไม่ได้ ต้องใช้ `page.route()` คืน 500 ให้ `**/reports/templates*` และ `**/reports/viewer`
> 12. **`/report/schedules` ไม่มี search / filter / pagination และไม่มีปุ่มแก้ไข** — `schedule-component.tsx` มีแค่ `DocumentListHeader` + ปุ่ม Create Schedule + `DataGrid` (ไม่มี `DataGridPagination`) และปุ่มลบรายแถว · **ห้ามเขียนเคส edit schedule หรือ toggle Active** เพราะยังไม่มีทางทำจาก UI (คอลัมน์ Active เป็น badge อ่านอย่างเดียว)
> 13. **Create Schedule ดึง template จาก `useReportTemplates()` แบบไม่ส่ง params** → ได้เฉพาะ **หน้าแรก** ที่ backend คืนมา template ที่อยู่หน้าถัดไปจะไม่โผล่ใน dropdown · และ `format` ถูก hardcode เป็น `viewer_url` (ฟอร์มไม่มีตัวเลือกรูปแบบไฟล์) คอลัมน์ Format ของแถวที่สร้างจาก UI นี้จึงขึ้น "Viewer Link" เสมอ
> 14. **`notify_at` เป็นเวลาที่ "แจ้งผู้รับ" ไม่ใช่เวลารัน** — ว่างไว้ = แจ้งทันทีที่รันเสร็จ, ใส่เวลาที่เร็วกว่าเวลารัน = ขึ้น badge "+1 day" (backend คำนวณ offset เอง), ห่างจากเวลารันไม่ถึง 10 นาที = ขึ้นข้อความเตือน (เป็นคำเตือนอย่างเดียว **ไม่บล็อกการบันทึก**)
> 15. **section block ของ prefix นี้ลงทะเบียนไว้แค่ `01–04, 10`** — เคสลบ schedule จึงอยู่ใน 04 และเคส validation ของฟอร์มสร้างอยู่ใน 03 โดยตั้งใจ ถ้าจะย้ายไป 05/20 ให้ถูกตาม scheme ต้องแก้แถวของ `RPT` ใน `docs/test-id-scheme.md` ก่อน ไม่งั้น `bun audit:tc-ids` จะ fail ด้วย `UNKNOWN_SECTION`

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-RPT-010001 | หน้า Report landing โหลดและแสดง hero + 3 chapter | High | Smoke |
| TC-RPT-010002 | CTA ของแต่ละ chapter นำไปหน้าย่อยที่ถูกต้อง | Medium | Functional |
| TC-RPT-010003 | หน้า Report list โหลดและแสดงรายการ template | High | Smoke |
| TC-RPT-010004 | badge ข้างหัวข้อ Report แสดงจำนวนรวมจาก backend | Low | Functional |
| TC-RPT-010005 | สลับมุมมอง list / grid บนจอ desktop | Low | Functional |
| TC-RPT-010006 | ค้นหา report ด้วย SearchInput แล้วส่งคำค้นไป backend | High | Functional |
| TC-RPT-010007 | กรองตาม report group ผ่านปุ่ม Filter | Medium | Functional |
| TC-RPT-010008 | toolbar ของหน้า Report list มีครบทุกตัวควบคุม | Medium | Functional |
| TC-RPT-010009 | เปลี่ยนหน้า/จำนวนต่อหน้าใน DataGridPagination | Medium | Functional |
| TC-RPT-010010 | ค้นหาคำที่ไม่มีผลลัพธ์แสดง empty state | Medium | Edge Case |
| TC-RPT-010011 | การ์ดในมุมมอง grid แสดง group / System / ชนิด template | Low | Functional |
| TC-RPT-010012 | ล้าง filter ผ่าน chip และ Clear | Medium | Functional |
| TC-RPT-010013 | บันทึกตัวกรองปัจจุบันเป็น saved view | Medium | Functional |
| TC-RPT-010014 | หน้า History แสดงตารางครบทุกคอลัมน์ | Medium | Functional |
| TC-RPT-010015 | ค้นหาในหน้า History | Medium | Functional |
| TC-RPT-010016 | หน้า History มุมมอง grid โหลดเพิ่มแบบ infinite scroll | Low | Functional |
| TC-RPT-010017 | หน้า Schedules แสดงตารางและปุ่ม Create Schedule | Medium | Functional |
| TC-RPT-010018 | โหลดรายการ report ไม่สำเร็จแสดง error state พร้อมปุ่มลองใหม่ | Medium | Negative |
| TC-RPT-020001 | คลิกชื่อ report เปิด ReportParamDialog | High | Functional |
| TC-RPT-020002 | dialog สร้างฟิลด์พารามิเตอร์จาก XML ของ template | Medium | Functional |
| TC-RPT-020003 | date field เติมค่าเริ่มต้นจาก keyword | Low | Functional |
| TC-RPT-020004 | report ที่ไม่มีพารามิเตอร์แสดงข้อความ noFiltersConfigured | Low | Edge Case |
| TC-RPT-020005 | lookup ที่มี DataSource เป็น combobox ค้นหาได้ | Medium | Functional |
| TC-RPT-020006 | lookup แบบ Multi แสดงเป็นกลุ่ม checkbox | Low | Functional |
| TC-RPT-020007 | lookup งวดบัญชีไม่มีตัวเลือก ALL และ default เป็นงวดล่าสุด | Low | Functional |
| TC-RPT-020008 | ปุ่ม Cancel ปิด dialog โดยไม่รันรายงาน | Medium | Functional |
| TC-RPT-020009 | ฟิลด์แบบช่วงแสดงเป็นคู่ From / To | Low | Functional |
| TC-RPT-020010 | ชื่อไฟล์ในหน้า History เปิดไฟล์ผลลัพธ์ได้ | Medium | Functional |
| TC-RPT-020011 | สถานะงานในหน้า History แสดงเป็นไอคอน + ป้ายข้อความ | Medium | Functional |
| TC-RPT-020012 | คอลัมน์ Frequency / Notify ในหน้า Schedules แปลงค่าให้อ่านออก | Medium | Functional |
| TC-RPT-030001 | Run Report สำเร็จและเปิดผลในแท็บใหม่ | High | Functional |
| TC-RPT-030002 | Run Report ล้มเหลวแสดง toast error และปิดแท็บที่เปิดไว้ | Medium | Negative |
| TC-RPT-030003 | เปิด dialog Create Schedule แล้วแสดงฟิลด์ครบ | High | Functional |
| TC-RPT-030004 | สร้าง schedule แบบ Daily สำเร็จ | High | CRUD |
| TC-RPT-030008 | notify_at เร็วกว่าเวลารันขึ้น badge +1 day | Medium | Functional |
| TC-RPT-030009 | notify_at ห่างจากเวลารันไม่ถึง 10 นาทีขึ้นคำเตือน | Low | Edge Case |
| TC-RPT-030010 | เลือกและถอดผู้รับใน Recipients | Medium | Functional |
| TC-RPT-030011 | Filters แสดงตาม template ที่เลือกและรีเซ็ตเมื่อเปลี่ยน template | Medium | Functional |
| TC-RPT-030012 | ปิด dialog แล้วเปิดใหม่ ฟอร์มถูกรีเซ็ต | Low | Functional |
| TC-RPT-040001 | หน้า History โหลดและแสดงประวัติการรัน | Medium | Smoke |
| TC-RPT-040002 | หน้า Schedules โหลดและแสดงตารางเวลา | Medium | Smoke |
| TC-RPT-040005 | หน้า Schedules ที่ยังไม่มีข้อมูลแสดง empty state | Low | Edge Case |
| TC-RPT-050001 | ลบ schedule ผ่าน confirm dialog สำเร็จ | High | CRUD |
| TC-RPT-050002 | ยกเลิกการลบ schedule แล้วรายการยังอยู่ | Medium | Functional |
| TC-RPT-100001 | ผู้ใช้ไม่ login เปิด /report ถูก redirect ไป /login | High | Auth-guard |
| TC-RPT-100002 | ผู้ใช้ไม่ login เปิดหน้าย่อยทั้งสามถูก redirect ไป /login | High | Auth-guard |
| TC-RPT-100003 | ผู้ใช้ที่ไม่มีสิทธิ์ report_analytics.view ถูกบล็อกที่หน้าย่อย | High | Authorization |
| TC-RPT-200001 | frequency Weekly แสดงปุ่มวันและบังคับเลือกอย่างน้อย 1 วัน | Medium | Validation |
| TC-RPT-200002 | frequency Monthly แสดงปุ่มวันที่ 1–31 และบังคับเลือก | Medium | Validation |
| TC-RPT-200003 | บันทึกโดยเว้น Name / Report Template ขึ้น error required | High | Validation |

---

## TC-RPT-010001 — หน้า Report landing โหลดและแสดง hero + 3 chapter
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น admin@blueledgers.com และเลือก BU `BLAVG` แล้ว
**Steps**
1. ไปที่ `/report`
**Expected**
URL ตรงกับ `/report`, แสดงหัวข้อใหญ่ "Reports", แถบ marker สามช่อง (01 The Menu / 02 The Schedule / 03 The History) และ chapter 01, 02, 03 พร้อมหัวข้อ "Browse the menu." / "Set it once." / "See what already happened."

---

## TC-RPT-010002 — CTA ของแต่ละ chapter นำไปหน้าย่อยที่ถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report`
**Steps**
1. กดลิงก์ "Open the catalog" ของ chapter 01 แล้วตรวจ URL
2. ย้อนกลับมาที่ `/report` แล้วกด "Open the schedule" ของ chapter 02
3. ย้อนกลับมาที่ `/report` แล้วกด "Open the history" ของ chapter 03
**Expected**
ไปที่ `/report/list`, `/report/schedules` และ `/report/history` ตามลำดับ (ข้อความ "shortcut · ⌘1/⌘2/⌘3" ข้างปุ่มเป็นข้อความตกแต่ง ไม่ต้องทดสอบการกดปุ่มลัด)

---

## TC-RPT-010003 — หน้า Report list โหลดและแสดงรายการ template
**Priority:** High · **Test Type:** Smoke
**Preconditions**
มี report template อย่างน้อย 1 รายการใน BU `BLAVG`; ล็อกอินแล้ว
**Steps**
1. ไปที่ `/report/list`
2. รอ skeleton/loading หาย
**Expected**
แสดงหัวข้อ "Report" พร้อมคำอธิบาย, toolbar และตาราง DataGrid ที่มีคอลัมน์ `#`, Name, Type พร้อมแถวข้อมูลอย่างน้อย 1 แถว

---

## TC-RPT-010004 — badge ข้างหัวข้อ Report แสดงจำนวนรวมจาก backend
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` และมี report อย่างน้อย 1 รายการ
**Steps**
1. อ่านค่า badge ข้างหัวข้อ "Report"
2. เปิดปุ่ม Filter แล้วเลือก report group หนึ่งกลุ่ม
3. อ่านค่า badge อีกครั้ง
**Expected**
badge แสดงจำนวนรวมทั้งหมดจาก `paginate.total` ของ backend (ไม่ใช่จำนวนแถวในหน้า) และ**ไม่เปลี่ยน**หลังเลือก group เพราะการกรอง group เป็น client-side · เมื่อไม่มีข้อมูลเลย (count = 0) badge จะไม่ถูก render

---

## TC-RPT-010005 — สลับมุมมอง list / grid บนจอ desktop
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` ด้วย viewport ขนาด desktop (≥ sm)
**Steps**
1. กดปุ่มที่มี aria-label "Grid view"
2. กดปุ่มที่มี aria-label "List view"
**Expected**
มุมมองสลับระหว่างการ์ด (grid) กับตาราง DataGrid และปุ่มที่ถูกเลือกอยู่เปลี่ยนเป็นสถานะ secondary · บน viewport มือถือ ปุ่มคู่นี้ถูกซ่อนและหน้าใช้การ์ดเสมอ

---

## TC-RPT-010006 — ค้นหา report ด้วย SearchInput แล้วส่งคำค้นไป backend
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี report หลายรายการ; อยู่ที่ `/report/list`
**Steps**
1. พิมพ์คำค้นในช่อง Search แล้วกด Enter
2. ตรวจ URL และรายการที่แสดง
3. กดปุ่มด้านขวาของช่องค้น (ตอนนี้เป็นปุ่มล้าง)
**Expected**
URL มี `?search=<คำค้น>` และ backend ถูกเรียกใหม่ด้วยพารามิเตอร์ `search` · รายการเหลือเฉพาะที่ตรงกับคำค้น · หลังกดล้าง ช่องค้นว่างและรายการกลับเป็นชุดเต็ม (การพิมพ์เฉย ๆ โดยไม่กด Enter/ไม่กดปุ่ม ไม่ยิงค้นหา)

---

## TC-RPT-010007 — กรองตาม report group ผ่านปุ่ม Filter
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` และในหน้าปัจจุบันมี report มากกว่า 1 group
**Steps**
1. กดปุ่ม "Filter"
2. เลื่อน/คลิกแถว "All Types" ใต้หัวข้อ "Category" เพื่อเปิดตัวเลือก
3. เลือก group หนึ่งกลุ่ม
**Expected**
URL มี `?groups=<ชื่อ group>` และ `page` ถูกรีเซ็ต · ตารางเหลือเฉพาะแถวที่ `Type` ตรงกับ group ที่เลือก (กรองเฉพาะรายการในหน้าปัจจุบัน) · ปุ่ม Filter ขึ้น badge จำนวน 1 และแถบ Active filter แสดง chip ของ field นี้

---

## TC-RPT-010008 — toolbar ของหน้า Report list มีครบทุกตัวควบคุม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` ด้วย viewport desktop และยังไม่ได้ตั้ง filter ใด ๆ
**Steps**
1. ดูแถบ toolbar ใต้หัวข้อหน้า
**Expected**
มีช่อง Search, ปุ่ม saved view (แสดง "No view"), ปุ่ม "Filter" (ยังไม่มี badge), และปุ่มสลับมุมมอง List/Grid · แถบ Active filter **ไม่ถูก render** เมื่อยังไม่มี filter ที่ใช้งานอยู่

---

## TC-RPT-010009 — เปลี่ยนหน้า/จำนวนต่อหน้าใน DataGridPagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี report template มากกว่า 10 รายการ (ค่าเริ่มต้นคือ 10 ต่อหน้า); อยู่ที่ `/report/list`
**Steps**
1. กดปุ่มไปหน้าถัดไปในแถบ pagination
2. เปลี่ยนค่า "rows per page" เป็นค่าที่ใหญ่กว่า
**Expected**
URL อัปเดต `page` และ `perpage` ตามที่เลือก, backend ถูกเรียกใหม่ด้วยค่าเดียวกัน และรายการในตารางเปลี่ยนตามหน้าใหม่

---

## TC-RPT-010010 — ค้นหาคำที่ไม่มีผลลัพธ์แสดง empty state
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/report/list`
**Steps**
1. พิมพ์คำค้นที่ไม่มีทางตรงกับ report ใด ๆ (เช่นสตริงสุ่ม) แล้วกด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty state ข้อความ "No data found" · badge จำนวนข้างหัวข้อหายไปเพราะ total = 0

---

## TC-RPT-010011 — การ์ดในมุมมอง grid แสดง group / System / ชนิด template
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` และสลับเป็นมุมมอง Grid แล้ว; มี report ที่เป็น template มาตรฐาน (`is_standard = true`)
**Steps**
1. ดูการ์ดของ report รายการแรก
**Expected**
การ์ดแสดงชื่อ report, ชื่อ group ตัวพิมพ์ใหญ่, ป้าย "System" เฉพาะรายการที่เป็น template มาตรฐาน, ป้ายชนิด template (ค่าเริ่มต้นเป็น `list` เมื่อ backend ไม่ส่ง `template_type`) และคำอธิบายด้านล่างเมื่อ report มีคำอธิบาย

---

## TC-RPT-010012 — ล้าง filter ผ่าน chip และ Clear
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` และเลือก report group ไว้แล้ว 1 กลุ่ม (มี chip ในแถบ Active filter)
**Steps**
1. กดปุ่ม X บน chip ของ filter
2. เลือก group ใหม่อีกครั้ง แล้วเปิดปุ่ม Filter และกด "Clear"
**Expected**
ทั้งสองทางทำให้ `groups` หายจาก URL, แถบ Active filter หายไป, badge บนปุ่ม Filter หาย และตารางกลับมาแสดงทุกรายการของหน้าปัจจุบัน

---

## TC-RPT-010013 — บันทึกตัวกรองปัจจุบันเป็น saved view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list` ด้วย viewport desktop และเลือก report group ไว้แล้ว
**Steps**
1. กดปุ่ม "Filter" แล้วเลือกแถว "Save current filters as view"
2. กรอกชื่อ view เลือก visibility "Only me" แล้วกดบันทึก
**Expected**
ขึ้น toast `View "<ชื่อ>" saved`, URL เพิ่มพารามิเตอร์ `sv`, และปุ่ม saved view บน toolbar เปลี่ยนจาก "No view" เป็นชื่อ view ที่เพิ่งบันทึก

---

## TC-RPT-010014 — หน้า History แสดงตารางครบทุกคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีประวัติการรันรายงานอย่างน้อย 1 รายการ; อยู่ที่ `/report/history` มุมมอง List
**Steps**
1. ดูหัวตารางและแถวแรก
**Expected**
คอลัมน์คือ `#`, Report Name, Report Type, Format, Status, Rows · Format แสดงเป็น PDF/Excel/CSV/JSON (หรือ `-` เมื่อค่าไม่อยู่ในชุดที่รู้จัก) และ Rows ชิดขวาแบบตัวเลข · หน้านี้ไม่มีปุ่ม Filter และไม่มีปุ่ม saved view

---

## TC-RPT-010015 — ค้นหาในหน้า History
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีประวัติการรันหลายรายการ; อยู่ที่ `/report/history`
**Steps**
1. พิมพ์คำค้นในช่อง Search แล้วกด Enter
**Expected**
URL มี `?search=` และ backend `report history` ถูกเรียกใหม่พร้อมพารามิเตอร์ search · ตารางแสดงเฉพาะรายการที่ตรง หรือ empty state เมื่อไม่พบ

---

## TC-RPT-010016 — หน้า History มุมมอง grid โหลดเพิ่มแบบ infinite scroll
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีประวัติการรันมากกว่าหนึ่งหน้า; อยู่ที่ `/report/history`
**Steps**
1. กดปุ่ม aria-label "Grid view"
2. เลื่อนหน้าจอลงจนสุดรายการ
**Expected**
แสดงการ์ดประวัติแทนตาราง, ด้านล่างมีข้อความ "Scroll to load more" และเปลี่ยนเป็น "Loading more…" ระหว่างโหลด · เมื่อโหลดเสร็จ การ์ดชุดใหม่ถูกต่อท้ายรายการเดิม (ไม่แทนที่)

---

## TC-RPT-010017 — หน้า Schedules แสดงตารางและปุ่ม Create Schedule
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี schedule อย่างน้อย 1 รายการใน BU `BLAVG`; อยู่ที่ `/report/schedules`
**Steps**
1. ดูหัวหน้าและหัวตาราง
**Expected**
แสดงหัวข้อ "Report Schedules" พร้อม badge จำนวน, ปุ่ม "Create Schedule" และตารางที่มีคอลัมน์ `#`, Name, Report Type, Format, Frequency, Notify, Active, Next Run, Last Run และปุ่มลบรายแถว · คอลัมน์ Active เป็นป้าย Active/Inactive แบบอ่านอย่างเดียว · หน้านี้ไม่มีช่องค้นหา ไม่มีปุ่ม Filter และไม่มีแถบ pagination

---

## TC-RPT-010018 — โหลดรายการ report ไม่สำเร็จแสดง error state พร้อมปุ่มลองใหม่
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ตั้ง route intercept ให้ `**/reports/templates*` คืน HTTP 500 ก่อนเข้าหน้า
**Steps**
1. ไปที่ `/report/list`
2. กดปุ่มลองใหม่ใน error state (หลังปลด intercept แล้ว)
**Expected**
แสดงข้อความ "Unable to load reports services. Please try again or contact your administrator." แทนตาราง พร้อมปุ่มลองใหม่ · หลังกดปุ่ม ระบบยิง query ซ้ำและแสดงรายการได้ตามปกติ

---

## TC-RPT-020001 — คลิกชื่อ report เปิด ReportParamDialog
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/list`; มี report อย่างน้อย 1 รายการ
**Steps**
1. ในมุมมอง List คลิกที่ **ชื่อ report** (เป็นปุ่มลิงก์ในคอลัมน์ Name ไม่ใช่ทั้งแถว)
2. ปิด dialog แล้วสลับเป็นมุมมอง Grid และคลิกที่การ์ด
**Expected**
ทั้งสองทางเปิด dialog ที่หัวเรื่องเป็นชื่อ report พร้อมฟอร์มพารามิเตอร์ และมีปุ่ม "Cancel" กับ "Run Report" ที่ท้าย dialog

---

## TC-RPT-020002 — dialog สร้างฟิลด์พารามิเตอร์จาก XML ของ template
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เลือก report ที่ `Dialog` XML มี `<Label>` + `<Lookup>` + `<Date>` ครบหลายชนิด
**Steps**
1. เปิด ReportParamDialog ของ report นั้น
2. รอ lookup โหลดเสร็จ
**Expected**
แต่ละฟิลด์แสดง label จาก `<Label Text="...">` และ control ตามชนิด: `<Lookup>` เป็น select/combobox, `<Date>` เป็น date picker · `<Label Visible="false">` ไม่ถูก render เป็นฟิลด์ของตัวเอง

---

## TC-RPT-020003 — date field เติมค่าเริ่มต้นจาก keyword
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เลือก report ที่มี `<Date Value="Today">` / `FirstDayOfMonth` / `@current_period`; BU มีงวดบัญชีตั้งไว้แล้ว
**Steps**
1. เปิด ReportParamDialog แล้วรอ lookup และงวดบัญชีโหลดเสร็จ
**Expected**
date picker แสดงวันที่จริงที่ resolve จาก keyword (วันนี้ / วันแรกของเดือน / วันเริ่มงวดปัจจุบัน) · ฟิลด์ที่ Value เป็น `@blank`/`@empty`/`@none` เริ่มต้นเป็นค่าว่าง ไม่ใช่วันนี้

---

## TC-RPT-020004 — report ที่ไม่มีพารามิเตอร์แสดงข้อความ noFiltersConfigured
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เลือก report ที่ `Dialog` ว่างหรือ parse แล้วไม่ได้ field เลย
**Steps**
1. เปิด ReportParamDialog ของ report นั้น
**Expected**
แสดงข้อความ "No filters configured for this report." แทนฟอร์ม และปุ่ม "Run Report" ยังกดได้

---

## TC-RPT-020005 — lookup ที่มี DataSource เป็น combobox ค้นหาได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เลือก report ที่มี `<Lookup DataSource="@product_list">` หรือ `@location_list` และ BU มีข้อมูลรายการนั้น
**Steps**
1. เปิด ReportParamDialog แล้วรอ lookup โหลด
2. กดเปิด control ของฟิลด์นั้นแล้วพิมพ์คำค้น
**Expected**
ฟิลด์ที่มาจาก data source แสดงเป็น combobox ที่พิมพ์กรองรายการได้ และมีตัวเลือก "All" เป็นตัวแรก · ส่วน lookup ที่ระบุตัวเลือกมากับ XML เอง (ไม่มี DataSource) ยังเป็น select ธรรมดา

---

## TC-RPT-020006 — lookup แบบ Multi แสดงเป็นกลุ่ม checkbox
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เลือก report ที่มี `<Lookup Multi="true">`
**Steps**
1. เปิด ReportParamDialog
2. ติ๊กตัวเลือกสองรายการ
**Expected**
ฟิลด์นั้นแสดงเป็นกล่องรวม checkbox ตามจำนวนตัวเลือก (ไม่ใช่ dropdown) และติ๊กได้หลายรายการพร้อมกัน · การไม่ติ๊กอะไรเลยหมายถึง "ทั้งหมด"

---

## TC-RPT-020007 — lookup งวดบัญชีไม่มีตัวเลือก ALL และ default เป็นงวดล่าสุด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เลือก report ที่มี `<Lookup DataSource="@period_list">`; BU มีงวดบัญชีมากกว่า 1 งวด
**Steps**
1. เปิด ReportParamDialog แล้วรอ lookup โหลด
2. เปิดรายการตัวเลือกของฟิลด์งวด
**Expected**
ไม่มีตัวเลือก "All" ในรายการ และค่าเริ่มต้นคือรายการแรก (งวดล่าสุดตามลำดับที่ backend ส่งมา) · ข้อความของตัวเลือกแสดงครั้งเดียวเมื่อ code กับ name เหมือนกัน (ไม่ขึ้นเป็น "2026-01 - 2026-01")

---

## TC-RPT-020008 — ปุ่ม Cancel ปิด dialog โดยไม่รันรายงาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด ReportParamDialog ของ report ใด ๆ อยู่
**Steps**
1. กดปุ่ม "Cancel"
**Expected**
dialog ปิด, ไม่มีแท็บใหม่ถูกเปิด, ไม่มี toast ใด ๆ และไม่มีการเรียก `POST .../reports/viewer`

---

## TC-RPT-020009 — ฟิลด์แบบช่วงแสดงเป็นคู่ From / To
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เลือก report ที่ XML จัดคู่เป็นช่วง (label ลงท้ายด้วย " From" ตามด้วย control, label "to" และ control ที่สอง)
**Steps**
1. เปิด ReportParamDialog ของ report นั้น
**Expected**
ฟิลด์นั้นแสดงเป็นสองช่องเรียงกันใต้ label เดียว โดยมีคำกำกับ "From" และ "To" · label หลักถูกตัดคำว่า " From" ท้ายออกแล้ว

---

## TC-RPT-020010 — ชื่อไฟล์ในหน้า History เปิดไฟล์ผลลัพธ์ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีประวัติการรันที่สถานะ Completed และมี `file_url`; อยู่ที่ `/report/history`
**Steps**
1. คลิกชื่อไฟล์ในคอลัมน์ Report Name
**Expected**
เปิดไฟล์ผลลัพธ์ในแท็บใหม่ (`target="_blank"`, `rel="noopener noreferrer"`) — ถ้า presigned URL ตอบแบบ attachment เบราว์เซอร์จะดาวน์โหลดแทน จึงต้องรองรับทั้งเหตุการณ์แท็บใหม่และ download · แถวที่ไม่มี `file_url` หรือ URL ไม่ผ่านการกรองความปลอดภัย จะแสดงชื่อเป็นข้อความธรรมดา กดไม่ได้

---

## TC-RPT-020011 — สถานะงานในหน้า History แสดงเป็นไอคอน + ป้ายข้อความ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีประวัติการรันที่สถานะต่างกัน (เช่น Completed และ Failed); อยู่ที่ `/report/history`
**Steps**
1. ดูคอลัมน์ Status ของแต่ละแถว
2. สลับไปมุมมอง Grid แล้วดูมุมขวาล่างของการ์ด
**Expected**
สถานะแสดงเป็นไอคอนคู่กับข้อความ Queued / Processing / Completed / Failed / Cancelled ตามค่าที่ backend ส่ง (`JOB_STATUS_*`) · ค่าที่ไม่อยู่ในห้าค่านี้แสดงเป็น `-` · การ์ดในมุมมอง grid ใช้สีเดียวกันกับแถบสถานะด้านซ้ายของการ์ด

---

## TC-RPT-020012 — คอลัมน์ Frequency / Notify ในหน้า Schedules แปลงค่าให้อ่านออก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี schedule แบบ daily และแบบ weekly อย่างน้อยอย่างละ 1 รายการ; อยู่ที่ `/report/schedules`
**Steps**
1. ดูคอลัมน์ Frequency และ Notify ของแต่ละแถว
**Expected**
Frequency แสดงเป็นข้อความ "Daily @ HH:mm" / "Weekly <วัน> @ HH:mm" / "Monthly day <วันที่> @ HH:mm" ตาม `schedule_config` และตกไปแสดง cron expression ดิบเมื่อไม่มี `schedule_config` · Notify แสดง "As soon as the run finishes" เมื่อไม่ได้ตั้งเวลาแจ้ง และแสดง "HH:mm (+1)" เมื่อเวลาแจ้งข้ามวัน

---

## TC-RPT-030001 — Run Report สำเร็จและเปิดผลในแท็บใหม่
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิด ReportParamDialog ของ report ที่ใช้งานได้ และข้อมูลที่ต้องใช้ (งวด/สินค้า/สถานที่) มีอยู่จริงใน BU
**Steps**
1. ตั้งค่าพารามิเตอร์ตามที่ต้องการ
2. เตรียมดักเหตุการณ์เปิดแท็บใหม่ แล้วกดปุ่ม "Run Report"
**Expected**
dialog ปิดทันที, มีแท็บใหม่ถูกเปิด และเปลี่ยนไปยัง URL ผลรายงานที่ backend คืนมา · ขึ้น toast `Report "<ชื่อ>" ready` พร้อมคำอธิบาย "Opening in a new tab." และปุ่ม "Open"

---

## TC-RPT-030002 — Run Report ล้มเหลวแสดง toast error และปิดแท็บที่เปิดไว้
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ตั้ง route intercept ให้ `**/reports/viewer` คืน HTTP 500; เปิด ReportParamDialog อยู่
**Steps**
1. กดปุ่ม "Run Report"
**Expected**
แท็บเปล่าที่เปิดไว้ล่วงหน้าถูกปิด และขึ้น toast error "Unable to open the report. Please try again." โดยไม่มีข้อความ error ดิบของ backend ต่อท้าย

---

## TC-RPT-030003 — เปิด dialog Create Schedule แล้วแสดงฟิลด์ครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/report/schedules`; มี report template อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่ม "Create Schedule"
**Expected**
เปิด dialog หัวเรื่อง "Create Schedule" ที่มี Name (จำเป็น), Report Template (จำเป็น), Frequency + Time (ค่าเริ่มต้น Daily / 08:00), กลุ่ม Notifications (Notify at + checkbox Web Application/Email) และกลุ่ม Recipients พร้อมปุ่ม Cancel / Create Schedule

---

## TC-RPT-030004 — สร้าง schedule แบบ Daily สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เปิด dialog Create Schedule อยู่; มี report template ให้เลือกอย่างน้อย 1 รายการ
**Steps**
1. กรอกชื่อ schedule ที่ไม่ซ้ำ
2. เลือก Report Template จาก dropdown
3. คง Frequency = Daily และกำหนด Time
4. กดปุ่ม "Create Schedule"
**Expected**
ขึ้น toast "Report Schedules created successfully", dialog ปิด, รายการถูกโหลดใหม่และมีแถวชื่อที่เพิ่งสร้างอยู่ในตาราง โดยคอลัมน์ Format แสดง "Viewer Link" (ฟอร์มส่ง `format: viewer_url` ตายตัว)

---

## TC-RPT-030008 — notify_at เร็วกว่าเวลารันขึ้น badge +1 day
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog Create Schedule อยู่ และ Time (เวลารัน) ตั้งไว้ที่ 08:00
**Steps**
1. กรอก "Notify at" เป็น 06:00
2. เปลี่ยน "Notify at" เป็น 09:00
3. ล้างค่า "Notify at" ให้ว่าง
**Expected**
ขั้นที่ 1 ขึ้น badge "+1 day" ข้างช่องเวลา พร้อมคำอธิบายว่าผู้รับจะได้รับในวันถัดไป · ขั้นที่ 2 badge หายและคำอธิบายเปลี่ยนเป็นแจ้งในวันเดียวกัน · ขั้นที่ 3 คำอธิบายเปลี่ยนเป็น "As soon as the run finishes"

---

## TC-RPT-030009 — notify_at ห่างจากเวลารันไม่ถึง 10 นาทีขึ้นคำเตือน
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เปิด dialog Create Schedule และตั้ง Time = 08:00
**Steps**
1. กรอก "Notify at" เป็น 08:05
2. กรอกฟิลด์ที่จำเป็นให้ครบแล้วกด "Create Schedule"
**Expected**
คำอธิบายใต้ช่องเวลาเปลี่ยนเป็นข้อความเตือน (ระบุว่าห่างไม่ถึง 10 นาทีและรายงานจะถูก render ตอนเปิดลิงก์) แสดงด้วยสีเตือน · เป็นคำเตือนอย่างเดียว **บันทึกได้ตามปกติ**

---

## TC-RPT-030010 — เลือกและถอดผู้รับใน Recipients
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog Create Schedule อยู่ และ BU มีผู้ใช้มากกว่า 1 คน
**Steps**
1. ติ๊ก checkbox ผู้ใช้สองคนในกล่อง Recipients
2. กดที่ป้ายชื่อ (badge) ของผู้ใช้คนหนึ่งด้านบนกล่อง
**Expected**
ผู้ใช้ที่ติ๊กจะขึ้นเป็น badge ด้านบนพร้อมปุ่มกากบาท · กดที่ badge แล้วชื่อนั้นถูกถอดออกและ checkbox ในรายการถูกยกเลิกติ๊กตาม · เมื่อ BU ไม่มีผู้ใช้เลยจะแสดงข้อความ "No users found."

---

## TC-RPT-030011 — Filters แสดงตาม template ที่เลือกและรีเซ็ตเมื่อเปลี่ยน template
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog Create Schedule อยู่; มี template ที่มี `Dialog` fields และ template ที่ไม่มีอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. เลือก template ที่มีฟิลด์ใน Dialog แล้วตั้งค่าใน section "Filters"
2. เปลี่ยนไปเลือก template อีกตัวหนึ่ง
**Expected**
section "Filters" ปรากฏเฉพาะเมื่อ template ที่เลือกมีฟิลด์ (ชนิด select ค่าเริ่มต้น "ALL", ชนิด date เป็นช่องวันที่, ชนิดอื่นเป็นช่องข้อความ) · เมื่อเปลี่ยน template ค่าที่กรอกไว้ถูกล้าง และรายการฟิลด์เปลี่ยนตาม template ใหม่ (หรือหายไปถ้า template ใหม่ไม่มีฟิลด์)

---

## TC-RPT-030012 — ปิด dialog แล้วเปิดใหม่ ฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิด dialog Create Schedule และกรอกข้อมูลไว้บางส่วน
**Steps**
1. กดปุ่ม "Cancel"
2. กดปุ่ม "Create Schedule" บนหน้ารายการเพื่อเปิด dialog อีกครั้ง
**Expected**
dialog ปิดโดยไม่สร้างรายการใหม่ · เมื่อเปิดอีกครั้ง ทุกฟิลด์กลับเป็นค่าเริ่มต้น (Name ว่าง, ไม่ได้เลือก template, Frequency = Daily, Time = 08:00, ไม่มี recipients)

---

## TC-RPT-040001 — หน้า History โหลดและแสดงประวัติการรัน
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น admin@blueledgers.com และเลือก BU `BLAVG` แล้ว
**Steps**
1. ไปที่ `/report/history`
2. รอ loading หาย
**Expected**
URL ตรงกับ `/report/history`, แสดงหัวข้อ "Report History" พร้อมคำอธิบาย, ช่องค้นหา และตารางประวัติการรัน (หรือ empty state "No data found" เมื่อยังไม่มีข้อมูล)

---

## TC-RPT-040002 — หน้า Schedules โหลดและแสดงตารางเวลา
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น admin@blueledgers.com และเลือก BU `BLAVG` แล้ว
**Steps**
1. ไปที่ `/report/schedules`
2. รอ loading หาย
**Expected**
URL ตรงกับ `/report/schedules`, แสดงหัวข้อ "Report Schedules", ปุ่ม "Create Schedule" และตารางรายการ schedule (หรือ empty state) โดยไม่เป็นหน้า 404 หรือ access denied

---

## TC-RPT-040005 — หน้า Schedules ที่ยังไม่มีข้อมูลแสดง empty state
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
BU ที่ยังไม่มี schedule เลย (หรือ intercept ให้ endpoint คืน `data: []`)
**Steps**
1. ไปที่ `/report/schedules`
**Expected**
ตารางแสดง empty state "No data found", badge จำนวนข้างหัวข้อไม่ถูก render และปุ่ม "Create Schedule" ยังกดได้ตามปกติ

---

## TC-RPT-050001 — ลบ schedule ผ่าน confirm dialog สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี schedule ที่สร้างไว้สำหรับการทดสอบ (เช่นจาก TC-RPT-030004); อยู่ที่ `/report/schedules`
**Steps**
1. กดปุ่มถังขยะ (aria-label "Delete") ที่ท้ายแถวของ schedule นั้น
2. ยืนยันการลบใน dialog
**Expected**
dialog ยืนยันมีหัวเรื่อง "Are you sure you want to delete this schedule?" และคำอธิบายเป็นชื่อ schedule · หลังยืนยันขึ้น toast "Schedule deleted successfully." และแถวนั้นหายจากตาราง (badge จำนวนลดลง 1)

---

## TC-RPT-050002 — ยกเลิกการลบ schedule แล้วรายการยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี schedule อย่างน้อย 1 รายการ; อยู่ที่ `/report/schedules`
**Steps**
1. กดปุ่มถังขยะที่ท้ายแถว
2. ปิด dialog ยืนยันโดยไม่ยืนยันการลบ
**Expected**
dialog ปิด, ไม่มี toast, ไม่มีการเรียก API ลบ และแถวเดิมยังอยู่ในตาราง

---

## TC-RPT-100001 — ผู้ใช้ไม่ login เปิด /report ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/report` ตรง ๆ โดยไม่ล็อกอิน
**Expected**
ถูก redirect ไป `/login` (แบบ replace) และฟอร์มล็อกอินแสดง

---

## TC-RPT-100002 — ผู้ใช้ไม่ login เปิดหน้าย่อยทั้งสามถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/report/list` โดยไม่ล็อกอิน
2. ทำซ้ำกับ `/report/schedules`
3. ทำซ้ำกับ `/report/history`
**Expected**
ทุกเส้นทางถูก redirect ไป `/login` และไม่มีการยิง API ของ report ก่อน redirect

---

## TC-RPT-100003 — ผู้ใช้ที่ไม่มีสิทธิ์ report_analytics.view ถูกบล็อกที่หน้าย่อย
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยบัญชีที่ **ไม่ใช่ admin** และไม่มี permission `report_analytics.view` ใน BU `BLAVG` (ต้องยืนยันการจับคู่ role–permission กับ backend ก่อนแปลงเป็นสเปก)
**Steps**
1. เปิด `/report/list` ตรง ๆ
2. เปิด `/report` ตรง ๆ
**Expected**
ขั้นที่ 1 แสดงกล่อง Access denied (element ที่มี `role="alert"`) พร้อมปุ่มพาไปหน้าที่เข้าได้ แทนเนื้อหาของหน้า · ขั้นที่ 2 หน้า landing `/report` **แสดงได้ตามปกติ** เพราะ route นี้ไม่มี permission/license ผูกไว้ใน `constant/module-list.ts`

---

## TC-RPT-200001 — frequency Weekly แสดงปุ่มวันและบังคับเลือกอย่างน้อย 1 วัน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เปิด dialog Create Schedule และกรอก Name + Report Template แล้ว
**Steps**
1. เปลี่ยน Frequency เป็น "Weekly"
2. กด "Create Schedule" โดยยังไม่เลือกวัน
3. เลือกวันหนึ่งวันแล้วกดบันทึกอีกครั้ง
**Expected**
เมื่อเลือก Weekly จะมีปุ่ม Sun–Sat (7 ปุ่ม สลับสถานะด้วย `aria-pressed`) · กดบันทึกโดยไม่เลือกวันขึ้นข้อความ "Days of Week is required" ใต้กลุ่มปุ่ม และไม่ยิง API · หลังเลือกวันแล้วบันทึกผ่าน

---

## TC-RPT-200002 — frequency Monthly แสดงปุ่มวันที่ 1–31 และบังคับเลือก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เปิด dialog Create Schedule และกรอก Name + Report Template แล้ว
**Steps**
1. เปลี่ยน Frequency เป็น "Monthly"
2. กด "Create Schedule" โดยยังไม่เลือกวันที่
**Expected**
แสดงปุ่มตัวเลข 1–31 ให้เลือกได้หลายวัน และขึ้นข้อความ "Days of Month is required" เมื่อบันทึกโดยยังไม่เลือก

---

## TC-RPT-200003 — บันทึกโดยเว้น Name / Report Template ขึ้น error required
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog Create Schedule ที่ยังไม่ได้กรอกอะไร
**Steps**
1. กดปุ่ม "Create Schedule" ทันที
**Expected**
ขึ้นข้อความ "Name is required" และ "Report Template is required" ที่ฟิลด์ที่เกี่ยวข้อง, หน้าจอเลื่อนไปยังฟิลด์แรกที่ไม่ผ่าน, dialog ยังเปิดอยู่ และไม่มีการเรียก API สร้าง schedule
