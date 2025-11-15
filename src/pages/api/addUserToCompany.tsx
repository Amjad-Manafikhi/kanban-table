import { query } from '../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {

  if (req.method === 'POST') {
    const { companyId, userEmail } = req.body;

    // ✅ Validate required fields
    if (companyId === undefined || userEmail === undefined) {
      return res.status(400).json({ message: 'Missing user values' });
    }

    try {
      // ✅ 1. Get userId using email
      const result = await query(
        'SELECT user_id FROM users WHERE email = ?',
        [userEmail]
      );
      console.log(userEmail);

      const userId =  Array.isArray(result) && result?.length > 0 ?
       "user_id" in result[0] ? result[0].user_id : null 
       : null;

      if (!userId) {
        return res.status(404).json({message: 'Error creating user', error: 'User not found' });
      }

      // ✅ 2. Insert into user_company
      const insertResult = await query(
        'INSERT INTO user_company (user_id, company_id) VALUES (?, ?)',
        [userId, companyId]
      );

      // ✅ 3. Success
      return res.status(200).json({
        message: 'User added successfully',
        result: insertResult,
      });

    } catch (error: unknown) {
      console.error(`Error creating user:`, error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: 'Error creating user',
          error: error.message,
        });
      } else {
        return res.status(500).json({
          message: 'Error creating user',
          error: 'Unknown error occurred',
        });
      }
    }

  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
