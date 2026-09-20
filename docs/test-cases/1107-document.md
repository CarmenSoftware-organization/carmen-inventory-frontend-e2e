# Document Management — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/document`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Document Management
**Frontend route:** `routes/system-admin/document`  •  **URL:** `/system-admin/document`
**Prefix:** `DOC`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 39

> หมายเหตุสำคัญสำหรับผู้รีวิว: แคตตาล็อกนี้ถูกสอบทานใหม่กับโค้ดจริงเมื่อ 2026-09-20 (ของเดิมเขียน 2026-06-17 และโมดูลนี้มี 22 คอมมิตหลังจากนั้น) อ่านจาก `routes/system-admin/document/*` ทั้ง 7 ไฟล์ + `components/list-filter/*`, `components/share/document-list-header.tsx`, `components/ui/data-grid/*`, `hooks/use-list-filters.ts`, `hooks/use-delete-gate.ts`, `constant/module-list.ts`, `routes/router.tsx` และ `messages/en.json`
>
> - **ไม่มีเคสไหนถูกลบ** — ทุกสิ่งที่เคสเดิม 18 ตัวทดสอบยังมีอยู่จริงในแอปปัจจุบัน แต่ **แก้เนื้อหาโดยคง ID เดิมทั้ง 18 ตัว** เพราะรายละเอียดเปลี่ยนเกือบทุกจุด
> - **เพิ่ม 21 เคสใหม่** ครอบของที่เข้ามาหลังจากนั้นและของเดิมที่ไม่มีใครครอบ
>
> **สิ่งที่ต่างจากเอกสารเดิมมากที่สุด**
>
> - **ตัวกรองไม่ได้อยู่บน toolbar แล้ว** — `251be8fc` เปลี่ยน desktop เป็น **popover สองชั้นแบบ Linear** (`ListFilterMenu`): กดปุ่ม `Filter` → ได้รายชื่อ field (ที่นี่มี field เดียวคือ **Type** ไอคอน `Tag` + chevron) → **hover หรือคลิกแถวนั้น** แล้ว submenu เด้งฝั่งขวาโชว์ `MultiSelectFilter` ที่ render ไส้ Command list ตรง ๆ (ผ่าน `FilterInlineContext`) · **มือถือยังเป็น bottom sheet เดิม** (`ListFilter`) ที่มีหัวข้อ section **"Document"** + ปุ่ม Clear / Save current filters as view / Done · เอกสารเดิมเขียนว่า "เปิด MultiSelectFilter ของ Type" ซึ่งเป็นทรงก่อน `01edd84d`
> - **หัวหน้า list ยุบไปใช้ `DocumentListHeader` ตัวเดียวทั้งแอป** (`12e095c6`) — `ModuleTileIcon` + `h1` "Document Management" + badge จำนวน + คำอธิบาย · badge **แสดงเฉพาะเมื่อ `count > 0`** (`count !== undefined && count > 0`) และเป็น `toLocaleString()`
> - **มีแถบสรุปขนาดไฟล์แนบของ BU ใหม่ทั้งชุด** (`42e22859` + `4abd5457` + `6eccd8e6` + `589bef18` + `cad9c0f6`) — `DocumentSummaryBar` เหนือ toolbar + `DocumentSummarySheet` ที่กด "View all" แล้วเปิด · ยอดนี้เป็นของ **ทั้ง BU** ไม่ขยับตาม filter/หน้าของตาราง · **โหลดพังหรือ BU ไม่มีไฟล์เลย = คืน `null` เงียบ ๆ ไม่ขึ้น error state** และ `useDocumentSummary` ตั้ง `retry: false`
> - **`ListToolbar` ของหน้านี้ใช้ `variant="row"` และ *ไม่ได้ส่ง `table`*** (`6321f678`) — ฝั่งขวาของ toolbar จึง **ไม่ถูก render เลย**: ไม่มีปุ่ม sort menu, ไม่มีปุ่ม toggle columns, ไม่มีปุ่มสลับ list/grid · การเรียงลำดับทำได้ทางเดียวคือคลิกหัวคอลัมน์
> - **ตารางมี 7 คอลัมน์ ไม่ใช่ 4** — `select` (checkbox + select-all), `#` (index ต่อเนื่องข้ามหน้า), File Name, Type, Size, Last Modified, `action` · เอกสารเดิมนับแค่ 4
> - **ปุ่มลบถูกเช็คสิทธิ์จริงแล้ว** (`65751027` + `useDeleteGate`) — prefix มาจาก route (`findRouteLeaf("/system-admin/document").permission` = `system_configuration.view`) → permission ที่ใช้คือ **`system_configuration.delete`** · ไม่มีสิทธิ์แล้วกด Delete จะได้ **Permission Denied dialog** ไม่ใช่ delete dialog · ไลเซนส์หมดอายุ (`!canWrite`) ทำให้เมนู **disabled จริง** พร้อม `title` และมาก่อนเรื่องสิทธิ์เสมอ
> - **เมนู row actions มีเมนูเดียวคือ Delete** — หน้านี้ไม่ส่ง `onEdit` และไม่ส่ง `activity` ให้ `actionColumn`
> - **ตัวกรอง Type ทำงานฝั่ง client ล้วน** — `FILE_TYPE_MATCHERS` กรอง `allDocuments` ในเบราว์เซอร์ **ไม่เคยถูกส่งเป็น backend param** (`toClause` ปล่อย passthrough) · ผลคือกรองได้เฉพาะแถวของ **หน้าปัจจุบัน** และ `totalRecords` สลับไปเป็น `documents.length` ทำให้ `pageCount` ยุบเหลือ 1 · ส่วน **คำค้น (`?search=`) เป็นฝั่ง server**
> - **ค่าบน chip เป็นคีย์ดิบ ไม่ใช่ label ของตัวเลือก** — `chipValueText` ตกมาถึง `clauseTokens` เพราะ field เป็น `control: "custom"` ที่ไม่ประกาศ `options` ให้ hook เห็น จึงได้ `xls` ไม่ใช่ `Excel / CSV` และได้ `pdf` (พิมพ์เล็ก) ไม่ใช่ `PDF`
> - **ชื่อประเภทในตัวกรองกับในคอลัมน์ Type ใช้คนละชุดคำ** — ตัวกรองเป็นสตริงฮาร์ดโค้ดใน `TYPE_OPTIONS` (`PDF` / `Excel / CSV` / `Word` / `Image` / `Text` / `Archive` / `Code`) ส่วนคอลัมน์มาจาก i18n `systemAdmin.document.*` (`PDF` / `XLS` / `Image` / `Archive` / `TXT` / `DOC` / `Code` / `File`) — อย่า assert ด้วยคำเดียวกันทั้งสองที่
> - **สถานะ filter/ค้นหา/หน้า อยู่ใน query string ทั้งหมด** (`?type=`, `?search=`, `?page=`, `?perpage=`, `?sort=`, `?sv=`) แต่เขียนด้วย **`history.replaceState`** — กด Back ของเบราว์เซอร์ **ไม่ย้อน filter**
> - **มี saved views แล้ว** (`01edd84d`) — `ViewSelector` (ป้ายเริ่มต้น "No view") + `SaveViewDialog` (ชื่อ + scope เฉพาะฉัน/ทั้ง BU)
> - **Delete dialog เป็น `AlertDialog` ของ Radix** → role คือ **`alertdialog`** ไม่ใช่ `dialog` (กับดักที่ทำให้เทสต์ค้างจนครบ timeout)
> - **toast ขนาดไฟล์เกินเป็น `toast.warning` ไม่ใช่ `toast.error`** และ **upload ไม่มี `onError` ของตัวเอง** — ตอนล้มเหลวใช้ `MutationCache.onError` กลางใน `components/providers.tsx` เป็นคนเด้ง toast
>
> **ข้อเท็จจริงที่บันทึกไว้ ไม่ได้เขียนเป็นเคส**
>
> - `accept` ของ file input คือ `".pdf,.handleUpload,.docx,.xls,.xlsx,.csv,.txt"` — โทเคน **`.handleUpload` ไม่ใช่นามสกุลไฟล์** (ร่องรอย find/replace ที่พลาด) และ **`.doc` หายไปจากรายการ** ทั้งที่ทั้งตัวกรองและคอลัมน์มีประเภท Word/DOC · TC-DOC-200002 จึง assert เฉพาะนามสกุลที่ถูกต้องจริง 6 ตัว ไม่ assert ทั้งสตริง
> - **ไม่มีการตรวจนามสกุล/ชนิดไฟล์ฝั่ง client เลย** — `handleUpload` เช็คแค่ขนาด `> 10 MB` แล้วปล่อยไฟล์ที่เหลือขึ้น backend ทั้งหมด · `accept` เป็นแค่คำใบ้ของ native picker ที่ `setInputFiles` ข้ามได้ตรง ๆ
> - **`type` filter กรองเฉพาะแถวของหน้าปัจจุบัน** และบนมือถือ sentinel ของ infinite scroll ถูกตัดทิ้งเมื่อมี filter (`grid.hasMore && selectedTypes.size === 0`) — โหลดเพิ่มจะหยุดทันทีที่เลือกประเภท
> - **`DocumentFile.presignedUrl` มีในไทป์แต่ไม่มีใครใช้** — UI ไม่มีดาวน์โหลด ไม่มีพรีวิว ไม่มีหน้า detail และไม่มีการแก้ไข
> - **checkbox เลือกแถวไม่ผูกกับ bulk action ใด ๆ** — หน้านี้ไม่มีแถบ action ของรายการที่เลือก
> - `sort` ที่เขียนลง URL ใช้ `accessorKey` ของ TanStack (`originalName`, `contentType`, `size`, `lastModified`) ไม่ใช่ชื่อฟิลด์ฝั่ง backend — TC-DOC-010013 จึง assert แค่ URL กับไอคอนทิศทาง ไม่ assert ลำดับข้อมูล
>
> **Blocker ที่คนแปลงเป็น spec ต้องรู้**
>
> - **เคสที่ต้องใช้ `setInputFiles`** (ไม่มี file chooser dialog ให้ดัก เพราะ input ถูกซ่อนด้วย `className="hidden"` และปุ่ม Upload แค่ `.click()` ใส่มัน): **TC-DOC-030001, 030002, 030003, 030004, 030005, 200001, 200003, 200004** · locator คือ `input[type="file"]` ตัวเดียวในหน้า · `setInputFiles([])` คือวิธีจำลอง "เปิด picker แล้วกดยกเลิก" (TC-DOC-200003)
> - **เคสที่ต้องใช้ `waitForEvent("download")`: ไม่มีเลย** — โมดูลนี้ไม่มีปุ่มดาวน์โหลดหรือลิงก์เปิดไฟล์ใด ๆ
> - **เคสที่ทิ้งไฟล์ค้างในระบบหลังรัน: TC-DOC-030001, 030003, 030004** — อัปโหลดสำเร็จจริงเข้า storage ของ BU **และไม่มี API ลบอัตโนมัติในเทสต์** ต้องต่อท้ายด้วยการลบผ่าน UI เอง (สายเดียวกับ TC-DOC-050002) ไม่งั้นทุกครั้งที่รันจะบวกไฟล์ขยะเข้า BLAVG และไปเพี้ยนกับยอดในแถบสรุป · **TC-DOC-030005 ไม่ทิ้งไฟล์** ถ้า abort ด้วย `page.route` ก่อนถึง backend · **TC-DOC-200001/200003/200004 ไม่ทิ้งไฟล์** เพราะถูกกันตั้งแต่ฝั่ง client
> - **ไฟล์ตัวอย่าง > 10 MB สำหรับ TC-DOC-200001** ต้องสร้างขึ้นตอนรัน (เขียน buffer ลงไฟล์ชั่วคราว) ไม่ควร commit เข้า repo
> - **เคสที่ผูกกับ role/ไลเซนส์**: TC-DOC-100002 ต้องมี user ที่ไม่มี `system_configuration.view` · TC-DOC-100003 ต้องมี user ที่ไม่ใช่ admin ของ BU **และตารางต้องมีอย่างน้อย 1 แถวให้กด** — ถ้า backend ตอบ 401/403 กับ role นั้น หน้าจะกลายเป็น `ErrorState` และเคสรันไม่ได้ ต้องยืนยัน matrix ของ role ก่อนเขียน spec
> - **TC-DOC-900004 ต้องสลับ BU** ซึ่งต้องมี user ที่เป็นสมาชิกมากกว่าหนึ่ง BU

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DOC-010001 | หน้า Document Management โหลดสำเร็จ | High | Smoke |
| TC-DOC-010002 | ปุ่ม Upload แสดงบนหัวหน้า list | High | Smoke |
| TC-DOC-010003 | ตารางแสดงคอลัมน์ครบ 7 คอลัมน์ | Medium | Functional |
| TC-DOC-010004 | ค้นหาเอกสารด้วยการกด Enter ใช้งานได้ | Medium | Smoke |
| TC-DOC-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-DOC-010006 | กรองตามประเภทไฟล์ผ่านเมนู Filter → Type | Medium | Functional |
| TC-DOC-010007 | chip ของตัวกรองแสดงและลบทีละอันได้ | Medium | Functional |
| TC-DOC-010008 | ปุ่ม Clear บนแถบ chip ล้างตัวกรองทั้งหมด | Low | Functional |
| TC-DOC-010009 | badge จำนวนข้างหัวข้อสะท้อนผลหลังกรอง | Low | Functional |
| TC-DOC-010010 | แถบสรุปขนาดไฟล์แนบของ BU แสดงเหนือ toolbar | Medium | Functional |
| TC-DOC-010011 | กด View all เปิด Sheet แจกแจงพื้นที่ตามโมดูล | Medium | Functional |
| TC-DOC-010012 | ล้างคำค้นด้วยปุ่ม X ในช่องค้นหา | Low | Functional |
| TC-DOC-010013 | คลิกหัวคอลัมน์เพื่อเรียงลำดับและเขียนลง URL | Medium | Functional |
| TC-DOC-010014 | เปลี่ยนหน้าและจำนวนแถวต่อหน้าได้ | Medium | Functional |
| TC-DOC-010015 | บันทึกตัวกรองปัจจุบันเป็น saved view | Low | Functional |
| TC-DOC-010016 | เลือกแถวและเลือกทั้งหมดด้วย checkbox | Low | Functional |
| TC-DOC-010017 | เข้าหน้า Document จากเมนู System Admin | Medium | Smoke |
| TC-DOC-030001 | upload ไฟล์ PDF สำเร็จ | High | CRUD |
| TC-DOC-030002 | ระหว่าง upload ปุ่มเปลี่ยนเป็น Uploading... และ disabled | Medium | Functional |
| TC-DOC-030003 | หลัง upload สำเร็จ ทั้งรายการและแถบสรุปถูกรีเฟรช | Medium | Functional |
| TC-DOC-030004 | file input เป็นช่องซ่อน รับไฟล์เดียว และถูกกระตุ้นด้วยปุ่ม Upload | Medium | Functional |
| TC-DOC-030005 | upload ล้มเหลวต้องเด้ง error toast และไม่มีแถวใหม่ | Medium | Negative |
| TC-DOC-050001 | เปิด delete dialog แล้ว Cancel — ไฟล์ยังอยู่ | Medium | Functional |
| TC-DOC-050002 | ลบเอกสารสำเร็จ (success toast) | High | CRUD |
| TC-DOC-050003 | หลังลบแล้วไฟล์ไม่อยู่ใน list อีก | Medium | Functional |
| TC-DOC-050004 | ระหว่างลบ ปุ่มเป็น Deleting... และปิด dialog ไม่ได้ | Medium | Functional |
| TC-DOC-050005 | หลังลบ แถบสรุปขนาดไฟล์ถูกอัปเดตตาม | Low | Functional |
| TC-DOC-050006 | เมนู row actions เปิดได้และมีเมนู Delete | Medium | Functional |
| TC-DOC-100001 | ผู้ใช้ที่ไม่ได้ login ถูก redirect ไป /login | High | Auth-guard |
| TC-DOC-100002 | ผู้ใช้ที่ไม่มีสิทธิ์ system configuration ไม่เห็นเมนู Document | High | Authorization |
| TC-DOC-100003 | ผู้ใช้ที่ไม่ใช่ admin ของ BU กด Delete ได้ Permission Denied | High | Security |
| TC-DOC-200001 | upload ไฟล์เกิน 10 MB ถูกปฏิเสธด้วย warning toast | High | Validation |
| TC-DOC-200002 | file input จำกัดชนิดไฟล์ด้วย accept allowlist | Medium | Validation |
| TC-DOC-200003 | เปิด picker แล้วไม่เลือกไฟล์ — ไม่มีอะไรเกิดขึ้น | Low | Edge Case |
| TC-DOC-200004 | หลังถูกปฏิเสธเพราะขนาดเกิน เลือกไฟล์เดิมซ้ำได้ทันที | Medium | Validation |
| TC-DOC-900001 | mobile view แสดงเป็นการ์ดและ infinite scroll | Low | Edge Case |
| TC-DOC-900002 | เลือกครบทั้ง 7 ประเภทเท่ากับไม่กรอง | Low | Edge Case |
| TC-DOC-900003 | ชื่อไฟล์ยาวถูกตัดและมี title เต็มให้ hover | Low | Edge Case |
| TC-DOC-900004 | สลับ BU แล้ว Sheet สรุปต้องไม่เด้งเปิดเอง | Low | Edge Case |

