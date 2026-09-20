# Currency — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — ส่วนที่ทดสอบจริงอยู่แล้วอยู่ใน `tests/040-currency.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/040-currency.md` เอกสารนี้เขียนจากโค้ดจริงของแอปที่ `routes/config/currency/` (currency.route.tsx, currency-component.tsx, currency-card.tsx, currency-dialog.tsx, currency-filter-fields.ts, currency-form-schema.ts, use-currency-table.tsx) รวมถึงของกลางที่โมดูลนี้ใช้ (`components/templates/config-list-template.tsx`, `components/templates/config-entity-dialog.tsx`, `components/lookup/lookup-currency-iso.tsx`, `components/lookup/lookup-combobox.tsx`, `components/lookup/lookup-currency.tsx`, `components/share/list-card.tsx`, `components/share/document-list-actions.tsx`, `components/search-input.tsx`, `components/ui/data-grid/*`, `components/ui/field.tsx`, `components/ui/status-switch.tsx`, `components/route-guard.tsx`, `hooks/use-currency.ts`, `hooks/use-data-grid-state.ts`, `hooks/use-list-page-state.ts`, `hooks/use-delete-gate.ts`, `hooks/use-profile.ts`, `routes/config/shared/use-exchange-rate.ts`, `constant/module-list.ts`, `constant/permissions.ts`, `constant/currencies-iso.ts`, `messages/en.json`) และตรวจ route ที่ `routes/router.tsx:96-97`_

