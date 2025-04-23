import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new Auth0Client({
  appBaseUrl: process.env.APP_BASE_URL,
  domain: process.env.AUTH0_DOMAIN,
  secret: process.env.AUTH0_SECRET,
  clientId: process.env.AUTH0_REGULAR_APP_CLIENT_ID,
  clientSecret: process.env.AUTH0_REGULAR_APP_CLIENT_SECRET,
});

export { auth0 };
