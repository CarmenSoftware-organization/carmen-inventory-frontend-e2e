# Chart of Accounts — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/config/chart-of-accounts` (`coa-component.tsx`, `coa-dialog.tsx`, `coa-card.tsx`, `coa-filter-fields.ts`, `coa-form-schema.ts`, `use-coa-table.tsx`, `use-coa.ts`, `coa-import-carmen-gl-button.tsx`) plus the shared `ConfigListTemplate` / `ConfigEntityDialog` templates it composes. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Config — Chart of Accounts
**Frontend route:** `routes/config/chart-of-accounts`  •  **URL:** `/config/chart-of-accounts`
**Prefix:** `COA`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 29

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-COA-010001 | แสดงรายการผังบัญชีในตาราง | High | Smoke |
| TC-COA-010002 | ค้นหาบัญชีด้วยรหัสหรือชื่อบัญชี | High | Functional |
| TC-COA-010003 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Medium | Functional |
| TC-COA-010004 | กรองตามสถานะ Active / Inactive | High | Functional |
| TC-COA-010005 | กรองตามด้านบัญชี Debit / Credit (เลือกได้หลายค่า) | Medium | Functional |
| TC-COA-010006 | กรองตามประเภทบัญชี (เลือกได้หลายค่า) | Medium | Functional |
| TC-COA-010007 | ล้างตัวกรองทั้งหมดด้วยปุ่ม Clear | Medium | Functional |
| TC-COA-010008 | สลับมุมมอง List / Grid และตรวจข้อมูลบนการ์ด | Medium | Functional |
| TC-COA-010009 | คอลัมน์ Created / Updated ถูกซ่อนไว้และเปิดได้จากเมนูคอลัมน์ | Low | Functional |
| TC-COA-010010 | ส่งออกรายการผังบัญชีเป็นไฟล์ Excel | Medium | Functional |
| TC-COA-020001 | เปิด dialog รายละเอียดบัญชีจากคอลัมน์ Code | High | Happy Path |
| TC-COA-020002 | ปิด dialog ด้วยปุ่ม Cancel โดยไม่บันทึก | Medium | Alternate Flow |
| TC-COA-030001 | สร้างบัญชีใหม่ด้วยค่าเริ่มต้น Debit + Balance sheet | High | CRUD |
| TC-COA-030002 | สร้างบัญชีแบบ Credit / Income statement พร้อมคำอธิบาย | High | Happy Path |
| TC-COA-030003 | สร้างบัญชีโดยปิดสถานะใช้งานตั้งแต่ต้น | Medium | CRUD |
| TC-COA-040001 | แก้ไขชื่อบัญชีแล้วค่าคงอยู่ | High | CRUD |
| TC-COA-040002 | แก้ไขด้านบัญชีและประเภทบัญชีแล้วคอลัมน์อัปเดต | High | CRUD |
| TC-COA-050001 | ลบบัญชีจากเมนู Row actions | High | CRUD |
| TC-COA-050002 | ยกเลิกการลบใน dialog ยืนยัน | Medium | Alternate Flow |
| TC-COA-100001 | BU ที่สัญญาหมดอายุแก้ไขผังบัญชีไม่ได้ (อ่านได้อย่างเดียว) | High | Authorization |
| TC-COA-200001 | บันทึกไม่ได้เมื่อเว้นรหัสบัญชีว่าง | High | Validation |
| TC-COA-200002 | บันทึกไม่ได้เมื่อเว้นชื่อบัญชีว่าง | High | Validation |
| TC-COA-200003 | ช่องคำอธิบายไม่บังคับ — ปล่อยว่างแล้วบันทึกได้ | Medium | Validation |
| TC-COA-300001 | ปุ่ม Import from Carmen GL แสดงเฉพาะ BU ที่มีสิทธิ์ interface | High | Security |
| TC-COA-300002 | นำเข้าผังบัญชีจาก Carmen GL สำเร็จ | High | Functional |
| TC-COA-300003 | ยกเลิกใน dialog ยืนยันการนำเข้า | Medium | Alternate Flow |
| TC-COA-300004 | นำเข้าล้มเหลว — แสดงรายการแถวที่ผิดและไม่เปลี่ยนข้อมูล | High | Negative |
| TC-COA-900001 | ช่องกรอกจำกัดความยาวสูงสุดตามที่กำหนด | Low | Edge Case |
| TC-COA-900002 | ไม่พบข้อมูล — แสดงสถานะว่างและส่งออกไม่ได้ | Medium | Edge Case |

