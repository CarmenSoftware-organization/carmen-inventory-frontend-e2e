# Profile & Settings — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/profile`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Profile & Settings
**Frontend route:** `routes/profile`  •  **URL:** `/profile` (และ `/profile/setting`)
**Prefix:** `PROF`
**Default role:** Admin (admin@blueledgers.com, active BU = BLAVG) — ทั้งสอง route เปิดได้ทุกบัญชีที่ล็อกอิน ไม่มีการตรวจ permission รายหน้า
**Total test cases:** 40

> หน้า Profile (`/profile`) เป็น read-only: hero แสดง avatar (fallback = alias → initials → `?`), ชื่อเต็ม (firstname+middlename+lastname), badge `platform_role`, email และเบอร์โทร (แสดงเฉพาะเมื่อมีค่า) พร้อมปุ่ม Edit Profile ที่เป็นลิงก์ไป `/profile/setting`. ถัดมาเป็น section Personal Information (First/Middle/Last Name + Alias, ค่าว่างแสดง `-`), section Signature (แสดงเฉพาะเมื่อ `signature_url` มีค่า) และ section Business Units ที่เป็น **กริดการ์ด หนึ่งใบต่อ 1 BU** (ไม่ใช่ Tabs). การ์ด BU แต่ละใบมี badge HQ/Inactive, ช่องอัปโหลด Logo (แนวนอน) และ Avatar (กลม) ที่อัปโหลด/เปลี่ยน/ลบได้จริงจากหน้านี้, ข้อมูล BU Code (+badge Default), Alias, Department, System Level, HOD Departments, Tax No., Branch No., Description และ SubSection Hotel/Company เมื่อมีข้อมูล. หน้า Settings (`/profile/setting`) มี header แบบ sticky (ปุ่มย้อนกลับ + หัวข้อ Profile Settings + ปุ่ม Save ที่ผูกกับฟอร์มด้วย `form="profile-form"`), บล็อก Account Information (คลิก avatar เพื่อเลือกไฟล์ → AvatarCropDialog → อัปโหลด, ปุ่มถังขยะเพื่อลบ, ปุ่ม Change Password), ฟอร์มข้อมูลส่วนตัว (firstname/lastname required, alias สูงสุด 2 ตัว) และบล็อก Signature (SignatureDialog มีแท็บ Draw/Upload). ออกจากหน้าขณะฟอร์ม dirty จะเจอ DiscardDialog.

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> - **Business Units ไม่ได้เป็น Tabs อีกต่อไป** — `user-profile-details.tsx` เรนเดอร์ `profile.business_unit.map(...)` เป็นกริดการ์ด (`grid-cols-1 xl:grid-cols-2`) ทุกใบแสดงพร้อมกัน ไม่มี `TabsList`/`TabsTrigger` ในโมดูลนี้แล้ว เคสเดิม TC-PROF-020001 ("สลับ tab Business Unit") จึงถูกลบทั้งบล็อก และ TC-PROF-010004 ถูกเขียนใหม่เป็นการ์ด
> - **การสลับ Business Unit ไม่ได้ทำที่หน้านี้** — `useProfile` เพียงแค่ฟัง `BU_SWITCH_CHANNEL` เพื่อ invalidate ข้อมูลเมื่อมีการสลับจากแท็บอื่น ตัวสลับ BU จริงอยู่นอกโมดูลนี้ คำอธิบายเดิมในหัวเอกสารที่บอกว่า "สลับ BU ผ่าน Tabs ในหน้า profile" ผิดและถูกตัดออก
> - **ลายเซ็น (Signature) เป็นฟีเจอร์ใหม่หลังวันที่เขียนแคตตาล็อกเดิม** (commits `3af3e24b`, `55ceda8a`, `71625140`) มีทั้งวาดบนแคนวาสและอัปโหลดรูป — เพิ่มเคส TC-PROF-020004, 030002–030005, 050002 และ 200008
> - **ปุ่ม Save ย้ายขึ้นไปอยู่บน header ที่ sticky** (commit `d9840d81`) ไม่ได้อยู่ท้ายฟอร์ม และไม่มีปุ่ม Cancel ในฟอร์ม — การจะทิ้งการแก้ไขทำได้ทางปุ่มย้อนกลับ/ออกจากหน้าเท่านั้น
> - **ภาษา / ธีม / ขนาดฟอนต์ ไม่ได้อยู่ในโมดูลนี้** — `LangSwitch`, `ThemeSwitch`, `FontScaleSwitch` อยู่ใน dropdown ผู้ใช้บน navbar (`components/navbar/user-profile.tsx`) และเก็บค่าไว้ใน localStorage แคตตาล็อกนี้จึงไม่มีเคสใดที่แตะค่าเหล่านั้น และไม่มีเคสที่ทำให้สเปกอื่นเปลี่ยนภาษา/ธีมตาม ถ้าจะเขียนเคสของสวิตช์เหล่านี้ต้องไปไว้ในแคตตาล็อกของ navbar/layout และ**ต้องคืนค่าเดิมท้ายเทสเสมอ** เพราะค่าอยู่ใน localStorage ต่อ origin และการเปลี่ยนภาษาจะทำให้ข้อความบน UI ของทุกสเปกเปลี่ยนตาม
> - **TC-PROF-050001 เปลี่ยนรหัสผ่านจริงแล้ว logout ทันที** — ถ้าจะเขียนเป็นสเปกจริงต้องใช้บัญชีที่ทิ้งได้ หรือเปลี่ยนกลับในขั้นตอนสุดท้าย ไม่งั้นรหัสใน `tests/test-users.ts` จะใช้ไม่ได้และพัง `auth.setup.ts` ทั้งชุด
> - **เคสที่แก้ข้อมูลจริงร่วมกับสเปกอื่น**: TC-PROF-040001 (แก้ชื่อ/เบอร์/alias ของบัญชีที่ใช้ร่วม), 040004/040005/050003/050004 (logo และ avatar ของ BU `BLAVG`) — รูป BU โผล่ในหัวหน้าจอทุกโมดูล ควรอัปโหลดคืนหรือรันแยก
> - **ข้อความ toast ซ้ำกันข้ามหน้าที่**: การตรวจชนิด/ขนาดไฟล์ของ avatar ผู้ใช้ใน `user-profile-setting.tsx` ใช้คีย์ของ logo (`logoTypeError` = "Logo must be PNG, JPG, or WebP", `logoSizeError`) และ toast สำเร็จของ avatar ผู้ใช้กับ avatar ของ BU เป็นข้อความเดียวกัน ("Avatar uploaded" / "Avatar removed") — เคสจึงต้องยืนยันจากรูปที่เปลี่ยน ไม่ใช่จาก toast อย่างเดียว บันทึกไว้เป็นข้อเท็จจริง ไม่ได้เขียนเป็นเคสว่าผิด
> - **เกณฑ์ไฟล์สองชุดไม่เท่ากัน**: avatar ผู้ใช้และรูปของ BU ใช้ `IMAGE_MIME_TYPES` = png/jpeg/webp (≤ 2MB) ส่วนลายเซ็นใช้ `validateImageFiles` ซึ่งรับ gif เพิ่มด้วย และรายงาน error เป็นข้อความ inline ใน dialog ไม่ใช่ toast
> - **alias ถูกจำกัดที่ input**: ช่อง alias มี `maxLength={2}` ทำให้พิมพ์เกิน 2 ตัวไม่ได้ ข้อความ zod `Alias max 2 characters` จึงแทบไม่ถูกทริกเกอร์จากการพิมพ์ปกติ — TC-PROF-200002 จึงยืนยันที่การตัดข้อความของ input แทนการยืนยัน error
> - **หมายเลข section ที่ไม่ตรงความหมาย คงไว้ตามเดิมโดยตั้งใจ**: TC-PROF-030001 เป็นเคสนำทาง (อยู่ใน block 03 = create), TC-PROF-040003 เป็นการลบ (อยู่ใน block 04 = edit) และ TC-PROF-050001 เป็นการเปลี่ยนรหัสผ่าน (อยู่ใน block 05 = delete) — ทั้งสามยังทดสอบสิ่งที่มีอยู่จริง จึงคง ID เดิมไว้เพื่อไม่ให้เลข TC เคลื่อน
> - `ChangePasswordDialog` เป็นคอมโพเนนต์กลางที่ `components/share/` ใช้ร่วมกับเมนูผู้ใช้บน navbar การแก้ dialog นี้กระทบสองจุดพร้อมกัน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-PROF-010001 | หน้า Profile โหลดและแสดงข้อมูลผู้ใช้ | High | Smoke |
| TC-PROF-010002 | hero แสดง avatar / ชื่อเต็ม / badge role / email | Medium | Functional |
| TC-PROF-010003 | section Personal Information แสดงครบทุกฟิลด์ | Medium | Functional |
| TC-PROF-010004 | section Business Units แสดงเป็นการ์ดหนึ่งใบต่อ 1 BU | High | Functional |
| TC-PROF-010005 | เปิด `/profile/setting` ตรง ๆ แล้วโหลดฟอร์มพร้อม header | High | Smoke |
| TC-PROF-010006 | ปุ่มย้อนกลับในหน้า Settings (ฟอร์มยังไม่แก้) กลับไป `/profile` | Medium | Functional |
| TC-PROF-020002 | การ์ด BU แสดง badge HQ / Inactive / Default ตามสถานะ | Low | Functional |
| TC-PROF-020003 | การ์ด BU แสดง SubSection Hotel / Company เมื่อมีข้อมูล | Low | Functional |
| TC-PROF-020004 | section Signature แสดงเฉพาะเมื่อผู้ใช้มีลายเซ็น | Medium | Functional |
| TC-PROF-020005 | การ์ด BU แสดงข้อมูลรายละเอียดครบทุกช่อง | Medium | Functional |
| TC-PROF-020006 | ผู้ใช้ที่ไม่มี BU เห็น empty state ของ Business Units | Low | Edge Case |
| TC-PROF-020007 | โหลดโปรไฟล์ล้มเหลวแสดงข้อความ Failed to load profile | Medium | Negative |
| TC-PROF-030001 | ปุ่ม Edit Profile นำไปหน้า Settings | High | Smoke |
| TC-PROF-030002 | เพิ่มลายเซ็นด้วยการวาดในแท็บ Draw | High | CRUD |
| TC-PROF-030003 | เพิ่มลายเซ็นด้วยการอัปโหลดรูปในแท็บ Upload | High | CRUD |
| TC-PROF-030004 | ปุ่ม Save / Clear ใน SignatureDialog ถูกปิดจนกว่าจะมีลายเซ็น | Medium | Validation |
| TC-PROF-030005 | ปุ่มบนการ์ด Signature เปลี่ยนตามสถานะว่ามีลายเซ็นหรือไม่ | Medium | Functional |
| TC-PROF-040001 | แก้ไขข้อมูลส่วนตัวและบันทึกสำเร็จ | High | CRUD |
| TC-PROF-040002 | อัปโหลด avatar ผู้ใช้ผ่าน AvatarCropDialog สำเร็จ | Medium | CRUD |
| TC-PROF-040003 | ลบ avatar ผู้ใช้ผ่าน confirm dialog | Medium | CRUD |
| TC-PROF-040004 | อัปโหลด/เปลี่ยน logo ของ Business Unit | Medium | CRUD |
| TC-PROF-040005 | อัปโหลด/เปลี่ยน avatar ของ Business Unit | Medium | CRUD |
| TC-PROF-040006 | ยกเลิกใน AvatarCropDialog แล้วไม่มีการอัปโหลด | Medium | Alternate Flow |
| TC-PROF-040007 | ออกจากหน้าขณะฟอร์ม dirty ขึ้น DiscardDialog | High | Functional |
| TC-PROF-050001 | เปลี่ยนรหัสผ่านสำเร็จและถูก logout อัตโนมัติ | High | Functional |
| TC-PROF-050002 | ลบลายเซ็นผ่าน confirm dialog | Medium | CRUD |
| TC-PROF-050003 | ลบ logo ของ Business Unit ผ่าน confirm dialog | Medium | CRUD |
| TC-PROF-050004 | ลบ avatar ของ Business Unit ผ่าน confirm dialog | Low | CRUD |
| TC-PROF-050005 | กด Cancel ใน confirm dialog แล้วรูปยังอยู่ครบ | Medium | Alternate Flow |
| TC-PROF-100001 | ผู้ใช้ไม่ login เปิด `/profile` ถูก redirect ไป `/login` | High | Auth-guard |
| TC-PROF-100002 | ผู้ใช้ไม่ login เปิด `/profile/setting` ถูก redirect ไป `/login` | High | Auth-guard |
| TC-PROF-200001 | บันทึกฟอร์มโดยเว้น firstname/lastname ขึ้น error required | High | Validation |
| TC-PROF-200002 | ช่อง alias รับได้สูงสุด 2 ตัวอักษร | Medium | Validation |
| TC-PROF-200003 | เปลี่ยนรหัสผ่าน: new ไม่ตรง confirm ขึ้น error | High | Validation |
| TC-PROF-200004 | เปลี่ยนรหัสผ่าน: new ไม่ผ่านเกณฑ์ความเข้มขึ้น error | Medium | Validation |
| TC-PROF-200005 | เปลี่ยนรหัสผ่าน: new ซ้ำกับ current ขึ้น error | Medium | Validation |
| TC-PROF-200006 | เปลี่ยนรหัสผ่าน: เว้นทั้งสามช่องว่างขึ้น error required | Medium | Validation |
| TC-PROF-200007 | เลือกไฟล์ avatar ผิดชนิดหรือเกิน 2MB ขึ้น toast เตือน | Medium | Validation |
| TC-PROF-200008 | อัปโหลดไฟล์ลายเซ็นที่ไม่ผ่านเกณฑ์ขึ้น error ใน dialog | Medium | Validation |
| TC-PROF-200009 | ช่องข้อความในฟอร์มจำกัดความยาวตาม maxLength | Low | Validation |

