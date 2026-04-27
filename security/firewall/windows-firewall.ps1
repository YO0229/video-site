# Windows Defender Firewall baseline for web server
# Run as Administrator PowerShell

Set-NetFirewallProfile -Profile Domain,Private,Public -DefaultInboundAction Block -DefaultOutboundAction Allow

# Allow remote management (adjust/remove as needed)
New-NetFirewallRule -DisplayName "Allow-SSH-22" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow -Profile Any

# Allow web
New-NetFirewallRule -DisplayName "Allow-HTTP-80" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow -Profile Any
New-NetFirewallRule -DisplayName "Allow-HTTPS-443" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -Profile Any

Get-NetFirewallProfile | Format-Table Name, Enabled, DefaultInboundAction, DefaultOutboundAction