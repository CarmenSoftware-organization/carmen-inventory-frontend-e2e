# Role-aware screen capture + sitemap

วันที่: 2026-08-14
สถานะ: อนุมัติ design แล้ว รอทำ implementation plan

## ปัญหา

`tests/wiki-screenshots/` ถ่าย screenshot ของหน้าจอ Carmen ได้แล้ว 184 ไฟล์ แต่มี 3 ข้อจำกัด:

1. **ถ่ายได้ role เดียวต่อหน้า** — `ShotSpec.role` เป็น string เดี่ยว และ output path คือ
   `<module>/<slug>.png` ซึ่งไม่มีมิติ role อยู่เลย เราจึงไม่เห็นว่า Requestor / HOD / Purchase
   เห็นหน้าเดียวกันต่างจาก Admin อย่างไร
2. **ถ่ายได้เฉพาะหน้าที่เป็น route** — โมดูล config ส่วนใหญ่ (unit, extra-cost, business-type,
   currency ฯลฯ) สร้าง/แก้ไขผ่าน dialog ที่ไม่เปลี่ยน URL หน้าฟอร์มเหล่านั้นจึงไม่ถูกถ่ายเลย
3. **ไม่มีมุมมองรวม** — มีแต่ไฟล์ PNG กระจายอยู่ในโฟลเดอร์ ไม่มีหน้าเดียวที่เห็นโครงทั้งระบบ

## เป้าหมาย

ถ่ายหน้าจอให้ครบทุกหน้า (route + dialog) ในมุมของทุก role แล้วสร้างหน้า **sitemap HTML**
ไฟล์เดียวที่เห็นโครง navigation ทั้งระบบพร้อม thumbnail จริง เปิดจากไฟล์บนดิสก์ได้เลย

ของแถมที่มีค่าไม่แพ้กัน: **permission matrix ที่ยืนยันด้วย browser จริง** ว่า role ไหนเข้าหน้าไหนได้

## ขอบเขต

**อยู่ในขอบเขต**
- ทุก route ที่ `route-discovery.ts` หาเจอจาก `routes/router.tsx` (ปัจจุบัน 122 entry ใน manifest)
- dialog create ของโมดูล config ที่ใช้ `DialogCrudHelper` pattern
- ทุก role ใน `TEST_USERS` (9 role) บน BU `BLAVG`
- หน้า sitemap HTML แบบ self-contained สำหรับเปิดในเครื่อง

**นอกขอบเขต**
- tab ย่อยภายในหน้า detail (PR/PO items / workflow / attachment)
- dialog edit และ delete confirm (เก็บเฉพาะ add dialog ก่อน)
- การ publish sitemap ขึ้นเว็บหรือ CI
- การถ่ายซ้ำเพื่ออัปเดตเอกสาร wiki ที่มีอยู่ (เอกสารเดิมใช้รูป Admin ที่ path เดิมต่อไปได้)

## สถาปัตยกรรม

3 pass แยกกันเป็นคนละคำสั่ง สื่อสารกันผ่านไฟล์ JSON บนดิสก์ ไม่ใช่ตัวแปรในหน่วยความจำ
เพื่อให้รันซ้ำทีละ pass ได้ และให้ pass 2/3 ทดสอบได้โดยไม่ต้องเปิด browser

```
router.tsx ──[route-discovery.ts]──> routes[]
                                        │
                    ┌───────────────────┴────────────────────┐
                    ▼                                        │
        pass 1: probe.spec.ts                                │
        9 roles × ทุก route, ไม่ถ่ายรูป                        │
                    │                                        │
                    ▼                                        │
           role-matrix.json  ─────────┐                      │
                    │                 │                      │
                    ▼                 │                      │
        pass 2: capture.spec.ts       │                      │
        Admin ทุกหน้า + role ที่ต่าง    │                      │
                    │                 │                      │
                    ▼                 ▼                      ▼
              *.png ─────────> pass 3: sitemap.ts <──────────┘
                                      │
                                      ▼
                        ../carmen-wiki/sitemap.html
```

| คำสั่ง | pass | ต้นทุนโดยประมาณ |
|---|---|---|
| `bun run wiki:probe` | 1 | 1,098 goto ไม่ถ่ายรูป → 20-35 นาที |
| `bun run wiki:capture` | 2 | 200-300 shot |
| `bun run wiki:sitemap` | 3 | ไม่กี่วินาที |

## Data model

