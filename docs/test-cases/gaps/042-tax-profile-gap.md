# Tax Profile — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/042-tax-profile.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/042-tax-profile.md`_

**Module:** Config — Tax Profile (โปรไฟล์ภาษี)
**Frontend route:** `routes/config/tax-profile`  •  **URL:** `/config/tax-profile`
**Prefix:** `TP`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/042-tax-profile.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 28

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/042-tax-profile.spec.ts` ถือ ID `TC-TP-010001..010005`, `030001`, `040001..040004`, `050001..050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-TP-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, create → edit name → delete ครบรอบ, toggle `is_active` แล้ว persist, แก้ชื่อแล้ว persist, Cancel การแก้ไขแล้วค่าไม่ถูกบันทึก, ยกเลิกการลบแล้ว record ยังอยู่, name ว่าง (ทั้งตอนสร้างและตอนแก้), name ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 30/90 ใช้ไม่ได้กับ prefix `TP`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `042-tax-profile.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30) และเคส edge (ปกติอยู่บล็อก 90) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือหน้า list ส่วนเคสข้ามโมดูล (`TC-TP-040007`, ปกติเป็น Integration บล็อก 30) ถูกจัดเข้าบล็อก **04** เพราะมันคือผลที่ตามมาจากการแก้สถานะของระเบียน — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `042-tax-profile.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 3. **Tax profile ไม่มีฟิลด์ `code` และไม่มี `description`** — ต่างจาก `083-shelf.md` ที่ใช้เทียบ: ฟอร์มมีแค่ Name (บังคับ, `maxLength 100`, placeholder `e.g. VAT 7%, None`), Tax Rate (%) (บังคับ, `input[type=number]`, `step="any"`, `inputMode="decimal"`, placeholder `e.g. 7`, ชิดขวาแบบ tabular) และ status switch เคสใดที่ shelf ผูกกับ code/order/description จึงถูกแปลงมาเป็น **Tax Rate (%)** ของโมดูลนี้แทน ยืนยันจาก `routes/config/tax-profile/tax-profile-dialog.tsx` และ `tax-profile-form-schema.ts`
> 4. **`tax_rate` แสดง error ได้จริง — ต่างจาก `decimal_place` ของ unit** — schema คือ `z.number().min(0, tv("taxRatePositive"))` **ไม่มี `.catch()`** ครอบ ดังนั้น (ก) ล้างช่องให้ว่าง → `valueAsNumber` ให้ `NaN` → zod v4 ปฏิเสธด้วยข้อความ default ที่ยังไม่ได้แปล (ข) ค่าติดลบ → ข้อความ `Tax rate must be positive` (ค) **ไม่มี `max`** ค่ามากผิดปกติ เช่น `999` จึงผ่าน client validation และ (ง) `0` ผ่านเพราะกติกาจริงคือ `min(0)` แม้ถ้อยคำจะบอกว่า "positive" — เคส `TC-TP-200004..200006` เขียนตามกติกาจริงนี้ ไม่ได้เขียนว่าถ้อยคำผิด
> 5. **ข้อความ error ไม่ได้อยู่ใต้ช่องกรอก** — `FieldInput` (`components/ui/field.tsx`) ไม่ render `<p>` ใต้ช่อง แต่ใส่ `aria-invalid="true"` บน input + ไอคอน `CircleAlert` **ในตัวช่อง** และเก็บข้อความไว้ใน Tooltip ที่เห็นเมื่อ hover/focus เท่านั้น ช่อง Tax Rate ตั้ง `errorIconAlign="left"` (ไอคอนอยู่ซ้าย) เพราะตัวเลขชิดขวา ส่วนช่อง Name ใช้ค่าเริ่มต้นคือไอคอนอยู่ขวา — เคส validation ในเอกสารนี้ assert ตามนี้ ไม่ใช่ assert ข้อความใต้ช่องแบบแคตตาล็อก shelf
> 6. **หัวคอลัมน์ในตารางกับหัวคอลัมน์ในไฟล์ export ใช้คนละคำ** — ตารางใช้ `field.rate` = `Rate` (`use-tax-profile-table.tsx`) ส่วน export, label ในฟอร์ม และแถวในการ์ดใช้ `field.taxRate` = `Tax Rate (%)` (`tax-profile-component.tsx`, `tax-profile-dialog.tsx`, `tax-profile-card.tsx`) บันทึกไว้เป็นข้อเท็จจริง เคสที่เกี่ยวข้อง assert คำที่ UI แสดงจริงในแต่ละที่
> 7. **เมนู Toggle Columns และเมนูเรียงลำดับเรียกคอลัมน์สถานะว่า `is_active`** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ไม่ได้ตั้ง `meta.headerTitle` ทั้งสองเมนูจึง fallback ไปใช้ column id ดิบ (หัวคอลัมน์ในตารางยังเป็น `Status` ตามปกติ) — `TC-TP-010013` assert ตามที่ UI แสดงจริง ไม่ได้ระบุว่าเป็นบั๊ก
> 8. **Blocker ของการรันเทส — tax profile ถูกอ้างโดยโมดูลอื่น** — `components/lookup/lookup-tax-profile.tsx` ถูกใช้ใน PR (`pr-money-fields.tsx`), PO (`po-item-cells/tax-cell.tsx`), procurement shared (`discount-tax-override.tsx`), product (`pd-tab-general.tsx`), category (`category-form.tsx`) และ price list (`pl-item-cells.tsx`) picker ตัวนี้ `filter((t) => t.is_active)` และโหลดแค่ `useTaxProfile({ perpage: 30 })` ผลคือ (ก) **ปิดใช้งานหรือลบโปรไฟล์ที่เอกสารอ้างอยู่ จะทำให้ช่องเลือกของเอกสารนั้นไม่มี option ที่ตรงกับค่าที่บันทึกไว้** และ (ข) **โปรไฟล์ลำดับที่ 31 เป็นต้นไปไม่มีวันโผล่ใน picker เลย** (ไม่มีการค้นหา ไม่มีการโหลดเพิ่ม) ข้อ (ข) บันทึกไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส — และทั้งสองข้อคือเหตุผลที่ **ห้ามรันเคส create/delete ชุดนี้บน BU ที่มีเอกสารจริงพึ่งพาอยู่** ให้ทุกเคสสร้างและลบระเบียนของตัวเองเท่านั้น
> 9. **อัตราภาษีถูก snapshot ลงเอกสารตอนเลือก** — `TaxProfileCell` เรียก `form.setValue(items.<N>.tax_rate, rate)` ทันทีที่เลือกโปรไฟล์ และโหมดอ่านอย่างเดียวของเซลล์แสดง `tax_rate` ที่เก็บไว้ (ไม่ใช่ชื่อโปรไฟล์) ดังนั้นการแก้อัตราภายหลัง**ไม่**ย้อนไปแก้เอกสารเดิม `TC-TP-040007` จึงยืนยันแค่ฝั่ง picker ไม่ได้ยืนยันเอกสารที่ออกไปแล้ว
> 10. **PATCH ต้องมี `doc_version`** — `ConfigEntityDialog` ส่ง `{ id, doc_version, ...payload }` ให้ `useUpdateTaxProfile` อยู่แล้ว (`TaxProfile.doc_version` เป็น required field) ถ้าเคสแก้ไขเจอ 400 ให้ตรวจสายนี้ก่อน อย่าเพิ่งสรุปว่าเป็นบั๊กของเทส
> 11. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-TP-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-TP-010007 | เรียงลำดับเริ่มต้นตามอัตราภาษีและสลับทิศจากเมนูเรียงลำดับ | Medium | Functional |
| TC-TP-010008 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-TP-010009 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-TP-010010 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-TP-010011 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-TP-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-TP-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-TP-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-TP-010015 | ส่งออกรายการโปรไฟล์ภาษีเป็นไฟล์ XLSX | Medium | Functional |
| TC-TP-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-TP-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-TP-010018 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-TP-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-TP-030003 | สร้างโปรไฟล์ภาษีที่อัตราเป็นทศนิยมแล้วค่าคงอยู่ | Medium | Happy Path |
| TC-TP-030004 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-TP-040005 | แก้ไขอัตราภาษีแล้วค่าคงอยู่ | High | CRUD |
| TC-TP-040006 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-TP-040007 | ปิดใช้งานโปรไฟล์ภาษีแล้วหายจากตัวเลือกในเอกสาร | High | Functional |
| TC-TP-050003 | ข้อความยืนยันลบแสดงชื่อโปรไฟล์ภาษี | Medium | Functional |
| TC-TP-050004 | ลบโปรไฟล์ภาษีจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-TP-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-TP-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-TP-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-TP-100008 | ไม่มีสิทธิ์ดู — เมนู Tax Profile ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-TP-200004 | เว้นช่องอัตราภาษีว่างแล้วบันทึกต้องถูกบล็อก | High | Validation |
| TC-TP-200005 | อัตราภาษีติดลบต้องถูกบล็อกพร้อมข้อความเตือน | High | Validation |
| TC-TP-200006 | ช่องอัตราภาษีรับทศนิยมได้และไม่มีขอบบนที่ตัว input | Medium | Validation |

