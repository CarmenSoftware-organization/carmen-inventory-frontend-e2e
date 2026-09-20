# Certification — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกถือไว้แล้วใน `tests/043-certification.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/043-certification.md`_

**Module:** Vendor Management — Certification (ใบรับรองที่ขอจากผู้ขาย)
**Frontend route:** `routes/vendor-management/certification`  •  **URL:** `/vendor-management/certification`
**Prefix:** `CERT`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/043-certification.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 29

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/043-certification.spec.ts` ถือ ID `TC-CERT-010001..010005`, `030001`, `040001..040004`, `050001`, `050002`, `200001..200003` และ helper `addDialogSecurityCases` ถือ `TC-CERT-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, active BU = BLAVG, สร้าง record แล้วเห็นในตาราง, แก้ชื่อ + toast, toggle `is_active` แล้ว persist, แก้ชื่อแล้ว persist, ยกเลิกการแก้ไขแล้วค่าไม่ถูกบันทึก, ลบ record, ยกเลิกการลบ, บันทึกโดยเว้น code/name ว่าง, แก้ไขแล้ว clear name, สร้าง code ซ้ำ, XSS/SQL payload และ name maxLength 100 — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
> 2. **URL ยืนยันแล้วว่าเป็น `/vendor-management/certification`** — `routes/router.tsx:334` เปิดบล็อก `path: "vendor-management"` แล้วมี child `path: "certification"` ที่บรรทัด 373–375 โมดูลนี้ **ไม่ได้อยู่ใต้ `/config/` อีกแล้ว** `constant/module-list.ts:245-247` ก็ชี้ `path: "/vendor-management/certification"` ตรงกัน (พร้อมคอมเมนต์อธิบายว่าย้ายมาเพราะ backend จัดหมวดไว้ที่ vendor management) เมนูใน sidebar จึงอยู่ใต้กลุ่ม Vendor Management ไม่ใช่ Config
> 3. **Section 30/90 ใช้ไม่ได้กับ prefix `CERT`** — `docs/test-id-scheme.md:38` ลงทะเบียนให้ `043-certification.spec.ts` ไว้แค่ `01, 03–05, 10, 20` เคส Export (ปกติอยู่บล็อก 30) และเคส edge (ปกติอยู่บล็อก 90) จึงถูกจัดไว้ในบล็อก **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือ/แถบหัวหน้า list — ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `30`/`90` ลงในแถวของ `043-certification.spec.ts` ใน scheme ก่อน (เอกสารนี้ไม่ได้แก้ scheme)
> 4. **การเขียน (create/update/delete) ยังถูก backend ปฏิเสธอยู่** — `certification-dialog.tsx` ส่ง `toPayload` เป็น body แบน ๆ (`{ code, name, description, is_active }`) ต่างจากโมดูล config ที่ย้ายแล้วอย่าง `routes/product-management/eco/eco-dialog.tsx:55-69` ที่ห่อเป็น `metadata: { ...fields, doc_version }` backend จึงตอบ 400 "metadata field is required" (ตรงกับคอมเมนต์ที่สเปกบันทึกไว้ และเป็นเหตุผลที่สเปกมี `test.fixme` 9 ตัว) **หมายเหตุให้ตรง:** `doc_version` ถูกส่งอยู่แล้วโดย `ConfigEntityDialog` (`update.mutate({ id, doc_version: entity.doc_version, ...payload })`) ชิ้นที่ขาดคือ "การห่อด้วย metadata" ล้วน ๆ → เคสที่ต้องเขียนจริงในเอกสารนี้ (030003, 030004, 040005, 040006, 050003, 050004) จะยังต้องขึ้นเป็น `test.fixme` จนกว่า payload จะแก้ ส่วนเคสอื่นเป็นการอ่าน/ตรวจ UI ล้วน รันได้ทันที
> 5. **Permission prefix ของหน้านี้ถูก derive เป็น `vendor_management` ไม่ใช่ `vendor_management.certification`** — `usePermissionPrefix()` หา leaf จาก `module-list` แล้วตัด `.view` ท้าย leaf ของ certification ประกาศ `permission: PERMISSIONS.vendor_management.view` prefix จึงเป็น `"vendor_management"` และ `buildPermissionKey` สร้างคีย์เป็น `vendor_management.create` / `.update` / `.delete` ซึ่ง **ไม่มีอยู่ใน `constant/permissions.ts`** (`vendor_management` มีแค่ `view`, `vendor.*`, `price_list.*`, `price_comparison.view`) ผลคือผู้ใช้ที่ไม่ใช่ admin ของ BU จะตกเข้าทาง "ไม่มีสิทธิ์" เสมอแม้ถือ `vendor_management.view` อยู่ — บันทึกไว้เป็นข้อเท็จจริง เคส `TC-CERT-100005..100007` จึง assert เฉพาะ **UI ปฏิเสธตามที่ออกแบบ** (ปุ่มจาง + dialog Permission Denied) ไม่ได้ assert ว่าคีย์สิทธิ์ถูกต้อง
> 6. **เมนู Row actions ของ certification มีแค่ Delete** — `use-certification-table.tsx` ส่งให้ `useConfigTable` เฉพาะ `onDelete` (ไม่ส่ง `onEdit` และ **ไม่ส่ง `activity`**) `actionColumn` จึง render เฉพาะรายการ Delete คอมเมนต์ใน `use-config-table.ts` ระบุชื่อ certification ไว้ตรง ๆ ว่าเป็นตารางที่ backend ไม่ได้บันทึกกิจกรรมให้ จึงต้องไม่เปิดเมนู Activity ทางเข้าแก้ไขมีแค่ปุ่มลิงก์บนคอลัมน์ **Code** (`CellAction`) และการคลิกเนื้อการ์ดในมุมมองการ์ดเท่านั้น
> 7. **Export มีแค่ 3 คอลัมน์** — `exportColumns` ใน `certification-component.tsx` คือ Code / Name / Status เท่านั้น **ไม่มี Description** ทั้งที่ Description อยู่ทั้งในฟอร์มและบนการ์ด บันทึกไว้เป็นข้อเท็จจริง เคส `TC-CERT-010015` จึง assert 3 คอลัมน์ตามที่โค้ดกำหนด
> 8. **คอลัมน์สถานะไม่มี `meta.headerTitle`** — `statusColumn()` ใน `components/ui/data-grid/columns.tsx` ตั้ง meta ไว้แค่ `cellClassName`/`headerClassName`/`skeleton` เมนูเรียงลำดับและเมนูคอลัมน์ซึ่ง fallback เป็น `column.id` จึงแสดงคำว่า `is_active` ดิบ ๆ บันทึกไว้เป็นข้อเท็จจริง เคสในเอกสารนี้จึงไม่ assert สตริงนั้น แต่ assert ว่ามีแถวของคอลัมน์สถานะอยู่
> 9. **กล่องยืนยันลบอ้างอิง "ชื่อ" ไม่ใช่ "รหัส"** — `ConfigListTemplate` รับ `entityNameField="name"` ข้อความจึงเป็น `...delete certification "<ชื่อ>"?` ทั้งที่ทุก helper ในสเปก (search / clickRow / deleteRow) ผูกกับ **code** เป็นคีย์ — จุดที่พลาดง่ายเวลาเขียน assertion
> 10. **ต่างจาก `083-shelf.md` ที่ใช้เทียบอย่างไร** — certification **ไม่มีฟิลด์ลำดับ (`order`)** เคสลำดับทั้งหมดของ shelf จึงไม่มีคู่ที่นี่; ฟอร์มมี Code (บังคับ, maxLength **10**), Name (บังคับ, maxLength 100), Description (textarea, maxLength 256) และ status switch; backend มี endpoint จริง (`/api/proxy/api/config/{bu}/vendor-master-certificates`) ต่างจาก shelf ที่ยังไม่มี endpoint เลย จึงไม่มีเคสคู่ของ `TC-SHLF-900002`; และหน้านี้มี licenseFeature ของตัวเอง (`vendor_management.vendor_master_certificate`) ซึ่ง shelf ไม่มี จึงเพิ่มเคส `TC-CERT-100009` เข้ามา
> 11. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CERT-010006 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-CERT-010007 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-CERT-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-CERT-010009 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-CERT-010010 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-CERT-010011 | เรียงลำดับเริ่มต้นตามรหัส สลับทิศ และกลับเป็น Default | Medium | Functional |
| TC-CERT-010012 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-CERT-010013 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-CERT-010014 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-CERT-010015 | ส่งออกรายการใบรับรองเป็นไฟล์ XLSX | Medium | Functional |
| TC-CERT-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-CERT-010017 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-CERT-010018 | เมนู Row actions ของแถวมีเฉพาะ Delete | Low | Functional |
| TC-CERT-010019 | เปิด dialog แก้ไขจากคอลัมน์ Code แล้วฟอร์มถูกเติมค่าครบ | Medium | Happy Path |
| TC-CERT-030002 | หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add | Low | Functional |
| TC-CERT-030003 | ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-CERT-030004 | สร้างใบรับรองพร้อม Description แล้วค่าไปปรากฏจริง | Medium | Happy Path |
| TC-CERT-040005 | แก้ไข Description แล้วค่าคงอยู่ | Medium | CRUD |
| TC-CERT-040006 | เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด | Low | Happy Path |
| TC-CERT-050003 | ข้อความยืนยันลบอ้างอิงชื่อใบรับรอง ไม่ใช่รหัส | Medium | Functional |
| TC-CERT-050004 | ลบใบรับรองจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-CERT-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-CERT-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-CERT-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน | Medium | Authorization |
| TC-CERT-100008 | ไม่มีสิทธิ์ดู — เมนู Certification ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์ | High | Authorization |
| TC-CERT-100009 | BU ไม่มี license ของโมดูล — เมนูมีแม่กุญแจและเด้ง dialog คนละใบ | Medium | Authorization |
| TC-CERT-200004 | ช่อง Code จำกัดความยาวที่ 10 ตัวอักษร | Medium | Validation |
| TC-CERT-200005 | ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร | Low | Validation |
| TC-CERT-200006 | ข้อความ error ระบุชื่อฟิลด์ที่ขาดเป็นราย ๆ | Medium | Validation |

