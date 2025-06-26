import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

const URL = process.env.DATABASE_URL;

if (!URL) {
  throw Error("Database URL not found!");
}

export const db = drizzle(URL);
