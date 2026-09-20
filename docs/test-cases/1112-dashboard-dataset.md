# Dashboard Dataset — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/dashboard-dataset`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Dashboard Dataset
**Frontend route:** `routes/system-admin/dashboard-dataset`  •  **URL:** `/system-admin/dashboard-dataset`
**Prefix:** `DDS`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 25

> โมดูลนี้เป็น catalog แบบอ่านอย่างเดียว (read-only) ของ dashboard dataset ที่ BU ปัจจุบันมีให้. ไม่มี create/edit/delete. รายการถูก group ตาม `category` และค้นหาได้ตาม id / name / description / category. แต่ละ DatasetCard แสดง name, badge `shape`, description, id และ unit. หัวข้อมี badge นับ total. มีสถานะ loading / error / empty (รวม empty หลัง filter).

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> - **สอบทานรอบนี้ (2026-09-20) ไม่พบเคสเดิมที่ยืนยันสิ่งที่ตรงข้ามกับโค้ด** — โมดูลมีคอมมิตเพียง 5 ครั้งตั้งแต่ 2026-06-17 และไม่มีคอมมิตไหนเปลี่ยนพฤติกรรม เคสเดิม 13 ตัวถูกเก็บ ID ไว้ทั้งหมด (แก้ถ้อยคำ/ความละเอียดของ Expected เท่านั้น) และเพิ่มใหม่ 12 ตัว
> - **หัวหน้า list ย้ายไป `DocumentListHeader` แล้ว** (คอมมิต `12e095c6`) — หน้าไม่ได้ render `<h1>` + badge เองอีกต่อไป หัวประกอบด้วย `ModuleTileIcon` + `<h1>` title + badge + `<p>` description. **badge จะ render ก็ต่อเมื่อ `count > 0` เท่านั้น** และพิมพ์ด้วย `count.toLocaleString()` (มีตัวคั่นหลักพัน)
> - **badge บนหัวคือ `data.count` จาก API ไม่ใช่จำนวนหลังกรอง** — พิมพ์คำค้นแล้วตัวเลขบน badge ไม่ขยับ (ตัวเลขที่ขยับคือ "· N" ของแต่ละ section) ดู TC-DDS-010009 อย่าเขียนเคสที่คาดว่า badge จะลดลงตามผลค้นหา
> - **ความสัมพันธ์กับหน้า `/dashboard` (ยืนยันจากฝั่ง dataset แล้ว):** หน้านี้กับ picker บน `/dashboard` กิน hook เดียวกันคือ `useDashboardDatasets()` (`GET /api/proxy/api/{bu}/dashboard-lab/datasets`) แต่ `/dashboard` ส่ง `shapes={SUPPORTED_SHAPES}` เข้า `LookupDataset` ซึ่งกรองทิ้ง dataset ที่ `shape` ไม่อยู่ในชุด `scalar | scalar_delta | time_series | categorical | ranked | table` (เช่น `matrix`) — **หน้า system-admin นี้จึงเป็น superset ของสิ่งที่เลือกขึ้น dashboard ได้** และฟิลด์ `shape` บนการ์ดคือตัวกำหนดชนิดการ์ดเริ่มต้นผ่าน `defaultWidgetTypeFor()` → `defaultRenderFor(shape, supported_renders)` (`routes/dashboard/widget-shape.ts`, `components/dashboard-widget/render-support.ts`): `scalar`/`scalar_delta`→`kpi`, `time_series`→`line`, `categorical`→`pie`, `ranked`→`bar`. ข้อเท็จจริงนี้ตรงกับที่บันทึกไว้ใน `1200-dashboard.md`
> - **`supported_renders` และ `params[]` มาพร้อม dataset แต่ไม่ถูกแสดงบนหน้านี้** — การ์ดโชว์แค่ 5 ฟิลด์ (name / shape / description / id / unit) เป็นความตั้งใจ ไม่ใช่บั๊ก อย่าเขียนเคสที่คาดว่าจะเห็น param บนการ์ด
> - **กรองทั้งหมดเกิดฝั่ง client** — `useDashboardDatasets()` ใช้ `CACHE_STATIC` (registry hardcode อยู่ใน micro-data ฝั่ง backend) ดังนั้นการพิมพ์ค้นหาไม่ยิง request ใหม่ และไม่มี debounce/ปุ่ม Search — กรองทันทีทุกตัวอักษร
> - **คำค้นถูก `trim().toLowerCase()` ก่อนกรอง แต่ empty state เช็คจากค่าดิบ `query`** — คำค้นที่มีแต่ช่องว่างจึง *ไม่กรองอะไรเลย* (ดู TC-DDS-090006); กรณีขอบที่จะเห็น empty แบบ "filtered" ทั้งที่ไม่ได้กรองจริง เกิดได้เฉพาะตอนระบบไม่มี dataset เลย + ผู้ใช้พิมพ์ช่องว่าง — ถือเป็นความไม่สอดคล้องเล็กน้อยของแอป ไม่ได้ทำให้เคสไหนเสีย จึงบันทึกไว้ที่นี่แทนการตั้งเป็นเคส
> - **รายการผูกกับ BU** — `queryKey` มี `buCode` และ query `enabled` ก็ต่อเมื่อมี `buCode` (มาจาก `useProfile()`) ช่วงที่ profile ยังไม่มา query ถูกปิดอยู่ จึง **ไม่ขึ้น spinner** แต่ตกไปที่ empty state ชั่วครู่ — อย่าเขียน assertion ที่ยืนยันว่า spinner ต้องขึ้นเสมอก่อนรายการมา
> - **ชั้นกันการเข้าถึงมีสองชั้นและคนละพฤติกรรม**: `RequireAuth` (ไม่มี token → redirect `/login`) และ `RouteGuard` ใน `routes/root-layout.tsx` ที่เช็ค **license ก่อน permission** — leaf นี้ประกาศ `licenseFeature: "dashboard.dataset"` + `permission: system_configuration.view` ใน `constant/module-list.ts` ทั้งสองกรณีแสดง `AccessDeniedBlock` (`role="alert"`) ไม่ใช่ redirect. **license ไม่มี admin bypass** ส่วน permission มี (`isAdmin` ผ่านตลอด)
> - **เมนูของ role ที่ไม่มีสิทธิ์ "ไม่ได้หายไป"** — `useVisibleModules` ตัดออกเฉพาะ node ที่ `hidden` เท่านั้น ส่วน `denied`/`locked` ยังอยู่ในเมนูแต่ถูก render เป็น `<button class="opacity-50">` (มีไอคอนกุญแจเมื่อ locked) คลิกแล้วเปิด permission-denied dialog แทนการนำทาง (`components/sidebar/side-main.tsx`) — อย่าเขียนเคสที่ยืนยันว่าเมนูหายไป
> - `LICENSE_ENFORCEMENT: true` ใน `public/config.*.json` ทุกไฟล์ (local/dev/uat/prod) — เคส license (TC-DDS-100004) จึงเป็นพฤติกรรมจริง ไม่ใช่ shadow mode
> - **ตัวเลขบนหน้า `/system-admin` landing เป็นข้อความตายตัว** — การ์ด Dashboard Dataset โชว์ "42 datasets · 6 stale" / "next refresh · 17:00" จาก i18n ไม่ได้มาจาก API อย่าเขียนเคสเทียบตัวเลขนั้นกับ badge total
> - หัวข้อ category บน section แสดงเป็นตัวพิมพ์ใหญ่ด้วย CSS `uppercase` — **ข้อความใน DOM ยังเป็นค่าดิบ** ให้ assert แบบ case-insensitive

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DDS-010001 | หน้า Dashboard Dataset โหลดสำเร็จ | High | Smoke |
| TC-DDS-010002 | badge นับ total แสดงจำนวน dataset | Medium | Functional |
| TC-DDS-010003 | dataset ถูก group ตาม category และเรียงตามตัวอักษร | High | Functional |
| TC-DDS-010004 | แต่ละ section แสดงจำนวน dataset ใน category | Low | Functional |
| TC-DDS-010005 | ค้นหาตาม name กรองรายการได้ | High | Functional |
| TC-DDS-010006 | ค้นหาตาม id / category / description ก็กรองได้ | Medium | Functional |
| TC-DDS-010007 | ค้นหาคำที่ไม่มีต้องแสดง filtered empty state | Medium | Functional |
| TC-DDS-010008 | ล้างคำค้นแล้วรายการกลับมาแสดงครบ | Low | Functional |
| TC-DDS-010009 | badge total ไม่เปลี่ยนตามคำค้น | Medium | Functional |
| TC-DDS-010010 | ค้นหากรองฝั่ง client ไม่ยิง request ใหม่ | Medium | Functional |
| TC-DDS-010011 | ช่องค้นหามี placeholder และ aria-label ตรงกัน | Low | Functional |
| TC-DDS-010012 | คำค้นที่มีช่องว่างนำ/ตามถูก trim ก่อนกรอง | Low | Functional |
| TC-DDS-010013 | รายการ dataset ผูกกับ BU ปัจจุบัน | Medium | Functional |
| TC-DDS-020001 | DatasetCard แสดง name / shape / description / id / unit | Medium | Functional |
| TC-DDS-020002 | หน้าเป็น read-only — ไม่มีปุ่ม CRUD และการ์ดไม่นำทาง | High | Functional |
| TC-DDS-090001 | สถานะ loading แสดงระหว่างโหลด | Low | Functional |
| TC-DDS-090002 | สถานะ error แสดงข้อความเมื่อโหลดล้มเหลว | Medium | Negative |
| TC-DDS-090003 | empty state เมื่อไม่มี dataset เลย | Low | Edge Case |
| TC-DDS-090004 | เข้าหน้าจากการ์ดบน System Admin landing | Medium | Happy Path |
| TC-DDS-090005 | shape บนการ์ดสอดคล้องกับ lookup บน /dashboard | Medium | Functional |
| TC-DDS-090006 | คำค้นที่มีแต่ช่องว่างไม่กรองรายการ | Low | Edge Case |
| TC-DDS-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-DDS-100002 | role ที่ไม่มีสิทธิ์เปิด URL ตรงถูกบล็อกด้วย AccessDeniedBlock | High | Authorization |
| TC-DDS-100003 | เมนูใน sidebar ของ role ที่ไม่มีสิทธิ์คลิกแล้วไม่นำทาง | Medium | Authorization |
| TC-DDS-100004 | BU ที่ไม่มี license `dashboard.dataset` ถูกบล็อกแม้เป็น Admin | Medium | Authorization |

---
## TC-DDS-010001 — หน้า Dashboard Dataset โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin (`admin@blueledgers.com`) active BU = `BLAVG` ซึ่งมี license `dashboard.dataset`
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. รอ loading หาย
**Expected**
URL คงอยู่ที่ `/system-admin/dashboard-dataset` (ไม่ถูก redirect), `<h1>` แสดง "Dashboard Dataset" พร้อมไอคอนโมดูล, คำอธิบาย "The data each dashboard widget is allowed to pull from." แสดงใต้หัวข้อ, ช่องค้นหาและรายการ dataset (หรือ empty state) ปรากฏ

---
## TC-DDS-010002 — badge นับ total แสดงจำนวน dataset
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี dataset อย่างน้อย 1 รายการใน BU ปัจจุบัน; อยู่ที่ `/system-admin/dashboard-dataset` และโหลดเสร็จแล้ว
**Steps**
1. ดู badge ถัดจากหัวข้อ "Dashboard Dataset"
**Expected**
badge แสดงค่า `count` ที่ API ส่งมา (จัดรูปแบบด้วย `toLocaleString()` เช่น `1,024`) และตัวเลขนั้นเท่ากับจำนวนการ์ด dataset ทั้งหมดบนหน้าตอนยังไม่ได้ค้นหา

