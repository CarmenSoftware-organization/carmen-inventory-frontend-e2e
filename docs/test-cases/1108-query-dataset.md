# Query Dataset (SQL Workbench) — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/query-dataset`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Query Dataset / SQL Workbench
**Frontend route:** `routes/system-admin/query-dataset`  •  **URL:** `/system-admin/query-dataset`
**Prefix:** `QDS`
**Default role:** Platform Admin
**Total test cases:** 21

> โมดูลนี้คือ SQL Workbench: ด้านซ้ายเป็น Database Object Tree (Views / Procedures·Functions, ค้นหาได้), ด้านขวามีฟอร์ม Object Name + Type (View / Stored Procedure / Function), Monaco SQL Editor (Run / Format / Comment / Find / Wrap / Minimap / Clear, autocomplete จาก schema, Ctrl+Enter รัน), Result Panel (จำนวน rows / duration / cols, export CSV, pagination, แสดง error พร้อม line hint) และปุ่ม Save / Drop. มี SQL safety validator: Run อนุญาตเฉพาะ SELECT/WITH/SHOW/EXPLAIN/DESCRIBE/DESC, Save อนุญาต CREATE หรือ SELECT/WITH เท่านั้น (กัน DROP/TRUNCATE/DELETE/UPDATE).

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-QDS-010001 | หน้า SQL Workbench โหลดสำเร็จ | High | Smoke |
| TC-QDS-010002 | Database Object Tree แสดง Views และ Procedures/Functions | High | Smoke |
| TC-QDS-010003 | ค้นหา object ใน tree กรองรายการได้ | Medium | Functional |
| TC-QDS-010004 | พับ/ขยาย section Views และ Procedures ได้ | Low | Functional |
| TC-QDS-020001 | ฟอร์มมีช่อง Object Name และ Type (View/SP/Function) | High | Smoke |
| TC-QDS-020002 | เลือก Type จาก dropdown เปลี่ยนค่าได้ | Medium | Functional |
| TC-QDS-020003 | คลิก object ใน tree โหลด definition เข้า editor | High | Functional |
| TC-QDS-030001 | สร้าง View ใหม่ด้วย CREATE OR REPLACE VIEW แล้ว Save สำเร็จ | High | CRUD |
| TC-QDS-030002 | Save bare SELECT เป็น View (auto-wrap) โดยใส่ Object Name | High | CRUD |
| TC-QDS-050001 | ปุ่ม Drop แสดงเมื่อโหลด object และลบได้หลังยืนยัน | High | CRUD |
| TC-QDS-050002 | ยกเลิก confirm ของ Drop — object ยังอยู่ | Medium | Functional |
| TC-QDS-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-QDS-300001 | Run SELECT แสดงผลใน Result Panel | High | Functional |
| TC-QDS-300002 | Result Panel แสดง row count / duration / column count | Medium | Functional |
| TC-QDS-300003 | export ผลลัพธ์เป็น CSV ได้ | Medium | Functional |
| TC-QDS-300004 | pagination ของผลลัพธ์ (rows per page) ใช้งานได้ | Low | Functional |
| TC-QDS-300005 | SQL ผิดต้องแสดง error panel พร้อม line hint | Medium | Negative |
| TC-QDS-300006 | ปุ่ม Format จัดรูปแบบ SQL (keyword uppercase) | Low | Functional |
| TC-QDS-200001 | Run คำสั่งที่ไม่ใช่ read (DROP/DELETE) ถูกบล็อกด้วย safety validator | High | Validation |
| TC-QDS-200002 | Save SQL ที่มี DROP/TRUNCATE ถูกปฏิเสธ | High | Validation |
| TC-QDS-200003 | Save โดยไม่ใส่ Object Name สำหรับ View (ที่ไม่ใช่ CREATE) ถูกปฏิเสธ | Medium | Validation |

---
## TC-QDS-010001 — หน้า SQL Workbench โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin > Query Dataset
**Steps**
1. ไปที่ `/system-admin/query-dataset`
**Expected**
URL ตรงกับ `/system-admin/query-dataset`, หัวข้อ SQL Workbench แสดง, sidebar Database Objects และ SQL Editor ปรากฏ

