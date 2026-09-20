# Exchange Rate — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — ส่วนที่ทดสอบจริงอยู่แล้วอยู่ใน `tests/041-exchange-rate.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/041-exchange-rate.md` เอกสารนี้เขียนจากโค้ดจริงของแอปที่ `routes/config/exchange-rate/` (exchange-rate.route.tsx, exchange-rate-component.tsx, exchange-rate-card.tsx, exchange-rate-dialog.tsx, exchange-rate-form-schema.ts, use-exchange-rate-table.tsx) รวมถึง `routes/config/shared/use-exchange-rate.ts` และ shared components ที่โมดูลนี้ใช้ (`components/search-input.tsx`, `components/share/document-list-header.tsx`, `components/share/list-card.tsx`, `components/ui/data-grid/*`, `components/ui/delete-dialog.tsx`, `components/ui/field.tsx`, `components/lookup/lookup-currency.tsx`, `hooks/use-data-grid-state.ts`, `hooks/use-list-page-state.ts`, `hooks/use-delete-gate.ts`)_

**Module:** Config — Exchange Rate (อัตราแลกเปลี่ยน)
**Frontend route:** `routes/config/exchange-rate`  •  **URL:** `/config/exchange-rate`
**Prefix:** `ER`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/041-exchange-rate.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 33

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (จึงไม่เขียนซ้ำในไฟล์นี้):** `TC-ER-010001` หน้า list โหลดสำเร็จ + URL ตรง, `TC-ER-010002` ปุ่ม Add แสดง (locator `getByRole("button", { name: /Add/i })` ซึ่งแมตช์ปุ่ม "Add Manual" ของหน้านี้), `TC-ER-010005` active BU = BLAVG และ `TC-ER-100001`–`TC-ER-100004` ที่ `addListOnlySecurityCases` สร้างให้ (XSS / SQLi / string ยาว ในช่องค้นหา + role สิทธิ์ต่ำ) — สี่ตัวหลังถูก `skipTcs` ไว้ในสเปก แต่ **ยังถือครอง ID อยู่** จึงห้ามนำเลข `1000xx` ไปใช้ซ้ำ
> 2. **ขอบเขต section:** `docs/test-id-scheme.md` ลงทะเบียนให้ `ER` ไว้แค่ `01–02, 10` ทุกเคสในไฟล์นี้จึงอยู่ในบล็อก 01 (list/search) และ 02 (detail/dialog) เท่านั้น **เคส CRUD ที่ยิงจริงจนจบรอบ (สร้างสำเร็จ / แก้ไขแล้วค่าคงอยู่ / ลบสำเร็จ) และเคส validation เต็มชุด ยังไม่ถูกเขียนที่นี่** เพราะต้องลงทะเบียน section `03`, `04`, `05`, `20` (และ `30` ถ้าจะครอบแหล่งอัตราภายนอก) ให้ `ER` ก่อน — ผู้รวมงานโปรดเพิ่มแถวแล้วค่อยเปิดรอบถัดไป เคสในไฟล์นี้จึงเน้นการตรวจว่า **UI ปรากฏตามออกแบบ** และพฤติกรรมที่ไม่เปลี่ยนข้อมูล
> 3. **แหล่งอัตราภายนอกยังไม่มีจริง:** `useExternalExchangeRates` ยิง `fetch("/api/exchange-rate?base=…")` ซึ่งเป็น Next API route เดิม ไม่มีทั้งใน SPA และ gateway (มี TODO กำกับไว้ที่ `routes/config/shared/use-exchange-rate.ts:103`) ผลคือ `currencyWithDiff` ว่าง และปุ่ม **"Update Exchange Rates" ถูก disable** ตามเงื่อนไข `currencyWithDiff.length === 0` — `TC-ER-010018` จึงตรวจแค่ว่าปุ่มปรากฏตามออกแบบ ส่วน `TC-ER-020015` ระบุ precondition ไว้ชัดว่าต้องมีแหล่งข้อมูลตอบกลับสำเร็จก่อนจึงจะรันได้
> 4. **อย่า assert ทิศลูกศรของ sort ตอนค่าเริ่มต้น:** หน้านี้ตั้ง `defaultSort: "at_date:desc,currency_code:asc"` แต่ `useDataGridState` แปลงสตริงด้วย `split(":")` ทำให้ `dir` กลายเป็น `"desc,currency_code"` → `desc === false` ตัวชี้ทิศในเมนูเรียงลำดับจึงอ่านเป็น "ขึ้น" ทั้งที่ค่า `sort` ที่ส่งให้ backend เป็นสตริงเต็มที่เรียงลง เคสในไฟล์นี้จึงตรวจจากค่า `sort` บน URL ไม่ใช่จากไอคอน
> 5. **ข้อผิดพลาดของฟอร์มเป็น tooltip ไม่ใช่ข้อความ inline:** `FieldInput` / `FieldDatePicker` / `LookupCurrency` แสดง error ด้วยไอคอน `CircleAlert` + `aria-invalid` + กรอบสีแดง และข้อความจะโผล่ใน tooltip เมื่อ hover/focus เท่านั้น — เคส validation ต้องตรวจสถานะ ไม่ใช่ `getByText`
> 6. **หน้านี้ไม่ได้ใช้ `ConfigListTemplate`** ต่างจาก `docs/test-cases/083-shelf.md` ที่ใช้เป็นเช็กลิสต์เทียบ — exchange-rate ประกอบ toolbar เอง จึง **ไม่มี** ปุ่มตัวกรอง, saved view, ปุ่ม export, ช่องเลือกแถว (checkbox) และคอลัมน์สถานะ เคสของ shelf ในหัวข้อเหล่านั้นจึงไม่ถูกยกมา
> 7. **ตัวเลขบนการ์ดกับในตารางใช้คนละฟังก์ชัน:** ตารางใช้ `formatExchangeRate` (ทศนิยม 5 ตำแหน่ง) ส่วนการ์ดใช้ `formatCurrency(rate, 4)` (4 ตำแหน่ง) และวันที่ก็ต่างกัน (ตาราง = `dateTimeFormat`, การ์ด = `dateFormat`) นี่คือพฤติกรรมที่โค้ดเขียนไว้จริง ไม่ใช่ข้อสันนิษฐาน
> 8. **แถวในตารางเปิดด้วยปุ่ม ไม่ใช่ลิงก์:** รหัสสกุลเงินในคอลัมน์ Code เป็น `CellAction` ซึ่ง render เป็น `<button>` แบบลิงก์ — ไม่มี `<a href>` และไม่มีการเปลี่ยน URL เมื่อเปิด dialog

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-ER-010003 | หัวหน้ารายการแสดงชื่อ คำอธิบายอิงสกุลเงินฐาน และจำนวนรายการ | Medium | Smoke |
| TC-ER-010004 | ตารางแสดงคอลัมน์มาตรฐานของอัตราแลกเปลี่ยน | High | Functional |
| TC-ER-010006 | คอลัมน์ Created / Updated ถูกซ่อนเป็นค่าเริ่มต้นและเปิดได้จากเมนูคอลัมน์ | Low | Functional |
| TC-ER-010007 | ค้นหาแล้วกด Enter ส่งคำค้นขึ้น URL และรีเซ็ตกลับหน้าแรก | High | Functional |
| TC-ER-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-ER-010009 | เมนูเรียงลำดับแสดงเฉพาะคอลัมน์ที่เรียงได้ และเลือกแล้วเขียน sort ลง URL | Medium | Functional |
| TC-ER-010010 | แถว Default ในเมนูเรียงลำดับล้าง sort กลับค่าเริ่มต้นของหน้า | Low | Functional |
| TC-ER-010011 | สลับมุมมองตาราง / การ์ด บนเดสก์ท็อป | Low | Functional |
| TC-ER-010012 | การ์ดในมุมมองกริดแสดงอัตราในรูป "1 CODE = rate BASE" พร้อมวันที่และแถว audit | Medium | Functional |
| TC-ER-010013 | เปลี่ยนจำนวนแถวต่อหน้าแล้ว URL และข้อความ Showing ปรับตาม | Medium | Functional |
| TC-ER-010014 | เปลี่ยนหน้าด้วยปุ่มนำทางแล้วลำดับ # เดินต่อเนื่อง | Medium | Functional |
| TC-ER-010015 | ค้นหาคำที่ไม่มีผลลัพธ์แล้วเห็นสถานะว่างเปล่า | Low | Edge Case |
| TC-ER-010016 | คอลัมน์อัตราแลกเปลี่ยนชิดขวา ทศนิยม 5 ตำแหน่ง และหัวคอลัมน์ระบุสกุลเงินฐาน | Medium | Functional |
| TC-ER-010017 | เมนูจัดการท้ายแถวมีเฉพาะคำสั่งลบ | Low | Functional |
| TC-ER-010018 | ปุ่ม Update Exchange Rates ปรากฏคู่กับปุ่ม Add Manual บนหัวหน้ารายการ | Medium | Functional |
| TC-ER-010019 | สถานะของรายการคงอยู่ใน URL เมื่อรีโหลดหน้า | Medium | Functional |
| TC-ER-010020 | คอลัมน์ Date แสดงตามรูปแบบวันที่-เวลาของ BU | Low | Functional |
| TC-ER-010021 | แถบเครื่องมือของหน้ารายการมีเฉพาะสี่ส่วนตามออกแบบ | Low | Functional |
| TC-ER-020001 | คลิกรหัสสกุลเงินในตารางเปิด dialog แก้ไข | High | Happy Path |
| TC-ER-020002 | dialog แก้ไขแสดงแถบข้อมูลประกอบของรายการ | Medium | Functional |
| TC-ER-020003 | dialog แก้ไขแก้ได้เฉพาะตัวเลขอัตรา สกุลเงินและวันที่เป็นข้อมูลอ่านอย่างเดียว | High | Functional |
| TC-ER-020004 | ปุ่ม Save ปิดอยู่จนกว่าค่าอัตราจะเปลี่ยน | High | Validation |
| TC-ER-020005 | ตัวชี้ส่วนต่างเปลี่ยนตามค่าที่กรอก (Increase / Decrease / No change) | Medium | Functional |
| TC-ER-020006 | ปุ่ม Cancel ปิด dialog แก้ไขโดยไม่บันทึก | Medium | Alternate Flow |
| TC-ER-020007 | กรอกอัตราติดลบใน dialog แก้ไขแล้วบันทึกไม่ผ่าน | High | Validation |
| TC-ER-020008 | ปุ่ม Add Manual เปิด dialog สร้างที่มีสามฟิลด์บังคับ | High | Happy Path |
| TC-ER-020009 | ตัวเลือกสกุลเงินใน dialog สร้างไม่มีสกุลเงินฐานของ BU | High | Functional |
| TC-ER-020010 | ช่องวันที่ใน dialog สร้างตั้งค่าเริ่มต้นเป็นวันเวลาปัจจุบันและเลือกเวลาได้ | Medium | Functional |
| TC-ER-020011 | กด Save ใน dialog สร้างโดยไม่เลือกสกุลเงินแล้วช่องสกุลเงินขึ้นสถานะผิดพลาด | High | Validation |
| TC-ER-020012 | ปุ่ม Cancel ปิด dialog สร้างโดยไม่บันทึก | Low | Alternate Flow |
| TC-ER-020013 | คำสั่งลบท้ายแถวเปิด dialog ยืนยันที่ระบุรหัสสกุลเงินและวันที่ของรายการ | High | Happy Path |
| TC-ER-020014 | ปุ่ม Cancel ใน dialog ยืนยันลบปิดกล่องโดยไม่ลบ | Medium | Alternate Flow |
| TC-ER-020015 | dialog ยืนยันอัปเดตอัตราทั้งชุดแสดงส่วนต่างรายสกุลเงิน | Medium | Functional |

