import mysql, { Pool } from "mysql2/promise";
import penv from "../config/penv";
import { DbQueryResult, IDatabase, ILogger } from "./types";

export class Database implements IDatabase {
    logger: ILogger;
    pool: Pool;

    constructor(logger: ILogger) {
        this.logger = logger;

        try {
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

        this.pool.on("connection", () => {
            this.logger.info("Pool connected.");
        });

        this.pool.on("release", () => {
            this.logger.info("Pool released.");
        });
    }

    async query<T>(sql: string, options?: unknown): Promise<DbQueryResult<T[]>> {
        const [result] = await this.pool.query<DbQueryResult<T[]>>(sql, options);
        return result;
    }
}