---
## TC-CERT-010006 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบรับรองอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/vendor-management/certification`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Certification" พร้อมคำอธิบายใต้ชื่อ ("Certifications you ask vendors to hold — HACCP, GMP, halal — and check before buying."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Status (จัดกึ่งกลาง) และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; ค่าในคอลัมน์ Code เป็นปุ่มลิงก์ (`CellAction`) ไม่ใช่ข้อความเฉย ๆ; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view, ปุ่ม Filter, ปุ่มเรียงลำดับ, ปุ่มเมนูคอลัมน์ และปุ่มสลับมุมมอง list/grid; แถบหัวมีปุ่ม Export, Print และ "Add Certification"

---
## TC-CERT-010007 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification`; มีใบรับรองหลายรายการที่รหัส/ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับใบรับรองที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-CERT-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search"); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-CERT-010009 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification`; มีใบรับรองทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. เลือกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
**Expected**
ตารางเหลือเฉพาะใบรับรองที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือแสดง chip ที่มีคำว่า Status นำหน้าค่า Active พร้อมปุ่มลบ (aria-label "Remove Status filter"); query string มี `filter=is_active|bool:true` (encode แล้ว) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แทนแล้วผลสลับเป็นรายการที่ปิดใช้งาน (`is_active|bool:false`)

