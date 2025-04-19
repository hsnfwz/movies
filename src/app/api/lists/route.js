import pkg from 'pg';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const { user } = await auth0.getSession();

    if (!user) throw new Error('Authentication required.');

    const pool = new pkg.Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });

    const values = [user.sub];
    const sql = 'select * from lists where auth0_user_id=$1';
    const { rows } = await pool.query(sql, values);

    return Response.json({ lists: rows });
  } catch (error) {
    return Response.json({ error });
  }
}

export async function POST(request) {
  try {
    const { listName, listUsers, listMovies } = await request.json();
    const { user } = await auth0.getSession();

    if (!user) throw new Error('Authentication required.');
    if (!listName || !listMovies)
      throw new Error('List name and movies are required.');

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
  } catch (error) {
    return Response.json({ error });
  }
}
