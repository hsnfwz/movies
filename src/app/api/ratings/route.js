import pkg from 'pg';
import { auth0 } from '@/lib/auth0';

export async function POST(request) {
  const { score, movieId } = await request.json();
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });
  if (score === null || score === undefined || !movieId)
    return Response.json({ error: 'Score and Movie ID required.' });

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const values = [user.sub, score, movieId];
  const sql =
    'insert into ratings (auth0_user_id, score, movie_id) values ($1, $2, $3) returning *';
  const { rows } = await pool.query(sql, values);

  return Response.json({ rating: rows[0] });
}