---
## TC-PROF-010001 — หน้า Profile โหลดและแสดงข้อมูลผู้ใช้
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Admin (admin@blueledgers.com) active BU = BLAVG
**Steps**
1. ไปที่ `/profile`
2. รอ skeleton ของ LoaderProfile หายไป
**Expected**
URL ตรงกับ `/profile`, แสดง hero พร้อมชื่อผู้ใช้ และหัวข้อ Personal Information กับ Business Units ครบทั้งสอง section

---
## TC-PROF-010002 — hero แสดง avatar / ชื่อเต็ม / badge role / email
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`
**Steps**
1. ดูแถบ hero ด้านบนสุดของหน้า
**Expected**
แสดง avatar (ถ้าไม่มี `avatar_url` ใช้ fallback เป็น alias → อักษรย่อจาก firstname+lastname → `?`), ชื่อเต็มที่ต่อจาก firstname + middlename + lastname, badge ที่เป็นค่า `platform_role`, email ข้างไอคอนซองจดหมาย และเบอร์โทรข้างไอคอนโทรศัพท์เฉพาะเมื่อ `user_info.telephone` มีค่า

---
## TC-PROF-010003 — section Personal Information แสดงครบทุกฟิลด์
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`
**Steps**
1. เลื่อนไปที่ section Personal Information
**Expected**
แสดง 4 ช่อง คือ First Name, Middle Name, Last Name และ Alias โดยช่องที่ไม่มีค่าแสดงเป็น `-`