---
## TC-COA-010001 — แสดงรายการผังบัญชีในตาราง
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีรหัสบัญชีอย่างน้อย 1 รายการใน BU นี้
**Steps**
1. ไปที่ `/config/chart-of-accounts`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวข้อหน้าแสดง "Chart of Accounts"; ตารางแสดงคอลัมน์ Code, Account name, Description, Debit / Credit, Type, Status และ Created พร้อมคอลัมน์ checkbox เลือกแถว, คอลัมน์ลำดับ และปุ่ม Row actions ท้ายแถว; ค่า Debit / Credit และ Type แสดงเป็นข้อความที่อ่านออก (เช่น Debit, Balance sheet) ไม่ใช่ค่าดิบ; มีแถบ pagination ด้านล่าง

---
## TC-COA-010002 — ค้นหาบัญชีด้วยรหัสหรือชื่อบัญชี
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts`; มีบัญชีหลายรายการ
**Steps**
1. คลิกช่อง Search
2. พิมพ์รหัสบัญชีหรือชื่อบัญชีที่มีอยู่จริง
3. กด Enter
**Expected**
ตารางแสดงเฉพาะแถวที่ตรงกับคำค้น (การค้นหาทำงานเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น ไม่ใช่ระหว่างพิมพ์)

---
## TC-COA-010003 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ค้นหาไปแล้วอย่างน้อย 1 ครั้งและช่อง Search ยังมีข้อความอยู่
**Steps**
1. คลิกปุ่มกากบาท (Clear search) ท้ายช่องค้นหา
**Expected**
ช่องค้นหาว่าง และตารางกลับมาแสดงรายการทั้งหมดอีกครั้ง

---
## TC-COA-010004 — กรองตามสถานะ Active / Inactive
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีบัญชีทั้งสถานะ active และ inactive ใน BU BLAVG
**Steps**
1. คลิกปุ่ม Filter
2. เลือก Status = Active
3. ปิดเมนูตัวกรอง
**Expected**
ตารางแสดงเฉพาะแถวที่ Status badge เป็น Active; ปุ่ม Filter แสดง badge จำนวนตัวกรองที่ใช้งาน และมี chip ของตัวกรองปรากฏในแถบ active filter เหนือแถบตาราง

---
## TC-COA-010005 — กรองตามด้านบัญชี Debit / Credit (เลือกได้หลายค่า)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีบัญชีทั้งฝั่ง debit และ credit
**Steps**
1. คลิกปุ่ม Filter
2. ที่ช่อง Debit / Credit เลือก Debit
3. เลือก Credit เพิ่มอีกหนึ่งค่า (ช่องนี้เป็น multi-select)
**Expected**
เลือก Debit อย่างเดียวจะเหลือเฉพาะแถวที่คอลัมน์ Debit / Credit เป็น Debit; เมื่อเลือกทั้งสองค่า ตารางแสดงแถวของทั้งสองด้าน และแถบ active filter แสดงค่าที่เลือกไว้

---
## TC-COA-010006 — กรองตามประเภทบัญชี (เลือกได้หลายค่า)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีบัญชีมากกว่าหนึ่งประเภทในรายการ
**Steps**
1. คลิกปุ่ม Filter
2. ที่ช่อง Type เลือก Balance sheet
3. ตรวจว่าตัวเลือกมีครบ 4 ค่า: Header (not postable), Balance sheet, Income statement, Statistic
4. เลือก Income statement เพิ่ม
**Expected**
ตารางแสดงเฉพาะแถวที่ประเภทตรงกับค่าที่เลือก และรองรับการเลือกหลายประเภทพร้อมกัน

---
## TC-COA-010007 — ล้างตัวกรองทั้งหมดด้วยปุ่ม Clear
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีตัวกรองที่ใช้งานอยู่อย่างน้อย 2 ช่อง (เช่น Status + Type)
**Steps**
1. คลิกปุ่ม Clear ในเมนูตัวกรอง (หรือปุ่มล้างในแถบ active filter)
**Expected**
ตัวกรองทั้งหมดถูกล้าง; แถบ active filter หายไป; badge จำนวนบนปุ่ม Filter หายไป; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-COA-010008 — สลับมุมมอง List / Grid และตรวจข้อมูลบนการ์ด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts` บนหน้าจอ desktop; มีบัญชีอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มมุมมอง Grid
2. ดูข้อมูลบนการ์ดใบแรก
3. คลิกปุ่มมุมมอง List กลับ
**Expected**
โหมด Grid แสดงการ์ดที่มีหัวการ์ดเป็นรหัสบัญชี พร้อมแถวสถานะ, Account name, Debit / Credit และ Type (แถว Description แสดงเฉพาะเมื่อมีค่า) และแถวข้อมูล audit; กลับมาโหมด List แล้วตารางแสดงข้อมูลครบเหมือนเดิม

