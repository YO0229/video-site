const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { z } = require('zod');

const config = require('./config');
const { query, withTransaction } = require('./db');
const {
  nowMs,
  randomBase64,
  sha256Hex,
  createPasswordCredential,
  verifyPassword,
  isPasswordStrong
} = require('./security');
const {
  sanitizeSingleLineText,
  normalizeUsername,
  normalizeUsernameKey,
  toPublicUser,
  parseJsonOrDefault,
  sortToSql,
  buildId
} = require('./utils');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

const SESSION_COOKIE = 'vs_token';

function setSessionCookie(res, token, expiresAt) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    expires: new Date(expiresAt)
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production'
  });
}

function extractToken(req) {
  const auth = String(req.headers.authorization || '').trim();
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const cookieToken = String(req.cookies?.[SESSION_COOKIE] || '').trim();
  return cookieToken || '';
}

async function createSession(userId) {
  const token = randomBase64(32);
  const tokenHash = sha256Hex(token);
  const createdAt = nowMs();
  const expiresAt = createdAt + config.sessionTtlMs;
  await query(
    'INSERT INTO user_sessions (user_id, token_hash, expires_at, created_at, revoked) VALUES (?, ?, ?, ?, 0)',
    [userId, tokenHash, expiresAt, createdAt]
  );
  return { token, expiresAt };
}

async function revokeSessionByToken(token) {
  if (!token) return;
  const tokenHash = sha256Hex(token);
  await query('UPDATE user_sessions SET revoked = 1 WHERE token_hash = ?', [tokenHash]);
}

async function authMiddleware(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      req.auth = null;
      next();
      return;
    }
    const tokenHash = sha256Hex(token);
    const rows = await query(
      `SELECT s.id AS session_id, s.user_id, s.expires_at, u.*
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.revoked = 0 AND s.expires_at > ?
       LIMIT 1`,
      [tokenHash, nowMs()]
    );
    if (!rows.length) {
      req.auth = null;
      next();
      return;
    }
    req.auth = {
      token,
      sessionId: rows[0].session_id,
      user: rows[0]
    };
    next();
  } catch (error) {
    next(error);
  }
}

function requireAuth(req, res, next) {
  if (!req.auth?.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if (req.auth.user.blacklisted) {
    res.status(403).json({ message: 'Account is blacklisted' });
    return;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.auth?.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if (!(req.auth.user.role === 'admin' || req.auth.user.role === 'super_admin')) {
    res.status(403).json({ message: 'Admin role required' });
    return;
  }
  next();
}

async function getLoginSecurity(usernameKey) {
  const rows = await query('SELECT * FROM login_security WHERE username_key = ? LIMIT 1', [usernameKey]);
  return rows[0] || null;
}

async function clearLoginSecurity(usernameKey) {
  await query('DELETE FROM login_security WHERE username_key = ?', [usernameKey]);
}

async function recordLoginFailure(usernameKey) {
  const now = nowMs();
  const state = await getLoginSecurity(usernameKey);
  const lockUntil = Number(state?.lock_until || 0);
  if (lockUntil > now) {
    return {
      locked: true,
      lockSeconds: Math.ceil((lockUntil - now) / 1000),
      remainingAttempts: 0
    };
  }

  const failedCount = Number(state?.failed_count || 0) + 1;
  if (failedCount >= config.loginFailureLimit) {
    const nextLockUntil = now + config.loginLockMs;
    await query(
      `INSERT INTO login_security (username_key, failed_count, lock_until)
       VALUES (?, 0, ?)
       ON DUPLICATE KEY UPDATE failed_count = VALUES(failed_count), lock_until = VALUES(lock_until)`,
      [usernameKey, nextLockUntil]
    );
    return {
      locked: true,
      lockSeconds: Math.ceil(config.loginLockMs / 1000),
      remainingAttempts: 0
    };
  }

  await query(
    `INSERT INTO login_security (username_key, failed_count, lock_until)
     VALUES (?, ?, 0)
     ON DUPLICATE KEY UPDATE failed_count = VALUES(failed_count), lock_until = 0`,
    [usernameKey, failedCount]
  );

  return {
    locked: false,
    remainingAttempts: config.loginFailureLimit - failedCount
  };
}

async function ensureSiteSettingDefaults() {
  await query(
    `INSERT IGNORE INTO site_settings (k, v) VALUES
     ('requireApproval', JSON_OBJECT('value', true)),
     ('siteNotice', JSON_OBJECT('value', ''))`
  );
}

async function getSiteSettings() {
  await ensureSiteSettingDefaults();
  const rows = await query("SELECT k, v FROM site_settings WHERE k IN ('requireApproval', 'siteNotice')");
  const map = new Map(rows.map((row) => [row.k, parseJsonOrDefault(row.v, {})]));
  return {
    requireApproval: Boolean(map.get('requireApproval')?.value ?? true),
    siteNotice: sanitizeSingleLineText(String(map.get('siteNotice')?.value || ''), 120)
  };
}

app.use(authMiddleware);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: nowMs() });
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const schema = z.object({
      username: z.string().min(3).max(20),
      password: z.string().min(8).max(64)
    });
    const parsed = schema.parse(req.body || {});
    const username = normalizeUsername(parsed.username);
    const password = String(parsed.password || '').trim();

    if (/\s/.test(username)) {
      res.status(400).json({ message: 'Username cannot contain spaces' });
      return;
    }
    if (!isPasswordStrong(password)) {
      res.status(400).json({ message: 'Weak password' });
      return;
    }

    const duplicated = await query('SELECT id FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1', [username]);
    if (duplicated.length) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    const credential = await createPasswordCredential(password);
    const userId = buildId();
    const createdAt = nowMs();
    await query(
      `INSERT INTO users (
        id, username, password_hash, password_salt, password_iterations, password_algo,
        avatar, birth_date, gender, age, role, blacklisted, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, '', NULL, 'secret', NULL, 'user', 0, ?)`,
      [
        userId,
        username,
        credential.passwordHash,
        credential.passwordSalt,
        credential.passwordIterations,
        credential.passwordAlgo,
        createdAt
      ]
    );

    const users = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    const user = users[0];
    const session = await createSession(user.id);
    setSessionCookie(res, session.token, session.expiresAt);

    res.status(201).json({
      user: toPublicUser(user),
      token: session.token,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const schema = z.object({
      username: z.string().min(3).max(20),
      password: z.string().min(1).max(64)
    });
    const parsed = schema.parse(req.body || {});
    const username = normalizeUsername(parsed.username);
    const password = String(parsed.password || '').trim();
    const usernameKey = normalizeUsernameKey(username);

    const lockState = await getLoginSecurity(usernameKey);
    if (Number(lockState?.lock_until || 0) > nowMs()) {
      const remain = Math.ceil((Number(lockState.lock_until) - nowMs()) / 1000);
      res.status(429).json({ message: `Account locked, retry in ${remain}s` });
      return;
    }

    const users = await query('SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1', [username]);
    const user = users[0] || null;
    const valid = user ? await verifyPassword(password, user) : false;

    if (!user || !valid) {
      const failure = await recordLoginFailure(usernameKey);
      if (failure.locked) {
        res.status(429).json({ message: `Too many failures, locked ${failure.lockSeconds}s` });
        return;
      }
      res.status(401).json({ message: `Invalid credentials, remaining attempts: ${failure.remainingAttempts}` });
      return;
    }

    await clearLoginSecurity(usernameKey);

    if (user.blacklisted) {
      res.status(403).json({ message: 'Account is blacklisted' });
      return;
    }

    const session = await createSession(user.id);
    setSessionCookie(res, session.token, session.expiresAt);
    res.json({ user: toPublicUser(user), token: session.token, expiresAt: session.expiresAt });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', async (req, res, next) => {
  try {
    const token = extractToken(req);
    await revokeSessionByToken(token);
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.auth.user) });
});