```ts
// types.ts (เพิ่มใหม่)

type ScreenOutcome = "ok" | "denied" | "not-found" | "error";

type PageSignature = {
  heading: string;      // h1/h2 แรกของหน้า
  actions: string[];    // ชื่อปุ่มระดับหน้า เรียงแล้ว เช่น ["Add", "Export", "Print"]
  columns: string[];    // หัวตาราง เรียงแล้ว; [] ถ้าหน้านั้นไม่ใช่ list
  hasRows: boolean;     // มีข้อมูลไหม — boolean ไม่ใช่จำนวน
};

type ProbeResult = {
  route: string;
  role: string;
  outcome: ScreenOutcome;
  signature?: PageSignature;   // มีเฉพาะเมื่อ outcome === "ok"
  reason?: string;             // ข้อความ denied/error ที่เห็นจริงบนหน้า
};

// role-matrix.json = ProbeResult[]
```

**ข้อจำกัดสำคัญของ `PageSignature`: ห้ามเก็บค่าที่เปลี่ยนไปตามข้อมูล** — จำนวน record,
ชื่อ record, วันที่, running code ถ้าเก็บเข้าไป ทุก role จะถูกตัดสินว่า "ต่าง" หมด
แล้วระบบจะกลับไปถ่ายครบ 1,098 รูป ซึ่งทำลายเหตุผลทั้งหมดของการทำ probe
นี่คือเหตุผลที่ `hasRows` เป็น boolean ไม่ใช่ตัวเลข

`ShotSpec` เพิ่มฟิลด์:

```ts
/** เปิด UI state เพิ่มก่อนถ่าย; ไม่ระบุ = ถ่ายหน้าตามที่ goto มา */
interaction?: "add-dialog";
```

## Pass 1 — probe

Playwright project `wiki-probe` มี `dependencies: ["setup"]` เหมือน `wiki-screenshots`

วนแบบ **role-outer, route-inner** — สร้าง browser context 9 ตัวต่อทั้งรอบ ไม่ใช่ 1,098 ตัว
(สร้าง context แพงกว่า goto มาก)

แต่ละ route:
1. `goto` ด้วย `waitUntil: "domcontentloaded"`, timeout 20s
2. รอ skeleton `.animate-pulse` เคลียร์แบบ bounded (ยืมจาก `capture.spec.ts:47-49`)
3. ตัดสิน outcome ตามลำดับ:

| เห็นอะไรบนหน้า | outcome |
|---|---|
| `/permission denied\|forbidden\|403/i` | `denied` |
| `/not found\|404/i` | `not-found` |
| `/something went wrong\|unexpected error/i` | `error` |
| นอกนั้น | `ok` + เก็บ `signature` |

dynamic route ที่ไม่มี seedId ใน `seed-ids.json` → บันทึก `not-found` + `reason: "no seedId"`
ไม่ throw เพราะเป็นข้อเท็จจริงเรื่องข้อมูล ไม่ใช่ความล้มเหลวของ probe

เขียนผลลงทั้งหมดที่ `tests/wiki-screenshots/role-matrix.json`

## Pass 2 — capture

อ่าน `role-matrix.json` แล้วตัดสินแต่ละคู่ (route, role):

```
Admin + ok                              → ถ่าย  <module>/<slug>.png
role อื่น + ok + !sameScreen(baseline)   → ถ่าย  <module>/<slug>--<role>.png
role อื่น + ok + sameScreen(baseline)    → ข้าม (sitemap แสดงว่า "เหมือน baseline")
denied / not-found / error              → ไม่ถ่าย, sitemap แสดงเป็น badge
```

**baseline คือใคร**: ปกติคือ Admin แต่มีหน้าที่ Admin เองเข้าไม่ได้ (จาก memory ของโปรเจกต์:
โมดูล certification ถูก RBAC ปฏิเสธสำหรับ admin@BLAVG) ถ้าเจอกรณีนั้น ให้เลือก **role แรก
ตามลำดับใน `TEST_USERS` ที่ outcome เป็น `ok`** เป็น baseline แทน แล้วให้ role นั้นได้ path
ที่ไม่มี suffix (`<module>/<slug>.png`) เพื่อให้ทุกหน้าที่มีคนเข้าได้ มีรูปหลักเสมอหนึ่งใบ
sitemap ต้องแสดงชื่อ role ที่เป็น baseline ของหน้านั้นกำกับไว้ ไม่ให้เข้าใจผิดว่าเป็น Admin

ถ้าไม่มี role ไหน `ok` เลย → ไม่มีรูป, sitemap แสดงหน้านั้นเป็นการ์ดเปล่าพร้อมเหตุผล

