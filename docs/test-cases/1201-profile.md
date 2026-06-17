# Profile & Settings — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/profile`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Profile & Settings
**Frontend route:** `routes/profile`  •  **URL:** `/profile` (และ `/profile/setting`)
**Prefix:** `PROF`
**Default role:** Any authenticated user
**Total test cases:** 18

> หน้า Profile (`/profile`) เป็น read-only: hero แสดง avatar, ชื่อ-นามสกุล, platform_role badge, email, โทรศัพท์ พร้อมปุ่มไปหน้า Settings. มี section Personal Information (firstname/middlename/lastname/alias) และ Business Units แบบ Tabs — แต่ละ BU แสดง logo/avatar (อัปโหลด/ลบได้), code, alias, department, system level, tax/branch no, รวมถึงข้อมูล hotel/company. หน้า Settings (`/profile/setting`) ให้แก้ไขฟอร์มข้อมูลส่วนตัว (firstname/lastname required, alias สูงสุด 2 ตัว), อัปโหลด/ครอป/ลบ avatar และเปลี่ยนรหัสผ่าน (dialog; เปลี่ยนสำเร็จแล้ว logout อัตโนมัติ). การสลับ Business Unit ทำผ่าน Tabs ในหน้า profile (มุมมองต่อ BU). ทุกการบันทึก/อัปโหลด/ลบมี toast ยืนยัน.

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PROF-010001 | หน้า Profile โหลดและแสดงข้อมูลผู้ใช้ | High | Smoke |
| TC-PROF-010002 | hero แสดง avatar / ชื่อ / role / email | Medium | Functional |
| TC-PROF-010003 | section Personal Information แสดงครบทุกฟิลด์ | Medium | Functional |
| TC-PROF-010004 | section Business Units แสดงเป็น Tabs ตามจำนวน BU | High | Functional |
| TC-PROF-020001 | สลับ tab Business Unit แล้วเปลี่ยนข้อมูล BU ที่แสดง | Medium | Functional |
| TC-PROF-020002 | tab BU แสดง badge HQ / Inactive / Default ตามสถานะ | Low | Functional |
| TC-PROF-020003 | tab BU แสดงข้อมูล hotel / company เมื่อมี | Low | Functional |
| TC-PROF-030001 | ปุ่ม Edit Profile นำไปหน้า Settings | High | Smoke |
| TC-PROF-040001 | แก้ไขข้อมูลส่วนตัวและบันทึกสำเร็จ | High | CRUD |
| TC-PROF-040002 | อัปโหลด avatar พร้อมครอปสำเร็จ | Medium | CRUD |
| TC-PROF-040003 | ลบ avatar ผ่าน confirm dialog | Medium | CRUD |
| TC-PROF-040004 | อัปโหลด/ลบ logo หรือ avatar ของ Business Unit | Medium | CRUD |
| TC-PROF-050001 | เปลี่ยนรหัสผ่านสำเร็จและถูก logout อัตโนมัติ | High | Functional |
| TC-PROF-200001 | บันทึกฟอร์มโดยเว้น firstname/lastname ขึ้น error required | High | Validation |
| TC-PROF-200002 | alias เกิน 2 ตัวอักษรขึ้น validation error | Medium | Validation |
| TC-PROF-200003 | เปลี่ยนรหัสผ่าน: new ไม่ตรง confirm ขึ้น error | High | Validation |
| TC-PROF-200004 | เปลี่ยนรหัสผ่าน: new ไม่ผ่านเกณฑ์ความเข้มขึ้น error | Medium | Validation |
| TC-PROF-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-PROF-010001 — หน้า Profile โหลดและแสดงข้อมูลผู้ใช้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ระบบรับรองแล้ว
**Steps**
1. ไปที่ `/profile`
2. รอ loader หาย
**Expected**
URL ตรงกับ `/profile`, แสดง hero พร้อมชื่อผู้ใช้ และ section Personal Information / Business Units

---
## TC-PROF-010002 — hero แสดง avatar / ชื่อ / role / email
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/profile`
**Steps**
1. ดูส่วน hero ด้านบน
**Expected**
แสดง avatar (หรือ initials fallback), ชื่อ-นามสกุลเต็ม, badge platform_role, email และเบอร์โทร (ถ้ามี)

---
## TC-PROF-010003 — section Personal Information แสดงครบทุกฟิลด์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/profile`
**Steps**
1. ดู section Personal Information
**Expected**
แสดง firstname, middlename, lastname และ alias (ค่าว่างแสดงเป็น `-`)

---
## TC-PROF-010004 — section Business Units แสดงเป็น Tabs ตามจำนวน BU
**Priority:** High · **Test Type:** Functional
**Preconditions**
ผู้ใช้สังกัด Business Unit อย่างน้อย 1 หน่วย; อยู่ที่ `/profile`
**Steps**
1. ดู section Business Units
**Expected**
แสดง TabsList โดยมี 1 trigger ต่อ 1 BU และ tab แรกถูกเลือกเป็นค่าเริ่มต้น

---
## TC-PROF-020001 — สลับ tab Business Unit แล้วเปลี่ยนข้อมูล BU ที่แสดง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ผู้ใช้สังกัดอย่างน้อย 2 BU; อยู่ที่ `/profile`
**Steps**
1. คลิก tab ของ BU อื่น
**Expected**
เนื้อหา BU เปลี่ยนเป็นข้อมูลของ BU ที่เลือก (code, alias, department, logo/avatar ฯลฯ)

