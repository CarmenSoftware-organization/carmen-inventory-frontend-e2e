# Department — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/010-department.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/010-department.md`_

**Module:** Config — Department (แผนก)
**Frontend route:** `routes/config/department`  •  **URL:** `/config/department`, `/config/department/new`, `/config/department/:id`
**Prefix:** `DEP`
**Spec ที่ครอบส่วนที่เหลือ:** `tests/010-department.spec.ts` (21 เคส)
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 37

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `tests/010-department.spec.ts` ถือ ID `TC-DEP-010001..010006`, `030001..030003`, `040001..040005`, `050001..050002`, `200001..200005` และ helper `addPageFormSecurityCases` (`tests/helpers/security-cases.ts`) ถือ `TC-DEP-100001..100003` (+ `100004` ที่ถูก `skipAuth: true` จึงเป็น `test.skip`) เรื่องที่ครอบแล้วคือ: โหลดหน้า list, ปุ่ม Add แสดง, ช่องค้นหารับค่าได้, empty state เมื่อค้นไม่เจอ, ค้นด้วย code, active BU = BLAVG, create → edit → delete ครบรอบ, rename แล้ว persist หลัง reload, toggle `is_active`, description create + maxLength 256 (ทั้งโหมดสร้างและโหมดแก้ไข), Cancel ขณะ dirty เด้ง Discard, ยกเลิกการลบ, assign user เข้า Members และ HOD, code/name ว่าง (ทั้งตอนสร้างและตอนแก้), กรอก field เดียว, code maxLength 10 (หน้า `/new`), code ซ้ำถูก reject, XSS/SQL payload และ name maxLength 100 (หน้า `/new`) — **เอกสารนี้จึงไม่เขียนเรื่องเหล่านั้นซ้ำ**
>
> 2. **Section block ที่ `DEP` ลงทะเบียนไว้คือ `01, 03–05, 10, 20` เท่านั้น** (`docs/test-id-scheme.md`) เอกสารนี้ **ไม่ได้แก้ scheme** จึงต้องจัดเคสสามกลุ่มเข้าบล็อกใกล้เคียงแทน:
>     - เคส **Export** (ตามขนบอยู่บล็อก 30) และเคส **edge** (บล็อก 90) → จัดเข้า **01** เพราะทั้งคู่เป็นพฤติกรรมของแถบเครื่องมือ/แถบหัวหน้า list
>     - เคส **Detail / View** (บล็อก 02) → จัดเข้า **04** เพราะ department ใช้ URL เดียวกัน (`/config/department/:id`) เป็นทั้งหน้าดูและหน้าแก้ โดย `useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่โหลด แล้วปุ่ม Edit พลิกเป็นโหมดแก้ในหน้าเดิม
>
>     ถ้าทีมอยากได้บล็อกตามขนบ ต้องเพิ่ม `02`, `30`, `90` ลงในแถวของ `010-department.spec.ts` ใน scheme ก่อน
>
> 3. **เลข `TC-DEP-010011` ถูกข้ามไว้โดยตั้งใจ** — ยังมีคอมเมนต์ใน `tests/040-currency.spec.ts:401` อ้างถึง `TC-DEP-010011` ในความหมายเดิม (เคส "สร้าง code ซ้ำ" ที่ถูกเปลี่ยนเลขเป็น `TC-DEP-200004` ตอน renumber commit `2d72894`) ตัว audit ไม่จับเพราะอ่าน ID จาก test title เท่านั้น แต่การเอาเลขนี้ไปใช้ใหม่จะทำให้คอมเมนต์นั้นชี้ผิดเรื่อง
>
> 4. **กับดักตอนเขียนสเปก — toast ของ create/update/delete ชนกันหมดถ้า regex กว้าง (ยืนยันแล้ว)** `messages/en.json` กำหนด `toast.createSuccess = "{entity} created successfully"`, `toast.updateSuccess = "{entity} updated successfully"`, `toast.deleteSuccess = "{entity} deleted successfully"` — **ทั้งสามข้อความมีคำว่า `success`** regex ที่สเปกใช้อยู่ (`/created|success|สำเร็จ/i`, `/updated|success|สำเร็จ/i`, `/deleted|success|สำเร็จ/i`) จึงแมตช์ toast ของ *ทุก* การกระทำ ผลคือ assertion ที่ตั้งใจรอ toast ของ update อาจผ่านทันทีเพราะ toast ของ create ที่ค้างอยู่ แล้วขั้นถัดไป (reload / goto) ตัด PATCH ที่กำลังยิงอยู่ทิ้ง — เป็นบั๊กของเทส ไม่ใช่ของแอป สเปกปัจจุบันเลี่ยงด้วยการ "เปิด record ใหม่จาก list ก่อนแก้" (ดูคอมเมนต์ที่ `tests/010-department.spec.ts:278-280`, `640-641`) **เคสใหม่ทุกเคสในเอกสารนี้ให้ผูก assertion กับข้อความเต็ม เช่น `/Department updated successfully/i` หรือรอ response ของ PATCH ด้วย `waitForResponse` แทน อย่าใช้คำว่า `success` ลอย ๆ**
>
> 5. **เรื่อง "code ซ้ำ" — ยืนยันจากโค้ดไม่ได้ และ oracle ของเทสเดิมก็แยกไม่ออก** `department-form-schema.ts` ไม่มีการเช็คซ้ำฝั่ง client เลย (`code: z.string().min(1)`) ความเป็น unique จึงอยู่ที่ backend ล้วน ๆ ซึ่ง repo นี้ไม่มีโค้ดให้ตรวจ ยิ่งกว่านั้น `TC-DEP-200004` ใช้ oracle ว่า "URL ยังอยู่ที่ `/new`" ซึ่งจะผ่าน**ทั้งกรณีที่ backend reject และกรณีที่ backend รับแต่หน้าไม่ย้ายไปไหน** (ดูข้อ 6) — ตราบใดที่ `TC-DEP-030005` ยังไม่เขียว เทสนั้นพิสูจน์เรื่อง unique constraint ไม่ได้ **ห้ามเขียนเคสใหม่ใด ๆ ที่พึ่งสมมติฐานว่า backend รับหรือไม่รับ code ซ้ำ** จนกว่าจะมีใครไปยืนยันกับ backend จริง
>
> 6. **โค้ดกับคอมเมนต์ในสเปกขัดกันเรื่อง "หลัง create ไปไหนต่อ"** `department-form.tsx:187-192` เรียก `navigate("/config/department/" + id, { replace: true })` ตามด้วย `f.setMode("view")` ใน `onSuccess` ของ create (บรรทัดนี้อยู่มาตั้งแต่ `ab56324a`, 2026-06-27) และ `useApiMutation` คืน JSON ที่ parse แล้ว (`res.json()`) ทำให้ `res.data.id` อ่านได้จริง — แต่คอมเมนต์ในสเปกสามจุด (`tests/010-department.spec.ts:498-501`, `553-554`, `590-592`) ระบุว่า "a save leaves the browser on /new (verified 2026-09-19)" **สองอย่างนี้เป็นจริงพร้อมกันไม่ได้** `TC-DEP-030005` เขียนไว้ให้ assert ตามที่โค้ดกำหนด (= พฤติกรรมตามออกแบบ) ถ้ารันแล้วไม่ผ่าน นั่นคือบั๊กของแอปที่ต้องเปิด issue ไม่ใช่เทสผิด และเมื่อแก้แล้ว `TC-DEP-200004` จะกลายเป็น oracle ที่มีความหมายขึ้นมาเอง
>
> 7. **department ไม่มี `licenseFeature`** ใน `constant/module-list.ts:487-492` (ต่างจาก unit ที่มี `configuration.unit`) จึงไม่มีสถานะ "locked / ไอคอนแม่กุญแจ" ให้ทดสอบ — เคสสิทธิ์ทั้งหมดในเอกสารนี้จึงเป็นเรื่อง RBAC ล้วน ส่วน `canWrite` (สัญญาหมดอายุ) ยังปิดปุ่มเขียนได้อยู่แต่เป็นสภาพของทั้ง BU ไม่ใช่ของโมดูล จึงไม่เขียนเป็นเคสที่นี่
>
> 8. **`RouteGuard` ครอบ `/new` และ `/:id` ด้วย** — `findRouteLeaf()` (`constant/module-list.ts:114-126`) จับแบบ prefix (`pathname.startsWith(m.path + "/")`) ดังนั้น deep link เข้าฟอร์มก็ถูกเช็ค `configuration.department.view` เหมือนหน้า list
>
> 9. **`code` / `name` ที่เป็นช่องว่างล้วนผ่าน client validation ได้** (`z.string().min(1)` นับช่องว่างเป็น 1 ตัวอักษร) — บันทึกไว้ที่นี่เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเทสเคส เพราะจะกลายเป็นเคสที่ยืนยันพฤติกรรมที่น่าจะเป็นบั๊ก
>
> 10. **เมนู Sort และเมนู Toggle Columns เรียกคอลัมน์สถานะว่า `is_active`** — ทั้งสองเมนู fallback เป็น `column.id` เมื่อ column ไม่ได้ตั้ง `meta.headerTitle` (`data-grid-sort-menu.tsx:101`, `data-grid-column-visibility.tsx:44`) และ `statusColumn()` ใน `columns.tsx:70-87` ไม่ได้ตั้งไว้ เคส `TC-DEP-010013` / `TC-DEP-010015` จึง assert ตามที่ UI แสดงจริง ไม่ได้ assert ว่าเป็น "Status" — ถ้าทีมมองว่าควรเป็น "Status" นั่นคืองานแก้ `columns.tsx` ไม่ใช่งานแก้เทส (หัวข้อเมนู "Toggle Columns" ก็ hard-code เป็นอังกฤษ ไม่ผ่าน i18n เช่นกัน)
>
> 11. เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DEP-010007 | หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน | High | Smoke |
| TC-DEP-010008 | ค้นหายิงเมื่อกด Enter และไหลลง query string | Medium | Functional |
| TC-DEP-010009 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-DEP-010010 | กรองตามสถานะ Active / Inactive | Medium | Functional |
| TC-DEP-010012 | ล้างตัวกรองทั้งหมดจากแถบ chip | Low | Functional |
| TC-DEP-010013 | เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default | Medium | Functional |
| TC-DEP-010014 | สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด | Low | Functional |
| TC-DEP-010015 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-DEP-010016 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination | Medium | Functional |
| TC-DEP-010017 | ส่งออกรายการแผนกเป็นไฟล์ XLSX | Medium | Functional |
| TC-DEP-010018 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-DEP-010019 | บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ | Medium | Functional |
| TC-DEP-010020 | เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete | Low | Functional |
| TC-DEP-010021 | คอลัมน์ Code เปิดหน้ารายละเอียดได้เหมือนคอลัมน์ Name | Low | Functional |
| TC-DEP-030004 | หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new | Low | Functional |
| TC-DEP-030005 | สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของรายการใหม่ | High | Happy Path |
| TC-DEP-030006 | Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list | Medium | Alternate Flow |
| TC-DEP-030007 | ปุ่ม Go back จากฟอร์มสร้างที่ยังไม่แก้อะไร กลับ list ทันที | Low | Functional |
| TC-DEP-030008 | กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-DEP-040006 | หน้ารายละเอียดโหมด view แสดงข้อมูลครบและไม่มีช่องกรอก | Medium | Functional |
| TC-DEP-040007 | deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view | Medium | Functional |
| TC-DEP-040008 | deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Department not found | Medium | Edge Case |
| TC-DEP-040009 | แก้ไข Account Code แล้วค่าคงอยู่ | Medium | CRUD |
| TC-DEP-040010 | ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view | Medium | Alternate Flow |
| TC-DEP-040011 | ถอดสมาชิกออกจากแผนกแล้วค่าคงอยู่ | Medium | CRUD |
| TC-DEP-040012 | แหล่งรายชื่อของ Members ต่างจาก Head of Department | Medium | Functional |
| TC-DEP-040013 | เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด | Low | Functional |
| TC-DEP-040014 | กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก | Medium | Functional |
| TC-DEP-050003 | ลบแผนกจากเมนู Row actions ในหน้า list | High | CRUD |
| TC-DEP-050004 | ลบแผนกจากปุ่มลบบนการ์ด | Low | CRUD |
| TC-DEP-050005 | ลบจากหน้ารายละเอียดในโหมด view แล้วเด้งกลับหน้า list | Medium | CRUD |
| TC-DEP-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์ | High | Authorization |
| TC-DEP-100006 | ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit เด้งแจ้งสิทธิ์แทนเข้าโหมดแก้ไข | Medium | Authorization |
| TC-DEP-100007 | ไม่มีสิทธิ์ลบ — ทุกทางเข้าของปุ่มลบเด้งแจ้งสิทธิ์ | Medium | Authorization |
| TC-DEP-100008 | ไม่มีสิทธิ์ดู — เมนู sidebar จาง และ deep link ถูก RouteGuard บล็อก | High | Authorization |
| TC-DEP-200006 | ข้อความ error ใต้ช่อง Code/Name และเลื่อนไปช่องแรกที่ผิด | Medium | Validation |
| TC-DEP-200007 | ขีดจำกัดความยาวของช่องในโหมดแก้ไข | Low | Validation |

---
## TC-DEP-010007 — หน้า list แสดงหัวเรื่องและคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกอย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/department`
2. รอให้ DataGrid โหลดเสร็จ (skeleton หาย)
**Expected**
หัวหน้าแสดงชื่อ "Department" พร้อมคำอธิบายใต้ชื่อ ("The teams that request and spend — kitchen, housekeeping, F&B. Requests and spend are tracked per department."); ตารางมีคอลัมน์ตามลำดับ ช่องเลือก (checkbox), ลำดับที่ (#), Code, Name, Account Code, Status และคอลัมน์ปุ่มจัดการท้ายแถว; คอลัมน์ Created / Updated **ถูกซ่อนไว้ตั้งแต่ต้น**; แถบเครื่องมือมีช่องค้นหา, ปุ่ม saved view, ปุ่ม Filter, ปุ่มเรียงลำดับ (aria-label "Sort by"), ปุ่มเมนูคอลัมน์ (aria-label "Toggle columns") และปุ่มสลับมุมมอง list/grid; แถบหัวมีปุ่ม Export, Print และ "Add Department"

---
## TC-DEP-010008 — ค้นหายิงเมื่อกด Enter และไหลลง query string
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department`; มีแผนกหลายรายการที่ชื่อต่างกัน และรู้คำค้นที่ตรงกับรายการหนึ่งแน่นอน
**Steps**
1. คลิกที่ช่องค้นหาแล้วพิมพ์คำค้นที่ตรงกับแผนกที่มีอยู่ **โดยยังไม่กด Enter** แล้วสังเกต URL กับตาราง
2. กด Enter
3. สังเกต query string ของหน้า
**Expected**
ระหว่างพิมพ์ยังไม่มีการยิงค้นหา (URL ไม่มีพารามิเตอร์ `search` และตารางยังแสดงผลเดิม — `SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); หลังกด Enter ตารางโหลดใหม่และเหลือเฉพาะรายการที่ตรงกับคำค้น; query string มี `search=<คำค้น>` และพารามิเตอร์ `page` ถูกรีเซ็ต

