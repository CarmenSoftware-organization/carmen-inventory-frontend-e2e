# Campaign — User Stories

_Generated from `tests/1001-campaign.spec.ts` annotations. Edit annotations, not this file. Regenerate with `bun docs:user-stories`._

**Module:** Campaign
**Spec:** `tests/1001-campaign.spec.ts`
**Default role:** Admin
**Total test cases:** 46 (27 High / 18 Medium / 1 Low)

## Test Cases at a Glance

| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-CAM-010001 | View Campaign List - Happy Path | High | Happy Path |
| TC-CAM-010002 | View Campaign List - Invalid Permissions | High | Negative |
| TC-CAM-010003 | View Campaign List - Empty Campaign List | High | Edge Case |
| TC-CAM-010004 | View Campaign List - Filter by Status | Medium | Happy Path |
| TC-CAM-010050 | active BU = BLAVG | High | Smoke |
| TC-CAM-010051 | หน้า list โหลดสำเร็จ (admin/BLAVG) + ปุ่ม Add แสดง | High | Smoke |
| TC-CAM-010052 | ค้นหาคำที่ไม่มี → empty state | Medium | Negative |
| TC-CAM-020001 | Happy Path - Create Campaign with All Valid Inputs | High | Happy Path |
| TC-CAM-020002 | Negative Path - Missing Required Fields | High | Negative |
| TC-CAM-020003 | Negative Path - No Vendor Selected | High | Negative |
| TC-CAM-020004 | Edge Case - Maximum Campaigns Per Week | Medium | Edge Case |
| TC-CAM-030001 | View active campaign detail | High | Happy Path |
| TC-CAM-030002 | User with no permission to view campaign detail | High | Negative |
| TC-CAM-030003 | Campaign detail with draft status | High | Happy Path |
| TC-CAM-030004 | View campaign detail with empty performance summary | High | Edge Case |
| TC-CAM-030005 | Campaign detail with future start date | Medium | Edge Case |
| TC-CAM-040001 | Edit Existing Campaign with Valid Data | High | Happy Path |
| TC-CAM-040002 | Edit Campaign with Invalid Priority Value | High | Negative |
| TC-CAM-040003 | Edit Campaign with No Permission | High | Negative |
| TC-CAM-040004 | Edit Campaign with No Data Changes | Medium | Edge Case |
| TC-CAM-050001 | Duplicate Campaign - Happy Path | Medium | Happy Path |
| TC-CAM-050002 | Duplicate Campaign - No Permission | Medium | Negative |
| TC-CAM-050003 | Duplicate Campaign - Empty Campaign List | Medium | Edge Case |
| TC-CAM-050004 | Duplicate Campaign - Campaign with Attached Files | Medium | Happy Path |
| TC-CAM-060001 | Send Reminder - Happy Path | High | Happy Path |
| TC-CAM-060002 | Send Reminder - No Permission | High | Negative |
| TC-CAM-060003 | Send Reminder - Invalid Vendor Status | High | Negative |
| TC-CAM-060004 | Send Reminder - Reminder Already Sent | High | Edge Case |
| TC-CAM-060005 | Send Reminder - Empty Reminder Message | High | Negative |
| TC-CAM-070001 | Mark campaign as expired - Happy Path | Medium | Happy Path |
| TC-CAM-070002 | Mark campaign as expired - No Permission | Medium | Negative |
| TC-CAM-070003 | Mark campaign as expired - Campaign already expired | Medium | Negative |
| TC-CAM-070004 | Mark campaign as expired - Empty campaign list | Low | Edge Case |
| TC-CAM-080001 | Happy Path - Delete Campaign | Medium | Happy Path |
| TC-CAM-080002 | Negative - No Campaign Selected | High | Negative |
| TC-CAM-080003 | Edge Case - Multiple Campaigns Selected | Medium | Edge Case |
| TC-CAM-080004 | Negative - No Permission | Medium | Negative |
| TC-CAM-090001 | Export campaign data - happy path | High | Happy Path |
| TC-CAM-090002 | Export campaign data - no permission | Medium | Negative |
| TC-CAM-090003 | Export campaign data - large dataset | Medium | Edge Case |
| TC-CAM-090004 | Export campaign data - multiple exports | Medium | Edge Case |
| TC-CAM-100001 | Filter by Status - Active | High | Happy Path |
| TC-CAM-100002 | Search by Text - Valid Term | High | Happy Path |
| TC-CAM-100003 | Filter by Status - No Campaigns | High | Negative |
| TC-CAM-100004 | Search by Text - No Matching Terms | High | Negative |
| TC-CAM-100005 | Filter by Status - All Statuses | High | Happy Path |

