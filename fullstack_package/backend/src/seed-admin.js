const config = require('./config');
const { query, pool } = require('./db');
const { createPasswordCredential } = require('./security');

async function main() {
  const exists = await query('SELECT id FROM users WHERE id = ? LIMIT 1', [config.rootAdmin.id]);
  const credential = await createPasswordCredential(config.rootAdmin.password);

  if (exists.length) {
    await query(
      `UPDATE users
       SET username = ?,
           password_hash = ?,
           password_salt = ?,
           password_iterations = ?,
           password_algo = ?,
           role = 'super_admin',
           blacklisted = 0
       WHERE id = ?`,
      [
        config.rootAdmin.username,
        credential.passwordHash,
        credential.passwordSalt,
        credential.passwordIterations,
        credential.passwordAlgo,
        config.rootAdmin.id
      ]
    );
  } else {
    await query(
      `INSERT INTO users (
         id, username, password_hash, password_salt, password_iterations, password_algo,
         role, blacklisted, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, 'super_admin', 0, ?)`,
      [
        config.rootAdmin.id,
        config.rootAdmin.username,
        credential.passwordHash,
        credential.passwordSalt,
        credential.passwordIterations,
        credential.passwordAlgo,
        Date.now()
      ]
    );
  }

  console.log('Super admin is ready:', config.rootAdmin.username);
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
