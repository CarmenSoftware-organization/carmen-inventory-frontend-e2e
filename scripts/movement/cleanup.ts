/**
 * เก็บกวาดเอกสารที่ชุด fe/ สร้าง (หาจากเครื่องหมาย FE-CRUD / FE-GRN / FE-CN ในคำอธิบาย/เลขใบกำกับ)
 *   bun run movement:cleanup           → ลิสต์อย่างเดียว
 *   bun run movement:cleanup --apply   → draft = ลบ · PR/PO/SR ที่ส่งแล้ว = HOD reject · GRN saved = void
 * ไม่แตะ: ใบที่ลงสต๊อกแล้ว (GRN committed ที่ CN อ้าง · CN/SI/SO completed) — ลงบัญชีไปแล้ว ถอยไม่ได้
 *
 * ย้ายมาจาก _movement_play/eop_bf/e2e/fe/cleanup.ts · ต้องตั้ง E2E_DB_URL
 */
import { sql as rawSql } from "../../tests/helpers/movement/db";
import { apiSend } from "../../tests/helpers/movement/api";
import { MOVEMENT_USERS, type MovementUser } from "../../tests/movement-users";

const APPLY = process.argv.includes("--apply");
const sql = <T = any>(q: string) => rawSql<T>(q);
// ใบที่ไม่มีคำอธิบาย (ใบสำรวจของชุดเดิม) — ใส่ id ตรง ๆ
const PROBE_ADJ = (process.env.PROBE_ADJ ?? "").split(",").filter(Boolean);

interface Row { bu: string; kind: string; id: string; no: string; status: string; stage?: string; doc_version?: number }
const rows: Row[] = [];
const AVG = `"CARMEN_AVG"`;
const FIFO = `"CARMEN_FIFO"`;
for (const r of sql(`select id, pr_no no, pr_status::text status, workflow_current_stage stage, doc_version from ${AVG}.tb_purchase_request where deleted_at is null and description like 'FE-CRUD%'`)) rows.push({ bu: "CARMEN-AVG", kind: "purchase-requests", ...r });
for (const r of sql(`select id, po_no no, po_status::text status, workflow_current_stage stage, doc_version from ${AVG}.tb_purchase_order where deleted_at is null and description like 'FE-CRUD%'`)) rows.push({ bu: "CARMEN-AVG", kind: "purchase-orders", ...r });
for (const r of sql(`select id, sr_no no, doc_status::text status, workflow_current_stage stage, doc_version from ${AVG}.tb_store_requisition where deleted_at is null and description like 'FE-CRUD%'`)) rows.push({ bu: "CARMEN-AVG", kind: "store-requisitions", ...r });
// GRN/CN/SI/SO: รอบ admin ทำบน FIFO · รอบตามบทบาททำบน AVG — กวาดทั้งสอง BU
for (const [bu, sc] of [["CARMEN-FIFO", FIFO], ["CARMEN-AVG", AVG]] as const) {
  for (const r of sql(`select id, grn_no no, doc_status::text status from ${sc}.tb_good_received_note where deleted_at is null and invoice_no like 'FE-%' and doc_status::text in ('draft','saved')`)) rows.push({ bu, kind: "good-received-notes", ...r });
  for (const r of sql(`select id, cn_no no, doc_status::text status from ${sc}.tb_credit_note where deleted_at is null and tax_invoice_no like 'FE-CN-%' and doc_status::text = 'draft'`)) rows.push({ bu, kind: "credit-notes", ...r });
  const ids = PROBE_ADJ.map((x) => `'${x}'`).join(",") || "''";
  for (const r of sql(`select id, si_no no, doc_status::text status from ${sc}.tb_stock_in where deleted_at is null and doc_status::text = 'draft' and (description like 'FE-CRUD%' or id::text in (${ids}))`)) rows.push({ bu, kind: "stock-ins", ...r });
  for (const r of sql(`select id, so_no no, doc_status::text status from ${sc}.tb_stock_out where deleted_at is null and doc_status::text = 'draft' and (description like 'FE-CRUD%' or id::text in (${ids}))`)) rows.push({ bu, kind: "stock-outs", ...r });
}

/** draft ลบได้เฉพาะเจ้าของ (PR_DELETE_FORBIDDEN) — ลอง admin ก่อน แล้วไล่บัญชีที่ชุดตามบทบาทใช้ */
async function deleteAsOwner(r: Row) {
  let res = await apiSend("DELETE", `/api/${r.bu}/${r.kind}/${r.id}`);
  for (const u of Object.keys(MOVEMENT_USERS) as MovementUser[]) {
    if (res.status !== 403) break;
    res = await apiSend("DELETE", `/api/${r.bu}/${r.kind}/${r.id}`, undefined, u);
  }
  return res;
}

async function reject(r: Row) {
  const { body } = await apiSend("GET", `/api/${r.bu}/${r.kind}/${r.id}`, undefined, "hod");
  const d = body.data;
  const details = d.purchase_request_detail ?? d.purchase_order_detail ?? d.store_requisition_detail ?? [];
  return apiSend("PATCH", `/api/${r.bu}/${r.kind}/${r.id}/reject`, {
    doc_version: d.doc_version,
    stage_role: "approve",
    details: details.map((x: any) => ({ id: x.id, stage_status: "reject", stage_message: "FE-CRUD cleanup" })),
  }, "hod");
}

for (const r of rows) {
  let action = "";
  if (r.status === "draft") action = "delete";
  else if (r.status === "in_progress") action = "reject";
  else if (r.kind === "good-received-notes" && r.status === "saved") action = "void";
  else action = "skip";
  let result = "";
  if (APPLY && action !== "skip") {
    const res =
      action === "delete" ? await deleteAsOwner(r)
      : action === "void" ? await apiSend("DELETE", `/api/${r.bu}/${r.kind}/${r.id}/void`, { void_reason: "FE-CRUD cleanup" })
      : await reject(r);
    result = `→ ${res.status} ${res.status >= 300 ? JSON.stringify(res.body).slice(0, 200) : ""}`;
  }
  console.log(`${r.bu.padEnd(11)} ${r.kind.padEnd(19)} ${String(r.no).padEnd(16)} ${r.status.padEnd(11)} ${r.stage ?? ""} [${action}] ${result}`);
}