---

## TC-ER-010003 — หัวหน้ารายการแสดงชื่อ คำอธิบายอิงสกุลเงินฐาน และจำนวนรายการ
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU ตั้งสกุลเงินฐานไว้แล้ว (`default_currency_id`) และมีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/exchange-rate`
2. รอให้ตารางโหลดเสร็จ
3. อ่านบล็อกหัวหน้ารายการ (`DocumentListHeader`)
**Expected**
หัวหน้ารายการแสดงไอคอนโมดูล + หัวข้อ "Exchange Rate"; มี Badge จำนวนรายการรวมอยู่ข้างหัวข้อ (แสดงเฉพาะเมื่อจำนวน > 0) และตัวเลขในนั้นตรงกับยอดรวมที่แถบแบ่งหน้ารายงาน; บรรทัดคำอธิบายอ่านว่า "What one unit of each foreign currency is worth in <BASE>." โดย `<BASE>` คือรหัสสกุลเงินฐานของ BU (ค่า fallback คือ THB เมื่อ BU ยังไม่ตั้ง)

---

## TC-ER-010004 — ตารางแสดงคอลัมน์มาตรฐานของอัตราแลกเปลี่ยน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง (เดสก์ท็อป); มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/exchange-rate`
2. รอให้ DataGrid โหลดเสร็จ
3. อ่านแถวหัวตาราง
**Expected**
ตารางมีคอลัมน์ตามลำดับ: `#` (ลำดับที่), "Date", "Code" (จัดกึ่งกลาง), "Exchange Rate (<BASE>)" (จัดชิดขวา) และคอลัมน์ปุ่มจัดการท้ายแถวที่หัวคอลัมน์ว่าง; **ไม่มี** คอลัมน์ช่องเลือกแถว (checkbox) และ **ไม่มี** คอลัมน์สถานะ; เซลล์ในคอลัมน์ Code เป็นปุ่มแบบลิงก์ที่มีข้อความเป็นรหัสสกุลเงิน

