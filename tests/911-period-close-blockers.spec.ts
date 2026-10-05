import type { Page } from "@playwright/test";
import {
  test,
  expect,
  gotoInBu,
  BU,
  SCHEMA,
  pinBusinessUnit,
  requireScenario,
  shot,
  record,
  prevRecord,
  review,
  getDoc,
  putDoc,
  sql,
} from "./helpers/period-close/context";
import { deleteAdjustment } from "./helpers/period-close/docs";
import { startExpectingBlocked } from "./helpers/period-close/period-end";
import { btn } from "./helpers/movement/ui";
import { SCN, PERIOD } from "./helpers/period-close/scenarios";
import { authFile } from "./fixtures/auth.paths";
import { MOVEMENT_USERS } from "./movement-users";

/**
 * Period close · phase 911 — Case 1 ด่าน Start: เอกสารที่ค้างอยู่จริงก่อนเริ่มทดสอบ (section 41).
 *
 * เอกสารที่ค้างอยู่จริงก่อนเริ่มทดสอบ (SCN.preBlockers) ใช้เป็นเคส 1.N1 "SR ค้างขวาง Start"
 * ซึ่งสร้างเองผ่าน UI ไม่ได้ (submit SR ประทับ sr_date = วันนี้ ใบจึงตกงวดของวันนี้เสมอ) — CARMEN-AVG มี SR ค้างรอ HOD อยู่แล้ว
 * เคลียร์: SO ร่าง = admin ลบผ่าน UI · SR = ผู้อนุมัติขั้นปัจจุบัน (HOD) → เลือกทุกรายการ → Reject → Reject ทั้งใบ
 * (reject ตั้ง doc_status = voided: store-requisition.service.ts reject) · ห้ามกด Start ซ้ำหลังเคลียร์ — ผ่านคือเปิดรอบนับจริง
 *
 * Irreversible? ไม่แตะสถานะงวด (การกด Start ถูกดัก: ไม่มีตัวขวางจริง = ตัด request ทิ้ง ดู startExpectingBlocked)
 *   แต่ลบ SO ร่าง / reject SR ที่ค้างอยู่จริงบน BU — ย้อนกลับไม่ได้
 * Prerequisites: เฉพาะ scenario ที่ระบุ preBlockers (เลข SO ร่าง / SR ที่ค้างอยู่จริง) — ตอนนี้ยังไม่มี scenario ไหนระบุ จึงถูกข้ามเสมอ
 *   จนกว่ารอบใหม่จะเจอเอกสารค้างจริงแล้วใส่ preBlockers ลงใน scenario นั้น (ตัวอย่างเดิม: avg09 ในต้นฉบับ)
 *   · 910 ผ่านแล้ว · movement-setup (storageState ของ admin และ hod)
 * Run:  E2E_PERIOD_SCENARIO=<scenario ที่มี preBlockers> bun run test:period-close -- tests/911-period-close-blockers.spec.ts
 *
 * Origin: _movement_play/eop_bf/e2e/specs/05-blockers.spec.ts (sub-case 1.N1)
 */
const CASE = "Case 1 · ด่าน Start";

test.skip(!SCN.preBlockers, "เฉพาะ scenario ที่มีเอกสารค้างอยู่ก่อน (preBlockers)");

test.beforeAll(() => requireScenario());

const inList = (nos: string[]) => nos.map((n) => `'${n}'`).join(",");

function soDocs() {
  return sql<{ id: string; no: string; st: string }>(`select id, so_no no, doc_status::text st from ${SCHEMA}.tb_stock_out
    where so_no in (${inList(SCN.preBlockers!.soDrafts)}) and deleted_at is null`);
}
function srDocs() {
  return sql<{ id: string; no: string; st: string; stage: string }>(`select id, sr_no no, doc_status::text st, workflow_current_stage stage
    from ${SCHEMA}.tb_store_requisition where sr_no in (${inList(SCN.preBlockers!.srInProgress)}) and deleted_at is null order by sr_no`);
}