---
## TC-COA-010009 — คอลัมน์ Created / Updated ถูกซ่อนไว้และเปิดได้จากเมนูคอลัมน์
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts` ในมุมมอง List
**Steps**
1. ดูหัวตารางว่ามีคอลัมน์ Created / Updated หรือไม่
2. เปิดเมนู Toggle columns
3. เปิดคอลัมน์ Updated
**Expected**
ค่าเริ่มต้นคอลัมน์ Created และ Updated ถูกซ่อน; เมื่อเปิดจากเมนูคอลัมน์ คอลัมน์ Updated ปรากฏในตารางพร้อมข้อมูลวันเวลา/ผู้แก้ไข

---
## TC-COA-010010 — ส่งออกรายการผังบัญชีเป็นไฟล์ Excel
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts` บน desktop; ตารางมีข้อมูลอย่างน้อย 1 แถว
**Steps**
1. คลิกปุ่ม Export
**Expected**
ไฟล์ .xlsx ถูกดาวน์โหลด และแสดง toast แจ้งจำนวนรายการที่ส่งออก; ไฟล์มีคอลัมน์ Code, Account name, Description, Debit / Credit, Type และ Status

---
## TC-COA-020001 — เปิด dialog รายละเอียดบัญชีจากคอลัมน์ Code
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
มีบัญชีอย่างน้อย 1 รายการที่ทราบค่าทุกช่อง
**Steps**
1. คลิกที่รหัสบัญชีในคอลัมน์ Code ของแถวที่ต้องการ
**Expected**
เปิด dialog โหมดแก้ไข (หัวข้อ Edit Chart of Account) โดย URL ไม่เปลี่ยน; ช่อง Code, Account name, Description, Debit / Credit, Type และสวิตช์สถานะถูกเติมค่าจากแถวนั้นครบถ้วน

---
## TC-COA-020002 — ปิด dialog ด้วยปุ่ม Cancel โดยไม่บันทึก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เปิด dialog แก้ไขบัญชีอยู่
**Steps**
1. แก้ค่าในช่อง Account name
2. คลิกปุ่ม Cancel
3. เปิดบัญชีเดิมขึ้นมาอีกครั้ง
**Expected**
Dialog ปิดโดยไม่มี toast บันทึกสำเร็จ; ค่าที่แก้ไว้ไม่ถูกบันทึก — เปิดใหม่แล้วยังเป็นค่าเดิม

---
## TC-COA-030001 — สร้างบัญชีใหม่ด้วยค่าเริ่มต้น Debit + Balance sheet
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เตรียมรหัสบัญชีที่ยังไม่ถูกใช้งาน
**Steps**
1. คลิกปุ่ม Add Account
2. ตรวจว่าค่าตั้งต้นของ Debit / Credit คือ Debit และ Type คือ Balance sheet
3. กรอก Code และ Account name
4. คลิกปุ่ม Create
**Expected**
แสดง toast สร้างสำเร็จ; dialog ปิดลง; แถวใหม่ปรากฏในตารางโดยคอลัมน์ Debit / Credit = Debit, Type = Balance sheet และ Status = Active