**Module:** Config — Currency (สกุลเงิน)
**Frontend route:** `routes/config/currency`  •  **URL:** `/config/currency`
**Prefix:** `CUR`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/040-currency.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 33

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (จึงไม่เขียนซ้ำในไฟล์นี้)** — `tests/040-currency.spec.ts` ถือ ID `TC-CUR-010001..010005`, `030001`, `040001..040004`, `050001..050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-CUR-100001..100003` (+ `100004` ที่ `skipAuth: true` จึงเป็น `test.skip` แต่ **ยังถือครองเลข** ห้ามนำไปใช้ซ้ำ) เรื่องที่ครอบแล้วคือ: โหลดหน้า list + URL ตรง, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, สร้างผ่าน LookupCurrencyIso (IDR) จนแถวขึ้นในตาราง, แก้ชื่อ/ยืนยันว่าค่าคงอยู่, ยกเลิกการแก้ไขแล้วค่าไม่ถูกบันทึก, toggle `is_active` แล้ว persist, ลบสำเร็จ, ยกเลิกการลบ, บันทึกโดยไม่กรอกชื่อ (ทั้งตอนสร้างและตอนแก้) ต้องขึ้น error, ชื่อซ้ำ (`test.fixme`), XSS/SQL payload ในช่องชื่อ-ช่องค้นหา และ name maxLength 100
> 2. **คอมเมนต์ที่ `tests/040-currency.spec.ts:401` อ้าง `TC-DEP-010011` ของโมดูล department** — เป็นการอ้างอิงข้ามโมดูลในคอมเมนต์เท่านั้น ไม่ใช่ ID ของ currency อย่าสับสน
> 3. **ขอบเขต section** — `docs/test-id-scheme.md` ลงทะเบียนให้ `CUR` ไว้แค่ `01, 03–05, 10, 20` (เอกสารนี้ไม่ได้แก้ scheme) ตามขนบแล้ว Export ควรอยู่ `30`, edge case ควรอยู่ `90` และเคสเชื่อมข้ามโมดูลควรอยู่ `30` — ที่นี่จึงจัด Export/edge/saved view เข้า **บล็อก 01** (เป็นพฤติกรรมของแถบเครื่องมือหน้า list) และจัดเคสเชื่อมกับ exchange-rate เข้า **บล็อก 04** (ตัวกระทำคือการแก้สถานะ/สร้างสกุลเงิน) ตรงตามข้อจำกัดที่บันทึกไว้ใน `docs/test-cases/gaps/README.md`
> 4. **`decimal_places` ไม่มีช่องกรอกใน dialog** — schema มี (`z.coerce.number().int().min(0).max(8)`), `toFormValues`/`toPayload` ส่งค่าไปกับ payload และคอลัมน์ Decimal Places ก็อยู่ในไฟล์ export แต่ `CurrencyFields` ไม่ได้ render input ให้เลย ผลคือการสร้างใหม่ส่ง `2` เสมอ (`EMPTY_FORM.decimal_places = 2`) และการแก้ไขคงค่าเดิมไว้ (`e.decimal_places ?? 2`) — บันทึกไว้เป็นข้อเท็จจริง **ไม่เขียนเป็นเทสเคส**
> 5. **ช่อง Symbol ถูก `disabled` ตายตัว** (`currency-dialog.tsx:117` ใส่ `disabled` ดิบ ไม่ได้ผูกกับ `disabled` ของฟอร์ม) — ค่ามาจาก auto-fill ของรหัส ISO เท่านั้น ทั้งโหมดสร้างและแก้ไข ดังนั้นกติกา `.max(5, symbolMaxLength)` ใน schema ไม่มีทางถูกกระตุ้นจาก UI จึงไม่มีเคส validation ของ symbol ในไฟล์นี้
> 6. **auto-fill ไม่เคยเติมอัตราแลกเปลี่ยนให้** — `useExternalExchangeRates` ยิง `fetch("/api/exchange-rate?base=…")` ซึ่งเป็น Next API route เดิมที่ยังไม่มีทั้งใน SPA และ gateway (TODO กำกับไว้ที่ `routes/config/shared/use-exchange-rate.ts:103`) โค้ดจึงเติมเฉพาะ name / symbol / description และ **ปล่อยอัตราไว้ที่ `0` โดยตั้งใจ** (คอมเมนต์ `currency-dialog.tsx:66-68` ระบุว่าห้ามยัดค่าหลอก) เคส `TC-CUR-030003` จึง assert ว่าช่องอัตรายังเป็น `0` ตามออกแบบ ไม่ได้ assert ว่า "ฟีเจอร์เสีย"
> 7. **รายการ ISO ไม่ตัดสกุลเงินที่ BU มีอยู่แล้วออก** — `LookupCurrencyIso` ป้อน `currenciesIso` ทั้งชุด 47 รหัสตายตัวจาก `constant/currencies-iso.ts` ไม่ได้ยิงถาม backend ว่ามีอะไรแล้ว เลือกรหัสที่ซ้ำกับของเดิมได้ตามปกติ — backend จะปฏิเสธหรือไม่ **ยังไม่ยืนยัน** (คู่ขนานกับ `TC-CUR-200003` ที่ถูก `test.fixme` ไว้เรื่องชื่อซ้ำ) จึงไม่เขียนเป็นเคสในรอบนี้
> 8. **BLOCKER ข้ามโมดูล — สกุลเงินเป็นข้อมูลอ้างอิงของ exchange-rate** `routes/config/exchange-rate/exchange-rate-dialog.tsx:266,318-323` ใช้ `LookupCurrency` ซึ่ง (ก) ดึงรายการด้วย `useCurrency({ perpage: 30 })` — **สกุลเงินลำดับที่ 31 ขึ้นไปของ BU จะไม่โผล่ในตัวเลือกเลย**, (ข) กรองเฉพาะ `c.is_active` — **ปิดใช้งานสกุลเงินแล้วตัวเลือกหายทันที** (คือเคส `TC-CUR-040008`), (ค) `excludeIds = new Set([defaultCurrencyId])` — สกุลเงินฐานของ BU (จาก `useProfile().defaultCurrencyId` ← `defaultBu.config.default_currency_id`) ถูกตัดออกเสมอ (เคสนั้นอยู่ที่ `docs/test-cases/gaps/041-exchange-rate-gap.md` → `TC-ER-020009` ไม่ยกมาซ้ำ) · **ส่วนการลบสกุลเงินที่มีอัตราแลกเปลี่ยนอ้างถึงอยู่ ยังไม่มีเคสในไฟล์นี้** เพราะพฤติกรรมฝั่ง backend (ปฏิเสธด้วย FK / soft-delete / ปล่อยผ่านแล้วทิ้งอัตรากำพร้า) ยังไม่ได้ยืนยัน — **ต้องตรวจกับ backend ก่อนเขียน** ห้ามเดา
> 9. **กล่องยืนยันลบอ้าง "รหัส" ไม่ใช่ "ชื่อ"** — `currency-component.tsx` ส่ง `entityNameField="code"` เข้า `ConfigListTemplate` ข้อความ `config.currency.deleteConfirm` ที่รับ `{name}` จึงได้ค่าของ `code` ต่างจาก unit / shelf ที่อ้างชื่อ (เคส `TC-CUR-050003`)
> 10. **เมนูคอลัมน์และเมนูเรียงลำดับเรียกคอลัมน์สถานะว่า `is_active`** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx:74-88` ไม่ได้ตั้ง `meta.headerTitle` ทั้งสองเมนูจึง fallback ไปใช้ `column.id` ดิบ (เมนูคอลัมน์มี class `capitalize` จึงเห็นเป็น "Is_active") ขณะที่หัวคอลัมน์ในตารางแสดง "Status" ตามปกติ — บันทึกไว้เป็นข้อเท็จจริงของ UI ปัจจุบัน ไม่ใช่สิ่งที่เคสไปยืนยันว่าถูกต้อง
> 11. **การ์ดไม่แสดงอัตราแลกเปลี่ยน** — `currency-card.tsx` มีเฉพาะแถว Status, Code, Symbol และแถว audit ต่างจากตารางที่มีคอลัมน์ Exchange Rate (เคส `TC-CUR-010013`)
> 12. **ข้อผิดพลาดของฟอร์มเป็นไอคอน + tooltip ไม่ใช่ข้อความ inline** — `FieldInput` / `LookupCombobox` แสดง `aria-invalid="true"` + ไอคอน `CircleAlert` และข้อความจะโผล่ใน tooltip เมื่อ hover/focus เท่านั้น เคส validation จึงตรวจ "สถานะผิดพลาดของช่อง" เป็นหลัก · เพิ่มเติม: ช่องอัตราที่ถูกล้างจนว่างจะกลายเป็น `NaN` (register ด้วย `valueAsNumber: true`) แล้วตกด่าน `z.number()` ซึ่ง **ไม่มีข้อความ custom** ข้อความใน tooltip กรณีนี้จึงเป็นข้อความ default ของ zod ที่ไม่ผ่าน i18n — เคส `TC-CUR-200004` จึงไม่ assert ข้อความ
> 13. **เมนูท้ายแถวไม่มี Edit** — `useCurrencyTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` → `actionColumn` render แค่ Activity + Delete ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ **Code** (`CellAction`) เท่านั้น ไม่ใช่คอลัมน์ Name
> 14. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CUR-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐานของสกุลเงิน | High | Smoke |
| TC-CUR-010007 | คอลัมน์ Exchange Rate แสดงทศนิยม 5 ตำแหน่งพร้อมรหัสสกุลเงินฐาน | High | Functional |
| TC-CUR-010008 | เรียงเริ่มต้นตามรหัสโดย URL ไม่มี sort และสลับทิศจากเมนูเรียงลำดับ | Medium | Functional |
| TC-CUR-010009 | ค้นหายิงเมื่อกด Enter และล้างคำค้นด้วยปุ่มกากบาท | Medium | Functional |
| TC-CUR-010010 | กรองตามสถานะ Active / Inactive แล้วล้างตัวกรองจากแถบ chip | Medium | Functional |
| TC-CUR-010011 | ซ่อน-แสดงคอลัมน์ Created / Updated ผ่านเมนูคอลัมน์ | Low | Functional |
| TC-CUR-010012 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-CUR-010013 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ดสกุลเงิน | Low | Functional |
| TC-CUR-010014 | ส่งออกรายการสกุลเงินเป็นไฟล์ XLSX เจ็ดคอลัมน์ | Medium | Functional |
| TC-CUR-010015 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-CUR-010016 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-CUR-010017 | เมนูท้ายแถวมีเฉพาะ Activity และ Delete และ Activity อ้างรหัสสกุลเงิน | Low | Functional |
| TC-CUR-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add Currency | Low | Functional |
| TC-CUR-030003 | เลือกรหัส ISO แล้วระบบเติมชื่อ สัญลักษณ์ และคำอธิบายให้อัตโนมัติ | High | Happy Path |
| TC-CUR-030004 | ค้นรหัส ISO ด้วยรหัส ชื่อ หรือประเทศ และกดรหัสเดิมซ้ำเพื่อยกเลิกการเลือก | Medium | Functional |
| TC-CUR-030005 | สร้างสกุลเงินพร้อมคำอธิบายที่พิมพ์ทับเอง แล้วค่าคงอยู่ | Medium | CRUD |
| TC-CUR-030006 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-CUR-040005 | โหมดแก้ไขปิดช่องรหัส และช่องสัญลักษณ์อ่านอย่างเดียวทั้งสองโหมด | High | Functional |
| TC-CUR-040006 | แก้อัตราแลกเปลี่ยนแล้วค่าคงอยู่และแสดงในคอลัมน์ | High | CRUD |
| TC-CUR-040007 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-CUR-040008 | ปิดใช้งานสกุลเงินแล้วหายจากตัวเลือกใน Add Manual ของ Exchange Rate | High | Functional |
| TC-CUR-040009 | สกุลเงินที่สร้างใหม่ปรากฏเป็นตัวเลือกใน Add Manual ของ Exchange Rate | Medium | Functional |
| TC-CUR-050003 | ข้อความยืนยันลบอ้างรหัสสกุลเงิน ไม่ใช่ชื่อ | Medium | Functional |
| TC-CUR-050004 | ลบสกุลเงินจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-CUR-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add Currency ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-CUR-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-CUR-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete และปุ่มบนการ์ดเด้งแจ้งสิทธิ์ | Medium | Authorization |
| TC-CUR-100008 | ไม่มีสิทธิ์ดู — เมนูใน sidebar จาง และ deep link เจอหน้าปฏิเสธสิทธิ์ | High | Authorization |
| TC-CUR-100009 | XSS payload ในช่องคำอธิบายต้องไม่รัน script | Medium | Security |
| TC-CUR-200004 | ล้างช่องอัตราแลกเปลี่ยนให้ว่างแล้วบันทึกไม่ผ่าน | High | Validation |
| TC-CUR-200005 | อัตราแลกเปลี่ยนเป็น 0 หรือค่าติดลบต้องถูกปฏิเสธ | High | Validation |
| TC-CUR-200006 | ไม่เลือกรหัส ISO แล้วบันทึก — สถานะผิดพลาดขึ้นที่ปุ่มเลือกรหัส | High | Validation |
| TC-CUR-200007 | ช่องคำอธิบายจำกัดที่ 256 ตัวอักษร | Low | Validation |

---
## TC-CUR-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐานของสกุลเงิน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสกุลเงินอย่างน้อย 1 รายการใน BU; เปิดบนหน้าจอขนาด desktop
**Steps**
1. ไปที่ `/config/currency`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. อ่านหัวหน้ารายการ แถบเครื่องมือ และหัวคอลัมน์ทั้งหมด
**Expected**
หัวหน้าแสดงชื่อ "Currency" พร้อมคำอธิบายใต้ชื่อว่า "Currencies you buy in, and the rate used to convert each one back to your base currency."; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Symbol (จัดกึ่งกลาง), Exchange Rate (จัดชิดขวา), Status (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; ค่าในคอลัมน์ Code เป็นปุ่มลิงก์ (`CellAction` — เป็น `<button>` ไม่ใช่ `<a href>`) ส่วนคอลัมน์ Name เป็นข้อความธรรมดา; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view ที่ขึ้นป้าย "No view", ปุ่ม "Filter", ปุ่มเรียงลำดับ (aria-label "Sort by"), ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และปุ่มสลับมุมมอง list/grid; แถบหัวมีปุ่ม Export, Print และ "Add Currency"

---
## TC-CUR-010007 — คอลัมน์ Exchange Rate แสดงทศนิยม 5 ตำแหน่งพร้อมรหัสสกุลเงินฐาน
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/config/currency` ในมุมมองตาราง; BU ตั้งสกุลเงินฐานไว้แล้ว (`default_currency_id` ของ BU มีค่า) และมีสกุลเงินที่กรอกอัตราไว้แล้วอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/currency`
2. อ่านค่าในคอลัมน์ Exchange Rate ของแถวที่มีอัตรา
3. เทียบกับแถวที่ยังไม่มีอัตรา (ถ้ามี)
**Expected**
หัวคอลัมน์ "Exchange Rate" จัดชิดขวา; แถวที่มีอัตราแสดงตัวเลขทศนิยม **5 ตำแหน่งเสมอ** (`EXCHANGE_RATE_DECIMALS = 5` เติมศูนย์ท้ายให้ครบ) พร้อมตัวคั่นหลักพันตาม locale และต่อท้ายด้วย **รหัสสกุลเงินฐานของ BU** เป็นข้อความตัวเล็กสีจาง; แถวที่อัตราเป็นค่าว่าง/0 แสดงขีด `-` ชิดขวาโดยไม่มีรหัสสกุลเงินฐานต่อท้าย

---
## TC-CUR-010008 — เรียงเริ่มต้นตามรหัสโดย URL ไม่มี sort และสลับทิศจากเมนูเรียงลำดับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/currency` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีสกุลเงินอย่างน้อย 2 รายการที่รหัสต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วอ่านรายการในเมนู
3. เลือก "Code"
4. เลือกแถว "Default"
**Expected**
เข้าครั้งแรก URL **ไม่มีพารามิเตอร์ `sort`** แต่แถวเรียงตามรหัสจากน้อยไปมาก (หน้านี้ตั้ง `defaultSort="code:asc"` ไว้ในโค้ด); ในเมนู แถว "Default" มีเครื่องหมายกำกับ (เพราะ `sort` บน URL ว่าง) ขณะที่แถว "Code" มีลูกศรขึ้นกำกับ (เพราะ sorting state สะท้อน default ของหน้า); เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้ คือ Code, Name, Symbol, Exchange Rate, คอลัมน์สถานะ (แสดงเป็นคีย์ดิบ `is_active` — ดูหมายเหตุข้อ 10), Created และ Updated; เลือก "Code" ขณะที่กำลังเรียงตาม Code อยู่แล้วจะ **สลับทิศ** ได้ `sort=code:desc` พร้อมลูกศรลง และลำดับแถวกลับด้าน; เลือก "Default" แล้วพารามิเตอร์ `sort` และ `page` ถูกล้างออกจาก URL และลำดับกลับเป็นรหัสจากน้อยไปมาก

