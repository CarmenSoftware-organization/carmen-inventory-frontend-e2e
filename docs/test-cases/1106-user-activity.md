# User Activity — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/user-activity`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** User Activity
**Frontend route:** `routes/system-admin/user-activity`  •  **URL:** `/system-admin/user-activity`
**Prefix:** `UACT`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 29

_หน้าอ่านอย่างเดียว — ดูว่าใครเข้า/ออกระบบเมื่อไหร่ (backend query ปัก `entity_type=auth` ตายตัว) ครอบคลุม ตาราง/การ์ด, ค้นหา, ตัวกรอง 2 แกน (Action / User), detail sheet, export xlsx, สิทธิ์เข้าถึง_

> **หมายเหตุสำคัญสำหรับผู้รีวิว:**
>
> 1. **อย่าสับสนกับ `/system-admin/activity-log`** (แคตตาล็อกของตัวเองที่ `1109-activity-log.md`, prefix `ALOG`) — คนละ component คนละ route ยืนยันจากโค้ดแล้วว่าต่างกันตรง:
>    - หน้านี้ **ปัก `p.entity_type = "auth"`** ลงใน `queryParams` ตายตัว (`user-activity-component.tsx`) จึงเห็นเฉพาะ login/logout · activity-log ไม่ปัก และเห็นทุก entity_type
>    - หน้านี้มีตัวกรอง **2 ตัว** (`action` ที่มีแค่ Login/Logout, `actor_id`) · activity-log มี 3 ตัว (มี `entity_type` เพิ่ม)
>    - ตารางหน้านี้ **ไม่มีคอลัมน์ Record Type / Record ID** แต่มี **User Agent** · detail sheet หน้านี้ **ไม่มีส่วน Data Changes (Before/After)** มีแค่ General Information + Details
>    - **ทั้งสองหน้าใช้ `licenseFeature: "system_admin.activity_log"` ร่วมกัน** (`constant/module-list.ts` บรรทัด 699 กับ 707 — คอมเมนต์ `// app:activity-logs` เหมือนกัน) จึงเปิด/ปิดตาม license **พร้อมกัน** ห้ามใช้ผลของหน้าหนึ่งแทนอีกหน้า และ permission ก็ตัวเดียวกันคือ `system_configuration.view`
> 2. **เคสที่ต้องมี "กิจกรรมเกิดขึ้นก่อน" จึงจะมีแถวให้ตรวจ** (ต้องมีแถว `entity_type=auth` ใน BU นั้นจริง — วิธีที่ถูกที่สุดคือ **login ด้วยบัญชีทดสอบสัก 1–2 ราย แล้ว logout** ก่อนรันเคสกลุ่มนี้): 010002, 010004, 010011, 010012, 020001–020006, 040001–040006, 300001–300003
>    **เคสที่รันได้แม้ BU ยังไม่มีข้อมูลเลย:** 010001, 010005, 010006, 010007, 010008, 010009, 010010, 100001, 100002, 100003
>    **เคสที่ต้องมีกิจกรรมของ *ผู้ใช้มากกว่า 1 คน*:** 040002, 040003 — ถ้ามี actor เดียวจะแยกไม่ออกว่าตัวกรองทำงาน
>    **เคสที่ต้องมีทั้ง login และ logout:** 040001, 040004
> 3. **ชิป (badge) ของ action ถูกถอดออกไปแล้ว** — คอลัมน์ Action ตอนนี้เป็น `ActivityActionLabel` (`routes/system-admin/shared/activity-action-label.tsx`) = **ไอคอน + ข้อความ action ดิบ ไม่มีกรอบชิป** (คอมมิต `72d6cd34` "ทิ้งชิปในตาราง activity log, user activity…" และ `86446384`) เคสเดิม **TC-UACT-010002 และ 020002 ที่เขียนว่า "badge" จึงยืนยันสิ่งที่ตรงข้ามกับโค้ดปัจจุบัน** — แก้แล้วทั้งคู่ (คง ID เดิม) และเพิ่ม 010012 ยืนยันรูปแบบนี้ตรง ๆ
> 4. **ไม่ยืนยันลำดับแถวอีกต่อไป** — หน้านี้ส่ง `defaultSort: "-created_at"` ซึ่ง **ไม่ใช่รูป `field:dir`** ที่ `useDataGridState` แยกด้วย `":"` ผลคือ sorting state กลายเป็น `{ id: "-created_at", desc: false }` ซึ่งไม่ตรงกับ id ของคอลัมน์ไหนเลย → ไม่มีคอลัมน์ไหนถูก mark ว่ากำลังเรียงอยู่ และการเรียงจริงขึ้นกับ backend ล้วน ๆ พิสูจน์จากฝั่ง frontend ไม่ได้ **TC-UACT-010003 เดิม ("รายการเรียงตามเวลาล่าสุดก่อน") จึงถูกลบ** เรื่องการเรียงย้ายไปอยู่ที่ 010008 ที่ยืนยันเฉพาะพฤติกรรมของเมนู Sort by + ค่า `sort` บน URL (**ID 010003 ถูกปลดระวาง ห้ามนำกลับมาใช้ซ้ำ**)
> 5. **เลือก Login + Logout พร้อมกัน = ล้างตัวกรอง ไม่ใช่ "เลือกทั้งคู่"** — `MultiSelectFilter.toggle` มีกฎ `next.length >= options.length ? "" : join(",")` และ `ACTION_OPTIONS` มีแค่ 2 ตัว ติ๊กครบสองจึงกลายเป็นค่าว่างทันที ผลพลอยได้คือ **เงื่อนไข `!actionFilter.includes(",")` ใน `queryParams` แตะไม่ถึงผ่าน UI เลย** (ถึงได้ก็ต่อเมื่อแก้ URL เป็น `?action=login,logout` เอง ซึ่งตอนนั้นจะ **ไม่ส่ง `action` ไป backend เลย**) เขียนเป็นเคส 040004 ในฐานะ "พฤติกรรมที่เป็นอยู่" ไม่ได้เขียนว่าเป็นบั๊ก
> 6. **ค่าบนชิปของตัวกรองเป็นค่าดิบ** — ทั้ง 2 field ประกาศเป็น `control: "custom"` (ห่อ `MultiSelectFilter` ใน render prop) จึง **ไม่มี `options` ให้ `chipValueText` แปลงเป็น label** ผลคือชิป Action โชว์ `login` (ตัวเล็ก ค่าดิบจาก URL) ไม่ใช่ "Login" ส่วนชิป User ที่ค่าเป็น UUID โชว์เป็น **จำนวนที่เลือก** (`1`, `2`) ไม่ใช่ชื่อคน
> 7. **Export ได้เฉพาะหน้าปัจจุบัน** — `handleExport` ส่ง `params: queryParams` ชุดเดียวกับตาราง ซึ่งมี `page`/`perpage` ติดไปด้วย (ค่าเริ่มต้น perpage = 10) toast "Exported {count} records" จึงเท่ากับจำนวนแถวในหน้านั้น ไม่ใช่ยอดรวมทั้ง BU — บันทึกไว้เป็นข้อเท็จจริง ไม่ได้เขียนเคสยืนยันว่าผิด
> 8. **ห้ามกดปุ่ม Print ในเทสอัตโนมัติ** — `onClick={() => globalThis.print()}` เปิด dialog ของเบราว์เซอร์ที่ทำให้ runner ค้าง 010009 จึงยืนยันแค่ว่าปุ่มปรากฏและ enabled
> 9. **แคตตาล็อกนี้เขียนบนสมมุติฐาน desktop viewport** — บนมือถือ ปุ่ม Export/Print ถูกซ่อน (`hidden sm:inline-flex`) แล้วย้ายเข้าเมนู "More actions", ฝั่งขวาของ toolbar (Sort by / Toggle Columns / สลับ list-grid) **ไม่ render เลย** และ `useInfiniteScroll = isMobile || displayMode === "grid"` บังคับโหมดการ์ด + infinite scroll เสมอ (ไม่มีแถบแบ่งหน้า)
> 10. **เมนู Filter บน desktop ไม่มีหัวข้อ section** (จงใจ — สไตล์ Linear มีแต่เส้นคั่น) หัวข้อ "Document" / "People" จะเห็นเฉพาะใน bottom sheet ของมือถือ
> 11. **หัวคอลัมน์บนจอกับในไฟล์ export คนละชุดคีย์** — จอใช้ `systemAdmin.userActivity.*` → "Date / Time" ส่วนไฟล์ xlsx ใช้ `field.*` → "Date" เคส 300001 จึงยืนยันชื่อหัวตามไฟล์ ไม่ใช่ตามจอ
> 12. **เป็นหน้าอ่านอย่างเดียวจริง ๆ** — ไม่มีปุ่มสร้าง/แก้/ลบ, `useConfigTable` ถูกเรียกด้วย `hideStatus: true` และ **ไม่ส่ง `onDelete`** จึงไม่มีคอลัมน์ Status และไม่มีเมนู row actions; detail sheet ไม่มีฟอร์มให้แก้ ไม่มีเคสใดในไฟล์นี้เขียนข้อมูล จึงไม่มีบล็อก 03/05 ในแคตตาล็อกนี้
> 13. **Section blocks ไม่เปลี่ยน** — ยังใช้ 01, 02, 04, 10, 30 ตามที่ลงทะเบียนไว้ใน `docs/test-id-scheme.md` (`UACT` → `01–02, 04, 10, 30`) จึง **ไม่ต้องลงทะเบียน section เพิ่ม** เคสชนิด Edge Case (040004) วางไว้ในบล็อก 04 ไม่ได้เปิดบล็อก 90 เพื่อไม่ให้ต้องแก้ scheme หมายเหตุ: บล็อก 04 ในไฟล์นี้ถูกใช้เป็นบล็อก "ตัวกรอง" มาแต่เดิม (ไม่ใช่ Edit ตามเทมเพลต) คงไว้เพื่อไม่ให้ ID เดิมเลื่อน
> 14. **หน้านี้ผูกกับ BU** — `useUserActivity` อ่าน `useBuCode()` และ **ไม่ยิง query จนกว่า buCode จะพร้อม** (`enabled: !!buCode`) ทุกเคสจึงต้องมั่นใจว่า active BU = `BLAVG` ก่อนเริ่ม

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-UACT-010001 | หน้า User Activity โหลดสำเร็จ | High | Smoke |
| TC-UACT-010002 | คอลัมน์ของตารางแสดงครบตามที่ประกาศไว้ | Medium | Functional |
| TC-UACT-010004 | ค้นหาด้วยการกด Enter แล้วเขียน `search` ลง URL | Medium | Functional |
| TC-UACT-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-UACT-010006 | สลับมุมมอง List / Grid ได้ | Low | Functional |
| TC-UACT-010007 | ซ่อน/แสดงคอลัมน์ผ่านเมนู Toggle Columns | Low | Functional |
| TC-UACT-010008 | เมนู Sort by เริ่มที่ Default และเลือกคอลัมน์แล้วเขียน `sort` ลง URL | Medium | Functional |
| TC-UACT-010009 | ปุ่ม Export และ Print แสดงบนหัวหน้าจอ (desktop) | Low | Functional |
| TC-UACT-010010 | เมนู Filter แสดง field ครบ 2 ตัวพร้อมเมนูย่อยและปุ่มท้ายเมนู | Medium | Functional |
| TC-UACT-010011 | แถบแบ่งหน้าแสดงจำนวนและเปลี่ยนหน้าได้ | Medium | Functional |
| TC-UACT-010012 | คอลัมน์ Action แสดงไอคอน + ชื่อ action ดิบ (ไม่ใช่ชิป) | Medium | Functional |
| TC-UACT-020001 | คลิกแถวเปิด detail sheet | High | Smoke |
| TC-UACT-020002 | detail sheet แสดงส่วน General Information ครบ | Medium | Functional |
| TC-UACT-020003 | detail sheet แสดงส่วน Details เมื่อมี meta_data | Low | Functional |
| TC-UACT-020004 | detail sheet ต้องไม่มีส่วน Data Changes (ต่างจาก Activity Log) | Medium | Functional |
| TC-UACT-020005 | ปิด detail sheet ได้ และ URL ไม่เปลี่ยนตลอดการเปิด-ปิด | Medium | Functional |
| TC-UACT-020006 | เปิด detail sheet จากการ์ดในโหมด Grid ได้ | Medium | Alternate Flow |
| TC-UACT-040001 | กรองตาม Action = Login ใช้งานได้ | High | Functional |
| TC-UACT-040002 | กรองตาม User ใช้งานได้ (ค้นหาชื่อในรายการได้) | High | Functional |
| TC-UACT-040003 | ใช้ทั้ง 2 ตัวกรองพร้อมกันแล้วกด Clear ล้างได้หมด | Medium | Functional |
| TC-UACT-040004 | ติ๊ก Login + Logout ครบทั้งสอง หรือกด All แล้วตัวกรองถูกล้าง | Medium | Edge Case |
| TC-UACT-040005 | ชิปในแถบ Filters แก้ค่าได้ในตัวและลบทีละตัวได้ | Medium | Functional |
| TC-UACT-040006 | เปลี่ยนตัวกรองแล้วเด้งกลับหน้า 1 | Low | Functional |
| TC-UACT-100001 | ผู้ใช้ที่ไม่มีสิทธิ์ต้องเจอกล่อง Permission Denied | High | Authorization |
| TC-UACT-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป `/login` | High | Auth-guard |
| TC-UACT-100003 | BU ที่ไม่มี license ของ feature ต้องเจอกล่อง Feature Not Licensed | Medium | Authorization |
| TC-UACT-300001 | Export ข้อมูลเป็นไฟล์ xlsx สำเร็จ | Medium | Functional |
| TC-UACT-300002 | Export ตามเงื่อนไขตัวกรอง/คำค้นที่เปิดอยู่ | Medium | Functional |
| TC-UACT-300003 | ทุก request ปัก `entity_type=auth` — เห็นเฉพาะ login/logout | High | Integration |

