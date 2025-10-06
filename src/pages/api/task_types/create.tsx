import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';
import { Task_types } from '@/models/database'; // Assuming Database.ts contains your types
import { v4 as uuidv4 } from 'uuid';
import { decrypt } from '@/lib/session';
import { parse } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {


  if (req.method === 'PUT') {
    const data = req.body;

    // Validate required fields
    if (
      !data ||
      data.typeName === undefined ||
      data.idx === undefined
    ) {
      return res.status(400).json({ message: 'Missing task_types values' });
    }

    try {
      const { typeName, idx } = data;
      const cookies = parse(req.headers.cookie || "");
      const session = cookies.session; // your encrypted token
      const sessionData = session? await decrypt(session):null;

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO task_types (type_id, type_name, idx, user_id) VALUES (?,?,?,?)',
        [`column-${uuidv4()}`, typeName ,idx, sessionData?.userId]
      );

      res.status(200).json({
        message: 'type added successfully',
        result,
      });
    }  catch (error: unknown) {
        console.error(`Error creating type:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error creating type`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error creating type`,
            error: 'Unknown error occurred',
          });
        }
    }

  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