---
## TC-DOC-010001 — หน้า Document Management โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin (admin@blueledgers.com) โดย active BU เป็น BLAVG
**Steps**
1. ไปที่ `/system-admin/document`
2. รอให้หน้าโหลดเสร็จ
**Expected**
URL คงอยู่ที่ `/system-admin/document`, หัวข้อระดับ `h1` แสดงข้อความ `Document Management` พร้อมคำอธิบาย `Files kept alongside the system — upload, replace, or remove them.` และตาราง (หรือ empty state) ปรากฏภายใน 10 วินาที

---
## TC-DOC-010002 — ปุ่ม Upload แสดงบนหัวหน้า list
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin และอยู่ที่ `/system-admin/document`
**Steps**
1. ไปที่ `/system-admin/document`
2. มองหาปุ่มที่มุมขวาบนของหัวหน้า list
**Expected**
ปุ่มข้อความ `Upload` (ไอคอน upload ของ lucide) แสดงอยู่และ **ไม่ถูก disabled** ในสถานะปกติ — ปุ่มนี้ไม่ถูกกั้นด้วย permission หรือไลเซนส์ ถูก disabled เฉพาะตอน mutation กำลัง pending เท่านั้น

---
## TC-DOC-010003 — ตารางแสดงคอลัมน์ครบ 7 คอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีเอกสารอย่างน้อย 1 รายการใน BU BLAVG; เปิดหน้าด้วย viewport ขนาด desktop (กว้าง ≥ 768px)
**Steps**
1. ไปที่ `/system-admin/document`
2. ตรวจหัวตารางจากซ้ายไปขวา
3. ตรวจเซลล์ของแถวแรก
**Expected**
หัวตารางมี 7 คอลัมน์ตามลำดับ: checkbox เลือกทั้งหมด, `#`, `File Name`, `Type`, `Size`, `Last Modified` และคอลัมน์ action ที่หัวว่าง · เซลล์ `Type` แสดงไอคอนคู่กับป้ายจากชุดคำของตาราง (`PDF` / `XLS` / `Image` / `Archive` / `TXT` / `DOC` / `Code` / `File`) · `Size` ถูกฟอร์แมตด้วย `formatFileSize` (เช่น `2.4 MB`) · `#` นับต่อเนื่องข้ามหน้าตาม `page`/`perpage`