---
## TC-UACT-010001 — หน้า User Activity โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin (`admin@blueledgers.com`) และ active BU = `BLAVG`
**Steps**
1. ไปที่ `/system-admin/user-activity`
**Expected**
URL คงอยู่ที่ `/system-admin/user-activity` (ไม่ถูกเด้งออก); `<h1>` อ่านว่า **"User Activity"** พร้อมคำอธิบายใต้หัวว่า "Who signed in and out, and when."; toolbar (ช่องค้น, View, Filter) และ DataGrid แสดงภายใน 10 วินาที ไม่มีกล่อง error

---
## TC-UACT-010002 — คอลัมน์ของตารางแสดงครบตามที่ประกาศไว้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, โหมด List, และมีแถวกิจกรรม `entity_type=auth` อย่างน้อย 1 รายการใน BLAVG (ดูหมายเหตุข้อ 2)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ตรวจหัวคอลัมน์ของตารางจากซ้ายไปขวา
**Expected**
ตารางมีคอลัมน์ตามลำดับ: checkbox เลือกแถว, `#` (ลำดับ), **Date / Time** (วันที่บรรทัดบน เวลา `HH:mm:ss` บรรทัดล่าง), **Action**, **User** (ชื่อเต็ม + username บรรทัดล่างเมื่อไม่ซ้ำกัน), **Description**, **IP Address**, **User Agent** (ตัดท้ายด้วย ellipsis); **ไม่มีคอลัมน์ Status** และ **ไม่มีเมนู row actions ท้ายแถว** (`useConfigTable` เรียกด้วย `hideStatus: true` และไม่ส่ง `onDelete`); ช่องที่ไม่มีค่าแสดง `—`

