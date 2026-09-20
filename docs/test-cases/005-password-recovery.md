# Password Recovery — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app routes `routes/forgot-password/` และ `routes/reset-password/` พร้อมไฟล์ที่โค้ดอ้างถึง: `components/auth/check-inbox.tsx`, `components/auth/floating-field.tsx`, `components/auth/auth-split-shell.tsx`, `components/auth/redirect-if-authed.tsx`, `lib/auth/auth-api.ts`, `lib/password-schema.ts`, `routes/router.tsx` และข้อความจาก `messages/en.json`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Auth (public) — Password Recovery (ขอลิงก์ลืมรหัสผ่าน → ตั้งรหัสใหม่จากลิงก์)
**Frontend route:** `routes/forgot-password`  •  **URL:** `/forgot-password` (และ `/reset-password`)
**Prefix:** `PWD`
**Default role:** ผู้ใช้ที่ยังไม่ได้ล็อกอิน (หน้า public ทั้งสอง route)
**Total test cases:** 31

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **ปลายทางของลิงก์ในอีเมลไม่ได้ถูกกำหนดจากฝั่ง frontend** — `routes/router.tsx` (บรรทัดเหนือการประกาศ `/forgot-password`) และ doc comment ใน `forgot-password.route.tsx` ระบุตรงกันว่าลิงก์ในอีเมลสร้างจาก platform config คีย์ `password_reset.base_url` ถ้าค่านั้นไม่ได้ชี้มาที่ `/reset-password` ของแอปนี้ ลิงก์ในอีเมลจะพาผู้ใช้ไปที่อื่น **ทั้งที่หน้าจอทั้งสองฝั่งทำงานถูกต้อง** — เวลาเคสในบล็อก 30 ล้มเหลว ให้ตรวจค่า config นี้ก่อนจะสรุปว่าโค้ดพัง
> 2. **เคสที่ automate ไม่ได้ถ้าไม่มีอีเมล/token จริง**: TC-PWD-040001, TC-PWD-300001, TC-PWD-300002, TC-PWD-300003 — ทั้งสี่เคสต้องมี token ที่ backend ออกให้จริงจากกล่องจดหมายจริง (หรือดึงจาก backend/DB โดยตรง) ยังไม่มี helper ในสวีทนี้ที่อ่านอีเมลได้ คนแปลงเป็น spec ต้องเตรียมช่องทางนั้นก่อน มิฉะนั้นให้ทำเป็น manual test เคสที่เหลือใช้ token ปลอม (`?token=<สุ่ม>`) ซึ่งเพียงพอเพราะ backend ตอบ 400 เหมือนกับ token หมดอายุ
> 3. **หน้าจอตอบสนองเหมือนกันไม่ว่าอีเมลจะมีบัญชีหรือไม่** — `forgotPassword()` ใน `lib/auth/auth-api.ts` คืนค่าเงียบ ๆ ทั้ง `res.ok` และ `404` และข้อความบนหน้า Check your inbox เขียนแบบมีเงื่อนไข ("If that address has an account, …") โดยตั้งใจเพื่อกันการสำรวจบัญชี เคส TC-PWD-100003 จึงเขียนตามพฤติกรรมจริงนี้ — **ห้าม** เขียนเคสที่คาดว่าอีเมลไม่มีบัญชีจะต้องได้ error
> 4. **ไม่มี endpoint ตรวจ token ล่วงหน้า** (ต่างจากเส้นทางสมัครที่มี `signup-token/verify`) หน้า `/reset-password` จึงแสดงฟอร์มทันทีทุกกรณีที่มี `?token=` และรู้ว่าลิงก์ตายก็ต่อเมื่อกดส่ง — นี่คือพฤติกรรมตามออกแบบ ไม่ใช่บั๊ก (ดู TC-PWD-900003)
> 5. **error ของสองหน้านี้ไม่ขึ้นเป็น toast** — ทั้งสอง mutation ตั้ง `meta: { skipGlobalErrorToast: true }` ข้อความผิดพลาดจึงอยู่ในกล่อง `AuthFormAlert` ในฟอร์มเท่านั้น spec ต้องรอ alert ในหน้า ไม่ใช่ `toast`
> 6. **สถานะ 429 มีโค้ดรองรับแต่ยังไม่เกิดจริง** — `CheckInbox` แปลง `RATE_LIMITED` เป็นข้อความ "Too many attempts…" แต่คอมเมนต์ใน `forgot-password-form.tsx` ระบุว่า endpoint นี้ยังไม่มี rate limit ฝั่ง backend catalog นี้จึง **ไม่มี** เคสยืนยัน 429 โดยตั้งใจ
> 7. คูลดาวน์ปุ่ม "Send again" คือ 60 วินาทีตายตัว (`RESEND_COOLDOWN_SECONDS`) — TC-PWD-030004 จึงเป็นเคสที่ใช้เวลานาน ควรแยกออกจากชุดที่รันบ่อย
> 8. ข้อความอังกฤษทุกคำที่อ้างในเอกสารนี้คัดจาก `messages/en.json` (namespace `auth.forgotPassword`, `auth.resetPassword`, `validation`) ตรงตัว

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PWD-010001 | เข้าหน้าขอลิงก์จากลิงก์ "Forgot password?" ในหน้า login | High | Smoke |
| TC-PWD-010002 | ลิงก์ "Sign In" ในหน้าขอลิงก์พากลับไป /login | Low | Functional |
| TC-PWD-010003 | ปุ่ม "Request a new link" บนหน้าลิงก์ตายพาไป /forgot-password | Medium | Functional |
| TC-PWD-020001 | หน้า /forgot-password แสดงหัวเรื่อง ช่องอีเมล และปุ่มส่งลิงก์ | High | Smoke |
| TC-PWD-020002 | หน้า /reset-password ที่มี token แสดงฟอร์มตั้งรหัสใหม่ครบสองช่อง | High | Smoke |
| TC-PWD-020003 | เปิด /reset-password โดยไม่มี ?token= แสดงหน้า "This link no longer works" | High | Negative |
| TC-PWD-020004 | ปุ่มแสดง/ซ่อนรหัสผ่านสลับชนิดช่องกรอก | Low | Functional |
| TC-PWD-030001 | ขอลิงก์ด้วยอีเมลที่มีบัญชีจริงแล้วไปหน้า Check your inbox | High | Happy Path |
| TC-PWD-030002 | หน้า Check your inbox แสดงอีเมลที่กรอกและโน้ตหมดอายุ 24 ชั่วโมง | Medium | Functional |
| TC-PWD-030003 | ปุ่ม "Send again" ถูกปิดพร้อมนับถอยหลังทันทีที่เข้าหน้า | Medium | Functional |
| TC-PWD-030004 | ส่งลิงก์ซ้ำได้เมื่อคูลดาวน์ครบ แล้วคูลดาวน์เริ่มนับใหม่ | Low | Functional |
| TC-PWD-030005 | ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะขอลิงก์แสดง alert เครือข่าย | Medium | Negative |
| TC-PWD-040001 | ตั้งรหัสผ่านใหม่สำเร็จด้วย token จริงแล้วถูกพาไป /login พร้อมแถบยืนยัน | High | Happy Path |
| TC-PWD-040002 | กดบันทึกด้วย token ที่ใช้ไม่ได้แสดง alert ว่าลิงก์ตายพร้อมทางขอลิงก์ใหม่ | High | Negative |
| TC-PWD-040003 | ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะบันทึกรหัสใหม่แสดง alert เครือข่าย ไม่ชวนขอลิงก์ใหม่ | Medium | Negative |
| TC-PWD-100001 | ผู้ใช้ที่ล็อกอินอยู่เปิด /forgot-password ถูกเด้งออกจากหน้า | Medium | Auth-guard |
| TC-PWD-100002 | ผู้ใช้ที่ล็อกอินอยู่เปิด /reset-password?token= ถูกเด้งออกก่อนเห็นฟอร์ม | Medium | Auth-guard |
| TC-PWD-100003 | อีเมลที่ไม่มีบัญชีได้หน้าจอเดียวกับอีเมลที่มีบัญชี (กันการสำรวจบัญชี) | High | Security |
| TC-PWD-100004 | token จาก query ไม่ถูกเก็บลง localStorage/sessionStorage | Medium | Security |
| TC-PWD-200001 | ส่งฟอร์มขอลิงก์โดยเว้นอีเมลว่าง | High | Validation |
| TC-PWD-200002 | ส่งฟอร์มขอลิงก์ด้วยอีเมลผิดรูปแบบ | High | Validation |
| TC-PWD-200003 | รหัสผ่านใหม่สั้นกว่า 8 ตัวอักษร | High | Validation |
| TC-PWD-200004 | รหัสผ่านใหม่ขาดตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข หรืออักขระพิเศษ | High | Validation |
| TC-PWD-200005 | เว้นช่องยืนยันรหัสผ่านว่าง | Medium | Validation |
| TC-PWD-200006 | รหัสผ่านยืนยันไม่ตรงกับรหัสใหม่ | High | Validation |
| TC-PWD-300001 | อีเมลขอตั้งรหัสใหม่ส่งถึงจริงและลิงก์พามาที่ /reset-password ของแอปนี้ | High | Integration |
| TC-PWD-300002 | ล็อกอินด้วยรหัสใหม่สำเร็จ และรหัสเดิมใช้ไม่ได้อีก | High | Integration |
| TC-PWD-300003 | ใช้ token เดิมซ้ำครั้งที่สองแล้วลิงก์ตาย | Medium | Integration |
| TC-PWD-900001 | รีเฟรชหน้า /login หลังตั้งรหัสสำเร็จแล้วแถบยืนยันหายไป | Low | Edge Case |
| TC-PWD-900002 | รีโหลดหน้าขณะอยู่จอ Check your inbox กลับไปที่ฟอร์มกรอกอีเมล | Low | Edge Case |
| TC-PWD-900003 | token ที่สุ่มขึ้นมาเองยังเห็นฟอร์ม และรู้ว่าลิงก์ตายเมื่อกดบันทึกเท่านั้น | Medium | Edge Case |

