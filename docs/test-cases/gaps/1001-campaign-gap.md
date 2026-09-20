# Request for Pricing (Campaign) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบจริง** เท่านั้น — และสำหรับโมดูลนี้ "ยังไม่ครอบจริง" ไม่ได้แปลว่า "ยังไม่มีเคส" แต่แปลว่า **มีเคสที่อ้างว่าทดสอบแต่ไม่มี oracle** ดูหมายเหตุข้อ 1–3_

**Module:** Vendor Management — Request for Pricing (คำขอรายการราคาจากผู้ขาย / ที่สเปกเรียกว่า "Campaign")
**Frontend route:** `routes/vendor-management/request-price-list`  •  **URL:** `/vendor-management/request-price-list`, `/vendor-management/request-price-list/new`, `/vendor-management/request-price-list/:id`
**Backend:** `GET|POST /api/proxy/api/{buCode}/request-for-pricings` · `POST …/{id}/send-email` (`constant/api-endpoints.ts:372-375`)
**Prefix:** `CAM`
**สเปกที่มีอยู่:** `tests/1001-campaign.spec.ts` (46 ID · 43 เคสที่รันจริง · 1 เป็น `test.fixme`)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG) — เคสที่ต้องใช้บทบาทอื่นระบุไว้ใน Preconditions
**Total test cases:** 67

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **เส้นทางที่ยืนยันแล้ว — โมดูลนี้ชื่อ "Request for Pricing" ไม่ใช่ "Campaign"** `routes/router.tsx:422-435` ประกาศสามเส้นทาง `request-price-list`, `request-price-list/new`, `request-price-list/:id` ชี้ไป `rfp-component.tsx` / `rfp-form.tsx` / `rfp-edit-content.tsx` ตามลำดับ · `messages/en.json` ให้ `vendorManagement.requestPriceList.title = "Request for Pricing"` และ `add = "New Price Request"` · `constant/module-list.ts:233-239` ผูก `licenseFeature: "vendor_management.request_price_list"` กับ `permission: PERMISSIONS.vendor_management.view` **ชื่อ "campaign" มีอยู่ที่เดียวคือในสเปกกับ page object ของชุดเทส ไม่มีอยู่ในแอป**
>
> 2. **เคสเดิมที่มี oracle จริง มีแค่ 9 จาก 43 และ 4 ใน 9 นั้นเป็น oracle ที่ล้มไม่ได้** (นับด้วยการอ่านบอดี้ทุกเคส ตรงกับ `docs/test-cases/SPEC-HEALTH.md` ที่บอกว่า 33 เคสไม่มี `expect` เลย):
>
>     | TC เดิม | assertion ที่มี | ถือว่าครอบแล้วไหม |
>     | --- | --- | --- |
>     | `TC-CAM-010001` | `expect(page).toHaveURL(/request-price-list/)` | **ครอบแล้ว** (แค่ URL) |
>     | `TC-CAM-010002` | `expect(onListPage \|\| onUnauthorized).toBeTruthy()` | **ไม่ครอบ** — เป็น or ที่จริงเสมอ |
>     | `TC-CAM-020002` | `expect(cam.anyError().first()).toBeVisible()` | **ไม่ครอบ** — กดปุ่ม `Next` ที่ไม่มีในฟอร์มนี้ (ไม่มี wizard) error ที่เห็นจึงไม่ใช่ error ที่ตั้งใจวัด |
>     | `TC-CAM-040003` / `050002` / `090002` | `expect(true).toBe(true)` + `toBeDisabled()` ใน else | **ไม่ครอบ** — สาขา if คือ no-op และเป็นสาขาที่เดินจริง เพราะปุ่ม Duplicate/Actions ไม่มีในแอป |
>     | `TC-CAM-060005` | `expect(cam.anyError().first()).toBeVisible()` | **ไม่ครอบ** — ปุ่ม `Send Reminder` ไม่มีในแอป |
>     | `TC-CAM-080004` | `expect(true).toBe(true)` | **ไม่ครอบ** |
>     | `TC-CAM-080001` | `expect(del).toBeVisible()` | **`test.fixme`** ยังไม่รัน |
>     | `TC-CAM-090004` | ไม่มี (คำว่า `expect` อยู่ในคอมเมนต์) | **ไม่ครอบ** |
>     | `TC-CAM-100004` | `expect(cam.emptyState()).toBeVisible()` | **ครอบแล้ว** (แต่ `fill()` ไม่ตาม `Enter` — ดูข้อ 6) |
>     | `TC-CAM-010050` | `expect(active?.code).toBe(BU_CODE)` + BU switcher label | **ครอบแล้ว** |
>     | `TC-CAM-010051` | URL + heading `Request for Pricing` + ปุ่ม Add | **ครอบแล้ว** |
>     | `TC-CAM-010052` | ช่องค้นหาแสดง + พิมพ์ + `Enter` → empty state | **ครอบแล้ว** |
>
>     **สรุปสิ่งที่ถือว่าครอบแล้วและห้ามเขียนซ้ำมี 5 เรื่อง:** เปิดหน้า list แล้ว URL ถูก · heading `Request for Pricing` แสดง · ปุ่ม Add แสดง · active BU = BLAVG · ค้นคำที่ไม่มีแล้วเจอ empty state เอกสารนี้ไม่เขียนห้าเรื่องนี้ซ้ำ
>
>     **ไม่มี helper ตัวใดผลิตเคสของ `CAM`** — `grep -rn "TC-CAM-" tests/` เจอเฉพาะ `tests/1001-campaign.spec.ts` กับ `tests/results/1001-campaign-results.json` สเปกไม่ได้ import `tests/helpers/security-cases.ts` (import มีแค่ `fixtures/auth.fixture`, `pages/campaign.page`, `test-users`, `helpers/bu`, `pages/bu-switcher.page`, `helpers/test-data`, `helpers/list-row`)
>
> 3. **⚠️ UI ที่สเปกเดิมอ้างถึงเกินครึ่ง ไม่มีอยู่ในแอป — บันทึกเป็นข้อเท็จจริง ไม่ใช่เคส** (ยืนยันจากการอ่านซอร์สทั้งโฟลเดอร์ 9 ไฟล์ + `use-rfp-table.tsx` + `messages/en.json`) **เอกสารนี้จึงไม่มีเคสใดที่ยืนยันว่า "ฟีเจอร์ต่อไปนี้ยังไม่ทำงาน"** และไม่มีเคสใดอ้างถึงสิ่งเหล่านี้เลย:
>     - **ไม่มีสถานะของคำขอ (draft / active / expired / completed)** — `use-rfp-table.tsx:105` ส่ง `hideStatus: true` และ `RequestPriceList` ไม่มีฟิลด์สถานะ สถานะเดียวในโมดูลนี้คือ **สถานะของผู้ขายแต่ละราย** (`submitted` / `pending` จาก `has_submitted` — `rfp-vendor-cells.tsx:74-97`) ซึ่งอยู่ในตารางผู้ขายบนฟอร์ม ไม่ใช่ในหน้า list ⇒ `TC-CAM-010004`, `100001`, `100003`, `100005`, `030003` วัดของที่ไม่มี
>     - **ไม่มี Priority, Campaign Description, Scheduled Start Date, Performance Summary, Attached Files, Maximum Campaigns Per Week** — ฟอร์มมีแค่ Name, Template, Start Date, End Date, ตารางผู้ขาย และ Custom message (`rfp-form.tsx:252-385`, `rfp-form-schema.ts:22-44`) ⇒ `TC-CAM-020001`, `020004`, `030004`, `030005`, `040002`, `050004` วัดของที่ไม่มี
>     - **ไม่มีปุ่ม Duplicate, Send Reminder, Mark as Expired และไม่มี Actions dropdown** — แถบปุ่มบนหน้ารายละเอียดคือ Edit / Delete / Activity / Print เท่านั้น (`rfp-form.tsx:174-240`) ⇒ `TC-CAM-05xxxx`, `06xxxx`, `07xxxx` ทั้งสามบล็อกวัดของที่ไม่มี **สิ่งที่ใกล้เคียง "Send Reminder" ที่สุดคือปุ่มซองจดหมายรายผู้ขายในตารางผู้ขาย** ซึ่งเป็นคนละอย่าง (ส่งลิงก์ให้ผู้ขายหนึ่งราย ไม่ใช่เตือนทั้งแคมเปญ) — เอกสารนี้ครอบของจริงตัวนั้นในบล็อก 06
>     - **ไม่มี wizard หลายขั้นและไม่มีปุ่ม Next** — เป็นฟอร์มหน้าเดียวสามหมวดต่อกัน (`SettingSection` × 3) ⇒ `cam.nextButton()` ไม่เคยแมตช์อะไร
>     - **ไม่มี checkbox เลือกหลายรายการในหน้า list** — `useConfigTable` ของโมดูลนี้ไม่ได้ใส่ `selectColumn()` (ต่างจาก dialog เลือกผู้ขายที่ใส่) ⇒ `TC-CAM-080002`, `080003` วัดของที่ไม่มี
>
> 4. **เส้นแบ่งกับเอกสารอีกสองฉบับ — อ่านก่อนเพิ่มเคสใหม่:**
>     - **`docs/test-cases/1002-external-price-list.md` (prefix `EPL`, 42 เคส)** ครอบ **พอร์ทัลสาธารณะฝั่งผู้ขาย** ที่ `/pl/:url_token` (ไม่ต้อง login) คือหน้าที่ผู้ขาย *กรอกราคาแล้วส่งกลับ* เอกสารฉบับนี้ครอบ **ฝั่งผู้ซื้อ: การสร้างคำขอและการส่งคำขอออกไป** เท่านั้น **เส้นแบ่งเป็นรูปธรรมคือ `url_token`** — ทุกอย่างที่เกิด *ก่อน* ผู้ขายเปิดลิงก์ (สร้างคำขอ เลือก template เลือกผู้ขาย คัดลอก/ส่งลิงก์) อยู่ที่นี่ · ทุกอย่างที่เกิด *หลัง* เปิดลิงก์ (กรอกราคา MOQ tier นำเข้า Excel กดส่ง) อยู่ที่ `EPL` · เคส `TC-CAM-030104`/`030105` ในเอกสารนี้แตะลิงก์กับใบราคาที่ส่งกลับมา แต่ assert เฉพาะ**สิ่งที่หน้าฝั่งผู้ซื้อแสดง** ไม่ได้เปิดพอร์ทัลไปกรอกอะไร
>     - **`docs/test-cases/gaps/159-pl-gap.md` (prefix `PL`)** ครอบโมดูล **Price List** (`/vendor-management/price-list`) ซึ่งเป็น *ผลลัพธ์* ของคำขอ เอกสารนี้ไม่เขียนเคสของหน้านั้นเลย — `TC-CAM-030104` แค่ยืนยันว่า **ปุ่มในคอลัมน์ Price List เปิดแท็บใหม่ไปที่ `/vendor-management/price-list/<id>`** แล้วจบ ไม่ตรวจเนื้อหาของหน้าปลายทาง
>     - **Price List Template** (`/vendor-management/price-list-template`) มี gap report ของตัวเองที่ `160-pl-template-gap.md` — ที่นี่แตะ template เฉพาะในฐานะ **ค่าที่เลือกจาก `LookupPrt`** เท่านั้น
>
> 5. **Section block ที่ `CAM` ลงทะเบียนไว้คือ `01–10, 90`** (`docs/test-id-scheme.md:58`) — **ไม่ต้องแก้ scheme และเอกสารนี้ไม่ได้ขอ section ใหม่** ทุกเคสอยู่ในบล็อกที่ลงทะเบียนแล้ว การจัดกลุ่มเป็นดังนี้ (บล็อก 07 ที่ลงทะเบียนไว้ไม่ได้ใช้ เพราะของเดิมในบล็อกนั้นคือ "Mark as Expired" ซึ่งไม่มีในแอป — ปล่อยว่างดีกว่ายัดเรื่องอื่นเข้าไปแล้วเลขโกหกความหมายตัวเอง):
>
>     | บล็อก | เนื้อหาในเอกสารนี้ | ช่วง ID |
>     | --- | --- | --- |
>     | 01 | หน้า list — หัวเรื่อง คอลัมน์ เมนูตาราง pagination export print มุมมองการ์ด | `010100–010111` |
>     | 02 | ฟอร์มสร้างที่ `/new` — validation, date picker, guard, lookup | `020100–020108` |
>     | 03 | หน้ารายละเอียดโหมด view + deep link + ลิงก์ผู้ขาย | `030100–030106` |
>     | 04 | โหมดแก้ไข — save, discard, validation ตอนแก้ | `040100–040104` |
>     | 05 | หมวดผู้ขาย — dialog เลือกผู้ขาย ตารางผู้ขาย add/remove delta | `050100–050111` |
>     | 06 | กล่องส่งอีเมลคำขอให้ผู้ขาย | `060100–060108` |
>     | 08 | ลบคำขอ | `080100–080102` |
>     | 09 | เนื้อหาของไฟล์ export | `090100` |
>     | 10 | ตัวกรอง คำค้น chip saved view | `100100–100106` |
>     | 90 | สิทธิ์และ license | `900100–900101` |
>
>     **เลขเริ่มที่ `xx0100` ทุกบล็อกโดยตั้งใจ** — ของเดิมใช้ `xx0001–xx0005` และ `010050–010052` ส่วน `TC-CAM-900001..900010` เป็น **หัวคอมเมนต์คั่นบล็อก ไม่ใช่ชื่อเทส** (audit อ่านเฉพาะ ID ในชื่อ `test()` จึงไม่ถูกนับ แต่เอกสารนี้เลี่ยงชุดนั้นอยู่ดี เช่นเดียวกับที่ `159-pl-gap.md` ทำ) เว้นช่องว่างไว้ให้ของเดิมทั้งหมด
>
> 6. **⚠️ `tests/pages/campaign.page.ts` ล้าสมัยเกือบทั้งไฟล์ — ต้องเขียนใหม่ก่อนแปลงเคสในเอกสารนี้เป็นสเปก** (**ห้ามแก้ไฟล์นี้ในงานนี้** แต่ผู้เขียนสเปกต้องรู้) locator ที่ไม่แมตช์อะไรเลยในแอปปัจจุบัน:
>     - `statusFilter()` / `statusOption()` — ไม่มีตัวกรองสถานะ (ข้อ 3) และเมนู Filter ของหน้านี้ไม่มี element ที่มี role `combobox` หรือ `option` สำหรับสถานะเลย
>     - `campaignNameInput()` ใช้ `getByLabel(/campaign name/i)` — ป้ายจริงคือ `Name` (`field.name`) และช่องมี `id="rfp-name"` ซึ่งเป็น handle ที่ควรใช้
>     - `campaignDescriptionInput()`, `priorityTrigger()`, `scheduledStartDateInput()`, `nextButton()`, `templateOption()`, `launchCampaignButton()`, `duplicateButton()`, `actionsDropdown()`, `actionMenuItem()`, `vendorsTab()`, `sendReminderButton()`, `reminderMessageInput()` — **ไม่มีคู่ที่ตรงในแอปทั้งหมด**
>     - `statusBadge()` กรองด้วย `/draft|active|expired|completed/i` — badge สถานะเดียวที่มีคือของผู้ขาย ข้อความ `submitted` / `pending`
>     - `vendorCheckbox(name)` มองหา checkbox ในแถวของตาราง — checkbox มีเฉพาะใน **dialog เลือกผู้ขาย** ไม่ใช่ตารางผู้ขายบนฟอร์ม
>     - ที่ยังใช้ได้: `gotoList()`, `gotoNew()`, `gotoDetail(id)`, `newCampaignButton()` (คอมเมนต์ในไฟล์บันทึกไว้แล้วว่า `New Price Request` คือป้ายจริง), `confirmDialogButton()` (จับทั้ง `dialog` และ `alertdialog` ถูกต้องแล้ว — กล่องลบเป็น `AlertDialog`), `emptyState()`
>     - **`SearchInput` ยิง `onSearch` เฉพาะตอนกด `Enter` หรือกดปุ่มแว่นขยาย** (`components/search-input.tsx:36-45`) — `fill()` เฉย ๆ ไม่ค้นหา `TC-CAM-100004` ผ่านได้เพราะตารางยังว่างอยู่แล้ว ไม่ใช่เพราะการค้นหาทำงาน · `TC-CAM-010052` ทำถูกแล้ว
>
> 7. **กับดัก toast — สาม toast ลงท้ายเหมือนกัน** `toast.createSuccess = "{entity} created successfully"`, `updateSuccess`, `deleteSuccess` และ `t("entity") = "Request for Pricing"` regex กว้าง ๆ อย่าง `/success|สำเร็จ/i` จึงแมตช์ทั้งสาม **ทุกเคสในเอกสารนี้ผูก assertion กับข้อความเต็ม** (`/Request for Pricing created successfully/i` ฯลฯ) หรือรอ response ของ POST/PATCH/DELETE ด้วย `waitForResponse` ที่ path `**/request-for-pricings**`
>
> 8. **ต้องมี Price List Template ที่ `status === "active"` ใน BU ก่อน ไม่งั้นสร้างคำขอไม่ได้เลย** — `pricelist_template_id` เป็น required ใน `createRfpSchema` และ `LookupPrt` กรอง `t.status === "active"` (`components/lookup/lookup-prt.tsx:44`) ถ้า BLAVG ไม่มี template ที่ active สักอัน เคสในบล็อก 02 ทุกเคสตั้ง precondition ไม่ได้ — **ให้เตรียมข้อมูลตั้งต้นก่อน ไม่ใช่ปล่อยให้เทส skip เงียบ ๆ**
>
> 9. **⚠️ BLOCKER — `TC-CAM-060108` ส่งอีเมลจริงออกไปข้างนอก** `POST …/request-for-pricings/{id}/send-email` ให้ backend ส่งอีเมลผ่าน email profile ของ BU จริง **ไม่ใช่ mock** เคสนี้จึงต้องอย่างใดอย่างหนึ่ง: (ก) ใช้ที่อยู่ผู้รับที่เป็น mailbox ทดสอบภายในที่ทีมคุมได้ และ **ห้ามใช้อีเมลจริงของผู้ขายที่อยู่ใน master data** หรือ (ข) รันเป็นเคส manual เท่านั้น **เคส `060100`–`060107` ทุกตัวหยุดก่อนกด Send หรือคาดว่า Send ถูกบล็อกฝั่ง client จึงไม่ยิง POST เลย — ปลอดภัยที่จะรันอัตโนมัติ** ให้เขียนสเปกของ `060108` แยกไฟล์หรือติด `test.describe.serial` + tag ที่ CI ข้ามได้ อย่าให้มันปนกับชุดที่รันทุก PR
>
> 10. **`useEmailProfiles` เป็น precondition ที่ควบคุมไม่ได้จากในเทส** — กล่องส่งอีเมลแยกสองสาขาตั้งแต่ mount: มี profile ที่ `enabled` → ฟอร์มเต็ม · ไม่มี (หรือโหลดพัง) → ข้อความ "No enabled email profile is set up for this business unit yet." + ปุ่มไป `/system-admin/email-profile` และ **ไม่มีปุ่ม Send เลย** (`rfp-send-email-dialog.tsx:455`) เคส `060101` ครอบสาขาหลัง เคสที่เหลือครอบสาขาแรก **ต้องรู้ก่อนรันว่า BLAVG อยู่สาขาไหน** ไม่งั้นครึ่งหนึ่งของบล็อก 06 จะล้มด้วยเหตุผลที่ไม่เกี่ยวกับสิ่งที่วัด
>
> 11. **Export กับ Print แตะของนอกหน้าเว็บ** — Export ดาวน์โหลดไฟล์จริง (`request-price-list_YYYY-MM-DD.xlsx` จาก `buildXlsxFileName`) ให้ดักด้วย `page.waitForEvent("download")` ไม่ใช่ดูแค่ toast · ปุ่ม Print บนหน้า list เรียก `globalThis.print()` ตรง ๆ (`document-list-actions.tsx:81`) ซึ่งเปิด native dialog ที่ Playwright ปิดไม่ได้ — `TC-CAM-010111` จึง **stub `window.print` ก่อนคลิก** แล้ว assert ว่าถูกเรียก ส่วนปุ่ม Print บนหน้ารายละเอียดเป็น `PrintDocumentButton` คนละตัว (ยิง report service) ดู `TC-CAM-030106`
>
> 12. **ปุ่ม Add / Edit / Delete ของโมดูลนี้ไม่ถูก gate ด้วยสิทธิ์ฝั่ง UI** — `rfp-component.tsx:229-234` เรียก `DocumentListActions` โดย**ไม่ส่ง `addDisabled`** และ `rfp-form.tsx:174-240` วางปุ่ม Edit/Delete/Activity เป็น `<Button>` ดิบใน `DocFormHeader` ไม่ได้ผ่าน toolbar ที่เช็คสิทธิ์ ทางเดียวที่กั้นอยู่คือ `RouteGuard` (license ก่อน แล้วค่อย `vendor_management.view` — `components/route-guard.tsx:56-74`) **เอกสารนี้จึงไม่เขียนเคสที่ assert ว่าปุ่มถูกกั้น** — `TC-CAM-900100`/`900101` ครอบเฉพาะสองทางที่กั้นจริง ส่วนที่เหลือบันทึกเป็นข้อเท็จจริงไว้ตรงนี้ให้ทีมตัดสินใจ
>
> 13. **`TC-CAM-080001` ที่เป็น `test.fixme` อยู่ — เหตุผลในคอมเมนต์ยังจริง** (ลบแล้วเคสอื่นอีกแปดตัวเจอ list ว่าง) `TC-CAM-080100`–`080102` ในเอกสารนี้จึง **สร้างคำขอของตัวเองก่อนลบทุกครั้ง** และต้องอยู่ใน `test.describe.serial` เดียวกับเคสสร้าง (ดูบันทึกทีมเรื่อง serial CRUD chains — Playwright รีสตาร์ท worker หลังเคสล้ม แล้ว UID ระดับโมดูลจะคำนวณใหม่)
>
> 14. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CAM-010100 | หน้า list แสดงหัวเรื่อง คำอธิบาย badge จำนวน และปุ่มสามตัวบนแถบหัว | High | Smoke |
| TC-CAM-010101 | ชุดคอลัมน์ของตารางตรงตามที่โมดูลกำหนด และไม่มีคอลัมน์สถานะ | High | Functional |
| TC-CAM-010102 | คอลัมน์ Created / Updated ถูกซ่อนไว้ตั้งแต่ต้น และเปิดได้จากเมนู Toggle Columns | Low | Functional |
| TC-CAM-010103 | คอลัมน์ Name เป็นปุ่มที่เปิดหน้ารายละเอียดของรายการนั้น | High | Functional |
| TC-CAM-010104 | เมนูเรียงลำดับมีเฉพาะคอลัมน์ที่เรียงได้ และสลับทิศได้ | Medium | Functional |
| TC-CAM-010105 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าแล้วไหลลง query string | Medium | Functional |
| TC-CAM-010106 | ส่งออกรายการเป็นไฟล์ XLSX และได้ toast บอกจำนวนแถว | Medium | Functional |
| TC-CAM-010107 | กดส่งออกขณะรายการว่าง ได้ toast เตือนแทนไฟล์ | Low | Edge Case |
| TC-CAM-010108 | ช่วงที่คำขอยังส่งออกอยู่ ปุ่ม Export ถูกปิดและเปลี่ยนป้าย | Low | Functional |
| TC-CAM-010109 | สลับมุมมองตาราง / การ์ด แล้วการ์ดแสดงข้อมูลครบสี่อย่าง | Medium | Functional |
| TC-CAM-010110 | มุมมองการ์ดโหลดเพิ่มเมื่อเลื่อนถึงท้ายรายการ | Low | Functional |
| TC-CAM-010111 | ปุ่ม Print บนหน้า list เรียกการพิมพ์ของเบราว์เซอร์ | Low | Functional |
| TC-CAM-020100 | ฟอร์มสร้างที่ `/new` แสดงชื่อ placeholder ปุ่มสองตัว และสามหมวด | High | Smoke |
| TC-CAM-020101 | กด Create โดยไม่กรอกอะไร ต้องขึ้นข้อความใต้ Name และ Template | High | Validation |
| TC-CAM-020102 | End Date ก่อน Start Date ถูกบล็อกพร้อมข้อความใต้ช่อง End Date | High | Validation |
| TC-CAM-020103 | ปฏิทินปิดวันที่ก่อนวันนี้ และ End Date ปิดวันก่อน Start Date | Medium | Functional |
| TC-CAM-020104 | สร้างคำขอขั้นต่ำสำเร็จแล้วเด้งไปหน้ารายละเอียดในโหมด view | High | Happy Path |
| TC-CAM-020105 | ขีดจำกัดความยาวของ Name และ Custom message | Low | Validation |
| TC-CAM-020106 | Cancel ขณะฟอร์มสร้าง dirty ต้องเด้ง Discard แล้วจึงกลับ list | Medium | Alternate Flow |
| TC-CAM-020107 | กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-CAM-020108 | Lookup เลือก template ค้นหาฝั่ง server และมีเฉพาะ template ที่ active | Medium | Functional |
| TC-CAM-030100 | หน้ารายละเอียดเปิดมาในโหมด view — ทุกช่องเป็นข้อความ แก้ไม่ได้ | High | Functional |
| TC-CAM-030101 | deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Price list request not found | Medium | Edge Case |
| TC-CAM-030102 | ปุ่ม Activity เปิดแผงประวัติของคำขอใบนี้ได้ทั้งสองโหมด | Low | Functional |
| TC-CAM-030103 | คอลัมน์ Status ของผู้ขายแสดง submitted / pending ตามที่ส่งกลับมา | High | Functional |
| TC-CAM-030104 | คอลัมน์ Price List เปิดใบราคาที่ผู้ขายส่งกลับในแท็บใหม่ | Medium | Functional |
| TC-CAM-030105 | ปุ่มคัดลอก / เปิดลิงก์ผู้ขาย มีเฉพาะแถวที่มี url token และได้ค่าที่ถูก | High | Functional |
| TC-CAM-030106 | ปุ่ม Print บนหน้ารายละเอียดมีเฉพาะโหมด view และยิงคำขอพิมพ์เอกสาร RFP | Low | Functional |
| TC-CAM-040100 | กด Edit แล้วหน้าเดิมพลิกเป็นโหมดแก้ไขครบทุกส่วน | High | Functional |
| TC-CAM-040101 | แก้ชื่อแล้ว Save สำเร็จ กลับโหมด view และส่ง doc_version ไปด้วย | High | CRUD |
| TC-CAM-040102 | Cancel แล้วยืนยัน Discard ต้องคืนค่าบนหน้าจอและอยู่หน้าเดิม | Medium | Alternate Flow |
| TC-CAM-040103 | ลบชื่อออกแล้ว Save ต้องถูกบล็อกและไม่ยิง PATCH | High | Validation |
| TC-CAM-040104 | แก้วันที่ให้ End ก่อน Start ในโหมดแก้ไข ต้องถูกบล็อก | Medium | Validation |
| TC-CAM-050100 | หมวดผู้ขายที่ยังว่าง แสดงกล่องว่างและปุ่มเพิ่มอยู่ที่หัวหมวดเท่านั้น | Medium | Functional |
| TC-CAM-050101 | กล่องเลือกผู้ขาย — หัวข้อ ตัวนับ และปุ่มเพิ่มที่ปิดอยู่เมื่อยังไม่เลือก | High | Functional |
| TC-CAM-050102 | เลือกผู้ขายข้ามหน้าในกล่อง ตัวนับต้องรวมทุกหน้า | Medium | Edge Case |
| TC-CAM-050103 | ผู้ขายที่อยู่ในคำขอแล้วถูกติ๊กค้างและติ๊กออกไม่ได้ | High | Functional |
| TC-CAM-050104 | ปิดกล่องเลือกผู้ขายแล้วสถานะภายในถูกล้างทุกครั้ง | Medium | Functional |
| TC-CAM-050105 | ค้นหาในกล่องเลือกผู้ขายไม่เจอ ต้องขึ้นข้อความเฉพาะของกล่องนี้ | Low | Edge Case |
| TC-CAM-050106 | ผู้ขายที่เพิ่มเข้ามาได้ผู้ติดต่อหลักเติมให้อัตโนมัติ | High | Functional |
| TC-CAM-050107 | ชุดคอลัมน์ของตารางผู้ขาย และเซลล์ว่างที่แสดงเป็นขีด | Medium | Functional |
| TC-CAM-050108 | ลบผู้ขายออกจากตารางต้องยืนยันด้วยกล่องที่ระบุชื่อผู้ขาย | Medium | Functional |
| TC-CAM-050109 | เซลล์อีเมลเป็นลิงก์ mailto ที่อ่านออกด้วยโปรแกรมอ่านหน้าจอ | Low | Accessibility |
| TC-CAM-050110 | เพิ่มผู้ขายแล้ว Save ต้องส่งเฉพาะรายที่เพิ่มและคงอยู่หลังโหลดใหม่ | High | CRUD |
| TC-CAM-050111 | ลบผู้ขายที่บันทึกแล้วและเพิ่มคนเดิมกลับในรอบเดียวกัน ลิงก์เดิมต้องไม่เปลี่ยน | High | Edge Case |
| TC-CAM-060100 | กล่องส่งอีเมลเปิดมาพร้อมผู้รับ หัวเรื่อง และเนื้อความตั้งต้น | High | Functional |
| TC-CAM-060101 | BU ที่ยังไม่มี email profile เปิดใช้งาน กล่องแสดงทางออกแทนฟอร์ม | High | Alternate Flow |
| TC-CAM-060102 | ช่องผู้รับ — อีเมลผิดรูปแบบ อีเมลซ้ำ และการถอด chip ออก | Medium | Validation |
| TC-CAM-060103 | กด Send โดยไม่มีผู้รับเลย ต้องถูกบล็อกพร้อมข้อความใต้ช่อง | High | Validation |
| TC-CAM-060104 | กด Send โดยหัวเรื่องหรือเนื้อความว่าง ต้องถูกบล็อกพร้อม toast | High | Validation |
| TC-CAM-060105 | สลับข้อความสำเร็จรูปทับค่าที่ยังไม่ได้แก้ แต่ไม่ทับค่าที่ผู้ใช้พิมพ์เอง | Medium | Functional |
| TC-CAM-060106 | เปิดกล่องส่งอีเมลจากคำขอที่ยังไม่บันทึก ปุ่ม Send ต้องปิดพร้อมบอกเหตุผล | High | Negative |
| TC-CAM-060107 | เนื้อความตั้งต้นมีลิงก์พอร์ทัลของผู้ขายรายนั้นอยู่จริง | High | Functional |
| TC-CAM-060108 | ส่งอีเมลสำเร็จ ได้ toast และกล่องปิด (⚠️ ส่งอีเมลจริง — ดูหมายเหตุข้อ 9) | Medium | Happy Path |
| TC-CAM-080100 | ลบคำขอจากหน้า list ผ่านกล่องยืนยันที่ระบุชื่อ | High | CRUD |
| TC-CAM-080101 | กด Cancel ในกล่องยืนยันลบ ต้องไม่ลบอะไรเลย | Medium | Negative |
| TC-CAM-080102 | ลบคำขอจากหน้ารายละเอียดแล้วเด้งกลับ list | Medium | CRUD |
| TC-CAM-090100 | ไฟล์ที่ส่งออกมีแปดคอลัมน์ตามลำดับ และเคารพคำค้น/ตัวกรองปัจจุบัน | Medium | Functional |
| TC-CAM-100100 | เมนู Filter มีเฉพาะสองตัวกรองในสองหมวด | High | Functional |
| TC-CAM-100101 | กรองตาม Template แล้ว chip ปรากฏและตารางถูกกรอง | High | Functional |
| TC-CAM-100102 | กรองตามช่วงวันเริ่มรับราคา | Medium | Functional |
| TC-CAM-100103 | chip คำค้นหาแยกจาก chip ตัวกรอง และลบได้ทีละอัน | Medium | Functional |
| TC-CAM-100104 | ปุ่ม Clear ล้างทั้งตัวกรองและคำค้นในครั้งเดียว | Medium | Functional |
| TC-CAM-100105 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-CAM-100106 | การค้นหายิงเมื่อกด Enter เท่านั้น และปุ่มท้ายช่องสลับเป็นกากบาท | High | Functional |
| TC-CAM-900100 | ผู้ใช้ที่ไม่มีสิทธิ์ vendor_management.view เปิดหน้านี้ไม่ได้ทั้งสามเส้นทาง | High | Authorization |
| TC-CAM-900101 | BU ที่ไม่ได้ซื้อฟีเจอร์นี้ถูกบล็อกด้วยกล่อง Feature Not Licensed | Medium | Authorization |

