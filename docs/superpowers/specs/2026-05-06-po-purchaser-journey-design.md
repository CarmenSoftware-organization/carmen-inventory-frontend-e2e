# PO Purchaser Journey — E2E Test Suite Design

**Date:** 2026-05-06
**Status:** Draft — pending user approval
**Scope:** Playwright persona-journey spec for the PO Purchaser (Purchasing Staff / Buyer) workflow in `carmen-inventory-frontend`
**Source documents:** `docs/persona-doc/Purchase Order/Purchaser/` (INDEX.md + step-01..05.md)

---

## 1. Purpose

The PR persona suite on `main` covers Creator (302), Approver (303), Purchaser (304), and Returned-flow (311) — 104 TCs total. This spec begins the PO persona suite with **`tests/402-po-purchaser-journey.spec.ts`**, covering the Purchaser's experience across 5 screens: PO List → Create PO (3 methods) → PO Detail → Edit Mode → Post-approval (Send to Vendor / Close).

The existing per-action `301-purchase-request.spec.ts` and `401-purchase-order.spec.ts` are **not modified** — both per-action specs continue to coexist with the new persona-journey suites.

PO Purchaser is more complex than PR Purchaser for two reasons:
1. **Three creation methods** in Step 2 — Blank, From Price List wizard (2-step), From PR wizard
2. **Post-approval actions** in Step 5 — Send to Vendor, Close PO (with items received → COMPLETED, without → VOIDED), QR code visibility — none of which exist in PR

## 2. Scope

**In scope** — Purchaser persona only (`purchase@blueledgers.com`):
- Step 1 — PO List (browse / search / filter / sort)
- Step 2 — Create PO — all 3 methods (Blank, From Price List wizard, From PR wizard)
- Step 3 — PO Detail (read-only views, item details panel tabs, button visibility per status)
- Step 4 — Edit Mode (modify items, save, cancel, submit, delete)
- Step 5 — Post-approval (Send to Vendor, Close → COMPLETED/VOIDED) — uses cross-persona setup
- Golden Journey — full Purchaser flow end-to-end with FC approval
- ~32 TCs total

**Out of scope** (deferred or covered elsewhere):
- 401-specific per-action coverage (apply discount, calculate totals, generate PO number, request change order, QR code generation)
- Multi-PR-grouped-into-one-vendor edge cases in From PR wizard — defer
- Backend sequence generation, scheduled jobs — covered by 401 with `SKIP_NOTE_BACKEND`
- PO Approver-side actions (FC) — separate spec `403-po-approver-journey.spec.ts`
- Cleanup of created POs — match 302/303/304/311 convention

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture (`purchaseTest`) |
| `PurchaseOrderPage` | `tests/pages/purchase-order.page.ts` | Existing nav / list / form / status primitives — extended with ~14 new methods |
| `LoginPage` | `tests/pages/login.page.ts` | Used by new `po-approver.helpers.ts` for cross-context login |
| `e2eDescription` | `tests/pages/pr-creator.helpers.ts` | `[E2E-PRC]` marker if any PR seeded |
| `tc-csv-reporter` / `tc-json-reporter` | `tests/reporters/` | Auto-parse `TC-POP<NNNN>` IDs |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change — standard annotation pattern |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |
| `TEST_USERS` | `tests/test-users.ts` | Canonical: `purchase@blueledgers.com`, `fc@blueledgers.com` |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new persona-journey spec alongside 401; do not modify existing files | Same precedent as 302/303/304/311 |
| 2 | Cover all 3 creation methods in Step 2 (Blank + From Price List + From PR) | All three are primary creation paths the Purchaser uses; coverage is incomplete without each |
| 3 | From PR wizard uses dynamic skip if no approved PR in DB (no 4-step seed chain) | 4-step PR approval seed (`Requestor + HOD + Purchaser + FC` for PR) is overkill; pragmatic skip preserves runtime |
| 4 | Step 5 Post-approval uses cross-context `submitPOAsPurchaser + approveAsFC` chain | Each TC seeds its own Approved PO — state isolation; matches 304 pattern |
| 5 | New `po-approver.helpers.ts` file (separate from `pr-approver.helpers.ts`) | Clean separation between PR helpers (PR-specific) and PO helpers (PO-specific); both files small enough to remain readable |
| 6 | Granularity ~32 TCs (5+12+4+6+4+1) | Larger than PR Purchaser (25) due to 3 creation methods + post-approval-specific actions; smaller than PR Creator (41) which has 8 steps |
| 7 | Per-step `describe` blocks + serial Golden Journey | Mirrors 302/303/304/311 structure |
| 8 | TC prefix `TC-POP` | Distinct from `TC-PO` (401), `TC-PRP` (304); passes `[A-Z]{0,4}` reporter regex |
| 9 | No automatic cleanup | Match 302/303/304/311 convention |