---
## TC-DEP-010009 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` โดยมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหา
2. คลิกปุ่มกากบาทนั้น
**Expected**
เมื่อช่องค้นหามีข้อความ ปุ่มท้ายช่องเป็นกากบาท (aria-label "Clear search") แทนไอคอนแว่นขยาย (aria-label "Search"); คลิกแล้วช่องค้นหาว่าง, พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการทั้งหมดโดยไม่ต้องกด Enter ซ้ำ

---
## TC-DEP-010010 — กรองตามสถานะ Active / Inactive
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department`; มีแผนกทั้งที่เปิดใช้งานและปิดใช้งานอย่างน้อยอย่างละ 1 รายการ
**Steps**
1. คลิกปุ่ม Filter ในแถบเครื่องมือ
2. ชี้/คลิกแถว Status ในเมนู แล้วเลือก "Active"
3. สังเกตตาราง, ปุ่ม Filter, แถบ chip และ query string
4. เปลี่ยนตัวเลือกเป็น "Inactive"
**Expected**
ตารางเหลือเฉพาะแผนกที่คอลัมน์ Status เป็นป้าย Active; ปุ่ม Filter มี badge เลข 1; แถบ chip ใต้แถบเครื่องมือขึ้นต้นด้วยคำว่า "Filters:" และมี chip ของสถานะพร้อมปุ่มลบ; query string มี `filter=is_active|bool:true` (encode แล้ว ตาม `DEPARTMENT_FILTER_FIELDS`) และหน้าถูกรีเซ็ตกลับหน้าแรก; เลือก "Inactive" แล้วผลสลับเป็นรายการที่ปิดใช้งาน (`is_active|bool:false`)

---
## TC-DEP-010012 — ล้างตัวกรองทั้งหมดจากแถบ chip
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` โดยมีตัวกรองสถานะทำงานอยู่ 1 ตัวและเห็น chip ในแถบตัวกรอง
**Steps**
1. คลิกลิงก์ "Clear" ที่ท้ายแถบ chip
**Expected**
chip ทั้งหมดหายไปและแถบตัวกรองไม่แสดงอีก (`ActiveFilterBar` คืน `null` เมื่อไม่มี filter); badge บนปุ่ม Filter หายไป; พารามิเตอร์ `filter` และ `sv` ถูกล้างออกจาก URL; ตารางกลับมาแสดงรายการทั้งหมด

