# Invitation — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/invitation` (`invitation.route.tsx`, `invitation-summary.tsx`) together with `routes/router.tsx`, `lib/invitation-api.ts`, `routes/register/signup-profile-form.tsx`, `routes/register/signup-schema.ts`, `lib/password-schema.ts` และข้อความจาก `messages/en.json` (`auth.invitation.*`, `auth.validation.*`). Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Auth (public) — Invitation
**Frontend route:** `routes/invitation`  •  **URL:** `/invitations` (และ `/invitations/:token`)
**Prefix:** `INVT`
**Default role:** ผู้ใช้ที่ยังไม่ได้ล็อกอิน (หน้า public)
**Total test cases:** 25

> หมายเหตุสำคัญสำหรับผู้รีวิว: `routes/router.tsx` ประกาศ **สอง path ชี้คอมโพเนนต์เดียวกัน** โดยเจตนา — `/invitations/:token` และ `/invitations` (อ่าน token จาก `?token=`) คอมเมนต์ในโค้ดระบุเหตุผลว่า backend ประกอบลิงก์ด้วย `searchParams.set('token', …)` ต่อท้าย Base URL ที่ผู้ดูแลตั้งไว้ จึงได้รูปแบบ **query** เป็นของจริง ส่วนรูปแบบ **path** เป็นสิ่งที่คนตั้งค่ามักเดาว่าใช่ การรับทั้งคู่จึงกันไม่ให้ Base URL ที่ตั้งผิดรูปแบบกลายเป็นลิงก์เสียที่ผู้ถูกเชิญแก้เองไม่ได้ ตัวโค้ดอ่านเป็น `pathToken ?? searchParams.get("token") ?? ""` — path มาก่อนเสมอ
>
> เทสเคสในเอกสารนี้ยืนยันว่า **UI ปรากฏตามที่โค้ดออกแบบไว้** ไม่มีเคสใดยืนยันว่า "ฟีเจอร์ยังไม่ทำงาน"
>
> **Blocker ที่ทำให้ automate ยาก — ต้องอ่านก่อนลงมือเขียน spec**
>
> - **ต้องมี token จริงที่ backend ออกและส่งทางอีเมล** ฝั่ง frontend สร้าง token เองไม่ได้เลย ทุกเคสที่ต้องเห็นกล่องสรุปคำเชิญ (02/03/20/40 เกือบทั้งหมด) ต้องมีคำเชิญของจริงรออยู่ก่อน
> - **token ใช้ได้ครั้งเดียว** — เมื่อ accept / decline / สมัครสำเร็จแล้ว backend จะตอบ 410 ในครั้งถัดไป เคส TC-INVT-030003 / 030007 / 030008 จึงเป็น one-shot รันซ้ำไม่ได้ ต้องออกคำเชิญใหม่ทุกครั้งที่รัน
> - **ผู้ถูกเชิญที่ยังไม่มีบัญชีจะสมัครจบในหน้านี้เลย** การรัน TC-INVT-030003 จึงสร้างบัญชีจริงค้างในระบบทุกครั้ง ต้องวางแผนล้างข้อมูลหรือใช้อีเมลแบบ plus-address ที่ทิ้งได้
> - **เคสที่ผูกกับ `account_state` ต้องจัดสถานะอีเมลฝั่ง backend ให้ตรงก่อน** ค่าที่เป็นไปได้คือ `free` / `reclaimable` / `owned` / `conflict` / `null` โดย `conflict` (อีเมลของคำเชิญไปตรงกับ **ชื่อผู้ใช้** ของบัญชีอื่น) สร้างขึ้นมาทดสอบได้ยากที่สุด และ `null` เกิดเมื่อ backend ตอบสถานะไม่ทัน ซึ่งบังคับให้เกิดตามใจไม่ได้
> - **เคสสถานะผิดพลาด (410 / 409 / 403 / โหลดไม่สำเร็จ) ในทางปฏิบัติต้องใช้ `page.route(...)` ดักสตับคำตอบ** ไม่งั้นต้องไปจัดสภาพ backend ซึ่งทำซ้ำไม่ได้
> - **`has_account` เป็นทางถอยสำหรับ backend รุ่นก่อนที่ยังไม่มี `account_state`** อย่าเขียนเทสที่ผูกกับ `has_account` โดยตรงบน backend ปัจจุบัน
> - **`expires_at` มีอยู่ในข้อมูลคำเชิญแต่หน้าไม่ได้แสดง** ห้ามเขียนเทสว่าผู้ใช้เห็นวันหมดอายุบนหน้าจอ
> - ข้อความบนหน้าจอเป็น **ภาษาอังกฤษ** ทั้งหมดตาม `messages/en.json` เคสด้านล่างอ้างสตริงจริงจากไฟล์นั้น

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-INVT-010001 | เปิดคำเชิญด้วยรูปแบบ path `/invitations/<token>` | High | Smoke |
| TC-INVT-010002 | เปิดคำเชิญด้วยรูปแบบ query `/invitations?token=<token>` | High | Functional |
| TC-INVT-020001 | กล่องสรุปคำเชิญแสดง Chain / Role / Sent to / Properties | High | Functional |
| TC-INVT-020002 | อีเมลผู้ถูกเชิญแสดงแบบปิดบังเท่านั้น | High | Security |
| TC-INVT-030001 | อีเมลยังไม่มีบัญชี — เห็นปุ่มสร้างบัญชีทางเดียว | High | Functional |
| TC-INVT-030002 | เข้าโหมดสร้างบัญชีแล้วเห็นฟอร์มครบทุกช่อง | High | Happy Path |
| TC-INVT-030003 | สร้างบัญชีและเข้าร่วมสำเร็จ | High | Happy Path |
| TC-INVT-030004 | อีเมลมีบัญชีแล้ว — เห็นปุ่มเข้าสู่ระบบทางเดียว | High | Functional |
| TC-INVT-030005 | สถานะบัญชีไม่ทราบ — เสนอทั้งสองทางเลือก | Medium | Edge Case |
| TC-INVT-030006 | ผู้ที่ล็อกอินอยู่แล้วเห็นปุ่ม Accept / Decline | High | Functional |
| TC-INVT-030007 | กด Accept แล้วเข้าสู่ระบบที่ `/dashboard` | High | Happy Path |
| TC-INVT-030008 | กด Decline แล้วกลับไปหน้าเข้าสู่ระบบ | Medium | Alternate Flow |
| TC-INVT-100001 | หน้าคำเชิญเปิดได้โดยไม่ต้องล็อกอิน | High | Auth-guard |
| TC-INVT-100002 | ล็อกอินผิดบัญชีแล้วกด Accept ได้ข้อความเตือน | High | Security |
| TC-INVT-200001 | เว้นชื่อ / นามสกุลว่างแล้วสร้างบัญชีไม่ได้ | High | Validation |
| TC-INVT-200002 | รหัสผ่านไม่ผ่านเกณฑ์ความปลอดภัย | High | Validation |
| TC-INVT-200003 | ยืนยันรหัสผ่านไม่ตรงกัน | High | Validation |
| TC-INVT-300001 | เปิดลิงก์จริงจากอีเมลที่ backend ส่งให้ | High | Functional |
| TC-INVT-300002 | ลิงก์คำเชิญใช้ไม่ได้แล้ว (410) | High | Negative |
| TC-INVT-300003 | โหลดคำเชิญไม่สำเร็จแล้วกดลองใหม่ | High | Negative |
| TC-INVT-400001 | อีเมลชนกับชื่อผู้ใช้ของบัญชีอื่น (conflict) | High | Functional |
| TC-INVT-400002 | สมัครแล้วพบว่าอีเมลมีบัญชีอยู่แล้ว (409) | High | Negative |
| TC-INVT-400003 | ลิงก์หมดอายุระหว่างกรอกฟอร์มสร้างบัญชี (410) | Medium | Edge Case |
| TC-INVT-900001 | เปิด `/invitations` โดยไม่มี token ติดมาเลย | Medium | Edge Case |
| TC-INVT-900002 | มี token ทั้งใน path และ query พร้อมกัน | Low | Edge Case |

