import { query } from '../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';
import { decrypt } from '@/lib/session';
import { Company } from '@/types/database';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Company[] | { message: string; error: string }>
) {

  if (req.method === 'GET') {
    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const data = session ? await decrypt(session) : null;
    const userId = data?.userId
    try {
      const sql = "SELECT * from companies where owner_id = ?"



      const companies = await query(sql, [userId]);

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
