# Section Landing Pages & 404 — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module landings under `routes/*/page.tsx`, `components/dashboard-widget`, `components/module-landing`, and `components/not-found-component`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Section landing / navigation shell pages + Not-Found (404)
**Frontend route:** `routes/{config,inventory-management,operation-plan,procurement,product-management,vendor-management,store-operation,system-admin}/page.tsx`, `routes/not-found`
**Prefix:** `LAND`
**Default role:** Any authenticated user (404 page เข้าได้ทุกสถานะ)
**Total test cases:** 16

> แต่ละ section ของแอปมี **landing page** ที่ผู้ใช้เห็นเมื่อคลิกเมนูหลัก. มี 2 รูปแบบ: (1) **Dashboard widget grid** — `/config`, `/inventory-management`, `/operation-plan`, `/procurement`, `/product-management`, `/vendor-management` ใช้ `DashboardWidgetGrid` แสดง title + description + stat tiles (widgets) ของโมดูลนั้น พร้อมสถานะ loading (`aria-busy`), empty (ไม่มี widget), และ error (loadError). (2) **Module landing list** — `/store-operation` ใช้ `ModuleLanding` แสดงการ์ดของ sub-module ที่ผู้ใช้มีสิทธิ์ (แต่ละการ์ดเป็นลิงก์ไป route ของ sub-module; sub-module ที่ไม่มีสิทธิ์จะจาง opacity-50 และคลิกแล้ว dispatch permission-denied แทนการนำทาง) พร้อม badge นับจำนวน sub-module; `/system-admin` ใช้ `SystemAdminLanding` แบบ editorial chapters พร้อม CTA. หน้า **404 Not-Found** (`routes/not-found`) แสดงเลข 404, eyebrow, title, description และปุ่ม "Back to Dashboard" ที่ลิงก์ไป `/dashboard`. ทุก landing ต้องผ่าน auth guard (ยกเว้น 404 ที่เป็น fallback).

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-LAND-010001 | /config landing โหลดแสดง title/description + stat tiles | High | Smoke |
| TC-LAND-010002 | /vendor-management landing แสดง widget grid | Medium | Smoke |
| TC-LAND-010003 | /procurement landing แสดง widget grid | Medium | Smoke |
| TC-LAND-010004 | /inventory-management landing แสดง widget grid | Medium | Smoke |
| TC-LAND-010005 | /operation-plan landing แสดง widget grid | Medium | Smoke |
| TC-LAND-010006 | /product-management landing แสดง widget grid | Medium | Smoke |
| TC-LAND-010007 | /store-operation landing แสดงการ์ด sub-module + badge นับจำนวน | Medium | Smoke |
| TC-LAND-010008 | /system-admin landing แสดง chapters/เมนูของระบบ | Medium | Smoke |
| TC-LAND-100001 | เข้า landing โดยไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-LAND-400001 | store-operation: คลิกการ์ด sub-module นำไป route ที่ถูกต้อง | Medium | Functional |
| TC-LAND-400002 | store-operation: การ์ด sub-module ที่ไม่มีสิทธิ์จางและไม่ออกนอกหน้า | Medium | Authorization |
| TC-LAND-900001 | dashboard แสดงสถานะ loading (aria-busy) ระหว่างโหลด widget | Low | Functional |
| TC-LAND-900002 | dashboard แสดงข้อความ empty เมื่อไม่มี widget | Low | Edge Case |
| TC-LAND-900003 | dashboard แสดงข้อความ error เมื่อโหลด widget ล้มเหลว | Low | Negative |
| TC-LAND-900004 | เปิด URL ที่ไม่มีอยู่แสดงหน้า 404 พร้อมปุ่ม Back to Dashboard | Medium | Edge Case |
| TC-LAND-900005 | คลิก Back to Dashboard บนหน้า 404 กลับไป /dashboard | Medium | Functional |

---
## TC-LAND-010001 — /config landing โหลดแสดง title/description + stat tiles
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ระบบรับรองแล้วและมีสิทธิ์เข้าถึง config
**Steps**
1. ไปที่ `/config`
2. รอ widget โหลด
**Expected**
URL ตรงกับ `/config`, แสดงหัวข้อ + คำอธิบายของโมดูล และ stat tiles (widgets) อย่างน้อย 1 รายการ ไม่เป็น 404

---
## TC-LAND-010002 — /vendor-management landing แสดง widget grid
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง vendor management
**Steps**
1. ไปที่ `/vendor-management`
**Expected**
แสดง dashboard widget grid ของ vendor management (title/description + stat tiles เช่น vendor, price list, request-for-pricing) ไม่เป็น 404