---
## TC-UACT-010004 — ค้นหาด้วยการกด Enter แล้วเขียน `search` ลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีแถวกิจกรรมที่รู้ค่าแน่นอนสำหรับใช้เป็นคำค้น (เช่น username ของบัญชีที่เพิ่ง login)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. พิมพ์คำค้นในช่องค้นหา
3. กด Enter
**Expected**
URL ได้ query `search=<คำค้น>` และ `page` ถูกรีเซ็ต; ตารางโหลดผลที่กรองแล้วภายใน 10 วินาที — **การพิมพ์เฉย ๆ ไม่ยิงค้นหา** (`SearchInput` เรียก `onSearch` เฉพาะตอนกด Enter หรือกดปุ่มแว่นขยาย); กดปุ่ม X ในช่องค้นล้างคำค้นและคืนรายการทั้งหมด

---
## TC-UACT-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. พิมพ์คำสุ่มที่ไม่มีทางตรงกับข้อมูลใด ๆ แล้วกด Enter
**Expected**
ตารางแสดง `EmptyComponent` — ข้อความ **"No data found"** พร้อมภาพโฟลเดอร์ว่าง ภายใน 10 วินาที; ไม่มีแถวข้อมูลเหลืออยู่ และไม่มีกล่อง error

---
## TC-UACT-010006 — สลับมุมมอง List / Grid ได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, **desktop viewport** (ปุ่มสลับมุมมองไม่ render บนมือถือ)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม Grid view (`aria-label` = "Grid view")
3. คลิกปุ่ม List view (`aria-label` = "List view") กลับ
**Expected**
โหมด Grid แสดงการ์ด `UserActivityCard` เรียงเป็นกริด (1/2/3/4 คอลัมน์ตามความกว้าง) แต่ละใบมีเลขลำดับ, ไอคอน+ชื่อ action, วันที่-เวลา, ชื่อผู้ใช้, description, IP และ user agent (ตัดที่ 40 ตัวอักษร) — โหลดเพิ่มแบบ infinite scroll และ **ไม่มีแถบแบ่งหน้า**; กดกลับ List แล้วได้ DataGrid พร้อมแถบแบ่งหน้าเหมือนเดิม