---
## TC-CUR-010009 — ค้นหายิงเมื่อกด Enter และล้างคำค้นด้วยปุ่มกากบาท
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency`; มีสกุลเงินหลายรายการ และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกช่องค้นหาแล้วพิมพ์คำค้น **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string และไอคอนของปุ่มท้ายช่องค้นหา
4. คลิกปุ่มกากบาทท้ายช่องค้นหา
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางโหลดใหม่เหลือเฉพาะรายการที่ตรงกับคำค้น, query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกล้าง; เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเปลี่ยนจากไอคอนแว่นขยายเป็นกากบาท (aria-label "Clear search"); คลิกแล้วช่องว่าง, `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-CUR-010010 — กรองตามสถานะ Active / Inactive แล้วล้างตัวกรองจากแถบ chip
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency`; มีสกุลเงินทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม "Filter" ในแถบเครื่องมือ
2. เลือกแถว Status แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เลือก "Inactive" แทน แล้วสังเกตผล
5. คลิกลิงก์ "Clear" ท้ายแถบ chip
**Expected**
ตารางเหลือเฉพาะสกุลเงินที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบใต้แถบเครื่องมือขึ้นคำว่า "Filters:" พร้อม chip ของตัวกรองสถานะและปุ่มลบ chip (aria-label ขึ้นต้นด้วย "Remove"); query string มี `filter=is_active|bool:true` (encode แล้ว) และ `page` ถูกล้าง; เลือก "Inactive" แล้วผลสลับเป็น `filter=is_active|bool:false` และเหลือเฉพาะรายการที่ปิดใช้งาน; กด "Clear" แล้ว chip ทั้งหมดหาย, badge บนปุ่ม Filter หาย, พารามิเตอร์ `filter` (และ `sv` ถ้ามี) ถูกล้างจาก URL และตารางกลับมาแสดงทุกรายการ

---
## TC-CUR-010011 — ซ่อน-แสดงคอลัมน์ Created / Updated ผ่านเมนูคอลัมน์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. อ่านหัวข้อเมนูและสถานะติ๊กของแต่ละรายการ
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Symbol
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และรายการ Code, Name, Symbol, Exchange Rate, คอลัมน์สถานะ (แสดงเป็นคีย์ดิบ `is_active` ตามหมายเหตุข้อ 10), Created, Updated พร้อม checkbox — **ไม่มี** ช่องเลือกแถวและคอลัมน์ลำดับที่ (# ปิด hiding ไว้); Created และ Updated **ไม่ถูกติ๊กตั้งแต่ต้น** ตรงกับ `columnVisibility` เริ่มต้นของตาราง; เปิดแล้วทั้งสองคอลัมน์ปรากฏพร้อมวันที่-เวลาและชื่อผู้ทำรายการ; ปิด Symbol แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-CUR-010012 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency` ในมุมมองตาราง; BU มีสกุลเงินมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. อ่านข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ช่วงใน "Showing" ขยับตาม และเลขลำดับ (#) เดินต่อเนื่องจากหน้าก่อน (ไม่เริ่มนับ 1 ใหม่); กลับหน้าแรกแล้วปุ่มไปหน้าแรก/ย้อนกลับถูก disable อีกครั้ง

---
## TC-CUR-010013 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ดสกุลเงิน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency` บนหน้าจอขนาด desktop; มีสกุลเงินอย่างน้อย 1 รายการที่มีทั้งรหัสและสัญลักษณ์
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. อ่านการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดใช้ **ชื่อสกุลเงิน** เป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว Code, แถว Symbol (สองแถวหลังแสดงเฉพาะเมื่อมีค่า) และแถว Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; การ์ด **ไม่มีแถวอัตราแลกเปลี่ยน** ต่างจากตารางที่มีคอลัมน์ Exchange Rate (ดูหมายเหตุข้อ 11); ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-CUR-010014 — ส่งออกรายการสกุลเงินเป็นไฟล์ XLSX เจ็ดคอลัมน์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/currency` บน desktop; มีสกุลเงินอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
3. เปิดไฟล์ที่ดาวน์โหลดมาตรวจหัวคอลัมน์และค่า
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่ชื่อขึ้นต้นด้วย `currency_<YYYY-MM-DD>` และชีตชื่อ "Currency"; ไฟล์มี **7 คอลัมน์ตามลำดับ** Code / Name / Symbol / Exchange Rate / Decimal Places / Description / Status โดย Status เป็นคำว่า Active หรือ Inactive (ไม่ใช่ true/false) และช่องที่ไม่มีค่าเป็นค่าว่างหรือ 0 ตามชนิดข้อมูล; ข้อมูลที่ส่งออกคือแถวของ**หน้าปัจจุบันเท่านั้น**; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-CUR-010015 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/currency` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็นสถานะว่างเปล่า "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-CUR-010016 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/currency` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนูท้ายแถวของ view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่องชื่อ ("View name") และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-CUR-010017 — เมนูท้ายแถวมีเฉพาะ Activity และ Delete และ Activity อ้างรหัสสกุลเงิน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/currency` และมีสกุลเงินอย่างน้อย 1 รายการที่รู้รหัสแน่นอน
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก "Activity"
4. ปิด sheet แล้วกลับหน้าเดิม
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Code เท่านั้น ดูหมายเหตุข้อ 13); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมที่หัวเรื่องอ้าง **รหัสสกุลเงิน** ของแถวนั้น (`activity.label = r.code`) ไม่ใช่ชื่อ; ปิด sheet แล้วกลับมาที่ตารางเดิมโดยข้อมูลไม่เปลี่ยน

