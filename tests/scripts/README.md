# tests/scripts

Batch scripts สำหรับรัน Playwright e2e ทีละ module

## Usage

```bash
# Generic dispatcher — รับชื่อ module เป็น arg แรก
./tests/scripts/run-module.sh currency
./tests/scripts/run-module.sh department --headed
./tests/scripts/run-module.sh business-type --debug

# ไม่ระบุชื่อ module → เปิด select menu ให้เลือก
./tests/scripts/run-module.sh
./tests/scripts/run-module.sh --headed   # flag เดี่ยวก็เปิด menu

# รันทุก module เรียงลำดับ + summary
./tests/scripts/run-all.sh
./tests/scripts/run-all.sh --workers=100%   # single playwright batch
```

Flags ทุกตัวของ `playwright test` (`--headed`, `--ui`, `--debug`, `-g <pattern>`, `--list-files`, ฯลฯ) ส่งต่อท้ายได้

## Modules

`run-module.sh` และ `run-all.sh` ค้นหา spec อัตโนมัติจาก `tests/[0-9]*-*.spec.ts` — ไม่มี list ที่ต้อง maintain ภายในไฟล์ script เพิ่ม spec ใหม่แล้ว menu/`run-all` จะเห็นทันที
