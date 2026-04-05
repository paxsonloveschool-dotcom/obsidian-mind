#!/usr/bin/env bash
# Claude Code Portal Hook
# Install on each device to report events to the central portal server.
#
# This script is called by Claude Code hooks (PreToolUse, PostToolUse, Stop, etc.)
# It reads the hook payload from stdin, wraps it with device metadata, and POSTs
# to the central server. Runs async (backgrounded) to avoid adding latency.
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

# Read hook payload from stdin
PAYLOAD=$(cat)

# Get hook event type from the Claude Code hook name
# Claude Code passes the hook type as the first argument
HOOK_EVENT="${1:-unknown}"

# Extract session ID from payload
SESSION_ID=$(echo "$PAYLOAD" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('session_id', data.get('sessionId', 'unknown')))
except:
    print('unknown')
" 2>/dev/null || echo "unknown")

# Build the envelope
ENVELOPE=$(python3 -c "
import json, sys

payload = json.loads('''$PAYLOAD''') if '''$PAYLOAD''' else {}

envelope = {
    'device_id': '$PORTAL_DEVICE_ID',
    'device_name': '$PORTAL_DEVICE_NAME',
    'hostname': '$(hostname)',
    'platform': '$PORTAL_PLATFORM',
    'hook_event': '$HOOK_EVENT',
    'session_id': '$SESSION_ID',
    'timestamp': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'payload': payload
}

print(json.dumps(envelope))
" 2>/dev/null)

# POST to central server (backgrounded, fire-and-forget)
curl -s -X POST \
  "${PORTAL_SERVER_URL}/api/events" \
  -H "Content-Type: application/json" \
  -d "$ENVELOPE" \
  --max-time 5 \
  >/dev/null 2>&1 &
