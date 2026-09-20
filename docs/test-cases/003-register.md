# Register — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/register` (`register.route.tsx`, `register-verify.route.tsx`, `signup-email-form.tsx`, `signup-profile-form.tsx`, `signup-schema.ts`) plus `components/auth/check-inbox.tsx`, `components/auth/redirect-if-authed.tsx`, `components/auth/auth-split-shell.tsx`, `components/auth/floating-field.tsx`, `lib/password-schema.ts`, `lib/auth/auth-api.ts`, `routes/login/login-form.tsx`, `routes/router.tsx` และข้อความจาก `messages/en.json`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Auth (public) — Register
**Frontend route:** `routes/register`  •  **URL:** `/register` (และ `/register/verify`)
**Prefix:** `REG`
**Default role:** ผู้ใช้ที่ยังไม่ได้ล็อกอิน (หน้า public — ไม่มี session, ไม่มี BU)
**Total test cases:** 30

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **ทั้งสอง route เป็น public จริง** — ใน `routes/router.tsx` บรรทัด 21–25 `"/register"` และ `"/register/verify"` เป็น children ของ `AppRoot` โดยตรง **อยู่นอก** `ProtectedShell` (ซึ่งเป็นตัวที่ห่อด้วย `RequireAuth`) จึงเปิดได้โดยไม่ต้องมี token แต่ทั้งคู่ถูกห่อด้วย `RedirectIfAuthed` ในตัวคอมโพเนนต์เอง — คนที่ **มี** token อยู่แล้วจะถูก `<Navigate replace>` ออกไปที่ `resolveNextPath(?next)` หรือ `/dashboard` ทันที (ดูบล็อก 10)
> 2. **flow แบ่งสองขั้นและขั้นที่สองต้องมี token จากอีเมลจริง** — `/register` ขั้นที่หนึ่งยิง `POST /api/auth/signup-request` แล้ว **ยังไม่สร้างบัญชี**; บัญชีถูกสร้างที่ `/register/verify?token=...` ผ่าน `POST /api/auth/register` โดย token มาจากลิงก์ในอีเมลเท่านั้น (ไม่มีทางอ่าน token จาก UI) **เคสในบล็อก 02 (ที่ต้องมีลิงก์ใช้ได้), 03 (030002/030003), 20 (200003–200007), 40 ทั้งบล็อก และ 900002 จึงต้องมี token จริง** — automate ได้ก็ต่อเมื่อมีกล่องจดหมายทดสอบ (mailhog/inbox API) หรือช่องทางขอ token จาก backend โดยตรง มิฉะนั้นเป็นเคส manual
> 3. **ขั้นที่หนึ่งไม่บอกใบ้ว่าอีเมลนั้นมีบัญชีแล้วหรือไม่ โดยตั้งใจ** — backend ตอบเหมือนกันทุกกรณี และข้อความหน้าจอเป็นแบบมีเงื่อนไข "If that address can be signed up, a link is on its way to {email}." ห้ามเขียนเทสที่คาดหวังข้อความต่างกันระหว่างอีเมลที่มี/ไม่มีบัญชี (TC-REG-100003)
> 4. **ลิงก์ที่ไม่มีจริง / หมดอายุ / ถูกใช้แล้ว แสดงหน้าจอเดียวกันทั้งหมด** — backend ตอบ 410 เหมือนกันทุกกรณีโดยตั้งใจ (`verifySignupToken`) จึงยืนยันได้แค่ว่า "จอลิงก์ใช้ไม่ได้" ไม่ใช่สาเหตุ (TC-REG-100004)
> 5. **rate limit ของ `signup-request` คือฝั่ง backend** — โค้ดอ่าน `retry_after` จาก 429 มาตั้งเป็นตัวนับถอยหลังบนปุ่ม (`ERROR_CODES.RATE_LIMITED`) ส่วนคูลดาวน์ 60 วินาทีของปุ่ม "Send again" ใน `CheckInbox` เป็นค่าคงที่ฝั่ง client (`RESEND_COOLDOWN_SECONDS = 60`) **เคส 300002 กินเวลาจริง 60 วินาที** และ 300003 ต้องยิงซ้ำจนชน rate limit จริง หรือ intercept คำตอบให้เป็น 429 — ทั้งคู่ไม่เหมาะกับการรันคู่ขนาน
> 6. **ข้อกำหนดรหัสผ่านฝั่ง frontend เข้มกว่า backend** — `lib/password-schema.ts` บังคับ `PASSWORD_MIN_LENGTH = 8` + ตัวพิมพ์ใหญ่ + ตัวพิมพ์เล็ก + ตัวเลข + อักขระพิเศษ ขณะที่ backend RegisterDto ขอแค่ 6 ตัว เคสบล็อก 20 จึงยืนยันที่ข้อความของ zod ฝั่ง frontend
> 7. **ฟอร์มใช้ `mode: "onTouched"`** — ข้อความ validation จะโผล่เมื่อ blur ช่องที่แตะแล้ว หรือเมื่อกด submit ไม่ใช่ทันทีที่พิมพ์ และทั้งสองฟอร์มตั้ง `noValidate` จึงไม่มี native tooltip ของเบราว์เซอร์มาบัง
> 8. **ข้อความ 409 มีสองแบบและทางออกคนละทาง** — `AUTH_USERNAME_ALREADY_EXISTS` (อีเมลไปตรงกับ *username* ของบัญชีอื่น) แสดง `signup.addressConflict` และ **ต้องไม่มี** ลิงก์ "Sign In"; 409 อื่น ๆ แสดง `signup.alreadyRegistered` พร้อมลิงก์ "Sign In" (TC-REG-400001/400002)
> 9. **แบนเนอร์หลังสมัครสำเร็จอยู่ใน `location.state`** — `navigate("/login", { state: { justRegistered: true } })` แล้ว `login-form.tsx` แสดง `signup.accountReady` ในกล่อง `role="status"` การ reload `/login` จะทำให้แบนเนอร์หาย ให้ assert ทันทีหลัง redirect เท่านั้น
> 10. **ไม่มีบล็อก 04 / 05** — flow นี้ไม่มีการแก้ไขหรือลบ

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-REG-010001 | เปิด `/register` ขณะยังไม่ล็อกอินแล้วเห็นฟอร์มขอลิงก์ | High | Smoke |
| TC-REG-010002 | ลิงก์ "Sign In" จากหน้าสมัครพาไป `/login` | Medium | Functional |
| TC-REG-010003 | เปิด `/register/verify` โดยไม่มี `?token=` | High | Functional |
| TC-REG-020001 | หน้า verify แสดงสถานะกำลังตรวจลิงก์ | Medium | Functional |
| TC-REG-020002 | หน้าจอ "Check your inbox" แสดงอีเมลและอายุลิงก์ | High | Functional |
| TC-REG-020003 | ฟอร์มโปรไฟล์แสดงอีเมลที่ยืนยันแล้วและช่องครบชุด | High | Functional |
| TC-REG-020004 | ปุ่มสลับแสดง/ซ่อนรหัสผ่าน และคำใบ้ข้อกำหนดรหัสผ่าน | Low | Functional |
| TC-REG-030001 | ขอลิงก์ยืนยันด้วยอีเมลที่ถูกรูปแบบสำเร็จ | High | Happy Path |
| TC-REG-030002 | กรอกโปรไฟล์ครบแล้วสร้างบัญชีสำเร็จ | High | Happy Path |
| TC-REG-030003 | สมัครได้โดยไม่กรอกเบอร์โทร (ช่องไม่บังคับ) | Medium | Happy Path |
| TC-REG-100001 | ผู้ใช้ที่ล็อกอินแล้วเปิด `/register` ถูกเด้งออก | High | Auth-guard |
| TC-REG-100002 | ผู้ใช้ที่ล็อกอินแล้วเปิด `/register/verify` ถูกเด้งออกก่อนยิง verify | High | Auth-guard |
| TC-REG-100003 | หน้าขอลิงก์ไม่บอกใบ้ว่าอีเมลนั้นมีบัญชีอยู่แล้วหรือไม่ | High | Security |
| TC-REG-100004 | token ไม่มีจริง / หมดอายุ / ถูกใช้แล้ว แสดงหน้าจอเดียวกัน | High | Security |
| TC-REG-100005 | token ไม่ถูกเก็บลง localStorage หรือ sessionStorage | Medium | Security |
| TC-REG-200001 | ส่งฟอร์มโดยไม่กรอกอีเมล | High | Validation |
| TC-REG-200002 | อีเมลผิดรูปแบบ | High | Validation |
| TC-REG-200003 | ไม่กรอกชื่อ / นามสกุล | High | Validation |
| TC-REG-200004 | รหัสผ่านสั้นกว่า 8 ตัวอักษร | High | Validation |
| TC-REG-200005 | รหัสผ่านไม่ครบองค์ประกอบที่กำหนด | High | Validation |
| TC-REG-200006 | ไม่กรอกช่องยืนยันรหัสผ่าน | Medium | Validation |
| TC-REG-200007 | รหัสผ่านและช่องยืนยันไม่ตรงกัน | High | Validation |
| TC-REG-300001 | เปิดลิงก์จากอีเมลจริงแล้วเข้าฟอร์มโปรไฟล์ | High | Functional |
| TC-REG-300002 | ปุ่ม "Send again" ปลดล็อกเมื่อครบคูลดาวน์ 60 วินาที | Medium | Functional |
| TC-REG-300003 | ขอลิงก์ถี่เกินจนติด rate limit | Medium | Negative |
| TC-REG-400001 | อีเมลนั้นมีบัญชีอยู่แล้ว (409) | High | Negative |
| TC-REG-400002 | อีเมลชนกับ username ของบัญชีอื่น (409 username conflict) | Medium | Negative |
| TC-REG-400003 | ลิงก์หมดอายุระหว่างกรอกฟอร์ม (410) | Medium | Negative |
| TC-REG-900001 | ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะขอลิงก์ | Medium | Edge Case |
| TC-REG-900002 | กดปุ่มสร้างบัญชีซ้ำระหว่างกำลังส่ง | Low | Edge Case |

