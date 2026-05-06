import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";
import type { MigrationMap } from "./propose";

// Add module mappings as Phase 3 migrations land
const TAB_FOR_PREFIX: Record<string, string> = {
  // Mirror SYNC_TARGETS in scripts/sync-test-results.ts
  LOGIN: "Login",
  DEP: "Department",
  UN: "Unit",
};

async function backupTab(
  sheets: any,
  spreadsheetId: string,
  tabName: string,
): Promise<string> {
  const stamp = new Date().toISOString().slice(0, 10);
  const newTabName = `${tabName}_pre_migration_${stamp}`;
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(
    (s: any) => s.properties.title === tabName,
  );
  if (!sheet) throw new Error(`Tab "${tabName}" not found`);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          duplicateSheet: {
            sourceSheetId: sheet.properties.sheetId,
            newSheetName: newTabName,
          },
        },
      ],
    },
  });
  return newTabName;
}

export async function syncModule(
  modulePrefix: string,
  opts: { dryRun?: boolean } = {},
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID not set");

  const map: MigrationMap = JSON.parse(
    readFileSync(
      resolve(process.cwd(), "docs/migration/test-id-migration-map.json"),
      "utf8",
    ),
  );
  const mod = map.modules[modulePrefix];
  if (!mod) throw new Error(`Module ${modulePrefix} not in migration map`);

  const tabName = TAB_FOR_PREFIX[modulePrefix];
  if (!tabName) throw new Error(`No sheet tab mapped for prefix ${modulePrefix}`);

  const keyPath = process.env.GOOGLE_SHEETS_SA_KEY_PATH;
  if (!keyPath) throw new Error("GOOGLE_SHEETS_SA_KEY_PATH not set");

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  if (opts.dryRun) {
    console.log(
      `[dry-run] Would back up tab "${tabName}" and update ${mod.entries.length} IDs`,
    );
    for (const e of mod.entries) console.log(`  ${e.old}  →  ${e.new}`);
    return;
  }

  const backup = await backupTab(sheets, spreadsheetId, tabName);
  console.log(`[backup] ${tabName} → ${backup}`);

  // Read header + Test ID column
  const range = `${tabName}!A1:Z`;
  const data = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = data.data.values ?? [];
  const header = rows[0] ?? [];
  const idCol = header.indexOf("Test ID");
  if (idCol === -1) throw new Error(`No Test ID column in tab ${tabName}`);

  const updates: { range: string; values: string[][] }[] = [];
  const oldToNew = new Map(mod.entries.map((e) => [e.old, e.new]));

  for (let i = 1; i < rows.length; i++) {
    const oldId = rows[i][idCol];
    const newId = oldToNew.get(oldId);
    if (newId) {
      const a1 = colToA1(idCol);
      updates.push({ range: `${tabName}!${a1}${i + 1}`, values: [[newId]] });
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
    console.log(`[sync] Updated ${updates.length} rows in tab "${tabName}"`);
  }
}

function colToA1(col: number): string {
  let s = "";
  let n = col;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

if (import.meta.main) {
  const dryRun = process.argv.includes("--dry-run");
  const moduleFlag = process.argv.indexOf("--module");
  if (moduleFlag === -1 || !process.argv[moduleFlag + 1]) {
    console.error(
      "Usage: bun migrate:tc-sheet --module <PREFIX> [--dry-run]",
    );
    process.exit(2);
  }
  syncModule(process.argv[moduleFlag + 1], { dryRun }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
