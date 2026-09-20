# Business Type — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/029-business-type.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/029-business-type.md`_

**Module:** Config — Business Type (ประเภทธุรกิจของผู้ขาย)
**Frontend route:** `routes/config/business-type`  •  **URL:** `/config/business-type`
**Prefix:** `BT`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/029-business-type.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 25

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/029-business-type.spec.ts` ถือ ID `TC-BT-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-BT-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, create/edit/delete ครบรอบ, toggle `is_active` + persist, แก้ชื่อแล้ว persist, cancel การแก้ไข, cancel การลบ, name ว่าง (ทั้งตอนสร้างและตอนแก้), name ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 30/90 ใช้ไม่ได้กับ prefix `BT`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `029-business-type.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30) และเคส edge (ปกติอยู่บล็อก 90) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือหน้า list — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `029-business-type.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 3. **Business Type มีฟิลด์กรอกแค่ตัวเดียว** — ต่างจาก `083-shelf.md` ที่ใช้เทียบ: ฟอร์มมีแค่ **Name** (บังคับ, `maxLength=100`) กับ status switch เท่านั้น **ไม่มี `code`, ไม่มี `description`, ไม่มีลำดับ** ยืนยันจาก `business-type-form-schema.ts` (`z.object({ name: z.string().min(1), is_active: z.boolean() })`) และ `business-type-dialog.tsx` — เคสของ shelf ที่ผูกกับ code/description/order จึงไม่มีคู่เทียบในโมดูลนี้และถูกตัดทิ้ง ไม่ได้ดัดแปลงมา
> 4. **หน้านี้มี default sort ต่างจาก unit และ shelf** — `business-type-component.tsx` ส่ง `defaultSort="name:asc"` เข้า `ConfigListTemplate` ผลคือเข้าหน้าครั้งแรก **URL ยังไม่มีพารามิเตอร์ `sort` แต่ตารางเรียงตามชื่อจากน้อยไปมากแล้ว** (`useDataGridState` เติม `effectiveSort` ให้เอง) ทำให้ในเมนูเรียงลำดับ **แถว "Default" กับแถว "Name" ถูกทำเครื่องหมายพร้อมกัน** (แถว Default เช็คจาก URL ดิบ, ลูกศรบนแถว Name เช็คจาก sorting state) และ **กด "Name" ครั้งแรกได้ `name:desc` ไม่ใช่ `asc`** เพราะมันเป็นการสลับทิศจากค่าเริ่มต้นที่ asc อยู่แล้ว — ดู `TC-BT-010011`
> 5. **คอลัมน์สถานะไม่มีชื่อในเมนู** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ไม่ได้ตั้ง `meta.headerTitle` ส่วนเมนูเรียงลำดับกับเมนู Toggle Columns ใช้สูตร `meta.headerTitle || column.id` รายการของคอลัมน์นี้ในทั้งสองเมนูจึงแสดงเป็น **ชื่อ accessor ดิบ `is_active`** ไม่ใช่คำว่า "Status" เคส `TC-BT-010011` / `TC-BT-010013` จึง assert แค่ว่ามีรายการของคอลัมน์สถานะอยู่ในเมนูและ toggle ได้ ไม่ได้ผูกกับข้อความบนรายการนั้น
> 6. **เมนู Row actions ไม่มี Edit** — `useBusinessTypeTable` ส่งให้ `useConfigTable` แค่ `onDelete` (ไม่ส่ง `onEdit`) เมนูจึงมีแค่ **Activity + Delete** ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction`) และการคลิกการ์ดในมุมมองการ์ดเท่านั้น
> 7. **business-type เป็นหนึ่งในไม่กี่โมดูล config ที่เปิด `activity`** — `useBusinessTypeTable` ส่ง `activity: { id: r.id, label: r.name }` (unit/shelf ไม่ส่ง) เคส `TC-BT-010018` จึง assert แค่ว่า **sheet เปิดขึ้นและหัวเรื่องอ้างชื่อรายการ** ไม่ได้ assert ว่ามีรายการกิจกรรมอยู่ข้างใน เพราะจะมีจริงหรือไม่ขึ้นกับ activity-registry ฝั่ง backend
> 8. **โมดูลนี้ไม่มี `licenseFeature`** — แถวของ `businessType` ใน `constant/module-list.ts` ประกาศแค่ `permission: PERMISSIONS.configuration.business_type.view` ต่างจาก unit (`configuration.unit`) และ shelf (`configuration`) ดังนั้นเส้นทาง "ล็อกเพราะสัญญา/ยังไม่ได้ซื้อ" (ไอคอนแม่กุญแจ, dialog "Subscription Expired"/"Feature Not Licensed") **ไม่เกิดกับหน้านี้** เคสบล็อก 10 ทั้งสี่ตัวจึงเป็น RBAC ล้วน
> 9. **`useBusinessTypeTable` ไม่ได้ส่ง `permissionPrefix` ต่อให้ `useConfigTable`** ทั้งที่ `ConfigListTemplate` ส่งมาให้ — `useDeleteGate` จึงตกไปใช้ `usePermissionPrefix()` ที่ derive จาก route ได้ `configuration.business_type` เหมือนกัน **ผลลัพธ์ตรงกัน** บันทึกไว้กันผู้รีวิวอ่านเป็นช่องโหว่
> 10. **ตารางมีคอลัมน์ checkbox แต่ไม่มี bulk action** — `useConfigTable` ใส่ `selectColumn()` ให้ทุกหน้าเสมอ ส่วน `ConfigListTemplate` ไม่มีแถบ action สำหรับแถวที่เลือก ติ๊กแล้วจึงไม่มีอะไรให้ทำต่อ — บันทึกเป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส
> 11. **สถานะ "Exporting..." แทบไม่มีทางจับได้** — `handleExport` เรียก `downloadXlsx` (async) โดยไม่ `await` แล้ว `setIsExporting(false)` ใน `finally` ทำงานทันที toast สำเร็จจึงขึ้นก่อนไฟล์เขียนเสร็จ เคส `TC-BT-010015` จึง assert ผลลัพธ์ (ไฟล์ + toast) ไม่ได้ assert สถานะระหว่างทาง
> 12. **`name` ที่เป็นช่องว่างล้วนผ่าน client validation** (`z.string().min(1)` นับช่องว่างเป็น 1 ตัวอักษร) — บันทึกไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นบั๊ก
> 13. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-BT-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-BT-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-BT-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-BT-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-BT-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-BT-010011 | เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามชื่อ และการสลับทิศ | Medium | Functional |
| TC-BT-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-BT-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-BT-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-BT-010015 | ส่งออกรายการประเภทธุรกิจเป็นไฟล์ XLSX | Medium | Functional |
| TC-BT-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-BT-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-BT-010018 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-BT-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-BT-030003 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-BT-030004 | ปิด dialog ด้วยปุ่ม Escape และหัว dialog ไม่มีปุ่มกากบาท | Low | Functional |
| TC-BT-040005 | หัวข้อและปุ่มของ dialog ตอนแก้ไข พร้อมค่าที่ถูกเติมครบ | Medium | Functional |
| TC-BT-040006 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-BT-050003 | ข้อความยืนยันลบแสดงชื่อประเภทธุรกิจ | Medium | Functional |
| TC-BT-050004 | ลบประเภทธุรกิจจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-BT-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-BT-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-BT-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-BT-100008 | ไม่มีสิทธิ์ดู — เมนู Business Type ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-BT-200004 | ข้อความ validation ของช่อง Name ระบุชื่อฟิลด์ และหายเมื่อกรอกค่า | Medium | Validation |

---
## TC-BT-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีประเภทธุรกิจอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/business-type`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Business Type" พร้อมคำอธิบายใต้ชื่อ ("How vendors are grouped by what they do — food supplier, laundry, maintenance."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Name, Status (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว — **ไม่มีคอลัมน์ Code และไม่มีคอลัมน์ Description**; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Business Type"