---
## TC-REG-010001 — เปิด `/register` ขณะยังไม่ล็อกอินแล้วเห็นฟอร์มขอลิงก์
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เบราว์เซอร์ไม่มี session (ไม่ได้โหลด storageState ของ `setup`) และไม่มี access token ใน `tokenStore`
**Steps**
1. ไปที่ `/register`
**Expected**
อยู่ที่ `/register` (ไม่ถูก redirect); การ์ดฟอร์มแสดงหัวข้อ "Create your account" และคำอธิบาย "Enter your email and we will send you a link to finish signing up."; มีช่องเดียวคือ Email address (`#email`) และปุ่ม "Send verification link"

---
## TC-REG-010002 — ลิงก์ "Sign In" จากหน้าสมัครพาไป `/login`
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/register` ในสถานะยังไม่ได้ส่งอีเมล
**Steps**
1. เลื่อนไปที่บรรทัดท้ายฟอร์มที่ขึ้นว่า "Already have an account?"
2. คลิกลิงก์ "Sign In"
**Expected**
นำทางไปที่ `/login` และหน้าล็อกอินแสดงหัวข้อ "Welcome back"

---
## TC-REG-010003 — เปิด `/register/verify` โดยไม่มี `?token=`
**Priority:** High · **Test Type:** Functional
**Preconditions**
ไม่ได้ล็อกอิน
**Steps**
1. ไปที่ `/register/verify` (ไม่มี query string)
2. สังเกตหน้าจอที่ขึ้นทันทีโดยไม่ต้องรอ
3. คลิกปุ่ม "Request a new link"
**Expected**
แสดงหัวข้อ "This link no longer works" พร้อมคำอธิบาย "It has expired or has already been used. Request a new one to continue." โดยไม่มีสถานะกำลังตรวจสอบมาก่อน; หลังคลิกปุ่มนำทางไปที่ `/register`

---
## TC-REG-020001 — หน้า verify แสดงสถานะกำลังตรวจลิงก์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ไม่ได้ล็อกอิน; มี URL ที่มี `?token=` (ค่าใดก็ได้ที่ไม่ว่าง); คำตอบของ `POST /api/auth/signup-token/verify` ยังไม่กลับมา (หน่วงหรือ intercept ให้ช้า)
**Steps**
1. ไปที่ `/register/verify?token=<token ใดก็ได้>`
2. สังเกตหน้าจอระหว่างรอคำตอบ
**Expected**
แสดงหัวข้อ "Create your account" พร้อมคำอธิบาย "Checking your link..." และมี spinner ที่มี `role="status"` และ `aria-label` = "Checking your link..."

---
## TC-REG-020002 — หน้าจอ "Check your inbox" แสดงอีเมลและอายุลิงก์
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/register` และเพิ่งขอลิงก์สำเร็จด้วยอีเมลที่เตรียมไว้ (เช่น `e2e-signup+<uid>@example.com`)
**Steps**
1. สังเกตการ์ดที่แสดงหลังส่งคำขอสำเร็จ
**Expected**
หัวข้อเปลี่ยนเป็น "Check your inbox"; คำอธิบายขึ้นว่า "If that address can be signed up, a link is on its way to <อีเมลที่กรอก>."; มีข้อความ "The link expires in 24 hours."; ปุ่มส่งซ้ำอยู่ในสถานะปิดและขึ้นป้าย "Send again in {n}s"; มีลิงก์ "Sign In" ที่ท้ายการ์ด

