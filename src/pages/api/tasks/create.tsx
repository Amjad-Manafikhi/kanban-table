import { query } from '../../../lib/db'; // Adjust path if needed
import type { NextApiRequest } from 'next';
import { Task } from '@/models/database'; // Assuming Database.ts contains your types
import { parse } from "cookie";
import { decrypt } from "@/lib/session";
import { v4 as uuidv4 } from 'uuid';
import { NextApiResponseServerIO } from '@/types/next';
import { emitExceptSender } from '../helper';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {


  if (req.method === 'PUT') {
    const {newTask, socketId} = req.body;
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
      const { type_id, title, description, idx, tag_id, company_id } = newTask;
      const cookies = parse(req.headers.cookie || "");
      const session = cookies.session; // your encrypted token
      const data = session? await decrypt(session):null;
      const userId = data?.userId;
      const uuid = uuidv4();

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO tasks (task_id, user_id, type_id, title, description, created_at, idx, company_id, tag_id ) VALUES (?,?,?,?,?,?,?,?,?)',
        [`task-${uuid}`, company_id ? 17 : userId, type_id, title, description, date, idx, company_id || 21, tag_id ]
      );

      const NewTask :Task={
        task_id:`task-${uuid}`,
        user_id:data?.userId || 0,
        type_id:type_id,
        title:title,
        description:description,
        date:date,
        idx:idx,
        company_id:1,
        tag_id:tag_id,
      }

      emitExceptSender({
        socketId:socketId,
        event: "task-created",
        data:NewTask
      });

      
      
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
