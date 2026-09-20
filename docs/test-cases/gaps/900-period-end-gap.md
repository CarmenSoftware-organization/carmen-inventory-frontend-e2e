# Period End — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่สเปกครอบแล้วอยู่ใน `tests/900-period-end.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/900-period-end.md`_

**Module:** Period End
**Frontend route:** `routes/inventory-management/period-end`  •  **URL:** `/inventory-management/period-end` · `/inventory-management/period-end/review`
**Prefix:** `PE` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/900-period-end.spec.ts`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 43
**สอบทานกับ source ล่าสุด:** 2026-09-20

> ## ⚠️ โมดูลนี้ย้อนกลับไม่ได้ — อ่านก่อนแปลงเป็นสเปก
>
> มี **สองปุ่มที่เปลี่ยนสถานะจริงและย้อนกลับไม่ได้** อยู่ในโมดูลนี้ ทั้งคู่ผ่าน dialog ยืนยัน
> ที่เขียนคำว่า "cannot be undone" ไว้ตรง ๆ ใน `messages/en.json`
>
> 1. **"Start Period Close"** (`pe-component.tsx:167-176`) → `POST /period-ends/start-counting`
>    (`use-period-end.ts:129-140`) — **เลื่อนรอบตรวจนับของงวดจาก `draft` เป็น `counting`**
>    คำเตือนในกล่องยืนยันคือ *"This cannot be undone — the round stays open until the period is
>    closed."* ปุ่มนี้คือสิ่งที่ **โมดูล Physical Count ทั้งโมดูลรออยู่**: `pc-component.tsx:233-238`
>    ปฏิเสธการสร้างใบนับทุกใบด้วย dialog *"Counting has not started"* จนกว่า
>    `period.status === "counting"` — ตรงกับที่ `docs/test-cases/750-physical-count.md:24`
>    บันทึกไว้ และ **ยืนยันจาก source แล้วในการสอบทานรอบนี้**
>    ถ้ายังมีเอกสารที่กระทบสต๊อกค้างอยู่ backend ตอบ **422** พร้อม `error.details`
>    (`{ counts, total, documents }`) ซึ่งหน้าเอาไปเรนเดอร์เป็น `PeStartBlockedDialog`
>    แทน toast — เคส 422 **ไม่** เปลี่ยนสถานะ จึงรันซ้ำได้ปลอดภัย
> 2. **"Close Period"** (`pe-review.tsx:150-159`) → `POST /period-ends` (`useClosePeriodEnd`)
>    — ปิดงวด ล็อกเอกสารและใบนับทั้งงวด คำเตือนคือ *"This action cannot be undone. All
>    transactions and physical counts in this period will be locked."*
>
> **เคสในไฟล์นี้ที่เปลี่ยนสถานะจริงและย้อนไม่ได้มีสามตัว: `TC-PE-030106`, `TC-PE-040104`
> และ `TC-PE-310103`** (ตัวหลังไม่ได้กดเอง แต่ต้องการ precondition ที่มาจากการกด
> `TC-PE-030106`) ทั้งสามตัวติดป้าย **[IRREVERSIBLE]** ไว้ในตาราง at-a-glance และในบล็อกของ
> ตัวเอง — ต้องแยกไป BU/งวดที่ทิ้งได้ หรือรันเป็นรอบสุดท้ายของชุด ห้ามใส่รวมกับ smoke ที่รันทุกวัน
>
> ## ความสัมพันธ์กับ spot-check
>
> **ไม่มี** — ตรวจแล้วว่าโค้ดใน `routes/inventory-management/spot-check/` ไม่อ้าง
> `counting` / `physical_count_period` เลยสักจุด และ `docs/test-cases/760-spot-check.md`
> ก็ไม่ได้พูดถึงปุ่ม "Start Period Close" ต่างจาก physical-count ที่พึ่งพาโดยตรง
> spot check จึงเป็นการนับนอกรอบที่ไม่ถูก gate ด้วยการเปิดรอบปิดงวด
>
> ## สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)
>
> `tests/900-period-end.spec.ts` มี **35 เคส** (ไม่ใช่ 43 ตามที่โจทย์ตั้งไว้ — นับจากชื่อเทสจริง
> ในไฟล์) แบ่งเป็น
>
> - **รันจริง 4 เคส** — `TC-PE-010001`, `TC-PE-010003`, `TC-PE-010004` (ทั้งสามแค่
>   `goto` หน้ารายการแล้ว `expect(page).toHaveURL(/period-end/)`) และ `TC-PE-010002`
>   (สิทธิ์ที่หน้ารายการ — รับได้ทั้งเข้าได้และถูกเด้ง)
> - **`test.fixme` 1 เคส** — `TC-PE-010005` (คอมเมนต์ในสเปกระบุเองว่าเทสไม่เคยตั้ง
>   precondition ของตัวเอง)
> - **`test.skip` 30 เคส** — body ว่าง (`async () => {}`) ทั้งหมด
>
> **รวม skip + fixme = 31 จาก 35** ที่เหลือคือการเปิดหน้าเปล่า ๆ แปลว่าพฤติกรรมของ UI จริง
> **แทบไม่ถูกครอบเลย** โดยเฉพาะ:
>
> - **หน้า `/period-end/review` ไม่เคยถูกเปิดโดยสเปกแม้แต่ครั้งเดียว** — ทั้ง `PeriodEndPage`
>   (`tests/pages/period-end.page.ts`) ก็มีแค่ `gotoList()` และ `gotoDetail(id)` ที่ชี้ไป
>   `/period-end/<id>` ซึ่ง**ไม่มี route อยู่จริง**
> - เคสบล็อก `02`/`03`/`04` ที่ถูก skip ทั้งหมดเขียนไว้กับ URL ที่ **ไม่มีใน `routes/router.tsx`**
>   (`/period-end/:id`, `/procurement/close-workflow`, `/period-close`, …) — ตรวจแล้วว่า
>   router มีแค่ `period-end` (บรรทัด 352) และ `period-end/review` (บรรทัด 357) เท่านั้น
>   note ของ skip เหล่านั้น (`SKIP_NOTE_NOT_IMPLEMENTED`) จึง**ล้าสมัย**: การปิดงวดมีจริงแล้ว
>   แต่ไปอยู่ที่ `/period-end/review` ไม่ใช่ sub-route ที่ note เดา — ไฟล์นี้จึง**ไม่ถือว่าเขียนซ้ำ**
> - เคสบล็อก `31`–`34` ที่ถูก skip อ้าง `SKIP_NOTE_BACKEND` (validation engine ฝั่ง
>   backend) ไฟล์นี้เขียนเฉพาะสิ่งที่ **UI แสดงและกดได้จริง** ไม่แตะ validation engine
>
> ## ช่วงเลขที่เลือก
>
> `docs/test-id-scheme.md:57` ลงทะเบียน section ให้ `PE` ไว้ที่ **`01–04, 31–34, 90`**
> ทุกเคสในไฟล์นี้อยู่ในชุดนั้นทั้งหมด — **ไม่ต้องลงทะเบียน section เพิ่ม**
> เลขที่สเปกใช้ไปแล้วคือ `0100xx`, `0200xx`, `0300xx`, `0400xx`, `3100xx`, `3200xx`,
> `3300xx`, `3400xx` (ทุกตัวอยู่ sub-block `00xx`) ไฟล์นี้จึงเลื่อนไป sub-block ถัดไป:
>
> | Sub-block | ขอบเขต |
> | --- | --- |
> | `TC-PE-0101xx` | หน้า Current Period (`/period-end`) + สิทธิ์เข้าหน้า review |
> | `TC-PE-0201xx` | หน้า Period Close Review (`/period-end/review`) |
> | `TC-PE-0301xx` | การกด "Start Period Close" (เปิดรอบตรวจนับ) |
> | `TC-PE-0401xx` | การกด "Close Period" (ปิดงวด) |
> | `TC-PE-3101xx` | integration กับโมดูล Physical Count |
> | `TC-PE-3201xx` | ลิงก์ออกไปเอกสารต้นทางของแต่ละโมดูล |
> | `TC-PE-9002xx` | edge case |
>
> section `90` มี ID ในไฟล์สเปกอยู่แล้วที่ `TC-PE-9000xx` / `TC-PE-9001xx` แต่เป็น
> **คอมเมนต์หัวกลุ่มเท่านั้น ไม่ใช่ชื่อเทส** — ถึงอย่างนั้นก็เลี่ยงไปใช้ `9002xx` เพื่อไม่ให้คนอ่านสับสน
>
> ## ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้
>
> 1. **ไม่มี route `/period-end/:id`** — มีแค่ `/period-end` กับ `/period-end/review`
>    (`routes/router.tsx:352-360`) `PeriodEndPage.gotoDetail()` ในสเปกจึงพาไปหน้า 404/landing
> 2. **`PeHistory` ไม่เคยเรนเดอร์แถวข้อมูล** — `pe-history.tsx:32-43` มีแค่สาม branch คือ
>    skeleton, empty state, และ `null` — เมื่อ `items.length > 0` component คืน `null`
>    ใต้หัวข้อ ไม่มีตาราง ไม่มีการ์ด ฉะนั้น **ห้าม assert ว่ามีตาราง period history**
>    เคส `TC-PE-010104` จึง assert แค่หัวข้อ/คำอธิบาย และ empty state ตามที่ออกแบบไว้จริง
> 3. **ปุ่มบนการ์ดงวดมีสองหน้าที่** — `isCounting` (`countingRound?.status === "counting"`
>    จาก `usePhysicalCountPeriodCurrent`) เป็นตัวตัดสิน: ถ้ารอบเปิดแล้วปุ่มอ่านว่า
>    **"Continue Counting"** และ **`navigate()` ไปหน้า review ตรง ๆ ไม่มี dialog ไม่มี POST**
>    ถ้ายังไม่เปิดจึงอ่านว่า **"Start Period Close"** และเปิด `ConfirmDialog`
>    (`pe-component.tsx:169-176`) — เคสที่กดปุ่มต้องเช็กชื่อปุ่มก่อนเสมอ ไม่งั้นจะเผลอกด
>    ตัวที่ย้อนไม่ได้
> 4. **ปุ่มถูก disable เฉพาะ `status === "closed"`** — `pe-component.tsx:172` เท่านั้น
>    ทั้งที่ `PeriodEndStatus` มีค่า `"locked"` ด้วย (`types/period-end.ts:21`) และ
>    `messages/en.json` มีแค่ `status.open` / `status.closed` — งวดสถานะ `locked` จึงทั้ง
>    เรนเดอร์ป้ายสถานะไม่ได้และปุ่มยังกดได้ **อย่าเขียนเคสยืนยันเรื่องนี้** (ไม่มีทางรู้ว่า
>    ตั้งใจหรือไม่) บันทึกไว้เป็นคำถามถึงทีมแอป
> 5. **กติกาการปิดงวดมาจาก backend ล้วน ๆ** — `pe-review.tsx:93` ใช้ `data?.can_close ?? false`
>    ตรง ๆ มีคอมเมนต์กำกับว่าเคยคำนวณเองแล้วพัง (งวดที่ไม่มีใบลดหนี้จะปิดไม่ได้ตลอดกาล
>    เพราะ backend คืน `is_complete = false` เมื่อโมดูลนั้นไม่มีเอกสารเลย) ฉะนั้น
>    **ห้ามคำนวณเงื่อนไข enable ของปุ่ม Close Period เองในเทส** ให้ดูจาก `can_close` ที่
>    response ส่งมา หรืออ่านสถานะปุ่มตรง ๆ
> 6. **`is_complete` จาก backend เป็นได้ทั้ง boolean และสตริง `"true"`/`"false"`** —
>    `use-period-end.ts:52-88` normalize ให้แล้วก่อนถึง UI
> 7. **การ์ดโมดูลธุรกรรมเป็น `role="button"` + `tabIndex=0` ไม่ใช่ `<button>`**
>    (`pe-review.tsx:237-251`) มี `aria-label` = `"Open {module} documents"` และรองรับ
>    ทั้ง Enter และ Space — ใช้ `getByRole("button", { name: /open .* documents/i })`
> 8. **การ์ดโมดูลมี 7 ใบเสมอ ไม่ว่าจะมีเอกสารหรือไม่** — `TRANSACTION_KEYS` เป็น
>    `Object.keys(MODULE_CONFIG)` คงที่ (`pe-review.tsx:49-59`) ตัวหารของ
>    `txDone/7` จึงคงที่ · ข้อความ `noTransactions` ใน `en.json` **ไม่มีที่ใดเรียกใช้**
> 9. **ลิงก์เอกสารมีกติกาเฉพาะของ si/so** — `pe-document-paths.ts:28-36` map ทั้ง `si`
>    และ `so` ไปหน้า Inventory Adjustment หน้าเดียวกัน และ **บังคับ** ต่อ
>    `?type=stock-in` / `?type=stock-out` เพราะ `ia-edit-content.tsx` เรนเดอร์
>    `ErrorState` ทันทีถ้าไม่มี query นี้ — เคส `TC-PE-320102` มีไว้เพื่อกันเรื่องนี้โดยเฉพาะ
> 10. **dialog ยืนยันทั้งสองตัวเป็น Radix `AlertDialog`** (`components/ui/confirm-dialog.tsx`)
>     → `role="alertdialog"` ซึ่ง **`getByRole("dialog")` ไม่แมตช์** ส่วน
>     `PeStartBlockedDialog` และ `PeDocumentsDialog` เป็น `Dialog` ธรรมดา (`role="dialog"`)
>     `PeriodEndPage.confirmDialogButton()` จับทั้งสอง role อยู่แล้ว ใช้ตัวนั้น
> 11. **`ConfirmDialog` ปิดไม่ได้ระหว่าง mutation** — `onOpenChange` ถูกส่งเป็น `undefined`
>     เมื่อ `isPending` (`confirm-dialog.tsx:66`) และปุ่ม Cancel/Confirm ถูก disable
> 12. **หน้า review ไม่มี error state** — `pe-review.tsx:173` เรนเดอร์เนื้อหาเฉพาะเมื่อ
>     `!isLoading && data` ถ้า query ล้มเหลวจะเหลือแค่ header กับปุ่มสองตัว ไม่มีกล่อง error
>     ไม่มีปุ่ม retry (มีแค่ Refresh ที่อยู่ header อยู่แล้ว) **อย่าเขียนเคสรอ error state**
> 13. **`PcLocationCard` เรียก `t("nItems", { count })`** แต่ key `nItems` **ไม่มีใน
>     namespace `inventoryManagement.physicalCount`** ของ `messages/en.json` (มีในอีก 6 namespace)
>     บรรทัดจำนวนรายการท้ายการ์ดจึงอาจเรนเดอร์เป็น key ดิบ — `TC-PE-020112` จึง **ไม่** assert
>     ข้อความบรรทัดนั้น บันทึกไว้เป็นบั๊กข้อความที่ควรแจ้งทีมแอป
> 14. **ไม่มี license gate** — `constant/module-list.ts:315-320` ให้ `periodEnd` มีแต่
>     `permission: inventory_management.period_end.view` ไม่มี `licenseFeature` ฉะนั้น
>     `RouteGuard` ตัดสินด้วย permission อย่างเดียว และ **admin bypass ได้** (`route-guard.tsx:71`)
>     เคสสิทธิ์ต้องใช้ผู้ใช้ที่ไม่ใช่ admin · `findRouteLeaf` แมตช์ prefix
>     (`module-list.ts:114-126`) ฉะนั้น `/period-end/review` ถูก guard ด้วย permission เดียวกัน
> 15. **`useOpenPhysicalCount` สร้างใบนับใหม่เมื่อคลังนั้นยังไม่มีใบ** —
>     `use-open-physical-count.ts:43-71` ถ้า `item.physical_count_id` ว่าง จะ `POST`
>     สร้างใบแล้วพาไปหน้านับ ฉะนั้น **การกดปุ่ม "Start" บนการ์ดคลังในหน้า review คือ
>     การสร้างข้อมูล** ไฟล์นี้จึงไม่มีเคสที่กดปุ่มนั้น มีแต่เคสที่ assert ว่ามันถูก disable
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PE-010101 | หน้า Current Period โหลดและแสดงหัวเรื่องกับคำอธิบาย | High | Smoke |
| TC-PE-010102 | การ์ดงวดปัจจุบันแสดงงวด ปีบัญชี เดือนบัญชี และช่วงวันที่ครบ | High | Functional |
| TC-PE-010103 | ไม่มีงวดปัจจุบัน แสดงกล่องเส้นประแทนการ์ด | Medium | Edge Case |
| TC-PE-010104 | ส่วน History แสดงหัวข้อและ empty state เมื่อยังไม่มีงวดที่ปิด | Medium | Functional |
| TC-PE-010105 | รอบตรวจนับยังไม่เปิด ปุ่มอ่านว่า "Start Period Close" | High | Functional |
| TC-PE-010106 | รอบตรวจนับเปิดแล้ว ปุ่มอ่านว่า "Continue Counting" และพาไปหน้า review ทันที | High | Alternate Flow |
| TC-PE-010107 | งวดที่ปิดแล้วปุ่มบนการ์ดถูก disable | High | Validation |
| TC-PE-010108 | ช่อง Note แสดงเต็มความกว้างเมื่องวดมีหมายเหตุ | Low | Functional |
| TC-PE-010109 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด `/period-end/review` ตรง ๆ ถูกบล็อกทั้งหน้า | Medium | Authorization |
| TC-PE-020101 | เปิดหน้า Period Close Review แสดงหัวเรื่องและปุ่มสองตัวบนแถบหัว | High | Smoke |
| TC-PE-020102 | การ์ดสรุปแสดงช่วงวันที่ สถานะ และตัวเลขสรุปสองช่อง | High | Functional |
| TC-PE-020103 | การ์ดธุรกรรมมีครบ 7 โมดูลตามลำดับ พร้อม badge Complete/Incomplete | High | Functional |
| TC-PE-020104 | คลิกการ์ดโมดูลเปิด dialog รายการเอกสารของโมดูลนั้น | High | Functional |
| TC-PE-020105 | เปิด dialog เอกสารด้วยแป้น Enter หรือ Space ได้ | Low | Functional |
| TC-PE-020106 | dialog เอกสารแสดงตาราง 4 คอลัมน์และบรรทัดสรุป complete/incomplete/total | Medium | Functional |
| TC-PE-020107 | โมดูลที่ไม่มีเอกสารเปิด dialog แล้วเห็น empty state | Medium | Edge Case |
| TC-PE-020108 | ปุ่ม Refresh ดึงข้อมูลใหม่และถูก disable ระหว่างโหลด | Medium | Functional |
| TC-PE-020109 | ปุ่มย้อนกลับพากลับหน้า Current Period | Low | Functional |
| TC-PE-020110 | ส่วน Physical Count แสดงแถบความคืบหน้าและ badge จำนวนคลังที่นับเสร็จ | High | Functional |
| TC-PE-020111 | งวดที่ไม่มีคลังให้นับ แสดง empty state ของ Physical Count | Medium | Edge Case |
| TC-PE-020112 | การ์ดคลังแสดงชื่อ รหัส ประเภท และแถบความคืบหน้า | Medium | Functional |
| TC-PE-020113 | รอบยังไม่เปิด ปุ่มบนการ์ดคลังถูก disable พร้อมเหตุผลใน tooltip | High | Validation |
| TC-PE-020114 | คลิกชื่อคลังบนการ์ดไปหน้าตั้งค่า Location | Low | Functional |
| TC-PE-030101 | กด "Start Period Close" เปิด dialog ยืนยันพร้อมคำเตือนว่าย้อนไม่ได้ | High | Functional |
| TC-PE-030102 | กด Cancel ใน dialog ยืนยัน ไม่มีการเปิดรอบและไม่เปลี่ยนหน้า | High | Alternate Flow |
| TC-PE-030103 | มีเอกสารค้างในงวด ขึ้น dialog "Finish these documents first" แทน toast | High | Negative |
| TC-PE-030104 | dialog เอกสารค้างจัดกลุ่มตามประเภทพร้อม badge จำนวนและสถานะรายใบ | Medium | Functional |
| TC-PE-030105 | ปุ่ม Close ใน dialog เอกสารค้างปิดกล่องโดยไม่เปลี่ยนสถานะอะไร | Low | Functional |
| TC-PE-030106 | **[IRREVERSIBLE]** ยืนยันเปิดรอบสำเร็จ ขึ้น toast แล้วพาไปหน้า review | High | Happy Path |
| TC-PE-030107 | ระหว่างส่งคำขอเปิดรอบ ปุ่มใน dialog ถูก disable และปิด dialog ไม่ได้ | Low | Functional |
| TC-PE-040101 | งวดที่ยังปิดไม่ได้ ปุ่ม Close Period ถูก disable พร้อมเหตุผลใน tooltip | High | Validation |
| TC-PE-040102 | กด Close Period เปิด dialog ยืนยันพร้อมคำเตือนว่าล็อกทั้งงวด | High | Functional |
| TC-PE-040103 | กด Cancel ใน dialog ปิดงวด ไม่มีการปิดงวดเกิดขึ้น | High | Alternate Flow |
| TC-PE-040104 | **[IRREVERSIBLE]** ยืนยันปิดงวดสำเร็จ ขึ้น toast แล้วกลับหน้า Current Period | High | Happy Path |
| TC-PE-310101 | รอบยังไม่เปิด หน้า Physical Count กด Start แล้วขึ้น dialog บอกให้ไปเปิดรอบ | High | Functional |
| TC-PE-310102 | ปุ่ม "Go to Period End" ใน dialog นั้นพามาหน้า Period End | Medium | Functional |
| TC-PE-310103 | **[IRREVERSIBLE]** รอบเปิดแล้ว หน้า Physical Count ไม่ขึ้น dialog บล็อกอีก | High | Functional |
| TC-PE-320101 | ลิงก์เอกสารใน dialog ธุรกรรมพาไปหน้าโมดูลต้นทางที่ถูกต้อง | High | Functional |
| TC-PE-320102 | ลิงก์ Stock In / Stock Out ต้องมี `?type=` ต่อท้าย | High | Functional |
| TC-PE-320103 | ลิงก์เอกสารใน dialog เอกสารค้างใช้กติกาเส้นทางชุดเดียวกัน | Medium | Functional |
| TC-PE-900201 | โมดูลที่ไม่มีเอกสารเลยยังมีการ์ดพร้อมเลข 0 ไม่ถูกซ่อน | Medium | Edge Case |
| TC-PE-900202 | เปิด `/period-end/review` ด้วย deep link โดยไม่ผ่านหน้า Current Period | Medium | Edge Case |
| TC-PE-900203 | งวดที่ปิดแล้ว หน้า review แสดงสถานะ Closed และปุ่มปิดงวดกดไม่ได้ | Medium | Edge Case |

---

## TC-PE-010101 — หน้า Current Period โหลดและแสดงหัวเรื่องกับคำอธิบาย
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, active BU = `BLAVG`) ซึ่งมีสิทธิ์ `inventory_management.period_end.view` (admin bypass)
**Steps**
1. เปิด `/inventory-management/period-end`
2. รอให้ skeleton หายไป
**Expected**
หน้าแสดงหัวเรื่อง `Current Period` เป็น `<h1>` พร้อมคำอธิบายใต้หัวเรื่องว่า "Current open period for the business unit." และมีหัวข้อรอง `History` อยู่ด้านล่างของหน้าเสมอ ไม่ว่าจะมีงวดปัจจุบันหรือไม่

---

## TC-PE-010102 — การ์ดงวดปัจจุบันแสดงงวด ปีบัญชี เดือนบัญชี และช่วงวันที่ครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end` และ BU มีงวดปัจจุบัน (`GET /period-ends/current` คืนข้อมูล)
**Steps**
1. ดูการ์ดงวดปัจจุบันที่อยู่ใต้หัวเรื่อง
**Expected**
การ์ดมีป้ายกำกับ `Period` อยู่บนสุด ตามด้วยชื่องวดเป็นตัวอักษรขนาดใหญ่ แล้วบรรทัด `Fiscal Year <ปี> · Fiscal Month <เดือน>` · ในเนื้อการ์ดมีสองช่องคือ `Start Date` และ `End Date` ที่แสดงวันที่ตามรูปแบบของ locale ปัจจุบัน และมุมขวาบนของการ์ดมีป้ายสถานะอ่านว่า `Open` หรือ `Closed`

