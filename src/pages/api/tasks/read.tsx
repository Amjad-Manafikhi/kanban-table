import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from '@/types/database';
import apiAuth from '@/lib/apiAuth';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | { message: string; error?: string }>
) {


  if (req.method === 'GET') {

    const authorized = await apiAuth(req);
    if (!authorized) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { userId, company } = req.query;
    try {
      const sql = userId
        ? "SELECT tasks.*, tags.color, tags.tag_id, tags.tag_name FROM tasks JOIN tags ON tasks.tag_id = tags.tag_id WHERE tasks.user_id = ? ORDER BY tasks.idx"
        : "SELECT tasks.*, tags.color, tags.tag_id, tags.tag_name FROM tasks JOIN tags ON tasks.tag_id = tags.tag_id WHERE tasks.company_id = ? ORDER BY tasks.idx;"


      const tasks = await query(sql, userId ? [userId] : [company]);
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
