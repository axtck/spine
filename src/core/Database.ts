import mysql, { Pool } from "mysql2/promise";
import penv from "../config/penv";
import { DbQueryResult, IDatabase, ILogger, IQueryError } from "./types";

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
            console.log(e);
            this.logger.error("Error creating / connecting pool.");
            throw new Error("Something went wrong creating pool.");
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
            // get rows
            const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, options);
            return result;
        } catch (e) {
            if (e instanceof Error) {
                const queryErr = e as unknown as IQueryError;
                this.logger.error(JSON.stringify(queryErr));
                return null;
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