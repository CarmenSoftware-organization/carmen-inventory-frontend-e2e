# Notification Template — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/notification-template`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Notification Template
**Frontend route:** `routes/system-admin/notification-template`  •  **URL:** `/system-admin/notification-template` (และ `/system-admin/notification-template/new`, `/system-admin/notification-template/:id`)
**Prefix:** `NTPL`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 40

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> - **โมดูลนี้เหลือช่องทางเดียวคือ "แอป"** — commit `541690f5` ถอดช่อง Channel ออกจากฟอร์มทั้งหมด `noti-tmpl.tsx` ตรึง `filter: "type:app"` ไว้ที่ระดับ query (ค่าคงที่ `APP_CHANNEL_ONLY`) ทับ filter ที่มาจาก URL ดังนั้น list ไม่เคยแสดงเทมเพลตของ email/line/sms และ **ไม่มีคอลัมน์ Channel** อีกแล้ว เคสเดิม TC-NTPL-030002 (เลือก channel จาก dropdown 4 ค่า) ถูกลบทั้งบล็อกเพราะไม่มี UI นั้นอยู่จริง
> - เทมเพลตของ email/line/sms **ยังอยู่ใน DB** (คอมเมนต์ในโค้ดระบุว่าเหลือ 60 รายการจาก seed เก่า) `notificationTemplateSchema` จึงยังรับ `type` ครบสี่ค่า และ `mapToPayload` ส่ง `type` เดิมกลับไปไม่แปลงเป็น `app` เงียบ ๆ — เปิดเทมเพลตเก่าผ่าน URL ตรงจึงไม่ติด validation แคตตาล็อกนี้ไม่มีเคสสำหรับเส้นทางนั้น เพราะ list ไม่มีทางพาไปถึง (ต้องรู้ UUID ล่วงหน้า)
> - **ไม่มีช่อง Subject ในฟอร์มแล้ว** และคอลัมน์ที่สองของตารางเปลี่ยนจาก Subject เป็น **Message** (แสดง `body`) เคสเดิม TC-NTPL-200004 (subject maxLength 200) จึงถูกลบ ส่วน TC-NTPL-030004 ถูกเขียนใหม่ให้เหลือเฉพาะ description
> - **ของใหม่ที่เพิ่มเข้ามาและยังไม่มีเคสครอบมาก่อน**: แถบชิปแทรกตัวแปร (`{{docNo}}`, `{{actorName}}`, `{{recipientName}}`, `{{url}}`, `{{currentStage}}`, `{{department}}`, `{{totalAmount}}`, `{{reason}}` — 8 ปุ่ม เรียงตามความถี่ที่ใช้จริง) และการ์ดพรีวิวการแจ้งเตือนที่เติมค่าตัวอย่างให้ตัวแปรที่รู้จัก พร้อมเตือนตัวแปรที่ไม่รู้จักด้วยสีแดง
> - **ข้อความ error ของช่อง Name ไม่ใช่ข้อความใต้ช่อง** — `FieldInput` รับ `error` แล้วเรนเดอร์เป็นไอคอน `CircleAlert` ในช่อง + tooltip ส่วนช่อง Body ใช้ `FieldError` ซึ่งเป็นข้อความใต้ช่องจริง เคสเดิม TC-NTPL-200001 ระบุว่าเป็นข้อความใต้ช่อง ซึ่งตรงข้ามกับโค้ดปัจจุบัน จึงถูกแก้
> - **ตาราง list ไม่มีคอลัมน์ row actions** — `useNotiTmplTable` ส่ง `activity` ให้ `useConfigTable` แต่ไม่ส่ง `onDelete` และ `actionColumn` ถูกเพิ่มก็ต่อเมื่อมี `onDelete` ดังนั้นเมนูสามจุดท้ายแถว (รวมเมนู Activity ในแถว) ไม่ปรากฏ ปุ่ม Activity มีเฉพาะในหน้า detail และปุ่ม Delete มีเฉพาะในหน้า detail โหมด edit
> - **ความยาวสูงสุดของช่องกรอก**: Name = 100, Description = 256, Body = **259** (ไม่ใช่เลขกลม — เป็นค่าที่อยู่ในโค้ดจริง) `Textarea` ที่มี `maxLength` จะแสดงตัวนับ `n/max` มุมขวาล่างเสมอ
> - **ความสัมพันธ์กับ `system-admin/email-template`**: ไม่มีการอ้างถึงกันในโค้ดเลย — คนละ route (`/system-admin/email-template` เป็น dialog ไม่มี `/new` หรือ `/:id`), คนละ endpoint (`config/{bu}/notification-templates` กับของ email-template), คนละชนิดข้อมูล แคตตาล็อกของโมดูลนั้นคือ `1117-email-template.md` เคสในไฟล์นี้อ้างอิงโค้ดของ notification-template เท่านั้น
> - ปุ่ม Back (ChevronLeft) **กลับหน้า list เสมอ ไม่ใช่ถอย history** (commit `77002718`) และมี guard สองชั้น: `useDiscardConfirm` ดักปุ่มในฟอร์มเอง ส่วน `useNavigationGuard` ดักลิงก์ภายนอกฟอร์ม เช่น เมนู sidebar (commit `dfbbfc9a`)
> - สิทธิ์เข้าหน้า: `RouteGuard` ใน `root-layout.tsx` หา leaf ที่ยาวที่สุดที่ตรงกับ pathname (`findRouteLeaf` แมตช์ทั้ง prefix) โมดูลนี้ประกาศ `permission: system_configuration.view` และ `licenseFeature: "configuration.notification_template"` — จึงบล็อกทั้ง `/new` และ `/:id` ด้วยกติกาเดียวกัน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-NTPL-010001 | หน้า list โหลดสำเร็จ | High | Smoke |
| TC-NTPL-010002 | ปุ่ม Add แสดงและลิงก์ไป /new | High | Smoke |
| TC-NTPL-010003 | คอลัมน์ตาราง (#, Name, Message, สถานะ) แสดงครบ | Medium | Functional |
| TC-NTPL-010004 | ค้นหาด้วยชื่อ template โดยกด Enter ใช้งานได้ | Medium | Functional |
| TC-NTPL-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-NTPL-010006 | badge จำนวนรวมข้างหัวข้อตรงกับ total records | Low | Functional |
| TC-NTPL-010007 | คอลัมน์ Message ย้อม `{{ตัวแปร}}` ให้จางและตัดเหลือบรรทัดเดียว | Low | Functional |
| TC-NTPL-010008 | คลิกหัวคอลัมน์ Name สลับทิศการเรียงและเขียนลง URL | Medium | Functional |
| TC-NTPL-010009 | คำค้นถูกเก็บใน URL และยังกรองอยู่หลังรีโหลด | Medium | Functional |
| TC-NTPL-020001 | คลิกชื่อ template เปิดหน้า detail (view mode) | High | Smoke |
| TC-NTPL-020002 | detail แสดง badge สถานะ Active/Inactive ถูกต้อง | Medium | Functional |
| TC-NTPL-020003 | ฟิลด์ใน view mode เป็น read-only และชิปตัวแปรถูกซ่อน | Medium | Functional |
| TC-NTPL-020004 | ปุ่ม Activity แสดงในหน้า detail และเปิดแผง Activity ได้ | Medium | Functional |
| TC-NTPL-020005 | การ์ดพรีวิวแสดงชื่อและข้อความที่เติมค่าตัวอย่างให้ตัวแปรที่รู้จัก | High | Functional |
| TC-NTPL-020006 | เปิด detail ด้วย id ที่ไม่มีอยู่จริงแสดง error state ไม่ใช่ฟอร์มเปล่า | Medium | Functional |
| TC-NTPL-020007 | กด Back ในโหมด view กลับหน้า list ทันทีโดยไม่ถาม | Medium | Functional |
| TC-NTPL-030001 | เปิดหน้า new form สำเร็จและมีองค์ประกอบครบ | High | Smoke |
| TC-NTPL-030003 | สร้าง template ขั้นต่ำ (name + body) สำเร็จ | High | CRUD |
| TC-NTPL-030004 | สร้าง template พร้อม description สำเร็จ | High | CRUD |
| TC-NTPL-030005 | toggle สถานะ active ตอนสร้างได้ | Medium | Functional |
| TC-NTPL-030006 | กดชิปตัวแปรแทรก token ลง Body ตรงตำแหน่งเคอร์เซอร์ | High | Functional |
| TC-NTPL-030007 | ตัวแปรที่ไม่รู้จักใน Body ถูกเน้นในพรีวิวพร้อมคำเตือน | Medium | Functional |
| TC-NTPL-030008 | กด Cancel ที่หน้า new ขณะฟอร์ม dirty ต้องถามก่อนออก | Medium | Functional |
| TC-NTPL-040001 | แก้ name ของ template แล้ว save สำเร็จ | High | CRUD |
| TC-NTPL-040002 | แก้ body ของ template แล้ว persist | High | CRUD |
| TC-NTPL-040003 | กด Cancel ใน edit mode กลับสู่ view และค่าถูกคืนบนหน้าจอ | Medium | Functional |
| TC-NTPL-040004 | แก้ไขแล้วกด Back ขณะ dirty ต้องเตือน discard | Medium | Functional |
| TC-NTPL-040005 | กดลิงก์นอกฟอร์มขณะ dirty ต้องถูก navigation guard ดัก | High | Functional |
| TC-NTPL-040006 | กด Back ใน edit mode ที่ยังไม่แก้อะไร ออกได้ทันทีโดยไม่ถาม | Low | Functional |
| TC-NTPL-050001 | เปิด delete dialog แล้ว cancel — template ยังอยู่ | Medium | Functional |
| TC-NTPL-050002 | ลบ template สำเร็จ (cleanup) | High | CRUD |
| TC-NTPL-050003 | delete dialog แสดงชื่อ template ในข้อความยืนยัน | Low | Functional |
| TC-NTPL-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง list ต้องเห็นกล่อง Permission Denied | High | Authorization |
| TC-NTPL-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-NTPL-100003 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด /new และ /:id ตรง ๆ ก็ถูกบล็อกเช่นกัน | High | Authorization |
| TC-NTPL-200001 | บันทึกโดยไม่กรอก name ต้องแสดง error ที่ช่อง name | High | Validation |
| TC-NTPL-200002 | บันทึกโดยไม่กรอก body ต้องแสดง error ใต้ช่อง body | High | Validation |
| TC-NTPL-200003 | name รับได้ไม่เกิน 100 ตัวอักษร | Medium | Validation |
| TC-NTPL-200005 | body รับได้ไม่เกิน 259 ตัวอักษรและมีตัวนับอักษร | Medium | Validation |
| TC-NTPL-200006 | description รับได้ไม่เกิน 256 ตัวอักษรและมีตัวนับอักษร | Low | Validation |

---
## TC-NTPL-010001 — หน้า list โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (admin@blueledgers.com) active BU = BLAVG และมีสิทธิ์ `system_configuration.view`
**Steps**
1. ไปที่ `/system-admin/notification-template`
**Expected**
URL ตรงกับ `/system-admin/notification-template`; หัวข้อหน้า "Notification Template" พร้อมคำอธิบาย "The wording of the in-app alerts sent when a document moves along." และตาราง DataGrid แสดงภายใน 10 วินาที

---
## TC-NTPL-010002 — ปุ่ม Add แสดงและลิงก์ไป /new
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. คลิกปุ่ม "Add Notification Template"
**Expected**
ปุ่ม (ไอคอน Plus + ข้อความ "Add Notification Template") visible และเมื่อคลิกนำทางไปยัง `/system-admin/notification-template/new`

---
## TC-NTPL-010003 — คอลัมน์ตาราง (#, Name, Message, สถานะ) แสดงครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. ตรวจหัวคอลัมน์และเนื้อแถวแรกของตาราง
**Expected**
ตารางมีคอลัมน์ checkbox เลือกแถว, `#` (ลำดับ), "Name" (ลิงก์สี primary ไปหน้า detail), "Message" (ข้อความจาก body แสดง "—" เมื่อว่าง) และคอลัมน์สถานะที่แสดง badge Active/Inactive; **ไม่มีคอลัมน์ Channel, ไม่มีคอลัมน์ Subject และไม่มีเมนูสามจุดท้ายแถว**

---
## TC-NTPL-010004 — ค้นหาด้วยชื่อ template โดยกด Enter ใช้งานได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปที่รู้ชื่อแน่นอนอยู่ใน list
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. พิมพ์ชื่อ template ในช่องค้นหา
3. กด Enter
**Expected**
ตารางกรองแสดงเฉพาะ template ที่ตรงกับคำค้นภายใน 10 วินาที และ URL มี query `search=<คำค้น>` (ช่องค้นหายิงค้นหาเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น ไม่ยิงระหว่างพิมพ์)

---
## TC-NTPL-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. พิมพ์คำสุ่มที่ไม่มีในระบบ (เช่น `__NOPE__`) แล้วกด Enter
**Expected**
ตารางไม่มีแถวข้อมูล และแสดง empty state (ภาพโฟลเดอร์ + ข้อความ "No data found") ภายใน 10 วินาที

---
## TC-NTPL-010006 — badge จำนวนรวมข้างหัวข้อตรงกับ total records
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. อ่านค่า badge ถัดจากหัวข้อ "Notification Template"
**Expected**
badge (variant secondary, ตัวเลข tabular) แสดงจำนวนรวมที่ backend รายงานในรูปแบบ locale เช่น `1,234`; badge ถูกซ่อนทั้งอันเมื่อจำนวนเป็น 0

---
## TC-NTPL-010007 — คอลัมน์ Message ย้อม `{{ตัวแปร}}` ให้จางและตัดเหลือบรรทัดเดียว
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่ body มีตัวแปรรูปแบบ `{{docNo}}` อยู่ในข้อความ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. ดูค่าในคอลัมน์ Message ของแถวนั้น
**Expected**
ข้อความในคอลัมน์ Message ถูกตัดเหลือบรรทัดเดียว (line-clamp) และส่วนที่เป็น `{{...}}` แสดงด้วยฟอนต์ monospace สีจางกว่าข้อความปกติ ส่วนถ้อยคำจริงยังอ่านได้ชัด

---
## TC-NTPL-010008 — คลิกหัวคอลัมน์ Name สลับทิศการเรียงและเขียนลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปมากกว่า 1 รายการ (การเรียงเริ่มต้นของหน้านี้คือ `name:asc`)
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. คลิกหัวคอลัมน์ "Name"
3. คลิกหัวคอลัมน์ "Name" ซ้ำ
**Expected**
URL มี query `sort=name:desc` หลังคลิกครั้งแรก และกลับเป็น `sort=name:asc` หลังคลิกซ้ำ; ลำดับแถวในตารางเปลี่ยนตาม (หน้านี้ไม่มีสถานะ "ไม่เรียง" เพราะมี default sort)

---
## TC-NTPL-010009 — คำค้นถูกเก็บใน URL และยังกรองอยู่หลังรีโหลด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปที่รู้ชื่อแน่นอน
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. ค้นหาด้วยชื่อ template แล้วกด Enter
3. รีโหลดหน้า (F5)
**Expected**
หลังรีโหลด URL ยังมี `search=<คำค้น>`, ช่องค้นหายังมีคำค้นเดิมอยู่ และตารางยังแสดงผลลัพธ์ที่กรองแล้วชุดเดิม

---
## TC-NTPL-020001 — คลิกชื่อ template เปิดหน้า detail (view mode)
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ช่องทางแอปอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/notification-template`
2. คลิกลิงก์ชื่อ template ในคอลัมน์ Name
**Expected**
นำทางไปยัง `/system-admin/notification-template/{uuid}`; หัวหน้าเป็นชื่อ template (หรือ "Untitled Template" เมื่อชื่อว่าง) พร้อมปุ่ม "Edit" และ "Activity"; ไม่มีปุ่ม Save/Cancel/Delete ในโหมดนี้

---
## TC-NTPL-020002 — detail แสดง badge สถานะ Active/Inactive ถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; รู้ค่า is_active ของ template ที่จะเปิด
**Steps**
1. เปิดหน้า detail ของ template
2. อ่าน badge ที่อยู่ถัดจากชื่อในหัวหน้า
**Expected**
badge แสดงข้อความ "ACTIVE" (variant success-light) เมื่อ is_active = true หรือ "INACTIVE" (variant warning-light) เมื่อ is_active = false; badge นี้ไม่ปรากฏในหน้า `/new`

---
## TC-NTPL-020003 — ฟิลด์ใน view mode เป็น read-only และชิปตัวแปรถูกซ่อน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า detail โหมด view (ยังไม่กด Edit)
**Steps**
1. เปิดหน้า detail ของ template
2. พยายามแก้ไขค่าในช่อง Name, Description และ Body
3. ดูใต้ช่อง Body
**Expected**
ช่อง Name, Description, Body และสวิตช์สถานะอยู่ในสถานะ disabled แก้ไม่ได้; แถบชิปแทรกตัวแปร (ป้าย "Insert:") ไม่แสดงเลยในโหมดนี้; การ์ดพรีวิวยังแสดงอยู่

---
## TC-NTPL-020004 — ปุ่ม Activity แสดงในหน้า detail และเปิดแผง Activity ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า detail ของ template ที่มีอยู่จริง
**Steps**
1. เปิดหน้า detail ของ template
2. คลิกปุ่ม "Activity" (ไอคอน History)
**Expected**
ปุ่ม Activity แสดงอยู่ทั้งโหมด view และ edit (อยู่นอกเงื่อนไขสลับโหมด) และเมื่อคลิกจะเปิดแผง Activity ของเรคคอร์ดนั้นขึ้นมา โดย URL ไม่เปลี่ยน; ปุ่มนี้ไม่ปรากฏในหน้า `/new`

---
## TC-NTPL-020005 — การ์ดพรีวิวแสดงชื่อและข้อความที่เติมค่าตัวอย่างให้ตัวแปรที่รู้จัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิด template ที่ body มี `{{docNo}}` อยู่ในข้อความ
**Steps**
1. เปิดหน้า detail ของ template
2. ดูบล็อกขวาของ section "Message content"
**Expected**
มีหัวข้อเล็ก "Preview" พร้อมไอคอนกระดิ่ง และการ์ดแจ้งเตือนที่แสดงชื่อ template เป็นหัวการ์ด, ป้ายเวลา "now" และเนื้อข้อความที่แทน `{{docNo}}` ด้วยค่าตัวอย่าง `PR-2026-000412` (ตัวอักษรเข้มกว่าข้อความคงที่ เพื่อบอกว่าเป็นค่าที่เติมเข้ามา)

---
## TC-NTPL-020006 — เปิด detail ด้วย id ที่ไม่มีอยู่จริงแสดง error state ไม่ใช่ฟอร์มเปล่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin
**Steps**
1. เปิด URL `/system-admin/notification-template/00000000-0000-0000-0000-000000000000` โดยตรง
**Expected**
หน้าแสดง error state ที่มีข้อความบอกสาเหตุและทางออกให้ผู้ใช้ (ปุ่มลองใหม่/กลับ) ไม่แสดงฟอร์มเปล่าหรือหน้าขาว และไม่มีปุ่ม Save/Delete

---
## TC-NTPL-020007 — กด Back ในโหมด view กลับหน้า list ทันทีโดยไม่ถาม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิดหน้า detail จาก URL ตรง (ไม่ได้เดินมาจากหน้า list)
**Steps**
1. เปิด URL `/system-admin/notification-template/{uuid}` โดยตรง
2. คลิกปุ่มย้อนกลับ (ChevronLeft, aria-label "Go back")
**Expected**
นำทางไปยัง `/system-admin/notification-template` ทันที ไม่มี dialog ถามยืนยัน (ปุ่ม Back ผูกกับ list path เสมอ ไม่ใช่ history back)

---
## TC-NTPL-030001 — เปิดหน้า new form สำเร็จและมีองค์ประกอบครบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีสิทธิ์เข้าโมดูล System Admin
**Steps**
1. ไปที่ `/system-admin/notification-template/new`
2. ตรวจองค์ประกอบของฟอร์ม
**Expected**
URL ลงท้ายด้วย `/new`; หัวหน้าเป็น "Add Notification Template" ไม่มี badge สถานะและไม่มีปุ่ม Activity; มี section "General" (ช่อง Name บังคับกรอก, ช่อง Description, สวิตช์ "Active") และ section "Message content" (ช่อง Body บังคับกรอก + แถบชิป "Insert:" + การ์ดพรีวิว); ปุ่มมุมขวาคือ "Cancel" และ "Create"; **ไม่มีช่อง Channel และไม่มีช่อง Subject**

---
## TC-NTPL-030003 — สร้าง template ขั้นต่ำ (name + body) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; ชื่อ template ที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. กรอก Name
3. กรอก Body
4. กด "Create"
**Expected**
แสดง toast "Notification Template created successfully" และนำทางกลับไปที่ `/system-admin/notification-template`; ค้นหาชื่อที่เพิ่งสร้างแล้วพบในตาราง (เรคคอร์ดใหม่ถูกสร้างเป็นช่องทางแอปโดยอัตโนมัติ ฟอร์มไม่มีให้เลือก)

---
## TC-NTPL-030004 — สร้าง template พร้อม description สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; ชื่อ template ที่จะใช้ยังไม่มีใน DB
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. กรอก Name, Description และ Body
3. กด "Create"
**Expected**
แสดง toast สร้างสำเร็จและกลับหน้า list; เปิด detail ของ template ที่เพิ่งสร้างแล้วช่อง Description มีค่าตรงกับที่กรอก

---
## TC-NTPL-030005 — toggle สถานะ active ตอนสร้างได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new` (ค่าเริ่มต้นของสวิตช์คือเปิด/active)
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. คลิกสวิตช์ "Active" ให้เป็นปิด
3. กรอก Name และ Body แล้วกด "Create"
4. เปิด detail ของ template ที่เพิ่งสร้าง
**Expected**
template ถูกสร้างด้วยสถานะ inactive; badge ข้างชื่อในหน้า detail แสดง "INACTIVE" และคอลัมน์สถานะในตารางแสดง Inactive (กล่องสวิตช์ไม่มี badge ซ้ำในตัวมันเอง เพราะตั้ง `hideBadge`)

---
## TC-NTPL-030006 — กดชิปตัวแปรแทรก token ลง Body ตรงตำแหน่งเคอร์เซอร์
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. พิมพ์ข้อความลงช่อง Body แล้ววางเคอร์เซอร์ไว้ท้ายข้อความ
3. คลิกชิป `{{docNo}}` ในแถบ "Insert:"
**Expected**
ข้อความ `{{docNo}}` ถูกแทรกลงช่อง Body ที่ตำแหน่งเคอร์เซอร์, โฟกัสกลับไปที่ช่อง Body, ตัวนับอักษรมุมขวาล่างของช่องขยับตามความยาวใหม่ทันที และการ์ดพรีวิวอัปเดตเป็นค่าตัวอย่างของตัวแปรนั้น; แถบชิปมี 8 ปุ่มเรียงลำดับ `{{docNo}}`, `{{actorName}}`, `{{recipientName}}`, `{{url}}`, `{{currentStage}}`, `{{department}}`, `{{totalAmount}}`, `{{reason}}`

---
## TC-NTPL-030007 — ตัวแปรที่ไม่รู้จักใน Body ถูกเน้นในพรีวิวพร้อมคำเตือน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. พิมพ์ลงช่อง Body ว่า `Hello {{nope}}`
3. ดูการ์ดพรีวิวทางขวา
**Expected**
ในพรีวิว ข้อความ `{{nope}}` แสดงเป็น monospace สี destructive บนพื้นแดงจาง (ไม่ถูกแทนค่า) และใต้การ์ดขึ้นบรรทัดเตือนพร้อมไอคอนสามเหลี่ยม "No value is supplied for these — recipients will see them as-is:" ตามด้วยรายชื่อตัวแปรที่ไม่รู้จัก

---
## TC-NTPL-030008 — กด Cancel ที่หน้า new ขณะฟอร์ม dirty ต้องถามก่อนออก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new` และกรอกค่าลงไปแล้วอย่างน้อยหนึ่งช่อง
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. กรอก Name
3. กดปุ่ม "Cancel"
4. กด "Discard" ใน dialog
**Expected**
ขึ้น dialog (variant warning) หัวข้อ "Discard changes?" ข้อความ "You have unsaved changes that will be lost." พร้อมปุ่ม "Keep editing" และ "Discard"; เมื่อยืนยัน Discard จะกลับไปที่ `/system-admin/notification-template` และไม่มีเรคคอร์ดใหม่ถูกสร้าง

---
## TC-NTPL-040001 — แก้ name ของ template แล้ว save สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่สร้างไว้สำหรับชุดทดสอบ
**Steps**
1. เปิด detail ของ template
2. กด "Edit"
3. แก้ค่าช่อง Name
4. กด "Save"
**Expected**
แสดง toast "Notification Template updated successfully" และนำทางกลับไปที่ `/system-admin/notification-template`; ชื่อใหม่ปรากฏในตาราง (payload ของการอัปเดตแนบ `doc_version` ของเรคคอร์ดที่โหลดมาไปด้วยตามกติกา optimistic concurrency ของ backend)

---
## TC-NTPL-040002 — แก้ body ของ template แล้ว persist
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่สร้างไว้สำหรับชุดทดสอบ
**Steps**
1. เปิด detail ของ template แล้วกด "Edit"
2. แก้ค่าช่อง Body
3. กด "Save"
4. เปิด detail ของ template เดิมอีกครั้ง
**Expected**
ค่า Body ใหม่ถูกบันทึกและแสดงเมื่อเปิด detail ครั้งถัดไป; คอลัมน์ Message ในตารางแสดงข้อความใหม่ด้วย

---
## TC-NTPL-040003 — กด Cancel ใน edit mode กลับสู่ view และค่าถูกคืนบนหน้าจอ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่สร้างไว้สำหรับชุดทดสอบ
**Steps**
1. เปิด detail ของ template แล้วกด "Edit"
2. แก้ค่าช่อง Name และ Body
3. กด "Cancel"
4. กด "Discard" ใน dialog ที่ขึ้นมา
**Expected**
ฟอร์มกลับสู่โหมด view (ปุ่มกลับเป็น "Edit"); **ค่าที่แสดงในช่อง Name และ Body บนหน้าจอถูกเขียนกลับเป็นค่าเดิม** ไม่ใช่ค่าที่เพิ่งพิมพ์ไป และการ์ดพรีวิวกลับไปตามค่าเดิม; ไม่มีการเรียกบันทึกไปที่ backend

---
## TC-NTPL-040004 — แก้ไขแล้วกด Back ขณะ dirty ต้องเตือน discard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่ detail โหมด edit และแก้ค่าไปแล้ว (ฟอร์ม dirty)
**Steps**
1. เปิด detail แล้วกด "Edit"
2. แก้ค่าช่อง Body
3. กดปุ่มย้อนกลับ (ChevronLeft)
4. กด "Discard"
**Expected**
ขึ้น dialog "Discard changes?" (variant warning) ก่อนออกจากหน้า; เมื่อยืนยันจะไปที่ `/system-admin/notification-template` (ไม่ใช่ถอย history หนึ่งก้าว) และค่าที่แก้ไม่ถูกบันทึก

---
## TC-NTPL-040005 — กดลิงก์นอกฟอร์มขณะ dirty ต้องถูก navigation guard ดัก
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่ detail โหมด edit และแก้ค่าไปแล้ว (ฟอร์ม dirty)
**Steps**
1. เปิด detail แล้วกด "Edit"
2. แก้ค่าช่อง Name
3. คลิกลิงก์เมนูใน sidebar ที่พาไปหน้าอื่นภายในแอป
**Expected**
การนำทางถูกขัดจังหวะและขึ้น DiscardDialog (variant warning) ถามยืนยันก่อน; กด "Keep editing" แล้วยังอยู่ที่หน้าเดิมพร้อมค่าที่แก้ไว้ กด "Discard" แล้วจึงไปยังหน้าปลายทางที่คลิก

---
## TC-NTPL-040006 — กด Back ใน edit mode ที่ยังไม่แก้อะไร ออกได้ทันทีโดยไม่ถาม
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่ detail ของ template
**Steps**
1. เปิด detail แล้วกด "Edit"
2. ไม่แก้ค่าใด ๆ
3. กดปุ่มย้อนกลับ (ChevronLeft)
**Expected**
ไม่มี dialog ขึ้นมา และนำทางกลับไปที่ `/system-admin/notification-template` ทันที (guard ทำงานเฉพาะเมื่อฟอร์ม dirty)

---
## TC-NTPL-050001 — เปิด delete dialog แล้ว cancel — template ยังอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่สร้างไว้สำหรับชุดทดสอบ
**Steps**
1. เปิด detail ของ template และกด "Edit" (ปุ่ม Delete แสดงเฉพาะในโหมด edit ของเรคคอร์ดที่มีอยู่จริง)
2. กดปุ่ม "Delete"
3. กด "Cancel" ใน dialog
**Expected**
Dialog ปิดลงโดยไม่ลบอะไร; template ยังเปิด detail ได้และยังอยู่ในตาราง

---
## TC-NTPL-050002 — ลบ template สำเร็จ (cleanup)
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เข้าสู่ระบบเป็น Admin; มี template ที่ชุดทดสอบสร้างขึ้นเองและไม่ถูกอ้างอิงโดยระบบอื่น
**Steps**
1. เปิด detail ของ template และกด "Edit"
2. กดปุ่ม "Delete"
3. กด "Delete" เพื่อยืนยันใน dialog
**Expected**
ปุ่มยืนยันเปลี่ยนเป็น "Deleting..." ระหว่างทำงาน จากนั้นแสดง toast "Notification Template deleted successfully" และนำทางกลับไปที่ `/system-admin/notification-template`; ค้นหาชื่อเดิมแล้วไม่พบในตารางอีก

---
## TC-NTPL-050003 — delete dialog แสดงชื่อ template ในข้อความยืนยัน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; รู้ชื่อ template ที่จะเปิด dialog
**Steps**
1. เปิด detail ของ template และกด "Edit"
2. กดปุ่ม "Delete"
3. อ่านหัวข้อและคำอธิบายใน dialog
**Expected**
หัวข้อ dialog คือ "Delete Notification Template" และคำอธิบายคือ `Are you sure you want to delete "<ชื่อ template>"? This action cannot be undone.` โดยมีชื่อจริงของ template อยู่ในเครื่องหมายคำพูด

---
## TC-NTPL-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง list ต้องเห็นกล่อง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ **ไม่มี** permission `system_configuration.view` และไม่ใช่ admin ของ BU ปัจจุบัน
**Steps**
1. เปิด URL `/system-admin/notification-template` โดยตรง
**Expected**
ไม่แสดงตารางหรือปุ่ม Add; แสดงกล่อง (role="alert") ที่มีไอคอน ShieldOff, eyebrow "Restricted", หัวข้อ "Permission Denied", ข้อความ "You don't have permission to view this page." พร้อมบรรทัด "Contact your administrator to request access." และปุ่ม "Go to an available page"

---
## TC-NTPL-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ออกจากระบบแล้ว หรือใช้ browser context ที่ไม่มี token)
**Steps**
1. เปิด URL `/system-admin/notification-template` โดยตรง
**Expected**
ถูก redirect (แบบ replace) ไปยัง `/login` โดยไม่แสดงเนื้อหาของโมดูลเลยแม้ชั่วขณะ

---
## TC-NTPL-100003 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด /new และ /:id ตรง ๆ ก็ถูกบล็อกเช่นกัน
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ไม่มี permission `system_configuration.view` และไม่ใช่ admin; ทราบ UUID ของ template หนึ่งรายการ
**Steps**
1. เปิด URL `/system-admin/notification-template/new` โดยตรง
2. เปิด URL `/system-admin/notification-template/{uuid}` โดยตรง
**Expected**
ทั้งสอง URL แสดงกล่อง "Permission Denied" เหมือนหน้า list ไม่มีฟอร์มให้กรอกและไม่มีข้อมูลของเรคคอร์ดรั่วออกมา (route guard แมตช์แบบ prefix จึงครอบ path ลูกทั้งหมด)

---
## TC-NTPL-200001 — บันทึกโดยไม่กรอก name ต้องแสดง error ที่ช่อง name
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. กรอกเฉพาะ Body เว้น Name ว่างไว้
3. กด "Create"
**Expected**
ฟอร์มไม่ถูก submit (ยังอยู่ที่ `/new` ไม่มี toast สำเร็จ); ช่อง Name ได้ `aria-invalid` และแสดงไอคอนแจ้งเตือนสีแดงในช่อง ซึ่งเมื่อ hover จะขึ้น tooltip ข้อความ "Name is required"; หน้าเลื่อนไปยังช่องที่ผิดช่องแรก

---
## TC-NTPL-200002 — บันทึกโดยไม่กรอก body ต้องแสดง error ใต้ช่อง body
**Priority:** High · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. กรอกเฉพาะ Name เว้น Body ว่างไว้
3. กด "Create"
**Expected**
ฟอร์มไม่ถูก submit; ช่อง Body ได้ `aria-invalid` และมีข้อความ "Body is required" แสดงเป็นข้อความใต้ช่อง (ไม่ใช่ tooltip แบบช่อง Name)

---
## TC-NTPL-200003 — name รับได้ไม่เกิน 100 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. พิมพ์หรือวางข้อความยาว 150 ตัวอักษรลงช่อง Name
**Expected**
ค่าในช่อง Name ถูกตัดเหลือ 100 ตัวอักษรพอดี (`maxLength=100` ของ input) ไม่มีข้อความ error ขึ้น เพราะเบราว์เซอร์กันไว้ตั้งแต่ตอนพิมพ์

---
## TC-NTPL-200005 — body รับได้ไม่เกิน 259 ตัวอักษรและมีตัวนับอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. คลิกที่ช่อง Body แล้วอ่านตัวนับมุมขวาล่างของช่อง
3. พิมพ์หรือวางข้อความยาว 300 ตัวอักษรลงช่อง Body
**Expected**
ตัวนับแสดงรูปแบบ `n/259` และขยับตามจำนวนตัวอักษรที่พิมพ์; ค่าในช่องถูกตัดเหลือ 259 ตัวอักษรพอดีและตัวนับหยุดที่ `259/259`

---
## TC-NTPL-200006 — description รับได้ไม่เกิน 256 ตัวอักษรและมีตัวนับอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า `/new`
**Steps**
1. เปิด `/system-admin/notification-template/new`
2. คลิกที่ช่อง Description แล้วอ่านตัวนับมุมขวาล่างของช่อง
3. พิมพ์หรือวางข้อความยาว 300 ตัวอักษรลงช่อง Description
**Expected**
ตัวนับแสดงรูปแบบ `n/256`; ค่าในช่องถูกตัดเหลือ 256 ตัวอักษรพอดี และ Description ไม่ใช่ช่องบังคับกรอก (ป้ายไม่มีเครื่องหมายบังคับ, placeholder คือ "Optional")