---
## TC-CUR-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add Currency
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/currency` และยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Currency"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Currency"; ช่อง Code เป็นปุ่ม combobox ที่ขึ้นข้อความ "Select Currency Code" พร้อมไอคอนลูกศรขึ้น-ลง และ label มีเครื่องหมายบังคับกรอก; ช่อง Name ว่างและมี placeholder "e.g. United States Dollar"; ช่อง Symbol ว่าง **ถูก disable** และมี placeholder "e.g. $, ฿, €"; ช่อง Exchange Rate เป็น `input[type="number"]` ที่มี `step="any"` + `inputmode="decimal"` จัดตัวเลขชิดขวาแบบ tabular และ**แสดงค่า `0`** ตามค่าเริ่มต้นของฟอร์ม; ช่อง Description เป็น textarea 2 บรรทัดที่ว่างและมี placeholder "Optional"; สวิตช์สถานะอยู่ที่เปิดใช้งาน (`aria-checked="true"`) พร้อมป้าย "Active"; footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save)

---
## TC-CUR-030003 — เลือกรหัส ISO แล้วระบบเติมชื่อ สัญลักษณ์ และคำอธิบายให้อัตโนมัติ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Currency" อยู่ และยังไม่ได้กรอกช่องใดเลย
**Steps**
1. คลิกปุ่มเลือกรหัส (Code)
2. พิมพ์ "JPY" ในช่องค้นหาของ popover แล้วคลิกรายการ JPY
3. อ่านค่าในช่อง Name, Symbol, Description และ Exchange Rate
**Expected**
ปุ่ม Code เปลี่ยนป้ายเป็น "JPY — Japanese Yen"; ช่อง Name ถูกเติมเป็น "Japanese Yen"; ช่อง Symbol ถูกเติมเป็น "¥" (ยังคง disable อยู่); ช่อง Description ถูกเติมเป็น "Japanese Yen (Japan)" ตามรูปแบบ `<ชื่อ> (<ประเทศ>)`; ช่อง **Exchange Rate ยังคงเป็น `0`** — การเติมอัตราอัตโนมัติจะเกิดต่อเมื่อดึงอัตราจากแหล่งภายนอกได้จริงเท่านั้น (ดูหมายเหตุข้อ 6) ผู้ใช้จึงต้องกรอกเอง

---
## TC-CUR-030004 — ค้นรหัส ISO ด้วยรหัส ชื่อ หรือประเทศ และกดรหัสเดิมซ้ำเพื่อยกเลิกการเลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Currency" อยู่
**Steps**
1. เปิด popover เลือกรหัส แล้วพิมพ์ "Japan" (ชื่อประเทศ)
2. ล้างคำค้นแล้วพิมพ์ "Yen" (ชื่อสกุลเงิน)
3. เลือกรายการ JPY
4. เปิด popover เดิมอีกครั้งแล้วคลิกรายการ JPY ซ้ำ
**Expected**
ค้นด้วยชื่อประเทศและชื่อสกุลเงินพบรายการ JPY ได้ทั้งสองแบบ (ค่าที่ใช้ค้นคือ `<code> <name> <country>`); ช่องค้นหามี placeholder "Search Currency..."; รายการที่ถูกเลือกอยู่มีเครื่องหมายถูกกำกับท้ายแถว; **คลิกรายการเดิมซ้ำเป็นการยกเลิกการเลือก** — popover ปิด ปุ่ม Code กลับไปขึ้น "Select Currency Code" และค่าที่ auto-fill ไว้ก่อนหน้า (Name / Symbol / Description) **ยังคงอยู่ไม่ถูกล้างตาม**; รายการทั้งหมดในเมนูมาจากตาราง ISO ตายตัว 47 รหัส ไม่ตัดสกุลเงินที่ BU มีอยู่แล้วออก (ดูหมายเหตุข้อ 7)

---
## TC-CUR-030005 — สร้างสกุลเงินพร้อมคำอธิบายที่พิมพ์ทับเอง แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/currency`; รหัสที่จะใช้ (เช่น TWD) ยังไม่มีใน BU
**Steps**
1. คลิกปุ่ม "Add Currency"
2. เลือกรหัส ISO ที่ยังไม่มีใน BU (เช่น TWD)
3. ลบคำอธิบายที่ระบบเติมให้ แล้วพิมพ์ข้อความของตัวเองที่ไม่ซ้ำ
4. กรอก Exchange Rate เป็นค่าบวก (เช่น `1.1`)
5. กดปุ่ม Create
6. ค้นหารหัสนั้นในตาราง แล้วคลิกรหัสในคอลัมน์ Code เพื่อเปิด dialog ซ้ำ
7. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Currency created successfully" และ dialog ปิดเอง; แถวใหม่ปรากฏในตารางโดยคอลัมน์ Code เป็นรหัสที่เลือก, Name และ Symbol เป็นค่าจากตาราง ISO และ Exchange Rate แสดงค่าที่กรอกเป็นทศนิยม 5 ตำแหน่ง; เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Description ยังเป็นข้อความที่พิมพ์เอง ไม่ใช่ข้อความที่ระบบเติมให้ครั้งแรก (ค่าถูก persist จริง)

