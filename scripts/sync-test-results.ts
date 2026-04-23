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
  preconditions: string;
  steps: string;
  expected: string;
  priority: string;
  testType: string;
  note: string;
}

interface SyncTarget {
  csvFile: string; // file under tests/results/
  sheetTab: string; // exact tab name in the spreadsheet
}

// Add more entries here as new spec sheets/tabs are introduced.
const SYNC_TARGETS: SyncTarget[] = [
  { csvFile: "001-login-results.csv", sheetTab: "Login" },
  { csvFile: "002-adjustment-type-results.csv", sheetTab: "Adjustment Type" },
  { csvFile: "003-business-type-results.csv", sheetTab: "Business Type" },
  { csvFile: "004-credit-note-reason-results.csv", sheetTab: "Credit Note Reason" },
  { csvFile: "005-credit-term-results.csv", sheetTab: "Credit Term" },
  { csvFile: "006-currency-results.csv", sheetTab: "Currency" },
  { csvFile: "007-delivery-point-results.csv", sheetTab: "Delivery Point" },
  { csvFile: "008-department-results.csv", sheetTab: "Department" },
  { csvFile: "009-exchange-rate-results.csv", sheetTab: "Exchange Rate" },
  { csvFile: "010-extra-cost-results.csv", sheetTab: "Extra Cost" },
  { csvFile: "011-location-results.csv", sheetTab: "Location" },
  { csvFile: "012-tax-profile-results.csv", sheetTab: "Tax Profile" },
  { csvFile: "013-unit-results.csv", sheetTab: "Unit" },
  { csvFile: "014-vendor-results.csv", sheetTab: "Vendor" },
];

const RESULTS_DIR = resolve(process.cwd(), "tests/results");

/**
 * Parse a CSV document into rows. Quote-aware across newlines: a quoted cell
 * may contain `\n`, `\r`, `,`, or escaped quotes (`""`) and it will be kept as
 * a single logical cell.
 */
function parseCsv(content: string): Record<string, string>[] {
  const rows = parseCsvRows(content.replace(/^﻿/, "")); // strip BOM if any
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((cells) => {
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

/**
 * Core CSV tokenizer. Returns a 2-D array of cells, one inner array per
 * logical row. Newlines inside quoted cells are preserved verbatim.
 */
function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"' && content[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      cur = "";
      row = [];
    } else if (ch === "\r") {
      // swallow — handled as part of CRLF by the \n branch, or at EOL alone
      if (content[i + 1] === "\n") {
        // no-op; let \n finalize the row
      } else {
        row.push(cur);
        rows.push(row);
        cur = "";
        row = [];
      }
    } else {
      cur += ch;
    }
  }
  // Flush trailing cell/row if the file doesn't end with a newline
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  // Drop any pure-empty trailing rows
  while (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }
  return rows;
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
      // New CSVs use "Run Date"; accept "Test Date" for backward compat.
      date: r["Run Date"] ?? r["Test Date"] ?? "",
      error: r["Error"] ?? "",
      duration: r["Duration (ms)"] ?? "",
      preconditions: r["Preconditions"] ?? "",
      steps: r["Steps"] ?? "",
      expected: r["Expected Result"] ?? "",
      priority: r["Priority"] ?? "",
      testType: r["Test Type"] ?? "",
      note: r["Note"] ?? "",
    }));
}

function filterRowsForTab(_tab: string, rows: ResultRow[]): ResultRow[] {
  // Each spec now writes its own CSV, so no cross-filtering is needed.
  return rows;
}

/** The canonical column order the reporter produces. */
const CANONICAL_HEADER = [
  "Seq",
  "Test ID",
  "Title",
  "Preconditions",
  "Steps",
  "Expected Result",
  "Priority",
  "Test Type",
  "Status",
  "Run Date",
  "Duration (ms)",
  "Error",
  "Note",
];

