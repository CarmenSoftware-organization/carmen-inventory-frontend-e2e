---
version: 1.0.0
last_updated: 2026-04-27
changelog:
  - 1.0.0 | 2026-04-27 | Initial draft — WR is a separate transaction type (Wastage Report, prefix WST-) per BR-wastage-reporting.md v1.4.0; corrects prior incorrect assumption that WR = ADJ OUT category
---

# Transaction 11 — Wastage Report (WR)

**Document prefix:** `WST-YYYY-MMDD-NNNN` (e.g. `WST-2026-0427-0001`)  
**Reference type code in inventory ledger:** `WR`  
**What it is:** Operational front-line capture of waste, damage, theft, samples, and write-off events. The WST document is the **evidence and approval layer** — it holds photos, category/reason classification, approver notes, and supplier charge-back links. Upon approval, the system automatically generates a downstream Stock Out inventory adjustment that posts to the inventory ledger. WR ≠ ADJ; WR *produces* an ADJ when approved (FR-WAST-005, FR-WAST-020).

**Who creates it:** Kitchen Staff, Store Manager, Chef (at the point of occurrence)  
**Approvers:** Department Manager ($50–$200), Store Manager ($200–$500), Store Manager + Finance Manager (>$500) — see BR-WAST-007  
**Status flow:** `Draft` → `Submitted` → `Under Review` → `Approved` | `Rejected` → `Posted`  
**Period-end valid statuses:** `Posted` or `Approved` both satisfy VAL-PE-014 (Stage 1 gate)

---

## Status Values

| Status | Meaning | Terminal? |
|---|---|---|
| `Draft` | Recorded but not yet submitted | No |
| `Submitted` | Sent to approver queue | No |
| `Under Review` | Approver has opened the record | No |
| `Approved` | Approved — "Post to Stock Out" action available | No |
| `Rejected` | Rejected with mandatory reason — cannot be edited or resubmitted (BR-WAST-010) | Yes |
| `Posted` | Inventory adjustment generated and posted to ledger | Yes |

Period-end Stage 1 (VAL-PE-014) accepts **Posted** or **Approved** — a WR that is Approved but not yet Posted still satisfies the gate.

---

## System Effects (in order)

| Step | Process | Location Types Affected | Lot Impact | Cost Impact |
|---|---|---|---|---|
| 1 | Approval — "Post to Stock Out" triggered | INV, CON | — | — |
| 2 | Inventory Update | INV, CON only (DIR = metrics only, no qty change) | — | — |
| 3 | Lot Management | INV, CON | Oldest lot consumed / closed | — |
| 4 | Cost Calculation | INV, CON | — | FIFO / Weighted Average: wastage value = qty × unit cost at time of wastage |
| 5 | GL posting | INV, CON | — | Dr Wastage Expense / Cr Inventory Asset (INV) or Cr Vendor Liability (CON) |
| — | DIRECT location | DIR | No inventory adjustment, no GL posting | Items already expensed at receipt |

### Step Detail

**Step 1 — Approval trigger:**  
When an approver acts on a WR and the value threshold for that tier is met, status transitions to `Approved`. The "Post to Stock Out" button is then enabled on the WR detail page.

**Step 2 — Inventory Update:**  
For **INV** and **CON** locations: QOH decreases by the approved wastage quantity.  
For **DIR** locations: no inventory balance exists. Wastage is recorded for operational metrics and analytics only — no QOH change (BR-WAST-017).

**Step 3 — Lot Management:**  
Oldest lot consumed first at the inventory location (FIFO layer selection). If wastage qty spans multiple lots, each is consumed in chronological order. Lot closed when fully consumed.

**Step 4 — Cost Calculation:**  
Wastage value = Wastage Qty × Unit Cost at time of wastage (BR-WAST-011). Cost method follows the location's configuration: FIFO or Weighted Average (Periodic Average). Value posted as a wastage expense, not COGS — though wastage is included in COGS for P&L reporting purposes (FR-WAST-015).

**Step 5 — GL posting:**  
| Location type | Debit | Credit |
|---|---|---|
| INV | Wastage Expense account (category-specific GL) | Inventory Asset |
| CON | Wastage Expense account | Vendor Liability + auto vendor charge-back notification |
| DIR | No posting | No posting |

---

## Location-Type Matrix

