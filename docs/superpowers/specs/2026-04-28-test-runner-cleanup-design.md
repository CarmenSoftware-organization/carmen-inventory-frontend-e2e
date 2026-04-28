# Test Runner Cleanup — Auto-Discovery + Interactive Menu

**Date:** 2026-04-28
**Status:** Approved (ready for plan)
**Scope:** Single-PR cleanup of `tests/scripts/`. No production code or test files are touched.

## Problem

Three coupled defects in `tests/scripts/`:

1. **14 redundant wrapper scripts.** Files like `run-vendor.sh`, `run-login.sh`, `run-currency.sh` are each a single line:

   ```bash
   exec "$(dirname "$0")/run-module.sh" vendor "$@"
   ```

   Every new module requires creating another such file; every behaviour change to module runs requires editing 14 of them.

2. **`MODULES` array in `run-all.sh` is stale.** It hard-codes 13 modules (`adjustment-type` through `vendor`). The repo currently has at least 27 spec files — including `campaign`, `credit-note`, `grn`, `purchase-request`, `purchase-order`, etc. — so `bash tests/scripts/run-all.sh` silently skips every newer module.

3. **The spec-file glob assumes a 3-digit prefix.** Both `run-module.sh` and `run-all.sh` resolve specs with:

   ```bash
   tests/[0-9][0-9][0-9]-"${MODULE}".spec.ts
   ```

   But `tests/1001-campaign.spec.ts` has a 4-digit prefix, so `bash tests/scripts/run-module.sh campaign` already returns "spec file not found" today. Future 2-digit prefixes would also fail.

The three defects share one root cause: the script set was built around a manually-curated module list. Auto-discovery from the spec directory eliminates all three.

## Goal

After this change:

- `tests/scripts/run-module.sh` is the only entry point. It accepts a module name as the first argument, OR opens an interactive `select` menu listing every spec when no name is given.
- `tests/scripts/run-all.sh` runs every spec file under `tests/[0-9]*-*.spec.ts` — no manual list to maintain.
- The 14 per-module wrapper scripts are deleted.
- The spec-file glob accepts any number of leading digits.

## Non-goals

- Migrating shell scripts to TypeScript / Bun.
- Changing `tc-json-reporter.ts` or `sync-test-results.ts`.
- Adding new flags (e.g., `--dry-run`, `--filter`). Existing flag pass-through behaviour is preserved.
- Re-ordering module execution. The discovered list is sorted alphabetically by module name (matching the previous hand-curated `MODULES` order), which is functionally equivalent for Playwright since it does not enforce inter-spec ordering by default.

## Architecture

```
tests/scripts/
├── run-module.sh    ← rewritten: auto-discover MODULES + select-menu fallback + glob fix
├── run-all.sh       ← rewritten: auto-discover MODULES + glob fix
└── README.md        ← updated docs

tests/scripts/run-{adjustment-type,business-type,credit-note-reason,credit-term,
                   currency,delivery-point,department,exchange-rate,extra-cost,
                   location,login,tax-profile,unit,vendor}.sh   ← deleted (14 files)
```

The same auto-discovery snippet appears in both `run-module.sh` and `run-all.sh`. The duplication is small (≈8 lines) and inlining is simpler than introducing a third sourced file.

## `run-module.sh` behaviour

Three call shapes are supported. All preserve flag pass-through to `playwright test`.

```bash
# 1. Module name supplied — runs that module directly.
tests/scripts/run-module.sh vendor --headed

# 2. No arguments — opens interactive menu; user picks; module runs.
tests/scripts/run-module.sh

# 3. Flags only (no module name) — opens menu; flags pass through after selection.
tests/scripts/run-module.sh --headed
```

The arg-vs-flag distinction is made by checking whether `$1` starts with `-`. If `$1` is empty or starts with `-`, the menu opens; the entire `$@` is preserved as flags.

### Menu (`select`) shape

Bash's built-in `select` produces a numbered list reading from stdin. The prompt and chosen item:

```text
1) adjustment-type        7) credit-term       13) good-received-note
2) business-type          8) credit-note       14) location
3) campaign               9) credit-note-reason 15) login
…
Pick module: 3
```

Out-of-range input or empty input continues the loop. Ctrl-D / Ctrl-C exits the script.

### Auto-discovery snippet

```bash
shopt -s nullglob
RAW=()
for spec in "${REPO_ROOT}"/tests/[0-9]*-*.spec.ts; do
  base=$(basename "$spec" .spec.ts)
  RAW+=("${base#*-}")            # strip leading digits + first dash
done
shopt -u nullglob

# Sort alphabetically (matches the previous hand-curated list shape and
# gives the interactive menu a predictable order). Bash glob defaults to
# lexicographic order on the *full* filename, so without this step the
# menu would interleave 100x/101 with 1001.
if [ ${#RAW[@]} -gt 0 ]; then
  IFS=$'\n' read -r -d '' -a MODULES < <(printf '%s\n' "${RAW[@]}" | sort && printf '\0')
else
  MODULES=()
fi

if [ ${#MODULES[@]} -eq 0 ]; then
  echo "error: no spec files found under ${REPO_ROOT}/tests/" >&2
  exit 1
fi
```