/** HOD: เลือกทุกรายการ → Reject (ใส่เหตุผล) → Reject ทั้งใบ → ยืนยัน */
async function rejectSr(page: Page, id: string, no: string, images: string[]) {
  await gotoInBu(page, `/store-operation/store-requisition/${id}`);
  await page.waitForTimeout(1500);
  images.push(await shot(page, "1.N1", `d-${no}-HOD-เปิดใบ`));
  // หน้าใบเปิดมาเป็นโหมดดู — checkbox ของรายการโผล่หลังกด Edit
  await btn(page, "Edit").first().click();
  await page.waitForTimeout(1000);
  // เลือกทุกแถว: checkbox หัวตาราง (ถ้าเปิด dialog เลือก "ทั้งหมด" ให้กดตัวแรก)
  await page.locator("thead").getByRole("checkbox").first().click();
  const pick = page.locator("[role=dialog]").last();
  if (await pick.isVisible()) await pick.getByRole("button").first().click();
  await btn(page, "Reject").first().click();
  const bulk = page.locator("[role=alertdialog]").last();
  await expect(bulk).toBeVisible();
  for (const box of await bulk.locator("textarea").all()) await box.fill(`E2E ${PERIOD}: เคลียร์ SR ค้างก่อนเริ่มนับ`);
  images.push(await shot(page, "1.N1", `e-${no}-เลือก-Reject-ทุกรายการ`));
  await bulk.getByRole("button", { name: "Reject" }).click();
  await expect(bulk).toBeHidden();
  // ปุ่ม Reject ของทั้งใบอยู่ที่แถบล่าง (โผล่เมื่อทุกรายการถูกตั้งเป็น reject)
  await btn(page, "Reject").last().click();
  const confirm = page.locator("[role=alertdialog]").last();
  await expect(confirm).toBeVisible();
  const done = page.waitForResponse((r) => /\/store-requisitions?\/.*reject/.test(r.url()) && r.request().method() !== "GET", { timeout: 60_000 });
  await confirm.getByRole("button", { name: "Reject" }).click();
  const resp = await done;
  expect(resp.ok(), `reject ${no} ${resp.status()} ${await resp.text()}`).toBe(true);
  await expect.poll(() => srDocs().find((d) => d.no === no)?.st, { timeout: 30_000 }).toBe("voided");
  await gotoInBu(page, `/store-operation/store-requisition/${id}`);
  await page.waitForTimeout(1500);
  images.push(await shot(page, "1.N1", `f-${no}-voided`));
}