---
## TC-PROF-010004 — section Business Units แสดงเป็นการ์ดหนึ่งใบต่อ 1 BU
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่สังกัด Business Unit อย่างน้อย 1 หน่วย (Admin สังกัด BLAVG); อยู่ที่ `/profile`
**Steps**
1. เลื่อนไปที่ section Business Units
**Expected**
แสดงการ์ด 1 ใบต่อ 1 BU ในกริด (ทุกใบเห็นพร้อมกัน ไม่มี Tabs ให้สลับ) แต่ละใบขึ้นต้นด้วยชื่อ BU เป็นหัวข้อ และมีช่อง Logo/Avatar กับรายการข้อมูลของ BU นั้นอยู่ภายในการ์ด

---
## TC-PROF-010005 — เปิด `/profile/setting` ตรง ๆ แล้วโหลดฟอร์มพร้อม header
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว
**Steps**
1. ไปที่ `/profile/setting` โดยพิมพ์ URL ตรง ๆ
2. รอ skeleton หายไป
**Expected**
URL ตรงกับ `/profile/setting`, แสดงหัวข้อ Profile Settings, ปุ่มย้อนกลับ (aria-label `Go back`) และปุ่ม Save บน header รวมถึงบล็อก Account Information, ฟอร์ม Personal Information และบล็อก Signature

