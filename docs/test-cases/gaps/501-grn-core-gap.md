# Goods Receive Note — ส่วนหลักของโมดูล (list · detail · edit · รับของ · ภาษี/ส่วนลด · สถานะ · สิทธิ์) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบจริง** เท่านั้น — "ยังไม่ครอบ" ในไฟล์นี้ไม่ได้แปลว่า "ไม่มีเคส" แต่แปลว่า **มีเคสที่อ้างว่าทดสอบแล้วแต่ไม่มี oracle ที่ล้มได้** ดูหัวข้อ "ทำไมโมดูลนี้ต่างจากโมดูลอื่น" ด้านล่าง_

**Module:** Goods Receive Note (ทุกส่วนยกเว้น wizard `from-po`)
**Frontend route:** `routes/procurement/goods-receive-note/`  •  **URL:** `/procurement/goods-receive-note` · `/procurement/goods-receive-note/new` · `/procurement/goods-receive-note/:id`
**Prefix:** `GRN` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Section blocks:** `01, 02, 04, 05, 07, 09, 10, 11, 12, 13, 14, 15, 17` — ทั้งหมดอยู่ในชุดที่ `docs/test-id-scheme.md` ลงทะเบียนให้ `GRN` แล้ว (`01–18, 90`) **ไม่ต้องแก้ scheme**
**ช่วง ID:** sub-block `01xx` ของแต่ละ section (`TC-GRN-010101` … `TC-GRN-170101`) — สเปกใช้ถึง seq `0028` สูงสุด และ `501-grn-from-po-gap.md` ใช้ `TC-GRN-040005`–`TC-GRN-040028` จึงไม่ชนกับทั้งสองที่
**Spec ที่ครอบส่วนที่เหลือ:** `tests/501-grn.spec.ts`
**Gap report พี่น้อง (อย่าเขียนซ้ำ):** `docs/test-cases/gaps/501-grn-from-po-gap.md` — wizard `/from-po` 24 เคส (`TC-GRN-040005`–`040028`)
**Total test cases:** 62

---

## ทำไมโมดูลนี้ต่างจากโมดูลอื่น — อ่านก่อนแปลงเป็นสเปก

`bun audit:spec-health` (`docs/test-cases/SPEC-HEALTH.md`) วัด `tests/501-grn.spec.ts` ได้ว่า

- **76 เคสที่รันจริง** แต่ **57 เคสไม่มี `expect(...)` เลยแม้แต่ตัวเดียว**
- assertion ทั้งไฟล์รวม 26 ครั้ง กระจายใน 19 เคส

แปลว่า **สามในสี่ของเคสในโมดูลนี้ "เดินผ่าน UI แล้วจบ"** — body เป็น `goto` + `click().catch(() => {})` แล้วจบฟังก์ชัน ซึ่ง Playwright รายงานว่า **ผ่าน** เสมอ ไม่ว่าแอปจะทำอะไร (หรือไม่ทำอะไรเลย)

> **ฉะนั้น gap ของโมดูลนี้ไม่ใช่ "ไม่มีเคส" แต่เป็น "มีเคสที่อ้างว่าทดสอบแต่ไม่ได้ทดสอบ"** ไฟล์นี้คือชุดเคสที่มี **Expected ที่ล้มได้จริง** สำหรับพฤติกรรมที่เคสเดิมอ้างถึงแต่ไม่เคยยืนยัน

### เคสเดิม 19 ตัวที่ "มี expect" — และ expect นั้นยืนยันอะไรจริงบ้าง

แบ่งเป็นสามชั้น เพราะ **ไม่ใช่ทุก `expect` จะล้มได้**

**ชั้น A — falsifiable จริง (7 เคส) → ถือว่าครอบแล้ว ห้ามเขียนซ้ำ**

| TC | assertion ที่ใช้ | ครอบอะไร |
| --- | --- | --- |
| `TC-GRN-010001` | `expect(page).toHaveURL(/goods-receive-note/)` | เปิดหน้ารายการแล้วอยู่ที่ URL นั้นจริง |
| `TC-GRN-020003` | `expect(grn.emptyState()).toBeVisible()` | ค้นด้วยคำที่ไม่มีทางเจอ แล้วขึ้น empty state |
| `TC-GRN-050004` | `expect(grn.anyError().first()).toBeVisible()` | กด Save ที่ฟอร์มใบใหม่ที่ยังว่าง แล้วมี error ขึ้น |
| `TC-GRN-060004` | เหมือนกัน | ล้างช่อง Invoice No. ในโหมดแก้ไขแล้วกด Save แล้วมี error ขึ้น |
| `TC-GRN-070002` | เหมือนกัน | กด Save โดยแถวสินค้ายังไม่มีชื่อสินค้า แล้วมี error ขึ้น |
| `TC-GRN-110003` | เหมือนกัน | กด Commit แล้วมี error ขึ้น (มี `test.skip` เมื่อไม่มีข้อมูล — ดีแล้ว) |
| `TC-GRN-150003` | เหมือนกัน | กดส่ง comment ว่างแล้วมี error ขึ้น |


**ชั้น B — falsifiable แต่ผ่าน "ทางลัด" ได้ (7 เคส)** — รูปแบบคือ
```ts
if ((await btn.count()) === 0) { expect(true).toBe(true); }      // ← ทางลัด
else { await expect(btn).toBeDisabled({ timeout: 5_000 }); }      // ← ของจริง
```
`TC-GRN-060003`, `070003`, `080005`, `100002`, `110002`, `120002`, `160002` — ถ้าปุ่มไม่โผล่ (ซึ่งเป็นกรณีที่เกิดจริงบ่อยที่สุด เพราะ page object หา locator ไม่เจอ) เคสจะวิ่งเข้า `expect(true).toBe(true)` เสมอ · **ถือว่าครอบแล้วแบบมีเงื่อนไข** ไฟล์นี้จึงไม่เขียน "ปุ่ม X ถูก disable สำหรับ role ที่ไม่มีสิทธิ์" ซ้ำ แต่เขียนเคสสิทธิ์ในรูปที่ต่างออกไป (dialog `Permission Denied` ที่เด้งจริง — ดู `TC-GRN-050103`)

**ชั้น C — expect ที่ล้มไม่ได้เลย (5 เคส)** — `TC-GRN-010003` (`expect(onListPage || onUnauthorized).toBeTruthy()` — หนึ่งในสองเป็นจริงเสมอ), `TC-GRN-030002`, `050002`, `130002`, `170002` (`expect(true).toBe(true)` เป็นทางเดียวของ body) · **นับเป็นของที่เคลม ID ไว้แล้ว** ไฟล์นี้จึงไม่ตั้ง ID ใหม่ทับหัวข้อเดียวกัน แต่เคสในไฟล์นี้ทดสอบพฤติกรรมชั้นในที่เคสเหล่านั้นไม่เคยแตะ

### ข้อเท็จจริงจาก source ที่ผู้แปลงเป็นสเปกต้องรู้ (ไม่ใช่บั๊ก — อย่าเขียนเคสยืนยันว่า "ยังไม่ทำงาน")

1. **สถานะของ GRN มีสี่ค่า: `draft` · `saved` · `committed` · `voided`** (`constant/goods-receive-note.ts`) — **ไม่มีสถานะ `RECEIVED`** ที่สเปกเดิมอ้างถึงทั่วทั้งไฟล์ (เช่น `TC-GRN-080005`, `110002`, `120001`) เคสเดิมที่ `filter({ hasText: /received/i })` จึงไม่มีวันเจอแถวที่ต้องการ (ยิ่งกว่านั้นตารางมีคอลัมน์ **Received By** ซึ่งเคยทำให้ตัวกรองไปแมตช์แถว `<thead>` — สเปกแก้ด้วยการ scope `tbody` ไปแล้ว)
2. **`New Goods Receive Note` ไม่ใช่เมนู** — เป็นปุ่มที่เปิด **dialog `Select Document Type`** ที่มีการ์ด `<button>` สองใบ: `Manual` (`Record direct receipt`) และ `Purchase Order` (`Receive from approved PO`) · เลือก `Purchase Order` → `/procurement/goods-receive-note/from-po` (wizard, ครอบในอีกไฟล์) · เลือก `Manual` → `/procurement/goods-receive-note/new?doc_type=manual`
3. **ปุ่ม `New Goods Receive Note` ในหน้ารายการไม่ได้ถูก gate ด้วย permission** — `GrnComponent` เรียก `DocumentListActions` โดยไม่ส่ง `addDisabled` ต่างจากปุ่มลบในแถว (`useDeleteGate`) และปุ่ม Edit/Delete บนหัวใบ (`useCan` + `dispatchPermissionDenied`) ที่ gate จริง · **เคสสิทธิ์ในไฟล์นี้จึงเขียนเฉพาะจุดที่ gate จริง** และบันทึกข้อเท็จจริงนี้ไว้ตรงนี้แทนการตั้งเคสยืนยันว่ามันไม่ทำงาน
4. **comment และ activity log ไม่ใช่แท็บ** — อยู่ในเมนู `More` (ปุ่ม ⋯) บนหัวใบ: `Comment` เปิด `CommentSheet`, `Activity` เปิด activity sheet, `Print` โผล่เฉพาะโหมดอ่าน · แท็บของฟอร์มมีแค่สามอัน: `Items` · `Extra Cost` · `Stock Movement` · **ไม่มีแท็บ `Financial Summary`** (ยอดรวมอยู่ที่แถบสรุปท้ายหน้า `SummaryFooterBar`) และ **ไม่มีหน้าจัดการ attachment แยก** (ไฟล์แนบอยู่ในแผง comment)
5. **แท็บ Stock Movement ยังไม่มีข้อมูล** — `GrnStockTable` เป็น empty state สองข้อความตามสถานะ (รอ endpoint `GET /goods-received-note/{id}/stock-movements`) · เคส `TC-GRN-140101` จึง assert **ข้อความที่ถูกต้องตามสถานะ** ไม่ใช่ assert ว่ามีตาราง
6. **ช่องค้นหายิงตอนกด Enter หรือกดปุ่มแว่นเท่านั้น** (`components/search-input.tsx`) — พิมพ์เฉย ๆ ไม่กรอง · ปุ่มท้ายช่องสลับเป็นกากบาท (`aria-label` = `Clear search`) เมื่อมีข้อความ
7. **ตัวกรองอยู่ในเมนู `Filter` ไม่ใช่ช่องกรอกที่มี label** — ปุ่มล้างชื่อว่า `Clear` (ไม่ใช่ `Clear Filters`) · ตัวกรองมี 7 ชุด: Status, Type, Invoice No., Total Amount (frontend-only), Vendor, Received By, GRN Date
8. **เปิดใบจากหน้ารายการด้วย `<button>` ไม่ใช่ `<a href>`** — คอลัมน์ `GRN No.` ใช้ `CellAction` ซึ่งเป็น `<button type="button">` ที่แต่งเป็นลิงก์ (ดู `tests/helpers/list-row.ts` → `openRecordFromRow`)
9. **การบันทึกมีสองปุ่มคนละความหมาย** — `Save Draft` (`doc_status = "draft"`) อยู่หน้าเดิม ส่วน `Save`/`Create` (`doc_status = "saved"`) เรียก `PATCH` แล้วตามด้วย `/save` แล้ว **กลับหน้ารายการ** · ใบที่สถานะ `saved` แล้วจะ **ไม่มีปุ่ม Edit/Save/Save Draft** อีก (`GrnHeader`: `canEdit = !isCommitted && !isVoid && !isSaved`)
10. **`Commit` กับ `Void` อยู่ที่ footer ขวาล่าง (แถวเดียวกับยอดสรุป) ไม่ใช่หัวใบ** และโผล่เฉพาะเมื่อ `มีใบจริง && โหมดอ่าน && ไม่ committed && ไม่ voided` (`GrnFooterAction`) · toast ของ commit เป็นข้อความเฉพาะ `Goods receive note committed — stock updated` ไม่ใช่ `... updated successfully`
11. **ยอดทุกช่องคำนวณที่เดียว** — `computeLineAmounts` (`lib/line-pricing`) ผ่าน `useGrnItemLine` แล้ว `GrnItemComputedSync` เขียนกลับเข้าฟอร์ม · แถบสรุปท้ายใบ (`sumGrnItems`) **แค่บวกค่าที่แถวคำนวณไว้แล้ว ไม่คิดใหม่** · `subtotal` ของทั้งใบย้อนจาก `net + discount`
12. **โมเดล override ของส่วนลด/ภาษี** (`routes/procurement/shared/discount-tax-override.tsx`) — ไม่ติ๊ก = ช่อง `%`/Tax Profile กรอกได้ ส่วนช่องยอดเงิน `disabled` และคำนวณให้ · ติ๊ก = สลับกัน และตอนติ๊กจะ **seed ยอดเงินด้วยค่าที่คำนวณล่าสุด** · `%` ส่วนลดถูก clamp `0–100` ที่ `onChange`
13. **แถวของใบรับสินค้า = สินค้า + คลัง** — PO หนึ่งบรรทัดที่กระจายหลายคลังจะกลายเป็น **หลายแถว** ใน GRN (`mapPoDetailToItems`) และคลังที่ `can_use === false` ถูกข้ามทิ้ง
14. **ลำดับการกรอกของแถว manual คือ คลัง → สินค้า → ราคา → จำนวน** — `LookupProductInLocation` ต้องรู้คลังก่อน และ **เปลี่ยนคลังจะล้างสินค้าทิ้งเฉพาะแถวที่กรอกเอง** ส่วนแถวที่มาจาก PO ห้ามล้าง · กด `Enter` ที่ช่องราคา = ไปโฟกัสช่องจำนวนรับ (และ `preventDefault` กัน Enter ไป submit ฟอร์ม)
15. **Role/BU ที่ใช้** — สเปกใช้ `purchase@blueledgers.com` เป็นผู้ใช้หลักและ `requestor@blueledgers.com` เป็นผู้ใช้ที่ไม่มีสิทธิ์ · เคสในไฟล์นี้ใช้ชุดเดียวกัน BU = `BLAVG` · เคสที่ต้องมีใบสถานะเฉพาะ (`saved` / `committed` / `voided`) **บล็อกด้วยข้อมูลหลังบ้าน** ถ้า BU ไม่มีใบในสถานะนั้นต้อง `test.skip` พร้อมเหตุผล ไม่ใช่ `return` เฉย ๆ

