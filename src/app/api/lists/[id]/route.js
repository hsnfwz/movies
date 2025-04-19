import pkg from 'pg';
import { auth0 } from '@/lib/auth0';

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const listValues = [id];
  const listSql = 'select * from lists where id=$1';
  const { rows: listRows } = await pool.query(listSql, listValues);

  if (!listRows[0]) return Response.json({ error: 'List not found.' });

  const moviesValues = [id];
  const moviesSql =
    'select * from movies inner join list_movies on movies.id=list_movies.movie_id where list_movies.list_id=$1';
  const { rows: moviesRows } = await pool.query(moviesSql, moviesValues);

  return Response.json({ list: listRows[0], movies: moviesRows });
}