---
## TC-PROF-010006 — ปุ่มย้อนกลับในหน้า Settings (ฟอร์มยังไม่แก้) กลับไป `/profile`
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting` และยังไม่ได้แก้ค่าใดในฟอร์ม
**Steps**
1. กดปุ่มย้อนกลับบน header
**Expected**
นำทางกลับไป `/profile` ทันทีโดยไม่มี DiscardDialog ขึ้น (ฟอร์มยังไม่ dirty)

---
## TC-PROF-020002 — การ์ด BU แสดง badge HQ / Inactive / Default ตามสถานะ
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มี BU ซึ่ง `config.is_hq` เป็นจริง และ/หรือ `is_active` เป็นเท็จ และ/หรือ `is_default` เป็นจริง; อยู่ที่ `/profile`
**Steps**
1. ดูการ์ดของ BU ที่มีสถานะดังกล่าว
**Expected**
แถวบนสุดของการ์ดแสดง badge `HQ` เมื่อ `config.is_hq` และ badge `Inactive` เมื่อ BU ไม่ active (แถวนี้ไม่ถูกเรนเดอร์เลยถ้าไม่เข้าเงื่อนไขทั้งสอง) ส่วน badge `Default` แสดงต่อท้ายค่าในช่อง BU Code เมื่อ `is_default`

---
## TC-PROF-020003 — การ์ด BU แสดง SubSection Hotel / Company เมื่อมีข้อมูล
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็นผู้ใช้ที่มี BU ซึ่ง `config.hotel` และ/หรือ `config.company` มีค่า; อยู่ที่ `/profile`
**Steps**
1. ดูส่วนล่างของการ์ด BU นั้น
**Expected**
แสดงกล่องย่อยหัวข้อ Hotel และ/หรือ Company พร้อมช่อง Name, Telephone, Email และ Address (ค่าว่างแสดง `-`) และกล่องย่อยที่ไม่มีข้อมูลจะไม่ถูกเรนเดอร์

---
## TC-PROF-020004 — section Signature แสดงเฉพาะเมื่อผู้ใช้มีลายเซ็น
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; ทราบว่าบัญชีนี้มีหรือไม่มีลายเซ็นบันทึกไว้
**Steps**
1. ไปที่ `/profile`
2. มองหาหัวข้อ Signature ระหว่าง Personal Information กับ Business Units
**Expected**
ถ้าบัญชีมี `signature_url` จะเห็นหัวข้อ Signature พร้อมรูปลายเซ็น; ถ้าไม่มี จะไม่มี section Signature ในหน้าเลย (ไม่ใช่กล่องว่าง)

---
## TC-PROF-020005 — การ์ด BU แสดงข้อมูลรายละเอียดครบทุกช่อง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Admin (BU = BLAVG); อยู่ที่ `/profile`
**Steps**
1. ดูรายการข้อมูลในการ์ด BU
**Expected**
แสดงช่อง BU Code, Alias, Department, System Level, HOD Departments, Tax No. และ Branch No. ครบทุกช่อง (ค่าว่างแสดง `-`) และช่อง Description แสดงเฉพาะเมื่อ `config.description` มีค่า

---
## TC-PROF-020006 — ผู้ใช้ที่ไม่มี BU เห็น empty state ของ Business Units
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
ล็อกอินด้วยบัญชีที่ไม่ได้สังกัด Business Unit ใดเลย (`business_unit` เป็น array ว่าง)
**Steps**
1. ไปที่ `/profile`
2. เลื่อนไปที่ section Business Units
**Expected**
ไม่มีการ์ด BU ใด ๆ และแสดง empty state พร้อมข้อความ `No business units assigned`

---
## TC-PROF-020007 — โหลดโปรไฟล์ล้มเหลวแสดงข้อความ Failed to load profile
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ล็อกอินแล้ว; ดักคำขอ profile ของ backend ให้ตอบ error (เช่น 500) ก่อนเปิดหน้า
**Steps**
1. ไปที่ `/profile`
2. รอให้การ retry ของ query จบ
**Expected**
แทนที่จะเห็น hero จะเห็นข้อความ `Failed to load profile` และหน้าไม่ crash (ไม่ตกไป error boundary)

---
## TC-PROF-030001 — ปุ่ม Edit Profile นำไปหน้า Settings
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`
**Steps**
1. กดปุ่ม Edit Profile ที่มุมขวาของ hero
**Expected**
นำทางไป `/profile/setting` และแสดงหัวข้อ Profile Settings พร้อมฟอร์มข้อมูลส่วนตัว

