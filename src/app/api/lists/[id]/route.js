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
  const moviesSql = `select * from api_movies
    
    inner join list_movies on api_movies.id=list_movies.api_movie_id

    inner join movies on api_movies.id=movies.api_movie_id
    
    where list_movies.list_id=$1`;

  const { rows: moviesRows } = await pool.query(moviesSql, moviesValues);

  return Response.json({
    list: listRows[0],
    listMovies: moviesRows,
  });
}

export async function PUT(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;
  const { name } = await request.json();

  if (!name) return Response.json({ error: '[name] required.' });

  const values = [name, id];
  const query = 'update lists set name = ($1) where (id) = ($2) returning *';
  const { rows: listRows } = await pool.query(query, values);

  return Response.json({ list: listRows[0] });
}