---

## TC-PE-010103 — ไม่มีงวดปัจจุบัน แสดงกล่องเส้นประแทนการ์ด
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login ด้วยบัญชีที่ active BU **ไม่มี** งวดปัจจุบัน (`GET /period-ends/current` ล้มเหลวหรือคืนค่าว่าง) — สถานะนี้ตรงกับ branch `isError || !data` ที่ `pe-component.tsx:109`
**Steps**
1. เปิด `/inventory-management/period-end`
2. รอให้ skeleton หายไป
**Expected**
แทนที่การ์ดงวด หน้าแสดงกล่องเส้นประที่มีข้อความ "No current period end found." และ**ไม่มีปุ่ม "Start Period Close" หรือ "Continue Counting" อยู่บนหน้าเลย** (ปุ่มอยู่ใน footer ของการ์ดซึ่งไม่ถูกเรนเดอร์)

---

## TC-PE-010104 — ส่วน History แสดงหัวข้อและ empty state เมื่อยังไม่มีงวดที่ปิด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; BU ยังไม่มีงวดที่ปิดแล้ว (`GET /period-ends` คืนรายการว่าง)
**Steps**
1. เลื่อนลงไปที่ส่วนล่างของหน้า
**Expected**
มีหัวข้อรอง `History` พร้อมคำอธิบาย "Past period ends for the business unit." และใต้หัวข้อเป็นการ์ดเส้นประที่มี empty state ข้อความ "No closed periods yet." · **ไม่ต้อง assert ว่ามีตารางหรือรายการงวดย้อนหลัง** — ดูข้อ 2 ใน callout ด้านบน

