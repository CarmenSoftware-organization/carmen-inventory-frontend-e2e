# Credit Note Reason — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของโมดูล — เคสที่เหลือถูกทดสอบจริงอยู่แล้วใน `tests/602-cn-reason.spec.ts` (14 เคสในไฟล์ + 4 เคสจาก `addDialogSecurityCases`) และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/602-cn-reason.md`_

**Module:** Config — Credit Note Reason (เหตุผลใบลดหนี้)
**Frontend route:** `routes/config/credit-note-reason`  •  **URL:** `/config/credit-note-reason`
**Prefix:** `CNR`
**สเปกที่ครอบส่วนที่เหลือ:** `tests/602-cn-reason.spec.ts`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 27

> **หมายเหตุสำคัญสำหรับผู้รีวิว:** ทุกเคสในไฟล์นี้ยืนยันจากโค้ดของโมดูลเองแล้ว (`credit-note-reason-*.tsx/ts`) และจาก shared template ที่มันใช้ (`components/templates/config-list-template.tsx`, `components/templates/config-entity-dialog.tsx`, `components/ui/data-grid/*`) ไม่ได้ลอกจากแคตตาล็อกของโมดูลอื่น ข้อเท็จจริงที่ต่างจาก config module ทรงเดียวกัน (เช่น `083-shelf.md`) และมีผลกับการเขียนเทส:
>
> 1. **หน้านี้ไม่มีปุ่ม Filter** — `CREDIT_NOTE_REASON_FILTER_FIELDS` เป็น `[]` และ `ListFilter` คืน `null` เมื่อไม่มี field (คอมเมนต์ในโค้ดระบุชื่อ credit-note-reason ไว้ตรง ๆ) แถบ chip (`ActiveFilterBar`) จึงว่างเสมอ และ saved view ของหน้านี้เก็บได้แค่ `sort` เท่านั้น อย่าเขียนเคส "กรองตามสถานะ" เด็ดขาด นอกจากนี้ `SaveViewDialog` ที่ `ConfigListTemplate` render ไว้คู่กับ `ListFilter` จะเข้าไม่ถึงเลย — ทางเข้าเดียวที่ใช้ได้คือ `SaveViewDialog` ตัวในของ `ViewSelector`
> 2. **ตารางไม่มีคอลัมน์ช่องเลือกและไม่มีคอลัมน์ Status** — `selectColumn` ถูกประกอบเข้า table จริง แต่ `DataGridTable` ซ่อนมันเมื่อ `tableLayout.checkbox` ไม่ถูกเปิด ซึ่ง `ConfigListTemplate` ส่งมาแค่ `{ headerSticky: true }`; ส่วน status ถูกตัดด้วย `hideStatus: true` ใน `use-credit-note-reason-table.tsx` แต่ **การ์ดในมุมมอง grid ยังแสดงสถานะ** (`ListCardActiveRow`) และ **ไฟล์ export ยังมีคอลัมน์ Status** — ไม่ใช่ความไม่สอดคล้องที่ต้อง fail เทส แต่ให้ assert ตามที่ออกแบบไว้จริง
> 3. **dialog ไม่มีสวิตช์ is_active** — `toPayload` ส่งแค่ `{ name, description }` จึงไม่มีทางแก้สถานะจาก UI ของโมดูลนี้ เคสทำนอง "ปิดใช้งานด้วยสวิตช์สถานะ" ใช้ไม่ได้
> 4. **ข้อความ validation ไม่ได้อยู่ใต้ช่อง** — `FieldInput` ตั้ง `aria-invalid` + ไอคอน `CircleAlert` แล้วแสดงข้อความใน **tooltip** ต้อง hover/focus ถึงจะอ่านข้อความได้ (สเปกเดิม TC-CNR-200001/200002 assert แค่ element ที่ `aria-invalid` จึงยังไม่เคยตรวจข้อความจริง)
> 5. **สิทธิ์ของหน้านี้เป็นสิทธิ์ก้อนกลาง ไม่ใช่สิทธิ์เฉพาะโมดูล** — `constant/module-list.ts` ผูก leaf นี้กับ `PERMISSIONS.configuration.view` ทำให้ `usePermissionPrefix()` คืน `configuration` เคสหมวด 10 จึงอ้างสิทธิ์ `configuration.create` / `configuration.update` / `configuration.delete` (การเพิกถอนสิทธิ์เหล่านี้กระทบทุกหน้า config ที่ใช้ prefix เดียวกัน — เตรียม user ทดสอบด้วยความระวัง) โมดูลนี้ยังผูก `licenseFeature: "configuration.credit_note_reason"` ไว้ด้วย
> 6. **BLOCKER ของ `tests/601-cn.spec.ts`** — ฟอร์ม Credit Note บังคับฟิลด์ reason (`routes/procurement/credit-note/cn-form-schema.ts:85` ใช้ `z.string().min(1)`) และ dropdown มาจาก `LookupCnReason` ซึ่งเรียก `useCnReason({ perpage: 30 })` บน endpoint **คนละตัว** กับหน้า config (`/api/proxy/api/{bu}/credit-note-reasons` เทียบกับ `/api/proxy/api/config/{bu}/credit-note-reasons`) ผลที่ตามมาสองข้อ: (ก) ถ้าการรันเทสของโมดูลนี้ทิ้งเรคคอร์ดค้างจนจำนวนเหตุผลใน BU เกิน 30 รายการ เหตุผลที่ 601 ใช้อาจหลุดออกจาก dropdown; (ข) ถ้าลบเหตุผลที่ CN ที่มีอยู่อ้างถึง `reasons.find((r) => r.id === value)?.name` จะคืน `undefined` ทำให้ Select แสดง placeholder และฟิลด์บังคับของ CN นั้นกลายเป็นว่าง → TC-CN-080001/080002/080003 จะพังตามไปด้วย **ทุกเคสในหมวด 05 ของไฟล์นี้ต้องสร้างเหตุผลของตัวเองขึ้นมาลบเท่านั้น ห้ามลบเหตุผลที่มีอยู่เดิมของ BU** และ cleanup ต้องรับประกันว่าจำนวนเหตุผลรวมกลับสู่ค่าเดิม
> 7. **ข้อเท็จจริงที่บันทึกไว้แต่ไม่ได้เขียนเป็นเคส:** schema ใช้ `z.string().min(1)` โดยไม่ `trim()` ชื่อที่เป็นช่องว่างล้วนจึงผ่าน client validation ไปถึง backend — พฤติกรรมนี้ควรให้ฝั่งแอปตัดสินก่อน อย่าเพิ่งแปลงเป็นเทส; ปุ่ม Print มีอยู่เสมอ (`hideExportPrint` ไม่ถูกส่ง) แต่เรียก `globalThis.print()` ซึ่งเปิด print dialog ของเบราว์เซอร์ จึงไม่เหมาะเป็นเคส e2e; เมนู Activity ถูกเปิดไว้ผ่าน `activity: { id, label }` ทั้งที่คอมเมนต์ใน `use-config-table.tsx` เตือนว่าตารางที่ backend ไม่ได้ลงทะเบียน activity จะได้ sheet ที่ว่าง — TC-CNR-010017 จึง assert แค่ว่า sheet เปิดพร้อมชื่อรายการ ไม่ assert ว่ามีรายการกิจกรรม
> 8. **หมวด 01 เกือบทั้งหมดต้องรันบน desktop viewport** — ปุ่ม Export / Print / Sort / Toggle columns / สลับมุมมอง ถูกซ่อนด้วย breakpoint `sm:` และบนมือถือ `useIsMobile()` บังคับเป็น grid + infinite scroll (ไม่มี pagination)
>
> **เรื่องที่สเปกครอบแล้ว ห้ามเขียนซ้ำ:** โหลดหน้า list / ปุ่ม Add ปรากฏ / พิมพ์ในช่องค้นหา / ค้นหาแล้วไม่พบ → empty state / active BU = BLAVG / สร้างด้วย name / แก้ name แล้ว persist / ยกเลิกการแก้ไขด้วยปุ่ม Cancel / ลบ + ยกเลิกการลบ / สร้างชื่อซ้ำถูก reject / บันทึกโดยไม่กรอกชื่อ (สร้างและแก้ไข) / XSS + SQL injection / name maxLength 100 / low-privilege user (เคสนี้คือ TC-CNR-100004 ซึ่งถูก `skipAuth: true` ปิดไว้ — คอมเมนต์ในสเปกเขียนเลขเก่า `TCS-CNR00112` ไว้ แต่ ID ที่ helper สร้างจริงคือ TC-CNR-100004 และถือว่าถูกจองแล้ว)

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CNR-010006 | แสดงรายการเหตุผลพร้อมคอลัมน์มาตรฐาน | High | Smoke |
| TC-CNR-010007 | แถบเครื่องมือไม่มีปุ่มตัวกรองเพราะโมดูลไม่ประกาศ filter field | Medium | Functional |
| TC-CNR-010008 | ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา | Low | Functional |
| TC-CNR-010009 | เรียงลำดับเริ่มต้นตามชื่อและสลับทิศจากเมนู Sort by | Medium | Functional |
| TC-CNR-010010 | ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-CNR-010011 | สลับมุมมองตาราง / การ์ด | Low | Functional |
| TC-CNR-010012 | การ์ดในมุมมอง grid แสดงข้อมูลครบและเปิด dialog แก้ไขได้ | Low | Functional |
| TC-CNR-010013 | เปลี่ยนจำนวนแถวต่อหน้าและข้ามไปหน้าถัดไป | Medium | Functional |
| TC-CNR-010014 | บันทึกและเรียกใช้ saved view จากเมนู View | Medium | Functional |
| TC-CNR-010015 | ส่งออกรายการเป็นไฟล์ XLSX | Medium | Functional |
| TC-CNR-010016 | กดส่งออกขณะไม่มีข้อมูลในรายการ | Low | Edge Case |
| TC-CNR-010017 | เปิด Activity ของแถวจากเมนู Row actions | Medium | Functional |
| TC-CNR-030002 | สร้างเหตุผลพร้อมคำอธิบายแล้วค่าคงอยู่ | Medium | CRUD |
| TC-CNR-030003 | ยกเลิกการสร้างแล้วเปิด dialog ใหม่ ฟอร์มถูกรีเซ็ต | Low | Alternate Flow |
| TC-CNR-030004 | ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และ dialog ปิดไม่ได้ | Low | Functional |
| TC-CNR-040005 | แก้ไขเฉพาะคำอธิบายแล้วค่าคงอยู่ | Medium | CRUD |
| TC-CNR-040006 | dialog แก้ไขแสดงหัวข้อและเติมค่าเดิมครบทุกช่อง | Medium | Happy Path |
| TC-CNR-040007 | ปิด dialog ด้วยปุ่ม Escape โดยไม่บันทึก | Low | Alternate Flow |
| TC-CNR-050003 | dialog ยืนยันลบแสดงหัวข้อและชื่อรายการที่จะลบ | Medium | Functional |
| TC-CNR-050004 | ลบเหตุผลแล้ว dropdown ของ Credit Note ต้องไม่แสดงรายการนั้นอีก | High | Functional |
| TC-CNR-100005 | ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้ง Permission Denied | High | Authorization |
| TC-CNR-100006 | ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว | Medium | Security |
| TC-CNR-100007 | ไม่มีสิทธิ์ลบ — เมนู Delete ของแถวเด้ง Permission Denied | Medium | Authorization |
| TC-CNR-100008 | สัญญาหมดอายุ — ปุ่มเขียนทั้งหน้าถูกปิดพร้อมเหตุผลเรื่องสัญญา | Medium | Security |
| TC-CNR-200004 | ช่องคำอธิบายจำกัดความยาวที่ 256 ตัวอักษร | Low | Validation |
| TC-CNR-200005 | เว้นคำอธิบายว่างได้ ไม่ถือเป็นข้อผิดพลาด | Medium | Validation |
| TC-CNR-200006 | ข้อความ error ของช่องชื่อแสดงเป็น tooltip ว่า "Name is required" | Medium | Validation |