---
## TC-CERT-010010 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก; badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-CERT-010011 — เรียงลำดับเริ่มต้นตามรหัส สลับทิศ และกลับเป็น Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/vendor-management/certification` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีใบรับรองอย่างน้อย 2 รายการที่รหัสต่างกัน
**Steps**
1. สังเกต URL และลำดับแถวตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วดูรายการในเมนู
3. เลือก "Code"
4. เลือก "Code" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้**มี default sort = `code:asc`** (ประกาศไว้ที่ `defaultSort` ของ `ConfigListTemplate`) — เข้าครั้งแรก URL **ไม่มี** `sort` แต่แถวเรียงตามรหัสจากน้อยไปมาก และในเมนูมีเครื่องหมายกำกับทั้งที่แถว "Default" (เพราะ URL ว่าง) และลูกศรขึ้นที่แถว Code (เพราะ sorting state ถูกเติมด้วยค่า default); เมนูแสดงแถวของคอลัมน์ที่เรียงได้ครบ — Code, Name, คอลัมน์สถานะ, Created, Updated; เลือก Code ครั้งแรกได้ `sort=code:asc` ปรากฏใน URL, เลือกซ้ำได้ `sort=code:desc` พร้อมลูกศรลงและลำดับแถวสลับ; เลือก Default ล้าง `sort` ออกจาก URL และลำดับกลับไปเป็น `code:asc`

