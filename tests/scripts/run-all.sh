#!/usr/bin/env bash
# Run every e2e module spec sequentially and print a pass/fail summary.
# Usage: ./run-all.sh [playwright-flags...]
#   ./run-all.sh --workers=100%   # run all specs in a single playwright batch with 100% workers
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

MODULES=(
  adjustment-type
  business-type
  credit-note-reason
  credit-term
  currency
  delivery-point
  department
  exchange-rate
  extra-cost
  location
  tax-profile
  unit
  vendor
)

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
    # Resolve NN-<module>.spec.ts (sequence-prefixed)
    SPEC=$(cd "$REPO_ROOT" && ls tests/[0-9][0-9]-"${m}".spec.ts 2>/dev/null | head -1)
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