---
## TC-BT-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type`; มีประเภทธุรกิจหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับรายการที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-BT-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search..."); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-BT-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type`; มีประเภทธุรกิจทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เปลี่ยนเป็น "Inactive"
**Expected**
`BUSINESS_TYPE_FILTER_FIELDS` มี field เดียวคือ Status (ตัวเลือก Active / Inactive) — ไม่มีตัวกรองอื่นในเมนูนี้; เลือก Active แล้วตารางเหลือเฉพาะแถวที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip "Status Active" พร้อมปุ่มลบ (aria-label "Remove Status filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก Inactive แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน

---
## TC-BT-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-BT-010011 — เมนูเรียงลำดับ — ค่าเริ่มต้นเรียงตามชื่อ และการสลับทิศ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/business-type` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีประเภทธุรกิจอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายการในเมนู
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
เข้าหน้าครั้งแรก URL **ไม่มี** `sort` แต่ตารางเรียงตามชื่อจากน้อยไปมากอยู่แล้ว (`defaultSort="name:asc"`); ในเมนู **ทั้งแถว "Default" และแถว "Name" ถูกทำเครื่องหมายพร้อมกัน** (Default มีไอคอนนำหน้าเพราะ URL ไม่มี `sort`, Name มีลูกศรขึ้นเพราะ sorting state เป็น `name:asc`); เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้คือ Name, คอลัมน์สถานะ (ดูหมายเหตุข้อ 5) , Created และ Updated; เลือก "Name" ครั้งแรกได้ **`sort=name:desc`** พร้อมลูกศรลงและลำดับแถวกลับด้าน (เป็นการสลับทิศจากค่าเริ่มต้น ไม่ใช่เริ่มที่ asc); เลือกซ้ำอีกครั้งได้ `sort=name:asc`; เลือก "Default" ล้าง `sort` ออกจาก URL และตารางกลับไปเรียงตามชื่อจากน้อยไปมาก

---
## TC-BT-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` บนหน้าจอขนาด desktop; มีประเภทธุรกิจอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดง **ชื่อประเภทธุรกิจเป็นหัวเรื่อง** และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive) ตามด้วยแถวข้อมูล Created / By / Updated เท่านั้น (`BusinessTypeCard` มีแค่ `ListCardActiveRow` + `ListCardAuditRows` ไม่มีแถวอื่น) พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-BT-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Name
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และมี 4 รายการ: Name, รายการของคอลัมน์สถานะ (ดูหมายเหตุข้อ 5), Created และ Updated — คอลัมน์ช่องเลือก, ลำดับที่ และปุ่มจัดการไม่อยู่ในเมนู; Created และ Updated **ไม่ถูกติ๊กตั้งแต่ต้น** (ตรงกับ `columnVisibility` เริ่มต้นของ `useBusinessTypeTable`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Name แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-BT-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` ในมุมมองตาราง; BU มีประเภทธุรกิจมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-BT-010015 — ส่งออกรายการประเภทธุรกิจเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type` บน desktop; มีประเภทธุรกิจอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอให้ไฟล์ถูกดาวน์โหลด
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ชื่อ `businessType_<YYYY-MM-DD>.xlsx` ที่มี **2 คอลัมน์เท่านั้น ตามลำดับ Name / Status** (Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false) และชีทชื่อ "Business Type"; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น (ไม่ใช่ทั้ง BU); แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-BT-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/business-type` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ disable และหน้าใช้งานต่อได้ตามปกติ

---
## TC-BT-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/business-type` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่อง "View name" (จำกัด 120 ตัวอักษร) และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-BT-010018 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/business-type` และมีประเภทธุรกิจอย่างน้อย 1 รายการที่รู้ชื่อแน่นอน
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก "Activity"
4. ปิด sheet
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name เท่านั้น); เลือก Activity แล้วเปิด sheet หัวเรื่อง "Activity" ที่อ้างชื่อประเภทธุรกิจของแถวนั้น (label ของ activity คือ `r.name`); ปิด sheet กลับมาหน้าเดิมได้โดยข้อมูลในตารางไม่เปลี่ยน

---
## TC-BT-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/business-type` และยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Business Type"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Business Type"; ในฟอร์มมี **ช่องเดียวคือ Name** (`#business-type-name`) ที่ว่างอยู่ มี placeholder "e.g. Manufacturer, Distributor" และ label มีเครื่องหมาย `*` บังคับกรอก; ใต้ลงมาเป็นกล่องสถานะหัวข้อ "Active" พร้อมคำอธิบาย "Enable or disable this record" โดย switch (`#business-type-is-active`) อยู่ที่ `aria-checked="true"` และมีป้าย "Active" สีเขียว; footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save)

---
## TC-BT-030003 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/business-type`; เปิด dialog "Add Business Type" กรอก Name และปิด switch สถานะไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Business Type" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้น (Name ว่าง, switch กลับมา `aria-checked="true"`) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-BT-030004 — ปิด dialog ด้วยปุ่ม Escape และหัว dialog ไม่มีปุ่มกากบาท
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/business-type`; เปิด dialog "Add Business Type" และกรอก Name ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. สังเกตมุมขวาบนของ dialog
2. กดปุ่ม Escape
3. เปิด dialog "Add Business Type" อีกครั้ง
**Expected**
หัว dialog **ไม่มีปุ่มปิดรูปกากบาท** (`ConfigEntityDialog` ตั้ง `showCloseButton={false}`) ทางปิดมีแค่ Cancel กับ Escape; กด Escape แล้ว dialog ปิดทันที **โดยไม่มีกล่องยืนยันทิ้งการแก้ไข** และไม่มีแถวใหม่เพิ่มในตาราง; เปิดใหม่แล้วฟอร์มว่างเหมือนเปิดครั้งแรก

---
## TC-BT-040005 — หัวข้อและปุ่มของ dialog ตอนแก้ไข พร้อมค่าที่ถูกเติมครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีประเภทธุรกิจที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ทั้งชื่อและสถานะของมัน
**Steps**
1. ค้นหารายการนั้นแล้วคลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog
2. อ่านหัวข้อ dialog, ค่าในช่อง Name, สถานะ switch และปุ่มใน footer
3. กด Cancel
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog คือ "Edit Business Type" (ไม่ใช่ "Add Business Type"); ช่อง Name ถูกเติมด้วยชื่อเดิมของรายการ และ switch สะท้อนสถานะเดิมของรายการ; footer มีปุ่ม Cancel และปุ่ม **Save** (ไม่ใช่ Create); กด Cancel แล้ว dialog ปิดโดยไม่มี toast และข้อมูลในตารางไม่เปลี่ยน

---
## TC-BT-040006 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/business-type` และสลับเป็นมุมมองการ์ดแล้ว; มีประเภทธุรกิจอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Business Type" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Name และ switch สถานะ); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-BT-050003 — ข้อความยืนยันลบแสดงชื่อประเภทธุรกิจ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีประเภทธุรกิจที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยัน (role `alertdialog`) มีหัวข้อ "Delete Business Type" และคำอธิบายที่มีชื่อรายการนั้นอยู่ในข้อความ (`Are you sure you want to delete business type "<ชื่อ>"? This action cannot be undone.`); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Business Type deleted successfully" และแถวหายจากตาราง

---
## TC-BT-050004 — ลบประเภทธุรกิจจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีประเภทธุรกิจที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของรายการนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด — `ListCard` guard ด้วย `closest("button")` + `stopPropagation`) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Business Type deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-BT-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.business_type.view` แต่ไม่มี `configuration.business_type.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. ไปที่ `/config/business-type`
2. สังเกตสภาพปุ่ม "Add Business Type"
3. คลิกปุ่ม "Add Business Type"
**Expected**
ปุ่ม "Add Business Type" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้าง แต่เด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน — **ไม่ใช่** dialog "Subscription Expired" (โมดูลนี้ไม่มี `licenseFeature` ดูหมายเหตุข้อ 8)

---
## TC-BT-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.business_type.view` แต่ไม่มี `configuration.business_type.update` และไม่ใช่ admin ของ BU; มีประเภทธุรกิจอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/business-type`
2. คลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog
3. ลองแก้ค่าในช่อง Name และลองกด switch สถานะ
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว (`readOnly` ถูกส่งเมื่อ `updateDenied`): ช่อง Name และ switch สถานะถูก disable ทั้งคู่ แก้ค่าไม่ได้; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-BT-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.business_type.view` แต่ไม่มี `configuration.business_type.delete` และไม่ใช่ admin ของ BU; มีประเภทธุรกิจอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/business-type`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"`; คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน `useDeleteGate` ตัวเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-BT-100008 — ไม่มีสิทธิ์ดู — เมนู Business Type ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `configuration.business_type.view` และไม่ใช่ admin ของ BU
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar
2. สังเกตรายการ "Business Type"
3. คลิกรายการ "Business Type"
**Expected**
รายการ "Business Type" ยังอยู่ในเมนูแต่ถูกทำให้จาง (`opacity-50`) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/business-type">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจเด็ดขาด** เพราะแม่กุญแจสงวนไว้ให้กรณี `locked` (license) ซึ่งโมดูลนี้ไม่มีทางเข้าเงื่อนไขนั้น; คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-BT-200004 — ข้อความ validation ของช่อง Name ระบุชื่อฟิลด์ และหายเมื่อกรอกค่า
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Business Type" อยู่โดยยังไม่กรอกอะไร
**Steps**
1. กดปุ่ม Create ทั้งที่ช่อง Name ว่าง
2. อ่านข้อความ error และสังเกต attribute ของช่อง Name
3. พิมพ์ชื่อที่ไม่ซ้ำลงในช่อง Name แล้วกด Create
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ข้อความ validation ที่แสดงคือ **"Name is required"** (มาจาก `validation.required` ที่ interpolate `field.name`) ไม่ใช่ข้อความรวม ๆ; ช่อง Name ได้ `aria-invalid="true"` พร้อมไอคอนเตือนท้ายช่อง และ dialog ยังเปิดค้างอยู่โดยไม่มี request ถูกส่ง; พอกรอกชื่อแล้วกด Create ข้อความ error หายไป, `aria-invalid` กลับเป็นปกติ และสร้างสำเร็จพร้อม toast "Business Type created successfully"

---
