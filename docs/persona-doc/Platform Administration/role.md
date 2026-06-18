---
title: Role & Permissions — Platform Administrator Journey
persona: Platform Administrator
route: /system-admin/role
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
changelog:
  - 1.0.0 | 2026-06-17 | Initial draft
---

# Role & Permissions — Platform Administrator Journey

> Grounded in `routes/system-admin/role/` — `role-component.tsx` (list), `use-role-table.tsx` (columns), `role-form.tsx` + `role-form-schema.ts` (form), `permission-picker.tsx` (matrix), and the `new/` + `[id]/` route pages.

---

## Purpose / Use Case

The Platform Administrator uses this module to define **roles** — named permission bundles that are later assigned to users. A role is just two things: a name and a set of granted permissions. Each permission is a `resource.action` pair (e.g. `procurement.purchase_request` + `view`), grouped on screen by category (Configuration, Product Management, Vendor Management, Procurement, Inventory Management, Widgets) and by resource within each category. The admin creates, inspects, edits and deletes roles here; the actual user-to-role binding happens in the User Management module.

---

## Screens & Steps

### Screen 1 — Role List (`/system-admin/role`)

**Purpose:** browse, search and enter the create/view/delete flows for roles. Renders as a desktop DataGrid (and an infinite-scroll card grid on mobile).

**Columns**

| Column | Description |
|--------|-------------|
| _(select)_ | Row selection checkbox (`selectColumn`). |
| _(index)_ | Sequential row number derived from pagination params. |
| Name | Role name; click opens the detail/view page (`/system-admin/role/<id>`). |
| Permissions | Granted-permission count, rendered as `<n> permissions` (from `row.permissions.length`). |
| _(actions)_ | Per-row action menu including Delete. |

**Header / controls**

- **Total badge** — secondary badge next to the title showing `totalRecords.toLocaleString()` (comma-grouped), shown only when there is at least one record.
- **Add button** — `+` icon, top right; navigates to `/system-admin/role/new`.
- **SearchInput** — filters the list by name (fires on submit / Enter).

**Actions**

- Click a Name → open detail (view mode).
- Click Add → new form.
- Row Delete → `DeleteDialog` titled with the role name; on confirm fires the delete mutation and shows the `deleteSuccess` toast.

**Validation / behavior**

- Empty result set renders an empty-state placeholder.
- Load error renders an `ErrorState` with a Retry button.

---

### Screen 2 — Role Detail / View (`/system-admin/role/<id>`)

**Purpose:** read-only inspection of a role, and the entry point to edit or delete it. Opens in `view` mode.

**Key regions**

| Region | Description |
|--------|-------------|
| Hero | Shows the role name; in view mode exposes **Edit** and **Delete** buttons (Delete is shown only in view when a role exists). |
| Stat tiles (3) | **Permissions** = count of currently-selected permissions (`selectedPermissionCount`); **Categories** = number of catalog categories; **Resources** = number of catalog resources. |
| Permission matrix | One matrix per category. Columns are the actions: `view`, `create`, `update`, `delete`, plus extended actions `view_department`, `view_all`, `execute`, `commit`, `manage_bu`. A granted permission renders a checked box; a resource that has no such action renders `—`; in view mode every checkbox is disabled. |

**Actions**

- **Edit** → switches the form to `edit` mode.
- **Delete** (Hero) → `DeleteDialog`; on confirm shows `deleteSuccess` toast and navigates back to `/system-admin/role`.

---

### Screen 3 — Role Form: New & Edit (`/system-admin/role/new`, edit mode of detail)

**Purpose:** create a new role or modify an existing one. New opens in `add` mode (empty); editing an existing role opens in `edit` mode.

**Fields**

| Field | Description | Validation |
|-------|-------------|-----------|
| Name | Single-line text input for the role name (`application_role_name`). | Required — zod `application_role_name.min(1)` → error `Name is required`; `maxLength={100}` on the input. |
| Permissions | The `PermissionPicker` — a searchable, filterable matrix of all catalog permissions, grouped by category and resource. | Optional (can save a role with zero permissions). |

**Permission picker controls**

- **Search box** — filters the matrix to categories/resources whose label matches the query; an `X` button clears it; no match shows a "No match" empty state.
- **Filter pills** — `Show All` / `Show Granted` (resources with ≥1 selected action) / `Show Missing` (resources not fully granted).
- **Grant All** — a per-category header checkbox that selects/clears every permission in that category.
- **Column header toggle** — clicking an action column header (e.g. `View`) selects that action across every applicable resource in the category; clicking again clears the whole column. A `on/applicable` counter sits under each header.
- **Resource row checkbox** — selects/clears all actions for one resource.
- **Change preview** — in edit mode a `<n> pending` indicator summarises added + removed permissions.

**Save behavior**

- **Create (`add`)** sends `permissions: { add: [...] }`; on success shows the `createSuccess` toast and navigates to `/system-admin/role`.
- **Update (`edit`)** computes the diff against the original permission set and sends `permissions: { add, remove }` plus the loaded `doc_version` (required for optimistic-concurrency); on success shows the `updateSuccess` toast and navigates to the list.
- **Cancel / Back while dirty** triggers a `DiscardDialog` (variant `warning`); confirming discard resets the form to its loaded values (edit) or leaves to the list (add).

---

## Linked Test Cases

From `docs/test-cases/1101-role.md`:

- **List:** TC-ROLE-010001, TC-ROLE-010002, TC-ROLE-010003, TC-ROLE-010004, TC-ROLE-010005, TC-ROLE-010006
- **Detail / view:** TC-ROLE-020001, TC-ROLE-020002, TC-ROLE-020003
- **Create:** TC-ROLE-030001, TC-ROLE-030002, TC-ROLE-030003, TC-ROLE-030004
- **Edit:** TC-ROLE-040001, TC-ROLE-040002, TC-ROLE-040003, TC-ROLE-040004
- **Delete:** TC-ROLE-050001, TC-ROLE-050002, TC-ROLE-050003
- **Access control:** TC-ROLE-100001, TC-ROLE-100002
- **Validation:** TC-ROLE-200001, TC-ROLE-200002
- **Permission picker:** TC-ROLE-400001, TC-ROLE-400002, TC-ROLE-400003