---
## TC-CERT-010012 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` บนหน้าจอขนาด desktop; มีใบรับรองอย่างน้อย 1 รายการที่กรอก Description ไว้ และอย่างน้อย 1 รายการที่เว้น Description ว่าง
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดของทั้งสองรายการและแถบเครื่องมือ
3. คลิกปุ่มมุมมองตาราง (aria-label "List view") เพื่อกลับ
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดง **ชื่อ (Name)** เป็นหัวเรื่อง (ไม่ใช่รหัส) และในเนื้อการ์ดมีแถว Status (ป้าย Active/Inactive), แถว Code, แถว Description และแถวข้อมูล Created / By / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; **แถว Description แสดงเฉพาะการ์ดที่มีค่า** — การ์ดที่ Description ว่างไม่มีแถวนี้เลย (ไม่ใช่แสดงเป็นขีด); ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกกลับแล้วได้ตารางเดิมพร้อมข้อมูลครบ

---
## TC-CERT-010013 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Name
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และแสดงรายการของคอลัมน์ที่มี accessor ครบ (Code, Name, คอลัมน์สถานะ, Created, Updated) พร้อม checkbox; Created และ Updated **ไม่ถูกติ๊กตั้งแต่ต้น** (ตรงกับ `columnVisibility: { created_at: false, updated_at: false }` ใน `use-certification-table.tsx`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Name แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้; รายการช่องเลือก / # / คอลัมน์ปุ่มจัดการ **ไม่ปรากฏในเมนู** (ไม่มี accessor และปิดการซ่อนไว้)

---
## TC-CERT-010014 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` ในมุมมองตาราง; BU มีใบรับรองมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และคอลัมน์ลำดับที่ (#) เริ่มนับต่อจากหน้าก่อน (ไม่ได้เริ่มที่ 1 ใหม่); กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-CERT-010015 — ส่งออกรายการใบรับรองเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` บน desktop; มีใบรับรองอย่างน้อย 1 รายการในหน้าปัจจุบันและอย่างน้อย 1 รายการที่มี Description
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
3. เปิดไฟล์ที่ดาวน์โหลดมาตรวจหัวคอลัมน์
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่ชื่อขึ้นต้นด้วย `certification` และชีตชื่อ "Certification"; ไฟล์มี **3 คอลัมน์ตามลำดับ Code / Name / Status เท่านั้น** — **ไม่มีคอลัมน์ Description** แม้ข้อมูลนั้นจะมีอยู่ในระบบ; ค่าในคอลัมน์ Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-CERT-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state)
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." และหน้าใช้งานต่อได้ตามปกติ

