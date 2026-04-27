param(
  [string]$SiteRoot = "C:\\inetpub\\wwwroot\\video-site",
  [string]$BackupDir = "D:\\backups\\video-site",
  [int]$RetentionDays = 14
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $BackupDir)) {
  New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archive = Join-Path $BackupDir "video-site_$timestamp.zip"

Compress-Archive -Path "$SiteRoot\\*" -DestinationPath $archive -Force

Get-ChildItem -Path $BackupDir -Filter "video-site_*.zip" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
  Remove-Item -Force

Write-Host "Backup done: $archive"