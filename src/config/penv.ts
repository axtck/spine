import * as dotenv from "dotenv";
dotenv.config();

export const penv = {
    app: {
        port: Number(process.env.PORT) || 3001,
        environment: process.env.NODE_ENV || "development"
    },
    db: {
        mysqlHost: process.env.MYSQL_HOST,
        mysqlPort: Number(process.env.MYSQL_PORT) || undefined,
        mysqlDb: process.env.MYSQL_DATABASE,
        mysqlUser: process.env.MYSQL_USER,
        mysqlPw: process.env.MYSQL_PASSWORD
    },
    auth: {
        jwtAuthkey: process.env.JWT_AUTHKEY
    }
};