---

## TC-PE-010105 — รอบตรวจนับยังไม่เปิด ปุ่มอ่านว่า "Start Period Close"
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; มีงวดปัจจุบันสถานะ `Open`; รอบตรวจนับของงวด (`GET /physical-count-periods/current`) **ยังไม่เป็น `counting`**
**Steps**
1. ดูปุ่มที่ footer ของการ์ดงวดปัจจุบัน
**Expected**
ปุ่มอ่านว่า **`Start Period Close`** (ไม่ใช่ `Continue Counting`) กดได้ และยังไม่มี dialog ใดเปิดอยู่ · หน้าไม่เปลี่ยน URL จนกว่าจะกด

---

## TC-PE-010106 — รอบตรวจนับเปิดแล้ว ปุ่มอ่านว่า "Continue Counting" และพาไปหน้า review ทันที
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; รอบตรวจนับของงวดอยู่สถานะ `counting` แล้ว (เปิดไว้ก่อนหน้านี้ — ดู `TC-PE-030106`)
**Steps**
1. ดูข้อความบนปุ่มที่ footer ของการ์ดงวด
2. กดปุ่มนั้น
**Expected**
ปุ่มอ่านว่า **`Continue Counting`** และเมื่อกดจะไปที่ `/inventory-management/period-end/review` **ทันทีโดยไม่มี dialog ยืนยันขึ้นมาเลย** และ**ไม่มี request `start-counting` ถูกยิง** (เส้นทางนี้เป็น `navigate()` ล้วน ๆ จึงรันซ้ำได้ปลอดภัย)

