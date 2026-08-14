# Role-aware Screen Capture + Sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ถ่าย screenshot ทุกหน้าจอของ Carmen (route + dialog) ในมุมของทุก role แล้วสร้างหน้า sitemap HTML ไฟล์เดียวที่เห็นโครงทั้งระบบพร้อม thumbnail จริง

**Architecture:** 3 pass แยกเป็นคนละคำสั่ง สื่อสารผ่านไฟล์ JSON บนดิสก์ — pass 1 (`probe`) เดินทุก role × ทุก route โดยไม่ถ่ายรูป เก็บ outcome + structural signature ลง `role-matrix.json`; pass 2 (`capture`) อ่าน matrix แล้วถ่ายเฉพาะ baseline role + role ที่หน้าตาต่างจริง; pass 3 (`sitemap`) อ่าน route tree + matrix + ไฟล์ PNG บนดิสก์ แล้ว render HTML self-contained

**Tech Stack:** TypeScript, Playwright (batch job ผ่าน project แยก), Vitest (unit test ของ pure logic), Bun (script runner)

**Spec:** `docs/superpowers/specs/2026-08-14-role-aware-screen-capture-sitemap-design.md`

## Global Constraints

- **ห้ามเขียนไฟล์ test เพิ่มนอกเหนือจาก 2 ไฟล์นี้**: `unit/wiki-screenshots/signature.test.ts` และ `unit/wiki-screenshots/role-matrix.test.ts` — Task 3-7 ไม่มี test step โดยตั้งใจ ตาม working preference ของโปรเจกต์ ให้ verify ด้วย type-check + การรันจริงแทน
- **Code comment เขียนเป็นภาษาอังกฤษ** ตาม convention ของ repo นี้ (โค้ดเดิมทุกไฟล์เป็นอังกฤษ)
- **ทุก task ต้องผ่าน `bunx tsc --noEmit` ก่อน commit** — ไม่มีข้อยกเว้น
- **`git add` ต้องระบุ path ที่แก้เท่านั้น ห้ามใช้ `git add -A` หรือ `git add .`** — working tree มีไฟล์ค้างที่ไม่เกี่ยวกับงานนี้อยู่
- **Backward compatibility ห้ามพัง**: baseline role ต้องเขียนลง `<module>/<slug>.png` (ไม่มี suffix) เพราะเอกสาร wiki 10 ไฟล์อ้าง path นี้อยู่
- **`PageSignature` ห้ามเก็บค่าที่เปลี่ยนตามข้อมูล** — จำนวน record, ชื่อ record, วันที่, running code หากเก็บเข้าไป ทุก role จะถูกตัดสินว่า "ต่าง" แล้วระบบจะถ่ายครบ 1,098 รูป ซึ่งทำลายเหตุผลทั้งหมดของ pass 1
- Playwright project ใหม่ต้องไม่ถูกดึงเข้า project `chromium` — `testIgnore` ของ chromium ครอบ `wiki-screenshots/` อยู่แล้ว (`playwright.config.ts:44`) ไฟล์ใหม่อยู่ในโฟลเดอร์นั้นจึงปลอดภัยโดยอัตโนมัติ
- ทำงานบน branch `feature/role-aware-capture-sitemap` (สร้างแล้ว มี spec commit อยู่)

---

## File Structure

| ไฟล์ | ความรับผิดชอบ | Task |
|---|---|---|
| `tests/wiki-screenshots/types.ts` | type ทั้งหมดของ pipeline (แก้: เพิ่ม 3 type + 1 field) | 1 |
| `tests/wiki-screenshots/signature.ts` | ใหม่ — อ่าน fingerprint จากหน้าจริง + ตัดสินว่า 2 หน้าเหมือนกันไหม | 1 |
| `tests/wiki-screenshots/role-matrix.ts` | ใหม่ — I/O ของ matrix + ตัดสินว่า baseline คือ role ไหน และต้องถ่าย role ไหนเพิ่ม | 2 |
| `tests/wiki-screenshots/shot-path.ts` | ใหม่ — แปลง (spec, role) เป็น URL และ path ไฟล์ output | 2 |
| `tests/wiki-screenshots/probe.spec.ts` | ใหม่ — pass 1 | 3 |
| `tests/wiki-screenshots/capture.spec.ts` | แก้ — pass 2 อ่าน matrix แทนการวนตรง ๆ | 4, 5 |
| `tests/wiki-screenshots/manifest.ts` | แก้ — เพิ่ม dialog spec | 5 |
| `tests/wiki-screenshots/sitemap.ts` | ใหม่ — pass 3 | 6 |
| `tests/wiki-screenshots/coverage.ts` | แก้ — นับมิติ role | 7 |
| `unit/wiki-screenshots/signature.test.ts` | ใหม่ — test ของ `sameScreen()` | 1 |
| `unit/wiki-screenshots/role-matrix.test.ts` | ใหม่ — test ของ `baselineFor()` / `rolesToCapture()` / `outputFile()` | 2 |
| `playwright.config.ts` | แก้ — เพิ่ม project `wiki-probe` | 3 |
| `package.json` | แก้ — เพิ่ม `wiki:probe`, `wiki:sitemap` | 3, 6 |
| `.gitignore` | แก้ — เพิ่ม `role-matrix.json` | 3 |

**ลำดับ dependency**: Task 1 → 2 → 3 → 4 → 5 → 6 → 7 (แต่ละ task ใช้ interface ที่ task ก่อนหน้าสร้าง)

---

## Task 1: Page signature — fingerprint ของหน้าจอ

**Files:**
- Modify: `tests/wiki-screenshots/types.ts` (เพิ่มท้ายไฟล์ + แก้ `ShotSpec`)
- Create: `tests/wiki-screenshots/signature.ts`
- Test: `unit/wiki-screenshots/signature.test.ts`

**Interfaces:**
- Consumes: `ShotSpec` จาก `types.ts` (มีอยู่แล้ว)
- Produces:
  - `type ScreenOutcome = "ok" | "denied" | "not-found" | "error"`
  - `type PageSignature = { heading: string; actions: string[]; columns: string[]; hasRows: boolean }`
  - `type ProbeResult = { route: string; role: string; outcome: ScreenOutcome; signature?: PageSignature; reason?: string }`
  - `ShotSpec.interaction?: "add-dialog"`
  - `async function pageSignature(page: Page): Promise<PageSignature>`
  - `function sameScreen(a: PageSignature, b: PageSignature): boolean`

- [ ] **Step 1: เพิ่ม type ใหม่ใน `types.ts`**

เพิ่มฟิลด์นี้เข้าไปใน `ShotSpec` ที่มีอยู่ (ต่อจาก `viewport`):

```ts
  /** Extra UI state to open before shooting; omit to shoot the page as navigated. */
  interaction?: "add-dialog";
```

แล้วเพิ่มต่อท้ายไฟล์:

```ts
/** Result of visiting one route as one role. */
export type ScreenOutcome = "ok" | "denied" | "not-found" | "error";

/**
 * Structural fingerprint of a rendered screen.
 *
 * Deliberately excludes everything data-dependent (record counts, record
 * names, dates, running codes): if the fingerprint moved with the data, every
 * role would compare as "different" and the probe pass would stop saving any
 * work. `hasRows` is a boolean, never a count, for exactly this reason.
 */
export type PageSignature = {
  /** First h1/h2 on the page. */
  heading: string;
  /** Page-level button labels, deduped and sorted. Excludes buttons inside tables. */
  actions: string[];
  /** Table header labels, deduped and sorted. Empty when the page is not a list. */
  columns: string[];
  /** Whether the list rendered any row at all. */
  hasRows: boolean;
};

/** One (route, role) observation produced by the probe pass. */
export type ProbeResult = {
  route: string;
  role: string;
  outcome: ScreenOutcome;
  /** Present only when outcome is "ok". */
  signature?: PageSignature;
  /** The denied/error text actually seen on the page, or why it was unreachable. */
  reason?: string;
};
```

- [ ] **Step 2: เขียน test ที่ยังไม่ผ่าน**

สร้าง `unit/wiki-screenshots/signature.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { sameScreen } from "../../tests/wiki-screenshots/signature";
import type { PageSignature } from "../../tests/wiki-screenshots/types";

const sig = (over: Partial<PageSignature> = {}): PageSignature => ({
  heading: "Purchase Request",
  actions: ["Add", "Export"],
  columns: ["Code", "Date", "Status"],
  hasRows: true,
  ...over,
});

describe("sameScreen", () => {
  it("treats identical signatures as the same screen", () => {
    expect(sameScreen(sig(), sig())).toBe(true);
  });

  it("treats a different heading as a different screen", () => {
    expect(sameScreen(sig(), sig({ heading: "My Approvals" }))).toBe(false);
  });

  it("treats different page actions as a different screen", () => {
    expect(sameScreen(sig(), sig({ actions: ["Approve", "Reject"] }))).toBe(false);
  });

  it("treats different table columns as a different screen", () => {
    expect(sameScreen(sig(), sig({ columns: ["Code", "Date"] }))).toBe(false);
  });

  it("ignores hasRows — it reflects data scope, not UI shape", () => {
    expect(sameScreen(sig({ hasRows: true }), sig({ hasRows: false }))).toBe(true);
  });

  it("ignores list ordering when the members match", () => {
    const a = sig({ actions: ["Export", "Add"], columns: ["Status", "Code", "Date"] });
    expect(sameScreen(a, sig())).toBe(true);
  });

  it("treats a missing action as a different screen even when the rest matches", () => {
    expect(sameScreen(sig(), sig({ actions: ["Add"] }))).toBe(false);
  });
});
```

- [ ] **Step 3: รัน test ให้เห็นว่าไม่ผ่าน**

Run: `bunx vitest run unit/wiki-screenshots/signature.test.ts`
Expected: FAIL — resolve module `../../tests/wiki-screenshots/signature` ไม่ได้

- [ ] **Step 4: เขียน `signature.ts`**

สร้าง `tests/wiki-screenshots/signature.ts`:

```ts
import type { Page } from "@playwright/test";
import type { PageSignature } from "./types";

/** Trim, drop blanks, dedupe, sort — so ordering and whitespace never matter. */
function normalize(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort();
}

function equalLists(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const x = [...a].sort();
  const y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}

/**
 * Read a screen's structural fingerprint from the live page.
 *
 * Buttons inside <table> are excluded on purpose: those are per-row actions
 * whose labels carry record data, which would make the signature move with the
 * dataset instead of with the UI.
 */
export async function pageSignature(page: Page): Promise<PageSignature> {
  const headingText = await page
    .locator("h1, h2")
    .first()
    .textContent()
    .catch(() => null);
  const actions = await page
    .locator("button:not(table button)")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const columns = await page
    .locator("table thead th")
    .allInnerTexts()
    .catch(() => [] as string[]);
  const rowCount = await page.locator("table tbody tr").count().catch(() => 0);

  return {
    heading: (headingText ?? "").trim(),
    actions: normalize(actions),
    columns: normalize(columns),
    hasRows: rowCount > 0,
  };
}

/**
 * Do two roles see the same screen?
 *
 * `hasRows` is intentionally NOT compared: it reflects which records a role is
 * scoped to, not how the UI is shaped, and comparing it would produce a
 * near-duplicate screenshot for every role on every list page.
 */
export function sameScreen(a: PageSignature, b: PageSignature): boolean {
  return (
    a.heading === b.heading &&
    equalLists(a.actions, b.actions) &&
    equalLists(a.columns, b.columns)
  );
}
```

- [ ] **Step 5: รัน test ให้ผ่าน**

Run: `bunx vitest run unit/wiki-screenshots/signature.test.ts`
Expected: PASS ทั้ง 7 เคส

- [ ] **Step 6: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 7: Commit**

```bash
git add tests/wiki-screenshots/types.ts tests/wiki-screenshots/signature.ts unit/wiki-screenshots/signature.test.ts
git commit -m "feat(wiki-screenshots): add page signature + sameScreen comparison

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Decision layer — matrix I/O, baseline, output paths

**Files:**
- Create: `tests/wiki-screenshots/role-matrix.ts`
- Create: `tests/wiki-screenshots/shot-path.ts`
- Test: `unit/wiki-screenshots/role-matrix.test.ts`

**Interfaces:**
- Consumes: `ProbeResult`, `PageSignature`, `ShotSpec` จาก `types.ts`; `sameScreen()` จาก `signature.ts`; `TEST_USERS` จาก `../test-users`
- Produces:
  - `const ROLE_MATRIX_PATH: string`
  - `function loadRoleMatrix(path: string): ProbeResult[]` — throw พร้อมคำสั่งให้รัน probe เมื่อไฟล์หาย
  - `function saveRoleMatrix(path: string, results: ProbeResult[]): void`
  - `function baselineFor(results: ProbeResult[], route: string): ProbeResult | null`
  - `function rolesToCapture(results: ProbeResult[], route: string): string[]`
  - `function resolvePath(spec: ShotSpec): string`
  - `function outputFile(assetsDir: string, spec: ShotSpec, role: string, baselineRole: string): string`

- [ ] **Step 1: เขียน test ที่ยังไม่ผ่าน**

สร้าง `unit/wiki-screenshots/role-matrix.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { baselineFor, rolesToCapture } from "../../tests/wiki-screenshots/role-matrix";
import { resolvePath, outputFile } from "../../tests/wiki-screenshots/shot-path";
import type { ProbeResult, PageSignature, ShotSpec } from "../../tests/wiki-screenshots/types";

const sig = (over: Partial<PageSignature> = {}): PageSignature => ({
  heading: "Vendor",
  actions: ["Add"],
  columns: ["Code", "Name"],
  hasRows: true,
  ...over,
});

const ok = (role: string, over: Partial<PageSignature> = {}): ProbeResult => ({
  route: "/vendor-management/vendor",
  role,
  outcome: "ok",
  signature: sig(over),
});

const denied = (role: string): ProbeResult => ({
  route: "/vendor-management/vendor",
  role,
  outcome: "denied",
  reason: "Permission denied",
});

