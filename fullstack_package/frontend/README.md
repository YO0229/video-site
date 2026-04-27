# 流光视频（静态视频网站示例）

## 运行方式
1. 直接双击 `index.html` 打开。
2. 上传入口：`upload.html`。
3. 后台管理入口：`admin.html`。
4. 个人中心入口：`profile.html`。
5. 修改密码入口：`password.html`（也可在账号设置中进入）。
6. 或者在该目录启动本地服务（推荐）：
   - `python -m http.server 8080`
   - 浏览器访问 `http://localhost:8080`

## 默认管理员
- 用户名：`oyjf`
- 密码：`Oyjf20040229`

## 已实现功能
- 首页精选推荐
- 视频库内联分类筛选 / 搜索（含分类计数、清空筛选、URL 参数同步、只看收藏、只看我上传）
- 视频分享（支持系统分享，或复制可直达播放的视频链接）
- 弹窗播放器（断点续播、缓冲/错误提示、快进快退、倍速、全屏、快捷键）
- 搜索优化：支持空格多关键词匹配，按 `/` 快速聚焦，`Esc` 或右侧按钮可快速清空，`Enter` 可打开首个可播放结果
- 登录 / 注册 / 退出（本地存储）
- 账号设置（管理员和普通用户均可修改头像、出生年月日、性别、年龄和账号名）
- 独立修改密码页（`password.html`，从账号设置可快速进入）
- 个人中心（`profile.html`，用户可编辑/删除自己发布的视频）
- 独立上传页（`upload.html`，支持视频/封面拖拽上传、整块点击/键盘选择文件、一键移除已选文件、本地时长自动识别、封面预览、重复标题校验、草稿恢复）
- 后台管理（管理员可删除任意视频、切换用户角色、审核通过/驳回、站点公告与审核策略设置）
- 安全增强：登录会话过期控制、密码哈希存储（带盐 PBKDF2）、危险 URL 协议拦截

## 说明
- 这是纯前端本地版，不含真实后端鉴权与数据库。
- 视频数据优先保存在浏览器 `IndexedDB`（容量比 `localStorage` 大很多），其余配置保存在 `localStorage`。
- 清除浏览器站点数据后会重置。

## 安全部署包
- 目录：`security/`
- 包含：
  - WAF：`security/waf/modsecurity-local.conf`
  - HTTPS/TLS：`security/httpd/httpd-ssl-hardening.conf`、`security/nginx/secure-site.conf`
  - 防火墙：`security/firewall/ufw-hardening.sh`、`security/firewall/windows-firewall.ps1`
  - 定期备份：`security/backup/backup-site.sh`、`security/backup/backup-site.ps1`
  - 日志监控：`security/monitor/log-watch.sh`、`security/monitor/fail2ban-jail.local`
- 详细启用顺序见 `security/README.md`。
