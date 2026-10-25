import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createVercelDatabase(connectionString: string) {
  return drizzle({ client: neon(connectionString), schema });
}