---
## TC-QDS-010002 — Database Object Tree แสดง Views และ Procedures/Functions
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; tenant database มี views/procedures อยู่บ้าง
**Steps**
1. ดู sidebar ซ้าย
2. ตรวจ section Views และ Procedures / Functions
**Expected**
section Views และ Procedures/Functions แสดงพร้อมตัวนับจำนวน; แต่ละ item แสดง `schema.name` (procedure มี badge PROC, function มี badge FN)

---
## TC-QDS-010003 — ค้นหา object ใน tree กรองรายการได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; มี object หลายรายการ
**Steps**
1. พิมพ์ชื่อ object บางส่วนในช่อง Search ของ sidebar
**Expected**
รายการถูกกรองเหลือเฉพาะที่ `schema.name` ตรงกับคำค้น; ถ้าไม่พบแสดง "No matches"

---
## TC-QDS-010004 — พับ/ขยาย section Views และ Procedures ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. คลิกหัว section Views เพื่อพับ
2. คลิกอีกครั้งเพื่อขยาย
**Expected**
รายการใต้ section ซ่อน/แสดงตามการ toggle (ไอคอน chevron เปลี่ยนทิศ)

---
## TC-QDS-020001 — ฟอร์มมีช่อง Object Name และ Type (View/SP/Function)
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. ดูแถวฟอร์มเหนือ SQL Editor
**Expected**
มีช่อง Object Name (placeholder `e.g. v_pr_summary`) และ Select Type ที่มีตัวเลือก View / Stored Procedure / Function (ค่าเริ่มต้น View)

---
## TC-QDS-020002 — เลือก Type จาก dropdown เปลี่ยนค่าได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. เปิด Select Type
2. เลือก Stored Procedure
**Expected**
trigger ของ Select แสดง Stored Procedure; ค่า query type ถูกอัปเดต

---
## TC-QDS-020003 — คลิก object ใน tree โหลด definition เข้า editor
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; มี view อย่างน้อย 1 รายการใน tree
**Steps**
1. คลิก view รายการหนึ่งใน sidebar
2. รอให้ definition โหลด
**Expected**
success toast "Loaded view: schema.name", ช่อง Object Name และ SQL Editor ถูกเติมด้วย definition, Type ตรงกับชนิด object, และมีข้อความ "Editing: schema.name (type)" พร้อมปุ่ม Drop ปรากฏ

---
## TC-QDS-030001 — สร้าง View ใหม่ด้วย CREATE OR REPLACE VIEW แล้ว Save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; มีสิทธิ์สร้าง object ใน tenant DB
**Steps**
1. กรอก SQL `CREATE OR REPLACE VIEW v_test_qds AS SELECT 1 AS n;` ใน editor
2. กด Save
**Expected**
success toast แจ้งว่า View ถูก save พร้อมชื่อและ schema; object ใหม่ปรากฏใน tree หลัง refresh

---
## TC-QDS-030002 — Save bare SELECT เป็น View (auto-wrap) โดยใส่ Object Name
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; Type = View
**Steps**
1. กรอก Object Name = `v_test_autowrap`
2. กรอก SQL `SELECT 1 AS n` (bare select ไม่มี CREATE)
3. กด Save
**Expected**
ระบบ auto-wrap เป็น CREATE OR REPLACE VIEW และ save สำเร็จ (success toast); ไม่มี error เรื่อง name เพราะมี Object Name แล้ว

---
## TC-QDS-050001 — ปุ่ม Drop แสดงเมื่อโหลด object และลบได้หลังยืนยัน
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี view ที่สร้างในชุดทดสอบ (เช่น v_test_qds); โหลด object นั้นเข้า editor แล้ว
**Steps**
1. คลิก view ใน tree เพื่อโหลด (ปุ่ม Drop ปรากฏ)
2. กด Drop
3. ในกล่อง confirm ของบราวเซอร์ กด OK
**Expected**
success toast "Dropped view: name", ฟอร์มถูก reset (เหมือนกด New) และ object หายจาก tree

---
## TC-QDS-050002 — ยกเลิก confirm ของ Drop — object ยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
โหลด object เข้า editor แล้ว (ปุ่ม Drop ปรากฏ)
**Steps**
1. กด Drop
2. ในกล่อง confirm กด Cancel
**Expected**
ไม่มีการลบ; object ยังคงอยู่ใน tree และ editor ยังคงค่าเดิม

