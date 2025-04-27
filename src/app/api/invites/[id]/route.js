import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/pg';

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ errror: 'Authentication required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

  const values = [id, user.sub];
  const query =
    'select * from invites where id=$1 and receiver_auth0_user_id=$2';
  const { rows } = await pool.query(query, values);

  return Response.json({ rows });
}

export async function PUT(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ errror: 'Authentication required.' });

  const { expiredAt } = await request.json();

  if (!expiredAt) return Response.json({ error: '[expiredAt] required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

  const values = [expiredAt, id];
  const query = 'update invites set expired_at=($1) where (id)=($2)';
  await pool.query(query, values);

  return Response.json({ message: 'Success!' });
}