---

## TC-CNR-010006 — แสดงรายการเหตุผลพร้อมคอลัมน์มาตรฐาน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; หน้าจอขนาด desktop; มีเหตุผลใบลดหนี้อย่างน้อย 1 รายการใน BU
**Steps**
1. ไปที่ `/config/credit-note-reason`
2. รอให้ DataGrid โหลดเสร็จ
**Expected**
หัวหน้าแสดงชื่อ "Credit Note Reason" พร้อมคำอธิบาย "Why goods go back or money is claimed back — damaged, wrong item, overcharged."; ตารางแสดงคอลัมน์ `#`, Name, Description และคอลัมน์ปุ่มจัดการท้ายแถว — **ไม่มี**คอลัมน์ช่องเลือก (checkbox) และ **ไม่มี**คอลัมน์ Status; ค่าในคอลัมน์ Name เป็นปุ่มลิงก์ (ไม่ใช่ `<a href>`); แถบหัวมีปุ่ม Export, Print และ "Add Credit Note Reason"

---

## TC-CNR-010007 — แถบเครื่องมือไม่มีปุ่มตัวกรองเพราะโมดูลไม่ประกาศ filter field
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` บน desktop
**Steps**
1. สำรวจแถบเครื่องมือใต้หัวหน้า
2. สำรวจพื้นที่ใต้แถบเครื่องมือที่ปกติเป็นแถบ chip ตัวกรอง
**Expected**
ไม่มีปุ่ม "Filter" และไม่มีแถบ chip ตัวกรองใด ๆ ปรากฏ (โมดูลประกาศ filter field เป็น array ว่าง); ส่วนที่ยังต้องมีครบคือ ช่องค้นหา, ปุ่ม View (saved view), ปุ่ม Sort by, ปุ่ม Toggle columns และปุ่มสลับ List / Grid

---

## TC-CNR-010008 — ล้างคำค้นด้วยปุ่มกากบาทในช่องค้นหา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` และมีคำค้นค้างอยู่ในช่องค้นหาแล้ว (ตารางถูกกรองอยู่ และ URL มีพารามิเตอร์ `search`)
**Steps**
1. สังเกตไอคอนท้ายช่องค้นหาที่เปลี่ยนจากแว่นขยายเป็นกากบาทเมื่อมีข้อความอยู่
2. คลิกปุ่มกากบาท (`aria-label` = "Clear search")
**Expected**
ช่องค้นหาว่างทันที และระบบยิงค้นหาด้วยค่าว่างโดยไม่ต้องกด Enter ซ้ำ; ตารางกลับมาแสดงรายการทั้งหมด; พารามิเตอร์ `search` หลุดออกจาก URL และหน้ากลับไปที่หน้า 1

