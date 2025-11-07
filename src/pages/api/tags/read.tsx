import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';
import { decrypt } from '@/lib/session';
import { Company } from '@/models/database';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Company[] | { message: string; error: string }>
) {
  
  if (req.method === 'GET') {
    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const data = session? await decrypt(session):null;
    const userId = data?.userId
    try {
      const sql = "SELECT T.tag_id, T.tag_name, T.color FROM tags T JOIN users U ON T.user_id = U.user_id WHERE U .user_id = ?"
        
      

      const companies = await query(sql, [userId]  );

      res.status(200).json(companies as Company[]);
    } catch (error: unknown) {
        console.error('Error reading companies:', error);

        if (error instanceof Error) {
          res.status(500).json({
            message: 'Error reading companies',
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Error reading companies',
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
