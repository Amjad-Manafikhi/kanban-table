import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from '@/models/database';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | { message: string; error: string }>
) {

  
  if (req.method === 'GET') {
    const {userId, company} = req.query;
       try {
      const sql = userId
        ? "SELECT * FROM tasks WHERE user_id = ? ORDER BY idx"
        :  "SELECT * FROM tasks WHERE company_id = ? ORDER BY idx"
      

      const tasks = await query(sql, userId ? [userId] :  [company] );

      res.status(200).json(tasks as Task[]);
    } catch (error: unknown) {
        console.error('Error creating task:', error);

        if (error instanceof Error) {
          res.status(500).json({
            message: 'Error creating task',
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Error creating task',
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
