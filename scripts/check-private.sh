#!/bin/sh

# The private-identifier manifest lives OUTSIDE this repository, alongside the
# identity register. Never commit the manifest, its path, or its contents.

if [ -z "${BUILDERSBOOK_PRIVATE_MANIFEST:-}" ]; then
  echo "check-private: BUILDERSBOOK_PRIVATE_MANIFEST is unset; point it to the external private-identifier manifest" >&2
  exit 2
fi

if [ ! -f "$BUILDERSBOOK_PRIVATE_MANIFEST" ]; then
  echo "check-private: manifest not found: $BUILDERSBOOK_PRIVATE_MANIFEST" >&2
  exit 2
fi

patterns=$(mktemp "${TMPDIR:-/tmp}/buildersbook-private.XXXXXX") || exit 2
trap 'rm -f "$patterns"' EXIT HUP INT TERM

# Empty lines are not identifiers and would otherwise match every line.
sed '/^$/d' "$BUILDERSBOOK_PRIVATE_MANIFEST" >"$patterns"

if [ ! -s "$patterns" ]; then
  exit 0
fi

LC_ALL=C grep -RInFi \
  --exclude='.DS_Store' \
  --exclude='check-private.sh' \
  --exclude-dir='.git' \
  -f "$patterns" .
status=$?

if [ "$status" -eq 1 ]; then
  exit 0
fi

if [ "$status" -eq 0 ]; then
  exit 1
fi

echo "check-private: grep failed with status $status" >&2
exit 2