| Feature | INVENTORY (INV) | DIRECT (DIR) | CONSIGNMENT (CON) |
|---|---|---|---|
| Wastage tracking | Full | Metrics only | Full |
| Inventory adjustment | ✅ QOH reduced | ❌ None | ✅ QOH reduced |
| Cost layer consumption | ✅ FIFO | ❌ None | ✅ FIFO |
| GL impact | Expense + Asset ↓ | None | Expense + Vendor Liability ↓ |
| Approval workflow | Value-based | Simplified | Value-based + Vendor |
| Vendor charge-back | ❌ N/A | ❌ N/A | ✅ Auto-notification |
| Photo requirements | Value-based | Optional | Value-based |

---

## WR vs ADJ-OUT — why both exist

WR and ADJ-OUT (tx-07) both produce OUT-direction inventory transactions, but they are distinct documents with different purposes:

| Dimension | **Wastage Report (WR)** | **Stock Out Adjustment (ADJ-OUT)** |
|---|---|---|
| Module | Store Operations | Inventory Management |
| Document prefix | `WST-YYYY-MMDD-NNNN` | `ADJ-...` |
| Ledger reference code | `WR` | `ADJ` |
| Direction | OUT only | IN or OUT |
| Primary purpose | Front-line operational waste capture with evidence and approval | Generic stock correction |
| Approval workflow | Mandatory tiered (value-based: $50/$200/$500) | Standard ADJ approval |
| Photo evidence | Mandatory >$100 (1 photo), >$500 (2 photos, watermarked) | Not mandated |
| Categories | WST / DMG / THEFT / SAMPLE / WRITE + 9 item-level reasons | Generic adjustment categories/reasons |
| Supplier quality tracking | Yes — flags wastage to specific GRN/vendor for charge-back | No |
| Inventory posting method | WR approval **generates** a Stock Out ADJ as downstream artifact | Direct posting |
| GL accounts | Wastage Expense (category-mapped, not generic inventory adj) | Inventory Adjustment account |
| Persona | Kitchen Staff (front-line mobile capture) | Inventory Manager / Storekeeper |
| Period End check | VAL-PE-014 (separate WR gate) | ADJ gate |

**Architecture note:** A posted WR generates a Stock Out transaction that appears in the Inventory Ledger under reference type `WR`. These records appear in the Stock Out list view alongside ADJ records — but they are *originated* in the WR module, not the Adjustments module.

---

## WR Categorisation

### Header category (one per WST document)

| Code | Name | Typical use |
|---|---|---|
| WST | Wastage (default) | General food/beverage waste |
| DMG | Damaged Goods | Product damaged in storage or handling |
| THEFT | Theft / Loss | Missing stock suspected theft |
| SAMPLE | Samples | Product given as sample/tasting |
| WRITE | Write-Off | Obsolete or unsaleable stock |

### Item-level reason (per line item)

| Code | Reason |
|---|---|
| EXP | Expired |
| SPOIL | Spoiled |
| QUAL | Quality Issue |
| DMG | Damaged |
| CONT | Contaminated |
| OVERPROD | Overproduction |
| PREP | Prep Waste |
| PLATE | Plate Waste |
| SPILL | Spill / Accident |

---

## Process Swim Lane

```mermaid
sequenceDiagram
    participant STAFF as Kitchen / Store Staff
    participant SYS as System
    participant APPR as Approver(s)
    participant INV as Inventory
    participant COST as Cost Calculation
    participant GL as GL / Finance

    STAFF->>SYS: Record wastage — product, qty, category, reason, photo
    SYS->>SYS: Validate (qty ≤ QOH, reason ≥20 chars, photo if >$100)
    SYS->>STAFF: WST-YYYY-MMDD-NNNN created (Draft)

    STAFF->>SYS: Submit
    SYS->>APPR: Route to approver based on value threshold (BR-WAST-007)
    Note over APPR: Dept Mgr ($50–200) · Store Mgr ($200–500) · +Finance Mgr (>$500)

    APPR->>SYS: Approve
    SYS->>SYS: Status → Approved; "Post to Stock Out" enabled

    SYS->>INV: Decrease QOH at location (INV/CON only)
    INV->>COST: Consume oldest lot(s) — FIFO cost layers
    COST->>GL: Dr Wastage Expense / Cr Inventory Asset (INV) or Vendor Liability (CON)
    SYS->>SYS: Status → Posted; WR record locked
```

---

## Before / After Example

**Scenario:** 8 kg of salmon written off at Main Kitchen (INV location) — `SPOIL` reason under `WST` category. Value = 8 × 450.00 = 3,600 THB → requires Store Manager + Finance Manager approval.

| Field | Before Wastage Report | After Posted |
|---|---|---|
| Salmon · Main Kitchen QOH | 50 kg | 42 kg |
| LOT-002 qty | 25 kg @ 450.00 | 17 kg @ 450.00 |
| Wastage Expense posted | — | 8 × 450.00 = 3,600.00 |
| Inventory Asset | — | Reduced by 3,600.00 |
| WR status | — | `Posted` |