---
## TC-TP-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/tax-profile`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Tax Profile" พร้อมคำอธิบายใต้ชื่อ; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Name, **Rate** (จัดชิดขวา และค่าที่แสดงมีเครื่องหมาย `%` ต่อท้าย เช่น `7%`), Status และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view, ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Tax Profile"

---
## TC-TP-010007 — เรียงลำดับเริ่มต้นตามอัตราภาษีและสลับทิศจากเมนูเรียงลำดับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/tax-profile` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีโปรไฟล์ภาษีอย่างน้อย 2 รายการที่อัตราต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายชื่อในเมนู
3. เลือก "Rate"
4. เลือกแถว "Default"
**Expected**
หน้านี้**มี default sort เป็น `tax_rate:asc`** (ต่างจาก `/config/unit` ที่ไม่มี) — เข้าครั้งแรก URL **ไม่มี** `sort` แต่แถวข้อมูลเรียงตามอัตราจากน้อยไปมาก และในเมนูจะเห็นทั้งแถว "Default" ถูกกำกับ **และ** แถว "Rate" มีลูกศรขึ้น พร้อมกัน; เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้คือ Name, Rate, `is_active`, Created, Updated (ดูหมายเหตุข้อ 7); เลือก "Rate" ขณะที่มันเป็นคอลัมน์ปัจจุบัน → พลิกเป็น `sort=tax_rate:desc` พร้อมลูกศรลงและลำดับแถวสลับ; เลือก "Default" → `sort` ถูกล้างออกจาก URL และกลับไปเรียงตามอัตราจากน้อยไปมาก