---

## TC-CAM-010001 — View Campaign List - Happy Path

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และมี permission ดู campaign list

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. ตรวจสอบว่าหน้า Campaign List แสดงขึ้นมา
3. ตรวจสอบว่า campaigns ทั้งหมดโหลดและแสดงใน default table view
4. คลิก campaign name
5. ตรวจสอบว่าหน้า campaign details แสดงขึ้นมา

**Expected**

หน้า campaign details แสดงอย่างถูกต้องพร้อมข้อมูลที่เกี่ยวข้องทั้งหมด

---

## TC-CAM-010002 — View Campaign List - Invalid Permissions

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com แต่ไม่มี permission ดู campaign list

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. ตรวจสอบ error message หรือ redirect ไปยัง home page

**Expected**

ผู้ใช้เห็น error message หรือถูก redirect ไปยัง home page

---

## TC-CAM-010003 — View Campaign List - Empty Campaign List

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้มี permission ดู campaign list แต่ไม่มี campaigns

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. ตรวจสอบว่าไม่มี campaigns แสดงรายการ

**Expected**

ผู้ใช้เห็น message ว่าไม่มี campaigns ในขณะนี้

---

## TC-CAM-010004 — View Campaign List - Filter by Status

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มี permission ดู campaign list

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด filter options
3. เลือกสถานะ 'Active'
4. ตรวจสอบว่าแสดงเฉพาะ campaigns ที่ active

**Expected**

แสดงเฉพาะ campaigns ที่มีสถานะ active

---

## TC-CAM-010050 — active BU = BLAVG

> **As a** Admin user, **I want** core Campaign interactions to work, **so that** day-to-day usage stays smooth.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com ผ่าน auth fixture; beforeEach เรียก ensureActiveBu(BLAVG) แล้ว

**Steps**

1. อ่าน profile API (/api/proxy/api/user/profile)
2. หา business unit ที่ is_default
3. เปิดหน้าที่มี navbar แล้วอ่าน label ของ BU switcher

**Expected**

default business unit มี code === 'BLAVG'; trigger ของ BU switcher ใน navbar แสดง label ของ BU นั้น

---

## TC-CAM-010051 — หน้า list โหลดสำเร็จ (admin/BLAVG) + ปุ่ม Add แสดง

> **As a** Admin user, **I want** the Campaign list page to load successfully, **so that** I can manage Campaign records.

**Priority:** High · **Test Type:** Smoke

**Preconditions**

Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสิทธิ์เข้าถึง Vendor Management

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. ตรวจสอบ URL และ heading 'Request for Pricing'
3. ตรวจสอบว่าปุ่ม 'Add Request' แสดง

**Expected**

URL เป็น /vendor-management/request-price-list, heading 'Request for Pricing' แสดง, และปุ่ม Add แสดง (hard assert)

---

## TC-CAM-010052 — ค้นหาคำที่ไม่มี → empty state

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น admin@blueledgers.com; active BU = BLAVG; มีสิทธิ์เข้าถึง Request for Pricing

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กรอกคำค้นหาที่ไม่มีอยู่จริงในช่อง Search แล้วกด Enter
3. ตรวจสอบว่าแสดง empty state