### page object ที่ล้าสมัย — ต้องแก้ก่อน (หรือพร้อมกับ) การแปลงเป็นสเปก

`tests/pages/grn.page.ts` เขียนไว้ตามหน้าจอรุ่นก่อน locator ต่อไปนี้ **แมตช์ 0 element กับหน้าจอปัจจุบัน** ซึ่งเป็นเหตุผลใหญ่ที่เคสเดิมทั้ง 57 ตัว "เดินผ่านแล้วจบ" โดยไม่มีใครรู้ (ทุก call site ห่อ `.catch(() => {})`)

| locator | หาอะไร | ของจริง |
| --- | --- | --- |
| `newGRNButton()` | `/new grn\|create.*grn\|create.*new\|^new$\|^create$/i` | ปุ่มชื่อ **`New Goods Receive Note`** — ไม่ตรงสักแพตเทิร์น |
| `createFromPRMenuItem()` / `manualGRNMenuItem()` | `role=menuitem` | เป็น **การ์ด `<button>` ใน dialog** ไม่ใช่ menu item |
| `clearFiltersButton()` | `/clear filters/i` | ปุ่มชื่อ **`Clear`** |
| `grnNumberFilter()` / `vendorFilter()` / `invoiceFilter()` | `getByLabel(...)` | ตัวกรองอยู่ใน **เมนู popover** ไม่มี `<label>` ผูกกับช่องกรอก |
| `receivedDateInput()` | `/received date/i` | ฟิลด์ชื่อ **`GRN Date`** (ไม่มีช่อง "Received Date" ในฟอร์ม) |
| `financialSummaryTab()` / `activityLogTab()` | `role=tab` | **ไม่มีแท็บสองอันนี้** (ยอดอยู่ footer, activity อยู่เมนู ⋯) |
| `commentsTab()` | `role=tab` ชื่อ comments/attachments | comment เป็น **Sheet จากเมนู ⋯** |
| `stockMovementsTab()` | `/stock movements?/i` | แท็บชื่อ **`Stock Movement`** (เอกพจน์ — `s?` ช่วยไว้ ผ่าน) |
| `addItemButton()` | `/add item/i` | ผ่านเฉพาะใบ **manual** · ใบอิง PO ปุ่มชื่อ `Add from PO` / `Add more PO` |
| `statusBadge()` | `filter({ hasText: /draft\|received\|committed\|void\|approved/i })` | สถานะจริงคือ `draft/saved/committed/voided` และ render ด้วย `StatusIconLabel` ไม่ใช่ `[data-slot="badge"]` |
| `vendorTrigger()` / `currencyTrigger()` | `getByLabel(/vendor\|currency/i)` | เป็น `LookupCombobox` (`role=combobox`) ใต้ `FieldLabel` ที่ไม่ได้ผูก `htmlFor` |

สิ่งที่ **ยังใช้ได้**: `saveButton()`, `commitButton()`, `voidButton()`, `emptyState()` (แมตช์ `No data found`), `confirmDialogButton()` (รองรับ `alertdialog` แล้ว), `expectSavedToast()`

---

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-GRN-010101 | หัวหน้ารายการแสดงชื่อ คำอธิบาย และจำนวนใบทั้งหมด | Medium | Functional |
| TC-GRN-010102 | คอลัมน์ของตารางครบตามที่ออกแบบ และ Created/Updated ซ่อนไว้ | Medium | Functional |
| TC-GRN-010103 | กรองตามสถานะแล้วเหลือเฉพาะใบสถานะนั้น พร้อม chip บนแถบตัวกรอง | High | Functional |
| TC-GRN-010104 | กรองตามชนิดเอกสาร Purchase Order / Manual | Medium | Functional |
| TC-GRN-010105 | ตัวกรองเลขที่ใบแจ้งหนี้โหลดตอนเปิดเมนู และไม่มีค่าซ้ำ | Medium | Functional |
| TC-GRN-010106 | ปุ่ม Clear ล้างตัวกรองทุกชุดพร้อมกัน | Medium | Functional |
| TC-GRN-010107 | ส่งออกรายการแล้วขึ้น toast บอกจำนวนบรรทัด | Low | Functional |
| TC-GRN-010108 | เปิดใบจากคอลัมน์ GRN No. ซึ่งเป็นปุ่ม ไม่ใช่ลิงก์ | High | Functional |
| TC-GRN-020101 | หัวใบโหมดอ่าน: เลขที่ · ผู้รับ/แผนก · สถานะ · ชนิดใบ · รุ่น | High | Functional |
| TC-GRN-020102 | แท็บสามอันของฟอร์ม และป้ายจำนวนบนแท็บ Extra Cost | Medium | Functional |
| TC-GRN-020103 | โหมดอ่านแสดงเป็นข้อความ ไม่ใช่ช่องกรอกสีเทา | Medium | Functional |
| TC-GRN-020104 | ปุ่ม Edit โผล่เฉพาะใบที่ยังเป็นร่าง | High | Functional |
| TC-GRN-020105 | เปิด URL ของ id ที่ไม่มีอยู่ ขึ้นข้อความไม่พบเอกสาร | Medium | Negative |
| TC-GRN-040101 | เข้าโหมดแก้ไขแล้วแถบปุ่มเปลี่ยนทั้งชุด | High | Functional |
| TC-GRN-040102 | Invoice Date เป็นฟิลด์บังคับ | High | Validation |
| TC-GRN-040103 | Due Date เลือกก่อนวันที่ใบแจ้งหนี้ไม่ได้ | Medium | Validation |
| TC-GRN-040104 | เลือกเทอมเครดิตแล้ว Due Date คำนวณให้เอง | High | Functional |
| TC-GRN-040105 | ช่องผู้ขายล็อกเมื่อใบเป็นชนิดอิงใบสั่งซื้อ | High | Functional |
| TC-GRN-040106 | กด Cancel ขณะมีของค้าง ขึ้น dialog ยืนยันทิ้งงาน | High | Alternate Flow |
| TC-GRN-040107 | ออกจากหน้าขณะมีของค้าง ถูก nav guard ดักไว้ | Medium | Alternate Flow |
| TC-GRN-040108 | Save Draft สำเร็จแล้วยังอยู่หน้าเดิม | High | Happy Path |
| TC-GRN-040109 | Save สำเร็จแล้วกลับหน้ารายการ และใบเปลี่ยนเป็น Saved | High | Happy Path |
| TC-GRN-040110 | ใบที่บันทึกแล้วไม่มีปุ่มแก้ไข/บันทึกอีก | High | Authorization |
| TC-GRN-050101 | ปุ่มลบบนหัวใบโผล่เฉพาะโหมดแก้ไขของใบที่มีอยู่จริง | Medium | Functional |
| TC-GRN-050102 | ลบใบสำเร็จแล้วกลับหน้ารายการพร้อม toast | High | CRUD |
| TC-GRN-050103 | ผู้ใช้ที่ไม่มีสิทธิ์ลบกดปุ่มลบแล้วขึ้น dialog ปฏิเสธสิทธิ์ | High | Authorization |
| TC-GRN-070101 | ปุ่มเพิ่มรายการต่างกันตามชนิดใบ และปิดจนกว่าจะมีผู้ขาย | High | Functional |
| TC-GRN-070102 | ตารางสินค้าว่างแสดง empty state ของตัวเอง | Medium | Edge Case |
| TC-GRN-070103 | แถวใหม่ขึ้นบนสุดและสืบทอดคลังจากแถวก่อนหน้า | Medium | Functional |
| TC-GRN-070104 | แถวกรอกเอง: เลือกคลังก่อน และเปลี่ยนคลังแล้วสินค้าถูกล้าง | High | Functional |
| TC-GRN-070105 | กด Enter ที่ช่องราคาไปช่องจำนวนรับ ไม่ใช่ส่งฟอร์ม | Medium | Edge Case |
| TC-GRN-070106 | แถวที่มาจากใบสั่งซื้อ: คลังกับสินค้าล็อก จำนวน/ราคาแก้ได้ | High | Functional |
| TC-GRN-070107 | จำนวนรับต้องมากกว่าศูนย์ | High | Validation |
| TC-GRN-070108 | มีจำนวนรับแล้วต้องมีราคาต่อหน่วย | High | Validation |
| TC-GRN-070109 | รับเกินจำนวนที่สั่งขึ้นคำเตือน แต่ไม่บล็อก | Medium | Edge Case |
| TC-GRN-070110 | dialog เพิ่มใบสั่งซื้อ: หัวข้อ ปุ่ม Confirm และใบที่หยิบไปแล้ว | High | Functional |
| TC-GRN-070111 | หยิบใบสั่งซื้อคนละสกุลเงินกับใบรับสินค้า ถูกปฏิเสธพร้อมชื่อสกุลเงิน | High | Validation |
| TC-GRN-070112 | ใบสั่งซื้อหนึ่งบรรทัดที่กระจายหลายคลังกลายเป็นหลายแถว | High | Functional |
| TC-GRN-090101 | ข้อความยืนยันลบแถวบอกทั้งสินค้าและคลัง | Medium | Functional |
| TC-GRN-090102 | ปุ่มลบแถวมีเฉพาะโหมดแก้ไข โหมดอ่านเป็นปุ่มเอกสารต้นทาง | Medium | Functional |
| TC-GRN-100101 | แท็บ Extra Cost ว่างแสดง empty state พร้อมปุ่มเพิ่ม | Medium | Edge Case |
| TC-GRN-100102 | ป้ายจำนวนบนแท็บ Extra Cost ขยับตามรายการ | Medium | Functional |
| TC-GRN-100103 | วิธีปันส่วนมีสองแบบ และช่องจำนวนเงินต่อท้ายด้วยสกุลเงินของใบ | Medium | Functional |
| TC-GRN-100104 | ลบรายการค่าใช้จ่ายเพิ่มเติมต้องยืนยันก่อน | Low | Functional |
| TC-GRN-110101 | ปุ่ม Commit/Void อยู่ที่แถบสรุป และโผล่ตามเงื่อนไขของใบ | High | Functional |
| TC-GRN-110102 | dialog ยืนยัน Commit เตือนว่าสต๊อกจะขยับและย้อนไม่ได้ | High | Functional |
| TC-GRN-110103 | Commit สำเร็จใช้ข้อความเฉพาะของมัน ไม่ใช่ข้อความบันทึกทั่วไป | High | Happy Path |
| TC-GRN-110104 | ใบที่ commit แล้วไม่มีปุ่มแก้ไข/commit/void อีก | High | Functional |
| TC-GRN-120101 | Void สำเร็จแล้วใบเปลี่ยนสถานะพร้อม toast | High | Happy Path |
| TC-GRN-120102 | ใบที่ถูกยกเลิกแล้วแก้ไขต่อไม่ได้ | Medium | Functional |
| TC-GRN-130101 | แถบสรุปท้ายใบมีห้ายอดพร้อมรหัสสกุลเงิน | High | Functional |
| TC-GRN-130102 | ใบที่ไม่มีรายการเลย ไม่มีแถบสรุป | Medium | Edge Case |
| TC-GRN-130103 | Subtotal ของแถวเท่ากับราคาต่อหน่วยคูณจำนวนรับ | High | Functional |
| TC-GRN-130104 | ใส่ส่วนลดเป็นเปอร์เซ็นต์แล้วยอดคำนวณเอง และถูกจำกัด 0–100 | High | Functional |
| TC-GRN-130105 | ติ๊กกรอกยอดส่วนลดเอง สลับช่องที่แก้ได้และตั้งต้นด้วยยอดที่คำนวณไว้ | High | Functional |
| TC-GRN-130106 | เลือก Tax Profile แล้วยอดภาษีคิดจากยอดสุทธิ พร้อมแสดงอัตราใต้ช่อง | High | Functional |
| TC-GRN-130107 | ยอดรวมท้ายใบเท่ากับผลบวกของทุกแถว และส่วนลดแสดงเป็นค่าลบ | High | Functional |
| TC-GRN-130108 | โหมดอ่านแสดงส่วนลด/ภาษีเป็นยอดเงินกับอัตรา ไม่ใช่ช่องกรอก | Medium | Functional |
| TC-GRN-140101 | แท็บ Stock Movement แสดงข้อความคนละชุดตามสถานะของใบ | Medium | Functional |
| TC-GRN-150101 | เปิดแผงความเห็นจากเมนู ⋯ และหัวข้อบอกจำนวน | Medium | Functional |
| TC-GRN-150102 | ส่งความเห็นสำเร็จแล้วขึ้นในแผงและมีจุดแจ้งบนปุ่ม More | Medium | Happy Path |
| TC-GRN-170101 | เปิด Activity ได้ทั้งจากเมนู ⋯ บนหัวใบและเมนูของแถวในรายการ | Medium | Functional |