---
## TC-INVT-010001 — เปิดคำเชิญด้วยรูปแบบ path `/invitations/<token>`
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; มีคำเชิญที่ยังไม่ถูกใช้และ token ของคำเชิญนั้นอยู่ในมือ
**Steps**
1. เปิด `/invitations/<token>` ตรง ๆ
2. รอจนสปินเนอร์ที่มี `role="status"` และ aria-label `Loading the invitation...` หายไป
**Expected**
หน้าแสดงหัวข้อ `You have been invited` พร้อมกล่องสรุปคำเชิญ และไม่ถูก redirect ไปหน้าอื่น

---
## TC-INVT-010002 — เปิดคำเชิญด้วยรูปแบบ query `/invitations?token=<token>`
**Priority:** High · **Test Type:** Functional
**Preconditions**
ผู้ใช้ยังไม่ได้ล็อกอิน; ใช้ token เดียวกับที่ใช้เปิดรูปแบบ path ได้สำเร็จ (นี่คือรูปแบบที่ backend ประกอบขึ้นจริง)
**Steps**
1. เปิด `/invitations?token=<token>`
2. รอจนหน้าโหลดคำเชิญเสร็จ
**Expected**
หน้าแสดงหัวข้อ `You have been invited` และกล่องสรุปคำเชิญเหมือนกับที่เปิดด้วยรูปแบบ path ทุกประการ — ทั้งสอง URL ให้ผลเท่ากัน

