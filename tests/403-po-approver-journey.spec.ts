import { test as baseTest, expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { PurchaseOrderPage, LIST_PATH } from "./pages/purchase-order.page";
import {
  submitPOAsPurchaser,
  gotoPODetail,
} from "./pages/po-approver.helpers";

// Persona-journey spec — PO FC Approver. Runs alongside 401/402.
// Source docs: docs/persona-doc/Purchase Order/Approver/INDEX.md
// and step-01..03.md.
const fcTest = createAuthTest("fc@blueledgers.com");

const SEND_BACK_REASON = "Please verify pricing";
const REJECT_REASON = "Vendor pricing exceeds budget";

fcTest.describe("Step 1 — My Approval", () => {
  // TCs added in Task 4
});

fcTest.describe("Step 2 — PO Detail (FC view)", () => {
  // TCs added in Task 5
});

fcTest.describe("Step 3 — Approval Actions", () => {
  // TCs added in Task 6
});

fcTest.describe.serial("Golden Journey", () => {
  // TC added in Task 7
});