---
## TC-DEP-010013 — เมนูเรียงลำดับ — ไม่มีค่าเริ่มต้น สลับทิศ และกลับเป็น Default
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด `/config/department` แบบไม่มีพารามิเตอร์ `sort` ใน URL; มีแผนกอย่างน้อย 2 รายการที่ code ต่างกัน
**Steps**
1. สังเกต URL ตอนเข้าหน้าครั้งแรก
2. เปิดเมนูเรียงลำดับ (ปุ่มไอคอนลูกศรขึ้น-ลง, aria-label "Sort by") แล้วอ่านรายชื่อในเมนู
3. เลือก "Code"
4. เลือก "Code" ซ้ำอีกครั้ง
5. เลือกแถว "Default"
**Expected**
หน้านี้ **ไม่มี default sort** (`DepartmentComponent` ไม่ได้ส่ง `defaultSort` ให้ `ConfigListTemplate`) — เข้าครั้งแรก URL ไม่มี `sort` และแถว "Default" มีเครื่องหมายกำกับอยู่; เมนูแสดง 6 แถวคือ Code, Name, Account Code, `is_active`, Created, Updated (แถวสถานะแสดงเป็น `is_active` ตามหมายเหตุข้อ 10 ไม่ใช่คำว่า Status); เลือก Code ครั้งแรกได้ `sort=code:asc` พร้อมลูกศรขึ้นบนแถวนั้น, เลือกซ้ำได้ `sort=code:desc` พร้อมลูกศรลง และลำดับแถวสลับตาม; เมนูเปิดค้างระหว่างสลับทิศ; เลือก Default ล้าง `sort` และ `page` ออกจาก URL

---
## TC-DEP-010014 — สลับมุมมองตาราง / การ์ด และข้อมูลบนการ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` บนหน้าจอขนาด desktop; มีแผนกอย่างน้อย 1 รายการที่กรอก Account Code, Description และมีสมาชิกอย่างน้อย 1 คน
**Steps**
1. คลิกปุ่มมุมมองการ์ด (aria-label "Grid view")
2. ดูการ์ดของแผนกนั้นและแถบเครื่องมือ
3. คลิกที่เนื้อการ์ด (ไม่ใช่ปุ่ม Delete ที่ footer)
4. กลับหน้า list แล้วคลิกปุ่มมุมมองตาราง (aria-label "List view")
**Expected**
มุมมองสลับเป็นกริดการ์ดได้; การ์ดแสดงชื่อแผนกเป็นหัวเรื่อง และในเนื้อการ์ดมีแถวสถานะ (ป้าย Active/Inactive), แถว Code, แถว Account Code, แถว "Department Members" ที่เป็นจำนวนสมาชิก (แสดงเฉพาะเมื่อมากกว่า 0), แถว Description (แสดงเฉพาะเมื่อมีค่า) และแถวข้อมูล Created / Updated ท้ายการ์ด พร้อมปุ่ม Delete ที่ footer; ในมุมมองการ์ด **ปุ่มเมนูคอลัมน์ถูกซ่อน** (ปุ่มเรียงลำดับยังอยู่) และไม่มีแถบ pagination (โหลดเพิ่มแบบ infinite scroll แทน); คลิกเนื้อการ์ดแล้ว **navigate ไปหน้ารายละเอียด** `/config/department/<uuid>` (ไม่ใช่เปิด dialog — `getEditPath` ทำให้ `handleEdit` เป็นการ navigate); กลับมาแล้วสลับเป็นตารางได้ข้อมูลครบเหมือนเดิม

