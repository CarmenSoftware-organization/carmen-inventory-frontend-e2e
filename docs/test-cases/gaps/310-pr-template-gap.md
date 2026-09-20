# Purchase Request Template (ตัวเทมเพลตเอง) — Gap Report

_เคสที่ **สเปกอัตโนมัติยังไม่ครอบจริง** เท่านั้น — "ไม่ครอบ" ในที่นี้ไม่ได้แปลว่า "ไม่มีเคส" แต่แปลว่า **มีเคสที่อ้างว่าทดสอบแล้วไม่ได้ทดสอบ**: `bun audit:spec-health` วัด `tests/310-pr-template.spec.ts` ได้ **61 เคสที่รันจริง แต่ 51 เคสไม่มี `expect(...)` เลย** และทั้งไฟล์มี assertion รวม 13 ครั้ง ไฟล์นี้จึงเขียนเคสที่มี oracle ที่ **ล้มได้จริง** ให้พฤติกรรมที่เคสเดิมอ้างถึงแต่ไม่เคยยืนยัน_

**Module:** Purchase Request Template — ตัวเทมเพลตเอง (สร้าง / แก้ / ลบ / รายการ)
**Frontend route:** `routes/procurement/purchase-request-template/` (`purchase-request-template.route.tsx` → `prt-component.tsx` · `purchase-request-template-new.route.tsx` → `prt-form.tsx` · `purchase-request-template-edit.route.tsx` → `prt-edit-content.tsx` → `prt-form.tsx`)  •  **URL:** `/procurement/purchase-request-template` · `/new` · `/:id`
**Prefix:** `PRT` (ชุดเดียวกับสเปก — gap report ใช้ prefix ของสเปกและไม่ต้องมีแถวของตัวเองใน `docs/test-id-scheme.md`)
**Spec ที่ครอบส่วนที่เหลือ:** `tests/310-pr-template.spec.ts`
**Total test cases:** 49

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> **ช่วงเลขที่เลือก — ไม่ต้องลงทะเบียน section เพิ่ม** — `docs/test-id-scheme.md` ลงทะเบียน `PRT` ไว้ที่ `01–11, 20–29, 90` สเปกใช้ไปแล้ว `01`–`11`, `21`, `22`, `23` และ `90` (หัวข้อในคอมเมนต์) **section `20` ว่างทั้งบล็อก** จึงใช้ `TC-PRT-2000xx` ทั้งไฟล์ — อยู่ในชุดที่ลงทะเบียนแล้ว ไม่ต้องแก้ scheme และไม่ชนกับ ID ใดในสเปกหรือ helper (ตรวจด้วย `grep -rho 'TC-PRT-[0-9]*' tests/ | sort -u`)
>
> **เส้นแบ่งกับ `301-pr-from-template-gap.md`** — ไฟล์นั้น (prefix `PR` บล็อก `10`, 25 เคส) ครอบ **"ใช้เทมเพลตสร้างใบขอซื้อ"** ซึ่งอยู่คนละ route กันคือ `/procurement/purchase-request/from-template` ในโมดูล PR · ไฟล์นี้ครอบ **"ตัวเทมเพลตเอง"** คือ CRUD + หน้ารายการที่ `/procurement/purchase-request-template*` เท่านั้น **ไม่มีเคสไหนในไฟล์นี้แตะ wizard สร้าง PR** และไม่มีเคสไหนในไฟล์นั้นแตะฟอร์มแม่แบบ
>
> **เคสเดิมที่มี assertion จริง — ห้ามเขียนซ้ำ** (นี่คือทั้งหมดที่ถือว่าครอบแล้ว):
> - `TC-PRT-010050` — active BU = `BLAVG` (`expect(active?.code).toBe(BU_CODE)` + ป้ายของ BU switcher) · 2 assertion
> - `TC-PRT-010004` — กด Save บนฟอร์ม `/new` ที่ว่าง แล้ว `tpl.anyError().first()` ปรากฏ · 1 assertion
> - `TC-PRT-220003` — ลำดับการกระทำเหมือน `TC-PRT-010004` ทุกประการ (goto `/new` → Save → `anyError`) ต่างกันแค่ชื่อเคส · 1 assertion
> - `TC-PRT-030003` / `TC-PRT-050002` — `toBeDisabled()` แต่ยิงเฉพาะเมื่อปุ่มมีอยู่ ถ้าไม่มีปุ่มจะตกเข้า `expect(true).toBe(true)` · อย่างละ 2 assertion
> - `TC-PRT-010002`, `TC-PRT-040003`, `TC-PRT-210002`, `TC-PRT-220005` — `expect(true).toBe(true)` ล้วน ล้มไม่ได้ · อย่างละ 1
> - `TC-PRT-100004` — `expect(onListPage || onUnauthorized).toBeTruthy()` ซึ่งเป็นจริงทั้งสองทาง ล้มไม่ได้ · 1
>
>   รวม 13 assertion พอดี · เคสที่ **ล้มได้จริง** มีแค่ `TC-PRT-010050`, `TC-PRT-010004`, `TC-PRT-220003` (และบางส่วนของ `030003`/`050002`) ที่เหลืออีก 51 เคสเป็น `gotoList()` เปล่า ๆ
>
> **ข้อเท็จจริงจาก source ที่คนแปลงเป็นสเปกต้องรู้ — UI ที่เคสเดิมอ้างถึงไม่มีอยู่ในโมดูลนี้ (บันทึกไว้เฉย ๆ ไม่เขียนเป็นเคส):** ฟอร์มแม่แบบมีฟิลด์ครบชุดเท่านี้ — หัวเอกสาร: Workflow, Name, Description, สวิตช์ Active (`prt-general-fields.tsx`) · ตารางรายการ: `#`, Location, Product, Requested (จำนวน + หน่วยรวมอยู่ในช่องเดียว), Currency, Delivery Point, ปุ่มลบแถว (`use-prt-item-table.tsx:262-430`) **ไม่มี** Budget Code, Account Code, Price/Pricing, Item Name, แท็บ Items, แท็บ Bulk Operations, ปุ่ม Clone, ปุ่ม Set as Default / Manage Templates, ปุ่ม Browse Catalog, ปุ่ม Use Template, usage history และ **ไม่มี department บนหัวเอกสารเลย** (คอมเมนต์ยืนยันที่ `types/purchase-request.ts:120-122`) — เคสเดิมทั้งบล็อก `05` (Clone), `06` (Set as Default), `11` (Bulk Operations), `21` (Convert to PR), `22` (Budget Code), `23` (Browse Catalog) และเคสที่พูดถึง Price/Budget Code ในบล็อก `01`/`07` จึงอ้างถึงของที่ไม่เคยมี ไฟล์นี้ **ไม่เขียนเคสยืนยันว่า "ฟีเจอร์ยังไม่ทำงาน"** และไม่เขียนเคสให้ของเหล่านั้นเลย
>
> **ข้อเท็จจริงเรื่องสิทธิ์** — `routes/router.tsx:175-188` ผูกทั้งสาม route ไว้ตรง ๆ **ไม่มี route guard สักชั้น** ผู้ใช้ที่ล็อกอินแล้วทุกคนเปิด `/procurement/purchase-request-template`, `/new` และ `/:id` ได้ · ปุ่ม **Add Purchase Request Template** บนหน้ารายการเป็น `<Button onClick={navigate(...)}>` เปล่า ๆ ไม่มีการเช็คสิทธิ์ใด ๆ (`prt-component.tsx:186-195`) · สิทธิ์ถูกบังคับที่ **ปุ่มในฟอร์มกับเมนูของแถว** เท่านั้น ผ่าน `FormToolbar` (`saveDenied`/`editDenied`/`deleteDenied`) และ `useDeleteGate` ซึ่ง **ไม่ซ่อนปุ่ม** แต่ตั้ง `aria-disabled` + `opacity-50` แล้วกดทีขึ้นกล่อง "Permission Denied" (`components/permission-denied-dialog.tsx`) — คนละพฤติกรรมกับที่เคสเดิมเขียนไว้ว่า "redirect ไปหน้า access denied" หรือ "ปุ่มถูกซ่อน"
>
> **ข้อเท็จจริงอื่นที่ใช้เขียน oracle** — (1) เปิดเทมเพลตด้วย **ปุ่มชื่อในคอลัมน์ Name** (`CellAction` = `<button type="button">`) ไม่ใช่คลิกทั้งแถว การ `row.click()` ของเคสเดิมจึงไม่เปิดอะไรเลย · (2) หน้า `/:id` **คือฟอร์มเดียวกับ `/new`** ในโหมด `view` ปุ่ม Edit สลับโหมดในหน้าเดิม ไม่เปลี่ยน URL (`prt-form.tsx:44-47`) · (3) ช่องค้นหายิง `onSearch` **เมื่อกด Enter หรือกดไอคอนแว่นเท่านั้น** ไม่ใช่ทุกตัวอักษร (`components/search-input.tsx:36-45`) และเขียนลง URL param `search` · (4) ตัวกรองมีชุดเดียวคือ Status (`is_active|bool:true` / `is_active|bool:false`) มีผลทันทีที่เลือก ไม่ต้องกด Apply (`prt-component.tsx:64-77`, `components/ui/status-filter.tsx:55-58`) · (5) คอลัมน์ Created/Updated **ซ่อนเป็นค่าเริ่มต้น** เปิดได้จากเมนู Toggle columns (`use-prt-table.tsx:101-104`) · (6) เมนูของแถวมีแค่ Activity กับ Delete — `usePrtTable` ไม่ส่ง `onEdit` ให้ `actionColumn` · (7) ปุ่ม **Add Item** ยังกดได้ตอนไม่มี workflow แต่จะขึ้น toast `"Select a workflow first, then add items."` แล้วไม่เพิ่มแถว (`prt-item-fields.tsx:53-58`) · (8) ช่อง Product **ถูก disable จนกว่าจะเลือก Location** (`lookup-product-in-location.tsx:105`) · (9) แถวใหม่ถูก **prepend ขึ้นบนสุด** และคัดลอกคลัง + จุดส่งของจากแถวแรกปัจจุบัน พร้อมเติมสกุลเงินตั้งต้นของ BU (`prt-item-fields.tsx:60-82`) · (10) ช่องจำนวนเป็น `input[type=number] min=0` และ **ช่องว่างถูกเขียนกลับเป็น 0 ไม่ใช่ NaN** (`use-prt-item-table.tsx:225-238`) 0 เป็นค่าที่ใส่ได้จริง (schema `min(0)`) · (11) สร้างเสร็จ `navigate(..., { replace: true })` — Back ของเบราว์เซอร์จึงกลับหน้ารายการ ไม่ใช่ `/new` (`prt-form.tsx:117-126`) · (12) ปุ่ม Back ในฟอร์มกลับหน้ารายการเสมอ ไม่ใช่ history back (`prt-form.tsx:139-149`) · (13) ข้อความ toast/ฟอร์มทั้งหมดเป็นภาษาอังกฤษจาก `messages/en.json`
>
> **Blocker ที่ต้องแก้ก่อนแปลงเป็นสเปก:**
> - **ข้อมูล** — เคสส่วนใหญ่ต้องมีเทมเพลตอย่างน้อย 1 ใบที่มีรายการอย่างน้อย 1 แถวใน BU `BLAVG` ปัจจุบันยังไม่มี seeder ของโมดูลนี้ ทางเดียวคือสร้างผ่าน UI ในเคส `TC-PRT-200032` แล้วให้เคสอื่นพึ่งลำดับ (ต้องห่อด้วย `test.describe.serial`) · การสร้างต้องมี PR workflow ที่ `can_create = true`, คลังที่ผู้ใช้เข้าถึงได้ และสินค้าในคลังนั้น
> - **บัญชีสำหรับเคสสิทธิ์** — `TC-PRT-200047`–`TC-PRT-200049` ต้องใช้บัญชีที่ **ไม่มี** `procurement.purchase_request_template.create` / `.update` / `.delete` และ **ไม่ใช่ admin ของ BU** (`useCan` bypass ให้ `system_level === "admin"` ทั้งหมด) ปัจจุบัน `tests/test-users.ts` ยังไม่มีบัญชีที่ยืนยันได้ว่าเข้าเงื่อนไขนี้ — เคสเดิมใช้ `requestor@blueledgers.com` โดยไม่เคยตรวจ ต้องยืนยัน permission list ของบัญชีก่อน ไม่งั้นเคสจะกลายเป็น dynamic skip
>
> เมื่อเคสใดถูกเขียนเป็นสเปกแล้วให้ลบออกจากไฟล์นี้ และเมื่อหมดทุกเคสให้ลบไฟล์ทิ้ง

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PRT-200001 | หัวหน้ารายการแสดงชื่อโมดูล คำอธิบาย และป้ายจำนวนรายการ | Medium | Smoke |
| TC-PRT-200002 | ตารางแสดงคอลัมน์ตั้งต้นครบ และ Created/Updated ถูกซ่อนไว้ | Medium | Functional |
| TC-PRT-200003 | เปิดคอลัมน์ Created จากเมนู Toggle columns | Low | Functional |
| TC-PRT-200004 | คลิกหัวคอลัมน์ Name แล้ว URL ได้ sort=name:asc | Medium | Functional |
| TC-PRT-200005 | เปลี่ยนหน้าแล้วเลขลำดับต่อเนื่องและ URL มี page | Low | Functional |
| TC-PRT-200006 | เปิดเทมเพลตด้วยปุ่มชื่อในคอลัมน์ Name ไม่ใช่คลิกทั้งแถว | High | Functional |
| TC-PRT-200007 | เมนูของแถวมีเฉพาะ Activity และ Delete ไม่มี Edit | Low | Functional |
| TC-PRT-200008 | สลับเป็นมุมมองการ์ดแล้วได้การ์ดพร้อมป้ายสถานะ | Low | Functional |
| TC-PRT-200009 | ค้นหายิงเมื่อกด Enter และเขียน search ลง URL | High | Functional |
| TC-PRT-200010 | ค้นด้วยคำที่ไม่มีทางตรง แสดง No data found และป้ายจำนวนหาย | Medium | Edge Case |
| TC-PRT-200011 | ปุ่มกากบาทล้างคำค้นแล้วรายการกลับมาครบ | Medium | Alternate Flow |
| TC-PRT-200012 | กรองสถานะ Active มีผลทันทีพร้อม chip บนแถบตัวกรอง | High | Functional |
| TC-PRT-200013 | Clear all ล้างตัวกรองและ chip หายทั้งแถบ | Medium | Alternate Flow |
| TC-PRT-200014 | Export สำเร็จแล้วขึ้น toast บอกจำนวนแถวที่ส่งออก | Low | Functional |
| TC-PRT-200015 | กล่องยืนยันลบอ้างชื่อเทมเพลตในข้อความ | Medium | Validation |
| TC-PRT-200016 | กด Cancel ในกล่องลบแล้วเทมเพลตยังอยู่ในรายการ | Medium | Negative |
| TC-PRT-200017 | ยืนยันลบแล้ว toast ขึ้นและแถวหายจากรายการ | High | CRUD |
| TC-PRT-200018 | หน้า /new เปิดในโหมดเพิ่มพร้อมปุ่ม Cancel และ Create | Medium | Functional |
| TC-PRT-200019 | กด Create บนฟอร์มเปล่า ข้อความบังคับระบุครบทั้งสามฟิลด์ | High | Validation |
| TC-PRT-200020 | กด Add Item ก่อนเลือก workflow ได้ toast เตือนและไม่มีแถวเพิ่ม | High | Validation |
| TC-PRT-200021 | ช่อง Workflow ตอนสร้างใหม่แสดงเฉพาะ workflow ที่สร้างได้ | Medium | Functional |
| TC-PRT-200022 | ช่อง Name รับได้ไม่เกิน 100 ตัวอักษร | Low | Validation |
| TC-PRT-200023 | ช่อง Description รับได้ไม่เกิน 256 ตัวอักษร | Low | Validation |
| TC-PRT-200024 | เลือก workflow แล้ว Add Item เพิ่มแถวและตัวนับข้างหัวข้อ Items ขยับ | High | Functional |
| TC-PRT-200025 | ช่อง Product ปิดอยู่จนกว่าจะเลือก Location | High | Functional |
| TC-PRT-200026 | เลือก Location แล้วจุดส่งของถูกเติมตามคลังที่เลือก | Medium | Functional |
| TC-PRT-200027 | เลือกสินค้าแล้วหน่วยของแถวถูกเติมให้เอง | High | Functional |
| TC-PRT-200028 | แถวใหม่ได้สกุลเงินตั้งต้นของ business unit | Medium | Functional |
| TC-PRT-200029 | Add Item แถวที่สองขึ้นบนสุดและรับคลังกับจุดส่งของจากแถวเดิม | Medium | Functional |
| TC-PRT-200030 | ช่องจำนวนรับ 0 ได้และลบจนว่างถูกนับเป็น 0 ไม่ใช่ค่าผิดพลาด | High | Edge Case |
| TC-PRT-200031 | ลบแถวเปิดกล่อง Remove Item ที่อ้างชื่อสินค้าในแถวนั้น | Medium | Validation |
| TC-PRT-200032 | บันทึกเทมเพลตใหม่สำเร็จแล้ว URL เปลี่ยนเป็น /:id และเข้าโหมดอ่าน | High | CRUD |
| TC-PRT-200033 | หลังบันทึก กด Back ของเบราว์เซอร์ได้หน้ารายการ ไม่ใช่ /new | Medium | Edge Case |
| TC-PRT-200034 | กด Cancel ขณะกรอกค้างขึ้นกล่อง Discard changes | Medium | Alternate Flow |
| TC-PRT-200035 | ยืนยัน Discard แล้วกลับหน้ารายการโดยไม่มีเทมเพลตใหม่ | Medium | Alternate Flow |
| TC-PRT-200036 | หน้ารายละเอียดเปิดในโหมดอ่านพร้อมชื่อ ป้ายสถานะ และปุ่มครบชุด | High | Functional |
| TC-PRT-200037 | โหมดอ่านไม่มีช่องกรอกและไม่มีปุ่มลบแถว | Medium | Functional |
| TC-PRT-200038 | กด Edit แล้วหัวเรื่องเปลี่ยนเป็น Edit พร้อมปุ่ม Cancel และ Save | High | Functional |
| TC-PRT-200039 | แก้ Description แล้วบันทึก ค่าใหม่ค้างอยู่ในโหมดอ่าน | High | CRUD |
| TC-PRT-200040 | บันทึกสองรอบติดกันสำเร็จทั้งคู่ | High | Edge Case |
| TC-PRT-200041 | Cancel ในโหมดแก้ไขคืนค่าเดิมและยังอยู่หน้าเดิม | High | Alternate Flow |
| TC-PRT-200042 | ปิดสวิตช์ Active แล้วบันทึก สถานะเปลี่ยนทั้งฟอร์มและรายการ | Medium | CRUD |
| TC-PRT-200043 | ลบจากหน้ารายละเอียดแล้วกลับรายการโดยไม่พบชื่อเดิม | High | CRUD |
| TC-PRT-200044 | Back ในโหมดอ่านกลับหน้ารายการทันทีโดยไม่มีกล่องเตือน | Low | Functional |
| TC-PRT-200045 | เปิด id ที่ไม่มีอยู่ได้กล่องข้อผิดพลาดพร้อมทางกลับ | Medium | Negative |
| TC-PRT-200046 | ปุ่ม Add ไม่ถูกกั้นสิทธิ์และพาไป /new ได้ทุกบทบาทที่เปิดหน้าได้ | Medium | Authorization |
| TC-PRT-200047 | ไม่มีสิทธิ์ create ปุ่ม Create เป็น aria-disabled และกดแล้วขึ้นกล่องปฏิเสธ | High | Authorization |
| TC-PRT-200048 | ไม่มีสิทธิ์ update ปุ่ม Edit เป็น aria-disabled และกดแล้วขึ้นกล่องปฏิเสธ | High | Authorization |
| TC-PRT-200049 | ไม่มีสิทธิ์ delete เมนู Delete ของแถวเป็น aria-disabled | Medium | Authorization |