---
## TC-COA-030002 — สร้างบัญชีแบบ Credit / Income statement พร้อมคำอธิบาย
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่ (กดปุ่ม Add Account แล้ว)
**Steps**
1. กรอก Code และ Account name
2. เลือก Debit / Credit = Credit
3. เลือก Type = Income statement
4. กรอกข้อความในช่อง Description
5. คลิกปุ่ม Create
**Expected**
แสดง toast สร้างสำเร็จ; แถวใหม่ในตารางแสดง Debit / Credit = Credit, Type = Income statement และคอลัมน์ Description แสดงข้อความที่กรอก

---
## TC-COA-030003 — สร้างบัญชีโดยปิดสถานะใช้งานตั้งแต่ต้น
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่
**Steps**
1. กรอก Code และ Account name
2. สลับสวิตช์สถานะให้เป็น inactive
3. คลิกปุ่ม Create
**Expected**
บัญชีถูกสร้างพร้อม toast สำเร็จ; แถวใหม่แสดง Status badge เป็น Inactive และกรองด้วยตัวกรอง Status = Inactive แล้วพบรายการนี้

---
## TC-COA-040001 — แก้ไขชื่อบัญชีแล้วค่าคงอยู่
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีบัญชีที่สร้างไว้จากเคสก่อนหน้า (หรือบัญชีทดสอบที่แก้ไขได้)
**Steps**
1. คลิกรหัสบัญชีในคอลัมน์ Code เพื่อเปิด dialog
2. แก้ไขช่อง Account name เป็นค่าใหม่
3. คลิกปุ่ม Save
4. เปิดบัญชีเดิมขึ้นมาอีกครั้ง
**Expected**
แสดง toast อัปเดตสำเร็จ; dialog ปิด; คอลัมน์ Account name ในตารางเป็นค่าใหม่ และเปิด dialog ซ้ำแล้วยังเป็นค่าใหม่

---
## TC-COA-040002 — แก้ไขด้านบัญชีและประเภทบัญชีแล้วคอลัมน์อัปเดต
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีบัญชีทดสอบที่ปัจจุบันเป็น Debit + Balance sheet
**Steps**
1. เปิด dialog แก้ไขของบัญชีนั้น
2. เปลี่ยน Debit / Credit เป็น Credit
3. เปลี่ยน Type เป็น Statistic
4. คลิกปุ่ม Save
**Expected**
แสดง toast อัปเดตสำเร็จ; แถวในตารางแสดง Debit / Credit = Credit และ Type = Statistic

---
## TC-COA-050001 — ลบบัญชีจากเมนู Row actions
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีบัญชีทดสอบที่ลบได้ (ไม่ถูกอ้างอิงจากที่อื่น)
**Steps**
1. คลิกปุ่ม Row actions ท้ายแถวของบัญชีนั้น
2. เลือกเมนู Delete
3. ยืนยันใน dialog ยืนยันการลบ
**Expected**
Dialog ยืนยันแสดงหัวข้อ Delete Account พร้อมรหัสบัญชีในข้อความยืนยัน; หลังยืนยันแสดง toast ลบสำเร็จ และแถวนั้นหายจากรายการ

---
## TC-COA-050002 — ยกเลิกการลบใน dialog ยืนยัน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
มีบัญชีอย่างน้อย 1 รายการในตาราง
**Steps**
1. คลิกปุ่ม Row actions ท้ายแถว แล้วเลือก Delete
2. ใน dialog ยืนยัน คลิก Cancel
**Expected**
Dialog ปิดลงโดยไม่มี toast ลบสำเร็จ; แถวเดิมยังอยู่ในตาราง