---

## TC-PE-010107 — งวดที่ปิดแล้วปุ่มบนการ์ดถูก disable
**Priority:** High · **Test Type:** Validation
**Preconditions**
Login เข้า BU ที่งวดปัจจุบันมีสถานะ `closed` (เช่นรันหลัง `TC-PE-040104` หรือ seed งวดที่ปิดแล้ว)
**Steps**
1. เปิด `/inventory-management/period-end`
2. ดูป้ายสถานะมุมขวาบนของการ์ดและปุ่มที่ footer
**Expected**
ป้ายสถานะอ่านว่า `Closed` และปุ่มที่ footer ของการ์ด **ถูก disable** กดไม่ได้ (`pe-component.tsx:172` disable เมื่อ `statusKey === "closed"`) — ต้องไม่มี dialog ยืนยันเปิดขึ้นเมื่อพยายามคลิก

---

## TC-PE-010108 — ช่อง Note แสดงเต็มความกว้างเมื่องวดมีหมายเหตุ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; งวดปัจจุบันมีค่า `note` ไม่เป็น null
**Steps**
1. ดูเนื้อการ์ดงวดปัจจุบัน
**Expected**
ใต้ช่อง Start Date / End Date มีช่องที่สามป้ายกำกับ `Note` แสดงข้อความหมายเหตุของงวด และกินความกว้างเต็มแถว (ต่างจากสองช่องบนที่แบ่งครึ่ง) · ถ้างวดไม่มี note ช่องนี้ต้องไม่ปรากฏเลย

---

## TC-PE-010109 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด `/period-end/review` ตรง ๆ ถูกบล็อกทั้งหน้า
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่ใช่ admin** และไม่มีสิทธิ์ `inventory_management.period_end.view` (เช่น `requestor@blueledgers.com` — ต้องยืนยันสิทธิ์ของบัญชีนี้ก่อน) · `RouteGuard` แมตช์ด้วย prefix จึงคุม sub-route นี้ด้วย
**Steps**
1. เปิด URL `/inventory-management/period-end/review` ตรง ๆ
2. รอให้หน้าโหลดเสร็จ
**Expected**
หน้าแสดงบล็อกปฏิเสธสิทธิ์ (AccessDeniedBlock) และ**ไม่มีหัวเรื่อง `Period Close Review` ไม่มีปุ่ม `Close Period` ให้เห็นเลย** · หมายเหตุ: สเปกครอบเฉพาะหน้ารายการ (`TC-PE-010002`) เท่านั้น ยังไม่มีเคสของ sub-route นี้

---

