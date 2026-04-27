# 全量部署运行步骤（fullstack_package）

## 目录结构
- `frontend/`: 前端完整代码（当前版本）
- `backend/`: Node.js + Express + MySQL API
- `database/DATABASE_SCHEMA.sql`: 数据库表结构
- `docs/FULL_CODE_BUNDLE.txt`: 全量代码汇总（自动生成）

## 1) 本地快速启动（前端）
在 `frontend/` 目录执行：

```powershell
python -m http.server 8080
```

浏览器访问：
- `http://localhost:8080/index.html`

## 2) 启动 MySQL 并初始化数据库
1. 创建数据库表：

```sql
SOURCE database/DATABASE_SCHEMA.sql;
```

2. 推荐创建业务账号（示例）：

```sql
CREATE USER IF NOT EXISTS 'video_app'@'%' IDENTIFIED BY 'StrongPasswordHere';
GRANT ALL PRIVILEGES ON video_site.* TO 'video_app'@'%';
FLUSH PRIVILEGES;
```

## 3) 启动后端 API
在 `backend/` 目录：

1. 安装依赖

```bash
npm install
```

2. 配置环境变量
- 复制 `.env.example` 为 `.env`
- 修改 MySQL 连接参数

3. 初始化超级管理员

```bash
npm run seed:admin
```

4. 启动服务

```bash
npm run start
```

默认 API 地址：
- `http://localhost:9000`
- 健康检查：`GET /api/health`

## 4) 生产部署建议
1. 使用 Nginx 反向代理 `frontend` 与 `backend`
2. 开启 HTTPS（Let’s Encrypt）
3. 应用 `frontend/security/` 内防火墙、WAF、日志监控配置
4. 启用数据库定期备份
5. 为后端服务启用 PM2/systemd 守护

## 5) 常见问题
1. `ER_ACCESS_DENIED_ERROR`
- 检查 `.env` 的 MySQL 用户名密码和授权。

2. 登录一直失败
- 先执行 `npm run seed:admin` 重建超级管理员密码。

3. 跨域报错
- 检查 `.env` 中 `FRONTEND_ORIGIN` 是否与前端地址一致。
