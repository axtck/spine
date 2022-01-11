require("dotenv").config();
import { Environment } from "./../types";

if (process.env.NODE_ENV && !Object.values<string>(Environment).includes(process.env.NODE_ENV)) {
    throw new Error(`environment '${process.env.NODE_ENV}' invalid, possible environments: undefined (development) / development / staging / production`);
}

const environement: string = process.env.NODE_ENV || "development";
export const penv = {
    app: {
        port: Number(process.env.HOST_SERVER_PORT) || 3001,
        environment: environement
    },
    db: {
        mysqlHost: process.env.MYSQL_HOST,
        mysqlPort: Number(process.env.MYSQL_PORT) || undefined,
        mysqlDb: `${environement}db`,
        mysqlUser: process.env.MYSQL_USER,
        mysqlPw: process.env.MYSQL_PASSWORD
    },
    auth: {
        jwtAuthkey: process.env.JWT_AUTHKEY
    }
};