---
## TC-INVT-020001 — กล่องสรุปคำเชิญแสดง Chain / Role / Sent to / Properties
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้าคำเชิญที่โหลดสำเร็จ; คำเชิญนั้นผูกกับ business unit อย่างน้อย 1 รายการ
**Steps**
1. อ่านกล่องสรุปใต้หัวข้อของหน้า
**Expected**
กล่องสรุปแสดงคู่ป้าย-ค่า `Chain`, `Role`, `Sent to` ครบทั้งสามรายการ และแสดงบล็อก `Properties` ที่ลิสต์แต่ละ business unit ในรูป `<ชื่อ> — <role>`; เมื่อคำเชิญไม่มี business unit เลย บล็อก `Properties` จะไม่ปรากฏ

---
## TC-INVT-020002 — อีเมลผู้ถูกเชิญแสดงแบบปิดบังเท่านั้น
**Priority:** High · **Test Type:** Security
**Preconditions**
อยู่ที่หน้าคำเชิญที่โหลดสำเร็จ; ทราบอีเมลเต็มของผู้ถูกเชิญจากฝั่งผู้ออกคำเชิญ
**Steps**
1. อ่านค่าที่อยู่ข้างป้าย `Sent to`
2. ค้นหาอีเมลเต็มในข้อความทั้งหน้า
**Expected**
ค่าข้าง `Sent to` เป็นอีเมลที่ถูกปิดบังตามที่ backend ส่งมา (`email_masked`) และไม่พบอีเมลเต็มที่ใดในหน้า — ลิงก์คำเชิญที่หลุดไปถึงคนอื่นต้องอ่านอีเมลเจ้าตัวไม่ได้

---
## TC-INVT-030001 — อีเมลยังไม่มีบัญชี — เห็นปุ่มสร้างบัญชีทางเดียว
**Priority:** High · **Test Type:** Functional
**Preconditions**
ยังไม่ได้ล็อกอิน; คำเชิญส่งไปยังอีเมลที่ backend รายงาน `account_state` เป็น `free` หรือ `reclaimable`
**Steps**
1. เปิดหน้าคำเชิญด้วย token
2. อ่านคำบรรยายใต้หัวข้อและปุ่มที่ปรากฏ
**Expected**
คำบรรยายคือ `Create an account to join.` มีปุ่มเดียวคือ `Create a new account` และ **ไม่มี** ปุ่ม `Sign In` / `Already have an account?`

