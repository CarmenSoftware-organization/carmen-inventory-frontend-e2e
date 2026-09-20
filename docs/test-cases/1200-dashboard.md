# Dashboard — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/dashboard`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Dashboard
**Frontend route:** `routes/dashboard`  •  **URL:** `/dashboard`
**Prefix:** `DASH`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 34

> หน้า Dashboard แสดงคำทักทายตามช่วงเวลา (เช้า/บ่าย/เย็น) พร้อมชื่อผู้ใช้จาก profile และวันที่ปัจจุบันใน eyebrow (`The Brief · DD MMM YYYY`). ส่วนหลักคือ **Saved Widgets** ที่ผู้ใช้ปักหมุดเอง: เพิ่มจาก dataset picker (`+ Add Widget`), ลากจัดเรียงบนกริด 12 คอลัมน์, สลับชนิดกราฟจากปุ่มบนการ์ด, ตั้ง param + การแสดงผล (ขนาด/ทศนิยม/สเกล gauge) จากปุ่มเฟือง และลบผ่าน DeleteDialog. การ์ดแบ่งเป็นสองชนิด: **การ์ดปกติ** (kpi / gauge / pie / bar / line / area / table) ที่อยู่ในกริดและลากได้ กับ **การ์ดกลุ่ม status pipeline** (PR/PO/SR summary) ที่กินเต็มความกว้างเหนือกริดและลากไม่ได้.

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> 1. **การ์ดวาดตาม `widget_type` ไม่ใช่ `shape` แล้ว** (frontend commit `74e3c795`). `shape` ของ dataset เป็นแค่ตัวกำหนด *ค่าเริ่มต้น* ตอนเพิ่ม (scalar/scalar_delta→kpi, time_series→line, categorical→pie, ranked→bar, table→table) และกำหนด *ชุดที่เลือกได้* เท่านั้น — ผู้ใช้สลับเป็นชนิดอื่นได้เองทีหลัง. เคสเดิม TC-DASH-020001/020002 ที่ยืนยันว่า "shape scalar ⇒ KpiCard" / "shape categorical ⇒ PieCard" จึงถูกเขียนใหม่เป็น "widget ที่ `widget_type` = kpi/pie วาดเป็นการ์ดชนิดนั้น".
> 2. **ตัวเลขทั้งหมดบนการ์ดมาจาก API จริง ไม่มี hardcode** — demo data ชุดเดิมถูกถอดออกแล้ว (`03891e3d`). แต่มีสองค่าที่ "ดูเหมือนข้อมูลจริง" และ **ห้าม assert ว่าเป็นข้อมูลจริง**:
>    - **tile ของการ์ดกลุ่มแสดง `0` ทั้งตอนไม่มีข้อมูลและตอน query พัง** (`counts.get(s) ?? 0`; เมื่อ `isError` การ์ดหยุด pulse แล้วโชว์ 0 โดยไม่มีข้อความ error) — assert ได้แค่ว่า tile ปรากฏครบตามจำนวนสถานะ
>    - **gauge ที่ยังไม่ตั้ง `max` จะเดาสเกลให้เอง** (ปัดขึ้นเป็นเลขกลมเหนือค่าปัจจุบัน) และต่อท้ายปลายสเกลด้วย `(auto)` — ตัวเลขปลายสเกลนั้นไม่ใช่ข้อมูลจากระบบ
> 3. **ตัวเลขข้างหัวข้อ `SAVED WIDGETS` คือ `renderable.length` ไม่ใช่ `count` จาก API** — มันนับเฉพาะการ์ดปกติที่ยังวาดได้ **ไม่รวมการ์ดกลุ่ม** และ **ไม่รวม widget ที่ยิงข้อมูลแล้ว error** (widget ที่ dataset ไม่มีใน BU ปัจจุบันจะถูกซ่อนเงียบ ๆ ไม่ใช่โชว์ error). เคสเดิม TC-DASH-010006 ยืนยันตรงข้ามกับโค้ดปัจจุบัน จึงเขียนใหม่.
> 4. **กริดเป็น 1 / 6 / 12 คอลัมน์** (`grid-cols-1 md:grid-cols-6 lg:grid-cols-12`, `auto-rows-[4rem]`) ไม่ใช่ 1/2/4 อย่างที่เคสเดิมเขียนไว้.
> 5. **ลบเคส TC-DASH-020003 (UnsupportedCard)** — โค้ด `UnsupportedCard` ยังอยู่ แต่ **เข้าไม่ถึงผ่าน UI แล้ว**: picker ส่ง `shapes={SUPPORTED_SHAPES}` จึงเลือก dataset ที่ shape ไม่รองรับ (เช่น `matrix`) ไม่ได้ตั้งแต่ต้นทาง. ยืนยันแบบ end-to-end ไม่ได้ จึงลบทิ้งตามกติกา (ID นี้ห้ามนำกลับมาใช้ซ้ำ).
> 6. **ปุ่ม `+ เพิ่ม` เปลี่ยนเป็น `+ Add Widget`** — UI ของแอปเป็นภาษาอังกฤษโดยดีฟอลต์ (`DEFAULT_LOCALE = "en"`), ข้อความที่อ้างในเคสทุกตัวจึงเป็นสตริงอังกฤษตาม `messages/en.json`.
> 7. **เคสที่รันได้กับ BU เปล่า ๆ (ไม่ต้อง seed):** TC-DASH-010001–010004, 010008, 030001–030005, 090001, 090002, 090004, 100001–100003 — ทุกเคสกลุ่ม 03 สร้างข้อมูลที่ตัวเองต้องใช้เอง และ 090001 *ต้องการ* BU ที่ยังไม่มี widget เลย.
>    **เคสที่ต้องมี widget อยู่ก่อน (seed ผ่าน UI ของ TC-DASH-030001/030003 หรือ fixture):** TC-DASH-010005–010007, 020001, 020002, 020004–020006, 040001–040006, 050001–050003, 090003.
> 8. **DeleteDialog เป็น `AlertDialog`** — locator ต้องใช้ `getByRole("alertdialog")`; `getByRole("dialog")` ไม่แมตช์. ส่วน WidgetConfigDialog เป็น `Dialog` ปกติ (`role="dialog"`).
> 9. **แถบเครื่องมือบนการ์ด (ลาก / ชนิดกราฟ / เฟือง / ลบ) เป็น `opacity-0` จนกว่าจะ hover หรือ focus** — Playwright ถือว่า element ที่ `opacity: 0` ยัง **visible** อยู่ (ไม่ใช่ `hidden`) ดังนั้นห้ามใช้ `toBeHidden()` ตรวจสถานะก่อน hover ให้ตรวจ computed `opacity` แทน.
> 10. **ปุ่มเฟืองโผล่เฉพาะเมื่อ dataset ของ widget ยังอยู่ใน catalogue** (`!!dataset`) และ **ปุ่มสลับชนิดกราฟโผล่เฉพาะเมื่อมีให้เลือกมากกว่า 1 ชนิด** (`renders.length > 1`) — widget แบบ table-only หรือ dataset ที่ backend ตัด `supported_renders` เหลือตัวเดียวจะไม่มีปุ่มนี้ ไม่ใช่บั๊ก.
> 11. **ข้อเท็จจริงฝั่ง backend ที่บันทึกไว้ใน `routes/dashboard/CLAUDE.md`:** `GET /api/me/dashboard-widgets` เคยคืน 500 จาก gateway (ยืนยันกับ `bu_code=T02`) หน้า degrade อย่างนุ่มนวลด้วย alert. ถ้าอาการนี้เกิดกับ `BLAVG` ด้วย เคส TC-DASH-090002 จะผ่านเองโดยไม่ต้อง intercept ส่วนเคสอื่นเกือบทั้งหมดจะล้ม — ตรวจ alert ก่อนไล่หาสาเหตุที่อื่น.
> 12. **หน้านี้ไม่มี permission gate รายหน้า** (`moduleList` entry ของ `/dashboard` ไม่มีฟิลด์ `permission`) ทุก role ที่ล็อกอินจึงเข้าได้ — แต่มี **license gate** `dashboard.widget`: BU ที่ไม่มี feature นี้จะเห็น `AccessDeniedBlock` หรือถูกเด้งไป landing page เงียบ ๆ ซึ่งเป็นพฤติกรรมตามออกแบบ ไม่ใช่บั๊ก.
> 13. **การสลับชนิดกราฟและการปรับช่วงเวลาของการ์ดกลุ่มเป็น optimistic** — UI เปลี่ยนก่อนแล้วค่อย PATCH; ถ้า backend ตอบ 400 (เช่น shape วาดแบบนั้นไม่ได้) โค้ดจะ invalidate แล้วค่ากลับไปเป็นของเดิม. เคส 040002/040005 จึง assert ทั้ง "เปลี่ยนทันที" และ "ยังคงเดิมหลังรีโหลด".

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DASH-010001 | หน้า Dashboard โหลดสำเร็จและแสดงคำทักทาย | High | Smoke |
| TC-DASH-010002 | คำทักทายแสดงชื่อผู้ใช้จาก profile | Medium | Functional |
| TC-DASH-010003 | คำทักทายเปลี่ยนตามช่วงเวลา (เช้า/บ่าย/เย็น) | Low | Functional |
| TC-DASH-010004 | eyebrow แสดง The Brief คั่นด้วยจุดตามด้วยวันที่ปัจจุบัน | Low | Functional |
| TC-DASH-010005 | รายการ Saved Widgets โหลดและวางบนกริด 12 คอลัมน์ | High | Smoke |
| TC-DASH-010006 | ตัวเลขข้างหัวข้อ section นับเฉพาะการ์ดปกติที่วาดได้ | Medium | Functional |
| TC-DASH-010007 | การ์ดในกริดเรียงตาม order_index และการ์ดกลุ่มอยู่เหนือกริด | Medium | Functional |
| TC-DASH-010008 | ระหว่างโหลดรายการแสดงโครงกระดูก 6 ใบพร้อม aria-busy | Medium | Functional |
| TC-DASH-020001 | widget ชนิด kpi แสดงตัวเลขหลักพร้อมหน่วย | Medium | Functional |
| TC-DASH-020002 | widget ชนิด pie แสดงกราฟวงกลมพร้อมหัวการ์ด | Medium | Functional |
| TC-DASH-020004 | การ์ดกลุ่ม status pipeline แสดง tile ต่อสถานะคั่นด้วยลูกศร | High | Functional |
| TC-DASH-020005 | หัวการ์ดแสดงชื่อ widget พร้อม badge สถานะและช่วงเวลา | Low | Functional |
| TC-DASH-020006 | การ์ดที่อยู่ใต้ fold ยิงข้อมูลเมื่อเลื่อนถึงเท่านั้น | Low | Edge Case |
| TC-DASH-030001 | เพิ่ม widget จาก dataset ที่ไม่มี param บันทึกทันที | High | CRUD |
| TC-DASH-030002 | เพิ่ม widget จาก dataset ที่มี param ผ่าน dialog ตั้งค่า | High | CRUD |
| TC-DASH-030003 | เพิ่มการ์ดกลุ่ม status pipeline จาก preset ใน picker | High | CRUD |
| TC-DASH-030004 | dataset ที่ไม่มี param และถูกเพิ่มแล้วหายจากรายการ picker | Medium | Functional |
| TC-DASH-030005 | ยกเลิก dialog ตั้งค่าแล้วไม่มี widget ถูกสร้าง | Medium | Negative |
| TC-DASH-040001 | ลากจัดเรียงการ์ดแล้วบันทึกลำดับใหม่ | Medium | Functional |
| TC-DASH-040002 | สลับชนิดกราฟของ widget จากปุ่มบนการ์ด | High | Functional |
| TC-DASH-040003 | แก้ param ของ widget ที่บันทึกแล้วผ่านปุ่มเฟือง | High | CRUD |
| TC-DASH-040004 | เปลี่ยนขนาดการ์ด (กว้าง × สูง) จากฟอร์ม Appearance | Medium | Functional |
| TC-DASH-040005 | เปลี่ยนช่วงเวลาของการ์ดกลุ่มจาก dropdown มุมขวาบน | Medium | Functional |
| TC-DASH-040006 | ฟิลด์ใน Appearance เปลี่ยนตามชนิดกราฟที่ใช้อยู่ | Low | Edge Case |
| TC-DASH-050001 | ลบ widget ผ่าน DeleteDialog | High | CRUD |
| TC-DASH-050002 | ลบการ์ดกลุ่มจากปุ่มถังขยะบนการ์ด | Medium | CRUD |
| TC-DASH-050003 | กดยกเลิกใน DeleteDialog แล้ว widget ยังอยู่ | Medium | Negative |
| TC-DASH-090001 | empty state เมื่อยังไม่มี widget ที่บันทึกไว้ | Medium | Edge Case |
| TC-DASH-090002 | สถานะ error เมื่อโหลดรายการ widget ล้มเหลว | Medium | Negative |
| TC-DASH-090003 | แถบเครื่องมือบนการ์ดโผล่เมื่อ hover หรือ focus | Low | Edge Case |
| TC-DASH-090004 | บนจอแคบกริดเหลือคอลัมน์เดียวและไม่มี horizontal scroll | Low | Edge Case |
| TC-DASH-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-DASH-100002 | ทุก role ที่ล็อกอินเปิด /dashboard ได้ | Medium | Authorization |
| TC-DASH-100003 | widget เป็นของส่วนตัวรายผู้ใช้ ไม่ข้ามไปหาผู้ใช้อื่น | Medium | Security |

