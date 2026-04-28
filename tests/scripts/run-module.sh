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
