import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

export async function GET(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const values = [user.sub];
  const query = `
    SELECT
      movies.id as movie_id,
      movies.title,
      movies.year,
      movies.poster_path,
      movies.imdb_id,
      movies.tmdb_id,
      user_added_movies.id as user_added_movie_id,
      user_added_movies.rating as user_added_movie_rating,
      user_added_movies.auth0_user_id as user_added_movie_auth0_user_id
    FROM movies
    INNER JOIN user_added_movies ON movies.id=user_added_movies.movie_id
    WHERE auth0_user_id=$1
  `;
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}

async function insertUserAddedMovies(user, movies) {
  const values = [];
  const placeholders = movies
    .map((movie, i) => {
      const index = i * 3;
      values.push(user.sub, movie.id, movie.rating);
      return `($${index + 1}, $${index + 2}, $${index + 3})`;
    })
    .join(', ');

  const query = `
    INSERT INTO user_added_movies (auth0_user_id, movie_id, rating)
    VALUES ${placeholders}
    ON CONFLICT ON CONSTRAINT user_movie_id DO NOTHING
    RETURNING *
  `;

  await pool.query(query, values);

  const movieIds = movies.map((movie) => movie.id);

  const values2 = [movieIds, user.sub];
  const query2 = `
      SELECT
        movies.id as movie_id,
        movies.title,
        movies.year,
        movies.poster_path,
        movies.imdb_id,
        movies.tmdb_id,
        user_added_movies.id as user_added_movie_id,
        user_added_movies.rating as user_added_movie_rating,
        user_added_movies.auth0_user_id as user_added_movie_auth0_user_id
      FROM user_added_movies
      INNER JOIN movies ON movies.id=user_added_movies.movie_id
      WHERE movie_id = ANY($1) AND auth0_user_id=$2
  `;

  return await pool.query(query2, values2);
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { movies } = await request.json();

  if (!movies || movies.length === 0)
    return Response.json({ error: '[movies] required.' });

  const { rows, error } = await insertUserAddedMovies(user, movies);

  if (error)
    return Response.json({
      error: `[user_added_movies]: Failed to insert: ${error}`,
    });

  return Response.json({ rows });
}