---
## TC-DASH-010001 — หน้า Dashboard โหลดสำเร็จและแสดงคำทักทาย
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น `admin@blueledgers.com` และ active BU = `BLAVG`
**Steps**
1. ไปที่ `/dashboard`
2. รอหน้าโหลดเสร็จ
**Expected**
URL ตรงกับ `/dashboard`; มี heading ระดับ 1 ที่ขึ้นต้นด้วยคำทักทาย (`Good Morning` / `Good Afternoon` / `Good Evening`) และมีหัวข้อ section `SAVED WIDGETS` พร้อมปุ่ม `+ Add Widget`

---
## TC-DASH-010002 — คำทักทายแสดงชื่อผู้ใช้จาก profile
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`; profile ของผู้ใช้มี `firstname` / `lastname`
**Steps**
1. อ่านข้อความใน heading ระดับ 1
**Expected**
heading อยู่ในรูป `<คำทักทาย>, <firstname> <lastname>`; ถ้า profile ไม่มีทั้งชื่อและนามสกุล heading ลงท้ายด้วยคำสำรอง `there`

---
## TC-DASH-010003 — คำทักทายเปลี่ยนตามช่วงเวลา (เช้า/บ่าย/เย็น)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`; ทราบเวลาท้องถิ่นของเครื่องที่รันเทส
**Steps**
1. อ่านคำทักทายใน heading แล้วเทียบกับชั่วโมงปัจจุบันของเครื่อง
**Expected**
ชั่วโมง < 12 แสดง `Good Morning`; ชั่วโมง 12–17 แสดง `Good Afternoon`; ตั้งแต่ชั่วโมง 18 แสดง `Good Evening`

