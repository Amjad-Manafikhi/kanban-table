import apiAuth from '@/lib/apiAuth';
import { query } from '../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {


  if (req.method === 'POST') {
    const authorized = await apiAuth(req);
          if(!authorized){
            return res.status(401).json({ message: 'Unauthorized' }); 
    }
    const {companyName, userId}= req.body;
    // Validate required fields
    if (
      companyName === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({ message: 'Missing company values' });
    }
    try {

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO companies (name, owner_id) VALUES (?,?)',
        [companyName, userId]
      );
      


      res.status(200).json({
        message: 'company added successfully',
        result,
      });
    }  catch (error: unknown) {
        console.error(`Error creating company:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error creating company`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error creating company`,
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