---
## TC-PWD-010001 — เข้าหน้าขอลิงก์จากลิงก์ "Forgot password?" ในหน้า login
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน (ไม่มี access token ใน tokenStore) และอยู่ที่หน้า `/login`
**Steps**
1. ไปที่ `/login`
2. คลิกลิงก์ "Forgot password?" ที่อยู่ใต้ช่องรหัสผ่านชิดขวา
**Expected**
นำทางไปที่ `/forgot-password`; หน้าแสดงหัวเรื่อง "Forgot your password?" และคำอธิบาย "Enter your email and we will send you a link to set a new password."

---
## TC-PWD-010002 — ลิงก์ "Sign In" ในหน้าขอลิงก์พากลับไป /login
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน และอยู่ที่หน้า `/forgot-password` ในขั้นกรอกอีเมล
**Steps**
1. เลื่อนไปท้ายการ์ดฟอร์ม จะเห็นข้อความ "Remembered your password?"
2. คลิกลิงก์ "Sign In" ที่อยู่ถัดจากข้อความนั้น
**Expected**
นำทางกลับไปที่ `/login` และเห็นฟอร์มเข้าสู่ระบบ

---
## TC-PWD-010003 — ปุ่ม "Request a new link" บนหน้าลิงก์ตายพาไป /forgot-password
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน และเปิด `/reset-password` โดยไม่มี query `token` (หน้าแสดง "This link no longer works")
**Steps**
1. คลิกปุ่ม "Request a new link" ที่อยู่ใต้คำอธิบาย
**Expected**
นำทางไปที่ `/forgot-password` และเห็นฟอร์มกรอกอีเมลพร้อมหัวเรื่อง "Forgot your password?"

