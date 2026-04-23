# Vendor Management — E2E Test Suite Design

**Date:** 2026-04-23
**Status:** Approved for implementation
**Scope:** Playwright e2e coverage for `vendor-management/vendor` (list + detail form) in `carmen-inventory-frontend`

---

## 1. Purpose

`carmen-inventory-frontend-e2e` currently covers `login` and all 12 `config/*` modules. The next coverage target is the `vendor` module — the most complex sub-module in `vendor-management/` and a prerequisite for future procurement/GRN/price-list tests.

Vendor does not fit the existing `DialogCrudHelper` (single-name modal) or `PageFormCrudHelper` (code+name page form) patterns because it has:

- 4 tabs: General, Info, Address, Contact
- 3 dynamic arrays (addresses, contacts, info entries)
- Foreign-key dependency: `business_type`
- Richer list page with status filter, business-type filter, card↔table toggle

This spec defines the test suite, page object, and TC catalog for the vendor module.

## 2. Scope

**In scope:**
- `vendor-management/vendor` only — list page, `/new`, `/[id]` detail form
- All 4 tabs exercised
- Dynamic array add/remove on all three array fields
- Key validation rules (required, max-length, email format, address city-or-district refinement)
- CRUD happy path + cleanup
- ~28 tests

**Out of scope** (deferred to later specs):
- `price-list`, `price-list-template`, `request-price-list`
- Permission matrix across roles (test as Purchase only)
- API-level seed; relies on existing backend baseline data (at least 1 business type)
- Column visibility, pagination beyond smoke, accessibility audit

## 3. Dependencies on existing assets

| Asset | Location | Usage |
|---|---|---|
| `createAuthTest(email)` | `tests/fixtures/auth.fixture.ts` | Authenticated page fixture |
| `ConfigListPage` | `tests/pages/config-list.page.ts` | List-page primitives (search, add, delete, empty-state) |
| `tc-csv-reporter` | `tests/reporters/tc-csv-reporter.ts` | Parses `TC-VEN\d+` automatically |
| `sync-test-results.ts` | `scripts/sync-test-results.ts` | Add one entry to `SYNC_TARGETS` |

## 4. Decisions taken during brainstorming

| # | Decision | Rationale |
|---|---|---|
| D1 | **Approach 2** — dedicated `VendorPage` class (not extend existing helpers, not generic tab/array helper) | YAGNI; existing helpers stay simple; `VendorPage` is one unit with one purpose |
| D2 | **Depth = B** — ~28 tests covering smoke / happy path / all tabs / arrays / validation / edit+delete | Balances reusable pattern vs. spec size; fits one implementation iteration |
| D3 | **Data = A** — use existing backend baseline `business_type`; no API/UI seed of prerequisites | Matches pattern of currency/location specs; no new HTTP helper needed |
| D4 | **Role = A1** — `purchase@blueledgers.com` | Consistent with currency/location/department specs |
| D5 | **Cleanup = B1** — inline at end of describe (`TC-VEN27` deletes the main test vendor) | Matches delivery-point/currency pattern; no `afterAll` safety-net |
| D6 | **Area code = `VEN`** | `V` too short; avoids future collision with "voucher"-like modules |

## 5. Architecture & file layout

```
tests/
├── vendor.spec.ts                      (new, ~700 LOC, 28 tests)
├── pages/
│   ├── vendor.page.ts                  (new, ~200 LOC)
│   └── config-list.page.ts             (reuse as-is)
├── fixtures/auth.fixture.ts            (reuse)
└── results/vendor-results.csv          (auto-written by reporter)

scripts/sync-test-results.ts            (+1 entry in SYNC_TARGETS → tab "Vendor")
```

**New additions:** 1 page-object file, 1 spec file, 1 line in `SYNC_TARGETS`.
**Unchanged:** all other specs, `PageFormCrudHelper`, `DialogCrudHelper`, playwright config.

## 6. Page object API — `tests/pages/vendor.page.ts`