---

## Section 01 — รายการ · ค้นหา · กรอง · ส่งออก

## TC-GRN-010101 — หัวหน้ารายการแสดงชื่อ คำอธิบาย และจำนวนใบทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น `purchase@blueledgers.com` BU = `BLAVG`; มีใบรับสินค้าอย่างน้อย 1 ใบใน BU
**Steps**
1. ไปที่ `/procurement/goods-receive-note`
2. รอให้ตารางโหลดเสร็จ
**Expected**
หัวหน้ารายการแสดง `<h1>` ข้อความ `Goods Receive Note`, คำอธิบายใต้หัวข้อคือ `What actually arrived from the vendor, checked against the order.` และมี badge ตัวเลขข้างหัวข้อที่มีค่าเท่ากับจำนวนทั้งหมดที่ `data.paginate.total` คืนมา (ตัวเลขมี `,` คั่นหลักพันตาม `toLocaleString()`) — badge ต้องไม่แสดงเมื่อจำนวนเป็น 0

---

## TC-GRN-010102 — คอลัมน์ของตารางครบตามที่ออกแบบ และ Created/Updated ซ่อนไว้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note` และตารางมีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. อ่านหัวคอลัมน์ทั้งแถวของตาราง
2. เปิดเมนู Toggle Columns แล้วดูรายการคอลัมน์ที่มีให้เลือก
**Expected**
หัวคอลัมน์ที่มองเห็นตามลำดับคือ (checkbox), `#`, `GRN No.`, `Vendor`, `GRN Date`, `Invoice No.`, `Status`, `Type`, `Received By`, `Total Amount` — **ไม่มีคอลัมน์ `Status` แบบ Active/Inactive** (`hideStatus: true`) และ **ไม่มีคอลัมน์ `Created` / `Updated`** บนตาราง แต่ทั้งสองต้องปรากฏเป็นตัวเลือก (ยังไม่ติ๊ก) ในเมนู Toggle Columns · แถวที่ไม่มีชื่อผู้รับแสดงเป็น `—` และแถวที่ไม่มียอดเงินแสดงเป็นช่องว่าง

---

## TC-GRN-010103 — กรองตามสถานะแล้วเหลือเฉพาะใบสถานะนั้น พร้อม chip บนแถบตัวกรอง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note`; BU มีใบรับสินค้าในสถานะ `draft` อย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม `Filter`
2. ในหมวด `Document` เลือกตัวกรอง `Status` แล้วติ๊ก `Draft`
3. ปิดเมนูแล้วดูตาราง
**Expected**
ทุกแถวในคอลัมน์ `Status` อ่านว่า `Draft` และไม่มีแถวใดที่เป็น `Saved` / `Committed` / `Voided` · แถบ chip ใต้ toolbar แสดง chip ของตัวกรอง `Status` พร้อมค่า `Draft` และปุ่ม `Clear` ปรากฏขึ้นข้าง chip · จำนวนบน badge ของหัวหน้ารายการเปลี่ยนเป็นจำนวนที่กรองแล้ว

---

## TC-GRN-010104 — กรองตามชนิดเอกสาร Purchase Order / Manual
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note`; BU มีใบทั้งชนิด `purchase_order` และ `manual` (ถ้าไม่มีอย่างใดอย่างหนึ่ง ให้ `test.skip` พร้อมเหตุผล)
**Steps**
1. เปิดเมนู `Filter` → หมวด `Document` → `Type`
2. ติ๊ก `Purchase Order` อย่างเดียว
3. กลับไปเปลี่ยนเป็น `Manual` อย่างเดียว
**Expected**
ขั้นที่ 2 ทุกแถวในคอลัมน์ `Type` อ่านว่า `Purchase Order` · ขั้นที่ 3 ทุกแถวอ่านว่า `Manual` · ชุดแถวของสองขั้นต้องไม่เหมือนกัน (ถ้าเหมือนกันแปลว่าตัวกรองไม่ได้ถูกส่งไป backend)

---

## TC-GRN-010105 — ตัวกรองเลขที่ใบแจ้งหนี้โหลดตอนเปิดเมนู และไม่มีค่าซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note`; มีใบที่กรอก `Invoice No.` ไว้อย่างน้อย 2 ใบ (อย่างน้อยหนึ่งคู่ที่ใช้เลขเดียวกันถ้าจะพิสูจน์ distinct ได้ครบ)
**Steps**
1. เปิดเมนู `Filter` → หมวด `Document` → `Invoice No.`
2. อ่านรายการตัวเลือกที่แสดง
3. ติ๊กเลขที่ใบแจ้งหนี้หนึ่งค่า แล้วปิดเมนู
**Expected**
รายการตัวเลือกมีแถว `All` อยู่บนสุด แล้วตามด้วยเลขที่ใบแจ้งหนี้ **เรียงตามตัวอักษรและไม่มีค่าซ้ำ** (ใบหลายใบที่อ้างเลขเดียวกันต้องปรากฏแค่ครั้งเดียว) และไม่มีค่าว่าง · หลังติ๊ก ปุ่ม trigger เปลี่ยนจากคำว่า `Invoice No.` เป็นเลขที่ที่เลือก (ถ้าเลือกหลายค่าจะเป็น `<เลขแรก> +N`) และตารางเหลือเฉพาะแถวที่คอลัมน์ `Invoice No.` ตรงกับค่าที่ติ๊ก

---

## TC-GRN-010106 — ปุ่ม Clear ล้างตัวกรองทุกชุดพร้อมกัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note` และตั้งตัวกรองไว้แล้วอย่างน้อยสองชุด (เช่น `Status` = Draft และ `Type` = Manual) จน chip ปรากฏสองอัน
**Steps**
1. อ่านจำนวน chip บนแถบตัวกรอง
2. กดปุ่ม `Clear`
**Expected**
chip ทั้งหมดหายไป แถบตัวกรองไม่แสดงอีก และจำนวนบน badge ของหัวหน้ารายการกลับไปเท่ากับจำนวนก่อนกรอง — ปุ่มต้องชื่อ `Clear` (ไม่ใช่ `Clear Filters`)

---

## TC-GRN-010107 — ส่งออกรายการแล้วขึ้น toast บอกจำนวนบรรทัด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note` ด้วยจอกว้างระดับ desktop (ปุ่ม Export ซ่อนบนจอแคบ); มีใบอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม `Export`
2. รอให้ปุ่มเปลี่ยนสถานะและ toast ขึ้น
**Expected**
ระหว่างทำงานปุ่มอ่านว่า `Exporting...` และถูก disable · เมื่อเสร็จขึ้น toast `Exported {n} records` โดย `{n}` เท่ากับจำนวนแถวที่ตัวกรองปัจจุบันให้ · ถ้าตัวกรองปัจจุบันไม่เหลือแถวเลย toast ต้องเป็น `No data to export` (ชนิด warning) ไม่ใช่ `Exported 0 records`

---

