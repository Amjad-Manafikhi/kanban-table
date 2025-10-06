import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { encrypt } from './../../../lib/session';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const encryptedSessionData = await encrypt({ userId, expiresAt });

  const cookie = serialize('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Successfully set cookie!' });
}
