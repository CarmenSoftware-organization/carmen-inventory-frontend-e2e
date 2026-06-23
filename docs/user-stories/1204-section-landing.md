# Section Landing Pages & 404 — User Stories

_Authored from the test-case catalog `docs/test-cases/1204-section-landing.md` (documentation only — no automated spec yet)._

**Module:** Section landing / navigation shell pages + Not-Found (404)
**Frontend route:** `routes/{config,inventory-management,operation-plan,procurement,product-management,vendor-management,store-operation,system-admin}/page.tsx`, `routes/not-found`
**Prefix:** `LAND`
**Default role:** Any authenticated user (404 page เข้าได้ทุกสถานะ)
**Total test cases:** 16

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
> **As an** authenticated user, **I want** the `/config` landing to load with its title, description, and stat tiles, **so that** I can see an overview of the configuration module and pick where to go.

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
> **As an** authenticated user, **I want** the `/vendor-management` landing to show its widget grid, **so that** I can review vendor-management stats and reach its sub-areas.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง vendor management
**Steps**
1. ไปที่ `/vendor-management`
**Expected**
แสดง dashboard widget grid ของ vendor management (title/description + stat tiles เช่น vendor, price list, request-for-pricing) ไม่เป็น 404

---
## TC-LAND-010003 — /procurement landing แสดง widget grid
> **As an** authenticated user, **I want** the `/procurement` landing to show its widget grid, **so that** I can survey procurement stats and navigate into the module.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง procurement
**Steps**
1. ไปที่ `/procurement`
**Expected**
แสดง dashboard widget grid ของ procurement (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010004 — /inventory-management landing แสดง widget grid
> **As an** authenticated user, **I want** the `/inventory-management` landing to show its widget grid, **so that** I can see inventory-management stats and navigate into the module.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง inventory management
**Steps**
1. ไปที่ `/inventory-management`
**Expected**
แสดง dashboard widget grid ของ inventory management (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010005 — /operation-plan landing แสดง widget grid
> **As an** authenticated user, **I want** the `/operation-plan` landing to show its widget grid, **so that** I can review operation-plan stats and navigate into the module.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง operation plan
**Steps**
1. ไปที่ `/operation-plan`
**Expected**
แสดง dashboard widget grid ของ operation plan (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010006 — /product-management landing แสดง widget grid
> **As an** authenticated user, **I want** the `/product-management` landing to show its widget grid, **so that** I can review product-management stats and navigate into the module.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง product management
**Steps**
1. ไปที่ `/product-management`
**Expected**
แสดง dashboard widget grid ของ product management (title/description + stat tiles) ไม่เป็น 404

---
## TC-LAND-010007 — /store-operation landing แสดงการ์ด sub-module + badge นับจำนวน
> **As an** authenticated user, **I want** the `/store-operation` landing to list its sub-module cards with a count badge, **so that** I can see which store-operation areas I can open.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้วและมีสิทธิ์เข้าถึง store operation อย่างน้อย 1 sub-module
**Steps**
1. ไปที่ `/store-operation`
**Expected**
แสดงคำอธิบายโมดูล, badge นับจำนวน sub-module และการ์ด sub-module (เช่น Store Requisition, Wastage Reporting, Stock Replenishment) เป็นลิงก์

---
## TC-LAND-010008 — /system-admin landing แสดง chapters/เมนูของระบบ
> **As an** authenticated user, **I want** the `/system-admin` landing to present its editorial chapters and menu, **so that** I can navigate to the system administration tools I need.

**Priority:** Medium · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มีสิทธิ์ system admin
**Steps**
1. ไปที่ `/system-admin`
**Expected**
แสดงหน้า landing แบบ editorial (chapters) พร้อม CTA ไปยังเมนูย่อยของ system admin (role, user, workflow, ฯลฯ) ไม่เป็น 404

---
## TC-LAND-100001 — เข้า landing โดยไม่ login ถูก redirect ไป /login
> **As an** unauthenticated visitor, **I want** to be redirected to login when I open a section landing directly, **so that** the module pages stay protected behind authentication.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/vendor-management` (หรือ section landing อื่น) ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง

---
## TC-LAND-400001 — store-operation: คลิกการ์ด sub-module นำไป route ที่ถูกต้อง
> **As an** authenticated user, **I want** clicking a store-operation sub-module card to navigate to that sub-module's route, **so that** I can open the area I selected.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/store-operation` และมีสิทธิ์เข้าถึง sub-module อย่างน้อย 1 รายการ
**Steps**
1. คลิกการ์ด sub-module (เช่น Store Requisition)
**Expected**
นำทางไป route ของ sub-module นั้น (เช่น `/store-operation/store-requisition`) ไม่เป็น 404

---
## TC-LAND-400002 — store-operation: การ์ด sub-module ที่ไม่มีสิทธิ์จางและไม่ออกนอกหน้า
> **As a** user who lacks permission for a store-operation sub-module, **I want** its card to appear dimmed and stay on the page when clicked, **so that** I get a clear permission-denied signal instead of navigating somewhere I cannot access.

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
> **As an** authenticated user, **I want** the widget grid to show a busy/loading state while data loads, **so that** I know the page is working rather than broken.

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
> **As an** authenticated user, **I want** a clear empty message when a landing has no widgets, **so that** I understand there is nothing to show rather than seeing a blank or broken page.

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
> **As an** authenticated user, **I want** a clear error message when the widget dataset fails to load, **so that** I know loading failed instead of the page crashing.

**Priority:** Low · **Test Type:** Negative
**Preconditions**
backend ของ widget dataset คืน error
**Steps**
1. ไปที่ section landing แบบ widget grid
**Expected**
แสดงข้อความ loadError พร้อมรายละเอียดข้อผิดพลาด แทนที่จะ crash

---
## TC-LAND-900004 — เปิด URL ที่ไม่มีอยู่แสดงหน้า 404 พร้อมปุ่ม Back to Dashboard
> **As an** authenticated user, **I want** an unknown URL to show a proper 404 page with a way back, **so that** a mistyped or stale link doesn't leave me stranded.

**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ล็อกอินแล้ว
**Steps**
1. เปิด URL ที่ไม่ตรงกับ route ใด ๆ เช่น `/this-route-does-not-exist`
**Expected**
แสดงหน้า Not-Found: เลข "404", eyebrow, title, description และปุ่ม "Back to Dashboard"

---
## TC-LAND-900005 — คลิก Back to Dashboard บนหน้า 404 กลับไป /dashboard
> **As an** authenticated user, **I want** the "Back to Dashboard" button on the 404 page to return me to the dashboard, **so that** I can recover from an unknown URL in one click.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้า 404 Not-Found
**Steps**
1. คลิกปุ่ม "Back to Dashboard"
**Expected**
นำทางไป `/dashboard` และหน้า dashboard แสดง
