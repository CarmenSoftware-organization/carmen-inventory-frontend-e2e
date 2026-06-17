# Config Email (SMTP) — User Stories

_Authored from the test-case catalog `docs/test-cases/1111-config-email.md` (documentation only — no automated spec yet)._

**Module:** Email Configuration (SMTP)
**Frontend route:** `routes/system-admin/config-email`  •  **URL:** `/system-admin/config-email`
**Prefix:** `CEML`
**Default role:** Platform Admin
**Total test cases:** 14

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CEML-020001 | หน้า Email Configuration โหลดและแสดงฟอร์ม | High | Smoke |
| TC-CEML-020002 | โหลดค่า config เดิมเข้าฟอร์ม (prefill) | Medium | Functional |
| TC-CEML-020003 | Switch Enabled toggle ได้ | Medium | Functional |
| TC-CEML-020004 | ช่อง Port เป็น number input | Low | Functional |
| TC-CEML-020005 | ช่อง Password เป็น type=password (ซ่อนค่า) | Medium | Security |
| TC-CEML-040001 | บันทึกค่า SMTP ครบถ้วนสำเร็จ | High | CRUD |
| TC-CEML-040002 | บันทึกค่า recipients/cc แบบคั่น comma แล้วถูก parse เป็น array | Medium | CRUD |
| TC-CEML-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-CEML-300001 | กด Test Email ส่งเมลทดสอบสำเร็จ | High | Functional |
| TC-CEML-300002 | Test Email ล้มเหลวแสดง error toast | Medium | Negative |
| TC-CEML-200001 | บันทึกโดยไม่กรอก Host ต้องแสดง error | High | Validation |
| TC-CEML-200002 | บันทึกโดยไม่กรอก Username/Password/From ต้องแสดง error | High | Validation |
| TC-CEML-200003 | Port นอกช่วง 1–65535 ถูก reject | Medium | Validation |
| TC-CEML-200004 | scroll ไปยังฟิลด์แรกที่ผิดเมื่อ submit ล้มเหลว | Low | Functional |

---
## TC-CEML-020001 — หน้า Email Configuration โหลดและแสดงฟอร์ม
> **As a** Platform Admin, **I want** the Email Configuration form to load, **so that** I can configure the SMTP server.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin > Config Email
**Steps**
1. ไปที่ `/system-admin/config-email`
2. รอ loading spinner หาย
**Expected**
หัวข้อ Email Configuration แสดง, การ์ด SMTP Server และ Recipients ปรากฏ พร้อมปุ่ม Test Email และ Save

---
## TC-CEML-020002 — โหลดค่า config เดิมเข้าฟอร์ม (prefill)
> **As a** Platform Admin, **I want** existing config prefilled, **so that** I can edit current settings instead of re-entering them.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี config `report_email` บันทึกไว้แล้วในระบบ
**Steps**
1. ไปที่ `/system-admin/config-email`
**Expected**
ฟอร์มถูก prefill ด้วยค่า smtp.host/port/username/from, สถานะ Enabled, recipients และ cc (join ด้วย ", ") และ subject_prefix จาก config เดิม

---
## TC-CEML-020003 — Switch Enabled toggle ได้
> **As a** Platform Admin, **I want** an Enabled switch, **so that** I can turn email sending on or off.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. คลิก Switch Enabled
**Expected**
สถานะ Switch สลับ on/off (form ค่า smtp_enabled เปลี่ยนตาม)

---
## TC-CEML-020004 — ช่อง Port เป็น number input
> **As a** Platform Admin, **I want** the Port field to be numeric, **so that** only valid port numbers are entered.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. ดูช่อง Port
**Expected**
ช่อง Port มี type=number (placeholder 587) และรับเฉพาะตัวเลข

---
## TC-CEML-020005 — ช่อง Password เป็น type=password (ซ่อนค่า)
> **As a** Platform Admin, **I want** the SMTP password masked, **so that** the credential isn't shown in plain text.

**Priority:** Medium · **Test Type:** Security
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. พิมพ์ค่าลงในช่อง Password
**Expected**
ช่อง Password เป็น type=password แสดงเป็นจุด/ดอกจัน ไม่เปิดเผยค่าเป็น plain text

