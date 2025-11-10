import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from './../../../types/next.d.ts';
import { query } from "@/lib/db"; // your mysql2 helper
import { initSocket }  from "@/lib/socketServer";
import { emitExceptSender } from "../helper";
import { Task } from "@/models/database.jsx";



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("updating..");
  try {
    

    
    const { alignments, overColumnId, activeTaskId, socketId} = req.body;
    console.log("bnbnb",alignments);
    
    const updatePromises = alignments.map((alignment:{id:string}, index:number) => {
      const val = alignment?.id;
      if (val !== undefined) {
        return query(
          "UPDATE tasks SET idx = ? WHERE task_id = ?",
          [index+1, val]
        );
      }
      return Promise.resolve();
    });
    const typeUpdatePromise = query(
      "UPDATE tasks SET type_id = ? WHERE task_id = ?",
      [overColumnId, activeTaskId]
    );

    updatePromises.push(typeUpdatePromise);


    await Promise.all(updatePromises);
    const [updatedTask] = (await query(
      "SELECT tasks.*, tags.color, tags.tag_id, tags.tag_name FROM tasks JOIN tags ON tasks.tag_id = tags.tag_id WHERE tasks.task_id = ?",
      [activeTaskId]
    )) as Task[];
    
    const io = initSocket(res);
    emitExceptSender({
      io:io, 
      socketId:socketId,
      event: "task-updated",
      data:updatedTask
    });

    return res.status(200).json({ success: true, task:updatedTask});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating rows" });
  }
}