---
## TC-DASH-010004 — eyebrow แสดง The Brief คั่นด้วยจุดตามด้วยวันที่ปัจจุบัน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`
**Steps**
1. ดูแถบ eyebrow (`[data-slot="eyebrow"]`) เหนือ heading
**Expected**
eyebrow แสดงข้อความ `The Brief · <วันที่>` โดยวันที่อยู่ในรูป `DD MMM YYYY` ตาม locale ปัจจุบัน (เช่น `20 Sep 2026`)

---
## TC-DASH-010005 — รายการ Saved Widgets โหลดและวางบนกริด 12 คอลัมน์
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้มี widget ปกติที่บันทึกไว้อย่างน้อย 1 รายการใน BU `BLAVG`; อยู่ที่ `/dashboard`
**Steps**
1. รอโครงกระดูกหาย
2. ดูรายการ (`ul`) ใต้หัวข้อ `SAVED WIDGETS`
**Expected**
มีรายการ `li` หนึ่งใบต่อ widget ที่วาดได้ และ container ของรายการใช้กริด `grid-cols-1 md:grid-cols-6 lg:grid-cols-12` โดยแต่ละใบกินคอลัมน์/แถวตามขนาดที่ตั้งไว้ (`lg:col-span-*` + `row-span-*`)

---
## TC-DASH-010006 — ตัวเลขข้างหัวข้อ section นับเฉพาะการ์ดปกติที่วาดได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ปกติที่บันทึกไว้อย่างน้อย 1 รายการ; อยู่ที่ `/dashboard` และรอการ์ดโหลดเสร็จทุกใบ
**Steps**
1. อ่านตัวเลขที่อยู่ถัดจากหัวข้อ `SAVED WIDGETS`
2. นับจำนวน `li` ของการ์ดในกริด
**Expected**
ตัวเลขเท่ากับจำนวน `li` ในกริดพอดี — ไม่นับการ์ดกลุ่ม status pipeline (ซึ่งอยู่นอกกริด) และไม่นับ widget ที่ยิงข้อมูลแล้ว error (ซึ่งถูกซ่อนไปทั้งใบ)