---

## TC-ER-010006 — คอลัมน์ Created / Updated ถูกซ่อนเป็นค่าเริ่มต้นและเปิดได้จากเมนูคอลัมน์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; มีข้อมูลอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/exchange-rate`
2. ยืนยันว่าหัวตารางยังไม่มี "Created" และ "Updated"
3. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
4. ติ๊กเลือก "Created" และ "Updated"
**Expected**
ก่อนเปิดเมนู ตารางไม่มีคอลัมน์ Created / Updated (ถูกตั้ง `columnVisibility` เป็น false ไว้ตั้งแต่ต้น); เมนูคอลัมน์เปิดขึ้นพร้อมหัวข้อ "Toggle Columns" และมีรายการ Date, Code, Exchange Rate, Created, Updated ให้ติ๊ก; เมื่อติ๊กแล้วสองคอลัมน์นั้นปรากฏในตารางโดยเมนูยังเปิดค้างอยู่

---

## TC-ER-010007 — ค้นหาแล้วกด Enter ส่งคำค้นขึ้น URL และรีเซ็ตกลับหน้าแรก
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate`; มีอัตราแลกเปลี่ยนของสกุลเงินที่รู้รหัสอยู่แล้วอย่างน้อย 1 รายการ (เช่น USD)
**Steps**
1. ไปที่ `/config/exchange-rate?page=2` (หรือกดไปหน้า 2 ก่อน)
2. คลิกช่องค้นหา (placeholder "Search...")
3. พิมพ์รหัสสกุลเงินที่ต้องการ
4. กด Enter
**Expected**
คำค้นถูกส่งเมื่อกด Enter เท่านั้น (พิมพ์เฉย ๆ ไม่ยิงคำขอ); URL มี query `search=<คำค้น>` และพารามิเตอร์ `page` ถูกล้างออก (กลับไปหน้าแรก); ตารางแสดงเฉพาะรายการที่ตรงกับคำค้น

---

## TC-ER-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` และมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (เช่นเปิดจาก `?search=USD`)
**Steps**
1. สังเกตปุ่มท้ายช่องค้นหาว่าเปลี่ยนจากไอคอนแว่นขยายเป็นกากบาท (aria-label "Clear search")
2. คลิกปุ่มกากบาท
**Expected**
ช่องค้นหาว่างลง; query `search` หายจาก URL; ตารางกลับมาแสดงรายการทั้งหมด และปุ่มท้ายช่องกลับเป็นไอคอนแว่นขยาย (aria-label "Search...")

---

