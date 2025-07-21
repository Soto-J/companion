import "dotenv/config";

import { drizzle } from "drizzle-orm/mysql2";

import mysql from "mysql2/promise";

const URL = process.env.DATABASE_URL;

if (!URL) {
  throw Error("Database URL not found!");
}

const pool = mysql.createPool({
  uri: URL,
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(pool);
