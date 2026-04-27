const STORAGE_KEYS = {
  users: 'lg_users_v1',
  videos: 'lg_videos_v1',
  currentUser: 'lg_current_user_v1',
  authSession: 'lg_auth_session_v1',
  featuredId: 'lg_featured_id_v1',
  playbackHistory: 'lg_playback_history_v1',
  favorites: 'lg_favorites_v1',
  playerPrefs: 'lg_player_prefs_v1',
  siteSettings: 'lg_site_settings_v1',
  uploadDraft: 'lg_upload_draft_v1'
};

const MAX_VIDEO_FILE_SIZE = Number.POSITIVE_INFINITY;
const MAX_IMAGE_FILE_SIZE = Number.POSITIVE_INFINITY;
const MAX_ACCOUNT_AVATAR_FILE_SIZE = Number.POSITIVE_INFINITY;
const ACCEPT_WILDCARD_EXTENSION_MAP = {
  'video/': ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.avi', '.mkv'],
  'image/': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg']
};
const APP_IDB_NAME = 'lg_storage_v2';
const APP_IDB_VERSION = 1;
const APP_IDB_STORE = 'kv';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80';
const ROOT_ADMIN_PROFILE = {
  id: 'u_root',
  username: 'oyjf',
  password: 'Oyjf20040229',
  role: 'super_admin'
};
const SEARCH_DEBOUNCE_MS = 180;
const FILTER_QUERY_KEYS = {
  search: 'q',
  category: 'cat',
  sort: 'sort',
  favoriteOnly: 'fav',
  ownerOnly: 'mine',
  videoId: 'video'
};
const VALID_SORT_VALUES = new Set(['latest', 'oldest', 'year_desc', 'year_asc', 'duration_desc', 'duration_asc']);
const LOGIN_FAILURE_LIMIT = 5;
const LOGIN_LOCK_DURATION_MS = 90 * 1000;
const AUTH_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const PASSWORD_HASH_ALGO = 'PBKDF2-SHA256-V1';
const PASSWORD_HASH_ITERATIONS = 120000;
const PASSWORD_SALT_BYTE_SIZE = 16;
const SAFE_HTTP_PROTOCOLS = new Set(['http:', 'https:']);
const PLAYABLE_SOURCE_MAP = {
  '穿越群山的风': 'https://cdn.coverr.co/videos/coverr-milky-way-galaxy-from-the-hills-5834/1080p.mp4',
  '里斯本秋日航拍': 'https://cdn.coverr.co/videos/coverr-autumn-lisbon-5773/1080p.mp4',
  '溪流旁公路': 'https://cdn.coverr.co/videos/coverr-stream-next-to-the-road-4482/1080p.mp4',
  '代码与咖啡因': 'https://cdn.coverr.co/videos/coverr-making-coffee-7521/1080p.mp4',
  '黑胶夜听': 'https://cdn.coverr.co/videos/coverr-headphones-and-david-bowie-2460/1080p.mp4',
  '无人机视角：城市道路': 'https://cdn.coverr.co/videos/coverr-aerial-view-of-a-road-1579/1080p.mp4'
};
const PLAYABLE_FALLBACK_SOURCE_MAP = {
  '穿越群山的风': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  '里斯本秋日航拍': 'https://www.w3schools.com/html/mov_bbb.mp4',
  '溪流旁公路': 'https://www.w3schools.com/html/movie.mp4',
  '代码与咖啡因': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  '黑胶夜听': 'https://www.w3schools.com/html/mov_bbb.mp4',
  '无人机视角：城市道路': 'https://www.w3schools.com/html/movie.mp4',
  '都市夜航计划': 'https://www.w3schools.com/html/mov_bbb.mp4',
  '海岸线 27 公里': 'https://www.w3schools.com/html/movie.mp4',
  '午夜爵士现场': 'https://www.w3schools.com/html/mov_bbb.mp4',
  '无人机视角：天际线': 'https://www.w3schools.com/html/movie.mp4'
};

const seedVideos = [
  {
    id: 1,
    title: '穿越群山的风',
    category: '纪录',
    duration: '00:34',
    year: 2026,
    tags: ['自然', '山丘', '星空'],
    cover: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['穿越群山的风'],
    description: '镜头穿过山丘与夜空，云层与银河在山脊上缓慢流动。',
    ownerId: 'system',
    ownerName: '系统'
  },
  {
    id: 2,
    title: '里斯本秋日航拍',
    category: '城市',
    duration: '00:38',
    year: 2026,
    tags: ['城市', '航拍', '街景'],
    cover: 'https://images.unsplash.com/photo-1496564203457-11bb12075d90?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['里斯本秋日航拍'],
    description: '秋日光线下的城市航拍镜头，街区与屋顶层次清晰。',
    ownerId: 'system',
    ownerName: '系统'
  },
  {
    id: 3,
    title: '溪流旁公路',
    category: '旅行',
    duration: '00:22',
    year: 2026,
    tags: ['公路', '旅行', '自然'],
    cover: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['溪流旁公路'],
    description: '镜头沿溪流旁道路推进，展现山谷公路的短程掠影。',
    ownerId: 'system',
    ownerName: '系统'
  },
  {
    id: 4,
    title: '代码与咖啡因',
    category: '科技',
    duration: '00:25',
    year: 2026,
    tags: ['咖啡', '工作流', '专注'],
    cover: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['代码与咖啡因'],
    description: '从研磨到冲煮的完整过程，呈现高强度工作前的仪式感。',
    ownerId: 'system',
    ownerName: '系统'
  },
  {
    id: 5,
    title: '黑胶夜听',
    category: '音乐',
    duration: '00:22',
    year: 2025,
    tags: ['音乐', '黑胶', '夜晚'],
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['黑胶夜听'],
    description: '耳机与黑胶唱片的近景切换，适合夜间安静聆听场景。',
    ownerId: 'system',
    ownerName: '系统'
  },
  {
    id: 6,
    title: '无人机视角：城市道路',
    category: '短片',
    duration: '00:31',
    year: 2026,
    tags: ['航拍', '道路', '城市'],
    cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    src: PLAYABLE_SOURCE_MAP['无人机视角：城市道路'],
    description: '高空镜头俯瞰主干道与路网，强调城市道路纹理与节奏。',
    ownerId: 'system',
    ownerName: '系统'
  }
];
const SYSTEM_VIDEO_CANONICAL_BY_ID = new Map(seedVideos.map((video) => [Number(video.id), video]));
const SYSTEM_VIDEO_CANONICAL_BY_TITLE = new Map(seedVideos.map((video) => [video.title, video]));
const SYSTEM_VIDEO_CANONICAL_BY_SOURCE = new Map(seedVideos.map((video) => [video.src, video]));
const LEGACY_SEED_TITLE_SET = new Set([
  '都市夜航计划',
  '海岸线 27 公里',
  '午夜爵士现场',
  '无人机视角：天际线'
]);

const dom = {
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  playFeaturedBtn: document.getElementById('playFeaturedBtn'),
  categoryFilters: document.getElementById('categoryFilters'),
  favoriteToggleBtn: document.getElementById('favoriteToggleBtn'),
  ownerToggleBtn: document.getElementById('ownerToggleBtn'),
  sortSelect: document.getElementById('sortSelect'),
  videoGrid: document.getElementById('videoGrid'),
  resultCount: document.getElementById('resultCount'),
  activeFilterSummary: document.getElementById('activeFilterSummary'),
  clearFiltersBtn: document.getElementById('clearFiltersBtn'),
  libraryStatus: document.getElementById('libraryStatus'),
  continueSection: document.getElementById('continueSection'),
  continueMeta: document.getElementById('continueMeta'),
  continueGrid: document.getElementById('continueGrid'),
  clearContinueCompletedBtn: document.getElementById('clearContinueCompletedBtn'),
  clearContinueBtn: document.getElementById('clearContinueBtn'),
  favoriteSection: document.getElementById('favoriteSection'),
  favoriteMeta: document.getElementById('favoriteMeta'),
  favoriteGrid: document.getElementById('favoriteGrid'),
  favoriteSortSelect: document.getElementById('favoriteSortSelect'),
  heroTitle: document.getElementById('heroTitle'),
  heroDescription: document.getElementById('heroDescription'),
  heroCategory: document.getElementById('heroCategory'),
  heroDuration: document.getElementById('heroDuration'),
  heroYear: document.getElementById('heroYear'),
  heroCover: document.getElementById('heroCover'),
  siteNoticeBanner: document.getElementById('siteNoticeBanner'),
  siteNoticeText: document.getElementById('siteNoticeText'),

  playerModal: document.getElementById('playerModal'),
  closePlayerModal: document.getElementById('closePlayerModal'),
  videoPlayer: document.getElementById('videoPlayer'),
  modalTitle: document.getElementById('modalTitle'),
  modalDescription: document.getElementById('modalDescription'),
  rewindBtn: document.getElementById('rewindBtn'),
  forwardBtn: document.getElementById('forwardBtn'),
  muteBtn: document.getElementById('muteBtn'),
  speedSelect: document.getElementById('speedSelect'),
  autoNextToggle: document.getElementById('autoNextToggle'),
  shareCurrentVideoBtn: document.getElementById('shareCurrentVideoBtn'),
  pipBtn: document.getElementById('pipBtn'),
  downloadVideoBtn: document.getElementById('downloadVideoBtn'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),
  resumeBar: document.getElementById('resumeBar'),
  resumeText: document.getElementById('resumeText'),
  resumePlayBtn: document.getElementById('resumePlayBtn'),
  resumeRestartBtn: document.getElementById('resumeRestartBtn'),
  nextUpBar: document.getElementById('nextUpBar'),
  nextUpText: document.getElementById('nextUpText'),
  playNextBtn: document.getElementById('playNextBtn'),
  playerStatus: document.getElementById('playerStatus'),
  relatedSection: document.getElementById('relatedSection'),
  relatedList: document.getElementById('relatedList'),

  openAuthBtn: document.getElementById('openAuthBtn'),
  adminPageLink: document.getElementById('adminPageLink'),
  openAccountBtn: document.getElementById('openAccountBtn'),
  userBar: document.getElementById('userBar'),
  currentUserText: document.getElementById('currentUserText'),
  currentUserAvatar: document.getElementById('currentUserAvatar'),
  logoutBtn: document.getElementById('logoutBtn'),

  authModal: document.getElementById('authModal'),
  closeAuthModal: document.getElementById('closeAuthModal'),
  authTitle: document.getElementById('authTitle'),
  authSubtext: document.getElementById('authSubtext'),
  loginTabBtn: document.getElementById('loginTabBtn'),
  registerTabBtn: document.getElementById('registerTabBtn'),
  authForm: document.getElementById('authForm'),
  authUsername: document.getElementById('authUsername'),
  authPassword: document.getElementById('authPassword'),
  authPasswordToggle: document.getElementById('authPasswordToggle'),
  authConfirmRow: document.getElementById('authConfirmRow'),
  authConfirmPassword: document.getElementById('authConfirmPassword'),
  authRule: document.getElementById('authRule'),
  authSubmitBtn: document.getElementById('authSubmitBtn'),
  authHint: document.getElementById('authHint'),

  accountModal: document.getElementById('accountModal'),
  closeAccountModal: document.getElementById('closeAccountModal'),
  editVideoModal: document.getElementById('editVideoModal'),
  closeEditVideoModal: document.getElementById('closeEditVideoModal'),
  editVideoForm: document.getElementById('editVideoForm'),
  editVideoTitle: document.getElementById('editVideoTitle'),
  editVideoCategory: document.getElementById('editVideoCategory'),
  editVideoDuration: document.getElementById('editVideoDuration'),
  editVideoPublishedAt: document.getElementById('editVideoPublishedAt'),
  editVideoTags: document.getElementById('editVideoTags'),
  editVideoDescription: document.getElementById('editVideoDescription'),
  editVideoStatus: document.getElementById('editVideoStatus'),

  creatorSection: document.getElementById('creatorSection'),
  creatorHint: document.getElementById('creatorHint'),
  uploadPolicyHint: document.getElementById('uploadPolicyHint'),
  uploadForm: document.getElementById('uploadForm'),
  uploadTitle: document.getElementById('uploadTitle'),
  uploadCategory: document.getElementById('uploadCategory'),
  uploadDuration: document.getElementById('uploadDuration'),
  uploadPublishedAt: document.getElementById('uploadPublishedAt'),
  uploadDescription: document.getElementById('uploadDescription'),
  uploadVideoDropzone: document.getElementById('uploadVideoDropzone'),
  uploadVideoFile: document.getElementById('uploadVideoFile'),
  clearUploadVideoFileBtn: document.getElementById('clearUploadVideoFileBtn'),
  uploadVideoFileMeta: document.getElementById('uploadVideoFileMeta'),
  uploadCoverDropzone: document.getElementById('uploadCoverDropzone'),
  uploadCoverFile: document.getElementById('uploadCoverFile'),
  clearUploadCoverFileBtn: document.getElementById('clearUploadCoverFileBtn'),
  uploadCoverFileMeta: document.getElementById('uploadCoverFileMeta'),
  uploadCoverPreview: document.getElementById('uploadCoverPreview'),
  uploadStatus: document.getElementById('uploadStatus'),
  accountForm: document.getElementById('accountForm'),
  accountUsername: document.getElementById('accountUsername'),
  accountAvatarDropzone: document.getElementById('accountAvatarDropzone'),
  accountAvatarFile: document.getElementById('accountAvatarFile'),
  clearAccountAvatarBtn: document.getElementById('clearAccountAvatarBtn'),
  accountAvatarMeta: document.getElementById('accountAvatarMeta'),
  accountBirthDate: document.getElementById('accountBirthDate'),
  accountGender: document.getElementById('accountGender'),
  accountAge: document.getElementById('accountAge'),
  accountAvatarPreview: document.getElementById('accountAvatarPreview'),
  accountStatus: document.getElementById('accountStatus'),
  passwordSection: document.getElementById('passwordSection'),
  passwordForm: document.getElementById('passwordForm'),
  passwordHint: document.getElementById('passwordHint'),
  passwordCurrentPassword: document.getElementById('passwordCurrentPassword'),
  passwordNewPassword: document.getElementById('passwordNewPassword'),
  passwordConfirmPassword: document.getElementById('passwordConfirmPassword'),
  passwordStatus: document.getElementById('passwordStatus'),
  profileSection: document.getElementById('profileSection'),
  profileMeta: document.getElementById('profileMeta'),
  profileStatus: document.getElementById('profileStatus'),
  profileVideoGrid: document.getElementById('profileVideoGrid'),
  profileHistorySection: document.getElementById('profileHistorySection'),
  profileHistoryMeta: document.getElementById('profileHistoryMeta'),
  profileHistoryGrid: document.getElementById('profileHistoryGrid'),

  adminSection: document.getElementById('adminSection'),
  adminAccessHint: document.getElementById('adminAccessHint'),
  adminStats: document.getElementById('adminStats'),
  reviewRows: document.getElementById('reviewRows'),
  adminVideoRows: document.getElementById('adminVideoRows'),
  adminUserRows: document.getElementById('adminUserRows'),
  requireApprovalToggle: document.getElementById('requireApprovalToggle'),
  approvalSummary: document.getElementById('approvalSummary'),
  siteNoticeInput: document.getElementById('siteNoticeInput'),
  reviewMeta: document.getElementById('reviewMeta'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  settingsStatus: document.getElementById('settingsStatus')
};
const IS_UPLOAD_PAGE = Boolean(document.body?.classList.contains('page-upload'));
const IS_ADMIN_PAGE = Boolean(document.body?.classList.contains('page-admin'));
const IS_PROFILE_PAGE = Boolean(document.body?.classList.contains('page-profile'));
const IS_PASSWORD_PAGE = Boolean(document.body?.classList.contains('page-password'));
const IS_HOME_PAGE = Boolean(document.body?.classList.contains('page-home'));

const state = {
  users: [],
  videos: [],
  currentUser: null,
  search: '',
  category: '全部',
  sortBy: 'latest',
  featuredId: null,
  authMode: 'login',
  playbackHistory: {},
  favoritesByUser: {},
  favoriteOnly: false,
  ownerOnly: false,
  pendingSharedVideoId: null,
  favoriteSortBy: 'recent',
  playerPrefs: {
    rate: 1,
    volume: 1,
    muted: false,
    autoNext: false
  },
  currentPlayingVideoId: null,
  nextUpVideoId: null,
  playbackFallbackTried: false,
  relatedVideoIds: [],
  preloadVideoEl: null,
  pendingResumeTime: 0,
  playerStatusTimer: null,
  lastProgressWriteAt: 0,
  hoverPreviewTimer: null,
  hoverPreviewCardId: null,
  hoverPreviewVideoEl: null,
  siteSettings: {
    requireApproval: true,
    siteNotice: ''
  },
  authSecurity: {
    failedByUsername: {},
    lockUntilByUsername: {}
  },
  authSession: {
    expiresAt: 0
  },
  accountAvatarDraft: '',
  uploadCoverPreviewUrl: '',
  editingVideoId: null
};
let appDbPromise = null;
let videoPersistQueue = Promise.resolve(true);
let userIdSequence = 0;

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hasWebCryptoSupport() {
  return Boolean(window.crypto?.subtle && window.crypto?.getRandomValues);
}

function byteArrayToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToByteArray(value) {
  const binary = atob(String(value || ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function secureEquals(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function sanitizeSingleLineText(value, maxLength = 120) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function generateUserId() {
  const timestamp = Date.now().toString(36);
  userIdSequence = (userIdSequence + 1) % Number.MAX_SAFE_INTEGER;
  const sequencePart = userIdSequence.toString(36);
  if (window.crypto?.getRandomValues) {
    const randomBytes = new Uint8Array(6);
    window.crypto.getRandomValues(randomBytes);
    const randomPart = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return `u_${timestamp}_${sequencePart}_${randomPart}`;
  }
  const fallbackRandom = Math.random().toString(36).slice(2, 12);
  return `u_${timestamp}_${sequencePart}_${fallbackRandom}`;
}

function normalizeUserId(value) {
  const raw = sanitizeSingleLineText(value, 64);
  if (/^[a-zA-Z0-9_-]{2,64}$/.test(raw)) {
    return raw;
  }
  return generateUserId();
}

function normalizeSafeUrl(rawValue, options = {}) {
  const raw = String(rawValue || '').trim();
  if (!raw) return '';
  const allowDataImage = options.allowDataImage === true;
  const allowDataVideo = options.allowDataVideo === true;
  const allowBlob = options.allowBlob === true;
  if (allowDataImage && /^data:image\/[a-z0-9.+-]+;base64,/i.test(raw)) return raw;
  if (allowDataVideo && /^data:video\/[a-z0-9.+-]+;base64,/i.test(raw)) return raw;
  if (allowBlob && raw.startsWith('blob:')) return raw;
  try {
    const parsed = new URL(raw, window.location.href);
    if (!SAFE_HTTP_PROTOCOLS.has(parsed.protocol)) return '';
    return parsed.href;
  } catch (_error) {
    return '';
  }
}

function normalizeSafeImageUrl(rawValue) {
  return normalizeSafeUrl(rawValue, { allowDataImage: true });
}

function normalizeSafeAvatarUrl(rawValue) {
  return normalizeSafeImageUrl(rawValue);
}

function normalizeSafeMediaUrl(rawValue) {
  return normalizeSafeUrl(rawValue, { allowDataVideo: true, allowBlob: true });
}

function hasPasswordCredential(user) {
  return Boolean(
    user
    && typeof user.passwordHash === 'string'
    && user.passwordHash.length >= 32
    && typeof user.passwordSalt === 'string'
    && user.passwordSalt.length >= 8
    && Number.isFinite(Number(user.passwordIterations))
    && Number(user.passwordIterations) >= 10000
  );
}

async function derivePasswordHash(password, saltBase64, iterations = PASSWORD_HASH_ITERATIONS) {
  if (!hasWebCryptoSupport()) return '';
  const safePassword = String(password || '');
  const safeSalt = String(saltBase64 || '');
  if (!safePassword || !safeSalt) return '';
  try {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(safePassword),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: base64ToByteArray(safeSalt),
        iterations: Number(iterations) || PASSWORD_HASH_ITERATIONS
      },
      keyMaterial,
      256
    );
    return arrayBufferToHex(bits);
  } catch (_error) {
    return '';
  }
}

async function createPasswordCredential(password) {
  const safePassword = String(password || '').trim();
  if (!safePassword) return null;
  if (!hasWebCryptoSupport()) return null;
  const saltBytes = new Uint8Array(PASSWORD_SALT_BYTE_SIZE);
  window.crypto.getRandomValues(saltBytes);
  const saltBase64 = byteArrayToBase64(saltBytes);
  const hash = await derivePasswordHash(safePassword, saltBase64, PASSWORD_HASH_ITERATIONS);
  if (!hash) return null;
  return {
    passwordHash: hash,
    passwordSalt: saltBase64,
    passwordIterations: PASSWORD_HASH_ITERATIONS,
    passwordAlgo: PASSWORD_HASH_ALGO
  };
}

function applyPasswordCredentialToUser(user, credential) {
  if (!user || !credential) return false;
  user.passwordHash = String(credential.passwordHash || '');
  user.passwordSalt = String(credential.passwordSalt || '');
  user.passwordIterations = Number(credential.passwordIterations) || PASSWORD_HASH_ITERATIONS;
  user.passwordAlgo = String(credential.passwordAlgo || PASSWORD_HASH_ALGO);
  user.password = '';
  return true;
}

async function ensureUserPasswordCredential(user, fallbackPassword = '') {
  if (!user) return false;
  if (hasPasswordCredential(user)) {
    user.password = '';
    return false;
  }
  const plainPassword = String(user.password || fallbackPassword || '').trim();
  if (plainPassword.length < 6) return false;
  const credential = await createPasswordCredential(plainPassword);
  if (!credential) return false;
  return applyPasswordCredentialToUser(user, credential);
}

async function verifyUserPassword(user, candidatePassword) {
  if (!user) return false;
  const candidate = String(candidatePassword || '').trim();
  if (!candidate) return false;

  if (hasPasswordCredential(user)) {
    const computed = await derivePasswordHash(candidate, user.passwordSalt, user.passwordIterations);
    if (!computed) return false;
    return secureEquals(computed, user.passwordHash);
  }

  const matched = secureEquals(String(user.password || ''), candidate);
  if (!matched) return false;
  const credential = await createPasswordCredential(candidate);
  if (credential) {
    applyPasswordCredentialToUser(user, credential);
    persistUsers();
  }
  return true;
}

function normalizeAuthSession(rawSession) {
  if (!rawSession || typeof rawSession !== 'object') {
    return { expiresAt: 0 };
  }
  const expiresAt = Number(rawSession.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
    return { expiresAt: 0 };
  }
  return { expiresAt };
}

function bootstrapAuthSession() {
  state.authSession = normalizeAuthSession(readStorage(STORAGE_KEYS.authSession, {}));
}

function persistAuthSession() {
  writeStorage(STORAGE_KEYS.authSession, state.authSession);
}

function startAuthSession() {
  state.authSession = { expiresAt: Date.now() + AUTH_SESSION_DURATION_MS };
  persistAuthSession();
}

function clearAuthSession() {
  state.authSession = { expiresAt: 0 };
  persistAuthSession();
}

function isAuthSessionExpired() {
  return Number(state.authSession?.expiresAt || 0) > 0 && Number(state.authSession.expiresAt) <= Date.now();
}

function refreshAuthSessionIfNeeded(force = false) {
  if (!state.currentUser) return;
  const expiresAt = Number(state.authSession?.expiresAt || 0);
  const remainingMs = expiresAt - Date.now();
  if (force || remainingMs <= AUTH_SESSION_DURATION_MS / 3) {
    startAuthSession();
  }
}

function hasIndexedDb() {
  return typeof indexedDB !== 'undefined';
}

function openAppDb() {
  if (!hasIndexedDb()) return Promise.resolve(null);
  if (appDbPromise) return appDbPromise;
  appDbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(APP_IDB_NAME, APP_IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(APP_IDB_STORE)) {
          db.createObjectStore(APP_IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch (_error) {
      resolve(null);
    }
  });
  return appDbPromise;
}

async function idbReadValue(key) {
  const db = await openAppDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(APP_IDB_STORE, 'readonly');
      const store = tx.objectStore(APP_IDB_STORE);
      const request = store.get(String(key));
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => resolve(null);
    } catch (_error) {
      resolve(null);
    }
  });
}