## TC-ER-010009 — เมนูเรียงลำดับแสดงเฉพาะคอลัมน์ที่เรียงได้ และเลือกแล้วเขียน sort ลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate`; มีอัตราแลกเปลี่ยนมากกว่า 1 รายการ
**Steps**
1. ไปที่ `/config/exchange-rate`
2. คลิกปุ่มเมนูเรียงลำดับ (aria-label "Sort by")
3. คลิกรายการ "Code"
4. คลิก "Code" ซ้ำอีกครั้ง
**Expected**
เมนูมีหัวข้อ "Sort by" แถว "Default" และรายการของคอลัมน์ที่เรียงได้เท่านั้น (Date, Code, Exchange Rate — ไม่มี `#` และไม่มีคอลัมน์ปุ่มจัดการ); คลิกครั้งแรก URL ได้ `sort=currency_code:asc` และมีลูกศรขึ้นกำกับแถวนั้น; คลิกซ้ำสลับเป็น `sort=currency_code:desc` พร้อมลูกศรลง โดยเมนูยังเปิดค้างให้สลับต่อได้

---

## TC-ER-010010 — แถว Default ในเมนูเรียงลำดับล้าง sort กลับค่าเริ่มต้นของหน้า
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` โดยมี `sort` ค้างอยู่บน URL แล้ว (เช่นเปิดจาก `?sort=currency_code:asc`)
**Steps**
1. สังเกตว่าปุ่มเมนูเรียงลำดับถูกเน้นสี (มี `sort` บน URL)
2. คลิกปุ่มเมนูเรียงลำดับ
3. คลิกแถว "Default"
**Expected**
พารามิเตอร์ `sort` และ `page` ถูกล้างออกจาก URL; ปุ่มเมนูกลับเป็นสีปกติ; แถว "Default" มีไอคอนกำกับแสดงว่าเป็นตัวเลือกที่ใช้อยู่; รายการกลับไปเรียงตามค่าเริ่มต้นของหน้า (`at_date:desc,currency_code:asc` ที่ส่งไป backend) — ไม่ต้องตรวจทิศลูกศรบนแถว Date ดูหมายเหตุข้อ 4

---

## TC-ER-010011 — สลับมุมมองตาราง / การ์ด บนเดสก์ท็อป
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` บน viewport ขนาดเดสก์ท็อป (ปุ่มสลับมุมมองซ่อนบนมือถือ); มีข้อมูลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่ม "Grid view"
2. คลิกปุ่ม "List view" กลับ
**Expected**
โหมดกริดแสดงการ์ดเรียงเป็นคอลัมน์ (1 / 2 / 3 คอลัมน์ตามความกว้างจอ) แทน DataGrid และ **ปุ่มเมนูคอลัมน์หายไป** (render เฉพาะโหมดตาราง) ส่วนช่องค้นหาและเมนูเรียงลำดับยังอยู่; กลับมาโหมดตารางแล้ว DataGrid และปุ่มเมนูคอลัมน์กลับมาครบ โดยข้อมูลยังเป็นชุดเดิม

---

## TC-ER-010012 — การ์ดในมุมมองกริดแสดงอัตราในรูป "1 CODE = rate BASE" พร้อมวันที่และแถว audit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในโหมดกริด; มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการที่มี `at_date` และข้อมูล audit
**Steps**
1. สลับเป็นมุมมองกริด
2. อ่านการ์ดใบแรก
**Expected**
หัวการ์ดคือรหัสสกุลเงิน; แถว "Exchange Rate" อ่านว่า `1 <CODE> = <อัตรา> <BASE>` โดยอัตราแสดงทศนิยม **4 ตำแหน่ง** (ต่างจากตารางที่ 5 — ดูหมายเหตุข้อ 7); แถว "Date" แสดงวันที่ของอัตราตามรูปแบบวันที่ของ BU; ท้ายการ์ดมีแถว Created / By / Updated ตามข้อมูล audit ที่มี; footer การ์ดมีปุ่มลบ

---

## TC-ER-010013 — เปลี่ยนจำนวนแถวต่อหน้าแล้ว URL และข้อความ Showing ปรับตาม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; มีอัตราแลกเปลี่ยนมากกว่า 5 รายการ
**Steps**
1. อ่านข้อความ "Showing X–Y of N" และตัวเลือก Rows ที่แถบแบ่งหน้า
2. เปิด select "Rows per page" แล้วเลือก 5
**Expected**
ตัวเลือกจำนวนแถวมีค่า 5, 10, 25, 50, 100 และค่าเริ่มต้นคือ 10; หลังเลือก 5 URL มี `perpage=5`, ตารางเหลือ 5 แถว และข้อความเปลี่ยนเป็น "Showing 1–5 of N" โดย N คือยอดรวมเดิม

---

## TC-ER-010014 — เปลี่ยนหน้าด้วยปุ่มนำทางแล้วลำดับ # เดินต่อเนื่อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; มีอัตราแลกเปลี่ยนมากพอให้เกิดอย่างน้อย 2 หน้า (เช่นตั้ง `perpage=5`)
**Steps**
1. จดค่าลำดับ `#` ของแถวแรกในหน้า 1
2. คลิกปุ่ม "Go to next page"
3. อ่านลำดับ `#` ของแถวแรกในหน้า 2 และข้อความ Showing
**Expected**
URL มี `page=2`; ลำดับ `#` ของแถวแรกในหน้า 2 เท่ากับ `perpage + 1` (เดินต่อจากหน้าก่อน ไม่รีเซ็ตเป็น 1); ข้อความ Showing ขยับช่วงตามหน้า; ปุ่ม "Go to first page" / "Go to previous page" เปลี่ยนจากปิดเป็นเปิดใช้งาน

