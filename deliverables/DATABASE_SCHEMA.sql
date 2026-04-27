-- DATABASE SCHEMA (MySQL 8.0+)
-- Note: current project is pure frontend (IndexedDB + localStorage), no server DB is required to run now.
-- This schema is the recommended backend migration structure.

CREATE DATABASE IF NOT EXISTS video_site DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE video_site;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(32) NOT NULL UNIQUE,
  password_hash CHAR(64) NOT NULL,
  password_salt VARCHAR(64) NOT NULL,
  password_iterations INT NOT NULL DEFAULT 120000,
  password_algo VARCHAR(32) NOT NULL DEFAULT 'PBKDF2-SHA256-V1',
  avatar TEXT NULL,
  birth_date DATE NULL,
  gender ENUM('male','female','other','secret') NOT NULL DEFAULT 'secret',
  age TINYINT UNSIGNED NULL,
  role ENUM('super_admin','admin','user') NOT NULL DEFAULT 'user',
  blacklisted TINYINT(1) NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_blacklisted (role, blacklisted)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL,
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  INDEX idx_sessions_user (user_id),
  INDEX idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS videos (
  id BIGINT UNSIGNED PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  duration VARCHAR(16) NOT NULL,
  year SMALLINT NOT NULL,
  published_at BIGINT NOT NULL,
  tags JSON NULL,
  description VARCHAR(500) NOT NULL,
  src TEXT NOT NULL,
  cover TEXT NULL,
  status ENUM('approved','pending','rejected') NOT NULL DEFAULT 'approved',
  owner_id VARCHAR(64) NOT NULL,
  owner_name VARCHAR(32) NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_videos_owner (owner_id),
  INDEX idx_videos_status_pub (status, published_at),
  INDEX idx_videos_category (category),
  CONSTRAINT fk_videos_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favorites (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  video_id BIGINT UNSIGNED NOT NULL,
  created_at BIGINT NOT NULL,
  UNIQUE KEY uk_user_video_fav (user_id, video_id),
  INDEX idx_favorites_user (user_id),
  INDEX idx_favorites_video (video_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS playback_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  video_id BIGINT UNSIGNED NOT NULL,
  played_seconds DECIMAL(8,1) NOT NULL DEFAULT 0.1,
  updated_at BIGINT NOT NULL,
  UNIQUE KEY uk_user_video_history (user_id, video_id),
  INDEX idx_history_user_updated (user_id, updated_at),
  CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  k VARCHAR(64) PRIMARY KEY,
  v JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_security (
  username_key VARCHAR(64) PRIMARY KEY,
  failed_count INT NOT NULL DEFAULT 0,
  lock_until BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id VARCHAR(64) NULL,
  action VARCHAR(64) NOT NULL,
  target_type VARCHAR(32) NULL,
  target_id VARCHAR(64) NULL,
  detail JSON NULL,
  ip VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  created_at BIGINT NOT NULL,
  INDEX idx_audit_actor_time (actor_user_id, created_at),
  INDEX idx_audit_action_time (action, created_at)
) ENGINE=InnoDB;

-- seed super admin (replace hash/salt with your real generated values in backend)
INSERT IGNORE INTO users (
  id, username, password_hash, password_salt, password_iterations, password_algo,
  role, blacklisted, created_at
) VALUES (
  'u_root', 'oyjf',
  REPEAT('0',64), 'replace_with_real_salt', 120000, 'PBKDF2-SHA256-V1',
  'super_admin', 0, UNIX_TIMESTAMP() * 1000
);