---
## TC-DDS-010003 — dataset ถูก group ตาม category และเรียงตามตัวอักษร
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี dataset อย่างน้อย 2 category (เช่น `inventory`, `workflow`); อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. ดูโครงสร้างรายการหลังโหลดเสร็จ
2. เก็บลำดับหัวข้อ category ทุก section จากบนลงล่าง
**Expected**
dataset ถูกแบ่งเป็น `<section>` ตาม category, ลำดับหัวข้อเรียงตาม `localeCompare` ของชื่อ category, หัวข้อแต่ละ section เป็น `<h2>` ที่แสดงชื่อ category (ตัวพิมพ์ใหญ่มาจาก CSS `uppercase` — assert แบบ case-insensitive)

---
## TC-DDS-010004 — แต่ละ section แสดงจำนวน dataset ใน category
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี dataset หลายรายการอย่างน้อยหนึ่ง category; อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. เลือก section หนึ่ง แล้วอ่านตัวเลขข้างชื่อ category
2. นับจำนวนการ์ดใน section เดียวกัน
**Expected**
ข้างชื่อ category แสดง "· N" โดย N เท่ากับจำนวนการ์ดที่นับได้ใน section นั้นพอดี

---
## TC-DDS-010005 — ค้นหาตาม name กรองรายการได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี dataset หลายรายการ; อยู่ที่ `/system-admin/dashboard-dataset` และโหลดเสร็จแล้ว
**Steps**
1. จดชื่อ dataset หนึ่งรายการจากการ์ดที่เห็น
2. พิมพ์บางส่วนของชื่อนั้น (สลับตัวพิมพ์เล็ก/ใหญ่) ลงในช่องค้นหา
**Expected**
รายการถูกกรองทันทีเหลือเฉพาะ dataset ที่ name มีคำค้นเป็นส่วนย่อย (case-insensitive), การ์ดเป้าหมายยังอยู่, และผลลัพธ์ยังถูก group ตาม category เหมือนเดิม