async function ensureHeaders(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetTab: string,
  currentHeader: string[],
): Promise<string[]> {
  // Append any canonical column that's missing; preserve existing headers.
  const missing = CANONICAL_HEADER.filter((c) => {
    if (c === "Run Date") return currentHeader.indexOf("Run Date") < 0 && currentHeader.indexOf("Test Date") < 0;
    return currentHeader.indexOf(c) < 0;
  });
  if (missing.length === 0) return currentHeader;

  const newHeader = [...currentHeader, ...missing];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetTab}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [newHeader] },
  });
  console.log(`[${sheetTab}] added missing header columns: ${missing.join(", ")}`);
  return newHeader;
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
  //    column index of "Status" and "Run Date".
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
    // Empty tab → bootstrap with canonical header
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${target.sheetTab}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [CANONICAL_HEADER] },
    });
    console.log(`[${target.sheetTab}] tab was empty — wrote header`);
    grid = [CANONICAL_HEADER];
  }

  // Ensure the sheet has every canonical column (append any missing headers).
  const ensuredHeader = await ensureHeaders(sheets, spreadsheetId, target.sheetTab, grid[0]);
  grid[0] = ensuredHeader;
  const header = grid[0];
  const idCol = header.indexOf("Test ID");
  const statusCol = header.indexOf("Status");
  // Accept either "Run Date" (new) or "Test Date" (legacy).
  const dateCol = (() => {
    const i = header.indexOf("Run Date");
    return i >= 0 ? i : header.indexOf("Test Date");
  })();
  const errorCol = header.indexOf("Error");
  const durationCol = header.indexOf("Duration (ms)");
  const seqCol = header.indexOf("Seq");
  // Title may be stored under "Title" or "Description" depending on the sheet
  const titleCol = (() => {
    const i = header.indexOf("Title");
    return i >= 0 ? i : header.indexOf("Description");
  })();
  // Metadata columns populated from Playwright annotations (via the CSV
  // reporter). Policy: write a CSV value into the sheet only when the CSV has
  // a non-empty value AND the sheet cell is currently empty — this way,
  // manual edits in the sheet are preserved, but un-filled sheet cells get
  // backfilled from the next annotated test run.
  const preconditionsCol = header.indexOf("Preconditions");
  const stepsCol = header.indexOf("Steps");
  const expectedCol = header.indexOf("Expected Result");
  const priorityCol = header.indexOf("Priority");
  const testTypeCol = header.indexOf("Test Type");
  const noteCol = header.indexOf("Note");

  // Surface column mismatches so the user sees what's actually present vs
  // what would be written. Silently skipping missing columns was the symptom
  // reported as "result not filling all columns".
  const expectedColumns: Record<string, number> = {
    Seq: seqCol,
    "Test ID": idCol,
    Title: titleCol,
    Preconditions: preconditionsCol,
    Steps: stepsCol,
    "Expected Result": expectedCol,
    Priority: priorityCol,
    "Test Type": testTypeCol,
    Status: statusCol,
    "Run Date / Test Date": dateCol,
    "Duration (ms)": durationCol,
    Error: errorCol,
    Note: noteCol,
  };
  const missing = Object.entries(expectedColumns)
    .filter(([, idx]) => idx < 0)
    .map(([name]) => name);
  if (missing.length > 0) {
    console.warn(
      `[${target.sheetTab}] sheet is missing columns — values will be skipped: ${missing.join(", ")}`,
    );
    console.warn(
      `[${target.sheetTab}] current sheet header: ${header.map((h) => `"${h}"`).join(", ")}`,
    );
  }
  if (idCol < 0 || statusCol < 0 || dateCol < 0) {
    console.warn(
      `[${target.sheetTab}] missing required columns (Test ID/Status/Run Date or Test Date) — skipping`,
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
      if (preconditionsCol >= 0) row[preconditionsCol] = r.preconditions;
      if (stepsCol >= 0) row[stepsCol] = r.steps;
      if (expectedCol >= 0) row[expectedCol] = r.expected;
      if (priorityCol >= 0) row[priorityCol] = r.priority;
      if (testTypeCol >= 0) row[testTypeCol] = r.testType;
      if (noteCol >= 0) row[noteCol] = r.note;
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

    // Code-authored columns (from Playwright annotations): always overwrite.
    // These come from the test source; the sheet should reflect whatever is
    // in the code. Note is treated separately as a human-authored free-form
    // column (write-once: only if the sheet cell is empty).
    const codeAuthored: Array<[number, string]> = [
      [preconditionsCol, r.preconditions],
      [stepsCol, r.steps],
      [expectedCol, r.expected],
      [priorityCol, r.priority],
      [testTypeCol, r.testType],
    ];
    for (const [col, value] of codeAuthored) {
      if (col < 0) continue;
      // Push even empty strings, so cleared annotations clear the cell.
      dataUpdates.push({
        range: `${target.sheetTab}!${colLetter(col)}${rowNum}`,
        values: [[value]],
      });
    }
    // Note: free-form; preserve any manual edit.
    if (noteCol >= 0 && r.note) {
      const existingNote = grid[rowNum - 1]?.[noteCol] ?? "";
      if (!existingNote.trim()) {
        dataUpdates.push({
          range: `${target.sheetTab}!${colLetter(noteCol)}${rowNum}`,
          values: [[r.note]],
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
