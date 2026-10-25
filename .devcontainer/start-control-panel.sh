#!/usr/bin/env bash
set -euo pipefail
# postStartCommand runs from the workspace directory in Codespaces.
cd "$PWD"
if pgrep -f '[n]ode control-panel/server.js' >/dev/null 2>&1; then
  exit 0
fi
nohup node control-panel/server.js > /tmp/selkies-control-panel.log 2>&1 &