---
## TC-PROF-030002 — เพิ่มลายเซ็นด้วยการวาดในแท็บ Draw
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; บัญชียังไม่มีลายเซ็น
**Steps**
1. กดปุ่ม Add signature บนการ์ด Signature
2. อยู่ที่แท็บ Draw (แท็บเริ่มต้น) แล้วลากเมาส์วาดบนแคนวาส (aria-label `signature drawing area`) อย่างน้อย 1 เส้น
3. กดปุ่ม Save ใน dialog
**Expected**
แสดง toast `Signature updated`, dialog ปิดลง และการ์ด Signature เปลี่ยนจากข้อความชวนอัปโหลดเป็นรูปลายเซ็นที่เพิ่งวาด

---
## TC-PROF-030003 — เพิ่มลายเซ็นด้วยการอัปโหลดรูปในแท็บ Upload
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; มีไฟล์รูป PNG/JPEG/WebP/GIF ขนาดไม่เกิน 2MB
**Steps**
1. กดปุ่ม Add signature (หรือ Edit signature)
2. สลับไปแท็บ Upload
3. กดกรอบเส้นประเพื่อเลือกไฟล์ (input `data-testid="signature-file-input"`)
4. ตรวจว่ามีพรีวิวรูปในกรอบ แล้วกดปุ่ม Save
**Expected**
แสดง toast `Signature updated`, dialog ปิด และการ์ด Signature แสดงรูปที่อัปโหลด

---
## TC-PROF-030004 — ปุ่ม Save / Clear ใน SignatureDialog ถูกปิดจนกว่าจะมีลายเซ็น
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. เปิด SignatureDialog
2. ยังไม่วาดและยังไม่เลือกไฟล์ ตรวจสถานะปุ่ม Save และปุ่ม Clear
3. วาด 1 เส้นบนแคนวาส แล้วตรวจสถานะปุ่มทั้งสองอีกครั้ง
4. กดปุ่ม Clear แล้วตรวจสถานะปุ่มอีกครั้ง
**Expected**
ก่อนวาด ปุ่ม Save และ Clear ถูก disabled; หลังวาดทั้งสองปุ่มใช้งานได้; หลังกด Clear แคนวาสว่างและทั้งสองปุ่มกลับไป disabled

---
## TC-PROF-030005 — ปุ่มบนการ์ด Signature เปลี่ยนตามสถานะว่ามีลายเซ็นหรือไม่
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. ดูแถบปุ่มบนการ์ด Signature ขณะบัญชียังไม่มีลายเซ็น
2. เพิ่มลายเซ็นให้สำเร็จ แล้วดูแถบปุ่มอีกครั้ง
**Expected**
ตอนยังไม่มีลายเซ็นมีเพียงปุ่ม `Add signature` และเนื้อการ์ดเป็นข้อความ `Click to choose an image`; ตอนมีลายเซ็นแล้วปุ่มเปลี่ยนเป็น `Edit signature` และมีปุ่ม `Remove signature` เพิ่มขึ้นมาข้างกัน

---
## TC-PROF-040001 — แก้ไขข้อมูลส่วนตัวและบันทึกสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting` (เคสนี้แก้ข้อมูลบัญชีจริงที่สเปกอื่นใช้ร่วม ควรบันทึกค่าเดิมไว้คืน)
**Steps**
1. แก้ค่าในช่อง First Name / Last Name / Telephone / Alias
2. กดปุ่ม Save บน header
**Expected**
ปุ่มเปลี่ยนเป็น `Saving...` ระหว่างส่ง จากนั้นแสดง toast `Profile updated successfully` และฟอร์มถูก reset เป็นค่าที่บันทึก (ปุ่มย้อนกลับไม่ทำให้ DiscardDialog ขึ้นอีก)