**Backward compatibility**: Admin ยังใช้ path เดิม `<module>/<slug>.png` เพราะเอกสาร wiki
10 ไฟล์ (`en/inventory/*.md`, `th/inventory/*.md`) อ้าง path นี้อยู่ การใส่ suffix เฉพาะ role
อื่นทำให้ไม่มีเอกสารไหนพังเลย

**dialog**: spec ที่มี `interaction: "add-dialog"` → goto หน้า list → คลิก
`ConfigListPage.addButton()` (มีอยู่แล้วที่ `config-list.page.ts:15`) → รอ
`[data-slot="dialog-content"]` visible → ถ่าย `<module>/<slug>-dialog-add.png`
วิธีนี้ครอบคลุมโมดูล config ทั้งหมดโดยไม่ต้องเขียน recipe แยกต่อโมดูล

กลไกกันพังเดิมคงไว้ทั้งหมด: hard timeout 60s ต่อ spec, ปิด transition/animation ผ่าน
init script, ตรวจ output path ชนกัน, viewport 1440x1600

**env flag เดิม**: `WIKI_CAPTURE_DETAIL_ONLY` คงไว้ตามเดิม ส่วน `WIKI_CAPTURE_EMAIL`
(บังคับให้ถ่ายทุกหน้าด้วย user เดียว) ขัดกับโหมดหลาย role โดยตรง — ให้คงไว้แต่เปลี่ยนเป็น
**escape hatch**: เมื่อตั้งค่านี้ ระบบข้าม role-matrix ทั้งหมดแล้วถ่ายด้วย user นั้นคนเดียว
ลง path ที่ไม่มี suffix เหมือนพฤติกรรมเดิมทุกประการ ใช้สำหรับถ่ายซ่อมเฉพาะจุด

**Guard**: ถ้าไม่มี `role-matrix.json` ให้ throw พร้อมข้อความสั่งให้รัน `bun run wiki:probe`
ก่อน — ห้ามถ่ายแต่ Admin เงียบ ๆ แล้วทำให้เข้าใจผิดว่าครบ

## Pass 3 — sitemap

`sitemap.ts` เป็น CLI ธรรมดา (ไม่ใช่ Playwright spec) อ่าน 3 แหล่ง:

1. route tree จาก `discoverFrontendRoutes()`
2. `role-matrix.json`
3. **สแกนไฟล์ PNG จริงบนดิสก์** ใน `WIKI_ASSETS_DIR` — ไม่เชื่อ manifest ล้วน
   เพราะ manifest บอกว่า *ตั้งใจ* จะถ่าย ไม่ได้บอกว่าถ่ายสำเร็จ

render เป็น `../carmen-wiki/sitemap.html` ไฟล์เดียว:

```
┌────────────────────────────────────────────────────────────┐
│ Carmen Inventory · Sitemap        [ค้นหา route...]  [role ▾]│
│ 122 routes · 96 captured · 18 denied · 8 no data           │
├────────────────────────────────────────────────────────────┤
│ ▾ PROCUREMENT  /procurement                                │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│   │[thumb]   │ │[thumb]   │ │[thumb]   │                   │
│   │purchase- │ │purchase- │ │goods-    │                   │
│   │request   │ │order     │ │receive   │                   │
│   │index     │ │index     │ │index     │                   │
│   │Admin·HOD⊕│ │Admin ⊘×3 │ │Admin     │                   │
│   └──────────┘ └──────────┘ └──────────┘                   │
│     ├ /new  ┌──────────┐                                   │
│     └ /:id  │[thumb]   │  ⊕ = role นี้เห็นต่าง (มีรูปแยก)    │
│             └──────────┘  ⊘ = role นี้เข้าไม่ได้             │
└────────────────────────────────────────────────────────────┘
```

- จัดกลุ่มตามลำดับชั้นของ URL (segment แรกเป็นหมวด)
- CSS inline, JS inline สั้น ๆ สำหรับ search/filter ตาม role
- รูปอ้างแบบ relative path + `loading="lazy"` → ไม่ต้องย่อรูป ไม่ต้องเพิ่ม dependency
- ไม่มี build step เปิดไฟล์ตรง ๆ ใน browser ได้เลย

## Error handling

