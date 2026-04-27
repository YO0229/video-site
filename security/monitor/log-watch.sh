#!/usr/bin/env bash
set -euo pipefail

ACCESS_LOG="${ACCESS_LOG:-/var/log/nginx/video-site.access.log}"
ERROR_LOG="${ERROR_LOG:-/var/log/nginx/video-site.error.log}"
ALERT_THRESHOLD_4XX="${ALERT_THRESHOLD_4XX:-200}"
ALERT_THRESHOLD_5XX="${ALERT_THRESHOLD_5XX:-40}"

if [[ ! -f "$ACCESS_LOG" ]]; then
  echo "access log not found: $ACCESS_LOG"
  exit 1
fi

# last 10 min rough scan (tail-based)
TAIL_LINES=4000
chunk="$(tail -n "$TAIL_LINES" "$ACCESS_LOG")"

count_4xx="$(printf "%s" "$chunk" | awk '{print $9}' | grep -E '^4[0-9]{2}$' | wc -l | tr -d ' ')"
count_5xx="$(printf "%s" "$chunk" | awk '{print $9}' | grep -E '^5[0-9]{2}$' | wc -l | tr -d ' ')"

echo "4xx=$count_4xx 5xx=$count_5xx"

if (( count_4xx > ALERT_THRESHOLD_4XX )) || (( count_5xx > ALERT_THRESHOLD_5XX )); then
  echo "[ALERT] abnormal http error spike detected"
  # hook your notifier here: mail/slack/webhook
fi

# Top suspicious IPs (4xx/5xx)
printf "%s" "$chunk" | awk '$9 ~ /^[45][0-9][0-9]$/ {print $1}' | sort | uniq -c | sort -nr | head -n 10

if [[ -f "$ERROR_LOG" ]]; then
  echo "--- recent error log ---"
  tail -n 50 "$ERROR_LOG"
fi