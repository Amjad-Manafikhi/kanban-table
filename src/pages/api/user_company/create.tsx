import { parse } from 'cookie';
import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '@/lib/session';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {


  if (req.method === 'POST') {
    const { companyId, userId, ownerId } = req.body;

    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const data = session ? await decrypt(session) : null;
    const sessionUserId = data?.userId;

    if (sessionUserId !== parseInt(ownerId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate required fields
    if (
      companyId === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({ message: 'Missing user_company values' });
    }
    try {

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO user_company (company_id, user_id ) VALUES (?,?)',
        [companyId, userId]
      );

      res.status(200).json({
        message: 'user_company added successfully',
        result,
      });
    } catch (error: unknown) {
      console.error(`Error creating user_company:`, error);

      if (error instanceof Error) {
        res.status(500).json({
          message: `Error creating user_company`,
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: `Error creating user_company`,
          error: 'Unknown error occurred',
        });
      }
    }

  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
