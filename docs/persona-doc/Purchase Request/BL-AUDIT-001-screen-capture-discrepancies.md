# Screen Capture Audit Report

---
**Doc ID:** BL-AUDIT-001
**Title:** Live App Screen Capture — Findings & Observations
**Audit Date:** 2026-04-02
**Auditor:** Claude (automated screen capture)
**App URL:** https://carmen-inventory.vercel.app
**Test User:** requestor@zebra.com (สมชาย (Requestor) ใจดี)
**BU:** ZB01 — ZEBRA (AVG)
**Reference Format:** `page-template.md`, `style-guide.md` from `/blueledgers-docs/references/`

---

## 1. Capture Summary

| Screen | Route | Captured | Notes |
|--------|-------|----------|-------|
| Login | `/` (redirects to Keycloak) | Yes | CARMEN_realm SSO page |
| Dashboard | `/dashboard` | Yes | Landing page after login |
| PR List | `/procurement/purchase-request` | Yes | Singular route (not plural) |
| PR Detail | `/procurement/purchase-request/:uuid` | Yes | UUID-based path, not sequential ID |
| PR Create | `/procurement/purchase-request/create` | Failed | "Failed to fetch purchase request" — requires button nav |
| My Approval | Unknown (404 at `/procurement/my-approval`) | Failed | Sidebar link exists but URL unknown |
| Item Search Modal | N/A (modal) | Not attempted | Requires click inside Create/Edit form |

---

## 2. Environment Observations

| Item | Observed Value |
|------|---------------|
| BU Code | `ZB01` |
| BU Name | ZEBRA (AVG) |
| Department (test user) | Guest Service and Bell Staff |
| User Display Name | สมชาย (Requestor) ใจดี |
| Locale | Mixed Thai/English |
| Date format — Procurement pages | `YYYY-MM-DD` |
| Date format — Dashboard | `DD/MM/YYYY` |
| Currency | THB |
| PR Number format | `PR` + `YYYYMMDD` + `NNN` (e.g. `PR20260400019`) |

---

## 3. Navigation Structure

### 3.1 Sidebar — Dashboard context

When on `/dashboard`, the sidebar shows only:
- Dashboard

### 3.2 Sidebar — Procurement context

When inside the Procurement module, the sidebar shows:

| Item | Icon | Notes |
|------|------|-------|
| **Procurement** (header) | Cart icon | Group heading |
| My Approval | — | Separate from Purchase Request list |
| Purchase Request | — | Highlighted when active |
| Purchase Request Template | — | No doc exists |
| Purchase Order | — | No doc exists |
| Goods Receive Note | — | No doc exists |
| Credit Note | — | No doc exists |

### 3.3 Top Bar (global)

| Element | Position | Description |
|---------|----------|-------------|
| CARMEN logo + "Hospitality Supply Chain" | Top-left | App branding |
| Breadcrumb | Below top bar | e.g. "Procurement > Purchase Request" |
| BU selector | Top-right | "ZB01 - ZEBRA (AVG)" with dropdown |
| User profile | Far-right | Display name + department + avatar |
| Settings icons | Top-right area | Grid, globe, font-size, gear, bell icons |

---

## 4. Dashboard — Observations (mapped to page-template.md)

**Route:** `/dashboard`
**Breadcrumb:** Dashboard

### 4.1 Purpose
Landing page after login. Shows the user's pending documents and items awaiting their approval across all procurement document types.

### 4.2 Screen Layout

```
[Greeting Header — "Good Evening, {display_name}"]
[Context — "{BU_NAME} ({cluster}) · {department}"]
────────────────────────────────────────────
[My Pending — 3 summary cards]
────────────────────────────────────────────
[Pending My Approval — total count badge]
  ├─ Purchase Requests [count] — table
  ├─ Purchase Orders — table or "No data found"
  └─ Store Requisitions [count] — table
```

### 4.3 My Pending Section

Three horizontal cards:

| Card | Icon | Fields |
|------|------|--------|
| Purchase Requests | Document icon (blue) | `{count}` pending |
| Purchase Orders | Cart icon (red) | `{count}` pending |
| Store Requisitions | Box icon (teal) | `{count}` pending |

### 4.4 Pending My Approval Section

Header: "Pending My Approval" with info icon (ⓘ) + total count badge (e.g. 28)

Sub-tables grouped by document type. Each has a colored left-border and count badge.

**Columns per sub-table:**

| Column | Description |
|--------|-------------|
| Document | PR number as link (e.g. `PR20260400010`) or draft ID (e.g. `draft-0bb1a9`) |
| Requester | User display name |
| Department | Department name |
| Stage | Current workflow stage (e.g. "Create Request") |
| Date | Date in DD/MM/YYYY format |

**Observed document types:** Purchase Requests (orange border), Purchase Orders (red border), Store Requisitions (teal border)

### 4.5 Business Logic Questions

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | Why does a Requestor see "Pending My Approval" with 28 items? Are these items the requestor themselves needs to act on (e.g. re-submit drafts)? | Determines if "Pending My Approval" means pending the current user's action (regardless of role) or specifically approval-queue items |
| 2 | What does "draft-0bb1a9" format mean for the Document column? Is this an unsaved/auto-saved PR? | Affects how draft IDs are documented |
| 3 | Are the "My Pending" counts clickable? Do they navigate to a filtered list? | Navigation behavior |

---

## 5. PR List — Observations (mapped to page-template.md)

**Route:** `/procurement/purchase-request`
**Breadcrumb:** Procurement > Purchase Request

### 5.1 Purpose
Main list screen for managing Purchase Requests. Shows a paginated, filterable table of PRs.

### 5.2 Screen Layout

```
[Page Title: "● Purchase Request {count}" + subtitle]
[Export] [Print] [+ Add Request]
────────────────────────────────────────────
[Search box] [My pending | All Documents] [All Stage ▾]
                                    [Filter] [View toggles: table|list|grid]
────────────────────────────────────────────
[Data Table]
────────────────────────────────────────────
[Showing X–Y of Z] [Rows: {n} ▾] [« ‹ 1 2 › »]
```

### 5.3 Header / Toolbar

| Element | Type | Description |
|---------|------|-------------|
| Page title | Text + badge | "● Purchase Request" with green dot indicator + count badge (e.g. "11") |
| Subtitle | Text | "Manage purchase requests for your business." |
| Export | Button (secondary) | Download icon + "Export" |
| Print | Button (secondary) | Printer icon + "Print" |
| + Add Request | Button (primary blue) | Creates new PR — navigates to Create form |

### 5.4 Search & Filter

| Control | Type | Position | Description |
|---------|------|----------|-------------|
| Search | Text input | Left | Placeholder: "Search..." with magnifying glass icon |
| My pending | Tab button (blue when active) | Center | Filters to user's own pending PRs — **active by default** |
| All Documents | Tab button | Center | Shows all PRs the user has permission to see |
| All Stage | Dropdown | Center-right | Filters by workflow stage |
| Filter | Button with icon | Right | May reveal advanced filter panel (not expanded during capture) |
| View toggle | 3 icon buttons | Far-right | Table / List / Grid view options |

### 5.5 Column Definitions (Table View)

| Column | Label in UI | Sortable | Description |
|--------|------------|----------|-------------|
| (checkbox) | — | — | Row selection checkbox |
| # | "#" | — | Row number in current page |
| PR No. | "PR No." | Yes (▲▼) | System-generated PR number, displayed as blue link |
| Date | "Date" | Yes (▲▼) | PR creation date, format: YYYY-MM-DD |
| Type | "Type" | — | PR type (e.g. "Asset") |
| Stage | "Stage" | — | Current workflow stage (e.g. "Create Request") |
| Status | "Status" | — | Status badge: IN PROGRESS (yellow) |
| Requester | "Requester" | — | User who created the PR |
| Department | "Department" | — | Requesting department |
| Total Amount | "Total Amount" | — | PR total in transaction currency (right-aligned) |
| Currency | "Currency" | — | Transaction currency code (e.g. "THB") |
| (actions) | "..." | — | Row-level action menu (three-dot icon) |