---
## TC-DOC-010004 — ค้นหาเอกสารด้วยการกด Enter ใช้งานได้
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/document` และมีเอกสารอย่างน้อย 1 รายการที่รู้ชื่อบางส่วน
**Steps**
1. ไปที่ `/system-admin/document`
2. พิมพ์คำค้นลงในช่องค้นหา (placeholder `Search...`)
3. กด Enter
**Expected**
query string ได้ `?search=<คำค้น>` และ `page` ถูกล้าง, รายการถูกโหลดใหม่ตามคำค้นโดยไม่เกิด error · การกด Enter เป็นทางเดียวที่ยิงค้นหา (พิมพ์เฉย ๆ ไม่ยิง) นอกจากกดปุ่มแว่นขยายตอนช่องยังว่าง

---
## TC-DOC-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. ไปที่ `/system-admin/document`
2. พิมพ์คำที่ไม่มีจริง เช่น `__NOPE__zzz` แล้วกด Enter
**Expected**
`EmptyComponent` ปรากฏภายใน 10 วินาที พร้อมข้อความ `No data found` และภาพประกอบโฟลเดอร์ · ไม่มีแถวข้อมูลเหลืออยู่ในตาราง

---
## TC-DOC-010006 — กรองตามประเภทไฟล์ผ่านเมนู Filter → Type
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop; มีเอกสารหลายประเภทอยู่ในหน้าแรกของรายการ
**Steps**
1. ไปที่ `/system-admin/document`
2. กดปุ่ม `Filter`
3. คลิกแถว `Type` ในเมนูที่เปิดขึ้น
4. ใน submenu ติ๊กตัวเลือก `PDF`
**Expected**
submenu แสดงช่องค้นหา `Search file type...`, รายการ `All` และตัวเลือก 7 ตัว `PDF` / `Excel / CSV` / `Word` / `Image` / `Text` / `Archive` / `Code` · เมื่อติ๊ก `PDF` แล้ว query string ได้ `?type=pdf` ทันที (ไม่ต้องกดยืนยัน), ปุ่ม `Filter` ขึ้น badge `1` และตารางเหลือเฉพาะแถวที่ `contentType` มีคำว่า `pdf`

---
## TC-DOC-010007 — chip ของตัวกรองแสดงและลบทีละอันได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop และเลือกตัวกรอง Type ไว้แล้วอย่างน้อย 1 ค่า
**Steps**
1. เลือกตัวกรอง Type = `PDF`
2. ดูแถบ chip ใต้ toolbar
3. กดปุ่ม X บน chip นั้น
**Expected**
แถบ chip ขึ้นคำนำหน้า `Filters:` และมี chip ที่ประกอบด้วยชื่อ field `Type` ตามด้วย **ค่าคีย์ดิบ** `pdf` (ไม่ใช่ label `PDF` ของตัวเลือก) · ปุ่ม X มี `aria-label` = `Remove Type filter` · เมื่อกด X แล้ว `?type=` หายจาก URL, chip หาย, badge บนปุ่ม `Filter` หาย และรายการกลับมาแสดงทุกประเภท

---
## TC-DOC-010008 — ปุ่ม Clear บนแถบ chip ล้างตัวกรองทั้งหมด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; เลือกตัวกรอง Type ไว้ตั้งแต่ 2 ค่าขึ้นไป (แต่ไม่ครบทั้ง 7)
**Steps**
1. เลือกตัวกรอง Type = `PDF` และ `Word`
2. กดลิงก์ขีดเส้นใต้ท้ายแถบ chip (ข้อความ `Clear`)
**Expected**
`?type=`, `?sv=` และ `?page=` ถูกล้างออกจาก URL, แถบ chip หายไปทั้งแถบ, badge บนปุ่ม `Filter` หาย และรายการแสดงทุกประเภทไฟล์ · หมายเหตุ: ข้อความบนปุ่มคือ `Clear` คำเดียว (i18n `common.clearAll`) ไม่ใช่ `Clear all`

---
## TC-DOC-010009 — badge จำนวนข้างหัวข้อสะท้อนผลหลังกรอง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; มีเอกสารหลายรายการและหลายประเภทในหน้าแรก
**Steps**
1. จดตัวเลขใน badge ข้างหัวข้อ `Document Management`
2. เลือกตัวกรอง Type = `Image`
3. เทียบตัวเลขใน badge ใหม่กับจำนวนแถวที่เหลือในตาราง
**Expected**
ตอนไม่มีตัวกรอง badge = จำนวนรวมทั้ง BU จาก `paginate.total` · ตอนมีตัวกรอง badge = จำนวนแถวที่เหลือบนหน้าปัจจุบันเป๊ะ ๆ (ตัวกรองทำงานฝั่ง client บนหน้าปัจจุบันเท่านั้น) · ถ้าตัวเลขเป็น 0 badge **จะไม่ถูก render เลย** (แสดงเฉพาะเมื่อ `count > 0`)

---
## TC-DOC-010010 — แถบสรุปขนาดไฟล์แนบของ BU แสดงเหนือ toolbar
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin, active BU = BLAVG และ BU นี้มีไฟล์แนบอยู่อย่างน้อย 1 ไฟล์
**Steps**
1. ไปที่ `/system-admin/document`
2. รอให้ skeleton ของแถบสรุปเปลี่ยนเป็นแถบจริง
3. อ่านเนื้อหาบนแถบจากซ้ายไปขวา
**Expected**
แถบกรอบมนอยู่ระหว่างหัวหน้า list กับ toolbar และแสดง: ขนาดรวมของทั้ง BU (ฟอร์แมต `formatFileSize` รองรับถึง TB), จำนวนไฟล์รูปแบบ `N files` / `1 file`, ข้อความย่อของ 3 อันดับแรกตามโมดูลต้นทางคั่นด้วย ` · ` และปุ่มลิงก์ `View all` พร้อม chevron · ยอดนี้ไม่ขยับตามคำค้น ตัวกรอง หรือหน้าที่เปิดอยู่

---
## TC-DOC-010011 — กด View all เปิด Sheet แจกแจงพื้นที่ตามโมดูล
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
TC-DOC-010010 ผ่านแล้ว → แถบสรุปแสดงอยู่บนหน้า
**Steps**
1. กดปุ่ม `View all` บนแถบสรุป
2. อ่านหัวเรื่องและรายการใน Sheet ที่เลื่อนออกมา
3. กด Escape เพื่อปิด
**Expected**
Sheet เปิดพร้อมหัวข้อ `Storage by module` และคำอธิบาย `Total attachment size for this business unit, grouped by the module each file came from.` · บรรทัดบนสุดคือขนาดรวม + จำนวนไฟล์ · แต่ละแถวมีชื่อโมดูลต้นทาง, ขนาด, แถบ Progress และบรรทัดล่างที่มีจำนวนไฟล์กับเปอร์เซ็นต์ทศนิยม 1 ตำแหน่ง · ไฟล์ที่อัปโหลดจากหน้านี้โดยตรง (ไม่มี `reference_type`) แสดงเป็น `Direct upload` · กด Escape แล้ว Sheet ปิดและหน้าเดิมยังอยู่ครบ

---
## TC-DOC-010012 — ล้างคำค้นด้วยปุ่ม X ในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` และค้นหาคำใดคำหนึ่งไปแล้ว (มี `?search=` ใน URL)
**Steps**
1. สังเกตปุ่มท้ายช่องค้นหาที่เปลี่ยนจากแว่นขยายเป็นกากบาท
2. กดปุ่มกากบาทนั้น (`aria-label` = `Clear search`)
**Expected**
ช่องค้นหาว่าง, `?search=` หายจาก URL, `page` ถูกล้าง และรายการกลับมาแสดงทั้งหมดของ BU

