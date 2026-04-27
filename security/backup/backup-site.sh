#!/usr/bin/env bash
set -euo pipefail

# Periodic backup script
# Usage:
#   SITE_ROOT=/var/www/video-site BACKUP_DIR=/var/backups/video-site ./backup-site.sh

SITE_ROOT="${SITE_ROOT:-/var/www/video-site}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/video-site}"
LOG_DIR="${LOG_DIR:-/var/log/nginx}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

TS="$(date +%Y%m%d_%H%M%S)"
ARCHIVE="$BACKUP_DIR/video-site_${TS}.tar.gz"

# backup site files + current logs
if [[ -d "$LOG_DIR" ]]; then
  tar -czf "$ARCHIVE" "$SITE_ROOT" "$LOG_DIR"
else
  tar -czf "$ARCHIVE" "$SITE_ROOT"
fi

# prune old backups
find "$BACKUP_DIR" -type f -name "video-site_*.tar.gz" -mtime +"$RETENTION_DAYS" -delete

echo "Backup done: $ARCHIVE"