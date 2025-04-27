import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

export async function GET(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const searchParams = request.nextUrl.searchParams;
  const userAddedListId = searchParams.get('userAddedListId');

  if (!userAddedListId)
    return Response.json({ error: '[userAddedListId] required.' });

  const moviesValues = [userAddedListId];
  const moviesQuery = `
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
    INNER JOIN user_added_list_has_movies ON movies.id=user_added_list_has_movies.movie_id
    WHERE user_added_list_has_movies.user_added_list_id=$1
  `;

  const { rows } = await pool.query(moviesQuery, moviesValues);

  return Response.json({ rows });
}

async function insertUserAddedListHasMovies(
  userAddedListId,
  userAddedMovies
) {
  if (userAddedMovies.length === 0) return;

  const values = [];
  const placeholders = userAddedMovies
    .map((selectedMovie, i) => {
      const index = i * 2;
      values.push(
        userAddedListId,
        selectedMovie.movie_id
      );
      return `($${index + 1}, $${index + 2})`;
    })
    .join(', ');

  const query = `
    INSERT INTO user_added_list_has_movies (user_added_list_id, movie_id) VALUES ${placeholders}
    ON CONFLICT ON CONSTRAINT list_movie_id DO NOTHING
  `;

  const { rows } = await pool.query(query, values);
  return { rows };
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { userAddedListId, userAddedMovies } = await request.json();

  if (!userAddedListId || !userAddedMovies || userAddedMovies.length === 0)
    return Response.json({
      error: '[userAddedListId] and [userAddedMovies] required.',
    });

  const { error } = await insertUserAddedListHasMovies(
    userAddedListId,
    userAddedMovies
  );

  if (error)
    return Response.json({
      error: `[user_added_list_has_movies]: Failed to insert: ${error}`,
    });

  return Response.json({ message: 'Success!' });
}
