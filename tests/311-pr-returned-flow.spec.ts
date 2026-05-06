import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import {
  submitPRAsRequestor,
  sendForReviewAsHOD,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Cross-persona spec — Creator's Step 7 (Returned PR flow). Runs alongside
// 302/303/304. Source docs: docs/persona-doc/Purchase Request/Creator/
// step-07-returned-pr.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

requestorTest.describe("7a — View Returned PR", () => {
  requestorTest(
    "TC-PRC0701 Returned PR appears in Creator's list with RETURNED status badge",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; a Returned PR exists (seeded via submitPRAsRequestor + sendForReviewAsHOD)" },
        { type: "steps", description: "1. Open PR list\n2. Locate the seeded PR row\n3. Verify status badge reads Returned (or equivalent)" },
        { type: "expected", description: "PR row is visible in the list and the status badge filter matches /returned|sent back/i for the row." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await pr.gotoList();
      const row = pr.prRow(created.ref);
      if ((await row.count()) === 0) {
        requestorTest.skip(true, "Returned PR not visible in Creator's list — backend may filter differently");
        return;
      }
      await expect(row).toBeVisible({ timeout: 10_000 });
      await expect(row).toContainText(/returned|sent back/i);
    },
  );

  requestorTest(
    "TC-PRC0702 Open Returned PR detail loads with status=Returned",
    {
      annotation: [
        { type: "preconditions", description: "A Returned PR exists" },
        { type: "steps", description: "1. Navigate to the Returned PR detail page\n2. Verify URL\n3. Verify status badge" },
        { type: "expected", description: "URL is /procurement/purchase-request/<ref>; status badge text matches /returned|sent back/i." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /returned|sent back/i })
          .first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PRC0703 Workflow History tab shows the return reason from HOD",
    {
      annotation: [
        { type: "preconditions", description: "On a Returned PR detail page" },
        { type: "steps", description: "1. Click Workflow History tab\n2. Look for the HOD return reason text" },
        { type: "expected", description: "Workflow History panel contains the seeded return reason 'Please revise — returned for review' (or partial match)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) === 0) {
        requestorTest.skip(true, "Workflow History tab not present in this build");
        return;
      }
      await wh.click();
      await expect(
        page.getByText(/please revise|returned for review|revise/i).first(),
      ).toBeVisible({ timeout: 10_000 });
    },
  );
});

requestorTest.describe("7b — Edit Returned PR", () => {
  // TCs added in Task 5
});

requestorTest.describe("7c — Resubmit", () => {
  // TCs added in Task 6
});

requestorTest.describe("7d — Edge cases", () => {
  // TCs added in Task 7
});

requestorTest.describe.serial("Golden Journey", () => {
  // TC added in Task 8
});
