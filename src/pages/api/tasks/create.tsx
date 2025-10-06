import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@/models/database'; // Assuming Database.ts contains your types
import { parse } from "cookie";
import { decrypt } from "@/lib/session";
import { v4 as uuidv4 } from 'uuid';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {


  if (req.method === 'PUT') {
    const newTask: Task = req.body.newTask;
    // Validate required fields
    console.log('test1',newTask);
    if (
      
      newTask.idx === undefined ||
      newTask.type_id === undefined ||
      newTask.title === undefined ||
      newTask.description === undefined
    ) {
      return res.status(400).json({ message: 'Missing task values' });
    }
    const date = new Date
    try {
      const { type_id, title, description, idx } = newTask;
      const cookies = parse(req.headers.cookie || "");
      const session = cookies.session; // your encrypted token
      const data = session? await decrypt(session):null;

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id ) VALUES (?,?,?,?,?,?,?,?)',
        [`task-${uuidv4()}`, data?.userId, type_id, title, description, date, idx, 1 ]
      );

      res.status(200).json({
        message: 'task added successfully',
        result,
      });
    }  catch (error: unknown) {
        console.error(`Error creating task:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error creating task`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error creating task`,
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
