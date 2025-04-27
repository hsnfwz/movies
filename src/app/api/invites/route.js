import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';
import { Resend } from 'resend';
import Invite from '@/components/emails/Invite';

async function send(pool, userAddedListId, sender, receiver) {
  const usersValues = [receiver.user_id, userAddedListId];
  const usersSql =
    'select * from user_added_list_has_users where auth0_user_id=$1 and user_added_list_id=$2';
  const { rows: usersRows } = await pool.query(usersSql, usersValues);

  if (usersRows[0]) return;

  const invitesValues = [userAddedListId, sender.sub, receiver.user_id];
  const invitesSql =
    'insert into invites (user_added_list_id, sender_auth0_user_id, receiver_auth0_user_id) values ($1, $2, $3) returning *';
  const { rows: invitesRows } = await pool.query(invitesSql, invitesValues);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = resend.emails.send({
    from: 'FilmFest <filmfest@husseinfawaz.ca>',
    to: receiver.email,
    subject: 'List Invitation',
    react: Invite({
      sender,
      receiver,
      inviteId: invitesRows[0].id,
    }),
  });

  if (error) return;
}

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { userAddedListId, selectedUsers } = await request.json();

  if (!userAddedListId || !selectedUsers || selectedUsers.length === 0)
    return Response.json({
      error: '[userAddedListId] and [selectedUsers] required.',
    });

  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MACHINE_TO_MACHINE_CLIENT_ID,
      client_secret: process.env.AUTH0_MACHINE_TO_MACHINE_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }),
  });

  const { access_token } = await res.json();

  const response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const sender = await response.json();

  const promises = [];
  selectedUsers.forEach((selectedUser) =>
    promises.push(send(pool, userAddedListId, sender, selectedUser))
  );
  await Promise.all(promises);

  return Response.json({ message: 'Success!' });
}
