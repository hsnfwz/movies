import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { userAddedListId } = await request.json();

  if (!userAddedListId)
    return Response.json({ error: '[userAddedListId] required.' });

  const values = [userAddedListId, user.sub];
  const query =
    'insert into user_added_list_has_users (user_added_list_id, auth0_user_id) values ($1, $2)';
  await pool.query(query, values);

  return Response.json({ message: 'Success!' });
}
