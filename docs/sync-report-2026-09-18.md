# Sync report — e2e suite ↔ web app (2026-09-18)

Baseline sweep ของ suite ทั้งหมดเทียบกับแอปที่รันจริง (local frontend `:3000` +
backend `:4000`) เพื่อหาว่า test ตัวไหน "พัง" เพราะแอปเปลี่ยน และตัวไหนพังเพราะ
ตัวเทสต์เอง เอกสารนี้เป็นผลของ Phase 0–1 และเป็นบันทึก **behavior ที่แอปเปลี่ยน**
ตามข้อตกลง "ปรับ test ตามแอป + บันทึกไว้ให้ review"

## ผลรวม baseline

| | จำนวน |
|---|---|
| ผ่าน | 772 |
| ไม่ผ่าน | 200 |
| ข้าม (skip/fixme) | 310 |
| เวลารวม | ~2 ชม. 25 นาที (6 batch, `workers: 1`) |

ไฟล์ดิบ: `runs/baseline-2026-09-18/*.log` + `*.json`

## Spec ที่ล้มมากที่สุด

| spec | pass | fail | skip |
|---|---|---|---|
| `302-pr-creator-journey` | 11 | 29 | 2 |
| `402-po-purchaser-journey` | 6 | 23 | 3 |
| `304-pr-purchaser-journey` | 6 | 19 | 1 |
| `303-pr-approver-journey` | 9 | 18 | 1 |
| `403-po-approver-journey` | 1 | 17 | 1 |
| `044-eco` | 2 | 16 | 1 |
| `079-delivery-point` | 26 | 13 | 11 |
| `301-pr` | 38 | 13 | 81 |
| `311-pr-returned-flow` | 1 | 11 | 0 |
| `040-currency` | 9 | 8 | 2 |

## สาเหตุที่จัดกลุ่มได้

### B-1 — item row: ต้องเลือกสินค้าก่อนถึงจะกรอกจำนวนได้ (76 fails, 38% ของทั้งหมด)

`routes/procurement/purchase-request/pr-item-cells/requested-cell.tsx:30-49`

```tsx
const isFieldDisabled = isDisabled || isRowLocked || !productId;
if (isFieldDisabled) return <QtyUnitPlain … />;   // ไม่ render <input> เลย
```

แอปเพิ่มกฎ "กรอกจำนวนก่อนเลือกสินค้าไม่มีความหมาย" — input
`items.N.requested_qty` จะ**ไม่มีอยู่ใน DOM** จนกว่าจะเลือกสินค้าในแถวนั้นก่อน
เทสต์เดิมเพิ่มแถวแล้วกรอกจำนวนทันที จึงรอ locator ที่ไม่มีวันปรากฏ → timeout 10s
ต่อครั้ง กระทบ `301-pr`, `302/303/304`, `311`, `401/402/403`

**หมวด: (B) แอปเปลี่ยน behavior — ต้องปรับ test**
แก้โดยให้ helper เลือกสินค้าก่อนเสมอ แล้วค่อยกรอกจำนวน

### B-2 — ฟอร์มรายละเอียดมี view/edit mode (department + อีก 12 ฟอร์ม)

`hooks/use-entity-form.ts:58` → `isView = mode === "view"`

โหมด view ไม่ render input แต่แสดง `<FieldPlainText>` แทน หลัง `page.reload()`
หน้ารายละเอียดกลับเป็น view mode เสมอ — assertion ที่ยิงใส่ `#department-name`
จึงได้ `element(s) not found`, `#department-description` ได้ `""`,
`#department-is-active` ได้ `true` แทน `false`

ฟอร์มที่ใช้ hook นี้: department, location, vendor, price-list, product, recipe,
equipment, cuisine, role, notification-template, physical-count, rfp,
recipe-category

ฝั่ง e2e มีแค่ 3 page object ที่รู้จัก edit mode (`base.page.ts`,
`purchase-request.page.ts`, `page-form-crud.helper.ts`) — อีก 22 ตัวยังเขียนแบบ
สมมติว่า input อยู่ตลอดเวลา

**หมวด: (B) แอปเปลี่ยน behavior — ต้องปรับ page objects**

### B-3 — "Create from Template" เปลี่ยนจาก dialog เป็นหน้าเต็ม

`pr-create-dialog.tsx:58` — ปุ่ม From Template ทำ
`go("/procurement/purchase-request/from-template")` ไปหน้าใหม่ที่มี template card
เป็น `<button>` และ wizard 2 ขั้น (เลือก template → `qty-step.tsx`) ส่วนเทสต์
Step 3 ยังรอ `getByRole("dialog").or(getByRole("listbox"))` ตาม NOTE เดิมใน
`purchase-request.page.ts:452` ที่เขียนไว้ว่า "speculative — adjust once Step 3 UI
is confirmed" ตอนนี้ยืนยันแล้วว่าเป็นหน้า ไม่ใช่ dialog กระทบ TC-PR-050301..050304

