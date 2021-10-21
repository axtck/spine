import mysql, { FieldPacket, Pool } from "mysql2";
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
            this.pool.getConnection(() => {
                console.log("Got connection");
            });
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

    async query<T>(sql: string, options?: unknown): Promise<[DbQueryResult<T>, mysql.FieldPacket[]]> {
        const result: Promise<[DbQueryResult<T>, FieldPacket[]]> = this.pool.promise().query<DbQueryResult<T>>(sql, options);
        return result;
    }
}