---

## TC-PRT-200001 — หัวหน้ารายการแสดงชื่อโมดูล คำอธิบาย และป้ายจำนวนรายการ
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
Login เป็น `purchase@blueledgers.com` ผ่าน auth fixture, active BU = `BLAVG` และมีเทมเพลตอย่างน้อย 1 ใบใน BU นี้
**Steps**
1. ไปที่ `/procurement/purchase-request-template`
2. รอให้ตารางโหลดเสร็จ (โครงกระดูกหาย)
**Expected**
หัวหน้าแสดง `<h1>` ข้อความ "Purchase Request Template" และบรรทัดคำอธิบาย "Ready-made request lists for the things you order again and again." พร้อมป้ายตัวเลขข้าง `<h1>` ที่มีค่าเท่ากับจำนวนแถวทั้งหมดจาก `paginate.total` (ป้ายจะไม่ถูก render เมื่อจำนวนเป็น 0 — `document-list-header.tsx:25`)

---

## TC-PRT-200002 — ตารางแสดงคอลัมน์ตั้งต้นครบ และ Created/Updated ถูกซ่อนไว้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` ในมุมมองรายการ (ไม่ใช่การ์ด) และมีเทมเพลตอย่างน้อย 1 ใบ
**Steps**
1. อ่านแถวหัวตาราง
**Expected**
แถวหัวตารางมีหัวข้อครบตามลำดับ: checkbox เลือกทั้งหมด, `#`, `Name`, `Workflow`, `Description`, `Created By`, `Status` และคอลัมน์ปุ่มท้ายแถวที่ไม่มีหัวข้อ — **ไม่มี** หัวข้อ `Created` และ `Updated` ปรากฏ (ตั้ง `columnVisibility` เป็น false ไว้ที่ `use-prt-table.tsx:101-104`)

