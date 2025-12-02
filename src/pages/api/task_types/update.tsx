import type { NextApiRequest } from "next";
import { query } from "@/lib/db"; // your mysql2 helper
import { NextApiResponseServerIO } from "@/types/next";

import { emitExceptSender } from "../helper";
import { Task_types } from "@/models/database";
import apiAuth from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const authorized = await apiAuth(req);
    if(!authorized){
      return res.status(401).json({ message: 'Unauthorized' }); 
  }
  try {
    
    
    const { alignments , activeId, overId, socketId} = req.body;

    const updatePromises = alignments.map((alignment:{id:string}, index:number) => {
      const val = alignment?.id;
      if (val !== undefined) {
        return query(
          "UPDATE task_types SET idx = ? WHERE type_id = ?",
          [index+1, val]
        );
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);


    const updatedTaskTypes = (await query("SELECT * FROM task_types ORDER BY idx")) as Task_types[];

    emitExceptSender({
      socketId:socketId,
      event: "task-type-updated",
      data:{activeId,overId}
    });
    
    return res.status(200).json({ success: true, data: updatedTaskTypes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating columns" });
  }
}