---
## TC-PROF-040002 — อัปโหลด avatar ผู้ใช้ผ่าน AvatarCropDialog สำเร็จ
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; มีไฟล์รูป PNG/JPEG/WebP ขนาดไม่เกิน 2MB
**Steps**
1. คลิกที่ avatar ในบล็อก Account Information (ปุ่ม aria-label `Upload avatar`) แล้วเลือกไฟล์
2. รอ dialog `Adjust your avatar` เปิดขึ้น
3. ปรับซูมด้วยแถบเลื่อนหรือปุ่ม Zoom in / Zoom out
4. กดปุ่ม Confirm
**Expected**
ระหว่างอัปโหลด avatar แสดงพรีวิวรูปที่ครอปแล้ว จากนั้นแสดง toast `Avatar uploaded`, dialog ปิด และ avatar ทั้งในหน้า Settings และหน้า `/profile` อัปเดตเป็นรูปใหม่

---
## TC-PROF-040003 — ลบ avatar ผู้ใช้ผ่าน confirm dialog
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; บัญชีมี avatar อยู่แล้ว
**Steps**
1. กดปุ่มถังขยะเล็กมุมขวาบนของ avatar (aria-label `Remove avatar`)
2. ยืนยันในกล่อง `Remove avatar?` ด้วยปุ่ม Remove avatar
**Expected**
แสดง toast `Avatar removed`, กล่องยืนยันปิด และ avatar กลับไปแสดง fallback (alias หรืออักษรย่อ) พร้อมกับปุ่มถังขยะหายไป

---
## TC-PROF-040004 — อัปโหลด/เปลี่ยน logo ของ Business Unit
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`; มีไฟล์รูป PNG/JPEG/WebP ขนาดไม่เกิน 2MB (เคสนี้แก้รูปของ BU `BLAVG` ที่สเปกอื่นเห็นร่วมกัน)
**Steps**
1. ในการ์ด BU มองหากล่อง `Logo` (กรอบแนวนอน) ที่มี hint `PNG, JPG, WebP up to 2MB`
2. กดปุ่ม `Upload Logo` (หรือ `Change Logo` ถ้ามีรูปอยู่แล้ว) แล้วเลือกไฟล์
**Expected**
ปุ่มเปลี่ยนเป็นสถานะกำลังอัปโหลดชั่วคราว จากนั้นแสดง toast `Logo uploaded` และกรอบ logo แสดงรูปใหม่ พร้อมปุ่ม `Remove Logo` ปรากฏขึ้นข้างปุ่มหลัก

---
## TC-PROF-040005 — อัปโหลด/เปลี่ยน avatar ของ Business Unit
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`; มีไฟล์รูปที่ผ่านเกณฑ์
**Steps**
1. ในการ์ด BU มองหากล่อง `Avatar` (กรอบกลม) ที่มี hint ว่าใช้แสดงใน UI เท่านั้น
2. กดปุ่ม `Upload Avatar` (หรือ `Change Avatar`) แล้วเลือกไฟล์
**Expected**
แสดง toast `Avatar uploaded` และกรอบกลมของ BU แสดงรูปใหม่ พร้อมปุ่ม `Remove Avatar` ปรากฏขึ้น — ยืนยันผลจากรูปในการ์ด BU เพราะ toast ใช้ข้อความเดียวกับ avatar ของผู้ใช้

---
## TC-PROF-040006 — ยกเลิกใน AvatarCropDialog แล้วไม่มีการอัปโหลด
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; มีไฟล์รูปที่ผ่านเกณฑ์
**Steps**
1. คลิก avatar แล้วเลือกไฟล์จนกระทั่ง dialog `Adjust your avatar` เปิด
2. กดปุ่ม Cancel
**Expected**
dialog ปิดลง ไม่มี toast `Avatar uploaded` และ avatar ยังเป็นรูปเดิม; เลือกไฟล์เดิมซ้ำได้อีกครั้งแล้ว dialog เปิดใหม่ตามปกติ

---
## TC-PROF-040007 — ออกจากหน้าขณะฟอร์ม dirty ขึ้น DiscardDialog
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. แก้ค่าในช่องใดช่องหนึ่งของฟอร์มโดยยังไม่กด Save
2. กดปุ่มย้อนกลับบน header
3. กดปุ่ม `Keep editing`
4. กดปุ่มย้อนกลับอีกครั้ง แล้วกดปุ่ม `Discard`
**Expected**
ขั้นตอนที่ 2 ขึ้นกล่อง `Discard changes?`; กด Keep editing แล้วยังอยู่ที่ `/profile/setting` และค่าที่แก้ยังอยู่ครบ; กด Discard แล้วนำทางกลับไป `/profile` โดยไม่บันทึกค่าที่แก้

---
## TC-PROF-050001 — เปลี่ยนรหัสผ่านสำเร็จและถูก logout อัตโนมัติ
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินด้วยบัญชีที่เปลี่ยนรหัสผ่านได้โดยไม่กระทบชุดเทสอื่น; อยู่ที่ `/profile/setting`; ทราบรหัสผ่านปัจจุบัน
**Steps**
1. กดปุ่ม Change Password
2. กรอก Current Password, New Password (≥ 8 ตัว มีตัวพิมพ์ใหญ่/เล็ก/ตัวเลข/อักขระพิเศษ และต่างจากรหัสเดิม) และ Confirm Password ให้ตรงกัน
3. กดปุ่ม Change Password ใน dialog
**Expected**
แสดง toast `Password changed successfully` แล้วระบบเรียก logout ทันที ผู้ใช้ถูกพากลับไปหน้า `/login`

