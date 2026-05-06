# PR Returned Flow — E2E Test Suite Design

**Date:** 2026-05-06
**Status:** Draft — pending user approval
**Scope:** Playwright cross-persona spec covering Step 7 of the Creator workflow — the Returned PR flow (HOD sends back → Creator reviews reason → edits → resubmits)
**Source documents:** `docs/persona-doc/Purchase Request/Creator/step-07-returned-pr.md`

---

## 1. Purpose

The PR persona suite on `main` covers:
- `tests/302-pr-creator-journey.spec.ts` (41 TCs) — Creator persona, Steps 1-6 + 8 (Step 7 deferred)
- `tests/303-pr-approver-journey.spec.ts` (27 TCs) — Approver persona
- `tests/304-pr-purchaser-journey.spec.ts` (25 TCs) — Purchaser persona

This spec adds **`tests/311-pr-returned-flow.spec.ts`** — the cross-persona suite that finally covers Step 7 of the Creator persona, deferred from 302 because it requires upstream Approver action to seed the Returned state.

The test scenario: Creator submits a PR → HOD sends it back via Send for Review → PR is now in Returned status, awaiting Creator's revision → Creator views the return reason in Workflow History, edits the PR, and resubmits — moving status back to In Progress.

The existing per-action spec (`301-purchase-request.spec.ts`) and prior persona-journey specs (302/303/304) are **not modified**.

## 2. Scope