## TC-PE-020101 — เปิดหน้า Period Close Review แสดงหัวเรื่องและปุ่มสองตัวบนแถบหัว
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น Admin (`admin@blueledgers.com`, BU = `BLAVG`); มีงวดปัจจุบัน
**Steps**
1. เปิด `/inventory-management/period-end/review`
2. รอให้ skeleton หายไป
**Expected**
แถบหัวแสดงหัวเรื่อง `Period Close Review` พร้อมคำอธิบาย "Review pending transactions and physical counts before closing." · มุมขวามีสองปุ่มคือ `Refresh` และ `Close Period` (ปุ่มหลังเป็นสไตล์ destructive) · มุมซ้ายของแถวหัวเรื่องมีปุ่มไอคอนย้อนกลับที่มี aria-label `Go back`

---

## TC-PE-020102 — การ์ดสรุปแสดงช่วงวันที่ สถานะ และตัวเลขสรุปสองช่อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` และข้อมูลโหลดสำเร็จ
**Steps**
1. ดูการ์ดใบแรกใต้แถบหัว
**Expected**
การ์ดแสดงช่วงวันที่ของงวดในรูปแบบ `<วันเริ่ม> – <วันสิ้นสุด>` ตาม locale และมีป้ายสถานะ (`Open` / `Closed`) ที่มุมขวาบน · ในเนื้อการ์ดมีสองช่องคือ `Total transactions` ที่แสดงผลรวมจำนวนเอกสารทุกโมดูลพร้อมป้ายย่อยรูปแบบ `<เสร็จ>/7` และ `All locations` ที่แสดงจำนวนคลังพร้อมป้ายย่อย `<n> of <m> completed`

---

## TC-PE-020103 — การ์ดธุรกรรมมีครบ 7 โมดูลตามลำดับ พร้อม badge Complete/Incomplete
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` และข้อมูลโหลดสำเร็จ
**Steps**
1. ดูส่วนหัวข้อ `Transactions`
**Expected**
มีการ์ด 7 ใบเรียงตามลำดับ `Purchase Requests`, `Purchase Orders`, `Goods Receive Notes`, `Credit Notes`, `Store Requisitions`, `Stock In`, `Stock Out` · แต่ละใบแสดงจำนวนเอกสารเป็นตัวเลขใหญ่ และมี badge อ่านว่า `Complete` หรือ `Incomplete` · ใบที่ `Complete` มีไอคอนติ๊กที่มุมขวาบนของการ์ดเพิ่มมาด้วย

---

## TC-PE-020104 — คลิกการ์ดโมดูลเปิด dialog รายการเอกสารของโมดูลนั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; มีอย่างน้อยหนึ่งโมดูลที่จำนวนเอกสารมากกว่า 0
**Steps**
1. คลิกการ์ดของโมดูลนั้น (การ์ดเป็น `role="button"` ที่มี aria-label `Open <ชื่อโมดูล> documents`)
**Expected**
เปิด dialog ที่มีหัวข้อเป็นชื่อโมดูลเดียวกับการ์ดที่คลิก มีป้ายเล็ก `Documents` อยู่เหนือหัวข้อ และมีตารางรายการเอกสารของโมดูลนั้น · จำนวนแถวในตารางเท่ากับตัวเลขที่การ์ดแสดง

---

## TC-PE-020105 — เปิด dialog เอกสารด้วยแป้น Enter หรือ Space ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; ส่วน Transactions แสดงผลแล้ว
**Steps**
1. โฟกัสการ์ดโมดูลใบแรกด้วยคีย์บอร์ด (การ์ดมี `tabIndex=0`)
2. กดแป้น `Enter`
3. ปิด dialog แล้วโฟกัสการ์ดเดิมอีกครั้ง กดแป้น `Space`
**Expected**
dialog รายการเอกสารเปิดขึ้นทั้งในขั้นที่ 2 และขั้นที่ 3 · การกด Space ต้องไม่ทำให้หน้าเลื่อนลง (`pe-review.tsx:245-250` เรียก `preventDefault()`)

---

## TC-PE-020106 — dialog เอกสารแสดงตาราง 4 คอลัมน์และบรรทัดสรุป complete/incomplete/total
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
dialog รายการเอกสารของโมดูลที่มีเอกสารอย่างน้อย 1 ใบเปิดอยู่ (ต่อจาก `TC-PE-020104`)
**Steps**
1. ดูบรรทัดคำอธิบายใต้ชื่อโมดูล
2. ดูหัวตาราง
**Expected**
บรรทัดคำอธิบายมีรูปแบบ `<n> complete · <n> incomplete · <n> total` โดยตัวเลข total ตรงกับจำนวนบนการ์ด · หัวตารางมีสี่คอลัมน์คือ `#`, `Document No`, `Status`, `Date` · คอลัมน์ `#` ไล่เลขจาก 1 และคอลัมน์ Status แสดงเป็น badge

---

## TC-PE-020107 — โมดูลที่ไม่มีเอกสารเปิด dialog แล้วเห็น empty state
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; มีอย่างน้อยหนึ่งโมดูลที่การ์ดแสดงเลข `0`
**Steps**
1. คลิกการ์ดของโมดูลที่แสดงเลข 0
**Expected**
dialog เปิดขึ้นตามปกติ (ไม่ถูกบล็อก) หัวข้อเป็นชื่อโมดูลนั้น บรรทัดสรุปอ่านว่า `0 complete · 0 incomplete · 0 total` และในกรอบตารางแสดง empty state ข้อความ "No documents in this period."

---

## TC-PE-020108 — ปุ่ม Refresh ดึงข้อมูลใหม่และถูก disable ระหว่างโหลด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` และข้อมูลโหลดเสร็จแล้ว
**Steps**
1. กดปุ่ม `Refresh` ที่มุมขวาบน
2. สังเกตปุ่มทันทีหลังกด
**Expected**
มี request ไปยัง endpoint review ถูกยิงซ้ำ · ระหว่างที่กำลังดึงข้อมูล ปุ่มถูก disable และไอคอนในปุ่มหมุน · เมื่อดึงเสร็จปุ่มกลับมากดได้และไอคอนหยุดหมุน · หน้าไม่เปลี่ยน URL

---