---
## TC-DEP-010015 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (aria-label "Toggle columns")
2. สังเกตสถานะติ๊กของรายการ Created และ Updated
3. เปิดคอลัมน์ Created และ Updated
4. ปิดคอลัมน์ Account Code
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และรายการ Code, Name, Account Code, `is_active`, Created, Updated พร้อม checkbox (ช่องเลือก/ลำดับที่/ปุ่มจัดการไม่อยู่ในเมนูเพราะไม่มี `accessorFn`); Created และ Updated ไม่ถูกติ๊กตั้งแต่ต้น (ตรงกับ `initialState.columnVisibility` ใน `useDepartmentTable`); เปิดแล้วคอลัมน์ทั้งสองปรากฏในตารางพร้อมค่าเวลา/ผู้ทำรายการ; ปิด Account Code แล้วคอลัมน์นั้นหายจากตาราง และเมนูยังเปิดค้างให้ติ๊กต่อได้

---
## TC-DEP-010016 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามหน้าใน pagination
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` ในมุมมองตาราง; BU มีแผนกมากกว่า 10 รายการ (เพื่อให้มีมากกว่า 1 หน้า)
**Steps**
1. ดูข้อความ "Showing x–y of N" และค่าในตัวเลือก Rows ท้ายตาราง
2. เปลี่ยน Rows เป็น 5
3. คลิกปุ่มไปหน้าถัดไป (aria-label "Go to next page")
4. คลิกปุ่มไปหน้าแรก (aria-label "Go to first page")
**Expected**
ค่าเริ่มต้นของ Rows คือ 10 (`useListPageState` default) และตัวเลือกมี 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้ว `perpage=5` ปรากฏใน URL และตารางเหลือ 5 แถว; ไปหน้าถัดไปแล้ว `page=2` ปรากฏใน URL, ข้อความ "Showing" เปลี่ยนช่วงตาม และปุ่มย้อนกลับ/หน้าแรกเปลี่ยนเป็นใช้งานได้; กลับหน้าแรกแล้วปุ่มย้อนกลับถูก disable อีกครั้ง

---
## TC-DEP-010017 — ส่งออกรายการแผนกเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/department` บน desktop; มีแผนกอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ XLSX ที่มี 4 คอลัมน์ตามลำดับ Code / Name / Description / Status (ตาม `exportColumns` ใน `department-component.tsx`; Status เป็นคำว่า Active หรือ Inactive ไม่ใช่ true/false); **ไม่มีคอลัมน์ Account Code ในไฟล์ แม้จะมีในตาราง**; ข้อมูลที่ส่งออกคือแถวของหน้าปัจจุบันเท่านั้น; แสดง toast "Exported {N} records" โดย N เท่ากับจำนวนแถวที่เห็นในตาราง

---
## TC-DEP-010018 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/department` และค้นหา/กรองจนไม่มีแถวข้อมูลเหลือ (เห็น empty state "No data found")
**Steps**
1. คลิกปุ่ม Export ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่ม Export ไม่ค้างอยู่ในสถานะ "Exporting..." (โค้ด `return` ก่อนตั้ง `isExporting`) และหน้าใช้งานต่อได้ตามปกติ

---
## TC-DEP-010019 — บันทึกตัวกรองปัจจุบันเป็น saved view แล้วเรียกใช้ซ้ำ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/department` และตั้งตัวกรองสถานะเป็น Active ไว้แล้ว
**Steps**
1. เปิดปุ่ม saved view (ป้าย "No view") แล้วเลือก "Save current filters as view"
2. กรอกชื่อ view ที่ไม่ซ้ำ เลือก visibility แบบส่วนตัว แล้วกด Save
3. ล้างตัวกรองทั้งหมด
4. เปิดปุ่ม saved view อีกครั้งแล้วคลิกชื่อ view ที่เพิ่งบันทึก
5. เปิดเมนู ⋯ ของแถว view นั้นแล้วเลือก Delete และยืนยัน
**Expected**
Dialog บันทึก view มีช่องชื่อและตัวเลือกขอบเขต (ส่วนตัว / ทั้ง business unit); บันทึกแล้วป้ายบนปุ่มเปลี่ยนเป็นชื่อ view และ URL มีพารามิเตอร์ `sv=<id>`; หลังล้างตัวกรอง แล้วเลือก view เดิม ตัวกรองสถานะ Active ถูก apply กลับมาพร้อม chip; view ที่บันทึกอยู่ใต้หัวข้อกลุ่ม "My views"; ลบ view แล้วรายการหายจากเมนูและ `sv` ถูกล้างออกจาก URL

