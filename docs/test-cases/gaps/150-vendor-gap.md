# Vendor — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/150-vendor.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/150-vendor.md`_

**Module:** Vendor Management — Vendor (ผู้ขาย)
**Frontend route:** `routes/vendor-management/vendor`  •  **URL:** `/vendor-management/vendor`, `/vendor-management/vendor/new`, `/vendor-management/vendor/:id`
**Prefix:** `VEN`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/150-vendor.spec.ts` (31 เคส — 2 ใน 31 เป็น `test.fixme`)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 54

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/150-vendor.spec.ts` ถือ ID `TC-VEN-010001..010005`, `010050`, `030001..030005`, `030007..030013`, `030050`, `040001`, `040050`, `050001..050003`, `050050`, `200001..200004`, `200006`, `200050` รวม 31 เคส **ไม่มี helper ตัวใดผลิตเคสของ `VEN` เลย** (สเปกไม่ได้ import `tests/helpers/security-cases.ts` — grep `TC-VEN-` ทั้ง `tests/` เจอเฉพาะไฟล์สเปกกับ `tests/results/*.json`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, แตะตัวกรองสถานะ, active BU = BLAVG, เปิดหน้า `/new`, เลือก business type จาก dropdown, สร้าง vendor ขั้นต่ำ (code+name+business type), สร้างพร้อม address 1 แถว, เพิ่ม/ลบแถว address · contact · info, แก้ name แล้ว save (ทั้ง purchase และ admin), เปิด/ยกเลิก dialog ลบจากเมนูในแถว, ลบสำเร็จ, ค้นหลังลบไม่เจอ, code/name ว่างบล็อกการบันทึก, code เกิน 10 ตัวถูกตัด, name เกิน 100, contact email ผิดรูปแบบ, code ซ้ำถูก reject — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 2. **เลข `TC-VEN-030006` และ `TC-VEN-200005` ว่างอยู่ในสเปก** (ถูกข้ามไว้ตั้งแต่ตอน renumber) เอกสารนี้ **ไม่หยิบมาใช้** เพื่อไม่ให้เลขเดิมที่อาจถูกอ้างอยู่ใน CSV/ชีตผลทดสอบเปลี่ยนความหมาย เคสใหม่จึงเริ่มนับต่อจากเลขสูงสุดของแต่ละบล็อกแทน
>
> 3. **Section block ที่ `VEN` ลงทะเบียนไว้คือ `01, 03–05, 10–19, 20`** (`docs/test-id-scheme.md`) — **ไม่ต้องแก้ scheme** แต่ต้องจัดสามกลุ่มเข้าบล็อกใกล้เคียงเพราะ `02`, `30`, `40–89`, `90` ไม่ได้ลงทะเบียน:
>     - เคส **Detail / View** (ตามขนบอยู่บล็อก 02) → จัดเข้า **04** เพราะ vendor ใช้ URL เดียว (`/vendor-management/vendor/:id`) เป็นทั้งหน้าดูและหน้าแก้ โดย `useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่ mount เมื่อมี entity แล้วปุ่ม Edit พลิกเป็นโหมดแก้ในหน้าเดิม
>     - เคส **Certificates** (เป็น sub-feature ตามขนบควรอยู่บล็อก module-specific 40–89) → จัดเข้า **04** เพราะ `VendorCertificateSection` render เฉพาะเมื่อมี `vendor?.id` — มันมีตัวตนอยู่เฉพาะบนหน้ารายละเอียดเท่านั้น ไม่โผล่ที่ `/new` เลย
>     - เคส **Export** (บล็อก 30) และ **edge** (บล็อก 90) → จัดเข้า **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือ/แถบหัวของหน้า list
>
>     **จงใจไม่เอา certificates ไปไว้บล็อก 11–19 ทั้งที่ว่างอยู่** — ช่วง `10–19` ในสคีมาแปลว่า Security/Authorization การยืมมาใช้เป็น sub-feature จะทำให้เลขโกหกความหมายของตัวเอง
>
> 4. **⚠️ page object ล้าสมัยเทียบกับ UI ปัจจุบัน — ต้องตามแก้ก่อนแปลงเคสในเอกสารนี้เป็นสเปก** (ยืนยันจากโค้ดแอปวันที่เขียนรายงานนี้ **ห้ามแก้ไฟล์เหล่านี้ในงานนี้** แต่ผู้เขียนสเปกต้องรู้):
>     - **`tests/pages/vendor.page.ts` บรรยายฟอร์มผิด** — docstring บอกว่าชื่อ vendor อยู่ใน "hero `NameField`" แต่ **`NameField` ไม่มีอยู่ในโค้ดแอปแล้ว** (grep ทั้ง repo ไม่เจอ component ชื่อนี้) ของจริงคือ `FieldInput id="vendor-name"` ใน `routes/vendor-management/vendor/vendor-general.tsx:39-46` — locator ที่เจาะด้วย placeholder ยังแมตช์อยู่เพราะ `namePlaceholder` ยังเป็น `"e.g. บริษัท ABC จำกัด"` แต่ **`#vendor-name` คือ handle ที่ควรใช้** (คู่กับ `#vendor-code` / `#vendor-description` ที่ page object ใช้อยู่แล้ว) และจะทำให้ helper ท้องถิ่น `fillCodeAndName()` ในบล็อก admin ของสเปก (`tests/150-vendor.spec.ts:806-822`) ที่ประกาศซ้ำหายไปได้ทั้งก้อน
>     - **`TC-VEN-200004` ตั้งอยู่บนสมมติฐานที่เป็นเท็จแล้ว** — คอมเมนต์ในสเปกระบุว่า "hero NameField ไม่ cap ความยาวฝั่ง client, zod บังคับตอน submit" แต่ `vendor-general.tsx:44` ใส่ `maxLength={100}` ไว้ตั้งแต่คอมมิต `19e043a1` (2026-07-08) `fill("N".repeat(150))` จึงเหลือ 100 ตัวพอดี = **ผ่าน zod** ฟอร์มควรบันทึกสำเร็จและออกจาก `/new` → assertion `toHaveURL(/\/new/)` ควรพัง และทิ้ง vendor ขยะไว้ใน DB ทุกครั้งที่รัน **ตรวจเรื่องนี้ก่อนอย่างอื่น**
>     - **คอมเมนต์ของ `TC-VEN-200001` / `TC-VEN-200002` ที่ว่า "ฟอร์มใหม่ไม่มี aria-invalid / ข้อความ inline มีแต่ tooltip ตอน hover" ไม่จริงแล้ว** — `FieldInput` (`components/ui/field.tsx:308-350`) ใส่ `aria-invalid={!!error}` ให้ `<Input>` เสมอ พร้อมไอคอน `CircleAlert` และ tooltip assertion เดิมยังผ่านแต่เป็น oracle ที่อ่อนกว่าที่ควร — `TC-VEN-200007` ในเอกสารนี้เขียนแทนด้วย oracle ที่ผูกกับ `aria-invalid` จริง
>     - **`TC-VEN-010005` (ตัวกรองสถานะ) คาดหวัง `role="option"` ซึ่ง UI ปัจจุบันไม่มี** — บน desktop ปุ่ม Filter เปิด `ListFilterMenu` ซึ่งเป็น popover สองชั้น: แถว field เป็น `<button>` ธรรมดา และตัวเลือกสถานะใน submenu ก็เป็น `<button>` ธรรมดาเช่นกัน (`components/ui/status-filter.tsx:62-88` — สาขา `inline` ที่ `FilterInlineContext` เปิดไว้) **ไม่มี element ที่มี role `option` หรือ `combobox` ในเส้นทางนี้เลย** ส่วนที่ยัง render เป็น `role="option"` คือ submenu ของ Business Type เท่านั้น (`MultiSelectFilter` → `CommandItem`)
>     - **`switchTab()` เป็น no-op ที่ถูกต้องแล้ว** — ฟอร์มปัจจุบันเป็นหน้ายาวหน้าเดียว (`SettingSection` สี่หมวดต่อกัน) ไม่มี Radix Tabs เหลือแล้ว แต่ key `vendorManagement.vendor.tabs.*` ยังค้างอยู่ใน `messages/en.json` โดยไม่มีใครเรียกใช้ (ของที่ตายแล้ว ไม่ใช่สัญญาณว่ามีแท็บ)
>     - `VendorPage.list` ใช้ `ConfigListPage` ซึ่ง docstring บอกว่าเป็นของ "โมดูลใต้ `/config/*`" — ใช้กับ vendor ได้จริงเพราะ locator เป็นของกลาง (`Add` / placeholder `Search` / empty state) แต่หน้า vendor ประกอบจาก `DocumentListHeader` + `DocumentListActions` + `ListToolbar` ไม่ใช่ `ConfigListTemplate` **อย่าคาดหวังว่าทุกอย่างของ config list จะมีเหมือนกัน**
>
> 5. **บั๊กที่ทำให้ `TC-VEN-030005` / `TC-VEN-030011` ยังเป็น `test.fixme` ยังอยู่ครบ** — `vendor-contact.tsx:139` ยังอ่านค่าด้วย `form.getValues(\`vendor_contact.${index}\`)` ซึ่งเป็น snapshot ที่ไม่ subscribe การ์ดจึงไม่ re-render เมื่อ `handleSetPrimary` เรียก `form.setValue(...)` (ค่าในฟอร์มเปลี่ยนจริงแต่ `aria-checked` ค้างที่ `false`) **เอกสารนี้จึงไม่มีเคสใดที่ยืนยันว่า "ติ๊ก Primary แล้ว UI เปลี่ยน"** เลยแม้แต่เคสเดียว — บันทึกเป็นข้อเท็จจริงไว้ตรงนี้แทน เคสที่แตะ contact ในเอกสารนี้ทุกตัวจึงไม่พึ่ง `is_primary` ยกเว้น `TC-VEN-040009` ที่อ่าน "ผู้ติดต่อหลัก" จากการ์ดในมุมมอง grid **หลังบันทึกและโหลดใหม่** (ค่ามาจาก response ของ backend ไม่ใช่จาก state ของการ์ดที่ค้าง)
>
> 6. **กับดัก toast — สาม toast มีคำว่า `success` เหมือนกันหมด** `messages/en.json` กำหนด `toast.createSuccess = "{entity} created successfully"`, `updateSuccess`, `deleteSuccess` และ `t("entity") = "Vendor"` regex กว้าง ๆ อย่าง `/success|สำเร็จ/i` (ซึ่ง `VendorPage.expectSaved()` ใช้อยู่) จึงแมตช์ toast ของ *ทุก* การกระทำ รวมถึง toast ของใบรับรองที่ใช้ `entity = "Certificate"` ด้วย **เคสใหม่ทุกเคสในเอกสารนี้ให้ผูก assertion กับข้อความเต็ม** เช่น `/Vendor updated successfully/i`, `/Certificate created successfully/i` หรือรอ response ของ PATCH ด้วย `waitForResponse` แทน
>
> 7. **หน้า vendor ไม่ได้ gate ปุ่มด้วยสิทธิ์เหมือนโมดูล config** — `vendor-component.tsx:177-182` เรียก `DocumentListActions` โดย **ไม่ส่ง `addDisabled`** และ `vendor-form.tsx:237-288` วางปุ่ม Edit / Delete / Activity เป็น `<Button>` ดิบใน `DocFormHeader` ไม่ได้ผ่าน `FormToolbar` ที่เช็คสิทธิ์ให้ ผลคือ **ปุ่ม Add · Edit · Delete บนฟอร์ม ไม่ถูกเช็ค permission ฝั่ง UI เลย** (ไปตาย 403 เอาข้างหน้า) ทางเดียวที่ยังกั้นอยู่คือ `RouteGuard` (สิทธิ์ `view`) กับปุ่มลบในแถวตาราง/บนการ์ดที่ผ่าน `useDeleteGate()` **เอกสารนี้จึงไม่เขียนเคสที่ assert ว่าปุ่ม Add/Edit/Delete บนฟอร์มถูกกั้น** — เคส `TC-VEN-100001`/`100002` ครอบเฉพาะสองทางที่กั้นจริง ส่วนที่เหลือบันทึกเป็นข้อเท็จจริงไว้ที่นี่ให้ทีมตัดสินใจว่าจะแก้แอปหรือรับไว้
>
> 8. **vendor ไม่มี `licenseFeature`** ใน `constant/module-list.ts:213-218` (ต่างจาก price-list-template / request-price-list / certification ที่มี) จึงไม่มีสถานะ "locked / ไอคอนแม่กุญแจ" ให้ทดสอบ — เคสสิทธิ์ทั้งหมดเป็นเรื่อง RBAC ล้วน ส่วน `canWrite` (สัญญาหมดอายุ) ปิดปุ่มลบในแถวได้อยู่ แต่เป็นสภาพของทั้ง BU ไม่ใช่ของโมดูล และต้องมี BU ที่หมดอายุจริงถึงจะตั้ง precondition ได้ จึงไม่เขียนเป็นเคสที่นี่
>
> 9. **`RouteGuard` ครอบ `/new` และ `/:id` ด้วย** — `findRouteLeaf()` (`constant/module-list.ts:114-126`) จับแบบ prefix (`pathname.startsWith(m.path + "/")`) ดังนั้น deep link เข้าฟอร์มก็ถูกเช็ค `vendor_management.vendor.view` เหมือนหน้า list
>
> 10. **`getDeleteDescription` ในกล่องยืนยันลบผู้ติดต่ออ่าน field ผิด (ยืนยันจากโค้ด)** — `vendor-contact.tsx:107` เรียก `getDeleteDescription(deleteIndex, form)` โดยไม่ส่ง `nameField` ตัวฟังก์ชัน (`lib/form-utils.ts:19-32`) จึงไปอ่าน `items.<i>.product_name` ซึ่ง **ไม่มีอยู่ในฟอร์ม vendor เลย** คำอธิบายในกล่องจึงเป็น `Are you sure you want to remove "Item #N"?` เสมอ ไม่เคยเอ่ยชื่อผู้ติดต่อ **`TC-VEN-030022` จึง assert แค่หัวข้อกล่อง (`Remove Contact`) กับผลของการยืนยัน ไม่ assert คำอธิบาย** — ถ้าทีมแก้ให้อ่าน `vendor_contact.<i>.name` เมื่อไร ค่อยเพิ่ม assertion ทีหลัง
>
> 11. **หมวดที่อยู่ไม่มีโหมดอ่านอย่างเดียวเหมือนหมวดอื่น** — `VendorGeneral` / `VendorContact` / `VendorInfo` มีสาขา `isView` ที่ render เป็นข้อความ (`FieldPlainText`) แต่ `AddressRow` (`vendor-address.tsx:251-477`) ไม่มีสาขานั้น มันยัง render `<input>` ชุดเดิมโดยติด `disabled` ไว้ **เคส `TC-VEN-040002` จึง assert ว่า "ช่องที่อยู่แก้ไม่ได้" (`disabled`) ไม่ใช่ "ไม่มี `<input>` อยู่ใน DOM"** — ถ้าทีมมองว่าที่อยู่ควรเป็นข้อความเหมือนหมวดอื่น นั่นคืองานแก้ `vendor-address.tsx` ไม่ใช่งานแก้เทส
>
> 12. **เมนู Sort และเมนู Toggle Columns เรียกคอลัมน์สถานะว่า `is_active`** — ทั้งสองเมนู fallback เป็น `column.id` เมื่อ column ไม่ได้ตั้ง `meta.headerTitle` (`data-grid-sort-menu.tsx:97`, `data-grid-column-visibility.tsx:44`) และ `statusColumn()` ใน `columns.tsx:74-87` ไม่ได้ตั้งไว้ (vendor แทรก `statusColumn()` เองใน `use-vendor-table.tsx:92` พร้อม `hideStatus: true`) เคส `TC-VEN-010012` / `TC-VEN-010013` จึง assert ตามที่ UI แสดงจริง ไม่ได้ assert ว่าเป็น "Status" — หัวข้อเมนู "Toggle Columns" ก็ hard-code เป็นอังกฤษ ไม่ผ่าน i18n เช่นกัน
>
> 13. **ใบรับรองต้องมีข้อมูลต้นทางก่อน** — `VendorCertificateDialog` ดึงตัวเลือกจาก `useCertification({ perpage: -1 })` แล้วกรองเฉพาะ `is_active` ถ้า BU ยังไม่มี master certificate ที่ `/vendor-management/certification` เลย dropdown จะว่างและเคส `TC-VEN-040016..040018` ตั้ง precondition ไม่ได้ **ให้เตรียมข้อมูลตั้งต้นก่อน ไม่ใช่ปล่อยเทสไป skip เงียบ ๆ** (ดูบันทึกทีมเรื่อง backend 400 metadata ของโมดูล certification ประกอบ)
>
> 14. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-VEN-010006 | หน้า list แสดงหัวเรื่อง จำนวนรายการ และคอลัมน์มาตรฐาน | High | Smoke |
| TC-VEN-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-VEN-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-VEN-010009 | กรองตามสถานะจากเมนู Filter สองชั้น | Medium | Functional |
| TC-VEN-010010 | กรองตาม Business Type (เลือกได้หลายรายการ) | High | Functional |
| TC-VEN-010011 | ใช้ตัวกรองสองตัวพร้อมกันแล้วล้างทั้งหมด | Medium | Functional |
| TC-VEN-010012 | เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default | Medium | Functional |
| TC-VEN-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-VEN-010014 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Medium | Functional |
| TC-VEN-010015 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-VEN-010016 | ส่งออกรายการผู้ขายเป็นไฟล์ XLSX | Medium | Functional |
| TC-VEN-010017 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-VEN-010018 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-VEN-010019 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-VEN-010020 | คอลัมน์ Code เปิดหน้ารายละเอียดได้เหมือนคอลัมน์ Name | Low | Functional |
| TC-VEN-030014 | หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new | Medium | Functional |
| TC-VEN-030015 | สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของรายการใหม่ | High | Happy Path |
| TC-VEN-030016 | Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list | Medium | Alternate Flow |
| TC-VEN-030017 | ปุ่ม Go back จากฟอร์มสร้างที่ยังไม่แก้อะไร กลับ list ทันที | Low | Functional |
| TC-VEN-030018 | กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-VEN-030019 | แถวที่เพิ่มใหม่ถูกวางไว้บนสุด (prepend) ทั้งสามหมวด | Medium | Functional |
| TC-VEN-030020 | ที่อยู่โหมดไทยเป็นค่าเริ่มต้น และรหัสไปรษณีย์เติมจังหวัด/อำเภอ/ตำบลให้ | High | Functional |
| TC-VEN-030021 | สลับ Thailand ↔ International เปลี่ยนชุดช่องของแถวที่อยู่ | Medium | Functional |
| TC-VEN-030022 | ลบแถวผู้ติดต่อต้องยืนยันก่อน ต่างจากที่อยู่และข้อมูลเพิ่มเติม | Medium | Functional |
| TC-VEN-030023 | เลือก business type หลายรายการ ค้นหา และถอดออกจาก badge | Medium | Functional |
| TC-VEN-030024 | สร้างผู้ขายที่ปิดใช้งานพร้อมคำอธิบาย แล้วค่าคงอยู่ | Medium | CRUD |
| TC-VEN-030025 | สร้างผู้ขายพร้อมข้อมูลเพิ่มเติมชนิด Number แล้วค่าคงอยู่ | Medium | CRUD |
| TC-VEN-040002 | หน้ารายละเอียดโหมด view แสดงข้อมูลครบและแก้ไม่ได้ | High | Functional |
| TC-VEN-040003 | deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view | Medium | Functional |
| TC-VEN-040004 | deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Vendor not found | Medium | Edge Case |
| TC-VEN-040005 | ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view | Medium | Alternate Flow |
| TC-VEN-040006 | เพิ่มที่อยู่ในโหมดแก้ไขแล้วค่าคงอยู่ | High | CRUD |
| TC-VEN-040007 | แก้ไขที่อยู่เดิมแล้วค่าคงอยู่ | High | CRUD |
| TC-VEN-040008 | ลบที่อยู่เดิมแล้วหายจริงหลังโหลดใหม่ | High | CRUD |
| TC-VEN-040009 | เพิ่มผู้ติดต่อในโหมดแก้ไขแล้วค่าคงอยู่ | High | CRUD |
| TC-VEN-040010 | แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดแถวซ้ำ | High | Edge Case |
| TC-VEN-040011 | ปิดใช้งานผู้ขายจากโหมดแก้ไขแล้วสถานะเปลี่ยนทุกที่ | Medium | CRUD |
| TC-VEN-040012 | แก้คำอธิบายและข้อมูลเพิ่มเติมแล้วค่าคงอยู่ | Medium | CRUD |
| TC-VEN-040013 | เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด | Low | Functional |
| TC-VEN-040014 | กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก | Medium | Functional |
| TC-VEN-040015 | ปุ่มจัดการใบรับรองโผล่เฉพาะโหมดแก้ไข | Medium | Functional |
| TC-VEN-040016 | เพิ่มใบรับรองให้ผู้ขาย | High | CRUD |
| TC-VEN-040017 | แก้ไขใบรับรองที่มีอยู่ | Medium | CRUD |
| TC-VEN-040018 | ลบใบรับรองของผู้ขาย | Medium | CRUD |
| TC-VEN-050004 | ลบผู้ขายจากหน้ารายละเอียดแล้วเด้งกลับหน้า list | High | CRUD |
| TC-VEN-050005 | ลบผู้ขายจากปุ่มลบบนการ์ดในมุมมองกริด | Low | CRUD |
| TC-VEN-100001 | ไม่มีสิทธิ์ดู — เมนู sidebar จาง และ deep link ถูก RouteGuard บล็อก | High | Authorization |
| TC-VEN-100002 | ไม่มีสิทธิ์ลบ — เมนูลบในแถวและปุ่มลบบนการ์ดเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-VEN-100003 | รายชื่อผู้ขายแยกตาม business unit | High | Security |
| TC-VEN-200007 | ข้อความ error ของ Code/Name และการเลื่อนไปช่องแรกที่ผิด | High | Validation |
| TC-VEN-200008 | แถวที่อยู่ที่ไม่ได้เลือก Address Type บล็อกการบันทึก | High | Validation |
| TC-VEN-200009 | แถวผู้ติดต่อที่ไม่กรอกชื่อ บล็อกการบันทึกพร้อมข้อความใต้ช่อง | High | Validation |
| TC-VEN-200010 | ขีดจำกัดความยาวของช่องในหมวดที่อยู่ ผู้ติดต่อ และข้อมูลเพิ่มเติม | Low | Validation |
| TC-VEN-200011 | การตรวจค่าในกล่องเพิ่มใบรับรอง | Medium | Validation |

---
## TC-VEN-010006 — หน้า list แสดงหัวเรื่อง จำนวนรายการ และคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายอย่างน้อย 1 รายการใน BU และอย่างน้อย 1 รายการมี business type
**Steps**
1. ไปที่ `/vendor-management/vendor`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
3. อ่านแถบหัว แถบเครื่องมือ และหัวตาราง
**Expected**
หัวหน้าแสดงไอคอนโมดูล ชื่อ "Vendor" และ badge จำนวนรายการรวม (แสดงเฉพาะเมื่อ > 0) พร้อมคำอธิบายใต้ชื่อ "Everyone you buy from — contacts, payment terms, and the certifications they hold."; แถบหัวมีปุ่ม Export, Print และ "Add Vendor"; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Business Type, Status และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น** (`initialState.columnVisibility` ใน `use-vendor-table.tsx`); คอลัมน์ Business Type แสดงค่าเป็น badge หนึ่งใบต่อหนึ่งประเภท และเว้นว่างเมื่อไม่มี; แถบเครื่องมือมีช่องค้นหา (placeholder "Search..."), ปุ่ม saved view (ป้าย "No view"), ปุ่ม Filter, ปุ่มเรียงลำดับ (aria-label "Sort by"), ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และปุ่มสลับมุมมอง list/grid

---
## TC-VEN-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor`; มีผู้ขายหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับผู้ขายที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-VEN-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search"); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-VEN-010009 — กรองตามสถานะจากเมนู Filter สองชั้น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` บนหน้าจอขนาด desktop; มีผู้ขายทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. อ่านรายการแถวในเมนูที่เปิดออกมา
3. ชี้/คลิกแถว "Status" แล้วเลือก "Active" จากกล่องที่กางออกด้านข้าง
4. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
5. เปลี่ยนตัวเลือกเป็น "Inactive" แล้วเป็น "All"
**Expected**
เมนูมีสามแถวคือ Status, Business Type และ Clear (รวมแถว "Save current filters as view" ท้ายเมนู) — **ทุกแถวเป็น `<button>` ธรรมดา ไม่ใช่ `role="menuitem"` หรือ `role="option"`** (ดูหมายเหตุข้อ 4); กล่องด้านข้างของ Status มีสามตัวเลือกเป็นปุ่มเช่นกัน คือ All / Active / Inactive พร้อมเครื่องหมายถูกหน้าตัวเลือกที่เลือกอยู่; เลือก Active แล้วตารางเหลือเฉพาะแถวที่คอลัมน์ Status เป็นป้าย Active, ปุ่ม Filter มี badge เลข 1, แถบ chip ใต้แถบเครื่องมือขึ้นต้นด้วยคำว่า "Filters:" และมี chip ของสถานะพร้อมปุ่มลบ (aria-label "Remove Status filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และ `page` ถูกล้าง; เลือก Inactive ได้ `is_active|bool:false`; เลือก All ล้างพารามิเตอร์ `filter` และ chip หายไป

---
## TC-VEN-010010 — กรองตาม Business Type (เลือกได้หลายรายการ)
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` บน desktop; BU มี business type ที่ `is_active` อย่างน้อย 2 ประเภท และมีผู้ขายที่ผูกกับแต่ละประเภทอย่างน้อยประเภทละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter แล้วชี้/คลิกแถว "Business Type"
2. เลือกประเภทแรกจากรายการในกล่องด้านข้าง
3. สังเกตตาราง, chip และ query string
4. เลือกประเภทที่สองเพิ่ม
5. คลิกแถว "All" ในกล่องเดียวกัน
**Expected**
กล่องด้านข้างของ Business Type เป็นรายการค้นหาได้ที่ render เป็น `role="option"` (ต่างจากกล่องของ Status — `MultiSelectFilter` ใช้ `CommandItem`) โดยมีแถว "All" อยู่บนสุดพร้อม checkbox และตามด้วยชื่อประเภทที่ `is_active` เท่านั้น; เลือกหนึ่งประเภทแล้วตารางเหลือเฉพาะผู้ขายที่มีประเภทนั้นใน badge คอลัมน์ Business Type, query string มี `business_type=business_type_id|string:<uuid>` และ chip แสดงชื่อประเภท; เลือกประเภทที่สองเพิ่มแล้วค่าใน URL ต่อกันด้วยเครื่องหมายจุลภาค (`...:<uuid1>,business_type_id|string:<uuid2>`) และ chip แสดงเป็น "ชื่อแรก +1"; คลิก "All" แล้วพารามิเตอร์ `business_type` ถูกล้างและตารางกลับมาครบ

---
## TC-VEN-010011 — ใช้ตัวกรองสองตัวพร้อมกันแล้วล้างทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` บน desktop; มีผู้ขายที่เปิดใช้งานและผูก business type อย่างน้อย 1 รายการ
**Steps**
1. ตั้งตัวกรอง Status = Active
2. ตั้งตัวกรอง Business Type เป็นประเภทหนึ่ง
3. สังเกต badge บนปุ่ม Filter และจำนวน chip
4. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
badge บนปุ่ม Filter เป็นเลข 2 และแถบ chip มี chip สองใบ; URL มีทั้ง `filter=is_active|bool:true` และ `business_type=...` พร้อมกัน (สอง query param แยกกัน — `encodeFilterParam` เป็นคนรวมเป็น clause เดียวส่งให้ backend ไม่ได้รวมใน URL); กด "Clear" แล้ว chip ทั้งหมดหายและแถบตัวกรองไม่แสดงอีก (`ActiveFilterBar` คืน `null` เมื่อไม่มี filter), badge บนปุ่ม Filter หายไป, พารามิเตอร์ `filter` · `business_type` · `sv` ถูกล้างออกจาก URL และตารางกลับมาแสดงรายการทั้งหมด

---
## TC-VEN-010012 — เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/vendor-management/vendor` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีผู้ขายอย่างน้อย 2 รายการที่ code ต่างกัน
**Steps**
1. สังเกต URL ตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วอ่านรายชื่อในเมนู
3. เลือก "Code"
4. เลือก "Code" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้ **ไม่มี default sort** (`VendorComponent` เรียก `useDataGridState()` โดยไม่ส่ง `defaultSort`) — เข้าครั้งแรก URL ไม่มี `sort` และแถว "Default" มีไอคอนกำกับอยู่; เมนูมีหัวข้อ "Sort by" และมี 5 แถวคือ Code, Name, `is_active`, Created, Updated — **คอลัมน์ Business Type ไม่อยู่ในเมนู** เพราะตั้ง `enableSorting: false` ไว้ และแถวสถานะแสดงเป็น `is_active` ตามหมายเหตุข้อ 12 ไม่ใช่คำว่า Status; เลือก Code ครั้งแรกได้ `sort=code:asc` พร้อมลูกศรขึ้นบนแถวนั้น, เลือกซ้ำได้ `sort=code:desc` พร้อมลูกศรลง และลำดับแถวสลับตาม; เมนูเปิดค้างระหว่างสลับทิศ; เลือก Default ล้าง `sort` และ `page` ออกจาก URL

---
## TC-VEN-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Business Type
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และรายการ 6 รายการคือ Code, Name, Business Type, `is_active`, Created, Updated พร้อม checkbox (ช่องเลือก/ลำดับที่/ปุ่มจัดการไม่อยู่ในเมนูเพราะไม่มี `accessorFn`); Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น; เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลาและชื่อผู้ทำรายการ; ปิด Business Type แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-VEN-010014 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` บนหน้าจอขนาด desktop; มีผู้ขายอย่างน้อย 1 รายการที่มี business type และมีผู้ติดต่อที่ถูกตั้งเป็น primary พร้อมอีเมลและเบอร์โทร (เตรียมผ่าน backend/ข้อมูลตั้งต้น — อย่าตั้งผ่าน UI เพราะช่อง Primary ยังติดบั๊กตามหมายเหตุข้อ 5)
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดของผู้ขายรายนั้นและท้ายรายการ
3. คลิกที่เนื้อการ์ด (ไม่ใช่ปุ่ม Delete ที่ footer)
4. กลับหน้า list แล้วคลิกปุ่มมุมมองตาราง (aria-label "List view")
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดเป็น element ที่มี `role="button"` โดยแสดงชื่อผู้ขายเป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว Code, แถว Business Type ที่เป็น badge (แสดงเฉพาะเมื่อมี), แถว Contact Person / Phone / Email ของ **ผู้ติดต่อที่ถูกตั้งเป็น primary เท่านั้น** (แต่ละแถวแสดงเฉพาะเมื่อมีค่า) และแถว Created / by / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ไม่มีแถบ pagination** (โหลดเพิ่มแบบ infinite scroll ผ่าน sentinel ของ `useGridPagination`); คลิกเนื้อการ์ดแล้ว navigate ไปหน้ารายละเอียด `/vendor-management/vendor/<uuid>`; กลับมาแล้วสลับเป็นตารางได้ข้อมูลครบเหมือนเดิม

---
## TC-VEN-010015 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` ในมุมมองตาราง; BU มีผู้ขายมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 (`useListPageState` default) และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม, คอลัมน์ลำดับที่ (#) เริ่มนับต่อเนื่องจากหน้าก่อน (ไม่รีเซ็ตเป็น 1) และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-VEN-010016 — ส่งออกรายการผู้ขายเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` บน desktop; มีผู้ขายอย่างน้อย 1 รายการในหน้าปัจจุบัน และอย่างน้อย 1 รายการมี business type
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX (ชื่อขึ้นต้นด้วย `vendor`, sheet ชื่อ "Vendors") ที่มี 4 คอลัมน์ตามลำดับ Code / Name / Business Type / Status; ช่อง Business Type เป็นชื่อประเภทต่อกันด้วย ", " และช่อง Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false; **ไม่มีคอลัมน์ Description ในไฟล์ แม้ฟอร์มจะมีช่องนี้**; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น (ยิงด้วย `combinedParams` ซึ่งมี `page`/`perpage` ติดไปด้วย) และเคารพตัวกรองที่เปิดอยู่; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-VEN-010017 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/vendor-management/vendor` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-VEN-010018 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/vendor` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือกขอบเขต "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนูของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog บันทึก view มีหัวข้อ "Save view" ช่อง "View name" และตัวเลือกขอบเขต "Only me" / "Everyone in this business unit"; บันทึกแล้วแสดง toast `View "<ชื่อ>" saved`, ป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อกลุ่ม "My views"; ลบ view แล้วรายการหายจากเมนู, แสดง toast "View deleted" และ `sv` ถูกล้างออกจาก URL

---
## TC-VEN-010019 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/vendor` และมีผู้ขายอย่างน้อย 1 รายการที่รู้ code แน่นอน
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
4. ปิด sheet แล้วกลับหน้าเดิม
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete (Delete เป็น variant สีเตือน) — **ไม่มีรายการ Edit** เพราะ `useVendorTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Code หรือ Name เท่านั้น); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมหัวข้อ "Activity" โดยอ้าง **code** ของแถวนั้น (`activity.label: (r) => r.code`); ปิด sheet แล้วกลับมาหน้า list โดย URL และข้อมูลไม่เปลี่ยน

---
## TC-VEN-010020 — คอลัมน์ Code เปิดหน้ารายละเอียดได้เหมือนคอลัมน์ Name
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ทั้ง code และ name
**Steps**
1. ค้นหาผู้ขายรายนั้นในหน้า list
2. คลิกข้อความในคอลัมน์ **Code** ของแถวนั้น
3. จำ URL ที่ได้ แล้วกลับหน้า list
4. คลิกข้อความในคอลัมน์ **Name** ของแถวเดียวกัน
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ทั้งสองคอลัมน์ render เป็น `<button>` ที่มีสไตล์ลิงก์ (`CellAction` — ไม่ใช่ `<a href>` จึงต้องคลิกที่ปุ่ม ไม่ใช่ที่แถว ซึ่งมี checkbox กับเมนูจัดการอยู่ด้วย); คลิกคอลัมน์ Code พาไปหน้า `/vendor-management/vendor/<uuid>` ของรายการนั้น; คลิกคอลัมน์ Name พาไป URL เดียวกันเป๊ะ; ทั้งสองครั้งหน้าที่ได้อยู่ในโหมด view (มีปุ่ม Edit ไม่ใช่ปุ่ม Save); แถวที่ชื่อว่างจะ render จุดไข่ปลา `...` แทนชื่อแต่ยังคลิกได้

---
## TC-VEN-030014 — หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ยังไม่เคยเปิดฟอร์มในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Vendor" ในหน้า list
2. อ่านหัวเรื่อง แถบปุ่ม และค่าในทุกหมวด
**Expected**
URL เป็น `/vendor-management/vendor/new`; หัวเรื่องเป็นข้อความ placeholder "e.g. บริษัท ABC จำกัด" แสดงเป็นตัวเอียงสีจาง (`titleMuted`) และ **ไม่มี badge code และไม่มีป้ายสถานะข้างหัวเรื่อง** (ทั้งคู่ขึ้นเฉพาะเมื่อมี record); แถบปุ่มมีเฉพาะ Cancel กับ Create และปุ่ม Go back — **ไม่มีปุ่ม Edit, Delete หรือ Activity**; หมวดแรกชื่อ "General" พร้อมคำอธิบาย "Vendor code, name, business type and status." โดยช่อง Name (`#vendor-name`, placeholder "e.g. บริษัท ABC จำกัด") และ Code (`#vendor-code`, placeholder "e.g. VN-001") ว่างและ label มีเครื่องหมาย `*`, ช่อง Business Type แสดงข้อความ "Select Business Type", ช่อง Description (`#vendor-description`) ว่างและ label **ไม่มี** เครื่องหมายบังคับกรอก, สวิตช์สถานะอยู่ที่เปิดใช้งาน; หมวด "Addresses", "Contacts" และ "Additional Info" แสดงเลข 0 ข้างหัวข้อ กล่องว่างแบบกรอบประพร้อมข้อความ ("No Addresses Yet" / "No Contacts Yet" / "No additional info") และปุ่มเพิ่มอยู่ที่หัวหมวด ("Add address" / "Add Contact" / "Add field") — **ไม่มีปุ่มเพิ่มซ้ำในกล่องว่าง**; **ไม่มีหมวด "Certificates" บนหน้านี้เลย** (render เฉพาะเมื่อมี `vendor.id`)

---
## TC-VEN-030015 — สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของรายการใหม่
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; code/name ที่จะใช้ยังไม่มีอยู่ใน DB
**Steps**
1. เปิด `/vendor-management/vendor/new`
2. กรอก Name และ Code
3. กด Create แล้วรอ toast
4. สังเกต URL แถบปุ่ม และหัวเรื่องของหน้าที่ได้
5. กดปุ่ม Go back
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast **"Vendor created successfully"** (ผูกกับข้อความเต็ม ไม่ใช่คำว่า success ลอย ๆ — ดูหมายเหตุข้อ 6); **URL เปลี่ยนเป็น `/vendor-management/vendor/<uuid>` ของรายการใหม่** และหน้าอยู่ในโหมด view — หัวเรื่องเป็นชื่อผู้ขาย (ไม่เอียงแล้ว) ตามด้วย badge "· <code>" และป้ายสถานะ Active, แถบปุ่มมี Edit / Delete / Activity, ค่าทุกช่องในหมวด General แสดงเป็นข้อความ และหมวด "Certificates" โผล่ขึ้นมาแล้ว; เพราะ navigate ใช้ `replace: true` การกด Go back จึงพาไปหน้า list ไม่ใช่ย้อนกลับไปหน้า `/new`

---
## TC-VEN-030016 — Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new` และกรอก Code กับ Name ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ในแถบปุ่ม
2. อ่านหัวข้อและปุ่มใน dialog ที่เด้งขึ้น
3. กดปุ่ม "Keep editing"
4. คลิก Cancel อีกครั้งแล้วกดปุ่ม "Discard"
5. ค้นหา code ที่กรอกไว้ในหน้า list
**Expected**
กด Cancel แล้วเด้ง alert dialog หัวข้อ "Discard changes?" พร้อมคำอธิบาย "You have unsaved changes that will be lost." และปุ่มสองตัวคือ "Keep editing" กับ "Discard" (variant warning); กด "Keep editing" แล้ว dialog ปิดและยังอยู่ที่ `/vendor-management/vendor/new` โดยค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วกลับไปหน้า `/vendor-management/vendor` (ในโหมดสร้าง `handleCancel` เรียก `backToList`); ค้นหา code นั้นแล้วไม่พบรายการ (ไม่มีอะไรถูกบันทึก)

---
## TC-VEN-030017 — ปุ่ม Go back จากฟอร์มสร้างที่ยังไม่แก้อะไร กลับ list ทันที
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด `/vendor-management/vendor/new` โดย **ยังไม่พิมพ์อะไรเลย**
**Steps**
1. คลิกปุ่ม Go back (ปุ่มลูกศรซ้ายหน้าหัวเรื่อง, label "Go back")
**Expected**
กลับไปหน้า `/vendor-management/vendor` ทันทีโดย **ไม่มี Discard dialog** (ฟอร์มยังไม่ dirty); ปลายทางคือหน้า list เสมอ ไม่ใช่การถอย history ทีละหน้า (`handleBack` → `navigate(listPath)`)

---
## TC-VEN-030018 — กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new` และกรอก Name ไว้แล้ว (ฟอร์ม dirty) โดยยังไม่กด Create
**Steps**
1. คลิกเมนูอื่นใน sidebar (ลิงก์ที่มี `href` ไปคนละ path เช่น Price List หรือ Certification)
2. อ่าน dialog ที่เด้งขึ้นแล้วกด "Keep editing"
3. ตรวจ URL และค่าที่กรอกไว้
4. คลิกเมนูเดิมซ้ำแล้วกด "Discard"
**Expected**
คลิกลิงก์แล้ว **ยังไม่ navigate** แต่เด้ง Discard dialog ใบเดียวกับ `TC-VEN-030016` (`useNavigationGuard` ดัก click ของ `<a>` ใน capture phase); กด "Keep editing" แล้ว URL ยังเป็น `/vendor-management/vendor/new` และค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วจึงไปยังหน้าปลายทางของลิงก์นั้นจริง

---
## TC-VEN-030019 — แถวที่เพิ่มใหม่ถูกวางไว้บนสุด (prepend) ทั้งสามหมวด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`
**Steps**
1. กด "Add address" แล้วกรอก Address line 1 เป็น "AAA"
2. กด "Add address" อีกครั้งแล้วกรอก Address line 1 ของแถวที่เพิ่งเพิ่มเป็น "BBB"
3. ทำแบบเดียวกันกับ "Add Contact" (ชื่อ "AAA" แล้ว "BBB") และ "Add field" (label "AAA" แล้ว "BBB")
4. อ่านลำดับแถวบนหน้าจอและเลขนับข้างหัวข้อแต่ละหมวด
**Expected**
ทั้งสามหมวดใช้ `prepend` ไม่ใช่ `append` — **แถวที่เพิ่มทีหลังอยู่บนสุดเสมอ** ดังนั้นแถวที่มีค่า "BBB" อยู่เหนือแถว "AAA" และ input ของแถวบนสุดคือ index `0` (`vendor_address.0.address_line1` / `vendor_contact.0.name` / `info.0.label`); เลขข้างหัวข้อหมวดเพิ่มเป็น 2 ทั้งสามหมวด
_(สำคัญสำหรับคนเขียนสเปก: helper ของ page object ทุกตัวกรอกแถวที่เพิ่งเพิ่มที่ index 0 ตามพฤติกรรมนี้ — ถ้าแอปเปลี่ยนไปใช้ `append` เมื่อไร ทุกเคสที่กรอกแถวจะเขียนทับแถวเดิมเงียบ ๆ)_

---
## TC-VEN-030020 — ที่อยู่โหมดไทยเป็นค่าเริ่มต้น และรหัสไปรษณีย์เติมจังหวัด/อำเภอ/ตำบลให้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`; รู้รหัสไปรษณีย์ไทยที่มีตำบลเดียว (ตรงกับข้อมูลใน `/data/thai-subdistricts.json` ของแอป)
**Steps**
1. กด "Add address"
2. สังเกตว่าตัวเลือก Thailand / International อันไหนถูกเลือกอยู่ และมีช่องอะไรบ้าง
3. กรอกรหัสไปรษณีย์ 5 หลักลงในช่อง "Postal code (auto-fill or type)"
4. อ่านค่าของช่อง Province / District / Sub-district และ Country
**Expected**
แถวใหม่เริ่มที่โหมด **Thailand** เสมอ (`isThai` ตั้งจาก country ที่ว่าง — `vendor-address.tsx:135-137`) โดยมีช่อง Address line 1, Address line 2 (optional), lookup สามชั้น Province / District / Sub-district, ช่องรหัสไปรษณีย์ และช่อง Country ที่ถูก **disable + readOnly แสดงคำว่า "Thailand"** ตายตัว; กรอกรหัสไปรษณีย์ครบ 5 หลักแล้วระบบเติม Province และ District ให้อัตโนมัติ, เติม Sub-district ให้ด้วยเมื่อรหัสนั้นมีตำบลเดียว (ถ้ามีหลายตำบล Sub-district จะถูกล้างให้เลือกเอง) และตั้งค่า country ในฟอร์มเป็น "Thailand"; ช่อง Address line 1 / 2 ยังว่างอยู่ตามที่กรอกเอง
_(ข้อเท็จจริงที่ต้องรู้ตอนเขียน assertion: ช่อง Country ในโหมดไทย **ไม่ได้ register เข้า react-hook-form** ค่าของมันถูกตั้งด้วย `setValue` เฉพาะตอนสลับมาโหมดไทยหรือตอน resolve รหัสไปรษณีย์ — อ่านค่าจาก input ตัวนั้นจึงไม่ใช่การอ่านค่าในฟอร์ม)_

---
## TC-VEN-030021 — สลับ Thailand ↔ International เปลี่ยนชุดช่องของแถวที่อยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new` และเพิ่มแถวที่อยู่ไว้ 1 แถวแล้ว
**Steps**
1. คลิกตัวเลือก "International" (`#international-0`)
2. อ่านชุดช่องที่แสดง
3. กรอก City, District, Sub-district, Province / State, Postal code และ Country
4. คลิกกลับไปที่ "Thailand" (`#thai-0`)
**Expected**
โหมด International เปลี่ยนเป็นช่องข้อความอิสระ 6 ช่องคือ City, District, Sub-district, Province / State, Postal code, Country โดย **ไม่มี lookup สามชั้นของไทยและไม่มีช่อง Country ที่ล็อกไว้**; ช่อง Country พิมพ์ได้เอง; สลับกลับเป็น Thailand แล้ว lookup สามชั้นกลับมา, ช่อง Country กลับเป็น "Thailand" แบบล็อก และค่าที่เลือกไว้ในระบบ lookup (province/district/subdistrict code) ถูกรีเซ็ตเป็นค่าว่าง; ทั้งสองโหมดใช้ `vendor_address.0.*` ชุด field เดียวกัน (ตัวสลับเป็น state ของแถว ไม่ใช่ field ในฟอร์ม)

---
## TC-VEN-030022 — ลบแถวผู้ติดต่อต้องยืนยันก่อน ต่างจากที่อยู่และข้อมูลเพิ่มเติม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new` และเพิ่มไว้หมวดละ 1 แถว (ที่อยู่ / ผู้ติดต่อ / ข้อมูลเพิ่มเติม) โดยกรอกค่าพอให้แยกแถวออก
**Steps**
1. กดปุ่มกากบาทของแถวที่อยู่ (aria-label "Remove address")
2. กดปุ่มกากบาทของแถวข้อมูลเพิ่มเติม (aria-label "Remove info")
3. กดปุ่มกากบาทของแถวผู้ติดต่อ (aria-label "Remove contact")
4. อ่านหัวข้อกล่องที่เด้งขึ้น แล้วกด Cancel
5. กดปุ่มกากบาทของแถวผู้ติดต่ออีกครั้งแล้วกด Delete เพื่อยืนยัน
**Expected**
แถวที่อยู่และแถวข้อมูลเพิ่มเติม **หายทันทีโดยไม่มีกล่องยืนยัน** และเลขข้างหัวข้อหมวดลดลงเป็น 0; แถวผู้ติดต่อ **เปิด alert dialog ก่อนเสมอ** โดยหัวข้อคือ "Remove Contact" และ footer มีปุ่ม Cancel กับ Delete; กด Cancel แล้วแถวผู้ติดต่อยังอยู่ครบพร้อมค่าที่กรอกไว้; ยืนยันแล้วแถวหายและเลขข้างหัวข้อเป็น 0
_(อย่า assert คำอธิบายในกล่อง — ปัจจุบันเป็น `Are you sure you want to remove "Item #1"?` เสมอเพราะอ่าน field ผิด ดูหมายเหตุข้อ 10)_

---
## TC-VEN-030023 — เลือก business type หลายรายการ ค้นหา และถอดออกจาก badge
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`; BU มี business type ที่ `is_active` อย่างน้อย 2 ประเภท และรู้ชื่ออย่างน้อย 1 ประเภทเพื่อใช้ค้นหา
**Steps**
1. คลิกปุ่มเลือก Business Type
2. เลือกประเภทแรก แล้วเลือกประเภทที่สองต่อโดยไม่ปิด popover
3. พิมพ์บางส่วนของชื่อประเภทหนึ่งในช่องค้นหาใน popover
4. กด Escape เพื่อปิด แล้วคลิกปุ่มกากบาทบน badge ของประเภทหนึ่ง
**Expected**
popover เป็นรายการค้นหาได้ (`role="option"`) ที่มี checkbox หน้าแต่ละแถวและแสดงเฉพาะประเภทที่ `is_active`; **เลือกได้หลายรายการและ popover ไม่ปิดเองหลังเลือก** (multi-select) โดยปุ่ม trigger แสดง badge หนึ่งใบต่อหนึ่งประเภทที่เลือก; พิมพ์ค้นหาแล้วรายการกรองตามคำค้น (ยิง backend ด้วย `search` ของ `useBusinessType`); ปิด popover แล้วคลิกกากบาทบน badge (aria-label "Remove <ชื่อประเภท>") ถอดประเภทนั้นออกได้โดย **ไม่เปิด popover ขึ้นมาใหม่** และ badge ที่เหลือยังอยู่

---
## TC-VEN-030024 — สร้างผู้ขายที่ปิดใช้งานพร้อมคำอธิบาย แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; code/name ที่จะใช้ยังไม่มีอยู่ใน DB
**Steps**
1. เปิด `/vendor-management/vendor/new`
2. กรอก Name, Code และ Description
3. ปิดสวิตช์สถานะ (`#vendor-is-active`)
4. กด Create แล้วรอ toast
5. กลับหน้า list แล้วค้นหาผู้ขายรายนั้น
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Vendor created successfully" และเด้งไปหน้ารายละเอียด; บนหัวหน้ารายละเอียดป้ายสถานะเป็น **Inactive** และในหมวด General ช่อง Status แสดงป้าย Inactive ส่วนช่อง Description แสดงข้อความที่กรอก (ขึ้นบรรทัดใหม่ได้ — `whitespace-pre-wrap`); ในหน้า list คอลัมน์ Status ของแถวนั้นเป็นป้าย Inactive และตัวกรอง Status = Inactive ต้องค้นเจอรายการนี้

---
## TC-VEN-030025 — สร้างผู้ขายพร้อมข้อมูลเพิ่มเติมชนิด Number แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; code/name ที่จะใช้ยังไม่มีอยู่ใน DB
**Steps**
1. เปิด `/vendor-management/vendor/new` แล้วกรอก Name กับ Code
2. กด "Add field" แล้วกรอก label = "Tax ID", value = "0105561000000" และเปลี่ยนชนิดเป็น "Number"
3. กด Create แล้วรอ toast
4. อ่านหมวด "Additional Info" บนหน้ารายละเอียดที่เด้งไป
5. โหลดหน้าซ้ำแล้วอ่านอีกครั้ง
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ตัวเลือกชนิดข้อมูลมีสองค่าคือ "String" (ค่าเริ่มต้น) และ "Number"; บันทึกแล้วได้ toast "Vendor created successfully"; หมวด "Additional Info" ในโหมด view แสดงเป็นแถวอ่านอย่างเดียวสามช่อง — label, value และป้ายตัวพิมพ์ใหญ่ของชนิดข้อมูล (`NUMBER`) — ไม่มี `<input>` ในหมวดนี้; หลังโหลดหน้าซ้ำค่ายังครบเหมือนเดิม (persist จริง ไม่ใช่แค่ optimistic) และเลขข้างหัวข้อหมวดเป็น 1

---
## TC-VEN-040002 — หน้ารายละเอียดโหมด view แสดงข้อมูลครบและแก้ไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ กรอก Description, มี business type 1 ประเภท, มีที่อยู่ 1 แห่ง, มีผู้ติดต่อ 1 คน และมีข้อมูลเพิ่มเติม 1 แถว
**Steps**
1. เปิดผู้ขายรายนั้นจากหน้า list
2. อ่านหัวเรื่อง badge แถบปุ่ม และค่าในแต่ละหมวด
3. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวเรื่องคือ **ชื่อผู้ขาย** (ไม่เอียง) ตามด้วย badge "· <code>" และป้ายสถานะ; แถบปุ่มมี Edit, Delete, Activity และปุ่ม Go back — **ไม่มีปุ่ม Save/Cancel**; หมวด General แสดงทุกค่าเป็นข้อความ (`[data-slot="field-plain-text"]`) และ **ไม่มี `#vendor-name` / `#vendor-code` / `#vendor-description` อยู่ใน DOM เลย** (ช่องที่ไม่มีค่าแสดงขีด `—`); หมวด Contacts แสดงการ์ดอ่านอย่างเดียว (ชื่อเป็นข้อความ, อีเมลเป็นลิงก์ `mailto:`, เบอร์เป็นลิงก์ `tel:`, ไม่มีช่องติ๊ก primary และไม่มีปุ่มลบ); หมวด Additional Info แสดงเป็นแถวข้อความ; **หมวด Addresses ยัง render เป็น `<input>` อยู่แต่ทุกช่องถูก `disabled` และไม่มีปุ่มลบแถว** (ดูหมายเหตุข้อ 11); ทุกหมวดไม่มีปุ่มเพิ่ม ("Add address" / "Add Contact" / "Add field" / "Add Certificate" หายไปทั้งหมด); เลขข้างหัวข้อแต่ละหมวดตรงกับจำนวนรายการจริง

---
## TC-VEN-040003 — deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; รู้ `<uuid>` ของผู้ขายที่มีอยู่จริง (สร้างไว้สำหรับเทสนี้)
**Steps**
1. `page.goto("/vendor-management/vendor/<uuid>")` ตรง ๆ โดยไม่ผ่านหน้า list
2. รอให้ฟอร์มโหลดเสร็จ (FormSkeleton หาย)
3. กด Edit แล้วสังเกต URL
4. โหลดหน้าซ้ำ
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
เข้าได้โดยไม่ถูก redirect; ระหว่างโหลดแสดง skeleton ของฟอร์ม แล้วจึงแสดงข้อมูลของผู้ขายรายนั้นในโหมด view; หลังกด Edit หน้าเข้าสู่โหมดแก้ไข (ปุ่มเปลี่ยนเป็น Cancel / Save และช่องต่าง ๆ กลายเป็น input) แต่ **URL ไม่เปลี่ยน**; โหลดหน้าซ้ำแล้วกลับเป็นโหมด view อีกครั้ง (`useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่ mount เมื่อมี entity) — การ assert ค่าหลังโหลดซ้ำจึงต้องอ่านจากข้อความ ไม่ใช่จาก `#vendor-name`

---
## TC-VEN-040004 — deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Vendor not found
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. `page.goto("/vendor-management/vendor/00000000-0000-0000-0000-000000000000")`
2. รอให้หน้าโหลดเสร็จ
3. กดปุ่มกลับหน้า list
**Expected**
แสดงกล่องสถานะข้อผิดพลาด (`role="alert"`) หัวข้อ "Something went wrong" และข้อความ **"Vendor not found"** (ค่า `vendorManagement.vendor.notFound` ที่ `VendorEditContent` ส่งให้ `ErrorState`); เพราะเป็นทางตัน จึง **ไม่มีปุ่ม "Try again"** แม้จะส่ง `onRetry` มา (`isDeadEnd` เป็นจริงเมื่อมี `backTo`) แต่มีปุ่ม "Back to list" และ "Go to dashboard"; กดปุ่มแรกแล้วกลับไปหน้า `/vendor-management/vendor`

---
## TC-VEN-040005 — ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ค่า Name / Description เดิม
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. แก้ Name เป็นค่าอื่น แก้ Description เป็นค่าอื่น และเพิ่มแถวที่อยู่ใหม่ 1 แถว
3. กด Cancel แล้วกด "Discard" ใน dialog
4. อ่านค่าที่แสดงบนหน้าจอ **ทันทีโดยไม่โหลดซ้ำและไม่ออกจากหน้า**
5. กด Edit ซ้ำแล้วอ่านค่าในช่องกรอก
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หลังกด Discard หน้ากลับเป็นโหมด view ในหน้าเดิม (ปุ่ม Edit กลับมา, ปุ่ม Save/Cancel หายไป) โดย **ไม่กลับไปหน้า list** (ต่างจากโหมดสร้าง); ค่าที่แสดงบนหน้าจอเป็นค่าเดิมทั้ง Name และ Description ทันที ไม่ใช่ค่าที่เพิ่งพิมพ์ไป (`form.reset(defaultValues, { keepFieldsRef: true })` เขียนค่ากลับลง DOM จริง); **แถวที่อยู่ที่เพิ่งเพิ่มหายไปด้วยและเลขข้างหัวข้อหมวดกลับเป็นค่าเดิม** (`onResetExtra` ล้าง `removedAddressIds`/`removedContactIds` คู่กับ `reset`); กด Edit ซ้ำแล้วช่องกรอกแสดงค่าเดิมเช่นกัน

---
## TC-VEN-040006 — เพิ่มที่อยู่ในโหมดแก้ไขแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยยัง **ไม่มีที่อยู่**
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กด "Add address" แล้วเลือก Address Type = "Mailing Address"
3. สลับเป็น International แล้วกรอก Address line 1, City และ Country
4. กด Save แล้วรอ toast
5. กลับหน้า list แล้วเปิดผู้ขายรายนั้นใหม่
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ตัวเลือก Address Type มีสามค่าคือ Contact Address / Mailing Address / Registered Address (แต่ละค่ามีไอคอนกำกับ); กด Save แล้วแสดง toast **"Vendor updated successfully"** และหน้ากลับเป็นโหมด view เองโดย URL ไม่เปลี่ยน; เปิดรายการนั้นใหม่แล้วหมวด Addresses มีเลข 1 ข้างหัวข้อและค่าที่กรอกยังอยู่ครบ (แถวใหม่ถูกส่งไปใน `vendor_address.add` เพราะยังไม่มี `id` — `buildNestedPayload`)

---
## TC-VEN-040007 — แก้ไขที่อยู่เดิมแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และ **มีที่อยู่อยู่แล้ว 1 แห่ง** ที่รู้ค่าเดิม
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. แก้ค่าในช่อง Address line 1 ของแถวที่มีอยู่ให้ต่างจากเดิม
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วเปิดผู้ขายรายนั้นใหม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Vendor updated successfully"; เปิดรายการใหม่แล้วช่อง Address line 1 เป็นค่าที่เพิ่งแก้ และ **จำนวนแถวที่อยู่ยังเท่าเดิม ไม่มีแถวซ้ำเพิ่มขึ้นมา** (แถวที่มี `id` และถูกแตะจะไปอยู่ใน `vendor_address.update` ไม่ใช่ `add`)
_(ข้อควรระวังตอนเขียนสเปก: `buildNestedPayload` ตัดสินว่า "แก้แล้ว" จาก `dirtyFields` ของ react-hook-form — แถวที่ไม่ได้ถูกแตะจะไม่ถูกส่งไปเลย ถ้าเทสตั้งค่าด้วยวิธีที่ไม่ทำให้ field dirty ค่าจะไม่ถูกบันทึกและเทสจะล้มแบบที่หาสาเหตุยาก)_

---
## TC-VEN-040008 — ลบที่อยู่เดิมแล้วหายจริงหลังโหลดใหม่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และ **มีที่อยู่อยู่แล้ว 2 แห่ง** ที่แยกออกจากกันได้ด้วย Address line 1
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กดปุ่มกากบาท (aria-label "Remove address") ของแถวบนสุด
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วเปิดผู้ขายรายนั้นใหม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แถวหายจากหน้าจอทันทีและเลขข้างหัวข้อหมวดลดจาก 2 เหลือ 1; กด Save แล้วแสดง toast "Vendor updated successfully"; เปิดรายการใหม่แล้วเหลือที่อยู่แห่งเดียวคือแห่งที่ไม่ได้ลบ (id ของแถวที่ลบถูกส่งไปใน `vendor_address.remove`)

---
## TC-VEN-040009 — เพิ่มผู้ติดต่อในโหมดแก้ไขแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยยัง **ไม่มีผู้ติดต่อ**
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กด "Add Contact" แล้วกรอกชื่อ อีเมล และเบอร์โทร (**ไม่ต้องติ๊ก Primary** — ดูหมายเหตุข้อ 5)
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วเปิดผู้ขายรายนั้นใหม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Vendor updated successfully"; เปิดรายการใหม่แล้วหมวด Contacts มีเลข 1 ข้างหัวข้อ และการ์ดผู้ติดต่อในโหมด view แสดงชื่อ, ลิงก์ `mailto:` ของอีเมล และลิงก์ `tel:` ของเบอร์โทร พร้อมตัวอักษรแรกของชื่อบน avatar; เพราะยังไม่ได้ตั้งเป็น primary การ์ดนี้ **ไม่มี** ป้าย "PRIMARY" และดาวบน avatar และการ์ดของผู้ขายรายนี้ในมุมมองกริดของหน้า list **ไม่แสดงแถว Contact Person** (การ์ดอ่านเฉพาะผู้ติดต่อที่ `is_primary`)

---
## TC-VEN-040010 — แก้ไขสองครั้งติดกันโดยไม่ออกจากหน้า ต้องไม่เกิดแถวซ้ำ
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยยังไม่มีที่อยู่และไม่มีผู้ติดต่อ
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. เพิ่มที่อยู่ 1 แถวและผู้ติดต่อ 1 คน แล้วกด Save รอ toast จนหน้ากลับเป็นโหมด view
3. **โดยไม่โหลดหน้าซ้ำและไม่ออกจากหน้า** กด Edit อีกครั้ง แก้ Description แล้วกด Save
4. โหลดหน้าซ้ำแล้วนับจำนวนที่อยู่และผู้ติดต่อ
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ทั้งสองครั้งได้ toast "Vendor updated successfully"; หลังโหลดหน้าซ้ำมีที่อยู่ **1 แถว** และผู้ติดต่อ **1 คน** เท่านั้น ไม่ใช่อย่างละ 2 — หลังบันทึกรอบแรก query ของ `useVendorById` ถูก invalidate แล้ว refetch ทำให้ prop `vendor` กลับมาพร้อม id ที่ backend ออกให้ และ effect ที่ผูกกับ `vendorSyncKey` (`vendor-form.tsx:113-124`) reset ฟอร์มตามค่าใหม่ แถวเดิมจึงมี `id` แล้วไม่ถูกส่งซ้ำเป็น `add` ในรอบสอง; ค่า Description ที่แก้รอบสองถูกบันทึกจริง

---
## TC-VEN-040011 — ปิดใช้งานผู้ขายจากโหมดแก้ไขแล้วสถานะเปลี่ยนทุกที่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้ในสถานะ Active
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. ปิดสวิตช์สถานะ (`#vendor-is-active`) แล้วสังเกตป้ายบนหัวเรื่องทันที
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วดูคอลัมน์ Status ของแถวนั้น
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ป้ายสถานะข้างหัวเรื่องเปลี่ยนเป็น Inactive **ทันทีที่พลิกสวิตช์** ก่อนกด Save (หัวเรื่องอ่านค่าผ่าน `useWatch`); กด Save แล้วแสดง toast "Vendor updated successfully" และหน้ากลับเป็นโหมด view โดยช่อง Status แสดงป้าย Inactive; ในหน้า list คอลัมน์ Status ของแถวนั้นเป็น Inactive และการกรอง Status = Active ต้องไม่เจอรายการนี้อีก

---
## TC-VEN-040012 — แก้คำอธิบายและข้อมูลเพิ่มเติมแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้พร้อมข้อมูลเพิ่มเติม 1 แถวที่รู้ค่าเดิม
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. แก้ Description เป็นค่าใหม่
3. แก้ค่าในช่อง value ของแถวข้อมูลเพิ่มเติม และเปลี่ยนชนิดจาก String เป็น Number
4. กด Save แล้วรอ toast
5. กลับหน้า list แล้วเปิดผู้ขายรายนั้นใหม่
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Vendor updated successfully"; เปิดรายการใหม่แล้ว Description เป็นค่าใหม่ และแถวข้อมูลเพิ่มเติมแสดง value ใหม่พร้อมป้ายชนิด `NUMBER`; จำนวนแถวในหมวดยังเท่าเดิม (หมวดนี้ถูกส่งทั้งชุดทุกครั้ง ไม่แยก add/update/remove ต่างจากที่อยู่และผู้ติดต่อ)

---
## TC-VEN-040013 — เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และเคยถูกแก้ไขอย่างน้อย 1 ครั้ง
**Steps**
1. เปิดผู้ขายรายนั้นจาก list
2. คลิกปุ่ม Activity ในแถบปุ่ม
3. ปิด sheet
4. กด Edit แล้วสังเกตว่าปุ่ม Activity ยังอยู่หรือไม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ปุ่ม Activity อยู่ท้ายกลุ่มปุ่ม ถัดจาก Edit และ Delete; คลิกแล้วเปิด sheet ประวัติกิจกรรมหัวข้อ "Activity" ของผู้ขายรายนั้น โดยอ้าง **code** (`openActivity(vendor.id, vendor.code)` — ค่าเดียวกับเมนูในแถวตาราง ต่างจากหลายโมดูลที่สองทางอ้างคนละค่า); ปิด sheet แล้ว URL และโหมดของฟอร์มไม่เปลี่ยน; **ปุ่ม Activity ยังแสดงอยู่ในโหมดแก้ไขด้วย** (อยู่นอก ternary ของโหมด — เป็นการดู ไม่ใช่การแก้)

---
## TC-VEN-040014 — กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้; เข้าหน้ารายละเอียดจากหน้า list (มี history ให้ถอยจริง)
**Steps**
1. กด Edit แล้วแก้ Name ให้ฟอร์ม dirty
2. กด Back ของเบราว์เซอร์ (`page.goBack()`)
3. กด "Keep editing"
4. กด Back อีกครั้งแล้วกด "Discard"
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กด Back ครั้งแรกแล้ว **หน้าไม่เปลี่ยน** แต่เด้ง Discard dialog (`useNavigationGuard` ดันรายการ sentinel ไว้ใน history แล้วดัก popstate); กด "Keep editing" แล้ว URL ยังเป็น `/vendor-management/vendor/<uuid>` และค่าที่แก้ไว้ยังอยู่; กด Back ครั้งที่สองแล้วกด "Discard" จึงออกจากหน้าไปจริง (กลับหน้า list) และค่าที่แก้ไว้ไม่ถูกบันทึก

---
## TC-VEN-040015 — ปุ่มจัดการใบรับรองโผล่เฉพาะโหมดแก้ไข
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และ **มีใบรับรองอยู่แล้วอย่างน้อย 1 ใบ**
**Steps**
1. เปิดผู้ขายรายนั้นจาก list (อยู่ในโหมด view)
2. เลื่อนลงไปที่หมวด "Certificates" แล้วอ่านหัวข้อ คำอธิบาย คอลัมน์ และปุ่มที่มี
3. กด Edit แล้วอ่านหมวดเดิมอีกครั้ง
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หมวด "Certificates" อยู่ **นอก `<form id="vendor-form">`** (ยิง API ของตัวเอง) มีคำอธิบาย "Compliance documents and their validity dates." และเลขจำนวนใบข้างหัวข้อ; ตารางมีคอลัมน์ #, Certificate No., Certificate, Issued Date, Expiry Date, Status; **ในโหมด view ไม่มีปุ่ม "Add Certificate" และไม่มีคอลัมน์ปุ่มแก้/ลบท้ายแถว** (`readOnly = isDisabled`); กด Edit แล้วปุ่ม "Add Certificate" และปุ่มไอคอน Edit / Delete ท้ายแต่ละแถวปรากฏขึ้น; เมื่อผู้ขายยังไม่มีใบรับรองเลย ตารางแสดงกล่องว่าง "No certificates yet" พร้อมคำอธิบาย "No certificates recorded for this vendor yet."

---
## TC-VEN-040016 — เพิ่มใบรับรองให้ผู้ขาย
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้; **BU มี master certificate ที่ `is_active` อย่างน้อย 1 รายการ** ที่ `/vendor-management/certification` (ดูหมายเหตุข้อ 13)
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กดปุ่ม "Add Certificate"
3. เลือกใบรับรองจาก dropdown แล้วสังเกตช่อง Certificate No.
4. เลือก Issued Date และ Expiry Date (ให้ Expiry อยู่หลัง Issued)
5. กด Create แล้วรอ toast
6. ลบใบรับรองและผู้ขายที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กล่องมีหัวข้อ "Add Certificate" และช่องสี่ช่องที่ติดเครื่องหมายบังคับกรอกครบ (Certificate, Certificate No., Issued Date, Expiry Date) พร้อมสวิตช์สถานะที่เปิดอยู่; dropdown แสดงเฉพาะ master certificate ที่ `is_active` ในรูป "`<code> · <name>`"; เลือกแล้ว **ช่อง Certificate No. ถูกเติมด้วย code ของ master ให้อัตโนมัติและตัวช่องถูก `disabled` พิมพ์เองไม่ได้**; กด Create แล้วแสดง toast **"Certificate created successfully"**, กล่องปิดเอง และแถวใหม่โผล่ในตารางพร้อมวันที่ตามรูปแบบของ BU และป้ายสถานะ Active; เลขข้างหัวข้อหมวดเพิ่มขึ้น 1

---
## TC-VEN-040017 — แก้ไขใบรับรองที่มีอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และมีใบรับรองอยู่แล้ว 1 ใบที่รู้ค่าเดิม
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กดปุ่มไอคอน Edit (aria-label "Edit") ท้ายแถวใบรับรอง
3. อ่านหัวข้อกล่องและค่าที่ถูกเติมไว้
4. เปลี่ยน Expiry Date เป็นวันที่ใหม่แล้วกด Save
5. ลบใบรับรองและผู้ขายที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กล่องมีหัวข้อ "Edit Certificate" และทุกช่องถูกเติมด้วยค่าเดิมของแถวนั้น (certificate ที่เลือก, certificate no., วันที่ทั้งสอง, สถานะ); ปุ่มยืนยันเป็นคำว่า "Save" ไม่ใช่ "Create"; กดแล้วแสดง toast **"Certificate updated successfully"**, กล่องปิดเอง และคอลัมน์ Expiry Date ในตารางแสดงวันที่ใหม่ (คำขอแนบ `doc_version` ของแถวไปด้วยสำหรับ optimistic concurrency)

---
## TC-VEN-040018 — ลบใบรับรองของผู้ขาย
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้และมีใบรับรองอยู่แล้ว 1 ใบที่รู้ certificate no.
**Steps**
1. เปิดผู้ขายรายนั้นจาก list แล้วกด Edit
2. กดปุ่มไอคอน Delete (aria-label "Delete") ท้ายแถวใบรับรอง
3. อ่านหัวข้อและคำอธิบายในกล่องยืนยัน แล้วกด Cancel
4. กดปุ่มลบอีกครั้งแล้วกด Delete เพื่อยืนยัน
5. ลบผู้ขายที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กล่องยืนยันมีหัวข้อ "Delete Certificate" และคำอธิบายที่มีเลขที่ใบรับรองอยู่ในข้อความ (`Delete certificate "<no>"? This action cannot be undone.`); กด Cancel แล้วแถวยังอยู่; ยืนยันแล้วแสดง toast **"Certificate deleted successfully"**, แถวหายจากตารางและเลขข้างหัวข้อหมวดลดลง 1 โดย **โหมดของฟอร์ม vendor ไม่เปลี่ยนและไม่มี toast ของ vendor ขึ้นมา** (หมวดนี้ยิง API ของตัวเอง แยกจากฟอร์ม)

---
## TC-VEN-050004 — ลบผู้ขายจากหน้ารายละเอียดแล้วเด้งกลับหน้า list
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดผู้ขายรายนั้นจาก list (อยู่ในโหมด view — **ไม่กด Edit**)
2. คลิกปุ่ม Delete ในแถบปุ่ม
3. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
4. กด Delete เพื่อยืนยัน
5. สังเกต URL หลัง toast ขึ้น แล้วค้นหาชื่อนั้นในหน้า list
**Expected**
ปุ่ม Delete ใช้งานได้ตั้งแต่โหมด view ไม่ต้องกด Edit ก่อน (เงื่อนไขคือมี `vendor` ไม่ใช่โหมด); dialog ยืนยันมีหัวข้อ "Delete Vendor" และคำอธิบายที่มีชื่อผู้ขายอยู่ในข้อความ (`Are you sure you want to delete vendor "<ชื่อ>"? This action cannot be undone.`) พร้อมปุ่ม Cancel และปุ่ม Delete สีเตือน; ยืนยันแล้วแสดง toast **"Vendor deleted successfully"** และ **หน้าเด้งกลับไปที่ `/vendor-management/vendor`** เอง (`f.backToList()`) ไม่ค้างอยู่ที่ URL ของ record ที่ถูกลบไปแล้ว; ค้นหาชื่อนั้นในหน้า list แล้วไม่พบ

---
## TC-VEN-050005 — ลบผู้ขายจากปุ่มลบบนการ์ดในมุมมองกริด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของผู้ขายรายนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว **ไม่ navigate ไปหน้ารายละเอียด** (`ListCard` ตัดคลิกที่ตกมาจากปุ่มด้วย `target.closest("button")`) แต่เปิด dialog ยืนยันลบใบเดียวกับ `TC-VEN-050004`; ยืนยันแล้วแสดง toast "Vendor deleted successfully" และการ์ดใบนั้นหายจากกริดโดย URL ไม่เปลี่ยน

---
## TC-VEN-100001 — ไม่มีสิทธิ์ดู — เมนู sidebar จาง และ deep link ถูก RouteGuard บล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** สิทธิ์ `vendor_management.vendor.view` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Vendor Management ใน sidebar แล้วสังเกตรายการ "Vendor"
2. คลิกรายการนั้น
3. `page.goto("/vendor-management/vendor")` ตรง ๆ
4. `page.goto("/vendor-management/vendor/new")` ตรง ๆ
5. `page.goto("/vendor-management/vendor/<uuid ที่มีอยู่จริง>")` ตรง ๆ
**Expected**
รายการ "Vendor" ยังอยู่ในเมนูแต่ถูกทำให้จางและไม่ใช่ลิงก์ — ไม่มี `<a href="/vendor-management/vendor">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจ** เพราะ vendor ไม่มี `licenseFeature` (แม่กุญแจสงวนไว้ให้กรณี license — ดูหมายเหตุข้อ 8); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; deep link ทั้งสามเส้นทางถูก `RouteGuard` บล็อกเหมือนกัน (prefix match — ดูหมายเหตุข้อ 9) โดยแสดงการ์ด `role="alert"` ที่มีคำว่า "Restricted", หัวข้อ "Permission Denied", ข้อความ "You don't have permission to view this page.", บรรทัด "Contact your administrator to request access." และปุ่ม "Go to an available page" — **ไม่ใช่** การ redirect เงียบ ๆ

---
## TC-VEN-100002 — ไม่มีสิทธิ์ลบ — เมนูลบในแถวและปุ่มลบบนการ์ดเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `vendor_management.vendor.view` แต่ไม่มี `vendor_management.vendor.delete` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังไม่หมดอายุสัญญา (ไม่งั้นเมนูจะถูก disable ด้วยเหตุผลคนละเรื่อง — `writeDisabled` มาก่อน `deleteDenied` เสมอ); มีผู้ขายอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/vendor-management/vendor` แล้วเปิดเมนู Row actions ของแถวแรก สังเกตรายการ Delete แล้วคลิก
2. ปิด dialog แล้วสลับเป็นมุมมองการ์ด คลิกปุ่ม Delete บนการ์ด
3. นับจำนวนรายการรวมใน badge หัวหน้าอีกครั้ง
**Expected**
ทั้งสองทางให้ผลเหมือนกัน: รายการ/ปุ่ม Delete ยังแสดงอยู่แต่จางและมี `aria-disabled="true"`, คลิกแล้ว **ไม่เปิด dialog ยืนยันลบ** แต่เด้ง dialog "Permission Denied" พร้อมข้อความ "You don't have permission to perform this action." แทน (ตารางและการ์ดอ่านสิทธิ์จากก้อนเดียวกัน — `useDeleteGate()` ที่ derive prefix `vendor_management.vendor` จาก pathname ผ่าน `usePermissionPrefix`); ไม่มีรายการใดถูกลบและจำนวนรายการรวมไม่เปลี่ยน; เมนู Activity ในแถวเดียวกันยังใช้งานได้ตามปกติ
_(หมายเหตุข้อ 7: ปุ่ม Delete บน **หน้ารายละเอียด** ไม่ได้ถูกกั้นด้วยสิทธิ์เลย — เคสนี้จึงไม่รวมทางนั้นไว้ อย่าเพิ่มเข้าไปจนกว่าแอปจะแก้)_

---
## TC-VEN-100003 — รายชื่อผู้ขายแยกตาม business unit
**Priority:** High · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่เป็นสมาชิกอย่างน้อย 2 business unit และมีสิทธิ์ดู vendor ทั้งสอง BU; แต่ละ BU มีผู้ขายที่ code ไม่ซ้ำกันข้าม BU อย่างน้อย BU ละ 1 รายการ
**Steps**
1. ตั้ง active BU เป็น BLAVG แล้วไปที่ `/vendor-management/vendor` จดรายการที่เห็น
2. สลับ BU ด้วย BU switcher บน navbar เป็น BU อีกแห่ง
3. อ่านรายการผู้ขายในหน้าเดียวกันอีกครั้ง
4. ค้นหา code ของผู้ขายจาก BU แรกในรายการของ BU ที่สอง
**Expected**
สลับ BU แล้วตารางยิงคำขอใหม่และรายการเปลี่ยนตาม BU ที่เลือก (query key ของ `useVendor` มี `buCode` อยู่ด้วย ไม่ใช่ cache ค้างข้าม BU); ผู้ขายของ BU แรก **ไม่ปรากฏ** ในรายการของ BU ที่สอง และค้นหาด้วย code ของอีก BU แล้วได้ empty state "No data found"; badge จำนวนรายการบนหัวหน้าเปลี่ยนตาม BU ด้วย

---
## TC-VEN-200007 — ข้อความ error ของ Code/Name และการเลื่อนไปช่องแรกที่ผิด
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`
**Steps**
1. เลื่อนหน้าลงไปจนเห็นหมวด "Additional Info" (ให้ช่อง Name หลุดออกนอกจอ)
2. กด Create โดยไม่กรอกอะไรเลย
3. ตรวจ `aria-invalid` ของ `#vendor-name` และ `#vendor-code` และตำแหน่งที่หน้าเลื่อนไป
4. ชี้เมาส์ (hover) ที่ช่อง Name แล้วอ่านข้อความใน tooltip
5. กรอกเฉพาะ Name แล้วกด Create ซ้ำ
**Expected**
ฟอร์มไม่ถูก submit และหน้าเลื่อนกลับไปหาช่องที่ผิดช่องแรกพร้อม focus ให้ (`scrollToFirstInvalidField()` มองหา `[aria-invalid="true"]`); ช่อง `#vendor-name` และ `#vendor-code` มี **`aria-invalid="true"`** และมีไอคอนเตือนอยู่ในช่อง (ดูหมายเหตุข้อ 4 — คอมเมนต์ในสเปกเดิมที่ว่าไม่มี `aria-invalid` นั้นล้าสมัยแล้ว); hover แล้ว tooltip แสดงข้อความ **"Name is required"** (และช่อง Code แสดง **"Code is required"**) ซึ่งประกอบจาก `validation.required` + label ของ field; ช่อง Description **ไม่** มีสถานะ invalid (schema เป็น `z.string().max(256)` ไม่บังคับกรอก) และ Business Type ก็ไม่บังคับเช่นกัน; หลังกรอก Name แล้วกดซ้ำ `#vendor-name` หลุดจากสถานะ invalid แต่ `#vendor-code` ยังคงเป็น `aria-invalid="true"`

---
## TC-VEN-200008 — แถวที่อยู่ที่ไม่ได้เลือก Address Type บล็อกการบันทึก
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`
**Steps**
1. กรอก Name และ Code ให้ครบ
2. กด "Add address" แล้วกรอกเฉพาะ Address line 1 **โดยไม่เลือก Address Type**
3. กด Create
4. เลือก Address Type แล้วกด Create อีกครั้ง
5. ลบรายการที่สร้างสำเร็จเพื่อคืนสภาพ
**Expected**
ครั้งแรกฟอร์มไม่ถูก submit — ยังอยู่ที่ `/vendor-management/vendor/new` และ **ไม่มี toast "Vendor created successfully"**; ตัวเลือก Address Type ของแถวนั้นถูกทำเครื่องหมายผิดด้วยกรอบสีเตือน (`border-destructive`) และหน้าเลื่อนไปหาแถวนั้น; หลังเลือก Address Type แล้วกดซ้ำ ฟอร์มบันทึกสำเร็จและเด้งไปหน้ารายละเอียด
_(oracle ของเคสนี้ต้องเป็น "ไม่มี toast สำเร็จ + ยังอยู่ที่ `/new`" คู่กัน — `address_type` เป็น field เดียวในแถวที่อยู่ที่ `z.string().min(1)` ส่วนที่เหลือเป็น `z.string().max(...)` ว่างได้หมด)_

---
## TC-VEN-200009 — แถวผู้ติดต่อที่ไม่กรอกชื่อ บล็อกการบันทึกพร้อมข้อความใต้ช่อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new`
**Steps**
1. กรอก Name และ Code ให้ครบ
2. กด "Add Contact" แล้วกรอกเฉพาะเบอร์โทร **โดยเว้นชื่อไว้**
3. กด Create
4. อ่านข้อความใต้ช่องชื่อของการ์ดผู้ติดต่อ
5. กรอกชื่อแล้วกด Create อีกครั้ง แล้วลบรายการที่สร้างสำเร็จเพื่อคืนสภาพ
**Expected**
ฟอร์มไม่ถูก submit — ยังอยู่ที่ `/new` และไม่มี toast สำเร็จ; ช่องชื่อของการ์ดนั้นมีกรอบสีเตือน และ **ใต้ช่องมีข้อความ "Name is required" ใน element ที่มี `role="alert"` และ `data-slot="field-error"`** (การ์ดผู้ติดต่อใช้ `FieldError` แบบข้อความใต้ช่อง ต่างจาก `FieldInput` ของหมวด General ที่ใช้ tooltip — ดู `TC-VEN-200007`); หลังกรอกชื่อแล้วกดซ้ำบันทึกสำเร็จ

---
## TC-VEN-200010 — ขีดจำกัดความยาวของช่องในหมวดที่อยู่ ผู้ติดต่อ และข้อมูลเพิ่มเติม
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/vendor-management/vendor/new` และเพิ่มไว้หมวดละ 1 แถว โดยแถวที่อยู่ตั้งเป็นโหมด International
**Steps**
1. พิมพ์ข้อความยาวเกินขีดจำกัดลงในช่อง Description ของหมวด General
2. พิมพ์ข้อความยาวเกินลงในช่อง Address line 1, City และ Postal code ของแถวที่อยู่
3. พิมพ์ข้อความยาวเกินลงในช่องชื่อ อีเมล และเบอร์โทรของการ์ดผู้ติดต่อ
4. พิมพ์ข้อความยาวเกินลงในช่อง label และ value ของแถวข้อมูลเพิ่มเติม
5. อ่านค่าที่ค้างอยู่ในแต่ละช่อง
**Expected**
ค่าถูกตัดตั้งแต่ตอนพิมพ์ตาม `maxLength` ของแต่ละช่อง โดย **ไม่มีข้อความ validation ใด ๆ ขึ้น**: Description 256, Address line 1 / line 2 256, City / District / Sub-district / Province / Country 100, Postal code 20 ในโหมด International (และ **5 ในโหมด Thailand** — ช่องคนละตัวกัน), ชื่อผู้ติดต่อ 100, อีเมล 100, เบอร์โทร 20, label ของข้อมูลเพิ่มเติม 100 และ value 256; ขีดจำกัดชุดนี้ตรงกับ `createVendorSchema` ทุกตัว ยกเว้นรหัสไปรษณีย์โหมดไทยที่ input เข้มกว่า schema

---
## TC-VEN-200011 — การตรวจค่าในกล่องเพิ่มใบรับรอง
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีผู้ขายที่สร้างไว้สำหรับเทสนี้; BU มี master certificate ที่ `is_active` อย่างน้อย 1 รายการ (ดูหมายเหตุข้อ 13)
**Steps**
1. เปิดผู้ขายรายนั้น กด Edit แล้วกด "Add Certificate"
2. กดปุ่ม Create ทันทีโดยไม่กรอกอะไร
3. เลือกใบรับรองและเลือก Issued Date แล้วกด Create อีกครั้ง
4. เลือก Expiry Date เป็นวันที่ **ก่อน** Issued Date แล้วกด Create
5. ปิดกล่องแล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ครั้งแรกกล่อง **ไม่ปิดและไม่มี toast** โดยช่อง Certificate, Issued Date และ Expiry Date แสดงสถานะ invalid พร้อมข้อความ "Certificate is required" / "Issued Date is required" / "Expiry Date is required" (ช่อง Certificate No. ถูกเติมอัตโนมัติจากใบรับรองที่เลือกจึงไม่เคยเป็นช่องที่ผู้ใช้ต้องกรอกเอง); หลังเลือกใบรับรองแล้วข้อความของ Certificate และ Certificate No. หายไป; เมื่อ Expiry Date อยู่ก่อน Issued Date ช่อง Expiry Date แสดงข้อความ **"End date must not be before start date"** และกล่องยังไม่ปิด; ตลอดทั้งเคสไม่มีแถวใดถูกเพิ่มในตารางใบรับรอง