describe("baselineFor", () => {
  it("prefers Admin when Admin can see the page", () => {
    const m = [ok("HOD"), ok("Admin"), ok("Requestor")];
    expect(baselineFor(m, "/vendor-management/vendor")?.role).toBe("Admin");
  });

  it("falls back to the first TEST_USERS role that succeeded when Admin cannot", () => {
    const m = [denied("Admin"), ok("HOD"), ok("Requestor")];
    // TEST_USERS order is Requestor, HOD, Purchase, ... so Requestor wins over HOD
    expect(baselineFor(m, "/vendor-management/vendor")?.role).toBe("Requestor");
  });

  it("returns null when no role could reach the page", () => {
    const m = [denied("Admin"), denied("HOD")];
    expect(baselineFor(m, "/vendor-management/vendor")).toBeNull();
  });

  it("ignores results belonging to other routes", () => {
    const m = [{ ...ok("Admin"), route: "/config/unit" }];
    expect(baselineFor(m, "/vendor-management/vendor")).toBeNull();
  });
});

describe("rolesToCapture", () => {
  it("returns only roles whose screen differs from the baseline", () => {
    const m = [ok("Admin"), ok("HOD"), ok("Requestor", { actions: ["Approve"] })];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual(["Requestor"]);
  });

  it("never includes the baseline role itself", () => {
    const m = [ok("Admin")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });

  it("excludes roles that could not reach the page", () => {
    const m = [ok("Admin"), denied("HOD")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });

  it("returns nothing when there is no baseline at all", () => {
    const m = [denied("Admin"), denied("HOD")];
    expect(rolesToCapture(m, "/vendor-management/vendor")).toEqual([]);
  });
});

describe("resolvePath", () => {
  it("substitutes the seedId into a dynamic segment", () => {
    const spec: ShotSpec = { path: "/config/department/:id", module: "department", slug: "detail", seedId: "abc" };
    expect(resolvePath(spec)).toBe("/config/department/abc");
  });

  it("leaves a static path untouched", () => {
    const spec: ShotSpec = { path: "/config/unit", module: "unit", slug: "index" };
    expect(resolvePath(spec)).toBe("/config/unit");
  });
});

describe("outputFile", () => {
  const spec: ShotSpec = { path: "/config/unit", module: "unit", slug: "index" };

  it("gives the baseline role the unsuffixed path so existing wiki docs keep working", () => {
    expect(outputFile("/assets", spec, "Admin", "Admin")).toBe("/assets/unit/index.png");
  });

  it("suffixes any non-baseline role", () => {
    expect(outputFile("/assets", spec, "HOD", "Admin")).toBe("/assets/unit/index--HOD.png");
  });

  it("marks a dialog shot in the filename stem", () => {
    const dialog: ShotSpec = { ...spec, interaction: "add-dialog" };
    expect(outputFile("/assets", dialog, "Admin", "Admin")).toBe("/assets/unit/index-dialog-add.png");
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่าไม่ผ่าน**

Run: `bunx vitest run unit/wiki-screenshots/role-matrix.test.ts`
Expected: FAIL — resolve module `role-matrix` / `shot-path` ไม่ได้

- [ ] **Step 3: เขียน `shot-path.ts`**

สร้าง `tests/wiki-screenshots/shot-path.ts`:

```ts
import { join } from "node:path";
import type { ShotSpec } from "./types";

/** Substitute the spec's seedId into every ":seg" of its route. Pure. */
export function resolvePath(spec: ShotSpec): string {
  return spec.seedId
    ? spec.path.replace(/\/:[A-Za-z_]+/g, `/${spec.seedId}`)
    : spec.path;
}

/**
 * Where one (spec, role) shot is written.
 *
 * The baseline role keeps the historic unsuffixed path because the wiki's
 * en/th inventory docs link to it; every other role gets a "--<role>" suffix.
 */
export function outputFile(
  assetsDir: string,
  spec: ShotSpec,
  role: string,
  baselineRole: string,
): string {
  const stem = spec.interaction === "add-dialog" ? `${spec.slug}-dialog-add` : spec.slug;
  const suffix = role === baselineRole ? "" : `--${role}`;
  return join(assetsDir, spec.module, `${stem}${suffix}.png`);
}
```

- [ ] **Step 4: เขียน `role-matrix.ts`**

สร้าง `tests/wiki-screenshots/role-matrix.ts`:

```ts
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ProbeResult } from "./types";
import { sameScreen } from "./signature";
import { TEST_USERS } from "../test-users";

export const ROLE_MATRIX_PATH = join(
  process.cwd(),
  "tests/wiki-screenshots/role-matrix.json",
);

/**
 * Baseline preference order: Admin first (it sees the most and owns the
 * historic screenshot paths), then TEST_USERS order for pages Admin is denied
 * — e.g. the certification module, which RBAC blocks for admin@BLAVG.
 */
const ROLE_ORDER: string[] = [
  "Admin",
  ...TEST_USERS.map((u) => u.role).filter((r) => r !== "Admin"),
];

/** Read the probe output. Throws with the fix when the file is absent. */
export function loadRoleMatrix(path: string): ProbeResult[] {
  if (!existsSync(path)) {
    throw new Error(
      `role-matrix.json not found at ${path}. Run "bun run wiki:probe" first — ` +
        `capturing without it would silently shoot only the default role.`,
    );
  }
  return JSON.parse(readFileSync(path, "utf8")) as ProbeResult[];
}

export function saveRoleMatrix(path: string, results: ProbeResult[]): void {
  writeFileSync(path, JSON.stringify(results, null, 2));
}

/** The role whose screenshot represents this route, or null if nobody can reach it. Pure. */
export function baselineFor(
  results: ProbeResult[],
  route: string,
): ProbeResult | null {
  const reachable = results.filter((r) => r.route === route && r.outcome === "ok");
  for (const role of ROLE_ORDER) {
    const hit = reachable.find((r) => r.role === role);
    if (hit) return hit;
  }
  return null;
}

/** Roles that need their own screenshot because their screen differs from the baseline. Pure. */
export function rolesToCapture(results: ProbeResult[], route: string): string[] {
  const base = baselineFor(results, route);
  if (!base?.signature) return [];
  return results
    .filter((r) => r.route === route && r.outcome === "ok" && r.role !== base.role)
    .filter((r) => !r.signature || !sameScreen(base.signature!, r.signature))
    .map((r) => r.role);
}
```

- [ ] **Step 5: รัน test ให้ผ่าน**

Run: `bunx vitest run unit/wiki-screenshots/role-matrix.test.ts`
Expected: PASS ทั้ง 13 เคส

- [ ] **Step 6: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 7: Commit**

```bash
git add tests/wiki-screenshots/role-matrix.ts tests/wiki-screenshots/shot-path.ts unit/wiki-screenshots/role-matrix.test.ts
git commit -m "feat(wiki-screenshots): add role-matrix decision layer + shot paths

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Pass 1 — probe

**Files:**
- Create: `tests/wiki-screenshots/probe.spec.ts`
- Modify: `playwright.config.ts` (เพิ่ม project หลัง `wiki-screenshots` ที่บรรทัด 57)
- Modify: `package.json` (เพิ่ม script ถัดจาก `wiki:capture`)
- Modify: `.gitignore` (เพิ่มบรรทัดถัดจาก `tests/wiki-screenshots/seed-ids.json`)

**Interfaces:**
- Consumes: `pageSignature()` จาก `signature.ts`; `saveRoleMatrix()`, `ROLE_MATRIX_PATH` จาก `role-matrix.ts`; `resolvePath()` จาก `shot-path.ts`; `SHOTS` จาก `manifest.ts`; `loadSeedOverlay()`, `applySeedOverlay()` จาก `seed-overlay.ts`; `authFile()` จาก `../fixtures/auth.paths`; `setEnLocale()` จาก `locale.ts`; `TEST_USERS` จาก `../test-users`
- Produces: ไฟล์ `tests/wiki-screenshots/role-matrix.json` และคำสั่ง `bun run wiki:probe`

- [ ] **Step 1: เขียน `probe.spec.ts`**

สร้าง `tests/wiki-screenshots/probe.spec.ts`:

```ts
import { test, expect, type Page } from "@playwright/test";
import { join } from "node:path";
import { SHOTS } from "./manifest";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";
import { pageSignature } from "./signature";
import { saveRoleMatrix, ROLE_MATRIX_PATH } from "./role-matrix";
import { resolvePath } from "./shot-path";
import type { ProbeResult, ScreenOutcome, ShotSpec } from "./types";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
const VIEWPORT = { width: 1440, height: 1600 };
const PER_PAGE_TIMEOUT_MS = 30_000;

/**
 * Classify what a role actually got. Order matters: a denied page can also
 * render an empty table, so permission is checked before anything else.
 */
async function classify(page: Page): Promise<{ outcome: ScreenOutcome; reason?: string }> {
  const probes: Array<[ScreenOutcome, RegExp]> = [
    ["denied", /permission denied|forbidden|not authorized|403/i],
    ["not-found", /not found|404/i],
    ["error", /something went wrong|unexpected error/i],
  ];
  for (const [outcome, pattern] of probes) {
    const hit = page.getByText(pattern).first();
    if (await hit.isVisible().catch(() => false)) {
      const reason = (await hit.textContent().catch(() => null))?.trim().slice(0, 120);
      return { outcome, reason: reason || outcome };
    }
  }
  return { outcome: "ok" };
}

/** Visit one route as the current role and record what happened. Never throws. */
async function probeOne(page: Page, spec: ShotSpec, role: string): Promise<ProbeResult> {
  const base = { route: spec.path, role };
  if (spec.path.includes(":") && !spec.seedId) {
    return { ...base, outcome: "not-found", reason: "no seedId" };
  }
  try {
    await page.goto(resolvePath(spec), {
      waitUntil: "domcontentloaded",
      timeout: PER_PAGE_TIMEOUT_MS,
    });
    // Best-effort settle. Bounded on purpose: some tenants hold a websocket
    // open so "networkidle" never fires — do not block the whole matrix on it.
    await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
    await page
      .waitForFunction(() => document.querySelectorAll(".animate-pulse").length === 0, {
        timeout: 8_000,
      })
      .catch(() => {});

    const { outcome, reason } = await classify(page);
    if (outcome !== "ok") return { ...base, outcome, reason };
    return { ...base, outcome: "ok", signature: await pageSignature(page) };
  } catch (err) {
    return { ...base, outcome: "error", reason: (err as Error).message.split("\n")[0] };
  }
}

test("probe every route as every role", async ({ browser }) => {
  test.setTimeout(0); // batch job; per-page timeouts still apply

  const shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  const results: ProbeResult[] = [];

  // One context per role, not per page: creating a context is far more
  // expensive than a goto, and storageState is per-role anyway.
  for (const user of TEST_USERS) {
    const context = await browser.newContext({
      storageState: authFile(user.email),
      baseURL: BASE_URL,
      viewport: VIEWPORT,
    });
    await setEnLocale(context, BASE_URL);
    const page = await context.newPage();
    for (const spec of shots) {
      results.push(await probeOne(page, spec, user.role));
    }
    await context.close();
    const okCount = results.filter((r) => r.role === user.role && r.outcome === "ok").length;
    console.log(`${user.role}: ${okCount}/${shots.length} reachable`);
  }

  saveRoleMatrix(ROLE_MATRIX_PATH, results);
  console.log(`Wrote ${ROLE_MATRIX_PATH} (${results.length} observations)`);

  // A totally empty matrix means auth broke, not that the app has no pages.
  expect(
    results.filter((r) => r.outcome === "ok").length,
    "No role could reach any page — check that the setup project produced .auth/*.json",
  ).toBeGreaterThan(0);
});
```

- [ ] **Step 2: เพิ่ม Playwright project**

ใน `playwright.config.ts` แทรกหลัง object ของ project `wiki-screenshots` (ปิดที่บรรทัด 57):

```ts
    {
      name: "wiki-probe",
      testMatch: /wiki-screenshots\/probe\.spec\.ts$/,
      dependencies: ["setup"],
      fullyParallel: false,
      // Batch job over ~1,100 page visits with no TC ID: screenshots and video
      // would be pure noise, and the whole point of this pass is to be cheap.
      use: { ...devices["Desktop Chrome"], video: "off", screenshot: "off" },
    },
```

- [ ] **Step 3: เพิ่ม npm script**

ใน `package.json` แทรกก่อนบรรทัด `"wiki:capture"`:

```json
    "wiki:probe": "playwright test --project=wiki-probe",
```

- [ ] **Step 4: gitignore ไฟล์ matrix**

ใน `.gitignore` เพิ่มต่อจากบรรทัด `tests/wiki-screenshots/seed-ids.json`:

```
tests/wiki-screenshots/role-matrix.json
```

- [ ] **Step 5: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 6: ตรวจว่า Playwright เห็น project ใหม่และ chromium ไม่ดูดไฟล์นี้ไป**

Run: `bunx playwright test --list --project=wiki-probe`
Expected: เห็น 1 test ชื่อ `probe every route as every role`

Run: `bunx playwright test --list --project=chromium | grep -c probe.spec`
Expected: `0` — chromium ต้องไม่เห็นไฟล์นี้

- [ ] **Step 7: รัน probe จริง** (ต้องมี frontend + backend ทำงานอยู่)

Run: `bun run wiki:probe`
Expected: log จำนวน reachable ต่อ role 9 บรรทัด แล้วเขียน `role-matrix.json`

ตรวจผลด้วย:

```bash
bunx jq -r 'group_by(.outcome) | map({outcome: .[0].outcome, n: length}) | .[] | "\(.outcome): \(.n)"' tests/wiki-screenshots/role-matrix.json
```

Expected: เห็นทั้ง `ok` และ `denied` โดย `ok` ต้องมากกว่า 0 — ถ้า `denied` เป็น 0 ทั้งหมดให้สงสัยว่า classify จับข้อความไม่ตรงกับที่ UI แสดงจริง แล้วปรับ regex ใน `classify()`

- [ ] **Step 8: Commit**

```bash
git add tests/wiki-screenshots/probe.spec.ts playwright.config.ts package.json .gitignore
git commit -m "feat(wiki-screenshots): add probe pass producing the role matrix

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Pass 2 — capture อ่าน role matrix

**Files:**
- Modify: `tests/wiki-screenshots/capture.spec.ts` (เขียนทับส่วน logic เดิมทั้งหมด — ไฟล์เดิม 155 บรรทัด)

**Interfaces:**
- Consumes: `loadRoleMatrix()`, `ROLE_MATRIX_PATH`, `baselineFor()`, `rolesToCapture()` จาก `role-matrix.ts`; `resolvePath()`, `outputFile()` จาก `shot-path.ts`; ที่เหลือเหมือนเดิม
- Produces: ไฟล์ PNG ตาม naming scheme ใหม่ และ `last-run.json` ที่ยังคงรูปแบบเดิม (`Record<string, string>`)

- [ ] **Step 1: เขียน `capture.spec.ts` ใหม่ทั้งไฟล์**

เขียนทับ `tests/wiki-screenshots/capture.spec.ts` ด้วย:

```ts
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SHOTS } from "./manifest";
import type { ShotSpec } from "./types";
import { TEST_USERS } from "../test-users";
import { authFile } from "../fixtures/auth.paths";
import { setEnLocale } from "./locale";
import { loadSeedOverlay, applySeedOverlay } from "./seed-overlay";
import { ensureCaptureState } from "./capture-user";
import { loadRoleMatrix, ROLE_MATRIX_PATH, baselineFor, rolesToCapture } from "./role-matrix";
import { resolvePath, outputFile } from "./shot-path";

const ASSETS_DIR =
  process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const RESULTS = join(process.cwd(), "tests/wiki-screenshots/last-run.json");
const SEED_IDS = join(process.cwd(), "tests/wiki-screenshots/seed-ids.json");
// Tall desktop viewport: width drives responsive layout; the extra height lets a
// bounded (non-fullPage) screenshot show most of a detail form. fullPage is
// avoided because data-heavy pages produce enormous images that hang Playwright.
const DEFAULT_VIEWPORT = { width: 1440, height: 1600 };
const HARD_TIMEOUT_MS = 60_000;

/** One planned screenshot: a spec shot as a specific role, to a specific file. */
type CaptureJob = { spec: ShotSpec; role: string; out: string };

function emailForRole(role: string): string {
  const user = TEST_USERS.find((u) => u.role === role);
  if (!user) throw new Error(`No test user defined for role "${role}"`);
  return user.email;
}

/** Navigate to one spec and write its screenshot. Throws on any failure. */
async function captureOne(page: Page, spec: ShotSpec, out: string): Promise<void> {
  await page.goto(resolvePath(spec), { waitUntil: "domcontentloaded", timeout: 30_000 });
  // Best-effort network settle. Bounded on purpose: some tenants keep a
  // websocket/polling open so "networkidle" never fires — don't block on it.
  await page.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => {});
  if (spec.waitFor) await page.waitForSelector(spec.waitFor, { timeout: 15_000 });
  await page
    .waitForFunction(() => document.querySelectorAll(".animate-pulse").length === 0, { timeout: 8_000 })
    .catch(() => {});
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage: false, animations: "disabled", timeout: 20_000 });
}

/**
 * Turn the probe matrix into a capture plan: the baseline role for every
 * reachable route, plus each role whose screen genuinely differs.
 */
function planJobs(shots: ShotSpec[], skipped: Record<string, string>): CaptureJob[] {
  const matrix = loadRoleMatrix(ROLE_MATRIX_PATH);
  const jobs: CaptureJob[] = [];
  const claimed = new Map<string, string>(); // output file -> first route that claimed it

  for (const spec of shots) {
    const base = baselineFor(matrix, spec.path);
    if (!base) {
      skipped[spec.path] = "no role could reach this page";
      continue;
    }
    for (const role of [base.role, ...rolesToCapture(matrix, spec.path)]) {
      const out = outputFile(ASSETS_DIR, spec, role, base.role);
      const owner = claimed.get(out);
      if (owner) {
        skipped[spec.path] = `output path collides with ${owner} (${out})`;
        continue;
      }
      claimed.set(out, spec.path);
      jobs.push({ spec, role, out });
    }
  }
  return jobs;
}

/** Escape hatch: WIKI_CAPTURE_EMAIL shoots everything as one user, matrix ignored. */
function planSingleUserJobs(shots: ShotSpec[], skipped: Record<string, string>): CaptureJob[] {
  const jobs: CaptureJob[] = [];
  const claimed = new Map<string, string>();
  for (const spec of shots) {
    const out = outputFile(ASSETS_DIR, spec, "override", "override");
    const owner = claimed.get(out);
    if (owner) {
      skipped[spec.path] = `output path collides with ${owner} (${out})`;
      continue;
    }
    claimed.set(out, spec.path);
    jobs.push({ spec, role: "override", out });
  }
  return jobs;
}

test("capture wiki screenshots", async ({ browser }) => {
  test.setTimeout(0); // batch job; individual gotos still time out at 30s

  const skipped: Record<string, string> = {};
  let shots = applySeedOverlay(SHOTS, loadSeedOverlay(SEED_IDS));
  // WIKI_CAPTURE_DETAIL_ONLY captures just the dynamic (detail) routes, skipping
  // data-heavy static list pages whose screenshot can be enormous.
  if (process.env.WIKI_CAPTURE_DETAIL_ONLY) shots = shots.filter((s) => s.path.includes(":"));
  for (const spec of shots) {
    if (spec.path.includes(":") && !spec.seedId) skipped[spec.path] = "dynamic route without seedId";
  }
  const shootable = shots.filter((s) => !skipped[s.path]);

  const overrideState = process.env.WIKI_CAPTURE_EMAIL ? await ensureCaptureState(BASE_URL) : null;
  const jobs = overrideState
    ? planSingleUserJobs(shootable, skipped)
    : planJobs(shootable, skipped);

  // Group by role so each browser context is built once.
  const byRole = new Map<string, CaptureJob[]>();
  for (const job of jobs) {
    const list = byRole.get(job.role) ?? [];
    list.push(job);
    byRole.set(job.role, list);
  }

  for (const [role, roleJobs] of byRole) {
    const context = await browser.newContext({
      storageState: overrideState ?? authFile(emailForRole(role)),
      baseURL: BASE_URL,
      viewport: DEFAULT_VIEWPORT,
    });
    await setEnLocale(context, BASE_URL);
    await context.addInitScript(() => {
      const style = document.createElement("style");
      style.innerHTML =
        "*{transition:none!important;animation:none!important;caret-color:transparent!important}";
      document.documentElement.appendChild(style);
    });

    // Fresh page per job + a hard timeout: if a page wedges (heavy grids,
    // pegged main thread), abandon it and move on rather than hang the batch.
    for (const job of roleJobs) {
      const page = await context.newPage();
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          captureOne(page, job.spec, job.out),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("hard timeout after 60s")), HARD_TIMEOUT_MS);
          }),
        ]);
      } catch (err) {
        skipped[`${job.spec.path} [${job.role}]`] = (err as Error).message.split("\n")[0];
      } finally {
        if (timer) clearTimeout(timer);
        await Promise.race([page.close(), new Promise((res) => setTimeout(res, 5_000))]).catch(() => {});
      }
    }
    await context.close();
  }

  writeFileSync(RESULTS, JSON.stringify(skipped, null, 2));
  console.log(`Captured ${jobs.length - Object.keys(skipped).length} screens; skipped ${Object.keys(skipped).length}.`);

  // Expected/benign skips: missing seedId, output collision, a page nobody can
  // reach, or a known heavy page that timed out. Anything else fails loudly.
  const unexpected = Object.entries(skipped).filter(
    ([, reason]) =>
      !reason.includes("seedId") &&
      !reason.includes("collides") &&
      !reason.includes("no role could reach") &&
      !/timeout|exceeded/i.test(reason),
  );
  expect(
    unexpected,
    `Unexpected capture failures:\n${unexpected.map(([p, r]) => `  ${p} :: ${r}`).join("\n")}`,
  ).toEqual([]);
});
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 3: ตรวจ guard ว่าทำงานจริงเมื่อไม่มี matrix**

```bash
mv tests/wiki-screenshots/role-matrix.json /tmp/role-matrix.bak
bun run wiki:capture 2>&1 | grep -c "Run \"bun run wiki:probe\" first"
mv /tmp/role-matrix.bak tests/wiki-screenshots/role-matrix.json
```

Expected: `1` — ต้องล้มพร้อมข้อความสั่งให้รัน probe ก่อน ไม่ใช่ถ่ายเงียบ ๆ

- [ ] **Step 4: รัน capture จริง**

Run: `bun run wiki:capture`
Expected: จำนวน captured มากกว่า 122 (baseline + role ที่ต่าง) และมีไฟล์ suffix เกิดขึ้น

ตรวจว่า backward compat ไม่พัง:

```bash
ls ../carmen-wiki/assets/screenshots/inventory/unit/index.png
ls ../carmen-wiki/assets/screenshots/inventory/*/*--*.png | head
```

Expected: บรรทัดแรกต้องเจอไฟล์ (path เดิมยังอยู่) และบรรทัดที่สองต้องมีไฟล์ suffix อย่างน้อย 1 ไฟล์

- [ ] **Step 5: Commit**

```bash
git add tests/wiki-screenshots/capture.spec.ts
git commit -m "feat(wiki-screenshots): drive capture from the role matrix

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Dialog capture

**Files:**
- Modify: `tests/wiki-screenshots/capture.spec.ts` (เพิ่มการเปิด dialog ใน `captureOne`)
- Modify: `tests/wiki-screenshots/manifest.ts` (เพิ่ม dialog spec)

**Interfaces:**
- Consumes: `ConfigListPage` จาก `../pages/config-list.page` (มี `addButton()` ที่ `config-list.page.ts:15`)
- Produces: ไฟล์ `<module>/<slug>-dialog-add.png` สำหรับโมดูล config ที่ใช้ dialog pattern

- [ ] **Step 1: รองรับ `interaction` ใน `captureOne`**

ใน `tests/wiki-screenshots/capture.spec.ts` เพิ่ม import:

```ts
import { ConfigListPage } from "../pages/config-list.page";
```

แล้วแทรกบล็อกนี้ใน `captureOne` **ก่อน** บรรทัด `mkdirSync(dirname(out), { recursive: true });`:

```ts
  // Open the module's add dialog when the spec asks for it. Every config module
  // built on DialogCrudHelper opens it the same way, so no per-module recipe.
  if (spec.interaction === "add-dialog") {
    const list = new ConfigListPage(page, spec.path);
    await list.addButton().click({ timeout: 10_000 });
    await page.locator('[data-slot="dialog-content"]').waitFor({ state: "visible", timeout: 10_000 });
    // Let the dialog's open animation finish before shooting.
    await page.waitForTimeout(300);
  }
```

- [ ] **Step 2: เพิ่ม dialog spec ใน manifest**

ใน `tests/wiki-screenshots/manifest.ts` เพิ่ม entry เหล่านี้ต่อท้าย array `SHOTS` (ก่อน `];`):

```ts
  // Dialog-based config modules: the create form has no route of its own, so
  // capture it by opening the list page's Add dialog.
  { path: "/config/adjustment-type", module: "adjustment-type", slug: "index", interaction: "add-dialog" },
  { path: "/config/business-type", module: "business-type", slug: "index", interaction: "add-dialog" },
  { path: "/config/certification", module: "certification", slug: "index", interaction: "add-dialog" },
  { path: "/config/credit-note-reason", module: "credit-note-reason", slug: "index", interaction: "add-dialog" },
  { path: "/config/credit-term", module: "credit-term", slug: "index", interaction: "add-dialog" },
  { path: "/config/currency", module: "currency", slug: "index", interaction: "add-dialog" },
  { path: "/config/delivery-point", module: "delivery-point", slug: "index", interaction: "add-dialog" },
  { path: "/config/eco", module: "eco", slug: "index", interaction: "add-dialog" },
  { path: "/config/exchange-rate", module: "exchange-rate", slug: "index", interaction: "add-dialog" },
  { path: "/config/extra-cost", module: "extra-cost", slug: "index", interaction: "add-dialog" },
  { path: "/config/tax-profile", module: "tax-profile", slug: "index", interaction: "add-dialog" },
  { path: "/config/unit", module: "unit", slug: "index", interaction: "add-dialog" },
```

- [ ] **Step 3: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 4: รันเฉพาะ dialog เพื่อตรวจ**

Run: `bun run wiki:capture`

แล้วตรวจ:

```bash
ls ../carmen-wiki/assets/screenshots/inventory/*/index-dialog-add.png | wc -l
```

Expected: `12` — ถ้าน้อยกว่านั้น เปิด `tests/wiki-screenshots/last-run.json` อ่านเหตุผลของโมดูลที่ขาด โมดูลที่ปุ่มไม่ได้ชื่อขึ้นต้นด้วย "Add" จะคลิกไม่โดน ให้ลบ entry นั้นออกจาก manifest แล้วบันทึกไว้ใน commit message ว่าโมดูลไหนไม่รองรับ

- [ ] **Step 5: Commit**

```bash
git add tests/wiki-screenshots/capture.spec.ts tests/wiki-screenshots/manifest.ts
git commit -m "feat(wiki-screenshots): capture config add-dialogs

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Pass 3 — sitemap HTML

**Files:**
- Create: `tests/wiki-screenshots/sitemap.ts`
- Modify: `package.json` (เพิ่ม script ถัดจาก `wiki:coverage`)

**Interfaces:**
- Consumes: `discoverFrontendRoutes()` จาก `route-discovery.ts`; `loadRoleMatrix()`, `ROLE_MATRIX_PATH`, `baselineFor()` จาก `role-matrix.ts`; `outputFile()` จาก `shot-path.ts`; `SHOTS` จาก `manifest.ts`
- Produces: `../carmen-wiki/sitemap.html` และคำสั่ง `bun run wiki:sitemap`; export `buildEntries()` และ `renderSitemap()` เป็น pure function

- [ ] **Step 1: เขียน `sitemap.ts`**

สร้าง `tests/wiki-screenshots/sitemap.ts`:

```ts
import { existsSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { discoverFrontendRoutes } from "./route-discovery";
import { loadRoleMatrix, ROLE_MATRIX_PATH, baselineFor } from "./role-matrix";
import { outputFile } from "./shot-path";
import { SHOTS } from "./manifest";
import type { ProbeResult, ShotSpec } from "./types";

/** One card on the sitemap: a route plus every image that exists for it. */
export type SitemapEntry = {
  route: string;
  module: string;
  slug: string;
  baselineRole?: string;
  /** Path relative to the HTML file, or undefined when nothing was captured. */
  baselineImage?: string;
  variants: Array<{ role: string; image: string }>;
  denied: string[];
  unavailable: string[];
};

/**
 * Join the manifest, the probe matrix, and what is actually on disk.
 *
 * Disk is the authority for images: the manifest says what we intended to
 * shoot, not what succeeded.
 */
export function buildEntries(
  shots: ShotSpec[],
  matrix: ProbeResult[],
  assetsDir: string,
  htmlDir: string,
  fileExists: (p: string) => boolean,
): SitemapEntry[] {
  return shots.map((spec) => {
    const forRoute = matrix.filter((r) => r.route === spec.path);
    const base = baselineFor(matrix, spec.path);
    const rel = (abs: string): string => relative(htmlDir, abs).split("\\").join("/");

    let baselineImage: string | undefined;
    const variants: Array<{ role: string; image: string }> = [];
    if (base) {
      const baseFile = outputFile(assetsDir, spec, base.role, base.role);
      if (fileExists(baseFile)) baselineImage = rel(baseFile);
      for (const r of forRoute) {
        if (r.role === base.role || r.outcome !== "ok") continue;
        const f = outputFile(assetsDir, spec, r.role, base.role);
        if (fileExists(f)) variants.push({ role: r.role, image: rel(f) });
      }
    }

    return {
      route: spec.path,
      module: spec.module,
      slug: spec.interaction === "add-dialog" ? `${spec.slug} (dialog)` : spec.slug,
      baselineRole: base?.role,
      baselineImage,
      variants,
      denied: forRoute.filter((r) => r.outcome === "denied").map((r) => r.role),
      unavailable: forRoute
        .filter((r) => r.outcome === "not-found" || r.outcome === "error")
        .map((r) => r.role),
    };
  });
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Top-level URL segment, used as the section heading. */
function sectionOf(route: string): string {
  return route.split("/").filter(Boolean)[0] ?? "root";
}

function renderCard(e: SitemapEntry): string {
  const thumb = e.baselineImage
    ? `<img src="${esc(e.baselineImage)}" alt="${esc(e.route)}" loading="lazy">`
    : `<div class="no-shot">no screenshot</div>`;
  const badges = [
    e.baselineRole ? `<span class="b base">${esc(e.baselineRole)}</span>` : "",
    ...e.variants.map((v) => `<a class="b var" href="${esc(v.image)}">${esc(v.role)} ⊕</a>`),
    ...e.denied.map((r) => `<span class="b denied">${esc(r)} ⊘</span>`),
    ...e.unavailable.map((r) => `<span class="b na">${esc(r)} —</span>`),
  ].join("");
  const roles = [e.baselineRole ?? "", ...e.variants.map((v) => v.role), ...e.denied].join(" ");
  return `<article class="card" data-route="${esc(e.route)}" data-roles="${esc(roles)}">
  <div class="shot">${thumb}</div>
  <div class="meta"><code>${esc(e.route)}</code><span class="slug">${esc(e.module)} · ${esc(e.slug)}</span></div>
  <div class="badges">${badges}</div>
</article>`;
}

/** Render the whole sitemap as one self-contained HTML document. Pure. */
export function renderSitemap(entries: SitemapEntry[]): string {
  const sections = new Map<string, SitemapEntry[]>();
  for (const e of [...entries].sort((a, b) => a.route.localeCompare(b.route))) {
    const key = sectionOf(e.route);
    sections.set(key, [...(sections.get(key) ?? []), e]);
  }
  const captured = entries.filter((e) => e.baselineImage).length;
  const unreachable = entries.filter((e) => !e.baselineRole).length;
  const variants = entries.reduce((n, e) => n + e.variants.length, 0);

  const body = [...sections.entries()]
    .map(
      ([name, list]) =>
        `<section><h2>${esc(name)} <span class="count">${list.length}</span></h2>
<div class="grid">${list.map(renderCard).join("")}</div></section>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Carmen Inventory · Sitemap</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--bg:#fff;--fg:#111;--muted:#666;--line:#e5e5e5;--card:#fafafa}
@media(prefers-color-scheme:dark){:root{--bg:#111;--fg:#eee;--muted:#999;--line:#333;--card:#1a1a1a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
header{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:12px 20px;z-index:2}
h1{font-size:16px;margin:0 0 8px}
.stats{color:var(--muted);font-size:12px}
input{width:280px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
section{padding:16px 20px;border-bottom:1px solid var(--line)}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 12px}
.count{background:var(--card);border-radius:10px;padding:1px 7px;font-size:11px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.shot{aspect-ratio:16/10;overflow:hidden;background:var(--bg);border-bottom:1px solid var(--line)}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block}
.no-shot{display:grid;place-items:center;height:100%;color:var(--muted);font-size:12px}
.meta{padding:8px 10px 4px}
.meta code{font-size:11px;word-break:break-all;display:block}
.slug{color:var(--muted);font-size:11px}
.badges{padding:4px 10px 10px;display:flex;flex-wrap:wrap;gap:4px}
.b{font-size:10px;padding:1px 6px;border-radius:9px;border:1px solid var(--line);text-decoration:none;color:var(--fg)}
.base{background:#2563eb;color:#fff;border-color:#2563eb}
.var{background:#16a34a;color:#fff;border-color:#16a34a}
.denied{color:#b91c1c;border-color:#b91c1c}
.na{color:var(--muted)}
.hidden{display:none}
</style></head><body>
<header>
<h1>Carmen Inventory · Sitemap</h1>
<div class="stats">${entries.length} screens · ${captured} captured · ${variants} role variants · ${unreachable} unreachable</div>
<div style="margin-top:8px"><input id="q" type="search" placeholder="filter by route or role..."></div>
</header>
${body}
<script>
document.getElementById("q").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  for (const card of document.querySelectorAll(".card")) {
    const hay = (card.dataset.route + " " + card.dataset.roles).toLowerCase();
    card.classList.toggle("hidden", q !== "" && !hay.includes(q));
  }
  for (const s of document.querySelectorAll("section")) {
    s.classList.toggle("hidden", s.querySelectorAll(".card:not(.hidden)").length === 0);
  }
});
</script>
</body></html>
`;
}

function main(): void {
  const assetsDir =
    process.env.WIKI_ASSETS_DIR ?? "../carmen-wiki/assets/screenshots/inventory";
  const outPath = process.env.WIKI_SITEMAP_PATH ?? "../carmen-wiki/sitemap.html";
  const htmlDir = join(outPath, "..");
  const matrix = loadRoleMatrix(ROLE_MATRIX_PATH);

  // Routes present in the router but absent from the manifest still deserve a
  // card — otherwise a new page would be invisible in the sitemap.
  const frontendDir = process.env.E2E_FRONTEND_DIR ?? "../carmen-inventory-frontend-react";
  const known = new Set(SHOTS.map((s) => s.path));
  const extra: ShotSpec[] = discoverFrontendRoutes(frontendDir)
    .filter((r) => !known.has(r))
    .map((r) => ({ path: r, module: r.split("/").filter(Boolean)[0] ?? "root", slug: "unmapped" }));

  const entries = buildEntries([...SHOTS, ...extra], matrix, assetsDir, htmlDir, existsSync);
  writeFileSync(outPath, renderSitemap(entries));
  console.log(`Wrote ${outPath} (${entries.length} screens)`);
}

// @ts-expect-error import.meta.main is a Bun-specific CLI guard; tsc uses commonjs module mode
if (import.meta.main) main();
```

- [ ] **Step 2: เพิ่ม npm script**

ใน `package.json` แทรกหลังบรรทัด `"wiki:coverage"`:

```json
    "wiki:sitemap": "bun run tests/wiki-screenshots/sitemap.ts",
```

- [ ] **Step 3: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 4: สร้าง sitemap แล้วเปิดดู**

Run: `bun run wiki:sitemap`
Expected: log `Wrote ../carmen-wiki/sitemap.html (N screens)` โดย N ≥ 122

ตรวจว่า path รูปถูกต้อง (ต้องเป็น relative จากไฟล์ HTML):

```bash
grep -o 'src="[^"]*"' ../carmen-wiki/sitemap.html | head -3
```

Expected: เห็น `src="assets/screenshots/inventory/..."` ไม่ใช่ path ขึ้นต้นด้วย `/` หรือ `../`

เปิดดูจริง:

```bash
open ../carmen-wiki/sitemap.html
```

Expected: เห็น thumbnail จริง, badge สีน้ำเงินคือ baseline role, สีเขียวคือ role ที่เห็นต่าง, สีแดงคือ denied และช่องค้นหากรองการ์ดได้

- [ ] **Step 5: Commit**

```bash
git add tests/wiki-screenshots/sitemap.ts package.json
git commit -m "feat(wiki-screenshots): generate self-contained sitemap page

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Coverage report รู้จักมิติ role

**Files:**
- Modify: `tests/wiki-screenshots/coverage.ts` (แก้ `renderReport` และ `main`)

**Interfaces:**
- Consumes: `loadRoleMatrix()`, `ROLE_MATRIX_PATH`, `baselineFor()`, `rolesToCapture()` จาก `role-matrix.ts`
- Produces: `screenshot-coverage.md` ที่มีคอลัมน์ Roles เพิ่ม (`computeCoverage` และ `CoverageRow` ไม่เปลี่ยน signature — unit test เดิมที่ `unit/wiki-screenshots/coverage.test.ts` ต้องยังผ่าน)

- [ ] **Step 1: เพิ่มคอลัมน์ Roles ใน `renderReport`**

ใน `tests/wiki-screenshots/coverage.ts` แก้ `renderReport` ให้รับ map เสริม โดยเปลี่ยน signature เป็น:

```ts
export function renderReport(
  rows: CoverageRow[],
  rolesByRoute: Record<string, string> = {},
): string {
```

แล้วในตัวฟังก์ชัน เปลี่ยนหัวตารางสองบรรทัดเป็น:

```ts
    "| Route | Status | Module | Slug | Roles | Note |",
    "|-------|--------|--------|------|-------|------|",
```

และเปลี่ยนการ map body เป็น:

```ts
    .map(
      (r) =>
        `| \`${r.route}\` | ${r.status} | ${r.module ?? ""} | ${r.slug ?? ""} | ${rolesByRoute[r.route] ?? ""} | ${r.reason ?? ""} |`,
    );
```

- [ ] **Step 2: ป้อนข้อมูล role เข้าไปใน `main`**

ใน `main()` ของไฟล์เดียวกัน เพิ่ม import ที่หัวไฟล์:

```ts
import { loadRoleMatrix, ROLE_MATRIX_PATH, baselineFor, rolesToCapture } from "./role-matrix";
```

แล้วแทนที่บรรทัด `const md = renderReport(computeCoverage(routes, shots, skipped));` ด้วย:

```ts
  // The role matrix is optional here: coverage still works before the first
  // probe run, it just cannot show the Roles column.
  const rolesByRoute: Record<string, string> = {};
  try {
    const matrix = loadRoleMatrix(ROLE_MATRIX_PATH);
    for (const route of new Set(matrix.map((r) => r.route))) {
      const base = baselineFor(matrix, route);
      if (!base) {
        rolesByRoute[route] = "none";
        continue;
      }
      const extra = rolesToCapture(matrix, route);
      rolesByRoute[route] = extra.length ? `${base.role} +${extra.length}` : base.role;
    }
  } catch {
    console.warn("No role-matrix.json yet — Roles column will be empty. Run: bun run wiki:probe");
  }
  const md = renderReport(computeCoverage(routes, shots, skipped), rolesByRoute);
```

- [ ] **Step 3: Type-check**

Run: `bunx tsc --noEmit`
Expected: ไม่มี error

- [ ] **Step 4: ตรวจว่า unit test เดิมยังผ่าน**

Run: `bunx vitest run unit/wiki-screenshots/`
Expected: PASS ทั้งหมด — `renderReport` มี default parameter จึงเรียกแบบ 1 argument ได้เหมือนเดิม

- [ ] **Step 5: รัน coverage จริง**

Run: `bun run wiki:coverage`
Expected: เขียน `../carmen-wiki/.specs/screenshot-coverage.md` และในไฟล์มีคอลัมน์ `Roles` ที่มีค่าเช่น `Admin`, `Admin +2`, `none`

- [ ] **Step 6: Commit**

```bash
git add tests/wiki-screenshots/coverage.ts
git commit -m "feat(wiki-screenshots): show role coverage in the report

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Definition of done

- [ ] `bunx tsc --noEmit` ผ่าน
- [ ] `bunx vitest run` ผ่านทั้งหมด (รวม test เดิมของ repo)
- [ ] `bun run wiki:probe` เขียน `role-matrix.json` ที่มีทั้ง outcome `ok` และ `denied`
- [ ] `bun run wiki:capture` ถ่ายได้มากกว่า 122 ไฟล์ และไฟล์เดิมที่ `<module>/<slug>.png` ยังอยู่ครบ
- [ ] `bun run wiki:sitemap` สร้าง `../carmen-wiki/sitemap.html` ที่เปิดแล้วเห็นรูปจริงและกรองได้
- [ ] เอกสาร wiki เดิมทั้ง 10 ไฟล์ยังแสดงรูปได้ — ตรวจด้วย `grep -o 'screenshots/inventory/[^)]*' ../carmen-wiki/en/inventory/inventory.md | while read p; do test -f "../carmen-wiki/$p" || echo "BROKEN: $p"; done` แล้วต้องไม่มีบรรทัด BROKEN
