# Dashboard Dataset — User Stories

_Authored from the test-case catalog `docs/test-cases/1112-dashboard-dataset.md` (documentation only — no automated spec yet)._

**Module:** Dashboard Dataset
**Frontend route:** `routes/system-admin/dashboard-dataset`  •  **URL:** `/system-admin/dashboard-dataset`
**Prefix:** `DDS`
**Default role:** Platform Admin
**Total test cases:** 13

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-DDS-010001 | หน้า Dashboard Dataset โหลดสำเร็จ | High | Smoke |
| TC-DDS-010002 | badge นับ total แสดงจำนวน dataset | Medium | Functional |
| TC-DDS-010003 | dataset ถูก group ตาม category | High | Functional |
| TC-DDS-010004 | แต่ละ section แสดงจำนวน dataset ใน category | Low | Functional |
| TC-DDS-020001 | DatasetCard แสดง name / shape / description / id / unit | Medium | Functional |
| TC-DDS-010005 | ค้นหาตาม name กรองรายการได้ | High | Functional |
| TC-DDS-010006 | ค้นหาตาม id / category / description ก็กรองได้ | Medium | Functional |
| TC-DDS-010007 | ค้นหาคำที่ไม่มีต้องแสดง filtered empty state | Medium | Functional |
| TC-DDS-010008 | ล้างคำค้นแล้วรายการกลับมาแสดงครบ | Low | Functional |
| TC-DDS-090001 | สถานะ loading แสดงระหว่างโหลด | Low | Functional |
| TC-DDS-090002 | สถานะ error แสดงข้อความเมื่อโหลดล้มเหลว | Medium | Negative |
| TC-DDS-090003 | empty state เมื่อไม่มี dataset เลย | Low | Edge Case |
| TC-DDS-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |

---
## TC-DDS-010001 — หน้า Dashboard Dataset โหลดสำเร็จ
> **As a** Platform Admin, **I want** the Dashboard Dataset catalog to load, **so that** I can review available datasets.

**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin และมีสิทธิ์เข้าถึง System Admin > Dashboard Dataset
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. รอ loading หาย
**Expected**
URL ตรงกับ `/system-admin/dashboard-dataset`, หัวข้อ Dashboard Dataset แสดง, ช่องค้นหาและรายการ dataset (หรือ empty state) ปรากฏ

---
## TC-DDS-010002 — badge นับ total แสดงจำนวน dataset
> **As a** Platform Admin, **I want** a total count badge, **so that** I know how many datasets exist.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี dataset อย่างน้อย 1 รายการ; อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. ดู badge ข้างหัวข้อ
**Expected**
badge แสดงค่า `count` (total) ของ dataset ที่โหลดมา

---
## TC-DDS-010003 — dataset ถูก group ตาม category
> **As a** Platform Admin, **I want** datasets grouped by category, **so that** I can browse them by domain.

**Priority:** High · **Test Type:** Functional
**Preconditions**
มี dataset หลาย category; อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. ดูโครงสร้างรายการ
**Expected**
dataset ถูกแบ่งเป็น section ตาม category (เรียง category ตามตัวอักษร) แต่ละ section มีหัวข้อ category แบบ uppercase

---
## TC-DDS-010004 — แต่ละ section แสดงจำนวน dataset ใน category
> **As a** Platform Admin, **I want** a per-category count, **so that** I can see how many datasets each category holds.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี dataset หลายรายการในแต่ละ category
**Steps**
1. ดูหัว section ของแต่ละ category
**Expected**
ข้างชื่อ category แสดง "· N" ที่ N เท่ากับจำนวน dataset ใน category นั้น

---
## TC-DDS-020001 — DatasetCard แสดง name / shape / description / id / unit
> **As a** Platform Admin, **I want** each dataset card to show its full metadata, **so that** I can understand what the dataset returns.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี dataset อย่างน้อย 1 รายการ
**Steps**
1. ดู card ของ dataset หนึ่งรายการ
**Expected**
card แสดง name (หัว), badge `shape` (มุมขวา), description, และแถวล่างแสดง id · unit

