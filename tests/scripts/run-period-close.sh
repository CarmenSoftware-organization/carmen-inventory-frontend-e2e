#!/usr/bin/env bash
# Run one period-close round, phase by phase, and stop before each irreversible
# step (Start Period Close, count submit, Close Period) if anything failed.
# Known bugs are pinned with test.fail(), so they do not stop the round.
#
# Usage:
#   ./run-period-close.sh <scenario> [extra spec to run before Start …]
#   ./run-period-close.sh avg2607
#   ./run-period-close.sh avg2607 tests/916-period-close-fix-guards.spec.ts
#
# <scenario> is a key of tests/helpers/period-close/scenarios.ts; the BU and the
# period come from it. Needs E2E_DB_URL (see .env.example). Evidence lands in
# runs/period-close/<scenario>/ (results.json + screenshots).
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

if [ -z "${1:-}" ]; then
  echo "usage: $0 <scenario> [extra spec …]" >&2
  exit 1
fi
export E2E_PERIOD_SCENARIO="$1"
shift
EXTRA=("$@")

# "<BU>:<period>", straight from the scenario table.
GATE=$(bun -e '
  const { SCN } = await import("./tests/helpers/period-close/scenarios.ts");
  console.log(`${SCN.bu}:${SCN.period}`);
')

phase() {
  local label=$1
  shift
  echo "== $E2E_PERIOD_SCENARIO · $label"
  bun run test:period-close -- "$@"
}

phase "before Start" \
  tests/910-period-close-prestep.spec.ts tests/911-period-close-blockers.spec.ts \
  tests/912-period-close-start-gate.spec.ts tests/914-period-close-out-of-period-docs.spec.ts \
  tests/917-period-close-new-rules.spec.ts ${EXTRA[@]+"${EXTRA[@]}"} || { echo "failures before Start — stopping"; exit 2; }

E2E_ALLOW_IRREVERSIBLE="$GATE" phase "Start ($GATE)" tests/918-period-close-start.spec.ts || exit 3

E2E_ALLOW_IRREVERSIBLE="$GATE" phase "counting" \
  tests/920-period-close-close-gate.spec.ts tests/921-period-close-count.spec.ts \
  tests/922-period-close-verify.spec.ts tests/923-period-close-ledger-views.spec.ts || { echo "failures before Close — stopping"; exit 4; }

E2E_ALLOW_IRREVERSIBLE="$GATE" phase "Close ($GATE)" tests/924-period-close-close.spec.ts || exit 5
