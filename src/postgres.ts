import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { config } from "@common/config";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: config.DATABASE_URL,
    max: 8,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  log: ["query", "error"],
});