---
## TC-DOC-010013 — คลิกหัวคอลัมน์เพื่อเรียงลำดับและเขียนลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop; มีเอกสารอย่างน้อย 2 รายการ
**Steps**
1. คลิกหัวคอลัมน์ `File Name`
2. คลิกซ้ำอีกครั้ง
3. คลิกเป็นครั้งที่สาม
**Expected**
ครั้งแรกได้ `?sort=originalName:asc` พร้อมไอคอนลูกศรขึ้นบนหัวคอลัมน์, ครั้งที่สองได้ `?sort=originalName:desc` พร้อมลูกศรลง, ครั้งที่สาม `sort` ถูกล้างออกจาก URL · ทุกครั้ง `page` ถูกรีเซ็ตกลับหน้า 1 · การเรียงเป็น `manualSorting` (ยิงไป backend) — เคสนี้ตรวจ URL กับไอคอน ไม่ตรวจลำดับข้อมูลที่ได้กลับมา

---
## TC-DOC-010014 — เปลี่ยนหน้าและจำนวนแถวต่อหน้าได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop; BU มีเอกสารมากกว่า 10 รายการ (ค่า perpage เริ่มต้นคือ 10)
**Steps**
1. เลื่อนลงไปที่แถบ pagination ใต้ตาราง
2. กดปุ่มไปหน้าถัดไป
3. เปลี่ยนค่าจำนวนแถวต่อหน้าจาก dropdown
**Expected**
กดหน้าถัดไปแล้วได้ `?page=2`, คอลัมน์ `#` เริ่มนับต่อจากหน้าก่อน (เช่น 11) · เปลี่ยนจำนวนแถวแล้วได้ `?perpage=<ค่าใหม่>` และจำนวนแถวในตารางเปลี่ยนตาม