---
## TC-CERT-010017 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/certification` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้ายแสดง "No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility "Only me" แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog บันทึก view มีช่องชื่อและตัวเลือก visibility ระดับผู้ใช้/ระดับ BU; บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรองแล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อ "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-CERT-010018 — เมนู Row actions ของแถวมีเฉพาะ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/certification` และมีใบรับรองอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. กด Escape เพื่อปิดเมนู
**Expected**
เมนูมี **รายการเดียวคือ Delete** — ไม่มีรายการ Edit และ **ไม่มีรายการ Activity** (ตารางนี้ไม่ได้อยู่ในทะเบียนกิจกรรมของ backend จึงตั้งใจไม่เปิดเมนูนั้น); ไม่มีเส้นคั่นในเมนูเพราะมีกลุ่มเดียว; ทางเข้าแก้ไขจึงเหลือแค่ปุ่มลิงก์บนคอลัมน์ Code; กด Escape แล้วเมนูปิดโดยข้อมูลในแถวไม่เปลี่ยน

---
## TC-CERT-010019 — เปิด dialog แก้ไขจากคอลัมน์ Code แล้วฟอร์มถูกเติมค่าครบ
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบรับรองอย่างน้อย 1 รายการที่กรอก Description ไว้และรู้ค่าทุกฟิลด์ของรายการนั้น
**Steps**
1. ค้นหารายการนั้นแล้วคลิกค่าในคอลัมน์ Code
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
3. กด Cancel เพื่อปิดโดยไม่บันทึก
**Expected**
เปิด dialog ที่มีหัวข้อ "Edit Certification" โดย URL ไม่เปลี่ยน (ยังเป็น `/vendor-management/certification`); ช่อง `#certification-code`, `#certification-name`, `#certification-description` ถูกเติมด้วยค่าเดิมของรายการนั้นครบ และ switch `#certification-is-active` สะท้อนสถานะจริงผ่าน `aria-checked`; footer มีปุ่ม Cancel และปุ่ม **Save** (ไม่ใช่ Create); กด Cancel แล้ว dialog ปิด ไม่มี toast และไม่มีคำขอเขียนถูกส่ง

---
## TC-CERT-030002 — หัวข้อ dialog และค่าเริ่มต้นของฟอร์มตอนกด Add
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification`; ยังไม่เคยเปิด dialog ในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Certification"
2. อ่านหัวข้อ dialog และค่าในทุกช่อง
**Expected**
หัวข้อ dialog คือ "Add Certification" พร้อมไอคอนเหรียญรางวัลด้านหน้า; ช่อง Code ว่างและมี placeholder "e.g. ISO-9001" พร้อมเครื่องหมายบังคับกรอกที่ label; ช่อง Name ว่างและมี placeholder "e.g. ISO 9001 Quality Management" พร้อมเครื่องหมายบังคับกรอก; ช่อง Description เป็น textarea สูง 2 แถว ว่าง และมี placeholder "Optional" (ไม่มีเครื่องหมายบังคับกรอก); switch `#certification-is-active` อยู่ที่เปิดใช้งาน (`aria-checked="true"`); footer มีปุ่ม Cancel และปุ่ม **Create** (ไม่ใช่ Save)

---
## TC-CERT-030003 — ยกเลิกการสร้างด้วยปุ่ม Cancel แล้วฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification`; เปิด dialog "Add Certification" แล้วกรอก Code, Name, Description และปิด switch สถานะไว้ แต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ที่ท้าย dialog
2. เปิด dialog "Add Certification" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีแถวใหม่เพิ่มในตาราง; เปิด dialog ใหม่แล้วฟอร์มถูกรีเซ็ตกลับค่าเริ่มต้นครบทุกช่อง (Code ว่าง, Name ว่าง, Description ว่าง, switch สถานะกลับมา `aria-checked="true"`) ไม่ใช่ค่าที่ค้างจากครั้งก่อน

