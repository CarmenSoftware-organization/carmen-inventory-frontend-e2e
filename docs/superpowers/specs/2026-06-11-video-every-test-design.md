# Design: เก็บวิดีโอทุกเทสต์ (pass และ fail) ผูกกับ TC ID

วันที่: 2026-06-11

## เป้าหมาย

เก็บวิดีโอการรันของ **ทุกเทสต์** ไม่ว่าจะ pass หรือ fail ไว้ในโฟลเดอร์แยกต่างหาก
โดยตั้งชื่อไฟล์ตาม TC ID (1 ไฟล์ต่อ 1 เทสต์ เขียนทับของเดิมทุกรัน) และบันทึก path
ของวิดีโอลงใน JSON result เพื่อให้ Google Sheet sync นำไปแสดงเป็นลิงก์อ้างอิงได้

งานนี้เป็นการ **mirror pipeline ของ screenshot** ที่ทำเสร็จและใช้งานอยู่แล้ว
(ดู `2026-06-01-screenshot-every-test-design.md`) มาใช้กับวิดีโอแบบคู่ขนาน

ปัจจุบัน `playwright.config.ts` ตั้ง `video: "retain-on-failure"` ทำให้เก็บวิดีโอเฉพาะ
ตอน fail เท่านั้น และไฟล์ถูกเก็บใน `test-results/` (gitignored) ด้วยชื่อที่ Playwright
สุ่มสร้าง — ไม่ได้ผูกกับ TC ID และไม่ได้อ้างอิงใน JSON result

## ขอบเขตการตัดสินใจ (ที่ตกลงกับผู้ใช้)

- **ความครอบคลุม**: เก็บวิดีโอ **ทุกเทสต์** (pass + fail) — ไม่ใช่เฉพาะ fail
- **การใช้งานหลัก**: ผูก path ของวิดีโอกับผลใน JSON / Google Sheet
- **โครงสร้างโฟลเดอร์**: โฟลเดอร์แยกต่างหาก ตั้งชื่อไฟล์ตาม TC ID — รันล่าสุดทับของเดิม
- **Git**: gitignore โฟลเดอร์วิดีโอ (เก็บเฉพาะเครื่อง ไม่ commit เข้า repo)
  - ผลคือลิงก์ใน Sheet จะ resolve ได้เฉพาะบนเครื่องที่รันเทสต์ — ยอมรับได้ (เหมือน screenshot)
- **ชื่อโฟลเดอร์/คอลัมน์**: ใช้ `videos/` และคอลัมน์ Sheet ชื่อ `Video`

## แนวทางที่เลือก

**แนวทาง A — รวมศูนย์ที่ JSON reporter** (เหมือนที่ screenshot ใช้)

ตั้ง `video: "on"` ให้ Playwright อัดวิดีโอทุกเทสต์ แล้วให้
`tests/reporters/tc-json-reporter.ts` (ที่ทำงาน `onTestEnd` ต่อทุกเทสต์และ map TC ID
อยู่แล้ว) อ่าน `result.attachments` คัดลอกไฟล์วิดีโอไปเก็บเป็น `videos/<TCID>.webm`
พร้อมบันทึก relative path ลง result row

doc ของ screenshot ได้ประเมินแนวทางอื่นไว้แล้วและสรุปว่า A ดีที่สุด — งานนี้ใช้ข้อสรุปเดิม:

- **B (afterEach hook เรียกเอง)** — ต้องต่อเข้า fixture ทั้ง project `login` และ `chromium`
  เสี่ยงตกหล่นเมื่อเพิ่ม spec ใหม่ และ video ของ Playwright เข้าถึงผ่าน reporter attachment
  ได้ตรงกว่าการเรียก API เอง
- **C (สคริปต์ post-process สแกน `test-results/`)** — เปราะ เพราะชื่อไฟล์สุ่ม map กลับเป็น
  TC ID ได้ยาก

แนวทาง A ไม่ต้องแตะ spec ใด ๆ และครอบคลุมทุกเทสต์โดยอัตโนมัติ

## รายละเอียดการเปลี่ยนแปลง

### 1. `playwright.config.ts`

เปลี่ยน `use.video` จาก `"retain-on-failure"` เป็น `"on"`
Playwright จะแนบ attachment ชื่อ `"video"` (contentType `video/webm`, มีฟิลด์ `path`)
ตอนจบทุกเทสต์ ทั้ง pass และ fail

ไม่แตะ `screenshot` (`"on"` อยู่แล้ว) และ `trace` (`"on-first-retry"` อยู่แล้ว)

ยกเว้น project `wiki-screenshots` ที่ตั้ง `video: "off"` ใน `use:` ของ project — เพราะ
batch job นั้นสร้าง browser context เองและ navigate หลายร้อย route ที่ไม่มี TC ID วิดีโอ
จึงไม่ถูกคัดลอกเข้า `videos/` และมีแต่จะทำให้ `test-results/` บวมโดยเปล่าประโยชน์

### 2. โฟลเดอร์เก็บวิดีโอ

- โฟลเดอร์ใหม่ที่ root ของ repo: `videos/` (คู่ขนานกับ `screenshots/`)
- รูปแบบไฟล์: `videos/TC-L00101.webm` — 1 ไฟล์ต่อ TC ID เขียนทับของเดิมทุกรัน
- เพิ่มบรรทัด `videos/` ใน `.gitignore`

