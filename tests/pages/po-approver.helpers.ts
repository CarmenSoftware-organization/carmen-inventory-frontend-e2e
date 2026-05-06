import type { Browser, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { PurchaseOrderPage, LIST_PATH } from "./purchase-order.page";
import { TEST_PASSWORD } from "../test-users";

const FUTURE_DATE = "2099-12-31";

export interface CreatedPO {
  ref: string;
  url: string;
}

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as Purchaser,
 * creates a Draft PO with header + 1 item, submits it for approval, and
 * returns the PO ref. The auxiliary context is closed cleanly so the
 * calling test's primary context is unaffected.
 *
 * Used by Step 5 post-approval and Golden Journey to seed POs at the
 * Approved stage (combined with approveAsFC).
 */
export async function submitPOAsPurchaser(
  browser: Browser,
  opts?: { description?: string; vendor?: string },
): Promise<CreatedPO> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("purchase@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

    const po = new PurchaseOrderPage(page);
    await po.gotoNew();
    await expect(page).toHaveURL(/purchase-order\/new/, { timeout: 10_000 });

    if (opts?.vendor) {
      const trigger = po.vendorTrigger();
      if ((await trigger.count()) > 0) await trigger.fill(opts.vendor).catch(() => {});
    }
    const desc = po.descriptionInput();
    if ((await desc.count()) > 0) {
      await desc.fill(opts?.description ?? "[E2E-POP] approver-fixture").catch(() => {});
    }
    const date = po.deliveryDateInput();
    if ((await date.count()) > 0) await date.fill(FUTURE_DATE).catch(() => {});

    await po.addItemToPO({
      product: "Test Item",
      quantity: 1,
      uom: "ea",
      unitPrice: 100,
    });

    await po.saveButton().click({ timeout: 5_000 }).catch(() => {});
    await page.waitForURL(/purchase-order\/(?!new$)[^\/?#]+$/, { timeout: 15_000 }).catch(() => {});

    const url = page.url();
    if (url.endsWith("/new") || url.includes("/new?")) {
      throw new Error(`submitPOAsPurchaser: save did not redirect — still on ${url}. PO was not created.`);
    }
    const refMatch = url.match(/purchase-order\/([^\/?#]+)/);
    const ref = refMatch?.[1];
    if (!ref || ref === "new") {
      throw new Error(`submitPOAsPurchaser: could not extract PO ref from URL: ${url}`);
    }

    // Optionally submit for approval if a Submit button is present.
    const submit = po.submitButton();
    if ((await submit.count()) > 0) {
      await submit.click({ timeout: 5_000 }).catch(() => {});
      await po.confirmDialogButton(/confirm|submit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await page.waitForLoadState("networkidle").catch(() => {});
    }

    return { ref, url };
  } finally {
    await ctx.close();
  }
}

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as FC,
 * navigates to the PO at ref, enters Edit Mode, and clicks Approve to
 * advance the PO from In Progress to Approved status. Closes the context
 * cleanly. Used by Step 5 post-approval setup.
 */
export async function approveAsFC(browser: Browser, ref: string): Promise<void> {
  const ctx = await browser.newContext();
  try {
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithRetry("fc@blueledgers.com", TEST_PASSWORD);
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await gotoPODetail(page, ref);
    const po = new PurchaseOrderPage(page);
    if ((await po.editModeButton().count()) > 0) {
      await po.enterEditMode();
    }
    const approve = po.approveButton();
    if ((await approve.count()) === 0) {
      throw new Error(`approveAsFC: Approve button not found on PO ${ref}`);
    }
    await approve.click({ timeout: 5_000 });
    await po.confirmDialogButton(/confirm|approve|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
    await page.waitForLoadState("networkidle").catch(() => {});
  } finally {
    await ctx.close();
  }
}

/**
 * Navigates to a PO detail page in the calling context.
 */
export async function gotoPODetail(page: Page, ref: string): Promise<void> {
  await page.goto(`${LIST_PATH}/${ref}`);
  await page.waitForLoadState("networkidle");
}
