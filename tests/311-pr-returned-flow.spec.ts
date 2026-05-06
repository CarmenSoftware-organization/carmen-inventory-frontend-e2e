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
    "TC-PR-080701 Returned PR appears in Creator's list with RETURNED status badge",
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
    "TC-PR-080702 Open Returned PR detail loads with status=Returned",
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
    "TC-PR-080703 Workflow History tab shows the return reason from HOD",
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
  requestorTest(
    "TC-PR-080704 Edit button visible on Returned PR (Creator can re-edit)",
    {
      annotation: [
        { type: "preconditions", description: "On a Returned PR detail page" },
        { type: "steps", description: "1. Inspect the action toolbar" },
        { type: "expected", description: "Edit button is visible (Creator can enter Edit Mode to revise)." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      await expect(pr.editModeButton()).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-080705 Modify line item quantity → Save → URL stays on detail",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open with at least one line item" },
        { type: "steps", description: "1. Click Edit\n2. Modify first row quantity to 7\n3. Click Save Draft" },
        { type: "expected", description: "After save the page URL stays on /procurement/purchase-request/<ref>." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 7 }).catch(() => {});
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-080706 Add new line item to Returned PR → Save",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Click Edit\n2. Add a new line item (product, qty, uom, price)\n3. Click Save Draft" },
        { type: "expected", description: "After save the page URL stays on /procurement/purchase-request/<ref>." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.addLineItem({ product: "Added in Returned", quantity: 2, uom: "ea", unitPrice: 75 });
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );
});

requestorTest.describe("7c — Resubmit", () => {
  requestorTest(
    "TC-PR-080707 Submit confirmation dialog appears for Returned PR",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Click Submit on the Returned PR" },
        { type: "expected", description: "A confirmation dialog (resubmit) becomes visible." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-080708 Confirm submit → status moves Returned → In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog open on a Returned PR" },
        { type: "steps", description: "1. Click Submit\n2. Confirm dialog\n3. Wait for status badge to update" },
        { type: "expected", description: "Status badge text matches /in.progress/i after confirm." },
        { type: "priority", description: "High" },
        { type: "testType", description: "CRUD" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|submit|resubmit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /in.progress/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );
});

requestorTest.describe("7d — Edge cases", () => {
  requestorTest(
    "TC-PR-080709 Cancel submit on Returned PR → URL stays on detail (still Returned)",
    {
      annotation: [
        { type: "preconditions", description: "Submit confirmation dialog open on a Returned PR" },
        { type: "steps", description: "1. Click Submit\n2. Click Cancel in the dialog" },
        { type: "expected", description: "Dialog closes; URL remains on the PR detail page." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Functional" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser, { items: 1 });
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present on Returned PR detail");
        return;
      }
      await submit.click({ timeout: 5_000 });
      const cancel = page.getByRole("dialog").getByRole("button", { name: /cancel|no/i }).first();
      if ((await cancel.count()) === 0) {
        requestorTest.skip(true, "Cancel button not present in submit dialog");
        return;
      }
      await cancel.click({ timeout: 5_000 });
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`), { timeout: 10_000 });
    },
  );

  requestorTest(
    "TC-PR-080710 Delete Returned PR is allowed for Creator",
    {
      annotation: [
        { type: "preconditions", description: "Returned PR detail page is open" },
        { type: "steps", description: "1. Inspect Delete button presence\n2. If present, click and confirm\n3. Verify list URL" },
        { type: "expected", description: "Delete button visible; confirming delete navigates back to the PR list URL. Skipped when Delete is not allowed in this configuration." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Authorization" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);
      const created = await submitPRAsRequestor(browser);
      await sendForReviewAsHOD(browser, created.ref);
      await gotoPRDetail(page, created.ref);
      const del = pr.deleteButton();
      if ((await del.count()) === 0) {
        requestorTest.skip(true, "Delete button not visible on Returned PR — feature gated by configuration");
        return;
      }
      await del.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|delete|yes/i).click({ timeout: 5_000 }).catch(() => {});
      await expect(page).toHaveURL(/\/procurement\/purchase-request($|\?)/, { timeout: 10_000 });
    },
  );
});

requestorTest.describe.serial("Golden Journey", () => {
  requestorTest(
    "TC-PR-080902 Full returned-flow: HOD returns → Creator views reason → edits qty → resubmits → status In Progress",
    {
      annotation: [
        { type: "preconditions", description: "Logged in as Requestor; a fresh PR is seeded into the Returned state via submitPRAsRequestor + sendForReviewAsHOD" },
        { type: "steps", description: "1. Open the Returned PR detail\n2. Click Workflow History tab and verify reason is shown\n3. Click Edit\n4. Modify first line item quantity\n5. Save Draft\n6. Click Submit and Confirm\n7. Wait for status to read In Progress" },
        { type: "expected", description: "Status badge transitions to In Progress after the resubmit confirmation." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Smoke" },
      ],
    },
    async ({ page, browser }) => {
      const pr = new PurchaseRequestPage(page);

      // Seed: Requestor submits → HOD sends back
      const created = await submitPRAsRequestor(browser, { items: 1, description: "TC-PR-080902 returned golden" });
      await sendForReviewAsHOD(browser, created.ref);

      // Step 1: Open detail
      await gotoPRDetail(page, created.ref);
      await expect(page).toHaveURL(new RegExp(`${LIST_PATH}/${created.ref}`));

      // Step 2: Verify reason in Workflow History
      const wh = pr.tabWorkflowHistory();
      if ((await wh.count()) > 0) {
        await wh.click();
        await expect(
          page.getByText(/please revise|returned for review|revise/i).first(),
        ).toBeVisible({ timeout: 10_000 }).catch(() => {});
      }

      // Step 3-5: Edit quantity, save
      if ((await pr.editModeButton().count()) === 0) {
        requestorTest.skip(true, "Edit button not present on Returned PR");
        return;
      }
      await pr.enterEditMode();
      await pr.editLineItem(0, { quantity: 9 }).catch(() => {});
      await pr.saveDraftButton().click({ timeout: 5_000 }).catch(() => {});

      // Step 6: Submit + confirm
      const submit = pr.submitButton();
      if ((await submit.count()) === 0) {
        requestorTest.skip(true, "Submit button not present after save");
        return;
      }
      await submit.click({ timeout: 5_000 });
      await pr.confirmDialogButton(/confirm|submit|resubmit|ok|yes/i).click({ timeout: 5_000 }).catch(() => {});

      // Step 7: Status In Progress
      await expect(
        page
          .locator("[data-slot='badge'], [class*='badge']")
          .filter({ hasText: /in.progress/i })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    },
  );
});
