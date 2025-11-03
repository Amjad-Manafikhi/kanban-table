import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from "next";
import { Task_types } from '@/models/database';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task_types[] | { message: string; error: string }>
) {

  

  if (req.method === 'GET') {
    const { userId } = req.query
    try {
      const taskTypes = await query(
        'SELECT * FROM task_types WHERE user_id = ? order by idx', [userId]
      );

      res.status(200).json(taskTypes as Task_types[]);
    } catch (error: unknown) {
        console.error('Error creating task_types:', error);

        if (error instanceof Error) {
          res.status(500).json({
            message: 'Error creating task_types',
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Error creating task_types',
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