---
## TC-DEP-010020 — เมนู Row actions ของแถวมีเฉพาะ Activity และ Delete
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/department` และมีแผนกอย่างน้อย 1 รายการที่รู้ code แน่นอน
**Steps**
1. คลิกปุ่มจุดสามจุดท้ายแถว (aria-label "Row actions")
2. อ่านรายการเมนูที่เปิดออกมา
3. เลือก Activity
4. ปิด sheet แล้วกลับหน้าเดิม
**Expected**
เมนูมีเฉพาะ 2 รายการคือ Activity และ Delete — **ไม่มีรายการ Edit** เพราะ `useDepartmentTable` ส่งเฉพาะ `onDelete` ให้ `useConfigTable` (ทางเข้าแก้ไขคือปุ่มลิงก์บนคอลัมน์ Code หรือ Name เท่านั้น); เลือก Activity แล้วเปิด sheet ประวัติกิจกรรมโดยหัวเรื่องอ้าง **code** ของแถวนั้น (`activity.label: (r) => r.code`); ปิด sheet แล้วกลับมาหน้า list โดย URL และข้อมูลไม่เปลี่ยน

---
## TC-DEP-010021 — คอลัมน์ Code เปิดหน้ารายละเอียดได้เหมือนคอลัมน์ Name
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ทั้ง code และ name
**Steps**
1. ค้นหาแผนกนั้นในหน้า list
2. คลิกข้อความในคอลัมน์ **Code** ของแถวนั้น
3. จำ URL ที่ได้ แล้วกลับหน้า list
4. คลิกข้อความในคอลัมน์ **Name** ของแถวเดียวกัน
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ทั้งสองคอลัมน์ render เป็น `<button>` ที่มีสไตล์ลิงก์ (`CellAction` — ไม่ใช่ `<a href>` จึงต้องคลิกที่ปุ่ม ไม่ใช่ที่แถว); คลิกคอลัมน์ Code พาไปหน้า `/config/department/<uuid>` ของรายการนั้น; คลิกคอลัมน์ Name พาไป URL เดียวกันเป๊ะ; ทั้งสองครั้งหน้าที่ได้อยู่ในโหมด view (มีปุ่ม Edit ไม่ใช่ปุ่ม Save)

---
## TC-DEP-030004 — หัวข้อและค่าเริ่มต้นของฟอร์มหน้า /new
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; ยังไม่เคยเปิดฟอร์มในรอบนี้
**Steps**
1. คลิกปุ่ม "Add Department" ในหน้า list
2. อ่านหัวเรื่อง แถบปุ่ม และค่าในทุกช่อง
**Expected**
URL เป็น `/config/department/new`; หัวเรื่องคือ "Add Department" และ **ไม่มี badge code** ข้างหัวเรื่อง (badge ขึ้นเฉพาะเมื่อมี record); แถบปุ่มมีเฉพาะ Cancel กับ Create — **ไม่มีปุ่ม Edit, Delete หรือ Activity**; section แรกชื่อ "General" พร้อมคำอธิบาย "Code, name, account code and status."; ช่อง Code ว่าง มี placeholder "e.g. IT, HR, FIN" และ label มีเครื่องหมายบังคับกรอก; ช่อง Name ว่าง มี placeholder "e.g. Information Technology" และ label มีเครื่องหมายบังคับกรอก; ช่อง Account Code และ Description ว่าง มี placeholder "Optional" และ label **ไม่มี** เครื่องหมายบังคับกรอก; สวิตช์สถานะอยู่ที่เปิดใช้งาน (`aria-checked="true"`) พร้อมป้าย Active; section "Department Members" และ "Head of Department" แสดง Transfer สองแผง (ซ้าย "Available Users") โดยตัวเลขข้างหัวข้อทั้งสองเป็น 0

---
## TC-DEP-030005 — สร้างสำเร็จแล้วเด้งไปหน้ารายละเอียดของรายการใหม่
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; code/name ที่จะใช้ยังไม่มีอยู่ใน DB
**Steps**
1. เปิด `/config/department/new`
2. กรอก Code, Name, Account Code และ Description
3. กด Create แล้วรอ toast
4. สังเกต URL และแถบปุ่มของหน้าที่ได้
5. กดปุ่ม Go back
6. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast "Department created successfully"; **URL เปลี่ยนเป็น `/config/department/<uuid>` ของรายการใหม่** และหน้าอยู่ในโหมด view (มีปุ่ม Edit / Delete / Activity, ค่าทุกช่องแสดงเป็นข้อความไม่ใช่ input, badge ข้างหัวเรื่องเป็น code ที่เพิ่งกรอก, หัวเรื่องเป็นชื่อแผนก); เพราะ navigate ใช้ `replace: true` การกด Go back จึงพาไปหน้า list ไม่ใช่ย้อนกลับไปหน้า `/new`
_(ดูหมายเหตุข้อ 6 — โค้ดระบุพฤติกรรมนี้ชัดเจน แต่คอมเมนต์ในสเปกเดิมระบุตรงข้าม ถ้าเทสนี้ไม่ผ่านให้เปิดเป็นบั๊กของแอป อย่าแก้ assertion ให้อ่อนลง)_

---
## TC-DEP-030006 — Cancel ขณะฟอร์มสร้างยัง dirty ต้องเด้ง Discard แล้วกลับ list
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/department/new` และกรอก Code กับ Name ไว้แล้วแต่ยังไม่กด Create
**Steps**
1. คลิกปุ่ม Cancel ในแถบปุ่ม
2. อ่านหัวข้อและปุ่มใน dialog ที่เด้งขึ้น
3. กดปุ่ม "Keep editing"
4. คลิก Cancel อีกครั้งแล้วกดปุ่ม "Discard"
5. ค้นหา code ที่กรอกไว้ในหน้า list
**Expected**
กด Cancel แล้วเด้ง alert dialog หัวข้อ "Discard changes?" พร้อมคำอธิบาย "You have unsaved changes that will be lost." และปุ่มสองตัวคือ "Keep editing" กับ "Discard"; กด "Keep editing" แล้ว dialog ปิดและยังอยู่ที่ `/config/department/new` โดยค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วกลับไปหน้า `/config/department` (ในโหมดสร้าง `handleCancel` เรียก `backToList` ไม่ใช่กลับเป็นโหมด view); ค้นหา code นั้นแล้วไม่พบรายการ (ไม่มีอะไรถูกบันทึก)

---
## TC-DEP-030007 — ปุ่ม Go back จากฟอร์มสร้างที่ยังไม่แก้อะไร กลับ list ทันที
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; เปิด `/config/department/new` โดย **ยังไม่พิมพ์อะไรเลย**
**Steps**
1. คลิกปุ่ม Go back (ปุ่มลูกศรซ้ายหน้าหัวเรื่อง, label "Go back")
**Expected**
กลับไปหน้า `/config/department` ทันทีโดย **ไม่มี Discard dialog** (ฟอร์มยังไม่ dirty); ปลายทางคือหน้า list เสมอ ไม่ใช่การถอย history ทีละหน้า (`handleBack` → `navigate(listPath)`)

---
## TC-DEP-030008 — กดเมนู sidebar ขณะฟอร์มสร้าง dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/department/new` และกรอก Name ไว้แล้ว (ฟอร์ม dirty) โดยยังไม่กด Create
**Steps**
1. คลิกเมนูอื่นใน sidebar (ลิงก์ที่มี `href` ไปคนละ path เช่น Unit หรือ Location)
2. อ่าน dialog ที่เด้งขึ้นแล้วกด "Keep editing"
3. ตรวจ URL และค่าที่กรอกไว้
4. คลิกเมนูเดิมซ้ำแล้วกด "Discard"
**Expected**
คลิกลิงก์แล้ว **ยังไม่ navigate** แต่เด้ง Discard dialog เดียวกับข้อ TC-DEP-030006 (`useNavigationGuard` ดัก click ของ `<a>` ใน capture phase); กด "Keep editing" แล้ว URL ยังเป็น `/config/department/new` และค่าที่กรอกไว้ยังอยู่ครบ; กด "Discard" แล้วจึงไปยังหน้าปลายทางของลิงก์นั้นจริง

