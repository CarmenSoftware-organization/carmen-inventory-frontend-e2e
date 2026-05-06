# Test ID Scheme

Format: `TC-<PREFIX>-XXYYYY` where `XX` = section block (01–99), `YYYY` = sequence within section (0001–9999).

Strict regex: `^TC-[A-Z]{2,5}-\d{6}$`

## Section block template

| Block | Purpose |
|-------|---------|
| 01 | List / Search / Filter |
| 02 | Detail / View |
| 03 | Create |
| 04 | Edit / Update |
| 05 | Delete |
| 06–09 | Sub-journeys (Creator / Approver / Purchaser / Returned, etc.) |
| 10–19 | Security / Authorization |
| 20–29 | Validation |
| 30–39 | Integration / External |
| 40–89 | Module-specific |
| 90–99 | Edge cases / experimental |

## Module catalog

| Spec file | Prefix | Sections used | Notes |
|-----------|--------|---------------|-------|
| `001-login.spec.ts` | `LOGIN` | 01, 10–19 | Login flows + security |
| `010-department.spec.ts` | `DEP` | 01–05 | CRUD |
| `020-unit.spec.ts` | `UN` | 01–05 | CRUD |
| `029-business-type.spec.ts` | `BT` | 01–05 | CRUD |
| `030-extra-cost.spec.ts` | `EC` | 01–05 | CRUD |
| `031-adjustment-type.spec.ts` | `AT` | 01–05 | CRUD |
| `032-credit-term.spec.ts` | `CT` | 01–05 | CRUD |
| `040-currency.spec.ts` | `CUR` | 01–05 | CRUD |
| `041-exchange-rate.spec.ts` | `ER` | 01–02 | List/Detail |
| `042-tax-profile.spec.ts` | `TP` | 01–05 | CRUD |
| `079-delivery-point.spec.ts` | `DP` | 01–05, 10–19 | CRUD + security |
| `080-location.spec.ts` | `LOC` | 01–05 | CRUD |
| `101-product-category.spec.ts` | `CAT` | 01 (CATEG-collapsed), 02 (PRODU-collapsed), 03 (RECIP-collapsed) | Multi-prefix collapse |
| `150-vendor.spec.ts` | `VEN` | 01–05, 10–19 | CRUD + security |
| `159-price-list.spec.ts` | `PL` | 01–05 | CRUD |
| `160-price-list-template.spec.ts` | `PT` | 01–05 | CRUD |
| `201-my-approvals.spec.ts` | `MA` | 01 (MY-collapsed), 02 (APPR-collapsed) | Multi-prefix collapse |
| `301-purchase-request.spec.ts` | `PR` | 01–04, 10–19, 20–29 | Module entry point |
| `302-pr-creator-journey.spec.ts` | `PR` | 05 | Sub-journey |
| `303-pr-approver-journey.spec.ts` | `PR` | 06 | Sub-journey |
| `304-pr-purchaser-journey.spec.ts` | `PR` | 07 | Sub-journey |
| `310-purchase-request-template.spec.ts` | `PRT` | 01–05 (TPL-collapsed into 02) | Multi-prefix collapse |
| `311-pr-returned-flow.spec.ts` | `PR` | 08 | Sub-journey |
| `401-purchase-order.spec.ts` | `PO` | 01–04, 10–19, 20–29 | Module entry point |
| `402-po-purchaser-journey.spec.ts` | `PO` | 06 | Sub-journey |
| `403-po-approver-journey.spec.ts` | `PO` | 07 | Sub-journey |
| `501-good-received-note.spec.ts` | `GRN` | 01–05, 10–19 | CRUD + security |
| `601-credit-note.spec.ts` | `CN` | 01–05, 10–19 | CRUD + security |
| `602-credit-note-reason.spec.ts` | `CNR` | 01–05 | CRUD |
| `701-store-requisition.spec.ts` | `SR` | 01–05, 10–19 | CRUD + security |
| `720-stock-issue.spec.ts` | `SI` | 01–05, 10–19 | CRUD + security |
| `900-period-end.spec.ts` | `PE` | 01–05 | CRUD |
| `1001-campaign.spec.ts` | `CAM` | 01–05 (RP-collapsed into 04) | Multi-prefix collapse |

## Adding a new module

1. Pick a unique 2–5 letter prefix not already in the table.
2. Add the row above with the section blocks you intend to use.
3. Commit the catalog change with the spec that introduces the prefix.
4. The audit script reads this table; an unknown prefix or unregistered section will fail CI.

## Adding a section to an existing module

1. Edit the row's "Sections used" column.
2. Commit alongside the new tests.
