# External Price List (Vendor Portal) — User Stories

_Authored from the test-case catalog `docs/test-cases/1002-external-price-list.md` (documentation only — no automated spec yet)._

**Module:** External Price List — public vendor submission portal
**Frontend route:** `routes/external/pl`  •  **URL:** `/external/pl/:url_token` (public — ไม่ต้อง login)
**Prefix:** `EPL`
**Default role:** ไม่มี (เปิดผ่าน url token ที่ส่งให้ vendor ภายนอก ไม่ต้อง auth)
**Total test cases:** 22

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-EPL-010001 | เปิดลิงก์ด้วย url token ที่ถูกต้องโหลดหน้า price list | High | Smoke |
| TC-EPL-010002 | Header แสดงเลขที่/ชื่อ/สถานะ/vendor/สกุลเงิน/ช่วงวันที่ | Medium | Functional |
| TC-EPL-010003 | Header แสดง Description/Note เมื่อมีข้อมูล | Low | Functional |
| TC-EPL-010004 | โหมดเริ่มต้นเป็น View Mode แสดงตารางแบบ group ตาม product | High | Functional |
| TC-EPL-010005 | View Mode รวมหลาย MOQ/ราคาของสินค้าเดียวเป็นแถวเดียว | Medium | Functional |
| TC-EPL-010006 | ตาราง View Mode รองรับ pagination และ sorting | Low | Functional |
| TC-EPL-040001 | สลับเป็น Edit Mode แสดงตารางแก้ไขรายสินค้า | High | Functional |
| TC-EPL-040002 | แก้ไขค่า Price/MOQ/Lead Time/PWT/Tax ในแถว | High | CRUD |
| TC-EPL-040003 | เมื่อมีการแก้ไขแสดง badge "Unsaved changes" และเปิดปุ่ม Save | Medium | Functional |
| TC-EPL-040004 | กด Save บันทึกสำเร็จแสดง toast และล้างสถานะ dirty | High | CRUD |
| TC-EPL-040005 | Save ล้มเหลวแสดง toast error | Medium | Negative |
| TC-EPL-040006 | ขยายแถว (expand) ดู/แก้ไข MOQ tiers | Medium | Functional |
| TC-EPL-100001 | เปิดด้วย token หมดอายุ/ไม่ถูกต้อง (401) แสดง "This link has expired" | High | Security |
| TC-EPL-100002 | เกิด error อื่นแสดง ErrorState พร้อมปุ่ม Retry | Medium | Negative |
| TC-EPL-100003 | เข้าถึงได้โดยไม่ต้อง login (public) ไม่ redirect ไป /login | High | Auth-guard |
| TC-EPL-200001 | กด Save โดยไม่มีการแก้ไขแสดง toast "No changes to save" | Medium | Validation |
| TC-EPL-200002 | กด Submit ขณะยังมีการแก้ไขค้างแสดง toast เตือนให้ Save ก่อน | Medium | Validation |
| TC-EPL-200003 | ปุ่ม Save disable เมื่อไม่มีการแก้ไข; Submit disable เมื่อยัง dirty | Low | Validation |
| TC-EPL-300001 | กด Submit ส่ง price list สำเร็จแสดง toast | High | Functional |
| TC-EPL-300002 | Submit ล้มเหลวแสดง toast error | Medium | Negative |
| TC-EPL-900001 | price list ที่ไม่มีรายการสินค้าแสดงตารางว่าง | Low | Edge Case |
| TC-EPL-900002 | เปิดหน้าโดยไม่มี url_token ไม่ crash (แสดงผลว่าง) | Low | Edge Case |

---
## TC-EPL-010001 — เปิดลิงก์ด้วย url token ที่ถูกต้องโหลดหน้า price list
> **As an** external vendor, **I want** my tokenized link to open the price list page directly, **so that** I can start responding to the pricing request without creating an account.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
มี price list external ที่ใช้งานได้พร้อม url token ที่ยังไม่หมดอายุ
**Steps**
1. เปิด `/external/pl/<url_token>` ใน browser context ที่ไม่มี session
2. รอข้อความ Loading หาย
**Expected**
หน้าโหลดสำเร็จ แสดง Header ของ price list และตารางสินค้า (ไม่เป็น 404, ไม่ redirect ไป /login)