---
## TC-DEP-040006 — หน้ารายละเอียดโหมด view แสดงข้อมูลครบและไม่มีช่องกรอก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ กรอก Account Code + Description และมีสมาชิกอย่างน้อย 1 คน
**Steps**
1. เปิดแผนกนั้นจากหน้า list
2. อ่านหัวเรื่อง badge แถบปุ่ม และค่าในแต่ละ section
3. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หัวเรื่องคือ **ชื่อแผนก** (ไม่ใช่คำว่า "Department") และมี badge (aria-label "Code") แสดง code ต่อท้าย; แถบปุ่มมี Edit, Delete, Activity และปุ่ม Go back — **ไม่มีปุ่ม Save/Cancel**; ทุกค่าของ section General แสดงเป็นข้อความ (`[data-slot="field-plain-text"]`) ไม่มี `<input>`/`<textarea>` ที่มี id `department-code` / `department-name` / `department-account-code` / `department-description` อยู่ใน DOM เลย; section "Department Members" และ "Head of Department" แสดงเป็นตารางผู้ใช้ (คอลัมน์ #, Name, Email, Telephone พร้อมช่องค้นหาของตัวเอง) ไม่ใช่ Transfer; ตัวเลขข้างหัวข้อ section ตรงกับจำนวนแถวในตารางนั้น

---
## TC-DEP-040007 — deep link เข้าหน้ารายละเอียดโดยตรงได้โหมด view
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; รู้ `<uuid>` ของแผนกที่มีอยู่จริง (สร้างไว้สำหรับเทสนี้)
**Steps**
1. `page.goto("/config/department/<uuid>")` ตรง ๆ โดยไม่ผ่านหน้า list
2. รอให้ฟอร์มโหลดเสร็จ (FormSkeleton หาย)
3. กด Edit แล้ว reload หน้า
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
เข้าได้โดยไม่ถูก redirect; ระหว่างโหลดแสดง skeleton ของฟอร์ม แล้วจึงแสดงข้อมูลของแผนกนั้นในโหมด view; หลังกด Edit หน้าเข้าสู่โหมดแก้ไข (มีปุ่ม Save/Cancel) แต่ **URL ไม่เปลี่ยน**; reload แล้วหน้ากลับเป็นโหมด view อีกครั้ง (`useEntityForm` ตั้ง `mode = "view"` ทุกครั้งที่ mount เมื่อมี entity) — การ assert ค่าหลัง reload จึงต้องอ่านจากข้อความ ไม่ใช่จาก `#department-name`

---
## TC-DEP-040008 — deep link ด้วย id ที่ไม่มีอยู่ ต้องแสดง Department not found
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG
**Steps**
1. `page.goto("/config/department/00000000-0000-0000-0000-000000000000")`
2. รอให้หน้าโหลดเสร็จ
3. กดปุ่มกลับหน้า list
**Expected**
แสดงกล่องสถานะข้อผิดพลาด (`role="alert"`) หัวข้อ "Something went wrong" และข้อความ **"Department not found"** (ค่า `config.department.notFound` ที่ `DepartmentEditContent` ส่งให้ `ErrorState`); เพราะเป็นทางตัน จึง **ไม่มีปุ่ม "Try again"** แต่มีปุ่ม "Back to list" และ "Go to dashboard"; กดปุ่มแรกแล้วกลับไปหน้า `/config/department`

---
## TC-DEP-040009 — แก้ไข Account Code แล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ (ยังไม่กรอก Account Code)
**Steps**
1. เปิดแผนกนั้นจาก list แล้วกด Edit
2. กรอก Account Code เป็นค่าใหม่
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วเปิดแผนกนั้นใหม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แสดง toast **"Department updated successfully"** (ผูกกับข้อความเต็ม ไม่ใช่คำว่า success ลอย ๆ — ดูหมายเหตุข้อ 4) และหน้ากลับเป็นโหมด view เองโดยไม่ย้าย URL; คอลัมน์ Account Code ของแถวนั้นในหน้า list แสดงค่าใหม่ (แถวที่ไม่มีค่าแสดง `-`); เปิดรายการนั้นใหม่แล้วค่ายังเป็นค่าที่กรอก (persist จริง ไม่ใช่แค่ optimistic)

---
## TC-DEP-040010 — ยืนยัน Discard ในโหมดแก้ไข ต้องคืนค่าบนหน้าจอและกลับโหมด view
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ค่า Name เดิม
**Steps**
1. เปิดแผนกนั้นจาก list แล้วกด Edit
2. แก้ Name เป็นค่าอื่น และแก้ Description เป็นค่าอื่น
3. กด Cancel แล้วกด "Discard" ใน dialog
4. อ่านค่าที่แสดงบนหน้าจอ **ทันทีโดยไม่ reload และไม่ออกจากหน้า**
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
หลังกด Discard หน้ากลับเป็นโหมด view ในหน้าเดิม (ปุ่ม Edit กลับมา, ปุ่ม Save/Cancel หายไป) โดย **ไม่กลับไปหน้า list** (ต่างจากโหมดสร้างที่ `handleCancel` พากลับ list); ค่าที่แสดงบนหน้าจอเป็นค่าเดิมทั้ง Name และ Description ทันที ไม่ใช่ค่าที่เพิ่งพิมพ์ไป (`form.reset(defaultValues, { keepFieldsRef: true })` เขียนค่ากลับลง DOM จริง); กด Edit ซ้ำแล้วช่องกรอกก็แสดงค่าเดิมเช่นกัน

---
## TC-DEP-040011 — ถอดสมาชิกออกจากแผนกแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้และ **มีสมาชิกอยู่แล้วอย่างน้อย 1 คน** (assign ไว้ก่อนในขั้นเตรียม) — ถ้า assign ไม่ได้ให้ skip เหมือน TC-DEP-040004
**Steps**
1. เปิดแผนกนั้นจาก list แล้วกด Edit
2. ใน section "Department Members" ติ๊กสมาชิกคนแรกในแผงขวา แล้วกดปุ่มย้ายไปซ้าย (aria-label "Move selected to left")
3. กด Save แล้วรอ toast
4. กลับหน้า list แล้วเปิดแผนกนั้นใหม่
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ผู้ใช้คนนั้นย้ายกลับไปแผง "Available Users" และตัวเลขข้างหัวข้อ section ลดลง 1 ทันที; ปุ่มย้ายไปซ้ายถูก disable เมื่อไม่มีรายการติ๊กไว้ และใช้งานได้เมื่อติ๊กแล้ว; กด Save แล้วได้ toast "Department updated successfully"; เปิดรายการใหม่แล้วตารางสมาชิกในโหมด view ไม่มีผู้ใช้คนนั้นแล้ว และจำนวนบนการ์ดในมุมมองการ์ดลดลงตาม

---
## TC-DEP-040012 — แหล่งรายชื่อของ Members ต่างจาก Head of Department
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; BU มีผู้ใช้ทั้งที่ถูก assign เข้าแผนกอื่นแล้วและที่ยังไม่มีแผนก; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดแผนกนั้นจาก list แล้วกด Edit
2. อ่านจำนวนรายการในแผง "Available Users" ของ section "Department Members"
3. อ่านจำนวนรายการในแผง "Available Users" ของ section "Head of Department"
4. พิมพ์ชื่อผู้ใช้คนหนึ่งในช่องค้นหาของแผงซ้ายใน section "Head of Department"
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
แผง Available ของ "Head of Department" มีผู้ใช้ **ทุกคนใน BU** ส่วนแผง Available ของ "Department Members" มีเฉพาะผู้ใช้ที่ยังไม่มีแผนก (บวกกับคนที่อยู่ในแผนกนี้อยู่แล้ว) — จำนวนของ HOD จึงมากกว่าหรือเท่ากับของ Members เสมอ และผู้ใช้ที่ถูก assign ให้แผนกอื่นแล้วปรากฏเฉพาะฝั่ง HOD; พิมพ์ค้นหาแล้วแผงนั้นกรองตามชื่อทันทีโดยไม่กระทบอีก section หนึ่ง; ทั้งสอง Transfer ใช้ปุ่มย้ายที่มี aria-label ชุดเดียวกัน จึงต้อง scope locator ตามหัวข้อ section (ดู `tests/pages/department-form.helper.ts`)

---
## TC-DEP-040013 — เปิด Activity sheet จากแถบปุ่มหน้ารายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้และเคยถูกแก้ไขอย่างน้อย 1 ครั้ง
**Steps**
1. เปิดแผนกนั้นจาก list
2. คลิกปุ่ม Activity ในแถบปุ่ม
3. ปิด sheet
4. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ปุ่ม Activity อยู่ท้ายกลุ่มปุ่ม ถัดจาก Edit และ Delete; คลิกแล้วเปิด sheet ประวัติกิจกรรมของแผนกนั้นโดยหัวเรื่องอ้าง **ชื่อแผนก** (ต่างจากเมนูในแถวตารางที่อ้าง code — ดู TC-DEP-010020); ปิด sheet แล้ว URL และโหมดของฟอร์มไม่เปลี่ยน

---
## TC-DEP-040014 — กดปุ่ม Back ของเบราว์เซอร์ขณะโหมดแก้ไข dirty ต้องถูกดัก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้; เข้าหน้ารายละเอียดจากหน้า list (มี history ให้ถอยจริง)
**Steps**
1. กด Edit แล้วแก้ Name ให้ฟอร์ม dirty
2. กด Back ของเบราว์เซอร์ (`page.goBack()`)
3. กด "Keep editing"
4. กด Back อีกครั้งแล้วกด "Discard"
5. ลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
กด Back ครั้งแรกแล้ว **หน้าไม่เปลี่ยน** แต่เด้ง Discard dialog (`useNavigationGuard` ดันรายการ sentinel ไว้ใน history แล้วดัก popstate); กด "Keep editing" แล้ว URL ยังเป็น `/config/department/<uuid>` และค่าที่แก้ไว้ยังอยู่; กด Back ครั้งที่สองแล้วกด "Discard" จึงออกจากหน้าไปจริง (กลับหน้า list) และค่าที่แก้ไว้ไม่ถูกบันทึก

---
## TC-DEP-050003 — ลบแผนกจากเมนู Row actions ในหน้า list
**Priority:** High · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะและรู้ชื่อแน่นอน
**Steps**
1. ค้นหาแผนกนั้นในหน้า list
2. เปิดเมนู Row actions ของแถวนั้นแล้วเลือก Delete
3. อ่านหัวข้อและคำอธิบายใน dialog ยืนยัน
4. กด Delete เพื่อยืนยัน
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Department" และคำอธิบายที่มีชื่อแผนกอยู่ในข้อความ ("Are you sure you want to delete department \"<ชื่อ>\"? This action cannot be undone."); footer มีปุ่ม Cancel และปุ่ม Delete (สีเตือน); ยืนยันแล้วแสดง toast "Department deleted successfully", dialog ปิดเอง, **ยังอยู่ที่หน้า list** (ไม่มีการ navigate) และแถวนั้นหายจากตาราง

