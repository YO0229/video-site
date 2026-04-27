const dotenv = require('dotenv');

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 9000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080',
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: toInt(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'video_site'
  },
  sessionTtlMs: toInt(process.env.SESSION_TTL_HOURS, 12) * 60 * 60 * 1000,
  loginFailureLimit: toInt(process.env.LOGIN_FAILURE_LIMIT, 5),
  loginLockMs: toInt(process.env.LOGIN_LOCK_SECONDS, 90) * 1000,
  rootAdmin: {
    id: process.env.ROOT_ADMIN_ID || 'u_root',
    username: process.env.ROOT_ADMIN_USERNAME || 'oyjf',
    password: process.env.ROOT_ADMIN_PASSWORD || 'Oyjf20040229'
  }
};
