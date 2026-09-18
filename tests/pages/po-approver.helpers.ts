import type { Browser, BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { PurchaseOrderPage, LIST_PATH } from "./purchase-order.page";
import { BU_CODE } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { ensureActiveBu } from "../helpers/bu";

const FUTURE_DATE = "2099-12-31";

export interface CreatedPO {
  ref: string;
  url: string;
}

/**
 * Opens an auxiliary BrowserContext pre-authenticated as `email` from the
 * persisted storageState (.auth/<email>.json, written by auth.setup.ts) and runs
 * `fn` with a fresh page in that context. The context is always closed.
 *
 * Booting from storageState instead of logging in through the UI is what keeps
 * this usable from inside a test: a second context that tries a UI login while
 * the calling test already holds its own authenticated context hangs hard — the
 * PO journeys burned their whole timeout on exactly that, with no error to point
 * at. The same fix already lives in pr-approver.helpers.ts. It is also far
 * faster, and pinning the BU to BLAVG here gives the PO form's BU-dependent
 * lookups (workflow, vendor, location) data to work with.
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
  return await withRoleContext(browser, "purchase@blueledgers.com", async (page) => {
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

    // Submit for approval. This used to swallow every step in .catch(), so a
    // failed submit left a Draft PO behind and callers only found out much later
    // as "Approve button not found" — the approver has nothing to approve until
    // the PO leaves Draft. Prove the transition instead: the Submit button is
    // gone once the status moves on.
    const submit = po.submitButton();
    if ((await submit.count()) > 0) {
      await submit.click({ timeout: 10_000 });
      const confirm = po.confirmDialogButton(/confirm|submit|ok|yes/i);
      if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await confirm.click({ timeout: 10_000 });
      }
      await submit
        .waitFor({ state: "detached", timeout: 15_000 })
        .catch(async () => {
          throw new Error(
            `submitPOAsPurchaser: PO ${ref} still shows a Submit button — it never left Draft`,
          );
        });
    }

    return { ref, url };
  });
}

/**
 * Cross-context helper: opens a fresh BrowserContext, logs in as FC,
 * navigates to the PO at ref, enters Edit Mode, and clicks Approve to
 * advance the PO from In Progress to Approved status. Closes the context
 * cleanly. Used by Step 5 post-approval setup.
 */
export async function approveAsFC(browser: Browser, ref: string): Promise<void> {
  await withRoleContext(browser, "fc@blueledgers.com", async (page) => {
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
  });
}

/**
 * Navigates to a PO detail page in the calling context.
 */
export async function gotoPODetail(page: Page, ref: string): Promise<void> {
  await page.goto(`${LIST_PATH}/${ref}`);
  await page.waitForLoadState("networkidle");
}
