# Coverage Matrix — routes ↔ specs ↔ catalogs

**Generated file — do not edit.** Run `bun audit:coverage` to refresh.

Parsed from the frontend router (`routes/router.tsx`): **167 routes** across **102 modules**.

| Status | Meaning | Modules |
| --- | --- | --- |
| ✅ spec | an automated Playwright spec drives this module | 36 |
| 📄 catalog | a hand-authored test-case catalog documents it, no spec yet | 31 |
| ❌ none | neither — this is the coverage gap | 35 |

## *

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/*` | 1 | — | — | ❌ none |

## Accounting

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/accounting` | 1 | — | — | ❌ none |
| `/accounting/accounts-payable` | 1 _(redirect)_ | — | — | ❌ none |
| `/accounting/accounts-payable/invoice` | 2 | — | — | ❌ none |
| `/accounting/accounts-payable/payment` | 2 | — | — | ❌ none |
| `/accounting/accounts-receivable` | 1 _(redirect)_ | — | — | ❌ none |
| `/accounting/accounts-receivable/invoice` | 2 | — | — | ❌ none |
| `/accounting/accounts-receivable/receipt` | 2 | — | — | ❌ none |
| `/accounting/allocation-voucher` | 2 | — | — | ❌ none |
| `/accounting/financial-reports` | 2 | — | — | ❌ none |
| `/accounting/journal-voucher` | 2 | — | — | ❌ none |
| `/accounting/recurring-voucher` | 2 | — | — | ❌ none |
| `/accounting/template-voucher` | 2 | — | — | ❌ none |

## Config (master data)

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/config` | 1 | `002-spa-smoke.spec.ts` | — | ✅ spec |
| `/config/account-mapping` | 1 | — | `081-account-mapping.md` | 📄 catalog |
| `/config/adjustment-type` | 1 | `031-adjustment-type.spec.ts` | — | ✅ spec |
| `/config/business-type` | 1 | `029-business-type.spec.ts` | — | ✅ spec |
| `/config/chart-of-accounts` | 1 | — | `082-chart-of-accounts.md` | 📄 catalog |
| `/config/credit-note-reason` | 1 | `602-cn-reason.spec.ts` | — | ✅ spec |
| `/config/credit-term` | 1 | `032-credit-term.spec.ts` | — | ✅ spec |
| `/config/currency` | 1 | `040-currency.spec.ts` | — | ✅ spec |
| `/config/delivery-point` | 1 | `079-delivery-point.spec.ts` | — | ✅ spec |
| `/config/department` | 3 | `002-spa-smoke.spec.ts`<br>`010-department.spec.ts` | — | ✅ spec |
| `/config/exchange-rate` | 1 | `041-exchange-rate.spec.ts` | — | ✅ spec |
| `/config/extra-cost` | 1 | `030-extra-cost.spec.ts` | — | ✅ spec |
| `/config/location` | 3 | `080-location.spec.ts` | — | ✅ spec |
| `/config/shelf` | 1 | — | `083-shelf.md` | 📄 catalog |
| `/config/tax-profile` | 1 | `042-tax-profile.spec.ts` | — | ✅ spec |
| `/config/unit` | 1 | `002-spa-smoke.spec.ts`<br>`020-unit.spec.ts` | — | ✅ spec |

## Dashboard

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/dashboard` | 1 | `001-login.spec.ts`<br>`002-spa-smoke.spec.ts` | `1200-dashboard.md` | ✅ spec |

## forgot-password

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/forgot-password` | 1 | — | — | ❌ none |

## Inventory Management

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/inventory-management` | 1 | — | — | ❌ none |
| `/inventory-management/inventory-adjustment` | 3 | — | `730-inventory-adjustment.md` | 📄 catalog |
| `/inventory-management/period-end` | 2 | `900-period-end.spec.ts` | — | ✅ spec |
| `/inventory-management/physical-count` | 5 | — | `750-physical-count.md` | 📄 catalog |
| `/inventory-management/spot-check` | 4 | — | `760-spot-check.md` | 📄 catalog |
| `/inventory-management/transaction` | 1 | — | `740-stock-transaction.md` | 📄 catalog |

## invitations

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/invitations` | 2 | — | — | ❌ none |

## login

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/login` | 1 | `001-login.spec.ts` | — | ✅ spec |

## notifications

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/notifications` | 1 | `002-spa-smoke.spec.ts` | `1203-notifications.md` | ✅ spec |

## Operation Plan

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/operation-plan` | 1 | — | — | ❌ none |
| `/operation-plan/category` | 3 | — | `110-op-category.md` | 📄 catalog |
| `/operation-plan/cuisine` | 3 | — | `111-cuisine.md` | 📄 catalog |
| `/operation-plan/equipment` | 3 | — | `130-equipment.md` | 📄 catalog |
| `/operation-plan/equipment-category` | 1 | `131-equipment-category.spec.ts` | `131-equipment-category.md` | ✅ spec |
| `/operation-plan/recipe` | 3 | — | `120-recipe.md` | 📄 catalog |
| `/operation-plan/recipe-equipment-category` | 1 | `121-recipe-equipment-category.spec.ts` | `121-recipe-equipment-category.md` | ✅ spec |

## pl

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/pl` | 1 | — | — | ❌ none |

## privacy

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/privacy` | 1 | — | — | ❌ none |

## Procurement

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/procurement` | 1 | `002-spa-smoke.spec.ts` | — | ✅ spec |
| `/procurement/approval` | 1 | `002-spa-smoke.spec.ts`<br>`201-my-approvals.spec.ts`<br>`303-pr-approver-journey.spec.ts` | — | ✅ spec |
| `/procurement/credit-note` | 3 | `002-spa-smoke.spec.ts`<br>`601-cn.spec.ts` | — | ✅ spec |
| `/procurement/goods-receive-note` | 3 | `002-spa-smoke.spec.ts`<br>`501-grn.spec.ts` | — | ✅ spec |
| `/procurement/goods-receive-note/from-po` | 1 | — | — | ❌ none |
| `/procurement/purchase-order` | 3 | `002-spa-smoke.spec.ts`<br>`401-po.spec.ts`<br>`402-po-purchaser-journey.spec.ts`<br>`403-po-approver-journey.spec.ts`<br>_+1 more_ | — | ✅ spec |
| `/procurement/purchase-order/from-pr` | 1 | — | — | ❌ none |
| `/procurement/purchase-order/from-price-list` | 1 | — | — | ❌ none |
| `/procurement/purchase-request` | 3 | `002-spa-smoke.spec.ts`<br>`201-my-approvals.spec.ts`<br>`301-pr.spec.ts`<br>`302-pr-creator-journey.spec.ts`<br>_+3 more_ | — | ✅ spec |
| `/procurement/purchase-request-template` | 3 | `002-spa-smoke.spec.ts`<br>`310-pr-template.spec.ts` | — | ✅ spec |
| `/procurement/purchase-request/from-template` | 1 | — | — | ❌ none |

## Product Management

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/product-management` | 1 | — | — | ❌ none |
| `/product-management/category` | 1 | `101-product-category.spec.ts` | — | ✅ spec |
| `/product-management/eco` | 1 | `044-eco.spec.ts` | — | ✅ spec |
| `/product-management/product` | 3 | — | `100-product.md` | 📄 catalog |

## Profile

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/profile` | 1 | `002-spa-smoke.spec.ts` | `1201-profile.md` | ✅ spec |
| `/profile/setting` | 1 | — | — | ❌ none |

## register

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/register` | 1 | — | — | ❌ none |
| `/register/verify` | 1 | — | — | ❌ none |

## Report

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/report` | 1 | — | `1202-report.md` | 📄 catalog |
| `/report/history` | 1 | — | — | ❌ none |
| `/report/list` | 1 | `002-spa-smoke.spec.ts` | — | ✅ spec |
| `/report/schedules` | 1 | — | — | ❌ none |

## reset-password

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/reset-password` | 1 | — | — | ❌ none |

## Store Operation

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/store-operation` | 1 | — | — | ❌ none |
| `/store-operation/stock-replenishment` | 1 | — | `711-stock-replenishment.md` | 📄 catalog |
| `/store-operation/store-requisition` | 3 | `701-sr.spec.ts`<br>`720-stock-issue.spec.ts` | — | ✅ spec |
| `/store-operation/wastage-reporting` | 1 | — | `710-wastage-reporting.md` | 📄 catalog |

## Platform / System Admin

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/system-admin` | 1 | — | `1113-signature-config.md` | 📄 catalog |
| `/system-admin/activity-log` | 1 | — | `1109-activity-log.md` | 📄 catalog |
| `/system-admin/business-setting` | 1 _(redirect)_ | — | — | ❌ none |
| `/system-admin/company-profile` | 1 | — | `1114-company-profile.md` | 📄 catalog |
| `/system-admin/dashboard-dataset` | 1 | — | `1112-dashboard-dataset.md` | 📄 catalog |
| `/system-admin/default-setting` | 1 | — | `1115-default-setting.md` | 📄 catalog |
| `/system-admin/document` | 1 | — | `1107-document.md` | 📄 catalog |
| `/system-admin/email-profile` | 1 | — | `1116-email-profile.md` | 📄 catalog |
| `/system-admin/email-template` | 1 | — | `1117-email-template.md` | 📄 catalog |
| `/system-admin/interface` | 2 | — | `1118-interface.md` | 📄 catalog |
| `/system-admin/inventory-period` | 1 | — | `1105-system-period.md` | 📄 catalog |
| `/system-admin/notification-template` | 3 | — | `1104-notification-template.md` | 📄 catalog |
| `/system-admin/period` | 1 _(redirect)_ | — | — | ❌ none |
| `/system-admin/role` | 3 | — | `1101-role.md` | 📄 catalog |
| `/system-admin/running-code` | 1 | — | `1110-running-code.md` | 📄 catalog |
| `/system-admin/user` | 2 | — | `1102-user.md` | 📄 catalog |
| `/system-admin/user-activity` | 1 | — | `1106-user-activity.md` | 📄 catalog |
| `/system-admin/workflow` | 6 | — | `1103-workflow.md` | 📄 catalog |

## terms

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/terms` | 1 | — | — | ❌ none |

## Vendor Management

| Module | Routes | Spec | Catalog | Status |
| --- | --- | --- | --- | --- |
| `/vendor-management` | 1 | — | — | ❌ none |
| `/vendor-management/certification` | 1 | `043-certification.spec.ts` | — | ✅ spec |
| `/vendor-management/price-list` | 3 | `159-pl.spec.ts` | — | ✅ spec |
| `/vendor-management/price-list-template` | 3 | `160-pl-template.spec.ts` | — | ✅ spec |
| `/vendor-management/request-price-list` | 3 | `1001-campaign.spec.ts` | — | ✅ spec |
| `/vendor-management/vendor` | 3 | `150-vendor.spec.ts` | — | ✅ spec |

## Stale catalogs

The declared route no longer matches any route in the app — renamed, moved, or removed. Each needs a decision: re-point it, or retire it.

| Catalog | Prefix | Declared URL | Declared route dir |
| --- | --- | --- | --- |
| `1002-external-price-list.md` | `EPL` | `/external/pl/:url_token` | `external/pl` |
| `1108-query-dataset.md` | `QDS` | `/system-admin/query-dataset` | `system-admin/query-dataset` |
| `1111-config-email.md` | `CEML` | `/system-admin/config-email` | `system-admin/config-email` |

## Cross-cutting catalogs

These document behaviour spread across many routes rather than one module, so they have no row above. Nothing to fix.

| Catalog | Prefix |
| --- | --- |
| `1204-section-landing.md` | `LAND` |
