import { pool } from '@/lib/pg';
import { auth0 } from '@/lib/auth0';
import { Resend } from 'resend';
import Invite from '@/components/emails/Invite';

async function send(pool, userAddedListId, user, selectedUser) {
  const usersValues = [selectedUser.user_id, userAddedListId];
  const usersSql =
    'select * from user_added_list_has_users where auth0_user_id=$1 and user_added_list_id=$2';
  const { rows: usersRows } = await pool.query(usersSql, usersValues);

  if (usersRows[0]) return;

  const invitesValues = [userAddedListId, user.sub, selectedUser.user_id];
  const invitesSql =
    'insert into invites (user_added_list_id, sender_auth0_user_id, receiver_auth0_user_id) values ($1, $2, $3) returning *';
  const { rows: invitesRows } = await pool.query(invitesSql, invitesValues);

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = resend.emails.send({
    from: 'FilmFest <filmfest@husseinfawaz.ca>',
    to: selectedUser.email,
    subject: 'List Invitation',
    react: Invite({
      sender: user,
      receiver: selectedUser,
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
    return Response.json({ error: '[userAddedListId] and [selectedUsers] required.' });

  const promises = [];
  selectedUsers.forEach((selectedUser) =>
    promises.push(send(pool, userAddedListId, user, selectedUser))
  );
  await Promise.all(promises);

  return Response.json({ message: 'Success!' });
}