---

## TC-ER-010015 — ค้นหาคำที่ไม่มีผลลัพธ์แล้วเห็นสถานะว่างเปล่า
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/config/exchange-rate`
**Steps**
1. พิมพ์คำค้นที่ไม่มีทางตรงกับรหัสสกุลเงินใด เช่น `zzz-no-match`
2. กด Enter
**Expected**
ตารางแสดงสถานะว่างเปล่าพร้อมข้อความ "No data found" และภาพประกอบ; แถบแบ่งหน้าไม่ถูก render (จำนวนรายการเป็น 0); หน้าไม่ขึ้นสถานะข้อผิดพลาด และปุ่ม Add Manual ยังใช้งานได้

---

## TC-ER-010016 — คอลัมน์อัตราแลกเปลี่ยนชิดขวา ทศนิยม 5 ตำแหน่ง และหัวคอลัมน์ระบุสกุลเงินฐาน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; BU ตั้งสกุลเงินฐานไว้แล้ว; มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการที่ค่าไม่เป็น 0
**Steps**
1. อ่านหัวคอลัมน์อัตราแลกเปลี่ยน
2. อ่านค่าตัวเลขในคอลัมน์นั้นของแถวแรก
**Expected**
หัวคอลัมน์อ่านว่า "Exchange Rate (<BASE>)" โดย `<BASE>` คือรหัสสกุลเงินฐานของ BU (ถ้า BU ไม่มีค่านี้จะเหลือแค่ "Exchange Rate"); ค่าตัวเลขจัดชิดขวา ใช้ฟอนต์ตัวเลขความกว้างเท่ากัน และมีทศนิยม 5 ตำแหน่งเสมอ; แถวที่อัตราเป็น 0 หรือว่าง แสดงเป็น "-"

---

## TC-ER-010017 — เมนูจัดการท้ายแถวมีเฉพาะคำสั่งลบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; login ด้วย Admin ที่มีสิทธิ์ลบและสัญญายังไม่หมดอายุ; มีข้อมูลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถวแรก (aria-label "Row actions")
2. อ่านรายการในเมนู
**Expected**
เมนูเปิดขึ้นและมีเพียงรายการ "Delete" (สไตล์ destructive) เท่านั้น — **ไม่มี** รายการ "Edit" และ **ไม่มี** รายการ Activity เพราะตารางนี้ส่งเฉพาะ `onDelete` ให้ `actionColumn`; ช่องทางแก้ไขอยู่ที่การคลิกรหัสสกุลเงินในคอลัมน์ Code แทน

---

## TC-ER-010018 — ปุ่ม Update Exchange Rates ปรากฏคู่กับปุ่ม Add Manual บนหัวหน้ารายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ด้วย Admin
**Steps**
1. ไปที่ `/config/exchange-rate`
2. อ่านกลุ่มปุ่มมุมขวาบนของหัวหน้ารายการ
**Expected**
มีปุ่มสองปุ่มเรียงกัน: "Add Manual" (ปุ่มแบบ outline พร้อมไอคอนเครื่องหมายบวก) และ "Update Exchange Rates" (ปุ่มหลักพร้อมไอคอนรีเฟรช); ทั้งสองปุ่ม render อยู่จริงตามออกแบบ **หมายเหตุ:** สถานะเปิด/ปิดใช้งานของปุ่ม Update ขึ้นกับว่ามีแหล่งอัตราภายนอกตอบกลับหรือไม่ — ในสภาพแวดล้อมปัจจุบันปุ่มนี้จะถูก disable (ดูหมายเหตุข้อ 3) เคสนี้จึงไม่ยืนยันสถานะ enable

---

## TC-ER-010019 — สถานะของรายการคงอยู่ใน URL เมื่อรีโหลดหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีอัตราแลกเปลี่ยนมากพอให้มีมากกว่า 1 หน้าเมื่อ `perpage=5`
**Steps**
1. เปิด `/config/exchange-rate?search=&sort=currency_code:asc&page=2&perpage=5` ตรง ๆ
2. รอให้ตารางโหลดเสร็จ
3. กด reload หน้า
**Expected**
ทั้งก่อนและหลัง reload: ช่อง Rows per page แสดง 5, แถบแบ่งหน้าชี้ที่หน้า 2, เมนูเรียงลำดับเน้นสีและกำกับลูกศรขึ้นที่แถว "Code"; ค่าบน URL ไม่ถูกเขียนทับหรือหายไป — สถานะของ list อ่านจาก URL เป็นแหล่งความจริงเดียว

---

## TC-ER-010020 — คอลัมน์ Date แสดงตามรูปแบบวันที่-เวลาของ BU
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; BU BLAVG ตั้ง `date_format` ไว้ในคอนฟิก; มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการที่มี `at_date`
**Steps**
1. อ่านค่าในคอลัมน์ "Date" ของแถวแรก
2. เทียบกับรูปแบบวันที่-เวลาที่ BU ตั้งไว้ (อ่านจาก profile API)
**Expected**
ค่าที่แสดงเป็นวันที่ **พร้อมเวลา** ตาม `dateTimeFormat` ของ BU (ไม่ใช่สตริง ISO ดิบ และไม่ใช่รูปแบบวันที่อย่างเดียวแบบที่การ์ดในโหมดกริดใช้)

---

## TC-ER-010021 — แถบเครื่องมือของหน้ารายการมีเฉพาะสี่ส่วนตามออกแบบ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` บนเดสก์ท็อปในมุมมองตาราง
**Steps**
1. ไปที่ `/config/exchange-rate`
2. สำรวจแถบเครื่องมือใต้หัวหน้ารายการ
**Expected**
แถบเครื่องมือประกอบด้วยช่องค้นหา, ปุ่มเมนูเรียงลำดับ, ปุ่มเมนูคอลัมน์ และกลุ่มปุ่มสลับมุมมอง List / Grid เท่านั้น; **ไม่มี** ปุ่มตัวกรอง (Open filters), ไม่มีตัวเลือก saved view, ไม่มีปุ่มส่งออก และตารางไม่มีช่องเลือกแถว — โมดูลนี้ประกอบ toolbar เอง ไม่ได้ใช้ `ConfigListTemplate` เหมือนโมดูล config อื่น (ดูหมายเหตุข้อ 6)