### 3. `tests/reporters/tc-json-reporter.ts`

- เพิ่มฟิลด์ `video: string` ใน interface `TCResultRow`
  (เก็บ relative path เช่น `videos/TC-L00101.webm`; ว่าง `""` ถ้าไม่มีวิดีโอ)
- เพิ่ม helper คู่ขนานกับของ screenshot:
  - `findVideoPath(attachments)` — หา attachment ตัวแรกที่ `name === "video"` และมี `path`
  - `copyVideo(srcPath, destDir, testId)` — `mkdirSync` + `copyFileSync` ไป `<destDir>/<testId>.webm`
- เพิ่มค่า config `videosDir` (ดีฟอลต์ `videos`) resolve เทียบ `process.cwd()`
  (field ใหม่ `videosRelDir` / `videosAbsDir` ใน constructor เหมือน screenshot)
- ใน `onTestEnd`:
  - หา video attachment ด้วย `findVideoPath(result.attachments)`
  - ถ้าพบ: `copyVideo(...)` สำหรับ **ทุก** TC ID ที่ match ในชื่อเทสต์ (คัดลอกวิดีโอเดียวกัน
    ไปทุก ID เหมือน screenshot) แล้วบันทึก relative path (`videos/<TCID>.webm`) ลงฟิลด์
    `video` ของแต่ละ row
  - ถ้าไม่พบ attachment หรือ copy ล้มเหลว: ฟิลด์ `video` เป็น `""`
- **การกันความเปราะ (try/catch + warn)**: วิดีโอของ Playwright ถูก finalize ตอน browser
  context ปิด — ปกติพร้อมก่อน `onTestEnd` ถูกเรียก แต่ห่อ `copyVideo(...)` ด้วย `try/catch`
  เพื่อกันกรณีขอบ (เช่น ไฟล์ยังไม่ flush, สิทธิ์เขียนไม่พอ) ไม่ให้ error ทำให้ทั้ง reporter ล้ม
  เมื่อ copy ล้มเหลวจะ `console.warn` (ตามสไตล์ log เดิมของ `onEnd`) แทนการ silent-drop
  เพื่อให้เห็นว่ามีวิดีโอตกหล่น — ดีกว่า `existsSync` guard ที่จะข้ามเงียบ ๆ โดยไม่มีสัญญาณ
- พฤติกรรม retry: `onTestEnd` ถูกเรียกต่อ attempt — attempt ล่าสุดเขียนทับไฟล์
  (ตรงกับข้อกำหนด "รันล่าสุดทับ")
- อัปเดต doc comment หัวไฟล์ให้สะท้อนฟิลด์ `video` ใหม่, เพิ่ม `video` ใน list ของ
  "Reporter-populated fields", และเพิ่ม `"video": "videos/TC-L00101.webm"` ในตัวอย่าง row shape

### 4. `scripts/sync-test-results.ts`

- เพิ่ม `"Video"` เข้า array `CANONICAL_HEADER` (ต่อจาก `"Screenshot"`)
  ฟังก์ชัน `ensureHeaders` เดิมจะ auto-append คอลัมน์ที่ขาดให้ tab เก่าโดยอัตโนมัติ
- resolve `videoCol = header.indexOf("Video")`
- ปฏิบัติเป็น **reporter-owned column** (overwrite ทุกครั้ง เหมือน Status/Run Date/Screenshot):
  - ใน path append: `if (videoCol >= 0) row[videoCol] = r.video`
  - ใน path update: `push(videoCol, r.video)`
- เก็บค่าเป็น string path ธรรมดา (valueInputOption ปัจจุบันเป็น `"RAW"` จึงไม่ parse สูตร)

## จุดที่ไม่แตะ (นอกขอบเขต)

- screenshot pipeline ทั้งหมดคงเดิม (ทำเสร็จแล้ว)
- HTML report ยังฝังวิดีโอให้ตามปกติ (เป็นของแถม ไม่ต้องแก้)
- `trace` setting คงเดิม (`on-first-retry`)
- ไม่ลด resolution / bitrate ของวิดีโอ (ใช้ default ของ Playwright) — ปรับภายหลังได้ถ้าขนาดเป็นปัญหา
- `seq`, การ sort by testId, การ map spec file และ logic อื่น ๆ ของ reporter คงเดิม
- ไม่ทำลิงก์แบบ `=HYPERLINK(...)` คลิกได้ (เก็บ path เป็น string) — เพิ่มภายหลังได้

## การทดสอบ / ตรวจรับ

1. รันเทสต์โมดูลเล็ก ๆ (เช่น `bun run test:login` หรือ 1 spec) แล้วยืนยันว่า:
   - มีไฟล์ `videos/TC-XXXXXX.webm` เกิดขึ้นสำหรับเทสต์ที่ pass ด้วย (ไม่ใช่เฉพาะ fail)
   - JSON ใน `tests/results/<spec>-results.json` มีฟิลด์ `video` ชี้ไป path ที่ถูกต้อง
   - ฟิลด์ `screenshot` เดิมยังทำงานปกติ (ไม่ regress)
2. ยืนยัน `videos/` ถูก gitignore (`git status` ไม่ขึ้นไฟล์วิดีโอ)
3. (ถ้ามี credential) รัน `bun e2e:sync` แล้วยืนยันว่า Sheet มีคอลัมน์ `Video` พร้อม path
