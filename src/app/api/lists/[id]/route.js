import pkg from 'pg';
import { auth0 } from '@/lib/auth0';

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const listValues = [user.sub, id];
  const listSql = 'select * from lists where auth0_user_id=$1 and id=$2';
  const { rows: listRows } = await pool.query(listSql, listValues);

  if (!listRows[0])
    return Response.json({
      list: null,
      movies: [],
      ratings: [],
      error: 'List not found.',
    });

  const moviesValues = [id];
  const moviesSql =
    'select * from movies inner join list_movies on movies.id=list_movies.movie_id where list_movies.list_id=$1';
  const { rows: moviesRows } = await pool.query(moviesSql, moviesValues);

  const ratingsValues = [moviesRows.map((movieRow) => movieRow.movie_id)];
  const ratingsSql = 'select * from ratings where movie_id=any($1)';
  const { rows: ratingsRows } = await pool.query(ratingsSql, ratingsValues);

  return Response.json({
    list: listRows[0],
    listMovies: moviesRows,
    listRatings: ratingsRows,
  });
}