async function idbWriteValue(key, value) {
  const db = await openAppDb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(APP_IDB_STORE, 'readwrite');
      const store = tx.objectStore(APP_IDB_STORE);
      const request = store.put(value, String(key));
      let settled = false;
      let writeRequestSucceeded = false;
      const settle = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };
      request.onsuccess = () => {
        writeRequestSucceeded = true;
      };
      request.onerror = () => settle(false);
      tx.oncomplete = () => settle(writeRequestSucceeded);
      tx.onabort = () => settle(false);
      tx.onerror = () => settle(false);
    } catch (_error) {
      resolve(false);
    }
  });
}

async function readVideosStorage() {
  const idbVideos = await idbReadValue(STORAGE_KEYS.videos);
  if (Array.isArray(idbVideos)) {
    return idbVideos;
  }
  const legacyVideos = readStorage(STORAGE_KEYS.videos, []);
  if (Array.isArray(legacyVideos) && legacyVideos.length > 0) {
    idbWriteValue(STORAGE_KEYS.videos, legacyVideos).then((saved) => {
      if (saved) {
        try {
          localStorage.removeItem(STORAGE_KEYS.videos);
        } catch (_error) {
          // Ignore cleanup failures.
        }
      }
    });
    return legacyVideos;
  }
  return [];
}

async function persistVideosStorage(videos) {
  const savedToIdb = await idbWriteValue(STORAGE_KEYS.videos, videos);
  if (savedToIdb) {
    try {
      localStorage.removeItem(STORAGE_KEYS.videos);
    } catch (_error) {
      // Ignore cleanup failures.
    }
    return true;
  }
  try {
    writeStorage(STORAGE_KEYS.videos, videos);
    return true;
  } catch (_error) {
    return false;
  }
}

async function requestPersistentStorage() {
  if (!navigator?.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch (_error) {
    return false;
  }
}

function normalizeUploadDraft(rawDraft) {
  if (!rawDraft || typeof rawDraft !== 'object') return null;
  const publishedAtRaw = String(rawDraft.publishedAt || '').trim();
  const publishedAt = Number.isFinite(Date.parse(publishedAtRaw)) ? publishedAtRaw.slice(0, 16) : '';
  return {
    title: String(rawDraft.title || '').trim().slice(0, 60),
    category: String(rawDraft.category || '').trim().slice(0, 20),
    duration: String(rawDraft.duration || '').trim().slice(0, 10),
    publishedAt,
    description: String(rawDraft.description || '').trim().slice(0, 220)
  };
}

function canUseUploadForm() {
  return Boolean(
    dom.uploadForm
    && dom.uploadTitle
    && dom.uploadCategory
    && dom.uploadDuration
    && dom.uploadPublishedAt
    && dom.uploadDescription
    && dom.uploadVideoFile
    && dom.uploadCoverFile
    && dom.uploadStatus
  );
}

function getUploadDraftFromForm() {
  if (!canUseUploadForm()) {
    return {
      title: '',
      category: '',
      duration: '',
      publishedAt: '',
      description: ''
    };
  }
  return {
    title: dom.uploadTitle.value.trim(),
    category: dom.uploadCategory.value.trim(),
    duration: dom.uploadDuration.value.trim(),
    publishedAt: String(dom.uploadPublishedAt.value || '').trim(),
    description: dom.uploadDescription.value.trim()
  };
}

function hasUploadDraftContent(draft) {
  if (!draft) return false;
  return [draft.title, draft.category, draft.duration, draft.publishedAt, draft.description].some(Boolean);
}

function persistUploadDraft() {
  if (!canUseUploadForm()) return;
  const draft = normalizeUploadDraft(getUploadDraftFromForm());
  writeStorage(STORAGE_KEYS.uploadDraft, draft);
}

function clearUploadDraft() {
  writeStorage(STORAGE_KEYS.uploadDraft, null);
}

function applyUploadDraftToForm(draft) {
  if (!canUseUploadForm()) return;
  if (!draft) return;
  dom.uploadTitle.value = draft.title;
  dom.uploadCategory.value = draft.category;
  dom.uploadDuration.value = draft.duration;
  dom.uploadPublishedAt.value = draft.publishedAt;
  dom.uploadDescription.value = draft.description;
}

function bootstrapUploadDraft() {
  if (!canUseUploadForm()) return;
  const draft = normalizeUploadDraft(readStorage(STORAGE_KEYS.uploadDraft, null));
  if (!draft || !hasUploadDraftContent(draft)) {
    ensureUploadPublishedAtValue();
    refreshUploadFileIndicators();
    return;
  }
  applyUploadDraftToForm(draft);
  ensureUploadPublishedAtValue();
  setMessage(dom.uploadStatus, '已恢复上次填写的信息（本地视频/封面文件需重新选择）。');
  refreshUploadFileIndicators();
}

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || unitIndex === 0 ? Math.round(value) : Number(value.toFixed(1));
  return `${rounded} ${units[unitIndex]}`;
}

function fileMatchesAccept(file, accept) {
  if (!file) return false;
  const acceptList = String(accept || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!acceptList.length) return true;

  const fileType = String(file.type || '').toLowerCase();
  const fileName = String(file.name || '').toLowerCase();
  const fileNameHasAnyExtension = (extensions) => {
    const list = Array.isArray(extensions) ? extensions : [];
    return list.some((ext) => fileName.endsWith(ext));
  };

  return acceptList.some((rule) => {
    if (rule.endsWith('/*')) {
      const prefix = rule.slice(0, -1);
      if (fileType.startsWith(prefix)) return true;
      if (fileType) return false;
      return fileNameHasAnyExtension(ACCEPT_WILDCARD_EXTENSION_MAP[prefix] || []);
    }
    if (rule.startsWith('.')) {
      return fileName.endsWith(rule);
    }
    return fileType === rule;
  });
}

function pickFirstAcceptedFile(files, accept) {
  const list = Array.isArray(files) ? files : [];
  return list.find((file) => fileMatchesAccept(file, accept)) || null;
}

function revokeUploadCoverPreviewUrl() {
  if (!state.uploadCoverPreviewUrl) return;
  URL.revokeObjectURL(state.uploadCoverPreviewUrl);
  state.uploadCoverPreviewUrl = '';
}

function updateUploadCoverPreview(file) {
  if (!dom.uploadCoverPreview) return;
  revokeUploadCoverPreviewUrl();
  if (!(file instanceof File) || !String(file.type || '').toLowerCase().startsWith('image/')) {
    dom.uploadCoverPreview.classList.add('hidden');
    dom.uploadCoverPreview.removeAttribute('src');
    return;
  }
  const objectUrl = URL.createObjectURL(file);
  state.uploadCoverPreviewUrl = objectUrl;
  dom.uploadCoverPreview.src = objectUrl;
  dom.uploadCoverPreview.classList.remove('hidden');
}

function updateUploadFileMeta(inputEl, metaEl, emptyText) {
  if (!metaEl) return;
  const file = inputEl?.files?.[0];
  if (!file) {
    metaEl.textContent = emptyText;
    metaEl.classList.remove('has-file');
    return;
  }
  metaEl.textContent = `已选择：${file.name}（${formatFileSize(file.size)}）`;
  metaEl.classList.add('has-file');
}

function toggleUploadClearButton(inputEl, clearBtnEl) {
  if (!clearBtnEl) return;
  const hasFile = Boolean(inputEl?.files?.length);
  clearBtnEl.classList.toggle('hidden', !hasFile);
}

function validateUploadInputFile(inputEl, options = {}) {
  if (!inputEl) return null;
  const file = inputEl.files?.[0];
  if (!file) return null;

  if (!fileMatchesAccept(file, inputEl.accept)) {
    inputEl.value = '';
    if (options.rejectMessage) {
      setMessage(dom.uploadStatus, options.rejectMessage, true);
    }
    return null;
  }

  if (Number.isFinite(options.maxSize) && file.size > options.maxSize) {
    inputEl.value = '';
    if (options.oversizeMessage) {
      setMessage(dom.uploadStatus, options.oversizeMessage, true);
    }
    return null;
  }
  return file;
}

function refreshUploadFileIndicators() {
  if (!canUseUploadForm()) return;
  updateUploadFileMeta(dom.uploadVideoFile, dom.uploadVideoFileMeta, '未选择视频文件');
  updateUploadFileMeta(dom.uploadCoverFile, dom.uploadCoverFileMeta, '未选择封面文件');
  toggleUploadClearButton(dom.uploadVideoFile, dom.clearUploadVideoFileBtn);
  toggleUploadClearButton(dom.uploadCoverFile, dom.clearUploadCoverFileBtn);
  updateUploadCoverPreview(dom.uploadCoverFile?.files?.[0] || null);
}

function applyFileToInput(inputEl, file) {
  if (!inputEl || !(file instanceof File)) return false;
  try {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputEl.files = transfer.files;
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  } catch (_error) {
    return false;
  }
}

function bindUploadDropzone(dropzone, inputEl, options = {}) {
  if (!dropzone || !inputEl) return;
  const statusElement = options.statusElement || dom.uploadStatus;
  const setActive = (active) => {
    dropzone.classList.toggle('is-dragover', active);
  };
  const clearDragState = () => {
    setActive(false);
  };
  const triggerFileDialog = () => {
    if (inputEl.disabled) return;
    inputEl.click();
  };

  dropzone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    setActive(true);
  });

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    setActive(true);
  });

  dropzone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    if (event.relatedTarget instanceof Node && dropzone.contains(event.relatedTarget)) return;
    clearDragState();
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    clearDragState();
    const files = Array.from(event.dataTransfer?.files || []);
    const picked = pickFirstAcceptedFile(files, inputEl.accept);
    if (!picked) {
      setMessage(statusElement, options.rejectMessage || '拖入文件类型不支持。', true);
      return;
    }
    const success = applyFileToInput(inputEl, picked);
    if (!success) {
      setMessage(statusElement, '拖入失败，请点击选择文件重试。', true);
      return;
    }
    if (options.successMessage) {
      setMessage(statusElement, options.successMessage);
    }
  });

  dropzone.addEventListener('click', (event) => {
    if (event.target === inputEl || event.target.closest('.dropzone-clear')) return;
    triggerFileDialog();
  });

  dropzone.addEventListener('keydown', (event) => {
    if (event.target !== dropzone) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    triggerFileDialog();
  });

  document.addEventListener('dragend', clearDragState, true);
  document.addEventListener('drop', clearDragState, true);
  window.addEventListener('blur', clearDragState);
}

function clearUploadInputFile(inputEl) {
  if (!inputEl || !inputEl.files?.length) return;
  inputEl.value = '';
  inputEl.dispatchEvent(new Event('change', { bubbles: true }));
}

function bindUploadDropGuards() {
  if (!IS_UPLOAD_PAGE) return;
  const dropTargets = [dom.uploadVideoDropzone, dom.uploadCoverDropzone, dom.accountAvatarDropzone].filter(Boolean);
  if (!dropTargets.length) return;

  const isWithinDropzone = (target) => target instanceof Node
    && dropTargets.some((zone) => zone === target || zone.contains(target));

  document.addEventListener('dragover', (event) => {
    if (isWithinDropzone(event.target)) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none';
    }
  });

  document.addEventListener('drop', (event) => {
    if (isWithinDropzone(event.target)) return;
    event.preventDefault();
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;'
    };
    return map[char];
  });
}

function buildVideoSearchText(video) {
  return [video.title, video.category, video.description, Array.isArray(video.tags) ? video.tags.join(' ') : '']
    .join(' ')
    .toLowerCase();
}

function debounce(fn, waitMs = 160) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, waitMs);
  };
}

function normalizeGender(value) {
  const gender = String(value || '').trim().toLowerCase();
  return ['male', 'female', 'other', 'secret'].includes(gender) ? gender : 'secret';
}

function normalizeBirthDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return '';
  const date = new Date(parsed);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const normalized = `${year}-${month}-${day}`;
  return normalized > toDateStringLocal(Date.now()) ? '' : normalized;
}

function toDateStringLocal(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calcAgeFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const parsed = Date.parse(`${birthDate}T00:00:00`);
  if (!Number.isFinite(parsed)) return null;
  const birth = new Date(parsed);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (now < birthdayThisYear) {
    age -= 1;
  }
  if (!Number.isFinite(age) || age < 0 || age > 120) return null;
  return age;
}

function normalizeAge(value, fallbackBirthDate = '') {
  if (value === '' || value === null || value === undefined) {
    return calcAgeFromBirthDate(fallbackBirthDate);
  }
  const age = Number(value);
  if (!Number.isFinite(age)) return calcAgeFromBirthDate(fallbackBirthDate);
  const safe = Math.floor(age);
  if (safe < 0 || safe > 120) return calcAgeFromBirthDate(fallbackBirthDate);
  return safe;
}

function normalizeUser(user) {
  const role = ['super_admin', 'admin', 'user'].includes(user.role) ? user.role : 'user';
  const username = sanitizeSingleLineText(user.username, 20);
  const birthDate = normalizeBirthDate(user.birthDate);
  const age = normalizeAge(user.age, birthDate);
  const password = String(user.password || '').trim();
  const passwordHash = String(user.passwordHash || '').trim().toLowerCase();
  const passwordSalt = String(user.passwordSalt || '').trim();
  const passwordIterations = Number(user.passwordIterations);
  return {
    ...user,
    id: normalizeUserId(user.id),
    username,
    password,
    passwordHash,
    passwordSalt,
    passwordIterations: Number.isFinite(passwordIterations) ? Math.max(10000, Math.floor(passwordIterations)) : PASSWORD_HASH_ITERATIONS,
    passwordAlgo: String(user.passwordAlgo || PASSWORD_HASH_ALGO),
    avatar: normalizeSafeAvatarUrl(user.avatar),
    birthDate,
    gender: normalizeGender(user.gender),
    age,
    role,
    blacklisted: role === 'super_admin' ? false : Boolean(user.blacklisted),
    createdAt: Number(user.createdAt) || Date.now()
  };
}

function isPasswordStrong(password) {
  const raw = String(password || '');
  return raw.length >= 8 && /[a-zA-Z]/.test(raw) && /\d/.test(raw);
}

function passwordRuleText() {
  return '密码至少 8 位，且需包含字母和数字。';
}

function authPasswordRuleHintText() {
  return `密码规则：${passwordRuleText()}`;
}

function normalizeUsernameKey(username) {
  return sanitizeSingleLineText(username, 20).toLowerCase();
}

function getLoginLockRemainingMs(username) {
  const key = normalizeUsernameKey(username);
  if (!key) return 0;
  const lockUntil = Number(state.authSecurity.lockUntilByUsername[key] || 0);
  return Math.max(0, lockUntil - Date.now());
}

function clearLoginSecurityState(username) {
  const key = normalizeUsernameKey(username);
  if (!key) return;
  delete state.authSecurity.failedByUsername[key];
  delete state.authSecurity.lockUntilByUsername[key];
}

function recordLoginFailure(username) {
  const key = normalizeUsernameKey(username);
  if (!key) {
    return {
      locked: false,
      remainingAttempts: LOGIN_FAILURE_LIMIT
    };
  }

  const now = Date.now();
  const currentLockUntil = Number(state.authSecurity.lockUntilByUsername[key] || 0);
  if (currentLockUntil > now) {
    return {
      locked: true,
      lockSeconds: Math.ceil((currentLockUntil - now) / 1000),
      remainingAttempts: 0
    };
  }

  const nextFailCount = Number(state.authSecurity.failedByUsername[key] || 0) + 1;
  if (nextFailCount >= LOGIN_FAILURE_LIMIT) {
    state.authSecurity.failedByUsername[key] = 0;
    state.authSecurity.lockUntilByUsername[key] = now + LOGIN_LOCK_DURATION_MS;
    return {
      locked: true,
      lockSeconds: Math.ceil(LOGIN_LOCK_DURATION_MS / 1000),
      remainingAttempts: 0
    };
  }

  state.authSecurity.failedByUsername[key] = nextFailCount;
  return {
    locked: false,
    remainingAttempts: LOGIN_FAILURE_LIMIT - nextFailCount
  };
}

function buildUserStateFromRaw(rawUsers) {
  const normalizedUsers = Array.isArray(rawUsers)
    ? rawUsers
      .map(normalizeUser)
      .filter((user) => user.username.length >= 3)
    : [];

  const existingRoot = normalizedUsers.find((user) => (
    user.id === ROOT_ADMIN_PROFILE.id || user.username.trim().toLowerCase() === ROOT_ADMIN_PROFILE.username.toLowerCase()
  ));

  const rootAdmin = normalizeUser({
    ...ROOT_ADMIN_PROFILE,
    password: existingRoot?.password || ROOT_ADMIN_PROFILE.password,
    passwordHash: existingRoot?.passwordHash || '',
    passwordSalt: existingRoot?.passwordSalt || '',
    passwordIterations: existingRoot?.passwordIterations || PASSWORD_HASH_ITERATIONS,
    passwordAlgo: existingRoot?.passwordAlgo || PASSWORD_HASH_ALGO,
    blacklisted: false,
    createdAt: existingRoot?.createdAt || Date.now()
  });

  const usersWithoutRoot = normalizedUsers.filter((user) => (
    user.id !== ROOT_ADMIN_PROFILE.id && user.username.trim().toLowerCase() !== ROOT_ADMIN_PROFILE.username.toLowerCase()
  ));

  const uniqueUsers = [];
  const userIdSet = new Set([rootAdmin.id]);
  const usernameSet = new Set();
  usersWithoutRoot.forEach((user) => {
    const key = user.username.trim().toLowerCase();
    if (usernameSet.has(key)) return;
    usernameSet.add(key);
    let uniqueId = String(user.id || '');
    if (!uniqueId || userIdSet.has(uniqueId)) {
      do {
        uniqueId = generateUserId();
      } while (userIdSet.has(uniqueId));
    }
    user.id = uniqueId;
    userIdSet.add(uniqueId);
    uniqueUsers.push(user);
  });

  return [rootAdmin, ...uniqueUsers];
}

function bootstrapUsers() {
  const storedUsers = readStorage(STORAGE_KEYS.users, []);
  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    state.users = buildUserStateFromRaw(storedUsers);
    persistUsers();
    return;
  }
  state.users = buildUserStateFromRaw([]);
  persistUsers();
}

async function hardenUsersPasswordStorage() {
  let changed = false;
  for (const user of state.users) {
    const fallbackPassword = isSuperAdmin(user) ? ROOT_ADMIN_PROFILE.password : '';
    const hardened = await ensureUserPasswordCredential(user, fallbackPassword);
    if (hardened) {
      changed = true;
    }
  }
  if (changed) {
    persistUsers();
  }
}

function normalizePublishedAt(rawValue, legacyYear, createdAt) {
  const numericRaw = Number(rawValue);
  if (Number.isFinite(numericRaw) && numericRaw > 0) {
    return numericRaw;
  }
  const parsedRaw = Date.parse(String(rawValue || ''));
  if (Number.isFinite(parsedRaw)) {
    return parsedRaw;
  }
  const numericYear = Number(legacyYear);
  if (Number.isFinite(numericYear) && numericYear >= 1970) {
    return new Date(numericYear, 0, 1, 0, 0, 0, 0).getTime();
  }
  const numericCreatedAt = Number(createdAt);
  if (Number.isFinite(numericCreatedAt) && numericCreatedAt > 0) {
    return numericCreatedAt;
  }
  return Date.now();
}