app.get('/api/site-settings', async (_req, res, next) => {
  try {
    const settings = await getSiteSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.get('/api/videos', async (req, res, next) => {
  try {
    const q = sanitizeSingleLineText(req.query.q || '', 80);
    const category = sanitizeSingleLineText(req.query.category || '', 40);
    const sortSql = sortToSql(req.query.sort);
    const mine = String(req.query.mine || '') === '1';
    const isAdmin = req.auth?.user && (req.auth.user.role === 'admin' || req.auth.user.role === 'super_admin');

    const params = [];
    const where = [];

    if (!isAdmin) {
      where.push("(status = 'approved' OR owner_id = ?)");
      params.push(req.auth?.user?.id || '');
    }

    if (mine && req.auth?.user?.id) {
      where.push('owner_id = ?');
      params.push(req.auth.user.id);
    }

    if (category && category !== '全部') {
      where.push('category = ?');
      params.push(category);
    }

    if (q) {
      where.push('(title LIKE ? OR category LIKE ? OR description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const sql = `
      SELECT * FROM videos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY ${sortSql}
      LIMIT 500
    `;

    const rows = await query(sql, params);
    const videos = rows.map((row) => ({
      ...row,
      tags: parseJsonOrDefault(row.tags, []),
      year: Number(row.year),
      publishedAt: Number(row.published_at),
      createdAt: Number(row.created_at)
    }));

    res.json({ items: videos });
  } catch (error) {
    next(error);
  }
});

app.post('/api/videos', requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(1).max(60),
      category: z.string().min(1).max(20),
      duration: z.string().min(1).max(10),
      publishedAt: z.number().int().positive(),
      description: z.string().max(220).optional().default('用户上传视频'),
      src: z.string().min(1).max(300000),
      cover: z.string().max(300000).optional().default(''),
      tags: z.array(z.string().max(20)).max(10).optional().default([])
    });
    const body = schema.parse(req.body || {});
    const duplicated = await query('SELECT id FROM videos WHERE LOWER(title)=LOWER(?) LIMIT 1', [body.title]);
    if (duplicated.length) {
      res.status(409).json({ message: 'Duplicated title' });
      return;
    }

    const settings = await getSiteSettings();
    const isAdmin = req.auth.user.role === 'admin' || req.auth.user.role === 'super_admin';
    const status = settings.requireApproval && !isAdmin ? 'pending' : 'approved';

    const video = await withTransaction(async (conn) => {
      const [rows] = await conn.query('SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM videos FOR UPDATE');
      const nextId = Number(rows[0].next_id);
      const createdAt = nowMs();
      const year = new Date(Number(body.publishedAt)).getFullYear();

      await conn.query(
        `INSERT INTO videos (
          id, title, category, duration, year, published_at, tags, description, src, cover,
          status, owner_id, owner_name, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextId,
          sanitizeSingleLineText(body.title, 60),
          sanitizeSingleLineText(body.category, 20),
          sanitizeSingleLineText(body.duration, 10),
          year,
          Number(body.publishedAt),
          JSON.stringify(body.tags || []),
          sanitizeSingleLineText(body.description, 220),
          String(body.src || '').trim(),
          String(body.cover || '').trim(),
          status,
          req.auth.user.id,
          req.auth.user.username,
          createdAt
        ]
      );

      const [videoRows] = await conn.query('SELECT * FROM videos WHERE id = ? LIMIT 1', [nextId]);
      return videoRows[0];
    });

    res.status(201).json({
      item: {
        ...video,
        tags: parseJsonOrDefault(video.tags, []),
        publishedAt: Number(video.published_at),
        createdAt: Number(video.created_at)
      }
    });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/videos/:id/review', requireAdmin, async (req, res, next) => {
  try {
    const videoId = Number(req.params.id);
    const schema = z.object({ status: z.enum(['approved', 'rejected']) });
    const body = schema.parse(req.body || {});
    await query('UPDATE videos SET status = ? WHERE id = ?', [body.status, videoId]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/favorites', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT video_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.auth.user.id]);
    res.json({ ids: rows.map((row) => Number(row.video_id)) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/favorites/:videoId', requireAuth, async (req, res, next) => {
  try {
    const videoId = Number(req.params.videoId);
    await query(
      `INSERT INTO favorites (user_id, video_id, created_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)`,
      [req.auth.user.id, videoId, nowMs()]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/favorites/:videoId', requireAuth, async (req, res, next) => {
  try {
    const videoId = Number(req.params.videoId);
    await query('DELETE FROM favorites WHERE user_id = ? AND video_id = ?', [req.auth.user.id, videoId]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/history', requireAuth, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT video_id AS videoId, played_seconds AS playedSeconds, updated_at AS updatedAt
       FROM playback_history
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [req.auth.user.id]
    );
    res.json({ items: rows });
  } catch (error) {
    next(error);
  }
});

app.put('/api/history/:videoId', requireAuth, async (req, res, next) => {
  try {
    const videoId = Number(req.params.videoId);
    const schema = z.object({ playedSeconds: z.number().min(0.1).max(86400) });
    const body = schema.parse(req.body || {});
    await query(
      `INSERT INTO playback_history (user_id, video_id, played_seconds, updated_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE played_seconds = VALUES(played_seconds), updated_at = VALUES(updated_at)`,
      [req.auth.user.id, videoId, Number(body.playedSeconds), nowMs()]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/history/:videoId', requireAuth, async (req, res, next) => {
  try {
    const videoId = Number(req.params.videoId);
    await query('DELETE FROM playback_history WHERE user_id = ? AND video_id = ?', [req.auth.user.id, videoId]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', requireAdmin, async (_req, res, next) => {
  try {
    const rows = await query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ items: rows.map(toPublicUser) });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/users/:id/password', requireAdmin, async (req, res, next) => {
  try {
    const userId = String(req.params.id || '');
    const schema = z.object({ newPassword: z.string().min(8).max(64) });
    const body = schema.parse(req.body || {});
    if (!isPasswordStrong(body.newPassword)) {
      res.status(400).json({ message: 'Weak password' });
      return;
    }
    const credential = await createPasswordCredential(body.newPassword);
    await query(
      `UPDATE users
       SET password_hash = ?, password_salt = ?, password_iterations = ?, password_algo = ?
       WHERE id = ?`,
      [
        credential.passwordHash,
        credential.passwordSalt,
        credential.passwordIterations,
        credential.passwordAlgo,
        userId
      ]
    );
    await query('UPDATE user_sessions SET revoked = 1 WHERE user_id = ?', [userId]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/site-settings', requireAdmin, async (req, res, next) => {
  try {
    const schema = z.object({
      requireApproval: z.boolean(),
      siteNotice: z.string().max(120).optional().default('')
    });
    const body = schema.parse(req.body || {});
    await query(
      `INSERT INTO site_settings (k, v) VALUES
         ('requireApproval', JSON_OBJECT('value', ?)),
         ('siteNotice', JSON_OBJECT('value', ?))
       ON DUPLICATE KEY UPDATE v = VALUES(v)`,
      [body.requireApproval, sanitizeSingleLineText(body.siteNotice, 120)]
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: 'Validation failed', issues: error.issues });
    return;
  }
  const message = config.nodeEnv === 'production' ? 'Internal server error' : (error.message || 'Internal server error');
  res.status(500).json({ message });
});

module.exports = app;
