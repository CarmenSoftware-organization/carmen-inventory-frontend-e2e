# Unit — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/020-unit.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/020-unit.md`_

**Module:** Config — Unit of Measurement (หน่วยนับ)
**Frontend route:** `routes/config/unit`  •  **URL:** `/config/unit`
**Prefix:** `UN`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/020-unit.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 27

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/020-unit.spec.ts` ถือ ID `TC-UN-010001..010005`, `030001`, `040001`, `040002`, `050001`, `200001..200004` และ helper `addDialogSecurityCases` ถือ `TC-UN-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, create/edit name/delete ครบรอบ, toggle `is_active`, description create + maxLength, name ว่าง (ทั้งตอนสร้างและตอนแก้), name ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **Section 30/90 ใช้ไม่ได้กับ prefix `UN`** — `docs/test-id-scheme.md` ลงทะเบียนให้ `020-unit.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30) และเคส edge (ปกติอยู่บล็อก 90) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือหน้า list — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `020-unit.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 3. **Unit ไม่มีฟิลด์ `code`** — ต่างจาก `083-shelf.md` ที่ใช้เทียบ: ฟอร์มมีแค่ Name (บังคับ, maxLength 100), Decimal Places (number, min 0 / max 5 / step 1), Description (textarea, maxLength 256) และ status switch เคสใดที่ shelf ผูกกับ code/order จึงถูกแปลงมาเป็น **Decimal Places** ของ unit แทน ยืนยันจาก `components/share/unit-dialog.tsx`
> 4. **`decimal_place` ไม่มีทางแสดง error ได้เลย** — schema คือ `z.coerce.number().int().min(0).max(QTY_MAX_DECIMALS).catch(0)` (`QTY_MAX_DECIMALS = 5`) `.catch(0)` ครอบทั้งสาย ค่าที่ว่าง/ไม่ใช่ตัวเลข/นอกช่วง/ทศนิยม จะถูกแปลงเป็น `0` เงียบ ๆ ไม่มีข้อความ validation ให้เห็น ด่านเดียวที่ผู้ใช้เห็นคือ attribute `min`/`max`/`step` บน `input[type=number]` เคส `TC-UN-200005` / `TC-UN-200006` จึง assert เฉพาะสิ่งที่ UI แสดงตามออกแบบ ไม่ได้ assert ว่ามี error
> 5. **เมนู Row actions ของ unit ไม่มี Edit** — `useUnitTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` → `actionColumn` จึง render เฉพาะ Activity + Delete ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name (`CellAction`) เท่านั้น
> 6. **`name` ที่เป็นช่องว่างล้วน** ผ่าน client validation ได้ (`z.string().min(1)` นับช่องว่างเป็น 1 ตัวอักษร) — บันทึกไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นบั๊ก
> 7. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-UN-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-UN-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-UN-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-UN-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-UN-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-UN-010011 | เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default | Medium | Functional |
| TC-UN-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-UN-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-UN-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-UN-010015 | ส่งออกรายการหน่วยนับเป็นไฟล์ XLSX | Medium | Functional |
| TC-UN-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-UN-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-UN-010018 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-UN-030002 | สร้างหน่วยนับพร้อมกำหนด Decimal Places | Medium | Happy Path |
| TC-UN-030003 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-UN-030004 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-UN-040003 | แก้ไข Decimal Places แล้วค่าคงอยู่ | Medium | CRUD |
| TC-UN-040004 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-UN-050002 | ข้อความยืนยันลบแสดงชื่อหน่วยนับ | Medium | Functional |
| TC-UN-050003 | ยกเลิกการลบใน dialog ยืนยัน | Medium | Alternate Flow |
| TC-UN-050004 | ลบหน่วยนับจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-UN-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-UN-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-UN-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-UN-100008 | ไม่มีสิทธิ์ดู — เมนู Unit ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-UN-200005 | เว้น Decimal Places ว่างแล้วบันทึกได้ | Medium | Validation |
| TC-UN-200006 | ช่อง Decimal Places จำกัดช่วง 0–5 ที่ตัว input | Medium | Validation |

---
## TC-UN-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหน่วยนับอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/unit`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Unit of Measurement" พร้อมคำอธิบายใต้ชื่อ; ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Name, Description, Decimal Places (จัดชิดขวา), Status และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view (`View: No view`), ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์, ปุ่มสลับมุมมอง list/grid และแถบหัวมีปุ่ม Export, Print, "Add Unit"