---
## TC-PROF-050002 — ลบลายเซ็นผ่าน confirm dialog
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; บัญชีมีลายเซ็นอยู่แล้ว
**Steps**
1. กดปุ่ม `Remove signature` บนการ์ด Signature
2. ยืนยันในกล่อง `Remove signature?`
**Expected**
แสดง toast `Signature removed`, กล่องปิดลง การ์ด Signature กลับไปแสดงข้อความ `Click to choose an image` และปุ่มเปลี่ยนกลับเป็น `Add signature`

---
## TC-PROF-050003 — ลบ logo ของ Business Unit ผ่าน confirm dialog
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`; BU มี logo อยู่แล้ว (เคสนี้ลบรูปจริงของ BU ที่ใช้ร่วมกัน)
**Steps**
1. กดปุ่ม `Remove Logo` ในกล่อง Logo ของการ์ด BU
2. อ่านข้อความในกล่องยืนยันแล้วกดยืนยัน
**Expected**
กล่องยืนยันมีหัวข้อ `Remove logo?` และคำอธิบายที่ระบุชื่อ BU; หลังยืนยันแสดง toast `Logo removed` และกรอบ logo กลับไปเป็นไอคอน placeholder พร้อมปุ่มเปลี่ยนกลับเป็น `Upload Logo`

---
## TC-PROF-050004 — ลบ avatar ของ Business Unit ผ่าน confirm dialog
**Priority:** Low · **Test Type:** CRUD
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile`; BU มี avatar อยู่แล้ว
**Steps**
1. กดปุ่ม `Remove Avatar` ในกล่อง Avatar ของการ์ด BU
2. ยืนยันในกล่อง `Remove avatar?` ที่ระบุชื่อ BU
**Expected**
แสดง toast `Avatar removed` และกรอบกลมของ BU กลับไปเป็นไอคอน placeholder พร้อมปุ่มเปลี่ยนกลับเป็น `Upload Avatar`

---
## TC-PROF-050005 — กด Cancel ใน confirm dialog แล้วรูปยังอยู่ครบ
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
ล็อกอินแล้ว; บัญชีมี avatar และ BU มี logo อยู่แล้ว
**Steps**
1. ที่ `/profile/setting` กดปุ่มถังขยะบน avatar แล้วกด Cancel ในกล่อง `Remove avatar?`
2. ไปที่ `/profile` กดปุ่ม `Remove Logo` แล้วกด Cancel ในกล่อง `Remove logo?`
**Expected**
ทั้งสองกล่องปิดลงโดยไม่มี toast ลบใด ๆ และทั้ง avatar ของผู้ใช้กับ logo ของ BU ยังแสดงรูปเดิมครบ

---
## TC-PROF-100001 — ผู้ใช้ไม่ login เปิด `/profile` ถูก redirect ไป `/login`
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด ไม่มี token ใน store)
**Steps**
1. เปิด `/profile` ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` (แบบ replace) และฟอร์ม login แสดง

---
## TC-PROF-100002 — ผู้ใช้ไม่ login เปิด `/profile/setting` ถูก redirect ไป `/login`
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด)
**Steps**
1. เปิด `/profile/setting` ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` และไม่มีเนื้อหาของฟอร์ม Settings แสดงออกมาก่อนหน้านั้น

---
## TC-PROF-200001 — บันทึกฟอร์มโดยเว้น firstname/lastname ขึ้น error required
**Priority:** High · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. ล้างค่าในช่อง First Name และ/หรือ Last Name ให้ว่าง
2. กดปุ่ม Save บน header
**Expected**
ช่องที่ว่างขึ้น `aria-invalid` พร้อมข้อความ `First Name is required` / `Last Name is required`, หน้าเลื่อนไปที่ช่องแรกที่ผิด และไม่มี toast `Profile updated successfully`

---
## TC-PROF-200002 — ช่อง alias รับได้สูงสุด 2 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. พิมพ์ข้อความยาวกว่า 2 ตัวอักษร (เช่น `ABCD`) ลงในช่อง Alias
2. อ่านค่าที่ค้างอยู่ในช่อง
**Expected**
ช่อง Alias เก็บไว้เพียง 2 ตัวแรก (`AB`) ตาม `maxLength={2}` — ข้อความ validation `Alias max 2 characters` เป็นด่านสุดท้ายของ zod ที่การพิมพ์ผ่าน UI ปกติทริกเกอร์ไม่ถึง

---
## TC-PROF-200003 — เปลี่ยนรหัสผ่าน: new ไม่ตรง confirm ขึ้น error
**Priority:** High · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; เปิด Change Password dialog จาก `/profile/setting`
**Steps**
1. กรอก Current Password ให้ถูกต้อง
2. กรอก New Password และ Confirm Password ที่ผ่านเกณฑ์ความเข้มแต่ไม่ตรงกัน
3. กดปุ่ม Change Password
**Expected**
แสดงข้อความ `Passwords do not match` ใต้ช่อง Confirm Password, dialog ยังเปิดอยู่ และไม่มีการส่งคำขอเปลี่ยนรหัสผ่าน

