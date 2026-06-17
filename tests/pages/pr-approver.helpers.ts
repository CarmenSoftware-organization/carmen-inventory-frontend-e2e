import type { Browser, BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { PurchaseRequestPage, LIST_PATH } from "./purchase-request.page";
import { createDraftPR, type CreatedPR } from "./pr-creator.helpers";
import { BU_CODE } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { ensureActiveBu } from "../helpers/bu";

export type { CreatedPR } from "./pr-creator.helpers";

/**
 * Opens an auxiliary BrowserContext pre-authenticated as `email` from the
 * persisted storageState (.auth/<email>.json, written by auth.setup.ts) and
 * runs `fn` with a fresh page in that context. The context is always closed.
 *
 * Using storageState (instead of a fresh UI login via loginWithRetry) avoids
 * a hard hang observed when a second context tried to log in through the UI
 * while the calling test already held its own authenticated context. It is
 * also much faster — no login round-trip — and the BU is pinned to BLAVG once
 * the app has booted so the PR form's BU-dependent lookups have data.
 */
async function withRoleContext<T>(
  browser: Browser,
  email: string,
  fn: (page: Page) => Promise<T>,
): Promise<T> {
  const ctx: BrowserContext = await browser.newContext({
    storageState: authFile(email),
  });
  try {
    const page = await ctx.newPage();
    await ensureActiveBu(page, BU_CODE);
    return await fn(page);
  } finally {
    await ctx.close();
  }
}

/**
 * Cross-context fixture: opens a fresh browser context, logs in as the
 * Requestor, creates a Draft PR with N items, submits it for approval,
 * and returns the PR ref. The auxiliary context is closed cleanly so
 * the calling HOD/FC test's primary context is unaffected.
 *
 * Used in beforeEach of Step 3, 4, Scope Contrast, and Golden Journey.
 */
export async function submitPRAsRequestor(
  browser: Browser,
  opts?: { items?: number; description?: string },
): Promise<CreatedPR> {
  return withRoleContext(browser, "requestor@blueledgers.com", async (page) => {
    const created = await createDraftPR(page, {
      items: opts?.items ?? 1,
      description: opts?.description ?? "approver-fixture",
    });

    const pr = new PurchaseRequestPage(page);
    await pr.submitButton().click({ timeout: 5_000 });
    await pr.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 });
    // A successful submit advances the PR to In Progress and redirects to the
    // list. Wait for that redirect (NOT a toast — the create-success toast can
    // still be on screen and would be a false positive) so the submit has truly
    // persisted before withRoleContext closes this context. Closing too early
    // aborts the in-flight submit and leaves the PR stuck in Draft.
    await page.waitForURL(/\/procurement\/purchase-request(\?|$)/, { timeout: 15_000 });
    return created;
  });
}

/**
 * Edit Mode → select all rows → click Approve in bulk toolbar → confirm.
 * Caller must already be in Edit Mode on a PR detail page.
 */
export async function bulkApprove(page: Page): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  // "Approve" only marks the selected items' decision (PENDING -> APPROVED) in
  // the edit form — there is NO confirm dialog. Save persists the decision.
  await pr.bulkApproveInEditMode().click({ timeout: 5_000 });
  await pr.saveEditMode();
}

/**
 * Edit Mode → select all rows → click Reject → enter reason → confirm.
 */
export async function bulkReject(page: Page, reason: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkRejectInEditMode().click({ timeout: 5_000 });
  const input = pr.reasonInput();
  if ((await input.count()) > 0) await input.fill(reason);
  await pr.confirmDialogButton(/confirm|reject|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
  // Persist the decision (Reject marks the item; Save commits it).
  await pr.saveEditMode();
}

/**
 * Edit Mode → select all rows → click Send for Review → enter reason + stage → confirm.
 */
export async function bulkSendForReview(
  page: Page,
  reason: string,
  stage: string,
): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkSendForReviewInEditMode().click({ timeout: 5_000 });
  const input = pr.reasonInput();
  if ((await input.count()) > 0) await input.fill(reason);
  // Stage selector — best effort
  const stageTrigger = page.getByLabel(/stage|return to/i).first();
  if ((await stageTrigger.count()) > 0) {
    await stageTrigger.click();
    await page.getByRole("option", { name: new RegExp(stage, "i") }).first().click().catch(() => {});
  }
  await pr.confirmDialogButton(/confirm|send|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
  // Persist the decision (Send for Review marks the item; Save commits it).
  await pr.saveEditMode();
}

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as HOD,
 * navigates to the PR detail at `ref`, enters Edit Mode, and bulk-approves
 * the PR — advancing it from HOD stage to Purchase stage. Closes the context
 * cleanly. Used by Purchaser tests to seed PRs at the Purchase stage.
 */
export async function approveAsHOD(browser: Browser, ref: string): Promise<void> {
  await withRoleContext(browser, "hod@blueledgers.com", async (page) => {
    await gotoPRDetail(page, ref);
    const pr = new PurchaseRequestPage(page);
    if ((await pr.editModeButton().count()) === 0) {
      throw new Error(`approveAsHOD: Edit button not found on PR ${ref} — HOD may not have edit permission`);
    }
    await pr.enterEditMode();
    await bulkApprove(page);
    await page.waitForLoadState("networkidle").catch(() => {});
  });
}

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
  await withRoleContext(browser, "hod@blueledgers.com", async (page) => {
    await gotoPRDetail(page, ref);
    const pr = new PurchaseRequestPage(page);
    if ((await pr.editModeButton().count()) === 0) {
      throw new Error(`sendForReviewAsHOD: Edit button not found on PR ${ref}`);
    }
    await pr.enterEditMode();
    await bulkSendForReview(page, reason, "Requestor");
    await page.waitForLoadState("networkidle").catch(() => {});
  });
}

/**
 * Navigates to a PR detail page in HOD's primary context (or current page).
 */
export async function gotoPRDetail(page: Page, ref: string): Promise<void> {
  await page.goto(`${LIST_PATH}/${ref}`);
  await page.waitForLoadState("networkidle");
}