## TC-PE-020109 — ปุ่มย้อนกลับพากลับหน้า Current Period
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`
**Steps**
1. กดปุ่มไอคอนย้อนกลับที่มุมซ้ายของแถวหัวเรื่อง (aria-label `Go back`)
**Expected**
เบราว์เซอร์ไปที่ `/inventory-management/period-end` และเห็นหัวเรื่อง `Current Period` · ไม่มี dialog ถามยืนยันทิ้งงาน (หน้านี้ไม่ใช่ฟอร์ม)

---

## TC-PE-020110 — ส่วน Physical Count แสดงแถบความคืบหน้าและ badge จำนวนคลังที่นับเสร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; งวดมีคลังที่ต้องนับอย่างน้อย 1 คลัง
**Steps**
1. เลื่อนลงไปที่หัวข้อ `Physical Count`
**Expected**
หัวข้อมี badge ทางขวาที่อ่านว่า `<n> of <m> completed` โดย `m` เท่ากับจำนวนการ์ดคลังที่แสดงอยู่ และ `n` เท่ากับจำนวนคลังที่สถานะเป็น completed · ใต้หัวข้อมีแถบความคืบหน้า (progress bar) หนึ่งแถบก่อนรายการการ์ด

---

## TC-PE-020111 — งวดที่ไม่มีคลังให้นับ แสดง empty state ของ Physical Count
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่ `details.physical_count` เป็นรายการว่าง
**Steps**
1. เลื่อนลงไปที่หัวข้อ `Physical Count`
**Expected**
หัวข้อยังอยู่แต่**ไม่มี badge จำนวน** ทางขวา และใต้หัวข้อเป็นการ์ดที่มี empty state ข้อความ "No physical counts in this period." · ไม่มีแถบความคืบหน้าและไม่มีการ์ดคลังใด ๆ

---

## TC-PE-020112 — การ์ดคลังแสดงชื่อ รหัส ประเภท และแถบความคืบหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; มีการ์ดคลังอย่างน้อย 1 ใบ
**Steps**
1. ดูการ์ดคลังใบแรก
**Expected**
การ์ดแสดงตัวอักษรย่อของชื่อคลังเป็นอวตาร ชื่อคลังเป็นลิงก์ รหัสคลัง และ badge บอกว่าคลังนี้ต้องนับหรือไม่ (`Count` / `Not count`) · บรรทัดถัดมาแสดงประเภทคลัง · ส่วนกลางการ์ดมีแถว `Progress` ที่แสดงค่าในรูปแบบ `<นับแล้ว>/<ทั้งหมด> (<เปอร์เซ็นต์>%)` พร้อมแถบความคืบหน้า · **ไม่ต้อง assert ข้อความบรรทัดจำนวนรายการที่แถบท้ายการ์ด** — ดูข้อ 13 ใน callout

---

## TC-PE-020113 — รอบยังไม่เปิด ปุ่มบนการ์ดคลังถูก disable พร้อมเหตุผลใน tooltip
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่ **รอบตรวจนับยังไม่เป็น `counting`** (`physical_count_period.status` ไม่ใช่ `counting` หรือเป็น null); มีการ์ดคลังที่ยังนับไม่เสร็จอย่างน้อย 1 ใบ
**Steps**
1. ดูปุ่มมุมขวาบนของการ์ดคลังใบแรก
2. อ่านค่า `title` ของปุ่มนั้น
**Expected**
ปุ่ม (`Start` หรือ `Resume`) **ถูก disable** และ `title` ของปุ่มอ่านว่า "Counting has not started for this period yet." · **ห้ามกดปุ่มนี้ในเทส** — เมื่อมันกดได้ มันจะสร้างใบนับใหม่ ดูข้อ 15 ใน callout · การ์ดที่นับเสร็จแล้วจะไม่มีปุ่มแต่เป็นป้ายข้อความ `Done` แทน

---

## TC-PE-020114 — คลิกชื่อคลังบนการ์ดไปหน้าตั้งค่า Location
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; มีการ์ดคลังอย่างน้อย 1 ใบ
**Steps**
1. คลิก**ชื่อคลัง** บนการ์ด (ไม่ใช่ตัวการ์ดและไม่ใช่ปุ่มมุมขวา)
**Expected**
เบราว์เซอร์ไปที่ `/config/location/<location id>` ของคลังนั้น และหน้าแสดงข้อมูลคลังที่ตรงกับชื่อบนการ์ด

---

## TC-PE-030101 — กด "Start Period Close" เปิด dialog ยืนยันพร้อมคำเตือนว่าย้อนไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; งวดปัจจุบันสถานะ `Open`; **ยืนยันก่อนว่าปุ่มอ่านว่า `Start Period Close` ไม่ใช่ `Continue Counting`**
**Steps**
1. กดปุ่ม `Start Period Close`
**Expected**
เปิดกล่องยืนยัน (`role="alertdialog"` — `getByRole("dialog")` ไม่แมตช์) หัวข้อ "Start counting for this period?" คำอธิบาย "Every location can then be counted against the stock on hand right now. **This cannot be undone** — the round stays open until the period is closed." · ปุ่มยืนยันในกล่องอ่านว่า `Start Period Close` และมีปุ่ม `Cancel` · **ยังไม่มี request `start-counting` ถูกยิงในขั้นนี้**

---

## TC-PE-030102 — กด Cancel ใน dialog ยืนยัน ไม่มีการเปิดรอบและไม่เปลี่ยนหน้า
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
กล่องยืนยัน "Start counting for this period?" เปิดอยู่ (ต่อจาก `TC-PE-030101`)
**Steps**
1. กดปุ่ม `Cancel` ในกล่อง
2. ดูปุ่มที่ footer ของการ์ดงวดอีกครั้ง
**Expected**
กล่องปิดลง URL ยังเป็น `/inventory-management/period-end` และปุ่มที่ footer **ยังอ่านว่า `Start Period Close` เหมือนเดิม** (ถ้ากลายเป็น `Continue Counting` แปลว่ารอบถูกเปิดไปแล้ว = บั๊ก) · เคสนี้เป็นด่านปลอดภัยของทั้งบล็อก ควรรันก่อน `TC-PE-030106` เสมอ

---

## TC-PE-030103 — มีเอกสารค้างในงวด ขึ้น dialog "Finish these documents first" แทน toast
**Priority:** High · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/inventory-management/period-end`; งวดปัจจุบันยัง**มีเอกสารที่กระทบสต๊อกค้างอยู่** — ใบรับของ (GRN), Stock In, Stock Out ที่ยังไม่ committed หรือใบเบิก (SR) ที่ยังไม่จบ; รอบตรวจนับยังไม่เปิด
**Steps**
1. กดปุ่ม `Start Period Close`
2. กดปุ่มยืนยันในกล่อง
3. รอ response
**Expected**
backend ตอบ **422** · กล่องยืนยันปิดลง และแทนที่จะขึ้น toast ผิดพลาด หน้าเปิด dialog ใหม่หัวข้อ "Finish these documents first" พร้อมคำอธิบายรูปแบบ "<n> document(s) in this period still move stock. Counting now would record an on-hand figure that is already out of date." โดย `<n>` ตรงกับจำนวนเอกสารที่ลิสต์รวมกันในกล่อง · **รอบตรวจนับไม่ถูกเปิด** — ปิดกล่องแล้วปุ่มที่การ์ดยังอ่านว่า `Start Period Close` เคสนี้จึงรันซ้ำได้

---

## TC-PE-030104 — dialog เอกสารค้างจัดกลุ่มตามประเภทพร้อม badge จำนวนและสถานะรายใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
dialog "Finish these documents first" เปิดอยู่ (ต่อจาก `TC-PE-030103`)
**Steps**
1. ดูโครงสร้างภายในกล่อง
**Expected**
เอกสารถูกจัดเป็นกลุ่มตามหัวข้อที่เป็นไปได้สี่หัวข้อ และเรียงตามลำดับคงที่คือ `Goods Receive Notes not yet committed` → `Stock In not yet committed` → `Stock Out not yet committed` → `Store Requisitions still in progress` · **กลุ่มที่ไม่มีเอกสารต้องไม่ปรากฏเลย** · แต่ละหัวข้อมี badge สีแดงบอกจำนวนใบในกลุ่มนั้น และแต่ละแถวแสดงเลขที่เอกสารเป็นลิงก์ ป้ายสถานะของเอกสาร และวันที่ · ท้ายกล่องมีปุ่มเดียวคือ `Close`

---

## TC-PE-030105 — ปุ่ม Close ใน dialog เอกสารค้างปิดกล่องโดยไม่เปลี่ยนสถานะอะไร
**Priority:** Low · **Test Type:** Functional
**Preconditions**
dialog "Finish these documents first" เปิดอยู่ (ต่อจาก `TC-PE-030103`)
**Steps**
1. กดปุ่ม `Close` ที่ท้ายกล่อง
**Expected**
กล่องปิดลง กลับมาที่หน้า Current Period โดย URL ไม่เปลี่ยน · ปุ่มที่ footer ของการ์ดยังอ่านว่า `Start Period Close` และกดได้ (กดซ้ำได้ กล่องเอกสารค้างจะขึ้นอีกครั้งตราบใดที่เอกสารยังค้าง)

---