## TC-GRN-010108 — เปิดใบจากคอลัมน์ GRN No. ซึ่งเป็นปุ่ม ไม่ใช่ลิงก์
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note` และมีใบอย่างน้อย 1 ใบ
**Steps**
1. หาแถวแรกของ `tbody` แล้วอ่านข้อความในคอลัมน์ `GRN No.`
2. คลิกที่ข้อความนั้น (ไม่ใช่คลิกที่แถว — แถวมีทั้ง checkbox และเมนู action)
**Expected**
element ที่คลิกได้เป็น `<button type="button">` (ไม่มี `<a href>` ในเซลล์นั้น) · หลังคลิก URL เปลี่ยนเป็น `/procurement/goods-receive-note/<uuid>` และหัวใบของหน้าใหม่แสดงเลขที่ใบตัวเดียวกับที่อ่านมาจากตาราง

---

## Section 02 — หน้ารายละเอียด (โหมดอ่าน)

## TC-GRN-020101 — หัวใบโหมดอ่าน: เลขที่ · ผู้รับ/แผนก · สถานะ · ชนิดใบ · รุ่น
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบรับสินค้าใบใดใบหนึ่งจากหน้ารายการ (`/procurement/goods-receive-note/<uuid>`) ด้วย `purchase@blueledgers.com`
**Steps**
1. อ่านแถบหัวเอกสารทั้งแถว
**Expected**
หัวเอกสารแสดง **เลขที่ใบ** (`grn_no`) เป็นชื่อหลัก, ใต้ชื่อมีบรรทัดย่อยที่มีชื่อผู้รับและชื่อแผนกคั่นด้วยไอคอน และถัดจากชื่อมีกลุ่ม badge สามอย่างคั่นด้วยเส้นตั้ง: ป้ายสถานะ (`Draft` / `Saved` / `Committed` / `Voided`), ป้ายชนิดใบ (`Purchase Order` หรือ `Manual`) และข้อความ `Edition <n>` โดย `<n>` คือ `doc_version` ของใบ · ปุ่ม `Go back` ปรากฏที่มุมซ้ายของแถบ

---

## TC-GRN-020102 — แท็บสามอันของฟอร์ม และป้ายจำนวนบนแท็บ Extra Cost
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบรับสินค้าใบหนึ่ง; ใบนั้นมีรายการค่าใช้จ่ายเพิ่มเติมอย่างน้อย 1 รายการ (ถ้าไม่มี ให้ใช้ใบที่มี หรือ `test.skip`)
**Steps**
1. อ่านรายชื่อแท็บทั้งหมดใต้ส่วนหัวใบ
2. อ่าน badge ที่ติดอยู่บนแท็บ `Extra Cost`
**Expected**
มีแท็บสามอันพอดี: `Items`, `Extra Cost`, `Stock Movement` — **ต้องไม่มีแท็บ `Financial Summary`, `Comments`, `Attachments` หรือ `Activity Log`** · badge บนแท็บ `Extra Cost` แสดงตัวเลขเท่ากับจำนวนแถวในตารางของแท็บนั้น และต้องหายไปเมื่อจำนวนเป็น 0

---

## TC-GRN-020103 — โหมดอ่านแสดงเป็นข้อความ ไม่ใช่ช่องกรอกสีเทา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบรับสินค้าที่มีรายการสินค้าอย่างน้อย 1 แถว และยังไม่กด Edit
**Steps**
1. ดูช่องหัวใบ (`Vendor`, `GRN Date`, `Invoice No.`, `Invoice Date`, `Due Date`, `Description`)
2. ดูเซลล์ `Location`, `Product`, `Received`, `Unit Price` ของแถวแรกในตารางสินค้า
**Expected**
ช่องหัวใบทุกช่องอยู่ในสถานะ disabled (แก้ไม่ได้) · เซลล์ `Received` และ `Unit Price` ของตารางสินค้า **ไม่มี `<input>` อยู่ข้างใน** — เป็นข้อความอย่างเดียว (จำนวนตามด้วยชื่อหน่วย, ราคาเป็นตัวเลขจัดรูปสกุลเงิน) · คอลัมน์ขวาสุดของแถวเป็นปุ่มที่ `aria-label` = `Source documents` ไม่ใช่ปุ่มลบ

---

## TC-GRN-020104 — ปุ่ม Edit โผล่เฉพาะใบที่ยังเป็นร่าง
**Priority:** High · **Test Type:** Functional
**Preconditions**
BU มีใบสถานะ `draft` อย่างน้อยหนึ่งใบ และใบสถานะ `saved` หรือ `committed` หรือ `voided` อีกอย่างน้อยหนึ่งใบ (ไม่มีให้ `test.skip` พร้อมระบุสถานะที่ขาด)
**Steps**
1. เปิดใบสถานะ `Draft` แล้วดูแถบปุ่มบนหัวใบ
2. กลับหน้ารายการ เปิดใบสถานะ `Saved` (หรือ `Committed` / `Voided`) แล้วดูแถบปุ่มเดิม
**Expected**
ใบ `Draft` มีปุ่ม `Edit` อยู่บนหัวใบ · ใบที่พ้นขั้นร่างแล้วไม่มีปุ่ม `Edit` ให้เห็นเลย (ซ่อน ไม่ใช่ disable) แต่ยังมีปุ่ม `More` (⋯) อยู่ทั้งสองกรณี

---

## TC-GRN-020105 — เปิด URL ของ id ที่ไม่มีอยู่ ขึ้นข้อความไม่พบเอกสาร
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login เป็น `purchase@blueledgers.com`
**Steps**
1. เปิด `/procurement/goods-receive-note/00000000-0000-0000-0000-000000000000` ตรง ๆ
2. รอให้ skeleton ของฟอร์มหายไป
**Expected**
หน้าแสดงสถานะข้อผิดพลาดพร้อมข้อความ `Goods receive note not found` และปุ่มกลับที่พาไป `/procurement/goods-receive-note` — **ต้องไม่ใช่** ฟอร์มเปล่าและต้องไม่ใช่หน้าขาว

---

## Section 04 — แก้ไข / บันทึกหัวใบ

## TC-GRN-040101 — เข้าโหมดแก้ไขแล้วแถบปุ่มเปลี่ยนทั้งชุด
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบสถานะ `Draft` ด้วย `purchase@blueledgers.com`
**Steps**
1. กดปุ่ม `Edit` บนหัวใบ
2. อ่านแถบปุ่มบนหัวใบอีกครั้ง
**Expected**
ปุ่ม `Edit` หายไป และแทนที่ด้วยชุดปุ่ม `Cancel`, `Save Draft`, `Save`, `Delete` ครบทั้งสี่ (ปุ่มที่สามอ่านว่า `Save` เพราะเป็นใบที่มีอยู่แล้ว — ใบใหม่ที่ `/new` ปุ่มเดียวกันอ่านว่า `Create`) · ช่อง `Invoice No.` ในหัวใบกลายเป็นแก้ไขได้ และคอลัมน์ `Received` ของตารางสินค้ากลายเป็น `<input>`

---

## TC-GRN-040102 — Invoice Date เป็นฟิลด์บังคับ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ที่มีรายการสินค้าครบถ้วนแล้ว
**Steps**
1. ล้างค่าในช่อง `Invoice Date`
2. กดปุ่ม `Save`
**Expected**
ใต้ช่อง `Invoice Date` แสดงข้อความ `Invoice Date is required` และ **ไม่มี toast `Goods Receive Note updated successfully`** ขึ้น · หน้าจอยังอยู่ที่ฟอร์ม ไม่เด้งกลับหน้ารายการ

---

## TC-GRN-040103 — Due Date เลือกก่อนวันที่ใบแจ้งหนี้ไม่ได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft`; ช่อง `Invoice Date` มีค่าเป็นวันที่หนึ่ง (ตั้งเป็นวันปัจจุบันถ้ายังว่าง)
**Steps**
1. เปิดปฏิทินของช่อง `Due Date`
2. พยายามเลือกวันที่ก่อนหน้าค่าใน `Invoice Date`
**Expected**
วันก่อนหน้า `Invoice Date` ในปฏิทินอยู่ในสถานะเลือกไม่ได้ (disabled) และค่าของ `Due Date` ไม่เปลี่ยนหลังคลิก — ปฏิทินถูกจำกัดด้วย `fromDate = invoice_date`

---

## TC-GRN-040104 — เลือกเทอมเครดิตแล้ว Due Date คำนวณให้เอง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft`; ระบบมีเทอมเครดิตที่จำนวนวันมากกว่า 0 อย่างน้อยหนึ่งรายการ
**Steps**
1. ตั้ง `Invoice Date` เป็นวันที่ที่รู้ค่าแน่นอน (เช่นวันที่ 1 ของเดือนปัจจุบัน)
2. เลือก `Credit Term` ที่มีจำนวนวัน `N` วัน
3. อ่านค่าในช่อง `Due Date`
**Expected**
`Due Date` ถูกเขียนทับเป็น `Invoice Date + N วัน` ทันทีโดยผู้ใช้ไม่ต้องแตะช่องนั้น · จากนั้นแก้ `Due Date` เองเป็นวันอื่นที่ไม่ก่อน `Invoice Date` ได้ (ค่าที่เลือกเองไม่ถูกเขียนทับจนกว่าจะเปลี่ยนเทอมเครดิตหรือวันที่ใบแจ้งหนี้อีกครั้ง)

---

## TC-GRN-040105 — ช่องผู้ขายล็อกเมื่อใบเป็นชนิดอิงใบสั่งซื้อ
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบสถานะ `Draft` ชนิด `Purchase Order` หนึ่งใบ และใบสถานะ `Draft` ชนิด `Manual` อีกหนึ่งใบ (ไม่มีให้สร้างใบ manual ใหม่ที่ `/procurement/goods-receive-note/new?doc_type=manual`)
**Steps**
1. เปิดใบชนิด `Purchase Order` แล้วกด `Edit` ดูช่อง `Vendor`
2. เปิดใบชนิด `Manual` แล้วกด `Edit` ดูช่อง `Vendor` ช่องเดียวกัน
**Expected**
ใบชนิด `Purchase Order` ช่อง `Vendor` อยู่ในสถานะ disabled แม้จะอยู่โหมดแก้ไข (ผู้ขายถูกกำหนดมาจากใบสั่งซื้อแล้ว) · ใบชนิด `Manual` ช่องเดียวกันกดเปิด lookup ได้และเลือกผู้ขายรายอื่นได้ · ทั้งสองกรณีป้ายของช่องมีเครื่องหมายบังคับ (required)

---

## TC-GRN-040106 — กด Cancel ขณะมีของค้าง ขึ้น dialog ยืนยันทิ้งงาน
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft`
**Steps**
1. แก้ค่าในช่อง `Description` ให้ต่างจากเดิม
2. กดปุ่ม `Cancel`
3. ใน dialog กดปุ่ม `Keep editing`
4. กด `Cancel` อีกครั้งแล้วกด `Discard`
**Expected**
ขั้นที่ 2 ขึ้น alert dialog หัวข้อ `Discard changes?` คำอธิบาย `You have unsaved changes that will be lost.` และปุ่มสองปุ่ม `Keep editing` / `Discard` · ขั้นที่ 3 dialog ปิด ฟอร์มยังอยู่โหมดแก้ไข และค่าใน `Description` ยังเป็นค่าที่เพิ่งพิมพ์ · ขั้นที่ 4 ฟอร์มกลับเข้าโหมดอ่าน และ `Description` กลับไปเป็นค่าเดิมก่อนแก้

---

## TC-GRN-040107 — ออกจากหน้าขณะมีของค้าง ถูก nav guard ดักไว้
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` และแก้ค่าอย่างน้อยหนึ่งช่องแล้ว
**Steps**
1. กดปุ่ม `Go back` ที่มุมซ้ายของหัวใบ (หรือกดปุ่ม back ของเบราว์เซอร์)
2. กด `Keep editing`
3. ทำซ้ำแล้วกด `Discard`
**Expected**
ขั้นที่ 1 URL ยังไม่เปลี่ยน และขึ้น alert dialog `Discard changes?` ชุดเดียวกับ `TC-GRN-040106` · ขั้นที่ 2 ยังอยู่หน้าเดิมพร้อมค่าที่แก้ค้างอยู่ · ขั้นที่ 3 ไปถึง `/procurement/goods-receive-note` · **หมายเหตุสำหรับคนเขียนสเปก:** ตอนอยู่โหมดอ่านหรือยังไม่ได้แก้อะไร ปุ่มเดิมต้องพากลับหน้ารายการทันทีโดยไม่มี dialog

---

