import pkg from 'pg';
import { auth0 } from '@/lib/auth0';
import { Resend } from 'resend';
import Invite from '@/components/emails/Invite';

async function send(pool, listId, user, listUser) {
  const listUsersValues = [listUser.user_id, listId];
  const listUsersSql =
    'select * from list_users where auth0_user_id=$1 and list_id=$2';
  const { rows: listUsersRows } = await pool.query(
    listUsersSql,
    listUsersValues
  );

  if (listUsersRows[0]) return;

  const invitesValues = [listId, user.sub, listUser.user_id];
  const invitesSql =
    'insert into list_invites (list_id, sender_auth0_user_id, receiver_auth0_user_id) values ($1, $2, $3) returning *';
  const { rows: invitesRows } = await pool.query(invitesSql, invitesValues);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = resend.emails.send({
    from: 'FilmFest <filmfest@husseinfawaz.ca>',
    to: listUser.email,
    subject: 'List Invitation',
    react: Invite({ sender: user, receiver: listUser, inviteId: invitesRows[0].id }),
  });

  if (error) return;
}

export async function POST(request) {
  const { listId, listUsers } = await request.json();

  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });
  if (!listId || !listUsers || Object.keys(listUsers).length === 0)
    return Response.json({ error: 'List ID and List Users required.' });

  const pool = new pkg.Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });

  const promises = [];
  Object.values(listUsers).forEach((listUser) =>
    promises.push(send(pool, listId, user, listUser))
  );
  await Promise.all(promises);

  return Response.json({ message: 'Success!' });
}