---
## TC-INVT-030002 — เข้าโหมดสร้างบัญชีแล้วเห็นฟอร์มครบทุกช่อง
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้าคำเชิญที่เสนอปุ่ม `Create a new account`
**Steps**
1. คลิกปุ่ม `Create a new account`
**Expected**
คำบรรยายเปลี่ยนเป็น `Set your name and password to join.`; กล่องสรุปคำเชิญยังอยู่; ฟอร์มแสดงช่อง `First name`, `Last name`, `Phone (optional)`, `Password`, `Confirm password` พร้อมคำใบ้รหัสผ่าน และปุ่มส่งชื่อ `Create account and join`; **ไม่มีช่องอีเมลและไม่มีช่อง username** เพราะอีเมลมาจากตัวคำเชิญ

---
## TC-INVT-030003 — สร้างบัญชีและเข้าร่วมสำเร็จ
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ; token ยังใช้ได้และอีเมลยังไม่มีบัญชี — **รันได้ครั้งเดียวต่อคำเชิญหนึ่งใบ**
**Steps**
1. กรอก `First name` และ `Last name`
2. กรอก `Password` ที่ผ่านเกณฑ์ (อย่างน้อย 8 ตัว มีพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ)
3. กรอก `Confirm password` ให้ตรงกัน
4. คลิก `Create account and join`
**Expected**
ระหว่างส่ง ปุ่มถูกปิดและป้ายเปลี่ยนเป็น `Creating account...`; เมื่อสำเร็จระบบพาไปที่ `/login` (แทนที่ประวัติ) และหน้าเข้าสู่ระบบแสดงประกาศว่าเพิ่งสมัครเสร็จ

---
## TC-INVT-030004 — อีเมลมีบัญชีแล้ว — เห็นปุ่มเข้าสู่ระบบทางเดียว
**Priority:** High · **Test Type:** Functional
**Preconditions**
ยังไม่ได้ล็อกอิน; คำเชิญส่งไปยังอีเมลที่ backend รายงาน `account_state` เป็น `owned`
**Steps**
1. เปิดหน้าคำเชิญด้วย token
2. อ่านคำบรรยายและปุ่มที่ปรากฏ แล้วตรวจปลายทางของลิงก์บนปุ่ม
**Expected**
คำบรรยายคือ `Sign in to accept this invitation.`; มีปุ่มเดียวคือ `Sign In` และ **ไม่มี** ปุ่ม `Create a new account`; ปุ่มลิงก์ไปที่ `/login?next=%2Finvitations%2F<token>` เพื่อพากลับมาที่คำเชิญเดิมหลังเข้าสู่ระบบ

---
## TC-INVT-030005 — สถานะบัญชีไม่ทราบ — เสนอทั้งสองทางเลือก
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ยังไม่ได้ล็อกอิน; backend ตอบคำเชิญโดยที่ `account_state` และ `has_account` เป็น `null` ทั้งคู่ (สตับคำตอบด้วย `page.route` เป็นวิธีที่ทำซ้ำได้)
**Steps**
1. เปิดหน้าคำเชิญด้วย token
2. อ่านคำบรรยายและปุ่มที่ปรากฏ
**Expected**
คำบรรยายคือ `Create an account to join, or sign in if you already have one.`; ปรากฏสองปุ่ม — `Create a new account` เป็นปุ่มหลัก และ `Already have an account?` เป็นปุ่มขอบ (outline) ที่ลิงก์ไป `/login?next=%2Finvitations%2F<token>`

---
## TC-INVT-030006 — ผู้ที่ล็อกอินอยู่แล้วเห็นปุ่ม Accept / Decline
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินอยู่แล้วด้วยบัญชีที่ตรงกับอีเมลของคำเชิญ; คำเชิญยังใช้ได้
**Steps**
1. เปิดหน้าคำเชิญด้วย token
**Expected**
คำบรรยายคือ `Review what you are being invited to, then accept or decline.`; กล่องสรุปคำเชิญแสดงอยู่; ปรากฏปุ่ม `Accept` (ปุ่มหลัก) และ `Decline` (ปุ่มขอบ) เคียงกัน โดยไม่มีฟอร์มสร้างบัญชี