---

## TC-PRT-200003 — เปิดคอลัมน์ Created จากเมนู Toggle columns
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` มุมมองรายการ บนหน้าจอกว้าง (แถบขวาของ toolbar ซ่อนบนจอแคบ)
**Steps**
1. กดปุ่มไอคอนที่มี aria-label "Toggle columns"
2. ติ๊กรายการ `Created` ในเมนู
3. ปิดเมนู
**Expected**
หลังติ๊ก แถวหัวตารางมีหัวข้อ `Created` เพิ่มขึ้นมาและเครื่องหมายถูกในเมนูยังคงติดอยู่ที่ `Created` เมื่อเปิดเมนูซ้ำ (ทั้งสองอย่างต้องตรงกัน — เคยพลาดเพราะ React Compiler แช่ JSX ไว้ ดูคอมเมนต์ที่ `list-toolbar.tsx:66-72`)

---

## TC-PRT-200004 — คลิกหัวคอลัมน์ Name แล้ว URL ได้ sort=name:asc
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` มุมมองรายการ และมีเทมเพลตอย่างน้อย 2 ใบที่ชื่อต่างกัน
**Steps**
1. คลิกหัวคอลัมน์ `Name`
2. อ่าน query string ของ URL
3. คลิกหัวคอลัมน์ `Name` ซ้ำอีกครั้ง
**Expected**
หลังคลิกครั้งแรก URL มี `sort=name:asc` และชื่อในคอลัมน์ `Name` เรียงจากน้อยไปมาก · หลังคลิกซ้ำ URL เป็น `sort=name:desc` และลำดับกลับทิศ (หน้านี้ไม่ตั้ง `defaultSort` จึงไม่มี state "ไม่เรียง" ให้ทดสอบ)

---

