# Email Profile — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/email-profile` (`email-profile.route.tsx`, `email-profile-dialog.tsx`, `email-profile-test-dialog.tsx`, `email-profile-schema.ts`) plus `hooks/use-email-profiles.ts`, `types/email-profile.ts`, `constant/module-list.ts` และข้อความจาก `messages/en.json`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Platform / System Admin — Email Profile
**Frontend route:** `routes/system-admin/email-profile`  •  **URL:** `/system-admin/email-profile`
**Prefix:** `EPROF`
**Default role:** Platform Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 30

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **Route ไม่มี permission guard** — ใน `routes/router.tsx` เส้นทาง `system-admin/email-profile` อยู่ใต้ `ProtectedShell` ซึ่งห่อด้วย `RequireAuth` เท่านั้น (เช็ค token เฉย ๆ) ไม่มี `RouteGuard` ระดับหน้า สิทธิ์ `PERMISSIONS.system_configuration.view` และ `licenseFeature: "configuration.app_config"` ถูกประกาศไว้ที่ `constant/module-list.ts` เท่านั้น จึงมีผลแค่การ **แสดง/ซ่อนเมนู** ไม่ได้บล็อกการเปิด URL ตรง ๆ — เคสในบล็อก 10 จึงยืนยันเท่าที่โค้ดบังคับจริง (redirect เมื่อไม่มี token, เมนูไม่ขึ้นเมื่อไม่มีสิทธิ์) การกันระดับข้อมูลเป็นหน้าที่ backend
> 2. **ไม่มี search / filter / pagination / หน้ารายละเอียด** — โปรไฟล์ทั้งหมดเก็บรวมกันเป็น array เดียวใน app-config key `email_profiles` แสดงด้วยตาราง HTML ธรรมดา (ไม่ใช่ `DataGrid`) จึงไม่มีเทสเคสกลุ่มค้นหา/กรอง และไม่มีบล็อก 02
> 3. **การบันทึกเป็นการเขียนทับทั้งก้อน** — `save()` ยิง `PUT /app-config/email_profiles` พร้อม `profiles[]` ทั้งชุดเสมอ ไม่ใช่ partial update (ดู TC-EPROF-040005)
> 4. **การส่งเมลทดสอบต้องพึ่ง SMTP จริง** — เรียก `POST` endpoint `APP_CONFIG_TEST_EMAIL_PROFILE` และ **HTTP 200 ไม่ได้แปลว่าส่งสำเร็จ** โค้ดอ่าน `response.data.sent` ต่ออีกชั้น ถ้าสภาพแวดล้อมทดสอบไม่มี SMTP ที่ใช้ได้จริง TC-EPROF-300002 จะผ่านไม่ได้ ให้กันไว้เป็นเคสที่ต้องเตรียมข้อมูลก่อน
> 5. **ข้อความ validation ของฟอร์มหลักมาจาก zod v4 ค่าเริ่มต้น** — `email-profile-schema.ts` ไม่ได้ใส่ข้อความเอง เคสในบล็อก 20 จึงยืนยันว่า `FieldError` ปรากฏใต้ช่องและฟอร์มไม่ถูก submit ไม่ยืนยันสตริงตรงตัว ส่วน dialog ส่งทดสอบมีข้อความของตัวเองคือ "Enter a valid email address" (`test.invalidEmail`) ซึ่งอ้างได้ตรง ๆ
> 6. **รหัสผ่าน SMTP ที่ backend คืนมาเป็นค่า mask** `***ENCRYPTED***` (`SECRET_MASK`) เสมอ ไม่ใช่รหัสผ่านจริง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EPROF-010001 | แสดงตารางรายการโปรไฟล์อีเมล | High | Smoke |
| TC-EPROF-010002 | แสดงข้อความว่างเมื่อยังไม่มีโปรไฟล์ | Medium | Functional |
| TC-EPROF-010003 | แสดง badge Default และสถานะ Enabled/Disabled ในตาราง | Medium | Functional |
| TC-EPROF-030001 | สร้างโปรไฟล์อีเมลใหม่สำเร็จ | High | CRUD |
| TC-EPROF-030002 | โปรไฟล์แรกของ BU กลายเป็นค่าเริ่มต้นอัตโนมัติ | High | Happy Path |
| TC-EPROF-030003 | ค่าตั้งต้นของฟอร์มสร้าง (Port 587, Implicit TLS, Enabled) | Low | Functional |
| TC-EPROF-030004 | ยกเลิก dialog สร้าง แล้วไม่มีโปรไฟล์ถูกเพิ่ม | Medium | Alternate Flow |
| TC-EPROF-040001 | แก้ไขชื่อและข้อมูลผู้ส่งแล้วค่าคงอยู่ | High | CRUD |
| TC-EPROF-040002 | แก้ไขโปรไฟล์โดยไม่แตะรหัสผ่าน (คงรหัสผ่านเดิม) | High | Functional |
| TC-EPROF-040003 | กด Change password แล้วเปลี่ยนใจด้วย Keep the stored password | Medium | Alternate Flow |
| TC-EPROF-040004 | ปิดใช้งานโปรไฟล์ด้วย checkbox Enabled | Medium | CRUD |
| TC-EPROF-040005 | แก้ไขโปรไฟล์หนึ่งแล้วโปรไฟล์อื่นยังอยู่ครบ | High | Functional |
| TC-EPROF-050001 | ลบโปรไฟล์ที่ไม่ใช่ค่าเริ่มต้นสำเร็จ | High | CRUD |
| TC-EPROF-050002 | ยกเลิกการลบใน DeleteDialog | Medium | Alternate Flow |
| TC-EPROF-050003 | ปุ่มลบถูกปิดใช้งานพร้อม tooltip เมื่อเป็นค่าเริ่มต้นและมีมากกว่า 1 โปรไฟล์ | High | Negative |
| TC-EPROF-100001 | ผู้ใช้ที่ยังไม่ได้ login ถูกส่งกลับหน้า /login | High | Auth-guard |
| TC-EPROF-100002 | เมนู Email Profiles ไม่ปรากฏสำหรับผู้ใช้ที่ไม่มีสิทธิ์ system_configuration.view | High | Authorization |
| TC-EPROF-100003 | ฟอร์มแก้ไขไม่เปิดเผยรหัสผ่าน SMTP | High | Security |
| TC-EPROF-200001 | บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับว่าง | High | Validation |
| TC-EPROF-200002 | From email รูปแบบไม่ถูกต้อง | High | Validation |
| TC-EPROF-200003 | Port นอกช่วง 1–65535 | Medium | Validation |
| TC-EPROF-300001 | เปิด dialog ส่งเมลทดสอบ โดยช่องปลายทางตั้งต้นเป็น From email | High | Functional |
| TC-EPROF-300002 | ส่งเมลทดสอบสำเร็จ | High | Happy Path |
| TC-EPROF-300003 | ส่งเมลทดสอบไม่สำเร็จ แล้ว dialog ยังเปิดค้างไว้ | Medium | Negative |
| TC-EPROF-300004 | กรอกอีเมลปลายทางไม่ถูกต้องใน dialog ทดสอบ | Medium | Validation |
| TC-EPROF-300005 | กด Enter ในช่อง Send to เพื่อส่งเมลทดสอบ | Low | Alternate Flow |
| TC-EPROF-400001 | ตั้งโปรไฟล์อื่นเป็นค่าเริ่มต้น | High | Functional |
| TC-EPROF-900001 | ลบจนเหลือโปรไฟล์เดียว แล้วโปรไฟล์นั้นกลายเป็นค่าเริ่มต้น | Medium | Edge Case |
| TC-EPROF-900002 | เปิด dialog เพิ่มใหม่หลังจากเพิ่งแก้ไข แล้วฟอร์มว่างเปล่า | Medium | Edge Case |
| TC-EPROF-900003 | แสดง ErrorState และซ่อนปุ่ม Add profile เมื่อโหลดค่าไม่สำเร็จ | Medium | Edge Case |