---
## TC-TP-010008 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile`; มีโปรไฟล์ภาษีหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับโปรไฟล์ที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` ยิง `onSearch` เฉพาะตอน Enter); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-TP-010009 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย; คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-TP-010010 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile`; มีโปรไฟล์ภาษีทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
**Expected**
ตัวกรองของโมดูลนี้มีชุดเดียวคือ Status (ยืนยันจาก `tax-profile-filter-fields.ts` — ไม่มีตัวกรองตามช่วงอัตราภาษี); ตารางเหลือเฉพาะโปรไฟล์ที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip ของสถานะพร้อมปุ่มลบ; query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน

---
## TC-TP-010011 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมดโดยยังเรียงตามอัตราภาษีจากน้อยไปมากตาม default sort ของหน้า

---
## TC-TP-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` บนหน้าจอขนาด desktop; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อโปรไฟล์เป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว **"Tax Rate (%)"** ที่แสดงตัวเลขอัตราแบบ tabular **โดยไม่มีเครื่องหมาย `%` ต่อท้ายค่า** (ต่างจากคอลัมน์ Rate ในตาราง) และแถวข้อมูล Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; **การ์ดไม่มีแถว Description** เพราะโมดูลนี้ไม่มีฟิลด์นั้น; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-TP-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตรายการในเมนูและสถานะติ๊กของ Created กับ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Rate
**Expected**
เมนูแสดงรายการ Name, Rate, `is_active`, Created, Updated พร้อม checkbox — รายการสถานะขึ้นเป็น column id ดิบ `is_active` ไม่ใช่คำว่า Status (ดูหมายเหตุข้อ 7); Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น (ตรงกับ `columnVisibility` เริ่มต้นใน `use-tax-profile-table.tsx`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Rate แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-TP-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` ในมุมมองตาราง; BU มีโปรไฟล์ภาษีมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือกจำนวนแถวท้ายตาราง
2. เปลี่ยนจำนวนแถวเป็น 5
3. คลิกปุ่มไปหน้าถัดไป
4. คลิกปุ่มไปหน้าแรก
**Expected**
ค่าเริ่มต้นของจำนวนแถวคือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-TP-010015 — ส่งออกรายการโปรไฟล์ภาษีเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` บน desktop; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ชื่อขึ้นต้นด้วย `taxProfile_<YYYY-MM-DD>` ที่มี **3 คอลัมน์** ตามลำดับ Name / **Tax Rate (%)** / Status — สังเกตว่าหัวคอลัมน์อัตราในไฟล์คือ "Tax Rate (%)" ไม่ใช่ "Rate" แบบในตาราง (หมายเหตุข้อ 6); ค่าอัตราในไฟล์เป็น**ตัวเลขล้วน ไม่มี `%`** และแถวที่ไม่มีค่าอัตราถูกส่งออกเป็น `0`; Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-TP-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-TP-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/tax-profile` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view แล้วเลือกบันทึกตัวกรองปัจจุบันเป็น view
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
view ถูกผูกกับ page key ของโมดูลนี้เท่านั้น (`LIST_PAGE_KEYS.TAX_PROFILE` = `tax_profile`) จึงไม่โผล่ในหน้า config อื่น; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-TP-010018 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/tax-profile` และมีโปรไฟล์ภาษีอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** เพราะ `use-tax-profile-table.tsx` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction`) เท่านั้น; เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมที่หัวเรื่องอ้าง**ชื่อ**ของโปรไฟล์แถวนั้น (`activity.label = (r) => r.name`) และปิด sheet กลับมาหน้าเดิมได้โดยข้อมูลไม่เปลี่ยน

---
## TC-TP-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/tax-profile`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Tax Profile"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Tax Profile" พร้อมไอคอนเปอร์เซ็นต์ที่หัว dialog; ช่อง Name ว่างและมี placeholder `e.g. VAT 7%, None` พร้อมเครื่องหมายบังคับกรอกที่ label; ช่อง "Tax Rate (%)" แสดงค่า `0` (ค่าจาก `EMPTY_FORM`) มี placeholder `e.g. 7` และจัดตัวเลขชิดขวา พร้อมเครื่องหมายบังคับกรอกที่ label เช่นกัน; กล่องสถานะแสดงหัวข้อ "Active" พร้อมคำอธิบาย "Enable or disable this record", สวิตช์อยู่ที่เปิด (`aria-checked="true"`) และมี badge "Active" ใต้สวิตช์; footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save)