## TC-PRT-200005 — เปลี่ยนหน้าแล้วเลขลำดับต่อเนื่องและ URL มี page
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีเทมเพลตมากกว่า 10 ใบใน BU `BLAVG` (ค่าตั้งต้นของ `perpage` คือ 10 — `use-list-page-state.ts:9`)
**Steps**
1. ไปที่ `/procurement/purchase-request-template`
2. อ่านเลขในคอลัมน์ `#` ของแถวสุดท้ายในหน้าแรก
3. กดปุ่มไปหน้าถัดไปบนแถบแบ่งหน้า
4. อ่านเลขในคอลัมน์ `#` ของแถวแรกในหน้าที่สอง
**Expected**
URL มี `page=2` และเลข `#` ของแถวแรกหน้าที่สองเท่ากับ 11 (ต่อจากแถวสุดท้ายของหน้าแรกที่เป็น 10) — เลขลำดับคิดจาก `row.index + 1 + (page-1) * perpage` ที่ `columns.tsx:44-60` ไม่ใช่เริ่มนับ 1 ใหม่ทุกหน้า

---

## TC-PRT-200006 — เปิดเทมเพลตด้วยปุ่มชื่อในคอลัมน์ Name ไม่ใช่คลิกทั้งแถว
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` มุมมองรายการ และมีเทมเพลตอย่างน้อย 1 ใบ
**Steps**
1. คลิกที่พื้นที่ว่างของแถวแรก (ไม่โดนปุ่มชื่อ ไม่โดน checkbox และไม่โดนปุ่มท้ายแถว)
2. ตรวจ URL
3. คลิกที่ข้อความชื่อเทมเพลตในคอลัมน์ `Name`
4. ตรวจ URL อีกครั้ง
**Expected**
หลังขั้นที่ 1 URL ยังคงเป็น `/procurement/purchase-request-template` ไม่เปลี่ยน — การคลิกแถวไม่เปิดอะไร · หลังขั้นที่ 3 URL เปลี่ยนเป็น `/procurement/purchase-request-template/<uuid>` และหัวฟอร์มแสดงชื่อเทมเพลตใบนั้น (ตัวเปิดคือ `CellAction` ซึ่งเป็น `<button type="button">` ไม่ใช่ `<a href>` และไม่ใช่ตัวแถว)

---

## TC-PRT-200007 — เมนูของแถวมีเฉพาะ Activity และ Delete ไม่มี Edit
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` มุมมองรายการ มีเทมเพลตอย่างน้อย 1 ใบ และบัญชีมีสิทธิ์ `procurement.purchase_request_template.delete`
**Steps**
1. กดปุ่มท้ายแถวแรกที่มี aria-label "Row actions"
2. อ่านรายการเมนูทั้งหมด
**Expected**
เมนูมี 2 รายการเท่านั้นคือ `Activity` และ `Delete` — **ไม่มี** รายการ `Edit` (เพราะ `usePrtTable` ไม่ส่ง `onEdit` ให้ `actionColumn` การเปิดเพื่อแก้ทำผ่านชื่อในคอลัมน์ `Name` ทางเดียว)

---

## TC-PRT-200008 — สลับเป็นมุมมองการ์ดแล้วได้การ์ดพร้อมป้ายสถานะ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` บนหน้าจอกว้าง (โหมดการ์ดบังคับอัตโนมัติบนจอมือถือ) และมีเทมเพลตอย่างน้อย 1 ใบที่มีค่า workflow
**Steps**
1. กดปุ่มไอคอนที่มี aria-label "Grid view"
2. อ่านการ์ดใบแรก
**Expected**
ตารางหายไปและได้การ์ดแทน การ์ดใบแรกแสดงชื่อเทมเพลตเป็นหัวการ์ด มีแถว `Workflow` พร้อมชื่อ workflow และป้ายสถานะ `Active` หรือ `Inactive` ตามค่าจริงของใบนั้น · กดปุ่ม aria-label "List view" แล้วตารางกลับมา

---

## TC-PRT-200009 — ค้นหายิงเมื่อกด Enter และเขียน search ลง URL
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` และทราบชื่อเทมเพลตที่มีอยู่จริงอย่างน้อย 1 ใบ (เรียกว่า `<ชื่อที่มีจริง>`)
**Steps**
1. พิมพ์ `<ชื่อที่มีจริง>` ลงในช่องค้นหาโดยยังไม่กด Enter
2. ตรวจ URL และจำนวนแถวในตาราง
3. กด Enter
4. ตรวจ URL และตารางอีกครั้ง
**Expected**
หลังขั้นที่ 1 URL **ยังไม่มี** `search=` และจำนวนแถวไม่เปลี่ยน — การพิมพ์อย่างเดียวไม่ยิงคำค้น (`search-input.tsx:36-45`) · หลังกด Enter URL มี `search=<ชื่อที่มีจริง>` และทุกแถวที่เหลือมีชื่อที่ตรงกับคำค้น

---

## TC-PRT-200010 — ค้นด้วยคำที่ไม่มีทางตรง แสดง No data found และป้ายจำนวนหาย
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` และมีเทมเพลตอย่างน้อย 1 ใบก่อนค้น
**Steps**
1. พิมพ์สตริงสุ่มที่ไม่มีทางตรงกับชื่อใด เช่น `zzz-no-such-template-zzz` ลงในช่องค้นหา
2. กด Enter
**Expected**
ตารางแสดงบล็อกว่างที่มีข้อความ "No data found" ไม่มีแถวข้อมูลเหลือ และป้ายตัวเลขข้างหัวเรื่องหายไป (ป้าย render เฉพาะเมื่อ `count > 0`)

---

## TC-PRT-200011 — ปุ่มกากบาทล้างคำค้นแล้วรายการกลับมาครบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ต่อจากสถานะของ `TC-PRT-200010` — ช่องค้นหามีข้อความอยู่และตารางว่าง
**Steps**
1. อ่านจำนวนแถว (หรือค่าป้ายจำนวน) ก่อนค้น เก็บไว้เทียบ
2. กดปุ่มที่มี aria-label "Clear search" ในช่องค้นหา
**Expected**
ช่องค้นหาว่างลง URL ไม่มี `search=` อีกต่อไป และจำนวนแถว (หรือค่าป้ายจำนวน) กลับมาเท่ากับตอนก่อนค้น — ปุ่มนี้เปลี่ยนจากไอคอนแว่นเป็นกากบาทเมื่อช่องมีข้อความ และล้าง + ยิงคำค้นว่างในจังหวะเดียว

---

## TC-PRT-200012 — กรองสถานะ Active มีผลทันทีพร้อม chip บนแถบตัวกรอง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` บนหน้าจอกว้าง และมีเทมเพลตทั้งที่ Active และ Inactive อย่างละอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม Filter บน toolbar
2. เข้าหัวข้อ `Status` แล้วเลือก `Active`
3. ปิดเมนูตัวกรอง
**Expected**
รายการถูกกรองทันทีโดยไม่ต้องกดปุ่มยืนยันใด ๆ (ไม่มีปุ่ม Apply ในโมดูลนี้), URL มี `filter=` ที่มีค่า `is_active|bool:true`, ทุกแถวที่เหลือมีป้ายสถานะ `Active` และแถบใต้ toolbar แสดง chip ของตัวกรองที่เปิดอยู่ 1 อัน

---

## TC-PRT-200013 — Clear all ล้างตัวกรองและ chip หายทั้งแถบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ต่อจากสถานะของ `TC-PRT-200012` — มีตัวกรอง Status = Active เปิดอยู่ 1 อัน
**Steps**
1. กดปุ่มล้างตัวกรองทั้งหมดบนแถบ chip (หรือในเมนู Filter)
**Expected**
chip หายจากแถบจนไม่เหลือสักอัน, URL ไม่มี `filter=` อีกต่อไป และรายการกลับมามีทั้งแถวที่เป็น `Active` และ `Inactive`

---