---

## TC-CNR-010009 — เรียงลำดับเริ่มต้นตามชื่อและสลับทิศจากเมนู Sort by
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` บน desktop โดยไม่มีพารามิเตอร์ `sort` ใน URL; มีเหตุผลอย่างน้อย 2 รายการที่ชื่อต่างกัน
**Steps**
1. สังเกตลำดับแถวในตาราง
2. เปิดเมนู Sort by (ปุ่มไอคอนลูกศรขึ้นลงในแถบเครื่องมือ)
3. เลือกรายการ "Name"
4. เลือกรายการ "Name" ซ้ำอีกครั้งในเมนูเดียวกัน
5. เลือกรายการ "Default"
**Expected**
ค่าเริ่มต้นเรียงชื่อจาก A→Z (`name:asc` มาจาก `defaultSort` ของหน้า); เมนูแสดงเฉพาะคอลัมน์ที่เรียงได้คือ Name, Description, Created, Updated พร้อมแถว "Default" ด้านบน; เลือก Name ครั้งแรกได้ `sort=name:asc` ครั้งที่สองสลับเป็น `name:desc` และไอคอนลูกศรบนแถวนั้นเปลี่ยนทิศ; เลือก "Default" ล้าง `sort` และ `page` ออกจาก URL แล้วกลับไปใช้ลำดับเริ่มต้นของหน้า

---

## TC-CNR-010010 — ซ่อน-แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` ในมุมมองตารางบน desktop
**Steps**
1. คลิกปุ่มเมนูคอลัมน์ (`aria-label` = "Toggle columns")
2. เปิดคอลัมน์ "Created" และ "Updated"
3. ปิดคอลัมน์ "Description"
**Expected**
เมนูมีหัวข้อ "Toggle Columns" และมีรายการ Name, Description, Created, Updated เท่านั้น; เริ่มต้น Created และ Updated ถูกติ๊กออกไว้ (ซ่อนตาม `columnVisibility` เริ่มต้นของโมดูล) เปิดแล้วทั้งสองคอลัมน์ปรากฏในตารางพร้อมวันที่ตามรูปแบบของ BU; ปิด Description แล้วคอลัมน์นั้นหายจากตารางโดยเมนูยังเปิดค้างอยู่