```ts
export interface VendorFormData {
  code: string;
  name: string;
  businessType?: string;              // option label; omit = pick first option
  description?: string;
  isActive?: boolean;
  addresses?: Array<Partial<VendorAddressInput>>;
  contacts?: Array<Partial<VendorContactInput>>;
  info?: Array<{ label: string; value: string; dataType?: string }>;
}

export class VendorPage {
  readonly list: ConfigListPage;       // composed
  constructor(private page: Page);

  // Navigation
  gotoList(): Promise<void>;           // → /vendor-management/vendor
  gotoNew(): Promise<void>;            // → /vendor-management/vendor/new
  gotoDetail(id: string): Promise<void>;
  openDetailByName(name: string): Promise<void>;

  // Form — General tab
  codeInput(): Locator;
  nameInput(): Locator;
  descriptionInput(): Locator;
  businessTypeSelect(): Locator;
  activeSwitch(): Locator;
  saveButton(): Locator;
  cancelButton(): Locator;
  editButton(): Locator;

  // Tabs
  switchTab(tab: "general" | "info" | "address" | "contact"): Promise<void>;
  activeTab(): Locator;

  // Dynamic arrays
  addAddressRow(): Promise<void>;
  addressRow(index: number): Locator;
  fillAddress(index: number, data: VendorAddressInput): Promise<void>;
  removeAddressRow(index: number): Promise<void>;
  addressCount(): Promise<number>;

  addContactRow(): Promise<void>;
  contactRow(index: number): Locator;
  fillContact(index: number, data: VendorContactInput): Promise<void>;
  removeContactRow(index: number): Promise<void>;
  setPrimaryContact(index: number): Promise<void>;
  contactCount(): Promise<number>;

  addInfoRow(): Promise<void>;
  fillInfo(index: number, data: { label: string; value: string; dataType?: string }): Promise<void>;
  removeInfoRow(index: number): Promise<void>;

  // High-level
  createVendor(data: VendorFormData): Promise<void>;
  expectSaved(): Promise<void>;

  // Validation
  fieldError(fieldName: string): Locator;
  anyError(): Locator;
}
```

**Design principles:**
- Locator factories (arrow fn → `Locator`) — match existing `LoginPage`/`DashboardPage` style; avoid stale locators across navigations.
- `list` is **composed** (not inherited) from `ConfigListPage` so callers do `vendor.list.search(...)`.
- `switchTab` uses a string-literal union to prevent typos.
- `createVendor(data)` is a single-shot flow used by specs that just need "a vendor" (edit/delete tests).
- No hidden retry/timeout logic inside the API — callers set their own `expect(...).toBeVisible({ timeout })`.

**Selectors to confirm during implementation** (not design decisions):
- Input IDs: likely `#vendor-code` / `#vendor-name` but may be `#code` / `#name` — verify against `vendor-general-tab.tsx`.
- Tab triggers: Radix `role="tab"` with `data-state="active"`.
- Dynamic-array add button text / dropdown structure for business-type selector.

## 7. Spec structure — `tests/vendor.spec.ts`

```ts
const test = createAuthTest("purchase@blueledgers.com");
test.describe.configure({ mode: "serial" });

const UID = Date.now().toString(36);
const CODE = `V${UID.slice(-6)}`;      // ≤ 10 chars
const NAME = `E2E VEN ${UID}`;
const NAME_UPDATED = `E2E VEN Upd ${UID}`;
```

### 7.1 TC catalog (28 tests)

#### List smoke — TC-VEN01..05
| ID | Title (TH) |
|---|---|
| TC-VEN01 | หน้า list โหลดสำเร็จ |
| TC-VEN02 | ปุ่ม Add แสดง |
| TC-VEN03 | ช่องค้นหาใช้งานได้ |
| TC-VEN04 | ค้นหาคำที่ไม่มีต้องแสดง empty state |
| TC-VEN05 | Filter status (active/inactive) ใช้งานได้ |

#### Create — happy path — TC-VEN06..10
| ID | Title (TH) |
|---|---|
| TC-VEN06 | เปิดหน้า new form สำเร็จ |
| TC-VEN07 | เลือก business type จาก dropdown ได้ |
| TC-VEN08 | สร้าง vendor ขั้นต่ำ (code + name + business type) สำเร็จ |
| TC-VEN09 | สร้าง vendor พร้อม address 1 รายการ |
| TC-VEN10 | สร้าง vendor พร้อม contact 1 รายการ (primary) |