## TC-GRN-040108 — Save Draft สำเร็จแล้วยังอยู่หน้าเดิม
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ที่ผ่าน validation ครบ (มีรายการสินค้าอย่างน้อย 1 แถวที่มีคลัง สินค้า จำนวนรับ > 0 และราคา > 0)
**Steps**
1. แก้ `Description` เป็นข้อความใหม่ที่ไม่ซ้ำใคร
2. กดปุ่ม `Save Draft`
**Expected**
ขึ้น toast `Goods Receive Note updated successfully` · **URL ไม่เปลี่ยน** (ยังอยู่ที่ `/procurement/goods-receive-note/<uuid>` เดิม) · ฟอร์มกลับเข้าโหมดอ่านและแสดง `Description` เป็นข้อความใหม่ · ป้ายสถานะบนหัวใบยังเป็น `Draft` และ `Edition` เพิ่มขึ้นหนึ่ง

---

## TC-GRN-040109 — Save สำเร็จแล้วกลับหน้ารายการ และใบเปลี่ยนเป็น Saved
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ที่ผ่าน validation ครบ (เคสนี้เปลี่ยนสถานะเอกสารจริง — ต้อง seed ใบร่างใหม่ทุกรอบ)
**Steps**
1. กดปุ่ม `Save`
2. รอ toast และการเปลี่ยนหน้า
**Expected**
ขึ้น toast `Goods Receive Note updated successfully` แล้ว URL เปลี่ยนเป็น `/procurement/goods-receive-note` (หน้ารายการ) · แถวของใบนั้นในตารางแสดงสถานะ `Saved` — **ไม่ใช่** `Draft` และไม่ใช่ `Committed`

---

## TC-GRN-040110 — ใบที่บันทึกแล้วไม่มีปุ่มแก้ไข/บันทึกอีก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีใบสถานะ `Saved` อย่างน้อยหนึ่งใบใน BU (ได้จาก `TC-GRN-040109` หรือ seed เอง)
**Steps**
1. เปิดใบสถานะ `Saved`
2. อ่านแถบปุ่มบนหัวใบและแถบท้ายหน้า
**Expected**
หัวใบไม่มีปุ่ม `Edit`, `Save`, `Save Draft` ให้เห็นเลย (ซ่อน ไม่ใช่ disable) · ยังมีปุ่ม `More` (⋯) และแถบท้ายหน้ายังมีปุ่ม `Commit` กับ `Void` (ใบที่บันทึกแล้วแต่ยังไม่ commit ยังเดินต่อได้)

---

## Section 05 — ลบใบ · สิทธิ์

## TC-GRN-050101 — ปุ่มลบบนหัวใบโผล่เฉพาะโหมดแก้ไขของใบที่มีอยู่จริง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น `purchase@blueledgers.com`; มีใบสถานะ `Draft` อย่างน้อย 1 ใบ
**Steps**
1. เปิดใบ `Draft` ในโหมดอ่าน แล้วมองหาปุ่ม `Delete` บนหัวใบ
2. กด `Edit` แล้วมองหาปุ่มเดิมอีกครั้ง
3. กดปุ่ม `Delete`
4. เปิด `/procurement/goods-receive-note/new?doc_type=manual` แล้วมองหาปุ่ม `Delete`
**Expected**
ขั้นที่ 1 ไม่มีปุ่ม `Delete` · ขั้นที่ 2 ปุ่ม `Delete` ปรากฏ · ขั้นที่ 3 ขึ้น dialog หัวข้อ `Delete Goods Receive Note` พร้อมข้อความ `Are you sure you want to delete goods receive note "<เลขที่ใบ>"? This action cannot be undone.` โดยเลขที่ใบตรงกับหัวเอกสาร · ขั้นที่ 4 ฟอร์มใบใหม่ไม่มีปุ่ม `Delete` เลย (ยังไม่มีเอกสารให้ลบ)

---

## TC-GRN-050102 — ลบใบสำเร็จแล้วกลับหน้ารายการพร้อม toast
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีใบสถานะ `Draft` ที่ seed ขึ้นมาสำหรับเคสนี้โดยเฉพาะ (เคสนี้ทำลายข้อมูล — ห้ามใช้ใบที่เคสอื่นพึ่งพา)
**Steps**
1. เปิดใบนั้น กด `Edit` แล้วกด `Delete`
2. ยืนยันใน dialog
3. กลับไปที่หน้ารายการแล้วค้นหาเลขที่ใบเดิม
**Expected**
ขึ้น toast `Goods Receive Note deleted successfully` แล้ว URL เปลี่ยนเป็น `/procurement/goods-receive-note` · การค้นหาเลขที่ใบเดิม (กด Enter ในช่องค้นหา) ได้ empty state `No data found` — ใบหายจากรายการจริง ไม่ใช่แค่ toast ขึ้น

---

## TC-GRN-050103 — ผู้ใช้ที่ไม่มีสิทธิ์ลบกดปุ่มลบแล้วขึ้น dialog ปฏิเสธสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น `requestor@blueledgers.com` (ไม่มี `procurement.goods_received_note.delete` และไม่ใช่ admin ของ BU `BLAVG`); มีใบอย่างน้อย 1 ใบในรายการ
**Steps**
1. ไปที่ `/procurement/goods-receive-note`
2. เปิดเมนู ⋯ (`aria-label` = `Row actions`) ของแถวแรก
3. กดเมนู `Delete`
**Expected**
เมนู `Delete` ยังแสดงอยู่แต่ถูกทำจาง (`aria-disabled="true"`) และ **การกดไม่เปิด dialog ยืนยันลบ** แต่เปิด alert dialog หัวข้อ `Permission Denied` พร้อมข้อความ `You don't have permission to perform this action.` และคำแนะนำ `Contact your administrator to request access.` · ใบยังอยู่ในรายการหลังปิด dialog
**Note**
ถ้า `requestor` ถูกตั้งเป็น admin ของ BU เมื่อไร เคสนี้จะกลายเป็นไม่มีความหมาย — เขียนสเปกให้ยืนยัน precondition ด้วยการอ่าน `system_level` ของ BU จาก `/profile` ก่อน แล้ว `test.skip` ถ้าเป็น admin

---

## Section 07 — รายการสินค้า · การรับของ

## TC-GRN-070101 — ปุ่มเพิ่มรายการต่างกันตามชนิดใบ และปิดจนกว่าจะมีผู้ขาย
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น `purchase@blueledgers.com`
**Steps**
1. เปิด `/procurement/goods-receive-note/new?doc_type=manual` แล้วดูปุ่มมุมขวาบนของตารางสินค้า
2. เปิดใบชนิด `Purchase Order` ที่ยังไม่ได้เลือกผู้ขาย (หรือ `/procurement/goods-receive-note/new` โดยไม่ส่ง `doc_type`) แล้วดูปุ่มเดียวกัน
3. เลือกผู้ขายที่หัวใบ แล้วดูปุ่มอีกครั้ง
**Expected**
ขั้นที่ 1 ปุ่มอ่านว่า `Add Item` และกดได้ทันที · ขั้นที่ 2 ปุ่มอ่านว่า `Add from PO` และอยู่ในสถานะ disabled (ยังไม่มี `vendor_id`) · ขั้นที่ 3 ปุ่มเดิมกดได้ · เมื่อใบมีรายการแล้วอย่างน้อยหนึ่งแถว ปุ่มเปลี่ยนข้อความเป็น `Add more PO`

---

## TC-GRN-070102 — ตารางสินค้าว่างแสดง empty state ของตัวเอง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิด `/procurement/goods-receive-note/new?doc_type=manual` (ฟอร์มใหม่ยังไม่มีแถวใด)
**Steps**
1. ดูพื้นที่ตารางสินค้าในแท็บ `Items`
**Expected**
แสดง empty state หัวข้อ `No Items Yet` และคำอธิบาย `Add items to this goods receive note.` — **ต้องไม่ใช่** ข้อความกลาง `No data found` และต้องไม่มีแถวข้อมูลใด ๆ ใน `tbody`

---

## TC-GRN-070103 — แถวใหม่ขึ้นบนสุดและสืบทอดคลังจากแถวก่อนหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/new?doc_type=manual` และกรอกแถวแรกไปแล้วหนึ่งแถวโดยเลือกคลัง `L1` ไว้
**Steps**
1. กดปุ่ม `Add Item`
2. อ่านคอลัมน์ `#` และคอลัมน์ `Location` ของแถวบนสุด
**Expected**
แถวใหม่อยู่ **บนสุด** (แถวที่เลขลำดับ `1`) และแถวที่กรอกไว้ก่อนเลื่อนลงไปเป็นลำดับ `2` · คอลัมน์ `Location` ของแถวใหม่ถูกเติมด้วยคลัง `L1` มาให้แล้ว (ทั้งชื่อและรหัสคลังตรงกับแถวที่สืบทอดมา) ส่วนช่องสินค้า/จำนวน/ราคายังว่าง

---

## TC-GRN-070104 — แถวกรอกเอง: เลือกคลังก่อน และเปลี่ยนคลังแล้วสินค้าถูกล้าง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/goods-receive-note/new?doc_type=manual` และมีแถวเปล่าอยู่หนึ่งแถว; ผู้ใช้มีคลังที่เข้าถึงได้อย่างน้อยสองคลังที่มีสินค้า
**Steps**
1. เปิด lookup ของคอลัมน์ `Product` ทั้งที่ยังไม่ได้เลือกคลัง
2. เลือกคลัง `L1` ในคอลัมน์ `Location`
3. เลือกสินค้าหนึ่งตัวในคอลัมน์ `Product`
4. เปลี่ยนคลังของแถวเดิมเป็น `L2`
**Expected**
ขั้นที่ 1 รายการสินค้าไม่มีตัวเลือกให้เลือก (lookup ต้องรู้คลังก่อน) · ขั้นที่ 2 ทันทีที่เลือกคลังเสร็จ lookup ของสินค้าถูกเปิดให้เอง · ขั้นที่ 4 ช่อง `Product` ของแถวนั้น **ถูกล้างกลับเป็นว่าง** (ทั้งชื่อหลักและชื่อท้องถิ่นใต้ชื่อ) เพราะสินค้าเดิมอาจไม่มีใน `L2`

---

## TC-GRN-070105 — กด Enter ที่ช่องราคาไปช่องจำนวนรับ ไม่ใช่ส่งฟอร์ม
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไข/เพิ่มของใบที่มีแถวสินค้าที่เลือกคลังและสินค้าแล้วอย่างน้อยหนึ่งแถว
**Steps**
1. คลิกที่ช่อง `Unit Price` ของแถวนั้น พิมพ์ราคา
2. กด `Enter`
**Expected**
โฟกัสย้ายไปที่ช่อง `Received` ของแถวเดียวกัน · **ฟอร์มไม่ถูก submit** — ไม่มี toast บันทึกสำเร็จและไม่มี toast `... items are still incomplete` ขึ้น และ URL ไม่เปลี่ยน

---

## TC-GRN-070106 — แถวที่มาจากใบสั่งซื้อ: คลังกับสินค้าล็อก จำนวน/ราคาแก้ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบ `Draft` ชนิด `Purchase Order` ที่มีรายการมาจากใบสั่งซื้อแล้วอย่างน้อยหนึ่งแถว แล้วกด `Edit`
**Steps**
1. อ่านหัวคอลัมน์ทั้งหมดของตารางสินค้า
2. พยายามเปิด lookup ของคอลัมน์ `Location` และ `Product` ของแถวที่มาจาก PO
3. แก้ค่าในช่อง `Received` และ `Unit Price` ของแถวเดียวกัน
**Expected**
ขั้นที่ 1 มีคอลัมน์ `Order` อยู่ด้วย (`#`, `Location`, `Product`, `Order`, `Received`, `FOC`, `Unit Price`, `Subtotal`, `Discount`, `Net`, `Tax`, `Total`) — คอลัมน์ `Order` นี้ **ต้องไม่มี** ในใบชนิด `Manual` · ขั้นที่ 2 ทั้งสองช่องแก้ไม่ได้ (คลังถูกกำหนดจาก PO แล้ว และ `Product` แสดงเป็นข้อความ) และช่องของคอลัมน์ `Order` ก็แก้ไม่ได้ · ขั้นที่ 3 ทั้ง `Received` และ `Unit Price` แก้ได้และยอด `Subtotal` ของแถวขยับตาม