---
## TC-DASH-010007 — การ์ดในกริดเรียงตาม order_index และการ์ดกลุ่มอยู่เหนือกริด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีทั้งการ์ดกลุ่ม status pipeline อย่างน้อย 1 ใบ และการ์ดปกติอย่างน้อย 2 ใบที่ `order_index` ต่างกัน; อยู่ที่ `/dashboard`
**Steps**
1. ดูลำดับบนลงล่างของเนื้อหาในส่วน Saved Widgets
**Expected**
การ์ดกลุ่มทั้งหมดอยู่ก่อน (เหนือ) กริด และกินเต็มความกว้าง; การ์ดปกติในกริดเรียงตาม `order_index` จากน้อยไปมาก

---
## TC-DASH-010008 — ระหว่างโหลดรายการแสดงโครงกระดูก 6 ใบพร้อม aria-busy
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ไม่ต้องมีข้อมูลล่วงหน้า; หน่วงการตอบกลับของ `GET /api/me/dashboard-widgets` ให้ช้าพอสังเกต (route interception)
**Steps**
1. ไปที่ `/dashboard`
2. ดูส่วน Saved Widgets ระหว่างที่รายการยังโหลดไม่เสร็จ
**Expected**
มี container ที่มี `aria-busy="true"` และ `aria-live="polite"` บรรจุการ์ดโครงกระดูก 6 ใบ; เมื่อรายการมาถึง container นี้หายไปและถูกแทนด้วยกริดจริง หรือ empty state

---
## TC-DASH-020001 — widget ชนิด kpi แสดงตัวเลขหลักพร้อมหน่วย
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่ `widget_type` = `kpi` (ค่าเริ่มต้นเมื่อเพิ่ม dataset shape `scalar` / `scalar_delta`); อยู่ที่ `/dashboard`
**Steps**
1. รอการ์ดใบนั้นโหลดข้อมูลเสร็จ (โครงกระดูกหาย)
2. ดูเนื้อการ์ด
**Expected**
การ์ดแสดงชื่อ widget ที่หัว และตัวเลขหลักขนาดใหญ่แบบ `tabular-nums` โดยมีหน่วยต่อท้ายเมื่อ dataset ระบุหน่วยที่ไม่ใช่ `฿`; ถ้า dataset เป็น shape `scalar_delta` และมีค่าเทียบงวดก่อน จะมีตัวบอกส่วนต่างเพิ่มใต้ตัวเลข

---
## TC-DASH-020002 — widget ชนิด pie แสดงกราฟวงกลมพร้อมหัวการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่ `widget_type` = `pie` (ค่าเริ่มต้นเมื่อเพิ่ม dataset shape `categorical`); อยู่ที่ `/dashboard`
**Steps**
1. รอการ์ดใบนั้นโหลดข้อมูลเสร็จ
2. ดูเนื้อการ์ด
**Expected**
การ์ดแสดงชื่อ widget ที่หัว และวาดกราฟวงกลม (SVG จาก recharts) พร้อมรายการหมวดหมู่ของข้อมูล; ไม่มีข้อความ `Not yet supported` ปรากฏ

