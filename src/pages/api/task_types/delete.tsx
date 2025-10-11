import { initSocket } from '@/lib/socketServer';
import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Missing task_type ID' });
    }

    try {
      const result = await query('DELETE FROM task_types WHERE type_id = ?', [id]);

      const io = initSocket(res);      
      io.emit("task-type-deleted", id);

      return res.status(200).json({
        message: 'task deleted successfully',
        result,
      });

      res.status(200).json({
        message: 'task_type deleted successfully',
        result,
      });
      }catch (error: unknown) {
        console.error(`Error deleting task_type:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error deleting task_type`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error deleting task_type`,
            error: 'Unknown error occurred',
          });
        }
    }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