---
## TC-CUR-030006 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/currency`; เปิด dialog "Add Currency" เลือกรหัส ISO และกรอก Exchange Rate ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Currency" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้นทั้งชุด (ปุ่ม Code กลับเป็น "Select Currency Code", Name / Symbol / Description ว่าง, Exchange Rate = `0`, สวิตช์สถานะเปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-CUR-040005 — โหมดแก้ไขปิดช่องรหัส และช่องสัญลักษณ์อ่านอย่างเดียวทั้งสองโหมด
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสกุลเงินอย่างน้อย 1 รายการที่กรอกรหัสและสัญลักษณ์ไว้แล้ว
**Steps**
1. ไปที่ `/config/currency` แล้วคลิกรหัสในคอลัมน์ Code เพื่อเปิด dialog แก้ไข
2. ลองคลิกปุ่มเลือกรหัส (Code)
3. ลองพิมพ์ในช่อง Symbol
4. ลองแก้ Name, Exchange Rate, Description และสวิตช์สถานะ
**Expected**
หัวข้อ dialog คือ "Edit Currency" และปุ่มบันทึกคือ **Save**; ปุ่มเลือกรหัสถูก disable — คลิกแล้วไม่เปิด popover และค่ารหัสเปลี่ยนไม่ได้; ช่อง Symbol ถูก disable เช่นกัน (เป็นแบบนั้นทั้งโหมดสร้างและแก้ไข ดูหมายเหตุข้อ 5) จึงพิมพ์ทับไม่ได้; ช่อง Name, Exchange Rate, Description และสวิตช์สถานะยังแก้ไขได้ตามปกติ; การเปลี่ยนรหัสด้วยวิธีใดก็ตามไม่กระตุ้น auto-fill ซ้ำ (effect ถูกกันไว้ด้วย `isEdit`)