---
## TC-QDS-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/query-dataset` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็น SQL Workbench

---
## TC-QDS-300001 — Run SELECT แสดงผลใน Result Panel
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. กรอก `SELECT 1 AS n, 'a' AS label` ใน editor
2. กด Run (หรือ Ctrl+Enter)
**Expected**
Result Panel เปิดขึ้นแสดงตารางผลลัพธ์ที่มีคอลัมน์ n และ label พร้อมแถวข้อมูล

---
## TC-QDS-300002 — Result Panel แสดง row count / duration / column count
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; รัน SELECT ที่คืนหลายแถว
**Steps**
1. รัน query ที่คืนข้อมูล
2. ดูแถบ header ของ Result Panel
**Expected**
header แสดงจำนวน rows, durationMs (ms) และจำนวน cols ตรงกับผลลัพธ์จริง

---
## TC-QDS-300003 — export ผลลัพธ์เป็น CSV ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีผลลัพธ์ที่ rowCount > 0 ใน Result Panel
**Steps**
1. รัน query ที่มีผลลัพธ์
2. กดปุ่ม CSV ใน header ของ Result Panel
**Expected**
ไฟล์ `query_result_<timestamp>.csv` ถูกดาวน์โหลด มี header เป็นชื่อคอลัมน์และแถวข้อมูลที่ escape อย่างถูกต้อง

---
## TC-QDS-300004 — pagination ของผลลัพธ์ (rows per page) ใช้งานได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีผลลัพธ์มากกว่า 100 แถว (เกิน page size เริ่มต้น)
**Steps**
1. รัน query ที่คืน > 100 แถว
2. กด Next / เปลี่ยน Rows per page (50/100/200/500)
**Expected**
ตารางแสดงทีละหน้าตาม page size; ปุ่ม Prev/Next ทำงานและช่วง "x–y of total" ถูกต้อง

---
## TC-QDS-300005 — SQL ผิดต้องแสดง error panel พร้อม line hint
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. กรอก SQL ที่ syntax ผิด เช่น `SELECT FROM` (ผ่าน safety validator แต่ DB จะ error)
2. กด Run
**Expected**
Result Panel แสดงสถานะ Error พร้อมข้อความจาก DB; ถ้า error มี "line N" จะแสดง hint "error referenced line N"

---
## TC-QDS-300006 — ปุ่ม Format จัดรูปแบบ SQL (keyword uppercase)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; มี SQL ใน editor ที่เขียนตัวพิมพ์เล็ก
**Steps**
1. กรอก `select n from t where n>1`
2. กดปุ่ม Format (หรือ Ctrl+Shift+F)
**Expected**
SQL ถูกจัดรูปแบบใหม่ด้วย sql-formatter (keyword เป็นตัวพิมพ์ใหญ่, จัด indent); editor และ state อัปเดตเป็นเวอร์ชันที่ format แล้ว

---
## TC-QDS-200001 — Run คำสั่งที่ไม่ใช่ read (DROP/DELETE) ถูกบล็อกด้วย safety validator
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. กรอก `DROP TABLE users;` ใน editor
2. กด Run
**Expected**
error toast "Invalid SQL" (จาก validateSqlSafety) และคำสั่งไม่ถูกส่งไปรัน; Run อนุญาตเฉพาะ SELECT/WITH/SHOW/EXPLAIN/DESCRIBE/DESC

---
## TC-QDS-200002 — Save SQL ที่มี DROP/TRUNCATE ถูกปฏิเสธ
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`
**Steps**
1. กรอก `TRUNCATE TABLE orders;` ใน editor
2. กด Save
**Expected**
error toast "Invalid SQL" และไม่มีการ save; Save อนุญาตเฉพาะ CREATE (view/procedure/function) หรือ SELECT/WITH เท่านั้น

---
## TC-QDS-200003 — Save โดยไม่ใส่ Object Name สำหรับ View (ที่ไม่ใช่ CREATE) ถูกปฏิเสธ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/query-dataset`; Type = View
**Steps**
1. ปล่อย Object Name ว่าง
2. กรอก SQL `SELECT 1` (bare select ไม่ขึ้นต้นด้วย CREATE VIEW)
3. กด Save
**Expected**
error toast "Please enter a name for the view" และไม่มีการ save

---
<sub>Authored: 2026-06-17 · documentation only</sub>