---
## TC-PWD-020001 — หน้า /forgot-password แสดงหัวเรื่อง ช่องอีเมล และปุ่มส่งลิงก์
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน
**Steps**
1. เปิด `/forgot-password` ตรง ๆ
**Expected**
เห็นหัวเรื่อง "Forgot your password?", คำอธิบาย "Enter your email and we will send you a link to set a new password.", ช่องกรอกอีเมลป้าย "Email address" (type=email), ปุ่ม "Send reset link" ที่กดได้ และลิงก์ "Sign In" ใต้ข้อความ "Remembered your password?"

---
## TC-PWD-020002 — หน้า /reset-password ที่มี token แสดงฟอร์มตั้งรหัสใหม่ครบสองช่อง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; มีค่า token ใด ๆ ต่อท้าย URL (ใช้ค่าสุ่มได้ เพราะหน้าไม่ตรวจ token ล่วงหน้า)
**Steps**
1. เปิด `/reset-password?token=<ค่าใด ๆ>`
**Expected**
เห็นหัวเรื่อง "Set a new password", คำอธิบาย "Choose a new password for your account.", ช่อง "New password" พร้อมคำใบ้ "At least 8 characters, with an uppercase and lowercase letter, a number, and a special character.", ช่อง "Confirm password" และปุ่ม "Save new password"; ไม่มีช่องอีเมลและไม่มีช่องรหัสผ่านเดิม

