#!/usr/bin/env bash
set -euo pipefail

# Linux UFW baseline firewall rules for web app host
# Run as root.

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH (adjust port if needed)
ufw allow 22/tcp

# HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Optional: monitoring agent
# ufw allow 9100/tcp

ufw --force enable
ufw status verbose