---
## TC-DDS-010006 — ค้นหาตาม id / category / description ก็กรองได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; ทราบค่า id, category และ description ของ dataset หนึ่งรายการ
**Steps**
1. พิมพ์บางส่วนของ `id` ของ dataset นั้น → สังเกตผล
2. ล้างช่องค้นหา แล้วพิมพ์ชื่อ `category` → สังเกตผล
3. ล้างช่องค้นหา แล้วพิมพ์คำที่ปรากฏเฉพาะใน `description` → สังเกตผล
**Expected**
ทั้งสามรอบกรองสำเร็จและ dataset เป้าหมายยังอยู่ในผลลัพธ์ — ตัวกรองจับคู่กับ `id`, `name`, `description` และ `category` ครบทุกฟิลด์

---
## TC-DDS-010007 — ค้นหาคำที่ไม่มีต้องแสดง filtered empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มี dataset อย่างน้อย 1 รายการ
**Steps**
1. พิมพ์คำที่ไม่มีจริง เช่น `__NOPE__zzz`
**Expected**
แสดง empty state แบบ filtered — "No matching datasets" / "Try a different search term." (ไม่ใช่ "No datasets available"), ไม่มีการ์ด dataset เหลือ, แต่ badge total ยังแสดงค่าเดิม

---
## TC-DDS-010008 — ล้างคำค้นแล้วรายการกลับมาแสดงครบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มีคำค้นที่กรองรายการอยู่แล้ว
**Steps**
1. นับจำนวนการ์ดก่อนค้นหา (หรืออ่านจาก badge total)
2. ลบข้อความในช่องค้นหาจนว่าง
**Expected**
รายการ dataset ทั้งหมดกลับมาแสดง group ตาม category ตามเดิม และจำนวนการ์ดรวมเท่ากับก่อนค้นหา

---
## TC-DDS-010009 — badge total ไม่เปลี่ยนตามคำค้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มี dataset มากกว่า 1 รายการและโหลดเสร็จแล้ว
**Steps**
1. อ่านค่า badge ข้างหัวข้อ
2. พิมพ์คำค้นที่ทำให้เหลือผลลัพธ์น้อยกว่าเดิม
3. อ่านค่า badge อีกครั้ง และอ่าน "· N" ของ section ที่เหลือ
**Expected**
ค่าบน badge เท่าเดิมทั้งก่อนและหลังค้นหา (มาจาก `data.count` ของ API) ขณะที่ "· N" ของแต่ละ section ลดลงตามผลกรอง

