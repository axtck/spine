import mysql, { Connection } from "mysql2/promise";
import { penv } from "../../config/penv";

export const noDatabaseSelectedConnection = async (): Promise<Connection> => {
    // don't specify database
    const connection: Connection = await mysql.createConnection({
        host: penv.db.mysqlHost,
        port: penv.db.mysqlPort,
        user: penv.db.mysqlUser,
        password: penv.db.mysqlPw
    });
    return connection;
};

export const multipleStatementsConnection = async (): Promise<Connection> => {
    // specify database and allow multiple statements for initialization
    const connection: Connection = await mysql.createConnection({
        host: penv.db.mysqlHost,
        port: penv.db.mysqlPort,
        user: penv.db.mysqlUser,
        password: penv.db.mysqlPw,
        database: penv.db.mysqlDb,
        multipleStatements: true
    });
    return connection;
};