---
## TC-DDS-010005 — ค้นหาตาม name กรองรายการได้
> **As a** Platform Admin, **I want** to search datasets by name, **so that** I can find a dataset quickly.

**Priority:** High · **Test Type:** Functional
**Preconditions**
มี dataset หลายรายการ; อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. พิมพ์บางส่วนของชื่อ dataset ในช่องค้นหา
**Expected**
รายการถูกกรองเหลือเฉพาะ dataset ที่ name ตรงกับคำค้น (case-insensitive) และ group ใหม่ตาม category

---
## TC-DDS-010006 — ค้นหาตาม id / category / description ก็กรองได้
> **As a** Platform Admin, **I want** search to match id, category and description too, **so that** I can find datasets by any attribute.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`
**Steps**
1. พิมพ์คำที่ปรากฏใน id หรือ category หรือ description ของ dataset
**Expected**
รายการถูกกรองโดยจับคู่กับ id, name, description และ category (ทุกฟิลด์)

---
## TC-DDS-010007 — ค้นหาคำที่ไม่มีต้องแสดง filtered empty state
> **As a** Platform Admin, **I want** a filtered empty state for no-match searches, **so that** I can tell the catalog isn't broken.

**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มี dataset อยู่
**Steps**
1. พิมพ์คำที่ไม่มีจริง เช่น `__NOPE__zzz`
**Expected**
แสดง empty state แบบ filtered (emptyFilteredTitle / emptyFilteredDesc) ไม่ใช่ empty แบบไม่มีข้อมูลเลย

---
## TC-DDS-010008 — ล้างคำค้นแล้วรายการกลับมาแสดงครบ
> **As a** Platform Admin, **I want** clearing the search to restore the full list, **so that** I can return to browsing everything.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/dashboard-dataset`; มีคำค้นที่กรองอยู่
**Steps**
1. ลบข้อความในช่องค้นหาจนว่าง
**Expected**
รายการ dataset ทั้งหมดกลับมาแสดง group ตาม category ตามเดิม

---
## TC-DDS-090001 — สถานะ loading แสดงระหว่างโหลด
> **As a** Platform Admin, **I want** a loading indicator, **so that** I know the catalog is fetching data.

**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิดหน้าขณะข้อมูลยังโหลดไม่เสร็จ (network ช้า)
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
2. สังเกตช่วงโหลด
**Expected**
แสดง spinner พร้อมข้อความ loading (aria-busy) จนกว่าข้อมูลจะมา

---
## TC-DDS-090002 — สถานะ error แสดงข้อความเมื่อโหลดล้มเหลว
> **As a** Platform Admin, **I want** an error message when loading fails, **so that** I know the catalog couldn't load.

**Priority:** Medium · **Test Type:** Negative
**Preconditions**
backend ของ dashboard dataset ตอบ error
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset` ขณะ backend error
**Expected**
แสดงกล่อง error (สีแดง) พร้อมข้อความจาก error หรือ loadError; ไม่ render รายการ

---
## TC-DDS-090003 — empty state เมื่อไม่มี dataset เลย
> **As a** Platform Admin, **I want** an empty state when no datasets exist, **so that** I understand the catalog is simply empty.

**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ระบบไม่มี dashboard dataset เลย (items ว่าง)
**Steps**
1. ไปที่ `/system-admin/dashboard-dataset`
**Expected**
แสดง empty state แบบไม่มีข้อมูล (emptyTitle / emptyDesc) และไม่มี badge total

---
## TC-DDS-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
> **As a** Platform Admin, **I want** unauthenticated access blocked, **so that** the dataset catalog stays protected.

**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session ที่ล็อกอิน
**Steps**
1. เปิด `/system-admin/dashboard-dataset` โดยตรง
**Expected**
ถูก redirect ไป `/login` และไม่เห็นเนื้อหา Dashboard Dataset

---
<sub>Authored: 2026-06-17 · documentation only</sub>