---
## TC-DDS-010010 — ค้นหากรองฝั่ง client ไม่ยิง request ใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset` และโหลดรายการเสร็จแล้ว; เตรียมดักเครือข่ายที่ `**/dashboard-lab/datasets`
**Steps**
1. เริ่มนับ request ที่ยิงไป `/api/proxy/api/{bu}/dashboard-lab/datasets`
2. พิมพ์คำค้นทีละตัวอักษรอย่างน้อย 4 ตัว
3. ลบคำค้นจนว่าง
**Expected**
รายการถูกกรองทันทีทุกตัวอักษร (ไม่มี debounce, ไม่มีปุ่ม Search) และจำนวน request ที่นับได้ในขั้นตอนที่ 2–3 เท่ากับ 0 — ข้อมูลถูก cache แบบ static จึงกรองจากชุดเดิมในหน่วยความจำ

---
## TC-DDS-010011 — ช่องค้นหามี placeholder และ aria-label ตรงกัน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. หา input ของช่องค้นหา
2. อ่านค่า `placeholder` และ accessible name ของ input
**Expected**
ทั้ง `placeholder` และ `aria-label` เป็นข้อความเดียวกันคือ "Search datasets…" จึงเลือก locator ด้วย `getByRole("textbox", { name: /search datasets/i })` ได้; ไอคอนแว่นขยายข้างช่องเป็น `aria-hidden` ไม่ถูกนับเป็นชื่อ

---
## TC-DDS-010012 — คำค้นที่มีช่องว่างนำ/ตามถูก trim ก่อนกรอง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; ทราบคำค้นที่ให้ผลลัพธ์อย่างน้อย 1 รายการ (เรียกว่า `X`)
**Steps**
1. พิมพ์ `X` แล้วจดจำนวนการ์ดที่เหลือ
2. ล้างช่องค้นหา แล้วพิมพ์ `   X   ` (มีช่องว่างนำและตาม)
**Expected**
ผลลัพธ์ทั้งสองรอบเหมือนกันทุกประการ — คำค้นถูก `trim()` ก่อนนำไปเทียบ

---
## TC-DDS-010013 — รายการ dataset ผูกกับ BU ปัจจุบัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ผู้ใช้เป็นสมาชิกของ BU อย่างน้อย 2 แห่ง (ถ้าบัญชีทดสอบมี BU เดียว ให้ข้ามเคสนี้); อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. จดค่า badge total และรายชื่อ category ที่เห็นใน BU ปัจจุบัน
2. สลับ BU จาก BU switcher บน navbar
3. กลับมาที่ `/system-admin/dashboard-dataset` แล้วรอโหลดเสร็จ
**Expected**
มี request ใหม่ไปยัง `/api/proxy/api/{bu ใหม่}/dashboard-lab/datasets` และรายการ/ตัวเลขบน badge สะท้อน BU ใหม่ (cache แยกตาม `buCode` ไม่ปนกัน)

---
## TC-DDS-020001 — DatasetCard แสดง name / shape / description / id / unit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี dataset อย่างน้อย 1 รายการ; อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. เลือกการ์ด dataset หนึ่งใบ
2. อ่านข้อความทุกส่วนในการ์ด
**Expected**
การ์ดเป็น `<article>` ที่มี: `<h3>` ชื่อ dataset (ซ้ายบน), badge แสดงค่า `shape` (ขวาบน), ย่อหน้า description ใต้ชื่อ, และแถวล่างสุดแสดง `id` · `unit` คั่นด้วยจุดกลาง; ไม่มีฟิลด์อื่น (`params` / `supported_renders` ไม่ถูกแสดง)

