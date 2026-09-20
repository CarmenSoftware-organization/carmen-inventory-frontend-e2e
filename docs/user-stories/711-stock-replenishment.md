# Stock Replenishment — User Stories

_Generated from `tests/711-stock-replenishment.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Stock Replenishment
**Spec:** `tests/711-stock-replenishment.spec.ts`
**Default role:** Admin
**Total test cases:** 36 (14 High / 17 Medium / 5 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-SRPL-010001 | หน้า Stock Replenishment โหลดสำเร็จ | High | Smoke |
| TC-SRPL-010002 | แถบสรุป (locations/items/critical/warning/low/Total reorder) แสดงครบ | High | Functional |
| TC-SRPL-010003 | แถบหัว location แสดง checkbox + รหัส/ชื่อคลัง + badge จำนวนและสถานะ | Medium | Functional |
| TC-SRPL-010004 | ขยาย/ยุบ location เดี่ยวได้ | Medium | Functional |
| TC-SRPL-010005 | ปุ่มสลับ Expand all / Collapse all ทำงาน | Medium | Functional |
| TC-SRPL-010006 | คอลัมน์ตารางสินค้า (select/#/Product/Category/Sub Category/Item Group/On Hand/Min/Max/Par/Reorder/Status) แสดงครบ | Medium | Functional |
| TC-SRPL-010007 | ค้นหาด้วยชื่อ/รหัส/ชื่อท้องถิ่น/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้ | Medium | Functional |
| TC-SRPL-010008 | ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ | Medium | Functional |
| TC-SRPL-010009 | ปุ่ม Refresh โหลดข้อมูลใหม่ | Low | Functional |
| TC-SRPL-010010 | ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ | Low | Functional |
| TC-SRPL-010050 | active BU = BLAVG | High | Smoke |
| TC-SRPL-020001 | badge สถานะสินค้า (Critical/Warning/Low) แสดงโทนถูกต้อง | Medium | Functional |
| TC-SRPL-020002 | คอลัมน์ Reorder แสดง reorder_qty ตัวหนา และผลรวมตรงกับ Total reorder | Medium | Functional |
| TC-SRPL-020003 | คอลัมน์ Product แสดงชื่อท้องถิ่นเป็นบรรทัดรอง | Low | Functional |
| TC-SRPL-060001 | เลือกสินค้าในแถวเดียวด้วย checkbox ได้ | High | Functional |
| TC-SRPL-060002 | เลือกทั้งหมดใน location ด้วย checkbox บนแถบหัว location | Medium | Functional |
| TC-SRPL-060003 | checkbox แถบหัว location แสดงสถานะ indeterminate เมื่อเลือกบางส่วน | Medium | Functional |
| TC-SRPL-060004 | เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง | Medium | Functional |
| TC-SRPL-060005 | ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก | High | Functional |
| TC-SRPL-060006 | ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป | Medium | Functional |
| TC-SRPL-060007 | กด Create PR เปิด wizard พร้อมตารางรายการที่ติ๊ก | High | Functional |
| TC-SRPL-060008 | ปุ่ม Create ใน PR wizard ปิดจนกว่าจะเลือก workflow + หน่วย + จำนวน > 0 | High | Validation |
| TC-SRPL-060009 | ตัดแถวออกจาก PR wizard ด้วยปุ่มถังขยะ | Medium | Functional |
| TC-SRPL-060010 | กด Create SR (ติ๊กคลังเดียว) เปิด wizard พร้อม Workflow / Request From / Deliver To | High | Functional |
| TC-SRPL-060011 | ช่อง Request From ของ SR wizard ไม่มีคลังปลายทางให้เลือก | Medium | Functional |
| TC-SRPL-060012 | ปิด wizard ด้วย Cancel แล้วไม่มีเอกสารเกิดขึ้นและรายการที่ติ๊กยังอยู่ | Medium | Functional |
| TC-SRPL-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ ต้องเจอ Access Denied | High | Authorization |
| TC-SRPL-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-SRPL-100003 | Admin เข้าหน้าได้แม้ไม่มี permission ตรง ๆ | Medium | Authorization |
| TC-SRPL-300001 | Create PR สร้างใบขอซื้อจากรายการที่เลือกได้สำเร็จ | High | Integration |
| TC-SRPL-300002 | Create SR สร้างใบเบิกจากรายการที่เลือกได้สำเร็จ | High | Integration |
| TC-SRPL-300003 | ติ๊กข้ามหลายคลังแล้ว Create PR ได้ใบขอซื้อคลังละใบ | High | Integration |
| TC-SRPL-900001 | กรณีไม่มีสินค้าต้องเติม / empty state | Low | Edge Case |
| TC-SRPL-900002 | กด Create SR ขณะติ๊กข้าม 2 คลังขึ้นไป ต้องเตือนว่าใบเบิกทำได้ทีละคลัง | High | Edge Case |
| TC-SRPL-900003 | ไม่มี workflow ที่เริ่มได้ กด Create PR/SR แล้วเด้ง Permission Denied | Medium | Edge Case |
| TC-SRPL-900004 | โหลดข้อมูลล้มเหลวต้องแสดง error state พร้อมปุ่ม Try again | Low | Edge Case |

---

## TC-SRPL-010001 — หน้า Stock Replenishment โหลดสำเร็จ

> **As a** Admin user, **I want** core Stock Replenishment interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; active BU = BLAVG; บัญชีมีสิทธิ์ inventory_management.stock_in.view และ license store_operations.stock_replenishment

**Steps**

1. ไปที่ /store-operation/stock-replenishment

**Expected**

URL ตรงกับ /store-operation/stock-replenishment; หัวข้อหน้า 'Stock Replenishment' และคำอธิบายแสดง; แถบสรุปแสดงผลภายใน 10 วินาที

---

## TC-SRPL-010002 — แถบสรุป (locations/items/critical/warning/low/Total reorder) แสดงครบ

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; อยู่ที่หน้า Stock Replenishment

**Steps**

1. ไปที่ /store-operation/stock-replenishment
2. ตรวจแถบสรุปด้านบนสุดของรายการ

**Expected**

แถบสรุปแสดง locations, items, critical, warning, low badges และ Total reorder

---

## TC-SRPL-010003 — แถบหัว location แสดง checkbox + รหัส/ชื่อคลัง + badge จำนวนและสถานะ

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีข้อมูล location

**Steps**

1. ไปที่ /store-operation/stock-replenishment
2. ตรวจแถบหัวของแต่ละ location

**Expected**

แถบ location ประกอบด้วย checkbox, chevron icon, location code/name และ badges

---

## TC-SRPL-010004 — ขยาย/ยุบ location เดี่ยวได้

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีอย่างน้อย 1 location

**Steps**

1. กดที่ปุ่ม collapsible บนแถบหัว location
2. กดซ้ำที่ปุ่มเดิม

**Expected**

ครั้งแรกตารางสินค้าเปิดออก ครั้งที่สองตารางยุบกลับ

---

## TC-SRPL-010005 — ปุ่มสลับ Expand all / Collapse all ทำงาน

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; อยู่ที่หน้า Stock Replenishment

**Steps**

1. กดปุ่ม 'Expand all'
2. กดปุ่มเดิมอีกครั้ง ('Collapse all')

**Expected**

ปุ่มสลับป้ายระหว่าง Expand all และ Collapse all

---

## TC-SRPL-010006 — คอลัมน์ตารางสินค้า (select/#/Product/Category/Sub Category/Item Group/On Hand/Min/Max/Par/Reorder/Status) แสดงครบ

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; ขยาย location หนึ่ง

**Steps**

1. ไปที่ /store-operation/stock-replenishment
2. ตรวจสอบตารางสินค้าภายใน location

**Expected**

ตารางแสดงคอลัมน์ถูกต้องตามลำดับ

---

## TC-SRPL-010007 — ค้นหาด้วยชื่อ/รหัส/ชื่อท้องถิ่น/หมวด/หมวดย่อย/กลุ่มสินค้า ใช้งานได้

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; อยู่ที่หน้า Stock Replenishment

**Steps**

1. พิมพ์คำค้นในช่อง Search
2. กด Enter หรือไอคอนแว่นขยาย

**Expected**

แสดงเฉพาะ location และสินค้าที่ตรงกับคำค้น

---

## TC-SRPL-010008 — ค้นหาคำที่ไม่มีต้องไม่แสดง location ใด ๆ

> **As a** Admin user, **I want** a clear empty-state when no Stock Replenishment records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. พิมพ์คำค้นที่ไม่มีในระบบแล้วกด Enter

**Expected**

ไม่แสดง location ใด ๆ และตัวนับ items เป็น 0

---

## TC-SRPL-010009 — ปุ่ม Refresh โหลดข้อมูลใหม่

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. กดปุ่ม Refresh บน toolbar

**Expected**

โหลดข้อมูลใหม่และหน้าไม่ crash

---

## TC-SRPL-010010 — ล้างคำค้นด้วยปุ่ม X แล้วรายการกลับมาครบ

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีคำค้นค้างอยู่

**Steps**

1. พิมพ์คำค้นในช่อง Search
2. ล้างคำค้นและกด Enter

**Expected**

ช่องค้นว่างและรายการทั้งหมดกลับมา

---

## TC-SRPL-010050 — active BU = BLAVG

> **As a** Admin user, **I want** core Stock Replenishment interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

เข้าสู่ระบบเป็น Admin/Store Manager; ผู้ใช้ผูกกับ BU BLAVG

**Steps**

1. ไปที่ /store-operation/stock-replenishment
2. ตรวจ BU ที่ active

**Expected**

Business Unit ที่ active คือ BLAVG

---

## TC-SRPL-020001 — badge สถานะสินค้า (Critical/Warning/Low) แสดงโทนถูกต้อง

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. ตรวจสอบ badge สถานะในแถบสรุป

**Expected**

badge แสดง Critical (แดง), Warning (เหลือง), Low (กลาง)

---

## TC-SRPL-020002 — คอลัมน์ Reorder แสดง reorder_qty ตัวหนา และผลรวมตรงกับ Total reorder

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. ตรวจสอบค่า Total reorder บนแถบสรุป

**Expected**

Total reorder แสดงตัวเลขผลรวมชัดเจน

---

## TC-SRPL-020003 — คอลัมน์ Product แสดงชื่อท้องถิ่นเป็นบรรทัดรอง

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. ไปที่ /store-operation/stock-replenishment
2. ตรวจสอบ layout สินค้า

**Expected**

คอมโพเนนต์ Product รองรับการแสดง subtext สำหรับชื่อท้องถิ่น

---

## TC-SRPL-060001 — เลือกสินค้าในแถวเดียวด้วย checkbox ได้

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีสินค้าในตาราง

**Steps**

1. ขยาย location หนึ่ง
2. ติ๊ก checkbox หน้าสินค้าแถวแรก

**Expected**

checkbox ถูกเลือกและปุ่ม Create PR / Create SR ปรากฏ

---

## TC-SRPL-060002 — เลือกทั้งหมดใน location ด้วย checkbox บนแถบหัว location

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มี location

**Steps**

1. ติ๊ก checkbox บนแถบหัว location

**Expected**

สินค้าทั้งหมดใน location ถูกเลือก

---

## TC-SRPL-060003 — checkbox แถบหัว location แสดงสถานะ indeterminate เมื่อเลือกบางส่วน

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มี location ที่มีสินค้า > 1 ชิ้น

**Steps**

1. ติ๊กเลือกเฉพาะสินค้าบางชิ้นใน location

**Expected**

checkbox แถบหัว location แสดงสถานะ indeterminate (data-state='indeterminate')

---

## TC-SRPL-060004 — เลือกข้ามหลาย location แล้วตัวนับรวมถูกต้อง

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. ติ๊กเลือกสินค้าข้าม location
2. ดูตัวเลขบนปุ่ม Create PR

**Expected**

ปุ่ม Create PR แสดงจำนวนยอดรวมสินค้าที่เลือกทั้งหมด

---

## TC-SRPL-060005 — ปุ่ม Create PR / Create SR แสดงเมื่อมีการเลือก พร้อมจำนวนที่เลือก

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีการเลือกสินค้า

**Steps**

1. ติ๊กเลือกสินค้าอย่างน้อย 1 รายการ

**Expected**

section ปุ่มสร้างเอกสารแสดงปุ่ม Create PR ({n}) และ Create SR ({n})

---

## TC-SRPL-060006 — ยกเลิกการเลือกทั้งหมดแล้วปุ่ม Create PR/SR หายไป

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; มีการเลือกสินค้าอยู่

**Steps**

1. ติ๊กเลือกสินค้าแล้วติ๊กออกให้ไม่มีการเลือก

**Expected**

ปุ่ม Create PR และ Create SR หายไปจากหน้าจอ

---

## TC-SRPL-060007 — กด Create PR เปิด wizard พร้อมตารางรายการที่ติ๊ก

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; ติ๊กเลือกสินค้าอย่างน้อย 1 รายการ

**Steps**

1. ติ๊กเลือกสินค้า
2. กดปุ่ม Create PR

**Expected**

เปิด Dialog Wizard ของ PR พร้อมตารางแสดงรายการสินค้าที่เลือก

---

## TC-SRPL-060008 — ปุ่ม Create ใน PR wizard ปิดจนกว่าจะเลือก workflow + หน่วย + จำนวน > 0

> **As a** Admin user, **I want** the system to block invalid Stock Replenishment submissions, **so that** data quality is preserved.

**Priority:** High · **Test Type:** Validation

**Preconditions**

อยู่ที่ PR Wizard dialog

**Steps**

1. เปิด PR wizard โดยยังไม่เลือก workflow

**Expected**

ปุ่มยืนยัน Create ถูก disable หรือปิดการทำงาน

---

## TC-SRPL-060009 — ตัดแถวออกจาก PR wizard ด้วยปุ่มถังขยะ

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

อยู่ที่ PR Wizard dialog ที่มีสินค้าหลายแถว

**Steps**

1. กดปุ่มถังขยะท้ายแถวสินค้าใน wizard

**Expected**

แถวนั้นถูกตัดออกจากรายการที่จะสร้าง PR

---

## TC-SRPL-060010 — กด Create SR (ติ๊กคลังเดียว) เปิด wizard พร้อม Workflow / Request From / Deliver To

> **As a** Admin user, **I want** this Stock Replenishment interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เลือกสินค้าจาก location เดียว

**Steps**

1. กดปุ่ม Create SR

**Expected**

เปิด Dialog SR Wizard พร้อมฟิลด์ Workflow, Request From และ Deliver To

---

## TC-SRPL-060011 — ช่อง Request From ของ SR wizard ไม่มีคลังปลายทางให้เลือก

> **As a** Admin user, **I want** a clear empty-state when no Stock Replenishment records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

อยู่ที่ SR Wizard dialog

**Steps**

1. ตรวจสอบตัวเลือกใน dropdown Request From

**Expected**

คลังที่เป็นปลายทาง (Deliver To) จะไม่ปรากฏในตัวเลือกของ Request From

---

## TC-SRPL-060012 — ปิด wizard ด้วย Cancel แล้วไม่มีเอกสารเกิดขึ้นและรายการที่ติ๊กยังอยู่

> **As a** Admin user, **I want** a clear empty-state when no Stock Replenishment records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

อยู่ที่ PR หรือ SR Wizard dialog

**Steps**

1. กดปุ่ม Cancel ปิด dialog

**Expected**

dialog ปิดลง, ไม่มีเอกสารใหม่เกิดขึ้น และรายการที่ติ๊กไว้ยังคงถูกเลือกอยู่

---

## TC-SRPL-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรง ๆ ต้องเจอ Access Denied

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Stock Replenishment, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

เข้าสู่ระบบด้วยบัญชีที่ไม่มีสิทธิ์ inventory_management.stock_in.view

**Steps**

1. เปิด /store-operation/stock-replenishment โดยตรง

**Expected**

แสดง AccessDeniedBlock (role='alert')

---

## TC-SRPL-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login

> **As an** unauthenticated user hitting a protected route, **I want** to be redirected to /login, **so that** protected screens stay protected.

**Priority:** High · **Test Type:** Auth-guard

**Preconditions**

ไม่มี session

**Steps**

1. เปิด /store-operation/stock-replenishment โดยตรงใน browser context ใหม่

**Expected**

ถูก redirect ไปยัง /login

---

## TC-SRPL-100003 — Admin เข้าหน้าได้แม้ไม่มี permission ตรง ๆ

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Stock Replenishment, **so that** role separation is enforced.

**Priority:** Medium · **Test Type:** Authorization

**Preconditions**

เข้าสู่ระบบเป็น Admin

**Steps**

1. ไปที่ /store-operation/stock-replenishment

**Expected**

เข้าหน้าสำเร็จ (Admin permission bypass)

---

## TC-SRPL-300001 — Create PR สร้างใบขอซื้อจากรายการที่เลือกได้สำเร็จ

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Integration

**Preconditions**

มี workflow PR ที่เริ่มได้; ติ๊กเลือกสินค้า

**Steps**

1. เปิด PR wizard
2. กรอกข้อมูลครบและกด Create PR

**Expected**

สร้างเอกสาร PR จริงในระบบสำเร็จ

---

## TC-SRPL-300002 — Create SR สร้างใบเบิกจากรายการที่เลือกได้สำเร็จ

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Integration

**Preconditions**

มี workflow SR ที่เริ่มได้; ติ๊กเลือกสินค้าคลังเดียว

**Steps**

1. เปิด SR wizard
2. กรอกข้อมูลครบและกด Create SR

**Expected**

สร้างเอกสาร SR จริงในระบบสำเร็จ

---

## TC-SRPL-300003 — ติ๊กข้ามหลายคลังแล้ว Create PR ได้ใบขอซื้อคลังละใบ

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Integration

**Preconditions**

เลือกสินค้าข้ามหลาย location

**Steps**

1. สร้าง PR สำหรับหลายคลัง

**Expected**

สร้างใบ PR แยกตามแต่ละคลังสำเร็จ

---

## TC-SRPL-900001 — กรณีไม่มีสินค้าต้องเติม / empty state

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin; BU ไม่มีสินค้าที่ต้องเติม

**Steps**

1. ไปที่ /store-operation/stock-replenishment

**Expected**

แถบสรุปแสดง 0 ทุกค่า และหน้าไม่ crash

---

## TC-SRPL-900002 — กด Create SR ขณะติ๊กข้าม 2 คลังขึ้นไป ต้องเตือนว่าใบเบิกทำได้ทีละคลัง

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

เลือกสินค้าจาก 2 location ขึ้นไป

**Steps**

1. กดปุ่ม Create SR

**Expected**

แสดง WarningDialog เตือนว่าใบเบิกสร้างได้ทีละ location เท่านั้น

---

## TC-SRPL-900003 — ไม่มี workflow ที่เริ่มได้ กด Create PR/SR แล้วเด้ง Permission Denied

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

บัญชีที่ไม่มีสิทธิ์เริ่ม workflow ของ PR หรือ SR

**Steps**

1. กดปุ่ม Create PR หรือ Create SR

**Expected**

แสดง dialog Permission Denied แจ้งเหตุผล

---

## TC-SRPL-900004 — โหลดข้อมูลล้มเหลวต้องแสดง error state พร้อมปุ่ม Try again

> **As a** Admin user, **I want** this Stock Replenishment behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

เข้าสู่ระบบเป็น Store Manager/Admin

**Steps**

1. ตั้ง route intercept ตอบ 500 สำหรับ endpoint stock-replenishments
2. ไปที่หน้านี้
3. ปลด intercept แล้วกด Try again

**Expected**

แสดง ErrorState พร้อมปุ่ม Try again และกู้คืนได้เมื่อกดลองใหม่

---


<sub>Last regenerated: 2026-09-20 · git da448c6</sub>
