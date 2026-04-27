# Security Hardening Pack

This folder provides deploy-ready security templates for this site.

## 1) WAF protection
- `waf/modsecurity-local.conf`: ModSecurity + OWASP CRS baseline.

## 2) HTTPD encryption (TLS)
- `httpd/httpd-ssl-hardening.conf`: Apache TLS and security headers.

## 3) Firewall protection
- `firewall/ufw-hardening.sh`: Linux UFW baseline.
- `firewall/windows-firewall.ps1`: Windows Defender Firewall baseline.

## 4) Interface security and access
- `nginx/secure-site.conf`: HTTPS redirect, rate limiting, method control, API hardening.

## 5) Periodic backup
- `backup/backup-site.sh`: Linux backup script (site + logs + retention).
- `backup/backup-site.ps1`: Windows backup script.

## 6) Website log monitoring
- `monitor/log-watch.sh`: quick log scanner for 4xx/5xx and suspicious IPs.
- `monitor/fail2ban-jail.local`: brute-force ban rules.
- `monitor/logrotate-video-site.conf`: log rotation and retention.
- `systemd/log-watch.service` + `systemd/log-watch.timer`: scheduled monitor.

## Quick start (Linux)
1. Install: Nginx/Apache, certbot, modsecurity, fail2ban, rsyslog.
2. Apply Nginx config: `security/nginx/secure-site.conf`.
3. Apply WAF rules: `security/waf/modsecurity-local.conf`.
4. Apply firewall: `bash security/firewall/ufw-hardening.sh`.
5. Enable backup cron:
   - `0 3 * * * /opt/video-site/security/backup/backup-site.sh`
6. Enable log monitor timer:
   - `systemctl enable --now log-watch.timer`

## Notes
- Replace domain names, file paths, and certificate paths before deploying.
- CSP/header rules should be sent by web server for strongest effect.