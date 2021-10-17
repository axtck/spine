import mysql, { Connection, QueryOptions } from "mysql";
import penv from "../config/penv";
import { IDatabase, ILogger } from "./types";

export class Database implements IDatabase {
    public logger: ILogger;
    public connection: Connection;

    constructor(logger: ILogger) {
        this.logger = logger;
        const mysqlPort = isNaN(Number(penv.mysqlPort)) ? 3306 : Number(penv.mysqlPort);
        this.connection = mysql.createConnection({
            host: penv.mysqlHost,
            port: mysqlPort,
            user: penv.mysqlUser,
            password: penv.mysqlPw,
            database: penv.mysqlDb
        });
    }

    // async query(sql: string | QueryOptions, options?: unknown): Promise<unknown[] | unknown> {
    //     const result = this.connection.query(sql, options, (err, res) => {
    //         if (err) {
    //             this.logger.error(err.message);
    //             throw new Error("Mysql query");
    //         }
    //         return res;
    //     });

    //     return result;
    // }
}