## TC-PE-030106 — **[IRREVERSIBLE]** ยืนยันเปิดรอบสำเร็จ ขึ้น toast แล้วพาไปหน้า review
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
⚠️ **เคสนี้เปลี่ยนสถานะจริงและย้อนกลับไม่ได้** — รอบตรวจนับของงวดจะถูกเลื่อนจาก `draft` เป็น `counting` ถาวรจนกว่างวดจะถูกปิด และการ์ดโมดูล Physical Count ทั้ง BU จะกดนับได้ทันที **ห้ามรันบน BU ที่ใช้ทดสอบเคสอื่น ๆ อยู่** ให้แยกไป BU ที่ทิ้งได้ หรือจัดเป็นเคสสุดท้ายของรอบ
อยู่ที่ `/inventory-management/period-end`; งวดปัจจุบันสถานะ `Open`; **ไม่มีเอกสารค้างในงวด** (ผ่าน `TC-PE-030103` แล้วไม่เจอ blocker) และรอบยังไม่เป็น `counting`
**Steps**
1. กดปุ่ม `Start Period Close`
2. กดปุ่มยืนยันในกล่อง
3. รอ response
**Expected**
กล่องยืนยันปิดลง ขึ้น toast สำเร็จข้อความ "Counting started." และเบราว์เซอร์ถูกพาไปที่ `/inventory-management/period-end/review` โดยอัตโนมัติ · เมื่อย้อนกลับไปหน้า `/inventory-management/period-end` ปุ่มที่ footer ของการ์ดต้องเปลี่ยนเป็น **`Continue Counting`** แล้ว

---

## TC-PE-030107 — ระหว่างส่งคำขอเปิดรอบ ปุ่มใน dialog ถูก disable และปิด dialog ไม่ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end` และเปิดกล่องยืนยัน "Start counting for this period?" ไว้แล้ว · ต้องหน่วง response ของ `POST /period-ends/start-counting` เพื่อจับสถานะกลางคัน (route interception)
**Steps**
1. กดปุ่มยืนยันในกล่อง
2. ขณะที่ request ยังไม่ตอบกลับ ลองกดปุ่ม `Cancel` และลองกด `Escape`
**Expected**
ระหว่าง pending ปุ่ม `Cancel` และปุ่มยืนยันทั้งคู่ **ถูก disable** และกล่องปิดไม่ได้ทั้งจากปุ่มและจากแป้น `Escape` (`confirm-dialog.tsx:66` ตัด `onOpenChange` ทิ้งเมื่อ `isPending`) · ปุ่มที่ footer ของการ์ดด้านหลังก็ถูก disable ด้วย

---

## TC-PE-040101 — งวดที่ยังปิดไม่ได้ ปุ่ม Close Period ถูก disable พร้อมเหตุผลใน tooltip
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่ backend คืน `can_close = false` (ยังมีเอกสารไม่ครบหรือคลังนับไม่ครบ)
**Steps**
1. ดูปุ่ม `Close Period` ที่มุมขวาบน
2. อ่านค่า `title` ของปุ่ม
**Expected**
ปุ่ม **ถูก disable** และ `title` อ่านว่า "All transactions must be complete and all physical counts must be completed before closing." · กดแล้วต้องไม่มีกล่องยืนยันเปิดขึ้น · **ห้ามคำนวณเงื่อนไขนี้เองในเทส** ให้ยึดค่า `can_close` จาก response หรืออ่านสถานะปุ่มตรง ๆ (ดูข้อ 5 ใน callout)

---

## TC-PE-040102 — กด Close Period เปิด dialog ยืนยันพร้อมคำเตือนว่าล็อกทั้งงวด
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่ backend คืน `can_close = true` (ปุ่ม `Close Period` กดได้)
**Steps**
1. กดปุ่ม `Close Period`
**Expected**
เปิดกล่องยืนยัน (`role="alertdialog"`) หัวข้อ "Close this period?" คำอธิบาย "**This action cannot be undone.** All transactions and physical counts in this period will be locked." · ปุ่มยืนยันในกล่องอ่านว่า `Close Period` และเป็นสไตล์ destructive มีปุ่ม `Cancel` คู่กัน · **ยังไม่มี request ปิดงวดถูกยิงในขั้นนี้**

---

## TC-PE-040103 — กด Cancel ใน dialog ปิดงวด ไม่มีการปิดงวดเกิดขึ้น
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
กล่องยืนยัน "Close this period?" เปิดอยู่ (ต่อจาก `TC-PE-040102`)
**Steps**
1. กดปุ่ม `Cancel` ในกล่อง
2. ดูป้ายสถานะบนการ์ดสรุปของหน้า review
**Expected**
กล่องปิดลง URL ยังเป็น `/inventory-management/period-end/review` ไม่มี toast ขึ้น และป้ายสถานะของงวดยังอ่านว่า `Open` · ปุ่ม `Close Period` ยังกดได้อยู่ · เคสนี้เป็นด่านปลอดภัยของบล็อก 04 ควรรันก่อน `TC-PE-040104` เสมอ

---

## TC-PE-040104 — **[IRREVERSIBLE]** ยืนยันปิดงวดสำเร็จ ขึ้น toast แล้วกลับหน้า Current Period
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
⚠️ **เคสนี้ปิดงวดจริงและย้อนกลับไม่ได้** — เอกสารและใบนับทั้งงวดจะถูกล็อก และ `useClosePeriodEnd` ล้าง cache ของทั้ง `PERIOD_ENDS` และ `PHYSICAL_COUNT_PERIOD_CURRENT` ด้วย (รอบตรวจนับทุกใบกลายเป็น completed) **ห้ามรันบน BU ที่ใช้ทดสอบโมดูลอื่นอยู่** — โมดูล Physical Count, Spot Check และทุกโมดูลเอกสารในงวดนั้นจะได้รับผลกระทบ ให้แยก BU หรือจัดเป็นเคสสุดท้ายสุดของทั้งชุด
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่ `can_close = true` และกล่องยืนยันเปิดอยู่
**Steps**
1. กดปุ่มยืนยัน `Close Period` ในกล่อง
2. รอให้หน้าเปลี่ยน
**Expected**
ขึ้น toast สำเร็จข้อความ "Period closed successfully." กล่องปิดลง และเบราว์เซอร์ถูกพาไปที่ `/inventory-management/period-end` · ที่หน้านั้นการ์ดงวดต้องแสดงป้ายสถานะ `Closed` และปุ่มที่ footer ต้องถูก disable (ตรงกับ `TC-PE-010107`)

---

## TC-PE-310101 — รอบยังไม่เปิด หน้า Physical Count กด Start แล้วขึ้น dialog บอกให้ไปเปิดรอบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น Admin (BU = `BLAVG`); งวดปัจจุบันมีรอบตรวจนับที่ **ยังไม่เป็น `counting`**; หน้า `/inventory-management/physical-count` มีคลังที่ยังไม่มีใบนับอย่างน้อย 1 คลัง
**Steps**
1. เปิด `/inventory-management/physical-count`
2. กดปุ่ม `Start` บนการ์ดคลังที่ยังไม่มีใบนับ
**Expected**
เปิด dialog หัวข้อ "Counting has not started" พร้อมคำอธิบาย "This period's counting round is not open yet. Start it from Period End, then come back to count each location." · **ไม่มีใบนับถูกสร้าง ไม่มี request สร้างใบถูกยิง** (`pc-component.tsx:235-238` ตัดก่อนถึง mutation) เคสนี้จึงรันซ้ำได้ปลอดภัย · ท้ายกล่องมีปุ่ม `Close` และปุ่ม `Go to Period End`

---

## TC-PE-310102 — ปุ่ม "Go to Period End" ใน dialog นั้นพามาหน้า Period End
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
dialog "Counting has not started" เปิดอยู่ (ต่อจาก `TC-PE-310101`)
**Steps**
1. กดปุ่ม `Go to Period End`
**Expected**
เบราว์เซอร์ไปที่ `/inventory-management/period-end` และเห็นหัวเรื่อง `Current Period` พร้อมปุ่ม `Start Period Close` ที่ footer ของการ์ด — เป็นการยืนยันว่าเส้นทางที่ dialog แนะนำพาไปถึงปุ่มที่แก้ปัญหาได้จริง

---

## TC-PE-310103 — **[IRREVERSIBLE]** รอบเปิดแล้ว หน้า Physical Count ไม่ขึ้น dialog บล็อกอีก
**Priority:** High · **Test Type:** Functional
**Preconditions**
⚠️ **precondition ของเคสนี้ย้อนกลับไม่ได้** — ต้องรัน `TC-PE-030106` (เปิดรอบตรวจนับ) มาก่อน ซึ่งเปลี่ยนสถานะรอบเป็น `counting` ถาวร · หลังเปิดรอบแล้ว หน้า `/inventory-management/physical-count` มีคลังที่ยังไม่มีใบนับอย่างน้อย 1 คลัง
**Steps**
1. เปิด `/inventory-management/physical-count`
2. ดูปุ่มบนการ์ดคลังที่ยังไม่มีใบนับ
**Expected**
ปุ่ม `Start` กดได้ (ไม่ถูก disable) และหน้าไม่แสดง dialog "Counting has not started" ค้างอยู่ · **ไม่ต้องกดปุ่มในเคสนี้** — การกดจะสร้างใบนับใหม่ (`use-open-physical-count.ts:52`) ให้ assert แค่ว่าเงื่อนไขบล็อกหายไปแล้ว การทดสอบการนับจริงเป็นขอบเขตของ `docs/test-cases/750-physical-count.md`

---

## TC-PE-320101 — ลิงก์เอกสารใน dialog ธุรกรรมพาไปหน้าโมดูลต้นทางที่ถูกต้อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; เปิด dialog รายการเอกสารของโมดูล `Purchase Requests` (หรือโมดูลอื่นในกลุ่ม pr/po/grn/cn/sr) ที่มีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. จดเลขที่เอกสารของแถวแรก
2. คลิกเลขที่เอกสารนั้น (คอลัมน์ `Document No` เป็นลิงก์)
**Expected**
dialog ปิดลงเอง และเบราว์เซอร์ไปที่หน้าเอกสารของโมดูลที่ถูกต้อง — `pr` → `/procurement/purchase-request/<id>`, `po` → `/procurement/purchase-order/<id>`, `grn` → `/procurement/goods-receive-note/<id>`, `cn` → `/procurement/credit-note/<id>`, `sr` → `/store-operation/store-requisition/<id>` · หน้าปลายทางแสดงเลขที่เอกสารเดียวกับที่จดไว้

---

## TC-PE-320102 — ลิงก์ Stock In / Stock Out ต้องมี `?type=` ต่อท้าย
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review`; โมดูล `Stock In` และ/หรือ `Stock Out` มีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. เปิด dialog รายการเอกสารของ `Stock In` แล้วคลิกเลขที่เอกสารแถวแรก
2. ย้อนกลับมาหน้า review แล้วทำซ้ำกับ `Stock Out`
**Expected**
ทั้งสองลิงก์พาไปหน้า Inventory Adjustment หน้าเดียวกันคือ `/inventory-management/inventory-adjustment/<id>` แต่ **ต้องมี query ต่อท้ายเสมอ** — `?type=stock-in` สำหรับ Stock In และ `?type=stock-out` สำหรับ Stock Out · หน้าปลายทางต้องแสดงเอกสารจริง ไม่ใช่ `ErrorState` (ถ้าไม่มี query หน้านั้นจะเรนเดอร์ error ทันที — ดูข้อ 9 ใน callout)

---

## TC-PE-320103 — ลิงก์เอกสารใน dialog เอกสารค้างใช้กติกาเส้นทางชุดเดียวกัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
dialog "Finish these documents first" เปิดอยู่ (ต่อจาก `TC-PE-030103`) และมีกลุ่มเอกสารอย่างน้อยหนึ่งกลุ่ม
**Steps**
1. จดเลขที่เอกสารใบแรกในกลุ่มแรก
2. คลิกเลขที่เอกสารนั้น
**Expected**
dialog ปิดลงเอง และเบราว์เซอร์ไปที่หน้าเอกสารของโมดูลที่ตรงกับหัวข้อกลุ่ม — `Goods Receive Notes…` → `/procurement/goods-receive-note/<id>`, `Store Requisitions…` → `/store-operation/store-requisition/<id>`, `Stock In…` / `Stock Out…` → `/inventory-management/inventory-adjustment/<id>?type=stock-in|stock-out` · เป็นการยืนยันว่า dialog ทั้งสองตัวใช้ `buildDocumentPath()` ตัวเดียวกันจริง

---

## TC-PE-900201 — โมดูลที่ไม่มีเอกสารเลยยังมีการ์ดพร้อมเลข 0 ไม่ถูกซ่อน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/inventory-management/period-end/review` ของงวดที่มีอย่างน้อยหนึ่งโมดูลไม่มีเอกสารเลย (เช่น `Credit Notes` ใน BU ที่ยังไม่เคยออกใบลดหนี้)
**Steps**
1. นับจำนวนการ์ดในส่วน `Transactions`
2. ดูการ์ดของโมดูลที่ไม่มีเอกสาร
**Expected**
จำนวนการ์ดยังเป็น **7 ใบเท่าเดิม** — โมดูลที่ไม่มีเอกสารไม่ถูกซ่อน แต่แสดงเลข `0` พร้อม badge `Incomplete` · ส่วน `Transactions` ต้อง**ไม่แสดง empty state ใด ๆ** และตัวเลขสรุป `<เสร็จ>/7` ยังหารด้วย 7 เสมอ

---

## TC-PE-900202 — เปิด `/period-end/review` ด้วย deep link โดยไม่ผ่านหน้า Current Period
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น Admin (BU = `BLAVG`); ยังไม่เคยเปิดหน้า `/inventory-management/period-end` ใน session นี้
**Steps**
1. เปิด URL `/inventory-management/period-end/review` ตรง ๆ
2. รอให้ skeleton หายไป
3. กด `F5` / reload หน้าอีกครั้ง
**Expected**
หน้าโหลดได้เต็มรูปแบบทั้งสองครั้ง — หัวเรื่อง `Period Close Review`, การ์ดสรุป, การ์ดธุรกรรม 7 ใบ และส่วน `Physical Count` แสดงครบ · หน้านี้ไม่ต้องการ state ที่ส่งต่อมาจากหน้าก่อน (ข้อมูลทั้งหมดมาจาก `GET` ของตัวเอง) · ปุ่มย้อนกลับยังพาไป `/inventory-management/period-end` ได้ตามปกติ

---

## TC-PE-900203 — งวดที่ปิดแล้ว หน้า review แสดงสถานะ Closed และปุ่มปิดงวดกดไม่ได้
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
BU ที่งวดปัจจุบันถูกปิดไปแล้ว (รันหลัง `TC-PE-040104` หรือใช้ BU ที่ seed งวดปิดไว้)
**Steps**
1. เปิด `/inventory-management/period-end/review`
2. ดูป้ายสถานะบนการ์ดสรุปและปุ่ม `Close Period`
**Expected**
ป้ายสถานะบนการ์ดสรุปอ่านว่า `Closed` และปุ่ม `Close Period` ถูก disable (backend คืน `can_close = false` สำหรับงวดที่ปิดแล้ว) · ปุ่ม `Refresh` ยังกดได้ตามปกติ · ปุ่มบนการ์ดคลังทุกใบถูก disable เพราะรอบตรวจนับไม่ได้อยู่สถานะ `counting` แล้ว