---
## TC-COA-100001 — BU ที่สัญญาหมดอายุแก้ไขผังบัญชีไม่ได้ (อ่านได้อย่างเดียว)
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยผู้ใช้ที่ active BU มีสัญญา license หมดอายุหรือถูกระงับ (canWrite = false); โมดูลนี้ไม่ได้ผูก RBAC permission ไว้ จึงเข้าหน้าได้ตามปกติ
**Steps**
1. ไปที่ `/config/chart-of-accounts`
2. คลิกปุ่ม Add Account
3. ปิดกล่องแจ้งเตือน แล้วเปิด dialog ของบัญชีใดบัญชีหนึ่งจากคอลัมน์ Code
4. เปิดเมนู Row actions ของแถวนั้น
**Expected**
ยังเห็นรายการผังบัญชีได้ตามปกติ; ปุ่ม Add Account แสดงแบบจาง และกดแล้วขึ้นกล่อง Subscription Expired แทนการเปิดฟอร์ม; dialog ที่เปิดจากคอลัมน์ Code เป็นโหมดอ่านอย่างเดียว (ทุกช่อง disabled, ไม่มีปุ่ม Save, มีแค่ปุ่ม Close); เมนู Delete ในแถวถูก disable พร้อม tooltip อธิบายว่าสัญญาหมดอายุ; ปุ่ม Import from Carmen GL ไม่แสดง

---
## TC-COA-200001 — บันทึกไม่ได้เมื่อเว้นรหัสบัญชีว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่
**Steps**
1. ปล่อยช่อง Code ว่างไว้
2. กรอกเฉพาะ Account name
3. คลิกปุ่ม Create
**Expected**
แสดงข้อความ required ใต้ช่อง Code; dialog ยังเปิดอยู่และไม่มีการสร้างบัญชีใหม่ (ไม่มี toast สร้างสำเร็จ)

---
## TC-COA-200002 — บันทึกไม่ได้เมื่อเว้นชื่อบัญชีว่าง
**Priority:** High · **Test Type:** Validation
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่
**Steps**
1. กรอกเฉพาะช่อง Code
2. ปล่อยช่อง Account name ว่างไว้
3. คลิกปุ่ม Create
**Expected**
แสดงข้อความ required ใต้ช่อง Account name (ข้อความใช้คำว่า "Description" ตามที่ schema ส่งชื่อฟิลด์ไป); dialog ยังเปิดอยู่และไม่มีการสร้างบัญชีใหม่

---
## TC-COA-200003 — ช่องคำอธิบายไม่บังคับ — ปล่อยว่างแล้วบันทึกได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่; เตรียมรหัสบัญชีที่ยังไม่ถูกใช้
**Steps**
1. กรอก Code และ Account name
2. ปล่อยช่อง Description ว่าง
3. คลิกปุ่ม Create
**Expected**
บัญชีถูกสร้างสำเร็จพร้อม toast; แถวใหม่ในตารางมีคอลัมน์ Description ว่าง และในมุมมอง Grid การ์ดของบัญชีนี้ไม่มีแถว Description

---
## TC-COA-300001 — ปุ่ม Import from Carmen GL แสดงเฉพาะ BU ที่มีสิทธิ์ interface
**Priority:** High · **Test Type:** Security
**Preconditions**
มี BU สองชุดให้เทียบ: BU ที่มีสิทธิ์ interface accounting / carmen_gl แบบ entitled และ BU ที่ไม่มีสิทธิ์ (หรือสิทธิ์หมดอายุ)
**Steps**
1. Login แล้วเลือก BU ที่มีสิทธิ์ interface นั้น แล้วไปที่ `/config/chart-of-accounts`
2. สลับไป BU ที่ไม่มีสิทธิ์ interface นั้น แล้วเข้าหน้าเดิม
**Expected**
BU ที่มีสิทธิ์เห็นปุ่ม Import from Carmen GL ในแถบปุ่มด้านบน; BU ที่ไม่มีสิทธิ์ (รวมถึงกรณีสิทธิ์หมดอายุ) ไม่เห็นปุ่มนี้เลย — ไม่ใช่แค่ปุ่มจางกดไม่ได้

