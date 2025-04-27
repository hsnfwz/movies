import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

export async function PUT(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { rating } = await request.json();

  if (rating === null || rating === undefined)
    return Response.json({ error: '[rating] required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

  const values = [rating, id];
  const query =
    'UPDATE user_added_movies SET rating=$1 WHERE id=$2 RETURNING rating as user_added_movie_rating';
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}
