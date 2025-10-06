import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteSession } from '@/lib/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  deleteSession(res);
  res.status(200).json({ message: 'Logged out successfully' });
}
