#!/usr/bin/env bash
# Run a single e2e module spec.
# Usage: ./run-module.sh <module> [playwright-flags...]
#   ./run-module.sh currency
#   ./run-module.sh currency --headed
#   ./run-module.sh department --debug
set -euo pipefail

MODULE="${1:?usage: run-module.sh <module> [playwright-flags...]}"
shift || true

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SPEC="tests/${MODULE}.spec.ts"

if [ ! -f "${REPO_ROOT}/${SPEC}" ]; then
  echo "error: spec file not found: ${SPEC}" >&2
  exit 1
fi

cd "$REPO_ROOT"
set +e
bunx playwright test "$SPEC" "$@"
STATUS=$?
set -e
bun e2e:sync || true
exit $STATUS
