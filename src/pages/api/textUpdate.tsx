import { initSocket }  from '@/lib/socketServer';
import { query } from '../../lib/db';
import type { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { emitExceptSender } from './helper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === 'PUT') {
    const { rowId, value, tableName, columnName, rowIdName, socketId} = req.body.queryData;
    const { id } =req.body;
    console.log("amjad",socketId)
    if (
      !rowId ||
      !rowIdName ||
      !value ||
      !columnName ||
      !tableName ||
      !socketId
    ) {
      return res.status(400).json({ message: 'Missing textUpdate values' });
    }

    try {

      const result = await query(
        `UPDATE ${tableName} SET ${columnName} = ? WHERE ${rowIdName} = ?`,
        [value, rowId]
      );

      const [updatedElement]: any = await query(`SELECT * FROM ${tableName} WHERE ${rowIdName} = ?`, [rowId]);
      console.log("activevvv", rowId);
      
      console.log("testSs",updatedElement);
      
      const io = initSocket(res);
      console.log(updatedElement)
  
      if(rowId[0]==='t'){
        console.log("updating",socketId);
        emitExceptSender({
          io:io, 
          socketId:socketId,
          event: "task-text-updated",
          data:{task:updatedElement, id:id}
        });
      }        
      else{ 
        emitExceptSender({
          io:io, 
          socketId:socketId,
          event: "column-text-updated",
          data:{type:updatedElement, id:id}
        });
      }
      res.status(200).json({
        message: 'Patient updated successfully',
        result,
      });
    } catch (error: unknown) {
        console.error(`Error updating ${columnName} in ${tableName}:`, error);

        if (error instanceof Error) {
          res.status(500).json({
            message: `Error updating ${columnName} in ${tableName}`,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: `Error updating ${tableName}`,
            error: 'Unknown error occurred',
          });
        }
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