## TC-PRT-200014 — Export สำเร็จแล้วขึ้น toast บอกจำนวนแถวที่ส่งออก
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` บนหน้าจอกว้าง (ปุ่ม Export ซ่อนบนจอแคบและย้ายไปเมนู "More actions") และมีเทมเพลตอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่ม `Export`
2. รอจนปุ่มเลิกแสดงข้อความ `Exporting...`
**Expected**
ขึ้น toast ข้อความขึ้นต้นด้วย "Exported " และตามด้วยจำนวนแถวกับคำว่า " records" โดยจำนวนตรงกับค่าป้ายจำนวนข้างหัวเรื่อง — **ไม่ใช่** toast "No data to export" ซึ่งสงวนไว้สำหรับกรณีที่ดึงข้อมูลแล้วได้ 0 แถว

---

## TC-PRT-200015 — กล่องยืนยันลบอ้างชื่อเทมเพลตในข้อความ
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template` มุมมองรายการ, บัญชีมีสิทธิ์ลบ และทราบชื่อเทมเพลตของแถวแรก (เรียกว่า `<ชื่อแถวแรก>`)
**Steps**
1. กดปุ่มท้ายแถวแรก (aria-label "Row actions")
2. เลือก `Delete`
**Expected**
เปิดกล่องยืนยันแบบ `alertdialog` (ไม่ใช่ `dialog` — `getByRole("dialog")` จะไม่แมตช์) หัวข้อ "Delete Template" และคำอธิบายมีข้อความ `Are you sure you want to delete template "<ชื่อแถวแรก>"? This action cannot be undone.` พร้อมปุ่ม `Cancel` และ `Delete`

---

## TC-PRT-200016 — กด Cancel ในกล่องลบแล้วเทมเพลตยังอยู่ในรายการ
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ต่อจากสถานะของ `TC-PRT-200015` — กล่องยืนยันลบเปิดอยู่
**Steps**
1. อ่านจำนวนแถวในตารางไว้ก่อน
2. กดปุ่ม `Cancel` ในกล่อง
**Expected**
กล่องปิดลง จำนวนแถวเท่าเดิม และแถวชื่อ `<ชื่อแถวแรก>` ยังอยู่ในตาราง — ไม่มี toast ลบสำเร็จปรากฏ

---

## TC-PRT-200017 — ยืนยันลบแล้ว toast ขึ้นและแถวหายจากรายการ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีเทมเพลตที่สร้างขึ้นสำหรับเคสนี้โดยเฉพาะ (ชื่อไม่ซ้ำกับใบอื่น เรียกว่า `<ชื่อที่จะลบ>`) และบัญชีมีสิทธิ์ลบ · ใช้ร่วมกับ `test.describe.serial` เพื่อให้แน่ใจว่าใบนี้ถูกสร้างก่อน
**Steps**
1. ค้นหา `<ชื่อที่จะลบ>` แล้วกด Enter
2. กดปุ่มท้ายแถวนั้นแล้วเลือก `Delete`
3. กดปุ่ม `Delete` ในกล่องยืนยัน
**Expected**
ขึ้น toast ข้อความ "Purchase Request Template deleted successfully" กล่องปิดเอง และตารางไม่มีแถวชื่อ `<ชื่อที่จะลบ>` เหลืออยู่ภายใต้คำค้นเดิม (แสดงบล็อก "No data found")

---

## TC-PRT-200018 — หน้า /new เปิดในโหมดเพิ่มพร้อมปุ่ม Cancel และ Create
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น `purchase@blueledgers.com` active BU = `BLAVG` และบัญชีมีสิทธิ์ `procurement.purchase_request_template.create` (หรือเป็น admin ของ BU)
**Steps**
1. ไปที่ `/procurement/purchase-request-template/new` โดยตรง
**Expected**
หัวฟอร์มเป็นข้อความ "Add Purchase Request Template" มีปุ่ม `Cancel` และปุ่ม `Create` (ไม่ใช่ `Save`) — และ **ไม่มี** ปุ่ม `Delete`, `Edit` หรือ `Activity` ปรากฏ (โหมด add ไม่มี id จึงไม่มีทั้งสามตัว)

---

## TC-PRT-200019 — กด Create บนฟอร์มเปล่า ข้อความบังคับระบุครบทั้งสามฟิลด์
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` โดยยังไม่กรอกอะไรเลย
**Steps**
1. กดปุ่ม `Create`
**Expected**
ยังอยู่ที่ `/procurement/purchase-request-template/new` และมีข้อความบังคับปรากฏครบทั้งสามจุดพร้อมกัน: "Workflow is required", "Name is required" และ "Items is required" — เคสเดิม `TC-PRT-010004` / `TC-PRT-220003` ยืนยันเพียงว่ามี error อย่างน้อยหนึ่งจุด เคสนี้ระบุว่าเป็นฟิลด์ใดบ้าง

---

## TC-PRT-200020 — กด Add Item ก่อนเลือก workflow ได้ toast เตือนและไม่มีแถวเพิ่ม
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` และยังไม่ได้เลือกค่าในช่อง `Workflow`
**Steps**
1. กดปุ่ม `Add Item` ในส่วน Items
**Expected**
ปุ่มกดได้ (ไม่ถูก disable) แต่ขึ้น toast เตือนข้อความ "Select a workflow first, then add items." และตารางรายการยังแสดงบล็อกว่างหัวข้อ "No Items Yet" พร้อมคำอธิบาย "Add items to this template." โดยตัวนับข้างหัวข้อ `Items` ยังเป็น 0

---

## TC-PRT-200021 — ช่อง Workflow ตอนสร้างใหม่แสดงเฉพาะ workflow ที่สร้างได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new`; ทราบจาก `/api/<bu>/workflows` ว่ามี PR workflow อย่างน้อยหนึ่งตัวที่ `can_create === false` และอย่างน้อยหนึ่งตัวที่สร้างได้
**Steps**
1. เปิด dropdown ของช่อง `Workflow`
2. อ่านรายการตัวเลือกทั้งหมด
**Expected**
รายการมีเฉพาะ workflow ชนิด PR ที่ `can_create !== false` — workflow ที่ `can_create === false` ไม่อยู่ในรายการ (`prt-general-fields.tsx` ส่ง `creatableOnly={isAdd}` ให้ `LookupWorkflow`) · เปรียบเทียบกับหน้า `/:id` ในโหมดแก้ไขซึ่งไม่ส่ง `creatableOnly` จึงเห็นรายการเต็ม

---

## TC-PRT-200022 — ช่อง Name รับได้ไม่เกิน 100 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new`
**Steps**
1. พิมพ์สตริงยาว 150 ตัวอักษรลงในช่อง `Name`
2. อ่านค่าที่อยู่ในช่องจริง
**Expected**
ค่าที่อยู่ในช่องมีความยาว 100 ตัวอักษรพอดี (ถูกตัดโดย `maxLength={100}` ที่ตัว input) ไม่ใช่ 150 และไม่มีข้อความแสดงข้อผิดพลาดขึ้น — เป็นการกันที่ช่องกรอก ไม่ใช่การตรวจตอน submit

---

## TC-PRT-200023 — ช่อง Description รับได้ไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new`
**Steps**
1. พิมพ์สตริงยาว 300 ตัวอักษรลงในช่อง `Description`
2. อ่านค่าที่อยู่ในช่องจริง
**Expected**
ค่าที่อยู่ในช่องมีความยาว 256 ตัวอักษรพอดี (ตัดโดย `maxLength={256}` ของ textarea) และช่องนี้ไม่มีเครื่องหมายบังคับ — ปล่อยว่างแล้วบันทึกได้

---

## TC-PRT-200024 — เลือก workflow แล้ว Add Item เพิ่มแถวและตัวนับข้างหัวข้อ Items ขยับ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` และมี PR workflow ที่สร้างได้อย่างน้อย 1 ตัว
**Steps**
1. เลือกค่าในช่อง `Workflow`
2. กดปุ่ม `Add Item`
**Expected**
บล็อกว่าง "No Items Yet" หายไป มีแถวข้อมูล 1 แถวที่เลข `#` เป็น 1 และตัวเลขข้างหัวข้อ `Items` เปลี่ยนจาก 0 เป็น 1 · ไม่มี toast เตือนเรื่อง workflow ขึ้น

---

