/**
 * Measure what a Playwright spec actually tests.
 *
 * `bun audit:tc-ids` counts TC-IDs, which says how many cases a spec *claims*.
 * That number turned out to be a poor proxy: it includes IDs written in section
 * comments and cases that never run. Measured properly, 36% of this suite was
 * skipped and several specs asserted nothing at all — none of which the ID count
 * showed. This module answers the other question: of the cases declared, how
 * many run, and how many actually assert something?
 *
 * Kept apart from audit-spec-health.ts so the counting stays pure and testable.
 */
import * as ts from "typescript";

/** How a test case is declared. */
export type TestMode = "run" | "skip" | "fixme";

export interface TestCase {
  /** Title as written, e.g. `TC-PR-010001 แสดงรายการ`. */
  title: string;
  mode: TestMode;
  /** `expect(...)` calls written directly in this case's callback. */
  assertions: number;
  /**
   * Calls to an assertion helper, e.g. `pr.expectSavedToast()`.
   *
   * Page objects in this suite carry their own assertions, so a case can check
   * plenty while containing no literal `expect`. Counting only the literal form
   * flagged 302 healthy cases as silent — these are counted separately so the
   * report can tell "asserts through a helper" from "asserts nothing".
   */
  helperAssertions: number;
  /**
   * Assertions that cannot fail, e.g. `expect(true).toBe(true)`.
   *
   * They read as coverage and are worse than no test: a reviewer scanning names
   * sees a case, the runner reports it green, and nothing was checked.
   */
  trivialAssertions: number;
  /**
   * Runtime guards inside the body, e.g. `purchaseTest.skip(row === 0, "no data")`.
   *
   * Playwright's in-body `skip` is a different thing from the declaration-level
   * `test.skip(title, fn)`: the case is declared as running, the reporter shows
   * it, and whether it executes is decided at runtime by a locator count or a
   * seeded row. `304-pr-purchaser-journey.spec.ts` reads as 0% dormant here
   * while four of its cases skip every run, because `itemRow(i)` searches a
   * collapsed row for fields that only exist in the expanded panel. A guard is
   * legitimate; a guard that is always true is a case that never runs and never
   * says so, which is why the count is reported.
   */
  conditionalSkips: number;
}

export interface SpecHealth {
  file: string;
  cases: TestCase[];
  /** `.catch(...)` calls anywhere in the file — a hint that failures are being swallowed. */
  catchCalls: number;
}

/** Counts derived from a spec's cases. */
export interface SpecSummary {
  file: string;
  run: number;
  skipped: number;
  fixme: number;
  /** Running cases that assert nothing — no `expect(...)`, no assertion helper. */
  silent: number;
  /** Running cases that only assert through a page-object helper. */
  helperOnly: number;
  /** Running cases whose only assertions are trivial. */
  trivialOnly: number;
  assertions: number;
  catchCalls: number;
  /** Running cases holding at least one in-body `skip`/`fixme` guard. */
  guarded: number;
  /** Share of declared cases that never execute, 0–100. */
  dormantPct: number;
}

/**
 * Names that declare a test case.
 *
 * Half this suite never calls `test()`: `createAuthTest(email)` returns a
 * fixture-bound test assigned to names like `adminTest` or `purchaseTest`.
 * Anything ending in `test`/`Test` counts, which is how those specs get seen.
 */
function isTestName(name: string): boolean {
  return /(?:^|[a-z])[Tt]est$/.test(name) && name !== "createAuthTest";
}

/** Split a call expression into the declaring name and its mode. */
function readCallee(expr: ts.Expression): { name: string; mode: TestMode } | undefined {
  if (ts.isIdentifier(expr)) {
    return isTestName(expr.text) ? { name: expr.text, mode: "run" } : undefined;
  }
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression)) {
    const prop = expr.name.text;
    if (!isTestName(expr.expression.text)) return undefined;
    if (prop === "skip") return { name: expr.expression.text, mode: "skip" };
    if (prop === "fixme") return { name: expr.expression.text, mode: "fixme" };
  }
  return undefined;
}

function stringArg(node: ts.CallExpression): string | undefined {
  const first = node.arguments[0];
  return first && ts.isStringLiteralLike(first) ? first.text : undefined;
}

/** Count assertions within a node: literal `expect(...)`, helpers, and trivial ones. */
function countAssertions(node: ts.Node): { total: number; trivial: number; helper: number } {
  let total = 0;
  let trivial = 0;
  let helper = 0;
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "expect") {
      total++;
      const arg = n.arguments[0];
      if (
        arg &&
        (arg.kind === ts.SyntaxKind.TrueKeyword ||
          arg.kind === ts.SyntaxKind.FalseKeyword ||
          ts.isNumericLiteral(arg) ||
          ts.isStringLiteralLike(arg))
      ) {
        trivial++;
      }
    } else if (
      ts.isCallExpression(n) &&
      ts.isPropertyAccessExpression(n.expression) &&
      /^expect[A-Z]/.test(n.expression.name.text)
    ) {
      helper++;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return { total, trivial, helper };
}

/**
 * Count in-body `skip`/`fixme` guards: a `<name>test.skip(...)` call nested in
 * the case body rather than declaring it.
 */
function countConditionalSkips(node: ts.Node): number {
  let guards = 0;
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n)) {
      const callee = readCallee(n.expression);
      if (callee && callee.mode !== "run") guards++;
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return guards;
}

/** Parse one spec file. */
export function parseSpecHealth(source: string, file = "spec.ts"): SpecHealth {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const cases: TestCase[] = [];
  let catchCalls = 0;

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "catch"
      ) {
        catchCalls++;
      }
      const callee = readCallee(node.expression);
      const title = callee ? stringArg(node) : undefined;
      if (callee && title) {
        // The case body is the last function argument: test(title, fn) or
        // test(title, { annotation }, fn).
        const body = [...node.arguments]
          .reverse()
          .find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
        const counts = body ? countAssertions(body) : { total: 0, trivial: 0, helper: 0 };
        cases.push({
          title,
          mode: callee.mode,
          assertions: counts.total,
          helperAssertions: counts.helper,
          trivialAssertions: counts.trivial,
          conditionalSkips: body ? countConditionalSkips(body) : 0,
        });
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return { file, cases, catchCalls };
}

/** Reduce a parsed spec to the numbers the report prints. */
export function summarize(health: SpecHealth): SpecSummary {
  const run = health.cases.filter((c) => c.mode === "run");
  const skipped = health.cases.filter((c) => c.mode === "skip").length;
  const fixme = health.cases.filter((c) => c.mode === "fixme").length;
  const declared = health.cases.length;
  return {
    file: health.file,
    run: run.length,
    skipped,
    fixme,
    silent: run.filter((c) => c.assertions === 0 && c.helperAssertions === 0).length,
    helperOnly: run.filter((c) => c.assertions === 0 && c.helperAssertions > 0).length,
    trivialOnly: run.filter((c) => c.assertions > 0 && c.assertions === c.trivialAssertions).length,
    assertions: run.reduce((sum, c) => sum + c.assertions, 0),
    catchCalls: health.catchCalls,
    guarded: run.filter((c) => c.conditionalSkips > 0).length,
    dormantPct: declared ? Math.round(((skipped + fixme) * 100) / declared) : 0,
  };
}
