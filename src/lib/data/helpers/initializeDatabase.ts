import { Logger } from "./../../../core/Logger";
import mysql, { Connection } from "mysql2/promise";
import { executeSqlFromFile } from "./dbHelpers";
import path from "path";
import { penv } from "../../../config/penv";
import { DbQueryResult } from "../../../core/types";

export const createDatabaseIfNotExists = async (dbName: string): Promise<void | { exists: boolean; }> => {
    const logger: Logger = new Logger();
    try {
        // don't specify database
        const connection: Connection = await mysql.createConnection({
            host: penv.db.mysqlHost,
            port: penv.db.mysqlPort,
            user: penv.db.mysqlUser,
            password: penv.db.mysqlPw
        });

        const [dbs] = await connection.execute<DbQueryResult<unknown[]>>(`SHOW DATABASES LIKE '${penv.db.mysqlDb}'`);

        if (dbs && dbs.length) {
            logger.debug(`database '${penv.db.mysqlDb}' not created (exists)`);
            return {
                exists: true
            };
        }

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        logger.debug(`created database '${dbName}'`);
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`creating database failed: ${e.message}`);
        } else {
            logger.error(`creating database failed: ${e}`);
        }
    }
};

export const createInitialTables = async (): Promise<void> => {
    const sqlFile = path.join(".", "database", "createInitialTables.sql");
    await executeSqlFromFile(sqlFile);
};