#!/usr/bin/env bash
# Run every e2e module spec in a single Playwright batch — setup runs once
# and all specs share auth state. Use run-module.sh for one-spec runs.
#
# Usage:
#   ./run-all.sh                  # default workers (per playwright.config.ts)
#   ./run-all.sh --workers=100%   # max parallelism (NB: dev server can flake)
#   ./run-all.sh --headed         # any flag is passed through
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Discover all numeric-prefix specs, sorted by basename.
shopt -s nullglob
SPECS=()
for spec in tests/[0-9]*-*.spec.ts; do
  SPECS+=("$spec")
done
shopt -u nullglob

if [ ${#SPECS[@]} -eq 0 ]; then
  echo "error: no spec files found under tests/" >&2
  exit 1
fi

IFS=$'\n' SPECS=($(printf '%s\n' "${SPECS[@]}" | sort))
unset IFS

echo "================================================================"
echo " Running ${#SPECS[@]} module specs in a single Playwright batch"
echo "================================================================"
for s in "${SPECS[@]}"; do echo "  • $s"; done
echo "----------------------------------------------------------------"

set +e
bunx playwright test "${SPECS[@]}" "$@"
STATUS=$?
set -e

bun e2e:sync || true

exit "$STATUS"
