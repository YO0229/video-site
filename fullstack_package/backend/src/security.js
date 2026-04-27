const crypto = require('crypto');

const PASSWORD_HASH_ALGO = 'PBKDF2-SHA256-V1';
const PASSWORD_HASH_ITERATIONS = 120000;
const PASSWORD_KEY_LEN = 32;

function nowMs() {
  return Date.now();
}

function randomBase64(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(String(value || ''), 'utf8').digest('hex');
}

function pbkdf2Async(password, salt, iterations) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, PASSWORD_KEY_LEN, 'sha256', (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey.toString('hex'));
    });
  });
}

async function createPasswordCredential(password, iterations = PASSWORD_HASH_ITERATIONS) {
  const safePassword = String(password || '').trim();
  if (!safePassword) {
    throw new Error('Password required');
  }
  const salt = randomBase64(16);
  const hash = await pbkdf2Async(safePassword, salt, iterations);
  return {
    passwordHash: hash,
    passwordSalt: salt,
    passwordIterations: iterations,
    passwordAlgo: PASSWORD_HASH_ALGO
  };
}

async function verifyPassword(plainPassword, user) {
  const candidate = String(plainPassword || '').trim();
  if (!candidate) return false;
  if (!user?.password_hash || !user?.password_salt || !user?.password_iterations) return false;
  const hash = await pbkdf2Async(candidate, user.password_salt, Number(user.password_iterations));
  return crypto.timingSafeEqual(Buffer.from(hash, 'utf8'), Buffer.from(String(user.password_hash), 'utf8'));
}

function isPasswordStrong(password) {
  const raw = String(password || '');
  return raw.length >= 8 && /[a-zA-Z]/.test(raw) && /\d/.test(raw);
}

module.exports = {
  PASSWORD_HASH_ALGO,
  PASSWORD_HASH_ITERATIONS,
  nowMs,
  randomBase64,
  sha256Hex,
  createPasswordCredential,
  verifyPassword,
  isPasswordStrong
};
