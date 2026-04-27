const app = require('./app');
const config = require('./config');
const { pool } = require('./db');

const server = app.listen(config.port, () => {
  console.log(`[video-site-backend] listening on :${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
