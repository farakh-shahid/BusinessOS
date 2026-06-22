#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set."
  echo "Example:"
  echo '  DATABASE_URL="postgresql://..." npm run db:deploy:seed --workspace=backend'
  exit 1
fi

host="${DATABASE_URL#*@}"
host="${host%%/*}"
echo "Target: postgresql://***@${host}"
echo "Applying migrations..."
npx prisma migrate deploy
echo "Seeding demo data..."
npx prisma db seed
echo "Done."
