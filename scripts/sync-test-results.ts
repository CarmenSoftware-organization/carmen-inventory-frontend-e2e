/**
 * Sync Playwright test results back to Google Sheets.
 *
 * Reads CSV files written by the tc-csv-reporter, then upserts each row's
 * Status + Test Date into the spec sheet by matching the "Test ID" column.
 *
 * Usage:
 *   bun run scripts/sync-test-results.ts
 *
 * Required env (set in .env.local — do NOT commit):
 *   GOOGLE_SHEETS_SA_KEY_PATH=/absolute/path/to/service-account.json
 *   GOOGLE_SHEETS_SPREADSHEET_ID=1eLuXtc-UxkgCCgImw2SI2XAX32LlPT3UHfxIpzmFoLc
 *
 * Setup steps (one-time):
 *   1. Google Cloud Console → create project → enable "Google Sheets API"
 *   2. IAM → Service Accounts → Create → download JSON key
 *   3. Open the target spreadsheet → Share → paste the service account email
 *      (xxx@xxx.iam.gserviceaccount.com) with Editor permission
 *   4. Set the env vars above
 *   5. bun add -D googleapis
 *   6. bun run scripts/sync-test-results.ts
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";

interface ResultRow {
  seq: string;
  testId: string;
  title: string;
  status: string;
  date: string;
  error: string;
  duration: string;
}

interface SyncTarget {
  csvFile: string; // file under tests/results/
  sheetTab: string; // exact tab name in the spreadsheet
}

// Add more entries here as new spec sheets/tabs are introduced.
const SYNC_TARGETS: SyncTarget[] = [
  { csvFile: "login-results.csv", sheetTab: "Login" },
  { csvFile: "delivery-point-results.csv", sheetTab: "Delivery Point" },
  { csvFile: "adjustment-type-results.csv", sheetTab: "Adjustment Type" },
  { csvFile: "business-type-results.csv", sheetTab: "Business Type" },
  { csvFile: "credit-note-reason-results.csv", sheetTab: "Credit Note Reason" },
  { csvFile: "credit-term-results.csv", sheetTab: "Credit Term" },
  { csvFile: "currency-results.csv", sheetTab: "Currency" },
  { csvFile: "department-results.csv", sheetTab: "Department" },
  { csvFile: "exchange-rate-results.csv", sheetTab: "Exchange Rate" },
  { csvFile: "extra-cost-results.csv", sheetTab: "Extra Cost" },
  { csvFile: "location-results.csv", sheetTab: "Location" },
  { csvFile: "tax-profile-results.csv", sheetTab: "Tax Profile" },
  { csvFile: "unit-results.csv", sheetTab: "Unit" },
  { csvFile: "vendor-results.csv", sheetTab: "Vendor" },
];

const RESULTS_DIR = resolve(process.cwd(), "tests/results");

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function loadResults(csvFile: string): ResultRow[] {
  const path = resolve(RESULTS_DIR, csvFile);
  if (!existsSync(path)) {
    console.warn(`[skip] ${csvFile} not found at ${path}`);
    return [];
  }
  const rows = parseCsv(readFileSync(path, "utf8"));
  return rows
    .filter((r) => r["Test ID"])
    .map((r) => ({
      seq: r["Seq"] ?? "",
      testId: r["Test ID"],
      title: r["Title"] ?? r["Description"] ?? "",
      status: r["Status"] ?? "",
      date: r["Test Date"] ?? "",
      error: r["Error"] ?? "",
      duration: r["Duration (ms)"] ?? "",
    }));
}

function filterRowsForTab(_tab: string, rows: ResultRow[]): ResultRow[] {
  // Each spec now writes its own CSV, so no cross-filtering is needed.
  return rows;
}

async function syncTab(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  target: SyncTarget,
  results: ResultRow[],
) {
  const filtered = filterRowsForTab(target.sheetTab, results);
  if (filtered.length === 0) {
    console.log(`[${target.sheetTab}] no matching rows in ${target.csvFile}`);
    return;
  }

  // 1. Read the existing sheet to find the row index of each Test ID + the
  //    column index of "Status" and "Test Date".
  const range = `${target.sheetTab}!A1:Z`;
  let grid: string[][] = [];
  try {
    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    grid = (data.values ?? []) as string[][];
  } catch (err: unknown) {
    const e = err as { status?: number; code?: number; message?: string };
    const status = e?.status ?? e?.code;
    const message = e?.message ?? String(err);
    if (status === 400 || status === 404) {
      console.warn(`[${target.sheetTab}] skipped — ${message}`);
      return;
    }
    console.error(`[${target.sheetTab}] error (${status ?? "?"}): ${message}`);
    throw err;
  }
  if (grid.length === 0) {
    console.warn(`[${target.sheetTab}] tab is empty — skipping`);
    return;
  }
  const header = grid[0];
  const idCol = header.indexOf("Test ID");
  const statusCol = header.indexOf("Status");
  const dateCol = header.indexOf("Test Date");
  const errorCol = header.indexOf("Error");
  const durationCol = header.indexOf("Duration (ms)");
  const seqCol = header.indexOf("Seq");
  // Title may be stored under "Title" or "Description" depending on the sheet
  const titleCol = (() => {
    const i = header.indexOf("Title");
    return i >= 0 ? i : header.indexOf("Description");
  })();
  if (idCol < 0 || statusCol < 0 || dateCol < 0) {
    console.warn(
      `[${target.sheetTab}] missing required columns (Test ID/Status/Test Date) — skipping`,
    );
    return;
  }

  const idToRow = new Map<string, number>();
  for (let i = 1; i < grid.length; i++) {
    const id = grid[i][idCol];
    if (id) idToRow.set(id, i + 1); // 1-indexed for A1 notation
  }

  // 2. Build batch update payload for existing rows + append payload for new ones.
  const dataUpdates: { range: string; values: string[][] }[] = [];
  const appendRows: string[][] = [];
  const headerLen = header.length;
  let matched = 0;
  let appended = 0;
  for (const r of filtered) {
    const rowNum = idToRow.get(r.testId);
    if (!rowNum) {
      // Build a new row matching header width; fill only known columns.
      const row = new Array<string>(headerLen).fill("");
      row[idCol] = r.testId;
      row[statusCol] = r.status;
      row[dateCol] = r.date;
      if (errorCol >= 0) row[errorCol] = r.error;
      if (durationCol >= 0) row[durationCol] = r.duration;
      if (titleCol >= 0) row[titleCol] = r.title;
      if (seqCol >= 0) row[seqCol] = r.seq;
      appendRows.push(row);
      appended++;
      continue;
    }
    matched++;
    dataUpdates.push({
      range: `${target.sheetTab}!${colLetter(statusCol)}${rowNum}`,
      values: [[r.status]],
    });
    dataUpdates.push({
      range: `${target.sheetTab}!${colLetter(dateCol)}${rowNum}`,
      values: [[r.date]],
    });
    if (errorCol >= 0) {
      dataUpdates.push({
        range: `${target.sheetTab}!${colLetter(errorCol)}${rowNum}`,
        values: [[r.error]],
      });
    }
    if (durationCol >= 0) {
      dataUpdates.push({
        range: `${target.sheetTab}!${colLetter(durationCol)}${rowNum}`,
        values: [[r.duration]],
      });
    }
    if (seqCol >= 0 && r.seq) {
      dataUpdates.push({
        range: `${target.sheetTab}!${colLetter(seqCol)}${rowNum}`,
        values: [[r.seq]],
      });
    }
    // Update Title only when the existing cell is empty — preserves manual edits.
    if (titleCol >= 0 && r.title) {
      const existingTitle = grid[rowNum - 1]?.[titleCol] ?? "";
      if (!existingTitle.trim()) {
        dataUpdates.push({
          range: `${target.sheetTab}!${colLetter(titleCol)}${rowNum}`,
          values: [[r.title]],
        });
      }
    }
  }

  if (dataUpdates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: "RAW", data: dataUpdates },
    });
  }

  if (appendRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${target.sheetTab}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: appendRows },
    });
  }

  console.log(
    `[${target.sheetTab}] updated ${matched} rows` +
      (appended > 0 ? `, appended ${appended} new rows` : ""),
  );
}

function colLetter(zeroIdx: number): string {
  let n = zeroIdx + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function main() {
  const keyPath = process.env.GOOGLE_SHEETS_SA_KEY_PATH;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!keyPath || !spreadsheetId) {
    console.error(
      "Missing GOOGLE_SHEETS_SA_KEY_PATH or GOOGLE_SHEETS_SPREADSHEET_ID. " +
        "See header comment in this file for setup steps.",
    );
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // De-dupe csv files (Login + Delivery Point share one file currently).
  const seenFiles = new Set<string>();
  const allResults = new Map<string, ResultRow[]>();
  for (const t of SYNC_TARGETS) {
    if (!seenFiles.has(t.csvFile)) {
      allResults.set(t.csvFile, loadResults(t.csvFile));
      seenFiles.add(t.csvFile);
    }
  }

  // Helpful debug — list available files
  if (existsSync(RESULTS_DIR)) {
    console.log(`Found result files: ${readdirSync(RESULTS_DIR).join(", ")}`);
  }

  for (const target of SYNC_TARGETS) {
    const rows = allResults.get(target.csvFile) ?? [];
    await syncTab(sheets, spreadsheetId, target, rows);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
