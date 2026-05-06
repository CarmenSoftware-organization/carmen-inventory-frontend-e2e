import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseRequestPage, LIST_PATH } from "./pages/purchase-request.page";
import {
  submitPRAsRequestor,
  approveAsHOD,
  bulkApprove,
  bulkReject,
  bulkSendForReview,
  gotoPRDetail,
} from "./pages/pr-approver.helpers";

// Persona-journey spec — Purchaser. Runs alongside 301/302/303.
// Source docs: docs/persona-doc/Purchase Request/Purchaser/INDEX.md and step-01..04.md.
const purchaseTest = createAuthTest("purchase@blueledgers.com");

const REJECT_REASON = "Vendor pricing exceeds budget";
const REVIEW_REASON = "Please confirm vendor selection";
const REVIEW_STAGE = "HOD";

purchaseTest.describe("Step 1 — PR List (Purchaser View)", () => {
  // TCs added in Task 5
});

purchaseTest.describe("Step 2 — PR Detail (Read-only)", () => {
  // TCs added in Task 6
});

purchaseTest.describe("Step 3 — Edit Mode (Vendor & Pricing)", () => {
  // TCs added in Task 7
});

purchaseTest.describe("Step 4 — Workflow Actions", () => {
  // TCs added in Task 8
});

purchaseTest.describe.serial("Golden Journey", () => {
  // TC added in Task 9
});