---
## TC-EPL-010002 — Header แสดงเลขที่/ชื่อ/สถานะ/vendor/สกุลเงิน/ช่วงวันที่
> **As an** external vendor, **I want** the header to show the price-list number, name, status, my vendor name, currency and effective dates, **so that** I can confirm I am quoting against the right request.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดหน้า price list external ด้วย token ที่ถูกต้องแล้ว
**Steps**
1. ดูส่วน Header ด้านบนของหน้า
**Expected**
แสดง `pricelist_no` เป็นหัวข้อ, ชื่อ price list, status badge (ตัวพิมพ์ใหญ่), Vendor Name, Currency และช่วงวันที่ effective from – to

---
## TC-EPL-010003 — Header แสดง Description/Note เมื่อมีข้อมูล
> **As an** external vendor, **I want** any description and note shown in the header, **so that** I understand the buyer's instructions before pricing.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
price list ที่เปิดมีค่า description และ/หรือ note
**Steps**
1. ดูส่วน Header
**Expected**
แสดงบรรทัด Description และ Note (เต็มความกว้าง) เฉพาะเมื่อมีค่า; ถ้าไม่มีจะไม่แสดงบรรทัดนั้น

---
## TC-EPL-010004 — โหมดเริ่มต้นเป็น View Mode แสดงตารางแบบ group ตาม product
> **As an** external vendor, **I want** the page to open in a read-only product view by default, **so that** I can review the requested items before editing anything.

**Priority:** High · **Test Type:** Functional
**Preconditions**
price list มีรายการสินค้าอย่างน้อย 1 รายการ
**Steps**
1. เปิดหน้า price list external
2. ดูตารางและปุ่มสลับโหมด
**Expected**
ตารางแสดงแบบ View Mode (group ตาม product) คอลัมน์ #, Product, MOQ, PWT, Tax, Tax Profile และปุ่มสลับโหมดแสดงข้อความ "Edit Mode"

---
## TC-EPL-010005 — View Mode รวมหลาย MOQ/ราคาของสินค้าเดียวเป็นแถวเดียว
> **As an** external vendor, **I want** all the MOQ tiers and prices of one product collapsed into a single row, **so that** I can read each item's pricing at a glance.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีสินค้าที่มีหลาย MOQ tier / หลายหน่วยในรายการเดียวกัน
**Steps**
1. อยู่ที่ View Mode
2. ดูแถวของสินค้าที่มีหลาย tier
**Expected**
สินค้านั้นแสดงเป็นแถวเดียว โดยคอลัมน์ MOQ รวมหลายบรรทัดในรูป `moq+ unit→price (Nd)` ตามจำนวน tier

---
## TC-EPL-010006 — ตาราง View Mode รองรับ pagination และ sorting
> **As an** external vendor, **I want** to page through and sort a long product list, **so that** I can navigate a large request efficiently.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
price list มีสินค้ามากกว่า 10 รายการ (เกิน page size)
**Steps**
1. อยู่ที่ View Mode
2. ใช้ pagination control เลื่อนหน้า
3. คลิกหัวคอลัมน์ Product เพื่อ sort
**Expected**
ตารางแบ่งหน้า (page size 10) เลื่อนหน้าได้ และจัดเรียงตามคอลัมน์ที่คลิกได้

---
## TC-EPL-040001 — สลับเป็น Edit Mode แสดงตารางแก้ไขรายสินค้า
> **As an** external vendor, **I want** to switch into an editable per-item table, **so that** I can enter my quoted prices line by line.

**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดหน้า price list external (View Mode) แล้ว
**Steps**
1. กดปุ่ม "Edit Mode"
**Expected**
ตารางเปลี่ยนเป็นแบบราย detail แก้ไขได้ คอลัมน์ #, Product, Unit, MOQ, Price, Lead Time, PWT, Tax, Tax Profile, ปุ่ม expand และมีปุ่ม Save/Submit ท้ายตาราง; ปุ่มสลับโหมดเปลี่ยนเป็น "View Mode"

