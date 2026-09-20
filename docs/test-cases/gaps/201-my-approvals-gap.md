# My Approval (คิวเอกสารรออนุมัติ) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบ** เท่านั้น ไม่ใช่แคตตาล็อกเต็มของหน้านี้ — เคสที่ครอบแล้ว (เปิดหน้าได้, การ์ด Total Pending แสดงผล, จำนวนบน badge ตรงกับยอดรวมของ pagination, กดการ์ด Purchase Request แล้ว aria-pressed, คลิกแถว PR ไปหน้ารายละเอียด, Reject จากหน้า PR detail) ถูกทดสอบจริงอยู่ใน `tests/201-my-approvals.spec.ts` และ `tests/303-pr-approver-journey.spec.ts` และมีเอกสารที่ generate ไว้ที่ `docs/user-stories/201-my-approvals.md` / `docs/user-stories/303-pr-approver-journey.md`_

**Module:** Procurement — My Approval
**Frontend route:** `routes/procurement/approval/` (`approval.route.tsx` → `approval-component.tsx` + `approve-queue-list.tsx` + `use-approval.ts`)  •  **URL:** `/procurement/approval`
**Prefix:** `MA` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/201-my-approvals.spec.ts`, `tests/303-pr-approver-journey.spec.ts`, `tests/403-po-approver-journey.spec.ts`
**Total test cases:** 34

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **URL ที่ยืนยันจาก router** — เส้นทางจริงมีเพียง `/procurement/approval` (`routes/router.tsx:272-273`) **ไม่มี** `/procurement/my-approvals`, `/approval-queue` หรือ `/my-approvals` ในไฟล์ router เลย `tests/pages/my-approvals.page.ts` ใช้ `LIST_PATH = "/procurement/approval"` ถูกต้องแล้ว แต่ `tests/403-po-approver-journey.spec.ts:32-36, 52, 78` ยังยิงไปที่ `/procurement/my-approvals` (แล้ว fallback เป็น `/procurement/purchase-requests/my-approvals`) และ assert แค่ `toHaveURL(/approval|dashboard/i)` ซึ่งสตริง "my-approvals" ก็ผ่าน regex นี้อยู่แล้ว — **ฝั่ง PO ของหน้านี้จึงยังไม่มีการครอบจริง** เคส `TC-MA-020101` / `020104` ในไฟล์นี้จึงไม่ทับกับ 403
>
> **ช่วงเลขที่เลือก** — `MA` ลงทะเบียน section `01–06, 90` ไว้แล้ว ไฟล์นี้ใช้เฉพาะ section ที่ลงทะเบียนแล้ว **ไม่ต้องแก้ `docs/test-id-scheme.md`**: `TC-MA-0101xx` (หน้าคิว — ต่อจาก `010001–010004`, `010050`), `TC-MA-0201xx` (เดินจากคิวเข้าเอกสารเพื่ออนุมัติ — ต่อจาก `020001–020003`), `TC-MA-9001xx` (ขอบเขตตาม role/BU และสถานะพิเศษ — comment header ในสเปกใช้ `900001–900006` ไปแล้ว) ตามขนบของโฟลเดอร์นี้ (ดู `gaps/README.md`) เคสที่ "ตามขนบควรอยู่ section อื่น" ถูกจัดเข้าบล็อกที่ใกล้เคียงที่สุดแทนการเปิด section ใหม่
>
> **สเปกครอบอะไรไปแล้ว (ห้ามเขียนซ้ำ)** — `TC-MA-010050` (BU = BLAVG), `TC-MA-010001` (เปิด `/procurement/approval` แล้ว URL มี `approval`), `TC-MA-010002` (เปิดหน้าเมื่อไม่มีงานค้าง — **ไม่มี assertion ใด ๆ ในตัวเทส**), `TC-MA-010004` (requestor เปิดหน้า), `TC-MA-030001–030004` (Reject จากหน้า PR detail ใน edit mode), `TC-PR-060101` (การ์ด Total Pending แสดงผล), `TC-PR-060102` (คลิกแถว PR → `/procurement/purchase-request/<id>`), `TC-PR-060103` (ตัวเลขบนการ์ด = ยอดรวมใน "Showing … of N"), `TC-PR-060104` (กดการ์ด Purchase Request แล้ว `aria-pressed=true`) · เคสที่ `skip` ไว้ (`020001–020003`, `040001/2/4`, `050001/050003`, `060001–060003`) เป็นของ UI ที่ยังไม่มีในแอป — ไฟล์นี้ **ไม่** เขียนซ้ำและ **ไม่** เขียนเคสที่ยืนยันว่าฟีเจอร์เหล่านั้นไม่ทำงาน
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้**
> 1. **หน้านี้ไม่มี RBAC guard** — leaf `myApproval` ใน `constant/module-list.ts:140-143` ไม่มีทั้ง `permission` และ `licenseFeature` ดังนั้น `RouteGuard` (`components/route-guard.tsx`) ไม่บล็อกใครเลย ทุก role เปิด `/procurement/approval` ได้ สิ่งที่ต่างกันคือ **แถวที่ backend ส่งกลับมา** — `GET /api/my-pending` อ่านจาก view `sys_v_my_pending` ซึ่งเป็นรายการ "ที่รอ *คุณ* อยู่" รายบุคคล ⇒ ผู้ที่ไม่ใช่ผู้อนุมัติจะเห็น **หน้าว่าง ไม่ใช่หน้าปฏิเสธสิทธิ์** · `TC-MA-010004` ในสเปกตั้งความคาดหวังไว้ว่า "เห็น error หรือถูก redirect" ซึ่งไม่ตรงกับออกแบบนี้ — `TC-MA-900101` ในไฟล์นี้เขียนตามออกแบบจริง และควรถือเป็นตัวแทนเมื่อสะสางสเปกเดิม
> 2. **หน้านี้เป็นคิวอ่านอย่างเดียว** — คอลัมน์ทั้งหมดใน `approve-queue-list.tsx` คือ `#`, Document (ลิงก์), Send Back, Type, Date, Status เท่านั้น **ไม่มี checkbox, ไม่มีปุ่ม Approve/Reject/Bulk ในแถว** ทางเข้าเดียวคือลิงก์เลขที่เอกสาร แล้วไปอนุมัติที่หน้ารายละเอียดของโมดูลนั้น (PR/PO/SR)
> 3. **ปุ่ม Filter ถูกซ่อนโดยตั้งใจ** — `APPROVAL_FILTER_FIELDS` มี field เดียวที่ `hidden: true` และ `ListFilter` คืน `null` เมื่อไม่มี field ที่มองเห็นได้ โดยคอมเมนต์ในซอร์ส (`components/list-filter/list-filter.tsx`) ระบุชื่อหน้า `approval` ไว้ตรง ๆ ⇒ บนหน้านี้มีแต่ช่องค้นหากับปุ่ม View ไม่มีปุ่ม Filter และ `ActiveFilterBar` ไม่มีวันมี chip (field ที่ `hidden` ไม่ผลิต chip)
> 4. **สถานะของหน้าทั้งหมดอยู่ใน URL** — `useDataGridState` → `useListPageState` ผูก `search`, `filter`, `sort`, `page`, `perpage`, `sv` เข้ากับ query string ⇒ deep link / refresh / ปุ่ม Back ต้องคืนสถานะเดิม · การ์ดสรุปเขียนค่าลง `filter` (`doc_type:pr|po|sr`) ส่วน "Total Pending" เขียนค่าว่าง
> 5. **การเรียงเริ่มต้นคือ `doc_date:asc`** (เอกสารที่รอนานที่สุดขึ้นก่อน) ประกาศไว้ฝั่ง frontend ด้วยเพื่อให้ลูกศรโชว์ตั้งแต่เปิดหน้าโดยที่ URL ยังไม่มี `sort` และคลิกหัวคอลัมน์สลับ asc↔desc ได้ตลอด **ไม่มีสถานะ "ไม่เรียง"** · คอมเมนต์ในซอร์ส (`approve-queue-list.tsx`, คอลัมน์ `doc_status`) บันทึกว่า backend มี allowlist ของคีย์ sort และจะ **ถอยไปเรียงตาม `doc_date` เงียบ ๆ** เมื่อได้คีย์นอกรายการ ⇒ เคสเรื่องการเรียงในไฟล์นี้ assert ที่ **ลูกศรและค่า `sort=` ใน URL** (สิ่งที่ UI รับประกัน) ไม่ assert ลำดับแถวที่ backend เป็นคนตัดสิน
> 6. **การ์ดสรุปกับตารางคนละขอบเขต BU** — ตารางยิง `/api/my-pending?bu_code=<BU>` (`useApprovalPending` ผูก `buCode` ทั้งใน query key และ URL) แต่การ์ดยิง `/api/my-approve/pending` **โดยไม่ส่ง bu** (`useApprovalPendingSummary`) บันทึกไว้เป็นข้อเท็จจริง — ไฟล์นี้จึง **ไม่มี**เคสที่ assert ว่าตัวเลขการ์ดเปลี่ยนตามการสลับ BU (`TC-MA-900103` assert เฉพาะตาราง) และ **ไม่มี**เคสที่ assert ว่า `total = pr + po + sr`
> 7. **ข้อความว่างมีชุดเดียว** — `EmptyComponent` ของตารางใช้ `"No pending approvals"` / `"You have no documents waiting for your approval at the moment."` ทั้งกรณี "ไม่มีงานค้างจริง" และกรณี "ค้นหาแล้วไม่เจอ" (ต่างจากหน้า PO ที่แยกสองชุด) — เคส `TC-MA-010109` เขียนตามพฤติกรรมนี้
> 8. **ช่องค้นหายิงเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น** (`components/search-input.tsx` — `onKeyDown` ที่ `Enter` และ `handleSearch` ของปุ่ม) พิมพ์เฉย ๆ ไม่ยิง · เมื่อมีข้อความในช่อง ปุ่มมุมขวาเปลี่ยนเป็นกากบาท `aria-label="Clear search"` ซึ่งล้างค่าและยิงค้นด้วยค่าว่างทันที
> 9. **ลิงก์ปลายทางต่อชนิดเอกสาร** (`DOC_TYPE_CONFIG` ใน `approve-queue-list.tsx`) — `pr` → `/procurement/purchase-request/<id>`, `po` → `/procurement/purchase-order/<id>`, `sr` → `/store-operation/store-requisition/<id>` โดย `<id>` เป็น **UUID** ไม่ใช่เลขที่เอกสาร และเป็น `<a href>` จริง (react-router `<Link>`) — ต่างจากหน้ารายการอื่นของแอปที่เปิดเรคคอร์ดด้วย `<button>` (ดูโน้ตของ crawler ใน `CLAUDE.md`)
> 10. **คอลัมน์ Send Back** อ่านจาก `last_action.state === "reviewed"` เท่านั้น (`constant/last-action.ts`) — แปลว่า "ใบนี้ค้างอยู่ในสถานะถูกตีกลับ **ตอนนี้**" ไม่ใช่ "เคยถูกตีกลับ" · ป้ายแสดงเป็นตัวพิมพ์ใหญ่ `SEND BACK` และแถวที่ไม่เข้าเงื่อนไขจะเว้นว่าง (component คืน `null`)
>
> **Role / ข้อมูลที่ต้องเตรียม (สำคัญ — หน้านี้ผูกกับ workflow และตัวผู้ใช้)**
> - **Default role ของไฟล์นี้คือ HOD (`hod@blueledgers.com`, BU = `BLAVG`)** — ผู้อนุมัติขั้นแรกและเป็นบัญชีเดียวกับที่ `201-my-approvals.spec.ts` / `303-pr-approver-journey.spec.ts` ใช้ **ไม่ใช่ admin**: `admin@blueledgers.com` ไม่จำเป็นต้องอยู่ในขั้นอนุมัติใด ๆ คิวของ admin จึงอาจว่างเปล่า ทุกบัญชีที่อ้างถึงในไฟล์นี้ (`hod@`, `fc@`, `requestor@`) มีอยู่จริงใน `tests/test-users.ts`
> - **เคสที่รันได้กับบัญชีที่ไม่มีอะไรรออนุมัติ** (ไม่ต้อง seed): `010101`, `010102`, `010116`, `010117`, `010119`, `900101`, `900104`, `900105`, `900106`, `900107`
> - **เคสที่ต้องมีเอกสารรออนุมัติอย่างน้อย 1 ใบในคิวของ HOD**: `010103`, `010104`, `010105`, `010107`, `010108`, `010110`, `010111`, `010113`, `010115`, `010118`, `010122`, `020103`, `020104` — seed ด้วย `submitPRAsRequestor()` (`tests/pages/pr-approver.helpers.ts`) ซึ่ง `303` ใช้อยู่แล้ว
> - **เคสที่ต้องมีเอกสาร ≥ 11 ใบ (มากกว่า 1 หน้า)**: `010106`, `010112`, `010114`
> - **เคสที่ต้องมีเอกสารชนิด PO / SR ในคิว** (ไม่ใช่ PR): `020101` (PO — seed ด้วย `submitPOAsPurchaser()` จาก `tests/pages/po-approver.helpers.ts` แล้วให้ใบเดินมาถึงขั้นของผู้ใช้ที่ทดสอบ), `020102` (SR — ยังไม่มี helper ในสเปกชุดนี้ ต้อง seed เองหรือ skip)
> - **เคสที่ต้องมีเอกสารที่ถูกตีกลับค้างอยู่**: `010120`
> - **เคสที่ต้องใช้สองบัญชีพร้อมกัน**: `900102` (HOD vs FC — เอกสารต้องอยู่คนละขั้น workflow)
> - **เคสที่ต้องมีบัญชีที่สังกัดมากกว่าหนึ่ง BU**: `900103`
>
> **🚫 Blocker — การอนุมัติ/ปฏิเสธย้อนกลับไม่ได้**
> - `TC-MA-020105` เป็นเคสเดียวในไฟล์นี้ที่ **เปลี่ยนสถานะเอกสารจริงและย้อนไม่ได้** — ต้องกด Approve ที่หน้ารายละเอียดจึงจะพิสูจน์ได้ว่าใบนั้นหลุดจากคิว ใบที่อนุมัติแล้วเดินไปขั้นถัดไปและ **ใช้ซ้ำไม่ได้** ⇒ ต้อง seed ใบใหม่ทุกรอบ (`submitPRAsRequestor()`) และห้ามพึ่งข้อมูลที่มีอยู่ใน BU
> - `TC-MA-010118` **สร้างข้อมูลถาวร** (saved view เก็บฝั่ง backend ที่ `app-config`) — ตั้งชื่อ view ด้วย UID ของรอบรัน และลบทิ้งท้ายเทสผ่านเมนู ⋯ → Delete
> - เคสที่เหลือทั้งหมด **อ่านอย่างเดียว** (นำทาง, ค้นหา, เรียง, แบ่งหน้า, deep link) รันซ้ำได้ไม่จำกัด
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-MA-010101 | หัวเรื่องและคำอธิบายของหน้าคิวอนุมัติ | Low | Functional |
| TC-MA-010102 | การ์ดสรุปครบสี่ใบ และ Total Pending ถูกเลือกไว้ตั้งแต่เปิดหน้า | High | Functional |
| TC-MA-010103 | กดการ์ด Purchase Order กรองเหลือเฉพาะ PO และเขียนลง URL | High | Functional |
| TC-MA-010104 | กดการ์ด Total Pending ล้างตัวกรองประเภทเอกสาร | Medium | Functional |
| TC-MA-010105 | ลำดับคอลัมน์ของตารางคิว | Medium | Functional |
| TC-MA-010106 | เลขลำดับแถวนับต่อเนื่องข้ามหน้า | Medium | Edge Case |
| TC-MA-010107 | ค้นหาด้วยเลขที่เอกสาร ยิงเมื่อกด Enter เท่านั้น | High | Functional |
| TC-MA-010108 | ปุ่มกากบาทล้างคำค้นและคืนรายการเต็ม | Medium | Functional |
| TC-MA-010109 | ค้นแล้วไม่พบ แสดงข้อความคิวว่างและซ่อนแถบแบ่งหน้า | Medium | Edge Case |
| TC-MA-010110 | เปิดหน้าครั้งแรกเรียงตามวันที่จากเก่าไปใหม่โดยที่ URL ยังไม่มี sort | Medium | Functional |
| TC-MA-010111 | คลิกหัวคอลัมน์ Date สลับ asc↔desc โดยไม่มีสถานะไม่เรียง | High | Functional |
| TC-MA-010112 | เปลี่ยนการเรียงแล้วกลับไปหน้าแรกเสมอ | Medium | Functional |
| TC-MA-010113 | เปลี่ยนจำนวนแถวต่อหน้า | Medium | Functional |
| TC-MA-010114 | ไปหน้าถัดไปแล้ว URL และป้าย Showing อัปเดต | Medium | Functional |
| TC-MA-010115 | Deep link พร้อมตัวกรอง การเรียง และจำนวนแถวต่อหน้า | High | Functional |
| TC-MA-010116 | หน้านี้ไม่มีปุ่ม Filter แต่มีปุ่ม View | Medium | Functional |
| TC-MA-010117 | ปุ่ม View เริ่มต้นที่ "No view" และมีเมนูบันทึกมุมมอง | Low | Functional |
| TC-MA-010118 | บันทึกมุมมองจากตัวกรองประเภทเอกสารแล้วเรียกกลับมาใช้ | Medium | Functional |
| TC-MA-010119 | แถบ chip ตัวกรองว่างเสมอแม้เลือกการ์ดแล้ว | Low | Edge Case |
| TC-MA-010120 | คอลัมน์ Send Back ติดป้ายเฉพาะใบที่ค้างอยู่ในสถานะถูกตีกลับ | Medium | Functional |
| TC-MA-010121 | คอลัมน์ Status แสดงสถานะของเอกสารแบบไอคอนพร้อมข้อความ | Low | Functional |
| TC-MA-010122 | ป้ายประเภทเอกสารมีได้เพียง PR / PO / SR | Low | Functional |
| TC-MA-020101 | เปิดใบสั่งซื้อจากคิวไปหน้ารายละเอียด PO | High | Functional |
| TC-MA-020102 | เปิดใบเบิกสินค้าจากคิวไปหน้ารายละเอียด SR | High | Functional |
| TC-MA-020103 | เลขที่เอกสารเป็นลิงก์จริง ส่วนอื่นของแถวคลิกแล้วไม่ไปไหน | Medium | Functional |
| TC-MA-020104 | กด Back จากหน้ารายละเอียดกลับมาที่คิวโดยสถานะยังอยู่ | Medium | Alternate Flow |
| TC-MA-020105 | อนุมัติเอกสารแล้วใบหายจากคิวและยอดรวมลดลง | High | Happy Path |
| TC-MA-900101 | ผู้ใช้ที่ไม่มีเอกสารรออนุมัติเปิดหน้าได้ ไม่ถูกปฏิเสธสิทธิ์ | High | Authorization |
| TC-MA-900102 | ผู้อนุมัติคนละขั้นเห็นคิวคนละชุด | High | Authorization |
| TC-MA-900103 | สลับหน่วยธุรกิจแล้วคิวถูกดึงใหม่ตาม BU | High | Functional |
| TC-MA-900104 | รายการโหลดไม่สำเร็จ แสดงหน้าแจ้งข้อผิดพลาดพร้อมปุ่มลองใหม่ | Medium | Edge Case |
| TC-MA-900105 | การ์ดสรุปโหลดไม่สำเร็จ ตารางยังใช้งานได้ตามปกติ | Medium | Edge Case |
| TC-MA-900106 | คิวเป็นตารางอ่านอย่างเดียว ไม่มีช่องติ๊กหรือปุ่มอนุมัติในแถว | Medium | Functional |
| TC-MA-900107 | เข้าหน้าคิวจากเมนู Modules | Low | Smoke |

---

## TC-MA-010101 — หัวเรื่องและคำอธิบายของหน้าคิวอนุมัติ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น HOD (`hod@blueledgers.com`, BU = `BLAVG`) ผ่าน auth fixture; ไม่ต้องมีเอกสารรออนุมัติ
**Steps**
1. เปิด `/procurement/approval`
2. อ่านหัวเรื่องระดับหนึ่งและบรรทัดคำอธิบายใต้หัวเรื่อง
**Expected**
หัวเรื่อง (heading ระดับ 1) อ่านว่า "My Approval" และมีบรรทัดคำอธิบายใต้หัวเรื่องว่า "Documents waiting on you — approve, send back, or reject."

---

## TC-MA-010102 — การ์ดสรุปครบสี่ใบ และ Total Pending ถูกเลือกไว้ตั้งแต่เปิดหน้า
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; เปิด `/procurement/approval` โดย URL ไม่มี query string ใด ๆ
**Steps**
1. รอให้การ์ดสรุปโหลดเสร็จ (ไม่ใช่โครงร่างสีเทา)
2. นับการ์ดสรุปและอ่านป้ายกำกับของแต่ละใบ
3. อ่านค่า `aria-pressed` ของการ์ดทั้งสี่
**Expected**
มีการ์ดสรุป 4 ใบเป็น `<button>` เรียงตามลำดับ "Total Pending", "Purchase Request", "Purchase Order", "Store Requisition" แต่ละใบแสดงตัวเลขของตัวเอง · การ์ด "Total Pending" มี `aria-pressed="true"` ส่วนอีกสามใบเป็น `"false"` (สถานะเริ่มต้นเมื่อยังไม่มี `filter` ใน URL)

---

## TC-MA-010103 — กดการ์ด Purchase Order กรองเหลือเฉพาะ PO และเขียนลง URL
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval` และคิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. กดการ์ด "Purchase Order"
2. รอให้ตารางโหลดใหม่
3. อ่าน query string ของ URL และป้ายในคอลัมน์ Type ของทุกแถว
**Expected**
URL มี `filter=doc_type%3Apo` (หรือ `filter=doc_type:po` ก่อน encode) · การ์ด "Purchase Order" มี `aria-pressed="true"` และการ์ด "Total Pending" กลับเป็น `"false"` · ทุกแถวในตารางมีป้ายในคอลัมน์ Type เป็น "PO" เท่านั้น (ถ้าไม่มี PO ค้างอยู่ ตารางแสดงข้อความคิวว่างแทน ซึ่งถือว่าผ่านเช่นกัน)

---

## TC-MA-010104 — กดการ์ด Total Pending ล้างตัวกรองประเภทเอกสาร
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/approval` โดยมีตัวกรองประเภทเอกสารเปิดอยู่แล้ว (ต่อจาก TC-MA-010103 หรือเปิดด้วย `?filter=doc_type:pr`)
**Steps**
1. กดการ์ด "Total Pending"
2. รอให้ตารางโหลดใหม่
**Expected**
พารามิเตอร์ `filter` หายไปจาก URL (หรือกลายเป็นค่าว่าง) · การ์ด "Total Pending" กลับมา `aria-pressed="true"` และอีกสามใบเป็น `"false"` · ตารางแสดงเอกสารได้มากกว่าหนึ่งประเภทอีกครั้ง (จำนวนแถว/ยอดรวมไม่น้อยกว่าตอนที่กรองอยู่)

---

## TC-MA-010105 — ลำดับคอลัมน์ของตารางคิว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval` และคิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. อ่านหัวคอลัมน์ทั้งหมดของตารางเรียงจากซ้ายไปขวา
**Expected**
หัวคอลัมน์เรียงตามลำดับ `#`, "Document", "Send Back", "Type", "Date", "Status" ครบหกคอลัมน์และไม่มีคอลัมน์อื่น · หัวคอลัมน์ Document / Type / Date / Status เป็น `<button>` ที่กดเพื่อเรียงได้ ส่วน `#` เป็นข้อความเฉย ๆ กดไม่ได้

---

## TC-MA-010106 — เลขลำดับแถวนับต่อเนื่องข้ามหน้า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น HOD; คิวมีเอกสารมากกว่า 10 ใบ (จำนวนแถวต่อหน้าเริ่มต้นคือ 10) — ดูยอดรวมจากป้าย "Showing … of N"
**Steps**
1. เปิด `/procurement/approval` แล้วอ่านค่าในคอลัมน์ `#` ของแถวแรกและแถวสุดท้ายของหน้า 1
2. กดไปหน้า 2
3. อ่านค่าในคอลัมน์ `#` ของแถวแรกของหน้า 2
**Expected**
หน้า 1 คอลัมน์ `#` ไล่จาก 1 ถึง 10 · หน้า 2 แถวแรกเป็น 11 (ไม่ใช่ 1) — เลขลำดับคำนวณจากหน้าปัจจุบันและจำนวนแถวต่อหน้า ไม่ใช่ตำแหน่งในหน้า

---

## TC-MA-010107 — ค้นหาด้วยเลขที่เอกสาร ยิงเมื่อกด Enter เท่านั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 2 ใบ และจดเลขที่เอกสาร (คอลัมน์ Document) ของแถวแรกไว้
**Steps**
1. พิมพ์เลขที่เอกสารของแถวแรกลงช่องค้นหาโดย **ยังไม่กด Enter** แล้วสังเกตจำนวนแถวและ URL
2. กด Enter
3. อ่าน query string และจำนวนแถวอีกครั้ง
**Expected**
ขั้นที่ 1 จำนวนแถวและ URL ไม่เปลี่ยน (พิมพ์อย่างเดียวไม่ยิงค้นหา) · หลังกด Enter ในขั้นที่ 2 URL มี `search=<เลขที่เอกสาร>` และไม่มี `page` ค้างอยู่ · ตารางเหลือเฉพาะแถวที่เลขที่เอกสารตรงกับคำค้น

---

## TC-MA-010108 — ปุ่มกากบาทล้างคำค้นและคืนรายการเต็ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/approval` โดยมีคำค้นค้างอยู่ในช่องค้นหาและรายการถูกกรองแล้ว (ต่อจาก TC-MA-010107)
**Steps**
1. สังเกตไอคอนของปุ่มท้ายช่องค้นหาขณะที่มีข้อความอยู่
2. กดปุ่มนั้น
**Expected**
ขณะมีข้อความ ปุ่มท้ายช่องเป็นกากบาทที่มี `aria-label` ว่า "Clear search" (เมื่อช่องว่างจะเป็นแว่นขยาย `aria-label` "Search") · เมื่อกด ช่องค้นหาว่างลง พารามิเตอร์ `search` หายจาก URL และตารางกลับมาแสดงรายการเต็มทันทีโดยไม่ต้องกด Enter ซ้ำ

---

## TC-MA-010109 — ค้นแล้วไม่พบ แสดงข้อความคิวว่างและซ่อนแถบแบ่งหน้า
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval` และคิวมีเอกสารอย่างน้อย 1 ใบ (แถบแบ่งหน้าแสดงอยู่)
**Steps**
1. พิมพ์ข้อความที่ไม่ตรงกับเอกสารใดเลย (เช่นสตริงสุ่ม) ลงช่องค้นหาแล้วกด Enter
2. รอให้ตารางโหลดใหม่
**Expected**
ตารางแสดงกล่องว่างพร้อมหัวข้อ "No pending approvals" และคำอธิบาย "You have no documents waiting for your approval at the moment." · แถบแบ่งหน้าด้านล่างตาราง (รวมทั้งป้าย "Showing …" และตัวเลือกจำนวนแถวต่อหน้า) **หายไปทั้งแถบ** เพราะจำนวนเรคคอร์ดเป็นศูนย์ · หมายเหตุ: หน้านี้ใช้ข้อความชุดเดียวกันทั้งกรณี "ค้นไม่เจอ" และ "ไม่มีงานค้างจริง" — อย่าคาดหวังข้อความแบบ "No results match your search"

---

## TC-MA-010110 — เปิดหน้าครั้งแรกเรียงตามวันที่จากเก่าไปใหม่โดยที่ URL ยังไม่มี sort
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; เปิด `/procurement/approval` ตรง ๆ โดยไม่มี query string และคิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. ดูไอคอนข้างหัวคอลัมน์ "Date"
2. ดูไอคอนข้างหัวคอลัมน์อื่น
3. อ่าน query string ของ URL
**Expected**
หัวคอลัมน์ "Date" แสดงลูกศรชี้ขึ้น (เรียงจากน้อยไปมาก = เอกสารที่รอนานที่สุดอยู่บนสุด) ส่วนหัวคอลัมน์อื่นแสดงไอคอนลูกศรสองทิศ (ยังไม่ถูกเรียง) · URL **ไม่มี** พารามิเตอร์ `sort` — ค่าเริ่มต้นถูกประกาศไว้ฝั่ง UI ไม่ได้มาจาก URL

---

## TC-MA-010111 — คลิกหัวคอลัมน์ Date สลับ asc↔desc โดยไม่มีสถานะไม่เรียง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/approval` โดยยังไม่เคยแตะการเรียง (ต่อจาก TC-MA-010110)
**Steps**
1. คลิกหัวคอลัมน์ "Date" ครั้งที่ 1 แล้วอ่านไอคอนและ URL
2. คลิกครั้งที่ 2 แล้วอ่านไอคอนและ URL
3. คลิกครั้งที่ 3 แล้วอ่านไอคอนและ URL
**Expected**
คลิกครั้งที่ 1 ได้ `sort=doc_date%3Adesc` ใน URL และลูกศรชี้ลง · คลิกครั้งที่ 2 ได้ `sort=doc_date%3Aasc` และลูกศรชี้ขึ้น · คลิกครั้งที่ 3 กลับไปเป็น `desc` — **ไม่มีคลิกใดที่ทำให้คอลัมน์กลับไปอยู่สถานะ "ไม่เรียง"** (ไอคอนลูกศรสองทิศไม่กลับมาที่คอลัมน์ Date อีก)

---

## TC-MA-010112 — เปลี่ยนการเรียงแล้วกลับไปหน้าแรกเสมอ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารมากกว่า 10 ใบเพื่อให้มีมากกว่าหนึ่งหน้า
**Steps**
1. เปิด `/procurement/approval` แล้วกดไปหน้า 2 (ยืนยันว่า URL มี `page=2`)
2. คลิกหัวคอลัมน์ "Date"
3. อ่าน query string และป้าย "Showing …"
**Expected**
หลังเปลี่ยนการเรียง พารามิเตอร์ `page` ถูกล้าง (หรือกลับเป็น 1) และป้ายอ่านว่า "Showing 1–…" — ไม่ค้างอยู่ที่หน้า 2 ซึ่งอาจว่างเปล่าหลังเรียงใหม่

---

## TC-MA-010113 — เปลี่ยนจำนวนแถวต่อหน้า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval` และคิวมีเอกสารอย่างน้อย 1 ใบ (แถบแบ่งหน้าแสดงอยู่)
**Steps**
1. เปิดตัวเลือก "Rows per page" ที่แถบแบ่งหน้าแล้วอ่านตัวเลือกทั้งหมด
2. เลือก 25
3. อ่าน query string, ป้าย "Showing …" และจำนวนแถวในตาราง
**Expected**
ตัวเลือกมีให้เลือก 5, 10, 25, 50 และ 100 โดยค่าเริ่มต้นคือ 10 · หลังเลือก 25 URL มี `perpage=25` ป้ายอ่านว่า "Showing 1–<N> of <TOTAL>" โดย `<N>` ไม่เกิน 25 และจำนวนแถวในตารางไม่เกิน 25

---

## TC-MA-010114 — ไปหน้าถัดไปแล้ว URL และป้าย Showing อัปเดต
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารมากกว่า 10 ใบ
**Steps**
1. เปิด `/procurement/approval` แล้วอ่านป้าย "Showing …" ของหน้า 1
2. กดปุ่มไปหน้าถัดไป (`aria-label` "Go to next page")
3. อ่าน query string และป้าย "Showing …" อีกครั้ง
**Expected**
หน้า 1 ป้ายอ่านว่า "Showing 1–10 of <TOTAL>" · หลังกดไปหน้าถัดไป URL มี `page=2` ป้ายอ่านว่า "Showing 11–… of <TOTAL>" และปุ่มไปหน้าแรก/หน้าก่อนหน้ากดได้แล้ว

---

## TC-MA-010115 — Deep link พร้อมตัวกรอง การเรียง และจำนวนแถวต่อหน้า
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. เปิด URL `/procurement/approval?filter=doc_type:pr&sort=doc_date:desc&perpage=25` ตรง ๆ (ไม่ผ่านการคลิกในหน้า)
2. รอให้การ์ดสรุปและตารางโหลดเสร็จ
3. ตรวจการ์ดที่ถูกเลือก ไอคอนเรียงของคอลัมน์ Date และค่าของตัวเลือก Rows per page
**Expected**
การ์ด "Purchase Request" มี `aria-pressed="true"` · หัวคอลัมน์ "Date" แสดงลูกศรชี้ลง · ตัวเลือก Rows per page แสดงค่า 25 · ทุกแถวมีป้ายประเภทเป็น "PR" — สถานะทั้งหมดถูกคืนจาก URL โดยไม่ต้องคลิกอะไรเลย

---

## TC-MA-010116 — หน้านี้ไม่มีปุ่ม Filter แต่มีปุ่ม View
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; เปิด `/procurement/approval` (ขนาดหน้าจอแบบ desktop); ไม่ต้องมีเอกสารรออนุมัติ
**Steps**
1. ดูแถบเครื่องมือเหนือการ์ดสรุป
**Expected**
แถบเครื่องมือมีเพียงช่องค้นหาและปุ่มเลือกมุมมอง (View) เท่านั้น — **ไม่มีปุ่ม "Filter"** เพราะหน้านี้ไม่ได้ประกาศ field สำหรับกรองไว้เลย (การกรองประเภทเอกสารทำผ่านการ์ดสรุปแทน) · การกรองทั้งหมดของหน้านี้จึงมีทางเดียวคือการ์ดสรุปและช่องค้นหา

---

## TC-MA-010117 — ปุ่ม View เริ่มต้นที่ "No view" และมีเมนูบันทึกมุมมอง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; เปิด `/procurement/approval` โดย URL ไม่มีพารามิเตอร์ `sv`
**Steps**
1. อ่านข้อความบนปุ่มเลือกมุมมอง
2. กดเปิดเมนูของปุ่มนั้น
**Expected**
ปุ่มอ่านว่า "No view" · เมนูที่เปิดมีรายการ "No view", กลุ่ม "My views" / "Business unit views" (หรือข้อความ "No views yet — set filters, then save" เมื่อยังไม่มีมุมมองใด) และรายการท้ายสุด "Save current filters as view" เสมอ

---

## TC-MA-010118 — บันทึกมุมมองจากตัวกรองประเภทเอกสารแล้วเรียกกลับมาใช้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval`; **สร้างข้อมูลจริง** — มุมมองที่บันทึกถูกเก็บฝั่ง backend ต้องตั้งชื่อด้วย UID ของรอบรันและลบทิ้งท้ายเทส
**Steps**
1. กดการ์ด "Purchase Request" เพื่อให้มีตัวกรองค้างอยู่
2. เปิดเมนูปุ่มมุมมอง แล้วเลือก "Save current filters as view"
3. ตั้งชื่อมุมมอง เลือกขอบเขต "Only me" แล้วกด Save
4. กดการ์ด "Total Pending" เพื่อล้างตัวกรอง จากนั้นเปิดเมนูมุมมองแล้วเลือกมุมมองที่เพิ่งบันทึก
5. (ล้างข้อมูล) เปิดเมนูมุมมอง กดปุ่ม ⋯ ของมุมมองนั้น แล้วเลือก Delete
**Expected**
หลังบันทึกในขั้นที่ 3 ขึ้นข้อความยืนยันว่าบันทึกมุมมองแล้ว และปุ่มมุมมองเปลี่ยนจาก "No view" เป็นชื่อที่ตั้งไว้ · หลังเลือกมุมมองในขั้นที่ 4 URL มีพารามิเตอร์ `sv=<id>` และการ์ด "Purchase Request" กลับมา `aria-pressed="true"` อีกครั้ง

---