---
## TC-CUR-040006 — แก้อัตราแลกเปลี่ยนแล้วค่าคงอยู่และแสดงในคอลัมน์
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสกุลเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้รหัสแน่นอน
**Steps**
1. ค้นหาสกุลเงินนั้นแล้วคลิกรหัสในคอลัมน์ Code เพื่อเปิด dialog แก้ไข
2. แก้ช่อง Exchange Rate เป็นค่าบวกค่าใหม่ (เช่น `0.02795`)
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. เปิด dialog ของรายการนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Currency updated successfully" และ dialog ปิดเอง; คอลัมน์ Exchange Rate ของแถวนั้นเปลี่ยนเป็นค่าใหม่ในรูปทศนิยม 5 ตำแหน่งพร้อมรหัสสกุลเงินฐานต่อท้าย; เปิด dialog ซ้ำแล้วช่อง Exchange Rate แสดงค่าใหม่ (ค่าถูก persist จริง ไม่ใช่แค่แสดงผล)

---
## TC-CUR-040007 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/currency` และสลับเป็นมุมมองการ์ดแล้ว; มีสกุลเงินอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
2. ตรวจค่าที่ถูกเติมในฟอร์ม
3. กด Cancel
**Expected**
เปิด dialog "Edit Currency" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Code, Name, Symbol, Exchange Rate, Description, สวิตช์สถานะ) โดยช่อง Code และ Symbol ถูก disable; กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-CUR-040008 — ปิดใช้งานสกุลเงินแล้วหายจากตัวเลือกใน Add Manual ของ Exchange Rate
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสกุลเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ สถานะเปิดใช้งาน และ **ไม่ใช่สกุลเงินฐานของ BU**; BU มีสกุลเงินรวมไม่เกิน 30 รายการ (ตัวเลือกดึงมาแค่ `perpage: 30` ดูหมายเหตุข้อ 8)
**Steps**
1. ไปที่ `/config/exchange-rate` กดปุ่ม "Add Manual" แล้วเปิดตัวเลือกสกุลเงิน — ยืนยันว่าเห็นรหัสนั้นอยู่ในรายการ ปิด dialog
2. ไปที่ `/config/currency` เปิด dialog ของสกุลเงินนั้น ปิดสวิตช์สถานะ แล้วกด Save
3. กลับไปที่ `/config/exchange-rate` กดปุ่ม "Add Manual" แล้วเปิดตัวเลือกสกุลเงินอีกครั้ง
4. เปิดสวิตช์สถานะกลับและลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ขั้นแรกตัวเลือกสกุลเงินของ dialog "Add Manual" มีรหัสนั้นอยู่; หลังปิดใช้งาน หน้า `/config/currency` แสดง toast "Currency updated successfully" และคอลัมน์ Status ของแถวนั้นเป็นป้าย Inactive; กลับมาที่ exchange-rate แล้ว **รหัสนั้นหายจากตัวเลือกสกุลเงิน** (ตัวเลือกกรองเฉพาะ `is_active`) ขณะที่สกุลเงินที่ยังเปิดใช้งานอยู่ยังเลือกได้ตามปกติ และรายการอัตราแลกเปลี่ยนเดิมของสกุลเงินนั้น (ถ้ามี) ยังแสดงอยู่ในตาราง

