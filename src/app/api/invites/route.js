import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';
import { Resend } from 'resend';
import Invite from '@/components/emails/Invite';

async function send(pool, listId, user, invitedUser) {
  const usersValues = [invitedUser.user_id, listId];
  const usersSql =
    'select * from list_users where auth0_user_id=$1 and list_id=$2';
  const { rows: usersRows } = await pool.query(usersSql, usersValues);

  if (usersRows[0]) return;

  const invitesValues = [listId, user.sub, invitedUser.user_id];
  const invitesSql =
    'insert into list_invites (list_id, sender_auth0_user_id, receiver_auth0_user_id) values ($1, $2, $3) returning *';
  const { rows: invitesRows } = await pool.query(invitesSql, invitesValues);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = resend.emails.send({
    from: 'FilmFest <filmfest@husseinfawaz.ca>',
    to: invitedUser.email,
    subject: 'List Invitation',
    react: Invite({
      sender: user,
      receiver: invitedUser,
      inviteId: invitesRows[0].id,
    }),
  });

  if (error) return;
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { listId, users } = await request.json();

  if (!listId || !users || users.length === 0)
    return Response.json({ error: '[listId] and [users] required.' });

  const promises = [];
  users.forEach((invitedUser) =>
    promises.push(send(pool, listId, user, invitedUser))
  );
  await Promise.all(promises);

  return Response.json({ message: 'Success!' });
}
