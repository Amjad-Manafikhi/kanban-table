import mysql from "mysql2/promise";

const connectionConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
};

const pool = mysql.createPool(connectionConfig);

// ✅ Simpler generic, works for any type (rows or results)
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