## TC-PRT-200025 — ช่อง Product ปิดอยู่จนกว่าจะเลือก Location
**Priority:** High · **Test Type:** Functional
**Preconditions**
ต่อจาก `TC-PRT-200024` — มีแถวรายการ 1 แถวที่ยังไม่ได้เลือกคลัง
**Steps**
1. สังเกตตัวเปิด dropdown ของคอลัมน์ `Product` ในแถวนั้น
2. เลือกคลังในคอลัมน์ `Location`
3. สังเกตตัวเปิด dropdown ของคอลัมน์ `Product` อีกครั้ง
**Expected**
ในขั้นที่ 1 ตัวเปิด `Product` อยู่ในสถานะ disabled กดไม่ติด (`disabled={disabled || !locationId}`) · หลังเลือกคลังในขั้นที่ 2 ตัวเปิดกลับมากดได้และเปิดรายการสินค้าได้ในขั้นที่ 3

---

## TC-PRT-200026 — เลือก Location แล้วจุดส่งของถูกเติมตามคลังที่เลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` มีแถวรายการ 1 แถว และทราบว่าคลังที่จะเลือกมีจุดส่งของผูกอยู่ (`location.delivery_point`)
**Steps**
1. เลือกคลังที่มีจุดส่งของในคอลัมน์ `Location`
2. อ่านค่าในคอลัมน์ `Delivery Point` ของแถวเดียวกัน
**Expected**
คอลัมน์ `Delivery Point` แสดงชื่อจุดส่งของของคลังที่เพิ่งเลือกโดยไม่ต้องเลือกเอง · ถ้าเปลี่ยนไปเลือกคลังที่ไม่มีจุดส่งของ ช่องจะถูกล้างว่างและขึ้นเป็นช่องบังคับที่ยังไม่ได้กรอก ไม่ใช่ค้างค่าเดิมของคลังก่อนหน้า

---

## TC-PRT-200027 — เลือกสินค้าแล้วหน่วยของแถวถูกเติมให้เอง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` มีแถวรายการที่เลือกคลังแล้ว และคลังนั้นมีสินค้าที่ workflow อนุญาตอย่างน้อย 1 รายการ
**Steps**
1. เปิด dropdown `Product` แล้วเลือกสินค้ารายการแรก
2. อ่านส่วนท้ายของช่อง `Requested`
**Expected**
ช่อง `Requested` แสดงชื่อหน่วยของสินค้าที่เพิ่งเลือกอยู่ท้ายช่อง (มาจาก `inventory_unit` ของสินค้า — `use-prt-item-table.tsx:55-66`) โดยผู้ใช้ไม่ได้เลือกหน่วยเอง และคอลัมน์ `Product` แสดงชื่อสินค้านั้น

---

## TC-PRT-200028 — แถวใหม่ได้สกุลเงินตั้งต้นของ business unit
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
Login เป็น `purchase@blueledgers.com` active BU = `BLAVG` ซึ่งตั้งค่า `config.default_currency_id` ไว้แล้ว; อยู่ที่ `/procurement/purchase-request-template/new` และเลือก workflow แล้ว
**Steps**
1. กดปุ่ม `Add Item`
2. อ่านค่าในคอลัมน์ `Currency` ของแถวที่เพิ่งเพิ่ม
**Expected**
คอลัมน์ `Currency` มีค่าที่เลือกไว้แล้วตรงกับสกุลเงินตั้งต้นของ BU (ไม่ใช่ช่องว่าง) และไม่มีข้อความ "Currency is required" ขึ้นที่แถวนี้ตอนกด Create

---

## TC-PRT-200029 — Add Item แถวที่สองขึ้นบนสุดและรับคลังกับจุดส่งของจากแถวเดิม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` มีแถวรายการ 1 แถวที่เลือกคลัง จุดส่งของ และสินค้าครบแล้ว
**Steps**
1. จดชื่อคลังและจุดส่งของของแถวที่มีอยู่
2. กดปุ่ม `Add Item` อีกครั้ง
3. อ่านแถวที่เลข `#` เป็น 1
**Expected**
แถวใหม่อยู่ **บนสุด** (`#` = 1) ไม่ใช่ท้ายตาราง, คอลัมน์ `Location` และ `Delivery Point` ของแถวใหม่มีค่าเท่ากับที่จดไว้ในขั้นที่ 1, ส่วนคอลัมน์ `Product` ของแถวใหม่ยังว่าง · แถวเดิมเลื่อนลงไปเป็น `#` = 2 โดยข้อมูลไม่เปลี่ยน · ตัวนับข้างหัวข้อ `Items` เป็น 2

---

## TC-PRT-200030 — ช่องจำนวนรับ 0 ได้และลบจนว่างถูกนับเป็น 0 ไม่ใช่ค่าผิดพลาด
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` มีแถวรายการที่กรอกคลัง จุดส่งของ และสินค้าครบแล้ว
**Steps**
1. พิมพ์ `5` ลงในช่อง `Requested` ของแถวนั้น
2. ลบตัวเลขออกจนช่องว่าง
3. พิมพ์ `0` ลงไป
**Expected**
หลังขั้นที่ 2 ช่องไม่แสดงกรอบ/ข้อความผิดพลาดใด ๆ และหลังขั้นที่ 3 ค่าเป็น 0 โดยยังไม่มีข้อความผิดพลาด — 0 เป็นค่าที่ตั้งใจให้ใส่ได้ในแม่แบบ (schema เป็น `min(0)` และค่าตั้งต้นของแถวใหม่ก็คือ 0) · กด `Create` ตอนช่องเป็น 0 แล้วบันทึกผ่าน ไม่ติด validation ของจำนวน

---

## TC-PRT-200031 — ลบแถวเปิดกล่อง Remove Item ที่อ้างชื่อสินค้าในแถวนั้น
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` มีแถวรายการที่เลือกสินค้าแล้ว (ชื่อสินค้า = `<ชื่อสินค้า>`)
**Steps**
1. กดปุ่มไอคอนถังขยะท้ายแถวนั้น (aria-label "Remove")
2. อ่านกล่องที่เปิดขึ้น
3. กดปุ่ม `Cancel`
4. กดถังขยะซ้ำแล้วกด `Delete`
**Expected**
กล่องที่เปิดเป็น `alertdialog` หัวข้อ "Remove Item" และคำอธิบาย `Are you sure you want to remove "<ชื่อสินค้า>"?` · หลังขั้นที่ 3 แถวยังอยู่และตัวนับ `Items` เท่าเดิม · หลังขั้นที่ 4 แถวหายไปและตัวนับลดลง 1

---

## TC-PRT-200032 — บันทึกเทมเพลตใหม่สำเร็จแล้ว URL เปลี่ยนเป็น /:id และเข้าโหมดอ่าน
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new`; มี PR workflow ที่สร้างได้, คลังที่ผู้ใช้เข้าถึงได้พร้อมจุดส่งของ และสินค้าในคลังนั้น; ใช้ชื่อที่ไม่ซ้ำจาก `buildEntity`/`fakeName` (เรียกว่า `<ชื่อใหม่>`)
**Steps**
1. เลือก `Workflow`
2. กรอก `Name` ด้วย `<ชื่อใหม่>`
3. กด `Add Item` แล้วกรอกคลัง สินค้า จำนวน และตรวจว่าจุดส่งของกับสกุลเงินถูกเติมครบ
4. กดปุ่ม `Create`
**Expected**
ขึ้น toast "Purchase Request Template created successfully", URL เปลี่ยนจาก `/new` เป็น `/procurement/purchase-request-template/<uuid>`, หัวฟอร์มเปลี่ยนจาก "Add Purchase Request Template" เป็น `<ชื่อใหม่>` พร้อมป้ายสถานะ และแถบปุ่มกลับมาเป็นชุดโหมดอ่าน (`Edit` / `Delete` / `Activity`) โดยไม่มีปุ่ม `Create` เหลืออยู่

---

## TC-PRT-200033 — หลังบันทึก กด Back ของเบราว์เซอร์ได้หน้ารายการ ไม่ใช่ /new
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ต่อจาก `TC-PRT-200032` — เพิ่งบันทึกเสร็จและอยู่ที่ `/procurement/purchase-request-template/<uuid>` โดยมาถึงหน้านี้ผ่านหน้ารายการ → `/new` → บันทึก
**Steps**
1. กดปุ่ม Back ของเบราว์เซอร์หนึ่งครั้ง
**Expected**
ไปถึง `/procurement/purchase-request-template` (หน้ารายการ) ทันที ไม่ใช่ `/procurement/purchase-request-template/new` — เพราะ `navigate` หลังสร้างใช้ `{ replace: true }` กิน entry ของ `/new` ทิ้ง · ไม่มีกล่องเตือนทิ้งงานขึ้น เพราะฟอร์มถูกล้าง dirty แล้ว

---

## TC-PRT-200034 — กด Cancel ขณะกรอกค้างขึ้นกล่อง Discard changes
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/new` และกรอก `Name` ไปแล้วอย่างน้อยหนึ่งตัวอักษร (ฟอร์มอยู่ในสถานะ dirty)
**Steps**
1. กดปุ่ม `Cancel`
**Expected**
เปิดกล่อง `alertdialog` หัวข้อ "Discard changes?" คำอธิบาย "You have unsaved changes that will be lost." พร้อมปุ่ม "Keep editing" และ "Discard" · กด "Keep editing" แล้วกล่องปิด ยังอยู่ที่ `/new` และค่าที่กรอกไว้ยังอยู่ครบ

