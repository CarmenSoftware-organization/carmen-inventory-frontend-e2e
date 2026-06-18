---
title: Report Centre — Browse, Run, Schedule and Review Reports
persona: Any Authenticated User
route: routes/report
url: /report, /report/list, /report/schedules, /report/history
status: Draft
parent: INDEX.md
version: 1.0.0
last_updated: 2026-06-17
---

# Report Centre — Browse, Run, Schedule and Review Reports

## Purpose / Use Case

The Report centre is where a signed-in user **finds a report template, supplies its
parameters, and runs it**. It is organised as an editorial landing page (`/report`) with
three chapters, each linking to a sub-page:

- **Chapter 01 -> `/report/list`** — browse report templates.
- **Chapter 02 -> `/report/schedules`** — manage scheduled (recurring) runs.
- **Chapter 03 -> `/report/history`** — review past runs.

"Export" here means **Run**: filling the parameter dialog and pressing **Run Report**
generates the output and opens the **result in a new browser tab** (the toast carries an
**Open** button). There is no inline file download from the dialog itself.

A user comes here to locate a report (search / group filter / list-vs-grid view), open
its parameter dialog (fields are built dynamically from the template's XML), and run it —
or to check what has been scheduled and what has already run.

---

## Screens & Steps

### Screen 1 — Report landing (`/report`)

**Purpose:** Orient the user and route them into the three report sub-areas.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Hero | Title, lede, and a three-marker index | — | Editorial intro to the module |
| Chapter 01 (Menu) | CTA into the report list | Click CTA -> `/report/list` | — |
| Chapter 02 (Schedules) | CTA into schedules | Click CTA -> `/report/schedules` | — |
| Chapter 03 (History) | CTA into run history | Click CTA -> `/report/history` | — |

### Screen 2 — Report list (`/report/list`)

**Purpose:** Let the user find and open a report template.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Title + count badge | "Report" heading with a count of filtered reports | — | Count reflects reports passing the current filter on this page |
| SearchInput | Keyword search | Type -> press Enter | Search is sent to the backend (server-side); list updates to matches. Fires on Enter |
| ReportGroupFilter | Filter by report group | Open -> select groups | Client-side filter on the current page; updates the `groups` URL param |
| View toggle | Switch list <-> grid | Click Grid / List | Swaps between DataGrid table and card grid (desktop) |
| Report row / card | A report template | Click -> opens ReportParamDialog | — |
| Empty state | Shown when no reports match | — | Placeholder instead of crashing |

### Screen 3 — Report parameter dialog (overlay on list)

**Purpose:** Collect the parameters a report needs, then run it.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Dialog title | The selected report's name | — | — |
| Dynamic fields | Built from the template's Dialog XML | Fill in | `lookup` -> select, `date` -> date picker, `range` -> from/to pair, with correct labels |
| Date defaults | Keyword-resolved defaults | — | Keywords (`Today`, `FirstDayOfMonth`, `@current_period`, etc.) resolve to real dates via `resolveDateKeyword` |
| No-parameters notice | Shown when the XML has no fields | — | `noFiltersConfigured` message; Run Report still available |
| Run Report button | Generate the report | Click -> run | Success: loading toast -> ready toast, result opens in a new tab, toast has an **Open** button. Failure: pre-opened tab is closed and a `runError` toast appears |

### Screen 4 — History (`/report/history`)

**Purpose:** Let the user review and re-access past report runs.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Title + search toolbar | History heading with a search control | Search | — |
| Run history (DataGrid / cards) | Past report runs | — | Empty state when none |

### Screen 5 — Schedules (`/report/schedules`)

**Purpose:** Let the user manage recurring report runs.

| Field / Widget | Description | Actions | Validation / Behaviour |
|----------------|-------------|---------|------------------------|
| Schedules management | List of scheduled report runs | Manage schedules | Renders the schedules page (list or empty state) — must not 404 |

---

## Linked Test Cases

| TC | Title |
|----|-------|
| TC-RPT-010001 | หน้า Report landing โหลดและแสดง 3 chapter |
| TC-RPT-010002 | CTA chapter นำไปหน้าย่อยที่ถูกต้อง |
| TC-RPT-010003 | หน้า Report list โหลดและแสดงรายการ template |
| TC-RPT-010004 | badge นับจำนวน report แสดงค่าถูกต้อง |
| TC-RPT-010005 | สลับมุมมอง list / grid |
| TC-RPT-010006 | ค้นหา report ด้วย SearchInput กรองรายการได้ |
| TC-RPT-010007 | กรองตาม report group ลดรายการที่แสดง |
| TC-RPT-020001 | คลิก report เปิด ReportParamDialog |
| TC-RPT-020002 | dialog สร้างฟิลด์พารามิเตอร์จาก XML (lookup / date / range) |
| TC-RPT-020003 | date field เติมค่าเริ่มต้นจาก keyword (Today/@current_period) |
| TC-RPT-020004 | report ที่ไม่มีพารามิเตอร์แสดงข้อความ noFiltersConfigured |
| TC-RPT-030001 | Run Report สำเร็จและเปิดผลในแท็บใหม่ |
| TC-RPT-030002 | Run Report ล้มเหลวแสดง toast error |
| TC-RPT-040001 | หน้า History โหลดและแสดงประวัติการรัน |
| TC-RPT-040002 | หน้า Schedules โหลดและแสดงตารางเวลา |
| TC-RPT-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login |
