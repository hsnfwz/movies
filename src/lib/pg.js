import pkg from 'pg';

const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

export { pool };