---
## TC-UACT-010007 — ซ่อน/แสดงคอลัมน์ผ่านเมนู Toggle Columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, โหมด List
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่มไอคอนคอลัมน์ (`aria-label` = "Toggle columns")
3. ติ๊กออกที่รายการ "User Agent"
4. ติ๊กกลับเข้า
**Expected**
เมนูหัวข้อ **"Toggle Columns"** มีรายการ 6 ตัวพอดี: Date / Time, Action, User, Description, IP Address, User Agent (checkbox กับ `#` **ไม่อยู่ในเมนู** เพราะไม่มี `accessorFn` และ `enableHiding: false`); ติ๊กออกแล้วคอลัมน์ User Agent หายจากตารางทันทีโดยเมนูยังเปิดค้าง; ติ๊กกลับแล้วคอลัมน์กลับมา

---
## TC-UACT-010008 — เมนู Sort by เริ่มที่ Default และเลือกคอลัมน์แล้วเขียน `sort` ลง URL
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, โหมด List, URL ยังไม่มี query `sort`
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม Sort by (`aria-label` = "Sort by")
3. คลิกรายการ "User"
4. คลิกรายการ "User" ซ้ำอีกครั้ง
5. คลิกรายการ "Default"
**Expected**
เมนูมีหัวข้อ "Sort by", แถว **"Default"** (มีไอคอนนำหน้าเมื่อ URL ยังไม่มี `sort`) แล้วตามด้วยคอลัมน์ที่เรียงได้ 6 ตัว; เลือก "User" → URL ได้ `sort=actor_user:asc` และแถวนั้นขึ้นลูกศรขึ้น, คลิกซ้ำ → `sort=actor_user:desc` ลูกศรลง (เมนูเปิดค้างทั้งสองครั้ง); ปุ่ม Sort by เปลี่ยนเป็นสี primary เมื่อ URL มี `sort`; เลือก "Default" → `sort` ถูกลบจาก URL และปุ่มกลับสีปกติ
**Note**
ก่อนเลือกอะไร **จะไม่มีคอลัมน์ไหนขึ้นเครื่องหมายว่ากำลังเรียงอยู่** เพราะ `defaultSort: "-created_at"` ไม่ใช่รูป `field:dir` (ดูหมายเหตุข้อ 4) — อย่ายืนยันว่า Date / Time ติ๊กอยู่