---
## TC-EPROF-010001 — แสดงตารางรายการโปรไฟล์อีเมล
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; app-config key `email_profiles` มีอย่างน้อย 1 โปรไฟล์
**Steps**
1. ไปที่ `/system-admin/email-profile`
2. รอให้ skeleton หายไป
**Expected**
หัวข้อหน้าแสดง "Email Profiles" พร้อมคำอธิบาย "Sender profiles used to email purchase orders and other documents to vendors."; ปุ่ม "Add profile" ปรากฏที่มุมขวาบน; ตารางแสดงหัวคอลัมน์ Name, From, Status และ Row actions พร้อมแถวข้อมูลของแต่ละโปรไฟล์

---
## TC-EPROF-010002 — แสดงข้อความว่างเมื่อยังไม่มีโปรไฟล์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU ที่ยังไม่มี app-config key `email_profiles` หรือมีแต่ `profiles` เป็น array ว่าง
**Steps**
1. ไปที่ `/system-admin/email-profile`
2. รอให้โหลดเสร็จ
**Expected**
ไม่มีตารางแสดง; แสดงข้อความ "No email profiles yet. Add one to start sending documents by email."; ปุ่ม "Add profile" ยังคงกดได้

---
## TC-EPROF-010003 — แสดง badge Default และสถานะ Enabled/Disabled ในตาราง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีอย่างน้อย 2 โปรไฟล์ โดยหนึ่งในนั้นถูกตั้งเป็น `default_profile_id` และมีโปรไฟล์ที่ `enabled = false` อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/email-profile`
2. ตรวจคอลัมน์ Name และ Status ของแต่ละแถว
**Expected**
แถวที่เป็นค่าเริ่มต้นแสดง badge "Default" ต่อท้ายชื่อ (แถวอื่นไม่มี); คอลัมน์ From แสดงค่า from_email; คอลัมน์ Status แสดง badge "Enabled" หรือ "Disabled" ตามค่า enabled ของแต่ละโปรไฟล์