---
## TC-EPL-040002 — แก้ไขค่า Price/MOQ/Lead Time/PWT/Tax ในแถว
> **As an** external vendor, **I want** to edit price, MOQ, lead time, PWT and tax in each row, **so that** I can record my full offer for every item.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ Edit Mode มีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. แก้ไขค่าในช่อง Price ของแถวแรก
2. แก้ไข MOQ, Lead Time, PWT, Tax
**Expected**
ค่าที่แก้ไขแสดงในช่อง input ทันที และสถานะฟอร์มเปลี่ยนเป็น dirty (มี badge "Unsaved changes")

---
## TC-EPL-040003 — เมื่อมีการแก้ไขแสดง badge "Unsaved changes" และเปิดปุ่ม Save
> **As an** external vendor, **I want** a clear "Unsaved changes" indicator when I edit, **so that** I know my changes still need saving.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ Edit Mode
**Steps**
1. แก้ไขค่าในแถวใด ๆ
**Expected**
แสดง badge "Unsaved changes" (variant warning) และปุ่ม Save เปลี่ยนเป็นใช้งานได้

---
## TC-EPL-040004 — กด Save บันทึกสำเร็จแสดง toast และล้างสถานะ dirty
> **As an** external vendor, **I want** Save to persist my edits and confirm success, **so that** my draft pricing is kept safely before I submit.

**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ Edit Mode มีการแก้ไขค้าง, backend ตอบสำเร็จ
**Steps**
1. แก้ไขค่าในแถวหนึ่ง
2. กดปุ่ม Save
**Expected**
แสดง toast success "Changes saved successfully", badge "Unsaved changes" หายไป, ปุ่ม Save กลับเป็น disable และ Submit ใช้งานได้

---
## TC-EPL-040005 — Save ล้มเหลวแสดง toast error
> **As an** external vendor, **I want** a clear error if Save fails, **so that** I know my pricing was not stored and can try again.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ Edit Mode มีการแก้ไขค้าง, backend คืน error ตอน save
**Steps**
1. แก้ไขค่าแล้วกดปุ่ม Save
**Expected**
แสดง toast error "Failed to save changes" และสถานะ dirty ยังคงอยู่ (ปุ่ม Save ยังใช้งานได้)

---
## TC-EPL-040006 — ขยายแถว (expand) ดู/แก้ไข MOQ tiers
> **As an** external vendor, **I want** to expand a row and edit its MOQ tiers, **so that** I can quote volume-based pricing precisely.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ Edit Mode มีสินค้าที่มี MOQ tiers
**Steps**
1. คลิกปุ่ม expand (ไอคอน +) ท้ายแถว
**Expected**
แถวขยายแสดง MOQ tiers sub-table; แก้ไข tier ได้และการแก้ไขทำให้ฟอร์มเป็น dirty

---
## TC-EPL-100001 — เปิดด้วย token หมดอายุ/ไม่ถูกต้อง (401) แสดง "This link has expired"
> **As an** external vendor, **I want** an expired or invalid link to be rejected with a clear message, **so that** an expired link does not leak pricing data.

**Priority:** High · **Test Type:** Security
**Preconditions**
มี url token ที่หมดอายุหรือไม่ถูกต้อง (backend คืน HTTP 401)
**Steps**
1. เปิด `/external/pl/<expired_token>`
**Expected**
แสดงไอคอนแจ้งเตือนและข้อความ "This link has expired" (หรือข้อความจาก backend) ไม่แสดงข้อมูล price list

---
## TC-EPL-100002 — เกิด error อื่นแสดง ErrorState พร้อมปุ่ม Retry
> **As an** external vendor, **I want** a retryable error state when the page fails to load, **so that** a transient backend problem does not block my submission.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
backend คืน error ที่ไม่ใช่ 401 (เช่น 500 หรือ network error)
**Steps**
1. เปิดหน้า price list external
2. กดปุ่ม Retry
**Expected**
แสดง ErrorState พร้อมข้อความ error และปุ่ม Retry; กด Retry แล้วระบบ refetch ข้อมูลใหม่

---
## TC-EPL-100003 — เข้าถึงได้โดยไม่ต้อง login (public) ไม่ redirect ไป /login
> **As an** external vendor, **I want** the page to stay public and never force me to log in, **so that** I can respond using only the link I was sent.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
browser context สะอาด ไม่มี session; มี url token ที่ถูกต้อง
**Steps**
1. เปิด `/external/pl/<url_token>` โดยไม่ login
**Expected**
หน้าแสดง price list ตามปกติ และ **ไม่** ถูก redirect ไป `/login` (เป็นหน้า public)