---

## TC-ER-020001 — คลิกรหัสสกุลเงินในตารางเปิด dialog แก้ไข
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง; มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการ
**Steps**
1. จดรหัสสกุลเงินของแถวแรก
2. คลิกปุ่มรหัสสกุลเงินในคอลัมน์ Code ของแถวนั้น
**Expected**
เปิด dialog ที่มีไอคอนลูกศรสลับทิศ หัวข้อ "Edit Exchange Rate" และคำอธิบาย "Update the exchange rate for the selected record."; URL ไม่เปลี่ยน (เปิดด้วยปุ่ม ไม่ใช่ลิงก์ — ดูหมายเหตุข้อ 8); ค่าปัจจุบันของแถวนั้นถูกเติมไว้ในช่องอัตราแล้ว

---

## TC-ER-020002 — dialog แก้ไขแสดงแถบข้อมูลประกอบของรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog แก้ไขของรายการที่มีทั้ง `at_date` และ `audit.updated.at`
**Steps**
1. คลิกรหัสสกุลเงินของรายการนั้นเพื่อเปิด dialog
2. อ่านแถบข้อมูลใต้หัว dialog
**Expected**
แถบข้อมูลแสดงสามส่วนคั่นด้วยเส้นแบ่ง: Badge รหัสสกุลเงินของรายการ, ไอคอนปฏิทิน + วันที่ของอัตรา และไอคอนนาฬิกาย้อน + วันที่แก้ไขล่าสุด โดยทั้งสองวันที่ใช้รูปแบบวันที่ของ BU; รายการที่ไม่มี `at_date` หรือไม่มีข้อมูลแก้ไขล่าสุด จะไม่ render ส่วนนั้น (ไม่ใช่แสดงค่าว่าง) และรายการที่ไม่มีสกุลเงินผูกอยู่จะแสดง Badge เป็น "—"

---

## TC-ER-020003 — dialog แก้ไขแก้ได้เฉพาะตัวเลขอัตรา สกุลเงินและวันที่เป็นข้อมูลอ่านอย่างเดียว
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิด dialog แก้ไขจากรายการใดก็ได้
**Steps**
1. เปิด dialog แก้ไข
2. สำรวจทุกองค์ประกอบที่รับค่าได้ใน dialog
**Expected**
dialog มีช่องกรอกเพียงช่องเดียวคือ "Exchange Rate · New" (input ชนิดตัวเลข `min=0`, `step=0.0001`, จัดชิดขวา); **ไม่มี** ตัวเลือกสกุลเงินและ **ไม่มี** ช่องวันที่ให้แก้ — สองค่านั้นปรากฏเป็นข้อความในแถบข้อมูลประกอบเท่านั้น; เหนือช่องกรอกมีกล่อง "Currency Code · Current" แสดงอัตราปัจจุบันทศนิยม 5 ตำแหน่ง

---

## TC-ER-020004 — ปุ่ม Save ปิดอยู่จนกว่าค่าอัตราจะเปลี่ยน
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog แก้ไขของรายการที่มีอัตราปัจจุบันไม่เป็น 0
**Steps**
1. เปิด dialog แก้ไขโดยยังไม่แตะช่องกรอก แล้วอ่านสถานะปุ่ม Save
2. แก้ตัวเลขในช่องอัตราให้ต่างจากเดิม แล้วอ่านสถานะปุ่มอีกครั้ง
3. แก้กลับไปเป็นค่าเดิม แล้วอ่านสถานะปุ่มอีกครั้ง
**Expected**
ขั้นที่ 1 ปุ่ม "Save" ถูก disable (ค่ายังไม่เปลี่ยน); ขั้นที่ 2 ปุ่มเปิดใช้งาน; ขั้นที่ 3 ปุ่มกลับไป disable อีกครั้ง — เกณฑ์คือส่วนต่างมากกว่า 1e-6 ไม่ใช่การแตะช่องกรอก; ปุ่ม "Cancel" เปิดใช้งานตลอด

---