---

## TC-CNR-010011 — สลับมุมมองตาราง / การ์ด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` บน desktop; มีเหตุผลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่มมุมมองการ์ด (`aria-label` = "Grid view")
2. คลิกปุ่มมุมมองตาราง (`aria-label` = "List view") เพื่อกลับ
**Expected**
มุมมองสลับระหว่างการ์ดกับตารางได้; ในมุมมองการ์ด ปุ่มเมนูคอลัมน์ถูกซ่อนไป ส่วนช่องค้นหาและเมนู Sort by ยังอยู่; กลับมาที่มุมมองตารางแล้วเมนูคอลัมน์กลับมาและข้อมูลยังครบเท่าเดิม

---

## TC-CNR-010012 — การ์ดในมุมมอง grid แสดงข้อมูลครบและเปิด dialog แก้ไขได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` และสลับเป็นมุมมองการ์ดแล้ว; เหตุผลที่ตรวจมีคำอธิบายและมีข้อมูล audit (created/updated)
**Steps**
1. ดูการ์ดของเหตุผลใบแรก
2. คลิกที่หัวการ์ดเพื่อเปิดรายการนั้น
**Expected**
การ์ดแสดงชื่อเหตุผลเป็นหัวเรื่อง พร้อมแถวสถานะ (Active / Inactive — ข้อมูลชิ้นนี้ไม่มีในตาราง), แถวคำอธิบาย และแถว Created / By / Updated; คลิกหัวการ์ดแล้วเปิด dialog แก้ไขของรายการเดียวกันโดย URL ไม่เปลี่ยน

---