---
## TC-EPROF-030001 — สร้างโปรไฟล์อีเมลใหม่สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/system-admin/email-profile`
**Steps**
1. คลิกปุ่ม "Add profile"
2. กรอก Profile name
3. ในส่วน Sender กรอก From email (รูปแบบอีเมลถูกต้อง) และ From name
4. ในส่วน SMTP server กรอก Host, Port, Username และ Password
5. คลิกปุ่ม "Create"
**Expected**
Dialog ปิดลง; แสดง toast "Email profile created successfully"; โปรไฟล์ใหม่ปรากฏเป็นแถวใหม่ในตารางพร้อมค่า Name และ From ที่กรอกไว้

---
## TC-EPROF-030002 — โปรไฟล์แรกของ BU กลายเป็นค่าเริ่มต้นอัตโนมัติ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
active BU ที่ยังไม่มีโปรไฟล์อีเมลเลย (หน้าแสดงข้อความ empty)
**Steps**
1. คลิกปุ่ม "Add profile"
2. กรอกฟิลด์บังคับให้ครบ (Profile name, From email, Host, Port, Username, Password)
3. คลิกปุ่ม "Create"
**Expected**
แสดง toast "Email profile created successfully"; แถวเดียวในตารางมี badge "Default" ติดอยู่โดยไม่ต้องกด "Set as default"

---
## TC-EPROF-030003 — ค่าตั้งต้นของฟอร์มสร้าง (Port 587, Implicit TLS, Enabled)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/email-profile`
**Steps**
1. คลิกปุ่ม "Add profile"
2. ตรวจค่าตั้งต้นของฟอร์มโดยยังไม่กรอกอะไร
**Expected**
หัวข้อ dialog แสดง "Add Email profile"; ช่อง Port มีค่า 587; checkbox "Implicit TLS" และ "Enabled" ถูกติ๊กไว้; ช่อง Password เปิดให้กรอกได้ทันที (ไม่มีข้อความ "A password is set"); ปุ่ม submit อ่านว่า "Create"