---
## TC-CERT-030004 — สร้างใบรับรองพร้อม Description แล้วค่าไปปรากฏจริง
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/vendor-management/certification`; **backend รับ payload ของ certification แล้ว** (ดูหมายเหตุข้อ 4 — ปัจจุบันยัง 400)
**Steps**
1. คลิกปุ่ม "Add Certification"
2. กรอก Code และ Name ที่ไม่ซ้ำ และกรอก Description เป็นข้อความที่จำได้แน่นอน
3. คลิกปุ่ม Create
4. ค้นหาด้วย Code ที่เพิ่งสร้าง แล้วคลิกค่าในคอลัมน์ Code เพื่อเปิด dialog ซ้ำ
5. สลับไปมุมมองการ์ดเพื่อดูการ์ดของรายการนั้น
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Certification created successfully" และ dialog ปิดเอง; แถวใหม่ปรากฏในตาราง; เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Description ยังเป็นข้อความเดิม (ค่าถูก persist จริง ไม่ใช่แค่แสดงผล); ในมุมมองการ์ด การ์ดของรายการนั้นมีแถว Description พร้อมข้อความเดียวกัน

---
## TC-CERT-040005 — แก้ไข Description แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีใบรับรองที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ Code แน่นอน; **backend รับ payload ของ certification แล้ว** (ดูหมายเหตุข้อ 4)
**Steps**
1. ค้นหาด้วย Code แล้วคลิกค่าในคอลัมน์ Code เพื่อเปิด dialog แก้ไข
2. ล้างช่อง Description แล้วกรอกข้อความใหม่
3. คลิกปุ่ม Save แล้วรอให้ dialog ปิด
4. เปิด dialog ของรายการนั้นอีกครั้ง
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวข้อ dialog ตอนแก้ไขคือ "Edit Certification" และปุ่มบันทึกคือ Save (ระหว่างส่งคำขอเปลี่ยนเป็น "Saving..." และทุกช่องถูก disable); แสดง toast "Certification updated successfully" และ dialog ปิดเอง; เปิด dialog ซ้ำแล้วช่อง Description แสดงข้อความใหม่; ค่าในช่อง Code และ Name ไม่ถูกแตะต้อง

---
## TC-CERT-040006 — เปิด dialog แก้ไขจากการ์ดในมุมมองการ์ด
**Priority:** Low · **Test Type:** Happy Path
**Preconditions**
อยู่ที่หน้า `/vendor-management/certification` และสลับเป็นมุมมองการ์ดแล้ว; มีใบรับรองอย่างน้อย 1 รายการ
**Steps**
1. คลิกที่เนื้อการ์ดใบแรก (ไม่ใช่ปุ่ม Delete ที่ footer)
2. กด Cancel เพื่อปิด
3. โฟกัสการ์ดใบเดิมด้วยแป้น Tab แล้วกด Enter
**Expected**
คลิกเนื้อการ์ดแล้วเปิด dialog "Edit Certification" ของรายการเดียวกับการ์ดใบนั้นโดย URL ไม่เปลี่ยน; ฟอร์มถูกเติมค่าเดิมครบ (Code, Name, Description, switch สถานะ); กด Cancel แล้วกลับมาที่มุมมองการ์ดโดยข้อมูลไม่เปลี่ยน; การ์ดเป็น `role="button"` ที่โฟกัสได้ — กด Enter บนการ์ดที่โฟกัสอยู่เปิด dialog เดียวกัน

---
## TC-CERT-050003 — ข้อความยืนยันลบอ้างอิงชื่อใบรับรอง ไม่ใช่รหัส
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบรับรองที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ โดย Code กับ Name **ต่างกันชัดเจน** และรู้ค่าทั้งคู่
**Steps**
1. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
2. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
3. ยืนยันการลบเพื่อคืนสภาพ
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Certification" และคำอธิบายอ้างอิง **ชื่อ (Name)** ของรายการ ไม่ใช่รหัส — `Are you sure you want to delete certification "<ชื่อ>"? This action cannot be undone.`; footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Certification deleted successfully"

---
## TC-CERT-050004 — ลบใบรับรองจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; มีใบรับรองที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว; **backend รับคำขอลบของ certification แล้ว** (ดูหมายเหตุข้อ 4)
**Steps**
1. หาการ์ดของใบรับรองนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว**ไม่**เปิด dialog แก้ไข (การคลิกปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบแทน; ยืนยันแล้วแสดง toast "Certification deleted successfully" และการ์ดใบนั้นหายจากกริด

---
## TC-CERT-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่เข้าหน้านี้ได้ (มี `vendor_management.view`) แต่ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`) และ BU ยังมี license `vendor_management.vendor_master_certificate` อยู่ (ไม่งั้นจะเด้ง dialog คนละใบ — ดู TC-CERT-100009)
**Steps**
1. ไปที่ `/vendor-management/certification`
2. สังเกตสภาพปุ่ม "Add Certification"
3. คลิกปุ่ม "Add Certification"
**Expected**
ปุ่ม "Add Certification" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว**ไม่**เปิด dialog สร้างใบรับรอง แต่เด้ง dialog แจ้งสิทธิ์พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบแทน (หัวข้อเป็นชุด permission ไม่ใช่ชุด license/expired)

