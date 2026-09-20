# Company Profile — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/company-profile`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Platform / System Admin — Company Profile
**Frontend route:** `routes/system-admin/company-profile`  •  **URL:** `/system-admin/company-profile`
**Prefix:** `COMP`
**Default role:** Platform Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 29

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-COMP-010001 | เปิดหน้า Company Profile ผ่าน URL ตรง | High | Smoke |
| TC-COMP-010002 | `/system-admin/business-setting` redirect ไป Company Profile | Medium | Functional |
| TC-COMP-010003 | เข้าหน้าผ่านเมนู Modules → System Administration | Low | Functional |
| TC-COMP-020001 | แสดงครบทั้ง 6 section ในโหมดอ่าน | High | Smoke |
| TC-COMP-020002 | section General แสดงค่าของ business unit ปัจจุบัน | Medium | Functional |
| TC-COMP-020003 | section Branding แสดงโลโก้/รูปประจำตัว หรือ "No image" | Low | Functional |
| TC-COMP-020004 | section Number Formats แสดงรูปแบบสรุป locale + min digits | Medium | Functional |
| TC-COMP-040001 | กดปุ่ม Edit แล้วเข้าสู่โหมดแก้ไข | High | Functional |
| TC-COMP-040002 | แก้ไข Name แล้วบันทึกสำเร็จ | High | CRUD |
| TC-COMP-040003 | แก้ไขที่อยู่ Hotel และ Company แล้วบันทึก | Medium | CRUD |
| TC-COMP-040004 | เปลี่ยน Timezone และ Date Format | Medium | CRUD |
| TC-COMP-040005 | เปลี่ยน Default Currency ผ่าน lookup | Medium | CRUD |
| TC-COMP-040006 | เปลี่ยน locale และ Min. digits ของ Quantity Format | Medium | CRUD |
| TC-COMP-040007 | ล้างค่าฟิลด์ที่ไม่บังคับแล้วบันทึก | Medium | CRUD |
| TC-COMP-040008 | กด Save ทั้งที่ไม่ได้แก้อะไร | Medium | Alternate Flow |
| TC-COMP-040009 | กด Cancel ทั้งที่ไม่ได้แก้อะไร | Medium | Alternate Flow |
| TC-COMP-040010 | กด Cancel ขณะมีการแก้ค้าง แล้วยืนยัน Discard | High | Alternate Flow |
| TC-COMP-040011 | ใน Discard dialog เลือก Keep editing | Medium | Alternate Flow |
| TC-COMP-100001 | ผู้ใช้ไม่มีสิทธิ์เปิด URL ตรง | High | Authorization |
| TC-COMP-100002 | ผู้ใช้ที่ยังไม่ล็อกอินเปิด URL ตรง | High | Auth-guard |
| TC-COMP-200001 | บันทึกไม่ได้เมื่อ Name ว่าง | High | Validation |
| TC-COMP-200002 | Company Email รูปแบบไม่ถูกต้อง | High | Validation |
| TC-COMP-200003 | Hotel Email รูปแบบไม่ถูกต้อง | Medium | Validation |
| TC-COMP-200004 | ช่องข้อความจำกัดความยาวสูงสุด | Medium | Validation |
| TC-COMP-400001 | ฟิลด์ read-only ยังอ่านอย่างเดียวแม้อยู่ในโหมด Edit | Medium | Functional |
| TC-COMP-400002 | Amount Format ไม่มีช่อง Min. digits | Low | Functional |
| TC-COMP-400003 | นำทางออกจากหน้าขณะมีการแก้ค้าง | High | Functional |
| TC-COMP-900001 | กดปุ่ม Back ของเบราว์เซอร์ขณะมีการแก้ค้าง | Medium | Edge Case |
| TC-COMP-900002 | โหลดข้อมูล business unit ไม่สำเร็จ | Medium | Negative |

---
## TC-COMP-010001 — เปิดหน้า Company Profile ผ่าน URL ตรง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. ไปที่ `/system-admin/company-profile`
2. รอให้ skeleton หายและข้อมูลโหลดเสร็จ
**Expected**
หัวข้อหน้าแสดง "Company Profile" พร้อมคำอธิบาย "General information for the current business unit." และมีปุ่ม Edit อยู่มุมขวาบน