---

## TC-GRN-070107 — จำนวนรับต้องมากกว่าศูนย์
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ที่มีแถวสินค้าซึ่งเลือกคลัง สินค้า และหน่วยครบแล้ว
**Steps**
1. ตั้งค่าช่อง `Received` ของแถวนั้นเป็น `0`
2. กดปุ่ม `Save`
**Expected**
ช่อง `Received` ของแถวนั้นถูกทำเครื่องหมายผิดพลาดพร้อมข้อความ `Received Qty must be greater than 0` และขึ้น toast `1 item is still incomplete` (รูปพหูพจน์เปลี่ยนตามจำนวนแถวที่ผิด) · ใบไม่ถูกบันทึก
**Note**
เกณฑ์คือ `> 0` ไม่ใช่ `>= 1` — ของชั่งน้ำหนักรับเป็นเศษได้ · ตั้ง `0.5` แล้วต้อง **ผ่าน** ใช้เป็นด้านบวกของเคสนี้ได้

---

## TC-GRN-070108 — มีจำนวนรับแล้วต้องมีราคาต่อหน่วย
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ที่มีแถวสินค้าซึ่งเลือกคลัง สินค้า และหน่วยครบแล้ว
**Steps**
1. ตั้ง `Received` ของแถวนั้นเป็นค่ามากกว่า 0 (เช่น `2`)
2. ล้างช่อง `Unit Price` ให้เป็น `0`
3. กดปุ่ม `Save`
**Expected**
ช่อง `Unit Price` ของแถวนั้นแสดงข้อความ `Unit Price is required` (ไอคอนผิดพลาดอยู่ทางซ้ายของตัวเลข) และใบไม่ถูกบันทึก · เมื่อใส่ราคามากกว่า 0 แล้วกด Save อีกครั้ง ข้อความหายไปและบันทึกผ่าน

---

## TC-GRN-070109 — รับเกินจำนวนที่สั่งขึ้นคำเตือน แต่ไม่บล็อก
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของใบ `Draft` ชนิด `Purchase Order` ที่มีแถวจาก PO อย่างน้อยหนึ่งแถว และ **หน่วยที่รับตรงกับหน่วยที่สั่ง**
**Steps**
1. อ่านค่าในคอลัมน์ `Order` ของแถวนั้น สมมติได้ `N`
2. ตั้งค่าช่อง `Received` เป็นค่ามากกว่า `N` (เช่น `N + 1`)
**Expected**
ใต้ช่อง `Received` ขึ้นข้อความเตือนสีเตือน `Received exceeds ordered (N)` โดย `N` ตรงกับค่าที่อ่านจากคอลัมน์ `Order` · ข้อความนี้เป็นคำเตือนอย่างเดียว — ปุ่ม `Save` ยัง **ไม่ถูก disable** และการกดบันทึกไม่ถูกบล็อกด้วยข้อความนี้ · เมื่อตั้งกลับเป็น `N` พอดีหรือน้อยกว่า คำเตือนหายไป
**Note**
คำเตือนโผล่เฉพาะเมื่อหน่วยรับ = หน่วยสั่ง (คนละหน่วยเทียบตรง ๆ ไม่ได้) และโผล่เฉพาะโหมดแก้ไข

---

## TC-GRN-070110 — dialog เพิ่มใบสั่งซื้อ: หัวข้อ ปุ่ม Confirm และใบที่หยิบไปแล้ว
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไข/เพิ่มของใบชนิด `Purchase Order` ที่เลือกผู้ขายแล้ว; ผู้ขายรายนั้นมีใบสั่งซื้อที่อนุมัติแล้วและยังรับของไม่ครบ (`grn_status` = `open` หรือ `partial`) อย่างน้อยสองใบใน BU `BLAVG`
**Steps**
1. กดปุ่ม `Add from PO`
2. อ่านหัวข้อและคำอธิบายของ dialog แล้วดูปุ่มมุมขวาล่างทั้งที่ยังไม่ติ๊กอะไร
3. ติ๊กหัวใบสั่งซื้อใบหนึ่ง แล้วกด `Confirm`
4. กดปุ่ม `Add more PO` เพื่อเปิด dialog อีกครั้ง
**Expected**
ขั้นที่ 2 dialog มีหัวข้อ `Select Purchase Orders` คำอธิบาย `Select one or more purchase orders to receive.` แถวบนสุดเป็น `Select all` พร้อมข้อความ `{n} PO(s) · {m} items` และปุ่ม `Confirm` อยู่ในสถานะ **disabled** · ขั้นที่ 3 ป้าย `{count} selected` ปรากฏที่แถว Select all, ปุ่ม `Confirm` กดได้, dialog ปิด และตารางสินค้ามีแถวเพิ่มขึ้นตามจำนวนบรรทัดของใบที่ติ๊ก · ขั้นที่ 4 ใบสั่งซื้อที่หยิบไปแล้ว **ไม่ปรากฏ** ในรายการของ dialog รอบนี้

---

## TC-GRN-070111 — หยิบใบสั่งซื้อคนละสกุลเงินกับใบรับสินค้า ถูกปฏิเสธพร้อมชื่อสกุลเงิน
**Priority:** High · **Test Type:** Validation
**Preconditions**
ใบรับสินค้าที่กำลังกรอกตั้งสกุลเงินไว้แล้ว (เช่น `THB`); ผู้ขายรายเดียวกันมีใบสั่งซื้อที่อยู่คนละสกุลเงินกับใบนี้อย่างน้อยหนึ่งใบ (ถ้าไม่มีข้อมูลให้ `test.skip` พร้อมเหตุผล)
**Steps**
1. กด `Add from PO`
2. ติ๊กใบสั่งซื้อที่สกุลเงินไม่ตรงกับใบรับสินค้า
3. กด `Confirm`
**Expected**
ขึ้น toast ชนิดคำเตือนข้อความ `Selected POs use a different currency from this goods receive note (THB). Please select POs in THB.` โดยรหัสสกุลเงินในวงเล็บตรงกับที่ตั้งไว้ที่หัวใบ · **dialog ไม่ปิด** และตารางสินค้าไม่มีแถวเพิ่ม
**Note**
ถ้าใบยังไม่ได้ตั้งสกุลเงินเลย ระบบจะเทียบกันเองในชุดที่ติ๊ก แล้วข้อความเปลี่ยนเป็น `Selected POs use different currencies. Please select POs with the same currency.` — เป็นข้อความที่ `TC-GRN-040002` เคลม ID ไว้แล้ว อย่าเขียนซ้ำ

---

## TC-GRN-070112 — ใบสั่งซื้อหนึ่งบรรทัดที่กระจายหลายคลังกลายเป็นหลายแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
ผู้ขายรายหนึ่งมีใบสั่งซื้อที่มีบรรทัดสินค้าซึ่งกระจายเข้ามากกว่าหนึ่งคลัง (ถ้าไม่มีข้อมูลให้ `test.skip`)
**Steps**
1. เปิด dialog `Add from PO` แล้วสังเกตแถวคลังที่แสดงใต้บรรทัดสินค้านั้น (นับได้ `k` คลัง)
2. ติ๊กบรรทัดสินค้านั้นแล้วกด `Confirm`
3. นับแถวในตารางสินค้าที่ชื่อสินค้าตรงกัน
**Expected**
ตารางสินค้ามีแถวของสินค้านั้น **`k` แถว** (แถวละคลัง) ไม่ใช่แถวเดียว · แต่ละแถวมีคลังคนละอันตรงกับที่แสดงใน dialog และช่อง `Received` ถูกเติมด้วยจำนวนคงเหลือของคลังนั้น · ทุกแถวมี `Unit Price` เท่ากันเท่ากับราคาของบรรทัดใน PO · คลังที่หลังบ้านส่ง `can_use: false` มาต้องไม่กลายเป็นแถว

---

## Section 09 — ลบแถวสินค้า

## TC-GRN-090101 — ข้อความยืนยันลบแถวบอกทั้งสินค้าและคลัง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของใบที่มีแถวสินค้าที่เลือกทั้งสินค้าและคลังแล้ว อย่างน้อยหนึ่งแถว และมีแถวเปล่าที่ยังไม่เลือกสินค้าอีกหนึ่งแถว
**Steps**
1. กดปุ่มถังขยะ (`aria-label` = `Remove this line`) ของแถวที่กรอกครบ
2. อ่านหัวข้อและคำอธิบายของ dialog แล้วยืนยัน
3. กดปุ่มถังขยะของแถวเปล่าแล้วอ่านคำอธิบายอีกครั้ง
**Expected**
ขั้นที่ 2 dialog หัวข้อ `Remove Item` คำอธิบาย `Remove "<ชื่อสินค้า>" at <ชื่อคลัง> from this receipt?` โดยชื่อสินค้าและชื่อคลังตรงกับที่แสดงในแถว · ยืนยันแล้วแถวหายจากตารางและเลขลำดับของแถวที่เหลือถูกไล่ใหม่ · ขั้นที่ 3 คำอธิบายใช้คำว่า `line #<n>` แทนชื่อสินค้า (เช่น `Remove "line #2" from this receipt?`)

---

## TC-GRN-090102 — ปุ่มลบแถวมีเฉพาะโหมดแก้ไข โหมดอ่านเป็นปุ่มเอกสารต้นทาง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบที่มีรายการสินค้าอย่างน้อยหนึ่งแถว
**Steps**
1. ในโหมดอ่าน อ่าน `aria-label` และ tooltip ของปุ่มในคอลัมน์ขวาสุดของแถวแรก
2. กด `Edit` แล้วอ่านปุ่มในคอลัมน์เดียวกันอีกครั้ง
**Expected**
โหมดอ่าน: ปุ่มมี `aria-label` = `Source documents` และ tooltip อ่านว่า `Source documents for this line are not available yet` · โหมดแก้ไข: ปุ่มเดียวกันเปลี่ยนเป็น `aria-label` = `Remove this line` ที่กดแล้วเปิด dialog ลบแถว · ทั้งสองโหมดมีปุ่มเพียงปุ่มเดียวในเซลล์นั้น ไม่ใช่สองปุ่มพร้อมกัน

---

## Section 10 — ค่าใช้จ่ายเพิ่มเติม (Extra Cost)

## TC-GRN-100101 — แท็บ Extra Cost ว่างแสดง empty state พร้อมปุ่มเพิ่ม
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไข/เพิ่มของใบที่ยังไม่มีรายการค่าใช้จ่ายเพิ่มเติม
**Steps**
1. กดแท็บ `Extra Cost`
**Expected**
แสดง empty state หัวข้อ `No Extra Costs` คำอธิบาย `Add extra costs if applicable.` และมีปุ่ม `Add Cost` อยู่ **สองที่**: ที่มุมขวาของหัวข้อ `Extra Cost Details` และในตัว empty state เอง · ในโหมดอ่าน ปุ่ม `Add Cost` ทั้งสองต้องไม่ปรากฏ

---