---
## TC-REG-020003 — ฟอร์มโปรไฟล์แสดงอีเมลที่ยืนยันแล้วและช่องครบชุด
**Priority:** High · **Test Type:** Functional
**Preconditions**
ไม่ได้ล็อกอิน; มี token สมัครที่ยังใช้ได้จริงจากอีเมล (ดูหมายเหตุข้อ 2)
**Steps**
1. ไปที่ `/register/verify?token=<token ที่ใช้ได้>`
2. รอให้สถานะตรวจลิงก์จบ
**Expected**
หัวข้อ "Create your account" พร้อมคำอธิบาย "Set your name and password to finish creating your account."; มีบรรทัด "<อีเมล> verified" พร้อมไอคอนถูก; ฟอร์มมีช่อง First name, Last name, Phone (optional), Password, Confirm password และปุ่ม "Create account"

---
## TC-REG-020004 — ปุ่มสลับแสดง/ซ่อนรหัสผ่าน และคำใบ้ข้อกำหนดรหัสผ่าน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. สังเกตข้อความใต้ช่อง Password ขณะยังไม่มี error
2. พิมพ์รหัสผ่านลงช่อง Password
3. คลิกปุ่มที่มี `aria-label` = "Show password"
4. คลิกปุ่มนั้นอีกครั้ง
**Expected**
ใต้ช่อง Password แสดงคำใบ้ "At least 8 characters, with an uppercase and lowercase letter, a number, and a special character."; หลังคลิกครั้งแรก `#password` เปลี่ยน `type` เป็น `text` และ `aria-label` ของปุ่มเปลี่ยนเป็น "Hide password"; หลังคลิกซ้ำกลับเป็น `type="password"` และ "Show password"