## 5. Architecture

### File layout
```
tests/
  402-po-purchaser-journey.spec.ts      ← new spec (~32 TCs)
  pages/
    purchase-order.page.ts              ← extend (+~14 methods)
    po-approver.helpers.ts              ← new (cross-context PO helpers)
docs/user-stories/
  402-po-purchaser-journey.md           ← auto-generated
tests/results/
  402-po-purchaser-journey-results.{csv,json}
```

### TC numbering
- Prefix `TC-POP` (PO Purchaser)
- Format `TC-POP<step><nn>` mirroring 302/303/304/311
- Step → ID range:

All step files live under `docs/persona-doc/Purchase Order/Purchaser/`.

| Step | Doc file | TC range | Count |
|---|---|---|---|
| 1 — PO List | `step-01-po-list.md` | `TC-POP0101..0105` | 5 |
| 2 — Create PO | `step-02-create-po.md` | `TC-POP0201..0212` | 12 |
| 3 — PO Detail | `step-03-po-detail.md` | `TC-POP0301..0304` | 4 |
| 4 — Edit Mode | `step-04-edit-mode.md` | `TC-POP0401..0406` | 6 |
| 5 — Post-approval | `step-05-post-approval.md` | `TC-POP0501..0504` | 4 |
| Golden Journey | (cross-step) | `TC-POP0901` | 1 |
| **Total** | | | **32** |

### Auth fixture
```ts
import { createAuthTest } from "./fixtures/auth.fixture";

const purchaseTest = createAuthTest("purchase@blueledgers.com");
```

### Cross-persona setup chain (Step 5 + Golden Journey)
For Approved-status PO TCs:
```ts
const created = await submitPOAsPurchaser(browser);   // Purchaser creates+submits Draft → In Progress
await approveAsFC(browser, created.ref);              // FC bulk-approves → Approved status
await gotoPODetail(page, created.ref);                // Purchaser primary context navigates and acts
```

For Step 2 From PR wizard: trust DB has approved PR (no seeding chain). Dynamic skip if wizard list is empty.

### New helpers — `tests/pages/po-approver.helpers.ts`
```ts
import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { PurchaseOrderPage, LIST_PATH } from "./purchase-order.page";
import { TEST_PASSWORD } from "../test-users";

export interface CreatedPO { ref: string; url: string; }

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as Purchaser,
 * creates a Draft PO with header + 1 item, submits it for approval, and
 * returns the PO ref. Auxiliary context is closed cleanly.
 */
export async function submitPOAsPurchaser(
  browser: Browser,
  opts?: { description?: string; vendor?: string },
): Promise<CreatedPO>;

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as FC,
 * navigates to PO at ref, enters Edit Mode, bulk-approves to advance
 * the PO from In Progress to Approved status. Closes context cleanly.
 */
export async function approveAsFC(browser: Browser, ref: string): Promise<void>;

/**
 * Navigates to a PO detail page in the calling context.
 */
export async function gotoPODetail(page: Page, ref: string): Promise<void>;
```

### Page object strategy
**Extend `tests/pages/purchase-order.page.ts` in place** with new methods (~14 added). The persona-journey spec uses the same screens as 401; a separate page object would duplicate locators.

Methods to ADD (verified against the 5 in-scope steps):

