import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const values = [user.sub];
  const query = `SELECT
      user_added_lists.id,
      user_added_lists.name,
      user_added_lists.auth0_user_id
    FROM user_added_lists
    INNER JOIN user_added_list_has_users ON user_added_lists.id=user_added_list_has_users.user_added_list_id
    WHERE user_added_list_has_users.auth0_user_id=$1
  `;
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { name } = await request.json();

  if (!name) return Response.json({ error: '[name] required.' });

  const values = [user.sub, name];
  const query =
    'INSERT INTO user_added_lists (auth0_user_id, name) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, values);

  const userAddedListHasUsersValues = [rows[0].id, user.sub];
  const userAddedListHasUsersQuery =
    'INSERT INTO user_added_list_has_users (user_added_list_id, auth0_user_id) VALUES ($1, $2)';
  await pool.query(userAddedListHasUsersQuery, userAddedListHasUsersValues);

  return Response.json({ rows });
}
