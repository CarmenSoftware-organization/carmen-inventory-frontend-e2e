---
title: Profile & Settings — View and Manage My Account
persona: Any Authenticated User
route: routes/profile
url: /profile, /profile/setting
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Profile & Settings — View and Manage My Account

## Purpose / Use Case

The Profile area is where a signed-in user **reviews and maintains their own account**.
It is split across two routes:

- **`/profile`** — a **read-only** view: a hero (avatar, full name, platform role, email,
  phone), a **Personal Information** section, and a **Business Units** section rendered as
  **Tabs** (one tab per BU the user belongs to). Switching BU is done through these tabs —
  it is a per-BU view inside the profile page, not a global BU switch.
- **`/profile/setting`** — an **editable** form: personal info (firstname/lastname required,
  alias capped at 2 characters), avatar upload/crop/remove, and a Change Password dialog.
  Every save, upload, and delete confirms with a toast.

A user comes here to confirm their details are correct, refresh their avatar, switch
between the business units they belong to, or rotate their password (which logs them out
on success).

---

## Screens & Steps

### Screen 1 — Profile view (`/profile`)

**Purpose:** Let the user review their identity, personal fields, and each business unit.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Hero — avatar | Profile picture, ringed | — | Shows `avatar_url`; falls back to alias/initials when absent. Avatar root is remounted on `avatar_url` change so a deleted avatar surfaces the fallback |
| Hero — name + role | Full name (firstname + middlename + lastname) and `platform_role` badge | — | Role rendered as a `primary-light` badge |
| Hero — contact | Email and telephone | — | Phone shown only when present |
| Edit Profile button | Links to Settings | Click → `/profile/setting` | — |
| Personal Information | firstname, middlename, lastname, alias | — | Empty values render as `-` |
| Business Units (Tabs) | One `TabsTrigger` per BU; first tab selected by default | Click a tab → swaps shown BU detail | Empty list shows a "no business units" message |
| BU tab content | Per-BU: logo/avatar (upload/remove), code, alias, department, system level, tax/branch no, plus hotel/company sub-sections | Upload/Change logo or avatar; Remove (with confirm) | Badges: `HQ` when `config.is_hq`, `Inactive` when not active, `Default` beside the code when `is_default`. Hotel/Company sub-sections (name, tel, email, address) appear only when configured. Upload/remove confirm with toast |

### Screen 2 — Settings — Personal info form (`/profile/setting`)

**Purpose:** Edit personal details and manage the user's own avatar.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| firstname | Required text field | Edit | `z.string().min(1)` — required error when blank; blocks submit |
| lastname | Required text field | Edit | `z.string().min(1)` — required error when blank; blocks submit |
| middlename | Optional text field | Edit | No constraint |
| telephone | Optional text field | Edit | No constraint |
| alias_name | Short alias | Edit | `z.string().max(2)` — error when longer than 2 characters |
| Save button | Persist the form | Click → save | On success: toast + form resets to saved values |
| Avatar control | Click to pick a file → AvatarCropDialog | Upload + crop → confirm; trash → AlertDialog confirm to remove | Upload shows preview then success toast and updated avatar; remove shows toast and reverts to initials fallback |

### Screen 3 — Change Password dialog (overlay on Settings)

**Purpose:** Let the user rotate their password securely.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| current_password | Existing password | Enter | Required (`min(1)`) |
| new_password | New password | Enter | `min(8)` + must contain uppercase, lowercase, number, and special char; must differ from current |
| confirm_password | Re-type new password | Enter | Must match `new_password` (mismatch error on this field) |
| Confirm button | Submit the change | Click → change password | On success: toast, then automatic logout back to `/login`. On validation failure no request is sent |

---

## Linked Test Cases

| TC | Title |
|----|-------|
| TC-PROF-010001 | หน้า Profile โหลดและแสดงข้อมูลผู้ใช้ |
| TC-PROF-010002 | hero แสดง avatar / ชื่อ / role / email |
| TC-PROF-010003 | section Personal Information แสดงครบทุกฟิลด์ |
| TC-PROF-010004 | section Business Units แสดงเป็น Tabs ตามจำนวน BU |
| TC-PROF-020001 | สลับ tab Business Unit แล้วเปลี่ยนข้อมูล BU ที่แสดง |
| TC-PROF-020002 | tab BU แสดง badge HQ / Inactive / Default ตามสถานะ |
| TC-PROF-020003 | tab BU แสดงข้อมูล hotel / company เมื่อมี |
| TC-PROF-030001 | ปุ่ม Edit Profile นำไปหน้า Settings |
| TC-PROF-040001 | แก้ไขข้อมูลส่วนตัวและบันทึกสำเร็จ |
| TC-PROF-040002 | อัปโหลด avatar พร้อมครอปสำเร็จ |
| TC-PROF-040003 | ลบ avatar ผ่าน confirm dialog |
| TC-PROF-040004 | อัปโหลด/ลบ logo หรือ avatar ของ Business Unit |
| TC-PROF-050001 | เปลี่ยนรหัสผ่านสำเร็จและถูก logout อัตโนมัติ |
| TC-PROF-200001 | บันทึกฟอร์มโดยเว้น firstname/lastname ขึ้น error required |
| TC-PROF-200002 | alias เกิน 2 ตัวอักษรขึ้น validation error |
| TC-PROF-200003 | เปลี่ยนรหัสผ่าน: new ไม่ตรง confirm ขึ้น error |
| TC-PROF-200004 | เปลี่ยนรหัสผ่าน: new ไม่ผ่านเกณฑ์ความเข้มขึ้น error |
| TC-PROF-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login |