---
## TC-PWD-020003 — เปิด /reset-password โดยไม่มี ?token= แสดงหน้า "This link no longer works"
**Priority:** High · **Test Type:** Negative
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน
**Steps**
1. เปิด `/reset-password` โดยไม่ใส่ query string ใด ๆ
**Expected**
ไม่มีฟอร์มตั้งรหัสผ่านให้กรอก; เห็นหัวเรื่อง "This link no longer works" คำอธิบาย "It has expired, has already been used, or the address is incomplete. Request a new one to continue." และปุ่ม "Request a new link"

---
## TC-PWD-020004 — ปุ่มแสดง/ซ่อนรหัสผ่านสลับชนิดช่องกรอก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>` และเห็นฟอร์มตั้งรหัสใหม่
**Steps**
1. พิมพ์ข้อความลงช่อง "New password"
2. คลิกปุ่มไอคอนตาในช่องนั้น (aria-label "Show password")
3. คลิกซ้ำอีกครั้ง (aria-label ตอนนี้คือ "Hide password")
**Expected**
หลังคลิกครั้งแรกช่องเปลี่ยนเป็น `type=text` และเห็นข้อความที่พิมพ์; หลังคลิกครั้งที่สองกลับเป็น `type=password`; ช่อง "Confirm password" มีปุ่มแบบเดียวกันและทำงานแยกจากกัน

---
## TC-PWD-030001 — ขอลิงก์ด้วยอีเมลที่มีบัญชีจริงแล้วไปหน้า Check your inbox
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; มีบัญชีทดสอบที่ใช้อีเมลจริงในระบบ (เช่น admin@blueledgers.com)
**Steps**
1. เปิด `/forgot-password`
2. กรอกอีเมลของบัญชีทดสอบในช่อง "Email address"
3. คลิกปุ่ม "Send reset link"
**Expected**
หน้าจอในการ์ดเดิมเปลี่ยนเป็น "Check your inbox" พร้อมข้อความ "If that address has an account, a link to set a new password is on its way to <อีเมลที่กรอก>."; URL ยังเป็น `/forgot-password`; ไม่มีข้อความผิดพลาดใด ๆ

---
## TC-PWD-030002 — หน้า Check your inbox แสดงอีเมลที่กรอกและโน้ตหมดอายุ 24 ชั่วโมง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เพิ่งขอลิงก์สำเร็จจาก TC-PWD-030001 และอยู่บนจอ "Check your inbox"
**Steps**
1. อ่านข้อความบนจอ
**Expected**
คำอธิบายมีอีเมลที่กรอกแทรกอยู่จริง; มีข้อความ "The link expires in 24 hours."; มีปุ่ม "Send again in {seconds}s" และลิงก์ "Sign In" ที่พากลับไป `/login`

---
## TC-PWD-030003 — ปุ่ม "Send again" ถูกปิดพร้อมนับถอยหลังทันทีที่เข้าหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เพิ่งขอลิงก์สำเร็จและอยู่บนจอ "Check your inbox"
**Steps**
1. ดูปุ่มส่งซ้ำทันทีที่จอนี้ปรากฏ
2. รอราว 3 วินาทีแล้วดูอีกครั้ง
**Expected**
ปุ่มอยู่ในสถานะ disabled และแสดงข้อความนับถอยหลังรูปแบบ "Send again in {seconds}s" โดยเริ่มที่ 60 วินาที; ตัวเลขลดลงเองตามเวลาที่ผ่านไป

