# 部署运行步骤（完整）

## 0. 项目说明
- 当前项目是纯前端站点，直接运行无需后端数据库。
- 账号/视频等数据默认存浏览器 IndexedDB + localStorage。
- 若你要上生产并多端共享数据，使用 `DATABASE_SCHEMA.sql` 对接后端 API。

## 1. 获取完整代码
- 全量源码拼接版：`deliverables/FULL_CODE_BUNDLE.txt`
- 项目源码目录：项目根目录 + `security/`

## 2. 本地运行（开发测试）
在项目根目录执行：

```powershell
python -m http.server 8080
```

浏览器打开：
- `http://localhost:8080/index.html`
- 管理后台：`http://localhost:8080/admin.html`

默认管理员：
- 用户名：`oyjf`
- 密码：`Oyjf20040229`

## 3. 生产部署（静态站点）

### 3.1 Linux + Nginx（推荐）
1. 安装 Nginx：
```bash
sudo apt update
sudo apt install -y nginx
```

2. 上传项目到服务器目录（示例）：
- `/var/www/video-site`

3. 应用 Nginx 配置模板：
- 源文件：`security/nginx/secure-site.conf`
- 替换：域名、证书路径、站点 root
- 放置到：`/etc/nginx/sites-available/video-site.conf`
- 建立软链并重载：
```bash
sudo ln -s /etc/nginx/sites-available/video-site.conf /etc/nginx/sites-enabled/video-site.conf
sudo nginx -t
sudo systemctl reload nginx
```

4. 申请 HTTPS 证书（certbot）：
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3.2 Linux + Apache HTTPD
- 使用模板：`security/httpd/httpd-ssl-hardening.conf`
- 启用模块：`ssl headers rewrite`
- 配置证书并重启 Apache。

## 4. 安全加固（防火墙/WAF/日志）

### 4.1 防火墙
- Linux：`security/firewall/ufw-hardening.sh`
```bash
sudo bash security/firewall/ufw-hardening.sh
```
- Windows：`security/firewall/windows-firewall.ps1`（管理员 PowerShell）

### 4.2 WAF（ModSecurity）
- 配置：`security/waf/modsecurity-local.conf`
- 建议配合 OWASP CRS。

### 4.3 日志监控
- 巡检脚本：`security/monitor/log-watch.sh`
- fail2ban：`security/monitor/fail2ban-jail.local`
- logrotate：`security/monitor/logrotate-video-site.conf`
- systemd 定时：
  - `security/systemd/log-watch.service`
  - `security/systemd/log-watch.timer`

启用定时：
```bash
sudo cp security/systemd/log-watch.service /etc/systemd/system/
sudo cp security/systemd/log-watch.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now log-watch.timer
```

## 5. 定期备份

### 5.1 Linux
```bash
chmod +x security/backup/backup-site.sh
# 每天 03:00 备份
crontab -e
# 添加
0 3 * * * /opt/video-site/security/backup/backup-site.sh
```

### 5.2 Windows
- 脚本：`security/backup/backup-site.ps1`
- 用“任务计划程序”按天执行。

## 6. 数据库部署（可选，后端化时使用）

1. 安装 MySQL 8+
2. 执行：`deliverables/DATABASE_SCHEMA.sql`
3. 实现后端 API（登录、视频、收藏、历史、设置）
4. 前端把本地存储改为调用 API

## 7. 上线检查清单
- HTTPS 正常（TLS1.2/1.3）
- 安全头生效（CSP/HSTS/XFO 等）
- 防火墙仅开放 80/443/22
- 日志监控和备份任务已启用
- 管理员密码已改强密码