---
## TC-TP-030003 — สร้างโปรไฟล์ภาษีที่อัตราเป็นทศนิยมแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/tax-profile`
**Steps**
1. คลิกปุ่ม "Add Tax Profile"
2. กรอก Name ที่ไม่ซ้ำ
3. กรอก Tax Rate (%) เป็น `7.5`
4. คลิกปุ่ม Create
5. ค้นหาชื่อที่เพิ่งสร้างในตาราง แล้วเปิดรายการนั้นซ้ำ
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ไม่มี error ที่ช่องอัตรา (ช่องเป็น `step="any"` จึงรับทศนิยมได้); แสดง toast "Tax Profile created successfully" และ dialog ปิดเอง; แถวใหม่ในตารางแสดงคอลัมน์ Rate เป็น `7.5%` (จัดชิดขวา); เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Tax Rate (%) ยังเป็น `7.5` (ค่าถูก persist จริง ไม่ใช่แค่แสดงผล)

---
## TC-TP-030004 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/tax-profile`; เปิด dialog "Add Tax Profile" และกรอก Name กับ Tax Rate (%) ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Tax Profile" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้น (Name ว่าง, Tax Rate (%) = `0`, สวิตช์สถานะเปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-TP-040005 — แก้ไขอัตราภาษีแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีโปรไฟล์ภาษีที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและ**ยังไม่ถูกอ้างจากเอกสารใด** (ดูหมายเหตุข้อ 8)
**Steps**
1. ค้นหาโปรไฟล์นั้นแล้วคลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog แก้ไข
2. แก้ช่อง Tax Rate (%) เป็นค่าใหม่ (เช่น จาก `7` เป็น `10`)
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. เปิด dialog ของโปรไฟล์นั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog ตอนแก้ไขคือ "Edit Tax Profile" และปุ่มบันทึกคือ **Save**; แสดง toast "Tax Profile updated successfully" และ dialog ปิดเอง; คอลัมน์ Rate ในตารางเปลี่ยนเป็น `10%` และเปิด dialog ซ้ำแล้วช่องแสดง `10` (คำขอ PATCH ต้องแนบ `doc_version` ไปด้วย ดูหมายเหตุข้อ 10)

