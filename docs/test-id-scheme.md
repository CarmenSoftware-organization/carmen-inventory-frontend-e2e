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
| `010-department.spec.ts` | `DEP` | 01–05, 10 | CRUD + security |
| `020-unit.spec.ts` | `UN` | 01–05, 10 | CRUD + security |
| `029-business-type.spec.ts` | `BT` | 01–05, 10 | CRUD + security |
| `030-extra-cost.spec.ts` | `EC` | 01–05, 10 | CRUD + security |
| `031-adjustment-type.spec.ts` | `AT` | 01–05, 10 | CRUD + security |
| `032-credit-term.spec.ts` | `CT` | 01–05, 10 | CRUD + security |
| `040-currency.spec.ts` | `CUR` | 01–05, 10 | CRUD + security |
| `041-exchange-rate.spec.ts` | `ER` | 01–02, 10 | List/Detail + security |
| `042-tax-profile.spec.ts` | `TP` | 01–05, 10 | CRUD + security |
| `079-delivery-point.spec.ts` | `DP` | 01–05, 10–19 | CRUD + security |
| `080-location.spec.ts` | `LOC` | 01–05, 10 | CRUD + security |
| `101-product-category.spec.ts` | `CAT` | 01–15, 20–29, 90 | Multi-prefix collapse (CATEG/PRODU/RECIP) |
| `150-vendor.spec.ts` | `VEN` | 01–05, 10–19 | CRUD + security |
| `159-price-list.spec.ts` | `PL` | 01–08, 90 | CRUD + sub-journeys + edge cases |
| `160-price-list-template.spec.ts` | `PT` | 01–06, 90 | CRUD + sub-journeys + edge cases |
| `201-my-approvals.spec.ts` | `MA` | 01–06, 90 | CRUD + edge cases |
| `301-purchase-request.spec.ts` | `PR` | 01–09, 10–13, 20–22, 30–39, 40–49, 60–63, 90 | Module entry point + sub-journeys (05–08) |
| `310-purchase-request-template.spec.ts` | `PRT` | 01–11, 20–29, 90 | CRUD + validation |
| `401-purchase-order.spec.ts` | `PO` | 01–07, 10–19, 20–29, 30–39, 90 | Module entry point + sub-journeys (06–07) |
| `501-good-received-note.spec.ts` | `GRN` | 01–18, 90 | CRUD + sub-journeys + security + edge cases |
| `601-credit-note.spec.ts` | `CN` | 01–11, 20–29, 30–39, 50–54, 90 | CRUD + validation + integration |
| `602-credit-note-reason.spec.ts` | `CNR` | 01–05, 10 | CRUD + security |
| `701-store-requisition.spec.ts` | `SR` | 01–12, 90 | CRUD + sub-journeys + security + edge cases |
| `720-stock-issue.spec.ts` | `SI` | 01–06, 90 | CRUD + sub-journeys + edge cases |
| `900-period-end.spec.ts` | `PE` | 01–04, 31–34, 90 | CRUD + integration + edge cases |
| `1001-campaign.spec.ts` | `CAM` | 01–10, 90 | CRUD + sub-journeys + edge cases |

## Adding a new module

1. Pick a unique 2–5 letter prefix not already in the table.
2. Add the row above with the section blocks you intend to use.
3. Commit the catalog change with the spec that introduces the prefix.
4. The audit script reads this table; an unknown prefix or unregistered section will fail CI.

## Adding a section to an existing module

1. Edit the row's "Sections used" column.
2. Commit alongside the new tests.