---
## TC-REG-030001 — ขอลิงก์ยืนยันด้วยอีเมลที่ถูกรูปแบบสำเร็จ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
ไม่ได้ล็อกอิน; อยู่ที่ `/register`; อีเมลที่ใช้ยังไม่เคยขอลิงก์ในหน้าต่าง rate limit ล่าสุด
**Steps**
1. กรอกอีเมลที่ถูกรูปแบบลงช่อง Email address
2. คลิกปุ่ม "Send verification link"
**Expected**
ระหว่างส่งปุ่มถูกปิดและขึ้นป้าย "Sending..."; เมื่อสำเร็จหน้าจอเปลี่ยนเป็นการ์ด "Check your inbox" และ URL ยังเป็น `/register`

---
## TC-REG-030002 — กรอกโปรไฟล์ครบแล้วสร้างบัญชีสำเร็จ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
ไม่ได้ล็อกอิน; มี token สมัครที่ยังใช้ได้จริงและยังไม่ถูกใช้ (ดูหมายเหตุข้อ 2)
**Steps**
1. ไปที่ `/register/verify?token=<token ที่ใช้ได้>` แล้วรอฟอร์มโปรไฟล์
2. กรอก First name และ Last name
3. กรอก Password ที่ผ่านข้อกำหนดทั้งหมด และกรอก Confirm password ให้ตรงกัน
4. คลิกปุ่ม "Create account"
**Expected**
นำทางไปที่ `/login` แบบ replace และหน้าล็อกอินแสดงกล่อง `role="status"` ที่มีข้อความ "Your account is ready. Sign in to continue."