## TC-CNR-010013 — เปลี่ยนจำนวนแถวต่อหน้าและข้ามไปหน้าถัดไป
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` ในมุมมองตารางบน desktop; มีเหตุผลมากกว่า 5 รายการใน BU
**Steps**
1. สังเกตข้อความสรุปจำนวนและแถบเลขหน้าท้ายตาราง
2. เปลี่ยนจำนวนแถวต่อหน้าเป็น 5
3. ไปหน้าถัดไปด้วยปุ่มลูกศรขวา
**Expected**
ค่าเริ่มต้นคือ 10 แถวต่อหน้า และแถบ pagination มีตัวเลือก 5 / 10 / 25 / 50 / 100; เปลี่ยนเป็น 5 แล้วตารางเหลือ 5 แถวและ URL มี `perpage=5`; ไปหน้า 2 แล้ว URL มี `page=2`, ข้อความสรุปเลื่อนช่วงตาม และเลขในคอลัมน์ `#` เดินต่อจากหน้าก่อน (แถวแรกของหน้า 2 = 6)

---

## TC-CNR-010014 — บันทึกและเรียกใช้ saved view จากเมนู View
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; อยู่ที่หน้า `/config/credit-note-reason` บน desktop; ยังไม่มี saved view ของหน้านี้
**Steps**
1. ตั้งลำดับเป็น `name:desc` จากเมนู Sort by
2. เปิดเมนู View แล้วเลือก "Save current filters as view"
3. ตั้งชื่อ view แล้วเลือกขอบเขต "Only me" และกด Save
4. เลือก "No view" เพื่อกลับสู่ค่าเริ่มต้น แล้วเปิดเมนู View เลือก view ที่เพิ่งบันทึก
5. ลบ view นั้นทิ้งจากเมนู ⋯ ของแถว view (cleanup)
**Expected**
ก่อนบันทึก ปุ่ม View แสดงข้อความ "No view"; dialog บันทึกมีช่องชื่อและตัวเลือกขอบเขต "Only me" / "Everyone in this business unit"; บันทึกแล้วขึ้น toast `View "<ชื่อ>" saved` และปุ่ม View แสดงชื่อ view นั้น; เรียก view ซ้ำแล้วลำดับกลับเป็น `name:desc` (view ของหน้านี้เก็บได้เฉพาะ sort เพราะโมดูลไม่มี filter field); ลบแล้วขึ้น toast "View deleted" และปุ่มกลับเป็น "No view"

---

## TC-CNR-010015 — ส่งออกรายการเป็นไฟล์ XLSX
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` บน desktop; มีเหตุผลอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. คลิกปุ่ม "Export" ในแถบหัวหน้า
2. รอจนปุ่มกลับจากสถานะ "Exporting..."
**Expected**
เบราว์เซอร์ดาวน์โหลดไฟล์ชื่อ `creditNoteReason_<YYYY-MM-DD>.xlsx` ที่มีชีตชื่อ "Credit Note Reason" และคอลัมน์ Name / Description / Status (Status มาจาก `is_active` ทั้งที่ตารางบนหน้าจอไม่มีคอลัมน์นี้); แสดง toast `Exported <จำนวน> records` โดยจำนวนเท่ากับจำนวนแถวในหน้าปัจจุบันเท่านั้น ไม่ใช่ทั้ง BU

---

## TC-CNR-010016 — กดส่งออกขณะไม่มีข้อมูลในรายการ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` บน desktop และค้นหาด้วยคำที่ไม่มีผลลัพธ์จนไม่มีแถวเหลือ
**Steps**
1. คลิกปุ่ม "Export" ในแถบหัวหน้า
**Expected**
ไม่มีไฟล์ถูกดาวน์โหลด; แสดง toast เตือน "No data to export"; ปุ่มไม่ค้างอยู่ในสถานะ "Exporting..."

---

## TC-CNR-010017 — เปิด Activity ของแถวจากเมนู Row actions
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason` ในมุมมองตาราง; มีเหตุผลอย่างน้อย 1 รายการ
**Steps**
1. คลิกปุ่ม "Row actions" ท้ายแถวของเหตุผลหนึ่ง
2. เลือกรายการ "Activity"
**Expected**
เมนูมีรายการ Edit, Activity และ Delete (Delete เป็นแบบ destructive); เลือก Activity แล้ว activity sheet เปิดขึ้นโดยหัว sheet อ้างถึงชื่อของเหตุผลแถวนั้น และปิด sheet ได้โดยหน้า list ยังอยู่ที่เดิม (ดูหมายเหตุข้อ 7 — ไม่ต้อง assert ว่ามีรายการกิจกรรมอยู่ข้างใน)

---

## TC-CNR-030002 — สร้างเหตุผลพร้อมคำอธิบายแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; อยู่ที่หน้า `/config/credit-note-reason`
**Steps**
1. คลิกปุ่ม "Add Credit Note Reason"
2. กรอกชื่อที่ไม่ซ้ำ
3. กรอกข้อความลงในช่อง Description (`#cn-reason-description`)
4. คลิกปุ่ม "Create"
5. ค้นหาชื่อที่สร้างแล้วเปิดรายการนั้นซ้ำ
6. ลบรายการที่สร้าง (cleanup)
**Expected**
แสดง toast "Credit Note Reason created successfully" และ dialog ปิดเอง; คอลัมน์ Description ในตารางแสดงข้อความที่กรอก; เปิด dialog ของรายการนั้นซ้ำแล้วช่อง Description ยังมีค่าเดิม

