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
    const name= req.body.newTask;
    // Validate required fields
    if (
      name === undefined
    ) {
      return res.status(400).json({ message: 'Missing company values' });
    }
    const date = new Date
    try {

      // SQL query to insert a new Cases record
      const result = await query(
        'INSERT INTO companies (name) VALUES (?)',
        [name]
      );

      res.status(200).json({
        message: 'company added successfully',
        result,
      });
    }  catch (error: unknown) {
        console.error(`Error creating company:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error creating company`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error creating company`,
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
