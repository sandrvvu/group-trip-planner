import { join } from "node:path";
import type { DataSourceOptions } from "typeorm";

export function buildTypeOrmOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: "postgres",
    url: databaseUrl,
    uuidExtension: "pgcrypto",
    synchronize: false,
    migrationsRun: false,
    migrations: [join(import.meta.dirname, "migrations", "*.js")],
  };
}