---
## TC-DASH-020004 — การ์ดกลุ่ม status pipeline แสดง tile ต่อสถานะคั่นด้วยลูกศร
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการ์ดกลุ่มที่สร้างจาก preset `PR summary (status pipeline)(everyone)` (สร้างได้ด้วย TC-DASH-030003); อยู่ที่ `/dashboard`
**Steps**
1. ดูการ์ดกลุ่มเหนือกริด
**Expected**
การ์ดมี heading ระดับ 3 เป็นชื่อ preset, มีป้ายกำกับการมองเห็น `All` (หรือ `Mine` เมื่อเป็น preset `(mine)`), มี dropdown ช่วงเวลา และมี tile ของสถานะเรียงเป็น pipeline คั่นด้วยไอคอนลูกศร — PR มี 4 tile (`draft`, `in_progress`, `approved`, `completed`), PO มี 5 (เพิ่ม `sent_or_print`), SR มี 3 (`draft`, `in_progress`, `completed`). **ห้าม assert ค่าตัวเลขบน tile** (ดูหมายเหตุข้อ 2)

---
## TC-DASH-020005 — หัวการ์ดแสดงชื่อ widget พร้อม badge สถานะและช่วงเวลา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี widget ที่บันทึก `params` ไว้อย่างน้อยหนึ่งค่า (`status` และ/หรือ `time_range`) — สร้างได้ด้วย TC-DASH-030002; อยู่ที่ `/dashboard`
**Steps**
1. รอการ์ดใบนั้นโหลดเสร็จ
2. ดูใต้ชื่อการ์ด
**Expected**
ใต้ชื่อการ์ดมีแถบสรุป param: ป้ายสถานะแบบข้อความสี (เช่น `In Progress`) และ/หรือ badge ช่วงเวลา (`Today` / `Last 3 days` / `Last 7 days` / `Last month`); widget ที่ไม่มี param ทั้งสองแบบจะไม่มีแถบนี้เลย

---
## TC-DASH-020006 — การ์ดที่อยู่ใต้ fold ยิงข้อมูลเมื่อเลื่อนถึงเท่านั้น
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มี widget มากพอให้กริดยาวเกินความสูงหน้าจอ (การ์ดใบท้าย ๆ อยู่ห่างจาก viewport เกิน 200px); อยู่ที่ `/dashboard`
**Steps**
1. รอการ์ดชุดบนโหลดเสร็จโดยยังไม่เลื่อนหน้า
2. ดูการ์ดใบท้ายสุดของกริด
3. เลื่อนหน้าลงจนการ์ดใบนั้นเข้ามาใกล้ viewport
**Expected**
ก่อนเลื่อน การ์ดใบท้ายยังเป็นโครงกระดูก (ยังไม่ยิง request ข้อมูลของ widget นั้น); หลังเลื่อนถึง การ์ดยิงข้อมูลและวาดเนื้อหาจริงแทนโครงกระดูก แล้วไม่ยิงซ้ำอีกเมื่อเลื่อนผ่านไปมา

---
## TC-DASH-030001 — เพิ่ม widget จาก dataset ที่ไม่มี param บันทึกทันที
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/dashboard`; มี dataset ใน catalogue ที่ `params` ว่างและยังไม่ถูกเพิ่มเป็น widget
**Steps**
1. กดปุ่ม `+ Add Widget`
2. เลือก dataset ที่ไม่มี param จากรายการ
**Expected**
ไม่มี dialog ตั้งค่าเปิดขึ้น; แสดง toast `Widget created successfully`; การ์ดใหม่ปรากฏในกริดโดยใช้ชื่อ dataset เป็นชื่อการ์ด และใช้ชนิดกราฟเริ่มต้นตาม shape ของ dataset

---
## TC-DASH-030002 — เพิ่ม widget จาก dataset ที่มี param ผ่าน dialog ตั้งค่า
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/dashboard`; มี dataset ใน catalogue ที่ประกาศ `params` อย่างน้อยหนึ่งตัว
**Steps**
1. กดปุ่ม `+ Add Widget`
2. เลือก dataset ที่มี param
3. ปรับค่าฟิลด์ param อย่างน้อยหนึ่งช่องใน dialog
4. กดปุ่ม `Save`
**Expected**
ขั้นที่ 2 เปิด dialog ชื่อ `Configure Widget` พร้อมคำอธิบาย `Choose parameters for "<ชื่อ dataset>"`, ฟอร์ม param, ส่วน `Appearance` และส่วน `Preview` ที่วาดการ์ดตัวอย่าง; หลังกด Save แสดง toast `Widget created successfully`, dialog ปิด และการ์ดใหม่ปรากฏในกริดพร้อม badge ของ param ที่ตั้งไว้

