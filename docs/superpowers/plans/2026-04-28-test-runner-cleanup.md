# Test Runner Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete 14 per-module wrapper scripts in `tests/scripts/` and rewrite `run-module.sh` + `run-all.sh` to auto-discover modules from `tests/[0-9]*-*.spec.ts`, fix the 4-digit prefix glob bug, and add an interactive `select`-menu fallback to `run-module.sh`.

**Architecture:** Pure shell-script change. Two scripts (`run-module.sh`, `run-all.sh`) each gain the same auto-discovery snippet that produces a sorted `MODULES` array from the spec directory. `run-module.sh` adds a menu mode triggered when the first argument is missing or starts with `-`. The 14 wrapper scripts (`run-<module>.sh`) become redundant and are deleted in the final task.

**Tech Stack:** Bash 4+ (uses `select` builtin, `shopt -s nullglob`, parameter expansion `${var#*-}`), `bunx playwright` (existing).

**Reference docs:**
- Spec: `docs/superpowers/specs/2026-04-28-test-runner-cleanup-design.md`
- Project conventions: `CLAUDE.md`

**Working tree:** Branch `chore-test-runner-cleanup` (already created from `main`). Each task ends with one commit.

---

## Pre-flight — capture baseline

Confirm the broken case the spec calls out actually fails on `main`, and that the wrappers behave as documented. The baseline gives us a concrete before/after for each task.

- [ ] **Step 0.1: Confirm the campaign-glob bug exists**

```bash
bash tests/scripts/run-module.sh campaign -- --list-files 2>&1 | head -3
```

Expected output (the bug):
```
error: spec file not found for module 'campaign'
```

This is the symptom of the 3-digit-only glob `tests/[0-9][0-9][0-9]-`. Record the output.

- [ ] **Step 0.2: Confirm `run-vendor.sh` works (will break after Task 3)**

```bash
bash tests/scripts/run-vendor.sh -- --list-files 2>&1 | tail -5
```

Expected: Playwright lists `tests/150-vendor.spec.ts`. Record the output.

- [ ] **Step 0.3: Confirm `run-all.sh` skips newer modules**

```bash
grep -E "^  [a-z-]+$" tests/scripts/run-all.sh | wc -l
ls tests/[0-9]*-*.spec.ts | wc -l
```

Expected: the first count is 13 (hard-coded `MODULES`), the second is ≥27 (actual specs). The gap is what auto-discovery closes.

---

## Task 1: Rewrite `run-module.sh`

**Files:**
- Modify (full rewrite): `tests/scripts/run-module.sh`

This task introduces auto-discovery, the alphabetical sort, the menu mode, and the 1+-digit glob fix in one focused commit. The 14 wrapper scripts continue to function unchanged because they only call `run-module.sh <name>` — the new `run-module.sh` still accepts a module name as `$1`.

- [ ] **Step 1.1: Replace `tests/scripts/run-module.sh` with the rewritten content**

Overwrite the file with exactly:

```bash
#!/usr/bin/env bash
# Run a single e2e module spec, optionally choosing it from an interactive menu.
#
# Usage:
#   ./run-module.sh                             # menu mode
#   ./run-module.sh <module>                    # direct
#   ./run-module.sh <module> [playwright-flags] # direct with flags
#   ./run-module.sh [playwright-flags]          # menu mode, flags pass through
#
# Examples:
#   ./run-module.sh
#   ./run-module.sh vendor
#   ./run-module.sh vendor --headed
#   ./run-module.sh --debug
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Discover available module names from the spec filenames.
shopt -s nullglob
RAW=()
for spec in "${REPO_ROOT}"/tests/[0-9]*-*.spec.ts; do
  base=$(basename "$spec" .spec.ts)
  RAW+=("${base#*-}")            # strip leading digits + first dash
done
shopt -u nullglob

if [ ${#RAW[@]} -gt 0 ]; then
  IFS=$'\n' read -r -d '' -a MODULES < <(printf '%s\n' "${RAW[@]}" | sort && printf '\0')
else
  MODULES=()
fi

if [ ${#MODULES[@]} -eq 0 ]; then
  echo "error: no spec files found under ${REPO_ROOT}/tests/" >&2
  exit 1
fi

# Choose a module: first arg if it looks like a name, otherwise menu.
MODULE=""
if [ -n "${1:-}" ] && [[ "${1}" != -* ]]; then
  MODULE="$1"
  shift
else
  PS3='Pick module: '
  select MODULE in "${MODULES[@]}"; do
    [ -n "${MODULE:-}" ] && break
  done
  if [ -z "${MODULE:-}" ]; then
    # Selection cancelled (Ctrl-D / EOF)
    exit 130
  fi
fi

# Resolve the chosen module to its spec file.
SPEC=$(cd "$REPO_ROOT" && ls tests/[0-9]*-"${MODULE}".spec.ts 2>/dev/null | head -1)

if [ -z "$SPEC" ] || [ ! -f "${REPO_ROOT}/${SPEC}" ]; then
  echo "error: spec file not found for module '${MODULE}'" >&2
  exit 1
fi

cd "$REPO_ROOT"
set +e
bunx playwright test "$SPEC" "$@"
STATUS=$?
set -e
bun e2e:sync || true
exit $STATUS
```

Key changes vs. previous file:
1. Added `shopt -s nullglob` block that builds `RAW` then `MODULES` (sorted alphabetically).
2. Added empty-spec-dir guard.
3. Added arg-or-menu branch using `[[ "${1}" != -* ]]` to decide.
4. Resolution glob `tests/[0-9]*-"${MODULE}".spec.ts` (was `[0-9][0-9][0-9]-` — only 3 digits).

- [ ] **Step 1.2: Verify the file is executable**

```bash
ls -l tests/scripts/run-module.sh
```

Expected: `-rwxr-xr-x` (or at least the user `x` bit). If the rewrite removed the bit:

```bash
chmod +x tests/scripts/run-module.sh
```

- [ ] **Step 1.3: Verify direct mode still works for an existing module**

```bash
bash tests/scripts/run-module.sh vendor -- --list-files 2>&1 | tail -10
```

Expected: Playwright lists `tests/150-vendor.spec.ts` (and prints the test titles). The exit code from `$?` is `0`.

- [ ] **Step 1.4: Verify the campaign-glob bug is fixed**

```bash
bash tests/scripts/run-module.sh campaign -- --list-files 2>&1 | tail -10
```

Expected: Playwright now lists `tests/1001-campaign.spec.ts`. Pre-Task-1 this returned `error: spec file not found`.

- [ ] **Step 1.5: Verify multi-dash module name resolves**

```bash
bash tests/scripts/run-module.sh purchase-request-template -- --list-files 2>&1 | tail -10
```

Expected: Playwright lists `tests/310-purchase-request-template.spec.ts`. The `${base#*-}` parameter expansion only strips the *first* dash, so multi-dash names survive.

- [ ] **Step 1.6: Verify wrappers still work via this script**

```bash
bash tests/scripts/run-vendor.sh -- --list-files 2>&1 | tail -10
```

Expected: Same output as Step 1.3 (the wrapper just `exec`s `run-module.sh vendor`). This proves Task 3's deletion is safe to do later — the wrappers don't add behaviour, they only forward.

- [ ] **Step 1.7: Verify menu mode opens when no module name is given**

The menu reads from stdin. To smoke-test it without an interactive terminal, send a numeric selection on stdin:

```bash
# Pipe '1' (the first menu entry) followed by a newline, then EOF
printf '1\n' | bash tests/scripts/run-module.sh -- --list-files 2>&1 | tail -20
```

Expected: The menu prints `1) adjustment-type 2) business-type …`, then `Pick module: 1`, then the script resolves `adjustment-type` and Playwright lists `tests/031-adjustment-type.spec.ts`.

If the menu doesn't appear (e.g., the script silently picks something), recheck the `[[ "${1}" != -* ]]` guard.