---
## TC-CAM-010100 — หน้า list แสดงหัวเรื่อง คำอธิบาย badge จำนวน และปุ่มสามตัวบนแถบหัว
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคำขอรายการราคาอย่างน้อย 1 ใบใน BU
**Steps**
1. ไปที่ `/vendor-management/request-price-list`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. อ่านแถบหัวของหน้า
**Expected**
แถบหัวแสดงไอคอนโมดูล, `<h1>` ข้อความ "Request for Pricing", badge ตัวเลขจำนวนรายการรวม (แสดงเฉพาะเมื่อ > 0 — `DocumentListHeader` ซ่อนเมื่อ count เป็น 0) และคำอธิบายใต้ชื่อ "Quote requests sent out to vendors, and what has come back."; ทางขวามีปุ่มสามตัวตามลำดับ **Export**, **Print**, **New Price Request**; ตัวเลขใน badge ต้องเท่ากับ `paginate.total` ของ response `GET **/request-for-pricings**` ที่หน้านี้ยิง

---
## TC-CAM-010101 — ชุดคอลัมน์ของตารางตรงตามที่โมดูลกำหนด และไม่มีคอลัมน์สถานะ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` ในมุมมองตาราง (desktop viewport) และมีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. อ่านหัวตารางทั้งหมดจากซ้ายไปขวา
2. เปิดเมนู Toggle Columns (ปุ่ม aria-label "Toggle columns") แล้วอ่านรายการทั้งหมดในเมนู
**Expected**
หัวตารางที่มองเห็นคือ **Name, Template, Effective Period, Vendor Count** ตามลำดับนี้ ตามด้วยคอลัมน์ปุ่มจัดการท้ายแถว; **ไม่มีหัวตารางชื่อ Status และไม่มีช่อง checkbox เลือกแถว** (`use-rfp-table.tsx` ส่ง `hideStatus: true` และไม่ได้ใส่ `selectColumn()`); เมนู Toggle Columns มีรายการเพียง Name, Template, Effective Period, Vendor Count, Created, Updated — **ไม่มีรายการ Status / is_active**; คอลัมน์ Vendor Count จัดกลางทั้งหัวและเซลล์; คอลัมน์ Effective Period แสดงเป็น `<วันเริ่ม> - <วันสิ้นสุด>` ตามรูปแบบวันที่ของโปรไฟล์ผู้ใช้ และเป็น `—` เมื่อไม่มีทั้งสองวัน

