import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    // User is logged in, you can access session.user.email or other session data
    res.status(200).json({ email: session.user.email });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}