---
## TC-INVT-030007 — กด Accept แล้วเข้าสู่ระบบที่ `/dashboard`
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
ล็อกอินด้วยบัญชีที่ตรงกับอีเมลของคำเชิญ และอยู่ที่หน้าคำเชิญในสถานะ Accept / Decline — **รันได้ครั้งเดียวต่อคำเชิญหนึ่งใบ**
**Steps**
1. คลิกปุ่ม `Accept`
**Expected**
ระหว่างรอผล ปุ่ม `Accept` เปลี่ยนป้ายเป็น `Accepting...` และทั้งปุ่ม `Accept` กับ `Decline` ถูกปิด; เมื่อสำเร็จระบบพาไปที่ `/dashboard` (แทนที่ประวัติ)

---
## TC-INVT-030008 — กด Decline แล้วกลับไปหน้าเข้าสู่ระบบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ล็อกอินด้วยบัญชีที่ตรงกับอีเมลของคำเชิญ และอยู่ที่หน้าคำเชิญในสถานะ Accept / Decline — **รันได้ครั้งเดียวต่อคำเชิญหนึ่งใบ**
**Steps**
1. คลิกปุ่ม `Decline`
**Expected**
ระหว่างรอผล ปุ่มทั้งสองถูกปิด; เมื่อสำเร็จระบบพาไปที่ `/login` (แทนที่ประวัติ) และคำเชิญใบนั้นใช้ไม่ได้อีก

---
## TC-INVT-100001 — หน้าคำเชิญเปิดได้โดยไม่ต้องล็อกอิน
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
browser context ที่ไม่มี token การล็อกอินใด ๆ (ผู้ถูกเชิญอาจยังไม่มีบัญชีด้วยซ้ำ)
**Steps**
1. เปิด `/invitations/<token>` ตรง ๆ
2. เปิด `/invitations?token=<token>` ตรง ๆ
**Expected**
ทั้งสอง URL เรนเดอร์หน้าคำเชิญได้เอง ไม่ถูก guard เด้งไป `/login` — เส้นทางนี้เป็น public โดยเจตนา

---
## TC-INVT-100002 — ล็อกอินผิดบัญชีแล้วกด Accept ได้ข้อความเตือน
**Priority:** High · **Test Type:** Security
**Preconditions**
ล็อกอินด้วยบัญชีที่ **ไม่ใช่** อีเมลของคำเชิญ; เปิดหน้าคำเชิญจนเห็นปุ่ม Accept / Decline (backend เป็นผู้เทียบอีเมลและตอบ 403)
**Steps**
1. คลิกปุ่ม `Accept`
2. รอผลตอบกลับ
**Expected**
ปรากฏกล่องแจ้งเตือนในฟอร์มข้อความ `This invitation was sent to a different account. Sign out and try again.`; ยังอยู่หน้าเดิม ไม่ถูกพาไป `/dashboard` และคำเชิญไม่ถูกรับ

---
## TC-INVT-200001 — เว้นชื่อ / นามสกุลว่างแล้วสร้างบัญชีไม่ได้
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ
**Steps**
1. ปล่อยช่อง `First name` และ `Last name` ว่าง (หรือกรอกแต่ช่องว่างล้วน)
2. คลิก `Create account and join`
**Expected**
แสดงข้อความ `First Name is required` ใต้ช่องชื่อ และ `Last Name is required` ใต้ช่องนามสกุล; ไม่มีการเรียก API สร้างบัญชี

---
## TC-INVT-200002 — รหัสผ่านไม่ผ่านเกณฑ์ความปลอดภัย
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ โดยกรอกชื่อและนามสกุลครบแล้ว
**Steps**
1. กรอก `Password` เป็นค่าที่สั้นกว่า 8 ตัวอักษร แล้วออกจากช่อง
2. เปลี่ยนเป็นรหัสผ่านยาวพอแต่ไม่มีตัวพิมพ์ใหญ่ / ไม่มีตัวพิมพ์เล็ก / ไม่มีตัวเลข / ไม่มีอักขระพิเศษ ทีละกรณี
3. คลิก `Create account and join` ในแต่ละกรณี
**Expected**
แสดงข้อความตามกรณี — `Password must be at least 8 characters`, `Must contain at least one uppercase letter`, `Must contain at least one lowercase letter`, `Must contain at least one number`, `Must contain at least one special character`; ไม่มีการสร้างบัญชี