---

## TC-CNR-030003 — ยกเลิกการสร้างแล้วเปิด dialog ใหม่ ฟอร์มถูกรีเซ็ต
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้า `/config/credit-note-reason`
**Steps**
1. คลิกปุ่ม "Add Credit Note Reason"
2. กรอกชื่อและคำอธิบายไว้แต่ยังไม่กด Create
3. คลิกปุ่ม "Cancel" ท้าย dialog
4. คลิกปุ่ม "Add Credit Note Reason" อีกครั้ง
**Expected**
dialog ปิดโดยไม่มี toast และไม่มีรายการใหม่เพิ่มในตาราง; เปิด dialog เพิ่มอีกครั้งแล้วทั้งช่องชื่อและช่องคำอธิบายว่างเปล่า พร้อม placeholder "e.g. Damaged Goods" และ "Optional" ตามลำดับ

---

## TC-CNR-030004 — ระหว่างบันทึก ปุ่มเปลี่ยนเป็น Creating... และ dialog ปิดไม่ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ใน dialog "Add Credit Note Reason" และกรอกชื่อที่ไม่ซ้ำไว้แล้ว; หน่วงการตอบกลับของ POST `/api/proxy/api/config/BLAVG/credit-note-reasons` เพื่อให้สังเกตสถานะระหว่างบันทึกได้
**Steps**
1. คลิกปุ่ม "Create"
2. ระหว่างที่คำขอยังไม่กลับ ลองคลิกปุ่ม "Cancel" และกด Escape
3. ปล่อยให้คำขอกลับมาสำเร็จ แล้วลบรายการที่สร้าง (cleanup)
**Expected**
ระหว่างบันทึก ปุ่ม submit เปลี่ยนข้อความเป็น "Creating..." และถูก disable; ปุ่ม Cancel ถูก disable และ Escape ปิด dialog ไม่ได้; เมื่อคำขอสำเร็จ dialog ปิดเองพร้อม toast "Credit Note Reason created successfully"

---

## TC-CNR-040005 — แก้ไขเฉพาะคำอธิบายแล้วค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; มีเหตุผลที่สร้างขึ้นเพื่อการทดสอบโดยเฉพาะอยู่แล้ว 1 รายการ (ห้ามใช้เรคคอร์ดจริงของ BU)
**Steps**
1. ค้นหาเหตุผลนั้นแล้วคลิกชื่อในตารางเพื่อเปิด dialog แก้ไข
2. แก้ค่าในช่อง Description เป็นข้อความใหม่โดยไม่แตะช่องชื่อ
3. คลิกปุ่ม "Save"
4. เปิด dialog ของรายการนั้นอีกครั้ง
5. ลบรายการ (cleanup)
**Expected**
แสดง toast "Credit Note Reason updated successfully" และ dialog ปิด; คอลัมน์ Description ในตารางแสดงข้อความใหม่ ส่วนชื่อไม่เปลี่ยน; เปิดซ้ำแล้วฟอร์มแสดงคำอธิบายที่แก้ไว้

---

## TC-CNR-040006 — dialog แก้ไขแสดงหัวข้อและเติมค่าเดิมครบทุกช่อง
**Priority:** Medium · **Test Type:** Happy Path
**Preconditions**
มีเหตุผลที่มีทั้งชื่อและคำอธิบายอยู่ในตารางอย่างน้อย 1 รายการ
**Steps**
1. คลิกชื่อของเหตุผลนั้นในคอลัมน์ Name
**Expected**
เปิด dialog โดย URL ไม่เปลี่ยน; หัวข้อ dialog คือ "Edit Credit Note Reason" (ไม่ใช่ "Add ..."); ช่อง Name (`#cn-reason-name`) และ Description (`#cn-reason-description`) ถูกเติมค่าเดิมของรายการนั้น; footer มีปุ่ม "Cancel" และ "Save"; **ไม่มี**สวิตช์สถานะในฟอร์ม (โมดูลนี้ไม่ให้แก้ `is_active` จาก UI)

---