### 5.6 Pagination

| Element | Description |
|---------|-------------|
| Info text | "Showing 1–10 of 11" |
| Rows per page | Dropdown, default: 10. Label: "Rows" |
| Page navigation | « (first) ‹ (prev) [1] [2] (page numbers) › (next) » (last) |

### 5.7 Document Status Badges (observed)

| Status | Badge Color | Badge Text |
|--------|------------|------------|
| IN PROGRESS | Yellow/gold | `IN PROGRESS` |

(Only IN PROGRESS observed in test data — draft, approved, etc. not observed.)

### 5.8 Business Logic Questions

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | What are all possible values for the "Type" column? Only "Asset" was observed. | Needs complete enumeration for docs |
| 2 | What are all possible values for the "Stage" column? Only "Create Request" observed. | Needs complete enumeration |
| 3 | What row-level actions appear in the "..." menu? (Edit, Delete, View, etc.) | Cannot click to inspect — needs verification |
| 4 | Does the Filter button open an advanced filter panel? What filters are available? | Only basic filters visible |
| 5 | Does clicking a PR No. link navigate to the Detail page or open a sidebar? | Navigation behavior |

---

## 6. PR Detail — Observations (mapped to page-template.md)

**Route:** `/procurement/purchase-request/{uuid}`
**Breadcrumb:** Procurement > Purchase Request
**Observed PR:** PR20260400019 (Status: IN PROGRESS)

### 6.1 Purpose
Read/edit view of a saved Purchase Request. Displays header info, line items, workflow progress, and action buttons.

### 6.2 Screen Layout

```
[← PR20260400019  IN PROGRESS]          [Edit] [Comment]
────────────────────────────────────────────
[Date]         [Requester]       [Department]
[Workflow *]
[Description]
────────────────────────────────────────────
[✅ Purchase > ② Create Request > 3 HOD]     ← Workflow progress
────────────────────────────────────────────
[Items | Workflow History]                    ← Tabs
────────────────────────────────────────────
[Line Items Table]
────────────────────────────────────────────
[Subtotal | Discount | Net | Tax | Total]   [Submit ▶]
```

### 6.3 Header Information

| Field | Label in UI | Value Observed | Editable | Notes |
|-------|------------|----------------|----------|-------|
| PR Number | (inline with back arrow) | PR20260400019 | No | Displayed next to ← back arrow, with status badge |
| Status | (badge) | IN PROGRESS | No | Yellow badge, inline with PR number |
| Date | "Date" | 2026-04-02 | No | Format: YYYY-MM-DD |
| Requester | "Requester" | สมชาย (Requestor) ใจดี | No | Note: UI says "Requester" not "Requestor" |
| Department | "Department" | Guest Service and Bell Staff | No | |
| Workflow | "Workflow *" | Asset | Dropdown | Marked mandatory (*), shown as dropdown even on detail view |
| Description | "Description" | (empty) | Textarea | Placeholder: "Enter description...", char counter: 0/256 |

**Not observed on screen:** Note field, Currency header field

### 6.4 Workflow Progress Indicator

A horizontal breadcrumb-style bar below the header fields:

```
✅ Purchase  >  ② Create Request  >  3 HOD
```

| Stage Position | Visual | Meaning |
|---------------|--------|---------|
| Completed | Green checkmark (✅) + stage name | Stage has been passed |
| Current | Blue numbered circle (②) + stage name in bold | Currently at this stage |
| Future | Gray number + stage name | Not yet reached |

Stages are separated by `>` arrow characters.

### 6.5 Tabs

| Tab | Label | Content |
|-----|-------|---------|
| Items | "Items" | Line items table (default active) |
| Workflow History | "Workflow History" | Approval action log |

(Workflow History tab content was not captured — would require clicking the tab.)

### 6.6 Action Buttons