---
## TC-TP-040006 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/tax-profile` และสลับเป็นมุมมองการ์ดแล้ว; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Tax Profile" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Name, Tax Rate (%), สวิตช์สถานะ); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-TP-040007 — ปิดใช้งานโปรไฟล์ภาษีแล้วหายจากตัวเลือกในเอกสาร
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีโปรไฟล์ภาษีที่เทสสร้างขึ้นเองและ**ยังไม่ถูกเอกสารใดอ้างถึง**; ผู้ใช้เปิดฟอร์มเอกสารที่มีช่องเลือก Tax Profile ได้ (เช่น หน้าแก้ไข product หรือ category); BU มีโปรไฟล์ภาษีที่เปิดใช้งานรวมกันไม่เกิน 30 รายการ (picker โหลดแค่ `perpage: 30` — หมายเหตุข้อ 8)
**Steps**
1. ไปที่ `/config/tax-profile` แล้วยืนยันว่าโปรไฟล์ของเทสมีสถานะ Active
2. เปิดฟอร์มเอกสารที่มีช่องเลือก Tax Profile แล้วกางตัวเลือก ยืนยันว่าเห็นชื่อโปรไฟล์นั้น แล้วปิดฟอร์มโดยไม่บันทึก
3. กลับมาที่ `/config/tax-profile` เปิด dialog ของโปรไฟล์นั้น ปิดสวิตช์สถานะ แล้วกด Save
4. เปิดฟอร์มเอกสารเดิมอีกครั้งแล้วกางตัวเลือก Tax Profile
5. ลบโปรไฟล์ที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ขั้นที่ 2 เห็นชื่อโปรไฟล์ในรายการตัวเลือก; หลังปิดใช้งาน (toast "Tax Profile updated successfully" และคอลัมน์ Status เปลี่ยนเป็น Inactive) ขั้นที่ 4 **ชื่อโปรไฟล์นั้นหายจากรายการตัวเลือกของเอกสาร** ขณะที่โปรไฟล์ที่ยังเปิดใช้งานอยู่ยังเลือกได้ตามปกติ (`LookupTaxProfile` กรองด้วย `is_active`); ฟอร์มเอกสารไม่ error และไม่มีค่าใดถูกบันทึกจากขั้นตอนนี้

---
## TC-TP-050003 — ข้อความยืนยันลบแสดงชื่อโปรไฟล์ภาษี
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีโปรไฟล์ภาษีที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยัน (role `alertdialog`) มีหัวข้อ "Delete Tax Profile" และคำอธิบายที่มีชื่อโปรไฟล์นั้นอยู่ในข้อความ (`Are you sure you want to delete tax profile "<ชื่อ>"? This action cannot be undone.`); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Tax Profile deleted successfully"

---
## TC-TP-050004 — ลบโปรไฟล์ภาษีจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีโปรไฟล์ภาษีที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของโปรไฟล์นั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Tax Profile deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-TP-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.tax_profile.view` แต่ไม่มี `configuration.tax_profile.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. ไปที่ `/config/tax-profile`
2. สังเกตสภาพปุ่ม "Add Tax Profile"
3. คลิกปุ่ม "Add Tax Profile"
**Expected**
ปุ่ม "Add Tax Profile" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้างโปรไฟล์ภาษี แต่เด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน

---
## TC-TP-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.tax_profile.view` แต่ไม่มี `configuration.tax_profile.update` และไม่ใช่ admin ของ BU; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/tax-profile`
2. คลิกชื่อโปรไฟล์ในคอลัมน์ Name เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง Name, ช่อง Tax Rate (%) และสวิตช์สถานะถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-TP-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.tax_profile.view` แต่ไม่มี `configuration.tax_profile.delete` และไม่ใช่ admin ของ BU; มีโปรไฟล์ภาษีอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/tax-profile`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"`; คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน gate ตัวเดียวกันผ่าน `useDeleteGate` ที่ derive prefix `configuration.tax_profile` จาก route) และไม่มีรายการใดถูกลบ