---
## TC-PROF-200004 — เปลี่ยนรหัสผ่าน: new ไม่ผ่านเกณฑ์ความเข้มขึ้น error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; เปิด Change Password dialog
**Steps**
1. กรอก Current Password ให้ถูกต้อง
2. กรอก New Password ที่สั้นกว่า 8 ตัว หรือไม่มีตัวพิมพ์ใหญ่/ตัวพิมพ์เล็ก/ตัวเลข/อักขระพิเศษ
3. กดปุ่ม Change Password
**Expected**
แสดงข้อความตามเกณฑ์ที่ขาดใต้ช่อง New Password (`Password must be at least 8 characters`, `Must contain at least one uppercase letter`, `Must contain at least one lowercase letter`, `Must contain at least one number`, `Must contain at least one special character`) และไม่มีการส่งคำขอ

---
## TC-PROF-200005 — เปลี่ยนรหัสผ่าน: new ซ้ำกับ current ขึ้น error
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; เปิด Change Password dialog; รหัสผ่านปัจจุบันผ่านเกณฑ์ความเข้มอยู่แล้ว
**Steps**
1. กรอกรหัสผ่านปัจจุบันลงทั้งช่อง Current Password, New Password และ Confirm Password
2. กดปุ่ม Change Password
**Expected**
แสดงข้อความ `New password must be different from current password` ใต้ช่อง New Password และไม่มีการส่งคำขอ

---
## TC-PROF-200006 — เปลี่ยนรหัสผ่าน: เว้นทั้งสามช่องว่างขึ้น error required
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; เปิด Change Password dialog (ฟอร์มถูกรีเซ็ตเป็นค่าว่างทุกครั้งที่เปิด)
**Steps**
1. ไม่กรอกช่องใดเลย
2. กดปุ่ม Change Password
**Expected**
ทั้งสามช่องขึ้นข้อความบังคับกรอก (`Current Password is required` ใต้ช่องแรก, ข้อความเกณฑ์ความยาวใต้ New Password และ `Please confirm your password` ใต้ Confirm Password) และ dialog ยังเปิดอยู่

---
## TC-PROF-200007 — เลือกไฟล์ avatar ผิดชนิดหรือเกิน 2MB ขึ้น toast เตือน
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; เตรียมไฟล์ที่ไม่ใช่ PNG/JPEG/WebP (เช่น .pdf) และไฟล์รูปที่ใหญ่กว่า 2MB
**Steps**
1. คลิก avatar แล้วเลือกไฟล์ที่ไม่ใช่รูปชนิดที่รองรับ
2. คลิก avatar อีกครั้งแล้วเลือกไฟล์รูปที่ใหญ่กว่า 2MB
**Expected**
กรณีแรกขึ้น toast เตือนชนิดไฟล์ (`Logo must be PNG, JPG, or WebP` — เป็นข้อความที่ใช้ร่วมกับ logo) กรณีที่สองขึ้น toast เตือนขนาด (`Logo file must be 2MB or smaller`) ทั้งสองกรณี AvatarCropDialog ไม่เปิดและไม่มีการอัปโหลด

---
## TC-PROF-200008 — อัปโหลดไฟล์ลายเซ็นที่ไม่ผ่านเกณฑ์ขึ้น error ใน dialog
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`; เตรียมไฟล์ที่ไม่ใช่รูปภาพ และไฟล์รูปที่ใหญ่กว่า 2MB
**Steps**
1. เปิด SignatureDialog แล้วไปแท็บ Upload
2. เลือกไฟล์ที่ไม่ใช่รูปภาพ
3. เลือกไฟล์รูปที่ใหญ่กว่า 2MB
**Expected**
แสดงข้อความ error สีแดงใต้กรอบอัปโหลด (`data-testid="signature-upload-error"`) — ชนิดไฟล์ไม่รองรับแจ้งรายการนามสกุลที่รับได้ (JPG, JPEG, PNG, WEBP, GIF) ส่วนไฟล์ใหญ่เกินแจ้งขนาดไฟล์เทียบกับเพดาน 2.0 MB; ไม่มีพรีวิวรูป ปุ่ม Save ยัง disabled และไม่มี toast

---
## TC-PROF-200009 — ช่องข้อความในฟอร์มจำกัดความยาวตาม maxLength
**Priority:** Low · **Test Type:** Validation
**Preconditions**
ล็อกอินแล้ว; อยู่ที่ `/profile/setting`
**Steps**
1. พิมพ์ข้อความยาวเกิน 100 ตัวอักษรลงในช่อง First Name, Middle Name และ Last Name
2. พิมพ์ข้อความยาวเกิน 20 ตัวอักษรลงในช่อง Telephone
**Expected**
ช่องชื่อทั้งสามเก็บได้สูงสุด 100 ตัวอักษร และช่อง Telephone เก็บได้สูงสุด 20 ตัวอักษร ส่วนที่เกินถูกตัดทิ้งที่ระดับ input โดยไม่มีข้อความ validation ขึ้น