---
## TC-DASH-030003 — เพิ่มการ์ดกลุ่ม status pipeline จาก preset ใน picker
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/dashboard`
**Steps**
1. กดปุ่ม `+ Add Widget`
2. เลือกรายการ preset ชื่อ `PR summary (status pipeline)(everyone)`
**Expected**
ไม่มี dialog ตั้งค่าเปิดขึ้น (preset สร้างด้วย param ยืนพื้นทันที); แสดง toast `Widget created successfully`; การ์ดกลุ่มใบใหม่ปรากฏ **เหนือกริด** แบบเต็มความกว้าง พร้อม tile สถานะของ PR และช่วงเวลาเริ่มต้น `Today` — ไม่ใช่การ์ด KPI ในกริด

---
## TC-DASH-030004 — dataset ที่ไม่มี param และถูกเพิ่มแล้วหายจากรายการ picker
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เพิ่ม widget จาก dataset ที่ไม่มี param มาแล้ว (ทำต่อจาก TC-DASH-030001); อยู่ที่ `/dashboard`
**Steps**
1. กดปุ่ม `+ Add Widget` อีกครั้ง
2. ค้นหาชื่อ dataset ที่เพิ่งเพิ่มไปในช่องค้นหา
**Expected**
dataset ที่ไม่มี param และถูกเพิ่มไปแล้วไม่ปรากฏในรายการอีก; ส่วน dataset ที่ **มี** param ยังเลือกซ้ำได้แม้จะถูกเพิ่มไปแล้ว (ตั้งใจให้เพิ่มหลายใบด้วยค่า param ต่างกัน) และ preset การ์ดกลุ่มก็เลือกซ้ำได้เช่นกัน

---
## TC-DASH-030005 — ยกเลิก dialog ตั้งค่าแล้วไม่มี widget ถูกสร้าง
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/dashboard`; จำจำนวนการ์ดในกริดก่อนเริ่มไว้
**Steps**
1. กดปุ่ม `+ Add Widget`
2. เลือก dataset ที่มี param จนเปิด dialog `Configure Widget`
3. กดปุ่ม `Cancel`
**Expected**
dialog ปิด; ไม่มี toast; จำนวนการ์ดในกริดเท่าเดิม และตัวเลขข้างหัวข้อ `SAVED WIDGETS` ไม่เปลี่ยน

---
## TC-DASH-040001 — ลากจัดเรียงการ์ดแล้วบันทึกลำดับใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการ์ดปกติในกริดอย่างน้อย 2 ใบ; อยู่ที่ `/dashboard` และการ์ดโหลดเสร็จแล้ว
**Steps**
1. hover การ์ดใบแรกจนแถบเครื่องมือปรากฏ
2. ลากปุ่ม handle (`aria-label="Drag to reorder"`) ไปวางทับตำแหน่งของการ์ดใบที่สอง
3. ปล่อยเมาส์
4. รีโหลดหน้า
**Expected**
ลำดับการ์ดสลับทันทีหลังปล่อยเมาส์ (optimistic); ระบบ PATCH `order_index` ของเฉพาะการ์ดที่ลำดับเปลี่ยน โดยค่าใหม่เป็นพหุคูณของ 10 (10, 20, 30, …); หลังรีโหลดลำดับยังเป็นลำดับใหม่ และการ์ดกลุ่มยังอยู่เหนือกริดเหมือนเดิม

---
## TC-DASH-040002 — สลับชนิดกราฟของ widget จากปุ่มบนการ์ด
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการ์ดที่ dataset รองรับการวาดมากกว่าหนึ่งชนิด (เช่น shape `categorical` ที่เลือกได้ทั้ง pie / bar / table); อยู่ที่ `/dashboard`
**Steps**
1. hover การ์ดใบนั้นจนแถบเครื่องมือปรากฏ
2. กดปุ่มที่มี `aria-label` = `Change chart type for <ชื่อการ์ด>`
3. เลือกชนิดกราฟอื่นจากเมนู (เมนูมีหัวข้อ `Chart type`)
4. รีโหลดหน้า
**Expected**
เมนูแสดงเฉพาะชนิดที่ dataset นี้วาดได้ และมีเครื่องหมายถูกอยู่ที่ชนิดปัจจุบัน; หลังเลือก การ์ดเปลี่ยนเป็นการ์ดชนิดใหม่ทันทีโดยไม่ต้องโหลดข้อมูลซ้ำ และไอคอนบนปุ่มเปลี่ยนตาม; หลังรีโหลด การ์ดยังเป็นชนิดใหม่

---
## TC-DASH-040003 — แก้ param ของ widget ที่บันทึกแล้วผ่านปุ่มเฟือง
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี widget ที่ dataset ยังอยู่ใน catalogue และมี `params` (สร้างจาก TC-DASH-030002); อยู่ที่ `/dashboard`
**Steps**
1. hover การ์ดใบนั้นจนแถบเครื่องมือปรากฏ
2. กดปุ่มที่มี `aria-label` = `Configure widget <ชื่อการ์ด>`
3. เปลี่ยนค่า param อย่างน้อยหนึ่งช่อง
4. กดปุ่ม `Save`
**Expected**
dialog `Configure Widget` เปิดโดย seed ค่าเดิมของ widget ไว้ในฟอร์ม; หลังกด Save แสดง toast `Widget updated successfully`, dialog ปิด, การ์ดใบนั้นโหลดข้อมูลใหม่ และ badge param ใต้ชื่อการ์ดเปลี่ยนตามค่าที่ตั้งใหม่ ส่วนการ์ดใบอื่นไม่ถูกโหลดซ้ำ

