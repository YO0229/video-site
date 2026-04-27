function sanitizeSingleLineText(value, maxLength = 120) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function normalizeUsername(username) {
  return sanitizeSingleLineText(username, 20);
}

function normalizeUsernameKey(username) {
  return normalizeUsername(username).toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar || '',
    birthDate: user.birth_date || '',
    gender: user.gender || 'secret',
    age: user.age,
    role: user.role,
    blacklisted: Boolean(user.blacklisted),
    createdAt: Number(user.created_at) || 0
  };
}

function parseJsonOrDefault(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function normalizeSort(sortValue) {
  const key = String(sortValue || '').trim();
  const valid = new Set(['latest', 'oldest', 'year_desc', 'year_asc', 'duration_desc', 'duration_asc']);
  return valid.has(key) ? key : 'latest';
}

function sortToSql(sortValue) {
  const sort = normalizeSort(sortValue);
  if (sort === 'oldest') return 'published_at ASC';
  if (sort === 'year_desc') return 'published_at DESC';
  if (sort === 'year_asc') return 'published_at ASC';
  if (sort === 'duration_desc') return 'duration DESC';
  if (sort === 'duration_asc') return 'duration ASC';
  return 'created_at DESC';
}

function buildId() {
  return `u_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

module.exports = {
  sanitizeSingleLineText,
  normalizeUsername,
  normalizeUsernameKey,
  toPublicUser,
  parseJsonOrDefault,
  sortToSql,
  buildId
};
