import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { PurchaseRequestPage, LIST_PATH } from "./purchase-request.page";
import { createDraftPR, type CreatedPR } from "./pr-creator.helpers";
import { TEST_PASSWORD } from "../test-users";

export type { CreatedPR } from "./pr-creator.helpers";

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
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("requestor@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

    const created = await createDraftPR(page, {
      items: opts?.items ?? 1,
      description: opts?.description ?? "approver-fixture",
    });

    const pr = new PurchaseRequestPage(page);
    await pr.submitButton().click({ timeout: 5_000 });
    await pr.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
    await pr.expectStatus("in.progress");
    return created;
  } finally {
    await ctx.close();
  }
}

/**
 * Edit Mode → select all rows → click Approve in bulk toolbar → confirm.
 * Caller must already be in Edit Mode on a PR detail page.
 */
export async function bulkApprove(page: Page): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  await pr.selectAllInEditMode();
  await pr.bulkApproveInEditMode().click({ timeout: 5_000 });
  await pr.confirmDialogButton(/confirm|approve|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
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
}

/**
 * Navigates to a PR detail page in HOD's primary context (or current page).
 */
export async function gotoPRDetail(page: Page, ref: string): Promise<void> {
  await page.goto(`${LIST_PATH}/${ref}`);
  await page.waitForLoadState("networkidle");
}