**Expected**

ตารางแสดง empty state ('No data found') สำหรับคำค้นที่ไม่ตรง (hard assert)

---

## TC-CAM-020001 — Happy Path - Create Campaign with All Valid Inputs

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com พร้อม permissions ที่จำเป็น

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Create New Campaign'
3. กรอก 'Campaign name' ด้วยข้อความที่ถูกต้อง
4. กรอก 'Campaign description' ด้วยข้อความที่ถูกต้อง
5. เลือก 'Normal' จาก priority level
6. กรอก 'Scheduled start date' ด้วยวันที่ที่ถูกต้อง
7. กด 'Next'
8. คลิก template ชื่อ 'Template A'
9. กด 'Next'
10. ค้นหา vendor 'Vendor X'
11. เลือก checkbox vendor 'Vendor X'
12. กด 'Next'
13. ตรวจสอบรายละเอียดทั้งหมดใน summary
14. กด 'Launch Campaign'

**Expected**

Campaign ถูกสร้างด้วยสถานะ 'active' และ vendors ถูก invite ผู้ใช้ถูกนำทางไปยัง campaign detail page พร้อม success message

---

## TC-CAM-020002 — Negative Path - Missing Required Fields

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี permissions ที่จำเป็น

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Create New Campaign'
3. กรอก 'Campaign name' ด้วยข้อความที่ถูกต้อง
4. กด 'Next'

**Expected**

ระบบแสดง error message สำหรับ 'Campaign description' และ 'Scheduled start date' ที่ขาดหายไป ผู้ใช้ยังคงอยู่ที่ step 1

---

## TC-CAM-020003 — Negative Path - No Vendor Selected

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

ผู้ใช้มี permissions ที่จำเป็น

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Create New Campaign'
3. กรอก 'Campaign name' ด้วยข้อความที่ถูกต้อง
4. กรอก 'Campaign description' ด้วยข้อความที่ถูกต้อง
5. เลือก 'Normal' จาก priority level
6. กรอก 'Scheduled start date' ด้วยวันที่ที่ถูกต้อง
7. กด 'Next'
8. คลิก template ชื่อ 'Template A'
9. กด 'Next'
10. ตรวจสอบว่าไม่มี vendors ถูกเลือก
11. กด 'Next'

**Expected**

ระบบแสดง error message สำหรับการไม่เลือก vendor ผู้ใช้ยังคงอยู่ที่ step 3

---

## TC-CAM-020004 — Edge Case - Maximum Campaigns Per Week

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

ผู้ใช้ถึงจำนวน campaigns สูงสุดต่อสัปดาห์แล้ว

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Create New Campaign'

**Expected**

ระบบแสดง message ว่าผู้ใช้ถึงจำนวน campaigns สูงสุดต่อสัปดาห์แล้วและไม่สามารถดำเนินต่อ

---

## TC-CAM-030001 — View active campaign detail

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และมี active campaign อยู่

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก active campaign name
3. รอให้หน้าโหลด

**Expected**

หน้า campaign detail แสดงพร้อมข้อมูล campaign ที่ถูกต้อง

---

## TC-CAM-030002 — User with no permission to view campaign detail

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com ด้วย role ที่ไม่มี permission ดู campaign details

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. พยายามคลิก campaign name
3. ตรวจสอบ error message ว่าไม่มีสิทธิ์เพียงพอ

**Expected**

ผู้ใช้ถูก redirect ไปยังหน้า permission denied หรือ error message แสดงขึ้นมา

---

## TC-CAM-030003 — Campaign detail with draft status

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Campaign อยู่ใน draft status และ Login เป็น purchase@blueledgers.com

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก draft campaign name
3. ตรวจสอบว่า edit button มีอยู่ และ buttons อื่นไม่ visible

**Expected**

