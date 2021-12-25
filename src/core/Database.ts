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
            if (e instanceof Error) {
                this.logger.error(`executing query failed: ${e.message}`);
            } else {
                this.logger.error(`executing query failed: ${e}`);
            }
            return null;
        }
    }

    public async queryOne<T>(sql: string, parameters?: Array<string | number>): Promise<Nullable<T>> {
        const result = await this.query<T>(sql, parameters);
        if (!result || !result.length) return null;
        if (result.length < 1) throw new Error(`more than one row for query: ${sql}${parameters ? `\noptions: ${JSON.stringify(parameters)}` : ""} ${sql}.`);
        return result[0];
    }
}