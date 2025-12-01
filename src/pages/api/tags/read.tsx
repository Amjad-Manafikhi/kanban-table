import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';
import { decrypt } from '@/lib/session';
import { Company } from '@/models/database';
import apiAuth from '@/lib/apiAuth';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Company[] | { message: string; error?: string }>
) {
  
  if (req.method === 'GET') {

    const authorized = await apiAuth(req);
      if(!authorized){
        return res.status(401).json({ message: 'Unauthorized'}); 
    }

    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const data = session? await decrypt(session):null;
    const userId = data?.userId
    const company_id=req.query.company;
    try {
      const sql = company_id ?"SELECT tag_id, tag_name, color FROM tags WHERE company_id = ?":
        "SELECT tag_id, tag_name, color FROM tags WHERE user_id = ?"
      
      console.log({company_id})
      const companies = await query(sql, company_id ? [company_id] : [userId] );

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