| Button | Position | Color / Type | Visibility (observed) | Description |
|--------|----------|-------------|----------------------|-------------|
| ← (Back) | Top-left, before PR number | Icon only | Always | Navigates back to PR List |
| Edit | Top-right | Blue outline | **Visible on IN PROGRESS** | Opens edit mode |
| Comment | Top-right | Blue outline with icon | Visible on IN PROGRESS | Opens comment functionality |
| Submit | Bottom-right | Blue primary with ▶ icon | Visible on IN PROGRESS | Submits PR to next approval stage |

**Questions:** Is the Edit button on IN PROGRESS intentional? Does it allow the requestor to modify after submission, or is this a bug?

### 6.7 Line Items Grid — Detail / Grid Information

**Grid header:** "Items" (section title within Items tab)

| Column | Label in UI | Description | Notes |
|--------|------------|-------------|-------|
| # | "#" | Row sequence number | |
| Location | "Location" | Location code + name (e.g. "1AG02 — IT") | Dropdown selector |
| Product | "Product" | Product code + name (e.g. "11140012 — Dried R...") | Dropdown selector + ⚙ gear icon |
| Status | "Status" | Per-line approval status | PENDING (yellow) / APPROVED (green) badge |
| Requested | "Requested" | Requested qty + unit together (e.g. "2 KG") | Two sub-fields: qty (numeric) + unit (text) |
| Approved | "Approved" | Approved qty + unit (e.g. "2 KG") | Two sub-fields: qty (numeric) + unit (text) |
| FOC | "FOC" | Free of Charge quantity | Numeric value (e.g. "0"), with unit label |
| Amount | "Amount" | Line total in transaction currency | Numeric (e.g. "0.00", "32.10") |
| Currency | "Currency" | Currency code | Dropdown (e.g. "THB") |
| Delivery Point | "Delivery Point" | Hotel delivery point | Dropdown (e.g. "Main") |
| Delivery Date | "Delivery Date" | Required delivery date | Date picker, format: YYYY-MM-DD |
| Comment | "Comment" | Per-row comment | Text field with char counter (0/256) |

**Observed line items:**

| Row | Location | Product | Status | Requested | Approved | FOC | Amount | Delivery Date |
|-----|----------|---------|--------|-----------|----------|-----|--------|--------------|
| 1 | 1AG02 — IT | 11140012 — Dried R... | PENDING | 2 KG | 2 KG | 0 KG | 0.00 | 2026-04-02 |
| 2 | 1AG01 — A&G-Accounting | 44070011 — LG 240... | APPROVED | 3 PCS | 3 PCS | 0 PCS | 32.10 | 2026-04-03 |

### 6.8 Summary Information (Footer Bar)

A horizontal bar fixed at the bottom of the page:

| Field | Label in UI | Value Observed | Notes |
|-------|------------|----------------|-------|
| Subtotal | "Subtotal" | 30.00 | One word (not "Sub-Total") |
| Discount | "Discount" | 0.00 | |
| Net | "Net" | 30.00 | **New field** — not in template |
| Tax | "Tax" | 2.10 | Label is "Tax" (not "Tax (VAT)") |
| Total | "Total" | 32.10 THB | Includes currency code after amount |

**Calculation:** Net = Subtotal − Discount; Total = Net + Tax

### 6.9 Business Logic Questions

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | Is the Edit button on IN PROGRESS intentional? Can a requestor edit after submission? | Critical for documenting button visibility rules |
| 2 | What does per-line-item PENDING / APPROVED status mean? Who approves individual items? | Major undocumented feature — implies item-level approval |
| 3 | Can the "Approved" quantity differ from "Requested" (partial approval)? | Affects line item business logic significantly |
| 4 | What does the ⚙ gear icon next to Product do? | Unknown action |
| 5 | What does the Comment button (top bar) do? Open a side panel, modal, or inline comment? | UI behavior |
| 6 | Is the Description field editable on IN PROGRESS, or is it read-only here? It shows a textarea with placeholder. | Determines if this is truly a "detail/view" screen or also editable |
| 7 | What is the relationship between the "Workflow" dropdown value ("Asset") and the "Type" column on the List page ("Asset")? Are they the same field? | Clarifies data model |

