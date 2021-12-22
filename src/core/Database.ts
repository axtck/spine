import { Logger } from "./Logger";
import { Nullable } from "./../types";
import mysql, { Pool } from "mysql2/promise";
import { penv } from "../config/penv";
import { DbQueryResult } from "./types";

export class Database {
    private readonly logger: Logger;
    pool: Pool;

    constructor() {
        this.logger = new Logger();
        try {
            // create pool
            this.pool = mysql.createPool({
                host: penv.db.mysqlHost,
                port: penv.db.mysqlPort,
                user: penv.db.mysqlUser,
                password: penv.db.mysqlPw,
                database: penv.db.mysqlDb
            });
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Creating pool failed.\nMessage: ${e.message}`);
            }
            throw e;
        }
    }

    /**
     * Perform a query against the database
     * @param {string} sql - SQL query to execute
     * @param {unknown=} options - options for query
     * @return {PromiseLike<DbQueryResult<T[]>>} - promise that resolves in an array of rows 
     */
    async query<T>(sql: string, options?: unknown): Promise<DbQueryResult<Nullable<T[]>>> {
        try {
            this.logger.info(`Executing query:\n${sql}${options ? `\nWith options:\n${JSON.stringify(options)}` : ""}`);
            const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, options);
            return result;
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Executing query failed. Info: ${JSON.stringify(e)}`);
            }
            throw e;
        }
    }

    /**
     * Perform a unique query against the database
     * @param {string} sql - SQL query to execute
     * @param {unknown=} options - options for query
     * @return {PromiseLike<T>} - promise that resolves in a single row 
     */
    async queryOne<T>(sql: string, options?: unknown): Promise<Nullable<T>> {
        const result = await this.query<T>(sql, options);
        if (!result?.length) {
            return null;
        }
        if (result.length < 1) {
            throw new Error(`More than one row for query ${sql}.`);
        }
        return result[0];
    }
}