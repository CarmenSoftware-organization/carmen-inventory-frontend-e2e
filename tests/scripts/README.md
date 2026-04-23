# tests/scripts

Batch scripts สำหรับรัน Playwright e2e ทีละ module

## Usage

```bash
# รัน module เดียว
./tests/scripts/run-currency.sh
./tests/scripts/run-department.sh --headed
./tests/scripts/run-business-type.sh --debug

# Generic dispatcher (ส่ง module name เอง)
./tests/scripts/run-module.sh currency --headed

# รันทุก module เรียงลำดับ + summary
./tests/scripts/run-all.sh
```

Flags ทุกตัวของ `playwright test` (`--headed`, `--ui`, `--debug`, `-g <pattern>`, ฯลฯ) ส่งต่อท้ายได้

## Modules

adjustment-type, business-type, credit-note-reason, credit-term, currency,
delivery-point, department, exchange-rate, extra-cost, location, tax-profile, unit