---
## TC-EPL-200001 — กด Save โดยไม่มีการแก้ไขแสดง toast "No changes to save"
> **As an** external vendor, **I want** the system to tell me when there is nothing to save, **so that** I don't waste a save request on an unchanged form.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ Edit Mode และยังไม่ได้แก้ไขค่าใด ๆ
**Steps**
1. สลับเป็น Edit Mode
2. กดปุ่ม Save ทันที (หากกดได้)
**Expected**
ระบบไม่เรียก backend และแสดง toast error "No changes to save" (ในทางปฏิบัติปุ่ม Save ถูก disable เมื่อไม่มีการแก้ไข — ดู TC-EPL-200003)

---
## TC-EPL-200002 — กด Submit ขณะยังมีการแก้ไขค้างแสดง toast เตือนให้ Save ก่อน
> **As an** external vendor, **I want** to be warned to save before submitting, **so that** I don't submit an offer that is missing my latest edits.

**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ Edit Mode และมีการแก้ไขที่ยังไม่ได้ Save (dirty)
**Steps**
1. แก้ไขค่าในแถวใด ๆ
2. กดปุ่ม Submit
**Expected**
ระบบไม่ส่ง price list และแสดง toast error "Please save all changes before submitting" (ปุ่ม Submit ถูก disable เมื่อ dirty — ดู TC-EPL-200003)

---
## TC-EPL-200003 — ปุ่ม Save disable เมื่อไม่มีการแก้ไข; Submit disable เมื่อยัง dirty
> **As an** external vendor, **I want** the Save and Submit buttons to enable only when appropriate, **so that** the interface guides me toward a complete, saved offer.

**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ Edit Mode
**Steps**
1. ดูสถานะปุ่มเมื่อยังไม่แก้ไข
2. แก้ไขค่าในแถวหนึ่ง แล้วดูสถานะปุ่มอีกครั้ง
**Expected**
ก่อนแก้ไข: Save ถูก disable, Submit ใช้งานได้; หลังแก้ไข: Save ใช้งานได้ + แสดง badge "Unsaved changes", Submit ถูก disable

---
## TC-EPL-300001 — กด Submit ส่ง price list สำเร็จแสดง toast
> **As an** external vendor, **I want** Submit to send my finished price list and confirm success, **so that** the buyer receives my offer.

**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ Edit Mode, ไม่มีการแก้ไขค้าง (ได้ Save แล้วหรือยังไม่ได้แก้), backend ตอบสำเร็จ
**Steps**
1. ตรวจสอบว่าไม่มี badge "Unsaved changes"
2. กดปุ่ม Submit
**Expected**
ระบบเรียก submit สำเร็จและแสดง toast success "Price list submitted successfully"

---
## TC-EPL-300002 — Submit ล้มเหลวแสดง toast error
> **As an** external vendor, **I want** a clear error if Submit fails, **so that** I know my offer was not delivered and can resend it.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
อยู่ที่ Edit Mode, ไม่มีการแก้ไขค้าง, backend คืน error ตอน submit
**Steps**
1. กดปุ่ม Submit
**Expected**
แสดง toast error "Failed to submit price list" และหน้าไม่ crash

---
## TC-EPL-900001 — price list ที่ไม่มีรายการสินค้าแสดงตารางว่าง
> **As an** external vendor, **I want** a price list with no items to render an empty table cleanly, **so that** the page stays usable even when there is nothing to quote.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
price list ที่เปิดไม่มี `tb_pricelist_detail`
**Steps**
1. เปิดหน้า price list external
**Expected**
Header แสดงตามปกติ และตารางแสดง record count = 0 (ตารางว่าง) โดยไม่ crash

---
## TC-EPL-900002 — เปิดหน้าโดยไม่มี url_token ไม่ crash (แสดงผลว่าง)
> **As an** external vendor, **I want** the page to fail gracefully when the link has no token, **so that** a malformed link does not produce a broken or error page.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ไม่มี
**Steps**
1. เปิด route `/external/pl/` โดยไม่มีค่า `:url_token`
**Expected**
หน้าไม่ render เนื้อหา (คืน null) และไม่เกิด error ระดับ runtime