---
## TC-CAM-010102 — คอลัมน์ Created / Updated ถูกซ่อนไว้ตั้งแต่ต้น และเปิดได้จากเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` ในมุมมองตาราง เพิ่งเปิดหน้าใหม่ (ยังไม่เคยแตะเมนูคอลัมน์ในเซสชันนี้)
**Steps**
1. ตรวจว่าหัวตารางมี Created / Updated หรือไม่
2. เปิดเมนู Toggle Columns แล้วติ๊ก Created และ Updated
3. ปิดเมนูแล้วอ่านหัวตารางอีกครั้ง
**Expected**
ก่อนติ๊ก หัวตาราง **ไม่มี** Created และ Updated (`initialState.columnVisibility` ใน `use-rfp-table.tsx:107-109` ตั้ง `created_at: false, updated_at: false`) แม้จะอยู่ในรายการของเมนู; หลังติ๊กทั้งสอง หัวตารางเพิ่มคอลัมน์ Created และ Updated ต่อท้าย Vendor Count และเซลล์แสดงวันที่-เวลาตามรูปแบบ `dateTimeFormat` ของโปรไฟล์

---
## TC-CAM-010103 — คอลัมน์ Name เป็นปุ่มที่เปิดหน้ารายละเอียดของรายการนั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` และมีคำขออย่างน้อย 1 ใบที่รู้ชื่อแน่นอน
**Steps**
1. อ่านชื่อของแถวแรก
2. ตรวจว่าเซลล์ชื่อเป็น element ชนิดใด
3. คลิกที่ชื่อนั้น
**Expected**
เซลล์ชื่อเป็น `<button type="button">` (คอมโพเนนต์ `CellAction`) **ไม่ใช่ `<a href>`** — การตามลิงก์อย่างเดียวจึงไม่มีทางเปิดหน้ารายละเอียดได้; คลิกแล้ว URL เปลี่ยนเป็น `/vendor-management/request-price-list/<uuid>` และหัวหน้าฟอร์มแสดงชื่อเดียวกับที่อ่านมาจากแถว; ถ้าคำขอใบนั้นไม่มีชื่อ เซลล์แสดง `...` แทนช่องว่าง

---
## TC-CAM-010104 — เมนูเรียงลำดับมีเฉพาะคอลัมน์ที่เรียงได้ และสลับทิศได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` ในมุมมองตาราง มีคำขออย่างน้อย 3 ใบที่ชื่อต่างกัน
**Steps**
1. เปิดเมนูเรียงลำดับ (ปุ่ม aria-label "Sort by") แล้วอ่านรายการทั้งหมด
2. เลือกเรียงตาม Name
3. สลับทิศเป็นตรงกันข้าม
4. อ่าน query string ของหน้าและลำดับแถวในตาราง
**Expected**
เมนูมีรายการเฉพาะคอลัมน์ที่เรียงได้คือ **Name** และ **Effective Period** (`start_date`) — **ไม่มี Template และ Vendor Count** เพราะทั้งคู่ตั้ง `enableSorting: false`; หลังเลือก Name query string มี `sort=name:asc` และแถวเรียงตามชื่อจาก A→Z; หลังสลับทิศ query string เป็น `sort=name:desc` และลำดับแถวกลับด้าน; พารามิเตอร์ `page` ถูกรีเซ็ตกลับหน้า 1 ทุกครั้งที่เปลี่ยน sort

---
## TC-CAM-010105 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าแล้วไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขอมากกว่าจำนวนแถวต่อหน้าเริ่มต้น (ต้องมากพอให้มีหน้า 2)
**Steps**
1. อ่านแถบ pagination ท้ายตาราง
2. เปลี่ยนจำนวนแถวต่อหน้าเป็นค่าที่เล็กที่สุดที่เลือกได้
3. กดไปหน้าถัดไป
4. อ่าน query string และแถวที่แสดง
**Expected**
หลังเปลี่ยนจำนวนแถว query string มี `perpage=<ค่าที่เลือก>` และจำนวนแถวในตารางไม่เกินค่านั้น; หลังกดหน้าถัดไป query string มี `page=2` และชุดแถวที่แสดง **ไม่ซ้ำกับหน้า 1 เลยสักแถว** (เทียบด้วยชื่อ); แถบ pagination แสดงช่วงและจำนวนรวมที่สอดคล้องกับ `paginate.total` ของ response

---
## TC-CAM-010106 — ส่งออกรายการเป็นไฟล์ XLSX และได้ toast บอกจำนวนแถว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขออย่างน้อย 1 ใบ; รู้จำนวนรวม (`paginate.total`) ของรายการปัจจุบัน
**Steps**
1. เตรียมดักเหตุการณ์ดาวน์โหลดของเบราว์เซอร์
2. กดปุ่ม Export
3. รอไฟล์และ toast
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ชื่อ `request-price-list_YYYY-MM-DD.xlsx` (วันที่คือวันที่รัน — `buildXlsxFileName` ต่อ `_` กับวันที่ ISO); toast สีเขียวข้อความ "Exported {n} records" โดย `{n}` เท่ากับจำนวนแถวทั้งหมดที่ตรงกับ filter ปัจจุบัน **ไม่ใช่จำนวนแถวบนหน้าที่เห็น** (`useExportRequestPriceList` ยิง `GET` ด้วย `queryParams` ชุดเดียวกับตารางแต่ไม่จำกัดหน้า); ไม่มี toast สีแดงหรือสีเหลืองขึ้นมาพร้อมกัน

---
## TC-CAM-010107 — กดส่งออกขณะรายการว่าง ได้ toast เตือนแทนไฟล์
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` และกรองจนตารางว่าง (เช่นค้นคำที่ไม่มีอยู่จริงแล้วกด Enter จนเห็น "No data found")
**Steps**
1. ยืนยันว่าตารางแสดง empty state อยู่
2. กดปุ่ม Export
3. รอผล
**Expected**
**ไม่มีไฟล์ถูกดาวน์โหลด** (ไม่มี download event ภายใน 5 วินาที — `exportToXlsx` คืน 0 ก่อนเรียก `downloadXlsx` เมื่อ `rows.length === 0`); toast สีเหลืองข้อความ "No data to export"; หน้าไม่เปลี่ยน URL และตารางยังแสดง empty state เดิม

---
## TC-CAM-010108 — ช่วงที่คำขอยังส่งออกอยู่ ปุ่ม Export ถูกปิดและเปลี่ยนป้าย
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีข้อมูลพอที่การ export ใช้เวลาสังเกตได้ (หรือหน่วง response ของ `GET **/request-for-pricings**` ด้วย route interception)
**Steps**
1. หน่วง response ของคำขอ list ที่ปุ่ม Export ยิง
2. กดปุ่ม Export
3. อ่านป้ายและสถานะของปุ่มระหว่างรอ
4. ปล่อย response แล้วอ่านปุ่มอีกครั้ง
**Expected**
ระหว่างรอ ปุ่มเปลี่ยนป้ายจาก "Export" เป็น **"Exporting..."** พร้อมไอคอนหมุน และมีแอตทริบิวต์ `disabled` — กดซ้ำไม่ยิงคำขอรอบสอง; หลัง response กลับมา ปุ่มกลับเป็น "Export" และกดได้อีกครั้ง

---
## TC-CAM-010109 — สลับมุมมองตาราง / การ์ด แล้วการ์ดแสดงข้อมูลครบสี่อย่าง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` บน desktop viewport; มีคำขออย่างน้อย 1 ใบที่ **มี template และมีทั้งวันเริ่มและวันสิ้นสุด**
**Steps**
1. กดปุ่มสลับเป็นมุมมองการ์ด (aria-label "Grid view")
2. อ่านการ์ดใบแรกทั้งใบ
3. กดปุ่มกลับเป็นมุมมองตาราง (aria-label "List view")
**Expected**
ในมุมมองการ์ด ตารางหายไปและมีการ์ดเรียงเป็นกริด; การ์ดหนึ่งใบแสดง **ชื่อคำขอเป็นหัวการ์ด** (หรือ `...` ถ้าไม่มีชื่อ), **badge ไอคอนคนพร้อมจำนวนผู้ขาย**, แถว "Template" พร้อมชื่อ template, แถว "Effective Period" พร้อมช่วงวันที่ และแถว "Vendor Count"; คลิกการ์ดเปิดหน้ารายละเอียดของรายการนั้น; กดกลับมุมมองตารางแล้วตารางกลับมาพร้อมข้อมูลชุดเดิม