---
## TC-REG-030003 — สมัครได้โดยไม่กรอกเบอร์โทร (ช่องไม่บังคับ)
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. กรอก First name, Last name, Password และ Confirm password ให้ครบและถูกต้อง
2. ปล่อยช่อง Phone (optional) ว่างไว้
3. คลิกปุ่ม "Create account"
**Expected**
ไม่มีข้อความ error ใต้ช่อง Phone; บัญชีถูกสร้างและนำทางไปที่ `/login` พร้อมแบนเนอร์ "Your account is ready. Sign in to continue."

---
## TC-REG-100001 — ผู้ใช้ที่ล็อกอินแล้วเปิด `/register` ถูกเด้งออก
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
Login สำเร็จด้วยบัญชีทดสอบใด ๆ (เช่น admin@blueledgers.com) และมี access token อยู่ใน `tokenStore`
**Steps**
1. ไปที่ `/register`
**Expected**
ถูก redirect ออกจาก `/register` ทันที (ไปที่ `/dashboard` หรือปลายทางที่ `?next=` ระบุไว้) และไม่เห็นฟอร์ม "Create your account"

---
## TC-REG-100002 — ผู้ใช้ที่ล็อกอินแล้วเปิด `/register/verify` ถูกเด้งออกก่อนยิง verify
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
Login สำเร็จและมี access token; ดักจับ network request ไว้ก่อนนำทาง
**Steps**
1. เริ่มดักจับคำขอไปยัง `POST /api/auth/signup-token/verify`
2. ไปที่ `/register/verify?token=<token ใดก็ได้>`
**Expected**
ถูก redirect ออกทันที และ **ไม่มี** คำขอ `signup-token/verify` ถูกยิงเลย

---
## TC-REG-100003 — หน้าขอลิงก์ไม่บอกใบ้ว่าอีเมลนั้นมีบัญชีอยู่แล้วหรือไม่
**Priority:** High · **Test Type:** Security
**Preconditions**
ไม่ได้ล็อกอิน; มีอีเมลสองตัว — ตัวหนึ่งเป็นบัญชีที่มีอยู่จริง (เช่น admin@blueledgers.com) อีกตัวเป็นอีเมลที่ไม่มีบัญชีแน่นอน
**Steps**
1. ไปที่ `/register` กรอกอีเมลที่มีบัญชีอยู่จริง แล้วคลิก "Send verification link" แล้วบันทึกหน้าจอผลลัพธ์
2. เปิด `/register` ใหม่ กรอกอีเมลที่ไม่มีบัญชี แล้วคลิก "Send verification link"
**Expected**
ทั้งสองกรณีได้การ์ด "Check your inbox" แบบเดียวกัน ข้อความต่างกันแค่ตัวอีเมลที่แทรกในประโยค "If that address can be signed up, a link is on its way to {email}."; ไม่มีข้อความใดบอกว่าอีเมลนั้นมีบัญชีอยู่แล้ว