---
## TC-DASH-040004 — เปลี่ยนขนาดการ์ด (กว้าง × สูง) จากฟอร์ม Appearance
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่มีปุ่มเฟือง; อยู่ที่ `/dashboard`
**Steps**
1. เปิด dialog `Configure Widget` ของการ์ดใบนั้น
2. ในส่วน `Appearance` เปิด dropdown `Size (columns × rows)` แล้วเลือกขนาดที่ใหญ่กว่าเดิม
3. สังเกตส่วน `Preview`
4. กดปุ่ม `Save`
**Expected**
รายการขนาดที่เลือกได้ขึ้นกับชนิดกราฟและเริ่มที่ขนาดต่ำสุดของชนิดนั้น (เช่น kpi เริ่มที่ `3 × 2`, bar เริ่มที่ `4 × 3`); การ์ดใน `Preview` สูงเปลี่ยนตามขนาดที่เลือกทันที; หลัง Save การ์ดในกริดกินคอลัมน์/แถวตามที่เลือก (`lg:col-span-<กว้าง>` + `row-span-<สูง>`) และค่ายังคงอยู่หลังรีโหลด

---
## TC-DASH-040005 — เปลี่ยนช่วงเวลาของการ์ดกลุ่มจาก dropdown มุมขวาบน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการ์ดกลุ่ม status pipeline อย่างน้อย 1 ใบ; อยู่ที่ `/dashboard`
**Steps**
1. เปิด dropdown ช่วงเวลาที่มุมขวาบนของการ์ดกลุ่ม
2. เลือก `Last 7 days`
3. รีโหลดหน้า
**Expected**
dropdown มีตัวเลือกครบสี่ค่า `Today` / `Last 3 days` / `Last 7 days` / `Last month`; หลังเลือก ค่าบน dropdown เปลี่ยนทันทีและ tile ลูกยิงข้อมูลใหม่ตามช่วงเวลาที่เลือก; หลังรีโหลด ค่ายังเป็น `Last 7 days`

---
## TC-DASH-040006 — ฟิลด์ใน Appearance เปลี่ยนตามชนิดกราฟที่ใช้อยู่
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มี widget ที่ dataset เป็น shape `scalar` หรือ `scalar_delta` (สลับเป็น gauge ได้); อยู่ที่ `/dashboard`
**Steps**
1. เปิด dialog `Configure Widget` ของการ์ดขณะที่ยังเป็นชนิด `kpi` แล้วดูส่วน `Appearance` จากนั้นปิด dialog
2. สลับชนิดกราฟของการ์ดเป็น `Gauge` จากปุ่มบนการ์ด
3. เปิด dialog `Configure Widget` อีกครั้งแล้วดูส่วน `Appearance`
**Expected**
ตอนเป็น `kpi` ส่วน `Appearance` มีเฉพาะ `Size (columns × rows)` กับ `Decimals`; ตอนเป็น `Gauge` มีฟิลด์เพิ่ม `Scale from`, `Scale to` (placeholder `auto`), `Warn above` และ `Warning colour` โดย `Warning colour` ถูก disable จนกว่าจะกรอก `Warn above`

---
## TC-DASH-050001 — ลบ widget ผ่าน DeleteDialog
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี widget ปกติในกริดอย่างน้อย 1 รายการ; อยู่ที่ `/dashboard`
**Steps**
1. hover การ์ดใบนั้นจนแถบเครื่องมือปรากฏ
2. กดปุ่มที่มี `aria-label` = `Delete widget <ชื่อการ์ด>`
3. กดปุ่ม `Delete` ใน dialog ยืนยัน
**Expected**
เปิด `alertdialog` ชื่อ `Delete Widget` พร้อมข้อความ `Remove "<ชื่อการ์ด>" from your dashboard? This action cannot be undone.`; หลังยืนยันแสดง toast `Widget deleted successfully`, การ์ดหายจากกริด และตัวเลขข้างหัวข้อ section ลดลง 1

---
## TC-DASH-050002 — ลบการ์ดกลุ่มจากปุ่มถังขยะบนการ์ด
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีการ์ดกลุ่ม status pipeline อย่างน้อย 1 ใบ; อยู่ที่ `/dashboard`
**Steps**
1. hover การ์ดกลุ่มจนปุ่มถังขยะมุมขวาบนปรากฏ
2. กดปุ่มถังขยะ
3. กดปุ่ม `Delete` ใน dialog ยืนยัน
**Expected**
เปิด `alertdialog` ชื่อ `Delete Widget` ที่อ้างชื่อการ์ดกลุ่ม; หลังยืนยันแสดง toast `Widget deleted successfully` และการ์ดกลุ่มหายไปจากเหนือกริด โดยการ์ดในกริดไม่ถูกกระทบ

---
## TC-DASH-050003 — กดยกเลิกใน DeleteDialog แล้ว widget ยังอยู่
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
มี widget ปกติในกริดอย่างน้อย 1 รายการ; อยู่ที่ `/dashboard`
**Steps**
1. เปิด dialog ยืนยันการลบของการ์ดใบใดใบหนึ่ง
2. กดปุ่ม `Cancel`
**Expected**
dialog ปิด; ไม่มี toast; การ์ดยังอยู่ในกริดและตัวเลขข้างหัวข้อ section เท่าเดิม

