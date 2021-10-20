import mysql, { Pool } from "mysql2/promise";
import penv from "../config/penv";
import { IDatabase, ILogger } from "./types";

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
            throw new Error("Something went wrong creating pool.");
        }

        this.pool.on("connection", () => {
            this.logger.info("Db received connection.");
        });

        this.pool.on("release", () => {
            this.logger.info("Db got released.");
        });
    }

    async query(sql: string, options?: unknown): Promise<any> {
        const [rows] = await this.pool.query(sql, options);
        return rows;
    }
}