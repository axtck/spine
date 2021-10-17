import mysql, { Connection } from "mysql";
import penv from "../config/penv";
import { ILogger } from "./types";

export class Database {
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
}