---
## TC-CAM-010110 — มุมมองการ์ดโหลดเพิ่มเมื่อเลื่อนถึงท้ายรายการ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` ในมุมมองการ์ด; BU มีคำขอมากกว่าหนึ่งหน้า
**Steps**
1. นับจำนวนการ์ดที่แสดงอยู่
2. เลื่อนหน้าลงจนสุด
3. รอให้การ์ดชุดถัดไปโหลด แล้วนับใหม่
**Expected**
เมื่อเลื่อนถึงท้าย มี sentinel ที่ทำให้ยิงคำขอหน้าถัดไปอัตโนมัติ (ระหว่างโหลดมีไอคอนหมุน) และ **จำนวนการ์ดเพิ่มขึ้นโดยชุดเดิมยังอยู่** (ไม่ใช่การแทนที่แบบ pagination); เมื่อครบทุกรายการแล้ว sentinel หายและไม่มีคำขอเพิ่มอีก

---
## TC-CAM-010111 — ปุ่ม Print บนหน้า list เรียกการพิมพ์ของเบราว์เซอร์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` บน desktop viewport
**Steps**
1. แทนที่ `window.print` ด้วยฟังก์ชันที่บันทึกว่าถูกเรียก (init script ก่อนโหลดหน้า)
2. กดปุ่ม Print บนแถบหัว
3. อ่านค่าที่บันทึกไว้
**Expected**
`window.print` ถูกเรียก **1 ครั้งพอดี** (`DocumentListActions` เรียก `globalThis.print()` ตรง ๆ ไม่ผ่าน service ใด); URL ไม่เปลี่ยนและไม่มีคำขอ HTTP ใหม่ไปยัง backend; **ห้ามทดสอบโดยไม่ stub** — native print dialog ทำให้เทสค้างจนหมด timeout

---
## TC-CAM-020100 — ฟอร์มสร้างที่ `/new` แสดงชื่อ placeholder ปุ่มสองตัว และสามหมวด
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/vendor-management/request-price-list/new` (หรือกดปุ่ม New Price Request จากหน้า list)
2. อ่านหัวฟอร์มและปุ่มทั้งหมดบนหัว
3. อ่านหัวข้อของแต่ละหมวดในฟอร์ม
**Expected**
หัวฟอร์มแสดงข้อความจาง "e.g. RFP - Fresh Produce Feb 2026" (เป็น placeholder ของชื่อ ไม่ใช่ชื่อจริง) พร้อมปุ่มย้อนกลับป้าย "Go back"; ปุ่มบนหัวมีเพียงสองตัวคือ **Cancel** และ **Create** — **ไม่มีปุ่ม Delete, Activity และ Print** (ทั้งสามผูกกับ `requestPriceList` ที่ยังไม่มีในโหมดสร้าง); ฟอร์มมีสามหมวดตามลำดับ **General** (คำอธิบาย "Template and the effective request period."), **Vendors**, **Custom message to vendors**; ช่อง Name และ Template มีเครื่องหมาย `*` สีแดง ส่วน Start Date และ End Date ไม่มี

---
## TC-CAM-020101 — กด Create โดยไม่กรอกอะไร ต้องขึ้นข้อความใต้ Name และ Template
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new` โดยยังไม่กรอกช่องใดเลย
**Steps**
1. กดปุ่ม Create
2. อ่านข้อความใต้แต่ละช่องในหมวด General
3. อ่าน URL และ toast
**Expected**
ช่อง Name แสดงข้อความ **"Name is required"** และช่อง Template แสดง **"Template is required"**; ช่อง Start Date แสดง "Start Date is required" และ End Date แสดง "End Date is required" (ทั้งสี่มาจาก `createRfpSchema` ซึ่งบังคับ `min(1)` ทุกตัว); หน้าเลื่อนไปยังช่องที่ผิดตัวแรก (`scrollToFirstInvalidField`); **ไม่มีคำขอ `POST **/request-for-pricings**` ถูกยิงเลย** และ **ไม่มี toast ใด ๆ ขึ้น**; URL ยังเป็น `/vendor-management/request-price-list/new`

---
## TC-CAM-020102 — End Date ก่อน Start Date ถูกบล็อกพร้อมข้อความใต้ช่อง End Date
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`; มี price list template ที่ active อย่างน้อย 1 อัน (หมายเหตุข้อ 8)
**Steps**
1. กรอก Name และเลือก Template
2. เลือก Start Date เป็นวันที่ในอนาคต (เช่นอีก 10 วัน)
3. เปิดปฏิทิน End Date แล้ว**พิมพ์/ตั้งค่า**เป็นวันก่อน Start Date หากปฏิทินยอม (ดู `TC-CAM-020103` สำหรับกรณีที่ปฏิทินปิดกั้นไว้แล้ว)
4. กด Create
**Expected**
ข้อความ **"End date must not be before start date"** แสดงใต้ช่อง End Date (มาจาก `.refine()` ของ schema ที่ผูก path ไว้ที่ `end_date`); ไม่มี `POST` ถูกยิง; URL ยังเป็น `/new`; **ถ้าปฏิทินไม่ยอมให้เลือกวันนั้นเลย ให้บันทึกผลเป็น "ป้องกันที่ชั้น UI" แล้วข้ามไปยืนยันด้วย `TC-CAM-040104` ในโหมดแก้ไขแทน** — ห้ามแปลงเคสนี้เป็น assertion ว่า validation ไม่ทำงาน

---
## TC-CAM-020103 — ปฏิทินปิดวันที่ก่อนวันนี้ และ End Date ปิดวันก่อน Start Date
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`; เวลาเครื่องทดสอบตรงกับวันที่ปัจจุบัน
**Steps**
1. เปิดปฏิทินของ Start Date แล้วดูวันที่ของเมื่อวาน
2. เลือก Start Date เป็นอีก 7 วันข้างหน้า
3. เปิดปฏิทินของ End Date แล้วดูวันก่อนหน้า Start Date ที่เพิ่งเลือก
**Expected**
ในปฏิทิน Start Date วันที่ **ก่อนวันนี้ถูกปิด** (`fromDate={today}` โดย `today` ตั้งเวลาเป็น 00:00 — วันนี้เองจึงยังเลือกได้); ในปฏิทิน End Date วันก่อน Start Date ที่เลือกไว้ถูกปิด (`fromDate={new Date(startDate)}`); ทั้งสองช่องมี placeholder "Pick a date" ก่อนเลือก; เมื่อยังไม่ได้เลือก Start Date ปฏิทิน End Date จะปิดเฉพาะวันก่อนวันนี้เท่านั้น

---
## TC-CAM-020104 — สร้างคำขอขั้นต่ำสำเร็จแล้วเด้งไปหน้ารายละเอียดในโหมด view
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`; มี price list template ที่ active อย่างน้อย 1 อัน; ใช้ `buildEntity`/`fakeName` จาก `tests/helpers/test-data.ts` สร้างชื่อที่ไม่ซ้ำ
**Steps**
1. กรอก Name ด้วยชื่อที่สร้างจาก `fakeName`
2. เลือก Template จาก lookup
3. เลือก Start Date = วันนี้ และ End Date = อีก 14 วัน
4. **ไม่เพิ่มผู้ขายเลย** และไม่กรอก Custom message
5. กด Create แล้วรอ response
**Expected**
`POST **/request-for-pricings**` ตอบ 2xx (schema ตั้ง `vendors` เป็น `default([])` คำขอที่ยังไม่มีผู้ขายจึงบันทึกได้ตามออกแบบ — **ไม่ใช่เคสลบ**); toast สีเขียวข้อความเต็ม **"Request for Pricing created successfully"**; URL เปลี่ยนเป็น `/vendor-management/request-price-list/<uuid>` แบบ `replace` (กด Back ของเบราว์เซอร์แล้ว **ไม่กลับไป `/new`**); หน้าที่ได้อยู่ใน **โหมด view** — หัวฟอร์มแสดงชื่อที่เพิ่งกรอกแบบไม่จาง และปุ่มบนหัวคือ Edit / Delete / Activity / Print; หมวด Vendors แสดงกล่อง "No Vendors Yet"

---
## TC-CAM-020105 — ขีดจำกัดความยาวของ Name และ Custom message
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`
**Steps**
1. พิมพ์ข้อความยาว 150 ตัวอักษรลงในช่อง Name แล้วอ่านค่าที่ค้างอยู่
2. พิมพ์ข้อความยาว 600 ตัวอักษรลงในช่อง Custom message แล้วอ่านค่าที่ค้างอยู่
**Expected**
ค่าในช่อง Name เหลือ **100 ตัวอักษรพอดี** และค่าในช่อง Custom message เหลือ **500 ตัวอักษรพอดี** (ตัดตั้งแต่ตอนพิมพ์ด้วย `maxLength` ของ `<input>`); **ไม่มีข้อความ validation ใด ๆ ขึ้น** เพราะค่าถูกตัดก่อนถึง schema — `createRfpSchema` ไม่ได้กำหนดเพดานความยาวไว้เอง

---
## TC-CAM-020106 — Cancel ขณะฟอร์มสร้าง dirty ต้องเด้ง Discard แล้วจึงกลับ list
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`
**Steps**
1. กรอก Name อะไรก็ได้ (ทำให้ฟอร์ม dirty)
2. กดปุ่ม Cancel
3. กด "Keep editing" ในกล่องที่ขึ้นมา
4. กด Cancel อีกครั้ง แล้วกด "Discard"
**Expected**
กล่องเตือนชนิด `alertdialog` ขึ้นมา หัวข้อ **"Discard changes?"** คำอธิบาย "You have unsaved changes that will be lost." พร้อมปุ่ม **"Keep editing"** และ **"Discard"**; กด Keep editing แล้วกล่องปิดและ **ยังอยู่ที่ `/new` โดยค่าที่กรอกยังอยู่ครบ**; กด Discard แล้ว URL กลับเป็น `/vendor-management/request-price-list`; ถ้าฟอร์มยังไม่ dirty เลย กด Cancel จะกลับ list ทันทีโดยไม่มีกล่อง

---
## TC-CAM-020107 — กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new` และกรอก Name ไว้แล้ว (ฟอร์ม dirty)
**Steps**
1. กดลิงก์เมนูอื่นใน sidebar (เช่นหน้า Vendor)
2. อ่านกล่องที่ขึ้นมาแล้วกด "Keep editing"
3. กดลิงก์เดิมอีกครั้ง แล้วกด "Discard"
**Expected**
กล่องเตือนชนิดเดียวกับ `TC-CAM-020106` ขึ้นมา **ก่อนที่หน้าจะเปลี่ยน** (`useNavigationGuard` ผ่าน `useEntityForm`); กด Keep editing แล้ว URL **ยังเป็น `/new`** และค่าที่กรอกยังอยู่; กด Discard แล้วไปยังหน้าปลายทางที่กดจริง ๆ **ไม่ใช่กลับหน้า list ของโมดูลนี้**

---
## TC-CAM-020108 — Lookup เลือก template ค้นหาฝั่ง server และมีเฉพาะ template ที่ active
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`; BU มี price list template ทั้งที่ `status === "active"` และที่ไม่ active อย่างน้อยอย่างละ 1 อัน และรู้ชื่อทั้งสอง
**Steps**
1. ตรวจว่ามีคำขอ HTTP ไปยัง endpoint ของ price list template หรือยัง **ก่อน** เปิด lookup
2. เปิด lookup ของช่อง Template
3. พิมพ์บางส่วนของชื่อ template ที่ active ลงช่องค้นหาในนั้น
4. เลือกรายการที่ได้
**Expected**
ก่อนเปิด lookup **ไม่มีคำขอไป endpoint ของ template เลย** (โหลดแบบ lazy — ยิงเมื่อเปิดครั้งแรกหรือเมื่อมีค่าที่ต้อง resolve); หลังเปิด รายการที่ปรากฏ **มีเฉพาะ template ที่ `status === "active"`** — ชื่อของตัวที่ไม่ active ไม่อยู่ในรายการแม้จะค้นหาตรงตัว; การพิมพ์ค้นหายิงคำขอใหม่ไปยัง server พร้อมคำค้น (ไม่ได้กรองในเครื่อง); เมื่อเลือกแล้วปุ่ม lookup แสดงชื่อ template นั้นและข้อความ "Template is required" (ถ้ามี) หายไป; placeholder ก่อนเลือกคือ "Select Template"

---
## TC-CAM-030100 — หน้ารายละเอียดเปิดมาในโหมด view — ทุกช่องเป็นข้อความ แก้ไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีคำขอที่รู้ id และรู้ค่าของ Name / Template / Start Date / End Date / Custom message
**Steps**
1. ไปที่ `/vendor-management/request-price-list/<id>` โดยตรง
2. อ่านหัวฟอร์มและปุ่มทั้งหมดบนหัว
3. อ่านค่าที่แสดงในหมวด General และ Custom message
4. ตรวจหมวด Vendors
**Expected**
หัวฟอร์มแสดง **ชื่อจริงของคำขอ** (ไม่ใช่ข้อความจาง); ปุ่มบนหัวคือ **Edit, Delete, Activity, Print** ครบสี่ปุ่ม และ **ไม่มีปุ่ม Cancel / Save**; ค่าในหมวด General แสดงเป็นข้อความอ่านอย่างเดียว — **ไม่มี `<input>` หรือปุ่ม lookup ของ Template อยู่ใน DOM** (สาขา `isView` ใช้ `FieldPlainText`); Custom message แสดงเป็นข้อความที่คงการขึ้นบรรทัดเดิม; หมวด Vendors **ไม่มีปุ่ม "Add Vendor" บนหัวหมวด** และแต่ละแถวในตารางผู้ขาย **ไม่มีปุ่มถังขยะ** (ทั้งคู่ผูกกับ `!isDisabled`)

---
## TC-CAM-030101 — deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Price list request not found
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/vendor-management/request-price-list/00000000-0000-0000-0000-000000000000` โดยตรง
2. รอจนสถานะโหลดจบ
3. อ่านข้อความและปุ่มบนหน้า
**Expected**
ระหว่างโหลดแสดง skeleton ของฟอร์ม จากนั้นแสดงกล่องแจ้งข้อผิดพลาดที่มีข้อความ **"Price list request not found"** (ข้อความเฉพาะของโมดูลนี้ ไม่ใช่ "We couldn't find what you were looking for." กลาง ๆ); มีปุ่มพากลับไปที่ `/vendor-management/request-price-list` และกดแล้วไปถึงจริง; **ไม่มีฟอร์มและไม่มีปุ่ม Edit/Delete แสดงอยู่**

