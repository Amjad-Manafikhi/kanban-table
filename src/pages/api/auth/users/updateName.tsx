import { query } from '../../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {
  if (req.method === 'POST') {



    try {
      const { firstName, secondName, userId} = req.body;
      const result = await query(
      'UPDATE users SET firstName = ?, secondName = ? WHERE email = ?',
      [firstName, secondName, userId]
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