**In scope** — Creator persona acting on Returned PRs (`requestor@blueledgers.com`):
- Section 7a — View Returned PR (list display, detail load, return reason in Workflow History)
- Section 7b — Edit Returned PR (modify line item, add new item, save persists)
- Section 7c — Resubmit (confirmation dialog, status moves Returned → In Progress)
- Section 7d — Edge cases (cancel resubmit, delete Returned PR)
- Golden Journey — full returned-flow end-to-end
- 11 TCs total, IDs `TC-PRC0701..0710` + `TC-PRC0902` (continuing 302's reserved Step 7 range)

**Out of scope** (deferred or covered elsewhere):
- Multi-cycle (Returned → Edit → Resubmit → Returned again) — defer if needed
- Approver/Purchaser side of the Returned flow — covered in 303/304 (`bulkSendForReview` action)
- Validation/error cases on resubmit (no items, etc.) — covered by Step 6 of 302
- Cleanup of created PRs — match 302/303/304 convention

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Per-role auth fixture (`requestorTest`) |
| `PurchaseRequestPage` | `tests/pages/purchase-request.page.ts` | All locators used (status badge, tabs, edit mode, line item, submit, delete) — no new methods needed |
| `submitPRAsRequestor` | `tests/pages/pr-approver.helpers.ts` | Cross-context Requestor seed (existing) |
| `sendForReviewAsHOD` | `tests/pages/pr-approver.helpers.ts` | NEW — adds in this spec |
| `bulkSendForReview` | `tests/pages/pr-approver.helpers.ts` | Used internally by `sendForReviewAsHOD` |
| `gotoPRDetail` | `tests/pages/pr-approver.helpers.ts` | Detail navigation |
| `e2eDescription` | `tests/pages/pr-creator.helpers.ts` | `[E2E-PRC]` marker on seeded PRs |
| `tc-csv-reporter` / `tc-json-reporter` | `tests/reporters/` | Auto-parse `TC-PRC0701`-style IDs |
| `generate-user-stories.ts` | `scripts/generate-user-stories.ts` | No generator change |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one `SYNC_TARGETS` entry |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Add new cross-persona spec (311) rather than extending 302 | 302 was scoped to non-cross-persona Creator steps; 311 packages the cross-context setup chain cleanly |
| 2 | Reuse `TC-PRC07xx` numbering (not a new prefix) | 302 design doc §6 reserved Step 7 IDs; using them keeps Creator coverage unified under one prefix |
| 3 | Granularity ~11 TCs (3+3+2+2+1) | Balanced with sister specs; infrastructure pre-exists so coverage is achievable |
| 4 | New helper `sendForReviewAsHOD` mirrors `approveAsHOD` shape | Symmetric API for HOD-side cross-context actions; lives next to `approveAsHOD` in `pr-approver.helpers.ts` |
| 5 | Default return reason `"Please revise — returned for review"`; default stage `"Requestor"` | Sensible defaults for the test fixture; explicit override not needed for setup |
| 6 | Per-section `describe` blocks (4 sections + Golden Journey) | Mirrors 302/303/304 structure; trace 7a/7b/7c/7d back to source doc subsections |
| 7 | Use the Creator-numbered Golden Journey ID `TC-PRC0902` | Continues 302's `TC-PRC0901`; signals "second Creator golden journey" (returned flow variant) |
| 8 | No automatic cleanup | Match 302/303/304 convention |
| 9 | No new page object methods | All locators needed already exist |

## 5. Architecture

### File layout
```
tests/
  311-pr-returned-flow.spec.ts          ← new spec (11 TCs)
  pages/
    pr-approver.helpers.ts              ← extend (+ sendForReviewAsHOD)
docs/user-stories/
  311-pr-returned-flow.md               ← auto-generated
tests/results/
  311-pr-returned-flow-results.{csv,json}  ← auto-emitted
```

**No changes to** `purchase-request.page.ts` — all locators required already exist (status badge filter includes `/returned/i`, plus existing tabs/edit-mode/line-item/submit/delete).

### TC numbering
- Prefix `TC-PRC` (continued from 302)
- Range `TC-PRC0701..0710` for sections 7a-7d (Step 7's reserved range from 302's §6 mapping)
- `TC-PRC0902` for Golden Journey (continues 302's `TC-PRC0901`)

| Section | TC range | Count |
|---|---|---|
| 7a — View Returned PR | `TC-PRC0701..0703` | 3 |
| 7b — Edit Returned PR | `TC-PRC0704..0706` | 3 |
| 7c — Resubmit | `TC-PRC0707..0708` | 2 |
| 7d — Edge cases | `TC-PRC0709..0710` | 2 |
| Golden Journey | `TC-PRC0902` | 1 |
| **Total** | | **11** |

### Auth fixture
```ts
import { createAuthTest } from "./fixtures/auth.fixture";

const requestorTest = createAuthTest("requestor@blueledgers.com");
```

### Cross-persona setup chain
2-step chain to produce a PR in `Returned` status before each test:

```ts
// In requestorTest body / inline:
const created = await submitPRAsRequestor(browser);    // existing: Requestor → submit at HOD stage
await sendForReviewAsHOD(browser, created.ref);        // NEW: HOD → bulk Send for Review → routes back
// PR is now Returned, visible in Creator's queue
await gotoPRDetail(page, created.ref);                 // Creator navigates and acts
```

### New helper — `sendForReviewAsHOD(browser, ref, reason?)`

```ts
// Add to tests/pages/pr-approver.helpers.ts

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as HOD,
 * navigates to the PR detail at `ref`, enters Edit Mode, selects all rows,
 * and bulk-sends the PR for review with the given reason — routing the PR
 * back to the Requestor (Creator). Closes the context cleanly. Used by the
 * PR Returned Flow spec to seed PRs in the Returned status.
 */
export async function sendForReviewAsHOD(
  browser: Browser,
  ref: string,
  reason: string = "Please revise — returned for review",
): Promise<void> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("hod@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await gotoPRDetail(page, ref);
    const pr = new PurchaseRequestPage(page);
    if ((await pr.editModeButton().count()) === 0) {
      throw new Error(`sendForReviewAsHOD: Edit button not found on PR ${ref}`);
    }
    await pr.enterEditMode();
    await bulkSendForReview(page, reason, "Requestor");
    await page.waitForLoadState("networkidle").catch(() => {});
  } finally {
    await ctx.close();
  }
}
```

### Reuse
- `submitPRAsRequestor`, `bulkSendForReview`, `gotoPRDetail` — `pr-approver.helpers.ts`
- `submitDraftPR` — `pr-creator.helpers.ts` (for resubmit step)
- All page object methods (status badge, tabs, edit mode, line items, submit/delete buttons, confirm dialog) — existing

## 6. Test catalog

Each entry maps to one `requestorTest(...)` call.

### Section 7a — View Returned PR (`describe("7a — View Returned PR")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0701 | Returned PR appears in Creator's list with RETURNED status badge | Smoke | High |
| TC-PRC0702 | Open Returned PR detail loads with status=Returned | Smoke | High |
| TC-PRC0703 | Workflow History tab shows the return reason from HOD | Functional | High |

### Section 7b — Edit Returned PR (`describe("7b — Edit Returned PR")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0704 | Edit button visible on Returned PR (Creator can re-edit) | Functional | High |
| TC-PRC0705 | Modify line item quantity → Save → URL stays on detail | CRUD | High |
| TC-PRC0706 | Add new line item to Returned PR → Save | CRUD | Medium |

### Section 7c — Resubmit (`describe("7c — Resubmit")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0707 | Submit confirmation dialog appears for Returned PR | Smoke | High |
| TC-PRC0708 | Confirm submit → status moves Returned → In Progress | CRUD | High |

### Section 7d — Edge cases (`describe("7d — Edge cases")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0709 | Cancel submit on Returned PR → URL stays on detail (still Returned) | Functional | Medium |
| TC-PRC0710 | Delete Returned PR is allowed for Creator | Authorization | Medium |

### Golden Journey (`describe.serial("Golden Journey")`)
| TC | Title | Type | Priority |
|---|---|---|---|
| TC-PRC0902 | Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress | Smoke | High |

### Coverage summary

| Type | Count |
|---|---|
| Smoke | 4 |
| CRUD | 4 |
| Functional | 2 |
| Authorization | 1 |
| **Total** | **11** |

| Priority | Count |
|---|---|
| High | 8 |
| Medium | 3 |
| Low | 0 |

## 7. Annotation contract (per CLAUDE.md)

Every `requestorTest(...)` ships the full 5-field annotation set:

```ts
{
  annotation: [
    { type: "preconditions", description: "Logged in as Requestor; Returned PR exists (seeded via submitPRAsRequestor + sendForReviewAsHOD)" },
    { type: "steps",         description: "1. ...\n2. ..." },
    { type: "expected",      description: "Concrete outcome (URL / status / dialog visibility)" },
    { type: "priority",      description: "High" },
    { type: "testType",      description: "Smoke" },
  ],
}
```

Annotation audit must pass:

```bash
for f in tests/*.spec.ts; do
  pre=$(grep -c 'type: "preconditions"' "$f")
  exp=$(grep -c 'type: "expected"' "$f")
  [ "$pre" = "$exp" ] || echo "MISMATCH in $f: pre=$pre exp=$exp"
done
```

For 311 specifically, both counts equal 11.

## 8. Reporter and sync wiring

### CSV / JSON reporters
No code change — both parse `TC-PRC0701`-style IDs automatically (PRC was already wired by 302).

### Google Sheets sync
Add to `SYNC_TARGETS` in `scripts/sync-test-results.ts`:
```ts
{ jsonFile: "311-pr-returned-flow-results.json", sheetTab: "PR Returned Flow" }
```
Tab `PR Returned Flow` must be created manually in the target spreadsheet before first sync.

## 9. Hard-assertion discipline

Every TC carries either:
- At least one `expect(...)` without `.catch()`, OR
- An explicit `requestorTest.skip(reason)` early-exit when prerequisite UI / data is missing.

Convention enforced from 302 onwards.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| `sendForReviewAsHOD` adds ~10s per test (cross-context login + edit + bulk action) | Acceptable for 11 dependent TCs; ~2 min total |
| Stage selector in Send for Review dialog may not have a `"Requestor"` option | `bulkSendForReview` swallows option-not-found via `.catch(() => {})`; backend may default-route based on PR origin |
| "Returned" status text may render differently (`Returned`, `Sent Back`, `Rejected for Review`) | Use regex with alternatives: `/returned|sent back/i` in `expectStatus()` calls |
| TC-PRC0710 (Delete Returned) may not be permitted in all configurations | Dynamic skip if `deleteButton` is absent; document the gap in `note` annotation |
| Resubmit dialog confirm text may differ from first-time submit | `confirmDialogButton` regex covers `/confirm|submit|resubmit|ok|yes/i` |
| Edit on Returned PR may render different field-state than Draft (e.g., some fields locked once HOD has approved them earlier) | Tests assert on URL stability + visible Edit affordance; field-state nuances deferred to per-action 301 spec |
| HOD's edit-mode entry on the Pr in `sendForReviewAsHOD` may fail if the PR doesn't surface "Edit" for HOD before approval | Helper throws explicitly if `editModeButton` count is 0; calling test fails with descriptive error |

## 11. Success criteria

- 11 TCs implemented; all carry the 5-field annotation set
- `bun run test -- 311-pr-returned-flow.spec.ts` passes locally on first stable run (allowing dynamic skips)
- `docs/user-stories/311-pr-returned-flow.md` regenerates without error
- CSV + JSON emitted to `tests/results/311-pr-returned-flow-results.{csv,json}`
- Annotation audit script reports no mismatches
- `bun e2e:sync` (with credentials) writes results into the `PR Returned Flow` tab

## 12. Files changed / created

| File | Type | Notes |
|---|---|---|
| `tests/311-pr-returned-flow.spec.ts` | New | 11 TCs |
| `tests/pages/pr-approver.helpers.ts` | Modify | + `sendForReviewAsHOD` |
| `scripts/sync-test-results.ts` | Modify | One new `SYNC_TARGETS` entry |
| `docs/user-stories/311-pr-returned-flow.md` | Auto-gen | Output of `bun docs:user-stories` |
| `tests/results/311-pr-returned-flow-results.{csv,json}` | Auto | Reporter output at runtime |

## 13. Follow-up specs (out of scope here)

| # | Spec | Triggered by |
|---|---|---|
| 1 | `402-po-purchaser-journey.spec.ts` | After this spec lands |
| 2 | `403-po-approver-journey.spec.ts` | After 402 |
| 3 | Multi-cycle Returned scenarios — add to 311 if observed in production | On demand |