- [ ] **Step 1.8: Verify menu mode also opens when only flags are passed**

```bash
printf '1\n' | bash tests/scripts/run-module.sh --headed 2>&1 | head -5
```

Expected: The menu opens (because `--headed` starts with `-`, not a module name) and after selection the `--headed` flag passes through to Playwright.

If you can't easily verify `--headed` is in effect from a CLI smoke test, the simpler check is that the menu prompt appears at all and the script proceeds rather than failing with "spec not found for module '--headed'".

- [ ] **Step 1.9: Commit**

```bash
git add tests/scripts/run-module.sh
git commit -m "$(cat <<'EOF'
refactor(scripts): rewrite run-module.sh with auto-discovery and menu

- Auto-discover MODULES from tests/[0-9]*-*.spec.ts (sorted)
- Open interactive `select` menu when no module name is supplied or
  the first arg starts with `-` (flags-only invocation)
- Fix spec-file glob from 3-digit-only `[0-9][0-9][0-9]-` to `[0-9]*-`
  so 4-digit prefixes (e.g. 1001-campaign) resolve correctly
- Per-module wrapper scripts continue to work unchanged because they
  forward `$@` to this script

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Rewrite `run-all.sh`

**Files:**
- Modify (full rewrite): `tests/scripts/run-all.sh`

Replace the hard-coded 13-module `MODULES=(...)` list with the same auto-discovery snippet from Task 1. Preserve the existing sequential and `--workers=100%` batch branches verbatim.

- [ ] **Step 2.1: Replace `tests/scripts/run-all.sh` with the rewritten content**

Overwrite the file with exactly:

```bash
#!/usr/bin/env bash
# Run every e2e module spec sequentially and print a pass/fail summary.
#
# Usage:
#   ./run-all.sh                  # sequential, one playwright invocation per module
#   ./run-all.sh --workers=100%   # single playwright batch with all workers
#   ./run-all.sh --headed         # any flag is passed through
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Discover modules from spec filenames (replaces the previous hard-coded list).
shopt -s nullglob
RAW=()
for spec in "${REPO_ROOT}"/tests/[0-9]*-*.spec.ts; do
  base=$(basename "$spec" .spec.ts)
  RAW+=("${base#*-}")
done
shopt -u nullglob

