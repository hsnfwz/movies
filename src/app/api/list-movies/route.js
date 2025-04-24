import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

async function insertListMovies(listId, movies) {
  if (movies.length === 0) return;

  const values = [];
  const placeholders = movies
    .map((movie, i) => {
      const index = i * 3;
      values.push(listId, movie.id, movie.api_movie_id);
      return `($${index + 1}, $${index + 2}, $${index + 3})`;
    })
    .join(', ');

  const query = `INSERT INTO list_movies (list_id, movie_id, api_movie_id) VALUES ${placeholders} ON CONFLICT ON CONSTRAINT list_movie_id DO NOTHING returning *`;

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

  const { listId, movies } = await request.json();

  if (!listId || !movies || movies.length === 0)
    return Response.json({ error: '[listId] and [movies] required.' });

  const { rows: moviesRows, error: moviesError } = await insertListMovies(
    listId,
    movies
  );

  if (moviesError)
    return Response.json({
      error: `[list_movies]: Failed to insert: ${moviesError}`,
    });

  return Response.json({ message: 'Success!' });
}
