# E2E Test — คู่มือรัน & Sync Google Sheets

## สารบัญ

1. [Prerequisites](#prerequisites)
2. [รันทีละ Module](#รันทีละ-module)
3. [รัน Login แยก](#รัน-login-แยก)
4. [รันทุก Module](#รันทุก-module)
5. [Sync ผลขึ้น Google Sheets](#sync-ผลขึ้น-google-sheets)
6. [Workflow แนะนำ](#workflow-แนะนำ)
7. [ตัวเลือกเพิ่มเติม](#ตัวเลือกเพิ่มเติม)
8. [Modules ทั้งหมด](#modules-ทั้งหมด)
9. [โครงสร้างผลลัพธ์](#โครงสร้างผลลัพธ์)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

```bash
# 1. ติดตั้ง dependencies
bun install

# 2. ติดตั้ง Playwright browsers
bunx playwright install chromium

# 3. ตั้ง env สำหรับ Google Sheets sync
export GOOGLE_SHEETS_SA_KEY_PATH="/path/to/service-account.json"
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"

# 4. dev server ต้องรันอยู่ (หรือ Playwright จะ start ให้อัตโนมัติ)
bun dev
```

---

## รันทีละ Module

### วิธีที่ 1: ใช้ shell script (แนะนำ — รันเสร็จ sync อัตโนมัติ)

```bash
# รัน module เดียว → test → sync Google Sheets ทันที
./tests/scripts/run-module.sh delivery-point
./tests/scripts/run-module.sh currency
./tests/scripts/run-module.sh department
```

### วิธีที่ 2: ใช้ generic dispatcher

```bash
# run-module.sh <module-name> [flags...]
./tests/scripts/run-module.sh delivery-point
./tests/scripts/run-module.sh currency --headed
./tests/scripts/run-module.sh department --debug
```

### วิธีที่ 3: ใช้ playwright โดยตรง (ไม่ auto-sync)

```bash
# รัน spec file ตรงๆ
bunx playwright test tests/delivery-point.spec.ts

# รัน test case เดียวด้วย -g (grep pattern)
bunx playwright test tests/delivery-point.spec.ts -g "TC-001"

# รันหลาย TC
bunx playwright test tests/delivery-point.spec.ts -g "TC-001|TC-002|TC-003"

# ต้อง sync เอง
bun e2e:sync
```

---

## รัน Login แยก

Login เป็น project แยกใน Playwright config:

```bash
# รัน login spec
bunx playwright test --project=login

# หรือใช้ script
./tests/scripts/run-module.sh login

# รัน TC เดียว
bunx playwright test tests/login.spec.ts -g "TC-L01"

# sync
bun e2e:sync
```

---

## รันทุก Module

```bash
# วิธีที่ 1: ทีละ module เรียงลำดับ (แนะนำ — เห็น pass/fail แต่ละตัว)
./tests/scripts/run-all.sh

# วิธีที่ 2: รันพร้อมกันทุก module (เร็วกว่า แต่ log ปนกัน)
./tests/scripts/run-all.sh --workers=100%

# วิธีที่ 3: ใช้ bun script
bun e2e                # รันทุก spec
bun e2e:sync           # sync ผลทั้งหมด
```

ผลลัพธ์ `run-all.sh`:

```
================================================================
 Summary
================================================================
Passed (12):
  ✓ adjustment-type
  ✓ business-type
  ✓ currency
  ...
Failed (0):
```

---

## Sync ผลขึ้น Google Sheets

### ขั้นตอนการ sync

```bash
# sync ผล CSV ทั้งหมดขึ้น Google Sheets
bun e2e:sync
```

### การทำงาน

1. อ่านไฟล์ CSV จาก `tests/results/` (สร้างอัตโนมัติจาก tc-csv-reporter)
2. จับคู่ Test ID (เช่น `TC-001`, `TC-L01`) กับ row ใน Google Sheet
3. **Row มีอยู่แล้ว** → อัปเดต Status, Test Date, Duration, Error
4. **Row ใหม่** → เพิ่มแถวท้าย sheet
5. **Title** → เขียนเฉพาะตอนที่ cell ว่าง (ไม่ทับ title ที่แก้ด้วยมือ)

### ตั้งค่า Google Sheets

1. สร้าง Service Account ใน Google Cloud Console
2. เปิด Google Sheets API
3. แชร์ Spreadsheet ให้ service account email (Editor)
4. แต่ละ module ต้องมี tab ชื่อตรง:

| CSV File | Sheet Tab |
|----------|-----------|
| `login-results.csv` | Login |
| `delivery-point-results.csv` | Delivery Point |
| `adjustment-type-results.csv` | Adjustment Type |
| `business-type-results.csv` | Business Type |
| `credit-note-reason-results.csv` | Credit Note Reason |
| `credit-term-results.csv` | Credit Term |
| `currency-results.csv` | Currency |
| `department-results.csv` | Department |
| `exchange-rate-results.csv` | Exchange Rate |
| `extra-cost-results.csv` | Extra Cost |
| `location-results.csv` | Location |
| `tax-profile-results.csv` | Tax Profile |
| `unit-results.csv` | Unit |

5. Header row (แถวที่ 1) ต้องมี:

```
Test ID | Title | Status | Test Date | Duration (ms) | Error
```

---

## Workflow แนะนำ

### รัน module เดียว + sync (ใช้บ่อยสุด)

```bash
# 1 คำสั่งจบ: รัน test → สร้าง CSV → sync Google Sheets
./tests/scripts/run-module.sh delivery-point
```

### รัน test case เดียว + sync

```bash
bunx playwright test tests/delivery-point.spec.ts -g "TC-030" && bun e2e:sync
```

### รันทุกอย่าง + sync

```bash
./tests/scripts/run-all.sh
# sync ทำอัตโนมัติในแต่ละ module แล้ว
```

### ดู report ใน browser

```bash
bun e2e:report
```

---

## ตัวเลือกเพิ่มเติม

```bash
# เปิด browser ให้เห็น (headed mode)
./tests/scripts/run-module.sh currency --headed

# Debug mode (step-by-step)
./tests/scripts/run-module.sh currency --debug

# Playwright UI (interactive)
bun e2e:ui

# Retry failed tests 2 ครั้ง
bunx playwright test tests/currency.spec.ts --retries=2

# รันด้วย trace
bunx playwright test tests/currency.spec.ts --trace on
```

---

## Modules ทั้งหมด

| Module | Script | Spec File | TC Prefix |
|--------|--------|-----------|-----------|
| Login | `run-module.sh login` | `login.spec.ts` | TC-L |
| Delivery Point | `run-module.sh delivery-point` | `delivery-point.spec.ts` | TC-001..049 |
| Adjustment Type | `run-module.sh adjustment-type` | `adjustment-type.spec.ts` | TC-AT |
| Business Type | `run-module.sh business-type` | `business-type.spec.ts` | TC-BT |
| Credit Note Reason | `run-module.sh credit-note-reason` | `credit-note-reason.spec.ts` | TC-CNR |
| Credit Term | `run-module.sh credit-term` | `credit-term.spec.ts` | TC-CT |
| Currency | `run-module.sh currency` | `currency.spec.ts` | TC-CUR |
| Department | `run-module.sh department` | `department.spec.ts` | TC-DEP |
| Exchange Rate | `run-module.sh exchange-rate` | `exchange-rate.spec.ts` | TC-ER |
| Extra Cost | `run-module.sh extra-cost` | `extra-cost.spec.ts` | TC-EC |
| Location | `run-module.sh location` | `location.spec.ts` | TC-LOC |
| Tax Profile | `run-module.sh tax-profile` | `tax-profile.spec.ts` | TC-TP |
| Unit | `run-module.sh unit` | `unit.spec.ts` | TC-UN |

---

## โครงสร้างผลลัพธ์

```
tests/results/
├── login-results.csv
├── delivery-point-results.csv
├── adjustment-type-results.csv
├── business-type-results.csv
├── credit-note-reason-results.csv
├── credit-term-results.csv
├── currency-results.csv
├── department-results.csv
├── exchange-rate-results.csv
├── extra-cost-results.csv
├── location-results.csv
├── tax-profile-results.csv
└── unit-results.csv
```

ตัวอย่างเนื้อหา CSV:

```csv
Test ID,Title,Status,Duration (ms),Error,Test Date
TC-001,อ่านค่า table ของ delivery point ได้,Pass,1234,,2026-04-10
TC-002,แสดงข้อมูล default 10 รายการต่อหน้า,Pass,987,,2026-04-10
TC-030,กรอก name แล้ว save ได้ ข้อมูลขึ้น table,Fail,5432,Timeout,2026-04-10
```

---

## Troubleshooting

### Dev server ไม่ start

```bash
# ตรวจว่า port 3000 ว่าง
lsof -i :3000
# หรือ start dev server ด้วยมือ
bun dev
```

### Google Sheets sync ไม่ทำงาน

```bash
# ตรวจ env vars
echo $GOOGLE_SHEETS_SA_KEY_PATH
echo $GOOGLE_SHEETS_SPREADSHEET_ID

# ตรวจว่า service account key file อยู่จริง
cat "$GOOGLE_SHEETS_SA_KEY_PATH" | head -3

# ตรวจว่า sheet tab ชื่อตรงกับ SYNC_TARGETS ใน scripts/sync-test-results.ts
```

### Test timeout

```bash
# เพิ่ม timeout ของ test
bunx playwright test tests/delivery-point.spec.ts --timeout=60000

# หรือตรวจว่า dev server พร้อม
curl -s http://localhost:3000 | head -1
```

### ดูผล test ย้อนหลัง

```bash
# HTML report
bun e2e:report

# CSV ตรง
cat tests/results/delivery-point-results.csv
```