## TC-ER-020005 — ตัวชี้ส่วนต่างเปลี่ยนตามค่าที่กรอก (Increase / Decrease / No change)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด dialog แก้ไขของรายการที่รู้ค่าอัตราปัจจุบัน (สมมติ 35.00000)
**Steps**
1. กรอกอัตราใหม่ที่สูงกว่าค่าปัจจุบัน
2. กรอกอัตราใหม่ที่ต่ำกว่าค่าปัจจุบัน
3. กรอกกลับเป็นค่าปัจจุบันเป๊ะ ๆ
**Expected**
ขั้นที่ 1 กล่องส่วนต่างแสดงไอคอนกราฟขึ้นพร้อมป้าย "INCREASE" ตัวเลขส่วนต่างขึ้นต้นด้วย `+` และเปอร์เซ็นต์ขึ้นต้นด้วย `+` ทศนิยม 2 ตำแหน่ง; ขั้นที่ 2 เปลี่ยนเป็นไอคอนกราฟลง ป้าย "DECREASE" และเปอร์เซ็นต์ขึ้นต้นด้วยเครื่องหมายลบ; ขั้นที่ 3 เปลี่ยนเป็นไอคอนขีดกลาง ป้าย "NO CHANGE" และไม่แสดงบรรทัดเปอร์เซ็นต์; คำอธิบายใต้ป้ายอ่านว่า "vs current rate" เสมอ

---

## TC-ER-020006 — ปุ่ม Cancel ปิด dialog แก้ไขโดยไม่บันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog แก้ไขของรายการแรก และจดค่าอัตราที่แสดงในตารางไว้
**Steps**
1. แก้ตัวเลขในช่องอัตราให้ต่างจากเดิม
2. คลิกปุ่ม "Cancel"
**Expected**
dialog ปิดลงโดยไม่มี toast ใด ๆ; ค่าอัตราของแถวนั้นในตารางยังเป็นค่าเดิม; เปิด dialog เดิมซ้ำแล้วช่องกรอกกลับไปเป็นค่าจากข้อมูล ไม่ใช่ค่าที่พิมพ์ค้างไว้

---

## TC-ER-020007 — กรอกอัตราติดลบใน dialog แก้ไขแล้วบันทึกไม่ผ่าน
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog แก้ไขของรายการใดก็ได้
**Steps**
1. กรอกค่า `-1` ลงในช่องอัตรา
2. คลิกปุ่ม "Save"
3. hover หรือ focus ที่ช่องอัตราเพื่อดู tooltip
**Expected**
dialog ไม่ปิดและไม่มี toast สำเร็จ; ช่องอัตราขึ้นสถานะผิดพลาด — กรอบสีแดงพร้อมไอคอนแจ้งเตือนวางไว้ฝั่งซ้ายของช่อง (`errorIconAlign="left"`); ข้อความ "Exchange Rate must be 0 or more" ปรากฏใน tooltip เมื่อ hover/focus (ไม่ใช่ข้อความ inline — ดูหมายเหตุข้อ 5); ไม่มีคำขอ PATCH ถูกส่งออกไป

---

## TC-ER-020008 — ปุ่ม Add Manual เปิด dialog สร้างที่มีสามฟิลด์บังคับ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/config/exchange-rate` ด้วย Admin
**Steps**
1. คลิกปุ่ม "Add Manual"
2. อ่านหัว dialog และรายการฟิลด์
**Expected**
เปิด dialog หัวข้อ "Add Manual Exchange Rate" พร้อมคำอธิบาย "Add a custom rate for a specific currency and date."; มีสามฟิลด์ที่ทำเครื่องหมายว่าจำเป็นทั้งหมด: "Currency" (select), "Date" (ตัวเลือกวันที่) และ "Exchange Rate" (input ตัวเลข placeholder "1.0000", `min=0`, `step=0.0001`, จัดชิดขวา); footer มีปุ่ม "Cancel" และ "Save" โดยปุ่ม Save **เปิดใช้งานตั้งแต่แรก** (ต่างจาก dialog แก้ไขที่ปิดไว้จนกว่าค่าจะเปลี่ยน)

---

## TC-ER-020009 — ตัวเลือกสกุลเงินใน dialog สร้างไม่มีสกุลเงินฐานของ BU
**Priority:** High · **Test Type:** Functional
**Preconditions**
BU BLAVG ตั้งสกุลเงินฐานไว้แล้ว; มีสกุลเงินที่เปิดใช้งานอยู่ในระบบมากกว่า 1 สกุล และมีอย่างน้อย 1 สกุลที่ถูกปิดใช้งาน
**Steps**
1. คลิก "Add Manual"
2. เปิด select "Currency"
3. ไล่อ่านรายการสกุลเงินในลิสต์
**Expected**
ลิสต์แสดงเป็นรหัสสกุลเงิน และ **ไม่มี** สกุลเงินฐานของ BU อยู่ในตัวเลือก (ถูกกันออกด้วย `excludeIds`) เพราะการตั้งอัตราของสกุลเงินฐานเทียบกับตัวเองไม่มีความหมาย; สกุลเงินที่ปิดใช้งานก็ไม่อยู่ในลิสต์เช่นกัน **หมายเหตุสำหรับผู้เขียนสเปก:** ลิสต์ดึงมาแค่ `perpage: 30` — ระบบที่มีสกุลเงินเกิน 30 รายการจะเห็นไม่ครบ อย่าใช้เคสนี้ยืนยันความครบถ้วนของลิสต์

---

## TC-ER-020010 — ช่องวันที่ใน dialog สร้างตั้งค่าเริ่มต้นเป็นวันเวลาปัจจุบันและเลือกเวลาได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/exchange-rate` ด้วย Admin
**Steps**
1. คลิก "Add Manual"
2. อ่านค่าที่แสดงในช่อง "Date"
3. เปิดตัวเลือกวันที่
**Expected**
ช่อง Date ถูกเติมค่าเริ่มต้นเป็นวันเวลาปัจจุบันไว้แล้วตั้งแต่เปิด dialog (ไม่ใช่ช่องว่างที่มี placeholder "Pick a date"); ตัวเลือกที่เปิดขึ้นมีทั้งปฏิทินและส่วนเลือกเวลา (`includeTime`) ทำให้ระบุอัตราคนละเวลาในวันเดียวกันได้

