import dotenv from "dotenv";
import { Pool } from "pg";

// load environment variables from .env
dotenv.config();

// shared connection pool for the app
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// query helper with generic result typing
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}
