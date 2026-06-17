# Config Email (SMTP) — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/config-email`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Email Configuration (SMTP)
**Frontend route:** `routes/system-admin/config-email`  •  **URL:** `/system-admin/config-email`
**Prefix:** `CEML`
**Default role:** Platform Admin
**Total test cases:** 14

> หน้าฟอร์มตั้งค่าเดียว (config key `report_email`). กลุ่ม SMTP Server: Host (required), Port (number 1–65535, default 587), Username (required), Password (required, type=password), From Address (required), Enabled (switch). กลุ่ม Recipients: To (คั่นด้วย comma), CC (คั่นด้วย comma), Subject Prefix (default `[Carmen]`). มีปุ่ม Test Email (ส่งเมลทดสอบ) และ Save (upsert).

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
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี config `report_email` บันทึกไว้แล้วในระบบ
**Steps**
1. ไปที่ `/system-admin/config-email`
**Expected**
ฟอร์มถูก prefill ด้วยค่า smtp.host/port/username/from, สถานะ Enabled, recipients และ cc (join ด้วย ", ") และ subject_prefix จาก config เดิม

---
## TC-CEML-020003 — Switch Enabled toggle ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. คลิก Switch Enabled
**Expected**
สถานะ Switch สลับ on/off (form ค่า smtp_enabled เปลี่ยนตาม)

---
## TC-CEML-020004 — ช่อง Port เป็น number input
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. ดูช่อง Port
**Expected**
ช่อง Port มี type=number (placeholder 587) และรับเฉพาะตัวเลข

---
## TC-CEML-020005 — ช่อง Password เป็น type=password (ซ่อนค่า)
**Priority:** Medium · **Test Type:** Security
**Preconditions**
อยู่ที่ `/system-admin/config-email`
**Steps**
1. พิมพ์ค่าลงในช่อง Password
**Expected**
ช่อง Password เป็น type=password แสดงเป็นจุด/ดอกจัน ไม่เปิดเผยค่าเป็น plain text

---
## TC-CEML-040001 — บันทึกค่า SMTP ครบถ้วนสำเร็จ
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
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/config-email` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็นฟอร์ม Email Configuration

---
## TC-CEML-300001 — กด Test Email ส่งเมลทดสอบสำเร็จ
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