---
## TC-COA-300002 — นำเข้าผังบัญชีจาก Carmen GL สำเร็จ
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com ใน BU ที่มีสิทธิ์ interface accounting / carmen_gl และตั้งค่า interface ไว้เรียบร้อยที่ `/system-admin/interface/accounting/carmen_gl`
**Steps**
1. ไปที่ `/config/chart-of-accounts`
2. คลิกปุ่ม Import from Carmen GL
3. อ่านข้อความใน dialog ยืนยัน แล้วคลิกปุ่มยืนยันการนำเข้า
**Expected**
Dialog ยืนยันแสดงหัวข้อเรื่องการดึงผังบัญชีจาก Carmen GL; ระหว่างทำงานปุ่มเปลี่ยนเป็นสถานะ Importing… และกดซ้ำไม่ได้; เมื่อเสร็จ dialog ปิดและแสดง toast สำเร็จพร้อมบรรทัดสรุปจำนวน created / updated / skipped / deleted; รายการในตารางถูกรีเฟรช

---
## TC-COA-300003 — ยกเลิกใน dialog ยืนยันการนำเข้า
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts` ใน BU ที่เห็นปุ่ม Import from Carmen GL
**Steps**
1. คลิกปุ่ม Import from Carmen GL
2. ใน dialog ยืนยัน คลิก Cancel
**Expected**
Dialog ปิดลงโดยไม่มี toast ผลการนำเข้า และรายการผังบัญชีไม่เปลี่ยนแปลง

---
## TC-COA-300004 — นำเข้าล้มเหลว — แสดงรายการแถวที่ผิดและไม่เปลี่ยนข้อมูล
**Priority:** High · **Test Type:** Negative
**Preconditions**
BU ที่มีสิทธิ์ interface แต่ข้อมูลต้นทางฝั่ง Carmen GL มีแถวที่ไม่ผ่านการตรวจ (หรือยังไม่ได้ตั้งค่า interface ให้ครบ) — backend เขียนแบบ all-or-nothing
**Steps**
1. คลิกปุ่ม Import from Carmen GL
2. ยืนยันการนำเข้าใน dialog
**Expected**
แสดง toast ผิดพลาดหัวข้อ Import failed; รายละเอียดใน toast ระบุแถวที่ผิดในรูปแบบ `#<เลขแถว> (<คอลัมน์>): <ข้อความ>` สูงสุด 5 บรรทัด และถ้ามีมากกว่านั้นจะมีบรรทัดสรุปจำนวนที่เหลือต่อท้าย; ไม่มีรายการใดถูกสร้าง/แก้ไข/ลบในตาราง

---
## TC-COA-900001 — ช่องกรอกจำกัดความยาวสูงสุดตามที่กำหนด
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
เปิด dialog สร้างบัญชีใหม่อยู่
**Steps**
1. พิมพ์ข้อความยาวเกิน 50 ตัวอักษรลงในช่อง Code
2. พิมพ์ข้อความยาวเกิน 150 ตัวอักษรลงในช่อง Account name
3. พิมพ์ข้อความยาวเกิน 150 ตัวอักษรลงในช่อง Description
**Expected**
ช่อง Code รับได้สูงสุด 50 ตัวอักษร; ช่อง Account name และ Description รับได้สูงสุดช่องละ 150 ตัวอักษร — ตัวที่เกินไม่ถูกพิมพ์ลงในช่อง

---
## TC-COA-900002 — ไม่พบข้อมูล — แสดงสถานะว่างและส่งออกไม่ได้
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/chart-of-accounts` บน desktop
**Steps**
1. ค้นหาด้วยคำที่ไม่มีทางตรงกับบัญชีใด แล้วกด Enter
2. สลับไปมุมมอง Grid เพื่อดูสถานะว่าง
3. กลับมามุมมอง List แล้วคลิกปุ่ม Export
**Expected**
ตารางไม่มีแถวข้อมูล และมุมมอง Grid แสดงสถานะ "ไม่มีข้อมูล"; การกด Export แสดง toast เตือนว่าไม่มีข้อมูลให้ส่งออก และไม่มีไฟล์ถูกดาวน์โหลด