---

## Business Rules

| # | Rule | BRD Source |
|---|---|---|
| BR-01 | Record on day of occurrence or within 24h; backdate >7 days requires Finance Manager approval | BR-WAST-001 |
| BR-02 | One category per WST document; secondary categories noted in reason field only | BR-WAST-002 |
| BR-03 | Value >$100: at least 1 photo required; value >$500: at least 2 photos (different angles, watermarked) | BR-WAST-003 |
| BR-04 | Wastage qty cannot exceed QOH; warning shown if >50% of current stock | BR-WAST-004 |
| BR-05 | Reason description: 20–500 chars; generic terms ("bad", "waste") rejected | BR-WAST-005 |
| BR-06 | Wastage date cannot be >7 days in past (without special approval) or in the future | BR-WAST-006 |
| BR-07 | Approval thresholds: <$50 auto (expired within 24h of expiry); $50–$200 Dept Mgr; $200–$500 Store Mgr; >$500 Store Mgr + Finance Mgr | BR-WAST-007 |
| BR-08 | Users cannot approve their own wastage; self-approval routes to next level | BR-WAST-008 |
| BR-09 | 48-business-hour SLA for approval; escalates automatically if overdue | BR-WAST-009 |
| BR-10 | Rejected WR is terminal — cannot be edited/resubmitted; a new WST document must be created | BR-WAST-010 |
| BR-11 | Wastage value = Qty × Unit Cost at time of wastage (FIFO / Weighted Average per location config) | BR-WAST-011 |
| BR-12 | Daily wastage % = (Daily Wastage Value / Daily COGS) × 100; F&B benchmark 4–10% | BR-WAST-012 |
| BR-13 | Overproduction wastage after 9:00 PM auto-flagged for production planning review | BR-WAST-013 |
| BR-14 | Users can only record for locations they have access to | BR-WAST-014 |
| BR-15 | Approval requires "Wastage Approver" role-based permission | BR-WAST-015 |
| BR-16 | History visible only to users with location access or "View All Wastage" permission | BR-WAST-016 |
| BR-17 | Location type determines processing: INV/CON = full inventory + GL; DIR = metrics only | BR-WAST-017 |
| BR-18 | Feature matrix per location type (see Location-Type Matrix section) | BR-WAST-018 |
| BR-19 | Location type determines validation: INV/CON qty ≤ QOH; DIR no qty limit | BR-WAST-019 |

---

## Edge Cases

| Scenario | System Behaviour |
|---|---|
| Backdating >7 days | Requires Finance Manager approval before submission is accepted |
| Photo missing when value >$100 | Submission blocked — at least 1 photo must be attached |
| WR value crosses approval tier after submission | TBC — whether threshold is rechecked at approval time or locked at submission |
| CON location — wastage approved | Inventory reduced + vendor charge-back notification auto-generated |
| DIR location — wastage recorded | No inventory adjustment; no GL posting; metrics and analytics only |
| Anomaly detection flag | Daily job flags WR if value is >3 standard deviations from historical average for that product/location |
| Rejected WR | Status = Rejected (terminal); original WST record preserved for audit; new WST document required |
| Partial approval (qty reduced by approver) | Remaining qty returned to Draft for re-submission (FR-WAST-004) |

---

## Period End Interaction

This transaction participates in **End Period Close Stage 1 — Transactions** (VAL-PE-014):

| Gate | Required Status | Error message if not met |
|---|---|---|
| All WR documents in period | `Posted` or `Approved` | "{count} WR pending" |

WR documents in `Draft`, `Submitted`, `Under Review`, or `Rejected` status block Stage 1. The Finance Controller must ensure all open WR records are approved and/or posted before initiating End Period Close.

---

## Related Documents

→ [INDEX.md](INDEX.md) — transaction × process matrix  
→ [tx-07-stock-out-adj.md](tx-07-stock-out-adj.md) — the Stock Out adjustment generated when WR is posted  
→ [tx-09-end-period-close.md](tx-09-end-period-close.md) — Stage 1 WR gate (VAL-PE-014)  
→ [proc-01-inventory-update.md](proc-01-inventory-update.md)  
→ [proc-02-lot-management.md](proc-02-lot-management.md)  
→ [proc-03-cost-calculation.md](proc-03-cost-calculation.md)  
→ Source BRD: `/Users/peak/Documents/GitHub/carmen/docs/app/store-operations/wastage-reporting/BR-wastage-reporting.md`
