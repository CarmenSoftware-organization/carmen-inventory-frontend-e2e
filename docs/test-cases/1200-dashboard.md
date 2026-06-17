# Dashboard — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/dashboard`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Dashboard
**Frontend route:** `routes/dashboard`  •  **URL:** `/dashboard`
**Prefix:** `DASH`
**Default role:** Any authenticated user
**Total test cases:** 16

> หน้า Dashboard แสดงคำทักทายตามช่วงเวลา (เช้า/บ่าย/เย็น) พร้อมชื่อผู้ใช้จาก profile และวันที่ปัจจุบัน. ส่วนหลักคือ Saved Widgets ที่ผู้ใช้ปักหมุดเอง: เพิ่ม widget จาก dataset lookup (`+ เพิ่ม`), ลากจัดเรียง (drag-to-reorder, persist `order_index` ผ่าน PATCH), ลบ widget (DeleteDialog ยืนยัน). แต่ละ widget render เป็น KpiCard / PieCard / BarCard ตาม `shape` ของ dataset (scalar/scalar_delta → kpi, categorical → pie); shape ที่ไม่รองรับขึ้น UnsupportedCard. มี badge นับจำนวน widget, สถานะ loading (skeleton), error และ empty state พร้อม hint.

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DASH-010001 | หน้า Dashboard โหลดสำเร็จและแสดงคำทักทาย | High | Smoke |
| TC-DASH-010002 | คำทักทายแสดงชื่อผู้ใช้จาก profile | Medium | Functional |
| TC-DASH-010003 | คำทักทายเปลี่ยนตามช่วงเวลา (เช้า/บ่าย/เย็น) | Low | Functional |
| TC-DASH-010004 | วันที่ปัจจุบันแสดงใน eyebrow | Low | Functional |
| TC-DASH-010005 | รายการ Saved Widgets โหลดและแสดง widget ที่บันทึกไว้ | High | Smoke |
| TC-DASH-010006 | badge นับจำนวน widget แสดงค่าถูกต้อง | Low | Functional |
| TC-DASH-010007 | widget เรียงตาม order_index จากน้อยไปมาก | Medium | Functional |
| TC-DASH-020001 | widget shape scalar render เป็น KpiCard | Medium | Functional |
| TC-DASH-020002 | widget shape categorical render เป็น PieCard | Medium | Functional |
| TC-DASH-020003 | shape ที่ไม่รองรับแสดง UnsupportedCard | Low | Edge Case |
| TC-DASH-030001 | เพิ่ม widget ใหม่จาก dataset lookup | High | CRUD |
| TC-DASH-040001 | ลากจัดเรียง widget แล้วบันทึกลำดับใหม่ | Medium | Functional |
| TC-DASH-050001 | ลบ widget ผ่าน DeleteDialog | High | CRUD |
| TC-DASH-090001 | empty state เมื่อยังไม่มี widget ที่บันทึกไว้ | Medium | Edge Case |
| TC-DASH-090002 | สถานะ error เมื่อโหลดรายการ widget ล้มเหลว | Medium | Negative |
| TC-DASH-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-DASH-010001 — หน้า Dashboard โหลดสำเร็จและแสดงคำทักทาย
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่ระบบรับรองแล้ว
**Steps**
1. ไปที่ `/dashboard`
2. รอหน้าโหลดเสร็จ
**Expected**
URL ตรงกับ `/dashboard`, แสดงหัวข้อคำทักทาย (heading) และส่วน Saved Widgets

---
## TC-DASH-010002 — คำทักทายแสดงชื่อผู้ใช้จาก profile
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`; profile ของผู้ใช้มี firstname/lastname
**Steps**
1. ดูข้อความ heading คำทักทาย
**Expected**
heading แสดงชื่อ-นามสกุลของผู้ใช้ต่อท้ายคำทักทาย (ถ้าไม่มีชื่อ ใช้ fallback name)

---
## TC-DASH-010003 — คำทักทายเปลี่ยนตามช่วงเวลา (เช้า/บ่าย/เย็น)
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`
**Steps**
1. สังเกตคำทักทายเทียบกับเวลาปัจจุบันของเครื่อง (ก่อน 12:00 / 12:00–17:59 / ตั้งแต่ 18:00)
**Expected**
ก่อนเที่ยงแสดงคำทักทายตอนเช้า, บ่ายแสดงตอนบ่าย, ตั้งแต่ 18:00 แสดงตอนเย็น