---
## TC-DOC-010015 — บันทึกตัวกรองปัจจุบันเป็น saved view
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop และเลือกตัวกรอง Type ไว้แล้ว 1 ค่า
**Steps**
1. กดปุ่ม `Filter` แล้วเลือกแถวล่างสุด `Save current filters as view`
2. กรอกชื่อ view ที่ไม่ซ้ำลงในช่อง Name
3. เลือก scope แล้วกดบันทึก
**Expected**
เมนู filter ปิดและ dialog บันทึก view เปิดขึ้น พร้อมช่องชื่อ (จำกัด 120 ตัวอักษร) และตัวเลือก scope แบบ radio (`เฉพาะฉัน` เสมอ, `ทั้งหน่วยธุรกิจ` เฉพาะผู้มีสิทธิ์ `canManageBu`) · กดบันทึกโดยเว้นชื่อว่างจะขึ้นข้อความบังคับกรอกและไม่ปิด dialog · บันทึกสำเร็จแล้ว dialog ปิด และปุ่ม ViewSelector เปลี่ยนจาก `No view` เป็นชื่อ view นั้น

---
## TC-DOC-010016 — เลือกแถวและเลือกทั้งหมดด้วย checkbox
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop; มีเอกสารอย่างน้อย 2 รายการ
**Steps**
1. ติ๊ก checkbox หน้าแถวแรก
2. ติ๊ก checkbox บนหัวตาราง
3. ติ๊กหัวตารางซ้ำเพื่อยกเลิก
**Expected**
ติ๊กแถวเดียวแล้ว checkbox แถวนั้นเป็น checked และ checkbox หัวตารางเข้าสถานะ indeterminate · ติ๊กหัวตารางแล้วทุกแถวบนหน้าปัจจุบันเป็น checked · ติ๊กซ้ำแล้วทุกแถวกลับเป็น unchecked · หน้านี้ไม่มี bulk action ผูกกับการเลือก จึงต้องไม่มีแถบเครื่องมือของรายการที่เลือกโผล่ขึ้นมา

---
## TC-DOC-010017 — เข้าหน้า Document จากเมนู System Admin
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin ที่มีสิทธิ์ `system_configuration.view` และ BU เปิดใช้ฟีเจอร์ `system_admin.document`
**Steps**
1. เปิด module launcher แล้วเลือกหมวด System Admin
2. คลิกเมนู Document
**Expected**
เมนูแสดงพร้อมไอคอน `FileCheck` และพาไปที่ `/system-admin/document`, หัวข้อ `Document Management` ปรากฏ

---
## TC-DOC-030001 — upload ไฟล์ PDF สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/document`; เตรียมไฟล์ PDF ขนาดน้อยกว่า 10 MB ที่ชื่อไม่ซ้ำกับของเดิมไว้ในเครื่อง
**Steps**
1. ส่งไฟล์เข้า `input[type="file"]` ของหน้า (`setInputFiles`)
2. รอผลการ upload
3. ค้นหาชื่อไฟล์นั้นในช่องค้นหา
**Expected**
success toast ข้อความ `Document uploaded successfully` ปรากฏ และไฟล์ใหม่ปรากฏในตารางพร้อมป้ายประเภท `PDF`, ขนาดที่ฟอร์แมตแล้ว และวันที่ตาม dateFormat ของโปรไฟล์ · **ไฟล์นี้ค้างอยู่จริงใน storage ของ BU** — ต้องลบทิ้งท้ายเทสต์

---
## TC-DOC-030002 — ระหว่าง upload ปุ่มเปลี่ยนเป็น Uploading... และ disabled
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; เตรียมไฟล์ไว้ และหน่วงคำขอ upload ให้ช้าพอสังเกตได้ (เช่น `page.route` แล้วดีเลย์ก่อน continue)
**Steps**
1. ส่งไฟล์เข้า `input[type="file"]`
2. สังเกตปุ่ม Upload ขณะ mutation ยัง pending
**Expected**
ข้อความบนปุ่มเปลี่ยนจาก `Upload` เป็น `Uploading...` และปุ่มถูก disabled จนกว่า mutation จะจบ แล้วกลับเป็น `Upload` ที่กดได้เหมือนเดิม

---
## TC-DOC-030003 — หลัง upload สำเร็จ ทั้งรายการและแถบสรุปถูกรีเฟรช
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`; BU มีไฟล์อยู่แล้วจนแถบสรุปแสดงค่าอยู่; เตรียมไฟล์ขนาดที่รู้แน่ไว้ 1 ไฟล์
**Steps**
1. จดขนาดรวมและจำนวนไฟล์บนแถบสรุป
2. ส่งไฟล์เข้า `input[type="file"]` และรอ success toast
3. อ่านแถบสรุปกับตารางอีกครั้งโดยไม่รีโหลดหน้า
**Expected**
จำนวนไฟล์บนแถบสรุปเพิ่มขึ้น 1 และขนาดรวมเพิ่มขึ้นตามไฟล์ที่เพิ่ง upload · แถวใหม่ปรากฏในตารางโดยไม่ต้อง refresh · ทั้งสองอย่างเกิดจากการ invalidate ด้วย query key prefix เดียวกัน (`documents`) · **ไฟล์นี้ค้างอยู่จริง** — ต้องลบทิ้งท้ายเทสต์

---
## TC-DOC-030004 — file input เป็นช่องซ่อน รับไฟล์เดียว และถูกกระตุ้นด้วยปุ่ม Upload
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. หา `input[type="file"]` ในหน้า
2. ตรวจว่ามันถูกซ่อนอยู่ และไม่มี attribute `multiple`
3. ส่งไฟล์สองไฟล์พร้อมกันเข้า input แล้วรอผล
**Expected**
มี `input[type="file"]` เพียงตัวเดียวในหน้าและถูกซ่อนไว้ (คลาส `hidden`) จึงต้องใช้ `setInputFiles` ไม่ใช่การคลิกเปิด picker · input ไม่มี `multiple` · เมื่อส่งหลายไฟล์ handler หยิบเฉพาะไฟล์แรก (`files?.[0]`) จึงมีแถวใหม่เพิ่มเพียงรายการเดียว · **ไฟล์ที่ขึ้นไปค้างอยู่จริง** — ต้องลบทิ้งท้ายเทสต์

---
## TC-DOC-030005 — upload ล้มเหลวต้องเด้ง error toast และไม่มีแถวใหม่
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/system-admin/document`; ตั้ง `page.route` ให้คำขอ `.../documents/upload` ตอบกลับเป็น error (เช่น 500) หรือ abort
**Steps**
1. จดจำนวนแถวในตารางและจำนวนไฟล์บนแถบสรุป
2. ส่งไฟล์เข้า `input[type="file"]`
3. รอผล
**Expected**
error toast ปรากฏ (มาจาก `MutationCache.onError` กลางของแอป ไม่ใช่ `onError` ของหน้านี้ — หน้านี้ประกาศแค่ `onSuccess`) · ไม่มี success toast · จำนวนแถวและยอดบนแถบสรุปไม่เปลี่ยน · ปุ่ม Upload กลับมากดได้ตามปกติ

---
## TC-DOC-050001 — เปิด delete dialog แล้ว Cancel — ไฟล์ยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin ของ BU (มีสิทธิ์ลบ); มีเอกสารอย่างน้อย 1 รายการ; อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop
**Steps**
1. เปิดเมนู row actions ของแถวหนึ่ง (ปุ่ม `aria-label` = `Row actions`)
2. คลิก `Delete`
3. ใน dialog กด `Cancel`
**Expected**
Dialog ที่เปิดขึ้นมี role `alertdialog` (ไม่ใช่ `dialog`) หัวข้อ `Delete Document` และคำอธิบายที่ใส่ชื่อไฟล์จริงไว้ในเครื่องหมายคำพูดพร้อมประโยค `This action cannot be undone.` · กด `Cancel` แล้ว dialog ปิด แถวเดิมยังอยู่ในตาราง และไม่มี toast ใด ๆ

---
## TC-DOC-050002 — ลบเอกสารสำเร็จ (success toast)
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินเป็น Admin ของ BU; มีเอกสารที่สร้างขึ้นในชุดทดสอบ (เช่นจาก TC-DOC-030001) เป็นเป้าหมาย; อยู่ที่ `/system-admin/document`
**Steps**
1. เปิดเมนู row actions ของเอกสารเป้าหมาย
2. คลิก `Delete`
3. ใน dialog กดปุ่มยืนยัน `Delete`
**Expected**
success toast ข้อความ `Document deleted successfully` ปรากฏภายใน 10 วินาที, dialog ปิดเอง และรายการถูกโหลดใหม่