---
## TC-CUR-040009 — สกุลเงินที่สร้างใหม่ปรากฏเป็นตัวเลือกใน Add Manual ของ Exchange Rate
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีสกุลเงินรวมไม่เกิน 30 รายการ (ดูหมายเหตุข้อ 8); เลือกรหัส ISO ที่ยังไม่มีใน BU และไม่ใช่สกุลเงินฐานของ BU
**Steps**
1. ที่ `/config/currency` สร้างสกุลเงินใหม่ด้วยรหัสนั้น สถานะเปิดใช้งาน พร้อมกรอกอัตราแลกเปลี่ยนเป็นค่าบวก
2. ไปที่ `/config/exchange-rate` กดปุ่ม "Add Manual"
3. เปิดตัวเลือกสกุลเงินในฟอร์ม
4. ปิด dialog แล้วกลับไปลบสกุลเงินที่สร้างไว้เพื่อคืนสภาพ
**Expected**
สร้างสำเร็จพร้อม toast "Currency created successfully"; ในตัวเลือกสกุลเงินของ dialog "Add Manual" มีรหัสที่เพิ่งสร้างให้เลือก (ตัวเลือกแสดงเป็น **รหัส** ไม่ใช่ชื่อ) และไม่มีสกุลเงินฐานของ BU อยู่ในรายการ

---
## TC-CUR-050003 — ข้อความยืนยันลบอ้างรหัสสกุลเงิน ไม่ใช่ชื่อ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีสกุลเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ และรู้ทั้งรหัสกับชื่อของมันแน่นอน (รหัสกับชื่อต้องไม่เหมือนกัน)
**Steps**
1. เปิดเมนูท้ายแถวของรายการนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Currency" และคำอธิบายอ่านว่า `Are you sure you want to delete currency "<รหัส>"? This action cannot be undone.` โดยค่าในเครื่องหมายคำพูดคือ **รหัสสกุลเงิน** ไม่ใช่ชื่อ (ดูหมายเหตุข้อ 9); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Currency deleted successfully"

---
## TC-CUR-050004 — ลบสกุลเงินจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีสกุลเงินที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของสกุลเงินนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว **ไม่** เปิด dialog แก้ไข (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบที่อ้างรหัสสกุลเงินแทน; ยืนยันแล้วแสดง toast "Currency deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-CUR-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add Currency ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.currency.view` แต่ไม่มี `configuration.currency.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`); สัญญาของ BU ยังไม่หมดอายุ (`canWrite` เป็นจริง ไม่งั้นจะเป็นคนละเหตุผล)
**Steps**
1. ไปที่ `/config/currency`
2. สังเกตสภาพปุ่ม "Add Currency"
3. คลิกปุ่ม "Add Currency"
**Expected**
ปุ่ม "Add Currency" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว **ไม่** เปิด dialog สร้างสกุลเงิน แต่เด้ง dialog หัวข้อ "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน

---
## TC-CUR-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.currency.view` แต่ไม่มี `configuration.currency.update` และไม่ใช่ admin ของ BU; มีสกุลเงินอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/currency`
2. คลิกรหัสในคอลัมน์ Code เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ปุ่มเลือกรหัส, ช่อง Name, Symbol, Exchange Rate, Description และสวิตช์สถานะถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-CUR-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete และปุ่มบนการ์ดเด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.currency.view` แต่ไม่มี `configuration.currency.delete` และไม่ใช่ admin ของ BU; มีสกุลเงินอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/currency`
2. เปิดเมนูท้ายแถวของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"`; คลิกแล้ว **ไม่** เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่านจาก `useDeleteGate` ตัวเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-CUR-100008 — ไม่มีสิทธิ์ดู — เมนูใน sidebar จาง และ deep link เจอหน้าปฏิเสธสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `configuration.currency.view` และไม่ใช่ admin ของ BU
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar
2. สังเกตรายการ "Currency"
3. คลิกรายการ "Currency"
4. พิมพ์ URL `/config/currency` ตรง ๆ บน address bar แล้วเปิด
**Expected**
รายการ "Currency" ยังอยู่ในเมนูแต่ถูกทำให้จาง และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/currency">` ให้กดไปหน้า; ไม่มีไอคอนแม่กุญแจ (โมดูลนี้ไม่ได้ผูก `licenseFeature` ไว้ใน `constant/module-list.ts` แม่กุญแจจึงสงวนไว้ให้กรณี license เท่านั้น); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; ส่วนการเปิด URL ตรง ๆ **ไม่ redirect ออก** แต่แสดงบล็อกปฏิเสธสิทธิ์ในหน้า (`role="alert"`) ที่มีคำว่า "Restricted", หัวข้อ "Permission Denied", ข้อความ "You don't have permission to view this page.", บรรทัดแนะนำให้ติดต่อผู้ดูแล และปุ่มพากลับไปหน้าที่เข้าได้