---
## TC-DEP-050004 — ลบแผนกจากปุ่มลบบนการ์ด
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ; สลับหน้าเป็นมุมมองการ์ดแล้ว
**Steps**
1. หาการ์ดของแผนกนั้น แล้วคลิกปุ่ม Delete ที่ footer ของการ์ด
2. ยืนยันการลบใน dialog
**Expected**
คลิกปุ่ม Delete บนการ์ดแล้ว **ไม่ navigate ไปหน้ารายละเอียด** (ปุ่มใน footer ไม่ทะลุไปเป็นการคลิกการ์ด) แต่เปิด dialog ยืนยันลบใบเดียวกับ TC-DEP-050003; ยืนยันแล้วแสดง toast "Department deleted successfully" และการ์ดใบนั้นหายจากกริดโดย URL ไม่เปลี่ยน

---
## TC-DEP-050005 — ลบจากหน้ารายละเอียดในโหมด view แล้วเด้งกลับหน้า list
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดแผนกนั้นจาก list (อยู่ในโหมด view — **ไม่กด Edit**)
2. คลิกปุ่ม Delete ในแถบปุ่ม
3. ยืนยันการลบใน dialog
4. สังเกต URL หลัง toast ขึ้น
**Expected**
ปุ่ม Delete ใช้งานได้ตั้งแต่โหมด view ไม่ต้องกด Edit ก่อน (`FormToolbar` แสดงปุ่ม Delete เมื่อ `!isAdd && onDelete` ทั้งโหมด view และ edit); dialog ยืนยันมีหัวข้อ "Delete Department" และชื่อแผนกในคำอธิบาย; ยืนยันแล้วแสดง toast "Department deleted successfully" และ **หน้าเด้งกลับไปที่ `/config/department`** เอง (`f.backToList()`) ไม่ค้างอยู่ที่ URL ของ record ที่ถูกลบไปแล้ว; ค้นหาชื่อนั้นในหน้า list แล้วไม่พบ

---
## TC-DEP-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้งแจ้งสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.department.view` แต่ไม่มี `configuration.department.create` และ **ไม่ใช่ admin ของ BU** (admin bypass ทุก permission — ดู `hooks/use-can.ts`); BU ที่ใช้ทดสอบยังไม่หมดอายุสัญญา (ไม่งั้นจะได้ dialog "Subscription Expired" ซึ่งเป็นคนละเหตุผล)
**Steps**
1. ไปที่ `/config/department`
2. สังเกตสภาพปุ่ม "Add Department"
3. คลิกปุ่ม "Add Department"
**Expected**
ปุ่ม "Add Department" ยังแสดงอยู่แต่ถูกทำให้จาง (มี `aria-disabled="true"`); คลิกแล้ว **ไม่ navigate ไป `/config/department/new`** แต่เด้ง dialog "Permission Denied" พร้อมข้อความ "You don't have permission to perform this action." และบรรทัดแนะนำให้ติดต่อผู้ดูแลระบบ; ปิด dialog แล้ว URL ยังเป็น `/config/department`

