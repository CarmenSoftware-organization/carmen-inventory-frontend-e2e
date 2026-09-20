# Test-Case Coverage Audit & Catalog Rollout — Design

**Date:** 2026-09-20
**Status:** approved (design), implementation pending
**Scope:** documentation only — no Playwright specs are written by this work

## Goal

สแกน frontend (`carmen-inventory-frontend-react`) ที่เป็นปัจจุบัน แล้วทำให้ทุก route มี
**test-case documentation** ที่ตรงกับ UI จริง แยกเป็น module — ไม่ว่าจะ module ที่ยังไม่มี
อะไรเลย, module ที่มี catalog แต่ drift, หรือ module ที่มี spec แล้วแต่ spec ยังครอบไม่หมด

## Non-goals

- ไม่เขียน/แก้ `tests/*.spec.ts` ใน phase เหล่านี้ (automation เป็นงานถัดไป แยก PR)
- ไม่แตะ `docs/user-stories/` — ไฟล์นั้น generate จาก annotation ของ spec เท่านั้น
- ไม่รันชุดทดสอบกับ backend

## สภาพปัจจุบัน (จากการสแกน 2026-09-20)

- frontend ประกาศ **182 route paths** ครอบประมาณ 65 sub-module
- e2e repo มี **38 specs** และ **32 catalogs** (674 TCs) ใน `docs/test-cases/`
- catalog เดิมบางไฟล์ drift แล้ว เช่น `1105-system-period.md` ชี้ `/system-admin/period`
  แต่ route จริงคือ `system-admin/inventory-period`; `1113-signature-config.md`
  ชี้ route ที่หาไม่พบใน source ปัจจุบัน

### การจัดกลุ่ม

| กลุ่ม | นิยาม | จำนวน | ผลลัพธ์ |
| --- | --- | --- | --- |
| **A** | route มีจริง แต่ไม่มีทั้ง spec และ catalog | ~28 module | catalog ใหม่ |
| **B** | มี catalog แต่ต้องสอบทานกับ route ปัจจุบัน | 32 module | แก้ไฟล์เดิมในที่ |
| **C** | มี spec แล้ว | ~30 module | gap report เฉพาะส่วนที่ spec ไม่ครอบ |

กลุ่ม A ที่ระบุได้ตอนสแกน: `accounting/*` (AP invoice/payment, AR invoice/receipt,
journal-voucher, recurring-voucher, template-voucher, allocation-voucher,
financial-reports), `config/account-mapping`, `config/chart-of-accounts`,
`config/shelf`, `system-admin/company-profile`, `default-setting`, `email-profile`,
`email-template`, `interface`, `inventory-period`, `business-setting`,
auth peripherals (`register`, `register/verify`, `invitations/:token`,
`forgot-password`, `reset-password`, `terms`, `privacy`),
`report/list`, `report/history`, `report/schedules`

รายการชี้ขาดมาจาก `COVERAGE.md` ที่ P0 generate ไม่ใช่รายการนี้

## โครงสร้างผลลัพธ์

```
docs/test-cases/
  COVERAGE.md              # generated: matrix route ↔ spec ↔ catalog ↔ status
  <nnn>-<module>.md        # กลุ่ม A = ไฟล์ใหม่, กลุ่ม B = แก้ไฟล์เดิม
  gaps/<spec>-gap.md       # กลุ่ม C: TC ที่ spec ยังไม่ครอบ
docs/test-id-scheme.md     # ลงทะเบียน prefix + section block ใหม่ทุกตัว
scripts/audit-coverage.ts  # generator ของ COVERAGE.md
```

**ทำไมแยก `gaps/`:** กลุ่ม C มี `docs/user-stories/` ที่ generate อยู่แล้ว ถ้าเขียน
catalog มือทับจะได้ source-of-truth สองชุดที่ drift ทันที `gaps/` เก็บเฉพาะเคสที่ยัง
ไม่มีเจ้าของ เมื่อ automate แล้วลบบรรทัดนั้นออกได้ตรง ๆ

## P0 — `scripts/audit-coverage.ts`

**Input** (อ่านอย่างเดียว ไม่แก้ไฟล์ต้นทาง):
1. route paths จาก `E2E_FRONTEND_DIR/routes/**` — ทั้ง `path: "..."` ที่ประกาศ และโครงไดเรกทอรี
2. TC-ID + ชื่อไฟล์จาก `tests/*.spec.ts`
3. prefix / URL / TC count จากหัวไฟล์ `docs/test-cases/*.md`

**Output:** `docs/test-cases/COVERAGE.md` — ตารางเดียวเรียงตาม module root:

| Route | Module | Prefix | Spec | Catalog | Status |
| --- | --- | --- | --- | --- | --- |

`Status ∈ {spec, catalog, gap-report, none}`

**Invariants ที่ต้องถือ:**
- รันซ้ำได้ ผลลัพธ์เหมือนเดิมเมื่อ input ไม่เปลี่ยน (ไม่มี timestamp ในไฟล์)
- ไม่ fail ถ้า `E2E_FRONTEND_DIR` ไม่มีอยู่ — พิมพ์คำเตือนแล้ว exit ไม่เป็นศูนย์
- ตรรกะบริสุทธิ์ (parse/จับคู่) แยกไว้ใน `scripts/lib/` ให้ unit test ครอบได้
  เหมือน `scripts/lib/screen-crawl.ts`

**พ่วง:** ขยาย `scripts/audit-tc-ids.ts` ให้สแกน `docs/test-cases/**/*.md` ด้วย
(วันนี้สแกนเฉพาะ spec) — ตรวจรูปแบบ TC-ID, prefix ที่ลงทะเบียน, และ **เลขซ้ำข้ามไฟล์**
ซึ่งจะเกิดแน่เมื่อ subagent หลายตัวเขียน catalog พร้อมกัน

เพิ่ม script: `"audit:coverage": "bun run scripts/audit-coverage.ts"`

## ลำดับ phase

| Phase | งาน | module | PR |
| --- | --- | --- | --- |
| P0 | `audit-coverage.ts` + `COVERAGE.md` + ขยาย `audit:tc-ids` | — | 1 |
| P1 | system-admin 7 + config 3 ที่ขาด | ~10 | 1 |
| P2 | auth peripherals + report sub-routes | ~8 | 1 |
| P3 | refresh catalog เดิม 32 ไฟล์ | 32 | 1 |
| P4 | `gaps/` ของ module ที่มี spec | ~30 | 1 |
| P5 | accounting ทั้งก้อน | ~10 | 1 |

accounting ถูกเลื่อนไปท้ายสุดตามที่เจ้าของงานสั่ง (2026-09-20)

## สัญญาของ subagent (1 ตัว = 1 module)

แต่ละ agent ได้รับ และต้องทำตาม:

1. **route module path ที่แน่นอน** — อ่าน source จริงเท่านั้น
   **ห้ามเดา** ฟิลด์ / คอลัมน์ / ปุ่ม / toast ที่ไม่ปรากฏในโค้ด
2. **prefix + section block ที่ P0 จองไว้** — agent ไม่เลือกเลขเอง จึงไม่ชนกัน
3. **template ตาม `docs/test-cases/130-equipment.md`** — header block
   (Module / Frontend route / URL / Prefix / Default role / Total),
   ตาราง at-a-glance, แล้วบล็อกรายเคส
4. **section block ตาม `docs/test-id-scheme.md`** — 01 list, 02 detail, 03 create,
   04 edit, 05 delete, 10–19 security, 20–29 validation, 40+ module-specific
5. **ภาษา** — title / preconditions / steps / expected เป็นไทย;
   Priority / Test Type เป็นอังกฤษตามอนุกรมเดิม
6. **ห้าม `git add -A` หรือ `git add .`** — commit ด้วย path ที่ระบุเท่านั้น
7. **ไม่เขียน `.spec.ts`** ใด ๆ

ผู้รวมงาน (session หลัก) เป็นคนรัน audit, อัปเดต `test-id-scheme.md` + `COVERAGE.md`,
commit ต่อ module, และเปิด PR ต่อ phase

## Quality gates (ทุก phase)

```bash
bun audit:tc-ids      # รูปแบบ + prefix + เลขซ้ำ (หลังขยายให้ครอบ catalog)
bun audit:coverage    # regenerate COVERAGE.md แล้วต้องไม่มี diff ค้าง
bun run test:unit     # unit test ของ scripts/lib
npx tsc --noEmit      # P0 เท่านั้น (phase อื่นไม่มีโค้ด)
```

`bun docs:user-stories` **ไม่ต้องรัน** เพราะงานนี้ไม่แตะ annotation ใน spec

## ความเสี่ยงที่รู้ตัว

- **ปริมาณ** — TC ใหม่รวมประมาณ 560–700 เคส แบ่ง phase ละ PR เพื่อให้รีวิวไหว
- **คุณภาพจาก agent** — กัน 2 ชั้น: สัญญาข้อ 1 (ห้ามเดา) และ audit ที่รันตอนรวมงาน
- **catalog drift รอบหน้า** — แก้ด้วย `COVERAGE.md` ที่ generate ได้ ไม่ใช่ไฟล์มือ
