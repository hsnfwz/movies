export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const username = searchParams.get('username');

  if (!username) return Response.json({ error: '[username] required.' });

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
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users?q=username:*${username}*&search_engine=v3`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const users = await response.json();

  return Response.json({ users });
}