| Method | Used by | Notes |
|---|---|---|
| `tabMyPending()`, `tabAllDocuments()` | Step 1 | List tabs |
| `searchInput()`, `searchFor(text)` | Step 1 | Inherit from BasePage if compatible |
| `filterButton()`, `applyFilter(opts)` | Step 1 | |
| `submitButton()` | Step 4 | Submit Draft PO; distinct from `saveButton` |
| `editModeButton()`, `enterEditMode()`, `cancelEditMode()` | Step 4 | |
| `deleteButton()` | Step 4 | Inherit from BasePage |
| `addItemButton()`, `addItemToPO(data)` | Step 2/4 | |
| `tabItems()`, `tabQuantity()`, `tabPricing()` | Step 3 | Item details panel tabs |
| `fromPriceListMenuItem()`, `fromPRMenuItem()` | Step 2 | Create dropdown items |
| `priceListWizardSubmit()`, `fromPRWizardSubmit()` | Step 2 | Wizard final action buttons |
| `closePOButton()` | Step 5 | Close (with/without items received) |

### Reuse from existing infrastructure
- `e2eDescription` from `pr-creator.helpers.ts` — `[E2E-PRC]` marker (or use `[E2E-POP]` for PO-specific)
- BasePage: `saveButton`, `cancelButton`, `deleteButton`, `editButton`, `searchInput`, `filterButton` — inherit when compatible
- Existing `purchase-order.page.ts` methods: navigation, create dropdown, form fields, action buttons, status badge, dialog primitives

## 6. Test catalog

Each entry maps to one `purchaseTest(...)` call.

### Step 1 — PO List (`describe("Step 1 — PO List")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0101 | List loads with PO statuses (DRAFT / IN PROGRESS / APPROVED / etc.) | Smoke | High |
| TC-POP0102 | Switch to All Documents tab broadens scope | Functional | Medium |
| TC-POP0103 | Filter by status (DRAFT) | Functional | Medium |
| TC-POP0104 | Search by PO reference | Functional | Medium |
| TC-POP0105 | Sort by Date | Functional | Low |

### Step 2 — Create PO (`describe("Step 2 — Create PO")`)
**Blank method:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0201 | Open Create dropdown → Blank → form loads | Smoke | High |
| TC-POP0202 | Fill header (vendor, delivery date, description) + add 1 line item | CRUD | High |
| TC-POP0203 | Save Draft → redirect to detail with PO number | CRUD | High |
| TC-POP0204 | Save without items → button disabled or stays on /new | Validation | Medium |

**From Price List wizard:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0205 | Open Create → From Price List → wizard step 1 (Select Vendors) | Smoke | Medium |
| TC-POP0206 | Select vendor → wizard step 2 (Review items) | Functional | Medium |
| TC-POP0207 | Submit wizard → POs created (URL changes from /new to detail) | CRUD | High |
| TC-POP0208 | Skip dynamically if no price list / vendors available | Functional | Low |

**From PR wizard:**
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0209 | Open Create → From PR → wizard step 1 (Select Approved PRs) | Smoke | Medium |
| TC-POP0210 | Select approved PR → wizard step 2 (Review POs grouped by vendor) | Functional | Medium |
| TC-POP0211 | Submit wizard → POs created | CRUD | High |
| TC-POP0212 | Skip dynamically if no approved PR available | Functional | Low |

### Step 3 — PO Detail (`describe("Step 3 — PO Detail")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0301 | Detail loads (DRAFT) with header + items table | Smoke | High |
| TC-POP0302 | Item Details panel — Details / Quantity / Pricing tabs | Functional | Medium |
| TC-POP0303 | Edit / Delete / Submit buttons present for DRAFT | Functional | High |
| TC-POP0304 | Read-only state for SENT/COMPLETED status (best-effort, dynamic skip) | Authorization | Medium |

### Step 4 — Edit Mode (`describe("Step 4 — Edit Mode")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0401 | Click Edit on DRAFT → edit mode active (Save/Cancel visible) | Smoke | High |
| TC-POP0402 | Modify line item quantity → Save → URL stays on detail | CRUD | High |
| TC-POP0403 | Add new line item in edit mode → Save | CRUD | Medium |
| TC-POP0404 | Cancel edit (no unsaved changes) → exits without dialog | Functional | Medium |
| TC-POP0405 | Submit Draft PO → confirmation dialog → status moves to IN PROGRESS | CRUD | High |
| TC-POP0406 | Delete IN PROGRESS PO via Edit Mode | CRUD | Medium |