หน้า campaign detail แสดงพร้อม edit button ที่ visible และ duplicate button ไม่ visible

---

## TC-CAM-030004 — View campaign detail with empty performance summary

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Campaign ไม่มี submissions และ Login เป็น purchase@blueledgers.com

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign name
3. ตรวจสอบว่า performance summary cards ไม่แสดงข้อมูล

**Expected**

Performance summary cards แสดงค่าศูนย์หรือ placeholders สำหรับข้อมูล

---

## TC-CAM-030005 — Campaign detail with future start date

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Campaign มี future start date และ Login เป็น purchase@blueledgers.com

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign ที่มี future start date
3. ตรวจสอบว่า campaign detail ยังสามารถเข้าถึงได้

**Expected**

หน้า campaign detail แสดงพร้อมข้อมูล campaign รวมถึง future start date

---

## TC-CAM-040001 — Edit Existing Campaign with Valid Data

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Campaign ถูกสร้างและบันทึกในระบบแล้ว

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก link 'Campaign Detail'
3. กด 'Edit' button
4. กรอก campaign name, description, priority, dates และเลือก template
5. เลือก vendor และ configure settings
6. กด 'Save Changes'

**Expected**

Campaign ถูกอัปเดตสำเร็จและระบบนำทางไปยัง campaign detail page ที่อัปเดตแล้วพร้อม success message

---

## TC-CAM-040002 — Edit Campaign with Invalid Priority Value

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Campaign ถูกสร้างและบันทึกในระบบแล้ว

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก link 'Campaign Detail'
3. กด 'Edit' button
4. กรอก campaign name, description และ dates
5. กรอก 'Invalid' ใน priority field
6. เลือก template, vendor และ configure settings
7. กด 'Save Changes'

**Expected**

ระบบแสดง error message ว่า priority field ไม่ถูกต้อง

---

## TC-CAM-040003 — Edit Campaign with No Permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com Campaign ถูกสร้างและบันทึกแล้ว และผู้ใช้ไม่มี permission แก้ไข campaigns

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก link 'Campaign Detail'
3. กด 'Edit' button

**Expected**

ระบบแสดง error message ว่าผู้ใช้ไม่มี permission แก้ไข campaigns

---

## TC-CAM-040004 — Edit Campaign with No Data Changes

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Campaign ถูกสร้างและบันทึกในระบบแล้ว

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก link 'Campaign Detail'
3. กด 'Edit' button
4. ตรวจสอบว่า fields ทั้งหมดแสดงข้อมูลปัจจุบัน
5. กด 'Save Changes'

**Expected**

ระบบแสดง confirmation ว่าไม่มีการเปลี่ยนแปลง

---

## TC-CAM-050001 — Duplicate Campaign - Happy Path

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และมีสิทธิ์เข้าถึง campaign list

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign จาก list
3. กด 'Duplicate' button
4. รอให้ campaign ใหม่ถูกสร้าง
5. ตรวจสอบว่า campaign name ใหม่มี suffix '(Copy)'
6. ตรวจสอบว่าสถานะถูกตั้งเป็น 'Draft'
7. ตรวจสอบว่า settings, vendor selections และ template selection ทั้งหมดถูก copy
8. ไปยังหน้า campaign detail ใหม่

**Expected**

campaign ใหม่ถูก duplicate สำเร็จและผู้ใช้ถูกนำทางไปยังหน้า campaign detail ใหม่

---

## TC-CAM-050002 — Duplicate Campaign - No Permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com และไม่มี permission duplicate campaigns

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign จาก list
3. พยายามกด 'Duplicate' button
4. ตรวจสอบว่า error message แสดงว่าสิทธิ์ไม่เพียงพอ

**Expected**

ผู้ใช้ถูกป้องกันไม่ให้ duplicate campaign และเห็น error message

---