---
## TC-CEML-040001 — บันทึกค่า SMTP ครบถ้วนสำเร็จ
> **As a** Platform Admin, **I want** to save complete SMTP settings, **so that** the system can send report emails.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. กรอก Host = `smtp.gmail.com`, Port = `587`, Username, Password, From Address
2. เปิด Enabled
3. กด Save
**Expected**
success toast "Email config saved"; ค่าถูก upsert ที่ config key `report_email`

---
## TC-CEML-040002 — บันทึกค่า recipients/cc แบบคั่น comma แล้วถูก parse เป็น array
> **As a** Platform Admin, **I want** comma-separated recipients parsed into a list, **so that** I can enter multiple addresses easily.

**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/config-email`; SMTP fields ครบแล้ว
**Steps**
1. กรอก To = `a@example.com, b@example.com`
2. กรอก CC = `c@example.com`
3. กด Save
**Expected**
บันทึกสำเร็จ; recipients/cc ถูก split ด้วย `,` `;` หรือ whitespace และ trim เป็น array ก่อนส่ง backend

---
## TC-CEML-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated access blocked, **so that** SMTP credentials stay protected.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/config-email` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็นฟอร์ม Email Configuration

---
## TC-CEML-300001 — กด Test Email ส่งเมลทดสอบสำเร็จ
> **As a** Platform Admin, **I want** to send a test email, **so that** I can confirm the SMTP settings work before relying on them.

**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`; มี config SMTP ที่ใช้งานได้
**Steps**
1. กดปุ่ม Test Email
2. รอผล
**Expected**
ระหว่างส่งปุ่มถูก disabled; เมื่อสำเร็จแสดง success toast "Test email sent successfully"

---
## TC-CEML-300002 — Test Email ล้มเหลวแสดง error toast
> **As a** Platform Admin, **I want** a clear error when a test email fails, **so that** I can fix the SMTP settings.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/system-admin/config-email`; config SMTP ผิด/ไม่สามารถเชื่อมต่อได้
**Steps**
1. กดปุ่ม Test Email
2. รอผล
**Expected**
error toast แสดงข้อความ error จาก backend; ไม่มี success toast

---
## TC-CEML-200001 — บันทึกโดยไม่กรอก Host ต้องแสดง error
> **As a** Platform Admin, **I want** Host required, **so that** the SMTP server is always specified.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. ปล่อย Host ว่าง (กรอกฟิลด์อื่น)
2. กด Save
**Expected**
FieldError ใต้ Host แสดง "SMTP host is required" และฟอร์มไม่ถูกบันทึก

---
## TC-CEML-200002 — บันทึกโดยไม่กรอก Username/Password/From ต้องแสดง error
> **As a** Platform Admin, **I want** Username, Password and From required, **so that** the SMTP connection has full credentials.

**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. ปล่อย Username, Password และ From Address ว่าง
2. กด Save
**Expected**
FieldError แสดงตามฟิลด์ ("Username is required" / "Password is required" / "From address is required") และไม่บันทึก

---
## TC-CEML-200003 — Port นอกช่วง 1–65535 ถูก reject
> **As a** Platform Admin, **I want** out-of-range ports rejected, **so that** only valid ports are stored.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. กรอก Port = `70000` (หรือ `0`)
2. กด Save
**Expected**
FieldError ใต้ Port แสดง และไม่บันทึก (zod int min 1 max 65535)

---
## TC-CEML-200004 — scroll ไปยังฟิลด์แรกที่ผิดเมื่อ submit ล้มเหลว
> **As a** Platform Admin, **I want** the form to scroll to the first invalid field, **so that** I can fix errors without hunting for them.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`; มีฟิลด์ required ว่างหลายอัน
**Steps**
1. เว้น Host ว่าง
2. กด Save
**Expected**
หน้าเลื่อน (scrollToFirstInvalidField) ไปยังฟิลด์ที่ invalid อันแรก

---
<sub>Authored: 2026-06-17 · documentation only</sub>