### Step 5 — Post-approval (`describe("Step 5 — Post-approval")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0501 | Approved PO has Send to Vendor + Close buttons (seeded via approveAsFC) | Functional | High |
| TC-POP0502 | Click Send to Vendor → status updates / toast | CRUD | High |
| TC-POP0503 | Close PO with items received → COMPLETED | CRUD | Medium |
| TC-POP0504 | Close PO without items received → VOIDED | CRUD | Medium |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-POP0901 | Full Purchaser flow: Create blank → Save Draft → Submit → FC approves → Send to Vendor | Smoke | High |

### Coverage summary

| Type | Count |
|---|---|
| Smoke | 6 |
| CRUD | 13 |
| Functional | 11 |
| Validation | 1 |
| Authorization | 1 |
| **Total** | **32** |

| Priority | Count |
|---|---|
| High | 14 |
| Medium | 14 |
| Low | 4 |

## 7. Annotation contract (per CLAUDE.md)

Every `purchaseTest(...)` ships the full 5-field annotation set. Audit script must pass with `pre=32 exp=32` for the new spec.

After writing the spec, run `bun docs:user-stories` to regenerate `docs/user-stories/402-po-purchaser-journey.md`.

## 8. Reporter and sync wiring

CSV / JSON reporters — no code change. CSV reporter regex `\b(TCS?-[A-Z]{0,4}\d{2,})\b` matches `TC-POP0101`.

Add to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ jsonFile: "402-po-purchaser-journey-results.json", sheetTab: "PO Purchaser" }
```
Tab `PO Purchaser` must be created manually in the target spreadsheet before first sync.

## 9. Hard-assertion discipline

Every TC carries either:
- At least one `expect(...)` without `.catch()`, OR
- An explicit `purchaseTest.skip(reason)` early-exit when prerequisite UI / data is missing.

Convention enforced from 302 onwards.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| From PR wizard requires approved PR in DB; absent in fresh CI environment | Dynamic skip via wizard-empty check (TC-POP0212); document expectation in `note` annotation |
| `submitPOAsPurchaser + approveAsFC` chain adds ~20s/test for Step 5 (5 TCs × 20s = 100s overhead) | Acceptable; matches 304 PR Purchaser overhead pattern |
| FC bulk-approve mechanic on PO may differ from PR's bulk approve (different stage UI / different toolbar) | `approveAsFC` audited at impl time; helper updates per actual UI flow |
| Step 2 wizard locators are speculative (Select Vendors, Review items) — UI shape unconfirmed | Use broad regex with `getByRole("button", { name: /next|continue|review/i })` and `.first()`; dynamic skip if step labels differ |
| `closePOButton` may have multiple variants (Close / Close PO / Mark as Complete) | Use regex with alternatives; verify at impl time |
| Status transitions involve backend latency | All TCs use `{ timeout: 10_000 }` or longer on status-change assertions |
| `applyDiscountButton` / `calculateTotalsButton` exist on page object but spec doesn't cover | Out of scope — covered by 401 per-action spec |
| Auto-generated PO number format may vary | Tests assert URL pattern `/purchase-order/[^/]+$/` (any non-empty ref); don't pin specific format |

## 11. Success criteria

- 32 TCs implemented; all carry the 5-field annotation set
- `bun run test -- 402-po-purchaser-journey.spec.ts` passes locally on first stable run (allowing dynamic skips)
- `docs/user-stories/402-po-purchaser-journey.md` regenerates without error
- CSV + JSON emitted to `tests/results/402-po-purchaser-journey-results.{csv,json}`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PO Purchaser` tab

## 12. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/402-po-purchaser-journey.spec.ts` | New | ~32 TCs |
| `tests/pages/purchase-order.page.ts` | Modify | +~14 method declarations |
| `tests/pages/po-approver.helpers.ts` | New | Cross-context PO helpers |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/402-po-purchaser-journey.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/402-po-purchaser-journey-results.{csv,json}` | Auto | Reporter output at runtime |

## 13. Follow-up specs (out of scope here)

| # | Spec | Triggered by |
|---|---|---|
| 1 | `403-po-approver-journey.spec.ts` | After this spec lands — FC approver persona; reuses `submitPOAsPurchaser` from this spec for cross-context seeding |
| 2 | Multi-PR-grouped-into-vendor edge cases | On demand if production gaps surface |