---
## TC-TP-100008 — ไม่มีสิทธิ์ดู — เมนู Tax Profile ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `configuration.tax_profile.view` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังมี license ของ feature `configuration.tax_profile` อยู่ — leaf นี้ไม่ได้ประกาศ `licenseFeature` ตรง ๆ แต่ `licenseFeatureOf()` derive จาก permission ได้ key เดียวกัน ถ้า BU ไม่มี license รายการจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผล
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar
2. สังเกตรายการ "Tax Profile"
3. คลิกรายการ "Tax Profile"
**Expected**
รายการ "Tax Profile" ยังอยู่ในเมนูแต่ถูกทำให้จางและ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/tax-profile">` ให้กดไปหน้า; ไม่มีไอคอนแม่กุญแจ (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-TP-200004 — เว้นช่องอัตราภาษีว่างแล้วบันทึกต้องถูกบล็อก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Tax Profile" และกรอก Name ที่ไม่ซ้ำไว้แล้ว
**Steps**
1. ล้างค่าในช่อง Tax Rate (%) ให้ว่าง
2. คลิกปุ่ม Create
3. ชี้เมาส์ (hover) ที่ช่อง Tax Rate (%)
4. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
dialog **ไม่ปิด** และไม่มีโปรไฟล์ถูกสร้าง (ไม่มี toast); ช่อง Tax Rate (%) มี `aria-invalid="true"` และมีไอคอนเตือนวงกลมอยู่**ด้านซ้ายในตัวช่อง** (`errorIconAlign="left"` เพราะตัวเลขชิดขวา); ข้อความ error ปรากฏใน tooltip เมื่อ hover/focus เท่านั้น ไม่ใช่ข้อความใต้ช่อง และเป็นข้อความ default ของ zod ที่ยังไม่ได้แปล (ช่องว่าง → `valueAsNumber` ให้ `NaN` ซึ่ง `z.number()` ปฏิเสธ — ดูหมายเหตุข้อ 4); กด Cancel แล้ว dialog ปิดโดยไม่บันทึกอะไร

---
## TC-TP-200005 — อัตราภาษีติดลบต้องถูกบล็อกพร้อมข้อความเตือน
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Tax Profile" และกรอก Name ที่ไม่ซ้ำไว้แล้ว
**Steps**
1. กรอก Tax Rate (%) เป็น `-1`
2. คลิกปุ่ม Create
3. ชี้เมาส์ (hover) ที่ช่อง Tax Rate (%) เพื่ออ่านข้อความเตือน
4. แก้ค่าเป็น `0` แล้วคลิก Create
5. ลบรายการที่ถูกสร้างเพื่อคืนสภาพ
**Expected**
ขั้นที่ 2 dialog ไม่ปิดและไม่มีโปรไฟล์ถูกสร้าง; ช่องมี `aria-invalid="true"` พร้อมไอคอนเตือน และ tooltip แสดงข้อความ "Tax rate must be positive"; ขั้นที่ 4 ค่า `0` **ผ่าน** validation (กติกาจริงคือ `min(0)` ไม่ใช่ "มากกว่า 0") สร้างสำเร็จพร้อม toast "Tax Profile created successfully" และแถวใหม่แสดงคอลัมน์ Rate เป็น `0%`

---
## TC-TP-200006 — ช่องอัตราภาษีรับทศนิยมได้และไม่มีขอบบนที่ตัว input
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Tax Profile" อยู่
**Steps**
1. ตรวจ attribute ของช่อง Tax Rate (%) (`#tax-profile-rate`)
2. กรอกค่าทศนิยมละเอียด เช่น `0.25` แล้วสังเกตว่ามี error หรือไม่
3. กรอกค่าสูงผิดปกติ เช่น `999` แล้วสังเกตว่ามี error หรือไม่
**Expected**
ช่องเป็น `input[type="number"]` ที่มี `step="any"` และ `inputmode="decimal"` จัดตัวเลขชิดขวาแบบ tabular — **ไม่มี attribute `min` และไม่มี `max`** บนตัว input (ต่างจากช่อง Decimal Places ของ `/config/unit` ที่มี `min`/`max`/`step="1"`); ทั้ง `0.25` และ `999` ไม่ทำให้เกิด error ที่ช่อง (`aria-invalid` ไม่ถูกตั้ง) เพราะ schema จำกัดแค่ขอบล่างที่ `0` ไม่มีขอบบน