---
## TC-PWD-030004 — ส่งลิงก์ซ้ำได้เมื่อคูลดาวน์ครบ แล้วคูลดาวน์เริ่มนับใหม่
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่บนจอ "Check your inbox"; เคสนี้ใช้เวลาอย่างน้อย 60 วินาที ควรตั้ง timeout ให้พอ
**Steps**
1. รอจนตัวนับถอยหลังหมด ปุ่มเปลี่ยนเป็น "Send again" และกดได้
2. คลิกปุ่ม "Send again"
**Expected**
คำขอถูกส่งซ้ำสำเร็จ; ปุ่มกลับไปสถานะ disabled พร้อมนับถอยหลังใหม่จาก 60 วินาที; ไม่มีข้อความผิดพลาดปรากฏ

---
## TC-PWD-030005 — ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะขอลิงก์แสดง alert เครือข่าย
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/forgot-password`; จำลองให้คำขอ `POST /api/auth/forgot-password` ล้มเหลวระดับเครือข่าย (เช่น intercept แล้ว abort)
**Steps**
1. กรอกอีเมลรูปแบบถูกต้อง
2. คลิก "Send reset link"
**Expected**
ยังอยู่ที่ฟอร์มกรอกอีเมล (ไม่เปลี่ยนเป็นจอ Check your inbox); มีกล่องข้อความผิดพลาดในฟอร์มระบุ "Could not reach the server. Check your connection and try again."; ไม่มี toast ผุดขึ้น

---
## TC-PWD-040001 — ตั้งรหัสผ่านใหม่สำเร็จด้วย token จริงแล้วถูกพาไป /login พร้อมแถบยืนยัน
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มี token ที่ backend ออกให้จริงและยังไม่หมดอายุ/ยังไม่ถูกใช้ (ต้องได้จากอีเมลจริงหรือจาก backend โดยตรง — automate ไม่ได้ถ้าไม่มีช่องทางนี้); ผู้ใช้ยังไม่ได้ล็อกอิน
**Steps**
1. เปิด `/reset-password?token=<token จริง>`
2. กรอกรหัสผ่านใหม่ที่ผ่านกฎทั้งหมด (ยาว ≥ 8 มีพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ)
3. กรอกรหัสเดียวกันในช่อง "Confirm password"
4. คลิก "Save new password"
**Expected**
ถูกนำทางไปที่ `/login` (แทนที่ประวัติ ไม่ใช่เพิ่มรายการใหม่); เหนือฟอร์มล็อกอินมีแถบยืนยัน "Your password has been changed. Sign in with your new password."; ระบบไม่ล็อกอินให้อัตโนมัติ

---
## TC-PWD-040002 — กดบันทึกด้วย token ที่ใช้ไม่ได้แสดง alert ว่าลิงก์ตายพร้อมทางขอลิงก์ใหม่
**Priority:** High · **Test Type:** Negative
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; ใช้ token ที่ backend ปฏิเสธด้วย 400 (สุ่มขึ้นมาเอง หมดอายุ หรือถูกใช้ไปแล้ว — backend ตอบเหมือนกันทั้งสามกรณี)
**Steps**
1. เปิด `/reset-password?token=<token ที่ใช้ไม่ได้>`
2. กรอกรหัสผ่านใหม่ที่ผ่านกฎทั้งหมดและยืนยันให้ตรงกัน
3. คลิก "Save new password"
**Expected**
ยังอยู่ที่ `/reset-password` และฟอร์มยังอยู่; มีกล่องข้อความผิดพลาดระบุ "This link no longer works — it has expired or has already been used. Request a new one to continue."; ใต้ฟอร์มปรากฏลิงก์ "Request a new link" ที่พาไป `/forgot-password`

---
## TC-PWD-040003 — ติดต่อเซิร์ฟเวอร์ไม่ได้ขณะบันทึกรหัสใหม่แสดง alert เครือข่าย ไม่ชวนขอลิงก์ใหม่
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>`; จำลองให้คำขอ `POST /api/auth/reset-password-with-token` ล้มเหลวระดับเครือข่าย
**Steps**
1. กรอกรหัสผ่านใหม่ที่ผ่านกฎทั้งหมดและยืนยันให้ตรงกัน
2. คลิก "Save new password"
**Expected**
มีกล่องข้อความผิดพลาดระบุ "Could not reach the server. Check your connection and try again."; **ไม่มี** ลิงก์ "Request a new link" ใต้ฟอร์ม (ลิงก์นั้นขึ้นเฉพาะตอนลิงก์ตายจริงเท่านั้น); ค่าที่กรอกไว้ยังอยู่และกดส่งซ้ำได้

