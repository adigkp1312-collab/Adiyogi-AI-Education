import { neon } from "@neondatabase/serverless";

const databaseUrl =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or NETLIFY_DATABASE_URL must be set");
}

export const sql = neon(databaseUrl);