## TC-CAM-050003 — Duplicate Campaign - Empty Campaign List

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น purchase@blueledgers.com และ campaign list ว่างเปล่า

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. ตรวจสอบว่า campaign list ว่างเปล่า
3. กด 'Duplicate' button
4. ตรวจสอบว่าระบบแจ้งให้ผู้ใช้สร้าง campaign ใหม่ก่อน

**Expected**

ผู้ใช้ได้รับแจ้งว่าต้องสร้าง campaign ใหม่ก่อนจึงจะ duplicate ได้

---

## TC-CAM-050004 — Duplicate Campaign - Campaign with Attached Files

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และมี campaign ที่มี attached files อยู่ในระบบ

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign ที่มี attached files
3. กด 'Duplicate' button
4. ตรวจสอบว่า settings, vendor selections, template selection และ files ทั้งหมดถูก copy ไปยัง campaign ใหม่

**Expected**

campaign ใหม่ถูก duplicate พร้อม settings, vendor selections, template และ attached files ทั้งหมดที่ถูก copy

---

## TC-CAM-060001 — Send Reminder - Happy Path

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และมีสิทธิ์เข้าถึง vendor reminder feature

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกหน้า campaign detail
3. กด tab 'Vendors'
4. ระบุ vendor ที่มีสถานะ 'pending' หรือ 'in_progress'
5. กด 'Send Reminder' button
6. ตรวจสอบ success message: 'Reminder sent successfully'

**Expected**

Reminder ถูกส่งไปยัง vendor reminder count เพิ่มขึ้น และวันที่ส่ง reminder ล่าสุดถูกอัปเดต

---

## TC-CAM-060002 — Send Reminder - No Permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com ซึ่งไม่ใช่ Procurement Staff

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกหน้า campaign detail
3. กด tab 'Vendors'
4. พยายามกด 'Send Reminder' button สำหรับ vendor

**Expected**

ผู้ใช้ได้รับ error message ว่าไม่มี permission ส่ง reminders

---

## TC-CAM-060003 — Send Reminder - Invalid Vendor Status

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น purchase@blueledgers.com

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกหน้า campaign detail
3. กด tab 'Vendors'
4. ระบุ vendor ที่มีสถานะ 'complete'
5. พยายามกด 'Send Reminder' button

**Expected**

ระบบแสดง error message ว่าสถานะ vendor ไม่ถูกต้องสำหรับการส่ง reminders

---

## TC-CAM-060004 — Send Reminder - Reminder Already Sent

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Edge Case

**Preconditions**

Vendor ได้รับ reminder ไปแล้วภายใน 24 ชั่วโมงที่ผ่านมา

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกหน้า campaign detail
3. กด tab 'Vendors'
4. ระบุ vendor ที่มีสถานะ 'pending' หรือ 'in_progress' แต่ได้รับ reminder ไปแล้วภายใน 24 ชั่วโมงที่ผ่านมา
5. กด 'Send Reminder' button

**Expected**

ระบบแสดง warning message ว่า reminder ถูกส่งไปแล้วภายใน 24 ชั่วโมงที่ผ่านมา

---

## TC-CAM-060005 — Send Reminder - Empty Reminder Message

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น purchase@blueledgers.com

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกหน้า campaign detail
3. กด tab 'Vendors'
4. ระบุ vendor ที่มีสถานะ 'pending' หรือ 'in_progress'
5. กด 'Send Reminder' button โดยไม่กรอก message
6. กด 'Send' ใน reminder dialog

**Expected**

ระบบแสดง error message ว่า reminder message field ต้องไม่ว่างเปล่า

---

## TC-CAM-070001 — Mark campaign as expired - Happy Path

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

ผู้ใช้มีสิทธิ์เข้าถึง campaign ที่ยังไม่ expired

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign เพื่อเปิดหน้า detail
3. กด actions dropdown menu
4. กด 'Mark as Expired'
5. ยืนยันการดำเนินการ

**Expected**