---
## TC-PROF-020002 — tab BU แสดง badge HQ / Inactive / Default ตามสถานะ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี BU ที่เป็น HQ และ/หรือ inactive และ/หรือ default; อยู่ที่ `/profile`
**Steps**
1. เปิด tab ของ BU ที่มีสถานะดังกล่าว
**Expected**
แสดง badge `HQ` เมื่อ config.is_hq, badge `Inactive` เมื่อไม่ active และ badge `Default` ข้าง code เมื่อ is_default

---
## TC-PROF-020003 — tab BU แสดงข้อมูล hotel / company เมื่อมี
**Priority:** Low · **Test Type:** Functional
**Preconditions**
BU มี config.hotel และ/หรือ config.company; อยู่ที่ `/profile`
**Steps**
1. เปิด tab ของ BU นั้น
**Expected**
แสดง SubSection Hotel และ/หรือ Company พร้อม name, tel, email, address

---
## TC-PROF-030001 — ปุ่ม Edit Profile นำไปหน้า Settings
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/profile`
**Steps**
1. กดปุ่ม Edit Profile
**Expected**
นำทางไป `/profile/setting` และแสดงฟอร์มแก้ไขข้อมูลส่วนตัว

---
## TC-PROF-040001 — แก้ไขข้อมูลส่วนตัวและบันทึกสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/profile/setting`
**Steps**
1. แก้ไขค่า firstname/lastname/telephone/alias
2. กดปุ่ม Save
**Expected**
แสดง toast บันทึกสำเร็จ และฟอร์มสะท้อนค่าใหม่ (form reset เป็นค่าที่บันทึก)

---
## TC-PROF-040002 — อัปโหลด avatar พร้อมครอปสำเร็จ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/profile/setting`; มีไฟล์รูป (ชนิดและขนาดผ่านเกณฑ์)
**Steps**
1. คลิก avatar เพื่อเลือกไฟล์
2. ครอปใน AvatarCropDialog แล้วกดยืนยัน
**Expected**
แสดงพรีวิว ระหว่างอัปโหลด จากนั้น toast อัปโหลดสำเร็จ และ avatar อัปเดต

---
## TC-PROF-040003 — ลบ avatar ผ่าน confirm dialog
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/profile/setting`; มี avatar อยู่แล้ว
**Steps**
1. กดปุ่มถังขยะบน avatar
2. ยืนยันใน AlertDialog
**Expected**
แสดง toast ลบ avatar สำเร็จ และ avatar กลับไปแสดง initials fallback

---
## TC-PROF-040004 — อัปโหลด/ลบ logo หรือ avatar ของ Business Unit
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/profile`; เปิด tab BU; มีไฟล์รูปที่ผ่านเกณฑ์
**Steps**
1. กดปุ่ม Upload/Change ใน card logo หรือ avatar ของ BU แล้วเลือกไฟล์
2. (สำหรับลบ) กดปุ่ม Remove แล้วยืนยันใน confirm dialog
**Expected**
อัปโหลดแสดง toast สำเร็จและรูปอัปเดต; ลบแสดง toast removed และรูปกลับเป็น placeholder

---
## TC-PROF-050001 — เปลี่ยนรหัสผ่านสำเร็จและถูก logout อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/profile/setting`; ทราบรหัสผ่านปัจจุบัน
**Steps**
1. กดปุ่ม Change Password
2. กรอก current/new/confirm ที่ถูกต้องและผ่านเกณฑ์
3. กดยืนยัน
**Expected**
แสดง toast เปลี่ยนรหัสผ่านสำเร็จ และระบบ logout ผู้ใช้อัตโนมัติ (กลับไปหน้า login)

---
## TC-PROF-200001 — บันทึกฟอร์มโดยเว้น firstname/lastname ขึ้น error required
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/profile/setting`
**Steps**
1. ล้างค่า firstname และ/หรือ lastname ให้ว่าง
2. กดปุ่ม Save
**Expected**
แสดง error required ใต้ฟิลด์ที่ว่าง และฟอร์มไม่ถูกส่ง (เลื่อนไปฟิลด์แรกที่ผิด)

---
## TC-PROF-200002 — alias เกิน 2 ตัวอักษรขึ้น validation error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/profile/setting`
**Steps**
1. กรอก alias มากกว่า 2 ตัวอักษร (หรือพยายามเกิน maxLength)
2. กดปุ่ม Save
**Expected**
แสดง validation error ระบุ alias ยาวเกินสูงสุด 2 ตัวอักษร และไม่บันทึก

---
## TC-PROF-200003 — เปลี่ยนรหัสผ่าน: new ไม่ตรง confirm ขึ้น error
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/profile/setting`; เปิด Change Password dialog
**Steps**
1. กรอก new_password และ confirm_password ที่ไม่ตรงกัน
2. กดยืนยัน
**Expected**
แสดง error password mismatch ใต้ confirm_password และไม่ส่งคำขอเปลี่ยนรหัสผ่าน

---
## TC-PROF-200004 — เปลี่ยนรหัสผ่าน: new ไม่ผ่านเกณฑ์ความเข้มขึ้น error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/profile/setting`; เปิด Change Password dialog
**Steps**
1. กรอก new_password ที่สั้นกว่า 8 ตัว หรือไม่มีตัวพิมพ์ใหญ่/เล็ก/ตัวเลข/อักขระพิเศษ
2. กดยืนยัน
**Expected**
แสดง validation error ตามเกณฑ์ที่ขาด (min length / uppercase / lowercase / number / special) และไม่ส่งคำขอ

---
## TC-PROF-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/profile` ตรงๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง
