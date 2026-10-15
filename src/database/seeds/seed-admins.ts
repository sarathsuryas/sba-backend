import bcrypt from 'bcryptjs';
import pg from 'pg';

const raw = process.env.ADMIN_USERS;
if (!raw) throw new Error('ADMIN_USERS is not set');

const admins = raw.split(',').map((entry) => {
  const i = entry.indexOf(':');
  if (i < 1) throw new Error(`Invalid ADMIN_USERS entry: ${entry}`);
  return { email: entry.slice(0, i).trim(), password: entry.slice(i + 1) };
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  for (const { email, password } of admins) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const hash = await bcrypt.hash(password, 12);

      const { rows } = await client.query<{ id: string }>(
        `INSERT INTO users (email, password_hash, must_change_password)
         VALUES (LOWER($1), $2, TRUE)
         ON CONFLICT ((LOWER(email))) DO NOTHING
         RETURNING id`,
        [email, hash],
      );

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        console.log(`skipped ${email} (already exists)`);
        continue;
      }

      const role = await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT $1, id FROM roles WHERE name = 'admin'
         ON CONFLICT DO NOTHING`,
        [rows[0].id],
      );
      if (role.rowCount === 0) {
        throw new Error("'admin' role not found. Run migrations first.");
      }

      await client.query('COMMIT');
      console.log(`created ${email}`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
} finally {
  await pool.end();
}