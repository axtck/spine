import { lazyHandleException } from "../lib/functions/exceptionHandling";
import { createDatabaseIfNotExists, createInitialTables } from "../lib/database/helpers/initializeDatabase";
import { Logger } from "./Logger";
import { Nullable } from "./../types";
import mysql, { Pool } from "mysql2/promise";
import { penv } from "../config/penv";
import { DbQueryResult } from "./types";

export class Database {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    private createPool(): Pool {
        const pool = mysql.createPool({
            host: penv.db.mysqlHost,
            port: penv.db.mysqlPort,
            user: penv.db.mysqlUser,
            password: penv.db.mysqlPw,
            database: penv.db.mysqlDb
        });
        return pool;
    }

    public async query<T>(sql: string, parameters?: Array<string | number>): Promise<Nullable<DbQueryResult<T[]>>> {
        try {
            this.logger.info(`executing query: ${sql}${parameters ? `\noptions: ${JSON.stringify(parameters)}` : ""}`);

            const pool: Pool = this.createPool();
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
        const createResult: void | { exists: boolean; } = await createDatabaseIfNotExists(penv.db.mysqlDb);
        if (createResult && createResult.exists) return;
        await createInitialTables(); // if database didn't exist yet, create tables
    }
}