## TC-CNR-040007 — ปิด dialog ด้วยปุ่ม Escape โดยไม่บันทึก
**Priority:** Low · **Test Type:** Alternate Flow
**Preconditions**
มีเหตุผลที่สร้างขึ้นเพื่อการทดสอบอยู่ 1 รายการ และเปิด dialog แก้ไขของรายการนั้นอยู่ (ยังไม่มีคำขอใดค้างอยู่)
**Steps**
1. แก้ช่องชื่อเป็นค่าใหม่
2. กดปุ่ม Escape
3. เปิด dialog ของรายการเดิมอีกครั้ง
4. ลบรายการ (cleanup)
**Expected**
dialog ปิดทันทีโดยไม่มี toast (dialog นี้ไม่มีปุ่มกากบาทมุมขวาบน — `showCloseButton` ถูกปิดไว้); ตารางยังแสดงชื่อเดิม; เปิดซ้ำแล้วช่องชื่อกลับมาเป็นค่าเดิม ไม่ใช่ค่าที่พิมพ์ค้างไว้

---

## TC-CNR-050003 — dialog ยืนยันลบแสดงหัวข้อและชื่อรายการที่จะลบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีเหตุผลที่สร้างขึ้นเพื่อการทดสอบโดยเฉพาะอยู่ 1 รายการ (ห้ามใช้เรคคอร์ดจริงของ BU — ดูหมายเหตุข้อ 6)
**Steps**
1. คลิกปุ่ม "Row actions" ท้ายแถวของเหตุผลนั้นแล้วเลือก "Delete"
2. อ่านหัวข้อและข้อความใน dialog ยืนยัน
3. คลิกปุ่ม "Delete" เพื่อยืนยัน
**Expected**
dialog ยืนยันมีหัวข้อ "Delete Credit Note Reason" และข้อความ `Are you sure you want to delete credit note reason "<ชื่อรายการ>"? This action cannot be undone.` โดยมีชื่อรายการจริงอยู่ในข้อความ; footer มีปุ่ม "Cancel" และปุ่ม "Delete" แบบ destructive; ยืนยันแล้วแสดง toast "Credit Note Reason deleted successfully" และแถวหายจากตาราง

---

## TC-CNR-050004 — ลบเหตุผลแล้ว dropdown ของ Credit Note ต้องไม่แสดงรายการนั้นอีก
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น admin@blueledgers.com; active BU = BLAVG; จำนวนเหตุผลทั้งหมดใน BU รวมรายการที่จะสร้างต้องไม่เกิน 30 รายการ (dropdown ดึงมาแค่ `perpage: 30`); ห้ามแตะเหตุผลเดิมของ BU ที่ Credit Note ที่มีอยู่อ้างถึง
**Steps**
1. ที่ `/config/credit-note-reason` สร้างเหตุผลใหม่เฉพาะกิจด้วยชื่อที่ไม่ซ้ำ
2. เปิดฟอร์ม Credit Note ใหม่ที่ `/procurement/credit-note` แล้วเปิด dropdown ช่อง Reason
3. กลับไปที่ `/config/credit-note-reason` แล้วลบเหตุผลที่เพิ่งสร้าง
4. เปิดฟอร์ม Credit Note ใหม่อีกครั้งแล้วเปิด dropdown ช่อง Reason
**Expected**
ขั้นที่ 2 dropdown มีรายการชื่อที่เพิ่งสร้าง; ขั้นที่ 4 รายการนั้นหายไปจาก dropdown ส่วนเหตุผลอื่นยังครบ; ช่อง Reason ของ Credit Note ยังเป็นฟิลด์บังคับและยังเลือกเหตุผลอื่นได้ตามปกติ

---

## TC-CNR-100005 — ไม่มีสิทธิ์สร้าง — ปุ่ม Add ถูกกั้นและเด้ง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ดูหน้านี้ได้แต่ไม่มีสิทธิ์ `configuration.create` และไม่ใช่ admin; สัญญายังไม่หมดอายุ (มีสิทธิ์เขียนในระดับ license)
**Steps**
1. ไปที่ `/config/credit-note-reason`
2. สังเกตสภาพปุ่ม "Add Credit Note Reason"
3. คลิกปุ่มนั้น
**Expected**
ปุ่ม Add แสดงแบบจางและมี `aria-disabled`; คลิกแล้วไม่เปิด dialog เพิ่มรายการ แต่เด้ง dialog หัวข้อ "Permission Denied" พร้อมข้อความ "You don't have permission to perform this action." และบรรทัด "Contact your administrator to request access."

---

## TC-CNR-100006 — ไม่มีสิทธิ์แก้ไข — dialog เปิดแบบอ่านอย่างเดียว
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีที่ดูหน้านี้ได้แต่ไม่มีสิทธิ์ `configuration.update` และไม่ใช่ admin; มีเหตุผลอย่างน้อย 1 รายการในตาราง
**Steps**
1. ไปที่ `/config/credit-note-reason`
2. คลิกชื่อของเหตุผลหนึ่งเพื่อเปิด dialog
**Expected**
dialog เปิดขึ้นโดยช่อง Name และ Description ถูก disable ทั้งคู่; footer **ไม่มี**ปุ่ม Save และปุ่มเดียวที่เหลือมีข้อความว่า "Close" (ไม่ใช่ "Cancel")

