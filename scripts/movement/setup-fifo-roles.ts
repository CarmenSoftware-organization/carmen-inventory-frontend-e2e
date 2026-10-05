/**
 * ตั้งค่า CARMEN-FIFO ให้บัญชีตามบทบาทเดิน SR จนถึง Issue ได้ (พิสูจน์กลับของกฎ #718 — FIFO งวดปัจจุบัน = เดือนนี้)
 *   bun run movement:setup-fifo-roles           → สำรองค่าเดิมแล้วตั้งค่า
 *   bun run movement:setup-fifo-roles restore   → คืนค่าเดิม (ถอด role · คืนคลัง · คืน workflow) แล้วลบไฟล์สำรอง
 *
 * ณ 2026-10-02 บน FIFO มีแต่ admin ที่มี role/คลัง — role ตามบทบาท (Requestor / HOD / Purchase) มีอยู่แล้วแต่ไม่มีคนถือ
 *   requestor → Requestor + คลัง TEST-MOVE, TEST-CONSUME (คู่เดียวที่มีสินค้าร่วม: T-0x-F)
 *   hod       → HOD (หัวหน้าแผนก SR Test Dept บน FIFO อยู่แล้ว)
 *   fc        → Purchase + คลัง TEST-MOVE (รับของเข้าด้วย GRN และเป็นคนกด Issue — อยู่ใน stage Issue ของ workflow)
 *   workflow "SR Test Flow v2 (with Issue)" บน FIFO ← สินค้าของ TEST-MOVE (เดิม 0 ตัว = lookup ว่าง)
 *
 * ย้ายมาจาก _movement_play/eop_bf/e2e/fe/setup-fifo-roles.ts — ไฟล์สำรองอยู่ runs/movement/ · ต้องตั้ง E2E_DB_URL (อ่าน role/คลังจาก DB)
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { apiSend } from "../../tests/helpers/movement/api";
import { sql } from "../../tests/helpers/movement/db";
import type { MovementUser } from "../../tests/movement-users";

const BU = "CARMEN-FIFO";
const BACKUP = "runs/movement/fifo-roles-backup.json";
const WF = "SR Test Flow v2 (with Issue)";
const PLAN = [
  { user: "requestor", role: "Requestor", locations: ["TEST-MOVE", "TEST-CONSUME"] },
  { user: "hod", role: "HOD", locations: null },
  { user: "fc", role: "Purchase", locations: ["TEST-MOVE"] },
] as const;

const ok = (what: string, r: { status: number; body: any }) => {
  if (r.status >= 300) throw new Error(`${what} → ${r.status} ${JSON.stringify(r.body).slice(0, 300)}`);
  return r.body;
};
const userId = async (key: MovementUser) => ok(`profile ${key}`, await apiSend("GET", "/api/user/profile", undefined, key)).data.id as string;
const locIds = (codes: readonly string[]) =>
  sql<{ id: string; code: string }>(`select id, code from "CARMEN_FIFO".tb_location where deleted_at is null and code in (${codes.map((c) => `'${c}'`).join(",")})`);
const userLocCodes = (uid: string) =>
  sql<{ code: string; id: string }>(`select l.code, l.id from "CARMEN_FIFO".tb_location_user ul join "CARMEN_FIFO".tb_location l on l.id = ul.location_id where ul.user_id = '${uid}' and ul.deleted_at is null`);

const roles = ok("roles", await apiSend("GET", `/api/config/${BU}/application-roles?perpage=100`)).data as any[];
const roleId = (name: string) => roles.find((r) => r.name.trim() === name)?.id as string;
const wfList = ok("workflows", await apiSend("GET", `/api/config/${BU}/workflows?perpage=100`)).data as any[];
const wfId = wfList.find((w) => w.name === WF)!.id as string;
const getWf = async () => ok("workflow", await apiSend("GET", `/api/config/${BU}/workflows/${wfId}`)).data;

if (process.argv[2] === "restore") {
  const b = JSON.parse(readFileSync(BACKUP, "utf8"));
  for (const p of b.plan) {
    // DELETE /user-application-roles ตอบ 400 "Argument `id`: … Expected String, provided Object" (prisma error หลุด — 2026-10-02)
    // จึงถอดผ่าน PATCH { remove } แทน
    if (p.addedRole) {
      ok("remove role", await apiSend("PATCH", `/api/config/${BU}/user-application-roles`, { user_id: p.userId, application_role_id: { remove: [p.addedRole] } }));
      console.log("role -", p.user);
    }
    if (p.locationsBefore) {
      ok("locations", await apiSend("PUT", `/api/config/${BU}/locations-users/${p.userId}`, { location_ids: p.locationsBefore }));
      console.log("locations ←", p.user, p.locationsBefore.length);
    }
  }
  const wf = await getWf();
  ok("workflow", await apiSend("PUT", `/api/config/${BU}/workflows/${wfId}`, { doc_version: wf.doc_version, data: b.workflowData }));
  console.log("workflow ← เดิม");
  rmSync(BACKUP);
  process.exit(0);
}

if (existsSync(BACKUP)) throw new Error(`มีไฟล์สำรองค้างอยู่ (${BACKUP}) — restore ก่อน`);
const backup: any = { plan: [], workflowData: null };
for (const p of PLAN) {
  const uid = await userId(p.user);
  const has = sql<{ n: string }>(`select count(*) n from "CARMEN_SYSTEM".tb_user_tb_application_role where user_id = '${uid}' and application_role_id = '${roleId(p.role)}' and deleted_at is null`)[0];
  const entry: any = { user: p.user, userId: uid, addedRole: null, locationsBefore: null };
  if (Number(has.n) === 0) {
    ok("assign role", await apiSend("POST", `/api/config/${BU}/user-application-roles`, { user_id: uid, application_role_id: { add: [roleId(p.role)] } }));
    entry.addedRole = roleId(p.role);
  }
  if (p.locations) {
    const before = userLocCodes(uid);
    entry.locationsBefore = before.map((l) => l.id);
    const want = [...new Set([...before.map((l) => l.id), ...locIds(p.locations).map((l) => l.id)])];
    ok("locations", await apiSend("PUT", `/api/config/${BU}/locations-users/${uid}`, { location_ids: want }));
  }
  backup.plan.push(entry);
  console.log(p.user, "→", p.role, entry.addedRole ? "(เพิ่ม)" : "(มีอยู่แล้ว)", p.locations ? `คลัง ${userLocCodes(uid).map((l) => l.code).join(",")}` : "");
}
const wf = await getWf();
backup.workflowData = wf.data;
mkdirSync("runs/movement", { recursive: true });
writeFileSync(BACKUP, JSON.stringify(backup, null, 2));
const products = sql<{ id: string }>(`select pl.product_id id from "CARMEN_FIFO".tb_product_location pl join "CARMEN_FIFO".tb_location l on l.id = pl.location_id where l.code = 'TEST-MOVE' and pl.deleted_at is null`).map((r) => r.id);
ok("workflow", await apiSend("PUT", `/api/config/${BU}/workflows/${wfId}`, { doc_version: wf.doc_version, data: { ...wf.data, products } }));
console.log(`workflow ${WF} +${products.length} products · backup → ${BACKUP}`);