---

## 7. Error Pages Observed

### 7.1 404 — Page Not Found

**Trigger:** Direct URL to `/procurement/my-approval`

| Element | Value |
|---------|-------|
| Title | "404 - Page Not Found" |
| Message | "The page you are looking for does not exist." |
| Action link | "Go to Dashboard" |
| Layout | No sidebar, dark blue header bar, centered content |

### 7.2 Failed to Fetch

**Trigger:** Direct URL to `/procurement/purchase-request/create`

| Element | Value |
|---------|-------|
| Icon | Red circle with exclamation mark (⊘) |
| Message | "Failed to fetch purchase request" |
| Action button | "Retry" with refresh icon |
| Layout | Full page with sidebar intact, error centered in content area |
| Breadcrumb | Procurement > Purchase Request > Create |

---

## 8. Screens Not Captured — Follow-Up Needed

| Screen | Reason | How to Capture |
|--------|--------|----------------|
| PR Create / Edit Form | Direct URL fails; requires "+ Add Request" button click | User navigates manually, then screenshot |
| Item Search Modal | Only appears inside Create/Edit form when clicking "Add Item" | Requires Create form first |
| My Approval page | Unknown route; sidebar link needed | User clicks "My Approval" in sidebar |
| Workflow History tab | Requires clicking "Workflow History" tab on PR Detail | User clicks tab |
| HOD view | Requires login as hod@zebra.com | User logs in as HOD |
| Purchase Officer view | Requires login as purchase@zebra.com | User logs in as Purchase |
| FC / GM / Owner views | Requires login as fc/gm/owner @zebra.com | User logs in per role |
| PR Sidebar Approval | Unknown trigger | Needs investigation |
| PR Full Page Approval | Unknown route | Needs investigation |
| Purchase Request Template | No existing doc | User navigates to this page |
| Purchase Order | No existing doc | User navigates to this page |
| Goods Receive Note | No existing doc | User navigates to this page |
| Credit Note | No existing doc | User navigates to this page |

---

## 9. Consolidated Business Logic Questions

These questions must be answered before the documentation can be finalized. Grouped by priority.

### P0 — Blocking (affects page structure)

| # | Question | Context |
|---|----------|---------|
| 1 | Is the Edit button on an IN PROGRESS PR intentional? | Observed on PR Detail for PR20260400019 |
| 2 | What does per-line-item PENDING / APPROVED status represent? Who sets it? | Observed on line items in PR Detail |
| 3 | Can Approved qty differ from Requested qty (partial approval)? | Implies significant workflow feature |
| 4 | Is the Description field editable on the PR Detail page when status is IN PROGRESS? | Textarea with placeholder was visible |

### P1 — Important (affects content completeness)

| # | Question | Context |
|---|----------|---------|
| 5 | What does the ⚙ gear icon next to Product do on line items? | Unknown action button |
| 6 | What does the Comment button (top-right) do on PR Detail? | New feature not in old docs |
| 7 | What are all possible "Type" values? (Only "Asset" observed) | PR List Type column |
| 8 | What are all possible "Stage" values? | PR List Stage column |
| 9 | Why does a Requestor see "Pending My Approval" with 28 items on Dashboard? | Business logic question |
| 10 | What does "draft-0bb1a9" format mean in the Dashboard Document column? | Draft ID format |

### P2 — Clarification (improves accuracy)

| # | Question | Context |
|---|----------|---------|
| 11 | Is "Workflow" dropdown value ("Asset") the same as "Type" column on PR List? | Data model relationship |
| 12 | What row-level actions appear in the "..." menu on PR List? | Could not click to inspect |
| 13 | What filters are available behind the "Filter" button on PR List? | Advanced filter panel not expanded |
| 14 | What is the correct route for "My Approval"? | 404 when accessed directly |

---

*This report documents live observations only. No comparison against prior documentation was made — old docs are being discarded. All new documentation will be written from scratch using the reference templates in `/blueledgers-docs/references/` and the findings in this report.*
