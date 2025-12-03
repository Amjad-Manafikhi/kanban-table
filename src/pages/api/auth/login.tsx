import type { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '@/lib/auth';
import { createSession } from '@/lib/session';

type CustomError = Error & { type?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;


  if (

    email === undefined ||
    password === undefined
  ) {
    return res.status(400).json({ message: 'Missing login values' });
  }

  try {
    const user = await signIn('credentials', { email, password });

    // Set a session using real user ID
    await createSession(res, user.email);

    return res.status(200).json({ success: true });
  } catch (error) {
    const err = error as CustomError;
    if (err?.type === 'CredentialsSignin') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.error(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
