import { existsSync } from "node:fs";
import { join } from "node:path";
import { DataSource } from "typeorm";
import { databaseEnvSchema } from "../config/env.schema.js";
import { buildTypeOrmOptions } from "./typeorm.options.js";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const env = databaseEnvSchema.parse(process.env);

export default new DataSource({
  ...buildTypeOrmOptions(env.DATABASE_URL),
  entities: [join(import.meta.dirname, "..", "**", "*.entity.js")],
});