สถานะ campaign อัปเดตเป็น 'Expired' และ success toast 'Campaign marked as expired' แสดง

---

## TC-CAM-070002 — Mark campaign as expired - No Permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com ซึ่งไม่มีสิทธิ์ mark campaign เป็น expired

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign เพื่อเปิดหน้า detail
3. กด actions dropdown menu
4. กด 'Mark as Expired'

**Expected**

ผู้ใช้ได้รับข้อความ error แจ้งว่าไม่มีสิทธิ์ดำเนินการนี้

---

## TC-CAM-070003 — Mark campaign as expired - Campaign already expired

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

campaign ที่เลือกถูก mark เป็น expired ไปแล้ว

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิก campaign เพื่อเปิดหน้า detail
3. กด actions dropdown menu
4. กด 'Mark as Expired'

**Expected**

ผู้ใช้ได้รับการแจ้งเตือนว่า campaign นี้ expired ไปแล้วและไม่มีการดำเนินการใด ๆ

---

## TC-CAM-070004 — Mark campaign as expired - Empty campaign list

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Low · **Test Type:** Edge Case

**Preconditions**

รายการ campaign ว่างเปล่า

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. พยายามคลิก campaign เพื่อเปิดหน้า detail
3. กด actions dropdown menu
4. กด 'Mark as Expired'

**Expected**

ผู้ใช้ได้รับข้อความแจ้งว่าไม่มี campaign ให้ใช้งาน

---

## TC-CAM-080001 — Happy Path - Delete Campaign

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Procurement Manager และมี campaign อยู่ในรายการ

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกชื่อ campaign
3. กด 'Actions' dropdown
4. กด 'Delete'
5. กด 'Delete' ใน confirmation dialog

**Expected**

campaign ถูกลบออกจากฐานข้อมูลและรายการ และ success toast 'Campaign deleted successfully' แสดง

---

## TC-CAM-080002 — Negative - No Campaign Selected

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Procurement Manager

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Actions' dropdown โดยไม่ได้เลือก campaign ใด
3. กด 'Delete'

**Expected**

ระบบแสดง error message 'Please select a campaign to delete'

---

## TC-CAM-080003 — Edge Case - Multiple Campaigns Selected

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Procurement Manager และมีการเลือก campaign หลายรายการ

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. เลือก campaign หลายรายการ
3. กด 'Actions' dropdown
4. กด 'Delete'

**Expected**

ระบบแสดง error message 'Please select one campaign to delete'

---

## TC-CAM-080004 — Negative - No Permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com มี role Regular User

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. คลิกชื่อ campaign
3. กด 'Actions' dropdown
4. กด 'Delete'

**Expected**

ระบบแสดง error message 'You do not have permission to delete campaigns'

---

## TC-CAM-090001 — Export campaign data - happy path

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com มีสิทธิ์ export ข้อมูล campaign

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Export' button
3. รอการสร้างไฟล์
4. ตรวจสอบว่าการ download ไฟล์เริ่มต้น

**Expected**

การ download ไฟล์เริ่มต้นและผู้ใช้ได้รับ success message

---

## TC-CAM-090002 — Export campaign data - no permission

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Negative

**Preconditions**

Login เป็น requestor@blueledgers.com ซึ่งไม่มีสิทธิ์ export ข้อมูล campaign

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Export' button
3. ตรวจสอบว่า error message แสดง

**Expected**

ผู้ใช้เห็น error message แจ้งว่าไม่มีสิทธิ์ export ข้อมูล campaign

---

## TC-CAM-090003 — Export campaign data - large dataset

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น purchase@blueledgers.com มีสิทธิ์ export ข้อมูล campaign และมีชุดข้อมูลขนาดใหญ่

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Export' button
3. รอการสร้างไฟล์
4. ตรวจสอบว่าการ download ไฟล์เริ่มต้น

**Expected**

