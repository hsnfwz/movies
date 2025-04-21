import pkg from 'pg';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const values = [user.sub];
  const sql = 'select * from lists where auth0_user_id=$1';
  const { rows } = await pool.query(sql, values);

  return Response.json({ lists: rows });
}

export async function POST(request) {
  const { listName, listUsers, listMovies } = await request.json();
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });
  if (!listName || !listMovies)
    return Response.json({ error: 'List name and movies are required.' });

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  // add lists
  const listValues = [user.sub, listName];
  const listSql =
    'insert into lists (auth0_user_id, name) values ($1, $2) returning *';
  const { rows: listRows } = await pool.query(listSql, listValues);

  let i = 0;
  const movies = Object.values(listMovies);
  while (i < movies.length) {
    const movie = movies[i];

    // check if movie exists
    const movieValues = [movie.imdb_id];
    const movieSql = 'select * from movies where imdb_id=$1';
    const { rows: movieRows } = await pool.query(movieSql, movieValues);

    if (movieRows.length === 0) {
      // add movies
      const newMovieValues = [movie.title, movie.poster, movie.imdb_id];
      const newMovieSql =
        'insert into movies (title, poster, imdb_id) values ($1, $2, $3) returning *';
      const { rows: newMovieRows } = await pool.query(
        newMovieSql,
        newMovieValues
      );

      // add list_movies based on new movie added
      const listMoviesValues = [listRows[0].id, newMovieRows[0].id];
      const listMoviesSql =
        'insert into list_movies (list_id, movie_id) values ($1, $2) returning *';
      const { rows: listMoviesRows } = await pool.query(
        listMoviesSql,
        listMoviesValues
      );
    } else {
      // add list_movies based on existing movie
      const listMoviesValues = [listRows[0].id, movieRows[0].id];
      const listMoviesSql =
        'insert into list_movies (list_id, movie_id) values ($1, $2) returning *';
      const { rows: listMoviesRows } = await pool.query(
        listMoviesSql,
        listMoviesValues
      );
    }

    i++;
  }

  return Response.json({ list: listRows[0] });
}

export async function PUT(request) {
  const { listId, listName, listMovies } = await request.json();
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });
  if (!listId || !listName)
    return Response.json({ error: 'List ID and Name required.' });

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const listValues = [listName, listId];
  const listSql = 'update lists set name = ($1) where (id) = ($2) returning *';
  const { rows: listRows } = await pool.query(listSql, listValues);

  if (!listMovies) return Response.json({ list: listRows[0] });

  const addedMovies = [];
  let i = 0;
  const movies = Object.values(listMovies);
  while (i < movies.length) {
    const movie = movies[i];

    // check if movie exists
    const movieValues = [movie.imdb_id];
    const movieSql = 'select * from movies where imdb_id=$1';
    const { rows: movieRows } = await pool.query(movieSql, movieValues);

    if (movieRows.length === 0) {
      // add movies
      const newMovieValues = [movie.title, movie.poster, movie.imdb_id];
      const newMovieSql =
        'insert into movies (title, poster, imdb_id) values ($1, $2, $3) returning *';
      const { rows: newMovieRows } = await pool.query(
        newMovieSql,
        newMovieValues
      );

      addedMovies.push({
        ...newMovieRows[0],
        list_id: listId,
        movie_id: newMovieRows[0].id,
      });

      // add list_movies based on new movie added
      const listMoviesValues = [listRows[0].id, newMovieRows[0].id];
      const listMoviesSql =
        'insert into list_movies (list_id, movie_id) values ($1, $2) returning *';
      const { rows: listMoviesRows } = await pool.query(
        listMoviesSql,
        listMoviesValues
      );
    } else {
      addedMovies.push({
        ...movieRows[0],
        list_id: listId,
        movie_id: movieRows[0].id,
      });

      // check if list_movie exists
      const listListMoviesValues = [listRows[0].id, movieRows[0].id];
      const listListMoviesSql =
        'select * from list_movies where list_id=$1 and movie_id=$2';
      const { rows: listListMoviesRows } = await pool.query(
        listListMoviesSql,
        listListMoviesValues
      );

      if (!listListMoviesRows[0]) {
        // add list_movies based on existing movie
        const listMoviesValues = [listRows[0].id, movieRows[0].id];
        const listMoviesSql =
          'insert into list_movies (list_id, movie_id) values ($1, $2) returning *';
        const { rows: listMoviesRows } = await pool.query(
          listMoviesSql,
          listMoviesValues
        );
      }
    }

    i++;
  }

  return Response.json({ list: listRows[0], addedMovies });
}
