# Design: เก็บ screenshot ทุกเทสต์ (pass และ fail) ผูกกับ TC ID

วันที่: 2026-06-01

## เป้าหมาย

เก็บภาพ screenshot ของ **ทุกเทสต์** ไม่ว่าจะ pass หรือ fail ไว้ในโฟลเดอร์แยกต่างหาก
โดยตั้งชื่อไฟล์ตาม TC ID (1 ไฟล์ต่อ 1 เทสต์ เขียนทับของเดิมทุกรัน) และบันทึก path
ของภาพลงใน JSON result เพื่อให้ Google Sheet sync นำไปแสดงเป็นลิงก์อ้างอิงได้

ปัจจุบัน `playwright.config.ts` ตั้ง `screenshot: "only-on-failure"` ทำให้เก็บภาพเฉพาะ
ตอน fail เท่านั้น และภาพถูกเก็บใน `test-results/` (gitignored) ด้วยชื่อไฟล์ที่ Playwright
สุ่มสร้าง — ไม่ได้ผูกกับ TC ID และไม่ได้อ้างอิงใน JSON result

## ขอบเขตการตัดสินใจ (ที่ตกลงกับผู้ใช้)

- **การใช้งานหลัก**: ผูก path ของภาพกับผลใน JSON / Google Sheet
- **โครงสร้างโฟลเดอร์**: โฟลเดอร์แยกต่างหาก ตั้งชื่อไฟล์ตาม TC ID — รันล่าสุดทับของเดิม
- **Git**: gitignore โฟลเดอร์ภาพ (เก็บเฉพาะเครื่อง ไม่ commit เข้า repo)
  - ผลคือลิงก์ใน Sheet จะ resolve ได้เฉพาะบนเครื่องที่รันเทสต์ — ยอมรับได้

## แนวทางที่เลือก

**แนวทาง A — รวมศูนย์ที่ JSON reporter**

ตั้ง `screenshot: "on"` ให้ Playwright ถ่ายภาพอัตโนมัติตอนจบทุกเทสต์ แล้วให้
`tests/reporters/tc-json-reporter.ts` (ที่ทำงาน `onTestEnd` ต่อทุกเทสต์และ map TC ID
อยู่แล้ว) อ่าน `result.attachments` คัดลอกไฟล์ภาพไปเก็บเป็น `screenshots/<TCID>.png`
พร้อมบันทึก relative path ลง result row

เหตุผลที่เลือก A เหนือทางอื่น:

- **B (afterEach hook เรียก `page.screenshot()` เอง)** — ต้องไปต่อเข้า fixture ทั้ง
  project `login` และ `chromium` (ผ่าน `createAuthTest`) เสี่ยงตกหล่นเมื่อเพิ่ม spec ใหม่
- **C (สคริปต์ post-process สแกน `test-results/`)** — เปราะ เพราะชื่อไฟล์ที่ Playwright
  สุ่มสร้าง map กลับเป็น TC ID ได้ยาก

แนวทาง A ไม่ต้องแตะ spec ใด ๆ และครอบคลุมทุกเทสต์โดยอัตโนมัติ

## รายละเอียดการเปลี่ยนแปลง

### 1. `playwright.config.ts`

เปลี่ยน `use.screenshot` จาก `"only-on-failure"` เป็น `"on"`
Playwright จะแนบ attachment ชื่อ `"screenshot"` (contentType `image/png`, มีฟิลด์ `path`)
ตอนจบทุกเทสต์ ทั้ง pass และ fail

### 2. โฟลเดอร์เก็บภาพ

- โฟลเดอร์ใหม่ที่ root ของ repo: `screenshots/`
- รูปแบบไฟล์: `screenshots/TC-L00101.png` — 1 ไฟล์ต่อ TC ID เขียนทับของเดิมทุกรัน
- เพิ่มบรรทัด `screenshots/` ใน `.gitignore`

### 3. `tests/reporters/tc-json-reporter.ts`

- เพิ่มฟิลด์ `screenshot: string` ใน interface `TCResultRow`
  (เก็บ relative path เช่น `screenshots/TC-L00101.png`; ว่าง `""` ถ้าไม่มีภาพ)
- เพิ่มค่า config `screenshotsDir` (ดีฟอลต์ `screenshots`) resolve เทียบ `process.cwd()`
- ใน `onTestEnd`:
  - หา attachment ตัวแรกที่ `name === "screenshot"` และมี `path`
  - ถ้าพบ: `mkdirSync(screenshotsDir, { recursive: true })` แล้ว `copyFileSync(attachment.path, screenshots/<TCID>.png)` สำหรับ **ทุก** TC ID ที่ match ในชื่อเทสต์ (คัดลอกภาพเดียวกันไปทุก ID)
  - บันทึก relative path (`screenshots/<TCID>.png`) ลงฟิลด์ `screenshot` ของแต่ละ row
  - ถ้าไม่พบ attachment: ฟิลด์ `screenshot` เป็น `""`
- พฤติกรรม retry: `onTestEnd` ถูกเรียกต่อ attempt — attempt ล่าสุดเขียนทับไฟล์
  (ตรงกับข้อกำหนด "รันล่าสุดทับ")
- อัปเดต doc comment หัวไฟล์ให้สะท้อนฟิลด์ใหม่และพฤติกรรมการคัดลอก

### 4. `scripts/sync-test-results.ts`

- เพิ่ม `"Screenshot"` เข้า array `CANONICAL_HEADER` (จาก 13 → 14 คอลัมน์)
  ฟังก์ชัน `ensureHeaders` เดิมจะ auto-append คอลัมน์ที่ขาดให้ tab เก่าโดยอัตโนมัติ
- resolve `screenshotCol = header.indexOf("Screenshot")`
- ปฏิบัติเป็น **reporter-owned column** (overwrite ทุกครั้ง เหมือน Status/Run Date):
  - ใน path append: `if (screenshotCol >= 0) row[screenshotCol] = r.screenshot`
  - ใน path update: `push(screenshotCol, r.screenshot)`
- เก็บค่าเป็น string path ธรรมดา (valueInputOption ปัจจุบันเป็น `"RAW"` จึงไม่ parse สูตร)

## จุดที่ไม่แตะ (นอกขอบเขต)

- HTML report ยังฝังภาพให้ตามปกติ (เป็นของแถม ไม่ต้องแก้)
- ภาพเป็น viewport ตาม default ของ Playwright (ไม่ใช่ full-page) — ปรับภายหลังได้ถ้าต้องการ
- `seq`, การ sort by testId, การ map spec file และ logic อื่น ๆ ของ reporter คงเดิม
- ไม่เปลี่ยน `video` / `trace` setting
- ไม่ทำลิงก์แบบ `=HYPERLINK(...)` คลิกได้ (เก็บ path เป็น string) — เพิ่มภายหลังได้

## การทดสอบ / ตรวจรับ

1. รันเทสต์โมดูลเล็ก ๆ (เช่น `bun run test:login` หรือ 1 spec) แล้วยืนยันว่า:
   - มีไฟล์ `screenshots/TC-XXXXXX.png` เกิดขึ้นสำหรับเทสต์ที่ pass ด้วย (ไม่ใช่เฉพาะ fail)
   - JSON ใน `tests/results/<spec>-results.json` มีฟิลด์ `screenshot` ชี้ไป path ที่ถูกต้อง
2. ยืนยัน `screenshots/` ถูก gitignore (`git status` ไม่ขึ้นไฟล์ภาพ)
3. (ถ้ามี credential) รัน `bun e2e:sync` แล้วยืนยันว่า Sheet มีคอลัมน์ `Screenshot` พร้อม path