การ download ไฟล์เริ่มต้นโดยไม่มีปัญหาและผู้ใช้ได้รับ success message

---

## TC-CAM-090004 — Export campaign data - multiple exports

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** Medium · **Test Type:** Edge Case

**Preconditions**

Login เป็น purchase@blueledgers.com มีสิทธิ์ export ข้อมูล campaign

**Steps**

1. ไปที่ /vendor-management/request-price-list
2. กด 'Export' button 5 ครั้งภายใน 5 นาที
3. รอการสร้างไฟล์หลังกดแต่ละครั้ง
4. ตรวจสอบว่าการ download ไฟล์เริ่มต้นทุกครั้ง

**Expected**

การ download ไฟล์เริ่มต้นหลังแต่ละคำขอ export และผู้ใช้ได้รับ success message สำหรับแต่ละครั้ง

---

## TC-CAM-100001 — Filter by Status - Active

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Procurement Staff และอยู่ที่หน้า Campaigns

**Steps**

1. กด status filter dropdown
2. เลือก 'Active'
3. ตรวจสอบว่าแสดงเฉพาะ campaign ที่ Active
4. ตรวจสอบว่าจำนวนผลลัพธ์ตรงกับจำนวน campaign ที่ Active

**Expected**

แสดงเฉพาะ campaign ที่ Active พร้อมจำนวนผลลัพธ์ที่ถูกต้อง

---

## TC-CAM-100002 — Search by Text - Valid Term

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com มี role Procurement Staff และอยู่ที่หน้า Campaigns

**Steps**

1. พิมพ์ 'Inventory' ใน search input
2. ตรวจสอบว่า campaign ที่เกี่ยวข้องถูก filter และแสดง
3. ตรวจสอบว่าจำนวนผลลัพธ์ตรงกับจำนวน campaign ที่มีคำว่า 'Inventory'

**Expected**

campaign ที่มีคำว่า 'Inventory' ถูก filter และแสดงพร้อมจำนวนผลลัพธ์ที่ถูกต้อง

---

## TC-CAM-100003 — Filter by Status - No Campaigns

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น purchase@blueledgers.com และอยู่ที่หน้า Campaigns ที่ไม่มี campaign ที่ Active

**Steps**

1. กด status filter dropdown
2. เลือก 'Active'
3. ตรวจสอบว่าไม่มี campaign แสดง
4. ตรวจสอบว่าจำนวนผลลัพธ์เป็น 0

**Expected**

ไม่มี campaign แสดงและจำนวนผลลัพธ์เป็น 0

---

## TC-CAM-100004 — Search by Text - No Matching Terms

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Negative

**Preconditions**

Login เป็น purchase@blueledgers.com และอยู่ที่หน้า Campaigns

**Steps**

1. พิมพ์ 'NonexistentTerm' ใน search input
2. ตรวจสอบว่าไม่มี campaign แสดง
3. ตรวจสอบว่าจำนวนผลลัพธ์เป็น 0

**Expected**

ไม่มี campaign แสดงและจำนวนผลลัพธ์เป็น 0

---

## TC-CAM-100005 — Filter by Status - All Statuses

> **As a** Admin user, **I want** this Campaign behavior verified, **so that** the feature works as expected.
<!-- TODO: refine narrative -->

**Priority:** High · **Test Type:** Happy Path

**Preconditions**

Login เป็น purchase@blueledgers.com และอยู่ที่หน้า Campaigns

**Steps**

1. กด status filter dropdown
2. เลือก 'All'
3. ตรวจสอบว่า campaign ทั้งหมดแสดง
4. ตรวจสอบว่าจำนวนผลลัพธ์ตรงกับจำนวน campaign ทั้งหมด

**Expected**

campaign ทั้งหมดแสดงพร้อมจำนวนผลลัพธ์ที่ถูกต้อง

---


<sub>Last regenerated: 2026-06-16 · git 1a5c179</sub>