---
## TC-DEP-100006 — ไม่มีสิทธิ์แก้ไข — ปุ่ม Edit เด้งแจ้งสิทธิ์แทนเข้าโหมดแก้ไข
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.department.view` แต่ไม่มี `configuration.department.update` และไม่ใช่ admin ของ BU; มีแผนกอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/department` แล้วเปิดแผนกรายการแรก
2. สังเกตสภาพปุ่ม Edit
3. คลิกปุ่ม Edit
**Expected**
เข้าหน้ารายละเอียดได้ตามปกติในโหมด view (สิทธิ์ view ไม่ถูกกระทบ); ปุ่ม Edit ยังแสดงอยู่แต่ถูกทำให้จางและมี `aria-disabled="true"`; คลิกแล้ว **ไม่เข้าโหมดแก้ไข** (ไม่มีปุ่ม Save/Cancel, ยังไม่มี `<input>` ในฟอร์ม) แต่เด้ง dialog "Permission Denied" แทน

---
## TC-DEP-100007 — ไม่มีสิทธิ์ลบ — ทุกทางเข้าของปุ่มลบเด้งแจ้งสิทธิ์
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่มีสิทธิ์ `configuration.department.view` แต่ไม่มี `configuration.department.delete` และไม่ใช่ admin ของ BU; มีแผนกอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/department` แล้วเปิดเมนู Row actions ของแถวแรก สังเกตรายการ Delete แล้วคลิก
2. สลับเป็นมุมมองการ์ดแล้วคลิกปุ่ม Delete บนการ์ด
3. เปิดหน้ารายละเอียดของแผนกนั้นแล้วคลิกปุ่ม Delete ในแถบปุ่ม
**Expected**
ทั้งสามทางให้ผลเหมือนกัน: รายการ/ปุ่ม Delete ยังแสดงอยู่แต่จางและมี `aria-disabled="true"`, คลิกแล้ว **ไม่เปิด dialog ยืนยันลบ** แต่เด้ง dialog "Permission Denied" แทน (ตาราง การ์ด และฟอร์มอ่านสิทธิ์จากชุดเดียวกัน — `useDeleteGate` / `FormToolbar`); ไม่มีรายการใดถูกลบ และจำนวนรายการรวมใน pagination ไม่เปลี่ยน

---
## TC-DEP-100008 — ไม่มีสิทธิ์ดู — เมนู sidebar จาง และ deep link ถูก RouteGuard บล็อก
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** สิทธิ์ `configuration.department.view` และไม่ใช่ admin ของ BU
**Steps**
1. เปิดเมนูของกลุ่มโมดูล Config ใน sidebar แล้วสังเกตรายการ "Department"
2. คลิกรายการนั้น
3. `page.goto("/config/department")` ตรง ๆ
4. `page.goto("/config/department/new")` ตรง ๆ
**Expected**
รายการ "Department" ยังอยู่ในเมนูแต่ถูกทำให้จาง (`opacity-50`) และ **ไม่ใช่ลิงก์** — ไม่มี `<a href="/config/department">` ให้กดไปหน้า; **ไม่มีไอคอนแม่กุญแจ** เพราะ department ไม่มี `licenseFeature` (แม่กุญแจสงวนไว้ให้กรณี license — ดูหมายเหตุข้อ 7); คลิกแล้ว URL ไม่เปลี่ยนและเด้ง dialog "Permission Denied"; deep link ทั้งหน้า list และหน้า `/new` ถูก `RouteGuard` บล็อกเหมือนกัน โดยแสดงการ์ด (`role="alert"`) ที่มีคำว่า "Restricted", หัวข้อ "Permission Denied", ข้อความ "You don't have permission to view this page." และปุ่ม "Go to an available page" — **ไม่ใช่** การ redirect เงียบ ๆ

---
## TC-DEP-200006 — ข้อความ error ใต้ช่อง Code/Name และเลื่อนไปช่องแรกที่ผิด
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่ `/config/department/new`
**Steps**
1. เลื่อนหน้าลงไปจนเห็น section "Head of Department" (ให้ช่อง Code หลุดออกนอกจอ)
2. กด Create โดยไม่กรอกอะไรเลย
3. อ่านข้อความใต้ช่อง Code และช่อง Name
4. กรอกเฉพาะ Code แล้วกด Create ซ้ำ
**Expected**
ฟอร์มไม่ถูก submit และหน้าเลื่อนกลับไปที่ช่องที่ผิดช่องแรก (`scrollToFirstInvalidField()` ใน `onInvalid`); ช่อง Code แสดงข้อความ **"Code is required"** และช่อง Name แสดง **"Name is required"** (ประกอบจาก `validation.required` + label ของ field) พร้อมสถานะ invalid บนช่องนั้น; ช่อง Account Code และ Description **ไม่มี** ข้อความ error (schema เป็น `z.string()` เปล่า ไม่บังคับกรอก); หลังกรอก Code แล้วกดซ้ำ ข้อความใต้ Code หายไปแต่ข้อความใต้ Name ยังอยู่

---
## TC-DEP-200007 — ขีดจำกัดความยาวของช่องในโหมดแก้ไข
**Priority:** Low · **Test Type:** Validation
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีแผนกที่สร้างไว้สำหรับเทสนี้โดยเฉพาะ
**Steps**
1. เปิดแผนกนั้นจาก list แล้วกด Edit
2. พิมพ์ Code ยาว 15 ตัวอักษร
3. พิมพ์ Name ยาว 200 ตัวอักษร
4. พิมพ์ Account Code ยาว 50 ตัวอักษร
5. ยกเลิกด้วย Cancel → Discard แล้วลบรายการที่สร้างไว้เพื่อคืนสภาพ
**Expected**
ค่าใน Code ถูกตัดที่ 10 ตัวอักษร, Name ถูกตัดที่ 100 ตัวอักษร และ Account Code ถูกตัดที่ 30 ตัวอักษร (`maxLength` ของแต่ละ `FieldInput` ใน `department-form.tsx`) — ขีดจำกัดชุดเดียวกับหน้า `/new` แต่เคสเดิมในสเปกตรวจเฉพาะหน้า `/new`; ไม่มีข้อความ validation ใด ๆ ขึ้น เพราะ input ตัดค่าให้ตั้งแต่ตอนพิมพ์; ช่อง Account Code ไม่มีเครื่องหมายบังคับกรอก จึงเว้นว่างแล้วบันทึกได้ปกติ
