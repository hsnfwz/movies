import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

async function insertMovies(selectedMovies) {
  const values = [];
  const placeholders = selectedMovies
    .map((selectedMovie, i) => {
      const index = i * 5;
      values.push(
        selectedMovie.title,
        selectedMovie.year,
        selectedMovie.poster_path,
        selectedMovie.tmdb_id,
        selectedMovie.imdb_id
      );
      return `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5})`;
    })
    .join(', ');

  const query = `
    WITH inserted AS (
      INSERT INTO movies (title, year, poster_path, tmdb_id, imdb_id)
      VALUES ${placeholders}
      ON CONFLICT (imdb_id) DO NOTHING
      RETURNING *
    )
    SELECT * FROM inserted
    UNION ALL
    SELECT * FROM movies
    WHERE imdb_id=$5
  `;

  return await pool.query(query, values);
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { selectedMovies } = await request.json();

  if (!selectedMovies || selectedMovies.length === 0)
    return Response.json({ error: '[selectedMovies] required.' });

  const { rows, error } = await insertMovies(selectedMovies);

  if (error)
    return Response.json({
      error: `[movies]: Failed to insert: ${error}`,
    });

  return Response.json({ rows });
}