---
## TC-COMP-010002 — `/system-admin/business-setting` redirect ไป Company Profile
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com
**Steps**
1. ไปที่ `/system-admin/business-setting`
**Expected**
ถูกพาไป `/system-admin/company-profile` (replace — ไม่ค้างอยู่ใน history) และหน้า Company Profile แสดงผลตามปกติ

---
## TC-COMP-010003 — เข้าหน้าผ่านเมนู Modules → System Administration
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/dashboard`
**Steps**
1. เปิด popover "Modules"
2. เลือกโมดูล System Administration
3. คลิกเมนู Company Profile
**Expected**
นำทางไปที่ `/system-admin/company-profile` และหน้าแสดงหัวข้อ "Company Profile"

---
## TC-COMP-020001 — แสดงครบทั้ง 6 section ในโหมดอ่าน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` โดยข้อมูลโหลดสำเร็จ
**Steps**
1. เลื่อนดูหน้าตั้งแต่บนจนล่าง
**Expected**
เห็นหัวข้อ section ครบตามลำดับ: General, Hotel, Company, Branding, Date & Time, Number Formats และทุกฟิลด์แสดงเป็นกล่องอ่านอย่างเดียว (ไม่มี input)

---
## TC-COMP-020002 — section General แสดงค่าของ business unit ปัจจุบัน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมดอ่าน; BU ปัจจุบันมีค่า Name และ Business Group
**Steps**
1. ดูที่ section General
**Expected**
แสดงฟิลด์ Name, Alias, Business Group, Description, Info, Costing Method และ Default Currency พร้อมค่าของ BU ปัจจุบัน (Business Group และ Costing Method เป็นกล่องอ่านอย่างเดียว)

---
## TC-COMP-020003 — section Branding แสดงโลโก้/รูปประจำตัว หรือ "No image"
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมดอ่าน
**Steps**
1. เลื่อนไปที่ section Branding
**Expected**
เห็นช่อง Logo (กรอบแนวนอน) และ Avatar (กรอบวงกลม); ช่องใดที่ BU ยังไม่มีรูปจะแสดงข้อความ "No image" แทนรูป

---
## TC-COMP-020004 — section Number Formats แสดงรูปแบบสรุป locale + min digits
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมดอ่าน; BU มีค่า quantity_format ตั้งไว้แล้ว
**Steps**
1. เลื่อนไปที่ section Number Formats
**Expected**
Quantity / Per-Page / Recipe Format แสดงเป็นรูปแบบ `<locale> · min <n> digits` ส่วน Amount Format แสดงเฉพาะ locale

---
## TC-COMP-040001 — กดปุ่ม Edit แล้วเข้าสู่โหมดแก้ไข
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมดอ่าน
**Steps**
1. คลิกปุ่ม Edit
**Expected**
ปุ่ม Edit หายไปและมีปุ่ม Cancel กับ Save แทน; ฟิลด์ที่แก้ไขได้กลายเป็น input / textarea / dropdown โดย URL ไม่เปลี่ยน

---
## TC-COMP-040002 — แก้ไข Name แล้วบันทึกสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. แก้ค่าในช่อง Name เป็นค่าใหม่ที่ไม่ซ้ำ
2. คลิก Save
3. โหลดหน้า `/system-admin/company-profile` ใหม่
**Expected**
แสดง toast "Business unit updated"; หน้ากลับสู่โหมดอ่านและช่อง Name แสดงค่าใหม่หลังโหลดซ้ำ

---
## TC-COMP-040003 — แก้ไขที่อยู่ Hotel และ Company แล้วบันทึก
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. ที่ section Hotel กรอก Hotel Name, Hotel Tel, Hotel Address Line 1, Hotel City
2. ที่ section Company กรอก Company Name, Branch No., Tax ID, Company Postal Code
3. คลิก Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; ค่าทั้ง 8 ช่องแสดงค่าที่กรอกไว้หลังโหลดซ้ำ

---
## TC-COMP-040004 — เปลี่ยน Timezone และ Date Format
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. ที่ section Date & Time เปิด dropdown Timezone แล้วเลือกค่าอื่นจากรายการ (เช่น `Asia/Singapore`)
2. เปิด dropdown Date Format แล้วเลือก `dd/MM/yyyy`
3. คลิก Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; Timezone และ Date Format แสดงค่าใหม่หลังโหลดซ้ำ