---
## TC-DOC-050003 — หลังลบแล้วไฟล์ไม่อยู่ใน list อีก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
TC-DOC-050002 ผ่านแล้ว → เอกสารเป้าหมายถูกลบจากระบบ
**Steps**
1. ค้นหาชื่อไฟล์ที่เพิ่งลบในช่องค้นหาแล้วกด Enter
**Expected**
ไม่มีแถวของไฟล์นั้นในตาราง และ `EmptyComponent` (`No data found`) ปรากฏแทน

---
## TC-DOC-050004 — ระหว่างลบ ปุ่มเป็น Deleting... และปิด dialog ไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin ของ BU; มีเอกสารที่ลบได้; หน่วงคำขอ DELETE ให้ช้าพอสังเกตได้ด้วย `page.route`
**Steps**
1. เปิดเมนู row actions แล้วคลิก `Delete`
2. กดปุ่มยืนยัน `Delete`
3. ระหว่างที่คำขอยังค้าง ลองกด `Cancel` และกด Escape
**Expected**
ปุ่มยืนยันเปลี่ยนข้อความเป็น `Deleting...` และทั้งปุ่มยืนยันกับปุ่ม `Cancel` ถูก disabled · การกด Escape หรือคลิกนอก dialog ระหว่าง pending **ไม่ทำให้ dialog ปิด** · เมื่อคำขอจบ dialog ปิดเอง

---
## TC-DOC-050005 — หลังลบ แถบสรุปขนาดไฟล์ถูกอัปเดตตาม
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin ของ BU; แถบสรุปแสดงค่าอยู่; มีเอกสารที่ลบได้และรู้ขนาดของมัน
**Steps**
1. จดขนาดรวมและจำนวนไฟล์บนแถบสรุป
2. ลบเอกสารเป้าหมายจนได้ success toast
3. อ่านแถบสรุปอีกครั้งโดยไม่รีโหลดหน้า
**Expected**
จำนวนไฟล์ลดลง 1 และขนาดรวมลดลงตามไฟล์ที่ถูกลบ โดยไม่ต้อง refresh หน้า (query key ของสรุปใช้ prefix `documents` เดียวกับรายการจึงถูก invalidate ไปพร้อมกัน)

---
## TC-DOC-050006 — เมนู row actions เปิดได้และมีเมนู Delete
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin ของ BU; มีเอกสารอย่างน้อย 1 รายการ; viewport ขนาด desktop
**Steps**
1. กดปุ่มสามจุด (`aria-label` = `Row actions`) ท้ายแถวแรก
2. อ่านรายการเมนูที่เปิดขึ้น
**Expected**
เมนูเปิดขึ้นและมีเมนูเดียวคือ `Delete` (ไอคอนถังขยะ, สไตล์ destructive) — หน้านี้ไม่ส่ง `onEdit` และไม่ส่ง `activity` ให้ `actionColumn` จึงไม่มีเมนู Edit และไม่มีเมนู Activity ให้เห็น

---
## TC-DOC-100001 — ผู้ใช้ที่ไม่ได้ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
browser context ใหม่ที่ไม่มี token ค้างอยู่
**Steps**
1. เปิด `/system-admin/document` ตรง ๆ โดยไม่ล็อกอิน
**Expected**
ถูก redirect ไป `/login` แบบ `replace` (ไม่เหลือ entry ใน history) และไม่เห็นเนื้อหาใด ๆ ของหน้า Document

---
## TC-DOC-100002 — ผู้ใช้ที่ไม่มีสิทธิ์ system configuration ไม่เห็นเมนู Document
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วย user ที่ไม่มี permission `system_configuration.view` ใน BU ที่ใช้งานอยู่
**Steps**
1. เปิด module launcher แล้วมองหาหมวด System Admin
2. ค้นหาเมนู Document ในเมนูนำทาง
**Expected**
เมนู Document ไม่ปรากฏในรายการนำทาง (module-list ของหน้านี้ผูกกับ `PERMISSIONS.system_configuration.view`) · หมายเหตุสำหรับคนเขียน spec: route เองมีแค่ auth guard ไม่มี permission guard จึงห้าม assert ว่า deep link ถูก redirect

---
## TC-DOC-100003 — ผู้ใช้ที่ไม่ใช่ admin ของ BU กด Delete ได้ Permission Denied
**Priority:** High · **Test Type:** Security
**Preconditions**
ล็อกอินด้วย user ที่ **ไม่ใช่** admin ของ BU และไม่มี permission `system_configuration.delete`, ไลเซนส์ของ BU ยังเขียนได้อยู่, เปิด `/system-admin/document` แล้วตารางมีอย่างน้อย 1 แถว
**Steps**
1. เปิดเมนู row actions ของแถวแรก
2. คลิกเมนู `Delete`
**Expected**
เมนู `Delete` ยังคลิกได้แต่ถูกหรี่สี (`aria-disabled`) และเมื่อคลิกจะเด้ง **Permission Denied dialog** แทน delete dialog · ไม่มี delete dialog เปิดขึ้น และแถวยังอยู่ครบ

---
## TC-DOC-200001 — upload ไฟล์เกิน 10 MB ถูกปฏิเสธด้วย warning toast
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/document`; สร้างไฟล์ชั่วคราวขนาดมากกว่า 10 MB ไว้ตอนรัน (อย่า commit ไฟล์ใหญ่เข้า repo)
**Steps**
1. จดจำนวนแถวในตาราง
2. ส่งไฟล์ที่เกิน 10 MB เข้า `input[type="file"]`
3. สังเกต toast และจำนวนแถว
**Expected**
toast แบบ **warning** ข้อความ `File size exceeds 10 MB limit` ปรากฏ · **ไม่มีคำขอ upload ถูกยิงออกไปเลย** (ถูกกันตั้งแต่ฝั่ง client) · ค่าใน input ถูกรีเซ็ตเป็นว่าง · จำนวนแถวไม่เปลี่ยนและไม่มีไฟล์ค้างในระบบ

---
## TC-DOC-200002 — file input จำกัดชนิดไฟล์ด้วย accept allowlist
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. หา `input[type="file"]` ในหน้า
2. อ่านค่า attribute `accept`
**Expected**
attribute `accept` มีอยู่จริงและครอบนามสกุล `.pdf`, `.docx`, `.xls`, `.xlsx`, `.csv`, `.txt` เป็นอย่างน้อย — ใช้จำกัดชนิดไฟล์ที่ native picker เสนอให้ผู้ใช้ · ห้าม assert ว่าเป็นตัวกันการอัปโหลด: `accept` ไม่มีผลกับ `setInputFiles` และ `handleUpload` ไม่ได้ตรวจนามสกุลเลย (ดูหมายเหตุหัวเอกสารเรื่องโทเคน `.handleUpload` ที่ปนอยู่ในสตริงนี้)

---
## TC-DOC-200003 — เปิด picker แล้วไม่เลือกไฟล์ — ไม่มีอะไรเกิดขึ้น
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/system-admin/document`
**Steps**
1. จดจำนวนแถวในตาราง
2. ส่งรายการไฟล์ว่างเข้า `input[type="file"]` (`setInputFiles([])`) เพื่อจำลองการกดยกเลิกใน picker
3. รอ 2 วินาทีแล้วตรวจหน้าจอ
**Expected**
ไม่มี toast ใด ๆ ปรากฏ, ปุ่ม Upload ไม่เข้าสถานะ `Uploading...`, ไม่มีคำขอ upload ถูกยิง และจำนวนแถวเท่าเดิม (handler คืนค่าออกทันทีเมื่อ `files?.[0]` เป็น undefined)

