import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

export async function GET(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const values = [user.sub];
  const sql =
    'select * from api_movies inner join movies on movies.api_movie_id=api_movies.id where auth0_user_id=$1';
  const { rows: movies } = await pool.query(sql, values);

  return Response.json({ movies });
}

async function insertApiMovies(movies) {
  if (movies.length === 0) return;

  const values = [];
  const placeholders = movies
    .map((movie, i) => {
      const index = i * 5;
      values.push(
        movie.title,
        movie.year,
        movie.poster_path,
        movie.imdb_id,
        movie.tmdb_id
      );
      return `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5})`;
    })
    .join(', ');

  const query = `WITH inserted AS (INSERT INTO api_movies (title, year, poster_path, imdb_id, tmdb_id) VALUES ${placeholders} ON CONFLICT (imdb_id) DO NOTHING RETURNING *) SELECT * FROM inserted UNION ALL SELECT * FROM api_movies WHERE imdb_id=$4`;

  try {
    const { rows } = await pool.query(query, values);
    return { rows };
  } catch (error) {
    return { error };
  }
}

async function insertMovies(user, apiMovies) {
  if (apiMovies.length === 0) return;

  const values = [];
  const placeholders = apiMovies
    .map((apiMovie, i) => {
      const index = i * 2;
      values.push(user.sub, apiMovie.id);
      return `($${index + 1}, $${index + 2})`;
    })
    .join(', ');

  const query = `

  WITH inserted AS (INSERT INTO movies (auth0_user_id, api_movie_id) VALUES ${placeholders} ON CONFLICT ON CONSTRAINT user_movie_id DO NOTHING returning *)
  
  SELECT * FROM api_movies INNER JOIN inserted on inserted.api_movie_id=api_movies.id
  
  UNION ALL
  
  SELECT * FROM api_movies inner JOIN movies on movies.api_movie_id=api_movies.id

  WHERE api_movies.id=$2
  `;

  try {
    const { rows } = await pool.query(query, values);
    return { rows };
  } catch (error) {
    return { error };
  }
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { movies } = await request.json();

  if (!movies || movies.length === 0)
    return Response.json({ error: '[movies] required.' });

  const { rows: apiMoviesRows, error: apiMoviesError } =
    await insertApiMovies(movies);

  if (apiMoviesError)
    return Response.json({
      error: `[api_movies]: Failed to insert: ${apiMoviesError}`,
    });

  const { rows: moviesRows, error: moviesError } = await insertMovies(
    user,
    apiMoviesRows
  );

  if (moviesError)
    return Response.json({
      error: `[movies]: Failed to insert: ${moviesError}`,
    });

  return Response.json({ movies: moviesRows });
}