---

## TC-ER-020011 — กด Save ใน dialog สร้างโดยไม่เลือกสกุลเงินแล้วช่องสกุลเงินขึ้นสถานะผิดพลาด
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog "Add Manual Exchange Rate" โดยยังไม่เลือกสกุลเงิน (ช่อง Date มีค่าเริ่มต้นอยู่แล้ว)
**Steps**
1. ปล่อยช่อง Currency ว่างไว้
2. กรอกอัตราเป็นตัวเลขที่ถูกต้อง เช่น `35`
3. คลิก "Save"
4. hover ที่ช่อง Currency เพื่อดู tooltip
**Expected**
dialog ไม่ปิดและไม่มี toast สำเร็จ; ช่อง Currency มี `aria-invalid` กรอบสีแดง และไอคอนแจ้งเตือน; ข้อความ "Currency is required" ปรากฏใน tooltip เมื่อ hover (tooltip จะไม่โชว์ขณะ select เปิดอยู่); ไม่มีคำขอ POST ถูกส่งออกไป

---

## TC-ER-020012 — ปุ่ม Cancel ปิด dialog สร้างโดยไม่บันทึก
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog "Add Manual Exchange Rate"; จดจำนวนรายการรวมที่หัวหน้ารายการไว้ก่อน
**Steps**
1. เลือกสกุลเงินและกรอกอัตราบางส่วน
2. คลิก "Cancel"
**Expected**
dialog ปิดลงโดยไม่มี toast; จำนวนรายการรวมไม่เปลี่ยน และไม่มีแถวใหม่ในตาราง; เปิด "Add Manual" ซ้ำแล้วฟอร์มยังถือค่าที่พิมพ์ค้างไว้หรือไม่ ให้บันทึกผลที่สังเกตได้จริงไว้ — โค้ดล้างฟอร์มเฉพาะตอนบันทึกสำเร็จเท่านั้น

---

## TC-ER-020013 — คำสั่งลบท้ายแถวเปิด dialog ยืนยันที่ระบุรหัสสกุลเงินและวันที่ของรายการ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่ `/config/exchange-rate` ในมุมมองตาราง ด้วย Admin ที่มีสิทธิ์ลบ; มีอัตราแลกเปลี่ยนอย่างน้อย 1 รายการที่มี `at_date`
**Steps**
1. จดรหัสสกุลเงินและวันที่ของแถวแรก
2. คลิกปุ่มจุดสามจุดท้ายแถว แล้วเลือก "Delete"
**Expected**
เปิดกล่องยืนยันที่มีไอคอนถังขยะ หัวข้อ "Exchange Rate" และคำอธิบายในรูป `<CODE> — <วันที่ของอัตราตามรูปแบบของ BU>` ซึ่งตรงกับแถวที่เลือก (ไม่ใช่ข้อความยืนยันกลาง ๆ); footer มีปุ่ม "Cancel" และปุ่ม "Delete" แบบ destructive

---

## TC-ER-020014 — ปุ่ม Cancel ใน dialog ยืนยันลบปิดกล่องโดยไม่ลบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิดกล่องยืนยันลบของรายการแรกไว้แล้ว; จดจำนวนรายการรวมที่หัวหน้ารายการไว้ก่อน
**Steps**
1. คลิกปุ่ม "Cancel" ในกล่องยืนยัน
**Expected**
กล่องปิดลงโดยไม่มี toast; แถวนั้นยังอยู่ในตารางและจำนวนรายการรวมไม่เปลี่ยน; ไม่มีคำขอ DELETE ถูกส่งออกไป

---

## TC-ER-020015 — dialog ยืนยันอัปเดตอัตราทั้งชุดแสดงส่วนต่างรายสกุลเงิน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
**ต้องมีแหล่งอัตราแลกเปลี่ยนภายนอกที่ `/api/exchange-rate?base=<BASE>` ตอบกลับเป็น JSON สำเร็จก่อน จึงจะรันเคสนี้ได้** (ดูหมายเหตุข้อ 3 — ปัจจุบัน endpoint นี้ยังไม่มีใครทำ ปุ่ม Update จึงถูก disable); ต้องมีสกุลเงินที่ไม่ใช่สกุลเงินฐานอยู่ในระบบอย่างน้อย 1 สกุล
**Steps**
1. ไปที่ `/config/exchange-rate` แล้วรอให้ปุ่ม "Update Exchange Rates" เปิดใช้งาน
2. คลิกปุ่มนั้น
3. อ่านเนื้อหาในกล่องยืนยัน
**Expected**
เปิดกล่องยืนยันหัวข้อ "Update Exchange Rates" พร้อม Badge จำนวนสกุลเงินที่จะถูกอัปเดต และคำอธิบาย "Update N currencies with the latest rates from external source? This will affect all future transactions."; ในกล่องมีรายการรายสกุลเงิน แต่ละบรรทัดแสดง Badge รหัสสกุลเงิน, ข้อความ "→ <BASE>", อัตราเดิมขีดฆ่า ตามด้วยลูกศรและอัตราใหม่, ส่วนต่างพร้อมเครื่องหมาย และเปอร์เซ็นต์ทศนิยม 2 ตำแหน่ง (บรรทัดที่ไม่เปลี่ยนแปลงจะไม่แสดงเปอร์เซ็นต์); footer มีปุ่ม "Cancel" และ "Confirm" พร้อมไอคอนรีเฟรช
