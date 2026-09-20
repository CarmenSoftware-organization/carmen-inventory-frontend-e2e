# Wastage Reporting — User Stories

_Generated from `tests/710-wastage-reporting.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Wastage Reporting
**Spec:** `tests/710-wastage-reporting.spec.ts`
**Default role:** Admin
**Total test cases:** 20 (7 High / 6 Medium / 7 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-WAST-010001 | หน้า list Wastage Reporting โหลดสำเร็จ | High | Smoke |
| TC-WAST-010002 | คอลัมน์ตาราง (GRN/สินค้า/สถานที่/lot/วันหมดอายุ/เหลือกี่วัน/สถานะ/ของเหลือ/ต้นทุน/มูลค่า) แสดงครบ | Medium | Functional |
| TC-WAST-010004 | ค้นหาด้วยการกด Enter ในช่อง Search กรองรายการได้ | Medium | Functional |
| TC-WAST-010005 | ค้นหาคำที่ไม่มีต้องแสดง empty state | Medium | Functional |
| TC-WAST-010006 | filter สถานะ (Expired / Expiring) ใช้งานได้ | High | Functional |
| TC-WAST-010007 | pagination เปลี่ยนหน้าและเปลี่ยนจำนวนแถวต่อหน้าได้ | Low | Functional |
| TC-WAST-010008 | summary bar แสดงจำนวนรายการ/หมดอายุ/ใกล้หมดอายุ และจำนวน-มูลค่าที่เสี่ยง | High | Functional |
| TC-WAST-010009 | chip ใน Active filter bar แก้ค่าและลบ filter ได้ | Medium | Functional |
| TC-WAST-010010 | เรียงลำดับได้เฉพาะคอลัมน์ GRN No. และ Expiry Date | Medium | Functional |
| TC-WAST-010011 | บันทึกและเรียกใช้ saved view ของหน้านี้ได้ | Low | Functional |
| TC-WAST-010012 | ปุ่มล้างในช่องค้นหาคืนรายการทั้งหมด | Low | Alternate Flow |
| TC-WAST-010050 | active BU = BLAVG | High | Smoke |
| TC-WAST-020001 | กด GRN No. เปิดใบ GRN ต้นทาง | High | Smoke |
| TC-WAST-020003 | คลิกเซลล์อื่นหรือตัวแถวไม่นำทางออกจากหน้า | Low | Functional |
| TC-WAST-100001 | ผู้ใช้ไม่มีสิทธิ์ stock_out.view ต้องเห็นกล่องปฏิเสธสิทธิ์ | High | Authorization |
| TC-WAST-100002 | ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login | High | Auth-guard |
| TC-WAST-100003 | BU ที่ไม่ได้ซื้อ feature wastage_reporting ถูกล็อกแม้เป็น admin | Low | Authorization |
| TC-WAST-900001 | mobile ใช้ bottom sheet สำหรับ filter และตารางเลื่อนแนวนอนได้ | Low | Edge Case |
| TC-WAST-900002 | API ล้มเหลวต้องแสดง ErrorState พร้อมปุ่มลองใหม่ | Medium | Edge Case |
| TC-WAST-900003 | เปิดลิงก์ที่มี sv ของ view ที่ถูกลบแล้ว ต้องเตือนและล้างค่าออก | Low | Edge Case |

---

## TC-WAST-010001 — หน้า list Wastage Reporting โหลดสำเร็จ

> **As a** Admin user, **I want** the Wastage Reporting list page to load successfully, **so that** I can manage Wastage Reporting records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

เข้าสู่ระบบเป็น Admin (admin@blueledgers.com); active BU = BLAVG; BU มี license store_operations.wastage_reporting

**Steps**

1. ไปที่ /store-operation/wastage-reporting

**Expected**

URL ตรงกับ /store-operation/wastage-reporting; หัวข้อหน้า 'Wastage Reporting' และคำอธิบายแสดง; toolbar มีช่องค้นหา, View selector และปุ่ม Filter (ไม่มีปุ่ม Add); DataGrid แสดงผลภายใน 10 วินาที

---

## TC-WAST-010002 — คอลัมน์ตาราง (GRN/สินค้า/สถานที่/lot/วันหมดอายุ/เหลือกี่วัน/สถานะ/ของเหลือ/ต้นทุน/มูลค่า) แสดงครบ

> **As a** Admin user, **I want** this Wastage Reporting interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มี lot ใน BU อย่างน้อย 1 รายการ

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. ตรวจหัวตารางและเซลล์ในแถวแรก

**Expected**

หัวตารางแสดงคอลัมน์ครบถ้วนตาม schema ของ Wastage Reporting

---

## TC-WAST-010004 — ค้นหาด้วยการกด Enter ในช่อง Search กรองรายการได้

> **As a** Admin user, **I want** to filter the Wastage Reporting list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีรายการในตารางหลายแถว

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. พิมพ์คำค้นลงในช่อง Search
3. กด Enter

**Expected**

URL เพิ่ม search=<คำค้น> และ page ถูกรีเซ็ต; ตารางยิง request ใหม่และแสดงเฉพาะรายการที่ตรงกับคำค้น

---

## TC-WAST-010005 — ค้นหาคำที่ไม่มีต้องแสดง empty state

> **As a** Admin user, **I want** a clear empty-state when no Wastage Reporting records match my search, **so that** I know nothing was found.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. พิมพ์คำค้นที่ไม่มีในระบบแล้วกด Enter

**Expected**

ตารางไม่มีแถวข้อมูล และแสดง empty component ข้อความ 'No data found' แทน

---

## TC-WAST-010006 — filter สถานะ (Expired / Expiring) ใช้งานได้

> **As a** Admin user, **I want** to filter the Wastage Reporting list, **so that** I can narrow results to relevant records.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport เดสก์ท็อป

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. กดปุ่ม Filter
3. เลือก Expired จาก submenu

**Expected**

URL เพิ่ม filter=status|string:expired และรีเซ็ต page; ปุ่ม Filter ขึ้น badge จำนวน 1

---

## TC-WAST-010007 — pagination เปลี่ยนหน้าและเปลี่ยนจำนวนแถวต่อหน้าได้

> **As a** Admin user, **I want** to paginate through Wastage Reporting records, **so that** I can browse large lists efficiently.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีข้อมูลมากกว่า 10 แถว

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. กดปุ่มไปหน้าถัดไปบนแถบ pagination
3. เปลี่ยนจำนวนแถวต่อหน้าเป็น 25

**Expected**

URL เพิ่ม page=2 และ perpage=25 เมื่อเปลี่ยนค่า pagination

---

## TC-WAST-010008 — summary bar แสดงจำนวนรายการ/หมดอายุ/ใกล้หมดอายุ และจำนวน-มูลค่าที่เสี่ยง

> **As a** Admin user, **I want** this Wastage Reporting interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** High · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; response มี summary

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. ตรวจแถบสรุปเหนือตาราง

**Expected**

แถบสรุปแสดงจำนวนรายการ, หมดอายุ, ใกล้หมดอายุ, Qty at risk และ Value at risk

---

## TC-WAST-010009 — chip ใน Active filter bar แก้ค่าและลบ filter ได้

> **As a** Admin user, **I want** to filter the Wastage Reporting list, **so that** I can narrow results to relevant records.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list โดยเลือก filter Status = Expired ไว้แล้ว

**Steps**

1. เปิดหน้าพร้อม filter
2. กดปุ่มล้าง filter บน chip หรือ Clear all

**Expected**

chip หายไป, filter ถูกล้างจาก URL และตารางกลับมาแสดงทุกสถานะ

---

## TC-WAST-010010 — เรียงลำดับได้เฉพาะคอลัมน์ GRN No. และ Expiry Date

> **As a** Admin user, **I want** to sort the Wastage Reporting list, **so that** I can find records in a useful order.

**Priority:** Medium · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีข้อมูลอย่างน้อย 2 แถว

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. กดหัวคอลัมน์ Expiry Date
3. ตรวจสอบ sort parameter ใน URL

**Expected**

URL เป็น sort=expired_at:asc หรือ expired_at:desc; คอลัมน์อื่นไม่มีปุ่ม sort

---

## TC-WAST-010011 — บันทึกและเรียกใช้ saved view ของหน้านี้ได้

> **As a** Admin user, **I want** this Wastage Reporting interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport เดสก์ท็อป

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. ตรวจสอบการมีอยู่ของปุ่ม View selector

**Expected**

View selector มีอยู่บน toolbar

---

## TC-WAST-010012 — ปุ่มล้างในช่องค้นหาคืนรายการทั้งหมด

> **As a** Admin user, **I want** this Wastage Reporting behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Alternate Flow

**Preconditions**

เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list และค้นหาคำหนึ่งไว้แล้ว

**Steps**

1. ไปที่ /store-operation/wastage-reporting?search=SAMPLE
2. กดปุ่มล้างในช่องค้นหา

**Expected**

ช่องค้นว่าง และ search ถูกล้างจาก URL

---

## TC-WAST-010050 — active BU = BLAVG

> **As a** Admin user, **I want** core Wastage Reporting interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

เข้าสู่ระบบเป็น Admin; ผู้ใช้ผูกกับ BU BLAVG

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. ตรวจ BU ที่ active บน header/BU switcher

**Expected**

Business Unit ที่ active คือ BLAVG

---

## TC-WAST-020001 — กด GRN No. เปิดใบ GRN ต้นทาง

> **As a** Admin user, **I want** core Wastage Reporting interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; มีรายการในตารางอย่างน้อย 1 แถว

**Steps**

1. ไปที่ /store-operation/wastage-reporting
2. กดที่ค่า GRN No. ในแถวแรก

**Expected**

นำทางไปยัง /procurement/goods-receive-note/{grn_id}

---

## TC-WAST-020003 — คลิกเซลล์อื่นหรือตัวแถวไม่นำทางออกจากหน้า

> **As a** Admin user, **I want** this Wastage Reporting interaction to behave as expected, **so that** the workflow stays predictable.

**Priority:** Low · **Test Type:** Functional

**Preconditions**

เข้าสู่ระบบเป็น Admin; อยู่ที่หน้า list

**Steps**

1. คลิกที่เซลล์ Product หรือ Location
2. ตรวจสอบ URL

**Expected**

URL ยังคงเป็น /store-operation/wastage-reporting (ไม่มีการนำทาง)

---

## TC-WAST-100001 — ผู้ใช้ไม่มีสิทธิ์ stock_out.view ต้องเห็นกล่องปฏิเสธสิทธิ์

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Wastage Reporting, **so that** role separation is enforced.

**Priority:** High · **Test Type:** Authorization

**Preconditions**

เข้าสู่ระบบด้วยบัญชีที่ไม่มี permission inventory_management.stock_out.view

**Steps**

1. พยายามเข้า /store-operation/wastage-reporting โดยตรง

**Expected**

แสดงกล่อง AccessDeniedBlock (role='alert') พร้อมข้อความปฏิเสธสิทธิ์

---

## TC-WAST-100002 — ผู้ที่ไม่ได้ login เข้าหน้าตรง ๆ ต้องถูก redirect ไป /login

> **As an** unauthenticated user hitting a protected route, **I want** to be redirected to /login, **so that** protected screens stay protected.

**Priority:** High · **Test Type:** Auth-guard

**Preconditions**

ไม่มี session (browser context ที่ยังไม่ได้ล็อกอิน)

**Steps**

1. เปิด /store-operation/wastage-reporting โดยตรงใน browser context ที่ไม่มี session

**Expected**

ถูก redirect ไปยัง /login และไม่มีข้อมูล lot ปรากฏบนจอ

---

## TC-WAST-100003 — BU ที่ไม่ได้ซื้อ feature wastage_reporting ถูกล็อกแม้เป็น admin

> **As a** low-privilege user, **I should NOT** see Add/edit controls on Wastage Reporting, **so that** role separation is enforced.

**Priority:** Low · **Test Type:** Authorization

**Preconditions**

BU ที่ license ไม่รวม store_operations.wastage_reporting

**Steps**

1. เข้า /store-operation/wastage-reporting โดยตรง

**Expected**

แสดงกล่องปฏิเสธสิทธิ์เหตุผล license หรือเข้าหน้าปกติหาก BU มี license

---

## TC-WAST-900001 — mobile ใช้ bottom sheet สำหรับ filter และตารางเลื่อนแนวนอนได้

> **As a** Admin user, **I want** this Wastage Reporting behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG; ใช้ viewport ขนาดมือถือ

**Steps**

1. เปิด /store-operation/wastage-reporting ด้วย viewport มือถือ (375x667)
2. กดปุ่ม Filter

**Expected**

ปุ่ม Filter เปิด bottom sheet; ตารางเลื่อนแนวนอนได้โดยหน้าไม่ล้น

---

## TC-WAST-900002 — API ล้มเหลวต้องแสดง ErrorState พร้อมปุ่มลองใหม่

> **As a** Admin user, **I want** this Wastage Reporting behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG

**Steps**

1. ตั้ง route interception ให้ endpoint ตอบ 500
2. เปิด /store-operation/wastage-reporting
3. ปลด interception แล้วกดปุ่มลองใหม่

**Expected**

แสดง ErrorState พร้อมปุ่มลองใหม่ (Try again) และกดลองใหม่โหลดข้อมูลสำเร็จ

---

## TC-WAST-900003 — เปิดลิงก์ที่มี sv ของ view ที่ถูกลบแล้ว ต้องเตือนและล้างค่าออก

> **As a** Admin user, **I want** this Wastage Reporting behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

เข้าสู่ระบบเป็น Admin; active BU = BLAVG

**Steps**

1. เปิด /store-operation/wastage-reporting?sv=invalid-uuid-0000

**Expected**

sv ถูกล้างออกจาก URL และตารางยังแสดงผลได้ตามปกติ

---


<sub>Last regenerated: 2026-09-20 · git da448c6</sub>
