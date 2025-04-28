const { auth0 } = require("@/lib/auth0");

export async function GET(request, { params }) {
  const { user } = await auth0.getSession();

  if (!user) return Response.json({ error: 'Authentication required.' });

  const { id } = await params;

  if (!id) return Response.json({ error: '[id] required.' });

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
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await response.json();

  return Response.json({ rows: [{ username: data.username }] });
}