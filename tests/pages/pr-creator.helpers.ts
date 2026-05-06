import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { PurchaseRequestPage, LIST_PATH } from "./purchase-request.page";

/**
 * Marks PRs created by E2E so they can be filtered out of the UI manually
 * when the DB grows noisy. Not a cleanup mechanism — see design spec §4.5.
 */
export function e2eDescription(suffix: string): string {
  return `[E2E-PRC] ${suffix}`;
}

export interface CreatedPR {
  ref: string;
  url: string;
}

const FUTURE_DATE = "2099-12-31";

/**
 * Creates a Draft PR with N line items and returns its reference + url.
 * Used by Step 4-6/8 setup and the Golden Journey TC.
 */
export async function createDraftPR(
  page: Page,
  opts?: { items?: number; description?: string; deliveryDate?: string },
): Promise<CreatedPR> {
  const pr = new PurchaseRequestPage(page);
  await pr.gotoList();
  await pr.openCreateDialog();
  await expect(page).toHaveURL(/purchase-request\/new/, { timeout: 10_000 });

  await pr.fillHeader({
    prType: "general",
    deliveryDate: opts?.deliveryDate ?? FUTURE_DATE,
    description: e2eDescription(opts?.description ?? "draft fixture"),
  });

  const itemCount = opts?.items ?? 1;
  for (let i = 0; i < itemCount; i++) {
    await pr.addLineItem({
      product: "Test Item",
      description: `E2E item ${i + 1}`,
      quantity: 1,
      uom: "ea",
      unitPrice: 100,
    });
  }

  await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
  await page.waitForURL(/purchase-request\/[^\/]+$/, { timeout: 15_000 }).catch(() => {});

  const url = page.url();
  const refMatch = url.match(/purchase-request\/([^\/?#]+)/);
  return { ref: refMatch?.[1] ?? "", url };
}

/**
 * Submits an existing Draft PR and waits for the "In Progress" status.
 */
export async function submitDraftPR(page: Page, ref: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  if (!page.url().includes(ref)) {
    await page.goto(`${LIST_PATH}/${ref}`);
    await page.waitForLoadState("networkidle");
  }
  await pr.submitButton().click({ timeout: 5_000 }).catch(() => {});
  await pr.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
  await pr.expectStatus("in.progress");
}

/**
 * Deletes an existing Draft PR via UI (confirmation dialog).
 */
export async function deleteDraftPR(page: Page, ref: string): Promise<void> {
  const pr = new PurchaseRequestPage(page);
  if (!page.url().includes(ref)) {
    await page.goto(`${LIST_PATH}/${ref}`);
    await page.waitForLoadState("networkidle");
  }
  await pr.deleteButton().click({ timeout: 5_000 }).catch(() => {});
  await pr.confirmDialogButton(/confirm|delete|yes/i).click({ timeout: 5_000 }).catch(() => {});
  await page.waitForURL(LIST_PATH, { timeout: 10_000 }).catch(() => {});
}
