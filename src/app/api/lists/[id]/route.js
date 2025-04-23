import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;

  const listValues = [id];
  const listSql = 'select * from lists where id=$1';
  const { rows: listRows } = await pool.query(listSql, listValues);

  if (!listRows[0])
    return Response.json({
      list: null,
      movies: [],
      error: 'List not found.',
    });

  const moviesValues = [id];
  const moviesSql =
    `select * from api_movies
    
    inner join list_movies on api_movies.id=list_movies.api_movie_id

    inner join movies on api_movies.id=movies.movie_id
    
    where list_movies.list_id=$1`;
  const { rows: moviesRows } = await pool.query(moviesSql, moviesValues);

  return Response.json({
    list: listRows[0],
    listMovies: moviesRows,
  });
}