### B-4 — test timeout 30s ไม่พออีกต่อไป

cascade ที่ยาวขึ้นทำให้การสร้าง PR หนึ่งใบผ่าน UI ใช้เวลา **~32 วินาที** (วัด
2026-09-18) ซึ่งเกิน default ของ Playwright ไปเล็กน้อย เทสต์ทั้งบล็อกจึงหมดเวลา
ตั้งแต่ขั้นเตรียมข้อมูล ไม่ใช่ที่ assertion ของตัวเอง — ตั้ง
`describe.configure({ timeout: 90_000 })` ให้ทุก describe ที่สร้าง PR เอง

### B-5 — `pr-description` เปลี่ยนจาก `<textarea>` เป็น `<input>`

`pr-general-fields.tsx:65` render `<Input id="pr-description">` แต่ page object
หาด้วย `textarea#pr-description` — แก้ให้ match ที่ id อย่างเดียว

### A-1 — route ย้ายโมดูล (31 tests)

| spec | path ใน spec | path จริงในแอป | ผล |
|---|---|---|---|
| `044-eco` | `/config/eco` | `/product-management/eco` | fail 16 |
| `043-certification` | `/config/certification` | `/vendor-management/certification` | skip 19 (`describe.fixme`) |

`043-certification` ถูกตั้ง `fixme` ไว้โดยเข้าใจว่าเป็น RBAC block — หลักฐานจาก
`routes/router.tsx` ชี้ว่าสาเหตุจริงคือ route ย้ายโมดูล ต้องแก้ path แล้วรันใหม่
เพื่อพิสูจน์ว่ายังมีปัญหา permission เหลืออยู่หรือไม่

**หมวด: (A) selector/path stale — แก้ค่าคงที่ตัวเดียวต่อ spec**

### A-2 — cluster ย่อยอื่น

| อาการ | spec | fails |
|---|---|---|
| ปุ่ม `add product` ไม่ปรากฏ | `160-pl-template` | 4 |
| row button ของ list ไม่ถูกพบ | `079-delivery-point` | ~9 |
| create toast ไม่ขึ้น → chain แตกทั้งสาย | `040-currency` | 5 |
| checkbox คลิกแล้วสถานะไม่เปลี่ยน | `150-vendor` | 2 |
| contact card locator ไม่พบ | `150-vendor` | 2 |

### A-3 — vendor: contact card หาไม่เจอ (ยังไม่สรุปสาเหตุ)

`tests/pages/vendor.page.ts:250` หา contact card ด้วย
`div.relative.rounded-xl.border` + filter ด้วย `input[name="vendor_contact.0.name"]`
TC-VEN-030005 และ TC-VEN-030011 ล้มที่ locator นี้

ตรวจ `vendor-contact.tsx` แล้วพบว่าคลาสทั้งสามยังอยู่ครบบน card จริง สาเหตุจึง
**ยังไม่ยืนยัน** — อาจเป็น input ที่ไม่ถูก render (การ์ดมี `isView` ของตัวเอง:
`isView = isDisabled && !isSubmitting`) หรือปุ่ม "add contact" ที่ไม่ทำงาน
ต้อง probe หน้าจริงก่อนแก้

อาการอื่นในไฟล์เดียวกัน: ตัวเลือก status filter (`option` ชื่อ active/inactive/all)
ไม่ปรากฏ และแถวของ vendor ที่เพิ่งสร้างหาไม่พบ

### A-4 — ปุ่ม/คอนโทรลที่หายไปจาก UI (pl-template, campaign)

| locator ที่รอ | spec | fails |
|---|---|---|
| `button` ชื่อ `/add product/i` | `160-pl-template` | 3 |
| `aside` > `combobox` | `160-pl-template` | 1 |
| `button` ชื่อ `/add request\|create new campaign\|^add$/i` | `1001-campaign` | 1 |

ยังไม่ยืนยันว่าเป็นการเปลี่ยนชื่อปุ่ม ย้ายตำแหน่ง หรือถอดออก — ต้อง probe UI จริง

### D-1 — certification: backend ปฏิเสธทุก write (400 metadata field is required)

ดูรายละเอียดในหัวข้อ A-1 — `certification-dialog.tsx` ยังส่ง payload แบบ flat
เทสต์ที่เป็น write 9 ตัวถูกตั้ง `test.fixme` ไว้ ไม่ได้แก้ให้ผ่าน

### D-2 — vendor: ติ๊ก Primary บน contact card แล้วสถานะไม่เปลี่ยน