---
## TC-LAND-010003 — /procurement landing แสดง widget grid
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง procurement
**Steps**
1. ไปที่ `/procurement`
**Expected**
แสดง dashboard widget grid ของ procurement (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010004 — /inventory-management landing แสดง widget grid
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง inventory management
**Steps**
1. ไปที่ `/inventory-management`
**Expected**
แสดง dashboard widget grid ของ inventory management (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010005 — /operation-plan landing แสดง widget grid
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง operation plan
**Steps**
1. ไปที่ `/operation-plan`
**Expected**
แสดง dashboard widget grid ของ operation plan (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010006 — /product-management landing แสดง widget grid
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง product management
**Steps**
1. ไปที่ `/product-management`
**Expected**
แสดง dashboard widget grid ของ product management (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010007 — /store-operation landing แสดงการ์ด sub-module + badge นับจำนวน
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง store operation อย่างน้อย 1 sub-module
**Steps**
1. ไปที่ `/store-operation`
**Expected**
แสดงคำอธิบายโมดูล, badge นับจำนวน sub-module และการ์ด sub-module (เช่น Store Requisition, Wastage Reporting, Stock Replenishment) เป็นลิงก์

---
## TC-LAND-010008 — /system-admin landing แสดง chapters/เมนูของระบบ
**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ system admin
**Steps**
1. ไปที่ `/system-admin`
**Expected**
แสดงหน้า landing แบบ editorial (chapters) พร้อม CTA ไปยังเมนูย่อยของ system admin (role, user, workflow, ฯลฯ) ไม่เป็น 404

---
## TC-LAND-100001 — เข้า landing โดยไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/vendor-management` (หรือ section landing อื่น) ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง

---
## TC-LAND-400001 — store-operation: คลิกการ์ด sub-module นำไป route ที่ถูกต้อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation` และมีสิทธิ์เข้าถึง sub-module อย่างน้อย 1 รายการ
**Steps**
1. คลิกการ์ด sub-module (เช่น Store Requisition)
**Expected**
นำทางไป route ของ sub-module นั้น (เช่น `/store-operation/store-requisition`) ไม่เป็น 404

---
## TC-LAND-400002 — store-operation: การ์ด sub-module ที่ไม่มีสิทธิ์จางและไม่ออกนอกหน้า
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ไม่มีสิทธิ์บาง sub-module ของ store operation
**Steps**
1. ไปที่ `/store-operation`
2. คลิกการ์ด sub-module ที่ถูก deny (แสดงจาง opacity-50)
**Expected**
การ์ดที่ไม่มีสิทธิ์แสดงจาง (opacity-50); คลิกแล้ว **ไม่** นำทางออกจากหน้า แต่ trigger การแจ้ง permission-denied แทน

---
## TC-LAND-900001 — dashboard แสดงสถานะ loading (aria-busy) ระหว่างโหลด widget
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ section landing แบบ widget grid; widget ยังโหลดไม่เสร็จ
**Steps**
1. ไปที่ `/config` (หรือ landing แบบ widget อื่น)
2. สังเกตช่วงที่ widget กำลังโหลด
**Expected**
พื้นที่ widget มี `aria-busy=true` และแสดง skeleton/placeholder ระหว่างโหลด

---
## TC-LAND-900002 — dashboard แสดงข้อความ empty เมื่อไม่มี widget
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
section landing ที่ไม่มี widget configured (รายการ widgets ว่าง)
**Steps**
1. ไปที่ section landing นั้น
2. รอโหลดเสร็จ
**Expected**
แสดงข้อความ empty (ไม่มี widget) แทนที่จะเป็นพื้นที่ว่างหรือ error

---
## TC-LAND-900003 — dashboard แสดงข้อความ error เมื่อโหลด widget ล้มเหลว
**Priority:** Low · **Test Type:** Negative
**Preconditions**
backend ของ widget dataset คืน error
**Steps**
1. ไปที่ section landing แบบ widget grid
**Expected**
แสดงข้อความ loadError พร้อมรายละเอียดข้อผิดพลาด แทนที่จะ crash

---
## TC-LAND-900004 — เปิด URL ที่ไม่มีอยู่แสดงหน้า 404 พร้อมปุ่ม Back to Dashboard
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ล็อกอินแล้ว
**Steps**
1. เปิด URL ที่ไม่ตรงกับ route ใด ๆ เช่น `/this-route-does-not-exist`
**Expected**
แสดงหน้า Not-Found: เลข "404", eyebrow, title, description และปุ่ม "Back to Dashboard"

---
## TC-LAND-900005 — คลิก Back to Dashboard บนหน้า 404 กลับไป /dashboard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า 404 Not-Found
**Steps**
1. คลิกปุ่ม "Back to Dashboard"
**Expected**
นำทางไป `/dashboard` และหน้า dashboard แสดง