---
## TC-PWD-100001 — ผู้ใช้ที่ล็อกอินอยู่เปิด /forgot-password ถูกเด้งออกจากหน้า
**Priority:** Medium · **Test Type:** Auth-guard
**Preconditions**
ล็อกอินสำเร็จแล้ว (มี access token ใน tokenStore)
**Steps**
1. เปิด `/forgot-password`
**Expected**
ถูก redirect ทันทีไปที่ `/dashboard` (หรือปลายทางจาก `?next=` ที่ผ่านการ sanitize) โดยไม่เห็นฟอร์มกรอกอีเมลเลย

---
## TC-PWD-100002 — ผู้ใช้ที่ล็อกอินอยู่เปิด /reset-password?token= ถูกเด้งออกก่อนเห็นฟอร์ม
**Priority:** Medium · **Test Type:** Auth-guard
**Preconditions**
ล็อกอินสำเร็จแล้ว
**Steps**
1. เปิด `/reset-password?token=<ค่าใด ๆ>`
**Expected**
ถูก redirect ไปที่ `/dashboard` โดยไม่เห็นฟอร์มตั้งรหัสผ่านใหม่และไม่มีคำขอตั้งรหัสถูกส่ง

---
## TC-PWD-100003 — อีเมลที่ไม่มีบัญชีได้หน้าจอเดียวกับอีเมลที่มีบัญชี (กันการสำรวจบัญชี)
**Priority:** High · **Test Type:** Security
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; เตรียมอีเมลรูปแบบถูกต้องที่ไม่มีบัญชีในระบบ เช่น `no-such-user-<สุ่ม>@example.com`
**Steps**
1. เปิด `/forgot-password` กรอกอีเมลที่ไม่มีบัญชี แล้วคลิก "Send reset link"
2. บันทึกหน้าจอที่ได้
3. ทำซ้ำข้อ 1 ด้วยอีเมลของบัญชีที่มีจริง
**Expected**
ทั้งสองครั้งได้จอ "Check your inbox" เหมือนกัน พร้อมข้อความ "If that address has an account, a link to set a new password is on its way to …"; ไม่มีข้อความผิดพลาดหรือสัญญาณใดที่บอกว่าอีเมลนั้นมีบัญชีอยู่หรือไม่

---
## TC-PWD-100004 — token จาก query ไม่ถูกเก็บลง localStorage/sessionStorage
**Priority:** Medium · **Test Type:** Security
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน
**Steps**
1. เปิด `/reset-password?token=<ค่าที่จดจำได้ เช่น probe-token-123>`
2. อ่านค่าทั้งหมดใน `localStorage` และ `sessionStorage` ของหน้า
**Expected**
ไม่พบค่า token ดังกล่าวใน storage ทั้งสองชุด (token ถูกอ่านจาก query แล้วส่งไปกับ request เท่านั้น)

---
## TC-PWD-200001 — ส่งฟอร์มขอลิงก์โดยเว้นอีเมลว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/forgot-password` ในขั้นกรอกอีเมล
**Steps**
1. ปล่อยช่อง "Email address" ว่าง
2. คลิกปุ่ม "Send reset link"
**Expected**
ใต้ช่องอีเมลแสดงข้อความ "Email is required"; ช่องถูกทำเครื่องหมาย aria-invalid; ยังอยู่ที่ฟอร์มเดิมและไม่มีคำขอถูกส่ง

---
## TC-PWD-200002 — ส่งฟอร์มขอลิงก์ด้วยอีเมลผิดรูปแบบ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/forgot-password` ในขั้นกรอกอีเมล
**Steps**
1. กรอกค่าที่ไม่ใช่อีเมล เช่น `not-an-email`
2. คลิกปุ่ม "Send reset link"
**Expected**
ใต้ช่องอีเมลแสดงข้อความ "Invalid email format"; ยังอยู่ที่ฟอร์มเดิมและไม่เปลี่ยนไปจอ Check your inbox