---
## TC-INVT-200003 — ยืนยันรหัสผ่านไม่ตรงกัน
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ โดยกรอกชื่อ นามสกุล และรหัสผ่านที่ผ่านเกณฑ์แล้ว
**Steps**
1. ปล่อยช่อง `Confirm password` ว่างแล้วคลิก `Create account and join`
2. กรอก `Confirm password` เป็นค่าที่ต่างจาก `Password` แล้วคลิก `Create account and join` อีกครั้ง
**Expected**
กรณีเว้นว่างแสดง `Please confirm your password`; กรณีกรอกไม่ตรงแสดง `Passwords do not match` ใต้ช่องยืนยันรหัสผ่าน; ไม่มีการสร้างบัญชีทั้งสองกรณี

---
## TC-INVT-300001 — เปิดลิงก์จริงจากอีเมลที่ backend ส่งให้
**Priority:** High · **Test Type:** Functional
**Preconditions**
ผู้ดูแลออกคำเชิญใหม่และอีเมลถูกส่งถึงกล่องจดหมายที่เข้าถึงได้; ยังไม่ได้ล็อกอิน — **เคสนี้ต้องใช้ token จริงจากอีเมล ไม่มีทางสร้างจากฝั่ง frontend**
**Steps**
1. เปิดอีเมลคำเชิญแล้วคัดลอกลิงก์ทั้งบรรทัด
2. เปิดลิงก์นั้นในเบราว์เซอร์โดยไม่แก้ไขรูปแบบ
**Expected**
ลิงก์อยู่ในรูป `<Base URL>?token=<token>` ตามที่ backend ประกอบ และเปิดแล้วได้หน้าคำเชิญที่โหลดสำเร็จ พร้อมกล่องสรุปที่ตรงกับคำเชิญใบนั้น

---
## TC-INVT-300002 — ลิงก์คำเชิญใช้ไม่ได้แล้ว (410)
**Priority:** High · **Test Type:** Negative
**Preconditions**
มี token ที่ backend ตอบ 410 — ไม่มีอยู่จริง หมดอายุ ถูกถอน หรือถูกใช้ไปแล้ว (เช่น token ที่ผ่าน TC-INVT-030007 มาแล้ว)
**Steps**
1. เปิดหน้าคำเชิญด้วย token นั้น
2. รอจนโหลดเสร็จ
**Expected**
หัวข้อคือ `This invitation link no longer works` คำบรรยายคือ `It has expired, was withdrawn, or has already been used.`; มีปุ่มเดียวคือ `Sign In` ที่ลิงก์ไป `/login`; **ไม่มี** ปุ่ม `Try again` และไม่มีกล่องสรุปคำเชิญ

---
## TC-INVT-300003 — โหลดคำเชิญไม่สำเร็จแล้วกดลองใหม่
**Priority:** High · **Test Type:** Negative
**Preconditions**
ทำให้การเรียกอ่านคำเชิญล้มด้วยรหัสอื่นที่ไม่ใช่ 410 (เน็ตหลุด หรือสตับให้ตอบ 500) — โค้ดแยกกรณีนี้ออกจาก "ลิงก์ตาย" โดยเจตนา
**Steps**
1. เปิดหน้าคำเชิญด้วย token ขณะที่การเรียกล้ม
2. คลิกปุ่ม `Try again`
**Expected**
หัวข้อคือ `Could not load the invitation` คำบรรยายคือ `Your invitation may still be fine — we just could not reach the server. Please try again.`; ปรากฏปุ่ม `Try again` และปุ่มขอบ `Sign In`; ขณะกำลังลองใหม่ ปุ่มถูกปิดและป้ายเปลี่ยนเป็น `Loading the invitation...`; เมื่อการเรียกกลับมาสำเร็จ หน้าแสดงคำเชิญตามปกติ

