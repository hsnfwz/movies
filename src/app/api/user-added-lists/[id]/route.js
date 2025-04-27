import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

  const values = [id, user.sub];
  const query = `SELECT
      user_added_lists.id,
      user_added_lists.name,
      user_added_lists.auth0_user_id
    FROM user_added_lists
    INNER JOIN user_added_list_has_users ON user_added_lists.id=user_added_list_has_users.user_added_list_id
    WHERE user_added_lists.id=$1 AND user_added_list_has_users.auth0_user_id=$2
  `;
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}

export async function PUT(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { name } = await request.json();

  if (!name) return Response.json({ error: '[name] required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

  const values = [name, id];
  const query =
    'UPDATE user_added_lists SET name = ($1) WHERE (id) = ($2) RETURNING id, name, auth0_user_id';
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}
