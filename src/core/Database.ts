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
            this.pool.getConnection();
        } catch {
            this.logger.error("Error creating / connecting pool.");
            throw new Error("Something went wrong creating pool.");
        }

        // pool listeners
        this.pool.on("connection", () => {
            this.logger.info("Pool connected.");
        });

        this.pool.on("release", () => {
            this.logger.info("Pool released.");
        });
    }


    /**
     * Perform a query against the database
     * @param {string} sql - SQL query to execute
     * @param {unknown=} options - options for query
     * @return {PromiseLike<DbQueryResult<T[]>>} - promise that resolves in an array of rows 
     */
    async query<T>(sql: string, options?: unknown): Promise<DbQueryResult<T[]>> {
        // get rows
        const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, options);
        return result;
    }

    /**
     * Perform a unique query against the database
     * @param {string} sql - SQL query to execute
     * @param {unknown=} options - options for query
     * @return {PromiseLike<T>} - promise that resolves in a single row 
     */
    async queryOne<T>(sql: string, options?: unknown): Promise<T> {
        const result = await this.query<T>(sql, options);
        if (result.length !== 1) {
            throw new Error(`More than one row for query ${sql}.`);
        }
        return result[0];
    }
}