---
## TC-DDS-020002 — หน้าเป็น read-only — ไม่มีปุ่ม CRUD และการ์ดไม่นำทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin; อยู่ที่ `/system-admin/dashboard-dataset` และมีการ์ดอย่างน้อย 1 ใบ
**Steps**
1. สำรวจทั้งหน้าเพื่อหาปุ่ม New / Create / Add / Edit / Delete หรือเมนู row action
2. คลิกกลางการ์ด dataset ใบแรก
3. ตรวจ URL หลังคลิก
**Expected**
ไม่มีปุ่มหรือเมนูสำหรับสร้าง/แก้ไข/ลบบนหน้า, การ์ดไม่มี `<a href>` และไม่มี handler คลิก, URL ยังเป็น `/system-admin/dashboard-dataset` และไม่มี dialog เปิดขึ้น (หน้านี้เป็น catalog อ่านอย่างเดียวโดยออกแบบ)

---
## TC-DDS-090001 — สถานะ loading แสดงระหว่างโหลด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
โปรไฟล์ผู้ใช้ (และ `buCode`) โหลดเสร็จแล้ว แต่หน่วงตอบกลับของ `**/dashboard-lab/datasets` ให้ช้าพอสังเกต
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. สังเกตพื้นที่ใต้ช่องค้นหาระหว่างรอ
**Expected**
แสดงแถบสถานะที่มี spinner หมุนพร้อมข้อความ "Loading datasets…" และมี `aria-busy` + `aria-live="polite"`; ยังไม่มีการ์ดหรือ empty state ขึ้นมาระหว่างนี้

---
## TC-DDS-090002 — สถานะ error แสดงข้อความเมื่อโหลดล้มเหลว
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ทำให้ `**/dashboard-lab/datasets` ตอบไม่สำเร็จ (เช่น 500)
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. รอจน query จบ
**Expected**
แสดงกล่องข้อความสีแดง (destructive) ที่มีข้อความจาก error ที่โยนออกมา หรือ fallback "Failed to load datasets"; ไม่มีการ์ด dataset และไม่แสดง empty state; ช่องค้นหายังอยู่

---
## TC-DDS-090003 — empty state เมื่อไม่มี dataset เลย
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
BU ปัจจุบันไม่มี dashboard dataset เลย (API ตอบ `items: []`, `count: 0`)
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. รอโหลดเสร็จ โดยไม่พิมพ์คำค้นใด ๆ
**Expected**
แสดง empty state "No datasets available" / "There are no dashboard datasets registered for this business unit."; **ไม่มี badge ข้างหัวข้อ** (badge ซ่อนเมื่อ `count` ไม่มากกว่า 0); ไม่มี section category ใด ๆ

---
## TC-DDS-090004 — เข้าหน้าจากการ์ดบน System Admin landing
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
ล็อกอินเป็น Admin; อยู่ที่หน้า `/system-admin`
**Steps**
1. เลื่อนลงไปที่ chapter ที่ 05 "Data Platform"
2. หาการ์ดชื่อ "Dashboard Dataset"
3. คลิกลิงก์ "Open" บนการ์ดนั้น
**Expected**
นำทางไปที่ `/system-admin/dashboard-dataset` และหน้า catalog แสดงผลตามปกติ (หัวข้อ + ช่องค้นหา + รายการหรือ empty state)

