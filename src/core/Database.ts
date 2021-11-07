import { transformJSON } from "./../lib/functions/logging";
import mysql, { Pool } from "mysql2/promise";
import penv from "../config/penv";
import { DbQueryResult, IDatabase, ILogger } from "./types";

export class Database implements IDatabase {
    logger: ILogger;
    pool: Pool;

    constructor(logger: ILogger) {
        this.logger = logger;
        try {
            // create pool
            this.pool = mysql.createPool({
                host: penv.mysqlHost,
                port: penv.mysqlPort,
                user: penv.mysqlUser,
                password: penv.mysqlPw,
                database: penv.mysqlDb
            });
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Something went wrong creating pool.\nMessage: ${e.message}`);
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
    async query<T>(sql: string, options?: unknown): Promise<DbQueryResult<T[]> | null> {
        try {
            this.logger.info(`Executing query:\n${sql}${options ? `\nWith options:\n${JSON.stringify(options)}` : ""}`);
            const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, options);
            return result;
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Something went wrong executing query\nInfo:\n${transformJSON(e)}\nJSON:\n${JSON.stringify(e)}`);
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
    async queryOne<T>(sql: string, options?: unknown): Promise<T> {
        const result = await this.query<T>(sql, options);
        if (!result) {
            throw new Error(`No result for query ${sql}`);
        }
        if (result.length !== 1) {
            throw new Error(`More than one row for query ${sql}.`);
        }
        return result[0];
    }
}