---
## TC-UN-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit`; มีหน่วยนับหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับหน่วยนับที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-UN-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย; คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-UN-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit`; มีหน่วยนับทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active" จากรายการ All / Active / Inactive
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
**Expected**
ตารางเหลือเฉพาะหน่วยนับที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip "Status Active" พร้อมปุ่มลบ; query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน

---
## TC-UN-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-UN-010011 — เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/unit` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีหน่วยนับอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกต URL ตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายชื่อคอลัมน์ในเมนู
3. เลือก "Name"
4. เลือก "Name" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้**ไม่มี default sort** — เข้าครั้งแรก URL ไม่มี `sort` และแถว "Default" มีเครื่องหมายกำกับอยู่; เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้ (Name, Description, Decimal Places, Status, Created, Updated); เลือก Name ครั้งแรกได้ `sort=name:asc` พร้อมลูกศรขึ้นบนแถวนั้น, เลือกซ้ำได้ `sort=name:desc` พร้อมลูกศรลง และลำดับแถวสลับตาม; เลือก Default ล้าง `sort` ออกจาก URL

---
## TC-UN-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` บนหน้าจอขนาด desktop; มีหน่วยนับอย่างน้อย 1 รายการที่กรอก Description ไว้
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดใบแรกและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อหน่วยนับเป็นหัวเรื่อง และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว Description (แสดงเฉพาะเมื่อมีค่า), แถว Decimal Places และแถวข้อมูล Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-UN-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Description
**Expected**
เมนูแสดงรายการ Name, Description, Decimal Places, Status, Created, Updated พร้อม checkbox; Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น (ตรงกับ `columnVisibility` เริ่มต้นของตาราง); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Description แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-UN-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` ในมุมมองตาราง; BU มีหน่วยนับมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-UN-010015 — ส่งออกรายการหน่วยนับเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit` บน desktop; มีหน่วยนับอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่มี 4 คอลัมน์ตามลำดับ Name / Description / Decimal Places / Status (Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false); ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-UN-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/unit` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state)
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-UN-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/unit` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "View: No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog "Save view" มีช่องชื่อ (จำกัด 120 ตัวอักษร) และตัวเลือก visibility "Only me" / "Everyone in this business unit"; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-UN-010018 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/unit` และมีหน่วยนับอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Name เท่านั้น); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมของหน่วยนับแถวนั้นโดยหัวเรื่องอ้างชื่อหน่วยนับ และปิด sheet กลับมาหน้าเดิมได้โดยข้อมูลไม่เปลี่ยน

---
## TC-UN-030002 — สร้างหน่วยนับพร้อมกำหนด Decimal Places
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/unit`
**Steps**
1. คลิกปุ่ม "Add Unit"
2. กรอก Name ที่ไม่ซ้ำ
3. แก้ช่อง Decimal Places เป็น `3`
4. คลิกปุ่ม Create
5. ค้นหาชื่อที่เพิ่งสร้างในตาราง แล้วเปิดรายการนั้นซ้ำ
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Unit created successfully" และ dialog ปิดเอง; แถวใหม่ในตารางมีคอลัมน์ Decimal Places = `3` (จัดชิดขวา); เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Decimal Places ยังเป็น `3` (ค่าถูก persist จริง ไม่ใช่แค่แสดงผล)

---
## TC-UN-030003 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/unit`; เปิด dialog "Add Unit" และกรอก Name กับ Description ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Unit" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้น (Name ว่าง, Description ว่าง, Decimal Places = 0, status switch = เปิด) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-UN-030004 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/unit`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Unit"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Unit"; ช่อง Name ว่างและมี placeholder "e.g. kg, pcs, litre" พร้อมเครื่องหมายบังคับกรอกที่ label; ช่อง Decimal Places แสดง `0`; ช่อง Description ว่างและมี placeholder "Optional"; status switch อยู่ที่เปิดใช้งาน (`aria-checked="true"`); footer มีปุ่ม Cancel และปุ่ม Create (ไม่ใช่ Save)

---
## TC-UN-040003 — แก้ไข Decimal Places แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีหน่วยนับที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. ค้นหาหน่วยนับนั้นแล้วคลิกชื่อในคอลัมน์ Name เพื่อเปิด dialog แก้ไข
2. แก้ช่อง Decimal Places เป็นค่าใหม่ในช่วง 0–5 (เช่น `2`)
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. เปิด dialog ของหน่วยนับนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog ตอนแก้ไขคือ "Edit Unit" และปุ่มบันทึกคือ Save; แสดง toast "Unit updated successfully" และ dialog ปิดเอง; คอลัมน์ Decimal Places ในตารางเปลี่ยนเป็นค่าใหม่ และเปิด dialog ซ้ำแล้วช่องแสดงค่าใหม่