#### Tabs & dynamic arrays — TC-VEN11..18
| ID | Title (TH) |
|---|---|
| TC-VEN11 | สลับ tab ทั้ง 4 tabs ได้ (General/Info/Address/Contact) |
| TC-VEN12 | เพิ่ม address row ได้หลาย row |
| TC-VEN13 | ลบ address row ได้ |
| TC-VEN14 | เพิ่ม contact row ได้หลาย row |
| TC-VEN15 | ลบ contact row ได้ |
| TC-VEN16 | เปลี่ยน primary contact ได้ (radio exclusive) |
| TC-VEN17 | เพิ่ม info row (label/value) ได้ |
| TC-VEN18 | ลบ info row ได้ |

#### Validation — TC-VEN19..24
| ID | Title (TH) |
|---|---|
| TC-VEN19 | บันทึกโดยไม่กรอก code ต้องแสดง error |
| TC-VEN20 | บันทึกโดยไม่กรอก name ต้องแสดง error |
| TC-VEN21 | code เกิน 10 ตัวอักษรต้องถูก reject |
| TC-VEN22 | name เกิน 100 ตัวอักษรต้องถูก reject |
| TC-VEN23 | address ที่ไม่มีทั้ง city และ district ต้อง fail (refinement) |
| TC-VEN24 | contact email รูปแบบผิดต้องแสดง error |

#### Edit, delete, cleanup — TC-VEN25..28
| ID | Title (TH) |
|---|---|
| TC-VEN25 | แก้ name ของ vendor ที่สร้างแล้ว save สำเร็จ |
| TC-VEN26 | เปิด delete dialog ของ vendor แล้ว cancel — row ยังอยู่ |
| TC-VEN27 | ลบ vendor ที่สร้างในชุด test สำเร็จ (cleanup หลัก) |
| TC-VEN28 | หลังลบแล้วค้นหาไม่พบ row นั้นอีก |

### 7.2 Cross-test data flow (serial mode)

- **TC-VEN08** creates the primary vendor (`CODE`/`NAME`) that persists through the rest of the suite.
- **TC-VEN09..10, 12..18** create their own transient vendors with UID+index suffix codes and names, cleaning up inline inside each test where feasible.
- **TC-VEN19..24** never save — they open the form and trigger validation without persisting.
- **TC-VEN25** renames the TC-VEN08 vendor from `NAME` → `NAME_UPDATED`.
- **TC-VEN26** opens the delete dialog on `NAME_UPDATED` and cancels.
- **TC-VEN27** performs the real delete; **TC-VEN28** verifies search returns empty.

## 8. Data & environment assumptions

- Backend at `E2E_BASE_URL` (default `http://localhost:3000`) must have:
  - At least 1 active `business_type` row (baseline seed).
  - The 7 role-based test users (`test-users.ts`).
  - No existing vendor whose code starts with `V` followed by the same 6-char UID suffix generated at test time — collision space is 36⁶ ≈ 2.2B, negligible.
- No cross-spec ordering requirement — `vendor.spec.ts` runs independently in the `chromium` project.
- Tests assume HTTP 429 rate limiting is tolerated by `loginWithRetry` during auth fixture (already handled by existing `LoginPage`).

## 9. Known risks & mitigations

| Risk | Mitigation |
|---|---|
| Backend has zero business types → TC-VEN07..10 all fail | TC-VEN07 checks `optionCount() > 0`; if zero, calls `test.skip()` with reason, and downstream create tests short-circuit |
| Code collision with pre-existing vendor | UID-based code (`V<last6 of base36 timestamp>`); practical collision probability negligible |
| Primary-contact UI is checkbox rather than radio | `setPrimaryContact(index)` asserts only the target is "primary"; test shape stays but implementation adapts |
| Input IDs differ from assumption | Verify during implementation; adjust `vendor.page.ts` locator factories before running suite |
| Save button click races the business-type dropdown fetch | Page object waits for dropdown options to render before enabling save interactions |

## 10. Google Sheets sync integration

Add to `scripts/sync-test-results.ts` under `SYNC_TARGETS`:

```ts
{ csvFile: "vendor-results.csv", sheetTab: "Vendor" },
```

Sheet tab "Vendor" must be created manually with header row: `Test ID, Title, Status, Duration (ms), Error, Test Date`. The CSV reporter writes the file automatically on each run.

## 11. Out-of-scope / future specs

- `price-list.spec.ts` — vendor FK + bulk upload flows
- `price-list-template.spec.ts` — template reuse
- `request-price-list.spec.ts` — request workflow
- Vendor permission matrix across roles
- Vendor import/export
- Extract shared `TabbedFormHelper` / `DynamicArrayHelper` once second consumer (e.g., product, user) appears
