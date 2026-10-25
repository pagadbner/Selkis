#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
chmod +x scripts/*.sh .devcontainer/*.sh
echo "Selkies Cloud Desktop preparado."
echo "Node: $(node --version)"
if command -v docker >/dev/null 2>&1; then
  echo "Docker CLI: $(docker --version)"
else
  echo "AVISO: Docker CLI no está disponible; revisa el registro de creación del Codespace."
fi
echo "Configura SELKIES_PASSWORD en GitHub Codespaces Secrets antes de iniciar Selkies."