---
## TC-DASH-010004 — วันที่ปัจจุบันแสดงใน eyebrow
**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/dashboard`
**Steps**
1. ดูแถบ eyebrow เหนือ heading
**Expected**
eyebrow แสดงคำว่า brief ตามด้วยวันที่ปัจจุบันที่ฟอร์แมตตาม locale ปัจจุบัน

---
## TC-DASH-010005 — รายการ Saved Widgets โหลดและแสดง widget ที่บันทึกไว้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ผู้ใช้มี widget ที่บันทึกไว้อย่างน้อย 1 รายการ; อยู่ที่ `/dashboard`
**Steps**
1. รอ skeleton หาย
2. ดูกริด Saved Widgets
**Expected**
แสดง widget card ตามจำนวนที่บันทึกไว้ในรูปแบบกริด (responsive 1/2/4 คอลัมน์)

---
## TC-DASH-010006 — badge นับจำนวน widget แสดงค่าถูกต้อง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี widget ที่บันทึกไว้; อยู่ที่ `/dashboard`
**Steps**
1. ดูตัวเลขข้างหัวข้อ section Saved Widgets
**Expected**
ตัวเลขแสดงค่า `count` ตรงกับจำนวน widget ที่โหลดมา

---
## TC-DASH-010007 — widget เรียงตาม order_index จากน้อยไปมาก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่บันทึกไว้หลายรายการพร้อม order_index ต่างกัน; อยู่ที่ `/dashboard`
**Steps**
1. ดูลำดับ widget ในกริด
**Expected**
widget เรียงตาม `order_index` จากน้อยไปมาก

---
## TC-DASH-020001 — widget shape scalar render เป็น KpiCard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่ dataset มี shape `scalar` หรือ `scalar_delta`; อยู่ที่ `/dashboard`
**Steps**
1. รอ widget โหลด detail เสร็จ
2. ดู card ของ widget
**Expected**
widget render เป็น KpiCard แสดงค่าตัวเลขหลัก พร้อม title ของ widget

---
## TC-DASH-020002 — widget shape categorical render เป็น PieCard
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่ dataset มี shape `categorical`; อยู่ที่ `/dashboard`
**Steps**
1. รอ widget โหลด detail เสร็จ
2. ดู card ของ widget
**Expected**
widget render เป็น PieCard แสดงกราฟวงกลมตามหมวดหมู่ข้อมูล

---
## TC-DASH-020003 — shape ที่ไม่รองรับแสดง UnsupportedCard
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มี widget ที่ dataset มี shape นอกเหนือจาก scalar/scalar_delta/categorical; อยู่ที่ `/dashboard`
**Steps**
1. รอ widget โหลด detail เสร็จ
2. ดู card ของ widget
**Expected**
แสดง UnsupportedCard พร้อมไอคอนเตือนและข้อความระบุ shape ที่ไม่รองรับ

---
## TC-DASH-030001 — เพิ่ม widget ใหม่จาก dataset lookup
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/dashboard`; มี dataset (shape ที่รองรับ) ที่ยังไม่ถูกเพิ่ม
**Steps**
1. กดปุ่ม `+ เพิ่ม` (LookupDataset)
2. เลือก dataset จากรายการ
**Expected**
แสดง toast เพิ่มสำเร็จ, widget ใหม่ปรากฏในกริด และ dataset ที่เพิ่มแล้วถูกตัดจากตัวเลือก lookup

---
## TC-DASH-040001 — ลากจัดเรียง widget แล้วบันทึกลำดับใหม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี widget ที่บันทึกไว้อย่างน้อย 2 รายการ; อยู่ที่ `/dashboard`
**Steps**
1. ลาก handle (GripVertical) ของ widget ไปวางในตำแหน่งใหม่
2. ปล่อยเมาส์
**Expected**
ลำดับ widget เปลี่ยนทันที (optimistic) และระบบ PATCH `order_index` ของ widget ที่ลำดับเปลี่ยน; รีเฟรชแล้วลำดับยังคงเดิม

---
## TC-DASH-050001 — ลบ widget ผ่าน DeleteDialog
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี widget ที่บันทึกไว้อย่างน้อย 1 รายการ; อยู่ที่ `/dashboard`
**Steps**
1. hover ที่ widget แล้วกดปุ่มถังขยะ (Trash2)
2. ยืนยันใน DeleteDialog
**Expected**
แสดง toast ลบสำเร็จ และ widget หายจากกริด

---
## TC-DASH-090001 — empty state เมื่อยังไม่มี widget ที่บันทึกไว้
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ผู้ใช้ยังไม่มี widget ที่บันทึกไว้เลย; อยู่ที่ `/dashboard`
**Steps**
1. รอ loading หาย
2. ดูส่วน Saved Widgets
**Expected**
แสดง empty state พร้อมหัวข้อ คำอธิบาย และ hint (KPI / Pie / Bar)

---
## TC-DASH-090002 — สถานะ error เมื่อโหลดรายการ widget ล้มเหลว
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
API รายการ widget คืน error; อยู่ที่ `/dashboard`
**Steps**
1. ไปที่ `/dashboard`
2. รอการโหลดล้มเหลว
**Expected**
แสดงข้อความ error (role="alert") พร้อมข้อความ loadError และไม่ crash หน้า

---
## TC-DASH-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/dashboard` ตรงๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และฟอร์ม login แสดง