---
## TC-DASH-090001 — empty state เมื่อยังไม่มี widget ที่บันทึกไว้
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ผู้ใช้ยังไม่มี widget ที่บันทึกไว้เลยใน BU ปัจจุบัน (ทั้งการ์ดปกติและการ์ดกลุ่ม); อยู่ที่ `/dashboard`
**Steps**
1. รอโครงกระดูกหาย
2. ดูส่วน Saved Widgets
**Expected**
แสดงกล่องเส้นประที่มีหัวข้อ `Build your dashboard`, คำอธิบายที่ชี้ไปยังเมนู `+ Add Widget` และชิป hint สามอัน `KPI metrics` / `Distribution` / `Comparison`; ไม่มีกริดการ์ดปรากฏ

---
## TC-DASH-090002 — สถานะ error เมื่อโหลดรายการ widget ล้มเหลว
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
บังคับให้ `GET /api/me/dashboard-widgets` ตอบ error (route interception) ก่อนเปิดหน้า
**Steps**
1. ไปที่ `/dashboard`
2. รอการโหลดล้มเหลว
**Expected**
แสดงข้อความ `role="alert"` ที่ขึ้นต้นด้วย `Failed to load saved widgets:` ตามด้วยข้อความจาก error; หน้าไม่ crash — คำทักทาย หัวข้อ section และปุ่ม `+ Add Widget` ยังอยู่ครบ และไม่มี empty state ขึ้นมาแทน

---
## TC-DASH-090003 — แถบเครื่องมือบนการ์ดโผล่เมื่อ hover หรือ focus
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มีการ์ดปกติในกริดอย่างน้อย 1 ใบ; อยู่ที่ `/dashboard`
**Steps**
1. ตรวจค่า computed `opacity` ของแถบเครื่องมือมุมขวาบนของการ์ดก่อน hover
2. hover ที่การ์ด แล้วตรวจค่า `opacity` อีกครั้ง
3. ย้าย pointer ออก แล้วกด Tab จนโฟกัสเข้าไปในปุ่มของแถบเครื่องมือ
**Expected**
ก่อน hover `opacity` เป็น `0`; ระหว่าง hover เป็น `1`; เมื่อมีปุ่มในแถบได้โฟกัส (focus-within) แถบก็แสดงเช่นกัน — หมายเหตุ: ห้ามใช้ `toBeHidden()` ตรวจสถานะแรก เพราะ Playwright ถือว่า element ที่ `opacity: 0` ยัง visible

---
## TC-DASH-090004 — บนจอแคบกริดเหลือคอลัมน์เดียวและไม่มี horizontal scroll
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/dashboard`; ตั้ง viewport เป็นขนาดมือถือ (กว้าง 390px)
**Steps**
1. ตั้ง viewport เป็น 390×844 แล้วโหลดหน้า
2. ดูส่วน Saved Widgets และการ์ดกลุ่ม (ถ้ามี)
**Expected**
กริดเหลือคอลัมน์เดียว (การ์ดเรียงซ้อนลงมา); คำทักทายและ eyebrow ยังอ่านได้ครบ; ตัว `body` ไม่มี horizontal scroll (tile ของการ์ดกลุ่มเลื่อนแนวนอนได้ภายในการ์ดของตัวเองเท่านั้น)

---
## TC-DASH-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด ไม่โหลด storageState)
**Steps**
1. เปิด `/dashboard` ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` (แบบ replace) และฟอร์ม login แสดง; ไม่มีเนื้อหาของ dashboard ปรากฏแม้ชั่วขณะ

---
## TC-DASH-100002 — ทุก role ที่ล็อกอินเปิด /dashboard ได้
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
มี storageState ของทุกบัญชีใน `tests/test-users.ts` (Requestor, HOD, Purchase, FC, GM, Owner, StoreManager, Budget, Admin) ที่ active BU = `BLAVG`
**Steps**
1. สำหรับแต่ละ role: เปิด `/dashboard`
**Expected**
ทุก role อยู่ที่ URL `/dashboard` และเห็น heading คำทักทาย + หัวข้อ `SAVED WIDGETS` + ปุ่ม `+ Add Widget`; ไม่มี role ใดเจอหน้าปฏิเสธสิทธิ์ (หน้านี้ไม่มี permission gate รายหน้า)

---
## TC-DASH-100003 — widget เป็นของส่วนตัวรายผู้ใช้ ไม่ข้ามไปหาผู้ใช้อื่น
**Priority:** Medium · **Test Type:** Security
**Preconditions**
ล็อกอินเป็น `admin@blueledgers.com` และเพิ่ม widget ใหม่หนึ่งใบที่จำชื่อไว้ได้; มี storageState ของ `hod@blueledgers.com` ที่ BU เดียวกัน (`BLAVG`)
**Steps**
1. ในบริบทของ admin: เพิ่ม widget แล้วยืนยันว่าการ์ดปรากฏบนกริด
2. เปิดบริบทของ `hod@blueledgers.com` แล้วไปที่ `/dashboard`
3. มองหาการ์ดชื่อเดียวกันในกริดของ HOD
**Expected**
การ์ดที่ admin เพิ่มไม่ปรากฏบน dashboard ของ HOD (รายการมาจาก endpoint ของผู้ใช้ที่ล็อกอินเอง); dashboard ของ HOD แสดงรายการของตัวเอง หรือ empty state เมื่อยังไม่มี widget
