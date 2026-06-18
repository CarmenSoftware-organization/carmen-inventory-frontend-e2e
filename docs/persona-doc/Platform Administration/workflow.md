---
title: Workflow Configuration — Platform Administrator Journey
persona: Platform Administrator
route: /system-admin/workflow
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
changelog:
  - 1.0.0 | 2026-06-17 | Initial draft
---

# Workflow Configuration — Platform Administrator Journey

> Grounded in `routes/system-admin/workflow/` — `wf-component.tsx` (list), `wf-table.tsx` (columns), `wf-filter-options.ts`, `wf-row-actions.tsx`, `wf-new-form.tsx` + `wf-form-schema.ts` (new form), `wf-detail.tsx` (detail), and `wf-validate.ts` (validation), plus `constant/workflow.ts` (`WF_TYPE_CONFIG`).

---

## Purpose / Use Case

The Platform Administrator uses this module to design the **approval workflows** that documents flow through — Purchase Request, Purchase Order and Store Requisition. A workflow has metadata (name, type, description, active flag) and an ordered chain of **stages** that begins with a `Create Request` stage and ends with a read-only `Completed` stage. Each middle stage routes work to either named **assigned users** or the **Head of Department (HOD)**, exposes a set of **actions** (approve / reject / send-back), and carries an SLA. A live **validation panel** keeps the admin from publishing a broken chain.

---

## Screens & Steps

### Screen 1 — Workflow List (`/system-admin/workflow`)

**Purpose:** browse, search, filter and manage workflows. Desktop DataGrid + mobile card grid.

**Columns**

| Column | Description |
|--------|-------------|
| Name | Workflow name; click opens detail. Inactive workflows show a `Lock` icon (tooltip "Inactive"), a line-through name and muted text. |
| Workflow Type | Badge styled by `WF_TYPE_CONFIG` — **Purchase Request** (`purchase_request_workflow`), **Purchase Order** (`purchase_order_workflow`), **Store Requisition** (`store_requisition_workflow`). Opacity reduced to 60% when inactive. |
| Flow | A `WfFlowStrip` visualisation of the workflow's stages (60% opacity when inactive). |
| Updated | Relative time (e.g. "2 hours ago") with the updating username; tooltip shows the absolute datetime + username. |
| _(actions)_ | `⋮` row-actions menu. |

**Header / controls**

| Control | Description |
|---------|-------------|
| Total badge | Secondary badge with the workflow count (shown when > 0). |
| New Workflow | Plus-icon button; navigates to `/system-admin/workflow/new`. |
| SearchInput | Filters by name. |
| StatusFilter | Active (`is_active|bool:true`) / Inactive (`is_active|bool:false`). |
| MultiSelectFilter "Workflow Type" | Multi-select over the three workflow types. |
| ActiveFilterBar | Removable badges for active status + type filters; **Clear all** resets both. |

**Row actions (`⋮`)**

| Action | Description |
|--------|-------------|
| Activate / Deactivate | Shows the *opposite* of the current state (`Power` "Activate" when inactive, `PowerOff` "Deactivate" when active). |
| Duplicate | Creates a copy of the workflow. |
| Delete | Destructive; opens a `DeleteDialog` titled with the workflow name; on confirm shows the `deleteSuccess` toast. |

---

### Screen 2 — New Workflow Form (`/system-admin/workflow/new`)

**Purpose:** create a new workflow shell with default stages.

**Fields**

| Field | Description | Validation |
|-------|-------------|-----------|
| Workflow Name | Text input. | Required — zod `name.min(1)`; `maxLength={100}`. |
| Workflow Type | Select dropdown (Purchase Request / Purchase Order / Store Requisition). Defaults to Purchase Request. | Required — zod `workflow_type.min(1)`. |
| Description | Textarea, optional. | `maxLength` 256. |
| is_active | `StatusSwitch`, defaults to active. | — |
| "Default config" info box | Info note explaining the default stages that will be created. | — |

**Actions / behavior**

- **Create Workflow** → on success shows the `createSuccess` toast and redirects to `/system-admin/workflow/<new id>`. The new workflow is seeded with default stages: **Create Request** (role `create`, submit action) and **Completed** (final, read-only).
- **Cancel** / back arrow → returns to the list.
- Validation errors scroll to and surface under the first invalid field; no success toast.

---

### Screen 3 — Workflow Detail (`/system-admin/workflow/<id>`)

**Purpose:** inspect and edit the full workflow — metadata, stages, routing, products, insights. Opens read-only; **Edit** switches the header to "Edit Workflow" with **Cancel** + **Save Changes**.

**Above the tabs**

- **Validation panel** — summarises issues. Ready state shows a success message; otherwise a destructive/warning panel lists clickable issues with error/warning counts. `isReady` is `true` only when `errorCount === 0`.
- **Workflow diagram** — stage boxes with arrows; clicking a stage jumps to the **Stages** tab with that stage selected.

**Tabs**

| Tab | Description |
|-----|-------------|
| General | Edit Workflow Name (`maxLength` 100), Workflow Type, Description (`maxLength` 256) and the is_active toggle. Save sends `doc_version` with the payload; success → `updateSuccess` toast, exits edit mode. |
| Stages | Stage list + stage detail (count badge). See below. |
| Routing | Routing rules between stages (count badge). |
| Products | Products assigned to the workflow (count badge). |
| Insights | Read-only summary of stage / product / routing counts. |

**Stages tab**

| Element | Description |
|---------|-------------|
| Add Stage | Inserts a new stage **before** `Completed`, auto-selected, with defaults: role `approve`, SLA 24 hours, actions approve/reject/sendback enabled. The Stages tab count badge increments. |
| Delete stage | Available on **middle** stages only (confirmed in an AlertDialog). The **first** (`Create Request`) and **last** (`Completed`, read-only) stages cannot be deleted. |
| Assigned Users | Per-stage sub-tab: search users, **Assign** / **Assign All** / **Assign Filtered**, **Unassign**; a user-count badge tracks `assigned_users`. Ticking **is HOD** clears `assigned_users` and shows a locked "HOD enabled" box — individual user selection is disabled. |

**Save / discard behavior**

- General edits persist with `doc_version`; success → `updateSuccess`.
- Navigating away or cancelling while dirty triggers a `DiscardDialog` (variant `warning`); the unsaved-changes guard also intercepts route changes.

**Validation rules (from `wf-validate.ts`)**

- `no_users_assigned` (error) — a middle, non-HOD stage with no assigned users.
- `no_actions_enabled` (error) — a middle stage with every action disabled.
- Issues raise `errorCount`, set `isReady=false`, and are clickable to jump to the offending stage.

---

## Linked Test Cases

From `docs/test-cases/1103-workflow.md`:

- **List:** TC-WF-010001, TC-WF-010002, TC-WF-010003, TC-WF-010004, TC-WF-010005, TC-WF-010006, TC-WF-010007
- **Detail (view):** TC-WF-020001, TC-WF-020002, TC-WF-020003
- **Create:** TC-WF-030001, TC-WF-030002, TC-WF-030003
- **Edit (General):** TC-WF-040001, TC-WF-040002, TC-WF-040003
- **Delete:** TC-WF-050001, TC-WF-050002
- **Access control:** TC-WF-100001, TC-WF-100002
- **Validation (form):** TC-WF-200001, TC-WF-200002, TC-WF-200003
- **Row actions:** TC-WF-400001, TC-WF-400002
- **Stages & routing:** TC-WF-400003, TC-WF-400004, TC-WF-400005, TC-WF-400006
- **Validation panel:** TC-WF-900001