---
## TC-REG-100004 — token ไม่มีจริง / หมดอายุ / ถูกใช้แล้ว แสดงหน้าจอเดียวกัน
**Priority:** High · **Test Type:** Security
**Preconditions**
ไม่ได้ล็อกอิน; เตรียม token อย่างน้อยสองแบบ เช่น สตริงที่ไม่มีจริง และ token ที่เคยถูกใช้สมัครไปแล้ว
**Steps**
1. ไปที่ `/register/verify?token=<สตริงที่ไม่มีจริง>` แล้วรอให้ตรวจลิงก์จบ
2. ไปที่ `/register/verify?token=<token ที่ถูกใช้ไปแล้ว>` แล้วรอให้ตรวจลิงก์จบ
**Expected**
ทั้งสองกรณีแสดงหน้าจอเดียวกันคือหัวข้อ "This link no longer works" + คำอธิบาย "It has expired or has already been used. Request a new one to continue." + ปุ่ม "Request a new link"; ไม่มีข้อความใดแยกสาเหตุให้เห็น

---
## TC-REG-100005 — token ไม่ถูกเก็บลง localStorage หรือ sessionStorage
**Priority:** Medium · **Test Type:** Security
**Preconditions**
ไม่ได้ล็อกอิน; มี token สมัครที่ยังใช้ได้จริง
**Steps**
1. ไปที่ `/register/verify?token=<token ที่ใช้ได้>` แล้วรอให้ฟอร์มโปรไฟล์ขึ้น
2. อ่านค่าทั้งหมดใน `localStorage` และ `sessionStorage` ของ origin นี้
**Expected**
ไม่มีคีย์หรือค่าใดใน `localStorage`/`sessionStorage` ที่มีสตริง token อยู่

---
## TC-REG-200001 — ส่งฟอร์มโดยไม่กรอกอีเมล
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/register` ในฟอร์มขอลิงก์ และช่อง Email address ว่าง
**Steps**
1. ปล่อยช่อง Email address ว่างไว้
2. คลิกปุ่ม "Send verification link"
**Expected**
แสดงข้อความ "Email is required" ใต้ช่อง Email address; หน้าจอยังเป็นฟอร์มขอลิงก์เดิม ไม่เปลี่ยนเป็น "Check your inbox"

---
## TC-REG-200002 — อีเมลผิดรูปแบบ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/register` ในฟอร์มขอลิงก์
**Steps**
1. กรอกค่าที่ไม่ใช่อีเมล เช่น `not-an-email` ลงช่อง Email address
2. คลิกปุ่ม "Send verification link"
**Expected**
แสดงข้อความ "Invalid email format" ใต้ช่อง Email address; ไม่มีคำขอ `signup-request` ถูกส่ง และหน้าจอยังเป็นฟอร์มเดิม

---
## TC-REG-200003 — ไม่กรอกชื่อ / นามสกุล
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. ปล่อย First name และ Last name ว่างไว้
2. กรอก Password และ Confirm password ให้ถูกต้องและตรงกัน
3. คลิกปุ่ม "Create account"
**Expected**
แสดง "First Name is required" ใต้ช่อง First name และ "Last Name is required" ใต้ช่อง Last name; ยังอยู่ที่ `/register/verify` และไม่มีการสร้างบัญชี

---
## TC-REG-200004 — รหัสผ่านสั้นกว่า 8 ตัวอักษร
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. กรอก First name และ Last name ให้ครบ
2. กรอก Password เป็น `Ab1!` (7 ตัวอักษรหรือน้อยกว่า) และกรอก Confirm password ให้ตรงกัน
3. คลิกปุ่ม "Create account"
**Expected**
แสดงข้อความ "Password must be at least 8 characters" ใต้ช่อง Password; ฟอร์มไม่ถูกส่ง