function toDateTimeLocalValue(timestamp) {
  const safe = Number(timestamp);
  const date = Number.isFinite(safe) ? new Date(safe) : new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatPublishDate(value) {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return '未知发布时间';
  return new Date(timestamp).toLocaleDateString();
}

function formatPublishDateTime(value) {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return '未知发布时间';
  return new Date(timestamp).toLocaleString();
}

function ensureUploadPublishedAtValue() {
  if (!dom.uploadPublishedAt) return;
  if (dom.uploadPublishedAt.value) return;
  dom.uploadPublishedAt.value = toDateTimeLocalValue(Date.now());
}

function normalizeVideo(video) {
  const status = ['approved', 'pending', 'rejected'].includes(video.status) ? video.status : 'approved';
  const title = sanitizeSingleLineText(video.title, 60);
  const category = sanitizeSingleLineText(video.category, 20);
  const duration = sanitizeSingleLineText(video.duration, 10);
  const description = sanitizeSingleLineText(video.description, 220);
  const createdAt = Number(video.createdAt) || Date.now();
  const publishedAt = normalizePublishedAt(video.publishedAt, video.year, createdAt);
  const tags = Array.isArray(video.tags)
    ? video.tags.map((tag) => sanitizeSingleLineText(tag, 20)).filter(Boolean)
    : [];
  const safeCover = normalizeSafeImageUrl(video.cover) || DEFAULT_COVER;
  const safeSource = normalizeSafeMediaUrl(video.src);

  return {
    ...video,
    id: Number(video.id),
    title,
    category,
    duration,
    year: new Date(publishedAt).getFullYear(),
    publishedAt,
    tags,
    description,
    status,
    cover: safeCover,
    src: safeSource,
    ownerId: normalizeUserId(video.ownerId || 'system'),
    ownerName: sanitizeSingleLineText(video.ownerName || '系统', 20),
    createdAt,
    searchText: buildVideoSearchText({ title, category, description, tags })
  };
}

function stripDerivedVideoFields(video) {
  const { searchText, ...rest } = video;
  return rest;
}

async function bootstrapVideos() {
  const storedVideos = await readVideosStorage();
  if (Array.isArray(storedVideos) && storedVideos.length > 0) {
    state.videos = storedVideos.map(normalizeVideo);
    migrateSeedVideos();
    return;
  }

  state.videos = seedVideos.map((video, index) => normalizeVideo({ ...video, createdAt: Date.now() - index * 1000 }));
  await persistVideos();
}

function getNormalizationTemplate(video) {
  const byId = video.ownerId === 'system' ? SYSTEM_VIDEO_CANONICAL_BY_ID.get(Number(video.id)) : null;
  const byTitle = video.ownerId === 'system' ? SYSTEM_VIDEO_CANONICAL_BY_TITLE.get(video.title) : null;
  const bySource = SYSTEM_VIDEO_CANONICAL_BY_SOURCE.get(video.src);
  const canUseSourceTemplate = Boolean(bySource && (video.ownerId === 'system' || LEGACY_SEED_TITLE_SET.has(video.title)));
  return byId || byTitle || (canUseSourceTemplate ? bySource : null);
}

function getNormalizationChangedFields(video, template) {
  const fields = [];
  if (video.title !== template.title) fields.push('标题');
  if (video.src !== template.src) fields.push('视频源');
  if (video.cover !== template.cover) fields.push('封面');
  if (video.description !== template.description) fields.push('简介');
  if (video.category !== template.category) fields.push('分类');
  if (video.duration !== template.duration) fields.push('时长');
  const templatePublishedAt = Number(template.publishedAt || 0);
  if (Number.isFinite(templatePublishedAt) && templatePublishedAt > 0) {
    if (Number(video.publishedAt || 0) !== templatePublishedAt) fields.push('发布时间');
  } else if (Number(video.year) !== Number(template.year)) {
    fields.push('发布时间');
  }
  if (JSON.stringify(video.tags || []) !== JSON.stringify(template.tags || [])) fields.push('标签');
  return fields;
}

function applyNormalizationTemplate(video, template) {
  const templatePublishedAt = Number(template.publishedAt || 0);
  const nextPublishedAt = (Number.isFinite(templatePublishedAt) && templatePublishedAt > 0)
    ? templatePublishedAt
    : (Number.isFinite(Number(template.year))
      ? new Date(Number(template.year), 0, 1, 0, 0, 0, 0).getTime()
      : video.publishedAt);
  return normalizeVideo({
    ...video,
    title: template.title,
    src: template.src,
    cover: template.cover,
    description: template.description,
    category: template.category,
    duration: template.duration,
    year: template.year,
    publishedAt: nextPublishedAt,
    tags: template.tags
  });
}

function collectNormalizationDiffs(options = {}) {
  const onlyApproved = options.onlyApproved === true;
  const diffs = [];

  state.videos.forEach((video) => {
    if (onlyApproved && video.status !== 'approved') return;
    const template = getNormalizationTemplate(video);
    if (!template) return;
    const fields = getNormalizationChangedFields(video, template);
    if (!fields.length) return;

    diffs.push({
      videoId: Number(video.id),
      beforeTitle: String(video.title || ''),
      afterTitle: String(template.title || ''),
      fields,
      template
    });
  });

  return diffs;
}

function migrateSeedVideos(options = {}) {
  const onlyApproved = options.onlyApproved === true;
  const shouldPersist = options.persist !== false;
  const diffs = collectNormalizationDiffs({ onlyApproved });
  if (!diffs.length) return 0;

  const templateById = new Map(diffs.map((diff) => [diff.videoId, diff.template]));
  state.videos = state.videos.map((video) => {
    const template = templateById.get(Number(video.id));
    return template ? applyNormalizationTemplate(video, template) : video;
  });

  if (shouldPersist) {
    persistVideos();
  }

  return diffs.length;
}

function bootstrapCurrentUser() {
  if (isAuthSessionExpired()) {
    state.currentUser = null;
    clearAuthSession();
    writeStorage(STORAGE_KEYS.currentUser, null);
    return;
  }

  const userId = readStorage(STORAGE_KEYS.currentUser, null);
  if (!userId) {
    state.currentUser = null;
    return;
  }
  if (Number(state.authSession?.expiresAt || 0) <= 0) {
    state.currentUser = null;
    writeStorage(STORAGE_KEYS.currentUser, null);
    return;
  }

  state.currentUser = state.users.find((user) => user.id === userId) || null;
  refreshCurrentUserState();
  if (state.currentUser) {
    startAuthSession();
  }
}

function bootstrapFeatured() {
  const raw = localStorage.getItem(STORAGE_KEYS.featuredId);
  if (raw === null) {
    const firstApproved = state.videos.find((video) => video.status === 'approved');
    state.featuredId = firstApproved?.id || null;
    writeStorage(STORAGE_KEYS.featuredId, state.featuredId);
    return;
  }

  let parsedId = null;
  try {
    parsedId = JSON.parse(raw);
  } catch (_error) {
    parsedId = null;
  }

  if (parsedId === null) {
    state.featuredId = null;
    return;
  }

  const normalizedId = Number(parsedId);
  const featuredVideo = state.videos.find((video) => video.id === normalizedId);
  state.featuredId = featuredVideo ? featuredVideo.id : null;
  if (!featuredVideo) {
    writeStorage(STORAGE_KEYS.featuredId, state.featuredId);
  }
}

function bootstrapPlayerState() {
  const history = readStorage(STORAGE_KEYS.playbackHistory, {});
  state.playbackHistory = history && typeof history === 'object' ? history : {};

  const prefs = readStorage(STORAGE_KEYS.playerPrefs, {});
  const rate = Number(prefs.rate);
  const volume = Number(prefs.volume);
  state.playerPrefs = {
    rate: Number.isFinite(rate) && rate >= 0.5 && rate <= 3 ? rate : 1,
    volume: Number.isFinite(volume) && volume >= 0 && volume <= 1 ? volume : 1,
    muted: Boolean(prefs.muted),
    autoNext: Boolean(prefs.autoNext)
  };
}

function normalizeFavoriteIds(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(
    list
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item) && item > 0)
  )];
}

function normalizeFavoritesByUser(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const normalized = {};
  Object.entries(raw).forEach(([key, value]) => {
    const ids = normalizeFavoriteIds(value);
    if (ids.length) {
      normalized[String(key)] = ids;
    }
  });
  return normalized;
}

function bootstrapFavorites() {
  const stored = readStorage(STORAGE_KEYS.favorites, {});
  state.favoritesByUser = normalizeFavoritesByUser(stored);
}

function bootstrapSiteSettings() {
  const settings = readStorage(STORAGE_KEYS.siteSettings, {});
  state.siteSettings = {
    requireApproval: settings.requireApproval !== false,
    siteNotice: sanitizeSingleLineText(typeof settings.siteNotice === 'string' ? settings.siteNotice : '', 120)
  };
}

function persistUsers() {
  writeStorage(STORAGE_KEYS.users, state.users);
}

function persistVideos() {
  const payload = state.videos.map(stripDerivedVideoFields);
  videoPersistQueue = videoPersistQueue
    .catch(() => true)
    .then(() => persistVideosStorage(payload));
  return videoPersistQueue;
}

function persistCurrentUser() {
  writeStorage(STORAGE_KEYS.currentUser, state.currentUser ? state.currentUser.id : null);
  if (!state.currentUser) {
    clearAuthSession();
  }
}

function persistFeatured() {
  writeStorage(STORAGE_KEYS.featuredId, state.featuredId);
}

function persistPlaybackHistory() {
  writeStorage(STORAGE_KEYS.playbackHistory, state.playbackHistory);
}

function persistFavorites() {
  writeStorage(STORAGE_KEYS.favorites, state.favoritesByUser);
}

function persistPlayerPrefs() {
  writeStorage(STORAGE_KEYS.playerPrefs, state.playerPrefs);
}

function persistSiteSettings() {
  writeStorage(STORAGE_KEYS.siteSettings, state.siteSettings);
}

function findUserByUsername(username) {
  const normalized = sanitizeSingleLineText(username, 20).toLowerCase();
  return state.users.find((user) => user.username.trim().toLowerCase() === normalized) || null;
}

function isSuperAdmin(user) {
  return user?.role === 'super_admin';
}

function isUserBlacklisted(user) {
  return Boolean(user?.blacklisted);
}

function getActiveAdminCount() {
  return state.users.filter((user) => (user.role === 'admin' || user.role === 'super_admin') && !isUserBlacklisted(user)).length;
}

function refreshCurrentUserState() {
  if (!state.currentUser) return;
  const latest = state.users.find((user) => user.id === state.currentUser.id) || null;
  if (!latest || isUserBlacklisted(latest)) {
    state.currentUser = null;
    persistCurrentUser();
    closeAccountModal();
    return;
  }
  state.currentUser = latest;
}

function prunePlaybackHistory() {
  const validIds = new Set(state.videos.map((video) => String(video.id)));
  let changed = false;

  Object.keys(state.playbackHistory).forEach((key) => {
    const value = Number(state.playbackHistory[key]);
    if (!validIds.has(key) || !Number.isFinite(value) || value <= 0) {
      delete state.playbackHistory[key];
      changed = true;
    }
  });

  if (changed) {
    persistPlaybackHistory();
  }
}

function pruneFavorites() {
  const validIds = new Set(state.videos.map((video) => Number(video.id)));
  let changed = false;
  const next = {};

  Object.entries(state.favoritesByUser).forEach(([key, value]) => {
    const ids = normalizeFavoriteIds(value).filter((id) => validIds.has(id));
    if (ids.length) {
      next[key] = ids;
    }
    const prevIds = Array.isArray(value) ? value : [];
    if (ids.length !== prevIds.length) {
      changed = true;
      return;
    }
    for (let index = 0; index < ids.length; index += 1) {
      if (Number(prevIds[index]) !== ids[index]) {
        changed = true;
        break;
      }
    }
  });

  const prevKeys = Object.keys(state.favoritesByUser);
  const nextKeys = Object.keys(next);
  if (!changed && prevKeys.length !== nextKeys.length) {
    changed = true;
  }

  state.favoritesByUser = next;
  if (changed) {
    persistFavorites();
  }
}

function getFavoriteOwnerKey() {
  return state.currentUser ? `user:${state.currentUser.id}` : 'guest';
}

function getFavoriteIdsForCurrentUser() {
  const key = getFavoriteOwnerKey();
  const ids = normalizeFavoriteIds(state.favoritesByUser[key]);
  if (ids.length !== (Array.isArray(state.favoritesByUser[key]) ? state.favoritesByUser[key].length : 0)) {
    state.favoritesByUser[key] = ids;
    persistFavorites();
  }
  return ids;
}

function isFavoriteVideo(videoId) {
  const targetId = Number(videoId);
  if (!Number.isFinite(targetId)) return false;
  return getFavoriteIdsForCurrentUser().includes(targetId);
}

function toggleFavoriteVideo(videoId) {
  const targetId = Number(videoId);
  if (!Number.isFinite(targetId) || targetId <= 0) return false;
  const key = getFavoriteOwnerKey();
  const list = getFavoriteIdsForCurrentUser();
  const existingIndex = list.indexOf(targetId);
  let nowFavorited = false;

  if (existingIndex >= 0) {
    list.splice(existingIndex, 1);
  } else {
    list.unshift(targetId);
    nowFavorited = true;
  }

  if (list.length) {
    state.favoritesByUser[key] = list;
  } else {
    delete state.favoritesByUser[key];
  }
  persistFavorites();
  return nowFavorited;
}

function removeVideoFromAllFavorites(videoId) {
  const targetId = Number(videoId);
  if (!Number.isFinite(targetId)) return;
  let changed = false;

  Object.keys(state.favoritesByUser).forEach((key) => {
    const prev = normalizeFavoriteIds(state.favoritesByUser[key]);
    const next = prev.filter((id) => id !== targetId);
    if (next.length !== prev.length) {
      changed = true;
      if (next.length) {
        state.favoritesByUser[key] = next;
      } else {
        delete state.favoritesByUser[key];
      }
    }
  });

  if (changed) {
    persistFavorites();
  }
}

function isAdmin() {
  return state.currentUser?.role === 'admin' || state.currentUser?.role === 'super_admin';
}

function statusLabel(status) {
  if (status === 'pending') return '待审核';
  if (status === 'rejected') return '已驳回';
  return '已发布';
}

function statusClass(status) {
  if (status === 'pending') return 'status-pending';
  if (status === 'rejected') return 'status-rejected';
  return 'status-approved';
}

function isVideoVisible(video) {
  if (video.status === 'approved') return true;
  if (!state.currentUser) return false;
  if (isAdmin()) return true;
  return video.ownerId === state.currentUser.id;
}

function displayVideos() {
  return state.videos.filter(isVideoVisible);
}

function getFeaturedVideo() {
  const visible = displayVideos();
  if (state.featuredId === null) return null;
  return visible.find((video) => video.id === state.featuredId) || null;
}

function getCategories() {
  return ['全部', ...new Set(displayVideos().map((video) => video.category))];
}

function normalizeSortBy(value) {
  const key = String(value || '').trim();
  return VALID_SORT_VALUES.has(key) ? key : 'latest';
}

function getSortLabel(sortBy) {
  if (sortBy === 'oldest') return '最早上传';
  if (sortBy === 'year_desc') return '发布时间从新到旧';
  if (sortBy === 'year_asc') return '发布时间从旧到新';
  if (sortBy === 'duration_desc') return '时长从长到短';
  if (sortBy === 'duration_asc') return '时长从短到长';
  return '最新上传';
}

