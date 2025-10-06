import mysql, { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2/promise";

const connectionConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
};

const pool = mysql.createPool(connectionConfig);

// T = RowDataPacket[] is default for SELECT queries
export async function query<T = RowDataPacket[]>(
  sql: string,
  params?: Array<string | number | boolean | null>
): Promise<T> {
  try {
    const [rows] = await pool.query<T & RowDataPacket[]>(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
  