---
## TC-REG-200005 — รหัสผ่านไม่ครบองค์ประกอบที่กำหนด
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>` และกรอก First name / Last name ไว้แล้ว
**Steps**
1. กรอก Password ยาวอย่างน้อย 8 ตัวแต่มีแต่ตัวพิมพ์เล็ก เช่น `abcdefgh` แล้วคลิก "Create account"
2. เปลี่ยนเป็น `ABCDEFGH` แล้วคลิกอีกครั้ง
3. เปลี่ยนเป็น `Abcdefgh` แล้วคลิกอีกครั้ง
4. เปลี่ยนเป็น `Abcdefg1` แล้วคลิกอีกครั้ง
**Expected**
ขั้นที่ 1 แสดง "Must contain at least one uppercase letter"; ขั้นที่ 2 แสดง "Must contain at least one lowercase letter"; ขั้นที่ 3 แสดง "Must contain at least one number"; ขั้นที่ 4 แสดง "Must contain at least one special character"; ทุกขั้นฟอร์มไม่ถูกส่ง

---
## TC-REG-200006 — ไม่กรอกช่องยืนยันรหัสผ่าน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. กรอก First name, Last name และ Password ที่ผ่านข้อกำหนดทั้งหมด
2. ปล่อยช่อง Confirm password ว่างไว้
3. คลิกปุ่ม "Create account"
**Expected**
แสดงข้อความ "Please confirm your password" ใต้ช่อง Confirm password; ฟอร์มไม่ถูกส่ง

---
## TC-REG-200007 — รหัสผ่านและช่องยืนยันไม่ตรงกัน
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`
**Steps**
1. กรอก First name และ Last name ให้ครบ
2. กรอก Password เป็นค่าที่ผ่านข้อกำหนด เช่น `Passw0rd!`
3. กรอก Confirm password เป็นค่าอื่นที่ผ่านข้อกำหนดเช่นกัน เช่น `Passw0rd!x`
4. คลิกปุ่ม "Create account"
**Expected**
แสดงข้อความ "Passwords do not match" ใต้ช่อง Confirm password (ไม่ใช่ใต้ช่อง Password); ฟอร์มไม่ถูกส่ง

---
## TC-REG-300001 — เปิดลิงก์จากอีเมลจริงแล้วเข้าฟอร์มโปรไฟล์
**Priority:** High · **Test Type:** Functional
**Preconditions**
ไม่ได้ล็อกอิน; มีกล่องจดหมายทดสอบที่เข้าถึงได้ และ backend ส่งอีเมลสมัครได้จริง
**Steps**
1. ไปที่ `/register` กรอกอีเมลของกล่องจดหมายทดสอบ แล้วคลิก "Send verification link"
2. เปิดกล่องจดหมายทดสอบและรออีเมลลิงก์ยืนยัน
3. เปิดลิงก์ในอีเมลนั้น
**Expected**
เบราว์เซอร์มาที่ `/register/verify?token=...` และเมื่อตรวจลิงก์เสร็จ แสดงฟอร์มโปรไฟล์พร้อมบรรทัด "<อีเมลที่กรอกไว้> verified"

---
## TC-REG-300002 — ปุ่ม "Send again" ปลดล็อกเมื่อครบคูลดาวน์ 60 วินาที
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่การ์ด "Check your inbox" หลังขอลิงก์สำเร็จ; เผื่อเวลารันอย่างน้อย 60 วินาที
**Steps**
1. สังเกตปุ่มส่งซ้ำทันทีหลังเข้าการ์ด
2. รอจนตัวนับถอยหลังถึง 0
3. คลิกปุ่ม "Send again"
**Expected**
ตอนแรกปุ่มถูกปิดและขึ้นป้าย "Send again in {n}s" โดย n นับถอยหลังลง; เมื่อครบปุ่มกดได้และป้ายเปลี่ยนเป็น "Send again"; หลังคลิกและคำขอสำเร็จ ปุ่มกลับไปนับถอยหลังใหม่จาก 60

---
## TC-REG-300003 — ขอลิงก์ถี่เกินจนติด rate limit
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ไม่ได้ล็อกอิน; อีเมลเดิมถูกใช้ขอลิงก์จนเกินโควตาของ backend แล้ว หรือ intercept คำตอบของ `POST /api/auth/signup-request` ให้เป็น 429 พร้อม `retry_after`
**Steps**
1. ไปที่ `/register` กรอกอีเมลเดิม
2. คลิกปุ่ม "Send verification link"
**Expected**
แสดงกล่องแจ้งเตือน `role="alert"` ที่มีข้อความ "Too many attempts. Try again in {n}s." (หรือ "Too many attempts. Please wait a moment and try again." เมื่อคำตอบไม่มี `retry_after`); ปุ่มถูกปิดและขึ้นป้าย "Send again in {n}s" จนกว่าจะนับครบ

---
## TC-REG-400001 — อีเมลนั้นมีบัญชีอยู่แล้ว (409)
**Priority:** High · **Test Type:** Negative
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>` โดยอีเมลของ token นั้นมีบัญชีอยู่แล้ว หรือ intercept คำตอบของ `POST /api/auth/register` ให้เป็น 409 ที่ไม่มี `code` = `AUTH_USERNAME_ALREADY_EXISTS`
**Steps**
1. กรอกฟอร์มโปรไฟล์ให้ผ่าน validation ครบ
2. คลิกปุ่ม "Create account"
**Expected**
แสดงกล่องแจ้งเตือนข้อความ "This address already has an account. Please sign in instead."; ใต้ฟอร์มมีลิงก์ "Sign In" ที่พาไป `/login`; ยังอยู่ที่ `/register/verify` และค่าที่กรอกไว้ยังอยู่ครบ

---
## TC-REG-400002 — อีเมลชนกับ username ของบัญชีอื่น (409 username conflict)
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`; backend ตอบ 409 พร้อม `code` = `AUTH_USERNAME_ALREADY_EXISTS` (เตรียมข้อมูลจริง หรือ intercept คำตอบ)
**Steps**
1. กรอกฟอร์มโปรไฟล์ให้ผ่าน validation ครบ
2. คลิกปุ่ม "Create account"
**Expected**
แสดงกล่องแจ้งเตือนข้อความ "This address is already used as the username of another account, so it cannot be signed up here. Please contact your administrator to resolve it."; **ไม่มี** ลิงก์ "Sign In" ใต้ฟอร์ม; ยังอยู่ที่ `/register/verify`

---
## TC-REG-400003 — ลิงก์หมดอายุระหว่างกรอกฟอร์ม (410)
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`; token หมดอายุหรือถูกใช้ไปแล้วก่อนกดส่ง หรือ intercept คำตอบของ `POST /api/auth/register` ให้เป็น 410
**Steps**
1. กรอก First name, Last name, Password และ Confirm password ให้ครบและถูกต้อง
2. คลิกปุ่ม "Create account"
**Expected**
แสดงกล่องแจ้งเตือนข้อความ "This link expired while you were filling in the form. Request a new one — your details are still here."; ค่าที่กรอกไว้ในทุกช่องยังอยู่ครบไม่ถูกล้าง; ไม่มีลิงก์ "Sign In" ใต้ฟอร์ม

---
## TC-REG-900001 — ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะขอลิงก์
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/register`; ทำให้คำขอ `POST /api/auth/signup-request` ล้มเหลวระดับเครือข่าย (abort / offline / intercept แล้ว fail)
**Steps**
1. กรอกอีเมลที่ถูกรูปแบบ
2. คลิกปุ่ม "Send verification link"
**Expected**
แสดงกล่องแจ้งเตือน `role="alert"` ที่มีข้อความ "Could not reach the server. Check your connection and try again."; หน้าจอยังเป็นฟอร์มขอลิงก์ และอีเมลที่กรอกไว้ยังอยู่

---
## TC-REG-900002 — กดปุ่มสร้างบัญชีซ้ำระหว่างกำลังส่ง
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ในฟอร์มโปรไฟล์ที่ `/register/verify?token=<token ที่ใช้ได้>`; หน่วงคำตอบของ `POST /api/auth/register` ให้ช้าพอสังเกตสถานะระหว่างส่งได้
**Steps**
1. กรอกฟอร์มโปรไฟล์ให้ผ่าน validation ครบ
2. เริ่มนับจำนวนคำขอไปยัง `POST /api/auth/register`
3. คลิกปุ่ม "Create account" แล้วพยายามคลิกซ้ำทันทีระหว่างที่ยังส่งอยู่
**Expected**
ระหว่างส่ง ปุ่มอยู่ในสถานะปิดและขึ้นป้าย "Creating account..."; มีคำขอ `POST /api/auth/register` ถูกยิงเพียงครั้งเดียว
