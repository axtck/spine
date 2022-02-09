import { createPoolConnection } from "./../lib/database/createConnections";
import { lazyHandleException } from "../lib/functions/exceptionHandling";
import { createDatabaseIfNotExists } from "../lib/database/createDatabaseIfNotExists";
import { Logger } from "./Logger";
import { Nullable } from "./../types";
import { Pool } from "mysql2/promise";
import { DbQueryResult } from "./types";

export class Database {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    public async query<T>(sql: string, parameters?: Array<string | number>): Promise<Nullable<DbQueryResult<T[]>>> {
        try {
            this.logger.info(`executing query: ${sql}${parameters ? `\noptions: ${JSON.stringify(parameters)}` : ""}`);

            const pool: Pool = await createPoolConnection();
            const [result] = await pool.query<DbQueryResult<T[]>>(sql, parameters);

            if (!result || !result.length) return null;
            return result;
        } catch (e) {
            lazyHandleException(e, "executing query failed", this.logger);
            return null;
        }
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
}