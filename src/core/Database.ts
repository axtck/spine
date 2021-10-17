import mysql, { Pool } from "mysql2/promise";
import penv from "../config/penv";
import { IDatabase, ILogger } from "./types";

export class Database implements IDatabase {
    public logger: ILogger;
    public pool: Pool;

    constructor(logger: ILogger) {
        this.logger = logger;

        this.pool = mysql.createPool({
            host: penv.mysqlHost,
            port: penv.mysqlPort,
            user: penv.mysqlUser,
            password: penv.mysqlPw,
            database: penv.mysqlDb
        });

        this.pool.getConnection();
    }

    async query(sql: string, options?: unknown): Promise<unknown[] | unknown> {
        const [rows] = await this.pool.query(sql, options);
        if (!rows) throw new Error("qsdfqsdf");
        return rows;
    }
}