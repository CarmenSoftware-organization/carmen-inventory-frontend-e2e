import { expect, type Locator, type Page } from "@playwright/test";
import { btn } from "../movement/ui";
import { BU, gotoInBu, review } from "./context";

/**
 * Press Start Period Close in a case that MUST be blocked — returns the dialog listing the pending documents.
 *
 * Safety net: if the documents meant to block failed to be created, pressing Start
 * would really open the count round (irreversible). So the POST start-counting is
 * intercepted and the backend asked first whether anything blocks; with total = 0
 * the request is aborted and the case fails.
 */
export async function startExpectingBlocked(page: Page): Promise<Locator> {
  let tripped = false;
  await page.route(/\/period-ends\/start-counting/, async (route) => {
    const r = await review(BU);
    if (r.start_blocking.total === 0) {
      tripped = true;
      return route.abort();
    }
    return route.fallback();
  });
  await gotoInBu(page, "/inventory-management/period-end");
  await btn(page, "Start Period Close").click();
  const confirm = page.locator("[role=alertdialog]").last();
  await expect(confirm).toBeVisible();
  const blocked = page.waitForResponse((r) => /\/period-ends\/start-counting/.test(r.url()) && r.request().method() === "POST");
  await confirm.getByRole("button", { name: "Start Period Close" }).click();
  const resp = await blocked.catch(() => null);
  await page.unroute(/\/period-ends\/start-counting/);
  expect(tripped, "nothing pending — start-counting aborted so the count round is not opened by accident").toBe(false);
  expect(resp?.status(), "Start must be refused with 422").toBe(422);
  const dialog = page.locator("[role=dialog]").filter({ hasText: "Finish these documents first" });
  await expect(dialog).toBeVisible();
  return dialog;
}
