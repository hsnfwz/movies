import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const values = [user.sub];
  const sql = 'select * from lists where auth0_user_id=$1';
  const { rows } = await pool.query(sql, values);

  return Response.json({ lists: rows });
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { name } = await request.json();

  if (!name) return Response.json({ error: '[name] required.' });

  const values = [user.sub, name];
  const query =
    'insert into lists (auth0_user_id, name) values ($1, $2) returning *';
  const { rows } = await pool.query(query, values);

  return Response.json({ list: rows[0] });
}