---
## TC-CERT-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่เข้าหน้านี้ได้แต่ไม่ใช่ admin ของ BU และไม่มีสิทธิ์แก้ไขของโมดูลนี้; มีใบรับรองอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/vendor-management/certification`
2. คลิกค่าในคอลัมน์ Code เพื่อเปิด dialog
3. ลองแก้ค่าในแต่ละช่อง
**Expected**
dialog เปิดขึ้นในโหมดอ่านอย่างเดียว: ช่อง Code, Name, Description และ switch สถานะถูก disable ทั้งหมด; footer **ไม่มีปุ่ม Save** และปุ่มเดียวที่เหลือมีป้ายว่า "Close" (ไม่ใช่ "Cancel"); กด Close แล้ว dialog ปิดโดยไม่มีคำขอเขียนถูกส่ง

---
## TC-CERT-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete เด้งแจ้งสิทธิ์แทนกล่องยืนยัน
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่เข้าหน้านี้ได้แต่ไม่ใช่ admin ของ BU และไม่มีสิทธิ์ลบของโมดูลนี้; BU ยังมี license ของโมดูลอยู่; มีใบรับรองอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/vendor-management/certification`
2. เปิดเมนู Row actions ของแถวแรก แล้วสังเกตรายการ Delete
3. คลิก Delete
4. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
**Expected**
รายการ Delete ในเมนูแสดงแบบจางและมี `aria-disabled="true"` (แต่ยังคลิกได้ — ไม่ถูก `disabled` จริง เพราะกรณี license เท่านั้นที่ปิดปุ่มจริง); คลิกแล้ว**ไม่**เปิด dialog ยืนยันลบ แต่เด้ง dialog แจ้งสิทธิ์แทน; ปุ่ม Delete บนการ์ดให้ผลเหมือนกันทุกประการ (ตารางกับการ์ดอ่าน gate ตัวเดียวกันผ่าน `useDeleteGate`) และไม่มีรายการใดถูกลบ

---
## TC-CERT-100008 — ไม่มีสิทธิ์ดู — เมนู Certification ใน sidebar เป็นปุ่มจางที่เด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มีสิทธิ์ `vendor_management.view`** และไม่ใช่ admin ของ BU; BU ที่ใช้ทดสอบยังมี license `vendor_management.vendor_master_certificate` อยู่ (ไม่งั้นจะถูกจัดเป็น locked ซึ่งเป็นคนละเหตุผล — ดู TC-CERT-100009)
**Steps**
1. เข้าโมดูล Vendor Management เพื่อให้ sidebar แสดงเมนูของโมดูลนั้น
2. สังเกตรายการ "Certification" ในเมนู
3. คลิกรายการ "Certification"
**Expected**
รายการ "Certification" ยังอยู่ในเมนู (มีเส้นคั่นอยู่ด้านบนตาม `separatorBefore`) แต่ถูกทำให้จาง (opacity ต่ำลง) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/vendor-management/certification">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจ** (แม่กุญแจสงวนไว้ให้กรณี license); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog แจ้งสิทธิ์ชุด permission พร้อมข้อความแนะนำให้ติดต่อผู้ดูแลระบบ

---
## TC-CERT-100009 — BU ไม่มี license ของโมดูล — เมนูมีแม่กุญแจและเด้ง dialog คนละใบ
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่อยู่ใน BU ที่ **ไม่มี license feature `vendor_management.vendor_master_certificate`** (สัญญาไม่ครอบโมดูลนี้)
**Steps**
1. เข้าโมดูล Vendor Management เพื่อให้ sidebar แสดงเมนูของโมดูลนั้น
2. สังเกตรายการ "Certification"
3. คลิกรายการ "Certification"
**Expected**
รายการ "Certification" ถูกทำให้จางและ **มีไอคอนแม่กุญแจต่อท้ายชื่อ** — ต่างจากกรณีไม่มีสิทธิ์ที่ไม่มีแม่กุญแจ (license ชนะ permission เสมอเมื่อเป็นจริงพร้อมกัน); คลิกแล้วเด้ง dialog ชุด **license** ซึ่งข้อความต่างจาก dialog ชุด permission ใน TC-CERT-100008 (บอกเหตุผลที่แก้ด้วยการต่อสัญญา ไม่ใช่การขอสิทธิ์); URL ไม่เปลี่ยน

---
## TC-CERT-200004 — ช่อง Code จำกัดความยาวที่ 10 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/certification` และเปิด dialog "Add Certification" แล้ว
**Steps**
1. กรอกช่อง `#certification-code` ด้วยสตริงยาว 50 ตัวอักษร
2. อ่านค่าจริงในช่องหลังกรอก
3. กรอกช่อง `#certification-name` ด้วยสตริงยาว 50 ตัวอักษรเพื่อเทียบ
**Expected**
ค่าในช่อง Code ถูก clamp ที่ **≤ 10 ตัวอักษร** (attribute `maxLength={10}` บน `FieldInput`) ขณะที่ช่อง Name ยังรับได้ถึง 100 — สองช่องมีเพดานคนละค่า ไม่ใช่ค่าเดียวกัน; ไม่มีข้อความ error ปรากฏจากการถูกตัด (เบราว์เซอร์ตัดให้เงียบ ๆ ไม่ใช่ validation ของ schema)