if [ ${#RAW[@]} -gt 0 ]; then
  IFS=$'\n' read -r -d '' -a MODULES < <(printf '%s\n' "${RAW[@]}" | sort && printf '\0')
else
  MODULES=()
fi

if [ ${#MODULES[@]} -eq 0 ]; then
  echo "error: no spec files found under ${REPO_ROOT}/tests/" >&2
  exit 1
fi

# Detect --workers=100% to switch to single-batch parallel mode
BATCH_MODE=0
for arg in "$@"; do
  if [ "$arg" = "--workers=100%" ]; then
    BATCH_MODE=1
    break
  fi
done

PASSED=()
FAILED=()

if [ "$BATCH_MODE" -eq 1 ]; then
  echo "================================================================"
  echo " Running ALL modules in a single batch (--workers=100%)"
  echo "================================================================"
  SPECS=()
  for m in "${MODULES[@]}"; do
    SPEC=$(cd "$REPO_ROOT" && ls tests/[0-9]*-"${m}".spec.ts 2>/dev/null | head -1)
    [ -z "$SPEC" ] && { echo "error: spec not found for '$m'" >&2; continue; }
    SPECS+=("$SPEC")
  done
  cd "$REPO_ROOT"
  set +e
  bunx playwright test "${SPECS[@]}" "$@"
  STATUS=$?
  set -e
  bun e2e:sync || true
  if [ "$STATUS" -eq 0 ]; then
    PASSED=("${MODULES[@]}")
  else
    FAILED=("${MODULES[@]}")
  fi
else
  for m in "${MODULES[@]}"; do
    echo ""
    echo "================================================================"
    echo " Running: $m"
    echo "================================================================"
    if "$SCRIPT_DIR/run-module.sh" "$m" "$@"; then
      PASSED+=("$m")
    else
      FAILED+=("$m")
    fi
  done
fi

echo ""
echo "================================================================"
echo " Summary"
echo "================================================================"
echo "Passed (${#PASSED[@]}):"
for m in "${PASSED[@]}"; do echo "  ✓ $m"; done
echo "Failed (${#FAILED[@]}):"
for m in "${FAILED[@]}"; do echo "  ✗ $m"; done

[ ${#FAILED[@]} -eq 0 ]
```

Key changes vs. previous file:
1. Replaced `MODULES=( … 13 names … )` with the auto-discovery snippet.
2. Resolution glob in batch branch updated `[0-9][0-9][0-9]-` → `[0-9]*-`.

- [ ] **Step 2.2: Verify executable bit**

```bash
ls -l tests/scripts/run-all.sh
```

Expected: user `x` bit set. If not:

```bash
chmod +x tests/scripts/run-all.sh
```

- [ ] **Step 2.3: Verify auto-discovery picks up every spec**

The script can be smoke-tested by passing `--list-files` so Playwright enumerates rather than runs. The output should mention every numeric-prefixed spec file.

```bash
bash tests/scripts/run-all.sh --workers=100% -- --list-files 2>&1 | grep -cE 'tests/[0-9].*\.spec\.ts:'
```

Expected: a count `>= 27` (matching `ls tests/[0-9]*-*.spec.ts | wc -l`). Pre-Task-2 the same command would have used the 13 hard-coded modules and missed the rest.

(The command structure: `--workers=100%` triggers the batch mode, then `--` ends our script's options, then `--list-files` is forwarded to Playwright.)

If the count is less than the spec-file count, run:

```bash
diff \
  <(ls tests/[0-9]*-*.spec.ts | sed 's|tests/||;s|\.spec\.ts$||;s/^[0-9]*-//' | sort) \
  <(printf '%s\n' "${MODULES[@]}" | sort)
```

(You'll need to extract `MODULES` by sourcing — easier: re-read the script and confirm the snippet matches Task 1's.)

- [ ] **Step 2.4: Verify summary header still prints**

```bash
bash tests/scripts/run-all.sh -- --list-files 2>&1 | grep -E '^=+$' | head -3
```

Expected: at least one banner line of `=` characters (the per-module header `Running: <m>`). Confirms the sequential branch is intact.

- [ ] **Step 2.5: Commit**

```bash
git add tests/scripts/run-all.sh
git commit -m "$(cat <<'EOF'
refactor(scripts): auto-discover MODULES in run-all.sh

Replace the 13-entry hard-coded MODULES array with the same
auto-discovery snippet introduced for run-module.sh in the previous
commit. After this change, run-all.sh runs every spec under
tests/[0-9]*-*.spec.ts (currently 27, was 13). Spec-file resolution
glob also widened from 3-digit-only `[0-9][0-9][0-9]-` to `[0-9]*-`
to match 4-digit prefixes like 1001-campaign.

Sequential and --workers=100% batch branches unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Delete the 14 wrapper scripts and update README

**Files:**
- Delete: 14 scripts named `tests/scripts/run-<module>.sh`
- Modify: `tests/scripts/README.md`

The wrappers' only behaviour is `exec run-module.sh <name> "$@"`. Now that `run-module.sh <name>` is the documented form (and the menu mode replaces "I just want to pick one"), the wrappers add nothing.

- [ ] **Step 3.1: Confirm the wrappers are pure forwards (sanity audit before deletion)**

```bash
for f in tests/scripts/run-{adjustment-type,business-type,credit-note-reason,credit-term,currency,delivery-point,department,exchange-rate,extra-cost,location,login,tax-profile,unit,vendor}.sh; do
  echo "=== $f ==="
  cat "$f"
done
```

Expected: each file is exactly two lines:

```
#!/usr/bin/env bash
exec "$(dirname "$0")/run-module.sh" <module> "$@"
```

If any file has additional logic, STOP and report — the deletion would lose behaviour. (The audit done during brainstorming confirmed all 14 are pure forwards, so this should pass.)

- [ ] **Step 3.2: Confirm no other file references the wrappers**

```bash
grep -rE 'tests/scripts/run-(adjustment-type|business-type|credit-note-reason|credit-term|currency|delivery-point|department|exchange-rate|extra-cost|location|login|tax-profile|unit|vendor)\.sh' . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=playwright-report --exclude-dir=test-results
```

Expected: matches only inside `tests/scripts/README.md` (the doc to be updated in Step 3.4) and possibly `CLAUDE.md`. Any match in `package.json`, CI config, or another script is a blocker — fix that first by switching the caller to `run-module.sh <name>`.

- [ ] **Step 3.3: Delete all 14 wrapper scripts**

```bash
git rm \
  tests/scripts/run-adjustment-type.sh \
  tests/scripts/run-business-type.sh \
  tests/scripts/run-credit-note-reason.sh \
  tests/scripts/run-credit-term.sh \
  tests/scripts/run-currency.sh \
  tests/scripts/run-delivery-point.sh \
  tests/scripts/run-department.sh \
  tests/scripts/run-exchange-rate.sh \
  tests/scripts/run-extra-cost.sh \
  tests/scripts/run-location.sh \
  tests/scripts/run-login.sh \
  tests/scripts/run-tax-profile.sh \
  tests/scripts/run-unit.sh \
  tests/scripts/run-vendor.sh
```

Expected: 14 lines of `rm 'tests/scripts/run-XXX.sh'` output.

- [ ] **Step 3.4: Rewrite `tests/scripts/README.md`**

Overwrite the file with exactly:

```markdown
# tests/scripts

Batch scripts สำหรับรัน Playwright e2e ทีละ module

## Usage

```bash
# Generic dispatcher — รับชื่อ module เป็น arg แรก
./tests/scripts/run-module.sh currency
./tests/scripts/run-module.sh department --headed
./tests/scripts/run-module.sh business-type --debug

# ไม่ระบุชื่อ module → เปิด select menu ให้เลือก
./tests/scripts/run-module.sh
./tests/scripts/run-module.sh --headed   # flag เดี่ยวก็เปิด menu

# รันทุก module เรียงลำดับ + summary
./tests/scripts/run-all.sh
./tests/scripts/run-all.sh --workers=100%   # single playwright batch
```

Flags ทุกตัวของ `playwright test` (`--headed`, `--ui`, `--debug`, `-g <pattern>`, `--list-files`, ฯลฯ) ส่งต่อท้ายได้

## Modules

`run-module.sh` และ `run-all.sh` ค้นหา spec อัตโนมัติจาก `tests/[0-9]*-*.spec.ts` — ไม่มี list ที่ต้อง maintain ภายในไฟล์ script เพิ่ม spec ใหม่แล้ว menu/`run-all` จะเห็นทันที
```

(The triple backticks above are part of the file content, not Markdown formatting.)

- [ ] **Step 3.5: Verify README.md no longer references deleted wrappers**

```bash
grep -E 'run-(adjustment-type|business-type|credit-note-reason|credit-term|currency|delivery-point|department|exchange-rate|extra-cost|location|login|tax-profile|unit|vendor)\.sh' tests/scripts/README.md
```

Expected: empty output.

- [ ] **Step 3.6: Verify smoke tests still pass after deletion**

```bash
# Direct mode (no longer goes through a wrapper)
bash tests/scripts/run-module.sh vendor -- --list-files 2>&1 | tail -3

# Menu mode
printf '1\n' | bash tests/scripts/run-module.sh -- --list-files 2>&1 | tail -3
```

Expected: vendor's spec lists in the first call; the menu opens and resolves the first module in the second.

- [ ] **Step 3.7: Final type check (sanity — no .ts changed but verify no incidental break)**

```bash
bun run tsc --noEmit
```

Expected: exit `0`.

- [ ] **Step 3.8: Commit**

```bash
git add tests/scripts/README.md
git commit -m "$(cat <<'EOF'
refactor(scripts): delete 14 per-module wrapper scripts

After run-module.sh gained auto-discovery and a select-menu fallback,
the per-module wrappers (run-vendor.sh, run-login.sh, …) added no
behaviour — each was a single `exec run-module.sh <name> "$@"`.
Removes them and updates tests/scripts/README.md to point at the
unified entry points.

Existing callers should switch:
  tests/scripts/run-vendor.sh --headed
→ tests/scripts/run-module.sh vendor --headed

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update `CLAUDE.md` reference

**Files:**
- Modify: `CLAUDE.md` (the "Batch scripts" section)

`CLAUDE.md` documents the batch scripts. The current line still implies per-module wrappers exist. Update it to match the new reality.

- [ ] **Step 4.1: Locate the line to change**

```bash
grep -n "tests/scripts" CLAUDE.md
```

Expected: at least one match. Capture the line number(s).

- [ ] **Step 4.2: Replace the "Batch scripts" section**

The pre-existing text (around line 65 on `main`) reads:

```
`tests/scripts/` has per-module runners plus `run-module.sh <module>` and `run-all.sh`. Any `playwright test` flag can be appended (`--headed`, `--ui`, `-g <pattern>`, `--workers=100%` for parallel batch mode). Spec paths inside the scripts are `tests/<module>.spec.ts`.
```

Replace with:

```
`tests/scripts/` ships two scripts: `run-module.sh` (takes a module name, or opens an interactive `select` menu when none is given) and `run-all.sh` (runs every numeric-prefixed spec). Both auto-discover modules from `tests/[0-9]*-*.spec.ts` — no list to maintain. Any `playwright test` flag can be appended (`--headed`, `--ui`, `-g <pattern>`, `--workers=100%` for the parallel batch mode in `run-all.sh`).
```

- [ ] **Step 4.3: Verify the rewrite landed**

```bash
grep -A1 "Batch scripts" CLAUDE.md | head -5
```

Expected: the new wording mentions "auto-discover" and the `select` menu.

- [ ] **Step 4.4: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(claude.md): update Batch scripts section after runner cleanup

The wrappers and the hard-coded MODULES list are gone — CLAUDE.md
now describes the surviving two scripts (`run-module.sh` with menu
mode, `run-all.sh` with auto-discovery).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Final verification

- [ ] **Step 5.1: Branch summary**

```bash
git log --oneline main..HEAD
```

Expected: four commits — Task 1 (run-module.sh), Task 2 (run-all.sh), Task 3 (delete + README), Task 4 (CLAUDE.md). Plus the spec-doc commit `a70098a` if it's already on the branch.

- [ ] **Step 5.2: Confirm wrappers are gone**

```bash
ls tests/scripts/
```

Expected: only `README.md`, `run-all.sh`, `run-module.sh`. No `run-<module>.sh` files left.

- [ ] **Step 5.3: Confirm auto-discovery works end-to-end**

```bash
bash tests/scripts/run-module.sh campaign -- --list-files 2>&1 | tail -5
```

Expected: Playwright lists `tests/1001-campaign.spec.ts` (the bug case from pre-flight Step 0.1, now fixed).

```bash
bash tests/scripts/run-all.sh --workers=100% -- --list-files 2>&1 | grep -cE 'tests/[0-9].*\.spec\.ts:'
```

Expected: count `>= 27` (was 13 before).

- [ ] **Step 5.4: No remaining references to the deleted wrappers anywhere**

```bash
grep -rE 'tests/scripts/run-(adjustment-type|business-type|credit-note-reason|credit-term|currency|delivery-point|department|exchange-rate|extra-cost|location|login|tax-profile|unit|vendor)\.sh' . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=playwright-report --exclude-dir=test-results
```

Expected: empty output.

- [ ] **Step 5.5: tsc clean (sanity)**

```bash
bun run tsc --noEmit
```

Expected: exit `0`.
