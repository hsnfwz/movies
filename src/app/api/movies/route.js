import { auth0 } from "@/lib/auth0";
import { pool } from "@/lib/pg";

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
  const placeholders = movies.map((movie, i) => {
    const index = i * 3;
    values.push(movie.title, movie.poster, movie.imdb_id);
    return `($${index + 1}, $${index + 2}, $${index + 3})`;
  }).join(', ');

  const query = `WITH inserted AS (INSERT INTO api_movies (title, poster, imdb_id) VALUES ${placeholders} ON CONFLICT (imdb_id) DO NOTHING RETURNING *) SELECT * FROM inserted UNION ALL SELECT * FROM api_movies WHERE imdb_id=$3`;

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
  const placeholders = apiMovies.map((apiMovie, i) => {
    const index = i * 2;
    values.push(user.sub, apiMovie.id);
    return `($${index + 1}, $${index + 2})`;
  }).join(', ');

  const query = `WITH inserted AS (INSERT INTO movies (auth0_user_id, api_movie_id) VALUES ${placeholders} ON CONFLICT ON CONSTRAINT user_movie_id DO NOTHING returning *) SELECT am.* FROM api_movies am JOIN inserted i ON am.id = i.api_movie_id`;

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

  if (!movies || movies.length === 0) return Response.json({ error: '[movies] required.' });

  const { rows: apiMoviesRows, error: apiMoviesError } = await insertApiMovies(movies);

  if (apiMoviesError) return Response.json({ error: `[api_movies]: Failed to insert: ${apiMoviesError}` });

  const { rows: moviesRows, error: moviesError } =  await insertMovies(user, apiMoviesRows);

  if (moviesError) return Response.json({ error: `[movies]: Failed to insert: ${moviesError}` });

  return Response.json({ movies: moviesRows });
}