function parseFavoriteOnlyParam(value) {
  const raw = String(value || '').trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function normalizeSearchKeyword(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

function getSearchTokens(keyword) {
  return normalizeSearchKeyword(keyword)
    .toLowerCase()
    .split(' ')
    .filter(Boolean);
}

function canUseOwnerFilter() {
  return Boolean(state.currentUser && !isUserBlacklisted(state.currentUser));
}

function hasActiveLibraryFilters() {
  return state.category !== '全部'
    || Boolean(state.search.trim())
    || state.favoriteOnly
    || state.ownerOnly
    || state.sortBy !== 'latest';
}

function buildActiveFilterSummary() {
  const parts = [];
  if (state.category !== '全部') {
    parts.push(`分类：${state.category}`);
  }
  if (state.search.trim()) {
    parts.push(`关键词：${state.search.trim()}`);
  }
  if (state.favoriteOnly) {
    parts.push('仅收藏');
  }
  if (state.ownerOnly) {
    parts.push('仅我的上传');
  }
  if (state.sortBy !== 'latest') {
    parts.push(`排序：${getSortLabel(state.sortBy)}`);
  }
  return parts.length > 0 ? `当前筛选：${parts.join(' · ')}` : '当前筛选：全部视频';
}

function getFilteredScopeVideos(options = {}) {
  const excludeCategory = options.excludeCategory === true;
  const tokens = getSearchTokens(state.search);
  const favoriteSet = state.favoriteOnly ? new Set(getFavoriteIdsForCurrentUser()) : null;
  const ownerId = state.ownerOnly && canUseOwnerFilter() ? state.currentUser.id : null;
  return displayVideos().filter((video) => {
    const inCategory = excludeCategory || state.category === '全部' || video.category === state.category;
    const searchText = typeof video.searchText === 'string' ? video.searchText : buildVideoSearchText(video);
    const inText = !tokens.length || tokens.every((token) => searchText.includes(token));
    const inFavorite = !favoriteSet || favoriteSet.has(video.id);
    const inOwner = !ownerId || String(video.ownerId || '') === String(ownerId);
    return inCategory && inText && inFavorite && inOwner;
  });
}

function syncPlayerStateToUrl(videoId = null) {
  if (!window.history?.replaceState) return;
  const params = new URLSearchParams(window.location.search);
  const normalizedId = Number(videoId);
  if (Number.isFinite(normalizedId) && normalizedId > 0) {
    params.set(FILTER_QUERY_KEYS.videoId, String(normalizedId));
  } else {
    params.delete(FILTER_QUERY_KEYS.videoId);
  }
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`;
  window.history.replaceState(null, '', nextUrl);
}

function syncFilterStateToUrl() {
  if (!window.history?.replaceState) return;
  const params = new URLSearchParams(window.location.search);
  const search = state.search.trim();
  if (search) {
    params.set(FILTER_QUERY_KEYS.search, search);
  } else {
    params.delete(FILTER_QUERY_KEYS.search);
  }
  if (state.category !== '全部') {
    params.set(FILTER_QUERY_KEYS.category, state.category);
  } else {
    params.delete(FILTER_QUERY_KEYS.category);
  }
  if (state.sortBy !== 'latest') {
    params.set(FILTER_QUERY_KEYS.sort, state.sortBy);
  } else {
    params.delete(FILTER_QUERY_KEYS.sort);
  }
  if (state.favoriteOnly) {
    params.set(FILTER_QUERY_KEYS.favoriteOnly, '1');
  } else {
    params.delete(FILTER_QUERY_KEYS.favoriteOnly);
  }
  if (state.ownerOnly && canUseOwnerFilter()) {
    params.set(FILTER_QUERY_KEYS.ownerOnly, '1');
  } else {
    params.delete(FILTER_QUERY_KEYS.ownerOnly);
  }
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`;
  window.history.replaceState(null, '', nextUrl);
}

function bootstrapFilterStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const search = normalizeSearchKeyword(params.get(FILTER_QUERY_KEYS.search));
  const category = String(params.get(FILTER_QUERY_KEYS.category) || '').trim().slice(0, 20);
  const sharedVideoId = Number(params.get(FILTER_QUERY_KEYS.videoId));
  state.search = search;
  state.category = category || '全部';
  state.sortBy = normalizeSortBy(params.get(FILTER_QUERY_KEYS.sort));
  state.favoriteOnly = parseFavoriteOnlyParam(params.get(FILTER_QUERY_KEYS.favoriteOnly));
  state.ownerOnly = parseFavoriteOnlyParam(params.get(FILTER_QUERY_KEYS.ownerOnly));
  state.pendingSharedVideoId = Number.isFinite(sharedVideoId) && sharedVideoId > 0 ? sharedVideoId : null;
  if (dom.searchInput && dom.searchInput.value !== state.search) {
    dom.searchInput.value = state.search;
  }
}

function setLibraryStatus(message = '', isError = false) {
  if (!dom.libraryStatus) return;
  dom.libraryStatus.textContent = message;
  dom.libraryStatus.style.color = isError ? '#c53030' : '#2f855a';
}

function clearSearchKeywordAndRefresh(options = {}) {
  const keepFocus = options.keepFocus === true;
  if (!state.search.trim()) return;
  state.search = '';
  if (dom.searchInput) {
    dom.searchInput.value = '';
    if (keepFocus) {
      dom.searchInput.focus();
    }
  }
  setLibraryStatus('');
  renderFilters();
  renderVideos();
}

function getVideoShareUrl(videoId) {
  const targetId = Number(videoId);
  const url = new URL(window.location.href);
  if (Number.isFinite(targetId) && targetId > 0) {
    url.searchParams.set(FILTER_QUERY_KEYS.videoId, String(targetId));
  } else {
    url.searchParams.delete(FILTER_QUERY_KEYS.videoId);
  }
  return url.toString();
}

async function shareVideo(video) {
  if (!video) return;
  const shareUrl = getVideoShareUrl(video.id);
  const shareText = `${video.title} · ${video.category} · ${video.duration}`;
  try {
    if (navigator?.share) {
      await navigator.share({
        title: `流光视频 · ${video.title}`,
        text: shareText,
        url: shareUrl
      });
      setLibraryStatus('已调起系统分享。');
      return;
    }
    if (!navigator?.clipboard?.writeText) {
      throw new Error('clipboard-not-supported');
    }
    await navigator.clipboard.writeText(shareUrl);
    setLibraryStatus('视频链接已复制，可直接粘贴分享。');
  } catch (error) {
    if (error?.name === 'AbortError') return;
    setLibraryStatus('当前环境不支持自动分享，请手动复制地址栏链接。', true);
  }
}

function consumeSharedVideoFromUrl() {
  const targetId = Number(state.pendingSharedVideoId);
  if (!Number.isFinite(targetId) || targetId <= 0) return;
  const targetVideo = state.videos.find((video) => video.id === targetId);
  if (!targetVideo) {
    state.pendingSharedVideoId = null;
    syncPlayerStateToUrl(null);
    setLibraryStatus('分享视频不存在或已被删除。', true);
    return;
  }
  if (!canCurrentUserPlayVideo(targetVideo)) {
    setLibraryStatus('该分享视频暂不可见，请登录后重试。', true);
    return;
  }
  state.pendingSharedVideoId = null;
  openPlayer(targetVideo, { autoPlay: false });
  setPlayerStatus('已打开分享视频。', false, true);
}

function durationToSeconds(durationText) {
  if (!durationText) return 0;
  const parts = String(durationText).trim().split(':').map((item) => Number(item));
  if (parts.some((item) => !Number.isFinite(item) || item < 0)) return 0;
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

function sortVideosInPlace(list) {
  list.sort((a, b) => {
    if (state.sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (state.sortBy === 'year_desc') return (Number(b.publishedAt) || 0) - (Number(a.publishedAt) || 0);
    if (state.sortBy === 'year_asc') return (Number(a.publishedAt) || 0) - (Number(b.publishedAt) || 0);
    if (state.sortBy === 'duration_desc') return durationToSeconds(b.duration) - durationToSeconds(a.duration);
    if (state.sortBy === 'duration_asc') return durationToSeconds(a.duration) - durationToSeconds(b.duration);
    return b.createdAt - a.createdAt;
  });
  return list;
}

function filteredVideos() {
  const list = getFilteredScopeVideos();
  return sortVideosInPlace(list);
}

function canManageVideo(video) {
  if (!state.currentUser) return false;
  if (isAdmin()) return true;
  if (video.ownerId === 'system') return false;
  return state.currentUser.id === video.ownerId;
}

function canManageOwnVideo(video) {
  if (!state.currentUser) return false;
  if (!video || video.ownerId === 'system') return false;
  return state.currentUser.id === video.ownerId;
}

function updateAccountAvatarPreview(rawAvatar) {
  if (!dom.accountAvatarPreview) return;
  const url = normalizeSafeAvatarUrl(rawAvatar);
  if (!url) {
    dom.accountAvatarPreview.classList.add('hidden');
    dom.accountAvatarPreview.removeAttribute('src');
    return;
  }
  dom.accountAvatarPreview.src = url;
  dom.accountAvatarPreview.classList.remove('hidden');
}

function setAccountAvatarDraft(value) {
  state.accountAvatarDraft = normalizeSafeAvatarUrl(value);
  updateAccountAvatarPreview(state.accountAvatarDraft);
}

function refreshAccountAvatarIndicators() {
  if (dom.accountAvatarMeta) {
    updateUploadFileMeta(dom.accountAvatarFile, dom.accountAvatarMeta, '未选择头像文件');
  }
  toggleUploadClearButton(dom.accountAvatarFile, dom.clearAccountAvatarBtn);
}

async function applyAccountAvatarFile(file) {
  if (!(file instanceof File) || !fileMatchesAccept(file, 'image/*')) {
    throw new Error('请选择图片格式的头像文件。');
  }
  const avatarDataUrl = await fileToDataUrl(file);
  setAccountAvatarDraft(avatarDataUrl);
  refreshAccountAvatarIndicators();
}

function renderHero(video) {
  if (!video) return;
  dom.heroTitle.textContent = video.title;
  dom.heroDescription.textContent = video.description;
  dom.heroCategory.textContent = `类型：${video.category}`;
  dom.heroDuration.textContent = `时长：${video.duration}`;
  dom.heroYear.textContent = `发布时间：${formatPublishDateTime(video.publishedAt)}`;
  dom.heroCover.src = normalizeSafeImageUrl(video.cover) || DEFAULT_COVER;
  dom.heroCover.alt = `${video.title} 封面`;
}

function renderSiteNotice() {
  const text = state.siteSettings.siteNotice.trim();
  dom.siteNoticeText.textContent = text;
  dom.siteNoticeBanner.classList.toggle('hidden', !text);
}

function getProfileOwnedVideos() {
  if (!state.currentUser) return [];
  return state.videos
    .filter((video) => canManageOwnVideo(video))
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);
}

function renderProfileCenter() {
  if (!dom.profileSection || !dom.profileVideoGrid || !dom.profileMeta) return;

  if (!state.currentUser) {
    dom.profileMeta.textContent = '请先登录后查看个人页面';
    dom.profileVideoGrid.innerHTML = '<div class="empty">登录后可管理自己发布的视频。</div>';
    if (dom.profileStatus) {
      dom.profileStatus.textContent = '';
      dom.profileStatus.style.color = '#627d98';
    }
    return;
  }

  const ownVideos = getProfileOwnedVideos();
  dom.profileMeta.textContent = `当前账号：${state.currentUser.username} · 我发布了 ${ownVideos.length} 条视频`;
  if (!ownVideos.length) {
    dom.profileVideoGrid.innerHTML = '<div class="empty">你还没有发布视频，先去上传页发布第一条内容。</div>';
    return;
  }

  dom.profileVideoGrid.innerHTML = ownVideos
    .map((video) => {
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDuration = escapeHtml(video.duration);
      const safeCover = escapeHtml(video.cover || DEFAULT_COVER);
      const statusTag = `<span class="status-badge ${statusClass(video.status)}">${statusLabel(video.status)}</span>`;
      const canPlay = canCurrentUserPlayVideo(video);
      return `
      <article class="card">
        <div class="card-media">
          <img src="${safeCover}" alt="${safeTitle} 封面" loading="lazy" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" />
        </div>
        <div class="card-body">
          <h4 class="card-title">${safeTitle}</h4>
          <p class="card-meta">${safeCategory} · ${safeDuration} · ${formatPublishDate(video.publishedAt)}</p>
          <p class="card-meta">${statusTag}</p>
          <div class="card-actions">
            ${canPlay ? `<button class="btn play-btn" data-action="play-profile" data-id="${video.id}" aria-label="播放 ${safeTitle}">播放视频</button>` : '<button class="btn btn-outline" disabled>待审核</button>'}
            <button class="btn btn-outline share-btn" data-action="share-profile" data-id="${video.id}" aria-label="分享 ${safeTitle}">分享</button>
            <button class="btn btn-outline" data-action="edit-profile" data-id="${video.id}" aria-label="编辑 ${safeTitle}">编辑</button>
            <button class="btn btn-danger" data-action="delete-profile" data-id="${video.id}" aria-label="删除 ${safeTitle}">删除</button>
          </div>
        </div>
      </article>
    `;
    })
    .join('');
}

function getProfileHistoryItems() {
  const visibleVideoById = new Map(displayVideos().map((video) => [String(video.id), video]));
  return Object.entries(state.playbackHistory)
    .map(([videoId, watched]) => {
      const played = Number(watched || 0);
      return {
        video: visibleVideoById.get(String(videoId)) || null,
        played
      };
    })
    .filter((item) => item.video && Number.isFinite(item.played) && item.played > 0)
    .sort((a, b) => b.video.createdAt - a.video.createdAt);
}

function renderProfileHistorySection() {
  if (!dom.profileHistorySection || !dom.profileHistoryGrid || !dom.profileHistoryMeta) return;

  if (!state.currentUser) {
    dom.profileHistoryMeta.textContent = '请先登录后查看历史观看记录';
    dom.profileHistoryGrid.innerHTML = '<div class="empty">登录后会在这里展示你的视频历史记录。</div>';
    return;
  }

  const historyItems = getProfileHistoryItems();
  if (!historyItems.length) {
    dom.profileHistoryMeta.textContent = '暂无历史观看记录';
    dom.profileHistoryGrid.innerHTML = '<div class="empty">还没有历史观看记录，开始播放视频后会自动记录到这里。</div>';
    return;
  }

  dom.profileHistoryMeta.textContent = `共 ${historyItems.length} 条记录`;
  dom.profileHistoryGrid.innerHTML = historyItems
    .map((item) => {
      const video = item.video;
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDuration = escapeHtml(video.duration);
      const safeCover = escapeHtml(video.cover || DEFAULT_COVER);
      const canPlay = canCurrentUserPlayVideo(video);
      return `
      <article class="card">
        <div class="card-media">
          <img src="${safeCover}" alt="${safeTitle} 封面" loading="lazy" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" />
        </div>
        <div class="card-body">
          <h4 class="card-title">${safeTitle}</h4>
          <p class="card-meta">${safeCategory} · ${safeDuration} · ${formatPublishDate(video.publishedAt)}</p>
          <p class="card-meta">上次播放到：${formatClock(item.played)}</p>
          <div class="card-actions">
            ${canPlay ? `<button class="btn play-btn" data-action="play-history" data-id="${video.id}" aria-label="继续播放 ${safeTitle}">继续播放</button>` : '<button class="btn btn-outline" disabled>暂不可播放</button>'}
            <button class="btn btn-outline" data-action="remove-history" data-id="${video.id}" aria-label="删除记录 ${safeTitle}">删除记录</button>
          </div>
        </div>
      </article>
    `;
    })
    .join('');
}

function renderFilters() {
  if (state.ownerOnly && !canUseOwnerFilter()) {
    state.ownerOnly = false;
  }
  if (IS_HOME_PAGE && state.favoriteOnly) {
    state.favoriteOnly = false;
  }

  const categories = getCategories();
  if (!categories.includes(state.category)) {
    state.category = '全部';
  }

  const categoryScopedVideos = getFilteredScopeVideos({ excludeCategory: true });
  const categoryCount = new Map();
  categoryScopedVideos.forEach((video) => {
    const key = String(video.category || '未分类');
    categoryCount.set(key, (categoryCount.get(key) || 0) + 1);
  });

  dom.categoryFilters.innerHTML = categories
    .map((category) => {
      const isActive = category === state.category;
      const count = category === '全部' ? categoryScopedVideos.length : (categoryCount.get(category) || 0);
      const isDisabled = !isActive && count <= 0;
      return `
        <button
          type="button"
          class="chip ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
          data-category="${escapeHtml(category)}"
          data-disabled="${isDisabled ? '1' : '0'}"
          aria-pressed="${isActive ? 'true' : 'false'}"
          ${isDisabled ? 'aria-disabled="true"' : ''}
        >
          ${escapeHtml(category)} <span class="chip-count">${count}</span>
        </button>
      `;
    })
    .join('');

  if (dom.sortSelect.value !== state.sortBy) {
    dom.sortSelect.value = state.sortBy;
  }
  if (dom.clearSearchBtn) {
    dom.clearSearchBtn.classList.toggle('hidden', !state.search.trim());
  }
  dom.favoriteToggleBtn.classList.toggle('hidden', IS_HOME_PAGE);
  dom.favoriteToggleBtn.classList.toggle('active', !IS_HOME_PAGE && state.favoriteOnly);
  if (dom.ownerToggleBtn) {
    const canUseMine = canUseOwnerFilter();
    dom.ownerToggleBtn.classList.toggle('active', state.ownerOnly && canUseMine);
    dom.ownerToggleBtn.classList.toggle('disabled', !canUseMine);
    dom.ownerToggleBtn.setAttribute('aria-disabled', canUseMine ? 'false' : 'true');
    dom.ownerToggleBtn.title = canUseMine ? '只显示你上传的视频' : '登录后可用';
  }
  if (dom.activeFilterSummary) {
    dom.activeFilterSummary.textContent = buildActiveFilterSummary();
  }
  if (dom.clearFiltersBtn) {
    dom.clearFiltersBtn.classList.toggle('hidden', !hasActiveLibraryFilters());
  }
  syncFilterStateToUrl();
}

function getVideoProgress(video) {
  const played = Number(state.playbackHistory[String(video.id)] || 0);
  if (!Number.isFinite(played) || played <= 0) return null;
  const total = durationToSeconds(video.duration);
  if (total <= 0) return null;
  if (played >= total - 2) return null;
  const ratio = Math.max(0, Math.min(1, played / total));
  return {
    played,
    total,
    ratio,
    percent: Math.round(ratio * 100)
  };
}

function renderProgressMarkup(video) {
  const progress = getVideoProgress(video);
  if (!progress) return '';
  return `
    <div class="card-progress">
      <div class="card-progress-track">
        <i class="card-progress-bar" style="width: ${progress.percent}%"></i>
      </div>
      <p class="card-progress-text">已观看 ${formatClock(progress.played)} / ${formatClock(progress.total)}（${progress.percent}%）</p>
    </div>
  `;
}

function canCurrentUserPlayVideo(video) {
  return video.status === 'approved' || isAdmin() || state.currentUser?.id === video.ownerId;
}

function getFavoriteVideosSorted() {
  const favoriteIds = getFavoriteIdsForCurrentUser();
  if (!favoriteIds.length) return [];
  const favoriteSet = new Set(favoriteIds);
  const favoriteOrder = new Map(favoriteIds.map((id, index) => [id, index]));
  const list = displayVideos().filter((video) => favoriteSet.has(video.id));

  if (state.favoriteSortBy === 'title_asc') {
    list.sort((a, b) => String(a.title).localeCompare(String(b.title), 'zh-Hans-CN'));
    return list;
  }

  if (state.favoriteSortBy === 'progress_desc') {
    list.sort((a, b) => {
      const progressA = getVideoProgress(a);
      const progressB = getVideoProgress(b);
      const ratioA = progressA ? progressA.ratio : 0;
      const ratioB = progressB ? progressB.ratio : 0;
      if (ratioB !== ratioA) return ratioB - ratioA;
      return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
    });
    return list;
  }

  list.sort((a, b) => {
    const rankA = favoriteOrder.get(a.id);
    const rankB = favoriteOrder.get(b.id);
    if (rankA === undefined && rankB === undefined) return 0;
    if (rankA === undefined) return 1;
    if (rankB === undefined) return -1;
    return rankA - rankB;
  });
  return list;
}

function clearContinueWatchingHistory() {
  const hasRecords = Object.keys(state.playbackHistory).length > 0;
  if (!hasRecords) {
    return false;
  }
  state.playbackHistory = {};
  persistPlaybackHistory();
  clearResumePrompt();
  return true;
}

function removeContinueWatchingItem(videoId) {
  const key = String(videoId);
  if (state.playbackHistory[key] === undefined) {
    return false;
  }
  delete state.playbackHistory[key];
  persistPlaybackHistory();
  if (state.currentPlayingVideoId === Number(videoId)) {
    clearResumePrompt();
  }
  return true;
}

function isContinueRecordCompleted(video, watchedSeconds) {
  if (!video) return false;
  const durationSeconds = durationToSeconds(video.duration);
  if (durationSeconds <= 0) return false;
  return watchedSeconds / durationSeconds >= 0.9 || watchedSeconds >= durationSeconds - 5;
}

function clearCompletedContinueWatchingHistory() {
  const videoById = new Map(state.videos.map((video) => [String(video.id), video]));
  let removedCount = 0;

  Object.keys(state.playbackHistory).forEach((key) => {
    const watchedSeconds = Number(state.playbackHistory[key] || 0);
    const video = videoById.get(key);

    const isInvalid = !video || !Number.isFinite(watchedSeconds) || watchedSeconds <= 0;
    const isCompleted = isContinueRecordCompleted(video, watchedSeconds);
    if (!isInvalid && !isCompleted) return;

    delete state.playbackHistory[key];
    removedCount += 1;
  });

  if (removedCount > 0) {
    persistPlaybackHistory();
    clearResumePrompt();
  }
  return removedCount;
}

function getContinueWatchingVideos() {
  return sortVideosInPlace(
    displayVideos().filter((video) => Boolean(getVideoProgress(video)))
  );
}

function canUseHoverPreview() {
  if (typeof window.matchMedia !== 'function') return false;
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return supportsHover && !prefersReducedMotion;
}

function clearHoverPreviewTimer() {
  if (state.hoverPreviewTimer) {
    clearTimeout(state.hoverPreviewTimer);
    state.hoverPreviewTimer = null;
  }
}

function stopCardHoverPreview() {
  clearHoverPreviewTimer();
  if (state.hoverPreviewVideoEl) {
    state.hoverPreviewVideoEl.pause();
    state.hoverPreviewVideoEl.remove();
    state.hoverPreviewVideoEl = null;
  }
  if (state.hoverPreviewCardId !== null) {
    const activeCard = dom.videoGrid.querySelector(`.card.preview-active[data-id="${state.hoverPreviewCardId}"]`);
    if (activeCard) {
      activeCard.classList.remove('preview-active');
    }
  }
  state.hoverPreviewCardId = null;
}

function startCardHoverPreview(card) {
  if (!canUseHoverPreview()) return;
  const cardId = String(card.dataset.id || '');
  if (!cardId) return;

  if (state.hoverPreviewCardId === cardId && state.hoverPreviewVideoEl) {
    return;
  }
  stopCardHoverPreview();

  const previewSrc = card.dataset.previewSrc || '';
  const previewShell = card.querySelector('.card-preview-shell');
  if (!previewSrc || !previewShell) return;

  const previewVideo = document.createElement('video');
  previewVideo.className = 'card-preview-video';
  previewVideo.src = previewSrc;
  previewVideo.muted = true;
  previewVideo.loop = true;
  previewVideo.playsInline = true;
  previewVideo.preload = 'metadata';

  previewShell.appendChild(previewVideo);
  state.hoverPreviewVideoEl = previewVideo;
  state.hoverPreviewCardId = cardId;
  card.classList.add('preview-active');

  const playTask = previewVideo.play();
  if (playTask?.catch) {
    playTask.catch(() => {
      stopCardHoverPreview();
    });
  }
}

function queueCardHoverPreview(card) {
  if (!canUseHoverPreview()) return;
  clearHoverPreviewTimer();
  state.hoverPreviewTimer = setTimeout(() => {
    startCardHoverPreview(card);
    state.hoverPreviewTimer = null;
  }, 240);
}

function renderContinueSection() {
  const allItems = getContinueWatchingVideos();
  const items = allItems.slice(0, 8);
  const historyKeys = Object.keys(state.playbackHistory);
  const videoById = new Map(state.videos.map((video) => [String(video.id), video]));
  const completedCount = historyKeys.reduce((count, key) => {
    const watchedSeconds = Number(state.playbackHistory[key] || 0);
    const video = videoById.get(String(key));
    return isContinueRecordCompleted(video, watchedSeconds) ? count + 1 : count;
  }, 0);

  if (!items.length && historyKeys.length === 0) {
    dom.clearContinueCompletedBtn.disabled = true;
    dom.clearContinueBtn.disabled = true;
    dom.continueSection.classList.add('hidden');
    dom.continueMeta.textContent = '';
    dom.continueGrid.innerHTML = '';
    return;
  }

  dom.clearContinueCompletedBtn.disabled = completedCount <= 0;
  dom.clearContinueBtn.disabled = historyKeys.length <= 0;
  dom.continueMeta.textContent = items.length
    ? `${allItems.length} 条可继续观看 · 已看完记录 ${completedCount} 条`
    : `暂无可继续内容 · 已看完记录 ${completedCount} 条`;

  if (!items.length) {
    dom.continueGrid.innerHTML = '<div class="empty">当前没有未看完的视频记录，可点“清空已看完”做整理。</div>';
    dom.continueSection.classList.remove('hidden');
    return;
  }

  dom.continueGrid.innerHTML = items
    .map((video) => {
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDuration = escapeHtml(video.duration);
      const safeCover = escapeHtml(video.cover || DEFAULT_COVER);
      const canPlay = canCurrentUserPlayVideo(video);
      const favorited = isFavoriteVideo(video.id);
      return `
        <article class="quick-card">
          <img src="${safeCover}" alt="${safeTitle} 封面" loading="lazy" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" />
          <div class="quick-body">
            <h4 class="card-title">${safeTitle}</h4>
            <p class="card-meta">${safeCategory} · ${safeDuration} · ${formatPublishDate(video.publishedAt)}</p>
            ${renderProgressMarkup(video)}
            <div class="card-actions quick-actions">
              ${canPlay ? `<button class="btn play-btn" data-action="play-video" data-id="${video.id}" aria-label="继续播放 ${safeTitle}">继续播放</button>` : '<button class="btn btn-outline" disabled>待审核</button>'}
              <button class="btn btn-outline fav-btn ${favorited ? 'active' : ''}" data-action="toggle-favorite" data-id="${video.id}" aria-pressed="${favorited ? 'true' : 'false'}">${favorited ? '已收藏' : '收藏'}</button>
              <button class="btn btn-outline continue-remove-btn" data-action="remove-continue" data-id="${video.id}" aria-label="从继续观看中移除 ${safeTitle}">移除记录</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
  dom.continueSection.classList.remove('hidden');
}

function renderFavoriteSection() {
  if (dom.favoriteSortSelect.value !== state.favoriteSortBy) {
    dom.favoriteSortSelect.value = state.favoriteSortBy;
  }
  if (!state.currentUser) {
    if (IS_PROFILE_PAGE) {
      dom.favoriteMeta.textContent = '请先登录后查看收藏内容';
      dom.favoriteGrid.innerHTML = '<div class="empty">登录后可在这里管理你的收藏视频。</div>';
      dom.favoriteSection.classList.remove('hidden');
      return;
    }
    dom.favoriteSection.classList.add('hidden');
    dom.favoriteMeta.textContent = '';
    dom.favoriteGrid.innerHTML = '';
    return;
  }
  const sortedFavorites = getFavoriteVideosSorted();
  const items = sortedFavorites;

  if (!items.length) {
    if (IS_PROFILE_PAGE) {
      dom.favoriteMeta.textContent = '暂无收藏';
      dom.favoriteGrid.innerHTML = '<div class="empty">你还没有收藏视频，可在首页视频库中点“收藏”后回到这里查看。</div>';
      dom.favoriteSection.classList.remove('hidden');
      return;
    }
    dom.favoriteSection.classList.add('hidden');
    dom.favoriteMeta.textContent = '';
    dom.favoriteGrid.innerHTML = '';
    return;
  }

  const groupedByCategory = new Map();
  items.forEach((video) => {
    const key = String(video.category || '未分类');
    if (!groupedByCategory.has(key)) {
      groupedByCategory.set(key, []);
    }
    groupedByCategory.get(key).push(video);
  });

  dom.favoriteMeta.textContent = `已收藏 ${items.length} 条，分为 ${groupedByCategory.size} 个分类`;
  dom.favoriteGrid.innerHTML = [...groupedByCategory.entries()]
    .map(([category, videos]) => `
      <section class="favorite-group">
        <div class="favorite-group-title">${escapeHtml(category)} <span>${videos.length} 条</span></div>
        <div class="quick-grid quick-grid-grouped">
          ${videos
    .map((video) => {
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDuration = escapeHtml(video.duration);
      const safeCover = escapeHtml(video.cover || DEFAULT_COVER);
      const canPlay = canCurrentUserPlayVideo(video);
      return `
            <article class="quick-card">
              <img src="${safeCover}" alt="${safeTitle} 封面" loading="lazy" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" />
              <div class="quick-body">
                <h4 class="card-title">${safeTitle}</h4>
                <p class="card-meta">${safeCategory} · ${safeDuration} · ${formatPublishDate(video.publishedAt)}</p>
                ${renderProgressMarkup(video)}
                <div class="card-actions quick-actions">
                  ${canPlay ? `<button class="btn play-btn" data-action="play-video" data-id="${video.id}" aria-label="播放 ${safeTitle}">播放视频</button>` : '<button class="btn btn-outline" disabled>待审核</button>'}
                  <button class="btn btn-outline fav-btn active" data-action="toggle-favorite" data-id="${video.id}" aria-pressed="true">已收藏</button>
                </div>
              </div>
            </article>
          `;
    })
    .join('')}
        </div>
      </section>
    `)
    .join('');
  dom.favoriteSection.classList.remove('hidden');
}

function renderQuickSections() {
  renderContinueSection();
  renderFavoriteSection();
}

function renderVideos() {
  stopCardHoverPreview();
  const list = filteredVideos();
  dom.resultCount.textContent = `匹配 ${list.length} 条`;

  if (!list.length) {
    const hasFilters = hasActiveLibraryFilters();
    dom.videoGrid.innerHTML = hasFilters
      ? '<div class="empty">当前筛选下没有匹配视频，请调整分类、关键词、收藏或“只看我上传”条件。</div>'
      : '<div class="empty">暂无可展示视频，请先上传或等待审核通过。</div>';
    return;
  }

  dom.videoGrid.innerHTML = list
    .map((video) => {
      const safeTitle = escapeHtml(video.title);
      const safeCategory = escapeHtml(video.category);
      const safeDuration = escapeHtml(video.duration);
      const safeCover = escapeHtml(video.cover || DEFAULT_COVER);
      const safeSource = escapeHtml(video.src || '');
      const safeOwner = escapeHtml(video.ownerName || '系统');
      const ownerTag = video.ownerName ? ` · 上传者：${safeOwner}` : '';
      const canPlay = canCurrentUserPlayVideo(video);
      const favorited = isFavoriteVideo(video.id);
      return `
      <article class="card" data-id="${video.id}" data-preview-src="${safeSource}">
        <div class="card-media">
          <img src="${safeCover}" alt="${safeTitle} 封面" loading="lazy" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" />
          <div class="card-preview-shell" aria-hidden="true"></div>
        </div>
        <div class="card-body">
          <h4 class="card-title">${safeTitle}</h4>
          <p class="card-meta">${safeCategory} · ${safeDuration} · ${formatPublishDate(video.publishedAt)}${ownerTag}</p>
          <div class="card-actions">
            ${canPlay ? `<button class="btn play-btn" data-id="${video.id}" aria-label="播放 ${safeTitle}">播放视频</button>` : '<button class="btn btn-outline" disabled>待审核</button>'}
            <button class="btn btn-outline share-btn" data-id="${video.id}" aria-label="分享 ${safeTitle}">分享</button>
            <button class="btn btn-outline fav-btn ${favorited ? 'active' : ''}" data-id="${video.id}" aria-pressed="${favorited ? 'true' : 'false'}">${favorited ? '已收藏' : '收藏'}</button>
          </div>
        </div>
      </article>
    `;
    })
    .join('');
}

function updateCurrentUserAvatar(rawAvatar, username = '') {
  if (!dom.currentUserAvatar) return;
  const avatar = normalizeSafeAvatarUrl(rawAvatar);
  if (!avatar) {
    dom.currentUserAvatar.classList.add('hidden');
    dom.currentUserAvatar.removeAttribute('src');
    dom.currentUserAvatar.alt = '账号头像';
    return;
  }
  dom.currentUserAvatar.src = avatar;
  dom.currentUserAvatar.alt = `${username || '当前账号'}头像`;
  dom.currentUserAvatar.classList.remove('hidden');
}

function renderAuthState() {
  if (state.currentUser) {
    refreshAuthSessionIfNeeded();
    dom.userBar.classList.remove('hidden');
    dom.openAuthBtn.classList.add('hidden');
    const roleLabel = isSuperAdmin(state.currentUser)
      ? '总管理员'
      : (state.currentUser.role === 'admin' ? '管理员' : '普通用户');
    dom.currentUserText.textContent = `${state.currentUser.username}（${roleLabel}）`;
    updateCurrentUserAvatar(state.currentUser.avatar, state.currentUser.username);
  } else {
    dom.userBar.classList.add('hidden');
    dom.openAuthBtn.classList.remove('hidden');
    dom.currentUserText.textContent = '';
    updateCurrentUserAvatar('');
  }
  if (dom.adminPageLink) {
    dom.adminPageLink.classList.toggle('hidden', !isAdmin());
  }

  if (dom.creatorSection) {
    dom.creatorSection.classList.toggle('hidden', !state.currentUser && !IS_UPLOAD_PAGE);
  }
  if (dom.adminSection) {
    dom.adminSection.classList.toggle('hidden', !isAdmin());
  }
  if (dom.adminAccessHint) {
    dom.adminAccessHint.classList.toggle('hidden', isAdmin() || !IS_ADMIN_PAGE);
  }
  if (dom.creatorHint) {
    dom.creatorHint.textContent = state.currentUser ? `当前账号：${state.currentUser.username}` : '登录后可发布视频';
  }
  if (dom.uploadPolicyHint) {
    dom.uploadPolicyHint.textContent = state.siteSettings.requireApproval
      ? '当前策略：普通用户上传后进入待审核，管理员审核通过后公开。'
      : '当前策略：上传后立即公开。';
  }

  if (state.currentUser) {
    if (dom.accountUsername && dom.accountUsername.value !== state.currentUser.username) {
      dom.accountUsername.value = state.currentUser.username;
    }
    if (dom.accountBirthDate) {
      dom.accountBirthDate.value = String(state.currentUser.birthDate || '');
    }
    if (dom.accountGender) {
      dom.accountGender.value = normalizeGender(state.currentUser.gender);
    }
    if (dom.accountAge) {
      dom.accountAge.value = Number.isFinite(Number(state.currentUser.age)) ? String(state.currentUser.age) : '';
    }
    setAccountAvatarDraft(state.currentUser.avatar || '');
    refreshAccountAvatarIndicators();
  } else {
    if (dom.editVideoModal.classList.contains('show')) {
      closeEditVideoModal();
    }
    if (dom.accountForm) {
      dom.accountForm.reset();
    }
    if (dom.accountStatus) {
      dom.accountStatus.textContent = '';
    }
    setAccountAvatarDraft('');
    refreshAccountAvatarIndicators();
  }

  if (dom.passwordHint) {
    dom.passwordHint.textContent = state.currentUser
      ? `当前账号：${state.currentUser.username}`
      : '请先登录后再修改密码';
  }
  if (!state.currentUser && dom.passwordStatus) {
    dom.passwordStatus.textContent = '';
  }
}

function renderAdminPanel() {
  if (!isAdmin()) return;
  const hasAdminPanel = Boolean(
    dom.adminStats
    && dom.requireApprovalToggle
    && dom.approvalSummary
    && dom.siteNoticeInput
    && dom.reviewMeta
    && dom.reviewRows
    && dom.adminVideoRows
    && dom.adminUserRows
  );
  if (!hasAdminPanel) return;

  const pendingCount = state.videos.filter((video) => video.status === 'pending').length;
  const blacklistedCount = state.users.filter((user) => isUserBlacklisted(user)).length;
  dom.adminStats.textContent = `视频 ${state.videos.length} 条 · 待审核 ${pendingCount} 条 · 用户 ${state.users.length} 个 · 拉黑 ${blacklistedCount} 个`;
  dom.requireApprovalToggle.checked = state.siteSettings.requireApproval;
  dom.approvalSummary.textContent = state.siteSettings.requireApproval
    ? '当前审核模式：开启。普通用户上传后需管理员通过才会公开。'
    : '当前审核模式：关闭。上传后将直接公开。';
  dom.siteNoticeInput.value = state.siteSettings.siteNotice;
  dom.reviewMeta.textContent = pendingCount > 0 ? `待处理 ${pendingCount} 条` : '当前无待处理';

  const pendingVideos = state.videos
    .filter((video) => video.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);

  dom.reviewRows.innerHTML = pendingVideos.length
    ? pendingVideos
      .map((video) => `
      <tr>
        <td>${escapeHtml(video.title)}</td>
        <td>${escapeHtml(video.ownerName || '系统')}</td>
        <td>${escapeHtml(new Date(video.createdAt).toLocaleString())}</td>
        <td>
          <div class="admin-actions">
            <button class="btn btn-primary" data-action="approve-video" data-id="${video.id}">通过</button>
            <button class="btn btn-danger" data-action="reject-video" data-id="${video.id}">驳回</button>
          </div>
        </td>
      </tr>
    `)
      .join('')
    : '<tr><td colspan="4">暂无待审核内容，新的投稿会在这里出现。</td></tr>';

  dom.adminVideoRows.innerHTML = state.videos
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((video) => {
      const featured = Number(state.featuredId) === Number(video.id);
      const canFeature = video.status === 'approved';
      const deleteButton = `<button class="btn btn-danger" data-action="delete-video" data-id="${video.id}">删除</button>`;
      const featureButton = canFeature
        ? `<button class="btn ${featured ? 'btn-primary' : 'btn-outline'}" data-action="set-featured" data-id="${video.id}">${featured ? '当前推荐' : '设为推荐'}</button>`
        : '<button class="btn btn-outline" disabled title="仅审核通过的视频可推荐">设为推荐</button>';
      return `
      <tr>
        <td>${escapeHtml(video.title)}</td>
        <td>${escapeHtml(video.category)}</td>
        <td>${escapeHtml(video.ownerName || '系统')}</td>
        <td><span class="status-badge ${statusClass(video.status)}">${statusLabel(video.status)}</span></td>
        <td>
          <div class="admin-actions">
            ${featureButton}
            ${deleteButton}
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  dom.adminUserRows.innerHTML = state.users
    .map((user) => {
      const roleLabel = isSuperAdmin(user) ? '总管理员' : (user.role === 'admin' ? '管理员' : '普通用户');
      const isSelf = state.currentUser?.id === user.id;
      const protectedUser = isSuperAdmin(user);
      const actorIsSuperAdmin = isSuperAdmin(state.currentUser);
      const canResetPassword = actorIsSuperAdmin ? !protectedUser : user.role === 'user';
      const stateBadge = isUserBlacklisted(user)
        ? '<span class="status-badge status-banned">已拉黑</span>'
        : '<span class="status-badge status-safe">正常</span>';
      const toggleRoleText = user.role === 'admin' ? '降级为用户' : (user.role === 'super_admin' ? '总管理员' : '升级为管理员');
      const toggleRoleButton = actorIsSuperAdmin
        ? `<button class="btn btn-outline" data-action="toggle-role" data-id="${user.id}" ${(isSelf || protectedUser) ? 'disabled' : ''}>${toggleRoleText}</button>`
        : (user.role === 'user'
          ? `<button class="btn btn-outline" data-action="toggle-role" data-id="${user.id}" ${isSelf ? 'disabled' : ''}>升级为管理员</button>`
          : '');
      const resetPasswordButton = canResetPassword
        ? `<button class="btn btn-outline" data-action="reset-password" data-id="${user.id}">重置密码</button>`
        : '';
      const blacklistButton = actorIsSuperAdmin
        ? (protectedUser
          ? ''
          : `<button class="btn ${isUserBlacklisted(user) ? 'btn-outline' : 'btn-danger'}" data-action="toggle-blacklist" data-id="${user.id}" ${(isSelf || protectedUser) ? 'disabled' : ''}>${isUserBlacklisted(user) ? '解除拉黑' : '拉黑'}</button>`)
        : (user.role === 'user'
          ? `<button class="btn ${isUserBlacklisted(user) ? 'btn-outline' : 'btn-danger'}" data-action="toggle-blacklist" data-id="${user.id}" ${isSelf ? 'disabled' : ''}>${isUserBlacklisted(user) ? '解除拉黑' : '拉黑'}</button>`
          : '');
      const deleteUserButton = actorIsSuperAdmin
        ? (protectedUser
          ? ''
          : `<button class="btn btn-danger" data-action="delete-user" data-id="${user.id}" ${(isSelf || protectedUser) ? 'disabled' : ''}>删除用户</button>`)
        : (user.role === 'user'
          ? `<button class="btn btn-danger" data-action="delete-user" data-id="${user.id}" ${isSelf ? 'disabled' : ''}>删除用户</button>`
          : '');

      return `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${roleLabel} · ${stateBadge}</td>
        <td><div class="admin-actions">${toggleRoleButton}${resetPasswordButton}${blacklistButton}${deleteUserButton}</div></td>
      </tr>
    `;
    })
    .join('');
}

function renderAuthMode() {
  const inLogin = state.authMode === 'login';
  dom.authRule.textContent = authPasswordRuleHintText();
  dom.loginTabBtn.classList.toggle('active', inLogin);
  dom.registerTabBtn.classList.toggle('active', !inLogin);
  dom.authTitle.textContent = inLogin ? '欢迎回来' : '创建账号';
  dom.authSubtext.textContent = inLogin
    ? '登录后可继续观看、收藏和发布视频。'
    : '注册后将自动登录，开始管理你的个人视频内容。';
  dom.authConfirmRow.classList.toggle('hidden', inLogin);
  dom.authRule.classList.toggle('hidden', inLogin);
  dom.authConfirmPassword.required = !inLogin;
  if (inLogin) {
    dom.authConfirmPassword.value = '';
  }
  dom.authSubmitBtn.textContent = inLogin ? '登录' : '注册并登录';
  setAuthHintText(inLogin ? '请输入账号和密码登录。' : `注册后自动登录，${authPasswordRuleHintText()}`);
}

function setAuthHintText(message, isError = false, isSuccess = false) {
  dom.authHint.textContent = message;
  if (isError) {
    dom.authHint.style.color = '#c53030';
    return;
  }
  if (isSuccess) {
    dom.authHint.style.color = '#2f855a';
    return;
  }
  dom.authHint.style.color = '#627d98';
}

function setAuthPasswordVisibility(visible) {
  const nextVisible = Boolean(visible);
  dom.authPassword.type = nextVisible ? 'text' : 'password';
  dom.authConfirmPassword.type = nextVisible ? 'text' : 'password';
  dom.authPasswordToggle.textContent = nextVisible ? '隐藏' : '显示';
  dom.authPasswordToggle.setAttribute('aria-pressed', nextVisible ? 'true' : 'false');
}

function updateAuthDraftHint() {
  const inLogin = state.authMode === 'login';
  if (inLogin) {
    const username = dom.authUsername.value.trim();
    const lockRemainingMs = getLoginLockRemainingMs(username);
    if (lockRemainingMs > 0) {
      setAuthHintText(`该账号尝试过于频繁，请 ${Math.ceil(lockRemainingMs / 1000)} 秒后重试。`, true);
      return;
    }
    if (!dom.authUsername.value.trim() && !dom.authPassword.value.trim()) {
      setAuthHintText('请输入账号和密码登录。');
      return;
    }
    setAuthHintText('按 Enter 可快速提交登录。');
    return;
  }

  const password = dom.authPassword.value.trim();
  const confirmPassword = dom.authConfirmPassword.value.trim();
  if (!password) {
    setAuthHintText(`注册后自动登录，${authPasswordRuleHintText()}`);
    return;
  }

  if (!isPasswordStrong(password)) {
    setAuthHintText(`密码格式不符合要求。${authPasswordRuleHintText()}`, true);
    return;
  }

  if (!confirmPassword) {
    setAuthHintText('密码可用，请再次输入确认密码。');
    return;
  }

  if (confirmPassword !== password) {
    setAuthHintText('两次输入密码不一致。', true);
    return;
  }

  setAuthHintText('信息校验通过，可提交注册。', false, true);
}

function canUsePictureInPicture() {
  return Boolean(document.pictureInPictureEnabled && typeof dom.videoPlayer.requestPictureInPicture === 'function');
}

function updateMuteButton() {
  dom.muteBtn.textContent = dom.videoPlayer.muted || dom.videoPlayer.volume === 0 ? '取消静音' : '静音';
}

function updatePipButton() {
  dom.pipBtn.disabled = !canUsePictureInPicture();
  dom.pipBtn.textContent = document.pictureInPictureElement === dom.videoPlayer ? '退出画中画' : '画中画';
}

function getPlaybackQueue(currentVideoId = null) {
  const filtered = filteredVideos();
  if (!currentVideoId) return filtered;
  if (filtered.some((video) => video.id === currentVideoId)) {
    return filtered;
  }
  return sortVideosInPlace(displayVideos().slice());
}

function getAutoNextVideo(currentVideoId) {
  const queue = getPlaybackQueue(currentVideoId);
  if (queue.length < 2) return null;
  const currentIndex = queue.findIndex((video) => video.id === currentVideoId);
  if (currentIndex === -1) {
    return queue[0] || null;
  }
  return queue[currentIndex + 1] || null;
}

function extractKeywords(text) {
  const matched = String(text || '').toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-z0-9]+/g);
  if (!matched) return [];
  return matched.filter((item) => item.length > 1);
}

function calcRelatedScore(current, candidate) {
  let score = 0;

  if (current.category && current.category === candidate.category) {
    score += 3;
  }

  const currentTags = new Set((current.tags || []).map((tag) => String(tag).toLowerCase()));
  const candidateTags = (candidate.tags || []).map((tag) => String(tag).toLowerCase());
  candidateTags.forEach((tag) => {
    if (currentTags.has(tag)) score += 2;
  });

  const currentKeywords = new Set(extractKeywords([current.title, current.category, (current.tags || []).join(' ')].join(' ')));
  const candidateKeywords = new Set(extractKeywords([candidate.title, candidate.category, (candidate.tags || []).join(' ')].join(' ')));
  candidateKeywords.forEach((word) => {
    if (currentKeywords.has(word)) score += 1;
  });

  const publishGap = Math.abs((Number(current.publishedAt) || 0) - (Number(candidate.publishedAt) || 0));
  if (publishGap <= 365 * 24 * 60 * 60 * 1000) score += 1;

  return score;
}

function getRelatedVideos(currentVideo, limit = 3) {
  const candidates = displayVideos().filter((video) => video.id !== currentVideo.id);
  if (!candidates.length) return [];

  const scored = candidates.map((video) => ({
    video,
    score: calcRelatedScore(currentVideo, video)
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.video.createdAt - a.video.createdAt;
  });

  const positives = scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.video);
  if (positives.length >= limit) return positives;

  const fallback = scored
    .filter((item) => item.score <= 0)
    .slice(0, limit - positives.length)
    .map((item) => item.video);

  return [...positives, ...fallback];
}

function ensurePreloadVideoElement() {
  if (state.preloadVideoEl) return state.preloadVideoEl;
  const preloadVideo = document.createElement('video');
  preloadVideo.preload = 'metadata';
  preloadVideo.muted = true;
  preloadVideo.playsInline = true;
  preloadVideo.style.display = 'none';
  document.body.appendChild(preloadVideo);
  state.preloadVideoEl = preloadVideo;
  return preloadVideo;
}

function renderNextUpBar(currentVideoId) {
  const nextVideo = getAutoNextVideo(currentVideoId);
  state.nextUpVideoId = nextVideo?.id || null;
  if (!nextVideo) {
    dom.nextUpBar.classList.add('hidden');
    dom.nextUpText.textContent = '';
    const preloadVideo = ensurePreloadVideoElement();
    preloadVideo.removeAttribute('src');
    preloadVideo.load();
    delete preloadVideo.dataset.videoId;
    return;
  }

  dom.nextUpText.textContent = `下一条：${nextVideo.title} · ${nextVideo.duration}`;
  dom.nextUpBar.classList.remove('hidden');

  const preloadVideo = ensurePreloadVideoElement();
  if (preloadVideo.dataset.videoId === String(nextVideo.id)) return;
  preloadVideo.dataset.videoId = String(nextVideo.id);
  preloadVideo.src = nextVideo.src;
  preloadVideo.load();
}

function renderRelatedSection(currentVideo) {
  const related = getRelatedVideos(currentVideo, 3);
  state.relatedVideoIds = related.map((video) => video.id);
  if (!related.length) {
    dom.relatedSection.classList.add('hidden');
    dom.relatedList.innerHTML = '';
    return;
  }

  dom.relatedList.innerHTML = related
    .map((video) => `
      <button class="related-item" type="button" data-id="${video.id}" aria-label="播放推荐视频 ${escapeHtml(video.title)}">
        <strong>${escapeHtml(video.title)}</strong>
        <span>${escapeHtml(video.category)} · ${escapeHtml(video.duration)} · ${escapeHtml(formatPublishDate(video.publishedAt))}</span>
      </button>
    `)
    .join('');
  dom.relatedSection.classList.remove('hidden');
}

function clearPlayerDiscovery() {
  state.nextUpVideoId = null;
  state.relatedVideoIds = [];
  dom.nextUpBar.classList.add('hidden');
  dom.nextUpText.textContent = '';
  dom.relatedSection.classList.add('hidden');
  dom.relatedList.innerHTML = '';
}

function openPlayer(video, options = {}) {
  const autoPlay = options.autoPlay !== false;
  stopCardHoverPreview();
  if (state.currentPlayingVideoId && state.currentPlayingVideoId !== video.id) {
    savePlaybackProgress(true);
  }
  state.currentPlayingVideoId = video.id;
  state.playbackFallbackTried = false;
  state.lastProgressWriteAt = 0;
  clearResumePrompt();
  clearPlayerDiscovery();

  dom.modalTitle.textContent = video.title;
  dom.modalDescription.textContent = `${video.description}（标签：${video.tags.join(' / ') || '无'}）`;
  const safeVideoSource = normalizeSafeMediaUrl(video.src);
  if (!safeVideoSource) {
    setPlayerStatus('当前视频源地址不安全或无效。', true);
    return;
  }
  dom.videoPlayer.src = safeVideoSource;
  dom.videoPlayer.playbackRate = state.playerPrefs.rate;
  dom.videoPlayer.volume = state.playerPrefs.volume;
  dom.videoPlayer.muted = state.playerPrefs.muted;
  dom.speedSelect.value = String(state.playerPrefs.rate);
  dom.autoNextToggle.checked = Boolean(state.playerPrefs.autoNext);
  updateMuteButton();
  updatePipButton();
  renderNextUpBar(video.id);
  renderRelatedSection(video);
  syncPlayerStateToUrl(video.id);
  dom.playerModal.classList.add('show');
  dom.playerModal.setAttribute('aria-hidden', 'false');
  const playerContent = dom.playerModal.querySelector('.modal-content');
  if (playerContent) {
    playerContent.scrollTop = 0;
  }

  if (!autoPlay) {
    setPlayerStatus('已就绪，点击播放开始观看。', false, true);
    return;
  }

  setPlayerStatus('正在加载视频...', false, true);
  const playTask = dom.videoPlayer.play();
  if (playTask?.catch) {
    playTask.catch(() => {
      setPlayerStatus('已就绪，点击播放器开始播放。', false, true);
    });
  }
}

function exitPictureInPictureIfNeeded() {
  if (document.pictureInPictureElement !== dom.videoPlayer) return;
  if (typeof document.exitPictureInPicture !== 'function') return;
  document.exitPictureInPicture().catch(() => {
    // Ignore PiP exit failures when modal closes quickly.
  });
}

async function togglePictureInPicture() {
  if (!canUsePictureInPicture()) {
    setPlayerStatus('当前浏览器不支持画中画。', true);
    return;
  }
  if (!state.currentPlayingVideoId) {
    setPlayerStatus('请先播放一个视频。', true);
    return;
  }

  try {
    if (document.pictureInPictureElement === dom.videoPlayer) {
      await document.exitPictureInPicture();
    } else {
      await dom.videoPlayer.requestPictureInPicture();
    }
  } catch (_error) {
    setPlayerStatus('画中画切换失败，请稍后重试。', true);
  }
}

function closePlayer() {
  exitPictureInPictureIfNeeded();
  savePlaybackProgress(true);
  stopCardHoverPreview();
  clearResumePrompt();
  clearPlayerDiscovery();
  dom.playerModal.classList.remove('show');
  dom.playerModal.setAttribute('aria-hidden', 'true');
  dom.videoPlayer.pause();
  dom.videoPlayer.removeAttribute('src');
  dom.videoPlayer.load();
  state.currentPlayingVideoId = null;
  state.playbackFallbackTried = false;
  if (state.preloadVideoEl) {
    state.preloadVideoEl.removeAttribute('src');
    state.preloadVideoEl.load();
    delete state.preloadVideoEl.dataset.videoId;
  }
  syncPlayerStateToUrl(null);
  updatePipButton();
  renderVideos();
  renderQuickSections();
  renderProfileCenter();
  renderProfileHistorySection();
  setPlayerStatus('');
}

function openAuthModal(mode = 'login') {
  state.authMode = mode;
  renderAuthMode();
  dom.authUsername.value = '';
  dom.authPassword.value = '';
  dom.authConfirmPassword.value = '';
  setAuthPasswordVisibility(false);
  dom.authModal.classList.add('show');
  dom.authModal.setAttribute('aria-hidden', 'false');
  updateAuthDraftHint();
  setTimeout(() => {
    dom.authUsername.focus();
  }, 0);
}

function closeAuthModal() {
  dom.authModal.classList.remove('show');
  dom.authModal.setAttribute('aria-hidden', 'true');
}

function openAccountModal() {
  if (!state.currentUser) {
    openAuthModal('login');
    return;
  }
  dom.accountUsername.value = state.currentUser.username;
  if (dom.accountBirthDate) {
    dom.accountBirthDate.value = String(state.currentUser.birthDate || '');
  }
  if (dom.accountGender) {
    dom.accountGender.value = normalizeGender(state.currentUser.gender);
  }
  if (dom.accountAge) {
    dom.accountAge.value = Number.isFinite(Number(state.currentUser.age)) ? String(state.currentUser.age) : '';
  }
  if (dom.accountAvatarFile) {
    dom.accountAvatarFile.value = '';
  }
  setAccountAvatarDraft(state.currentUser.avatar || '');
  refreshAccountAvatarIndicators();
  dom.accountStatus.textContent = '';
  dom.accountModal.classList.add('show');
  dom.accountModal.setAttribute('aria-hidden', 'false');
}

function closeAccountModal() {
  dom.accountModal.classList.remove('show');
  dom.accountModal.setAttribute('aria-hidden', 'true');
}

function openEditVideoModal(videoId) {
  if (!state.currentUser) {
    openAuthModal('login');
    return;
  }
  const targetId = Number(videoId);
  const target = state.videos.find((video) => video.id === targetId);
  if (!target || !canManageVideo(target)) {
    return;
  }

  state.editingVideoId = target.id;
  dom.editVideoTitle.value = target.title;
  dom.editVideoCategory.value = target.category;
  dom.editVideoDuration.value = target.duration;
  dom.editVideoPublishedAt.value = toDateTimeLocalValue(target.publishedAt);
  dom.editVideoTags.value = Array.isArray(target.tags) ? target.tags.join(',') : '';
  dom.editVideoDescription.value = target.description || '';
  dom.editVideoStatus.textContent = '';
  dom.editVideoModal.classList.add('show');
  dom.editVideoModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    dom.editVideoTitle.focus();
  }, 0);
}

