---
version: 1.0.0
last_updated: 2026-04-26
changelog:
  - 1.0.0 | 2026-04-26 | Initial draft
---

# Process 02 — Lot Management

**What this process does:** Creates, consumes, or adjusts lot records whenever inventory at an **inventory location** changes. Lots are NOT tracked at Direct or Consignment locations.

---

## P1 Overview (Business Layer)

A lot is a uniquely identified batch of a product at a specific inventory location. When goods arrive (GRN, Stock In adj), a new lot is created. When goods leave (SR, Issues, Sales, Stock Out adj, CRN), the appropriate lot is consumed. Physical Stocktake variances adjust existing lots in place. End Period Close closes any open lots.

**Key rule:** One lot = one inventory location. A lot cannot span multiple locations. If 100 units of the same product arrive in two separate GRNs at the same location, they may be two separate lots — or merged into one depending on system configuration (TBC).

**Example — GRN creates a lot:**

| Field | Value |
|---|---|
| Product | Rice Flour 25 kg |
| Inventory location | WH-01 — Dry Store |
| Lot number | LOT-20260426-001 |
| Qty | 50 bags |
| Expiry date | 2026-10-31 |

When 20 bags are issued (Issues transaction), LOT-20260426-001 reduces from 50 → 30 bags.

---

## P2 Rules (Business Analyst Layer)

### Lot Tracking Scope

| Location Type | Lot Tracked? | Notes |
|---|---|---|
| Inventory | ✅ Yes | All lot management runs here |
| Direct | ❌ No | Goods at direct locations have no lot record |
| Consignment | ❌ No | Goods at consignment locations have no lot record |

### Lot Actions by Transaction

| Transaction | Lot Action | Location |
|---|---|---|
| GRN | Create new lot | Inventory (receiving) |
| CRN | Reverse / close lot | Inventory |
| SR | Consume lot qty at source | Inventory (source only) — no lot at destination |
| Issues | Consume lot qty | Inventory |
| Sales | Consume lot qty | Inventory |
| Stock In (adj) | Create new lot | Inventory |
| Stock Out (adj) | Consume lot qty | Inventory |
| Physical Stocktake — positive variance | Adjust lot qty up (or create new lot) | Inventory |
| Physical Stocktake — negative variance | Adjust lot qty down (or close lot) | Inventory |
| End Period Close | Close all open lots for the period | Inventory |

### Lot Granularity Rule

- **1 lot = 1 inventory location** — a lot is always tied to a single location
- Transferring goods between inventory locations (if supported) creates a new lot at the destination and closes the source lot
- SR to Direct/Consignment: source inventory lot is consumed; **no lot record is created** at the destination

### Consumption Order (FIFO for lots)

When a transaction consumes from a location, lots are consumed in chronological order (oldest lot first), regardless of whether the BU's cost method is AVCO or FIFO. This is lot-level FIFO for traceability — separate from cost calculation method.

*(TBC — verify whether the system enforces oldest-first or allows manual lot selection)*

---

## P3 System Behaviour (Developer Layer)

### Input Contract

| Input | Source |
|---|---|
| Product ID | Transaction line item |
| Inventory location ID | Transaction line item (source) |
| Quantity | Transaction line item qty |
| Transaction type | Determines create vs consume vs adjust |
| Lot metadata (GRN/Stock In) | Supplier lot number, expiry date, manufacture date (if applicable) |

### Output Contract

| Output | Where it lands |
|---|---|
| New lot record | `inventory_lots` table |
| Updated lot qty | `inventory_lots.qty_remaining` |
| Closed lot | `inventory_lots.status = CLOSED` |

### Sequencing

1. **Inventory Update** (Process 01) runs first — updates QOH
2. **Lot Management** (this process) runs second — updates lot records to match QOH change

Lot Management does not run for:
- End Period Close's snapshot step (lots are closed, not updated)
- SR destination location (Direct/Consignment)
- Any transaction at a Direct or Consignment location

### What This Process Does NOT Do

- Does not track lots at Direct or Consignment locations
- Does not calculate cost (Process 03)
- Does not enforce expiry date blocks (that is a separate validation layer — TBC)
- Does not split a lot across two locations

---

## P4 Open Questions / Confirmed Answers

| # | Question | Answer | Source |
|---|---|---|---|
| 1 | Lot = 1 location confirmed | ✓ 1 lot = 1 inventory location | User confirmed 2026-04-26 |
| 2 | Lot tracking scope | ✓ Inventory locations only; Direct and Consignment excluded | User confirmed 2026-04-26 |
| 3 | Consumption order (FIFO for lots) | TBC — manual selection vs automatic oldest-first | — |
| 4 | Same product, same location, two GRNs — merged into one lot or two? | TBC | — |
| 5 | Does Stock In adj always create a new lot, or can it top up an existing lot? | TBC | — |
| 6 | End Period Close — are lots closed or just snapshotted? | TBC | — |

---

## Related Documents

→ [INDEX.md](INDEX.md) — transaction × process matrix  
→ [proc-01-inventory-update.md](proc-01-inventory-update.md) — qty change that precedes lot management  
→ [proc-03-cost-calculation.md](proc-03-cost-calculation.md) — FIFO cost method uses lot order  
→ [tx-03-sr.md](tx-03-sr.md) — SR: lot consumed at inventory source; no lot at Direct/Consignment destination