| pass | นโยบาย |
|---|---|
| 1 probe | ไม่ throw อะไรเลย ทุกผลลัพธ์คือข้อมูล — ยกเว้นกรณีเดียว: ได้ผล 0 รายการ แปลว่า auth พัง ไม่ใช่ระบบไม่มีหน้า |
| 2 capture | คง fail-loud เดิม (`capture.spec.ts:145-154`) แต่ตอนนี้ denied/not-found ถูกกรองทิ้งตั้งแต่ pass 1 จึงไม่มี false alarm |
| 3 sitemap | ไม่ throw; รูปที่หายไปแสดงเป็นช่องว่างพร้อม badge บอกเหตุผลจาก matrix |

## Testing

ตาม working preference ของโปรเจกต์นี้ จะ **ไม่** เขียน `*.spec.ts` / `*.test.ts` เพิ่ม
ยกเว้นไฟล์เดียว:

- `unit/wiki-screenshots/signature.test.ts` — unit test ของ `signature.ts`

เหตุผลที่ยกเว้นไฟล์นี้: `sameScreen()` เป็น pure function ที่ถ้า heuristic ผิด ระบบจะพัง
แบบเงียบ ๆ ไปทางใดทางหนึ่ง (ถ่าย 1,098 รูป หรือถ่ายขาดโดยไม่มีใครรู้) และมันเป็นจุดเดียว
ในระบบที่ตัดสินเรื่องนี้ repo มี precedent อยู่แล้วที่ `unit/run-env.test.ts`

เคสที่ต้องคลุม: signature เหมือนกันทุกฟิลด์, heading ต่าง, actions ต่าง, columns ต่าง,
`hasRows` ต่างอย่างเดียว, array ที่เรียงต่างลำดับแต่สมาชิกเหมือนกัน

`sameScreen()` เขียน default ให้ก่อน แล้วปรับ heuristic ทีหลังเมื่อเห็นผล probe จริง
default: ต่างเมื่อ `heading`, `actions` หรือ `columns` ต่าง; `hasRows` อย่างเดียวไม่นับว่าต่าง
(เพราะสะท้อน scope ข้อมูล ไม่ใช่ความต่างของ UI)

ส่วน static check ยังต้องผ่านตามปกติ: `tsc --noEmit`

## ไฟล์ที่แตะ

ใน `tests/wiki-screenshots/`:

| ไฟล์ | สถานะ |
|---|---|
| `signature.ts` | ใหม่ — `pageSignature()`, `sameScreen()` |
| `probe.spec.ts` | ใหม่ — pass 1 |
| `role-matrix.ts` | ใหม่ — อ่าน/เขียน/query matrix |
| `sitemap.ts` | ใหม่ — pass 3 |
| `types.ts` | แก้ — เพิ่ม `ScreenOutcome`, `PageSignature`, `ProbeResult`, `ShotSpec.interaction` |
| `manifest.ts` | แก้ — เพิ่ม dialog spec ของโมดูล config |
| `capture.spec.ts` | แก้ — อ่าน matrix, ตั้งชื่อไฟล์ตาม role, รองรับ `interaction` |
| `coverage.ts` | แก้เล็กน้อย — นับมิติ role |
| `route-discovery.ts` | ไม่แตะ |

นอกโฟลเดอร์:

- `playwright.config.ts` — เพิ่ม project `wiki-probe`, ให้ `chromium` ignore `probe.spec.ts` ด้วย
- `package.json` — เพิ่ม `wiki:probe`, `wiki:sitemap`
- `unit/wiki-screenshots/signature.test.ts` — ใหม่

Code comment ในไฟล์โค้ดเขียนเป็นภาษาอังกฤษตาม convention ของ repo นี้

## ความเสี่ยงที่รู้ล่วงหน้า

1. **probe 1,098 หน้าอาจเจอ rate limit หรือ backend ล้า** — บรรเทาด้วยการใช้ context ต่อ role
   (login ครั้งเดียวต่อ role ผ่าน storageState ที่ `setup` เตรียมไว้) และไม่มี retry ใน pass 1
2. **`sameScreen()` heuristic อาจหยาบหรือละเอียดเกินไปในรอบแรก** — ยอมรับได้ เพราะ pass 1
   แยกจาก pass 2 เราปรับ heuristic แล้วรัน pass 2 ใหม่ได้โดยไม่ต้อง probe ซ้ำ
3. **13 dynamic route ยังไม่มี seedId** — pass 1 จะบันทึกเป็น `not-found` ตามจริง
   การแก้ต้องไปเติม seed data ซึ่งอยู่นอกขอบเขตงานนี้ แต่ sitemap จะแสดงชัดว่าหน้าไหนขาด