`vendor-contact.tsx:139` อ่านค่าด้วย `form.getValues("vendor_contact.N")` ซึ่งเป็น
snapshot ที่ไม่ subscribe การเปลี่ยนแปลง การ์ดจึงไม่ re-render เมื่อ
`handleSetPrimary` เรียก `form.setValue(...)` — ค่าใน form เปลี่ยนจริงแต่ checkbox
ยังค้างที่ `aria-checked="false"` ผู้ใช้จริงเจออาการเดียวกัน (คลิกแล้วไม่ติ๊ก)
ทางแก้ฝั่งแอปคือใช้ `useWatch`/`Controller` แทน `getValues`

กระทบ TC-VEN-030005 และ TC-VEN-030011 — ตั้ง `test.fixme` ไว้ทั้งคู่

### C-2 — `ensureActiveBu` รอ response ที่ SPA อาจไม่ยิงซ้ำ

`tests/helpers/bu.ts:60` อ่าน business unit ด้วยการดัก
`GET {backend}/api/user/profile` แล้ว `goto("/dashboard")` โดยสมมติว่า SPA ยิง
request นี้ทุกครั้งที่โหลด dashboard เมื่อรันหลายรอบติดกันใน session เดียว
ชั้น cache ฝั่ง SPA ทำให้ไม่มี request ใหม่ → `waitForResponse` timeout ที่ 20s
และเทสต์ล้มที่ `beforeEach` ไม่ใช่ที่ assertion ของตัวเอง

พบครั้งแรก 2026-09-18 ตอนรัน `010-department` ซ้ำ: TC-DEP-040003, 050002,
040004, 040005 ล้มด้วย `waiting for event "response"` ทั้งที่รอบ baseline
ก่อนหน้าผ่าน ต้องทำให้ helper ทนกรณีไม่มี request ใหม่ (อ่านค่าจาก UI หรือ
force reload ก่อนดัก)

### C-1 — เทสต์ที่ข้ามตัวเองเพราะไม่มีข้อมูล

`159-pl` ล้มด้วยข้อความของตัวเอง (`Need at least 2 active price lists`,
`Status filter not exposed`) — เป็นการขาด seed data ไม่ใช่ข้อบกพร่องของแอป

## หนี้เชิงโครงสร้างที่พบระหว่างทาง (ไม่ใช่ failure แต่ต้องแก้)

### assertion ที่ถูกกลืน — 87 จุด

`.catch(() => {})` ครอบ `expect()` โดยตรง ทำให้ assertion ที่ล้มเหลวไม่ทำให้เทสต์แดง
เทสต์เหล่านี้ "ผ่าน" ใน baseline ข้างบนโดยไม่ได้พิสูจน์อะไรเลย

| spec | จุด |
|---|---|
| `301-pr` | 28 |
| `501-grn` | 13 |
| `401-po` | 9 |
| `159-pl` | 9 |
| `601-cn` | 8 |
| `1001-campaign` | 6 |
| อื่น ๆ (7 ไฟล์) | 14 |

(`.catch(() => {})` ทั้งหมดในสเปกมี 510 จุด — 87 จุดข้างบนคือกลุ่มที่ครอบ
assertion ตรง ๆ ส่วนที่เหลือครอบ action ซึ่งอันตรายน้อยกว่าแต่ยังกลบ error อยู่ดี)

### coverage gap — 76 routes ที่ไม่มีเทสต์แตะเลย

| โมดูล | routes |
|---|---|
| `system-admin` | 21 |
| `accounting` | 10 |
| `operation-plan` | 9 |
| `inventory-management` | 8 |
| `product-management` | 4 |
| `procurement` | 4 |
| `config` | 4 |
| อื่น ๆ | 16 |

`accounting` ทั้งโมดูลไม่มีแม้แต่ catalog ใน `docs/test-cases/`
route ใหม่ใน config ที่ยังไม่มีทั้ง spec และ catalog: `config/account-mapping`,
`config/chart-of-accounts`, `config/shelf`

## ลำดับการแก้ที่เสนอ

| ลำดับ | งาน | คืนเทสต์ | ต้นทุน |
|---|---|---|---|
| 1 | แก้ path `044-eco` | 16 | ต่ำมาก |
| 2 | แก้ path `043-certification` + ปลด fixme | ≤19 | ต่ำมาก |
| 3 | helper เลือกสินค้าก่อนกรอกจำนวน (B-1) | ≤76 | กลาง |
| 4 | page objects รองรับ view/edit mode (B-2) | ~12 | กลาง |
| 5 | cluster ย่อย A-2 (pl-template, delivery-point, currency, vendor) | ~22 | กลาง |
| 6 | ถอด `.catch(() => {})` ที่ครอบ assertion 87 จุด | 0 (แต่เปิดโปง failure จริง) | สูง |
| 7 | ทบทวน skip 310 จุด | — | สูง |