---
## TC-UACT-010009 — ปุ่ม Export และ Print แสดงบนหัวหน้าจอ (desktop)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, **desktop viewport**
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ตรวจปุ่มฝั่งขวาของหัวหน้าจอ (ยังไม่ต้องกด)
**Expected**
เห็นปุ่ม **"Export"** (ไอคอนดาวน์โหลด, enabled) และ **"Print"** (ไอคอนเครื่องพิมพ์) เรียงกัน; ปุ่ม "More actions" (จุดสามจุด) **ไม่แสดง** บน desktop
**Note**
**ห้ามกด Print ในเทสอัตโนมัติ** — `globalThis.print()` เปิด dialog ของเบราว์เซอร์ที่ทำให้ runner ค้าง (หมายเหตุข้อ 8)

---
## TC-UACT-010010 — เมนู Filter แสดง field ครบ 2 ตัวพร้อมเมนูย่อยและปุ่มท้ายเมนู
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, **desktop viewport** (มือถือเป็น bottom sheet คนละหน้าตา)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม "Filter"
3. เลื่อนเมาส์ไปที่แถว "Action" เพื่อเปิดเมนูย่อย
**Expected**
popover มีแถว field **2 แถวเท่านั้น**: **Action** และ **User** คั่นด้วยเส้นคั่น (ไม่มีหัวข้อ section บน desktop — ดูหมายเหตุข้อ 10) ตามด้วยแถว **"Clear"** (disabled เมื่อยังไม่มีตัวกรอง) และ **"Save current filters as view"**; เมนูย่อยของ Action เด้งขึ้นมามีรายการ **All / Login / Logout** พร้อม checkbox; เมนูย่อยของ User มีช่องค้นหา placeholder "Search user..."

---
## TC-UACT-010011 — แถบแบ่งหน้าแสดงจำนวนและเปลี่ยนหน้าได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, โหมด List, และมีแถวกิจกรรมมากกว่า 10 รายการใน BLAVG (perpage เริ่มต้น = 10)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. อ่านข้อความ "Showing … of …" ที่แถบล่างของตาราง
3. คลิกปุ่ม "Go to next page"
4. เปลี่ยน "Rows per page" เป็นค่าที่มากขึ้น
**Expected**
แถบแบ่งหน้า (`aria-label` = "Pagination") แสดงช่วงแถวและยอดรวมตรงกับตัวเลขบน badge ข้างหัวข้อหน้า; กด next → URL ได้ `page=2` และตารางเปลี่ยนชุดข้อมูล; เปลี่ยน rows per page → URL ได้ `perpage=<ค่าใหม่>` และจำนวนแถวต่อหน้าเปลี่ยนตาม

---
## TC-UACT-010012 — คอลัมน์ Action แสดงไอคอน + ชื่อ action ดิบ (ไม่ใช่ชิป)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีแถว login และ/หรือ logout อย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. ตรวจเซลล์ในคอลัมน์ Action
**Expected**
แต่ละเซลล์เป็น `<span data-slot="action">` ที่มี **ไอคอน + ข้อความ action ดิบตามที่ backend ส่งมา** (`login` / `logout` ตัวเล็ก) **ไม่มีกรอบ/พื้นหลังแบบชิป**; ไอคอนของ `login` คือ LogIn และของ `logout` คือ LogOut (ค่าที่ไม่รู้จักตกมาที่ไอคอนขีดกลาง); ค่าว่างแสดง `—`
**Note**
เคสนี้มีไว้กันการถดถอยกลับไปเป็นชิป — ดูหมายเหตุข้อ 3

---
## TC-UACT-020001 — คลิกแถวเปิด detail sheet
**Priority:** High · **Test Type:** Smoke
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, โหมด List, มีแถวกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกแถวแรกของตาราง (คลิกที่เนื้อแถว ไม่ใช่ checkbox)
**Expected**
`UserActivityDetailSheet` เลื่อนเข้ามาจากขอบขวา; หัว sheet คือ ไอคอน+ชื่อ action ของแถวนั้น และบรรทัดรองคือ description ของแถว (ถ้าไม่มี description จะตกมาเป็นข้อความ "Who signed in and out, and when."); แถวมี `role="button"` และ `tabIndex=0` จึงกด Enter/Space เปิดได้เช่นกัน

---
## TC-UACT-020002 — detail sheet แสดงส่วน General Information ครบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิด detail sheet ของกิจกรรมหนึ่งไว้แล้ว
**Steps**
1. คลิกแถวเพื่อเปิด detail sheet
2. อ่านหัวข้อ "General Information" และแถวข้อมูลใต้หัวข้อ
**Expected**
ภายใต้หัวข้อ **"General Information"** มีแถว **Date / Time** (รูปแบบวันที่ตาม profile ต่อด้วย `HH:mm:ss`), **User** (ชื่อเต็มตัวหนา + username บรรทัดล่าง, ไม่มีทั้งคู่แสดง `—`), **IP Address** (ไม่มีค่าแสดง `—`) และ **User Agent** — แถว User Agent **จะ render ก็ต่อเมื่อ `user_agent` มีค่า** (ไม่มีค่า = ไม่มีแถวนี้เลย ไม่ใช่แสดง `—`); ส่วนหัวของ sheet เป็นไอคอน+ชื่อ action ดิบ **ไม่ใช่ badge**