---
## TC-DDS-090005 — shape บนการ์ดสอดคล้องกับ lookup บน /dashboard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin; ทราบ dataset หนึ่งรายการที่ยังไม่ถูกเพิ่มเป็น widget บน `/dashboard` (picker ตัด dataset ที่อยู่บน dashboard แล้วออกด้วย `excludeIds`)
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset` แล้วจด `name` และค่า badge `shape` ของ dataset เป้าหมาย
2. ไปที่ `/dashboard` แล้วเปิด lookup "+ Add" ของส่วน widget
3. ค้นหา dataset เดียวกันในรายการของ lookup
**Expected**
ถ้า `shape` อยู่ในชุดที่รองรับ (`scalar`, `scalar_delta`, `time_series`, `categorical`, `ranked`, `table`) dataset ต้องปรากฏใน lookup และเมื่อเลือกแล้วได้การ์ดชนิดเริ่มต้นตาม shape (`scalar`/`scalar_delta`→KPI, `time_series`→line, `categorical`→pie, `ranked`→bar); ถ้า `shape` อยู่นอกชุดนั้น dataset ต้องไม่ปรากฏใน lookup ทั้งที่ยังเห็นได้ในหน้า catalog

---
## TC-DDS-090006 — คำค้นที่มีแต่ช่องว่างไม่กรองรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มี dataset อย่างน้อย 1 รายการ
**Steps**
1. จดจำนวนการ์ดทั้งหมดก่อนพิมพ์
2. พิมพ์ช่องว่างล้วน `"   "` ลงในช่องค้นหา
**Expected**
รายการไม่ถูกกรอง — จำนวนการ์ดและ section เท่าเดิมทุกประการ และไม่แสดง empty state ใด ๆ (คำค้นถูก trim เหลือค่าว่างก่อนนำไปเทียบ)

---
## TC-DDS-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน (context ใหม่ ไม่มี storageState)
**Steps**
1. เปิด `/system-admin/dashboard-dataset` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็นหัวข้อ Dashboard Dataset หรือการ์ด dataset ใด ๆ

---
## TC-DDS-100002 — role ที่ไม่มีสิทธิ์เปิด URL ตรงถูกบล็อกด้วย AccessDeniedBlock
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วย role ที่ไม่มีสิทธิ์ `system_configuration.view` และไม่ใช่ admin (เช่น `requestor@blueledgers.com` — ยืนยันสิทธิ์จริงของบัญชีก่อนรัน); BU ยังมี license `dashboard.dataset`
**Steps**
1. เปิด `/system-admin/dashboard-dataset` โดยตรง
2. รอจน RouteGuard ตัดสิน
**Expected**
ไม่ถูก redirect — URL คงเดิม แต่หน้าแสดงกล่อง `role="alert"` (AccessDeniedBlock) พร้อมข้อความปฏิเสธสิทธิ์และบรรทัด "ติดต่อผู้ดูแลระบบ"; ไม่มีการ์ด dataset, ไม่มีช่องค้นหา; มีปุ่มพากลับไปหน้า landing ที่ผู้ใช้เข้าได้

---
## TC-DDS-100003 — เมนูใน sidebar ของ role ที่ไม่มีสิทธิ์คลิกแล้วไม่นำทาง
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วย role ที่ไม่มีสิทธิ์ `system_configuration.view` และไม่ใช่ admin; เปิด sidebar ของโมดูล System Admin
**Steps**
1. หาเมนู "Dashboard Dataset" ใน sidebar
2. คลิกเมนูนั้น
3. ตรวจ URL หลังคลิก
**Expected**
เมนูยัง**ปรากฏอยู่** (ไม่ถูกซ่อน) แต่ถูก render เป็นปุ่มที่จางลง ไม่ใช่ลิงก์; คลิกแล้วเปิด permission-denied dialog และ URL ไม่เปลี่ยนไปที่ `/system-admin/dashboard-dataset`

---
## TC-DDS-100004 — BU ที่ไม่มี license `dashboard.dataset` ถูกบล็อกแม้เป็น Admin
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
`LICENSE_ENFORCEMENT` เปิดอยู่ (ค่าปัจจุบันของทุก environment คือ `true`) และ active BU **ไม่ได้ซื้อ** feature `dashboard.dataset`; ล็อกอินเป็น Admin
**Steps**
1. เปิด `/system-admin/dashboard-dataset` โดยตรง
2. รอจน RouteGuard ตัดสิน
**Expected**
แสดง AccessDeniedBlock ด้วยเหตุผล license (คำอธิบายเรื่องสัญญา/สิทธิ์การใช้งาน ไม่มีบรรทัด "ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์") ทั้งที่ผู้ใช้เป็น Admin — license ไม่มี admin bypass; เมนูเดียวกันใน sidebar แสดงไอคอนกุญแจ

---
<sub>Authored: 2026-06-17 · Reviewed against the app: 2026-09-20 · documentation only</sub>
