import "dotenv/config";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "@/drizzle/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
  schema,
  logger: true,
});

export default db;

// import "dotenv/config";
// import { Pool } from "pg";
// import { drizzle } from "drizzle-orm/node-postgres";
// import * as schema from "./schema";

// // Create PostgreSQL connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Initialize Drizzle with schema
// const db = drizzle(pool, {
//   schema,
//   logger: true, // set to false in production
// });

// export default db;