---

## TC-CNR-100007 — ไม่มีสิทธิ์ลบ — เมนู Delete ของแถวเด้ง Permission Denied
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ดูหน้านี้ได้แต่ไม่มีสิทธิ์ `configuration.delete` และไม่ใช่ admin; สัญญายังไม่หมดอายุ; มีเหตุผลอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/config/credit-note-reason`
2. คลิกปุ่ม "Row actions" ท้ายแถวแล้วสังเกตรายการ "Delete"
3. คลิกรายการ "Delete"
**Expected**
รายการ Delete แสดงแบบจางและมี `aria-disabled`; คลิกแล้ว **ไม่เปิด** dialog ยืนยันลบ แต่เด้ง dialog "Permission Denied" แทน; ไม่มีรายการใดถูกลบ

---

## TC-CNR-100008 — สัญญาหมดอายุ — ปุ่มเขียนทั้งหน้าถูกปิดพร้อมเหตุผลเรื่องสัญญา
**Priority:** Medium · **Test Type:** Security
**Preconditions**
Login ด้วยบัญชีใน BU ที่สัญญาหมดอายุหรือถูกระงับ (สถานะที่ทำให้สิทธิ์เขียนของทั้งแอปถูกปิด) — สถานะนี้มีผลเหนือสิทธิ์ RBAC และไม่มี admin bypass
**Steps**
1. ไปที่ `/config/credit-note-reason`
2. คลิกปุ่ม "Add Credit Note Reason"
3. เปิดเมนู "Row actions" ของแถวหนึ่งแล้วชี้ที่รายการ Edit และ Delete
**Expected**
ปุ่ม Add จางและคลิกแล้วเด้ง dialog หัวข้อ "Subscription Expired" พร้อมข้อความเรื่องการต่ออายุ (ไม่ใช่ "Permission Denied" ที่บอกให้ติดต่อผู้ดูแลเพื่อขอสิทธิ์); รายการ Edit และ Delete ในเมนูแถวถูก disable จริง (คลิกไม่ได้ ไม่เด้ง dialog) และมี tooltip/`title` อธิบายว่าสัญญาหมดอายุหรือไม่ทำงาน; หน้ายังอ่านข้อมูลได้ตามปกติ

---

## TC-CNR-200004 — ช่องคำอธิบายจำกัดความยาวที่ 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Credit Note Reason"
**Steps**
1. วางข้อความยาวเกิน 256 ตัวอักษรลงในช่อง Description
2. อ่านค่าที่อยู่ในช่องหลังวาง
3. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
ช่อง Description รับได้ไม่เกิน 256 ตัวอักษร ส่วนที่เกินไม่ถูกรับเข้าช่อง (`maxLength` ของ textarea); ไม่มีข้อความ error ปรากฏ เพราะเป็นการตัดที่ระดับ input ไม่ใช่ validation

---

## TC-CNR-200005 — เว้นคำอธิบายว่างได้ ไม่ถือเป็นข้อผิดพลาด
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Credit Note Reason" และกรอกชื่อที่ไม่ซ้ำไว้แล้ว
**Steps**
1. ปล่อยช่อง Description ว่างไว้ (placeholder แสดงคำว่า "Optional")
2. คลิกปุ่ม "Create"
3. เปิดรายการที่สร้างขึ้นซ้ำ
4. ลบรายการ (cleanup)
**Expected**
ไม่มี error ที่ช่อง Description และ label ของช่องนี้ไม่มีเครื่องหมายบังคับ (ต่างจาก Name); สร้างสำเร็จพร้อม toast "Credit Note Reason created successfully"; คอลัมน์ Description ของแถวนั้นว่าง และเปิดซ้ำแล้วช่องคำอธิบายยังว่าง

---

## TC-CNR-200006 — ข้อความ error ของช่องชื่อแสดงเป็น tooltip ว่า "Name is required"
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ใน dialog "Add Credit Note Reason" โดยยังไม่กรอกอะไรเลย
**Steps**
1. คลิกปุ่ม "Create" โดยเว้นช่อง Name ว่าง
2. เลื่อนเมาส์ไปชี้ (hover) ที่ช่อง Name
3. ปิด dialog ด้วยปุ่ม Cancel
**Expected**
ช่อง Name ได้ `aria-invalid="true"` และมีไอคอนเตือนอยู่ในช่อง แต่ **ไม่มี**ข้อความ error เป็นบรรทัดใต้ช่อง; hover แล้ว tooltip แสดงข้อความ "Name is required"; dialog ไม่ปิดและไม่มีรายการถูกสร้าง