---
## TC-COMP-040005 — เปลี่ยน Default Currency ผ่าน lookup
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว; มีสกุลเงินที่ active มากกว่า 1 รายการ
**Steps**
1. ที่ section General เปิด dropdown Default Currency
2. เลือกสกุลเงินอื่นจากรายการ
3. คลิก Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; ช่อง Default Currency ในโหมดอ่านแสดงรหัสสกุลเงินที่เลือกไว้

---
## TC-COMP-040006 — เปลี่ยน locale และ Min. digits ของ Quantity Format
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. ที่ section Number Formats เปิด dropdown locale ของ Quantity Format แล้วเลือก `en-US`
2. แก้ช่อง Min. digits เป็นเลขอื่น (เช่น 3)
3. คลิก Save
4. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; Quantity Format แสดงเป็น `en-US · min 3 digits` หลังโหลดซ้ำ

---
## TC-COMP-040007 — ล้างค่าฟิลด์ที่ไม่บังคับแล้วบันทึก
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว; ฟิลด์ Alias มีค่าอยู่แล้ว
**Steps**
1. ล้างค่าช่อง Alias ให้ว่าง
2. คลิก Save
3. โหลดหน้าใหม่
**Expected**
แสดง toast "Business unit updated"; ช่อง Alias ในโหมดอ่านแสดงเครื่องหมาย "—" (ค่าว่างถูกบันทึกเป็น null)

---
## TC-COMP-040008 — กด Save ทั้งที่ไม่ได้แก้อะไร
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้วโดยไม่แก้ค่าใด ๆ
**Steps**
1. คลิก Save ทันที
**Expected**
หน้ากลับสู่โหมดอ่าน (ปุ่มกลับเป็น Edit) โดยไม่มี toast และไม่มีการยิง PATCH ไปยัง backend

---
## TC-COMP-040009 — กด Cancel ทั้งที่ไม่ได้แก้อะไร
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้วโดยไม่แก้ค่าใด ๆ
**Steps**
1. คลิก Cancel
**Expected**
กลับสู่โหมดอ่านทันทีโดยไม่มี Discard dialog ขึ้นมา

---
## TC-COMP-040010 — กด Cancel ขณะมีการแก้ค้าง แล้วยืนยัน Discard
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit และจำค่าเดิมของช่อง Name ไว้
**Steps**
1. แก้ค่าช่อง Name เป็นค่าอื่น
2. คลิก Cancel
3. ใน dialog "Discard changes?" คลิกปุ่ม Discard
**Expected**
Dialog ปิด หน้ากลับสู่โหมดอ่าน และ Name แสดงค่าเดิม (การแก้ถูกทิ้งไป ไม่มี toast บันทึก)

---
## TC-COMP-040011 — ใน Discard dialog เลือก Keep editing
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. แก้ค่าช่อง Name เป็นค่าอื่น
2. คลิก Cancel
3. ใน dialog "Discard changes?" คลิกปุ่ม Keep editing
**Expected**
Dialog ปิด แต่ยังอยู่ในโหมด Edit และช่อง Name ยังคงค่าที่เพิ่งแก้ไว้

---
## TC-COMP-100001 — ผู้ใช้ไม่มีสิทธิ์เปิด URL ตรง
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่ใช่ admin และไม่มีสิทธิ์ `system_configuration.view` ใน BU ปัจจุบัน
**Steps**
1. ไปที่ `/system-admin/company-profile`
**Expected**
แสดงกล่อง Permission Denied ("You don't have permission to view this page.") แทนเนื้อหาหน้า และไม่เห็นข้อมูล business unit

---
## TC-COMP-100002 — ผู้ใช้ที่ยังไม่ล็อกอินเปิด URL ตรง
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน (browser context ใหม่ ไม่มี storageState)
**Steps**
1. ไปที่ `/system-admin/company-profile`
**Expected**
ถูกพาไปหน้า `/login` และไม่มีเนื้อหาของ Company Profile แสดง

---
## TC-COMP-200001 — บันทึกไม่ได้เมื่อ Name ว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. ล้างค่าช่อง Name ให้ว่าง
2. คลิก Save
**Expected**
แสดงข้อความ error ใต้ช่อง Name ว่าฟิลด์นี้จำเป็น ("Name is required"); ยังอยู่ในโหมด Edit และไม่มี toast บันทึกสำเร็จ