## TC-MA-010119 — แถบ chip ตัวกรองว่างเสมอแม้เลือกการ์ดแล้ว
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval`
**Steps**
1. ดูพื้นที่ใต้แถบเครื่องมือตอนยังไม่เลือกการ์ดใด
2. กดการ์ด "Purchase Order" แล้วดูพื้นที่เดิมอีกครั้ง
**Expected**
ไม่มี chip ตัวกรองและไม่มีปุ่ม "Clear all" ปรากฏในทั้งสองขั้น — ตัวกรองประเภทเอกสารของหน้านี้ถูกประกาศเป็น field ที่ซ่อนไว้จึงไม่ผลิต chip โดยตั้งใจ · สัญญาณเดียวที่บอกว่ากำลังกรองอยู่คือ `aria-pressed` ของการ์ด

---

## TC-MA-010120 — คอลัมน์ Send Back ติดป้ายเฉพาะใบที่ค้างอยู่ในสถานะถูกตีกลับ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีทั้งเอกสารที่ถูกตีกลับค้างอยู่ (การกระทำล่าสุดคือการตีกลับ) และเอกสารปกติอย่างละอย่างน้อย 1 ใบ
**Steps**
1. หาแถวของเอกสารที่ถูกตีกลับ แล้วอ่านคอลัมน์ "Send Back"
2. อ่านคอลัมน์เดียวกันของแถวเอกสารปกติ
**Expected**
แถวของเอกสารที่ถูกตีกลับแสดงป้ายไอคอน+ข้อความ "SEND BACK" (ตัวพิมพ์ใหญ่ จัดกึ่งกลางคอลัมน์ ไม่มีกรอบ chip) · แถวเอกสารปกติเว้นคอลัมน์นี้ว่าง ไม่มีข้อความใด ๆ · ป้ายอ่านจากการกระทำ **ล่าสุด** เท่านั้น ใบที่เคยถูกตีกลับแต่ผู้ขอส่งกลับมาแล้วจะไม่ติดป้าย

---

## TC-MA-010121 — คอลัมน์ Status แสดงสถานะของเอกสารแบบไอคอนพร้อมข้อความ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. อ่านเซลล์ในคอลัมน์ "Status" ของแถวแรก
**Expected**
เซลล์แสดงสถานะเป็นไอคอนคู่กับข้อความ (เช่น IN PROGRESS / DRAFT) จัดกึ่งกลางคอลัมน์ ไม่ใช่ข้อความดิบของสถานะจาก API และไม่ใช่ช่องว่าง

---

## TC-MA-010122 — ป้ายประเภทเอกสารมีได้เพียง PR / PO / SR
**Priority:** Low · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; อยู่ที่ `/procurement/approval` โดยไม่กรองประเภทเอกสาร (การ์ด Total Pending ถูกเลือกอยู่)
**Steps**
1. อ่านป้ายในคอลัมน์ "Type" ของทุกแถวในหน้าปัจจุบัน
**Expected**
ทุกแถวมีป้ายประเภทเอกสารเป็นหนึ่งในสามค่าคือ "PR", "PO" หรือ "SR" — ไม่มีแถวใดที่คอลัมน์นี้ว่างหรือแสดงรหัสประเภทดิบอื่น

---

## TC-MA-020101 — เปิดใบสั่งซื้อจากคิวไปหน้ารายละเอียด PO
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็นผู้อนุมัติที่มีใบสั่งซื้อรออนุมัติอยู่ในคิว (เช่น FC — `fc@blueledgers.com` ซึ่ง `403-po-approver-journey.spec.ts` ใช้อยู่) — seed ด้วย `submitPOAsPurchaser()` แล้วให้ใบเดินมาถึงขั้นของผู้ใช้ที่ทดสอบ; ยังไม่มีสเปกใดครอบเส้นทางนี้เพราะ `403` ยิงไปที่ URL ที่ไม่มีใน router
**Steps**
1. เปิด `/procurement/approval`
2. กดการ์ด "Purchase Order" เพื่อกรองเหลือเฉพาะ PO
3. คลิกเลขที่เอกสารในคอลัมน์ "Document" ของแถวแรก
**Expected**
เบราว์เซอร์ไปที่ `/procurement/purchase-order/<uuid>` โดยส่วนท้ายของ path เป็น UUID (ไม่ใช่เลขที่เอกสารที่แสดงบนลิงก์) และหน้ารายละเอียดใบสั่งซื้อโหลดขึ้นมาโดยแสดงเลขที่เอกสารเดียวกับที่คลิก

---

## TC-MA-020102 — เปิดใบเบิกสินค้าจากคิวไปหน้ารายละเอียด SR
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login เป็นผู้อนุมัติที่มีใบเบิกสินค้า (Store Requisition) รออนุมัติอยู่ในคิว — ยังไม่มี helper สำหรับ seed SR ในสเปกชุดนี้ ต้อง seed เองหรือ skip เมื่อการ์ด "Store Requisition" เป็น 0
**Steps**
1. เปิด `/procurement/approval`
2. กดการ์ด "Store Requisition" เพื่อกรองเหลือเฉพาะ SR
3. คลิกเลขที่เอกสารในคอลัมน์ "Document" ของแถวแรก
**Expected**
เบราว์เซอร์ไปที่ `/store-operation/store-requisition/<uuid>` — คิวข้ามโมดูลได้ ไม่ได้จำกัดอยู่แต่ในกลุ่ม `/procurement` — และหน้ารายละเอียดใบเบิกสินค้าโหลดขึ้นมา

---

## TC-MA-020103 — เลขที่เอกสารเป็นลิงก์จริง ส่วนอื่นของแถวคลิกแล้วไม่ไปไหน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. ตรวจว่าเลขที่เอกสารในคอลัมน์ "Document" ของแถวแรกเป็นองค์ประกอบชนิดลิงก์ (`<a>`) ที่มี `href`
2. คลิกที่เซลล์คอลัมน์ "Date" ของแถวเดียวกัน (ไม่ใช่ที่ลิงก์)
**Expected**
เลขที่เอกสารเป็นลิงก์จริงที่มี `href` ชี้ไปหน้ารายละเอียดของเอกสารนั้น (เปิดแท็บใหม่/คัดลอกลิงก์ได้) · การคลิกเซลล์อื่นของแถวไม่ทำให้ URL เปลี่ยน — แถวทั้งแถวไม่ได้เป็นปุ่มนำทาง ต่างจากหน้ารายการอื่นของแอป

---

## TC-MA-020104 — กด Back จากหน้ารายละเอียดกลับมาที่คิวโดยสถานะยังอยู่
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. เปิด `/procurement/approval` กดการ์ด "Purchase Request" แล้วคลิกหัวคอลัมน์ "Date" หนึ่งครั้ง (ให้ URL มีทั้ง `filter` และ `sort`)
2. คลิกเลขที่เอกสารของแถวแรกเพื่อเข้าหน้ารายละเอียด
3. กดปุ่มย้อนกลับของเบราว์เซอร์
**Expected**
กลับมาที่ `/procurement/approval` โดย query string ยังมี `filter=doc_type:pr` และ `sort=doc_date:desc` ครบ · การ์ด "Purchase Request" ยัง `aria-pressed="true"` และลูกศรเรียงของคอลัมน์ Date ยังชี้ลง — ไม่ถูกรีเซ็ตกลับเป็นค่าเริ่มต้น

---

## TC-MA-020105 — อนุมัติเอกสารแล้วใบหายจากคิวและยอดรวมลดลง
**Priority:** High · **Test Type:** Happy Path
**Preconditions**
Login เป็น HOD; **ต้อง seed ใบขอซื้อใหม่ทุกรอบ** ด้วย `submitPRAsRequestor()` ให้เดินมาถึงขั้นของ HOD; **🚫 destructive — เปลี่ยนสถานะเอกสารจริงและย้อนไม่ได้** ใบที่อนุมัติแล้วใช้ซ้ำไม่ได้
**Steps**
1. เปิด `/procurement/approval` จดค่าตัวเลขบนการ์ด "Total Pending" และยืนยันว่าเห็นแถวของใบที่ seed ไว้
2. คลิกเลขที่เอกสารของใบนั้นเพื่อเข้าหน้ารายละเอียด
3. อนุมัติใบนั้นให้เสร็จตามขั้นตอนของโมดูล (เข้า Edit mode → เลือกทุกบรรทัด → Approve → ยืนยันใน dialog)
4. กลับมาที่ `/procurement/approval` แล้วโหลดหน้าใหม่
**Expected**
ใบที่เพิ่งอนุมัติไม่ปรากฏในคิวอีก (ค้นด้วยเลขที่เอกสารแล้วได้กล่องว่าง) และตัวเลขบนการ์ด "Total Pending" ลดลง 1 จากค่าที่จดไว้ในขั้นที่ 1 · หมายเหตุสำหรับผู้เขียนสเปก: การ์ดสรุปมี staleTime 1 นาที — ให้บังคับโหลดหน้าใหม่ อย่าอาศัยการอัปเดตอัตโนมัติ

---

## TC-MA-900101 — ผู้ใช้ที่ไม่มีเอกสารรออนุมัติเปิดหน้าได้ ไม่ถูกปฏิเสธสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login เป็น requestor (`requestor@blueledgers.com`) ซึ่งไม่ได้เป็นผู้อนุมัติขั้นใด — เมนูของหน้านี้ไม่ได้ประกาศ permission หรือ license feature ไว้ จึงไม่มี route guard
**Steps**
1. เปิด URL `/procurement/approval` ตรง ๆ
2. รอให้หน้าโหลดเสร็จ
**Expected**
หน้าโหลดตามปกติที่ `/procurement/approval` — **ไม่มี**กล่องปฏิเสธสิทธิ์ (`role="alert"` พร้อมหัวข้อ Access denied) และ **ไม่ถูก redirect** ไปหน้าอื่น · หัวเรื่อง "My Approval" และการ์ดสรุปทั้งสี่ใบแสดงผล · ตารางแสดงกล่อง "No pending approvals" เพราะคิวเป็นรายการรายบุคคลที่ backend คัดมาให้ ไม่ใช่เพราะถูกบล็อก

---

## TC-MA-900102 — ผู้อนุมัติคนละขั้นเห็นคิวคนละชุด
**Priority:** High · **Test Type:** Authorization
**Preconditions**
มีใบขอซื้อที่ค้างอยู่ **ขั้น HOD** อย่างน้อย 1 ใบ (seed ด้วย `submitPRAsRequestor()`) และเอกสารที่ค้างอยู่ **ขั้น FC** อย่างน้อย 1 ใบ; มี session ของทั้ง `hod@blueledgers.com` และ `fc@blueledgers.com` (BU = `BLAVG` ทั้งคู่)
**Steps**
1. เปิด `/procurement/approval` ด้วย session ของ HOD แล้วจดเลขที่เอกสารทุกแถวในหน้าแรก
2. เปิด `/procurement/approval` ด้วย session ของ FC แล้วจดเลขที่เอกสารทุกแถวในหน้าแรก
3. เทียบสองชุด
**Expected**
ใบที่ค้างอยู่ขั้น HOD ปรากฏในคิวของ HOD และ **ไม่** ปรากฏในคิวของ FC · สองชุดไม่เหมือนกันทั้งหมด (คิวเป็นของ "เอกสารที่รอคุณอยู่" รายบุคคล ไม่ใช่รายการเอกสารทั้ง BU) · ตัวเลขบนการ์ด "Total Pending" ของสองบัญชีต่างกัน

---

## TC-MA-900103 — สลับหน่วยธุรกิจแล้วคิวถูกดึงใหม่ตาม BU
**Priority:** High · **Test Type:** Functional
**Preconditions**
Login ด้วยบัญชีผู้อนุมัติที่สังกัดมากกว่าหนึ่ง BU และมีเอกสารรออนุมัติต่างกันในแต่ละ BU; อยู่ที่ `/procurement/approval`
**Steps**
1. จดเลขที่เอกสารทุกแถวในหน้าแรกของ BU ปัจจุบัน
2. เปลี่ยน BU ด้วยตัวสลับ BU บน navbar
3. รอให้ตารางโหลดใหม่แล้วจดรายการอีกครั้ง
**Expected**
ตารางถูกดึงใหม่ด้วย `bu_code` ของ BU ที่เลือก และชุดเลขที่เอกสารเปลี่ยนไปตาม BU (ไม่ใช่รายการเดิมค้างอยู่) · หมายเหตุ: ตัวเลขบนการ์ดสรุปมาจาก endpoint ที่ไม่ได้ส่ง `bu_code` จึง **ไม่ควร** เขียน assertion ผูกกับ BU ที่เลือกไว้กับตัวเลขบนการ์ด

---

## TC-MA-900104 — รายการโหลดไม่สำเร็จ แสดงหน้าแจ้งข้อผิดพลาดพร้อมปุ่มลองใหม่
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น HOD; ดักจับเครือข่าย (route interception) ให้คำขอ `**/api/my-pending**` คืนสถานะผิดพลาด (เช่น 500) เฉพาะครั้งแรก
**Steps**
1. เปิด `/procurement/approval` ขณะที่คำขอรายการถูกทำให้ล้มเหลว
2. รอให้หน้าแสดงผล
3. ปลดการดักจับ แล้วกดปุ่มลองใหม่ (Retry) บนกล่องข้อผิดพลาด
**Expected**
เนื้อหาของหน้าถูกแทนด้วยกล่องแจ้งข้อผิดพลาดพร้อมปุ่มลองใหม่ — **ไม่มี**การ์ดสรุปและไม่มีตารางให้เห็น (กล่องนี้แทนที่ทั้งเนื้อหน้า) · หลังกดลองใหม่ คำขอถูกยิงซ้ำและหน้าแสดงการ์ดสรุปกับตารางตามปกติ

---

## TC-MA-900105 — การ์ดสรุปโหลดไม่สำเร็จ ตารางยังใช้งานได้ตามปกติ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ; ดักจับเครือข่ายให้คำขอ `**/api/my-approve/pending**` (endpoint ของการ์ดสรุป) คืนสถานะผิดพลาด โดยปล่อยคำขอรายการให้ผ่านปกติ
**Steps**
1. เปิด `/procurement/approval`
2. อ่านตัวเลขบนการ์ดทั้งสี่ใบ
3. ใช้งานตาราง — กดการ์ด "Purchase Request" เพื่อกรอง
**Expected**
การ์ดทั้งสี่ยังแสดงอยู่และตัวเลขอ่านว่า 0 ทุกใบ (ค่าตั้งต้นเมื่อไม่มีข้อมูลสรุป) · **ไม่มี**กล่องแจ้งข้อผิดพลาดมาแทนทั้งหน้า เพราะกล่องนั้นผูกกับคำขอรายการเท่านั้น · ตารางยังแสดงเอกสารและการกดการ์ดยังกรองรายการได้ตามปกติ

---

## TC-MA-900106 — คิวเป็นตารางอ่านอย่างเดียว ไม่มีช่องติ๊กหรือปุ่มอนุมัติในแถว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น HOD; คิวมีเอกสารอย่างน้อย 1 ใบ
**Steps**
1. ตรวจแถวแรกของตารางว่ามี checkbox หรือไม่
2. ตรวจว่าในแถวมีปุ่ม Approve / Reject / Send Back / เมนูจุดสามจุดหรือไม่
3. ตรวจแถบเครื่องมือด้านบนว่ามีปุ่มแบบ bulk (เช่น Select Multiple / Bulk Approve) หรือไม่
**Expected**
ไม่มี checkbox ในแถว ไม่มีปุ่มตัดสินใจอนุมัติในแถว และไม่มีปุ่ม bulk ใด ๆ บนหน้า — คิวนี้ออกแบบให้อ่านอย่างเดียว ทางเข้าเดียวสู่การอนุมัติคือลิงก์เลขที่เอกสารที่พาไปหน้ารายละเอียดของโมดูลนั้น

---

## TC-MA-900107 — เข้าหน้าคิวจากเมนู Modules
**Priority:** Low · **Test Type:** Smoke
**Preconditions**
Login เป็น HOD; อยู่ที่หน้าใดก็ได้ที่มี navbar (เช่น `/dashboard`)
**Steps**
1. เปิดเมนู Modules
2. เลือกกลุ่ม Procurement แล้วกดรายการ "My Approval"
**Expected**
เบราว์เซอร์ไปที่ `/procurement/approval` และหน้าคิวอนุมัติโหลดขึ้นมาพร้อมหัวเรื่อง "My Approval" — รายการนี้มองเห็นได้ทุก role เพราะไม่ได้ผูกกับสิทธิ์หรือ license feature ใด
