import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Documents a movement spec created, remembered across separate runs: some flows
 * are split into phases run as different commands (e.g. the SR issue flow's
 * pre/post phases, the period-close phases). Lives under runs/ (gitignored);
 * delete the file to start over.
 */
export interface DocRef {
  id: string;
  no: string;
  status: string;
  [k: string]: unknown;
}

export class DocState {
  readonly file: string;

  constructor(file: string) {
    this.file = resolve(process.cwd(), file);
  }

  private load(): Record<string, DocRef> {
    return existsSync(this.file) ? JSON.parse(readFileSync(this.file, "utf8")) : {};
  }

  get(key: string): DocRef | undefined {
    return this.load()[key];
  }

  /** Like `get`, but a missing entry is a broken precondition — fail with a message that says which phase to run. */
  need(key: string, hint: string): DocRef {
    const doc = this.get(key);
    if (!doc) throw new Error(`state ${this.file}: no "${key}" — ${hint}`);
    return doc;
  }

  put(key: string, doc: DocRef): void {
    mkdirSync(dirname(this.file), { recursive: true });
    const all = this.load();
    all[key] = { ...all[key], ...doc };
    writeFileSync(this.file, JSON.stringify(all, null, 2));
  }
}