---
## TC-EPROF-030004 — ยกเลิก dialog สร้าง แล้วไม่มีโปรไฟล์ถูกเพิ่ม
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/email-profile` และจำจำนวนแถวในตารางไว้
**Steps**
1. คลิกปุ่ม "Add profile"
2. กรอก Profile name และ From email บางส่วน
3. คลิกปุ่ม "Cancel"
**Expected**
Dialog ปิดลงโดยไม่มี toast; จำนวนแถวในตารางเท่าเดิม; ไม่มีโปรไฟล์ชื่อที่เพิ่งกรอกปรากฏ

---
## TC-EPROF-040001 — แก้ไขชื่อและข้อมูลผู้ส่งแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีโปรไฟล์อีเมลอย่างน้อย 1 รายการในตาราง
**Steps**
1. คลิกปุ่มไอคอนดินสอ (aria-label "Edit") ที่แถวของโปรไฟล์
2. แก้ไข Profile name และ From name
3. คลิกปุ่ม "Save"
4. เปิด dialog แก้ไขของโปรไฟล์เดิมซ้ำ
**Expected**
หัวข้อ dialog แสดง "Edit Email profile"; หลังบันทึกแสดง toast "Email profile updated successfully" และ dialog ปิด; ตารางแสดงชื่อใหม่; เมื่อเปิดซ้ำฟอร์มแสดงค่าที่แก้ไว้

---
## TC-EPROF-040002 — แก้ไขโปรไฟล์โดยไม่แตะรหัสผ่าน (คงรหัสผ่านเดิม)
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีโปรไฟล์ที่บันทึกรหัสผ่าน SMTP ไว้แล้ว (สร้างผ่าน UI มาก่อน)
**Steps**
1. คลิกไอคอนดินสอที่แถวของโปรไฟล์นั้น
2. ตรวจส่วน Password โดยไม่กดอะไร
3. แก้ไขเฉพาะ Profile name
4. คลิกปุ่ม "Save"
**Expected**
ในขั้นที่ 2 ส่วน Password แสดงข้อความ "A password is set" พร้อมปุ่ม "Change password" แทนช่องกรอก; หลังบันทึกแสดง toast "Email profile updated successfully" โดยไม่มี error เรื่องรหัสผ่าน; การส่งเมลทดสอบของโปรไฟล์นั้นยังทำงานได้เหมือนเดิม

---
## TC-EPROF-040003 — กด Change password แล้วเปลี่ยนใจด้วย Keep the stored password
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ใน dialog แก้ไขของโปรไฟล์ที่มีรหัสผ่านเก็บไว้แล้ว
**Steps**
1. คลิกปุ่ม "Change password"
2. สังเกตช่องกรอกรหัสผ่านที่ปรากฏขึ้นมา
3. คลิกปุ่ม "Keep the stored password"
4. คลิกปุ่ม "Save"
**Expected**
ขั้นที่ 2 ช่อง Password (type password) ปรากฏและว่างเปล่า พร้อมปุ่ม "Keep the stored password"; ขั้นที่ 3 ส่วน Password กลับไปแสดง "A password is set" พร้อมปุ่ม "Change password" และ error ใต้ช่องรหัสผ่าน (ถ้ามี) หายไป; ขั้นที่ 4 บันทึกสำเร็จพร้อม toast "Email profile updated successfully"

---
## TC-EPROF-040004 — ปิดใช้งานโปรไฟล์ด้วย checkbox Enabled
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีโปรไฟล์ที่สถานะเป็น "Enabled" อยู่ในตาราง
**Steps**
1. คลิกไอคอนดินสอที่แถวของโปรไฟล์นั้น
2. เอาเครื่องหมายออกจาก checkbox "Enabled"
3. คลิกปุ่ม "Save"
**Expected**
แสดง toast "Email profile updated successfully"; คอลัมน์ Status ของแถวนั้นเปลี่ยนเป็น badge "Disabled"

---
## TC-EPROF-040005 — แก้ไขโปรไฟล์หนึ่งแล้วโปรไฟล์อื่นยังอยู่ครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีโปรไฟล์อย่างน้อย 2 รายการ และจดชื่อ/From ของทุกแถวไว้ก่อน
**Steps**
1. คลิกไอคอนดินสอที่แถวแรก
2. แก้ไข Profile name
3. คลิกปุ่ม "Save"
4. รอให้ตารางรีเฟรช
**Expected**
จำนวนแถวเท่าเดิม; โปรไฟล์ที่ไม่ได้แก้ยังแสดงชื่อและ From เดิมครบทุกแถว; badge "Default" ยังอยู่ที่โปรไฟล์เดิม (การบันทึกส่ง `profiles[]` ทั้งชุด จึงต้องไม่มีรายการหายไป)

---
## TC-EPROF-050001 — ลบโปรไฟล์ที่ไม่ใช่ค่าเริ่มต้นสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีโปรไฟล์อย่างน้อย 2 รายการ และเลือกแถวที่ **ไม่มี** badge "Default"
**Steps**
1. คลิกปุ่มไอคอนถังขยะ (aria-label "Delete") ที่แถวนั้น
2. อ่านข้อความยืนยันใน dialog
3. คลิกปุ่ม "Delete" เพื่อยืนยัน
**Expected**
Dialog ยืนยันแสดงหัวข้อ "Delete email profile" และข้อความ `Delete "<ชื่อโปรไฟล์>"? This cannot be undone.`; หลังยืนยันแสดง toast "Email profile deleted successfully"; แถวนั้นหายจากตาราง

---
## TC-EPROF-050002 — ยกเลิกการลบใน DeleteDialog
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีโปรไฟล์ที่ลบได้อย่างน้อย 1 รายการ (ไม่ใช่ค่าเริ่มต้นขณะที่มีหลายโปรไฟล์)
**Steps**
1. คลิกไอคอนถังขยะที่แถวนั้น
2. คลิกปุ่ม "Cancel" ใน dialog ยืนยัน
**Expected**
Dialog ปิดโดยไม่มี toast; แถวเดิมยังอยู่ในตารางครบถ้วน

---
## TC-EPROF-050003 — ปุ่มลบถูกปิดใช้งานพร้อม tooltip เมื่อเป็นค่าเริ่มต้นและมีมากกว่า 1 โปรไฟล์
**Priority:** High · **Test Type:** Negative
**Preconditions**
มีโปรไฟล์อย่างน้อย 2 รายการ และรู้ว่าแถวไหนมี badge "Default"
**Steps**
1. ไปที่แถวที่มี badge "Default"
2. ตรวจสถานะปุ่มไอคอนถังขยะ
3. hover หรือโฟกัสที่ปุ่มไอคอนถังขยะนั้น
**Expected**
ปุ่มลบของแถวค่าเริ่มต้นอยู่ในสถานะ disabled และกดไม่ได้; tooltip แสดงข้อความ "This is the default profile — set another profile as default first"; ไม่มี dialog ยืนยันการลบเปิดขึ้น

---
## TC-EPROF-100001 — ผู้ใช้ที่ยังไม่ได้ login ถูกส่งกลับหน้า /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
Browser context สะอาด ไม่มี token ใน store (ยังไม่ได้ login)
**Steps**
1. เปิด URL `/system-admin/email-profile` โดยตรง
**Expected**
ถูก redirect ไปที่ `/login`; ไม่เห็นหัวข้อ "Email Profiles" หรือข้อมูลโปรไฟล์ใด ๆ

---
## TC-EPROF-100002 — เมนู Email Profiles ไม่ปรากฏสำหรับผู้ใช้ที่ไม่มีสิทธิ์ system_configuration.view
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มี permission `system_configuration.view` (เช่น role ระดับปฏิบัติการ) และ BU ที่ใช้งานไม่มี licenseFeature `configuration.app_config`
**Steps**
1. เปิด module launcher / เมนู System Administration
2. มองหารายการ "Email Profiles"
**Expected**
ไม่มีรายการเมนู "Email Profiles" ให้ผู้ใช้กด (รายการถูกกรองออกด้วย permission + licenseFeature ใน `constant/module-list.ts`)

---
## TC-EPROF-100003 — ฟอร์มแก้ไขไม่เปิดเผยรหัสผ่าน SMTP
**Priority:** High · **Test Type:** Security
**Preconditions**
มีโปรไฟล์ที่บันทึกรหัสผ่าน SMTP ไว้แล้ว
**Steps**
1. คลิกไอคอนดินสอเพื่อเปิด dialog แก้ไข
2. ตรวจส่วน Password
3. คลิกปุ่ม "Change password"
**Expected**
ก่อนกดปุ่ม ฟอร์มไม่แสดงช่องกรอกรหัสผ่านเลย แสดงแค่ข้อความ "A password is set"; หลังกด "Change password" ช่องที่ปรากฏเป็น `type="password"` และมีค่าว่าง (ไม่มีทั้งรหัสผ่านจริงและค่า mask `***ENCRYPTED***` ค้างอยู่)

---
## TC-EPROF-200001 — บันทึกไม่ได้เมื่อเว้นฟิลด์บังคับว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Email profile" (เปิดจากปุ่ม "Add profile")
**Steps**
1. ล้างค่าในช่อง Profile name, From email, Host, Username และ Password ให้ว่างทั้งหมด
2. คลิกปุ่ม "Create"
**Expected**
ฟอร์มไม่ถูก submit และ dialog ยังเปิดอยู่; มีข้อความ error ปรากฏใต้ช่อง Profile name, From email, Host, Username และ Password; ไม่มี toast สร้างสำเร็จ และไม่มีแถวใหม่ในตาราง

---
## TC-EPROF-200002 — From email รูปแบบไม่ถูกต้อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Email profile" และกรอกฟิลด์บังคับอื่นครบแล้ว
**Steps**
1. กรอก From email เป็นค่าที่ไม่ใช่อีเมล เช่น `not-an-email`
2. คลิกปุ่ม "Create"
**Expected**
มีข้อความ error ปรากฏใต้ช่อง From email; dialog ยังเปิดอยู่; ไม่มีโปรไฟล์ถูกสร้าง

---
## TC-EPROF-200003 — Port นอกช่วง 1–65535
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Email profile" และกรอกฟิลด์บังคับอื่นครบแล้ว
**Steps**
1. กรอก Port เป็น `0`
2. คลิกปุ่ม "Create" แล้วสังเกตผล
3. เปลี่ยน Port เป็น `70000` แล้วคลิก "Create" อีกครั้ง
**Expected**
ทั้งสองกรณีมีข้อความ error ปรากฏใต้ช่อง Port; ฟอร์มไม่ถูก submit; ไม่มีโปรไฟล์ถูกสร้าง

---
## TC-EPROF-300001 — เปิด dialog ส่งเมลทดสอบ โดยช่องปลายทางตั้งต้นเป็น From email
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีโปรไฟล์อย่างน้อย 1 รายการ และรู้ค่า From email ของโปรไฟล์นั้น
**Steps**
1. คลิกปุ่มไอคอนเครื่องบินกระดาษ (aria-label "Send test") ที่แถวของโปรไฟล์
2. อ่านหัวข้อ คำอธิบาย และค่าในช่อง Send to
**Expected**
Dialog เปิดพร้อมหัวข้อ "Send test email" และคำอธิบาย `Send a test message through "<ชื่อโปรไฟล์>" to confirm the SMTP settings work.`; ช่อง "Send to" มีค่าตั้งต้นเป็น From email ของโปรไฟล์; มีปุ่ม "Cancel" และ "Send test"

---
## TC-EPROF-300002 — ส่งเมลทดสอบสำเร็จ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีโปรไฟล์ที่ตั้งค่า SMTP ถูกต้องและใช้งานได้จริงในสภาพแวดล้อมทดสอบ (ดูหมายเหตุข้อ 4 ด้านบน); เปิด dialog "Send test email" ของโปรไฟล์นั้นแล้ว
**Steps**
1. กรอกอีเมลปลายทางที่ตรวจสอบได้ในช่อง "Send to"
2. คลิกปุ่ม "Send test"
3. รอให้ spinner หยุด
**Expected**
ระหว่างส่ง ปุ่มและช่องกรอกถูก disable และไอคอนแถวนั้นเปลี่ยนเป็น spinner; เมื่อสำเร็จแสดง toast "Test email sent to <อีเมลปลายทาง>" และ dialog ปิดลงเอง

---
## TC-EPROF-300003 — ส่งเมลทดสอบไม่สำเร็จ แล้ว dialog ยังเปิดค้างไว้
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
มีโปรไฟล์ที่ตั้งค่า SMTP ไม่ถูกต้อง (เช่น Host หรือ Username/Password ผิด) เพื่อให้ backend คืน `sent = false`
**Steps**
1. คลิกไอคอน "Send test" ที่แถวของโปรไฟล์นั้น
2. กรอกอีเมลปลายทางที่ถูกต้องตามรูปแบบ
3. คลิกปุ่ม "Send test"
**Expected**
แสดง toast แบบ error (ข้อความจาก backend หรือข้อความสำรอง "Test email failed"); **dialog ยังเปิดค้างอยู่** พร้อมค่าที่กรอกไว้เพื่อให้แก้ปลายทางแล้วลองใหม่ได้ทันที

---
## TC-EPROF-300004 — กรอกอีเมลปลายทางไม่ถูกต้องใน dialog ทดสอบ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เปิด dialog "Send test email" ของโปรไฟล์ใดก็ได้
**Steps**
1. ล้างค่าในช่อง "Send to" แล้วพิมพ์ `foo@bar` (ไม่มีโดเมนเต็ม)
2. คลิกปุ่ม "Send test"
3. แก้ค่าในช่องให้เป็นอีเมลที่ถูกต้อง
**Expected**
ขั้นที่ 2 แสดงข้อความ error "Enter a valid email address" ใต้ช่อง และไม่มีการยิง request ส่งเมล; ขั้นที่ 3 ข้อความ error หายไปทันทีที่เริ่มพิมพ์

---
## TC-EPROF-300005 — กด Enter ในช่อง Send to เพื่อส่งเมลทดสอบ
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog "Send test email" ของโปรไฟล์ที่ตั้งค่า SMTP ไว้แล้ว
**Steps**
1. คลิกที่ช่อง "Send to"
2. กรอกอีเมลปลายทางที่ถูกต้อง
3. กดปุ่ม Enter บนแป้นพิมพ์
**Expected**
การส่งเมลทดสอบเริ่มทำงานเหมือนกดปุ่ม "Send test" (ปุ่มและช่องถูก disable ระหว่างส่ง) โดยไม่ได้เป็นการ submit ฟอร์มอื่นหรือปิด dialog ทิ้ง

---
## TC-EPROF-400001 — ตั้งโปรไฟล์อื่นเป็นค่าเริ่มต้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีโปรไฟล์อย่างน้อย 2 รายการ และรู้ว่าแถวไหนเป็นค่าเริ่มต้นอยู่เดิม
**Steps**
1. ที่แถวที่ยังไม่ใช่ค่าเริ่มต้น คลิกปุ่ม "Set as default"
2. รอให้ตารางอัปเดต
**Expected**
แสดง toast `"<ชื่อโปรไฟล์>" is now the default profile`; badge "Default" ย้ายมาอยู่ที่แถวที่เพิ่งเลือก และหายจากแถวเดิม; ปุ่ม "Set as default" ไม่ปรากฏในแถวที่เป็นค่าเริ่มต้นแล้ว แต่ไปปรากฏที่แถวเดิมแทน; ชื่อและข้อมูลของทุกโปรไฟล์ไม่เปลี่ยนแปลง

---
## TC-EPROF-900001 — ลบจนเหลือโปรไฟล์เดียว แล้วโปรไฟล์นั้นกลายเป็นค่าเริ่มต้น
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
มีโปรไฟล์ 2 รายการพอดี โดยรายการ A เป็นค่าเริ่มต้นและรายการ B ไม่ใช่
**Steps**
1. คลิกไอคอนถังขยะที่แถว B (แถวที่ไม่ใช่ค่าเริ่มต้น)
2. ยืนยันด้วยปุ่ม "Delete"
3. ตรวจแถวที่เหลือ
**Expected**
แสดง toast "Email profile deleted successfully"; เหลือแถว A เพียงแถวเดียวและมี badge "Default"; ปุ่มลบของแถว A กดได้แล้ว (ไม่ถูก disable อีกต่อไป เพราะเหลือโปรไฟล์เดียว)

---
## TC-EPROF-900002 — เปิด dialog เพิ่มใหม่หลังจากเพิ่งแก้ไข แล้วฟอร์มว่างเปล่า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
มีโปรไฟล์อย่างน้อย 1 รายการที่มีข้อมูลครบ
**Steps**
1. คลิกไอคอนดินสอเพื่อเปิด dialog แก้ไขของโปรไฟล์นั้น แล้วคลิก "Cancel"
2. คลิกปุ่ม "Add profile"
3. ตรวจค่าทุกช่องในฟอร์ม
**Expected**
หัวข้อ dialog เปลี่ยนเป็น "Add Email profile"; Profile name, From email, From name, Host, Username ว่างทั้งหมด; Port กลับไปเป็น 587; ส่วน Password เปิดช่องกรอกให้ (ไม่แสดง "A password is set"); ไม่มีค่าของโปรไฟล์ที่เพิ่งเปิดแก้ไขค้างอยู่

---
## TC-EPROF-900003 — แสดง ErrorState และซ่อนปุ่ม Add profile เมื่อโหลดค่าไม่สำเร็จ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ทำให้คำขออ่าน app-config key `email_profiles` ล้มเหลวด้วย error ที่ไม่ใช่ 404 (เช่น intercept ให้คืน 500)
**Steps**
1. ไปที่ `/system-admin/email-profile`
2. รอให้โหลดเสร็จ
**Expected**
แสดง ErrorState (role="alert") พร้อมข้อความ "Could not load email profiles"; ไม่มีตารางและไม่มีข้อความ empty; ปุ่ม "Add profile" ไม่ปรากฏ