---
## TC-CERT-200005 — ช่อง Description จำกัดความยาวที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด dialog "Add Certification" อยู่
**Steps**
1. กรอกช่อง `#certification-description` ด้วยสตริงยาว 400 ตัวอักษร
2. อ่านค่าจริงในช่องหลังกรอก
**Expected**
ช่องเป็น `textarea` (ไม่ใช่ `input`) ที่มี `rows="2"` และค่าถูก clamp ที่ **≤ 256 ตัวอักษร**; ไม่มีข้อความ error ใต้ช่องและปุ่ม Create ยังกดได้ (Description เป็น `z.string().optional()` ใน schema — ไม่ใช่ฟิลด์บังคับ)

---
## TC-CERT-200006 — ข้อความ error ระบุชื่อฟิลด์ที่ขาดเป็นราย ๆ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/vendor-management/certification` และเปิด dialog "Add Certification" แล้ว
**Steps**
1. กรอกเฉพาะช่อง Code (เว้น Name ว่าง) แล้วกด Create
2. อ่านข้อความ error ที่ปรากฏและตำแหน่งของมัน
3. ล้างช่อง Code แล้วกรอกเฉพาะช่อง Name จากนั้นกด Create
4. อ่านข้อความ error ที่ปรากฏ
**Expected**
รอบแรกขึ้น error ใต้ช่อง **Name** เท่านั้นโดยข้อความระบุชื่อฟิลด์ว่า "Name is required" (มาจาก `validation.required` ที่แทนค่า `field` ด้วยป้ายของฟิลด์) และช่อง Code ไม่มี error; รอบหลังขึ้น error ใต้ช่อง **Code** เท่านั้นด้วยข้อความ "Code is required"; ทั้งสองรอบ dialog ยังเปิดค้างและไม่มีคำขอสร้างถูกส่ง