---
## TC-UACT-020003 — detail sheet แสดงส่วน Details เมื่อมี meta_data
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; รู้ล่วงหน้าว่าแถวไหนมี `meta_data` ไม่ว่าง และแถวไหนไม่มี
**Steps**
1. เปิด detail sheet ของแถวที่มี `meta_data`
2. เลื่อนลงไปดูใต้ General Information
3. ปิดแล้วเปิด detail sheet ของแถวที่ไม่มี `meta_data`
**Expected**
แถวที่มี `meta_data` → มีหัวข้อ **"Details"** (ไม่ใช่คำว่า "Metadata" — คีย์ `metadata` ถูกแปลเป็น "Details") และใต้หัวข้อเป็นบล็อก `<pre>` แสดง JSON แบบ pretty-print (เว้นวรรค 2) พื้นหลังเทา เลื่อนได้เมื่อยาว; แถวที่ไม่มี `meta_data` หรือเป็น object ว่าง → **ไม่มีหัวข้อ "Details" เลย**

---
## TC-UACT-020004 — detail sheet ต้องไม่มีส่วน Data Changes (ต่างจาก Activity Log)
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิด detail sheet ของกิจกรรมใดก็ได้
**Steps**
1. เปิด detail sheet จากแถวใดก็ได้
2. เลื่อนดูทุกหัวข้อภายใน sheet
**Expected**
sheet มีหัวข้อได้มากที่สุด 2 หัวข้อ คือ **General Information** และ **Details** เท่านั้น; **ไม่มีหัวข้อ "Data Changes" / "Before" / "After"** — ส่วนนั้นเป็นของหน้า `/system-admin/activity-log` (`1109-activity-log.md` TC-ALOG-020003) ไม่ใช่ของหน้านี้
**Note**
เคสนี้เป็นเส้นแบ่งระหว่างสองโมดูลพี่น้อง (หมายเหตุข้อ 1) — ถ้าวันหนึ่ง Data Changes โผล่มาที่นี่แปลว่า component ถูกสลับ

---
## TC-UACT-020005 — ปิด detail sheet ได้ และ URL ไม่เปลี่ยนตลอดการเปิด-ปิด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และจด URL ปัจจุบันไว้
**Steps**
1. คลิกแถวเพื่อเปิด detail sheet
2. กดปุ่ม X มุมขวาบนของ sheet (ชื่อที่เข้าถึงได้ = "Close")
3. เปิดใหม่แล้วกด Escape
**Expected**
sheet ปิดทั้งสองวิธีและ `selectedLog` ถูกล้าง (เปิดใหม่ได้ทันที); **URL ไม่เปลี่ยนเลย** ทั้งตอนเปิดและตอนปิด — หน้านี้ไม่ผูก detail กับ route หรือ query param ใด ๆ

---
## TC-UACT-020006 — เปิด detail sheet จากการ์ดในโหมด Grid ได้
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, มีแถวกิจกรรมอย่างน้อย 1 รายการ
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. สลับเป็น Grid view
3. คลิกการ์ดใบแรก
**Expected**
เปิด detail sheet ใบเดียวกับที่เปิดจากตาราง (หัวข้อ General Information ครบ) — การ์ดมี `role="button"` และ `tabIndex=0` จึงกด Enter/Space เปิดได้เช่นกัน; ปิด sheet แล้วยังอยู่ในโหมด Grid

---
## TC-UACT-040001 — กรองตาม Action = Login ใช้งานได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; ใน BLAVG มีทั้งแถว `login` และ `logout` (ดูหมายเหตุข้อ 2)
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. เปิดเมนู Filter → แถว "Action"
3. ติ๊ก "Login" เพียงตัวเดียว
**Expected**
URL ได้ `action=login`; request ที่ยิงไป `/api/proxy/api/BLAVG/activity-logs` มี `action=login` ติดไปด้วย; ตารางเหลือเฉพาะแถวที่คอลัมน์ Action เป็น `login`; แถบ **"Filters:"** ปรากฏพร้อมชิปที่อ่านว่า **Action `login`** (ค่าดิบตัวเล็ก ไม่ใช่ "Login" — หมายเหตุข้อ 6)

---
## TC-UACT-040002 — กรองตาม User ใช้งานได้ (ค้นหาชื่อในรายการได้)
**Priority:** High · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีกิจกรรมจากผู้ใช้อย่างน้อย 2 คนใน BLAVG
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. เปิดเมนู Filter → แถว "User"
3. พิมพ์ชื่อผู้ใช้คนหนึ่งในช่อง "Search user..." แล้วติ๊กเลือก
**Expected**
รายการตัวเลือกกรองตามคำที่พิมพ์ (ไม่เจอเลยแสดง "No options"); URL ได้ `actor_id=<uuid ของผู้ใช้>` และ request ส่ง `actor_id=` ค่าเดียวกัน; ตารางเหลือเฉพาะกิจกรรมของผู้ใช้คนนั้น; ชิปในแถบ Filters อ่านว่า **User `1`** — เป็น **จำนวนที่เลือก ไม่ใช่ชื่อคน** เพราะค่าเป็น UUID (หมายเหตุข้อ 6)

---
## TC-UACT-040003 — ใช้ทั้ง 2 ตัวกรองพร้อมกันแล้วกด Clear ล้างได้หมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีกิจกรรมหลายผู้ใช้และมีทั้ง login/logout
**Steps**
1. ตั้ง Action = Login
2. ตั้ง User = ผู้ใช้คนหนึ่ง
3. กด "Clear" ในแถบ Filters (หรือแถว "Clear" ท้ายเมนู Filter)
**Expected**
ระหว่างตั้งค่า: URL มีทั้ง `action=login` และ `actor_id=<uuid>` พร้อมกัน, badge ตัวเลขบนปุ่ม Filter เป็น **2**, แถบ Filters มีชิป 2 ตัว, ตารางเหลือเฉพาะ login ของผู้ใช้คนนั้น; หลังกด Clear: ทั้ง `action` และ `actor_id` หายจาก URL, แถบ Filters หายไปทั้งแถบ, badge บนปุ่ม Filter หาย และตารางกลับมาแสดงทุกแถว

---
## TC-UACT-040004 — ติ๊ก Login + Logout ครบทั้งสอง หรือกด All แล้วตัวกรองถูกล้าง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
เข้าสู่ระบบเป็น Admin; เปิดเมนูย่อยของ field "Action" อยู่
**Steps**
1. ติ๊ก "Login"
2. ติ๊ก "Logout" เพิ่มโดยยังไม่ปิดเมนู
3. ติ๊ก "Login" ใหม่อีกครั้ง แล้วกดแถว "All"
**Expected**
หลังขั้นที่ 2 ค่าที่เลือกครบทุกตัวเลือก → `MultiSelectFilter` ตีความว่า "ไม่กรอง" แล้วเขียนค่าว่าง: `action` หายจาก URL, ชิป Action หายจากแถบ Filters และตารางกลับมาแสดงทุกแถว (**ไม่ใช่** `action=login,logout`); หลังขั้นที่ 3 การกด "All" ให้ผลเดียวกันคือล้างตัวกรอง
**Note**
เป็นพฤติกรรมที่ตั้งใจของ control ที่ใช้ร่วมกันทั้งแอป ไม่ใช่บั๊กของหน้านี้ — และเป็นเหตุผลที่เงื่อนไข `!actionFilter.includes(",")` ใน `queryParams` แตะไม่ถึงผ่าน UI (หมายเหตุข้อ 5)

---
## TC-UACT-040005 — ชิปในแถบ Filters แก้ค่าได้ในตัวและลบทีละตัวได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; ตั้งตัวกรองไว้แล้วทั้ง Action และ User (แถบ Filters มี 2 ชิป)
**Steps**
1. คลิกที่ตัวชิป "Action" (ไม่ใช่ปุ่ม X)
2. เปลี่ยนค่าจาก Login เป็น Logout ใน popover ที่เด้งขึ้น
3. คลิกปุ่ม X บนชิป "User"
**Expected**
คลิกชิปเปิด popover ที่มีรายการตัวเลือกชุดเดียวกับเมนูย่อยของ field นั้น; เลือกค่าใหม่แล้ว URL เปลี่ยนเป็น `action=logout` และตารางอัปเดตทันที; กด X บนชิป User (`aria-label` = "Remove User filter") ลบเฉพาะ `actor_id` ออกจาก URL โดยชิป Action ยังอยู่

---
## TC-UACT-040006 — เปลี่ยนตัวกรองแล้วเด้งกลับหน้า 1
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีแถวมากกว่า 1 หน้า และอยู่ที่หน้า 2 (URL มี `page=2`)
**Steps**
1. ไปที่หน้า 2 ของรายการ
2. ตั้งตัวกรอง Action = Login
**Expected**
`page` ถูกลบออกจาก URL (กลับไปหน้า 1) พร้อมกับ `action=login` ที่เพิ่มเข้ามา — `useListFilters.setValue` เขียน `page: ""` ทุกครั้งที่ค่าตัวกรองเปลี่ยน; แถบแบ่งหน้าแสดงว่ากำลังอยู่หน้า 1

---
## TC-UACT-100001 — ผู้ใช้ที่ไม่มีสิทธิ์ต้องเจอกล่อง Permission Denied
**Priority:** High · **Test Type:** Authorization
**Preconditions**
เข้าสู่ระบบด้วยบัญชีที่ **ไม่ใช่ admin** และไม่มี permission `system_configuration.view` (เช่น `requestor@blueledgers.com`) — RouteGuard มี **admin bypass** สำหรับ permission ดังนั้นห้ามใช้ `admin@blueledgers.com` กับเคสนี้
**Steps**
1. เปิด URL `/system-admin/user-activity` โดยตรง
**Expected**
แทนที่เนื้อหาโมดูลด้วยกล่อง `AccessDeniedBlock` (`role="alert"`): eyebrow "Restricted", หัวข้อ **"Permission Denied"**, คำอธิบาย "You don't have permission to view this page." พร้อมบรรทัด "Contact your administrator to request access." และปุ่มพากลับหน้าที่เข้าได้; **ไม่มีตารางหรือข้อมูลกิจกรรมใด ๆ แสดง** และ URL ยังคงเป็น `/system-admin/user-activity`

---
## TC-UACT-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป `/login`
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (ล้าง storage / ออกจากระบบแล้ว)
**Steps**
1. เปิด URL `/system-admin/user-activity` โดยตรง
**Expected**
`RequireAuth` เด้งไปที่ `/login` และไม่มีเนื้อหาของโมดูลแสดงเลยแม้ชั่วขณะ

---
## TC-UACT-100003 — BU ที่ไม่มี license ของ feature ต้องเจอกล่อง Feature Not Licensed
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ต้องใช้ **BU ที่ไม่ได้ซื้อ feature `system_admin.activity_log`** — RouteGuard เช็ค license **ก่อน** permission และ **ไม่มี admin bypass** ถ้า BLAVG มี feature นี้อยู่แล้วต้องหา BU อื่นหรือข้ามเคสนี้ไป
**Steps**
1. สลับ active BU ไปยัง BU ที่ไม่มี feature นี้
2. เปิด URL `/system-admin/user-activity` โดยตรง
**Expected**
แสดงกล่อง `AccessDeniedBlock` แบบ license: คำอธิบาย "This feature is not included in your organization's subscription…" **โดยไม่มีบรรทัด "Contact your administrator to request access."**; ไม่มีข้อมูลกิจกรรมแสดง
**Note**
feature เดียวกับ `/system-admin/activity-log` — BU ที่ล็อกหน้านี้จะล็อกหน้านั้นพร้อมกันเสมอ (หมายเหตุข้อ 1) ถ้า feature ถูกตั้งเป็น `hidden` แทนที่จะเป็น `locked` พฤติกรรมจะต่างออกไปคือ **เด้งไปหน้า landing แบบเงียบ ไม่มีกล่อง**

---
## TC-UACT-300001 — Export ข้อมูลเป็นไฟล์ xlsx สำเร็จ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin, desktop viewport, มีแถวกิจกรรมอย่างน้อย 1 รายการในหน้าปัจจุบัน
**Steps**
1. ไปที่ `/system-admin/user-activity`
2. คลิกปุ่ม "Export"
**Expected**
ปุ่มเปลี่ยนเป็น "Exporting..." พร้อม spinner ระหว่างทำงานแล้วกลับเป็น "Export"; ดาวน์โหลดไฟล์ `.xlsx` ชื่อขึ้นต้นด้วย `user-activity` ชีทชื่อ "User Activity"; หัวคอลัมน์ในไฟล์คือ **Date, Action, User, IP Address, Description** (ชุดคีย์ `field.*` — ต่างจากหัวบนจอ ดูหมายเหตุข้อ 11) และ **ไม่มีคอลัมน์ User Agent**; ขึ้น toast สำเร็จ "Exported {count} records"
**Note**
ถ้าไม่มีข้อมูลให้ export จะขึ้น toast เตือน "No data to export" แทน (ไม่ใช่ error)

---
## TC-UACT-300002 — Export ตามเงื่อนไขตัวกรอง/คำค้นที่เปิดอยู่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เข้าสู่ระบบเป็น Admin; มีทั้ง login และ logout ใน BLAVG
**Steps**
1. ตั้งตัวกรอง Action = Login
2. คลิกปุ่ม "Export"
3. เปิดไฟล์ที่ได้
**Expected**
`handleExport` ใช้ `queryParams` ชุดเดียวกับตาราง ไฟล์จึงมีเฉพาะแถว `login` (และตรงกับคำค้น/ตัวกรอง User ที่เปิดอยู่ถ้ามี); จำนวนแถวในไฟล์และตัวเลขใน toast **เท่ากับจำนวนแถวในหน้าปัจจุบัน ไม่ใช่ยอดรวมทั้ง BU** เพราะ `page`/`perpage` ติดไปกับ request ด้วย (หมายเหตุข้อ 7)

---
## TC-UACT-300003 — ทุก request ปัก `entity_type=auth` — เห็นเฉพาะ login/logout
**Priority:** High · **Test Type:** Integration
**Preconditions**
เข้าสู่ระบบเป็น Admin; ใน BLAVG มีกิจกรรมชนิดอื่นนอกเหนือจาก auth ด้วย (เช่น เพิ่งสร้าง/แก้เอกสารสักใบ) เพื่อพิสูจน์ว่าถูกกรองออกจริง
**Steps**
1. เปิด DevTools / ดัก network request
2. ไปที่ `/system-admin/user-activity`
3. ตรวจ query string ของ request ที่ยิงไป `/api/proxy/api/BLAVG/activity-logs`
4. ตรวจค่าในคอลัมน์ Action ของทุกแถวในตาราง
**Expected**
ทุก request (ทั้งตอนโหลดแรก, ตอนค้นหา, ตอนกรอง, ตอนเปลี่ยนหน้า และตอน export) มี **`entity_type=auth`** ติดไปด้วยเสมอ; คอลัมน์ Action มีแต่ค่า `login` / `logout` — ไม่มี `create` / `update` / `delete` ปนมาแม้กิจกรรมเหล่านั้นจะมีอยู่จริงใน BU เดียวกัน (เห็นได้ที่หน้า `/system-admin/activity-log`)
**Note**
นี่คือข้อแตกต่างหลักจากหน้า Activity Log (หมายเหตุข้อ 1) — request ยิงไป **endpoint เดียวกัน** ต่างกันแค่ที่พารามิเตอร์นี้
