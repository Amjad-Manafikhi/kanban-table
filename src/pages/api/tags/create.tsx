import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '@/lib/session';
import { parse } from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import apiAuth from '@/lib/apiAuth';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {


  if (req.method === 'PUT') {
    const authorized = await apiAuth(req);
    if(!authorized){
      return res.status(401).json({ message: 'Unauthorized' }); 
    }

    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const sessionData = session? await decrypt(session):null;
    const userId = sessionData?.userId;
    const { tagName, color, company_id } = req.body.newTag;
    const uuid = uuidv4(); 
    // Validate required fields
    if (
      tagName  === undefined ||
      color  === undefined 
    ) {
      return res.status(400).json({ message: 'Missing user_company values' });
    }
    try {

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO tags (tag_id, tag_name, color, user_id, company_id ) VALUES (?,?,?,?,?)',
        [uuid, tagName, color, company_id ? 17 : userId, company_id||21 ]
      );

      res.status(200).json({
        message: 'user_company added successfully',
        result,
      });
    }  catch (error: unknown) {
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
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
