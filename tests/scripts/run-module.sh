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
# Spec files are prefixed with a sequence number (NN-module.spec.ts), so resolve
# the module name to whatever file matches the trailing segment.
SPEC=$(cd "$REPO_ROOT" && ls tests/[0-9][0-9][0-9]-"${MODULE}".spec.ts 2>/dev/null | head -1)

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