---
## TC-COMP-200002 — Company Email รูปแบบไม่ถูกต้อง
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. ที่ section Company กรอก Company Email เป็นข้อความที่ไม่ใช่อีเมล (เช่น `not-an-email`)
2. คลิก Save
**Expected**
แสดงข้อความ error "Invalid email format" ใต้ช่อง Company Email; ยังอยู่ในโหมด Edit และไม่บันทึก

---
## TC-COMP-200003 — Hotel Email รูปแบบไม่ถูกต้อง
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. ที่ section Hotel กรอก Hotel Email เป็นข้อความที่ไม่ใช่อีเมล (เช่น `hotel@@x`)
2. คลิก Save
**Expected**
แสดงข้อความ error "Invalid email format" ใต้ช่อง Hotel Email; ยังอยู่ในโหมด Edit และไม่บันทึก

---
## TC-COMP-200004 — ช่องข้อความจำกัดความยาวสูงสุด
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. พิมพ์ข้อความยาวเกิน 100 ตัวอักษรลงในช่อง Name
2. พิมพ์ข้อความยาวเกิน 256 ตัวอักษรลงในช่อง Info และช่อง Company Address Line 1
**Expected**
ช่อง Name รับได้ไม่เกิน 100 ตัวอักษร ส่วน Info และ Company Address Line 1 รับได้ไม่เกิน 256 ตัวอักษร (ตัวที่เกินไม่ถูกพิมพ์เข้าไป)

---
## TC-COMP-400001 — ฟิลด์ read-only ยังอ่านอย่างเดียวแม้อยู่ในโหมด Edit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. ดูฟิลด์ Business Group และ Costing Method ใน section General
2. ดูช่อง Logo และ Avatar ใน section Branding
**Expected**
Business Group และ Costing Method ยังเป็นกล่องอ่านอย่างเดียว (ไม่มี input ให้แก้) และ Branding ยังแสดงเป็นรูป/ข้อความ "No image" โดยไม่มีคอนโทรลอัปโหลด

---
## TC-COMP-400002 — Amount Format ไม่มีช่อง Min. digits
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` และกด Edit แล้ว
**Steps**
1. เลื่อนไปที่ section Number Formats
2. เปรียบเทียบคอนโทรลของ Amount Format กับของ Quantity Format
**Expected**
Amount Format มีเฉพาะ dropdown locale ไม่มีช่อง Min. digits ส่วน Quantity / Per-Page / Recipe Format มีทั้ง dropdown locale และช่อง Min. digits

---
## TC-COMP-400003 — นำทางออกจากหน้าขณะมีการแก้ค้าง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/system-admin/company-profile` ในโหมด Edit
**Steps**
1. แก้ค่าช่อง Name เป็นค่าอื่น
2. คลิกลิงก์นำทางไปหน้าอื่นภายในแอป (เช่นเมนูใน sidebar)
**Expected**
ยังไม่ออกจากหน้า แต่แสดง dialog "Discard changes?" พร้อมปุ่ม Keep editing และ Discard; กด Discard แล้วจึงนำทางออกไปยังปลายทาง

---
## TC-COMP-900001 — กดปุ่ม Back ของเบราว์เซอร์ขณะมีการแก้ค้าง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าหน้า `/system-admin/company-profile` จากหน้าอื่นภายในแอป (มี history ให้ถอย) แล้วกด Edit
**Steps**
1. แก้ค่าช่อง Name เป็นค่าอื่น
2. กดปุ่ม Back ของเบราว์เซอร์
**Expected**
ยังคงอยู่ที่ `/system-admin/company-profile` และแสดง dialog "Discard changes?" แทนการถอยกลับทันที

---
## TC-COMP-900002 — โหลดข้อมูล business unit ไม่สำเร็จ
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login เป็น admin@blueledgers.com; intercept request `GET api/business-units` ให้ตอบ error
**Steps**
1. ไปที่ `/system-admin/company-profile`
**Expected**
แสดง error state พร้อมข้อความ "Failed to load business unit settings." และปุ่ม Try again; ไม่มีปุ่ม Edit และไม่มี section ของฟอร์มแสดงออกมา