---
## TC-PWD-200003 — รหัสผ่านใหม่สั้นกว่า 8 ตัวอักษร
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>` และเห็นฟอร์มตั้งรหัสใหม่
**Steps**
1. กรอก "New password" เป็นค่าที่สั้นกว่า 8 ตัว เช่น `Ab1!x`
2. กรอก "Confirm password" ให้ตรงกัน
3. คลิก "Save new password"
**Expected**
ใต้ช่อง "New password" แสดงข้อความ "Password must be at least 8 characters"; ไม่มีการเรียก API ตั้งรหัสผ่าน

---
## TC-PWD-200004 — รหัสผ่านใหม่ขาดตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข หรืออักขระพิเศษ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>` และเห็นฟอร์มตั้งรหัสใหม่
**Steps**
1. กรอก `abcdefg1!` (ไม่มีตัวพิมพ์ใหญ่) แล้วกด "Save new password" อ่านข้อความที่ได้
2. ทำซ้ำด้วย `ABCDEFG1!` (ไม่มีตัวพิมพ์เล็ก)
3. ทำซ้ำด้วย `Abcdefgh!` (ไม่มีตัวเลข)
4. ทำซ้ำด้วย `Abcdefg12` (ไม่มีอักขระพิเศษ)
**Expected**
แต่ละรอบแสดงข้อความตามกฎที่ขาด ตามลำดับ: "Must contain at least one uppercase letter", "Must contain at least one lowercase letter", "Must contain at least one number", "Must contain at least one special character"; ไม่มีรอบใดบันทึกรหัสผ่านสำเร็จ

---
## TC-PWD-200005 — เว้นช่องยืนยันรหัสผ่านว่าง
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>` และเห็นฟอร์มตั้งรหัสใหม่
**Steps**
1. กรอก "New password" ด้วยรหัสที่ผ่านกฎทั้งหมด
2. ปล่อย "Confirm password" ว่าง
3. คลิก "Save new password"
**Expected**
ใต้ช่อง "Confirm password" แสดงข้อความ "Please confirm your password"; ไม่มีการเรียก API ตั้งรหัสผ่าน

---
## TC-PWD-200006 — รหัสผ่านยืนยันไม่ตรงกับรหัสใหม่
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/reset-password?token=<ค่าใด ๆ>` และเห็นฟอร์มตั้งรหัสใหม่
**Steps**
1. กรอก "New password" ด้วยรหัสที่ผ่านกฎทั้งหมด
2. กรอก "Confirm password" เป็นรหัสอื่นที่ผ่านกฎเช่นกันแต่ไม่ตรงกัน
3. คลิก "Save new password"
**Expected**
ใต้ช่อง "Confirm password" แสดงข้อความ "Passwords do not match"; ไม่มีการเรียก API ตั้งรหัสผ่าน

---
## TC-PWD-300001 — อีเมลขอตั้งรหัสใหม่ส่งถึงจริงและลิงก์พามาที่ /reset-password ของแอปนี้
**Priority:** High · **Test Type:** Integration
**Preconditions**
มีช่องทางอ่านกล่องจดหมายของบัญชีทดสอบจริง (automate ไม่ได้ถ้าไม่มี); platform config คีย์ `password_reset.base_url` ตั้งให้ชี้มาที่โดเมนของแอปที่กำลังทดสอบ
**Steps**
1. เปิด `/forgot-password` กรอกอีเมลของบัญชีทดสอบแล้วคลิก "Send reset link"
2. เปิดกล่องจดหมายของบัญชีนั้นและหาอีเมลตั้งรหัสผ่านใหม่
3. ตรวจ URL ของลิงก์ในอีเมล แล้วเปิดลิงก์นั้น
**Expected**
อีเมลถูกส่งถึงภายในเวลาที่รับได้; URL ของลิงก์ขึ้นต้นด้วยโดเมนของแอปที่ทดสอบ ชี้ path `/reset-password` และมี query `token=`; เมื่อเปิดแล้วเห็นฟอร์ม "Set a new password" (ถ้า URL พาไปโดเมน/path อื่น ให้ตรวจค่า `password_reset.base_url` ก่อน — ไม่ใช่ข้อบกพร่องของหน้าจอ)

---
## TC-PWD-300002 — ล็อกอินด้วยรหัสใหม่สำเร็จ และรหัสเดิมใช้ไม่ได้อีก
**Priority:** High · **Test Type:** Integration
**Preconditions**
ตั้งรหัสผ่านใหม่สำเร็จแล้วตาม TC-PWD-040001 (ต้องมี token จริง); รู้ทั้งรหัสเดิมและรหัสใหม่ของบัญชีทดสอบ
**Steps**
1. ที่หน้า `/login` กรอกอีเมลของบัญชีทดสอบกับรหัสผ่าน **ใหม่** แล้วกดเข้าสู่ระบบ
2. ออกจากระบบ
3. กรอกอีเมลเดิมกับรหัสผ่าน **เดิม** แล้วกดเข้าสู่ระบบ
**Expected**
ข้อ 1 ล็อกอินสำเร็จและเข้าถึง `/dashboard` ได้; ข้อ 3 ล็อกอินไม่สำเร็จและแสดงข้อความ "Email or password is incorrect"

---
## TC-PWD-300003 — ใช้ token เดิมซ้ำครั้งที่สองแล้วลิงก์ตาย
**Priority:** Medium · **Test Type:** Integration
**Preconditions**
มี token จริงที่ถูกใช้ตั้งรหัสผ่านสำเร็จไปแล้วหนึ่งครั้ง (ต้องมีอีเมล/token จริง)
**Steps**
1. เปิด `/reset-password?token=<token เดิมที่ใช้ไปแล้ว>`
2. กรอกรหัสผ่านใหม่ที่ผ่านกฎทั้งหมดและยืนยันให้ตรงกัน
3. คลิก "Save new password"
**Expected**
ฟอร์มยังแสดงตอนเปิดหน้า (ไม่มีการตรวจ token ล่วงหน้า) แต่หลังกดส่งแสดงข้อความ "This link no longer works — it has expired or has already been used. Request a new one to continue." พร้อมลิงก์ "Request a new link"; รหัสผ่านของบัญชีไม่ถูกเปลี่ยน

---
## TC-PWD-900001 — รีเฟรชหน้า /login หลังตั้งรหัสสำเร็จแล้วแถบยืนยันหายไป
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เพิ่งตั้งรหัสผ่านใหม่สำเร็จและถูกพามาที่ `/login` พร้อมแถบ "Your password has been changed. Sign in with your new password." (ต่อจาก TC-PWD-040001)
**Steps**
1. กดรีเฟรชหน้า `/login`
**Expected**
แถบยืนยันหายไป (ข้อความนี้มาจาก router state ไม่ใช่ query string จึงเห็นครั้งเดียว); ฟอร์มล็อกอินยังใช้งานได้ตามปกติ

---
## TC-PWD-900002 — รีโหลดหน้าขณะอยู่จอ Check your inbox กลับไปที่ฟอร์มกรอกอีเมล
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่บนจอ "Check your inbox" ของ `/forgot-password`
**Steps**
1. กดรีเฟรชหน้า
**Expected**
กลับมาเห็นฟอร์มกรอกอีเมลพร้อมหัวเรื่อง "Forgot your password?" และช่องอีเมลว่าง (สถานะ "ส่งแล้ว" เก็บใน state ของคอมโพเนนต์เท่านั้น); ลิงก์ที่ขอไว้ก่อนหน้ายังใช้ได้ตามปกติ

---
## TC-PWD-900003 — token ที่สุ่มขึ้นมาเองยังเห็นฟอร์ม และรู้ว่าลิงก์ตายเมื่อกดบันทึกเท่านั้น
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน
**Steps**
1. เปิด `/reset-password?token=this-token-does-not-exist`
2. สังเกตหน้าจอทันทีโดยยังไม่กรอกอะไร
3. กรอกรหัสผ่านใหม่ที่ผ่านกฎทั้งหมดและยืนยันให้ตรงกัน แล้วคลิก "Save new password"
**Expected**
ข้อ 2 เห็นฟอร์ม "Set a new password" ตามปกติ ไม่มีข้อความเตือนล่วงหน้า; ข้อ 3 จึงแสดงข้อความ "This link no longer works — it has expired or has already been used. Request a new one to continue." พร้อมลิงก์ "Request a new link"
