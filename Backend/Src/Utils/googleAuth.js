const { OAuth2Client } =require ('google-auth-library');

const CLIENT_ID = '956795060962-mi9ksasd1vak12l93siihfspuhusjh2s.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload; // Contains user info like email, name, and picture
};