---
## TC-DOC-200004 — หลังถูกปฏิเสธเพราะขนาดเกิน เลือกไฟล์เดิมซ้ำได้ทันที
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/document`; มีไฟล์เกิน 10 MB และไฟล์เล็กกว่า 10 MB เตรียมไว้อย่างละ 1 ไฟล์
**Steps**
1. ส่งไฟล์ที่เกิน 10 MB เข้า `input[type="file"]` จนได้ warning toast
2. ส่ง **ไฟล์เดิมตัวนั้นซ้ำ** เข้า input อีกครั้ง
3. ส่งไฟล์เล็กกว่า 10 MB เข้า input
**Expected**
ส่งซ้ำครั้งที่สองยังได้ warning toast เหมือนเดิม (ค่าใน input ถูกล้างหลังถูกปฏิเสธ event `change` จึงยิงอีกรอบได้) · เมื่อส่งไฟล์เล็กเข้าไปต่อ การ upload ทำงานปกติจนได้ success toast — สถานะไม่ค้างจากครั้งที่ถูกปฏิเสธ

---
## TC-DOC-900001 — mobile view แสดงเป็นการ์ดและ infinite scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ตั้ง viewport กว้างน้อยกว่า 768px; BU มีเอกสารมากกว่า 20 รายการ (perpage ของโหมดนี้คือ 20) และ **ไม่ได้เลือกตัวกรอง Type ไว้**
**Steps**
1. ตั้ง viewport เป็นขนาดมือถือแล้วเปิด `/system-admin/document`
2. เลื่อนลงจนสุดรายการ
3. กดปุ่ม `Filter`
**Expected**
รายการแสดงเป็นการ์ดคอลัมน์เดียว แต่ละใบมีเลขลำดับ, ไอคอนไฟล์, ชื่อไฟล์, ขนาด และวันที่แบบ locale ของเครื่อง · เลื่อนถึง sentinel แล้วโหลดหน้าถัดไปต่อท้ายพร้อม spinner · การ์ด **ไม่สามารถคลิกได้และไม่มีเมนูลบ** (โหมดมือถือไม่ส่ง `onClick` ให้ `DocumentCard`) · ปุ่ม `Filter` เปิดเป็น bottom sheet ที่มีหัวข้อ section `Document` และปุ่ม Clear / Save current filters as view / Done

---
## TC-DOC-900002 — เลือกครบทั้ง 7 ประเภทเท่ากับไม่กรอง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/system-admin/document` ด้วย viewport ขนาด desktop
**Steps**
1. กดปุ่ม `Filter` แล้วคลิกแถว `Type`
2. ติ๊กตัวเลือกทีละตัวจนครบทั้ง 7 ตัว
3. ดู URL, แถบ chip และ badge บนปุ่ม `Filter`
**Expected**
พอติ๊กตัวที่ 7 ค่าตัวกรองถูกยุบเป็นค่าว่างอัตโนมัติ (`next.length >= options.length` → `""`) · `?type=` หายจาก URL, แถบ chip หาย, badge หาย และรายการแสดงทุกประเภท — เทียบเท่ากับการเลือก `All`

---
## TC-DOC-900003 — ชื่อไฟล์ยาวถูกตัดและมี title เต็มให้ hover
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
BU มีเอกสารที่ชื่อไฟล์ยาวเกินความกว้างคอลัมน์ (upload ไฟล์ชื่อยาวขึ้นไปก่อนได้ แล้วลบทิ้งท้ายเทสต์); viewport ขนาด desktop
**Steps**
1. ไปที่ `/system-admin/document` แล้วหาแถวของไฟล์ชื่อยาว
2. ตรวจ attribute `title` ของเซลล์ชื่อไฟล์
**Expected**
ข้อความในเซลล์ถูกตัดด้วย ellipsis ตามความกว้างที่จำกัดไว้ แต่ attribute `title` ของ element นั้นเก็บชื่อไฟล์เต็มไว้ครบ

---
## TC-DOC-900004 — สลับ BU แล้ว Sheet สรุปต้องไม่เด้งเปิดเอง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ล็อกอินด้วย user ที่เป็นสมาชิกอย่างน้อย 2 BU โดย BU หนึ่งมีไฟล์แนบและอีก BU หนึ่งไม่มีไฟล์เลย
**Steps**
1. เปิด `/system-admin/document` ใน BU ที่มีไฟล์ แล้วกด `View all` จน Sheet เปิด
2. สลับไป BU ที่ไม่มีไฟล์โดยไม่ปิด Sheet
3. สลับกลับมา BU เดิม
**Expected**
ตอนสลับไป BU ที่ไม่มีไฟล์ แถบสรุปหายไปเงียบ ๆ (ไม่ขึ้น error state) และ Sheet ต้องไม่ค้างเปิดอยู่ · ตอนสลับกลับมา BU ที่มีไฟล์ แถบสรุปกลับมาแสดง แต่ **Sheet ต้องไม่เปิดขึ้นเอง** — ต้องกด `View all` ใหม่เท่านั้น

---
<sub>Authored: 2026-06-17 · Reviewed against source: 2026-09-20 · documentation only</sub>