---
## TC-INVT-400001 — อีเมลชนกับชื่อผู้ใช้ของบัญชีอื่น (conflict)
**Priority:** High · **Test Type:** Functional
**Preconditions**
ยังไม่ได้ล็อกอิน; คำเชิญส่งไปยังอีเมลที่ backend รายงาน `account_state` เป็น `conflict` (อีเมลไปตรงกับ **ชื่อผู้ใช้** ของบัญชีอื่น)
**Steps**
1. เปิดหน้าคำเชิญด้วย token
2. ตรวจปุ่มทั้งหมดในการ์ด
**Expected**
คำบรรยายคือ `This invitation needs an administrator before you can continue`; แสดงข้อความ `This address is already used as the username of another account, so it cannot be signed up here. The person who invited you has been notified and can fix it.`; กล่องสรุปคำเชิญยังแสดงอยู่ แต่ **ไม่มีปุ่มใด ๆ ให้กดเลย** — ทั้ง `Create a new account` และ `Sign In` ไม่ปรากฏ

---
## TC-INVT-400002 — สมัครแล้วพบว่าอีเมลมีบัญชีอยู่แล้ว (409)
**Priority:** High · **Test Type:** Negative
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ (เข้ามาได้เพราะ `account_state` เป็น `null` หรือถูกสตับ) และอีเมลของคำเชิญนั้นมีบัญชีอยู่จริง ทำให้ backend ตอบ 409
**Steps**
1. กรอกฟอร์มให้ผ่าน validation ครบทุกช่อง
2. คลิก `Create account and join`
**Expected**
ปรากฏกล่องแจ้งเตือนในฟอร์ม โดยใช้ข้อความที่ backend ส่งมาเป็นหลัก และถอยมาที่ `This address already has an account. Sign in and accept the invitation instead.` เมื่ออ่านข้อความจาก backend ไม่ได้; ยังอยู่ในฟอร์มเดิมและ **ข้อมูลที่กรอกไว้ยังอยู่ครบ**

---
## TC-INVT-400003 — ลิงก์หมดอายุระหว่างกรอกฟอร์มสร้างบัญชี (410)
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในฟอร์มสร้างบัญชีของหน้าคำเชิญ แล้ว token ถูกถอน / หมดอายุ / ถูกใช้ไปจากที่อื่นก่อนกดส่ง ทำให้ backend ตอบ 410 ตอน submit
**Steps**
1. กรอกฟอร์มให้ผ่าน validation ครบทุกช่อง
2. คลิก `Create account and join`
**Expected**
ปรากฏกล่องแจ้งเตือนในฟอร์มข้อความ `It has expired, was withdrawn, or has already been used.`; ยังอยู่ในฟอร์มเดิมและข้อมูลที่กรอกไว้ยังอยู่ครบ ไม่ถูกพาไปหน้า "ลิงก์ตาย" ทั้งหน้า

---
## TC-INVT-900001 — เปิด `/invitations` โดยไม่มี token ติดมาเลย
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ยังไม่ได้ล็อกอิน — เส้นทาง `/invitations` รับได้แม้ไม่มี token เพราะคอมโพเนนต์อ่านเป็นสตริงว่างเมื่อไม่พบทั้ง path และ query
**Steps**
1. เปิด `/invitations` โดยไม่ใส่ `?token=` และไม่ใส่ token ใน path
**Expected**
ไม่ crash และไม่แสดงกล่องสรุปคำเชิญ; หน้าแสดงจอข้อผิดพลาดหนึ่งในสองแบบตามรหัสที่ backend ตอบกลับ — ได้ 410 แสดงหัวข้อ `This invitation link no longer works`, ได้รหัสอื่นแสดงหัวข้อ `Could not load the invitation` พร้อมปุ่ม `Try again`; ทั้งสองกรณีมีทางออกไป `/login` เสมอ

---
## TC-INVT-900002 — มี token ทั้งใน path และ query พร้อมกัน
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มี token ที่ใช้ได้จริงหนึ่งตัว และ token อีกตัวที่ต่างออกไป (จะใช้ได้หรือไม่ก็ได้)
**Steps**
1. เปิด `/invitations/<tokenA>?token=<tokenB>`
**Expected**
หน้าใช้ `tokenA` จาก path เท่านั้น — คำเชิญที่แสดงตรงกับ `tokenA` และปุ่มเข้าสู่ระบบลิงก์ไป `/login?next=%2Finvitations%2F<tokenA>`; ค่า `?token=` ถูกมองข้ามเพราะ path มาก่อนเสมอ