---
## TC-CAM-030102 — ปุ่ม Activity เปิดแผงประวัติของคำขอใบนี้ได้ทั้งสองโหมด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอที่ **เคยถูกแก้ไขอย่างน้อยหนึ่งครั้ง**
**Steps**
1. ในโหมด view กดปุ่ม Activity
2. อ่านหัวข้อและเนื้อหาในแผงที่เปิดมา
3. ปิดแผง กด Edit เข้าโหมดแก้ไข แล้วกด Activity อีกครั้ง
**Expected**
แผงเปิดจากด้านข้างพร้อมหัวข้อ **"Activity"** และคำอธิบาย "Everything done to this record, newest first"; รายการในแผงเป็นของคำขอใบนี้ (ชื่อบนแผงตรงกับชื่อคำขอ) และถ้ายังไม่มีประวัติจะแสดง "No activity recorded yet" แทนกล่องว่าง; **ปุ่ม Activity แสดงและกดได้ทั้งในโหมด view และโหมด edit** (ปุ่มนี้อยู่นอกเงื่อนไขโหมดโดยตั้งใจ — การดูไม่ใช่การแก้)

---
## TC-CAM-030103 — คอลัมน์ Status ของผู้ขายแสดง submitted / pending ตามที่ส่งกลับมา
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีคำขอที่มีผู้ขายอย่างน้อย 2 ราย โดยอย่างน้อย 1 รายมี `has_submitted = true` และอีกรายเป็น `false` (เตรียมข้อมูลจากฝั่ง backend หรือใช้ route interception ตอบ payload ที่คุมได้)
**Steps**
1. เปิดหน้ารายละเอียดของคำขอใบนั้นในโหมด view
2. อ่านคอลัมน์ Status ของทุกแถวในตารางผู้ขาย
3. เข้าโหมด Edit แล้วเพิ่มผู้ขายรายใหม่หนึ่งราย (ยังไม่ Save) แล้วอ่านคอลัมน์ Status ของแถวใหม่
**Expected**
แถวของผู้ขายที่ส่งราคาแล้วแสดง badge ข้อความ **"submitted"** พร้อมไอคอนถูก; แถวที่ยังไม่ส่งแสดง **"pending"** พร้อมจุดกลม; **แถวของผู้ขายที่เพิ่งเพิ่มและยังไม่ได้บันทึก แสดงเป็นขีด `—` ไม่ใช่ "pending"** (`savedVendors` หาไม่เจอเพราะยังไม่มีฝั่ง server); คอลัมน์นี้จัดกลางทั้งหัวและเซลล์

---
## TC-CAM-030104 — คอลัมน์ Price List เปิดใบราคาที่ผู้ขายส่งกลับในแท็บใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีคำขอที่มีผู้ขายอย่างน้อย 1 รายซึ่ง **ส่งราคากลับมาแล้วและมีใบราคาผูกอยู่** (`vendor.pricelist` ไม่เป็น null) และอีกอย่างน้อย 1 รายที่ยังไม่มี
**Steps**
1. เปิดหน้ารายละเอียดของคำขอใบนั้น
2. อ่านคอลัมน์ Price List ของทั้งสองแถว
3. คลิกค่าในแถวที่มีใบราคา แล้วดูแท็บที่เปิดขึ้นมา
**Expected**
แถวที่ยังไม่มีใบราคาแสดงขีด `—`; แถวที่มีแสดง **เลขที่ใบราคา (`pricelist.no`)** เป็นปุ่มสไตล์ลิงก์พร้อม tooltip "View submitted pricelist"; คลิกแล้วเปิด **แท็บใหม่** (ไม่ใช่ navigate ในแท็บเดิม) ที่ URL `/vendor-management/price-list/<pricelist id>` และ **แท็บเดิมยังอยู่ที่หน้ารายละเอียดคำขอ**; เคสนี้ไม่ตรวจเนื้อหาของหน้าปลายทาง (เป็นขอบเขตของ `159-pl-gap.md` — ดูหมายเหตุข้อ 4)

---
## TC-CAM-030105 — ปุ่มคัดลอก / เปิดลิงก์ผู้ขาย มีเฉพาะแถวที่มี url token และได้ค่าที่ถูก
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีคำขอที่บันทึกแล้วและมีผู้ขายที่ backend ออก `url_token` ให้แล้วอย่างน้อย 1 ราย; เปิดสิทธิ์อ่าน clipboard ให้ browser context
**Steps**
1. เปิดหน้ารายละเอียดของคำขอใบนั้น (โหมด view)
2. อ่านปุ่มทั้งหมดในคอลัมน์ท้ายแถวของผู้ขายรายนั้น
3. กดปุ่ม "Copy vendor URL" แล้วอ่านค่าใน clipboard และไอคอนบนปุ่ม
4. เข้าโหมด Edit เพิ่มผู้ขายรายใหม่ (ยังไม่ Save) แล้วอ่านปุ่มในแถวใหม่
**Expected**
แถวที่มี token มีปุ่มสามตัวในโหมด view: **Copy vendor URL**, **Open vendor URL**, **Email the link to this vendor** (aria-label ตามนี้); ค่าที่คัดลอกได้คือ **`<origin ของหน้าเว็บ>/pl/<url_token>`** เป๊ะ ๆ; ไอคอนบนปุ่มคัดลอกเปลี่ยนเป็นเครื่องหมายถูกประมาณ 2 วินาทีแล้วกลับเป็นไอคอนคัดลอก; **แถวของผู้ขายที่เพิ่งเพิ่มและยังไม่บันทึก ไม่มีปุ่ม Copy และ Open** (ผูกกับการมี `url_token`) แต่ **ยังมีปุ่มซองจดหมายเสมอ**

---
## TC-CAM-030106 — ปุ่ม Print บนหน้ารายละเอียดมีเฉพาะโหมด view และยิงคำขอพิมพ์เอกสาร RFP
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอที่มีชื่อ
**Steps**
1. ในโหมด view ตรวจว่ามีปุ่ม Print หรือไม่
2. ดักคำขอ HTTP ที่ออกไปยัง report service แล้วกดปุ่ม Print
3. กด Edit เข้าโหมดแก้ไข แล้วตรวจปุ่ม Print อีกครั้ง
**Expected**
ในโหมด view มีปุ่ม **Print** และกดแล้วเกิดคำขอไปยัง report service พร้อม document type `RFP` และ `documentId` เป็น id ของคำขอใบนี้ (ต่างจากปุ่ม Print บนหน้า list ที่เรียก `window.print` ตรง ๆ — ดู `TC-CAM-010111`); ระหว่างกำลังพิมพ์ปุ่มถูก disable; **ในโหมดแก้ไขปุ่ม Print หายไปจากแถบหัว** (ผูกกับ `isView && requestPriceList?.id`)

---
## TC-CAM-040100 — กด Edit แล้วหน้าเดิมพลิกเป็นโหมดแก้ไขครบทุกส่วน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอที่มีผู้ขายอย่างน้อย 1 ราย ในโหมด view
**Steps**
1. กดปุ่ม Edit
2. อ่านปุ่มบนแถบหัว
3. อ่านหมวด General และหมวด Vendors
4. ตรวจ URL
**Expected**
**URL ไม่เปลี่ยน** (ยังเป็น `/vendor-management/request-price-list/<id>` — โหมดเป็น state ในหน้า ไม่ใช่เส้นทาง); ปุ่มบนหัวเปลี่ยนเป็น **Cancel** และ **Save** (พร้อม Delete และ Activity ที่ยังอยู่) และปุ่ม Print หายไป; ช่อง Name กลับเป็น `<input id="rfp-name">` ที่มีค่าปัจจุบัน, Template กลับเป็นปุ่ม lookup, Start/End Date กลับเป็นปุ่มปฏิทิน; หมวด Vendors มีปุ่ม **"Add Vendor"** บนหัวหมวด และทุกแถวผู้ขายมีปุ่มถังขยะ

---
## TC-CAM-040101 — แก้ชื่อแล้ว Save สำเร็จ กลับโหมด view และส่ง doc_version ไปด้วย
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีคำขอที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (สร้างในเคสก่อนหน้าของ `test.describe.serial` เดียวกัน — ดูหมายเหตุข้อ 13); อยู่ที่หน้ารายละเอียดของใบนั้นในโหมด view
**Steps**
1. กด Edit
2. แก้ค่าในช่อง Name เป็นชื่อใหม่ที่ไม่ซ้ำ (จาก `fakeName`)
3. ดักคำขอ `PATCH **/request-for-pricings**` แล้วกด Save
4. รอ response แล้วอ่านหน้าจอ
5. รีโหลดหน้า
**Expected**
คำขอที่ยิงออกไปเป็น **`PATCH`** และ payload มีฟิลด์ **`doc_version`** ติดไปด้วย (optimistic concurrency — ขาดตัวนี้ backend ตอบ 400); response 2xx; toast สีเขียวข้อความเต็ม **"Request for Pricing updated successfully"**; หน้ากลับเป็นโหมด view เอง (ปุ่มเป็น Edit/Delete/Activity/Print อีกครั้ง) โดย **ไม่เด้งกลับหน้า list**; ชื่อบนหัวฟอร์มและค่าในช่อง Name เป็นชื่อใหม่; หลังรีโหลด ชื่อใหม่ยังอยู่

---
## TC-CAM-040102 — Cancel แล้วยืนยัน Discard ต้องคืนค่าบนหน้าจอและอยู่หน้าเดิม
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอที่รู้ชื่อเดิมแน่นอน ในโหมด view
**Steps**
1. กด Edit แล้วแก้ช่อง Name เป็นข้อความอื่น
2. กด Cancel
3. กด "Discard" ในกล่องที่ขึ้นมา
4. อ่านชื่อบนหัวฟอร์มและโหมดปัจจุบัน
**Expected**
กล่อง "Discard changes?" ขึ้นมา; หลังกด Discard **หน้ากลับเป็นโหมด view โดยไม่ออกจากหน้า** (URL เดิม ไม่ใช่กลับ list — ต่างจากการกด Discard ในโหมดสร้าง); **ค่าที่แสดงบนหน้าจอกลับเป็นชื่อเดิม ไม่ใช่ชื่อที่เพิ่งพิมพ์ทิ้งไว้** (`reset(defaultValues, { keepFieldsRef: true })` เขียนค่ากลับลง DOM จริง); ไม่มีคำขอ `PATCH` ถูกยิงเลย; กด Edit เข้าไปใหม่แล้วช่อง Name ยังเป็นค่าเดิม

---
## TC-CAM-040103 — ลบชื่อออกแล้ว Save ต้องถูกบล็อกและไม่ยิง PATCH
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอใบหนึ่ง ในโหมด view
**Steps**
1. กด Edit
2. ล้างค่าในช่อง Name จนว่าง
3. ดักคำขอ `PATCH **/request-for-pricings**` แล้วกด Save
**Expected**
ข้อความ **"Name is required"** แสดงใต้ช่อง Name; **ไม่มีคำขอ `PATCH` ถูกยิงเลย**; ไม่มี toast ใด ๆ ขึ้น; หน้ายังอยู่ในโหมดแก้ไข (ปุ่มยังเป็น Cancel/Save); หัวฟอร์มกลับไปแสดงข้อความจาง "e.g. RFP - Fresh Produce Feb 2026" เพราะ `watchedName` ว่าง

---
## TC-CAM-040104 — แก้วันที่ให้ End ก่อน Start ในโหมดแก้ไข ต้องถูกบล็อก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้ารายละเอียดของคำขอที่มี Start Date และ End Date อยู่แล้ว ในโหมด view
**Steps**
1. กด Edit
2. แก้ **Start Date ให้เป็นวันหลัง End Date เดิม** (เส้นทางนี้ปฏิทินไม่ปิดกั้น เพราะ `fromDate` ของ Start Date ผูกกับวันนี้เท่านั้น)
3. ดักคำขอ `PATCH` แล้วกด Save
**Expected**
ข้อความ **"End date must not be before start date"** แสดงใต้ช่อง **End Date** (schema ผูก path ของ refine ไว้ที่ `end_date` แม้ผู้ใช้จะเป็นคนแก้ Start Date ก็ตาม); ไม่มีคำขอ `PATCH` ถูกยิง; หน้าเลื่อนไปยังช่องที่ผิด; หน้ายังอยู่ในโหมดแก้ไข

---
## TC-CAM-050100 — หมวดผู้ขายที่ยังว่าง แสดงกล่องว่างและปุ่มเพิ่มอยู่ที่หัวหมวดเท่านั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new` (หรือหน้ารายละเอียดของคำขอที่ยังไม่มีผู้ขาย ในโหมดแก้ไข)
**Steps**
1. เลื่อนไปที่หมวด Vendors
2. อ่านหัวหมวดและเนื้อในกล่องว่าง
3. ตรวจว่ามีปุ่มกี่ปุ่มในบริเวณนี้ และอยู่ตรงไหน
**Expected**
หัวหมวดแสดงคำว่า **"Vendors"** พร้อมตัวนับ 0 และคำอธิบาย "Add vendors to this request."; ตรงกลางเป็นกล่องเส้นประที่มีหัวข้อ **"No Vendors Yet"** และคำอธิบาย "Add vendors to this request."; **ภายในกล่องเส้นประไม่มีปุ่มใด ๆ** (`RfpVendorFields` เรียก `EmptyProducts` โดยไม่ส่ง `onAdd`) — ปุ่ม **"Add Vendor"** มีอยู่ที่ **หัวหมวด** เพียงที่เดียว; ในโหมด view ปุ่มที่หัวหมวดหายไปด้วย เหลือแต่กล่องเส้นประ