---

## TC-PRT-200035 — ยืนยัน Discard แล้วกลับหน้ารายการโดยไม่มีเทมเพลตใหม่
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ต่อจาก `TC-PRT-200034` — กล่อง "Discard changes?" เปิดอยู่ และชื่อที่กรอกค้างคือ `<ชื่อที่ทิ้ง>`
**Steps**
1. กดปุ่ม "Discard"
2. ค้นหา `<ชื่อที่ทิ้ง>` ในหน้ารายการแล้วกด Enter
**Expected**
กลับไปที่ `/procurement/purchase-request-template` และผลค้นหาไม่พบเทมเพลตชื่อ `<ชื่อที่ทิ้ง>` (แสดงบล็อก "No data found") — การทิ้งงานต้องไม่ได้ยิงคำขอสร้างไปที่หลังบ้าน

---

## TC-PRT-200036 — หน้ารายละเอียดเปิดในโหมดอ่านพร้อมชื่อ ป้ายสถานะ และปุ่มครบชุด
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีเทมเพลตอย่างน้อย 1 ใบใน BU `BLAVG`; บัญชีมีสิทธิ์ view/update/delete ของโมดูลนี้
**Steps**
1. ไปที่ `/procurement/purchase-request-template` แล้วเปิดใบแรกด้วยปุ่มชื่อในคอลัมน์ `Name`
**Expected**
หัวฟอร์มแสดง **ชื่อเทมเพลต** (ไม่ใช่ข้อความ "Edit ...") พร้อมป้ายสถานะ `Active`/`Inactive` ข้างชื่อ และแถบปุ่มมี `Edit`, `Delete`, `Activity` — **ไม่มี** ปุ่ม `Save` หรือ `Cancel` ปรากฏในโหมดนี้

---

## TC-PRT-200037 — โหมดอ่านไม่มีช่องกรอกและไม่มีปุ่มลบแถว
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ต่อจาก `TC-PRT-200036` — อยู่ที่ `/procurement/purchase-request-template/<uuid>` ในโหมดอ่าน และเทมเพลตใบนี้มีรายการอย่างน้อย 1 แถว
**Steps**
1. ตรวจส่วนหัวเอกสาร (Workflow / Name / Description)
2. ตรวจตารางรายการ
**Expected**
ส่วนหัวแสดงค่าทั้งสามเป็นข้อความอ่านอย่างเดียว ไม่มี `<input>` หรือ `<textarea>` ให้พิมพ์ และสวิตช์ Active อยู่ในสถานะ disabled · ตารางรายการไม่มีคอลัมน์ปุ่มลบแถว (aria-label "Remove") และไม่มีปุ่ม `Add Item` เหนือคอลัมน์ · ช่องจำนวนแสดงเป็นข้อความพร้อมหน่วย ไม่ใช่ `input[type=number]`

---

## TC-PRT-200038 — กด Edit แล้วหัวเรื่องเปลี่ยนเป็น Edit พร้อมปุ่ม Cancel และ Save
**Priority:** High · **Test Type:** Functional
**Preconditions**
ต่อจาก `TC-PRT-200036`; บัญชีมีสิทธิ์ `procurement.purchase_request_template.update`
**Steps**
1. กดปุ่ม `Edit`
2. ตรวจ URL และแถบปุ่ม
**Expected**
URL **ไม่เปลี่ยน** ยังเป็น `/procurement/purchase-request-template/<uuid>` (การแก้ไขเป็นการสลับโหมดในหน้าเดิม ไม่มี route `/edit`), หัวฟอร์มเปลี่ยนเป็น "Edit Purchase Request Template", แถบปุ่มมี `Cancel` กับ `Save` (ไม่ใช่ `Create`) และปุ่ม `Edit` หายไป · ส่วนหัวเอกสารกลายเป็นช่องกรอกที่พิมพ์ได้ และตารางรายการมีปุ่ม `Add Item` กับปุ่มลบแถวโผล่ขึ้นมา

---

## TC-PRT-200039 — แก้ Description แล้วบันทึก ค่าใหม่ค้างอยู่ในโหมดอ่าน
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ต่อจาก `TC-PRT-200038` — อยู่ในโหมดแก้ไขของเทมเพลตที่สร้างไว้สำหรับชุดเคสนี้
**Steps**
1. ล้างช่อง `Description` แล้วพิมพ์ข้อความใหม่ที่ไม่ซ้ำ (เรียกว่า `<คำอธิบายใหม่>`)
2. กดปุ่ม `Save`
**Expected**
ขึ้น toast "Purchase Request Template updated successfully", ฟอร์มกลับสู่โหมดอ่านเอง (ปุ่ม `Edit` กลับมา, `Save`/`Cancel` หายไป) และส่วน `Description` แสดง `<คำอธิบายใหม่>` · โหลดหน้าซ้ำแล้วค่ายังเป็น `<คำอธิบายใหม่>`

---

## TC-PRT-200040 — บันทึกสองรอบติดกันสำเร็จทั้งคู่
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
ต่อจาก `TC-PRT-200039` — เพิ่งบันทึกสำเร็จหนึ่งรอบและอยู่ในโหมดอ่านของหน้าเดิม โดย **ไม่โหลดหน้าใหม่**
**Steps**
1. กด `Edit` อีกครั้ง
2. แก้ `Description` เป็นข้อความใหม่อีกค่า (เรียกว่า `<คำอธิบายรอบสอง>`)
3. กด `Save`
**Expected**
รอบที่สองขึ้น toast "Purchase Request Template updated successfully" เหมือนรอบแรกและกลับสู่โหมดอ่านพร้อมค่า `<คำอธิบายรอบสอง>` — **ต้องไม่** มี toast ข้อผิดพลาด และต้องไม่มีข้อความทำนอง "Someone else changed this document" (`doc_version` รายแถวต้องถูก rebase หลังบันทึกรอบแรก ดูคอมเมนต์ที่ `prt-form.tsx:66-73`) · เคสนี้จับ regression ที่ทำให้การบันทึกรอบสองพังทั้งที่รอบแรกผ่าน

---

