import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db"; // your mysql2 helper

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {

    
    const { alignments } = req.body;

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
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating rows" });
  }
}