## TC-GRN-100102 — ป้ายจำนวนบนแท็บ Extra Cost ขยับตามรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไข/เพิ่มของใบที่ยังไม่มีรายการค่าใช้จ่ายเพิ่มเติม
**Steps**
1. อ่านแท็บ `Extra Cost` (ยังไม่มี badge)
2. กด `Add Cost` หนึ่งครั้ง แล้วอ่าน badge
3. กด `Add Cost` อีกครั้ง แล้วอ่าน badge
4. ลบรายการทั้งสองออก
**Expected**
badge ไม่ปรากฏในขั้นที่ 1 · แสดง `1` ในขั้นที่ 2 และ `2` ในขั้นที่ 3 · กลับไปไม่มี badge เมื่อลบครบในขั้นที่ 4 · แถวใหม่ถูกเพิ่มไว้ **บนสุด** ของตาราง

---

## TC-GRN-100103 — วิธีปันส่วนมีสองแบบ และช่องจำนวนเงินต่อท้ายด้วยสกุลเงินของใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในแท็บ `Extra Cost` โหมดแก้ไขของใบที่ตั้งสกุลเงินไว้แล้ว (เช่น `THB`) และมีรายการค่าใช้จ่ายเพิ่มเติมอย่างน้อยหนึ่งแถว
**Steps**
1. เปิด dropdown `Type` ที่อยู่เหนือหัวข้อ `Extra Cost Details` แล้วอ่านตัวเลือก
2. อ่านส่วนต่อท้าย (suffix) ของช่อง `Amount` ในแถว
3. กด `Save` โดยยังไม่เลือกชนิดค่าใช้จ่ายของแถว
**Expected**
ขั้นที่ 1 มีสองตัวเลือกพอดี: `By Quantity` และ `By Value` (ค่าเริ่มต้นคือ `By Quantity`) · ขั้นที่ 2 ช่อง `Amount` มีป้ายต่อท้ายเป็นรหัสสกุลเงินของใบ (`THB`) และป้ายนี้ต้องเปลี่ยนตามเมื่อเปลี่ยนสกุลเงินที่หัวใบ · ขั้นที่ 3 ขึ้นข้อความผิดพลาด `Extra Cost is required` ที่แถวนั้น และใบไม่ถูกบันทึก

---

## TC-GRN-100104 — ลบรายการค่าใช้จ่ายเพิ่มเติมต้องยืนยันก่อน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในแท็บ `Extra Cost` โหมดแก้ไข และมีรายการอย่างน้อยหนึ่งแถว
**Steps**
1. กดปุ่มถังขยะ (`aria-label` = `Remove`) ของแถวนั้น
2. ปิด dialog โดยไม่ยืนยัน แล้วนับแถว
3. กดถังขยะอีกครั้งแล้วยืนยัน
**Expected**
ขั้นที่ 1 ขึ้น dialog หัวข้อ `Remove Extra Cost` คำอธิบาย `Are you sure you want to remove this extra cost item?` · ขั้นที่ 2 จำนวนแถวไม่เปลี่ยนและ badge บนแท็บไม่เปลี่ยน · ขั้นที่ 3 แถวหายไปและ badge ลดลงหนึ่ง

---

## Section 11 — Commit

## TC-GRN-110101 — ปุ่ม Commit/Void อยู่ที่แถบสรุป และโผล่ตามเงื่อนไขของใบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบสถานะ `Draft` (หรือ `Saved`) ที่มีรายการสินค้าอย่างน้อยหนึ่งแถว
**Steps**
1. เปิดใบนั้นในโหมดอ่าน แล้วหาปุ่ม `Commit` และ `Void`
2. กด `Edit` แล้วหาปุ่มสองตัวเดิมอีกครั้ง
3. เปิด `/procurement/goods-receive-note/new?doc_type=manual` แล้วหาปุ่มสองตัวเดิม
**Expected**
ขั้นที่ 1 ปุ่ม `Commit` และ `Void` อยู่ที่ **แถบสรุปท้ายหน้า แถวเดียวกับยอด Grand Total** ไม่ใช่บนหัวใบ · ขั้นที่ 2 ปุ่มทั้งสองหายไปขณะอยู่โหมดแก้ไข · ขั้นที่ 3 ฟอร์มใบใหม่ไม่มีปุ่มทั้งสอง

---

## TC-GRN-110102 — dialog ยืนยัน Commit เตือนว่าสต๊อกจะขยับและย้อนไม่ได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบสถานะ `Draft` หรือ `Saved` ในโหมดอ่าน ที่มีรายการสินค้า
**Steps**
1. กดปุ่ม `Commit` ที่แถบสรุป
2. อ่านหัวข้อและคำอธิบายของ dialog
3. ปิด dialog โดยไม่ยืนยัน
**Expected**
dialog หัวข้อ `Commit Goods Receive Note` คำอธิบาย `Are you sure you want to commit goods receive note "<เลขที่ใบ>"? Stock will be updated and this action cannot be undone.` โดยเลขที่ใบตรงกับหัวเอกสาร และปุ่มยืนยันอ่านว่า `Commit` · หลังปิดโดยไม่ยืนยัน ป้ายสถานะบนหัวใบยังเป็นค่าเดิม (ไม่ใช่ `Committed`)

---

## TC-GRN-110103 — Commit สำเร็จใช้ข้อความเฉพาะของมัน ไม่ใช่ข้อความบันทึกทั่วไป
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีใบสถานะ `Draft`/`Saved` ที่ seed ขึ้นมาสำหรับเคสนี้โดยเฉพาะ — **commit ย้อนกลับไม่ได้** ห้ามใช้ใบที่เคสอื่นพึ่งพา
**Steps**
1. เปิดใบนั้นแล้วกด `Commit` → ยืนยันใน dialog
2. อ่าน toast และป้ายสถานะบนหัวใบ
**Expected**
toast อ่านว่า `Goods receive note committed — stock updated` — **ต้องไม่ใช่** `Goods Receive Note updated successfully` (ข้อความเดียวกับการกดบันทึกเฉย ๆ ซึ่งแยกไม่ออกว่าของเข้าสต๊อกหรือยัง) · dialog ปิดเอง และป้ายสถานะบนหัวใบเปลี่ยนเป็น `Committed`

---

## TC-GRN-110104 — ใบที่ commit แล้วไม่มีปุ่มแก้ไข/commit/void อีก
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีใบสถานะ `Committed` อย่างน้อยหนึ่งใบ (ได้จาก `TC-GRN-110103` หรือ seed เอง)
**Steps**
1. เปิดใบสถานะ `Committed`
2. ดูแถบปุ่มบนหัวใบและแถบสรุปท้ายหน้า
**Expected**
ไม่มีปุ่ม `Edit` บนหัวใบ และ **ไม่มีทั้งปุ่ม `Commit` และ `Void`** ที่แถบสรุป · แถบสรุปยังแสดงยอดทั้งห้ารายการตามปกติ และปุ่ม `More` (⋯) ยังใช้ได้

---

## Section 12 — Void

## TC-GRN-120101 — Void สำเร็จแล้วใบเปลี่ยนสถานะพร้อม toast
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีใบสถานะ `Draft`/`Saved` ที่ seed ขึ้นมาสำหรับเคสนี้โดยเฉพาะ (void ย้อนกลับไม่ได้)
**Steps**
1. เปิดใบนั้นในโหมดอ่าน กดปุ่ม `Void` ที่แถบสรุป
2. อ่าน dialog แล้วกดปุ่มยืนยัน
**Expected**
dialog หัวข้อ `Void Goods Receive Note` คำอธิบาย `Are you sure you want to void goods receive note "<เลขที่ใบ>"? This action cannot be undone.` และปุ่มยืนยันอ่านว่า `Void` แบบ destructive (สีทำลาย) · หลังยืนยันขึ้น toast `Goods Receive Note voided successfully`, dialog ปิด และป้ายสถานะบนหัวใบเปลี่ยนเป็น `Voided`

---

## TC-GRN-120102 — ใบที่ถูกยกเลิกแล้วแก้ไขต่อไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบสถานะ `Voided` อย่างน้อยหนึ่งใบ
**Steps**
1. เปิดใบสถานะ `Voided`
2. ดูแถบปุ่มบนหัวใบและแถบสรุปท้ายหน้า
3. ตรวจแถวในหน้ารายการของใบเดียวกัน
**Expected**
ไม่มีปุ่ม `Edit` · ไม่มีปุ่ม `Commit` และ `Void` ที่แถบสรุป · ในหน้ารายการ คอลัมน์ `Status` ของใบนั้นอ่านว่า `Voided` และใบยังอยู่ในรายการ (void ไม่ใช่การลบ)

---

## Section 13 — ส่วนลด · ภาษี · ยอดรวม

## TC-GRN-130101 — แถบสรุปท้ายใบมีห้ายอดพร้อมรหัสสกุลเงิน
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดใบที่มีรายการสินค้าอย่างน้อยหนึ่งแถวและตั้งสกุลเงินไว้ (เช่น `THB`)
**Steps**
1. อ่านแถบสรุปท้ายหน้าทั้งแถว
**Expected**
แถบสรุปมีห้ารายการเรียงตามลำดับ: `Subtotal`, `Discount`, `Net`, `Tax`, `Grand Total` · `Grand Total` เน้นหนักกว่ารายการอื่นและมีรหัสสกุลเงินของใบ (`THB`) ต่อท้ายค่า · ทุกค่าเป็นตัวเลขจัดรูปแบบสกุลเงิน ไม่มี `NaN` หรือช่องว่าง

---

## TC-GRN-130102 — ใบที่ไม่มีรายการเลย ไม่มีแถบสรุป
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เปิด `/procurement/goods-receive-note/new?doc_type=manual` (ฟอร์มใหม่ที่ยังไม่มีแถวสินค้า)
**Steps**
1. มองหาแถบสรุปท้ายหน้า
2. กด `Add Item` เพื่อเพิ่มแถวหนึ่งแถว แล้วมองอีกครั้ง
**Expected**
ขั้นที่ 1 **ไม่มีแถบสรุปเลย** — ไม่มีข้อความ `Grand Total` บนหน้า · ขั้นที่ 2 แถบสรุปปรากฏขึ้น โดยทุกยอดเป็นศูนย์จัดรูปแบบสกุลเงิน (ไม่ใช่ค่าว่างและไม่ใช่ `NaN`)

---

## TC-GRN-130103 — Subtotal ของแถวเท่ากับราคาต่อหน่วยคูณจำนวนรับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไข/เพิ่มของใบที่มีแถวสินค้าที่กรอกคลังและสินค้าแล้ว และ **ยังไม่ตั้งส่วนลดหรือภาษี** ของแถวนั้น
**Steps**
1. ตั้ง `Unit Price` = `100` และ `Received` = `3`
2. อ่านค่าในคอลัมน์ `Subtotal`, `Net`, `Total` ของแถวเดียวกัน
3. เปลี่ยน `Received` เป็น `4` แล้วอ่านอีกครั้ง
**Expected**
ขั้นที่ 2 `Subtotal` = `300.00`, `Net` = `300.00`, `Total` = `300.00` (ไม่มีส่วนลดและภาษี) · ขั้นที่ 3 ทั้งสามค่าเปลี่ยนเป็น `400.00` โดยผู้ใช้ไม่ต้องกดอะไรเพิ่ม · ยอด `Subtotal` และ `Grand Total` ที่แถบสรุปท้ายหน้าขยับตามในจังหวะเดียวกัน

---