function closeEditVideoModal() {
  state.editingVideoId = null;
  dom.editVideoForm.reset();
  dom.editVideoStatus.textContent = '';
  dom.editVideoModal.classList.remove('show');
  dom.editVideoModal.setAttribute('aria-hidden', 'true');
}

function handleEditVideoSubmit(event) {
  event.preventDefault();

  if (!state.currentUser) {
    closeEditVideoModal();
    openAuthModal('login');
    return;
  }

  const videoId = Number(state.editingVideoId);
  const target = state.videos.find((video) => video.id === videoId);
  if (!target) {
    setMessage(dom.editVideoStatus, '视频不存在或已被删除。', true);
    return;
  }
  if (!canManageVideo(target)) {
    setMessage(dom.editVideoStatus, '你无权编辑这个视频。', true);
    return;
  }

  const title = sanitizeSingleLineText(dom.editVideoTitle.value, 60);
  const category = sanitizeSingleLineText(dom.editVideoCategory.value, 20);
  const duration = sanitizeSingleLineText(dom.editVideoDuration.value, 10);
  const publishedAt = Date.parse(String(dom.editVideoPublishedAt.value || '').trim());
  const tags = splitTags(dom.editVideoTags.value.trim());
  const description = sanitizeSingleLineText(dom.editVideoDescription.value, 220) || '用户上传视频';

  if (!title || !category || !duration || !Number.isFinite(publishedAt)) {
    setMessage(dom.editVideoStatus, '请补全标题、分类、时长和发布时间。', true);
    return;
  }

  const duplicated = state.videos.some((video) => (
    video.id !== target.id && String(video.title || '').toLowerCase() === title.toLowerCase()
  ));
  if (duplicated) {
    setMessage(dom.editVideoStatus, '该标题已存在，请换一个标题。', true);
    return;
  }

  const updatedVideo = normalizeVideo({
    ...target,
    title,
    category,
    duration,
    publishedAt,
    tags,
    description
  });

  const unchanged = (
    target.title === updatedVideo.title
    && target.category === updatedVideo.category
    && target.duration === updatedVideo.duration
    && Number(target.publishedAt || 0) === Number(updatedVideo.publishedAt || 0)
    && target.description === updatedVideo.description
    && JSON.stringify(target.tags || []) === JSON.stringify(updatedVideo.tags || [])
  );
  if (unchanged) {
    setMessage(dom.editVideoStatus, '未检测到变化。');
    return;
  }

  state.videos = state.videos.map((video) => (video.id === target.id ? updatedVideo : video));
  persistVideos();
  closeEditVideoModal();
  setMessage(dom.uploadStatus, `《${updatedVideo.title}》信息已更新。`);
  renderAll();
}

function setMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#c53030' : '#2f855a';
}

function getNextVideoId() {
  return state.videos.reduce((max, video) => Math.max(max, Number(video.id) || 0), 0) + 1;
}

function splitTags(rawText) {
  return rawText
    .split(',')
    .map((item) => sanitizeSingleLineText(item, 20))
    .filter(Boolean)
    .slice(0, 10);
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const minute = Math.floor(safe / 60).toString().padStart(2, '0');
  const second = (safe % 60).toString().padStart(2, '0');
  return `${minute}:${second}`;
}

function setPlayerStatus(message = '', isError = false, hold = false) {
  if (state.playerStatusTimer) {
    clearTimeout(state.playerStatusTimer);
    state.playerStatusTimer = null;
  }

  dom.playerStatus.textContent = message;
  dom.playerStatus.style.color = isError ? '#c53030' : '#486581';

  if (!hold && message) {
    state.playerStatusTimer = setTimeout(() => {
      dom.playerStatus.textContent = '';
      state.playerStatusTimer = null;
    }, 2200);
  }
}

function inferVideoFileExtension(video) {
  const source = String(video?.src || '').trim();
  if (!source) return 'mp4';

  const dataMatch = source.match(/^data:video\/([a-z0-9.+-]+)/i);
  if (dataMatch?.[1]) {
    const subtype = dataMatch[1].toLowerCase();
    if (subtype === 'quicktime') return 'mov';
    if (subtype.includes('matroska')) return 'mkv';
    return subtype.split('+')[0].split(';')[0] || 'mp4';
  }

  try {
    const url = new URL(source, window.location.href);
    const path = String(url.pathname || '');
    const extMatch = path.match(/\.([a-z0-9]{2,5})$/i);
    if (extMatch?.[1]) return extMatch[1].toLowerCase();
  } catch (_error) {
    // Ignore parsing errors and fallback to default extension.
  }
  return 'mp4';
}

function sanitizeDownloadFileName(rawName) {
  const base = String(rawName || '').trim() || 'video';
  return base.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 80) || 'video';
}

function triggerDownloadLink(href, fileName) {
  const safeHref = normalizeSafeUrl(href, {
    allowBlob: true,
    allowDataImage: true,
    allowDataVideo: true
  });
  if (!safeHref) {
    throw new Error('unsafe_download_url');
  }
  const anchor = document.createElement('a');
  anchor.href = safeHref;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function downloadVideo(video) {
  if (!video) {
    setPlayerStatus('当前视频不存在，无法下载。', true);
    return;
  }
  const source = normalizeSafeMediaUrl(video.src);
  if (!source) {
    setPlayerStatus('该视频暂无可下载源地址。', true);
    return;
  }

  const extension = inferVideoFileExtension(video);
  const fileName = `${sanitizeDownloadFileName(video.title)}.${extension}`;

  if (source.startsWith('data:') || source.startsWith('blob:')) {
    triggerDownloadLink(source, fileName);
    setPlayerStatus('已开始下载视频。', false, true);
    return;
  }

  try {
    setPlayerStatus('正在准备下载...', false, true);
    const response = await fetch(source, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('download_not_ok');
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerDownloadLink(blobUrl, fileName);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
    setPlayerStatus('已开始下载视频。', false, true);
  } catch (_error) {
    try {
      triggerDownloadLink(source, fileName);
      setPlayerStatus('已尝试下载，若未生效请在新标签页另存视频。', false, true);
    } catch (_nextError) {
      setPlayerStatus('当前视频源不支持直接下载。', true);
    }
  }
}

function clearResumePrompt() {
  state.pendingResumeTime = 0;
  dom.resumeBar.classList.add('hidden');
  dom.resumeText.textContent = '';
}

function savePlaybackProgress(force = false) {
  const videoId = state.currentPlayingVideoId;
  if (!videoId) return;
  const key = String(videoId);
  const currentTime = Number(dom.videoPlayer.currentTime || 0);

  // 当快速关闭播放器时，metadata 可能尚未加载完成，仍尽量保留极短播放记录。
  if (!Number.isFinite(dom.videoPlayer.duration) || dom.videoPlayer.duration <= 0) {
    if (!force || currentTime < 0.05) return;
    const normalized = Math.max(0.1, Number(currentTime.toFixed(1)));
    const existing = Number(state.playbackHistory[key] || 0);
    if (Number.isFinite(existing) && existing > normalized) return;
    state.playbackHistory[key] = normalized;
    persistPlaybackHistory();
    return;
  }

  const duration = dom.videoPlayer.duration;

  if (currentTime >= duration - 2) {
    if (state.playbackHistory[key] !== undefined) {
      delete state.playbackHistory[key];
      persistPlaybackHistory();
    }
    return;
  }

  if (currentTime < (force ? 0.05 : 3)) return;
  if (!force && Date.now() - state.lastProgressWriteAt < 1200) return;

  const existing = Number(state.playbackHistory[key] || 0);
  if (!force && Math.abs(existing - currentTime) < 1.5) return;

  const normalized = force
    ? Math.max(0.1, Number(currentTime.toFixed(1)))
    : Number(currentTime.toFixed(1));
  state.playbackHistory[key] = normalized;
  state.lastProgressWriteAt = Date.now();
  persistPlaybackHistory();
}

function applyResumePrompt() {
  const videoId = state.currentPlayingVideoId;
  const duration = dom.videoPlayer.duration;
  if (!videoId || !Number.isFinite(duration) || duration <= 15) {
    clearResumePrompt();
    return;
  }

  const key = String(videoId);
  const resumeAt = Number(state.playbackHistory[key] || 0);
  if (resumeAt < 5 || resumeAt >= duration - 8) {
    clearResumePrompt();
    return;
  }

  state.pendingResumeTime = resumeAt;
  dom.resumeText.textContent = `检测到上次看到 ${formatClock(resumeAt)}，是否继续？`;
  dom.resumeBar.classList.remove('hidden');
}

function updateProgressBar(target, ratio) {
  if (!target) return;
  const safe = Math.max(0, Math.min(1, Number(ratio) || 0));
  target.style.width = `${Math.round(safe * 100)}%`;
}

function resetUploadProgress() {
  // 上传区已移除进度条，保留函数用于兼容已有调用。
}

function seekBy(deltaSeconds) {
  if (!state.currentPlayingVideoId) return;
  const duration = dom.videoPlayer.duration;
  const current = dom.videoPlayer.currentTime || 0;
  const target = Number.isFinite(duration) && duration > 0
    ? Math.min(Math.max(current + deltaSeconds, 0), Math.max(duration - 0.2, 0))
    : Math.max(current + deltaSeconds, 0);
  dom.videoPlayer.currentTime = target;
  setPlayerStatus(`已跳转到 ${formatClock(target)}`);
  savePlaybackProgress(true);
}

function bindPlayerEvents() {
  dom.videoPlayer.addEventListener('loadedmetadata', () => {
    applyResumePrompt();
    if (Number.isFinite(dom.videoPlayer.duration) && dom.videoPlayer.duration > 0) {
      setPlayerStatus(`时长 ${formatClock(dom.videoPlayer.duration)}，支持方向键快进/快退与 J 播放下一条。`);
    }
  });

  dom.videoPlayer.addEventListener('playing', () => {
    setPlayerStatus('播放中');
  });

  dom.videoPlayer.addEventListener('waiting', () => {
    setPlayerStatus('缓冲中...', false, true);
  });

  dom.videoPlayer.addEventListener('stalled', () => {
    setPlayerStatus('网络波动，正在尝试恢复播放。', false, true);
  });

  dom.videoPlayer.addEventListener('error', () => {
    if (state.currentPlayingVideoId && !state.playbackFallbackTried) {
      const currentVideo = state.videos.find((video) => video.id === state.currentPlayingVideoId);
      const fallbackSource = normalizeSafeMediaUrl(currentVideo ? PLAYABLE_FALLBACK_SOURCE_MAP[currentVideo.title] : '');
      if (currentVideo && fallbackSource && currentVideo.src !== fallbackSource) {
        state.playbackFallbackTried = true;
        dom.videoPlayer.src = fallbackSource;
        setPlayerStatus('主线路波动，已自动切换备用播放源。', true, true);
        const playTask = dom.videoPlayer.play();
        if (playTask?.catch) {
          playTask.catch(() => {
            setPlayerStatus('备用源已就绪，点击播放继续观看。', false, true);
          });
        }
        return;
      }
    }
    setPlayerStatus('视频加载失败，请检查视频链接是否可访问。', true, true);
  });

  dom.videoPlayer.addEventListener('timeupdate', () => {
    savePlaybackProgress();
  });

  dom.videoPlayer.addEventListener('ratechange', () => {
    state.playerPrefs.rate = dom.videoPlayer.playbackRate;
    dom.speedSelect.value = String(dom.videoPlayer.playbackRate);
    persistPlayerPrefs();
  });

  dom.videoPlayer.addEventListener('volumechange', () => {
    state.playerPrefs.volume = dom.videoPlayer.volume;
    state.playerPrefs.muted = dom.videoPlayer.muted;
    updateMuteButton();
    persistPlayerPrefs();
  });

  dom.videoPlayer.addEventListener('enterpictureinpicture', () => {
    updatePipButton();
    setPlayerStatus('已进入画中画');
  });

  dom.videoPlayer.addEventListener('leavepictureinpicture', () => {
    updatePipButton();
    setPlayerStatus('已退出画中画');
  });

  dom.videoPlayer.addEventListener('ended', () => {
    savePlaybackProgress(true);
    const finishedVideoId = state.currentPlayingVideoId;
    if (!finishedVideoId) return;
    delete state.playbackHistory[String(finishedVideoId)];
    persistPlaybackHistory();
    clearResumePrompt();

    if (state.playerPrefs.autoNext) {
      const nextVideo = getAutoNextVideo(finishedVideoId);
      if (nextVideo) {
        setPlayerStatus(`正在连播《${nextVideo.title}》...`, false, true);
        openPlayer(nextVideo);
        return;
      }
    }

    setPlayerStatus('播放结束');
  });
}

function fileToDataUrl(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(event.loaded / event.total);
      }
    };
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('文件读取失败，请重试。'));
    reader.readAsDataURL(file);
  });
}

function detectLocalVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.src = objectUrl;
    probe.onloadedmetadata = () => {
      const seconds = probe.duration;
      URL.revokeObjectURL(objectUrl);
      if (!Number.isFinite(seconds) || seconds <= 0) {
        reject(new Error('无法读取视频时长，请手动填写。'));
        return;
      }
      resolve(formatClock(seconds));
    };
    probe.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('无法解析该视频文件，请检查格式。'));
    };
  });
}

async function resolveUploadSource(fileInput, maxSize, onProgress) {
  const file = fileInput.files[0];
  if (file) {
    if (Number.isFinite(maxSize) && maxSize > 0 && file.size > maxSize) {
      throw new Error(`文件过大，限制 ${(maxSize / 1024 / 1024).toFixed(0)}MB。`);
    }
    onProgress?.(0.05);
    const result = await fileToDataUrl(file, onProgress);
    onProgress?.(1);
    return result;
  }
  onProgress?.(0);
  return '';
}

function removeVideo(videoId) {
  const target = state.videos.find((video) => video.id === videoId);
  if (!target || !canManageVideo(target)) {
    return;
  }

  if (Number(state.editingVideoId) === Number(videoId)) {
    closeEditVideoModal();
  }

  state.videos = state.videos.filter((video) => video.id !== videoId);
  delete state.playbackHistory[String(videoId)];
  removeVideoFromAllFavorites(videoId);

  if (state.featuredId === videoId) {
    state.featuredId = null;
    persistFeatured();
  }

  persistVideos();
  persistPlaybackHistory();
  renderAll();
}