---
## TC-UN-040004 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/config/unit` และสลับเป็นมุมมองการ์ดแล้ว; มีหน่วยนับอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
**Expected**
เปิด dialog "Edit Unit" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Name, Decimal Places, Description, status switch); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน

---
## TC-UN-050002 — ข้อความยืนยันลบแสดงชื่อหน่วยนับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีหน่วยนับที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Unit" และคำอธิบายที่มีชื่อหน่วยนับนั้นอยู่ในข้อความ ("...delete unit \"<ชื่อ>\"? This action cannot be undone."); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน)

---
## TC-UN-050003 — ยกเลิกการลบใน dialog ยืนยัน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/unit` และมีหน่วยนับอย่างน้อย 1 รายการ
**Steps**
1. เปิดเมนู Row actions ของแถวแรกแล้วเลือก Delete
2. คลิกปุ่ม Cancel ใน dialog ยืนยัน
**Expected**
dialog ปิดโดยไม่มี toast; แถวนั้นยังอยู่ในตารางและจำนวนรายการรวมใน pagination ไม่เปลี่ยน

---
## TC-UN-050004 — ลบหน่วยนับจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีหน่วยนับที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของหน่วยนับนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Unit deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-UN-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `product_management.unit.view` แต่ไม่มี `product_management.unit.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`)
**Steps**
1. ไปที่ `/config/unit`
2. สังเกตสภาพปุ่ม "Add Unit"
3. คลิกปุ่ม "Add Unit"
**Expected**
ปุ่ม "Add Unit" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้างหน่วยนับ แต่เด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน

---
## TC-UN-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `product_management.unit.view` แต่ไม่มี `product_management.unit.update` และไม่ใช่ admin ของ BU; มีหน่วยนับอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/unit`
2. คลิกชื่อหน่วยนับในคอลัมน์ Name เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง Name, Decimal Places, Description และ status switch ถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel")

---
## TC-UN-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `product_management.unit.view` แต่ไม่มี `product_management.unit.delete` และไม่ใช่ admin ของ BU; มีหน่วยนับอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/unit`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"`; คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดคุมสิทธิ์ชุดเดียวกัน) และไม่มีรายการใดถูกลบ

---
## TC-UN-100008 — ไม่มีสิทธิ์ดู — เมนู Unit ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ไม่มีสิทธิ์ `product_management.unit.view` และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังมี license `configuration.unit` อยู่ (ไม่งั้นจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผล)
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar
2. สังเกตรายการ "Unit"
3. คลิกรายการ "Unit"
**Expected**
รายการ "Unit" ยังอยู่ในเมนูแต่ถูกทำให้จาง (opacity ต่ำลง) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/unit">` ให้กดไปหน้า; ไม่มีไอคอนแม่กุญแจ (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied" พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-UN-200005 — เว้น Decimal Places ว่างแล้วบันทึกได้
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; เปิด dialog "Add Unit" และกรอก Name ที่ไม่ซ้ำไว้แล้ว
**Steps**
1. ล้างค่าในช่อง Decimal Places ให้ว่าง
2. คลิกปุ่ม Create
3. เปิดรายการที่เพิ่งสร้างซ้ำ
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ไม่มีข้อความ error ใต้ช่อง Decimal Places และ dialog ไม่ถูกบล็อก; สร้างสำเร็จพร้อม toast "Unit created successfully"; คอลัมน์ Decimal Places ของแถวใหม่แสดง `0` และเปิด dialog ซ้ำแล้วช่องแสดง `0` (ค่าว่างถูกแปลงเป็น 0 ตาม fallback ของ schema ไม่ใช่ error)

---
## TC-UN-200006 — ช่อง Decimal Places จำกัดช่วง 0–5 ที่ตัว input
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Unit" อยู่
**Steps**
1. ตรวจ attribute ของช่อง Decimal Places (`#unit-decimal-place`)
2. ใช้ปุ่มลูกศรขึ้นของช่องเพิ่มค่าจนสุด แล้วใช้ลูกศรลงลดค่าจนสุด
**Expected**
ช่องเป็น `input[type="number"]` ที่มี `min="0"`, `max="5"` (= `QTY_MAX_DECIMALS`) และ `step="1"` พร้อม `inputmode="numeric"` และจัดตัวเลขชิดขวาแบบ tabular; กดลูกศรขึ้นแล้วค่าหยุดที่ 5 และลูกศรลงหยุดที่ 0 ไม่เลยขอบทั้งสองด้าน
