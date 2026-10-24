import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://mock_user:mock_password@ep-mock-endpoint.neon.tech/neondb?sslmode=require";

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

