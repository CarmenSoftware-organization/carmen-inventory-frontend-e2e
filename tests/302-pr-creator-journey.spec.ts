import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH, NEW_PATH } from "./pages/purchase-request.page";
import { createDraftPR, submitDraftPR, deleteDraftPR, e2eDescription } from "./pages/pr-creator.helpers";

// Persona-journey spec — Creator (Requestor). Runs alongside 301-purchase-request.spec.ts
// (per-action multi-role) without modifying it. Source docs:
// docs/persona-doc/Purchase Request/Creator/INDEX.md and step-01..08.md.
const requestorTest = createAuthTest("requestor@blueledgers.com");

const FUTURE_DATE = "2099-12-31";
const PAST_DATE = "2020-01-01";

requestorTest.describe("Step 1 — PR List", () => {
  // TCs added in Task 6
});

requestorTest.describe("Step 2 — Create PR (Blank)", () => {
  // TCs added in Task 7
});

requestorTest.describe("Step 3 — Create from Template", () => {
  // TCs added in Task 8
});

requestorTest.describe("Step 4 — PR Detail", () => {
  // TCs added in Task 9
});

requestorTest.describe("Step 5 — Edit Draft", () => {
  // TCs added in Task 10
});

requestorTest.describe("Step 6 — Submit", () => {
  // TCs added in Task 11
});

requestorTest.describe("Step 8 — Delete", () => {
  // TCs added in Task 12
});

requestorTest.describe.serial("Golden Journey", () => {
  // TC added in Task 13
});