---
## TC-CAM-050101 — กล่องเลือกผู้ขาย — หัวข้อ ตัวนับ และปุ่มเพิ่มที่ปิดอยู่เมื่อยังไม่เลือก
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดสร้างหรือแก้ไขของคำขอ; BU มีผู้ขายอย่างน้อย 3 ราย
**Steps**
1. กดปุ่ม "Add Vendor" ที่หัวหมวด Vendors
2. อ่านหัวข้อ คำอธิบาย และส่วนท้ายของกล่อง
3. ติ๊กผู้ขาย 2 ราย แล้วอ่านส่วนท้ายอีกครั้ง
4. กดปุ่มเพิ่ม
**Expected**
กล่องเปิดพร้อมหัวข้อ **"Add vendors"** และคำอธิบาย "Tick every vendor you want to ask for a quote — you can pick more than one at a time."; ตารางในกล่องมีคอลัมน์ ช่องติ๊ก, ลำดับที่ (#) และ Vendor (ชื่อพร้อมรหัสเป็นบรรทัดรอง); ก่อนติ๊กอะไร ส่วนท้ายแสดง **"None selected"** และปุ่มขวาเป็น **"Add 0 vendors"** ที่มี `disabled`; หลังติ๊ก 2 ราย ส่วนท้ายเป็น **"2 selected"** และปุ่มเป็น **"Add 2 vendors"** ที่กดได้; กดแล้วกล่องปิด และตารางผู้ขายบนฟอร์มมีแถวเพิ่มขึ้น 2 แถวพอดีพร้อมตัวนับที่หัวหมวดเปลี่ยนตาม

---
## TC-CAM-050102 — เลือกผู้ขายข้ามหน้าในกล่อง ตัวนับต้องรวมทุกหน้า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดสร้าง/แก้ไขของคำขอ; BU มีผู้ขายมากกว่า 10 ราย (กล่องตั้งค่า `pageSize: 10`)
**Steps**
1. เปิดกล่อง "Add vendors"
2. ติ๊กผู้ขาย 2 รายในหน้าแรก
3. กดไปหน้า 2 แล้วติ๊กอีก 1 ราย
4. อ่านตัวนับที่ส่วนท้าย
5. กลับไปหน้า 1 แล้วตรวจว่าสองรายแรกยังติ๊กอยู่ไหม
6. กดปุ่มเพิ่ม
**Expected**
ตัวนับแสดง **"3 selected"** และปุ่มเป็น **"Add 3 vendors"** ขณะอยู่หน้า 2 (รายการที่ติ๊กเก็บไว้ทั้ง object ไม่ใช่แค่ของหน้าปัจจุบัน); เมื่อกลับหน้า 1 ผู้ขายสองรายแรก **ยังถูกติ๊กอยู่**; หลังกดเพิ่ม ตารางผู้ขายบนฟอร์มได้ครบ **3 แถว** รวมรายที่อยู่คนละหน้า

---
## TC-CAM-050103 — ผู้ขายที่อยู่ในคำขอแล้วถูกติ๊กค้างและติ๊กออกไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของคำขอที่มีผู้ขายอยู่แล้วอย่างน้อย 1 ราย และรู้ชื่อรายนั้น
**Steps**
1. เปิดกล่อง "Add vendors"
2. ค้นหาชื่อผู้ขายที่อยู่ในคำขอแล้ว
3. อ่านสถานะช่องติ๊กของแถวนั้น แล้วลองคลิกเพื่อติ๊กออก
4. อ่านตัวนับที่ส่วนท้าย
**Expected**
แถวนั้น **ถูกติ๊กไว้อยู่แล้ว** และช่องติ๊กอยู่ในสถานะที่คลิกแล้วไม่เปลี่ยน (`enableRowSelection` คืน false สำหรับแถวที่อยู่ในคำขอแล้ว); ตัวนับยัง **ไม่นับ** รายนั้น — ถ้ายังไม่ได้เลือกรายอื่นเลย ตัวนับต้องเป็น "None selected" และปุ่มยัง disabled; การเอาผู้ขายออกทำได้จากปุ่มถังขยะในตารางบนฟอร์มเท่านั้น ไม่ใช่จากกล่องนี้

---
## TC-CAM-050104 — ปิดกล่องเลือกผู้ขายแล้วสถานะภายในถูกล้างทุกครั้ง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดสร้าง/แก้ไขของคำขอ; BU มีผู้ขายมากกว่า 10 ราย
**Steps**
1. เปิดกล่อง "Add vendors" พิมพ์คำค้น กดไปหน้า 2 และติ๊กผู้ขาย 1 ราย
2. กดปุ่ม Cancel ของกล่อง
3. เปิดกล่องอีกครั้ง
4. อ่านช่องค้นหา หมายเลขหน้า และตัวนับ
**Expected**
เมื่อเปิดใหม่ ช่องค้นหา **ว่าง**, ตารางกลับไปอยู่ **หน้า 1**, และตัวนับเป็น **"None selected"** พร้อมปุ่ม "Add 0 vendors" ที่ disabled (`closeAndReset` ล้างทั้งสามอย่าง); **ตารางผู้ขายบนฟอร์มไม่มีแถวเพิ่มขึ้นเลย** จากรอบที่กด Cancel; ผลเดียวกันเมื่อปิดด้วยปุ่มกากบาทหรือกด Escape

---
## TC-CAM-050105 — ค้นหาในกล่องเลือกผู้ขายไม่เจอ ต้องขึ้นข้อความเฉพาะของกล่องนี้
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดสร้าง/แก้ไขของคำขอ
**Steps**
1. เปิดกล่อง "Add vendors"
2. พิมพ์คำค้นที่ไม่มีทางตรงกับผู้ขายใด แล้วกด Enter
3. อ่านข้อความที่ขึ้นมาแทนตาราง
**Expected**
ตารางแสดงข้อความ **"No vendors match your search"** พร้อมคำอธิบาย **"Try a different name or code."** — **ไม่ใช่ข้อความกลาง "No data found"** (กล่องนี้ส่ง `EmptyComponent` ที่มี title/description ของตัวเอง); ปุ่มเพิ่มยัง disabled; ล้างคำค้นแล้วรายการกลับมา

---
## TC-CAM-050106 — ผู้ขายที่เพิ่มเข้ามาได้ผู้ติดต่อหลักเติมให้อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดสร้าง/แก้ไขของคำขอ; มีผู้ขายที่รู้แน่ชัดว่ามีผู้ติดต่อที่ `is_primary = true` พร้อมชื่อ เบอร์ และอีเมล และอีกรายที่ **ไม่มีผู้ติดต่อเลย**
**Steps**
1. เปิดกล่อง "Add vendors" แล้วเพิ่มผู้ขายทั้งสองรายพร้อมกัน
2. อ่านแถวของทั้งสองในตารางผู้ขายบนฟอร์ม
**Expected**
แถวของผู้ขายที่มีผู้ติดต่อหลัก แสดง **ชื่อผู้ติดต่อ เบอร์โทร และอีเมลของผู้ติดต่อที่ `is_primary`** โดยไม่ต้องกรอกเอง (ถ้ามีผู้ติดต่อหลายคน ต้องเป็นคนที่ `is_primary` ไม่ใช่คนแรกในรายการ); แถวของผู้ขายที่ไม่มีผู้ติดต่อ แสดง **ขีด `—`** ในสามคอลัมน์นั้น; ทั้งสองแถวแสดงชื่อผู้ขายพร้อมรหัสเป็นบรรทัดรองในคอลัมน์ Vendor; ช่องผู้ติดต่อในตารางนี้ **แก้ไม่ได้** — เป็นข้อมูลที่ดึงจาก master มาแสดงอย่างเดียว

---
## TC-CAM-050107 — ชุดคอลัมน์ของตารางผู้ขาย และเซลล์ว่างที่แสดงเป็นขีด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่คำขอที่มีผู้ขายอย่างน้อย 1 ราย ในโหมดแก้ไข
**Steps**
1. อ่านหัวตารางของหมวด Vendors จากซ้ายไปขวา
2. อ่านเซลล์ของแถวที่ข้อมูลบางช่องว่าง
**Expected**
หัวตารางคือ **#, Vendor, Contact Person, Phone, Email, Status, Price List** ตามลำดับ ตามด้วยคอลัมน์ปุ่มที่ **ไม่มีหัวข้อ**; คอลัมน์ # แสดงลำดับเริ่มที่ 1 และจัดกลาง; คอลัมน์ Status และ # จัดกลาง ส่วนคอลัมน์ปุ่มชิดขวา; ทุกเซลล์ที่ไม่มีค่าแสดงเป็น **ขีดเอียงสีจาง `—`** ไม่ใช่ช่องว่างเปล่า; ในโหมด view ข้อความในเซลล์ชิดขอบบน ในโหมดแก้ไขชิดกึ่งกลางแนวตั้ง

---
## TC-CAM-050108 — ลบผู้ขายออกจากตารางต้องยืนยันด้วยกล่องที่ระบุชื่อผู้ขาย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของคำขอที่มีผู้ขายอย่างน้อย 2 ราย และรู้ชื่อของรายที่จะลบ
**Steps**
1. กดปุ่มถังขยะ (aria-label "Remove vendor") ในแถวของผู้ขายรายนั้น
2. อ่านหัวข้อและคำอธิบายในกล่องที่ขึ้นมา แล้วกด Cancel
3. กดถังขยะอีกครั้ง แล้วกดยืนยัน
4. อ่านจำนวนแถวและตัวนับที่หัวหมวด
**Expected**
กล่องยืนยันเป็น `alertdialog` หัวข้อ **"Remove vendor"** และคำอธิบายที่**ระบุชื่อผู้ขายรายนั้นจริง ๆ** ในรูป `Are you sure you want to delete "<ชื่อผู้ขาย>"? This action cannot be undone.`; กด Cancel แล้วจำนวนแถวไม่เปลี่ยน; กดยืนยันแล้วแถวนั้นหายไปทันที ตัวนับที่หัวหมวดลดลง 1 และ **เลขลำดับ # ของแถวที่เหลือเรียงใหม่ต่อเนื่องโดยไม่ข้าม**; ณ จุดนี้ยัง **ไม่มีคำขอ HTTP ใด ๆ** — การลบจริงเกิดตอนกด Save (ดู `TC-CAM-050110`)

---
## TC-CAM-050109 — เซลล์อีเมลเป็นลิงก์ mailto ที่อ่านออกด้วยโปรแกรมอ่านหน้าจอ
**Priority:** Low · **Test Type:** Accessibility
**Preconditions**
อยู่ที่คำขอที่มีผู้ขายซึ่งมีอีเมลผู้ติดต่ออย่างน้อย 1 ราย
**Steps**
1. อ่าน element ของเซลล์ Email ในแถวนั้น
2. อ่านแอตทริบิวต์ `href`, `title` และ `aria-label`
3. อ่านเซลล์ Email ของแถวที่ไม่มีอีเมล
**Expected**
เซลล์ที่มีอีเมลเป็น `<a>` ที่ `href="mailto:<อีเมล>"` พร้อม `title` และ `aria-label` เป็น **`Send email to <อีเมล>`**; ข้อความที่แสดงคืออีเมลเอง (ตัดท้ายด้วย ellipsis เมื่อยาวเกินคอลัมน์ แต่ค่าใน `href` ต้องเต็ม); เซลล์ที่ไม่มีอีเมลเป็นขีด `—` และ **ไม่มี `<a>` อยู่ใน DOM**

---
## TC-CAM-050110 — เพิ่มผู้ขายแล้ว Save ต้องส่งเฉพาะรายที่เพิ่มและคงอยู่หลังโหลดใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีคำขอที่สร้างไว้สำหรับเทสนี้ (อยู่ใน `test.describe.serial` เดียวกับเคสสร้าง) ซึ่งมีผู้ขายอยู่แล้ว 1 ราย; BU มีผู้ขายรายอื่นที่ยังไม่อยู่ในคำขอ
**Steps**
1. เปิดหน้ารายละเอียด กด Edit
2. เพิ่มผู้ขายใหม่ 1 ราย
3. ลบผู้ขายเดิม 1 ราย
4. ดักคำขอ `PATCH **/request-for-pricings**` แล้วกด Save
5. อ่าน payload ที่ส่งไป แล้วรีโหลดหน้า
**Expected**
payload มี `vendors.add` **เฉพาะรายที่เพิ่งเพิ่ม** (พร้อม `sequence_no` ต่อจากจำนวนรายที่ยังอยู่) และ `vendors.remove` **เฉพาะรายที่เพิ่งลบ** — **ไม่ส่งรายที่ไม่ได้แตะเลย**; toast "Request for Pricing updated successfully"; หลังรีโหลด ตารางผู้ขายมีรายใหม่และไม่มีรายที่ลบไป; **กด Save ซ้ำอีกครั้งทันทีโดยไม่แก้อะไร ต้องไม่สร้างผู้ขายซ้ำ** (ฟอร์ม re-sync id จริงจาก server หลัง save — ถ้าเกิดแถวซ้ำแปลว่าการ re-sync พัง)

---
## TC-CAM-050111 — ลบผู้ขายที่บันทึกแล้วและเพิ่มคนเดิมกลับในรอบเดียวกัน ลิงก์เดิมต้องไม่เปลี่ยน
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
มีคำขอที่มีผู้ขายซึ่ง backend ออก `url_token` ให้แล้ว; จดค่า `url_token` (หรือค่าที่ได้จากปุ่มคัดลอก) ไว้ก่อน
**Steps**
1. กด Edit แล้วลบผู้ขายรายนั้นออกจากตาราง
2. **ยังไม่ Save** — เปิดกล่อง "Add vendors" แล้วเพิ่มผู้ขายรายเดิมกลับเข้ามา
3. ดักคำขอ `PATCH` แล้วกด Save
4. อ่าน payload แล้วรีโหลดหน้า แล้วอ่านค่าจากปุ่มคัดลอกลิงก์อีกครั้ง
**Expected**
payload **ไม่มีทั้ง `vendors.add` และ `vendors.remove` สำหรับผู้ขายรายนั้น** (ฟอร์มคืนแถวเดิมพร้อม id เดิม ไม่ได้สร้างแถวใหม่ — `handleAddVendors` อ่านจาก `savedVendors` ก่อน); หลังรีโหลด ผู้ขายรายนั้นยังอยู่และ **ลิงก์ที่คัดลอกได้เหมือนเดิมทุกตัวอักษร**; สถานะ submitted/pending และใบราคาที่เคยผูกไว้ยังอยู่ครบ — นี่คือเหตุผลทั้งหมดของพฤติกรรมนี้: ลิงก์ที่ส่งให้ผู้ขายไปแล้วต้องใช้ได้ต่อ

---
## TC-CAM-060100 — กล่องส่งอีเมลเปิดมาพร้อมผู้รับ หัวเรื่อง และเนื้อความตั้งต้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
BU มี email profile ที่ `enabled` อย่างน้อย 1 อัน (หมายเหตุข้อ 10); มีคำขอที่บันทึกแล้วชื่อ `<ชื่อคำขอ>` และมีผู้ขายที่มีอีเมลผู้ติดต่อ
**Steps**
1. เปิดหน้ารายละเอียดของคำขอใบนั้น
2. กดปุ่มซองจดหมาย (aria-label "Email the link to this vendor") ในแถวของผู้ขายรายนั้น
3. อ่านหัวข้อ คำอธิบาย และทุกช่องในกล่อง
**Expected**
กล่องเปิดพร้อมหัวข้อ **"Send price list request to vendor"** และคำอธิบายในรูป `Email <ชื่อผู้ขาย> the link to submit their price list for <ชื่อคำขอ>.`; ช่อง **To** มี chip ของอีเมลผู้ติดต่อรายนั้นอยู่แล้ว 1 ใบ; ช่อง **Subject** มีค่า **`Request for price list: <ชื่อคำขอ>`** (เมื่อ BU ยังไม่ได้ตั้ง email template ชนิด `rfp` ไว้); ช่อง Message มีตัวแก้ไขข้อความที่มีเนื้อความตั้งต้นขึ้นต้นด้วย `Dear <ชื่อผู้ขาย>,`; มีช่อง **Sender profile** ที่เลือก profile เริ่มต้นไว้แล้ว และช่อง **CC** ที่ว่าง; ส่วนท้ายมีปุ่ม **Cancel** และ **Send**

---
## TC-CAM-060101 — BU ที่ยังไม่มี email profile เปิดใช้งาน กล่องแสดงทางออกแทนฟอร์ม
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
BU ที่ **ไม่มี email profile ที่ `enabled` เลย** (หรือบังคับสถานะนี้ด้วยการ intercept response ของ endpoint email profile ให้คืนรายการว่าง)
**Steps**
1. เปิดหน้ารายละเอียดของคำขอที่มีผู้ขาย
2. กดปุ่มซองจดหมายในแถวผู้ขาย
3. อ่านทุกอย่างในกล่อง
**Expected**
กล่องแสดงไอคอนเฟือง พร้อมข้อความ **"No enabled email profile is set up for this business unit yet."** และปุ่มลิงก์ **"Go to email profile settings"** ที่ชี้ไป `/system-admin/email-profile`; **ไม่มีช่อง To / CC / Subject / Message และไม่มีปุ่ม Send ใน DOM เลย** (ทั้งฟอร์มและปุ่มส่งผูกกับ `!hasNoProfiles`); ยังมีปุ่ม Cancel ให้ปิดกล่อง; ถ้า endpoint ตอบ error แทนที่จะคืนรายการว่าง ข้อความจะเป็น **"Could not load email profiles"** แทน

---
## TC-CAM-060102 — ช่องผู้รับ — อีเมลผิดรูปแบบ อีเมลซ้ำ และการถอด chip ออก
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
กล่องส่งอีเมลเปิดอยู่ในสาขาที่มี email profile (ดู `TC-CAM-060100`)
**Steps**
1. พิมพ์ `not-an-email` ลงช่อง To แล้วกด Enter
2. ล้างช่องแล้วพิมพ์อีเมลที่เป็น chip อยู่แล้ว แล้วกด Enter
3. พิมพ์อีเมลใหม่ที่ถูกต้อง แล้วกดปุ่ม "Add" ข้างช่อง
4. กดปุ่มถอด chip ของอีเมลที่เพิ่งเพิ่ม
**Expected**
ขั้นที่ 1: ข้อความ **"Invalid email format"** ขึ้นใต้ช่อง และ **ไม่มี chip ใหม่เกิดขึ้น**; ขั้นที่ 2: ข้อความ **"Already added"** และจำนวน chip ไม่เปลี่ยน (เทียบแบบไม่สนตัวพิมพ์ใหญ่เล็ก); ขั้นที่ 3: chip ใหม่ปรากฏและข้อความผิดพลาดหายไป — **ปุ่ม "Add" ถูก disable เมื่อช่องว่าง**; ขั้นที่ 4: ปุ่มถอดมี `aria-label` เป็น **`Remove <อีเมล>`** และกดแล้ว chip นั้นหายไปเพียงใบเดียว

---
## TC-CAM-060103 — กด Send โดยไม่มีผู้รับเลย ต้องถูกบล็อกพร้อมข้อความใต้ช่อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
กล่องส่งอีเมลเปิดอยู่ในสาขาที่มี email profile
**Steps**
1. ถอด chip ผู้รับออกจนช่อง To ว่าง
2. ดักคำขอ `POST **/request-for-pricings/*/send-email**` แล้วกด Send
3. เพิ่มอีเมลกลับเข้าไป 1 ใบ
**Expected**
ข้อความ **"At least one recipient is required"** แสดงใต้ช่อง To และ `Field` ของช่องนั้นอยู่ในสถานะ invalid; **ไม่มีคำขอ `POST` ถูกยิงเลย** และกล่อง **ไม่ปิด**; เมื่อเพิ่มอีเมลกลับเข้าไป ข้อความผิดพลาดหายไปทันทีโดยไม่ต้องกด Send ซ้ำ

---
## TC-CAM-060104 — กด Send โดยหัวเรื่องหรือเนื้อความว่าง ต้องถูกบล็อกพร้อม toast
**Priority:** High · **Test Type:** Validation
**Preconditions**
กล่องส่งอีเมลเปิดอยู่ในสาขาที่มี email profile และมี chip ผู้รับอย่างน้อย 1 ใบ
**Steps**
1. ล้างช่อง Subject จนว่าง
2. ดักคำขอ `POST **/send-email**` แล้วกด Send
3. ใส่ Subject กลับ แล้วล้างเนื้อความในตัวแก้ไขจนไม่เหลือตัวอักษร (ตัวแก้ไขอาจยังทิ้ง `<p></p>` ไว้)
4. กด Send อีกครั้ง
**Expected**
ทั้งสองครั้ง toast สีแดงข้อความเต็ม **"Subject and message cannot be empty"** ขึ้นมา, **ไม่มีคำขอ `POST` ถูกยิง** และกล่องไม่ปิด; กรณีเนื้อความ การมีแท็ก HTML ว่างเหลืออยู่ **ไม่นับว่ามีเนื้อหา** (หน้าจอแปลง HTML เป็นข้อความล้วนก่อนตรวจ — ตรงกับที่ backend บังคับ ไม่งั้นจะได้ 400 ที่ไม่บอกว่าช่องไหนว่าง)

---
## TC-CAM-060105 — สลับข้อความสำเร็จรูปทับค่าที่ยังไม่ได้แก้ แต่ไม่ทับค่าที่ผู้ใช้พิมพ์เอง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
BU มี **email template ชนิด `rfp` อย่างน้อย 2 อัน** ที่หัวเรื่องต่างกันชัดเจน และมี email profile ที่ enabled
**Steps**
1. เปิดกล่องส่งอีเมล อ่านค่าในช่อง Subject (มาจาก template เริ่มต้น)
2. สลับช่อง "Message template" เป็นอันที่สอง แล้วอ่าน Subject อีกครั้ง
3. พิมพ์ทับ Subject ด้วยข้อความของตัวเอง
4. สลับ template กลับไปอันแรก แล้วอ่าน Subject
**Expected**
ขั้นที่ 2: Subject **เปลี่ยนตาม template ที่เลือก** (และ CC ถูกเติมด้วย `default_cc` ของ template นั้นถ้ามี); ขั้นที่ 4: Subject **ยังเป็นข้อความที่ผู้ใช้พิมพ์เอง ไม่ถูกทับ**; ช่อง "Message template" จะปรากฏ **ก็ต่อเมื่อ BU มี template ชนิด `rfp` อย่างน้อย 1 อัน** — ถ้าไม่มีเลย ช่องนี้ไม่อยู่ใน DOM และ Subject ใช้ค่ามาตรฐานตาม `TC-CAM-060100`

---
## TC-CAM-060106 — เปิดกล่องส่งอีเมลจากคำขอที่ยังไม่บันทึก ปุ่ม Send ต้องปิดพร้อมบอกเหตุผล
**Priority:** High · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list/new`; BU มี email profile ที่ enabled
**Steps**
1. เพิ่มผู้ขาย 1 รายเข้าฟอร์ม **โดยยังไม่กด Create**
2. กดปุ่มซองจดหมายในแถวผู้ขายรายนั้น
3. อ่านสถานะและ tooltip ของปุ่ม Send แล้วลองกด
**Expected**
ปุ่มซองจดหมาย **มีอยู่และกดได้** แม้คำขอจะยังไม่บันทึก (ปุ่มนี้ขึ้นทุกแถวเสมอโดยตั้งใจ); กล่องเปิดได้ตามปกติ แต่ปุ่ม **Send มี `disabled`** และมี `title` เป็น **"Save the request first, then send it to vendors"**; กดแล้ว **ไม่มีคำขอ `POST` ใด ๆ ออกไป** และไม่มี toast; ช่อง Message ในกรณีนี้ไม่มีลิงก์พอร์ทัล (ยังไม่มี `url_token`) ซึ่งเป็นอีกเหตุผลที่ปุ่มถูกปิด

---
## TC-CAM-060107 — เนื้อความตั้งต้นมีลิงก์พอร์ทัลของผู้ขายรายนั้นอยู่จริง
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีคำขอที่บันทึกแล้วและมีผู้ขายที่ได้รับ `url_token` แล้วอย่างน้อย 2 ราย; BU มี email profile ที่ enabled; จดลิงก์ของทั้งสองรายไว้ก่อนจากปุ่มคัดลอก (`TC-CAM-030105`)
**Steps**
1. กดปุ่มซองจดหมายในแถวผู้ขายรายที่หนึ่ง แล้วอ่านเนื้อความในตัวแก้ไข
2. ปิดกล่อง แล้วกดปุ่มซองจดหมายในแถวผู้ขายรายที่สอง แล้วอ่านเนื้อความ
**Expected**
เนื้อความของแต่ละรายมี **ลิงก์ `<origin>/pl/<url_token>` ของผู้ขายรายนั้นเอง** และ **ลิงก์ของสองรายต้องไม่เหมือนกัน** (ลิงก์เป็นของเฉพาะราย ส่งรวมไม่ได้); เนื้อความยังมีชื่อผู้ขายและชื่อคำขอที่ตรงกับแถวนั้น; ตัวแก้ไขมีปุ่มแทรกตัวแปร (ป้าย "Insert variable") ที่มีรายการ `rfp_name`, `vendor_name`, `contact_person`, `bu_name`, `start_date`, `end_date`, `portal_url`

---
## TC-CAM-060108 — ส่งอีเมลสำเร็จ ได้ toast และกล่องปิด (⚠️ ส่งอีเมลจริง — ดูหมายเหตุข้อ 9)
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
**เคสนี้ส่งอีเมลออกไปข้างนอกจริง** — ต้องรันด้วย mailbox ทดสอบที่ทีมคุมได้เท่านั้น และห้ามใช้อีเมลจริงของผู้ขายใน master data; BU มี email profile ที่ enabled และคำขอถูกบันทึกแล้ว
**Steps**
1. เปิดกล่องส่งอีเมลจากแถวผู้ขายรายหนึ่ง
2. ถอด chip ผู้รับเดิมออก แล้วใส่ที่อยู่ของ mailbox ทดสอบแทน
3. ดักคำขอ `POST **/request-for-pricings/*/send-email**` แล้วกด Send
4. อ่านสถานะปุ่มระหว่างรอ แล้วอ่านผลเมื่อ response กลับมา
**Expected**
ระหว่างรอ ปุ่มเปลี่ยนป้ายเป็น **"Sending..."** พร้อมไอคอนหมุน, ปุ่ม Cancel ถูก disable และ **กล่องปิดไม่ได้** (กด Escape หรือคลิกนอกกล่องไม่มีผล); เมื่อ response ตอบ `data.sent = true` และ `rejected` ว่าง → toast สีเขียว **"Price list request sent"** และกล่องปิดเอง; ถ้า `rejected` ไม่ว่าง → toast สีเหลือง **`Sent, but these addresses were rejected: <รายการ>`** และ **กล่องยังเปิดอยู่**; ถ้า `sent` ไม่จริง → toast สีแดง **"Could not send the price list request"** และกล่องยังเปิด; **HTTP 200 เพียงอย่างเดียวไม่ใช่เกณฑ์ผ่าน** — ต้องอ่าน `sent` และ `rejected` เสมอ

---
## TC-CAM-080100 — ลบคำขอจากหน้า list ผ่านกล่องยืนยันที่ระบุชื่อ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ใน `test.describe.serial` ที่ **สร้างคำขอของตัวเองมาก่อน** (ดูหมายเหตุข้อ 13) และรู้ชื่อใบนั้น; อยู่ที่ `/vendor-management/request-price-list` โดยค้นหาจนเห็นแถวของใบนั้น
**Steps**
1. เปิดเมนูจัดการท้ายแถวของคำขอใบนั้น แล้วกด Delete
2. อ่านหัวข้อและคำอธิบายในกล่องที่ขึ้นมา
3. ดักคำขอ `DELETE **/request-for-pricings**` แล้วกดยืนยัน
4. รอ toast แล้วค้นหาชื่อเดิมอีกครั้ง
**Expected**
กล่องยืนยันเป็น `alertdialog` หัวข้อ **"Delete Request for Pricing"** และคำอธิบาย `Are you sure you want to delete "<ชื่อคำขอ>"? This action cannot be undone.` พร้อมปุ่ม Cancel และ Delete; ระหว่างกำลังลบ ปุ่มเปลี่ยนป้ายเป็น **"Deleting..."** และกล่องปิดไม่ได้; หลังสำเร็จ toast สีเขียวข้อความเต็ม **"Request for Pricing deleted successfully"**, กล่องปิด, และการค้นชื่อเดิมได้ empty state "No data found"

---
## TC-CAM-080101 — กด Cancel ในกล่องยืนยันลบ ต้องไม่ลบอะไรเลย
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` และมีคำขออย่างน้อย 1 ใบ; จดจำนวนรวมจาก badge ที่หัวหน้าไว้ก่อน
**Steps**
1. เปิดเมนูจัดการท้ายแถวแล้วกด Delete
2. ดักคำขอ `DELETE` แล้วกด **Cancel**
3. อ่านจำนวนรวมและแถวในตาราง
**Expected**
กล่องปิดลง; **ไม่มีคำขอ `DELETE` ถูกยิงเลย**; แถวนั้นยังอยู่และ badge จำนวนรวมเท่าเดิม; ไม่มี toast ใด ๆ ขึ้น; ผลเดียวกันเมื่อปิดกล่องด้วย Escape

---
## TC-CAM-080102 — ลบคำขอจากหน้ารายละเอียดแล้วเด้งกลับ list
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ใน `test.describe.serial` ที่สร้างคำขอของตัวเองมาก่อน; อยู่ที่หน้ารายละเอียดของใบนั้น
**Steps**
1. กดปุ่ม Delete บนแถบหัว
2. อ่านกล่องยืนยันแล้วกดยืนยัน
3. รอ toast แล้วอ่าน URL
**Expected**
กล่องยืนยันเป็นชุดข้อความเดียวกับ `TC-CAM-080100` (หัวข้อ "Delete Request for Pricing" และคำอธิบายที่ระบุชื่อใบนี้); หลังสำเร็จ toast **"Request for Pricing deleted successfully"** และ **URL กลับไปที่ `/vendor-management/request-price-list`**; เปิด deep link ของ id เดิมอีกครั้งได้ข้อความ "Price list request not found" (ตาม `TC-CAM-030101`); ปุ่ม Delete มีอยู่ **ทั้งในโหมด view และโหมด edit** (ผูกกับการมี entity ไม่ใช่โหมด)

---
## TC-CAM-090100 — ไฟล์ที่ส่งออกมีแปดคอลัมน์ตามลำดับ และเคารพคำค้น/ตัวกรองปัจจุบัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขอหลายใบ โดยอย่างน้อย 2 ใบใช้ template ต่างกัน และรู้ว่าแต่ละ template มีกี่ใบ
**Steps**
1. กรองด้วย Template อันหนึ่ง (ดู `TC-CAM-100101`)
2. กด Export แล้วเก็บไฟล์ที่ดาวน์โหลดมา
3. อ่านแถวหัวของ sheet และจำนวนแถวข้อมูล
**Expected**
sheet ชื่อ **"Request Price Lists"**; แถวหัวมีแปดคอลัมน์ตามลำดับ **Name, Template, Start Date, End Date, Vendor Count, Currency, Created, Updated**; จำนวนแถวข้อมูล **เท่ากับจำนวนใบที่ตรงกับ filter ที่ตั้งไว้** ไม่ใช่ทั้ง BU และไม่ใช่แค่หน้าที่เห็น; คอลัมน์ Currency อ่านจาก currency ของ template (ว่างเมื่อ template ไม่มี); คอลัมน์ Created/Updated เป็นวันที่-เวลาตามรูปแบบของโปรไฟล์ และว่างเมื่อไม่มีข้อมูล audit; toast บอกจำนวนตรงกับจำนวนแถวในไฟล์

---
## TC-CAM-100100 — เมนู Filter มีเฉพาะสองตัวกรองในสองหมวด
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` บน desktop viewport
**Steps**
1. กดปุ่ม Filter บนแถบเครื่องมือ
2. อ่านทุกหมวดและทุกแถวในเมนูที่เปิดมา
**Expected**
เมนูมีเพียงสองแถว: **Template** ในหมวด **Document** และ **Effective Period** ในหมวด **Date** (`rfpFilterFields` ใน `rfp-component.tsx:82-109` ประกาศไว้เท่านี้); **ไม่มีแถวสำหรับ Status, Vendor, Created by หรืออะไรอื่น**; แถว Template เปิด submenu ที่เป็นรายการเลือกหลายรายการพร้อมช่องค้นหา ซึ่งรายการคือ **ชื่อ price list template ทั้งหมดของ BU** (ดึงด้วย `perpage: -1`); แถว Effective Period เปิดตัวเลือกช่วงวันที่; เมนูมีปุ่มล้างทั้งหมดและปุ่มบันทึกเป็น view

---
## TC-CAM-100101 — กรองตาม Template แล้ว chip ปรากฏและตารางถูกกรอง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขอที่ใช้ template ต่างกันอย่างน้อย 2 อัน และรู้ว่าแต่ละอันมีกี่ใบ
**Steps**
1. เปิดเมนู Filter → Template แล้วเลือก template อันหนึ่ง
2. ปิดเมนู แล้วอ่าน query string, แถบ chip และตาราง
3. กดปุ่มกากบาทบน chip นั้น
**Expected**
query string มีพารามิเตอร์ `filter` ที่บรรจุ clause ของ `pricelist_template_id`; ตารางเหลือเฉพาะใบที่ใช้ template นั้น และ **ทุกแถวในคอลัมน์ Template แสดงชื่อเดียวกัน**; badge จำนวนที่หัวหน้าลดลงเป็นจำนวนที่ตรงกับตัวกรอง; แถบ chip ปรากฏขึ้นมา ขึ้นต้นด้วยคำว่า **"Filters:"** และมี chip ที่ป้ายว่า Template พร้อมปุ่มกากบาทที่มี `aria-label` ว่า `Remove Template filter`; กดกากบาทแล้วพารามิเตอร์ `filter` หายจาก URL, ตารางกลับมาครบ และแถบ chip หายไป

---
## TC-CAM-100102 — กรองตามช่วงวันเริ่มรับราคา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขอที่ `start_date` อยู่คนละเดือนกันอย่างน้อย 2 ใบ
**Steps**
1. เปิดเมนู Filter → Effective Period แล้วเลือกช่วงวันที่ที่ครอบเฉพาะใบใดใบหนึ่ง
2. ปิดเมนู แล้วอ่าน query string, chip และตาราง
**Expected**
query string มี clause ที่ผูกกับคอลัมน์ **`start_date`** (ตัวกรองนี้กรองที่วันเริ่มรับราคา ไม่ใช่วันสิ้นสุด — คอลัมน์เดียวกับที่ตารางใช้เรียง); ตารางเหลือเฉพาะใบที่วันเริ่มอยู่ในช่วง; chip แสดงค่าในรูป `<วันเริ่ม> – <วันสิ้นสุด>` ของช่วงที่เลือก; เปลี่ยนช่วงจาก chip โดยตรงได้ (คลิกที่ตัว chip เปิด popover ตัวเลือกชุดเดียวกับใน submenu) แล้วตารางอัปเดตตาม

---
## TC-CAM-100103 — chip คำค้นหาแยกจาก chip ตัวกรอง และลบได้ทีละอัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; มีคำค้นที่รู้ว่าตรงกับคำขออย่างน้อย 1 ใบ และมี template ที่ใช้กรองได้
**Steps**
1. พิมพ์คำค้นในช่องค้นหาแล้วกด Enter
2. ตั้งตัวกรอง Template หนึ่งอัน
3. อ่าน chip ทั้งหมดในแถบ
4. กดกากบาทบน chip ของคำค้นหา
**Expected**
แถบมี **สอง chip**: chip ของคำค้นที่ป้ายเป็น **`"<คำค้น>"` ในเครื่องหมายคำพูด** และ chip ของ Template; กดกากบาทบน chip คำค้นแล้ว **ช่องค้นหาถูกล้างและตารางเลิกกรองด้วยคำค้น แต่ chip ของ Template และการกรองด้วย template ยังอยู่**; chip คำค้นหาเป็น chip แบบอ่านอย่างเดียว (คลิกที่ตัวมันไม่เปิด popover ตัวเลือก ต่างจาก chip ของตัวกรอง)

---
## TC-CAM-100104 — ปุ่ม Clear ล้างทั้งตัวกรองและคำค้นในครั้งเดียว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list` โดยมีทั้งคำค้นและตัวกรอง Template ตั้งอยู่ (สถานะสุดท้ายของ `TC-CAM-100103` ขั้นที่ 3)
**Steps**
1. กดปุ่ม **Clear** ที่ท้ายแถบ chip
2. อ่าน query string, ช่องค้นหา และตาราง
**Expected**
**chip หายทั้งหมดและแถบ chip หายไปทั้งแถบ** (แถบไม่ render เมื่อไม่มี filter); **ช่องค้นหาว่าง** (ปุ่มนี้ล้าง search ด้วย ไม่ใช่แค่ filter); พารามิเตอร์ `filter` และ `search` หายจาก query string; ตารางกลับมาแสดงรายการทั้งหมดและ badge จำนวนกลับเป็นยอดรวมของ BU; ปุ่ม Clear ในเมนู Filter ให้ผลเดียวกัน

---
## TC-CAM-100105 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; ตั้งตัวกรอง Template ไว้แล้วหนึ่งอัน; ผู้ใช้มีสิทธิ์บันทึก view ส่วนตัวเป็นอย่างน้อย
**Steps**
1. กดปุ่มบันทึก view ในเมนู Filter แล้วตั้งชื่อ view ที่ไม่ซ้ำ แล้วบันทึก
2. กด Clear ล้างตัวกรองทั้งหมด
3. เปิดตัวเลือก view แล้วเลือก view ที่เพิ่งบันทึก
**Expected**
หลังบันทึก ปุ่มเลือก view แสดงชื่อ view นั้นแทนป้ายเริ่มต้น; หลัง Clear ป้ายกลับเป็นค่าเริ่มต้นและตารางไม่ถูกกรอง; หลังเลือก view กลับมา **ตัวกรอง Template ถูกตั้งกลับเหมือนเดิม** (chip กลับมาและตารางถูกกรองเท่าเดิม) และ query string มี clause ชุดเดิม; บันทึกซ้ำด้วยชื่อเดิมเป็นการเขียนทับ ไม่ใช่สร้าง view ใหม่ชื่อซ้ำ

---
## TC-CAM-100106 — การค้นหายิงเมื่อกด Enter เท่านั้น และปุ่มท้ายช่องสลับเป็นกากบาท
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/vendor-management/request-price-list`; BU มีคำขอหลายใบที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับใบหนึ่งแน่นอน
**Steps**
1. พิมพ์คำค้นลงช่องค้นหา **โดยยังไม่กด Enter** แล้วสังเกต URL, ตาราง และไอคอนของปุ่มท้ายช่อง
2. กด Enter
3. อ่าน query string และตาราง
4. กดปุ่มกากบาทท้ายช่อง
**Expected**
ขั้นที่ 1: **ยังไม่มีคำขอ HTTP ใหม่ URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม** — แต่ไอคอนปุ่มท้ายช่อง **เปลี่ยนจากแว่นขยายเป็นกากบาทตั้งแต่ตอนพิมพ์** (`aria-label` เปลี่ยนจาก "Search" เป็น "Clear search"); ขั้นที่ 2–3: ตารางโหลดใหม่เหลือเฉพาะใบที่ตรงกับคำค้น และ query string มี `search=<คำค้น>`; ขั้นที่ 4: ช่องว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาครบ **โดยไม่ต้องกด Enter ซ้ำ**; กดปุ่มแว่นขยาย (ตอนช่องว่าง) ก็ยิงค้นหาได้เช่นกัน

---
## TC-CAM-900100 — ผู้ใช้ที่ไม่มีสิทธิ์ vendor_management.view เปิดหน้านี้ไม่ได้ทั้งสามเส้นทาง
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยผู้ใช้ที่ **ไม่ใช่ admin และไม่มีสิทธิ์ `vendor_management.view` ใน BU ปัจจุบัน** (ยืนยันสิทธิ์จริงจาก profile ก่อนรัน — ถ้าบทบาทที่ใช้มีสิทธิ์อยู่ เคสนี้ตั้ง precondition ไม่ได้ ให้เปลี่ยนบทบาท ไม่ใช่ลดทอน assertion); รู้ id ของคำขอที่มีอยู่จริงใบหนึ่ง
**Steps**
1. ไปที่ `/vendor-management/request-price-list` โดยตรง
2. อ่านสิ่งที่แสดงบนหน้า
3. ทำซ้ำกับ `/vendor-management/request-price-list/new` และ `/vendor-management/request-price-list/<id>`
**Expected**
ทั้งสามเส้นทางแสดงกล่องเดียวกันที่มี `role="alert"` ประกอบด้วยไอคอนโล่ขีดฆ่า, คำนำ **"Restricted"**, หัวข้อ **"Permission Denied"**, คำอธิบาย **"You don't have permission to view this page."** และบรรทัด **"Contact your administrator to request access."** พร้อมปุ่มพาไปหน้าที่เข้าได้; **ไม่มีหัวเรื่อง "Request for Pricing" ไม่มีตาราง และไม่มีปุ่ม New Price Request บนหน้าเลย**; `/new` และ `/:id` ถูกกั้นด้วย (การจับ route ทำแบบ prefix จึงครอบเส้นทางลูกทั้งหมด); **ไม่มีคำขอ `GET **/request-for-pricings**` ออกไปจากหน้านี้**

---
## TC-CAM-900101 — BU ที่ไม่ได้ซื้อฟีเจอร์นี้ถูกบล็อกด้วยกล่อง Feature Not Licensed
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
BU ที่สัญญา **ไม่รวมฟีเจอร์ `vendor_management.request_price_list`** และการบังคับ license เปิดอยู่ (ไม่ใช่โหมด shadow) — ถ้าไม่มี BU แบบนี้ในสภาพแวดล้อมทดสอบ ให้บังคับสถานะด้วยการ intercept response ของ endpoint license; Login เป็นผู้ใช้ที่มีสิทธิ์ RBAC ครบ **รวมถึงลอง admin ด้วย**
**Steps**
1. สลับไปยัง BU นั้น
2. ไปที่ `/vendor-management/request-price-list` โดยตรง
3. อ่านสิ่งที่แสดง แล้วทำซ้ำในฐานะ admin
**Expected**
แสดงกล่อง `role="alert"` หัวข้อ **"Permission Denied"** พร้อมคำอธิบาย **"This feature is not included in your organization's subscription. Contact your administrator or sales representative to enable it."** และ **ไม่มีบรรทัด "Contact your administrator to request access."** (บรรทัดนั้นใช้เฉพาะเหตุผลด้านสิทธิ์); **admin ก็ถูกบล็อกเหมือนกัน** — license ถูกตรวจก่อน permission และไม่มีทาง bypass; ปุ่มในกล่องพาไปยังหน้าที่ BU นั้นเข้าได้จริง; ถ้าฟีเจอร์ถูกตั้งเป็น hidden (ปลดระวาง) แทนที่จะเป็น unlicensed พฤติกรรมจะต่างออกไปคือ **redirect เงียบไปหน้า landing โดยไม่มีกล่องใด ๆ**
