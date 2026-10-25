#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${SELKIES_PASSWORD:?Configura SELKIES_PASSWORD como secreto de Codespaces}"
docker compose pull
docker compose up -d
echo "Selkies iniciado. Abre el puerto 8080 desde Ports."