## TC-PRT-200041 — Cancel ในโหมดแก้ไขคืนค่าเดิมและยังอยู่หน้าเดิม
**Priority:** High · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/procurement/purchase-request-template/<uuid>` ในโหมดแก้ไข และจดค่าเดิมของช่อง `Name` ไว้ (`<ชื่อเดิม>`)
**Steps**
1. แก้ช่อง `Name` เป็นข้อความอื่น
2. กดปุ่ม `Cancel`
3. กดปุ่ม "Discard" ในกล่องที่ขึ้น
**Expected**
**ไม่ออกจากหน้า** — URL ยังเป็น `/procurement/purchase-request-template/<uuid>` (ต่างจากโหมด add ที่ Cancel แล้วกลับหน้ารายการ), ฟอร์มกลับสู่โหมดอ่าน และหัวฟอร์มกับส่วน `Name` แสดง `<ชื่อเดิม>` ไม่ใช่ข้อความที่เพิ่งพิมพ์

---

## TC-PRT-200042 — ปิดสวิตช์ Active แล้วบันทึก สถานะเปลี่ยนทั้งฟอร์มและรายการ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
มีเทมเพลตของชุดเคสนี้ที่สถานะเป็น `Active` อยู่ (ชื่อ = `<ชื่อเทมเพลต>`) และเปิดหน้ารายละเอียดของใบนั้นอยู่
**Steps**
1. กด `Edit`
2. ปิดสวิตช์ `Active`
3. กด `Save`
4. กลับไปหน้ารายการแล้วค้นหา `<ชื่อเทมเพลต>`
**Expected**
หลังบันทึก ป้ายสถานะข้างชื่อในหัวฟอร์มเป็น `Inactive` · ในหน้ารายการ แถวของ `<ชื่อเทมเพลต>` มีป้ายสถานะ `Inactive` และเมื่อกรองด้วย Status = `Active` แถวนี้จะไม่อยู่ในผลลัพธ์ แต่กรองด้วย `Inactive` แล้วเจอ

---

## TC-PRT-200043 — ลบจากหน้ารายละเอียดแล้วกลับรายการโดยไม่พบชื่อเดิม
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มีเทมเพลตที่สร้างไว้สำหรับเคสนี้โดยเฉพาะ (ชื่อ = `<ชื่อที่จะลบ>`) เปิดหน้ารายละเอียดของใบนั้นอยู่ในโหมดอ่าน และบัญชีมีสิทธิ์ลบ
**Steps**
1. กดปุ่ม `Delete` บนแถบปุ่ม
2. อ่านกล่องยืนยัน
3. กดปุ่ม `Delete` ในกล่อง
**Expected**
กล่องยืนยันหัวข้อ "Delete Template" และคำอธิบายอ้าง `<ชื่อที่จะลบ>` · หลังยืนยัน ขึ้น toast "Purchase Request Template deleted successfully", URL กลับไปเป็น `/procurement/purchase-request-template` และค้นหา `<ชื่อที่จะลบ>` แล้วไม่พบ

---

## TC-PRT-200044 — Back ในโหมดอ่านกลับหน้ารายการทันทีโดยไม่มีกล่องเตือน
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิดหน้ารายละเอียดเทมเพลตในโหมดอ่าน โดยเดินทางมาหลายชั้น เช่น รายการ → เปิดใบ A → กด Activity → ปิด → ยังอยู่ที่ใบ A
**Steps**
1. กดปุ่มย้อนกลับในหัวฟอร์ม (aria-label / ข้อความ "Go back")
**Expected**
ไปถึง `/procurement/purchase-request-template` ด้วยการกดครั้งเดียว (ปุ่มนี้ `navigate` ไปหน้ารายการตรง ๆ ไม่ใช่ history back — `prt-form.tsx:139-149`) และ **ไม่มี** กล่อง "Discard changes?" ขึ้น เพราะโหมดอ่านไม่ถือว่ามีของค้าง

---

## TC-PRT-200045 — เปิด id ที่ไม่มีอยู่ได้กล่องข้อผิดพลาดพร้อมทางกลับ
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
Login แล้ว active BU = `BLAVG`
**Steps**
1. ไปที่ `/procurement/purchase-request-template/00000000-0000-0000-0000-000000000000` โดยตรง
2. รอให้ skeleton ของฟอร์มหายไป
**Expected**
ได้บล็อกแจ้งข้อผิดพลาด (`role="alert"`) แทนฟอร์ม โดยมีหัวข้อ "Something went wrong" และปุ่มลิงก์ "Back to list" ที่พาไป `/procurement/purchase-request-template` — **ไม่ใช่** ฟอร์มเปล่าและไม่ใช่หน้าค้าง · เมื่อหลังบ้านตอบ 404 ข้อความในบล็อกคือ "Template not found" (`notFoundMessage` ที่ `prt-edit-content.tsx:16`); ถ้าตอบ 400/422 จะเป็นข้อความจาก `getUserErrorMessage` แทน แต่ปุ่ม "Back to list" ต้องมีทุกกรณีเพราะทั้งสามสถานะนับเป็นทางตัน

---

## TC-PRT-200046 — ปุ่ม Add ไม่ถูกกั้นสิทธิ์และพาไป /new ได้ทุกบทบาทที่เปิดหน้าได้
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login เป็น `requestor@blueledgers.com` (บทบาทที่ไม่ใช่สายจัดซื้อ) active BU = `BLAVG`
**Steps**
1. ไปที่ `/procurement/purchase-request-template`
2. สังเกตปุ่ม "Add Purchase Request Template"
3. กดปุ่มนั้น
**Expected**
หน้ารายการเปิดได้ตามปกติ (ไม่มี route guard บนทั้งสาม route), ปุ่ม Add **ปรากฏและกดได้** ไม่ถูกซ่อนและไม่ถูก disable, และการกดพาไป `/procurement/purchase-request-template/new` ซึ่งแสดงฟอร์มเปล่าตามปกติ — ด่านสิทธิ์อยู่ที่ปุ่ม `Create` ในฟอร์ม (ดู `TC-PRT-200047`) ไม่ใช่ที่ปุ่มนี้ · เคสนี้ยืนยัน UI ตามที่ออกแบบไว้จริงในโค้ด ไม่ใช่การยืนยันว่าของพัง

---

## TC-PRT-200047 — ไม่มีสิทธิ์ create ปุ่ม Create เป็น aria-disabled และกดแล้วขึ้นกล่องปฏิเสธ
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** `procurement.purchase_request_template.create` ใน BU ที่ใช้งานอยู่ และ `defaultBu.system_level !== "admin"` — ต้องยืนยัน permission list ของบัญชีจาก `/api/user/profile` ก่อนรัน (ดู Blocker ในหัวเรื่อง)
**Steps**
1. ไปที่ `/procurement/purchase-request-template/new`
2. สังเกตปุ่ม `Create`
3. กดปุ่ม `Create`
**Expected**
ปุ่ม `Create` **ยังแสดงอยู่** (ไม่ถูกซ่อน) มี `aria-disabled="true"` และถูกทำจาง และเมื่อกดจะเปิดกล่อง `alertdialog` หัวข้อ "Permission Denied" คำอธิบาย "You don't have permission to perform this action." — **ไม่มี** การ redirect ไปหน้าอื่นและไม่มีคำขอสร้างถูกยิงไปที่หลังบ้าน

---

## TC-PRT-200048 — ไม่มีสิทธิ์ update ปุ่ม Edit เป็น aria-disabled และกดแล้วขึ้นกล่องปฏิเสธ
**Priority:** High · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** `procurement.purchase_request_template.update` และไม่ใช่ admin ของ BU; มีเทมเพลตอย่างน้อย 1 ใบให้เปิด
**Steps**
1. เปิดหน้ารายละเอียดของเทมเพลตใบแรก
2. สังเกตปุ่ม `Edit`
3. กดปุ่ม `Edit`
**Expected**
ปุ่ม `Edit` แสดงอยู่ มี `aria-disabled="true"` และถูกทำจาง · เมื่อกดจะเปิดกล่อง "Permission Denied" และฟอร์ม **ไม่** เข้าสู่โหมดแก้ไข (หัวฟอร์มยังเป็นชื่อเทมเพลต ไม่ใช่ "Edit Purchase Request Template" และไม่มีปุ่ม `Save`)

---

## TC-PRT-200049 — ไม่มีสิทธิ์ delete เมนู Delete ของแถวเป็น aria-disabled
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
Login ด้วยบัญชีที่ **ไม่มี** `procurement.purchase_request_template.delete` และไม่ใช่ admin ของ BU; อยู่ที่หน้ารายการมุมมองรายการและมีเทมเพลตอย่างน้อย 1 ใบ
**Steps**
1. กดปุ่มท้ายแถวแรก (aria-label "Row actions")
2. สังเกตรายการ `Delete`
3. กดรายการ `Delete`
**Expected**
รายการ `Delete` ยังอยู่ในเมนู มี `aria-disabled="true"` และถูกทำจาง · เมื่อกดจะเปิดกล่อง "Permission Denied" และ **ไม่** เปิดกล่อง "Delete Template" — แถวยังอยู่ในตารางครบ