## TC-GRN-130104 — ใส่ส่วนลดเป็นเปอร์เซ็นต์แล้วยอดคำนวณเอง และถูกจำกัด 0–100
**Priority:** High · **Test Type:** Functional
**Preconditions**
ต่อจากสถานะของ `TC-GRN-130103` (แถวมี `Unit Price` = `100`, `Received` = `3`, `Subtotal` = `300.00`) และ checkbox กรอกยอดเองยังไม่ถูกติ๊ก
**Steps**
1. อ่านสถานะของช่องยอดเงินส่วนลด (`aria-label` = `Disc Amt`) ในคอลัมน์ `Discount`
2. กรอก `10` ในช่องเปอร์เซ็นต์ (`aria-label` = `Disc %`)
3. ลองกรอก `150` แล้วอ่านค่าที่ค้างในช่อง
**Expected**
ขั้นที่ 1 ช่อง `Disc Amt` อยู่ในสถานะ disabled (คำนวณให้) ส่วนช่อง `Disc %` กรอกได้ · ขั้นที่ 2 ช่อง `Disc Amt` แสดง `30.00` และคอลัมน์ `Net` ของแถวเปลี่ยนเป็น `270.00` · ขั้นที่ 3 ค่าในช่องถูกจำกัดไว้ที่ `100` (ไม่ใช่ `150`) และยอดส่วนลดเท่ากับ `Subtotal` พอดี

---

## TC-GRN-130105 — ติ๊กกรอกยอดส่วนลดเอง สลับช่องที่แก้ได้และตั้งต้นด้วยยอดที่คำนวณไว้
**Priority:** High · **Test Type:** Functional
**Preconditions**
ต่อจาก `TC-GRN-130104` — แถวมีส่วนลด `10%` และยอดส่วนลดที่คำนวณไว้ `30.00`
**Steps**
1. ติ๊ก checkbox ข้างช่องส่วนลด (`aria-label` = `Tick to enter the discount amount yourself instead of calculating from the rate`)
2. อ่านสถานะของช่อง `Disc %` และ `Disc Amt` และค่าที่อยู่ในช่องยอดเงิน
3. เปลี่ยนยอดเงินเป็น `50` แล้วอ่านคอลัมน์ `Net`
4. เอาติ๊กออก
**Expected**
ขั้นที่ 2 ช่อง `Disc %` กลายเป็น disabled และช่อง `Disc Amt` กรอกได้ โดยค่าใน `Disc Amt` ถูก **ตั้งต้นด้วย `30.00`** (ค่าที่คำนวณล่าสุด) ไม่ใช่ `0` · ขั้นที่ 3 `Net` เปลี่ยนเป็น `250.00` ตามยอดที่กรอกเอง โดยช่อง `%` ยังค้างที่ `10` และไม่ทำให้ยอดเปลี่ยน · ขั้นที่ 4 ช่องสลับสถานะกลับ และยอดส่วนลดกลับไปคำนวณจาก `%` เป็น `30.00`

---

## TC-GRN-130106 — เลือก Tax Profile แล้วยอดภาษีคิดจากยอดสุทธิ พร้อมแสดงอัตราใต้ช่อง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของแถวที่ `Net` = `300.00`; ระบบมี Tax Profile ที่อัตรา 7% อย่างน้อยหนึ่งรายการ
**Steps**
1. เลือก Tax Profile 7% ในคอลัมน์ `Tax`
2. อ่านช่องยอดภาษี (`aria-label` = `Tax Amt`), คอลัมน์ `Total` และข้อความเล็กใต้ช่องภาษี
3. ติ๊ก checkbox ข้างช่องภาษี (`aria-label` = `Tick to enter the tax amount yourself instead of calculating from the tax rate`) แล้วกรอกยอดภาษีเป็น `25`
**Expected**
ขั้นที่ 2 ช่อง `Tax Amt` อยู่ในสถานะ disabled และแสดง `21.00` (7% ของ `300.00`), คอลัมน์ `Total` ของแถวเป็น `321.00` และใต้ช่องภาษีมีข้อความเล็กอ่านว่า `7%` · ขั้นที่ 3 ช่อง `Tax Amt` กรอกได้ ค่าเริ่มต้นเป็น `21.00` แล้วเมื่อกรอก `25` คอลัมน์ `Total` เปลี่ยนเป็น `325.00`

---

## TC-GRN-130107 — ยอดรวมท้ายใบเท่ากับผลบวกของทุกแถว และส่วนลดแสดงเป็นค่าลบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในใบที่มีรายการสินค้าอย่างน้อยสองแถว โดยอย่างน้อยหนึ่งแถวมีส่วนลดมากกว่า 0
**Steps**
1. อ่านค่าคอลัมน์ `Discount`, `Net`, `Tax`, `Total` ของทุกแถว แล้วบวกเองเป็นชุด
2. เทียบกับ `Discount`, `Net`, `Tax`, `Grand Total` ที่แถบสรุปท้ายหน้า
3. อ่าน `Subtotal` ที่แถบสรุป
**Expected**
`Net`, `Tax`, `Grand Total` ที่แถบสรุปเท่ากับผลบวกของคอลัมน์ที่ตรงกันจากทุกแถว (ปัดสองตำแหน่ง) · `Discount` ที่แถบสรุปแสดงเป็น **`-<ยอด>`** พร้อมสีทำลาย เมื่อยอดส่วนลดรวมมากกว่า 0 และแสดงเป็น `0.00` แบบไม่มีเครื่องหมายเมื่อไม่มีส่วนลด · `Subtotal` ที่แถบสรุป = `Net รวม + Discount รวม`

---

## TC-GRN-130108 — โหมดอ่านแสดงส่วนลด/ภาษีเป็นยอดเงินกับอัตรา ไม่ใช่ช่องกรอก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบที่มีแถวซึ่งตั้งส่วนลดและ Tax Profile ไว้แล้ว ในโหมดอ่าน (ยังไม่กด Edit)
**Steps**
1. อ่านเซลล์คอลัมน์ `Discount` และ `Tax` ของแถวนั้น
**Expected**
ทั้งสองเซลล์ **ไม่มี `<input>` และไม่มี checkbox** อยู่ข้างใน — แสดงเป็นยอดเงินจัดรูปแบบสกุลเงินพร้อมอัตราเป็นเปอร์เซ็นต์กำกับอยู่บรรทัดล่าง (เช่น `30.00` / `10%`) และจะไม่แสดงบรรทัดเปอร์เซ็นต์เมื่ออัตราเป็น 0 · ความกว้างของสองคอลัมน์นี้ในโหมดอ่านแคบกว่าโหมดแก้ไข

---

## Section 14 — แท็บ Stock Movement

## TC-GRN-140101 — แท็บ Stock Movement แสดงข้อความคนละชุดตามสถานะของใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบสถานะ `Draft` (หรือ `Saved`) หนึ่งใบ และใบสถานะ `Committed` อีกหนึ่งใบ
**Steps**
1. เปิดใบที่ยัง **ไม่** committed แล้วกดแท็บ `Stock Movement`
2. เปิดใบที่ committed แล้วกดแท็บเดียวกัน
**Expected**
ขั้นที่ 1 แสดงข้อความ `Stock movement shows after this receipt is committed` · ขั้นที่ 2 แสดงข้อความ `Stock movement is not available yet` · **สองข้อความนี้สลับกันไม่ได้** — ใบที่ยังไม่ commit ต้องไม่แสดงข้อความ "ยังไม่พร้อม" ซึ่งชวนให้เข้าใจว่าของเข้าสต๊อกไปแล้ว
**Note**
ตารางการเคลื่อนไหวสต๊อกจริงยังรอ endpoint ฝั่ง backend — เคสนี้ยืนยัน **เกณฑ์การเปิดแท็บ** ซึ่งทำเสร็จแล้ว ไม่ใช่ยืนยันข้อมูลในตาราง

---

## Section 15 — ความเห็นและไฟล์แนบ

## TC-GRN-150101 — เปิดแผงความเห็นจากเมนู ⋯ และหัวข้อบอกจำนวน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดใบรับสินค้าใบใดใบหนึ่ง (ไม่ใช่ฟอร์ม `/new` — เมนู ⋯ มีเฉพาะใบที่มีอยู่จริง)
**Steps**
1. อ่านรายชื่อแท็บของฟอร์ม เพื่อยืนยันว่าไม่มีแท็บความเห็น
2. กดปุ่ม `More` (⋯) บนหัวใบ แล้วอ่านรายการเมนู
3. กดเมนู `Comment`
**Expected**
ขั้นที่ 1 ไม่มีแท็บชื่อ `Comments` หรือ `Attachments` · ขั้นที่ 2 เมนูมีรายการ `Comment` (ต่อท้ายด้วย `(n)` เมื่อมีความเห็นแล้ว), `Activity` และ `Print` (เฉพาะโหมดอ่าน) · ขั้นที่ 3 เปิด sheet ที่หัวข้ออ่านว่า `Comments (n)` โดย `n` ตรงกับตัวเลขในเมนู และมีช่องพิมพ์ที่ placeholder = `Add comment...` พร้อมปุ่ม `Attach file` / `Send comment` · ใบที่ยังไม่มีความเห็นแสดง `No Comments Yet` + `You haven't created any comments yet.`

---

## TC-GRN-150102 — ส่งความเห็นสำเร็จแล้วขึ้นในแผงและมีจุดแจ้งบนปุ่ม More
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
เปิดแผงความเห็นของใบที่ยังไม่มีความเห็น (หรือจดจำนวนเดิมไว้)
**Steps**
1. พิมพ์ข้อความที่ไม่ซ้ำใคร (เช่น `e2e-<uid>`) ลงช่องความเห็น
2. กดปุ่ม `Send comment`
3. ปิด sheet แล้วดูปุ่ม `More` บนหัวใบ
**Expected**
ขึ้น toast `Comment added` · ข้อความที่พิมพ์ปรากฏในรายการความเห็นในแผง และหัวข้อเปลี่ยนเป็น `Comments (n+1)` · หลังปิด sheet ปุ่ม `More` มีจุดกลมเล็กต่อท้ายข้อความ (ตัวบอกว่ามีความเห็นค้างอยู่) และเมนู `Comment` อ่านว่า `Comment (n+1)`
**Note**
ไฟล์แนบอยู่ในแผงนี้ (ปุ่ม `Attach file`) ไม่ใช่หน้าแยก — ไฟล์นอกชนิดที่อนุญาตขึ้น `"<ชื่อไฟล์>" — only images and documents are allowed` และไฟล์เกิน 10 MB ขึ้น `"<ชื่อไฟล์>" exceeds 10 MB limit` (`TC-GRN-160003`/`160004` เคลม ID หัวข้อนี้ไว้แล้ว แต่ body ไม่มี assertion — ถ้าจะทำให้มี oracle ควร **แก้สองเคสนั้น** ไม่ใช่ตั้ง ID ใหม่)

---

## Section 17 — Activity

## TC-GRN-170101 — เปิด Activity ได้ทั้งจากเมนู ⋯ บนหัวใบและเมนูของแถวในรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบรับสินค้าอย่างน้อย 1 ใบ; login เป็น `purchase@blueledgers.com`
**Steps**
1. เปิดใบนั้น กดปุ่ม `More` (⋯) → เมนู `Activity`
2. ปิด sheet แล้วกลับหน้ารายการ
3. เปิดเมนู ⋯ ของแถวเดียวกัน (`aria-label` = `Row actions`) → เมนู `Activity`
**Expected**
ทั้งสองทางเปิด sheet เดียวกันที่หัวข้ออ่านว่า `Activity` และคำอธิบาย `Everything done to this record, newest first` · ใบที่ยังไม่มีกิจกรรมแสดง `No activity recorded yet` ส่วนใบที่มีแสดงรายการเรียงใหม่→เก่า · **ไม่มีแท็บ `Activity Log` ในฟอร์ม** — ทั้งสองทางนี้เป็นทางเข้าเดียวที่มี