---
## TC-CUR-100009 — XSS payload ในช่องคำอธิบายต้องไม่รัน script
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/currency`; ติดตั้ง guard ดักไม่ให้มี browser dialog โผล่ระหว่างเทส; เลือกรหัส ISO ที่ยังไม่มีใน BU ไว้ใช้
**Steps**
1. เปิด dialog "Add Currency" แล้วเลือกรหัส ISO
2. กรอกอัตราแลกเปลี่ยนเป็นค่าบวก
3. ลบคำอธิบายที่ระบบเติมให้ แล้วกรอก payload `<script>alert('xss-e2e')</script>` ลงในช่อง Description
4. กด Create
5. เปิดรายการที่เพิ่งสร้างซ้ำแล้วอ่านช่อง Description
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ไม่มี browser alert/dialog โผล่ระหว่างขั้นตอนใด ๆ (script ไม่ถูก execute); ระบบยอมรับหรือปฏิเสธก็ได้ แต่ต้องไม่ crash — ถ้าบันทึกสำเร็จ เปิด dialog ซ้ำแล้วช่อง Description แสดง payload เป็น **ข้อความล้วน** ตรงตามที่พิมพ์ และหน้า list ใช้งานต่อได้ตามปกติ (หมายเหตุ: ตารางไม่มีคอลัมน์ Description ค่าจึงเห็นได้จาก dialog และไฟล์ export เท่านั้น)

---
## TC-CUR-200004 — ล้างช่องอัตราแลกเปลี่ยนให้ว่างแล้วบันทึกไม่ผ่าน
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Currency" เลือกรหัส ISO แล้ว (Name ถูกเติมให้อัตโนมัติ)
**Steps**
1. ล้างค่าในช่อง Exchange Rate ให้ว่าง
2. กดปุ่ม Create
3. สังเกตสถานะของช่อง Exchange Rate และ dialog
4. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
dialog **ยังเปิดค้างอยู่** ไม่มี toast สร้างสำเร็จ และไม่มีรายการใหม่เพิ่มในตาราง; ช่อง Exchange Rate ขึ้นสถานะผิดพลาด — `aria-invalid="true"` พร้อมไอคอนเตือนสีแดงในช่อง (จัดชิดซ้ายตาม `errorIconAlign="left"` ของช่องนี้) และข้อความจะเห็นได้เมื่อ hover/focus เป็น tooltip เท่านั้น; **ไม่ assert ข้อความ** เพราะค่าว่างถูกแปลงเป็น `NaN` แล้วตกด่าน `z.number()` ซึ่งไม่มีข้อความ custom ข้อความที่ได้จึงเป็น default ของ zod ที่ไม่ผ่าน i18n (ดูหมายเหตุข้อ 12)

---
## TC-CUR-200005 — อัตราแลกเปลี่ยนเป็น 0 หรือค่าติดลบต้องถูกปฏิเสธ
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Currency" เลือกรหัส ISO แล้ว
**Steps**
1. ปล่อยช่อง Exchange Rate ไว้ที่ `0` แล้วกด Create
2. สังเกตสถานะของช่องและ dialog แล้ว hover/focus ที่ช่องเพื่ออ่านข้อความ
3. แก้เป็นค่าติดลบ (เช่น `-1`) แล้วกด Create อีกครั้ง
4. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
ทั้งกรณี `0` และค่าติดลบ dialog ยังเปิดค้างอยู่ ไม่มี toast และไม่มีคำขอสร้างถูกส่งออกไป; ช่อง Exchange Rate มี `aria-invalid="true"` พร้อมไอคอนเตือน และ tooltip ขึ้นข้อความ "Exchange Rate must be greater than 0" (กติกา `.positive()` ของ schema)

---
## TC-CUR-200006 — ไม่เลือกรหัส ISO แล้วบันทึก — สถานะผิดพลาดขึ้นที่ปุ่มเลือกรหัส
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Currency" โดย **ยังไม่เลือกรหัส ISO**
**Steps**
1. กรอก Name เองด้วยข้อความที่ไม่ซ้ำ
2. กรอก Exchange Rate เป็นค่าบวก
3. กดปุ่ม Create
4. สังเกตปุ่มเลือกรหัส แล้ว hover/focus เพื่ออ่านข้อความ
5. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
dialog ยังเปิดค้างอยู่และไม่มีรายการใหม่ถูกสร้าง; **ปุ่มเลือกรหัส** มี `aria-invalid="true"` กรอบสีแดง และไอคอนเตือนแทนไอคอนลูกศรขึ้น-ลง โดย tooltip ขึ้นข้อความ "Code is required"; ช่อง Name ที่กรอกไว้แล้ว **ไม่** ถูกทำเครื่องหมายผิดพลาด (แยกกันคนละช่อง) · หมายเหตุ: ช่อง Symbol ที่ถูก disable ก็ว่างเช่นกันและมีกติกา required ใน schema — สังเกตผลจริงแล้วบันทึกไว้ อย่า assert ว่าไม่มี error ที่ช่องนั้น

---
## TC-CUR-200007 — ช่องคำอธิบายจำกัดที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Currency" อยู่
**Steps**
1. ล้างช่อง Description ให้ว่าง
2. วางข้อความยาว 300 ตัวอักษรลงในช่อง Description
3. อ่านค่าที่ค้างอยู่ในช่อง
**Expected**
ช่อง Description เป็น textarea ที่มี `maxlength="256"`; ค่าที่ค้างอยู่ในช่องถูกตัดเหลือไม่เกิน 256 ตัวอักษร โดยไม่มีข้อความ error เพิ่มเติม (เบราว์เซอร์บังคับที่ตัว control ไม่ใช่ที่ schema)
