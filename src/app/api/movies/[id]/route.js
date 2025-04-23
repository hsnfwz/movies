import { auth0 } from "@/lib/auth0";
import { pool } from "@/lib/pg";

export async function PUT(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { rating } = await request.json();

  if (rating === null || rating === undefined)
    return Response.json({ error: '[rating] required.' });

  const { id } = await params;

  const values = [rating, id];
  const sql = 'update movies set rating=$1 where id=$2 returning *';
  const { rows } = await pool.query(sql, values);

  return Response.json({ movie: rows[0] });
}