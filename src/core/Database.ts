import { upgradeDatabase } from "./../lib/database/upgrade";
import { createDatabaseIfNotExists } from "../lib/database/createDatabaseIfNotExists";
import { Logger } from "./Logger";
import { Nullable } from "./../types";
import { Pool } from "mysql2/promise";
import { DbQueryResult } from "./types";

export class Database {
    private readonly pool: Pool;
    constructor(pool: Pool,
        private readonly logger: Logger = new Logger()) {
        this.pool = pool;
    }

    public async query<T>(sql: string, parameters?: Array<string | number | unknown>): Promise<DbQueryResult<T[]>> {
        this.logger.info(`executing query: ${sql}${parameters ? `\noptions: ${JSON.stringify(parameters)}` : ""}`);
        const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, parameters);
        return result;
    }

    public async queryOne<T>(sql: string, parameters?: Array<string | number>): Promise<Nullable<T>> {
        const result = await this.query<T>(sql, parameters);
        if (!result || !result.length) return null;
        if (result.length < 1) throw new Error(`more than one row for query: ${sql}${parameters ? `\noptions: ${JSON.stringify(parameters)}` : ""} ${sql}.`);
        return result[0];
    }

    public async createDatabase(): Promise<void> {
        await createDatabaseIfNotExists();
    }

    public async runMigrations(migrationsFolderPath: string, database: Database): Promise<void> {
        await upgradeDatabase(migrationsFolderPath, database);
    }
}