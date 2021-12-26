import mysql, { Connection } from "mysql2/promise";
import { Logger } from "../../../core/Logger";
import fs from "fs";
import { penv } from "../../../config/penv";

export const executeSqlFromFile = async (sqlFilePath: string): Promise<void> => {
    const logger: Logger = new Logger();
    try {
        // specify database and allow multiple statements for initialization
        const connection: Connection = await mysql.createConnection({
            host: penv.db.mysqlHost,
            port: penv.db.mysqlPort,
            user: penv.db.mysqlUser,
            password: penv.db.mysqlPw,
            database: penv.db.mysqlDb,
            multipleStatements: true
        });

        const splitted: string[] = sqlFilePath.split(".");
        const extension: string = splitted[splitted.length - 1];
        if (extension !== "sql") throw new Error("file should have '.sql' extension");

        const sql: string = fs.readFileSync(sqlFilePath).toString();
        await connection.query(sql);
        logger.debug(`executing query from file succeeded: ${sql}`);
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`executing query from file failed: ${e.message}`);
        } else {
            logger.error(`executing query from file failed: ${e}`);
        }
    }
};