function removeUserByAdmin(userId) {
  const targetIndex = state.users.findIndex((user) => user.id === userId);
  const target = targetIndex >= 0 ? state.users[targetIndex] : null;
  if (!target) {
    return { removedVideos: 0, username: '' };
  }
  if (isSuperAdmin(target)) {
    return { removedVideos: 0, username: target.username };
  }

  const removedVideoIds = state.videos
    .filter((video) => video.ownerId === userId)
    .map((video) => Number(video.id))
    .filter((id) => Number.isFinite(id));
  const removedVideoIdSet = new Set(removedVideoIds);

  state.users.splice(targetIndex, 1);
  if (removedVideoIdSet.size > 0) {
    state.videos = state.videos.filter((video) => !removedVideoIdSet.has(Number(video.id)));
  }

  let playbackChanged = false;
  Object.keys(state.playbackHistory).forEach((key) => {
    if (!removedVideoIdSet.has(Number(key))) return;
    delete state.playbackHistory[key];
    playbackChanged = true;
  });

  let favoritesChanged = false;
  const userFavoriteKey = `user:${userId}`;
  if (state.favoritesByUser[userFavoriteKey] !== undefined) {
    delete state.favoritesByUser[userFavoriteKey];
    favoritesChanged = true;
  }
  Object.keys(state.favoritesByUser).forEach((key) => {
    const prevIds = normalizeFavoriteIds(state.favoritesByUser[key]);
    const nextIds = prevIds.filter((id) => !removedVideoIdSet.has(Number(id)));
    if (nextIds.length === prevIds.length) return;
    favoritesChanged = true;
    if (nextIds.length > 0) {
      state.favoritesByUser[key] = nextIds;
    } else {
      delete state.favoritesByUser[key];
    }
  });

  if (state.featuredId !== null && removedVideoIdSet.has(Number(state.featuredId))) {
    state.featuredId = null;
    persistFeatured();
  }

  if (state.currentPlayingVideoId !== null && removedVideoIdSet.has(Number(state.currentPlayingVideoId))) {
    closePlayer();
  }
  if (state.editingVideoId !== null && removedVideoIdSet.has(Number(state.editingVideoId))) {
    closeEditVideoModal();
  }

  persistUsers();
  persistVideos();
  if (playbackChanged) {
    persistPlaybackHistory();
  }
  if (favoritesChanged) {
    persistFavorites();
  }

  return {
    removedVideos: removedVideoIdSet.size,
    username: target.username
  };
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const username = sanitizeSingleLineText(dom.authUsername.value, 20);
  const password = dom.authPassword.value.trim();
  const confirmPassword = dom.authConfirmPassword.value.trim();

  if (username.length < 3) {
    setMessage(dom.authHint, '用户名至少 3 位。', true);
    return;
  }

  if (/\s/.test(username)) {
    setMessage(dom.authHint, '用户名不能包含空格。', true);
    return;
  }

  if (state.authMode === 'login') {
    const lockRemainingMs = getLoginLockRemainingMs(username);
    if (lockRemainingMs > 0) {
      setMessage(dom.authHint, `该账号尝试过于频繁，请 ${Math.ceil(lockRemainingMs / 1000)} 秒后重试。`, true);
      return;
    }
    if (!password) {
      setMessage(dom.authHint, `请输入密码。${authPasswordRuleHintText()}`, true);
      return;
    }
    const foundUser = findUserByUsername(username);
    const isAuthenticated = foundUser ? await verifyUserPassword(foundUser, password) : false;
    if (!foundUser || !isAuthenticated) {
      const failureState = recordLoginFailure(username);
      if (failureState.locked) {
        setMessage(dom.authHint, `用户名或密码连续错误，账号已锁定 ${failureState.lockSeconds} 秒。`, true);
        return;
      }
      setMessage(
        dom.authHint,
        `用户名或密码不正确，还可尝试 ${failureState.remainingAttempts} 次。${authPasswordRuleHintText()}`,
        true
      );
      return;
    }
    clearLoginSecurityState(username);
    if (isUserBlacklisted(foundUser)) {
      setMessage(dom.authHint, '该账号已被拉黑，请联系管理员。', true);
      return;
    }

    state.currentUser = foundUser;
    startAuthSession();
    persistCurrentUser();
    closeAuthModal();
    renderAll();
    consumeSharedVideoFromUrl();
    return;
  }

  const duplicated = Boolean(findUserByUsername(username));
  if (duplicated) {
    setMessage(dom.authHint, '该用户名已存在，请换一个。', true);
    return;
  }

  if (!isPasswordStrong(password)) {
    setMessage(dom.authHint, `密码格式不符合要求。${authPasswordRuleHintText()}`, true);
    return;
  }

  if (!confirmPassword) {
    setMessage(dom.authHint, '请再次输入确认密码。', true);
    return;
  }

  if (confirmPassword !== password) {
    setMessage(dom.authHint, '两次输入密码不一致。', true);
    return;
  }

  const credential = await createPasswordCredential(password);
  if (!credential) {
    setMessage(dom.authHint, '当前浏览器不支持安全加密能力，请升级后再注册。', true);
    return;
  }

  const newUser = normalizeUser({
    id: generateUserId(),
    username,
    password: '',
    passwordHash: credential.passwordHash,
    passwordSalt: credential.passwordSalt,
    passwordIterations: credential.passwordIterations,
    passwordAlgo: credential.passwordAlgo,
    role: 'user',
    blacklisted: false,
    createdAt: Date.now()
  });

  state.users.push(newUser);
  state.currentUser = newUser;
  startAuthSession();
  persistUsers();
  persistCurrentUser();
  closeAuthModal();
  renderAll();
  consumeSharedVideoFromUrl();
}

function handleAccountSubmit(event) {
  event.preventDefault();

  if (!state.currentUser) {
    setMessage(dom.accountStatus, '请先登录后再修改账号信息。', true);
    return;
  }

  if (isUserBlacklisted(state.currentUser)) {
    state.currentUser = null;
    persistCurrentUser();
    closeAccountModal();
    setMessage(dom.authHint, '该账号已被拉黑，请联系管理员。', true);
    return;
  }

  const nextUsername = sanitizeSingleLineText(dom.accountUsername.value, 20);
  const nextAvatar = normalizeSafeAvatarUrl(state.accountAvatarDraft);
  const birthDateRaw = String(dom.accountBirthDate?.value || '').trim();
  const nextBirthDate = normalizeBirthDate(birthDateRaw);
  const nextGender = normalizeGender(dom.accountGender?.value);
  const ageRaw = String(dom.accountAge?.value || '').trim();
  const computedAge = calcAgeFromBirthDate(nextBirthDate);
  let nextAge = null;

  if (nextUsername.length < 3) {
    setMessage(dom.accountStatus, '账号名至少 3 位。', true);
    return;
  }

  if (/\s/.test(nextUsername)) {
    setMessage(dom.accountStatus, '账号名不能包含空格。', true);
    return;
  }

  if (birthDateRaw && !nextBirthDate) {
    setMessage(dom.accountStatus, '出生年月日格式无效，请重新选择。', true);
    return;
  }

  if (ageRaw) {
    const parsedAge = Number(ageRaw);
    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setMessage(dom.accountStatus, '年龄需在 0-120 之间。', true);
      return;
    }
    nextAge = Math.floor(parsedAge);
  } else {
    nextAge = computedAge;
  }

  if (nextBirthDate && Number.isFinite(Number(nextAge)) && Number.isFinite(Number(computedAge))) {
    if (Math.abs(Number(nextAge) - Number(computedAge)) > 1) {
      setMessage(dom.accountStatus, `年龄与出生年月日不一致（按出生日期应约为 ${computedAge} 岁）。`, true);
      return;
    }
  }

  const duplicatedUser = findUserByUsername(nextUsername);
  if (duplicatedUser && duplicatedUser.id !== state.currentUser.id) {
    setMessage(dom.accountStatus, '该账号名已存在，请更换。', true);
    return;
  }

  const user = state.users.find((item) => item.id === state.currentUser.id);
  if (!user) {
    setMessage(dom.accountStatus, '账号状态异常，请重新登录。', true);
    return;
  }

  const usernameChanged = user.username !== nextUsername;
  const avatarChanged = String(user.avatar || '') !== nextAvatar;
  const birthDateChanged = String(user.birthDate || '') !== nextBirthDate;
  const genderChanged = normalizeGender(user.gender) !== nextGender;
  const ageChanged = Number(user.age) !== Number(nextAge);

  if (!usernameChanged && !avatarChanged && !birthDateChanged && !genderChanged && !ageChanged) {
    setMessage(dom.accountStatus, '未检测到变化。');
    return;
  }

  if (isSuperAdmin(user)) {
    if (usernameChanged) {
      setMessage(dom.accountStatus, '总管理员账号名不可修改。', true);
      dom.accountUsername.value = user.username;
      return;
    }
  }

  user.username = nextUsername;
  user.avatar = nextAvatar;
  user.birthDate = nextBirthDate;
  user.gender = nextGender;
  user.age = Number.isFinite(Number(nextAge)) ? Number(nextAge) : null;

  if (usernameChanged) {
    state.videos = state.videos.map((video) => {
      if (video.ownerId !== user.id) return video;
      return {
        ...video,
        ownerName: nextUsername
      };
    });
    persistVideos();
  }

  state.currentUser = user;
  persistUsers();
  persistCurrentUser();

  setAccountAvatarDraft(user.avatar || '');
  refreshAccountAvatarIndicators();

  setMessage(dom.accountStatus, '资料更新成功。');
  renderAll();
}

async function handlePasswordSubmit(event) {
  event.preventDefault();
  if (!dom.passwordStatus) return;

  if (!state.currentUser) {
    setMessage(dom.passwordStatus, '请先登录后再修改密码。', true);
    openAuthModal('login');
    return;
  }

  if (isUserBlacklisted(state.currentUser)) {
    state.currentUser = null;
    persistCurrentUser();
    setMessage(dom.passwordStatus, '该账号已被拉黑，无法修改密码。', true);
    openAuthModal('login');
    return;
  }

  const currentPassword = String(dom.passwordCurrentPassword?.value || '').trim();
  const nextPassword = String(dom.passwordNewPassword?.value || '').trim();
  const confirmPassword = String(dom.passwordConfirmPassword?.value || '').trim();

  const currentPasswordValid = await verifyUserPassword(state.currentUser, currentPassword);
  if (!currentPasswordValid) {
    setMessage(dom.passwordStatus, '当前密码不正确。', true);
    return;
  }

  if (!isPasswordStrong(nextPassword)) {
    setMessage(dom.passwordStatus, passwordRuleText(), true);
    return;
  }

  if (nextPassword !== confirmPassword) {
    setMessage(dom.passwordStatus, '两次输入的新密码不一致。', true);
    return;
  }

  if (nextPassword === currentPassword) {
    setMessage(dom.passwordStatus, '新密码不能与当前密码相同。', true);
    return;
  }

  const user = state.users.find((item) => item.id === state.currentUser.id);
  if (!user) {
    setMessage(dom.passwordStatus, '账号状态异常，请重新登录。', true);
    return;
  }

  const credential = await createPasswordCredential(nextPassword);
  if (!credential) {
    setMessage(dom.passwordStatus, '当前浏览器不支持安全加密能力，无法修改密码。', true);
    return;
  }
  applyPasswordCredentialToUser(user, credential);
  state.currentUser = user;
  persistUsers();
  persistCurrentUser();

  if (dom.passwordForm) {
    dom.passwordForm.reset();
  }
  setMessage(dom.passwordStatus, '密码修改成功。');
}

async function handleUploadSubmit(event) {
  event.preventDefault();
  if (!canUseUploadForm()) return;

  if (!state.currentUser) {
    openAuthModal('login');
    return;
  }
  if (isUserBlacklisted(state.currentUser)) {
    state.currentUser = null;
    persistCurrentUser();
    openAuthModal('login');
    setMessage(dom.authHint, '该账号已被拉黑，无法上传内容。', true);
    return;
  }

  setMessage(dom.uploadStatus, '正在发布，请稍候...');
  resetUploadProgress();
  persistUploadDraft();

  try {
    const src = await resolveUploadSource(dom.uploadVideoFile, MAX_VIDEO_FILE_SIZE);
    const coverFromInput = await resolveUploadSource(dom.uploadCoverFile, MAX_IMAGE_FILE_SIZE);

    if (!src) {
      throw new Error('请上传本地视频文件。');
    }

    const title = sanitizeSingleLineText(dom.uploadTitle.value, 60);
    const category = sanitizeSingleLineText(dom.uploadCategory.value, 20);
    const duration = sanitizeSingleLineText(dom.uploadDuration.value, 10);
    const publishedAt = Date.parse(String(dom.uploadPublishedAt.value || '').trim());
    const duplicated = state.videos.some((video) => video.title.toLowerCase() === title.toLowerCase());
    if (duplicated) {
      throw new Error('该标题已存在，请换一个标题后再上传。');
    }

    const newVideo = normalizeVideo({
      id: getNextVideoId(),
      title,
      category,
      duration,
      publishedAt,
      tags: [],
      description: sanitizeSingleLineText(dom.uploadDescription.value, 220) || '用户上传视频',
      src,
      cover: coverFromInput || DEFAULT_COVER,
      status: state.siteSettings.requireApproval && !isAdmin() ? 'pending' : 'approved',
      ownerId: state.currentUser.id,
      ownerName: state.currentUser.username,
      createdAt: Date.now()
    });

    if (!newVideo.title || !newVideo.category || !newVideo.duration || !Number.isFinite(newVideo.publishedAt)) {
      throw new Error('请补全标题、分类、时长和发布时间。');
    }

    state.videos.unshift(newVideo);

    const persisted = await persistVideos();
    if (!persisted) {
      state.videos = state.videos.filter((video) => Number(video.id) !== Number(newVideo.id));
      throw new Error('存储空间不足，无法保存视频。请清理浏览器站点数据后重试。');
    }
    dom.uploadForm.reset();
    refreshUploadFileIndicators();
    clearUploadDraft();
    ensureUploadPublishedAtValue();
    resetUploadProgress();
    if (newVideo.status === 'pending') {
      setMessage(dom.uploadStatus, '上传成功，已提交管理员审核。');
    } else {
      setMessage(dom.uploadStatus, '发布成功，视频已加入视频库。');
    }
    renderAll();
  } catch (error) {
    resetUploadProgress();
    refreshUploadFileIndicators();
    setMessage(dom.uploadStatus, error.message || '发布失败，请重试。', true);
  }
}

function handleAdminVideoAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const videoId = Number(button.dataset.id);
  const target = state.videos.find((video) => video.id === videoId);
  if (!target || !isAdmin()) return;

  if (action === 'approve-video') {
    target.status = 'approved';
    persistVideos();
    setMessage(dom.settingsStatus, `已通过《${target.title}》`);
    renderAll();
    return;
  }

  if (action === 'reject-video') {
    target.status = 'rejected';
    persistVideos();
    if (Number(state.featuredId) === Number(target.id)) {
      state.featuredId = null;
      persistFeatured();
    }
    setMessage(dom.settingsStatus, `已驳回《${target.title}》`, true);
    renderAll();
    return;
  }

  if (action === 'set-featured') {
    if (target.status !== 'approved') {
      setMessage(dom.settingsStatus, '仅审核通过的视频可设为推荐。', true);
      return;
    }
    state.featuredId = target.id;
    persistFeatured();
    setMessage(dom.settingsStatus, `已将《${target.title}》设为首页推荐。`);
    renderAll();
    return;
  }

  if (action === 'delete-video') {
    const confirmed = window.confirm('确认删除这个视频吗？');
    if (!confirmed) return;
    removeVideo(videoId);
  }
}

async function handleAdminUserAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button || !isAdmin()) return;

  const action = button.dataset.action;
  const userId = button.dataset.id;
  const target = state.users.find((user) => user.id === userId);
  if (!target) return;
  const actorIsSuperAdmin = isSuperAdmin(state.currentUser);
  const isSelf = state.currentUser?.id === target.id;
  const protectedUser = isSuperAdmin(target);

  if (action === 'toggle-role') {
    if (!actorIsSuperAdmin && target.role !== 'user') {
      setMessage(dom.settingsStatus, '普通管理员仅可将普通用户升级为管理员。', true);
      return;
    }
    if (protectedUser) {
      setMessage(dom.settingsStatus, '总管理员账号不可降级。', true);
      return;
    }
    if (isSelf) {
      setMessage(dom.settingsStatus, '不能修改当前登录管理员自己的角色。', true);
      return;
    }
    if (target.role === 'admin' && !isUserBlacklisted(target) && getActiveAdminCount() <= 1) {
      setMessage(dom.settingsStatus, '不能降级最后一个可用管理员。', true);
      return;
    }
    target.role = target.role === 'admin' ? 'user' : 'admin';
    persistUsers();
    setMessage(dom.settingsStatus, `已更新用户 ${target.username} 的角色。`);
    renderAll();
    return;
  }

  if (action === 'toggle-blacklist') {
    if (!actorIsSuperAdmin && target.role !== 'user') {
      setMessage(dom.settingsStatus, '普通管理员仅可拉黑或解除拉黑普通用户。', true);
      return;
    }
    if (protectedUser) {
      setMessage(dom.settingsStatus, '总管理员账号不可拉黑。', true);
      return;
    }
    if (isSelf) {
      setMessage(dom.settingsStatus, '不能拉黑当前登录管理员自己。', true);
      return;
    }
    if (!isUserBlacklisted(target) && target.role === 'admin' && getActiveAdminCount() <= 1) {
      setMessage(dom.settingsStatus, '不能拉黑最后一个可用管理员。', true);
      return;
    }
    target.blacklisted = !target.blacklisted;
    persistUsers();
    setMessage(
      dom.settingsStatus,
      target.blacklisted ? `已拉黑用户 ${target.username}。` : `已解除用户 ${target.username} 的拉黑状态。`,
      target.blacklisted
    );
    renderAll();
    return;
  }

  if (action === 'reset-password') {
    const actor = state.currentUser;
    const actorIsSuperAdmin = isSuperAdmin(actor);
    if (isSuperAdmin(target) && !actorIsSuperAdmin) {
      setMessage(dom.settingsStatus, '普通管理员不可对总管理员重置密码。', true);
      return;
    }
    if (target.role === 'admin' && !actorIsSuperAdmin) {
      setMessage(dom.settingsStatus, '仅总管理员可对普通管理员重置密码。', true);
      return;
    }
    const currentPassword = window.prompt(`请输入用户 ${target.username} 的原密码进行验证`);
    if (currentPassword === null) return;
    const currentPasswordValid = await verifyUserPassword(target, currentPassword.trim());
    if (!currentPasswordValid) {
      setMessage(dom.settingsStatus, '原密码验证失败，无法重置密码。', true);
      return;
    }
    const nextPassword = window.prompt(`为用户 ${target.username} 设置新密码（至少 8 位，需含字母和数字）`);
    if (nextPassword === null) return;
    const safePassword = nextPassword.trim();
    if (!isPasswordStrong(safePassword)) {
      setMessage(dom.settingsStatus, passwordRuleText(), true);
      return;
    }
    const credential = await createPasswordCredential(safePassword);
    if (!credential) {
      setMessage(dom.settingsStatus, '当前浏览器不支持安全加密能力，无法重置密码。', true);
      return;
    }
    applyPasswordCredentialToUser(target, credential);
    persistUsers();
    setMessage(dom.settingsStatus, `已为用户 ${target.username} 重置密码。`);
    renderAll();
    return;
  }

  if (action === 'delete-user') {
    if (!actorIsSuperAdmin && target.role !== 'user') {
      setMessage(dom.settingsStatus, '普通管理员仅可删除普通用户。', true);
      return;
    }
    if (protectedUser) {
      setMessage(dom.settingsStatus, '总管理员账号不可删除。', true);
      return;
    }
    if (isSelf) {
      setMessage(dom.settingsStatus, '不能删除当前登录管理员自己。', true);
      return;
    }
    if (target.role === 'admin' && !isUserBlacklisted(target) && getActiveAdminCount() <= 1) {
      setMessage(dom.settingsStatus, '不能删除最后一个可用管理员。', true);
      return;
    }
    const confirmed = window.confirm(`确认删除用户 ${target.username} 吗？其上传的视频也会被删除。`);
    if (!confirmed) return;
    const result = removeUserByAdmin(target.id);
    setMessage(dom.settingsStatus, `已删除用户 ${result.username}，并清理 ${result.removedVideos} 条关联视频。`, true);
    renderAll();
  }
}

function handleQuickGridAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'play-video') {
    const videoId = Number(button.dataset.id);
    if (!Number.isFinite(videoId)) return;
    const video = state.videos.find((item) => item.id === videoId);
    if (video) {
      openPlayer(video);
    }
    return;
  }

  if (action === 'toggle-favorite') {
    const videoId = Number(button.dataset.id);
    if (!Number.isFinite(videoId)) return;
    toggleFavoriteVideo(videoId);
    renderAll();
    return;
  }

  if (action === 'remove-continue') {
    const videoId = Number(button.dataset.id);
    if (!Number.isFinite(videoId)) return;
    const removed = removeContinueWatchingItem(videoId);
    if (!removed) return;
    renderVideos();
    renderQuickSections();
  }
}

function renderAll() {
  refreshCurrentUserState();
  renderSiteNotice();
  const featured = getFeaturedVideo();
  if (featured) {
    renderHero(featured);
  } else {
    const hasVisibleVideos = displayVideos().length > 0;
    dom.heroTitle.textContent = hasVisibleVideos ? '当前暂无推荐视频' : '暂无可展示视频';
    dom.heroDescription.textContent = hasVisibleVideos
      ? '你可以从视频库中选择任意内容播放。'
      : '请先上传视频，或等待管理员审核通过。';
    dom.heroCategory.textContent = '类型：-';
    dom.heroDuration.textContent = '时长：-';
    dom.heroYear.textContent = '发布时间：-';
    dom.heroCover.src = DEFAULT_COVER;
    dom.heroCover.alt = '默认封面';
  }

  renderFilters();
  renderVideos();
  renderQuickSections();
  renderAuthState();
  renderProfileCenter();
  renderProfileHistorySection();
  renderAdminPanel();
}

