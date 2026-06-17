---
title: User Management — Platform Administrator Journey
persona: Platform Administrator
route: /system-admin/user
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
changelog:
  - 1.0.0 | 2026-06-17 | Initial draft
---

# User Management — Platform Administrator Journey

> Grounded in `routes/system-admin/user/` — `user-component.tsx` (list), `use-user-table.tsx` (columns), and the `[id]/` "User Assign" detail (`user-assigned-form.tsx`, `user-assigned-roles.tsx`, `user-assigned-departments.tsx`, `user-assigned-locations.tsx`). **There is no `new/` page — users are not created here, only assigned access.**

---

## Purpose / Use Case

The Platform Administrator uses this module to manage the **access of existing users**. The detail page is titled **"User Assign"**: it is where the admin grants/removes **roles**, reviews **department** membership (read-only) and assigns the **locations** the user may operate at. The list provides browse, search and department filtering, plus the entry point to the assign page and a delete action. Because there is no create/invite screen, "creating" in this module means assigning access to a person who already exists.

---

## Screens & Steps

### Screen 1 — User List (`/system-admin/user`)

**Purpose:** browse, search and filter users; open the assign page; delete a user. Desktop DataGrid + mobile card grid.

**Columns**

| Column | Description |
|--------|-------------|
| Name | `firstname lastname`; click opens the assign detail page. |
| Email | The user's email address. |
| Department | `code — name` (falls back to name only when no code). |
| _(actions)_ | Per-row Delete action. |

**Header / controls**

| Control | Description |
|---------|-------------|
| Total badge | Secondary badge with `totalRecords.toLocaleString()` (shown when > 0). |
| SearchInput | Filters by name or email (debounced `onSearch`). |
| Department filter | `StatusFilter` with placeholder "Department"; options are departments as `code - name`. |
| ActiveFilterBar | Shows the active department filter as a removable badge; supports clear-all (`clearAllFilters` → `setFilter("")`). |
| Export / Print | Both **disabled** with a "Coming soon" tooltip (also surfaced in the mobile overflow menu). |

**Actions / behavior**

- Click a Name → open `/system-admin/user/<id>`.
- Row Delete → `DeleteDialog` titled "Delete User", confirmation text interpolates `firstname lastname`; on confirm shows the `deleteSuccess` ("User deleted successfully") toast.
- No-match search renders an empty-state placeholder.

---

### Screen 2 — User Assign Detail (`/system-admin/user/<id>`)

**Purpose:** view and edit a user's role / location assignments. Opens read-only ("User Assign"); **Edit** switches to "Edit Assignment".

**Hero**

| Field | Description |
|-------|-------------|
| Avatar | Gradient avatar seeded from the user id, showing initials. |
| Name | `firstname lastname`. |
| Email | The user's email. |
| Username | Rendered as `@username`. |
| Status badge | `● Active` (success-light). |

**Stat tiles (3)**

| Tile | Description |
|------|-------------|
| Roles | Count of assigned roles (selected count in edit, `initialRoleIds.length` in view). |
| Departments | `(memberDepartment ? 1 : 0) + hodDepartments.length`. |
| Locations | Count of assigned location keys (`locationTargetKeys` / `initialLocationKeys`). |

**Sections**

| Section | Description | Editable? |
|---------|-------------|-----------|
| Assign Roles | Toggleable role cards (Shield / ShieldCheck icon, role name + description). Checked cards send to the `add` diff, unchecked to `remove`. Empty state when no roles exist: title "No roles available", desc "Create roles in System Admin first". | Yes (edit mode) |
| Departments | **Member of** (primary department as `code · name` or "No primary department") and **Head of Department** (HOD list with an `HOD` count badge, or "Not a head of any department"). Empty state: "Not assigned". | No — read-only |
| Locations | **View:** locations grouped by type (Inventory / Direct / Consignment) with per-type count badges and filter chips (`All` + type chips). **Edit:** a two-pane `Transfer` titled "Available Locations" / "Assigned Locations" that produces a new `targetKeys` set. Empty state (view): "No locations assigned". | Yes (edit mode — Transfer) |

**Actions / behavior**

- **Edit** (Pencil) → "Edit Assignment" with **Cancel** (X) and **Save**.
- **Save** computes role add/remove diffs and location target diffs. If **no changes** are detected it returns to view with **no API call and no toast**. On a real change it shows the **"User updated successfully"** toast and navigates to `/system-admin/user`.
- **Cancel / Back while dirty** (role or location changed) triggers a `DiscardDialog` (variant `warning`).
- An invalid / unknown user id renders an `ErrorState` ("User not found") instead of crashing.

---

## Linked Test Cases

From `docs/test-cases/1102-user.md`:

- **List:** TC-USR-010001, TC-USR-010002, TC-USR-010003, TC-USR-010004, TC-USR-010005, TC-USR-010006, TC-USR-010007, TC-USR-010008
- **Assign detail (view):** TC-USR-020001, TC-USR-020002, TC-USR-020003, TC-USR-020004, TC-USR-020005
- **Assign edit (roles / locations):** TC-USR-040001, TC-USR-040002, TC-USR-040003, TC-USR-040004, TC-USR-040005, TC-USR-040006
- **Delete:** TC-USR-050001, TC-USR-050002
- **Access control:** TC-USR-100001, TC-USR-100002
- **Negative / edge:** TC-USR-200001, TC-USR-400001, TC-USR-400002