test(
  "TC-PE-410001 SR และ SO ที่ค้างอยู่จริงในงวดขวาง Start Period Close แล้วเคลียร์ได้ (HOD reject SR · admin ลบ SO ร่าง)",
  {
    annotation: [
      { type: "preconditions", description: "scenario ระบุ preBlockers (เลข SR ที่รอ HOD อนุมัติ + SO ร่าง ที่ค้างอยู่จริงบน BU — ตอนนี้ยังไม่มี scenario ไหนระบุ จึงถูกข้าม); Login เป็น admin@carmen.com และมี storageState ของ hod@carmen.com (movement-setup); รอบนับของงวดยังไม่เริ่ม" },
      { type: "steps", description: "1. เปิดใบ SR ที่ค้าง (in_progress) ถ่ายภาพ\n2. Period End → Start Period Close → ยืนยัน (POST start-counting ถูกดัก: ถ้าไม่มีตัวขวางจริงจะตัด request ทิ้ง)\n3. ตรวจ dialog \"Finish these documents first\" แล้วกด Close\n4. admin ลบ SO ร่างแต่ละใบ (Delete → ยืนยัน)\n5. hod@carmen.com เปิด SR แต่ละใบ → Edit → เลือกทุกรายการ → Reject (กรอกเหตุผล) → Reject ทั้งใบ → ยืนยัน\n6. GET period-ends/review" },
      { type: "expected", description: "Start ถูกปฏิเสธ 422 และ dialog ลิสต์ SR/SO ทุกใบ; start_blocking.sr ก่อนกด = จำนวน SR ที่ค้าง; reject แล้ว SR มี doc_status = voided; หลังเคลียร์ start_blocking.total = 0" },
      { type: "priority", description: "High" },
      { type: "testType", description: "Negative" },
      { type: "note", description: "เดิม 1.N1 (_movement_play specs/05-blockers) · ผลขั้นกด Start เก็บใน state (1.N1-start) รันซ้ำหลังเคลียร์ไปบางส่วนจะไม่เสียหลักฐานรอบแรก · ผ่านแล้วในรอบก่อน (results.json = PASS) → test.skip แทน return เงียบ ๆ · HOD เข้าระบบด้วย storageState จาก movement-setup แทน login ผ่านฟอร์ม · ทับซ้อน TC-PE-310005 (ชนิดเอกสารค้างหลายชนิด) · ย้อนกลับไม่ได้: ลบ/reject เอกสารจริง" },
    ],
  },
  async ({ page, browser }) => {
    const pb = SCN.preBlockers!;
    const prev = prevRecord("1.N1");
    test.skip(prev?.status === "PASS", `1.N1 ผ่านแล้วเมื่อ ${prev?.at} — เอกสารค้างถูกเคลียร์ไปแล้ว`);
    const approver = Object.values(MOVEMENT_USERS).find((u) => u.email === pb.srApprover);
    expect(approver, `${pb.srApprover} ต้องเป็นบัญชีใน MOVEMENT_USERS (movement-setup เขียน storageState ให้)`).toBeDefined();
    const images: string[] = [];
    const so = soDocs().filter((d) => d.st === "draft");
    const sr = srDocs().filter((d) => d.st === "in_progress");

    // ผลของขั้นกด Start เก็บลง state — รันซ้ำหลังเคลียร์ไปบางส่วนแล้วจะได้ไม่เสียหลักฐานรอบแรก
    type StartStep = { counts: Record<string, number>; total: number; listed: { no: string; shown: boolean }[]; note?: string };
    let start = getDoc("1.N1-start") as unknown as StartStep | undefined;
    if (!start) {
      const before = await review(BU);
      for (const d of sr) {
        await gotoInBu(page, `/store-operation/store-requisition/${d.id}`);
        await page.waitForTimeout(1500);
        images.push(await shot(page, "1.N1", `a-${d.no}-${d.st}-${d.stage}`));
      }
      const dialog = await startExpectingBlocked(page);
      const dialogText = (await dialog.innerText()).replace(/\s+/g, " ");
      images.push(await shot(page, "1.N1", "b-กด-Start-ถูกบล็อก"));
      await btn(dialog, "Close").last().click();
      start = {
        counts: before.start_blocking.counts, total: before.start_blocking.total,
        listed: [...so, ...sr].map((d) => ({ no: d.no, shown: dialogText.includes(d.no) })),
      };
      putDoc("1.N1-start", { id: "", no: "", status: "done", ...start });
    }
    const listed = start.listed;

    // SO ร่าง — admin ลบเอง
    for (const d of so) {
      await deleteAdjustment(page, "stock-out", d.id);
      images.push(await shot(page, "1.N1", `c-ลบ-${d.no}`));
    }

    // SR — ผู้อนุมัติขั้นปัจจุบันเป็นคน reject (admin ไม่อยู่ใน user_action ของขั้น HOD)
    const projectUse = test.info().project.use;
    const ctx = await browser.newContext({
      baseURL: projectUse.baseURL,
      viewport: projectUse.viewport,
      locale: projectUse.locale,
      timezoneId: projectUse.timezoneId,
      storageState: authFile(pb.srApprover),
    });
    const hod = await ctx.newPage();
    await pinBusinessUnit(hod, BU);
    for (const d of sr) await rejectSr(hod, d.id, d.no, images);
    await ctx.close();

    const after = await review(BU);
    const srAfter = srDocs();
    const pass =
      (start.counts.sr ?? 0) === pb.srInProgress.length &&
      listed.every((l) => l.shown) && after.start_blocking.total === 0;
    record({
      id: "1.N1", case: CASE, title: `SR ค้าง (in_progress) ในงวด ${PERIOD} ขวาง Start — ใช้ใบที่ค้างอยู่จริงบน ${BU}`,
      steps: [
        `ใบที่ค้างอยู่ก่อนทดสอบ: SR ${pb.srInProgress.join(", ")} (รอ HOD) · SO ร่าง ${pb.soDrafts.join(", ")}`,
        "Period End → Start Period Close → ยืนยัน",
        `admin ลบ SO ร่าง · ${pb.srApprover} เลือกทุกรายการ → Reject → Reject ทั้งใบ`,
      ],
      expected: `Start ถูกปฏิเสธ (422) · dialog ลิสต์ SR ทุกใบ · start_blocking.sr = ${pb.srInProgress.length} · หลังเคลียร์ total = 0`,
      actual:
        `start_blocking ก่อนกด=${JSON.stringify(start.counts)} total=${start.total}; ` + (start.note ? `${start.note}; ` : "") +
        `dialog: ${listed.map((l) => `${l.no}${l.shown ? "✓" : "✗ไม่แสดง"}`).join(", ")}; ` +
        `SR หลัง reject: ${srAfter.map((d) => `${d.no}=${d.st}`).join(", ")}; หลังเคลียร์ total=${after.start_blocking.total}`,
      status: pass ? "PASS" : "FAIL", docs: [...pb.soDrafts, ...pb.srInProgress], images,
    });
    expect(pass, "ดู actual ใน results.json").toBe(true);
  },
);
