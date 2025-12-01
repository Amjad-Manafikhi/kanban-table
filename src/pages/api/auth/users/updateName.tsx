import { parse } from 'cookie';
import { query } from '../../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {
  if (req.method === 'POST') {

    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const data = session? await decrypt(session):null;
    const sessionUserId = data?.userId;

    try {
      const { firstName, secondName} = req.body;
      if(!sessionUserId){
        return res.status(401).json({ message: 'Unauthorized' }); 
      }
      const result = await query(
      'UPDATE users SET firstName = ?, secondName = ? WHERE user_id = ?',
      [firstName, secondName, sessionUserId]
      );

      res.status(200).json({
        message: 'user updated successfully',
        result,
      });
    } catch (error: unknown) {
        console.error(`Error updating user:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error updating user`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error updating user`,
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
