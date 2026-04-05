#!/usr/bin/env bash
# Claude Code Portal Heartbeat
# Run via cron every 2 minutes on each device to keep it marked as online
# and report installed extensions/MCP servers.
#
# Crontab entry:
#   */2 * * * * /path/to/portal/src/hooks/heartbeat.sh
#
# Configuration (environment variables):
#   PORTAL_SERVER_URL  - Central server URL (default: http://localhost:4981)
#   PORTAL_DEVICE_ID   - Unique device identifier (default: hostname-based)
#   PORTAL_DEVICE_NAME - Human-readable name (default: hostname)

set -euo pipefail

PORTAL_SERVER_URL="${PORTAL_SERVER_URL:-http://localhost:4981}"
PORTAL_DEVICE_ID="${PORTAL_DEVICE_ID:-$(hostname | tr '[:upper:]' '[:lower:]' | tr ' ' '-')}"
PORTAL_DEVICE_NAME="${PORTAL_DEVICE_NAME:-$(hostname)}"
PORTAL_PLATFORM="${PORTAL_PLATFORM:-$(uname -s)}"

# Scan for installed extensions
EXTENSIONS=$(python3 -c "
import json, os, glob

extensions = []

# Check user-level settings for MCP servers
settings_path = os.path.expanduser('~/.claude/settings.json')
if os.path.exists(settings_path):
    try:
        with open(settings_path) as f:
            settings = json.load(f)
        for name, config in settings.get('mcpServers', {}).items():
            extensions.append({'name': name, 'type': 'mcp-server', 'config': config})
        for hook_evt, hooks in settings.get('hooks', {}).items():
            if isinstance(hooks, list):
                for h in hooks:
                    cmd = h.get('command', '') if isinstance(h, dict) else str(h)
                    extensions.append({'name': f'hook:{hook_evt}', 'type': 'hook', 'config': {'command': cmd}})
    except:
        pass

# Check for project-level settings in common project dirs
for settings_file in glob.glob(os.path.expanduser('~/*/.claude/settings.json')):
    try:
        with open(settings_file) as f:
            proj_settings = json.load(f)
        project = os.path.basename(os.path.dirname(os.path.dirname(settings_file)))
        for name, config in proj_settings.get('mcpServers', {}).items():
            extensions.append({'name': f'{project}/{name}', 'type': 'mcp-server', 'config': config})
    except:
        pass

print(json.dumps(extensions))
" 2>/dev/null || echo '[]')

# Send heartbeat
curl -s -X POST \
  "${PORTAL_SERVER_URL}/api/heartbeat" \
  -H "Content-Type: application/json" \
  -d "{
    \"device_id\": \"${PORTAL_DEVICE_ID}\",
    \"device_name\": \"${PORTAL_DEVICE_NAME}\",
    \"hostname\": \"$(hostname)\",
    \"platform\": \"${PORTAL_PLATFORM}\",
    \"extensions\": ${EXTENSIONS}
  }" \
  --max-time 5 \
  >/dev/null 2>&1
