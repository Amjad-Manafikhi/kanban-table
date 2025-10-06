import { query } from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; result?: unknown; error?: string }>
) {
  if (req.method === 'PUT') {
    const { rowId, value, tableName, columnName, rowIdName } = req.body;

    if (
      !rowId ||
      !rowIdName ||
      !value ||
      !columnName ||
      !tableName
    ) {
      return res.status(400).json({ message: 'Missing textUpdate values' });
    }

    try {

      const result = await query(
        `UPDATE ${tableName} SET ${columnName} = ? WHERE ${rowIdName} = ?`,
        [value, rowId]
      );

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