function bindEvents() {
  const syncUploadDraft = debounce(() => {
    persistUploadDraft();
  }, 150);
  const uploadDraftFields = [
    dom.uploadTitle,
    dom.uploadCategory,
    dom.uploadDuration,
    dom.uploadPublishedAt,
    dom.uploadDescription
  ].filter(Boolean);
  uploadDraftFields.forEach((field) => {
    field.addEventListener('input', syncUploadDraft);
    field.addEventListener('change', syncUploadDraft);
  });

  const debouncedSearch = debounce((keyword) => {
    state.search = normalizeSearchKeyword(keyword);
    if (dom.searchInput && dom.searchInput.value !== state.search) {
      dom.searchInput.value = state.search;
    }
    setLibraryStatus('');
    renderFilters();
    renderVideos();
  }, SEARCH_DEBOUNCE_MS);

  dom.searchInput.addEventListener('input', (event) => {
    if (dom.clearSearchBtn) {
      dom.clearSearchBtn.classList.toggle('hidden', !String(event.target.value || '').trim());
    }
    debouncedSearch(event.target.value);
  });

  dom.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      clearSearchKeywordAndRefresh({ keepFocus: true });
      return;
    }
    if (event.key !== 'Enter' || event.isComposing) return;
    const candidates = filteredVideos();
    if (!candidates.length) {
      setLibraryStatus('当前搜索没有匹配结果。', true);
      return;
    }
    const playable = candidates.find((video) => canCurrentUserPlayVideo(video));
    if (playable) {
      event.preventDefault();
      openPlayer(playable);
      return;
    }
    setLibraryStatus('匹配视频存在，但当前账号暂无可播放权限。', true);
  });

  if (dom.clearSearchBtn) {
    dom.clearSearchBtn.addEventListener('click', () => {
      clearSearchKeywordAndRefresh({ keepFocus: true });
    });
  }

  dom.categoryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    if (button.dataset.disabled === '1') return;
    state.category = button.dataset.category;
    setLibraryStatus('');
    renderFilters();
    renderVideos();
  });

  dom.sortSelect.addEventListener('change', () => {
    state.sortBy = normalizeSortBy(dom.sortSelect.value);
    setLibraryStatus('');
    renderFilters();
    renderVideos();
    renderQuickSections();
  });

  dom.favoriteToggleBtn.addEventListener('click', () => {
    state.favoriteOnly = !state.favoriteOnly;
    setLibraryStatus('');
    renderFilters();
    renderVideos();
  });

  if (dom.ownerToggleBtn) {
    dom.ownerToggleBtn.addEventListener('click', () => {
      if (!canUseOwnerFilter()) {
        openAuthModal('login');
        setLibraryStatus('登录后可启用“只看我上传”。', true);
        return;
      }
      state.ownerOnly = !state.ownerOnly;
      setLibraryStatus('');
      renderFilters();
      renderVideos();
    });
  }

  if (dom.clearFiltersBtn) {
    dom.clearFiltersBtn.addEventListener('click', () => {
      state.category = '全部';
      state.search = '';
      state.favoriteOnly = false;
      state.ownerOnly = false;
      state.sortBy = 'latest';
      if (dom.searchInput) {
        dom.searchInput.value = '';
      }
      setLibraryStatus('');
      renderFilters();
      renderVideos();
      renderQuickSections();
    });
  }

  dom.clearContinueBtn.addEventListener('click', () => {
    const confirmed = window.confirm('确认清空全部继续观看记录吗？');
    if (!confirmed) return;
    const cleared = clearContinueWatchingHistory();
    if (!cleared) return;
    renderVideos();
    renderQuickSections();
    if (dom.playerModal.classList.contains('show')) {
      setPlayerStatus('已清空继续观看记录');
    }
  });

  dom.clearContinueCompletedBtn.addEventListener('click', () => {
    const confirmed = window.confirm('确认清空已看完视频的继续观看记录吗？');
    if (!confirmed) return;
    const removedCount = clearCompletedContinueWatchingHistory();
    if (removedCount <= 0) return;
    renderVideos();
    renderQuickSections();
    if (dom.playerModal.classList.contains('show')) {
      setPlayerStatus(`已清空 ${removedCount} 条已看完记录`);
    }
  });

  dom.favoriteSortSelect.addEventListener('change', () => {
    const sortBy = dom.favoriteSortSelect.value || 'recent';
    state.favoriteSortBy = ['recent', 'title_asc', 'progress_desc'].includes(sortBy) ? sortBy : 'recent';
    renderFavoriteSection();
  });

  dom.videoGrid.addEventListener('click', (event) => {
    const playBtn = event.target.closest('.play-btn');
    if (playBtn) {
      const id = Number(playBtn.dataset.id);
      const video = state.videos.find((item) => item.id === id);
      if (video) {
        openPlayer(video);
      }
      return;
    }

    const favoriteBtn = event.target.closest('.fav-btn');
    if (favoriteBtn) {
      const id = Number(favoriteBtn.dataset.id);
      if (!Number.isFinite(id)) return;
      toggleFavoriteVideo(id);
      renderAll();
      return;
    }

    const shareBtn = event.target.closest('.share-btn');
    if (shareBtn) {
      const id = Number(shareBtn.dataset.id);
      if (!Number.isFinite(id)) return;
      const targetVideo = state.videos.find((video) => video.id === id);
      if (!targetVideo) {
        setLibraryStatus('视频不存在或已被删除，无法分享。', true);
        return;
      }
      shareVideo(targetVideo);
      return;
    }

  });

  dom.videoGrid.addEventListener('error', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = DEFAULT_COVER;
  }, true);

  if (dom.profileVideoGrid) {
    dom.profileVideoGrid.addEventListener('click', (event) => {
      const actionButton = event.target.closest('button[data-action]');
      if (!actionButton) return;
      const action = String(actionButton.dataset.action || '');
      const videoId = Number(actionButton.dataset.id);
      if (!Number.isFinite(videoId)) return;
      const targetVideo = state.videos.find((video) => video.id === videoId);
      if (!targetVideo || !canManageOwnVideo(targetVideo)) {
        setMessage(dom.profileStatus, '只能管理自己发布的视频。', true);
        return;
      }

      if (action === 'play-profile') {
        openPlayer(targetVideo);
        return;
      }

      if (action === 'share-profile') {
        shareVideo(targetVideo);
        setMessage(dom.profileStatus, '已发起分享。');
        return;
      }

      if (action === 'edit-profile') {
        openEditVideoModal(videoId);
        return;
      }

      if (action === 'delete-profile') {
        const confirmed = window.confirm('确认删除这条视频吗？');
        if (!confirmed) return;
        removeVideo(videoId);
        setMessage(dom.profileStatus, '视频已删除。');
      }
    });

    dom.profileVideoGrid.addEventListener('error', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.fallbackApplied === '1') return;
      target.dataset.fallbackApplied = '1';
      target.src = DEFAULT_COVER;
    }, true);
  }

  if (dom.profileHistoryGrid) {
    dom.profileHistoryGrid.addEventListener('click', (event) => {
      const actionButton = event.target.closest('button[data-action]');
      if (!actionButton) return;
      const action = String(actionButton.dataset.action || '');
      const videoId = Number(actionButton.dataset.id);
      if (!Number.isFinite(videoId)) return;

      if (action === 'play-history') {
        const targetVideo = state.videos.find((video) => video.id === videoId);
        if (!targetVideo) return;
        openPlayer(targetVideo);
        return;
      }

      if (action === 'remove-history') {
        const removed = removeContinueWatchingItem(videoId);
        if (!removed) return;
        renderAll();
      }
    });

    dom.profileHistoryGrid.addEventListener('error', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.fallbackApplied === '1') return;
      target.dataset.fallbackApplied = '1';
      target.src = DEFAULT_COVER;
    }, true);
  }

  dom.videoGrid.addEventListener('mouseover', (event) => {
    const card = event.target.closest('.card[data-preview-src]');
    if (!card) return;
    if (!dom.videoGrid.contains(card)) return;
    const related = event.relatedTarget;
    if (related instanceof Node && card.contains(related)) return;
    queueCardHoverPreview(card);
  });

  dom.videoGrid.addEventListener('mouseout', (event) => {
    const card = event.target.closest('.card[data-preview-src]');
    if (!card) return;
    if (!dom.videoGrid.contains(card)) return;
    const related = event.relatedTarget;
    if (related instanceof Node && card.contains(related)) return;
    if (state.hoverPreviewCardId === String(card.dataset.id || '')) {
      stopCardHoverPreview();
      return;
    }
    clearHoverPreviewTimer();
  });

  window.addEventListener('blur', () => {
    stopCardHoverPreview();
  });

  dom.continueGrid.addEventListener('click', handleQuickGridAction);
  dom.favoriteGrid.addEventListener('click', handleQuickGridAction);

  dom.continueGrid.addEventListener('error', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = DEFAULT_COVER;
  }, true);

  dom.favoriteGrid.addEventListener('error', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = DEFAULT_COVER;
  }, true);

  dom.heroCover.addEventListener('error', () => {
    if (dom.heroCover.getAttribute('src') === DEFAULT_COVER) return;
    dom.heroCover.src = DEFAULT_COVER;
  });

  dom.playFeaturedBtn.addEventListener('click', () => {
    const featured = getFeaturedVideo();
    if (featured) {
      openPlayer(featured);
    }
  });

  bindPlayerEvents();

  dom.rewindBtn.addEventListener('click', () => {
    seekBy(-10);
  });

  dom.forwardBtn.addEventListener('click', () => {
    seekBy(10);
  });

  dom.speedSelect.addEventListener('change', () => {
    const nextRate = Number(dom.speedSelect.value);
    if (!Number.isFinite(nextRate) || nextRate <= 0) return;
    dom.videoPlayer.playbackRate = nextRate;
    setPlayerStatus(`当前倍速 ${nextRate}x`);
  });

  dom.muteBtn.addEventListener('click', () => {
    dom.videoPlayer.muted = !dom.videoPlayer.muted;
    updateMuteButton();
    setPlayerStatus(dom.videoPlayer.muted ? '已静音' : '已取消静音');
  });

  dom.autoNextToggle.addEventListener('change', () => {
    state.playerPrefs.autoNext = dom.autoNextToggle.checked;
    persistPlayerPrefs();
    setPlayerStatus(state.playerPrefs.autoNext ? '已开启自动连播' : '已关闭自动连播');
  });

  dom.shareCurrentVideoBtn.addEventListener('click', () => {
    const currentId = Number(state.currentPlayingVideoId);
    if (!Number.isFinite(currentId) || currentId <= 0) {
      setPlayerStatus('请先播放一个视频。', true);
      return;
    }
    const currentVideo = state.videos.find((video) => video.id === currentId);
    if (!currentVideo) {
      setPlayerStatus('当前视频不存在或已被删除。', true);
      return;
    }
    shareVideo(currentVideo);
    setPlayerStatus('已发起分享，若未弹窗可手动复制地址栏链接。', false, true);
  });

  if (dom.downloadVideoBtn) {
    dom.downloadVideoBtn.addEventListener('click', () => {
      const currentId = Number(state.currentPlayingVideoId);
      if (!Number.isFinite(currentId) || currentId <= 0) {
        setPlayerStatus('请先播放一个视频。', true);
        return;
      }
      const currentVideo = state.videos.find((video) => video.id === currentId);
      downloadVideo(currentVideo);
    });
  }

  dom.pipBtn.addEventListener('click', () => {
    togglePictureInPicture();
  });

  dom.fullscreenBtn.addEventListener('click', async () => {
    if (!state.currentPlayingVideoId) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (dom.videoPlayer.requestFullscreen) {
        await dom.videoPlayer.requestFullscreen();
      }
    } catch (_error) {
      setPlayerStatus('当前浏览器不支持全屏切换。', true);
    }
  });

  dom.resumePlayBtn.addEventListener('click', () => {
    if (state.pendingResumeTime > 0) {
      dom.videoPlayer.currentTime = state.pendingResumeTime;
      savePlaybackProgress(true);
      clearResumePrompt();
      const playTask = dom.videoPlayer.play();
      if (playTask?.catch) {
        playTask.catch(() => {
          setPlayerStatus('跳转成功，点击播放继续观看。', false, true);
        });
      }
    }
  });

  dom.resumeRestartBtn.addEventListener('click', () => {
    dom.videoPlayer.currentTime = 0;
    if (state.currentPlayingVideoId) {
      delete state.playbackHistory[String(state.currentPlayingVideoId)];
      persistPlaybackHistory();
    }
    clearResumePrompt();
  });

  dom.playNextBtn.addEventListener('click', () => {
    if (!state.nextUpVideoId) {
      setPlayerStatus('当前没有可播放的下一条。');
      return;
    }
    const nextVideo = state.videos.find((video) => video.id === state.nextUpVideoId);
    if (!nextVideo) {
      setPlayerStatus('下一条视频不存在或已被删除。', true);
      return;
    }
    openPlayer(nextVideo);
  });

  dom.relatedList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    const targetId = Number(button.dataset.id);
    const targetVideo = state.videos.find((video) => video.id === targetId);
    if (!targetVideo) {
      setPlayerStatus('推荐视频不存在或已被删除。', true);
      return;
    }
    openPlayer(targetVideo);
  });

  dom.openAuthBtn.addEventListener('click', () => openAuthModal('login'));
  dom.openAccountBtn.addEventListener('click', openAccountModal);
  dom.logoutBtn.addEventListener('click', () => {
    closeAccountModal();
    closeEditVideoModal();
    state.currentUser = null;
    persistCurrentUser();
    renderAll();
  });

  dom.closePlayerModal.addEventListener('click', closePlayer);
  dom.closeAuthModal.addEventListener('click', closeAuthModal);
  dom.closeAccountModal.addEventListener('click', closeAccountModal);
  dom.closeEditVideoModal.addEventListener('click', closeEditVideoModal);

  dom.authModal.addEventListener('click', (event) => {
    if (event.target === dom.authModal) {
      closeAuthModal();
    }
  });

  dom.accountModal.addEventListener('click', (event) => {
    if (event.target === dom.accountModal) {
      closeAccountModal();
    }
  });
  dom.editVideoModal.addEventListener('click', (event) => {
    if (event.target === dom.editVideoModal) {
      closeEditVideoModal();
    }
  });

  dom.loginTabBtn.addEventListener('click', () => {
    state.authMode = 'login';
    renderAuthMode();
    updateAuthDraftHint();
  });

  dom.registerTabBtn.addEventListener('click', () => {
    state.authMode = 'register';
    renderAuthMode();
    updateAuthDraftHint();
  });

  dom.authPasswordToggle.addEventListener('click', () => {
    const visible = dom.authPassword.type === 'password';
    setAuthPasswordVisibility(visible);
  });

  dom.authUsername.addEventListener('input', updateAuthDraftHint);
  dom.authPassword.addEventListener('input', updateAuthDraftHint);
  dom.authConfirmPassword.addEventListener('input', updateAuthDraftHint);

  dom.authForm.addEventListener('submit', handleAuthSubmit);
  if (dom.uploadForm) {
    dom.uploadForm.addEventListener('submit', handleUploadSubmit);
  }
  if (dom.accountForm) {
    dom.accountForm.addEventListener('submit', handleAccountSubmit);
  }
  if (dom.accountAvatarFile) {
    dom.accountAvatarFile.addEventListener('change', async () => {
      const file = dom.accountAvatarFile.files?.[0] || null;
      if (!file) {
        refreshAccountAvatarIndicators();
        return;
      }
      try {
        await applyAccountAvatarFile(file);
        setMessage(dom.accountStatus, '已加载头像文件，保存资料后生效。');
      } catch (error) {
        dom.accountAvatarFile.value = '';
        refreshAccountAvatarIndicators();
        setMessage(dom.accountStatus, error.message || '头像文件处理失败。', true);
      }
    });
  }
  if (dom.clearAccountAvatarBtn) {
    dom.clearAccountAvatarBtn.addEventListener('click', () => {
      if (dom.accountAvatarFile) {
        dom.accountAvatarFile.value = '';
      }
      setAccountAvatarDraft('');
      refreshAccountAvatarIndicators();
      setMessage(dom.accountStatus, '已清除头像，保存资料后生效。');
    });
  }
  if (dom.accountAvatarDropzone && dom.accountAvatarFile) {
    bindUploadDropzone(dom.accountAvatarDropzone, dom.accountAvatarFile, {
      statusElement: dom.accountStatus,
      rejectMessage: '请拖入图片格式的头像文件。',
      successMessage: '已接收头像文件。'
    });
  }
  if (dom.accountAvatarPreview) {
    dom.accountAvatarPreview.addEventListener('error', () => {
      dom.accountAvatarPreview.classList.add('hidden');
      dom.accountAvatarPreview.removeAttribute('src');
      setMessage(dom.accountStatus, '头像加载失败，请重新选择图片。', true);
    });
  }
  if (dom.currentUserAvatar) {
    dom.currentUserAvatar.addEventListener('error', () => {
      updateCurrentUserAvatar('');
    });
  }
  if (dom.passwordForm) {
    dom.passwordForm.addEventListener('submit', handlePasswordSubmit);
  }
  dom.editVideoForm.addEventListener('submit', handleEditVideoSubmit);
  if (dom.uploadVideoFile) {
    dom.uploadVideoFile.addEventListener('change', async () => {
      const file = validateUploadInputFile(dom.uploadVideoFile, {
        rejectMessage: '请选择有效的视频文件。'
      });
      refreshUploadFileIndicators();
      if (!file) {
        persistUploadDraft();
        return;
      }

      try {
        const duration = await detectLocalVideoDuration(file);
        if (dom.uploadDuration) {
          dom.uploadDuration.value = duration;
        }
        persistUploadDraft();
        if (dom.uploadStatus) {
          setMessage(dom.uploadStatus, `已识别本地视频时长：${duration}`);
        }
      } catch (error) {
        if (dom.uploadStatus) {
          setMessage(dom.uploadStatus, error.message || '无法识别本地视频时长。', true);
        }
      }
    });
  }

  if (dom.uploadCoverFile) {
    dom.uploadCoverFile.addEventListener('change', () => {
      validateUploadInputFile(dom.uploadCoverFile, {
        rejectMessage: '请选择有效的图片封面文件。'
      });
      refreshUploadFileIndicators();
      persistUploadDraft();
    });
  }

  if (dom.clearUploadVideoFileBtn) {
    dom.clearUploadVideoFileBtn.addEventListener('click', () => {
      clearUploadInputFile(dom.uploadVideoFile);
      persistUploadDraft();
      setMessage(dom.uploadStatus, '已移除视频文件。');
    });
  }

  if (dom.clearUploadCoverFileBtn) {
    dom.clearUploadCoverFileBtn.addEventListener('click', () => {
      clearUploadInputFile(dom.uploadCoverFile);
      persistUploadDraft();
      setMessage(dom.uploadStatus, '已移除封面文件。');
    });
  }

  bindUploadDropzone(dom.uploadVideoDropzone, dom.uploadVideoFile, {
    rejectMessage: '请拖入视频文件。',
    successMessage: '已接收视频文件。'
  });
  bindUploadDropzone(dom.uploadCoverDropzone, dom.uploadCoverFile, {
    rejectMessage: '请拖入图片封面文件。',
    successMessage: '已接收封面文件。'
  });
  bindUploadDropGuards();
  window.addEventListener('pagehide', revokeUploadCoverPreviewUrl);
  window.addEventListener('beforeunload', revokeUploadCoverPreviewUrl);

  if (dom.adminVideoRows) {
    dom.adminVideoRows.addEventListener('click', handleAdminVideoAction);
  }
  if (dom.reviewRows) {
    dom.reviewRows.addEventListener('click', handleAdminVideoAction);
  }
  if (dom.adminUserRows) {
    dom.adminUserRows.addEventListener('click', handleAdminUserAction);
  }
  if (dom.saveSettingsBtn && dom.requireApprovalToggle && dom.siteNoticeInput) {
    dom.saveSettingsBtn.addEventListener('click', () => {
      if (!isAdmin()) return;
      state.siteSettings = {
        requireApproval: dom.requireApprovalToggle.checked,
        siteNotice: sanitizeSingleLineText(dom.siteNoticeInput.value, 120)
      };
      persistSiteSettings();
      setMessage(dom.settingsStatus, '站点设置已保存并立即生效。');
      renderAll();
    });
  }

  document.addEventListener('keydown', (event) => {
    const isPlayerOpen = dom.playerModal.classList.contains('show');
    const tag = event.target?.tagName;
    const isFormField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (event.key === 'Escape') {
      if (dom.playerModal.classList.contains('show')) {
        closePlayer();
      }
      if (dom.authModal.classList.contains('show')) {
        closeAuthModal();
      }
      if (dom.accountModal.classList.contains('show')) {
        closeAccountModal();
      }
      if (dom.editVideoModal.classList.contains('show')) {
        closeEditVideoModal();
      }
      return;
    }

    if (event.key === '/' && !isFormField && dom.searchInput && dom.searchInput.offsetParent !== null) {
      event.preventDefault();
      dom.searchInput.focus();
      return;
    }

    if (!isPlayerOpen) return;
    if (isFormField) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekBy(-5);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekBy(5);
      return;
    }

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (dom.videoPlayer.paused) {
        const playTask = dom.videoPlayer.play();
        if (playTask?.catch) {
          playTask.catch(() => {
            setPlayerStatus('点击播放器开始播放。');
          });
        }
      } else {
        dom.videoPlayer.pause();
        setPlayerStatus('已暂停');
      }
      return;
    }

    if (event.key.toLowerCase() === 'm') {
      dom.videoPlayer.muted = !dom.videoPlayer.muted;
      updateMuteButton();
      setPlayerStatus(dom.videoPlayer.muted ? '已静音' : '已取消静音');
      return;
    }

    if (event.key.toLowerCase() === 'p') {
      event.preventDefault();
      togglePictureInPicture();
      return;
    }

    if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      dom.autoNextToggle.checked = !dom.autoNextToggle.checked;
      dom.autoNextToggle.dispatchEvent(new Event('change'));
      return;
    }

    if (event.key.toLowerCase() === 'f') {
      dom.fullscreenBtn.click();
      return;
    }

    if (event.key.toLowerCase() === 'j') {
      event.preventDefault();
      dom.playNextBtn.click();
    }
  });
}

async function init() {
  bootstrapUsers();
  await hardenUsersPasswordStorage();
  await bootstrapVideos();
  bootstrapAuthSession();
  bootstrapCurrentUser();
  bootstrapFilterStateFromUrl();
  bootstrapFeatured();
  bootstrapPlayerState();
  bootstrapFavorites();
  bootstrapSiteSettings();
  bootstrapUploadDraft();
  ensureUploadPublishedAtValue();
  prunePlaybackHistory();
  pruneFavorites();
  bindEvents();
  if (dom.authForm) {
    dom.authForm.noValidate = true;
  }
  if (dom.accountForm) {
    dom.accountForm.noValidate = true;
  }
  if (dom.passwordForm) {
    dom.passwordForm.noValidate = true;
  }
  if (dom.editVideoForm) {
    dom.editVideoForm.noValidate = true;
  }
  if (dom.speedSelect) {
    dom.speedSelect.value = String(state.playerPrefs.rate);
  }
  if (dom.autoNextToggle) {
    dom.autoNextToggle.checked = Boolean(state.playerPrefs.autoNext);
  }
  if (dom.videoPlayer) {
    dom.videoPlayer.volume = state.playerPrefs.volume;
    dom.videoPlayer.muted = state.playerPrefs.muted;
  }
  updateMuteButton();
  updatePipButton();
  resetUploadProgress();
  renderAuthMode();
  renderAll();
  consumeSharedVideoFromUrl();
  requestPersistentStorage();
}

init().catch(() => {
  renderAll();
});