`${base#*-}` strips everything up to and including the first `-`. This correctly handles:

- `001-login` → `login`
- `1001-campaign` → `campaign`
- `601-credit-note` → `credit-note` (only the first `-` is stripped)
- `310-purchase-request-template` → `purchase-request-template`

`shopt -s nullglob` ensures the loop body does not run with the literal pattern when there are no matches.

## `run-all.sh` behaviour

Identical to today, except the hard-coded `MODULES=(...)` block is replaced by the auto-discovery snippet shown above. The two execution branches (sequential and `--workers=100%` batch) are unchanged. No menu — `run-all.sh` always runs every module.

## File-by-file plan

### Deletes (14 files)

```
tests/scripts/run-adjustment-type.sh
tests/scripts/run-business-type.sh
tests/scripts/run-credit-note-reason.sh
tests/scripts/run-credit-term.sh
tests/scripts/run-currency.sh
tests/scripts/run-delivery-point.sh
tests/scripts/run-department.sh
tests/scripts/run-exchange-rate.sh
tests/scripts/run-extra-cost.sh
tests/scripts/run-location.sh
tests/scripts/run-login.sh
tests/scripts/run-tax-profile.sh
tests/scripts/run-unit.sh
tests/scripts/run-vendor.sh
```

### `run-module.sh` rewrite (full content)

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

### `run-all.sh` rewrite (full content)

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

### `tests/scripts/README.md` updates

Replace the sections that reference the per-module wrapper scripts and describe the new menu mode. The diff is documentation-only and does not change any tooling behaviour beyond what is already in the spec.

## Verification

After the change, every command below must succeed:

1. `bash tests/scripts/run-module.sh login -- --list-files` lists `tests/001-login.spec.ts`.
2. `bash tests/scripts/run-module.sh campaign -- --list-files` lists `tests/1001-campaign.spec.ts`. (This is the case that fails on `main` today.)
3. `bash tests/scripts/run-module.sh vendor -- --list-files` lists `tests/150-vendor.spec.ts`.
4. `bash tests/scripts/run-module.sh purchase-request-template -- --list-files` lists `tests/310-purchase-request-template.spec.ts`. (Multi-dash module name.)
5. `bash tests/scripts/run-all.sh --list-files` enumerates `>= N` specs, where `N` equals `ls tests/[0-9]*-*.spec.ts | wc -l`. Today that is 27.
6. `printf '\n' | bash tests/scripts/run-module.sh --debug` opens the menu, the empty input keeps the loop alive (default `select` behaviour), and Ctrl-D exits with non-zero. (Manual smoke check; not run in CI.)
7. `grep -rE 'tests/scripts/run-(adjustment-type|business-type|credit-note-reason|credit-term|currency|delivery-point|department|exchange-rate|extra-cost|location|login|tax-profile|unit|vendor)\.sh' . --exclude-dir=node_modules --exclude-dir=.git` returns nothing — no remaining references to the deleted wrappers.

## Risks

| Risk | Mitigation |
|---|---|
| External script or CI invokes `tests/scripts/run-vendor.sh` directly. | The repo currently has no such reference (verified with the grep in step 7). README and CLAUDE.md are updated to point users to `run-module.sh`. If a CI on the user's side breaks, the fix is a one-line replacement in their pipeline file. |
| `bash`'s `select` builtin is not available in `dash`/`sh`. | The shebang is already `#!/usr/bin/env bash`; existing `MODULES=(...)` array syntax requires bash anyway, so this introduces no new constraint. |
| A future spec file uses a non-numeric prefix (e.g., `helpers.spec.ts`). | The glob `[0-9]*-*` skips such files silently — same as today. If we ever want to include them, the glob can be widened. |
| Auto-discovered list ordering differs from the prior hand-curated `MODULES`. | The snippet sorts the discovered names alphabetically before assigning to `MODULES`, matching the prior order exactly for the existing 13 entries and giving newly-included modules a predictable slot. |

## Out of scope (Phase-2 candidates)

- Replacing `tc-json-reporter.ts` with a structured reporter that also emits CSV (CLAUDE.md still references CSV, but only JSON exists today).
- Migrating shell scripts to a TypeScript runner (`bun scripts/run-tests.ts`) for cross-platform support and richer flag handling.
- Sorting modules numerically by spec prefix.
- Auto-completing module names in `run-module.sh` (zsh/bash completion).
